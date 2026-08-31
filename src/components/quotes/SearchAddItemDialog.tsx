import { useMemo, useState, useEffect } from "react";
import { Search, X, RotateCcw, Plus, Check, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export type AddedItemDetail = {
  qty: string;
  add17025: boolean;
  repair: boolean;
  mfrSerial: string;
  custId: string;
  custSerial: string;
};

export const emptyItemDetail = (): AddedItemDetail => ({
  qty: "1",
  add17025: false,
  repair: false,
  mfrSerial: "",
  custId: "",
  custSerial: "",
});

export type SearchAddItemResult = {
  products: Product[];
  groupAsOneLineItem: boolean;
  details: Record<string, AddedItemDetail>;
};


interface SearchAddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (result: SearchAddItemResult) => void;
}

type ExtraRow = { name: string; qty: string; cost: string };

const SERVICE_TYPES = [
  "Calibration",
  "Repair",
  "Expedite",
  "Onsite Service",
  "Data Report",
  "Cleaning",
];

const PART_TYPES = ["Battery", "Cable", "Fuse", "Sensor", "Filter", "Connector"];

const inputCls =
  "h-7 text-[11px] px-2 rounded-md bg-background border-border focus-visible:ring-1";


const SearchAddItemDialog = ({ open, onOpenChange, onAdd }: SearchAddItemDialogProps) => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [groupAsOne, setGroupAsOne] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [rowDetails, setRowDetails] = useState<Record<string, AddedItemDetail>>({});

  const detailOf = (id: string) => rowDetails[id] ?? emptyItemDetail();
  const setDetail = (id: string, patch: Partial<AddedItemDetail>) =>
    setRowDetails((prev) => ({ ...prev, [id]: { ...(prev[id] ?? emptyItemDetail()), ...patch } }));
  const [serviceDraft, setServiceDraft] = useState({ name: "", qty: "1", cost: "0.00" });
  const [partDraft, setPartDraft] = useState({ name: "", qty: "1", cost: "0.00" });
  const [serviceRows, setServiceRows] = useState<ExtraRow[]>([]);
  const [partRows, setPartRows] = useState<ExtraRow[]>([]);

  const addExtra = (kind: "service" | "part") => {
    const draft = kind === "service" ? serviceDraft : partDraft;
    if (!draft.name) return;
    if (kind === "service") {
      setServiceRows((r) => [...r, draft]);
      setServiceDraft({ name: "", qty: "1", cost: "0.00" });
    } else {
      setPartRows((r) => [...r, draft]);
      setPartDraft({ name: "", qty: "1", cost: "0.00" });
    }
  };

  const removeExtra = (kind: "service" | "part", idx: number) => {
    const setter = kind === "service" ? setServiceRows : setPartRows;
    setter((r) => r.filter((_, i) => i !== idx));
  };


  const results = useMemo(() => {
    if (!searched) return [] as Product[];
    const m = manufacturer.trim().toLowerCase();
    const mo = model.trim().toLowerCase();
    const d = description.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (!m || p.manufacturer.toLowerCase().includes(m)) &&
        (!mo || p.model.toLowerCase().includes(mo)) &&
        (!d || p.description.toLowerCase().includes(d)),
    );
  }, [searched, manufacturer, model, description]);

  const notAddedResults = results.filter((p) => !addedIds.has(p.id));
  const selectedProducts = notAddedResults.filter((p) => selected[p.id]);
  const allChecked =
    notAddedResults.length > 0 && notAddedResults.every((p) => selected[p.id]);
  const addedProducts = PRODUCTS.filter((p) => addedIds.has(p.id));

  /** Clears only the search filters/results, keeping staged items intact. */
  const clearSearch = () => {
    setManufacturer("");
    setModel("");
    setDescription("");
    setSearched(false);
    setSelected({});
  };

  const reset = () => {
    clearSearch();
    setGroupAsOne(false);
    setAddedIds(new Set());
    setServiceRows([]);
    setPartRows([]);
    setServiceDraft({ name: "", qty: "1", cost: "0.00" });
    setPartDraft({ name: "", qty: "1", cost: "0.00" });

  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      setAddedIds(new Set());
      setSelected({});
      setGroupAsOne(false);
    }
  }, [open]);

  /** Stage the currently selected rows. Nothing is sent to the quote yet. */
  const handleAdd = () => {
    if (selectedProducts.length === 0) return;
    setAddedIds((prev) => new Set([...prev, ...selectedProducts.map((p) => p.id)]));
    setRowDetails((prev) => {
      const next = { ...prev };
      selectedProducts.forEach((p) => {
        if (!next[p.id]) next[p.id] = emptyItemDetail();
      });
      return next;
    });
    setSelected({});
  };

  /** Stage a single row directly from its own Add button. */
  const handleAddRow = (p: Product) => {
    if (addedIds.has(p.id)) return;
    setAddedIds((prev) => new Set([...prev, p.id]));
    setRowDetails((prev) => (prev[p.id] ? prev : { ...prev, [p.id]: emptyItemDetail() }));
    setSelected((s) => ({ ...s, [p.id]: false }));
  };

  /** Remove a staged row before committing. */
  const handleRemoveRow = (id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setRowDetails((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  /** Commit every staged row to the quote and close. */
  const handleDone = () => {
    if (addedProducts.length === 0) return;
    onAdd({ products: addedProducts, groupAsOneLineItem: groupAsOne, details: rowDetails });
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-7xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b bg-muted/30 space-y-0.5">
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            Search / Add Item
          </DialogTitle>
          <DialogDescription className="text-[11px]">
            Find products by manufacturer, model or description and stage them below.
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="px-4 py-3 border-b">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearched(true)}
              placeholder="Manufacturer"
              className={inputCls}
            />
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearched(true)}
              placeholder="Model"
              className={inputCls}
            />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearched(true)}
              placeholder="Description"
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-nowrap">
            <Button size="sm" className="h-7 px-3 text-[11px] shrink-0" onClick={() => setSearched(true)}>
              <Search className="h-3 w-3 mr-1" />
              Find
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-[11px] shrink-0"
              onClick={clearSearch}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear
            </Button>
            {searched && (
              <div className="ml-auto flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] font-medium">
                  {results.length} result{results.length === 1 ? "" : "s"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="px-4 py-2 bg-slate-50/50 border-b">
          <div className="flex items-center gap-1.5 mb-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Findings
            </span>
          </div>
          <div className="max-h-[280px] overflow-auto rounded-md border bg-white">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                <tr>
                  {["Manufacturer", "Model", "Item Description", "Cal/Cert", "T/F", "17025", "Only Capable Location", "Status"].map(
                    (c) => (
                      <th
                        key={c}
                        className="px-2 py-1.5 text-left font-semibold whitespace-nowrap text-muted-foreground"
                      >
                        {c}
                      </th>
                    ),
                  )}
                  <th className="px-2 py-1.5 text-right font-semibold text-muted-foreground w-20">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-muted-foreground text-[11px]">
                      {searched ? "No matching products found" : "No data to display"}
                    </td>
                  </tr>
                ) : (
                  results.map((p) => {
                    const isAdded = addedIds.has(p.id);
                    return (
                      <tr
                        key={p.id}
                        className={cn(
                          "border-t",
                          isAdded
                            ? "bg-green-50/40 opacity-60 cursor-default"
                            : "hover:bg-muted/40",
                        )}
                      >
                        <td className="px-2 py-1.5 whitespace-nowrap font-medium">{p.manufacturer}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">{p.model}</td>
                        <td className="px-2 py-1.5">{p.description}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap">${p.calCost}</td>
                        <td className="px-2 py-1.5">{p.tf}</td>
                        <td className="px-2 py-1.5">{p.accredCal || "No"}</td>
                        <td className="px-2 py-1.5 max-w-[220px] truncate" title={p.locations}>
                          {p.locations || "—"}
                        </td>
                        <td className="px-2 py-1.5">
                          {isAdded ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                              <Check className="h-2.5 w-2.5" />
                              Staged
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                              <span className="h-1 w-1 rounded-full bg-emerald-600" />
                              {p.status}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <Button
                            size="sm"
                            variant={isAdded ? "ghost" : "outline"}
                            className="h-6 px-2 text-[10px]"
                            disabled={isAdded}
                            onClick={() => handleAddRow(p)}
                          >
                            {isAdded ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Staged
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Added items - only visible once something is staged */}
        {addedIds.size > 0 && (
          <div className="px-4 py-3 bg-green-50/30 border-y">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-green-600" />
                <span className="text-[11px] font-semibold text-green-800 uppercase tracking-wide">
                  Added items
                </span>
              </div>
              <Badge
                variant="default"
                className="text-[10px] font-medium bg-green-600 hover:bg-green-600 text-white"
              >
                {addedIds.size}
              </Badge>
            </div>
            <div className="max-h-[280px] overflow-auto rounded-md border bg-white divide-y">
              {addedProducts.map((p) => {
                const d = detailOf(p.id);
                return (
                  <div
                    key={p.id}
                    className="px-3 py-2.5 text-[11px] hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                      {/* Left: product identity + read-only details */}
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate" title={p.description}>
                          {p.description}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {p.manufacturer} · {p.model}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                          <span className="whitespace-nowrap">
                            Cal/Cert: <span className="font-medium text-slate-700">${p.calCost}</span>
                          </span>
                          <span className="whitespace-nowrap">
                            T/F: <span className="font-medium text-slate-700">{p.tf}</span>
                          </span>
                          <span className="whitespace-nowrap">
                            17025: <span className="font-medium text-slate-700">{p.accredCal || "No"}</span>
                          </span>
                          <span
                            className="truncate max-w-[200px]"
                            title={p.locations}
                          >
                            Loc: <span className="font-medium text-slate-700">{p.locations || "—"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: controls */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={d.qty}
                            onChange={(e) => setDetail(p.id, { qty: e.target.value })}
                            className={cn(inputCls, "h-6 w-14 text-center px-1")}
                          />
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                            <Check className="h-2.5 w-2.5" />
                            Staged
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveRow(p.id)}
                            aria-label="Remove"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <Checkbox
                              checked={d.add17025}
                              onCheckedChange={(v) => setDetail(p.id, { add17025: !!v })}
                              className="h-3.5 w-3.5"
                            />
                            <span className="text-[10px]">Add 17025</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <Checkbox
                              checked={d.repair}
                              onCheckedChange={(v) => setDetail(p.id, { repair: !!v })}
                              className="h-3.5 w-3.5"
                            />
                            <span className="text-[10px]">Repair</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Serial fields */}
                    <div className="mt-2.5 grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Mfr Serial"
                        value={d.mfrSerial}
                        onChange={(e) => setDetail(p.id, { mfrSerial: e.target.value })}
                        className={cn(inputCls, "h-6 w-full text-[10px]")}
                      />
                      <Input
                        placeholder="Cust ID"
                        value={d.custId}
                        onChange={(e) => setDetail(p.id, { custId: e.target.value })}
                        className={cn(inputCls, "h-6 w-full text-[10px]")}
                      />
                      <Input
                        placeholder="Cust Serial"
                        value={d.custSerial}
                        onChange={(e) => setDetail(p.id, { custSerial: e.target.value })}
                        className={cn(inputCls, "h-6 w-full text-[10px]")}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Services & Parts - only visible once something is staged */}
        {addedIds.size > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 py-3 border-t bg-slate-50/60">
            {(["service", "part"] as const).map((kind) => {
              const isService = kind === "service";
              const opts = isService ? SERVICE_TYPES : PART_TYPES;
              const draft = isService ? serviceDraft : partDraft;
              const setDraft = isService ? setServiceDraft : setPartDraft;
              const rows = isService ? serviceRows : partRows;
              return (
                <div key={kind} className="rounded-md border-2 border-slate-300 bg-white p-2">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                    {isService ? "Service Type" : "Part"}{" "}
                    <span className="font-normal text-muted-foreground">(to be added to each qty)</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <select
                      className={cn(inputCls, "flex-1 min-w-0 border")}
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    >
                      <option value="">Select…</option>
                      {opts.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <div>
                      <div className="text-[9px] uppercase text-muted-foreground">Qty</div>
                      <Input
                        className={cn(inputCls, "w-14")}
                        value={draft.qty}
                        onChange={(e) => setDraft({ ...draft, qty: e.target.value })}
                      />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-muted-foreground">Base Cost</div>
                      <Input
                        className={cn(inputCls, "w-20")}
                        value={draft.cost}
                        onChange={(e) => setDraft({ ...draft, cost: e.target.value })}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-[11px]"
                      disabled={!draft.name}
                      onClick={() => addExtra(kind)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 max-h-[110px] overflow-auto rounded-md border">
                    <table className="w-full text-[11px]">
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td className="py-5 text-center text-muted-foreground">No data to display</td>
                          </tr>
                        ) : (
                          rows.map((r, i) => (
                            <tr key={`${r.name}-${i}`} className="border-t">
                              <td className="px-2 py-1">{r.name}</td>
                              <td className="px-2 py-1 w-12 text-right">{r.qty}</td>
                              <td className="px-2 py-1 w-16 text-right">${r.cost}</td>
                              <td className="px-2 py-1 w-8 text-right">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-5 w-5 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeExtra(kind, i)}
                                  aria-label="Remove"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
            <div className="md:col-span-2 text-center">
              <span className="inline-block border border-destructive/40 bg-destructive/5 px-2 py-1 text-[11px] font-semibold text-destructive">
                Only items with a Qty of 1 will add the services and parts below. Grouped items no longer allow services and parts.
              </span>
            </div>
          </div>
        )}

        {/* Footer */}

        <div className="flex items-center justify-between gap-2 border-t bg-muted/20 px-4 py-2.5">
          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
            <Checkbox
              checked={groupAsOne}
              onCheckedChange={(v) => setGroupAsOne(!!v)}
              className="h-3.5 w-3.5"
            />
            Group as one line item
          </label>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 px-3 text-[11px]" onClick={close}>
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            {selectedProducts.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-[11px]"
                onClick={handleAdd}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add ({selectedProducts.length})
              </Button>
            )}
            <Button
              size="sm"
              className="h-7 px-3 text-[11px] bg-green-600 hover:bg-green-700 text-white"
              disabled={addedIds.size === 0}
              onClick={handleDone}
            >
              <Check className="h-3 w-3 mr-1" />
              Done{addedIds.size > 0 ? ` (${addedIds.size})` : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchAddItemDialog;
