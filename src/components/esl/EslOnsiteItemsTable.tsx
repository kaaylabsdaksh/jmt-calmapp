import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Printer, Pencil, FileText, Filter, Ban, X } from "lucide-react";
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

export interface EslOnsiteItem {
  id: number;
  truck: string;
  mfr: string;
  cls: string;
  size: string;
  color: string;
  type: string;
  eye: string;
  eyeQty: string;
  other: string;
  holeSize: string;
  zip: boolean;
  isNew: boolean;
  stds: string;
  eslId: string;
  custId: string;
  tag: string;
  result: string;
  acc1: string;
  qty1: string;
  acc2: string;
  qty2: string;
  acc3: string;
  qty3: string;
  technician: string;
  setComment: string;
  comments: string;
  cancelled?: boolean;
}

const DEFAULT_ITEMS: EslOnsiteItem[] = [
  { id: 1, truck: "", mfr: "CHANCE", cls: "CLASS 2", size: "18x18", color: "Brown", type: "Solid", eye: "No", eyeQty: "", other: "", holeSize: "", zip: false, isNew: false, stds: "", eslId: "933672", custId: "", tag: "", result: "", acc1: "0", qty1: "0", acc2: "0", qty2: "0", acc3: "0", qty3: "0", technician: "Admin User", setComment: "", comments: "" },
  { id: 2, truck: "", mfr: "CHANCE", cls: "CLASS 2", size: "18x18", color: "Brown", type: "Solid", eye: "No", eyeQty: "", other: "", holeSize: "", zip: false, isNew: false, stds: "", eslId: "933673", custId: "", tag: "", result: "", acc1: "0", qty1: "0", acc2: "0", qty2: "0", acc3: "0", qty3: "0", technician: "Admin User", setComment: "", comments: "" },
];

const BASIC_COLUMNS = ["truck", "mfr", "cls", "size", "color", "type", "eye", "eyeQty", "other", "holeSize", "zip", "isNew", "stds", "eslId", "custId", "tag", "result", "acc1", "qty1", "acc2", "qty2", "acc3", "qty3", "technician", "setComment", "comments"] as const;
const EXTENDED_ONLY = ["stds", "result", "acc1", "qty1", "acc2", "qty2", "acc3", "qty3", "technician", "setComment", "comments"] as const;

const LABELS: Record<string, string> = {
  truck: "Truck", mfr: "Mfr", cls: "Class", size: "Size", color: "Color", type: "Type",
  eye: "Eye", eyeQty: "Eye Qty", other: "Other", holeSize: "Hole Size", zip: "Zip",
  isNew: "New", stds: "Stds", eslId: "ESL ID", custId: "Cust ID", tag: "Tag",
  result: "Result", acc1: "Acc 1", qty1: "Qty 1", acc2: "Acc 2", qty2: "Qty 2",
  acc3: "Acc 3", qty3: "Qty 3", technician: "Technician", setComment: "Set Comment", comments: "Comments",
};

export default function EslOnsiteItemsTable({ items = DEFAULT_ITEMS }: { items?: EslOnsiteItem[] }) {
  const [view, setView] = useState<"basic" | "extended">("basic");
  const [showCancelled, setShowCancelled] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [rows, setRows] = useState<EslOnsiteItem[]>(items);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState<number | null>(null);

  const columns = useMemo(
    () => (view === "extended" ? BASIC_COLUMNS : BASIC_COLUMNS.filter((c) => !EXTENDED_ONLY.includes(c as any))),
    [view]
  );

  const activeFilters = useMemo(
    () =>
      Object.entries(filters).filter(
        ([k, v]) => v && (columns as readonly string[]).includes(k)
      ),
    [filters, columns]
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (!showCancelled && r.cancelled) return false;
      return activeFilters.every(([k, v]) => {
        const raw = (r as any)[k];
        if (typeof raw === "boolean") return v === "yes" ? raw : !raw;
        return String(raw ?? "").toLowerCase().includes(v.toLowerCase().trim());
      });
    });
  }, [rows, activeFilters, showCancelled]);


  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * pageSize, current * pageSize);
  const allSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));

  const toggleRow = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const setCell = (id: number, key: keyof EslOnsiteItem, value: any) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const stickyA = view === "extended" ? "sticky left-0 z-20" : "";
  const stickyB = view === "extended" ? "sticky left-8 z-20" : "";
  const stickyC = view === "extended" ? "sticky left-[88px] z-20" : "";

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="bg-muted/50 px-3 py-1.5 border-b flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Items</span>
          <RadioGroup
            value={view}
            onValueChange={(v) => setView(v as "basic" | "extended")}
            className="flex items-center gap-3"
          >
            <label htmlFor="viewBasic" className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value="basic" id="viewBasic" className="h-3.5 w-3.5 border-slate-900 text-slate-900" />
              <span className="text-[11px]">Basic View</span>
            </label>
            <label htmlFor="viewExtended" className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value="extended" id="viewExtended" className="h-3.5 w-3.5 border-slate-900 text-slate-900" />
              <span className="text-[11px]">Extended View</span>
            </label>
          </RadioGroup>
        </div>
        <label htmlFor="showCancelledOnsite" className="flex items-center gap-1.5 cursor-pointer">
          <Checkbox
            id="showCancelledOnsite"
            checked={showCancelled}
            onCheckedChange={(c) => setShowCancelled(!!c)}
            className="h-3.5 w-3.5"
          />
          <Label htmlFor="showCancelledOnsite" className="text-[11px] cursor-pointer">Show Cancelled Items</Label>
        </label>
      </div>

      

      <div className="overflow-x-auto">
        <Table className="text-[11px]">
          <TableHeader>
            <TableRow className="bg-muted/30 h-7">
              <TableHead className={`w-8 px-1.5 py-1 h-7 text-center ${stickyA} ${view === "extended" ? "bg-muted" : ""}`}>
                <Checkbox
                  className="h-3 w-3"
                  checked={allSelected}
                  onCheckedChange={(c) =>
                    setSelected(c ? Array.from(new Set([...selected, ...pageRows.map((r) => r.id)])) : [])
                  }
                />
              </TableHead>
              <TableHead className={`w-14 text-[10px] font-medium px-1.5 py-1 h-7 ${stickyB} ${view === "extended" ? "bg-muted" : ""}`} />
              <TableHead className={`w-8 text-[10px] font-medium px-1.5 py-1 h-7 text-center ${stickyC} ${view === "extended" ? "bg-muted" : ""}`}>CI</TableHead>
              <TableHead className="w-8 text-[10px] font-medium px-1.5 py-1 h-7">#</TableHead>
              
              {columns.map((c) => (
                <TableHead key={c} className="text-[10px] font-medium px-1.5 py-1 h-7 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    {LABELS[c]}
                    <Filter
                      className={`h-2.5 w-2.5 ${filters[c] ? "text-slate-900 fill-slate-900" : "text-muted-foreground/60"}`}
                    />
                  </span>
                </TableHead>
              ))}
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Filter row */}
            <TableRow className="bg-background h-6 hover:bg-background">
              <TableCell className={`px-1 py-0.5 ${stickyA} ${view === "extended" ? "bg-background" : ""}`} />
              <TableCell className={`px-1 py-0.5 ${stickyB} ${view === "extended" ? "bg-background" : ""}`} />
              <TableCell className={`px-1 py-0.5 ${stickyC} ${view === "extended" ? "bg-background" : ""}`} />
              <TableCell className="px-1 py-0.5" />
              {columns.map((c) => (
                <TableCell key={c} className="px-1 py-0.5">
                  {c === "zip" || c === "isNew" ? (
                    <select
                      value={filters[c] || ""}
                      onChange={(e) => { setFilters((f) => ({ ...f, [c]: e.target.value })); setPage(1); }}
                      className="h-5 w-full min-w-[48px] rounded-md border border-input bg-background px-1 text-[10px]"
                      aria-label={`Filter ${LABELS[c]}`}
                    >
                      <option value="">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  ) : (
                    <div className="relative">
                      <Input
                        value={filters[c] || ""}
                        onChange={(e) => { setFilters((f) => ({ ...f, [c]: e.target.value })); setPage(1); }}
                        aria-label={`Filter ${LABELS[c]}`}
                        className={`h-5 text-[10px] px-1.5 pr-4 min-w-[52px] ${filters[c] ? "border-slate-900" : ""}`}
                      />
                      {filters[c] && (
                        <button
                          type="button"
                          aria-label={`Clear ${LABELS[c]} filter`}
                          onClick={() => { setFilters((f) => ({ ...f, [c]: "" })); setPage(1); }}
                          className="absolute right-0.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>


            {pageRows.map((r, idx) => {
              const rowBg = r.cancelled ? "bg-slate-100" : "bg-card";
              return (
              <TableRow
                key={r.id}
                className={`h-6 ${r.cancelled ? "bg-slate-100 line-through text-muted-foreground" : ""}`}
              >
                <TableCell className={`px-1.5 py-0.5 text-center ${stickyA} ${view === "extended" ? rowBg : ""}`}>
                  <Checkbox className="h-3 w-3" checked={selected.includes(r.id)} onCheckedChange={() => toggleRow(r.id)} />
                </TableCell>
                <TableCell className={`px-1.5 py-0.5 ${stickyB} ${view === "extended" ? rowBg : ""}`}>
                  <Button variant="link" size="sm" className="h-auto p-0 text-[11px] text-slate-900 underline gap-1">
                    <Pencil className="h-3 w-3" />Edit
                  </Button>
                </TableCell>
                <TableCell className={`px-1.5 py-0.5 text-center ${stickyC} ${view === "extended" ? rowBg : ""}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    title={r.cancelled ? "Item cancelled" : "Cancel item"}
                    aria-label="Cancel item"
                    disabled={r.cancelled}
                    onClick={() => setCancelId(r.id)}
                    className="h-5 w-5 p-0 text-slate-900 hover:text-red-600"
                  >
                    <Ban className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
                <TableCell className="px-1.5 py-0.5 text-muted-foreground">
                  {(current - 1) * pageSize + idx + 1}
                </TableCell>
                {columns.map((c) => (
                  <TableCell key={c} className="px-1.5 py-0.5 whitespace-nowrap">
                    {c === "zip" || c === "isNew" ? (
                      <Checkbox
                        className="h-3 w-3"
                        checked={!!(r as any)[c]}
                        onCheckedChange={(v) => setCell(r.id, c as keyof EslOnsiteItem, !!v)}
                      />
                    ) : (
                      <span>{(r as any)[c] || <span className="text-muted-foreground/40">—</span>}</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );})}

            {pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 4} className="text-center text-[11px] text-muted-foreground py-6">
                  No items match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="bg-muted/50 px-3 py-1.5 border-t flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>Page {current} of {totalPages} ({filtered.length} items)</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={current <= 1} onClick={() => setPage(current - 1)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`h-6 w-6 rounded text-[11px] ${n === current ? "bg-foreground text-background font-semibold" : "hover:bg-muted"}`}
            >
              {n}
            </button>
          ))}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={current >= totalPages} onClick={() => setPage(current + 1)}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Page size:</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="h-7 w-16 text-[11px]"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover border z-50">
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)} className="text-[11px]">{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>




      <AlertDialog open={cancelId !== null} onOpenChange={(o) => !o && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the item as cancelled. It will be hidden unless "Show Cancelled Items" is enabled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep item</AlertDialogCancel>
            <AlertDialogAction
              className="bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => {
                if (cancelId !== null) {
                  setRows((rs) => rs.map((r) => (r.id === cancelId ? { ...r, cancelled: true } : r)));
                  setSelected((s) => s.filter((x) => x !== cancelId));
                }
                setCancelId(null);
              }}
            >
              Cancel item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
