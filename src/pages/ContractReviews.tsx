import { useMemo, useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  FileDown,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  UserPlus,
  RefreshCcwDot,
  History,
  Download,
  Link2,
  Inbox,
  Files,
  FolderOpen,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Archive,
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

type CrStatus =
  | "draft"
  | "in-progress"
  | "pending-review"
  | "waiting-approval"
  | "approved"
  | "rejected"
  | "closed";

type DocType = "MSA" | "NDA" | "Service Agreement" | "Pricing Agreement" | "Other";

type CrRecord = {
  id: string;
  cr: string;
  status: CrStatus;
  docType: DocType;
  account: string;
  customer: string;
  received: string;
  linkedCdr: string;
  cdrStatus: string;
  createdDate: string;
  createdBy: string;
  submittedBy: string;
  submittedDate: string;
  modifiedDate: string;
  documents: { name: string; version: string; uploaded: string }[];
  notes: string;
};

const STATUSES: CrStatus[] = [
  "draft",
  "in-progress",
  "pending-review",
  "waiting-approval",
  "approved",
  "rejected",
  "closed",
];

const DOC_TYPES: DocType[] = ["MSA", "NDA", "Service Agreement", "Pricing Agreement", "Other"];
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
const CDR_STATUSES = ["Created", "Under Review", "Completed", "Pending Approval"];

const pad = (n: number, l = 2) => String(n).padStart(l, "0");

const parseDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  const [m, d, y] = value.split("/");
  if (!m || !d || !y) return undefined;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.getFullYear() === Number(y) && date.getMonth() === Number(m) - 1 && date.getDate() === Number(d) ? date : undefined;
};

const formatDate = (value: Date | undefined): string => {
  if (!value) return "";
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  const y = value.getFullYear();
  return `${m}/${d}/${y}`;
};

const MOCK_CRS: CrRecord[] = Array.from({ length: 30 }, (_, i) => ({
  id: `cr-${i + 1}`,
  cr: `CR-2026-${pad(2001 + i, 4)}`,
  status: STATUSES[i % STATUSES.length],
  docType: DOC_TYPES[i % DOC_TYPES.length],
  account: `1${pad(2400 + i * 19, 4)}`,
  customer: CUSTOMERS[i % CUSTOMERS.length],
  received: `0${(i % 6) + 1}/${pad((i % 27) + 1)}/2026`,
  linkedCdr: i % 4 === 3 ? "" : `CDR-2026-${pad(1001 + i, 4)}`,
  cdrStatus: i % 4 === 3 ? "" : CDR_STATUSES[i % CDR_STATUSES.length],
  createdDate: `0${(i % 6) + 1}/${pad((i % 25) + 2)}/2026`,
  createdBy: USERS[i % USERS.length],
  submittedBy: USERS[(i + 2) % USERS.length],
  submittedDate: `0${(i % 6) + 1}/${pad((i % 26) + 2)}/2026`,
  modifiedDate: `0${(i % 6) + 1}/${pad((i % 24) + 4)}/2026`,
  documents: [
    { name: "master-service-agreement.pdf", version: "v2.1", uploaded: "03/12/2026" },
    { name: "pricing-exhibit-a.xlsx", version: "v1.4", uploaded: "03/14/2026" },
    { name: "insurance-certificate.pdf", version: "v1.0", uploaded: "03/18/2026" },
  ].slice(0, (i % 3) + 1),
  notes:
    i % 2 === 0
      ? "Legal review pending on indemnification clause; reviewer notified."
      : "Customer returned redlines on payment terms; awaiting internal approval.",
}));

const STATUS_META: Record<CrStatus, { label: string; cls: string; dot: string }> = {
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  "in-progress": { label: "In Progress", cls: "bg-info/10 text-info", dot: "bg-info" },
  "pending-review": { label: "Pending Review", cls: "bg-warning/10 text-warning", dot: "bg-warning" },
  "waiting-approval": { label: "Waiting for Approval", cls: "bg-warning/10 text-warning", dot: "bg-warning" },
  approved: { label: "Approved", cls: "bg-success/10 text-success", dot: "bg-success" },
  rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  closed: { label: "Closed", cls: "bg-muted text-foreground", dot: "bg-foreground" },
};

const statusChip = (s: CrStatus) => {
  const m = STATUS_META[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${m.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

const typeBadge = (t: DocType) => (
  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
    {t}
  </span>
);

const ALL_COLUMNS = [
  { key: "docType", label: "Document Type" },
  { key: "account", label: "Account #" },
  { key: "customer", label: "Customer" },
  { key: "received", label: "Received Date" },
  { key: "linkedCdr", label: "Linked CDR #" },
  { key: "cdrStatus", label: "CDR Status" },
  { key: "createdDate", label: "Created Date" },
  { key: "createdBy", label: "Created By" },
  { key: "submittedBy", label: "Submitted By" },
] as const;

type ColKey = (typeof ALL_COLUMNS)[number]["key"];

const emptyFilters = {
  cr: "",
  status: "all",
  docType: "all",
  createdBy: "all",
  submittedBy: "all",
  account: "",
  customer: "",
  createdFrom: "",
  createdTo: "",
  modifiedFrom: "",
  modifiedTo: "",
  receivedFrom: "",
  receivedTo: "",
};

const ContractReviews = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(emptyFilters);
  const [query, setQuery] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<CrRecord | null>(null);
  const [sortKey, setSortKey] = useState<"cr" | "customer" | "createdDate">("cr");
  const [sortAsc, setSortAsc] = useState(true);
  const [visible, setVisible] = useState<ColKey[]>(ALL_COLUMNS.map((c) => c.key));

  const advancedCount = Object.entries(filters).filter(
    ([k, v]) => k !== "status" && k !== "docType" && v !== "" && v !== "all"
  ).length;

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

    const filtered = MOCK_CRS.filter((r) => {
      if (!like(r.cr, filters.cr)) return false;
      if (!like(r.account, filters.account)) return false;
      if (!like(r.customer, filters.customer)) return false;
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (filters.docType !== "all" && r.docType !== filters.docType) return false;
      if (filters.createdBy !== "all" && r.createdBy !== filters.createdBy) return false;
      if (filters.submittedBy !== "all" && r.submittedBy !== filters.submittedBy) return false;
      if (q) {
        const hay = [r.cr, r.customer, r.account, r.docType, r.createdBy, r.submittedBy, r.linkedCdr]
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
      { label: "Total Reviews", value: rows.length, icon: Files },
      { label: "In Progress", value: rows.filter((r) => r.status === "in-progress").length, icon: Loader2 },
      { label: "Pending Review", value: rows.filter((r) => r.status === "pending-review").length, icon: FolderOpen },
      { label: "Approved", value: rows.filter((r) => r.status === "approved").length, icon: CheckCircle2 },
      { label: "Rejected", value: rows.filter((r) => r.status === "rejected").length, icon: XCircle },
      { label: "Recently Submitted", value: rows.filter((r) => r.status === "waiting-approval").length, icon: Clock },
    ],
    [rows]
  );

  const allSelected = rows.length > 0 && selected.length === rows.length;
  const isVisible = (k: ColKey) => visible.includes(k);

  const notify = (title: string, description?: string) => toast({ title, description });

  const runSearch = () => {
    setLoading(true);
    setSelected([]);
    window.setTimeout(() => {
      setLoading(false);
      notify("Search Complete", `${rows.length} contract reviews found.`);
    }, 600);
  };

  const clearAll = () => {
    setFilters(emptyFilters);
    setQuery("");
    setSelected([]);
  };

  const toggleSort = (key: "cr" | "customer" | "createdDate") => {
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
            <h2 className="text-base font-semibold text-foreground">Contract Reviews</h2>
            <p className="text-xs text-muted-foreground">
              Search, review and manage customer contract review requests throughout their approval lifecycle.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-customers/contract-reviews/new")}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />Add New Contract Review
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <FileDown className="h-3.5 w-3.5 mr-1.5" />Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Export Current Results</DropdownMenuLabel>
                {["CSV", "Excel", "PDF"].map((f) => (
                  <DropdownMenuItem key={`cur-${f}`} className="text-xs" onClick={() => notify("Export Completed", `Current results exported as ${f}.`)}>
                    {f}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Export All Results</DropdownMenuLabel>
                {["CSV", "Excel", "PDF"].map((f) => (
                  <DropdownMenuItem key={`all-${f}`} className="text-xs" onClick={() => notify("Export Completed", `All results exported as ${f}.`)}>
                    {f}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search & filters */}
        <Card className="shadow-sm">
          <CardContent className="p-2.5">
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search CR #, customer, account, CDR #, submitter"
                    className="h-7 pl-7 text-xs"
                  />
                </div>
                <Select value={filters.status} onValueChange={(v) => setF("status", v)}>
                  <SelectTrigger className="h-7 w-[150px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                    {STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{STATUS_META[s].label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filters.docType} onValueChange={(v) => setF("docType", v)}>
                  <SelectTrigger className="h-7 w-[150px] text-xs"><SelectValue placeholder="Document Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">All Types</SelectItem>
                    {DOC_TYPES.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
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
                    <label className={labelCls}>Contract Review # </label>
                    <Input value={filters.cr} onChange={(e) => setF("cr", e.target.value)} placeholder="CR-2026-%" className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Created By</label>
                    <Select value={filters.createdBy} onValueChange={(v) => setF("createdBy", v)}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">All</SelectItem>
                        {USERS.map((u) => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Submitted By</label>
                    <Select value={filters.submittedBy} onValueChange={(v) => setF("submittedBy", v)}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">All</SelectItem>
                        {USERS.map((u) => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}
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
                    <label className={labelCls}>Created From / To</label>
                    <DateRangePicker
                      dateFrom={parseDate(filters.createdFrom)}
                      dateTo={parseDate(filters.createdTo)}
                      onDateFromChange={(d) => setF("createdFrom", formatDate(d))}
                      onDateToChange={(d) => setF("createdTo", formatDate(d))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Modified From / To</label>
                    <DateRangePicker
                      dateFrom={parseDate(filters.modifiedFrom)}
                      dateTo={parseDate(filters.modifiedTo)}
                      onDateFromChange={(d) => setF("modifiedFrom", formatDate(d))}
                      onDateToChange={(d) => setF("modifiedTo", formatDate(d))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Received From / To</label>
                    <DateRangePicker
                      dateFrom={parseDate(filters.receivedFrom)}
                      dateTo={parseDate(filters.receivedTo)}
                      onDateFromChange={(d) => setF("receivedFrom", formatDate(d))}
                      onDateToChange={(d) => setF("receivedTo", formatDate(d))}
                    />
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
                <p className="text-sm font-medium text-foreground">No Contract Reviews found.</p>
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
                      <TableHead className="cursor-pointer" onClick={() => toggleSort("cr")}>CR #</TableHead>
                      <TableHead>Status</TableHead>
                      {isVisible("docType") && <TableHead>Document Type</TableHead>}
                      {isVisible("account") && <TableHead>Account #</TableHead>}
                      {isVisible("customer") && (
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("customer")}>Customer</TableHead>
                      )}
                      {isVisible("received") && <TableHead>Received Date</TableHead>}
                      {isVisible("linkedCdr") && <TableHead>Linked CDR #</TableHead>}
                      {isVisible("cdrStatus") && <TableHead>CDR Status</TableHead>}
                      {isVisible("createdDate") && (
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("createdDate")}>Created Date</TableHead>
                      )}
                      {isVisible("createdBy") && <TableHead>Created By</TableHead>}
                      {isVisible("submittedBy") && <TableHead>Submitted By</TableHead>}
                      <TableHead className="w-10 text-right">Actions</TableHead>
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
                            aria-label={`Select ${r.cr}`}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            className="h-auto p-0 font-medium text-foreground underline underline-offset-2 hover:no-underline"
                            onClick={() => navigate(`/manage-customers/contract-reviews/${r.cr.split("-").pop()}`)}
                          >
                            {r.cr.split("-").pop()}
                          </Button>
                        </TableCell>
                        <TableCell>{statusChip(r.status)}</TableCell>
                        {isVisible("docType") && <TableCell>{typeBadge(r.docType)}</TableCell>}
                        {isVisible("account") && <TableCell>{r.account}</TableCell>}
                        {isVisible("customer") && <TableCell className="max-w-[200px] truncate">{r.customer}</TableCell>}
                        {isVisible("received") && <TableCell>{r.received}</TableCell>}
                        {isVisible("linkedCdr") && (
                          <TableCell>
                            {r.linkedCdr ? r.linkedCdr.split("-").pop() : <span className="text-muted-foreground">—</span>}
                          </TableCell>
                        )}
                        {isVisible("cdrStatus") && (
                          <TableCell>{r.cdrStatus || <span className="text-muted-foreground">—</span>}</TableCell>
                        )}
                        {isVisible("createdDate") && <TableCell>{r.createdDate}</TableCell>}
                        {isVisible("createdBy") && <TableCell>{r.createdBy}</TableCell>}
                        {isVisible("submittedBy") && <TableCell>{r.submittedBy}</TableCell>}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-xs" onClick={() => navigate(`/manage-customers/contract-reviews/${r.cr.split("-").pop()}`)}>
                                <Eye className="h-3.5 w-3.5 mr-2" />Open Contract Review
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => navigate(`/manage-customers/contract-reviews/${r.cr.split("-").pop()}`)}>
                                <Pencil className="h-3.5 w-3.5 mr-2" />Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Reviewer Assigned", r.cr)}>
                                <UserPlus className="h-3.5 w-3.5 mr-2" />Assign Reviewer
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Status Updated", r.cr)}>
                                <RefreshCcwDot className="h-3.5 w-3.5 mr-2" />Change Status
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("CDR Linked", r.cr)}>
                                <Link2 className="h-3.5 w-3.5 mr-2" />Link CDR
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Timeline", `Viewing timeline for ${r.cr}.`)}>
                                <History className="h-3.5 w-3.5 mr-2" />View Timeline
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Download Started", `${r.cr} contract documents.`)}>
                                <Download className="h-3.5 w-3.5 mr-2" />Download Contract
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Export Completed", `${r.cr} exported.`)}>
                                <FileDown className="h-3.5 w-3.5 mr-2" />Export Record
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
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
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Reviewer Assigned", `${selected.length} records assigned.`)}>
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />Assign Reviewer
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Status Updated", `${selected.length} records updated.`)}>
                <RefreshCcwDot className="h-3.5 w-3.5 mr-1.5" />Change Status
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Download Started", "Documents are being prepared.")}>
                <Download className="h-3.5 w-3.5 mr-1.5" />Download Documents
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Records Archived", `${selected.length} records archived.`)}>
                <Archive className="h-3.5 w-3.5 mr-1.5" />Archive
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
                  {drawer.cr} {statusChip(drawer.status)}
                </SheetTitle>
                <SheetDescription className="text-xs">{drawer.customer}</SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <section className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Contract Information</p>
                  <div className="grid grid-cols-2 gap-2 text-xs items-center">
                    <div className="flex items-center gap-1.5"><span className="text-muted-foreground">Status:</span> {statusChip(drawer.status)}</div>
                    <div className="flex items-center gap-1.5"><span className="text-muted-foreground">Type:</span> {typeBadge(drawer.docType)}</div>
                    <div><span className="text-muted-foreground">Customer:</span> {drawer.customer}</div>
                    <div><span className="text-muted-foreground">Account:</span> {drawer.account}</div>
                  </div>
                </section>
                <Separator />
                <section className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Linked CDR</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">CDR #:</span> {drawer.linkedCdr || "—"}</div>
                    <div><span className="text-muted-foreground">Status:</span> {drawer.cdrStatus || "—"}</div>
                  </div>
                </section>
                <Separator />
                <section className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Timeline</p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { label: "Created", value: `${drawer.createdDate} · ${drawer.createdBy}` },
                      { label: "Submitted", value: `${drawer.submittedDate} · ${drawer.submittedBy}` },
                      { label: "Received", value: drawer.received },
                      { label: "Last Modified", value: drawer.modifiedDate },
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
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Attached Files</p>
                  <div className="space-y-1">
                    {drawer.documents.map((d) => (
                      <div key={d.name} className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{d.name}</p>
                          <p className="text-[10px] text-muted-foreground">{d.version} · Uploaded {d.uploaded}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => notify("Download Started", d.name)}>
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

export default ContractReviews;
