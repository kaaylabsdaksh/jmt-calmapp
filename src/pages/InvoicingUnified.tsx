import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Search,
  FileText,
  Truck,
  UserCog,
  Receipt,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  ArrowUpDown,
  RotateCcw,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import StandardTopNav from "@/components/shared/StandardTopNav";

// ---------- Types ----------
type WOStatus = "Ready" | "In Process" | "On Hold";
type InvoiceStatus = "Pending" | "Delivery Ticket" | "Processed";
type ItemStatus = "A/R Invoicing" | "Ready to Invoice" | "Completed";
type DepartureType = "Customer Pickup" | "Driver Dropoff" | "Shipped";
type BatchStatus = "Waiting" | "Assigned" | "Completed";
type ShippingStatus = "Ready" | "Pending" | "Shipped";

// Unified row: invoice-level fields + batch-level fields joined via batchId.
// Shared fields (accountNumber, customer) appear only once.
interface UnifiedRow {
  id: string;
  // Shared
  accountNumber: string;
  customer: string;
  // Invoice-specific
  reportNumber: string;
  woStatus: WOStatus;
  manufacturer: string;
  model: string;
  serial: string;
  po: string;
  itemStatus: ItemStatus;
  invoiceStatus: InvoiceStatus;
  invoiceNumber: string;
  departureType: DepartureType;
  departureDate: string;
  samsaraSubmitted: boolean;
  // Billing-specific
  woBatch: string;
  srNum: string;
  rtbCount: number;
  totalCount: number;
  lastComment: string;
  lastCommentDate: string;
  minNeedByDate: string;
  minRtbDate: string;
  shippingStatus: ShippingStatus;
  batchStatus: BatchStatus;
  salesOrder: string;
}

const mockRows: UnifiedRow[] = [
  {
    id: "1",
    accountNumber: "20450",
    customer: "Shell Norco Refinery",
    reportNumber: "20450-573100-001",
    woStatus: "Ready",
    manufacturer: "FLUKE",
    model: "87V",
    serial: "SN-778821",
    po: "PO-9821",
    itemStatus: "A/R Invoicing",
    invoiceStatus: "Processed",
    invoiceNumber: "989010",
    departureType: "Shipped",
    departureDate: "2026-03-16",
    samsaraSubmitted: true,
    woBatch: "B-5432",
    srNum: "SR-1001",
    rtbCount: 2,
    totalCount: 8,
    lastComment: "Ready for pickup",
    lastCommentDate: "2026-03-14",
    minNeedByDate: "2026-03-20",
    minRtbDate: "2026-03-18",
    shippingStatus: "Ready",
    batchStatus: "Waiting",
    salesOrder: "SO-77812",
  },
  {
    id: "2",
    accountNumber: "18120",
    customer: "Performance Contractors",
    reportNumber: "18120-573110-001",
    woStatus: "On Hold",
    manufacturer: "PROTO",
    model: "6062C",
    serial: "TW-11290",
    po: "PO-7734",
    itemStatus: "A/R Invoicing",
    invoiceStatus: "Pending",
    invoiceNumber: "—",
    departureType: "Driver Dropoff",
    departureDate: "2026-03-19",
    samsaraSubmitted: false,
    woBatch: "B-5433",
    srNum: "SR-1002",
    rtbCount: 0,
    totalCount: 3,
    lastComment: "Awaiting parts",
    lastCommentDate: "2026-03-11",
    minNeedByDate: "2026-03-25",
    minRtbDate: "—",
    shippingStatus: "Pending",
    batchStatus: "Assigned",
    salesOrder: "SO-77813",
  },
  {
    id: "3",
    accountNumber: "22110",
    customer: "Marathon Petroleum",
    reportNumber: "22110-573120-001",
    woStatus: "Ready",
    manufacturer: "AMETEK",
    model: "RTC-159",
    serial: "AM-88112",
    po: "PO-4412",
    itemStatus: "Completed",
    invoiceStatus: "Processed",
    invoiceNumber: "989025",
    departureType: "Shipped",
    departureDate: "2026-03-11",
    samsaraSubmitted: true,
    woBatch: "B-5440",
    srNum: "SR-1003",
    rtbCount: 5,
    totalCount: 12,
    lastComment: "Completed and shipped",
    lastCommentDate: "2026-03-10",
    minNeedByDate: "2026-03-15",
    minRtbDate: "2026-03-12",
    shippingStatus: "Shipped",
    batchStatus: "Completed",
    salesOrder: "SO-77820",
  },
];

// ---------- Badge styles ----------
const woStatusStyles: Record<WOStatus, string> = {
  Ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "In Process": "bg-amber-100 text-amber-800 border-amber-200",
  "On Hold": "bg-rose-100 text-rose-800 border-rose-200",
};
const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  Pending: "bg-slate-100 text-slate-700 border-slate-200",
  "Delivery Ticket": "bg-blue-100 text-blue-800 border-blue-200",
  Processed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};
const itemStatusStyles: Record<ItemStatus, string> = {
  "A/R Invoicing": "bg-purple-100 text-purple-800 border-purple-200",
  "Ready to Invoice": "bg-indigo-100 text-indigo-800 border-indigo-200",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};
const batchStatusStyles: Record<BatchStatus, string> = {
  Waiting: "bg-slate-100 text-slate-700 border-slate-200",
  Assigned: "bg-blue-100 text-blue-800 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};
const shippingStatusStyles: Record<ShippingStatus, string> = {
  Ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Shipped: "bg-blue-100 text-blue-800 border-blue-200",
};

export default function InvoicingUnified() {
  const [filters, setFilters] = useState({
    location: "all",
    division: "all",
    customerGroup: "all",
    itemStatus: "all",
    createdFrom: "",
    createdTo: "",
    invoicingType: "all",
    workOrderType: "all",
    invoiceStatus: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const clearFilters = () => {
    setFilters({
      location: "all",
      division: "all",
      customerGroup: "all",
      itemStatus: "all",
      createdFrom: "",
      createdTo: "",
      invoicingType: "all",
      workOrderType: "all",
      invoiceStatus: "all",
    });
    setSearchQuery("");
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredRows = useMemo(() => {
    let rows = mockRows;
    if (q) {
      rows = rows.filter((r) =>
        [
          r.reportNumber, r.accountNumber, r.customer, r.manufacturer, r.model,
          r.serial, r.po, r.invoiceNumber, r.woBatch, r.srNum, r.salesOrder,
        ].join(" ").toLowerCase().includes(q)
      );
    }
    if (filters.itemStatus !== "all") {
      const map: Record<string, ItemStatus> = {
        "ar-invoicing": "A/R Invoicing",
        ready: "Ready to Invoice",
        completed: "Completed",
      };
      rows = rows.filter((r) => r.itemStatus === map[filters.itemStatus]);
    }
    if (filters.invoiceStatus !== "all") {
      const map: Record<string, InvoiceStatus> = {
        pending: "Pending",
        "delivery-ticket": "Delivery Ticket",
        processed: "Processed",
      };
      rows = rows.filter((r) => r.invoiceStatus === map[filters.invoiceStatus]);
    }
    return rows;
  }, [q, filters.itemStatus, filters.invoiceStatus]);

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => {
    if (filteredRows.every((r) => selected.has(r.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredRows.map((r) => r.id)));
    }
  };
  const hasSelection = selected.size > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-40">
        <StandardTopNav
          title="Invoicing Dashboard"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Invoicing" }]}
        />
      </div>

      <div className="flex flex-col gap-2 p-2 md:p-3 flex-1 pb-20">
        {/* Unified Filter Card */}
        <Card>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
              <FieldSelect label="Location" value={filters.location} onChange={(v) => setFilters({ ...filters, location: v })}
                options={[
                  { value: "all", label: "All" },
                  { value: "baton-rouge", label: "Baton Rouge" },
                  { value: "houston", label: "Houston" },
                  { value: "norco", label: "Norco" },
                ]} />
              <FieldSelect label="Division" value={filters.division} onChange={(v) => setFilters({ ...filters, division: v })}
                options={[
                  { value: "all", label: "All" },
                  { value: "lab", label: "Lab" },
                  { value: "field", label: "Field" },
                ]} />
              <FieldSelect label="Customer Group" value={filters.customerGroup} onChange={(v) => setFilters({ ...filters, customerGroup: v })}
                options={[
                  { value: "all", label: "All" },
                  { value: "energy", label: "Energy" },
                  { value: "chemical", label: "Chemical" },
                  { value: "manufacturing", label: "Manufacturing" },
                ]} />
              <FieldSelect label="Item Status" value={filters.itemStatus} onChange={(v) => setFilters({ ...filters, itemStatus: v })}
                options={[
                  { value: "all", label: "All" },
                  { value: "ar-invoicing", label: "A/R Invoicing" },
                  { value: "ready", label: "Ready to Invoice" },
                  { value: "completed", label: "Completed" },
                ]} />
              <FieldSelect label="Invoice Status" value={filters.invoiceStatus} onChange={(v) => setFilters({ ...filters, invoiceStatus: v })}
                options={[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "delivery-ticket", label: "Delivery Ticket" },
                  { value: "processed", label: "Processed" },
                ]} />
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Created From</Label>
                <ModernDatePicker
                  value={filters.createdFrom}
                  onChange={(date) =>
                    setFilters({ ...filters, createdFrom: date ? date.toISOString().split("T")[0] : "" })
                  }
                  placeholder="MM/DD/YYYY"
                  size="sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Created To</Label>
                <ModernDatePicker
                  value={filters.createdTo}
                  onChange={(date) =>
                    setFilters({ ...filters, createdTo: date ? date.toISOString().split("T")[0] : "" })
                  }
                  placeholder="MM/DD/YYYY"
                  size="sm"
                />
              </div>
              <FieldSelect label="Invoicing Type" value={filters.invoicingType} onChange={(v) => setFilters({ ...filters, invoicingType: v })}
                options={[
                  { value: "all", label: "All" },
                  { value: "regular", label: "Regular" },
                  { value: "onsite", label: "Onsite" },
                ]} />
              <FieldSelect label="Work Order Type" value={filters.workOrderType} onChange={(v) => setFilters({ ...filters, workOrderType: v })}
                options={[
                  { value: "all", label: "All" },
                  { value: "calibration", label: "Calibration" },
                  { value: "repair", label: "Repair" },
                  { value: "certification", label: "Certification" },
                ]} />
              <div className="space-y-1 flex flex-col justify-end">
                <div className="flex gap-2">
                  <Button className="flex-1 h-8">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" className="flex-1 h-8" onClick={clearFilters}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unified Work Order + Billing Table */}
        <Card className="overflow-hidden">
          <CardHeader className="px-3 py-2 border-b border-border flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">Invoicing & Billing Queue</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5">
                {filteredRows.length}
              </Badge>
              {hasSelection && (
                <Badge variant="outline" className="bg-primary/10 text-foreground border-primary/20 text-xs">
                  {selected.size} selected
                </Badge>
              )}
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-muted/60">
                <tr className="border-b border-border">
                  <th className="w-8 px-2 py-1 text-left">
                    <Checkbox
                      checked={filteredRows.length > 0 && filteredRows.every((r) => selected.has(r.id))}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  {[
                    // Shared
                    "Account #", "Customer",
                    // Invoice-specific
                    "Report #", "WO Status", "Manufacturer", "Model", "Serial #", "PO #",
                    "Item Status", "Invoice Status", "Invoice #", "Departure Type", "Departure Date", "Samsara",
                    // Billing-specific
                    "WO Batch", "SR #", "RTB / Total", "Last Comment", "Last Comment Date",
                    "Min Need By", "Min RTB", "Shipping Status", "Batch Status", "Sales Order",
                  ].map((h) => (
                    <th key={h} className="px-2 py-1 text-left font-medium text-muted-foreground whitespace-nowrap">
                      <button className="inline-flex items-center gap-1 hover:text-foreground">
                        {h}
                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                      </button>
                    </th>
                  ))}
                  <th className="px-2 py-1 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={26} className="py-8 text-center text-sm text-muted-foreground">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-border transition-colors",
                        idx % 2 === 1 ? "bg-muted/20" : "bg-background",
                        "hover:bg-muted/50",
                        selected.has(row.id) && "bg-primary/5"
                      )}
                    >
                      <td className="px-2 py-1">
                        <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                      </td>
                      {/* Shared */}
                      <td className="px-2 py-1 whitespace-nowrap">{row.accountNumber}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.customer}</td>
                      {/* Invoice-specific */}
                      <td className="px-2 py-1 whitespace-nowrap font-medium text-foreground">{row.reportNumber}</td>
                      <td className="px-2 py-1">
                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", woStatusStyles[row.woStatus])}>
                          {row.woStatus}
                        </Badge>
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.manufacturer}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.model}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.serial}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.po}</td>
                      <td className="px-2 py-1">
                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", itemStatusStyles[row.itemStatus])}>
                          {row.itemStatus}
                        </Badge>
                      </td>
                      <td className="px-2 py-1">
                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", invoiceStatusStyles[row.invoiceStatus])}>
                          {row.invoiceStatus}
                        </Badge>
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.invoiceNumber}</td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-background border-border">
                          {row.departureType}
                        </Badge>
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.departureDate}</td>
                      <td className="px-2 py-1">
                        {row.samsaraSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px]">
                            <CheckCircle2 className="h-3 w-3" /> Yes
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      {/* Billing-specific */}
                      <td className="px-2 py-1 whitespace-nowrap font-medium text-foreground">{row.woBatch}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.srNum}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.rtbCount} / {row.totalCount}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.lastComment}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.lastCommentDate}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.minNeedByDate}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.minRtbDate}</td>
                      <td className="px-2 py-1">
                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", shippingStatusStyles[row.shippingStatus])}>
                          {row.shippingStatus}
                        </Badge>
                      </td>
                      <td className="px-2 py-1">
                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", batchStatusStyles[row.batchStatus])}>
                          {row.batchStatus}
                        </Badge>
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">{row.salesOrder}</td>
                      <td className="px-2 py-1 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Generate delivery ticket</DropdownMenuItem>
                            <DropdownMenuItem>Process invoice</DropdownMenuItem>
                            <DropdownMenuItem>Review batch</DropdownMenuItem>
                            <DropdownMenuItem>Assign specialist</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Invoice Reports */}
        <Card>
          <CardHeader className="px-3 py-2 border-b border-border flex flex-row items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Invoice Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ReportsTable />
          </CardContent>
        </Card>
      </div>

      {/* Sticky Action Bar */}
      <footer className="sticky bottom-0 z-40 bg-background px-3 py-2 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="text-xs h-8" disabled={!hasSelection}>
              <Receipt className="h-3.5 w-3.5 mr-1.5" />
              Process Invoice(s)
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-8" disabled={!hasSelection}>
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Process Onsite Invoice(s)
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-8" disabled={!hasSelection}>
              <Truck className="h-3.5 w-3.5 mr-1.5" />
              Delivery Tickets
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" className="text-xs h-8" disabled={!hasSelection}>
              <UserCog className="h-3.5 w-3.5 mr-1.5" />
              Assign Billing Specialist
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-8" disabled={!hasSelection}>
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Review Batch
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-8" disabled={!hasSelection}>
              <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
              Complete Billing Review
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FieldSelect({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ReportsTable() {
  const reports = [
    { date: "2026-03-16", name: "Invoice Batch 03-16", generatedBy: "J. Smith", status: "Completed" },
    { date: "2026-03-14", name: "Invoice Batch 03-14", generatedBy: "A. Doe", status: "Completed" },
    { date: "2026-03-12", name: "Invoice Batch 03-12", generatedBy: "J. Smith", status: "Processing" },
  ];
  if (reports.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">No reports generated.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-muted/60">
          <tr className="border-b border-border">
            <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">Invoice Date</th>
            <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">Report Name</th>
            <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">Generated By</th>
            <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-3 py-1.5 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/50">
              <td className="px-3 py-1.5 whitespace-nowrap">{r.date}</td>
              <td className="px-3 py-1.5">{r.name}</td>
              <td className="px-3 py-1.5">{r.generatedBy}</td>
              <td className="px-3 py-1.5">
                <Badge variant="outline" className={cn(
                  "font-medium text-[10px] h-5 px-1.5",
                  r.status === "Completed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                )}>{r.status}</Badge>
              </td>
              <td className="px-3 py-1.5 text-right">
                <div className="inline-flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Eye className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
