import { useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  X,
  FileDown,
  FileText,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  UserPlus,
  RefreshCcwDot,
  History,
  Download,
  Inbox,
  Files,
  FolderOpen,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Route as RouteIcon,
  Info,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";

type CdrStatus =
  | "created"
  | "under-review"
  | "pending-approval"
  | "routed"
  | "completed"
  | "rejected";
type Priority = "low" | "medium" | "high" | "critical";

type CdrRecord = {
  id: string;
  cdr: string;
  status: CdrStatus;
  type: string;
  account: string;
  customer: string;
  po: string;
  location: string;
  received: string;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  routedTo: string;
  priority: Priority;
  documents: { name: string; type: string; version: string }[];
  notes: string;
};

const STATUSES: CdrStatus[] = [
  "created",
  "under-review",
  "pending-approval",
  "routed",
  "completed",
  "rejected",
];
const TYPES = ["Contract Review", "Pricing Agreement", "Safety Document", "Quality Spec", "Purchase Terms"];
const LOCATIONS = ["Houston, TX", "Midland, TX", "Tulsa, OK", "Shreveport, LA", "Wichita, KS"];
const ROUTED = ["Quality", "Engineering", "Compliance", "Sales", "Operations"];
const USERS = ["M. Alvarez", "D. Whitfield", "K. Nguyen", "R. Castillo", "P. Okafor", "S. Brennan"];
const CUSTOMERS = [
  "Lone Star Electric Co-op",
  "Permian Power Services",
  "Gulf Coast Utilities",
  "Red River Energy",
  "Sooner Line Construction",
  "Bayou Transmission LLC",
  "Panhandle Electric",
  "Trinity Power Systems",
];
const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"];

const pad = (n: number, l = 2) => String(n).padStart(l, "0");

const MOCK_CDRS: CdrRecord[] = Array.from({ length: 28 }, (_, i) => {
  const customer = CUSTOMERS[i % CUSTOMERS.length];
  return {
    id: `cdr-${i + 1}`,
    cdr: `CDR-2026-${pad(1001 + i, 4)}`,
    status: STATUSES[i % STATUSES.length],
    type: TYPES[i % TYPES.length],
    account: `1${pad(2400 + i * 17, 4)}`,
    customer,
    po: `PO-${pad(78500 + i * 23, 5)}`,
    location: LOCATIONS[i % LOCATIONS.length],
    received: `0${(i % 6) + 1}/${pad((i % 27) + 1)}/2026`,
    createdDate: `0${(i % 6) + 1}/${pad((i % 25) + 2)}/2026`,
    createdBy: USERS[i % USERS.length],
    modifiedDate: `0${(i % 6) + 1}/${pad((i % 24) + 4)}/2026`,
    modifiedBy: USERS[(i + 3) % USERS.length],
    routedTo: ROUTED[i % ROUTED.length],
    priority: PRIORITIES[i % PRIORITIES.length],
    documents: [
      { name: "master-agreement.pdf", type: "PDF", version: "v2.1" },
      { name: "pricing-schedule.xlsx", type: "Excel", version: "v1.4" },
      { name: "safety-addendum.pdf", type: "PDF", version: "v1.0" },
    ].slice(0, (i % 3) + 1),
    notes:
      i % 2 === 0
        ? "Awaiting legal sign-off on liability clause before routing to Operations."
        : "Customer submitted revised pricing schedule; verify against contract tier.",
  };
});

const STATUS_META: Record<CdrStatus, { label: string; cls: string; dot: string }> = {
  created: { label: "Created", cls: "bg-success/10 text-success", dot: "bg-success" },
  "under-review": { label: "Under Review", cls: "bg-info/10 text-info", dot: "bg-info" },
  "pending-approval": { label: "Pending Approval", cls: "bg-warning/10 text-warning", dot: "bg-warning" },
  routed: { label: "Routed", cls: "bg-muted text-foreground", dot: "bg-foreground" },
  completed: { label: "Completed", cls: "bg-success/10 text-success", dot: "bg-success" },
  rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
};

const PRIORITY_META: Record<Priority, { label: string; cls: string }> = {
  low: { label: "Low", cls: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", cls: "bg-info/10 text-info" },
  high: { label: "High", cls: "bg-warning/10 text-warning" },
  critical: { label: "Critical", cls: "bg-destructive/10 text-destructive" },
};

const statusChip = (s: CdrStatus) => {
  const m = STATUS_META[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${m.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

const priorityChip = (p: Priority) => {
  const m = PRIORITY_META[p];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${m.cls}`}>
      {m.label}
    </span>
  );
};

const ALL_COLUMNS = [
  { key: "type", label: "Type" },
  { key: "account", label: "Account #" },
  { key: "customer", label: "Customer" },
  { key: "po", label: "PO #" },
  { key: "location", label: "Location" },
  { key: "received", label: "Received" },
  { key: "createdDate", label: "Created Date" },
  { key: "createdBy", label: "Created By" },
  { key: "modifiedDate", label: "Modified Date" },
  { key: "modifiedBy", label: "Modified By" },
  { key: "routedTo", label: "Routed To" },
] as const;

type ColKey = (typeof ALL_COLUMNS)[number]["key"];

const emptyFilters = {
  cdr: "",
  status: "all",
  type: "all",
  priority: "all",
  po: "",
  location: "all",
  account: "",
  customer: "",
  routedTo: "all",
  createdFrom: "",
  createdTo: "",
  modifiedFrom: "",
  modifiedTo: "",
  receivedFrom: "",
  receivedTo: "",
};

const CustomerDocumentReviews = () => {
  const { toast } = useToast();

  const [filters, setFilters] = useState(emptyFilters);
  const [query, setQuery] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const advancedCount = Object.entries(filters).filter(
    ([k, v]) => k !== "status" && k !== "type" && v !== "" && v !== "all"
  ).length;
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<CdrRecord | null>(null);
  const [sortKey, setSortKey] = useState<"cdr" | "customer" | "createdDate">("cdr");
  const [sortAsc, setSortAsc] = useState(true);
  const [visible, setVisible] = useState<ColKey[]>(ALL_COLUMNS.map((c) => c.key));

  const setF = (k: keyof typeof emptyFilters, v: string) =>
    setFilters((prev) => ({ ...prev, [k]: v }));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const like = (value: string, term: string) => {
      const t = term.trim().toLowerCase();
      if (!t) return true;
      const v = value.toLowerCase();
      if (t.startsWith("%") && t.endsWith("%")) return v.includes(t.slice(1, -1));
      if (t.startsWith("%")) return v.endsWith(t.slice(1));
      if (t.endsWith("%")) return v.startsWith(t.slice(0, -1));
      return v.includes(t);
    };

    const filtered = MOCK_CDRS.filter((r) => {
      if (!like(r.cdr, filters.cdr)) return false;
      if (!like(r.po, filters.po)) return false;
      if (!like(r.account, filters.account)) return false;
      if (!like(r.customer, filters.customer)) return false;
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (filters.type !== "all" && r.type !== filters.type) return false;
      if (filters.priority !== "all" && r.priority !== filters.priority) return false;
      if (filters.location !== "all" && r.location !== filters.location) return false;
      if (filters.routedTo !== "all" && r.routedTo !== filters.routedTo) return false;
      if (q) {
        const hay = [r.cdr, r.customer, r.account, r.po, r.location, r.routedTo, r.createdBy, r.modifiedBy]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      const res = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortAsc ? res : -res;
    });
  }, [filters, query, sortKey, sortAsc]);

  const kpis = useMemo(
    () => [
      { label: "Total CDRs", value: rows.length, icon: Files },
      { label: "Open Reviews", value: rows.filter((r) => r.status === "created").length, icon: FolderOpen },
      { label: "In Progress", value: rows.filter((r) => r.status === "under-review").length, icon: Loader2 },
      { label: "Completed", value: rows.filter((r) => r.status === "completed").length, icon: CheckCircle2 },
      {
        label: "High Priority",
        value: rows.filter((r) => r.priority === "high" || r.priority === "critical").length,
        icon: AlertTriangle,
      },
      { label: "Routed Today", value: rows.filter((r) => r.status === "routed").length, icon: RouteIcon },
    ],
    [rows]
  );

  const allSelected = rows.length > 0 && selected.length === rows.length;
  const isVisible = (k: ColKey) => visible.includes(k);

  const runSearch = () => {
    setLoading(true);
    setSelected([]);
    window.setTimeout(() => {
      setLoading(false);
      toast({ title: "Search Complete", description: `${rows.length} customer document reviews found.` });
    }, 600);
  };

  const clearAll = () => {
    setFilters(emptyFilters);
    setQuery("");
    setSelected([]);
  };

  const notify = (title: string, description?: string) => toast({ title, description });

  const toggleSort = (key: "cdr" | "customer" | "createdDate") => {
    if (sortKey === key) setSortAsc((s) => !s);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const labelCls = "text-[10px] font-medium text-muted-foreground uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-background">
      <ModernTopNav />

      <div className="px-3 sm:px-4 lg:px-6 py-4 pb-24 space-y-3">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Customer Document Reviews</h2>
            <p className="text-xs text-muted-foreground">
              Search, manage and monitor customer document review requests across locations and departments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 text-xs" onClick={() => notify("CDR Created Successfully", "A new customer document review was started.")}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />Add New CDR
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => notify("Export Completed", "Current results exported.")}>
              <FileDown className="h-3.5 w-3.5 mr-1.5" />Export
            </Button>
          </div>
        </div>

        {/* Search & filters */}
        <Card className="shadow-sm">
          <CardContent className="p-2.5">
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="space-y-2">
              {/* Primary compact bar */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search CDR, customer, PO, reviewer"
                    className="h-7 pl-7 text-xs"
                  />
                </div>
                <Select value={filters.status} onValueChange={(v) => setF("status", v)}>
                  <SelectTrigger className="h-7 w-[140px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                    {STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{STATUS_META[s].label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filters.type} onValueChange={(v) => setF("type", v)}>
                  <SelectTrigger className="h-7 w-[140px] text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Types</SelectItem>
                    {TYPES.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                    Filters
                    {advancedCount > 0 && (
                      <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] font-medium">{advancedCount}</span>
                    )}
                    <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <Button size="sm" className="h-7 text-xs" onClick={runSearch}>
                  <Search className="h-3.5 w-3.5 mr-1.5" />Search
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAll}>
                  <X className="h-3.5 w-3.5 mr-1.5" />Clear
                </Button>
              </div>

              <CollapsibleContent className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                  <div className="space-y-1">
                    <label className={labelCls}>CDR Number</label>
                    <Input value={filters.cdr} onChange={(e) => setF("cdr", e.target.value)} placeholder="CDR-2026-%" className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Priority</label>
                    <Select value={filters.priority} onValueChange={(v) => setF("priority", v)}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">All</SelectItem>
                        {PRIORITIES.map((p) => <SelectItem key={p} value={p} className="text-xs">{PRIORITY_META[p].label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Purchase Order #</label>
                    <Input value={filters.po} onChange={(e) => setF("po", e.target.value)} placeholder="PO-%" className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Location</label>
                    <Select value={filters.location} onValueChange={(v) => setF("location", v)}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">All</SelectItem>
                        {LOCATIONS.map((l) => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Account Number</label>
                    <Input value={filters.account} onChange={(e) => setF("account", e.target.value)} placeholder="Account #" className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Customer Name</label>
                    <Input value={filters.customer} onChange={(e) => setF("customer", e.target.value)} placeholder="Customer" className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Routed To</label>
                    <Select value={filters.routedTo} onValueChange={(v) => setF("routedTo", v)}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">All</SelectItem>
                        {ROUTED.map((r) => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Created From</label>
                    <Input type="date" value={filters.createdFrom} onChange={(e) => setF("createdFrom", e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Created To</label>
                    <Input type="date" value={filters.createdTo} onChange={(e) => setF("createdTo", e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Modified From</label>
                    <Input type="date" value={filters.modifiedFrom} onChange={(e) => setF("modifiedFrom", e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Modified To</label>
                    <Input type="date" value={filters.modifiedTo} onChange={(e) => setF("modifiedTo", e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Received From</label>
                    <Input type="date" value={filters.receivedFrom} onChange={(e) => setF("receivedFrom", e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Received To</label>
                    <Input type="date" value={filters.receivedTo} onChange={(e) => setF("receivedTo", e.target.value)} className="h-7 text-xs" />
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Info className="h-3.5 w-3.5" />
                  Use % before or after text to perform partial searches.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="shadow-sm"><CardContent className="p-2.5"><Skeleton className="h-8 w-full" /></CardContent></Card>
              ))
            : kpis.map((k) => (
                <Card key={k.label} className="shadow-sm">
                  <CardContent className="p-2.5 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <k.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground truncate">{k.label}</p>
                      <p className="text-sm font-semibold text-foreground leading-tight">{k.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b">
              <p className="text-xs text-muted-foreground">
                {loading ? "Loading…" : `${rows.length} record${rows.length === 1 ? "" : "s"}`}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">Columns</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
                  {ALL_COLUMNS.map((c) => (
                    <DropdownMenuCheckboxItem
                      key={c.key}
                      className="text-xs"
                      checked={isVisible(c.key)}
                      onCheckedChange={(chk) =>
                        setVisible((prev) => (chk ? [...prev, c.key] : prev.filter((k) => k !== c.key)))
                      }
                    >
                      {c.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {loading ? (
              <div className="p-3 space-y-2">
                {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No Customer Document Reviews found.</p>
                <p className="text-xs text-muted-foreground">Adjust your filters and try again.</p>
                <Button variant="outline" size="sm" className="h-7 text-xs mt-1" onClick={clearAll}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Reset Filters
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[60vh]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-card">
                    <TableRow className="[&>th]:py-1.5 [&>th]:text-[10px] [&>th]:uppercase [&>th]:tracking-wide [&>th]:whitespace-nowrap">
                      <TableHead className="w-8">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={(c) => setSelected(c ? rows.map((r) => r.id) : [])}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => toggleSort("cdr")}>CDR #</TableHead>
                      <TableHead>Status</TableHead>
                      {isVisible("type") && <TableHead>Type</TableHead>}
                      {isVisible("account") && <TableHead>Account #</TableHead>}
                      {isVisible("customer") && (
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("customer")}>Customer</TableHead>
                      )}
                      {isVisible("po") && <TableHead>PO #</TableHead>}
                      {isVisible("location") && <TableHead>Location</TableHead>}
                      {isVisible("received") && <TableHead>Received</TableHead>}
                      {isVisible("createdDate") && (
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("createdDate")}>Created Date</TableHead>
                      )}
                      {isVisible("createdBy") && <TableHead>Created By</TableHead>}
                      {isVisible("modifiedDate") && <TableHead>Modified Date</TableHead>}
                      {isVisible("modifiedBy") && <TableHead>Modified By</TableHead>}
                      {isVisible("routedTo") && <TableHead>Routed To</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id} className="[&>td]:py-1.5 [&>td]:text-xs [&>td]:whitespace-nowrap">
                        <TableCell>
                          <Checkbox
                            checked={selected.includes(r.id)}
                            onCheckedChange={(c) =>
                              setSelected((prev) => (c ? [...prev, r.id] : prev.filter((id) => id !== r.id)))
                            }
                            aria-label={`Select ${r.cdr}`}
                          />
                        </TableCell>
                        <TableCell>
                          <button
                            className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
                            onClick={() => setDrawer(r)}
                          >
                            {r.cdr.split("-").pop()}
                          </button>
                        </TableCell>

                        <TableCell>{statusChip(r.status)}</TableCell>
                        {isVisible("type") && <TableCell>{r.type}</TableCell>}
                        {isVisible("account") && <TableCell>{r.account}</TableCell>}
                        {isVisible("customer") && <TableCell className="max-w-[200px] truncate">{r.customer}</TableCell>}
                        {isVisible("po") && <TableCell>{r.po}</TableCell>}
                        {isVisible("location") && <TableCell>{r.location}</TableCell>}
                        {isVisible("received") && <TableCell>{r.received}</TableCell>}
                        {isVisible("createdDate") && <TableCell>{r.createdDate}</TableCell>}
                        {isVisible("createdBy") && <TableCell>{r.createdBy}</TableCell>}
                        {isVisible("modifiedDate") && <TableCell>{r.modifiedDate}</TableCell>}
                        {isVisible("modifiedBy") && <TableCell>{r.modifiedBy}</TableCell>}
                        {isVisible("routedTo") && <TableCell>{r.routedTo}</TableCell>}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
          <Card className="shadow-lg">
            <CardContent className="p-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-foreground px-1">{selected.length} selected</span>
              <Separator orientation="vertical" className="h-5" />
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Export Completed", `${selected.length} records exported.`)}>
                <FileDown className="h-3.5 w-3.5 mr-1.5" />Export Selected
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Status Updated", `${selected.length} records updated.`)}>
                <RefreshCcwDot className="h-3.5 w-3.5 mr-1.5" />Change Status
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Reviewer Assigned", `${selected.length} records assigned.`)}>
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />Assign Reviewer
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Routing Complete", `${selected.length} records routed.`)}>
                <RouteIcon className="h-3.5 w-3.5 mr-1.5" />Route to Department
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Download Started", "Documents are being prepared.")}>
                <Download className="h-3.5 w-3.5 mr-1.5" />Download Documents
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelected([])}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick view drawer */}
      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {drawer && (
            <>
              <SheetHeader>
                <SheetTitle className="text-sm flex items-center gap-2">
                  {drawer.cdr} {statusChip(drawer.status)}
                </SheetTitle>
                <SheetDescription className="text-xs">{drawer.customer}</SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <section className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Customer Information</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Customer:</span> {drawer.customer}</div>
                    <div><span className="text-muted-foreground">Account:</span> {drawer.account}</div>
                    <div><span className="text-muted-foreground">Location:</span> {drawer.location}</div>
                    <div><span className="text-muted-foreground">PO #:</span> {drawer.po}</div>
                  </div>
                </section>
                <Separator />
                <section className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Review Information</p>
                  <div className="grid grid-cols-2 gap-2 text-xs items-center">
                    <div className="flex items-center gap-1.5"><span className="text-muted-foreground">Status:</span> {statusChip(drawer.status)}</div>
                    <div><span className="text-muted-foreground">Type:</span> {drawer.type}</div>
                    <div className="flex items-center gap-1.5"><span className="text-muted-foreground">Priority:</span> {priorityChip(drawer.priority)}</div>
                    <div><span className="text-muted-foreground">Routed Team:</span> {drawer.routedTo}</div>
                  </div>
                </section>
                <Separator />
                <section className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Timeline</p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { label: "Created", value: `${drawer.createdDate} · ${drawer.createdBy}` },
                      { label: "Received", value: drawer.received },
                      { label: "Modified", value: `${drawer.modifiedDate} · ${drawer.modifiedBy}` },
                    ].map((t) => (
                      <div key={t.label} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">{t.label}</p>
                          <p className="text-muted-foreground">{t.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <Separator />
                <section className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Attached Documents</p>
                  <div className="space-y-1">
                    {drawer.documents.map((d) => (
                      <div key={d.name} className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{d.name}</p>
                          <p className="text-[10px] text-muted-foreground">{d.type} · {d.version}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => notify("Download Started", d.name)}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
                <Separator />
                <section className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Notes</p>
                  <p className="text-xs text-muted-foreground">{drawer.notes}</p>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CustomerDocumentReviews;
