import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import ModernTopNav from "@/components/modern/ModernTopNav";

const OnsiteProjects = () => {
  const [projectNum, setProjectNum] = useState("");
  const [status, setStatus] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [stdNum, setStdNum] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [poReceived, setPoReceived] = useState("");

  const [custAcct, setCustAcct] = useState("");
  const [custName, setCustName] = useState("");
  const [salesperson, setSalesperson] = useState("");
  const [location, setLocation] = useState("");
  const [division, setDivision] = useState("");
  const [vehicle, setVehicle] = useState("");

  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");

  const [startFrom, setStartFrom] = useState<Date | undefined>();
  const [startTo, setStartTo] = useState<Date | undefined>();
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>();
  const [createdTo, setCreatedTo] = useState<Date | undefined>();
  const [modifiedFrom, setModifiedFrom] = useState<Date | undefined>();
  const [modifiedTo, setModifiedTo] = useState<Date | undefined>();
  const [dateType, setDateType] = useState("start");

  const handleClear = () => {
    setProjectNum(""); setStatus(""); setCreatedBy(""); setStdNum("");
    setConfirmed(""); setPoReceived("");
    setCustAcct(""); setCustName(""); setSalesperson(""); setLocation("");
    setDivision(""); setVehicle("");
    setCity(""); setStateVal("");
    setStartFrom(undefined); setStartTo(undefined);
    setCreatedFrom(undefined); setCreatedTo(undefined);
    setModifiedFrom(undefined); setModifiedTo(undefined);
  };

  const dateFromMap: Record<string, Date | undefined> = {
    start: startFrom, created: createdFrom, modified: modifiedFrom,
  };
  const dateToMap: Record<string, Date | undefined> = {
    start: startTo, created: createdTo, modified: modifiedTo,
  };
  const setDateFrom = (d?: Date) => {
    if (dateType === "start") setStartFrom(d);
    else if (dateType === "created") setCreatedFrom(d);
    else setModifiedFrom(d);
  };
  const setDateTo = (d?: Date) => {
    if (dateType === "start") setStartTo(d);
    else if (dateType === "created") setCreatedTo(d);
    else setModifiedTo(d);
  };

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-4">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Onsite Projects</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Search and manage onsite calibration projects</p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-3 space-y-2">
              {/* Row 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Project #</Label>
                  <Input value={projectNum} onChange={(e) => setProjectNum(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="checked-out">Checked Out</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Created By</Label>
                  <Input value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Std #</Label>
                  <Input value={stdNum} onChange={(e) => setStdNum(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Confirmed</Label>
                  <Select value={confirmed} onValueChange={setConfirmed}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">PO Received</Label>
                  <Select value={poReceived} onValueChange={setPoReceived}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2 - Customer + Location */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Customer Acct</Label>
                  <Input value={custAcct} onChange={(e) => setCustAcct(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1 lg:col-span-2">
                  <Label className="text-[11px] text-muted-foreground">Customer Name</Label>
                  <Input value={custName} onChange={(e) => setCustName(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Salesperson</Label>
                  <Select value={salesperson} onValueChange={setSalesperson}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
                      <SelectItem value="houston">Houston</SelectItem>
                      <SelectItem value="dallas">Dallas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">Division</Label>
                  <Select value={division} onValueChange={setDivision}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cal">Calibration</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="field">Field Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3 - Vehicle + City/State + Date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <div className="space-y-1 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] text-muted-foreground">Vehicle</Label>
                    <button className="text-[10px] text-primary hover:underline">+ Add Vehicle</button>
                  </div>
                  <Select value={vehicle} onValueChange={setVehicle}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="van-1">Van 1 - LA1234</SelectItem>
                      <SelectItem value="van-2">Van 2 - LA5678</SelectItem>
                      <SelectItem value="truck-1">Truck 1 - TX9012</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} className="h-7 text-xs" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-[11px] text-muted-foreground">State</Label>
                  <Select value={stateVal} onValueChange={setStateVal}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LA">LA</SelectItem>
                      <SelectItem value="TX">TX</SelectItem>
                      <SelectItem value="MS">MS</SelectItem>
                      <SelectItem value="AL">AL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 lg:col-span-2">
                  <Label className="text-[11px] text-muted-foreground">Date Range</Label>
                  <DateRangePicker
                    dateFrom={dateFromMap[dateType]}
                    dateTo={dateToMap[dateType]}
                    onDateFromChange={setDateFrom}
                    onDateToChange={setDateTo}
                    dateType={dateType}
                    onDateTypeChange={setDateType}
                    dateTypeOptions={[
                      { value: "start", label: "Start" },
                      { value: "created", label: "Created" },
                      { value: "modified", label: "Modified" },
                    ]}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-7 text-xs"><Search className="h-3.5 w-3.5 mr-1.5" />Search</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleClear}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[11px] uppercase tracking-wide">Project #</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">Status</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">JM Location</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">Cust Acct(s)</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">Customer(s)</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">Start Date</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">Created</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">Created By</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide text-right"># CO</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">PO Rcv'd</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide">Confirmed</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide text-right">Quote Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-xs text-muted-foreground py-12">
                      No data to display
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OnsiteProjects;
