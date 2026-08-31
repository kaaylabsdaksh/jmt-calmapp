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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New onsite job</DialogTitle>
          {/* Date header (direct user feedback, 2026-08-16) — reflects the
              live Start date value, not just whatever date the dialog was
              opened with, so it stays accurate as the field is edited.
              Shown on both this dialog and NonServiceEntryDialog for
              consistency, since either can be reached the same way (the
              shared "New…" chooser). */}
          <p className="text-xs text-muted-foreground">
            {format(new Date(`${startDate}T00:00:00`), 'EEEE, MMMM d, yyyy')}
          </p>
        </DialogHeader>
        <div className="space-y-3">
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
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs"
              />
              {showValidation && startDate > endDate && (
                <p className="text-[11px] text-destructive">
                  End date cannot be before start date
                </p>
              )}
            </div>
          </div>

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
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleCreate}>
            Create job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewJobDialog;
