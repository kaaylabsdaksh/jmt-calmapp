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
  status: string;
  assignee: string;
  priority: string;
  manufacturer: string;
  division: string;
  woType: string;
  dateFrom?: Date;
  dateTo?: Date;
  dateType: string;
}

interface ModernTopSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

// Mock work orders for suggestions (in a real app, this would come from props or API)
const mockWorkOrders = [
  {
    id: "385737",
    customer: "ACME Industries", 
    assignedTo: "John Smith",
    division: "Lab",
    manufacturer: "ADEULIS",
    modelNumber: "PPS-1734",
    labCode: "LAB-001"
  },
  {
    id: "390589", 
    customer: "Tech Solutions Ltd",
    assignedTo: "Sarah Johnson", 
    division: "Rental",
    manufacturer: "STARRETT",
    modelNumber: "844-441",
    labCode: "LAB-002"
  },
  {
    id: "400217",
    customer: "Manufacturing Corp",
    assignedTo: "Mike Davis",
    division: "ESL Onsite", 
    manufacturer: "CHARLS LTD",
    modelNumber: "1000PS",
    labCode: "LAB-003"
  },
  {
    id: "403946",
    customer: "Quality Systems Inc",
    assignedTo: "Emily Wilson",
    division: "ESL",
    manufacturer: "PRECISION TOOLS", 
    modelNumber: "CAL-500",
    labCode: "LAB-004"
  },
  {
    id: "405078",
    customer: "Aerospace Dynamics",
    assignedTo: "Tom Rodriguez",
    division: "Lab",
    manufacturer: "SNAP-ON",
    modelNumber: "TW-PRO-500", 
    labCode: "LAB-005"
  },
  {
    id: "408881",
    customer: "Pharmaceutical Labs Inc", 
    assignedTo: "Dr. Amanda Foster",
    division: "Rental",
    manufacturer: "METTLER TOLEDO",
    modelNumber: "AB-220",
    labCode: "LAB-006"
  },
  // Additional entries
  {
    id: "412340",
    customer: "Energy Solutions Corp",
    assignedTo: "Alex Thompson",
    division: "Lab",
    manufacturer: "FLUKE",
    modelNumber: "PM-850",
    labCode: "LAB-007"
  },
  {
    id: "415629",
    customer: "Medical Devices Inc",
    assignedTo: "Dr. Rachel Martinez",
    division: "ESL",
    manufacturer: "BRANSON",
    modelNumber: "UC-750",
    labCode: "LAB-008"
  },
  {
    id: "418974",
    customer: "Precision Manufacturing Ltd",
    assignedTo: "Kevin Park",
    division: "ESL Onsite",
    manufacturer: "ZEISS",
    modelNumber: "CMM-3000",
    labCode: "LAB-009"
  },
  {
    id: "421587",
    customer: "Automotive Testing Labs",
    assignedTo: "Lisa Chen",
    division: "Rental",
    manufacturer: "BRUEL & KJAER",
    modelNumber: "VA-2500",
    labCode: "LAB-010"
  },
  {
    id: "424833",
    customer: "Chemical Analysis Corp",
    assignedTo: "Dr. Patricia Lee",
    division: "Lab",
    manufacturer: "HACH",
    modelNumber: "pH-850",
    labCode: "LAB-011"
  },
  {
    id: "427965",
    customer: "Environmental Testing Solutions",
    assignedTo: "Michael Johnson",
    division: "ESL",
    manufacturer: "AGILENT",
    modelNumber: "GC-7890",
    labCode: "LAB-012"
  },
  {
    id: "430771",
    customer: "Telecommunications Inc",
    assignedTo: "Jennifer Walsh",
    division: "Lab",
    manufacturer: "KEYSIGHT",
    modelNumber: "E5071C",
    labCode: "LAB-013"
  },
  {
    id: "433498",
    customer: "Food Safety Labs",
    assignedTo: "Dr. Mark Roberts",
    division: "ESL",
    manufacturer: "THERMO FISHER",
    modelNumber: "TSQ-9000",
    labCode: "LAB-014"
  },
  {
    id: "436125",
    customer: "Aerospace Systems Ltd",
    assignedTo: "Amanda Clark",
    division: "Rental",
    manufacturer: "ROHDE & SCHWARZ",
    modelNumber: "FSW-26",
    labCode: "LAB-015"
  },
  {
    id: "438752",
    customer: "Nuclear Research Institute",
    assignedTo: "Dr. David Kumar",
    division: "ESL Onsite",
    manufacturer: "CANBERRA",
    modelNumber: "DSA-1000",
    labCode: "LAB-016"
  }
];

const ModernTopSearchFilters = ({ onSearch }: ModernTopSearchFiltersProps) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [dateType, setDateType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [searchValues, setSearchValues] = useState({
    woNumber: '',
    customer: '',
    status: '',
    manufacturer: '',
    priority: '',
    assignee: '',
    division: '',
    woType: ''
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

    mockWorkOrders.forEach(order => {
      // Check different fields and create suggestion objects
      if (order.id.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'work-order',
          value: order.id,
          label: `Work Order: ${order.id}`,
          subtitle: order.customer
        });
      }
      if (order.customer.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'customer',
          value: order.customer,
          label: `Customer: ${order.customer}`,
          subtitle: `Work Order: ${order.id}`
        });
      }
      if (order.assignedTo.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'assignee', 
          value: order.assignedTo,
          label: `Assignee: ${order.assignedTo}`,
          subtitle: `${order.division} Division`
        });
      }
      if (order.manufacturer.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'manufacturer',
          value: order.manufacturer,
          label: `Manufacturer: ${order.manufacturer}`,
          subtitle: `Model: ${order.modelNumber}`
        });
      }
      if (order.modelNumber.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'model',
          value: order.modelNumber,
          label: `Model: ${order.modelNumber}`,
          subtitle: order.manufacturer
        });
      }
      if (order.labCode.toLowerCase().includes(searchTerm)) {
        matchingSuggestions.push({
          type: 'lab-code',
          value: order.labCode,
          label: `Lab Code: ${order.labCode}`,
          subtitle: `Work Order: ${order.id}`
        });
      }
    });

    // Remove duplicates and limit to 8 suggestions
    const uniqueSuggestions = matchingSuggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.value === suggestion.value && s.type === suggestion.type)
      )
      .slice(0, 8);

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
      status: searchValues.status,
      assignee: searchValues.assignee,
      priority: searchValues.priority,
      manufacturer: searchValues.manufacturer,
      division: searchValues.division,
      woType: searchValues.woType,
      dateFrom,
      dateTo,
      dateType
    };
    console.log('Searching with filters:', filters);
    onSearch(filters);
  };

  const clearAllFilters = () => {
    setGlobalSearch('');
    setSearchValues({
      woNumber: '',
      customer: '',
      status: '',
      manufacturer: '',
      priority: '',
      assignee: '',
      division: '',
      woType: ''
    });
    setDateFrom(undefined);
    setDateTo(undefined);
    setDateType('');
    
    // Trigger search with empty filters to show all results
    onSearch({
      globalSearch: '',
      status: '',
      assignee: '',
      priority: '',
      manufacturer: '',
      division: '',
      woType: '',
      dateFrom: undefined,
      dateTo: undefined,
      dateType: ''
    });
  };

  // Automatically search when globalSearch is cleared manually
  useEffect(() => {
    if (globalSearch === '' && globalSearch !== undefined) {
      // Small delay to avoid rapid fire during typing
      const timeoutId = setTimeout(() => {
        onSearch({
          globalSearch: '',
          status: searchValues.status,
          assignee: searchValues.assignee,
          priority: searchValues.priority,
          manufacturer: searchValues.manufacturer,
          division: searchValues.division,
          woType: searchValues.woType,
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
        <h2 className="text-lg font-semibold text-gray-900">Work Order Search</h2>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "rounded-lg transition-all duration-300 transform hover:scale-105",
              showAdvanced ? "bg-blue-50 text-blue-600 hover:bg-black hover:text-white" : "text-gray-500 hover:bg-black hover:text-white"
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
        {/* Mobile: Search in first row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search work orders, customers, serial numbers, manufacturers..."
              value={globalSearch}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => globalSearch.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="pl-12 bg-white border border-gray-300 rounded-lg h-11 text-sm placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
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
                          ? "bg-blue-50 border-blue-100" 
                          : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {suggestion.type === 'work-order' && (
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-semibold">
                              WO
                            </div>
                          )}
                          {suggestion.type === 'customer' && (
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs font-semibold">
                              C
                            </div>
                          )}
                          {suggestion.type === 'assignee' && (
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xs font-semibold">
                              A
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
                          {suggestion.type === 'lab-code' && (
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-semibold">
                              L
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {suggestion.label}
                          </div>
                          <div className="text-gray-500 text-xs truncate">
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
          
          {/* Desktop: Status and Assignee in same row as search */}
          <div className="hidden md:flex gap-3">
            <Select value={searchValues.status || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
              <SelectTrigger className="w-40 bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                <SelectItem value="all">All Status</SelectItem>
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
            <Select value={searchValues.assignee || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, assignee: value === 'all' ? '' : value }))}>
              <SelectTrigger className="w-40 bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Mobile: Status and Assignee in second row */}
          <div className="flex md:hidden gap-3">
            <Select value={searchValues.status || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
              <SelectTrigger className="flex-1 bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                <SelectItem value="all">All Status</SelectItem>
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
            <Select value={searchValues.assignee || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, assignee: value === 'all' ? '' : value }))}>
              <SelectTrigger className="flex-1 bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Specific Search Fields */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Date Type Selection */}
          <Select value={dateType} onValueChange={setDateType}>
            <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="Select Date Type First" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60]">
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="arrival">Arrival</SelectItem>
              <SelectItem value="need-by">Need By</SelectItem>
              <SelectItem value="status-date">Status Date</SelectItem>
              <SelectItem value="last-comment">Last Comment</SelectItem>
              <SelectItem value="departure-date">Departure Date</SelectItem>
              <SelectItem value="samsara-doc-submit">Samsara Doc Submit Date</SelectItem>
            </SelectContent>
          </Select>

          {/* From Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!dateType}
                className={cn(
                  "w-full justify-start text-left font-normal bg-white border border-gray-300 rounded-lg h-11 text-sm hover:bg-gray-50 transition-all shadow-sm",
                  !dateFrom && "text-gray-500",
                  !dateType && "opacity-50 cursor-not-allowed bg-gray-50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">
                  {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg z-[70]" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className="pointer-events-auto rounded-lg p-3"
              />
            </PopoverContent>
          </Popover>

          {/* To Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!dateType}
                className={cn(
                  "w-full justify-start text-left font-normal bg-white border border-gray-300 rounded-lg h-11 text-sm hover:bg-gray-50 transition-all shadow-sm",
                  !dateTo && "text-gray-500",
                  !dateType && "opacity-50 cursor-not-allowed bg-gray-50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">
                  {dateTo ? format(dateTo, "MMM dd") : "To"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg z-[70]" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                className="pointer-events-auto rounded-lg p-3"
              />
            </PopoverContent>
          </Popover>

          {/* WO Type Selection */}
          <Select value={searchValues.woType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, woType: value === 'all' ? '' : value }))}>
            <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="All WO Types" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60]">
              <SelectItem value="all">All Workorder Types</SelectItem>
              <SelectItem value="regular">Regular Work Order</SelectItem>
              <SelectItem value="onsite">Onsite Work Order</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Selection */}
          <Select value={searchValues.priority || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, priority: value === 'all' ? '' : value }))}>
            <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60]">
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Row */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Manufacturer"
                value={searchValues.manufacturer}
                onChange={(e) => setSearchValues(prev => ({ ...prev, manufacturer: e.target.value }))}
                className="bg-white border border-gray-300 rounded-lg h-11 text-sm placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />

              <Select value={searchValues.division} onValueChange={(value) => setSearchValues(prev => ({ ...prev, division: value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Division" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Search Button at Bottom */}
      <div className="px-4 pb-4 flex justify-end">
        <Button 
          onClick={handleSearch}
          disabled={!hasActiveFilters}
          className={cn(
            "rounded-lg h-11 px-6 font-medium shadow-sm hover:shadow-md transition-all",
            hasActiveFilters 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default ModernTopSearchFilters;