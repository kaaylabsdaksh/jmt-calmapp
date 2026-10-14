export type CapabilityMatrix = Record<string, Record<string, boolean>>;
export type LocationCapability = { location: string; services: string[]; note: string };
export type CapabilitySelection = { matrix: CapabilityMatrix; notes: Record<string, string> };

export function selectedCapabilities(matrix: CapabilityMatrix, notes: Record<string, string> = {}): LocationCapability[] {
  return Object.entries(matrix).flatMap(([location, options]) => {
    const services = Object.entries(options).filter(([, checked]) => checked).map(([service]) => service);
    return services.length ? [{ location, services, note: options["17025 (Limited)"] ? notes[location] || "" : "" }] : [];
  });
}

export function matchesCapableLocation(matrix: CapabilityMatrix, query: string): boolean {
  return !query.trim() || selectedCapabilities(matrix).some(({ location }) => location.toLowerCase().includes(query.trim().toLowerCase()));
}

export function matrixFromLocations(locations: string): CapabilityMatrix {
  return Object.fromEntries(locations.split(",").map((location) => location.trim()).filter(Boolean).map((location) => [location, { Calibration: true }]));
}

// Local mock selections survive navigation, but never leave this browser session.
// Demo seeds so the Product Review grid shows the counted link before any edit.
const selections = new Map<string, CapabilitySelection>([
  ["review:PR05524:002", { matrix: { Alexandria: { Calibration: true, "17025 (Full)": true }, Houston: { "Limited Cal": true, "17025 (Limited)": true }, "Baton Rouge": { Adjustment: true } }, notes: { Houston: "Voltage ranges only" } }],
  ["review:PR05701:001", { matrix: { Clute: { Calibration: true, "Op Check": true }, Alexandria: { "Limited Cal": true } }, notes: {} }],
  ["review:PR06961:001", { matrix: { Houston: { Calibration: true, Adjustment: true, "17025 (Full)": true } }, notes: {} }],
]);
const listeners = new Set<() => void>();
let revision = 0;
export function capabilityRevision(): number { return revision; }
export function getCapabilitySelection(key: string): CapabilitySelection | undefined { return selections.get(key); }
export function saveCapabilitySelection(key: string, selection: CapabilitySelection): void {
  selections.set(key, selection);
  revision += 1;
  listeners.forEach((listener) => listener());
}
export function subscribeCapabilities(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}