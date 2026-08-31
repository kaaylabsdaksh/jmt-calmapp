/**
 * PROTOTYPE ONLY — shared "+ New" entry point (D10, built 2026-08-15).
 *
 * D10 flagged three separate, inconsistent add surfaces (List's full-page
 * Add New, Calendar's "+" for non-service entries only, Unscheduled Work's
 * per-row Schedule) and proposed one shared control with a type selector as
 * the first field. This is that selector — a small chooser that opens
 * either NewJobDialog or NonServiceEntryDialog (in create mode), both
 * pre-filled with whatever date the caller was anchored to (a Calendar day
 * click) or nothing (List's plain toolbar button).
 *
 * Unscheduled Work's own "Schedule" button is deliberately NOT folded into
 * this — it converts one specific existing queue item into a job, a
 * different action from creating a brand-new one from scratch, and D10's
 * own note left that unconfirmed rather than assuming it should merge too.
 */
import React from 'react';
import { format } from 'date-fns';
import { CalendarPlus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NewEntryChooserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChooseJob: () => void;
  onChooseNonService: () => void;
  /** The date this chooser was opened for (a Calendar day click) — shown
   * at the top so the same date context carries through to whichever
   * dialog gets opened next (direct user feedback, 2026-08-16: liked the
   * date header, wanted it consistent across the whole New flow, not just
   * one entry point). Omitted when opened from a toolbar button with no
   * specific day anchor. */
  defaultDate?: string;
}

const NewEntryChooser: React.FC<NewEntryChooserProps> = ({
  open,
  onOpenChange,
  onChooseJob,
  onChooseNonService,
  defaultDate,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>New Entry</DialogTitle>
        {defaultDate && (
          <p className="text-xs text-muted-foreground">
            {format(new Date(`${defaultDate}T00:00:00`), 'EEEE, MMMM d, yyyy')}
          </p>
        )}
      </DialogHeader>
      <div className="grid grid-cols-2 gap-2 py-2">
        <Button variant="outline" className="h-16 flex-col gap-1.5" onClick={onChooseJob}>
          <CalendarPlus className="h-4 w-4" />
          <span className="text-xs font-medium">Onsite Job</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex-col gap-1.5"
          onClick={onChooseNonService}
        >
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium">Non-Service Entry</span>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default NewEntryChooser;
