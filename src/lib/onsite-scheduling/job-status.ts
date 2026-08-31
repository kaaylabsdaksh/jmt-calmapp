/**
 * PROTOTYPE ONLY — Job status derivation (D19 / D22 / D28).
 *
 * FRD §7 Rule 1: "Status derives from PO Received + Confirmed per account →
 * Red/Green/Partial." §8 confirms PO Received/Confirmed are per-ACCOUNT
 * flags, not a single job-level pair — a job can have many accounts. This
 * is the one place that aggregation happens, so every surface (Detail,
 * Calendar, List's mock API, Unscheduled Work's Schedule) derives status
 * the same way instead of each re-inventing it.
 *
 * Aggregation rule (not specified by the FRD beyond "per account" — this is
 * this build's own choice, flagged rather than silently picked, see D22):
 * Green only when EVERY associated account has both flags true; Red if ANY
 * account is missing PO Received; Partial if PO Received everywhere but
 * Confirmed is missing on at least one account. A job with zero accounts is
 * treated as Red (not vacuously Green).
 *
 * D28 — "Readiness" vs. "Status", split (2026-08-14): direct stakeholder
 * feedback was "it doesn't seem like red/green should be a status." It's
 * right — Red/Green/Partial is a derived READINESS rollup of PO Received/
 * Confirmed, recomputed live; it's not a state the job occupies the way On
 * Hold/Completed/Cancelled (or Canada's real lifecycle) are. This file now
 * exposes the two as genuinely separate values instead of one collapsed
 * `JobStatus` badge:
 *   - deriveAutoStatus() → READINESS (Red/Green/Partial). Always shown as a
 *     color-only indicator (List's left row border, Calendar's bar fill),
 *     never a text "Status" badge, and never hidden by On Hold/Completed/
 *     Cancelled — those are a different axis, not an override of this one.
 *   - resolveLifecycleStatus() → the honest STATUS badge: 'Active' | 'On
 *     Hold' | 'Completed' | 'Cancelled'. 'Active' is an explicit value (not
 *     a blank/omitted state) so Status never silently leaks a readiness
 *     value under its label the way the old collapsed badge did.
 * `resolveJobStatus()`/`JobStatus` (the old collapsed shape) are kept only
 * because `ScheduledJob.status` still caches that combined value for
 * `mock-onsite-project-api.ts` (the real, untouched `/onsite-project`
 * route's mock backend infers PO/Confirmed flags from it) — nothing new
 * should read `job.status` directly as a DISPLAY value anymore; use the two
 * functions above instead.
 *
 * On Hold (FRD §7 Rule 2; confirmed as the one intended manual override —
 * see D5/D22) is independent of readiness: when on, it's what Status shows,
 * but it doesn't erase or require any particular account state underneath
 * — Readiness keeps reflecting the real PO/Confirmed data regardless.
 * Complete/Cancelled (D5's still-open Rule 6 conflict) are the two other
 * manual overrides this build does not let Detail set — they pass through
 * unchanged rather than ever being derived or overridden here.
 */
import type { JobAccount, JobStatus } from './types';

/** The honest, non-conflated "where is this job in its life" value. Red/
 * Green/Partial are deliberately NOT lifecycle values (see D28) — they
 * never appear here, only as Readiness (deriveAutoStatus). */
export type LifecycleStatus = 'Active' | 'On Hold' | 'Completed' | 'Cancelled';

/** Red/Green/Partial from PO Received + Confirmed across ALL of a job's
 * accounts. Does not know about On Hold or Completed/Cancelled — callers
 * needing the full display status should use resolveJobStatus() instead. */
export function deriveAutoStatus(accounts: JobAccount[]): 'Red' | 'Green' | 'Partial' {
  if (accounts.length === 0) return 'Red';
  const allReceived = accounts.every((a) => a.poReceived);
  const allConfirmed = accounts.every((a) => a.confirmed);
  if (!allReceived) return 'Red';
  return allConfirmed ? 'Green' : 'Partial';
}

/** Resolves a job's OLD collapsed DISPLAY status (Completed/Cancelled pass
 * through; else On Hold overrides the readiness value). Kept only so
 * `ScheduledJob.status` can still be cached for `mock-onsite-project-api.ts`
 * (see file header, D28) — do not use this for anything that renders on
 * screen; use resolveLifecycleStatus() (Status) + deriveAutoStatus()
 * (Readiness) instead, kept as two separate values on purpose. */
export function resolveJobStatus(job: {
  status: JobStatus;
  accounts: JobAccount[];
  onHold: boolean;
}): JobStatus {
  if (job.status === 'Completed' || job.status === 'Cancelled') return job.status;
  if (job.onHold) return 'On Hold';
  return deriveAutoStatus(job.accounts);
}

/** The honest lifecycle-only value shown as "Status" everywhere (D28).
 * 'Active' is explicit — not an omitted/blank badge — so this label never
 * silently stands in for a readiness value the way the old collapsed
 * status did. */
export function resolveLifecycleStatus(job: {
  status: JobStatus;
  onHold: boolean;
}): LifecycleStatus {
  if (job.status === 'Completed' || job.status === 'Cancelled') return job.status;
  if (job.onHold) return 'On Hold';
  return 'Active';
}

/** Readiness (Red/Green/Partial) badge/fill colors — color-only signal,
 * never labeled "Status" (D28). Used for List's left row border and
 * Calendar's bar fill, always shown regardless of Status. */
export const READINESS_BADGE_STYLES: Record<'Red' | 'Green' | 'Partial', string> = {
  Green: 'bg-emerald-500 text-white',
  Red: 'bg-red-500 text-white',
  Partial: 'bg-orange-400 text-white',
};

export const READINESS_BORDER_L: Record<'Red' | 'Green' | 'Partial', string> = {
  Green: 'border-l-emerald-500',
  Red: 'border-l-red-500',
  Partial: 'border-l-orange-400',
};

export const READINESS_FILL: Record<'Red' | 'Green' | 'Partial', string> = {
  Green: 'bg-emerald-500 text-white border-emerald-600',
  Red: 'bg-red-500 text-white border-red-600',
  Partial: 'bg-orange-400 text-white border-orange-500',
};

/** Status (lifecycle-only) badge colors — see resolveLifecycleStatus (D28).
 * 'Active' gets a deliberately neutral/muted treatment: it's the honest
 * "nothing flagged" default, not meant to draw the eye the way a real flag
 * (On Hold/Completed/Cancelled) should. */
export const LIFECYCLE_BADGE_STYLES: Record<LifecycleStatus, string> = {
  Active: 'bg-muted text-muted-foreground',
  'On Hold': 'bg-slate-400 text-white',
  Completed: 'bg-gray-200 text-gray-600',
  Cancelled: 'bg-gray-100 text-gray-400 line-through',
};

/** Aggregate state of one boolean flag (poReceived/confirmed) across ALL of
 * a job's accounts — 'yes' only if every account has it, 'no' only if none
 * do, 'partial' otherwise. Powers List's PO/Confirmed dot indicators (D24)
 * — a single job-level PO Received/Confirmed column has to say something
 * honest when a multi-account job's accounts disagree, rather than picking
 * one account arbitrarily. */
export type FlagAggregate = 'yes' | 'partial' | 'no';

export function aggregateAccountFlag(
  accounts: JobAccount[],
  field: 'poReceived' | 'confirmed'
): FlagAggregate {
  if (accounts.length === 0) return 'no';
  const all = accounts.every((a) => a[field]);
  if (all) return 'yes';
  const any = accounts.some((a) => a[field]);
  return any ? 'partial' : 'no';
}
