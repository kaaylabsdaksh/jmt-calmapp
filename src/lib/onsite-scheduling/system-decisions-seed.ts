/**
 * PROTOTYPE ONLY — seeds the Open Decisions panel's default localStorage
 * state to match decisions/decision-results.md's 2026-08-15 system-decision
 * pass (2026-08-16 follow-up).
 *
 * Why this exists: decision-results.md was hand-authored directly for that
 * pass (see its own header) rather than exported live from the app — the
 * app's actual runtime state (browser localStorage) was never touched, so a
 * fresh browser session showed all 28 decisions as unreviewed/"Not yet
 * decided" even though the file said otherwise. This is the fix: seed the
 * SAME Calls/comments as the file's initial default, so a fresh session's
 * panel matches what's on record instead of contradicting it.
 *
 * Once the panel is open, its own auto-save (prototype.decisionLogServerPlugin.ts)
 * takes back over — the FIRST time state changes (even just loading with a
 * non-empty seed counts, since it differs from "nothing exported yet"), it
 * re-exports decision-results.md in the normal machine-generated format,
 * which REPLACES this file's hand-authored banner/explanation text with the
 * standard header. The substantive content (every "[System decision]"-
 * tagged comment and its Call) survives that re-export intact, since it's
 * carried as literal comment text, not part of the banner — only the
 * wrapper framing at the top of decision-results.md reverts to the normal
 * auto-generated one. That's expected, not a bug: this file's purpose was
 * always to make one hand-edited moment durable, not to stay hand-edited
 * forever.
 *
 * Deliberately does NOT seed D2 or D4's `reviewed` state — decision-results.md
 * shows Reviewed: No for every item, seeded ones included.
 */
import type { DecisionComment, DecisionResolution } from './types';

let seedCounter = 0;
function seedComment(text: string, createdAt: string): DecisionComment {
  seedCounter += 1;
  return { id: `seed-comment-${seedCounter}`, text, createdAt };
}

// Fixed timestamp for the system-decision pass — matches decision-results.md's
// own "Batch authored: 2026-08-15" line.
const PASS_DATE = new Date(2026, 7, 15, 9, 0, 0).toISOString();
// D4's comment predates the system-decision pass (a real, earlier value —
// preserved as-is, not overwritten).
const D4_DATE = new Date(2026, 7, 12, 18, 0, 44).toISOString();
// Region-gating decision on D27's Canada-only sub-fields — a real,
// human-directed call (not a system decision), made after the pass above.
const REGION_GATE_DATE = new Date(2026, 7, 16, 14, 0, 0).toISOString();

export const SEEDED_DECISION_RESOLUTIONS: Partial<Record<string, DecisionResolution>> = {
  D1: 'Confirm',
  D2: 'Defer',
  D3: 'Confirm',
  D4: 'Confirm',
  // D5: left undecided — genuinely unsafe to guess (see comment).
  D6: 'Extend',
  // D7: left undecided — real-workflow validation question.
  D8: 'Confirm',
  D9: 'Confirm',
  D10: 'Confirm',
  D11: 'Extend',
  D12: 'Build Now',
  D13: 'Confirm',
  D14: 'Confirm',
  D15: 'Confirm',
  D16: 'Confirm',
  D17: 'Confirm',
  D18: 'Confirm',
  D19: 'Confirm',
  D20: 'Confirm',
  D21: 'Confirm',
  D22: 'Confirm',
  // D23: left undecided — Tim's/Architecture's call, not a system decision.
  D24: 'Confirm',
  D25: 'Confirm',
  D26: 'Confirm',
  // D27: left undecided — named stakeholder dealbreakers, too risky to wave through.
  D28: 'Confirm',
};

export const SEEDED_DECISION_COMMENTS: Record<string, DecisionComment[]> = {
  D1: [
    seedComment(
      "[System decision] Keeping technician assignment open to any capability/division, as built. Open-by-default is reversible; a wrong restriction risks silently blocking real dual-role assignments (e.g. Canada's). No source document specifies who should be restricted.",
      PASS_DATE
    ),
  ],
  D3: [
    seedComment(
      "[System decision] Keeping the visible-warning-only approach (never blocks confirmation) — matches today's real production behavior while making the OSR gap visible instead of silent.",
      PASS_DATE
    ),
  ],
  D4: [
    seedComment(
      'I think a warning for now is okay. We can revisit if a stakeholder down the line disagrees.',
      D4_DATE
    ),
  ],
  D5: [
    seedComment(
      '[System decision — flagged, NOT decided] Genuinely unsafe to guess: the FRD states "On Hold should be the only manual override," but the real, live Detail page already allows manually setting Complete/Closed/Cancelled — these directly conflict. Blocking for anyone finalizing the status enum; needs Bryan\'s actual call.',
      PASS_DATE
    ),
  ],
  D6: [
    seedComment(
      '[System decision] Extend the hide-completed/cancelled toggle to List as well as Calendar — low cost (List already has a filter system per D24), and consistency seemed safer than an unexplained asymmetry.',
      PASS_DATE
    ),
  ],
  D7: [
    seedComment(
      '[System decision — flagged, NOT decided] Genuinely unknown whether this reflects a real BR/Canada workflow gap or a Torqueware-shaped assumption — needs a real conversation with Shawna/BR ops. Built default stands as a working assumption per its Tier 2 rule, but not validated.',
      PASS_DATE
    ),
  ],
  D8: [
    seedComment(
      '[System decision] Keep the consolidated single nav entry as built — already a direct instruction for this pass, low-risk to rename later if Torqueware terminology differs.',
      PASS_DATE
    ),
  ],
  D9: [
    seedComment(
      "[System decision] The reduced color set is sufficient — no BR/Canada workflow in any source document uses Torqueware's other six real-work type distinctions.",
      PASS_DATE
    ),
  ],
  D10: [
    seedComment(
      '[System decision] The shared "+ New" entry point covers the two real creation needs demonstrated in this build. Folding in List\'s full-page "Add New" is a separate, smaller follow-up.',
      PASS_DATE
    ),
  ],
  D11: [
    seedComment(
      "[System decision, provisional] Build the quick-add tier — the NFR doc's ~23%-in-notes finding plus the real Add New form's 12+ required fields is actual evidence, not a guess, that not everything is known at intake. Still provisional: worth confirming with whoever enters jobs today.",
      PASS_DATE
    ),
  ],
  D12: [
    seedComment(
      "[System decision] Either collect Division/Location explicitly at Schedule time, or tag the guess — the log itself flags this as an inconsistency with the build's own rule, not a real product question.",
      PASS_DATE
    ),
  ],
  D13: [
    seedComment(
      '[System decision] Already a fixed bug — no further action needed.',
      PASS_DATE
    ),
  ],
  D14: [
    seedComment(
      '[System decision] Already fixed as part of D19 — no further action needed.',
      PASS_DATE
    ),
  ],
  D15: [
    seedComment(
      '[System decision] The day-number click target is sufficient — broadening to the whole cell is a nice-to-have with no documented complaint behind it.',
      PASS_DATE
    ),
    seedComment(
      'Direct user feedback, 2026-08-16: "create the entire block for each date a clickable container." Built — the whole day cell is now the click target, superseding the system decision above.',
      new Date(2026, 7, 16, 9, 0, 0).toISOString()
    ),
  ],
  D16: [
    seedComment(
      '[System decision] Additive visibility improvement, already correct as built.',
      PASS_DATE
    ),
  ],
  D17: [
    seedComment(
      '[System decision] Closes a real editing gap, additive — no decision actually required.',
      PASS_DATE
    ),
  ],
  D18: [
    seedComment(
      '[System decision] Shell-scoped convenience fix; the real component elsewhere is unchanged.',
      PASS_DATE
    ),
  ],
  D19: [
    seedComment(
      '[System decision] One shared, editable Detail dialog from both List and Calendar is the right shape — no evidence any surface needs a different Detail experience.',
      PASS_DATE
    ),
  ],
  D20: [
    seedComment(
      '[System decision] Wording clarification of an existing warning, not a rule change.',
      PASS_DATE
    ),
  ],
  D21: [
    seedComment(
      '[System decision] Already a fixed regression — no further action needed.',
      PASS_DATE
    ),
  ],
  D22: [
    seedComment(
      "[System decision, heavily caveated] Ship Model 1 (BR/FRD) only for this phase — the only one of the three status models that's FRD-confirmed and buildable today. This does NOT set a timeline for reconciling Canada/Torqueware, and does not resolve D23.",
      PASS_DATE
    ),
  ],
  D23: [
    seedComment(
      '[System decision — explicitly NOT decided] Factual architecture question only Tim/Engineering leadership can answer — not a preference. Blocking — flag to Tim directly. No other system decision resolves this.',
      PASS_DATE
    ),
  ],
  D24: [
    seedComment(
      "[System decision] The rebuilt List view meets every cited FRD §6.1 requirement — no gap identified against BR/Wichita/Canada's stated needs.",
      PASS_DATE
    ),
  ],
  D25: [
    seedComment(
      '[System decision] Already a fixed build-tooling bug — no decision actually required.',
      PASS_DATE
    ),
  ],
  D26: [
    seedComment(
      '[System decision] The assigned-only + searchable-add pattern directly matches the real, already-shipped Technicians.tsx precedent.',
      PASS_DATE
    ),
  ],
  D27: [
    seedComment(
      "[System decision — flagged, NOT decided] The riskiest item to rubber-stamp: names specific dealbreaker-risk items per stakeholder (margin visibility, Published flag, per-tech time-of-day) that a document-based decision can't responsibly confirm or reject. Needs the real stakeholder walkthrough.",
      PASS_DATE
    ),
    seedComment(
      "PM interim call, 2026-08-16 — Outside Sales, Service Checklists, Posted Invoice, Managed By, and Documents are now region-gated to Canada in the dialog (hidden entirely for BR/Wichita) rather than shown empty to everyone. This does NOT resolve the overall D27 field-list review — the dealbreaker-risk items above are still open — it's a UX/architecture mitigation so Wichita's form stays lean while Canada's data isn't lost. New sub-items opened: N13 (Managing Lab reference data), N14 (Service Checklist structure), N15 (Documents use case), N16 (Comments author field).",
      REGION_GATE_DATE
    ),
  ],
  D28: [
    seedComment(
      '[System decision] Already built in direct response to real stakeholder feedback ("it doesn\'t seem like red/green should be a status") — confirming as correct. Only open sub-question is naming.',
      PASS_DATE
    ),
  ],
};

export const SEEDED_NOT_BUILT_COMMENTS: Record<string, DecisionComment[]> = {
  N7: [
    seedComment(
      "[System decision — flagged, NOT decided] Genuinely unknown without Tim's real system knowledge. Likely-blocking: the Technician roster CRUD row in PRODUCTIONALIZATION-CHECKLIST.md depends on this.",
      PASS_DATE
    ),
  ],
  N12: [
    seedComment(
      "[System decision — flagged, NOT decided] Directly tied to D23's still-open backend-architecture question — resolving one may reshape the other.",
      PASS_DATE
    ),
  ],
  N13: [
    seedComment(
      'Opened 2026-08-16 during D27 field walkthrough. Managing Lab stays visible for all regions (unlike its Canada-only siblings) but its hardcoded list needs a real reference source — smaller, separate blocker from D23.',
      REGION_GATE_DATE
    ),
  ],
  N14: [
    seedComment(
      'Opened 2026-08-16 during D27 field walkthrough. Least-defined field in the whole set — free text stands in for an unconfirmed real checklist structure. Region-gated to Canada pending this.',
      REGION_GATE_DATE
    ),
  ],
  N15: [
    seedComment(
      "Opened 2026-08-16 during D27 field walkthrough. Blocker isn't D23 — nobody has ever been asked what this is for. Region-gated to Canada pending a real use case.",
      REGION_GATE_DATE
    ),
  ],
  N16: [
    seedComment(
      'Opened 2026-08-16 during D27 field walkthrough. Comments itself is NOT region-gated (validated by two real systems) — but JobComment has no author field, a real gap for a multi-user backend.',
      REGION_GATE_DATE
    ),
  ],
};
