// localStorage helpers for the What's New / Tour system.
// All state is client-side; safe defaults on SSR / missing keys.

import { CURRENT_RELEASE } from "./data";

const KEYS = {
  seenRelease: (v: string) => `calmapp.tour.seen.${v}`,
  dismissRelease: (v: string) => `calmapp.tour.dismiss.${v}`,
  completedTour: (v: string) => `calmapp.tour.completed.${v}`,
  badgeClicked: (k: string) => `calmapp.tour.badge.${k}`,
  prefs: `calmapp.tour.prefs`,
  analytics: `calmapp.tour.analytics`,
  admin: `calmapp.tour.admin`,
};

export type TourPreferences = {
  showNewFeatureTours: boolean;
  autoPlayTours: boolean;
  showReleaseNotifications: boolean;
  emailReleaseSummaries: boolean;
};

export const DEFAULT_PREFS: TourPreferences = {
  showNewFeatureTours: true,
  autoPlayTours: true,
  showReleaseNotifications: true,
  emailReleaseSummaries: false,
};

export type AdminSettings = {
  forceTour: boolean;
  targetRole: "all" | "csa" | "billing" | "admin";
  scheduledDate?: string;
  announcement?: string;
};

export const DEFAULT_ADMIN: AdminSettings = {
  forceTour: false,
  targetRole: "all",
};

const safeGet = (k: string): string | null => {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (k: string, v: string) => {
  try {
    window.localStorage.setItem(k, v);
  } catch {
    /* noop */
  }
};

export const hasSeenCurrentRelease = () =>
  safeGet(KEYS.seenRelease(CURRENT_RELEASE.version)) === "1";
export const markCurrentReleaseSeen = () =>
  safeSet(KEYS.seenRelease(CURRENT_RELEASE.version), "1");

export const hasDismissedCurrentRelease = () =>
  safeGet(KEYS.dismissRelease(CURRENT_RELEASE.version)) === "1";
export const dismissCurrentRelease = () =>
  safeSet(KEYS.dismissRelease(CURRENT_RELEASE.version), "1");

export const hasCompletedCurrentTour = () =>
  safeGet(KEYS.completedTour(CURRENT_RELEASE.version)) === "1";
export const markCurrentTourCompleted = () =>
  safeSet(KEYS.completedTour(CURRENT_RELEASE.version), "1");

export const isBadgeCleared = (key: string) =>
  safeGet(KEYS.badgeClicked(key)) === "1";
export const clearBadge = (key: string) => {
  safeSet(KEYS.badgeClicked(key), "1");
  window.dispatchEvent(new CustomEvent("calmapp:badge-cleared", { detail: key }));
};

export const getPreferences = (): TourPreferences => {
  const raw = safeGet(KEYS.prefs);
  if (!raw) return DEFAULT_PREFS;
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
};
export const setPreferences = (p: TourPreferences) =>
  safeSet(KEYS.prefs, JSON.stringify(p));

export const getAdminSettings = (): AdminSettings => {
  const raw = safeGet(KEYS.admin);
  if (!raw) return DEFAULT_ADMIN;
  try {
    return { ...DEFAULT_ADMIN, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMIN;
  }
};
export const setAdminSettings = (a: AdminSettings) =>
  safeSet(KEYS.admin, JSON.stringify(a));

/** ---- Lightweight analytics (localStorage, no backend) ---- */
export type AnalyticsEvent =
  | "tour_started"
  | "tour_completed"
  | "tour_skipped"
  | "step_viewed"
  | "replay_started"
  | "release_viewed"
  | "badge_clicked";

export type AnalyticsRecord = {
  event: AnalyticsEvent;
  meta?: Record<string, unknown>;
  at: number;
};

export const trackEvent = (event: AnalyticsEvent, meta?: Record<string, unknown>) => {
  const raw = safeGet(KEYS.analytics);
  let list: AnalyticsRecord[] = [];
  try {
    list = raw ? JSON.parse(raw) : [];
  } catch {
    list = [];
  }
  list.push({ event, meta, at: Date.now() });
  // cap at 500 events
  if (list.length > 500) list = list.slice(-500);
  safeSet(KEYS.analytics, JSON.stringify(list));
};

export const getAnalytics = (): AnalyticsRecord[] => {
  const raw = safeGet(KEYS.analytics);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const resetAllTourState = () => {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("calmapp.tour."))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* noop */
  }
};
