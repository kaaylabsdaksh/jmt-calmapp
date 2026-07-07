import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Receipt,
  Search,
  RotateCcw,
  Settings2,
  GripVertical,
  X,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BillingSpecialistFilters {
  invoicingType: string;
  workOrderType: string;
  location: string;
  division: string;
  invoiceStatus: string;
  customerGroup: string;
}

const defaultFilters: BillingSpecialistFilters = {
  invoicingType: "regular",
  workOrderType: "all",
  location: "all",
  division: "all",
  invoiceStatus: "all",
  customerGroup: "all",
};

type ColumnKey =
  | "woBatch"
  | "acctNum"
  | "srNum"
  | "customerName"
  | "rtbCount"
  | "totalCount"
  | "lastCommentDate"
  | "lastComment"
  | "minNeedByDate"
  | "minRtbDate"
  | "toShipping"
  | "salesOrder";

const ALL_COLUMNS: { key: ColumnKey; label: string; width: number }[] = [
  { key: "woBatch", label: "WO Batch", width: 110 },
  { key: "acctNum", label: "Acct #", width: 95 },
  { key: "srNum", label: "SR#", width: 95 },
  { key: "customerName", label: "Customer Name", width: 180 },
  { key: "rtbCount", label: "RTB Count", width: 100 },
  { key: "totalCount", label: "Total Count", width: 100 },
  { key: "lastCommentDate", label: "Last Comment Date", width: 130 },
  { key: "lastComment", label: "Last Comment", width: 160 },
  { key: "minNeedByDate", label: "Min Need By Date", width: 130 },
  { key: "minRtbDate", label: "Min RTB Date", width: 120 },
  { key: "toShipping", label: "To Shipping", width: 110 },
  { key: "salesOrder", label: "Sales Order", width: 110 },
];

export function BillingSpecialistView() {
  const [filters, setFilters] = useState<BillingSpecialistFilters>(defaultFilters);
  const [columnFilters, setColumnFilters] = useState<Partial<Record<ColumnKey, string>>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCols, setVisibleCols] = useState<Set<ColumnKey>>(
    new Set(ALL_COLUMNS.map((c) => c.key))
  );
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(
    ALL_COLUMNS.map((c) => c.key)
  );
  const [draggedColumnKey, setDraggedColumnKey] = useState<ColumnKey | null>(null);

  const reorderColumn = (fromKey: ColumnKey, toKey: ColumnKey) => {
    if (fromKey === toKey) return;
    setColumnOrder((prev) => {
      const next = [...prev];
      const fromIdx = next.indexOf(fromKey);
      const toIdx = next.indexOf(toKey);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const resetColumns = () => {
    setColumnOrder(ALL_COLUMNS.map((c) => c.key));
    setVisibleCols(new Set(ALL_COLUMNS.map((c) => c.key)));
    setColumnFilters({});
  };

  const orderedVisibleColumns = useMemo(
    () =>
      columnOrder
        .map((k) => ALL_COLUMNS.find((c) => c.key === k)!)
        .filter((c) => c && visibleCols.has(c.key)),
    [columnOrder, visibleCols]
  );

  const clearFilters = () => {
    setFilters(defaultFilters);
    setColumnFilters({});
    setSearchQuery("");
  };

  const updateFilter = (key: keyof BillingSpecialistFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-3 flex-1">
      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Invoicing Type</Label>
              <Select
                value={filters.invoicingType}
                onValueChange={(v) => updateFilter("invoicingType", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Work Order Type</Label>
              <Select
                value={filters.workOrderType}
                onValueChange={(v) => updateFilter("workOrderType", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Location</Label>
              <Select
                value={filters.location}
                onValueChange={(v) => updateFilter("location", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
                  <SelectItem value="houston">Houston</SelectItem>
                  <SelectItem value="norco">Norco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Division</Label>
              <Select
                value={filters.division}
                onValueChange={(v) => updateFilter("division", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="field">Field</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Invoice Status</Label>
              <Select
                value={filters.invoiceStatus}
                onValueChange={(v) => updateFilter("invoiceStatus", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delivery-ticket">Delivery Ticket</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Customer Group</Label>
              <Select
                value={filters.customerGroup}
                onValueChange={(v) => updateFilter("customerGroup", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <div className="flex gap-2">
                <Button className="flex-1 h-9">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-9"
                  onClick={clearFilters}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-3 py-2 border-b border-border flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search batches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-8 w-52 text-xs"
              />
            </div>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                  Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-0 bg-popover">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Columns</div>
                    <div className="text-[10px] text-muted-foreground">Drag to reorder</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetColumns}>
                    Reset
                  </Button>
                </div>
                <div className="max-h-80 overflow-auto py-1">
                  {columnOrder.map((key) => {
                    const def = ALL_COLUMNS.find((c) => c.key === key);
                    if (!def) return null;
                    const visible = visibleCols.has(key);
                    return (
                      <div
                        key={key}
                        draggable
                        onDragStart={(e) => {
                          setDraggedColumnKey(key);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedColumnKey) reorderColumn(draggedColumnKey, key);
                          setDraggedColumnKey(null);
                        }}
                        onDragEnd={() => setDraggedColumnKey(null)}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 hover:bg-muted/40",
                          draggedColumnKey === key && "opacity-50"
                        )}
                      >
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/60 cursor-grab active:cursor-grabbing" />
                        <Checkbox
                          checked={visible}
                          onCheckedChange={(v) => {
                            const next = new Set(visibleCols);
                            v ? next.add(key) : next.delete(key);
                            setVisibleCols(next);
                          }}
                          className="h-3.5 w-3.5"
                        />
                        <span
                          className={cn(
                            "flex-1 text-xs",
                            !visible && "text-muted-foreground line-through"
                          )}
                        >
                          {def.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="w-8 px-2 py-1.5 text-left">
                  <Checkbox aria-label="Select all" />
                </th>
                {orderedVisibleColumns.map((c) => (
                  <th
                    key={c.key}
                    style={{ minWidth: c.width }}
                    className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap"
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-border">
                <th className="w-8 px-2 py-1"></th>
                {orderedVisibleColumns.map((c) => (
                  <th key={`${c.key}-filter`} className="px-2 py-1 text-left">
                    <div className="relative">
                      <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50" />
                      <Input
                        placeholder=""
                        value={columnFilters[c.key] || ""}
                        onChange={(e) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            [c.key]: e.target.value,
                          }))
                        }
                        className="h-6 text-[10px] pl-5 pr-5 border-muted bg-muted/30 rounded-md placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/30 transition-colors"
                      />
                      {columnFilters[c.key] && (
                        <button
                          onClick={() =>
                            setColumnFilters((prev) => ({
                              ...prev,
                              [c.key]: "",
                            }))
                          }
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors"
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={orderedVisibleColumns.length + 1}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No data to display
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sticky Footer */}
      <footer className="mt-auto sticky bottom-0 z-40 bg-background px-3 py-2 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Receipt className="h-3.5 w-3.5 mr-1.5" />
            Process Invoice(s)
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Ticket className="h-3.5 w-3.5 mr-1.5" />
            Delivery Tickets
          </Button>
        </div>
      </footer>
    </div>
  );
}
