/**
 * PROTOTYPE ONLY — "which van should run this job?" suggestion (D32).
 *
 * Renders van-suggestion.ts's ranking next to the Vehicle picker so the
 * suggestion sits where the decision is actually made, rather than in a
 * separate screen someone has to remember to open.
 *
 * Every number here is labeled as a stand-in on screen, not just in a
 * comment. That's deliberate and it's the whole reason this is safe to
 * demo: Torqueware's real version silently falls back to zero distance when
 * its mapping lookup fails, which reads as "next door" and is exactly the
 * failure mode a visible label prevents. A stakeholder should never have to
 * ask whether a number on this panel is real.
 *
 * What this does NOT claim to do, called out in the UI as well as here: it
 * doesn't rank by profit. Dan's actual ask was the most profitable path.
 * That needs labour rate, per diem, and MSA-vs-list pricing (N17, N18) and
 * none of it exists in this build.
 */
import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSchedulingData } from '@/context/SchedulingDataContext';
import { suggestVans } from '@/lib/onsite-scheduling/van-suggestion';
import type { ScheduledJob } from '@/lib/onsite-scheduling/types';
import DecisionTag from './DecisionTag';

interface Props {
  job: Pick<ScheduledJob, 'id' | 'accounts' | 'location' | 'startDate' | 'endDate'>;
  /** Currently-selected vehicle, so the panel can mark it rather than making
   * someone cross-reference the dropdown. */
  selectedVehicleId?: string;
  onPick: (vehicleId: string) => void;
}

const VanSuggestionPanel: React.FC<Props> = ({ job, selectedVehicleId, onPick }) => {
  const { jobs, nonServiceEntries, technicians } = useSchedulingData();
  const [open, setOpen] = useState(false);

  const { site, suggestions } = useMemo(
    () => suggestVans(job, { jobs, nonServiceEntries, technicians }),
    [job, jobs, nonServiceEntries, technicians]
  );

  const best = suggestions[0];
  const technicianName = (id: string) => technicians.find((t) => t.id === id)?.name ?? id;

  return (
    <div className="rounded-md border border-dashed border-sky-300 bg-sky-50/60 p-2 dark:bg-sky-950/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 text-left text-xs font-medium text-foreground"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
        )}
        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-sky-700" />
        Suggest a van by location
        <Badge
          variant="outline"
          className="ml-1 h-4 border-amber-400 bg-amber-50 px-1.5 text-[10px] font-semibold uppercase text-amber-700 dark:bg-amber-950"
        >
          stand-in data
        </Badge>
        <DecisionTag decisionId="D32" />
      </button>

      {!open && best && (
        <p className="mt-1 pl-6 text-[11px] text-muted-foreground">
          Closest available: <span className="font-medium">{best.vehicleName}</span> ·{' '}
          {best.rationale}
        </p>
      )}

      {open && (
        <div className="mt-2 flex flex-col gap-2 pl-6">
          {!site && (
            <p className="flex items-start gap-1.5 text-[11px] text-amber-700">
              <TriangleAlert className="mt-0.5 h-3 w-3 flex-shrink-0" />
              This job has no city on any account, so there's nothing to measure from.
              Distance shows as unknown below rather than defaulting to zero — a
              zero-distance fallback is the bug Torqueware's own version has.
            </p>
          )}
          {site && (
            <p className="text-[11px] text-muted-foreground">
              Measuring from <span className="font-medium">{site.label}</span> (the first
              account's city, standing in for a geocoded site address) to each van's home
              base, {job.startDate} to {job.endDate}.
            </p>
          )}

          <ul className="flex flex-col gap-1">
            {suggestions.map((s, idx) => {
              const staffed = s.availableTechnicianIds.length > 0;
              const isSelected = s.vehicleId === selectedVehicleId;
              return (
                <li
                  key={s.vehicleId}
                  className={cn(
                    'flex items-start justify-between gap-2 rounded-sm border bg-white px-2 py-1.5 dark:bg-background',
                    isSelected && 'border-sky-500 ring-1 ring-sky-400',
                    !staffed && 'opacity-70'
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                      {idx === 0 && staffed && (
                        <Badge className="h-4 bg-sky-600 px-1.5 text-[10px] hover:bg-sky-600">
                          Best fit
                        </Badge>
                      )}
                      <span className="truncate">{s.vehicleName}</span>
                      <span className="text-muted-foreground">· {s.homeLocation}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{s.rationale}</p>
                    {staffed && (
                      <p className="text-[11px] text-emerald-700">
                        Free: {s.availableTechnicianIds.map(technicianName).join(', ')}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={isSelected ? 'secondary' : 'outline'}
                    className="h-6 flex-shrink-0 px-2 text-[11px]"
                    onClick={() => onPick(s.vehicleId)}
                    disabled={isSelected}
                  >
                    {isSelected ? 'Assigned' : 'Use'}
                  </Button>
                </li>
              );
            })}
          </ul>

          <p className="border-t pt-1.5 text-[11px] text-muted-foreground">
            Ranks by <span className="font-medium">technician availability first</span>,
            then straight-line distance, with the spare van last on purpose. It does{' '}
            <span className="font-medium">not</span> rank by profit — that needs labour
            rate, per diem, and the MSA-vs-list pricing split, none of which exist here
            (N17, N18). Real drive time needs a mapping service and a sourcing decision
            (N19).
          </p>
        </div>
      )}
    </div>
  );
};

export default VanSuggestionPanel;
