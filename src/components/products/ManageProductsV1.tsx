import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Check,
  Bookmark,
  ChevronDown,
  Star,
  Trash2,
  Pencil,
  Clock,
  RotateCcw,
  Filter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { Product, PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

interface SearchChip {
  id: string;
  type: string;
  value: string;
  label: string;
}

interface RecentSearch {
  id: string;
  chips: SearchChip[];
  timestamp: number;
  label: string;
}

interface SavedFilter {
  id: string;
  name: string;
  state: any;
  timestamp: number;
}

const SEARCH_TYPE_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "model", label: "Model" },
  { value: "description", label: "Product Description" },
  { value: "alias", label: "Alias" },
  { value: "lc", label: "LC" },
  { value: "locations", label: "Capable Location(s)" },
  { value: "tf", label: "TF" },
  { value: "calCost", label: "Cal/Cert Cost" },
  { value: "groupType", label: "Group Type" },
  { value: "productType", label: "Product Type" },
  { value: "accredCal", label: "Accred Cal" },
  { value: "status", label: "Status" },
  { value: "prItem", label: "PR Item" },
  { value: "prStatus", label: "PR Status" },
  { value: "rental", label: "Rental" },
  { value: "option", label: "Option" },
  { value: "range", label: "Range" },
  { value: "accuracy", label: "Accuracy" },
] as const;

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
  { key: "id", label: "ID", width: "w-16" },
  { key: "manufacturer", label: "Manufacturer", width: "w-32" },
  { key: "model", label: "Model", width: "w-28" },
  { key: "description", label: "Product Description", width: "w-56" },
  { key: "alias", label: "Alias", width: "w-28" },
  { key: "lc", label: "LC", width: "w-20" },
  { key: "locations", label: "Capable Location(s)", width: "w-48" },
  { key: "tf", label: "TF", width: "w-16" },
  { key: "calCost", label: "Cal/Cert Cost", width: "w-24" },
  { key: "groupType", label: "Group Type", width: "w-28" },
  { key: "productType", label: "Product Type", width: "w-28" },
  { key: "accredCal", label: "Accred Cal", width: "w-24" },
  { key: "status", label: "Status", width: "w-28" },
  { key: "prItem", label: "PR Item", width: "w-24" },
  { key: "prStatus", label: "PR Status", width: "w-28" },
  { key: "rental", label: "Rental", width: "w-24" },
  { key: "option", label: "Option", width: "w-24" },
  { key: "range", label: "Range", width: "w-24" },
  { key: "accuracy", label: "Accuracy", width: "w-24" },
] as const;

const RECENT_SEARCHES_KEY = "products-modern-recent-searches";
const SAVED_FILTERS_KEY = "products-modern-saved-filters";
const DEFAULT_FILTER_KEY = "products-modern-default-filter-id";
const MAX_RECENT_SEARCHES = 8;

const emptySelects = Object.fromEntries(SELECT_FILTERS.map((f) => [f.key, ""])) as Record<string, string>;
const emptyMultiSelects = { techCategory: [] as string[], rentalCategory: [] as string[] };
const emptyChecks = Object.fromEntries(CHECK_FILTERS.map((f) => [f.key, false])) as Record<string, boolean>;

const loadRecentSearches = (): RecentSearch[] => {
  try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"); }
  catch { return []; }
};
const saveRecentSearches = (searches: RecentSearch[]) => {
  try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES))); }
  catch {}
};
const loadSavedFilters = (): SavedFilter[] => {
  try { return JSON.parse(localStorage.getItem(SAVED_FILTERS_KEY) || "[]"); }
  catch { return []; }
};
const persistSavedFilters = (filters: SavedFilter[]) => {
  try { localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(filters)); }
  catch {}
};
const loadDefaultFilterId = (): string | null => {
  try { return localStorage.getItem(DEFAULT_FILTER_KEY); } catch { return null; }
};
const persistDefaultFilterId = (id: string | null) => {
  try { if (id) localStorage.setItem(DEFAULT_FILTER_KEY, id); else localStorage.removeItem(DEFAULT_FILTER_KEY); }
  catch {}
};

const ManageProductsV1 = () => {
  const [selects, setSelects] = useState<Record<string, string>>({ ...emptySelects });
  const [multiSelects, setMultiSelects] = useState<{ techCategory: string[]; rentalCategory: string[] }>({
    ...emptyMultiSelects,
  });
  const [checks, setChecks] = useState<Record<string, boolean>>({ ...emptyChecks });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("25");

  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(loadSavedFilters);
  const [saveFilterOpen, setSaveFilterOpen] = useState(false);
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [editingFilterName, setEditingFilterName] = useState("");
  const [activeSavedFilterId, setActiveSavedFilterId] = useState<string | null>(null);
  const [defaultFilterId, setDefaultFilterId] = useState<string | null>(loadDefaultFilterId);
  const didApplyDefaultRef = useRef(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowRecentSearches(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (didApplyDefaultRef.current) return;
    if (!defaultFilterId) return;
    const sf = savedFilters.find((f) => f.id === defaultFilterId);
    if (!sf) return;
    didApplyDefaultRef.current = true;
    const s = sf.state || {};
    setSearchChips(s.searchChips ?? []);
    setSelects(s.selects ?? { ...emptySelects });
    setMultiSelects(s.multiSelects ?? { ...emptyMultiSelects });
    setChecks(s.checks ?? { ...emptyChecks });
    setActiveSavedFilterId(sf.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => {
    return PRODUCTS.filter((p) => {
      for (const chip of searchChips) {
        const cell = String(p[chip.type as keyof Product] ?? "");
        if (!cell.toLowerCase().includes(chip.value.toLowerCase())) return false;
      }
      if (selects.labCode && p.lc !== selects.labCode) return false;
      if (multiSelects.techCategory.length > 0 && !multiSelects.techCategory.includes(p.groupType)) return false;
      if (multiSelects.rentalCategory.length > 0 && !multiSelects.rentalCategory.includes(p.rental)) return false;
      return true;
    });
  }, [searchChips, selects, multiSelects]);

  const size = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, totalPages);
  const pageRows = rows.slice((current - 1) * size, current * size);

  const activeCount =
    searchChips.length +
    Object.values(selects).filter(Boolean).length +
    Object.values(multiSelects).reduce((acc, v) => acc + v.length, 0) +
    Object.values(checks).filter(Boolean).length;

  const hasActiveFilters =
    searchChips.length > 0 ||
    Object.values(selects).some(Boolean) ||
    Object.values(multiSelects).some((v) => v.length > 0) ||
    Object.values(checks).some(Boolean);

  const addSearchChip = (type: string, value: string) => {
    const v = value.trim();
    if (!v) return;
    const option = SEARCH_TYPE_OPTIONS.find((opt) => opt.value === type);
    if (!option) return;
    const newChip: SearchChip = {
      id: `${type}-${Date.now()}`,
      type,
      value: v,
      label: option.label,
    };
    const updated = [...searchChips.filter((c) => c.type !== type), newChip];
    setSearchChips(updated);
    setFieldValues((prev) => ({ ...prev, [type]: "" }));
    fireSearch(updated);
  };

  const removeSearchChip = (chipId: string) => {
    const updated = searchChips.filter((c) => c.id !== chipId);
    setSearchChips(updated);
    fireSearch(updated);
  };

  const fireSearch = (chips: SearchChip[]) => {
    if (chips.length > 0) {
      const entry: RecentSearch = {
        id: `recent-${Date.now()}`,
        chips: [...chips],
        timestamp: Date.now(),
        label: chips.map((c) => `${c.label}: ${c.value}`).join(", "),
      };
      const updated = [entry, ...recentSearches.filter((r) => r.label !== entry.label)].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      saveRecentSearches(updated);
    }
  };

  const handleFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSearchChip(type, fieldValues[type] || "");
    }
    if (e.key === "Escape") setShowRecentSearches(false);
  };

  const handleFieldBlur = (type: string) => {
    addSearchChip(type, fieldValues[type] || "");
  };

  const applyRecentSearch = (recent: RecentSearch) => {
    setSearchChips(recent.chips);
    setShowRecentSearches(false);
    fireSearch(recent.chips);
  };

  const removeRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((r) => r.id !== id);
    setRecentSearches(updated);
    saveRecentSearches(updated);
  };

  const handleInputFocus = () => {
    if (!Object.values(fieldValues).some(Boolean) && recentSearches.length > 0) setShowRecentSearches(true);
  };

  const handleClear = () => {
    setSearchChips([]);
    setFieldValues({});
    setSelects({ ...emptySelects });
    setMultiSelects({ ...emptyMultiSelects });
    setChecks({ ...emptyChecks });
    setActiveSavedFilterId(null);
    setPage(1);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const commitRename = () => {
    const name = editingFilterName.trim();
    if (!name) { setEditingFilterId(null); return; }
    const updated = savedFilters.map((f) => (f.id === editingFilterId ? { ...f, name } : f));
    setSavedFilters(updated);
    persistSavedFilters(updated);
    setEditingFilterId(null);
    setEditingFilterName("");
    toast({ title: "Filter renamed", description: name });
  };

  const resultCount = searchChips.length > 0 ? rows.length : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Manage Products</h1>
        </div>
        <div className="flex items-center gap-2">
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
          {/* Quick Search Criteria */}
          <div ref={searchContainerRef}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Search Criteria</span>
              <span className="text-[10px] text-muted-foreground/60">Add search criteria by selecting a field and value</span>
            </div>

            {searchChips.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {searchChips.map((chip) => (
                  <Badge
                    key={chip.id}
                    variant="default"
                    className="px-2 py-0.5 text-[10px] flex items-center gap-1 bg-slate-900 hover:bg-slate-800"
                  >
                    <span className="font-medium">{chip.label}:</span>
                    <span>{chip.value}</span>
                    <button
                      onClick={() => removeSearchChip(chip.id)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      aria-label="Remove filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
              {SEARCH_TYPE_OPTIONS.map((option) => {
                const fieldValue = fieldValues[option.value] || "";
                const activeChip = searchChips.find((c) => c.type === option.value);
                const isActive = !!activeChip;
                return (
                  <div key={option.value} className="relative">
                    <Input
                      value={fieldValue}
                      onChange={(e) => setFieldValues((prev) => ({ ...prev, [option.value]: e.target.value }))}
                      onKeyDown={(e) => handleFieldKeyDown(e, option.value)}
                      onBlur={() => handleFieldBlur(option.value)}
                      onFocus={handleInputFocus}
                      placeholder={isActive ? activeChip!.value : option.label}
                      title={isActive ? `${option.label}: ${activeChip!.value}` : option.label}
                      className={cn(
                        "h-6 text-[11px] px-1.5 placeholder:text-[10px] bg-white text-black",
                        isActive && "border-slate-700 placeholder:text-black placeholder:font-medium pr-5"
                      )}
                    />
                    {isActive && (
                      <Check className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-700 pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>

            {showRecentSearches && recentSearches.length > 0 && (
              <div className="mt-2 rounded-md border bg-popover shadow-xl p-2 z-50">
                <div className="flex items-center justify-between px-1 pb-1 border-b mb-1">
                  <span className="text-[11px] font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Recent Searches
                  </span>
                  <button
                    onClick={() => { setRecentSearches([]); saveRecentSearches([]); }}
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear
                  </button>
                </div>
                <div className="space-y-0.5">
                  {recentSearches.map((recent) => (
                    <div
                      key={recent.id}
                      onClick={() => applyRecentSearch(recent)}
                      className="flex items-center justify-between px-1.5 py-1 rounded-md hover:bg-muted cursor-pointer"
                    >
                      <span className="text-[11px] truncate pr-2">{recent.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatTimeAgo(recent.timestamp)}</span>
                        <button
                          onClick={(e) => removeRecentSearch(recent.id, e)}
                          className="p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground"
                          aria-label="Remove recent search"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  onCheckedChange={(v) => setChecks((p) => ({ ...p, [f.key]: Boolean(v) }))}
                  className="h-3.5 w-3.5 rounded-[3px] border data-[state=checked]:border-primary [&_svg]:h-2.5 [&_svg]:w-2.5 [&_svg]:stroke-[3]"
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
                  {resultCount !== null && (
                    <Badge variant="secondary" className="h-5 text-[10px] flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      {resultCount} {resultCount === 1 ? "product" : "products"} found
                    </Badge>
                  )}
                </span>
              ) : (
                <>Showing all {rows.length} products</>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Saved Filters toolbar */}
              <Popover open={savedFiltersOpen} onOpenChange={setSavedFiltersOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    title="Saved filters"
                    className="flex items-center h-7 gap-1.5 px-2.5 border border-input bg-background rounded-md text-xs font-medium text-foreground hover:bg-muted/60 active:bg-muted transition-colors"
                  >
                    <Bookmark className={cn("h-3.5 w-3.5", activeSavedFilterId ? "text-slate-900 fill-slate-900" : "text-muted-foreground")} />
                    {savedFilters.length > 0 && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{savedFilters.length}</Badge>
                    )}
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 bg-popover border shadow-xl rounded-lg z-[60]" align="end">
                  <div className="p-2.5 border-b">
                    <p className="text-xs font-semibold text-foreground">Saved Filters</p>
                    <p className="text-[11px] text-muted-foreground">Apply a saved filter. Star one to set as default.</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-1">
                    {savedFilters.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4 px-3">
                        No saved filters yet. Configure filters and click the + to save.
                      </p>
                    ) : (
                      savedFilters.map((sf) => {
                        const isEditing = editingFilterId === sf.id;
                        const isActive = sf.id === activeSavedFilterId;
                        return (
                          <div
                            key={sf.id}
                            className={cn(
                              "flex items-center gap-1 group rounded-md border",
                              isActive ? "border-slate-900 bg-slate-900/5 shadow-sm" : "border-transparent"
                            )}
                          >
                            {isEditing ? (
                              <div className="flex-1 px-2 py-1.5 flex items-center gap-1">
                                <Input
                                  autoFocus
                                  value={editingFilterName}
                                  onChange={(e) => setEditingFilterName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); commitRename(); }
                                    if (e.key === "Escape") { setEditingFilterId(null); setEditingFilterName(""); }
                                  }}
                                  className="h-7 text-xs"
                                />
                                <button onClick={commitRename} className="p-1 rounded text-green-600 hover:bg-green-50" aria-label="Save name">
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => { setEditingFilterId(null); setEditingFilterName(""); }}
                                  className="p-1 rounded text-muted-foreground hover:bg-muted"
                                  aria-label="Cancel rename"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                {isActive && <div className="w-1 self-stretch rounded-l-md bg-slate-900" aria-hidden />}
                                <button
                                  onClick={() => {
                                    const s = sf.state || {};
                                    setSearchChips(s.searchChips ?? []);
                                    setSelects(s.selects ?? { ...emptySelects });
                                    setMultiSelects(s.multiSelects ?? { ...emptyMultiSelects });
                                    setChecks(s.checks ?? { ...emptyChecks });
                                    setActiveSavedFilterId(sf.id);
                                    setSavedFiltersOpen(false);
                                    toast({ title: "Filter applied", description: sf.name });
                                  }}
                                  className={cn("flex-1 text-left px-2.5 py-2 rounded-md text-xs transition-colors", !isActive && "hover:bg-muted")}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className={cn("font-medium flex items-center gap-1.5", isActive ? "text-slate-900" : "text-foreground")}>
                                      {isActive && <Check className="h-3.5 w-3.5" />}
                                      {sf.name}
                                    </div>
                                    {sf.id === defaultFilterId && (
                                      <span className="inline-flex items-center gap-0.5 px-1 py-0 rounded-sm border border-slate-300 bg-white text-slate-700 text-[8px] font-semibold uppercase tracking-tight leading-none h-3.5">
                                        <Star className="h-2 w-2 fill-slate-700" />
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <div className={cn("text-[10px]", isActive ? "text-slate-600 font-medium" : "text-muted-foreground")}>
                                    {isActive ? "Currently applied to results" : new Date(sf.timestamp).toLocaleDateString()}
                                  </div>
                                </button>
                                <button
                                  onClick={() => {
                                    const next = defaultFilterId === sf.id ? null : sf.id;
                                    setDefaultFilterId(next);
                                    persistDefaultFilterId(next);
                                    toast({ title: next ? "Default filter set" : "Default cleared", description: next ? `${sf.name} will load on sign in` : undefined });
                                  }}
                                  className={cn(
                                    "p-1.5 rounded transition-all",
                                    defaultFilterId === sf.id ? "opacity-100 text-slate-900 hover:bg-slate-100" : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-muted hover:text-slate-900"
                                  )}
                                  aria-label={defaultFilterId === sf.id ? "Unset as default" : "Set as default"}
                                >
                                  <Star className={cn("h-3.5 w-3.5", defaultFilterId === sf.id && "fill-slate-900")} />
                                </button>
                                <button
                                  onClick={() => {
                                    const updated = savedFilters.filter((f) => f.id !== sf.id);
                                    setSavedFilters(updated);
                                    persistSavedFilters(updated);
                                    if (activeSavedFilterId === sf.id) setActiveSavedFilterId(null);
                                    if (defaultFilterId === sf.id) {
                                      setDefaultFilterId(null);
                                      persistDefaultFilterId(null);
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                  aria-label="Delete saved filter"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={saveFilterOpen} onOpenChange={(o) => { setSaveFilterOpen(o); if (!o) setFilterName(""); }}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    title="Save current filter"
                    className="flex items-center justify-center h-7 w-7 border border-input bg-background rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3 bg-popover border shadow-xl rounded-lg z-[60]" align="end">
                  <p className="text-xs font-semibold text-foreground mb-1">Save current filters</p>
                  <p className="text-[11px] text-muted-foreground mb-2.5">Give this filter set a name so you can reapply it later.</p>
                  <Input
                    autoFocus
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="e.g. Active Fluke products"
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && filterName.trim()) {
                        const entry: SavedFilter = {
                          id: `sf-${Date.now()}`,
                          name: filterName.trim(),
                          timestamp: Date.now(),
                          state: { searchChips, selects, multiSelects, checks },
                        };
                        const updated = [entry, ...savedFilters.filter((f) => f.name !== entry.name)];
                        setSavedFilters(updated);
                        persistSavedFilters(updated);
                        setActiveSavedFilterId(entry.id);
                        setFilterName("");
                        setSaveFilterOpen(false);
                        toast({ title: "Filter saved", description: entry.name });
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setSaveFilterOpen(false); setFilterName(""); }}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!filterName.trim()}
                      onClick={() => {
                        const entry: SavedFilter = {
                          id: `sf-${Date.now()}`,
                          name: filterName.trim(),
                          timestamp: Date.now(),
                          state: { searchChips, selects, multiSelects, checks },
                        };
                        const updated = [entry, ...savedFilters.filter((f) => f.name !== entry.name)];
                        setSavedFilters(updated);
                        persistSavedFilters(updated);
                        setActiveSavedFilterId(entry.id);
                        setFilterName("");
                        setSaveFilterOpen(false);
                        toast({ title: "Filter saved", description: entry.name });
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

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
                      <div className="whitespace-nowrap py-2">{c.label}</div>
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

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-20 bg-background border-t -mx-2 sm:-mx-4 lg:-mx-6 px-2 sm:px-4 lg:px-6 py-2.5 flex items-center justify-end gap-2 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
          Product Reviews
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          Competitive Price Guide
        </Button>
      </div>
    </div>
  );
};

export default ManageProductsV1;
