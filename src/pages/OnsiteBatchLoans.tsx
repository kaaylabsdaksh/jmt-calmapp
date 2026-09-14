import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowUpDown,
  ClipboardList,
  Eye,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BATCH_LOANS,
  BATCH_LOAN_LOCATIONS,
  BATCH_LOAN_USERS,
  BatchLoanStandard,
  BatchLoanStatus,
  OnsiteBatchLoan,
} from "@/lib/standards/onsite-batch-loans";
import { STANDARDS } from "@/lib/standards/data";

type SortKey = keyof Pick<OnsiteBatchLoan, "id" | "account" | "customer" | "status" | "fromLocation" | "toLocation" | "createdBy" | "created" | "needed" | "expectedReturn">;

const emptyFilters = {
  account: "",
  fromLocation: "all",
  createdBy: "all",
  createdFrom: "",
  toLocation: "all",
  status: "all",
  createdTo: "",
};

const emptyNewLoan = {
  account: "",
  customer: "",
  fromLocation: "",
  fromDivision: "Lab",
  fromUser: "Admin User",
  toLocation: "Onsite",
  toDivision: "OnSite",
  toUser: "",
  status: "Open" as BatchLoanStatus,
  needed: "",
  expectedReturn: "",
};

const DIVISIONS = ["Lab", "OnSite", "Electrical", "Mechanical", "Pressure", "Temperature"];

const FIELD = "h-7 min-h-0 rounded-md border-input bg-background px-2 py-0 text-[11px]";
const LABEL = "text-[11px] font-medium text-foreground/80";
const SELECT_CONTENT = "z-[9999] rounded-md border border-border bg-popover text-[11px] shadow-xl";

const dateTime = (value: string) => {
  if (!value) return Number.NaN;
  const [month, day, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

const StatusBadge = ({ status }: { status: BatchLoanStatus }) => (
  <Badge
    variant="outline"
    className={cn(
      "rounded-full border-transparent px-2 py-0.5 text-[11px] font-medium",
      status === "Returned" && "bg-success/10 text-success",
      status === "Open" && "bg-info/10 text-info",
      status === "Cancelled" && "bg-muted text-muted-foreground",
    )}
  >
    <span
      className={cn(
        "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
        status === "Returned" && "bg-success",
        status === "Open" && "bg-info",
        status === "Cancelled" && "bg-muted-foreground/60",
      )}
    />
    {status}
  </Badge>
);

const OnsiteBatchLoans = () => {
  const [loans, setLoans] = useState(BATCH_LOANS);
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "id", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [createOpen, setCreateOpen] = useState(false);
  const [newLoan, setNewLoan] = useState(emptyNewLoan);
  const [newStandards, setNewStandards] = useState<BatchLoanStandard[]>([]);
  const [standardNumber, setStandardNumber] = useState("");
  const [standardError, setStandardError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<OnsiteBatchLoan | null>(null);
  const [editLoan, setEditLoan] = useState<OnsiteBatchLoan | null>(null);
  const [editStandards, setEditStandards] = useState<BatchLoanStandard[]>([]);
  const [editStandardNumber, setEditStandardNumber] = useState("");
  const [editStandardError, setEditStandardError] = useState("");

  const filtered = useMemo(() => {
    const rows = loans.filter((loan) => {
      if (filters.account && !loan.account.toLowerCase().includes(filters.account.toLowerCase())) return false;
      if (filters.fromLocation !== "all" && loan.fromLocation !== filters.fromLocation) return false;
      if (filters.createdBy !== "all" && loan.createdBy !== filters.createdBy) return false;
      if (filters.toLocation !== "all" && loan.toLocation !== filters.toLocation) return false;
      if (filters.status !== "all" && loan.status !== filters.status) return false;
      const created = dateTime(loan.created);
      if (filters.createdFrom && created < new Date(filters.createdFrom).setHours(0, 0, 0, 0)) return false;
      if (filters.createdTo && created > new Date(filters.createdTo).setHours(23, 59, 59, 999)) return false;
      return true;
    });
    const direction = sort.dir === "asc" ? 1 : -1;
    return rows.sort((a, b) => {
      const av = sort.key === "id" ? a.id : a[sort.key];
      const bv = sort.key === "id" ? b.id : b[sort.key];
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * direction;
    });
  }, [filters, loans, sort]);

  const start = (page - 1) * pageSize;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(start, start + pageSize);
  const returnedCount = filtered.filter((loan) => loan.status === "Returned").length;
  const openCount = filtered.filter((loan) => loan.status === "Open").length;
  const cancelledCount = filtered.filter((loan) => loan.status === "Cancelled").length;
  const activeCount = Object.entries(filters).filter(([key, value]) => value && value !== "all" && value !== emptyFilters[key as keyof typeof emptyFilters]).length;

  const applyFilters = () => {
    setFilters(draft);
    setPage(1);
  };

  const clearFilters = () => {
    setDraft(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
  };

  const toggleSort = (key: SortKey) => {
    setSort((current) => ({ key, dir: current.key === key && current.dir === "asc" ? "desc" : "asc" }));
  };

  const saveLoan = () => {
    const nextErrors: Record<string, string> = {};
    if (!newLoan.account.trim()) nextErrors.account = "Account # is required.";
    if (!newLoan.customer.trim()) nextErrors.customer = "Customer is required.";
    if (!newLoan.fromLocation) nextErrors.fromLocation = "From Location is required.";
    if (!newLoan.toLocation) nextErrors.toLocation = "To Location is required.";
    if (!newLoan.needed) nextErrors.needed = "Needed date is required.";
    if (!newLoan.expectedReturn) nextErrors.expectedReturn = "Expected return date is required.";
    if (!newLoan.toUser) nextErrors.toUser = "To User is required.";
    if (newStandards.length === 0) nextErrors.standards = "Add at least one standard to this batch.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const nextId = Math.max(...loans.map((loan) => loan.id)) + 1;
    const saved: OnsiteBatchLoan = {
      id: nextId,
      account: newLoan.account.trim(),
      customer: newLoan.customer.trim(),
      status: newLoan.status,
      fromLocation: newLoan.fromLocation,
      toLocation: newLoan.toLocation,
      createdBy: "Admin User",
      created: format(new Date(), "MM/dd/yyyy"),
      needed: format(new Date(newLoan.needed), "MM/dd/yyyy"),
      expectedReturn: format(new Date(newLoan.expectedReturn), "MM/dd/yyyy"),
      fromDivision: newLoan.fromDivision,
      toDivision: newLoan.toDivision,
      fromUser: newLoan.fromUser,
      toUser: newLoan.toUser,
      standards: newStandards,
    };
    setLoans((current) => [saved, ...current]);
    setCreateOpen(false);
    setNewLoan(emptyNewLoan);
    setNewStandards([]);
    setStandardNumber("");
    setStandardError("");
    setErrors({});
    clearFilters();
    toast({ title: `Batch loan ${nextId} created.` });
  };

  const addStandard = () => {
    const number = standardNumber.trim();
    if (!number) {
      setStandardError("Enter a Standard #.");
      return;
    }
    if (newStandards.some((standard) => standard.standardNo === number)) {
      setStandardError("This standard is already in the batch.");
      return;
    }
    const standard = STANDARDS.find((item) => item.standardNo === number);
    if (!standard) {
      setStandardError("Standard # was not found.");
      return;
    }
    setNewStandards((current) => [...current, {
      standardNo: standard.standardNo,
      state: standard.state,
      nextCalibrationDue: standard.nextCalibrationDue,
      manufacturer: standard.manufacturer,
      model: standard.model,
      serial: standard.serial,
      labCode: standard.labCode,
    }]);
    setStandardNumber("");
    setStandardError("");
    setErrors((current) => ({ ...current, standards: "" }));
  };

  const openBatch = (loan: OnsiteBatchLoan) => {
    const representativeStandards = loan.standards ?? STANDARDS.slice(0, loan.id === 33 ? 10 : 3).map((standard) => ({
      standardNo: standard.standardNo,
      state: standard.state,
      nextCalibrationDue: standard.nextCalibrationDue,
      manufacturer: standard.manufacturer,
      model: standard.model,
      serial: standard.serial,
      labCode: standard.labCode,
    }));
    const hydrated = {
      ...loan,
      fromDivision: loan.fromDivision ?? "Lab",
      toDivision: loan.toDivision ?? "OnSite",
      fromUser: loan.fromUser ?? loan.createdBy,
      toUser: loan.toUser ?? (loan.createdBy === "Admin User" ? "Admin User" : "James L. Powell"),
      movedBy: loan.movedBy ?? (loan.status === "Returned" ? loan.createdBy : ""),
      movedDate: loan.movedDate ?? (loan.status === "Returned" ? loan.created : ""),
      returnedBy: loan.returnedBy ?? (loan.status === "Returned" ? loan.createdBy : ""),
      returnedDate: loan.returnedDate ?? (loan.status === "Returned" ? loan.expectedReturn : ""),
      standards: representativeStandards,
    };
    setSelected(loan);
    setEditLoan(hydrated);
    setEditStandards(representativeStandards);
    setEditStandardNumber("");
    setEditStandardError("");
  };

  const addEditStandard = () => {
    const number = editStandardNumber.trim();
    if (!number) return setEditStandardError("Enter a Standard #.");
    if (editStandards.some((standard) => standard.standardNo === number)) return setEditStandardError("This standard is already in the batch.");
    const standard = STANDARDS.find((item) => item.standardNo === number);
    if (!standard) return setEditStandardError("Standard # was not found.");
    setEditStandards((current) => [...current, { standardNo: standard.standardNo, state: standard.state, nextCalibrationDue: standard.nextCalibrationDue, manufacturer: standard.manufacturer, model: standard.model, serial: standard.serial, labCode: standard.labCode }]);
    setEditStandardNumber("");
    setEditStandardError("");
  };

  const persistEditedLoan = (patch: Partial<OnsiteBatchLoan> = {}, message = "Batch changes saved.") => {
    if (!editLoan) return;
    const updated = { ...editLoan, ...patch, standards: editStandards };
    setLoans((current) => current.map((loan) => loan.id === updated.id ? updated : loan));
    setEditLoan(updated);
    setSelected(updated);
    toast({ title: message });
  };

  const changeBatchStatus = (status: BatchLoanStatus) => {
    if (!editLoan) return;
    const today = format(new Date(), "MM/dd/yyyy");
    if (status === "Cancelled") persistEditedLoan({ status }, `Batch loan ${editLoan.id} cancelled.`);
    if (status === "Returned") persistEditedLoan({ status, returnedBy: "Admin User", returnedDate: today }, `Batch loan ${editLoan.id} returned.`);
    if (status === "Open") persistEditedLoan({ movedBy: "Admin User", movedDate: today }, `Batch loan ${editLoan.id} marked as moved.`);
  };

  const SortHead = ({ label, column }: { label: string; column: SortKey }) => (
    <TableHead className="h-9 whitespace-nowrap px-3 text-[11px] font-semibold">
      <Button variant="ghost" className="h-7 gap-1 px-0 text-[11px] font-semibold hover:bg-transparent" onClick={() => toggleSort(column)}>
        {label}
        <ArrowUpDown className={cn("h-3 w-3", sort.key === column ? "text-foreground" : "text-muted-foreground/50")} />
      </Button>
    </TableHead>
  );

  const selectField = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: string[],
    allLabel?: string,
  ) => (
    <div className="space-y-1">
      <Label htmlFor={id} className={LABEL}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={FIELD}><SelectValue /></SelectTrigger>
        <SelectContent className={SELECT_CONTENT}>
          {allLabel && <SelectItem value="all">{allLabel}</SelectItem>}
          {options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b border-border bg-background px-4 py-3 lg:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-foreground hover:bg-muted" />
              <div>
                <h1 className="text-lg font-semibold leading-tight text-foreground">Manage On-Site Batch Loans</h1>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Link to="/standards" className="hover:text-foreground">Equipment</Link>
                  <span>/</span>
                  <Link to="/standards" className="hover:text-foreground">Standards</Link>
                  <span>/</span>
                  <span className="font-medium text-foreground">On-Site Batch Loans</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="h-8 gap-1.5 text-xs">
                <Link to="/standards"><ArrowLeft className="h-3.5 w-3.5" />Back to Standards</Link>
              </Button>
              <Button className="h-8 gap-1.5 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={() => setCreateOpen(true)}>
                <Plus className="h-3.5 w-3.5" />Add New
              </Button>
            </div>
          </div>
        </header>

        <main className="space-y-4 p-4 lg:p-6">
          <section className="rounded-lg border border-border bg-card p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-foreground">Search Criteria</h2>
              {activeCount > 0 && <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{activeCount} active</Badge>}
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              <div className="space-y-1">
                <Label htmlFor="loan-account" className={LABEL}>Account #</Label>
                <Input id="loan-account" className={FIELD} value={draft.account} placeholder="Account #" onChange={(event) => setDraft({ ...draft, account: event.target.value })} onKeyDown={(event) => event.key === "Enter" && applyFilters()} />
              </div>
              {selectField("loan-from", "From Location", draft.fromLocation, (value) => setDraft({ ...draft, fromLocation: value }), BATCH_LOAN_LOCATIONS.filter((location) => location !== "Onsite"), "All Locations")}
              {selectField("loan-user", "Created By", draft.createdBy, (value) => setDraft({ ...draft, createdBy: value }), BATCH_LOAN_USERS, "All Users")}
              <div className="space-y-1">
                <Label htmlFor="created-from" className={LABEL}>Created From</Label>
                <ModernDatePicker id="created-from" size="sm" value={draft.createdFrom} onChange={(date) => setDraft({ ...draft, createdFrom: date ? format(date, "MM/dd/yyyy") : "" })} />
              </div>
              {selectField("loan-to", "To Location", draft.toLocation, (value) => setDraft({ ...draft, toLocation: value }), BATCH_LOAN_LOCATIONS, "All Locations")}
              {selectField("loan-status", "Batch Loan Status", draft.status, (value) => setDraft({ ...draft, status: value }), ["Open", "Returned", "Cancelled"], "All Statuses")}
              <div className="space-y-1">
                <Label htmlFor="created-to" className={LABEL}>Created To</Label>
                <ModernDatePicker id="created-to" size="sm" value={draft.createdTo} onChange={(date) => setDraft({ ...draft, createdTo: date ? format(date, "MM/dd/yyyy") : "" })} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button variant="outline" className="h-7 gap-1.5 border-destructive px-3 text-[11px] text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={clearFilters}>
                <X className="h-3 w-3" />Clear
              </Button>
              <Button className="h-7 gap-1.5 bg-foreground px-4 text-[11px] text-background hover:bg-foreground/90" onClick={applyFilters}>
                <Search className="h-3 w-3" />Search
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Returned", value: returnedCount, tone: "success" },
              { label: "Open", value: openCount, tone: "info" },
              { label: "Cancelled", value: cancelledCount, tone: "muted" },
            ].map((item) => (
              <div key={item.label} className={cn("flex items-center justify-between rounded-md border border-border border-l-4 bg-card px-4 py-3 shadow-sm", item.tone === "success" && "border-l-success", item.tone === "info" && "border-l-info", item.tone === "muted" && "border-l-muted-foreground/50")}>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">{item.label} batches</p>
                  <p className="mt-0.5 text-xl font-semibold text-foreground">{item.value}</p>
                </div>
                <ClipboardList className={cn("h-5 w-5", item.tone === "success" && "text-success", item.tone === "info" && "text-info", item.tone === "muted" && "text-muted-foreground")} />
              </div>
            ))}
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <h2 className="text-xs font-semibold text-foreground">Batch Loan Results</h2>
              <span className="text-[11px] text-muted-foreground">{filtered.length} {filtered.length === 1 ? "record" : "records"}</span>
            </div>
            <div className="max-h-[58vh] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                  <TableRow>
                    <SortHead label="ID" column="id" />
                    <SortHead label="Account #" column="account" />
                    <SortHead label="Customer" column="customer" />
                    <SortHead label="Status" column="status" />
                    <SortHead label="From" column="fromLocation" />
                    <SortHead label="To" column="toLocation" />
                    <SortHead label="Created By" column="createdBy" />
                    <SortHead label="Created" column="created" />
                    <SortHead label="Needed" column="needed" />
                    <SortHead label="Expected Return" column="expectedReturn" />
                    <TableHead className="h-9 w-12 px-3"><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 && (
                    <TableRow><TableCell colSpan={11} className="h-40 text-center"><Search className="mx-auto mb-2 h-6 w-6 text-muted-foreground" /><p className="text-sm font-medium">No batch loans found</p><p className="mt-1 text-xs text-muted-foreground">Adjust the search criteria and try again.</p></TableCell></TableRow>
                  )}
                  {pageRows.map((loan) => (
                    <TableRow key={loan.id} className="text-xs">
                      <TableCell className="py-2 font-semibold"><button className="text-foreground underline-offset-2 hover:underline" onClick={() => openBatch(loan)}>{loan.id}</button></TableCell>
                      <TableCell className="py-2 tabular-nums">{loan.account}</TableCell>
                      <TableCell className="max-w-[240px] py-2"><Tooltip><TooltipTrigger asChild><span className="block truncate">{loan.customer}</span></TooltipTrigger><TooltipContent>{loan.customer}</TooltipContent></Tooltip></TableCell>
                      <TableCell className="py-2"><StatusBadge status={loan.status} /></TableCell>
                      <TableCell className="py-2">{loan.fromLocation}</TableCell>
                      <TableCell className="py-2">{loan.toLocation}</TableCell>
                      <TableCell className="whitespace-nowrap py-2">{loan.createdBy}</TableCell>
                      <TableCell className="whitespace-nowrap py-2 tabular-nums">{loan.created}</TableCell>
                      <TableCell className="whitespace-nowrap py-2 tabular-nums">{loan.needed}</TableCell>
                      <TableCell className="whitespace-nowrap py-2 tabular-nums">{loan.expectedReturn}</TableCell>
                      <TableCell className="py-2"><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`View batch loan ${loan.id}`} onClick={() => openBatch(loan)}><Eye className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-2 border-t border-border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-muted-foreground">{filtered.length === 0 ? "No results" : `Showing ${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length}`}</span>
              <div className="flex items-center gap-2">
                <Label htmlFor="loan-page-size" className="text-xs text-muted-foreground">Rows</Label>
                <Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger id="loan-page-size" className="h-8 w-[70px] text-xs"><SelectValue /></SelectTrigger><SelectContent>{[10, 20, 50].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select>
                <Button variant="outline" className="h-8 text-xs" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button>
                <span className="text-xs text-muted-foreground">Page {page} of {pageCount}</span>
                <Button variant="outline" className="h-8 text-xs" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</Button>
              </div>
            </div>
          </section>
        </main>

        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) { setErrors({}); setStandardError(""); } }}>
          <DialogContent className="max-h-[94vh] max-w-5xl gap-0 overflow-hidden p-0">
            <DialogHeader className="border-b border-border px-5 py-4"><DialogTitle className="text-base">Add New On-Site Batch</DialogTitle><DialogDescription className="text-xs">Enter the movement details, then add the standards included in this loan.</DialogDescription></DialogHeader>
            <div className="max-h-[72vh] space-y-4 overflow-y-auto p-5">
              <section className="space-y-3">
                <div className="flex items-center justify-between"><h3 className="text-[10px] font-semibold uppercase text-muted-foreground">Batch details</h3><StatusBadge status="Open" /></div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1"><Label className={LABEL}>Batch ID</Label><Input className={FIELD} value={Math.max(...loans.map((loan) => loan.id)) + 1} readOnly /></div>
                  <div className="space-y-1"><Label htmlFor="new-account" className={LABEL}>Account # <span className="text-destructive">*</span></Label><Input id="new-account" className={FIELD} value={newLoan.account} onChange={(e) => setNewLoan({ ...newLoan, account: e.target.value })} />{errors.account && <p className="text-[10px] text-destructive">{errors.account}</p>}</div>
                  <div className="space-y-1 sm:col-span-2"><Label htmlFor="new-customer" className={LABEL}>Customer <span className="text-destructive">*</span></Label><Input id="new-customer" className={FIELD} value={newLoan.customer} onChange={(e) => setNewLoan({ ...newLoan, customer: e.target.value })} />{errors.customer && <p className="text-[10px] text-destructive">{errors.customer}</p>}</div>
                </div>
              </section>
              <section className="space-y-3 border-t border-border pt-4">
                <h3 className="text-[10px] font-semibold uppercase text-muted-foreground">Movement</h3>
                <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1"><Label className={LABEL}>From Location <span className="text-destructive">*</span></Label><Select value={newLoan.fromLocation} onValueChange={(value) => setNewLoan({ ...newLoan, fromLocation: value })}><SelectTrigger className={FIELD}><SelectValue placeholder="Select location" /></SelectTrigger><SelectContent className={SELECT_CONTENT}>{BATCH_LOAN_LOCATIONS.filter((location) => location !== "Onsite").map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}</SelectContent></Select>{errors.fromLocation && <p className="text-[10px] text-destructive">{errors.fromLocation}</p>}</div>
                  <div className="space-y-1"><Label className={LABEL}>From Division</Label><Select value={newLoan.fromDivision} onValueChange={(value) => setNewLoan({ ...newLoan, fromDivision: value })}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent className={SELECT_CONTENT}>{DIVISIONS.map((division) => <SelectItem key={division} value={division}>{division}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-1"><Label className={LABEL}>To Location <span className="text-destructive">*</span></Label><Select value={newLoan.toLocation} onValueChange={(value) => setNewLoan({ ...newLoan, toLocation: value })}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent className={SELECT_CONTENT}>{BATCH_LOAN_LOCATIONS.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-1"><Label className={LABEL}>To Division</Label><Select value={newLoan.toDivision} onValueChange={(value) => setNewLoan({ ...newLoan, toDivision: value })}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent className={SELECT_CONTENT}>{DIVISIONS.map((division) => <SelectItem key={division} value={division}>{division}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-1"><Label className={LABEL}>From User</Label><Input className={FIELD} value={newLoan.fromUser} readOnly /></div>
                  <div className="space-y-1"><Label className={LABEL}>Date Needed <span className="text-destructive">*</span></Label><ModernDatePicker size="sm" value={newLoan.needed} onChange={(date) => setNewLoan({ ...newLoan, needed: date ? format(date, "yyyy-MM-dd") : "" })} />{errors.needed && <p className="text-[10px] text-destructive">{errors.needed}</p>}</div>
                  <div className="space-y-1"><Label className={LABEL}>To User <span className="text-destructive">*</span></Label><Select value={newLoan.toUser} onValueChange={(value) => setNewLoan({ ...newLoan, toUser: value })}><SelectTrigger className={FIELD}><SelectValue placeholder="Select user" /></SelectTrigger><SelectContent className={SELECT_CONTENT}>{BATCH_LOAN_USERS.map((user) => <SelectItem key={user} value={user}>{user}</SelectItem>)}</SelectContent></Select>{errors.toUser && <p className="text-[10px] text-destructive">{errors.toUser}</p>}</div>
                  <div className="space-y-1"><Label className={LABEL}>Expected Return Date <span className="text-destructive">*</span></Label><ModernDatePicker size="sm" value={newLoan.expectedReturn} onChange={(date) => setNewLoan({ ...newLoan, expectedReturn: date ? format(date, "yyyy-MM-dd") : "" })} />{errors.expectedReturn && <p className="text-[10px] text-destructive">{errors.expectedReturn}</p>}</div>
                </div>
                <div className="grid gap-3 rounded-md border border-border bg-muted/20 p-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[ ["Created By", "Admin User"], ["Created Date", format(new Date(), "MM/dd/yyyy")], ["Moved By", "—"], ["Moved Date", "—"], ["Returned By", "—"], ["Returned Date", "—"] ].map(([label, value]) => <div key={label}><p className="text-[10px] font-medium text-muted-foreground">{label}</p><p className="mt-0.5 text-[11px] font-medium text-foreground">{value}</p></div>)}
                </div>
              </section>
              <section className="space-y-3 border-t border-border pt-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div><h3 className="text-[10px] font-semibold uppercase text-muted-foreground">Standards in batch</h3><p className="mt-1 text-[11px] text-muted-foreground">{newStandards.length} {newStandards.length === 1 ? "standard" : "standards"} added</p></div>
                  <div className="flex items-end gap-2"><div className="space-y-1"><Label htmlFor="new-standard-number" className={LABEL}>Standard # <span className="text-destructive">*</span></Label><Input id="new-standard-number" className={`${FIELD} w-48`} value={standardNumber} placeholder="Enter standard number" onChange={(event) => { setStandardNumber(event.target.value); setStandardError(""); }} onKeyDown={(event) => event.key === "Enter" && addStandard()} /></div><Button variant="outline" className="h-7 gap-1 text-[11px]" onClick={addStandard}><Plus className="h-3 w-3" />Add</Button></div>
                </div>
                {(standardError || errors.standards) && <p className="text-[10px] text-destructive">{standardError || errors.standards}</p>}
                <div className="overflow-hidden rounded-md border border-border">
                  <Table><TableHeader className="bg-muted/60"><TableRow><TableHead className="h-8 px-2 text-[10px]">Standard #</TableHead><TableHead className="h-8 px-2 text-[10px]">State of Asset</TableHead><TableHead className="h-8 px-2 text-[10px]">Next Cal Date</TableHead><TableHead className="h-8 px-2 text-[10px]">Manufacturer</TableHead><TableHead className="h-8 px-2 text-[10px]">Model</TableHead><TableHead className="h-8 px-2 text-[10px]">Serial</TableHead><TableHead className="h-8 px-2 text-[10px]">Lab Code</TableHead><TableHead className="h-8 w-10 px-2"><span className="sr-only">Remove</span></TableHead></TableRow></TableHeader><TableBody>
                    {newStandards.length === 0 ? <TableRow><TableCell colSpan={8} className="h-20 text-center text-[11px] text-muted-foreground">No standards added yet.</TableCell></TableRow> : newStandards.map((standard) => <TableRow key={standard.standardNo} className="text-[11px]"><TableCell className="px-2 py-2 font-semibold">{standard.standardNo}</TableCell><TableCell className="px-2 py-2">{standard.state}</TableCell><TableCell className="px-2 py-2 tabular-nums">{standard.nextCalibrationDue}</TableCell><TableCell className="px-2 py-2">{standard.manufacturer}</TableCell><TableCell className="px-2 py-2">{standard.model}</TableCell><TableCell className="px-2 py-2">{standard.serial}</TableCell><TableCell className="px-2 py-2">{standard.labCode}</TableCell><TableCell className="px-2 py-2"><Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove standard ${standard.standardNo}`} onClick={() => setNewStandards((current) => current.filter((item) => item.standardNo !== standard.standardNo))}><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>)}
                  </TableBody></Table>
                </div>
              </section>
            </div>
            <DialogFooter className="border-t border-border bg-muted/20 px-5 py-3"><Button variant="outline" className="h-8 text-xs" onClick={() => setCreateOpen(false)}>Cancel</Button><Button className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={saveLoan}>Save Batch Loan</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) { setSelected(null); setEditLoan(null); } }}>
          <DialogContent className="max-h-[94vh] max-w-5xl gap-0 overflow-hidden p-0">
            <DialogHeader className="border-b border-border px-5 py-4"><div className="flex items-center justify-between pr-8"><div><DialogTitle className="text-base">Edit On-Site Batch {editLoan?.id}</DialogTitle><DialogDescription className="text-xs">Review the movement lifecycle and standards assigned to this loan.</DialogDescription></div>{editLoan && <div className="flex items-center gap-2"><StatusBadge status={editLoan.status} />{editLoan.status === "Returned" && <Button variant="link" className="h-7 px-1 text-xs text-foreground">Batch Report</Button>}</div>}</div></DialogHeader>
            {editLoan && <div className="max-h-[72vh] space-y-4 overflow-y-auto p-5">
              <section className="space-y-3"><h3 className="text-[10px] font-semibold uppercase text-muted-foreground">Batch details</h3><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1"><Label className={LABEL}>Batch ID</Label><Input className={FIELD} value={editLoan.id} readOnly /></div>
                <div className="space-y-1"><Label className={LABEL}>Account #</Label><Input className={FIELD} value={editLoan.account} readOnly={editLoan.status !== "Open"} onChange={(event) => setEditLoan({ ...editLoan, account: event.target.value })} /></div>
                <div className="space-y-1 sm:col-span-2"><Label className={LABEL}>Customer</Label><Input className={FIELD} value={editLoan.customer} readOnly /></div>
              </div></section>
              <section className="space-y-3 border-t border-border pt-4"><h3 className="text-[10px] font-semibold uppercase text-muted-foreground">Movement</h3><div className="grid gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1"><Label className={LABEL}>From Location</Label><Input className={FIELD} value={editLoan.fromLocation} readOnly /></div>
                <div className="space-y-1"><Label className={LABEL}>From Division</Label><Input className={FIELD} value={editLoan.fromDivision} readOnly /></div>
                <div className="space-y-1"><Label className={LABEL}>To Location</Label><Input className={FIELD} value={editLoan.toLocation} readOnly /></div>
                <div className="space-y-1"><Label className={LABEL}>To Division</Label><Input className={FIELD} value={editLoan.toDivision} readOnly /></div>
                <div className="space-y-1"><Label className={LABEL}>From User</Label><Input className={FIELD} value={editLoan.fromUser} readOnly /></div>
                <div className="space-y-1"><Label className={LABEL}>Date Needed</Label><Input className={FIELD} value={editLoan.needed} readOnly /></div>
                <div className="space-y-1"><Label className={LABEL}>To User</Label><Input className={FIELD} value={editLoan.toUser} readOnly /></div>
                <div className="space-y-1"><Label className={LABEL}>Expected Return Date</Label><Input className={FIELD} value={editLoan.expectedReturn} readOnly /></div>
              </div><div className="grid gap-3 rounded-md border border-border bg-muted/20 p-3 sm:grid-cols-2 lg:grid-cols-4">{[["Created By", editLoan.createdBy], ["Created Date", editLoan.created], ["Moved By", editLoan.movedBy || "—"], ["Moved Date", editLoan.movedDate || "—"], ["Returned By", editLoan.returnedBy || "—"], ["Returned Date", editLoan.returnedDate || "—"]].map(([label, value]) => <div key={label}><p className="text-[10px] font-medium text-muted-foreground">{label}</p><p className="mt-0.5 text-[11px] font-medium text-foreground">{value}</p></div>)}</div></section>
              <section className="space-y-3 border-t border-border pt-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-[10px] font-semibold uppercase text-muted-foreground">Standards in batch</h3><p className="mt-1 text-[11px] text-muted-foreground">{editStandards.length} {editStandards.length === 1 ? "standard" : "standards"}</p></div>{editLoan.status === "Open" && <div className="flex items-end gap-2"><div className="space-y-1"><Label htmlFor="edit-standard-number" className={LABEL}>Standard #</Label><Input id="edit-standard-number" className={`${FIELD} w-48`} value={editStandardNumber} placeholder="Enter standard number" onChange={(event) => { setEditStandardNumber(event.target.value); setEditStandardError(""); }} onKeyDown={(event) => event.key === "Enter" && addEditStandard()} /></div><Button variant="outline" className="h-7 gap-1 text-[11px]" onClick={addEditStandard}><Plus className="h-3 w-3" />Add</Button></div>}</div>{editStandardError && <p className="text-[10px] text-destructive">{editStandardError}</p>}
                <div className="overflow-hidden rounded-md border border-border"><Table><TableHeader className="bg-muted/60"><TableRow><TableHead className="h-8 px-2 text-[10px]">Standard #</TableHead><TableHead className="h-8 px-2 text-[10px]">State of Asset</TableHead><TableHead className="h-8 px-2 text-[10px]">Next Cal Date</TableHead><TableHead className="h-8 px-2 text-[10px]">Manufacturer</TableHead><TableHead className="h-8 px-2 text-[10px]">Model</TableHead><TableHead className="h-8 px-2 text-[10px]">Serial</TableHead><TableHead className="h-8 px-2 text-[10px]">Lab Code</TableHead>{editLoan.status === "Open" && <TableHead className="h-8 w-10 px-2"><span className="sr-only">Remove</span></TableHead>}</TableRow></TableHeader><TableBody>{editStandards.map((standard) => <TableRow key={standard.standardNo} className="text-[11px]"><TableCell className="px-2 py-2 font-semibold">{standard.standardNo}</TableCell><TableCell className="px-2 py-2">{standard.state}</TableCell><TableCell className="px-2 py-2 tabular-nums">{standard.nextCalibrationDue}</TableCell><TableCell className="px-2 py-2">{standard.manufacturer}</TableCell><TableCell className="px-2 py-2">{standard.model}</TableCell><TableCell className="px-2 py-2">{standard.serial}</TableCell><TableCell className="px-2 py-2">{standard.labCode}</TableCell>{editLoan.status === "Open" && <TableCell className="px-2 py-2"><Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove standard ${standard.standardNo}`} onClick={() => setEditStandards((current) => current.filter((item) => item.standardNo !== standard.standardNo))}><Trash2 className="h-3 w-3" /></Button></TableCell>}</TableRow>)}</TableBody></Table></div>
              </section>
            </div>}
            <DialogFooter className="flex-row border-t border-border bg-muted/20 px-5 py-3 sm:justify-between"><div className="flex gap-2"><Button variant="outline" className="h-8 text-xs" disabled={!editLoan || editLoan.status !== "Open"} onClick={() => persistEditedLoan()}>Save</Button><Button variant="outline" className="h-8 text-xs" disabled={!editLoan || editLoan.status !== "Open"} onClick={() => changeBatchStatus("Cancelled")}>Cancel Batch</Button><Button variant="outline" className="h-8 text-xs" disabled={!editLoan || editLoan.status !== "Open" || Boolean(editLoan.movedDate)} onClick={() => changeBatchStatus("Open")}>Move</Button><Button variant="outline" className="h-8 text-xs" disabled={!editLoan || editLoan.status !== "Open"} onClick={() => changeBatchStatus("Returned")}>Return</Button></div><Button variant="outline" className="h-8 text-xs" onClick={() => { setSelected(null); setEditLoan(null); }}>Back</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default OnsiteBatchLoans;
