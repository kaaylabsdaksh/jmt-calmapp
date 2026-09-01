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

const CardSection = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
    <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          {title}
        </h3>
      </div>
      {action}
    </div>
    <div className="p-4 space-y-3">{children}</div>
  </div>
);

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
      <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center justify-between text-base font-semibold">
            <span className="flex items-center gap-1.5">
              Job {job.projectNumber}
              <DecisionTag decisionId="D19" />
            </span>
            <div className="flex items-center gap-2">
              <Badge
                className={cn('text-[10px]', READINESS_BADGE_STYLES[previewReadiness])}
              >
                {previewReadiness}
              </Badge>
              <Badge
                className={cn(
                  'text-[10px]',
                  LIFECYCLE_BADGE_STYLES[previewLifecycleStatus]
                )}
              >
                {previewLifecycleStatus}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-6 text-sm">
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

          {/* Readiness + Status */}
          <CardSection title="Readiness & Status">
            <div className="space-y-3">
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
              <div className="border-t pt-2">
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
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {isLockedStatus
                    ? `${job.status} is a manual override made in the real Detail page, not editable here.`
                    : 'Active unless placed On Hold — Completed/Cancelled are set from the real Detail page, not here.'}
                </p>
                {isLockedStatus ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    <DecisionTag decisionId="D5" />
                  </p>
                ) : (
                  <label className="flex items-center gap-2 pt-2 text-xs">
                    <Switch checked={draftOnHold} onCheckedChange={setDraftOnHold} />
                    On Hold (the one manual override — independent of Readiness, and
                    excluded from it entirely, not a variant of Red/Green/Partial)
                  </label>
                )}
              </div>
            </div>
          </CardSection>

          {/* Logistics */}
          <CardSection title="Logistics">
            <div className="space-y-3">
              <label className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-foreground">Assigned Vehicle</span>
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
              </label>
              <VanSuggestionPanel
                job={{
                  id: job.id,
                  accounts: draftAccounts,
                  location: job.location,
                  startDate: job.startDate,
                  endDate: job.endDate,
                }}
                selectedVehicleId={draftVehicleId}
                onPick={setDraftVehicleId}
              />
              {job.location === 'Canada' && (
                <label className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">Outside Sales</span>
                  <Input
                    className="h-8 text-xs"
                    placeholder="—"
                    value={draftOutsideSales}
                    onChange={(e) => setDraftOutsideSales(e.target.value)}
                  />
                </label>
              )}
            </div>
          </CardSection>

          {/* Customer(s) */}
          <CardSection title="Customer(s)">
            <div className="space-y-2">
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
                                  onClick={() => toggleAccountExpanded(account.customerName)}
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
                              <TableCell className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
                                {[account.city, account.state].filter(Boolean).join(', ') ||
                                  '—'}
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
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
                              <TableCell className="px-2 py-1.5">
                                <span
                                  className="whitespace-nowrap text-blue-600"
                                  title="Placeholder link — not wired to a stored record yet"
                                >
                                  {account.srNumber || '—'}
                                </span>
                              </TableCell>
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
          </CardSection>

          {/* Assignments */}
          <CardSection title="Assignments">
            <div className="space-y-3">
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
          </CardSection>

          {/* Administrative — Canada-only */}
          {job.location === 'Canada' && (
            <CardSection title="Administrative">
              <div className="space-y-3">
                <label className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">
                    Pre-Service Checklist
                  </span>
                  <Textarea
                    className="min-h-[50px] text-xs"
                    value={draftPreServiceChecklist}
                    onChange={(e) => setDraftPreServiceChecklist(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">
                    Post-Service Checklist
                  </span>
                  <Textarea
                    className="min-h-[50px] text-xs"
                    value={draftPostServiceChecklist}
                    onChange={(e) => setDraftPostServiceChecklist(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">Posted Invoice</span>
                  <Input
                    className="h-8 text-xs"
                    value={draftPostedInvoice}
                    onChange={(e) => setDraftPostedInvoice(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">Managed By</span>
                  <Input
                    className="h-8 text-xs"
                    value={draftManagedBy}
                    onChange={(e) => setDraftManagedBy(e.target.value)}
                  />
                </label>
                {(job.status === 'Completed' || job.status === 'Cancelled') && (
                  <p className="text-[11px] text-muted-foreground">
                    Completed/Lost as independent flags (matching Canada's form) is a
                    proposed addition still pending its own decision — see{' '}
                    <DecisionTag decisionId="D27" /> — not built here yet.
                  </p>
                )}
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
            </CardSection>
          )}

          {/* Comments */}
          <CardSection title="Comments">
            <CommentThread
              comments={job.comments}
              onAdd={(text) => addJobComment(job.id, text)}
            />
          </CardSection>
        </div>

        <DialogFooter className="border-t bg-white px-6 py-4">
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
