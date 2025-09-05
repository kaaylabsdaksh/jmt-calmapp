import { useState } from "react";
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
  dateFrom?: Date;
  dateTo?: Date;
  dateType: string;
}

interface ModernTopSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

const ModernTopSearchFilters = ({ onSearch }: ModernTopSearchFiltersProps) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [dateType, setDateType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchValues, setSearchValues] = useState({
    woNumber: '',
    customer: '',
    status: '',
    manufacturer: '',
    priority: '',
    assignee: '',
    division: ''
  });

  const handleSearch = () => {
    const filters = {
      globalSearch,
      status: searchValues.status,
      assignee: searchValues.assignee,
      priority: searchValues.priority,
      manufacturer: searchValues.manufacturer,
      division: searchValues.division,
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
      division: ''
    });
    setDateFrom(undefined);
    setDateTo(undefined);
    setDateType('');
  };

  const hasActiveFilters = globalSearch || Object.values(searchValues).some(value => value) || dateFrom || dateTo;

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
              "rounded-lg transition-all",
              showAdvanced ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"
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
              "rounded-lg transition-all",
              hasActiveFilters 
                ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
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
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-12 bg-white border border-gray-300 rounded-lg h-11 text-sm placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          
          {/* Desktop: Status and Assignee in same row as search */}
          <div className="hidden md:flex gap-3">
            <Select value={searchValues.status || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
              <SelectTrigger className="w-40 bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-lab">In Lab</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
                <SelectItem value="in-lab">In Lab</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Date Type Selection */}
          <Select value={dateType} onValueChange={setDateType}>
            <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="Date Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
              <SelectItem value="creation-arrival">Creation & Arrival</SelectItem>
              <SelectItem value="status-comments">Status & Comments</SelectItem>
              <SelectItem value="departure-delivery">Departure & Delivery</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal bg-white border border-gray-300 rounded-lg h-11 text-sm hover:bg-gray-50 transition-all shadow-sm",
                    !dateFrom && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From"}
                </Button>
              </PopoverTrigger>
               <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="pointer-events-auto rounded-lg"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal bg-white border border-gray-300 rounded-lg h-11 text-sm hover:bg-gray-50 transition-all shadow-sm",
                    !dateTo && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {dateTo ? format(dateTo, "MMM dd, yyyy") : "To"}
                </Button>
              </PopoverTrigger>
               <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="pointer-events-auto rounded-lg"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Priority Selection */}
          <Select value={searchValues.priority || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, priority: value === 'all' ? '' : value }))}>
            <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
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
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 px-6 font-medium shadow-sm hover:shadow-md transition-all"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default ModernTopSearchFilters;