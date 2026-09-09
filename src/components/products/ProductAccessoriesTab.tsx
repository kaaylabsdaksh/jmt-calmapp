import { useRef, useState } from "react";
import { Boxes, Plus, Trash2, Upload, X, FileUp, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Accessory = {
  id: string;
  sagePart: string;
  description: string;
  imageFile: string;
  costPrice: string;
  listPrice: string;
  qty: string;
  rental: boolean;
  sale: boolean;
};

const INITIAL: Accessory[] = [
  {
    id: "acc-1",
    sagePart: "SP-10241",
    description: "Test lead set, silicone, 1000V",
    imageFile: "lead-set.jpg",
    costPrice: "18.50",
    listPrice: "42.00",
    qty: "2",
    rental: true,
    sale: true,
  },
  {
    id: "acc-2",
    sagePart: "SP-33907",
    description: "Hard carrying case with foam insert",
    imageFile: "",
    costPrice: "36.00",
    listPrice: "79.00",
    qty: "1",
    rental: false,
    sale: true,
  },
];

const EMPTY: Omit<Accessory, "id"> = {
  sagePart: "",
  description: "",
  imageFile: "",
  costPrice: "",
  listPrice: "",
  qty: "",
  rental: false,
  sale: false,
};

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  action,
  children,
}: {
  icon: typeof Boxes;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <div>
              <div className="text-xs font-semibold tracking-tight">{title}</div>
              {subtitle && <div className="text-[10px] text-muted-foreground">{subtitle}</div>}
            </div>
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function ProductAccessoriesTab() {
  const [rows, setRows] = useState<Accessory[]>(INITIAL);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [importFile, setImportFile] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const reset = () => {
    setForm({ ...EMPTY });
    setAdding(false);
  };

  const handleAdd = () => {
    if (!form.sagePart.trim() || !form.description.trim()) {
      toast({
        title: "Missing information",
        description: "Sage Part # and Description are required.",
        variant: "destructive",
      });
      return;
    }
    setRows((p) => [{ id: `acc-${Date.now()}`, ...form }, ...p]);
    toast({ title: "Accessory added", description: form.description.trim() });
    reset();
  };

  const money = (v: string) => (v ? `$${Number(v || 0).toFixed(2)}` : "—");

  return (
    <div className="space-y-4">
      <SectionCard
        icon={Boxes}
        title="Accessories"
        subtitle={`${rows.length} accessor${rows.length === 1 ? "y" : "ies"} linked to this product`}
        action={
          <div className="flex items-center gap-2">
            {!adding && (
              <Button size="sm" className="h-7 text-xs" onClick={() => setAdding(true)}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Accessory
              </Button>
            )}
          </div>
        }
      >
        {adding && (
          <div className="mb-3 rounded-md border bg-muted/30 p-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <FieldLabel label="Sage Part #" required />
                <Input
                  value={form.sagePart}
                  onChange={(e) => set("sagePart", e.target.value)}
                  placeholder="SP-00000"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Cost Price" />
                <div className="relative">
                  <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
                    $
                  </span>
                  <Input
                    value={form.costPrice}
                    onChange={(e) => set("costPrice", e.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="h-8 text-xs pl-5"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="List Price" />
                <div className="relative">
                  <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
                    $
                  </span>
                  <Input
                    value={form.listPrice}
                    onChange={(e) => set("listPrice", e.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="h-8 text-xs pl-5"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel label="Qty" />
                <Input
                  value={form.qty}
                  onChange={(e) => set("qty", e.target.value)}
                  inputMode="numeric"
                  placeholder="1"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <FieldLabel label="Description" required />
                <Input
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="e.g. Test lead set, silicone, 1000V"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <FieldLabel label="Image File" />
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <Input
                      readOnly
                      value={form.imageFile}
                      placeholder="No image selected"
                      className="h-8 text-xs pr-7 cursor-pointer"
                      onClick={() => imageRef.current?.click()}
                    />
                    {form.imageFile && (
                      <button
                        type="button"
                        onClick={() => set("imageFile", "")}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs shrink-0"
                    onClick={() => imageRef.current?.click()}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Browse
                  </Button>
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) set("imageFile", f.name);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <Checkbox
                    checked={form.rental}
                    onCheckedChange={(v) => set("rental", !!v)}
                    className="h-3.5 w-3.5"
                  />
                  Rental
                </label>
                <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <Checkbox
                    checked={form.sale}
                    onCheckedChange={(v) => set("sale", !!v)}
                    className="h-3.5 w-3.5"
                  />
                  Sale
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={reset}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAdd}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                <th className="text-left font-medium px-3 py-2 w-32">Sage Part #</th>
                <th className="text-left font-medium px-3 py-2">Description</th>
                <th className="text-left font-medium px-3 py-2 w-36">Image File</th>
                <th className="text-right font-medium px-3 py-2 w-24">Cost</th>
                <th className="text-right font-medium px-3 py-2 w-24">List</th>
                <th className="text-right font-medium px-3 py-2 w-14">Qty</th>
                <th className="text-left font-medium px-3 py-2 w-32">Type</th>
                <th className="px-3 py-2 w-12" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center">
                    <Boxes className="h-5 w-5 mx-auto mb-2 text-muted-foreground/50" />
                    <div className="text-[11px] text-muted-foreground">
                      No accessories linked to this product.
                    </div>
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium text-slate-700">{r.sagePart}</td>
                  <td className="px-3 py-2">{r.description}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {r.imageFile ? (
                      <span className="inline-flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5" />
                        {r.imageFile}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{money(r.costPrice)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{money(r.listPrice)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.qty || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {r.rental && (
                        <Badge
                          variant="outline"
                          className="text-[10px] rounded-full px-2 py-0 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50"
                        >
                          Rental
                        </Badge>
                      )}
                      {r.sale && (
                        <Badge
                          variant="outline"
                          className="text-[10px] rounded-full px-2 py-0 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                        >
                          Sale
                        </Badge>
                      )}
                      {!r.rental && !r.sale && (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setRows((p) => p.filter((x) => x.id !== r.id));
                        toast({ title: "Accessory removed", description: r.description });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard icon={FileUp} title="Bulk Import" subtitle="Import accessories from a spreadsheet">
        <div className="flex flex-col sm:flex-row sm:items-end gap-2">
          <div className="space-y-1 flex-1">
            <FieldLabel label="Import File" />
            <div className="relative">
              <Input
                readOnly
                value={importFile}
                placeholder="Click here to browse for file"
                className="h-8 text-xs pr-7 cursor-pointer"
                onClick={() => importRef.current?.click()}
              />
              {importFile && (
                <button
                  type="button"
                  onClick={() => setImportFile("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <input
              ref={importRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setImportFile(f.name);
                e.target.value = "";
              }}
            />
          </div>
          <Button
            size="sm"
            className="h-8 text-xs"
            disabled={!importFile}
            onClick={() =>
              toast({ title: "Accessories imported", description: importFile })
            }
          >
            <FileUp className="h-3.5 w-3.5 mr-1.5" />
            Import Accessories
          </Button>
        </div>
        <p className={cn("text-[10px] text-muted-foreground mt-2")}>
          Accepted formats: CSV, XLS, XLSX. Columns: Sage Part #, Description, Cost, List, Qty,
          Rental, Sale.
        </p>
      </SectionCard>
    </div>
  );
}

export default ProductAccessoriesTab;
