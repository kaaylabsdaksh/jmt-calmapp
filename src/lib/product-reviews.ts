export type ProductReviewRecord = {
  pr: string;
  item: string;
  division: string;
  loc: string;
  createdDate: string;
  createdBy: string;
  dueDate: string;
  status: string;
  statusDate: string;
  manufacturer: string;
  model: string;
  description: string;
  labCode: string;
  quote: string;
  customer: string;
};

export const PRODUCT_REVIEWS: ProductReviewRecord[] = [
  { pr: "PR05524", item: "002", division: "Lab", loc: "CL", createdDate: "04/30/2021 09:34 AM", createdBy: "Brandi M. Cali", dueDate: "05/01/2021", status: "Lab Management", statusDate: "04/30/2021", manufacturer: "MILWAUKEE", model: "MLDIG14", description: '14" DIGITAL LEVER WITH PINPOINT MEASUREMENT TECHNOLOGY', labCode: "", quote: "22491", customer: "First Instrument Solutions (6613.00)" },
  { pr: "PR05587", item: "001", division: "Lab", loc: "CL", createdDate: "05/12/2021 10:26 AM", createdBy: "Trysten Q Howze", dueDate: "05/13/2021", status: "Lab Management", statusDate: "05/12/2021", manufacturer: "MEASUREMENT SPECIALTIES", model: "SP3-25", description: "LINEAR POSITION SENSOR", labCode: "", quote: "", customer: "Southwest Calibration Service (13891.00)" },
  { pr: "PR05701", item: "001", division: "Lab", loc: "CL", createdDate: "05/27/2021 01:50 PM", createdBy: "Trysten Q Howze", dueDate: "05/28/2021", status: "Lab Management", statusDate: "05/27/2021", manufacturer: "HAMAR LASER", model: "S-680", description: "SHAFT ALIGNMENT SYSTEMS", labCode: "B", quote: "23368", customer: "Southwest Calibration Service (13891.00)" },
  { pr: "PR05901", item: "001", division: "Lab", loc: "BR", createdDate: "06/25/2021 07:02 AM", createdBy: "Vincent E. Lloyde", dueDate: "06/26/2021", status: "Initiator", statusDate: "06/25/2021", manufacturer: "GENERAL ELECTRIC", model: "CAT 245A2006PI", description: "GROUND DETECTOR", labCode: "G", quote: "", customer: "Chevron Oronite (0596.00)" },
  { pr: "PR06597", item: "001", division: "Lab", loc: "CL", createdDate: "10/06/2021 08:31 AM", createdBy: "Trysten Q Howze", dueDate: "10/07/2021", status: "Lab Management", statusDate: "10/06/2021", manufacturer: "SURFACE ANALYST", model: "SA3001", description: "HANDHELD SURFACE INSPECTION DEVICE", labCode: "", quote: "27056", customer: "Nicol Scales & Measurement (5734.01)" },
  { pr: "PR06961", item: "001", division: "Lab", loc: "MT", createdDate: "12/07/2021 08:35 AM", createdBy: "Jessica M Thompson", dueDate: "12/08/2021", status: "Lab Management", statusDate: "12/07/2021", manufacturer: "DATA PRECISION", model: "2590R", description: "MULTIMETER", labCode: "M", quote: "28965", customer: "QSA Inc (6523.00)" },
  { pr: "PR08355", item: "001", division: "Lab", loc: "CL", createdDate: "07/29/2022 10:31 AM", createdBy: "Kevin R. Young", dueDate: "07/30/2022", status: "Lab Management", statusDate: "07/29/2022", manufacturer: "AMERICAN INNOVATIONS", model: "DVM1100", description: "DIGITAL VOLTMETER", labCode: "G", quote: "", customer: "Dow Chemical Freeport Bm-059 (0871.01)" },
  { pr: "PR08413", item: "004", division: "", loc: "BR", createdDate: "08/08/2022 03:51 PM", createdBy: "Kathryn L Jameson", dueDate: "08/09/2022", status: "Review Initiated", statusDate: "08/08/2022", manufacturer: "VIAVI", model: "FIBER CHECK", description: "FIBER OPTIC MICROSCOPE", labCode: "", quote: "36221", customer: "CMS Telecom Services, LLC (0215.00)" },
  { pr: "PR08736", item: "001", division: "ESL", loc: "BR", createdDate: "09/26/2022 09:01 AM", createdBy: "Tom J. Corvers", dueDate: "09/27/2022", status: "Initiator", statusDate: "09/26/2022", manufacturer: "TRANLUZ", model: "RMT3090", description: "HIGH VOLTAGE DETECTOR", labCode: "N", quote: "", customer: "Controles Y Proyectos SA (13430.00)" },
  { pr: "PR09094", item: "001", division: "OnSite", loc: "GR", createdDate: "11/16/2022 12:57 PM", createdBy: "Andrea D. Jeansonne", dueDate: "11/17/2022", status: "Lab Management", statusDate: "11/16/2022", manufacturer: "MILLER", model: "PROHEAT 35", description: "INDUCTION HEATER", labCode: "P", quote: "", customer: "Dow Chemical (0333.14)" },
];