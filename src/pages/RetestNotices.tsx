import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  History,
  FileDown,
  Play,
  Eye,
  Download,
  MoreVertical,
  Mail,
  RotateCcw,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  FileText,
  Inbox,
  ChevronDown,
  ChevronUp,
  Ban,
  Users,
  UserRound,
  Briefcase,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";

type ProcessState = "idle" | "ready" | "processing" | "failed" | "done";

interface ReportRow {
  id: string;
  category: "Singles" | "ESL Groupables";
  location: string;
  reportName: string;
  notices: number;
  lastGenerated: string;
}

const REPORTS: ReportRow[] = [
  { id: "r1", category: "Singles", location: "ESL O/S BR", reportName: "RetestNotice.Loc.ESLOSBR.pdf", notices: 0, lastGenerated: "02/01/2026 06:12" },
  { id: "r2", category: "Singles", location: "Odessa", reportName: "RetestNotice.Loc.Odessa.pdf", notices: 2, lastGenerated: "02/01/2026 06:13" },
  { id: "r3", category: "Singles", location: "Baton Rouge", reportName: "RetestNotice.Loc.BatonRouge.pdf", notices: 8, lastGenerated: "02/01/2026 06:14" },
  { id: "r4", category: "Singles", location: "Houston", reportName: "RetestNotice.Loc.Houston.pdf", notices: 14, lastGenerated: "02/01/2026 06:15" },
  { id: "r5", category: "Singles", location: "Jackson", reportName: "RetestNotice.Loc.Jackson.pdf", notices: 1, lastGenerated: "02/01/2026 06:16" },
  { id: "g1", category: "ESL Groupables", location: "ESL Gulf Coast", reportName: "RetestNotice.Grp.ESLGulfCoast.pdf", notices: 26, lastGenerated: "02/01/2026 06:21" },
  { id: "g2", category: "ESL Groupables", location: "ESL Midwest", reportName: "RetestNotice.Grp.ESLMidwest.pdf", notices: 9, lastGenerated: "02/01/2026 06:22" },
  { id: "g3", category: "ESL Groupables", location: "ESL Southeast", reportName: "RetestNotice.Grp.ESLSoutheast.pdf", notices: 0, lastGenerated: "02/01/2026 06:23" },
];

interface EmailRow {
  id: string;
  type: "Customer Email" | "Contact Email" | "Salesperson Email";
  report: string;
  recipients: number;
  status: "Ready" | "Sent" | "Failed" | "Pending";
  icon: typeof Users;
}

const EMAILS: EmailRow[] = [
  { id: "e1", type: "Customer Email", report: "RetestNotice.Customers.Feb2026.pdf", recipients: 184, status: "Sent", icon: Users },
  { id: "e2", type: "Contact Email", report: "RetestNotice.Contacts.Feb2026.pdf", recipients: 152, status: "Ready", icon: UserRound },
  { id: "e3", type: "Salesperson Email", report: "RetestNotice.Sales.Feb2026.pdf", recipients: 12, status: "Pending", icon: Briefcase },
];

interface HistoryRow {
  id: string;
  runDate: string;
  month: string;
  year: string;
  generatedBy: string;
  totalReports: number;
  totalEmails: number;
  duration: string;
  status: "Completed" | "Failed" | "Partial";
}

const HISTORY: HistoryRow[] = [
  { id: "h1", runDate: "02/01/2026 06:10", month: "February", year: "2026", generatedBy: "M. Alvarez", totalReports: 12, totalEmails: 348, duration: "4m 22s", status: "Completed" },
  { id: "h2", runDate: "01/01/2026 06:08", month: "January", year: "2026", generatedBy: "M. Alvarez", totalReports: 12, totalEmails: 331, duration: "4m 05s", status: "Completed" },
  { id: "h3", runDate: "12/01/2025 06:11", month: "December", year: "2025", generatedBy: "S. Patel", totalReports: 11, totalEmails: 190, duration: "2m 51s", status: "Partial" },
  { id: "h4", runDate: "11/01/2025 06:09", month: "November", year: "2025", generatedBy: "S. Patel", totalReports: 0, totalEmails: 0, duration: "0m 34s", status: "Failed" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARS = ["2024", "2025", "2026"];

const NoticeBadge = ({ count }: { count: number }) => {
  const tone =
    count === 0
      ? "bg-muted text-muted-foreground border-border"
      : count < 5
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  const dot = count === 0 ? "bg-muted-foreground" : count < 5 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <Badge variant="outline" className={`${tone} h-5 px-2 gap-1.5 text-[10px] font-semibold rounded-full hover:bg-transparent`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {count} {count === 1 ? "Notice" : "Notices"}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Sent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Ready: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Partial: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Failed: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  const dot: Record<string, string> = {
    Sent: "bg-emerald-500", Completed: "bg-emerald-500", Ready: "bg-blue-500",
    Pending: "bg-amber-500", Partial: "bg-amber-500", Failed: "bg-rose-500",
  };
  return (
    <Badge variant="outline" className={`${map[status]} h-5 px-2 gap-1.5 text-[10px] font-semibold rounded-full hover:bg-transparent`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {status}
    </Badge>
  );
};

const SectionHeader = ({ icon: Icon, title, tone, right }: { icon: typeof FileText; title: string; tone: string; right?: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
    <div className={`h-6 w-6 rounded-md flex items-center justify-center ring-1 ${tone}`}>
      <Icon className="h-3 w-3" />
    </div>
    <div className="text-[11px] font-semibold text-foreground uppercase tracking-wide">{title}</div>
    <div className="ml-auto flex items-center gap-2">{right}</div>
  </div>
);

const RetestNotices = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [month, setMonth] = useState("February");
  const [year, setYear] = useState("2026");
  const [state, setState] = useState<ProcessState>("idle");
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Singles: true,
    "ESL Groupables": true,
    History: true,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return REPORTS.filter((r) => {
      if (locationFilter && r.location !== locationFilter) return false;
      if (statusFilter === "with" && r.notices === 0) return false;
      if (statusFilter === "empty" && r.notices > 0) return false;
      if (!q) return true;
      return (
        r.reportName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [search, statusFilter, locationFilter]);

  const groups: ReportRow["category"][] = ["Singles", "ESL Groupables"];
  const processing = state === "processing";

  const runGeneration = () => {
    setState("processing");
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setState("done");
          toast({ title: "Reports Generated", description: `${month} ${year} retest notices are ready.` });
          return 100;
        }
        return p + 4;
      });
    }, 120);
  };

  const banner = () => {
    if (processing || state === "idle") return null;
    if (state === "failed")
      return {
        cls: "border-rose-500/30 bg-rose-500/5",
        dot: "bg-rose-500",
        icon: AlertTriangle,
        iconCls: "text-rose-600 dark:text-rose-400",
        title: "Processing stopped unexpectedly.",
        desc: "The run failed while generating Houston reports. You can resume from the last completed step.",
      };
    if (state === "done")
      return {
        cls: "border-emerald-500/30 bg-emerald-500/5",
        dot: "bg-emerald-500",
        icon: CheckCircle2,
        iconCls: "text-emerald-600 dark:text-emerald-400",
        title: `${month} ${year} has already been processed.`,
        desc: "12 reports created · 348 notices generated · 336 emails sent · 12 pending.",
      };
    return {
      cls: "border-amber-500/30 bg-amber-500/5",
      dot: "bg-amber-500",
      icon: Clock,
      iconCls: "text-amber-600 dark:text-amber-400",
      title: "Ready to generate notices.",
      desc: `No run recorded for ${month} ${year}.`,
    };
  };
  const b = banner();

  const summary = [
    { label: "Emails Ready", value: 152, icon: Inbox, tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20", bar: "from-blue-500 to-indigo-500" },
    { label: "Emails Sent", value: 336, icon: Send, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20", bar: "from-emerald-500 to-green-500" },
    { label: "Failed", value: 4, icon: AlertTriangle, tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20", bar: "from-rose-500 to-orange-500" },
    { label: "Pending", value: 12, icon: Clock, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20", bar: "from-amber-500 to-orange-500" },
  ];

  const timeline = [
    { label: "Processing Started", time: "06:10 AM", done: true },
    { label: "Reports Generated", time: "06:14 AM", done: true },
    { label: "Emails Prepared", time: "06:16 AM", done: true },
    { label: "Emails Sent", time: "06:18 AM", done: state === "done" },
    { label: "Completed", time: state === "done" ? "06:19 AM" : "—", done: state === "done" },
  ];

  const notify = (title: string, description?: string) => toast({ title, description });

  return (
    <div className="bg-background min-h-full pb-20">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-4">



          {/* Processing controls */}
          <Card className="overflow-hidden">
            <SectionHeader icon={ListChecks} title="Processing Controls" tone="bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20" />
            <CardContent className="p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="space-y-1 w-36">
                      <div className="text-[11px] font-medium text-muted-foreground">Month</div>
                      <Select value={month} onValueChange={setMonth} disabled={processing}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1 w-28">
                      <div className="text-[11px] font-medium text-muted-foreground">Year</div>
                      <Select value={year} onValueChange={setYear} disabled={processing}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    {[
                      { label: "Total Notices", value: "348" },
                      { label: "Processing Time", value: "4m 22s" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className="text-[10px] text-muted-foreground">{s.label}:</span>
                        <span className="text-[10px] font-semibold text-foreground">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-end gap-2 ml-auto mt-[20px]">
                  <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" disabled={processing} onClick={runGeneration}>
                    <Play className="h-3.5 w-3.5 mr-1.5" />Generate Retest Notices
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    disabled={processing || state === "idle"}
                    onClick={() => notify("Emails Queued", `All ${month} ${year} retest notices have been emailed.`)}
                  >
                    <Mail className="h-3.5 w-3.5 mr-1.5" />Email All
                  </Button>
                </div>
              </div>


            </CardContent>
          </Card>

          {/* Status banner / progress */}
          {processing ? (
            <Card className="overflow-hidden border-blue-500/30 bg-blue-500/5">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                    <div className="text-xs font-semibold text-foreground truncate">Generating Retest Notices</div>
                  </div>
                  <div className="text-xs font-semibold text-foreground shrink-0">{Math.min(progress, 100)}%</div>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  <span>Current step: Generating Odessa Reports</span>
                  <span>Estimated time remaining: 1 min 12 sec</span>
                </div>
              </CardContent>
            </Card>
          ) : b ? (
            <Card className={`overflow-hidden border ${b.cls}`}>
              <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <b.icon className={`h-4 w-4 mt-0.5 shrink-0 ${b.iconCls}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground">{b.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{b.desc}</div>
                  </div>
                </div>
                {state === "failed" ? (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={runGeneration}>
                      <Play className="h-3.5 w-3.5 mr-1.5" />Resume
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={runGeneration}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Retry
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => notify("Log downloaded")}>
                      <Download className="h-3.5 w-3.5 mr-1.5" />Download Log
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => notify("Error details", "Timeout on report worker #3.")}>
                      View Error Details
                    </Button>
                  </div>
                ) : state === "done" ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs shrink-0" onClick={() => notify("Viewing reports")}>
                    <FileText className="h-3.5 w-3.5 mr-1.5" />View Reports
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ) : null}




          {/* Report sections */}
          {state === "idle" ? null : filtered.length === 0 ? (
            <Card>
              <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-3">
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">No reports generated yet.</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Generate retest notices for {month} {year} to see reports here.</div>
                </div>
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={runGeneration}>
                  <Play className="h-3.5 w-3.5 mr-1.5" />Generate Retest Notices
                </Button>
              </CardContent>
            </Card>
          ) : (
            groups.map((group) => {
              const rows = filtered.filter((r) => r.category === group);
              if (rows.length === 0) return null;
              const open = openSections[group];
              return (
                <Card key={group} className="overflow-hidden">
                  <Collapsible open={open} onOpenChange={(v) => setOpenSections((s) => ({ ...s, [group]: v }))}>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-border bg-muted/40">
                      <div className="h-5 w-5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20 flex items-center justify-center">
                        <FileText className="h-3 w-3" />
                      </div>
                      <div className="text-[10px] font-semibold text-foreground uppercase tracking-wide">{group}</div>
                      <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-medium">{rows.length} reports</Badge>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent [&>th]:h-7 [&>th]:py-0">
                                
                                <TableHead className="text-[10px]">Location</TableHead>
                                <TableHead className="text-[10px]">Report Name</TableHead>
                                <TableHead className="text-[10px]">Notice Count</TableHead>
                                
                                <TableHead className="text-[10px] text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {rows.map((r) => (
                                <TableRow key={r.id} className="[&>td]:py-1">
                                  
                                  <TableCell className="text-[11px] font-medium text-foreground">{r.location}</TableCell>
                                  <TableCell className="text-[11px] font-mono text-foreground">{r.reportName}</TableCell>
                                  <TableCell><NoticeBadge count={r.notices} /></TableCell>
                                  
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end">
                                      <Button variant="ghost" size="sm" className="h-6 text-[11px] px-1.5" onClick={() => notify("Emails Sent", r.reportName)}>
                                        <Mail className="h-3 w-3 mr-1" />Email Rpt
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })
          )}







          {/* Processing history */}
          {state !== "idle" && (
          <>

          <Card className="overflow-hidden">
            <Collapsible
              open={openSections["History"]}
              onOpenChange={(v) => setOpenSections((s) => ({ ...s, History: v }))}
            >
              <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-border bg-muted/40">
                <div className="h-5 w-5 rounded-md bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-1 ring-slate-500/20 flex items-center justify-center">
                  <History className="h-2.5 w-2.5" />
                </div>
                <div className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Processing History</div>
                <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-medium">{HISTORY.length} runs</Badge>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                    {openSections["History"] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                </CollapsibleTrigger>

              </div>
              <CollapsibleContent>
            <CardContent className="p-0">

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent [&>th]:h-7 [&>th]:py-0">
                      {["Run Date", "Month", "Year", "Generated By", "Total Reports", "Total Emails", "Duration", "Status"].map((h) => (
                        <TableHead key={h} className="text-[10px]">{h}</TableHead>
                      ))}
                      <TableHead className="text-[10px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {HISTORY.map((h) => (
                      <TableRow key={h.id} className="[&>td]:py-1">
                        <TableCell className="text-[11px] font-medium text-foreground">{h.runDate}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">{h.month}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">{h.year}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">{h.generatedBy}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">{h.totalReports}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">{h.totalEmails}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">{h.duration}</TableCell>
                        <TableCell><StatusBadge status={h.status} /></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Run details", `${h.month} ${h.year}`)}>
                                <Eye className="h-3.5 w-3.5 mr-2" />View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Download started", "Run log")}>
                                <Download className="h-3.5 w-3.5 mr-2" />Download Log
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Regenerating", `${h.month} ${h.year}`)}>
                                <RotateCcw className="h-3.5 w-3.5 mr-2" />Regenerate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          </>
          )}

        </div>
      </main>

    </div>
  );
};

export default RetestNotices;
