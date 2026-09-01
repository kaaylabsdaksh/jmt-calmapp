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
import { AlertTriangle, CalendarDays, ChevronDown, ChevronRight, MapPin, Paperclip, X } from 'lucide-react';
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
  const [draftOutsideSales, setDraftOutsideSales] = useState('');
  const [draftPreServiceChecklist, setDraftPreServiceChecklist] = useState('');
  const [draftPostServiceChecklist, setDraftPostServiceChecklist] = useState('');
  const [draftPostedInvoice, setDraftPostedInvoice] = useState('');
  const [draftManagedBy, setDraftManagedBy] = useState('');
  const [draftManagingLab, setDraftManagingLab] = useState('');
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());

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
  const previewReadiness = deriveAutoStatus(draftAccounts);
  const previewLifecycleStatus = resolveLifecycleStatus({
    status: job.status,
    onHold: draftOnHold,
  });
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
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden p-0">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between border-b px-6 py-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Job Detail
              </span>
              <Badge variant="secondary" className="text-[10px] font-bold">
                {job.projectNumber}
              </Badge>
              <DecisionTag decisionId="D19" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Job {job.projectNumber}</h2>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {job.startDate} – {job.endDate}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location} / {job.division}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-6">
            {job.osrStatus !== 'ok' && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  OSR {job.osrStatus} — confirmation is not blocked, this is a visible
                  warning only. <DecisionTag decisionId="D3" />
                </span>
              </div>
            )}

            {/* Customers */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">
                  Customer(s)
                </h3>
                {availableCustomersToAdd.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select value={addCustomerValue} onValueChange={setAddCustomerValue}>
                      <SelectTrigger className="h-8 w-56 text-xs">
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

              {draftAccounts.length === 0 && (
                <p className="text-xs text-muted-foreground">None assigned.</p>
              )}

              {draftAccounts.length > 0 && (
                <div className="overflow-x-auto rounded-lg border bg-background shadow-sm">
                  <Table className="text-[11px]">
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="h-auto w-5 px-1 py-1.5"></TableHead>
                        <TableHead className="h-auto px-2 py-1.5 text-[10px] uppercase text-muted-foreground">
                          Customer
                        </TableHead>
                        <TableHead className="h-auto px-2 py-1.5 text-[10px] uppercase text-muted-foreground">
                          City/State
                        </TableHead>
                        <TableHead className="h-auto px-2 py-1.5 text-[10px] uppercase text-muted-foreground">
                          Acct #
                        </TableHead>
                        <TableHead className="h-auto px-1 py-1.5 text-center text-[10px] uppercase text-muted-foreground">
                          PO
                        </TableHead>
                        <TableHead className="h-auto px-1 py-1.5 text-center text-[10px] uppercase text-muted-foreground">
                          Conf
                        </TableHead>
                        <TableHead className="h-auto px-2 py-1.5 text-[10px] uppercase text-muted-foreground">
                          SR#
                        </TableHead>
                        <TableHead className="h-auto px-2 py-1.5 text-[10px] uppercase text-muted-foreground">
                          OSR#
                        </TableHead>
                        <TableHead className="h-auto px-2 py-1.5 text-[10px] uppercase text-muted-foreground">
                          Quote#
                        </TableHead>
                        <TableHead className="h-auto px-2 py-1.5 text-[10px] uppercase text-muted-foreground">
                          WO#
                        </TableHead>
                        <TableHead className="h-auto w-5 px-1 py-1.5"></TableHead>
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
                                {[account.city, account.state].filter(Boolean).join(', ') || '—'}
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
                                    title={`${account.osrNumber}.doc — opens from \\mt-fs01\JM_VOL\OnSite\OSR\ (prototype: not wired to real file storage)`}
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
                                      <span className="text-[10px] text-muted-foreground">City</span>
                                      <Input
                                        className="h-7 text-xs"
                                        value={account.city ?? ''}
                                        onChange={(e) =>
                                          setAccountField(account.customerName, 'city', e.target.value)
                                        }
                                      />
                                    </label>
                                    <label className="flex flex-col gap-0.5">
                                      <span className="text-[10px] text-muted-foreground">State</span>
                                      <Input
                                        className="h-7 text-xs"
                                        value={account.state ?? ''}
                                        onChange={(e) =>
                                          setAccountField(account.customerName, 'state', e.target.value)
                                        }
                                      />
                                    </label>
                                    <label className="flex flex-col gap-0.5">
                                      <span className="text-[10px] text-muted-foreground">Account #</span>
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
                                      <span className="text-[10px] text-muted-foreground">PO Number</span>
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
                                    <span className="text-[10px] text-muted-foreground">Quote Value</span>
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
              <p className="mt-2 text-[10px] text-muted-foreground">
                SR#/Quote#/Work Order# are placeholder links — they'll connect to stored
                records in a future update. OSR# behaves like the one genuinely live link
                production has today (N8 — see Open Decisions' "Not built, pending" list).
              </p>
            </section>

            {/* Technicians */}
            <section>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-tight text-foreground">
                Technicians
              </h3>
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
                                v === '__none__' ? undefined : (v as 'Trainee' | 'Project Lead')
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
                          <span className="text-[10px] text-muted-foreground">Comments</span>
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
                          <span className="text-[10px] text-muted-foreground">Travel in (hrs)</span>
                          <Input
                            type="number"
                            min={0}
                            step={0.5}
                            className="h-7 text-xs"
                            value={hours.travelInHours}
                            onChange={(e) =>
                              setHoursField(techId, 'travelInHours', Number(e.target.value) || 0)
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Travel out (hrs)</span>
                          <Input
                            type="number"
                            min={0}
                            step={0.5}
                            className="h-7 text-xs"
                            value={hours.travelOutHours}
                            onChange={(e) =>
                              setHoursField(techId, 'travelOutHours', Number(e.target.value) || 0)
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Production (hrs)</span>
                          <Input
                            type="number"
                            min={0}
                            step={0.5}
                            className="h-7 text-xs"
                            value={hours.productionHours}
                            onChange={(e) =>
                              setHoursField(techId, 'productionHours', Number(e.target.value) || 0)
                            }
                          />
                        </label>
                      </div>
                    </div>
                  );
                }}
              />
            </section>

            {/* Logistics & details */}
            <section>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-tight text-foreground">
                Logistics &amp; details
              </h3>
              <div className="grid gap-4 rounded-lg border bg-background p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
                {/* Vehicle */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                    Vehicle
                  </label>
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
                </div>

                {/* Managing Lab */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                    Managing Lab
                  </label>
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
                </div>

                {/* Canada-only fields */}
                {job.location === 'Canada' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                        Outside Sales
                      </label>
                      <Input
                        className="h-8 text-xs"
                        placeholder="—"
                        value={draftOutsideSales}
                        onChange={(e) => setDraftOutsideSales(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                        Managed By
                      </label>
                      <Input
                        className="h-8 text-xs"
                        value={draftManagedBy}
                        onChange={(e) => setDraftManagedBy(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                        Posted Invoice
                      </label>
                      <Input
                        className="h-8 text-xs"
                        value={draftPostedInvoice}
                        onChange={(e) => setDraftPostedInvoice(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                        Service Checklists
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Pre-Service</span>
                          <Textarea
                            className="min-h-[50px] text-xs"
                            value={draftPreServiceChecklist}
                            onChange={(e) => setDraftPreServiceChecklist(e.target.value)}
                          />
                        </label>
                        <label className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-muted-foreground">Post-Service</span>
                          <Textarea
                            className="min-h-[50px] text-xs"
                            value={draftPostServiceChecklist}
                            onChange={(e) => setDraftPostServiceChecklist(e.target.value)}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                        Documents
                      </label>
                      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-2">
                        <span className="text-xs text-muted-foreground">No files found</span>
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
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Comments */}
            <section>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-tight text-foreground">
                Comments
              </h3>
              <CommentThread
                comments={job.comments}
                onAdd={(text) => addJobComment(job.id, text)}
              />
            </section>
          </div>
        </div>


        {/* Footer */}
        <DialogFooter className="shrink-0 border-t px-6 py-4">
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
