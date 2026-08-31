/**
 * PROTOTYPE ONLY — technician assignment editor (D26, replacing the
 * original always-expanded roster checklist from earlier in this pass).
 *
 * Restructured to match the real app's actual pattern (`Technicians.tsx`,
 * the "TECHNICIAN ASSIGNMENTS" table on the real Detail page) instead of
 * showing the entire roster expanded at all times: only ASSIGNED
 * technicians render inline; a "+ Add Technician" control opens a
 * searchable popover to add more. Chosen directly over the previous
 * design because the always-expanded list doesn't scale as the roster
 * grows across all three sites (confirmed against the real
 * `Technicians.tsx`, which uses the same Popover+search shape, not a
 * plain expanded list either).
 *
 * Location-aware search (also D26): when `jobLocation` is provided, the
 * add-search defaults to that site's technicians first, with a one-click
 * "Show all locations" to broaden — never a restriction on who CAN be
 * assigned (D1 stays open-by-default), just a usability default. This is
 * a PROTOTYPE-ONLY demonstration of the idea: the real
 * `GET /onsite-project/tech-options` payload has no location field at all
 * to filter by server-side — see N7, still unresolved.
 *
 * Decisions surfaced inline (see mock-data.ts openDecisions):
 *  - D1: capability tags shown, nothing restricted by them.
 *  - D2: advisory same-day-job count, never a hard cap.
 *  - D4: conflicts shown as a warning with an "Assign Anyway" affordance —
 *        there is no separate approval gate, adding is never blocked.
 *  - D26: this restructure + the location-aware search default.
 */
import React, { useState } from 'react';
import { AlertTriangle, Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useSchedulingData } from '@/context/SchedulingDataContext';
import {
  describeConflictDetailed,
  getTechnicianConflicts,
  type DateRange,
} from '@/lib/onsite-scheduling/conflict-check';
import DecisionTag from './DecisionTag';

interface TechnicianRosterPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  dateRange: DateRange;
  excludeJobId?: string;
  /** Id of the non-service entry currently being edited, so it doesn't
   * flag itself as conflicting with its own stored date range (the
   * self-conflict bug fixed alongside D13 — see conflict-check.ts). */
  excludeEntryId?: string;
  /** The job/entry's own site — when provided, the add-search defaults to
   * showing this location's technicians first (D26). Omit to show every
   * technician unfiltered (e.g. non-service entries have no job site). */
  jobLocation?: string;
  /** Extra content rendered inside each ASSIGNED technician's row, after
   * the conflict info — used by JobDetailDialog to inline travel-in/out +
   * production hours per technician instead of a separate section (D26). */
  renderTechExtra?: (techId: string) => React.ReactNode;
}

const TechnicianRosterPicker: React.FC<TechnicianRosterPickerProps> = ({
  selectedIds,
  onChange,
  dateRange,
  excludeJobId,
  excludeEntryId,
  jobLocation,
  renderTechExtra,
}) => {
  const { technicians, jobs, nonServiceEntries } = useSchedulingData();
  const [addOpen, setAddOpen] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(!jobLocation);
  const [searchQuery, setSearchQuery] = useState('');

  // A typed search overrides the location default — collapsing "other
  // locations" out of the DOM would otherwise make searching for a
  // specific technician by name silently return nothing if they're not
  // at this job's site, with no indication why. Browsing (empty query)
  // still respects the location-first default.
  const effectiveShowAll = showAllLocations || searchQuery.trim().length > 0;

  const conflictsFor = (techId: string) =>
    getTechnicianConflicts(
      techId,
      dateRange,
      { jobs, nonServiceEntries },
      excludeJobId,
      excludeEntryId
    );

  const add = (id: string) => {
    if (!selectedIds.includes(id)) onChange([...selectedIds, id]);
  };
  const remove = (id: string) => onChange(selectedIds.filter((x) => x !== id));

  const assigned = selectedIds
    .map((id) => technicians.find((t) => t.id === id))
    .filter((t): t is (typeof technicians)[number] => !!t);

  const candidates = technicians.filter((t) => !selectedIds.includes(t.id));
  const localCandidates = jobLocation
    ? candidates.filter((t) => t.location === jobLocation)
    : candidates;
  const otherCandidates = jobLocation
    ? candidates.filter((t) => t.location !== jobLocation)
    : [];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          Technicians
          <DecisionTag decisionId="D1" />
          <DecisionTag decisionId="D2" />
          <DecisionTag decisionId="D4" />
          <DecisionTag decisionId="D26" />
        </span>

        <Popover
          open={addOpen}
          onOpenChange={(next) => {
            setAddOpen(next);
            if (!next) setSearchQuery('');
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px]">
              <Plus className="h-3 w-3" />
              Add Technician
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="end">
            <Command>
              <CommandInput
                placeholder="Search technicians…"
                className="h-8 text-xs"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty className="py-4 text-xs text-muted-foreground">
                  No technicians found.
                </CommandEmpty>
                {localCandidates.length > 0 && (
                  <CommandGroup
                    heading={
                      jobLocation ? `${jobLocation} (this job's site)` : 'Technicians'
                    }
                  >
                    {localCandidates.map((tech) => (
                      <TechCommandItem
                        key={tech.id}
                        tech={tech}
                        hasConflict={conflictsFor(tech.id).conflicts.length > 0}
                        onSelect={() => add(tech.id)}
                      />
                    ))}
                  </CommandGroup>
                )}
                {jobLocation && otherCandidates.length > 0 && !effectiveShowAll && (
                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => setShowAllLocations(true)}
                      className="w-full rounded-sm px-2 py-1.5 text-left text-[11px] text-muted-foreground hover:bg-muted"
                    >
                      Show all locations ({otherCandidates.length} more)
                    </button>
                  </div>
                )}
                {jobLocation && otherCandidates.length > 0 && effectiveShowAll && (
                  <CommandGroup heading="Other locations">
                    {otherCandidates.map((tech) => (
                      <TechCommandItem
                        key={tech.id}
                        tech={tech}
                        hasConflict={conflictsFor(tech.id).conflicts.length > 0}
                        onSelect={() => add(tech.id)}
                      />
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {assigned.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Unassigned — no technician on this job yet.
        </p>
      ) : (
        <div className="space-y-1.5">
          {assigned.map((tech) => {
            const result = conflictsFor(tech.id);
            const hasConflict = result.conflicts.length > 0;
            return (
              <div
                key={tech.id}
                className={cn(
                  'rounded-md border px-2 py-1.5 text-xs',
                  hasConflict
                    ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30'
                    : 'border-border'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">{tech.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {tech.location}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {tech.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-foreground/70"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                    {result.sameDayJobCount > 0 && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Advisory: already on {result.sameDayJobCount} other job
                        {result.sameDayJobCount > 1 ? 's' : ''} in this window.
                      </p>
                    )}
                    {hasConflict && (
                      <div className="mt-1 space-y-1">
                        {result.conflicts.map((conflict, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-400"
                          >
                            <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                            <span>
                              {describeConflictDetailed(tech.name, conflict, dateRange)}
                            </span>
                          </div>
                        ))}
                        {/* Warning, not a block (D4/Rule 8) — Add never
                            checks this, and removing is always available.
                            Shown unconditionally, not gated on other techs
                            being available, so it still works for a 1-2
                            person team with no alternative to offer. */}
                        <p className="flex items-center gap-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-400">
                          <Check className="h-3 w-3" /> Assigned anyway — you can still
                          proceed.
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(tech.id)}
                    aria-label={`Remove ${tech.name}`}
                    className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {renderTechExtra?.(tech.id)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** One row inside the add-search popover — a compact preview (name,
 * location, a conflict hint) since the full detailed conflict message
 * only shows once a technician is actually assigned, below. */
const TechCommandItem: React.FC<{
  tech: { id: string; name: string; location: string };
  hasConflict: boolean;
  onSelect: () => void;
}> = ({ tech, hasConflict, onSelect }) => (
  <CommandItem
    value={`${tech.name} ${tech.location}`}
    onSelect={onSelect}
    className="flex items-center justify-between gap-2 text-xs"
  >
    <span className="flex items-center gap-1.5">
      {hasConflict && <AlertTriangle className="h-3 w-3 flex-shrink-0 text-amber-500" />}
      {tech.name}
    </span>
    <span className="text-[10px] text-muted-foreground">{tech.location}</span>
  </CommandItem>
);

export default TechnicianRosterPicker;
