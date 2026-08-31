/**
 * PROTOTYPE ONLY — the amber "?" tag that marks every place an unsettled
 * default is visible in the UI. Same tag everywhere it shows up (§4 rule) —
 * clicking it jumps to that decision's card on the Open Decisions screen.
 */
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { openDecisions } from '@/lib/onsite-scheduling/mock-data';
import { useOpenDecisions } from '@/context/OpenDecisionsContext';

const DecisionTag: React.FC<{ decisionId: string }> = ({ decisionId }) => {
  const { jumpToDecision } = useOpenDecisions();
  const decision = openDecisions.find((d) => d.id === decisionId);
  if (!decision) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            jumpToDecision(decision);
          }}
          aria-label={`Open decision: ${decision.title}`}
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-amber-400 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-400"
        >
          <HelpCircle className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        <p className="font-semibold">{decision.title}</p>
        <p className="mt-1 text-muted-foreground">
          Default built: {decision.defaultBuilt}
        </p>
        <p className="mt-1 text-[11px] italic">Click to open in Open Decisions →</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default DecisionTag;
