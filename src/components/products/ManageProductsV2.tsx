import { useMemo, useState } from "react";
import {
  Search,
  X,
  Plus,
  Download,
  PackageSearch,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  ClipboardCheck,
  Copy,
  Trash2,
  Check,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  status: "Active" | "Inactive" | "Pending Review" | "Template";
  prItem: string;
  prStatus: "Review Required" | "Reviewed" | "—";
  rental: boolean;
  option: string;
  range: string;
  accuracy: string;
};

const PRODUCTS: Product[] = [
  {
    id: "10241",
    manufacturer: "Fluke",
    model: "87V",
    description: "Industrial True-RMS Digital Multimeter",
    alias: "DMM-87V",
    lc: "BR",
    locations: "Baton Rouge, Houston",
    tf: "TF1",
    calCost: "$95.00",
    groupType: "Electrical",
    productType: "Calibration",
    accredCal: "Yes",
    status: "Active",
    prItem: "PR-1042",
    prStatus: "Reviewed",
    rental: true,
    option: "Standard",
    range: "0–1000 V",
    accuracy: "±0.05%",
  },
  {
    id: "10242",
    manufacturer: "Megger",
    model: "MIT525",
    description: "5 kV Insulation Resistance Tester",
    alias: "IRT-525",
    lc: "HOU",
    locations: "Houston",
    tf: "TF2",
    calCost: "$180.00",
    groupType: "Electrical",
    productType: "Calibration",
    accredCal: "Yes",
    status: "Pending Review",
    prItem: "PR-1101",
    prStatus: "Review Required",
    rental: true,
    option: "Premium",
    range: "0–5 kV",
    accuracy: "±3%",
  },
  {
    id: "10243",
    manufacturer: "Salisbury",
    model: "SK-11",
    description: "Class 2 Rubber Insulating Gloves",
    alias: "GLV-CL2",
    lc: "GON",
    locations: "Gonzales",
    tf: "TF3",
    calCost: "$18.50",
    groupType: "ESL",
    productType: "Testing",
    accredCal: "No",
    status: "Active",
    prItem: "—",
    prStatus: "—",
    rental: false,
    option: "—",
    range: "17 kV",
    accuracy: "N/A",
  },
  {
    id: "10244",
    manufacturer: "Hastings",
    model: "10-050",
    description: "Telescoping Hot Stick 30 ft",
    alias: "HS-30",
    lc: "MOB",
    locations: "Mobile, Houston",
    tf: "TF2",
    calCost: "$42.00",
    groupType: "ESL",
    productType: "Testing",
    accredCal: "No",
    status: "Inactive",
    prItem: "—",
    prStatus: "—",
    rental: true,
    option: "Long Term",
    range: "30 ft",
    accuracy: "N/A",
  },
  {
    id: "10245",
    manufacturer: "Ametek",
    model: "RTC-157",
    description: "Reference Temperature Calibrator",
    alias: "TEMP-157",
    lc: "BR",
    locations: "Baton Rouge",
    tf: "TF1",
    calCost: "$260.00",
    groupType: "Temperature",
    productType: "Calibration",
    accredCal: "Yes",
    status: "Template",
    prItem: "PR-1155",
    prStatus: "Review Required",
    rental: false,
    option: "Standard",
    range: "-30 to 155 °C",
    accuracy: "±0.03 °C",
  },
];

const SELECT_FILTERS = [
  { key: "labCode", label: "Lab Code", options: ["BR", "HOU", "GON", "MOB"] },
  {
    key: "techCategory",
    label: "Technical/Labs Category",
    options: ["Electrical", "Mechanical", "Temperature", "Pressure"],
  },
  { key: "techCategory2", label: "2nd Category", options: ["Meters", "Calibrators", "Sensors"] },
  { key: "techCategory3", label: "3rd Category", options: ["Digital", "Analog"] },
  { key: "rentalCategory", label: "Rental/Sales Category", options: ["Rental", "Sales", "Both"] },
  { key: "rentalCategory2", label: "2nd Category", options: ["Standard", "Premium"] },
  { key: "rentalCategory3", label: "3rd Category", options: ["Short Term", "Long Term"] },
] as const;

const CHECK_FILTERS = [
  { key: "includeProductReview", label: "Include Product Review" },
  { key: "onlyProductReview", label: "Only Include Product Review" },
  { key: "includeRental", label: "Include Rental" },
  { key: "ascProduct", label: "ASC Product" },
  { key: "showCategories", label: "Show Categories" },
  { key: "showTemplate", label: "Show Template" },
] as const;

const COLUMNS: { key: keyof Product; label: string; always?: boolean }[] = [
  { key: "id", label: "ID", always: true },
  { key: "manufacturer", label: "Manufacturer", always: true },
  { key: "model", label: "Model", always: true },
  { key: "description", label: "Product Description", always: true },
  { key: "alias", label: "Alias" },
  { key: "lc", label: "LC" },
  { key: "locations", label: "Capable Location(s)" },
  { key: "tf", label: "TF" },
  { key: "calCost", label: "Cal/Cert Cost" },
  { key: "groupType", label: "Group Type" },
  { key: "productType", label: "Product Type", always: true },
  { key: "accredCal", label: "Accred Cal" },
  { key: "status", label: "Status", always: true },
  { key: "prItem", label: "PR Item" },
  { key: "prStatus", label: "PR Status" },
  { key: "rental", label: "Rental", always: true },
  { key: "option", label: "Option" },
  { key: "range", label: "Range" },
  { key: "accuracy", label: "Accuracy" },
];

const DEFAULT_VISIBLE = COLUMNS.filter((c) => c.always).map((c) => c.key);

const SORTS = [
  { value: "id", label: "Product ID" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "model", label: "Model" },
  { value: "status", label: "Status" },
] as const;

const emptySelects = Object.fromEntries(SELECT_FILTERS.map((f) => [f.key, ""])) as Record<string, string>;
const emptyChecks = Object.fromEntries(CHECK_FILTERS.map((f) => [f.key, false])) as Record<string, boolean>;

const statusClass = (status: Product["status"]) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Inactive":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "Pending Review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-sky-50 text-sky-700 border-sky-200";
  }
};

const dotClass = (status: Product["status"]) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500";
    case "Inactive":
      return "bg-slate-400";
    case "Pending Review":
      return "bg-amber-500";
    default:
      return "bg-sky-500";
  }
};

const ManageProductsV2 = () => {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [generalSearch, setGeneralSearch] = useState("");
  const [selects, setSelects] = useState<Record<string, string>>({ ...emptySelects });
  const [checks, setChecks] = useState<Record<string, boolean>>({ ...emptyChecks });
  const [resultSearch, setResultSearch] = useState("");
  const [visible, setVisible] = useState<(keyof Product)[]>(DEFAULT_VISIBLE);
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("25");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  const activeCount =
    (generalSearch ? 1 : 0) +
    Object.values(selects).filter(Boolean).length +
    Object.values(checks).filter(Boolean).length;

  const rows = useMemo(() => {
    const term = generalSearch.trim().toLowerCase();
    const inner = resultSearch.trim().toLowerCase();
    const list = products.filter((p) => {
      const haystack = `${p.id} ${p.manufacturer} ${p.model} ${p.description} ${p.alias}`.toLowerCase();
      if (term && !haystack.includes(term)) return false;
      if (inner && !haystack.includes(inner)) return false;
      if (selects.labCode && p.lc !== selects.labCode) return false;
      if (selects.techCategory && p.groupType !== selects.techCategory) return false;
      if (checks.onlyProductReview && p.prStatus === "—") return false;
      if (checks.includeRental && !p.rental) return false;
      if (!checks.showTemplate && p.status === "Template") return false;
      return true;
    });
    return [...list].sort((a, b) => {
      const av = String(a[sortKey as keyof Product] ?? "");
      const bv = String(b[sortKey as keyof Product] ?? "");
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [products, generalSearch, resultSearch, selects, checks, sortKey, sortAsc]);

  const size = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * size;
  const pageRows = rows.slice(start, start + size);
  const shownColumns = COLUMNS.filter((c) => visible.includes(c.key));

  const handleClear = () => {
    setGeneralSearch("");
    setSelects({ ...emptySelects });
    setChecks({ ...emptyChecks });
    setResultSearch("");
    setPage(1);
  };

  const renderCell = (p: Product, key: keyof Product) => {
    if (key === "id")
      return (
        <button
          type="button"
          className="font-medium text-slate-900 hover:underline underline-offset-2"
          onClick={() => toast({ title: `Edit Product ${p.id}` })}
        >
          {p.id}
        </button>
      );
    if (key === "status")
      return (
        <Badge variant="outline" className={cn("h-5 gap-1.5 rounded-full text-[10px] font-medium", statusClass(p.status))}>
          <span className={cn("h-1.5 w-1.5 rounded-full", dotClass(p.status))} />
          {p.status}
        </Badge>
      );
    if (key === "rental")
      return p.rental ? (
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
          <Check className="h-3 w-3" /> Yes
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Minus className="h-3 w-3" /> No
        </span>
      );
    if (key === "prStatus") {
      if (p.prStatus === "—") return <span className="text-[11px] text-muted-foreground">—</span>;
      return (
        <Badge
          variant="outline"
          className={cn(
            "h-5 rounded-full text-[10px] font-medium",
            p.prStatus === "Reviewed"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200",
          )}
        >
          {p.prStatus}
        </Badge>
      );
    }
    return <span className="text-xs">{String(p[key] ?? "")}</span>;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Manage Products</h1>
            <button
              type="button"
              className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-slate-900 hover:underline underline-offset-2"
              onClick={() => toast({ title: "Competitive Price Guide" })}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Competitive Price Guide
            </button>
          </div>
          <Button size="sm" className="h-8 text-xs" onClick={() => toast({ title: "Add Product" })}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between px-3 py-2.5 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  Search &amp; Filters
                  {activeCount > 0 && (
                    <Badge variant="secondary" className="h-5 text-[10px]">
                      {activeCount} filter{activeCount > 1 ? "s" : ""} applied
                    </Badge>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    filtersOpen && "rotate-180",
                  )}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Separator />
              <CardContent className="p-3 space-y-4">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">General Search</Label>
                  <div className="relative max-w-xl">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={generalSearch}
                      onChange={(e) => setGeneralSearch(e.target.value)}
                      placeholder="Search products..."
                      className="h-8 text-xs pl-8"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Product Filters
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {SELECT_FILTERS.map((f) => (
                      <div key={f.key} className="space-y-1">
                        <Label className="text-[11px] font-medium text-muted-foreground">{f.label}</Label>
                        <Select
                          value={selects[f.key] || undefined}
                          onValueChange={(v) => setSelects((p) => ({ ...p, [f.key]: v }))}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            {f.options.map((o) => (
                              <SelectItem key={o} value={o} className="text-xs">
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Additional Filters
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {CHECK_FILTERS.map((f) => (
                      <label
                        key={f.key}
                        className={cn(
                          "flex items-center gap-2 rounded-md border px-2 py-1.5 cursor-pointer transition-colors",
                          checks[f.key] ? "bg-slate-900 border-slate-900 text-white" : "bg-muted/30 hover:bg-muted/60",
                        )}
                      >
                        <Checkbox
                          checked={checks[f.key]}
                          onCheckedChange={(v) => setChecks((p) => ({ ...p, [f.key]: Boolean(v) }))}
                          className="h-3.5 w-3.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-[11px] leading-tight">{f.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2">
                  <span className="text-[11px] text-muted-foreground">
                    {activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? "s" : ""} applied` : "No filters applied"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleClear}>
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Clear
                    </Button>
                    <Button size="sm" className="h-8 text-xs" onClick={() => setPage(1)}>
                      <Search className="h-3.5 w-3.5 mr-1.5" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Results */}
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
              <div className="flex items-baseline gap-2">
                <h2 className="text-sm font-semibold">Products</h2>
                <span className="text-[11px] text-muted-foreground">
                  {rows.length} product{rows.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={resultSearch}
                    onChange={(e) => setResultSearch(e.target.value)}
                    placeholder="Search within results"
                    className="h-8 w-48 text-xs pl-8"
                  />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                      Columns
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 bg-popover z-50 p-2">
                    <div className="mb-1 flex items-center justify-between px-1">
                      <span className="text-[11px] font-semibold">Visible columns</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[11px]"
                        onClick={() => setVisible(DEFAULT_VISIBLE)}
                      >
                        Reset
                      </Button>
                    </div>
                    <div className="max-h-64 space-y-0.5 overflow-y-auto">
                      {COLUMNS.map((c) => (
                        <label
                          key={c.key}
                          className="flex items-center gap-2 rounded px-1.5 py-1 text-[11px] hover:bg-muted cursor-pointer"
                        >
                          <Checkbox
                            checked={visible.includes(c.key)}
                            onCheckedChange={(v) =>
                              setVisible((prev) =>
                                v ? [...prev, c.key] : prev.filter((k) => k !== c.key),
                              )
                            }
                            className="h-3.5 w-3.5"
                          />
                          {c.label}
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover z-50">
                    {SORTS.map((s) => (
                      <DropdownMenuItem
                        key={s.value}
                        className="text-xs"
                        onClick={() => setSortKey(s.value)}
                      >
                        {s.label}
                        {sortKey === s.value && <Check className="ml-auto h-3.5 w-3.5" />}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs" onClick={() => setSortAsc((v) => !v)}>
                      {sortAsc ? "Ascending" : "Descending"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="Export products">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Separator />

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    {shownColumns.map((c) => (
                      <TableHead key={c.key} className="text-[11px] font-semibold whitespace-nowrap">
                        {c.label}
                      </TableHead>
                    ))}
                    <TableHead className="text-[11px] font-semibold text-right w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={shownColumns.length + 1} className="py-16 text-center">
                        <PackageSearch className="mx-auto mb-3 h-9 w-9 text-muted-foreground/40" />
                        <p className="text-sm font-medium">No products found</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Try adjusting your filters or search criteria.
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <Button size="sm" className="h-8 text-xs" onClick={handleClear}>
                            Clear Filters
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => toast({ title: "Add Product" })}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Add Product
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((p) => (
                      <TableRow key={p.id} className="hover:bg-muted/40">
                        {shownColumns.map((c) => (
                          <TableCell key={c.key} className="py-2 text-xs">
                            {renderCell(p, c.key)}
                          </TableCell>
                        ))}
                        <TableCell className="py-2 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label={`Actions for ${p.id}`}>
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover z-50">
                              <DropdownMenuItem className="text-xs" onClick={() => toast({ title: `View ${p.id}` })}>
                                <Eye className="mr-2 h-3.5 w-3.5" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => toast({ title: `Edit ${p.id}` })}>
                                <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => toast({ title: "Product Review" })}>
                                <ClipboardCheck className="mr-2 h-3.5 w-3.5" /> Product Review
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => toast({ title: "Duplicated" })}>
                                <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-xs text-red-700 focus:text-red-700"
                                onClick={() => setDeleteTarget(p)}
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
              <div className="text-[11px] text-muted-foreground">
                {rows.length === 0
                  ? "Showing 0 products"
                  : `Showing ${start + 1}–${Math.min(start + size, rows.length)} of ${rows.length} products`}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Rows per page</span>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={current === 1}
                  onClick={() => setPage(current - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[11px] text-muted-foreground">
                  Page {current} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={current === totalPages}
                  onClick={() => setPage(current + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This product will be removed from the product catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-xs bg-red-700 hover:bg-red-800 text-white"
              onClick={() => {
                if (deleteTarget) {
                  setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
                  toast({ title: `Product ${deleteTarget.id} deleted` });
                }
                setDeleteTarget(null);
              }}
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default ManageProductsV2;
