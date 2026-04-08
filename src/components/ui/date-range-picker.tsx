import * as React from "react";
import { ChevronLeft, ChevronRight, X, CalendarIcon } from "lucide-react";
import { format, addMonths, isSameDay, isAfter, isBefore, isSameMonth, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";

interface DateRangePickerProps {
  dateFrom?: Date;
  dateTo?: Date;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  className?: string;
  triggerClassName?: string;
}

function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  className,
  triggerClassName,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [leftMonth, setLeftMonth] = React.useState<Date>(
    dateFrom ? startOfMonth(dateFrom) : startOfMonth(new Date())
  );
  const [selectingEnd, setSelectingEnd] = React.useState(false);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const rightMonth = addMonths(leftMonth, 1);

  const handlePrevMonth = () => setLeftMonth(addMonths(leftMonth, -1));
  const handleNextMonth = () => setLeftMonth(addMonths(leftMonth, 1));

  const handleDayClick = (day: Date) => {
    if (!selectingEnd || !dateFrom) {
      // Selecting start date
      onDateFromChange(day);
      onDateToChange(undefined);
      setSelectingEnd(true);
      setHoverDate(null);
    } else {
      // Selecting end date
      if (isBefore(day, dateFrom)) {
        // If clicked before start, reset start
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

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateFromChange(undefined);
    onDateToChange(undefined);
    setSelectingEnd(false);
    setHoverDate(null);
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
      return `${format(dateFrom, "MMM dd, yyyy")} – ...`;
    }
    return "Select date range";
  };

  return (
    <Popover open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setSelectingEnd(false);
        setHoverDate(null);
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-7 text-[11px] border-border rounded-md px-2 group",
            !dateFrom && "text-muted-foreground",
            triggerClassName
          )}
        >
          <CalendarIcon className="mr-1.5 h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="flex-1 truncate">{displayText()}</span>
          {(dateFrom || dateTo) && (
            <X
              className="h-3 w-3 text-muted-foreground hover:text-foreground ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border shadow-xl rounded-lg z-[70]"
        align="start"
      >
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
              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={handleClear}>
                Clear dates
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
    <div
      className="select-none"
      onMouseLeave={() => onDayHover?.(null)}
    >
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
