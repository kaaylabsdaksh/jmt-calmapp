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
const selections = new Map<string, CapabilitySelection>();
const listeners = new Set<() => void>();
export function getCapabilitySelection(key: string): CapabilitySelection | undefined { return selections.get(key); }
export function saveCapabilitySelection(key: string, selection: CapabilitySelection): void {
  selections.set(key, selection);
  listeners.forEach((listener) => listener());
}
export function subscribeCapabilities(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}