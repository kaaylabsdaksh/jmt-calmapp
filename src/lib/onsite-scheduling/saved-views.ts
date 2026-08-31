/**
 * PROTOTYPE ONLY — Calendar filter state and saved views (D30/D31).
 *
 * Answers two questions that arrived together, and it matters that they're
 * answered separately:
 *
 * D30 — "Should there be a US calendar, a Canada calendar, an Alltite
 * calendar?" Built as ONE calendar with a Location filter, not three
 * calendars. A filter is a view; three calendars is a data partition. The
 * partition question (can a Canada scheduler even see US work, and is
 * Alltite a location inside this system or its own tenant) is a permissions
 * and architecture call that is genuinely open — see N19. Building three
 * boards now would presuppose that answer; building one filterable board
 * does not, and collapses cleanly into either outcome later.
 *
 * D31 — "What happens when a user has a million saved views?" Three
 * mechanics, deliberately boring:
 *  1. A hard cap (SAVED_VIEW_CAP). At the cap, Save is refused with a
 *     message naming what to delete, rather than silently overwriting the
 *     oldest or growing without limit.
 *  2. Starter views that ship with the app, can't be deleted, and don't
 *     count toward the cap — so the common cases (one location at a time,
 *     unconfirmed work only) never need to be hand-built by every user,
 *     which is where view sprawl actually comes from.
 *  3. One view can be marked default and loads on open. Without this,
 *     people rebuild the same filter every morning and save it again "just
 *     in case," which is the other source of sprawl.
 *
 * localStorage is a STAND-IN for a real per-user preferences endpoint. Same
 * pattern OpenDecisionsContext.tsx already uses. Strip-listed in
 * handoff/DEV-HANDOFF.md §7.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

/** Sentinel for "no filter applied" on a single-select filter. Matches the
 * `ALL` constant PrototypeListView already uses, deliberately — the two
 * surfaces share filter vocabulary so a view means the same thing on both. */
export const ALL_FILTER = '__all__';

export interface CalendarFilters {
  location: string;
  division: string;
  technicianId: string;
  /** Red / Partial / Green — the derived readiness axis (D28), not the
   * lifecycle one. Kept to one status axis on Calendar rather than List's
   * two, since a calendar bar already shows lifecycle as an overlay. */
  readiness: string;
  search: string;
  hideCompleted: boolean;
}

export const EMPTY_FILTERS: CalendarFilters = {
  location: ALL_FILTER,
  division: ALL_FILTER,
  technicianId: ALL_FILTER,
  readiness: ALL_FILTER,
  search: '',
  hideCompleted: false,
};

export interface SavedView {
  id: string;
  name: string;
  filters: CalendarFilters;
  /** Ships with the app: undeletable, uncounted against the cap. */
  starter?: boolean;
}

/**
 * Six. Not a researched number — a system decision, and the most
 * provisional kind. The reasoning: a cap has to be low enough that the
 * list stays scannable in a dropdown without a search box, and the three
 * starters already cover per-location work, so six personal views on top
 * is generous for a scheduler who works one region. If real users hit this
 * constantly, that's the signal the starters are wrong, not that the cap
 * is too low. Logged as D31 for exactly that reason.
 */
export const SAVED_VIEW_CAP = 6;

/**
 * Starter views. The three location ones exist specifically to answer
 * "will there be a US calendar and a Canada calendar" with "yes, as views"
 * — a scheduler who only ever works Canada picks Canada once, marks it
 * default, and never sees anything else. Which is the practical outcome
 * three separate calendars would deliver, without the data partition.
 */
export const STARTER_VIEWS: SavedView[] = [
  {
    id: 'starter-all',
    name: 'All work',
    starter: true,
    filters: { ...EMPTY_FILTERS },
  },
  {
    id: 'starter-baton-rouge',
    name: 'Baton Rouge only',
    starter: true,
    filters: { ...EMPTY_FILTERS, location: 'Baton Rouge' },
  },
  {
    id: 'starter-wichita',
    name: 'Wichita only',
    starter: true,
    filters: { ...EMPTY_FILTERS, location: 'Wichita' },
  },
  {
    id: 'starter-canada',
    name: 'Canada only',
    starter: true,
    filters: { ...EMPTY_FILTERS, location: 'Canada' },
  },
  {
    id: 'starter-unconfirmed',
    name: 'Not ready (Red)',
    starter: true,
    filters: { ...EMPTY_FILTERS, readiness: 'Red', hideCompleted: true },
  },
];

export function filtersEqual(a: CalendarFilters, b: CalendarFilters): boolean {
  return (
    a.location === b.location &&
    a.division === b.division &&
    a.technicianId === b.technicianId &&
    a.readiness === b.readiness &&
    a.search.trim() === b.search.trim() &&
    a.hideCompleted === b.hideCompleted
  );
}

/** How many filters are actually narrowing the result — drives the "3
 * filters active" badge, so a user who has scrolled away from the toolbar
 * still knows the board isn't showing everything. That's the real hazard
 * with a filtered calendar: quietly missing work and not knowing it. */
export function activeFilterCount(f: CalendarFilters): number {
  let n = 0;
  if (f.location !== ALL_FILTER) n++;
  if (f.division !== ALL_FILTER) n++;
  if (f.technicianId !== ALL_FILTER) n++;
  if (f.readiness !== ALL_FILTER) n++;
  if (f.search.trim() !== '') n++;
  if (f.hideCompleted) n++;
  return n;
}

// PROTOTYPE ONLY - DO NOT MERGE TO MAIN — localStorage stands in for a real
// per-user preferences endpoint. See file header and DEV-HANDOFF.md §7.
const STORAGE_KEY = 'prototype.calendar.savedViews.v1';
const DEFAULT_VIEW_KEY = 'prototype.calendar.defaultViewId.v1';

interface StoredState {
  views: SavedView[];
  defaultViewId: string | null;
}

function readStored(): StoredState {
  const empty: StoredState = { views: [], defaultViewId: null };
  try {
    const rawViews = window.localStorage.getItem(STORAGE_KEY);
    const views: SavedView[] = rawViews ? JSON.parse(rawViews) : [];
    const defaultViewId = window.localStorage.getItem(DEFAULT_VIEW_KEY);
    if (!Array.isArray(views)) return empty;
    // Shallow-validate rather than trusting whatever is in storage — a
    // half-written or hand-edited entry would otherwise crash the board on
    // load, which is a bad way to lose a demo.
    const clean = views.filter(
      (v): v is SavedView =>
        !!v && typeof v.id === 'string' && typeof v.name === 'string' && !!v.filters
    );
    return { views: clean, defaultViewId: defaultViewId || null };
  } catch {
    return empty;
  }
}

function writeStored(state: StoredState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.views));
    if (state.defaultViewId) {
      window.localStorage.setItem(DEFAULT_VIEW_KEY, state.defaultViewId);
    } else {
      window.localStorage.removeItem(DEFAULT_VIEW_KEY);
    }
  } catch {
    // Storage full or blocked — the board still works, the views just
    // don't survive a reload. Not worth surfacing in a prototype.
  }
}

/* The `?: undefined` members are not decoration: this project compiles with
 * `strictNullChecks` off, where a discriminated union does not narrow on
 * `result.ok`. Declaring the absent member on each side keeps both branches
 * readable at the call site without a cast. */
export type SaveResult =
  | { ok: true; view: SavedView; reason?: undefined }
  | {
      ok: false;
      view?: undefined;
      reason: 'at-cap' | 'empty-name' | 'duplicate-name';
    };

export interface SavedViewsApi {
  /** Starters first, then personal views in creation order. */
  views: SavedView[];
  personalViews: SavedView[];
  defaultViewId: string | null;
  atCap: boolean;
  remainingSlots: number;
  saveView: (name: string, filters: CalendarFilters) => SaveResult;
  deleteView: (id: string) => void;
  renameView: (id: string, name: string) => void;
  setDefaultView: (id: string | null) => void;
  /** The view to load on mount: the default if one is set, else null. */
  initialView: SavedView | null;
}

export function useSavedViews(): SavedViewsApi {
  const [stored, setStored] = useState<StoredState>(() => readStored());

  useEffect(() => {
    writeStored(stored);
  }, [stored]);

  const views = useMemo(() => [...STARTER_VIEWS, ...stored.views], [stored.views]);

  // Validation reads the current state from the closure rather than from
  // inside the setStored updater. Assigning a return value inside an
  // updater looks tidy but isn't safe — React may call an updater twice
  // (StrictMode) or later than the caller reads the result, so the caller
  // can see a stale verdict. Save is only ever triggered from a click
  // handler, where `stored` is current.
  const saveView = useCallback(
    (name: string, filters: CalendarFilters): SaveResult => {
      const trimmed = name.trim();
      if (!trimmed) return { ok: false, reason: 'empty-name' };
      if (stored.views.length >= SAVED_VIEW_CAP) return { ok: false, reason: 'at-cap' };
      const clash = [...STARTER_VIEWS, ...stored.views].some(
        (v) => v.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (clash) return { ok: false, reason: 'duplicate-name' };
      const view: SavedView = {
        // Date.now()-based id — same stand-in as job-draft.ts's, and on the
        // same strip-list line.
        id: `view-${Date.now()}`,
        name: trimmed,
        filters: { ...filters },
      };
      setStored((prev) => ({ ...prev, views: [...prev.views, view] }));
      return { ok: true, view };
    },
    [stored.views]
  );

  const deleteView = useCallback((id: string) => {
    setStored((prev) => ({
      views: prev.views.filter((v) => v.id !== id),
      defaultViewId: prev.defaultViewId === id ? null : prev.defaultViewId,
    }));
  }, []);

  const renameView = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setStored((prev) => ({
      ...prev,
      views: prev.views.map((v) => (v.id === id ? { ...v, name: trimmed } : v)),
    }));
  }, []);

  const setDefaultView = useCallback((id: string | null) => {
    setStored((prev) => ({ ...prev, defaultViewId: id }));
  }, []);

  // Read once from the value present at mount, not reactively — a default
  // view is a starting point, not a lock. Changing the default mid-session
  // shouldn't yank the board out from under whoever set it.
  const [initialViewId] = useState(() => readStored().defaultViewId);
  const initialView = useMemo(
    () => views.find((v) => v.id === initialViewId) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialViewId]
  );

  return {
    views,
    personalViews: stored.views,
    defaultViewId: stored.defaultViewId,
    atCap: stored.views.length >= SAVED_VIEW_CAP,
    remainingSlots: Math.max(0, SAVED_VIEW_CAP - stored.views.length),
    saveView,
    deleteView,
    renameView,
    setDefaultView,
    initialView,
  };
}
