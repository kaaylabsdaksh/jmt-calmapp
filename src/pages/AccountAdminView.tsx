import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO, differenceInCalendarDays, startOfDay } from "date-fns";
import {
  Search,
  RefreshCw,
  Download,
  Bookmark,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  RotateCcw,
  GripVertical,

  X,
  SlidersHorizontal,
  Inbox,
  AlertTriangle,
  Zap,
  Clock,
  FileText,
  Package,
} from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type Priority = "EMERGENCY" | "EXPEDITE" | "RUSH" | "NORMAL";

interface AdminItem {
  itemNumber: string;
  location: string;
  fromLocation: string;
  departureType: string;
  itemStatus: string;
  minorStatus: string;
  manufacturer: string;
  model: string;
  deliverBy: string;
  poNumber: string;
  salesOrder: string;
  priority: Priority;
  qualifying: boolean;
  closed?: boolean;
}

interface AdminBatch {
  woNumber: string;
  customer: string;
  account: string;
  contact: string;
  phone: string;
  location: string;
  arrivalType: "Regular" | "Onsite";
  customerGroup: string;
  division: string;
  invoiceStatus: string;
  lastComment: string;
  lastCommentAge: string;
  followUp: string;
  deliverBy: string;
  salesOrder: string;
  status: string;
  items: AdminItem[];
}

/* -------------------------------------------------------------------------- */
/* Mock data                                                                   */
/* -------------------------------------------------------------------------- */

const LOCATIONS = ["Port Arthur", "Houston", "Baton Rouge", "Odessa", "Norco"];
const CUSTOMER_GROUPS = ["A", "B", "C", "D", "E", "0", "1", "2", "3", "4"];
const DIVISIONS = ["Transmission", "Distribution", "Substation", "Industrial", "Generation"];
const INVOICE_STATUSES = ["Pending", "Approved", "Sent", "Paid", "Disputed", "Invoiced"];

const mkItems = (wo: string, defs: Partial<AdminItem>[]): AdminItem[] =>
  defs.map((d, i) => ({
    itemNumber: `${String(i + 1).padStart(3, "0")}`,
    location: "Baton Rouge",
    fromLocation: "Houston",
    departureType: "Ship",
    itemStatus: "AR Invoicing",
    minorStatus: "Waiting on Customer",
    manufacturer: "FLUKE",
    model: "87V",
    deliverBy: "2026-08-14",
    poNumber: `PO-${wo}-${i + 1}`,
    salesOrder: `SO-${wo}`,
    priority: "NORMAL",
    qualifying: false,
    ...d,
  }));

const MOCK_BATCHES: AdminBatch[] = [
  {
    woNumber: "100212",
    customer: "Marathon Petroleum",
    account: "MAR-4410",
    contact: "Dana Whitfield",
    phone: "(225) 555-0142",
    location: "Baton Rouge",
    arrivalType: "Regular",
    customerGroup: "A",
    division: "Industrial",
    lastComment: "Waiting for customer approval on revised quote before we can invoice the remaining four items.",
    lastCommentAge: "2 hours ago",
    followUp: "2026-07-30",
    deliverBy: "2026-08-05",
    salesOrder: "SO-88120",
    status: "AR Invoicing",
    invoiceStatus: "Pending",
    items: mkItems("100212", [
      { priority: "EMERGENCY", qualifying: true, itemStatus: "AR Invoicing", minorStatus: "Hold - Billing" },
      { priority: "RUSH", qualifying: true, manufacturer: "DRUCK", model: "DPI 611" },
      { manufacturer: "AMETEK", model: "RTC-159" },
      { closed: true, itemStatus: "Closed", minorStatus: "Completed", manufacturer: "HIOKI", model: "PW3198" },
    ]),
  },
  {
    woNumber: "100218",
    customer: "Shell Norco Refinery",
    account: "SHL-2210",
    contact: "Marcus Lee",
    phone: "(985) 555-0188",
    location: "Norco",
    arrivalType: "Onsite",
    customerGroup: "B",
    division: "Industrial",
    lastComment: "Customer requested consolidated delivery ticket for all onsite items.",
    lastCommentAge: "1 day ago",
    followUp: "2026-08-03",
    deliverBy: "2026-08-11",
    salesOrder: "SO-88144",
    status: "Ready for Departure",
    invoiceStatus: "Sent",
    items: mkItems("100218", [
      { priority: "EXPEDITE", qualifying: true, departureType: "Customer Pickup" },
      { priority: "NORMAL", qualifying: true, manufacturer: "PROTO", model: "6062C" },
      { manufacturer: "FLUKE", model: "754" },
    ]),
  },
  {
    woNumber: "100224",
    customer: "CF Industries",
    account: "CFI-7781",
    contact: "Priya Nair",
    phone: "(225) 555-0173",
    location: "Port Arthur",
    arrivalType: "Regular",
    customerGroup: "C",
    division: "Industrial",
    lastComment: "PO received, ready to bill once freight cost posts.",
    lastCommentAge: "4 hours ago",
    followUp: "2026-08-04",
    deliverBy: "2026-08-19",
    salesOrder: "SO-88171",
    status: "Ready to Bill",
    invoiceStatus: "Approved",
    items: mkItems("100224", [
      { priority: "RUSH", qualifying: true, itemStatus: "Ready to Bill" },
      { manufacturer: "ASHCROFT", model: "TG-60" },
    ]),
  },
  {
    woNumber: "100231",
    customer: "Entergy Louisiana",
    account: "ENT-3320",
    contact: "Rob Castille",
    phone: "(225) 555-0119",
    location: "Baton Rouge",
    arrivalType: "Regular",
    customerGroup: "1",
    division: "Distribution",
    lastComment: "Left voicemail with AP contact regarding outstanding PO.",
    lastCommentAge: "3 days ago",
    followUp: "2026-07-28",
    deliverBy: "2026-08-02",
    salesOrder: "SO-88203",
    status: "Waiting on Customer",
    invoiceStatus: "Disputed",
    items: mkItems("100231", [
      { priority: "EXPEDITE", qualifying: true, minorStatus: "Awaiting PO" },
      { priority: "NORMAL", qualifying: false, manufacturer: "FLUKE", model: "726" },
      { closed: true, itemStatus: "Closed", minorStatus: "Completed" },
    ]),
  },
  {
    woNumber: "100240",
    customer: "Performance Contractors",
    account: "PER-9915",
    contact: "Alicia Fontenot",
    phone: "(337) 555-0166",
    location: "Odessa",
    arrivalType: "Onsite",
    customerGroup: "D",
    division: "Industrial",
    lastComment: "Quote #Q-4471 sent for the replacement torque wrenches.",
    lastCommentAge: "6 hours ago",
    followUp: "2026-08-06",
    deliverBy: "2026-08-21",
    salesOrder: "SO-88240",
    status: "AR Invoicing",
    invoiceStatus: "Invoiced",
    items: mkItems("100240", [
      { priority: "NORMAL", qualifying: true, manufacturer: "PROTO", model: "6062D" },
      { manufacturer: "FLUKE", model: "87V" },
      { manufacturer: "DRUCK", model: "DPI 610" },
    ]),
  },
  {
    woNumber: "100255",
    customer: "Valero Houston",
    account: "VAL-5540",
    contact: "Kim Doucet",
    phone: "(713) 555-0102",
    location: "Houston",
    arrivalType: "Regular",
    customerGroup: "2",
    division: "Industrial",
    lastComment: "Billing exception cleared, awaiting final departure scan.",
    lastCommentAge: "30 minutes ago",
    followUp: "2026-08-12",
    deliverBy: "2026-08-26",
    salesOrder: "SO-88266",
    status: "Completed",
    invoiceStatus: "Paid",
    items: mkItems("100255", [
      { priority: "RUSH", qualifying: true, itemStatus: "Ready for Departure" },
      { closed: true, itemStatus: "Closed", minorStatus: "Completed" },
    ]),
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const PRIORITY_RANK: Record<Priority, number> = { EMERGENCY: 0, EXPEDITE: 1, RUSH: 2, NORMAL: 3 };

const batchPriority = (batch: AdminBatch): Priority => {
  const qualifying = batch.items.filter((i) => i.qualifying && !i.closed);
  if (qualifying.length === 0) return "NORMAL";
  return qualifying.reduce<Priority>(
    (acc, i) => (PRIORITY_RANK[i.priority] < PRIORITY_RANK[acc] ? i.priority : acc),
    "NORMAL"
  );
};

const BORDER_BY_PRIORITY: Record<Priority, string> = {
  EMERGENCY: "bg-foreground",
  EXPEDITE: "bg-destructive",
  RUSH: "bg-yellow-400",
  NORMAL: "bg-purple-500",
};

const ROW_TINT_BY_PRIORITY: Record<Priority, string> = {
  EMERGENCY: "bg-foreground/5",
  EXPEDITE: "bg-destructive/5",
  RUSH: "bg-yellow-400/10",
  NORMAL: "bg-purple-500/5",
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  if (priority === "NORMAL") return null;
  const config: Record<string, { icon: typeof AlertTriangle; className: string }> = {
    EMERGENCY: { icon: AlertTriangle, className: "bg-foreground/10 text-foreground" },
    EXPEDITE: { icon: Zap, className: "bg-destructive/10 text-destructive" },
    RUSH: { icon: Zap, className: "bg-yellow-500/15 text-yellow-700" },
  };
  const entry = config[priority];
  const Icon = entry.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${entry.className}`}
    >
      <Icon className="h-3 w-3" />
      {priority}
    </span>
  );
};

const STATUS_STYLES: Record<string, string> = {
  "AR Invoicing": "bg-info/10 text-info",
  "Waiting on Customer": "bg-warning/15 text-warning",
  "Ready for Departure": "bg-purple-500/10 text-purple-600",
  "Ready to Bill": "bg-success/10 text-success",
  Completed: "bg-success/10 text-success",
  Closed: "bg-muted text-muted-foreground",
  "Hold - Billing": "bg-destructive/10 text-destructive",
  "Awaiting PO": "bg-warning/15 text-warning",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${
      STATUS_STYLES[status] || "bg-muted text-muted-foreground"
    }`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
    {status}
  </span>
);

const TODAY = startOfDay(new Date("2026-08-03"));

const followUpMeta = (date: string) => {
  const d = parseISO(date);
  const diff = differenceInCalendarDays(d, TODAY);
  if (diff < 0) return { label: "Overdue", detail: format(d, "MMM d"), className: "text-destructive", overdue: true };
  if (diff === 0) return { label: "Today", detail: format(d, "MMM d"), className: "text-destructive", overdue: true };
  if (diff === 1) return { label: "Tomorrow", detail: format(d, "MMM d"), className: "text-orange-600", overdue: false };
  return { label: format(d, "MMM d"), detail: format(d, "yyyy"), className: "text-success", overdue: false };
};

/* -------------------------------------------------------------------------- */
/* Column definitions                                                          */
/* -------------------------------------------------------------------------- */

const ALL_COLUMNS = [
  { key: "woNumber", label: "WO Number" },
  { key: "priority", label: "Priority" },
  { key: "customer", label: "Customer" },
  { key: "account", label: "Account" },
  { key: "contact", label: "Contact" },
  { key: "phone", label: "Phone" },
  { key: "openItems", label: "Open Items" },
  { key: "lastComment", label: "Last Comment" },
  { key: "followUp", label: "Minimum Follow-Up" },
  { key: "deliverBy", label: "Deliver By" },
  { key: "salesOrder", label: "Sales Order" },
  { key: "actions", label: "Actions" },
] as const;

type ColumnKey = (typeof ALL_COLUMNS)[number]["key"];

/* -------------------------------------------------------------------------- */
/* Item table                                                                  */
/* -------------------------------------------------------------------------- */

const ItemTable = ({
  batch,
  onPo,
  onSo,
}: {
  batch: AdminBatch;
  onPo: (v: string) => void;
  onSo: (v: string) => void;
}) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <table className="w-full text-xs">
        <thead className="bg-muted/60">
          <tr className="text-left text-[10px] uppercase tracking-wide text-muted-foreground">
            {[
              "Item #",
              "Location",
              "From Location",
              "Departure Type",
              "Item Status",
              "Minor Status",
              "Manufacturer",
              "Model",
              "Deliver By",
              "PO Number",
              "Sales Order",
            ].map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {batch.items.map((item) => {
            const tint = item.closed
              ? "bg-muted/40 text-muted-foreground"
              : item.qualifying
              ? ROW_TINT_BY_PRIORITY[item.priority]
              : "";
            return (
              <tr key={item.itemNumber} className={`border-t border-border ${tint}`}>
                <td className="whitespace-nowrap px-3 py-2">
                  <button
                    onClick={() => navigate("/edit-order")}
                    className="font-semibold text-foreground underline underline-offset-2 hover:text-foreground/70"
                  >
                    {batch.account}-{batch.woNumber}-{item.itemNumber}
                  </button>
                </td>
                <td className="whitespace-nowrap px-3 py-2">{item.location}</td>
                <td className="whitespace-nowrap px-3 py-2">{item.fromLocation}</td>
                <td className="whitespace-nowrap px-3 py-2">{item.departureType}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  <StatusBadge status={item.itemStatus} />
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <StatusBadge status={item.minorStatus} />
                </td>
                <td className="whitespace-nowrap px-3 py-2">{item.manufacturer}</td>
                <td className="whitespace-nowrap px-3 py-2">{item.model}</td>
                <td className="whitespace-nowrap px-3 py-2">{format(parseISO(item.deliverBy), "MMM d, yyyy")}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  <button
                    onClick={() => onPo(item.poNumber)}
                    className="underline underline-offset-2 hover:text-foreground/70"
                  >
                    {item.poNumber}
                  </button>
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <button
                    onClick={() => onSo(item.salesOrder)}
                    className="underline underline-offset-2 hover:text-foreground/70"
                  >
                    {item.salesOrder}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Batch row                                                                   */
/* -------------------------------------------------------------------------- */

const BatchRow = ({
  batch,
  columns,
  onPo,
  onSo,
}: {
  batch: AdminBatch;
  columns: ColumnKey[];
  onPo: (v: string) => void;
  onSo: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const priority = batchPriority(batch);
  const openItems = batch.items.filter((i) => !i.closed).length;
  const fu = followUpMeta(batch.followUp);

  const cell = (key: ColumnKey) => {
    switch (key) {
      case "woNumber":
        return (
          <td key={key} className="whitespace-nowrap px-3 py-2 font-semibold text-foreground">
            WO-{batch.woNumber}
          </td>
        );
      case "priority":
        return (
          <td key={key} className="whitespace-nowrap px-3 py-2">
            <PriorityBadge priority={priority} />
          </td>
        );
      case "customer":
        return (
          <td key={key} className="max-w-[180px] truncate px-3 py-2 font-medium">
            {batch.customer}
          </td>
        );
      case "account":
        return <td key={key} className="whitespace-nowrap px-3 py-2">{batch.account}</td>;
      case "contact":
        return <td key={key} className="whitespace-nowrap px-3 py-2">{batch.contact}</td>;
      case "phone":
        return <td key={key} className="whitespace-nowrap px-3 py-2 text-muted-foreground">{batch.phone}</td>;
      case "openItems":
        return (
          <td key={key} className="whitespace-nowrap px-3 py-2">
            <span className="font-semibold text-foreground">{openItems}</span>
            <span className="text-muted-foreground"> / {batch.items.length}</span>
          </td>
        );
      case "lastComment":
        return (
          <td key={key} className="px-3 py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[220px] cursor-default">
                  <p className="truncate text-foreground">{batch.lastComment}</p>
                  <p className="text-[10px] text-muted-foreground">{batch.lastCommentAge}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">{batch.lastComment}</TooltipContent>
            </Tooltip>
          </td>
        );
      case "followUp":
        return (
          <td key={key} className="whitespace-nowrap px-3 py-2">
            <span className={`font-semibold ${fu.className}`}>{fu.label}</span>
            <span className="ml-1 text-[10px] text-muted-foreground">{fu.detail}</span>
          </td>
        );
      case "deliverBy":
        return (
          <td key={key} className="whitespace-nowrap px-3 py-2">
            {format(parseISO(batch.deliverBy), "MMM d, yyyy")}
          </td>
        );
      case "salesOrder":
        return (
          <td key={key} className="whitespace-nowrap px-3 py-2">
            <button onClick={() => onSo(batch.salesOrder)} className="underline underline-offset-2">
              {batch.salesOrder}
            </button>
          </td>
        );
      case "actions":
        return (
          <td
            key={key}
            className="sticky right-0 z-10 whitespace-nowrap bg-card px-3 py-2 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] group-hover:bg-muted/40"
          >
            <div className="flex items-center gap-1.5">
              {["Delivery Ticket", "Quote", "Follow Up", "Ready to Bill"].map((label) => (
                <Button key={label} variant="outline" size="sm" className="h-7 px-2 text-[11px]">
                  {label}
                </Button>
              ))}
            </div>
          </td>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <tr className="group border-t border-border transition-colors hover:bg-muted/40">
        <td className="w-8 py-0 pl-0 pr-0">
          <div className="flex items-stretch">
            <div className={`w-[3px] self-stretch ${BORDER_BY_PRIORITY[priority]}`} style={{ minHeight: 40 }} />
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-6 w-6 p-0"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Collapse batch" : "Expand batch"}
            >
              {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </td>
        {columns.map(cell)}
      </tr>
      {open && (
        <tr className="border-t border-border bg-muted/20">
          <td colSpan={columns.length + 1} className="px-4 py-3">
            <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
              {[
                { label: "Customer", value: batch.customer },
                { label: "Account", value: batch.account },
                { label: "Sales Order", value: batch.salesOrder },
                { label: "Priority", value: priority },
                { label: "Open Items", value: String(openItems) },
                { label: "Next Follow-Up", value: `${fu.label} · ${fu.detail}` },
                { label: "Status", value: batch.status },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{f.label}</p>
                  <p className="truncate text-xs font-medium text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-3 rounded-md border border-border bg-card px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Last Comment</p>
              <p className="text-xs text-foreground">{batch.lastComment}</p>
              <p className="text-[10px] text-muted-foreground">{batch.lastCommentAge}</p>
            </div>
            <ItemTable batch={batch} onPo={onPo} onSo={onSo} />
          </td>
        </tr>
      )}
    </>
  );
};

const FilterPill = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 py-0.5 pl-2 pr-1 text-[11px] font-medium text-foreground">
    {label}
    <button
      onClick={onRemove}
      aria-label={`Remove ${label}`}
      className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <X className="h-3 w-3" />
    </button>
  </span>
);



/* -------------------------------------------------------------------------- */
/* Multi select filter                                                         */
/* -------------------------------------------------------------------------- */

const MultiSelect = ({
  label,
  options,
  values,
  onChange,
  searchable = false,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
  searchable?: boolean;
}) => {
  const [query, setQuery] = useState("");
  const display = values.length === 0 ? "All" : values.length === 1 ? values[0] : `${values.length} selected`;
  const filtered = query.trim() ? options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase())) : options;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm ${
            values.length > 0
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-card text-foreground hover:border-foreground/30"
          }`}
        >
          <span className="opacity-70">{label}:</span>
          <span className="font-semibold">{display}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        {searchable && (
          <div className="relative mb-1.5">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="h-7 pl-7 text-xs"
            />
          </div>
        )}
        <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
          <button
            onClick={() => onChange([])}
            className="rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            All
          </button>
          {filtered.length === 0 && (
            <div className="px-2 py-3 text-center text-xs text-muted-foreground">No matches</div>
          )}
          {filtered.map((o) => (
            <button
              key={o}
              onClick={() => onChange(values.includes(o) ? values.filter((v) => v !== o) : [...values, o])}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                values.includes(o) ? "bg-primary/10 font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Checkbox checked={values.includes(o)} className="pointer-events-none h-3.5 w-3.5" />
              {o}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};


/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

const AccountAdminView = () => {
  const { toast } = useToast();

  const [locations, setLocations] = useState<string[]>([]);
  const [arrivalType, setArrivalType] = useState<"All" | "Regular" | "Onsite">("All");
  const [groups, setGroups] = useState<string[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [invoiceStatuses, setInvoiceStatuses] = useState<string[]>([]);
  const [excludeOpenItems, setExcludeOpenItems] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(ALL_COLUMNS.map((c) => c.key));
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(ALL_COLUMNS.map((c) => c.key));
  const [dragCol, setDragCol] = useState<ColumnKey | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnKey | null>(null);

  const [followUpOpen, setFollowUpOpen] = useState(true);
  const [upcomingOpen, setUpcomingOpen] = useState(true);
  const [poDialog, setPoDialog] = useState<string | null>(null);
  const [soDialog, setSoDialog] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("accountAdminFilters");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.locations)) setLocations(parsed.locations);
        if (parsed.arrivalType === "All" || parsed.arrivalType === "Regular" || parsed.arrivalType === "Onsite") {
          setArrivalType(parsed.arrivalType);
        }
        if (Array.isArray(parsed.groups)) setGroups(parsed.groups);
        if (Array.isArray(parsed.divisions)) setDivisions(parsed.divisions);
        if (Array.isArray(parsed.invoiceStatuses)) setInvoiceStatuses(parsed.invoiceStatuses);
        if (typeof parsed.excludeOpenItems === "boolean") setExcludeOpenItems(parsed.excludeOpenItems);
        if (typeof parsed.search === "string") setSearch(parsed.search);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const saveFilterDefaults = () => {
    const payload = { search, locations, arrivalType, groups, divisions, invoiceStatuses, excludeOpenItems };
    localStorage.setItem("accountAdminFilters", JSON.stringify(payload));
    toast({ title: "Filter defaults saved", description: "Current filters will be applied on your next visit." });
  };

  const resetFilters = () => {
    setLocations([]);
    setArrivalType("All");
    setGroups([]);
    setDivisions([]);
    setInvoiceStatuses([]);
    setExcludeOpenItems(false);
    setSearch("");
    toast({ title: "Filters reset", description: "Showing all qualifying batches." });
  };


  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast({ title: "Batch refreshed", description: "Queue data is up to date." });
    }, 700);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_BATCHES.filter((b) => {
      if (locations.length && !locations.includes(b.location)) return false;
      if (arrivalType !== "All" && b.arrivalType !== arrivalType) return false;
      if (groups.length && !groups.includes(b.customerGroup)) return false;
      if (divisions.length && !divisions.includes(b.division)) return false;
      if (invoiceStatuses.length && !invoiceStatuses.includes(b.invoiceStatus)) return false;
      if (
        q &&
        ![b.woNumber, b.customer, b.account, b.contact, b.salesOrder].some((v) => v.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
  }, [locations, arrivalType, groups, divisions, invoiceStatuses, search]);

  const sortBatches = (list: AdminBatch[]) =>
    [...list].sort((a, b) => {
      const fu = parseISO(a.followUp).getTime() - parseISO(b.followUp).getTime();
      if (fu !== 0) return fu;
      const db = parseISO(a.deliverBy).getTime() - parseISO(b.deliverBy).getTime();
      if (db !== 0) return db;
      return a.woNumber.localeCompare(b.woNumber);
    });

  const needsFollowUp = sortBatches(filtered.filter((b) => followUpMeta(b.followUp).overdue));
  const upcoming = sortBatches(filtered.filter((b) => !followUpMeta(b.followUp).overdue));

  const kpis = useMemo(() => {
    const openItems = filtered.reduce((sum, b) => sum + b.items.filter((i) => !i.closed).length, 0);
    const byPriority = (p: Priority) => filtered.filter((b) => batchPriority(b) === p).length;
    return [
      { label: "Total Batches", value: filtered.length, icon: Package, accent: "bg-slate-400", tone: "text-foreground", iconTone: "text-slate-500" },
      { label: "Needs Follow-Up", value: needsFollowUp.length, icon: Clock, accent: "bg-amber-500", tone: "text-amber-600", iconTone: "text-amber-500" },
      { label: "Ready to Bill", value: filtered.filter((b) => b.status === "Ready to Bill").length, icon: FileText, accent: "bg-success", tone: "text-success", iconTone: "text-success" },
      { label: "Emergency", value: byPriority("EMERGENCY"), icon: AlertTriangle, accent: "bg-destructive", tone: "text-destructive", iconTone: "text-destructive" },
      { label: "Expedite", value: byPriority("EXPEDITE"), icon: Zap, accent: "bg-orange-500", tone: "text-orange-600", iconTone: "text-orange-500" },
      { label: "Rush", value: byPriority("RUSH"), icon: Zap, accent: "bg-yellow-400", tone: "text-yellow-600", iconTone: "text-yellow-500" },
      { label: "Open Items", value: openItems, icon: Inbox, accent: "bg-info", tone: "text-info", iconTone: "text-info" },
    ];
  }, [filtered, needsFollowUp.length]);


  const orderedColumns = columnOrder
    .map((k) => ALL_COLUMNS.find((c) => c.key === k)!)
    .filter((c) => c && visibleColumns.includes(c.key));
  const columns = orderedColumns.map((c) => c.key);

  const moveColumn = (index: number, dir: -1 | 1) => {
    setColumnOrder((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const reorderColumns = (from: ColumnKey, to: ColumnKey) => {
    if (from === to) return;
    setColumnOrder((prev) => {
      const next = [...prev];
      const fromIdx = next.indexOf(from);
      const toIdx = next.indexOf(to);
      if (fromIdx < 0 || toIdx < 0) return prev;
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, from);
      return next;
    });
  };


  const resetColumns = () => {
    setColumnOrder(ALL_COLUMNS.map((c) => c.key));
    setVisibleColumns(ALL_COLUMNS.map((c) => c.key));
  };



  const renderSection = (
    title: string,
    list: AdminBatch[],
    open: boolean,
    setOpen: (v: boolean) => void
  ) => (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden">
        <div className="flex w-full items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
          <CollapsibleTrigger asChild>
            <button className="flex flex-1 items-center gap-2 text-left">
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="text-sm font-semibold text-foreground">{title}</span>
              <Badge variant="secondary" className="text-[10px]">{list.length}</Badge>
            </button>
          </CollapsibleTrigger>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-7 w-7" title="Columns">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </Button>

            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2">
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Columns
                </span>
                <Button variant="ghost" size="sm" className="h-6 gap-1 px-1.5 text-[11px]" onClick={resetColumns}>
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </div>
              <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto">
                {columnOrder.map((key, idx) => {
                  const c = ALL_COLUMNS.find((col) => col.key === key)!;
                  return (
                    <div
                      key={key}
                      draggable
                      onDragStart={() => setDragCol(key)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverCol(key);
                      }}
                      onDragLeave={() => setDragOverCol((p) => (p === key ? null : p))}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (dragCol) reorderColumns(dragCol, key);
                        setDragCol(null);
                        setDragOverCol(null);
                      }}
                      onDragEnd={() => {
                        setDragCol(null);
                        setDragOverCol(null);
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1 text-xs text-foreground hover:bg-muted",
                        dragCol === key && "opacity-50",
                        dragOverCol === key && dragCol !== key && "ring-1 ring-primary"
                      )}
                    >
                      <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
                      <button
                        onClick={() =>
                          setVisibleColumns((prev) =>
                            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
                          )
                        }
                        className="flex flex-1 items-center gap-2 text-left"
                      >
                        <Checkbox checked={visibleColumns.includes(key)} className="pointer-events-none h-3.5 w-3.5" />
                        {c.label}
                      </button>
                      <button
                        onClick={() => moveColumn(idx, -1)}
                        disabled={idx === 0}
                        className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-30"
                        title="Move up"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveColumn(idx, 1)}
                        disabled={idx === columnOrder.length - 1}
                        className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-30"
                        title="Move down"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}

              </div>
            </PopoverContent>
          </Popover>
        </div>


        <CollapsibleContent>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-2 p-4">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No qualifying batches found.</p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 z-10 bg-card">
                    <tr className="text-left text-[10px] uppercase tracking-wide text-muted-foreground">
                      <th className="w-8 px-0 py-2" />
                      {orderedColumns.map((c) => (
                        <th
                          key={c.key}
                          className={cn(
                            "whitespace-nowrap px-3 py-2 font-semibold",
                            c.key === "actions" && "sticky right-0 z-20 bg-card shadow-[-2px_0_4px_rgba(0,0,0,0.05)]"
                          )}
                        >
                          {c.label}
                        </th>
                      ))}

                    </tr>
                  </thead>
                  <tbody>
                    {list.map((b) => (
                      <BatchRow
                        key={b.woNumber}
                        batch={b}
                        columns={columns}
                        onPo={setPoDialog}
                        onSo={setSoDialog}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="border-b border-border bg-card px-2 py-3 sm:px-4 lg:px-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <SidebarTrigger className="text-foreground transition-all hover:bg-muted" />
              <div>
                <h1 className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                  Account Admin View
                </h1>
                <Breadcrumb className="mt-1 hidden sm:block">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
                        <Link to="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-xs font-medium text-foreground">Account Admin</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={refresh} aria-label="Refresh">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Refresh</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Export"
                    onClick={() => toast({ title: "Export complete", description: "Batch queue exported to Excel." })}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Export</TooltipContent>
              </Tooltip>


            </div>
          </div>
        </header>

        <main className="space-y-4 px-2 py-4 sm:px-4 lg:px-6">
          <Tabs defaultValue="admin-triage" className="space-y-4">

            <TabsContent value="admin-triage" className="space-y-4">
              {/* Filter card */}
              <Card>
                <CardContent className="space-y-3 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search WO, customer, account, SO..."
                        className="h-8 rounded-lg pl-9 text-xs"
                      />
                    </div>

                    <MultiSelect label="Location" options={LOCATIONS} values={locations} onChange={setLocations} searchable />

                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm ${
                            arrivalType !== "All"
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-card text-foreground hover:border-foreground/30"
                          }`}
                        >
                          <span className="opacity-70">Arrival Type:</span>
                          <span className="font-semibold">{arrivalType}</span>
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2" align="start">
                        <div className="flex flex-col gap-0.5">
                          {(["All", "Regular", "Onsite"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setArrivalType(t)}
                              className={`rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                                arrivalType === t
                                  ? "bg-primary/10 font-medium text-foreground"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>


                    <MultiSelect label="Customer Group" options={CUSTOMER_GROUPS} values={groups} onChange={setGroups} searchable />

                    <MultiSelect label="Division" options={DIVISIONS} values={divisions} onChange={setDivisions} searchable />

                    <MultiSelect label="Invoice Status" options={INVOICE_STATUSES} values={invoiceStatuses} onChange={setInvoiceStatuses} searchable />


                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => toast({ title: "Filters applied", description: `${filtered.length} batches match.` })}
                      >
                        Search
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={resetFilters}>
                        Clear
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={saveFilterDefaults}>
                            <Bookmark className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Save Filters</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {(search.trim() || locations.length > 0 || groups.length > 0 || divisions.length > 0 || invoiceStatuses.length > 0 || arrivalType !== "All") && (
                    <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-2">
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Filters</span>
                      {search.trim() && (
                        <FilterPill label={`Search: ${search.trim()}`} onRemove={() => setSearch("")} />
                      )}
                      {arrivalType !== "All" && (
                        <FilterPill label={`Type: ${arrivalType}`} onRemove={() => setArrivalType("All")} />
                      )}
                      {locations.map((l) => (
                        <FilterPill
                          key={`loc-${l}`}
                          label={`Location: ${l}`}
                          onRemove={() => setLocations(locations.filter((x) => x !== l))}
                        />
                      ))}
                      {groups.map((g) => (
                        <FilterPill
                          key={`grp-${g}`}
                          label={`Group: ${g}`}
                          onRemove={() => setGroups(groups.filter((x) => x !== g))}
                        />
                      ))}
                      {divisions.map((d) => (
                        <FilterPill
                          key={`div-${d}`}
                          label={`Division: ${d}`}
                          onRemove={() => setDivisions(divisions.filter((x) => x !== d))}
                        />
                      ))}
                      {invoiceStatuses.map((s) => (
                        <FilterPill
                          key={`inv-${s}`}
                          label={`Invoice Status: ${s}`}
                          onRemove={() => setInvoiceStatuses(invoiceStatuses.filter((x) => x !== s))}
                        />
                      ))}
                      <button
                        onClick={resetFilters}
                        className="ml-1 text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
                {loading
                  ? kpis.map((k) => <Skeleton key={k.label} className="h-[70px] w-full" />)
                  : kpis.map((k) => (
                      <Card key={k.label} className="relative overflow-hidden">
                        <span className={`absolute inset-y-0 left-0 w-1 ${k.accent}`} />
                        <CardContent className="flex items-center justify-between p-3 pl-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{k.label}</p>
                            <p className={`text-lg font-semibold ${k.tone}`}>{k.value}</p>
                          </div>
                          <k.icon className={`h-4 w-4 ${k.iconTone}`} />
                        </CardContent>
                      </Card>
                    ))}
              </div>





              {renderSection("Needs Follow-Up", needsFollowUp, followUpOpen, setFollowUpOpen)}
              {renderSection("Upcoming", upcoming, upcomingOpen, setUpcomingOpen)}
            </TabsContent>
          </Tabs>
        </main>

        {/* Sticky bottom action bar */}
        <div className="fixed bottom-0 left-[var(--sidebar-width,16rem)] right-0 z-30 border-t border-border bg-card px-4 py-2.5 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> batches ·{" "}
              <span className="font-semibold text-destructive">{needsFollowUp.length}</span> need follow-up
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">Delivery Ticket</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">Quote</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">Follow Up</Button>
              <Button size="sm" className="h-8 text-xs">Ready to Bill</Button>
            </div>
          </div>
        </div>

        {/* PO / SO popups */}
        <Dialog open={!!poDialog} onOpenChange={(o) => !o && setPoDialog(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm">Purchase Order {poDialog}</DialogTitle>
            </DialogHeader>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>PO Number: <span className="font-medium text-foreground">{poDialog}</span></p>
              <p>Status: <span className="font-medium text-foreground">Received</span></p>
              <p>Amount: <span className="font-medium text-foreground">$4,280.00</span></p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!soDialog} onOpenChange={(o) => !o && setSoDialog(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm">Sales Order {soDialog}</DialogTitle>
            </DialogHeader>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Sales Order: <span className="font-medium text-foreground">{soDialog}</span></p>
              <p>Status: <span className="font-medium text-foreground">Open</span></p>
              <p>Line Items: <span className="font-medium text-foreground">4</span></p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default AccountAdminView;
