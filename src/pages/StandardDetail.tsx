import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoveRight,
  Download,
  Search,
  MessageSquarePlus,
  AlertTriangle,
  Clock,
  CalendarCheck,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  STANDARDS,
  StandardRecord,
  emptyStandard,
  MANUFACTURERS,
  MODELS,
  LOCATIONS,
  DIVISIONS,
  LAB_AREAS,
  TRACE_CODES,
  INTERVAL_UNITS,
  COMMENT_TYPES,
  ACCESSORY_TYPES,
  CHECK_TYPES,
  calibrationStatus,
} from "@/lib/standards/data";

/* ------------------------------------------------------------- small pieces */

const SectionCard = ({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const Field = ({
  label,
  htmlFor,
  required,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-1", className)}>
    <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
      {label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </Label>
    {children}
    {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
  </div>
);

const ToggleRow = ({
  label,
  hint,
  checked,
  onChange,
  id,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) => (
  <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
    <div className="pr-3">
      <Label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
      </Label>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onChange} />
  </div>
);

const MaintenanceStatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Scheduled: "bg-slate-100 text-slate-700",
    "Due Soon": "bg-amber-50 text-amber-700",
    Overdue: "bg-red-50 text-red-700",
    Completed: "bg-emerald-50 text-emerald-700",
  };
  return (
    <Badge variant="outline" className={cn("rounded-full border-transparent px-2 py-0.5 text-[11px] font-medium", map[status])}>
      {status}
    </Badge>
  );
};

/* -------------------------------------------------------------------- page */

const StandardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = !id || id === "new";

  const original = useMemo<StandardRecord>(
    () => (isNew ? emptyStandard() : STANDARDS.find((s) => s.id === id) ?? emptyStandard()),
    [id, isNew]
  );

  const [form, setForm] = useState<StandardRecord>(original);
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState(searchParams.get("tab") ?? "general");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const [moveOpen, setMoveOpen] = useState(false);
  const [move, setMove] = useState({ lab: "", division: "", labArea: "" });
  const [deleteCheck, setDeleteCheck] = useState<string | null>(null);
  const [savedNo, setSavedNo] = useState<string | null>(null);

  useEffect(() => setForm(original), [original]);

  const set = <K extends keyof StandardRecord>(key: K, value: StandardRecord[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  /* --------------------------------------------------------- accessories */
  const [accDraft, setAccDraft] = useState({ accessory: "", type: "", color: "", quantity: "1", material: "" });
  const addAccessory = () => {
    if (!accDraft.accessory.trim()) {
      toast.error("Enter an accessory name.");
      return;
    }
    set("accessories", [
      ...form.accessories,
      { id: `acc-${Date.now()}`, ...accDraft, quantity: Number(accDraft.quantity) || 1 },
    ]);
    setAccDraft({ accessory: "", type: "", color: "", quantity: "1", material: "" });
  };

  /* ------------------------------------------------------------- comments */
  const [commentDraft, setCommentDraft] = useState({ type: "General", comment: "" });
  const addComment = () => {
    if (!commentDraft.comment.trim()) return;
    set("comments", [
      {
        id: `c-${Date.now()}`,
        type: commentDraft.type,
        entered: new Date().toLocaleDateString("en-US"),
        user: "Current User",
        comment: commentDraft.comment.trim(),
      },
      ...form.comments,
    ]);
    setCommentDraft({ type: "General", comment: "" });
  };

  /* ---------------------------------------------------------- maintenance */
  const [checkOpen, setCheckOpen] = useState(false);
  const [checkDraft, setCheckDraft] = useState({
    checkType: CHECK_TYPES[0],
    frequency: "Quarterly",
    lastCompleted: "",
    nextDue: "",
    assignedTo: "",
    notes: "",
  });

  /* ------------------------------------------------------- history filters */
  const [hQuery, setHQuery] = useState("");
  const [hCondition, setHCondition] = useState("all");
  const [hSort, setHSort] = useState<{ key: "workOrderNo" | "certificationDate" | "recalibrationDate"; dir: "asc" | "desc" }>({
    key: "certificationDate",
    dir: "desc",
  });
  const [hPage, setHPage] = useState(1);
  const H_SIZE = 5;

  const historyRows = useMemo(() => {
    let rows = form.history.filter((h) => {
      if (hQuery && !h.workOrderNo.toLowerCase().includes(hQuery.toLowerCase())) return false;
      if (hCondition !== "all" && h.conditionIn !== hCondition) return false;
      return true;
    });
    const dir = hSort.dir === "asc" ? 1 : -1;
    rows = [...rows].sort((a, b) => String(a[hSort.key]).localeCompare(String(b[hSort.key])) * dir);
    return rows;
  }, [form.history, hQuery, hCondition, hSort]);

  /* ----------------------------------------------------------------- save */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.standardNo.trim()) e.standardNo = "Standard number is required.";
    if (!form.manufacturer) e.manufacturer = "Please select a manufacturer.";
    if (!form.model) e.model = "Please select a model.";
    if (!form.serial.trim()) e.serial = "Serial number is required.";
    if (!form.state) e.state = "State is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setDirty(false);
    if (isNew) {
      setSavedNo(form.standardNo);
      toast.success(`Standard ${form.standardNo} created successfully.`);
    } else {
      toast.success(`Standard ${form.standardNo} updated successfully.`);
    }
  };

  const guardedNavigate = (to: string) => {
    if (dirty) {
      setPendingNav(to);
      setLeaveOpen(true);
      return;
    }
    navigate(to);
  };

  const status = calibrationStatus(form.nextCalibrationDue);

  const summary = (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border bg-white p-4 text-xs shadow-sm">
      {[
        ["Standard #", form.standardNo || "—"],
        ["Manufacturer", form.manufacturer || "—"],
        ["Model", form.model || "—"],
        ["Serial", form.serial || "—"],
      ].map(([k, v]) => (
        <div key={k}>
          <div className="text-muted-foreground">{k}</div>
          <div className="font-medium text-foreground">{v}</div>
        </div>
      ))}
      <div>
        <div className="text-muted-foreground">Current State</div>
        <Badge
          variant="outline"
          className={cn(
            "rounded-full border-transparent px-2 py-0.5 text-[11px] font-medium",
            form.state === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
          )}
        >
          {form.state || "—"}
        </Badge>
      </div>
      {!isNew && (
        <div className="ml-auto flex items-center gap-2">
          {status === "overdue" && (
            <span className="inline-flex items-center gap-1 text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" /> Calibration overdue ({form.nextCalibrationDue})
            </span>
          )}
          {status === "due-soon" && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <Clock className="h-3.5 w-3.5" /> Due soon ({form.nextCalibrationDue})
            </span>
          )}
          {status === "normal" && form.nextCalibrationDue && (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CalendarCheck className="h-3.5 w-3.5" /> Next due {form.nextCalibrationDue}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-20 border-b border-border bg-white px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted" />
          <div>
            <h1 className="text-lg font-semibold leading-tight text-foreground">
              {isNew ? "Add New Standard" : `Edit Standard ${form.standardNo}`}
            </h1>
            <Breadcrumb className="mt-1">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs text-muted-foreground">Equipment</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
                    <Link to="/standards">Manage Standards</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-medium text-foreground">
                    {isNew ? "Add New Standard" : "Edit Standard"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>

      <main className="space-y-4 p-4 lg:p-6">
        {summary}

        {savedNo && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <span>Standard {savedNo} created successfully.</span>
            <Button size="sm" variant="outline" className="h-7 bg-white" onClick={() => navigate(`/standards/${savedNo}`)}>
              View Standard
            </Button>
            <Button size="sm" variant="ghost" className="h-7" onClick={() => navigate("/standards")}>
              Return to Standards
            </Button>
          </div>
        )}

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="sticky top-[64px] z-10">
            <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
            {!isNew && (
              <TabsTrigger value="maintenance" className="text-xs">
                Preventive Maintenance / Interim Checks
              </TabsTrigger>
            )}
            <TabsTrigger value="history" className="text-xs">Work Order History</TabsTrigger>
          </TabsList>

          {/* ------------------------------------------------------ GENERAL */}
          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <SectionCard title="Equipment">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Standard #" htmlFor="standardNo" required error={errors.standardNo}>
                    <Input id="standardNo" className="h-9 text-sm" value={form.standardNo} onChange={(e) => set("standardNo", e.target.value)} />
                  </Field>
                  <Field label="Manufacturer" required error={errors.manufacturer}>
                    <Select value={form.manufacturer} onValueChange={(v) => set("manufacturer", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{MANUFACTURERS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Model" required error={errors.model}>
                    <Select value={form.model} onValueChange={(v) => set("model", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Serial" htmlFor="serial" required error={errors.serial}>
                    <Input id="serial" className="h-9 text-sm" value={form.serial} onChange={(e) => set("serial", e.target.value)} />
                  </Field>
                  <Field label="Description" htmlFor="description" className="sm:col-span-2">
                    <Input id="description" className="h-9 text-sm" value={form.description} onChange={(e) => set("description", e.target.value)} />
                  </Field>
                  <Field label="Accuracy" htmlFor="accuracy">
                    <Input id="accuracy" className="h-9 text-sm" value={form.accuracy} onChange={(e) => set("accuracy", e.target.value)} />
                  </Field>
                  <Field label="Range(s)" htmlFor="ranges">
                    <Input id="ranges" className="h-9 text-sm" value={form.ranges} onChange={(e) => set("ranges", e.target.value)} />
                  </Field>
                  <Field label="Option(s)" htmlFor="options">
                    <Input id="options" className="h-9 text-sm" value={form.options} onChange={(e) => set("options", e.target.value)} />
                  </Field>
                  <Field
                    label="RFID"
                    htmlFor="rfid"
                    error={form.rfid && !/^[a-zA-Z0-9]{6,}$/.test(form.rfid) ? "RFID must be at least 6 alphanumeric characters." : undefined}
                  >
                    <Input id="rfid" disabled={form.noRfid} className="h-9 text-sm" value={form.rfid} onChange={(e) => set("rfid", e.target.value)} />
                  </Field>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-xs text-foreground">
                      <Checkbox
                        checked={form.noRfid}
                        onCheckedChange={(v) => {
                          set("noRfid", Boolean(v));
                          if (v) set("rfid", "");
                        }}
                      />
                      No RFID
                    </label>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Calibration">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <ToggleRow
                    id="toFactory"
                    label="To Factory"
                    hint="Calibration performed by the manufacturer; lab procedure fields are not used."
                    checked={form.toFactory}
                    onChange={(v) => set("toFactory", v)}
                  />
                  <ToggleRow id="a17025" label="17025 Accredited" checked={form.accredited17025} onChange={(v) => set("accredited17025", v)} />
                  <ToggleRow
                    id="allowAcc"
                    label="Allow Accredited Certification"
                    checked={form.allowAccreditedCert}
                    onChange={(v) => set("allowAccreditedCert", v)}
                  />
                  {form.accredited17025 && (
                    <div className="sm:col-span-2 lg:col-span-3 rounded-md border border-border bg-muted/30 p-2 text-[11px] text-muted-foreground">
                      Accredited scope applies. Certificates issued for this standard will include the A2LA accreditation
                      statement and the assigned trace code.
                    </div>
                  )}
                  <Field label="Calibration Interval Unit">
                    <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{INTERVAL_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Calibration Interval" htmlFor="interval">
                    <Input id="interval" type="number" className="h-9 text-sm" value={form.interval} onChange={(e) => set("interval", Number(e.target.value))} />
                  </Field>
                  <Field label="Last Calibration Date" htmlFor="lastCal">
                    <Input id="lastCal" placeholder="MM/DD/YYYY" className="h-9 text-sm" value={form.lastCalibration} onChange={(e) => set("lastCalibration", e.target.value)} />
                  </Field>
                  <Field label="Next Due Date" htmlFor="nextCal">
                    <Input id="nextCal" placeholder="MM/DD/YYYY" className="h-9 text-sm" value={form.nextCalibrationDue} onChange={(e) => set("nextCalibrationDue", e.target.value)} />
                  </Field>
                  <Field label="State of Asset" required error={errors.state}>
                    <Select value={form.state} onValueChange={(v) => set("state", v as StandardRecord["state"])}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Assigned Standard" htmlFor="assignedStandard">
                    <Input id="assignedStandard" className="h-9 text-sm" value={form.assignedStandard} onChange={(e) => set("assignedStandard", e.target.value)} />
                  </Field>
                  <Field label="Assigned Procedure" htmlFor="assignedProcedure">
                    <Input id="assignedProcedure" className="h-9 text-sm" value={form.assignedProcedure} onChange={(e) => set("assignedProcedure", e.target.value)} />
                  </Field>
                  <Field label="Instructions to Technician" htmlFor="instructions" className="sm:col-span-2 lg:col-span-3">
                    <Textarea
                      id="instructions"
                      className="min-h-[68px] text-sm"
                      value={form.technicianInstructions}
                      onChange={(e) => set("technicianInstructions", e.target.value)}
                    />
                  </Field>
                </div>
              </SectionCard>
            </div>

            <SectionCard
              title="Calibration Schedule"
              description="Select the weeks in which this standard should be included in the calibration schedule."
            >
              <ToggleRow
                id="addSchedule"
                label="Add to Calibration Schedule"
                checked={form.addToSchedule}
                onChange={(v) => set("addToSchedule", v)}
              />
              {form.addToSchedule && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Array.from({ length: 52 }, (_, i) => i + 1).map((w) => {
                    const on = form.scheduleWeeks.includes(w);
                    return (
                      <button
                        key={w}
                        type="button"
                        aria-pressed={on}
                        aria-label={`Week ${w}`}
                        onClick={() =>
                          set(
                            "scheduleWeeks",
                            on ? form.scheduleWeeks.filter((x) => x !== w) : [...form.scheduleWeeks, w].sort((a, b) => a - b)
                          )
                        }
                        className={cn(
                          "h-8 w-9 rounded-md border text-xs font-medium transition-colors",
                          on
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-white text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            <div className="grid gap-4 xl:grid-cols-3">
              <SectionCard
                title="Designated Location"
                action={
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => { setMove({ lab: form.lab, division: form.division, labArea: form.labArea }); setMoveOpen(true); }}>
                    <MoveRight className="h-3.5 w-3.5" />
                    Initiate Move
                  </Button>
                }
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Lab">
                    <Select value={form.lab} onValueChange={(v) => set("lab", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Division">
                    <Select value={form.division} onValueChange={(v) => set("division", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{DIVISIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Lab Area">
                    <Select value={form.labArea} onValueChange={(v) => set("labArea", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{LAB_AREAS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Calibration Provider" description="Where this standard is sent for calibration.">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Location">
                    <Select value={form.providerLocation} onValueChange={(v) => set("providerLocation", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Division">
                    <Select value={form.providerDivision} onValueChange={(v) => set("providerDivision", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{DIVISIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <div className="sm:col-span-2">
                    <ToggleRow
                      id="noOnsite"
                      label="No Onsite Use"
                      hint="Exclude this standard from onsite job assignment."
                      checked={form.noOnsiteUse}
                      onChange={(v) => set("noOnsiteUse", v)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="METCAL Mapped Fields">
                <Field label="Trace Code">
                  <Select value={form.traceCode} onValueChange={(v) => set("traceCode", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select trace code" /></SelectTrigger>
                    <SelectContent>{TRACE_CODES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </SectionCard>
            </div>

            <SectionCard title="Purchasing">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Purchase Order" htmlFor="po"><Input id="po" className="h-9 text-sm" value={form.purchaseOrder} onChange={(e) => set("purchaseOrder", e.target.value)} /></Field>
                <Field label="Purchase Date" htmlFor="pdate"><Input id="pdate" placeholder="MM/DD/YYYY" className="h-9 text-sm" value={form.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} /></Field>
                <Field label="Acquired From" htmlFor="acq"><Input id="acq" className="h-9 text-sm" value={form.acquiredFrom} onChange={(e) => set("acquiredFrom", e.target.value)} /></Field>
                <Field label="Condition">
                  <Select value={form.condition} onValueChange={(v) => set("condition", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{["New", "Used", "Refurbished"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Used For" htmlFor="usedfor"><Input id="usedfor" className="h-9 text-sm" value={form.usedFor} onChange={(e) => set("usedFor", e.target.value)} /></Field>
                <Field label="Owning Account #" htmlFor="acct"><Input id="acct" className="h-9 text-sm" value={form.owningAccount} onChange={(e) => set("owningAccount", e.target.value)} /></Field>
                <Field label="GL Account" htmlFor="gl"><Input id="gl" className="h-9 text-sm" value={form.glAccount} onChange={(e) => set("glAccount", e.target.value)} /></Field>
                <Field label="Purchase Cost" htmlFor="cost">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <Input id="cost" className="h-9 pl-6 text-sm" value={form.purchaseCost} onChange={(e) => set("purchaseCost", e.target.value)} />
                  </div>
                </Field>
                <Field label="Replacement Cost" htmlFor="repl">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <Input id="repl" className="h-9 pl-6 text-sm" value={form.replacementCost} onChange={(e) => set("replacementCost", e.target.value)} />
                  </div>
                </Field>
                <Field label="Ordered Date" htmlFor="odate"><Input id="odate" placeholder="MM/DD/YYYY" className="h-9 text-sm" value={form.orderedDate} onChange={(e) => set("orderedDate", e.target.value)} /></Field>
                <Field label="Ordered By" htmlFor="oby"><Input id="oby" className="h-9 text-sm" value={form.orderedBy} onChange={(e) => set("orderedBy", e.target.value)} /></Field>
                <Field label="Date Received" htmlFor="rdate"><Input id="rdate" placeholder="MM/DD/YYYY" className="h-9 text-sm" value={form.dateReceived} onChange={(e) => set("dateReceived", e.target.value)} /></Field>
              </div>
            </SectionCard>

            <div className="grid gap-4 xl:grid-cols-2">
              <SectionCard title="Other">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ToggleRow id="consumable" label="Consumable" checked={form.consumable} onChange={(v) => set("consumable", v)} />
                  <ToggleRow id="tools" label="Has Software Tool(s)" checked={form.hasSoftwareTools} onChange={(v) => set("hasSoftwareTools", v)} />
                </div>
                {form.hasSoftwareTools && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {form.toolLinks.map((link, i) => (
                      <Field key={i} label={`Link to Tool ${i + 1}`} htmlFor={`tool-${i}`}>
                        <Input
                          id={`tool-${i}`}
                          className="h-9 text-sm"
                          value={link}
                          onChange={(e) => {
                            const next = [...form.toolLinks];
                            next[i] = e.target.value;
                            set("toolLinks", next);
                          }}
                        />
                      </Field>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Accessories">
                <div className="grid items-end gap-2 sm:grid-cols-6">
                  <Field label="Accessory" htmlFor="acc-name" className="sm:col-span-2">
                    <Input id="acc-name" className="h-9 text-sm" value={accDraft.accessory} onChange={(e) => setAccDraft({ ...accDraft, accessory: e.target.value })} />
                  </Field>
                  <Field label="Type">
                    <Select value={accDraft.type} onValueChange={(v) => setAccDraft({ ...accDraft, type: v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>{ACCESSORY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Color" htmlFor="acc-color"><Input id="acc-color" className="h-9 text-sm" value={accDraft.color} onChange={(e) => setAccDraft({ ...accDraft, color: e.target.value })} /></Field>
                  <Field label="Qty" htmlFor="acc-qty"><Input id="acc-qty" type="number" min={1} className="h-9 text-sm" value={accDraft.quantity} onChange={(e) => setAccDraft({ ...accDraft, quantity: e.target.value })} /></Field>
                  <Field label="Material" htmlFor="acc-mat"><Input id="acc-mat" className="h-9 text-sm" value={accDraft.material} onChange={(e) => setAccDraft({ ...accDraft, material: e.target.value })} /></Field>
                  <div className="sm:col-span-6">
                    <Button size="sm" className="h-8 gap-1 text-xs" onClick={addAccessory}>
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                  </div>
                </div>

                {form.accessories.length > 0 && (
                  <div className="mt-3 overflow-x-auto rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-semibold">Accessory</TableHead>
                          <TableHead className="text-xs font-semibold">Type</TableHead>
                          <TableHead className="text-xs font-semibold">Color</TableHead>
                          <TableHead className="text-xs font-semibold">Qty</TableHead>
                          <TableHead className="text-xs font-semibold">Material</TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {form.accessories.map((a) => (
                          <TableRow key={a.id} className="text-xs">
                            <TableCell className="py-1.5">{a.accessory}</TableCell>
                            <TableCell className="py-1.5">{a.type}</TableCell>
                            <TableCell className="py-1.5">{a.color}</TableCell>
                            <TableCell className="py-1.5">{a.quantity}</TableCell>
                            <TableCell className="py-1.5">{a.material}</TableCell>
                            <TableCell className="py-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                aria-label={`Remove ${a.accessory}`}
                                onClick={() => set("accessories", form.accessories.filter((x) => x.id !== a.id))}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </SectionCard>
            </div>

            <SectionCard title="Comments" description="Newest first.">
              <div className="grid items-end gap-2 sm:grid-cols-6">
                <Field label="Type">
                  <Select value={commentDraft.type} onValueChange={(v) => setCommentDraft({ ...commentDraft, type: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{COMMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Comment" htmlFor="comment" className="sm:col-span-4">
                  <Textarea id="comment" className="min-h-[40px] text-sm" value={commentDraft.comment} onChange={(e) => setCommentDraft({ ...commentDraft, comment: e.target.value })} />
                </Field>
                <Button size="sm" className="h-9 gap-1 text-xs" onClick={addComment} disabled={!commentDraft.comment.trim()}>
                  <MessageSquarePlus className="h-3.5 w-3.5" /> Add Comment
                </Button>
              </div>

              {form.comments.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">No comments yet.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {form.comments.map((c) => (
                    <div key={c.id} className="rounded-md border border-border p-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Badge variant="outline" className="rounded-full border-transparent bg-muted px-2 py-0.5 text-[10px]">{c.type}</Badge>
                        <span>{c.entered}</span>
                        <span>·</span>
                        <span>{c.user}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-xs text-foreground">{c.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </TabsContent>

          {/* -------------------------------------------------- MAINTENANCE */}
          <TabsContent value="maintenance" className="mt-4 space-y-4">
            <SectionCard
              title="Maintenance Schedule"
              description="Preventive maintenance and interim checks for this standard."
              action={
                <Button size="sm" className="h-8 gap-1 text-xs" onClick={() => setCheckOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Add Maintenance Check
                </Button>
              }
            >
              {form.maintenance.length === 0 ? (
                <p className="text-xs text-muted-foreground">No maintenance checks scheduled.</p>
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {["Check Type", "Frequency", "Last Completed", "Next Due", "Assigned To", "Status", "Notes", ""].map((h) => (
                          <TableHead key={h} className="text-xs font-semibold">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form.maintenance.map((m) => (
                        <TableRow key={m.id} className="text-xs">
                          <TableCell className="py-1.5 font-medium">{m.checkType}</TableCell>
                          <TableCell className="py-1.5">{m.frequency}</TableCell>
                          <TableCell className="py-1.5">{m.lastCompleted || "—"}</TableCell>
                          <TableCell className="py-1.5">{m.nextDue || "—"}</TableCell>
                          <TableCell className="py-1.5">{m.assignedTo || "—"}</TableCell>
                          <TableCell className="py-1.5"><MaintenanceStatusBadge status={m.status} /></TableCell>
                          <TableCell className="py-1.5 max-w-[280px] text-muted-foreground">{m.notes || "—"}</TableCell>
                          <TableCell className="py-1.5">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast(`${m.checkType} — ${m.status}`)}>View</Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  set("maintenance", form.maintenance.map((x) => (x.id === m.id ? { ...x, status: "Completed", lastCompleted: new Date().toLocaleDateString("en-US") } : x)));
                                  toast.success("Check marked completed.");
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                aria-label={`Delete ${m.checkType}`}
                                onClick={() => setDeleteCheck(m.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </SectionCard>
          </TabsContent>

          {/* ------------------------------------------------------ HISTORY */}
          <TabsContent value="history" className="mt-4 space-y-4">
            <SectionCard
              title="Work Order History"
              action={
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => toast.success("History export started.")}>
                  <Download className="h-3.5 w-3.5" /> Export History
                </Button>
              }
            >
              {form.history.length === 0 ? (
                <p className="text-xs text-muted-foreground">No work order history yet.</p>
              ) : (
                <>
                  <div className="mb-3 grid gap-2 sm:grid-cols-4">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        aria-label="Search work order number"
                        placeholder="Work Order #"
                        className="h-9 pl-8 text-sm"
                        value={hQuery}
                        onChange={(e) => { setHQuery(e.target.value); setHPage(1); }}
                      />
                    </div>
                    <Select value={hCondition} onValueChange={(v) => { setHCondition(v); setHPage(1); }}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Condition" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All conditions</SelectItem>
                        <SelectItem value="In Tolerance">In Tolerance</SelectItem>
                        <SelectItem value="Out of Tolerance">Out of Tolerance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input aria-label="Date from" placeholder="From MM/DD/YYYY" className="h-9 text-sm" />
                    <Input aria-label="Date to" placeholder="To MM/DD/YYYY" className="h-9 text-sm" />
                  </div>

                  <div className="overflow-x-auto rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {([
                            ["Work Order #", "workOrderNo"],
                            ["Certification Date", "certificationDate"],
                            ["Recalibration Date", "recalibrationDate"],
                          ] as const).map(([label, key]) => (
                            <TableHead key={key} className="text-xs font-semibold">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1"
                                onClick={() => setHSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }))}
                              >
                                {label}
                                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                              </button>
                            </TableHead>
                          ))}
                          <TableHead className="text-xs font-semibold">Completion Date</TableHead>
                          <TableHead className="text-xs font-semibold">Condition In</TableHead>
                          <TableHead className="text-xs font-semibold">Condition Out</TableHead>
                          <TableHead className="text-xs font-semibold">Repair Comments</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historyRows.slice((hPage - 1) * H_SIZE, hPage * H_SIZE).map((h) => (
                          <TableRow key={h.workOrderNo} className="text-xs">
                            <TableCell className="py-1.5">
                              <Link to="/" className="font-medium text-foreground underline-offset-2 hover:underline">
                                {h.workOrderNo}
                              </Link>
                            </TableCell>
                            <TableCell className="py-1.5">{h.certificationDate}</TableCell>
                            <TableCell className="py-1.5">{h.recalibrationDate}</TableCell>
                            <TableCell className="py-1.5">{h.completionDate}</TableCell>
                            <TableCell className="py-1.5">{h.conditionIn}</TableCell>
                            <TableCell className="py-1.5">{h.conditionOut}</TableCell>
                            <TableCell className="py-1.5 max-w-[420px] text-muted-foreground">{h.repairComments}</TableCell>
                          </TableRow>
                        ))}
                        {historyRows.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                              No work orders match these filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-2 text-xs">
                    <span className="text-muted-foreground">
                      Page {hPage} of {Math.max(1, Math.ceil(historyRows.length / H_SIZE))}
                    </span>
                    <Button variant="outline" size="sm" className="h-7" disabled={hPage === 1} onClick={() => setHPage(hPage - 1)}>Previous</Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7"
                      disabled={hPage >= Math.ceil(historyRows.length / H_SIZE)}
                      onClick={() => setHPage(hPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </SectionCard>
          </TabsContent>
        </Tabs>
      </main>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white px-4 py-2.5 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] lg:pl-[var(--sidebar-width,16rem)]">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-9 gap-1.5 text-sm" onClick={() => guardedNavigate("/standards")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="outline" className="h-9 text-sm" onClick={() => guardedNavigate("/standards")}>
              Cancel
            </Button>
            <Button className="h-9 text-sm" onClick={handleSave}>
              {isNew ? "Save Standard" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Move standard */}
      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move Standard</DialogTitle>
            <DialogDescription>Confirm the new designated location for standard {form.standardNo}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md border border-border bg-muted/30 p-2.5 text-xs">
              <div className="text-muted-foreground">Current Location</div>
              <div className="font-medium text-foreground">
                {[form.lab, form.division, form.labArea].filter(Boolean).join(" · ") || "—"}
              </div>
            </div>
            <Field label="New Location">
              <Select value={move.lab} onValueChange={(v) => setMove({ ...move, lab: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select lab" /></SelectTrigger>
                <SelectContent>{LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Division">
              <Select value={move.division} onValueChange={(v) => setMove({ ...move, division: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select division" /></SelectTrigger>
                <SelectContent>{DIVISIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Lab Area">
              <Select value={move.labArea} onValueChange={(v) => setMove({ ...move, labArea: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent>{LAB_AREAS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                set("lab", move.lab);
                set("division", move.division);
                set("labArea", move.labArea);
                setMoveOpen(false);
                toast.success("Move initiated.");
              }}
            >
              Confirm Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add maintenance check */}
      <Dialog open={checkOpen} onOpenChange={setCheckOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Maintenance Check</DialogTitle>
            <DialogDescription>Schedule a preventive maintenance or interim check.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Check Type">
              <Select value={checkDraft.checkType} onValueChange={(v) => setCheckDraft({ ...checkDraft, checkType: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{CHECK_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Frequency">
              <Select value={checkDraft.frequency} onValueChange={(v) => setCheckDraft({ ...checkDraft, frequency: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{["Monthly", "Quarterly", "Semi-Annual", "Annual"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Last Completed" htmlFor="mc-last"><Input id="mc-last" placeholder="MM/DD/YYYY" className="h-9 text-sm" value={checkDraft.lastCompleted} onChange={(e) => setCheckDraft({ ...checkDraft, lastCompleted: e.target.value })} /></Field>
            <Field label="Next Due" htmlFor="mc-next"><Input id="mc-next" placeholder="MM/DD/YYYY" className="h-9 text-sm" value={checkDraft.nextDue} onChange={(e) => setCheckDraft({ ...checkDraft, nextDue: e.target.value })} /></Field>
            <Field label="Assigned To" htmlFor="mc-who"><Input id="mc-who" className="h-9 text-sm" value={checkDraft.assignedTo} onChange={(e) => setCheckDraft({ ...checkDraft, assignedTo: e.target.value })} /></Field>
            <Field label="Notes" htmlFor="mc-notes" className="sm:col-span-2">
              <Textarea id="mc-notes" className="min-h-[60px] text-sm" value={checkDraft.notes} onChange={(e) => setCheckDraft({ ...checkDraft, notes: e.target.value })} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                set("maintenance", [
                  ...form.maintenance,
                  { id: `mc-${Date.now()}`, ...checkDraft, status: "Scheduled" as const },
                ]);
                setCheckOpen(false);
                setCheckDraft({ checkType: CHECK_TYPES[0], frequency: "Quarterly", lastCompleted: "", nextDue: "", assignedTo: "", notes: "" });
                toast.success("Maintenance check added.");
              }}
            >
              Add Check
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete maintenance confirmation */}
      <AlertDialog open={!!deleteCheck} onOpenChange={(o) => !o && setDeleteCheck(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete maintenance check?</AlertDialogTitle>
            <AlertDialogDescription>This removes the scheduled check. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                set("maintenance", form.maintenance.filter((m) => m.id !== deleteCheck));
                setDeleteCheck(null);
                toast.success("Maintenance check deleted.");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unsaved changes */}
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>You have unsaved changes. Are you sure you want to leave?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setLeaveOpen(false);
                setDirty(false);
                if (pendingNav) navigate(pendingNav);
              }}
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StandardDetail;
