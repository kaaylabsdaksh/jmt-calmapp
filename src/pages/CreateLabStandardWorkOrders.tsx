import { Fragment, useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileCheck2,
  Play,
  RotateCcw,
} from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LabWorkOrderItem {
  id: string;
  workOrderNo: string;
  account: string;
  reportNo: string;
  createdDate: string;
  calibrationFrequency: number;
  serial: string;
  customerId: string;
  purchaseOrder: string;
  action: string;
  standardNo: string;
}

interface LabWorkOrderGroup {
  workOrderNo: string;
  account: string;
  items: LabWorkOrderItem[];
}

const PREVIEW_GROUPS: LabWorkOrderGroup[] = [
  {
    workOrderNo: "803918",
    account: "0152.00",
    items: [
      {
        id: "803918-001",
        workOrderNo: "803918",
        account: "0152.00",
        reportNo: "0152.00-803918-001",
        createdDate: "09/14/2026",
        calibrationFrequency: 24,
        serial: "920106",
        customerId: "200",
        purchaseOrder: "W/OPO",
        action: "C/C",
        standardNo: "1832",
      },
    ],
  },
  {
    workOrderNo: "803919",
    account: "0152.02",
    items: [
      {
        id: "803919-001",
        workOrderNo: "803919",
        account: "0152.02",
        reportNo: "0152.02-803919-001",
        createdDate: "09/14/2026",
        calibrationFrequency: 0,
        serial: "3623A01945",
        customerId: "1770",
        purchaseOrder: "W/OPO",
        action: "C/C",
        standardNo: "2522",
      },
    ],
  },
  {
    workOrderNo: "803920",
    account: "0152.16",
    items: [
      {
        id: "803920-001",
        workOrderNo: "803920",
        account: "0152.16",
        reportNo: "0152.16-803920-001",
        createdDate: "09/14/2026",
        calibrationFrequency: 60,
        serial: "N/A",
        customerId: "3771.1",
        purchaseOrder: "W/OPO",
        action: "C/C",
        standardNo: "2719",
      },
      {
        id: "803920-002",
        workOrderNo: "803920",
        account: "0152.16",
        reportNo: "0152.16-803920-002",
        createdDate: "09/14/2026",
        calibrationFrequency: 60,
        serial: "N/A",
        customerId: "3771.2",
        purchaseOrder: "W/OPO",
        action: "C/C",
        standardNo: "4263",
      },
    ],
  },
];

const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const downloadCsv = (filename: string, rows: Array<Array<string | number>>) => {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const CreateLabStandardWorkOrders = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [excluded, setExcluded] = useState("");
  const [hasPreview, setHasPreview] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const excludedStandards = useMemo(
    () => new Set(excluded.split(",").map((value) => value.trim()).filter(Boolean)),
    [excluded]
  );

  const groups = useMemo(
    () =>
      PREVIEW_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => !excludedStandards.has(item.standardNo)),
      })).filter((group) => group.items.length > 0),
    [excludedStandards]
  );

  const itemCount = groups.reduce((sum, group) => sum + group.items.length, 0);

  const validate = () => {
    if (!dateFrom || !dateTo) {
      toast({ title: "Select both dates", description: "Date From and Date To are required.", variant: "destructive" });
      return false;
    }
    if (dateFrom > dateTo) {
      toast({ title: "Check the date range", description: "Date From must be before Date To.", variant: "destructive" });
      return false;
    }
    const invalid = excluded
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value && !/^\d+$/.test(value));
    if (invalid.length > 0) {
      toast({ title: "Check excluded standards", description: "Enter numeric Standard numbers separated by commas.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const refreshPreview = () => {
    if (!validate()) return;
    setHasPreview(true);
    setProcessed(false);
    setExpanded(new Set());
    toast({ title: "Preview refreshed", description: `${itemCount} work order${itemCount === 1 ? "" : "s"} ready for review.` });
  };

  const processRun = () => {
    if (!hasPreview || groups.length === 0) return;
    setProcessed(true);
    setExpanded(new Set(groups.map((group) => group.workOrderNo)));
    toast({ title: "Work orders created", description: `${itemCount} lab standard work orders are now available.` });
  };

  const toggleExpanded = (workOrderNo: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(workOrderNo)) next.delete(workOrderNo);
      else next.add(workOrderNo);
      return next;
    });
  };

  const exportCounts = () => {
    downloadCsv("lab-standard-work-order-counts.csv", [
      ["WO #", "Account #", "# of WOs"],
      ...groups.map((group) => [group.workOrderNo, group.account, group.items.length]),
    ]);
    toast({ title: "Counts exported" });
  };

  const exportWorkOrders = () => {
    downloadCsv("lab-standard-work-orders.csv", [
      ["WO Number", "Account #", "Report #", "Created Date", "Cal Freq", "Serial #", "Cust ID", "PO #", "Action"],
      ...groups.flatMap((group) => group.items.map((item) => [
        item.workOrderNo,
        item.account,
        item.reportNo,
        item.createdDate,
        item.calibrationFrequency,
        item.serial,
        item.customerId,
        item.purchaseOrder,
        item.action,
      ])),
    ]);
    toast({ title: "Work orders exported" });
  };

  return (
    <div className="min-h-full bg-background">
      <ModernTopNav />
      <main className="w-full px-3 py-4 sm:px-4 lg:px-6">
        <div className="space-y-4">
          <section className="border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Run Criteria</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Choose the calibration window and any standards to leave out.</p>
              </div>
              {processed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Live data
                </span>
              ) : hasPreview ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-2.5 py-1 text-[11px] font-medium text-info">
                  <span className="h-1.5 w-1.5 rounded-full bg-info" /> Preview ready
                </span>
              ) : null}
            </div>

            <div className="grid gap-4 px-4 py-4 lg:grid-cols-[180px_180px_minmax(320px,1fr)]">
              <div className="space-y-1.5">
                <Label htmlFor="lab-wo-date-from" className="text-[11px] font-medium">Date From <span className="text-destructive">*</span></Label>
                <ModernDatePicker id="lab-wo-date-from" value={dateFrom} onChange={setDateFrom} size="sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lab-wo-date-to" className="text-[11px] font-medium">Date To <span className="text-destructive">*</span></Label>
                <ModernDatePicker id="lab-wo-date-to" value={dateTo} onChange={setDateTo} size="sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="excluded-standards" className="text-[11px] font-medium">Standards to Exclude</Label>
                <Textarea
                  id="excluded-standards"
                  value={excluded}
                  onChange={(event) => setExcluded(event.target.value)}
                  placeholder="Enter Standard numbers separated by commas, for example: 1832, 2522"
                  className="min-h-[64px] resize-y text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/20 px-4 py-2.5">
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => {
                  setDateFrom(undefined);
                  setDateTo(undefined);
                  setExcluded("");
                  setHasPreview(false);
                  setProcessed(false);
                  setExpanded(new Set());
                }}>
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={refreshPreview} disabled={processed}>
                  <Eye className="h-3.5 w-3.5" /> {hasPreview ? "Refresh Preview" : "Preview Run"}
                </Button>
                <Button size="sm" className="h-8 gap-1.5 bg-info text-xs text-info-foreground hover:bg-info/90" onClick={processRun} disabled={!hasPreview || processed || groups.length === 0}>
                  <Play className="h-3.5 w-3.5" /> Process Run
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" disabled={!processed} onClick={exportCounts}>
                  <Download className="h-3.5 w-3.5" /> Export Counts
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" disabled={!processed} onClick={exportWorkOrders}>
                  <FileCheck2 className="h-3.5 w-3.5" /> Export Work Orders
                </Button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden border bg-card">
            <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold">Work Order Results</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {hasPreview ? `${groups.length} account group${groups.length === 1 ? "" : "s"} · ${itemCount} work order${itemCount === 1 ? "" : "s"}` : "Run a preview to review the proposed work orders."}
                </p>
              </div>
              {hasPreview && (
                <div className={cn("flex items-center gap-2 border-l-2 px-3 py-1.5 text-[11px] font-medium", processed ? "border-success bg-success/5 text-success" : "border-info bg-info/5 text-info")}>
                  {processed ? <CheckCircle2 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {processed ? "Live work orders have been created." : "Preview only — no work orders have been created."}
                </div>
              )}
            </div>

            {!hasPreview ? (
              <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted"><Eye className="h-4 w-4 text-muted-foreground" /></div>
                <p className="text-sm font-medium">No preview generated</p>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">Select a date range and preview the run before creating lab standard work orders.</p>
              </div>
            ) : groups.length === 0 ? (
              <div className="flex min-h-44 items-center justify-center text-sm text-muted-foreground">No work orders match the selected criteria.</div>
            ) : (
              <div className="max-h-[58vh] overflow-auto">
                <Table className="min-w-[920px]">
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                      <TableHead className="h-9 w-10 px-3"><span className="sr-only">Expand</span></TableHead>
                      <TableHead className="h-9 text-[11px]">WO #</TableHead>
                      <TableHead className="h-9 text-[11px]">Account #</TableHead>
                      <TableHead className="h-9 text-right text-[11px]"># of WOs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group) => {
                      const isExpanded = expanded.has(group.workOrderNo);
                      return (
                        <Fragment key={group.workOrderNo}>
                          <TableRow key={group.workOrderNo} className="bg-muted/20">
                            <TableCell className="h-9 px-3 py-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleExpanded(group.workOrderNo)} aria-label={`${isExpanded ? "Collapse" : "Expand"} work order ${group.workOrderNo}`}>
                                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                              </Button>
                            </TableCell>
                            <TableCell className="h-9 py-1 text-xs font-semibold tabular-nums">{group.workOrderNo}</TableCell>
                            <TableCell className="h-9 py-1 text-xs tabular-nums">{group.account}</TableCell>
                            <TableCell className="h-9 py-1 text-right text-xs font-semibold tabular-nums">{group.items.length}</TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow key={`${group.workOrderNo}-details`} className="hover:bg-transparent">
                              <TableCell colSpan={4} className="bg-background p-3 sm:pl-12">
                                <div className="overflow-x-auto border">
                                  <table className="w-full min-w-[820px] text-[11px]">
                                    <thead className="bg-muted/50 text-left text-muted-foreground">
                                      <tr>
                                        {['WO Number', 'Account #', 'Report #', 'Created Date', 'Cal Freq', 'Serial #', 'Cust ID', 'PO #', 'Action'].map((heading) => (
                                          <th key={heading} className="border-b px-2 py-1.5 font-medium">{heading}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {group.items.map((item) => (
                                        <tr key={item.id} className="border-b last:border-b-0">
                                          <td className="px-2 py-1.5 font-medium text-blue-700 tabular-nums">{item.workOrderNo}</td>
                                          <td className="px-2 py-1.5 tabular-nums">{item.account}</td>
                                          <td className="px-2 py-1.5 font-medium text-blue-700 tabular-nums">{item.reportNo}</td>
                                          <td className="px-2 py-1.5 tabular-nums">{item.createdDate}</td>
                                          <td className="px-2 py-1.5 text-right tabular-nums">{item.calibrationFrequency}</td>
                                          <td className="px-2 py-1.5 tabular-nums">{item.serial}</td>
                                          <td className="px-2 py-1.5 tabular-nums">{item.customerId}</td>
                                          <td className="px-2 py-1.5">{item.purchaseOrder}</td>
                                          <td className="px-2 py-1.5">{item.action}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          {processed && dateFrom && dateTo && (
            <p className="text-right text-[11px] text-muted-foreground">
              Created for {format(dateFrom, "MM/dd/yyyy")}–{format(dateTo, "MM/dd/yyyy")}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateLabStandardWorkOrders;