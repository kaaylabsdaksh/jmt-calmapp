export type InventoryTemplateStatus = "Validated" | "Not Validated" | "Inactive";

export interface InventoryTemplateValidation {
  validatedBy: string;
  date: string;
  status: "PASS" | "FAIL";
  workOrder: string;
  manufacturer: string;
  model: string;
  comments: string;
}

export interface InventoryTemplateRecord {
  id: string;
  name: string;
  status: InventoryTemplateStatus;
  jmtNumber: string;
  labCode: string;
  approvedBy: string;
  approvedDate: string;
  version: number;
  comments: string;
  manufacturer: string;
  model: string;
  description: string;
  productLabCode: string;
  validations: InventoryTemplateValidation[];
}

const baseTemplates = [
  ["XP2I 2K PSI.xlsx", "10261C", "F-Digital Pressure", "CRYSTAL ENGINEERING", "2KP5IXP2I", "DIGITAL PRESSURE GAUGE"],
  ["XP2I 30 PSI.xlsx", "9747C", "F-Digital Pressure", "CRYSTAL ENGINEERING", "XP2I-30", "DIGITAL PRESSURE GAUGE"],
  ["XP2I 300 PSI.xlsx", "10217C", "F-Digital Pressure", "CRYSTAL ENGINEERING", "XP2I-300", "DIGITAL PRESSURE GAUGE"],
  ["XP2I 500 PSI.xlsx", "8917C", "F-Digital Pressure", "CRYSTAL ENGINEERING", "XP2I-500", "DIGITAL PRESSURE GAUGE"],
  ["DPG 15 PSI 0.05% FS 3D.xlsx", "4580C", "F-Digital Pressure", "3D INSTRUMENTS", "DPG-15", "DIGITAL TEST GAUGE"],
  ["10x4x80.xlsx", "15021C", "C-Dimensional", "FLUKE", "334", "CLAMP-ON METER"],
  ["1120 2120 2121-4inHG-A-HR.xlsx", "7045C", "F-Digital Pressure", "CRYSTAL ENGINEERING", "2121-1000mmHG-A-HR", "PRESSURE CALIBRATOR"],
  ["13x12.5x80.xlsx", "15021C", "P-Temperature", "TRANSMATION", "1010", "THRICE CELL"],
  ["3D Instruments Accu-Cal Series Digital Gauges Autofill.xlsx", "17980C", "F-Digital Pressure", "3D INSTRUMENTS", "75514-38B55", "DIGITAL TEST GAUGE"],
  ["Starrett 799 6in 150mm Digital Caliper.xlsx", "14364C", "C-Dimensional", "STARRETT", "799", "DIGITAL CALIPER"],
  ["Weights Class ALL Flex Metric 1mg-5000g.xlsx", "2181C", "H-Analytical/Other", "TROEMNER", "CLASS ALL", "WEIGHT SET"],
  ["Vectorscopes.xlsx", "10524C", "Q-Low Frequency A/C", "TEKTRONIX", "1720", "VECTORSCOPE"],
  ["TEK WVR500 Combo Scope.xlsx", "11519C", "Q-Low Frequency A/C", "TEKTRONIX", "WVR500", "COMBO SCOPE"],
  ["TW 250 FT-LB and N-m 5% 5% DS.xlsx", "5427C", "J-Torque/Force", "SNAP-ON", "QJFR250E", "TORQUE WRENCH"],
] as const;

export const INVENTORY_TEMPLATE_RECORDS: InventoryTemplateRecord[] = Array.from({ length: 42 }, (_, index) => {
  const source = baseTemplates[index % baseTemplates.length];
  const validated = index % 6 !== 4;
  const approvedDate = `0${(index % 8) + 1}/${String((index % 25) + 2).padStart(2, "0")}/20${String(15 + (index % 10)).padStart(2, "0")} 01:${String(12 + index).padStart(2, "0")} PM`;
  return {
    id: `inventory-template-${index + 1}`,
    name: index < baseTemplates.length ? source[0] : source[0].replace(".xlsx", ` v${Math.floor(index / baseTemplates.length) + 1}.xlsx`),
    status: validated ? "Validated" : "Not Validated",
    jmtNumber: source[1],
    labCode: source[2],
    approvedBy: validated ? (index % 3 === 0 ? "Frank, K" : index % 3 === 1 ? "Ryder, R" : "Prieskop, S") : "Frank, K",
    approvedDate,
    version: (index % 7) + 1,
    comments: index % 2 === 0 ? "Dimensions and tolerances are now adjustable." : "Template converted to the current controlled format.",
    manufacturer: source[3],
    model: source[4],
    description: source[5],
    productLabCode: source[2],
    validations: validated ? [{
      validatedBy: index % 2 === 0 ? "Robert C. Ryder" : "Ken R. Frank",
      date: approvedDate,
      status: "PASS",
      workOrder: `${204489 + index}-001`,
      manufacturer: source[3],
      model: source[4],
      comments: "This template accurately records and calculates the data used to verify the unit under test.",
    }] : [],
  };
});

export const INVENTORY_LAB_CODES = [
  "C-Dimensional",
  "F-Digital Pressure",
  "H-Analytical/Other",
  "J-Torque/Force",
  "P-Temperature",
  "Q-Low Frequency A/C",
];

export const INVENTORY_APPROVERS = ["Frank, K", "Prieskop, S", "Ryder, R", "Young, R"];