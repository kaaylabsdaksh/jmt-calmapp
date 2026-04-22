import { useState } from "react";
import { Search, RotateCcw, Plus, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import ModernTopNav from "@/components/modern/ModernTopNav";

interface SearchChip {
  id: string;
  field: string;
  fieldLabel: string;
  value: string;
}

interface ProjectRow {
  projectNumber: string;
  status: string;
  jmLocation: string;
  custAcct: string;
  customer: string;
  startDate: string;
  created: string;
  createdBy: string;
  numCO: number;
  poRcvd: string;
  confirmed: string;
  quoteTotal: number;
}

interface EquipmentRow {
  vehicle: string;
  stdNo: string;
  manufacturer: string;
  model: string;
  nextCalDate: string;
}

const mockEquipment: EquipmentRow[] = [
  { vehicle: "36", stdNo: "2397", manufacturer: "HIGH VOLTAGE", model: "ALT-120/60", nextCalDate: "06/02/2026" },
  { vehicle: "36", stdNo: "2486", manufacturer: "PHENIX TECH", model: "BK130/36", nextCalDate: "02/02/2027" },
  { vehicle: "36", stdNo: "4152", manufacturer: "DILLON", model: "0-1000 LBS", nextCalDate: "07/07/2026" },
  { vehicle: "36", stdNo: "4335", manufacturer: "HABOTEST", model: "HT106B", nextCalDate: "07/31/2026" },
  { vehicle: "36", stdNo: "4336", manufacturer: "HABOTEST", model: "HT106B", nextCalDate: "07/31/2026" },
  { vehicle: "36", stdNo: "4498", manufacturer: "AEMC", model: "6255", nextCalDate: "01/12/2027" },
  { vehicle: "36", stdNo: "4526", manufacturer: "HD ELECTRIC", model: "DVM-80", nextCalDate: "02/28/2027" },
];

const mockProjects: ProjectRow[] = [
  { projectNumber: "0007020", status: "Completed", jmLocation: "Baton Rouge", custAcct: "2588.00", customer: "John Deere", startDate: "3/20/2023", created: "03/20/2023 07:07 AM", createdBy: "Christian B. ONeal", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007051", status: "Completed", jmLocation: "Baton Rouge", custAcct: "10323.00, 10323.04", customer: "Sabal Trail Transmission LLC", startDate: "3/27/2023", created: "03/27/2023 07:54 AM", createdBy: "Jerome J. Davis", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007056", status: "Completed", jmLocation: "Baton Rouge", custAcct: "0185.12", customer: "Entergy Mississippi LLC", startDate: "3/27/2023", created: "03/27/2023 07:18 AM", createdBy: "Vincent E. Lloyde", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007057", status: "Completed", jmLocation: "Baton Rouge", custAcct: "1790.00", customer: "Shintech", startDate: "3/30/2023", created: "03/30/2023 07:38 AM", createdBy: "Vincent E. Lloyde", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007058", status: "Completed", jmLocation: "Baton Rouge", custAcct: "4051.00", customer: "Pinnacle Polymers", startDate: "3/27/2023", created: "03/27/2023 07:34 AM", createdBy: "Lucas M Roberts", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007060", status: "Completed", jmLocation: "Baton Rouge", custAcct: "0367.00", customer: "Occidental Chem", startDate: "3/27/2023", created: "03/27/2023 06:23 AM", createdBy: "Christian B. ONeal", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007080", status: "Completed", jmLocation: "Baton Rouge", custAcct: "3098.00, 6158.14", customer: "Cheniere Sabine Pass, Zachry Industrial Inc", startDate: "4/3/2023", created: "04/03/2023 06:41 AM", createdBy: "Christian B. ONeal", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007091", status: "Completed", jmLocation: "Baton Rouge", custAcct: "6941.00", customer: "Wolseley Industrial", startDate: "3/29/2023", created: "03/29/2023 06:46 AM", createdBy: "Christian B. ONeal", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007093", status: "Completed", jmLocation: "Baton Rouge", custAcct: "0364.03, 0364.10, 0364.11", customer: "Marathon Petro Elect, Marathon Petro Inst...", startDate: "4/3/2023", created: "04/03/2023 06:55 AM", createdBy: "Jerome J. Davis", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
  { projectNumber: "0007130", status: "Completed", jmLocation: "Baton Rouge", custAcct: "2343.07", customer: "LA Integrated PE JV LLC Whse", startDate: "4/17/2023", created: "04/17/2023 06:49 AM", createdBy: "Vincent E. Lloyde", numCO: 0, poRcvd: "No", confirmed: "No", quoteTotal: 0.0 },
];

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
  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);

  const addSearchChip = () => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    const fieldLabel = searchFieldOptions.find(o => o.value === searchField)?.label ?? searchField;
    setSearchChips(prev => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, field: searchField, fieldLabel, value: trimmed },
    ]);
    setSearchValue("");
  };

  const removeSearchChip = (id: string) => {
    setSearchChips(prev => prev.filter(c => c.id !== id));
  };

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

  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<ProjectRow[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSearch = () => {
    setResults(mockProjects);
    setHasSearched(true);
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchChips([]);
    setStatus(""); setConfirmed(""); setPoReceived("");
    setSalesperson(""); setLocation(""); setDivision("");
    setVehicle(""); setStateVal("");
    setStartFrom(undefined); setStartTo(undefined);
    setCreatedFrom(undefined); setCreatedTo(undefined);
    setModifiedFrom(undefined); setModifiedTo(undefined);
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-4">
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSearchChip();
                    }
                  }}
                  placeholder="Enter value and press Enter or click Add..."
                  className="h-8 text-xs border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={addSearchChip}
                  disabled={!searchValue.trim()}
                  className="h-8 px-3 text-xs rounded-none border-l border-input"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />Add
                </Button>
              </div>

              {/* Active search chips */}
              {searchChips.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {searchChips.map(chip => (
                    <Badge
                      key={chip.id}
                      className="h-6 text-[11px] font-normal pl-2 pr-1 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <span className="opacity-70">{chip.fieldLabel}:</span>
                      <span>{chip.value}</span>
                      <button
                        type="button"
                        onClick={() => removeSearchChip(chip.id)}
                        className="ml-0.5 rounded-sm hover:bg-primary-foreground/20 p-0.5"
                        aria-label={`Remove ${chip.fieldLabel} ${chip.value}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

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
              <div className="flex justify-end gap-2 pt-1.5">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="rounded-lg h-8 px-4 text-xs font-medium border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Clear All
                </Button>
                <Button
                  onClick={handleSearch}
                  className="rounded-lg h-8 px-5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Search className="h-3.5 w-3.5 mr-1.5" />
                  Search
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
                  {!hasSearched || results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center text-xs text-muted-foreground py-12">
                        No data to display
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((row) => (
                      <TableRow key={row.projectNumber} className="text-xs">
                        <TableCell className="py-2">
                          <button className="text-blue-600 hover:underline font-medium">
                            {row.projectNumber}
                          </button>
                        </TableCell>
                        <TableCell className="py-2">{row.status}</TableCell>
                        <TableCell className="py-2">{row.jmLocation}</TableCell>
                        <TableCell className="py-2">{row.custAcct}</TableCell>
                        <TableCell className="py-2">{row.customer}</TableCell>
                        <TableCell className="py-2">{row.startDate}</TableCell>
                        <TableCell className="py-2">{row.created}</TableCell>
                        <TableCell className="py-2">{row.createdBy}</TableCell>
                        <TableCell className="py-2 text-right">{row.numCO}</TableCell>
                        <TableCell className="py-2">{row.poRcvd}</TableCell>
                        <TableCell className="py-2">{row.confirmed}</TableCell>
                        <TableCell className="py-2 text-right">{row.quoteTotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
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
