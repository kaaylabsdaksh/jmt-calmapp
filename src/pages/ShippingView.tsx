import React, { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Printer, FileText, ChevronDown, ChevronRight, AlertTriangle, Zap, X, Plus, Package, DollarSign, Flag } from "lucide-react";

// --- Types ---
interface TrackingEntry {
  trackingNumber: string;
  carrier: string;
  freightPrice: number;
}

interface ShippingItem {
  woNumber: string;
  customerName: string;
  manufacturer: string;
  model: string;
  description: string;
  trackingEntries: TrackingEntry[];
  woTotal?: number;
}

interface ShippingGroup {
  id: string;
  dtNumber: string;
  customerName: string;
  priority: "EMERGENCY" | "EXPEDITE" | "RUSH" | "NORMAL";
  date: string;
  freightStatus?: string; // legacy, now computed dynamically
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
      { woNumber: "4230", customerName: "Shell Chemical LP", manufacturer: "ASHCROFT", model: "TEST GAUGE", description: "TEST GAUGE", trackingEntries: [], woTotal: undefined },
      { woNumber: "4231", customerName: "Shell Chemical LP", manufacturer: "OMEGA", model: "THERMOMETER", description: "THERMOMETER", trackingEntries: [], woTotal: undefined },
      { woNumber: "4232", customerName: "Shell Chemical LP", manufacturer: "OMEGA", model: "DIGITAL THERMOMETER", description: "DIGITAL THERMOMETER", trackingEntries: [], woTotal: undefined },
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
      { woNumber: "4240", customerName: "ExxonMobil Baton Rouge", manufacturer: "FLUKE", model: "87V", description: "DIGITAL MULTIMETER", trackingEntries: [{ trackingNumber: "1Z999AA10123456784", carrier: "UPS", freightPrice: 22.50 }], woTotal: 250.00 },
      { woNumber: "4241", customerName: "ExxonMobil Baton Rouge", manufacturer: "FLUKE", model: "726", description: "MULTIFUNCTION CALIBRATOR", trackingEntries: [{ trackingNumber: "1Z999AA10123456784", carrier: "UPS", freightPrice: 22.50 }], woTotal: 475.00 },
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
      { woNumber: "4250", customerName: "Dow Chemical Plaquemine", manufacturer: "DRUCK", model: "DPI 611", description: "PRESSURE CALIBRATOR", trackingEntries: [], woTotal: undefined },
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
      { woNumber: "4260", customerName: "BASF Geismar", manufacturer: "AMETEK", model: "RTC-159", description: "DRY BLOCK CALIBRATOR", trackingEntries: [], woTotal: undefined },
      { woNumber: "4261", customerName: "BASF Geismar", manufacturer: "HIOKI", model: "PW3198", description: "POWER QUALITY ANALYZER", trackingEntries: [], woTotal: undefined },
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

// --- Tracking Popover ---
const TrackingPopover = ({ onSave }: { onSave: (tracking: string, price: number) => void }) => {
  const [open, setOpen] = useState(false);
  const [tracking, setTracking] = useState("");
  const [price, setPrice] = useState("");

  const handleSave = () => {
    if (!tracking.trim()) return;
    onSave(tracking, parseFloat(price) || 0);
    setOpen(false);
    setTracking("");
    setPrice("");
  };

  const handleCancel = () => {
    setOpen(false);
    setTracking("");
    setPrice("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 text-[10px] rounded px-2 gap-1 border-dashed text-muted-foreground hover:text-foreground">
          <Plus className="w-2.5 h-2.5" />
          Add tracking
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 rounded-lg shadow-lg" align="start" sideOffset={6}>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground">Add Tracking</p>
            <p className="text-[10px] text-muted-foreground">Enter shipment details</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Tracking #</label>
              <Input
                placeholder="1Z..."
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="h-8 text-xs"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Price ($)</label>
              <Input
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="border-t px-4 py-3 flex items-center justify-end gap-2 bg-muted/30 rounded-b-lg">
          <Button variant="ghost" size="sm" className="h-7 text-[11px] px-3" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" className="h-7 text-[11px] px-4" onClick={handleSave} disabled={!tracking.trim()}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// --- Shipping Group Card ---
const ShippingGroupCard = ({ group, isFinalized, onFinalize, isClaimed, onClaim, onTrackingSave, onTrackingDelete }: { group: ShippingGroup; isFinalized?: boolean; onFinalize?: (id: string) => void; isClaimed?: boolean; onClaim?: (id: string) => void; onTrackingSave?: (groupId: string, itemIdx: number, tracking: string, price: number) => void; onTrackingDelete?: (groupId: string, itemIdx: number, trackingIdx: number) => void }) => {
  const [isOpen, setIsOpen] = useState(!isFinalized);

  const itemsWithFreight = group.items.filter(i => i.trackingEntries.length > 0);
  const freightStatus: "no-freight" | "partial" | "complete" =
    itemsWithFreight.length === 0 ? "no-freight"
    : itemsWithFreight.length === group.items.length ? "complete"
    : "partial";

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
                  <span className="font-bold text-foreground truncate flex items-center gap-1.5">
                    {group.customerName}
                    {isClaimed && <Flag className="h-3.5 w-3.5 text-green-600 fill-green-600 shrink-0" />}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-[12px]">
                  <span className="text-muted-foreground font-normal">{group.workOrderCount} work orders</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground font-medium">{displayDate}</span>
                </div>
              </div>
            </div>

            {/* Right side: Priority + date + freight badge + action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <PriorityBadge priority={group.priority} />
              <Badge variant="outline" className={`text-[10px] font-medium px-2 py-0.5 h-5 ${
                freightStatus === "complete" ? "bg-green-100 text-green-700 border-green-300" :
                freightStatus === "partial" ? "bg-amber-100 text-amber-700 border-amber-300" :
                ""
              }`}>
                {freightStatus === "complete" ? "Freight complete" : freightStatus === "partial" ? "Partial" : "No freight"}
              </Badge>

              <div className="flex items-center gap-1 ml-2">
                <div className="flex items-center">
                  <Button size="sm" className="h-7 text-[11px] gap-1 rounded-r-none px-3">
                    <Printer className="w-3 h-3" />
                    Print all
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="h-7 text-[11px] rounded-l-none border-l border-primary-foreground/20 px-1.5">
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem className="text-xs">DT / Invoice</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Certs</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Data</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <span className="text-muted-foreground/40">·</span>
                {isClaimed ? (
                  <Badge className="h-7 text-[11px] rounded px-2 gap-1 bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 cursor-pointer" onClick={() => onClaim?.(group.id)}>
                    <FileText className="w-3 h-3" />
                    Claimed
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="h-7 text-[11px] rounded px-2 gap-1 text-amber-600 border-amber-300 hover:bg-amber-50" onClick={() => onClaim?.(group.id)}>
                    <FileText className="w-3 h-3" />
                    Claim
                  </Button>
                )}
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
                  {(() => {
                    // Build a map of tracking# -> first item WO number (first occurrence wins)
                    const trackingOwnerMap = new Map<string, string>();
                    group.items.forEach((item) => {
                      item.trackingEntries.forEach((entry) => {
                        const key = entry.trackingNumber.trim().toLowerCase();
                        if (!trackingOwnerMap.has(key)) {
                          trackingOwnerMap.set(key, item.woNumber);
                        }
                      });
                    });

                    return group.items.map((item, idx) => {
                      // Calculate total excluding shared (duplicate) tracking entries
                      const uniqueTotal = item.trackingEntries.reduce((sum, e) => {
                        const key = e.trackingNumber.trim().toLowerCase();
                        const owner = trackingOwnerMap.get(key);
                        const isShared = owner !== item.woNumber;
                        return sum + (isShared ? 0 : e.freightPrice);
                      }, 0);

                      return (
                        <tr key={idx} className="border-t border-muted/40 hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs font-bold text-foreground">#{item.woNumber}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs font-semibold text-foreground">{item.customerName}</div>
                            <div className="text-[11px] text-muted-foreground">{item.manufacturer} · {item.description}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-1.5">
                              {item.trackingEntries.map((entry, tIdx) => {
                                const key = entry.trackingNumber.trim().toLowerCase();
                                const owner = trackingOwnerMap.get(key);
                                const isShared = owner !== item.woNumber;

                                return (
                                  <div key={tIdx} className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-xs font-mono ${isShared ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                      {entry.trackingNumber}
                                    </span>
                                    {entry.freightPrice > 0 && (
                                      <span className={`text-[10px] ${isShared ? "line-through text-muted-foreground/60" : "text-muted-foreground"}`}>
                                        (${Math.round(entry.freightPrice)})
                                      </span>
                                    )}
                                    {isShared && (
                                      <span className="text-[10px] text-amber-600 font-medium">
                                        Shared • counted on WO #{owner}
                                      </span>
                                    )}
                                    {!isShared && (
                                      <button
                                        onClick={() => onTrackingDelete?.(group.id, idx, tIdx)}
                                        className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                              <TrackingPopover
                                onSave={(tracking, price) => {
                                  onTrackingSave?.(group.id, idx, tracking, price);
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right text-xs font-medium text-foreground">
                            {uniqueTotal > 0 ? `$${Math.round(uniqueTotal)}` : "—"}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Footer with freight total and finalize */}
            <div className="border-t bg-muted/20 px-5 py-3 flex items-center justify-end gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Invoice freight line:</span>
                <span className="font-bold text-foreground text-base">
                  ${(() => {
                    // Build owner map to exclude shared entries from total
                    const ownerMap = new Map<string, string>();
                    group.items.forEach((item) => {
                      item.trackingEntries.forEach((entry) => {
                        const key = entry.trackingNumber.trim().toLowerCase();
                        if (!ownerMap.has(key)) ownerMap.set(key, item.woNumber);
                      });
                    });
                    return Math.round(group.items.reduce((sum, item) =>
                      sum + item.trackingEntries.reduce((s, e) => {
                        const key = e.trackingNumber.trim().toLowerCase();
                        return s + (ownerMap.get(key) === item.woNumber ? e.freightPrice : 0);
                      }, 0), 0));
                  })()}
                </span>
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
  const [shippingGroups, setShippingGroups] = useState<ShippingGroup[]>(mockShippingGroups);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "printed">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [finalizedIds, setFinalizedIds] = useState<Set<string>>(new Set());
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const handleFinalize = (id: string) => {
    setFinalizedIds(prev => new Set(prev).add(id));
  };

  const handleClaim = (id: string) => {
    setClaimedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTrackingSave = (groupId: string, itemIdx: number, tracking: string, price: number) => {
    setShippingGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const newItems = [...g.items];
      newItems[itemIdx] = {
        ...newItems[itemIdx],
        trackingEntries: [...newItems[itemIdx].trackingEntries, { trackingNumber: tracking, carrier: "UPS", freightPrice: price }],
      };
      return { ...g, items: newItems };
    }));
  };

  const handleTrackingDelete = (groupId: string, itemIdx: number, trackingIdx: number) => {
    setShippingGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const newItems = [...g.items];
      newItems[itemIdx] = {
        ...newItems[itemIdx],
        trackingEntries: newItems[itemIdx].trackingEntries.filter((_, i) => i !== trackingIdx),
      };
      return { ...g, items: newItems };
    }));
  };

  const filteredGroups = useMemo(() => {
    return shippingGroups.filter(group => {
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
  }, [searchQuery, shippingGroups]);

  const activeGroups = filteredGroups.filter(g => !finalizedIds.has(g.id));
  const printedGroups = filteredGroups.filter(g => finalizedIds.has(g.id));

  const locationOptions = [
    { v: "baton-rouge", l: "Baton Rouge" },
    { v: "lake-charles", l: "Lake Charles" },
    { v: "houston", l: "Houston" },
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
            {(() => {
              const displayText = locationFilter.length === 0
                ? "All"
                : locationFilter.length === 1
                ? locationOptions.find(o => o.v === locationFilter[0])?.l || locationFilter[0]
                : `${locationFilter.length} selected`;

              const isActive = locationFilter.length > 0;

              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 hover:shadow-sm ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-foreground border-border hover:border-foreground/30"
                      }`}
                    >
                      <span className="opacity-70">Location:</span>
                      <span className="font-semibold">{displayText}</span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => setLocationFilter([])}
                        className={`text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
                          locationFilter.length === 0
                            ? "bg-primary/10 text-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        All
                      </button>
                      {locationOptions.map((o) => (
                        <button
                          key={o.v}
                          onClick={() => setLocationFilter(prev => prev.includes(o.v) ? prev.filter(x => x !== o.v) : [...prev, o.v])}
                          className={`flex items-center gap-2 text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
                            locationFilter.includes(o.v)
                              ? "bg-primary/10 text-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Checkbox
                            checked={locationFilter.includes(o.v)}
                            className="h-3.5 w-3.5 pointer-events-none"
                          />
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })()}

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
          const tags = locationFilter.map(v => ({
            key: `Location-${v}`,
            label: `Location: ${locationOptions.find(o => o.v === v)?.l || v}`,
            onRemove: () => setLocationFilter(prev => prev.filter(x => x !== v)),
          }));
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
              <ShippingGroupCard key={group.id} group={group} onFinalize={handleFinalize} isClaimed={claimedIds.has(group.id)} onClaim={handleClaim} onTrackingSave={handleTrackingSave} onTrackingDelete={handleTrackingDelete} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {searchQuery ? `No results found for "${searchQuery}".` : "No active shipments."}
            </div>
          )
        ) : (
          printedGroups.length > 0 ? (
            printedGroups.map(group => (
              <ShippingGroupCard key={group.id} group={group} isFinalized isClaimed={claimedIds.has(group.id)} />
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
