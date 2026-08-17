export type Product = {
  id: string;
  manufacturer: string;
  model: string;
  description: string;
  alias: string;
  lc: string;
  locations: string;
  tf: string;
  calCost: string;
  groupType: string;
  productType: string;
  accredCal: string;
  status: string;
  prItem: string;
  prStatus: string;
  rental: string;
  option: string;
  range: string;
  accuracy: string;
};

export const PRODUCTS: Product[] = [
  { id: "9719", manufacturer: "FLUKE", model: "10", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "102.50", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9723", manufacturer: "FLUKE", model: "105 SERIES II", description: "SCOPEMETER", alias: "", lc: "Q", locations: "", tf: "No", calCost: "358.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9724", manufacturer: "FLUKE", model: "105B", description: "SCOPEMETER", alias: "", lc: "Q", locations: "", tf: "No", calCost: "358.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9727", manufacturer: "FLUKE", model: "11", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "205.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9728", manufacturer: "FLUKE", model: "110", description: "TRUE RMS MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "205.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9729", manufacturer: "FLUKE", model: "111", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9730", manufacturer: "FLUKE", model: "112", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9731", manufacturer: "FLUKE", model: "114", description: "TRUE RMS MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9734", manufacturer: "FLUKE", model: "115", description: "TRUE RMS MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9737", manufacturer: "FLUKE", model: "12", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9738", manufacturer: "FLUKE", model: "123", description: "SCOPEMETER", alias: "", lc: "Q", locations: "Baton Rouge, Alexandria, Odessa, Clute, Mattoon, Groves, Port Arthur, Onsite", tf: "No", calCost: "307.50", groupType: "Electrical", productType: "", accredCal: "Yes", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9739", manufacturer: "FLUKE", model: "124", description: "SCOPEMETER", alias: "", lc: "Q", locations: "", tf: "No", calCost: "307.50", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9740", manufacturer: "FLUKE", model: "125", description: "SCOPEMETER", alias: "", lc: "Q", locations: "", tf: "No", calCost: "307.50", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9741", manufacturer: "FLUKE", model: "15B+", description: "DIGITAL MULTIMETER", alias: "", lc: "M", locations: "Houston", tf: "No", calCost: "125.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "Yes", option: "", range: "", accuracy: "" },
  { id: "9742", manufacturer: "FLUKE", model: "17B+", description: "DIGITAL MULTIMETER", alias: "", lc: "M", locations: "Houston", tf: "No", calCost: "145.00", groupType: "Electrical", productType: "", accredCal: "Yes", status: "ACTIVE", prItem: "", prStatus: "", rental: "Yes", option: "", range: "", accuracy: "" },
  { id: "9743", manufacturer: "FLUKE", model: "287", description: "TRUE RMS ELECTRONIC LOGGING MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "425.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9744", manufacturer: "FLUKE", model: "289", description: "TRUE RMS INDUSTRIAL LOGGING MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "495.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9745", manufacturer: "DRUCK", model: "DPI 620", description: "CALIBRATOR", alias: "", lc: "P", locations: "", tf: "No", calCost: "620.00", groupType: "Pressure", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9746", manufacturer: "DRUCK", model: "DPI 705", description: "PRESSURE INDICATOR", alias: "", lc: "P", locations: "", tf: "No", calCost: "210.00", groupType: "Pressure", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9747", manufacturer: "HART", model: "475", description: "FIELD COMMUNICATOR", alias: "", lc: "T", locations: "", tf: "No", calCost: "385.00", groupType: "Temperature", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9748", manufacturer: "HART", model: "375", description: "FIELD COMMUNICATOR", alias: "", lc: "T", locations: "", tf: "No", calCost: "295.00", groupType: "Temperature", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9749", manufacturer: "AMETEK", model: "JOFRA RTC-157", description: "TEMPERATURE CALIBRATOR", alias: "", lc: "T", locations: "", tf: "No", calCost: "750.00", groupType: "Temperature", productType: "", accredCal: "Yes", status: "ACTIVE", prItem: "", prStatus: "", rental: "Yes", option: "", range: "", accuracy: "" },
  { id: "9750", manufacturer: "AMETEK", model: "JOFRA ATC-140", description: "TEMPERATURE CALIBRATOR", alias: "", lc: "T", locations: "", tf: "No", calCost: "680.00", groupType: "Temperature", productType: "", accredCal: "Yes", status: "ACTIVE", prItem: "", prStatus: "", rental: "Yes", option: "", range: "", accuracy: "" },
  { id: "9751", manufacturer: "MITUTOYO", model: "500-196-30", description: "DIGIMATIC CALIPER", alias: "", lc: "M", locations: "", tf: "No", calCost: "55.00", groupType: "Mechanical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9752", manufacturer: "MITUTOYO", model: "293-340-30", description: "DIGIMATIC MICROMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "72.50", groupType: "Mechanical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
];
