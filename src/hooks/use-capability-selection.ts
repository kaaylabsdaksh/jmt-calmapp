import { useSyncExternalStore } from "react";
import { getCapabilitySelection, subscribeCapabilities, type CapabilitySelection } from "@/lib/capable-locations";

export function useCapabilitySelection(key: string, fallback: CapabilitySelection): CapabilitySelection {
  return useSyncExternalStore(subscribeCapabilities, () => getCapabilitySelection(key)) ?? fallback;
}