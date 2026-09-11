import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  SlidersHorizontal,
  RotateCcw,
  Pencil,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  X,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  VENDORS,
  VendorRecord,
  STATES,
  CRITICALITY,
  QUALIFICATION_BASIS,
  VENDOR_STATUS,
  YesNo,
  expiryState,
} from "@/lib/vendors/data";

const emptyFilters = {
  id: "",
  name: "",
  address: "",
  city: "",
  state: "all",
  zip: "",
  status: "all",
  approvalFrom: "",
  approvalTo: "",
  criticality: "all",
  iso9001: "all",
  qf133: "all",
  oem: "all",
  qf131: "all",
  qualificationBasedOn: "all",
  z540: "all",
  expiresFrom: "",
  expiresTo: "",
};
type Filters = typeof emptyFilters;

const emptyColumnFilters = {
  id: "",
  name: "",
  address: "",
  city: "",
  state: "all",
  zip: "",
  originalApprovalDate: "",
  criticality: "all",
  iso9001: "all",
  qf133: "all",
  oem: "all",
  qf131: "all",
  qualificationBasedOn: "all",
  z540: "all",
  comments: "",
  status: "all",
  approvalExpires: "",
};
type ColumnFilters = typeof emptyColumnFilters;

const FIELD = "h-7 min-h-0 rounded-md border-gray-200 bg-white px-2 py-0 text-[11px]";
const FIELD_ACTIVE = "border-slate-700 bg-slate-100 text-slate-900 font-semibold";
const fieldClass = (v: string, extra = "") =>
  cn(FIELD, extra, v && v !== "all" && FIELD_ACTIVE);
const LABEL = "text-[11px] font-medium text-foreground/80";
const SELECT_CONTENT =
  "bg-white border border-gray-200 shadow-xl rounded-md z-[9999] text-[11px]";

const YesNoBadge = ({ value }: { value: YesNo }) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border-transparent px-1.5 py-0 text-[10px] font-medium",
      value === "Yes" ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
    )}
  >
    {value}
  </Badge>
);

const StatusBadge = ({ status }: { status: VendorRecord["status"] }) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border-transparent px-2 py-0.5 text-[11px] font-medium",
      status === "Active" && "bg-emerald-50 text-emerald-700",
      status === "Pending" && "bg-amber-50 text-amber-700",
      status === "Inactive" && "bg-muted text-muted-foreground"
    )}
  >
    <span
      className={cn(
        "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
        status === "Active" && "bg-emerald-500",
        status === "Pending" && "bg-amber-500",
        status === "Inactive" && "bg-muted-foreground/60"
      )}
    />
    {status}
  </Badge>
);

const ExpiryCell = ({ value }: { value: string }) => {
  const state = expiryState(value);
  if (state === "ok") return <span className="text-foreground">{value}</span>;
  const Icon = state === "expired" ? AlertTriangle : Clock;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        state === "expired" ? "text-destructive" : "text-amber-600"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {value}
      <span className="sr-only">{state === "expired" ? "Expired" : "Expiring soon"}</span>
    </span>
  );
};

const Truncated = ({ text, className }: { text: string; className?: string }) => {
  if (!text) return <span className="text-muted-foreground">—</span>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("block truncate", className)}>{text}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
    </Tooltip>
  );
};

const yesNoMatch = (filter: string, value: YesNo) => filter === "all" || filter === value;
const textMatch = (filter: string, value: string) =>
  !filter.trim() || value.toLowerCase().includes(filter.trim().toLowerCase());
const inRange = (value: string, from: string, to: string) => {
  if (!from && !to) return true;
  const d = new Date(value).getTime();
  if (from && d < new Date(from).getTime()) return false;
  if (to && d > new Date(to).getTime()) return false;
  return true;
};

const blankVendor = (): VendorRecord => ({
  id: "",
  name: "",
  address: "",
  city: "",
  state: "TX",
  zip: "",
  originalApprovalDate: "",
  criticality: "Major",
  iso9001: "No",
  qf133: "No",
  oem: "No",
  qf131: "No",
  qualificationBasedOn: QUALIFICATION_BASIS[0],
  z540: "No",
  comments: "",
  status: "Active",
  approvalExpires: "",
});

const OutsourceVendors = () => {
  const [vendors, setVendors] = useState<VendorRecord[]>(VENDORS);
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>(emptyColumnFilters);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [editing, setEditing] = useState<VendorRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeCount = useMemo(
    () =>
      (Object.keys(emptyFilters) as (keyof Filters)[]).filter(
        (k) => applied[k] && applied[k] !== "all"
      ).length,
    [applied]
  );

  const filtered = useMemo(
    () =>
      vendors.filter(
        (v) =>
          textMatch(applied.id, v.id) &&
          textMatch(applied.name, v.name) &&
          textMatch(applied.address, v.address) &&
          textMatch(applied.city, v.city) &&
          (applied.state === "all" || v.state === applied.state) &&
          textMatch(applied.zip, v.zip) &&
          (applied.status === "all" || v.status === applied.status) &&
          (applied.criticality === "all" || v.criticality === applied.criticality) &&
          (applied.qualificationBasedOn === "all" ||
            v.qualificationBasedOn === applied.qualificationBasedOn) &&
          yesNoMatch(applied.iso9001, v.iso9001) &&
          yesNoMatch(applied.qf133, v.qf133) &&
          yesNoMatch(applied.oem, v.oem) &&
          yesNoMatch(applied.qf131, v.qf131) &&
          yesNoMatch(applied.z540, v.z540) &&
          inRange(v.originalApprovalDate, applied.approvalFrom, applied.approvalTo) &&
          inRange(v.approvalExpires, applied.expiresFrom, applied.expiresTo) &&
          textMatch(columnFilters.id, v.id) &&
          textMatch(columnFilters.name, v.name) &&
          textMatch(columnFilters.address, v.address) &&
          textMatch(columnFilters.city, v.city) &&
          (columnFilters.state === "all" || v.state === columnFilters.state) &&
          textMatch(columnFilters.zip, v.zip) &&
          textMatch(columnFilters.originalApprovalDate, v.originalApprovalDate) &&
          (columnFilters.criticality === "all" || v.criticality === columnFilters.criticality) &&
          yesNoMatch(columnFilters.iso9001, v.iso9001) &&
          yesNoMatch(columnFilters.qf133, v.qf133) &&
          yesNoMatch(columnFilters.oem, v.oem) &&
          yesNoMatch(columnFilters.qf131, v.qf131) &&
          (columnFilters.qualificationBasedOn === "all" ||
            v.qualificationBasedOn === columnFilters.qualificationBasedOn) &&
          yesNoMatch(columnFilters.z540, v.z540) &&
          textMatch(columnFilters.comments, v.comments) &&
          (columnFilters.status === "all" || v.status === columnFilters.status) &&
          textMatch(columnFilters.approvalExpires, v.approvalExpires)
      ),
    [vendors, applied, columnFilters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const runSearch = () => {
    setApplied(draft);
    setPage(1);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 400);
  };
  const clearFilters = () => {
    setDraft(emptyFilters);
    setApplied(emptyFilters);
    setColumnFilters(emptyColumnFilters);
    setPage(1);
  };

  const openEdit = (v: VendorRecord) => {
    setEditing({ ...v });
    setIsNew(false);
    setErrors({});
  };
  const openAdd = () => {
    setEditing(blankVendor());
    setIsNew(true);
    setErrors({});
  };

  const saveVendor = () => {
    if (!editing) return;
    const next: Record<string, string> = {};
    if (!editing.id.trim()) next.id = "Vendor ID is required.";
    if (!editing.name.trim()) next.name = "Vendor name is required.";
    if (!editing.city.trim()) next.city = "City is required.";
    if (isNew && vendors.some((v) => v.id.toLowerCase() === editing.id.trim().toLowerCase())) {
      next.id = "This Vendor ID already exists.";
    }
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    setVendors((prev) =>
      isNew ? [{ ...editing }, ...prev] : prev.map((v) => (v.id === editing.id ? { ...editing } : v))
    );
    toast.success(isNew ? `Vendor ${editing.id} added.` : `Vendor ${editing.id} updated.`);
    setEditing(null);
  };

  const set = (patch: Partial<VendorRecord>) => setEditing((p) => (p ? { ...p, ...patch } : p));

  const yesNoField = (label: string, value: YesNo, onChange: (v: YesNo) => void) => (
    <div className="space-y-0.5">
      <Label className={LABEL}>{label}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as YesNo)}>
        <SelectTrigger className="h-8 rounded-md text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={SELECT_CONTENT}>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const colInput = (value: string, onChange: (val: string) => void, placeholder = "Search…") => (
    <div className="relative flex items-center">
      <Search className="absolute left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/50" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-6 w-full rounded-md border-muted bg-muted/30 pl-6 pr-5 text-[11px] placeholder:text-muted-foreground/40 focus:border-primary/30 focus:bg-background",
          value && "border-slate-400 bg-slate-50 font-medium text-foreground"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-muted"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );

  const colSelect = (
    value: string,
    onChange: (val: string) => void,
    options: { value: string; label: string }[],
    placeholder = "All"
  ) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-6 w-full rounded-md border-muted bg-muted/30 text-[11px] [&>svg]:h-3 [&>svg]:w-3",
          value && value !== "all" && "border-slate-400 bg-slate-50 font-medium text-foreground"
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn(SELECT_CONTENT, "max-h-64")}>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const setCol = (patch: Partial<ColumnFilters>) =>
    setColumnFilters((p) => ({ ...p, ...patch }));

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 border-b border-border bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-foreground hover:bg-muted" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold leading-tight text-foreground">Outsource Vendors</h1>
              <Breadcrumb className="mt-1">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs text-muted-foreground">Project Management</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-medium text-foreground">Outsource Vendors</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button className="h-8 gap-1.5 text-xs" onClick={openAdd}>
              <Plus className="h-3.5 w-3.5" />
              Add Vendor
            </Button>
          </div>
        </header>

        <main className="space-y-4 p-4 lg:p-6">
          {/* Search & Filters */}
          <section className="rounded-xl border bg-card p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-foreground">Search &amp; Filters</h2>
                {activeCount > 0 && (
                  <Badge className="h-4 rounded-full px-1.5 text-[10px]">{activeCount}</Badge>
                )}
              </div>
              <Button
                variant="outline"
                className="h-7 gap-1.5 text-[11px]"
                onClick={() => setShowMore((s) => !s)}
                aria-expanded={showMore}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                More Filters
                <ChevronDown className={cn("h-3 w-3 transition-transform", showMore && "rotate-180")} />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-0.5">
                <Label htmlFor="f-id" className={LABEL}>Vendor ID</Label>
                <Input id="f-id" className={fieldClass(draft.id)} placeholder="Vendor ID" value={draft.id}
                  onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()} />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="f-name" className={LABEL}>Vendor Name</Label>
                <Input id="f-name" className={fieldClass(draft.name)} placeholder="Vendor name" value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()} />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="f-city" className={LABEL}>City</Label>
                <Input id="f-city" className={fieldClass(draft.city)} placeholder="City" value={draft.city}
                  onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()} />
              </div>
              <div className="space-y-0.5">
                <Label className={LABEL}>State</Label>
                <Select value={draft.state} onValueChange={(v) => setDraft({ ...draft, state: v })}>
                  <SelectTrigger className={fieldClass(draft.state, "[&>svg]:h-3 [&>svg]:w-3")}>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className={cn(SELECT_CONTENT, "max-h-64")}>
                    <SelectItem value="all">All States</SelectItem>
                    {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <Label className={LABEL}>Status</Label>
                <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                  <SelectTrigger className={fieldClass(draft.status, "[&>svg]:h-3 [&>svg]:w-3")}>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT}>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {VENDOR_STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showMore && (
              <div className="mt-3 space-y-3 border-t pt-3">
                <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="space-y-0.5">
                    <Label htmlFor="f-addr" className={LABEL}>Address</Label>
                    <Input id="f-addr" className={fieldClass(draft.address)} placeholder="Address" value={draft.address}
                      onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="f-zip" className={LABEL}>ZIP</Label>
                    <Input id="f-zip" className={fieldClass(draft.zip)} placeholder="ZIP" value={draft.zip}
                      onChange={(e) => setDraft({ ...draft, zip: e.target.value })} />
                  </div>
                  <div className="space-y-0.5">
                    <Label className={LABEL}>Criticality</Label>
                    <Select value={draft.criticality} onValueChange={(v) => setDraft({ ...draft, criticality: v })}>
                      <SelectTrigger className={fieldClass(draft.criticality, "[&>svg]:h-3 [&>svg]:w-3")}>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className={SELECT_CONTENT}>
                        <SelectItem value="all">Any</SelectItem>
                        {CRITICALITY.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5 lg:col-span-2">
                    <Label className={LABEL}>Qualification Based On</Label>
                    <Select
                      value={draft.qualificationBasedOn}
                      onValueChange={(v) => setDraft({ ...draft, qualificationBasedOn: v })}
                    >
                      <SelectTrigger className={fieldClass(draft.qualificationBasedOn, "[&>svg]:h-3 [&>svg]:w-3")}>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className={cn(SELECT_CONTENT, "max-h-64")}>
                        <SelectItem value="all">Any</SelectItem>
                        {QUALIFICATION_BASIS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2 lg:grid-cols-5">
                  {yesNoFilterWrapper("iso9001", "ISO 9001 Registered", draft, setDraft)}
                  {yesNoFilterWrapper("qf133", "QF133 Issued", draft, setDraft)}
                  {yesNoFilterWrapper("oem", "OEM", draft, setDraft)}
                  {yesNoFilterWrapper("qf131", "QF131 on File", draft, setDraft)}
                  {yesNoFilterWrapper("z540", "Z540.1 Accredited", draft, setDraft)}
                </div>

                <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-0.5">
                    <Label className={LABEL}>Original Approval — From</Label>
                    <ModernDatePicker size="sm" value={draft.approvalFrom}
                      onChange={(d) => setDraft({ ...draft, approvalFrom: d ? d.toISOString() : "" })} />
                  </div>
                  <div className="space-y-0.5">
                    <Label className={LABEL}>Original Approval — To</Label>
                    <ModernDatePicker size="sm" value={draft.approvalTo}
                      onChange={(d) => setDraft({ ...draft, approvalTo: d ? d.toISOString() : "" })} />
                  </div>
                  <div className="space-y-0.5">
                    <Label className={LABEL}>Approval Expires — From</Label>
                    <ModernDatePicker size="sm" value={draft.expiresFrom}
                      onChange={(d) => setDraft({ ...draft, expiresFrom: d ? d.toISOString() : "" })} />
                  </div>
                  <div className="space-y-0.5">
                    <Label className={LABEL}>Approval Expires — To</Label>
                    <ModernDatePicker size="sm" value={draft.expiresTo}
                      onChange={(d) => setDraft({ ...draft, expiresTo: d ? d.toISOString() : "" })} />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 flex justify-end gap-2 border-t pt-3">
              <Button variant="outline" className="h-7 gap-1.5 text-[11px]" onClick={clearFilters}>
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
              <Button className="h-7 gap-1.5 text-[11px]" onClick={runSearch}>
                <Search className="h-3.5 w-3.5" />
                Search
              </Button>
            </div>
          </section>

          {/* Results */}
          <section className="rounded-xl border bg-card shadow-sm">
            <div className="max-h-[62vh] overflow-auto">
              <Table className="min-w-[1800px] text-xs">
                <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                  <TableRow>
                    <TableHead className="h-9 w-14 text-[11px]">Edit</TableHead>
                    <TableHead className="h-9 w-24 text-[11px]">Vendor ID</TableHead>
                    <TableHead className="h-9 min-w-[220px] text-[11px]">Vendor</TableHead>
                    <TableHead className="h-9 min-w-[180px] text-[11px]">Address</TableHead>
                    <TableHead className="h-9 min-w-[120px] text-[11px]">City</TableHead>
                    <TableHead className="h-9 w-16 text-[11px]">State</TableHead>
                    <TableHead className="h-9 w-20 text-[11px]">ZIP</TableHead>
                    <TableHead className="h-9 w-32 text-[11px]">Original Approval</TableHead>
                    <TableHead className="h-9 w-24 text-[11px]">Criticality</TableHead>
                    <TableHead className="h-9 w-24 text-center text-[11px]">ISO 9001</TableHead>
                    <TableHead className="h-9 w-24 text-center text-[11px]">QF133</TableHead>
                    <TableHead className="h-9 w-16 text-center text-[11px]">OEM</TableHead>
                    <TableHead className="h-9 w-24 text-center text-[11px]">QF131</TableHead>
                    <TableHead className="h-9 min-w-[180px] text-[11px]">Qualification Based On</TableHead>
                    <TableHead className="h-9 w-24 text-center text-[11px]">Z540.1</TableHead>
                    <TableHead className="h-9 min-w-[220px] text-[11px]">Comments</TableHead>
                    <TableHead className="h-9 w-24 text-[11px]">Status</TableHead>
                    <TableHead className="h-9 w-36 text-[11px]">Approval Expires</TableHead>
                  </TableRow>
                  <TableRow className="border-b-0 hover:bg-transparent">
                    <TableHead className="h-7 py-0.5 px-1.5"></TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colInput(columnFilters.id, (v) => setCol({ id: v }))}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colInput(columnFilters.name, (v) => setCol({ name: v }))}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colInput(columnFilters.address, (v) => setCol({ address: v }))}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colInput(columnFilters.city, (v) => setCol({ city: v }))}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.state,
                        (v) => setCol({ state: v }),
                        STATES.map((s) => ({ value: s, label: s })),
                        "All"
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colInput(columnFilters.zip, (v) => setCol({ zip: v }))}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colInput(columnFilters.originalApprovalDate, (v) => setCol({ originalApprovalDate: v }), "MM/DD/YYYY")}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.criticality,
                        (v) => setCol({ criticality: v }),
                        CRITICALITY.map((c) => ({ value: c, label: c }))
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.iso9001,
                        (v) => setCol({ iso9001: v }),
                        [
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.qf133,
                        (v) => setCol({ qf133: v }),
                        [
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.oem,
                        (v) => setCol({ oem: v }),
                        [
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.qf131,
                        (v) => setCol({ qf131: v }),
                        [
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.qualificationBasedOn,
                        (v) => setCol({ qualificationBasedOn: v }),
                        QUALIFICATION_BASIS.map((q) => ({ value: q, label: q }))
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.z540,
                        (v) => setCol({ z540: v }),
                        [
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colInput(columnFilters.comments, (v) => setCol({ comments: v }))}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colSelect(
                        columnFilters.status,
                        (v) => setCol({ status: v }),
                        VENDOR_STATUS.map((s) => ({ value: s, label: s }))
                      )}
                    </TableHead>
                    <TableHead className="h-7 py-0.5 px-1.5">
                      {colInput(columnFilters.approvalExpires, (v) => setCol({ approvalExpires: v }), "MM/DD/YYYY")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading &&
                    Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={`sk-${i}`}>
                        {Array.from({ length: 18 }).map((__, j) => (
                          <TableCell key={j} className="py-2"><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))}

                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={18} className="py-14 text-center">
                        <p className="text-sm font-medium text-foreground">No vendors match your filters</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Try widening your search or clearing the filters.
                        </p>
                        <Button variant="outline" className="mt-3 h-7 text-[11px]" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    rows.map((v) => (
                      <TableRow key={v.id} className="hover:bg-muted/40">
                        <TableCell className="py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            aria-label={`Edit vendor ${v.id}`}
                            onClick={() => openEdit(v)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                        <TableCell className="py-2">
                          <button
                            className="font-medium text-foreground underline-offset-2 hover:underline"
                            onClick={() => openEdit(v)}
                          >
                            {v.id}
                          </button>
                        </TableCell>
                        <TableCell className="max-w-[240px] py-2"><Truncated text={v.name} /></TableCell>
                        <TableCell className="max-w-[200px] py-2"><Truncated text={v.address} /></TableCell>
                        <TableCell className="py-2">{v.city}</TableCell>
                        <TableCell className="py-2">{v.state}</TableCell>
                        <TableCell className="py-2">{v.zip}</TableCell>
                        <TableCell className="py-2">{v.originalApprovalDate}</TableCell>
                        <TableCell className="py-2">{v.criticality}</TableCell>
                        <TableCell className="py-2 text-center"><YesNoBadge value={v.iso9001} /></TableCell>
                        <TableCell className="py-2 text-center"><YesNoBadge value={v.qf133} /></TableCell>
                        <TableCell className="py-2 text-center"><YesNoBadge value={v.oem} /></TableCell>
                        <TableCell className="py-2 text-center"><YesNoBadge value={v.qf131} /></TableCell>
                        <TableCell className="max-w-[200px] py-2"><Truncated text={v.qualificationBasedOn} /></TableCell>
                        <TableCell className="py-2 text-center"><YesNoBadge value={v.z540} /></TableCell>
                        <TableCell className="max-w-[240px] py-2"><Truncated text={v.comments} /></TableCell>
                        <TableCell className="py-2"><StatusBadge status={v.status} /></TableCell>
                        <TableCell className="py-2"><ExpiryCell value={v.approvalExpires} /></TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
              <div className="flex items-center gap-4">
                <p className="text-[11px] text-muted-foreground">
                  {filtered.length === 0
                    ? "No vendors found"
                    : `Showing ${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length.toLocaleString()} vendors`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Rows</span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                    <SelectTrigger className="h-7 w-[68px] text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent className={SELECT_CONTENT}>
                      {[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-[11px] text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <Button
                  variant="outline"
                  className="h-7 gap-1 text-[11px]"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Input
                  className="h-7 w-14 text-center text-[11px]"
                  value={currentPage}
                  aria-label="Page number"
                  onChange={(e) => {
                    const n = Number(e.target.value.replace(/\D/g, ""));
                    if (n >= 1 && n <= totalPages) setPage(n);
                  }}
                />
                <Button
                  variant="outline"
                  className="h-7 gap-1 text-[11px]"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Edit / Add vendor */}
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-base">
                {isNew ? "Add Vendor" : `Edit Vendor ${editing?.id}`}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update vendor details, approval status and qualification records.
              </DialogDescription>
            </DialogHeader>

            {editing && (
              <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Vendor Information */}
                <section className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Vendor Information
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className={LABEL}>Vendor ID *</Label>
                        <Input
                          className="h-8 text-xs disabled:bg-muted disabled:text-muted-foreground"
                          value={editing.id}
                          disabled={!isNew}
                          onChange={(e) => set({ id: e.target.value })}
                        />
                        {errors.id && <p className="text-[10px] text-destructive">{errors.id}</p>}
                      </div>
                      <div className="space-y-1">
                        <Label className={LABEL}>Vendor Name *</Label>
                        <Input
                          className="h-8 text-xs"
                          value={editing.name}
                          onChange={(e) => set({ name: e.target.value })}
                        />
                        {errors.name && <p className="text-[10px] text-destructive">{errors.name}</p>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className={LABEL}>Address</Label>
                      <Input
                        className="h-8 text-xs"
                        value={editing.address}
                        onChange={(e) => set({ address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className={LABEL}>City *</Label>
                        <Input
                          className="h-8 text-xs"
                          value={editing.city}
                          onChange={(e) => set({ city: e.target.value })}
                        />
                        {errors.city && <p className="text-[10px] text-destructive">{errors.city}</p>}
                      </div>
                      <div className="space-y-1">
                        <Label className={LABEL}>State</Label>
                        <Select value={editing.state} onValueChange={(v) => set({ state: v })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className={cn(SELECT_CONTENT, "max-h-64")}>
                            {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className={LABEL}>ZIP</Label>
                        <Input
                          className="h-8 text-xs"
                          value={editing.zip}
                          onChange={(e) => set({ zip: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Approval & Qualification */}
                <section className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Approval &amp; Qualification
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className={LABEL}>Original Approval Date</Label>
                        <ModernDatePicker
                          value={editing.originalApprovalDate}
                          onChange={(d) =>
                            set({ originalApprovalDate: d ? d.toLocaleDateString("en-US") : "" })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className={LABEL}>Criticality</Label>
                        <Select value={editing.criticality} onValueChange={(v) => set({ criticality: v })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent className={SELECT_CONTENT}>
                            {CRITICALITY.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className={LABEL}>Approval Expires</Label>
                        <ModernDatePicker
                          value={editing.approvalExpires}
                          onChange={(d) => set({ approvalExpires: d ? d.toLocaleDateString("en-US") : "" })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className={LABEL}>Qualification Based On</Label>
                      <Select
                        value={editing.qualificationBasedOn}
                        onValueChange={(v) => set({ qualificationBasedOn: v })}
                      >
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent className={cn(SELECT_CONTENT, "max-h-64")}>
                          {QUALIFICATION_BASIS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {yesNoField("ISO 9001 Registered", editing.iso9001, (v) => set({ iso9001: v }))}
                      {yesNoField("QF133 Issued", editing.qf133, (v) => set({ qf133: v }))}
                      {yesNoField("OEM", editing.oem, (v) => set({ oem: v }))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {yesNoField("QF131 on File", editing.qf131, (v) => set({ qf131: v }))}
                      {yesNoField("Z540.1 Accredited", editing.z540, (v) => set({ z540: v }))}
                    </div>
                  </div>
                </section>

                {/* Additional Information */}
                <section className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1">
                      <Label className={LABEL}>Comments</Label>
                      <Textarea
                        className="min-h-[80px] resize-none text-xs"
                        value={editing.comments}
                        onChange={(e) => set({ comments: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className={LABEL}>Status</Label>
                      <Select
                        value={editing.status}
                        onValueChange={(v) => set({ status: v as VendorRecord["status"] })}
                      >
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent className={SELECT_CONTENT}>
                          {VENDOR_STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              </div>
            )}

            <DialogFooter className="px-6 py-4 border-t bg-muted/30">
              <Button variant="outline" className="h-8 text-xs" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button className="h-8 bg-emerald-600 text-white text-xs hover:bg-emerald-700" onClick={saveVendor}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

function yesNoFilterWrapper(
  key: keyof Filters,
  label: string,
  draft: Filters,
  setDraft: (f: Filters) => void
) {
  const value = draft[key] as string;
  return (
    <div className="space-y-0.5" key={key as string}>
      <Label className={LABEL}>{label}</Label>
      <Select value={value} onValueChange={(v) => setDraft({ ...draft, [key]: v })}>
        <SelectTrigger className={fieldClass(value, "[&>svg]:h-3 [&>svg]:w-3")}>
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent className={SELECT_CONTENT}>
          <SelectItem value="all">Any</SelectItem>
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default OutsourceVendors;
