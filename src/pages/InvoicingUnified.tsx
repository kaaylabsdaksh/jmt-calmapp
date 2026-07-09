import React, { useMemo, useState } from "react";
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
  FileDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  ArrowUpDown,
  GripVertical,
  Settings2,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import StandardTopNav from "@/components/shared/StandardTopNav";

// ---------- Types ----------
type Mode = "invoices" | "billingSpecialist";
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
  // billing specialist fields
  woBatch: string;
  srNum: string;
  rtbCount: number;
  totalCount: number;
  lastCommentDate: string;
  lastComment: string;
  minNeedByDate: string;
  minRtbDate: string;
  toShipping: string;
  salesOrder: string;
}

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
    woBatch: "B-5432",
    srNum: "SR-1001",
    rtbCount: 2,
    totalCount: 8,
    lastCommentDate: "2026-03-14",
    lastComment: "Ready for pickup",
    minNeedByDate: "2026-03-20",
    minRtbDate: "2026-03-18",
    toShipping: "Yes",
    salesOrder: "SO-77812",
  },
  {
    id: "2",
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
    woBatch: "B-5433",
    srNum: "SR-1002",
    rtbCount: 0,
    totalCount: 3,
    lastCommentDate: "2026-03-11",
    lastComment: "Awaiting parts",
    minNeedByDate: "2026-03-25",
    minRtbDate: "—",
    toShipping: "No",
    salesOrder: "SO-77813",
  },
  {
    id: "3",
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
    woBatch: "B-5440",
    srNum: "SR-1003",
    rtbCount: 5,
    totalCount: 12,
    lastCommentDate: "2026-03-10",
    lastComment: "Completed and shipped",
    minNeedByDate: "2026-03-15",
    minRtbDate: "2026-03-12",
    toShipping: "Yes",
    salesOrder: "SO-77820",
  },
];

// ---------- Badge styles ----------
const woStatusStyles: Record<WOStatus, string> = {
  Ready: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
  "In Process": "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  "On Hold": "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100",
};
const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  Pending: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",
  "Delivery Ticket": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  Processed: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
};
const itemStatusStyles: Record<ItemStatus, string> = {
  "A/R Invoicing": "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
  "Ready to Invoice": "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
};

// ---------- Columns ----------
type ColumnKey =
  | "reportNumber" | "accountNumber" | "customer" | "woStatus" | "manufacturer"
  | "model" | "serial" | "po" | "itemStatus" | "invoiceStatus" | "invoiceNumber"
  | "departureType" | "departureDate" | "samsaraSubmitted" | "proofOfDelivery"
  | "woBatch" | "srNum" | "rtbCount" | "totalCount" | "lastCommentDate"
  | "lastComment" | "minNeedByDate" | "minRtbDate" | "toShipping" | "salesOrder";

interface ColDef { key: ColumnKey; label: string; width: number }

const COMMON_COLS: ColDef[] = [
  { key: "accountNumber", label: "Account #", width: 95 },
  { key: "customer", label: "Customer Name", width: 180 },
];

const INVOICE_COLS: ColDef[] = [
  { key: "reportNumber", label: "Report Number", width: 150 },
  { key: "woStatus", label: "WO Status", width: 105 },
  { key: "manufacturer", label: "Manufacturer", width: 105 },
  { key: "model", label: "Model", width: 95 },
  { key: "serial", label: "Serial #", width: 115 },
  { key: "po", label: "PO #", width: 95 },
  { key: "itemStatus", label: "Item Status", width: 120 },
  { key: "invoiceStatus", label: "Invoice Status", width: 120 },
  { key: "invoiceNumber", label: "Invoice #", width: 95 },
  { key: "departureType", label: "Departure Type", width: 130 },
  { key: "departureDate", label: "Departure Date", width: 115 },
  { key: "samsaraSubmitted", label: "Samsara Submitted", width: 130 },
];

const BILLING_COLS: ColDef[] = [
  { key: "woBatch", label: "WO Batch", width: 110 },
  { key: "srNum", label: "SR#", width: 95 },
  { key: "rtbCount", label: "RTB Count", width: 100 },
  { key: "totalCount", label: "Total Count", width: 100 },
  { key: "lastCommentDate", label: "Last Comment Date", width: 130 },
  { key: "lastComment", label: "Last Comment", width: 180 },
  { key: "minNeedByDate", label: "Min Need By Date", width: 130 },
  { key: "minRtbDate", label: "Min RTB Date", width: 120 },
  { key: "toShipping", label: "To Shipping", width: 110 },
  { key: "salesOrder", label: "Sales Order", width: 110 },
];

export default function InvoicingUnified() {
  const [mode, setMode] = useState<Mode>("invoices");

  // Shared filters
  const [filters, setFilters] = useState({
    location: "all",
    division: "all",
    customerGroup: "all",
    searchBy: "customer",
    // invoice-only
    itemStatus: "all",
    createdFrom: "",
    createdTo: "",
    // billing-only
    invoicingType: "regular",
    workOrderType: "all",
    invoiceStatus: "all",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: ColumnKey; dir: "asc" | "desc" } | null>(null);
  const [columnFilters, setColumnFilters] = useState<Partial<Record<ColumnKey, string>>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeReportTab, setActiveReportTab] = useState("invoices");

  // Compute active columns for current mode
  const activeCols: ColDef[] = useMemo(
    () => [...COMMON_COLS, ...(mode === "invoices" ? INVOICE_COLS : BILLING_COLS)],
    [mode]
  );

  const [visibleCols, setVisibleCols] = useState<Set<ColumnKey>>(
    new Set([...COMMON_COLS, ...INVOICE_COLS, ...BILLING_COLS].map((c) => c.key))
  );
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(
    [...COMMON_COLS, ...INVOICE_COLS, ...BILLING_COLS].map((c) => c.key)
  );
  const [draggedColumnKey, setDraggedColumnKey] = useState<ColumnKey | null>(null);

  const reorderColumn = (fromKey: ColumnKey, toKey: ColumnKey) => {
    if (fromKey === toKey) return;
    setColumnOrder((prev) => {
      const next = [...prev];
      const fromIdx = next.indexOf(fromKey);
      const toIdx = next.indexOf(toKey);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };
  const resetColumns = () => {
    setColumnOrder([...COMMON_COLS, ...INVOICE_COLS, ...BILLING_COLS].map((c) => c.key));
    setVisibleCols(new Set([...COMMON_COLS, ...INVOICE_COLS, ...BILLING_COLS].map((c) => c.key)));
    setColumnFilters({});
  };

  const orderedVisibleColumns = useMemo(
    () =>
      columnOrder
        .map((k) => activeCols.find((c) => c.key === k))
        .filter((c): c is ColDef => !!c && visibleCols.has(c.key)),
    [columnOrder, visibleCols, activeCols]
  );

  const clearFilters = () => {
    setFilters({
      location: "all", division: "all", customerGroup: "all", searchBy: "customer",
      itemStatus: "all", createdFrom: "", createdTo: "",
      invoicingType: "regular", workOrderType: "all", invoiceStatus: "all",
    });
    setSearchQuery("");
    setColumnFilters({});
  };

  const filteredRows = useMemo(() => {
    let rows = mockRows;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) =>
        [r.reportNumber, r.accountNumber, r.customer, r.manufacturer, r.model, r.serial, r.po, r.invoiceNumber, r.woBatch, r.srNum]
          .join(" ").toLowerCase().includes(q)
      );
    }
    const active = Object.entries(columnFilters).filter(([, v]) => v?.trim());
    if (active.length) {
      rows = rows.filter((r) =>
        active.every(([key, val]) => {
          const k = key as ColumnKey;
          const term = val!.toLowerCase();
          let value: string;
          if (k === "samsaraSubmitted" || k === "proofOfDelivery") value = (r as any)[k] ? "yes" : "no";
          else value = String((r as any)[k] ?? "").toLowerCase();
          return value.includes(term);
        })
      );
    }
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = String((a as any)[sort.key] ?? "");
        const bv = String((b as any)[sort.key] ?? "");
        return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [sort, searchQuery, columnFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const allChecked = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));
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
  const doSort = (key: ColumnKey) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const cellFor = (row: InvoiceRow, key: ColumnKey) => {
    switch (key) {
      case "reportNumber":
        return <span className="font-medium text-foreground">{row.reportNumber}</span>;
      case "woStatus":
        return <Badge variant="outline" className={cn("font-medium text-[10px] h-5 px-1.5", woStatusStyles[row.woStatus])}>{row.woStatus}</Badge>;
      case "invoiceStatus":
        return <Badge variant="outline" className={cn("font-medium text-[10px] h-5 px-1.5", invoiceStatusStyles[row.invoiceStatus])}>{row.invoiceStatus}</Badge>;
      case "itemStatus":
        return <Badge variant="outline" className={cn("font-medium text-[10px] h-5 px-1.5", itemStatusStyles[row.itemStatus])}>{row.itemStatus}</Badge>;
      case "departureType":
        return <Badge variant="outline" className="font-medium text-[10px] h-5 px-1.5 bg-background text-foreground border-border">{row.departureType}</Badge>;
      case "samsaraSubmitted":
        return row.samsaraSubmitted
          ? <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px]"><CheckCircle2 className="h-3 w-3" /> Yes</span>
          : <span className="text-muted-foreground">—</span>;
      case "proofOfDelivery":
        return row.proofOfDelivery
          ? <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px]"><CheckCircle2 className="h-3 w-3" /> Yes</span>
          : <span className="text-muted-foreground">—</span>;
      default:
        return <span>{(row as any)[key]}</span>;
    }
  };

  const isInvoices = mode === "invoices";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-40">
        <StandardTopNav
          title="Invoicing Workspace"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Invoicing" }]}
        />
      </div>
      <div className="flex flex-col gap-3 p-3 md:p-4 flex-1">
        {/* Mode Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-muted rounded-full p-1 border border-border">
            <button
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full transition-colors",
                isInvoices ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setMode("invoices")}
            >
              Invoices
            </button>
            <button
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-full transition-colors",
                !isInvoices ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setMode("billingSpecialist")}
            >
              Billing Specialist
            </button>
          </div>
        </div>

        {/* Shared Filter Card */}
        <Card>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {/* Common filters */}
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
              <FieldSelect
                label="Search By"
                value={filters.searchBy}
                onChange={(v) => setFilters({ ...filters, searchBy: v })}
                options={[
                  { value: "customer", label: "Customer" },
                  { value: "account", label: "Account" },
                  { value: "workOrder", label: "Work Order" },
                  { value: "batch", label: "Batch" },
                  { value: "invoice", label: "Invoice" },
                  { value: "serial", label: "Serial Number" },
                ]}
              />

              {/* Mode-specific filters */}
              {isInvoices ? (
                <>
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
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Created From</Label>
                    <ModernDatePicker
                      value={filters.createdFrom}
                      onChange={(date) =>
                        setFilters({ ...filters, createdFrom: date ? date.toISOString().split("T")[0] : "" })
                      }
                      placeholder="MM/DD/YYYY"
                      size="lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Created To</Label>
                    <ModernDatePicker
                      value={filters.createdTo}
                      onChange={(date) =>
                        setFilters({ ...filters, createdTo: date ? date.toISOString().split("T")[0] : "" })
                      }
                      placeholder="MM/DD/YYYY"
                      size="lg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <FieldSelect
                    label="Invoicing Type"
                    value={filters.invoicingType}
                    onChange={(v) => setFilters({ ...filters, invoicingType: v })}
                    options={[
                      { value: "regular", label: "Regular" },
                      { value: "onsite", label: "Onsite" },
                      { value: "all", label: "All" },
                    ]}
                  />
                  <FieldSelect
                    label="Work Order Type"
                    value={filters.workOrderType}
                    onChange={(v) => setFilters({ ...filters, workOrderType: v })}
                    options={[
                      { value: "all", label: "All" },
                      { value: "calibration", label: "Calibration" },
                      { value: "repair", label: "Repair" },
                      { value: "certification", label: "Certification" },
                    ]}
                  />
                  <FieldSelect
                    label="Invoice Status"
                    value={filters.invoiceStatus}
                    onChange={(v) => setFilters({ ...filters, invoiceStatus: v })}
                    options={[
                      { value: "all", label: "All" },
                      { value: "pending", label: "Pending" },
                      { value: "delivery-ticket", label: "Delivery Ticket" },
                      { value: "processed", label: "Processed" },
                    ]}
                  />
                </>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="h-9" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button className="h-9">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shared Table */}
        <Card className="overflow-hidden">
          <CardHeader className="px-3 py-2 border-b border-border flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={isInvoices ? "Search invoices..." : "Search batches..."}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="pl-7 h-8 w-52 text-xs"
                />
              </div>
              {hasSelection && (
                <Badge variant="outline" className="bg-primary/10 text-foreground border-primary/20 text-xs">
                  {selectedCount} Item{selectedCount === 1 ? "" : "s"} Selected
                </Badge>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                  Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-0 bg-popover">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Columns</div>
                    <div className="text-[10px] text-muted-foreground">Drag to reorder</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetColumns}>
                    Reset
                  </Button>
                </div>
                <div className="max-h-80 overflow-auto py-1">
                  {columnOrder.map((key) => {
                    const def = activeCols.find((c) => c.key === key);
                    if (!def) return null;
                    const visible = visibleCols.has(key);
                    return (
                      <div
                        key={key}
                        draggable
                        onDragStart={(e) => { setDraggedColumnKey(key); e.dataTransfer.effectAllowed = "move"; }}
                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                        onDrop={(e) => { e.preventDefault(); if (draggedColumnKey) reorderColumn(draggedColumnKey, key); setDraggedColumnKey(null); }}
                        onDragEnd={() => setDraggedColumnKey(null)}
                        className={cn("flex items-center gap-2 px-2 py-1.5 hover:bg-muted/40", draggedColumnKey === key && "opacity-50")}
                      >
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/60 cursor-grab active:cursor-grabbing" />
                        <Checkbox
                          checked={visible}
                          onCheckedChange={(v) => {
                            const next = new Set(visibleCols);
                            v ? next.add(key) : next.delete(key);
                            setVisibleCols(next);
                          }}
                          className="h-3.5 w-3.5"
                        />
                        <span className={cn("flex-1 text-xs", !visible && "text-muted-foreground line-through")}>
                          {def.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
                <tr className="border-b border-border">
                  <th className="w-8 px-2 py-1.5 text-left">
                    <Checkbox checked={allChecked} onCheckedChange={toggleAll} aria-label="Select all" />
                  </th>
                  {orderedVisibleColumns.map((c) => (
                    <th key={c.key} style={{ minWidth: c.width }} className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      <button className="inline-flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => doSort(c.key)}>
                        {c.label}
                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                      </button>
                    </th>
                  ))}
                  <th className="px-2 py-1.5 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
                <tr className="border-b border-border">
                  <th className="w-8 px-2 py-1"></th>
                  {orderedVisibleColumns.map((c) => (
                    <th key={`${c.key}-f`} className="px-2 py-1 text-left">
                      <div className="relative">
                        <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50" />
                        <Input
                          value={columnFilters[c.key] || ""}
                          onChange={(e) => setColumnFilters((p) => ({ ...p, [c.key]: e.target.value }))}
                          className="h-6 text-[10px] pl-5 pr-5 border-muted bg-muted/30 rounded-md placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/30 transition-colors"
                        />
                        {columnFilters[c.key] && (
                          <button
                            onClick={() => setColumnFilters((p) => ({ ...p, [c.key]: "" }))}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors"
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={orderedVisibleColumns.length + 2} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <FileSearch className="h-6 w-6" />
                        </div>
                        <div className="font-medium text-foreground text-sm">
                          {isInvoices ? "No invoices found." : "No billing batches available."}
                        </div>
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
                        "hover:bg-muted/50",
                        selected.has(row.id) && "bg-primary/5"
                      )}
                    >
                      <td className="px-2 py-1.5" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                      </td>
                      {orderedVisibleColumns.map((c) => (
                        <td key={c.key} className="px-2 py-1.5 whitespace-nowrap">{cellFor(row, c.key)}</td>
                      ))}
                      <td className="px-2 py-1.5 text-right" onClick={(e) => e.stopPropagation()}>
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
          <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-border bg-background px-3 py-2">
            <div className="flex items-center gap-4">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{(page - 1) * pageSize + 1}</span>–
                <span className="font-medium text-foreground">{Math.min(page * pageSize, filteredRows.length)}</span> of{" "}
                <span className="font-medium text-foreground">{filteredRows.length}</span> items
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Show:</span>
                <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                  <SelectTrigger className="w-[80px] h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground px-2">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Invoice-only Reports Section */}
        {isInvoices && (
          <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm">Invoice Reports</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <Tabs value={activeReportTab} onValueChange={setActiveReportTab}>
                <div className="flex items-center justify-start gap-2 flex-wrap mb-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Search reports..." className="pl-7 h-8 w-52 text-xs" />
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                    Sort
                  </Button>
                </div>
                <TabsContent value="invoices">
                  <ReportsTable />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Floating Bulk Bar */}
        {hasSelection && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-2 bg-popover border border-border rounded-full shadow-lg px-3 py-2">
              <Badge className="bg-primary text-primary-foreground hover:bg-primary rounded-full">
                {selectedCount} selected
              </Badge>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="sm"><UserCog className="h-4 w-4 mr-1.5" />Assign</Button>
              <Button variant="ghost" size="sm"><Receipt className="h-4 w-4 mr-1.5" />Process</Button>
              <Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-1.5" />Export</Button>
              <Button variant="ghost" size="sm"><FileDown className="h-4 w-4 mr-1.5" />PDFs</Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                <Trash2 className="h-4 w-4 mr-1.5" />Clear
              </Button>
            </div>
          </div>
        )}

        {/* Contextual Sticky Footer */}
        <footer className="sticky bottom-0 z-40 bg-background px-6 py-3 border-t border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs h-8">
                <Receipt className="h-3.5 w-3.5 mr-1.5" />
                Process Invoice(s)
              </Button>
              {isInvoices && (
                <Button size="sm" variant="outline" className="text-xs h-8">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Process Onsite Invoice(s)
                </Button>
              )}
            </div>
            <Button size="sm" variant="outline" className="text-xs h-8">
              <Truck className="h-3.5 w-3.5 mr-1.5" />
              Delivery Tickets
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FieldSelect({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
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
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/60">
          <tr className="border-b border-border">
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Invoice Date</th>
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Report Name</th>
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Generated By</th>
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-2 py-1.5 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/50">
              <td className="px-2 py-1.5 whitespace-nowrap">{r.date}</td>
              <td className="px-2 py-1.5">{r.name}</td>
              <td className="px-2 py-1.5">{r.generatedBy}</td>
              <td className="px-2 py-1.5">
                <Badge variant="outline" className={cn(
                  "font-medium text-[10px] h-5 px-1.5",
                  r.status === "Completed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                )}>{r.status}</Badge>
              </td>
              <td className="px-2 py-1.5 text-right">
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
