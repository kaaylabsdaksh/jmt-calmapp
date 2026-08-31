import { useMemo, useState, useEffect } from "react";
import { Search, X, RotateCcw, Plus, Check } from "lucide-react";
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

  const reset = () => {
    setManufacturer("");
    setModel("");
    setDescription("");
    setSearched(false);
    setSelected({});
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

  const handleAdd = () => {
    if (selectedProducts.length === 0) return;
    onAdd({ products: selectedProducts, groupAsOneLineItem: groupAsOne });
    // Mark the just-added products as added inside this dialog and keep it open.
    setAddedIds((prev) => new Set([...prev, ...selectedProducts.map((p) => p.id)]));
    setSelected({});
    setGroupAsOne(false);
  };

  /** Add a single row directly from its own Add button. */
  const handleAddRow = (p: Product) => {
    if (addedIds.has(p.id)) return;
    onAdd({ products: [p], groupAsOneLineItem: false });
    setAddedIds((prev) => new Set([...prev, p.id]));
    setSelected((s) => ({ ...s, [p.id]: false }));
  };

  const addedProducts = PRODUCTS.filter((p) => addedIds.has(p.id));


  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b bg-muted/30 space-y-0.5">
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            Search / Add Item
          </DialogTitle>
          <DialogDescription className="text-[11px]">
            Find products by manufacturer, model or description and add them to the quote.
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
              onClick={reset}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear
            </Button>
            {searched && (
              <div className="ml-auto flex items-center gap-1.5">
                {addedIds.size > 0 && (
                  <Badge className="bg-green-600/10 text-green-700 hover:bg-green-600/10 text-[10px] font-medium">
                    {addedIds.size} added
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px] font-medium">
                  {results.length} result{results.length === 1 ? "" : "s"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[340px] overflow-auto">
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
                            Added
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                            <span className="h-1 w-1 rounded-full bg-emerald-600" />
                            {p.status}
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1 text-right" onClick={(e) => e.stopPropagation()}>
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
                              Added
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

        {/* Added items */}
        <div className="border-t">
          <div className="flex items-center justify-between px-4 py-1.5 bg-muted/30">
            <span className="text-[11px] font-semibold">Added items</span>
            <Badge variant="secondary" className="text-[10px] font-medium">
              {addedProducts.length}
            </Badge>
          </div>
          <div className="max-h-[160px] overflow-auto">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                <tr>
                  {["Manufacturer", "Model", "Item Description", "Cal/Cert", "T/F", "17025", "Only Capable Location", "Status"].map((c) => (
                    <th key={c} className="px-2 py-1.5 text-left font-semibold whitespace-nowrap text-muted-foreground">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {addedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-muted-foreground text-[11px]">
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
                          Added
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
            <Button
              size="sm"
              className="h-7 px-3 text-[11px] bg-green-600 hover:bg-green-700 text-white"
              disabled={selectedProducts.length === 0}
              onClick={handleAdd}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add {selectedProducts.length > 0 ? `(${selectedProducts.length})` : ""}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchAddItemDialog;
