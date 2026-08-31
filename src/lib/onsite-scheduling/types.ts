/**
 * PROTOTYPE ONLY — Onsite Scheduling capability types.
 *
 * Shaped to look like this frontend's existing API/type conventions
 * (see src/types/onsite-project.d.ts) so a dev swapping in real endpoints
 * later is doing a type/hook change, not a rewrite. None of this is wired
 * to a real backend — see /prototype/README.md.
 *
 * Source: onsite-scheduling-frd-v5.md §6.4, §6.5, §8 (Data model).
 */

/** Torqueware's confirmed non-service event types, minus "No Driver" — held
 * back this phase per FRD §6.4 US-2 pending the Alltite on-site visit.
 * `'Other'` added 2026-08-16 (direct user decision, not a guess — see
 * open-decisions-log.md D29) as a fixed catch-all rather than making this
 * list itself user-configurable: nothing in the FRD/transcripts/Torqueware
 * discovery suggests these categories change often (Torqueware's own
 * equivalent list is hardcoded too), and every type here drives real
 * legend/color behavior — a fully dynamic type list would need to solve
 * "what does a made-up type look like" generically for a need that hasn't
 * been demonstrated. The existing free-text `notes` field is the escape
 * hatch for whatever 'Other' needs to describe. */
export type NonServiceEntryType =
  | 'PTO'
  | 'Travel'
  | 'Out of Service'
  | 'Tentative'
  | 'Other';

export const NON_SERVICE_ENTRY_TYPES: NonServiceEntryType[] = [
  'PTO',
  'Travel',
  'Out of Service',
  'Tentative',
  'Other',
];

/** Simplified Red/Green/Partial + the manual overrides already live in the
 * real OnsiteProject.tsx detail page (Complete/Cancelled) and On Hold. */
export type JobStatus =
  | 'Red'
  | 'Green'
  | 'Partial'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled';

export type OsrStatus = 'ok' | 'missing' | 'expired';

/** A technician on the roster. `capabilities` is an array, not a single tag —
 * FRD §6.4 US-1 / Rule 7 flags Canada's dual-role technicians (in-lab +
 * onsite) as a real reason not to build a single-capability model. */
export interface PrototypeTechnician {
  id: string;
  name: string;
  capabilities: string[];
  location: string;
  division: string;
}

/** A non-service calendar entry — a technician's unavailability, not a job.
 * FRD §6.4 US-2 / §8 Calendar Entry (generalized). */
export interface NonServiceEntry {
  id: string;
  type: NonServiceEntryType;
  technicianIds: string[];
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd, inclusive
  notes?: string;
}

/** Per-technician hours + assignment details logged against a job —
 * travel-in/out, production, plus Role and Comments (D27, from Andrea's
 * real Detail page's Technician Assignments table). Keyed by technician
 * id. Named for the hours fields historically (D19) — kept as-is rather
 * than renamed, to avoid rippling the name through every call site for a
 * cosmetic gain; the doc comment is the source of truth on what it holds. */
export interface JobTechnicianHours {
  travelInHours: number;
  travelOutHours: number;
  productionHours: number;
  /** Trainee / Project Lead / no role — a plain, hardcoded list (D27).
   * The real Technicians.tsx sources this from a server lookup with no
   * fixed vocabulary in this codebase, so there's nothing authoritative
   * to match; this is a stand-in, not a claim of the real vocabulary. */
  role?: 'Trainee' | 'Project Lead';
  /** Free-text note against this technician's assignment, distinct from
   * the job-level Comments thread (D27, from Andrea's real screen). */
  comments?: string;
}

/** One append-only comment on a job (D27) — same shape as the Open
 * Decisions panel's DecisionComment, reusing that proven pattern
 * (CommentThread.tsx) rather than inventing a new one. */
export interface JobComment {
  id: string;
  text: string;
  createdAt: string;
}

/** A customer/account associated with a job, each carrying its OWN PO
 * Received / Confirmed flags — FRD §7 Rule 1 / §8: "Status derives from PO
 * Received + Confirmed **per account**... A project has many accounts."
 * Replaces D19's earlier flat, job-level poReceived/confirmed pair (D22) —
 * job-level Red/Green/Partial is DERIVED by aggregating these (see
 * job-status.ts), never stored as its own independent flag.
 *
 * D27 additions below (all optional — every field here was proposed as a
 * concrete addition after comparing Torqueware/Andrea's real screen/
 * Canada's RMID form; see open-decisions-log.md D27 for what was
 * deliberately left off instead): */
export interface JobAccount {
  customerName: string;
  poReceived: boolean;
  confirmed: boolean;
  /** From Andrea's real Detail page's Customers table. */
  city?: string;
  state?: string;
  accountNumber?: string;
  /** The actual PO Number string (Canada's RMID form) — distinct from the
   * `poReceived` Yes/No flag, which stays. A job can have PO Received
   * checked with no number recorded yet, or vice versa; this build does
   * not force them to agree. */
  poNumber?: string;
  customerContactName?: string;
  customerContactEmail?: string;
  customerContactPhone?: string;
  /** Separate from Customer Contact (Canada's RMID form has both). */
  siteContactName?: string;
  siteContactEmail?: string;
  siteContactPhone?: string;
  /** Relocated here from a job-level `quoteTotal` (D24) per D27 — Andrea's
   * real screen shows Quote Total as a per-account column, since a job can
   * carry more than one account, each with its own quote. List's job-level
   * total is now a sum of these. */
  quoteValue?: number;
  /** SR#/Quote#/Work Order# — rendered as placeholder-styled links, not
   * live links. Andrea's real screen shows these exact three as real
   * columns already committed to production, just not wired to a stored
   * record yet ("placeholder links — they'll connect to stored records in
   * a future update" — her page's own caption). */
  srNumber?: string;
  quoteNumber?: string;
  workOrderNumber?: string;
  /** Per-account OSR#, styled and behaving like the one genuinely live
   * link Andrea's real screen has today (N8) — distinct from the job-level
   * `osrStatus` ok/missing/expired flag above, which is a status, not a
   * document reference. Real screen resolves this to a file share path
   * (`\\mt-fs01\JM_VOL\OnSite\OSR\<osrNumber>.doc`); mirrored here as a
   * cosmetic tooltip only — no real file storage in this prototype. */
  osrNumber?: string;
}

/** A scheduled job, as it renders on the Calendar. Deliberately a thin
 * calendar-facing shape, not a full OnsiteProject — the real project record
 * (see src/types/onsite-project.d.ts) stays the source of truth for
 * everything List/Detail already show. `id` matches a real OnsiteProject
 * projectId where one exists, so double-click can route to the real,
 * unchanged Detail page. */
export interface ScheduledJob {
  id: string;
  projectNumber: string;
  startDate: string;
  endDate: string;
  /** Cached/derived display value — recomputed via job-status.ts's
   * resolveJobStatus() every time `accounts` or `onHold` changes (see
   * JobDetailDialog's save, UnscheduledWorkQueue's Schedule create). Never
   * hand-edited directly except for Completed/Cancelled, which this build's
   * Detail treats as an untouched manual override (D5/D22). */
  status: JobStatus;
  location: string;
  division: string;
  /** Every customer/account associated with this job, each with its own PO
   * Received/Confirmed flags (D22 / FRD §7 Rule 1, §8). A project has many
   * accounts — job-level status is an aggregate over all of them, not a
   * single job-level flag pair. */
  accounts: JobAccount[];
  /** One-or-more sales/service rep codes (FRD §8/§9: "`codes` is an array —
   * a project can carry more than one sales/service code"). Added for D24's
   * List rebuild — not modeled on ScheduledJob before this, only on
   * UnscheduledWorkItem's single `salesRepCode`. */
  salesCodes: string[];
  technicianIds: string[];
  osrStatus: OsrStatus;
  /** True for a job seeded to demonstrate a real OnsiteProject detail route
   * exists; false for jobs that only exist in this prototype's mock data. */
  hasRealDetailRoute?: boolean;
  /** The one manual status override this prototype models independently of
   * PO Received/Confirmed (D19/D22). When true, Calendar/List/Detail
   * display "On Hold" regardless of any account's poReceived/confirmed, and
   * "On Hold" is excluded from Red/Green/Partial's SLA-style coloring
   * entirely — it's its own distinct visual treatment, not a variant of
   * either. Independent of every account's flags underneath, which stay
   * intact (not cleared) while On Hold is on. */
  onHold: boolean;
  /** Assigned vehicle, if any — id into the vehicle list Detail's picker
   * shows (mirrors mock-onsite-project-api.ts's MOCK_LOOKUPS.vehicles). */
  vehicleId?: string;
  /** Travel-in/out + production hours per assigned technician (D19). A
   * technician with no entry here is treated as all-zero until edited. */
  technicianHours: Record<string, JobTechnicianHours>;

  /** D27 job-level additions — see JobAccount's doc comment for the same
   * caveat: proposed after comparing all three reference systems; see
   * open-decisions-log.md D27 for what was deliberately left off. */
  /** From Canada's RMID form's Pre-Service section (the field itself —
   * who introduced the deal — not the per-account financials). */
  outsideSales?: string;
  preServiceChecklist?: string;
  postServiceChecklist?: string;
  /** From Canada's Post-Service section. Deliberately NOT modeling
   * Completed/Lost as independent checkboxes here — that needs its own
   * explicit decision before building (touches D22's status derivation
   * and D5's still-open Rule 6 conflict); see D27's "needs its own
   * follow-up" note. */
  postedInvoice?: string;
  managedBy?: string;
  managingLab?: string;
  /** Append-only job comments (D27) — reuses the CommentThread pattern
   * already built for Open Decisions. */
  comments: JobComment[];
}

/** FRD §6.5 / §8 Unscheduled Work Item — converts to a real Job once Scheduled. */
export interface UnscheduledWorkItem {
  id: string;
  customerName: string;
  /** Optional (D11, 2026-08-15) — the quick-add path intentionally doesn't
   * collect an account number at intake time (that's the whole point of a
   * minimum-fields quick-add); seeded/full-intake items still carry a real
   * one. `ScheduleDialog`'s location guess falls back to this when
   * `location` below isn't set, for items created before D11. */
  acctNum?: string;
  targetWindowStart: string;
  targetWindowEnd: string;
  /** Optional (D11) — quick-add doesn't collect a sales rep code either. */
  salesRepCode?: string;
  /** Added for D11's quick-add path — captured explicitly at intake instead
   * of guessed later from `acctNum`'s "CA-" prefix (see D12). Optional so
   * older seeded items without it still work; `ScheduleDialog` prefers this
   * over the acctNum-prefix guess whenever it's present. */
  location?: string;
  notes?: string;
}

export type DecisionOwner = {
  name: string;
  role: string;
};

export type DecisionType = 'Business' | 'Technical';

/** A single comment-thread entry on a decision or "not built" question —
 * appended, never overwritten (unlike the old single-textarea note field
 * this replaced). Session-only, same as everything else in Open Decisions —
 * resets on reload, there's no persistence layer this pass. */
export interface DecisionComment {
  id: string;
  text: string;
  /** ISO timestamp, set client-side when the comment is added. */
  createdAt: string;
}

/** The stakeholder call on a decision, once made. Reuses the exact action
 * vocabulary already established in onsite-triage-workbook.md's "Action
 * color legend" (Tab A/B), rather than inventing new PM language — so a
 * decision's resolution here reads the same way the rest of this project's
 * triage already does. "Decide" itself is deliberately excluded — it's the
 * input state that put an item in this log, not a possible outcome. */
export type DecisionResolution =
  | 'Build Now'
  | 'Extend'
  | 'Confirm'
  | 'Coordinate'
  | 'Defer'
  | 'Cut';

export const DECISION_RESOLUTIONS: DecisionResolution[] = [
  'Build Now',
  'Extend',
  'Confirm',
  'Coordinate',
  'Defer',
  'Cut',
];

/** Status vocabulary for the "Not built, pending" (N-number) factual
 * questions — distinct from DecisionResolution because these are pure
 * open questions with no default/feature behind them, not build calls.
 * Tracked the same way as decisions (reviewed + notes + this), just with
 * its own smaller vocabulary that actually fits a question's lifecycle. */
export type QuestionResolution = 'Answered' | 'Escalated' | 'Deferred' | 'Not Relevant';

export const QUESTION_RESOLUTIONS: QuestionResolution[] = [
  'Answered',
  'Escalated',
  'Deferred',
  'Not Relevant',
];

/** Where a decision's default is visible in this prototype, for the
 * "Jump-to-context" link and the "Next flagged item" cycle button.
 * 'none' means the default has no visual home outside the Open Decisions
 * panel itself (e.g. D5, which documents Detail's unchanged behavior
 * rather than pointing at a built surface) — jumping there just opens/keeps
 * open the panel and highlights the card in place. */
export interface DecisionJumpTarget {
  tab: 'calendar' | 'unscheduled' | 'list' | 'none';
  /** DOM anchor id (data-decision-target) the jump scrolls to and flashes. */
  anchorId?: string;
}

/** Functional area a decision organizes under in the Open Decisions panel —
 * added 2026-08-12 to replace filtering by owner name (which told you WHO
 * to talk to but not WHAT KIND of call it is or WHO it affects day-to-day).
 * Best-effort single classification per item; several items genuinely
 * touch more than one area — see each item's own text for nuance. */
export type DecisionArea = 'Technical/Architecture' | 'End User' | 'Product Management';

export const DECISION_AREAS: DecisionArea[] = [
  'Technical/Architecture',
  'End User',
  'Product Management',
];

/** Which end-user population a decision tagged `area: 'End User'` actually
 * affects — a decision can affect more than one. 'All' means every onsite
 * scheduling user regardless of site. */
export type EndUserScope = 'US – Baton Rouge' | 'US – Wichita/Kansas' | 'Canada' | 'All';

export interface OpenDecisionItem {
  id: string;
  title: string;
  type: DecisionType;
  /** Functional-area classification for panel filtering/grouping — see
   * DecisionArea's doc comment. */
  area: DecisionArea;
  /** Only meaningful when `area` is 'End User' — which population(s) this
   * decision actually affects. Omitted for Technical/Architecture and
   * Product Management items. */
  endUserScope?: EndUserScope[];
  owners: DecisionOwner[];
  /** The literal question to put to stakeholders on a call — added
   * 2026-08-13 directly for that purpose ("this will be what I actually
   * go through and ask on the calls"). `defaultBuilt`/`whyThisDefault`
   * describe what IS built and why; this is the one thing a PM should
   * actually read aloud and get an answer to. Items that are bug fixes or
   * additive/non-controversial builds say so explicitly here rather than
   * forcing an artificial question ("No decision needed — ..."). */
  stakeholderQuestion: string;
  defaultBuilt: string;
  whyThisDefault: string;
  jumpTo: DecisionJumpTarget;
  /** Source rule/row, for traceability back to the FRD/triage workbook. */
  source: string;
}

/** Pure business/factual questions with no demoable feature behind them —
 * excluded from the tagged-in-UI decision list on purpose (see §4 rule). */
export interface NotBuiltItem {
  id: string;
  title: string;
  /** Same functional-area classification as OpenDecisionItem — see
   * DecisionArea's doc comment. */
  area: DecisionArea;
  endUserScope?: EndUserScope[];
  /** Same purpose as OpenDecisionItem.stakeholderQuestion — see its doc
   * comment. */
  stakeholderQuestion: string;
  pendingWho: string;
  note: string;
  source: string;
}

/** A Torqueware-discovery item that's outside onsite/scheduling entirely —
 * Phase 2 material. Read-only in the panel (no Reviewed/resolution
 * tracking, since nothing here has been scoped or owned yet) — it's a
 * holding pen, not a decision queue. Mirrors
 * /prototype/decisions/torqueware-non-scheduling-log.md (T1–T9); keep both
 * in sync by hand the same way the D/N items track open-decisions-log.md. */
export interface BacklogItem {
  id: string;
  title: string;
  summary: string;
  source: string;
}
