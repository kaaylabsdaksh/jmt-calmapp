export type PmTemplateStatus = "Active" | "Pending Validation" | "Inactive";

export interface PmTemplateRevision {
  id: string;
  revision: number;
  document: string;
  description: string;
  validatedBy: string;
  validatedDate: string;
  reason: string;
}

export interface PmTemplateRecord {
  id: string;
  status: PmTemplateStatus;
  document: string;
  description: string;
  revision: number;
  comments: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  validatedBy: string;
  validatedDate: string;
  replacementReason: string;
  linkedSchedules: number;
  revisions: PmTemplateRevision[];
}

const templateNames = [
  ["BR D-Code ID 1154 Interim Check.xlsx", "BR D-Code ID 1154 Interim Check"],
  ["BR D-Code ID 1189 Interim Check.xlsx", "BR D-Code ID 1189 Interim Check"],
  ["BR D-Code ID 1191 Interim Check.xlsx", "BR D-Code ID 1191 Interim Check"],
  ["BR H-Code ID 1839 Interim Check.xlsx", "BR H-Code ID 1839 Interim Check"],
  ["BR D-Code ID 1840 Interim Check.xlsx", "BR D-Code ID 1840 Interim Check"],
  ["BR E-Code ID 1188 Interim Check.xlsx", "BR E-Code ID 1188 Interim Check"],
  ["BR E-Code ID 1497 Interim Check.xlsx", "BR E-Code ID 1497 Interim Check"],
  ["BR E-Code ID 1712 Interim Check.xlsx", "BR E-Code ID 1712 Interim Check"],
  ["BR E-Code ID 1716 Interim Check.xlsx", "BR E-Code ID 1716 Interim Check"],
  ["BR E-Code ID 1727 Interim Check.xlsx", "BR E-Code ID 1727 Interim Check"],
  ["BR E-Code ID 1728 Interim Check.xlsx", "BR E-Code ID 1728 Interim Check"],
  ["BR H-Code ID 1198 Interim Check.xlsx", "BR H-Code ID 1198 Interim Check"],
  ["BR H-Code MFG ID 713 Interim Check.xlsx", "BR H-Code MFG ID 713 Interim Check"],
  ["BR H-Code MFG ID 1190 Interim Check.xlsx", "BR H-Code MFG ID 1190 Interim Check"],
  ["BR H-Code SHIP ID 2437 Interim Check.xlsx", "BR H-Code SHIP ID 2437 Interim Check"],
  ["BR H-Code ID 992 Interim Check.xlsx", "Scale / Balance 150 lb"],
  ["BR H-Code ID 377 Interim Check.xlsx", "Scale / Balance 31 kg"],
  ["OD H-Code ID 970 Interim Check.xlsx", "OD H-Code ID 970 Interim Check"],
  ["OD H-Code ID 1247 Interim Check.xlsx", "OD H-Code ID 1247 Interim Check"],
  ["OD H-Code ID 2084 Interim Check.xlsx", "OD H-Code ID 2084 Interim Check"],
] as const;

export const PM_TEMPLATE_RECORDS: PmTemplateRecord[] = templateNames.map(([document, description], index) => {
  const revision = index === 0 ? 5 : index < 15 ? 4 : index < 17 ? 3 : 1;
  const status: PmTemplateStatus = index === 5 ? "Pending Validation" : index === 17 ? "Inactive" : "Active";
  const validatedDate = status === "Pending Validation" ? "" : `01/${String(16 + Math.floor(index / 16) * 2).padStart(2, "0")}/2019 01:${String(23 + index).padStart(2, "0")} PM`;
  return {
    id: `template-${index + 1}`,
    status,
    document,
    description,
    revision,
    comments: index < 17 ? "Updated Spreadsheet with Pass/Fail." : "",
    createdBy: "Admin User",
    createdDate: "08/23/2018 11:19 AM",
    modifiedBy: status === "Pending Validation" ? "Admin User" : "Ken R. Frank",
    modifiedDate: status === "Pending Validation" ? "09/15/2026 04:24 AM" : validatedDate,
    validatedBy: status === "Pending Validation" ? "" : "Ken R. Frank",
    validatedDate,
    replacementReason: "",
    linkedSchedules: (index % 4) + 1,
    revisions: Array.from({ length: Math.min(revision, 4) }, (_, revisionIndex) => {
      const number = revision - revisionIndex;
      return {
        id: `template-${index + 1}-revision-${number}`,
        revision: number,
        document,
        description,
        validatedBy: "Ken R. Frank",
        validatedDate: revisionIndex === 0 ? validatedDate || "09/15/2026 04:24 AM" : `08/${String(29 - revisionIndex).padStart(2, "0")}/2018 0${7 - revisionIndex}:0${revisionIndex} AM`,
        reason: ["Updated Spreadsheet with Pass/Fail.", "Revised resolution formatting.", "Revised formatting.", "Unlocked data entry cells."][revisionIndex] ?? "Initial version.",
      };
    }),
  };
});
export interface PmTemplateSchedule {
  id: string;
  scheduleId: string;
  description: string;
  dueDate: string;
  standardsChecked: string;
  status: "Active" | "Completed";
  type: "IM" | "PM";
  frequency: string;
  document: string;
}

const pad = (value: number) => String(value).padStart(2, "0");
const monthEnd = (month: number, year: number) => {
  const days = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return `${pad(month)}/${pad(days[month - 1])}/${year}`;
};

export const buildTemplateSchedules = (template: PmTemplateRecord): PmTemplateSchedule[] => {
  const standard = template.document.match(/ID (\d+)/)?.[1] ?? "";
  const type: PmTemplateSchedule["type"] = template.description.toLowerCase().includes("interim") ? "IM" : "PM";
  const base = template.document.replace(/\.xlsx$/, "");
  const active: PmTemplateSchedule[] = [
    { year: 2026, scheduleId: "17003" },
    { year: 2025, scheduleId: "16172" },
    { year: 2024, scheduleId: "15542" },
  ].map(({ year, scheduleId }) => ({
    id: `${template.id}-active-${year}`,
    scheduleId,
    description: template.description,
    dueDate: `01/31/${year}`,
    standardsChecked: "",
    status: "Active" as const,
    type,
    frequency: "M",
    document: template.document,
  }));

  const completed: PmTemplateSchedule[] = Array.from({ length: 12 }, (_, index) => {
    const offset = 6 - index;
    const month = ((offset % 12) + 12) % 12 + 1;
    const year = offset >= 0 ? 2023 : 2022;
    return {
      id: `${template.id}-completed-${index}`,
      scheduleId: offset >= 0 ? "13186" : "8721",
      description: template.description,
      dueDate: monthEnd(month, year),
      standardsChecked: standard,
      status: "Completed" as const,
      type,
      frequency: "M",
      document: `${base}.${year}${pad(month)}${monthEnd(month, year).slice(3, 5)}.xlsx`,
    };
  });

  return [...active, ...completed];
};
