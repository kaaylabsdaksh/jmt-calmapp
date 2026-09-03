/** Mock data + shared types for the Standards module (prototype only). */

export type StandardState = "Active" | "Inactive";

export interface WorkOrderHistoryRecord {
  workOrderNo: string;
  certificationDate: string;
  completionDate: string;
  recalibrationDate: string;
  conditionIn: string;
  conditionOut: string;
  repairComments: string;
}

export interface MaintenanceCheck {
  id: string;
  checkType: string;
  frequency: string;
  lastCompleted: string;
  nextDue: string;
  assignedTo: string;
  status: "Scheduled" | "Due Soon" | "Overdue" | "Completed";
  notes: string;
}

export interface Accessory {
  id: string;
  accessory: string;
  type: string;
  color: string;
  quantity: number;
  material: string;
}

export interface StandardComment {
  id: string;
  type: string;
  entered: string;
  user: string;
  comment: string;
}

export interface StandardRecord {
  id: string;
  standardNo: string;
  manufacturer: string;
  model: string;
  serial: string;
  description: string;
  lastCalibration: string;
  nextCalibrationDue: string;
  interval: number;
  unit: string;
  state: StandardState;
  accredited17025: boolean;
  labCode: string;
  calibrationLocation: string;
  owningAccount: string;
  rfid: string;
  accuracy: string;
  ranges: string;
  options: string;
  noRfid: boolean;
  toFactory: boolean;
  allowAccreditedCert: boolean;
  assignedStandard: string;
  assignedProcedure: string;
  technicianInstructions: string;
  addToSchedule: boolean;
  scheduleWeeks: number[];
  lab: string;
  division: string;
  labArea: string;
  providerLocation: string;
  providerDivision: string;
  noOnsiteUse: boolean;
  traceCode: string;
  purchaseOrder: string;
  purchaseDate: string;
  acquiredFrom: string;
  condition: string;
  usedFor: string;
  glAccount: string;
  purchaseCost: string;
  replacementCost: string;
  orderedDate: string;
  orderedBy: string;
  dateReceived: string;
  consumable: boolean;
  hasSoftwareTools: boolean;
  toolLinks: string[];
  accessories: Accessory[];
  comments: StandardComment[];
  maintenance: MaintenanceCheck[];
  history: WorkOrderHistoryRecord[];
}

export const MANUFACTURERS = ["FLUKE", "DRUCK", "HART", "AMETEK", "MITUTOYO", "AGILENT"];
export const MODELS = ["789", "787", "754", "DPI 620", "375", "JOFRA ATC-140", "34401A"];
export const LOCATIONS = ["Clute", "Baton Rouge", "Houston", "Deer Park", "Lake Charles"];
export const LAB_CODES = ["M", "E", "P", "T"];
export const DIVISIONS = ["Electrical", "Mechanical", "Pressure", "Temperature"];
export const LAB_AREAS = ["Bench 1", "Bench 2", "Bench 3", "Field Kit"];
export const TRACE_CODES = ["NIST-01", "NIST-02", "A2LA-11", "INTERNAL"];
export const INTERVAL_UNITS = ["M", "D", "W", "Y"];
export const COMMENT_TYPES = ["General", "Calibration", "Repair", "Movement"];
export const ACCESSORY_TYPES = ["Cable", "Case", "Probe", "Adapter", "Manual"];
export const CHECK_TYPES = ["Interim Check", "Preventive Maintenance", "Battery Check", "Functional Verification"];

const baseHistory: WorkOrderHistoryRecord[] = [
  {
    workOrderNo: "150825-009",
    certificationDate: "09/05/2013",
    completionDate: "09/06/2013",
    recalibrationDate: "09/30/2014",
    conditionIn: "In Tolerance",
    conditionOut: "No Adjustments",
    repairComments:
      "Received with battery voltage @ 1.441 volts each, replaced batteries. Passed calibration verification and cleaned.",
  },
  {
    workOrderNo: "173250-007",
    certificationDate: "09/22/2014",
    completionDate: "09/24/2014",
    recalibrationDate: "09/30/2015",
    conditionIn: "In Tolerance",
    conditionOut: "No Adjustments",
    repairComments: "Calibrated and certified.",
  },
  {
    workOrderNo: "195340-014",
    certificationDate: "10/05/2015",
    completionDate: "10/07/2015",
    recalibrationDate: "09/30/2016",
    conditionIn: "In Tolerance",
    conditionOut: "No Adjustments",
    repairComments: "Calibrated and certified.",
  },
  {
    workOrderNo: "214880-002",
    certificationDate: "09/28/2016",
    completionDate: "09/30/2016",
    recalibrationDate: "09/30/2017",
    conditionIn: "Out of Tolerance",
    conditionOut: "Adjusted",
    repairComments: "mA output adjusted to within specification. Certified.",
  },
  {
    workOrderNo: "238190-011",
    certificationDate: "09/14/2017",
    completionDate: "09/18/2017",
    recalibrationDate: "09/30/2018",
    conditionIn: "In Tolerance",
    conditionOut: "No Adjustments",
    repairComments: "Calibrated and certified.",
  },
];

const baseMaintenance: MaintenanceCheck[] = [
  {
    id: "m1",
    checkType: "Interim Check",
    frequency: "Quarterly",
    lastCompleted: "06/15/2026",
    nextDue: "09/15/2026",
    assignedTo: "J. Alvarez",
    status: "Due Soon",
    notes: "Verify mA source against reference DMM.",
  },
  {
    id: "m2",
    checkType: "Battery Check",
    frequency: "Monthly",
    lastCompleted: "08/28/2026",
    nextDue: "09/28/2026",
    assignedTo: "R. Guidry",
    status: "Scheduled",
    notes: "",
  },
  {
    id: "m3",
    checkType: "Preventive Maintenance",
    frequency: "Annual",
    lastCompleted: "02/10/2026",
    nextDue: "07/30/2026",
    assignedTo: "T. Nguyen",
    status: "Overdue",
    notes: "Clean leads and inspect case seals.",
  },
];

interface Seed {
  standardNo: string;
  serial: string;
  last: string;
  next: string;
  accredited: boolean;
  location: string;
  account: string;
  state?: StandardState;
}

const seeds: Seed[] = [
  { standardNo: "1832", serial: "88680003", last: "09/07/2024", next: "09/30/2025", accredited: true, location: "Clute", account: "0152.12" },
  { standardNo: "2522", serial: "33640010", last: "01/10/2025", next: "01/31/2026", accredited: false, location: "Baton Rouge", account: "0152.00" },
  { standardNo: "2719", serial: "35290058", last: "10/30/2024", next: "11/30/2025", accredited: true, location: "Clute", account: "0152.17" },
  { standardNo: "4263", serial: "56200139", last: "03/01/2025", next: "03/31/2026", accredited: true, location: "Clute", account: "0152.17" },
  { standardNo: "4355", serial: "17760114", last: "08/14/2024", next: "08/31/2025", accredited: false, location: "Baton Rouge", account: "0152.00" },
  { standardNo: "4920", serial: "88550015", last: "05/17/2025", next: "05/31/2026", accredited: true, location: "Clute", account: "0152.17" },
  { standardNo: "4983", serial: "66640058", last: "11/01/2024", next: "11/30/2025", accredited: true, location: "Baton Rouge", account: "0152.40" },
  { standardNo: "4984", serial: "66640054", last: "11/01/2024", next: "11/30/2025", accredited: true, location: "Baton Rouge", account: "0152.47" },
  { standardNo: "5011", serial: "77120044", last: "07/01/2026", next: "09/20/2026", accredited: true, location: "Houston", account: "0152.21" },
  { standardNo: "5044", serial: "77120088", last: "09/12/2025", next: "09/12/2026", accredited: false, location: "Deer Park", account: "0152.09", state: "Inactive" },
  { standardNo: "5120", serial: "91220011", last: "02/02/2026", next: "02/28/2027", accredited: true, location: "Lake Charles", account: "0152.33" },
  { standardNo: "5188", serial: "91220077", last: "04/19/2026", next: "10/19/2026", accredited: false, location: "Houston", account: "0152.05" },
];

const build = (s: Seed, i: number): StandardRecord => ({
  id: s.standardNo,
  standardNo: s.standardNo,
  manufacturer: "FLUKE",
  model: "789",
  serial: s.serial,
  description: "PROCESSMETER",
  lastCalibration: s.last,
  nextCalibrationDue: s.next,
  interval: 12,
  unit: "M",
  state: s.state ?? "Active",
  accredited17025: s.accredited,
  labCode: "M",
  calibrationLocation: s.location,
  owningAccount: s.account,
  rfid: i % 3 === 0 ? "" : `e0040150967${1000 + i}`,
  accuracy: "±0.05% + 2 counts",
  ranges: "0–30 V DC, 0–24 mA",
  options: "",
  noRfid: i % 3 === 0,
  toFactory: false,
  allowAccreditedCert: s.accredited,
  assignedStandard: "",
  assignedProcedure: "CP-789-REV-C",
  technicianInstructions: "",
  addToSchedule: i % 2 === 0,
  scheduleWeeks: i % 2 === 0 ? [4, 17, 30, 43] : [],
  lab: s.location,
  division: "Electrical",
  labArea: "Bench 1",
  providerLocation: s.location,
  providerDivision: "Electrical",
  noOnsiteUse: false,
  traceCode: "NIST-01",
  purchaseOrder: `PO-${20450 + i}`,
  purchaseDate: "03/14/2019",
  acquiredFrom: "Transcat",
  condition: "New",
  usedFor: "Field calibration",
  glAccount: "1450-000",
  purchaseCost: "1,240.00",
  replacementCost: "1,595.00",
  orderedDate: "02/28/2019",
  orderedBy: "A. Chen",
  dateReceived: "03/20/2019",
  consumable: false,
  hasSoftwareTools: false,
  toolLinks: ["", "", "", "", ""],
  accessories: [
    { id: `a-${s.standardNo}-1`, accessory: "Test Lead Set", type: "Cable", color: "Black", quantity: 1, material: "Silicone" },
    { id: `a-${s.standardNo}-2`, accessory: "Soft Carry Case", type: "Case", color: "Yellow", quantity: 1, material: "Nylon" },
  ],
  comments: [
    {
      id: `c-${s.standardNo}-1`,
      type: "Calibration",
      entered: "09/05/2025",
      user: "J. Alvarez",
      comment: "Returned from annual calibration, within tolerance.",
    },
    {
      id: `c-${s.standardNo}-2`,
      type: "General",
      entered: "04/22/2025",
      user: "R. Guidry",
      comment: "Assigned to field kit for turnaround support.",
    },
  ],
  maintenance: baseMaintenance.map((m) => ({ ...m, id: `${s.standardNo}-${m.id}` })),
  history: baseHistory,
});

export const STANDARDS: StandardRecord[] = seeds.map(build);

export const emptyStandard = (): StandardRecord => ({
  ...build({ standardNo: "", serial: "", last: "", next: "", accredited: false, location: "", account: "" }, 1),
  id: "new",
  manufacturer: "",
  model: "",
  description: "",
  interval: 12,
  rfid: "",
  noRfid: false,
  accuracy: "",
  ranges: "",
  assignedProcedure: "",
  purchaseOrder: "",
  purchaseDate: "",
  acquiredFrom: "",
  condition: "",
  usedFor: "",
  glAccount: "",
  purchaseCost: "",
  replacementCost: "",
  orderedDate: "",
  orderedBy: "",
  dateReceived: "",
  addToSchedule: false,
  scheduleWeeks: [],
  lab: "",
  division: "",
  labArea: "",
  providerLocation: "",
  providerDivision: "",
  traceCode: "",
  accessories: [],
  comments: [],
  maintenance: [],
  history: [],
});

const parse = (d: string) => {
  if (!d) return null;
  const [m, day, y] = d.split("/").map(Number);
  if (!m || !day || !y) return null;
  return new Date(y, m - 1, day);
};

export type CalStatus = "normal" | "due-soon" | "overdue";

export const calibrationStatus = (nextDue: string, today = new Date()): CalStatus => {
  const d = parse(nextDue);
  if (!d) return "normal";
  const days = Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return "overdue";
  if (days <= 45) return "due-soon";
  return "normal";
};
