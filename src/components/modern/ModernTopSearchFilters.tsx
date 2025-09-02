import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ModernTopSearchFilters = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      {/* Main Search Row */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          {/* Primary Search Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Work Order #"
              value={searchValues.woNumber}
              onChange={(e) => setSearchValues(prev => ({ ...prev, woNumber: e.target.value }))}
              className="bg-gray-50 border-0 rounded-xl h-11 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            
            <Input
              placeholder="Customer name"
              value={searchValues.customer}
              onChange={(e) => setSearchValues(prev => ({ ...prev, customer: e.target.value }))}
              className="bg-gray-50 border-0 rounded-xl h-11 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            
            <Select value={searchValues.status} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-gray-50 border-0 rounded-xl h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-0 shadow-xl rounded-xl z-50">
                <SelectItem value="in-lab">In Lab</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal bg-gray-50 border-0 rounded-xl h-11 text-sm hover:bg-gray-100 transition-all",
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
                      "flex-1 justify-start text-left font-normal bg-gray-50 border-0 rounded-xl h-11 text-sm hover:bg-gray-100 transition-all",
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

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "rounded-xl transition-all",
                showAdvanced ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 rounded-xl"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}

            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-medium shadow-sm hover:shadow-md transition-all">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Advanced Filters Row */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        )}
      </div>
    </div>
  );
};

export default ModernTopSearchFilters;