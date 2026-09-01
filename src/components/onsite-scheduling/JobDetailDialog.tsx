/**
 * PROTOTYPE ONLY — Job Detail dialog (D19).
 *
 * Replaces CalendarView's old "Quick View" (read-mostly, technician
 * reassignment only) with a real edit surface, and is the ONE component
 * both Calendar (job-bar click) and List (project-number click, for the
 * mock jobs this prototype seeds) open — see SchedulingShell.tsx, which
 * mounts this once and passes `openJobDetail`/`openJobId` down through
 * SchedulingDataContext so both surfaces share the same dialog instance.
 *
 * Does NOT touch the real OnsiteProject.tsx Detail page — Complete/
 * Cancelled stay a manual override there only, per D5. When a job's status
 * is already Completed or Cancelled, this dialog shows it read-only rather
 * than offering the PO Received/Confirmed/On Hold controls.
 */
import React, { useEffect, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  KNOWN_CUSTOMERS,
  KNOWN_CUSTOMER_ACCOUNT_NUMBERS,
  CITY_STATE_BY_LOCATION,
  JOB_VEHICLES,
  MANAGING_LABS,
} from '@/lib/onsite-scheduling/mock-data';
import {
  deriveAutoStatus,
  LIFECYCLE_BADGE_STYLES,
  READINESS_BADGE_STYLES,
  resolveLifecycleStatus,
} from '@/lib/onsite-scheduling/job-status';
import type { JobAccount, JobStatus, JobTechnicianHours } from '@/lib/onsite-scheduling/types';
import DecisionTag from './DecisionTag';
import TechnicianRosterPicker from './TechnicianRosterPicker';
import CommentThread from './CommentThread';
import VanSuggestionPanel from './VanSuggestionPanel';

const EMPTY_HOURS: JobTechnicianHours = {
  travelInHours: 0,
  travelOutHours: 0,
  productionHours: 8,
};

const TECH_ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: '__none__', label: 'No role' },
  { value: 'Trainee', label: 'Trainee' },
  { value: 'Project Lead', label: 'Project Lead' },
];

const JobDetailDialog: React.FC = () => {
  const { jobs, openJobId, closeJobDetail, updateJob, addJobComment } =
    useSchedulingData();
  const job = jobs.find((j) => j.id === openJobId) ?? null;

  const [draftTechnicianIds, setDraftTechnicianIds] = useState<string[]>([]);
  const [draftAccounts, setDraftAccounts] = useState<JobAccount[]>([]);
  const [draftVehicleId, setDraftVehicleId] = useState<string | undefined>(undefined);
  const [draftOnHold, setDraftOnHold] = useState(false);
  const [draftHours, setDraftHours] = useState<Record<string, JobTechnicianHours>>({});
  const [addCustomerValue, setAddCustomerValue] = useState<string>('');
  // D27 additions — see this file's header for what's built vs. what's
  // explicitly left off (Completed/Lost checkboxes need their own
  // follow-up decision, per open-decisions-log.md D27).
  const [draftOutsideSales, setDraftOutsideSales] = useState('');
  const [draftPreServiceChecklist, setDraftPreServiceChecklist] = useState('');
  const [draftPostServiceChecklist, setDraftPostServiceChecklist] = useState('');
  const [draftPostedInvoice, setDraftPostedInvoice] = useState('');
  const [draftManagedBy, setDraftManagedBy] = useState('');
  const [draftManagingLab, setDraftManagingLab] = useState('');
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());

  // Re-seed every draft from the job whenever a DIFFERENT job is opened —
  // not on every `jobs` change, so the fields being actively edited don't
  // get clobbered mid-edit by unrelated context re-renders.
  useEffect(() => {
    if (!job) return;
    setDraftTechnicianIds(job.technicianIds);
    setDraftAccounts(job.accounts);
    setDraftVehicleId(job.vehicleId);
    setDraftOnHold(job.onHold);
    setDraftHours(job.technicianHours);
    setAddCustomerValue('');
    setDraftOutsideSales(job.outsideSales ?? '');
    setDraftPreServiceChecklist(job.preServiceChecklist ?? '');
    setDraftPostServiceChecklist(job.postServiceChecklist ?? '');
    setDraftPostedInvoice(job.postedInvoice ?? '');
    setDraftManagedBy(job.managedBy ?? '');
    setDraftManagingLab(job.managingLab ?? '');
    setExpandedAccounts(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.id]);

  if (!job) {
    return null;
  }

  const isLockedStatus = job.status === 'Completed' || job.status === 'Cancelled';
  // D22/D28 — Readiness and Status are two separate values, not one
  // collapsed badge (direct feedback: "it doesn't seem like red/green
  // should be a status"). Readiness (Red/Green/Partial) is derived by
  // aggregating EVERY account's PO Received/Confirmed flags (FRD §7 Rule 1)
  // and is shown regardless of Status. Status is the honest lifecycle value
  // — 'Active' unless On Hold/Completed/Cancelled applies.
  const previewReadiness = deriveAutoStatus(draftAccounts);
  const previewLifecycleStatus = resolveLifecycleStatus({
    status: job.status,
    onHold: draftOnHold,
  });
  // `ScheduledJob.status` still caches the OLD collapsed value (D28's file
  // header) — mock-onsite-project-api.ts's real-route mock infers PO/
  // Confirmed flags from it, so saving still needs to write that shape,
  // even though nothing renders it directly as "Status" anymore.
  const cachedJobStatus: JobStatus = isLockedStatus
    ? job.status
    : draftOnHold
      ? 'On Hold'
      : previewReadiness;

  const availableCustomersToAdd = KNOWN_CUSTOMERS.filter(
    (c) => !draftAccounts.some((a) => a.customerName === c)
  );

  const removeAccount = (name: string) => {
    setDraftAccounts((prev) => prev.filter((a) => a.customerName !== name));
  };

  /** Prefills City/State (from the job's own location) and Account # (from
   * KNOWN_CUSTOMER_ACCOUNT_NUMBERS) the same way mock-data.ts's toAccounts()
   * already does for seeded jobs — added 2026-08-15, direct user feedback
   * that adding a customer left every field blank even though this exact
   * lookup already exists and is used for the identical purpose at seed
   * time. Contacts/PO Number/Quote Value stay blank on purpose: unlike
   * city/state/account #, nothing in this codebase actually knows a
   * customer's contact or this job's PO/quote ahead of time — those are
   * genuinely job-specific, not a fabricatable property of the customer. */
  const addAccount = () => {
    if (
      !addCustomerValue ||
      draftAccounts.some((a) => a.customerName === addCustomerValue)
    )
      return;
    const cityState = CITY_STATE_BY_LOCATION[job.location];
    setDraftAccounts((prev) => [
      ...prev,
      {
        customerName: addCustomerValue,
        poReceived: false,
        confirmed: false,
        city: cityState?.city,
        state: cityState?.state,
        accountNumber: KNOWN_CUSTOMER_ACCOUNT_NUMBERS[addCustomerValue],
      },
    ]);
    setAddCustomerValue('');
  };

  const setAccountFlag = (
    name: string,
    field: 'poReceived' | 'confirmed',
    value: boolean
  ) => {
    setDraftAccounts((prev) =>
      prev.map((a) => (a.customerName === name ? { ...a, [field]: value } : a))
    );
  };

  /** Generic setter for the D27 per-account text/number fields (City,
   * State, Account #, PO Number, contacts, Quote Value, SR#/Quote#/WO#) —
   * one function instead of one per field, since there are a dozen of
   * them and they all follow the same "find by customerName, patch one
   * key" shape as setAccountFlag above. */
  const setAccountField = <K extends keyof JobAccount>(
    name: string,
    field: K,
    value: JobAccount[K]
  ) => {
    setDraftAccounts((prev) =>
      prev.map((a) => (a.customerName === name ? { ...a, [field]: value } : a))
    );
  };

  const toggleAccountExpanded = (name: string) => {
    setExpandedAccounts((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const setHoursField = (
    techId: string,
    field: keyof JobTechnicianHours,
    value: number
  ) => {
    setDraftHours((prev) => ({
      ...prev,
      [techId]: { ...EMPTY_HOURS, ...prev[techId], [field]: value },
    }));
  };

  /** Role/Comments setter (D27) — same idea as setHoursField but for the
   * non-numeric fields on the same per-technician record. */
  const setTechAssignmentField = <K extends 'role' | 'comments'>(
    techId: string,
    field: K,
    value: JobTechnicianHours[K]
  ) => {
    setDraftHours((prev) => ({
      ...prev,
      [techId]: { ...EMPTY_HOURS, ...prev[techId], [field]: value },
    }));
  };

  const handleClose = () => closeJobDetail();

  const handleSave = () => {
    // Drop hours for technicians no longer assigned; default new ones in.
    const nextHours: Record<string, JobTechnicianHours> = {};
    draftTechnicianIds.forEach((id) => {
      nextHours[id] = draftHours[id] ?? EMPTY_HOURS;
    });

    updateJob(job.id, {
      technicianIds: draftTechnicianIds,
      accounts: draftAccounts,
      vehicleId: draftVehicleId,
      onHold: draftOnHold,
      status: cachedJobStatus,
      technicianHours: nextHours,
      outsideSales: draftOutsideSales,
      preServiceChecklist: draftPreServiceChecklist,
      postServiceChecklist: draftPostServiceChecklist,
      postedInvoice: draftPostedInvoice,
      managedBy: draftManagedBy,
      managingLab: draftManagingLab,
    });

    closeJobDetail();
  };

  return (
    <Dialog open={!!openJobId} onOpenChange={(open) => !open && handleClose()}>
      {/* Widened from max-w-lg (2026-08-15) — the Customers table added for
          N8 (Customer/City/State/Acct#/PO/Conf/SR#/OSR#/Quote#/WO#) didn't
          fit at the old width without forcing horizontal scroll/tiny text
          even on a normal desktop viewport. */}
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            Job {job.projectNumber}
            <DecisionTag decisionId="D19" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Dates:</span> {job.startDate} –{' '}
            {job.endDate} &nbsp;·&nbsp;{' '}
            <span className="font-medium text-foreground">Location/Division:</span>{' '}
            {job.location} / {job.division}
          </p>

          {job.osrStatus !== 'ok' && (
            <div className="flex items-start gap-1.5 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/30">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>
                OSR {job.osrStatus} — confirmation is not blocked, this is a visible
                warning only. <DecisionTag decisionId="D3" />
              </span>
            </div>
          )}

          {/* Readiness + Status — split 2026-08-14 (D28): direct feedback
              was "it doesn't seem like red/green should be a status." It's
              right — Red/Green/Partial is a derived READINESS rollup of PO
              Received/Confirmed across every account below, not a state
              the job occupies, so it's no longer shown under a "Status"
              label. Status is the honest lifecycle value: 'Active' unless
              On Hold/Completed/Cancelled applies — always a real state,
              never a stand-in for readiness. */}
          <div className="space-y-1.5 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Readiness</span>
              <Badge
                className={cn('text-[11px]', READINESS_BADGE_STYLES[previewReadiness])}
              >
                {previewReadiness}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Automatically derived from PO Received + Confirmed on every account below —
              not set directly, and shown regardless of Status.{' '}
              <DecisionTag decisionId="D28" />
            </p>
          </div>

          <div className="space-y-1.5 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Status</span>
              <Badge
                className={cn(
                  'text-[11px]',
                  LIFECYCLE_BADGE_STYLES[previewLifecycleStatus]
                )}
              >
                {previewLifecycleStatus}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {isLockedStatus
                ? `${job.status} is a manual override made in the real Detail page, not editable here.`
                : 'Active unless placed On Hold — Completed/Cancelled are set from the real Detail page, not here.'}
            </p>

            {isLockedStatus ? (
              <p className="text-xs text-muted-foreground">
                <DecisionTag decisionId="D5" />
              </p>
            ) : (
              <label className="flex items-center gap-2 pt-1 text-xs">
                <Switch checked={draftOnHold} onCheckedChange={setDraftOnHold} />
                On Hold (the one manual override — independent of Readiness, and excluded
                from it entirely, not a variant of Red/Green/Partial)
              </label>
            )}
          </div>

          {/* Vehicle */}
          <div className="space-y-1.5 border-t pt-3">
            <span className="text-xs font-medium text-foreground">Vehicle</span>
            <Select
              value={draftVehicleId ?? '__none__'}
              onValueChange={(v) => setDraftVehicleId(v === '__none__' ? undefined : v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Unassigned</SelectItem>
                {JOB_VEHICLES.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name} · {v.homeLocation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* D32 (built 2026-08-19) — geography-based van suggestion,
                placed here rather than on its own screen so the ranking sits
                where the assignment is actually made. Every figure it shows
                is labeled stand-in on screen; see VanSuggestionPanel.tsx and
                van-suggestion.ts. */}
            <VanSuggestionPanel
              job={{
                id: job.id,
                // draftAccounts, not job.accounts — a customer added in this
                // dialog changes which city the job is measured from, and a
                // suggestion built on the pre-edit account list would quietly
                // disagree with what's on screen. The object is rebuilt each
                // render rather than memoized; the ranking is a handful of
                // array scans over seed data, so caching it would cost more
                // clarity than it saves time.
                accounts: draftAccounts,
                location: job.location,
                startDate: job.startDate,
                endDate: job.endDate,
              }}
              selectedVehicleId={draftVehicleId}
              onPick={setDraftVehicleId}
            />
          </div>

          {/* Outside Sales — D27, from Canada's RMID form's Pre-Service
              section. Job-level (who introduced the deal), not
              per-account — a job doesn't usually have a different outside
              sales contact per customer.
              Region-gated to Canada (direct user decision, 2026-08-16):
              this field exists ONLY in Canada's source form, and its real
              backend shape depends on D23 (does Canada share US
              CalMapp's backend, or get its own?) — building it visible
              for BR/Wichita adds clutter with no source justification, so
              it's hidden there rather than shown empty. See D27 and D23
              in open-decisions-log.md. */}
          {job.location === 'Canada' && (
            <div className="space-y-1.5 border-t pt-3">
              <span className="text-xs font-medium text-foreground">Outside Sales</span>
              <Input
                className="h-8 text-xs"
                placeholder="—"
                value={draftOutsideSales}
                onChange={(e) => setDraftOutsideSales(e.target.value)}
              />
            </div>
          )}

          {/* Customer(s) / Accounts — D22: each account carries its own PO
              Received/Confirmed flags (FRD §7 Rule 1, §8 "a project has
              many accounts"); Status above is the aggregate over these.
              N8 (built 2026-08-15): the summary row is now an
              always-visible table matching Andrea's real Detail screen's
              Customers table layout/columns, instead of requiring a click
              to see SR#/OSR#/Quote#/WO#. The chevron still expands
              per-account fields the real screen doesn't show inline either
              (contacts, editable City/State/Account#/PO#/Quote Value). */}
          <div className="space-y-1.5 border-t pt-3">
            <span className="text-xs font-medium text-foreground">Customer(s)</span>
            {draftAccounts.length === 0 && (
              <span className="text-xs text-muted-foreground">None assigned.</span>
            )}
            {draftAccounts.length > 0 && (
              <div className="overflow-x-auto rounded-md border">
                <Table className="text-[11px]">
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="h-auto w-5 px-1 py-1"></TableHead>
                      <TableHead className="h-auto px-2 py-1 text-[10px] uppercase text-muted-foreground">
                        Customer
                      </TableHead>
                      <TableHead className="h-auto px-2 py-1 text-[10px] uppercase text-muted-foreground">
                        City/State
                      </TableHead>
                      <TableHead className="h-auto px-2 py-1 text-[10px] uppercase text-muted-foreground">
                        Acct #
                      </TableHead>
                      <TableHead className="h-auto px-1 py-1 text-center text-[10px] uppercase text-muted-foreground">
                        PO
                      </TableHead>
                      <TableHead className="h-auto px-1 py-1 text-center text-[10px] uppercase text-muted-foreground">
                        Conf
                      </TableHead>
                      <TableHead className="h-auto px-2 py-1 text-[10px] uppercase text-muted-foreground">
                        SR#
                      </TableHead>
                      <TableHead className="h-auto px-2 py-1 text-[10px] uppercase text-muted-foreground">
                        OSR#
                      </TableHead>
                      <TableHead className="h-auto px-2 py-1 text-[10px] uppercase text-muted-foreground">
                        Quote#
                      </TableHead>
                      <TableHead className="h-auto px-2 py-1 text-[10px] uppercase text-muted-foreground">
                        WO#
                      </TableHead>
                      <TableHead className="h-auto w-5 px-1 py-1"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftAccounts.map((account) => {
                      const isExpanded = expandedAccounts.has(account.customerName);
                      return (
                        <React.Fragment key={account.customerName}>
                          <TableRow className="align-top">
                            <TableCell className="px-1 py-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleAccountExpanded(account.customerName)
                                }
                                aria-label={
                                  isExpanded
                                    ? `Collapse ${account.customerName}`
                                    : `Expand ${account.customerName}`
                                }
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </button>
                            </TableCell>
                            <TableCell className="px-2 py-1.5 font-medium text-foreground">
                              {account.customerName}
                            </TableCell>
                            <TableCell className="px-2 py-1.5 whitespace-nowrap text-muted-foreground">
                              {[account.city, account.state].filter(Boolean).join(', ') ||
                                '—'}
                            </TableCell>
                            <TableCell className="px-2 py-1.5 whitespace-nowrap text-muted-foreground">
                              {account.accountNumber || '—'}
                            </TableCell>
                            <TableCell className="px-1 py-1.5 text-center">
                              <Checkbox
                                checked={account.poReceived}
                                disabled={draftOnHold || isLockedStatus}
                                onCheckedChange={(v) =>
                                  setAccountFlag(account.customerName, 'poReceived', !!v)
                                }
                              />
                            </TableCell>
                            <TableCell className="px-1 py-1.5 text-center">
                              <Checkbox
                                checked={account.confirmed}
                                disabled={draftOnHold || isLockedStatus}
                                onCheckedChange={(v) =>
                                  setAccountFlag(account.customerName, 'confirmed', !!v)
                                }
                              />
                            </TableCell>
                            {/* SR#/Quote#/WO# — placeholder-styled links, not
                                live (N8): Andrea's real Customers table
                                already shows these exact three as real
                                columns not yet wired to a stored record. */}
                            <TableCell className="px-2 py-1.5">
                              <span
                                className="whitespace-nowrap text-blue-600"
                                title="Placeholder link — not wired to a stored record yet"
                              >
                                {account.srNumber || '—'}
                              </span>
                            </TableCell>
                            {/* OSR# — styled as the one genuinely live/working
                                link Andrea's real screen has today (N8),
                                unlike SR#/Quote#/WO# above. Tooltip mirrors
                                production's file-share path pattern; no real
                                file storage sits behind this in the
                                prototype. */}
                            <TableCell className="px-2 py-1.5">
                              {account.osrNumber ? (
                                <a
                                  href="#"
                                  onClick={(e) => e.preventDefault()}
                                  className="whitespace-nowrap text-blue-600 underline hover:text-blue-800"
                                  title={`${account.osrNumber}.doc — opens from \\\\mt-fs01\\JM_VOL\\OnSite\\OSR\\ (prototype: not wired to real file storage)`}
                                >
                                  {account.osrNumber}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="px-2 py-1.5">
                              <span
                                className="whitespace-nowrap text-blue-600"
                                title="Placeholder link — not wired to a stored record yet"
                              >
                                {account.quoteNumber || '—'}
                              </span>
                            </TableCell>
                            <TableCell className="px-2 py-1.5">
                              <span
                                className="whitespace-nowrap text-blue-600"
                                title="Placeholder link — not wired to a stored record yet"
                              >
                                {account.workOrderNumber || '—'}
                              </span>
                            </TableCell>
                            <TableCell className="px-1 py-1.5">
                              <button
                                type="button"
                                onClick={() => removeAccount(account.customerName)}
                                aria-label={`Remove ${account.customerName}`}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </TableCell>
                          </TableRow>

                          {/* D27 — remaining per-account fields from
                              Canada's RMID form (editable city/state/
                              account#/PO number, contacts) and Quote Value.
                              Collapsed by default since a job can carry
                              several accounts and this is a lot of fields
                              per one; the reference columns above (which
                              the real screen shows inline) no longer live
                              behind this toggle. */}
                          {isExpanded && (
                            <TableRow className="bg-muted/10 hover:bg-muted/10">
                              <TableCell colSpan={11} className="space-y-2 p-2">
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                  <label className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-muted-foreground">
                                      City
                                    </span>
                                    <Input
                                      className="h-7 text-xs"
                                      value={account.city ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'city',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </label>
                                  <label className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-muted-foreground">
                                      State
                                    </span>
                                    <Input
                                      className="h-7 text-xs"
                                      value={account.state ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'state',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </label>
                                  <label className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-muted-foreground">
                                      Account #
                                    </span>
                                    <Input
                                      className="h-7 text-xs"
                                      value={account.accountNumber ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'accountNumber',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </label>
                                  <label className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-muted-foreground">
                                      PO Number
                                    </span>
                                    <Input
                                      className="h-7 text-xs"
                                      value={account.poNumber ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'poNumber',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </label>
                                </div>

                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  <div className="space-y-1 rounded-md border border-dashed p-1.5">
                                    <p className="text-[10px] font-medium text-muted-foreground">
                                      Customer Contact
                                    </p>
                                    <Input
                                      className="h-7 text-xs"
                                      placeholder="Name"
                                      value={account.customerContactName ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'customerContactName',
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Input
                                      className="h-7 text-xs"
                                      placeholder="Email"
                                      value={account.customerContactEmail ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'customerContactEmail',
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Input
                                      className="h-7 text-xs"
                                      placeholder="Phone"
                                      value={account.customerContactPhone ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'customerContactPhone',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1 rounded-md border border-dashed p-1.5">
                                    <p className="text-[10px] font-medium text-muted-foreground">
                                      Site Contact
                                    </p>
                                    <Input
                                      className="h-7 text-xs"
                                      placeholder="Name"
                                      value={account.siteContactName ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'siteContactName',
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Input
                                      className="h-7 text-xs"
                                      placeholder="Email"
                                      value={account.siteContactEmail ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'siteContactEmail',
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Input
                                      className="h-7 text-xs"
                                      placeholder="Phone"
                                      value={account.siteContactPhone ?? ''}
                                      onChange={(e) =>
                                        setAccountField(
                                          account.customerName,
                                          'siteContactPhone',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>

                                <label className="flex max-w-[10rem] flex-col gap-0.5">
                                  <span className="text-[10px] text-muted-foreground">
                                    Quote Value
                                  </span>
                                  <Input
                                    type="number"
                                    min={0}
                                    className="h-7 text-xs"
                                    value={account.quoteValue ?? 0}
                                    onChange={(e) =>
                                      setAccountField(
                                        account.customerName,
                                        'quoteValue',
                                        Number(e.target.value) || 0
                                      )
                                    }
                                  />
                                </label>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">
              SR#/Quote#/Work Order# are placeholder links — they'll connect to stored
              records in a future update. OSR# behaves like the one genuinely live link
              production has today (N8 — see Open Decisions' "Not built, pending" list).
            </p>
            {availableCustomersToAdd.length > 0 && (
              <div className="flex items-center gap-2">
                <Select value={addCustomerValue} onValueChange={setAddCustomerValue}>
                  <SelectTrigger className="h-8 flex-1 text-xs">
                    <SelectValue placeholder="Add a customer…" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCustomersToAdd.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={!addCustomerValue}
                  onClick={addAccount}
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Technicians — travel-in/out + production hours now render
              inline per assigned technician (D26) instead of a separate
              section below, matching the real Detail page's own
              technician table shape more closely. */}
          <div className="space-y-1.5 border-t pt-3">
            <TechnicianRosterPicker
              selectedIds={draftTechnicianIds}
              onChange={setDraftTechnicianIds}
              dateRange={{ startDate: job.startDate, endDate: job.endDate }}
              excludeJobId={job.id}
              jobLocation={job.location}
              renderTechExtra={(techId) => {
                const hours = draftHours[techId] ?? EMPTY_HOURS;
                return (
                  <div className="mt-2 space-y-2 border-t pt-2">
                    {/* Role + Comments — D27, from Andrea's real Detail
                        page's Technician Assignments table. Role options
                        are a plain hardcoded list (Trainee/Project Lead/No
                        role) — the real Technicians.tsx sources this from
                        a server lookup with no fixed vocabulary anywhere
                        in this codebase, so there's nothing authoritative
                        to match. */}
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">Role</span>
                        <Select
                          value={hours.role ?? '__none__'}
                          onValueChange={(v) =>
                            setTechAssignmentField(
                              techId,
                              'role',
                              v === '__none__'
                                ? undefined
                                : (v as 'Trainee' | 'Project Lead')
                            )
                          }
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TECH_ROLE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">
                          Comments
                        </span>
                        <Input
                          className="h-7 text-xs"
                          value={hours.comments ?? ''}
                          onChange={(e) =>
                            setTechAssignmentField(techId, 'comments', e.target.value)
                          }
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">
                          Travel in (hrs)
                        </span>
                        <Input
                          type="number"
                          min={0}
                          step={0.5}
                          className="h-7 text-xs"
                          value={hours.travelInHours}
                          onChange={(e) =>
                            setHoursField(
                              techId,
                              'travelInHours',
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      </label>
                      <label className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">
                          Travel out (hrs)
                        </span>
                        <Input
                          type="number"
                          min={0}
                          step={0.5}
                          className="h-7 text-xs"
                          value={hours.travelOutHours}
                          onChange={(e) =>
                            setHoursField(
                              techId,
                              'travelOutHours',
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      </label>
                      <label className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-muted-foreground">
                          Production (hrs)
                        </span>
                        <Input
                          type="number"
                          min={0}
                          step={0.5}
                          className="h-7 text-xs"
                          value={hours.productionHours}
                          onChange={(e) =>
                            setHoursField(
                              techId,
                              'productionHours',
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                );
              }}
            />
          </div>

          {/* Service Checklists — D27, from Canada's RMID form. Completed
              and Lost are DELIBERATELY not included here as independent
              checkboxes — that touches this build's existing JobStatus
              derivation (D22) and D5's still-open Rule 6 conflict, and
              needs its own explicit decision before building, per D27's
              "needs its own follow-up" note.
              Region-gated to Canada (direct user decision, 2026-08-16):
              Pre/Post-Service Checklist and Posted Invoice exist only in
              Canada's source form, with no defined structure yet (free
              text stands in for an unconfirmed real checklist shape —
              see N14) and a real backend shape that depends on D23.
              Hiding for BR/Wichita keeps their form lean rather than
              showing three empty fields with no source justification. */}
          {job.location === 'Canada' && (
            <div className="space-y-2 border-t pt-3">
              <span className="text-xs font-medium text-foreground">
                Service Checklists
              </span>
              <label className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">
                  Pre-Service Checklist
                </span>
                <Textarea
                  className="min-h-[50px] text-xs"
                  value={draftPreServiceChecklist}
                  onChange={(e) => setDraftPreServiceChecklist(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">
                  Post-Service Checklist
                </span>
                <Textarea
                  className="min-h-[50px] text-xs"
                  value={draftPostServiceChecklist}
                  onChange={(e) => setDraftPostServiceChecklist(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">Posted Invoice</span>
                <Input
                  className="h-8 text-xs"
                  value={draftPostedInvoice}
                  onChange={(e) => setDraftPostedInvoice(e.target.value)}
                />
              </label>
              {(job.status === 'Completed' || job.status === 'Cancelled') && (
                <p className="text-[11px] text-muted-foreground">
                  Completed/Lost as independent flags (matching Canada's form) is a
                  proposed addition still pending its own decision — see{' '}
                  <DecisionTag decisionId="D27" /> — not built here yet.
                </p>
              )}
            </div>
          )}

          {/* Administrative — D27, from Canada's RMID form. Managed By is
              region-gated to Canada (2026-08-16) — its real identity
              (person? role? team?) is unconfirmed and it only appears in
              Canada's source form. Managing Lab stays visible for ALL
              regions — unlike the fields above, its own dropdown already
              lists Baton Rouge/Wichita/Canada, so it reads as a
              cross-region admin concept rather than Canada-only, even
              though it surfaced via Canada's form. It doesn't resolve N7
              (real technician/lab sourcing) or N13 (its own hardcoded
              list needs a real reference source) — just surfaces the
              field for review. */}
          <div className="grid grid-cols-2 gap-2 border-t pt-3">
            {job.location === 'Canada' && (
              <label className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-foreground">Managed By</span>
                <Input
                  className="h-8 text-xs"
                  value={draftManagedBy}
                  onChange={(e) => setDraftManagedBy(e.target.value)}
                />
              </label>
            )}
            <label className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-foreground">Managing Lab</span>
              <Select
                value={draftManagingLab || '__none__'}
                onValueChange={(v) => setDraftManagingLab(v === '__none__' ? '' : v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Lab" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Select Lab</SelectItem>
                  {MANAGING_LABS.map((lab) => (
                    <SelectItem key={lab} value={lab}>
                      {lab}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          {/* Documents — D27, from Canada's RMID form. UI shell only, no
              real file storage wired up — matches this pass's
              frontend-only scope (see the prototype README).
              Region-gated to Canada (direct user decision, 2026-08-16):
              this exists only in Canada's source form, and — unlike the
              other Canada-only fields above — its blocker isn't D23 so
              much as N15: nobody has ever confirmed what document types
              this is actually for, so there's no real storage/security
              requirement to build against yet regardless of the backend
              question. Hidden for BR/Wichita rather than shown as a dead
              "no files found" shell nobody asked for. */}
          {job.location === 'Canada' && (
            <div className="space-y-1.5 border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">Documents</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-[11px]"
                  disabled
                  title="Not wired up in this prototype — UI shell only"
                >
                  <Paperclip className="h-3 w-3" />
                  Upload
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">No files found.</p>
            </div>
          )}

          {/* Comments — D27, from Canada's Comments field + Andrea's real
              Comments box. Deliberately NOT region-gated (2026-08-16),
              unlike the Canada-only fields above — this is independently
              validated by TWO real systems (Canada's form AND Andrea's
              real US Detail screen already has one), not a Canada-only
              concept waiting on D23. Safe to build for real regardless of
              how the backend-sharing question resolves. Reuses the exact
              CommentThread pattern already built for Open Decisions (see
              that component) — saves immediately, not gated behind this
              dialog's Save button, same as Open Decisions' own comment
              threads. Known real gap for productionalization (not yet
              fixed here): JobComment has no author field — every comment
              is anonymous, which is a real defect for a multi-user
              system, not just a nice-to-have — see N16. */}
          <div className="space-y-1.5 border-t pt-3">
            <span className="text-xs font-medium text-foreground">Comments</span>
            <CommentThread
              comments={job.comments}
              onAdd={(text) => addJobComment(job.id, text)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailDialog;
