import { Fragment, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, ArrowDown, ArrowUp, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Factory, Menu, RotateCcw, Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { emptyFactoryCriteria, factoryBatches, factoryStatuses, filterFactoryBatches, matchingFactoryItems, type FactoryBatch, type FactoryCriteria } from "@/lib/to-factory";

function SearchSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return <div className="space-y-1.5 min-w-0">
    <Label className="text-xs font-medium">{label}</Label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button variant="outline" role="combobox" aria-label={label} aria-expanded={open} className="h-8 w-full justify-between px-2 text-xs font-normal hover:bg-muted focus-visible:ring-foreground"><span className="truncate">{value || `All ${label === "T/F Clerk(s)" ? "Clerks" : label === "T/F Status" ? "Statuses" : label === "Customer Group" ? "Customer Groups" : label === "Manufacturer" ? "Manufacturers" : "Locations"}`}</span><ChevronsUpDown className="h-3 w-3 text-muted-foreground" /></Button></PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start"><Command><CommandInput placeholder={`Search ${label.toLowerCase()}...`} /><CommandList><CommandEmpty>No matches found.</CommandEmpty><CommandGroup>
        {["", ...options].map((option) => <CommandItem key={option || "all"} value={option || "All"} onSelect={() => { onChange(option); setOpen(false); }} className="data-[selected=true]:bg-muted"><Check className={cn("mr-2 h-3 w-3", value === option ? "opacity-100" : "opacity-0")} />{option || "All"}</CommandItem>)}
      </CommandGroup></CommandList></Command></PopoverContent>
    </Popover>
  </div>;
}

const columns: { key: keyof FactoryBatch; label: string; width: string; date?: boolean }[] = [
  { key: "batch", label: "WO Batch", width: "w-28" }, { key: "account", label: "Acct #", width: "w-24" },
  { key: "sr", label: "SR #", width: "w-24" }, { key: "rma", label: "W/O RMA", width: "w-28" },
  { key: "po", label: "PO #", width: "w-28" }, { key: "customer", label: "Customer Name", width: "w-48" },
  { key: "commentDate", label: "Last Comment Date", width: "w-36", date: true },
  { key: "comment", label: "Last Comment", width: "w-72" },
  { key: "needBy", label: "Min Need By Date", width: "w-36", date: true },
  { key: "followUp", label: "Min Follow Up Date", width: "w-36", date: true },
];
const dateText = (value: string) => value ? format(new Date(`${value}T00:00:00`), "MM/dd/yyyy") : "—";

export default function ToFactoryWorkOrders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [criteria, setCriteria] = useState<FactoryCriteria>({ ...emptyFactoryCriteria });
  const [applied, setApplied] = useState<FactoryCriteria>({ ...emptyFactoryCriteria });
  const [filters, setFilters] = useState<Partial<Record<keyof FactoryBatch, string>>>({});
  const [expanded, setExpanded] = useState<string[]>([]);
  const [view, setView] = useState("default");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: keyof FactoryBatch; direction: "asc" | "desc" } | null>(null);
  const options = (key: "location" | "group") => Array.from(new Set(factoryBatches.map((batch) => batch[key])));
  const itemOptions = (key: "manufacturer" | "clerk") => Array.from(new Set(factoryBatches.flatMap((batch) => batch.items.map((item) => item[key]))));
  const rows = useMemo(() => {
    const result = filterFactoryBatches(factoryBatches, applied, filters);
    if (sort) result.sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key])) * (sort.direction === "asc" ? 1 : -1));
    return result;
  }, [applied, filters, sort]);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const visibleRows = rows.slice(page * pageSize, (page + 1) * pageSize);
  const changeCriteria = (key: keyof FactoryCriteria, value: string | boolean) => setCriteria((previous) => ({ ...previous, [key]: value }));
  const clear = () => { setCriteria({ ...emptyFactoryCriteria }); setApplied({ ...emptyFactoryCriteria }); setFilters({}); setPage(0); setSort(null); setExpanded([]); };
  const returnTo = typeof location.state?.returnTo === "string" ? location.state.returnTo : "/form-variations";
  const back = () => navigate(returnTo, { state: { section: "qf3" } });
  const toggleSort = (key: keyof FactoryBatch) => setSort((previous) => previous?.key !== key ? { key, direction: "asc" } : previous.direction === "asc" ? { key, direction: "desc" } : null);
  const saveDefault = (type: string) => {
    sessionStorage.setItem(`tf-${type}`, JSON.stringify({ criteria, view }));
    toast({ title: `${type === "search" ? "Search criteria" : "View"} set as default`, description: "Saved for this browser session." });
  };

  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border bg-card px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3"><SidebarTrigger /><div><h1 className="text-lg font-semibold">Work Orders (To Factory)</h1><nav aria-label="Breadcrumb" className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Link to="/" className="hover:text-foreground">Work Orders</Link><ChevronRight className="h-3 w-3" /><span className="text-foreground">To Factory</span></nav></div></div>
        <Button variant="outline" size="sm" onClick={back} className="hover:bg-muted"><ArrowLeft />Back</Button>
      </div>
    </header>

    <div className="space-y-5 p-4 sm:p-6">
      <section aria-labelledby="tf-search-title" className="border-b border-border pb-4">
        <div className="mb-3 flex items-center gap-2"><Search className="h-4 w-4 text-muted-foreground" /><h2 id="tf-search-title" className="text-sm font-semibold">Search Criteria</h2></div>
        <form onSubmit={(event) => { event.preventDefault(); setApplied({ ...criteria }); setPage(0); setExpanded([]); }}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <SearchSelect label="Location" value={criteria.location} options={options("location")} onChange={(value) => changeCriteria("location", value)} />
            <SearchSelect label="Manufacturer" value={criteria.manufacturer} options={itemOptions("manufacturer")} onChange={(value) => changeCriteria("manufacturer", value)} />
            <SearchSelect label="Customer Group" value={criteria.group} options={options("group")} onChange={(value) => changeCriteria("group", value)} />
            <SearchSelect label="T/F Clerk(s)" value={criteria.clerk} options={itemOptions("clerk")} onChange={(value) => changeCriteria("clerk", value)} />
            <SearchSelect label="T/F Status" value={criteria.status} options={factoryStatuses} onChange={(value) => changeCriteria("status", value)} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Checkbox id="tf-lab-standards" checked={criteria.labStandards} onCheckedChange={(checked) => changeCriteria("labStandards", checked === true)} className="border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background focus-visible:ring-foreground" /><Label htmlFor="tf-lab-standards" className="text-xs">Lab Stds?</Label></div>
            <div className="flex items-center gap-2"><Button variant="outline" size="sm" type="button" onClick={clear} className="hover:bg-muted"><RotateCcw />Clear</Button><Button size="sm" type="submit" className="bg-info text-info-foreground hover:bg-info/90 focus-visible:ring-info"><Search />Search</Button></div>
          </div>
        </form>
      </section>

      <section aria-labelledby="tf-results-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2"><Factory className="h-4 w-4 text-muted-foreground" /><h2 id="tf-results-title" className="text-sm font-semibold">Work Orders</h2><span className="text-xs text-muted-foreground">{rows.length} batches · Sample data</span></div>
          <div className="flex items-center gap-2"><Select value={view} onValueChange={setView}><SelectTrigger aria-label="Results view" className="h-8 w-40 text-xs focus:ring-foreground"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="default">Default View</SelectItem><SelectItem value="items">Item View</SelectItem></SelectContent></Select>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="h-8 hover:bg-muted"><Settings2 />Defaults<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => saveDefault("search")}>Set Search Field Defaults</DropdownMenuItem><DropdownMenuItem onSelect={() => saveDefault("view")}>Set Default View</DropdownMenuItem><DropdownMenuItem onSelect={() => { const saved = sessionStorage.getItem("tf-search"); if (saved) { const parsed = JSON.parse(saved); setCriteria(parsed.criteria); setApplied(parsed.criteria); } const savedView = sessionStorage.getItem("tf-view"); if (savedView) setView(JSON.parse(savedView).view); setPage(0); }}>Restore Defaults</DropdownMenuItem><DropdownMenuItem onSelect={() => { sessionStorage.removeItem("tf-search"); sessionStorage.removeItem("tf-view"); clear(); }}>Reset Defaults</DropdownMenuItem><DropdownMenuItem onSelect={() => saveDefault("search")}>Set Advanced Search as Default</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
          </div>
        </div>
        <div className="max-h-[560px] overflow-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[1480px] border-collapse text-xs">
            <thead className="sticky top-0 z-20 bg-secondary">
              <tr><th className="w-9 border-b border-border" aria-label="Expand batch" />{columns.map((column) => <th key={column.key} className={cn("border-b border-border px-2 py-2 text-left font-medium", column.width)}><div className="flex items-center justify-between gap-1"><span>{column.label}</span><Button variant="ghost" className="h-5 w-5 shrink-0 p-0 hover:bg-muted" aria-label={`Sort ${column.label}`} onClick={() => toggleSort(column.key)}>{sort?.key === column.key ? sort.direction === "asc" ? <ArrowUp className="text-info" /> : <ArrowDown className="text-info" /> : <ChevronsUpDown className="text-muted-foreground" />}</Button></div></th>)}</tr>
              <tr><th className="border-b border-border" />{columns.map((column) => <th key={column.key} className="border-b border-border px-1.5 py-1.5 font-normal">
                {column.date ? <ModernDatePicker size="sm" id={`tf-filter-${column.key}`} value={filters[column.key]} onChange={(date) => { setFilters((previous) => ({ ...previous, [column.key]: date ? format(date, "yyyy-MM-dd") : "" })); setPage(0); }} /> : <div className="relative"><Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" /><Input aria-label={`Filter ${column.label}`} value={filters[column.key] || ""} onChange={(event) => { setFilters((previous) => ({ ...previous, [column.key]: event.target.value })); setPage(0); }} className="h-7 pl-6 text-[11px] focus-visible:ring-foreground" placeholder="Search..." /></div>}
              </th>)}</tr>
            </thead>
            <tbody>{visibleRows.map((batch) => {
              const isOpen = view === "items" || expanded.includes(batch.batch);
              return <Fragment key={batch.batch}><tr className="border-b border-border hover:bg-muted/30">
                <td className="p-1"><Button variant="ghost" aria-label={`${isOpen ? "Collapse" : "Expand"} batch ${batch.batch}`} aria-expanded={isOpen} disabled={view === "items"} className="h-7 w-7 p-0 hover:bg-muted" onClick={() => setExpanded((previous) => previous.includes(batch.batch) ? previous.filter((value) => value !== batch.batch) : [...previous, batch.batch])}>{isOpen ? <ChevronDown /> : <ChevronRight />}</Button></td>
                {columns.map((column) => <td key={column.key} className="px-2 py-2 align-top">{column.key === "batch" ? <Button variant="ghost" asChild className="h-auto p-0 text-xs font-semibold text-info hover:bg-transparent hover:text-info hover:underline"><Link to={`/edit-batch-work-order?wo=${batch.batch}`} state={{ woNumber: batch.batch, accountNumber: batch.account }}>{batch.batch}</Link></Button> : column.key === "sr" && batch.sr ? <Button variant="ghost" asChild className="h-auto p-0 text-xs text-info hover:bg-transparent hover:text-info hover:underline"><Link to={`/manage-customers/sr-documents/${batch.sr}`}>{batch.sr}</Link></Button> : column.date ? <span className="whitespace-nowrap tabular-nums">{dateText(String(batch[column.key]))}</span> : String(batch[column.key]) || <span className="text-muted-foreground">—</span>}</td>)}
              </tr>{isOpen && <tr className="border-b border-border bg-secondary/40"><td /><td colSpan={10} className="p-3"><div className="mb-2 flex items-center gap-3 text-xs"><span className="font-semibold">Batch {batch.batch} · {matchingFactoryItems(batch, applied).length} items</span><span className="text-muted-foreground">{batch.location}</span></div><table className="w-full text-xs"><thead><tr className="border-b border-border text-muted-foreground">{["Item #", "Manufacturer", "Model", "Description", "Serial #", "T/F Clerk", "T/F Status", "Lab Standard"].map((label) => <th key={label} className="px-2 py-1.5 text-left font-medium">{label}</th>)}</tr></thead><tbody>{matchingFactoryItems(batch, applied).map((item) => <tr key={item.item} className="border-b border-border last:border-0"><td className="px-2 py-2"><Button variant="ghost" asChild className="h-auto p-0 text-xs text-info hover:bg-transparent hover:underline"><Link to={`/edit-order?wo=${batch.batch}&item=${item.item}`}>{item.item}</Link></Button></td>{[item.manufacturer, item.model, item.description, item.serial, item.clerk].map((value, index) => <td key={index} className="px-2 py-2">{value}</td>)}<td className="px-2 py-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-2 py-1 text-info"><span className="h-1.5 w-1.5 rounded-full bg-info" />{item.status}</span></td><td className="px-2 py-2">{item.labStandard ? "Yes" : "No"}</td></tr>)}</tbody></table></td></tr>}</Fragment>;
            })}{rows.length === 0 && <tr><td colSpan={11} className="py-12 text-center text-muted-foreground">No work orders match your criteria.</td></tr>}</tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-2 py-3 text-xs text-muted-foreground"><span>{rows.length ? page * pageSize + 1 : 0}–{Math.min((page + 1) * pageSize, rows.length)} of {rows.length} batches</span><div className="flex items-center gap-2"><Button variant="outline" aria-label="Previous page" className="h-7 w-7 p-0 hover:bg-muted" disabled={page === 0} onClick={() => setPage((previous) => previous - 1)}><ChevronLeft /></Button><span>Page {page + 1} of {pageCount}</span><Button variant="outline" aria-label="Next page" className="h-7 w-7 p-0 hover:bg-muted" disabled={page + 1 >= pageCount} onClick={() => setPage((previous) => previous + 1)}><ChevronRight /></Button></div></div>
      </section>
    </div>
    <footer className="sticky bottom-0 z-30 flex justify-between border-t border-border bg-card px-4 py-3 sm:px-6"><Button variant="outline" size="sm" onClick={() => navigate("/")} className="hover:bg-muted"><Menu />Menu</Button><Button variant="outline" size="sm" onClick={back} className="hover:bg-muted"><ArrowLeft />Back</Button></footer>
  </div>;
}