/**
 * PROTOTYPE ONLY — Quick Add to Unscheduled Work (D11, built 2026-08-15).
 *
 * Captures the minimum fields (customer, site, rough window) and lands the
 * result directly in the Unscheduled Work queue, rather than requiring the
 * full Add-New form or a full Schedule action up front. D11's own evidence
 * for this: the NFR doc's finding that PO Number lives in free-text notes
 * ~23% of the time, plus the real Add New form's 12+ required top-level
 * fields — both suggest not everything is known at job intake today.
 *
 * Deliberately does NOT capture "job type" (part of D11's original literal
 * proposal) — every item in this queue is already implicitly an onsite job;
 * there's no type distinction modeled anywhere in UnscheduledWorkItem, and
 * inventing one here would be speculative. Account #, sales rep code, and
 * exact dates are exactly what stay unknown at this stage (see D12's
 * companion fix in UnscheduledWorkQueue.tsx's ScheduleDialog for the
 * corresponding "don't silently guess later" half of this).
 */
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSchedulingData } from '@/context/SchedulingDataContext';
import { JOB_LOCATIONS, KNOWN_CUSTOMERS } from '@/lib/onsite-scheduling/mock-data';
import DecisionTag from './DecisionTag';

interface QuickAddWorkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FALLBACK_DATE = '2026-08-11';

const QuickAddWorkDialog: React.FC<QuickAddWorkDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { addUnscheduledWorkItem } = useSchedulingData();
  const [customerName, setCustomerName] = useState<string>(KNOWN_CUSTOMERS[0]);
  const [location, setLocation] = useState<string>(JOB_LOCATIONS[0]);
  const [targetWindowStart, setTargetWindowStart] = useState(FALLBACK_DATE);
  const [targetWindowEnd, setTargetWindowEnd] = useState(FALLBACK_DATE);
  const [notes, setNotes] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const isValid =
    !!customerName &&
    !!targetWindowStart &&
    !!targetWindowEnd &&
    targetWindowStart <= targetWindowEnd;

  const handleAdd = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    addUnscheduledWorkItem({
      id: `uw-${Date.now()}`,
      customerName,
      location,
      targetWindowStart,
      targetWindowEnd,
      notes: notes.trim() || undefined,
      // acctNum/salesRepCode deliberately omitted — not known at quick-add
      // time; ScheduleDialog and the queue table both treat them as
      // optional (D11).
    });
    setCustomerName(KNOWN_CUSTOMERS[0]);
    setLocation(JOB_LOCATIONS[0]);
    setTargetWindowStart(FALLBACK_DATE);
    setTargetWindowEnd(FALLBACK_DATE);
    setNotes('');
    setShowValidation(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            Quick add to Unscheduled Work
            <DecisionTag decisionId="D11" />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Minimum fields only — account #, sales rep code, and real dates get filled in
            later when this is actually Scheduled.
          </p>
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
          <div className="space-y-1">
            <Label className="text-xs">Site</Label>
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Rough window start</Label>
              <Input
                type="date"
                value={targetWindowStart}
                onChange={(e) => setTargetWindowStart(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Rough window end</Label>
              <Input
                type="date"
                value={targetWindowEnd}
                onChange={(e) => setTargetWindowEnd(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
              className="min-h-16 text-xs"
            />
          </div>
          {showValidation && !isValid && (
            <p className="text-[11px] text-destructive">
              Pick a customer and a valid rough window.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleAdd}>
            Add to queue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddWorkDialog;
