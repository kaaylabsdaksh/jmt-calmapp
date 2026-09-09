import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Columns3,
  GripVertical,

} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
import { Product, PRODUCTS } from "@/lib/products";

const SELECT_FILTERS = [
  { key: "labCode", label: "Lab Code", options: ["BR", "HOU", "GON", "MOB"] },
  {
    key: "techCategory",
    label: "Technical/Labs Category",
    options: ["Electrical", "Mechanical", "Temperature", "Pressure"],
  },
  {
    key: "rentalCategory",
    label: "Rental/Sales Category",
    options: ["Rental", "Sales", "Both"],
  },
] as const;

const TECH_2ND_OPTIONS = ["Caliper - Slide Type", "Caliper - Digital", "Multimeter - Handheld", "Clamp Meter", "Pressure Gauge"];
const TECH_3RD_OPTIONS = ["Dial (Inside)", "Dial (Outside)", "Vernier", "Electronic", "100AMP", "600AMP"];
const RENTAL_2ND_OPTIONS = ["Case", "Kit", "Accessory", "Tool", "Tester"];
const RENTAL_3RD_OPTIONS = ["100AMP", "600AMP", "Standard", "Premium", "Basic"];

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
  { key: "lc", label: "LC", width: "w-20", type: "select", options: ["B", "C", "D", "E", "ES", "F", "M"] },
  { key: "locations", label: "Capable Location(s)", width: "w-48", type: "input" },
  { key: "tf", label: "TF", width: "w-16", type: "select", options: ["No", "Yes"] },
  { key: "calCost", label: "Cal/Cert Cost", width: "w-24", type: "input" },
  { key: "groupType", label: "Group Type", width: "w-28", type: "select", options: ["ESL", "ITL", "Dimensional"] },
  {
    key: "productType",
    label: "Product Type",
    width: "w-28",
    type: "select",
    options: [
      "Arc Flash",
      "Blankets",
      "Bucket Trucks",
      "CoverUps",
      "Footwear",
      "Gage Block Sets",
      "Gloves",
      "Hoses",
      "Jumpers",
      "Line Hose",
      "Sleeves",
      "Tools",
    ],
  },
  { key: "accredCal", label: "Accred Cal", width: "w-24", type: "select", options: ["No", "Yes"] },
  {
    key: "status",
    label: "Status",
    width: "w-28",
    type: "select",
    options: ["ACTIVE", "INACTIVE", "PENDING", "APPROVED, AWAITING PRICING"],
  },
  { key: "prItem", label: "PR Item", width: "w-24", type: "input" },
  {
    key: "prStatus",
    label: "PR Status",
    width: "w-28",
    type: "select",
    options: [
      "Awaiting Review",
      "Review Initiated",
      "Initiator",
      "Metrology",
      "Lab Management",
      "Lead Tech",
      "Sales",
      "Completed",
    ],
  },
  { key: "rental", label: "Rental", width: "w-24", type: "select", options: ["No", "Yes"] },

  { key: "option", label: "Option", width: "w-24", type: "input" },
  { key: "range", label: "Range", width: "w-24", type: "input" },
  { key: "accuracy", label: "Accuracy", width: "w-24", type: "input" },
] as const;

const emptySelects = Object.fromEntries(SELECT_FILTERS.map((f) => [f.key, ""])) as Record<string, string>;
const emptyCategorySelects = {
  tech2nd: "",
  tech3rd: "",
  rental2nd: "",
  rental3rd: "",
};
const emptyChecks = Object.fromEntries(CHECK_FILTERS.map((f) => [f.key, false])) as Record<string, boolean>;
const emptyColumnFilters = Object.fromEntries(COLUMNS.map((c) => [c.key, ""])) as Record<string, string>;
const HIDDEN_COLS_KEY = "manage-products-hidden-columns";
const COL_ORDER_KEY = "manage-products-column-order";
const DEFAULT_ORDER = COLUMNS.map((c) => c.key as string);

const ManageProductsV1 = () => {
  const navigate = useNavigate();
  const [generalSearch, setGeneralSearch] = useState("");
  const [selects, setSelects] = useState<Record<string, string>>({ ...emptySelects });
  const [categorySelects, setCategorySelects] = useState<{ tech2nd: string; tech3rd: string; rental2nd: string; rental3rd: string }>(
    ...emptyCategorySelects,
  });
  const [checks, setChecks] = useState<Record<string, boolean>>({ ...emptyChecks });
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({ ...emptyColumnFilters });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("25");
  const [hiddenCols, setHiddenCols] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HIDDEN_COLS_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [colOrder, setColOrder] = useState<string[]>(() => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem(COL_ORDER_KEY) || "null") || DEFAULT_ORDER;
      const valid = saved.filter((k) => DEFAULT_ORDER.includes(k));
      return [...valid, ...DEFAULT_ORDER.filter((k) => !valid.includes(k))];
    } catch {
      return DEFAULT_ORDER;
    }
  });
  const [dragKey, setDragKey] = useState<string | null>(null);

  const orderedColumns = useMemo(
    () => colOrder.map((k) => COLUMNS.find((c) => c.key === k)!).filter(Boolean),
    [colOrder]
  );

  const visibleColumns = useMemo(
    () => orderedColumns.filter((c) => c.key === "id" || !hiddenCols.includes(c.key)),
    [orderedColumns, hiddenCols]
  );

  const updateHidden = (next: string[]) => {
    setHiddenCols(next);
    try {
      localStorage.setItem(HIDDEN_COLS_KEY, JSON.stringify(next));
    } catch {}
  };

  const updateOrder = (next: string[]) => {
    setColOrder(next);
    try {
      localStorage.setItem(COL_ORDER_KEY, JSON.stringify(next));
    } catch {}
  };

  const moveColumn = (from: string, to: string) => {
    if (from === to) return;
    const next = colOrder.filter((k) => k !== from);
    const idx = next.indexOf(to);
    next.splice(idx < 0 ? next.length : idx, 0, from);
    updateOrder(next);
  };

  const toggleCol = (key: string) =>
    updateHidden(hiddenCols.includes(key) ? hiddenCols.filter((k) => k !== key) : [...hiddenCols, key]);


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
      if (selects.techCategory && p.groupType !== selects.techCategory) return false;
      if (selects.rentalCategory && p.rental !== selects.rentalCategory) return false;
      return COLUMNS.every((c) => {
        const v = columnFilters[c.key];
        if (!v || v === "all") return true;
        const cell = String(p[c.key as keyof Product] ?? "");
        if (c.type === "select") return cell.toLowerCase() === v.toLowerCase();
        return cell.toLowerCase().includes(v.toLowerCase());
      });
    });
  }, [generalSearch, selects, columnFilters]);

  const size = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, totalPages);
  const pageRows = rows.slice((current - 1) * size, current * size);

  const activeCount =
    (generalSearch ? 1 : 0) +
    Object.values(selects).filter(Boolean).length +
    Object.values(categorySelects).filter(Boolean).length +
    Object.values(checks).filter(Boolean).length +
    Object.values(columnFilters).filter(Boolean).length;

  const handleClear = () => {
    setGeneralSearch("");
    setSelects({ ...emptySelects });
    setCategorySelects({ ...emptyCategorySelects });
    setChecks({ ...emptyChecks });
    setColumnFilters({ ...emptyColumnFilters });
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Manage Products</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate("/manage-products/new")}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add New
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-5 space-y-5">
              {/* Card header */}
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Filter &amp; Search Products</h2>
                <span className="text-[10px] text-muted-foreground font-medium">ADVANCED FILTERS</span>
              </div>

              {/* Top row: General Search + Lab Code */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 space-y-1.5">
                  <Label className="text-[11px] font-semibold text-muted-foreground uppercase">General Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={generalSearch}
                      onChange={(e) => setGeneralSearch(e.target.value)}
                      placeholder="Manufacturer, model or description"
                      className="h-8 text-[11px] pl-8"
                    />
                  </div>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Lab Code</Label>
                  <Select
                    value={selects.labCode || undefined}
                    onValueChange={(v) => setSelects((p) => ({ ...p, labCode: v }))}
                  >
                    <SelectTrigger className="h-8 text-[11px] px-2">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {SELECT_FILTERS.find((f) => f.key === "labCode")?.options.map((o) => (
                        <SelectItem key={o} value={o} className="text-[11px]">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category lanes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 p-4 bg-white rounded-lg border">
                {/* Technical/Labs */}
                <div className="space-y-2 pr-0 lg:pr-6 lg:border-r border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-1 w-4 bg-blue-500 rounded-full" />
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">Technical / Labs</span>
                  </div>
                  <div className="space-y-2">
                    <Select
                      value={selects.techCategory || undefined}
                      onValueChange={(v) => setSelects((p) => ({ ...p, techCategory: v }))}
                    >
                      <SelectTrigger className="h-7 text-[11px] px-2">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {SELECT_FILTERS.find((f) => f.key === "techCategory")!.options.map((o) => (
                          <SelectItem key={o} value={o} className="text-[11px]">
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={categorySelects.tech2nd || undefined}
                      onValueChange={(v) => setCategorySelects((p) => ({ ...p, tech2nd: v }))}
                    >
                      <SelectTrigger className="h-7 text-[11px] px-2">
                        <SelectValue placeholder="2nd Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {TECH_2ND_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o} className="text-[11px]">
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={categorySelects.tech3rd || undefined}
                      onValueChange={(v) => setCategorySelects((p) => ({ ...p, tech3rd: v }))}
                    >
                      <SelectTrigger className="h-7 text-[11px] px-2">
                        <SelectValue placeholder="3rd Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {TECH_3RD_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o} className="text-[11px]">
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rental/Sales */}
                <div className="space-y-2 pl-0 lg:pl-6 pt-4 lg:pt-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-1 w-4 bg-emerald-500 rounded-full" />
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">Rental / Sales</span>
                  </div>
                  <div className="space-y-2">
                    <Select
                      value={selects.rentalCategory || undefined}
                      onValueChange={(v) => setSelects((p) => ({ ...p, rentalCategory: v }))}
                    >
                      <SelectTrigger className="h-7 text-[11px] px-2">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {SELECT_FILTERS.find((f) => f.key === "rentalCategory")!.options.map((o) => (
                          <SelectItem key={o} value={o} className="text-[11px]">
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={categorySelects.rental2nd || undefined}
                      onValueChange={(v) => setCategorySelects((p) => ({ ...p, rental2nd: v }))}
                    >
                      <SelectTrigger className="h-7 text-[11px] px-2">
                        <SelectValue placeholder="2nd Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {RENTAL_2ND_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o} className="text-[11px]">
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={categorySelects.rental3rd || undefined}
                      onValueChange={(v) => setCategorySelects((p) => ({ ...p, rental3rd: v }))}
                    >
                      <SelectTrigger className="h-7 text-[11px] px-2">
                        <SelectValue placeholder="3rd Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {RENTAL_3RD_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o} className="text-[11px]">
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Checkbox + actions row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {CHECK_FILTERS.map((f) => (
                    <label
                      key={f.key}
                      className="inline-flex items-center gap-1.5 cursor-pointer group"
                    >
                      <Checkbox
                        checked={checks[f.key]}
                        onCheckedChange={(v) =>
                          setChecks((p) => ({ ...p, [f.key]: Boolean(v) }))
                        }
                        className="h-3.5 w-3.5 rounded-[3px] border data-[state=checked]:border-primary [&_svg]:h-2.5 [&_svg]:w-2.5 [&_svg]:stroke-[3]"
                      />
                      <span className="text-[11px] text-foreground group-hover:text-foreground/80 transition-colors">
                        {f.label}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2">
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
              <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        aria-label="Customize columns"
                        title="Customize columns"
                      >
                        <Columns3 className="h-3.5 w-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-64 p-0 bg-popover z-50">
                      <div className="flex items-center justify-between border-b px-3 py-2">
                        <span className="text-xs font-semibold">Customize columns</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[11px]"
                          onClick={() => {
                            updateHidden([]);
                            updateOrder(DEFAULT_ORDER);
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                      <div className="px-3 pt-2 text-[10px] text-muted-foreground">
                        Drag the handle to rearrange columns
                      </div>
                      <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
                        {orderedColumns.map((c) => {
                          const locked = c.key === "id";
                          return (
                            <div
                              key={c.key}
                              draggable
                              onDragStart={() => setDragKey(c.key)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => {
                                if (dragKey) moveColumn(dragKey, c.key);
                                setDragKey(null);
                              }}
                              onDragEnd={() => setDragKey(null)}
                              className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs ${
                                dragKey === c.key ? "bg-muted" : "hover:bg-muted/60"
                              }`}
                            >
                              <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
                              <Checkbox
                                checked={locked || !hiddenCols.includes(c.key)}
                                disabled={locked}
                                onCheckedChange={() => !locked && toggleCol(c.key)}
                                className="h-3.5 w-3.5"
                              />
                              <span className={locked ? "opacity-60" : ""}>{c.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      {visibleColumns.map((c) => (
                        <TableHead
                          key={c.key}
                          className={`text-[11px] font-semibold align-top px-2 ${c.width} min-w-[7rem]`}
                        >
                          <div className="space-y-1 py-1">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              {c.label}
                            </div>

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
                                <SelectContent className="bg-popover z-50 max-h-56">
                                  <SelectItem value="all" className="text-xs">
                                    All
                                  </SelectItem>
                                  {((c as { options?: readonly string[] }).options ?? []).map((o) => (
                                    <SelectItem key={o} value={o} className="text-xs">
                                      {o}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="relative">
                                <Input
                                  value={columnFilters[c.key]}
                                  onChange={(e) =>
                                    setColumnFilters((p) => ({ ...p, [c.key]: e.target.value }))
                                  }
                                  title={columnFilters[c.key] || undefined}
                                  placeholder="Filter"
                                  className={`h-7 w-full min-w-[6.5rem] text-[11px] pl-2 font-normal bg-background ${
                                    columnFilters[c.key] ? "pr-6" : "pr-2"
                                  }`}
                                />
                                {columnFilters[c.key] && (
                                  <button
                                    type="button"
                                    aria-label={`Clear ${c.label} filter`}
                                    onClick={() =>
                                      setColumnFilters((p) => ({ ...p, [c.key]: "" }))
                                    }
                                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={visibleColumns.length} className="py-14 text-center">
                          <Inbox className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                          <p className="text-xs text-muted-foreground">No data to display</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageRows.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/40">
                          {visibleColumns.map((c) => (
                            <TableCell key={c.key} className="py-2 px-2 text-xs">
                              {c.key === "id" ? (
                                <Link
                                  to={`/manage-products/${p.id}`}
                                  className="text-slate-900 hover:text-slate-700 hover:underline font-medium"
                                >
                                  {p.id}
                                </Link>
                              ) : (
                                String(p[c.key as keyof Product] ?? "")
                              )}
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

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-20 -mx-2 sm:-mx-4 lg:-mx-6 bg-background border-t border-border px-4 sm:px-6 lg:px-8 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => navigate("/manage-products/product-reviews")}
          >
            <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
            Product Reviews
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Competitive Price Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageProductsV1;
