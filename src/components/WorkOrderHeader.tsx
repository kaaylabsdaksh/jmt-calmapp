import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DateRangeType = 
  | "created" 
  | "arrival" 
  | "status-date" 
  | "last-comment" 
  | "departure" 
  | "need-by";

interface DateRange {
  from?: Date;
  to?: Date;
}

const WorkOrderHeader = () => {
  const [selectedDateType, setSelectedDateType] = useState<DateRangeType>("created");
  const [dateRanges, setDateRanges] = useState<Record<DateRangeType, DateRange>>({
    "created": {},
    "arrival": {},
    "status-date": {},
    "last-comment": {},
    "departure": {},
    "need-by": {}
  });

  const dateTypeLabels: Record<DateRangeType, string> = {
    "created": "Created From/To",
    "arrival": "Arrival From/To", 
    "status-date": "Status Date From/To",
    "last-comment": "Last Comment From/To",
    "departure": "Departure From/To",
    "need-by": "Need By From/To"
  };

  const dateTypeCategories = {
    "Creation & Arrival": ["created", "arrival"] as DateRangeType[],
    "Status & Comments": ["status-date", "last-comment"] as DateRangeType[],
    "Departure & Delivery": ["departure", "need-by"] as DateRangeType[]
  };

  const updateDateRange = (type: DateRangeType, field: 'from' | 'to', date: Date | undefined) => {
    setDateRanges(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: date
      }
    }));
  };

  const clearAllDates = () => {
    setDateRanges({
      "created": {},
      "arrival": {},
      "status-date": {},
      "last-comment": {},
      "departure": {},
      "need-by": {}
    });
  };

  const hasAnyDates = Object.values(dateRanges).some(range => range.from || range.to);
  const currentRange = dateRanges[selectedDateType];

  return (
    <header className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">CalMApp</h1>
            <p className="text-sm text-muted-foreground">Calibration Management and Processing Program v3.0</p>
          </div>
          
          {/* Enhanced Date Filter Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-2 border">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              
              {/* Date Type Selector */}
              <Select value={selectedDateType} onValueChange={(value) => setSelectedDateType(value as DateRangeType)}>
                <SelectTrigger className="w-[180px] h-8 bg-background">
                  <SelectValue placeholder="Select date type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {Object.entries(dateTypeCategories).map(([category, types]) => (
                    <div key={category}>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                        {category}
                      </div>
                      {types.map((type) => (
                        <SelectItem key={type} value={type} className="pl-4">
                          {dateTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-sm text-muted-foreground">:</span>
              
              {/* From Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[120px] justify-start text-left font-normal h-8 text-xs",
                      !currentRange.from && "text-muted-foreground"
                    )}
                  >
                    {currentRange.from ? format(currentRange.from, "dd/MM/yyyy") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentRange.from}
                    onSelect={(date) => updateDateRange(selectedDateType, 'from', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <span className="text-muted-foreground text-sm">to</span>

              {/* To Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[120px] justify-start text-left font-normal h-8 text-xs",
                      !currentRange.to && "text-muted-foreground"
                    )}
                  >
                    {currentRange.to ? format(currentRange.to, "dd/MM/yyyy") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentRange.to}
                    onSelect={(date) => updateDateRange(selectedDateType, 'to', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {/* Advanced Date Filter Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 flex items-center gap-1"
                  >
                    <Filter className="h-3 w-3" />
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-4" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">All Date Filters</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(dateTypeCategories).map(([category, types]) => (
                        <div key={category} className="space-y-3">
                          <h5 className="text-xs font-medium text-muted-foreground">{category}</h5>
                          <div className="grid grid-cols-1 gap-3">
                            {types.map((type) => {
                              const range = dateRanges[type];
                              return (
                                <div key={type} className="flex items-center gap-3">
                                  <Label className="text-xs w-32 shrink-0">{dateTypeLabels[type]}</Label>
                                  <div className="flex items-center gap-2">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={cn(
                                            "w-24 h-7 text-xs justify-start",
                                            !range.from && "text-muted-foreground"
                                          )}
                                        >
                                          {range.from ? format(range.from, "dd/MM") : "From"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={range.from}
                                          onSelect={(date) => updateDateRange(type, 'from', date)}
                                          initialFocus
                                          className="p-3 pointer-events-auto"
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <span className="text-xs text-muted-foreground">to</span>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={cn(
                                            "w-24 h-7 text-xs justify-start",
                                            !range.to && "text-muted-foreground"
                                          )}
                                        >
                                          {range.to ? format(range.to, "dd/MM") : "To"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={range.to}
                                          onSelect={(date) => updateDateRange(type, 'to', date)}
                                          initialFocus
                                          className="p-3 pointer-events-auto"
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Clear button */}
              {hasAnyDates && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllDates}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">JM Test Systems</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Pricing History
              </Button>
              <Button variant="outline" size="sm">
                User Guide
              </Button>
              <Button variant="secondary" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkOrderHeader;