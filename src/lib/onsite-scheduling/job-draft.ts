/**
 * PROTOTYPE ONLY — shared "build a freshly-created default ScheduledJob"
 * logic (2026-08-15).
 *
 * NewJobDialog.tsx (create a job from scratch) and UnscheduledWorkQueue.tsx's
 * ScheduleDialog (convert one queue item into a job) each independently
 * built this same object shape and validation rule — including an
 * accidental divergence (ScheduleDialog required at least one technician
 * before allowing Confirm; NewJobDialog didn't). This is that logic written
 * once, so both dialogs enforce the same rule and a future change to the
 * default shape only has to happen in one place.
 *
 * A freshly-created job always starts Red (D12) — its one account has
 * neither PO Received nor Confirmed yet, no manual On Hold override, no
 * hours logged. Everything here is exactly what both dialogs already
 * collected; nothing new was added. All of this is real, editable once the
 * job exists (see JobDetailDialog.tsx, D19/D22) — just not asked for at
 * creation time, matching D12's "don't guess extra fields here" scope.
 */
import type { ScheduledJob } from './types';

export interface DraftJobInput {
  customerName: string;
  startDate: string;
  endDate: string;
  location: string;
  division: string;
  salesCodes: string[];
  technicianIds: string[];
  vehicleId?: string;
}

export function buildDraftJob(input: DraftJobInput): ScheduledJob {
  return {
    id: `job-${Date.now()}`,
    projectNumber: `PJ-${Math.floor(10000 + Math.random() * 89999)}`,
    startDate: input.startDate,
    endDate: input.endDate,
    status: 'Red',
    location: input.location,
    division: input.division,
    salesCodes: input.salesCodes,
    accounts: [{ customerName: input.customerName, poReceived: false, confirmed: false }],
    technicianIds: input.technicianIds,
    vehicleId: input.vehicleId,
    osrStatus: 'missing',
    onHold: false,
    technicianHours: {},
    comments: [],
  };
}

/** Minimum-required-fields rule both creation dialogs enforce: a valid date
 * range and at least one assigned technician. */
export function isDraftJobValid(input: {
  startDate: string;
  endDate: string;
  technicianIds: string[];
}): boolean {
  return (
    input.technicianIds.length > 0 &&
    !!input.startDate &&
    !!input.endDate &&
    input.startDate <= input.endDate
  );
}
