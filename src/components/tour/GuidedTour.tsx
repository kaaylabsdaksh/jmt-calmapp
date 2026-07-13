import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { useTour } from "@/context/TourContext";

type Rect = { top: number; left: number; width: number; height: number } | null;

const PAD = 8;
const POPOVER_W = 360;

/** Spotlight overlay with popover positioned near the target element. */
export const GuidedTour = () => {
  const { tourActive, currentStep, currentStepIndex, steps, nextStep, prevStep, skipTour, finishTour } = useTour();
  const [rect, setRect] = useState<Rect>(null);
  const [tick, setTick] = useState(0);

  // Recalculate on step change / resize / scroll
  useLayoutEffect(() => {
    if (!tourActive || !currentStep) return;
    const measure = () => {
      if (!currentStep.target) {
        setRect(null);
        return;
      }
      const el = document.querySelector<HTMLElement>(currentStep.target);
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      // scroll into view if off-screen
      if (r.top < 0 || r.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    // give the routed page a moment to render
    const t = setTimeout(measure, 150);
    const onResize = () => setTick((v) => v + 1);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [tourActive, currentStep, tick]);

  // Escape to exit
  useEffect(() => {
    if (!tourActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipTour();
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourActive, nextStep, prevStep, skipTour]);

  if (!tourActive || !currentStep) return null;

  const total = steps.length;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === total - 1;

  // Compute popover position (right of target if space, else below, else center)
  let popStyle: React.CSSProperties = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  if (rect) {
    const rightSpace = window.innerWidth - (rect.left + rect.width);
    if (rightSpace > POPOVER_W + 24) {
      popStyle = {
        top: Math.max(16, Math.min(window.innerHeight - 260, rect.top)),
        left: rect.left + rect.width + 16,
      };
    } else if (rect.top + rect.height + 260 < window.innerHeight) {
      popStyle = {
        top: rect.top + rect.height + 12,
        left: Math.max(16, Math.min(window.innerWidth - POPOVER_W - 16, rect.left)),
      };
    } else {
      popStyle = {
        top: Math.max(16, rect.top - 260),
        left: Math.max(16, Math.min(window.innerWidth - POPOVER_W - 16, rect.left)),
      };
    }
  }

  const spotlight = rect
    ? {
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
      }
    : null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Product tour step ${currentStepIndex + 1} of ${total}`}
      className="fixed inset-0 z-[100]"
    >
      {/* Dim background with SVG mask cutout */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlight && (
              <rect
                x={spotlight.left}
                y={spotlight.top}
                width={spotlight.width}
                height={spotlight.height}
                rx={10}
                ry={10}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.65)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Highlight ring around target */}
      {spotlight && (
        <div
          className="pointer-events-none absolute rounded-[10px] ring-2 ring-primary shadow-[0_0_0_4px_rgba(59,130,246,0.15)] transition-all duration-200"
          style={spotlight}
        />
      )}

      {/* Popover card */}
      <div
        className="absolute w-[360px] max-w-[92vw] rounded-xl border bg-background shadow-2xl animate-fade-in"
        style={popStyle}
      >
        <div className="flex items-start justify-between p-4 pb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                Step {currentStepIndex + 1} of {total}
              </span>
              {currentStep.estimateSeconds && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {currentStep.estimateSeconds}s
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold leading-tight">
              {currentStep.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 -mr-1"
            onClick={skipTour}
            aria-label="Exit tour"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-4 pb-3 space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentStep.description}
          </p>
          {currentStep.why && (
            <p className="text-xs text-foreground/80 bg-muted/60 rounded-md p-2 border">
              <span className="font-medium">Why it matters: </span>
              {currentStep.why}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-4">
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentStepIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 p-3 pt-3">
          <Button variant="ghost" size="sm" onClick={skipTour}>
            Skip Tour
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isFirst}
              onClick={prevStep}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>
            {isLast ? (
              <Button size="sm" onClick={finishTour}>
                <Check className="h-3.5 w-3.5 mr-1" />
                Finish
              </Button>
            ) : (
              <Button size="sm" onClick={nextStep}>
                Next
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
