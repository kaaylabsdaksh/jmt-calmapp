/**
 * PROTOTYPE ONLY — Unscheduled Work queue. Holds committed-but-unplaced
 * work, separate from List and Calendar (FRD §6.5). The only action is
 * "Schedule" — it prompts for real dates/technicians, creates a real Job on
 * the Calendar, and removes the queue entry. Feeding this queue from a real
 * CRM/quoting pipeline is out of scope this pass — seed data only.
 */
import React, { useState } from 'react';
import { CalendarPlus, Plus } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import EmptyRow from '@/components/ui/empty-row';
import { useSchedulingData } from '@/context/SchedulingDataContext';
import { buildDraftJob, isDraftJobValid } from '@/lib/onsite-scheduling/job-draft';
import { JOB_DIVISIONS, JOB_LOCATIONS } from '@/lib/onsite-scheduling/mock-data';
import type { UnscheduledWorkItem } from '@/lib/onsite-scheduling/types';
import DecisionTag from './DecisionTag';
import QuickAddWorkDialog from './QuickAddWorkDialog';
import TechnicianRosterPicker from './TechnicianRosterPicker';

const ScheduleDialog: React.FC<{
  item: UnscheduledWorkItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ item, open, onOpenChange }) => {
  const { scheduleWorkItem } = useSchedulingData();
  const [startDate, setStartDate] = useState(item.targetWindowStart);
  // Fixed (was item.targetWindowStart) — D13: End date silently defaulted to
  // the window's START, so an unnoticed Confirm created a single-day job out
  // of a multi-day request. See open-decisions-log.md D13 and the journey
  // doc's §10 note on uw-9 (the single-day row that made this impossible to
  // mistake for "the window was short anyway").
  const [endDate, setEndDate] = useState(item.targetWindowEnd);
  // D12 (built 2026-08-15) — Division/Location used to be silently guessed
  // here (division hardcoded to 'Unassigned', location inferred from
  // acctNum's "CA-" prefix) with no visible flag that they were guesses,
  // an inconsistency with this build's own "every default gets an amber
  // '?' tag" rule. Now explicit, editable fields, pre-filled with the same
  // guess as before (location falls back to the old acctNum-prefix
  // heuristic only when the item itself has no `location`, e.g. an item
  // seeded before D11 added that field) — the DecisionTag next to them
  // makes clear these were, and remain, a prototype-only default.
  const [location, setLocation] = useState<string>(
    item.location ?? (item.acctNum?.startsWith('CA-') ? 'Canada' : 'Baton Rouge')
  );
  const [division, setDivision] = useState<string>(JOB_DIVISIONS[0]);
  const [technicianIds, setTechnicianIds] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const isValid = isDraftJobValid({ startDate, endDate, technicianIds });

  const handleConfirm = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    const job = buildDraftJob({
      customerName: item.customerName,
      startDate,
      endDate,
      location,
      division,
      salesCodes: item.salesRepCode ? [item.salesRepCode] : [],
      technicianIds,
    });
    scheduleWorkItem(item.id, job);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule {item.customerName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Target window was {item.targetWindowStart} – {item.targetWindowEnd}. Pick real
            dates below to create the job.
          </p>
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
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="flex items-center gap-1 text-xs">
                Location <DecisionTag decisionId="D12" />
              </Label>
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
          <Button size="sm" onClick={handleConfirm}>
            Create job &amp; remove from queue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UnscheduledWorkQueue: React.FC = () => {
  const { unscheduledWork } = useSchedulingData();
  const [scheduling, setScheduling] = useState<UnscheduledWorkItem | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div
        id="decision-D7"
        className="flex flex-wrap items-center gap-2 rounded-md border bg-white p-3 shadow-sm dark:bg-background"
      >
        <h2 className="text-sm font-semibold text-foreground">Unscheduled Work</h2>
        <DecisionTag decisionId="D7" />
        <span className="text-xs text-muted-foreground">
          Committed-but-unplaced work. Not fed from a real CRM/quoting pipeline this pass
          — seed data only.
        </span>
        {/* D11 (built 2026-08-15) — quick-add lands directly in this queue
            with minimum fields, separate from the full Schedule action
            below which converts an existing item into a real job. */}
        <Button
          size="sm"
          variant="outline"
          className="ml-auto h-8 gap-1 text-xs"
          onClick={() => setQuickAddOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Quick add
          <DecisionTag decisionId="D11" />
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm dark:bg-background">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Acct #</TableHead>
              <TableHead>Target window</TableHead>
              <TableHead>Sales rep code</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unscheduledWork.length === 0 ? (
              <EmptyRow colSpan={7} />
            ) : (
              unscheduledWork.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.customerName}</TableCell>
                  <TableCell>{item.location ?? '—'}</TableCell>
                  <TableCell>{item.acctNum ?? '—'}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {item.targetWindowStart} – {item.targetWindowEnd}
                  </TableCell>
                  <TableCell>{item.salesRepCode ?? '—'}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted-foreground">
                    {item.notes ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setScheduling(item)}
                    >
                      <CalendarPlus className="mr-1.5 h-3.5 w-3.5" />
                      Schedule
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {scheduling && (
        <ScheduleDialog
          item={scheduling}
          open
          onOpenChange={(open) => !open && setScheduling(null)}
        />
      )}
      <QuickAddWorkDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
    </div>
  );
};

export default UnscheduledWorkQueue;
