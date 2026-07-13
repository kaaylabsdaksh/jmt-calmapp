import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  CURRENT_RELEASE,
  CURRENT_TOUR_STEPS,
  MINI_TOURS,
  type TourStep,
} from "@/lib/tour/data";
import {
  dismissCurrentRelease,
  getAdminSettings,
  hasCompletedCurrentTour,
  hasDismissedCurrentRelease,
  hasSeenCurrentRelease,
  markCurrentReleaseSeen,
  markCurrentTourCompleted,
  trackEvent,
} from "@/lib/tour/storage";

type TourContextValue = {
  welcomeOpen: boolean;
  openWelcome: () => void;
  closeWelcome: (opts?: { dontShowAgain?: boolean }) => void;

  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  tourActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  steps: TourStep[];
  startTour: (opts?: { steps?: TourStep[]; miniId?: string }) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  finishTour: () => void;
};

const TourContext = createContext<TourContextValue | null>(null);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [steps, setSteps] = useState<TourStep[]>(CURRENT_TOUR_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const bootedRef = useRef(false);

  // First-load: show welcome modal if new release unseen
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    const admin = getAdminSettings();
    const forced = admin.forceTour;
    const seen = hasSeenCurrentRelease();
    const dismissed = hasDismissedCurrentRelease();
    if (forced || (!seen && !dismissed)) {
      // small delay so app shell mounts first
      setTimeout(() => setWelcomeOpen(true), 400);
      markCurrentReleaseSeen();
      trackEvent("release_viewed", { version: CURRENT_RELEASE.version });
    }
  }, []);

  const openWelcome = () => setWelcomeOpen(true);
  const closeWelcome: TourContextValue["closeWelcome"] = (opts) => {
    setWelcomeOpen(false);
    if (opts?.dontShowAgain) dismissCurrentRelease();
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    trackEvent("release_viewed", { source: "drawer" });
  };
  const closeDrawer = () => setDrawerOpen(false);

  const startTour: TourContextValue["startTour"] = (opts) => {
    let nextSteps = CURRENT_TOUR_STEPS;
    if (opts?.miniId) {
      const mini = MINI_TOURS.find((m) => m.id === opts.miniId);
      if (mini) nextSteps = mini.steps;
    } else if (opts?.steps) {
      nextSteps = opts.steps;
    }
    setSteps(nextSteps);
    setCurrentStepIndex(0);
    setWelcomeOpen(false);
    setTourActive(true);
    trackEvent(hasCompletedCurrentTour() ? "replay_started" : "tour_started", {
      version: CURRENT_RELEASE.version,
      mini: opts?.miniId,
    });
    if (nextSteps[0]?.route) navigate(nextSteps[0].route);
  };

  const nextStep = () => {
    setCurrentStepIndex((idx) => {
      const next = idx + 1;
      if (next >= steps.length) {
        finishTour();
        return idx;
      }
      const step = steps[next];
      if (step?.route) navigate(step.route);
      trackEvent("step_viewed", { id: step?.id });
      return next;
    });
  };

  const prevStep = () => {
    setCurrentStepIndex((idx) => {
      const prev = Math.max(0, idx - 1);
      const step = steps[prev];
      if (step?.route) navigate(step.route);
      return prev;
    });
  };

  const skipTour = () => {
    trackEvent("tour_skipped", { at: currentStepIndex });
    setTourActive(false);
  };

  const finishTour = () => {
    trackEvent("tour_completed", { version: CURRENT_RELEASE.version });
    markCurrentTourCompleted();
    setTourActive(false);
  };

  const value = useMemo<TourContextValue>(
    () => ({
      welcomeOpen,
      openWelcome,
      closeWelcome,
      drawerOpen,
      openDrawer,
      closeDrawer,
      tourActive,
      currentStepIndex,
      currentStep: tourActive ? steps[currentStepIndex] ?? null : null,
      steps,
      startTour,
      nextStep,
      prevStep,
      skipTour,
      finishTour,
    }),
    [welcomeOpen, drawerOpen, tourActive, currentStepIndex, steps]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
};
