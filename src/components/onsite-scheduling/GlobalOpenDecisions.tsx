/**
 * The Open Decisions floating widget's app-wide pieces.
 * See OpenDecisionsPanel.tsx.
 *
 * `OpenDecisionsProvider` (re-exported here) must wrap BOTH this Fab AND
 * the app's routed pages — DecisionTag, used inside CalendarView/
 * UnscheduledWorkQueue/TechnicianRosterPicker, needs the same context
 * instance those pages render under. See the wiring in App.tsx: the
 * provider wraps `<GlobalOpenDecisionsFab /><Routes>...</Routes>` together
 * as siblings, not the Fab alone — a provider only reaches its own
 * subtree, not sibling subtrees.
 *
 * The Fab is hidden on the login screen (no point floating over it). The
 * source prototype gated this on its real useAuth() state; this app has no
 * auth layer, so the route is the equivalent signal.
 */
import React from "react";
import { useLocation } from "react-router-dom";
import OpenDecisionsFab from "./OpenDecisionsPanel";

export { OpenDecisionsProvider } from "@/context/OpenDecisionsContext";

const GlobalOpenDecisionsFab: React.FC = () => {
  const { pathname } = useLocation();
  if (pathname === "/login") return null;
  return <OpenDecisionsFab />;
};

export default GlobalOpenDecisionsFab;
