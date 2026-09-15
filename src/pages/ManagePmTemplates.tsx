import { Fragment, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight, FileSpreadsheet, Plus, RotateCcw, Search, Upload } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PM_TEMPLATE_RECORDS, PmTemplateRecord, PmTemplateStatus } from "@/lib/standards/pm-templates";

type Filters = { status: string; document: string; description: string };
const EMPTY_FILTERS: Filters = { status: "Active", document: "", description: "" };
const PAGE_SIZE = 10;
const CONTROL = "h-7 text-[11px]";

const emptyTemplate = (): PmTemplateRecord => ({
  id: `template-${Date.now()}`,
  status: "Pending Validation",
  document: "",
  description: "",
  revision: 1,
  comments: "",
  createdBy: "Admin User",
  createdDate: "",
  modifiedBy: "",
  modifiedDate: "",
  validatedBy: "",
  validatedDate: "",
  replacementReason: "",
  linkedSchedules: 0,
  revisions: [],
});

const StatusBadge = ({ status }: { status: PmTemplateStatus }) => (
  <Badge variant="outline" className={cn("rounded-full border-transparent px-2 py-0.5 text-[10px] font-medium", status === "Active" ? "bg-success/10 text-success" : status === "Pending Validation" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground")}>
    <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full", status === "Active" ? "bg-success" : status === "Pending Validation" ? "bg-warning-foreground" : "bg-muted-foreground")} />{status}
  </Badge>
);

const ManagePmTemplates = () => {
  const [templates, setTemplates] = useState(PM_TEMPLATE_RECORDS);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<PmTemplateRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [pendingFile, setPendingFile] = useState("");
  const [page, setPage] = useState(1);
  const fileInput = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => templates.filter((template) => {
    if (filters.status !== "all" && template.status !== filters.status) return false;
    if (filters.document && !template.document.toLowerCase().includes(filters.document.toLowerCase())) return false;
    if (filters.description && !template.description.toLowerCase().includes(filters.description.toLowerCase())) return false;
    return true;
  }), [filters, templates]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const toggleExpanded = (id: string) => setExpanded((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const updateEditing = <K extends keyof PmTemplateRecord>(key: K, value: PmTemplateRecord[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const openEditor = (template?: PmTemplateRecord) => { setEditing(template ? { ...template } : emptyTemplate()); setIsNew(!template); setPendingFile(""); };
  const cancelEditor = () => { setEditing(null); setIsNew(false); setPendingFile(""); };
  const saveTemplate = () => {
    if (!editing?.description.trim()) {
      toast({ title: "Description is required", description: "Enter a template description before saving.", variant: "destructive" });
      return;
    }
    if (isNew && !pendingFile) {
      toast({ title: "Document is required", description: "Select the template document before saving.", variant: "destructive" });
      return;
    }
    const now = "09/15/2026 04:24 AM";
    const document = pendingFile || editing.document;
    const revision = pendingFile && !isNew ? editing.revision + 1 : editing.revision;
    const saved: PmTemplateRecord = {
      ...editing,
      document,
      revision,
      createdDate: editing.createdDate || now,
      modifiedBy: "Admin User",
      modifiedDate: now,
      revisions: pendingFile ? [{ id: `${editing.id}-revision-${revision}`, revision, document, description: editing.description, validatedBy: "", validatedDate: now, reason: editing.replacementReason || "New template document uploaded." }, ...editing.revisions] : editing.revisions,
    };
    setTemplates((current) => isNew ? [saved, ...current] : current.map((item) => item.id === saved.id ? saved : item));
    toast({ title: isNew ? "Template added" : "Template updated", description: `${saved.description} was saved.` });
    cancelEditor();
  };

  return <div className="min-h-full bg-background">
    <ModernTopNav />
    <main className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6">
      <section className="border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-muted-foreground" /><div><h2 className="text-sm font-semibold">Manage PM / Interim Check Templates</h2><p className="text-[11px] text-muted-foreground">Search templates, review revisions, and maintain controlled documents.</p></div></div>
          <Button size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => openEditor()}><Plus className="h-3.5 w-3.5" /> Add New</Button>
        </div>
        <div className="grid gap-3 px-4 py-3 md:grid-cols-3">
          <CompactField label="Status"><Select value={draftFilters.status} onValueChange={(value) => setDraftFilters((current) => ({ ...current, status: value }))}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Pending Validation">Pending Validation</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></CompactField>
          <CompactField label="Doc / Tool"><Input className={CONTROL} value={draftFilters.document} onChange={(event) => setDraftFilters((current) => ({ ...current, document: event.target.value }))} /></CompactField>
          <CompactField label="Description"><Input className={CONTROL} value={draftFilters.description} onChange={(event) => setDraftFilters((current) => ({ ...current, description: event.target.value }))} /></CompactField>
        </div>
        <div className="flex justify-end gap-2 border-t bg-muted/30 px-4 py-2.5"><Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => { setDraftFilters(EMPTY_FILTERS); setFilters(EMPTY_FILTERS); setPage(1); }}><RotateCcw className="h-3.5 w-3.5" /> Clear</Button><Button size="sm" className="h-7 gap-1.5 bg-info text-info-foreground hover:bg-info/90 text-[11px]" onClick={() => { setFilters(draftFilters); setPage(1); }}><Search className="h-3.5 w-3.5" /> Search</Button></div>
      </section>

      {editing && <TemplateEditor template={editing} isNew={isNew} pendingFile={pendingFile} fileInput={fileInput} onFile={setPendingFile} onChange={updateEditing} onCancel={cancelEditor} onSave={saveTemplate} />}

      <section className="overflow-hidden border bg-card">
        <div className="border-b px-4 py-3"><h2 className="text-sm font-semibold">Template Results</h2><p className="text-[11px] text-muted-foreground">{filtered.length} records returned · Expand a row to review revision history.</p></div>
        <div className="max-h-[58vh] overflow-auto"><Table className="min-w-[1120px] text-[11px]"><TableHeader><TableRow><TableHead className="sticky left-0 top-0 z-20 h-8 w-8 bg-muted/95" /><TableHead className="sticky left-8 top-0 z-20 h-8 min-w-[300px] bg-muted/95">Doc / Tool</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Status</TableHead><TableHead className="sticky top-0 z-10 h-8 min-w-[280px] bg-muted/95">Description</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Validated By</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Validated Date</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Rev</TableHead><TableHead className="sticky top-0 z-10 h-8 min-w-[240px] bg-muted/95">Comments</TableHead><TableHead className="sticky top-0 z-10 h-8 w-16 bg-muted/95 text-right">Action</TableHead></TableRow></TableHeader>
          <TableBody>{pageRows.length ? pageRows.map((template) => <Fragment key={template.id}><TableRow className="group cursor-pointer" onClick={() => toggleExpanded(template.id)}><TableCell className="sticky left-0 z-10 bg-card px-2 group-hover:bg-muted/50"><Button variant="ghost" size="icon" className="h-5 w-5" aria-label={`${expanded.has(template.id) ? "Collapse" : "Expand"} ${template.description}`}>{expanded.has(template.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</Button></TableCell><TableCell className="sticky left-8 z-10 bg-card px-2 font-medium text-info group-hover:bg-muted/50">{template.document}</TableCell><TableCell><StatusBadge status={template.status} /></TableCell><TableCell>{template.description}</TableCell><TableCell>{template.validatedBy || "—"}</TableCell><TableCell className="tabular-nums">{template.validatedDate || "—"}</TableCell><TableCell>{template.revision}</TableCell><TableCell>{template.comments || "—"}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={(event) => { event.stopPropagation(); openEditor(template); }}>Edit</Button></TableCell></TableRow>
            {expanded.has(template.id) && <TableRow className="bg-muted/20"><TableCell colSpan={9} className="p-3"><RevisionTable template={template} /></TableCell></TableRow>}</Fragment>) : <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">No templates match the selected criteria.</TableCell></TableRow>}</TableBody></Table></div>
        <div className="flex items-center justify-between border-t px-4 py-2"><p className="text-[11px] text-muted-foreground">{filtered.length ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}` : "No results"}</p><div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span className="text-[11px] text-muted-foreground">Page {page} of {pageCount}</span><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
      </section>
    </main>
  </div>;
};

const CompactField = ({ label, children }: { label: string; children: React.ReactNode }) => <div className="space-y-1"><Label className="text-[11px] font-medium text-foreground/80">{label}</Label>{children}</div>;

const RevisionTable = ({ template }: { template: PmTemplateRecord }) => <div className="overflow-hidden border bg-card"><div className="border-b px-3 py-2 text-[11px] font-semibold">Revision History</div><Table><TableHeader><TableRow><TableHead className="h-7 text-[10px]">Doc / Tool</TableHead><TableHead className="h-7 text-[10px]">Description</TableHead><TableHead className="h-7 text-[10px]">Validated By</TableHead><TableHead className="h-7 text-[10px]">Validated Date</TableHead><TableHead className="h-7 text-[10px]">Revision</TableHead><TableHead className="h-7 text-[10px]">Reason</TableHead></TableRow></TableHeader><TableBody>{template.revisions.map((revision) => <TableRow key={revision.id}><TableCell className="py-2 text-info">{revision.document}</TableCell><TableCell className="py-2">{revision.description}</TableCell><TableCell className="py-2">{revision.validatedBy || "—"}</TableCell><TableCell className="py-2 tabular-nums">{revision.validatedDate}</TableCell><TableCell className="py-2">{revision.revision}</TableCell><TableCell className="py-2">{revision.reason}</TableCell></TableRow>)}</TableBody></Table></div>;

const TemplateEditor = ({ template, isNew, pendingFile, fileInput, onFile, onChange, onCancel, onSave }: { template: PmTemplateRecord; isNew: boolean; pendingFile: string; fileInput: React.RefObject<HTMLInputElement>; onFile: (value: string) => void; onChange: <K extends keyof PmTemplateRecord>(key: K, value: PmTemplateRecord[K]) => void; onCancel: () => void; onSave: () => void }) => <section className="border-2 border-info bg-card">
  <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-info/5 px-4 py-3"><div><h2 className="text-sm font-semibold">{isNew ? "Add New" : "Edit"} PM / Interim Check Template</h2><p className="text-[11px] text-muted-foreground">Maintain template details, document revisions, and linked schedule information.</p></div><div className="flex items-center gap-3"><StatusBadge status={template.status} /><span className="text-[11px] text-muted-foreground">Revision {template.revision}</span></div></div>
  <div className="grid gap-6 px-4 py-4 lg:grid-cols-3">
    <div className="space-y-3"><BandTitle label="General Information" /><CompactField label="Status"><Select value={template.status} onValueChange={(value) => onChange("status", value as PmTemplateStatus)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Pending Validation">Pending Validation</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></CompactField><CompactField label="Description *"><Input className={CONTROL} value={template.description} onChange={(event) => onChange("description", event.target.value)} /></CompactField><div className="grid grid-cols-2 gap-3"><CompactField label="Revision"><Input className={CONTROL} value={String(template.revision)} disabled /></CompactField><CompactField label="Linked Schedules"><Input className={CONTROL} value={String(template.linkedSchedules)} disabled /></CompactField></div></div>
    <div className="space-y-3 lg:border-x lg:px-6"><BandTitle label="Document Control" /><CompactField label="Active Doc / Tool"><Input className={CONTROL} value={template.document || "No active document"} disabled /></CompactField><input ref={fileInput} type="file" className="hidden" accept=".xlsx,.xls,.pdf,.doc,.docx" onChange={(event) => onFile(event.target.files?.[0]?.name ?? "")} /><Button type="button" variant="outline" className="h-20 w-full border-dashed text-[11px]" onClick={() => fileInput.current?.click()}><Upload className="mr-2 h-4 w-4" />{pendingFile || "Select or drag a replacement document"}</Button><CompactField label="Reason for New Doc / Tool"><Textarea className="min-h-16 resize-none text-xs" value={template.replacementReason} onChange={(event) => onChange("replacementReason", event.target.value)} /></CompactField></div>
    <div className="space-y-3"><BandTitle label="Audit & Schedule Information" /><div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]"><Audit label="Created By" value={template.createdBy} /><Audit label="Created Date" value={template.createdDate || "On save"} /><Audit label="Modified By" value={template.modifiedBy || "—"} /><Audit label="Modified Date" value={template.modifiedDate || "—"} /><Audit label="Validated By" value={template.validatedBy || "—"} /><Audit label="Validated Date" value={template.validatedDate || "—"} /></div><div className="border bg-muted/20 p-3 text-[11px] text-muted-foreground">{template.linkedSchedules ? `${template.linkedSchedules} active or completed schedules use this template.` : "No schedules are linked to this template yet."}</div>{!isNew && <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => onChange("status", template.status === "Inactive" ? "Active" : "Inactive")}>{template.status === "Inactive" ? "Set Active" : "Set Inactive"}</Button>}</div>
  </div>
  <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-card px-4 py-3"><Button variant="outline" className="h-8 text-xs" onClick={onCancel}>Cancel</Button><Button className="h-8 text-xs" onClick={onSave}>Save</Button></div>
</section>;

const BandTitle = ({ label }: { label: string }) => <div className="flex items-center gap-2"><span className="h-3 w-1 bg-info" /><h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</h3></div>;
const Audit = ({ label, value }: { label: string; value: string }) => <div><p className="text-[10px] uppercase text-muted-foreground">{label}</p><p className="font-medium text-foreground">{value}</p></div>;

export default ManagePmTemplates;