export type FactoryItem = {
  item: string;
  manufacturer: string;
  model: string;
  description: string;
  serial: string;
  clerk: string;
  status: string;
  labStandard: boolean;
};

export type FactoryBatch = {
  batch: string;
  account: string;
  sr: string;
  rma: string;
  po: string;
  customer: string;
  commentDate: string;
  comment: string;
  needBy: string;
  followUp: string;
  location: string;
  group: string;
  items: FactoryItem[];
};

export type FactoryCriteria = {
  location: string;
  manufacturer: string;
  group: string;
  clerk: string;
  status: string;
  labStandards: boolean;
};

export const emptyFactoryCriteria: FactoryCriteria = {
  location: "", manufacturer: "", group: "", clerk: "", status: "", labStandards: false,
};

export const factoryStatuses = [
  "Assigned to Clerk", "Await Cust Approval Est. Fee", "Awaiting Customer Approval",
  "Awaiting Factory", "Sent to Factory", "Back from Factory",
];

const batchNumbers = ["3154", "3179", "3180", "3184", "3185", "3190", "3195", "3199", "3201", "3327", "3435", "3580", "3743", "3866", "3920", "3941"];
const equipment = [
  { manufacturer: "FLYGT", model: "READY 8", description: "SUBMERSIBLE PUMP" },
  { manufacturer: "FLUKE", model: "87V", description: "DIGITAL MULTIMETER" },
  { manufacturer: "TROXLER", model: "3440", description: "DENSITY GAUGE" },
];

export const factoryBatches: FactoryBatch[] = batchNumbers.map((batch, index) => {
  const newtron = index === 0 || index === 6 || index === 11;
  const customer = newtron ? "Newtron LLC" : index === 9 ? "Flagstaff IT & Comm LLC" : index === 10 || index === 12 ? "Test" : index >= 13 ? "Alltite Inc" : "Nexeo Solutions LLC";
  const date = index < 9 ? "2025-11-25" : index === 9 ? "2026-01-28" : index === 10 ? "2026-03-10" : "2026-04-30";
  return {
    batch, customer, account: newtron ? "0101.00" : index === 9 ? "10125.00" : index === 10 || index === 12 ? "00000.00" : index >= 13 ? "7021.00" : "1500.00",
    sr: newtron ? "SR0339" : index >= 13 ? "SR0672" : "", rma: index % 4 === 0 ? `RMA-${batch}` : "",
    po: index % 3 === 0 ? `PO-${batch}` : "", commentDate: date,
    comment: index === 0 ? "test" : index >= 11 ? "Status changed from LAB MANAGEMENT to TO FACTORY" : "C/C Cost updated to zero.",
    needBy: index % 3 === 0 ? "2026-10-30" : "", followUp: index % 2 === 0 ? "2026-10-23" : "",
    location: ["Baton Rouge, LA", "Houston, TX", "Alexandria, LA", "Beaumont, TX"][index % 4],
    group: newtron ? "Newtron Group" : "Industrial Accounts",
    items: Array.from({ length: index % 3 + 1 }, (_, itemIndex) => ({
      ...equipment[(index + itemIndex) % equipment.length], item: String(itemIndex + 1).padStart(3, "0"),
      serial: `${batch}-${itemIndex + 1}`, clerk: ["Admin User", "John Doe", "Jane Smith", "Mike Johnson"][(index + itemIndex) % 4],
      status: factoryStatuses[(index + itemIndex) % factoryStatuses.length], labStandard: (index + itemIndex) % 5 === 0,
    })),
  };
});

export function matchingFactoryItems(batch: FactoryBatch, criteria: FactoryCriteria): FactoryItem[] {
  return batch.items.filter((item) =>
    (!criteria.manufacturer || item.manufacturer === criteria.manufacturer) &&
    (!criteria.clerk || item.clerk === criteria.clerk) &&
    (!criteria.status || item.status === criteria.status) &&
    (!criteria.labStandards || item.labStandard));
}

export function filterFactoryBatches(batches: FactoryBatch[], criteria: FactoryCriteria, columns: Partial<Record<keyof FactoryBatch, string>> = {}): FactoryBatch[] {
  return batches.filter((batch) =>
    (!criteria.location || batch.location === criteria.location) &&
    (!criteria.group || batch.group === criteria.group) &&
    matchingFactoryItems(batch, criteria).length > 0 &&
    Object.entries(columns).every(([key, value]) => !value || String(batch[key as keyof FactoryBatch]).toLowerCase().includes(value.toLowerCase())));
}