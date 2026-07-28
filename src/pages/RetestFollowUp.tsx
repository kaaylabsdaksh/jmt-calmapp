import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  X,
  ArrowLeft,
  FileDown,
  FileText,
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  History,
  Download,
  UserRound,
  Inbox,
  Users,
  Send,
  Clock,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";

type EmailStatus = "sent" | "pending" | "failed" | "completed" | "not-required";
type CallStatus = "completed" | "pending" | "not-required";

type FollowUpRecord = {
  id: string;
  account: string;
  state: string;
  ic: string;
  customer: string;
  contact: string;
  email: string;
  phone: string;
  totalNotices: number;
  firstEmail: EmailStatus;
  firstEmailDate: string;
  rf1: number;
  secondEmail: EmailStatus;
  secondEmailDate: string;
  rf2: number;
  phoneCall: CallStatus;
  phoneCallDate: string;
  rf3: number;
  remaining: number;
  equipment: { item: string; due: string }[];
  notes: string;
};

const STATES = ["TX", "OK", "LA", "NM", "AR", "KS"];
const ICS = ["JMT", "CAL", "ESL", "TST"];

const CUSTOMERS = [
  "Lone Star Electric Co-op",
  "Permian Power Services",
  "Gulf Coast Utilities",
  "Red River Energy",
  "Sooner Line Construction",
  "Bayou Transmission LLC",
  "Panhandle Electric",
  "Midland Utility Group",
  "Cimarron Grid Partners",
  "Trinity Power Systems",
  "Sabine Valley Electric",
  "Frontier Line Services",
];

const CONTACTS = [
  "M. Alvarez",
  "D. Whitfield",
  "K. Nguyen",
  "R. Castillo",
  "P. Okafor",
  "S. Brennan",
  "T. Ramirez",
  "L. Chandler",
];

const EMAIL_CYCLE: EmailStatus[] = ["sent", "pending", "failed", "completed", "not-required"];
const CALL_CYCLE: CallStatus[] = ["completed", "pending", "not-required"];

const MOCK_RECORDS: FollowUpRecord[] = Array.from({ length: 24 }, (_, i) => {
  const totalNotices = 4 + ((i * 7) % 24);
  const rf1 = Math.max(0, totalNotices - ((i * 3) % 9));
  const rf2 = Math.max(0, rf1 - ((i * 2) % 6));
  const rf3 = Math.max(0, rf2 - (i % 5));
  const customer = CUSTOMERS[i % CUSTOMERS.length];
  return {
    id: `fu-${i + 1}`,
    account: `1${String(2400 + i * 13).padStart(4, "0")}`,
    state: STATES[i % STATES.length],
    ic: ICS[i % ICS.length],
    customer,
    contact: CONTACTS[i % CONTACTS.length],
    email: `${CONTACTS[i % CONTACTS.length].split(". ")[1].toLowerCase()}@${customer
      .split(" ")[0]
      .toLowerCase()}.com`,
    phone: `(9${(i % 9) + 1}0) 555-0${String(100 + i).slice(-3)}`,
    totalNotices,
    firstEmail: EMAIL_CYCLE[i % 5],
    firstEmailDate: `02/0${(i % 8) + 1}/2026`,
    rf1,
    secondEmail: EMAIL_CYCLE[(i + 2) % 5],
    secondEmailDate: i % 3 === 0 ? "—" : `02/1${(i % 9)}/2026`,
    rf2,
    phoneCall: CALL_CYCLE[i % 3],
    phoneCallDate: i % 3 === 2 ? "—" : `02/2${(i % 8)}/2026`,
    rf3,
    remaining: i % 4 === 0 ? 0 : rf3,
    equipment: [
      { item: "Class 2 Gloves", due: "03/15/2026" },
      { item: "Line Hose Set", due: "04/02/2026" },
      { item: "Insulating Blanket", due: "04/22/2026" },
    ].slice(0, (i % 3) + 1),
    notes:
      i % 2 === 0
        ? "Customer requested follow-up after quarterly outage window."
        : "Left voicemail with safety coordinator; awaiting callback.",
  };
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const YEARS = ["2024", "2025", "2026"];

const emailChip = (status: EmailStatus) => {
  const map: Record<EmailStatus, { label: string; cls: string; dot: string }> = {
    sent: { label: "Sent", cls: "bg-success/10 text-success", dot: "bg-success" },
    completed: { label: "Completed", cls: "bg-success/10 text-success", dot: "bg-success" },
    pending: { label: "Pending", cls: "bg-warning/10 text-warning", dot: "bg-warning" },
    failed: { label: "Failed", cls: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
    "not-required": { label: "Not Required", cls: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const callChip = (status: CallStatus) => {
  const map: Record<CallStatus, { label: string; cls: string; dot: string }> = {
    completed: { label: "Completed", cls: "bg-success/10 text-success", dot: "bg-success" },
    pending: { label: "Pending", cls: "bg-warning/10 text-warning", dot: "bg-warning" },
    "not-required": { label: "Not Required", cls: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const remainingChip = (n: number) => {
  const cls =
    n === 0
      ? "bg-success/10 text-success"
      : n <= 5
      ? "bg-warning/10 text-warning"
      : "bg-destructive/10 text-destructive";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {n} Remaining
    </span>
  );
};

const RetestFollowUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [month, setMonth] = useState("February");
  const [year, setYear] = useState("2026");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerRecord, setDrawerRecord] = useState<FollowUpRecord | null>(null);
  const [sortKey, setSortKey] = useState<"customer" | "remaining" | "totalNotices">("customer");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = MOCK_RECORDS.filter((r) =>
      !q
        ? true
        : [r.customer, r.account, r.contact, r.state, r.email, r.phone]
            .join(" ")
            .toLowerCase()
            .includes(q)
    );
    return [...filtered].sort((a, b) =>
      sortKey === "customer"
        ? a.customer.localeCompare(b.customer)
        : (b[sortKey] as number) - (a[sortKey] as number)
    );
  }, [query, sortKey]);

  const kpis = useMemo(() => {
    const totalCustomers = rows.length;
    const firstSent = rows.filter((r) => r.firstEmail === "sent" || r.firstEmail === "completed").length;
    const secondSent = rows.filter((r) => r.secondEmail === "sent" || r.secondEmail === "completed").length;
    const callsPending = rows.filter((r) => r.phoneCall === "pending").length;
    const outstanding = rows.reduce((s, r) => s + r.remaining, 0);
    const pending = rows.filter((r) => r.remaining > 0).length;
    return [
      { label: "Total Customers", value: totalCustomers, icon: Users },
      { label: "Pending Follow-ups", value: pending, icon: Clock },
      { label: "First Emails Sent", value: firstSent, icon: Mail },
      { label: "Second Emails Sent", value: secondSent, icon: Send },
      { label: "Phone Calls Pending", value: callsPending, icon: Phone },
      { label: "Outstanding Notices", value: outstanding, icon: ListChecks },
    ];
  }, [rows]);

  const allSelected = rows.length > 0 && selected.length === rows.length;

  const runSearch = () => {
    setLoading(true);
    setSelected([]);
    window.setTimeout(() => {
      setLoading(false);
      toast({ title: "Refresh Complete", description: `Showing follow-ups for ${month} ${year}.` });
    }, 700);
  };

  const notify = (title: string, description?: string) => toast({ title, description });

  return (
    <div className="min-h-screen bg-background">
      <ModernTopNav />

      <div className="px-3 sm:px-4 lg:px-6 py-4 pb-24 space-y-3">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Retest Notice Follow-up</h2>
            <p className="text-xs text-muted-foreground">
              Track customer communication, monitor follow-up progress and manage outstanding retest notices.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => notify("Export Complete", "Summary report downloaded.")}
            >
              <FileDown className="h-3.5 w-3.5 mr-1.5" />Export Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => notify("Export Complete", "Detailed report downloaded.")}
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />Export Details
            </Button>
          </div>
        </div>

        {/* Search & filters */}
        <Card className="shadow-sm">
          <CardContent className="p-2.5">
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Month</label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="h-7 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Year</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-7 w-[90px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 flex-1 min-w-[200px]">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Customer, account #, contact, state, email or phone"
                    className="h-7 pl-7 text-xs"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Button size="sm" className="h-7 text-xs" onClick={runSearch}>
                  <Search className="h-3.5 w-3.5 mr-1.5" />Search
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={runSearch}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Refresh Counts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => { setQuery(""); setSelected([]); }}
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="shadow-sm"><CardContent className="p-2.5"><Skeleton className="h-8 w-full" /></CardContent></Card>
              ))
            : kpis.map((k) => (
                <Card key={k.label} className="shadow-sm">
                  <CardContent className="p-2.5 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <k.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground truncate">{k.label}</p>
                      <p className="text-sm font-semibold text-foreground leading-tight">{k.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-3 space-y-2">
                {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No follow-up records found.</p>
                <p className="text-xs text-muted-foreground">Try adjusting the month, year or search terms.</p>
                <Button variant="outline" size="sm" className="h-7 text-xs mt-1" onClick={() => setQuery("")}>
                  <RotateReset />Reset Filters
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-card">
                    <TableRow className="[&>th]:py-1.5 [&>th]:text-[10px] [&>th]:uppercase [&>th]:tracking-wide [&>th]:whitespace-nowrap">
                      <TableHead className="w-8">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={(c) => setSelected(c ? rows.map((r) => r.id) : [])}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => setSortKey("customer")}>Account #</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>IC</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => setSortKey("customer")}>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => setSortKey("totalNotices")}>Total Notices</TableHead>
                      <TableHead>First Email</TableHead>
                      <TableHead>First Email Date</TableHead>
                      <TableHead>RF1</TableHead>
                      <TableHead>Second Email</TableHead>
                      <TableHead>Second Email Date</TableHead>
                      <TableHead>RF2</TableHead>
                      <TableHead>Phone Call</TableHead>
                      <TableHead>Phone Call Date</TableHead>
                      <TableHead>RF3</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => setSortKey("remaining")}>Total Remaining</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow
                        key={r.id}
                        className="cursor-pointer [&>td]:py-1 [&>td]:text-[11px] [&>td]:whitespace-nowrap"
                        onClick={() => setDrawerRecord(r)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selected.includes(r.id)}
                            onCheckedChange={(c) =>
                              setSelected((prev) => (c ? [...prev, r.id] : prev.filter((id) => id !== r.id)))
                            }
                            aria-label={`Select ${r.customer}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{r.account}</TableCell>
                        <TableCell>{r.state}</TableCell>
                        <TableCell>{r.ic}</TableCell>
                        <TableCell className="font-medium max-w-[180px] truncate">{r.customer}</TableCell>
                        <TableCell>{r.contact}</TableCell>
                        <TableCell>{r.totalNotices}</TableCell>
                        <TableCell>{emailChip(r.firstEmail)}</TableCell>
                        <TableCell className="text-muted-foreground">{r.firstEmailDate}</TableCell>
                        <TableCell>{r.rf1}</TableCell>
                        <TableCell>{emailChip(r.secondEmail)}</TableCell>
                        <TableCell className="text-muted-foreground">{r.secondEmailDate}</TableCell>
                        <TableCell>{r.rf2}</TableCell>
                        <TableCell>{callChip(r.phoneCall)}</TableCell>
                        <TableCell className="text-muted-foreground">{r.phoneCallDate}</TableCell>
                        <TableCell>{r.rf3}</TableCell>
                        <TableCell>{remainingChip(r.remaining)}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="text-xs" onClick={() => setDrawerRecord(r)}>
                                <Eye className="h-3.5 w-3.5 mr-2" />View Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-xs"
                                onClick={() => navigate(`/manage-customers/${r.account}`)}
                              >
                                <UserRound className="h-3.5 w-3.5 mr-2" />Open Customer Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Email Sent Successfully", `First email sent to ${r.contact}.`)}>
                                <Mail className="h-3.5 w-3.5 mr-2" />Send First Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Email Sent Successfully", `Second email sent to ${r.contact}.`)}>
                                <Send className="h-3.5 w-3.5 mr-2" />Send Second Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Phone Call Logged", `Call logged for ${r.customer}.`)}>
                                <Phone className="h-3.5 w-3.5 mr-2" />Log Phone Call
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs" onClick={() => setDrawerRecord(r)}>
                                <History className="h-3.5 w-3.5 mr-2" />View History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => notify("Export Complete", `${r.customer} record exported.`)}>
                                <Download className="h-3.5 w-3.5 mr-2" />Export Record
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
            <Badge variant="secondary" className="text-[10px]">{selected.length} selected</Badge>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Email Sent Successfully", `First email sent to ${selected.length} customers.`)}>
              <Mail className="h-3.5 w-3.5 mr-1.5" />Send First Email
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Email Sent Successfully", `Second email sent to ${selected.length} customers.`)}>
              <Send className="h-3.5 w-3.5 mr-1.5" />Send Second Email
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Export Complete", `${selected.length} records exported.`)}>
              <FileDown className="h-3.5 w-3.5 mr-1.5" />Export Selected
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Refresh Complete", "Follow-up counts updated.")}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Refresh Counts
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Follow-up Updated", `Assigned ${selected.length} records.`)}>
              <UserRound className="h-3.5 w-3.5 mr-1.5" />Assign Follow-up
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelected([])}>
              <X className="h-3.5 w-3.5 mr-1.5" />Clear Selection
            </Button>
          </div>
        </div>
      )}


      {/* Follow-up drawer */}
      <Sheet open={!!drawerRecord} onOpenChange={(o) => !o && setDrawerRecord(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {drawerRecord && (
            <>
              <SheetHeader>
                <SheetTitle className="text-sm">{drawerRecord.customer}</SheetTitle>
                <SheetDescription className="text-xs">
                  Follow-up timeline for {month} {year}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-muted-foreground text-[10px]">Account</p><p className="font-medium">{drawerRecord.account}</p></div>
                    <div><p className="text-muted-foreground text-[10px]">State</p><p className="font-medium">{drawerRecord.state}</p></div>
                    <div><p className="text-muted-foreground text-[10px]">Contact</p><p className="font-medium">{drawerRecord.contact}</p></div>
                    <div><p className="text-muted-foreground text-[10px]">IC</p><p className="font-medium">{drawerRecord.ic}</p></div>
                    <div className="col-span-2"><p className="text-muted-foreground text-[10px]">Email</p><p className="font-medium truncate">{drawerRecord.email}</p></div>
                    <div className="col-span-2"><p className="text-muted-foreground text-[10px]">Phone</p><p className="font-medium">{drawerRecord.phone}</p></div>
                  </div>
                </section>

                <Separator />

                <section className="space-y-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Communication History</h4>
                  {[
                    { label: "First Email", chip: emailChip(drawerRecord.firstEmail), date: drawerRecord.firstEmailDate },
                    { label: "Second Email", chip: emailChip(drawerRecord.secondEmail), date: drawerRecord.secondEmailDate },
                    { label: "Phone Call", chip: callChip(drawerRecord.phoneCall), date: drawerRecord.phoneCallDate },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-md border border-border px-2.5 py-1.5">
                      <span className="text-xs font-medium">{row.label}</span>
                      <div className="flex items-center gap-2">
                        {row.chip}
                        <span className="text-[10px] text-muted-foreground">{row.date}</span>
                      </div>
                    </div>
                  ))}
                </section>

                <Separator />

                <section className="space-y-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Remaining Notices</h4>
                  <div className="flex items-center gap-2">
                    {remainingChip(drawerRecord.remaining)}
                    <span className="text-[11px] text-muted-foreground">of {drawerRecord.totalNotices} total notices</span>
                  </div>
                  <div className="rounded-md border border-border divide-y divide-border">
                    {drawerRecord.equipment.map((e) => (
                      <div key={e.item} className="flex items-center justify-between px-2.5 py-1.5">
                        <span className="text-[11px]">{e.item}</span>
                        <span className="text-[10px] text-muted-foreground">Due {e.due}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator />

                <section className="space-y-1.5">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Notes</h4>
                  <p className="text-[11px] text-muted-foreground">{drawerRecord.notes}</p>
                </section>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Phone Call Logged", `Call logged for ${drawerRecord.customer}.`)}>
                    <Phone className="h-3.5 w-3.5 mr-1.5" />Log Call
                  </Button>
                  <Button size="sm" className="h-7 text-xs" onClick={() => notify("Email Sent Successfully", `Email sent to ${drawerRecord.contact}.`)}>
                    <Mail className="h-3.5 w-3.5 mr-1.5" />Send Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const RotateReset = () => <RefreshCw className="h-3.5 w-3.5 mr-1.5" />;

export default RetestFollowUp;
