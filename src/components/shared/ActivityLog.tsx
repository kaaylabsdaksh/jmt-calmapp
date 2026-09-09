import { useMemo, useState } from "react";
import { ChevronDown, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type ActivityEntry = {
  id: string;
  type: string;
  user: string;
  /** Display timestamp, e.g. "10/22/2025 07:19 AM" */
  ts: string;
  text: string;
};

export const DEFAULT_ACTIVITY_TYPES = ["General", "Other", "Lab", "Pricing", "Customer", "Estimate"];

export function formatActivityTimestamp(d: Date = new Date()) {
  return `${d.toLocaleDateString("en-US")} ${d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export interface ActivityLogProps {
  entries: ActivityEntry[];
  onAdd?: (entry: ActivityEntry) => void;
  types?: string[];
  title?: string;
  subtitle?: string;
  currentUser?: string;
  defaultOpen?: boolean;
  className?: string;
  /** Hide the add-comment row (read-only history) */
  readOnly?: boolean;
}

export function ActivityLog({
  entries,
  onAdd,
  types = DEFAULT_ACTIVITY_TYPES,
  title = "Activity Log",
  subtitle = "Track all changes and updates",
  currentUser = "Admin User",
  defaultOpen = true,
  className,
  readOnly = false,
}: ActivityLogProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [type, setType] = useState("");
  const [text, setText] = useState("");
  const [fType, setFType] = useState("all");
  const [fUser, setFUser] = useState("all");
  const [fDate, setFDate] = useState("all");

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) =>
          (fType === "all" || e.type === fType) &&
          (fUser === "all" || e.user === fUser) &&
          (fDate === "all" || e.ts.split(" ")[0] === fDate),
      ),
    [entries, fType, fUser, fDate],
  );

  const users = Array.from(new Set(entries.map((e) => e.user)));
  const dates = Array.from(new Set(entries.map((e) => e.ts.split(" ")[0])));

  const add = () => {
    if (!text.trim() || !onAdd) return;
    onAdd({
      id: `act-${Date.now()}`,
      type: type || "Other",
      user: currentUser,
      ts: formatActivityTimestamp(),
      text: text.trim(),
    });
    setText("");
    setType("");
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
            <MessageSquare className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setOpen((v) => !v)}>
          <ChevronDown className={cn("mr-1.5 h-4 w-4 transition-transform", open && "rotate-180")} />
          {open ? "Hide" : "Show"}
        </Button>
      </div>

      {open && (
        <CardContent className="space-y-2 px-3 pb-2.5 pt-2">
          {!readOnly && (
            <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-8 w-[180px] text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[240px] flex-1 space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Comment
                </Label>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && add()}
                  placeholder="Enter your comment..."
                  className="h-8 text-xs"
                />
              </div>
              <Button size="sm" className="h-8 text-xs" onClick={add} disabled={!text.trim()}>
                <Plus className="mr-1.5 h-4 w-4" /> Add
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Activity History</h4>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {filtered.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <div className="flex flex-wrap items-center gap-2 border-b bg-muted/30 px-3 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Quick search:
              </span>
              <Select value={fType} onValueChange={setFType}>
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fUser} onValueChange={setFUser}>
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fDate} onValueChange={setFDate}>
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  {dates.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-background text-[10px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">User</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 align-top">
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                        {c.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs font-medium">{c.user}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                      {c.ts}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-foreground">{c.text}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-xs text-muted-foreground">
                      No activity matches the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default ActivityLog;
