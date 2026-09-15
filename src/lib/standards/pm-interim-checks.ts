import { STANDARDS } from "@/lib/standards/data";

export type PmScheduleStatus = "Active" | "Completed";
export type PmScheduleType = "IM" | "PM";
export type PmResult = "Pass" | "Not Performed" | "";

export interface PmHistoryEntry {
  id: string;
  dueDate: string;
  completedDate: string;
  completedBy: string;
  standardsChecked: string;
  result: PmResult;
  documentTool: string;
  comments: string;
}

export interface PmSchedule {
  id: string;
  dueDate: string;
  terminalDate: string;
  account: string;
  type: PmScheduleType;
  status: PmScheduleStatus;
  lastResult: PmResult;
  frequency: string;
  division: string;
  labCodes: string;
  station: string;
  documentTool: string;
  standards: string[];
  location: string;
  templateDescription: string;
  completedUser: string;
  histories: PmHistoryEntry[];
}

const stationNames = [
  "CL Process J - DTT ID# 2612",
  "BR Process P - PRT ID# 3936",
  "CL Process J - DTT ID# 2963",
  "BR Station GQ-03",
  "BR OS Process C - UMM ID# 2739",
  "BR Station N-01 - 5500 / 3458",
  "BR Process F-DPC 02",
  "BR Process F-DPC 04",
  "BR Process F-DPC 03",
  "BR Process F-DPC 08",
  "BR Process F-DPC 09",
  "BR Process F-DPC 07",
  "BR Process C - SMM ID# 3208",
  "MT OS Process J - DTT ID# 3358",
  "MT Process J - DTT ID# 2936",
  "MT Process J - DTT ID# 2953",
  "OD Station 55xx 3458 (PM)",
  "MT Station ES - Washer ID# 3706",
];

const tools = [
  "External File",
  "PRT Interim Check - 0 deg C.xlsx",
  "CL J-Code INT Checks.xlsx",
  "External File",
  "BR C-Code Universal Measuring Machine ID 2739 Interim Check.xlsx",
  "External File",
  "External File",
  "External File",
  "External File",
  "rptRejectSheet.pdf",
  "External File",
  "BR DPC Interim Checks.xlsx",
  "BR C-Code SMM Supermic ID 3208 Interim Check.xlsx",
  "MT J-Code INT Checks.xlsx",
  "MT J-Code INT Checks.xlsx",
  "MT J-Code INT Checks.xlsx",
  "55xx 3458 PM Checks.xlsx",
  "Washer and Dryer PM.xlsx",
];

const accounts = ["0152.12", "0152.00", "0152.12", "0152.00", "0152.05", "0152.00", "0152.00", "0152.00", "0152.00", "0152.00", "0152.00", "0152.00", "0152.00", "0152.21", "0152.19", "0152.19", "0152.04", "0152.19"];
const labCodes = ["J", "P", "J", "G Q", "C", "N", "F", "F", "F", "F", "F", "F", "C", "J", "J", "J", "G M", "ES"];
const frequencies = ["D", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M", "M"];

export const PM_SCHEDULES: PmSchedule[] = Array.from({ length: 28 }, (_, index) => {
  const source = STANDARDS[index % STANDARDS.length];
  const completed = index >= 18 || index % 9 === 7;
  const id = String(completed ? 16203 - index * 317 : 17056 + index);
  const standardNo = source.standardNo;
  const dueYear = completed ? 2025 - (index % 4) : 2026;
  const dueMonth = completed ? ((index * 2) % 12) + 1 : index === 0 ? 9 : 1;
  const dueDate = `${String(dueMonth).padStart(2, "0")}/${index === 0 ? "30" : "31"}/${dueYear}`;
  const documentTool = tools[index % tools.length];
  const completedDate = completed ? `${String(((index + 1) % 12) + 1).padStart(2, "0")}/15/${dueYear}` : "";
  const result: PmResult = completed ? (index % 4 === 0 ? "Not Performed" : "Pass") : "";
  return {
    id,
    dueDate,
    terminalDate: index === 0 ? "10/31/2026" : `0${((index + 5) % 9) + 1}/30/2023`,
    account: accounts[index % accounts.length],
    type: index % 6 === 4 ? "PM" : "IM",
    status: completed ? "Completed" : "Active",
    lastResult: result,
    frequency: frequencies[index % frequencies.length],
    division: index % 7 === 4 ? "OnSite" : index % 10 === 7 ? "ESL" : "Lab",
    labCodes: labCodes[index % labCodes.length],
    station: stationNames[index % stationNames.length],
    documentTool,
    standards: index % 5 === 3 ? [standardNo, STANDARDS[(index + 1) % STANDARDS.length].standardNo] : [standardNo],
    location: source.calibrationLocation,
    templateDescription: source.maintenance[index % source.maintenance.length]?.checkType ?? "Interim Check",
    completedUser: completed ? ["J. Alvarez", "R. Guidry", "T. Nguyen"][index % 3] : "",
    histories: completed
      ? [{ id: `${id}-1`, dueDate, completedDate, completedBy: ["J. Alvarez", "R. Guidry", "T. Nguyen"][index % 3], standardsChecked: standardNo, result, documentTool, comments: result === "Not Performed" ? "Equipment unavailable during scheduled window." : "Completed within tolerance." }]
      : index % 4 === 0
        ? [{ id: `${id}-old`, dueDate: "01/31/2025", completedDate: "02/02/2025", completedBy: "J. Alvarez", standardsChecked: standardNo, result: "Pass", documentTool, comments: "Previous cycle completed." }]
        : [],
  };
});

export const PM_STATIONS = [...new Set(PM_SCHEDULES.map((row) => row.station))];
export const PM_TEMPLATES = ["Interim Check", "Preventive Maintenance", "Battery Check", "Functional Verification"];
