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
import { Search, Printer, FileText, Award, Database, ChevronDown, ChevronRight, MapPin, AlertTriangle, Zap, X, Clock, Truck, Package } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// --- Types ---
interface LogisticsItem {
  woBatch: string;
  woNumber: string;
  division: string;
  manufacturer: string;
  model: string;
  description: string;
  invoiceNum?: string;
  dtNum?: string;
}

interface LogisticsGroup {
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
  assignedDriver: string;
  items: LogisticsItem[];
}

// --- Raw Mock Items (flat list, before grouping) ---
const mockItems: LogisticsItem[] = [
  // Items with Invoice
  { woBatch: "572200-001", woNumber: "572200", division: "Lab", manufacturer: "FLUKE", model: "719PRO 30G", description: "PRESSURE CALIBRATOR", invoiceNum: "988620", dtNum: "40910" },
  { woBatch: "572200-002", woNumber: "572200", division: "Lab", manufacturer: "ASHCROFT", model: '-30"Hg-0-60 PSI', description: "TEST GAUGE", invoiceNum: "988620" },
  { woBatch: "572200-003", woNumber: "572200", division: "Lab", manufacturer: "WINTERS", model: "0-3000 PSI", description: "L/F PRESSURE GAUGE", invoiceNum: "988620" },
  // Items with DT only (no invoice)
  { woBatch: "572210-001", woNumber: "572210", division: "Field", manufacturer: "PROTO", model: "6062C", description: 'TORQUE WRENCH 1/4"', dtNum: "40915" },
  { woBatch: "572210-002", woNumber: "572210", division: "Field", manufacturer: "PROTO", model: "6062D", description: 'TORQUE WRENCH 3/8"', dtNum: "40915" },
  // Items with Invoice
  { woBatch: "572220-001", woNumber: "572220", division: "Lab", manufacturer: "FLUKE", model: "87V", description: "DIGITAL MULTIMETER", invoiceNum: "988635" },
  { woBatch: "572220-002", woNumber: "572220", division: "Lab", manufacturer: "AMETEK", model: "RTC-159", description: "DRY BLOCK CALIBRATOR", invoiceNum: "988635" },
  { woBatch: "572220-003", woNumber: "572220", division: "Lab", manufacturer: "FLUKE", model: "724", description: "TEMPERATURE CALIBRATOR", invoiceNum: "988635" },
  { woBatch: "572220-004", woNumber: "572220", division: "Lab", manufacturer: "DRUCK", model: "DPI 611", description: "PRESSURE CALIBRATOR", invoiceNum: "988635" },
  // Items with Invoice (overdue)
  { woBatch: "572240-001", woNumber: "572240", division: "Lab", manufacturer: "FLUKE", model: "726", description: "MULTIFUNCTION CALIBRATOR", invoiceNum: "988640" },
  { woBatch: "572240-002", woNumber: "572240", division: "Lab", manufacturer: "FLUKE", model: "754", description: "DOCUMENTING PROCESS CALIBRATOR", invoiceNum: "988640" },
  // Items with Invoice (expedite)
  { woBatch: "572250-001", woNumber: "572250", division: "Field", manufacturer: "FLUKE", model: "1760", description: "THREE-PHASE POWER QUALITY RECORDER", invoiceNum: "988650" },
  { woBatch: "572250-002", woNumber: "572250", division: "Field", manufacturer: "FLUKE", model: "435-II", description: "POWER QUALITY ANALYZER", invoiceNum: "988650" },
  { woBatch: "572250-003", woNumber: "572250", division: "Field", manufacturer: "HIOKI", model: "PW3198", description: "POWER QUALITY ANALYZER", invoiceNum: "988650" },
  // Items with neither invoice nor DT — will be excluded from groups
  { woBatch: "572230-001", woNumber: "572230", division: "Field", manufacturer: "FLUKE", model: "1587", description: "INSULATION MULTIMETER" },
  { woBatch: "572230-002", woNumber: "572230", division: "Field", manufacturer: "MEGGER", model: "MIT485/2", description: "INSULATION TESTER" },
];

// --- Grouping logic: InvoiceNum > DTNum > WONumber ---
const groupMetadata: Record<string, Omit<LogisticsGroup, "id" | "items" | "itemCount">> = {
  "INV-988620": { type: "INV", number: "988620", invoiceDate: "Friday, February 20, 2026", priority: "EMERGENCY", customerName: "ExxonMobil Baton Rouge", city: "Baton Rouge", state: "LA", division: "Lab", deliverBy: "2026-03-01", assignedDriver: "unassigned" },
  "DT-40915": { type: "DT", number: "40915", priority: "RUSH", customerName: "Turner Industries", city: "Lake Charles", state: "LA", division: "Field", deliverBy: "2026-03-09", assignedDriver: "unassigned" },
  "INV-988635": { type: "INV", number: "988635", invoiceDate: "Monday, February 24, 2026", priority: "NORMAL", customerName: "Dow Chemical Plaquemine", city: "Plaquemine", state: "LA", division: "Lab", deliverBy: "2026-03-25", assignedDriver: "unassigned" },
  "INV-988640": { type: "INV", number: "988640", invoiceDate: "Wednesday, March 4, 2026", priority: "RUSH", customerName: "Sasol Lake Charles", city: "Westlake", state: "LA", division: "Lab", deliverBy: "2026-03-15", assignedDriver: "unassigned" },
  "INV-988650": { type: "INV", number: "988650", invoiceDate: "Tuesday, March 10, 2026", priority: "EXPEDITE", customerName: "BASF Geismar", city: "Geismar", state: "LA", division: "Field", deliverBy: "2026-03-20", assignedDriver: "unassigned" },
};

function buildGroups(items: LogisticsItem[]): LogisticsGroup[] {
  const buckets = new Map<string, LogisticsItem[]>();

  for (const item of items) {
    // Only group items that have an invoice or DT number; skip the rest
    if (!item.invoiceNum && !item.dtNum) continue;

    const key = item.invoiceNum
      ? `INV-${item.invoiceNum}`
      : `DT-${item.dtNum}`;

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
      assignedDriver: "unassigned",
    };

    return {
      id: key,
      ...meta,
      items: groupItems,
      itemCount: groupItems.length,
    };
  });
}

const mockGroups: LogisticsGroup[] = buildGroups(mockItems);

// --- Priority Badge Component ---
const PriorityBadge = ({ priority }: { priority: LogisticsGroup["priority"] }) => {
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

// --- Logistics Group Card ---
const LogisticsGroupCard = ({ group, isPrinted, onPrint }: { group: LogisticsGroup; isPrinted?: boolean; onPrint?: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(!isPrinted);
  const [driver, setDriver] = useState(group.assignedDriver);

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
      <div className={`bg-card rounded-md border ${cardBorder} overflow-hidden transition-all ${isPrinted ? "opacity-50 grayscale" : ""}`}>
        {/* Thin priority stripe */}
        <div className={`h-1 ${stripeColor}`} />

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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[13px] text-foreground whitespace-nowrap">{typeLabel} #{group.number}</span>
                <span className="text-xs font-medium text-foreground truncate">{group.customerName}</span>
                <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground whitespace-nowrap">
                  <MapPin className="w-2.5 h-2.5" />
                  {group.city}, {group.state}
                </span>
                <Badge variant="outline" className="text-[9px] font-medium px-1.5 py-0 h-4">{group.division}</Badge>
              </div>
              {/* Line 2: Dates + Items */}
              <div className="flex items-center gap-2 flex-wrap">
                {group.invoiceDate && (
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    Inv: {group.invoiceDate}
                  </span>
                )}
                <span className="text-muted-foreground/40">·</span>
                <div className={`flex items-center gap-1 whitespace-nowrap ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                  <span className="uppercase tracking-wider text-[9px] font-medium">Deliver</span>
                  <span className={`text-xs font-semibold ${isOverdue ? "text-destructive" : "text-foreground"}`}>{displayDate}</span>
                </div>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  <span className="font-semibold text-foreground">{group.itemCount}</span> items
                </span>
              </div>
            </div>
          </div>

          {/* Right: Priority pill + Driver + Printables */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <PriorityBadge priority={group.priority} />
            <div className="flex items-center gap-2">
              <Select value={driver} onValueChange={setDriver}>
                <SelectTrigger className="h-7 w-[130px] text-[11px] rounded border-dashed">
                  <SelectValue placeholder="Assign Driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                  <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                  <SelectItem value="david-chen">David Chen</SelectItem>
                </SelectContent>
              </Select>

              {!isPrinted ? (
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
              ) : (
                <Badge variant="outline" className="text-[10px] text-muted-foreground gap-1 px-2 py-0.5">
                  <Printer className="w-2.5 h-2.5" />
                  Printed
                </Badge>
              )}
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
                      <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground">
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
    </Collapsible>
  );
};

// --- Main Page ---
const LogisticsView = () => {
  const [locationFilter, setLocationFilter] = useState<string[]>(["baton-rouge"]);
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [divisionFilter, setDivisionFilter] = useState<string[]>([]);
  const [driverFilter, setDriverFilter] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"awaiting" | "printed">("awaiting");
  const [searchQuery, setSearchQuery] = useState("");
  const [printedIds, setPrintedIds] = useState<Set<string>>(new Set());

  const handlePrint = (id: string) => {
    setPrintedIds(prev => new Set(prev).add(id));
  };
  // Apply filters and search
  const applyFilters = (groups: LogisticsGroup[]) => groups.filter(group => {
    // Location filter (matches city)
    if (locationFilter.length > 0 && !locationFilter.some(v => group.city.toLowerCase().replace(/\s+/g, "-") === v)) return false;
    // State filter
    if (stateFilter.length > 0 && !stateFilter.some(v => group.state.toLowerCase().replace(/\s+/g, "-") === v)) return false;
    // City filter
    if (cityFilter.length > 0 && !cityFilter.some(v => group.city.toLowerCase().replace(/\s+/g, "-") === v)) return false;
    // Division filter
    if (divisionFilter.length > 0 && !divisionFilter.some(v => group.division.toLowerCase() === v)) return false;
    // Driver filter
    if (driverFilter.length > 0) {
      const driverMap: Record<string, string> = { mike: "Mike Johnson", sarah: "Sarah Williams", david: "David Chen" };
      const selectedDriverNames = driverFilter.map(v => driverMap[v]?.toLowerCase() || v);
      if (!selectedDriverNames.some(d => group.assignedDriver.toLowerCase() === d || group.assignedDriver === "unassigned")) {
        // Only show unassigned if no driver filter — actually skip unassigned
        return false;
      }
    }
    // Search query
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
  const sortGroups = (groups: LogisticsGroup[]) =>
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
      {/* Top Nav - matching Work Order Management style */}
      <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">Logistics</h1>
              <Breadcrumb className="mt-1 hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs text-foreground font-medium">Logistics</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </header>

      {/* Filters & Search Bar */}
      <div className="px-2 sm:px-4 lg:px-6 py-3 border-b bg-card space-y-2">
        {/* Row 1: Search + Filters + Clear */}
        <div className="flex items-center gap-3">
          {/* Search - prominent placement */}
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

          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {([
              { label: "Location", values: locationFilter, onChange: setLocationFilter, singleSelect: false, options: [{ v: "baton-rouge", l: "Baton Rouge" }, { v: "lake-charles", l: "Lake Charles" }, { v: "houston", l: "Houston" }, { v: "new-orleans", l: "New Orleans" }] },
              { label: "State", values: stateFilter, onChange: setStateFilter, singleSelect: false, options: [{ v: "LA", l: "Louisiana" }, { v: "TX", l: "Texas" }, { v: "MS", l: "Mississippi" }] },
              { label: "City", values: cityFilter, onChange: setCityFilter, singleSelect: false, options: [{ v: "baton-rouge", l: "Baton Rouge" }, { v: "lake-charles", l: "Lake Charles" }, { v: "houston", l: "Houston" }] },
              { label: "Division", values: divisionFilter, onChange: setDivisionFilter, singleSelect: false, options: [{ v: "lab", l: "Lab" }, { v: "field", l: "Field" }] },
              { label: "Driver", values: driverFilter, onChange: setDriverFilter, singleSelect: false, options: [{ v: "mike", l: "Mike Johnson" }, { v: "sarah", l: "Sarah Williams" }, { v: "david", l: "David Chen" }] },
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

            {/* Clear all */}
            {(locationFilter.length > 0 || stateFilter.length > 0 || cityFilter.length > 0 || divisionFilter.length > 0 || driverFilter.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocationFilter([]);
                  setStateFilter([]);
                  setCityFilter([]);
                  setDivisionFilter([]);
                  setDriverFilter([]);
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
            { label: "Location", values: locationFilter, onChange: setLocationFilter, options: [{ v: "baton-rouge", l: "Baton Rouge" }, { v: "lake-charles", l: "Lake Charles" }, { v: "houston", l: "Houston" }, { v: "new-orleans", l: "New Orleans" }] },
            { label: "State", values: stateFilter, onChange: setStateFilter, options: [{ v: "LA", l: "Louisiana" }, { v: "TX", l: "Texas" }, { v: "MS", l: "Mississippi" }] },
            { label: "City", values: cityFilter, onChange: setCityFilter, options: [{ v: "baton-rouge", l: "Baton Rouge" }, { v: "lake-charles", l: "Lake Charles" }, { v: "houston", l: "Houston" }] },
            { label: "Division", values: divisionFilter, onChange: setDivisionFilter, options: [{ v: "lab", l: "Lab" }, { v: "field", l: "Field" }] },
            { label: "Driver", values: driverFilter, onChange: setDriverFilter, options: [{ v: "mike", l: "Mike Johnson" }, { v: "sarah", l: "Sarah Williams" }, { v: "david", l: "David Chen" }] },
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
        <div className="flex gap-0">
          {([
            { key: "awaiting" as const, label: "Awaiting Print", count: awaitingCount, icon: Printer },
            { key: "printed" as const, label: "Printed / Ready", count: printedCount, icon: FileText },
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
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {activeTab === "awaiting" ? (
          awaitingGroups.length > 0 ? (
            awaitingGroups.map(group => (
              <LogisticsGroupCard key={group.id} group={group} onPrint={handlePrint} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {searchQuery ? `No results found for "${searchQuery}".` : "All groups have been printed."}
            </div>
          )
        ) : (
          printedGroups.length > 0 ? (
            printedGroups.map(group => (
              <LogisticsGroupCard key={group.id} group={group} isPrinted />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No printed/ready shipments at this time.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LogisticsView;
