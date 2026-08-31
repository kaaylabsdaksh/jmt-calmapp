import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useSchedulingData } from "@/context/SchedulingDataContext";
import { NON_SERVICE_TYPES, NonServiceEntry, NonServiceType } from "@/lib/onsite/schedulingData";
import TechnicianRosterPicker from "./TechnicianRosterPicker";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing entry to edit, or null to create. */
  entry: NonServiceEntry | null;
  /** Default start date for a new entry (the day that was clicked). */
  defaultDate: string;
}

export const NonServiceEntryDialog = ({ open, onOpenChange, entry, defaultDate }: Props) => {
  const { upsertEntry, deleteEntry } = useSchedulingData();
  const [type, setType] = useState<NonServiceType>("PTO");
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [technicianIds, setTechnicianIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setType(entry?.type ?? "PTO");
    setStartDate(entry?.startDate ?? defaultDate);
    setEndDate(entry?.endDate ?? defaultDate);
    setTechnicianIds(entry?.technicianIds ?? []);
    setNotes(entry?.notes ?? "");
  }, [open, entry, defaultDate]);

  const handleSave = () => {
    if (technicianIds.length === 0) {
      toast({ variant: "destructive", title: "Select at least one technician." });
      return;
    }
    if (!startDate || !endDate || startDate > endDate) {
      toast({ variant: "destructive", title: "End date must be on or after the start date." });
      return;
    }
    upsertEntry({
      id: entry?.id ?? `ns-${Date.now()}`,
      type,
      startDate,
      endDate,
      technicianIds,
      notes: notes.trim() || undefined,
    });
    toast({ variant: "success", title: entry ? "Entry updated." : "Non-service entry created.", duration: 2000 });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {entry ? "Edit non-service entry" : "New non-service entry"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2.5">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select value={type} onValueChange={(v) => setType(v as NonServiceType)}>
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {NON_SERVICE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {entry && entry.type !== type && (
                <p className="text-[10px] text-amber-700">
                  Changing the type reclassifies this entry and its color on the calendar.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Start date
                </Label>
                <ModernDatePicker
                  size="sm"
                  value={startDate}
                  onChange={(d) => setStartDate(d ? format(d, "yyyy-MM-dd") : "")}
                />
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  End date
                </Label>
                <ModernDatePicker
                  size="sm"
                  value={endDate}
                  onChange={(d) => setEndDate(d ? format(d, "yyyy-MM-dd") : "")}
                />
              </div>
            </div>

            <TechnicianRosterPicker
              selected={technicianIds}
              onChange={setTechnicianIds}
              startDate={startDate}
              endDate={endDate}
              excludeEntryId={entry?.id}
            />

            <div className="space-y-0.5">
              <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-[11px] min-h-[56px]"
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <div>
              {entry && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={handleSave}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              This removes the {entry?.type} entry from the calendar. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-xs bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (entry) deleteEntry(entry.id);
                setConfirmDelete(false);
                onOpenChange(false);
                toast({ title: "Entry deleted.", duration: 2000 });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NonServiceEntryDialog;
