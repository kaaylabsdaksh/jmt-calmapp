/**
 * PROTOTYPE ONLY — Open Decisions tracking.
 *
 * Reviewed/resolution/comment state is now persisted to localStorage
 * (2026-08-15) so it survives a reload on the same browser — it previously
 * reset every time, which meant a stakeholder's actual calls during a demo
 * were never captured anywhere durable.
 *
 * That's still not the same as a shareable, committable record, though —
 * localStorage lives in one browser and never leaves it. The actual
 * shareable master file is /prototype/decisions/decision-results.md, a
 * machine-generated snapshot of this state (see `buildResultsMarkdown`
 * below) — regenerated wholesale on export, never hand-edited. Direct user
 * feedback, 2026-08-15: reviewing/commenting/setting a Call in this panel
 * should prompt exporting that snapshot, not rely on someone remembering
 * to transcribe it later. `needsExport` below tracks whether current state
 * has drifted from the last exported snapshot; the panel surfaces that as
 * a visible prompt (see OpenDecisionsPanel.tsx's export banner/dialog).
 *
 * This is separate from /prototype/decisions/open-decisions-log.md, which
 * stays the hand-authored narrative doc (what's proposed, why, what's
 * built) — that file is edited by hand as the prototype changes, same as
 * before; decision-results.md only ever holds the live Reviewed/Call/
 * Comments snapshot and is safe to fully regenerate.
 *
 * Open Decisions is a GLOBAL floating widget (mounted once at the app
 * root — see GlobalOpenDecisions.tsx), not scoped to the Scheduling shell
 * or any single tab, so it's reachable from anywhere in the app while
 * demoing. Because of that, "jump to context" navigates by URL (not a
 * page-local search param) — every current decision's on-screen anchor
 * lives inside the Scheduling shell, so jumping there means routing to it
 * from wherever the user currently is, closing the panel so the
 * highlighted default is actually visible.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { notBuiltItems, openDecisions, torquewareBacklogItems } from '@/lib/onsite-scheduling/mock-data';
import {
  SEEDED_DECISION_COMMENTS,
  SEEDED_DECISION_RESOLUTIONS,
  SEEDED_NOT_BUILT_COMMENTS,
} from '@/lib/onsite-scheduling/system-decisions-seed';
import type {
  DecisionComment,
  DecisionResolution,
  NotBuiltItem,
  OpenDecisionItem,
  QuestionResolution,
} from '@/lib/onsite-scheduling/types';

const STORAGE_PREFIX = 'jmt-open-decisions';

/** Exported (2026-08-15) so any other component persisting plain JSON to
 * localStorage — e.g. OpenDecisionsPanel.tsx's resizable-panel width —
 * reuses this same safe read/write pattern instead of reimplementing it. */
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Best-effort only — a private-browsing/storage-disabled session just
    // falls back to in-memory state for that visit, same as before.
  }
}

const LAST_EXPORTED_SNAPSHOT_KEY = `${STORAGE_PREFIX}-last-exported-snapshot`;

export type TrackedDecision = OpenDecisionItem & {
  reviewed: boolean;
  comments: DecisionComment[];
  resolution: DecisionResolution | null;
};

export type TrackedNotBuilt = NotBuiltItem & {
  reviewed: boolean;
  comments: DecisionComment[];
  resolution: QuestionResolution | null;
};

interface OpenDecisionsContextValue {
  decisions: TrackedDecision[];
  notBuilt: TrackedNotBuilt[];
  /** Phase 2 — Torqueware discovery items outside onsite/scheduling.
   * Deliberately NOT part of `decisions`, so the Phase 1 unreviewed-count
   * badge never counts these (see torqueware-non-scheduling-log.md). */
  backlogItems: typeof torquewareBacklogItems;
  toggleReviewed: (id: string) => void;
  addComment: (id: string, text: string) => void;
  setResolution: (id: string, resolution: DecisionResolution | null) => void;
  /** Same three actions as above, scoped to the N-numbered "not built,
   * pending" questions instead of the D-numbered decisions. */
  toggleNotBuiltReviewed: (id: string) => void;
  addNotBuiltComment: (id: string, text: string) => void;
  setNotBuiltResolution: (id: string, resolution: QuestionResolution | null) => void;
  /** Routes to the decision's on-screen anchor (closing the panel first) or,
   * if it has none, keeps the panel open and highlights its own card. */
  jumpToDecision: (decision: OpenDecisionItem) => void;
  /** Cycles through every decision in order, wrapping around. */
  cycleNext: () => void;
  highlightedAnchorId: string | null;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  /** True whenever Reviewed/Call/Comments state differs from what was last
   * successfully written to decision-results.md — normally only true for
   * the ~1s between a change and the debounced auto-save completing (see
   * `syncStatus`). */
  needsExport: boolean;
  /** Auto-save status against the local dev-server route
   * (prototype.decisionLogServerPlugin.ts) that writes
   * decision-results.md directly — 'idle' (nothing to save yet), 'saving'
   * (debounce fired, request in flight), 'saved' (last attempt succeeded),
   * 'error' (route unreachable/write failed — e.g. not running under
   * `npm run dev` — the panel falls back to manual download/copy). */
  syncStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSyncedAt: Date | null;
  /** The full, ready-to-save content of decision-results.md, regenerated
   * from current live state every time it's read. Used both for the
   * auto-save POST body and the manual-fallback export dialog. */
  resultsMarkdown: string;
  /** Call after the user has manually copied/downloaded the snapshot (the
   * fallback path) — records it as the new "last synced" baseline so
   * `needsExport` goes false until something changes again. The
   * auto-save path calls this itself on every successful write. */
  markExported: () => void;
}

const OpenDecisionsContext = createContext<OpenDecisionsContextValue | undefined>(
  undefined
);

const HIGHLIGHT_DURATION_MS = 1800;

function appendComment(
  prev: Record<string, DecisionComment[]>,
  id: string,
  text: string
): Record<string, DecisionComment[]> {
  const comment: DecisionComment = {
    id: `c-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    text,
    createdAt: new Date().toISOString(),
  };
  return { ...prev, [id]: [...(prev[id] ?? []), comment] };
}

/** Reviewed/comments/resolution tracking for one category of tracked item
 * (decisions or "not built" questions) — persisted to localStorage under
 * `${storagePrefix}-{reviewed,comments,resolutions}`. Both categories used
 * to duplicate this entire state/persistence/callback surface by hand
 * (six pieces of state, six callbacks, two near-identical useMemo
 * projections); this is that logic written once and instantiated twice
 * below, which is also why the key names below match exactly what the
 * duplicated version used to write — existing localStorage from before
 * this refactor keeps working, nothing resets. */
function useTrackedItems<R extends string>(
  storagePrefix: string,
  seed?: {
    resolutions?: Partial<Record<string, R>>;
    comments?: Record<string, DecisionComment[]>;
  }
) {
  const keys = useMemo(
    () => ({
      reviewed: `${storagePrefix}-reviewed`,
      comments: `${storagePrefix}-comments`,
      resolutions: `${storagePrefix}-resolutions`,
    }),
    [storagePrefix]
  );

  const [reviewedIds, setReviewedIds] = useState<Set<string>>(
    () => new Set(loadJSON<string[]>(keys.reviewed, []))
  );
  const [comments, setComments] = useState<Record<string, DecisionComment[]>>(() =>
    loadJSON(keys.comments, {})
  );
  const [resolutions, setResolutions] = useState<Record<string, R>>(() =>
    loadJSON(keys.resolutions, {})
  );

  useEffect(() => saveJSON(keys.reviewed, [...reviewedIds]), [keys, reviewedIds]);
  useEffect(() => saveJSON(keys.comments, comments), [keys, comments]);
  useEffect(() => saveJSON(keys.resolutions, resolutions), [keys, resolutions]);

  // One-time seed merge (2026-08-16) for the 2026-08-15 system-decision
  // pass, see system-decisions-seed.ts. NOT a loadJSON fallback — that
  // approach (tried first, and wrong) only helps a browser that has NEVER
  // touched this app at all, since loadJSON only falls back when a
  // localStorage key is entirely absent. This browser (and anyone who
  // opened the panel even once before this seed existed) already has real,
  // if empty, `{}` objects saved from the very first mount's save effects
  // above — so the key exists, loadJSON returns the empty object as-is, and
  // the fallback never triggers. This effect instead MERGES the seed into
  // whatever's already stored, filling only keys that are genuinely
  // missing (never overwriting a real value, including a real value of
  // "nothing" — see the version-flag guard below), and is gated by a
  // version flag so it runs exactly once ever: without that guard, a user
  // who deliberately clears an item back to "Not yet decided" (which
  // deletes its key — see setResolution below) would see it silently
  // reappear from the seed on every subsequent reload, which is exactly
  // the kind of silent-state problem this whole tracking system exists to
  // prevent. See PROTOTYPE-DECISION-LOG-PLAYBOOK.md §6a.
  useEffect(() => {
    if (!seed) return;
    const flagKey = `${storagePrefix}-seed-v1-applied`;
    if (loadJSON(flagKey, false)) return;
    if (seed.resolutions) {
      setResolutions((prev) => ({ ...(seed.resolutions as Record<string, R>), ...prev }));
    }
    if (seed.comments) {
      setComments((prev) => ({ ...seed.comments, ...prev }));
    }
    saveJSON(flagKey, true);
    // Intentionally run once on mount only — `seed` is a stable
    // module-level constant from the caller, not per-render state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleReviewed = useCallback((id: string) => {
    setReviewedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const addComment = useCallback((id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setComments((prev) => appendComment(prev, id, trimmed));
  }, []);

  const setResolution = useCallback((id: string, resolution: R | null) => {
    setResolutions((prev) => {
      const next = { ...prev };
      if (resolution) next[id] = resolution;
      else delete next[id];
      return next;
    });
  }, []);

  /** Projects a static item list (openDecisions/notBuiltItems) into its
   * Reviewed/comments/resolution-annotated form. Memoized separately per
   * call site on this function's own identity, which only changes when
   * reviewedIds/comments/resolutions actually change. */
  const track = useCallback(
    <T extends { id: string }>(
      items: T[]
    ): (T & { reviewed: boolean; comments: DecisionComment[]; resolution: R | null })[] =>
      items.map((item) => ({
        ...item,
        reviewed: reviewedIds.has(item.id),
        comments: comments[item.id] ?? [],
        resolution: resolutions[item.id] ?? null,
      })),
    [reviewedIds, comments, resolutions]
  );

  return {
    reviewedIds,
    comments,
    resolutions,
    toggleReviewed,
    addComment,
    setResolution,
    track,
  };
}

/** Snapshot string used to detect drift since the last export — plain
 * JSON.stringify over sorted keys so field order never causes a false
 * "changed" reading. */
function snapshotOf(
  reviewedIds: Set<string>,
  comments: Record<string, DecisionComment[]>,
  resolutions: Record<string, string>,
  notBuiltReviewedIds: Set<string>,
  notBuiltComments: Record<string, DecisionComment[]>,
  notBuiltResolutions: Record<string, string>
): string {
  return JSON.stringify({
    reviewedIds: [...reviewedIds].sort(),
    comments,
    resolutions,
    notBuiltReviewedIds: [...notBuiltReviewedIds].sort(),
    notBuiltComments,
    notBuiltResolutions,
  });
}

function formatComments(list: DecisionComment[]): string {
  if (list.length === 0) return '  - _(none)_';
  return list
    .map((c) => `  - [${new Date(c.createdAt).toLocaleString()}] ${c.text}`)
    .join('\n');
}

/** Builds the full, ready-to-save content of decision-results.md from
 * current live state (2026-08-15). Pure function of its inputs — safe to
 * call on every render; the caller decides when to actually show/save it.
 * This is the ONLY thing that ever writes decision-results.md's content —
 * that file is a regenerated snapshot, never hand-edited (see this file's
 * header and the file's own header for why). */
function buildResultsMarkdown(
  decisions: TrackedDecision[],
  notBuilt: TrackedNotBuilt[],
  exportedAt: Date
): string {
  const decisionBlocks = decisions
    .map(
      (d) =>
        `### ${d.id} — ${d.title}\n` +
        `- Reviewed: ${d.reviewed ? 'Yes' : 'No'}\n` +
        `- Call: ${d.resolution ?? 'Not yet decided'}\n` +
        `- Comments:\n${formatComments(d.comments)}`
    )
    .join('\n\n');

  const notBuiltBlocks = notBuilt
    .map(
      (item) =>
        `### ${item.id} — ${item.title}\n` +
        `- Reviewed: ${item.reviewed ? 'Yes' : 'No'}\n` +
        `- Status: ${item.resolution ?? 'Still open'}\n` +
        `- Comments:\n${formatComments(item.comments)}`
    )
    .join('\n\n');

  return (
    '# Onsite Scheduling Prototype — Decision Results Log\n\n' +
    '**Machine-generated — do not hand-edit.** This file is a snapshot of ' +
    'live state from the Open Decisions panel (Reviewed / Call / Status / ' +
    'Comments), regenerated wholesale on every export. For the narrative ' +
    "decision descriptions (what's proposed, why, what's built), see " +
    '`open-decisions-log.md` in this same folder — that file is still ' +
    'edited by hand.\n\n' +
    `**Generated:** ${exportedAt.toLocaleString()}\n\n` +
    '## Decisions\n\n' +
    (decisionBlocks || '_None tracked._') +
    '\n\n## Not built, pending\n\n' +
    (notBuiltBlocks || '_None tracked._') +
    '\n'
  );
}

export const OpenDecisionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const decisionsTracker = useTrackedItems<DecisionResolution>(STORAGE_PREFIX, {
    resolutions: SEEDED_DECISION_RESOLUTIONS,
    comments: SEEDED_DECISION_COMMENTS,
  });
  const notBuiltTracker = useTrackedItems<QuestionResolution>(
    `${STORAGE_PREFIX}-notbuilt`,
    { comments: SEEDED_NOT_BUILT_COMMENTS }
  );
  const [lastExportedSnapshot, setLastExportedSnapshot] = useState<string | null>(() =>
    loadJSON<string | null>(LAST_EXPORTED_SNAPSHOT_KEY, null)
  );
  const [cycleIndex, setCycleIndex] = useState(0);
  const [highlightedAnchorId, setHighlightedAnchorId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(
    () => saveJSON(LAST_EXPORTED_SNAPSHOT_KEY, lastExportedSnapshot),
    [lastExportedSnapshot]
  );

  // `track` is independently memoized (useCallback) on its own underlying
  // state, so depending on it alone — not the whole tracker object, which
  // is a fresh literal every render — is deliberate and correct here.
  const decisions: TrackedDecision[] = useMemo(
    () => decisionsTracker.track(openDecisions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decisionsTracker.track]
  );
  const { toggleReviewed, addComment, setResolution } = decisionsTracker;

  const notBuilt: TrackedNotBuilt[] = useMemo(
    () => notBuiltTracker.track(notBuiltItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notBuiltTracker.track]
  );
  const toggleNotBuiltReviewed = notBuiltTracker.toggleReviewed;
  const addNotBuiltComment = notBuiltTracker.addComment;
  const setNotBuiltResolution = notBuiltTracker.setResolution;

  const flashAnchor = useCallback((anchorId?: string) => {
    if (!anchorId) return;
    // Give navigation/panel-open a frame to render before scrolling.
    window.requestAnimationFrame(() => {
      setHighlightedAnchorId(anchorId);
      const el = document.getElementById(anchorId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => setHighlightedAnchorId(null), HIGHLIGHT_DURATION_MS);
    });
  }, []);

  const jumpToDecision = useCallback(
    (decision: OpenDecisionItem) => {
      if (decision.jumpTo.tab === 'none') {
        setPanelOpen(true);
        flashAnchor(decision.jumpTo.anchorId);
        return;
      }
      setPanelOpen(false);
      navigate(`/onsite-scheduling?tab=${decision.jumpTo.tab}`);
      flashAnchor(decision.jumpTo.anchorId);
    },
    [navigate, flashAnchor]
  );

  const cycleNext = useCallback(() => {
    if (openDecisions.length === 0) return;
    const nextIndex = cycleIndex % openDecisions.length;
    jumpToDecision(openDecisions[nextIndex]);
    setCycleIndex(nextIndex + 1);
  }, [cycleIndex, jumpToDecision]);

  // Drift-detection (2026-08-15) — compares current tracked state against
  // whatever was true the last time someone actually exported
  // decision-results.md. An untouched fresh session (nothing reviewed/
  // commented/decided yet, no prior export) correctly reads as "nothing to
  // export" rather than immediately nagging.
  const currentSnapshot = useMemo(
    () =>
      snapshotOf(
        decisionsTracker.reviewedIds,
        decisionsTracker.comments,
        decisionsTracker.resolutions,
        notBuiltTracker.reviewedIds,
        notBuiltTracker.comments,
        notBuiltTracker.resolutions
      ),
    [
      decisionsTracker.reviewedIds,
      decisionsTracker.comments,
      decisionsTracker.resolutions,
      notBuiltTracker.reviewedIds,
      notBuiltTracker.comments,
      notBuiltTracker.resolutions,
    ]
  );
  const emptySnapshot = useMemo(
    () => snapshotOf(new Set(), {}, {}, new Set(), {}, {}),
    []
  );
  const needsExport = currentSnapshot !== (lastExportedSnapshot ?? emptySnapshot);

  const resultsMarkdown = useMemo(
    () => buildResultsMarkdown(decisions, notBuilt, new Date()),
    [decisions, notBuilt]
  );

  const markExported = useCallback(() => {
    setLastExportedSnapshot(currentSnapshot);
  }, [currentSnapshot]);

  // The prototype auto-saved this snapshot by POSTing it to its own Vite
  // dev-server plugin, which wrote decision-results.md to disk. There is no
  // such process behind this app, and a browser tab cannot write to disk, so
  // the manual ExportResultsDialog — which the panel shows on 'error' — is the
  // only path here rather than a fallback.
  useEffect(() => {
    if (!needsExport) return;
    setSyncStatus('error');
  }, [needsExport]);

  const value = useMemo(
    () => ({
      decisions,
      notBuilt,
      backlogItems: torquewareBacklogItems,
      toggleReviewed,
      addComment,
      setResolution,
      toggleNotBuiltReviewed,
      addNotBuiltComment,
      setNotBuiltResolution,
      jumpToDecision,
      cycleNext,
      highlightedAnchorId,
      panelOpen,
      setPanelOpen,
      needsExport,
      syncStatus,
      lastSyncedAt,
      resultsMarkdown,
      markExported,
    }),
    [
      decisions,
      notBuilt,
      toggleReviewed,
      addComment,
      setResolution,
      toggleNotBuiltReviewed,
      addNotBuiltComment,
      setNotBuiltResolution,
      jumpToDecision,
      cycleNext,
      highlightedAnchorId,
      panelOpen,
      needsExport,
      syncStatus,
      lastSyncedAt,
      resultsMarkdown,
      markExported,
    ]
  );

  return (
    <OpenDecisionsContext.Provider value={value}>
      {children}
    </OpenDecisionsContext.Provider>
  );
};

export function useOpenDecisions(): OpenDecisionsContextValue {
  const ctx = useContext(OpenDecisionsContext);
  if (!ctx) {
    throw new Error('useOpenDecisions must be used within an OpenDecisionsProvider');
  }
  return ctx;
}
