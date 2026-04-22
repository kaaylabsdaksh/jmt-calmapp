import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  ArrowRightLeft,
  LogIn,
  ScanLine,
  Search,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle2,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { cn } from "@/lib/utils";

type StdRow = {
  id: string;
  acct: string;
  stdNo: string;
  manufacturer: string;
  model: string;
  description: string;
  nextCalDate: string; // ISO yyyy-mm-dd
  checkedOut: string;
  checkedIn: string;
};

const MANUFACTURERS = ["Fluke", "Megger", "Hipotronics", "AEMC", "Hioki"];
const MODELS = ["87V", "MIT525", "OC60E", "1060", "DT4256"];
const DESCRIPTIONS = ["Multimeter", "Insulation Tester", "Hipot Tester", "Megohmeter", "Clamp Meter"];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const fakeRowFromStd = (stdNo: string): StdRow => {
  const h = hash(stdNo);
  const today = new Date();
  const offsetDays = (h % 120) - 30; // -30..+89 days from today
  const next = new Date(today);
  next.setDate(today.getDate() + offsetDays);
  const iso = next.toISOString().slice(0, 10);
  const acctSeed = (h % 9000) + 1000;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    acct: `${acctSeed}.00`,
    stdNo,
    manufacturer: MANUFACTURERS[h % MANUFACTURERS.length],
    model: MODELS[(h >> 3) % MODELS.length],
    description: DESCRIPTIONS[(h >> 5) % DESCRIPTIONS.length],
    nextCalDate: iso,
    checkedOut: today.toLocaleDateString(),
    checkedIn: "—",
  };
};

const calStatus = (iso: string): { label: string; tone: "ok" | "warn" | "bad" } => {
  if (!iso || iso === "—") return { label: "—", tone: "ok" };
  const now = new Date();
  const target = new Date(iso);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Overdue", tone: "bad" };
  if (diff <= 14) return { label: `${diff}d`, tone: "warn" };
  return { label: `${diff}d`, tone: "ok" };
};

const VehicleStandards = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const projectNo = params.get("project") || "0007001";
  const vehicle = params.get("vehicle") || "001";

  const inputRef = useRef<HTMLInputElement>(null);
  const [scanInput, setScanInput] = useState("");
  const [rows, setRows] = useState<StdRow[]>([]);
  const [transferTo, setTransferTo] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const VEHICLE_OPTIONS = ["Van 12", "Truck 7", "Trailer 3", "Service Van 4", "Box Truck 9"].filter(
    (v) => v !== vehicle,
  );

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      [r.acct, r.stdNo, r.manufacturer, r.model, r.description]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  const stats = useMemo(() => {
    let overdue = 0;
    let dueSoon = 0;
    rows.forEach((r) => {
      const s = calStatus(r.nextCalDate);
      if (s.tone === "bad") overdue++;
      else if (s.tone === "warn") dueSoon++;
    });
    return { total: rows.length, overdue, dueSoon };
  }, [rows]);

  const allFilteredSelected =
    filteredRows.length > 0 && filteredRows.every((r) => selectedIds.has(r.id));
  const someFilteredSelected =
    filteredRows.some((r) => selectedIds.has(r.id)) && !allFilteredSelected;

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredRows.forEach((r) => next.delete(r.id));
      } else {
        filteredRows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleScanEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const value = scanInput.trim();
    if (!value) return;
    if (rows.some((r) => r.stdNo === value)) {
      toast({
        title: "Already added",
        description: `Std # ${value} is already in this vehicle.`,
      });
      setScanInput("");
      return;
    }
    const row = fakeRowFromStd(value);
    setRows((prev) => [row, ...prev]);
    setLastAddedId(row.id);
    setScanInput("");
    toast({ title: "Standard added", description: `${row.stdNo} — ${row.description}` });
    setTimeout(() => setLastAddedId((id) => (id === row.id ? null : id)), 1500);
  };

  const handleDelete = () => {
    setRows((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    toast({ title: `Removed ${selectedIds.size} standard${selectedIds.size === 1 ? "" : "s"}` });
    setSelectedIds(new Set());
    setConfirmDelete(false);
  };

  const handleTransfer = () => {
    if (!transferTo || selectedIds.size === 0) return;
    const count = selectedIds.size;
    setRows((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    toast({
      title: "Transferred",
      description: `${count} standard${count === 1 ? "" : "s"} sent to ${transferTo}.`,
    });
    setSelectedIds(new Set());
    setTransferTo("");
  };

  const selectionCount = selectedIds.size;

  return (
    <div className="min-h-screen bg-muted/20">
      <ModernTopNav />
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        {/* Header card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-foreground/10 text-foreground flex items-center justify-center">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Standards for vehicle
                  </div>
                  <div className="text-lg font-semibold leading-tight">{vehicle}</div>
                  <div className="text-xs text-muted-foreground">
                    Project #{" "}
                    <span className="font-medium text-foreground">{projectNo}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-background">
                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="text-sm font-semibold">{stats.total}</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md border",
                    stats.dueSoon > 0
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900"
                      : "bg-background",
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      "h-3.5 w-3.5",
                      stats.dueSoon > 0 ? "text-amber-600" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-xs text-muted-foreground">Due soon</span>
                  <span className="text-sm font-semibold">{stats.dueSoon}</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md border",
                    stats.overdue > 0
                      ? "bg-destructive/10 border-destructive/30"
                      : "bg-background",
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      "h-3.5 w-3.5",
                      stats.overdue > 0 ? "text-destructive" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-xs text-muted-foreground">Overdue</span>
                  <span className="text-sm font-semibold">{stats.overdue}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[280px]">
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1 block">
                  Scan or enter Std #
                </Label>
                <div className="relative">
                  <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyDown={handleScanEnter}
                    className="h-9 pl-9 text-sm"
                    placeholder="Scan RFID or type Std # and press Enter"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Tip: keep the scanner focused — entries appear at the top of the list.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={
                        allFilteredSelected
                          ? true
                          : someFilteredSelected
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Acct #</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Std #</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Manufacturer</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Model</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Description</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Next Cal</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Checked Out</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Checked In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ScanLine className="h-8 w-8 opacity-40" />
                        <div className="text-sm font-medium">
                          {rows.length === 0 ? "No standards added yet" : "No matches"}
                        </div>
                        <div className="text-xs">
                          {rows.length === 0
                            ? "Scan an RFID tag or enter a Std # above to get started."
                            : "Try a different search term."}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((r) => {
                    const status = calStatus(r.nextCalDate);
                    const isSelected = selectedIds.has(r.id);
                    return (
                      <TableRow
                        key={r.id}
                        data-state={isSelected ? "selected" : undefined}
                        className={cn(
                          "cursor-pointer",
                          lastAddedId === r.id && "animate-in fade-in slide-in-from-top-1",
                        )}
                        onClick={() => toggleRow(r.id)}
                      >
                        <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(r.id)}
                            aria-label={`Select ${r.stdNo}`}
                          />
                        </TableCell>
                        <TableCell className="py-2 text-xs">{r.acct}</TableCell>
                        <TableCell className="py-2 text-xs font-medium">{r.stdNo}</TableCell>
                        <TableCell className="py-2 text-xs">{r.manufacturer}</TableCell>
                        <TableCell className="py-2 text-xs">{r.model}</TableCell>
                        <TableCell className="py-2 text-xs">{r.description}</TableCell>
                        <TableCell className="py-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span>{r.nextCalDate}</span>
                            {status.label !== "—" && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "h-5 text-[10px] px-1.5",
                                  status.tone === "bad" &&
                                    "bg-destructive text-destructive-foreground",
                                  status.tone === "warn" &&
                                    "bg-amber-500 text-white",
                                  status.tone === "ok" &&
                                    "bg-emerald-600 text-white",
                                )}
                              >
                                {status.label}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-xs">{r.checkedOut}</TableCell>
                        <TableCell className="py-2 text-xs">{r.checkedIn}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sticky footer (inside content area, respects sidebar) */}
        <div className="sticky bottom-0 -mx-6 mt-4 border-t bg-background/95 backdrop-blur z-30">
          <div className="px-6 py-2 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              {filteredRows.length} of {rows.length} std{rows.length === 1 ? "" : "s"}
              {selectionCount > 0 && (
                <>
                  {" "}
                  · <span className="text-foreground font-medium">{selectionCount} selected</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectionCount > 0 && (
                <>
                  <Select value={transferTo} onValueChange={setTransferTo}>
                    <SelectTrigger className="h-7 w-44 text-xs">
                      <SelectValue placeholder="Transfer to vehicle…" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_OPTIONS.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={!transferTo}
                    onClick={handleTransfer}
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5 mr-1" /> Transfer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs text-destructive hover:text-destructive"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    Clear
                  </Button>
                  <div className="h-5 w-px bg-border mx-1" />
                </>
              )}
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  toast({
                    title: "Checked in",
                    description: `${rows.length} standard${rows.length === 1 ? "" : "s"} ready for check-in.`,
                  })
                }
                disabled={rows.length === 0}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Go to Checkin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm delete */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove selected standards?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectionCount} standard{selectionCount === 1 ? "" : "s"} will be removed from
              vehicle {vehicle}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VehicleStandards;
