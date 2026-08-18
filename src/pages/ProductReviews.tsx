import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Plus, Package, ChevronLeft, ChevronRight } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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

function parseDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [m, d, y] = value.split("/");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.getFullYear() === Number(y) && date.getMonth() === Number(m) - 1 && date.getDate() === Number(d) ? date : undefined;
}

function formatDate(value: Date | undefined): string {
  if (!value) return "";
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  const y = value.getFullYear();
  return `${m}/${d}/${y}`;
}

type Review = {
  pr: string;
  item: string;
  division: string;
  loc: string;
  createdDate: string;
  createdBy: string;
  dueDate: string;
  status: string;
  statusDate: string;
  manufacturer: string;
  model: string;
  description: string;
  labCode: string;
  quote: string;
  customer: string;
};

const REVIEWS: Review[] = [
  { pr: "PR05524", item: "002", division: "Lab", loc: "CL", createdDate: "04/30/2021 09:34 AM", createdBy: "Brandi M. Cali", dueDate: "05/01/2021", status: "Lab Management", statusDate: "04/30/2021", manufacturer: "MILWAUKEE", model: "MLDIG14", description: '14" DIGITAL LEVER WITH PINPOINT MEASUREMENT TECHNOLOGY', labCode: "", quote: "22491", customer: "First Instrument Solutions (6613.00)" },
  { pr: "PR05587", item: "001", division: "Lab", loc: "CL", createdDate: "05/12/2021 10:26 AM", createdBy: "Trysten Q Howze", dueDate: "05/13/2021", status: "Lab Management", statusDate: "05/12/2021", manufacturer: "MEASUREMENT SPECIALTIES", model: "SP3-25", description: "LINEAR POSITION SENSOR", labCode: "", quote: "", customer: "Southwest Calibration Service (13891.00)" },
  { pr: "PR05701", item: "001", division: "Lab", loc: "CL", createdDate: "05/27/2021 01:50 PM", createdBy: "Trysten Q Howze", dueDate: "05/28/2021", status: "Lab Management", statusDate: "05/27/2021", manufacturer: "HAMAR LASER", model: "S-680", description: "SHAFT ALIGNMENT SYSTEMS", labCode: "B", quote: "23368", customer: "Southwest Calibration Service (13891.00)" },
  { pr: "PR05901", item: "001", division: "Lab", loc: "BR", createdDate: "06/25/2021 07:02 AM", createdBy: "Vincent E. Lloyde", dueDate: "06/26/2021", status: "Initiator", statusDate: "06/25/2021", manufacturer: "GENERAL ELECTRIC", model: "CAT 245A2006PI", description: "GROUND DETECTOR", labCode: "G", quote: "", customer: "Chevron Oronite (0596.00)" },
  { pr: "PR06597", item: "001", division: "Lab", loc: "CL", createdDate: "10/06/2021 08:31 AM", createdBy: "Trysten Q Howze", dueDate: "10/07/2021", status: "Lab Management", statusDate: "10/06/2021", manufacturer: "SURFACE ANALYST", model: "SA3001", description: "HANDHELD SURFACE INSPECTION DEVICE", labCode: "", quote: "27056", customer: "Nicol Scales & Measurement (5734.01)" },
  { pr: "PR06961", item: "001", division: "Lab", loc: "MT", createdDate: "12/07/2021 08:35 AM", createdBy: "Jessica M Thompson", dueDate: "12/08/2021", status: "Lab Management", statusDate: "12/07/2021", manufacturer: "DATA PRECISION", model: "2590R", description: "MULTIMETER", labCode: "M", quote: "28965", customer: "QSA Inc (6523.00)" },
  { pr: "PR08355", item: "001", division: "Lab", loc: "CL", createdDate: "07/29/2022 10:31 AM", createdBy: "Kevin R. Young", dueDate: "07/30/2022", status: "Lab Management", statusDate: "07/29/2022", manufacturer: "AMERICAN INNOVATIONS", model: "DVM1100", description: "DIGITAL VOLTMETER", labCode: "G", quote: "", customer: "Dow Chemical Freeport Bm-059 (0871.01)" },
  { pr: "PR08413", item: "004", division: "", loc: "BR", createdDate: "08/08/2022 03:51 PM", createdBy: "Kathryn L Jameson", dueDate: "08/09/2022", status: "Review Initiated", statusDate: "08/08/2022", manufacturer: "VIAVI", model: "FIBER CHECK", description: "FIBER OPTIC MICROSCOPE", labCode: "", quote: "36221", customer: "CMS Telecom Services, LLC (0215.00)" },
  { pr: "PR08736", item: "001", division: "ESL", loc: "BR", createdDate: "09/26/2022 09:01 AM", createdBy: "Tom J. Corvers", dueDate: "09/27/2022", status: "Initiator", statusDate: "09/26/2022", manufacturer: "TRANLUZ", model: "RMT3090", description: "HIGH VOLTAGE DETECTOR", labCode: "N", quote: "", customer: "Controles Y Proyectos SA (13430.00)" },
  { pr: "PR09094", item: "001", division: "OnSite", loc: "GR", createdDate: "11/16/2022 12:57 PM", createdBy: "Andrea D. Jeansonne", dueDate: "11/17/2022", status: "Lab Management", statusDate: "11/16/2022", manufacturer: "MILLER", model: "PROHEAT 35", description: "INDUCTION HEATER", labCode: "P", quote: "", customer: "Dow Chemical (0333.14)" },
];

const STATUS_TONE: Record<string, string> = {
  "Lab Management": "bg-blue-50 text-blue-700",
  Initiator: "bg-amber-50 text-amber-700",
  "Review Initiated": "bg-slate-100 text-slate-700",
};

const TEXT_FILTERS = [
  { key: "pr", label: "PR #" },
  { key: "acct", label: "Acct #" },
  { key: "customer", label: "Customer Name" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "model", label: "Model" },
  { key: "description", label: "Description" },
  { key: "quote", label: "Quote #" },
] as const;

const SELECT_FILTERS = [
  { key: "prStatus", label: "PR Status", options: ["Awaiting Review", "Review Initiated", "Initiator", "Metrology", "Lab Management", "Lead Tech", "Sales", "Completed"] },
  { key: "itemStatus", label: "PR Item Status", options: ["[All Open Items]", "[All Items]", "Open", "Completed", "Cancelled"] },
  { key: "location", label: "Location", options: ["BR", "CL", "GR", "MT", "HOU"] },
  { key: "division", label: "Division", options: ["Lab", "ESL", "OnSite"] },
  { key: "labCode", label: "Lab Code", options: ["B", "G", "M", "N", "P"] },
] as const;

const emptyText = Object.fromEntries(TEXT_FILTERS.map((f) => [f.key, ""])) as Record<string, string>;
const emptySelect = Object.fromEntries(SELECT_FILTERS.map((f) => [f.key, ""])) as Record<string, string>;

const ProductReviews = () => {
  const navigate = useNavigate();
  const [text, setText] = useState<Record<string, string>>({ ...emptyText });
  const [selects, setSelects] = useState<Record<string, string>>({ ...emptySelect });
  const [createdBy, setCreatedBy] = useState("");
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>(undefined);
  const [createdTo, setCreatedTo] = useState<Date | undefined>(undefined);
  const [dueFrom, setDueFrom] = useState<Date | undefined>(undefined);
  const [dueTo, setDueTo] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");

  const rows = useMemo(() => {
    return REVIEWS.filter((r) => {
      const match = (v: string, cell: string) => !v || cell.toLowerCase().includes(v.toLowerCase());
      if (!match(text.pr, r.pr)) return false;
      if (!match(text.customer, r.customer)) return false;
      if (!match(text.manufacturer, r.manufacturer)) return false;
      if (!match(text.model, r.model)) return false;
      if (!match(text.description, r.description)) return false;
      if (!match(text.quote, r.quote)) return false;
      if (!match(createdBy, r.createdBy)) return false;
      if (selects.prStatus && r.status !== selects.prStatus) return false;
      if (selects.location && r.loc !== selects.location) return false;
      if (selects.division && r.division !== selects.division) return false;
      if (selects.labCode && r.labCode !== selects.labCode) return false;
      return true;
    });
  }, [text, selects, createdBy]);

  const size = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, totalPages);
  const paged = rows.slice((current - 1) * size, current * size);

  const clearAll = () => {
    setText({ ...emptyText });
    setSelects({ ...emptySelect });
    setCreatedBy("");
    setCreatedFrom(undefined);
    setCreatedTo(undefined);
    setDueFrom(undefined);
    setDueTo(undefined);
    setPage(1);
  };

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight">Product Reviews</h1>
          <Button
            size="sm"
            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
            onClick={() => navigate("/manage-products/product-review/new")}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add New
          </Button>
        </div>

        <Card className="border-border/60">
          <CardContent className="p-2 sm:p-3 space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-1.5">
              {TEXT_FILTERS.map((f) => (
                <div key={f.key} className="space-y-0.5">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">{f.label}</Label>
                  <Input
                    value={text[f.key]}
                    onChange={(e) => {
                      setText((p) => ({ ...p, [f.key]: e.target.value }));
                      setPage(1);
                    }}
                    className="h-7 text-[11px] px-2"
                  />
                </div>
              ))}
              {SELECT_FILTERS.map((f) => (
                <div key={f.key} className="space-y-0.5">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">{f.label}</Label>
                  <Select
                    value={selects[f.key] || undefined}
                    onValueChange={(v) => {
                      setSelects((p) => ({ ...p, [f.key]: v }));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-7 text-[11px] px-2">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options.map((o) => (
                        <SelectItem key={o} value={o} className="text-xs">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">Created By</Label>
                <Input value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} className="h-7 text-[11px] px-2" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">Created From / To</Label>
                <DateRangePicker
                  dateFrom={createdFrom}
                  dateTo={createdTo}
                  onDateFromChange={setCreatedFrom}
                  onDateToChange={setCreatedTo}
                />
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">Due From / To</Label>
                <DateRangePicker
                  dateFrom={dueFrom}
                  dateTo={dueTo}
                  onDateFromChange={setDueFrom}
                  onDateToChange={setDueTo}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
              <Button size="sm" variant="outline" className="h-7 text-[11px] px-2" onClick={() => navigate("/manage-products")}>
                <Package className="h-3.5 w-3.5 mr-1.5" />
                Products
              </Button>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 text-[11px] px-2" onClick={clearAll}>
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Clear
                </Button>
                <Button size="sm" className="h-7 text-[11px] px-2" onClick={() => setPage(1)}>
                  <Search className="h-3.5 w-3.5 mr-1.5" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    {["PR #", "Item", "Division", "Loc", "Created Date", "Created By", "Due Date", "PR Item Status", "Status Date", "Manufacturer", "Model", "Description", "LabCode", "Quote #", "Customer"].map((h) => (
                      <TableHead key={h} className="h-8 px-2 text-[11px] font-semibold whitespace-nowrap">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((r) => (
                    <TableRow key={r.pr} className="text-xs">
                      <TableCell className="px-2 py-1.5">
                        <Link
                          to="/manage-products/product-review/new"
                          className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600"
                        >
                          {r.pr}
                        </Link>
                      </TableCell>
                      <TableCell className="px-2 py-1.5">{r.item}</TableCell>
                      <TableCell className="px-2 py-1.5">{r.division}</TableCell>
                      <TableCell className="px-2 py-1.5">{r.loc}</TableCell>
                      <TableCell className="px-2 py-1.5 whitespace-nowrap">{r.createdDate}</TableCell>
                      <TableCell className="px-2 py-1.5">{r.createdBy}</TableCell>
                      <TableCell className="px-2 py-1.5 whitespace-nowrap">{r.dueDate}</TableCell>
                      <TableCell className="px-2 py-1.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            STATUS_TONE[r.status] || "bg-muted text-foreground"
                          }`}
                        >
                          {r.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-2 py-1.5 whitespace-nowrap">{r.statusDate}</TableCell>
                      <TableCell className="px-2 py-1.5">{r.manufacturer}</TableCell>
                      <TableCell className="px-2 py-1.5">{r.model}</TableCell>
                      <TableCell className="px-2 py-1.5 max-w-[16rem] truncate" title={r.description}>
                        {r.description}
                      </TableCell>
                      <TableCell className="px-2 py-1.5">{r.labCode}</TableCell>
                      <TableCell className="px-2 py-1.5 text-slate-900">{r.quote}</TableCell>
                      <TableCell className="px-2 py-1.5">{r.customer}</TableCell>
                    </TableRow>
                  ))}
                  {paged.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={15} className="py-8 text-center text-xs text-muted-foreground">
                        No product reviews match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2 text-xs text-muted-foreground">
              <span>
                Page {current} of {totalPages} ({rows.length} records)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={current === 1}
                  onClick={() => setPage(current - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={current === totalPages}
                  onClick={() => setPage(current + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Select value={pageSize} onValueChange={(v) => { setPageSize(v); setPage(1); }}>
                  <SelectTrigger className="h-7 w-[70px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["10", "25", "50"].map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProductReviews;
