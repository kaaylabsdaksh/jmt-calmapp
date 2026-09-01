/**
 * PROTOTYPE ONLY — standalone "create a brand-new onsite job" dialog
 * (D10, built 2026-08-15).
 *
 * Until now the only way a ScheduledJob ever got created was
 * UnscheduledWorkQueue's per-row "Schedule" button, which requires a
 * pre-existing queue item — there was no path to schedule a job from
 * scratch directly from Calendar or List. This is that path, reached via
 * NewEntryChooser.
 *
 * Minimum fields at creation time, same precedent as
 * UnscheduledWorkQueue.tsx's ScheduleDialog (D12's "don't guess extra
 * fields here" scope) — everything else (additional accounts, contacts,
 * checklists, documents, comments) is editable once the job exists via
 * JobDetailDialog. Shares its default-job shape and validation rule with
 * that dialog via job-draft.ts (2026-08-15) rather than each reimplementing
 * it — see that file's header.
 */
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ModernDatePicker } from '@/components/ui/modern-date-picker';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSchedulingData } from '@/context/SchedulingDataContext';
import {
  JOB_DIVISIONS,
  JOB_LOCATIONS,
  JOB_VEHICLES,
  KNOWN_CUSTOMERS,
} from '@/lib/onsite-scheduling/mock-data';
import { buildDraftJob, isDraftJobValid } from '@/lib/onsite-scheduling/job-draft';
import TechnicianRosterPicker from './TechnicianRosterPicker';

/** Shared card shell — same treatment as JobDetailDialog /
 *  NonServiceEntryDialog so all three onsite dialogs read identically. */
const CardSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
    <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
      <div className="h-4 w-1 rounded-full bg-primary" />
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
    </div>
    <div className="space-y-3 p-4">{children}</div>
  </div>
);

interface NewJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fills start/end when opened from a Calendar day click; left to the
   * dialog's own default (today, matching CalendarView's hardcoded "today")
   * when opened from List's plain toolbar button. */
  defaultDate?: string;
}

const FALLBACK_DATE = '2026-08-11';

const NewJobDialog: React.FC<NewJobDialogProps> = ({
  open,
  onOpenChange,
  defaultDate,
}) => {
  const { addJob } = useSchedulingData();
  const initialDate = defaultDate ?? FALLBACK_DATE;
  const [customerName, setCustomerName] = useState<string>(KNOWN_CUSTOMERS[0]);
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(initialDate);
  const [location, setLocation] = useState<string>(JOB_LOCATIONS[0]);
  const [division, setDivision] = useState<string>(JOB_DIVISIONS[0]);
  const [salesCode, setSalesCode] = useState('');
  const [vehicleId, setVehicleId] = useState<string | undefined>(undefined);
  const [technicianIds, setTechnicianIds] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const isValid = isDraftJobValid({ startDate, endDate, technicianIds });

  const handleCreate = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    const job = buildDraftJob({
      customerName,
      startDate,
      endDate,
      location,
      division,
      salesCodes: salesCode.trim() ? [salesCode.trim()] : [],
      technicianIds,
      vehicleId,
    });
    addJob(job);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center justify-between text-base font-semibold">
            <span>New onsite job</span>
            <Badge className="text-[10px]" variant="secondary">
              {division}
            </Badge>
          </DialogTitle>
          {/* Date header (direct user feedback, 2026-08-16) — reflects the
              live Start date value, not just whatever date the dialog was
              opened with, so it stays accurate as the field is edited. */}
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Dates:</span> {startDate} –{' '}
            {endDate} &nbsp;·&nbsp;{' '}
            {startDate
              ? format(new Date(`${startDate}T00:00:00`), 'EEEE, MMMM d, yyyy')
              : '—'}

          </p>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-6 text-sm">
          <CardSection title="Job Details">
            <div className="space-y-1">
              <Label className="text-xs">Customer</Label>
              <Select value={customerName} onValueChange={setCustomerName}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {KNOWN_CUSTOMERS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Start date</Label>
                <ModernDatePicker
                  size="sm"
                  value={startDate ? `${startDate}T00:00:00` : undefined}
                  onChange={(d) => setStartDate(d ? format(d, 'yyyy-MM-dd') : '')}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End date</Label>
                <ModernDatePicker
                  size="sm"
                  value={endDate ? `${endDate}T00:00:00` : undefined}
                  onChange={(d) => setEndDate(d ? format(d, 'yyyy-MM-dd') : '')}
                />
                {showValidation && startDate > endDate && (
                  <p className="text-[11px] text-destructive">
                    End date cannot be before start date
                  </p>
                )}
              </div>
            </div>
          </CardSection>

          <CardSection title="Logistics">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_LOCATIONS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Division</Label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_DIVISIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Sales/Service code</Label>
                <Input
                  value={salesCode}
                  onChange={(e) => setSalesCode(e.target.value)}
                  placeholder="Optional"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vehicle</Label>
                <Select
                  value={vehicleId ?? '__none__'}
                  onValueChange={(v) => setVehicleId(v === '__none__' ? undefined : v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Unassigned</SelectItem>
                    {JOB_VEHICLES.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardSection>

          <CardSection title="Technicians">
            <TechnicianRosterPicker
              selectedIds={technicianIds}
              onChange={setTechnicianIds}
              dateRange={{ startDate, endDate }}
              jobLocation={location}
            />
            {showValidation && !isValid && (
              <p className="text-[11px] text-destructive">
                Pick a valid date range and at least one technician.
              </p>
            )}
          </CardSection>
        </div>

        <DialogFooter className="flex items-center justify-between border-t bg-white px-6 py-4 sm:justify-between">
          <span />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate}>
              Create job
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default NewJobDialog;
