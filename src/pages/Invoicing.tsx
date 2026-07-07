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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BillingSpecialistView } from "@/components/BillingSpecialistView";
import StandardTopNav from "@/components/shared/StandardTopNav";

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
  { key: "reportNumber", label: "Report Number", width: 150 },
  { key: "accountNumber", label: "Account #", width: 95 },
  { key: "customer", label: "Customer", width: 180 },
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
  { key: "proofOfDelivery", label: "Proof of Delivery", width: 120 },
];

// ---------- Page ----------
export default function Invoicing() {
  const [loading] = useState(false);
  const [viewMode, setViewMode] = useState<"invoices" | "billingSpecialist">("invoices");

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
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(
    ALL_COLUMNS.map((c) => c.key)
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
    setColumnOrder(ALL_COLUMNS.map((c) => c.key));
    setVisibleCols(new Set(ALL_COLUMNS.map((c) => c.key)));
    setColumnFilters({});
  };
  const orderedVisibleColumns = useMemo(
    () =>
      columnOrder
        .map((k) => ALL_COLUMNS.find((c) => c.key === k)!)
        .filter((c) => c && visibleCols.has(c.key)),
    [columnOrder, visibleCols]
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drawerRow, setDrawerRow] = useState<InvoiceRow | null>(null);
  const [activeReportTab, setActiveReportTab] = useState("invoices");
  const [searchQuery, setSearchQuery] = useState("");
  const [columnFilters, setColumnFilters] = useState<Partial<Record<ColumnKey, string>>>({});

  // Filtered rows
  const filteredRows = useMemo(() => {
    let rows = mockRows;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) =>
        [
          r.reportNumber,
          r.accountNumber,
          r.customer,
          r.manufacturer,
          r.model,
          r.serial,
          r.po,
          r.invoiceNumber,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    const activeFilters = Object.entries(columnFilters).filter(([, v]) => v?.trim());
    if (activeFilters.length > 0) {
      rows = rows.filter((r) =>
        activeFilters.every(([key, val]) => {
          const k = key as ColumnKey;
          const term = val!.toLowerCase();
          let value: string;
          if (k === "samsaraSubmitted" || k === "proofOfDelivery") {
            value = r[k] ? "yes" : "no";
          } else {
            value = String(r[k] ?? "").toLowerCase();
          }
          return value.includes(term);
        })
      );
    }
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = String(a[sort.key] ?? "");
        const bv = String(b[sort.key] ?? "");
        return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [sort, searchQuery, columnFilters]);

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
          <Badge variant="outline" className={cn("font-medium text-[10px] h-5 px-1.5", woStatusStyles[row.woStatus])}>
            {row.woStatus}
          </Badge>
        );
      case "invoiceStatus":
        return (
          <Badge
            variant="outline"
            className={cn("font-medium text-[10px] h-5 px-1.5", invoiceStatusStyles[row.invoiceStatus])}
          >
            {row.invoiceStatus}
          </Badge>
        );
      case "itemStatus":
        return (
          <Badge
            variant="outline"
            className={cn("font-medium text-[10px] h-5 px-1.5", itemStatusStyles[row.itemStatus])}
          >
            {row.itemStatus}
          </Badge>
        );
      case "departureType":
        return (
          <Badge
            variant="outline"
            className="font-medium text-[10px] h-5 px-1.5 bg-background text-foreground border-border"
          >
            {row.departureType}
          </Badge>
        );
      case "samsaraSubmitted":
        return row.samsaraSubmitted ? (
          <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px]">
            <CheckCircle2 className="h-3 w-3" /> Yes
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      case "proofOfDelivery":
        return row.proofOfDelivery ? (
          <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px]">
            <CheckCircle2 className="h-3 w-3" /> Yes
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      default:
        return <span>{(row as any)[key]}</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-40">
        <StandardTopNav
          title={viewMode === "billingSpecialist" ? "Invoicing (Billing Specialist)" : "Invoicing"}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Invoicing" },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3 p-3 md:p-4 flex-1">
        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-muted rounded-full p-1 border border-border">
            <button
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                viewMode === "invoices"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("invoices")}
            >
              Invoices
            </button>
            <button
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
                viewMode === "billingSpecialist"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("billingSpecialist")}
            >
              Billing Specialist
            </button>
          </div>
        </div>

        {viewMode === "invoices" ? (
          <>
            {/* Filter Card */}
            <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
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
              <ModernDatePicker
                value={filters.createdFrom}
                onChange={(date) =>
                  setFilters({
                    ...filters,
                    createdFrom: date ? date.toISOString().split("T")[0] : "",
                  })
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
                  setFilters({
                    ...filters,
                    createdTo: date ? date.toISOString().split("T")[0] : "",
                  })
                }
                placeholder="MM/DD/YYYY"
                size="lg"
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
            <div className="space-y-1.5 flex flex-col justify-end">
              <div className="flex gap-2">
                <Button className="flex-1 h-10">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={() =>
                    setFilters({
                      itemStatus: "all",
                      location: "all",
                      createdFrom: "",
                      createdTo: "",
                      division: "all",
                      customerGroup: "all",
                    })
                  }
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-3 py-2 border-b border-border flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-7 h-8 w-52 text-xs"
              />
            </div>
            {hasSelection && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-foreground border-primary/20 text-xs"
              >
                {selectedCount} Item{selectedCount === 1 ? "" : "s"} Selected
              </Badge>
            )}
          </div>
          <div>
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
                  const def = ALL_COLUMNS.find((c) => c.key === key);
                  if (!def) return null;
                  const visible = visibleCols.has(key);
                  return (
                    <div
                      key={key}
                      draggable
                      onDragStart={(e) => {
                        setDraggedColumnKey(key);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedColumnKey) reorderColumn(draggedColumnKey, key);
                        setDraggedColumnKey(null);
                      }}
                      onDragEnd={() => setDraggedColumnKey(null)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 hover:bg-muted/40",
                        draggedColumnKey === key && "opacity-50"
                      )}
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
                      <span
                        className={cn(
                          "flex-1 text-xs",
                          !visible && "text-muted-foreground line-through"
                        )}
                      >
                        {def.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          </div>


        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="w-8 px-2 py-1.5 text-left">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                {orderedVisibleColumns.map((c) => (
                  <th
                    key={c.key}
                    style={{ minWidth: c.width }}
                    className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap"
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
                <th className="px-2 py-1.5 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
              <tr className="border-b border-border">
                <th className="w-8 px-2 py-1"></th>
                {orderedVisibleColumns.map((c) => (
                  <th key={`${c.key}-filter`} className="px-2 py-1 text-left">
                    <div className="relative">
                      <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50" />
                      <Input
                        placeholder=""
                        value={columnFilters[c.key] || ""}
                        onChange={(e) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            [c.key]: e.target.value,
                          }))
                        }
                        className="h-6 text-[10px] pl-5 pr-5 border-muted bg-muted/30 rounded-md placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/30 transition-colors"
                      />
                      {columnFilters[c.key] && (
                        <button
                          onClick={() =>
                            setColumnFilters((prev) => ({
                              ...prev,
                              [c.key]: "",
                            }))
                          }
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
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={ALL_COLUMNS.length + 2} className="p-2">
                      <div className="h-5 rounded-md bg-muted animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={ALL_COLUMNS.length + 2}
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <FileSearch className="h-6 w-6" />
                      </div>
                      <div className="font-medium text-foreground text-sm">
                        No invoices found.
                      </div>
                      <p className="text-xs">
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
                      "hover:bg-muted/50",
                      selected.has(row.id) && "bg-primary/5"
                    )}
                    onClick={() => setDrawerRow(row)}
                  >
                    <td
                      className="px-2 py-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                      />
                    </td>
                    {orderedVisibleColumns.map(
                      (c) => (
                        <td
                          key={c.key}
                          className="px-2 py-1.5 whitespace-nowrap"
                        >
                          {cellFor(row, c.key)}
                        </td>
                      )
                    )}
                    <td
                      className="px-2 py-1.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3.5 w-3.5" />
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
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-border bg-background px-3 py-2">
          <div className="flex items-center gap-4">
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
              items
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[80px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                  <SelectItem value="999999">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm">Invoice Reports</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <Tabs value={activeReportTab} onValueChange={setActiveReportTab}>
            <div className="flex items-center justify-start gap-2 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search reports..." className="pl-7 h-8 w-52 text-xs" />
                </div>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
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

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 z-40 bg-background px-6 py-3 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "text-xs h-8",
                activeReportTab === "invoices" && "ring-2 ring-primary"
              )}
              onClick={() => setActiveReportTab("invoices")}
            >
              <Receipt className="h-3.5 w-3.5 mr-1.5" />
              Process Invoices
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "text-xs h-8",
                activeReportTab === "onsite" && "ring-2 ring-primary"
              )}
              onClick={() => setActiveReportTab("onsite")}
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Process Onsite Invoices
            </Button>
          </div>
          <Button size="sm" variant="outline" className="text-xs h-8">
            <Truck className="h-3.5 w-3.5 mr-1.5" />
            Delivery Tickets
          </Button>
        </div>
      </footer>
      </>
        ) : (
          <BillingSpecialistView />
        )}
      </div>
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const totalPages = Math.max(1, Math.ceil(reports.length / pageSize));
  const pageReports = reports.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/60">
          <tr className="border-b border-border">
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">
              Invoice Date
            </th>
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">
              Report Name
            </th>
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">
              Generated By
            </th>
            <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">
              Status
            </th>
            <th className="px-2 py-1.5 text-right font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
            {pageReports.map((r, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-b-0 hover:bg-muted/50"
              >
              <td className="px-2 py-1.5 whitespace-nowrap">{r.date}</td>
              <td className="px-2 py-1.5">{r.name}</td>
              <td className="px-2 py-1.5">{r.generatedBy}</td>
              <td className="px-2 py-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium text-[10px] h-5 px-1.5",
                    r.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                  )}
                >
                  {r.status}
                </Badge>
              </td>
              <td className="px-2 py-1.5 text-right">
                <div className="inline-flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(page - 1) * pageSize + 1}
            </span>
            –
            <span className="font-medium text-foreground">
              {Math.min(page * pageSize, reports.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {reports.length}
            </span>{" "}
            items
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Show:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[80px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="250">250</SelectItem>
                <SelectItem value="999999">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
    </div>
  );
}
