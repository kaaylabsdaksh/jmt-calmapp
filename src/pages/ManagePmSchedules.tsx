import { Fragment, useEffect, useMemo, useState } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight, Plus, RotateCcw, Search } from "lucide-react";

import ModernTopNav from "@/components/modern/ModernTopNav";
import { WorkOrderItemComments } from "@/components/WorkOrderItemComments";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { STANDARDS } from "@/lib/standards/data";
import { PM_SCHEDULES, PM_STATIONS, PmSchedule } from "@/lib/standards/pm-interim-checks";
import { PM_TEMPLATE_RECORDS } from "@/lib/standards/pm-templates";

type ScheduleState = "Pending" | "Active" | "Completed" | "Cancelled";
type ManagedSchedule = PmSchedule & {
  scheduleStatus: ScheduleState;
  year: string;
  interval: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
};
type Filters = { type: string; station: string; standardNo: string; description: string; status: string; completedStatus: string; frequency: string; dueFrom?: Date; dueTo?: Date; terminalFrom?: Date; terminalTo?: Date };

const LIST_PATH = "/standards/manage-pm-interim-checks/schedules";
const CONTROL = "h-7 text-[11px]";
const PAGE_SIZE = 20;
const EMPTY_FILTERS: Filters = { type: "all", station: "all", standardNo: "", description: "", status: "Active", completedStatus: "all", frequency: "all" };

const managedSeed: ManagedSchedule[] = PM_SCHEDULES.map((row) => ({
  ...row,
  scheduleStatus: row.status,
  year: row.dueDate.split("/")[2] ?? "2026",
  interval: row.frequency === "D" ? "12" : "3",
  createdBy: "Admin User",
  createdDate: "09/16/2026 04:33 AM",
  modifiedBy: row.status === "Completed" ? "Admin User" : "",
  modifiedDate: row.status === "Completed" ? "09/16/2026 04:38 AM" : "",
}));

const emptySchedule = (): ManagedSchedule => ({
  id: `schedule-${Date.now()}`,
  dueDate: "",
  terminalDate: "",
  account: "",
  type: "IM",
  status: "Active",
  scheduleStatus: "Pending",
  lastResult: "",
  frequency: "M",
  division: "Lab",
  labCodes: "",
  station: "",
  documentTool: "",
  standards: [],
  location: "",
  templateDescription: "",
  completedUser: "",
  histories: [],
  year: "2026",
  interval: "3",
  createdBy: "Admin User",
  createdDate: "",
  modifiedBy: "",
  modifiedDate: "",
});

const parseDate = (value: string) => {
  if (!value) return undefined;
  const [month, day, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};
const dateText = (value?: Date) => value ? format(value, "MM/dd/yyyy") : "";
const inRange = (value: string, from?: Date, to?: Date) => {
  const date = parseDate(value)?.getTime();
  if (!date) return false;
  return (!from || date >= startOfDay(from).getTime()) && (!to || date <= new Date(to).setHours(23, 59, 59, 999));
};

const StatusBadge = ({ status }: { status: ScheduleState }) => {
  const style = status === "Active" ? "bg-success/10 text-success" : status === "Pending" ? "bg-warning text-warning-foreground" : status === "Cancelled" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground";
  const dot = status === "Active" ? "bg-success" : status === "Pending" ? "bg-warning-foreground" : status === "Cancelled" ? "bg-destructive" : "bg-muted-foreground";
  return <Badge variant="outline" className={cn("rounded-full border-transparent px-2 py-0.5 text-[10px] font-medium", style)}><span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full", dot)} />{status}</Badge>;
};

const ManagePmSchedules = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [schedules, setSchedules] = useState(managedSeed);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<ManagedSchedule | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!scheduleId) { setEditing(null); setIsNew(false); return; }
    if (scheduleId === "new") { setEditing(emptySchedule()); setIsNew(true); return; }
    const found = schedules.find((row) => row.id === scheduleId);
    if (found) { setEditing({ ...found, standards: [...found.standards], histories: [...found.histories] }); setIsNew(false); }
    else navigate(LIST_PATH, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  const filtered = useMemo(() => schedules.filter((row) => {
    if (filters.type !== "all" && row.type !== filters.type) return false;
    if (filters.station !== "all" && row.station !== filters.station) return false;
    if (filters.standardNo && !row.standards.some((standard) => standard.includes(filters.standardNo))) return false;
    if (filters.description && !row.templateDescription.toLowerCase().includes(filters.description.toLowerCase())) return false;
    if (filters.status !== "all" && row.scheduleStatus !== filters.status) return false;
    if (filters.completedStatus !== "all" && row.lastResult !== filters.completedStatus) return false;
    if (filters.frequency !== "all" && row.frequency !== filters.frequency) return false;
    if ((filters.dueFrom || filters.dueTo) && !inRange(row.dueDate, filters.dueFrom, filters.dueTo)) return false;
    if ((filters.terminalFrom || filters.terminalTo) && !inRange(row.terminalDate, filters.terminalFrom, filters.terminalTo)) return false;
    return true;
  }), [filters, schedules]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const updateEditing = <K extends keyof ManagedSchedule>(key: K, value: ManagedSchedule[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const saveSchedule = () => {
    if (!editing?.documentTool || !editing.station || !editing.dueDate || !editing.terminalDate || !editing.templateDescription.trim()) {
      toast({ title: "Required schedule information is missing", description: "Select a template and station, then enter the due date, terminal date, and description.", variant: "destructive" });
      return;
    }
    const due = parseDate(editing.dueDate);
    const terminal = parseDate(editing.terminalDate);
    if (!due || !terminal || isBefore(terminal, due)) {
      toast({ title: "Check the schedule dates", description: "Terminal Date must be on or after Frequency Due Date.", variant: "destructive" });
      return;
    }
    const now = "09/16/2026 04:38 AM";
    const saved = { ...editing, status: editing.scheduleStatus === "Completed" ? "Completed" as const : "Active" as const, createdDate: editing.createdDate || now, modifiedBy: "Admin User", modifiedDate: now };
    setSchedules((current) => isNew ? [saved, ...current] : current.map((row) => row.id === saved.id ? saved : row));
    toast({ title: isNew ? "Schedule added" : "Schedule updated", description: `${saved.templateDescription} was saved.` });
    navigate(LIST_PATH);
  };
  const setLifecycle = (status: ScheduleState) => {
    if (!editing) return;
    const updated = { ...editing, scheduleStatus: status, status: status === "Completed" ? "Completed" as const : "Active" as const, modifiedBy: "Admin User", modifiedDate: "09/16/2026 04:38 AM" };
    setEditing(updated);
    setSchedules((current) => current.map((row) => row.id === updated.id ? updated : row));
    toast({ title: `Schedule ${status.toLowerCase()}`, description: `${updated.id} is now ${status.toLowerCase()}.` });
  };

  return <div className="flex h-dvh min-h-0 flex-col bg-background">
    <ModernTopNav />
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:px-4 lg:px-6">
      {editing ? <ScheduleEditor schedule={editing} isNew={isNew} onChange={updateEditing} onSave={saveSchedule} onLifecycle={setLifecycle} onBack={() => navigate(LIST_PATH)} /> : <>
        <section className="shrink-0 border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"><div><h2 className="text-sm font-semibold">Search Criteria</h2><p className="text-[11px] text-muted-foreground">Find preventive maintenance and interim-check schedules.</p></div><Button size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => navigate(`${LIST_PATH}/new`)}><Plus className="h-3.5 w-3.5" /> Add New</Button></div>
          <div className="grid gap-3 px-4 py-3 md:grid-cols-2 xl:grid-cols-4">
            <CompactField label="Type"><Select value={draftFilters.type} onValueChange={(value) => setDraftFilters((current) => ({ ...current, type: value }))}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="IM">Interim Check</SelectItem><SelectItem value="PM">Preventive Maintenance</SelectItem></SelectContent></Select></CompactField>
            <CompactField label="Station"><Select value={draftFilters.station} onValueChange={(value) => setDraftFilters((current) => ({ ...current, station: value }))}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All stations</SelectItem>{PM_STATIONS.map((station) => <SelectItem key={station} value={station}>{station}</SelectItem>)}</SelectContent></Select></CompactField>
            <CompactField label="Standard #"><Input className={CONTROL} value={draftFilters.standardNo} onChange={(event) => setDraftFilters((current) => ({ ...current, standardNo: event.target.value }))} /></CompactField>
            <CompactField label="Description"><Input className={CONTROL} value={draftFilters.description} onChange={(event) => setDraftFilters((current) => ({ ...current, description: event.target.value }))} /></CompactField>
            <CompactField label="Schedule Status"><Select value={draftFilters.status} onValueChange={(value) => setDraftFilters((current) => ({ ...current, status: value }))}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent>{["all", "Pending", "Active", "Completed", "Cancelled"].map((value) => <SelectItem key={value} value={value}>{value === "all" ? "All statuses" : value}</SelectItem>)}</SelectContent></Select></CompactField>
            <CompactField label="Completed Status"><Select value={draftFilters.completedStatus} onValueChange={(value) => setDraftFilters((current) => ({ ...current, completedStatus: value }))}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All results</SelectItem><SelectItem value="Pass">Pass</SelectItem><SelectItem value="Not Performed">Not Performed</SelectItem></SelectContent></Select></CompactField>
            <CompactField label="Frequency"><Select value={draftFilters.frequency} onValueChange={(value) => setDraftFilters((current) => ({ ...current, frequency: value }))}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All frequencies</SelectItem><SelectItem value="D">Daily</SelectItem><SelectItem value="M">Monthly</SelectItem></SelectContent></Select></CompactField>
            <div className="grid grid-cols-2 gap-2"><CompactField label="Due Date From"><ModernDatePicker size="sm" value={draftFilters.dueFrom} onChange={(value) => setDraftFilters((current) => ({ ...current, dueFrom: value }))} /></CompactField><CompactField label="Due Date To"><ModernDatePicker size="sm" value={draftFilters.dueTo} onChange={(value) => setDraftFilters((current) => ({ ...current, dueTo: value }))} /></CompactField></div>
            <div className="grid grid-cols-2 gap-2 xl:col-start-4"><CompactField label="Terminal Date From"><ModernDatePicker size="sm" value={draftFilters.terminalFrom} onChange={(value) => setDraftFilters((current) => ({ ...current, terminalFrom: value }))} /></CompactField><CompactField label="Terminal Date To"><ModernDatePicker size="sm" value={draftFilters.terminalTo} onChange={(value) => setDraftFilters((current) => ({ ...current, terminalTo: value }))} /></CompactField></div>
          </div>
          <div className="flex justify-end gap-2 border-t bg-muted/30 px-4 py-2.5"><Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => { setDraftFilters(EMPTY_FILTERS); setFilters(EMPTY_FILTERS); setPage(1); }}><RotateCcw className="h-3.5 w-3.5" /> Clear</Button><Button size="sm" className="h-7 gap-1.5 bg-info text-info-foreground hover:bg-info/90 text-[11px]" onClick={() => { setFilters(draftFilters); setPage(1); }}><Search className="h-3.5 w-3.5" /> Search</Button></div>
        </section>

        <section className="flex shrink-0 flex-col border bg-card">
          <div className="border-b px-4 py-3"><h2 className="text-sm font-semibold">Schedule Results</h2><p className="text-[11px] text-muted-foreground">{filtered.length} records returned · Expand a row to review completion history.</p></div>
          <div className="overflow-x-auto"><Table className="min-w-[1380px] text-[11px]"><TableHeader><TableRow><TableHead className="sticky left-0 top-0 z-20 h-8 w-8 bg-muted/95" /><TableHead className="sticky left-8 top-0 z-20 h-8 bg-muted/95">Schedule #</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Station</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Due Date</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Interval</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Terminal Date</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Type</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Status</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Freq.</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Doc / Tool</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Standards</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95">Description</TableHead></TableRow></TableHeader><TableBody>
            {pageRows.map((row) => <Fragment key={row.id}><TableRow className="group cursor-pointer" onClick={() => setExpanded((current) => { const next = new Set(current); next.has(row.id) ? next.delete(row.id) : next.add(row.id); return next; })}><TableCell className="sticky left-0 z-10 bg-card px-2 group-hover:bg-muted/50"><Button variant="ghost" size="icon" className="h-5 w-5" aria-label={`${expanded.has(row.id) ? "Collapse" : "Expand"} schedule ${row.id}`}>{expanded.has(row.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</Button></TableCell><TableCell className="sticky left-8 z-10 bg-card px-2 group-hover:bg-muted/50"><button type="button" className="font-semibold text-info hover:underline" onClick={(event) => { event.stopPropagation(); navigate(`${LIST_PATH}/${row.id}`); }}>{row.id}</button></TableCell><TableCell>{row.station}</TableCell><TableCell>{row.dueDate}</TableCell><TableCell>{row.interval}</TableCell><TableCell>{row.terminalDate}</TableCell><TableCell>{row.type}</TableCell><TableCell><StatusBadge status={row.scheduleStatus} /></TableCell><TableCell>{row.frequency}</TableCell><TableCell><button type="button" className="text-info hover:underline" onClick={(event) => { event.stopPropagation(); toast({ title: row.documentTool, description: "Document preview is not available in mock data." }); }}>{row.documentTool}</button></TableCell><TableCell>{row.standards.join(", ") || "—"}</TableCell><TableCell>{row.templateDescription}</TableCell></TableRow>{expanded.has(row.id) && <TableRow className="bg-muted/20"><TableCell colSpan={12} className="p-3"><HistoryTable schedule={row} /></TableCell></TableRow>}</Fragment>)}
          </TableBody></Table></div>
          <div className="sticky bottom-0 z-30 flex items-center gap-3 border-t bg-card px-4 py-2 shadow-[0_-1px_3px_rgba(0,0,0,0.06)]"><Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => navigate(-1)}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button><span className="h-5 w-px bg-border" /><div className="ml-auto flex items-center gap-2"><span className="text-[11px] text-muted-foreground">{filtered.length ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}` : "No results"}</span><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span className="text-[11px] text-muted-foreground">Page {page} of {pageCount}</span><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
        </section>
      </>}
    </main>
  </div>;
};

const ScheduleEditor = ({ schedule, isNew, onChange, onSave, onLifecycle, onBack }: { schedule: ManagedSchedule; isNew: boolean; onChange: <K extends keyof ManagedSchedule>(key: K, value: ManagedSchedule[K]) => void; onSave: () => void; onLifecycle: (status: ScheduleState) => void; onBack: () => void }) => {
  const readOnly = schedule.scheduleStatus === "Active" || schedule.scheduleStatus === "Completed" || schedule.scheduleStatus === "Cancelled";
  const selectedTemplate = PM_TEMPLATE_RECORDS.find((template) => template.document === schedule.documentTool);
  const standardRows = schedule.standards.map((number) => STANDARDS.find((standard) => standard.standardNo === number)).filter((row) => Boolean(row));
  return <section className="flex min-h-0 flex-1 flex-col bg-card">
    <div className="flex-1 overflow-auto">
      <div className="grid gap-6 px-4 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-4"><BandTitle label="Schedule Assignment" /><CompactField label="Template *"><Select disabled={readOnly} value={schedule.documentTool || undefined} onValueChange={(value) => { const template = PM_TEMPLATE_RECORDS.find((item) => item.document === value); onChange("documentTool", value); onChange("templateDescription", template?.description ?? ""); }}><SelectTrigger className={CONTROL}><SelectValue placeholder="Select template" /></SelectTrigger><SelectContent>{PM_TEMPLATE_RECORDS.map((template) => <SelectItem key={template.id} value={template.document}>{template.document}</SelectItem>)}</SelectContent></Select></CompactField><CompactField label="Station *"><Select disabled={readOnly} value={schedule.station || undefined} onValueChange={(value) => { const standard = STANDARDS.find((item) => value.includes(item.standardNo)); onChange("station", value); onChange("standards", standard ? [standard.standardNo] : schedule.standards); }}><SelectTrigger className={CONTROL}><SelectValue placeholder="Select station" /></SelectTrigger><SelectContent>{PM_STATIONS.map((station) => <SelectItem key={station} value={station}>{station}</SelectItem>)}</SelectContent></Select></CompactField>{selectedTemplate && <button type="button" className="text-[11px] font-medium text-info hover:underline" onClick={() => toast({ title: selectedTemplate.document, description: "Document preview is not available in mock data." })}>Doc / Tool: {selectedTemplate.document}</button>}<div className="overflow-hidden border"><Table><TableHeader><TableRow><TableHead className="h-7 text-[10px]">Std #</TableHead><TableHead className="h-7 text-[10px]">Manufacturer</TableHead><TableHead className="h-7 text-[10px]">Model</TableHead></TableRow></TableHeader><TableBody>{standardRows.length ? standardRows.map((standard) => standard && <TableRow key={standard.id}><TableCell className="py-1.5">{standard.standardNo}</TableCell><TableCell className="py-1.5">{standard.manufacturer}</TableCell><TableCell className="py-1.5">{standard.model}</TableCell></TableRow>) : <TableRow><TableCell colSpan={3} className="h-12 text-center text-[11px] text-muted-foreground">Select a station to view linked standards.</TableCell></TableRow>}</TableBody></Table></div></div>
        <div className="space-y-4 lg:border-l lg:pl-6"><div className="flex items-center justify-between"><BandTitle label="Schedule Settings" /><div className="flex items-center gap-2"><span className="text-[10px] text-muted-foreground">ID: {isNew ? "Assigned on save" : schedule.id}</span><StatusBadge status={schedule.scheduleStatus} /></div></div><div className="grid grid-cols-2 gap-3"><CompactField label="Type *"><Select disabled={readOnly} value={schedule.type} onValueChange={(value) => onChange("type", value as ManagedSchedule["type"])}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="IM">Interim Check</SelectItem><SelectItem value="PM">Preventive Maintenance</SelectItem></SelectContent></Select></CompactField><CompactField label="Frequency *"><Select disabled={readOnly} value={schedule.frequency} onValueChange={(value) => onChange("frequency", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="D">Daily</SelectItem><SelectItem value="M">Monthly</SelectItem></SelectContent></Select></CompactField><CompactField label="Year"><Select disabled={readOnly} value={schedule.year} onValueChange={(value) => onChange("year", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent>{["2026", "2027", "2028"].map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select></CompactField><CompactField label="Frequency Due Date *"><ModernDatePicker disabled={readOnly} size="sm" value={schedule.dueDate} onChange={(value) => onChange("dueDate", dateText(value))} /></CompactField><CompactField label="Interval"><Select disabled={readOnly} value={schedule.interval} onValueChange={(value) => onChange("interval", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent>{["1", "3", "6", "12"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></CompactField><CompactField label="Terminal Date *"><ModernDatePicker disabled={readOnly} size="sm" value={schedule.terminalDate} onChange={(value) => onChange("terminalDate", dateText(value))} /></CompactField></div><CompactField label="Description *"><Textarea disabled={readOnly} className="min-h-20 resize-none text-xs" value={schedule.templateDescription} onChange={(event) => onChange("templateDescription", event.target.value)} /></CompactField><div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3"><Audit label="Created By" value={schedule.createdBy} /><Audit label="Created Date" value={schedule.createdDate || "On save"} /><Audit label="Modified By" value={schedule.modifiedBy || "—"} /><Audit label="Modified Date" value={schedule.modifiedDate || "—"} /></div></div>
      </div>
      {!isNew && <><div className="border-t px-4 py-4"><BandTitle label="History" /><div className="mt-3"><HistoryTable schedule={schedule} /></div></div><div className="border-t px-4 py-4"><BandTitle label="Comments" /><div className="mt-3"><WorkOrderItemComments workOrderItemId={schedule.id} /></div></div></>}
    </div>
    <div className="shrink-0 flex items-center justify-between gap-2 border-t bg-card px-4 py-3"><Button variant="outline" className="h-8 gap-1.5 text-xs" onClick={onBack}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button><div className="flex items-center gap-2">{!isNew && schedule.scheduleStatus === "Pending" && <Button variant="outline" className="h-8 text-xs" onClick={() => onLifecycle("Active")}>Activate Schedule</Button>}{!isNew && (schedule.scheduleStatus === "Pending" || schedule.scheduleStatus === "Active") && <Button variant="destructive" className="h-8 text-xs" onClick={() => onLifecycle("Cancelled")}>Cancel Schedule</Button>}<Button className="h-8 text-xs" disabled={readOnly} onClick={onSave}>Save</Button></div></div>
  </section>;
};

const HistoryTable = ({ schedule }: { schedule: ManagedSchedule }) => <div className="overflow-hidden border bg-card"><Table className="text-[11px]"><TableHeader><TableRow><TableHead className="h-7 text-[10px]">Due Date</TableHead><TableHead className="h-7 text-[10px]">Completed Date</TableHead><TableHead className="h-7 text-[10px]">Completed By</TableHead><TableHead className="h-7 text-[10px]">Standards Checked</TableHead><TableHead className="h-7 text-[10px]">Result</TableHead><TableHead className="h-7 text-[10px]">Doc / Tool</TableHead><TableHead className="h-7 text-[10px]">Comments</TableHead></TableRow></TableHeader><TableBody>{schedule.histories.length ? schedule.histories.map((history) => <TableRow key={history.id}><TableCell className="py-1.5">{history.dueDate}</TableCell><TableCell className="py-1.5">{history.completedDate}</TableCell><TableCell className="py-1.5">{history.completedBy}</TableCell><TableCell className="py-1.5">{history.standardsChecked}</TableCell><TableCell className="py-1.5">{history.result}</TableCell><TableCell className="py-1.5 text-info">{history.documentTool}</TableCell><TableCell className="py-1.5">{history.comments}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="h-12 text-center text-muted-foreground">No schedule history to display.</TableCell></TableRow>}</TableBody></Table></div>;
const CompactField = ({ label, children }: { label: string; children: React.ReactNode }) => <div className="space-y-1"><Label className="text-[11px] font-medium text-foreground/80">{label}</Label>{children}</div>;
const BandTitle = ({ label }: { label: string }) => <div className="flex items-center gap-2"><span className="h-3 w-1 bg-info" /><h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</h3></div>;
const Audit = ({ label, value }: { label: string; value: string }) => <div><p className="text-[10px] uppercase text-muted-foreground">{label}</p><p className="text-[11px] font-medium">{value}</p></div>;

export default ManagePmSchedules;