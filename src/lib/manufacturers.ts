export type ManufacturerStatus = "Active" | "Pending" | "Inactive";

export interface ManufacturerRecord {
  id: string;
  manufacturer: string;
  fullName: string;
  website: string;
  ascInfo: string;
  dateAdded: string;
  status: ManufacturerStatus;
}

const names = [
  ["1M WORKING STAND.", "1M Working Standards, Inc."],
  ["211", "211 Instruments"],
  ["3D INSTRUMENTS", "3D Instruments, LLC"],
  ["3E", "3E Company"],
  ["3M", "3M"],
  ["3Z TELECOM", "3Z Telecom, Inc."],
  ["4B COMPONENTS LIMITED", "4B Components Limited"],
  ["5FT WKING STANDARD", "5 Foot Working Standard"],
  ["6706", "6706 Technologies"],
  ["7804SB", "7804SB Instruments"],
  ["8104", "8104 Calibration"],
  ["A PUISSANCE 3", "A Puissance 3"],
  ["A&D", "A&D Company, Ltd"],
  ["A&D COMPANY", "A&D Company, Ltd"],
  ["A&D FIELD SERVICE", "A&D Field Service"],
  ["AGILENT", "Agilent Technologies"],
  ["AMETEK", "AMETEK, Inc."],
  ["BAKER INSTRUMENT", "Baker Instrument Company"],
  ["BRANSON", "Branson Ultrasonics"],
  ["FLUKE", "Fluke Corporation"],
  ["HACH", "Hach Company"],
  ["HANNA", "Hanna Instruments"],
  ["INSTRON", "Instron Corporation"],
  ["METTLER TOLEDO", "Mettler-Toledo International"],
  ["OMEGA", "Omega Engineering"],
  ["RICE LAKE", "Rice Lake Weighing Systems"],
  ["SKF", "SKF USA Inc."],
  ["SNAP-ON", "Snap-on Incorporated"],
  ["STARRETT", "The L.S. Starrett Company"],
  ["TEKTRONIX", "Tektronix, Inc."],
  ["ZEISS", "Carl Zeiss Industrial Metrology"],
] as const;

export const MANUFACTURERS: ManufacturerRecord[] = names.map(([manufacturer, fullName], index) => ({
  id: String(index === 0 ? 3061 : index === 1 ? 4393 : index + 1),
  manufacturer,
  fullName: index % 4 === 1 ? "" : fullName,
  website: index % 3 === 2 ? `https://www.${manufacturer.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com` : "",
  ascInfo: index % 5 === 0 ? `${manufacturer.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-asc.pdf` : "",
  dateAdded: index === 2 ? "" : `${String((index % 12) + 1).padStart(2, "0")}/${String((index % 27) + 1).padStart(2, "0")}/${2010 + (index % 16)}`,
  status: index % 7 === 3 ? "Inactive" : index % 4 === 1 ? "Pending" : "Active",
}));
