/**
 * PROTOTYPE ONLY — List View, rebuilt from scratch (D24).
 *
 * Replaces the real, unmodified `OnsiteProjectList` in this shell's List
 * tab with a purpose-built view that reads directly from
 * `SchedulingDataContext` — the same live store Calendar and Unscheduled
 * Work already use. This closes the List/Calendar "two data worlds" split
 * that `mock-onsite-project-api.ts`/`job-store.ts` previously had to bridge
 * for this tab (that bridge stays in place for the real, standalone
 * `/onsite-project` route, which is untouched and still uses the real
 * component — see that file's header).
 *
 * Built to satisfy FRD §6.1 List View in full:
 *  - US-1: project number, dates, division, location, account(s), status
 *    (Red/Green/Partial), technician(s), quote total all shown without
 *    opening Detail. Filters: Location, Division, Salesperson, Technician,
 *    Status, free-text search.
 *  - US-2: PO Received/Confirmed flippable inline, without opening Detail
 *    — for a single-account job. A multi-account job's dot is still shown
 *    (aggregated — see job-status.ts's `aggregateAccountFlag`) but isn't
 *    inline-editable, since which account you meant is genuinely
 *    ambiguous with more than one; click the row to edit per-account in
 *    Detail instead.
 *
 * Deliberately NOT built — flagged, not silently dropped:
 *  - The 90-day time-based urgency coloring Canada's own On-Ramp uses — out
 *    of scope per D22/N1; this view only ever shows Model 1 (BR/FRD)
 *    Red/Green/Partial + On Hold, same as Calendar and Detail.
 *
 * N8 (built 2026-08-15): this originally left out SR/OSR/Quote/Work Order
 * reference links entirely, on the theory that none of those entities exist
 * in this prototype's data model and fabricating link targets would be
 * worse than omitting them. A real screenshot of Andrea's Detail screen
 * corrected that — those columns are real and already committed to
 * production, just not wired to a stored record yet. A WO# column is now
 * shown here (placeholder-styled, same as Detail's Customers table); SR#/
 * OSR#/Quote# stay Detail-only since surfacing all four here would crowd
 * this table's account-name column further, and Detail is one click away.
 */
import React, { useMemo, useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useSchedulingData } from '@/context/SchedulingDataContext';
import { useOpenDecisions } from '@/context/OpenDecisionsContext';
import {
  aggregateAccountFlag,
  deriveAutoStatus,
  LIFECYCLE_BADGE_STYLES,
  READINESS_BORDER_L,
  resolveJobStatus,
  resolveLifecycleStatus,
  type FlagAggregate,
  type LifecycleStatus,
} from '@/lib/onsite-scheduling/job-status';
import { JOB_VEHICLES } from '@/lib/onsite-scheduling/mock-data';
import type { ScheduledJob } from '@/lib/onsite-scheduling/types';
import SchedulingLegend from './SchedulingLegend';
import DecisionTag from './DecisionTag';
import NewEntryChooser from './NewEntryChooser';
import NewJobDialog from './NewJobDialog';
import NonServiceEntryDialog from './NonServiceEntryDialog';

const ALL = '__all__';

const FLAG_DOT_STYLES: Record<FlagAggregate, string> = {
  yes: 'bg-emerald-500',
  partial: 'bg-amber-400',
  no: 'bg-red-500',
};

const FLAG_DOT_LABEL: Record<FlagAggregate, string> = {
  yes: 'Yes',
  partial: 'Partial (some accounts)',
  no: 'No',
};

const OSR_DOT_STYLES: Record<ScheduledJob['osrStatus'], string> = {
  ok: 'bg-emerald-500',
  expired: 'bg-amber-400',
  missing: 'bg-red-500',
};

const READINESS_DOT: Record<'Red' | 'Green' | 'Partial', string> = {
  Green: 'bg-emerald-500',
  Red: 'bg-red-500',
  Partial: 'bg-orange-400',
};

function Dot({
  aggregate,
  label,
  onClick,
  clickable,
}: {
  aggregate: FlagAggregate;
  label: string;
  onClick?: () => void;
  clickable: boolean;
}) {
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title={
        clickable
          ? `${label}: ${FLAG_DOT_LABEL[aggregate]} — click to toggle`
          : `${label}: ${FLAG_DOT_LABEL[aggregate]}`
      }
      className={cn(
        'h-3 w-3 rounded-full border border-black/10 transition-transform',
        FLAG_DOT_STYLES[aggregate],
        clickable ? 'cursor-pointer hover:scale-125' : 'cursor-default opacity-90'
      )}
    />
  );
}

const SchedulingListView: React.FC = () => {
  const { jobs, technicians, openJobDetail, updateJob } = useSchedulingData();
  const { highlightedAnchorId } = useOpenDecisions();

  const [locationFilter, setLocationFilter] = useState(ALL);
  const [divisionFilter, setDivisionFilter] = useState(ALL);
  const [salesCodeFilter, setSalesCodeFilter] = useState(ALL);
  const [technicianFilter, setTechnicianFilter] = useState(ALL);
  // Split 2026-08-14 (D28) — Readiness (Red/Green/Partial, derived) and
  // Status (Active/On Hold/Completed/Cancelled, the honest lifecycle value)
  // are two different axes now, so filtering by one no longer means
  // filtering by the other.
  const [readinessFilter, setReadinessFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  // D10 (built 2026-08-15) — List had no create surface at all before this;
  // same shared "+ New" chooser CalendarView now uses, with no date
  // pre-fill since a list row isn't anchored to a particular day.
  const [chooser, setChooser] = useState(false);
  const [newJobOpen, setNewJobOpen] = useState(false);
  const [newNonServiceOpen, setNewNonServiceOpen] = useState(false);

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );
  const divisions = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.division))).sort(),
    [jobs]
  );
  const salesCodes = useMemo(
    () => Array.from(new Set(jobs.flatMap((j) => j.salesCodes))).sort(),
    [jobs]
  );
  const readinessValues = ['Red', 'Partial', 'Green'] as const;
  const lifecycleValues: LifecycleStatus[] = [
    'Active',
    'On Hold',
    'Completed',
    'Cancelled',
  ];

  const resetFilters = () => {
    setLocationFilter(ALL);
    setDivisionFilter(ALL);
    setSalesCodeFilter(ALL);
    setTechnicianFilter(ALL);
    setReadinessFilter(ALL);
    setStatusFilter(ALL);
    setSearch('');
    setHideCompleted(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    // One pass/allocation instead of eight chained .filter() calls each
    // re-scanning the previous result.
    return jobs
      .filter((j) => {
        if (locationFilter !== ALL && j.location !== locationFilter) return false;
        if (divisionFilter !== ALL && j.division !== divisionFilter) return false;
        if (salesCodeFilter !== ALL && !j.salesCodes.includes(salesCodeFilter))
          return false;
        if (technicianFilter !== ALL && !j.technicianIds.includes(technicianFilter))
          return false;
        if (readinessFilter !== ALL && deriveAutoStatus(j.accounts) !== readinessFilter)
          return false;
        if (
          statusFilter !== ALL &&
          resolveLifecycleStatus(j) !== (statusFilter as LifecycleStatus)
        )
          return false;
        if (hideCompleted && (j.status === 'Completed' || j.status === 'Cancelled'))
          return false;
        if (q) {
          const haystack = [j.projectNumber, ...j.accounts.map((a) => a.customerName)]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) =>
        a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0
      );
  }, [
    jobs,
    locationFilter,
    divisionFilter,
    salesCodeFilter,
    technicianFilter,
    readinessFilter,
    statusFilter,
    hideCompleted,
    search,
  ]);

  const toggleSingleAccountFlag = (
    job: ScheduledJob,
    field: 'poReceived' | 'confirmed'
  ) => {
    if (job.accounts.length !== 1) return;
    const nextAccounts = [{ ...job.accounts[0], [field]: !job.accounts[0][field] }];
    updateJob(job.id, {
      accounts: nextAccounts,
      status: resolveJobStatus({
        status: job.status,
        accounts: nextAccounts,
        onHold: job.onHold,
      }),
    });
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Filter toolbar */}
      <div className="flex flex-col gap-2 rounded-md border bg-white p-3 shadow-sm dark:bg-background">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Search
            </label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Project # or customer…"
              className="h-8 min-w-[16rem] text-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Location
            </label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Division
            </label>
            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Sales/Service Code
            </label>
            <Select value={salesCodeFilter} onValueChange={setSalesCodeFilter}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                {salesCodes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Technician
            </label>
            <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                {technicians.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Readiness
            </label>
            <Select value={readinessFilter} onValueChange={setReadinessFilter}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                {readinessValues.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                {lifecycleValues.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={resetFilters}
          >
            Reset
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => setChooser(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        <div
          id="decision-D24"
          className={cn(
            'flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-[11px] text-muted-foreground transition-shadow',
            highlightedAnchorId === 'decision-D24' && 'ring-2 ring-amber-400'
          )}
        >
          <label className="flex items-center gap-1.5">
            <Switch checked={hideCompleted} onCheckedChange={setHideCompleted} />
            Hide completed/cancelled jobs
            <DecisionTag decisionId="D6" />
          </label>
          <span className="flex items-center gap-1">
            {filtered.length} of {jobs.length} jobs
            <DecisionTag decisionId="D24" />
          </span>
        </div>
      </div>

      {/* Legend — Readiness (derived, color-only) and Status (the honest
          lifecycle value) are shown as two separate groups (D28): Red/
          Green/Partial is never labeled "Status" here. Non-service swatches
          (PTO/Travel/etc.) are calendar-only and hidden on List. */}
      <SchedulingLegend
        anchorId="decision-D28"
        highlightedAnchorId={highlightedAnchorId}
        showNonService={false}
      >
        <span className="mx-1 h-3 w-px bg-border" />
        <span className="text-muted-foreground">PO / Confirmed / Safety:</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Yes
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Partial/Warning
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> No/Missing
        </span>
      </SchedulingLegend>


      {/* Table */}
      <div className="overflow-x-auto rounded-md border bg-white shadow-sm dark:bg-background">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>Project #</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Account(s)</TableHead>
              <TableHead>WO#</TableHead>
              <TableHead>Code(s)</TableHead>
              <TableHead>Technician(s)</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="text-center">PO</TableHead>
              <TableHead className="text-center">Conf.</TableHead>
              <TableHead className="text-center">Safety</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Quote</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={14}
                  className="py-6 text-center text-muted-foreground"
                >
                  No jobs match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((job) => {
                const poAgg = aggregateAccountFlag(job.accounts, 'poReceived');
                const confAgg = aggregateAccountFlag(job.accounts, 'confirmed');
                const canInlineToggle =
                  job.accounts.length === 1 &&
                  job.status !== 'Completed' &&
                  job.status !== 'Cancelled';
                const vehicle = JOB_VEHICLES.find((v) => v.id === job.vehicleId);
                // D28 — left border is Readiness (Red/Green/Partial), always
                // — a color-only indicator, never labeled "Status" and
                // never hidden by On Hold/Completed/Cancelled underneath.
                const readiness = deriveAutoStatus(job.accounts);
                const lifecycleStatus = resolveLifecycleStatus(job);
                return (
                  <TableRow
                    key={job.id}
                    onClick={() => openJobDetail(job.id)}
                    className={cn(
                      'cursor-pointer border-l-4 hover:bg-muted/40',
                      READINESS_BORDER_L[readiness],
                      (lifecycleStatus === 'Completed' ||
                        lifecycleStatus === 'Cancelled') &&
                        'opacity-60'
                    )}
                  >
                    <TableCell className="font-medium text-blue-600">
                      {job.projectNumber}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {job.startDate === job.endDate
                        ? job.startDate
                        : `${job.startDate} – ${job.endDate}`}
                    </TableCell>
                    <TableCell>{job.division}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {job.accounts.map((a) => a.customerName).join(', ') || '—'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {(() => {
                        // WO# — placeholder link, not live (N8): matches
                        // JobDetailDialog's Customers table. A job can carry
                        // several accounts with different WO#s; this shows
                        // the first plus a count of any others rather than
                        // cramming them all into a list column.
                        const woNumbers = job.accounts
                          .map((a) => a.workOrderNumber)
                          .filter((wo): wo is string => !!wo);
                        if (woNumbers.length === 0) {
                          return <span className="text-muted-foreground">—</span>;
                        }
                        return (
                          <span
                            className="text-blue-600"
                            title="Placeholder link — not wired to a stored record yet"
                          >
                            {woNumbers[0]}
                            {woNumbers.length > 1 && ` +${woNumbers.length - 1}`}
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell>{job.salesCodes.join(', ')}</TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {job.technicianIds.length === 0
                        ? '—'
                        : job.technicianIds
                            .map((id) => technicians.find((t) => t.id === id)?.name ?? id)
                            .join(', ')}
                    </TableCell>
                    <TableCell>{vehicle?.name ?? '—'}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Dot
                          aggregate={poAgg}
                          label="PO Received"
                          clickable={canInlineToggle}
                          onClick={() => toggleSingleAccountFlag(job, 'poReceived')}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Dot
                          aggregate={confAgg}
                          label="Confirmed"
                          clickable={canInlineToggle}
                          onClick={() => toggleSingleAccountFlag(job, 'confirmed')}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {job.osrStatus !== 'ok' && (
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                        )}
                        <span
                          title={`Safety/OSR: ${job.osrStatus}`}
                          className={cn(
                            'h-2.5 w-2.5 rounded-full border border-black/10',
                            OSR_DOT_STYLES[job.osrStatus]
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'text-[10px]',
                          LIFECYCLE_BADGE_STYLES[lifecycleStatus]
                        )}
                      >
                        {lifecycleStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {(() => {
                        // D27 — Quote Total relocated to per-account
                        // quoteValue (matches Andrea's real Customers
                        // table); this is the sum across all of a job's
                        // accounts, not a stored job-level field anymore.
                        const total = job.accounts.reduce(
                          (sum, a) => sum + (a.quoteValue ?? 0),
                          0
                        );
                        return total > 0 ? `$${total.toLocaleString()}` : '—';
                      })()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* D10 (built 2026-08-15) — same shared "+ New" chooser CalendarView
          uses, with no date pre-fill since a list row isn't anchored to a
          particular day. */}
      <NewEntryChooser
        open={chooser}
        onOpenChange={setChooser}
        onChooseJob={() => {
          setChooser(false);
          setNewJobOpen(true);
        }}
        onChooseNonService={() => {
          setChooser(false);
          setNewNonServiceOpen(true);
        }}
      />
      {newJobOpen && <NewJobDialog open onOpenChange={setNewJobOpen} />}
      {newNonServiceOpen && (
        <NonServiceEntryDialog entry={null} open onOpenChange={setNewNonServiceOpen} />
      )}
    </div>
  );
};

export default SchedulingListView;
