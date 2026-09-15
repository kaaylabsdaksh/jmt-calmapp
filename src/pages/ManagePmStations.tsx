import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkOrderItemComments } from "@/components/WorkOrderItemComments";
import { ArrowLeft, Building2, ChevronDown, ChevronRight, FileText, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { LAB_CODES, LOCATIONS, STANDARDS, StandardRecord } from "@/lib/standards/data";
import { PM_SCHEDULES, PM_STATIONS } from "@/lib/standards/pm-interim-checks";


type StationType = "Process" | "Station";

interface StationRecord {
  id: string;
  type: StationType;
  account: string;
  location: string;
  division: string;
  number: string;
  name: string;
  description: string;
  labCodes: string[];
  standardNumbers: string[];
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

type StationFilters = {
  type: string;
  location: string;
  division: string;
  description: string;
  name: string;
  account: string;
  labCode: string;
  standardNo: string;
};

const EMPTY_FILTERS: StationFilters = { type: "all", location: "all", division: "all", description: "", name: "", account: "", labCode: "all", standardNo: "" };
const DIVISIONS = ["Regular", "OnSite", "ESL"];
const PAGE_SIZE = 10;
const CONTROL = "h-7 text-[11px]";
const FIELD_LABEL = "text-[11px] font-medium text-foreground/80";

const buildSeedStations = (): StationRecord[] => PM_STATIONS.slice(0, 18).map((name, index) => {
  const schedule = PM_SCHEDULES.find((row) => row.station === name) ?? PM_SCHEDULES[index % PM_SCHEDULES.length];
  const standardNumbers = schedule?.standards ?? [];
  return {
    id: `station-${index + 1}`,
    type: index % 5 === 4 ? "Station" : "Process",
    account: schedule?.account ?? "0152.00",
    location: schedule?.location ?? LOCATIONS[index % LOCATIONS.length],
    division: schedule?.division === "Lab" ? "Regular" : schedule?.division ?? "OnSite",
    number: String(2144 + index * 37),
    name,
    description: schedule?.templateDescription ?? "Interim Check",
    labCodes: schedule?.labCodes.split(" ").filter(Boolean) ?? [],
    standardNumbers,
    createdBy: "Admin User",
    createdDate: "09/15/2026 03:53 AM",
    modifiedBy: index % 3 === 0 ? "Admin User" : "",
    modifiedDate: index % 3 === 0 ? "09/15/2026 03:53 AM" : "",
  };
});

const emptyStation = (): StationRecord => ({
  id: `station-${Date.now()}`,
  type: "Station",
  account: "",
  location: LOCATIONS[0] ?? "",
  division: "Regular",
  number: "",
  name: "",
  description: "",
  labCodes: [],
  standardNumbers: [],
  createdBy: "Admin User",
  createdDate: "",
  modifiedBy: "",
  modifiedDate: "",
});

const resolveStandard = (standardNo: string): StandardRecord | undefined => STANDARDS.find((standard) => standard.standardNo === standardNo);

const ManagePmStations = () => {
  const [stations, setStations] = useState(buildSeedStations);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<StationRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { setExtraCrumbs } = useBreadcrumb();
  const navigate = useNavigate();

  useEffect(() => {
    if (editing && !isNew) {
      setExtraCrumbs([{ label: editing.name }]);
    } else {
      setExtraCrumbs([]);
    }
    return () => setExtraCrumbs([]);
  }, [editing, isNew, setExtraCrumbs]);

  const filtered = useMemo(() => stations.filter((station) => {
    if (filters.type !== "all" && station.type !== filters.type) return false;
    if (filters.location !== "all" && station.location !== filters.location) return false;
    if (filters.division !== "all" && station.division !== filters.division) return false;
    if (filters.description && !station.description.toLowerCase().includes(filters.description.toLowerCase())) return false;
    if (filters.name && !station.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    if (filters.account && !station.account.includes(filters.account)) return false;
    if (filters.labCode !== "all" && !station.labCodes.includes(filters.labCode)) return false;
    if (filters.standardNo && !station.standardNumbers.some((value) => value.includes(filters.standardNo))) return false;
    return true;
  }), [filters, stations]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const updateFilter = (key: keyof StationFilters, value: string) => setDraftFilters((current) => ({ ...current, [key]: value }));
  const updateEditing = <K extends keyof StationRecord>(key: K, value: StationRecord[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const toggleExpanded = (id: string) => setExpanded((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });

  const saveStation = () => {
    if (!editing || !editing.account.trim() || !editing.name.trim() || !editing.number.trim()) {
      toast({ title: "Complete required fields", description: "Account #, Number, and Name are required.", variant: "destructive" });
      return;
    }
    const now = "09/15/2026 04:25 AM";
    const saved = { ...editing, createdDate: editing.createdDate || now, modifiedBy: "Admin User", modifiedDate: now };
    setStations((current) => isNew ? [saved, ...current] : current.map((station) => station.id === saved.id ? saved : station));
    toast({ title: isNew ? "Station added" : "Station updated", description: `${saved.name} was saved.` });
    setEditing(null);
    setIsNew(false);
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-background">
      <ModernTopNav />
      <main className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:px-4 lg:px-6">
        <section className="flex shrink-0 flex-col gap-4">
          <div className="hidden flex items-center gap-2 border bg-card px-5 py-4">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <h2 className="text-sm font-semibold">{editing ? `${isNew ? "Add New" : "Edit"} PM / Interim Check Station` : "Manage PM / Interim Check Stations"}</h2>
              <p className="text-[11px] text-muted-foreground">{editing ? "Maintain station details, lab codes, linked standards, schedules, and comments." : "Search stations, review linked standards, or add and edit station records."}</p>
            </div>
          </div>
        {editing ? (
          <StationEditor station={editing} isNew={isNew} onChange={updateEditing} onBack={() => { setEditing(null); setIsNew(false); }} onSave={saveStation} />
        ) : (
          <div className="flex flex-col gap-4">
            <section className="shrink-0 border bg-card px-5 py-4">
              <div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search Criteria</h3><Button size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => { setEditing(emptyStation()); setIsNew(true); }}><Plus className="h-3.5 w-3.5" /> Add New</Button></div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <CompactField label="Type"><Select value={draftFilters.type} onValueChange={(value) => updateFilter("type", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="Process">Process</SelectItem><SelectItem value="Station">Station</SelectItem></SelectContent></Select></CompactField>
                <CompactField label="Location"><Select value={draftFilters.location} onValueChange={(value) => updateFilter("location", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All locations</SelectItem>{LOCATIONS.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></CompactField>
                <CompactField label="Division"><Select value={draftFilters.division} onValueChange={(value) => updateFilter("division", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All divisions</SelectItem>{DIVISIONS.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></CompactField>
                <CompactField label="Description"><Input className={CONTROL} value={draftFilters.description} onChange={(event) => updateFilter("description", event.target.value)} /></CompactField>
                <CompactField label="Name"><Input className={CONTROL} value={draftFilters.name} onChange={(event) => updateFilter("name", event.target.value)} /></CompactField>
                <CompactField label="Account #"><Input className={CONTROL} value={draftFilters.account} onChange={(event) => updateFilter("account", event.target.value)} /></CompactField>
                <CompactField label="Lab Code"><Select value={draftFilters.labCode} onValueChange={(value) => updateFilter("labCode", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All lab codes</SelectItem>{LAB_CODES.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></CompactField>
                <CompactField label="Standard #"><Input className={CONTROL} value={draftFilters.standardNo} onChange={(event) => updateFilter("standardNo", event.target.value)} /></CompactField>
              </div>
              <div className="mt-3 flex justify-end gap-2"><Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => { setDraftFilters(EMPTY_FILTERS); setFilters(EMPTY_FILTERS); setPage(1); }}><RotateCcw className="h-3.5 w-3.5" /> Clear</Button><Button size="sm" className="h-7 gap-1.5 bg-info text-info-foreground hover:bg-info/90 text-[11px]" onClick={() => { setFilters(draftFilters); setPage(1); }}><Search className="h-3.5 w-3.5" /> Search</Button></div>
            </section>

            <section className="flex shrink-0 flex-col border bg-card">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <div><h3 className="text-sm font-semibold">Station Results</h3><p className="text-[11px] text-muted-foreground">{filtered.length} records returned · Expand a row to review linked standards.</p></div>
              </div>
            <div className="overflow-x-auto">
              <Table className="min-w-[1040px] text-[11px]">
                <TableHeader><TableRow><TableHead className="sticky left-0 top-0 z-20 h-8 w-8 bg-muted/95" /><TableHead className="sticky left-8 top-0 z-20 h-8 min-w-[300px] bg-muted/95">Station</TableHead>{["Type", "Account #", "Location", "Division", "Lab Code(s)", "Description"].map((heading) => <TableHead key={heading} className="sticky top-0 z-10 h-8 bg-muted/95">{heading}</TableHead>)}</TableRow></TableHeader>
                <TableBody>{pageRows.length ? pageRows.map((station) => <Fragment key={station.id}><TableRow className="group cursor-pointer" onClick={() => toggleExpanded(station.id)}><TableCell className="sticky left-0 z-10 bg-card px-2 group-hover:bg-muted/50"><Button variant="ghost" size="icon" className="h-5 w-5" aria-label={`${expanded.has(station.id) ? "Collapse" : "Expand"} ${station.name}`}>{expanded.has(station.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</Button></TableCell><TableCell className="sticky left-8 z-10 bg-card px-2 font-medium group-hover:bg-muted/50"><Button variant="link" className="h-auto p-0 text-[11px] text-info" onClick={(event) => { event.stopPropagation(); setEditing({ ...station }); setIsNew(false); }}>{station.name}</Button></TableCell><TableCell>{station.type}</TableCell><TableCell>{station.account}</TableCell><TableCell>{station.location}</TableCell><TableCell>{station.division}</TableCell><TableCell>{station.labCodes.join(" ") || "—"}</TableCell><TableCell>{station.description || "—"}</TableCell></TableRow>{expanded.has(station.id) && <TableRow className="bg-muted/20"><TableCell colSpan={8} className="p-3"><LinkedStandardsTable standardNumbers={station.standardNumbers} /></TableCell></TableRow>}</Fragment>) : <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No stations match the selected criteria.</TableCell></TableRow>}</TableBody>
              </Table>
            </div>
            <div className="sticky bottom-0 z-30 flex items-center justify-between gap-2 border-t bg-card px-4 py-2 shadow-[0_-1px_3px_rgba(0,0,0,0.06)]"><Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => navigate(-1)}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button><div className="flex items-center gap-2"><p className="text-[11px] text-muted-foreground">{filtered.length} records returned</p><div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span className="text-[11px] text-muted-foreground">Page {page} of {pageCount}</span><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div></div>
            </section>
          </div>
        )}
        </section>
      </main>
    </div>
  );
}

export default ManagePmStations;

const CompactField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => <div className="space-y-1"><Label className={FIELD_LABEL}>{label}{required && <span className="ml-0.5 text-destructive">*</span>}</Label>{children}</div>;

const LinkedStandardsTable = ({ standardNumbers, onRemove }: { standardNumbers: string[]; onRemove?: (standardNo: string) => void }) => (
  <div className="overflow-hidden rounded-md border bg-card"><Table><TableHeader><TableRow><TableHead className="h-7 text-[10px]">Standard #</TableHead><TableHead className="h-7 text-[10px]">Manufacturer</TableHead><TableHead className="h-7 text-[10px]">Model</TableHead><TableHead className="h-7 text-[10px]">Description</TableHead>{onRemove && <TableHead className="h-7 w-20 text-right text-[10px]">Action</TableHead>}</TableRow></TableHeader><TableBody>{standardNumbers.length ? standardNumbers.map((standardNo) => { const standard = resolveStandard(standardNo); return <TableRow key={standardNo}><TableCell className="py-2 text-[11px] font-medium text-info">{standardNo}</TableCell><TableCell className="py-2 text-[11px]">{standard?.manufacturer ?? "—"}</TableCell><TableCell className="py-2 text-[11px]">{standard?.model ?? "—"}</TableCell><TableCell className="py-2 text-[11px]">{standard?.description ?? "Standard details unavailable"}</TableCell>{onRemove && <TableCell className="py-1 text-right"><Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" aria-label={`Remove standard ${standardNo}`} onClick={() => onRemove(standardNo)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>}</TableRow>; }) : <TableRow><TableCell colSpan={onRemove ? 5 : 4} className="h-12 text-center text-[11px] text-muted-foreground">No standards linked.</TableCell></TableRow>}</TableBody></Table></div>
);

const ScheduleInformationTable = ({ stationName }: { stationName: string }) => {
  const schedules = PM_SCHEDULES.filter((schedule) => schedule.station === stationName);
  return (
    <div className="overflow-auto border bg-card">
      <Table className="min-w-[1080px] text-[11px]">
        <TableHeader><TableRow><TableHead className="h-8 whitespace-nowrap">Schedule ID</TableHead><TableHead className="h-8 min-w-[180px]">Description</TableHead><TableHead className="h-8 whitespace-nowrap">Due Date</TableHead><TableHead className="h-8 min-w-[140px]">Standards Checked</TableHead><TableHead className="h-8">Status</TableHead><TableHead className="h-8">Type</TableHead><TableHead className="h-8">Frequency</TableHead><TableHead className="h-8 min-w-[260px]">Document / Tool</TableHead></TableRow></TableHeader>
        <TableBody>{schedules.length ? schedules.map((schedule) => (
          <Fragment key={schedule.id}>
            <TableRow>
              <TableCell className="py-2"><Button variant="link" className="h-auto p-0 text-[11px] text-info" onClick={() => toast({ title: `Schedule ${schedule.id}`, description: "Schedule details are available from Manage PM / Interim Checks." })}>{schedule.id}</Button></TableCell>
              <TableCell className="py-2">{schedule.templateDescription}</TableCell><TableCell className="py-2">{schedule.dueDate}</TableCell><TableCell className="py-2">{schedule.status === "Completed" ? schedule.standards.join(", ") : "—"}</TableCell><TableCell className="py-2"><span className="inline-flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${schedule.status === "Active" ? "bg-success" : "bg-muted-foreground"}`} />{schedule.status}</span></TableCell><TableCell className="py-2">{schedule.type}</TableCell><TableCell className="py-2">{schedule.frequency}</TableCell><TableCell className="py-2"><Button variant="link" className="h-auto justify-start gap-1 p-0 text-left text-[11px] text-info" onClick={() => toast({ title: schedule.documentTool, description: "Document preview is not available in mock data." })}><FileText className="h-3 w-3 shrink-0" />{schedule.documentTool}</Button></TableCell>
            </TableRow>
            {schedule.histories.map((history) => <TableRow key={history.id} className="bg-muted/20"><TableCell className="py-2 pl-6 text-muted-foreground">History</TableCell><TableCell className="py-2">{schedule.templateDescription}</TableCell><TableCell className="py-2">{history.dueDate}</TableCell><TableCell className="py-2">{history.standardsChecked || "—"}</TableCell><TableCell className="py-2">Completed</TableCell><TableCell className="py-2">{schedule.type}</TableCell><TableCell className="py-2">{schedule.frequency}</TableCell><TableCell className="py-2 text-muted-foreground">{history.documentTool}</TableCell></TableRow>)}
          </Fragment>
        )) : <TableRow><TableCell colSpan={8} className="h-20 text-center text-muted-foreground">No schedules are linked to this station.</TableCell></TableRow>}</TableBody>
      </Table>
    </div>
  );
};

const StationEditor = ({ station, isNew, onChange, onBack, onSave }: { station: StationRecord; isNew: boolean; onChange: <K extends keyof StationRecord>(key: K, value: StationRecord[K]) => void; onBack: () => void; onSave: () => void }) => {
  const [standardsEntry, setStandardsEntry] = useState("");
  const addStandards = () => {
    const values = standardsEntry.split(",").map((value) => value.trim()).filter(Boolean);
    if (!values.length) return;
    onChange("standardNumbers", [...new Set([...station.standardNumbers, ...values])]);
    setStandardsEntry("");
    toast({ title: "Standards added", description: values.join(", ") });
  };
  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="flex-1 pb-4">

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <section className="border bg-card px-5 py-4"><div className="mb-3 flex items-center gap-2"><span className="h-4 w-1 bg-info" /><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Station Details</h3></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <CompactField label="Type"><Select value={station.type} onValueChange={(value) => onChange("type", value as StationType)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Process">Process</SelectItem><SelectItem value="Station">Station</SelectItem></SelectContent></Select></CompactField>
          <CompactField label="Account #" required><Input className={CONTROL} value={station.account} onChange={(event) => onChange("account", event.target.value)} /></CompactField>
          <CompactField label="Location"><Select value={station.location} onValueChange={(value) => onChange("location", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent>{LOCATIONS.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></CompactField>
          <CompactField label="Division"><Select value={station.division} onValueChange={(value) => onChange("division", value)}><SelectTrigger className={CONTROL}><SelectValue /></SelectTrigger><SelectContent>{DIVISIONS.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></CompactField>
          <CompactField label="Number" required><Input className={CONTROL} value={station.number} onChange={(event) => onChange("number", event.target.value.replace(/\D/g, ""))} /></CompactField>
          <CompactField label="Name" required><Input className={CONTROL} value={station.name} onChange={(event) => onChange("name", event.target.value)} /></CompactField>
          <div className="sm:col-span-2 xl:col-span-3"><CompactField label="Description"><Input className={CONTROL} value={station.description} onChange={(event) => onChange("description", event.target.value)} /></CompactField></div>
        </div><div className="mt-4 grid gap-2 border-t pt-3 text-[11px] sm:grid-cols-2 xl:grid-cols-4"><p><span className="text-muted-foreground">Created by:</span> {station.createdBy}</p><p><span className="text-muted-foreground">Created date:</span> {station.createdDate || "On save"}</p><p><span className="text-muted-foreground">Modified by:</span> {station.modifiedBy || "—"}</p><p><span className="text-muted-foreground">Modified date:</span> {station.modifiedDate || "—"}</p></div></section>
        <section className="border bg-card px-5 py-4"><div className="mb-3 flex items-center gap-2"><span className="h-4 w-1 bg-success" /><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lab Codes</h3></div><div className="max-h-48 space-y-1 overflow-auto border p-2">{LAB_CODES.map((code) => <label key={code} className="flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-muted"><Checkbox checked={station.labCodes.includes(code)} onCheckedChange={(checked) => onChange("labCodes", checked ? [...station.labCodes, code] : station.labCodes.filter((value) => value !== code))} />{code} · {{ M: "Mechanical", E: "Electrical", P: "Pressure", T: "Temperature" }[code] ?? "Lab"}</label>)}</div></section>
      </div>
      <section className="mt-4 space-y-3 border bg-card px-5 py-4"><div className="flex items-center gap-2"><span className="h-4 w-1 bg-muted-foreground" /><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Standards</h3></div><div className="grid gap-2 lg:grid-cols-[220px_minmax(0,1fr)_auto]"><div className="text-[11px]"><p className="font-medium">Standards to Add</p><p className="text-muted-foreground">Separate multiple entries with commas.</p></div><Textarea className="min-h-12 resize-none text-xs" value={standardsEntry} onChange={(event) => setStandardsEntry(event.target.value)} placeholder="Example: 1.1, 1.2, 1.3" /><Button variant="outline" size="sm" className="h-8 self-start text-xs" onClick={addStandards}>Add</Button></div><LinkedStandardsTable standardNumbers={station.standardNumbers} onRemove={(standardNo) => onChange("standardNumbers", station.standardNumbers.filter((value) => value !== standardNo))} /></section>
      {!isNew && <><section className="mt-4 border bg-card px-5 py-4"><div className="mb-3 flex items-center gap-2"><span className="h-4 w-1 bg-info" /><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Schedule Information</h3></div><ScheduleInformationTable stationName={station.name} /></section><section className="mt-4 border bg-card px-5 py-4"><div className="mb-3 flex items-center gap-2"><span className="h-4 w-1 bg-muted-foreground" /><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Comments</h3></div><WorkOrderItemComments workOrderItemId={station.id} /></section></>}
    </div>
    <div className="sticky bottom-0 z-30 flex shrink-0 items-center justify-between gap-2 border-t bg-card px-5 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.06)]"><Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={onBack}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button><div className="flex items-center gap-2"><Button variant="outline" className="h-8 text-xs" onClick={onBack}>Cancel</Button><Button className="h-8 text-xs" onClick={onSave}>Save</Button></div></div>
  </div>;
};