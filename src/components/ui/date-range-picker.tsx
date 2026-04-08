import * as React from "react";
import { ChevronLeft, ChevronRight, X, CalendarIcon, ChevronDown } from "lucide-react";
import { format, addMonths, isSameDay, isAfter, isBefore, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

interface DateTypeOption {
  value: string;
  label: string;
}

interface DateRangePickerProps {
  dateFrom?: Date;
  dateTo?: Date;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  dateType?: string;
  onDateTypeChange?: (value: string) => void;
  dateTypeOptions?: DateTypeOption[];
  className?: string;
  triggerClassName?: string;
}

function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  dateType,
  onDateTypeChange,
  dateTypeOptions,
  className,
  triggerClassName,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [leftMonth, setLeftMonth] = React.useState<Date>(
    dateFrom ? startOfMonth(dateFrom) : startOfMonth(new Date())
  );
  const [selectingEnd, setSelectingEnd] = React.useState(false);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const [typeDropdownOpen, setTypeDropdownOpen] = React.useState(false);

  const rightMonth = addMonths(leftMonth, 1);

  const handlePrevMonth = () => setLeftMonth(addMonths(leftMonth, -1));
  const handleNextMonth = () => setLeftMonth(addMonths(leftMonth, 1));

  const handleDayClick = (day: Date) => {
    if (!selectingEnd || !dateFrom) {
      onDateFromChange(day);
      onDateToChange(undefined);
      setSelectingEnd(true);
      setHoverDate(null);
    } else {
      if (isBefore(day, dateFrom)) {
        onDateFromChange(day);
        onDateToChange(undefined);
        setSelectingEnd(true);
      } else {
        onDateToChange(day);
        setSelectingEnd(false);
        setOpen(false);
      }
    }
  };

  const clearDates = () => {
    onDateFromChange(undefined);
    onDateToChange(undefined);
    setSelectingEnd(false);
    setHoverDate(null);
    setOpen(false);
  };

  const isInRange = (day: Date) => {
    if (!dateFrom) return false;
    const end = dateTo || (selectingEnd && hoverDate ? hoverDate : null);
    if (!end) return false;
    return isAfter(day, dateFrom) && isBefore(day, end);
  };

  const isRangeStart = (day: Date) => dateFrom && isSameDay(day, dateFrom);
  const isRangeEnd = (day: Date) => {
    if (dateTo) return isSameDay(day, dateTo);
    if (selectingEnd && hoverDate) return isSameDay(day, hoverDate);
    return false;
  };

  const displayText = () => {
    if (dateFrom && dateTo) {
      return `${format(dateFrom, "MMM dd")} – ${format(dateTo, "MMM dd, yyyy")}`;
    }
    if (dateFrom) {
      return `${format(dateFrom, "MMM dd")} – ...`;
    }
    return "Select date range";
  };

  const currentTypeLabel = dateTypeOptions?.find(o => o.value === dateType)?.label || "Created";
  const showTypeSegment = dateTypeOptions && onDateTypeChange;

  return (
    <div className={cn("flex h-7 rounded-md border border-border overflow-hidden", triggerClassName)}>
      {/* Left segment: Date Type */}
      {showTypeSegment && (
        <Popover open={typeDropdownOpen} onOpenChange={setTypeDropdownOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-1 px-2 text-[11px] font-medium text-foreground bg-muted/40 border-r border-border hover:bg-muted transition-colors whitespace-nowrap"
            >
              {currentTypeLabel}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-1 border shadow-lg rounded-md z-[80]" align="start">
            {dateTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onDateTypeChange(option.value);
                  setTypeDropdownOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-[11px] rounded-sm transition-colors hover:bg-muted",
                  dateType === option.value && "bg-accent font-medium"
                )}
              >
                {option.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}

      {/* Right segment: Date Range */}
      <Popover open={open} onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setSelectingEnd(false);
          setHoverDate(null);
        }
      }}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex-1 flex items-center px-2 text-[11px] text-left bg-background hover:bg-background transition-colors min-w-0",
              !dateFrom && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1.5 h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 truncate">{displayText()}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border shadow-xl rounded-lg z-[70]" align="start">
          <div className={cn("p-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={handlePrevMonth}
                className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0 opacity-60 hover:opacity-100")}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-8">
                <span className="text-sm font-semibold">{format(leftMonth, "MMMM yyyy")}</span>
                <span className="text-sm font-semibold">{format(rightMonth, "MMMM yyyy")}</span>
              </div>
              <button
                onClick={handleNextMonth}
                className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0 opacity-60 hover:opacity-100")}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Two calendars side by side */}
            <div className="flex gap-6">
              <MonthGrid
                month={leftMonth}
                dateFrom={dateFrom}
                dateTo={dateTo}
                isInRange={isInRange}
                isRangeStart={isRangeStart}
                isRangeEnd={isRangeEnd}
                onDayClick={handleDayClick}
                onDayHover={selectingEnd ? setHoverDate : undefined}
              />
              <MonthGrid
                month={rightMonth}
                dateFrom={dateFrom}
                dateTo={dateTo}
                isInRange={isInRange}
                isRangeStart={isRangeStart}
                isRangeEnd={isRangeEnd}
                onDayClick={handleDayClick}
                onDayHover={selectingEnd ? setHoverDate : undefined}
              />
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex gap-3">
                <div className="text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">From:</span>{" "}
                  {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "—"}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">To:</span>{" "}
                  {dateTo ? format(dateTo, "MMM dd, yyyy") : "—"}
                </div>
              </div>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={clearDates}>
                  Clear dates
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear button */}
      {(dateFrom || dateTo) && (
        <span
          className="flex items-center justify-center px-1.5 text-muted-foreground hover:text-foreground cursor-pointer border-l border-border bg-background"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            clearDates();
          }}
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </div>
  );
}

// Individual month grid
function MonthGrid({
  month,
  dateFrom,
  dateTo,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onDayClick,
  onDayHover,
}: {
  month: Date;
  dateFrom?: Date;
  dateTo?: Date;
  isInRange: (day: Date) => boolean;
  isRangeStart: (day: Date) => boolean;
  isRangeEnd: (day: Date) => boolean;
  onDayClick: (day: Date) => void;
  onDayHover?: ((day: Date | null) => void) | undefined;
}) {
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const year = month.getFullYear();
  const mo = month.getMonth();
  const firstDay = new Date(year, mo, 1).getDay();
  const daysInMonth = new Date(year, mo + 1, 0).getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, mo, d));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="select-none" onMouseLeave={() => onDayHover?.(null)}>
      <div className="grid grid-cols-7 gap-0 mb-1">
        {weekdays.map((d, i) => (
          <div key={i} className="w-9 h-7 flex items-center justify-center text-[11px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="w-9 h-9" />;

          const inRange = isInRange(day);
          const start = isRangeStart(day);
          const end = isRangeEnd(day);
          const isToday = isSameDay(day, today);
          const isPast = isBefore(day, today) && !isSameDay(day, today);

          return (
            <div
              key={day.getTime()}
              className={cn(
                "relative w-9 h-9",
                inRange && "bg-accent",
                start && "rounded-l-full bg-accent",
                end && "rounded-r-full bg-accent",
                start && end && "rounded-full",
              )}
            >
              <button
                onClick={() => onDayClick(day)}
                onMouseEnter={() => onDayHover?.(day)}
                className={cn(
                  "w-9 h-9 flex items-center justify-center text-xs rounded-full transition-colors relative z-10",
                  "hover:bg-primary/10",
                  isPast && "text-muted-foreground/50",
                  isToday && !start && !end && "bg-accent text-accent-foreground font-semibold",
                  (start || end) && "bg-primary text-primary-foreground font-semibold hover:bg-primary/90",
                  inRange && !start && !end && "text-foreground",
                )}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { DateRangePicker };
