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

export type SearchAddItemResult = {
  products: Product[];
  groupAsOneLineItem: boolean;
};

interface SearchAddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (result: SearchAddItemResult) => void;
}

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
    setSelected({});
  };

  /** Stage a single row directly from its own Add button. */
  const handleAddRow = (p: Product) => {
    if (addedIds.has(p.id)) return;
    setAddedIds((prev) => new Set([...prev, p.id]));
    setSelected((s) => ({ ...s, [p.id]: false }));
  };

  /** Remove a staged row before committing. */
  const handleRemoveRow = (id: string) => {
    setAddedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  /** Commit every staged row to the quote and close. */
  const handleDone = () => {
    if (addedProducts.length === 0) return;
    onAdd({ products: addedProducts, groupAsOneLineItem: groupAsOne });
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden">
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
          <div className="flex items-center gap-1.5 mt-2">
            <Button size="sm" className="h-7 px-3 text-[11px]" onClick={() => setSearched(true)}>
              <Search className="h-3 w-3 mr-1" />
              Find
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-[11px]"
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
                  <th className="w-8 px-2 py-1.5">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={(v) =>
                        setSelected(
                          v
                            ? Object.fromEntries(notAddedResults.map((p) => [p.id, true]))
                            : {},
                        )
                      }
                      aria-label="Select all"
                      className="h-3.5 w-3.5"
                      disabled={notAddedResults.length === 0}
                    />
                  </th>
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
                    <td colSpan={10} className="py-10 text-center text-muted-foreground text-[11px]">
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
                            : "hover:bg-muted/40 cursor-pointer",
                        )}
                        onClick={() =>
                          !isAdded && setSelected((s) => ({ ...s, [p.id]: !s[p.id] }))
                        }
                      >
                        <td className="px-2 py-1.5" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isAdded || !!selected[p.id]}
                            onCheckedChange={(v) =>
                              !isAdded && setSelected((s) => ({ ...s, [p.id]: !!v }))
                            }
                            disabled={isAdded}
                            className="h-3.5 w-3.5"
                          />
                        </td>
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
                        <td className="px-2 py-1.5 text-right" onClick={(e) => e.stopPropagation()}>
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

        {/* Added items */}
        <div className="px-4 py-3 bg-green-50/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-600" />
              <span className="text-[11px] font-semibold text-green-800 uppercase tracking-wide">
                Added items
              </span>
            </div>
            <Badge
              variant={addedIds.size > 0 ? "default" : "secondary"}
              className={cn(
                "text-[10px] font-medium",
                addedIds.size > 0 && "bg-green-600 hover:bg-green-600 text-white",
              )}
            >
              {addedIds.size}
            </Badge>
          </div>
          <div className="max-h-[160px] overflow-auto rounded-md border bg-white">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                <tr>
                  {["Manufacturer", "Model", "Item Description", "Cal/Cert", "T/F", "17025", "Only Capable Location", "Status"].map((c) => (
                    <th key={c} className="px-2 py-1.5 text-left font-semibold whitespace-nowrap text-muted-foreground">
                      {c}
                    </th>
                  ))}
                  <th className="px-2 py-1.5 w-10" />
                </tr>
              </thead>
              <tbody>
                {addedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-muted-foreground text-[11px]">
                      No data to display
                    </td>
                  </tr>
                ) : (
                  addedProducts.map((p) => (
                    <tr key={p.id} className="border-t bg-green-50/40">
                      <td className="px-2 py-1 whitespace-nowrap font-medium">{p.manufacturer}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{p.model}</td>
                      <td className="px-2 py-1">{p.description}</td>
                      <td className="px-2 py-1 whitespace-nowrap">${p.calCost}</td>
                      <td className="px-2 py-1">{p.tf}</td>
                      <td className="px-2 py-1">{p.accredCal || "No"}</td>
                      <td className="px-2 py-1 max-w-[220px] truncate" title={p.locations}>
                        {p.locations || "—"}
                      </td>
                      <td className="px-2 py-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                          <Check className="h-2.5 w-2.5" />
                          Staged
                        </span>
                      </td>
                      <td className="px-2 py-1 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveRow(p.id)}
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

        {/* Services & Parts */}
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
