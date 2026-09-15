import { Fragment, useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpDown,
  Building2,
  ChevronDown,
  ChevronRight,
  Download,
  ListChecks,
  RotateCcw,
  Search,
  Settings2,
} from "lucide-react";

import ModernTopNav from "@/components/modern/ModernTopNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LAB_CODES, LOCATIONS } from "@/lib/standards/data";
import { PM_SCHEDULES, PM_STATIONS, PM_TEMPLATES, PmSchedule, PmScheduleStatus } from "@/lib/standards/pm-interim-checks";

type SortKey = keyof Pick<PmSchedule, "id" | "dueDate" | "terminalDate" | "account" | "type" | "status" | "lastResult" | "frequency" | "division" | "labCodes" | "station">;
type ViewMode = "schedule" | "standard" | "station" | "template";
type ManagerKind = "schedules" | null;

const emptyFilters = {
  status: "Active",
  type: "all",
  standardNo: "",
  location: "all",
  division: "all",
  template: "",
  dateType: "due",
  dateFrom: undefined as Date | undefined,
  dateTo: undefined as Date | undefined,
  station: "all",
  frequency: "all",
  documentTool: "",
  labCode: "all",
  account: "",
  completedStatus: "all",
  completedUser: "all",
  includeHistory: false,
};

const DATE_TYPE_OPTIONS = [
  { value: "due", label: "Due Date" },
  { value: "terminal", label: "Terminal Date" },
  { value: "completed", label: "Completed Date" },
];

type FilterKey = keyof typeof emptyFilters;

// Fields that do not apply to a given "View by" grouping — cleared and locked when selected.
const DISABLED_FIELDS: Record<ViewMode, FilterKey[]> = {
  schedule: [],
  standard: ["station", "documentTool"],
  station: ["location", "division", "labCode"],
  template: ["location", "division", "labCode", "account"],
};


const FIELD = "h-7 min-h-0 rounded-md border-input bg-background px-2 py-0 text-[11px]";
const LABEL = "text-[11px] font-medium text-foreground/80";

const parseDate = (value: string) => {
  const [month, day, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
};
const inRange = (value: string, from?: Date, to?: Date) => {
  if (!value) return false;
  const date = parseDate(value).getTime();
  return (!from || date >= new Date(from).setHours(0, 0, 0, 0)) && (!to || date <= new Date(to).setHours(23, 59, 59, 999));
};
const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const StatusBadge = ({ status }: { status: PmScheduleStatus }) => (
  <Badge variant="outline" className={cn("rounded-full border-transparent px-2 py-0.5 text-[10px] font-medium", status === "Active" ? "bg-info/10 text-info" : "bg-success/10 text-success")}>
    <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full", status === "Active" ? "bg-info" : "bg-success")} />
    {status}
  </Badge>
);

const Truncated = ({ text, className }: { text: string; className?: string }) => (
  <Tooltip>
    <TooltipTrigger asChild><span className={cn("block max-w-[280px] truncate", className)}>{text || "—"}</span></TooltipTrigger>
    <TooltipContent className="max-w-sm text-xs">{text || "No value"}</TooltipContent>
  </Tooltip>
);

const PmInterimChecks = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);
  const [viewMode, setViewMode] = useState<ViewMode>("schedule");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "id", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [manager, setManager] = useState<ManagerKind>(null);

  const completedUsers = [...new Set(PM_SCHEDULES.map((row) => row.completedUser).filter(Boolean))];
  const filtered = useMemo(() => {
    const rows = PM_SCHEDULES.filter((row) => {
      if (filters.status !== "all" && row.status !== filters.status) return false;
      if (filters.type !== "all" && row.type !== filters.type) return false;
      if (filters.standardNo && !row.standards.some((value) => value.includes(filters.standardNo))) return false;
      if (filters.location !== "all" && row.location !== filters.location) return false;
      if (filters.division !== "all" && row.division !== filters.division) return false;
      if (filters.template && !row.templateDescription.toLowerCase().includes(filters.template.toLowerCase())) return false;
      if ((filters.dateFrom || filters.dateTo) && filters.dateType === "due" && !inRange(row.dueDate, filters.dateFrom, filters.dateTo)) return false;
      if ((filters.dateFrom || filters.dateTo) && filters.dateType === "terminal" && !inRange(row.terminalDate, filters.dateFrom, filters.dateTo)) return false;
      if (filters.station !== "all" && row.station !== filters.station) return false;
      if (filters.frequency !== "all" && row.frequency !== filters.frequency) return false;
      if (filters.documentTool && !row.documentTool.toLowerCase().includes(filters.documentTool.toLowerCase())) return false;
      if (filters.labCode !== "all" && row.labCodes !== filters.labCode) return false;
      if (filters.account && !row.account.includes(filters.account)) return false;
      if (filters.completedStatus !== "all" && row.lastResult !== filters.completedStatus) return false;
      if (filters.completedUser !== "all" && row.completedUser !== filters.completedUser) return false;
      if ((filters.dateFrom || filters.dateTo) && filters.dateType === "completed") {
        const matchesCurrent = row.histories.some((history) => inRange(history.completedDate, filters.dateFrom, filters.dateTo));
        if (!matchesCurrent) return false;
      }
      return true;
    });
    const direction = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true }) * direction);
  }, [filters, sort]);

  const activeFilters = Object.entries(filters).filter(([key, value]) => key !== "includeHistory" && value !== undefined && value !== "" && value !== "all" && value !== emptyFilters[key as keyof typeof emptyFilters]).length + (filters.includeHistory ? 1 : 0);
  const viewRows = useMemo(() => {
    if (viewMode === "schedule") return filtered;
    const groupValue = (row: PmSchedule) => viewMode === "station" ? row.station : viewMode === "template" ? row.templateDescription : row.standards[0] ?? "Unassigned";
    return [...filtered].sort((a, b) => groupValue(a).localeCompare(groupValue(b), undefined, { numeric: true }) || a.id.localeCompare(b.id, undefined, { numeric: true }));
  }, [filtered, viewMode]);
  const pageCount = Math.max(1, Math.ceil(viewRows.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = viewRows.slice(start, start + pageSize);

  const updateDraft = <K extends keyof typeof emptyFilters>(key: K, value: (typeof emptyFilters)[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const applyFilters = () => { setFilters(draft); setPage(1); };
  const clearFilters = () => { setDraft(emptyFilters); setFilters(emptyFilters); setPage(1); };
  const toggleSort = (key: SortKey) => setSort((current) => ({ key, dir: current.key === key && current.dir === "asc" ? "desc" : "asc" }));
  const toggleExpanded = (id: string) => setExpanded((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const changeViewMode = (value: ViewMode) => {
    setViewMode(value);
    setPage(1);
    setExpanded(new Set());
    const reset = DISABLED_FIELDS[value].reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = emptyFilters[key];
      return acc;
    }, {});
    setDraft((current) => {
      const next = { ...current, ...reset } as typeof emptyFilters;
      setFilters(next);
      return next;
    });
  };

  const isDisabled = (key: FilterKey) => DISABLED_FIELDS[viewMode].includes(key);
  const groupLabel = (row: PmSchedule) => viewMode === "station" ? row.station : viewMode === "template" ? row.templateDescription : viewMode === "standard" ? row.standards[0] ?? "Unassigned" : "";
  const exportRows = () => {
    const rows = [["Schedule #", "Due Date", "Terminal Date", "Account #", "Type", "Status", "Last Result", "Frequency", "Division", "Lab Code(s)", "Station", "Document/Tool", "Standards"], ...filtered.map((row) => [row.id, row.dueDate, row.terminalDate, row.account, row.type, row.status, row.lastResult, row.frequency, row.division, row.labCodes, row.station, row.documentTool, row.standards.join(", ")])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.map(csvCell).join(",")).join("\n")], { type: "text/csv" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `pm-interim-checks-${format(new Date(), "yyyy-MM-dd")}.csv`; anchor.click(); URL.revokeObjectURL(url);
    toast({ title: "Schedule results exported", description: `${filtered.length} records were included.` });
  };

  const SortHead = ({ column, children, className }: { column: SortKey; children: React.ReactNode; className?: string }) => (
    <TableHead className={cn("sticky top-0 z-10 h-8 whitespace-nowrap bg-muted/95 px-2 text-[10px] font-semibold", className)}>
      <button type="button" className="flex items-center gap-1" onClick={() => toggleSort(column)}>{children}<ArrowUpDown className="h-3 w-3 text-muted-foreground" /></button>
    </TableHead>
  );

  return (
    <TooltipProvider>
      <div className="flex h-dvh min-h-0 flex-col bg-background">
        <ModernTopNav />
        <main className="flex min-h-0 w-full flex-1 flex-col gap-4 px-3 py-4 sm:px-4 lg:px-6">
          <section className="border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <div><h2 className="text-sm font-semibold">Search Criteria</h2><p className="text-[11px] text-muted-foreground">Find active schedules or completed maintenance checks.</p></div>
                {activeFilters > 0 && <Badge variant="secondary" className="h-5 text-[10px]">{activeFilters} active</Badge>}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Select value={viewMode} onValueChange={(value) => changeViewMode(value as ViewMode)}><SelectTrigger className="h-7 w-[156px] text-[11px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="schedule">View by Schedule</SelectItem><SelectItem value="standard">View by Standard</SelectItem><SelectItem value="station">View by Station</SelectItem><SelectItem value="template">View by Template</SelectItem></SelectContent></Select>
                <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={exportRows}><Download className="h-3.5 w-3.5" /> Export</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-3">
              {/* Check Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 rounded-full bg-info" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Check Details</h3>
                </div>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <ColumnField label="Schedule Status">
                      <Select value={draft.status} onValueChange={(value) => updateDraft("status", value)}><SelectTrigger className={FIELD}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent></Select>
                    </ColumnField>
                    <ColumnField label="Schedule Type">
                      <Select value={draft.type} onValueChange={(value) => updateDraft("type", value)}><SelectTrigger className={FIELD}><SelectValue placeholder="All types" /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="IM">Interim Check</SelectItem><SelectItem value="PM">Preventive Maintenance</SelectItem></SelectContent></Select>
                    </ColumnField>
                  </div>
                  <ColumnField label="Standard #"><Input className={FIELD} value={draft.standardNo} onChange={(event) => updateDraft("standardNo", event.target.value)} /></ColumnField>
                  <ColumnField label="Template Description"><Input className={FIELD} value={draft.template} onChange={(event) => updateDraft("template", event.target.value)} /></ColumnField>
                  <ColumnField label="Document / Tool"><Input disabled={isDisabled("documentTool")} className={FIELD} value={draft.documentTool} onChange={(event) => updateDraft("documentTool", event.target.value)} /></ColumnField>
                </div>
              </div>
              {/* Entity & Lab */}
              <div className="space-y-3 lg:border-x lg:border-border lg:px-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 rounded-full bg-muted-foreground" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entity & Lab</h3>
                </div>
                <div className="space-y-2.5">
                  <ColumnField label="Location">
                    <Select disabled={isDisabled("location")} value={draft.location} onValueChange={(value) => updateDraft("location", value)}><SelectTrigger className={FIELD}><SelectValue placeholder="All locations" /></SelectTrigger><SelectContent><SelectItem value="all">All locations</SelectItem>{LOCATIONS.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                  </ColumnField>
                  <ColumnField label="Division">
                    <Select disabled={isDisabled("division")} value={draft.division} onValueChange={(value) => updateDraft("division", value)}><SelectTrigger className={FIELD}><SelectValue placeholder="All divisions" /></SelectTrigger><SelectContent><SelectItem value="all">All divisions</SelectItem>{["Lab", "OnSite", "ESL"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                  </ColumnField>
                  <ColumnField label="Station">
                    <Select disabled={isDisabled("station")} value={draft.station} onValueChange={(value) => updateDraft("station", value)}><SelectTrigger className={FIELD}><SelectValue placeholder="All stations" /></SelectTrigger><SelectContent><SelectItem value="all">All stations</SelectItem>{PM_STATIONS.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                  </ColumnField>
                  <div className="grid grid-cols-2 gap-3">
                    <ColumnField label="Lab Code">
                      <Select disabled={isDisabled("labCode")} value={draft.labCode} onValueChange={(value) => updateDraft("labCode", value)}><SelectTrigger className={FIELD}><SelectValue placeholder="All lab codes" /></SelectTrigger><SelectContent><SelectItem value="all">All lab codes</SelectItem>{LAB_CODES.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                    </ColumnField>
                    <ColumnField label="Account #">
                      <Input disabled={isDisabled("account")} className={FIELD} value={draft.account} onChange={(event) => updateDraft("account", event.target.value)} />
                    </ColumnField>
                  </div>
                  <ColumnField label="Frequency">
                    <Select value={draft.frequency} onValueChange={(value) => updateDraft("frequency", value)}><SelectTrigger className={FIELD}><SelectValue placeholder="All frequencies" /></SelectTrigger><SelectContent><SelectItem value="all">All frequencies</SelectItem><SelectItem value="D">Daily</SelectItem><SelectItem value="M">Monthly</SelectItem></SelectContent></Select>
                  </ColumnField>
                </div>
              </div>
              {/* Timeline & User */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 rounded-full bg-success" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timeline & User</h3>
                </div>
                <div className="space-y-2.5">
                  <ColumnField label="Date Range"><DateRangePicker dateFrom={draft.dateFrom} dateTo={draft.dateTo} onDateFromChange={(value) => updateDraft("dateFrom", value)} onDateToChange={(value) => updateDraft("dateTo", value)} dateType={draft.dateType} onDateTypeChange={(value) => updateDraft("dateType", value)} dateTypeOptions={DATE_TYPE_OPTIONS} triggerClassName="w-full" /></ColumnField>
                  <ColumnField label="Completed Status">
                    <Select value={draft.completedStatus} onValueChange={(value) => updateDraft("completedStatus", value)}><SelectTrigger className={FIELD}><SelectValue placeholder="All results" /></SelectTrigger><SelectContent><SelectItem value="all">All results</SelectItem><SelectItem value="Pass">Pass</SelectItem><SelectItem value="Not Performed">Not Performed</SelectItem></SelectContent></Select>
                  </ColumnField>
                  <ColumnField label="Completed User">
                    <Select value={draft.completedUser} onValueChange={(value) => updateDraft("completedUser", value)}><SelectTrigger className={FIELD}><SelectValue placeholder="All users" /></SelectTrigger><SelectContent><SelectItem value="all">All users</SelectItem>{completedUsers.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                  </ColumnField>
                  <label className="flex h-7 items-center gap-2 pt-3 text-[11px]"><Checkbox checked={draft.includeHistory} onCheckedChange={(checked) => updateDraft("includeHistory", checked === true)} /> Include history in search</label>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/30 px-4 py-2.5">
              <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={clearFilters}><RotateCcw className="h-3.5 w-3.5" /> Clear</Button>
              <Button size="sm" className="h-7 gap-1.5 bg-info text-info-foreground hover:bg-info/90 text-[11px]" onClick={applyFilters}><Search className="h-3.5 w-3.5" /> Search</Button>
            </div>
          </section>

          <section className="border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
              <div><h2 className="text-sm font-semibold">{{ schedule: "Schedule Results", standard: "Results by Standard", station: "Results by Station", template: "Results by Template" }[viewMode]}</h2><p className="text-[11px] text-muted-foreground">{filtered.length} records returned · Select a row to view check history.</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => navigate("/standards/manage-pm-interim-checks/stations")}><Building2 className="h-3.5 w-3.5" /> Manage Stations</Button>
                <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => navigate("/standards/manage-pm-interim-checks/templates")}><ListChecks className="h-3.5 w-3.5" /> Manage Templates</Button>
                <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => setManager("schedules")}><ListChecks className="h-3.5 w-3.5" /> Manage Schedules</Button>
              </div>
            </div>
            <div className="max-h-[54vh] overflow-auto">
              <Table className="min-w-[1320px] text-[11px]">
                <TableHeader><TableRow>
                  <TableHead className="sticky left-0 top-0 z-20 h-8 w-8 bg-muted/95 px-2" />
                  <SortHead column="id" className="left-8 z-20">Schedule #</SortHead><SortHead column="dueDate">Due Date</SortHead><SortHead column="terminalDate">Terminal Date</SortHead><SortHead column="account">Account #</SortHead><SortHead column="type">Type</SortHead><SortHead column="status">Status</SortHead><SortHead column="lastResult">Last Result</SortHead><SortHead column="frequency">Freq.</SortHead><SortHead column="division">Division</SortHead><SortHead column="labCodes">Lab Code(s)</SortHead><SortHead column="station">Station</SortHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95 px-2 text-[10px] font-semibold">Document / Tool</TableHead><TableHead className="sticky top-0 z-10 h-8 bg-muted/95 px-2 text-[10px] font-semibold">Standards</TableHead>
                </TableRow></TableHeader>
                <TableBody>{pageRows.map((row, rowIndex) => {
                  const histories = filters.includeHistory ? row.histories : row.histories.slice(0, 1);
                  const currentGroup = groupLabel(row);
                  const previousGroup = rowIndex > 0 ? groupLabel(pageRows[rowIndex - 1]) : "";
                  return <Fragment key={row.id}>
                    {viewMode !== "schedule" && currentGroup !== previousGroup && <TableRow className="bg-muted/40"><TableCell colSpan={14} className="h-8 px-3 py-1.5"><span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{viewMode}</span><span className="ml-2 text-xs font-semibold text-foreground">{currentGroup}</span></TableCell></TableRow>}
                    <TableRow className="group cursor-pointer" onClick={() => toggleExpanded(row.id)}>
                      <TableCell className="sticky left-0 z-10 bg-card px-2 group-hover:bg-muted/50"><Button variant="ghost" size="icon" className="h-5 w-5" aria-label={`${expanded.has(row.id) ? "Collapse" : "Expand"} schedule ${row.id}`}>{expanded.has(row.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</Button></TableCell>
                      <TableCell className="sticky left-8 z-10 bg-card px-2 font-semibold text-info group-hover:bg-muted/50">{row.id}</TableCell><TableCell className="px-2 tabular-nums">{row.dueDate}</TableCell><TableCell className="px-2 tabular-nums">{row.terminalDate}</TableCell><TableCell className="px-2">{row.account}</TableCell><TableCell className="px-2">{row.type}</TableCell><TableCell className="px-2"><StatusBadge status={row.status} /></TableCell><TableCell className="px-2">{row.lastResult || "—"}</TableCell><TableCell className="px-2">{row.frequency}</TableCell><TableCell className="px-2">{row.division}</TableCell><TableCell className="px-2">{row.labCodes}</TableCell><TableCell className="px-2"><Truncated text={row.station} /></TableCell><TableCell className="px-2 text-info"><Truncated text={row.documentTool} /></TableCell><TableCell className="px-2">{row.standards.join(", ")}</TableCell>
                    </TableRow>
                    {expanded.has(row.id) && <TableRow className="bg-muted/20"><TableCell colSpan={14} className="p-3"><div className="overflow-hidden rounded-md border bg-card"><div className="border-b px-3 py-2"><p className="text-[11px] font-semibold">Completion History</p></div><Table><TableHeader><TableRow><TableHead className="h-7 text-[10px]">Due Date</TableHead><TableHead className="h-7 text-[10px]">Completed Date</TableHead><TableHead className="h-7 text-[10px]">Completed By</TableHead><TableHead className="h-7 text-[10px]">Standards Checked</TableHead><TableHead className="h-7 text-[10px]">Result</TableHead><TableHead className="h-7 text-[10px]">Document / Tool</TableHead><TableHead className="h-7 text-[10px]">Comments</TableHead></TableRow></TableHeader><TableBody>{histories.length ? histories.map((history) => <TableRow key={history.id}><TableCell className="py-2 text-[11px]">{history.dueDate}</TableCell><TableCell className="py-2 text-[11px]">{history.completedDate}</TableCell><TableCell className="py-2 text-[11px]">{history.completedBy}</TableCell><TableCell className="py-2 text-[11px]">{history.standardsChecked}</TableCell><TableCell className="py-2 text-[11px]">{history.result}</TableCell><TableCell className="py-2 text-[11px] text-info">{history.documentTool}</TableCell><TableCell className="py-2 text-[11px]">{history.comments}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="h-12 text-center text-[11px] text-muted-foreground">No completion history to display.</TableCell></TableRow>}</TableBody></Table></div></TableCell></TableRow>}
                  </Fragment>;
                })}</TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-2 border-t px-3 py-2 sm:flex-row sm:items-center sm:justify-between"><Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11px]" onClick={() => navigate(-1)}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button><p className="text-xs text-muted-foreground">{filtered.length === 0 ? "No results" : `Showing ${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length} records`}</p><div className="flex items-center gap-2"><Label className="text-xs text-muted-foreground">Rows</Label><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-7 w-[70px] text-xs"><SelectValue /></SelectTrigger><SelectContent>{[10, 20, 50].map((value) => <SelectItem key={value} value={String(value)}>{value}</SelectItem>)}</SelectContent></Select><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span className="text-xs text-muted-foreground">Page {page} of {pageCount}</span><Button variant="outline" size="sm" className="h-7 text-[11px]" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
          </section>
        </main>
        <ManagerDialog key={manager ?? "closed"} kind={manager} onClose={() => setManager(null)} />
      </div>
    </TooltipProvider>
  );
};

const ColumnField = ({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <Label className={LABEL}>{label}</Label>
    {children}
  </div>
);


const ManagerDialog = ({ kind, onClose }: { kind: ManagerKind; onClose: () => void }) => {
  const title = "Manage Schedules";
  const seedItems = PM_SCHEDULES.slice(0, 8).map((row) => `#${row.id} · ${row.station}`);
  const [items, setItems] = useState(seedItems);
  const updateItem = (index: number, value: string) => setItems((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  return <Dialog open={kind !== null} onOpenChange={(open) => !open && onClose()}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle className="flex items-center gap-2 text-base"><ListChecks className="h-4 w-4" />{title}</DialogTitle><DialogDescription>Edit the mock records used by PM and interim-check schedules.</DialogDescription></DialogHeader><div className="max-h-[50vh] overflow-auto rounded-md border">{items.map((item, index) => <div key={`${kind}-${index}`} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b px-3 py-2 last:border-b-0"><div><Input aria-label={`${title} row ${index + 1}`} className="h-7 text-xs" value={item} onChange={(event) => updateItem(index, event.target.value)} /><p className="mt-1 text-[10px] text-muted-foreground">Active schedule</p></div><Button variant="ghost" size="sm" className="h-7 text-[11px] text-destructive" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button></div>)}</div><DialogFooter><Button variant="outline" className="h-8 text-xs" onClick={onClose}>Close</Button><Button variant="outline" className="h-8 text-xs" onClick={() => setItems((current) => [...current, "New schedule"])}>Add New</Button><Button className="h-8 text-xs" onClick={() => { toast({ title: `${title} saved`, description: `${items.length} mock records updated.` }); onClose(); }}>Save Changes</Button></DialogFooter></DialogContent></Dialog>;
};

export default PmInterimChecks;
