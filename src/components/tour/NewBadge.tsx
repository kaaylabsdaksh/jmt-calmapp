import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clearBadge, isBadgeCleared } from "@/lib/tour/storage";
import { CURRENT_RELEASE } from "@/lib/tour/data";
import { trackEvent } from "@/lib/tour/storage";

interface NewBadgeProps {
  featureKey: string;
  className?: string;
  label?: string;
  /** If true, clicking anywhere on the parent clears it. Otherwise call clear manually. */
  clearOnHostClick?: boolean;
}

/**
 * Small "NEW" pill that appears next to sidebar items, buttons, menu items
 * whenever a feature is part of the current release. Disappears automatically
 * once the user clicks it, completes the tour, or dismisses the release.
 */
export const NewBadge = ({ featureKey, className, label = "NEW", clearOnHostClick }: NewBadgeProps) => {
  const isCurrent = CURRENT_RELEASE.newBadgeKeys?.includes(featureKey);
  const [visible, setVisible] = useState(isCurrent && !isBadgeCleared(featureKey));

  useEffect(() => {
    const onCleared = (e: Event) => {
      const key = (e as CustomEvent).detail;
      if (key === featureKey) setVisible(false);
    };
    window.addEventListener("calmapp:badge-cleared", onCleared);
    return () => window.removeEventListener("calmapp:badge-cleared", onCleared);
  }, [featureKey]);

  useEffect(() => {
    if (!clearOnHostClick || !visible) return;
    const handler = () => {
      trackEvent("badge_clicked", { key: featureKey });
      clearBadge(featureKey);
    };
    // Attach to nearest interactive ancestor via document delegation
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target?.closest(`[data-badge-key="${featureKey}"]`)) handler();
    });
  }, [featureKey, visible, clearOnHostClick]);

  if (!visible) return null;

  return (
    <span
      role="status"
      aria-label={`${label} feature`}
      className={cn(
        "inline-flex items-center rounded-full bg-primary/15 text-primary text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider leading-none",
        className
      )}
    >
      {label}
    </span>
  );
};
