import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Plus, Download, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MinimalQuotesSearch, { QuoteFilters } from "@/components/MinimalQuotesSearch";

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

const Quotes = () => {
  const [filters, setFilters] = useState<QuoteFilters>({
    globalSearch: '',
    searchTags: [],
    quoteType: '',
    poco: '',
    priority: '',
    status: '',
    location: '',
    source: '',
    salesperson: '',
    itemsQuoted: '',
    showTotals: false,
  });
  const [showTotals, setShowTotals] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const rows = useMemo(() => {
    const m = (v: string | undefined, cell: string) => !v || cell.toLowerCase().includes(v.toLowerCase());
    return QUOTES.filter((q) => {
      if (filters.globalSearch && !Object.values(q).some(v => String(v).toLowerCase().includes(filters.globalSearch.toLowerCase()))) return false;
      if (filters.quoteType && q.type !== filters.quoteType) return false;
      if (filters.poco && q.poco !== filters.poco) return false;
      if (filters.priority && q.priority !== filters.priority) return false;
      if (filters.status && q.status !== filters.status) return false;
      if (filters.location && q.location !== filters.location) return false;
      if (filters.source && q.source !== filters.source) return false;
      if (filters.salesperson && q.createdBy !== filters.salesperson) return false;
      return true;
    });
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, totalPages);
  const paged = rows.slice((current - 1) * pageSize, current * pageSize);
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  const handleSearch = (next: QuoteFilters) => {
    setFilters(next);
    setShowTotals(next.showTotals);
    setPage(1);
  };

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5 space-y-3">
        <MinimalQuotesSearch onSearch={handleSearch} />

        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    {["Quote #", "Type", "Project #", "Customer Name", "Contact First", "Contact Last", "Created Date", "Created By", "Priority", "Status", "Source", "Cust PO #", "Cust State", "Follow up Date", "Location", "PO/CO?", "Contract Pricing", "Total"].map((h) => (
                      <TableHead key={h} className="h-8 px-2 text-[11px] font-semibold whitespace-nowrap">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((q) => (
                    <TableRow key={q.quote} className="text-xs">
                      <TableCell className="px-2 py-1.5">
                        <Link to="/quotes" className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600">
                          {q.quote}
                        </Link>
                      </TableCell>
                      <TableCell className="px-2 py-1.5">{q.type}</TableCell>
                      <TableCell className="px-2 py-1.5">{q.project}</TableCell>
                      <TableCell className="px-2 py-1.5 max-w-[16rem] truncate" title={q.customer}>{q.customer}</TableCell>
                      <TableCell className="px-2 py-1.5">{q.contactFirst}</TableCell>
                      <TableCell className="px-2 py-1.5">{q.contactLast}</TableCell>
                      <TableCell className="px-2 py-1.5 whitespace-nowrap">{q.createdDate}</TableCell>
                      <TableCell className="px-2 py-1.5 whitespace-nowrap">{q.createdBy}</TableCell>
                      <TableCell className={`px-2 py-1.5 font-medium ${PRIORITY_TONE[q.priority] || ""}`}>
                        {q.priority === "Normal" ? "—" : q.priority}
                      </TableCell>
                      <TableCell className="px-2 py-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[q.status] || "bg-muted text-foreground"}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                          {q.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-2 py-1.5">{q.source}</TableCell>
                      <TableCell className="px-2 py-1.5">{q.custPo || "—"}</TableCell>
                      <TableCell className="px-2 py-1.5">{q.custState}</TableCell>
                      <TableCell className="px-2 py-1.5 whitespace-nowrap">{q.followUp || "—"}</TableCell>
                      <TableCell className="px-2 py-1.5">{q.location}</TableCell>
                      <TableCell className="px-2 py-1.5">{q.poco}</TableCell>
                      <TableCell className="px-2 py-1.5">{q.contractPricing}</TableCell>
                      <TableCell className="px-2 py-1.5 text-right tabular-nums">
                        ${q.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paged.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={18} className="py-10 text-center text-xs text-muted-foreground">
                        <FileText className="h-5 w-5 mx-auto mb-2 opacity-40" />
                        No data to display.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {showTotals && rows.length > 0 && (
              <div className="flex items-center justify-end gap-2 border-t bg-muted/30 px-3 py-2 text-xs">
                <span className="text-muted-foreground">Grand Total</span>
                <span className="font-semibold tabular-nums">
                  ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2 text-xs text-muted-foreground">
              <span>
                Page {current} of {totalPages} ({rows.length} records)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={current === 1} onClick={() => setPage(current - 1)}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={current === totalPages} onClick={() => setPage(current + 1)}>
                  <ChevronRight className="h-3.5 w-3.5" />
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
