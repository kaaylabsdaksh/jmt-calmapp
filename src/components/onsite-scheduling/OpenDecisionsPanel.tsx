/**
 * PROTOTYPE ONLY — Open Decisions, as a floating button + slide-out panel
 * (not a tab) so it stays reachable while demoing List/Calendar/Unscheduled
 * Work. Tracks every unsettled item (with a demoable feature behind it) in
 * one place, plus a "Not built, pending" list for pure business questions.
 * Kept in sync by hand with /prototype/decisions/open-decisions-log.md —
 * that file is the one that leaves the room; "Reviewed", status, and
 * comments here are session-only (reset on reload). Comments are a real
 * append-only thread (`CommentThread.tsx`, extracted to its own file in
 * D27 so JobDetailDialog's new per-job Comments section can reuse it) —
 * added 2026-08-12 to replace an earlier single-textarea note field with
 * no submit action and no history.
 */
import React, { useEffect, useState } from 'react';
import {
  Archive,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Cog,
  GripVertical,
  HandCoins,
  ScrollText,
  UploadCloud,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  DECISION_AREAS,
  DECISION_RESOLUTIONS,
  QUESTION_RESOLUTIONS,
  type BacklogItem,
  type DecisionArea,
  type DecisionResolution,
  type QuestionResolution,
} from '@/lib/onsite-scheduling/types';
import {
  useOpenDecisions,
  loadJSON,
  saveJSON,
  type TrackedDecision,
  type TrackedNotBuilt,
} from '@/context/OpenDecisionsContext';
import CommentThread from './CommentThread';
import ExportResultsDialog from './ExportResultsDialog';

const TYPE_STYLES: Record<TrackedDecision['type'], string> = {
  Business: 'bg-blue-100 text-blue-800 border-blue-200',
  Technical: 'bg-violet-100 text-violet-800 border-violet-200',
};

// Functional-area styling — added 2026-08-12 to replace filtering by owner
// name (told you WHO to talk to, not WHAT KIND of call it is or WHO it
// affects day-to-day). See DecisionArea's doc comment in types.ts.
const AREA_STYLES: Record<DecisionArea, string> = {
  'Technical/Architecture': 'bg-slate-100 text-slate-800 border-slate-200',
  'End User': 'bg-teal-100 text-teal-800 border-teal-200',
  'Product Management': 'bg-amber-100 text-amber-800 border-amber-200',
};

// Same six-value vocabulary as onsite-triage-workbook.md's Action color
// legend (minus "Decide" — the input state that put an item in this log in
// the first place, not a possible outcome of it).
const RESOLUTION_STYLES: Record<DecisionResolution, string> = {
  'Build Now': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Extend: 'bg-blue-100 text-blue-800 border-blue-200',
  Confirm: 'bg-teal-100 text-teal-800 border-teal-200',
  Coordinate: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Defer: 'bg-amber-100 text-amber-800 border-amber-200',
  Cut: 'bg-red-100 text-red-800 border-red-200',
};

// Distinct from RESOLUTION_STYLES on purpose — different vocabulary, and a
// different visual family (slate/sky/amber/red) so a Not Built card never
// reads as a decision card at a glance.
const QUESTION_RESOLUTION_STYLES: Record<QuestionResolution, string> = {
  Answered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Escalated: 'bg-sky-100 text-sky-800 border-sky-200',
  Deferred: 'bg-amber-100 text-amber-800 border-amber-200',
  'Not Relevant': 'bg-red-100 text-red-800 border-red-200',
};

const UNSET_VALUE = '__unset__';

const DecisionCard: React.FC<{ decision: TrackedDecision }> = ({ decision }) => {
  const {
    toggleReviewed,
    addComment,
    setResolution,
    jumpToDecision,
    highlightedAnchorId,
  } = useOpenDecisions();
  const anchorId = `decision-${decision.id}`;

  return (
    <Card
      id={anchorId}
      className={cn(
        'transition-shadow',
        highlightedAnchorId === anchorId && 'ring-2 ring-amber-400 shadow-lg'
      )}
    >
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn('gap-1 text-[11px]', TYPE_STYLES[decision.type])}
            >
              {decision.type === 'Business' ? (
                <HandCoins className="h-3 w-3" />
              ) : (
                <Cog className="h-3 w-3" />
              )}
              {decision.type}
            </Badge>
            <Badge
              variant="outline"
              className={cn('text-[11px]', AREA_STYLES[decision.area])}
            >
              {decision.area}
              {decision.endUserScope && decision.endUserScope.length > 0
                ? ` · ${decision.endUserScope.join('/')}`
                : ''}
            </Badge>
            <h3 className="text-sm font-semibold text-foreground">{decision.title}</h3>
          </div>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Checkbox
              checked={decision.reviewed}
              onCheckedChange={() => toggleReviewed(decision.id)}
            />
            Reviewed
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">Call:</span>
          <Select
            value={decision.resolution ?? UNSET_VALUE}
            onValueChange={(v) =>
              setResolution(
                decision.id,
                v === UNSET_VALUE ? null : (v as DecisionResolution)
              )
            }
          >
            <SelectTrigger
              className={cn(
                'h-6 w-fit gap-1.5 border px-2 text-[11px] font-medium',
                decision.resolution
                  ? RESOLUTION_STYLES[decision.resolution]
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <SelectValue placeholder="Not yet decided" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNSET_VALUE} className="text-xs text-muted-foreground">
                Not yet decided
              </SelectItem>
              {DECISION_RESOLUTIONS.map((r) => (
                <SelectItem key={r} value={r} className="text-xs">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
          <span className="font-medium">Owner(s):</span>
          {decision.owners.map((o) => (
            <span
              key={o.name}
              className="rounded-full bg-muted px-2 py-0.5 text-foreground/80"
            >
              {o.name} ({o.role})
            </span>
          ))}
        </div>

        {/* Added 2026-08-13 so a PM can read this straight off the card on
            a stakeholder call, without having to reverse-engineer "what am
            I actually asking them" from the Default built/Why prose below.
            Visually the most prominent line on the card on purpose. */}
        <div className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-2 dark:border-blue-900 dark:bg-blue-950/30">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
            Ask the stakeholder
          </p>
          <p className="mt-0.5 whitespace-pre-wrap text-xs text-foreground">
            {decision.stakeholderQuestion}
          </p>
        </div>

        <div className="text-xs">
          <span className="font-medium text-foreground">Default built: </span>
          {/* whitespace-pre-wrap — added for D27, whose defaultBuilt uses
              embedded line breaks to structure a long, section-by-section
              proposal; a plain <span> collapses \n to nothing, which reads
              fine for short one-paragraph entries but turns a long
              structured one into an unreadable wall of text. Backward-
              compatible: entries with no embedded newlines render
              identically either way. */}
          <span className="whitespace-pre-wrap text-muted-foreground">
            {decision.defaultBuilt}
          </span>
        </div>
        <div className="text-xs">
          <span className="font-medium text-foreground">Why this default: </span>
          <span className="whitespace-pre-wrap text-muted-foreground">
            {decision.whyThisDefault}
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground italic">
          Source: {decision.source}
        </div>

        <CommentThread
          comments={decision.comments}
          onAdd={(text) => addComment(decision.id, text)}
        />

        {decision.jumpTo.tab !== 'none' && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-fit gap-1 self-end px-2 text-[11px] text-muted-foreground"
            onClick={() => jumpToDecision(decision)}
          >
            Jump to context <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const NotBuiltCard: React.FC<{ item: TrackedNotBuilt }> = ({ item }) => {
  const { toggleNotBuiltReviewed, addNotBuiltComment, setNotBuiltResolution } =
    useOpenDecisions();

  return (
    <div className="rounded-md border bg-white p-3 dark:bg-background">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 border-slate-200 bg-slate-100 text-[11px] text-slate-700"
          >
            {item.id}
          </Badge>
          <Badge variant="outline" className={cn('text-[11px]', AREA_STYLES[item.area])}>
            {item.area}
            {item.endUserScope && item.endUserScope.length > 0
              ? ` · ${item.endUserScope.join('/')}`
              : ''}
          </Badge>
          <p className="text-sm font-medium text-foreground">{item.title}</p>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Checkbox
            checked={item.reviewed}
            onCheckedChange={() => toggleNotBuiltReviewed(item.id)}
          />
          Reviewed
        </label>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          Pending: {item.pendingWho}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">Status:</span>
          <Select
            value={item.resolution ?? UNSET_VALUE}
            onValueChange={(v) =>
              setNotBuiltResolution(
                item.id,
                v === UNSET_VALUE ? null : (v as QuestionResolution)
              )
            }
          >
            <SelectTrigger
              className={cn(
                'h-6 w-fit gap-1.5 border px-2 text-[11px] font-medium',
                item.resolution
                  ? QUESTION_RESOLUTION_STYLES[item.resolution]
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <SelectValue placeholder="Still open" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNSET_VALUE} className="text-xs text-muted-foreground">
                Still open
              </SelectItem>
              {QUESTION_RESOLUTIONS.map((r) => (
                <SelectItem key={r} value={r} className="text-xs">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Same "Ask the stakeholder" treatment as DecisionCard — see that
          component's comment for why this exists (2026-08-13). */}
      <div className="mt-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-2 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
          Ask the stakeholder
        </p>
        <p className="mt-0.5 whitespace-pre-wrap text-xs text-foreground">
          {item.stakeholderQuestion}
        </p>
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground">{item.note}</p>
      <p className="mt-1 text-[11px] italic text-muted-foreground">
        Source: {item.source}
      </p>

      <div className="mt-1.5">
        <CommentThread
          comments={item.comments}
          onAdd={(text) => addNotBuiltComment(item.id, text)}
        />
      </div>
    </div>
  );
};

const BacklogCard: React.FC<{ item: BacklogItem }> = ({ item }) => (
  <Card>
    <CardContent className="flex flex-col gap-1.5 p-4">
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="gap-1 border-slate-200 bg-slate-100 text-[11px] text-slate-700"
        >
          {item.id}
        </Badge>
        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{item.summary}</p>
      <p className="text-[11px] italic text-muted-foreground">Source: {item.source}</p>
    </CardContent>
  </Card>
);

const SYNC_STATUS_COPY: Record<'idle' | 'saving' | 'saved' | 'error', string> = {
  idle: 'No changes yet this session.',
  saving: 'Saving to decision-results.md…',
  saved: 'Saved to decision-results.md',
  error: 'Changes are stored in this browser only.',
};

const Phase1Content: React.FC = () => {
  const { decisions, notBuilt, cycleNext, syncStatus, lastSyncedAt } = useOpenDecisions();
  const [exportOpen, setExportOpen] = useState(false);
  // Filters by functional area, not owner name (2026-08-12) — "who to talk
  // to" is still visible on every card via the Owner(s) row, but it's no
  // longer the organizing axis for the list itself. See DecisionArea.
  const [areaFilter, setAreaFilter] = useState<DecisionArea | 'All'>('All');
  // "Decided" split (2026-08-14) — direct feedback: "I want to be able to
  // shorten the list of decisions as they are made." Setting a Call/Status
  // no longer just colors the card in place; it moves the card out of the
  // active list (still filterable by area) into a separate, collapsed-by-
  // default section below. Comments and the resolution itself travel with
  // the card, so nothing about the history disappears — it's just off the
  // "still need to talk about this" radar. Collapsed state is session-only,
  // same as everything else this panel tracks.
  const [showDecided, setShowDecided] = useState(false);

  function areaScoped<T extends { area: DecisionArea }>(list: T[]): T[] {
    return areaFilter === 'All' ? list : list.filter((d) => d.area === areaFilter);
  }

  const activeDecisions = areaScoped(decisions.filter((d) => d.resolution === null));
  const decidedDecisions = areaScoped(decisions.filter((d) => d.resolution !== null));
  const activeNotBuilt = notBuilt.filter((item) => item.resolution === null);
  const decidedNotBuilt = notBuilt.filter((item) => item.resolution !== null);
  const decidedCount = decidedDecisions.length + decidedNotBuilt.length;

  const reviewedCount = decisions.filter((d) => d.reviewed).length;

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      <p className="text-xs text-muted-foreground">
        {reviewedCount}/{decisions.length} discussed. Reviewed/Call/Comments are kept in
        this browser. Use Export below to take the current snapshot out.
      </p>

      {/* The source prototype debounce-wrote every change straight to
          decision-results.md via a local dev-server plugin. There is no such
          process behind this app and a browser tab cannot write to disk, so
          the manual export below is the only path out, not a fallback. */}
      {syncStatus === 'error' ? (
        <div className="flex items-center justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs dark:border-amber-900 dark:bg-amber-950/30">
          <span className="text-amber-800 dark:text-amber-400">
            {SYNC_STATUS_COPY.error}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 border-amber-400 text-[11px] text-amber-800 hover:bg-amber-100 dark:text-amber-400"
            onClick={() => setExportOpen(true)}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Download manually
          </Button>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              syncStatus === 'saving' ? 'bg-amber-400' : 'bg-emerald-500'
            )}
          />
          {syncStatus === 'saved' && lastSyncedAt
            ? `Saved to decision-results.md at ${lastSyncedAt.toLocaleTimeString()}`
            : SYNC_STATUS_COPY[syncStatus]}
        </p>
      )}
      <ExportResultsDialog open={exportOpen} onOpenChange={setExportOpen} />

      <Button
        size="sm"
        onClick={cycleNext}
        className="w-fit gap-1.5 bg-amber-500 text-white hover:bg-amber-600"
      >
        Next flagged item <ArrowRight className="h-3.5 w-3.5" />
      </Button>

      <div className="flex flex-wrap gap-1.5">
        {(['All', ...DECISION_AREAS] as const).map((area) => (
          <button
            key={area}
            type="button"
            onClick={() => setAreaFilter(area)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              areaFilter === area
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:bg-background'
            )}
          >
            {area}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {activeDecisions.map((decision) => (
          <DecisionCard key={decision.id} decision={decision} />
        ))}

        <div className="rounded-md border border-dashed bg-muted/30 p-3">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <CircleDashed className="h-4 w-4 text-muted-foreground" />
            Not built, pending
          </h3>
          <div className="mt-2 grid gap-2">
            {activeNotBuilt.map((item) => (
              <NotBuiltCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {decidedCount > 0 && (
          <div className="rounded-md border bg-muted/10">
            <button
              type="button"
              onClick={() => setShowDecided((v) => !v)}
              className="flex w-full items-center gap-1.5 rounded-md p-3 text-left text-sm font-semibold text-foreground hover:bg-muted/30"
            >
              {showDecided ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              Decided
              <span className="rounded-full bg-muted-foreground/15 px-1.5 py-0.5 text-[10px] font-semibold">
                {decidedCount}
              </span>
              <span className="ml-auto text-[11px] font-normal text-muted-foreground">
                Off the radar — click to review
              </span>
            </button>
            {showDecided && (
              <div className="space-y-3 border-t p-3 pt-3">
                {decidedDecisions.map((decision) => (
                  <DecisionCard key={decision.id} decision={decision} />
                ))}
                {decidedNotBuilt.map((item) => (
                  <NotBuiltCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Phase2Content: React.FC = () => {
  const { backlogItems } = useOpenDecisions();

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      <p className="text-xs text-muted-foreground">
        Torqueware discovery items outside onsite/scheduling — a holding pen, not a
        decision queue. Nothing here is scoped or owned yet; kept so it isn't rediscovered
        from scratch when Roadmap &amp; Resourcing or Customer Portal discovery gets to
        it. Shareable copy is /prototype/decisions/torqueware-non-scheduling-log.md.
      </p>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {backlogItems.map((item) => (
          <BacklogCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const PanelContent: React.FC = () => {
  const { decisions } = useOpenDecisions();

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <ScrollText className="h-4 w-4" />
          Open Decisions
        </SheetTitle>
        <SheetDescription className="sr-only">
          Onsite scheduling decisions and Torqueware discovery backlog.
        </SheetDescription>
      </SheetHeader>

      <Tabs defaultValue="phase1" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="w-fit">
          <TabsTrigger value="phase1" className="gap-1.5">
            <ScrollText className="h-3.5 w-3.5" />
            Phase 1 · Onsite
            <span className="ml-0.5 rounded-full bg-muted-foreground/15 px-1.5 py-0.5 text-[10px] font-semibold">
              {decisions.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="phase2" className="gap-1.5">
            <Archive className="h-3.5 w-3.5" />
            Phase 2 · Backlog
          </TabsTrigger>
        </TabsList>
        <TabsContent value="phase1" className="flex-1 overflow-hidden">
          <Phase1Content />
        </TabsContent>
        <TabsContent value="phase2" className="flex-1 overflow-hidden">
          <Phase2Content />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Pixels of pointer movement before a press counts as a drag rather than a
// click — otherwise every click would also register as a (zero-distance)
// drag and never open the panel.
const DRAG_THRESHOLD_PX = 6;

/** Chat-widget-style floating trigger: defaults to the right edge, vertically
 * centered, but can be dragged anywhere in the viewport so it never has to
 * sit in front of whatever's being demoed. Position is session-only (plain
 * component state) — reloading resets it to the default right-side spot. */
function useDraggableFab() {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragState = React.useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startClientX: number;
    startClientY: number;
    moved: boolean;
  } | null>(null);
  // Set right before dragState is cleared on pointer-up, so the click
  // handler that fires just after can tell "was this a drag?" and swallow
  // it — otherwise every drag-release would also fire a click and reopen
  // right after the user just repositioned the button.
  const justDraggedRef = React.useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragState.current = {
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      startClientX: e.clientX,
      startClientY: e.clientY,
      moved: false,
    };
    buttonRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (!drag.moved) {
      const dx = Math.abs(e.clientX - drag.startClientX);
      const dy = Math.abs(e.clientY - drag.startClientY);
      if (dx > DRAG_THRESHOLD_PX || dy > DRAG_THRESHOLD_PX) drag.moved = true;
    }
    if (!drag.moved) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 56;
    const height = rect?.height ?? 56;
    const x = Math.min(
      Math.max(e.clientX - drag.offsetX, 4),
      window.innerWidth - width - 4
    );
    const y = Math.min(
      Math.max(e.clientY - drag.offsetY, 4),
      window.innerHeight - height - 4
    );
    setPos({ x, y });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragState.current;
    if (drag?.pointerId === e.pointerId) {
      buttonRef.current?.releasePointerCapture(e.pointerId);
      justDraggedRef.current = drag.moved;
    }
    dragState.current = null;
  };

  const consumeWasDragged = () => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return true;
    }
    return false;
  };

  return { buttonRef, pos, onPointerDown, onPointerMove, onPointerUp, consumeWasDragged };
}

const PANEL_WIDTH_STORAGE_KEY = 'jmt-open-decisions-panel-width';
const DEFAULT_PANEL_WIDTH = 512; // matches the old sm:max-w-lg
const MIN_PANEL_WIDTH = 420;

/** Drag-to-resize the panel from its left edge (2026-08-14) — direct
 * feedback: cards (esp. D27's long "Default built" prose) were getting
 * cramped at the old fixed sm:max-w-lg width. Width is a pure UI
 * preference, not decision data, so — unlike reviewed/resolution/comments,
 * which are deliberately session-only — this is persisted to localStorage
 * so it doesn't reset every reload. */
function useResizablePanel() {
  const [width, setWidth] = useState(() => {
    const stored = loadJSON<number | null>(PANEL_WIDTH_STORAGE_KEY, null);
    return stored && Number.isFinite(stored) ? stored : DEFAULT_PANEL_WIDTH;
  });
  const dragState = React.useRef<{
    pointerId: number;
    startX: number;
    startWidth: number;
  } | null>(null);

  useEffect(() => saveJSON(PANEL_WIDTH_STORAGE_KEY, width), [width]);

  const clamp = (w: number) => {
    const max = window.innerWidth - 80; // always leave a sliver of the app visible
    return Math.min(Math.max(w, MIN_PANEL_WIDTH), Math.max(max, MIN_PANEL_WIDTH));
  };

  const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = { pointerId: e.pointerId, startX: e.clientX, startWidth: width };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    // Panel is anchored to the right edge; dragging the left-edge handle
    // further left (clientX decreases) should widen it.
    setWidth(clamp(drag.startWidth + (drag.startX - e.clientX)));
  };

  const onHandlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (drag?.pointerId === e.pointerId) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
    dragState.current = null;
  };

  return { width, onHandlePointerDown, onHandlePointerMove, onHandlePointerUp };
}

/** The floating trigger + panel. Mounted once at the app root (see
 * GlobalOpenDecisions.tsx) so it's reachable from any page, not just the
 * Scheduling shell. */
const OpenDecisionsFab: React.FC = () => {
  const { decisions, panelOpen, setPanelOpen } = useOpenDecisions();
  const unreviewedCount = decisions.filter((d) => !d.reviewed).length;
  const { buttonRef, pos, onPointerDown, onPointerMove, onPointerUp, consumeWasDragged } =
    useDraggableFab();
  const {
    width: panelWidth,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
  } = useResizablePanel();

  // Default position: bottom-right, not vertically centered. Centered-right
  // sat directly on top of List's Search button (and would just as easily
  // collide with any other page's mid-right action row) — bottom-right is
  // the standard chat-widget spot specifically because most page toolbars/
  // action rows live at the top or middle, not the bottom-right corner.
  // Still fully draggable if it ever gets in the way of something else.
  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
    : { bottom: 16, right: 16 };

  return (
    <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
      <Button
        ref={buttonRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={() => {
          if (consumeWasDragged()) return; // dragging shouldn't also open the panel
          setPanelOpen(true);
        }}
        style={style}
        className="fixed z-50 hidden h-12 cursor-grab touch-none gap-2 rounded-full bg-amber-500 px-4 text-white shadow-lg hover:bg-amber-600 active:cursor-grabbing"
      >
        <ScrollText className="h-4 w-4" />
        Open Decisions
        {unreviewedCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-amber-700">
            {unreviewedCount}
          </span>
        )}
      </Button>
      <SheetContent
        className="flex w-full flex-col !max-w-none"
        style={{ width: panelWidth }}
      >
        {/* Resize handle — drag left to widen, right to narrow. Wider hit
            area than its visible line so it's easy to grab without
            precision-aiming at a 2px sliver. */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize Open Decisions panel"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          className="group absolute -left-1.5 top-0 z-10 flex h-full w-3 cursor-col-resize touch-none select-none items-center justify-center"
        >
          <div className="h-full w-1 rounded-full bg-transparent transition-colors group-hover:bg-amber-400/60 group-active:bg-amber-500" />
          <GripVertical className="absolute h-5 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <PanelContent />
      </SheetContent>
    </Sheet>
  );
};

export default OpenDecisionsFab;
