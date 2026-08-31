import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useSchedulingData } from "@/context/SchedulingDataContext";
import {
  JOB_STATUS_STYLES,
  ScheduledJob,
  formatShort,
  getTechnicianConflicts,
} from "@/lib/onsite/schedulingData";
import TechnicianRosterPicker from "./TechnicianRosterPicker";

interface Props {
  job: ScheduledJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OSR_META = {
  ok: { label: "OSR on file", cls: "text-emerald-700 bg-emerald-50 border-emerald-300", Icon: ShieldCheck },
  expired: { label: "OSR expired", cls: "text-amber-800 bg-amber-50 border-amber-300", Icon: ShieldAlert },
  missing: { label: "OSR missing", cls: "text-red-700 bg-red-50 border-red-300", Icon: ShieldAlert },
} as const;

export const JobQuickView = ({ job, open, onOpenChange }: Props) => {
  const { jobs, entries, technicians, updateJob } = useSchedulingData();
  const [reassigning, setReassigning] = useState(false);
  const [draftTechs, setDraftTechs] = useState<string[]>([]);

  useEffect(() => {
    if (open && job) {
      setReassigning(false);
      setDraftTechs(job.technicianIds);
    }
  }, [open, job]);

  if (!job) return null;

  const osr = OSR_META[job.osrStatus];
  const assigned = technicians.filter((t) => job.technicianIds.includes(t.id));
  const conflicts = getTechnicianConflicts(
    job.technicianIds,
    job.startDate,
    job.endDate,
    jobs,
    entries,
    { excludeJobId: job.id },
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:max-w-[420px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-sm flex items-center gap-2">
            {job.projectNumber}
            <Badge variant="outline" className={`text-[10px] ${JOB_STATUS_STYLES[job.status]}`}>
              {job.status}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto space-y-3 py-2">
          <div className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[11px] ${osr.cls}`}>
            <osr.Icon className="h-3.5 w-3.5" />
            {osr.label}
            {job.osrStatus !== "ok" && " — scheduling is still allowed."}
          </div>

          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            <div>
              <dt className="text-muted-foreground">Dates</dt>
              <dd className="font-medium">
                {formatShort(job.startDate)} – {formatShort(job.endDate)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Account #</dt>
              <dd className="font-medium">{job.accountNumber}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="font-medium">{job.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Division</dt>
              <dd className="font-medium">{job.division}</dd>
            </div>
          </dl>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              Customers ({job.customers.length})
            </p>
            <ul className="space-y-0.5 text-[11px]">
              {job.customers.map((c) => (
                <li key={c} className="rounded bg-muted/60 px-2 py-1">{c}</li>
              ))}
            </ul>
          </div>

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

          {!reassigning ? (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                Technicians ({assigned.length})
              </p>
              {assigned.length === 0 ? (
                <p className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
                  No technicians assigned to this job.
                </p>
              ) : (
                <ul className="space-y-0.5 text-[11px]">
                  {assigned.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 rounded bg-muted/60 px-2 py-1">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-[9px] font-semibold">
                        {t.initials}
                      </span>
                      {t.name}
                      <span className="ml-auto text-muted-foreground">{t.location}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <TechnicianRosterPicker
              selected={draftTechs}
              onChange={setDraftTechs}
              startDate={job.startDate}
              endDate={job.endDate}
              excludeJobId={job.id}
            />
          )}

          {job.notes && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Notes</p>
              <p className="text-[11px] text-muted-foreground">{job.notes}</p>
            </div>
          )}
        </div>

        <SheetFooter className="flex-row justify-end gap-2">
          {reassigning ? (
            <>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setReassigning(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  updateJob(job.id, { technicianIds: draftTechs });
                  setReassigning(false);
                  toast({ variant: "success", title: "Technicians updated.", duration: 2000 });
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setReassigning(true)}>
              Reassign technicians
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default JobQuickView;
