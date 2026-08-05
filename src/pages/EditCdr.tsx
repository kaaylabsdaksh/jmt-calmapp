import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Users,
  Route as RouteIcon,
  FileText,
  Info,
  Upload,
  Eye,
  Download,
  Trash2,
  Mail,
  Send,
  Ban,
  CheckCircle2,
  RotateCcw,
  Save,
  MessageSquare,
  Bell,
  FileSpreadsheet,
  FileImage,
  File as FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { useToast } from "@/components/ui/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";
import EmailComposeDialog from "@/components/cdr/EmailComposeDialog";
import { cn } from "@/lib/utils";

const ROUTE_OPTIONS = [
  "Quality",
  "Technical",
  "Safety",
  "Onsite",
  "Receiving",
  "Service",
  "Sales",
  "Rental",
  "Training",
  "Manufacturing",
  "Contracts",
  "Field Service",
  "Surplus",
  "To Factory",
  "AR",
  "Other",
];

const JM_LOCATIONS = ["Baton Rouge", "Houston", "Round Rock", "Lafayette", "Beaumont"];
const DIVISIONS = [
  "ESL",
  "OnSite",
  "MFG",
  "ITL",
  "Rental",
  "Lab",
  "Surplus",
  "ESL Onsite",
  "ITL Onsite",
  "GMFG",
  "Field Service",
];
const PRIORITIES = ["Low", "Normal", "High", "Critical"];
const CDR_TYPES = ["Contract Review", "Pricing Agreement", "Safety Document", "Quality Spec", "Purchase Terms"];
const HOW_RECEIVED = ["Email", "Fax", "Mail", "Customer Portal", "In Person"];
const DOC_TYPES = ["Contract", "Specification", "Purchase Order", "Certificate", "Correspondence", "Other"];
const COMMENT_TYPES = ["General", "Internal", "Customer", "Follow-Up", "Resolution"];

const STATUS_STYLES: Record<string, string> = {
  Created: "bg-blue-100 text-blue-700",
  "In Process": "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-destructive/10 text-destructive",
};

const initialDocs = [
  { id: "d1", name: "Master_Service_Agreement.pdf", type: "Contract", description: "Signed MSA 2026", by: "M. Alvarez", date: "07/28/2026" },
  { id: "d2", name: "Safety_Requirements.xlsx", type: "Specification", description: "Site safety matrix", by: "K. Nguyen", date: "07/29/2026" },
  { id: "d3", name: "Equipment_Tag_Photo.png", type: "Other", description: "Received equipment tag", by: "R. Castillo", date: "08/01/2026" },
];

const initialComments = [
  { id: "c1", user: "M. Alvarez", type: "General", ts: "08/02/2026 10:14 AM", text: "Routed to Quality and Safety for initial review.", notify: true },
  { id: "c2", user: "K. Nguyen", type: "Internal", ts: "08/01/2026 3:42 PM", text: "Awaiting updated pricing sheet from the customer before completing review.", notify: false },
  { id: "c3", user: "R. Castillo", type: "Customer", ts: "07/30/2026 9:05 AM", text: "Customer confirmed equipment has arrived at the Houston facility.", notify: false },
];

const fileIcon = (name: string) => {
  if (/\.(xlsx|xls|csv)$/i.test(name)) return FileSpreadsheet;
  if (/\.(png|jpg|jpeg|gif|webp)$/i.test(name)) return FileImage;
  if (/\.(pdf|docx?|txt)$/i.test(name)) return FileText;
  return FileIcon;
};

const initials = (n: string) => n.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function EditCdr() {
  const { cdrId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState("In Process");
  const [submitted, setSubmitted] = useState(false);

  // CDR details
  const [jmLocation, setJmLocation] = useState("Baton Rouge");
  const [divisions, setDivisions] = useState<string[]>(["ESL", "MFG", "ITL", "Lab"]);
  const [divisionsOpen, setDivisionsOpen] = useState(false);

  // Customer
  const [existingCustomer, setExistingCustomer] = useState("Yes");
  const [customer, setCustomer] = useState("Lone Star Electric Co-op");
  const [account, setAccount] = useState("ACCT-10428");
  const [shipTo, setShipTo] = useState("Main Warehouse - Dock 4");
  const [city, setCity] = useState("Houston");
  const [state, setState] = useState("TX");
  const [contact, setContact] = useState("Dana Whitfield");
  const [phone, setPhone] = useState("(713) 555-0142");
  const [email, setEmail] = useState("dwhitfield@lonestarcoop.com");
  const [accounts, setAccounts] = useState([
    { id: "a1", acct: "3872.00", customer: "Ultra Electronics NSPI", shipTo: "707 Jeffrey Way", city: "Round Rock", state: "TX", srDoc: "SR-88213" },
    { id: "a2", acct: "10428.00", customer: "Lone Star Electric Co-op", shipTo: "Main Warehouse - Dock 4", city: "Houston", state: "TX", srDoc: "" },
  ]);

  // Routing
  const [routes, setRoutes] = useState<string[]>(["Quality", "Safety"]);
  const [sentRoutes, setSentRoutes] = useState<string[]>([]);
  const [otherRoute, setOtherRoute] = useState("");
  const [equipmentHere, setEquipmentHere] = useState(true);
  const [srUpdates, setSrUpdates] = useState(false);

  // Acknowledgements
  type AckRow = {
    dept: string;
    sent: string;
    ack: boolean;
    ackDate: string;
    ackUser: string;
    completed: boolean;
    completedDate: string;
    completedUser: string;
  };
  const [ackRows, setAckRows] = useState<AckRow[]>([
    { dept: "Receiving", sent: "08/05/2026 03:45 AM", ack: false, ackDate: "", ackUser: "", completed: false, completedDate: "", completedUser: "" },
    { dept: "Safety", sent: "08/05/2026 03:45 AM", ack: true, ackDate: "08/05/2026 09:12 AM", ackUser: "K. Nguyen", completed: false, completedDate: "", completedUser: "" },
    { dept: "Technical", sent: "08/05/2026 03:45 AM", ack: false, ackDate: "", ackUser: "", completed: false, completedDate: "", completedUser: "" },
  ]);
  const stamp = () =>
    new Date().toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const toggleAck = (dept: string, field: "ack" | "completed") =>
    setAckRows((rows) =>
      rows.map((r) => {
        if (r.dept !== dept) return r;
        const on = !r[field];
        if (field === "ack")
          return { ...r, ack: on, ackDate: on ? stamp() : "", ackUser: on ? "K. Nguyen" : "" };
        return { ...r, completed: on, completedDate: on ? stamp() : "", completedUser: on ? "K. Nguyen" : "" };
      })
    );

  // Document info
  const [priority, setPriority] = useState("Normal");
  const [po, setPo] = useState("PO-99231");
  const [cdrType, setCdrType] = useState("Contract Review");
  const [dateReceived, setDateReceived] = useState<Date | undefined>(new Date("2026-07-28"));
  const [workOrder, setWorkOrder] = useState("5432");
  const [howReceived, setHowReceived] = useState("Email");
  const [prNumber, setPrNumber] = useState("PR-3391");

  // Documents
  const [docs, setDocs] = useState(initialDocs);
  const [docType, setDocType] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [staged, setStaged] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  // Comments
  const [comments, setComments] = useState(initialComments);
  const [commentType, setCommentType] = useState("General");
  const [commentText, setCommentText] = useState("");
  const [activityOpen, setActivityOpen] = useState(true);
  const [actType, setActType] = useState("all");
  const [actUser, setActUser] = useState("all");
  const [actDate, setActDate] = useState("all");
  const filteredComments = comments.filter(
    (c) =>
      (actType === "all" || c.type === actType) &&
      (actUser === "all" || c.user === actUser) &&
      (actDate === "all" || c.ts.startsWith(actDate))
  );

  // Email dialogs
  const [emailTarget, setEmailTarget] = useState<null | "creator" | "customer">(null);

  const errors = useMemo(
    () => ({
      customer: !customer.trim(),
      routes: routes.length === 0,
      priority: !priority,
      cdrType: !cdrType,
      dateReceived: !dateReceived,
    }),
    [customer, routes, priority, cdrType, dateReceived]
  );
  const hasErrors = Object.values(errors).some(Boolean);
  const showErr = (k: keyof typeof errors) => submitted && errors[k];

  const toggleRoute = (r: string) =>
    setRoutes((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const handleSave = () => {
    setSubmitted(true);
    if (hasErrors) {
      toast({ title: "Missing required fields", description: "Please complete the highlighted fields.", variant: "destructive" });
      return;
    }
    toast({ title: "CDR saved", description: `CDR #${cdrId ?? "35"} changes saved.` });
  };

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setStaged((prev) => [...prev, ...Array.from(list).map((f) => f.name)]);
  };

  const handleUpload = () => {
    if (!docType || staged.length === 0) {
      toast({ title: "Select a document type and file", variant: "destructive" });
      return;
    }
    setDocs((prev) => [
      ...staged.map((name, i) => ({
        id: `${Date.now()}-${i}`,
        name,
        type: docType,
        description: docDesc,
        by: "Current User",
        date: new Date().toLocaleDateString("en-US"),
      })),
      ...prev,
    ]);
    setStaged([]);
    setDocDesc("");
    toast({ title: "Document uploaded" });
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        id: `${Date.now()}`,
        user: "Current User",
        type: commentType,
        ts: new Date().toLocaleString("en-US"),
        text: commentText.trim(),
        notify: commentType === "Customer",
      },
      ...prev,
    ]);
    setCommentText("");
  };

  const sectionTitle = (Icon: any, text: string) => (
    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {text}
    </CardTitle>
  );

  const errText = (msg: string) => <p className="text-[11px] text-destructive">{msg}</p>;

  return (
    <div className="min-h-screen bg-muted/30">
      <ModernTopNav />

      <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-4 md:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">CDR #{cdrId ?? "35"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-3 py-1 text-xs font-medium", STATUS_STYLES[status] ?? "bg-muted text-foreground")}>
              {status}
            </span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {priority}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* CDR Details */}
          <Card>
            <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(Info, "CDR Details")}</CardHeader>
            <CardContent className="px-3 pb-2.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <div className="flex h-8 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                    {status}
                  </div>

                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    JM Location <span className="text-destructive">*</span>
                  </Label>
                  <Select value={jmLocation} onValueChange={setJmLocation}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JM_LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Division(s) <span className="text-destructive">*</span>
                  </Label>
                  <Popover open={divisionsOpen} onOpenChange={setDivisionsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="h-8 w-full justify-between text-sm font-normal"
                      >
                        <span className="truncate text-xs">
                          {divisions.length ? divisions.join(", ") : "Select division(s)"}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <div className="max-h-56 overflow-y-auto p-1">
                        {DIVISIONS.map((d) => {
                          const active = divisions.includes(d);
                          return (
                            <label
                              key={d}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-accent",
                                active && "bg-accent/60"
                              )}
                            >
                              <Checkbox
                                checked={active}
                                onCheckedChange={() =>
                                  setDivisions((prev) =>
                                    prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                                  )
                                }
                              />
                              <span>{d}</span>
                            </label>
                          );
                        })}
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between gap-2 p-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setDivisions([...DIVISIONS])}>
                            Select All
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setDivisions([])}>
                            Unselect All
                          </Button>
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => setDivisionsOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

              </div>

              {/* Workflow information (compact) */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-2 text-[10px] leading-tight text-muted-foreground">
                {[
                  ["Created By", "M. Alvarez"],
                  ["Created", "07/28/2026 8:12 AM"],
                  ["Modified By", "K. Nguyen"],
                  ["Modified", "08/02/2026 10:14 AM"],
                ].map(([label, value]) => (
                  <span key={label} className="whitespace-nowrap">
                    {label}: <span className="font-medium text-foreground">{value}</span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Card>
              <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(Users, "Customer Information")}</CardHeader>
              <CardContent className="space-y-2 px-3 pb-2.5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Existing Customer</Label>
                    <Select value={existingCustomer} onValueChange={setExistingCustomer}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Customer <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className={cn("h-8 text-sm", showErr("customer") && "border-destructive")}
                      placeholder="Search customer..."
                    />
                    {showErr("customer") && errText("Customer is required")}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Account Number</Label>
                    <Input value={account} onChange={(e) => setAccount(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ship To</Label>
                    <Input value={shipTo} onChange={(e) => setShipTo(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">City</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">State</Label>
                    <Input value={state} onChange={(e) => setState(e.target.value)} className="h-8 text-sm" />
                  </div>
                </div>

                <Separator />

                {/* Linked accounts */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">Linked Account(s)</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px]"
                      onClick={() =>
                        setAccounts((prev) => [
                          ...prev,
                          { id: `${Date.now()}`, acct: "", customer: "", shipTo: "", city: "", state: "", srDoc: "" },
                        ])
                      }
                    >
                      <Users className="mr-1.5 h-3.5 w-3.5" />
                      Add/Remove Accounts
                    </Button>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="h-8 text-[11px]">Acct</TableHead>
                          <TableHead className="h-8 text-[11px]">Customer</TableHead>
                          <TableHead className="h-8 text-[11px]">Ship To</TableHead>
                          <TableHead className="h-8 text-[11px]">City</TableHead>
                          <TableHead className="h-8 text-[11px]">State</TableHead>
                          <TableHead className="h-8 text-[11px]">SR Document</TableHead>
                          <TableHead className="h-8 w-8" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accounts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="py-6 text-center text-xs text-muted-foreground">
                              No accounts linked
                            </TableCell>
                          </TableRow>
                        ) : (
                          accounts.map((a) => (
                            <TableRow key={a.id}>
                              <TableCell className="py-1.5 text-xs font-medium text-slate-900">{a.acct || "—"}</TableCell>
                              <TableCell className="py-1.5 text-xs">{a.customer || "—"}</TableCell>
                              <TableCell className="py-1.5 text-xs">{a.shipTo || "—"}</TableCell>
                              <TableCell className="py-1.5 text-xs">{a.city || "—"}</TableCell>
                              <TableCell className="py-1.5 text-xs">{a.state || "—"}</TableCell>
                              <TableCell className="py-1.5 text-xs">{a.srDoc || "—"}</TableCell>
                              <TableCell className="py-1.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setAccounts((prev) => prev.filter((x) => x.id !== a.id))}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">Contact Information</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Contact</Label>
                      <Input value={contact} onChange={(e) => setContact(e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Phone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Email</Label>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-8 text-sm" />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(RouteIcon, "Routing & Review")}</CardHeader>
              <CardContent className="space-y-2 px-3 pb-2.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">
                      Route To <span className="text-destructive">*</span>
                      {routes.length > 0 && (
                        <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {routes.length} selected
                        </span>
                      )}
                    </Label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px]"
                        onClick={() => setRoutes(ROUTE_OPTIONS)}
                      >
                        Select all
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px]"
                        onClick={() => setRoutes([])}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px]"
                        disabled={routes.length === 0}
                        onClick={() => {
                          setSentRoutes(routes);
                          toast({ title: `Notifications sent to ${routes.length} department(s)` });
                        }}
                      >
                        <Send className="mr-1 h-3 w-3" /> Send all
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {ROUTE_OPTIONS.map((r) => {
                      const active = routes.includes(r);
                      const sent = sentRoutes.includes(r);
                      return (
                        <div
                          key={r}
                          className={cn(
                            "group flex items-center justify-between gap-1 rounded-md border px-2 py-1.5 transition-colors",
                            active ? "border-slate-300 bg-slate-100" : "border-border bg-background hover:bg-accent/50"
                          )}
                        >
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleRoute(r)}
                            className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                          >
                            <Checkbox
                              checked={active}
                              className="pointer-events-none h-3.5 w-3.5 data-[state=checked]:border-slate-900 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white"
                            />
                            <span className={cn("truncate text-xs", active && "font-medium")}>{r}</span>
                          </button>
                          {active &&
                            (sent ? (
                              <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" /> Sent
                              </span>
                            ) : (
                              <button
                                type="button"
                                title={`Send to ${r}`}
                                onClick={() => {
                                  setSentRoutes((p) => [...p, r]);
                                  toast({ title: `Notification sent to ${r}` });
                                }}
                                className="flex shrink-0 items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                              >
                                <Send className="h-3 w-3" /> Send
                              </button>
                            ))}
                        </div>
                      );
                    })}
                  </div>

                  {showErr("routes") && errText("Select at least one department")}
                  {routes.includes("Other") && (
                    <Input
                      value={otherRoute}
                      onChange={(e) => setOtherRoute(e.target.value)}
                      placeholder="Specify other department"
                      className="h-8 text-sm"
                    />
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md border p-2.5">
                    <div>
                      <p className="text-xs font-medium">Equipment Here</p>
                      <p className="text-[11px] text-muted-foreground">Equipment has arrived at the facility</p>
                    </div>
                    <Switch checked={equipmentHere} onCheckedChange={setEquipmentHere} />
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-2.5">
                    <div>
                      <p className="text-xs font-medium">SR Updates Completed</p>
                      <p className="text-[11px] text-muted-foreground">Service record updates finalized</p>
                    </div>
                    <Switch checked={srUpdates} onCheckedChange={setSrUpdates} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-3">
            <Card>
              <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(FileText, "Document Information")}</CardHeader>
              <CardContent className="px-3 pb-2.5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Priority <span className="text-destructive">*</span>
                    </Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className={cn("h-8 text-sm", showErr("priority") && "border-destructive")}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">PO Number</Label>
                    <Input value={po} onChange={(e) => setPo(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      CDR Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={cdrType} onValueChange={setCdrType}>
                      <SelectTrigger className={cn("h-8 text-sm", showErr("cdrType") && "border-destructive")}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CDR_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Date Received <span className="text-destructive">*</span>
                    </Label>
                    <ModernDatePicker
                      value={dateReceived}
                      onChange={setDateReceived}
                      size="md"
                      inputClassName={cn(showErr("dateReceived") && "border-destructive")}
                    />
                    {showErr("dateReceived") && errText("Date Received is required")}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Work Order</Label>
                    <Input value={workOrder} onChange={(e) => setWorkOrder(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">How Received</Label>
                    <Select value={howReceived} onValueChange={setHowReceived}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOW_RECEIVED.map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">PR Number</Label>
                    <Input value={prNumber} onChange={(e) => setPrNumber(e.target.value)} className="h-8 text-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acknowledgement */}
          <Card className="border-blue-200 bg-blue-50/60">
            <CardContent className="flex gap-2.5 p-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Acknowledgement</p>
                <p className="text-xs text-blue-800">
                  By saving or completing this CDR, you acknowledge responsibility for reviewing, updating, and
                  following up on this document.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledgements */}
          <Card>
            <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(CheckCircle2, "Acknowledgements")}</CardHeader>
            <CardContent className="px-3 pb-2.5">
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="[&>th]:h-8 [&>th]:text-xs">
                      <TableHead>Dept/Area</TableHead>
                      <TableHead>Date Sent</TableHead>
                      <TableHead className="text-center">Ack</TableHead>
                      <TableHead>Ack Date</TableHead>
                      <TableHead>Ack User</TableHead>
                      <TableHead className="text-center">Completed</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Completed User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ackRows.map((r) => (
                      <TableRow key={r.dept} className="[&>td]:py-1.5 [&>td]:text-xs">
                        <TableCell className="font-medium">{r.dept}</TableCell>
                        <TableCell className="text-muted-foreground">{r.sent}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox checked={r.ack} onCheckedChange={() => toggleAck(r.dept, "ack")} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{r.ackDate || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{r.ackUser || "—"}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={r.completed}
                            disabled={!r.ack}
                            onCheckedChange={() => toggleAck(r.dept, "completed")}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{r.completedDate || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{r.completedUser || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>


          {/* Documents */}
          <Card>
            <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(Upload, "Documents")}</CardHeader>
            <CardContent className="space-y-2 px-3 pb-2.5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select doc type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOC_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-xs">Description</Label>
                  <Input value={docDesc} onChange={(e) => setDocDesc(e.target.value)} className="h-8 text-sm" placeholder="Short description" />
                </div>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 transition-colors",
                  dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                )}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Drag &amp; drop files here</p>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => document.getElementById("cdr-file")?.click()}>
                  Browse Files
                </Button>
                <input id="cdr-file" type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                {staged.length > 0 && (
                  <p className="text-[11px] text-muted-foreground">{staged.join(", ")}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button size="sm" className="h-8 text-xs" onClick={handleUpload}>
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Upload Document
                </Button>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="[&>th]:h-9 [&>th]:text-xs">
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Uploaded Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                          No documents uploaded
                        </TableCell>
                      </TableRow>
                    ) : (
                      docs.map((d) => {
                        const Icon = fileIcon(d.name);
                        return (
                          <TableRow key={d.id} className="[&>td]:py-2 [&>td]:text-xs">
                            <TableCell>
                              <span className="flex items-center gap-2 font-medium">
                                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                {d.name}
                              </span>
                            </TableCell>
                            <TableCell>{d.type}</TableCell>
                            <TableCell className="max-w-[220px] truncate">{d.description || "-"}</TableCell>
                            <TableCell>{d.by}</TableCell>
                            <TableCell>{d.date}</TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="View">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Download">
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive"
                                  aria-label="Delete"
                                  onClick={() => setDocs((prev) => prev.filter((x) => x.id !== d.id))}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                  <MessageSquare className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Activity Log</h3>
                  <p className="text-xs text-muted-foreground">Track all changes and updates</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setActivityOpen((v) => !v)}
              >
                <ChevronDown className={cn("mr-1.5 h-4 w-4 transition-transform", activityOpen && "rotate-180")} />
                {activityOpen ? "Hide" : "Show"}
              </Button>
            </div>

            {activityOpen && (
              <CardContent className="space-y-2 px-3 pb-2.5 pt-2">
                <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/20 p-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Type</Label>
                    <Select value={commentType} onValueChange={setCommentType}>
                      <SelectTrigger className="h-8 w-[180px] text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="min-w-[240px] flex-1 space-y-1">
                    <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Comment</Label>
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Enter your comment..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <Button size="sm" className="h-8 text-xs" onClick={addComment}>
                    <Plus className="mr-1.5 h-4 w-4" /> Add
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Activity History</h4>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {filteredComments.length}
                  </span>
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <div className="flex flex-wrap items-center gap-2 border-b bg-muted/30 px-3 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Quick search:
                    </span>
                    <Select value={actType} onValueChange={setActType}>
                      <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {COMMENT_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Select value={actUser} onValueChange={setActUser}>
                      <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        {Array.from(new Set(comments.map((c) => c.user))).map((u) => (
                          <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={actDate} onValueChange={setActDate}>
                      <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        {Array.from(new Set(comments.map((c) => c.ts.split(" ")[0]))).map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b bg-background text-[10px] uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-2 font-semibold">Type</th>
                        <th className="px-3 py-2 font-semibold">User</th>
                        <th className="px-3 py-2 font-semibold">Date</th>
                        <th className="px-3 py-2 font-semibold">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComments.map((c) => (
                        <tr key={c.id} className="border-b last:border-0 align-top">
                          <td className="px-3 py-2.5">
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                              {c.type}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-xs font-medium">{c.user}</td>
                          <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] text-muted-foreground">{c.ts}</td>
                          <td className="px-3 py-2.5 text-xs text-foreground">{c.text}</td>
                        </tr>
                      ))}
                      {filteredComments.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-3 py-6 text-center text-xs text-muted-foreground">
                            No activity matches the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-20 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEmailTarget("creator")}>
              <Mail className="mr-1.5 h-3.5 w-3.5" /> Email Creator
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEmailTarget("customer")}>
              <Mail className="mr-1.5 h-3.5 w-3.5" /> Email Customer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => toast({ title: "PO added to account(s)", description: po || "No PO number entered" })}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" /> Add PO to Acct(s)
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Send className="mr-1.5 h-3.5 w-3.5" /> Send Notifications
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={status !== "Completed" && status !== "Cancelled"}
              onClick={() => { setStatus("In Process"); toast({ title: "CDR reopened" }); }}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reopen CDR
            </Button>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-destructive/40 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={status === "Cancelled" || status === "Completed"}
              onClick={() => { setStatus("Cancelled"); toast({ title: "CDR cancelled" }); }}
            >
              <Ban className="mr-1.5 h-3.5 w-3.5" /> Cancel CDR
            </Button>
            <Button
              size="sm"
              className="h-8 bg-green-600 text-xs text-white hover:bg-green-700"
              disabled={status === "Completed"}
              onClick={() => {
                setSubmitted(true);
                if (hasErrors) {
                  toast({ title: "Missing required fields", variant: "destructive" });
                  return;
                }
                setStatus("Completed");
                toast({ title: "CDR completed" });
              }}
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Complete CDR
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={handleSave}>
              <Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes
            </Button>
          </div>
        </div>
      </div>

      <EmailComposeDialog
        open={emailTarget !== null}
        onOpenChange={(o) => !o && setEmailTarget(null)}
        title={emailTarget === "customer" ? "Email Customer" : "Email Creator"}
        description={`CDR #${cdrId} · ${customer}`}
        attachments={docs.slice(0, 2).map((d) => d.name)}
        bodyLabel={emailTarget === "customer" ? "Body" : "Comments"}
        bodyMinHeight={emailTarget === "customer" ? "min-h-[200px]" : "min-h-[104px]"}
        defaults={{
          from: "vimalandhanbal@jmtest.com",
          to: emailTarget === "customer" ? email : "aleatabrown@jmtest.com",
          subject:
            emailTarget === "customer"
              ? `JM Test CDR #${cdrId} - Review of Purchase Order You Submitted`
              : `JM Test CDR #${cdrId} you Created`,
          comments:
            emailTarget === "customer"
              ? "Please accept this email as 'receipt' of Purchase order. A final acknowledgement will be sent once Purchase order is reviewed and approved to process.\n\nThank You.\nAdmin User\n318-443-5589"
              : "",
        }}
        onSend={(v) => toast({ title: "Email sent", description: `To ${v.to}` })}
      />
    </div>
  );
}
