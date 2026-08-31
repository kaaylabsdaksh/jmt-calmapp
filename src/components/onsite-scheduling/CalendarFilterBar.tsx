/**
 * PROTOTYPE ONLY — Calendar filter toolbar + saved views (D30/D31).
 *
 * Filter vocabulary is deliberately the SAME as PrototypeListView's
 * (Location, Division, Technician, Readiness, free-text search, hide
 * completed) rather than a Calendar-specific set. Two reasons: a saved view
 * means the same thing on either surface if these ever share views, and a
 * user shouldn't have to learn the board's filters separately from the
 * list's. List keeps its extra Sales/Service Code and lifecycle Status
 * filters, which are table concerns — a bar already shows lifecycle as an
 * overlay, and a sales code isn't legible at bar width.
 *
 * The "N filters active" badge is not decoration. The real hazard with a
 * filterable calendar is a scheduler quietly looking at two-thirds of the
 * work and not knowing it, which on a schedule board means a missed job,
 * not a cosmetic annoyance. The badge and the always-visible hidden-count
 * line exist for that.
 *
 * The Views popover and Clear button used to sit at the right end of this
 * row; they moved to Calendar's month toolbar next to "+ New" on 2026-08-19
 * (direct user request) and now live in CalendarViewsMenu.tsx. This file
 * keeps the filter controls and the state readout.
 */
import React from 'react';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  ALL_FILTER,
  activeFilterCount,
  filtersEqual,
  type CalendarFilters,
  type SavedView,
  type SavedViewsApi,
} from '@/lib/onsite-scheduling/saved-views';
import type { PrototypeTechnician } from '@/lib/onsite-scheduling/types';
import DecisionTag from './DecisionTag';

interface Props {
  filters: CalendarFilters;
  onChange: (next: CalendarFilters) => void;
  locations: string[];
  divisions: string[];
  technicians: PrototypeTechnician[];
  savedViews: SavedViewsApi;
  activeViewId: string | null;
  onSelectView: (view: SavedView | null) => void;
  /** Jobs shown vs. jobs that exist in the visible month — drives the
   * "N hidden by filters" line. */
  shownCount: number;
  totalCount: number;
  highlightedAnchorId: string | null;
}

const NO_VIEW = '__none__';

const CalendarFilterBar: React.FC<Props> = ({
  filters,
  onChange,
  locations,
  divisions,
  technicians,
  savedViews,
  activeViewId,
  onSelectView,
  shownCount,
  totalCount,
  highlightedAnchorId,
}) => {
  const count = activeFilterCount(filters);
  const hidden = totalCount - shownCount;
  const activeView = savedViews.views.find((v) => v.id === activeViewId) ?? null;
  // "Modified" matters: without it, someone tweaks a filter on top of a
  // saved view and later swears the view itself changed.
  const modified = !!activeView && !filtersEqual(activeView.filters, filters);

  const set = <K extends keyof CalendarFilters>(key: K, value: CalendarFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };
  return (
    <div
      id="decision-D30"
      className={cn(
        'flex flex-col gap-2 rounded-md border bg-white p-3 shadow-sm transition-shadow dark:bg-background',
        highlightedAnchorId === 'decision-D30' && 'ring-2 ring-amber-400'
      )}
    >
      <div className="flex flex-wrap items-end gap-2">
        {/* Saved view picker */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            View
            <DecisionTag decisionId="D31" />
          </label>
          <Select
            value={activeViewId ?? NO_VIEW}
            onValueChange={(value) =>
              onSelectView(
                value === NO_VIEW
                  ? null
                  : (savedViews.views.find((v) => v.id === value) ?? null)
              )
            }
          >
            <SelectTrigger className="h-8 w-48 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_VIEW}>Ad hoc (unsaved)</SelectItem>
              {savedViews.views.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                  {v.starter ? ' · built in' : ''}
                  {savedViews.defaultViewId === v.id ? ' · default' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            Location
            <DecisionTag decisionId="D30" />
          </label>
          <Select value={filters.location} onValueChange={(v) => set('location', v)}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>All locations</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-muted-foreground">
            Division
          </label>
          <Select value={filters.division} onValueChange={(v) => set('division', v)}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>All</SelectItem>
              {divisions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-muted-foreground">
            Technician
          </label>
          <Select
            value={filters.technicianId}
            onValueChange={(v) => set('technicianId', v)}
          >
            <SelectTrigger className="h-8 w-44 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>All</SelectItem>
              {technicians.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} · {t.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-muted-foreground">
            Readiness
          </label>
          <Select value={filters.readiness} onValueChange={(v) => set('readiness', v)}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>All</SelectItem>
              {(['Red', 'Partial', 'Green'] as const).map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-muted-foreground">Search</label>
          <Input
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Project # or account"
            className="h-8 w-52 text-xs"
          />
        </div>
      </div>

      {/* Always-on state line. A filtered board that looks unfiltered is
          the failure mode worth spending a row of pixels on. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Filter className="h-3 w-3" />
          {count === 0
            ? 'No filters — showing everything'
            : `${count} filter${count === 1 ? '' : 's'} active`}
        </span>
        {hidden > 0 && (
          <Badge
            variant="outline"
            className="h-4 border-amber-400 bg-amber-50 px-1.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950"
          >
            {hidden} job{hidden === 1 ? '' : 's'} hidden in this month
          </Badge>
        )}
        {activeView && (
          <span>
            View: <span className="font-medium">{activeView.name}</span>
            {modified && <span className="text-amber-700"> · modified, not saved</span>}
          </span>
        )}
        {/* D6's jump-to anchor moved here with the switch itself (it used to
            live in Calendar's month toolbar) — the decision log's
            jumpTo.anchorId is 'decision-D6', so this id has to keep
            existing on the Calendar tab or that jump silently lands
            nowhere. */}
        <span
          id="decision-D6"
          className={cn(
            'flex items-center gap-1.5 rounded px-1 transition-shadow',
            highlightedAnchorId === 'decision-D6' && 'ring-2 ring-amber-400'
          )}
        >
          <Switch
            checked={filters.hideCompleted}
            onCheckedChange={(v) => set('hideCompleted', v)}
            id="cal-hide-completed"
          />
          <label htmlFor="cal-hide-completed">Hide completed/cancelled</label>
          <DecisionTag decisionId="D6" />
        </span>
      </div>
    </div>
  );
};

export default CalendarFilterBar;
