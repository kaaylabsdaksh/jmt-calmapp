import React, { useState, useMemo } from "react";
import { format, isBefore, startOfDay, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Printer, FileText, Award, Database, ChevronDown, ChevronRight, MapPin, AlertTriangle, Zap, X, Clock, Truck, Package, Maximize2, Minimize2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// --- Types ---
interface PickupItem {
  woBatch: string;
  woNumber: string;
  division: string;
  manufacturer: string;
  model: string;
  description: string;
  invoiceNum?: string;
  dtNum?: string;
}

interface PickupGroup {
  id: string;
  type: "INV" | "DT" | "WO";
  number: string;
  invoiceDate?: string;
  priority: "EMERGENCY" | "EXPEDITE" | "RUSH" | "NORMAL";
  customerName: string;
  city: string;
  state: string;
  division: string;
  deliverBy: string;
  itemCount: number;
  assignedTo: string;
  items: PickupItem[];
}

// --- Mock Data ---
const mockItems: PickupItem[] = [
  { woBatch: "573100-001", woNumber: "573100", division: "Lab", manufacturer: "FLUKE", model: "87V", description: "DIGITAL MULTIMETER", invoiceNum: "989010" },
  { woBatch: "573100-002", woNumber: "573100", division: "Lab", manufacturer: "FLUKE", model: "724", description: "TEMPERATURE CALIBRATOR", invoiceNum: "989010" },
  { woBatch: "573110-001", woNumber: "573110", division: "Field", manufacturer: "PROTO", model: "6062C", description: 'TORQUE WRENCH 1/4"', dtNum: "41020" },
  { woBatch: "573110-002", woNumber: "573110", division: "Field", manufacturer: "PROTO", model: "6062D", description: 'TORQUE WRENCH 3/8"', dtNum: "41020" },
  { woBatch: "573120-001", woNumber: "573120", division: "Lab", manufacturer: "AMETEK", model: "RTC-159", description: "DRY BLOCK CALIBRATOR", invoiceNum: "989025" },
  { woBatch: "573120-002", woNumber: "573120", division: "Lab", manufacturer: "DRUCK", model: "DPI 611", description: "PRESSURE CALIBRATOR", invoiceNum: "989025" },
  { woBatch: "573120-003", woNumber: "573120", division: "Lab", manufacturer: "FLUKE", model: "726", description: "MULTIFUNCTION CALIBRATOR", invoiceNum: "989025" },
  { woBatch: "573130-001", woNumber: "573130", division: "Lab", manufacturer: "FLUKE", model: "754", description: "DOCUMENTING PROCESS CALIBRATOR", invoiceNum: "989030" },
  { woBatch: "573130-002", woNumber: "573130", division: "Lab", manufacturer: "ASHCROFT", model: '-30"Hg-0-60 PSI', description: "TEST GAUGE", invoiceNum: "989030" },
  { woBatch: "573140-001", woNumber: "573140", division: "Field", manufacturer: "HIOKI", model: "PW3198", description: "POWER QUALITY ANALYZER", invoiceNum: "989040" },
];

const groupMetadata: Record<string, Omit<PickupGroup, "id" | "items" | "itemCount">> = {
  "INV-989010": { type: "INV", number: "989010", invoiceDate: "Monday, March 16, 2026", priority: "NORMAL", customerName: "Shell Norco Refinery", city: "Norco", state: "LA", division: "Lab", deliverBy: "2026-03-22", assignedTo: "unassigned" },
  "DT-41020": { type: "DT", number: "41020", priority: "RUSH", customerName: "Performance Contractors", city: "Baton Rouge", state: "LA", division: "Field", deliverBy: "2026-03-19", assignedTo: "unassigned" },
  "INV-989025": { type: "INV", number: "989025", invoiceDate: "Wednesday, March 11, 2026", priority: "EMERGENCY", customerName: "Marathon Petroleum", city: "Garyville", state: "LA", division: "Lab", deliverBy: "2026-03-17", assignedTo: "unassigned" },
  "INV-989030": { type: "INV", number: "989030", invoiceDate: "Thursday, March 12, 2026", priority: "EXPEDITE", customerName: "CF Industries Donaldsonville", city: "Donaldsonville", state: "LA", division: "Lab", deliverBy: "2026-03-21", assignedTo: "unassigned" },
  "INV-989040": { type: "INV", number: "989040", invoiceDate: "Friday, March 13, 2026", priority: "NORMAL", customerName: "Entergy Louisiana", city: "Baton Rouge", state: "LA", division: "Field", deliverBy: "2026-03-28", assignedTo: "unassigned" },
};

function buildGroups(items: PickupItem[]): PickupGroup[] {
  const buckets = new Map<string, PickupItem[]>();

  for (const item of items) {
    if (!item.invoiceNum && !item.dtNum) continue;
    const key = item.invoiceNum ? `INV-${item.invoiceNum}` : `DT-${item.dtNum}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(item);
  }

  return Array.from(buckets.entries()).map(([key, groupItems]) => {
    const meta = groupMetadata[key] || {
      type: key.startsWith("INV") ? "INV" : key.startsWith("DT") ? "DT" : "WO",
      number: key.split("-")[1],
      priority: "NORMAL" as const,
      customerName: "Unknown",
      city: "Unknown",
      state: "",
      division: groupItems[0]?.division || "",
      deliverBy: "TBD",
      assignedTo: "unassigned",
    };

    return {
      id: key,
      ...meta,
      items: groupItems,
      itemCount: groupItems.length,
    };
  });
}

const mockGroups: PickupGroup[] = buildGroups(mockItems);

// --- Priority Badge Component ---
const PriorityBadge = ({ priority }: { priority: PickupGroup["priority"] }) => {
  if (priority === "NORMAL") return null;
  
  const config: Record<string, { icon: typeof AlertTriangle; className: string }> = {
    EMERGENCY: { icon: AlertTriangle, className: "bg-destructive text-white" },
    EXPEDITE: { icon: Zap, className: "bg-orange-500 text-white" },
    RUSH: { icon: Zap, className: "bg-yellow-500 text-white" },
  };
  
  const entry = config[priority];
  if (!entry) return null;
  const { icon: Icon, className } = entry;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}>
      <Icon className="w-3 h-3" />
      {priority}
    </span>
  );
};

// --- Pickup Group Card ---
const PickupGroupCard = ({ group, isPrinted, onPrint, forceOpen }: { group: PickupGroup; isPrinted?: boolean; onPrint?: (id: string) => void; forceOpen?: { value: boolean; key: number } | null }) => {
  const [isOpen, setIsOpen] = useState(!isPrinted);
  
  React.useEffect(() => {
    if (forceOpen) setIsOpen(forceOpen.value);
  }, [forceOpen]);
  const [assignedTo, setAssignedTo] = useState(group.assignedTo);

  const typeLabel = group.type === "INV" ? "Invoice" : group.type === "DT" ? "DT" : "WO";

  const isOverdue = (() => {
    try { return isBefore(parseISO(group.deliverBy), startOfDay(new Date())); }
    catch { return false; }
  })();

  const displayDate = (() => {
    try { return format(parseISO(group.deliverBy), "MMM d, yyyy"); }
    catch { return group.deliverBy; }
  })();

  const stripeColor = group.priority === "EMERGENCY"
    ? "bg-destructive"
    : group.priority === "EXPEDITE"
    ? "bg-orange-500"
    : group.priority === "RUSH"
    ? "bg-yellow-400"
    : "bg-border";

  const cardBorder = group.priority === "EMERGENCY"
    ? "border-destructive/30"
    : group.priority === "EXPEDITE"
    ? "border-orange-400/30"
    : group.priority === "RUSH"
    ? "border-yellow-400/30"
    : "border-border";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`bg-card rounded-md border ${cardBorder} overflow-hidden transition-all ${isPrinted ? "opacity-50 grayscale" : ""} flex`}>
        {/* Left priority stripe */}
        <div className={`w-[3px] shrink-0 ${stripeColor} rounded-l-md`} />

        <div className="flex-1 min-w-0">
        {/* Split two-column header */}
        <div className="px-3 py-2.5 flex items-center gap-4">
          {/* Left: Chevron + Info */}
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0 hover:bg-muted rounded mt-0.5">
                {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </Button>
            </CollapsibleTrigger>

            <div className="min-w-0 space-y-1">
              {/* Line 1: ID + Customer + Location + Division */}
              <div className="flex items-center gap-2 flex-wrap text-[12px]">
                <span className="whitespace-nowrap"><span className="text-muted-foreground font-normal">{typeLabel}</span> <span className="font-bold text-foreground">#{group.number}</span></span>
                <span className="text-muted-foreground/40">·</span>
                <span className="font-bold text-foreground truncate">{group.customerName}</span>
              </div>
              {/* Line 2: Pickup By + Items */}
              <div className="flex items-center gap-2 flex-wrap text-[12px]">
                <div className={`flex items-center gap-1 whitespace-nowrap`}>
                  <span className={`uppercase tracking-wider text-[9px] font-normal ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>Pickup By</span>
                  <span className={`font-bold ${isOverdue ? "text-destructive" : "text-foreground"}`}>{displayDate}</span>
                </div>
                <span className="text-muted-foreground/40">·</span>
                <span className="whitespace-nowrap">
                  <span className="font-bold text-foreground">{group.itemCount}</span> <span className="text-muted-foreground font-normal">items</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Priority pill + Assigned To + Printables */}
          <div className="flex flex-col items-end gap-2.5 shrink-0">
            <PriorityBadge priority={group.priority} />
            <div className="flex items-center gap-2">
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="h-7 w-[130px] text-[11px] rounded border-dashed">
                  <SelectValue placeholder="Assign To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="front-desk">Front Desk</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="will-call">Will Call</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Button size="sm" className="h-7 text-[11px] gap-1 rounded px-3" onClick={() => onPrint?.(group.id)}>
                  <Printer className="w-3 h-3" />
                  Print All
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2" onClick={() => onPrint?.(group.id)}>
                  {group.type === "INV" ? "Inv" : group.type === "DT" ? "DT" : "WO"}
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2">Certs</Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2">Data</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <CollapsibleContent>
          <div className="border-t">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-5 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">WO-Batch</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Division</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Manufacturer</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Model</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Description</th>
                  <th className="text-right px-5 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item, idx) => (
                  <tr key={idx} className="border-t border-muted/40 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-2.5 font-mono text-xs font-medium text-foreground">{item.woBatch}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{item.division}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold text-foreground uppercase">{item.manufacturer}</td>
                    <td className="px-4 py-2.5 text-xs text-foreground">{item.model}</td>
                    <td className="px-4 py-2.5 text-xs text-foreground">{item.description}</td>
                    <td className="px-5 py-2.5 text-right">
                      <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground !transform-none !scale-100 hover:!scale-100 hover:!shadow-none">
                        <Award className="w-3 h-3" />
                        Certs + Data
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

// --- Main Page ---
const CustomerPickupView = () => {
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"awaiting" | "printed">("awaiting");
  const [searchQuery, setSearchQuery] = useState("");
  const [printedIds, setPrintedIds] = useState<Set<string>>(new Set());
  const [forceOpen, setForceOpen] = useState<{ value: boolean; key: number } | null>(null);

  const handlePrint = (id: string) => {
    setPrintedIds(prev => new Set(prev).add(id));
  };

  const applyFilters = (groups: PickupGroup[]) => groups.filter(group => {
    if (locationFilter.length > 0 && !locationFilter.some(v => group.city.toLowerCase().replace(/\s+/g, "-") === v)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      group.customerName.toLowerCase().includes(q) ||
      group.number.toLowerCase().includes(q) ||
      group.city.toLowerCase().includes(q) ||
      group.division.toLowerCase().includes(q) ||
      group.items.some(item =>
        item.woBatch.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      )
    );
  });

  const priorityOrder: Record<string, number> = { EMERGENCY: 0, EXPEDITE: 1, RUSH: 2, NORMAL: 3 };
  const sortGroups = (groups: PickupGroup[]) =>
    [...groups].sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 3;
      const pb = priorityOrder[b.priority] ?? 3;
      if (pa !== pb) return pa - pb;
      try { return parseISO(a.deliverBy).getTime() - parseISO(b.deliverBy).getTime(); } catch { return 0; }
    });

  const awaitingGroups = sortGroups(applyFilters(mockGroups.filter(g => !printedIds.has(g.id))));
  const printedGroups = sortGroups(applyFilters(mockGroups.filter(g => printedIds.has(g.id))));

  const awaitingCount = awaitingGroups.length;
  const printedCount = printedGroups.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">Customer Pickup</h1>
              <Breadcrumb className="mt-1 hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs text-foreground font-medium">Customer Pickup</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </header>

      {/* Filters & Search Bar */}
      <div className="px-2 sm:px-4 lg:px-6 py-3 border-b bg-card space-y-2">
        <div className="flex items-center gap-3">
          <div className="relative w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search customer, invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs rounded-lg border-border"
            />
          </div>

          <div className="h-6 w-px bg-border shrink-0" />

          <div className="flex items-center gap-2 flex-wrap flex-1">
            {([
              { label: "Location", values: locationFilter, onChange: setLocationFilter, singleSelect: false, options: [{ v: "baton-rouge", l: "Baton Rouge" }, { v: "norco", l: "Norco" }, { v: "garyville", l: "Garyville" }, { v: "donaldsonville", l: "Donaldsonville" }] },
            ] as const).map(({ label, values, onChange, singleSelect, options }) => {
              const displayText = values.length === 0
                ? "All"
                : values.length === 1
                ? options.find(o => o.v === values[0])?.l || values[0]
                : `${values.length} selected`;

              const isActive = values.length > 0;

              const toggleValue = (v: string) => {
                if (singleSelect) {
                  onChange([v]);
                } else {
                  onChange(prev => 
                    prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
                  );
                }
              };

              return (
                <Popover key={label}>
                  <PopoverTrigger asChild>
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 hover:shadow-sm ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-foreground border-border hover:border-foreground/30"
                      }`}
                    >
                      <span className="opacity-70">{label}:</span>
                      <span className="font-semibold">{displayText}</span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="flex flex-col gap-0.5">
                      {!singleSelect && (
                        <button
                          onClick={() => onChange([])}
                          className={`text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
                            values.length === 0
                              ? "bg-primary/10 text-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          All
                        </button>
                      )}
                      {options.map((o) => (
                        <button
                          key={o.v}
                          onClick={() => toggleValue(o.v)}
                          className={`flex items-center gap-2 text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
                            values.includes(o.v)
                              ? "bg-primary/10 text-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {!singleSelect && (
                            <Checkbox
                              checked={values.includes(o.v)}
                              className="h-3.5 w-3.5 pointer-events-none"
                            />
                          )}
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}

            {(locationFilter.length > 0 || searchQuery.trim().length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocationFilter([]);
                  setSearchQuery("");
                }}
                className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Row 2: Active filter tags */}
        {(() => {
          const allFilters = [
            { label: "Location", values: locationFilter, onChange: setLocationFilter, options: [{ v: "baton-rouge", l: "Baton Rouge" }, { v: "norco", l: "Norco" }, { v: "garyville", l: "Garyville" }, { v: "donaldsonville", l: "Donaldsonville" }] },
          ];
          const tags = allFilters.flatMap(f =>
            f.values.map(v => ({
              key: `${f.label}-${v}`,
              label: `${f.label}: ${f.options.find(o => o.v === v)?.l || v}`,
              onRemove: () => f.onChange(prev => prev.filter(x => x !== v)),
            }))
          );
          if (tags.length === 0) return null;
          return (
            <div className="flex items-center gap-1.5 flex-wrap ml-[calc(16rem+12px+1px+12px)]">
              {tags.map(tag => (
                <span
                  key={tag.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-md text-xs font-medium text-foreground"
                >
                  {tag.label}
                  <button
                    onClick={tag.onRemove}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Tabs */}
      <div className="px-6 bg-card border-b">
        <div className="flex items-center">
          <div className="flex gap-0 flex-1">
            {([
              { key: "awaiting" as const, label: "Awaiting Pickup", count: awaitingCount, icon: Printer },
              { key: "printed" as const, label: "Picked Up", count: printedCount, icon: FileText },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-5 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2.5 ${
                  activeTab === tab.key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4 text-foreground" />
                {tab.label}
                <span className={`inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[11px] font-semibold ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setForceOpen(prev => ({ value: true, key: (prev?.key ?? 0) + 1 }))}
              title="Expand All"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setForceOpen(prev => ({ value: false, key: (prev?.key ?? 0) + 1 }))}
              title="Collapse All"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {activeTab === "awaiting" ? (
          awaitingGroups.length > 0 ? (
            awaitingGroups.map(group => (
              <PickupGroupCard key={group.id} group={group} onPrint={handlePrint} forceOpen={forceOpen} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {searchQuery ? `No results found for "${searchQuery}".` : "No items awaiting pickup."}
            </div>
          )
        ) : (
          printedGroups.length > 0 ? (
            printedGroups.map(group => (
              <PickupGroupCard key={group.id} group={group} isPrinted forceOpen={forceOpen} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No picked up items at this time.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CustomerPickupView;
