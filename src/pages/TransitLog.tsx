import { Fragment, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  
  ChevronDown,
  ChevronRight,
  FileText,
  PlayCircle,
  RotateCcw,
  Search,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- types --------------------------------- */

type Priority = "Normal" | "Rush" | "Expedite" | "Emergency";

interface TransitItem {
  id: string;
  pcs: number;
  acct: string;
  customer: string;
  batchItem: string;
  rentalId: string;
  manModel: string;
  description: string;
  priority: Priority;
  division: string;
  rcvdOn: string;
  rcvdBy: string;
  rental: boolean;
}

interface TransitRecord {
  id: string;
  dateAdded: string;
  addedBy: string;
  woQty: number;
  rcvd: number;
  huQty: number;
  type: string;
  pcs: number;
  acct: string;
  customer: string;
  batchItem: string;
  rentalId: string;
  manModel: string;
  description: string;
  origin: string;
  destination: string;
  deliverTo: string;
  priority: Priority;
  division: string;
  woLocation: string;
  woNumber: string;
  rcvdOn: string;
  rcvdBy: string;
  rental: boolean;
  notes: string;
  items: TransitItem[];
}

/* ---------------------------------- data ---------------------------------- */

const PRIORITY_STYLES: Record<Priority, string> = {
  Normal: "bg-muted text-muted-foreground border-border",
  Rush: "bg-yellow-100 text-yellow-900 border-yellow-200",
  Expedite: "bg-orange-100 text-orange-900 border-orange-200",
  Emergency: "bg-red-100 text-red-800 border-red-200",
};

const ROW_ACCENT: Record<Priority, string> = {
  Normal: "",
  Rush: "border-l-2 border-l-yellow-400",
  Expedite: "border-l-2 border-l-orange-400",
  Emergency: "border-l-2 border-l-red-500 bg-red-50/40",
};

const makeItems = (base: string, acct: string, customer: string, priority: Priority, division: string, rental: boolean, count: number): TransitItem[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${base}-i${i + 1}`,
    pcs: 1,
    acct,
    customer,
    batchItem: `${base}-${String(i + 1).padStart(3, "0")}`,
    rentalId: rental ? `R-${base.slice(-4)}${i + 1}` : "",
    manModel: ["Fluke / 87V", "Megger / MIT525", "AEMC / 6250", "Hipotronics / 880PL"][i % 4],
    description: ["Digital Multimeter", "Insulation Tester", "Micro-Ohmmeter", "AC Dielectric Test Set"][i % 4],
    priority,
    division,
    rcvdOn: i % 3 === 0 ? "" : "08/26/2026",
    rcvdBy: i % 3 === 0 ? "" : ["T. McGee", "L. Chen", "D. Kim"][i % 3],
    rental,
  }));

const RECORDS: TransitRecord[] = [
  {
    id: "t1", dateAdded: "08/24/2026", addedBy: "T. McGee", woQty: 6, rcvd: 6, huQty: 2, type: "Inbound", pcs: 6,
    acct: "10245", customer: "Entergy Louisiana LLC", batchItem: "5432", rentalId: "", manModel: "Fluke / 87V",
    description: "Digital Multimeter calibration batch", origin: "Baton Rouge", destination: "Houston Lab",
    deliverTo: "Receiving Dock B", priority: "Rush", division: "Electrical", woLocation: "Houston", woNumber: "5432",
    rcvdOn: "08/26/2026", rcvdBy: "T. McGee", rental: false,
    notes: "Equipment received from Baton Rouge and awaiting lab processing.",
    items: makeItems("5432", "10245", "Entergy Louisiana LLC", "Rush", "Electrical", false, 3),
  },
  {
    id: "t2", dateAdded: "08/23/2026", addedBy: "L. Chen", woQty: 4, rcvd: 0, huQty: 1, type: "Outbound", pcs: 4,
    acct: "20871", customer: "CenterPoint Energy Services", batchItem: "5488", rentalId: "R-58801", manModel: "Megger / MIT525",
    description: "Insulation tester rental return", origin: "Houston Lab", destination: "Dallas",
    deliverTo: "J. Rivera", priority: "Emergency", division: "Power", woLocation: "Dallas", woNumber: "5488",
    rcvdOn: "", rcvdBy: "", rental: true,
    notes: "Emergency turnaround requested by customer — confirm freight before dispatch.",
    items: makeItems("5488", "20871", "CenterPoint Energy Services", "Emergency", "Power", true, 4),
  },
  {
    id: "t3", dateAdded: "08/22/2026", addedBy: "D. Kim", woQty: 2, rcvd: 2, huQty: 1, type: "Transfer", pcs: 2,
    acct: "33150", customer: "Oncor Electric Delivery", batchItem: "5501", rentalId: "", manModel: "AEMC / 6250",
    description: "Micro-ohmmeter transfer to onsite crew", origin: "Dallas", destination: "Fort Worth",
    deliverTo: "Onsite Crew 4", priority: "Normal", division: "Onsite", woLocation: "Fort Worth", woNumber: "5501",
    rcvdOn: "08/25/2026", rcvdBy: "D. Kim", rental: false,
    notes: "Transferred with vehicle standards kit.",
    items: makeItems("5501", "33150", "Oncor Electric Delivery", "Normal", "Onsite", false, 2),
  },
  {
    id: "t4", dateAdded: "08/21/2026", addedBy: "S. Miller", woQty: 8, rcvd: 5, huQty: 3, type: "Inbound", pcs: 8,
    acct: "41002", customer: "Gulf Coast Utility Contractors", batchItem: "5510", rentalId: "R-55102", manModel: "Hipotronics / 880PL",
    description: "AC dielectric test set + accessories", origin: "New Orleans", destination: "Houston Lab",
    deliverTo: "Receiving Dock A", priority: "Expedite", division: "Electrical", woLocation: "Houston", woNumber: "5510",
    rcvdOn: "08/24/2026", rcvdBy: "S. Miller", rental: true,
    notes: "Partial receipt — 3 pieces still in transit with carrier.",
    items: makeItems("5510", "41002", "Gulf Coast Utility Contractors", "Expedite", "Electrical", true, 5),
  },
  {
    id: "t5", dateAdded: "08/20/2026", addedBy: "A. Lopez", woQty: 3, rcvd: 0, huQty: 1, type: "Outbound", pcs: 3,
    acct: "50993", customer: "Southern Power Maintenance", batchItem: "5523", rentalId: "", manModel: "Fluke / 1587",
    description: "Insulation multimeter shipment", origin: "Houston Lab", destination: "Baton Rouge",
    deliverTo: "M. Boudreaux", priority: "Normal", division: "Power", woLocation: "Baton Rouge", woNumber: "5523",
    rcvdOn: "", rcvdBy: "", rental: false,
    notes: "Awaiting carrier pickup confirmation.",
    items: makeItems("5523", "50993", "Southern Power Maintenance", "Normal", "Power", false, 3),
  },
  {
    id: "t6", dateAdded: "08/19/2026", addedBy: "J. Parker", woQty: 5, rcvd: 5, huQty: 2, type: "Inbound", pcs: 5,
    acct: "61230", customer: "Delta Substation Services", batchItem: "5540", rentalId: "R-55401", manModel: "Megger / DLRO10",
    description: "Low resistance ohmmeter rental fleet", origin: "Fort Worth", destination: "Houston Lab",
    deliverTo: "Receiving Dock B", priority: "Rush", division: "Rental", woLocation: "Houston", woNumber: "5540",
    rcvdOn: "08/22/2026", rcvdBy: "J. Parker", rental: true,
    notes: "Rental fleet returned in good condition.",
    items: makeItems("5540", "61230", "Delta Substation Services", "Rush", "Rental", true, 3),
  },
];

const ORIGINS = ["Baton Rouge", "Houston Lab", "Dallas", "New Orleans", "Fort Worth"];
const DESTINATIONS = ["Houston Lab", "Dallas", "Fort Worth", "Baton Rouge"];
const WO_LOCATIONS = ["Houston", "Dallas", "Fort Worth", "Baton Rouge"];
const TYPES = ["Inbound", "Outbound", "Transfer"];

const defaultFilters = {
  type: "all",
  acct: "",
  wo: "",
  origin: "all",
  destination: "all",
  woLocation: "all",
  sortBy: "dateAdded",
  sortDir: "desc",
};

/* -------------------------------- component -------------------------------- */

const Truncate = ({ value, className }: { value: string; className?: string }) => {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("block truncate", className)}>{value}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{value}</TooltipContent>
    </Tooltip>
  );
};

const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <Badge variant="outline" className={cn("h-5 rounded-full px-2 text-[10px] font-medium hover:bg-inherit", PRIORITY_STYLES[priority])}>
    <span
      className={cn(
        "mr-1 inline-block h-1.5 w-1.5 rounded-full",
        priority === "Emergency" ? "bg-red-500" : priority === "Expedite" ? "bg-orange-500" : priority === "Rush" ? "bg-yellow-500" : "bg-muted-foreground"
      )}
    />
    {priority}
  </Badge>
);

const ReceivingBadge = ({ received }: { received: boolean }) => (
  <Badge
    variant="outline"
    className={cn(
      "h-5 rounded-full px-2 text-[10px] font-medium hover:bg-inherit",
      received ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"
    )}
  >
    {received ? "Received" : "Pending Receipt"}
  </Badge>
);

/* ------------------------------ table columns ------------------------------ */

type ColKey =
  | "dateAdded" | "addedBy" | "woQty" | "rcvd" | "huQty" | "type" | "pcs"
  | "acct" | "customer" | "batchItem" | "rentalId" | "manModel" | "description"
  | "destination" | "deliverTo" | "priority" | "division" | "rcvdOn" | "rcvdBy";

interface ColumnDef {
  key: ColKey;
  label: string;
  numeric?: boolean;
  thClass?: string;
  tdClass?: string;
  render: (r: TransitRecord, ctx: { navigate: (to: string) => void }) => React.ReactNode;
}

const COLUMNS: ColumnDef[] = [
  { key: "dateAdded", label: "Date Added", tdClass: "whitespace-nowrap", render: (r) => r.dateAdded },
  { key: "addedBy", label: "Added By", tdClass: "whitespace-nowrap", render: (r) => r.addedBy },
  { key: "woQty", label: "WO Qty", numeric: true, render: (r) => r.woQty },
  { key: "rcvd", label: "Rcvd", numeric: true, render: (r) => r.rcvd },
  { key: "huQty", label: "HU Qty", numeric: true, render: (r) => r.huQty },
  { key: "type", label: "Type", render: (r) => r.type },
  { key: "pcs", label: "Pcs", numeric: true, render: (r) => r.pcs },
  {
    key: "acct",
    label: "Acct #",
    render: (r, { navigate }) => (
      <button
        className="font-medium text-foreground underline-offset-2 hover:underline"
        onClick={() => navigate(`/manage-customers/${r.acct}`)}
      >
        {r.acct}
      </button>
    ),
  },
  { key: "customer", label: "Customer Name", thClass: "min-w-[160px]", tdClass: "max-w-[160px]", render: (r) => <Truncate value={r.customer} /> },
  {
    key: "batchItem",
    label: "Batch/Item",
    render: (r, { navigate }) => (
      <button
        className="font-medium text-foreground underline-offset-2 hover:underline"
        onClick={() => navigate("/edit-order")}
      >
        {r.batchItem}
      </button>
    ),
  },
  { key: "rentalId", label: "Rental ID", render: (r) => r.rentalId || <span className="text-muted-foreground">—</span> },
  { key: "manModel", label: "Man/Model", thClass: "min-w-[130px]", tdClass: "max-w-[130px]", render: (r) => <Truncate value={r.manModel} /> },
  { key: "description", label: "Description", thClass: "min-w-[180px]", tdClass: "max-w-[200px]", render: (r) => <Truncate value={r.description} /> },
  { key: "destination", label: "Destination", render: (r) => r.destination },
  { key: "deliverTo", label: "Deliver To", render: (r) => r.deliverTo },
  { key: "priority", label: "Priority", render: (r) => <PriorityBadge priority={r.priority} /> },
  { key: "division", label: "Division", render: (r) => r.division },
  {
    key: "rcvdOn",
    label: "Rcvd On",
    tdClass: "whitespace-nowrap",
    render: (r) => (
      <div className="flex items-center gap-1.5">
        <ReceivingBadge received={r.rcvd >= r.woQty && r.woQty > 0} />
        <span className="text-muted-foreground">{r.rcvdOn || ""}</span>
      </div>
    ),
  },
  { key: "rcvdBy", label: "Rcvd By", render: (r) => r.rcvdBy || <span className="text-muted-foreground">—</span> },
];


const TransitLog = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(defaultFilters);
  const [applied, setApplied] = useState(defaultFilters);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const toggleItem = (id: string) =>
    setSelectedItems((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const [showNotes, setShowNotes] = useState(false);
  const [rentalOnly, setRentalOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [processOpen, setProcessOpen] = useState(false);

  const update = <K extends keyof typeof filters>(k: K, v: (typeof filters)[K]) =>
    setFilters((p) => ({ ...p, [k]: v }));

  const clearFilters = () => {
    setFilters(defaultFilters);
    setApplied(defaultFilters);
    setRentalOnly(false);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const f = applied;
    let rows = RECORDS.filter((r) => {
      if (f.type !== "all" && r.type !== f.type) return false;
      if (f.acct && !r.acct.includes(f.acct.trim())) return false;
      if (f.wo && !r.woNumber.includes(f.wo.trim())) return false;
      if (f.origin !== "all" && r.origin !== f.origin) return false;
      if (f.destination !== "all" && r.destination !== f.destination) return false;
      if (f.woLocation !== "all" && r.woLocation !== f.woLocation) return false;
      if (rentalOnly && !r.rental) return false;
      return true;
    });

    const dir = f.sortDir === "asc" ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      switch (f.sortBy) {
        case "acct":
          return a.acct.localeCompare(b.acct) * dir;
        case "customer":
          return a.customer.localeCompare(b.customer) * dir;
        case "priority": {
          const order: Priority[] = ["Normal", "Rush", "Expedite", "Emergency"];
          return (order.indexOf(a.priority) - order.indexOf(b.priority)) * dir;
        }
        case "destination":
          return a.destination.localeCompare(b.destination) * dir;
        default:
          return (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()) * dir;
      }
    });
    return rows;
  }, [applied, rentalOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allVisibleSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));
  const toggleAllVisible = () =>
    setSelected((prev) =>
      allVisibleSelected ? prev.filter((id) => !pageRows.some((r) => r.id === id)) : Array.from(new Set([...prev, ...pageRows.map((r) => r.id)]))
    );
  const toggleRow = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleExpand = (id: string) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const expandAll = (checked: boolean) => setExpanded(checked ? filtered.map((r) => r.id) : []);
  const allExpanded = filtered.length > 0 && filtered.every((r) => expanded.includes(r.id));

  const selectedRecords = RECORDS.filter((r) => selected.includes(r.id));

  const handleProcess = () => {
    if (selectedRecords.length === 0) {
      toast.info("Opening Transit Processing", { description: "No records selected — the full transit queue will be processed." });
      return;
    }
    setProcessOpen(true);
  };

  const confirmProcess = () => {
    toast.success(`${selectedRecords.length} transit record(s) processed`);
    setProcessOpen(false);
    setSelected([]);
  };

  const cellNum = "px-2 py-1.5 text-right tabular-nums";
  const cell = "px-2 py-1.5";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-background min-h-full flex flex-col">
        <ModernTopNav />

        <main className="flex-1 w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5 space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Transit Log
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track, review, and process equipment currently in transit.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8 text-xs" onClick={handleProcess}>
                <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                Process
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-border">
            <CardContent className="p-3 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Type</Label>
                  <Select value={filters.type} onValueChange={(v) => update("type", v)}>
                    <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Account #</Label>
                  <Input className="h-7 text-[11px]" placeholder="Account #" value={filters.acct} onChange={(e) => update("acct", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">W.O. #</Label>
                  <Input className="h-7 text-[11px]" placeholder="W.O. #" value={filters.wo} onChange={(e) => update("wo", e.target.value.replace(/\D/g, ""))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Origin</Label>
                  <Select value={filters.origin} onValueChange={(v) => update("origin", v)}>
                    <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Origins</SelectItem>
                      {ORIGINS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Destination</Label>
                  <Select value={filters.destination} onValueChange={(v) => update("destination", v)}>
                    <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Destinations</SelectItem>
                      {DESTINATIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">W.O. Location</Label>
                  <Select value={filters.woLocation} onValueChange={(v) => update("woLocation", v)}>
                    <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {WO_LOCATIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Sort By</Label>
                  <Select value={filters.sortBy} onValueChange={(v) => update("sortBy", v)}>
                    <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dateAdded">Date Added</SelectItem>
                      <SelectItem value="acct">Account #</SelectItem>
                      <SelectItem value="customer">Customer Name</SelectItem>
                      <SelectItem value="destination">Destination</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Sort Direction</Label>
                  <Select value={filters.sortDir} onValueChange={(v) => update("sortDir", v)}>
                    <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-2.5">
                {/* View options */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">View Options</span>
                  <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                    <Checkbox checked={allExpanded} onCheckedChange={(c) => expandAll(!!c)} className="h-3.5 w-3.5" />
                    Expand All
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                    <Checkbox checked={showNotes} onCheckedChange={(c) => setShowNotes(!!c)} className="h-3.5 w-3.5" />
                    Show Notes
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                    <Checkbox checked={rentalOnly} onCheckedChange={(c) => { setRentalOnly(!!c); setPage(1); }} className="h-3.5 w-3.5" />
                    Rental Only
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="h-7 text-[11px]" onClick={() => { setApplied(filters); setPage(1); }}>
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Apply Filters
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={clearFilters}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Table */}
          <Card className="border-border overflow-hidden">
            {pageRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <Truck className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No transit records found</p>
                <p className="text-xs text-muted-foreground">Try adjusting your filters or clearing the current search criteria.</p>
                <Button size="sm" variant="outline" className="h-7 text-[11px] mt-1" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1700px] text-[11px]">
                  <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                    <tr className="border-b border-border text-left text-[10px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-2 py-2 w-8"></th>
                      <th className="px-2 py-2 w-8">
                        <Checkbox checked={allVisibleSelected} onCheckedChange={toggleAllVisible} className="h-3.5 w-3.5" />
                      </th>
                      {orderedColumns.map((c) => (
                        <th
                          key={c.key}
                          className={cn("px-2 py-2 whitespace-nowrap", c.numeric && "text-right", c.thClass)}
                        >
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((r) => {
                      const isOpen = expanded.includes(r.id);
                      const received = r.rcvd >= r.woQty && r.woQty > 0;
                      return (
                        <Fragment key={r.id}>
                          <tr
                            className={cn(
                              "border-b border-border hover:bg-muted/40 transition-colors",
                              ROW_ACCENT[r.priority],
                              selected.includes(r.id) && "bg-muted/50"
                            )}
                          >
                            <td className={cell}>
                              <button
                                onClick={() => toggleExpand(r.id)}
                                className="rounded p-0.5 hover:bg-muted"
                                aria-label={isOpen ? "Collapse batch" : "Expand batch"}
                              >
                                {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                              </button>
                            </td>
                            <td className={cell}>
                              <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggleRow(r.id)} className="h-3.5 w-3.5" />
                            </td>
                            {orderedColumns.map((c) => (
                              <td key={c.key} className={cn(c.numeric ? cellNum : cell, c.tdClass)}>
                                {c.render(r, { navigate })}
                              </td>
                            ))}
                          </tr>

                          {showNotes && r.notes && (
                            <tr key={`${r.id}-notes`} className="border-b border-border bg-muted/20">
                              <td></td>
                              <td colSpan={orderedColumns.length + 1} className="px-2 py-1.5">
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-2">Notes</span>
                                <span className="text-[11px] text-muted-foreground">{r.notes}</span>
                              </td>
                            </tr>
                          )}

                          {isOpen && (
                            <tr key={`${r.id}-items`} className="border-b border-border bg-muted/10">
                              <td></td>
                              <td colSpan={orderedColumns.length + 1} className="px-2 py-2">
                                <div className="overflow-hidden rounded-md border border-border bg-background">
                                  <table className="w-full text-[11px]">
                                    <thead className="bg-muted/60 text-[10px] uppercase tracking-wide text-muted-foreground">
                                      <tr className="border-b border-border text-left">
                                        <th className="w-8 px-2 py-1.5"></th>
                                        <th className="w-12 px-2 py-1.5">Pcs</th>
                                        <th className="w-20 px-2 py-1.5">Acct #</th>
                                        <th className="px-2 py-1.5">Customer Name</th>
                                        <th className="px-2 py-1.5">Batch/Item</th>
                                        <th className="px-2 py-1.5">Rental ID</th>
                                        <th className="px-2 py-1.5">Man/Model</th>
                                        <th className="px-2 py-1.5">Description</th>
                                        <th className="px-2 py-1.5">Priority</th>
                                        <th className="px-2 py-1.5">Division</th>
                                        <th className="px-2 py-1.5">Rcvd On</th>
                                        <th className="px-2 py-1.5">Rcvd By</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {r.items.map((it) => (
                                        <tr key={it.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                          <td className={cell}>
                                            <Checkbox
                                              checked={selectedItems.includes(it.id)}
                                              onCheckedChange={() => toggleItem(it.id)}
                                              className="h-3.5 w-3.5"
                                              disabled={!!it.rcvdOn}
                                            />
                                          </td>
                                          <td className={cellNum}>{it.pcs}</td>
                                          <td className={cn(cell, "whitespace-nowrap")}>{it.acct}</td>
                                          <td className={cn(cell, "max-w-[180px]")}><Truncate value={it.customer} /></td>
                                          <td className={cell}>
                                            <button
                                              className="font-medium text-foreground underline-offset-2 hover:underline"
                                              onClick={() => navigate("/edit-order")}
                                            >
                                              {it.batchItem}
                                            </button>
                                          </td>
                                          <td className={cell}>{it.rentalId || <span className="text-muted-foreground">—</span>}</td>
                                          <td className={cn(cell, "max-w-[140px]")}><Truncate value={it.manModel} /></td>
                                          <td className={cn(cell, "max-w-[240px]")}><Truncate value={it.description} /></td>
                                          <td className={cell}><PriorityBadge priority={it.priority} /></td>
                                          <td className={cell}>{it.division}</td>
                                          <td className={cn(cell, "whitespace-nowrap")}>{it.rcvdOn || <span className="text-muted-foreground">—</span>}</td>
                                          <td className={cell}>{it.rcvdBy || <span className="text-muted-foreground">—</span>}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}

                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2">
              <span className="text-[11px] text-muted-foreground">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} records
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground">Rows per page:</span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                    <SelectTrigger className="h-7 w-[70px] text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-[11px] text-muted-foreground">Page {currentPage} of {totalPages}</span>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>Previous</Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>Next</Button>
              </div>
            </div>
          </Card>
        </main>

        {/* Process confirmation */}
        <Dialog open={processOpen} onOpenChange={setProcessOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-base">Process Selected Transit Items</DialogTitle>
              <DialogDescription className="text-xs">
                Review the records below before running the transit processing workflow.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[50vh] overflow-auto rounded-md border border-border">
              <table className="w-full text-[11px]">
                <thead className="bg-muted/60 text-left text-[10px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-2 py-2">Account #</th>
                    <th className="px-2 py-2">Customer</th>
                    <th className="px-2 py-2">Batch/Item</th>
                    <th className="px-2 py-2">Destination</th>
                    <th className="px-2 py-2">Deliver To</th>
                    <th className="px-2 py-2">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecords.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-2 py-1.5">{r.acct}</td>
                      <td className="px-2 py-1.5">{r.customer}</td>
                      <td className="px-2 py-1.5">{r.batchItem}</td>
                      <td className="px-2 py-1.5">{r.destination}</td>
                      <td className="px-2 py-1.5">{r.deliverTo}</td>
                      <td className="px-2 py-1.5"><PriorityBadge priority={r.priority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setProcessOpen(false)}>Cancel</Button>
              <Button size="sm" className="h-8 text-xs" onClick={confirmProcess}>Confirm Process</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-30 w-full border-t bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.06)] px-2 sm:px-4 lg:px-6 py-2">
          <div className="flex items-center justify-between gap-2">
            <div />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => toast.success("Transit Log report generated")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Report
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={() => setProcessOpen(true)}
                disabled={selectedRecords.length === 0}
              >
                <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                Process
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TransitLog;
