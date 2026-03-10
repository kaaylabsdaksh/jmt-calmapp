import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, RotateCcw, Filter, X, Clock, Hash, User, FileText, Package } from "lucide-react";

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
  { value: 'workOrderNumber', label: 'Work Order Number', icon: Hash },
  { value: 'workOrderItemNumber', label: 'Work Order Item Number', icon: Hash },
  { value: 'accountNumber', label: 'Account Number', icon: FileText },
  { value: 'customerName', label: 'Customer Name', icon: User },
  { value: 'onsiteProjectNumber', label: 'Onsite Project Number', icon: FileText },
  { value: 'poNumber', label: 'PO Number', icon: FileText },
  { value: 'toFactoryPONumber', label: 'To Factory PO Number', icon: Package },
  { value: 'serialNumber', label: 'Serial Number', icon: Hash },
  { value: 'custID', label: 'Cust ID', icon: User },
  { value: 'mfgSerial', label: 'MFG Serial', icon: Hash },
  { value: 'modelNumber', label: 'Model Number', icon: Package },
  { value: 'manufacturer', label: 'Manufacturer', icon: Package },
  { value: 'productDescription', label: 'Product Description', icon: FileText },
  { value: 'eslID', label: 'ESL ID', icon: Hash },
  { value: 'rfid', label: 'RFID', icon: Hash },
  { value: 'quoteNumber', label: 'Quote Number', icon: FileText },
  { value: 'vendorRMANumber', label: 'Vendor RMA Number', icon: FileText },
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

interface MinimalWorkOrderSearchProps {
  onSearch?: (filters: SearchFilters) => void;
}

const RECENT_SEARCHES_KEY = 'wo-recent-searches';
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

const MinimalWorkOrderSearch = ({ onSearch }: MinimalWorkOrderSearchProps) => {
  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);
  const [selectedSearchType, setSelectedSearchType] = useState('workOrderNumber');
  const [searchInput, setSearchInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Simulate live result count based on active filters
  useEffect(() => {
    if (searchChips.length === 0) {
      setResultCount(null);
      return;
    }
    const timer = setTimeout(() => {
      setResultCount(Math.max(1, 10 - searchChips.length * 2));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchChips]);

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
  };

  const handleSearch = () => {
    // Save to recent searches
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

    if (onSearch) {
      const searchTags = searchChips.map(chip => `${chip.label}: ${chip.value}`);
      onSearch({
        globalSearch: searchChips.map(chip => chip.value).join(' '),
        searchTags,
        status: '', assignee: '', priority: [], manufacturer: '', division: '', woType: '',
        dateType: '', actionCode: '', labCode: '', rotationManagement: '', invoiceStatus: '',
        departureType: '', salesperson: '', workOrderItemStatus: '', workOrderItemType: '',
        location: '', newEquip: false, usedSurplus: false, warranty: false, toFactory: false,
        proofOfDelivery: false, only17025: false, onlyHotList: false, onlyLostEquip: false,
        nonJMAccts: false, viewTemplate: false,
      });
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Work Order Search
            </CardTitle>
            {/* Live Result Count */}
            {resultCount !== null && (
              <Badge variant="secondary" className="px-2.5 py-1 text-xs font-medium animate-in fade-in-50 slide-in-from-left-2">
                <Search className="h-3 w-3 mr-1 text-primary" />
                {resultCount} {resultCount === 1 ? 'result' : 'results'} found
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={clearAllFilters} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Clear All
            </Button>
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Chips Display */}
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

        {/* Main Search Bar with Dropdown + Auto-Suggest */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search Criteria</Label>
          <div className="flex gap-2" ref={searchContainerRef}>
            <Select value={selectedSearchType} onValueChange={setSelectedSearchType}>
              <SelectTrigger className="w-[240px] h-11 bg-popover">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {searchTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
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

              {/* Recent Searches Dropdown */}
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

        {/* Action Buttons */}
        <div className="flex items-center justify-end pt-4 border-t">
          <Button variant="secondary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Work Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalWorkOrderSearch;
