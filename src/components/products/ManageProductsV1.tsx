import { useMemo, useState } from "react";
import {
  Search,
  X,
  Plus,
  Download,
  Inbox,
  ClipboardCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
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

type Product = {
  id: string;
  manufacturer: string;
  model: string;
  description: string;
  alias: string;
  lc: string;
  locations: string;
  tf: string;
  calCost: string;
  groupType: string;
  productType: string;
  accredCal: string;
  status: string;
  prItem: string;
  prStatus: string;
  rental: string;
  option: string;
  range: string;
  accuracy: string;
};

const PRODUCTS: Product[] = [];

const SELECT_FILTERS = [
  { key: "labCode", label: "Lab Code", options: ["BR", "HOU", "GON", "MOB"] },
  {
    key: "techCategory",
    label: "Technical/Labs Category",
    options: ["Electrical", "Mechanical", "Temperature", "Pressure"],
    multi: true,
  },
  {
    key: "rentalCategory",
    label: "Rental/Sales Category",
    options: ["Rental", "Sales", "Both"],
    multi: true,
  },
] as const;

const CHECK_FILTERS = [
  { key: "includeProductReview", label: "Include Product Review" },
  { key: "onlyProductReview", label: "Only Include Product Review" },
  { key: "includeRental", label: "Include Rental" },
  { key: "ascProduct", label: "ASC Product" },
  { key: "showCategories", label: "Show Categories" },
  { key: "showTemplate", label: "Show Template" },
] as const;

const COLUMNS = [
  { key: "id", label: "ID", width: "w-16", type: "input" },
  { key: "manufacturer", label: "Manufacturer", width: "w-32", type: "input" },
  { key: "model", label: "Model", width: "w-28", type: "input" },
  { key: "description", label: "Product Description", width: "w-56", type: "input" },
  { key: "alias", label: "Alias", width: "w-28", type: "input" },
  { key: "lc", label: "LC", width: "w-20", type: "select" },
  { key: "locations", label: "Capable Location(s)", width: "w-48", type: "input" },
  { key: "tf", label: "TF", width: "w-16", type: "select" },
  { key: "calCost", label: "Cal/Cert Cost", width: "w-24", type: "input" },
  { key: "groupType", label: "Group Type", width: "w-28", type: "select" },
  { key: "productType", label: "Product Type", width: "w-28", type: "select" },
  { key: "accredCal", label: "Accred Cal", width: "w-24", type: "select" },
  { key: "status", label: "Status", width: "w-28", type: "select" },
  { key: "prItem", label: "PR Item", width: "w-24", type: "input" },
  { key: "prStatus", label: "PR Status", width: "w-28", type: "select" },
  { key: "rental", label: "Rental", width: "w-24", type: "select" },
  { key: "option", label: "Option", width: "w-24", type: "input" },
  { key: "range", label: "Range", width: "w-24", type: "input" },
  { key: "accuracy", label: "Accuracy", width: "w-24", type: "input" },
] as const;

const emptySelects = Object.fromEntries(SELECT_FILTERS.map((f) => [f.key, ""])) as Record<string, string>;
const emptyMultiSelects = { techCategory: [] as string[], rentalCategory: [] as string[] };
const emptyChecks = Object.fromEntries(CHECK_FILTERS.map((f) => [f.key, false])) as Record<string, boolean>;
const emptyColumnFilters = Object.fromEntries(COLUMNS.map((c) => [c.key, ""])) as Record<string, string>;

const ManageProductsV1 = () => {
  const [generalSearch, setGeneralSearch] = useState("");
  const [selects, setSelects] = useState<Record<string, string>>({ ...emptySelects });
  const [multiSelects, setMultiSelects] = useState<{ techCategory: string[]; rentalCategory: string[] }>({
    ...emptyMultiSelects,
  });
  const [checks, setChecks] = useState<Record<string, boolean>>({ ...emptyChecks });
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({ ...emptyColumnFilters });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("25");

  const rows = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (
        generalSearch &&
        !`${p.manufacturer} ${p.model} ${p.description}`
          .toLowerCase()
          .includes(generalSearch.toLowerCase())
      )
        return false;
      if (selects.labCode && p.lc !== selects.labCode) return false;
      if (multiSelects.techCategory.length > 0 && !multiSelects.techCategory.includes(p.groupType)) return false;
      if (multiSelects.rentalCategory.length > 0 && !multiSelects.rentalCategory.includes(p.rental)) return false;
      return COLUMNS.every((c) => {
        const v = columnFilters[c.key];
        if (!v) return true;
        return String(p[c.key as keyof Product] ?? "")
          .toLowerCase()
          .includes(v.toLowerCase());
      });
    });
  }, [generalSearch, selects, multiSelects, columnFilters]);

  const size = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, totalPages);
  const pageRows = rows.slice((current - 1) * size, current * size);

  const activeCount =
    (generalSearch ? 1 : 0) +
    Object.values(selects).filter(Boolean).length +
    Object.values(multiSelects).reduce((acc, v) => acc + v.length, 0) +
    Object.values(checks).filter(Boolean).length +
    Object.values(columnFilters).filter(Boolean).length;

  const handleClear = () => {
    setGeneralSearch("");
    setSelects({ ...emptySelects });
    setMultiSelects({ ...emptyMultiSelects });
    setChecks({ ...emptyChecks });
    setColumnFilters({ ...emptyColumnFilters });
    setPage(1);
  };

  return (
    <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Manage Products</h1>
              <p className="text-xs text-muted-foreground">
                Search, review and maintain the product catalog.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="link" size="sm" className="h-8 text-xs text-slate-900 px-1">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Competitive Price Guide
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
              <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add New
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-3 space-y-2.5">
              {/* General Search */}
              <div className="space-y-0.5">
                <Label className="text-[10px] font-medium text-muted-foreground">General Search</Label>
                <div className="relative max-w-xl">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={generalSearch}
                    onChange={(e) => setGeneralSearch(e.target.value)}
                    placeholder="Manufacturer, model or description"
                    className="h-7 text-[11px] pl-8"
                  />
                </div>
              </div>

              {/* Category selects */}
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
                {SELECT_FILTERS.map((f) => (
                  <div key={f.key} className="space-y-0.5 min-w-[130px] flex-1">
                    <Label className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                      {f.label}
                    </Label>
                    {"multi" in f && f.multi ? (
                      <MultiSelect
                        options={[...f.options]}
                        values={multiSelects[f.key as keyof typeof multiSelects]}
                        onChange={(v) => setMultiSelects((p) => ({ ...p, [f.key]: v }))}
                        max={3}
                        placeholder="All"
                      />
                    ) : (
                      <Select
                        value={selects[f.key] || undefined}
                        onValueChange={(v) => setSelects((p) => ({ ...p, [f.key]: v }))}
                      >
                        <SelectTrigger className="h-7 text-[11px] px-2">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          {f.options.map((o) => (
                            <SelectItem key={o} value={o} className="text-[11px]">
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>

              {/* Check filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {CHECK_FILTERS.map((f) => (
                  <label
                    key={f.key}
                    className="flex items-center gap-1.5 rounded-md border bg-muted/30 px-2 py-1 cursor-pointer hover:bg-muted/60 transition-colors"
                  >
                    <Checkbox
                      checked={checks[f.key]}
                      onCheckedChange={(v) =>
                        setChecks((p) => ({ ...p, [f.key]: Boolean(v) }))
                      }
                      className="h-3 w-3"
                    />
                    <span className="text-[10px] leading-tight">{f.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                <div className="text-[11px] text-muted-foreground">
                  {activeCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Badge variant="secondary" className="h-5 text-[10px]">
                        {activeCount} filter{activeCount > 1 ? "s" : ""} applied
                      </Badge>
                      {rows.length} product{rows.length === 1 ? "" : "s"} found
                    </span>
                  ) : (
                    <>Showing all {rows.length} products</>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
                    Product Reviews
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleClear}>
                    <X className="h-3.5 w-3.5 mr-1.5" />
                    Clear
                  </Button>
                  <Button size="sm" className="h-8 text-xs">
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Search
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
                      {COLUMNS.map((c) => (
                        <TableHead
                          key={c.key}
                          className={`text-[11px] font-semibold align-top ${c.width}`}
                        >
                          <div className="space-y-1 py-1">
                            <div className="whitespace-nowrap">{c.label}</div>
                            {c.type === "select" ? (
                              <Select
                                value={columnFilters[c.key] || undefined}
                                onValueChange={(v) =>
                                  setColumnFilters((p) => ({ ...p, [c.key]: v }))
                                }
                              >
                                <SelectTrigger className="h-6 text-[11px] px-2 font-normal bg-background">
                                  <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover z-50">
                                  <SelectItem value="all" className="text-xs">
                                    All
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={columnFilters[c.key]}
                                onChange={(e) =>
                                  setColumnFilters((p) => ({ ...p, [c.key]: e.target.value }))
                                }
                                placeholder="Filter"
                                className="h-6 text-[11px] px-2 font-normal bg-background"
                              />
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={COLUMNS.length} className="py-14 text-center">
                          <Inbox className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                          <p className="text-xs text-muted-foreground">No data to display</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageRows.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/40">
                          {COLUMNS.map((c) => (
                            <TableCell key={c.key} className="py-2 text-xs">
                              {String(p[c.key as keyof Product] ?? "")}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
                <div className="text-[11px] text-muted-foreground">
                  Page {current} of {totalPages} ({rows.length} products)
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
  );
};

export default ManageProductsV1;
