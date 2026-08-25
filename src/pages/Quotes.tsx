import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Plus, Download, ChevronLeft, ChevronRight, FileText, Check } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Quote = {
  quote: string;
  type: string;
  project: string;
  customer: string;
  contactFirst: string;
  contactLast: string;
  createdDate: string;
  createdBy: string;
  priority: string;
  status: string;
  source: string;
  custPo: string;
  custState: string;
  followUp: string;
  location: string;
  poco: string;
  contractPricing: string;
  total: number;
};

const QUOTES: Quote[] = [
  { quote: "41022", type: "Lab", project: "PRJ-1180", customer: "Chevron Oronite (0596.00)", contactFirst: "Dana", contactLast: "Whitfield", createdDate: "08/03/2026 09:12 AM", createdBy: "Brandi M. Cali", priority: "Normal", status: "Open", source: "Phone", custPo: "4500991233", custState: "LA", followUp: "08/12/2026", location: "BR", poco: "Yes", contractPricing: "Yes", total: 4820.5 },
  { quote: "41029", type: "OnSite", project: "PRJ-1183", customer: "Dow Chemical (0333.14)", contactFirst: "Marcus", contactLast: "Reed", createdDate: "08/05/2026 01:44 PM", createdBy: "Trysten Q Howze", priority: "Rush", status: "Pending Approval", source: "Email", custPo: "", custState: "TX", followUp: "08/11/2026", location: "GR", poco: "No", contractPricing: "No", total: 15230.0 },
  { quote: "41044", type: "ESL", project: "", customer: "Southwest Calibration Service (13891.00)", contactFirst: "Alicia", contactLast: "Moreno", createdDate: "08/07/2026 10:05 AM", createdBy: "Kevin R. Young", priority: "Expedite", status: "Sent", source: "Web", custPo: "PO-77120", custState: "TX", followUp: "08/14/2026", location: "CL", poco: "Yes", contractPricing: "No", total: 2390.75 },
  { quote: "41051", type: "Lab", project: "PRJ-1190", customer: "QSA Inc (6523.00)", contactFirst: "Ben", contactLast: "Ottinger", createdDate: "08/10/2026 03:31 PM", createdBy: "Jessica M Thompson", priority: "Normal", status: "Won", source: "Salesperson", custPo: "9912-AA", custState: "MT", followUp: "", location: "MT", poco: "No", contractPricing: "Yes", total: 890.0 },
  { quote: "41068", type: "Rental", project: "", customer: "CMS Telecom Services, LLC (0215.00)", contactFirst: "Priya", contactLast: "Nandan", createdDate: "08/14/2026 08:20 AM", createdBy: "Kathryn L Jameson", priority: "Emergency", status: "Lost", source: "Phone", custPo: "", custState: "LA", followUp: "08/20/2026", location: "BR", poco: "Yes", contractPricing: "No", total: 6104.25 },
  { quote: "41077", type: "Lab", project: "PRJ-1201", customer: "Nicol Scales & Measurement (5734.01)", contactFirst: "Owen", contactLast: "Carraway", createdDate: "08/18/2026 11:58 AM", createdBy: "Vincent E. Lloyde", priority: "Normal", status: "Open", source: "Email", custPo: "PO-40188", custState: "TX", followUp: "08/25/2026", location: "CL", poco: "No", contractPricing: "Yes", total: 12750.0 },
];

const STATUS_TONE: Record<string, string> = {
  Open: "bg-blue-50 text-blue-700",
  "Pending Approval": "bg-amber-50 text-amber-700",
  Sent: "bg-slate-100 text-slate-700",
  Won: "bg-emerald-50 text-emerald-700",
  Lost: "bg-rose-50 text-rose-700",
};

const PRIORITY_TONE: Record<string, string> = {
  Emergency: "text-red-600",
  Expedite: "text-orange-600",
  Rush: "text-yellow-600",
  Normal: "text-muted-foreground",
};

const QUOTE_TYPES = ["All Quote Type", "Lab", "OnSite", "ESL", "Rental", "Sales"];
const POCO_OPTIONS = ["All PO/CO Req?", "Yes", "No"];
const PRIORITIES = ["All Priority", "Emergency", "Expedite", "Rush", "Normal"];
const ITEMS_QUOTED = ["All Items Quoted", "Yes", "No"];
const STATUSES = ["All Status", "Open", "Pending Approval", "Sent", "Won", "Lost", "Cancelled"];
const LOCATIONS = ["All Location", "BR", "CL", "GR", "MT", "HOU"];
const SOURCES = ["All Source", "Phone", "Email", "Web", "Salesperson", "Walk-in"];
const SALESPEOPLE = ["All Salesperson", "Brandi M. Cali", "Trysten Q Howze", "Kevin R. Young", "Jessica M Thompson"];
const DIVISIONS = ["All Division", "Division 1", "Division 2", "Division 3"];
const DATE_TYPE_OPTIONS = [
  { value: "created", label: "Created" },
  { value: "needBy", label: "Need By" },
  { value: "followUp", label: "Follow Up" },
];

const inputBaseClass =
  "h-6 text-[11px] px-1.5 bg-white text-black border-gray-300 placeholder:text-[10px] placeholder:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-0";
const activeInputClass = "border-yellow-400 bg-yellow-50 font-semibold pr-6";
const selectBaseClass =
  "h-6 min-h-0 text-[11px] px-1.5 py-0 w-full bg-white text-black [&>span]:text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-0 [&>svg]:h-3 [&>svg]:w-3";
const activeSelectClass = "border-yellow-400 bg-yellow-50 [&>span]:font-semibold";

const FilterText = ({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) => {
  const active = !!value;
  return (
    <div className={`relative ${className || ""}`}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className={`${inputBaseClass} w-full ${active ? activeInputClass : ""}`}
      />
      {active && (
        <Check className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-black" />
      )}
    </div>
  );
};

const FilterPick = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <Select value={value || undefined} onValueChange={onChange}>
    <SelectTrigger className={`${selectBaseClass} ${value ? activeSelectClass : ""}`}>
      <SelectValue placeholder={`All ${label}`} />
    </SelectTrigger>
    <SelectContent>
      {options.map((o) => (
        <SelectItem key={o} value={o} className="text-xs">
          {o}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const Quotes = () => {
  const [f, setF] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setPage(1);
  };
  const [dateType, setDateType] = useState<string>("created");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showTotals, setShowTotals] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const parseDatePart = (value: string) => {
    if (!value) return undefined;
    const [part] = value.split(" ");
    const [m, d, y] = part.split("/").map(Number);
    if (!m || !d || !y) return undefined;
    return new Date(y, m - 1, d);
  };

  const inDateRange = (value: string) => {
    if (!dateFrom && !dateTo) return true;
    const d = parseDatePart(value);
    if (!d) return false;
    if (dateFrom && d < dateFrom) return false;
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      if (d > end) return false;
    }
    return true;
  };

  const rows = useMemo(() => {
    const m = (v: string | undefined, cell: string) => !v || cell.toLowerCase().includes(v.toLowerCase());
    const isFiltered = (v: string | undefined) => !!v && !v.startsWith("All ");
    return QUOTES.filter((q) => {
      if (!m(f.quote, q.quote)) return false;
      if (!m(f.project, q.project)) return false;
      if (!m(f.customer, q.customer)) return false;
      if (!m(f.acct, q.customer)) return false;
      if (!m(f.contactFirst, q.contactFirst)) return false;
      if (!m(f.contactLast, q.contactLast)) return false;
      if (!m(f.createdBy, q.createdBy)) return false;
      if (!m(f.custPo, q.custPo)) return false;
      if (!m(f.state, q.custState)) return false;
      if (isFiltered(f.quoteType) && q.type !== f.quoteType) return false;
      if (isFiltered(f.poco) && q.poco !== f.poco) return false;
      if (isFiltered(f.priority) && q.priority !== f.priority) return false;
      if (isFiltered(f.status) && q.status !== f.status) return false;
      if (isFiltered(f.location) && q.location !== f.location) return false;
      if (isFiltered(f.source) && q.source !== f.source) return false;
      if (isFiltered(f.salesperson) && q.createdBy !== f.salesperson) return false;
      if (dateType === "created" && !inDateRange(q.createdDate)) return false;
      if (dateType === "followUp" && !inDateRange(q.followUp)) return false;
      if (dateType === "needBy" && !inDateRange(q.createdDate)) return false;
      return true;
    });
  }, [f, dateType, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, totalPages);
  const paged = rows.slice((current - 1) * pageSize, current * pageSize);
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  const clearAll = () => {
    setF({});
    setDateType("created");
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-3 lg:px-4 py-2 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold tracking-tight">Quotes</h1>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-[11px] px-2">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button size="sm" className="h-7 text-[11px] px-2 bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-3 w-3 mr-1" />
              Add New
            </Button>
          </div>
        </div>

        <Card className="bg-card rounded-xl shadow-sm border">
          <CardContent className="p-3 space-y-2">
            {/* Grouped filter sections — fixed 3x2 grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Quote Details</h3>
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-1">
                  <FilterPick label="Quote Type" value={f.quoteType} onChange={(v) => set("quoteType", v)} options={QUOTE_TYPES} />
                  <FilterPick label="PO/CO Req?" value={f.poco} onChange={(v) => set("poco", v)} options={POCO_OPTIONS} />
                  <FilterText label="Quote #" value={f.quote || ""} onChange={(v) => set("quote", v)} />
                  <FilterText label="Project #" value={f.project || ""} onChange={(v) => set("project", v)} />
                  <FilterPick label="Priority" value={f.priority} onChange={(v) => set("priority", v)} options={PRIORITIES} />
                  <FilterText label="Cust PO #" value={f.custPo || ""} onChange={(v) => set("custPo", v)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Customer</h3>
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-1">
                  <FilterText label="Customer Name" value={f.customer || ""} onChange={(v) => set("customer", v)} />
                  <FilterText label="Acct #" value={f.acct || ""} onChange={(v) => set("acct", v)} />
                  <FilterText label="City" value={f.city || ""} onChange={(v) => set("city", v)} />
                  <FilterText label="State" value={f.state || ""} onChange={(v) => set("state", v)} />
                  <FilterText label="Industry Code" value={f.industryCode || ""} onChange={(v) => set("industryCode", v)} className="col-span-2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Contact</h3>
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-1">
                  <FilterText label="Contact First" value={f.contactFirst || ""} onChange={(v) => set("contactFirst", v)} />
                  <FilterText label="Contact Last" value={f.contactLast || ""} onChange={(v) => set("contactLast", v)} />
                  <FilterText label="Phone #" value={f.phone || ""} onChange={(v) => set("phone", v)} />
                  <FilterText label="Cell #" value={f.cell || ""} onChange={(v) => set("cell", v)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Status &amp; Sales</h3>
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-1">
                  <FilterPick label="Status" value={f.status} onChange={(v) => set("status", v)} options={STATUSES} />
                  <FilterPick label="Items Quoted" value={f.itemsQuoted} onChange={(v) => set("itemsQuoted", v)} options={ITEMS_QUOTED} />
                  <FilterPick label="Source" value={f.source} onChange={(v) => set("source", v)} options={SOURCES} />
                  <FilterPick label="Salesperson" value={f.salesperson} onChange={(v) => set("salesperson", v)} options={SALESPEOPLE} />
                  <FilterText label="Created By" value={f.createdBy || ""} onChange={(v) => set("createdBy", v)} className="col-span-2" />
                </div>
              </div>

              <div className="space-y-1.5 col-span-2">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Timeline &amp; Location</h3>
                <div className="space-y-1">
                  <DateRangePicker
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    onDateFromChange={setDateFrom}
                    onDateToChange={setDateTo}
                    dateType={dateType}
                    onDateTypeChange={setDateType}
                    dateTypeOptions={DATE_TYPE_OPTIONS}
                    triggerClassName="h-7"
                  />
                  <Select value={f.location || undefined} onValueChange={(v) => set("location", v)}>
                    <SelectTrigger className={`${selectBaseClass} ${f.location ? activeSelectClass : ""}`}>
                      <SelectValue placeholder="All Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((o) => (
                        <SelectItem key={o} value={o} className="text-xs">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={f.division || undefined} onValueChange={(v) => set("division", v)}>
                    <SelectTrigger className={`${selectBaseClass} ${f.division ? activeSelectClass : ""}`}>
                      <SelectValue placeholder="All Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIVISIONS.map((o) => (
                        <SelectItem key={o} value={o} className="text-xs">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer hover:text-foreground/80">
                <Checkbox checked={showTotals} onCheckedChange={(v) => setShowTotals(!!v)} className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-slate-900" />
                Show Totals
              </label>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={clearAll}>
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
                <Button size="sm" className="h-7 text-xs px-2" onClick={() => setPage(1)}>
                  <Search className="h-3.5 w-3.5 mr-1" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-xl shadow-sm border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    {["Quote #", "Type", "Project #", "Customer Name", "Contact First", "Contact Last", "Created Date", "Created By", "Priority", "Status", "Source", "Cust PO #", "Cust State", "Follow up Date", "Location", "PO/CO?", "Contract Pricing", "Total"].map((h) => (
                      <TableHead key={h} className="h-7 px-1.5 text-[10px] font-semibold whitespace-nowrap">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((q) => (
                    <TableRow key={q.quote} className="text-[11px]">
                      <TableCell className="px-1.5 py-1">
                        <Link to="/quotes" className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600">
                          {q.quote}
                        </Link>
                      </TableCell>
                      <TableCell className="px-1.5 py-1">{q.type}</TableCell>
                      <TableCell className="px-1.5 py-1">{q.project}</TableCell>
                      <TableCell className="px-1.5 py-1 max-w-[16rem] truncate" title={q.customer}>{q.customer}</TableCell>
                      <TableCell className="px-1.5 py-1">{q.contactFirst}</TableCell>
                      <TableCell className="px-1.5 py-1">{q.contactLast}</TableCell>
                      <TableCell className="px-1.5 py-1 whitespace-nowrap">{q.createdDate}</TableCell>
                      <TableCell className="px-1.5 py-1 whitespace-nowrap">{q.createdBy}</TableCell>
                      <TableCell className={`px-1.5 py-1 font-medium ${PRIORITY_TONE[q.priority] || ""}`}>
                        {q.priority === "Normal" ? "—" : q.priority}
                      </TableCell>
                      <TableCell className="px-1.5 py-1">
                        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0 text-[10px] font-medium ${STATUS_TONE[q.status] || "bg-muted text-foreground"}`}>
                          <span className="h-1 w-1 rounded-full bg-current opacity-70" />
                          {q.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-1.5 py-1">{q.source}</TableCell>
                      <TableCell className="px-1.5 py-1">{q.custPo || "—"}</TableCell>
                      <TableCell className="px-1.5 py-1">{q.custState}</TableCell>
                      <TableCell className="px-1.5 py-1 whitespace-nowrap">{q.followUp || "—"}</TableCell>
                      <TableCell className="px-1.5 py-1">{q.location}</TableCell>
                      <TableCell className="px-1.5 py-1">{q.poco}</TableCell>
                      <TableCell className="px-1.5 py-1">{q.contractPricing}</TableCell>
                      <TableCell className="px-1.5 py-1 text-right tabular-nums">
                        ${q.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paged.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={18} className="py-8 text-center text-[11px] text-muted-foreground">
                        <FileText className="h-4 w-4 mx-auto mb-1.5 opacity-40" />
                        No data to display.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {showTotals && rows.length > 0 && (
              <div className="flex items-center justify-end gap-2 border-t bg-muted/30 px-2 py-1.5 text-[11px]">
                <span className="text-muted-foreground">Grand Total</span>
                <span className="font-semibold tabular-nums">
                  ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t px-2 py-1.5 text-[11px] text-muted-foreground">
              <span>
                Page {current} of {totalPages} ({rows.length} records)
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" disabled={current === 1} onClick={() => setPage(current - 1)}>
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="h-6 w-6 p-0" disabled={current === totalPages} onClick={() => setPage(current + 1)}>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Quotes;
