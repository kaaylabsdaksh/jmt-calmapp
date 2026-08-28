import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ModernDatePickerProps {
  /** Selected date as a Date or ISO/parseable date string. */
  value?: Date | string;
  /** Returns the picked date as a Date (or undefined when cleared). */
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  /** Compact heights: xs = h-6, sm = h-7, md = h-8, lg = h-9. Default md. */
  size?: "xs" | "sm" | "md" | "lg";
  id?: string;
  name?: string;
}

const toDate = (v?: Date | string): Date | undefined => {
  if (!v) return undefined;
  if (v instanceof Date) return isValid(v) ? v : undefined;
  const direct = new Date(v);
  if (isValid(direct)) return direct;
  const parsed = parse(v, "MM/dd/yyyy", new Date());
  return isValid(parsed) ? parsed : undefined;
};

const sizeMap = {
  xs: { input: "h-6 text-[11px] pr-6", btn: "h-6 w-6", icon: "h-3 w-3" },
  sm: { input: "h-7 text-xs pr-7", btn: "h-7 w-7", icon: "h-3 w-3" },
  md: { input: "h-8 text-sm pr-8", btn: "h-8 w-8", icon: "h-3.5 w-3.5" },
  lg: { input: "h-10 text-sm pr-10", btn: "h-10 w-10", icon: "h-4 w-4" },
} as const;

export const ModernDatePicker = React.forwardRef<HTMLInputElement, ModernDatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "MM/DD/YYYY",
      className,
      inputClassName,
      disabled,
      size = "md",
      id,
      name,
    },
    ref
  ) => {
    const dateValue = toDate(value);
    const [text, setText] = React.useState<string>(
      dateValue ? format(dateValue, "MM/dd/yyyy") : ""
    );
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      setText(dateValue ? format(dateValue, "MM/dd/yyyy") : "");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const s = sizeMap[size];

    /** Auto-inserts slashes so typing 12252026 becomes 12/25/2026 */
    const maskInput = (raw: string) => {
      const digits = raw.replace(/\D/g, "").slice(0, 8);
      if (digits.length <= 2) return digits;
      if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    };

    const commitText = (raw: string) => {
      if (!raw.trim()) {
        onChange?.(undefined);
        return;
      }
      const parsed = parse(raw, "MM/dd/yyyy", new Date());
      if (isValid(parsed)) {
        onChange?.(parsed);
        setText(format(parsed, "MM/dd/yyyy"));
      } else {
        // revert
        setText(dateValue ? format(dateValue, "MM/dd/yyyy") : "");
      }
    };

    return (
      <div className={cn("relative w-full", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <Input
            ref={ref}
            id={id}
            name={name}
            disabled={disabled}
            value={text}
            placeholder={placeholder}
            onChange={(e) => {
              const masked = maskInput(e.target.value);
              setText(masked);
              if (masked.length === 10) {
                const parsed = parse(masked, "MM/dd/yyyy", new Date());
                if (isValid(parsed)) onChange?.(parsed);
              }
            }}
            onBlur={(e) => commitText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitText((e.target as HTMLInputElement).value);
              }
            }}
            className={cn(s.input, "tabular-nums", inputClassName)}
            inputMode="numeric"
            autoComplete="off"
          />

          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label="Open calendar"
              className={cn(
                "absolute right-0 top-0 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent",
                s.btn
              )}
            >
              <CalendarIcon className={s.icon} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover border z-50" align="end">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={(date) => {
                onChange?.(date ?? undefined);
                if (date) setOpen(false);
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
ModernDatePicker.displayName = "ModernDatePicker";
