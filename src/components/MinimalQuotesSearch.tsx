import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Search, Plus, RotateCcw, Filter, X, Clock, Hash, User, FileText, Briefcase, MapPin, Phone, Calendar } from "lucide-react";

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

const searchTypeOptions = [
  { value: 'quoteNumber', label: 'Quote Number', icon: Hash },
  { value: 'projectNumber', label: 'Project Number', icon: Briefcase },
  { value: 'customerName', label: 'Customer Name', icon: User },
  { value: 'accountNumber', label: 'Account Number', icon: FileText },
  { value: 'contactFirst', label: 'Contact First', icon: User },
  { value: 'contactLast', label: 'Contact Last', icon: User },
  { value: 'phone', label: 'Phone #', icon: Phone },
  { value: 'cell', label: 'Cell #', icon: Phone },
  { value: 'createdBy', label: 'Created By', icon: User },
  { value: 'custPo', label: 'Cust PO #', icon: FileText },
  { value: 'state', label: 'State', icon: MapPin },
  { value: 'city', label: 'City', icon: MapPin },
  { value: 'industryCode', label: 'Industry Code', icon: FileText },
];

export interface QuoteFilters {
  globalSearch: string;
  searchTags: string[];
  quoteType: string;
  poco: string;
  priority: string;
  status: string;
  location: string;
  source: string;
  salesperson: string;
  itemsQuoted: string;
  createdFrom?: Date;
  createdTo?: Date;
  needByFrom?: Date;
  needByTo?: Date;
  followUpFrom?: Date;
  followUpTo?: Date;
  showTotals: boolean;
}

interface MinimalQuotesSearchProps {
  onSearch?: (filters: QuoteFilters) => void;
}

const RECENT_SEARCHES_KEY = 'quotes-recent-searches';
const MAX_RECENT_SEARCHES = 8;

function loadRecentSearches(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: RecentSearch[]) {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)));
  } catch {}
}

const QUOTE_TYPES = ["Lab", "OnSite", "ESL", "Rental", "Sales"];
const POCO_OPTIONS = ["Yes", "No"];
const PRIORITIES = ["Emergency", "Expedite", "Rush", "Normal"];
const ITEMS_QUOTED = ["[Any]", "Yes", "No"];
const STATUSES = ["Open", "Pending Approval", "Sent", "Won", "Lost", "Cancelled"];
const LOCATIONS = ["BR", "CL", "GR", "MT", "HOU"];
const SOURCES = ["Phone", "Email", "Web", "Salesperson", "Walk-in"];
const SALESPEOPLE = ["Brandi M. Cali", "Trysten Q Howze", "Kevin R. Young", "Jessica M Thompson"];

const MinimalQuotesSearch = ({ onSearch }: MinimalQuotesSearchProps) => {
  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);
  const [selectedSearchType, setSelectedSearchType] = useState('quoteNumber');
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowRecentSearches(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchChips.length === 0) {
      setResultCount(null);
      return;
    }
    const timer = setTimeout(() => {
      setResultCount(Math.max(1, 12 - searchChips.length * 2));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchChips]);

  const addSearchChip = (value?: string) => {
    const chipValue = value || searchInput.trim();
    if (!chipValue) return;

    const selectedOption = searchTypeOptions.find(opt => opt.value === selectedSearchType);
    if (!selectedOption) return;

    const newChip: SearchChip = {
      id: `${selectedSearchType}-${Date.now()}`,
      type: selectedSearchType,
      value: chipValue,
      label: selectedOption.label,
    };

    setSearchChips(prev => [...prev, newChip]);
    setSearchInput('');
    searchInputRef.current?.focus();
  };

  const removeSearchChip = (chipId: string) => {
    setSearchChips(prev => prev.filter(chip => chip.id !== chipId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSearchChip();
    }
    if (e.key === 'Escape') {
      setShowRecentSearches(false);
    }
  };

  const clearAllFilters = () => {
    setSearchChips([]);
    setSearchInput('');
    setResultCount(null);
    setFilters({
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
  };

  const handleSearch = () => {
    if (searchChips.length > 0) {
      const recentEntry: RecentSearch = {
        id: `recent-${Date.now()}`,
        chips: [...searchChips],
        timestamp: Date.now(),
        label: searchChips.map(c => `${c.label}: ${c.value}`).join(', '),
      };
      const updated = [recentEntry, ...recentSearches.filter(r => r.label !== recentEntry.label)].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      saveRecentSearches(updated);
    }

    const searchTags = searchChips.map(chip => `${chip.label}: ${chip.value}`);
    const nextFilters: QuoteFilters = {
      ...filters,
      globalSearch: searchChips.map(chip => chip.value).join(' '),
      searchTags,
    };
    setFilters(nextFilters);
    onSearch?.(nextFilters);
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

  const clearRecentSearches = () => {
    setRecentSearches([]);
    saveRecentSearches([]);
  };

  const handleInputFocus = () => {
    if (!searchInput.trim() && recentSearches.length > 0) {
      setShowRecentSearches(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    if (!val.trim() && recentSearches.length > 0) setShowRecentSearches(true);
    else setShowRecentSearches(false);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const updateFilter = <K extends keyof QuoteFilters>(key: K, value: QuoteFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const Pick = ({ label, k, options }: { label: string; k: keyof QuoteFilters; options: string[] }) => (
    <div className="space-y-1">
      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">{label}</Label>
      <Select value={(filters[k] as string) || undefined} onValueChange={(v) => updateFilter(k, v as QuoteFilters[typeof k])}>
        <SelectTrigger className="h-8 text-[11px] px-2 bg-popover">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o} className="text-xs">
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Quotes Search
            </CardTitle>
            {resultCount !== null && (
              <Badge variant="secondary" className="px-2.5 py-1 text-xs font-medium animate-in fade-in-50 slide-in-from-left-2">
                <Search className="h-3 w-3 mr-1 text-primary" />
                {resultCount} {resultCount === 1 ? 'result' : 'results'} found
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={clearAllFilters} className="flex items-center gap-2 h-9 text-xs">
              <RotateCcw className="h-4 w-4" />
              Clear All
            </Button>
            <Button onClick={handleSearch} className="flex items-center gap-2 h-9 text-xs">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-9 text-xs">
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {searchChips.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border">
            {searchChips.map((chip) => (
              <Badge
                key={chip.id}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-2"
              >
                <span className="font-medium">{chip.label}:</span>
                <span>{chip.value}</span>
                <button
                  onClick={() => removeSearchChip(chip.id)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium">Search Criteria</Label>
          <div className="flex gap-2" ref={searchContainerRef}>
            <Select value={selectedSearchType} onValueChange={setSelectedSearchType}>
              <SelectTrigger className="w-[240px] h-11 bg-popover">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {searchTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={
                      selectedSearchType === option.value
                        ? 'bg-slate-900 text-white font-semibold focus:bg-slate-900 focus:text-white data-[highlighted]:bg-slate-800 data-[highlighted]:text-white'
                        : ''
                    }
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={searchInputRef}
                    placeholder={`Enter ${searchTypeOptions.find(opt => opt.value === selectedSearchType)?.label}...`}
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button
                  onClick={() => addSearchChip()}
                  variant="secondary"
                  className="h-11 px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {showRecentSearches && recentSearches.length > 0 && !searchInput.trim() && (
                <div className="absolute left-0 right-[88px] top-[calc(100%+4px)] z-50 bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in-50 slide-in-from-top-2">
                  <div className="px-3 py-2 border-b bg-muted/30 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((recent) => (
                    <button
                      key={recent.id}
                      onClick={() => applyRecentSearch(recent)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-0 group"
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground truncate">{recent.label}</div>
                        <div className="text-xs text-muted-foreground">{formatTimeAgo(recent.timestamp)}</div>
                      </div>
                      <button
                        onClick={(e) => removeRecentSearch(recent.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="p-3 bg-muted/30 rounded-lg border space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-2">
              <Pick label="Quote Type" k="quoteType" options={QUOTE_TYPES} />
              <Pick label="PO/CO Req?" k="poco" options={POCO_OPTIONS} />
              <Pick label="Priority" k="priority" options={PRIORITIES} />
              <Pick label="Status" k="status" options={STATUSES} />
              <Pick label="Location" k="location" options={LOCATIONS} />
              <Pick label="Source" k="source" options={SOURCES} />
              <Pick label="Salesperson" k="salesperson" options={SALESPEOPLE} />
              <Pick label="Items Quoted" k="itemsQuoted" options={ITEMS_QUOTED} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created From / To
                </Label>
                <DateRangePicker
                  dateFrom={filters.createdFrom}
                  dateTo={filters.createdTo}
                  onDateFromChange={(d) => updateFilter('createdFrom', d)}
                  onDateToChange={(d) => updateFilter('createdTo', d)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Need By From / To
                </Label>
                <DateRangePicker
                  dateFrom={filters.needByFrom}
                  dateTo={filters.needByTo}
                  onDateFromChange={(d) => updateFilter('needByFrom', d)}
                  onDateToChange={(d) => updateFilter('needByTo', d)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Follow Up From / To
                </Label>
                <DateRangePicker
                  dateFrom={filters.followUpFrom}
                  dateTo={filters.followUpTo}
                  onDateFromChange={(d) => updateFilter('followUpFrom', d)}
                  onDateToChange={(d) => updateFilter('followUpTo', d)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-4 border-t">
          <Button variant="secondary" className="flex items-center gap-2 h-9 text-xs">
            <Plus className="h-4 w-4" />
            Create New Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalQuotesSearch;
