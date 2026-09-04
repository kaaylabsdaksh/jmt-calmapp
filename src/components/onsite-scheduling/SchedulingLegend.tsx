/**
 * Shared legend for the Onsite Scheduling List and Calendar tabs so both
 * surfaces read identically (same swatches, same order, same wording).
 *
 * Readiness and Status stay two separate groups (D28) — Red/Green/Partial
 * is never labelled "Status".
 */
import React from 'react';
import { cn } from '@/lib/utils';
import DecisionTag from './DecisionTag';
import {
  LIFECYCLE_BADGE_STYLES,
  READINESS_FILL,
} from '@/lib/onsite-scheduling/job-status';
import {
  NON_SERVICE_ENTRY_TYPES,
  type NonServiceEntry,
} from '@/lib/onsite-scheduling/types';

export const NON_SERVICE_STYLES: Record<NonServiceEntry['type'], string> = {
  PTO: 'border-dashed border-violet-400 bg-violet-50 text-violet-800',
  Travel: 'border-dashed border-sky-400 bg-sky-50 text-sky-800',
  'Out of Service': 'border-dashed border-rose-400 bg-rose-50 text-rose-800',
  Tentative: 'border-dashed border-slate-400 bg-slate-50 text-slate-700',
  // 'Other' (D29) — a fixed catch-all, deliberately its own hue.
  Other: 'border-dashed border-stone-400 bg-stone-50 text-stone-700',
};

interface Props {
  /** Ring highlight target coming from the decision-jump feature. */
  highlightedAnchorId?: string | null;
  /** Anchor id owned by the calling surface (Calendar uses D9, List D28). */
  anchorId?: string;
  /** Extra trailing groups (List adds PO / Confirmed / Safety dots). */
  children?: React.ReactNode;
  className?: string;
  /** Non-service entry swatches (PTO, Travel, etc.) are calendar-specific;
   *  hide them on surfaces that do not render that timeline (e.g. List). */
  showNonService?: boolean;
}

const SchedulingLegend: React.FC<Props> = ({
  highlightedAnchorId,
  anchorId = 'decision-D28',
  children,
  className,
  showNonService = true,
}) => (
  <div
    id={anchorId}
    className={cn(
      'flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border bg-muted/30 px-2 py-1.5 text-[10px] transition-shadow',
      highlightedAnchorId === anchorId && 'ring-2 ring-amber-400',
      className
    )}
  >
    <span className="font-semibold uppercase tracking-wide text-muted-foreground">
      Legend
    </span>
    <span className="text-muted-foreground">Readiness:</span>
    {(['Green', 'Partial', 'Red'] as const).map((s) => (
      <span key={s} className="inline-flex items-center gap-1">
        <span className={cn('h-2.5 w-4 rounded-sm border', READINESS_FILL[s])} />
        {s}
      </span>
    ))}
    <span className="mx-1 h-3 w-px bg-border" />
    <span className="text-muted-foreground">Status:</span>
    {(['On Hold', 'Completed', 'Cancelled'] as const).map((s) => (
      <span key={s} className="inline-flex items-center gap-1">
        <span className={cn('h-2.5 w-4 rounded-sm border', LIFECYCLE_BADGE_STYLES[s])} />
        {s}
      </span>
    ))}
    {showNonService && (
      <>
        <span className="mx-1 h-3 w-px bg-border" />
        {NON_SERVICE_ENTRY_TYPES.map((t) => (
          <span key={t} className="inline-flex items-center gap-1">
            <span className={cn('h-2.5 w-4 rounded-sm border', NON_SERVICE_STYLES[t])} />
            {t}
          </span>
        ))}
        <DecisionTag decisionId="D9" />
      </>
    )}
    <DecisionTag decisionId="D28" />
    {children}
  </div>
);

export default SchedulingLegend;
