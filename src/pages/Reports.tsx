import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type CriteriaKind = "work-order" | "date-range" | "month" | "location" | "none";

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
      { name: "Cert Sheets", criteria: "work-order", description: "Create certification sheets for a work order." },
      { name: "Cert Sheets w/Datasheets", criteria: "work-order", description: "Create certification sheets with supporting datasheets." },
      { name: "Equipment List", criteria: "work-order", description: "List equipment associated with a work order." },
      { name: "Work Order Labels", criteria: "work-order", description: "Create printable labels for work order items." },
    ],
  },
  {
    category: "Operations",
    reports: [
      { name: "Daily Report", criteria: "date-range", description: "Review operational activity for a selected date range." },
      { name: "Data Export Mod", criteria: "date-range", description: "Export modified operational records." },
      { name: "Equipment Performance", criteria: "date-range", description: "Review equipment performance over time." },
      { name: "Finished Items Count", criteria: "date-range", description: "Count completed items during a selected period." },
      { name: "Labor Audit", criteria: "date-range", description: "Review recorded labor activity and adjustments." },
      { name: "Labor Hours", criteria: "date-range", description: "Summarize labor hours for a selected period." },
      { name: "Lab Log", criteria: "date-range", description: "Create the lab activity log." },
      { name: "Lab Production", criteria: "date-range", description: "Summarize lab production activity." },
      { name: "Labor Transfer", criteria: "date-range", description: "Review labor transferred between work areas." },
      { name: "Logistics", criteria: "date-range", description: "Summarize logistics activity for the selected period." },
      { name: "Open Items Summary", criteria: "location", description: "Summarize currently open items by location." },
      { name: "Receiving Count", criteria: "date-range", description: "Count items received during a selected period." },
      { name: "Rental Accessories", criteria: "location", description: "List rental accessories by location." },
      { name: "Tech Details", criteria: "date-range", description: "Review technician activity details." },
      { name: "Tech Labor", criteria: "date-range", description: "Summarize technician labor for a selected period." },
      { name: "Unfinished Items Count", criteria: "location", description: "Count unfinished items by location." },
      { name: "Work Order Data", criteria: "work-order", description: "Export detailed work order information." },
      { name: "Work Order Items", criteria: "work-order", description: "Export item details for a work order." },
    ],
  },
  {
    category: "ESL",
    reports: [
      { name: "ESL Lab Count", criteria: "date-range", description: "Count ESL lab work for a selected period." },
      { name: "ESL Open Items", criteria: "location", description: "Review open ESL items by location." },
      { name: "ESL Rubber Failure Analysis", criteria: "date-range", description: "Analyze ESL rubber failures over time." },
      { name: "Turnaround Time ESL", criteria: "date-range", description: "Review ESL turnaround performance." },
    ],
  },
  {
    category: "Onsite",
    reports: [
      { name: "Onsite EOJ Data", criteria: "date-range", description: "Export end-of-job onsite data." },
      { name: "Onsite Log", criteria: "date-range", description: "Review onsite activity for a selected period." },
      { name: "Onsite Open Items - Returned", criteria: "location", description: "Review returned onsite items that remain open." },
      { name: "Onsite Project List", criteria: "location", description: "List onsite projects by location." },
      { name: "Onsite Tally", criteria: "date-range", description: "Summarize onsite item totals." },
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
      { name: "Need By - Customer", criteria: "date-range", description: "Review customer need-by commitments." },
      { name: "Need By - Lab", criteria: "date-range", description: "Review lab need-by commitments." },
      { name: "Turnaround Time Lab", criteria: "date-range", description: "Review lab turnaround performance." },
    ],
  },
];

const reports = reportGroups.flatMap((group) =>
  group.reports.map((report) => ({ ...report, category: group.category })),
);

const locations = ["All Locations", "Baton Rouge, LA", "Beaumont, TX", "Corpus Christi, TX", "Houston, TX", "Lake Charles, LA", "Mobile, AL"];

export default function Reports() {
  const [selectedName, setSelectedName] = useState("Blank Datasheets");
  const [search, setSearch] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [month, setMonth] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [creating, setCreating] = useState(false);

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
  };

  const selectReport = (name: string) => {
    setSelectedName(name);
    clearCriteria();
  };

  const createPdf = () => {
    if (selectedReport.criteria === "work-order" && !workOrder.trim()) {
      toast({ title: "Work order required", description: "Enter a work order number before creating this report.", variant: "destructive" });
      return;
    }
    setCreating(true);
    window.setTimeout(() => {
      setCreating(false);
      toast({ title: "Report ready", description: `${selectedReport.name} has been prepared as a PDF.` });
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
                              <RadioGroupItem id={`report-${report.name}`} value={report.name} className="h-3.5 w-3.5" />
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

                {selectedReport.criteria === "date-range" && (
                  <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="report-date-from" className="text-xs font-medium">From Date</Label>
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input id="report-date-from" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="h-9 pl-8" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="report-date-to" className="text-xs font-medium">To Date</Label>
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input id="report-date-to" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="h-9 pl-8" />
                      </div>
                    </div>
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
                {creating ? "Preparing PDF..." : "Create PDF"}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}