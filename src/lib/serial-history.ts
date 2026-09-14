/**
 * Serial number history used by the duplicate / near-match warning.
 * Mock data only — represents items previously received for an account.
 */

export interface SerialHistoryEntry {
  serial: string;
  accountNumber: string;
  customerName: string;
  workOrder: string;
  reportNumber: string;
  manufacturer: string;
  model: string;
  action: string;
  /** ISO date the item was last received. */
  receivedDate: string;
}

export type SerialMatchType = "exact" | "near";

export interface SerialMatch {
  entry: SerialHistoryEntry;
  matchType: SerialMatchType;
  /** Human readable age, e.g. "3 months ago". */
  age: string;
}

export interface SerialMatchGroup {
  /** The serial as the user typed it. */
  typedSerial: string;
  itemLabel: string;
  matches: SerialMatch[];
}

const monthsAgo = (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
};

export const SERIAL_HISTORY: SerialHistoryEntry[] = [
  {
    serial: "SN12345678",
    accountNumber: "1500.00",
    customerName: "Entergy Inventory",
    workOrder: "801234",
    reportNumber: "1500.00-801234-001",
    manufacturer: "Fluke",
    model: "87V",
    action: "C/C",
    receivedDate: monthsAgo(3),
  },
  {
    serial: "SN1234567B",
    accountNumber: "1500.00",
    customerName: "Entergy Inventory",
    workOrder: "799812",
    reportNumber: "1500.00-799812-004",
    manufacturer: "Fluke",
    model: "87V",
    action: "Repair",
    receivedDate: monthsAgo(14),
  },
  {
    serial: "MY54320001",
    accountNumber: "1500.00",
    customerName: "Entergy Inventory",
    workOrder: "802440",
    reportNumber: "1500.00-802440-002",
    manufacturer: "Keysight",
    model: "34461A",
    action: "C/C",
    receivedDate: monthsAgo(7),
  },
  {
    serial: "C012345",
    accountNumber: "1500.00",
    customerName: "Entergy Inventory",
    workOrder: "800021",
    reportNumber: "1500.00-800021-003",
    manufacturer: "Tektronix",
    model: "TDS2024C",
    action: "C/C",
    receivedDate: monthsAgo(5),
  },
  {
    serial: "FL12345",
    accountNumber: "0152.01",
    customerName: "Florida Power & Light",
    workOrder: "803112",
    reportNumber: "0152.01-803112-001",
    manufacturer: "Fluke",
    model: "87V",
    action: "C/C",
    receivedDate: monthsAgo(2),
  },
  {
    serial: "KS98765",
    accountNumber: "0152.01",
    customerName: "Florida Power & Light",
    workOrder: "802901",
    reportNumber: "0152.01-802901-002",
    manufacturer: "Keysight",
    model: "34465A",
    action: "Repair",
    receivedDate: monthsAgo(9),
  },
  {
    serial: "US44001234",
    accountNumber: "1500.03",
    customerName: "Duke Energy Corporation",
    workOrder: "801880",
    reportNumber: "1500.03-801880-001",
    manufacturer: "Agilent",
    model: "E4980A",
    action: "C/C",
    receivedDate: monthsAgo(11),
  },
  {
    serial: "TEK44321",
    accountNumber: "1500.04",
    customerName: "Southern Company Services",
    workOrder: "802655",
    reportNumber: "1500.04-802655-001",
    manufacturer: "Tektronix",
    model: "TBS1052B",
    action: "C/C",
    receivedDate: monthsAgo(4),
  },
];

/** Uppercase, strip anything that is not a letter or a digit. */
const normalize = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Collapse characters people commonly mistype for one another. */
const collapseConfusables = (value: string) =>
  value
    .replace(/[OQ]/g, "0")
    .replace(/[IL]/g, "1")
    .replace(/S/g, "5")
    .replace(/B/g, "8")
    .replace(/Z/g, "2")
    .replace(/G/g, "6");

/** True when a and b differ by at most one edit (insert, delete, replace or swap). */
const withinOneEdit = (a: string, b: string) => {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;

  if (a.length === b.length) {
    const diffs: number[] = [];
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) diffs.push(i);
      if (diffs.length > 2) return false;
    }
    if (diffs.length <= 1) return true;
    const [x, y] = diffs;
    return y === x + 1 && a[x] === b[y] && a[y] === b[x];
  }

  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  let i = 0;
  let j = 0;
  let skipped = false;
  while (i < longer.length && j < shorter.length) {
    if (longer[i] === shorter[j]) {
      i += 1;
      j += 1;
      continue;
    }
    if (skipped) return false;
    skipped = true;
    i += 1;
  }
  return true;
};

export const describeAge = (isoDate: string) => {
  const then = new Date(isoDate).getTime();
  const days = Math.max(0, Math.round((Date.now() - then) / 86_400_000));
  if (days <= 1) return "today";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  const restMonths = months % 12;
  if (restMonths === 0) return `${years} year${years === 1 ? "" : "s"} ago`;
  return `${years} yr ${restMonths} mo ago`;
};

/**
 * Find previous appearances of a serial for the same account.
 * Returns exact hits first, then near misses (typo-level differences).
 */
export const findSerialMatches = (
  serial: string,
  accountNumber?: string,
  history: SerialHistoryEntry[] = SERIAL_HISTORY
): SerialMatch[] => {
  const typed = normalize(serial ?? "");
  if (typed.length < 4) return [];

  const account = (accountNumber ?? "").trim();
  const scope = account ? history.filter((entry) => entry.accountNumber === account) : history;
  const typedLoose = collapseConfusables(typed);

  const matches: SerialMatch[] = [];
  scope.forEach((entry) => {
    const candidate = normalize(entry.serial);
    if (candidate === typed) {
      matches.push({ entry, matchType: "exact", age: describeAge(entry.receivedDate) });
      return;
    }
    const candidateLoose = collapseConfusables(candidate);
    if (candidateLoose === typedLoose || withinOneEdit(typedLoose, candidateLoose)) {
      matches.push({ entry, matchType: "near", age: describeAge(entry.receivedDate) });
    }
  });

  return matches.sort((a, b) => {
    if (a.matchType !== b.matchType) return a.matchType === "exact" ? -1 : 1;
    return b.entry.receivedDate.localeCompare(a.entry.receivedDate);
  });
};
