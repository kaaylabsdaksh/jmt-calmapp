/**
 * Saved Filters for the Onsite Scheduling List tab.
 *
 * Mirrors the Work Order screen's saved-filter control (bookmark trigger +
 * count badge, apply / star-as-default / delete, and a "+" save popover),
 * persisted to localStorage. Presentation-only — it just reads and writes
 * the List view's existing filter state.
 */
import React, { useEffect, useState } from 'react';
import { Bookmark, Check, ChevronDown, Plus, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

export interface ListFilterState {
  search?: string;
  location?: string;
  division?: string;
  salesCode?: string;
  technician?: string;
  technicianId?: string;
  readiness?: string;
  status?: string;
  hideCompleted?: boolean;
}

interface SavedListFilter {
  id: string;
  name: string;
  timestamp: number;
  state: ListFilterState;
}

function load(storeKey: string): SavedListFilter[] {
  try {
    return JSON.parse(localStorage.getItem(storeKey) || '[]');
  } catch {
    return [];
  }
}
function loadDefaultId(defaultKey: string): string | null {
  try {
    return localStorage.getItem(defaultKey);
  } catch {
    return null;
  }
}

interface Props {
  current: ListFilterState;
  onApply: (state: ListFilterState) => void;
  /** Namespace so the Calendar tab keeps its own saved filters. */
  storeKey?: string;
}

const ListSavedFilters: React.FC<Props> = ({
  current,
  onApply,
  storeKey = 'onsite-list',
}) => {
  const STORE_KEY = `${storeKey}-saved-filters`;
  const DEFAULT_KEY = `${storeKey}-default-filter`;
  const persist = (list: SavedListFilter[]) => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  };
  const [filters, setFilters] = useState<SavedListFilter[]>(() => load(STORE_KEY));
  const [defaultId, setDefaultId] = useState<string | null>(() =>
    loadDefaultId(DEFAULT_KEY)
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState('');

  // Auto-apply the starred default once on mount.
  useEffect(() => {
    if (!defaultId) return;
    const sf = filters.find((f) => f.id === defaultId);
    if (!sf) return;
    onApply(sf.state);
    setActiveId(sf.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDefault = (id: string) => {
    const next = defaultId === id ? null : id;
    setDefaultId(next);
    try {
      if (next) localStorage.setItem(DEFAULT_KEY, next);
      else localStorage.removeItem(DEFAULT_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="inline-flex items-center shadow-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            title="Saved filters"
            className="flex h-8 items-center gap-1.5 rounded-l-md border border-input bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 active:bg-muted"
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${activeId ? 'fill-slate-900 text-slate-900' : 'text-muted-foreground'}`}
            />
            {filters.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                {filters.length}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="z-[60] w-72 rounded-lg border bg-popover p-0 shadow-xl" align="end">
          <div className="border-b p-2.5">
            <p className="text-xs font-semibold text-foreground">Saved Filters</p>
            <p className="text-[11px] text-muted-foreground">
              Apply a saved filter. Star one to set as default — it loads automatically next time.
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {filters.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                No saved filters yet. Configure filters and click the + to save.
              </p>
            ) : (
              filters.map((sf) => {
                const isActive = sf.id === activeId;
                return (
                  <div
                    key={sf.id}
                    className={`group flex items-center gap-1 rounded-md border ${
                      isActive ? 'border-slate-900 bg-slate-900/5 shadow-sm' : 'border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onApply(sf.state);
                        setActiveId(sf.id);
                        setOpen(false);
                        toast({ title: 'Filter applied', description: sf.name });
                      }}
                      className={`flex-1 rounded-md px-2.5 py-2 text-left text-xs transition-colors ${
                        isActive ? '' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`flex items-center gap-1.5 font-medium ${
                            isActive ? 'text-slate-900' : 'text-foreground'
                          }`}
                        >
                          {isActive && <Check className="h-3.5 w-3.5" />}
                          {sf.name}
                        </div>
                        {sf.id === defaultId && (
                          <span className="inline-flex h-3.5 items-center gap-0.5 rounded-sm border border-slate-300 bg-white px-1 text-[8px] font-semibold uppercase leading-none tracking-tight text-slate-700">
                            <Star className="h-2 w-2 fill-slate-700" />
                            Default
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isActive ? 'font-medium text-slate-600' : 'text-muted-foreground'
                        }`}
                      >
                        {isActive
                          ? 'Currently applied to results'
                          : new Date(sf.timestamp).toLocaleDateString()}
                      </div>
                    </button>

                    <button
                      onClick={() => setDefault(sf.id)}
                      className={`rounded p-1.5 transition-all ${
                        defaultId === sf.id
                          ? 'text-slate-900 opacity-100 hover:bg-slate-100'
                          : 'text-muted-foreground opacity-0 hover:bg-muted hover:text-slate-900 group-hover:opacity-100'
                      }`}
                      aria-label="Set as default"
                      title={defaultId === sf.id ? 'Unset as default' : 'Set as default'}
                    >
                      <Star className={`h-3.5 w-3.5 ${defaultId === sf.id ? 'fill-slate-900' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        const updated = filters.filter((f) => f.id !== sf.id);
                        setFilters(updated);
                        persist(updated);
                        if (activeId === sf.id) setActiveId(null);
                        if (defaultId === sf.id) setDefault(sf.id);
                        toast({ title: 'Filter deleted', description: sf.name });
                      }}
                      className="mr-1 rounded p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      aria-label="Delete saved filter"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={saveOpen} onOpenChange={setSaveOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            title="Save current filters"
            className="flex h-8 items-center rounded-r-md border border-l-0 border-input bg-background px-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="z-[60] w-64 p-2.5" align="end">
          <p className="mb-2 text-xs font-semibold">Save current filters</p>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Filter name"
            className="h-8 text-xs"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setName('');
                setSaveOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs"
              disabled={!name.trim()}
              onClick={() => {
                const entry: SavedListFilter = {
                  id: `${Date.now()}`,
                  name: name.trim(),
                  timestamp: Date.now(),
                  state: current,
                };
                const updated = [entry, ...filters.filter((f) => f.name !== entry.name)];
                setFilters(updated);
                persist(updated);
                setActiveId(entry.id);
                setName('');
                setSaveOpen(false);
                toast({ title: 'Filter saved', description: entry.name });
              }}
            >
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ListSavedFilters;
