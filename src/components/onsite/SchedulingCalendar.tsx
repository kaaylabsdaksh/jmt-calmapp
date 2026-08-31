import { useMemo, useState } from "react";
import { AlertTriangle, CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useSchedulingData } from "@/context/SchedulingDataContextV2";
import {
  ANCHOR_DATE,
  JOB_STATUS_STYLES,
  NON_SERVICE_STYLES,
  NonServiceEntry,
  ScheduledJob,
  formatShort,
  jobHasTechnicianConflict,
  parseISO,
  toISO,
} from "@/lib/onsite/schedulingData";
import JobQuickView from "./JobQuickView";
import NonServiceEntryDialog from "./NonServiceEntryDialog";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const buildMonthGrid = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

export const SchedulingCalendar = () => {
  const { jobs, entries, technicians } = useSchedulingData();
  const anchor = parseISO(ANCHOR_DATE);
  const [cursor, setCursor] = useState(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
  const [hideCompleted, setHideCompleted] = useState(false);
  const [quickViewJob, setQuickViewJob] = useState<ScheduledJob | null>(null);
  const [dayDetail, setDayDetail] = useState<string | null>(null);
  const [entryDialog, setEntryDialog] = useState<{ entry: NonServiceEntry | null; date: string } | null>(null);

  const days = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  const visibleJobs = useMemo(
    () => jobs.filter((j) => !(hideCompleted && (j.status === "Completed" || j.status === "Cancelled"))),
    [jobs, hideCompleted],
  );

  const jobsOn = (iso: string) =>
    visibleJobs.filter((j) => j.startDate <= iso && iso <= j.endDate);
  const entriesOn = (iso: string) =>
    entries.filter((e) => e.startDate <= iso && iso <= e.endDate);

  const techInitials = (ids: string[]) =>
    technicians.filter((t) => ids.includes(t.id)).map((t) => t.initials).join(" ");

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const shiftMonth = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="min-w-[150px] text-center text-xs font-semibold">{monthLabel}</div>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => shiftMonth(1)} aria-label="Next month">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[11px] ml-1"
            onClick={() => setCursor(new Date(anchor.getFullYear(), anchor.getMonth(), 1))}
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <Switch id="hide-completed" checked={hideCompleted} onCheckedChange={setHideCompleted} />
          <Label htmlFor="hide-completed" className="text-[11px]">Hide completed &amp; cancelled</Label>
        </div>

        <Button
          size="sm"
          className="h-7 text-[11px] gap-1"
          onClick={() => setEntryDialog({ entry: null, date: ANCHOR_DATE })}
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Non-service entry
        </Button>
      </div>

      {/* Status / event-type legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border bg-muted/30 px-2 py-1.5 text-[10px]">
        <span className="font-semibold uppercase tracking-wide text-muted-foreground">Legend</span>
        {(Object.keys(JOB_STATUS_STYLES) as (keyof typeof JOB_STATUS_STYLES)[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1">
            <span className={cn("h-2.5 w-4 rounded-sm border", JOB_STATUS_STYLES[s])} />
            {s}
          </span>
        ))}
        <span className="mx-1 h-3 w-px bg-border" />
        {(Object.keys(NON_SERVICE_STYLES) as (keyof typeof NON_SERVICE_STYLES)[]).map((t) => (
          <span key={t} className="inline-flex items-center gap-1">
            <span className={cn("h-2.5 w-4 rounded-sm border", NON_SERVICE_STYLES[t])} />
            {t}
          </span>
        ))}
        <span className="mx-1 h-3 w-px bg-border" />
        <span className="inline-flex items-center gap-1">
          <AlertTriangle className="h-3 w-3 text-amber-600" /> Technician double-booked
        </span>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-md border bg-border overflow-hidden">

        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-muted px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {d}
          </div>
        ))}

        {days.map((d) => {
          const iso = toISO(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = iso === ANCHOR_DATE;
          const dayJobs = jobsOn(iso);
          const dayEntries = entriesOn(iso);
          const shownJobs = dayJobs.slice(0, 2);
          const shownEntries = dayEntries.slice(0, Math.max(0, 3 - shownJobs.length));
          const overflow =
            dayJobs.length + dayEntries.length - shownJobs.length - shownEntries.length;

          return (
            <div
              key={iso}
              className={cn(
                "bg-background min-h-[92px] p-1 space-y-0.5 text-left align-top",
                !inMonth && "bg-muted/40",
              )}
            >
              <button
                type="button"
                onClick={() => setDayDetail(iso)}
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold hover:bg-muted",
                  isToday && "bg-primary text-primary-foreground",
                  !inMonth && "text-muted-foreground",
                )}
              >
                {d.getDate()}
              </button>

              {shownJobs.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setQuickViewJob(j)}
                  className={cn(
                    "w-full truncate rounded border px-1 py-0.5 text-left text-[10px]",
                    JOB_STATUS_STYLES[j.status],
                  )}
                  title={`${j.projectNumber} — ${j.customers.join(", ")}`}
                >
                  {jobHasTechnicianConflict(j, jobs, entries) && (
                    <AlertTriangle className="inline h-2.5 w-2.5 mr-0.5 -mt-0.5" />
                  )}
                  {j.projectNumber} · {techInitials(j.technicianIds) || "—"}
                </button>
              ))}

              {shownEntries.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEntryDialog({ entry: e, date: iso })}
                  className={cn(
                    "w-full truncate rounded border px-1 py-0.5 text-left text-[10px]",
                    NON_SERVICE_STYLES[e.type],
                  )}
                >
                  {e.type} · {techInitials(e.technicianIds)}
                </button>
              ))}

              {overflow > 0 && (
                <button
                  type="button"
                  onClick={() => setDayDetail(iso)}
                  className="text-[10px] text-muted-foreground hover:underline"
                >
                  +{overflow} more
                </button>
              )}
            </div>
          );
        })}
      </div>

      <JobQuickView job={quickViewJob} open={!!quickViewJob} onOpenChange={(o) => !o && setQuickViewJob(null)} />

      <NonServiceEntryDialog
        open={!!entryDialog}
        onOpenChange={(o) => !o && setEntryDialog(null)}
        entry={entryDialog?.entry ?? null}
        defaultDate={entryDialog?.date ?? ANCHOR_DATE}
      />

      {/* Day drill-down */}
      <Dialog open={!!dayDetail} onOpenChange={(o) => !o && setDayDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {dayDetail && parseISO(dayDetail).toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 max-h-[60vh] overflow-auto">
            {dayDetail && jobsOn(dayDetail).length === 0 && entriesOn(dayDetail).length === 0 && (
              <p className="text-[11px] text-muted-foreground">Nothing scheduled on this day.</p>
            )}
            {dayDetail && jobsOn(dayDetail).map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => { setDayDetail(null); setQuickViewJob(j); }}
                className={cn("w-full rounded border px-2 py-1.5 text-left text-[11px]", JOB_STATUS_STYLES[j.status])}
              >
                <div className="font-semibold">
                  {j.projectNumber} — {j.customers.join(", ")}
                </div>
                <div className="opacity-80">
                  {formatShort(j.startDate)} – {formatShort(j.endDate)} · {j.location} ·{" "}
                  {techInitials(j.technicianIds) || "no technicians"}
                </div>
              </button>
            ))}
            {dayDetail && entriesOn(dayDetail).map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => { setDayDetail(null); setEntryDialog({ entry: e, date: dayDetail }); }}
                className={cn("w-full rounded border px-2 py-1.5 text-left text-[11px]", NON_SERVICE_STYLES[e.type])}
              >
                <div className="font-semibold">{e.type}</div>
                <div className="opacity-80">
                  {formatShort(e.startDate)} – {formatShort(e.endDate)} · {techInitials(e.technicianIds)}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] gap-1"
              onClick={() => { setEntryDialog({ entry: null, date: dayDetail! }); setDayDetail(null); }}
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Add non-service entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulingCalendar;
