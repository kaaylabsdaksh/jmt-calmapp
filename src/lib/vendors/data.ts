export type YesNo = "Yes" | "No";

export interface VendorRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  originalApprovalDate: string; // MM/DD/YYYY
  criticality: string;
  iso9001: YesNo;
  qf133: YesNo;
  oem: YesNo;
  qf131: YesNo;
  qualificationBasedOn: string;
  z540: YesNo;
  comments: string;
  status: "Active" | "Inactive" | "Pending";
  approvalExpires: string; // MM/DD/YYYY
}

export const STATES = [
  "AL", "AR", "AZ", "CA", "CO", "FL", "GA", "IL", "IN", "KS", "KY", "LA",
  "MA", "MI", "MN", "MO", "MS", "NC", "NJ", "NY", "OH", "OK", "PA", "SC",
  "TN", "TX", "UT", "VA", "WA", "WI",
];

export const CRITICALITY = ["Critical", "Major", "Minor", "Non-Critical"];

export const QUALIFICATION_BASIS = [
  "ISO 9001 Certificate",
  "ISO/IEC 17025 Accreditation",
  "ANSI/NCSL Z540.1",
  "OEM Authorization",
  "On-Site Audit",
  "Survey (QF131)",
  "Historical Performance",
];

export const VENDOR_STATUS: VendorRecord["status"][] = ["Active", "Inactive", "Pending"];

const NAME_A = [
  "Precision", "Apex", "Gulf Coast", "Northstar", "Delta", "Summit", "Cardinal",
  "Vertex", "Ironwood", "Blue Ridge", "Meridian", "Sterling", "Pinnacle", "Lakeside",
  "Frontier", "Keystone", "Bayou", "Redwood", "Granite", "Harbor",
];
const NAME_B = [
  "Calibration", "Metrology", "Instrument", "Test", "Electrical", "Pressure",
  "Torque", "Dimensional", "Thermal", "Flow", "Analytical", "Service",
];
const NAME_C = ["Labs", "Services", "Systems", "Technologies", "Group", "Solutions", "Company", "Industries"];

const CITY_BY_STATE: Record<string, string[]> = {
  TX: ["Houston", "Odessa", "Clute", "Port Arthur", "Groves", "Dallas", "Beaumont"],
  LA: ["Baton Rouge", "Lake Charles", "Shreveport", "New Orleans"],
  CA: ["Anaheim", "Fresno", "San Diego", "Sacramento"],
  OH: ["Cleveland", "Columbus", "Dayton"],
  PA: ["Pittsburgh", "Erie", "Allentown"],
};
const DEFAULT_CITIES = ["Springfield", "Fairview", "Riverside", "Georgetown", "Clinton", "Madison"];

const STREETS = ["Industrial Blvd", "Commerce Dr", "Technology Pkwy", "Refinery Rd", "Main St", "Airport Way", "Foundry Ln"];

const COMMENTS = [
  "Approved for pressure and temperature calibration only. Annual survey on file.",
  "",
  "Vendor supplies OEM repair for gas detection instrumentation; scope limited to manufacturer models.",
  "Audit findings from last review closed on schedule. No open corrective actions.",
  "Requires purchase order approval from quality manager prior to release of critical work.",
  "",
  "Accreditation certificate must be re-verified at each renewal; scope excludes electrical high voltage.",
];

// Small deterministic PRNG so the dataset is stable between renders/sessions.
const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
const pick = <T,>(arr: T[], seed: number) => arr[Math.floor(rand(seed) * arr.length) % arr.length];

const fmt = (d: Date) =>
  `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;

const buildVendor = (i: number): VendorRecord => {
  const state = pick(STATES, i * 3.1 + 1);
  const cities = CITY_BY_STATE[state] ?? DEFAULT_CITIES;
  const approvalYear = 2016 + Math.floor(rand(i * 7.7) * 8);
  const approval = new Date(approvalYear, Math.floor(rand(i * 2.3) * 12), 1 + Math.floor(rand(i * 5.5) * 27));
  // Expiration between ~14 months before and ~30 months after today.
  const expires = new Date(approval);
  expires.setFullYear(expires.getFullYear() + 1 + Math.floor(rand(i * 9.9) * 9));

  const yesNo = (s: number): YesNo => (rand(i * s) > 0.35 ? "Yes" : "No");

  return {
    id: `V${String(10000 + i).padStart(5, "0")}`,
    name: `${pick(NAME_A, i * 1.7)} ${pick(NAME_B, i * 4.2)} ${pick(NAME_C, i * 6.4)}`,
    address: `${100 + Math.floor(rand(i * 8.1) * 8900)} ${pick(STREETS, i * 3.7)}`,
    city: pick(cities, i * 2.9),
    state,
    zip: String(10000 + Math.floor(rand(i * 4.4) * 89999)),
    originalApprovalDate: fmt(approval),
    criticality: pick(CRITICALITY, i * 5.1),
    iso9001: yesNo(1.3),
    qf133: yesNo(2.1),
    oem: yesNo(3.3),
    qf131: yesNo(4.9),
    qualificationBasedOn: pick(QUALIFICATION_BASIS, i * 6.9),
    z540: yesNo(6.1),
    comments: pick(COMMENTS, i * 7.3),
    status: rand(i * 8.8) > 0.18 ? "Active" : rand(i * 9.4) > 0.5 ? "Inactive" : "Pending",
    approvalExpires: fmt(expires),
  };
};

export const VENDORS: VendorRecord[] = Array.from({ length: 1059 }, (_, i) => buildVendor(i + 1));

export type ExpiryState = "expired" | "expiring" | "ok";

export const expiryState = (value: string): ExpiryState => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "ok";
  const days = (d.getTime() - Date.now()) / 86_400_000;
  if (days < 0) return "expired";
  if (days <= 90) return "expiring";
  return "ok";
};
