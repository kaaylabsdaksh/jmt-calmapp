import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchFilters {
  globalSearch: string;
  itemStatus: string;
  itemType: string;
  manufacturer: string;
  dateFrom?: Date;
  dateTo?: Date;
  dateType: string;
}

interface UnusedItemsSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

// Mock unused items for suggestions
const mockUnusedItems = [
  {
    reportNumber: "0152.01-802961-001",
    manufacturer: "Siemens",
    model: "S7-1200",
    serialNumber: "SIE123456",
    itemStatus: "Not Used",
    itemType: "SINGLE"
  },
  {
    reportNumber: "0152.01-802961-002", 
    manufacturer: "ABB",
    model: "REF615",
    serialNumber: "ABB789123",
    itemStatus: "Not Used",
    itemType: "SINGLE"
  },
  {
    reportNumber: "0152.01-802961-003",
    manufacturer: "Schneider Electric", 
    model: "SEPAM-80",
    serialNumber: "SCH456789",
    itemStatus: "Not Used",
    itemType: "SINGLE"
  }
];

const UnusedItemsSearchFilters = ({ onSearch }: UnusedItemsSearchFiltersProps) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [dateType, setDateType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [searchValues, setSearchValues] = useState({
    itemStatus: '',
    itemType: '',
    manufacturer: ''
  });

  // Generate suggestions based on search input
  const generateSuggestions = (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matchingSuggestions = [];

    mockUnusedItems.forEach(item => {
      if (item.reportNumber.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'report-number',
          value: item.reportNumber,
          label: `Report #: ${item.reportNumber}`,
          subtitle: item.manufacturer
        });
      }
      if (item.manufacturer.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'manufacturer',
          value: item.manufacturer,
          label: `Manufacturer: ${item.manufacturer}`,
          subtitle: `Model: ${item.model}`
        });
      }
      if (item.model.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'model',
          value: item.model,
          label: `Model: ${item.model}`,
          subtitle: item.manufacturer
        });
      }
      if (item.serialNumber.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'serial',
          value: item.serialNumber,
          label: `Serial #: ${item.serialNumber}`,
          subtitle: `Report: ${item.reportNumber}`
        });
      }
    });

    // Remove duplicates and limit to 6 suggestions
    const uniqueSuggestions = matchingSuggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.value === suggestion.value && s.type === suggestion.type)
      )
      .slice(0, 6);

    setSuggestions(uniqueSuggestions);
    setShowSuggestions(uniqueSuggestions.length > 0);
  };

  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalSearch(value);
    setSelectedSuggestionIndex(-1);
    generateSuggestions(value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: any) => {
    setGlobalSearch(suggestion.value);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    // Auto-trigger search when suggestion is selected
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleSearch = () => {
    const filters = {
      globalSearch,
      itemStatus: searchValues.itemStatus,
      itemType: searchValues.itemType,
      manufacturer: searchValues.manufacturer,
      dateFrom,
      dateTo,
      dateType
    };
    console.log('Searching unused items with filters:', filters);
    onSearch(filters);
  };

  const clearAllFilters = () => {
    setGlobalSearch('');
    setSearchValues({
      itemStatus: '',
      itemType: '',
      manufacturer: ''
    });
    setDateFrom(undefined);
    setDateTo(undefined);
    setDateType('');
    
    // Trigger search with empty filters to show all results
    onSearch({
      globalSearch: '',
      itemStatus: '',
      itemType: '',
      manufacturer: '',
      dateFrom: undefined,
      dateTo: undefined,
      dateType: ''
    });
  };

  // Automatically search when globalSearch is cleared manually
  useEffect(() => {
    if (globalSearch === '' && globalSearch !== undefined) {
      const timeoutId = setTimeout(() => {
        onSearch({
          globalSearch: '',
          itemStatus: searchValues.itemStatus,
          itemType: searchValues.itemType,
          manufacturer: searchValues.manufacturer,
          dateFrom,
          dateTo,
          dateType
        });
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [globalSearch]);

  const hasActiveFilters = globalSearch || Object.values(searchValues).some(value => value && value !== 'all') || dateFrom || dateTo || dateType;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Unused Items Search</h2>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "rounded-lg transition-all duration-300 transform hover:scale-105",
              showAdvanced ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground" : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showAdvanced ? "Hide Filters" : "More Filters"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className={cn(
              "rounded-lg transition-all duration-300 transform hover:scale-105",
              hasActiveFilters 
                ? "text-red-600 hover:bg-black hover:text-white" 
                : "text-gray-400 hover:bg-black hover:text-white"
            )}
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Global Search */}
      <div className="p-4 pb-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search report numbers, manufacturers, models, serial numbers..."
              value={globalSearch}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => globalSearch.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="pl-12 bg-white border border-gray-300 rounded-lg h-11 text-sm placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.value}-${index}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                        selectedSuggestionIndex === index 
                          ? "bg-primary/10 border-primary/20" 
                          : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {suggestion.type === 'report-number' && (
                            <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-xs font-semibold">
                              R#
                            </div>
                          )}
                          {suggestion.type === 'manufacturer' && (
                            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xs font-semibold">
                              M
                            </div>
                          )}
                          {suggestion.type === 'model' && (
                            <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center text-xs font-semibold">
                              #
                            </div>
                          )}
                          {suggestion.type === 'serial' && (
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs font-semibold">
                              S#
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {suggestion.label}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {suggestion.subtitle}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-lg h-11 font-medium shadow-sm transition-all duration-300 transform hover:scale-105"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-100 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Item Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Status</label>
              <Select value={searchValues.itemStatus} onValueChange={(value) => setSearchValues(prev => ({ ...prev, itemStatus: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Not Used">Not Used</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Item Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
              <Select value={searchValues.itemType} onValueChange={(value) => setSearchValues(prev => ({ ...prev, itemType: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="Transformer">Transformer</SelectItem>
                  <SelectItem value="Control Panel">Control Panel</SelectItem>
                  <SelectItem value="Protection Relay">Protection Relay</SelectItem>
                  <SelectItem value="Switchgear">Switchgear</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Manufacturer Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
              <Select value={searchValues.manufacturer} onValueChange={(value) => setSearchValues(prev => ({ ...prev, manufacturer: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Manufacturers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Manufacturers</SelectItem>
                  <SelectItem value="General Electric">General Electric</SelectItem>
                  <SelectItem value="Siemens">Siemens</SelectItem>
                  <SelectItem value="ABB">ABB</SelectItem>
                  <SelectItem value="Schneider Electric">Schneider Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "MM/dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "MM/dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnusedItemsSearchFilters;