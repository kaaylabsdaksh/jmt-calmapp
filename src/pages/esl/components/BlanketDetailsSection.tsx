import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Printer,
  Filter,
  FileEdit,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Pencil,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BlanketRow {
  id: number;
  truck: string;
  mfr: string;
  class: string;
  size: string;
  color: string;
  type: string;
  eye: string;
  eyeQty?: string;
  other?: string;
  holeSize?: string;
  zip: boolean;
  isNew: boolean;
  stds: number;
  eslId: string;
  custId?: string;
  tag?: string;
  result?: "PASS" | "FAIL" | "";
  failCount?: number;
  comments?: string;
}

const seedRows: BlanketRow[] = [
  { id: 1, truck: "213-1", mfr: "HASTINGS", class: "CLASS 4", size: "36x36", color: "Yellow", type: "Solid", eye: "No", zip: false, isNew: false, stds: 0, eslId: "2350466", result: "PASS" },
  { id: 2, truck: "213-2", mfr: "SALISBURY", class: "CLASS 4", size: "22x22", color: "Orange", type: "Solid", eye: "No", zip: false, isNew: false, stds: 0, eslId: "2350467", tag: "See 213-7", result: "FAIL", failCount: 1 },
  { id: 3, truck: "213-3", mfr: "SALISBURY", class: "CLASS 4", size: "22x22", color: "Orange", type: "Solid", eye: "No", zip: false, isNew: false, stds: 0, eslId: "2350468" },
  { id: 4, truck: "213-4", mfr: "SALISBURY", class: "CLASS 4", size: "22x22", color: "Orange", type: "Solid", eye: "No", zip: false, isNew: false, stds: 0, eslId: "2350469" },
  { id: 5, truck: "213-5", mfr: "SALISBURY", class: "CLASS 4", size: "22x22", color: "Orange", type: "Solid", eye: "No", zip: false, isNew: false, stds: 0, eslId: "2350470" },
  { id: 6, truck: "213-6", mfr: "SALISBURY", class: "CLASS 4", size: "22x22", color: "Orange", type: "Solid", eye: "No", zip: false, isNew: false, stds: 0, eslId: "2350471" },
  { id: 7, truck: "213-7", mfr: "SALISBURY", class: "CLASS 2", size: "22x22", color: "Black", type: "Slotted", eye: "No", zip: false, isNew: true, stds: 0, eslId: "2350472", tag: "Replace for 213-2" },
];

const BLANKET_TYPES = ["Class 0", "Class 1", "Class 2", "Class 3", "Class 4"];
const MANUFACTURERS = ["HASTINGS", "SALISBURY", "NOVAX", "OEL"];
const COLORS = ["Yellow", "Orange", "Black", "Red", "Blue"];
const SIZES = ["18x36", "22x22", "36x36", "36x72"];
const TYPES = ["Solid", "Slotted", "Eyelet"];
const ACCESSORY_OPTIONS = ["Clamp", "Pin", "Strap", "Cover"];

export const BlanketDetailsSection = () => {
  // Form state
  const [spec, setSpec] = useState({
    blanketType: "",
    manufacturer: "",
    class: "",
    color: "",
    size: "",
    zip: false,
    eyelets: false,
    commentOption: "",
    comments: "",
  });

  const [proc, setProc] = useState({
    procedure: "F479",
    truck: "213",
    standards: "0",
    canister: false,
    rollup: false,
    bag: false,
  });

  const [accessories, setAccessories] = useState<{ name: string; qty: string }[]>([
    { name: "", qty: "" },
  ]);

  const [newQty, setNewQty] = useState({ isNew: false, qty: "" });
  const [blanksToAdd, setBlanksToAdd] = useState("");

  // Table state
  const [view, setView] = useState<"basic" | "extended">("basic");
  const [showCancelled, setShowCancelled] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<BlanketRow[]>(seedRows);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        search
          ? `${r.truck} ${r.mfr} ${r.size} ${r.color} ${r.eslId} ${r.tag ?? ""}`
              .toLowerCase()
              .includes(search.toLowerCase())
          : true,
      ),
    [rows, search],
  );

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((r) => r.id)));
  };
  const toggleOne = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const addAccessoryRow = () =>
    setAccessories((a) => [...a, { name: "", qty: "" }]);
  const removeAccessoryRow = (i: number) =>
    setAccessories((a) => (a.length === 1 ? a : a.filter((_, idx) => idx !== i)));
  const updateAccessory = (i: number, key: "name" | "qty", value: string) =>
    setAccessories((a) => a.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));

  const addBlanks = () => {
    const n = parseInt(blanksToAdd, 10);
    if (!n || n < 1) return;
    const startIdx = rows.length;
    const truckPrefix = proc.truck || "T";
    const newRows: BlanketRow[] = Array.from({ length: n }).map((_, i) => ({
      id: startIdx + i + 1,
      truck: `${truckPrefix}-${startIdx + i + 1}`,
      mfr: spec.manufacturer || "—",
      class: spec.class || "—",
      size: spec.size || "—",
      color: spec.color || "—",
      type: spec.blanketType || "Solid",
      eye: spec.eyelets ? "Yes" : "No",
      zip: spec.zip,
      isNew: newQty.isNew,
      stds: parseInt(proc.standards || "0", 10) || 0,
      eslId: "",
    }));
    setRows((r) => [...r, ...newRows]);
    setBlanksToAdd("");
  };

  return (
    <div className="space-y-6">
      {/* ============ FORM PANEL ============ */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <FileEdit className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Blanket Specifications</h3>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
              Default for new records
            </Badge>
          </div>
          <a
            href="#"
            className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1"
          >
            Work Instructions
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Spec column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Blanket Type">
                <Select value={spec.blanketType} onValueChange={(v) => setSpec({ ...spec, blanketType: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="z-50">
                    {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Manufacturer">
                <Select value={spec.manufacturer} onValueChange={(v) => setSpec({ ...spec, manufacturer: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="z-50">
                    {MANUFACTURERS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Class">
                <Select value={spec.class} onValueChange={(v) => setSpec({ ...spec, class: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="z-50">
                    {BLANKET_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Color">
                <Select value={spec.color} onValueChange={(v) => setSpec({ ...spec, color: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="z-50">
                    {COLORS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Size">
                <Select value={spec.size} onValueChange={(v) => setSpec({ ...spec, size: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="z-50">
                    {SIZES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-end gap-4">
                <CheckboxField
                  id="zip"
                  label="Zip"
                  checked={spec.zip}
                  onCheckedChange={(v) => setSpec({ ...spec, zip: !!v })}
                />
                <CheckboxField
                  id="eyelets"
                  label="Eyelets"
                  checked={spec.eyelets}
                  onCheckedChange={(v) => setSpec({ ...spec, eyelets: !!v })}
                />
              </div>
            </div>

            <Field label="Comment Options">
              <Select value={spec.commentOption} onValueChange={(v) => setSpec({ ...spec, commentOption: v })}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select preset" /></SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="cut">Cut</SelectItem>
                  <SelectItem value="hole">Hole</SelectItem>
                  <SelectItem value="tear">Tear</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Comments">
              <Textarea
                value={spec.comments}
                onChange={(e) => setSpec({ ...spec, comments: e.target.value })}
                rows={3}
                placeholder="Notes that apply to newly added rows"
                className="resize-none"
              />
            </Field>
          </div>

          {/* Accessories column */}
          <div className="lg:col-span-3 space-y-4">
            <Field label="Accessories">
              <div className="space-y-2">
                {accessories.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Select value={row.name} onValueChange={(v) => updateAccessory(i, "name", v)}>
                      <SelectTrigger className="h-9 flex-1"><SelectValue placeholder="Accessory" /></SelectTrigger>
                      <SelectContent className="z-50">
                        {ACCESSORY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min={0}
                      value={row.qty}
                      onChange={(e) => updateAccessory(i, "qty", e.target.value)}
                      placeholder="Qty"
                      className="h-9 w-20"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      onClick={() => removeAccessoryRow(i)}
                      aria-label="Remove accessory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={addAccessoryRow}
                >
                  <Plus className="h-3.5 w-3.5" /> Add accessory
                </Button>
              </div>
            </Field>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-medium">Mark as</Label>
              <div className="flex items-center gap-3">
                <CheckboxField
                  id="isNew"
                  label="New"
                  checked={newQty.isNew}
                  onCheckedChange={(v) => setNewQty({ ...newQty, isNew: !!v })}
                />
                <Input
                  type="number"
                  min={0}
                  value={newQty.qty}
                  onChange={(e) => setNewQty({ ...newQty, qty: e.target.value })}
                  placeholder="Qty"
                  className="h-9 w-24"
                  disabled={!newQty.isNew}
                />
              </div>
            </div>
          </div>

          {/* Procedures column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Procedures Used">
                  <Input
                    value={proc.procedure}
                    onChange={(e) => setProc({ ...proc, procedure: e.target.value })}
                    className="h-9"
                  />
                </Field>
                <Field label="Standards Used">
                  <Input
                    value={proc.standards}
                    onChange={(e) => setProc({ ...proc, standards: e.target.value })}
                    className="h-9"
                  />
                </Field>
                <Field label="Truck #" hint="Default truck for added rows">
                  <Input
                    value={proc.truck}
                    onChange={(e) => setProc({ ...proc, truck: e.target.value })}
                    className="h-9"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <Label className="text-xs font-medium">Truck Accessories</Label>
              <div className="grid grid-cols-3 gap-2">
                <CheckboxField id="canister" label="Canister" checked={proc.canister}
                  onCheckedChange={(v) => setProc({ ...proc, canister: !!v })} />
                <CheckboxField id="rollup" label="Roll-up" checked={proc.rollup}
                  onCheckedChange={(v) => setProc({ ...proc, rollup: !!v })} />
                <CheckboxField id="bag" label="Bag" checked={proc.bag}
                  onCheckedChange={(v) => setProc({ ...proc, bag: !!v })} />
              </div>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
              <Label className="text-xs font-semibold">Bulk Add Blanks</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={blanksToAdd}
                  onChange={(e) => setBlanksToAdd(e.target.value)}
                  placeholder="How many?"
                  className="h-9"
                />
                <Button size="sm" className="h-9 gap-1" onClick={addBlanks}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Adds rows pre-filled with the specs above.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ ITEMS TABLE ============ */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 px-6 py-3.5 border-b lg:flex-row lg:items-center lg:justify-between">
          {/* Left: identity */}
          <div className="flex items-center gap-3">
            <h3 className="text-[15px] font-semibold tracking-tight">Blanket Items</h3>
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {filtered.length} items
            </span>
            {selected.size > 0 && (
              <span className="rounded-full bg-foreground text-background px-2 py-0.5 text-[11px] font-medium">
                {selected.size} selected
              </span>
            )}
          </div>

          {/* Right: functional controls */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items…"
                className="h-9 w-full pl-9 pr-4 text-xs bg-muted/40 border-border rounded-lg focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-background"
              />
            </div>

            {/* Grouped actions */}
            <div className="flex items-center gap-5">
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(v) => v && setView(v as "basic" | "extended")}
                className="flex p-1 bg-muted rounded-lg gap-0"
              >
                <ToggleGroupItem
                  value="basic"
                  className="h-7 px-3 text-[11px] font-semibold rounded-md text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=on]:ring-1 data-[state=on]:ring-black/5"
                >
                  Basic
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="extended"
                  className="h-7 px-3 text-[11px] font-medium rounded-md text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=on]:ring-1 data-[state=on]:ring-black/5"
                >
                  Extended
                </ToggleGroupItem>
              </ToggleGroup>

              <label className="group flex cursor-pointer items-center gap-2.5 select-none">
                <Checkbox
                  checked={showCancelled}
                  onCheckedChange={(v) => setShowCancelled(!!v)}
                  className="h-4 w-4 rounded border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground data-[state=checked]:text-background"
                />
                <span className="text-[12px] text-muted-foreground transition-colors group-hover:text-foreground">
                  Show Cancelled
                </span>
              </label>

              <Button
                size="sm"
                className="h-9 gap-2 rounded-lg bg-primary px-4 text-[12px] font-semibold text-primary-foreground shadow-sm border border-black/5 hover:bg-primary/90 active:scale-95 transition-all"
              >
                <Filter className="h-3.5 w-3.5" /> Filters
              </Button>
            </div>
          </div>
        </div>



        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground">
                <th className="w-10 px-3 py-2 text-left">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="px-3 py-2 text-left font-medium">#</th>
                <th className="px-3 py-2 text-left font-medium">Truck</th>
                <th className="px-3 py-2 text-left font-medium">Mfr</th>
                <th className="px-3 py-2 text-left font-medium">Class</th>
                <th className="px-3 py-2 text-left font-medium">Size</th>
                <th className="px-3 py-2 text-left font-medium">Color</th>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-left font-medium">Eye</th>
                {view === "extended" && (
                  <>
                    <th className="px-3 py-2 text-left font-medium">Eye Qty</th>
                    <th className="px-3 py-2 text-left font-medium">Other</th>
                    <th className="px-3 py-2 text-left font-medium">Hole Size</th>
                  </>
                )}
                <th className="px-3 py-2 text-center font-medium">Zip</th>
                <th className="px-3 py-2 text-center font-medium">New</th>
                <th className="px-3 py-2 text-left font-medium">Stds</th>
                <th className="px-3 py-2 text-left font-medium">ESL ID</th>
                {view === "extended" && (
                  <th className="px-3 py-2 text-left font-medium">Cust ID</th>
                )}
                <th className="px-3 py-2 text-left font-medium">Tag</th>
                <th className="px-3 py-2 text-left font-medium">Result</th>
                <th className="px-3 py-2 text-left font-medium">Comments</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const isSel = selected.has(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`border-t transition-colors ${
                      isSel ? "bg-primary/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="px-3 py-2">
                      <Checkbox checked={isSel} onCheckedChange={() => toggleOne(row.id)} />
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{row.id}</td>
                    <td className="px-3 py-2 font-medium">{row.truck}</td>
                    <td className="px-3 py-2">{row.mfr}</td>
                    <td className="px-3 py-2">{row.class}</td>
                    <td className="px-3 py-2">{row.size}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full border"
                          style={{ background: colorSwatch(row.color) }}
                        />
                        {row.color}
                      </span>
                    </td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2">{row.eye}</td>
                    {view === "extended" && (
                      <>
                        <td className="px-3 py-2 text-muted-foreground">{row.eyeQty ?? "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row.other ?? "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row.holeSize ?? "—"}</td>
                      </>
                    )}
                    <td className="px-3 py-2 text-center">
                      <Checkbox checked={row.zip} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Checkbox checked={row.isNew} />
                    </td>
                    <td className="px-3 py-2">{row.stds}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{row.eslId || "—"}</td>
                    {view === "extended" && (
                      <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">
                        {row.custId ?? "—"}
                      </td>
                    )}
                    <td className="px-3 py-2 text-muted-foreground">{row.tag ?? ""}</td>
                    <td className="px-3 py-2">
                      {row.result === "PASS" && (
                        <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Pass
                        </Badge>
                      )}
                      {row.result === "FAIL" && (
                        <Badge className="gap-1 bg-destructive text-destructive-foreground hover:bg-destructive">
                          <XCircle className="h-3 w-3" /> Fail
                          {row.failCount ? ` (${row.failCount})` : ""}
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[140px] truncate">
                      {row.comments ?? ""}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end items-center gap-1">
                        <IconBtn label="Edit"><Pencil className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label="Duplicate"><Copy className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label="CI"><ExternalLink className="h-3.5 w-3.5" /></IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={20} className="px-4 py-10 text-center text-muted-foreground">
                    No items. Add blanks above to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
          <span>Page 1 of 1 · {filtered.length} items</span>
          <div className="flex items-center gap-2">
            <span>Page size</span>
            <Select defaultValue="10">
              <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
              <SelectContent className="z-50">
                {[10, 25, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- helpers ---------- */

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    {children}
    {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
  </div>
);

const CheckboxField = ({
  id,
  label,
  checked,
  onCheckedChange,
  compact,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange?: (v: boolean | "indeterminate") => void;
  compact?: boolean;
}) => (
  <label
    htmlFor={id}
    className={`inline-flex items-center gap-2 cursor-pointer select-none ${
      compact ? "text-xs" : "text-xs"
    }`}
  >
    <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
    <span className="font-medium">{label}</span>
  </label>
);

const IconBtn = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const colorSwatch = (name: string) => {
  const map: Record<string, string> = {
    Yellow: "#facc15",
    Orange: "#fb923c",
    Black: "#0f172a",
    Red: "#ef4444",
    Blue: "#3b82f6",
  };
  return map[name] ?? "hsl(var(--muted))";
};

export default BlanketDetailsSection;
