import * as React from "react";
import { ChevronLeft, ChevronRight, X, CalendarIcon, ChevronDown } from "lucide-react";
import { format, addMonths, isSameDay, isAfter, isBefore, startOfMonth, isValid, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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

// Formats raw digits into MM/DD/YYYY while typing
function maskDate(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join("/");
}

function parseDate(value: string): Date | undefined {
  if (value.length !== 10) return undefined;
  const parsed = parse(value, "MM/dd/yyyy", new Date());
  return isValid(parsed) ? parsed : undefined;
}

function DateField({
  label,
  value,
  onChange,
  minDate,
}: {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
}) {
  const [text, setText] = React.useState(value ? format(value, "MM/dd/yyyy") : "");
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(value ? startOfMonth(value) : startOfMonth(new Date()));

  React.useEffect(() => {
    setText(value ? format(value, "MM/dd/yyyy") : "");
    if (value) setMonth(startOfMonth(value));
  }, [value]);

  const commit = (raw: string) => {
    const parsed = parseDate(raw);
    onChange(parsed);
    if (!parsed && raw.length === 0) onChange(undefined);
  };

  return (
    <div className="flex flex-1 min-w-0 items-center bg-background">
      <input
        aria-label={label}
        value={text}
        placeholder={label === "From" ? "MM/DD/YYYY" : "MM/DD/YYYY"}
        onChange={(e) => {
          const masked = maskDate(e.target.value);
          setText(masked);
          if (masked.length === 10 || masked.length === 0) commit(masked);
        }}
        onBlur={() => commit(text)}
        className="w-full min-w-0 bg-transparent px-2 text-[11px] outline-none placeholder:text-muted-foreground"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Open ${label} calendar`}
            className="flex items-center justify-center px-1.5 text-muted-foreground hover:text-foreground"
          >
            <CalendarIcon className="h-3 w-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border shadow-xl rounded-lg z-[70]" align="start">
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onMonthChange={setMonth}
            disabled={minDate ? { before: minDate } : undefined}
            onSelect={(d) => {
              onChange(d ?? undefined);
              if (d) setOpen(false);
            }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>

      </Popover>
    </div>
  );
}

function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  dateType,
  onDateTypeChange,
  dateTypeOptions,
  triggerClassName,
}: DateRangePickerProps) {
  const [typeDropdownOpen, setTypeDropdownOpen] = React.useState(false);

  const clearDates = () => {
    onDateFromChange(undefined);
    onDateToChange(undefined);
  };

  const currentTypeLabel = dateTypeOptions?.find((o) => o.value === dateType)?.label || "Created";
  const showTypeSegment = dateTypeOptions && onDateTypeChange;

  return (
    <div className={cn("flex h-7 rounded-md border border-border overflow-hidden", triggerClassName)}>
      {/* Left segment: Date Type */}
      {showTypeSegment && (
        <Popover open={typeDropdownOpen} onOpenChange={setTypeDropdownOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 px-2 text-[11px] font-medium text-foreground bg-muted/40 border-r border-border hover:bg-muted transition-colors whitespace-nowrap">
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

      {/* From date */}
      <DateField label="From" value={dateFrom} onChange={onDateFromChange} />

      <span className="flex items-center px-1 text-[11px] text-muted-foreground border-l border-r border-border">–</span>

      {/* To date */}
      <DateField label="To" value={dateTo} onChange={onDateToChange} minDate={dateFrom} />

      {/* Clear button */}
      {(dateFrom || dateTo) && (
        <button
          type="button"
          aria-label="Clear dates"
          className="flex items-center justify-center px-1.5 text-muted-foreground hover:text-foreground border-l border-border bg-background"
          onClick={clearDates}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

// Individual month grid
function MonthGrid({
  month,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onDayClick,
  onDayHover,
}: {
  month: Date;
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
                start && end && "rounded-full"
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
                  inRange && !start && !end && "text-foreground"
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
