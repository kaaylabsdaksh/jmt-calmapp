import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronsUpDown,

  FileDown,
  FileText,
  Search,
  X,
} from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";


/** Neutral selection styling for Reports controls (no brand yellow). */
const neutralRadioClass = "border-foreground/40 text-foreground hover:border-foreground";
const neutralCheckboxClass = "data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background";


type CriteriaKind = "work-order" | "cert-sheets" | "daily" | "account" | "equipment-list" | "esl-lab" | "esl-open" | "finished-items" | "labor-audit" | "labor-hours" | "tech-details" | "lab-log" | "lab-production" | "labor-transfer" | "logistics" | "need-by" | "onsite-log" | "onsite-open-returned" | "date-range" | "month" | "location" | "none";

type ReportDefinition = {
  name: string;
  category: string;
  criteria: CriteriaKind;
  description: string;
};

const reportGroups: Array<{ category: string; reports: Omit<ReportDefinition, "category">[] }> = [
  {
    category: "Documents",
    reports: [
      { name: "Blank Datasheets", criteria: "work-order", description: "Create blank datasheets for a work order." },
      { name: "Bucket Truck Reports", criteria: "work-order", description: "Create bucket truck reports by work order." },
      { name: "Cert Sheets", criteria: "cert-sheets", description: "Create certification sheets by work order and division." },
      { name: "Cert Sheets w/Datasheets", criteria: "cert-sheets", description: "Create certification sheets with supporting datasheets by division." },
      { name: "Equipment List", criteria: "equipment-list", description: "Export an equipment list using customer and date criteria." },
      { name: "Work Order Labels", criteria: "work-order", description: "Create printable labels for work order items." },
    ],
  },
  {
    category: "Operations",
    reports: [
      { name: "Daily Report", criteria: "daily", description: "Run daily activity for a location, division, lab code, and user." },
      { name: "Data Export Mod", criteria: "account", description: "Export modified operational records for an account." },
      { name: "Equipment Performance", criteria: "date-range", description: "Review equipment performance over time." },
      { name: "Finished Items Count", criteria: "finished-items", description: "Count completed items using detailed certification and equipment criteria." },
      { name: "Labor Audit", criteria: "labor-audit", description: "Review labor activity using certification, technician, and standards criteria." },
      { name: "Labor Hours", criteria: "labor-hours", description: "Summarize labor hours for a selected period." },
      { name: "Lab Log", criteria: "lab-log", description: "Create the lab activity log." },
      { name: "Lab Production", criteria: "lab-production", description: "Summarize lab production activity." },
      { name: "Labor Transfer", criteria: "labor-transfer", description: "Review labor transferred between work areas." },
      { name: "Logistics", criteria: "logistics", description: "Summarize logistics activity for the selected period." },
      { name: "Open Items Summary", criteria: "location", description: "Summarize currently open items by location." },
      { name: "Receiving Count", criteria: "date-range", description: "Count items received during a selected period." },
      { name: "Rental Accessories", criteria: "location", description: "List rental accessories by location." },
      { name: "Tech Details", criteria: "tech-details", description: "Review technician activity details." },
      { name: "Tech Labor", criteria: "date-range", description: "Summarize technician labor for a selected period." },
      { name: "Unfinished Items Count", criteria: "location", description: "Count unfinished items by location." },
      { name: "Work Order Data", criteria: "work-order", description: "Export detailed work order information." },
      { name: "Work Order Items", criteria: "work-order", description: "Export item details for a work order." },
    ],
  },
  {
    category: "ESL",
    reports: [
      { name: "ESL Lab Count", criteria: "esl-lab", description: "Count ESL lab work by comment date, groupable, and technician." },
      { name: "ESL Open Items", criteria: "esl-open", description: "Review open ESL items by location, groupable, and technician." },
      { name: "ESL Rubber Failure Analysis", criteria: "date-range", description: "Analyze ESL rubber failures over time." },
      { name: "Turnaround Time ESL", criteria: "date-range", description: "Review ESL turnaround performance." },
    ],
  },
  {
    category: "Onsite",
    reports: [
      { name: "Onsite EOJ Data", criteria: "work-order", description: "Export end-of-job onsite data." },
      { name: "Onsite Log", criteria: "onsite-log", description: "Review onsite activity for a selected period." },
      { name: "Onsite Open Items - Returned", criteria: "onsite-open-returned", description: "Review returned onsite items that remain open." },
      { name: "Onsite Project List", criteria: "location", description: "List onsite projects by location." },
      { name: "Onsite Tally", criteria: "work-order", description: "Summarize onsite item totals." },
    ],
  },
  {
    category: "Quality",
    reports: [
      { name: "QA Current Status", criteria: "location", description: "Review the current quality status by location." },
      { name: "QA Fail Item Type", criteria: "date-range", description: "Analyze failed items by item type." },
      { name: "QA Fail Item Count - Lab", criteria: "date-range", description: "Count lab quality failures for a selected period." },
      { name: "QA Fail Monthly Comparison", criteria: "month", description: "Compare quality failures across reporting months." },
      { name: "QA History", criteria: "date-range", description: "Review historical quality activity." },
    ],
  },
  {
    category: "Planning",
    reports: [
      { name: "Need By - Customer", criteria: "need-by", description: "Review customer need-by commitments." },
      { name: "Need By - Lab", criteria: "need-by", description: "Review lab need-by commitments." },
      { name: "Turnaround Time Lab", criteria: "date-range", description: "Review lab turnaround performance." },
    ],
  },
];

const reports = reportGroups.flatMap((group) =>
  group.reports.map((report) => ({ ...report, category: group.category })),
);

const locations = ["All Locations", "Baton Rouge, LA", "Beaumont, TX", "Corpus Christi, TX", "Houston, TX", "Lake Charles, LA", "Mobile, AL"];
const divisions = ["ESL", "OnSite", "MFG", "ITL", "Rental", "Regular", "Surplus", "ESL Onsite", "ITL Onsite"];
const groupables = ["SINGLES", "Blankets", "Bucket Trucks", "CoverUps", "Footwear", "Gloves", "Grounds"];
const technicians = ["All Technicians", "A. Broussard", "J. Carter", "M. Davis", "S. Patel"];
const labCodes = ["All Lab Codes", "ALEX", "BTR", "HOU", "LCH", "MOB"];

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function TextField({ label, value, onChange, numeric = false }: { label: string; value: string; onChange: (value: string) => void; numeric?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Input value={value} onChange={(event) => onChange(numeric ? event.target.value.replace(/[^0-9.]/g, "") : event.target.value)} className="h-9" inputMode={numeric ? "numeric" : undefined} />
    </div>
  );
}

function DateField({ label, value, onChange, id }: { label: string; value: string; onChange: (value: string) => void; id?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium">{label}</Label>
      <ModernDatePicker
        id={id}
        value={value || undefined}
        onChange={(date) => onChange(date ? format(date, "MM/dd/yyyy") : "")}
        size="lg"
        className="[&_button]:h-9"
        inputClassName="h-9"
      />
    </div>
  );
}


export default function Reports() {
  const [selectedName, setSelectedName] = useState("Blank Datasheets");
  const [search, setSearch] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [month, setMonth] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [division, setDivision] = useState("OnSite");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedGroupables, setSelectedGroupables] = useState<string[]>([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [labCode, setLabCode] = useState("All Lab Codes");
  const [technician, setTechnician] = useState("All Technicians");
  const [createdBy, setCreatedBy] = useState("Admin User");
  const [reprintDailyItems, setReprintDailyItems] = useState(false);
  const [withPricing, setWithPricing] = useState("No");
  const [includeLastComment, setIncludeLastComment] = useState("No");
  const [reportType, setReportType] = useState("Summary");
  const [conditionIn, setConditionIn] = useState("All Conditions");
  const [conditionOut, setConditionOut] = useState("All Conditions");
  const [manufacturer, setManufacturer] = useState("All Manufacturers");
  const [modelNumber, setModelNumber] = useState("All Models");
  const [productDescription, setProductDescription] = useState("");
  const [labStandards, setLabStandards] = useState("All Standards");
  const [creating, setCreating] = useState(false);
  const [acctType, setAcctType] = useState("All");
  const [itemStatus, setItemStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Report Number");
  const [dateType, setDateType] = useState("Departure");
  const [woType, setWoType] = useState("All Types");
  const [customerGroup, setCustomerGroup] = useState("All Groups");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const selectedReport = reports.find((report) => report.name === selectedName) ?? reports[0];
  const normalizedSearch = search.trim().toLowerCase();
  const visibleGroups = useMemo(
    () => reportGroups
      .map((group) => ({
        ...group,
        reports: group.reports.filter((report) => report.name.toLowerCase().includes(normalizedSearch)),
      }))
      .filter((group) => group.reports.length > 0),
    [normalizedSearch],
  );

  const clearCriteria = () => {
    setWorkOrder("");
    setDateFrom("");
    setDateTo("");
    setMonth("");
    setLocation("All Locations");
    setDivision("OnSite");
    setSelectedDivisions([]);
    setSelectedGroupables([]);
    setAccountNumber("");
    setLabCode("All Lab Codes");
    setTechnician("All Technicians");
    setCreatedBy("Admin User");
    setReprintDailyItems(false);
    setWithPricing("No");
    setIncludeLastComment("No");
    setReportType("Summary");
    setConditionIn("All Conditions");
    setConditionOut("All Conditions");
    setManufacturer("All Manufacturers");
    setModelNumber("All Models");
    setProductDescription("");
    setLabStandards("All Standards");
    setAcctType("All");
    setItemStatus("All Statuses");
    setSortBy(selectedName === "Onsite Log" ? "Cert Date" : "Report Number");
    setDateType("Departure");
    setWoType("All Types");
    setCustomerGroup("All Groups");
    setSelectedLocations([]);
  };

  const selectReport = (name: string) => {
    setSelectedName(name);
    clearCriteria();
    setSortBy(name === "Onsite Log" ? "Cert Date" : name === "Onsite Open Items - Returned" ? "Need By Date" : "Report Number");
    setReportType(name === "Labor Hours" ? "Location/Division" : "Summary");
  };

  const createPdf = () => {
    if (["work-order", "cert-sheets"].includes(selectedReport.criteria) && !workOrder.trim()) {
      toast({ title: "Work order required", description: "Enter a work order number before creating this report.", variant: "destructive" });
      return;
    }
    setCreating(true);
    window.setTimeout(() => {
      setCreating(false);
      toast({ title: "Report ready", description: `${selectedReport.name} has been prepared.` });
    }, 700);
  };

  return (
    <div className="min-h-full bg-background">
      <ModernTopNav />
      <main className="w-full px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
        <div className="grid min-h-[calc(100vh-7.5rem)] gap-4 lg:grid-cols-[minmax(270px,340px)_minmax(0,1fr)]">
          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="space-y-3 border-b border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-sm font-semibold">Report Catalog</CardTitle>
                <Badge variant="secondary" className="font-normal">{reports.length} reports</Badge>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search reports..."
                  aria-label="Search reports"
                  className="h-8 pl-8 pr-8 text-xs"
                />
                {search && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearch("")}
                    aria-label="Clear report search"
                    className="absolute right-0.5 top-1/2 h-7 w-7 -translate-y-1/2"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-13.5rem)] min-h-[440px]">
                <RadioGroup value={selectedName} onValueChange={selectReport} className="gap-0 p-2">
                  {visibleGroups.length === 0 ? (
                    <div className="px-3 py-10 text-center text-xs text-muted-foreground">No reports match your search.</div>
                  ) : visibleGroups.map((group) => (
                    <div key={group.category} className="mb-2 last:mb-0">
                      <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase text-muted-foreground">
                        {group.category}
                      </div>
                      <div className="space-y-0.5">
                        {group.reports.map((report) => {
                          const isSelected = report.name === selectedName;
                          return (
                            <Label
                              key={report.name}
                              htmlFor={`report-${report.name}`}
                              className={cn(
                                "flex min-h-8 cursor-pointer items-center gap-2 rounded-md border border-transparent px-2.5 py-1.5 text-xs font-medium transition-colors",
                                isSelected ? "border-border bg-muted text-foreground" : "text-foreground hover:bg-muted/60",
                              )}
                            >
                              <RadioGroupItem id={`report-${report.name}`} value={report.name} className={cn("h-3.5 w-3.5", neutralRadioClass)} />
                              <span className="min-w-0 flex-1 leading-4">{report.name}</span>
                            </Label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
            </CardContent>
          </Card>

          <section className="flex min-w-0 flex-col rounded-lg border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">{selectedReport.name}</h2>
                    <Badge variant="outline" className="font-normal">{selectedReport.category}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{selectedReport.description}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-5">
              <div className="max-w-4xl">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Report Criteria</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Set the information used to create this report.</p>
                </div>
                <Separator className="mb-5" />

                {selectedReport.criteria === "work-order" && (
                  <div className="max-w-sm space-y-1.5">
                    <Label htmlFor="report-work-order" className="text-xs font-medium">Work Order #<span className="ml-0.5 text-destructive">*</span></Label>
                    <Input
                      id="report-work-order"
                      value={workOrder}
                      onChange={(event) => setWorkOrder(event.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="Enter work order number"
                      inputMode="numeric"
                      className="h-9"
                    />
                  </div>
                )}

                {selectedReport.criteria === "cert-sheets" && (
                  <div className="grid max-w-3xl gap-5 md:grid-cols-[minmax(0,1fr)_minmax(260px,1fr)]">
                    <TextField label="Work Order # *" value={workOrder} onChange={setWorkOrder} numeric />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium">Division(s)</Label>
                        <Button variant="link" className="h-auto p-0 text-xs text-foreground" onClick={() => setSelectedDivisions(selectedDivisions.length === divisions.length ? [] : divisions)}>
                          {selectedDivisions.length === divisions.length ? "Clear All" : "Select All"}
                        </Button>
                      </div>
                      <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto rounded-md border border-border p-3">
                        {divisions.map((item) => <Label key={item} className="flex cursor-pointer items-center gap-2 text-xs font-normal"><Checkbox className={neutralCheckboxClass} checked={selectedDivisions.includes(item)} onCheckedChange={(checked) => setSelectedDivisions((current) => checked ? [...current, item] : current.filter((value) => value !== item))} />{item}</Label>)}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.criteria === "daily" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Created Date" value={dateFrom} onChange={setDateFrom} />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Division" value={division} onChange={setDivision} options={divisions} />
                    <SelectField label="Lab Code" value={labCode} onChange={setLabCode} options={labCodes} />
                    <SelectField label="Created By" value={createdBy} onChange={setCreatedBy} options={["Admin User", "M. Alvarez", "S. Patel"]} />
                    <Label className="flex h-9 cursor-pointer items-center gap-2 self-end rounded-md border border-border px-3 text-xs font-normal"><Checkbox className={neutralCheckboxClass} checked={reprintDailyItems} onCheckedChange={(checked) => setReprintDailyItems(checked === true)} />Reprint Daily Items</Label>
                    <p className="sm:col-span-2 lg:col-span-3 text-xs text-muted-foreground">Running this report marks items as printed. Select Reprint Daily Items to include them again.</p>
                  </div>
                )}

                {selectedReport.criteria === "account" && (
                  <div className="max-w-sm"><TextField label="Account Number" value={accountNumber} onChange={setAccountNumber} numeric /></div>
                )}

                {selectedReport.criteria === "equipment-list" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Start Date" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="End Date" value={dateTo} onChange={setDateTo} />
                    <TextField label="Account Number" value={accountNumber} onChange={setAccountNumber} numeric />
                    <SelectField label="With Pricing" value={withPricing} onChange={setWithPricing} options={["No", "Yes"]} />
                    <SelectField label="Include Last Comment" value={includeLastComment} onChange={setIncludeLastComment} options={["No", "Yes"]} />
                    <Alert className="sm:col-span-2 lg:col-span-3 border-border bg-muted/40"><AlertTriangle className="h-4 w-4" /><AlertDescription className="text-xs">Review exported columns and remove customer-inappropriate information before sharing.</AlertDescription></Alert>
                  </div>
                )}

                {(selectedReport.criteria === "esl-lab" || selectedReport.criteria === "esl-open") && (
                  <div className="max-w-4xl space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedReport.criteria === "esl-lab" && <DateField label="Comment Date Start" value={dateFrom} onChange={setDateFrom} />}
                      {selectedReport.criteria === "esl-lab" && <DateField label="Comment Date End" value={dateTo} onChange={setDateTo} />}
                      <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                      <SelectField label="Technician" value={technician} onChange={setTechnician} options={technicians} />
                      {selectedReport.criteria === "esl-lab" && <SelectField label="Report Type" value={reportType} onChange={setReportType} options={["Summary", "Detail"]} />}
                    </div>
                    <div className="max-w-xl space-y-2">
                      <div className="flex items-center justify-between gap-2"><Label className="text-xs font-medium">Groupable(s)</Label><Button variant="link" className="h-auto p-0 text-xs text-foreground" onClick={() => setSelectedGroupables(selectedGroupables.length === groupables.length ? [] : groupables)}>{selectedGroupables.length === groupables.length ? "Clear All" : "Select All"}</Button></div>
                      <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3 sm:grid-cols-4">{groupables.map((item) => <Label key={item} className="flex cursor-pointer items-center gap-2 text-xs font-normal"><Checkbox className={neutralCheckboxClass} checked={selectedGroupables.includes(item)} onCheckedChange={(checked) => setSelectedGroupables((current) => checked ? [...current, item] : current.filter((value) => value !== item))} />{item}</Label>)}</div>
                    </div>
                  </div>
                )}

                {selectedReport.criteria === "finished-items" && (
                  <div className="grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Cert/Completion Start" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="Cert/Completion End" value={dateTo} onChange={setDateTo} />
                    <TextField label="Work Order #" value={workOrder} onChange={setWorkOrder} numeric />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Division" value={division} onChange={setDivision} options={divisions} />
                    <SelectField label="Lab Code" value={labCode} onChange={setLabCode} options={labCodes} />
                    <SelectField label="Technician" value={technician} onChange={setTechnician} options={technicians} />
                    <TextField label="Account Number" value={accountNumber} onChange={setAccountNumber} numeric />
                    <SelectField label="Condition In" value={conditionIn} onChange={setConditionIn} options={["All Conditions", "Good", "Damaged", "Unknown"]} />
                    <SelectField label="Condition Out" value={conditionOut} onChange={setConditionOut} options={["All Conditions", "Good", "Repaired", "Failed"]} />
                    <SelectField label="Manufacturer" value={manufacturer} onChange={setManufacturer} options={["All Manufacturers", "Fluke", "Megger", "Hubbell"]} />
                    <SelectField label="Model Number" value={modelNumber} onChange={setModelNumber} options={["All Models", "Model 1", "Model 2"]} />
                    <TextField label="Product Description" value={productDescription} onChange={setProductDescription} />
                    <SelectField label="Report Type" value={reportType} onChange={setReportType} options={["Summary", "Detail"]} />
                  </div>
                )}

                {selectedReport.criteria === "labor-hours" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Cert/Completion Start" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="Cert/Completion End" value={dateTo} onChange={setDateTo} />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Division" value={division} onChange={setDivision} options={divisions} />
                    <SelectField label="Technician" value={technician} onChange={setTechnician} options={technicians} />
                    <SelectField label="Account Type" value={acctType} onChange={setAcctType} options={["All", "Customer", "Internal"]} />
                    <SelectField label="Report Type" value={reportType} onChange={setReportType} options={["Location/Division", "Technician", "Summary", "Detail"]} />
                  </div>
                )}

                {selectedReport.criteria === "lab-log" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TextField label="Work Order #" value={workOrder} onChange={setWorkOrder} numeric />
                    <SelectField label="Item Status" value={itemStatus} onChange={setItemStatus} options={["All Statuses", "Open", "In Progress", "Completed", "Back to Customer"]} />
                    <SelectField label="Sort Report By" value={sortBy} onChange={setSortBy} options={["Report Number", "Cert Date", "Item Status"]} />
                  </div>
                )}

                {selectedReport.criteria === "lab-production" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Cert Created Start" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="Cert Created End" value={dateTo} onChange={setDateTo} />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Division" value={division} onChange={setDivision} options={divisions} />
                    <SelectField label="Lab Code" value={labCode} onChange={setLabCode} options={labCodes} />
                    <SelectField label="Technician" value={technician} onChange={setTechnician} options={technicians} />
                    <SelectField label="Lab Standards" value={labStandards} onChange={setLabStandards} options={["All Standards", "STD-1001", "STD-1002", "STD-2040"]} />
                    <SelectField label="Report Type" value={reportType} onChange={setReportType} options={["Summary", "Detail"]} />
                  </div>
                )}

                {selectedReport.criteria === "labor-transfer" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Start Date" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="End Date" value={dateTo} onChange={setDateTo} />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Report Type" value={reportType} onChange={setReportType} options={["Summary", "Detail"]} />
                  </div>
                )}

                {selectedReport.criteria === "logistics" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Start Date" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="End Date" value={dateTo} onChange={setDateTo} />
                    <SelectField label="Date Type" value={dateType} onChange={setDateType} options={["Departure", "Arrival"]} />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Division" value={division} onChange={setDivision} options={divisions} />
                  </div>
                )}

                {selectedReport.criteria === "need-by" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Need By Start" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="Need By End" value={dateTo} onChange={setDateTo} />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Division" value={division} onChange={setDivision} options={divisions} />
                    <SelectField label="Work Order Type" value={woType} onChange={setWoType} options={["All Types", "Regular", "OnSite", "ESL"]} />
                    <SelectField label="Lab Code" value={labCode} onChange={setLabCode} options={labCodes} />
                  </div>
                )}

                {selectedReport.criteria === "onsite-log" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TextField label="Work Order #" value={workOrder} onChange={setWorkOrder} numeric />
                    <SelectField label="Item Status" value={itemStatus} onChange={setItemStatus} options={["All Statuses", "Open", "In Progress", "Completed"]} />
                    <SelectField label="Sort Report By" value={sortBy} onChange={setSortBy} options={["Cert Date", "Report Number", "Item Status"]} />
                  </div>
                )}

                {selectedReport.criteria === "onsite-open-returned" && (
                  <div className="grid max-w-4xl gap-5 md:grid-cols-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DateField label="Item Created Start" value={dateFrom} onChange={setDateFrom} />
                      <DateField label="Item Created End" value={dateTo} onChange={setDateTo} />
                      <SelectField label="Customer Group" value={customerGroup} onChange={setCustomerGroup} options={["All Groups", "Utilities", "Industrial", "Government"]} />
                      <SelectField label="Sort Report By" value={sortBy} onChange={setSortBy} options={["Need By Date", "Report Number", "Account"]} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium">Location(s)</Label>
                        <Button variant="link" className="h-auto p-0 text-xs text-foreground" onClick={() => { const all = locations.slice(1); setSelectedLocations(selectedLocations.length === all.length ? [] : all); }}>
                          {selectedLocations.length === locations.length - 1 ? "Clear All" : "Select All"}
                        </Button>
                      </div>
                      <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto rounded-md border border-border p-3">
                        {locations.slice(1).map((item) => <Label key={item} className="flex cursor-pointer items-center gap-2 text-xs font-normal"><Checkbox className={neutralCheckboxClass} checked={selectedLocations.includes(item)} onCheckedChange={(checked) => setSelectedLocations((current) => checked ? [...current, item] : current.filter((value) => value !== item))} />{item}</Label>)}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.criteria === "tech-details" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Cert/Completion Start" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="Cert/Completion End" value={dateTo} onChange={setDateTo} />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Division" value={division} onChange={setDivision} options={divisions} />
                    <SelectField label="Lab Code" value={labCode} onChange={setLabCode} options={labCodes} />
                    <SelectField label="Technician" value={technician} onChange={setTechnician} options={technicians} />
                    <SelectField label="Manufacturer" value={manufacturer} onChange={setManufacturer} options={["All Manufacturers", "Fluke", "Megger", "Hubbell"]} />
                    <SelectField label="Model Number" value={modelNumber} onChange={setModelNumber} options={["All Models", "Model 1", "Model 2"]} />
                    <TextField label="Product Description" value={productDescription} onChange={setProductDescription} />
                    <TextField label="Account Number" value={accountNumber} onChange={setAccountNumber} numeric />
                  </div>
                )}

                {selectedReport.criteria === "labor-audit" && (
                  <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DateField label="Cert Created Start" value={dateFrom} onChange={setDateFrom} />
                    <DateField label="Cert Created End" value={dateTo} onChange={setDateTo} />
                    <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
                    <SelectField label="Division" value={division} onChange={setDivision} options={divisions} />
                    <SelectField label="Lab Code" value={labCode} onChange={setLabCode} options={labCodes} />
                    <SelectField label="Technician" value={technician} onChange={setTechnician} options={technicians} />
                    <SelectField label="Lab Standards" value={labStandards} onChange={setLabStandards} options={["All Standards", "ISO/IEC 17025", "Customer Standard", "Internal Standard"]} />
                  </div>
                )}

                {selectedReport.criteria === "date-range" && (
                  <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
                    <DateField id="report-date-from" label="From Date" value={dateFrom} onChange={setDateFrom} />
                    <DateField id="report-date-to" label="To Date" value={dateTo} onChange={setDateTo} />
                  </div>
                )}


                {selectedReport.criteria === "month" && (
                  <div className="max-w-sm space-y-1.5">
                    <Label htmlFor="report-month" className="text-xs font-medium">Reporting Month</Label>
                    <Input id="report-month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="h-9" />
                  </div>
                )}

                {selectedReport.criteria === "location" && (
                  <div className="max-w-sm space-y-1.5">
                    <Label className="text-xs font-medium">Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {locations.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedReport.criteria === "none" && (
                  <div className="flex max-w-xl items-center gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
                    No additional criteria are required for this report.
                  </div>
                )}

                <Alert className="mt-8 max-w-3xl border-border bg-muted/40">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <AlertDescription className="text-xs text-muted-foreground">
                    Reports with a large number of records may take a minute or two to prepare.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-border bg-card px-4 py-3 sm:px-5">
              <Button variant="outline" onClick={clearCriteria} disabled={creating}>Clear</Button>
              <Button onClick={createPdf} disabled={creating} className="bg-foreground text-background hover:bg-foreground/90">
                <FileDown className="mr-2 h-4 w-4" />
                {creating ? "Preparing..." : selectedReport.name === "Blank Datasheets" ? "Create PDF" : selectedReport.name === "Equipment List" ? "Export Data" : "Run Report"}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}