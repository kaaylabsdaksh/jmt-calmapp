import { useEffect } from "react";

/**
 * Radix Dialog/Sheet sets `pointer-events: none` on <body> while a modal is open
 * and can leave it behind when two overlays open/close in the same tick
 * (e.g. Welcome modal -> What's New drawer). When that happens the whole app
 * stops responding to clicks and dialogs appear "not to open".
 * This guard clears the stuck style whenever no modal layer is actually mounted.
 */
export const PointerEventsGuard = () => {
  useEffect(() => {
    const clearIfStuck = () => {
      if (document.body.style.pointerEvents !== "none") return;
      const openLayer = document.querySelector(
        '[data-radix-popper-content-wrapper], [role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]',
      );
      if (!openLayer) document.body.style.removeProperty("pointer-events");
    };

    const observer = new MutationObserver(clearIfStuck);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "data-state"],
    });
    const interval = window.setInterval(clearIfStuck, 500);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, []);

  return null;
};

export default PointerEventsGuard;
