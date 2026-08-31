/**
 * PROTOTYPE ONLY — seed data for the Onsite Scheduling capability.
 *
 * All data below is invented for demo purposes. Nothing here is pulled from
 * a live backend (see /prototype/README.md — that's a deliberate, discussed
 * choice for this pass, not an oversight). Dates are anchored around
 * 2026-08-11 so the Calendar has something to show on first load.
 */
import type {
  BacklogItem,
  DecisionOwner,
  JobAccount,
  NonServiceEntry,
  NotBuiltItem,
  OpenDecisionItem,
  PrototypeTechnician,
  ScheduledJob,
  UnscheduledWorkItem,
} from './types';

export const seedTechnicians: PrototypeTechnician[] = [
  {
    id: 'tech-1',
    name: 'Dana Fontenot',
    capabilities: ['In-Lab Calibration', 'Onsite Electrical'],
    location: 'Baton Rouge',
    division: 'Electrical',
  },
  {
    id: 'tech-2',
    name: 'Marcus Ibarra',
    capabilities: ['Onsite Mechanical'],
    location: 'Baton Rouge',
    division: 'Mechanical',
  },
  {
    id: 'tech-3',
    name: 'Priya Nair',
    capabilities: ['Onsite Electrical', 'Onsite Mechanical'],
    location: 'Wichita',
    division: 'Multi',
  },
  {
    id: 'tech-4',
    name: 'Jean Tremblay',
    capabilities: ['Onsite Electrical', 'In-Lab Calibration'],
    location: 'Canada',
    division: 'Electrical',
  },
  {
    id: 'tech-5',
    name: 'Ray Doucet',
    capabilities: ['Onsite Mechanical'],
    location: 'Baton Rouge',
    division: 'Mechanical',
  },
  {
    id: 'tech-6',
    name: 'Casey Boudreaux',
    capabilities: ['Onsite Electrical'],
    location: 'Wichita',
    division: 'Electrical',
  },
  {
    id: 'tech-7',
    name: 'Lena Ouellet',
    capabilities: ['Onsite Electrical', 'Onsite Mechanical', 'In-Lab Calibration'],
    location: 'Canada',
    division: 'Multi',
  },
  {
    id: 'tech-8',
    name: 'Tomas Reyes',
    capabilities: ['Onsite Mechanical'],
    location: 'Wichita',
    division: 'Mechanical',
  },
];

export const seedNonServiceEntries: NonServiceEntry[] = [
  {
    id: 'ns-1',
    type: 'PTO',
    technicianIds: ['tech-2'],
    startDate: '2026-08-12',
    endDate: '2026-08-14',
    notes: 'Approved vacation.',
  },
  {
    id: 'ns-2',
    type: 'Travel',
    technicianIds: ['tech-3'],
    startDate: '2026-08-17',
    endDate: '2026-08-18',
    notes: 'Travel in/out for the Wichita→Canada handoff job.',
  },
  {
    id: 'ns-3',
    type: 'Out of Service',
    technicianIds: ['tech-5'],
    startDate: '2026-08-10',
    endDate: '2026-08-16',
    notes: 'Service truck in the shop — no onsite work assignable this week.',
  },
  {
    id: 'ns-4',
    type: 'Tentative',
    technicianIds: ['tech-6'],
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    notes: 'Possible customer walk-through — not yet confirmed.',
  },
  {
    id: 'ns-5',
    type: 'PTO',
    technicianIds: ['tech-4'],
    startDate: '2026-08-24',
    endDate: '2026-08-25',
  },
  {
    id: 'ns-6',
    type: 'Out of Service',
    technicianIds: ['tech-8'],
    startDate: '2026-08-27',
    endDate: '2026-08-28',
    notes: 'Loaner truck delayed a day.',
  },
  {
    id: 'ns-7',
    type: 'Tentative',
    technicianIds: ['tech-1'],
    startDate: '2026-09-02',
    endDate: '2026-09-03',
    notes: 'Possible add-on visit — customer still confirming.',
  },
  {
    id: 'ns-8',
    type: 'PTO',
    technicianIds: ['tech-7'],
    startDate: '2026-09-09',
    endDate: '2026-09-11',
  },
  // --- Added for journey/scenario coverage (see
  // onsite-scheduling-user-journeys-and-test-data.md) ---
  {
    id: 'ns-9',
    // Travel-type conflict against an active job (D4) — until now only PTO
    // (ns-1) and Tentative (ns-4) demonstrated the conflict banner; this
    // covers Travel specifically. Overlaps job-10 (tech-1, Aug 29-30).
    type: 'Travel',
    technicianIds: ['tech-1'],
    startDate: '2026-08-29',
    endDate: '2026-08-29',
    notes: 'Drive day to Marathon site — overlaps his own job by mistake, on purpose.',
  },
  {
    id: 'ns-10',
    // Out of Service conflict against an active job — same gap as above but
    // for the fourth type. Overlaps job-13 (tech-5, Sept 15-16).
    type: 'Out of Service',
    technicianIds: ['tech-5'],
    startDate: '2026-09-15',
    endDate: '2026-09-15',
    notes: 'Truck flagged for inspection the morning of.',
  },
  {
    id: 'ns-11',
    // Two overlapping non-service entries for the SAME technician (no job
    // involved) — conflict-check only compares jobs vs entries per
    // technician, not entry-vs-entry, so this exercises whether the lane
    // packer stacks two same-tech bars cleanly without a matching warning
    // anywhere. Worth a look — see journey notes.
    type: 'Tentative',
    technicianIds: ['tech-2'],
    startDate: '2026-08-13',
    endDate: '2026-08-13',
    notes: 'Possible second stop — same day as his PTO (ns-1) and job-3 conflict.',
  },
  {
    id: 'ns-12',
    // Non-service entry crossing a month boundary (Aug -> Sept), to check
    // the bar-clipping/rounded-cap logic across the calendar's month-nav
    // boundary the same way job-15 below does for jobs.
    type: 'Out of Service',
    technicianIds: ['tech-3'],
    startDate: '2026-08-30',
    endDate: '2026-09-02',
    notes: 'Loaner truck swap spans the month turnover.',
  },
  {
    id: 'ns-13',
    // Long PTO block, Wichita tech, no notes — fills out Wichita coverage
    // and exercises the "no notes" rendering path for non-service entries.
    type: 'PTO',
    technicianIds: ['tech-8'],
    startDate: '2026-09-14',
    endDate: '2026-09-18',
  },
];

/** Known customer accounts a job can be associated with — shared source for
 * JobDetailDialog's add/remove customer control and
 * mock-onsite-project-api.ts's ACCT_NUM_BY_CUSTOMER map (D19). */
export const KNOWN_CUSTOMERS = [
  'Marathon Refining',
  'Entergy Louisiana',
  'Cenovus Energy',
  'Koch Industries',
  'Westlake Chemical',
  'Suncor Energy',
] as const;

/** Company-wide vehicle list for JobDetailDialog's vehicle picker (D19).
 * Mirrors mock-onsite-project-api.ts's MOCK_LOOKUPS.vehicles — kept as a
 * separate small list rather than a shared import so this file (seed data)
 * has no dependency on the mock API module.
 *
 * `homeLocation` and `spare` added 2026-08-19 for D32 (van suggestion).
 * Both are modeled on real described behavior, not invented structure:
 * `03-scheduling-dispatch-workflow.md` says the "from site" field (which
 * van/location runs the job) is what drives the mileage and drive-time
 * calculation, so a van without a home base can't be ranked at all; and
 * Alltite keeps a dedicated spare van plus flexible in-house technicians
 * as a buffer for emergent jobs and breakdowns, which is a real reason to
 * rank a van last-but-available rather than hide it.
 *
 * The van NAMES here are still prototype fiction. Do not read "Van 12" as
 * a claim about JM Test's or Alltite's real fleet numbering. */
export const JOB_VEHICLES = [
  { id: 'veh-1', name: 'Service Truck 1', homeLocation: 'Baton Rouge', spare: false },
  { id: 'veh-2', name: 'Service Truck 2', homeLocation: 'Baton Rouge', spare: false },
  { id: 'veh-3', name: 'Van 3', homeLocation: 'Wichita', spare: false },
  { id: 'veh-4', name: 'Van 4', homeLocation: 'Canada', spare: false },
  { id: 'veh-5', name: 'Van 12 (spare)', homeLocation: 'Wichita', spare: true },
] as const;

/** Managing Lab options for JobDetailDialog's Administrative section
 * (D27, from Canada's RMID form). A plain fixed list — doesn't resolve N7
 * (real technician/lab sourcing), just surfaces the field for review. */
export const MANAGING_LABS = ['Baton Rouge Lab', 'Wichita Lab', 'Canada Lab'] as const;

/** Location/Division options for NewJobDialog's create form (D10, built
 * 2026-08-15) — the exact three of each already used across every seed
 * job below, not a separately-invented vocabulary. */
export const JOB_LOCATIONS = ['Baton Rouge', 'Wichita', 'Canada'] as const;
export const JOB_DIVISIONS = ['Electrical', 'Mechanical', 'Multi'] as const;

/** On Hold is a job-level manual override, independent of any account's PO
 * Received/Confirmed flags (D22 / FRD §7 Rule 2). Only used here to seed
 * every row consistent with what it visually showed before D22's
 * per-account migration — real edits set it directly via JobDetailDialog's
 * On Hold switch. */
function onHoldFor(status: ScheduledJob['status']): boolean {
  return status === 'On Hold';
}

/** Known account numbers per customer — single source shared with
 * mock-onsite-project-api.ts (which previously duplicated this as its own
 * ACCT_NUM_BY_CUSTOMER; now imports it from here). */
export const KNOWN_CUSTOMER_ACCOUNT_NUMBERS: Record<string, string> = {
  'Marathon Refining': '44210',
  'Entergy Louisiana': '30877',
  'Cenovus Energy': 'CA-1092',
  'Koch Industries': '51120',
  'Westlake Chemical': '60234',
  'Suncor Energy': 'CA-1147',
};

/** Exported (2026-08-15) so JobDetailDialog's interactive "Add a customer"
 * flow can prefill City/State the same way seeded accounts already get it
 * via toAccounts() below, instead of adding a customer with every field
 * blank even when the job's location already implies it. */
export const CITY_STATE_BY_LOCATION: Record<string, { city: string; state: string }> = {
  'Baton Rouge': { city: 'Baton Rouge', state: 'LA' },
  Wichita: { city: 'Wichita', state: 'KS' },
  Canada: { city: 'Calgary', state: 'AB' },
};

/**
 * STAND-IN COORDINATES — PROTOTYPE ONLY. DO NOT MERGE TO MAIN.
 *
 * Approximate lat/long per city, used by van-suggestion.ts to rank vans by
 * straight-line proximity so the *ranking UX* can be validated (D32). These
 * are real city centroids, which makes the demo behave sensibly, but they
 * are not a geocoding capability:
 *  - Real jobs happen at a customer SITE address, not a city centre. A
 *    refinery 40 miles outside Baton Rouge ranks identically to one
 *    downtown here, and that is exactly the error a real geocoder removes.
 *  - Straight-line distance is not drive time. Torqueware uses a real
 *    mapping lookup for this and reads travel time, not miles, into its
 *    cost figure.
 * See N19 for the sourcing decision (including the in-tenant Azure Maps
 * option) that has to be answered before any of this becomes real.
 */
export const STAND_IN_COORDS: Record<string, { lat: number; lon: number }> = {
  'Baton Rouge': { lat: 30.45, lon: -91.19 },
  Wichita: { lat: 37.69, lon: -97.34 },
  Calgary: { lat: 51.05, lon: -114.07 },
  Canada: { lat: 51.05, lon: -114.07 },
  Houston: { lat: 29.76, lon: -95.37 },
  'Corpus Christi': { lat: 27.8, lon: -97.4 },
  'Lake Charles': { lat: 30.23, lon: -93.22 },
  Denver: { lat: 39.74, lon: -104.99 },
  Edmonton: { lat: 53.55, lon: -113.49 },
};

function contactSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z]+/g, '');
}

// Deterministic, not random — a plain incrementing counter is enough to
// keep every account's placeholder PO/SR/Quote/WO numbers and quote value
// distinct across the whole seed file without threading a job index
// through every toAccounts() call site.
let accountSeedCounter = 0;

/** Seeds each named account with PO Received/Confirmed flags that
 * reproduce the job's pre-migration flat status (D22), plus the D27
 * per-account fields (city/state, account #, PO number, contacts, quote
 * value, SR#/Quote#/WO# placeholders) — every account on a given seed job
 * starts with the same status-derived flags, since none of this
 * prototype's seed scenarios call for differing per-account flags on the
 * same job. Real accounts diverge from there via JobDetailDialog's
 * per-account editors. See job-status.ts for how poReceived/confirmed
 * aggregate back into the job's displayed Red/Green/Partial. */
function toAccounts(
  names: string[],
  status: ScheduledJob['status'],
  location: string
): JobAccount[] {
  const poReceived = status === 'Green' || status === 'Partial';
  const confirmed = status === 'Green';
  const cityState = CITY_STATE_BY_LOCATION[location] ?? { city: location, state: '' };
  return names.map((customerName) => {
    accountSeedCounter++;
    const slug = contactSlug(customerName);
    return {
      customerName,
      poReceived,
      confirmed,
      city: cityState.city,
      state: cityState.state,
      accountNumber: KNOWN_CUSTOMER_ACCOUNT_NUMBERS[customerName],
      poNumber: poReceived ? `PO-${900000 + accountSeedCounter}` : undefined,
      customerContactName: `${customerName} Contact`,
      customerContactEmail: `contact@${slug}.com`,
      customerContactPhone: '555-010-0100',
      siteContactName: `${customerName} Site Contact`,
      siteContactEmail: `site@${slug}.com`,
      siteContactPhone: '555-020-0200',
      quoteValue: 3000 + ((accountSeedCounter * 733) % 18000),
      srNumber: `SR${1000 + accountSeedCounter}`,
      quoteNumber: `QT${2000 + accountSeedCounter}`,
      workOrderNumber: `WO${3000 + accountSeedCounter}`,
      // Matches Andrea's real screen's numbering style ("OSR002584") — see N8.
      osrNumber: `OSR${String(2580 + accountSeedCounter).padStart(6, '0')}`,
    };
  });
}

export const seedJobs: ScheduledJob[] = [
  {
    id: 'job-1',
    projectNumber: 'PJ-10234',
    startDate: '2026-08-05',
    endDate: '2026-08-06',
    status: 'Green',
    location: 'Baton Rouge',
    division: 'Electrical',
    salesCodes: ['TX-14'],
    accounts: toAccounts(['Marathon Refining'], 'Green', 'Baton Rouge'),
    technicianIds: ['tech-1', 'tech-2'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: 'M. Talbot',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'A. Crowe ~ 17',
    managingLab: 'Wichita Lab',
    comments: [],
    vehicleId: 'veh-1',
    technicianHours: {
      'tech-1': { travelInHours: 1.5, travelOutHours: 1.5, productionHours: 7 },
      'tech-2': { travelInHours: 1.5, travelOutHours: 1.5, productionHours: 7 },
    },
  },
  {
    id: 'job-2',
    projectNumber: 'PJ-10235',
    startDate: '2026-08-11',
    endDate: '2026-08-11',
    status: 'Red',
    location: 'Baton Rouge',
    division: 'Mechanical',
    salesCodes: ['LA-02'],
    accounts: toAccounts(['Entergy Louisiana'], 'Red', 'Baton Rouge'),
    technicianIds: ['tech-2'],
    osrStatus: 'missing',
    onHold: onHoldFor('Red'),
    outsideSales: 'A. Furlong',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'L. Broussard ~ 63',
    managingLab: 'Canada Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-3',
    projectNumber: 'PJ-10236',
    startDate: '2026-08-13',
    endDate: '2026-08-14',
    status: 'Red',
    location: 'Baton Rouge',
    division: 'Mechanical',
    salesCodes: ['TX-14'],
    accounts: toAccounts(['Koch Industries'], 'Red', 'Baton Rouge'),
    // Deliberately overlaps tech-2's PTO (ns-1, Aug 12–14) — the seeded
    // dual-capability + conflict scenario the acceptance checklist asks for.
    technicianIds: ['tech-2'],
    osrStatus: 'expired',
    onHold: onHoldFor('Red'),
    outsideSales: '',
    preServiceChecklist: 'Site access confirmed; PPE requirements on file.',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: '',
    managingLab: '',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-4',
    projectNumber: 'PJ-10237',
    // Canada-style long job — 10 continuous days, spans three calendar weeks.
    startDate: '2026-08-12',
    endDate: '2026-08-21',
    status: 'Green',
    location: 'Canada',
    division: 'Electrical',
    salesCodes: ['CA-01'],
    accounts: toAccounts(['Cenovus Energy'], 'Green', 'Canada'),
    technicianIds: ['tech-4'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: 'J. Reyes',
    preServiceChecklist: '',
    postServiceChecklist: 'Customer walkthrough complete; no outstanding punch items.',
    postedInvoice: '',
    managedBy: 'B. Guidry ~ 42',
    managingLab: 'Baton Rouge Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-5',
    projectNumber: 'PJ-10238',
    startDate: '2026-08-18',
    endDate: '2026-08-18',
    status: 'On Hold',
    location: 'Baton Rouge',
    division: 'Mechanical',
    salesCodes: ['TX-14'],
    accounts: toAccounts(['Koch Industries'], 'On Hold', 'Baton Rouge'),
    technicianIds: ['tech-5'],
    osrStatus: 'ok',
    onHold: onHoldFor('On Hold'),
    outsideSales: 'M. Talbot',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: 'INV-8005',
    managedBy: 'A. Crowe ~ 17',
    managingLab: 'Wichita Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-6',
    projectNumber: 'PJ-10239',
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    status: 'Green',
    location: 'Wichita',
    division: 'Multi',
    salesCodes: ['TX-07'],
    accounts: toAccounts(['Koch Industries', 'Entergy Louisiana'], 'Green', 'Wichita'),
    technicianIds: ['tech-3', 'tech-6'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: 'A. Furlong',
    preServiceChecklist: 'Site access confirmed; PPE requirements on file.',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'L. Broussard ~ 63',
    managingLab: 'Canada Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-7',
    projectNumber: 'PJ-10225',
    startDate: '2026-07-28',
    endDate: '2026-07-29',
    status: 'Completed',
    location: 'Baton Rouge',
    division: 'Electrical',
    salesCodes: ['LA-02', 'TX-14'],
    accounts: toAccounts(['Marathon Refining'], 'Completed', 'Baton Rouge'),
    technicianIds: ['tech-1'],
    osrStatus: 'ok',
    onHold: onHoldFor('Completed'),
    outsideSales: '',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: '',
    managingLab: '',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-8',
    projectNumber: 'PJ-10226',
    startDate: '2026-08-03',
    endDate: '2026-08-03',
    status: 'Cancelled',
    location: 'Wichita',
    division: 'Electrical',
    salesCodes: ['TX-07'],
    accounts: toAccounts(['Entergy Louisiana'], 'Cancelled', 'Wichita'),
    technicianIds: ['tech-6'],
    osrStatus: 'ok',
    onHold: onHoldFor('Cancelled'),
    outsideSales: 'J. Reyes',
    preServiceChecklist: '',
    postServiceChecklist: 'Customer walkthrough complete; no outstanding punch items.',
    postedInvoice: '',
    managedBy: 'B. Guidry ~ 42',
    managingLab: 'Baton Rouge Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-9',
    projectNumber: 'PJ-10240',
    startDate: '2026-08-26',
    endDate: '2026-08-27',
    status: 'Green',
    location: 'Wichita',
    division: 'Mechanical',
    salesCodes: ['TX-07'],
    accounts: toAccounts(['Westlake Chemical'], 'Green', 'Wichita'),
    technicianIds: ['tech-8'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: 'M. Talbot',
    preServiceChecklist: 'Site access confirmed; PPE requirements on file.',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'A. Crowe ~ 17',
    managingLab: 'Wichita Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-10',
    projectNumber: 'PJ-10241',
    startDate: '2026-08-29',
    endDate: '2026-08-30',
    status: 'Partial',
    location: 'Baton Rouge',
    division: 'Electrical',
    salesCodes: ['LA-02'],
    accounts: toAccounts(['Marathon Refining'], 'Partial', 'Baton Rouge'),
    technicianIds: ['tech-1'],
    osrStatus: 'ok',
    onHold: onHoldFor('Partial'),
    outsideSales: 'A. Furlong',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: 'INV-8010',
    managedBy: 'L. Broussard ~ 63',
    managingLab: 'Canada Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-11',
    projectNumber: 'PJ-10242',
    startDate: '2026-09-02',
    endDate: '2026-09-03',
    status: 'Red',
    location: 'Wichita',
    division: 'Multi',
    salesCodes: ['TX-07'],
    accounts: toAccounts(['Koch Industries'], 'Red', 'Wichita'),
    technicianIds: ['tech-3'],
    osrStatus: 'missing',
    onHold: onHoldFor('Red'),
    outsideSales: '',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: '',
    managingLab: '',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-12',
    projectNumber: 'PJ-10243',
    startDate: '2026-09-08',
    endDate: '2026-09-09',
    status: 'Green',
    location: 'Canada',
    division: 'Electrical',
    salesCodes: ['CA-01'],
    accounts: toAccounts(['Cenovus Energy'], 'Green', 'Canada'),
    technicianIds: ['tech-4'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: 'J. Reyes',
    preServiceChecklist: 'Site access confirmed; PPE requirements on file.',
    postServiceChecklist: 'Customer walkthrough complete; no outstanding punch items.',
    postedInvoice: '',
    managedBy: 'B. Guidry ~ 42',
    managingLab: 'Baton Rouge Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-13',
    projectNumber: 'PJ-10244',
    startDate: '2026-09-15',
    endDate: '2026-09-16',
    status: 'On Hold',
    location: 'Baton Rouge',
    division: 'Mechanical',
    salesCodes: ['TX-14'],
    accounts: toAccounts(['Entergy Louisiana'], 'On Hold', 'Baton Rouge'),
    technicianIds: ['tech-5'],
    osrStatus: 'ok',
    onHold: onHoldFor('On Hold'),
    outsideSales: 'M. Talbot',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'A. Crowe ~ 17',
    managingLab: 'Wichita Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-14',
    projectNumber: 'PJ-10245',
    startDate: '2026-09-22',
    endDate: '2026-09-24',
    status: 'Green',
    location: 'Wichita',
    division: 'Mechanical',
    salesCodes: ['TX-07'],
    accounts: toAccounts(['Westlake Chemical'], 'Green', 'Wichita'),
    technicianIds: ['tech-8', 'tech-3'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: 'A. Furlong',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'L. Broussard ~ 63',
    managingLab: 'Canada Lab',
    comments: [],
    technicianHours: {},
  },
  // --- Added for journey/scenario coverage (see
  // onsite-scheduling-user-journeys-and-test-data.md) ---
  {
    id: 'job-15',
    // Crosses a month boundary (Aug -> Sept) — tests bar clipping/rounded
    // caps across the calendar's month-nav seam, the one shape job-4
    // (Canada, 10 days) doesn't cover since it stays inside August.
    projectNumber: 'PJ-10246',
    startDate: '2026-08-30',
    endDate: '2026-09-02',
    status: 'Green',
    location: 'Wichita',
    division: 'Mechanical',
    salesCodes: ['TX-07'],
    accounts: toAccounts(['Westlake Chemical'], 'Green', 'Wichita'),
    technicianIds: ['tech-3'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: '',
    preServiceChecklist: 'Site access confirmed; PPE requirements on file.',
    postServiceChecklist: '',
    postedInvoice: 'INV-8015',
    managedBy: '',
    managingLab: '',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-16',
    // Unassigned technician — a job that exists with nobody on it yet.
    // Neither Calendar nor the roster picker has a UI path to assign a
    // tech to an EXISTING job (see journey notes); this exists so that
    // gap is visibly demonstrable rather than theoretical.
    projectNumber: 'PJ-10247',
    startDate: '2026-09-04',
    endDate: '2026-09-04',
    status: 'Red',
    location: 'Baton Rouge',
    division: 'Electrical',
    salesCodes: ['LA-02'],
    accounts: toAccounts(['Marathon Refining'], 'Red', 'Baton Rouge'),
    technicianIds: [],
    osrStatus: 'missing',
    onHold: onHoldFor('Red'),
    outsideSales: 'J. Reyes',
    preServiceChecklist: '',
    postServiceChecklist: 'Customer walkthrough complete; no outstanding punch items.',
    postedInvoice: '',
    managedBy: 'B. Guidry ~ 42',
    managingLab: 'Baton Rouge Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-17',
    // Three-technician job — D2 sameDayJobCount and D1 capability tags
    // both need to be legible with more than two roster rows selected at
    // once inside the same picker.
    projectNumber: 'PJ-10248',
    startDate: '2026-09-10',
    endDate: '2026-09-11',
    status: 'Green',
    location: 'Wichita',
    division: 'Multi',
    salesCodes: ['TX-07'],
    accounts: toAccounts(
      ['Koch Industries', 'Westlake Chemical', 'Entergy Louisiana'],
      'Green',
      'Wichita'
    ),
    technicianIds: ['tech-3', 'tech-6', 'tech-8'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: 'M. Talbot',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'A. Crowe ~ 17',
    managingLab: 'Wichita Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-18',
    // Same-day, same-location double-booking with DIFFERENT technicians —
    // a normal (non-conflicting) day that's nonetheless visually dense:
    // two bars stacked on one day tests the lane packer without a
    // conflict warning muddying the read.
    projectNumber: 'PJ-10249',
    startDate: '2026-09-04',
    endDate: '2026-09-04',
    status: 'Green',
    location: 'Baton Rouge',
    division: 'Mechanical',
    salesCodes: ['LA-02'],
    accounts: toAccounts(['Koch Industries'], 'Green', 'Baton Rouge'),
    technicianIds: ['tech-5'],
    osrStatus: 'ok',
    onHold: onHoldFor('Green'),
    outsideSales: 'A. Furlong',
    preServiceChecklist: 'Site access confirmed; PPE requirements on file.',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'L. Broussard ~ 63',
    managingLab: 'Canada Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-19',
    // Cancelled job that still overlaps a technician's other commitments —
    // conflict-check explicitly excludes Cancelled jobs from the conflict
    // list (conflict-check.ts), so this is here to prove that exclusion is
    // visible/correct: tech-4 is also on job-4 and job-12 (both Green),
    // this Cancelled one should never show as a conflict against them.
    projectNumber: 'PJ-10227',
    startDate: '2026-08-14',
    endDate: '2026-08-14',
    status: 'Cancelled',
    location: 'Canada',
    division: 'Electrical',
    salesCodes: ['CA-01'],
    accounts: toAccounts(['Cenovus Energy'], 'Cancelled', 'Canada'),
    technicianIds: ['tech-4'],
    osrStatus: 'ok',
    onHold: onHoldFor('Cancelled'),
    outsideSales: '',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: '',
    managingLab: '',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-20',
    // Partial-status, multi-customer, Canada — fills out the one status/
    // location combination ('Partial' + Canada) nothing else covers.
    projectNumber: 'PJ-10250',
    startDate: '2026-09-17',
    endDate: '2026-09-18',
    status: 'Partial',
    location: 'Canada',
    division: 'Multi',
    salesCodes: ['CA-01', 'CA-01'],
    accounts: toAccounts(['Cenovus Energy', 'Suncor Energy'], 'Partial', 'Canada'),
    technicianIds: ['tech-7'],
    osrStatus: 'expired',
    onHold: onHoldFor('Partial'),
    outsideSales: 'J. Reyes',
    preServiceChecklist: '',
    postServiceChecklist: 'Customer walkthrough complete; no outstanding punch items.',
    postedInvoice: 'INV-8020',
    managedBy: 'B. Guidry ~ 42',
    managingLab: 'Baton Rouge Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-21',
    // Five concurrent jobs this same week (with job-17/18 above and
    // job-14) so the Sept 7-13 / Sept 14-20 weeks stress-test the lane
    // packer at a density List's "full to the brim" ask implies — five
    // stacked bars in one visible week is a real legibility test, not a
    // hypothetical one.
    projectNumber: 'PJ-10251',
    startDate: '2026-09-11',
    endDate: '2026-09-12',
    status: 'Red',
    location: 'Baton Rouge',
    division: 'Electrical',
    salesCodes: ['LA-02', 'TX-14'],
    accounts: toAccounts(['Marathon Refining'], 'Red', 'Baton Rouge'),
    technicianIds: ['tech-2'],
    osrStatus: 'missing',
    onHold: onHoldFor('Red'),
    outsideSales: 'M. Talbot',
    preServiceChecklist: 'Site access confirmed; PPE requirements on file.',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'A. Crowe ~ 17',
    managingLab: 'Wichita Lab',
    comments: [],
    technicianHours: {},
  },
  {
    id: 'job-22',
    // On Hold, long single-tech job, no OSR issue — On Hold currently only
    // appears as short 1-2 day jobs (job-5, job-13); this checks the
    // multi-day On Hold bar rendering (dashed vs. solid isn't part of D9's
    // built vocabulary for job status, only for non-service — worth
    // confirming that's still legible at 6+ days).
    projectNumber: 'PJ-10252',
    startDate: '2026-09-25',
    endDate: '2026-09-30',
    status: 'On Hold',
    location: 'Baton Rouge',
    division: 'Mechanical',
    salesCodes: ['LA-02'],
    accounts: toAccounts(['Koch Industries'], 'On Hold', 'Baton Rouge'),
    technicianIds: ['tech-5'],
    osrStatus: 'ok',
    onHold: onHoldFor('On Hold'),
    outsideSales: 'A. Furlong',
    preServiceChecklist: '',
    postServiceChecklist: '',
    postedInvoice: '',
    managedBy: 'L. Broussard ~ 63',
    managingLab: 'Canada Lab',
    comments: [],
    technicianHours: {},
  },
];

export const seedUnscheduledWork: UnscheduledWorkItem[] = [
  {
    id: 'uw-1',
    customerName: 'Marathon Refining',
    acctNum: '44210',
    targetWindowStart: '2026-08-25',
    targetWindowEnd: '2026-09-05',
    salesRepCode: 'TX-14',
    notes: 'Quoted annual calibration; awaiting site-access confirmation.',
  },
  {
    id: 'uw-2',
    customerName: 'Entergy Louisiana',
    acctNum: '30877',
    targetWindowStart: '2026-09-01',
    targetWindowEnd: '2026-09-12',
    salesRepCode: 'LA-02',
  },
  {
    id: 'uw-3',
    customerName: 'Cenovus Energy',
    acctNum: 'CA-1092',
    targetWindowStart: '2026-09-08',
    targetWindowEnd: '2026-09-19',
    salesRepCode: 'CA-01',
    notes: "Won, but Shawna's site POC hasn't confirmed a week yet.",
  },
  {
    id: 'uw-4',
    customerName: 'Koch Industries',
    acctNum: '51120',
    targetWindowStart: '2026-08-28',
    targetWindowEnd: '2026-09-03',
    salesRepCode: 'TX-07',
  },
  {
    id: 'uw-5',
    customerName: 'Westlake Chemical',
    acctNum: '60234',
    targetWindowStart: '2026-09-10',
    targetWindowEnd: '2026-09-21',
    salesRepCode: 'TX-14',
    notes: 'New account — first onsite visit, no history to schedule against.',
  },
  {
    id: 'uw-6',
    customerName: 'Marathon Refining',
    acctNum: '44210',
    targetWindowStart: '2026-09-14',
    targetWindowEnd: '2026-09-25',
    salesRepCode: 'TX-14',
    notes: 'Follow-up visit for the second unit; same site as PJ-10241.',
  },
  {
    id: 'uw-7',
    customerName: 'Entergy Louisiana',
    acctNum: '30877',
    targetWindowStart: '2026-09-21',
    targetWindowEnd: '2026-09-30',
    salesRepCode: 'LA-02',
  },
  // --- Added for journey/scenario coverage (see
  // onsite-scheduling-user-journeys-and-test-data.md) ---
  {
    id: 'uw-8',
    // Target window already fully in the past relative to the app's
    // "today" (2026-08-11). N1 explicitly declines to build any
    // time-based urgency coloring, so this proves that gap is real and
    // visible: this row sits identically to every other row with no
    // overdue signal at all.
    customerName: 'Marathon Refining',
    acctNum: '44210',
    targetWindowStart: '2026-07-10',
    targetWindowEnd: '2026-07-20',
    salesRepCode: 'TX-14',
    notes: 'Target window already passed — no visual distinction from a future one.',
  },
  {
    id: 'uw-9',
    // Single-day target window (start === end) — exercises ScheduleDialog
    // without D13's End-Date-defaults-to-Start bug being able to hide
    // behind "well the window was one day anyway."
    customerName: 'Westlake Chemical',
    acctNum: '60234',
    targetWindowStart: '2026-09-05',
    targetWindowEnd: '2026-09-05',
    salesRepCode: 'TX-14',
  },
  {
    id: 'uw-10',
    // Very long notes field — tests the `max-w-[220px] truncate` cell
    // treatment actually truncates instead of blowing out the table, and
    // that there's no way to read the rest of it short of the (missing)
    // Detail view.
    customerName: 'Koch Industries',
    acctNum: '51120',
    targetWindowStart: '2026-09-15',
    targetWindowEnd: '2026-09-28',
    salesRepCode: 'TX-07',
    notes:
      'Customer requested this be bundled with the follow-up unit inspection ' +
      'that was originally quoted separately back in June, pending confirmation ' +
      'from their EHS team on badge/access requirements for both technicians, ' +
      'plus a possible third stop at their satellite yard if scheduling allows ' +
      'and the crew is already in the area — check with dispatch before confirming.',
  },
  {
    id: 'uw-11',
    // A second Canada item with a very tight (3-day) window, to check
    // D12's "CA-" prefix guess against a short/urgent-reading window —
    // still gets `division: 'Unassigned'` and `osrStatus: 'missing'`
    // silently on Schedule, same as every other row (D12).
    customerName: 'Suncor Energy',
    acctNum: 'CA-1147',
    targetWindowStart: '2026-08-24',
    targetWindowEnd: '2026-08-26',
    salesRepCode: 'CA-01',
    notes: 'Tight window — plant shutdown days only.',
  },
];

const bryan: DecisionOwner = { name: 'Bryan', role: 'PM' };
const ashley: DecisionOwner = { name: 'Ashley', role: 'PM' };
const andrea: DecisionOwner = { name: 'Andrea', role: 'PM' };
const shawna: DecisionOwner = {
  name: 'Shawna',
  role: 'Customer/Partner (Canada Onsite)',
};
const tim: DecisionOwner = { name: 'Tim', role: 'Architecture/Engineering' };

/**
 * Every unsettled item with a demoable feature behind it. Kept in sync with
 * /prototype/decisions/open-decisions-log.md by hand as this prototype is
 * built — the .md file is the one that leaves the room.
 */
export const openDecisions: OpenDecisionItem[] = [
  {
    id: 'D1',
    title: 'Technician capability / division gating',
    type: 'Business',
    area: 'End User',
    endUserScope: ['Canada', 'All'],
    owners: [bryan],
    stakeholderQuestion:
      'Should technician assignment stay open to any technician regardless of capability/division (as built), or should some jobs restrict who can be assigned?',
    defaultBuilt:
      'Any technician can be assigned to any job. The roster picker shows each ' +
      "tech's capability tags (supporting more than one per tech, e.g. Dana " +
      'Fontenot: In-Lab Calibration + Onsite Electrical) for visibility, but ' +
      'nothing is restricted by them.',
    whyThisDefault:
      'Open-by-default is the visible, reactable choice — a restriction guessed ' +
      "wrong would silently block real dual-role assignments like Canada's.",
    jumpTo: { tab: 'calendar', anchorId: 'decision-D1' },
    source: 'FRD §6.4 US-1 / §7 Rule 7',
  },
  {
    id: 'D2',
    title: 'Technician capacity limit (hours/jobs per day)',
    type: 'Business',
    area: 'End User',
    endUserScope: ['Canada', 'All'],
    owners: [bryan],
    stakeholderQuestion:
      'Should there be a hard capacity limit on jobs/hours per technician per day, or stay advisory-only (as built)?',
    defaultBuilt:
      'Advisory only. The roster picker shows a note when a technician already ' +
      'has another job that day, but never blocks adding another.',
    whyThisDefault:
      'No hard-cap number exists in any source document — inventing one would ' +
      'be a guess dressed up as a rule. Advisory-only is demoable without ' +
      'presuming a threshold nobody has confirmed.',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D2' },
    source: 'FRD §10 open engineering question #6 (seed list item)',
  },
  {
    id: 'D3',
    title: 'OSR / safety gating on Confirmed status',
    type: 'Business',
    area: 'End User',
    endUserScope: ['All'],
    owners: [bryan],
    stakeholderQuestion:
      'Should a missing/expired OSR (a) have no bearing on confirmation, (b) block confirmation, or (c) allow confirmation with a visible warning (as built)?',
    defaultBuilt:
      'Confirmation is never blocked, but a visible amber warning shows on a ' +
      "job's Calendar popover when its OSR is missing or expired.",
    whyThisDefault:
      'FRD names three real options (no bearing / block / warn). "No bearing" ' +
      "matches today's production behavior but is a silent no-op in a demo — " +
      '"warn" is the same non-blocking answer made visible and reactable.',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D3' },
    source: 'FRD §6.6 US-1 / §7 Rule 9',
  },
  {
    id: 'D4',
    title: 'Manual-override scope for scheduling conflicts',
    type: 'Business',
    area: 'End User',
    endUserScope: ['Canada', 'All'],
    owners: [bryan, shawna],
    stakeholderQuestion:
      'Should a double-booked or blocked technician assignment be a hard block, or stay a visible, overridable warning (as built)?',
    defaultBuilt:
      'A double-booked or blocked-technician assignment shows an amber conflict ' +
      'warning (passive, matching the pattern already live in the real ' +
      'Technicians.tsx force-add flow) with an "Assign Anyway" override anyone ' +
      'can click — no separate approval gate.',
    whyThisDefault:
      'A hard block with no alternate technician to offer is just friction for ' +
      "a 1-2 person team like Canada's. Visible-but-overridable mirrors the " +
      'existing production conflict pattern instead of inventing a new one.',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D4' },
    source: 'FRD §6.4 US-3 / §7 Rule 8',
  },
  {
    id: 'D5',
    title: 'Manual override scope for job status (Complete / Closed / Cancelled)',
    type: 'Business',
    area: 'Product Management',
    owners: [bryan],
    stakeholderQuestion:
      'Should Complete/Closed/Cancelled remain manual overrides (as today, in the real Detail page), or be automated like the rest of status?',
    defaultBuilt:
      'Left as manual, matching the real Complete/Cancel actions already live ' +
      'in OnsiteProject.tsx — this prototype does not change Detail.',
    whyThisDefault:
      'Stated intent ("On Hold is the only manual override") conflicts with ' +
      "what's actually shipped. Since Detail is out of scope for edits this " +
      'pass, the honest default is "what\'s live today," flagged as unresolved ' +
      'rather than silently picked one way.',
    jumpTo: { tab: 'none', anchorId: 'decision-D5' },
    source: 'FRD §6.3 US-2 / §7 Rule 6',
  },
  {
    id: 'D6',
    title: 'Hide-completed-jobs toggle',
    type: 'Business',
    area: 'End User',
    endUserScope: ['US – Baton Rouge', 'All'],
    owners: [ashley, bryan],
    stakeholderQuestion:
      "Should List also get a hide-completed/cancelled toggle (today it's Calendar-only), or is that intentionally Calendar-specific?",
    defaultBuilt:
      'BUILT ON BOTH SURFACES 2026-08-15 (system decision — Extend): a ' +
      'hide-completed/cancelled toggle now exists on both Calendar and ' +
      "List (List's was already added as part of D24's rebuild but not " +
      'previously tagged back to this decision) — off by default on each, ' +
      'Completed/Cancelled jobs shown until switched.',
    whyThisDefault:
      'Low-stakes either way per the triage workbook, and consistency ' +
      'between the two surfaces seemed safer than an unexplained asymmetry ' +
      '— cost of extending was low since List already has its own filter ' +
      'system (D24).',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D6' },
    source: 'FRD §7 Rule 14 / Canada 101 transcript',
  },
  {
    id: 'D7',
    title: 'Unscheduled Work queue — real need, or a Torqueware-shaped accommodation?',
    type: 'Business',
    area: 'Product Management',
    owners: [ashley, shawna],
    stakeholderQuestion:
      'Is the Unscheduled Work queue a real, validated need for BR/Canada, or a Torqueware-shaped accommodation that does not reflect an actual workflow?',
    defaultBuilt:
      'Built and populated with seed data as if validated — a full queue with ' +
      'a working Schedule → real-job conversion.',
    whyThisDefault:
      'Building the visible feature is what gives Shawna something concrete ' +
      'to react to ("does this match a state you actually have?") instead of ' +
      'asking her to evaluate a described-but-unbuilt idea.',
    jumpTo: { tab: 'unscheduled', anchorId: 'decision-D7' },
    source: 'FRD §6.5 US-1 / triage workbook row 20',
  },
  {
    id: 'D8',
    title:
      'Nav structure: replace "Onsite Projects" vs. keep it as a parent with a "Scheduling" sub-tab',
    type: 'Business',
    area: 'Product Management',
    owners: [ashley, bryan],
    stakeholderQuestion:
      "Keep the 'Onsite Projects' nav pointing directly at this consolidated Scheduling capability, or make it a 'Scheduling' sub-tab under a broader parent — and does Torqueware use different naming worth matching first?",
    defaultBuilt:
      'Option 1 built for this demo: the "Onsite Projects" nav entry now points ' +
      'directly at the consolidated Onsite Scheduling capability (List/' +
      'Calendar/Unscheduled Work as tabs of one page), plus a second "Calendar" ' +
      'shortcut that jumps straight into Calendar mode. The real Onsite ' +
      'Projects route/page itself is untouched underneath — only the nav ' +
      "entry's label and destination changed.",
    whyThisDefault:
      'Directed explicitly for this pass to keep the nav simple while demoing ' +
      'one capability. Left genuinely open: Torqueware may use different ' +
      'language for this capability, not yet confirmed — worth checking ' +
      'naming/structure (this vs. a "Scheduling" sub-tab under a more general ' +
      'parent) against that before treating either option as settled.',
    jumpTo: { tab: 'none' },
    source:
      'Raised 2026-08-11 during prototype review — not in the original FRD/triage docs',
  },
  {
    id: 'D9',
    title:
      'Event-type / status color-coding — full 11-type Torqueware vocabulary vs. reduced set',
    type: 'Business',
    area: 'Product Management',
    owners: [ashley, bryan],
    stakeholderQuestion:
      "Is the reduced Red/Green/Partial/On Hold/Completed/Cancelled color vocabulary enough, or does BR/Canada actually need Torqueware's full 11-type coding?",
    defaultBuilt:
      'Already built, not deferred: solid-fill color per job status (Green/Red/' +
      'Partial/On Hold/Completed/Cancelled) and a distinct dashed-border color ' +
      'per non-service type (PTO/Travel/Out of Service/Tentative), shown as an ' +
      'always-visible inline legend on Calendar (not a click-to-reveal palette ' +
      "button like Torqueware's Schedules screen). Extends the app's existing " +
      'categorical-color convention (badge-variants.ts) rather than inventing ' +
      'a new one — no net-new design-system palette was needed. The other 6 ' +
      'Torqueware types (Suggested/Quoted/Confirmed/Declined Service, Drop In, ' +
      "In-House Work) aren't color-coded because they're not in scope at all " +
      'this pass, not because they were skipped within scope.',
    whyThisDefault:
      'Investigated before deciding: no calendar library is in use (nothing to ' +
      'configure or fight), and the app already has real precedent for ' +
      'many-hue categorical coding via badge-variants.ts — this was a small, ' +
      'low-cost extension of an existing pattern, not a new design-system ' +
      'decision. Building distinct treatment for 6 types with zero current ' +
      "business use (BR/Canada use Red/Green/Partial, not Torqueware's " +
      '11-type model) would be pure speculation. One accessibility gap is ' +
      'real and flagged, not silently accepted: job status is color-only ' +
      '(no icon), unlike non-service entries, which pair color with a dashed ' +
      'border and, for OSR issues, a warning icon.',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D9' },
    source: 'Torqueware color-coding decision brief + screenshot, 2026-08-11',
  },
  {
    id: 'D10',
    title: 'One shared "+ New" entry point vs. per-tab add actions',
    type: 'Technical',
    area: 'Product Management',
    owners: [ashley, bryan],
    stakeholderQuestion:
      'Built with a type selector (Onsite Job / Non-Service Entry) on both List and Calendar (including per-day) — worth confirming the real List\'s full-page "Add New" should eventually fold into this too, or stay separate.',
    defaultBuilt:
      'BUILT 2026-08-15, direct user feedback (Calendar day clicks had no ' +
      'create action at all, and List had none either — see NewEntryChooser.tsx, ' +
      'NewJobDialog.tsx). Calendar\'s toolbar "+" and every day cell\'s ' +
      'popover, plus a new List toolbar button, all open the same chooser ' +
      '— pick Onsite Job or Non-Service Entry, both pre-filled with the ' +
      "clicked day's date where one exists. Unscheduled Work's per-row " +
      '"Schedule" stays separate (see below) — it converts one specific ' +
      'existing queue item, a different action from creating from scratch. ' +
      'The real, standalone List page\'s own full-page "Add New" is ' +
      "untouched — this only affects this shell's prototype List/Calendar.",
    whyThisDefault:
      'Consolidating into one "+ New" control (type selector as the first ' +
      'field) reduces tab-hunting and — the concrete gap that triggered ' +
      'building this — there was previously no way to create a new job at ' +
      "all except via Unscheduled Work's queue, so Calendar/List had no " +
      'path to schedule a job from scratch.',
    jumpTo: { tab: 'none' },
    source: 'UX review, 2026-08-11',
  },
  {
    id: 'D11',
    title: 'Two-tier add: quick add vs. full schedule',
    type: 'Technical',
    area: 'Product Management',
    owners: [ashley, bryan],
    stakeholderQuestion:
      'Should there be a quick-add path (minimum fields, lands in Unscheduled Work) separate from the full Add-New form, or is everything really known at intake today?',
    defaultBuilt:
      'BUILT 2026-08-15 (system decision — Extend, provisional): a "Quick ' +
      'add" button on the Unscheduled Work queue opens a minimum-fields ' +
      'dialog (Customer, Site, rough window, optional Notes — ' +
      'QuickAddWorkDialog.tsx) that lands directly in the queue, no ' +
      'account #/sales rep code required at that point. Deliberately does ' +
      'NOT add a "job type" field (part of the original literal proposal) ' +
      '— nothing in this queue models a type distinction, and inventing ' +
      'one would be speculative.',
    whyThisDefault:
      "The NFR doc's finding that PO Number lives in free-text notes ~23% " +
      "of the time, plus the real Add New form's 12+ required top-level " +
      'fields, is actual documented evidence that not everything is known ' +
      'at intake today. Flagged as provisional even so: this infers a ' +
      'workflow pattern from indirect evidence, not a direct statement of ' +
      'intent — worth confirming with whoever enters jobs today.',
    jumpTo: { tab: 'unscheduled', anchorId: 'decision-D7' },
    source: 'UX review, 2026-08-11 / onsite-scheduling-nfr.md:43',
  },
  {
    id: 'D12',
    title: 'Unscheduled Work → Schedule: stop silently guessing fields',
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [ashley, bryan],
    stakeholderQuestion:
      'Should Schedule (from Unscheduled Work) ask for Division/Location explicitly instead of guessing them, or is a visible amber "guessed" tag on the created job enough?',
    defaultBuilt:
      'FIXED 2026-08-15 (system decision — Build Now): ScheduleDialog now ' +
      'shows explicit, editable Location and Division fields (pre-filled ' +
      'with the same guess as before — location from item.location, or ' +
      'the old "CA-" account-number-prefix heuristic as a fallback for ' +
      "items without it), each carrying this decision's own amber tag. " +
      "OSR status ('missing') and job status (starts 'Red') stay " +
      "auto-assigned — those match every freshly-created job's real " +
      'starting state (job-draft.ts), not a guess that needs flagging.',
    whyThisDefault:
      "This was flagged as an exception to this prototype's own rule that " +
      'every guessed default gets a visible amber "?" tag — the fix makes ' +
      'the two genuinely-guessed fields (Location/Division) both visible ' +
      'and correctable at the point of guessing, rather than silent.',
    jumpTo: { tab: 'unscheduled', anchorId: 'decision-D7' },
    source: 'UX review, 2026-08-11',
  },
  {
    id: 'D13',
    title: 'Bug: ScheduleDialog End Date defaults to the target window start',
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [{ name: 'Dev', role: 'Engineering' }],
    stakeholderQuestion:
      'No decision needed — this was a real bug (wrong default date), already fixed.',
    defaultBuilt:
      'Fixed 2026-08-12: End date now defaults to item.targetWindowEnd, ' +
      'not item.targetWindowStart. Was: both Start date and End date ' +
      'defaulted to the window start, so an unnoticed Confirm created a ' +
      'single-day job from a multi-day request. Seed data uw-9 (a ' +
      'naturally single-day window) was added specifically so the fix — ' +
      'and the original bug — can\'t hide behind "the window was short ' +
      'anyway.\"',
    whyThisDefault:
      'A real bug, not a design choice. Fixed directly rather than left ' +
      'open, since a silently-wrong date range on a newly created job is ' +
      'a correctness issue, not a judgment call needing a room to weigh in.',
    jumpTo: { tab: 'unscheduled' },
    source: 'UX review, 2026-08-11; fixed 2026-08-12 per conflict-fix pass',
  },
  {
    id: 'D14',
    title: 'Job bars: clicking does nothing; only double-click opens Quick View',
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [bryan],
    stakeholderQuestion:
      'No decision needed — this was an inconsistent click behavior, already fixed as part of D19.',
    defaultBuilt:
      'Fixed 2026-08-12 as part of D19: job bars now use onClick, matching ' +
      'non-service entries, and open the real, shared JobDetailDialog ' +
      'instead of the old double-click-only Quick View.',
    whyThisDefault:
      'Was flagged rather than changed at first (the onClick/onDoubleClick ' +
      'inconsistency read as broken); fixed directly once JobDetailDialog ' +
      'replaced Quick View, since keeping double-click alongside a real ' +
      'edit dialog would only compound the inconsistency.',
    jumpTo: { tab: 'calendar' },
    source: 'UX review, 2026-08-11; fixed 2026-08-12 per D19',
  },
  {
    id: 'D15',
    title:
      'Click-anywhere-to-schedule on Calendar, with context pre-fill (broadened 2026-08-13)',
    type: 'Technical',
    area: 'End User',
    endUserScope: ['All'],
    owners: [ashley],
    stakeholderQuestion:
      'Built as: the entire day cell is now the click target (not just the day number), opening a popover pre-filled with that date and a "New…" action for either type — confirm this is the expected click affordance.',
    defaultBuilt:
      "BUILT 2026-08-15, folding in D10 as this item's own note " +
      "anticipated; BROADENED 2026-08-16 to close this item's own " +
      'remaining gap. The day-number popover (previously read-only — just a ' +
      "list of that day's items, with an anchoring bug that made it open " +
      "in the wrong spot regardless of which day you clicked — see D10's " +
      'bug-fix note) now also has a "New…" button opening the shared ' +
      "chooser (NewEntryChooser.tsx), pre-filled with that day's date, " +
      'routing to either NonServiceEntryDialog or the new NewJobDialog. ' +
      'As of 2026-08-16, the ENTIRE day cell is the click target, not just ' +
      'the day-number button — day-number cells and bar rows now share one ' +
      'CSS grid per week, with a full-height per-day background button ' +
      '(CalendarView.tsx) sitting behind the bars; clicking a bar still ' +
      'opens that job/entry (bars paint on top in DOM order), while ' +
      "clicking any empty part of the day's column opens this same New… " +
      'popover.',
    whyThisDefault:
      'Direct user feedback, twice: first that a day click should offer ' +
      "scheduling either type (closed by folding in D10's shared chooser), " +
      'then that the day-number button alone was too small a target — ' +
      'the whole cell should be clickable.',
    jumpTo: { tab: 'calendar' },
    source:
      'UX review, 2026-08-11; broadened by direct user feedback, 2026-08-13 and 2026-08-16',
  },
  {
    id: 'D16',
    title: 'Technician-conflict indicator, visible directly on the Calendar grid',
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [bryan],
    stakeholderQuestion:
      'No decision needed — an additive visibility signal (a conflict icon), not a new rule.',
    defaultBuilt:
      'Built 2026-08-12: a job with any double-booked technician now shows ' +
      'a UserX icon directly on its Calendar bar, computed across the ' +
      'whole visible set (jobHasTechnicianConflict in conflict-check.ts). ' +
      'Cancelled jobs are excluded, matching the same exclusion D4/' +
      'getTechnicianConflicts already applies elsewhere.',
    whyThisDefault:
      'Previously a conflict was only visible inside the two dialogs that ' +
      'happened to check it (Unscheduled Work → Schedule, and the ' +
      'non-service entry dialog) — scanning the grid itself gave zero ' +
      "signal. That's a real gap for the most common way a conflict " +
      'actually gets noticed in practice: looking at the calendar and ' +
      'seeing a technician double-booked. Fixed rather than logged as an ' +
      "open question, since it's additive (a new signal, not a changed " +
      'rule) and directly enables D17.',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D16' },
    source: 'Journey/conflict-fix pass, 2026-08-12',
  },
  {
    id: 'D17',
    title: 'Reassign technicians on an existing job from Quick View',
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [bryan],
    stakeholderQuestion:
      'No decision needed — closes a real editing gap (there was no way to reassign technicians on an existing job at all), not a policy choice.',
    defaultBuilt:
      'Built 2026-08-12: Quick View now shows the assigned technician ' +
      'name(s) (or "Unassigned") and a Reassign action that opens the ' +
      'same TechnicianRosterPicker used elsewhere — including its live ' +
      "conflict warnings — scoped to that job's own dates. Saving " +
      'patches the job in place via a new updateJob() on ' +
      'SchedulingDataContext.',
    whyThisDefault:
      "Before this, there was no edit path for an existing job's " +
      'technician assignment at all — both roster-picker dialogs only ' +
      'existed on creation flows (a new non-service entry, or converting ' +
      'an Unscheduled Work item). A conflict newly visible via D16 would ' +
      'have had no way to actually resolve without this. Seed data ' +
      'job-16 (zero technicians) exists specifically to exercise this ' +
      'path.',
    jumpTo: { tab: 'calendar' },
    source: 'Journey/conflict-fix pass, 2026-08-12',
  },
  {
    id: 'D18',
    title:
      'List requires a manual Search click before anything renders — real production behavior',
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [ashley],
    stakeholderQuestion:
      "No decision needed — a shell-scoped convenience fix; the real component's default behavior everywhere else it's used is unchanged.",
    defaultBuilt:
      'Fixed 2026-08-12, for this shell only: added an optional ' +
      '`autoSearchOnMount` prop to the real OnsiteProjectList (default ' +
      'false — every other usage of that component is unchanged), which ' +
      'commits one empty search on mount only if nothing was already ' +
      'committed/persisted this session. SchedulingShell passes it true ' +
      "for List's tab, so it now shows results immediately instead of " +
      '"Enter search criteria and click Search to find projects."',
    whyThisDefault:
      'This is real, existing production behavior — not something this ' +
      "pass introduced — and it's arguably correct for the standalone " +
      '`/onsite-project` route. But direct user feedback during this pass ' +
      'called it out plainly as bad UX in the demo context ("I ' +
      'shouldn\'t have to search something to see something"). Rather ' +
      "than silently overriding List's default everywhere (a " +
      "production-wide behavior change well beyond this pass's scope) or " +
      'leaving it as a logged-but-unfixed friction note, an opt-in prop ' +
      'gives this specific shell the fix without touching the ' +
      "component's behavior anywhere else it's used.",
    jumpTo: { tab: 'list' },
    source: 'Direct user feedback, 2026-08-12',
  },
  {
    id: 'D19',
    title: 'Job Detail: same shared, editable dialog from Calendar AND List',
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [ashley],
    stakeholderQuestion:
      'Confirm: should List and Calendar keep sharing ONE identical Detail view (as built), or does any surface need a genuinely different Detail experience?',
    defaultBuilt:
      'Fixed 2026-08-12: Quick View replaced by JobDetailDialog, mounted ' +
      'once at SchedulingShell level so a Calendar job-bar click and a ' +
      'List project-number click (for these seeded mock jobs) open the ' +
      'exact same instance. Editable: technicians (existing roster ' +
      'picker), vehicle, status via PO Received/Confirmed checkboxes ' +
      '(deriving Red/Green/Partial) plus an independent On Hold switch, ' +
      'customers (add/remove), and travel-in/out + production hours per ' +
      'assigned technician. Saving patches SchedulingDataContext and ' +
      "invalidates List's onsiteProjects query, so both surfaces update " +
      'without a page refresh — closed via a new job-store.ts snapshot ' +
      'mock-onsite-project-api.ts now reads live. Completed/Cancelled ' +
      "stay read-only here, unchanged, per D5's scope line.",
    whyThisDefault:
      "Direct user feedback: Calendar's job-bar click opened nothing " +
      'editable, and List/Calendar had no shared "Detail" concept — two ' +
      "independent read paths. Closes D14 and supersedes D17's " +
      'Quick-View-only reassignment with a fuller edit surface.',
    jumpTo: { tab: 'calendar' },
    source: 'Direct user feedback, 2026-08-12',
  },
  {
    id: 'D20',
    title:
      'Technician conflict messages name the technician, the conflicting thing, and the actual overlap',
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [bryan],
    stakeholderQuestion:
      'No decision needed — clarifies the wording of existing conflict warnings, does not change the conflict rule itself.',
    defaultBuilt:
      'Fixed 2026-08-12: TechnicianRosterPicker (used by JobDetailDialog, ' +
      "NonServiceEntryDialog, and Unscheduled Work's Schedule dialog) now " +
      'shows one message per conflict — e.g. "Jane Smith has PTO scheduled ' +
      'May 3–5, overlapping this job\'s May 4 date." — via a new ' +
      'describeConflictDetailed() in conflict-check.ts, instead of the ' +
      'prior generic "Conflicts with PTO (2026-08-12 – 2026-08-14)" line. ' +
      'The checkbox is still never disabled (D4) and the "still assignable" ' +
      'note now shows unconditionally, not only when other technicians are ' +
      'available — so this holds up for a 1-2 person team with no ' +
      'alternative to offer, same as Canada.',
    whyThisDefault:
      'FRD Rule 8 (technician conflict handling) — a conflict has to say ' +
      'why, specifically, not just that one exists. Rule 7 (capability/' +
      'division gating) stays open-by-default per D1: PrototypeTechnician ' +
      'already carries capabilities as an array, not a single tag, so a ' +
      "dual-role tech (e.g. Canada's in-lab + onsite techs) can be tagged " +
      'with more than one without a data-model change.',
    jumpTo: { tab: 'calendar' },
    source: 'FRD §7 Rule 7/Rule 8; direct user request, 2026-08-12',
  },
  {
    id: 'D21',
    title:
      "Bug: Unscheduled Work → Schedule stopped compiling after D19's new job fields",
    type: 'Technical',
    area: 'Technical/Architecture',
    owners: [{ name: 'Dev', role: 'Engineering' }],
    stakeholderQuestion:
      'No decision needed — this was a real bug (a missing-field regression), already fixed.',
    defaultBuilt:
      "Fixed 2026-08-12: UnscheduledWorkQueue.tsx's ScheduleDialog builds a " +
      'ScheduledJob literal that was never updated when D19 added ' +
      'poReceived/confirmed/onHold/technicianHours as required fields — ' +
      'added them with fresh-job defaults (all false/empty). Also added ' +
      "the same List-cache invalidateQueries() call D19's JobDetailDialog " +
      'already had, so a newly scheduled job shows up on List immediately ' +
      'instead of possibly sitting in a stale cache.',
    whyThisDefault:
      'Real defect, not a design call. Only caught because `tsc -p ' +
      'tsconfig.app.json --noEmit` was run directly — the root `npm run ' +
      "type-check` (`tsc --noEmit` against tsconfig.json's files:[] + " +
      'references setup) silently checks nothing without `--build`, which ' +
      "let this slip past both this session's own verification and the " +
      'Husky pre-commit hook. Worth Engineering knowing about beyond this ' +
      'prototype.',
    jumpTo: { tab: 'unscheduled' },
    source: "Found while building D19's Unscheduled Work follow-up, 2026-08-12",
  },
  {
    id: 'D22',
    title:
      'Status model reconciliation: BR/FRD, Canada, and Torqueware are three different shapes — this build ships Model 1 (BR/FRD) only',
    type: 'Technical',
    area: 'Technical/Architecture',
    endUserScope: ['US – Baton Rouge', 'Canada', 'All'],
    owners: [bryan, tim],
    stakeholderQuestion:
      "Should this build's Red/Green/Partial (derived from PO Received/Confirmed per account) be the only status model for now, or does Canada's real On-Ramp→...→Complete/Lost lifecycle need representing too — and on what timeline?",
    defaultBuilt:
      'This prototype builds and ships Model 1 (BR/FRD) ONLY: Red/Green/' +
      'Partial derived automatically from PO Received + Confirmed per ' +
      'associated account, with On Hold as a separate, independent manual ' +
      "override (FRD §7 Rule 1/Rule 2). Canada's actual lifecycle model " +
      '(On-Ramp → Pre-Service → In-Service → Post-Service → Complete/Lost, ' +
      'the 90-day red/black urgency signal, auto-recurrence on Complete) ' +
      "and Torqueware's separate type/status split are NOT built, NOT " +
      'modeled in ScheduledJob, and not represented anywhere in this ' +
      'prototype — see N1/N2/N4/N5 for the specific pieces already flagged ' +
      'as not-built. This entry exists so the gap between the three models ' +
      'is tracked explicitly rather than discovered later as a surprise.',
    whyThisDefault:
      "Model 1 is the only one of the three that's FRD-confirmed and " +
      "ready to build (FRD §3 'already settled'); the other two are real, " +
      "sourced (Canada's own transcript; Torqueware's own code) but were " +
      'never asked for in this pass and building either would be scope ' +
      'invented, not requested. Reconciliation summary (full mapping in ' +
      "open-decisions-log.md): (1) Canada's On-Ramp shares its transition " +
      'point with BR\'s "not yet Confirmed" but carries a 90-day urgency ' +
      "signal Model 1 has no field for (N1); (2) Canada's Complete shares " +
      "BR's terminal meaning but triggers auto-recurrence, which Model 1 " +
      'has no equivalent for (N2); (3) Lost is structurally absent from ' +
      'Model 1 entirely — regardless of whether it turns out to be the ' +
      'same concept as the Opportunities Log (N4), it would need its own ' +
      "status value, not a relabeling of Cancelled; (4) Torqueware's type/" +
      'status split is NOT a false parallel — this prototype already ' +
      'separates "what kind of entry" (Job vs. the 4 non-service types) ' +
      'from "what\'s its confirmation state" (R/G/P + On Hold) the same ' +
      "way Torqueware does — but Torqueware's finer real-work sub-types " +
      '(Suggested/Quoted/Declined/Drop In/In-House) have no BR/Canada ' +
      'equivalent asked for yet, which is a genuinely open question, not ' +
      'resolved here. See D23 for the backend-architecture question this ' +
      "depends on. This does NOT resolve D5 — Rule 6's Complete/Closed/" +
      "Cancelled conflict is still Bryan's open call, now with fuller " +
      'cross-model context.',
    jumpTo: { tab: 'none' },
    source:
      'FRD v5 §6.3/§7 Rules 1/2/6/10/11/13; canada-onsite-101-transcript.md; ' +
      'Torqueware gap analysis; reconciliation requested directly, 2026-08-12',
  },
  {
    id: 'D23',
    title:
      "Architecture dependency: does Canada share US CalMapp's backend, or get its own? (blocks HOW status reconciliation gets resolved)",
    type: 'Technical',
    area: 'Technical/Architecture',
    endUserScope: ['Canada', 'US – Baton Rouge'],
    owners: [tim],
    stakeholderQuestion:
      'Does Canada run on the same backend/database as US CalMapp, or get its own? This determines whether the three status models ever need one canonical mapping, or can stay separate.',
    defaultBuilt:
      'Nothing decided or built here — this is a blocking architecture ' +
      'question raised BY the status-model reconciliation (D22), not ' +
      "answered by it. Whether Canada's lifecycle model, BR's Red/Green/" +
      "Partial, and Torqueware's type/status split ever need a single " +
      'canonical mapping depends entirely on this.',
    whyThisDefault:
      'If ONE shared backend: all three vocabularies eventually need a ' +
      'real mapping to a single canonical field (or an explicit, ' +
      'documented multi-field model) — the same table has to represent ' +
      "Canada's lifecycle stages, BR's status, and Torqueware's type/" +
      'status split all at once, making reconciliation a real data-' +
      'modeling problem. If Canada gets a SEPARATE backend: reconciliation ' +
      'may only ever need to happen at a reporting/display layer (e.g. a ' +
      "cross-region rollup) — Canada's own system keeps its lifecycle " +
      'model exactly as-is, untouched by anything built here. This choice ' +
      'is being made on a separate architecture track and is explicitly ' +
      'not resolved by this prototype pass — everything in D22 should be ' +
      'read as "here is what each answer implies," not as an argument for ' +
      'either branch.',
    jumpTo: { tab: 'none' },
    source: 'Raised during status-model reconciliation pass, 2026-08-12',
  },
  {
    id: 'D24',
    title:
      'List View rebuilt from scratch — meets FRD §6.1 in full, reads directly from SchedulingDataContext',
    type: 'Technical',
    area: 'Technical/Architecture',
    endUserScope: ['US – Baton Rouge', 'US – Wichita/Kansas', 'Canada', 'All'],
    owners: [ashley, bryan],
    stakeholderQuestion:
      'Does the rebuilt List view (colored status/PO/Confirmed/Safety indicators, filters, inline flag toggle) cover what BR/Wichita/Canada actually need from a List surface, or is something missing or wrong?',
    defaultBuilt:
      "Fixed 2026-08-12: this shell's List tab is now `PrototypeListView.tsx` " +
      '— a purpose-built view reading SchedulingDataContext directly, the ' +
      'same live store Calendar/Unscheduled Work already use. Replaces the ' +
      'real, unmodified OnsiteProjectList that lived in this tab; that ' +
      'component and its mock-onsite-project-api.ts/job-store.ts bridge ' +
      'are untouched and still serve the real, standalone /onsite-project ' +
      "route — only this shell's own tab changed. Covers every FRD §6.1 " +
      'requirement: project number, dates, division, location, account(s), ' +
      'status, technician(s), vehicle, and quote total, all visible without ' +
      'opening Detail; filters for Location, Division, Sales/Service Code, ' +
      'Technician, Status, and free-text search, plus a hide-completed/ ' +
      'cancelled toggle (extending D6 to List). Status is a colored pill ' +
      '(now a single shared STATUS_BADGE_STYLES in job-status.ts, no longer ' +
      'duplicated between CalendarView/JobDetailDialog) with a colored ' +
      'left-edge accent per row. PO Received, Confirmed, and Safety/OSR ' +
      "each get their own colored dot — aggregated honestly across a job's " +
      'accounts via a new aggregateAccountFlag() rather than picking one ' +
      'account arbitrarily. US-2 (flip PO/Confirmed inline without opening ' +
      'Detail) works for single-account jobs by clicking the dot directly; ' +
      "a multi-account job's dot still shows the aggregate but isn't " +
      'inline-editable — which account you meant is genuinely ambiguous ' +
      'with more than one, so it opens Detail instead. Two FRD-confirmed ' +
      'fields not previously modeled on ScheduledJob were added to support ' +
      'this: salesCodes (array, per §8/§9) and quoteTotal.',
    whyThisDefault:
      'Direct request: build a great List view meeting all three ' +
      "stakeholders' needs (US/Baton Rouge, US/Wichita, Canada) after " +
      'reviewing why the real List looked comparatively basic — its ' +
      'STATUS/PO RCVD/CONFIRMED cells are plain text with zero color logic ' +
      '(confirmed by reading OnsiteProjectsList.tsx directly), because D6/ ' +
      'D9 had explicitly scoped all color work to Calendar only. Reading ' +
      'SchedulingDataContext directly instead of going back through ' +
      'mock-onsite-project-api.ts also eliminates the List/Calendar ' +
      'two-data-worlds bridge for this tab entirely, rather than adding a ' +
      "fourth patch on top of D19/D21's cache-invalidation workarounds.",
    jumpTo: { tab: 'list', anchorId: 'decision-D24' },
    source: 'Direct user request, 2026-08-12',
  },
  {
    id: 'D25',
    title:
      "Bug: prototype/ was never in Tailwind's content scan — any color used ONLY there silently rendered transparent",
    type: 'Technical',
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    owners: [tim, { name: 'Dev', role: 'Engineering' }],
    stakeholderQuestion:
      "No decision needed — a build-tooling bug fix (Tailwind wasn't scanning this folder at all).",
    defaultBuilt:
      "Fixed 2026-08-12, found while building D24: tailwind.config.ts's " +
      '`content` globs only scanned pages/, components/, app/, and src/ — ' +
      "prototype/ (this entire capability's override folder) was never " +
      'included. Tailwind only generates CSS for utility classes it finds ' +
      'via a static text scan of files matching those globs, so any class ' +
      'used ONLY inside prototype/ — and not coincidentally also used ' +
      "somewhere in src/**'s much larger file set — silently generated NO " +
      'CSS at all. Not a wrong color: a fully transparent background, ' +
      'indistinguishable from a missing element at a glance. Caught ' +
      'because List\'s "Partial" status badge (bg-orange-400) rendered ' +
      'as invisible white-on-white text; confirmed via getComputedStyle ' +
      'showing backgroundColor: rgba(0,0,0,0), not a guess. The exact same ' +
      "class is used in CalendarView.tsx's Partial job-bar color, which " +
      'was ALSO silently transparent before this fix — a pre-existing, ' +
      'previously-unnoticed bug from before this session, not something ' +
      "introduced by D24. Fixed by adding './prototype/**/*.{ts,tsx}' to " +
      "tailwind.config.ts's content array; verified both List's badge and " +
      "Calendar's bar render the correct solid orange after a dev-server " +
      'restart.',
    whyThisDefault:
      'Real defect, not a design call — logged for traceability the same ' +
      'way D13/D21 were, and because this affects every color used in ' +
      'the prototype folder, not just the one that happened to surface ' +
      'it. Worth Engineering knowing about beyond this prototype: any ' +
      'future prototype-style override folder living outside src/ needs ' +
      'its own explicit content glob, or its styling will silently, ' +
      'partially fail in exactly this way.',
    jumpTo: { tab: 'list' },
    source: "Found while building D24's List view, 2026-08-12",
  },
  {
    id: 'D26',
    title:
      'Technician picker restructured to match the real Detail page — assigned-only list + searchable Add, with a location-aware default',
    type: 'Technical',
    area: 'End User',
    endUserScope: ['US – Baton Rouge', 'US – Wichita/Kansas', 'Canada', 'All'],
    owners: [ashley, bryan],
    stakeholderQuestion:
      "Should the technician picker default to the job's own site's technicians first (one click to see everyone), or always show every technician unfiltered regardless of site?",
    defaultBuilt:
      'Fixed 2026-08-12: TechnicianRosterPicker no longer shows the entire ' +
      'roster expanded with checkboxes at all times. It now shows only ' +
      'ASSIGNED technicians inline (name, capability tags, conflict ' +
      'warnings, remove button — and in Job Detail specifically, travel-' +
      'in/out + production hours inline per technician instead of a ' +
      'separate section), plus a "+ Add Technician" control that opens a ' +
      'searchable popover (Command/CommandInput, matching the real ' +
      "Technicians.tsx's own Popover+search shape) to add more. Confirmed " +
      'against the real component directly: it is NOT a plain modal with ' +
      'a form (as initially assumed from a reference screenshot) — it is ' +
      'a Popover-triggered combobox with client-side search, and it has ' +
      'no Travel In/Travel Out columns anywhere in real production code ' +
      '(grepped — zero matches). Also added: the add-search defaults to ' +
      "the job's own location's technicians first (via a new optional " +
      "`jobLocation` prop — passed as the job's real location in Job " +
      "Detail, and as the same CA-prefix guess Unscheduled Work's " +
      "Schedule dialog already made in D12), with a one-click 'Show all " +
      "locations' — never a restriction on who CAN be assigned (D1 stays " +
      'fully open), just a default that scales better as the roster ' +
      'grows across all three sites. Non-service entries have no job ' +
      'site, so their picker shows every technician unfiltered, ' +
      'unchanged from before.',
    whyThisDefault:
      'Direct user feedback that the always-expanded checkbox list "will ' +
      'be a long list" once all three sites\' technicians are counted, ' +
      "and a request to compare against Andrea's real system before " +
      'building anything — which surfaced that the real Technicians.tsx ' +
      'already solved this exact problem the same way (assigned-only + ' +
      'searchable add), so this adopts that precedent rather than ' +
      'inventing a new pattern. The location-aware default is explicitly ' +
      'a PROTOTYPE-ONLY demonstration: the real `GET /onsite-project/' +
      'tech-options` payload has no location field on any candidate to ' +
      "filter by server-side — this is exactly N7's still-open question, " +
      'not resolved by building this. If Tim confirms the real API can ' +
      'never be scoped this way, this default would need to move to a ' +
      'client-side-only convenience (which is, in fact, all this ' +
      'prototype ever claims it to be).',
    jumpTo: { tab: 'calendar' },
    source: 'Direct user request + real-component comparison, 2026-08-12',
  },
  {
    id: 'D27',
    title:
      'REVIEW ACTION ITEM — unified Detail form combining Torqueware / Andrea-US-real / Canada-RMID, BUILT, pending stakeholder review',
    type: 'Technical',
    area: 'Product Management',
    endUserScope: ['US – Baton Rouge', 'US – Wichita/Kansas', 'Canada', 'All'],
    owners: [ashley, bryan, tim],
    stakeholderQuestion:
      'Walk through the proposed unified Detail form section by section (Customer/Account fields, Technician Role + per-tech Comments, Service Checklists, Completed/Lost as separate checkboxes, Administrative fields, Documents, Comments) — does anything conflict with how you actually work? Then walk the "what we left off" list per source system (Torqueware/Canada/Andrea\'s real screen) — is anything there a dealbreaker to leave out, especially: per-job profit/margin visibility, the Published/draft flag, and per-technician time-of-day scheduling?',
    defaultBuilt:
      'BUILT 2026-08-13, pending stakeholder review — this is the concrete ' +
      '"best marriage" proposal per direct request, now actually wired ' +
      "into JobDetailDialog.tsx (superseding this item's earlier " +
      'options-only draft). Full section-by-section field list below; ' +
      'each stakeholder should read their own system\'s "left off" list ' +
      "at the end and flag anything that's a dealbreaker on the review " +
      'call — nothing here is final until that happens.\n\n' +
      'SECTIONS (all built except where noted):\n' +
      '1. Header — Project #, derived Status badge, On Hold switch ' +
      '(unchanged, already built).\n' +
      '2. Core Info — Dates, Location, Division, Vehicle, Sales/Service ' +
      'Code(s) (unchanged, already built).\n' +
      '3. Customer/Account(s) — per account: Customer Name, City/State ' +
      '(NEW, from Canada), Account #, PO Number as an actual string ' +
      '(NEW, from Canada — distinct from the existing PO Received Yes/No ' +
      'flag, which stays), PO Received + Confirmed checkboxes ' +
      '(unchanged), Customer Contact Name/Email/Phone (NEW, from ' +
      'Canada), Site Contact Name/Email/Phone (NEW, from Canada, ' +
      'separate from Customer Contact), Quote Value (relocated from ' +
      "job-level quoteTotal to per-account, matching Andrea's real " +
      'screen and Canada\'s "Quote Value" — job-level total becomes a ' +
      'sum of these for List), SR#/Quote#/Work Order# as placeholder-' +
      "styled links (NEW, from Andrea's real screen — see N8's " +
      'correction), Outside Sales (NEW, from Canada, a plain text field).\n' +
      '4. Technicians — existing picker (D26) plus: Role per technician ' +
      "(NEW, from Andrea's real screen — Trainee/Project Lead/No role, " +
      'a plain dropdown, no server-driven vocabulary to match since none ' +
      'exists in this prototype), per-technician Comments (NEW, from ' +
      "Andrea's real screen, a free-text field per assigned tech, " +
      'distinct from the job-level Comments in section 7), existing ' +
      'Travel In/Out + Production hours (unchanged).\n' +
      '5. Service Checklists — Pre-Service Checklist (NEW, from Canada, ' +
      'free text), Post-Service Checklist (NEW, from Canada, free text), ' +
      'Posted Invoice (NEW, from Canada, a reference field), Completed ' +
      'and Lost as two INDEPENDENT checkboxes (NEW, from Canada — ' +
      'confirms N4: Lost is not a Cancelled variant. Deliberately kept ' +
      "separate from this build's existing Completed/Cancelled " +
      'JobStatus values rather than replacing them outright — see the ' +
      '"needs its own follow-up" note below).\n' +
      '6. Administrative — Managed By (NEW, from Canada, plain text), ' +
      'Managing Lab (NEW, from Canada, plain dropdown — does not resolve ' +
      "N7's technician-sourcing question, just surfaces the field).\n" +
      '7. Documents — an upload section with a "No files found" empty ' +
      'state (NEW, from Canada — UI shell only, no real file storage ' +
      "wired up, matching this pass's frontend-only scope).\n" +
      "8. Comments — one append-only thread (NEW, from Canada's " +
      "Comments + Andrea's real Comments box — reuses the exact " +
      "CommentThread pattern already built for Open Decisions, so it's " +
      'a proven pattern, not a new one).\n\n' +
      'WHAT WE LEFT OFF, PER SOURCE SYSTEM:\n' +
      '• From TORQUEWARE — the 11-value Type vocabulary (Suggested/' +
      'Quoted/Confirmed/Declined/Drop In/In-House + non-service types): ' +
      'already decided out of scope, D9. Real per-technician start/end ' +
      'TIME (not just a date): left off pending N10/N12 — this build ' +
      'stays date-only. The Published flag: left off pending N5/N9 — ' +
      "Ashley/Bryan/Shawna's call. Travel Type, Shift Code, Per Diem " +
      'Eligible: left off, vocabulary genuinely unconfirmed (N10). Per-' +
      'technician vehicle assignment (Torqueware ties vehicle to the ' +
      'schedule entry, not the job): left off — vehicle stays job-level ' +
      '(N12). Job Cost/Revenue/G.M.$/G.M.%: left off entirely — no cost/ ' +
      'rate data source exists anywhere in this build (N10). Likely the ' +
      'single biggest omission for whoever owns margin visibility — ' +
      "flag if that's a dealbreaker.\n" +
      '• From CANADA — Interval(months) auto-recurrence config: left ' +
      "off entirely, tied to N2 (explicitly out of scope, FRD 'do not " +
      "build' list) — the field itself is not included, not just the " +
      'automation behind it. Real working document storage: only a UI ' +
      "shell is proposed, not real upload/storage. Managing Lab's real " +
      'relationship to technician sourcing: added as a plain field only ' +
      "— doesn't resolve N7.\n" +
      "• From ANDREA'S REAL SCREEN — Checkouts (equipment/standards): " +
      'left off entirely, a whole separate untouched feature (N11). Real ' +
      'backend wiring for SR#/Quote#/WO# links: still placeholders only, ' +
      "matching the real page's own current (admitted) state — no loss " +
      'relative to today.\n\n' +
      'NEEDS ITS OWN FOLLOW-UP BEFORE BUILDING: adding Completed/Lost as ' +
      "independent checkboxes touches this build's existing JobStatus " +
      "derivation (D22) and D5's still-open Rule 6 conflict — this " +
      'should be its own explicit decision at build time, not bundled ' +
      'silently into this form pass.',
    whyThisDefault:
      'Direct request for a "best guess at perfect marriage" that avoids ' +
      'a significant loss for any of the three stakeholders, with the ' +
      'review itself made an explicit, trackable action item so each ' +
      'stakeholder can advocate for a left-off item they consider a ' +
      "dealbreaker before anything is built. The FRD's already-settled " +
      '"Shared Detail View, identical from List or Calendar" (§3) stays ' +
      'the anchor — this is an extension of that shape with concretely-' +
      'sourced fields, not a field-union of three incompatible tools ' +
      '(a per-technician-per-day schedule tool, a per-project US Detail ' +
      'page, and a per-project Canada intake form).',
    jumpTo: { tab: 'none' },
    source:
      "Torqueware 'Edit Schedule' popup, Andrea's real Detail page, and " +
      "Canada's RMID form — three screenshots reviewed directly; best-" +
      'marriage synthesis requested directly, 2026-08-13',
  },
  {
    id: 'D28',
    title:
      'Readiness vs. Status: Red/Green/Partial is not a lifecycle state — split from the honest Status badge (Active/On Hold/Completed/Cancelled)',
    type: 'Business',
    area: 'Product Management',
    endUserScope: ['All'],
    owners: [ashley],
    stakeholderQuestion:
      'Does the new split (Readiness = color-only Red/Green/Partial indicator, always visible; Status = the honest Active/On Hold/Completed/Cancelled lifecycle badge) read clearly on List, Calendar, and Detail — or does it need a different name than "Readiness"?',
    defaultBuilt:
      'BUILT 2026-08-14. Red/Green/Partial is no longer rendered under a ' +
      '"Status" label anywhere. It is now Readiness: a color-only ' +
      "indicator (List's left row border, Calendar's bar fill), derived " +
      'live from PO Received/Confirmed across every account (job-status.ts ' +
      "deriveAutoStatus) and shown regardless of a job's lifecycle state — " +
      'never hidden or overridden by On Hold/Completed/Cancelled. ' +
      'Status is now the honest lifecycle-only value (job-status.ts ' +
      "resolveLifecycleStatus): 'Active' | 'On Hold' | 'Completed' | " +
      "'Cancelled' — 'Active' is an explicit value, not a blank/omitted " +
      'badge, so Status never silently stands in for a readiness value the ' +
      'way the old collapsed badge did. On Hold gets a dashed-border ' +
      'overlay on Calendar bars (plus a pause icon) rather than replacing ' +
      "the bar's readiness fill color; Completed/Cancelled get reduced " +
      'opacity + line-through. List\'s single "Status" filter/legend is ' +
      'now two: Readiness (Red/Partial/Green) and Status (Active/On Hold/' +
      'Completed/Cancelled). `ScheduledJob.status` still caches the OLD ' +
      'collapsed value under the hood purely for ' +
      "mock-onsite-project-api.ts's benefit (the real, untouched " +
      '/onsite-project route infers PO/Confirmed from it) — nothing new ' +
      'reads that field directly as a display value anymore.',
    whyThisDefault:
      'Direct stakeholder feedback: "it doesn\'t seem like red/green ' +
      'should be a status." Correct — Red/Green/Partial answers "are we ' +
      'paperwork-ready," recomputed automatically every time account data ' +
      'changes; it is never set directly and is not a state a job ' +
      "occupies the way On Hold/Completed/Cancelled (or Canada's real " +
      'lifecycle, per D22) are. The old single collapsed badge picked ONE ' +
      'of six values to show, so a job that was e.g. Green AND On Hold ' +
      'only ever displayed "On Hold" — the readiness info underneath was ' +
      "real but invisible. This also matches the reconciliation pass's " +
      'finding #4 (see the "Status Model Reconciliation" section): this ' +
      "build already has Torqueware's two-axis shape (event type vs. " +
      'confirmation state); Readiness/Status is that same confirmation ' +
      'axis, named honestly instead of doubling as a catch-all "Status." ' +
      'Placement as a left-border/bar-fill color rather than a labeled ' +
      'badge was a specific ask, matching the colored-indicator pattern ' +
      "already used elsewhere in this build (and in Andrea's/Canada's own " +
      'screens) rather than adding a second text badge next to Status.',
    jumpTo: { tab: 'list', anchorId: 'decision-D28' },
    source:
      'Direct stakeholder feedback during the D22/D9 status-model review, 2026-08-14',
  },
  {
    id: 'D29',
    title:
      'Non-service entry types: fixed list + "Other" catch-all, not user-configurable',
    type: 'Business',
    area: 'Product Management',
    endUserScope: ['All'],
    owners: [ashley],
    stakeholderQuestion:
      'Non-service types (PTO/Travel/Out of Service/Tentative) are a fixed, developer-defined list today — no in-app way to add a new one. Is a fixed list plus an "Other" catch-all (with the existing Notes field covering specifics) good enough, or does this actually need to be user-configurable?',
    defaultBuilt:
      "BUILT 2026-08-16. Added 'Other' as a fifth, fixed " +
      'NonServiceEntryType value (types.ts) — its own dashed-border color ' +
      'in the Calendar legend/bars (slate, deliberately distinct from the ' +
      "other four so it doesn't read as a mis-tagged entry), selectable in " +
      "NonServiceEntryDialog's existing Type dropdown like any other value. " +
      'Explicitly NOT built: any admin/settings surface for adding new ' +
      'types at runtime — the type list stays a code-level union, same as ' +
      'before, just with one more fixed member.',
    whyThisDefault:
      'No source document (FRD, transcripts, Torqueware discovery) ' +
      'suggests these categories change often enough to justify a ' +
      "configurable-type feature — Torqueware's own equivalent list is " +
      'itself hardcoded, not user-managed. Each type also drives real ' +
      'display logic (a distinct legend color); a fully dynamic list would ' +
      'need a generic answer for "what does a made-up type look like," ' +
      "solving a problem that has no demonstrated need yet. 'Other' + " +
      'the existing free-text Notes field is the standard low-cost pattern ' +
      'for a bounded category set with a rare-exception escape hatch, and ' +
      'if it turns out to get used constantly, that usage is itself the ' +
      'signal to revisit this with a real configurable-type feature later.',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D9' },
    source: 'Direct user request, 2026-08-16',
  },
  {
    id: 'D30',
    title: 'One filterable calendar, not a calendar per location',
    type: 'Technical',
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    owners: [ashley, bryan, tim],
    stakeholderQuestion:
      'Is one calendar filtered by location the right model, or does each location (US, Canada, Alltite) genuinely need its own separate calendar? And separately: should a scheduler be ABLE to see other locations at all, or is that a permissions boundary?',
    defaultBuilt:
      'BUILT 2026-08-19. Calendar now has the same filter set List has ' +
      'had since D24 — Location, Division, Technician, Readiness, ' +
      'free-text search, and the pre-existing hide-completed switch, ' +
      'which moved into the filter bar where it belongs. One board, ' +
      'filtered. Explicitly NOT built: three separate calendars, any ' +
      'per-location route, or any restriction on what a user can see. ' +
      'A persistent "N filters active" indicator plus an "N jobs hidden ' +
      'in this month" badge are always visible.',
    whyThisDefault:
      'A filter is a view; three calendars is a data partition. The ' +
      'partition question — can a Canada scheduler see US work at all, ' +
      'and is Alltite a location inside this system or its own tenant ' +
      'after the Dec 31 2026 Torqueware decommission — is a permissions ' +
      'and architecture call nobody has made (N19, and it leans on ' +
      "N7's still-open technician-sourcing question). Building three " +
      'boards now would presuppose that answer and would be expensive ' +
      'to undo; one filterable board collapses cleanly into either ' +
      'outcome. The hidden-count badge exists because the real hazard ' +
      'of a filtered schedule board is a scheduler looking at ' +
      "two-thirds of the work and not knowing it — that's a missed job, " +
      'not a cosmetic annoyance.',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D30' },
    source: 'Direct user question, 2026-08-19',
  },
  {
    id: 'D31',
    title: 'Saved calendar views: capped at 6, with built-in starters and one default',
    type: 'Business',
    area: 'End User',
    endUserScope: ['All'],
    owners: [ashley],
    stakeholderQuestion:
      'Is a hard cap of 6 personal saved views plus 5 built-in ones the right shape, or do schedulers need more (or an admin-managed shared set instead of personal ones)?',
    defaultBuilt:
      'BUILT 2026-08-19. Users can save the current filter set as a ' +
      'named view, rename or delete their own, and star one to load on ' +
      'open. Five built-in starter views ship with it (All work, one per ' +
      'location, Not ready (Red)); they cannot be deleted and do not ' +
      'count against the cap. At the cap, Save is refused with a message ' +
      'naming what to delete — it never silently overwrites the oldest. ' +
      'A "modified, not saved" note appears when filters drift from the ' +
      'selected view. Persisted in localStorage, which is a STAND-IN ' +
      'for a real per-user preferences endpoint.',
    whyThisDefault:
      'The sprawl worry was raised in the same breath as the feature, ' +
      'so it got designed for rather than discovered later. Three ' +
      'mechanics do the work: a cap keeps the dropdown scannable ' +
      'without needing its own search; starters mean the common cases ' +
      "(one location at a time) don't get hand-rebuilt by every user, " +
      'which is where sprawl actually comes from; and a default view ' +
      'stops people rebuilding the same filters every morning and ' +
      'saving them again "just in case." Six is a system decision, not ' +
      'a researched number — the most provisional kind. If real users ' +
      'hit the cap constantly, the signal is that the starters are ' +
      'wrong, not that the cap is too low.',
    jumpTo: { tab: 'calendar', anchorId: 'decision-D30' },
    source: 'Direct user question, 2026-08-19',
  },
  {
    id: 'D32',
    title: 'Van suggestion by geography — availability-ranked, on stand-in distance',
    type: 'Technical',
    area: 'End User',
    endUserScope: ['All'],
    owners: [ashley, bryan],
    stakeholderQuestion:
      'Is "closest available van" the useful version of this, or is it only worth building once it can rank by profitability and real drive time? Dan asked for the most profitable path, which is a different feature.',
    defaultBuilt:
      "BUILT 2026-08-19 as a Should, not a Must. Job Detail's Vehicle " +
      'section now has a "Suggest a van by location" panel that ranks ' +
      "every van: technician availability first (from this build's real " +
      "conflict-check), then straight-line distance from the van's home " +
      "base to the job's city, with the spare van last on purpose. " +
      'Every figure is labeled "stand-in data" on screen. Vans gained a ' +
      'homeLocation and a spare flag. Explicitly NOT built: real ' +
      'geocoding, real drive time, multi-stop route optimization, or any ' +
      'profitability ranking.',
    whyThisDefault:
      'The part worth validating with Dan — does "closest AND actually ' +
      'staffable" match how he picks a van — needs no mapping API at ' +
      'all, and the availability half is real, not mocked. The distance ' +
      'half is a city-centroid great-circle number, which is wrong for ' +
      'a site 40 miles outside town and wrong again because drive time, ' +
      'not miles, is what feeds cost. It is labeled on screen rather ' +
      "than only in a comment, specifically because Torqueware's own " +
      'version silently falls back to zero distance when its lookup ' +
      'fails, which reads as "next door." Ranking by distance and ' +
      'calling it profitability would be the same fake number gap #16 ' +
      'already refused once — profit needs labour rate, per diem, and ' +
      'the MSA-vs-list pricing split (N17, N18).',
    // 'none' rather than a real anchor: the panel only exists inside Job
    // Detail, which isn't in the DOM until a job is opened — same situation
    // as D1's roster picker. Jumping just opens the decisions panel.
    jumpTo: { tab: 'none' },
    source:
      'Direct user request, 2026-08-19; 03-scheduling-dispatch-workflow.md (van/technician assignment logic)',
  },
];

/**
 * Phase 2 — Torqueware discovery items outside onsite/scheduling entirely.
 * Read-only holding pen, not a decision queue: no owners, no resolution,
 * nothing scoped. Mirrors
 * /prototype/decisions/torqueware-non-scheduling-log.md (T1–T9) by hand.
 * Deliberately excluded from `openDecisions` so the Phase 1 unreviewed-count
 * badge on the Open Decisions button never counts these.
 */
export const torquewareBacklogItems: BacklogItem[] = [
  {
    id: 'T1',
    title: 'Customer Portal scope — the largest structural open item',
    summary:
      "Torqueware's entire customer-facing half (20 of 75 catalogued " +
      'features — dashboard, locations, assets, QR/stickers, work ' +
      "requests, reports, account admin) is functionally Alltite's " +
      "customer portal, not an operations tool. JM Test's own Customer " +
      "Portal discovery hasn't run yet — physical QR stickers already on " +
      'customer equipment make this worth prioritizing early.',
    source:
      'torqueware-vs-modern-gap-matrix.md (glossary row 13); torqueware-net-new-scope-summary.md',
  },
  {
    id: 'T2',
    title: 'Oct 15 roadmap coordination (7 features / 6 modules)',
    summary:
      'Seven Gap features (DashBoard, Quote authoring, Reporting ×2, ' +
      'Manage Users, Standards, Outsource Vendors) ride on 6 Modern ' +
      'CalMapp 2 modules already scheduled to go native on the Oct 15 ' +
      "timeline. Whether they close 'for free' depends on folding " +
      "Torqueware's requirements into those builds before they ship — a " +
      'live, time-sensitive coordination question.',
    source: 'torqueware-net-new-scope-summary.md §Type A',
  },
  {
    id: 'T3',
    title: 'CRM/sales pipeline as fixed net-new scope',
    summary:
      '16 features have zero CalMapp analog either way (full CRM, ' +
      'labour clock in/out, per-job profitability, signature capture, ' +
      '2FA, Google sign-in, employee records, edit locking) — the floor ' +
      "of the acquisition's net-new scope regardless of any roadmap " +
      'coordination.',
    source: 'torqueware-net-new-scope-summary.md §Type C',
  },
  {
    id: 'T4',
    title: 'Technician desktop application — unresolved blind spot',
    summary:
      "The Windows technician app isn't in the analyzed codebase. If " +
      'Alltite technicians do most calibration work there instead of the ' +
      'browser, the real net-new scope is larger than currently scored. ' +
      "Unrelated to onsite scheduling's own technician-roster model, " +
      'which is scheduler-facing, not technician-facing.',
    source:
      'torqueware-net-new-scope-summary.md §Biggest single risk; torqueware-onsite-questions.md §1',
  },
  {
    id: 'T5',
    title: 'Regulatory certificate text needs Alltite quality sign-off',
    summary:
      'Calibration certificates hard-code A2LA #3040.01, ISO/IEC 17025, ' +
      'ANSI/NCSL Z540-1-1994, ISO 6789, ILAC-G8:09/2019 as literal ' +
      'template text. Any replacement treats this as regulated output — ' +
      "Alltite's quality function signs off wording, not engineering.",
    source: 'torqueware-nfr.md §Regulatory framework',
  },
  {
    id: 'T6',
    title: 'MD5 password storage — mandatory reset at cutover',
    summary:
      'Credentials cannot be migrated by re-hashing. Every user needs a ' +
      'password reset at cutover, which belongs in the customer ' +
      'communications plan regardless of what replaces Torqueware.',
    source: 'torqueware-nfr.md §Application security characteristics',
  },
  {
    id: 'T7',
    title: 'QR sticker resolution path — a physical, non-reversible dependency',
    summary:
      'Every printed sticker on customer equipment resolves through a ' +
      'hard-coded host. Any migration keeps that path working or accepts ' +
      "previously printed stickers stop resolving — can't be walked back " +
      'after the fact.',
    source: 'torqueware-integration-inventory.md §QR short-URL host',
  },
  {
    id: 'T8',
    title: 'Dynamics GP integration is SQL-level, not API-level',
    summary:
      'The GP push is a cross-database stored procedure call — no retry, ' +
      'no queue, partial writes possible, and a SHIPTO push can silently ' +
      'auto-create a new Torqueware account/site. Relevant to any future ' +
      'ERP integration work, regardless of what replaces the admin/sales side.',
    source: 'torqueware-integration-inventory.md §The GP integration is SQL-level',
  },
  {
    id: 'T9',
    title: '916 stored procedures hold the real business logic, none in source control',
    summary:
      'Validation, defaulting, cascade, and tenancy rules live in ' +
      'database procedures never committed to the repo. Any ' +
      'Torqueware-derived requirement carries this caveat until a ' +
      'schema/procedure export is obtained — flagged as the single ' +
      'highest-value on-site follow-up.',
    source:
      'torqueware-architecture-standards.md §Stored procedures; torqueware-onsite-questions.md §1/§4',
  },
];

/** Pure business/factual questions with no demoable feature behind them —
 * intentionally not built, per §4's rule on choosing defaults. */
export const notBuiltItems: NotBuiltItem[] = [
  {
    id: 'N1',
    title: '90-day urgency coloring on unconfirmed jobs',
    area: 'Product Management',
    endUserScope: ['Canada', 'US – Baton Rouge'],
    stakeholderQuestion:
      'Does BR want the same 90-day red/black urgency coloring Canada uses on unconfirmed jobs, or is that Canada-specific?',
    pendingWho: 'Ashley / Bryan',
    note:
      "Canada colors On-Ramp jobs red inside 90 days; BR's model has no " +
      'time-based urgency. FRD explicitly says not to build this speculatively ' +
      'either way — no coloring rule is implemented.',
    source: 'FRD §6.2 US-3 / §7 Rule 10',
  },
  {
    id: 'N2',
    title: 'Auto-recurrence of contracted follow-on work',
    area: 'Product Management',
    stakeholderQuestion:
      'Does BR have contracted follow-on work that would benefit from Canada-style auto-recurrence?',
    pendingWho: 'Ashley / Bryan',
    note:
      'Explicitly out of scope for this pass (see §3, "Do not build"). Whether ' +
      "BR has an equivalent need to Canada's auto-recurrence is still unconfirmed.",
    source: 'FRD §7 Rule 11',
  },
  {
    id: 'N3',
    title: "Quote-vs-received reconciliation — does BR have Canada's problem?",
    area: 'Product Management',
    stakeholderQuestion:
      "Does BR experience the same quote-vs-received mismatch problem Canada had, or is a clean 'no' the real answer?",
    pendingWho: 'Ashley',
    note:
      'A clean "no" is a fine, complete answer per the FRD. If yes, it\'s a ' +
      'quoting/work-order problem, not a List/Calendar one — its own session.',
    source: 'FRD §4 / §7 Rule 12',
  },
  {
    id: 'N4',
    title: 'Lost/win-back status vs. the Opportunities Log — same concept?',
    area: 'Product Management',
    stakeholderQuestion:
      "Is Canada's 'Lost' status the same concept as BR's Opportunities Log, a different concept entirely, or does it need its own value either way?",
    pendingWho: 'Andrea / Ashley',
    note:
      'Affects how the Opportunities Log gets scoped in Phase 2 with Lindsay — ' +
      'not a List/Calendar decision, and the Opportunities Log itself is out ' +
      'of scope this pass.',
    source: 'FRD §7 Rule 13',
  },
  {
    id: 'N5',
    title: 'Draft/"published" state for schedule entries before technicians see them',
    area: 'Technical/Architecture',
    endUserScope: ['Canada'],
    stakeholderQuestion:
      'Do BR/Canada want an unpublished "draft" schedule state before technicians can see it, matching Torqueware\'s Published flag?',
    pendingWho: 'Ashley / Bryan, Shawna (Canada)',
    note:
      "Torqueware's Schedule entity carries a published flag distinct from " +
      'the event itself — a schedule can exist unpublished before someone ' +
      "flips it visible to the tech. Neither Andrea's tool nor this " +
      "prototype's Calendar has any equivalent — everything placed on the " +
      'calendar today is immediately live. Genuinely unknown whether this ' +
      'reflects a real BR/Canada workflow need or is just how Torqueware ' +
      'happens to be built.',
    source:
      'torqueware-data-dictionary.md (Schedule entity, published field); ' +
      'torqueware-gap-coverage-update.md #15',
  },
  {
    id: 'N9',
    title:
      'Torqueware\'s "Published" field — now visually confirmed live, still unanswered whether BR/Canada want it',
    area: 'Technical/Architecture',
    endUserScope: ['Canada'],
    stakeholderQuestion:
      'Same question as N5, now with visual confirmation the Published flag is real and actively used in Torqueware today — does that change the answer?',
    pendingWho: 'Ashley / Bryan, Shawna (Canada)',
    note:
      'A real Torqueware "Edit {Employee}\'s Schedule" popup (screenshot ' +
      'reviewed 2026-08-13) shows "Published: Yes" as a live, editable ' +
      'field on an actual schedule entry — this was previously sourced ' +
      'only from a data-dictionary document (N5); now directly seen in ' +
      "the UI itself, not just the schema. Doesn't change N5's answer — " +
      "still Ashley/Bryan/Shawna's call whether BR/Canada want an " +
      'unpublished-draft state — but removes any doubt that this is a ' +
      'real, exercised field in Torqueware today, not a vestigial one.',
    source: "Torqueware 'Edit Schedule' popup screenshot, 2026-08-13",
  },
  {
    id: 'N6',
    title: 'Vehicle fleet management — by location, brand, type?',
    area: 'Technical/Architecture',
    stakeholderQuestion:
      'Does JM Test want real vehicle fleet management (per-location assignment, brand/type, retiring old vehicles), or is a flat company-wide list sufficient?',
    pendingWho: 'Tim',
    note:
      'Today a "Vehicle" is just {name, description} — a flat, ' +
      'company-wide, add-only list (OnsiteProjectsList.tsx\'s "Add New ' +
      'Vehicle" dialog). No location, brand, type, or status field exists ' +
      'anywhere in the schema, and there is no edit/rename/deactivate path ' +
      '— Vehicles.tsx even has a delete button already built and ' +
      'commented out, never wired up. Whether fleet management (per-' +
      'location assignment, brand/type categorization, retiring old ' +
      "vehicles) is wanted at all hasn't been asked yet — raised as a " +
      'factual question for Tim, not built speculatively either way.',
    source: 'Direct user question, 2026-08-12',
  },
  {
    id: 'N7',
    title:
      'Architecture/Engineering (Tim): where does the technician list actually pull from, and does it need to be filtered by location/company?',
    area: 'Technical/Architecture',
    stakeholderQuestion:
      'Does the technician list need to be filtered/scoped by location, division, or company server-side, or is showing everyone always correct?',
    pendingWho: 'Tim (Architecture/Engineering)',
    note:
      'Compiled from code, not assumed: there is no standalone Technicians ' +
      'admin module anywhere in CalMapp. Per-project assignment calls ' +
      'GET /onsite-project/tech-options?projectId=… , which returns a flat ' +
      '{userId, userName, isAssigned} list with no location/division/' +
      'company field anywhere on it, and the frontend sends nothing but ' +
      'projectId. Whether that list is scoped at all server-side — by ' +
      'location, division, or eventually by company if Torqueware/Alltite ' +
      "technicians (a separate Employee entity in Torqueware's own data " +
      "model, with no shared identity to CalMapp's User table) ever need " +
      'to appear in the same scheduling view as US/Canada technicians — ' +
      'is entirely invisible past the API boundary today. (Real conflict ' +
      'detection DOES already exist server-side on tech-add — hasConflict ' +
      '+ Force Add/Skip — which is useful precedent, just not an answer ' +
      "to this question.) The prototype's own seedTechnicians " +
      '(location/division/capabilities per tech) is invented for this ' +
      "demo and confirmed nowhere in the real system (see D1's own note).",
    source: 'Direct user question, 2026-08-12 (Technicians.tsx, onsite-project.ts)',
  },
  {
    id: 'N8',
    title:
      'List/Detail reference links (SR/Quote/Work Order/OSR) — now built on both surfaces',
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    stakeholderQuestion:
      'These are placeholder links today, matching the real page\'s own "not wired yet" state — worth confirming SR#/OSR#/Quote#/WO# are the right four to eventually wire up, and in that priority order.',
    pendingWho: 'Ashley / Bryan',
    note:
      'REVISED 2026-08-13 — original framing was wrong. This originally ' +
      'said none of these entities exist anywhere and building links ' +
      'would be fabricating targets that point at nothing. A real ' +
      "screenshot of Andrea's Detail page's Customers table shows SR#, " +
      'Quote#, and Work Order# rendered as real (if placeholder) link ' +
      'columns already, with an explicit caption: "SR#/Quote#/Work ' +
      "Order# are placeholder links — they'll connect to stored records " +
      'in a future update. OSR# is live and linked by account number." ' +
      'So: OSR# is a real, already-working link today; SR#/Quote#/WO# are ' +
      'real COLUMNS the production team has already committed to, just ' +
      'not wired to a target yet. ' +
      'BUILT 2026-08-15 — direct user feedback confirmed this is worth ' +
      "the effort. JobDetailDialog's Customers section is now an " +
      "always-visible table (matching Andrea's screen's layout) with " +
      'SR#/Quote#/WO# as placeholder-styled links and a working-styled ' +
      "OSR# link (tooltip mirrors production's file-share path pattern, " +
      'no real file storage behind it). PrototypeListView now also shows ' +
      'a WO# column per job (first account\'s WO#, "+N" if more than one) ' +
      "so it's visible without opening Detail — SR#/OSR#/Quote# stay " +
      'Detail-only to avoid crowding the List row further.',
    source:
      "FRD §6.1 US-1; found while building D24; corrected via Andrea's " +
      'real Detail screenshot, 2026-08-13',
  },
  {
    id: 'N10',
    title:
      'Torqueware schedule-entry fields with unconfirmed vocabulary or computation source',
    area: 'Technical/Architecture',
    endUserScope: ['US – Wichita/Kansas'],
    stakeholderQuestion:
      "What do Torqueware's Shift Code, Travel Type, and Per Diem Eligible values actually mean, and is per-job profitability (Job Cost/Revenue/Gross Margin) something CalMapp should ever show?",
    pendingWho: 'Tim / Bryan',
    note:
      "A real Torqueware 'Edit Schedule' popup (screenshot reviewed " +
      '2026-08-13) surfaced several fields with no confirmed definition ' +
      "anywhere in this project's source documents: the Employee field " +
      'bundles name + location + vehicle + a code string ("T/P/E Full ' +
      'PhysD" — capability/role letters plus what may be a physical-exam ' +
      'compliance status, unconfirmed); Shift Code ("TOP") — vocabulary ' +
      'and meaning unknown; Travel Type ("Overnight Stay") — full value ' +
      "list unknown; Per Diem Eligible — unclear whether it's manually " +
      'set or derived from Travel Type. Most consequential: the form ' +
      'shows live Job Time/Travel Time/Job Cost/Revenue/G.M.$/G.M.% ' +
      'figures per schedule entry — real per-job profitability ' +
      "computation, live in production today. Whether it's computed " +
      'client-side, stored, or sourced from technician pay rates is ' +
      'entirely invisible from a screenshot. This is the same ' +
      'profitability concept T3 (Torqueware backlog) already flags as a ' +
      'net-new CRM/financial capability with zero CalMapp equivalent — ' +
      "this confirms it's live and actively used, not vestigial.",
    source: "Torqueware 'Edit Schedule' popup screenshot, 2026-08-13",
  },
  {
    id: 'N11',
    title:
      'Equipment/standards "Checkouts" section on the real Detail page — a whole untouched feature',
    area: 'Technical/Architecture',
    endUserScope: ['US – Baton Rouge', 'US – Wichita/Kansas'],
    stakeholderQuestion:
      'Is equipment/standards Checkout tracking (separate from vehicle assignment) something CalMapp needs to support?',
    pendingWho: 'Ashley / Bryan',
    note:
      'A real Detail-page screenshot (project #0012570) shows a ' +
      '"CHECKOUTS" section with a "+ Check Out" button below Technician ' +
      'Assignments ("Nothing checked out." when empty) — equipment/' +
      'standards checkout tracking against a job, distinct from vehicle ' +
      "assignment. This prototype's `checkedOutCount` field (already " +
      'present on the real `OnsiteProject` type and mock API, unused ' +
      'elsewhere) is the only trace of this concept anywhere in this ' +
      'pass — the actual checkout workflow (what gets checked out, to ' +
      "whom, when it's returned) has never been scoped. Raised as a " +
      'factual question, not built speculatively either way — this is a ' +
      'separate feature from anything D26/D19 touched.',
    source: "Andrea's real Detail-page screenshot, 2026-08-13",
  },
  {
    id: 'N12',
    title:
      'Schedule granularity — per-technician-per-day (Torqueware) vs. per-project (this prototype/Andrea) — does Modern CalMapp need both?',
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    stakeholderQuestion:
      "Does Modern CalMapp need a per-technician-per-day schedule-instance entity (time-of-day, travel type, profitability) underneath the Job, or does the Job-level model already cover BR/Canada's real needs?",
    pendingWho: 'Tim / Bryan',
    note:
      'Torqueware\'s edit popup is titled "Edit {Employee}\'s Schedule" ' +
      'and scoped to one technician on one date, with its own Start ' +
      'Time/End Time (not just a date), Travel Type, and per-entry ' +
      'profitability figures (see N10) — implying a Schedule is its own ' +
      'row per technician per day, not a property of the Job. This ' +
      "prototype (and Andrea's real Detail page) models one Job with " +
      'many technicians attached, each only getting travel-in/out + ' +
      'production HOURS (a total, not a start/end time) — a coarser ' +
      "grain than Torqueware's. Whether Modern CalMapp needs an actual " +
      'per-technician-per-day schedule-instance entity underneath the ' +
      'Job (to carry time-of-day, travel type, and per-entry ' +
      'profitability) or whether the Job-level model already covers ' +
      'everything BR/Canada actually need is unconfirmed — directly ' +
      "related to D23's shared-vs-separate-backend architecture " +
      'question, since this shapes what the canonical data model even ' +
      'needs to hold.',
    source: "Torqueware 'Edit Schedule' popup screenshot, 2026-08-13",
  },
  {
    id: 'N13',
    title: "Managing Lab's hardcoded list needs a real reference data source",
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    stakeholderQuestion:
      'Is MANAGING_LABS (Baton Rouge Lab / Wichita Lab / Canada Lab) the complete, correct, and stable list, and where should it really be sourced from — a labs/locations table, or is a hardcoded enum actually fine long-term?',
    pendingWho: 'Tim',
    note:
      'Unlike Outside Sales/Service Checklists/Posted Invoice/Managed By ' +
      '(region-gated to Canada, 2026-08-16, since they only exist in ' +
      "Canada's source form), Managing Lab stays visible for all regions " +
      '— its own dropdown already lists all three sites, so it reads as ' +
      'a cross-region admin concept that happened to surface via ' +
      "Canada's form, not a Canada-only one. Its blocker is smaller and " +
      'separate from D23: the three-item array in mock-data.ts is ' +
      'hardcoded, not derived from any real lab/location entity. ' +
      "Doesn't resolve N7 (real technician/lab sourcing) either — a " +
      'related but distinct question.',
    source: 'Direct user review during D27 field walkthrough, 2026-08-16',
  },
  {
    id: 'N14',
    title: 'Service Checklist has no defined real structure',
    area: 'Technical/Architecture',
    endUserScope: ['Canada'],
    stakeholderQuestion:
      'Is the Pre/Post-Service Checklist genuinely open text, or a fixed set of checkbox items? Does it vary by service/sales code? Who fills it out — a technician in the field, or an office coordinator — and does that imply a mobile-entry requirement?',
    pendingWho: 'Ashley / Bryan, Shawna (Canada)',
    note:
      "The prototype's Pre-Service/Post-Service Checklist fields " +
      '(region-gated to Canada, 2026-08-16) are plain free-text ' +
      'Textareas — a stand-in for "Canada\'s workflow has a checklist ' +
      'concept," not a confirmed real structure. This is the ' +
      'least-defined field D27 added: no vocabulary, no confirmed entry ' +
      'point, no tie to any compliance/certification requirement has ' +
      'ever been stated. Building this as free text in production ' +
      'without resolving this first risks shipping the wrong shape ' +
      'entirely (e.g., if it needs to be per-item checkboxes synced ' +
      'from a mobile device).',
    source: 'Direct user review during D27 field walkthrough, 2026-08-16',
  },
  {
    id: 'N15',
    title: 'Documents: no confirmed use case, file types, or storage requirement',
    area: 'Technical/Architecture',
    endUserScope: ['Canada'],
    stakeholderQuestion:
      'What is this actually for? What file types get uploaded (signed POs, calibration certificates, site photos, safety paperwork)? What are the size/retention/sensitivity requirements?',
    pendingWho: 'Ashley / Bryan, Shawna (Canada)',
    note:
      'The Documents section (region-gated to Canada, 2026-08-16) is a ' +
      'UI shell only — "Upload" is disabled, "No files found" is ' +
      'static. Unlike the other Canada-only fields, its real blocker ' +
      "isn't D23's backend question; it's that nobody has ever been " +
      "asked what this is for. Canada's RMID form has an upload " +
      'section with zero accompanying context. Building real file ' +
      'storage without an answer here risks guessing at ' +
      'security/retention requirements for data whose sensitivity is ' +
      'completely unknown.',
    source: 'Direct user review during D27 field walkthrough, 2026-08-16',
  },
  {
    id: 'N16',
    title: 'Job Comments have no author field',
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    stakeholderQuestion:
      "Should JobComment gain an author field (technician/user id) before this reaches production, and where does that identity come from given N7's still-open technician-sourcing question?",
    pendingWho: 'Tim',
    note:
      'Unlike the other items in this batch, Comments itself is NOT ' +
      "region-gated or Canada-specific — it's independently validated " +
      "by two real systems (Canada's form AND Andrea's real US Detail " +
      'screen already has one) and should be built for real regardless ' +
      'of D23. But JobComment (types.ts) only stores {id, text, ' +
      'createdAt} — every comment in this prototype is anonymous. ' +
      "That's a real defect for a multi-technician, multi-user system, " +
      "not a stylistic gap — flagging it explicitly so it doesn't get " +
      'carried into a real build unnoticed.',
    source: 'Direct user review during D27 field walkthrough, 2026-08-16',
  },
  {
    id: 'N17',
    title: 'Per diem and overnight travel: a whole topic, not a checkbox',
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    stakeholderQuestion:
      'How does per diem actually work for onsite technicians today — who decides eligibility, at what rate, on what trigger — and does the schedule need to carry it, or does it live entirely in payroll?',
    pendingWho: 'Bryan / Tim — by 2026-09-05',
    note:
      'Per diem has been travelling as a sub-clause of N10 (the "Per ' +
      'Diem Eligible" checkbox) and a one-line omission in D27. It is ' +
      'not a field, it is a cost model attached to overnight travel, ' +
      'and it sits underneath three open items: the per-assignment P&L ' +
      "(N10, gap #16) — Job Cost can't be right without overnight " +
      'cost; scheduling constraints (F4) — nothing here distinguishes a ' +
      'job a technician drives home from; and cross-border, since US ' +
      'and Canada rates, currency, and tax treatment differ. NOT ' +
      'INVESTIGATED as distinct from not built or not decided. Do not ' +
      'build travel cost, technician labour cost, or a Travel Type ' +
      'vocabulary ahead of the answer. Travel Type and Per Diem ' +
      'Eligible sit on the schedule LINE, not the quote — eligibility ' +
      'is decided per technician-day, not per job. Second reason this ' +
      'is bigger than a cost field: Alltite rotates in-house ' +
      'technicians to manage road technicians’ work-life balance, ' +
      'flying them home on weekends during long stints and swapping ' +
      'technicians mid-way through multi-week jobs. That is a People ' +
      'First (P1) concern on the same data, not only a P4 cost one.',
    source:
      'Torqueware "Edit Schedule" popup screenshot, 2026-08-13; gap raised directly by Ashley, 2026-08-19; 03-scheduling-dispatch-workflow.md (full doc, 2026-08-19)',
  },
  {
    id: 'N18',
    title:
      "On-site minimum charge and run-level economics: the floor is human-applied, and per-stop margin isn't the real unit",
    area: 'Product Management',
    endUserScope: ['All'],
    stakeholderQuestion:
      'Should the on-site minimum charge be a system-enforced rule with an override, or stay a human judgement call as in Torqueware today? And is run-level (batch) profitability the figure schedulers should see, rather than per-assignment?',
    pendingWho: 'Bryan / Dan Walker — by 2026-09-05',
    note:
      'Two findings that are the same mechanic. (1) Alltite applies a ' +
      'regional on-site minimum charge (example: $1,500) when a job ' +
      "doesn't clear it on tool value alone. The system offers an " +
      'override; nothing auto-detects that the floor is unnecessary. ' +
      'Dan decides. (2) Profitability is read at RUN level via the ' +
      "scheduling links tool — a full week's run built from quote " +
      'numbers, with aggregate account/site/dollar figures — and Dan ' +
      'waives the minimum on small stops when the whole run clears, ' +
      'against named loss-leader locations inside profitable accounts. ' +
      'A red margin on one line inside a green week is the intended ' +
      'outcome. Consequence for gap #16: per-line margin shown without ' +
      'run context would train schedulers to reject stops the business ' +
      'means to take at a loss. Resolve before answering C7 (job ' +
      "magnitude on the Calendar block), since “job value” isn't one " +
      'clean number when a floor may or may not have been applied.',
    source:
      '03-scheduling-dispatch-workflow.md (Minimum charge / "days open" logic), reviewed 2026-08-19',
  },
  {
    id: 'N19',
    title:
      'Calendar scoping vs. filtering — a permissions boundary, and where Alltite lives',
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    stakeholderQuestion:
      'Should a scheduler be ABLE to see other locations’ work, or is location a permissions boundary? And after Torqueware is decommissioned (Dec 31 2026), is Alltite a location inside this system or a separate tenant?',
    pendingWho: 'Tim (architecture) / Bryan (business rule) — by 2026-09-05',
    note:
      'D30 built one filterable calendar precisely so this question stays ' +
      'open. Filtering is convenience: a scheduler CHOOSES to see only ' +
      'Canada. Scoping is a permission: a scheduler CANNOT see US. Those ' +
      'are different builds, different owners, and different security ' +
      'reviews, and they get conflated constantly because both look like ' +
      'a location dropdown from the outside. Three sub-questions, none ' +
      'answered: (1) is location a permission boundary at all, which ' +
      "leans on N7's open technician-sourcing question and on D23 " +
      '(whether Canada shares the US backend); (2) is Alltite a location ' +
      'value, a division, or its own tenant — a real decision with a ' +
      'hard date on it, since Torqueware goes away Dec 31 2026 and about ' +
      '16 paying customers come with it; (3) if a scheduler can see ' +
      'everything, can they EDIT everything, which is the question that ' +
      'actually bites. Do not build per-location routes or any ' +
      'visibility restriction before this is answered.',
    source: 'Direct user question, 2026-08-19 (D30/D31 build)',
  },
  {
    id: 'N20',
    title: 'Route optimization — an explicit ask, done in Google Maps today',
    area: 'Product Management',
    endUserScope: ['All'],
    stakeholderQuestion:
      'Is route/van optimization a Phase 2 item, a Phase 3 item, or never? Dan asked for it directly, which is rarer than it sounds.',
    pendingWho: 'Ashley / Bryan — by 2026-09-05',
    note:
      "Dan's words: \"is there an algorithm... here's your most " +
      'profitable path." Three things make this worth logging properly. ' +
      'Route planning happens OUTSIDE both systems — Dan plots routes in ' +
      "Google Maps inside his Excel sandbox, so it isn't a Torqueware " +
      "feature to port, it's a manual step neither system ever touched. " +
      'Assignment is judgement on three unautomated axes: geography, ' +
      'technician skill level (a newer tech training on a discipline needs ' +
      'more time budgeted), and route efficiency. And he asked for the ' +
      'PROFITABLE path, not the shortest, which makes this dependent on ' +
      'N17/N18, not just a mapping API. D32 covers one-van-for-one-job ' +
      'ranking (nearest-neighbour); a multi-stop week is ' +
      'travelling-salesman, a different problem.',
    source:
      '03-scheduling-dispatch-workflow.md (van/technician assignment logic), reviewed 2026-08-19',
  },
  {
    id: 'N21',
    title:
      'OSR safety clearance — Alltite is mid-build, and their design beats our placeholder',
    area: 'Product Management',
    endUserScope: ['All'],
    stakeholderQuestion:
      "Should our OSR rebuild adopt Alltite's in-flight design (account/location-level requirements, yes/no checkboxes, a derived safety clearance, a work-order banner with a last-updated date), or is JM Test's OSR a different animal?",
    pendingWho: 'Bryan / Ashley — by 2026-09-05',
    note:
      'Our OSR work is a vague "OSR structured-data rebuild" Phase 2 ' +
      'track. Alltite has already designed this and is building it. ' +
      'Today, on both sides: site requirements (gate check-in, safety ' +
      'stand-downs, background checks, OSHA training) live in email and ' +
      "memory as ad hoc free-text notes; this build's osrStatus " +
      'ok/missing/expired is a status with nothing structured behind it. ' +
      'Their direction: OSRs at the ACCOUNT/LOCATION level with yes/no ' +
      'checkboxes producing an explicit safety clearance, shown to ' +
      'technicians as a work-order banner WITH A LAST-UPDATED DATE. That ' +
      'date is the detail worth stealing — a clearance with no age on it ' +
      'is how a two-year-old background check gets treated as current. ' +
      'Clock relevance stated honestly: this is safety and site access. ' +
      'It plausibly avoids wasted trips (a tech turned away at a gate is ' +
      'a lost day) but nobody has counted those, so that is an ' +
      'assumption, not a measure.',
    source:
      '03-scheduling-dispatch-workflow.md (Safety / site-specific requirements), reviewed 2026-08-19',
  },
  {
    id: 'N22',
    title:
      'No audit trail of report parameters — and a month of schedule starts from one report',
    area: 'Technical/Architecture',
    endUserScope: ['All'],
    stakeholderQuestion:
      'Should saved/run report parameters be recorded, so a scheduler can prove which date range they actually pulled?',
    pendingWho: 'Tim / Bryan — by 2026-09-05',
    note:
      'Small-sounding, but look where it sits. A month of schedule ' +
      'building is triggered by running a saved report filtered by ' +
      'month/quarter over on-site work orders due — not by any automated ' +
      'or event-driven signal. Torqueware records no report parameters ' +
      "and has no safeguard against getting the range wrong; Dan's own " +
      'example was forgetting November has 30 days. A missed range means ' +
      'missed jobs nobody knows are missing, and the only evidence is a ' +
      'gap on a calendar weeks later. Recording run parameters is a log ' +
      'line, not a feature. The real question underneath is whether the ' +
      'report is being rebuilt at all or replaced by an event-driven ' +
      'trigger — answer that before building either version.',
    source:
      '03-scheduling-dispatch-workflow.md (Forward-looking scheduling cadence), reviewed 2026-08-19',
  },
];
