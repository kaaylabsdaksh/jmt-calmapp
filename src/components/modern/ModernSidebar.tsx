import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, PanelLeftClose, PanelLeft, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ModernSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ModernSidebar = ({ isCollapsed, onToggleCollapse }: ModernSidebarProps) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [searchValues, setSearchValues] = useState({
    woNumber: '',
    customer: '',
    status: '',
    manufacturer: '',
    serial: '',
    division: ''
  });

  const clearAllFilters = () => {
    setSearchValues({
      woNumber: '',
      customer: '',
      status: '',
      manufacturer: '',
      serial: '',
      division: ''
    });
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = Object.values(searchValues).some(value => value) || dateFrom || dateTo;

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-50 border-r border-gray-200 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Search</h2>
              <p className="text-xs text-gray-500">Find work orders</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="w-full justify-center text-gray-500 hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 mb-4"
          >
            <X className="h-4 w-4 mr-2" />
            Clear all filters
          </Button>
        )}
      </div>

      {/* Search Form */}
      <div className="p-6 space-y-6">
        {/* Primary Search */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Work Order #"
              value={searchValues.woNumber}
              onChange={(e) => setSearchValues(prev => ({ ...prev, woNumber: e.target.value }))}
              className="bg-gray-50 border-0 rounded-xl h-12 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Customer name"
              value={searchValues.customer}
              onChange={(e) => setSearchValues(prev => ({ ...prev, customer: e.target.value }))}
              className="bg-gray-50 border-0 rounded-xl h-12 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <Select value={searchValues.status} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="bg-gray-50 border-0 rounded-xl h-12 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-0 shadow-xl rounded-xl z-50">
              <SelectItem value="in-lab">In Lab</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Date Range</Label>
          <div className="grid grid-cols-2 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-gray-50 border-0 rounded-xl h-12 text-sm hover:bg-gray-100 transition-all",
                    !dateFrom && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-0 shadow-xl rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="pointer-events-auto rounded-xl"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-gray-50 border-0 rounded-xl h-12 text-sm hover:bg-gray-100 transition-all",
                    !dateTo && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "MMM dd") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-0 shadow-xl rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="pointer-events-auto rounded-xl"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <Label className="text-sm font-medium text-gray-700">Additional Filters</Label>
          
          <div className="space-y-3">
            <Input
              placeholder="Manufacturer"
              value={searchValues.manufacturer}
              onChange={(e) => setSearchValues(prev => ({ ...prev, manufacturer: e.target.value }))}
              className="bg-gray-50 border-0 rounded-xl h-11 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />

            <Input
              placeholder="Serial number"
              value={searchValues.serial}
              onChange={(e) => setSearchValues(prev => ({ ...prev, serial: e.target.value }))}
              className="bg-gray-50 border-0 rounded-xl h-11 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />

            <Select value={searchValues.division} onValueChange={(value) => setSearchValues(prev => ({ ...prev, division: value }))}>
              <SelectTrigger className="bg-gray-50 border-0 rounded-xl h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent className="bg-white border-0 shadow-xl rounded-xl z-50">
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
                <SelectItem value="calibration">Calibration</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-medium shadow-sm hover:shadow-md transition-all">
          <Search className="h-4 w-4 mr-2" />
          Search Work Orders
        </Button>
      </div>
    </div>
  );
};

export default ModernSidebar;