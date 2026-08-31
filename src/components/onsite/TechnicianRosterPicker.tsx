import { AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSchedulingData } from "@/context/SchedulingDataContextV2";
import { getTechnicianConflicts } from "@/lib/onsite/schedulingData";

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
  startDate: string;
  endDate: string;
  excludeJobId?: string;
  excludeEntryId?: string;
}

export const TechnicianRosterPicker = ({
  selected,
  onChange,
  startDate,
  endDate,
  excludeJobId,
  excludeEntryId,
}: Props) => {
  const { jobs, entries, technicians } = useSchedulingData();

  const conflicts = getTechnicianConflicts(selected, startDate, endDate, jobs, entries, {
    excludeJobId,
    excludeEntryId,
  });

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Technicians <span className="text-destructive">*</span>
      </Label>
      <div className="rounded-md border divide-y">
        {technicians.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-2 px-2 py-1.5 text-[11px] cursor-pointer hover:bg-muted/50"
          >
            <Checkbox checked={selected.includes(t.id)} onCheckedChange={() => toggle(t.id)} />
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-semibold">
              {t.initials}
            </span>
            <span className="font-medium">{t.name}</span>
            <span className="ml-auto text-muted-foreground">{t.location}</span>
          </label>
        ))}
      </div>

      {conflicts.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1.5 space-y-1">
          {conflicts.map((c, i) => {
            const tech = technicians.find((t) => t.id === c.technicianId);
            return (
              <div key={i} className="flex items-start gap-1.5 text-[10.5px] text-amber-900">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                <span>
                  <span className="font-medium">{tech?.name}</span> already booked on{" "}
                  <span className="font-medium">{c.label}</span> ({c.range}) — assigned anyway.
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TechnicianRosterPicker;
