import React, { useState } from "react";
import { parseISO, isBefore, startOfDay, format } from "date-fns";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Printer, FileText, Award, ChevronDown, ChevronRight, AlertTriangle, Zap } from "lucide-react";

// --- Types ---
interface PickupItem {
  woBatch: string;
  division: string;
  manufacturer: string;
  model: string;
  description: string;
}

interface PickupGroup {
  id: string;
  number: string;
  priority: "EMERGENCY" | "EXPEDITE" | "RUSH" | "NORMAL";
  customerName: string;
  location: string;
  deliverBy: string;
  items: PickupItem[];
}

// --- Mock Data ---
const mockGroups: PickupGroup[] = [
  {
    id: "INV-988510",
    number: "988510",
    priority: "EMERGENCY",
    customerName: "Rohr Inc Mfg",
    location: "baton-rouge",
    deliverBy: "2026-03-01",
    items: [
      { woBatch: "571253-003", division: "Lab", manufacturer: "FLUKE", model: "719PRO 30G", description: "PRESSURE CALIBRATOR" },
      { woBatch: "571253-005", division: "Lab", manufacturer: "FLUKE", model: "726", description: "MULTIFUNCTION CALIBRATOR" },
    ],
  },
  {
    id: "INV-988515",
    number: "988515",
    priority: "RUSH",
    customerName: "Textron Marine & Land",
    location: "baton-rouge",
    deliverBy: "2026-03-03",
    items: [
      { woBatch: "571249-011", division: "Lab", manufacturer: "FLUKE", model: "87V", description: "TRUE RMS MULTIMETER" },
      { woBatch: "571249-012", division: "Lab", manufacturer: "MEGGER", model: "MIT400", description: "INSULATION TESTER" },
    ],
  },
  {
    id: "INV-988520",
    number: "988520",
    priority: "NORMAL",
    customerName: "Shell Norco Refinery",
    location: "norco",
    deliverBy: "2026-03-22",
    items: [
      { woBatch: "571260-001", division: "Lab", manufacturer: "AMETEK", model: "RTC-159", description: "DRY BLOCK CALIBRATOR" },
      { woBatch: "571260-002", division: "Field", manufacturer: "DRUCK", model: "DPI 611", description: "PRESSURE CALIBRATOR" },
      { woBatch: "571260-003", division: "Lab", manufacturer: "FLUKE", model: "724", description: "TEMPERATURE CALIBRATOR" },
    ],
  },
];

// --- Priority Badge ---
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
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}>
      {priority}
    </span>
  );
};

// --- Group Card ---
const PickupGroupCard = ({ group, isPrinted, onPrint }: { group: PickupGroup; isPrinted?: boolean; onPrint?: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(!isPrinted);

  const isOverdue = (() => {
    try { return isBefore(parseISO(group.deliverBy), startOfDay(new Date())); }
    catch { return false; }
  })();

  const displayDate = (() => {
    try { return format(parseISO(group.deliverBy), "yyyy-MM-dd"); }
    catch { return group.deliverBy; }
  })();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`bg-card rounded-md border border-border overflow-hidden transition-all ${isPrinted ? "opacity-50 grayscale" : ""}`}>
        {/* Header row */}
        <div className="px-4 py-3 flex items-center gap-3">
          <CollapsibleTrigger asChild>
            <button className="shrink-0 text-muted-foreground hover:text-foreground">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </CollapsibleTrigger>

          <span className="text-sm font-bold text-foreground whitespace-nowrap">Inv #{group.number}</span>

          <PriorityBadge priority={group.priority} />

          <span className="text-sm font-semibold text-foreground">{group.customerName}</span>

          <div className="flex-1" />

          <span className={`text-sm font-semibold whitespace-nowrap ${isOverdue ? "text-destructive" : "text-foreground"}`}>
            {displayDate}
          </span>

          <span className="text-sm text-muted-foreground whitespace-nowrap">{group.items.length} items</span>

          <div className="flex items-center gap-1">
            <Button size="sm" className="h-7 text-[11px] gap-1 rounded px-3" onClick={() => onPrint?.(group.id)}>
              <Printer className="w-3 h-3" />
              Print All
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2" onClick={() => onPrint?.(group.id)}>
              Invoice
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2">Certs</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2">Data</Button>
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
                  <th className="text-right px-5 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider"></th>
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
                      <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground">
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
const CustomerPickupView = () => {
  const [locationFilter, setLocationFilter] = useState("baton-rouge");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"awaiting" | "printed">("awaiting");
  const [printedIds, setPrintedIds] = useState<Set<string>>(new Set());

  const handlePrint = (id: string) => {
    setPrintedIds(prev => new Set(prev).add(id));
  };

  const filteredGroups = mockGroups.filter(group => {
    if (locationFilter && group.location !== locationFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      group.customerName.toLowerCase().includes(q) ||
      group.number.toLowerCase().includes(q) ||
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

  const awaitingGroups = sortGroups(filteredGroups.filter(g => !printedIds.has(g.id)));
  const printedGroups = sortGroups(filteredGroups.filter(g => printedIds.has(g.id)));

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="bg-sidebar px-4 lg:px-6 py-3 border-b border-border flex items-center gap-4">
        <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent transition-all" />
        <h1 className="text-base font-bold text-sidebar-foreground italic">Customer Pickup</h1>

        <div className="flex items-center gap-1.5 text-sm text-sidebar-foreground/70">
          <span>Location</span>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="h-8 w-[150px] text-xs rounded bg-sidebar-accent text-sidebar-foreground border-0 font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
              <SelectItem value="norco">Norco</SelectItem>
              <SelectItem value="lake-charles">Lake Charles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        <div className="relative w-56">
          <Input
            placeholder="Search customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs rounded border-sidebar-border bg-sidebar-accent text-sidebar-foreground placeholder:text-sidebar-foreground/50"
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 bg-card border-b">
        <div className="flex gap-0">
          {([
            { key: "awaiting" as const, label: "Awaiting Print", count: awaitingGroups.length },
            { key: "printed" as const, label: "Printed / Ready", count: printedGroups.length },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[11px] font-semibold ${
                activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
              <PickupGroupCard key={group.id} group={group} onPrint={handlePrint} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {searchQuery ? `No results found for "${searchQuery}".` : "No items awaiting print."}
            </div>
          )
        ) : (
          printedGroups.length > 0 ? (
            printedGroups.map(group => (
              <PickupGroupCard key={group.id} group={group} isPrinted />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No printed/ready items at this time.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CustomerPickupView;
