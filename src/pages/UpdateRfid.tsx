import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Check,
  ChevronsUpDown,
  Loader2,
  Radio,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ mock data */

interface EquipmentRecord {
  id: string;
  reportNo: string;
  rfid: string;
  createdDate: string;
  itemStatus: string;
  manufacturer: string;
  model: string;
  mfgSerial: string;
  customerSerial: string;
  customerId: string;
}

const MANUFACTURERS = ["FLUKE", "DRUCK", "HART", "AMETEK", "MITUTOYO"];

const MODELS_BY_MFG: Record<string, string[]> = {
  FLUKE: ["10", "110", "115", "123", "287", "789"],
  DRUCK: ["DPI 620", "DPI 705"],
  HART: ["375", "475"],
  AMETEK: ["JOFRA ATC-140", "JOFRA RTC-157"],
  MITUTOYO: ["293-340-30", "500-196-30"],
};

const ALL_MODELS = Array.from(new Set(Object.values(MODELS_BY_MFG).flat())).sort();

const MOCK_RECORDS: EquipmentRecord[] = [
  { id: "1", reportNo: "0101.00-803349-001", rfid: "", createdDate: "06/12/2026", itemStatus: "Q/A Fail Log", manufacturer: "FLUKE", model: "789", mfgSerial: "test", customerSerial: "test", customerId: "test" },
  { id: "2", reportNo: "0101.00-803460-001", rfid: "RFID-000871", createdDate: "07/02/2026", itemStatus: "Estimate", manufacturer: "FLUKE", model: "789", mfgSerial: "test", customerSerial: "2345", customerId: "1234" },
  { id: "3", reportNo: "0101.00-803589-002", rfid: "", createdDate: "07/21/2026", itemStatus: "Ready for Departure", manufacturer: "FLUKE", model: "789", mfgSerial: "test", customerSerial: "4584", customerId: "1252" },
  { id: "4", reportNo: "15000.00-803437-001", rfid: "RFID-001033", createdDate: "08/04/2026", itemStatus: "Cancelled", manufacturer: "FLUKE", model: "789", mfgSerial: "test", customerSerial: "test", customerId: "test" },
  { id: "5", reportNo: "00000.00-254315-002", rfid: "", createdDate: "08/11/2026", itemStatus: "In Lab", manufacturer: "FLUKE", model: "789", mfgSerial: "test", customerSerial: "2345", customerId: "1234" },
  { id: "6", reportNo: "00000.00-803370-001", rfid: "", createdDate: "08/19/2026", itemStatus: "Lab Management", manufacturer: "FLUKE", model: "789", mfgSerial: "test", customerSerial: "4584", customerId: "1252" },
  { id: "7", reportNo: "0101.00-803611-004", rfid: "RFID-001180", createdDate: "08/24/2026", itemStatus: "Q/A Inspection", manufacturer: "FLUKE", model: "789", mfgSerial: "test", customerSerial: "test", customerId: "1252" },
  { id: "8", reportNo: "0101.00-803622-001", rfid: "", createdDate: "08/28/2026", itemStatus: "Waiting on Customer", manufacturer: "FLUKE", model: "789", mfgSerial: "test", customerSerial: "2345", customerId: "test" },
];

/* RFID already assigned elsewhere in the system (duplicate check) */
const EXISTING_RFIDS = new Set(
  MOCK_RECORDS.filter((r) => r.rfid).map((r) => r.rfid.toUpperCase()).concat(["RFID-009999"])
);

const RFID_PATTERN = /^[A-Za-z0-9-]{4,24}$/;

const STATUS_TONE: Record<string, string> = {
  "Q/A Fail Log": "bg-rose-50 text-rose-700",
  Estimate: "bg-amber-50 text-amber-700",
  "Ready for Departure": "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-slate-100 text-slate-500",
  "In Lab": "bg-blue-50 text-blue-700",
  "Lab Management": "bg-indigo-50 text-indigo-700",
  "Q/A Inspection": "bg-violet-50 text-violet-700",
  "Waiting on Customer": "bg-orange-50 text-orange-700",
};

/* ------------------------------------------------------------------ combobox */

const Combobox = ({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  id?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between bg-background font-normal text-sm",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => {
                    onChange(opt === value ? "" : opt);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Check className={cn("mr-2 h-3.5 w-3.5", value === opt ? "opacity-100" : "opacity-0")} />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* ------------------------------------------------------------------ page */

type SortKey = "reportNo" | "createdDate" | "itemStatus" | "rfid";

const UpdateRfid = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [formError, setFormError] = useState("");

  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [records, setRecords] = useState<EquipmentRecord[]>([]);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "createdDate", dir: "desc" });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newRfid, setNewRfid] = useState("");
  const [rfidError, setRfidError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState<{ reportNo: string; previous: string; next: string } | null>(null);

  const modelOptions = manufacturer ? MODELS_BY_MFG[manufacturer] ?? [] : ALL_MODELS;
  const selected = records.find((r) => r.id === selectedIds[0]) ?? null;
  const isRowSelected = (id: string) => selectedIds.includes(id);
  const allSelected = sorted.length > 0 && sorted.every((r) => selectedIds.includes(r.id));

  const sorted = useMemo(() => {
    const copy = [...records];
    copy.sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return copy;
  }, [records, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  const handleSearch = () => {
    if (!model.trim() || !serial.trim()) {
      setFormError("Please enter a model and serial number to continue.");
      toast.error("Model and manufacturer serial number are required.");
      return;
    }
    setFormError("");
    setSearching(true);
    setSelectedId(null);
    setSuccess(null);
    setNewRfid("");
    setRfidError("");

    window.setTimeout(() => {
      const results = MOCK_RECORDS.filter(
        (r) =>
          (!manufacturer || r.manufacturer === manufacturer) &&
          r.model.toLowerCase() === model.trim().toLowerCase() &&
          r.mfgSerial.toLowerCase() === serial.trim().toLowerCase()
      );
      setRecords(results);
      setSearching(false);
      setHasSearched(true);
    }, 700);
  };

  const clearSelection = () => {
    setSelectedId(null);
    setNewRfid("");
    setRfidError("");
    setSuccess(null);
  };

  const handleUpdate = () => {
    if (!selected) return;
    const value = newRfid.trim();
    if (!value) {
      setRfidError("RFID cannot be empty.");
      return;
    }
    if (!RFID_PATTERN.test(value)) {
      setRfidError("RFID must be 4–24 characters using letters, numbers, or dashes.");
      return;
    }
    if (EXISTING_RFIDS.has(value.toUpperCase()) && value.toUpperCase() !== selected.rfid.toUpperCase()) {
      setRfidError("This RFID is already assigned to another equipment record.");
      toast.error("This RFID is already assigned to another equipment record.");
      return;
    }
    setRfidError("");
    setUpdating(true);

    window.setTimeout(() => {
      const previous = selected.rfid;
      setRecords((rs) => rs.map((r) => (r.id === selected.id ? { ...r, rfid: value } : r)));
      EXISTING_RFIDS.add(value.toUpperCase());
      setUpdating(false);
      setSuccess({ reportNo: selected.reportNo, previous, next: value });
      toast.success("RFID updated successfully.", {
        description: `${selected.reportNo} · ${previous || "—"} → ${value}`,
      });
    }, 700);
  };

  const canUpdate = !!selected && !!newRfid.trim() && !updating;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <header className="sticky top-0 z-20 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted" />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-tight text-foreground">Update RFID</h1>
            <Breadcrumb className="mt-0.5">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-xs text-muted-foreground">
                    <Link to="/">Equipment</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-medium text-foreground">Update RFID</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1600px] space-y-4 px-4 py-5 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Search for equipment by manufacturer, model, and serial number, then assign or update its RFID.
        </p>

        {/* 1. Find equipment */}
        <section className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">Find Equipment</h2>
          </div>
          <div
            className="p-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
              <div className="space-y-1.5">
                <Label htmlFor="rfid-mfg" className="text-xs font-medium text-foreground">
                  Manufacturer
                </Label>
                <Combobox
                  id="rfid-mfg"
                  value={manufacturer}
                  onChange={(v) => {
                    setManufacturer(v);
                    setModel("");
                  }}
                  options={MANUFACTURERS}
                  placeholder="Select manufacturer"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rfid-model" className="text-xs font-medium text-foreground">
                  Model <span className="text-destructive">*</span>
                </Label>
                <Combobox
                  id="rfid-model"
                  value={model}
                  onChange={setModel}
                  options={modelOptions}
                  placeholder="Select model"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rfid-serial" className="text-xs font-medium text-foreground">
                  Manufacturer Serial Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rfid-serial"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="Enter manufacturer serial number"
                  className="h-9 text-sm"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="h-9 bg-green-600 px-6 text-white hover:bg-green-700"
              >
                {searching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {searching ? "Searching…" : "Search"}
              </Button>
            </div>

            {formError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {formError}
              </p>
            )}
          </div>
        </section>

        {/* 2. Results */}
        {searching && (
          <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="mb-3 text-sm text-muted-foreground">Searching equipment…</p>
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </section>
        )}

        {!searching && !hasSearched && (
          <section className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <Radio className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Search for equipment to update its RFID.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Start with the model and manufacturer serial number above.
            </p>
          </section>
        )}

        {!searching && hasSearched && records.length === 0 && (
          <section className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
            <AlertCircle className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No equipment found.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try checking the manufacturer, model, or serial number and search again.
            </p>
          </section>
        )}

        {!searching && records.length > 0 && (
          <section className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">Matching Equipment</h2>
              <span className="text-xs text-muted-foreground">{records.length} records</span>
            </div>

            <div className="max-h-[430px] overflow-auto">
              <table className="w-full min-w-[1100px] border-collapse text-xs">
                <thead className="sticky top-0 z-10 bg-muted/60">
                  <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="w-10 px-3 py-2" />
                    <SortableTh label="Report #" active={sort.key === "reportNo"} onClick={() => toggleSort("reportNo")} />
                    <SortableTh label="RFID" active={sort.key === "rfid"} onClick={() => toggleSort("rfid")} />
                    <SortableTh label="Created Date" active={sort.key === "createdDate"} onClick={() => toggleSort("createdDate")} />
                    <SortableTh label="Item Status" active={sort.key === "itemStatus"} onClick={() => toggleSort("itemStatus")} />
                    <th className="whitespace-nowrap px-3 py-2 font-medium">Manufacturer</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">Model</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">Mfg Serial</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">Customer Serial</th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium">Customer ID</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => {
                    const isSelected = r.id === selectedId;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => {
                          setSelectedId(r.id);
                          setSuccess(null);
                          setRfidError("");
                        }}
                        className={cn(
                          "cursor-pointer border-b border-border/70 transition-colors hover:bg-muted/40",
                          isSelected && "bg-primary/10 hover:bg-primary/10"
                        )}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="radio"
                            name="equipment"
                            checked={isSelected}
                            onChange={() => setSelectedId(r.id)}
                            aria-label={`Select ${r.reportNo}`}
                            className="h-3.5 w-3.5 accent-green-600"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <Link
                            to={`/edit-order`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium text-foreground underline-offset-2 hover:underline"
                          >
                            {r.reportNo}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px]">
                          {r.rfid || <span className="text-muted-foreground">Not Assigned</span>}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.createdDate}</td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "rounded-full border-0 px-2 py-0.5 text-[10px] font-medium hover:bg-inherit",
                              STATUS_TONE[r.itemStatus] ?? "bg-slate-100 text-slate-600"
                            )}
                          >
                            {r.itemStatus}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{r.manufacturer}</td>
                        <td className="whitespace-nowrap px-3 py-2">{r.model}</td>
                        <td className="whitespace-nowrap px-3 py-2">{r.mfgSerial}</td>
                        <td className="whitespace-nowrap px-3 py-2">{r.customerSerial}</td>
                        <td className="whitespace-nowrap px-3 py-2">{r.customerId}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </section>
        )}

        {/* 3 + 4. Selection summary and RFID assignment */}
        {records.length > 0 && (
          <section
            className={cn(
              "rounded-lg border bg-card shadow-sm transition-opacity",
              selected ? "border-border opacity-100" : "border-dashed border-border opacity-60"
            )}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <Radio className="h-3.5 w-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">RFID Assignment</h2>
            </div>

            {!selected ? (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                Select an equipment record above to assign or update its RFID.
              </p>
            ) : success ? (
              <div className="p-4">
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-800">RFID Updated Successfully</p>
                  </div>
                  <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1.5 text-xs sm:grid-cols-3">
                    <SummaryItem label="Report #" value={success.reportNo} />
                    <SummaryItem label="Previous RFID" value={success.previous || "—"} />
                    <SummaryItem label="New RFID" value={success.next} />
                  </dl>
                  <p className="mt-3 text-[11px] text-emerald-700">
                    Change recorded in the item audit history — {new Date().toLocaleString()} · D. Panchal
                  </p>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button className="h-8 bg-green-600 text-white hover:bg-green-700" onClick={clearSelection}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {/* Assignment */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Current RFID</Label>
                    <Input
                      value={selected.rfid || "Not Assigned"}
                      readOnly
                      disabled
                      className="h-9 bg-muted/50 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-rfid" className="text-xs font-medium text-foreground">
                      New RFID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="new-rfid"
                      value={newRfid}
                      autoFocus
                      onChange={(e) => {
                        setNewRfid(e.target.value);
                        if (rfidError) setRfidError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canUpdate) handleUpdate();
                      }}
                      placeholder="Enter new RFID"
                      className={cn("h-9 text-sm", rfidError && "border-destructive")}
                    />
                    {rfidError ? (
                      <p className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {rfidError}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        Enter the RFID that should be assigned to this equipment.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 border-t border-border pt-3">
                    <Button variant="outline" className="h-8" onClick={clearSelection} disabled={updating}>
                      <X className="mr-1.5 h-3.5 w-3.5" />
                      Clear Selection
                    </Button>
                    <Button
                      className="h-8 bg-green-600 text-white hover:bg-green-700"
                      disabled={!canUpdate}
                      onClick={handleUpdate}
                    >
                      {updating && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                      {updating ? "Updating RFID…" : "Update RFID"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

const SortableTh = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <th className="whitespace-nowrap px-3 py-2 font-medium">
    <button
      type="button"
      onClick={onClick}
      className={cn("flex items-center gap-1 uppercase hover:text-foreground", active && "text-foreground")}
    >
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-60" />
    </button>
  </th>
);

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
    <dd className="font-medium text-foreground">{value}</dd>
  </div>
);

export default UpdateRfid;
