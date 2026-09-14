export type BatchLoanStatus = "Open" | "Returned" | "Cancelled";

export interface OnsiteBatchLoan {
  id: number;
  account: string;
  customer: string;
  status: BatchLoanStatus;
  fromLocation: string;
  toLocation: string;
  createdBy: string;
  created: string;
  needed: string;
  expectedReturn: string;
}

export const BATCH_LOAN_LOCATIONS = [
  "Alexandria",
  "Baton Rouge",
  "Clute",
  "Deer Park",
  "Houston",
  "Lake Charles",
  "Onsite",
];

export const BATCH_LOAN_USERS = [
  "Admin User",
  "Amanda R. Phillips",
  "Anthony D. DiBlasio",
  "James L. Powell",
];

export const BATCH_LOANS: OnsiteBatchLoan[] = [
  { id: 49, account: "0152.00", customer: "J M Test Systems BRX Lab STD", status: "Cancelled", fromLocation: "Baton Rouge", toLocation: "Onsite", createdBy: "Admin User", created: "06/05/2025", needed: "01/01/2026", expectedReturn: "01/10/2026" },
  { id: 48, account: "0152.00", customer: "J M Test Systems BRX Lab STD", status: "Returned", fromLocation: "Baton Rouge", toLocation: "Onsite", createdBy: "Admin User", created: "06/05/2025", needed: "08/15/2025", expectedReturn: "08/17/2025" },
  { id: 39, account: "0300.12", customer: "Trunkline Gas Co LNG", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "06/23/2014", needed: "06/23/2014", expectedReturn: "06/26/2014" },
  { id: 38, account: "0107.33", customer: "Air Products", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "06/18/2014", needed: "06/18/2014", expectedReturn: "06/20/2014" },
  { id: 37, account: "0298.27", customer: "Tenn Gas PLC", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "06/13/2014", needed: "06/13/2014", expectedReturn: "06/13/2014" },
  { id: 34, account: "0540.03", customer: "International Paper Reliability", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "05/27/2014", needed: "05/27/2014", expectedReturn: "05/28/2014" },
  { id: 33, account: "3492.00", customer: "Martco LLC", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "05/22/2014", needed: "05/22/2014", expectedReturn: "05/22/2014" },
  { id: 32, account: "0254.00", customer: "Firestone Polymers", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "05/13/2014", needed: "05/13/2014", expectedReturn: "05/15/2014" },
  { id: 31, account: "0561.00", customer: "Energy Transfer Partners", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "05/06/2014", needed: "05/05/2014", expectedReturn: "05/06/2014" },
  { id: 30, account: "0555.00", customer: "Energy Transfer Partners", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "05/05/2014", needed: "05/05/2014", expectedReturn: "05/06/2014" },
  { id: 29, account: "0437.23", customer: "ExxonMobil BPEP", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "04/28/2014", needed: "04/28/2014", expectedReturn: "05/02/2014" },
  { id: 28, account: "3662.00", customer: "Hartree Natural Gas Storage", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "04/24/2014", needed: "04/24/2014", expectedReturn: "04/25/2014" },
  { id: 26, account: "0166.00", customer: "Northrop Grumman Corp", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "04/21/2014", needed: "04/21/2014", expectedReturn: "04/23/2014" },
  { id: 24, account: "0380.01", customer: "Enlink Processing SVS LLC", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "04/17/2014", needed: "04/17/2014", expectedReturn: "04/17/2014" },
  { id: 23, account: "0248.18", customer: "Texas Eastern", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "04/15/2014", needed: "04/15/2014", expectedReturn: "04/15/2014" },
  { id: 22, account: "2135.00", customer: "Trus Joist by Weyerhaeuser", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "04/14/2014", needed: "04/14/2014", expectedReturn: "04/14/2014" },
  { id: 21, account: "4492.00", customer: "Millercoors LLC", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "04/07/2014", needed: "04/07/2014", expectedReturn: "04/12/2014" },
  { id: 20, account: "0540.17", customer: "International Paper", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "01/06/2014", needed: "01/06/2014", expectedReturn: "01/10/2014" },
  { id: 18, account: "0298.01", customer: "Kinetica Energy Express LLC", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "12/03/2013", needed: "12/04/2013", expectedReturn: "12/06/2013" },
  { id: 17, account: "0583.04", customer: "Equistar Chemicals", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "11/11/2013", needed: "11/11/2013", expectedReturn: "11/17/2013" },
  { id: 15, account: "1661.65", customer: "Kinder Morgan", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "10/23/2013", needed: "10/24/2013", expectedReturn: "10/30/2013" },
  { id: 13, account: "1388.00", customer: "Alliance Compressors", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "Amanda R. Phillips", created: "10/11/2013", needed: "10/14/2013", expectedReturn: "10/21/2013" },
  { id: 10, account: "1245.01", customer: "Swepco", status: "Returned", fromLocation: "Alexandria", toLocation: "Onsite", createdBy: "James L. Powell", created: "09/25/2013", needed: "09/26/2013", expectedReturn: "09/27/2013" },
  { id: 7, account: "0152.00", customer: "J M Test Systems BRX Lab STD", status: "Returned", fromLocation: "Baton Rouge", toLocation: "Onsite", createdBy: "Admin User", created: "08/22/2011", needed: "08/31/2011", expectedReturn: "09/30/2011" },
  { id: 6, account: "0152.00", customer: "J M Test Systems BRX Lab STD", status: "Cancelled", fromLocation: "Baton Rouge", toLocation: "Onsite", createdBy: "Anthony D. DiBlasio", created: "08/15/2011", needed: "08/15/2011", expectedReturn: "08/17/2011" },
];
