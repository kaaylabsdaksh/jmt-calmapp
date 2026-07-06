import React, { useMemo, useState } from "react";
import {
  RefreshCw,
  Download,
  Settings,
  Search,
  Filter,
  FileText,
  Truck,
  UserCog,
  Receipt,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  FileDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ---------- Types ----------
type WOStatus = "Ready" | "In Process" | "On Hold";
type InvoiceStatus = "Pending" | "Delivery Ticket" | "Processed";
type ItemStatus = "A/R Invoicing" | "Ready to Invoice" | "Completed";
type DepartureType = "Customer Pickup" | "Driver Dropoff" | "Shipped";

interface InvoiceRow {
  id: string;
  reportNumber: string;
  accountNumber: string;
  customer: string;
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
  proofOfDelivery: boolean;
}

// ---------- Mock Data ----------
const mockRows: InvoiceRow[] = [
  {
    id: "1",
    reportNumber: "20450-573100-001",
    accountNumber: "20450",
    customer: "Shell Norco Refinery",
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
    proofOfDelivery: true,
  },
  {
    id: "2",
    reportNumber: "20450-573100-002",
    accountNumber: "20450",
    customer: "Shell Norco Refinery",
    woStatus: "In Process",
    manufacturer: "FLUKE",
    model: "724",
    serial: "SN-993412",
    po: "PO-9821",
    itemStatus: "Ready to Invoice",
    invoiceStatus: "Delivery Ticket",
    invoiceNumber: "989010",
    departureType: "Customer Pickup",
    departureDate: "2026-03-18",
    samsaraSubmitted: false,
    proofOfDelivery: false,
  },
  {
    id: "3",
    reportNumber: "18120-573110-001",
    accountNumber: "18120",
    customer: "Performance Contractors",
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
    proofOfDelivery: false,
  },
  {
    id: "4",
    reportNumber: "22110-573120-001",
    accountNumber: "22110",
    customer: "Marathon Petroleum",
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
    proofOfDelivery: true,
  },
  {
    id: "5",
    reportNumber: "22110-573120-002",
    accountNumber: "22110",
    customer: "Marathon Petroleum",
    woStatus: "Ready",
    manufacturer: "DRUCK",
    model: "DPI 611",
    serial: "DR-55901",
    po: "PO-4412",
    itemStatus: "A/R Invoicing",
    invoiceStatus: "Delivery Ticket",
    invoiceNumber: "989025",
    departureType: "Customer Pickup",
    departureDate: "2026-03-12",
    samsaraSubmitted: true,
    proofOfDelivery: false,
  },
  {
    id: "6",
    reportNumber: "30011-573130-001",
    accountNumber: "30011",
    customer: "CF Industries Donaldsonville",
    woStatus: "In Process",
    manufacturer: "FLUKE",
    model: "754",
    serial: "SN-441209",
    po: "PO-2210",
    itemStatus: "Ready to Invoice",
    invoiceStatus: "Pending",
    invoiceNumber: "—",
    departureType: "Shipped",
    departureDate: "2026-03-21",
    samsaraSubmitted: false,
    proofOfDelivery: false,
  },
  {
    id: "7",
    reportNumber: "40088-573140-001",
    accountNumber: "40088",
    customer: "Entergy Louisiana",
    woStatus: "Ready",
    manufacturer: "HIOKI",
    model: "PW3198",
    serial: "HK-77120",
    po: "PO-9088",
    itemStatus: "A/R Invoicing",
    invoiceStatus: "Processed",
    invoiceNumber: "989040",
    departureType: "Driver Dropoff",
    departureDate: "2026-03-13",
    samsaraSubmitted: true,
    proofOfDelivery: true,
  },
];

// ---------- Badge helpers (design-system-friendly) ----------
const woStatusStyles: Record<WOStatus, string> = {
  Ready:
    "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
  "In Process":
    "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  "On Hold": "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100",
};

const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  Pending: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",
  "Delivery Ticket":
    "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  Processed:
    "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
};

const itemStatusStyles: Record<ItemStatus, string> = {
  "A/R Invoicing":
    "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
  "Ready to Invoice":
    "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100",
  Completed:
    "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
};

// ---------- Column config ----------
type ColumnKey =
  | "reportNumber"
  | "accountNumber"
  | "customer"
  | "woStatus"
  | "manufacturer"
  | "model"
  | "serial"
  | "po"
  | "itemStatus"
  | "invoiceStatus"
  | "invoiceNumber"
  | "departureType"
  | "departureDate"
  | "samsaraSubmitted"
  | "proofOfDelivery";

const ALL_COLUMNS: { key: ColumnKey; label: string; width: number }[] = [
  { key: "reportNumber", label: "Report Number", width: 180 },
  { key: "accountNumber", label: "Account #", width: 110 },
  { key: "customer", label: "Customer", width: 220 },
  { key: "woStatus", label: "WO Status", width: 130 },
  { key: "manufacturer", label: "Manufacturer", width: 130 },
  { key: "model", label: "Model", width: 120 },
  { key: "serial", label: "Serial #", width: 140 },
  { key: "po", label: "PO #", width: 110 },
  { key: "itemStatus", label: "Item Status", width: 150 },
  { key: "invoiceStatus", label: "Invoice Status", width: 150 },
  { key: "invoiceNumber", label: "Invoice #", width: 110 },
  { key: "departureType", label: "Departure Type", width: 160 },
  { key: "departureDate", label: "Departure Date", width: 140 },
  { key: "samsaraSubmitted", label: "Samsara Submitted", width: 160 },
  { key: "proofOfDelivery", label: "Proof of Delivery", width: 150 },
];

// ---------- Page ----------
export default function Invoicing() {
  const [loading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    itemStatus: "all",
    location: "all",
    createdFrom: "",
    createdTo: "",
    division: "all",
    customerGroup: "all",
  });

  // Table state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: ColumnKey; dir: "asc" | "desc" } | null>(
    null
  );
  const [visibleCols, setVisibleCols] = useState<Set<ColumnKey>>(
    new Set(ALL_COLUMNS.map((c) => c.key))
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [drawerRow, setDrawerRow] = useState<InvoiceRow | null>(null);

  // Filtered rows
  const filteredRows = useMemo(() => {
    let rows = mockRows;
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = String(a[sort.key] ?? "");
        const bv = String(b[sort.key] ?? "");
        return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [sort]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const allChecked =
    pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) pageRows.forEach((r) => next.delete(r.id));
    else pageRows.forEach((r) => next.add(r.id));
    setSelected(next);
  };
  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const selectedCount = selected.size;
  const hasSelection = selectedCount > 0;

  const doSort = (key: ColumnKey) => {
    setSort((s) =>
      s?.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const cellFor = (row: InvoiceRow, key: ColumnKey) => {
    switch (key) {
      case "reportNumber":
        return (
          <span className="font-medium text-foreground">{row.reportNumber}</span>
        );
      case "woStatus":
        return (
          <Badge variant="outline" className={cn("font-medium", woStatusStyles[row.woStatus])}>
            {row.woStatus}
          </Badge>
        );
      case "invoiceStatus":
        return (
          <Badge
            variant="outline"
            className={cn("font-medium", invoiceStatusStyles[row.invoiceStatus])}
          >
            {row.invoiceStatus}
          </Badge>
        );
      case "itemStatus":
        return (
          <Badge
            variant="outline"
            className={cn("font-medium", itemStatusStyles[row.itemStatus])}
          >
            {row.itemStatus}
          </Badge>
        );
      case "departureType":
        return (
          <Badge
            variant="outline"
            className="font-medium bg-background text-foreground border-border"
          >
            {row.departureType}
          </Badge>
        );
      case "samsaraSubmitted":
        return row.samsaraSubmitted ? (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Yes
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      case "proofOfDelivery":
        return row.proofOfDelivery ? (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Yes
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      default:
        return <span>{(row as any)[key]}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Invoicing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage invoice processing, delivery tickets, billing workflows, and
            invoice reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast("Refreshed")}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Export started")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <FieldSelect
              label="Item Status"
              value={filters.itemStatus}
              onChange={(v) => setFilters({ ...filters, itemStatus: v })}
              options={[
                { value: "all", label: "All" },
                { value: "ar-invoicing", label: "A/R Invoicing" },
                { value: "ready", label: "Ready to Invoice" },
                { value: "completed", label: "Completed" },
              ]}
            />
            <FieldSelect
              label="Location"
              value={filters.location}
              onChange={(v) => setFilters({ ...filters, location: v })}
              options={[
                { value: "all", label: "All" },
                { value: "baton-rouge", label: "Baton Rouge" },
                { value: "houston", label: "Houston" },
                { value: "norco", label: "Norco" },
              ]}
            />
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Created From</Label>
              <Input
                type="date"
                value={filters.createdFrom}
                onChange={(e) =>
                  setFilters({ ...filters, createdFrom: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Created To</Label>
              <Input
                type="date"
                value={filters.createdTo}
                onChange={(e) =>
                  setFilters({ ...filters, createdTo: e.target.value })
                }
              />
            </div>
            <FieldSelect
              label="Division"
              value={filters.division}
              onChange={(v) => setFilters({ ...filters, division: v })}
              options={[
                { value: "all", label: "All" },
                { value: "lab", label: "Lab" },
                { value: "field", label: "Field" },
              ]}
            />
            <FieldSelect
              label="Customer Group"
              value={filters.customerGroup}
              onChange={(v) => setFilters({ ...filters, customerGroup: v })}
              options={[
                { value: "all", label: "All" },
                { value: "energy", label: "Energy" },
                { value: "chemical", label: "Chemical" },
                { value: "manufacturing", label: "Manufacturing" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Toolbar */}
      <Card>
        <CardContent className="py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-popover">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Refresh data</DropdownMenuItem>
                <DropdownMenuItem>Save current view</DropdownMenuItem>
                <DropdownMenuItem>Manage saved views</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasSelection}
              onClick={() => toast("Billing specialist assigned")}
            >
              <UserCog className="h-4 w-4 mr-2" />
              Billing Specialist
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasSelection}
              onClick={() => toast.success("Delivery Ticket Created")}
            >
              <Truck className="h-4 w-4 mr-2" />
              Delivery Tickets
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasSelection}
              onClick={() => toast.success("Invoice Generated")}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Process Invoice(s)
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasSelection}
              onClick={() => toast.success("Onsite invoice processed")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Process Onsite Invoice(s)
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {hasSelection && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                {selectedCount} Item{selectedCount === 1 ? "" : "s"} Selected
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_COLUMNS.map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.key}
                    checked={visibleCols.has(c.key)}
                    onCheckedChange={(v) => {
                      const next = new Set(visibleCols);
                      v ? next.add(c.key) : next.delete(c.key);
                      setVisibleCols(next);
                    }}
                  >
                    {c.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="w-10 px-3 py-2.5 text-left">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                {ALL_COLUMNS.filter((c) => visibleCols.has(c.key)).map((c) => (
                  <th
                    key={c.key}
                    style={{ minWidth: c.width }}
                    className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap"
                  >
                    <button
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => doSort(c.key)}
                    >
                      {c.label}
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </button>
                  </th>
                ))}
                <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={ALL_COLUMNS.length + 2} className="p-3">
                      <div className="h-6 rounded-md bg-muted animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={ALL_COLUMNS.length + 2}
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <FileSearch className="h-8 w-8" />
                      </div>
                      <div className="font-medium text-foreground">
                        No invoices found.
                      </div>
                      <p className="text-sm">
                        No data is currently available.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-border cursor-pointer transition-colors",
                      idx % 2 === 1 ? "bg-muted/20" : "bg-background",
                      "hover:bg-accent/50",
                      selected.has(row.id) && "bg-primary/5"
                    )}
                    onClick={() => setDrawerRow(row)}
                  >
                    <td
                      className="px-3 py-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                      />
                    </td>
                    {ALL_COLUMNS.filter((c) => visibleCols.has(c.key)).map(
                      (c) => (
                        <td
                          key={c.key}
                          className="px-3 py-2.5 whitespace-nowrap"
                        >
                          {cellFor(row, c.key)}
                        </td>
                      )
                    )}
                    <td
                      className="px-3 py-2.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-popover"
                        >
                          <DropdownMenuItem onClick={() => setDrawerRow(row)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Generate delivery ticket</DropdownMenuItem>
                          <DropdownMenuItem>Process invoice</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-border bg-background px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(page - 1) * pageSize + 1}
            </span>
            –
            <span className="font-medium text-foreground">
              {Math.min(page * pageSize, filteredRows.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredRows.length}
            </span>{" "}
            invoices
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Invoice Reports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Invoice Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="invoices">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <TabsList>
                <TabsTrigger value="invoices">Process Invoice(s)</TabsTrigger>
                <TabsTrigger value="onsite">Process Onsite Invoice(s)</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search reports..." className="pl-9 h-9 w-56" />
                </div>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>
            <TabsContent value="invoices">
              <ReportsTable />
            </TabsContent>
            <TabsContent value="onsite">
              <ReportsTable onsite />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Floating Bulk Action Bar */}
      {hasSelection && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-2 bg-popover border border-border rounded-full shadow-lg px-3 py-2">
            <Badge className="bg-primary text-primary-foreground hover:bg-primary rounded-full">
              {selectedCount} selected
            </Badge>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm">
              <UserCog className="h-4 w-4 mr-1.5" />
              Assign
            </Button>
            <Button variant="ghost" size="sm">
              <Receipt className="h-4 w-4 mr-1.5" />
              Process
            </Button>
            <Button variant="ghost" size="sm">
              <Truck className="h-4 w-4 mr-1.5" />
              Delivery Ticket
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <FileDown className="h-4 w-4 mr-1.5" />
              PDFs
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(new Set())}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Details Drawer */}
      <Sheet
        open={!!drawerRow}
        onOpenChange={(o) => !o && setDrawerRow(null)}
      >
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {drawerRow && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">
                  {drawerRow.reportNumber}
                </SheetTitle>
                <SheetDescription>
                  {drawerRow.customer} · Invoice #{drawerRow.invoiceNumber}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn("font-medium", woStatusStyles[drawerRow.woStatus])}
                >
                  {drawerRow.woStatus}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    invoiceStatusStyles[drawerRow.invoiceStatus]
                  )}
                >
                  {drawerRow.invoiceStatus}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("font-medium", itemStatusStyles[drawerRow.itemStatus])}
                >
                  {drawerRow.itemStatus}
                </Badge>
              </div>

              <DrawerSection title="Customer Information">
                <DetailRow label="Customer" value={drawerRow.customer} />
                <DetailRow label="Account #" value={drawerRow.accountNumber} />
                <DetailRow label="PO #" value={drawerRow.po} />
              </DrawerSection>
              <DrawerSection title="Equipment Details">
                <DetailRow label="Manufacturer" value={drawerRow.manufacturer} />
                <DetailRow label="Model" value={drawerRow.model} />
                <DetailRow label="Serial #" value={drawerRow.serial} />
              </DrawerSection>
              <DrawerSection title="Invoice Information">
                <DetailRow label="Invoice #" value={drawerRow.invoiceNumber} />
                <DetailRow label="Invoice Status" value={drawerRow.invoiceStatus} />
                <DetailRow label="Item Status" value={drawerRow.itemStatus} />
              </DrawerSection>
              <DrawerSection title="Shipping Details">
                <DetailRow label="Departure Type" value={drawerRow.departureType} />
                <DetailRow label="Departure Date" value={drawerRow.departureDate} />
                <DetailRow
                  label="Samsara Submitted"
                  value={drawerRow.samsaraSubmitted ? "Yes" : "No"}
                />
                <DetailRow
                  label="Proof of Delivery"
                  value={drawerRow.proofOfDelivery ? "Yes" : "No"}
                />
              </DrawerSection>
              <DrawerSection title="Delivery Ticket">
                <p className="text-sm text-muted-foreground">
                  No delivery ticket has been generated for this item.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  <Truck className="h-4 w-4 mr-2" />
                  Generate Delivery Ticket
                </Button>
              </DrawerSection>
              <DrawerSection title="Documents">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      invoice-{drawerRow.invoiceNumber}.pdf
                    </span>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
              </DrawerSection>
              <DrawerSection title="Activity Timeline">
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <div>
                      <div className="font-medium">Invoice generated</div>
                      <div className="text-xs text-muted-foreground">
                        {drawerRow.departureDate}
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-medium">Delivery ticket created</div>
                      <div className="text-xs text-muted-foreground">
                        {drawerRow.departureDate}
                      </div>
                    </div>
                  </li>
                </ol>
              </DrawerSection>
              <DrawerSection title="Notes">
                <p className="text-sm text-muted-foreground">
                  No notes have been added yet.
                </p>
              </DrawerSection>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------- Sub components ----------
function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <Separator className="mb-3" />
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function ReportsTable({ onsite = false }: { onsite?: boolean }) {
  const reports = [
    {
      date: "2026-03-16",
      name: onsite ? "Onsite Invoice Batch 03-16" : "Invoice Batch 03-16",
      generatedBy: "J. Smith",
      status: "Completed",
    },
    {
      date: "2026-03-14",
      name: onsite ? "Onsite Invoice Batch 03-14" : "Invoice Batch 03-14",
      generatedBy: "A. Doe",
      status: "Completed",
    },
    {
      date: "2026-03-12",
      name: onsite ? "Onsite Invoice Batch 03-12" : "Invoice Batch 03-12",
      generatedBy: "J. Smith",
      status: "Processing",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60">
          <tr className="border-b border-border">
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              Invoice Date
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              Report Name
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              Generated By
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              Status
            </th>
            <th className="px-3 py-2 text-right font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr
              key={i}
              className="border-b border-border last:border-b-0 hover:bg-accent/50"
            >
              <td className="px-3 py-2 whitespace-nowrap">{r.date}</td>
              <td className="px-3 py-2">{r.name}</td>
              <td className="px-3 py-2">{r.generatedBy}</td>
              <td className="px-3 py-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    r.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                  )}
                >
                  {r.status}
                </Badge>
              </td>
              <td className="px-3 py-2 text-right">
                <div className="inline-flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1.5" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1.5" />
                    Download
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <span>Showing {reports.length} reports</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2">Page 1 of 1</span>
          <Button variant="outline" size="sm" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
