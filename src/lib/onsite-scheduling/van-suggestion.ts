/**
 * PROTOTYPE ONLY — "which van/location should run this job?" ranking (D32).
 *
 * Answers the question directly: what would it take to recommend the best
 * van for a job based on geography? Three inputs are needed, and this file
 * is honest about which of them exist.
 *
 *  1. Where the job is.        STAND-IN. Derived from the job's first
 *                              account's city, looked up against
 *                              STAND_IN_COORDS (city centroids). A real
 *                              build geocodes the customer SITE address.
 *  2. Where each van lives.    STAND-IN, but structurally right —
 *                              JOB_VEHICLES.homeLocation. Torqueware's
 *                              equivalent is the "from site" field, which
 *                              is what drives its mileage/drive-time calc.
 *  3. Distance between them.   STAND-IN. Great-circle miles. A real build
 *                              needs drive time from a mapping service,
 *                              because drive time is what actually feeds
 *                              cost, and a river or a mountain range makes
 *                              straight-line distance a lie.
 *
 * What is NOT a stand-in, and is the actual point of building this: the
 * ranking combines proximity with real availability from this prototype's
 * own conflict-check, so the recommendation is "closest van whose
 * technicians are actually free," not "closest van." That combination is
 * the part worth validating with Dan, and it doesn't need a mapping API to
 * evaluate.
 *
 * Deliberately NOT modeled here (see N18/N19):
 *  - Profitability. Dan's real ask was the most *profitable* path, not the
 *    nearest van. That needs labour rate, per diem, and the MSA-vs-list
 *    pricing split, none of which exist in this build. Ranking by distance
 *    and calling it profitability would be the exact fake number gap #16
 *    already refused once.
 *  - Multi-stop route optimization. A week-long run of several stops is a
 *    different problem (travelling salesman, not nearest neighbour) and it
 *    is where Dan's Google Maps step actually lives.
 */
import { getTechnicianConflicts, rangesOverlap, type DateRange } from './conflict-check';
import { JOB_VEHICLES, STAND_IN_COORDS } from './mock-data';
import type { NonServiceEntry, PrototypeTechnician, ScheduledJob } from './types';

export type SuggestionConfidence = 'known' | 'unknown-site';

export interface VanSuggestion {
  vehicleId: string;
  vehicleName: string;
  homeLocation: string;
  spare: boolean;
  /** Great-circle miles, or null when the job's site can't be resolved at
   * all — surfaced as "site unknown" rather than silently sorted to zero.
   * Torqueware's own version has a documented bug where a failed distance
   * lookup falls back to zero *silently*, which reads as "next door." Not
   * reproducing that is deliberate. */
  standInMiles: number | null;
  /** Technicians based at this van's home location who have no job or
   * non-service conflict across the job's dates. */
  availableTechnicianIds: string[];
  /** Same-location technicians who are busy — shown, not hidden, so a
   * scheduler can see the tradeoff rather than wonder where someone went. */
  busyTechnicianIds: string[];
  confidence: SuggestionConfidence;
  /** Plain-language reason this row sits where it does. Rendered in the UI
   * so the ranking never looks like an oracle. */
  rationale: string;
}

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance in miles. Straight-line, NOT drive time — see the
 * file header. Exported for the panel's own copy about what it measures. */
export function standInDistanceMiles(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

/** Best guess at where a job physically happens: the first account's city,
 * falling back to the job's own location bucket. Returns null when neither
 * resolves against STAND_IN_COORDS, which the caller must surface rather
 * than treat as distance zero. */
export function resolveJobSite(
  job: Pick<ScheduledJob, 'accounts' | 'location'>
): { label: string; lat: number; lon: number } | null {
  const candidates = [
    job.accounts[0]?.city,
    job.accounts.find((a) => a.city)?.city,
    job.location,
  ].filter((c): c is string => !!c);
  for (const label of candidates) {
    const coords = STAND_IN_COORDS[label];
    if (coords) return { label, ...coords };
  }
  return null;
}

/**
 * Rank every van for a job. Ordering, in priority order:
 *  1. Vans with at least one available technician beat vans with none. A
 *     closer van nobody can staff is not a better answer.
 *  2. Then nearest first.
 *  3. Spare vans rank last within their tier — Alltite holds a spare
 *     deliberately as emergent-job buffer, so burning it on routine work
 *     has a cost the distance number doesn't show.
 * Vans whose site can't be resolved sort to the bottom, labeled.
 */
export function suggestVans(
  job: Pick<ScheduledJob, 'id' | 'accounts' | 'location' | 'startDate' | 'endDate'>,
  data: {
    jobs: ScheduledJob[];
    nonServiceEntries: NonServiceEntry[];
    technicians: PrototypeTechnician[];
  }
): { site: ReturnType<typeof resolveJobSite>; suggestions: VanSuggestion[] } {
  const site = resolveJobSite(job);
  const range: DateRange = { startDate: job.startDate, endDate: job.endDate };

  const suggestions: VanSuggestion[] = JOB_VEHICLES.map((vehicle) => {
    const homeCoords = STAND_IN_COORDS[vehicle.homeLocation];
    const standInMiles =
      site && homeCoords ? Math.round(standInDistanceMiles(site, homeCoords)) : null;

    const localTechs = data.technicians.filter(
      (t) => t.location === vehicle.homeLocation
    );
    const availableTechnicianIds: string[] = [];
    const busyTechnicianIds: string[] = [];
    for (const tech of localTechs) {
      const result = getTechnicianConflicts(tech.id, range, data, job.id);
      if (result.conflicts.length > 0) busyTechnicianIds.push(tech.id);
      else availableTechnicianIds.push(tech.id);
    }

    const confidence: SuggestionConfidence =
      standInMiles === null ? 'unknown-site' : 'known';
    const rationale = buildRationale({
      standInMiles,
      homeLocation: vehicle.homeLocation,
      available: availableTechnicianIds.length,
      busy: busyTechnicianIds.length,
      spare: vehicle.spare,
      siteLabel: site?.label,
    });

    return {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      homeLocation: vehicle.homeLocation,
      spare: vehicle.spare,
      standInMiles,
      availableTechnicianIds,
      busyTechnicianIds,
      confidence,
      rationale,
    };
  });

  suggestions.sort((a, b) => {
    const aStaffed = a.availableTechnicianIds.length > 0 ? 0 : 1;
    const bStaffed = b.availableTechnicianIds.length > 0 ? 0 : 1;
    if (aStaffed !== bStaffed) return aStaffed - bStaffed;
    if (a.spare !== b.spare) return a.spare ? 1 : -1;
    if (a.standInMiles === null) return b.standInMiles === null ? 0 : 1;
    if (b.standInMiles === null) return -1;
    return a.standInMiles - b.standInMiles;
  });

  return { site, suggestions };
}

function buildRationale(input: {
  standInMiles: number | null;
  homeLocation: string;
  available: number;
  busy: number;
  spare: boolean;
  siteLabel?: string;
}): string {
  const parts: string[] = [];
  if (input.standInMiles === null) {
    parts.push("job site can't be resolved, so distance is unknown, not zero");
  } else {
    parts.push(
      `~${input.standInMiles} mi straight-line from ${input.homeLocation}` +
        (input.siteLabel ? ` to ${input.siteLabel}` : '')
    );
  }
  parts.push(
    input.available > 0
      ? `${input.available} technician${input.available === 1 ? '' : 's'} free`
      : `no technicians free at ${input.homeLocation}`
  );
  if (input.busy > 0) parts.push(`${input.busy} busy`);
  if (input.spare)
    parts.push('spare van — held for emergent work, ranked last on purpose');
  return parts.join(' · ');
}

/** Whether a job already has enough information for the ranking to say
 * anything useful. Used to render an honest empty state instead of a
 * confident-looking list built on nothing. */
export function canSuggest(job: Pick<ScheduledJob, 'accounts' | 'location'>): boolean {
  return resolveJobSite(job) !== null;
}

/** Re-exported so the panel can show which jobs overlap without importing
 * conflict-check separately. */
export { rangesOverlap };
