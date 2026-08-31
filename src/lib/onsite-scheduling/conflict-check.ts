/**
 * PROTOTYPE ONLY — technician conflict checking.
 *
 * Cross-entity by design per FRD §10 open engineering question #6: a
 * conflict check has to look across jobs AND non-service entries, by
 * technician, by date range — not just job-vs-job (that narrower check is
 * what the real Technicians.tsx already does against the live API).
 *
 * Decision D2 (capacity limit) and D4 (override scope) govern how this is
 * surfaced: advisory, never blocking. See mock-data.ts openDecisions.
 */
import { format } from 'date-fns';
import type { NonServiceEntry, ScheduledJob } from './types';

export interface DateRange {
  startDate: string;
  endDate: string;
}

/** Inclusive yyyy-MM-dd range overlap check — plain string comparison is
 * safe here because both ends are always zero-padded ISO dates. */
export function rangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.startDate <= b.endDate && b.startDate <= a.endDate;
}

export type ConflictReason =
  | { kind: 'job'; job: ScheduledJob }
  | { kind: 'non-service'; entry: NonServiceEntry };

export interface TechnicianConflictResult {
  technicianId: string;
  conflicts: ConflictReason[];
  /** Advisory-only capacity note (Decision D2) — never a hard block. */
  sameDayJobCount: number;
}

/**
 * Find every job and non-service entry that overlaps `range` for a given
 * technician, excluding `excludeJobId` (the job currently being edited, so
 * editing a job's own dates doesn't flag itself) and `excludeEntryId` (same
 * idea, for editing a non-service entry — without this, an entry being
 * edited always overlaps its own stored range and falsely flags itself as
 * conflicting with itself; see D13/conflict-fix notes in the journey doc).
 */
export function getTechnicianConflicts(
  technicianId: string,
  range: DateRange,
  data: { jobs: ScheduledJob[]; nonServiceEntries: NonServiceEntry[] },
  excludeJobId?: string,
  excludeEntryId?: string
): TechnicianConflictResult {
  const conflictingJobs = data.jobs.filter(
    (job) =>
      job.id !== excludeJobId &&
      job.status !== 'Cancelled' &&
      job.technicianIds.includes(technicianId) &&
      rangesOverlap(range, job)
  );

  const conflictingEntries = data.nonServiceEntries.filter(
    (entry) =>
      entry.id !== excludeEntryId &&
      entry.technicianIds.includes(technicianId) &&
      rangesOverlap(range, entry)
  );

  const conflicts: ConflictReason[] = [
    ...conflictingJobs.map((job): ConflictReason => ({ kind: 'job', job })),
    ...conflictingEntries.map(
      (entry): ConflictReason => ({ kind: 'non-service', entry })
    ),
  ];

  return {
    technicianId,
    conflicts,
    sameDayJobCount: conflictingJobs.length,
  };
}

export function describeConflict(reason: ConflictReason): string {
  if (reason.kind === 'job') {
    return `Job ${reason.job.projectNumber} (${reason.job.startDate} – ${reason.job.endDate})`;
  }
  return `${reason.entry.type} (${reason.entry.startDate} – ${reason.entry.endDate})`;
}

function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  if (startIso === endIso) return format(start, 'MMM d');
  const sameMonth =
    start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  return sameMonth
    ? `${format(start, 'MMM d')}–${format(end, 'd')}`
    : `${format(start, 'MMM d')}–${format(end, 'MMM d')}`;
}

/**
 * FRD Rule 8 — a conflict has to say WHY, specifically, not just flag that
 * one exists: which technician, what the conflicting thing is (a job or
 * which non-service type), when THAT is, and which of the job's own dates
 * it actually overlaps (not just "they're busy sometime that week"). e.g.
 * "Jane Smith has PTO scheduled May 3–5, overlapping this job's May 4
 * date." Named per-conflict rather than joined into one line (like the
 * plainer `describeConflict` above) so each reason keeps its own accurate
 * overlap window when a technician has more than one. */
export function describeConflictDetailed(
  technicianName: string,
  reason: ConflictReason,
  jobRange: DateRange
): string {
  const reasonRange: DateRange =
    reason.kind === 'job'
      ? { startDate: reason.job.startDate, endDate: reason.job.endDate }
      : { startDate: reason.entry.startDate, endDate: reason.entry.endDate };

  const overlapStart =
    reasonRange.startDate > jobRange.startDate
      ? reasonRange.startDate
      : jobRange.startDate;
  const overlapEnd =
    reasonRange.endDate < jobRange.endDate ? reasonRange.endDate : jobRange.endDate;
  const overlapNoun = overlapStart === overlapEnd ? 'date' : 'dates';

  const what =
    reason.kind === 'job'
      ? `is already assigned to Job ${reason.job.projectNumber} (${formatDateRange(reason.job.startDate, reason.job.endDate)})`
      : `has ${reason.entry.type} scheduled ${formatDateRange(reason.entry.startDate, reason.entry.endDate)}`;

  return `${technicianName} ${what}, overlapping this job's ${formatDateRange(overlapStart, overlapEnd)} ${overlapNoun}.`;
}

/**
 * Which of a job's own assigned technicians currently have a conflict
 * (another job or non-service entry overlapping this job's dates), so the
 * Calendar grid can flag it without requiring a dialog to be opened first.
 * Cancelled jobs are never flagged — matching the same exclusion
 * `getTechnicianConflicts` already applies when checking against *other*
 * jobs.
 */
export function jobHasTechnicianConflict(
  job: ScheduledJob,
  data: { jobs: ScheduledJob[]; nonServiceEntries: NonServiceEntry[] }
): boolean {
  if (job.status === 'Cancelled') return false;
  return job.technicianIds.some(
    (techId) => getTechnicianConflicts(techId, job, data, job.id).conflicts.length > 0
  );
}
