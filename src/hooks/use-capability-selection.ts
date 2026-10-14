import { useSyncExternalStore } from "react";
import { capabilityRevision, getCapabilitySelection, subscribeCapabilities, type CapabilitySelection } from "@/lib/capable-locations";

export function useCapabilityRevision(): number {
  return useSyncExternalStore(subscribeCapabilities, capabilityRevision);
}

export function useCapabilitySelection(key: string, fallback: CapabilitySelection): CapabilitySelection {
  return useSyncExternalStore(subscribeCapabilities, () => getCapabilitySelection(key)) ?? fallback;
}