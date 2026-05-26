import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EslGeneralSection,
  EslGeneralValues,
  defaultGeneralValues,
} from "./components/EslGeneralSection";
import { EslActionFooter } from "./components/EslActionFooter";
import { getEslTypeBySlug } from "./eslTypes";

interface BlanketRow {
  id: string;
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
  result: "PASS" | "FAIL";
  comments: string;
}

const seedRows: BlanketRow[] = [
  {
    id: "1",
    truck: "T-101",
    manufacturer: "Salisbury",
    class: "Class 2",
    size: "36x36",
    color: "Yellow",
    type: "Type II",
    eye: "Brass",
    qty: 2,
    holeSize: "—",
    zip: true,
    isNew: false,
    standards: "ASTM D1048",
    eslId: "ESL-00231",
    result: "PASS",
    comments: "Annual retest",
  },
  {
    id: "2",
    truck: "T-208",
    manufacturer: "Hubbell",
    class: "Class 4",
    size: "45x45",
    color: "Orange",
    type: "Type I",
    eye: "Steel",
    qty: 1,
    holeSize: "2mm",
    zip: false,
    isNew: true,
    standards: "ASTM D1048",
    eslId: "ESL-00232",
    result: "FAIL",
    comments: "Pinhole detected",
  },
];

const blanketTypes = ["Type I", "Type II", "Type III"];
const manufacturers = ["Salisbury", "Hubbell", "Novax", "Chance"];
const classes = ["Class 0", "Class 1", "Class 2", "Class 3", "Class 4"];
const colors = ["Yellow", "Orange", "Red", "Black"];
const sizes = ["18x18", "22x22", "36x36", "45x45"];

const EslBlankets = () => {
  const navigate = useNavigate();
  const type = getEslTypeBySlug("blankets")!;

  const [general, setGeneral] = useState<EslGeneralValues>(
    defaultGeneralValues(type.dropdownValue)
  );
  const handleGeneralChange = (k: keyof EslGeneralValues, v: string) =>
    setGeneral((s) => ({ ...s, [k]: v }));

  // Blanket configuration
  const [config, setConfig] = useState({
    blanketType: "",
    manufacturer: "",
    class: "",
    color: "",
    size: "",
    zip: false,
    eyelets: false,
  });
  const setCfg = (k: keyof typeof config, v: string | boolean) =>
    setConfig((c) => ({ ...c, [k]: v }));

  // Accessories
  const [truckNumber, setTruckNumber] = useState("");
  const [canister, setCanister] = useState(false);
  const [rollUp, setRollUp] = useState(false);
  const [bag, setBag] = useState(false);
  const [accessories, setAccessories] = useState<{ id: string; name: string; qty: number; procedure: string }[]>([
    { id: "a1", name: "", qty: 1, procedure: "" },
  ]);
  const addAccessory = () =>
    setAccessories((a) => [...a, { id: `a${Date.now()}`, name: "", qty: 1, procedure: "" }]);
  const removeAccessory = (id: string) =>
    setAccessories((a) => a.filter((x) => x.id !== id));

  // Notes
  const [standards, setStandards] = useState("");
  const [quickComment, setQuickComment] = useState("");
  const [comments, setComments] = useState("");
  const [blanketsToAdd, setBlanketsToAdd] = useState(1);

  // Table state
  const [rows, setRows] = useState<BlanketRow[]>(seedRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"basic" | "extended">("basic");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = rows.filter((r) =>
    [r.truck, r.manufacturer, r.eslId, r.size].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));

  const toggleAll = () =>
    setSelected(allSelected ? selected.filter((id) => !pageRows.find((r) => r.id === id)) : [...new Set([...selected, ...pageRows.map((r) => r.id)])]);
  const toggleOne = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const deleteRow = (id: string) => {
    setRows((r) => r.filter((x) => x.id !== id));
    setSelected((s) => s.filter((x) => x !== id));
  };

  const addBlanketRows = () => {
    const newOnes: BlanketRow[] = Array.from({ length: blanketsToAdd }).map((_, i) => ({
      id: `n${Date.now()}-${i}`,
      truck: truckNumber || "—",
      manufacturer: config.manufacturer || "—",
      class: config.class || "—",
      size: config.size || "—",
      color: config.color || "—",
      type: config.blanketType || "—",
      eye: config.eyelets ? "Yes" : "—",
      qty: 1,
      holeSize: "—",
      zip: config.zip,
      isNew: true,
      standards: standards || "—",
      eslId: `ESL-${Math.floor(Math.random() * 90000 + 10000)}`,
      result: "PASS",
      comments: comments,
    }));
    setRows((r) => [...newOnes, ...r]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-card border-b">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold truncate">{type.label}</h1>
                <Badge variant="secondary" className="text-[10px] uppercase">ESL</Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">Blanket inspection workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Print Report</Button>
            <Button variant="outline" size="sm">Save Draft</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-5 space-y-5">
        {/* GENERAL */}
        <EslGeneralSection currentType={type} values={general} onChange={handleGeneralChange} />

        {/* BLANKET DETAILS WORKSPACE */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-base font-semibold">Blanket Inspection Workspace</h2>
              <p className="text-xs text-muted-foreground">Configure blankets, accessories, and inspection notes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* LEFT — Blanket Details */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Blanket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Blanket Type</Label>
                  <Select value={config.blanketType} onValueChange={(v) => setCfg("blanketType", v)}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent className="z-50">
                      {blanketTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Manufacturer</Label>
                  <Select value={config.manufacturer} onValueChange={(v) => setCfg("manufacturer", v)}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Search manufacturer" /></SelectTrigger>
                    <SelectContent className="z-50">
                      {manufacturers.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Class</Label>
                    <Select value={config.class} onValueChange={(v) => setCfg("class", v)}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Class" /></SelectTrigger>
                      <SelectContent className="z-50">
                        {classes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Color</Label>
                    <Select value={config.color} onValueChange={(v) => setCfg("color", v)}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Color" /></SelectTrigger>
                      <SelectContent className="z-50">
                        {colors.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Size</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((s) => {
                      const active = config.size === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setCfg("size", s)}
                          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                            active
                              ? "bg-foreground text-background border-foreground"
                              : "bg-background hover:bg-muted border-border text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="pt-2 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Zip</Label>
                    <Switch checked={config.zip} onCheckedChange={(v) => setCfg("zip", v)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Eyelets</Label>
                    <Switch checked={config.eyelets} onCheckedChange={(v) => setCfg("eyelets", v)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CENTER — Accessories & Truck */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Accessories & Procedures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Truck #</Label>
                    <Input value={truckNumber} onChange={(e) => setTruckNumber(e.target.value)} placeholder="e.g. T-101" className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Truck Accessories</Label>
                    <Select>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent className="z-50">
                        <SelectItem value="ladder">Ladder</SelectItem>
                        <SelectItem value="hoist">Hoist</SelectItem>
                        <SelectItem value="boom">Boom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50">
                    <Checkbox checked={canister} onCheckedChange={(v) => setCanister(!!v)} />
                    <span className="text-xs">Canister</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50">
                    <Checkbox checked={rollUp} onCheckedChange={(v) => setRollUp(!!v)} />
                    <span className="text-xs">Roll-up</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-muted/50">
                    <Checkbox checked={bag} onCheckedChange={(v) => setBag(!!v)} />
                    <span className="text-xs">Bag</span>
                  </label>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Accessories</Label>
                    <Button size="sm" variant="ghost" onClick={addAccessory} className="h-7 px-2 text-xs">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add row
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {accessories.map((row) => (
                      <div key={row.id} className="grid grid-cols-[1fr_70px_1fr_auto] gap-2 items-center">
                        <Input
                          placeholder="Accessory"
                          value={row.name}
                          onChange={(e) =>
                            setAccessories((a) => a.map((x) => x.id === row.id ? { ...x, name: e.target.value } : x))
                          }
                          className="h-9"
                        />
                        <Input
                          type="number"
                          min={1}
                          value={row.qty}
                          onChange={(e) =>
                            setAccessories((a) => a.map((x) => x.id === row.id ? { ...x, qty: Number(e.target.value) } : x))
                          }
                          className="h-9"
                        />
                        <Input
                          placeholder="Procedure used"
                          value={row.procedure}
                          onChange={(e) =>
                            setAccessories((a) => a.map((x) => x.id === row.id ? { ...x, procedure: e.target.value } : x))
                          }
                          className="h-9"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeAccessory(row.id)}
                          disabled={accessories.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RIGHT — Notes */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Inspection Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Standards Used</Label>
                  <Select value={standards} onValueChange={setStandards}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="Select standard" /></SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="ASTM D1048">ASTM D1048</SelectItem>
                      <SelectItem value="ASTM F479">ASTM F479</SelectItem>
                      <SelectItem value="IEC 61112">IEC 61112</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Quick Comments</Label>
                  <Select
                    value={quickComment}
                    onValueChange={(v) => {
                      setQuickComment(v);
                      setComments((c) => (c ? `${c}\n${v}` : v));
                    }}
                  >
                    <SelectTrigger className="h-9"><SelectValue placeholder="Insert preset comment" /></SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="Visual inspection passed">Visual inspection passed</SelectItem>
                      <SelectItem value="Dielectric test passed">Dielectric test passed</SelectItem>
                      <SelectItem value="Pinhole detected">Pinhole detected</SelectItem>
                      <SelectItem value="Replaced due to damage">Replaced due to damage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Comments</Label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add inspection notes…"
                    className="min-h-[110px]"
                  />
                </div>
                <div className="pt-2 border-t flex items-end gap-2">
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs font-medium">Blankets to Add</Label>
                    <Input
                      type="number"
                      min={1}
                      value={blanketsToAdd}
                      onChange={(e) => setBlanketsToAdd(Number(e.target.value))}
                      className="h-9"
                    />
                  </div>
                  <Button onClick={addBlanketRows} className="h-9">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* TABLE */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-sm font-semibold">Blanket Inspection Items</CardTitle>
                <Badge variant="secondary" className="text-[10px]">{filtered.length}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search truck, mfr, ESL ID…"
                    className="h-8 w-64 pl-7 text-xs"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3.5 w-3.5 mr-1" /> Filter
                </Button>
                <ToggleGroup
                  type="single"
                  value={view}
                  onValueChange={(v) => v && setView(v as "basic" | "extended")}
                  className="border rounded-md p-0.5"
                >
                  <ToggleGroupItem value="basic" className="h-7 px-3 text-xs data-[state=on]:bg-foreground data-[state=on]:text-background">
                    Basic
                  </ToggleGroupItem>
                  <ToggleGroupItem value="extended" className="h-7 px-3 text-xs data-[state=on]:bg-foreground data-[state=on]:text-background">
                    Extended
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/40 z-10">
                  <TableRow>
                    <TableHead className="w-8">
                      <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                    </TableHead>
                    <TableHead className="text-xs">Truck</TableHead>
                    <TableHead className="text-xs">Manufacturer</TableHead>
                    <TableHead className="text-xs">Class</TableHead>
                    <TableHead className="text-xs">Size</TableHead>
                    <TableHead className="text-xs">Color</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    {view === "extended" && <TableHead className="text-xs">Eye</TableHead>}
                    <TableHead className="text-xs">Qty</TableHead>
                    {view === "extended" && <TableHead className="text-xs">Hole Size</TableHead>}
                    {view === "extended" && <TableHead className="text-xs">Zip</TableHead>}
                    {view === "extended" && <TableHead className="text-xs">New</TableHead>}
                    {view === "extended" && <TableHead className="text-xs">Standards</TableHead>}
                    <TableHead className="text-xs">ESL ID</TableHead>
                    <TableHead className="text-xs">Result</TableHead>
                    {view === "extended" && <TableHead className="text-xs">Comments</TableHead>}
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={view === "extended" ? 17 : 11} className="text-center py-8 text-sm text-muted-foreground">
                        No blanket items yet. Configure a blanket above and click Add.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((r) => (
                      <TableRow key={r.id} data-state={selected.includes(r.id) ? "selected" : undefined}>
                        <TableCell>
                          <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggleOne(r.id)} />
                        </TableCell>
                        <TableCell className="text-xs font-medium">{r.truck}</TableCell>
                        <TableCell className="text-xs">{r.manufacturer}</TableCell>
                        <TableCell className="text-xs">{r.class}</TableCell>
                        <TableCell className="text-xs">{r.size}</TableCell>
                        <TableCell className="text-xs">{r.color}</TableCell>
                        <TableCell className="text-xs">{r.type}</TableCell>
                        {view === "extended" && <TableCell className="text-xs">{r.eye}</TableCell>}
                        <TableCell className="text-xs">{r.qty}</TableCell>
                        {view === "extended" && <TableCell className="text-xs">{r.holeSize}</TableCell>}
                        {view === "extended" && <TableCell className="text-xs">{r.zip ? "Yes" : "No"}</TableCell>}
                        {view === "extended" && <TableCell className="text-xs">{r.isNew ? "Yes" : "No"}</TableCell>}
                        {view === "extended" && <TableCell className="text-xs">{r.standards}</TableCell>}
                        <TableCell className="text-xs font-mono">{r.eslId}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              r.result === "PASS"
                                ? "bg-emerald-600 hover:bg-emerald-600 text-white border-transparent"
                                : "bg-red-600 hover:bg-red-600 text-white border-transparent"
                            }
                          >
                            {r.result}
                          </Badge>
                        </TableCell>
                        {view === "extended" && <TableCell className="text-xs max-w-[200px] truncate">{r.comments}</TableCell>}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-50 bg-popover">
                              <DropdownMenuItem>
                                <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setRows((rs) =>
                                    rs.map((x) =>
                                      x.id === r.id ? { ...x, result: x.result === "PASS" ? "FAIL" : "PASS" } : x
                                    )
                                  )
                                }
                              >
                                Toggle Pass/Fail
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteRow(r.id)}>
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
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
            <div className="flex items-center justify-between px-4 py-2 border-t text-xs text-muted-foreground">
              <span>
                {selected.length > 0 ? `${selected.length} selected · ` : ""}
                Showing {pageRows.length} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2">Page {page} / {totalPages}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <EslActionFooter onCancel={() => navigate(-1)} onSave={() => {}} saveLabel="Save" />
    </div>
  );
};

export default EslBlankets;
