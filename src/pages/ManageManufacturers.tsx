import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, FileText, Pencil, Plus, RotateCcw, Save, Search } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MANUFACTURERS, ManufacturerRecord, ManufacturerStatus } from "@/lib/manufacturers";
import { format } from "date-fns";

const PAGE_SIZES = [15, 25, 50];
const emptyFilters = { id: "", manufacturer: "", fullName: "", website: "", ascInfo: "", dateAdded: "", status: "all" };
type Filters = typeof emptyFilters;
type SortKey = keyof Omit<ManufacturerRecord, "status"> | "status";

const StatusBadge = ({ status }: { status: ManufacturerStatus }) => (
  <Badge variant="outline" className={cn("gap-1.5 rounded-full border-transparent px-2 py-0 text-[10px] font-medium", status === "Active" && "bg-success/10 text-success", status === "Pending" && "bg-warning/15 text-warning-foreground", status === "Inactive" && "bg-muted text-muted-foreground")}>
    <span className={cn("h-1.5 w-1.5 rounded-full", status === "Active" && "bg-success", status === "Pending" && "bg-warning", status === "Inactive" && "bg-muted-foreground")} />
    {status}
  </Badge>
);

const Field = ({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) => (
  <div className={cn("space-y-1", className)}>
    <Label className="text-[11px] font-medium text-foreground">{label}{required && <span className="ml-0.5 text-destructive">*</span>}</Label>
    {children}
  </div>
);

const ManageManufacturers = () => {
  const [records, setRecords] = useState(MANUFACTURERS);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "manufacturer", direction: "asc" });
  const [editing, setEditing] = useState<ManufacturerRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => records.filter((row) => {
    const match = (filter: string, value: string) => !filter.trim() || value.toLowerCase().includes(filter.trim().toLowerCase());
    return match(filters.id, row.id) && match(filters.manufacturer, row.manufacturer) && match(filters.fullName, row.fullName) && match(filters.website, row.website) && match(filters.ascInfo, row.ascInfo) && match(filters.dateAdded, row.dateAdded) && (filters.status === "all" || row.status === filters.status);
  }).sort((a, b) => {
    const result = String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true });
    return sort.direction === "asc" ? result : -result;
  }), [filters, records, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const openNew = () => {
    setIsNew(true);
    setErrors({});
    setEditing({ id: String(Math.max(...records.map((row) => Number(row.id))) + 1), manufacturer: "", fullName: "", website: "", ascInfo: "", dateAdded: format(new Date(), "MM/dd/yyyy"), status: "Pending" });
  };
  const save = () => {
    if (!editing) return;
    const nextErrors: Record<string, string> = {};
    if (!editing.manufacturer.trim()) nextErrors.manufacturer = "Manufacturer is required.";
    if (!editing.dateAdded) nextErrors.dateAdded = "Date added is required.";
    if (editing.website && !/^https?:\/\//i.test(editing.website)) nextErrors.website = "Enter a complete URL beginning with http:// or https://.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setRecords((current) => isNew ? [editing, ...current] : current.map((row) => row.id === editing.id ? editing : row));
    toast({ title: isNew ? "Manufacturer added" : "Manufacturer updated", description: `${editing.manufacturer} was saved.` });
    setEditing(null);
    setIsNew(false);
  };
  const update = <K extends keyof ManufacturerRecord>(key: K, value: ManufacturerRecord[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const changeSort = (key: SortKey) => setSort((current) => ({ key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" }));

  if (editing) return (
    <div className="min-h-full bg-background">
      <ModernTopNav />
      <main className="px-2 py-3 sm:px-4 lg:px-6">
        <section className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div><h2 className="text-sm font-semibold text-foreground">{isNew ? "Add New Manufacturer" : "Edit Manufacturer"}</h2><p className="mt-0.5 text-[11px] text-muted-foreground">Maintain manufacturer identity and reference information.</p></div>
            {!isNew && <Badge variant="outline" className="rounded-full text-[10px]">ID {editing.id}</Badge>}
          </div>
          <div className="grid gap-5 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-4 border-b border-border pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
              <Field label="Status" required><Select value={editing.status} onValueChange={(value) => update("status", value as ManufacturerStatus)}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></Field>
              <Field label="Date Added" required><ModernDatePicker size="md" value={editing.dateAdded} onChange={(date) => update("dateAdded", date ? format(date, "MM/dd/yyyy") : "")} inputClassName={cn(errors.dateAdded && "border-destructive")} /></Field>
              {errors.dateAdded && <p className="text-[10px] text-destructive">{errors.dateAdded}</p>}
              <div className="rounded-md bg-muted/50 p-3"><p className="text-[10px] font-semibold uppercase text-muted-foreground">Record state</p><div className="mt-2"><StatusBadge status={editing.status} /></div></div>
            </div>
            <div className="grid content-start gap-4 md:grid-cols-2">
              <Field label="Manufacturer" required className="md:col-span-2"><Input value={editing.manufacturer} onChange={(e) => update("manufacturer", e.target.value)} className={cn("h-8 text-xs", errors.manufacturer && "border-destructive")} />{errors.manufacturer && <p className="text-[10px] text-destructive">{errors.manufacturer}</p>}</Field>
              <Field label="Full Name" className="md:col-span-2"><Input value={editing.fullName} onChange={(e) => update("fullName", e.target.value)} className="h-8 text-xs" /></Field>
              <Field label="Website" className="md:col-span-2"><Input value={editing.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" className={cn("h-8 text-xs", errors.website && "border-destructive")} />{errors.website && <p className="text-[10px] text-destructive">{errors.website}</p>}</Field>
              <Field label="ASC Info" className="md:col-span-2"><Textarea value={editing.ascInfo} onChange={(e) => update("ascInfo", e.target.value)} placeholder="File name, link, or supporting information" className="min-h-24 resize-y text-xs" /></Field>
            </div>
          </div>
          <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-card px-4 py-3">
            <Button variant="outline" size="sm" onClick={() => { setEditing(null); setIsNew(false); }} className="h-8">Cancel</Button>
            <Button size="sm" onClick={save} className="h-8 bg-success text-success-foreground hover:bg-success/90"><Save className="h-3.5 w-3.5" />Save</Button>
          </footer>
        </section>
      </main>
    </div>
  );

  const headers: { key: SortKey; label: string }[] = [{ key: "id", label: "ID" }, { key: "manufacturer", label: "Manufacturer" }, { key: "fullName", label: "Full Name" }, { key: "website", label: "Website" }, { key: "ascInfo", label: "ASC Info" }, { key: "dateAdded", label: "Date Added" }, { key: "status", label: "Status" }];
  return (
    <div className="min-h-full bg-background">
      <ModernTopNav />
      <main className="px-2 py-3 sm:px-4 lg:px-6">
        <section className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2.5">
            <div><h2 className="text-sm font-semibold text-foreground">Manufacturers</h2><p className="text-[10px] text-muted-foreground">{filtered.length} matching records</p></div>
            <Button size="sm" onClick={openNew} className="h-7 bg-info px-3 text-[11px] text-info-foreground hover:bg-info/90"><Plus className="h-3.5 w-3.5" />Add New</Button>
          </div>
          <div className="max-h-[62vh] overflow-auto">
            <table className="w-full min-w-[1060px] border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/80">
                  <th className="sticky left-0 top-0 z-30 w-10 bg-muted px-2 py-2 text-left font-semibold text-foreground">Edit</th>
                  {headers.map((header) => <th key={header.key} className="sticky top-0 z-20 whitespace-nowrap bg-muted px-2 py-2 text-left font-semibold text-foreground"><Button variant="ghost" onClick={() => changeSort(header.key)} className="h-auto p-0 text-[11px] font-semibold hover:bg-transparent">{header.label}<ArrowUpDown className="h-3 w-3 text-muted-foreground" /></Button></th>)}
                </tr>
                <tr className="border-b border-border bg-card">
                  <th className="sticky left-0 z-10 bg-card px-2 py-1"><Button variant="ghost" size="icon" className="h-6 w-6" title="Clear filters" onClick={() => { setFilters(emptyFilters); setPage(1); }}><RotateCcw className="h-3 w-3" /></Button></th>
                  {(["id", "manufacturer", "fullName", "website", "ascInfo", "dateAdded"] as const).map((key) => <th key={key} className="px-1 py-1"><Input aria-label={`Filter ${key}`} value={filters[key]} onChange={(e) => { setFilters((current) => ({ ...current, [key]: e.target.value })); setPage(1); }} className="h-6 min-w-20 rounded-sm px-1.5 text-[10px]" /></th>)}
                  <th className="px-1 py-1"><Select value={filters.status} onValueChange={(value) => { setFilters((current) => ({ ...current, status: value })); setPage(1); }}><SelectTrigger aria-label="Filter status" className="h-6 min-w-24 rounded-sm px-1.5 text-[10px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></th>
                </tr>
              </thead>
              <tbody>{visibleRows.length ? visibleRows.map((row) => <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                <td className="sticky left-0 z-10 bg-card px-2 py-1.5"><Button variant="ghost" size="icon" aria-label={`Edit ${row.manufacturer}`} onClick={() => { setEditing(row); setIsNew(false); setErrors({}); }} className="h-6 w-6"><Pencil className="h-3 w-3" /></Button></td>
                <td className="px-2 py-1.5 font-medium text-foreground">{row.id}</td>
                <td className="px-2 py-1.5"><Button variant="link" onClick={() => { setEditing(row); setIsNew(false); setErrors({}); }} className="h-auto p-0 text-[11px] text-info">{row.manufacturer}</Button></td>
                <td className="max-w-56 truncate px-2 py-1.5 text-foreground">{row.fullName || "—"}</td>
                <td className="max-w-64 truncate px-2 py-1.5">{row.website ? <a href={row.website} target="_blank" rel="noreferrer" className="text-info hover:underline">{row.website}</a> : "—"}</td>
                <td className="max-w-48 truncate px-2 py-1.5">{row.ascInfo ? <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" />{row.ascInfo}</span> : "—"}</td>
                <td className="whitespace-nowrap px-2 py-1.5 tabular-nums">{row.dateAdded || "—"}</td>
                <td className="px-2 py-1.5"><StatusBadge status={row.status} /></td>
              </tr>) : <tr><td colSpan={8} className="h-32 text-center text-muted-foreground"><Search className="mx-auto mb-2 h-5 w-5" />No manufacturers match the current filters.</td></tr>}</tbody>
            </table>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
            <span>Page {currentPage} of {totalPages} · {filtered.length} records</span>
            <div className="flex items-center gap-2"><span>Rows</span><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger aria-label="Rows per page" className="h-7 w-16 text-[11px]"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZES.map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select><Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft className="h-3.5 w-3.5" /></Button><Button variant="outline" size="icon" className="h-7 w-7" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}><ChevronRight className="h-3.5 w-3.5" /></Button></div>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default ManageManufacturers;
