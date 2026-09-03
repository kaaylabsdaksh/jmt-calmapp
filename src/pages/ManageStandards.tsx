import { Fragment, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Download,
  FileSpreadsheet,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  ClipboardList,
  Wrench,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  STANDARDS,
  StandardRecord,
  calibrationStatus,
  CalStatus,
  LOCATIONS,
  LAB_CODES,
  MANUFACTURERS,
  MODELS,
} from "@/lib/standards/data";

type QuickFilter = "all" | "active" | "inactive" | "due-soon" | "overdue";
type SortKey = "standardNo" | "manufacturer" | "model" | "serial" | "lastCalibration" | "nextCalibrationDue";

const emptyAdvanced = {
  standardNo: "",
  manufacturer: "all",
  model: "all",
  description: "",
  serial: "",
  designatedLocation: "all",
  state: "Active",
  workOrderNo: "",
  providerLocation: "all",
  labCode: "all",
  owningAccount: "",
  dueFrom: "",
  dueTo: "",
};

const CalibrationCell = ({ date, status }: { date: string; status: CalStatus }) => {
  if (status === "normal") return <span className="text-foreground">{date}</span>;
  const Icon = status === "overdue" ? AlertTriangle : Clock;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        status === "overdue" ? "text-destructive" : "text-amber-600"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {date}
      <span className="sr-only">{status === "overdue" ? "Overdue" : "Due soon"}</span>
    </span>
  );
};

const StateBadge = ({ state }: { state: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border-transparent px-2 py-0.5 text-[11px] font-medium",
      state === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
    )}
  >
    <span
      className={cn(
        "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
        state === "Active" ? "bg-emerald-500" : "bg-muted-foreground/60"
      )}
    />
    {state}
  </Badge>
);

const ManageStandards = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [advanced, setAdvanced] = useState(emptyAdvanced);
  const [draft, setDraft] = useState(emptyAdvanced);
  const [quick, setQuick] = useState<QuickFilter>("active");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState<Record<string, number>>({});
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "standardNo", dir: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const runSearch = () => {
    setAdvanced(draft);
    setLoading(true);
    setPage(1);
    window.setTimeout(() => setLoading(false), 450);
  };

  const clearAll = () => {
    setQuery("");
    setAdvanced(emptyAdvanced);
    setDraft(emptyAdvanced);
    setQuick("all");
    setPage(1);
  };

  const activeAdvancedCount = useMemo(
    () =>
      Object.entries(advanced).filter(([k, v]) => {
        const base = emptyAdvanced[k as keyof typeof emptyAdvanced];
        return v !== base;
      }).length,
    [advanced]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = STANDARDS.filter((s) => {
      if (
        q &&
        ![s.standardNo, s.manufacturer, s.model, s.serial, s.description, s.owningAccount]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (advanced.standardNo && !s.standardNo.includes(advanced.standardNo)) return false;
      if (advanced.manufacturer !== "all" && s.manufacturer !== advanced.manufacturer) return false;
      if (advanced.model !== "all" && s.model !== advanced.model) return false;
      if (advanced.description && !s.description.toLowerCase().includes(advanced.description.toLowerCase())) return false;
      if (advanced.serial && !s.serial.includes(advanced.serial)) return false;
      if (advanced.designatedLocation !== "all" && s.lab !== advanced.designatedLocation) return false;
      
      if (advanced.providerLocation !== "all" && s.calibrationLocation !== advanced.providerLocation) return false;
      if (advanced.labCode !== "all" && s.labCode !== advanced.labCode) return false;
      if (advanced.owningAccount && !s.owningAccount.includes(advanced.owningAccount)) return false;
      if (advanced.workOrderNo && !s.history.some((h) => h.workOrderNo.includes(advanced.workOrderNo))) return false;
      if (advanced.dueFrom || advanced.dueTo) {
        const due = new Date(s.nextCalibrationDue).getTime();
        if (advanced.dueFrom && due < new Date(advanced.dueFrom).getTime()) return false;
        if (advanced.dueTo && due > new Date(advanced.dueTo).getTime()) return false;
      }
      return true;
    });

    if (quick !== "all") {
      rows = rows.filter((s) => {
        const status = calibrationStatus(s.nextCalibrationDue);
        if (quick === "active") return s.state === "Active";
        if (quick === "inactive") return s.state === "Inactive";
        if (quick === "due-soon") return status === "due-soon";
        return status === "overdue";
      });
    }

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true }) * dir);
  }, [query, advanced, quick, sort]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  const SortableHead = ({ label, sortKey, className }: { label: string; sortKey: SortKey; className?: string }) => (
    <TableHead className={cn("whitespace-nowrap", className)}>
      <button
        type="button"
        onClick={() => toggleSort(sortKey)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-foreground/80"
      >
        {label}
        <ArrowUpDown className={cn("h-3 w-3", sort.key === sortKey ? "text-foreground" : "text-muted-foreground/50")} />
      </button>
    </TableHead>
  );

  const quickChips: { key: QuickFilter; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "due-soon", label: "Due Soon" },
    { key: "overdue", label: "Overdue" },
    { key: "inactive", label: "Inactive" },
    { key: "all", label: "All Standards" },
  ];

  const HISTORY_PAGE_SIZE = 3;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 border-b border-border bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-foreground hover:bg-muted" />
            <div>
              <h1 className="text-lg font-semibold leading-tight text-foreground">Manage Standards</h1>
              <Breadcrumb className="mt-1">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
                      <Link to="/">Equipment</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs text-muted-foreground">Standards</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-medium text-foreground">Manage Standards</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>

        <main className="space-y-4 p-4 lg:p-6">

          {/* Search Criteria */}

          <section className="bg-card rounded-xl shadow-sm border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-foreground">Search Criteria</h2>
              {activeAdvancedCount > 0 && (
                <Badge className="h-4 rounded-full px-1.5 text-[10px]">{activeAdvancedCount}</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
              {/* Equipment — spans 2 columns */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Equipment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="f-standard" className="text-[11px] font-medium text-foreground/80">Standard #</Label>
                    <Input id="f-standard" className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] placeholder:text-[10px]" placeholder="Search standards..." value={draft.standardNo} onChange={(e) => setDraft({ ...draft, standardNo: e.target.value })} onKeyDown={(e) => e.key === "Enter" && runSearch()} />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="f-desc" className="text-[11px] font-medium text-foreground/80">Description</Label>
                    <Input id="f-desc" className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] placeholder:text-[10px]" placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} onKeyDown={(e) => e.key === "Enter" && runSearch()} />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-medium text-foreground/80">Manufacturer</Label>
                    <Select value={draft.manufacturer} onValueChange={(v) => setDraft({ ...draft, manufacturer: v })}>
                      <SelectTrigger className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] [&>svg]:h-3 [&>svg]:w-3"><SelectValue placeholder="All Manufacturers" /></SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-md z-[9999] text-[11px]">
                        <SelectItem value="all">All Manufacturers</SelectItem>
                        {MANUFACTURERS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-medium text-foreground/80">Designated Location</Label>
                    <Select value={draft.designatedLocation} onValueChange={(v) => setDraft({ ...draft, designatedLocation: v })}>
                      <SelectTrigger className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] [&>svg]:h-3 [&>svg]:w-3"><SelectValue placeholder="All Locations" /></SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-md z-[9999] text-[11px]">
                        <SelectItem value="all">All Locations</SelectItem>
                        {LOCATIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="f-model" className="text-[11px] font-medium text-foreground/80">Model</Label>
                    <Select value={draft.model} onValueChange={(v) => setDraft({ ...draft, model: v })}>
                      <SelectTrigger className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] [&>svg]:h-3 [&>svg]:w-3"><SelectValue placeholder="All Models" /></SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-md z-[9999] text-[11px]">
                        <SelectItem value="all">All Models</SelectItem>
                        {MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-medium text-foreground/80">State</Label>
                    <Select value={quick} onValueChange={(v) => { setQuick(v as QuickFilter); setPage(1); }}>
                      <SelectTrigger className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] [&>svg]:h-3 [&>svg]:w-3"><SelectValue placeholder="Active" /></SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-md z-[9999] text-[11px]">
                        {quickChips.map((c) => (
                          <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="f-serial" className="text-[11px] font-medium text-foreground/80">Serial Number</Label>
                    <Input id="f-serial" className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] placeholder:text-[10px]" placeholder="Serial Number" value={draft.serial} onChange={(e) => setDraft({ ...draft, serial: e.target.value })} onKeyDown={(e) => e.key === "Enter" && runSearch()} />
                  </div>
                </div>
              </div>

              {/* Work Order & Ownership */}
              <div className="col-span-1">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Work Order &amp; Ownership</h3>
                <div className="flex flex-col gap-y-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="f-wo" className="text-[11px] font-medium text-foreground/80">WO #</Label>
                    <Input id="f-wo" className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] placeholder:text-[10px]" placeholder="WO #" value={draft.workOrderNo} onChange={(e) => setDraft({ ...draft, workOrderNo: e.target.value })} onKeyDown={(e) => e.key === "Enter" && runSearch()} />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="f-acct" className="text-[11px] font-medium text-foreground/80">Owning Account #</Label>
                    <Input id="f-acct" className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] placeholder:text-[10px]" placeholder="Owning Account #" value={draft.owningAccount} onChange={(e) => setDraft({ ...draft, owningAccount: e.target.value })} onKeyDown={(e) => e.key === "Enter" && runSearch()} />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-medium text-foreground/80">Calibration Provider Location</Label>
                    <Select value={draft.providerLocation} onValueChange={(v) => setDraft({ ...draft, providerLocation: v })}>
                      <SelectTrigger className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] [&>svg]:h-3 [&>svg]:w-3"><SelectValue placeholder="All Provider Locations" /></SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-md z-[9999] text-[11px]">
                        <SelectItem value="all">All Provider Locations</SelectItem>
                        {LOCATIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[11px] font-medium text-foreground/80">Lab Code</Label>
                    <Select value={draft.labCode} onValueChange={(v) => setDraft({ ...draft, labCode: v })}>
                      <SelectTrigger className="h-6 min-h-0 rounded-md border-gray-200 bg-white px-1.5 py-0 text-[11px] [&>svg]:h-3 [&>svg]:w-3"><SelectValue placeholder="All Lab Codes" /></SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-md z-[9999] text-[11px]">
                        <SelectItem value="all">All Lab Codes</SelectItem>
                        {LAB_CODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Calibration + Actions */}
              <div className="col-span-1 flex flex-col">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Calibration</h3>
                <div className="flex flex-col gap-y-2 flex-grow">
                  <div className="space-y-0.5">
                    <Label htmlFor="f-from" className="text-[11px] font-medium text-foreground/80">Calibration Due From</Label>
                    <ModernDatePicker
                      id="f-from"
                      size="xs"
                      value={draft.dueFrom}
                      onChange={(d) => setDraft({ ...draft, dueFrom: d ? format(d, "MM/dd/yyyy") : "" })}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="f-to" className="text-[11px] font-medium text-foreground/80">Calibration Due To</Label>
                    <ModernDatePicker
                      id="f-to"
                      size="xs"
                      value={draft.dueTo}
                      onChange={(d) => setDraft({ ...draft, dueTo: d ? format(d, "MM/dd/yyyy") : "" })}
                    />
                  </div>

                  <div className="mt-auto flex items-center justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={clearAll} className="rounded-lg h-7 px-3 text-[11px] font-medium border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                    <Button onClick={runSearch} className="rounded-lg h-7 px-4 text-[11px] font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                      <Search className="h-3 w-3 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>






          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button className="h-9 gap-2 text-sm" onClick={() => navigate("/standards/new")}>
              <Plus className="h-4 w-4" />
              Add Standard
            </Button>
            <Button variant="outline" className="h-9 gap-2 text-sm" onClick={() => toast.success("Export started.")}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="h-9 gap-2 text-sm"
              onClick={() => toast.success("Export with history started.")}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export with History
            </Button>
            <div className="ml-auto flex flex-wrap items-center gap-1">
              <Button variant="ghost" className="h-9 gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => toast("On-Site Batch Loans")}>
                <Truck className="h-4 w-4" />
                On-Site Batch Loans
              </Button>
              <Button variant="ghost" className="h-9 gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => toast("Create Lab Standard WOs")}>
                <ClipboardList className="h-4 w-4" />
                Create Lab Standard WOs
              </Button>
              <Button variant="ghost" className="h-9 gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => toast("Manage PM / Interim Checks")}>
                <Wrench className="h-4 w-4" />
                Manage PM / Interim Checks
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
            <div className="max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                  <TableRow>
                    <TableHead className="w-8" />
                    <SortableHead label="Standard #" sortKey="standardNo" />
                    <SortableHead label="Manufacturer" sortKey="manufacturer" />
                    <SortableHead label="Model" sortKey="model" />
                    <SortableHead label="Serial" sortKey="serial" />
                    <TableHead className="whitespace-nowrap text-xs font-semibold">Description</TableHead>
                    <SortableHead label="Last Calibration" sortKey="lastCalibration" />
                    <SortableHead label="Next Due" sortKey="nextCalibrationDue" />
                    <TableHead className="whitespace-nowrap text-xs font-semibold">Interval</TableHead>
                    <TableHead className="whitespace-nowrap text-xs font-semibold">Unit</TableHead>
                    <TableHead className="whitespace-nowrap text-xs font-semibold">State</TableHead>
                    <TableHead className="whitespace-nowrap text-xs font-semibold">17025</TableHead>
                    <TableHead className="whitespace-nowrap text-xs font-semibold">Lab Code</TableHead>
                    <TableHead className="whitespace-nowrap text-xs font-semibold">Calibration Location</TableHead>
                    <TableHead className="whitespace-nowrap text-xs font-semibold">Owning Account #</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={`sk-${i}`}>
                        {Array.from({ length: 15 }).map((__, j) => (
                          <TableCell key={j} className="py-2">
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                  {!loading && pageRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={15} className="py-12 text-center">
                        <div className="mx-auto max-w-sm space-y-2">
                          <Search className="mx-auto h-6 w-6 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">No standards found</p>
                          <p className="text-xs text-muted-foreground">
                            Try adjusting your search terms, quick filters, or advanced filters.
                          </p>
                          <Button variant="outline" size="sm" onClick={clearAll}>
                            Clear filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    pageRows.map((s) => {
                      const status = calibrationStatus(s.nextCalibrationDue);
                      const isOpen = expanded === s.id;
                      const hp = historyPage[s.id] ?? 1;
                      const hStart = (hp - 1) * HISTORY_PAGE_SIZE;
                      const hRows = s.history.slice(hStart, hStart + HISTORY_PAGE_SIZE);
                      const hPages = Math.max(1, Math.ceil(s.history.length / HISTORY_PAGE_SIZE));
                      return (
                        <Fragment key={s.id}>
                          <TableRow className="text-xs">
                            <TableCell className="py-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? `Collapse history for ${s.standardNo}` : `Expand history for ${s.standardNo}`}
                                onClick={() => setExpanded(isOpen ? null : s.id)}
                              >
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </Button>
                            </TableCell>
                            <TableCell className="py-1.5 font-medium">
                              <Link to={`/standards/${s.id}`} className="text-foreground underline-offset-2 hover:underline">
                                {s.standardNo}
                              </Link>
                            </TableCell>
                            <TableCell className="py-1.5">{s.manufacturer}</TableCell>
                            <TableCell className="py-1.5">{s.model}</TableCell>
                            <TableCell className="py-1.5">{s.serial}</TableCell>
                            <TableCell className="py-1.5">{s.description}</TableCell>
                            <TableCell className="py-1.5">{s.lastCalibration}</TableCell>
                            <TableCell className="py-1.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <CalibrationCell date={s.nextCalibrationDue} status={status} />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {status === "overdue"
                                    ? "Calibration overdue"
                                    : status === "due-soon"
                                    ? "Calibration due within 45 days"
                                    : "Calibration current"}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="py-1.5">{s.interval}</TableCell>
                            <TableCell className="py-1.5">{s.unit}</TableCell>
                            <TableCell className="py-1.5">
                              <StateBadge state={s.state} />
                            </TableCell>
                            <TableCell className="py-1.5">
                              {s.accredited17025 ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                                </span>
                              ) : (
                                <span className="text-muted-foreground">No</span>
                              )}
                            </TableCell>
                            <TableCell className="py-1.5">{s.labCode}</TableCell>
                            <TableCell className="py-1.5">{s.calibrationLocation}</TableCell>
                            <TableCell className="py-1.5">{s.owningAccount}</TableCell>
                          </TableRow>

                          {isOpen && (
                            <TableRow key={`${s.id}-history`} className="bg-muted/30 hover:bg-muted/30">
                              <TableCell colSpan={15} className="p-0">
                                <div className="space-y-2 p-4">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                      Work Order History — Standard {s.standardNo}
                                    </h3>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 text-xs"
                                      onClick={() => navigate(`/standards/${s.id}?tab=history`)}
                                    >
                                      View full history
                                    </Button>
                                  </div>
                                  <div className="overflow-x-auto rounded-md border border-border bg-white">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-xs font-semibold">Work Order #</TableHead>
                                          <TableHead className="text-xs font-semibold">Certification</TableHead>
                                          <TableHead className="text-xs font-semibold">Completion</TableHead>
                                          <TableHead className="text-xs font-semibold">Recalibration</TableHead>
                                          <TableHead className="text-xs font-semibold">Condition In</TableHead>
                                          <TableHead className="text-xs font-semibold">Condition Out</TableHead>
                                          <TableHead className="text-xs font-semibold">Repair Comments</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {hRows.map((h) => (
                                          <TableRow key={h.workOrderNo} className="text-xs">
                                            <TableCell className="py-1.5 font-medium">{h.workOrderNo}</TableCell>
                                            <TableCell className="py-1.5">{h.certificationDate}</TableCell>
                                            <TableCell className="py-1.5">{h.completionDate}</TableCell>
                                            <TableCell className="py-1.5">{h.recalibrationDate}</TableCell>
                                            <TableCell className="py-1.5">{h.conditionIn}</TableCell>
                                            <TableCell className="py-1.5">{h.conditionOut}</TableCell>
                                            <TableCell className="py-1.5 max-w-[420px] text-muted-foreground">
                                              {h.repairComments}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  {hPages > 1 && (
                                    <div className="flex items-center justify-end gap-2 text-xs">
                                      <span className="text-muted-foreground">
                                        Page {hp} of {hPages}
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7"
                                        disabled={hp === 1}
                                        onClick={() => setHistoryPage((p) => ({ ...p, [s.id]: hp - 1 }))}
                                      >
                                        Previous
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7"
                                        disabled={hp === hPages}
                                        onClick={() => setHistoryPage((p) => ({ ...p, [s.id]: hp + 1 }))}
                                      >
                                        Next
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      );
                    })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-2 border-t border-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {total === 0 ? "No results" : `Showing ${start + 1}–${Math.min(start + pageSize, total)} of ${total} standards`}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="page-size" className="text-xs text-muted-foreground">
                  Rows
                </Label>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="page-size" className="h-8 w-[74px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)} className="text-xs">
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page} of {pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={page >= pageCount}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>

      </div>
    </TooltipProvider>
  );
};

export default ManageStandards;
