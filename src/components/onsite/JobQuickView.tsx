import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, MapPin, MessageSquarePlus, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useSchedulingData } from "@/context/SchedulingDataContextV2";
import {
  JOB_STATUS_STYLES,
  ScheduledJob,
  getTechnicianConflicts,
} from "@/lib/onsite/schedulingData";

interface Props {
  job: ScheduledJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VEHICLES = ["Unassigned", "Service Truck 1", "Service Truck 2", "Van 3", "Van 4"];
const LABS = ["Select Lab", "Baton Rouge Lab", "Houston Lab", "Canada Lab"];
const ROLES = ["No role", "Lead Technician", "Technician", "Apprentice", "Safety Watch"];

const READINESS_STYLES: Record<string, string> = {
  Green: "bg-emerald-500 text-white",
  Yellow: "bg-amber-400 text-amber-950",
  Red: "bg-red-500 text-white",
};

interface CustomerRow {
  name: string;
  cityState: string;
  accountNumber: string;
  po: boolean;
  conf: boolean;
  sr: string;
  osr: string;
  quote: string;
  wo: string;
}

interface TechRow {
  id: string;
  role: string;
  comments: string;
  travelIn: string;
  travelOut: string;
  production: string;
}

const Section = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <div className="border-t pt-2.5 space-y-1.5">
    <div className="flex items-center justify-between">
      <p className="text-[11px] font-semibold">{title}</p>
      {action}
    </div>
    {children}
  </div>
);

export const JobQuickView = ({ job, open, onOpenChange }: Props) => {
  const { jobs, entries, technicians, updateJob } = useSchedulingData();
  const [vehicle, setVehicle] = useState("Unassigned");
  const [lab, setLab] = useState("Select Lab");
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [techRows, setTechRows] = useState<TechRow[]>([]);
  const [addCustomer, setAddCustomer] = useState("");
  const [addTech, setAddTech] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);

  useEffect(() => {
    if (!open || !job) return;
    setVehicle("Unassigned");
    setLab("Select Lab");
    setAddCustomer("");
    setAddTech("");
    setComment("");
    setComments([]);
    setSuggestOpen(false);
    setCustomers(
      job.customers.map((c, i) => ({
        name: c,
        cityState: `${job.location}, ${job.location === "Canada" ? "ON" : job.location === "Houston" ? "TX" : "LA"}`,
        accountNumber: job.accountNumber,
        po: job.osrStatus === "ok",
        conf: job.osrStatus === "ok",
        sr: `SR1${String(i + 8).padStart(3, "0")}`,
        osr: `OSR00${job.accountNumber.replace(/\D/g, "").slice(0, 4) || "2588"}`,
        quote: `QT2${String(i + 8).padStart(3, "0")}`,
        wo: `WO3${String(i + 8).padStart(3, "0")}`,
      })),
    );
    setTechRows(
      job.technicianIds.map((id) => ({
        id,
        role: "No role",
        comments: "",
        travelIn: "0",
        travelOut: "0",
        production: "8",
      })),
    );
  }, [open, job]);

  const readiness = useMemo(() => {
    if (customers.length === 0) return "Red";
    if (customers.every((c) => c.po && c.conf)) return "Green";
    if (customers.some((c) => c.po || c.conf)) return "Yellow";
    return "Red";
  }, [customers]);

  if (!job) return null;

  const conflicts = getTechnicianConflicts(
    techRows.map((t) => t.id),
    job.startDate,
    job.endDate,
    jobs,
    entries,
    { excludeJobId: job.id },
  );

  const availableTechs = technicians.filter((t) => !techRows.some((r) => r.id === t.id));
  const freeCount = availableTechs.length;

  const patchTech = (id: string, patch: Partial<TechRow>) =>
    setTechRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2 space-y-1">
          <DialogTitle className="text-base font-semibold">Job {job.projectNumber}</DialogTitle>
          <p className="text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Dates:</span> {job.startDate} – {job.endDate}
            {" · "}
            <span className="font-medium text-foreground">Location/Division:</span> {job.location} / {job.division}
          </p>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-auto px-4 pb-3 space-y-2.5">
          {/* Readiness */}
          <div className="border-t pt-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold">Readiness</p>
              <Badge className={`text-[10px] rounded-full ${READINESS_STYLES[readiness]}`}>{readiness}</Badge>
            </div>
            <p className="text-[10.5px] text-muted-foreground mt-0.5">
              Automatically derived from PO Received + Confirmed on every account below — not set directly, and shown regardless of Status.
            </p>
          </div>

          {/* Status */}
          <div className="border-t pt-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold">Status</p>
              <Badge variant="outline" className={`text-[10px] rounded-full ${JOB_STATUS_STYLES[job.status]}`}>
                {job.status}
              </Badge>
            </div>
            <p className="text-[10.5px] text-muted-foreground mt-0.5">
              {job.status} is a manual override made in the real Detail page, not editable here.
            </p>
          </div>

          {/* Vehicle */}
          <Section title="Vehicle">
            <Select value={vehicle} onValueChange={setVehicle}>
              <SelectTrigger className="h-7 text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VEHICLES.map((v) => (
                  <SelectItem key={v} value={v} className="text-[11px]">{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              onClick={() => setSuggestOpen((s) => !s)}
              className="w-full rounded-md border border-dashed border-sky-300 bg-sky-50/60 px-2 py-1.5 text-left"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${suggestOpen ? "rotate-90" : ""}`} />
                <MapPin className="h-3.5 w-3.5 text-sky-600" />
                Suggest a van by location
                <Badge variant="outline" className="text-[9px] border-amber-400 text-amber-700 bg-amber-50">
                  STAND-IN DATA
                </Badge>
              </div>
              <p className="pl-6 text-[10.5px] text-muted-foreground">
                Closest available: <span className="font-medium text-foreground">Service Truck 1</span> · ~0 mi
                straight-line from {job.location} to {job.location} · {freeCount} technicians free
              </p>
              {suggestOpen && (
                <ul className="pl-6 pt-1 space-y-0.5 text-[10.5px] text-muted-foreground">
                  <li>Service Truck 1 · {job.location} · ~0 mi</li>
                  <li>Service Truck 2 · Houston · ~120 mi</li>
                  <li>Van 3 · Canada · ~1,400 mi</li>
                </ul>
              )}
            </button>
          </Section>

          {/* Customers */}
          <Section title={`Customer(s)`}>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-[11px]">
                <thead className="bg-muted/60 text-[9.5px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="w-6" />
                    <th className="px-2 py-1 text-left">Customer</th>
                    <th className="px-2 py-1 text-left">City/State</th>
                    <th className="px-2 py-1 text-left">Acct #</th>
                    <th className="px-2 py-1 text-left">PO</th>
                    <th className="px-2 py-1 text-left">Conf</th>
                    <th className="px-2 py-1 text-left">SR#</th>
                    <th className="px-2 py-1 text-left">OSR#</th>
                    <th className="px-2 py-1 text-left">Quote#</th>
                    <th className="px-2 py-1 text-left">WO#</th>
                    <th className="w-6" />
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={`${c.name}-${i}`} className="border-t">
                      <td className="px-1 text-muted-foreground"><ChevronRight className="h-3 w-3" /></td>
                      <td className="px-2 py-1 font-medium">{c.name}</td>
                      <td className="px-2 py-1">{c.cityState}</td>
                      <td className="px-2 py-1">{c.accountNumber}</td>
                      <td className="px-2 py-1">
                        <Checkbox
                          checked={c.po}
                          onCheckedChange={(v) =>
                            setCustomers((prev) => prev.map((r, j) => (j === i ? { ...r, po: !!v } : r)))
                          }
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Checkbox
                          checked={c.conf}
                          onCheckedChange={(v) =>
                            setCustomers((prev) => prev.map((r, j) => (j === i ? { ...r, conf: !!v } : r)))
                          }
                        />
                      </td>
                      <td className="px-2 py-1 text-blue-600">{c.sr}</td>
                      <td className="px-2 py-1 text-blue-600 underline">{c.osr}</td>
                      <td className="px-2 py-1 text-blue-600">{c.quote}</td>
                      <td className="px-2 py-1 text-blue-600">{c.wo}</td>
                      <td className="px-1">
                        <button
                          type="button"
                          aria-label={`Remove ${c.name}`}
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setCustomers((prev) => prev.filter((_, j) => j !== i))}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan={11} className="px-2 py-2 text-[11px] text-muted-foreground">No customers on this job.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-muted-foreground">
              SR#/Quote#/Work Order# are placeholder links — they'll connect to stored records in a future update.
            </p>
            <div className="flex gap-2">
              <Input
                value={addCustomer}
                onChange={(e) => setAddCustomer(e.target.value)}
                placeholder="Add a customer..."
                className="h-7 text-[11px]"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                disabled={!addCustomer.trim()}
                onClick={() => {
                  setCustomers((prev) => [
                    ...prev,
                    {
                      name: addCustomer.trim(),
                      cityState: job.location,
                      accountNumber: job.accountNumber,
                      po: false,
                      conf: false,
                      sr: "SR—",
                      osr: "OSR—",
                      quote: "QT—",
                      wo: "WO—",
                    },
                  ]);
                  setAddCustomer("");
                }}
              >
                Add
              </Button>
            </div>
          </Section>

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1.5 space-y-1">
              {conflicts.map((c, i) => {
                const tech = technicians.find((t) => t.id === c.technicianId);
                return (
                  <div key={i} className="flex items-start gap-1.5 text-[10.5px] text-amber-900">
                    <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>
                      <span className="font-medium">{tech?.name}</span> overlaps {c.label} ({c.range}).
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Technicians */}
          <Section
            title="Technicians"
            action={
              <div className="flex items-center gap-1.5">
                <Select value={addTech} onValueChange={setAddTech}>
                  <SelectTrigger className="h-7 w-[170px] text-[11px]">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTechs.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="text-[11px]">{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px] gap-1"
                  disabled={!addTech}
                  onClick={() => {
                    setTechRows((prev) => [
                      ...prev,
                      { id: addTech, role: "No role", comments: "", travelIn: "0", travelOut: "0", production: "8" },
                    ]);
                    setAddTech("");
                  }}
                >
                  <Plus className="h-3 w-3" /> Add Technician
                </Button>
              </div>
            }
          >
            {techRows.length === 0 && (
              <p className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
                No technicians assigned to this job.
              </p>
            )}
            {techRows.map((row) => {
              const t = technicians.find((x) => x.id === row.id);
              return (
                <div key={row.id} className="rounded-md border p-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold">{t?.name}</span>
                    <span className="ml-auto text-[10.5px] text-muted-foreground">{t?.location}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${t?.name}`}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setTechRows((prev) => prev.filter((r) => r.id !== row.id))}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Role</p>
                      <Select value={row.role} onValueChange={(v) => patchTech(row.id, { role: v })}>
                        <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r} className="text-[11px]">{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Comments</p>
                      <Input
                        className="h-7 text-[11px]"
                        value={row.comments}
                        onChange={(e) => patchTech(row.id, { comments: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ["Travel in (hrs)", "travelIn"],
                      ["Travel out (hrs)", "travelOut"],
                      ["Production (hrs)", "production"],
                    ] as const).map(([label, key]) => (
                      <div key={key}>
                        <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                        <Input
                          className="h-7 text-[11px]"
                          value={row[key]}
                          onChange={(e) => patchTech(row.id, { [key]: e.target.value } as Partial<TechRow>)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Section>

          {/* Managing Lab */}
          <Section title="Managing Lab">
            <Select value={lab} onValueChange={setLab}>
              <SelectTrigger className="h-7 w-1/2 text-[11px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LABS.map((l) => (
                  <SelectItem key={l} value={l} className="text-[11px]">{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Section>

          {/* Comments */}
          <Section title="Comments">
            {comments.length > 0 && (
              <ul className="space-y-0.5 text-[11px]">
                {comments.map((c, i) => (
                  <li key={i} className="rounded bg-muted/60 px-2 py-1">{c}</li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (this session only)..."
                className="min-h-[52px] text-[11px]"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] gap-1"
                disabled={!comment.trim()}
                onClick={() => {
                  setComments((prev) => [...prev, comment.trim()]);
                  setComment("");
                }}
              >
                <MessageSquarePlus className="h-3 w-3" /> Add
              </Button>
            </div>
          </Section>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 border-t px-4 py-2.5">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              updateJob(job.id, {
                technicianIds: techRows.map((r) => r.id),
                customers: customers.map((c) => c.name),
              });
              onOpenChange(false);
              toast({ variant: "success", title: "Job updated.", duration: 2000 });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobQuickView;
