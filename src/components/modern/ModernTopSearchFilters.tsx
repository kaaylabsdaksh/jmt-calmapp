import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Search, X, Filter, Plus, Check, Clock, RotateCcw, Bookmark, Trash2, ChevronDown, MoreHorizontal, Pencil, RefreshCw, Star, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchChip {
  id: string;
  type: string;
  value: string;
  label: string;
}

const searchTypeOptions = [
  { value: 'workOrderNumber', label: 'WO #' },
  { value: 'accountNumber', label: 'Account Number' },
  { value: 'customerName', label: 'Customer Name' },
  { value: 'onsiteProjectNumber', label: 'Onsite Project Number' },
  { value: 'poNumber', label: 'PO Number' },
  { value: 'toFactoryPONumber', label: 'To Factory PO Number' },
  { value: 'custID', label: 'Cust ID' },
  { value: 'mfgSerial', label: 'MFG Serial' },
  { value: 'modelNumber', label: 'Model Number' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'productDescription', label: 'Product Description' },
  { value: 'rfid', label: 'RFID' },
  { value: 'quoteNumber', label: 'Quote Number' },
  { value: 'vendorRMANumber', label: 'Vendor RMA Number' },
];

const locationOptions = [
  { value: 'al', label: 'AL - Alabama' },
  { value: 'br', label: 'BR - Brazil' },
  { value: 'bi', label: 'BI - Biloxi' },
  { value: 'od', label: 'OD - Odessa' },
];

interface SearchFilters {
  globalSearch: string;
  searchTags: string[];
  status: string;
  assignee: string;
  priority: string[];
  manufacturer: string;
  division: string;
  woType: string;
  dateFrom?: Date;
  dateTo?: Date;
  dateType: string;
  actionCode: string;
  labCode: string;
  rotationManagement: string;
  invoiceStatus: string;
  departureType: string;
  salesperson: string;
  workOrderItemStatus: string;
  workOrderItemType: string;
  location: string;
  newEquip: boolean;
  usedSurplus: boolean;
  warranty: boolean;
  toFactory: boolean;
  proofOfDelivery: boolean;
  only17025: boolean;
  onlyHotList: boolean;
  onlyLostEquip: boolean;
  nonJMAccts: boolean;
  viewTemplate: boolean;
}

interface ModernTopSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onSearchViewModeChange?: (mode: 'default' | 'csa') => void;
}

interface RecentSearch {
  id: string;
  chips: SearchChip[];
  timestamp: number;
  label: string;
}

const RECENT_SEARCHES_KEY = 'wo-modern-recent-searches';
const MAX_RECENT_SEARCHES = 8;

function loadRecentSearches(): RecentSearch[] {
  try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]'); }
  catch { return []; }
}
function saveRecentSearches(searches: RecentSearch[]) {
  try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES))); }
  catch {}
}

interface SavedFilter {
  id: string;
  name: string;
  state: any;
  timestamp: number;
}
const SAVED_FILTERS_KEY = 'wo-modern-saved-filters';
function loadSavedFilters(): SavedFilter[] {
  try { return JSON.parse(localStorage.getItem(SAVED_FILTERS_KEY) || '[]'); }
  catch { return []; }
}
function persistSavedFilters(filters: SavedFilter[]) {
  try { localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(filters)); }
  catch {}
}
const DEFAULT_FILTER_KEY = 'wo-modern-default-filter-id';
function loadDefaultFilterId(): string | null {
  try { return localStorage.getItem(DEFAULT_FILTER_KEY); } catch { return null; }
}
function persistDefaultFilterId(id: string | null) {
  try {
    if (id) localStorage.setItem(DEFAULT_FILTER_KEY, id);
    else localStorage.removeItem(DEFAULT_FILTER_KEY);
  } catch {}
}

const ModernTopSearchFilters = ({ onSearch, onSearchViewModeChange }: ModernTopSearchFiltersProps) => {
  const [viewMode, setViewMode] = useState<'default' | 'csa'>('default');
  const [locationSearch, setLocationSearch] = useState('');

  const handleViewModeChange = (val: 'default' | 'csa') => {
    setViewMode(val);
    onSearchViewModeChange?.(val);
  };
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [arrivalToOpen, setArrivalToOpen] = useState(false);
  const [dateType, setDateType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);
  const [selectedSearchType, setSelectedSearchType] = useState('workOrderNumber');
  const [searchInput, setSearchInput] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(loadSavedFilters);
  const [saveFilterOpen, setSaveFilterOpen] = useState(false);
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);
  const [editingFilterName, setEditingFilterName] = useState('');
  const [activeSavedFilterId, setActiveSavedFilterId] = useState<string | null>(null);
  const [defaultFilterId, setDefaultFilterId] = useState<string | null>(loadDefaultFilterId);
  const didApplyDefaultRef = useRef(false);
  
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchValues, setSearchValues] = useState({
    woNumber: '',
    customer: '',
    status: '',
    manufacturer: '',
    priority: [] as string[],
    assignee: '',
    division: '',
    woType: '',
    actionCode: '',
    labCode: '',
    rotationManagement: '',
    estimateStatus: '',
    invoiceStatus: '',
    departureType: '',
    salesperson: '',
    workOrderItemStatus: '',
    workOrderItemType: '',
    location: '',
    newEquip: false,
    usedSurplus: false,
    warranty: false,
    toFactory: false,
    proofOfDelivery: false,
    only17025: false,
    onlyHotList: false,
    onlyLostEquip: false,
    nonJMAccts: false,
    viewTemplate: false
  });

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowRecentSearches(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-apply default saved filter on mount (persists across logout/login)
  useEffect(() => {
    if (didApplyDefaultRef.current) return;
    if (!defaultFilterId) return;
    const sf = savedFilters.find(f => f.id === defaultFilterId);
    if (!sf) return;
    didApplyDefaultRef.current = true;
    const s = sf.state || {};
    setSearchValues(s.searchValues ?? searchValues);
    setSelectedLocations(s.selectedLocations ?? []);
    setDateFrom(s.dateFrom ? new Date(s.dateFrom) : undefined);
    setDateTo(s.dateTo ? new Date(s.dateTo) : undefined);
    setDateType(s.dateType ?? '');
    setSearchChips(s.searchChips ?? []);
    setActiveSavedFilterId(sf.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Live result count
  useEffect(() => {
    if (searchChips.length === 0) { setResultCount(null); return; }
    const timer = setTimeout(() => {
      // Mock count based on number of chips
      setResultCount(Math.max(1, 10 - searchChips.length * 2));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchChips]);

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };


  const addSearchChip = (value?: string) => {
    const chipValue = value || searchInput.trim();
    if (!chipValue) return;

    const typeToUse = selectedSearchType;
    const selectedOption = searchTypeOptions.find(opt => opt.value === typeToUse);
    if (!selectedOption) return;

    const newChip: SearchChip = {
      id: `${typeToUse}-${Date.now()}`,
      type: typeToUse,
      value: chipValue,
      label: selectedOption.label,
    };

    setSearchChips(prev => [...prev, newChip]);
    setSearchInput('');
    
    const updatedChips = [...searchChips, newChip];
    const searchTags = updatedChips.map(chip => `${chip.label}: ${chip.value}`);
    onSearch({
      globalSearch: '',
      searchTags,
      status: searchValues.status, assignee: searchValues.assignee, priority: searchValues.priority,
      manufacturer: searchValues.manufacturer, division: searchValues.division, woType: searchValues.woType,
      dateFrom, dateTo, dateType,
      actionCode: searchValues.actionCode, labCode: searchValues.labCode,
      rotationManagement: searchValues.rotationManagement, invoiceStatus: searchValues.invoiceStatus,
      departureType: searchValues.departureType, salesperson: searchValues.salesperson,
      workOrderItemStatus: searchValues.workOrderItemStatus, workOrderItemType: searchValues.workOrderItemType,
      location: searchValues.location,
      newEquip: searchValues.newEquip, usedSurplus: searchValues.usedSurplus,
      warranty: searchValues.warranty, toFactory: searchValues.toFactory,
      proofOfDelivery: searchValues.proofOfDelivery, only17025: searchValues.only17025,
      onlyHotList: searchValues.onlyHotList, onlyLostEquip: searchValues.onlyLostEquip,
      nonJMAccts: searchValues.nonJMAccts, viewTemplate: searchValues.viewTemplate,
    });
  };

  const removeSearchChip = (chipId: string) => {
    const updatedChips = searchChips.filter(chip => chip.id !== chipId);
    setSearchChips(updatedChips);
    const searchTags = updatedChips.map(chip => `${chip.label}: ${chip.value}`);
    onSearch({
      globalSearch: '',
      searchTags,
      status: searchValues.status, assignee: searchValues.assignee, priority: searchValues.priority,
      manufacturer: searchValues.manufacturer, division: searchValues.division, woType: searchValues.woType,
      dateFrom, dateTo, dateType,
      actionCode: searchValues.actionCode, labCode: searchValues.labCode,
      rotationManagement: searchValues.rotationManagement, invoiceStatus: searchValues.invoiceStatus,
      departureType: searchValues.departureType, salesperson: searchValues.salesperson,
      workOrderItemStatus: searchValues.workOrderItemStatus, workOrderItemType: searchValues.workOrderItemType,
      location: searchValues.location,
      newEquip: searchValues.newEquip, usedSurplus: searchValues.usedSurplus,
      warranty: searchValues.warranty, toFactory: searchValues.toFactory,
      proofOfDelivery: searchValues.proofOfDelivery, only17025: searchValues.only17025,
      onlyHotList: searchValues.onlyHotList, onlyLostEquip: searchValues.onlyLostEquip,
      nonJMAccts: searchValues.nonJMAccts, viewTemplate: searchValues.viewTemplate,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addSearchChip(); }
    if (e.key === 'Escape') { setShowRecentSearches(false); }
  };

  const fireSearch = (chips: SearchChip[]) => {
    // Save recent search
    if (chips.length > 0) {
      const entry: RecentSearch = {
        id: `recent-${Date.now()}`, chips: [...chips], timestamp: Date.now(),
        label: chips.map(c => `${c.label}: ${c.value}`).join(', '),
      };
      const updated = [entry, ...recentSearches.filter(r => r.label !== entry.label)].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      saveRecentSearches(updated);
    }
    const searchTags = chips.map(chip => `${chip.label}: ${chip.value}`);
    onSearch({
      globalSearch: chips.map(chip => chip.value).join(' '), searchTags,
      status: searchValues.status, assignee: searchValues.assignee, priority: searchValues.priority,
      manufacturer: searchValues.manufacturer, division: searchValues.division, woType: searchValues.woType,
      dateFrom, dateTo, dateType,
      actionCode: searchValues.actionCode, labCode: searchValues.labCode,
      rotationManagement: searchValues.rotationManagement, invoiceStatus: searchValues.invoiceStatus,
      departureType: searchValues.departureType, salesperson: searchValues.salesperson,
      workOrderItemStatus: searchValues.workOrderItemStatus, workOrderItemType: searchValues.workOrderItemType,
      location: searchValues.location,
      newEquip: searchValues.newEquip, usedSurplus: searchValues.usedSurplus,
      warranty: searchValues.warranty, toFactory: searchValues.toFactory,
      proofOfDelivery: searchValues.proofOfDelivery, only17025: searchValues.only17025,
      onlyHotList: searchValues.onlyHotList, onlyLostEquip: searchValues.onlyLostEquip,
      nonJMAccts: searchValues.nonJMAccts, viewTemplate: searchValues.viewTemplate,
    });
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      const chipValue = searchInput.trim();
      const selectedOption = searchTypeOptions.find(opt => opt.value === selectedSearchType);
      if (!selectedOption) return;
      const newChip: SearchChip = {
        id: `${selectedSearchType}-${Date.now()}`,
        type: selectedSearchType,
        value: chipValue,
        label: selectedOption.label,
      };
      const updatedChips = [...searchChips, newChip];
      setSearchChips(updatedChips);
      setSearchInput('');
      fireSearch(updatedChips);
    } else {
      fireSearch(searchChips);
    }
  };

  const applyRecentSearch = (recent: RecentSearch) => {
    setSearchChips(recent.chips);
    setShowRecentSearches(false);
  };

  const removeRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => r.id !== id);
    setRecentSearches(updated);
    saveRecentSearches(updated);
  };

  const handleInputFocus = () => {
    if (!searchInput.trim() && recentSearches.length > 0) { setShowRecentSearches(true); }
  };

  const handleInputChange = (val: string) => {
    setSearchInput(val);
    if (!val.trim() && recentSearches.length > 0) setShowRecentSearches(true);
    else setShowRecentSearches(false);
  };

  const clearAllFilters = () => {
    setSearchChips([]);
    setSearchInput('');
    setResultCount(null);
    setSearchValues({
      woNumber: '', customer: '', status: '', manufacturer: '', priority: [], assignee: '',
      division: '', woType: '', actionCode: '', labCode: '', rotationManagement: '', estimateStatus: '',
      invoiceStatus: '', departureType: '', salesperson: '', workOrderItemStatus: '',
      workOrderItemType: '', location: '', newEquip: false, usedSurplus: false,
      warranty: false, toFactory: false, proofOfDelivery: false, only17025: false,
      onlyHotList: false, onlyLostEquip: false, nonJMAccts: false, viewTemplate: false,
    });
    setDateFrom(undefined);
    setDateTo(undefined);
    setDateType('');
    onSearch({
      globalSearch: '', searchTags: [], status: '', assignee: '', priority: [],
      manufacturer: '', division: '', woType: '', dateFrom: undefined, dateTo: undefined, dateType: '',
      actionCode: '', labCode: '', rotationManagement: '', invoiceStatus: '',
      departureType: '', salesperson: '', workOrderItemStatus: '', workOrderItemType: '',
      location: '', newEquip: false, usedSurplus: false, warranty: false, toFactory: false,
      proofOfDelivery: false, only17025: false, onlyHotList: false, onlyLostEquip: false,
      nonJMAccts: false, viewTemplate: false,
    });
  };

  const hasActiveFilters = searchChips.length > 0 || Object.values(searchValues).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value && value !== 'all';
  }) || dateFrom || dateTo || dateType;

  const selectTriggerClass = "bg-white border border-gray-200 rounded-md h-6 min-h-0 text-[11px] px-1.5 py-0 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all [&>svg]:h-3 [&>svg]:w-3";
  const activeSelectClass = "border-slate-700 bg-slate-100 text-slate-900 font-semibold";
  const triggerCls = (value: any) => {
    const isActive = Array.isArray(value) ? value.length > 0 : value && value !== 'all' && value !== '';
    return cn(selectTriggerClass, isActive && activeSelectClass);
  };
  const selectContentClass = "bg-white border border-gray-200 shadow-xl rounded-md z-[9999] text-[11px]";

  return (
    <div className="bg-card rounded-xl shadow-sm border mb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {viewMode !== 'csa' && (
            <h2 className="text-lg font-semibold text-foreground whitespace-nowrap">Work Order Search</h2>
          )}
          {/* Live Result Count */}
          {resultCount !== null && (
            <Badge variant="secondary" className="px-2.5 py-1 text-xs font-medium animate-in fade-in-50 slide-in-from-left-2">
              <Search className="h-3 w-3 mr-1 text-primary" />
              {resultCount} {resultCount === 1 ? 'result' : 'results'} found
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 min-w-0">

          {/* Saved Filters toolbar - moved to top */}
          {viewMode === 'default' && (
            <>

              <div className="inline-flex items-center shadow-sm">
                <Popover open={savedFiltersOpen} onOpenChange={setSavedFiltersOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      title="Saved filters"
                      className="flex items-center h-7 gap-1.5 px-2.5 border border-input bg-background rounded-l-md text-xs font-medium text-foreground hover:bg-muted/60 active:bg-muted transition-colors"
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${activeSavedFilterId ? 'text-slate-900 fill-slate-900' : 'text-muted-foreground'}`} />
                      
                      {savedFilters.length > 0 && (
                        <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">{savedFilters.length}</Badge>
                      )}
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 bg-popover border shadow-xl rounded-lg z-[60]" align="end">
                    <div className="p-2.5 border-b">
                      <p className="text-xs font-semibold text-foreground">Saved Filters</p>
                      <p className="text-[11px] text-muted-foreground">Apply a saved filter. Star one to set as default — it loads automatically next time you sign in.</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1">
                      {savedFilters.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4 px-3">
                          No saved filters yet. Configure filters and click the + to save.
                        </p>
                      ) : (
                        savedFilters.map((sf) => {
                          const isEditing = editingFilterId === sf.id;
                          const commitRename = () => {
                            const name = editingFilterName.trim();
                            if (!name) { setEditingFilterId(null); return; }
                            const updated = savedFilters.map(f => f.id === sf.id ? { ...f, name } : f);
                            setSavedFilters(updated);
                            persistSavedFilters(updated);
                            setEditingFilterId(null);
                            setEditingFilterName('');
                            toast({ title: 'Filter renamed', description: name });
                          };
                          const isActive = sf.id === activeSavedFilterId;
                          return (
                            <div key={sf.id} className={`flex items-center gap-1 group rounded-md border ${isActive ? 'border-slate-900 bg-slate-900/5 shadow-sm' : 'border-transparent'}`}>
                              {isEditing ? (
                                <div className="flex-1 px-2 py-1.5 flex items-center gap-1">
                                  <Input
                                    autoFocus
                                    value={editingFilterName}
                                    onChange={(e) => setEditingFilterName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') { e.preventDefault(); commitRename(); }
                                      if (e.key === 'Escape') { setEditingFilterId(null); setEditingFilterName(''); }
                                    }}
                                    className="h-7 text-xs"
                                  />
                                  <button
                                    onClick={commitRename}
                                    className="p-1 rounded text-green-600 hover:bg-green-50"
                                    aria-label="Save name"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => { setEditingFilterId(null); setEditingFilterName(''); }}
                                    className="p-1 rounded text-muted-foreground hover:bg-muted"
                                    aria-label="Cancel rename"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {isActive && (
                                    <div className="w-1 self-stretch rounded-l-md bg-slate-900" aria-hidden />
                                  )}
                                  <button
                                    onClick={() => {
                                      const s = sf.state || {};
                                      setSearchValues(s.searchValues ?? searchValues);
                                      setSelectedLocations(s.selectedLocations ?? []);
                                      setDateFrom(s.dateFrom ? new Date(s.dateFrom) : undefined);
                                      setDateTo(s.dateTo ? new Date(s.dateTo) : undefined);
                                      setDateType(s.dateType ?? '');
                                      setSearchChips(s.searchChips ?? []);
                                      setActiveSavedFilterId(sf.id);
                                      setSavedFiltersOpen(false);
                                      toast({ title: 'Filter applied', description: sf.name });
                                    }}
                                    className={`flex-1 text-left px-2.5 py-2 rounded-md text-xs transition-colors ${isActive ? '' : 'hover:bg-muted'}`}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <div className={`font-medium flex items-center gap-1.5 ${isActive ? 'text-slate-900' : 'text-foreground'}`}>
                                        {isActive && <Check className="h-3.5 w-3.5" />}
                                        {sf.name}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {sf.id === defaultFilterId && (
                                          <span className="inline-flex items-center gap-0.5 px-1 py-0 rounded-sm border border-slate-300 bg-white text-slate-700 text-[8px] font-semibold uppercase tracking-tight leading-none h-3.5">
                                            <Star className="h-2 w-2 fill-slate-700" />
                                            Default
                                          </span>
                                        )}
                                        {isActive && (
                                          <span className="inline-flex items-center gap-0.5 px-1 py-0 rounded-sm bg-slate-900 text-white text-[8px] font-semibold uppercase tracking-tight leading-none h-3.5">
                                            <span className="h-1 w-1 rounded-full bg-white" />
                                            Active
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className={`text-[10px] ${isActive ? 'text-slate-600 font-medium' : 'text-muted-foreground'}`}>
                                      {isActive ? 'Currently applied to results' : new Date(sf.timestamp).toLocaleDateString()}
                                    </div>
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const next = defaultFilterId === sf.id ? null : sf.id;
                                      setDefaultFilterId(next);
                                      persistDefaultFilterId(next);
                                      toast({
                                        title: next ? 'Default filter set' : 'Default cleared',
                                        description: next ? `${sf.name} will load on sign in` : undefined,
                                      });
                                    }}
                                    className={`p-1.5 rounded transition-all ${
                                      defaultFilterId === sf.id
                                        ? 'opacity-100 text-slate-900 hover:bg-slate-100'
                                        : 'opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-muted hover:text-slate-900'
                                    }`}
                                    aria-label={defaultFilterId === sf.id ? 'Unset as default' : 'Set as default'}
                                    title={defaultFilterId === sf.id ? 'Unset as default' : 'Set as default'}
                                  >
                                    <Star className={`h-3.5 w-3.5 ${defaultFilterId === sf.id ? 'fill-slate-900' : ''}`} />
                                  </button>

                                  <button
                                    onClick={() => {
                                      const updated = savedFilters.filter(f => f.id !== sf.id);
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

                <Popover open={saveFilterOpen} onOpenChange={(o) => { setSaveFilterOpen(o); if (!o) setFilterName(''); }}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      title="Save current filter"
                      className="flex items-center justify-center h-7 w-7 border border-l-0 border-input bg-background rounded-r-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
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
                      placeholder="e.g. Lab — In Lab, Paid"
                      className="h-8 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && filterName.trim()) {
                          const entry: SavedFilter = {
                            id: `sf-${Date.now()}`,
                            name: filterName.trim(),
                            timestamp: Date.now(),
                            state: { searchValues, selectedLocations, dateFrom, dateTo, dateType, searchChips },
                          };
                          const updated = [entry, ...savedFilters.filter(f => f.name !== entry.name)];
                          setSavedFilters(updated);
                          persistSavedFilters(updated);
                          setActiveSavedFilterId(entry.id);
                          setFilterName('');
                          setSaveFilterOpen(false);
                          toast({ title: 'Filter saved', description: entry.name });
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setSaveFilterOpen(false); setFilterName(''); }}>
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
                            state: { searchValues, selectedLocations, dateFrom, dateTo, dateType, searchChips },
                          };
                          const updated = [entry, ...savedFilters.filter(f => f.name !== entry.name)];
                          setSavedFilters(updated);
                          persistSavedFilters(updated);
                          setActiveSavedFilterId(entry.id);
                          setFilterName('');
                          setSaveFilterOpen(false);
                          toast({ title: 'Filter saved', description: entry.name });
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="h-6 w-px bg-border" />
            </>
          )}

          <Select value={viewMode} onValueChange={(val: 'default' | 'csa') => handleViewModeChange(val)}>
            <SelectTrigger className="w-[130px] h-7 text-xs px-2 gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg z-50 min-w-[120px]">
              <SelectItem value="default" className="text-xs py-1.5">Default View</SelectItem>
              <SelectItem value="csa" className="text-xs py-1.5">CSA View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mx-5 mb-4 border-b" />

      <div className="px-4 pb-4 space-y-2.5">
        {/* Search Criteria Section - Default view only */}
        {viewMode === 'default' && (
        <div ref={searchContainerRef}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Search Criteria</span>
            <span className="text-[10px] text-muted-foreground/60">Add search criteria by selecting a field and value</span>
          </div>

          {/* Active Search Chips */}
          {searchChips.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {searchChips.map((chip) => (
                <Badge
                  key={chip.id}
                  variant="default"
                  className="px-2 py-0.5 text-[10px] flex items-center gap-1"
                >
                  <span className="font-medium">{chip.label}:</span>
                  <span>{chip.value}</span>
                  <button
                    onClick={() => removeSearchChip(chip.id)}
                    className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                    aria-label="Remove filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Individual field inputs - one per criterion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {searchTypeOptions.map((option) => {
              const fieldValue = fieldValues[option.value] || '';
              const activeChip = searchChips.find(c => c.type === option.value);
              const isActive = !!activeChip;
              const commitField = () => {
                const v = fieldValue.trim();
                if (!v) return;
                const newChip: SearchChip = {
                  id: `${option.value}-${Date.now()}`,
                  type: option.value,
                  value: v,
                  label: option.label,
                };
                const updatedChips = [
                  ...searchChips.filter(c => c.type !== option.value),
                  newChip,
                ];
                setSearchChips(updatedChips);
                setFieldValues(prev => ({ ...prev, [option.value]: '' }));
                fireSearch(updatedChips);
              };
              return (
                <div key={option.value} className="relative">
                  <Input
                    value={fieldValue}
                    onChange={(e) => setFieldValues(prev => ({ ...prev, [option.value]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); commitField(); }
                    }}
                    onBlur={commitField}
                    placeholder={isActive ? activeChip!.value : option.label}
                    title={isActive ? `${option.label}: ${activeChip!.value}` : option.label}
                    className={`h-6 text-[11px] px-1.5 placeholder:text-[10px] bg-white text-black ${
                      isActive
                        ? 'border-slate-700 placeholder:text-black placeholder:font-medium pr-5'
                        : 'placeholder:text-black'
                    }`}
                  />
                  {isActive && (
                    <Check className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-700 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        )}

        {viewMode === 'default' ? (
          <>
            {/* Grouped Filter Sections — 4 semantic columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3 pt-1">

              {/* Group 1: Timeline */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Timeline & Location</h3>
                <DateRangePicker
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onDateFromChange={setDateFrom}
                  onDateToChange={setDateTo}
                  dateType={dateType}
                  onDateTypeChange={setDateType}
                  dateTypeOptions={[
                    { value: "created", label: "Created" },
                    { value: "arrival", label: "Arrival" },
                    { value: "need-by", label: "Need By" },
                    { value: "status-date", label: "Status Date" },
                    { value: "last-comment", label: "Last Comment" },
                    { value: "departure-date", label: "Departure Date" },
                    { value: "samsara-doc-submit", label: "Samsara Doc Submit" },
                  ]}
                />

                <Select value={searchValues.location || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, location: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.location)}>
                    <SelectValue placeholder="All Location" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Location</SelectItem>
                    <SelectItem value="al">AL - Alabama</SelectItem>
                    <SelectItem value="br">BR - Brazil</SelectItem>
                    <SelectItem value="bi">BI - Biloxi</SelectItem>
                    <SelectItem value="od">OD - Odessa</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.division || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, division: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.division)}>
                    <SelectValue placeholder="All Division" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Division</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="rental">Rental</SelectItem>
                    <SelectItem value="esl">ESL</SelectItem>
                    <SelectItem value="esl-onsite">ESL Onsite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Group 2: Status */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</h3>

                <Select value={searchValues.status || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.status)}>
                    <SelectValue placeholder="All WO Status" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All WO Status</SelectItem>
                    <SelectItem value="open-items">[Open Items]</SelectItem>
                    <SelectItem value="awaiting-cdr">[Awaiting CDR]</SelectItem>
                    <SelectItem value="assign-tech-repair-inlab">[Assign/Tech - Repair - InLab]</SelectItem>
                    <SelectItem value="assigned-tech-repair-dept">[Assigned To Tech - Repair Dept]</SelectItem>
                    <SelectItem value="qa-hold-disapproved">[Q/A Hold - Q/A Disapproved]</SelectItem>
                    <SelectItem value="qa-insp-hold-fail">[Q/A Insp - Q/A Hold - Q/A Fail]</SelectItem>
                    <SelectItem value="in-lab-assigned-tech">[In Lab - Assigned to Tech]</SelectItem>
                    <SelectItem value="in-lab-qa-disapprove">[In Lab - Q/A Disapprove]</SelectItem>
                    <SelectItem value="estimate-ar-invoicing">[Estimate - A/R Invoicing]</SelectItem>
                    <SelectItem value="to-factory-awaiting-parts">[To Factory - Awaiting Parts]</SelectItem>
                    <SelectItem value="ar-need-by-status">[AR Need By Status]</SelectItem>
                    <SelectItem value="in-lab">In Lab</SelectItem>
                    <SelectItem value="assigned-to-tech">Assigned to Tech</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="lab-management">Lab Management</SelectItem>
                    <SelectItem value="repair-department">Repair Department</SelectItem>
                    <SelectItem value="rotation">Rotation</SelectItem>
                    <SelectItem value="estimate">Estimate</SelectItem>
                    <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
                    <SelectItem value="awaiting-pr-approval">Awaiting PR Approval</SelectItem>
                    <SelectItem value="in-metrology">In Metrology</SelectItem>
                    <SelectItem value="to-factory">To Factory</SelectItem>
                    <SelectItem value="to-factory-repair-replacement">To Factory - Repair by Replacement</SelectItem>
                    <SelectItem value="to-factory-warranty">To Factory - Warranty</SelectItem>
                    <SelectItem value="lab-hold">Lab Hold</SelectItem>
                    <SelectItem value="qa-inspection">Q/A Inspection</SelectItem>
                    <SelectItem value="qa-inspection-fail-correction">Q/A Inspection - Fail Correction</SelectItem>
                    <SelectItem value="qa-hold">Q/A Hold</SelectItem>
                    <SelectItem value="qa-disapproved">Q/A Disapproved</SelectItem>
                    <SelectItem value="qa-fail-log">Q/A Fail Log</SelectItem>
                    <SelectItem value="ar-invoicing">A/R Invoicing</SelectItem>
                    <SelectItem value="ar-invoicing-hold">A/R Invoicing/Hold</SelectItem>
                    <SelectItem value="admin-processing">Admin Processing</SelectItem>
                    <SelectItem value="back-to-customer">Back to Customer</SelectItem>
                    <SelectItem value="calibrated-on-shelf">Calibrated on Shelf</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="item-not-found-on-site">Item Not Found on Site</SelectItem>
                    <SelectItem value="me-review">ME Review</SelectItem>
                    <SelectItem value="not-used">Not Used</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="ready-for-departure">Ready for Departure</SelectItem>
                    <SelectItem value="return-to-lab-processing">Return to Lab for Processing</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="surplus-stock">Surplus Stock</SelectItem>
                    <SelectItem value="waiting-on-customer">Waiting on Customer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.workOrderItemStatus || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, workOrderItemStatus: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.workOrderItemStatus)}>
                    <SelectValue placeholder="All WO Item Status" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All WO Item Status</SelectItem>
                    <SelectItem value="in-lab">In Lab</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.woType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, woType: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.woType)}>
                    <SelectValue placeholder="All WO Type" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All WO Type</SelectItem>
                    <SelectItem value="regular">Regular Work Order</SelectItem>
                    <SelectItem value="onsite">Onsite Work Order</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.workOrderItemType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, workOrderItemType: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.workOrderItemType)}>
                    <SelectValue placeholder="All WO Item Type" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All WO Item Type</SelectItem>
                    <SelectItem value="esl-gloves">ESL - Gloves</SelectItem>
                    <SelectItem value="esl-blankets">ESL - Blankets</SelectItem>
                    <SelectItem value="calibration">Calibration</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Group 3: Assignment */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Assignment</h3>

                <Select value={searchValues.assignee || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, assignee: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.assignee)}>
                    <SelectValue placeholder="All Assignee" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Assignee</SelectItem>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.salesperson || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, salesperson: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.salesperson)}>
                    <SelectValue placeholder="All Salesperson" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Salesperson</SelectItem>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.actionCode || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, actionCode: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.actionCode)}>
                    <SelectValue placeholder="All Action Code" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Action Code</SelectItem>
                    <SelectItem value="c/c">C/C</SelectItem>
                    <SelectItem value="r/c/c">R/C/C</SelectItem>
                    <SelectItem value="repair">REPAIR</SelectItem>
                    <SelectItem value="test">TEST</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.labCode || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, labCode: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.labCode)}>
                    <SelectValue placeholder="All Lab Code" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Lab Code</SelectItem>
                    <SelectItem value="lab-001">LAB-001</SelectItem>
                    <SelectItem value="lab-002">LAB-002</SelectItem>
                    <SelectItem value="lab-003">LAB-003</SelectItem>
                    <SelectItem value="lab-004">LAB-004</SelectItem>
                    <SelectItem value="lab-005">LAB-005</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Group 4: Workflow */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Workflow</h3>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(triggerCls(searchValues.priority), "w-full justify-start text-left font-normal")}
                    >
                      {searchValues.priority.length > 0
                        ? `Priority (${searchValues.priority.length})`
                        : "All Priority"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 bg-popover border shadow-xl rounded-lg z-[60]" align="start">
                    <div className="space-y-1">
                      {['critical', 'high', 'medium', 'low'].map((priority) => (
                        <button
                          key={priority}
                          onClick={() => {
                            setSearchValues(prev => ({
                              ...prev,
                              priority: prev.priority.includes(priority)
                                ? prev.priority.filter(p => p !== priority)
                                : [...prev.priority, priority]
                            }));
                          }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm capitalize transition-colors hover:bg-muted text-foreground"
                        >
                          <span className="flex h-4 w-4 items-center justify-center">
                            {searchValues.priority.includes(priority) && (
                              <Check className="h-4 w-4 stroke-[3]" />
                            )}
                          </span>
                          {priority}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Select value={searchValues.rotationManagement || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, rotationManagement: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.rotationManagement)}>
                    <SelectValue placeholder="All Rotation Management" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Rotation Management</SelectItem>
                    <SelectItem value="rotation">Rotation</SelectItem>
                    <SelectItem value="non-rotation">Non-Rotation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.invoiceStatus || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, invoiceStatus: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.invoiceStatus)}>
                    <SelectValue placeholder="All Invoice Status" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Invoice Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="quote-approved">Quote Approved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchValues.departureType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, departureType: value === 'all' ? '' : value }))}>
                  <SelectTrigger className={triggerCls(searchValues.departureType)}>
                    <SelectValue placeholder="All Departure Type" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all">All Departure Type</SelectItem>
                    <SelectItem value="ship">Ship</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Filters - Checkboxes */}
            <div className="pt-2.5 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">Additional Filters</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {[
                  { id: 'newEquip', label: 'New Equip', key: 'newEquip' as const },
                  { id: 'usedSurplus', label: 'Used Surplus', key: 'usedSurplus' as const },
                  { id: 'warranty', label: 'Warranty', key: 'warranty' as const },
                  { id: 'toFactory', label: 'To Factory', key: 'toFactory' as const },
                  { id: 'proofOfDelivery', label: 'Proof of Delivery', key: 'proofOfDelivery' as const },
                  { id: 'only17025', label: 'Only 17025', key: 'only17025' as const },
                  { id: 'onlyHotList', label: 'Only Hot List', key: 'onlyHotList' as const },
                  { id: 'onlyLostEquip', label: 'Only Lost Equip', key: 'onlyLostEquip' as const },
                  { id: 'nonJMAccts', label: 'Non JM Accts', key: 'nonJMAccts' as const },
                  { id: 'viewTemplate', label: 'View Template', key: 'viewTemplate' as const },
                ].map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-1.5">
                    <Checkbox
                      id={filter.id}
                      checked={searchValues[filter.key]}
                      onCheckedChange={(checked) => 
                        setSearchValues(prev => ({ ...prev, [filter.key]: checked as boolean }))
                      }
                    />
                    <Label
                      htmlFor={filter.id}
                      className="text-xs font-normal leading-none cursor-pointer text-gray-700"
                    >
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* CSA View - Only Location and Arrival From/To */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Location</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(selectTriggerClass, "w-full justify-start text-left font-normal")}
                    >
                      {selectedLocations.length > 0
                        ? `${selectedLocations.length} Location${selectedLocations.length > 1 ? 's' : ''} selected`
                        : "All Location"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0 bg-popover border shadow-xl rounded-lg z-[60]" align="start">
                    <div className="p-2 border-b">
                      <div className="flex items-center bg-muted/50 rounded-md px-2">
                        <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Search locations..."
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          className="w-full bg-transparent border-0 py-2 px-2 text-sm outline-none placeholder:text-muted-foreground"
                        />
                        {locationSearch && (
                          <button onClick={() => setLocationSearch('')}>
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                      {locationOptions
                        .filter(loc => loc.label.toLowerCase().includes(locationSearch.toLowerCase()))
                        .map((loc) => (
                        <button
                          key={loc.value}
                          onClick={() => {
                            setSelectedLocations(prev =>
                              prev.includes(loc.value)
                                ? prev.filter(l => l !== loc.value)
                                : [...prev, loc.value]
                            );
                          }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted text-foreground"
                        >
                          <span className="flex h-4 w-4 items-center justify-center">
                            {selectedLocations.includes(loc.value) && (
                              <Check className="h-4 w-4 stroke-[3]" />
                            )}
                          </span>
                          {loc.label}
                        </button>
                      ))}
                      {locationOptions.filter(loc => loc.label.toLowerCase().includes(locationSearch.toLowerCase())).length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-3">No locations found</p>
                      )}
                    </div>
                    {selectedLocations.length > 0 && (
                      <div className="p-2 border-t">
                        <button
                          onClick={() => setSelectedLocations([])}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="sm:col-span-2">
                <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Arrival Date Range</Label>
                <DateRangePicker
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onDateFromChange={setDateFrom}
                  onDateToChange={setDateTo}
                  triggerClassName="h-10 text-sm"
                />
              </div>
            </div>
            {/* Selected filter badges */}
            {(selectedLocations.length > 0 || (dateFrom && dateTo)) && (
              <div className="flex flex-wrap gap-1.5">
                {selectedLocations.map((loc) => {
                  const label = locationOptions.find(l => l.value === loc)?.label || loc;
                  return (
                    <Badge
                      key={loc}
                      variant="secondary"
                      className="px-2.5 py-1 text-xs flex items-center gap-1.5"
                    >
                      {label}
                      <button
                        onClick={() => setSelectedLocations(prev => prev.filter(l => l !== loc))}
                        className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                {dateFrom && dateTo && (
                  <Badge variant="secondary" className="px-2.5 py-1 text-xs flex items-center gap-1.5">
                    {format(dateFrom, "MMM dd, yyyy")} — {format(dateTo, "MMM dd, yyyy")}
                    <button
                      onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}
                      className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Broad-search warning - Default view only */}
        {viewMode === 'default' && (() => {
          const narrowingChipTypes = ['workOrderNumber','accountNumber','customerName','onsiteProjectNumber','poNumber','toFactoryPONumber','custID','mfgSerial','modelNumber','rfid','quoteNumber','vendorRMANumber'];
          const hasNarrowingChip = searchChips.some(c => narrowingChipTypes.includes(c.type));
          const hasDateRange = !!(dateFrom && dateTo);
          const hasOtherFilters = !!(
            searchValues.woNumber ||
            searchValues.customer ||
            searchValues.manufacturer ||
            searchValues.priority.length > 0 ||
            searchValues.assignee ||
            searchValues.division ||
            searchValues.woType ||
            searchValues.actionCode ||
            searchValues.labCode ||
            searchValues.rotationManagement ||
            searchValues.invoiceStatus ||
            searchValues.departureType ||
            searchValues.salesperson ||
            searchValues.workOrderItemStatus ||
            searchValues.workOrderItemType ||
            searchValues.location ||
            searchValues.newEquip ||
            searchValues.usedSurplus ||
            searchValues.warranty ||
            searchValues.toFactory ||
            searchValues.proofOfDelivery ||
            searchValues.only17025 ||
            searchValues.onlyHotList ||
            searchValues.onlyLostEquip ||
            searchValues.nonJMAccts ||
            searchValues.viewTemplate ||
            selectedLocations.length > 0
          );
          const isTooBroad = !!searchValues.status && !hasNarrowingChip && !hasDateRange && !hasOtherFilters;


          return (
            <>
              {isTooBroad && (
                <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 mt-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <span className="font-semibold">Your search may return 5,000+ work orders.</span>{' '}
                    Please narrow it down by adding a WO #, Account, Customer, Serial, PO, or a date range before searching.
                  </div>
                </div>
              )}
              <div className="flex justify-end items-center gap-2 pt-1.5">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="rounded-lg h-8 px-4 text-xs font-medium border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Clear All
                </Button>
                <Button
                  onClick={() => {
                    if (isTooBroad) {
                      toast({
                        title: 'Search too broad',
                        description: 'Your search may return 5,000+ work orders. Add a more specific filter (WO #, Account, Customer, Serial, PO, or date range) to continue.',
                        variant: 'destructive',
                      });
                      return;
                    }
                    handleSearch();
                  }}
                  disabled={isTooBroad}
                  className="rounded-lg h-8 px-5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="h-3.5 w-3.5 mr-1.5" />
                  Search
                </Button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default ModernTopSearchFilters;