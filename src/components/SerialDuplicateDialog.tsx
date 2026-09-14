import { AlertTriangle, History } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SerialMatchGroup } from "@/lib/serial-history";

interface SerialDuplicateDialogProps {
  open: boolean;
  groups: SerialMatchGroup[];
  accountNumber?: string;
  onOpenChange: (open: boolean) => void;
  /** User chose to keep the serial as typed. */
  onContinue: () => void;
  /** User chose to go back and fix the serial. */
  onReview: () => void;
}

export const SerialDuplicateDialog = ({
  open,
  groups,
  accountNumber,
  onOpenChange,
  onContinue,
  onReview,
}: SerialDuplicateDialogProps) => {
  const total = groups.reduce((sum, group) => sum + group.matches.length, 0);
  const hasExact = groups.some((group) => group.matches.some((match) => match.matchType === "exact"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 p-0">
        <DialogHeader className="space-y-1.5 border-b px-5 py-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-warning" />
            {hasExact ? "This serial has been here before" : "Possible duplicate serial"}
          </DialogTitle>
          <DialogDescription className="text-[11px]">
            {total} previous {total === 1 ? "record" : "records"}
            {accountNumber ? ` on account ${accountNumber}` : ""} look like what was just entered. Review before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[52vh] space-y-4 overflow-auto px-5 py-4">
          {groups.map((group) => (
            <div key={`${group.itemLabel}-${group.typedSerial}`} className="border">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">
                  {group.itemLabel} · entered serial{" "}
                  <span className="font-semibold tabular-nums text-foreground">{group.typedSerial}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {group.matches.length} match{group.matches.length === 1 ? "" : "es"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-[11px]">
                  <thead className="bg-muted/50 text-left text-muted-foreground">
                    <tr>
                      {["Match", "Serial on file", "Last seen", "WO #", "Report #", "Equipment", "Action"].map((heading) => (
                        <th key={heading} className="border-b px-2 py-1.5 font-medium">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.matches.map((match) => (
                      <tr key={`${match.entry.reportNumber}-${match.entry.serial}`} className="border-b last:border-b-0">
                        <td className="px-2 py-1.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                              match.matchType === "exact"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-warning/10 text-warning"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                match.matchType === "exact" ? "bg-destructive" : "bg-warning"
                              )}
                            />
                            {match.matchType === "exact" ? "Exact" : "Near match"}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 font-medium tabular-nums">{match.entry.serial}</td>
                        <td className="px-2 py-1.5">
                          <span className="inline-flex items-center gap-1 text-foreground">
                            <History className="h-3 w-3 text-muted-foreground" />
                            {match.age}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 tabular-nums">{match.entry.workOrder}</td>
                        <td className="px-2 py-1.5 tabular-nums">{match.entry.reportNumber}</td>
                        <td className="px-2 py-1.5">
                          {match.entry.manufacturer} {match.entry.model}
                        </td>
                        <td className="px-2 py-1.5">{match.entry.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-row justify-end gap-2 border-t bg-muted/20 px-5 py-3">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onReview}>
            Go Back and Edit
          </Button>
          <Button size="sm" className="h-8 text-xs" onClick={onContinue}>
            Continue Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SerialDuplicateDialog;
