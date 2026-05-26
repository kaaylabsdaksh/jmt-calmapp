import { useState, useMemo } from "react";
import { getEslTypeBySlug } from "./eslTypes";
import { EslLayout } from "./components/EslLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plus,
  Trash2,
  Pencil,
  MoreHorizontal,
  Search,
  ArrowUpDown,
  Filter,
  Copy,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface AccessoryRow {
  id: string;
  name: string;
  qty: string;
}

interface BlanketRow {
  id: string;
  selected: boolean;
  truck: string;
  manufacturer: string;
  class: string;
  size: string;
  color: string;
  type: string;
  eye: string;
  qty: number;
  holeSize: string;
  zip: boolean;
  isNew: boolean;
  standards: string;
  eslId: string;
  result: "PASS" | "FAIL" | "";
  comments: string;
}

const seedRows: BlanketRow[] = [
  {
    id: "r1",
    selected: false,
    truck: "T-204",
    manufacturer: "Salisbury",
    class: "Class 2",
    size: "36x36",
    color: "Yellow",
    type: "Rubber",
    eye: "Yes",
    qty: 2,
    holeSize: "—",
    zip: false,
    isNew: true,
    standards: "ASTM D1048",
    eslId: "ESL-10245",
    result: "PASS",
    comments: "No defects",
  },
  {
    id: "r2",
    selected: false,
    truck: "T-118",
    manufacturer: "Hubbell",
    class: "Class 4",
    size: "45x60",
    color: "Orange",
    type: "Rubber",
    eye: "No",
    qty: 1,
    holeSize: "2mm",
    zip: true,
    isNew: false,
    standards: "ASTM D1048",
    eslId: "ESL-10246",
    result: "FAIL",
    comments: "Pinhole on edge",
  },
  {
    id: "r3",
    selected: false,
    truck: "T-307",
    manufacturer: "Novax",
    class: "Class 1",
    size: "22x22",
    color: "Beige",
    type: "Rubber",
    eye: "Yes",
    qty: 4,
    holeSize: "—",
    zip: false,
    isNew: true,
    standards: "ASTM F479",
    eslId: "ESL-10247",
    result: "PASS",
    comments: "—",
  },
];

const EslBlankets = () => {
  const type = getEslTypeBySlug("blankets")!;

  // Left panel
  const [blanketType, setBlanketType] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [bClass, setBClass] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [zip, setZip] = useState(false);
  const [eyelets, setEyelets] = useState(false);

  // Center panel
  const [accessories, setAccessories] = useState<AccessoryRow[]>([
    { id: "a1", name: "", qty: "" },
  ]);
  const [procedures, setProcedures] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [truckAcc, setTruckAcc] = useState("");
  const [canister, setCanister] = useState(false);
  const [rollup, setRollup] = useState(false);
  const [bag, setBag] = useState(false);

  // Right panel
  const [standards, setStandards] = useState("");
  const [quickComment, setQuickComment] = useState("");
  const [comments, setComments] = useState("");
  const [blanketsToAdd, setBlanketsToAdd] = useState("1");

  // Table state
  const [rows, setRows] = useState<BlanketRow[]>(seedRows);
  const [viewMode, setViewMode] = useState<"basic" | "extended">("basic");
  const [query, setQuery] = useState("");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<keyof BlanketRow>("eslId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const addAccessory = () =>
    setAccessories((a) => [
      ...a,
      { id: `a${Date.now()}`, name: "", qty: "" },
    ]);
  const removeAccessory = (id: string) =>
    setAccessories((a) => a.filter((x) => x.id !== id));
  const updateAccessory = (id: string, key: keyof AccessoryRow, val: string) =>
    setAccessories((a) =>
      a.map((x) => (x.id === id ? { ...x, [key]: val } : x))
    );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (resultFilter !== "all" && r.result !== resultFilter) return false;
      if (!q) return true;
      return [r.truck, r.manufacturer, r.eslId, r.class, r.size, r.color]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    out = [...out].sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return out;
  }, [rows, query, resultFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: keyof BlanketRow) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleAll = (checked: boolean) =>
    setRows((rs) => rs.map((r) => ({ ...r, selected: checked })));
  const toggleRow = (id: string, checked: boolean) =>
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, selected: checked } : r))
    );

  const selectedCount = rows.filter((r) => r.selected).length;

  const SortableHead = ({
    label,
    k,
  }: {
    label: string;
    k: keyof BlanketRow;
  }) => (
    <button
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
    >
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-60" />
    </button>
  );

  return (
    <EslLayout type={type}>
      <div className="space-y-5">
        {/* Workspace header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Blanket Inspection Workspace
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure blanket details, accessories, and inspection notes
              before logging items.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] uppercase">
              ASTM D1048
            </Badge>
            <Badge variant="outline" className="text-[10px] uppercase">
              {rows.length} items
            </Badge>
          </div>
        </div>

        {/* 3-panel workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Blanket Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Blanket Type">
                <Select value={blanketType} onValueChange={setBlanketType}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="rubber">Rubber</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="composite">Composite</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Manufacturer">
                <Select value={manufacturer} onValueChange={setManufacturer}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Search manufacturer" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="salisbury">Salisbury</SelectItem>
                    <SelectItem value="hubbell">Hubbell</SelectItem>
                    <SelectItem value="novax">Novax</SelectItem>
                    <SelectItem value="oberon">Oberon</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Class">
                  <Select value={bClass} onValueChange={setBClass}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {["00", "0", "1", "2", "3", "4"].map((c) => (
                        <SelectItem key={c} value={c}>
                          Class {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Color">
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="beige">Beige</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Size">
                <div className="flex flex-wrap gap-1.5">
                  {["22x22", "36x36", "45x60", "Custom"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                        size === s
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background border-border hover:bg-muted"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <Label className="text-xs font-medium">Zip</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Has zipper closure
                  </p>
                </div>
                <Switch checked={zip} onCheckedChange={setZip} />
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <Label className="text-xs font-medium">Eyelets</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Includes eyelet hardware
                  </p>
                </div>
                <Switch checked={eyelets} onCheckedChange={setEyelets} />
              </div>
            </CardContent>
          </Card>

          {/* CENTER */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">
                Accessories &amp; Procedures
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={addAccessory}
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Accessories</Label>
                <div className="space-y-2">
                  {accessories.map((a, idx) => (
                    <div key={a.id} className="flex items-center gap-2">
                      <Input
                        value={a.name}
                        onChange={(e) =>
                          updateAccessory(a.id, "name", e.target.value)
                        }
                        placeholder={`Accessory ${idx + 1}`}
                        className="h-9 flex-1"
                      />
                      <Input
                        value={a.qty}
                        onChange={(e) =>
                          updateAccessory(a.id, "qty", e.target.value)
                        }
                        placeholder="Qty"
                        className="h-9 w-16"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeAccessory(a.id)}
                        disabled={accessories.length === 1}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Field label="Procedures Used">
                <Select value={procedures} onValueChange={setProcedures}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select procedure" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="visual">Visual Inspection</SelectItem>
                    <SelectItem value="dielectric">Dielectric Test</SelectItem>
                    <SelectItem value="proof">Proof Test</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Truck #">
                  <Input
                    value={truckNo}
                    onChange={(e) => setTruckNo(e.target.value)}
                    placeholder="T-000"
                    className="h-9"
                  />
                </Field>
                <Field label="Truck Accessories">
                  <Input
                    value={truckAcc}
                    onChange={(e) => setTruckAcc(e.target.value)}
                    placeholder="Optional"
                    className="h-9"
                  />
                </Field>
              </div>

              <div className="rounded-md border divide-y">
                {[
                  { label: "Canister", v: canister, set: setCanister },
                  { label: "Roll-up", v: rollup, set: setRollup },
                  { label: "Bag", v: bag, set: setBag },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-3 py-2"
                  >
                    <Label className="text-xs font-medium">{row.label}</Label>
                    <Switch
                      checked={row.v}
                      onCheckedChange={(c) => row.set(c)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* RIGHT */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Inspection Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Standards Used">
                <Select value={standards} onValueChange={setStandards}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="astm-d1048">ASTM D1048</SelectItem>
                    <SelectItem value="astm-f479">ASTM F479</SelectItem>
                    <SelectItem value="ieee-978">IEEE 978</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Comment Options">
                <Select
                  value={quickComment}
                  onValueChange={(v) => {
                    setQuickComment(v);
                    setComments((c) => (c ? `${c}\n${v}` : v));
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Quick add comment" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="No defects observed">
                      No defects observed
                    </SelectItem>
                    <SelectItem value="Surface contamination">
                      Surface contamination
                    </SelectItem>
                    <SelectItem value="Edge tear detected">
                      Edge tear detected
                    </SelectItem>
                    <SelectItem value="Pinhole detected">
                      Pinhole detected
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Comments">
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Inspector notes..."
                  className="min-h-[110px] resize-y"
                />
              </Field>
              <div className="flex items-end gap-2">
                <Field label="Blankets to Add" className="flex-1">
                  <Input
                    type="number"
                    min={1}
                    value={blanketsToAdd}
                    onChange={(e) => setBlanketsToAdd(e.target.value)}
                    className="h-9"
                  />
                </Field>
                <Button size="sm" className="h-9">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced */}
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced" className="border rounded-md">
            <AccordionTrigger className="px-4 py-2.5 text-sm font-medium hover:no-underline">
              Advanced settings
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground">
                Configure batch defaults, default standards, and auto-fill rules
                for this workspace.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Table */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Blanket Items
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {filtered.length} of {rows.length} items
                  {selectedCount > 0 && ` · ${selectedCount} selected`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search items..."
                    className="h-8 pl-7 w-56 text-xs"
                  />
                </div>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="h-8 w-[120px] text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">All results</SelectItem>
                    <SelectItem value="PASS">Pass</SelectItem>
                    <SelectItem value="FAIL">Fail</SelectItem>
                  </SelectContent>
                </Select>
                <Tabs
                  value={viewMode}
                  onValueChange={(v) => setViewMode(v as "basic" | "extended")}
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="basic" className="h-6 text-xs px-2.5">
                      Basic
                    </TabsTrigger>
                    <TabsTrigger
                      value="extended"
                      className="h-6 text-xs px-2.5"
                    >
                      Extended
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-y overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur">
                  <TableRow>
                    <TableHead className="w-8">
                      <Checkbox
                        checked={
                          rows.length > 0 && selectedCount === rows.length
                        }
                        onCheckedChange={(c) => toggleAll(Boolean(c))}
                      />
                    </TableHead>
                    <TableHead className="text-xs">
                      <SortableHead label="Truck" k="truck" />
                    </TableHead>
                    <TableHead className="text-xs">
                      <SortableHead label="Manufacturer" k="manufacturer" />
                    </TableHead>
                    <TableHead className="text-xs">
                      <SortableHead label="Class" k="class" />
                    </TableHead>
                    <TableHead className="text-xs">
                      <SortableHead label="Size" k="size" />
                    </TableHead>
                    <TableHead className="text-xs">Color</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    {viewMode === "extended" && (
                      <>
                        <TableHead className="text-xs">Eye</TableHead>
                        <TableHead className="text-xs">Qty</TableHead>
                        <TableHead className="text-xs">Hole Size</TableHead>
                        <TableHead className="text-xs">Zip</TableHead>
                        <TableHead className="text-xs">New</TableHead>
                        <TableHead className="text-xs">Standards</TableHead>
                      </>
                    )}
                    <TableHead className="text-xs">
                      <SortableHead label="ESL ID" k="eslId" />
                    </TableHead>
                    <TableHead className="text-xs">Result</TableHead>
                    {viewMode === "extended" && (
                      <TableHead className="text-xs">Comments</TableHead>
                    )}
                    <TableHead className="text-xs w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={viewMode === "extended" ? 16 : 10}
                        className="text-center text-sm text-muted-foreground py-10"
                      >
                        No items match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map((r) => (
                      <TableRow
                        key={r.id}
                        data-state={r.selected ? "selected" : undefined}
                      >
                        <TableCell className="py-2">
                          <Checkbox
                            checked={r.selected}
                            onCheckedChange={(c) =>
                              toggleRow(r.id, Boolean(c))
                            }
                          />
                        </TableCell>
                        <TableCell className="py-2 text-xs font-medium">
                          {r.truck}
                        </TableCell>
                        <TableCell className="py-2 text-xs">
                          {r.manufacturer}
                        </TableCell>
                        <TableCell className="py-2 text-xs">
                          {r.class}
                        </TableCell>
                        <TableCell className="py-2 text-xs">
                          {r.size}
                        </TableCell>
                        <TableCell className="py-2 text-xs">
                          {r.color}
                        </TableCell>
                        <TableCell className="py-2 text-xs">
                          {r.type}
                        </TableCell>
                        {viewMode === "extended" && (
                          <>
                            <TableCell className="py-2 text-xs">
                              {r.eye}
                            </TableCell>
                            <TableCell className="py-2 text-xs">
                              {r.qty}
                            </TableCell>
                            <TableCell className="py-2 text-xs">
                              {r.holeSize}
                            </TableCell>
                            <TableCell className="py-2 text-xs">
                              {r.zip ? "Yes" : "No"}
                            </TableCell>
                            <TableCell className="py-2 text-xs">
                              {r.isNew ? "Yes" : "No"}
                            </TableCell>
                            <TableCell className="py-2 text-xs">
                              {r.standards}
                            </TableCell>
                          </>
                        )}
                        <TableCell className="py-2 text-xs font-mono">
                          {r.eslId}
                        </TableCell>
                        <TableCell className="py-2">
                          {r.result === "PASS" ? (
                            <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              PASS
                            </Badge>
                          ) : r.result === "FAIL" ? (
                            <Badge className="bg-red-600 hover:bg-red-600 text-white gap-1">
                              <XCircle className="h-3 w-3" />
                              FAIL
                            </Badge>
                          ) : (
                            <Badge variant="outline">—</Badge>
                          )}
                        </TableCell>
                        {viewMode === "extended" && (
                          <TableCell className="py-2 text-xs text-muted-foreground max-w-[180px] truncate">
                            {r.comments}
                          </TableCell>
                        )}
                        <TableCell className="py-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="z-50"
                            >
                              <DropdownMenuItem>
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-3.5 w-3.5" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  setRows((rs) =>
                                    rs.filter((x) => x.id !== r.id)
                                  )
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground">
              <span>
                Page {page} of {pageCount}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  disabled={page >= pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EslLayout>
  );
};

const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label className="text-xs font-medium">{label}</Label>
    {children}
  </div>
);

export default EslBlankets;
