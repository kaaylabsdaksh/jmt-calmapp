import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type MultiSelectProps = {
  label?: string;
  placeholder?: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
  className?: string;
};

export function MultiSelect({
  label,
  placeholder = "All",
  options,
  values,
  onChange,
  max,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else if (!max || values.length < max) {
      onChange([...values, option]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const display =
    values.length === 0
      ? placeholder
      : values.length === 1
        ? values[0]
        : `${values.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-7 w-full items-center justify-between rounded-md border border-input bg-background px-2 text-left text-[11px] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className={cn("truncate", values.length === 0 && "text-muted-foreground")}>
            {display}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            {values.length > 0 && (
              <span
                onClick={handleClear}
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20"
              >
                <X className="h-2.5 w-2.5" />
              </span>
            )}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-popover" align="start">
        <div className="max-h-60 overflow-y-auto p-1.5">
          {label && (
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange([])}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Checkbox checked={values.length === 0} className="pointer-events-none h-3.5 w-3.5" />
            All
          </button>
          {options.map((option) => {
            const checked = values.includes(option);
            const disabled = !checked && !!max && values.length >= max;
            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() => handleToggle(option)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors",
                  checked
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <Checkbox checked={checked} className="pointer-events-none h-3.5 w-3.5" />
                {option}
              </button>
            );
          })}
        </div>
        {!!max && (
          <div className="border-t px-3 py-1.5 text-[10px] text-muted-foreground">
            Select up to {max} option{max > 1 ? "s" : ""}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
