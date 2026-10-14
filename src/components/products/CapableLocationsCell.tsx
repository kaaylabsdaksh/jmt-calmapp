import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCapabilitySelection } from "@/hooks/use-capability-selection";
import { selectedCapabilities, type CapabilitySelection } from "@/lib/capable-locations";

export default function CapableLocationsCell({ selectionKey, fallback = { matrix: {}, notes: {} }, selection: override }: { selectionKey: string; fallback?: CapabilitySelection; selection?: CapabilitySelection }) {
  const [open, setOpen] = useState(false);
  const stored = useCapabilitySelection(selectionKey, fallback);
  const selection = override ?? stored;
  const locations = selectedCapabilities(selection.matrix, selection.notes);
  if (!locations.length) return <span className="whitespace-nowrap text-muted-foreground">None selected</span>;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="link" className="h-6 p-0 text-xs text-foreground underline underline-offset-2" aria-label={`View capable locations for ${selectionKey}`}>
          View ({locations.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 max-w-[calc(100vw-2rem)] p-0" aria-label="Capable locations">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h2 className="text-sm font-semibold">Capable Locations ({locations.length})</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close capable locations" onClick={() => setOpen(false)}><X /></Button>
        </div>
        <ul className="max-h-80 overflow-y-auto divide-y divide-border">
          {locations.map(({ location, services, note }) => (
            <li key={location} className="space-y-1 px-3 py-2.5">
              <div className="text-xs font-semibold">{location}</div>
              <div className="text-xs leading-relaxed text-muted-foreground">{services.join(" / ")}</div>
              {note && <p className="break-words text-xs text-muted-foreground">{note}</p>}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}