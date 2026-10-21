import { useState } from "react";
import { ClipboardPaste, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MAX_SERIAL_PASTE_LENGTH, type reviewSerials } from "@/lib/quote-serials";

type Props = {
  value: string;
  onChange: (value: string) => void;
  review: ReturnType<typeof reviewSerials>;
  onRemove: (indices: number[]) => void;
};

export function SerialPasteField({ value, onChange, review, onRemove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = review.entries.filter((entry) => !entry.removed);
  const flagged = visible.filter((entry) => entry.issue);
  const showPreview = expanded || review.entries.length > 1 || flagged.length > 0 || !!review.error;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <Input
          aria-label="Mfr Serial"
          placeholder="Mfr Serial"
          value={value.replace(/\n/g, " ")}
          maxLength={MAX_SERIAL_PASTE_LENGTH}
          onChange={(event) => onChange(event.target.value)}
          onPaste={(event) => {
            const text = event.clipboardData.getData("text");
            if (/[\s,;]/.test(text.trim())) {
              event.preventDefault();
              onChange(text);
              setExpanded(true);
            }
          }}
          className="h-6 min-w-0 text-[10px] px-1.5 bg-background border-border focus-visible:ring-foreground/30"
        />
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label="Paste serials" title="Paste serials" onClick={() => setExpanded((current) => !current)}>
          <ClipboardPaste className="h-3.5 w-3.5" />
        </Button>
      </div>
      {showPreview && (
        <div className="space-y-2 min-w-[220px] rounded-md border bg-background p-2 text-[11px]" aria-label="Serial preview">
          <label className="block font-medium">Paste serials</label>
          <Textarea aria-label="Paste serials list" value={value} maxLength={MAX_SERIAL_PASTE_LENGTH} onChange={(event) => onChange(event.target.value)} placeholder="Serial numbers" className="min-h-20 text-xs focus-visible:ring-foreground/30" />
          <div role="status" className="font-medium">{review.entries.length} serials detected · {review.valid.length} ready</div>
          {review.error && <p role="alert" className="text-destructive">{review.error}</p>}
          {flagged.length > 0 && (
            <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => onRemove(flagged.map((entry) => entry.index))}>Remove flagged ({flagged.length})</Button>
          )}
          <div className="max-h-40 overflow-auto divide-y">
            {visible.map((entry) => (
              <div key={entry.index} className="flex items-center justify-between gap-2 py-1">
                <div className="min-w-0">
                  <div className="break-all font-mono">{entry.serial}</div>
                  <div className={entry.issue ? "text-destructive" : "text-muted-foreground"}>{entry.issue || "Ready · Qty 1"}</div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label={`Remove serial ${entry.serial} at ${entry.index + 1}`} onClick={() => onRemove([entry.index])}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {review.entries.some((entry) => entry.removed) && <div className="text-muted-foreground">{review.entries.filter((entry) => entry.removed).length} removed</div>}
        </div>
      )}
    </div>
  );
}