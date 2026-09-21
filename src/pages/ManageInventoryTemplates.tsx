import { Fragment, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronRight, FileCheck2, FileSpreadsheet, FlaskConical, Plus, RotateCcw, Search, UploadCloud } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { INVENTORY_APPROVERS, INVENTORY_LAB_CODES, INVENTORY_TEMPLATE_RECORDS, InventoryTemplateRecord, InventoryTemplateStatus } from "@/lib/inventory-templates";

type Filters = {
  name: string; jmt: string; comments: string; labCode: string; version: string;
  status: string; approvedBy: string; approvedFrom?: Date; approvedTo?: Date;
  includeProducts: boolean; includeAllVersions: boolean; manufacturer: string;
  model: string; description: string; productLabCode: string;
};

const emptyFilters = (): Filters => ({
  name: "", jmt: "", comments: "", labCode: "all", version: "", status: "all",
  approvedBy: "all", approvedFrom: undefined, approvedTo: undefined, includeProducts: false,
  includeAllVersions: false, manufacturer: "", model: "", description: "", productLabCode: "all",
});
const CONTROL = "h-7 text-[11px]";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1"><Label className="text-[11px] font-medium">{label}</Label>{children}</div>
);

const StatusBadge = ({ status }: { status: InventoryTemplateStatus }) => (
  <Badge variant="outline" className={cn("rounded-full border-transparent px-2 py-0.5 text-[10px] font-medium", status === "Validated" ? "bg-success/10 text-success" : status === "Not Validated" ? "bg-warning/15 text-warning-foreground" : "bg-muted text-muted-foreground")}>
    <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", status === "Validated" ? "bg-success" : status === "Not Validated" ? "bg-warning" : "bg-muted-foreground")} />{status}
  </Badge>
);

const parseLegacyDate = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const ManageInventoryTemplates = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => INVENTORY_TEMPLATE_RECORDS.filter((record) => {
    const contains = (source: string, term: string) => source.toLowerCase().includes(term.trim().toLowerCase());
    if (filters.name && !contains(record.name, filters.name)) return false;
    if (filters.jmt && !contains(record.jmtNumber, filters.jmt)) return false;
    if (filters.comments && !contains(record.comments, filters.comments)) return false;
    if (filters.version && String(record.version) !== filters.version.trim()) return false;
    if (filters.labCode !== "all" && record.labCode !== filters.labCode) return false;
    if (filters.status !== "all" && record.status !== filters.status) return false;
    if (filters.approvedBy !== "all" && record.approvedBy !== filters.approvedBy) return false;
    const approved = parseLegacyDate(record.approvedDate);
    if (filters.approvedFrom && approved && approved < filters.approvedFrom) return false;
    if (filters.approvedTo && approved) { const end = new Date(filters.approvedTo); end.setHours(23, 59, 59, 999); if (approved > end) return false; }
    if (filters.includeProducts) {
      if (filters.manufacturer && !contains(record.manufacturer, filters.manufacturer)) return false;
      if (filters.model && !contains(record.model, filters.model)) return false;
      if (filters.description && !contains(record.description, filters.description)) return false;
      if (filters.productLabCode !== "all" && record.productLabCode !== filters.productLabCode) return false;
    }
    return true;
  }), [filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const clear = () => { const next = emptyFilters(); setDraft(next); setFilters(next); setPage(1); setExpanded(new Set()); };
  const search = () => { setFilters({ ...draft }); setPage(1); };
  const toggle = (id: string) => setExpanded((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });

  return <div className="flex h-dvh min-h-0 flex-col bg-background">
    <ModernTopNav />
    <main className="flex min-h-0 flex-1 flex-col gap-3 px-3 py-3 sm:px-4 lg:px-6">
      <section className="rounded-lg border bg-card shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5">
          <div className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-muted-foreground" /><div><h2 className="text-sm font-semibold">Search Criteria</h2><p className="text-[11px] text-muted-foreground">Find controlled templates and their associated products.</p></div></div>
          <Button size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => navigate("/inventory/templates/new")}><Plus className="h-3.5 w-3.5" /> Add Template</Button>
        </div>
        <div className="grid gap-x-3 gap-y-2 px-4 py-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <Field label="Template Name"><Input className={CONTROL} value={draft.name} onChange={(event) => update("name", event.target.value)} /></Field>
          <Field label="JMT #"><Input className={CONTROL} value={draft.jmt} onChange={(event) => update("jmt", event.target.value)} /></Field>
          <Field label="Comments"><Input className={CONTROL} value={draft.comments} onChange={(event) => update("comments", event.target.value)} /></Field>
          <Field label="Lab Code"><Select value={draft.labCode} onValueChange={(value) => update("labCode", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All lab codes</SelectItem>{INVENTORY_LAB_CODES.map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Version"><Input className={CONTROL} inputMode="numeric" value={draft.version} onChange={(event) => update("version", event.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="Status"><Select value={draft.status} onValueChange={(value) => update("status", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Validated">Validated</SelectItem><SelectItem value="Not Validated">Not Validated</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></Field>
          <Field label="Approved By"><Select value={draft.approvedBy} onValueChange={(value) => update("approvedBy", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All approvers</SelectItem>{INVENTORY_APPROVERS.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Approved From"><ModernDatePicker size="sm" value={draft.approvedFrom} onChange={(value) => update("approvedFrom", value)} /></Field>
          <Field label="Approved To"><ModernDatePicker size="sm" value={draft.approvedTo} onChange={(value) => update("approvedTo", value)} /></Field>
          <div className="flex items-end gap-5 pb-1 sm:col-span-2 lg:col-span-3">
            <label className="flex items-center gap-2 text-[11px] font-medium"><Checkbox checked={draft.includeProducts} onCheckedChange={(value) => update("includeProducts", value === true)} /> Include Products</label>
            <label className="flex items-center gap-2 text-[11px] font-medium"><Checkbox checked={draft.includeAllVersions} onCheckedChange={(value) => update("includeAllVersions", value === true)} /> Include All Versions</label>
          </div>
          {draft.includeProducts && <>
            <Field label="Manufacturer"><Input className={CONTROL} value={draft.manufacturer} onChange={(event) => update("manufacturer", event.target.value)} /></Field>
            <Field label="Model"><Input className={CONTROL} value={draft.model} onChange={(event) => update("model", event.target.value)} /></Field>
            <Field label="Product Description"><Input className={CONTROL} value={draft.description} onChange={(event) => update("description", event.target.value)} /></Field>
            <Field label="Product Lab Code"><Select value={draft.productLabCode} onValueChange={(value) => update("productLabCode", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All lab codes</SelectItem>{INVENTORY_LAB_CODES.map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent></Select></Field>
          </>}
        </div>
        <div className="flex justify-end gap-2 rounded-b-lg border-t bg-muted/30 px-4 py-2"><Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={clear}><RotateCcw className="h-3.5 w-3.5" /> Clear</Button><Button size="sm" className="h-7 gap-1.5 bg-info text-info-foreground hover:bg-info/90 text-[11px]" onClick={search}><Search className="h-3.5 w-3.5" /> Search</Button></div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-card shadow-xs">
        <div className="flex items-center justify-between border-b px-4 py-2.5"><div><h2 className="text-sm font-semibold">Template Results</h2><p className="text-[11px] text-muted-foreground">{filtered.length} records returned · Expand validated rows to review testing details.</p></div></div>
        <div className="min-h-0 flex-1 overflow-auto">
          <Table className={cn("text-[11px]", filters.includeProducts ? "min-w-[1700px]" : "min-w-[1120px]")}><TableHeader><TableRow>
            <TableHead className="sticky left-0 top-0 z-30 h-8 w-8 bg-muted" /><TableHead className="sticky left-8 top-0 z-30 h-8 min-w-[260px] bg-muted">Template Name</TableHead><TableHead className="sticky top-0 z-20 h-8 bg-muted">Status</TableHead><TableHead className="sticky top-0 z-20 h-8 bg-muted">JMT #</TableHead><TableHead className="sticky top-0 z-20 h-8 min-w-[150px] bg-muted">Lab Code</TableHead><TableHead className="sticky top-0 z-20 h-8 bg-muted">Approved By</TableHead><TableHead className="sticky top-0 z-20 h-8 min-w-[150px] bg-muted">Approved Date</TableHead><TableHead className="sticky top-0 z-20 h-8 bg-muted">Version</TableHead><TableHead className="sticky top-0 z-20 h-8 min-w-[300px] bg-muted">Comments</TableHead>
            {filters.includeProducts && <><TableHead className="sticky top-0 z-20 h-8 min-w-[180px] bg-muted">Manufacturer</TableHead><TableHead className="sticky top-0 z-20 h-8 min-w-[150px] bg-muted">Model</TableHead><TableHead className="sticky top-0 z-20 h-8 min-w-[210px] bg-muted">Description</TableHead><TableHead className="sticky top-0 z-20 h-8 min-w-[160px] bg-muted">Product Lab Code</TableHead></>}
          </TableRow></TableHeader><TableBody>{pageRows.map((record) => <Fragment key={record.id}><TableRow className="group cursor-pointer" onClick={() => toggle(record.id)}>
            <TableCell className="sticky left-0 z-10 bg-card px-2 group-hover:bg-muted/50"><Button variant="ghost" size="icon" className="h-5 w-5" aria-label={`${expanded.has(record.id) ? "Collapse" : "Expand"} ${record.name}`}>{expanded.has(record.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</Button></TableCell>
            <TableCell className="sticky left-8 z-10 bg-card py-1.5 font-medium text-info group-hover:bg-muted/50">{record.name}</TableCell><TableCell className="py-1.5"><StatusBadge status={record.status} /></TableCell><TableCell className="py-1.5 font-medium">{record.jmtNumber}</TableCell><TableCell className="py-1.5">{record.labCode}</TableCell><TableCell className="py-1.5">{record.approvedBy}</TableCell><TableCell className="py-1.5 tabular-nums">{record.approvedDate}</TableCell><TableCell className="py-1.5 text-center">{record.version}</TableCell><TableCell className="max-w-[320px] truncate py-1.5" title={record.comments}>{record.comments}</TableCell>
            {filters.includeProducts && <><TableCell className="py-1.5">{record.manufacturer}</TableCell><TableCell className="py-1.5">{record.model}</TableCell><TableCell className="py-1.5">{record.description}</TableCell><TableCell className="py-1.5">{record.productLabCode}</TableCell></>}
          </TableRow>{expanded.has(record.id) && <TableRow className="bg-muted/20"><TableCell colSpan={filters.includeProducts ? 13 : 9} className="p-3"><ValidationDetails record={record} /></TableCell></TableRow>}</Fragment>)}</TableBody></Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-card px-4 py-2">
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => navigate(-1)}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><span>Page {page} of {pageCount}</span><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-7 w-[92px] text-[11px]"><SelectValue /></SelectTrigger><SelectContent>{[5, 10, 20].map((size) => <SelectItem key={size} value={String(size)}>{size} rows</SelectItem>)}</SelectContent></Select></div>
        </div>
      </section>
    </main>
  </div>;
};

const ValidationDetails = ({ record }: { record: InventoryTemplateRecord }) => record.validations.length ? (
  <div className="overflow-hidden rounded-md border bg-card"><div className="border-b px-3 py-2 text-[11px] font-semibold">Validation History</div><Table className="min-w-[900px] text-[11px]"><TableHeader><TableRow><TableHead className="h-7">Validated By</TableHead><TableHead className="h-7">Date</TableHead><TableHead className="h-7">Status</TableHead><TableHead className="h-7">WO #</TableHead><TableHead className="h-7">Manufacturer</TableHead><TableHead className="h-7">Model</TableHead><TableHead className="h-7">Comments</TableHead></TableRow></TableHeader><TableBody>{record.validations.map((validation) => <TableRow key={`${record.id}-${validation.workOrder}`}><TableCell className="py-1.5">{validation.validatedBy}</TableCell><TableCell className="py-1.5 tabular-nums">{validation.date}</TableCell><TableCell className="py-1.5 text-success"><span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{validation.status}</span></TableCell><TableCell className="py-1.5 text-info">{validation.workOrder}</TableCell><TableCell className="py-1.5">{validation.manufacturer}</TableCell><TableCell className="py-1.5">{validation.model}</TableCell><TableCell className="py-1.5">{validation.comments}</TableCell></TableRow>)}</TableBody></Table></div>
) : <div className="rounded-md border border-dashed px-4 py-5 text-center text-[11px] text-muted-foreground">This template has not been validated yet.</div>;

export const AddInventoryTemplate = () => {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState("");
  const [datasheet, setDatasheet] = useState("");
  const [sheet, setSheet] = useState("");
  const [tested, setTested] = useState(false);
  const [jmt, setJmt] = useState("");
  const [labCode, setLabCode] = useState("");
  const [comments, setComments] = useState("");
  const chooseFile = (selected?: File) => { if (selected) { setFile(selected.name); setDatasheet(selected.name); setSheet("Sheet1"); setTested(false); } };
  const runTest = () => { if (!file || !datasheet || !sheet) { toast({ title: "Select a template first", description: "Choose a spreadsheet and worksheet before testing.", variant: "destructive" }); return; } setTested(true); toast({ title: "Template test passed", description: "The sample preview is ready for review." }); };
  const save = () => { if (!file || !tested || !jmt.trim() || !labCode || !comments.trim()) { toast({ title: "Complete the required information", description: "Test the file, then enter JMT #, Lab Code, and comments.", variant: "destructive" }); return; } toast({ title: "Template moved", description: `${file} is now available in Manage Templates.` }); navigate("/inventory/templates"); };

  return <div className="flex h-dvh min-h-0 flex-col bg-background"><ModernTopNav /><main className="flex min-h-0 flex-1 flex-col gap-3 px-3 py-3 sm:px-4 lg:px-6"><section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-card shadow-xs">
    <div className="flex items-center gap-2 border-b px-4 py-3"><UploadCloud className="h-4 w-4 text-muted-foreground" /><div><h2 className="text-sm font-semibold">Add Template</h2><p className="text-[11px] text-muted-foreground">Upload, test, and approve a controlled product template.</p></div></div>
    <div className="min-h-0 flex-1 overflow-auto p-4"><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><Field label="Datasheet Template *"><Select value={datasheet} onValueChange={setDatasheet}><SelectTrigger className={CONTROL}><SelectValue placeholder="Select uploaded template" /></SelectTrigger><SelectContent>{file && <SelectItem value={file}>{file}</SelectItem>}</SelectContent></Select></Field><Field label="Sheet to Test *"><Select value={sheet} onValueChange={setSheet}><SelectTrigger className={CONTROL}><SelectValue placeholder="Select worksheet" /></SelectTrigger><SelectContent><SelectItem value="Sheet1">Sheet1</SelectItem><SelectItem value="Calibration Data">Calibration Data</SelectItem><SelectItem value="Certificate">Certificate</SelectItem></SelectContent></Select></Field></div><Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={runTest}><FlaskConical className="h-3.5 w-3.5" /> Test Template</Button>
        <div className="rounded-lg border bg-muted/20 p-4"><h3 className="mb-3 text-xs font-semibold">Production Information</h3><div className="grid gap-3 sm:grid-cols-2"><Field label="JMT # *"><Input className={CONTROL} value={jmt} onChange={(event) => setJmt(event.target.value.toUpperCase())} /></Field><Field label="Lab Code *"><Select value={labCode} onValueChange={setLabCode}><SelectTrigger className={CONTROL}><SelectValue placeholder="Select lab code" /></SelectTrigger><SelectContent>{INVENTORY_LAB_CODES.map((code) => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent></Select></Field></div><div className="mt-3"><Field label="Comments *"><Textarea className="min-h-20 resize-none text-xs" value={comments} onChange={(event) => setComments(event.target.value)} placeholder="Describe the template and any conversion notes." /></Field></div></div>
      </div>
      <div className="space-y-4"><input ref={fileInput} type="file" className="hidden" accept=".xlsx,.xls" onChange={(event) => chooseFile(event.target.files?.[0])} /><div role="button" tabIndex={0} className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 p-5 text-center transition-colors hover:bg-muted/30" onClick={() => fileInput.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInput.current?.click(); }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files?.[0]); }}><UploadCloud className="mb-2 h-7 w-7 text-muted-foreground" /><p className="text-sm font-medium">{file || "Drag a template here"}</p><p className="mt-1 text-[11px] text-muted-foreground">Excel files only · Click to browse</p></div>
        <div className={cn("rounded-lg border p-4", tested ? "border-success/30 bg-success/5" : "bg-muted/20")}><div className="flex items-center gap-2">{tested ? <CheckCircle2 className="h-4 w-4 text-success" /> : <FileCheck2 className="h-4 w-4 text-muted-foreground" />}<div><p className="text-xs font-semibold">Sample Preview</p><p className="text-[11px] text-muted-foreground">{tested ? "Template passed testing and the sample PDF is ready." : "Run Test Template to generate a sample preview."}</p></div></div>{tested && <Button variant="outline" size="sm" className="mt-3 h-7 text-[11px]" onClick={() => toast({ title: "Sample PDF", description: "The mock sample preview passed all validation checks." })}>View Sample PDF</Button>}</div>
      </div>
    </div></div>
  </section>
  <footer className="sticky bottom-0 z-30 flex shrink-0 items-center justify-between gap-2 border-t bg-card px-3 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.06)] sm:px-4 lg:px-6"><Button variant="outline" className="h-8 gap-1.5 text-xs" onClick={() => navigate("/inventory/templates")}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button><Button className="h-8 text-xs" onClick={save}>Move to Templates</Button></footer>
</main></div>;
};

export default ManageInventoryTemplates;