/**
 * PROTOTYPE ONLY — Calendar View. Month grid with continuous multi-day
 * spanning bars (FRD §6.2 US-1/US-2) plus the four non-service entry types
 * (§6.4 US-2) rendered as visually distinct blocks alongside jobs.
 *
 * Lane layout: each bar's vertical row is assigned once across the whole
 * visible month (not re-computed per week), so a job spanning several weeks
 * stays in the same row the whole way across — this is what keeps an
 * 8-10 day Canada-style job reading as one continuous span rather than
 * jumping rows at week boundaries.
 *
 * Job bars open the real, shared JobDetailDialog (D19) — the same component
 * List's project-number click opens for these mock jobs (see
 * SchedulingShell.tsx and JobDetailDialog.tsx). Previously this opened a
 * Calendar-only "Quick View" dialog and only on double-click, an
 * inconsistency with non-service bars flagged (unfixed) as D14 — both are
 * fixed as part of D19.
 */
import React, { useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  PauseCircle,
  Plus,
  UserX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSchedulingData } from '@/context/SchedulingDataContext';
import { useOpenDecisions } from '@/context/OpenDecisionsContext';
import {
  NON_SERVICE_ENTRY_TYPES,
  type NonServiceEntry,
  type ScheduledJob,
} from '@/lib/onsite-scheduling/types';
import { jobHasTechnicianConflict, rangesOverlap } from '@/lib/onsite-scheduling/conflict-check';
import {
  deriveAutoStatus,
  LIFECYCLE_BADGE_STYLES,
  READINESS_FILL,
  resolveLifecycleStatus,
  type LifecycleStatus,
} from '@/lib/onsite-scheduling/job-status';
import {
  ALL_FILTER,
  EMPTY_FILTERS,
  useSavedViews,
  type CalendarFilters,
  type SavedView,
} from '@/lib/onsite-scheduling/saved-views';
import CalendarFilterBar from './CalendarFilterBar';
import CalendarViewsMenu from './CalendarViewsMenu';
import DecisionTag from './DecisionTag';
import NonServiceEntryDialog from './NonServiceEntryDialog';
import NewEntryChooser from './NewEntryChooser';
import NewJobDialog from './NewJobDialog';

type BarItem =
  | { kind: 'job'; id: string; startDate: string; endDate: string; job: ScheduledJob }
  | {
      kind: 'non-service';
      id: string;
      startDate: string;
      endDate: string;
      entry: NonServiceEntry;
    };

import SchedulingLegend, { NON_SERVICE_STYLES } from './SchedulingLegend';


/** D28 — a job bar's fill is Readiness (Red/Green/Partial), always; On
 * Hold/Completed/Cancelled are a separate axis (Status) layered on TOP as
 * an overlay treatment, not a fill-color swap — so a bar never silently
 * hides its real PO/Confirmed readiness behind a lifecycle color.
 *
 * Takes readiness/lifecycle as params rather than deriving them from `job`
 * itself — every call site already computes both for its own use (the
 * conflict/OSR icons, the title tooltip), so recomputing a third time here
 * was pure waste. */
function jobBarClasses(
  readiness: 'Red' | 'Green' | 'Partial',
  lifecycle: LifecycleStatus
): string {
  const overlay =
    lifecycle === 'On Hold'
      ? 'border-dashed border-2 border-slate-600 opacity-90'
      : lifecycle === 'Completed'
        ? 'opacity-50 line-through'
        : lifecycle === 'Cancelled'
          ? 'opacity-40 line-through'
          : '';
  return cn(READINESS_FILL[readiness], overlay);
}

function toIso(d: Date) {
  return format(d, 'yyyy-MM-dd');
}

/** Greedy interval-graph lane assignment across the whole visible range, so
 * an item keeps the same lane every week it appears in. */
function assignLanes(items: BarItem[]): Map<string, number> {
  const sorted = [...items].sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
  const laneEnds: string[] = [];
  const laneOf = new Map<string, number>();
  for (const item of sorted) {
    let lane = laneEnds.findIndex((end) => end < item.startDate);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(item.endDate);
    } else {
      laneEnds[lane] = item.endDate;
    }
    laneOf.set(item.id, lane);
  }
  return laneOf;
}

/** Does a job pass the current filter set? Extracted so the "how many are
 * hidden" count and the render list can't drift apart — two copies of this
 * predicate is exactly how a board starts lying about what it's showing. */
function jobMatchesFilters(
  job: ScheduledJob,
  filters: CalendarFilters,
  search: string
): boolean {
  if (filters.location !== ALL_FILTER && job.location !== filters.location) return false;
  if (filters.division !== ALL_FILTER && job.division !== filters.division) return false;
  if (
    filters.technicianId !== ALL_FILTER &&
    !job.technicianIds.includes(filters.technicianId)
  )
    return false;
  if (
    filters.readiness !== ALL_FILTER &&
    deriveAutoStatus(job.accounts) !== filters.readiness
  )
    return false;
  if (filters.hideCompleted && (job.status === 'Completed' || job.status === 'Cancelled'))
    return false;
  if (search) {
    const haystack = [job.projectNumber, ...job.accounts.map((a) => a.customerName)]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  return true;
}

const CalendarView: React.FC = () => {
  const { jobs, nonServiceEntries, technicians, openJobDetail } = useSchedulingData();
  const { highlightedAnchorId } = useOpenDecisions();
  const [month, setMonth] = useState(() => startOfMonth(new Date('2026-08-11')));
  // D30/D31 (built 2026-08-19) — Calendar had no filters at all before this
  // while List had six, so "show me just Canada" meant leaving the board.
  const savedViews = useSavedViews();
  const [filters, setFilters] = useState<CalendarFilters>(
    () => savedViews.initialView?.filters ?? { ...EMPTY_FILTERS }
  );
  const [activeViewId, setActiveViewId] = useState<string | null>(
    () => savedViews.initialView?.id ?? null
  );

  const handleSelectView = (view: SavedView | null) => {
    setActiveViewId(view?.id ?? null);
    if (view) setFilters({ ...view.filters });
  };
  // The "new" case carries its own defaultDate directly (rather than a bare
  // 'new' sentinel plus a separate newEntryDefaultDate state to ferry the
  // date past chooser closing) — one piece of state instead of two that
  // have to stay in sync.
  const [editingEntry, setEditingEntry] = useState<
    NonServiceEntry | { new: true; defaultDate?: string } | null
  >(null);
  // D10 (built 2026-08-15) — shared "+ New" entry point: a day click (or
  // the toolbar button) opens `chooser` first, which then routes to either
  // NewJobDialog or NonServiceEntryDialog (create mode), both pre-filled
  // with whatever date the caller was anchored to.
  const [chooser, setChooser] = useState<{ defaultDate?: string } | null>(null);
  const [newJobDialog, setNewJobDialog] = useState<{ defaultDate?: string } | null>(null);

  const openChooser = (defaultDate?: string) => {
    setChooser({ defaultDate });
  };
  const handleChooseJob = () => {
    setNewJobDialog({ defaultDate: chooser?.defaultDate });
    setChooser(null);
  };
  const handleChooseNonService = () => {
    setEditingEntry({ new: true, defaultDate: chooser?.defaultDate });
    setChooser(null);
  };

  // Which jobs have at least one assigned technician double-booked
  // elsewhere — computed for the whole visible set so the grid itself can
  // flag it, not just the two creation dialogs that already checked this.
  // Previously a conflict was only ever visible if you happened to open the
  // Unscheduled Work → Schedule dialog or a non-service entry dialog for
  // that exact technician/date range; scanning the grid gave no signal at
  // all. See journey doc §7.
  const conflictJobIds = useMemo(() => {
    const ids = new Set<string>();
    for (const job of jobs) {
      if (jobHasTechnicianConflict(job, { jobs, nonServiceEntries })) ids.add(job.id);
    }
    return ids;
  }, [jobs, nonServiceEntries]);

  const gridStart = startOfWeek(startOfMonth(month));
  const gridEnd = endOfWeek(endOfMonth(month));
  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) weeks.push(allDays.slice(i, i + 7));

  const visibleStart = toIso(gridStart);
  const visibleEnd = toIso(gridEnd);

  // Jobs that fall in the visible month at all, before filtering — the
  // denominator for "N jobs hidden in this month." Deliberately scoped to
  // the visible month, not the whole dataset: "12 hidden" is actionable,
  // "340 hidden" is noise.
  const jobsInMonth = useMemo(
    () =>
      jobs.filter((j) =>
        rangesOverlap(j, { startDate: visibleStart, endDate: visibleEnd })
      ),
    [jobs, visibleStart, visibleEnd]
  );

  const search = filters.search.trim().toLowerCase();
  const shownJobsInMonth = useMemo(
    () => jobsInMonth.filter((j) => jobMatchesFilters(j, filters, search)),
    [jobsInMonth, filters, search]
  );

  const items: BarItem[] = useMemo(() => {
    const visibleRange = { startDate: visibleStart, endDate: visibleEnd };
    const jobItems: BarItem[] = shownJobsInMonth.map((job) => ({
      kind: 'job',
      id: job.id,
      startDate: job.startDate,
      endDate: job.endDate,
      job,
    }));
    // Non-service entries follow the WHO filters (technician, and location
    // via that technician's home location) but not the job-specific ones.
    // Readiness and free-text search describe jobs; leaving every PTO bar on
    // screen while searching for a project number reads as a broken filter,
    // and applying a readiness filter to PTO is meaningless, so both hide
    // non-service entries outright rather than half-matching them.
    const jobOnlyFilterActive = filters.readiness !== ALL_FILTER || search !== '';
    const techIdsInScope =
      filters.location === ALL_FILTER
        ? null
        : new Set(
            technicians.filter((t) => t.location === filters.location).map((t) => t.id)
          );
    const nsItems: BarItem[] = jobOnlyFilterActive
      ? []
      : nonServiceEntries
          .filter((e) => rangesOverlap(e, visibleRange))
          .filter(
            (e) =>
              filters.technicianId === ALL_FILTER ||
              e.technicianIds.includes(filters.technicianId)
          )
          .filter(
            (e) => !techIdsInScope || e.technicianIds.some((id) => techIdsInScope.has(id))
          )
          .map((entry) => ({
            kind: 'non-service',
            id: entry.id,
            startDate: entry.startDate,
            endDate: entry.endDate,
            entry,
          }));
    return [...jobItems, ...nsItems];
  }, [
    shownJobsInMonth,
    nonServiceEntries,
    technicians,
    filters,
    search,
    visibleStart,
    visibleEnd,
  ]);

  const laneOf = useMemo(() => assignLanes(items), [items]);

  // Filter option lists come from the whole job set, not the visible month —
  // a Location dropdown that loses "Canada" in a month with no Canada work
  // looks like missing data, not an empty month.
  const locationOptions = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );
  const divisionOptions = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.division))).sort(),
    [jobs]
  );

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-2 rounded-md border bg-white p-3 shadow-sm dark:bg-background">
        <div className="flex items-center gap-2">
          {/* Hide completed/cancelled moved into CalendarFilterBar with the
              rest of the filters (D30) — it was always a filter sitting in
              the month-navigation toolbar. D6's jump anchor moved with it.
              Views/Clear came the other way (2026-08-19, direct request):
              they're actions, so they sit with "+ New" here rather than at
              the end of the filter row. */}
          <CalendarViewsMenu
            filters={filters}
            onChange={setFilters}
            savedViews={savedViews}
            activeViewId={activeViewId}
            onSelectView={handleSelectView}
          />
          <Button size="sm" className="h-8 gap-1 text-xs" onClick={() => openChooser()}>
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>
      </div>

      {/* D30/D31 — filters + saved views */}
      <CalendarFilterBar
        filters={filters}
        onChange={setFilters}
        locations={locationOptions}
        divisions={divisionOptions}
        technicians={technicians}
        savedViews={savedViews}
        activeViewId={activeViewId}
        onSelectView={handleSelectView}
        shownCount={shownJobsInMonth.length}
        totalCount={jobsInMonth.length}
        highlightedAnchorId={highlightedAnchorId}
      />

      {/* Legend + inline decision notes for defaults that don't have a
          permanent surface of their own (roster picker only renders inside
          a dialog, so its decision tags need a jump target that's always
          in the DOM). */}
      <div className="flex flex-col rounded-md border bg-muted/30 text-[10px]">
        <SchedulingLegend
          anchorId="decision-D9"
          highlightedAnchorId={highlightedAnchorId}
          className="rounded-none border-0 bg-transparent"
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-2 py-1.5 text-muted-foreground">

          <span
            id="decision-D3"
            className={cn(
              'flex items-center gap-1 rounded px-1 transition-shadow',
              highlightedAnchorId === 'decision-D3' && 'ring-2 ring-amber-400'
            )}
          >
            <AlertTriangle className="h-3 w-3" /> Jobs with a missing/expired OSR show a
            warning, never a block <DecisionTag decisionId="D3" />
          </span>
          <span
            id="decision-D16"
            className={cn(
              'flex items-center gap-1 rounded px-1 transition-shadow',
              highlightedAnchorId === 'decision-D16' && 'ring-2 ring-amber-400'
            )}
          >
            <UserX className="h-3 w-3" /> Jobs with a double-booked technician show a
            warning directly on the grid <DecisionTag decisionId="D16" />
          </span>
          <span
            id="decision-D1"
            className={cn(
              'flex items-center gap-1 rounded px-1 transition-shadow',
              highlightedAnchorId === 'decision-D1' && 'ring-2 ring-amber-400'
            )}
          >
            Technician assignment is open to any capability
            <DecisionTag decisionId="D1" />
          </span>
          <span
            id="decision-D2"
            className={cn(
              'flex items-center gap-1 rounded px-1 transition-shadow',
              highlightedAnchorId === 'decision-D2' && 'ring-2 ring-amber-400'
            )}
          >
            Capacity limits are advisory only
            <DecisionTag decisionId="D2" />
          </span>
          <span
            id="decision-D4"
            className={cn(
              'flex items-center gap-1 rounded px-1 transition-shadow',
              highlightedAnchorId === 'decision-D4' && 'ring-2 ring-amber-400'
            )}
          >
            Conflicts warn, never block
            <DecisionTag decisionId="D4" />
          </span>
        </div>
      </div>

      {/* Month grid */}
      <div className="overflow-x-auto rounded-md border bg-white shadow-sm dark:bg-background">
        <div className="flex items-center justify-end border-b bg-muted/40 px-2 py-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMonth(startOfMonth(new Date('2026-08-11')))}
          >
            Today
          </Button>
        </div>
        <div className="grid grid-cols-7 border-b bg-muted/40 text-[11px] font-semibold uppercase text-muted-foreground">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="px-2 py-1.5">
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIdx) => {
          const activeThisWeek = items
            .filter(
              (it) => it.startDate <= toIso(week[6]) && it.endDate >= toIso(week[0])
            )
            .sort((a, b) => (laneOf.get(a.id) ?? 0) - (laneOf.get(b.id) ?? 0));

          // D15 (broadened 2026-08-16, unified same day): day numbers and
          // bars share ONE grid per week, so a full-height per-day
          // background button (row 1 through the last bar row) sits behind
          // the bars. Bars render afterward in DOM order, so they paint on
          // top and keep their own click behavior (open Job Detail / edit
          // entry) — clicking anywhere else in that day's column now opens
          // the SAME chooser the toolbar "+ New" button opens (not a
          // separate day-drill-down popup with its own "New…" button
          // inside it, which was a second, inconsistent "new" experience —
          // direct user feedback, 2026-08-16: "I don't want two 'new' form
          // experiences.") Explicit `gridTemplateRows` (not left implicit)
          // is required for the background's `1 / -1` span to correctly
          // reach the true last row.
          const gridTemplateRows =
            activeThisWeek.length > 0
              ? `24px repeat(${activeThisWeek.length}, auto)`
              : '24px';

          return (
            <div key={weekIdx} className="border-b last:border-b-0">
              <div
                className="grid grid-cols-7 gap-0.5 px-0.5 pb-1"
                style={{ gridTemplateRows }}
              >
                {week.map((day, dayIdx) => {
                  const iso = toIso(day);
                  const inMonth = isSameMonth(day, month);
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => openChooser(iso)}
                      style={{ gridColumn: dayIdx + 1, gridRow: '1 / -1' }}
                      className={cn(
                        'flex cursor-pointer items-start justify-end rounded-sm px-1.5 pt-0.5 text-[11px] hover:bg-muted/40',
                        !inMonth && 'text-muted-foreground/40',
                        isToday(day) && 'font-bold text-blue-600'
                      )}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}

                {/* Spanning bars — one row per lane, layered on top of the
                    per-day background buttons above (later in DOM order
                    wins paint/click priority on the overlapping area). */}
                {activeThisWeek.map((item, laneRowIdx) => {
                  const clipStart =
                    item.startDate < toIso(week[0]) ? toIso(week[0]) : item.startDate;
                  const clipEnd =
                    item.endDate > toIso(week[6]) ? toIso(week[6]) : item.endDate;
                  const colStart = week.findIndex((d) => toIso(d) === clipStart) + 1;
                  const colEnd = week.findIndex((d) => toIso(d) === clipEnd) + 2;
                  const capStart = clipStart === item.startDate;
                  const capEnd = clipEnd === item.endDate;
                  const gridRow = laneRowIdx + 2; // row 1 is the day-number/background row

                  if (item.kind === 'job') {
                    const job = item.job;
                    const showOsrWarning = job.osrStatus !== 'ok';
                    const showConflictWarning = conflictJobIds.has(job.id);
                    const readiness = deriveAutoStatus(job.accounts);
                    const lifecycle = resolveLifecycleStatus(job);
                    const showOnHold = lifecycle === 'On Hold';
                    return (
                      <button
                        key={item.id}
                        type="button"
                        style={{ gridColumn: `${colStart} / ${colEnd}`, gridRow }}
                        onClick={() => openJobDetail(job.id)}
                        className={cn(
                          'flex items-center gap-1 truncate border px-1.5 py-0.5 text-left text-[11px] font-medium shadow-sm',
                          jobBarClasses(readiness, lifecycle),
                          capStart ? 'rounded-l-md' : 'rounded-l-none',
                          capEnd ? 'rounded-r-md' : 'rounded-r-none'
                        )}
                        title={[
                          job.projectNumber,
                          `Status: ${lifecycle}`,
                          showConflictWarning ? 'technician conflict' : null,
                          showOsrWarning ? `OSR ${job.osrStatus}` : null,
                          'click to open',
                        ]
                          .filter(Boolean)
                          .join(' — ')}
                      >
                        {showOsrWarning && (
                          <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                        )}
                        {showConflictWarning && (
                          <UserX className="h-3 w-3 flex-shrink-0" />
                        )}
                        {showOnHold && <PauseCircle className="h-3 w-3 flex-shrink-0" />}
                        <span className="truncate">
                          {job.projectNumber} ·{' '}
                          {job.accounts[0]?.customerName ?? 'Unassigned'}
                        </span>
                      </button>
                    );
                  }

                  const entry = item.entry;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      style={{ gridColumn: `${colStart} / ${colEnd}`, gridRow }}
                      onClick={() => setEditingEntry(entry)}
                      className={cn(
                        'truncate border-2 px-1.5 py-0.5 text-left text-[11px] font-medium shadow-sm',
                        NON_SERVICE_STYLES[entry.type],
                        capStart ? 'rounded-l-md' : 'rounded-l-none',
                        capEnd ? 'rounded-r-md' : 'rounded-r-none'
                      )}
                      title={`${entry.type} — click to edit`}
                    >
                      {entry.type}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Job Detail dialog lives once at SchedulingShell level (D19) — both
          Calendar and List open the same instance via openJobDetail() on
          SchedulingDataContext, see JobDetailDialog.tsx. */}

      {/* Non-service entry create/edit */}
      {editingEntry && (
        <NonServiceEntryDialog
          entry={'new' in editingEntry ? null : editingEntry}
          open
          defaultDate={'new' in editingEntry ? editingEntry.defaultDate : undefined}
          onOpenChange={(open) => !open && setEditingEntry(null)}
        />
      )}

      {/* D10 (built 2026-08-15) — shared "+ New" entry point: toolbar
          button and every day cell's popover both route through here. */}
      <NewEntryChooser
        open={!!chooser}
        onOpenChange={(open) => !open && setChooser(null)}
        onChooseJob={handleChooseJob}
        onChooseNonService={handleChooseNonService}
        defaultDate={chooser?.defaultDate}
      />
      {newJobDialog && (
        <NewJobDialog
          open
          defaultDate={newJobDialog.defaultDate}
          onOpenChange={(open) => !open && setNewJobDialog(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;
