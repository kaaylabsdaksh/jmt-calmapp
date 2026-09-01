/**
 * Top-level shell for the Onsite Scheduling capability.
 *
 * Frames List/Calendar/Unscheduled Work as one capability (tabs on one
 * page) rather than three independent screens.
 *
 * List is `SchedulingListView.tsx`, a purpose-built view reading directly
 * from `SchedulingDataContext` — the same live store Calendar and
 * Unscheduled Work use, so a job scheduled on one surface shows up on the
 * others immediately.
 *
 * Header/tab pattern follows the app's own conventions rather than
 * inventing a new one:
 *  - `ModernTopNav` supplies the page chrome and breadcrumbs, same as every
 *    other routed page here.
 *  - Page header: `bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border`
 *    + h1, the same shape the onsite detail header uses.
 *  - Tab bar: the detail-tab treatment (`bg-background border border-border
 *    p-1`, active tab filled with `bg-primary`), sitting BELOW the header,
 *    not squeezed into it.
 *
 * Tab state lives in the `tab` URL search param so "Jump to context" links
 * can deep-link into a specific tab.
 *
 * JobDetailDialog is mounted once here (not inside CalendarView or
 * SchedulingListView) so every surface's row/bar click opens the exact same
 * instance, not three separate ones.
 */
import React from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, ClipboardList, ListChecks } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import ModernTopNav from "@/components/modern/ModernTopNav";
import {
  SchedulingDataProvider,
  useSchedulingData,
} from "@/context/SchedulingDataContext";
import CalendarView from "@/components/onsite-scheduling/CalendarView";
import UnscheduledWorkQueue from "@/components/onsite-scheduling/UnscheduledWorkQueue";
import SchedulingListView from "@/components/onsite-scheduling/SchedulingListView";
import JobDetailDialog from "@/components/onsite-scheduling/JobDetailDialog";

type TabKey = "list" | "calendar" | "unscheduled";
const VALID_TABS: TabKey[] = ["list", "calendar", "unscheduled"];

const TABS: { key: TabKey; label: string; icon: typeof ListChecks }[] = [
  { key: "list", label: "List", icon: ListChecks },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "unscheduled", label: "Unscheduled Work", icon: ClipboardList },
];

const OnsiteSchedulingInner: React.FC = () => {
  const { unscheduledWork } = useSchedulingData();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: TabKey = VALID_TABS.includes(requested as TabKey)
    ? (requested as TabKey)
    : "list";

  const setTab = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", value);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col">
      <ModernTopNav />

      {/* Page header hidden per request — breadcrumbs in ModernTopNav
          already identify the page. */}


      <Tabs
        value={tab}
        onValueChange={setTab}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* Tab bar — the app's detail-tab treatment, under the header
            rather than inside it. */}
        <div className="border-b border-border bg-background px-2 py-2 sm:px-4 lg:px-6">
          <TabsList className="flex h-9 w-fit items-stretch justify-start gap-1 border border-border bg-background p-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="h-7 gap-1.5 px-3 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {key === "unscheduled" && unscheduledWork.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px]">
                    {unscheduledWork.length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="list" className="mt-0 h-full">
            <SchedulingListView />
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            <CalendarView />
          </TabsContent>
          <TabsContent value="unscheduled" className="mt-0">
            <UnscheduledWorkQueue />
          </TabsContent>
        </div>
      </Tabs>

      {/* Mounted once here (not inside CalendarView) so Calendar and List
          share the exact same dialog instance. */}
      <JobDetailDialog />
    </div>
  );
};

const OnsiteScheduling: React.FC = () => (
  <TooltipProvider>
    <SchedulingDataProvider>
      <OnsiteSchedulingInner />
    </SchedulingDataProvider>
  </TooltipProvider>
);

export default OnsiteScheduling;
