// Onsite Scheduling prototype — seed data + conflict helpers.
// Anchor date for the prototype (see journeys doc §3: "Today" means this date).
export const ANCHOR_DATE = "2026-08-11";

export type JobStatus = "Green" | "Yellow" | "Red" | "Completed" | "Cancelled";
export type OsrStatus = "ok" | "missing" | "expired";
export type NonServiceType = "PTO" | "Travel" | "Out of Service" | "Tentative";

export interface Technician {
  id: string;
  name: string;
  initials: string;
  location: string;
}

export interface ScheduledJob {
  id: string;
  projectNumber: string;
  customers: string[];
  accountNumber: string;
  location: string;
  division: string;
  status: JobStatus;
  osrStatus: OsrStatus;
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
  technicianIds: string[];
  notes?: string;
}

export interface NonServiceEntry {
  id: string;
  type: NonServiceType;
  startDate: string;
  endDate: string;
  technicianIds: string[];
  notes?: string;
}

export interface UnscheduledWorkItem {
  id: string;
  customer: string;
  accountNumber: string;
  targetWindowStart: string;
  targetWindowEnd: string;
  salesRepCode: string;
  notes?: string;
}

export const JOB_STATUS_STYLES: Record<JobStatus, string> = {
  Green: "bg-emerald-100 text-emerald-900 border-emerald-300",
  Yellow: "bg-amber-100 text-amber-900 border-amber-300",
  Red: "bg-red-100 text-red-900 border-red-300",
  Completed: "bg-slate-100 text-slate-500 border-slate-300 line-through",
  Cancelled: "bg-slate-100 text-slate-400 border-slate-200 line-through opacity-70",
};

export const NON_SERVICE_STYLES: Record<NonServiceType, string> = {
  PTO: "border-dashed border-violet-400 bg-violet-50 text-violet-800",
  Travel: "border-dashed border-sky-400 bg-sky-50 text-sky-800",
  "Out of Service": "border-dashed border-rose-400 bg-rose-50 text-rose-800",
  Tentative: "border-dashed border-slate-400 bg-slate-50 text-slate-700",
};

export const NON_SERVICE_TYPES: NonServiceType[] = ["PTO", "Travel", "Out of Service", "Tentative"];

export const seedTechnicians: Technician[] = [
  { id: "tech-1", name: "Christian B. ONeal", initials: "CO", location: "Baton Rouge" },
  { id: "tech-2", name: "Jerome J. Davis", initials: "JD", location: "Baton Rouge" },
  { id: "tech-3", name: "Vincent E. Lloyde", initials: "VL", location: "Houston" },
  { id: "tech-4", name: "Lucas M. Roberts", initials: "LR", location: "Houston" },
  { id: "tech-5", name: "Ashley Trahan", initials: "AT", location: "Canada" },
  { id: "tech-6", name: "Bryan Guidry", initials: "BG", location: "Canada" },
];

export const seedJobs: ScheduledJob[] = [
  { id: "job-1", projectNumber: "PJ-10234", customers: ["Entergy Mississippi LLC"], accountNumber: "0185.12", location: "Baton Rouge", division: "Calibration", status: "Green", osrStatus: "ok", startDate: "2026-08-03", endDate: "2026-08-05", technicianIds: ["tech-1"], notes: "Annual substation cal." },
  { id: "job-2", projectNumber: "PJ-10235", customers: ["Shintech"], accountNumber: "1790.00", location: "Baton Rouge", division: "Field Service", status: "Yellow", osrStatus: "expired", startDate: "2026-08-05", endDate: "2026-08-07", technicianIds: ["tech-2"] },
  { id: "job-3", projectNumber: "PJ-10236", customers: ["Pinnacle Polymers"], accountNumber: "4051.00", location: "Baton Rouge", division: "Calibration", status: "Green", osrStatus: "ok", startDate: "2026-08-12", endDate: "2026-08-14", technicianIds: ["tech-2"] },
  { id: "job-4", projectNumber: "PJ-10237", customers: ["Occidental Chem"], accountNumber: "0367.00", location: "Houston", division: "Repair", status: "Yellow", osrStatus: "missing", startDate: "2026-08-10", endDate: "2026-08-20", technicianIds: ["tech-3", "tech-4"], notes: "10-day span, stays inside August." },
  { id: "job-5", projectNumber: "PJ-10238", customers: ["Wolseley Industrial"], accountNumber: "6941.00", location: "Houston", division: "Calibration", status: "Green", osrStatus: "ok", startDate: "2026-08-17", endDate: "2026-08-18", technicianIds: ["tech-4"] },
  { id: "job-6", projectNumber: "PJ-10239", customers: ["John Deere"], accountNumber: "2588.00", location: "Baton Rouge", division: "Calibration", status: "Red", osrStatus: "missing", startDate: "2026-08-24", endDate: "2026-08-26", technicianIds: ["tech-1"] },
  { id: "job-7", projectNumber: "PJ-10240", customers: ["Sabal Trail Transmission LLC"], accountNumber: "10323.00", location: "Baton Rouge", division: "Field Service", status: "Completed", osrStatus: "ok", startDate: "2026-08-04", endDate: "2026-08-06", technicianIds: ["tech-2"] },
  { id: "job-8", projectNumber: "PJ-10241", customers: ["Marathon Petro Elect"], accountNumber: "0364.03", location: "Houston", division: "Repair", status: "Cancelled", osrStatus: "missing", startDate: "2026-08-19", endDate: "2026-08-21", technicianIds: ["tech-3"] },
  { id: "job-15", projectNumber: "PJ-10248", customers: ["Cheniere Sabine Pass"], accountNumber: "3098.00", location: "Baton Rouge", division: "Field Service", status: "Green", osrStatus: "ok", startDate: "2026-08-28", endDate: "2026-09-03", technicianIds: ["tech-1"], notes: "Spans the Aug→Sept month seam." },
  { id: "job-16", projectNumber: "PJ-10249", customers: ["LA Integrated PE JV LLC"], accountNumber: "2343.07", location: "Baton Rouge", division: "Calibration", status: "Red", osrStatus: "missing", startDate: "2026-08-18", endDate: "2026-08-19", technicianIds: [], notes: "Zero technicians assigned — use Reassign in Quick View." },
  { id: "job-17", projectNumber: "PJ-10250", customers: ["Marathon Petro Inst", "Marathon Petro Elect", "Zachry Industrial Inc"], accountNumber: "0364.10", location: "Houston", division: "Repair", status: "Yellow", osrStatus: "expired", startDate: "2026-08-11", endDate: "2026-08-13", technicianIds: ["tech-3", "tech-4", "tech-1"], notes: "Three customers, three technicians." },
  { id: "job-18", projectNumber: "PJ-10251", customers: ["Dow Chemical"], accountNumber: "5510.00", location: "Baton Rouge", division: "Calibration", status: "Green", osrStatus: "ok", startDate: "2026-08-12", endDate: "2026-08-13", technicianIds: ["tech-1"] },
  { id: "job-19", projectNumber: "PJ-10252", customers: ["Hydro One"], accountNumber: "CA-1102", location: "Canada", division: "Field Service", status: "Cancelled", osrStatus: "ok", startDate: "2026-08-12", endDate: "2026-08-14", technicianIds: ["tech-5"], notes: "Cancelled — must never raise a conflict." },
  { id: "job-20", projectNumber: "PJ-10253", customers: ["Suncor Energy", "Enbridge"], accountNumber: "CA-1147", location: "Canada", division: "Calibration", status: "Green", osrStatus: "ok", startDate: "2026-08-12", endDate: "2026-08-13", technicianIds: ["tech-5"] },
  { id: "job-21", projectNumber: "PJ-10254", customers: ["TransAlta"], accountNumber: "CA-1180", location: "Canada", division: "Field Service", status: "Yellow", osrStatus: "missing", startDate: "2026-08-13", endDate: "2026-08-14", technicianIds: ["tech-6"] },
];

export const seedNonServiceEntries: NonServiceEntry[] = [
  { id: "ns-1", type: "PTO", startDate: "2026-08-12", endDate: "2026-08-14", technicianIds: ["tech-2"], notes: "Approved vacation." },
  { id: "ns-4", type: "Tentative", startDate: "2026-08-20", endDate: "2026-08-21", technicianIds: ["tech-4"], notes: "Holding for possible Houston add-on." },
  { id: "ns-9", type: "Travel", startDate: "2026-08-17", endDate: "2026-08-18", technicianIds: ["tech-4"], notes: "Drive day to Houston." },
  { id: "ns-10", type: "Out of Service", startDate: "2026-08-24", endDate: "2026-08-25", technicianIds: ["tech-1"], notes: "Van 1 in the shop." },
  { id: "ns-11", type: "Tentative", startDate: "2026-08-13", endDate: "2026-08-13", technicianIds: ["tech-2"] },
  { id: "ns-12", type: "Out of Service", startDate: "2026-08-30", endDate: "2026-09-02", technicianIds: ["tech-6"], notes: "Equipment recert." },
  { id: "ns-13", type: "PTO", startDate: "2026-08-26", endDate: "2026-08-27", technicianIds: ["tech-5"] },
];

export const seedUnscheduledWork: UnscheduledWorkItem[] = [
  { id: "uw-1", customer: "Entergy Louisiana", accountNumber: "0185.20", targetWindowStart: "2026-09-07", targetWindowEnd: "2026-09-11", salesRepCode: "CBO", notes: "Quoted 7/28, awaiting PO number." },
  { id: "uw-2", customer: "Shell Norco", accountNumber: "2210.00", targetWindowStart: "2026-08-24", targetWindowEnd: "2026-08-28", salesRepCode: "JJD" },
  { id: "uw-3", customer: "Hydro One", accountNumber: "CA-1102", targetWindowStart: "2026-09-14", targetWindowEnd: "2026-09-18", salesRepCode: "AT", notes: "Canada — confirm border paperwork." },
  { id: "uw-4", customer: "Phillips 66", accountNumber: "3311.02", targetWindowStart: "2026-09-01", targetWindowEnd: "2026-09-04", salesRepCode: "VEL" },
  { id: "uw-5", customer: "BASF Geismar", accountNumber: "4410.00", targetWindowStart: "2026-08-31", targetWindowEnd: "2026-09-02", salesRepCode: "LMR" },
  { id: "uw-6", customer: "Nucor Steel", accountNumber: "5120.03", targetWindowStart: "2026-09-21", targetWindowEnd: "2026-09-25", salesRepCode: "CBO" },
  { id: "uw-7", customer: "Cleco Power", accountNumber: "0660.01", targetWindowStart: "2026-09-08", targetWindowEnd: "2026-09-10", salesRepCode: "JJD" },
  { id: "uw-8", customer: "ExxonMobil Baton Rouge", accountNumber: "0101.00", targetWindowStart: "2026-07-06", targetWindowEnd: "2026-07-10", salesRepCode: "VEL", notes: "Target window is fully in the past." },
  { id: "uw-9", customer: "Air Products", accountNumber: "7702.00", targetWindowStart: "2026-09-15", targetWindowEnd: "2026-09-15", salesRepCode: "LMR", notes: "Single-day window." },
  { id: "uw-10", customer: "Westlake Chemical", accountNumber: "6033.05", targetWindowStart: "2026-09-28", targetWindowEnd: "2026-10-02", salesRepCode: "CBO", notes: "Customer requires site-specific safety orientation the morning of day one, badge photos submitted 5 business days ahead, and all standards recertified within 90 days of arrival — coordinate with their EHS contact before locking dates." },
  { id: "uw-11", customer: "Suncor Energy", accountNumber: "CA-1147", targetWindowStart: "2026-09-09", targetWindowEnd: "2026-09-11", salesRepCode: "BG", notes: "Tight 3-day window." },
];

/* ---------- date helpers (yyyy-MM-dd, no timezone drift) ---------- */

export const parseISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const rangesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
  aStart <= bEnd && bStart <= aEnd;

export interface TechnicianConflict {
  technicianId: string;
  label: string;
  range: string;
}

export const formatShort = (iso: string) =>
  parseISO(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/**
 * Conflicts for a set of technicians over a date range.
 * Cancelled jobs never count as a conflict source (see journeys doc §7).
 */
export const getTechnicianConflicts = (
  technicianIds: string[],
  startDate: string,
  endDate: string,
  jobs: ScheduledJob[],
  entries: NonServiceEntry[],
  opts: { excludeJobId?: string; excludeEntryId?: string } = {},
): TechnicianConflict[] => {
  if (!startDate || !endDate) return [];
  const out: TechnicianConflict[] = [];
  for (const techId of technicianIds) {
    for (const job of jobs) {
      if (job.id === opts.excludeJobId) continue;
      if (job.status === "Cancelled") continue;
      if (!job.technicianIds.includes(techId)) continue;
      if (rangesOverlap(startDate, endDate, job.startDate, job.endDate)) {
        out.push({
          technicianId: techId,
          label: job.projectNumber,
          range: `${formatShort(job.startDate)} – ${formatShort(job.endDate)}`,
        });
      }
    }
    for (const entry of entries) {
      if (entry.id === opts.excludeEntryId) continue;
      if (!entry.technicianIds.includes(techId)) continue;
      if (rangesOverlap(startDate, endDate, entry.startDate, entry.endDate)) {
        out.push({
          technicianId: techId,
          label: entry.type,
          range: `${formatShort(entry.startDate)} – ${formatShort(entry.endDate)}`,
        });
      }
    }
  }
  return out;
};

/** Does this job have a double-booked technician? (Cancelled jobs are never flagged.) */
export const jobHasTechnicianConflict = (
  job: ScheduledJob,
  jobs: ScheduledJob[],
  entries: NonServiceEntry[],
) => {
  if (job.status === "Cancelled") return false;
  return (
    getTechnicianConflicts(job.technicianIds, job.startDate, job.endDate, jobs, entries, {
      excludeJobId: job.id,
    }).length > 0
  );
};
