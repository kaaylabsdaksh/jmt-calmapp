/**
 * PROTOTYPE ONLY — create/edit dialog for the four non-service calendar
 * entry types (PTO, Travel, Out of Service, Tentative). FRD §6.4 US-2.
 */
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModernDatePicker } from '@/components/ui/modern-date-picker';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  NON_SERVICE_ENTRY_TYPES,
  type NonServiceEntry,
  type NonServiceEntryType,
} from '@/lib/onsite-scheduling/types';
import { useSchedulingData } from '@/context/SchedulingDataContext';
import TechnicianRosterPicker from './TechnicianRosterPicker';

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

interface NonServiceEntryDialogProps {
  entry: NonServiceEntry | null;

  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fills start/end when creating a new entry from a Calendar day
   * click (D10, built 2026-08-15) — ignored when editing an existing
   * entry, since that already has real dates. */
  defaultDate?: string;
}

const NonServiceEntryDialog: React.FC<NonServiceEntryDialogProps> = ({
  entry,
  open,
  onOpenChange,
  defaultDate,
}) => {
  const { addNonServiceEntry, updateNonServiceEntry, deleteNonServiceEntry } =
    useSchedulingData();
  const [type, setType] = useState<NonServiceEntryType>(entry?.type ?? 'PTO');
  const [technicianIds, setTechnicianIds] = useState<string[]>(
    entry?.technicianIds ?? []
  );
  const [startDate, setStartDate] = useState(
    entry?.startDate ?? defaultDate ?? '2026-08-11'
  );
  const [endDate, setEndDate] = useState(entry?.endDate ?? defaultDate ?? '2026-08-11');
  const [notes, setNotes] = useState(entry?.notes ?? '');
  const [showValidation, setShowValidation] = useState(false);

  const isValid =
    technicianIds.length > 0 && startDate && endDate && startDate <= endDate;

  const handleSave = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    const payload: NonServiceEntry = {
      id: entry?.id ?? `ns-${Date.now()}`,
      type,
      technicianIds,
      startDate,
      endDate,
      notes: notes || undefined,
    };
    if (entry) updateNonServiceEntry(payload);
    else addNonServiceEntry(payload);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (entry) deleteNonServiceEntry(entry.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center justify-between text-base font-semibold">
            <span>{entry ? 'Edit non-service entry' : 'New non-service entry'}</span>
            <Badge className="text-[10px]" variant="secondary">
              {type}
            </Badge>
          </DialogTitle>
          {/* Date header (direct user feedback, 2026-08-16) — same
              treatment as NewJobDialog, reflecting the live Start date
              value so it stays accurate as the field is edited. */}
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Dates:</span> {startDate} –{' '}
            {endDate} &nbsp;·&nbsp;{' '}
            {format(new Date(`${startDate}T00:00:00`), 'EEEE, MMMM d, yyyy')}
          </p>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-6 text-sm">
          <CardSection title="Entry Details">
            <div className="space-y-1">
              <Label className="text-xs">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as NonServiceEntryType)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NON_SERVICE_ENTRY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
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
                  value={startDate}
                  onChange={(d) => setStartDate(d ? format(d, 'yyyy-MM-dd') : '')}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End date</Label>
                <ModernDatePicker
                  size="sm"
                  value={endDate}
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

          <CardSection title="Technicians">
            <TechnicianRosterPicker
              selectedIds={technicianIds}
              onChange={setTechnicianIds}
              dateRange={{ startDate, endDate }}
              excludeEntryId={entry?.id}
            />
            {showValidation && technicianIds.length === 0 && (
              <p className="text-[11px] text-destructive">
                Select at least one technician
              </p>
            )}
          </CardSection>

          <CardSection title="Notes">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="min-h-[60px] text-xs"
            />
          </CardSection>
        </div>

        <DialogFooter className="flex items-center justify-between border-t bg-white px-6 py-4 sm:justify-between">
          {entry ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              {entry ? 'Save changes' : 'Create entry'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default NonServiceEntryDialog;
