import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, RotateCcw, Filter, Building2, User, Package } from "lucide-react";

// Mock work order batch data for suggestions - matching the actual data
const mockWorkOrderBatches = [
  {
    id: "1",
    woBatch: "383727",
    acctNumber: "13058.06",
    srNumber: "SR2455",
    customerName: "Deutsche Windtechnik Inc",
    minNeedByDate: "09/24/2021",
  },
  {
    id: "2", 
    woBatch: "390118",
    acctNumber: "6962.01",
    srNumber: "SR1820",
    customerName: "Colonial Pipeline",
    minNeedByDate: "12/20/2022",
  },
  {
    id: "3",
    woBatch: "452463",
    acctNumber: "6962.01",
    srNumber: "SR1820",
    customerName: "Colonial Pipeline",
    minNeedByDate: "06/23/2023",
  },
  {
    id: "4",
    woBatch: "393015",
    acctNumber: "7412.06",
    srNumber: "",
    customerName: "Burns & McDonnell",
    minNeedByDate: "01/17/2022",
  },
  {
    id: "5",
    woBatch: "441228",
    acctNumber: "2577.50",
    srNumber: "SR2425",
    customerName: "Energy Transfer",
    minNeedByDate: "03/20/2023",
  },
  {
    id: "6",
    woBatch: "438752",
    acctNumber: "13058.20",
    srNumber: "SR2458",
    customerName: "Nuclear Research Institute",
    minNeedByDate: "12/10/2021",
  }
];

interface SearchForm {
  workOrderNumber: string;
  customerName: string;
  status: string;
  priority: string;
  manufacturer: string;
}

interface SearchFilters {
  globalSearch: string;
  searchTags: string[];
  status: string;
  assignee: string;
  priority: string;
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

const MinimalWorkOrderSearch = ({ onSearch }: MinimalWorkOrderSearchProps) => {
  const [searchForm, setSearchForm] = useState<SearchForm>({
    workOrderNumber: '',
    customerName: '',
    status: '',
    priority: '',
    manufacturer: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [activeField, setActiveField] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Generate suggestions based on search input
  const generateSuggestions = (query: string, fieldType: string) => {
    console.log('Generating suggestions for:', query, 'field:', fieldType); // Debug log
    
    if (!query || query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matchingSuggestions = [];

    mockWorkOrderBatches.forEach(batch => {
      if (fieldType === 'workOrderNumber') {
        // Check WO batch
        if (batch.woBatch.toLowerCase().includes(searchTerm)) {
          matchingSuggestions.push({
            type: 'work-order',
            value: batch.woBatch,
            label: `WO Batch: ${batch.woBatch}`,
            subtitle: batch.customerName
          });
        }
        // Check account number
        if (batch.acctNumber.toLowerCase().includes(searchTerm)) {
          matchingSuggestions.push({
            type: 'account',
            value: batch.acctNumber,
            label: `Account: ${batch.acctNumber}`,
            subtitle: batch.customerName
          });
        }
        // Check SR number
        if (batch.srNumber && batch.srNumber.toLowerCase().includes(searchTerm)) {
          matchingSuggestions.push({
            type: 'sr',
            value: batch.srNumber,
            label: `SR: ${batch.srNumber}`,
            subtitle: batch.customerName
          });
        }
      }
      
      if (fieldType === 'customerName' && batch.customerName.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'customer',
          value: batch.customerName,
          label: `Customer: ${batch.customerName}`,
          subtitle: `WO Batch: ${batch.woBatch}`
        });
      }
    });

    // Remove duplicates and limit results
    const uniqueSuggestions = matchingSuggestions.filter((suggestion, index, arr) => 
      arr.findIndex(s => s.label === suggestion.label) === index
    ).slice(0, 8);

    console.log('Generated suggestions:', uniqueSuggestions); // Debug log
    setSuggestions(uniqueSuggestions);
    setShowSuggestions(uniqueSuggestions.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  // Handle input changes with suggestions
  const handleInputChange = (field: keyof SearchForm, value: string) => {
    updateSearchForm(field, value);
    setActiveField(field);
    generateSuggestions(value, field);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    if (activeField === 'workOrderNumber') {
      updateSearchForm('workOrderNumber', suggestion.value);
    } else if (activeField === 'customerName') {
      updateSearchForm('customerName', suggestion.value);
    }
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateSearchForm = (field: keyof SearchForm, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchForm({
      workOrderNumber: '',
      customerName: '',
      status: '',
      priority: '',
      manufacturer: ''
    });
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        globalSearch: searchForm.workOrderNumber || searchForm.customerName || '',
        searchTags: [],
        status: searchForm.status,
        assignee: '',
        priority: searchForm.priority,
        manufacturer: searchForm.manufacturer,
        division: '',
        woType: '',
        dateType: '',
        actionCode: '',
        labCode: '',
        rotationManagement: '',
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
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Work Order Search
          </CardTitle>
          <div className="flex items-center gap-2">
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
      
      <CardContent className="space-y-6">
        {/* Essential Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 relative">
            <Label htmlFor="wo-number" className="text-sm font-medium">
              Work Order Number
            </Label>
            <div className="relative">
              <Input
                ref={searchInputRef}
                id="wo-number"
                placeholder="Enter WO #, Account #, or SR #"
                value={searchForm.workOrderNumber}
                onChange={(e) => handleInputChange('workOrderNumber', e.target.value)}
                onKeyDown={handleKeyDown}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && activeField === 'workOrderNumber' && (
                <div className="absolute top-full left-0 right-0 z-50 bg-popover border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.value}-${index}`}
                      className={`px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                        index === selectedSuggestionIndex ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        {suggestion.type === 'work-order' && <Package className="h-4 w-4 text-blue-500" />}
                        {suggestion.type === 'customer' && <Building2 className="h-4 w-4 text-green-500" />}
                        {suggestion.type === 'account' && <User className="h-4 w-4 text-purple-500" />}
                        {suggestion.type === 'sr' && <Search className="h-4 w-4 text-orange-500" />}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{suggestion.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{suggestion.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="customer" className="text-sm font-medium">
              Customer Name
            </Label>
            <div className="relative">
              <Input
                id="customer"
                placeholder="Enter customer name"
                value={searchForm.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                onKeyDown={handleKeyDown}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
              
              {/* Customer Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && activeField === 'customerName' && (
                <div className="absolute top-full left-0 right-0 z-50 bg-popover border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.value}-${index}`}
                      className={`px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                        index === selectedSuggestionIndex ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-green-500" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{suggestion.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{suggestion.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={searchForm.status} onValueChange={(value) => updateSearchForm('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in-lab">In Lab</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        {showAdvanced && (
          <div className="border-t pt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select value={searchForm.priority} onValueChange={(value) => updateSearchForm('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-lg z-50">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="rush">Rush</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="text-sm font-medium">
                  Manufacturer
                </Label>
                <Input
                  id="manufacturer"
                  placeholder="Enter manufacturer"
                  value={searchForm.manufacturer}
                  onChange={(e) => updateSearchForm('manufacturer', e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={clearAllFilters} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Clear All
          </Button>
          
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