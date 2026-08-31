import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarClock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useSchedulingData } from "@/context/SchedulingDataContext";
import {
  ANCHOR_DATE,
  UnscheduledWorkItem,
  formatShort,
} from "@/lib/onsite/schedulingData";
import TechnicianRosterPicker from "./TechnicianRosterPicker";

const LOCATIONS = ["Baton Rouge", "Houston", "Canada"];
const DIVISIONS = ["Calibration", "Field Service", "Repair"];

/** Canada accounts are prefixed CA- in the seed data. */
const guessLocation = (accountNumber: string) =>
  accountNumber.startsWith("CA-") ? "Canada" : "Baton Rouge";

export const UnscheduledWorkQueue = () => {
  const { unscheduled, addJob, removeUnscheduled } = useSchedulingData();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<UnscheduledWorkItem | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [division, setDivision] = useState("Calibration");
  const [technicianIds, setTechnicianIds] = useState<string[]>([]);

  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = !q
      ? [...unscheduled]
      : unscheduled.filter(
          (u) =>
            u.customer.toLowerCase().includes(q) ||
            u.accountNumber.toLowerCase().includes(q) ||
            u.salesRepCode.toLowerCase().includes(q),
        );
    return rows.sort((a, b) =>
      sortAsc
        ? a.targetWindowStart.localeCompare(b.targetWindowStart)
        : b.targetWindowStart.localeCompare(a.targetWindowStart),
    );
  }, [unscheduled, query, sortAsc]);


  const openSchedule = (item: UnscheduledWorkItem) => {
    setTarget(item);
    setStartDate(item.targetWindowStart);
    setEndDate(item.targetWindowEnd);
    setLocation(guessLocation(item.accountNumber));
    setDivision("Calibration");
    setTechnicianIds([]);
  };

  const handleSchedule = () => {
    if (!target) return;
    if (!startDate || !endDate || startDate > endDate) {
      toast({ variant: "destructive", title: "End date must be on or after the start date." });
      return;
    }
    if (!location) {
      toast({ variant: "destructive", title: "Select a location." });
      return;
    }
    if (technicianIds.length === 0) {
      toast({ variant: "destructive", title: "Select at least one technician." });
      return;
    }
    addJob({
      id: `job-${Date.now()}`,
      projectNumber: `PJ-${Math.floor(10300 + Math.random() * 500)}`,
      customers: [target.customer],
      accountNumber: target.accountNumber,
      location,
      division,
      status: "Green",
      osrStatus: "missing",
      startDate,
      endDate,
      technicianIds,
      notes: target.notes,
    });
    removeUnscheduled(target.id);
    toast({
      variant: "success",
      title: `${target.customer} scheduled for ${formatShort(startDate)}.`,
      duration: 2500,
    });
    setTarget(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer, account #, rep"
            className="h-7 pl-7 text-[11px]"
          />
        </div>
        <span className="text-[11px] text-muted-foreground">
          {filtered.length} of {unscheduled.length} awaiting scheduling
        </span>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-[11px]">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-2 py-1.5 font-semibold">Customer</th>
              <th className="px-2 py-1.5 font-semibold">Acct #</th>
              <th className="px-2 py-1.5 font-semibold">Target window</th>
              <th className="px-2 py-1.5 font-semibold">Rep</th>
              <th className="px-2 py-1.5 font-semibold">Notes</th>
              <th className="px-2 py-1.5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-6 text-center text-muted-foreground">
                  No unscheduled work matches this search.
                </td>
              </tr>
            )}
            {filtered.map((u) => {
              const inPast = u.targetWindowEnd < ANCHOR_DATE;
              return (
                <tr key={u.id} className="hover:bg-muted/40">
                  <td className="px-2 py-1.5 font-medium">{u.customer}</td>
                  <td className="px-2 py-1.5">{u.accountNumber}</td>
                  <td className="px-2 py-1.5 whitespace-nowrap">
                    {formatShort(u.targetWindowStart)} – {formatShort(u.targetWindowEnd)}
                    {inPast && (
                      <Badge variant="outline" className="ml-1.5 text-[9px] border-red-300 bg-red-50 text-red-700">
                        past due
                      </Badge>
                    )}
                  </td>
                  <td className="px-2 py-1.5">{u.salesRepCode}</td>
                  <td className="px-2 py-1.5 max-w-[280px] truncate text-muted-foreground" title={u.notes}>
                    {u.notes || "—"}
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <Button size="sm" variant="outline" className="h-6 text-[10.5px] gap-1" onClick={() => openSchedule(u)}>
                      <CalendarClock className="h-3 w-3" />
                      Schedule
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Schedule {target?.customer}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2.5">
            <p className="text-[11px] text-muted-foreground">
              Target window {target && `${formatShort(target.targetWindowStart)} – ${formatShort(target.targetWindowEnd)}`} · Acct {target?.accountNumber}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Start date</Label>
                <ModernDatePicker size="sm" value={startDate} onChange={(d) => setStartDate(d ? format(d, "yyyy-MM-dd") : "")} />
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">End date</Label>
                <ModernDatePicker size="sm" value={endDate} onChange={(d) => setEndDate(d ? format(d, "yyyy-MM-dd") : "")} />
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-7 text-[11px]"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Division</Label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TechnicianRosterPicker
              selected={technicianIds}
              onChange={setTechnicianIds}
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={handleSchedule}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnscheduledWorkQueue;
