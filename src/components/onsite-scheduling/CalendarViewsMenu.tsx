/**
 * PROTOTYPE ONLY — the Views popover and Clear button (D31).
 *
 * Split out of CalendarFilterBar 2026-08-19 (direct user request) so both
 * sit in Calendar's month toolbar, immediately left of "+ New", rather than
 * at the right end of the filter row. They're actions, and the toolbar is
 * where this screen's other action already lives; the filter row below is
 * for the filter controls and the state readout.
 *
 * The whole saved-view lifecycle (save, pick, star as default, delete) lives
 * in this one popover rather than a settings screen, since it's four
 * controls and nothing else needs a screen of its own.
 */
import React, { useState } from 'react';
import { BookmarkPlus, RotateCcw, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  activeFilterCount,
  EMPTY_FILTERS,
  SAVED_VIEW_CAP,
  type CalendarFilters,
  type SavedView,
  type SavedViewsApi,
} from '@/lib/onsite-scheduling/saved-views';
import DecisionTag from './DecisionTag';

interface Props {
  filters: CalendarFilters;
  onChange: (next: CalendarFilters) => void;
  savedViews: SavedViewsApi;
  activeViewId: string | null;
  onSelectView: (view: SavedView | null) => void;
  showViews?: boolean;
}

const CalendarViewsMenu: React.FC<Props> = ({
  filters,
  onChange,
  savedViews,
  activeViewId,
  onSelectView,
  showViews = true,
}) => {
  const [newViewName, setNewViewName] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);

  const count = activeFilterCount(filters);

  const handleSave = () => {
    const result = savedViews.saveView(newViewName, filters);
    if (result.ok) {
      setNewViewName('');
      setSaveError(null);
      setSaveOpen(false);
      onSelectView(result.view);
      return;
    }
    setSaveError(
      result.reason === 'at-cap'
        ? `You already have ${SAVED_VIEW_CAP} saved views. Delete one below to save another.`
        : result.reason === 'duplicate-name'
          ? 'A view with that name already exists.'
          : 'Give the view a name.'
    );
  };

  return (
    <>
      <Popover open={saveOpen} onOpenChange={setSaveOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
            <BookmarkPlus className="h-3.5 w-3.5" />
            Views
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1 font-medium">
                Save current filters as a view
                <DecisionTag decisionId="D31" />
              </span>
              <div className="flex gap-1.5">
                <Input
                  value={newViewName}
                  onChange={(e) => {
                    setNewViewName(e.target.value);
                    setSaveError(null);
                  }}
                  placeholder="e.g. My week, Wichita mechanical"
                  className="h-8 text-xs"
                />
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleSave}
                  disabled={savedViews.atCap}
                >
                  Save
                </Button>
              </div>
              <span
                className={cn(
                  'text-[11px]',
                  savedViews.atCap ? 'text-red-600' : 'text-muted-foreground'
                )}
              >
                {savedViews.remainingSlots} of {SAVED_VIEW_CAP} personal view slots left.
                Built-in views don't count.
              </span>
              {saveError && <span className="text-[11px] text-red-600">{saveError}</span>}
            </div>

            {savedViews.personalViews.length > 0 && (
              <div className="flex flex-col gap-1.5 border-t pt-2">
                <span className="font-medium">Your views</span>
                {savedViews.personalViews.map((v) => (
                  <div key={v.id} className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="flex-1 truncate text-left hover:underline"
                      onClick={() => {
                        onSelectView(v);
                        setSaveOpen(false);
                      }}
                    >
                      {v.name}
                    </button>
                    <button
                      type="button"
                      title={
                        savedViews.defaultViewId === v.id
                          ? 'Default view — click to clear'
                          : 'Make this the view that loads on open'
                      }
                      onClick={() =>
                        savedViews.setDefaultView(
                          savedViews.defaultViewId === v.id ? null : v.id
                        )
                      }
                      className="p-0.5 text-muted-foreground hover:text-amber-500"
                    >
                      <Star
                        className={cn(
                          'h-3.5 w-3.5',
                          savedViews.defaultViewId === v.id &&
                            'fill-amber-400 text-amber-500'
                        )}
                      />
                    </button>
                    <button
                      type="button"
                      title="Delete this view"
                      onClick={() => savedViews.deleteView(v.id)}
                      className="p-0.5 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-1 border-t pt-2 text-[11px] text-muted-foreground">
              <span>
                Built-in views can't be deleted and don't use a slot. Star any of your own
                to make it load on open.
              </span>
              <span>
                One calendar, filtered — not a separate calendar per location. Whether a
                scheduler should be <em>able</em> to see other locations at all is a
                permissions question, still open (N19).
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1 text-xs"
        onClick={() => {
          onChange({ ...EMPTY_FILTERS });
          onSelectView(null);
        }}
        disabled={count === 0 && !activeViewId}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Clear
      </Button>
    </>
  );
};

export default CalendarViewsMenu;
