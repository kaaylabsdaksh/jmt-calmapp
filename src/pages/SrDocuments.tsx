import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Plus,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import ModernTopNav from "@/components/modern/ModernTopNav";


type SrDoc = {
  id: string;
  sr: string;
  file: string;
  accounts: string[];
  customers: string[];
  createdDate: string;
  modifiedDate: string;
  modifiedBy: string;
  reviewDate: string;
};

const RECORDS: SrDoc[] = [
  {
    id: "1",
    sr: "SR0093",
    file: "SR0093.pdf",
    accounts: ["0540.00", "0540.02", "0540.03", "0540.04"],
    customers: [
      "International Paper",
      "International Paper-Vicksburg",
      "International Paper Reliability",
    ],
    createdDate: "11/01/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "11/20/2019",
  },
  {
    id: "2",
    sr: "SR0299",
    file: "SR0299.pdf",
    accounts: ["5113.00"],
    customers: ["HN Proficiency Testing"],
    createdDate: "11/02/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "01/09/2020",
  },
  {
    id: "3",
    sr: "SR0407",
    file: "SR0407.pdf",
    accounts: ["0152.03"],
    customers: ["J M Test Systems Surplus"],
    createdDate: "11/03/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "01/24/2020",
  },
  {
    id: "4",
    sr: "SR0408",
    file: "SR0408.pdf",
    accounts: ["0152.07"],
    customers: ["JM Test online sales"],
    createdDate: "11/03/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "01/24/2020",
  },
  {
    id: "5",
    sr: "SR0546",
    file: "SR0546.pdf",
    accounts: ["2219.00"],
    customers: ["Test & Measurement"],
    createdDate: "11/05/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "03/12/2020",
  },
  {
    id: "6",
    sr: "SR0557",
    file: "SR0557.pdf",
    accounts: ["0152.14"],
    customers: ["J M Test Systems New Sale w/CC"],
    createdDate: "11/05/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "03/12/2020",
  },
  {
    id: "7",
    sr: "SR0599",
    file: "SR0599.pdf",
    accounts: ["5918.00"],
    customers: ["Environmental Test Systems"],
    createdDate: "11/06/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "03/20/2020",
  },
  {
    id: "8",
    sr: "SR0649",
    file: "SR0649.pdf",
    accounts: ["1292.00", "1292.01", "1292.03"],
    customers: [
      "Joy Global Test Lab",
      "Joy Global Motor Shop",
      "Joy Global Electronic Assembly",
    ],
    createdDate: "11/07/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "02/05/2020",
  },
  {
    id: "9",
    sr: "SR0785",
    file: "SR0785.pdf",
    accounts: ["1004.00"],
    customers: ["Kerotest Manuf"],
    createdDate: "11/08/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "12/10/2019",
  },
  {
    id: "10",
    sr: "SR1207",
    file: "SR1207.pdf",
    accounts: ["5629.00"],
    customers: ["OFI Testing Equip"],
    createdDate: "11/09/2018",
    modifiedDate: "11/15/2018 01:42 PM",
    modifiedBy: "Admin User",
    reviewDate: "11/19/2019",
  },
  {
    id: "11",
    sr: "SR1310",
    file: "SR1310.pdf",
    accounts: ["3872.00"],
    customers: ["Gulf Coast Power Services"],
    createdDate: "12/01/2018",
    modifiedDate: "12/04/2018 09:10 AM",
    modifiedBy: "K. Reynolds",
    reviewDate: "04/02/2020",
  },
  {
    id: "12",
    sr: "SR1422",
    file: "SR1422.pdf",
    accounts: ["10428.00", "10428.01"],
    customers: ["Delta Utility Group", "Delta Utility Group - South"],
    createdDate: "12/12/2018",
    modifiedDate: "12/18/2018 03:26 PM",
    modifiedBy: "M. Alvarez",
    reviewDate: "05/15/2020",
  },
];

const toDate = (v: string) => new Date(v.split(" ")[0]);

const emptyFilters = {
  sr: "",
  acct: "",
  customer: "",
  createdFrom: "",
  createdTo: "",
  modifiedFrom: "",
  modifiedTo: "",
  reviewFrom: "",
  reviewTo: "",
};

const TruncCell = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="block max-w-full truncate text-xs">{text}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-md text-xs">{text}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const SrDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [draft, setDraft] = useState({ ...emptyFilters });
  const [applied, setApplied] = useState({ ...emptyFilters });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");

  const setField = (k: keyof typeof emptyFilters, v: string) =>
    setDraft((p) => ({ ...p, [k]: v }));

  const filtered = useMemo(() => {
    return RECORDS.filter((r) => {
      if (applied.sr && !r.sr.toLowerCase().includes(applied.sr.toLowerCase())) return false;
      if (applied.acct && !r.accounts.some((a) => a.includes(applied.acct))) return false;
      if (
        applied.customer &&
        !r.customers.some((c) => c.toLowerCase().includes(applied.customer.toLowerCase()))
      )
        return false;

      const ranges: [string, string, string][] = [
        [applied.createdFrom, applied.createdTo, r.createdDate],
        [applied.modifiedFrom, applied.modifiedTo, r.modifiedDate],
        [applied.reviewFrom, applied.reviewTo, r.reviewDate],
      ];
      for (const [from, to, value] of ranges) {
        const d = toDate(value);
        if (from && d < new Date(from)) return false;
        if (to && d > new Date(to)) return false;
      }
      return true;
    });
  }, [applied]);

  const size = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * size, current * size);

  const activeCount = Object.values(applied).filter(Boolean).length;

  const handleSearch = () => {
    setApplied({ ...draft });
    setPage(1);
  };

  const handleClear = () => {
    setDraft({ ...emptyFilters });
    setApplied({ ...emptyFilters });
    setPage(1);
  };

  const dateField = (
    label: string,
    fromKey: keyof typeof emptyFilters,
    toKey: keyof typeof emptyFilters
  ) => (
    <div className="space-y-1">
      <Label className="text-[11px] font-medium text-muted-foreground">{label}</Label>
      <DateRangePicker
        dateFrom={draft[fromKey] ? new Date(draft[fromKey]) : undefined}
        dateTo={draft[toKey] ? new Date(draft[toKey]) : undefined}
        onDateFromChange={(d) => setField(fromKey, d ? format(d, "yyyy-MM-dd") : "")}
        onDateToChange={(d) => setField(toKey, d ? format(d, "yyyy-MM-dd") : "")}
        triggerClassName="h-8 w-full bg-background"
      />
    </div>
  );


  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">SR Documents</h1>
              <p className="text-xs text-muted-foreground">
                Search, review and manage customer SR documents.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => toast({ title: "Refreshed", description: "SR documents reloaded." })}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />Export
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                onClick={() => toast({ title: "Add New SR Document", description: "New SR document form." })}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />Add New
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => navigate("/manage-customers")}
              >
                Back
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-3 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">SR #</Label>
                  <Input
                    value={draft.sr}
                    onChange={(e) => setField("sr", e.target.value)}
                    placeholder="SR0093"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">Acct #</Label>
                  <Input
                    value={draft.acct}
                    onChange={(e) => setField("acct", e.target.value)}
                    placeholder="0540.00"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">Customer Name</Label>
                  <Input
                    value={draft.customer}
                    onChange={(e) => setField("customer", e.target.value)}
                    placeholder="Search customer"
                    className="h-8 text-xs"
                  />
                </div>
                {dateField("Created Date", "createdFrom", "createdTo")}
                {dateField("Modified Date", "modifiedFrom", "modifiedTo")}
                {dateField("Review Date", "reviewFrom", "reviewTo")}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t">
                <div className="text-[11px] text-muted-foreground">
                  {activeCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Badge variant="secondary" className="h-5 text-[10px]">
                        {activeCount} filter{activeCount > 1 ? "s" : ""} applied
                      </Badge>
                      {filtered.length} record{filtered.length === 1 ? "" : "s"} found
                    </span>
                  ) : (
                    <>Showing all {filtered.length} records</>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleClear}>
                    <X className="h-3.5 w-3.5 mr-1.5" />Clear
                  </Button>
                  <Button size="sm" className="h-8 text-xs" onClick={handleSearch}>
                    <Search className="h-3.5 w-3.5 mr-1.5" />Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-[11px] font-semibold w-28">SR Doc</TableHead>
                      <TableHead className="text-[11px] font-semibold w-36">File</TableHead>
                      <TableHead className="text-[11px] font-semibold w-56">Acct #</TableHead>
                      <TableHead className="text-[11px] font-semibold">Customer</TableHead>
                      <TableHead className="text-[11px] font-semibold w-44">Modified Date</TableHead>
                      <TableHead className="text-[11px] font-semibold w-32">Modified By</TableHead>
                      <TableHead className="text-[11px] font-semibold w-32">Review Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-12 text-center">
                          <Inbox className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                          <p className="text-xs text-muted-foreground">
                            No SR documents match your search.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((r) => (
                        <TableRow key={r.id} className="hover:bg-muted/40">
                          <TableCell className="py-2">
                            <button
                              className="text-xs font-medium text-slate-900 hover:underline"
                              onClick={() => navigate(`/manage-customers/sr-documents/${r.sr}`)}
                            >
                              {r.sr}
                            </button>
                          </TableCell>
                          <TableCell className="py-2">
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              title={r.file}
                              className="inline-flex items-center gap-1.5 text-xs text-slate-900 hover:underline"
                            >
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              {r.file}
                            </a>
                          </TableCell>

                          <TableCell className="py-2 max-w-[14rem]">
                            <TruncCell text={r.accounts.join(", ")} />
                          </TableCell>
                          <TableCell className="py-2 max-w-[1px]">
                            <TruncCell text={r.customers.join(", ")} />
                          </TableCell>
                          <TableCell className="py-2 text-xs text-muted-foreground whitespace-nowrap">
                            {r.modifiedDate}
                          </TableCell>
                          <TableCell className="py-2 text-xs">{r.modifiedBy}</TableCell>
                          <TableCell className="py-2 text-xs whitespace-nowrap">{r.reviewDate}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
                <div className="text-[11px] text-muted-foreground">
                  Page {current} of {totalPages} ({filtered.length} records)
                </div>
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === current ? "default" : "outline"}
                      size="sm"
                      className="h-7 w-7 p-0 text-[11px]"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    disabled={current === totalPages}
                    onClick={() => setPage(current + 1)}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-[11px] text-muted-foreground ml-1">Page size</span>
                  <Select
                    value={pageSize}
                    onValueChange={(v) => {
                      setPageSize(v);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-7 w-16 text-[11px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
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
        </div>
      </main>
    </div>
  );
};

export default SrDocuments;
