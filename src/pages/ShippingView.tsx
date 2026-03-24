import React, { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Printer, FileText, ChevronDown, ChevronRight, AlertTriangle, Zap, X, Plus, Package, DollarSign } from "lucide-react";

// --- Types ---
interface ShippingItem {
  woNumber: string;
  customerName: string;
  manufacturer: string;
  model: string;
  description: string;
  trackingNumber?: string;
  carrier?: string;
  woTotal?: number;
}

interface ShippingGroup {
  id: string;
  dtNumber: string;
  customerName: string;
  priority: "EMERGENCY" | "EXPEDITE" | "RUSH" | "NORMAL";
  date: string;
  freightStatus: "no-freight" | "has-freight";
  workOrderCount: number;
  invoiceFreight: number;
  items: ShippingItem[];
}

// --- Mock Data ---
const mockShippingGroups: ShippingGroup[] = [
  {
    id: "1",
    dtNumber: "4824",
    customerName: "Shell Chemical LP",
    priority: "RUSH",
    date: "2026-03-06",
    freightStatus: "no-freight",
    workOrderCount: 3,
    invoiceFreight: 0,
    items: [
      { woNumber: "4230", customerName: "Shell Chemical LP", manufacturer: "ASHCROFT", model: "TEST GAUGE", description: "TEST GAUGE", woTotal: undefined },
      { woNumber: "4231", customerName: "Shell Chemical LP", manufacturer: "OMEGA", model: "THERMOMETER", description: "THERMOMETER", woTotal: undefined },
      { woNumber: "4232", customerName: "Shell Chemical LP", manufacturer: "OMEGA", model: "DIGITAL THERMOMETER", description: "DIGITAL THERMOMETER", woTotal: undefined },
    ],
  },
  {
    id: "2",
    dtNumber: "4825",
    customerName: "ExxonMobil Baton Rouge",
    priority: "EMERGENCY",
    date: "2026-03-04",
    freightStatus: "has-freight",
    workOrderCount: 2,
    invoiceFreight: 45.00,
    items: [
      { woNumber: "4240", customerName: "ExxonMobil Baton Rouge", manufacturer: "FLUKE", model: "87V", description: "DIGITAL MULTIMETER", trackingNumber: "1Z999AA10123456784", carrier: "UPS", woTotal: 250.00 },
      { woNumber: "4241", customerName: "ExxonMobil Baton Rouge", manufacturer: "FLUKE", model: "726", description: "MULTIFUNCTION CALIBRATOR", trackingNumber: "1Z999AA10123456784", carrier: "UPS", woTotal: 475.00 },
    ],
  },
  {
    id: "3",
    dtNumber: "4826",
    customerName: "Dow Chemical Plaquemine",
    priority: "NORMAL",
    date: "2026-03-10",
    freightStatus: "no-freight",
    workOrderCount: 1,
    invoiceFreight: 0,
    items: [
      { woNumber: "4250", customerName: "Dow Chemical Plaquemine", manufacturer: "DRUCK", model: "DPI 611", description: "PRESSURE CALIBRATOR", woTotal: undefined },
    ],
  },
  {
    id: "4",
    dtNumber: "4827",
    customerName: "BASF Geismar",
    priority: "EXPEDITE",
    date: "2026-03-08",
    freightStatus: "no-freight",
    workOrderCount: 2,
    invoiceFreight: 0,
    items: [
      { woNumber: "4260", customerName: "BASF Geismar", manufacturer: "AMETEK", model: "RTC-159", description: "DRY BLOCK CALIBRATOR", woTotal: undefined },
      { woNumber: "4261", customerName: "BASF Geismar", manufacturer: "HIOKI", model: "PW3198", description: "POWER QUALITY ANALYZER", woTotal: undefined },
    ],
  },
];

// --- Priority Badge ---
const PriorityBadge = ({ priority }: { priority: ShippingGroup["priority"] }) => {
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

// --- Shipping Group Card ---
const ShippingGroupCard = ({ group, isFinalized, onFinalize }: { group: ShippingGroup; isFinalized?: boolean; onFinalize?: (id: string) => void }) => {
  const [isOpen, setIsOpen] = useState(!isFinalized);

  const displayDate = (() => {
    try { return format(parseISO(group.date), "yyyy-MM-dd"); }
    catch { return group.date; }
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
      <div className={`bg-card rounded-md border ${cardBorder} overflow-hidden transition-all ${isFinalized ? "opacity-50 grayscale" : ""} flex`}>
        <div className={`w-[3px] shrink-0 ${stripeColor} rounded-l-md`} />
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="px-3 py-2.5 flex items-center gap-4">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0 hover:bg-muted rounded mt-0.5">
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </Button>
              </CollapsibleTrigger>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-[12px]">
                  <span className="whitespace-nowrap"><span className="text-muted-foreground font-normal">DT</span> <span className="font-bold text-foreground">#{group.dtNumber}</span></span>
                  <span className="text-muted-foreground/40">—</span>
                  <span className="font-bold text-foreground truncate">{group.customerName}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-[12px]">
                  <span className="text-muted-foreground font-normal">{group.workOrderCount} work orders</span>
                </div>
              </div>
            </div>

            {/* Right side: Priority + date + freight badge + action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <PriorityBadge priority={group.priority} />
              <span className="text-xs text-muted-foreground font-medium">{displayDate}</span>
              <span className="text-muted-foreground/40">—</span>
              <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 h-5">
                {group.freightStatus === "no-freight" ? "No freight" : "Freight added"}
              </Badge>

              <div className="flex items-center gap-1 ml-2">
                <Button size="sm" className="h-7 text-[11px] gap-1 rounded px-3">
                  <Printer className="w-3 h-3" />
                  Print all
                </Button>
                <span className="text-muted-foreground/40">·</span>
                <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2 gap-1 text-amber-600 border-amber-300 hover:bg-amber-50">
                  <FileText className="w-3 h-3" />
                  Claim
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2 gap-1">
                  <Plus className="w-3 h-3" />
                  Bulk freight
                </Button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <CollapsibleContent>
            <div className="border-t">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-5 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider w-20">WO #</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Tracking / Freight</th>
                    <th className="text-right px-5 py-2 font-medium text-muted-foreground text-[11px] uppercase tracking-wider w-28">WO Total</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item, idx) => (
                    <tr key={idx} className="border-t border-muted/40 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs font-bold text-foreground">#{item.woNumber}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold text-foreground">{item.customerName}</div>
                        <div className="text-[11px] text-muted-foreground">{item.manufacturer} · {item.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        {item.trackingNumber ? (
                          <div>
                            <span className="text-xs font-medium text-foreground">{item.carrier}: </span>
                            <span className="text-xs text-primary font-mono">{item.trackingNumber}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs text-muted-foreground italic">No freight yet</span>
                            <div className="mt-1">
                              <Button variant="outline" size="sm" className="h-6 text-[10px] rounded px-2 gap-1 border-dashed text-muted-foreground hover:text-foreground">
                                <Plus className="w-2.5 h-2.5" />
                                Add tracking
                              </Button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right text-xs font-medium text-foreground">
                        {item.woTotal != null ? `$${item.woTotal.toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer with freight total and finalize */}
            <div className="border-t bg-muted/20 px-5 py-3 flex items-center justify-end gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Invoice freight line:</span>
                <span className="font-bold text-foreground text-base">${group.invoiceFreight.toFixed(2)}</span>
              </div>
              <Button
                size="sm"
                className="h-8 text-xs rounded px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => onFinalize?.(group.id)}
              >
                Finalize DT-{group.dtNumber}
              </Button>
            </div>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

// --- Main Page ---
const ShippingView = () => {
  const [locationFilter, setLocationFilter] = useState("baton-rouge");
  const [activeTab, setActiveTab] = useState<"active" | "printed">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [finalizedIds, setFinalizedIds] = useState<Set<string>>(new Set());
  const [dateFilter] = useState("2026-03-04");

  const handleFinalize = (id: string) => {
    setFinalizedIds(prev => new Set(prev).add(id));
  };

  const filteredGroups = useMemo(() => {
    return mockShippingGroups.filter(group => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        group.customerName.toLowerCase().includes(q) ||
        group.dtNumber.includes(q) ||
        group.items.some(item =>
          item.woNumber.includes(q) ||
          item.customerName.toLowerCase().includes(q) ||
          item.manufacturer.toLowerCase().includes(q)
        )
      );
    });
  }, [searchQuery]);

  const activeGroups = filteredGroups.filter(g => !finalizedIds.has(g.id));
  const printedGroups = filteredGroups.filter(g => finalizedIds.has(g.id));

  const locationOptions = [
    { value: "baton-rouge", label: "Baton Rouge" },
    { value: "lake-charles", label: "Lake Charles" },
    { value: "houston", label: "Houston" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300" />
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">Process Shipping</h1>
              <Breadcrumb className="mt-1 hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs text-foreground font-medium">Shipping</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Right side: Date + Location + Search */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-mono px-2.5 py-1 h-8 bg-muted/50">{dateFilter}</Badge>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Location:</span>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-8 w-[140px] text-xs rounded border-border bg-foreground text-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs rounded-lg border-border"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 bg-card border-b">
        <div className="flex items-center">
          <div className="flex gap-0 flex-1">
            {([
              { key: "active" as const, label: "Active", count: activeGroups.length },
              { key: "printed" as const, label: "Printed / Ready", count: printedGroups.length },
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
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {activeTab === "active" ? (
          activeGroups.length > 0 ? (
            activeGroups.map(group => (
              <ShippingGroupCard key={group.id} group={group} onFinalize={handleFinalize} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {searchQuery ? `No results found for "${searchQuery}".` : "No active shipments."}
            </div>
          )
        ) : (
          printedGroups.length > 0 ? (
            printedGroups.map(group => (
              <ShippingGroupCard key={group.id} group={group} isFinalized />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No finalized shipments at this time.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ShippingView;
