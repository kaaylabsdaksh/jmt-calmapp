import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import ModernTopNav from "@/components/modern/ModernTopNav";

const searchFieldOptions = [
  { value: "projectNumber", label: "Project Number" },
  { value: "customerAcct", label: "Customer Acct" },
  { value: "customerName", label: "Customer Name" },
  { value: "createdBy", label: "Created By" },
  { value: "stdNumber", label: "Std #" },
  { value: "city", label: "City" },
];

const OnsiteProjects = () => {
  const [searchField, setSearchField] = useState("projectNumber");
  const [searchValue, setSearchValue] = useState("");

  const [status, setStatus] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [poReceived, setPoReceived] = useState("");
  const [salesperson, setSalesperson] = useState("");
  const [location, setLocation] = useState("");
  const [division, setDivision] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [stateVal, setStateVal] = useState("");

  const [startFrom, setStartFrom] = useState<Date | undefined>();
  const [startTo, setStartTo] = useState<Date | undefined>();
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>();
  const [createdTo, setCreatedTo] = useState<Date | undefined>();
  const [modifiedFrom, setModifiedFrom] = useState<Date | undefined>();
  const [modifiedTo, setModifiedTo] = useState<Date | undefined>();
  const [dateType, setDateType] = useState("start");

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

  const handleClear = () => {
    setSearchValue("");
    setStatus(""); setConfirmed(""); setPoReceived("");
    setSalesperson(""); setLocation(""); setDivision("");
    setVehicle(""); setStateVal("");
    setStartFrom(undefined); setStartTo(undefined);
    setCreatedFrom(undefined); setCreatedTo(undefined);
    setModifiedFrom(undefined); setModifiedTo(undefined);
  };

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-4">
          {/* Page header */}
          <div>
            <h1 className="text-xl font-semibold text-foreground">Onsite Projects</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Search and manage onsite calibration projects</p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-3 space-y-2">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Search Criteria
              </div>

              {/* Search type + value */}
              <div className="flex items-stretch gap-0 rounded-md border border-input bg-background overflow-hidden h-8">
                <Select value={searchField} onValueChange={setSearchField}>
                  <SelectTrigger className="h-8 w-44 text-xs border-0 border-r border-input rounded-none focus:ring-0 focus:ring-offset-0 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {searchFieldOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center pl-2 text-muted-foreground">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter value and press Enter or click Add..."
                  className="h-8 text-xs border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Date + Status */}
              {/* Date / Status / Salesperson / Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="checked-out">Checked Out</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={salesperson} onValueChange={setSalesperson}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Salesperson" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Salesperson</SelectItem>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Location" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Location</SelectItem>
                    <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
                    <SelectItem value="houston">Houston</SelectItem>
                    <SelectItem value="dallas">Dallas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Division / Vehicle / State / Confirmed / PO Received */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Division" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Division</SelectItem>
                    <SelectItem value="cal">Calibration</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="field">Field Service</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={vehicle} onValueChange={setVehicle}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Vehicle" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicle</SelectItem>
                    <SelectItem value="van-1">Van 1 - LA1234</SelectItem>
                    <SelectItem value="van-2">Van 2 - LA5678</SelectItem>
                    <SelectItem value="truck-1">Truck 1 - TX9012</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={stateVal} onValueChange={setStateVal}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All State" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All State</SelectItem>
                    <SelectItem value="LA">LA</SelectItem>
                    <SelectItem value="TX">TX</SelectItem>
                    <SelectItem value="MS">MS</SelectItem>
                    <SelectItem value="AL">AL</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={confirmed} onValueChange={setConfirmed}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Confirmed" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Confirmed</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={poReceived} onValueChange={setPoReceived}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All PO Received" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All PO Received</SelectItem>
                    <SelectItem value="yes">PO Received: Yes</SelectItem>
                    <SelectItem value="no">PO Received: No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleClear}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Clear All
                </Button>
                <Button size="sm" className="h-8 text-xs">
                  <Search className="h-3.5 w-3.5 mr-1.5" />Search
                </Button>
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
