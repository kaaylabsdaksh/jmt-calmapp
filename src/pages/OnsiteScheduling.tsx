import { useSearchParams } from "react-router-dom";
import { CalendarDays, List, Inbox } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SchedulingDataProvider, useSchedulingData } from "@/context/SchedulingDataContext";
import SchedulingCalendar from "@/components/onsite/SchedulingCalendar";
import UnscheduledWorkQueue from "@/components/onsite/UnscheduledWorkQueue";
import OnsiteProjects from "./OnsiteProjects";

const VALID_TABS = ["list", "calendar", "unscheduled"];

const SchedulingShell = () => {
  const { unscheduled } = useSchedulingData();
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("tab") ?? "";
  const tab = VALID_TABS.includes(param) ? param : "calendar";
  const setTab = (next: string) =>
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("tab", next);
      return p;
    }, { replace: true });


  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-3">
          <div>
            <h1 className="text-base font-semibold">Onsite Scheduling</h1>
            <p className="text-[11px] text-muted-foreground">
              Plan onsite jobs, technician availability and non-service time.
            </p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="h-8">
              <TabsTrigger value="list" className="h-6 text-[11px] gap-1">
                <List className="h-3.5 w-3.5" /> List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="h-6 text-[11px] gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> Calendar
              </TabsTrigger>
              <TabsTrigger value="unscheduled" className="h-6 text-[11px] gap-1">
                <Inbox className="h-3.5 w-3.5" /> Unscheduled Work
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px]">
                  {unscheduled.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-3">
              <OnsiteProjects embedded />
            </TabsContent>
            <TabsContent value="calendar" className="mt-3">
              <SchedulingCalendar />
            </TabsContent>
            <TabsContent value="unscheduled" className="mt-3">
              <UnscheduledWorkQueue />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const OnsiteScheduling = () => (
  <SchedulingDataProvider>
    <SchedulingShell />
  </SchedulingDataProvider>
);

export default OnsiteScheduling;
