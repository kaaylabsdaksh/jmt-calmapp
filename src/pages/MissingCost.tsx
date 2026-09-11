import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  UploadCloud,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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

const LOCATIONS = [
  "All Locations",
  "Baton Rouge, LA",
  "Houston, TX",
  "Beaumont, TX",
  "Lake Charles, LA",
  "Mobile, AL",
  "Corpus Christi, TX",
];

const DIVISIONS = [
  "ESL",
  "OnSite",
  "MFG",
  "ITL",
  "Rental",
  "Lab",
  "Surplus",
  "ESL Onsite",
  "ITL Onsite",
];

type UploadState = "empty" | "selected" | "uploading" | "success" | "failed";

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function MissingCost() {
  /* -------------------------------------------------------------- export */
  const [workOrders, setWorkOrders] = useState("");
  const [missingCostOnly, setMissingCostOnly] = useState(true);
  const [location, setLocation] = useState("All Locations");
  const [locationOpen, setLocationOpen] = useState(false);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [divisionsOpen, setDivisionsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const toggleDivision = (d: string) =>
    setDivisions((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const parsedWos = workOrders
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

  const canExport = !exporting && parsedWos.length > 0;

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      toast({ title: "Export started", description: `${parsedWos.length > 0 ? `${parsedWos.length} work order(s)` : "All work orders"} · ${
          divisions.length > 0 ? divisions.join(", ") : "All divisions"
        } · ${location}` });
    }, 800);
  };

  const handleReset = () => {
    setWorkOrders("");
    setMissingCostOnly(true);
    setLocation("All Locations");
    setDivisions([]);
    toast({ title: "Export filters reset" });
  };

  /* -------------------------------------------------------------- import */
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("empty");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = (f: File | undefined | null) => {
    if (!f) return;
    const ok = /\.(xlsx|xls|csv)$/i.test(f.name);
    if (!ok) {
      setUploadState("failed");
      toast({ title: "Unsupported file", description: "Please upload an XLSX, XLS or CSV file.", variant: "destructive" });
      return;
    }
    setFile(f);
    setUploadState("selected");
  };

  const handleImport = () => {
    if (!file) return;
    setUploadState("uploading");
    setTimeout(() => {
      setUploadState("success");
      toast({ title: "Import complete", description: `${file.name} processed successfully.` });
    }, 1200);
  };

  const clearFile = () => {
    setFile(null);
    setUploadState("empty");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted" />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-tight text-foreground">Missing Cost</h1>
            <Breadcrumb className="mt-0.5">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-xs text-muted-foreground">
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-xs text-muted-foreground">
                    <Link to="/">Work Order</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-medium text-foreground">Missing Cost</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* ------------------------------------------------ export section */}
            <section className="border-b border-border p-8 lg:col-span-7 lg:border-b-0 lg:border-r lg:border-border">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground">Export Missing Cost Data</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Export work order items with missing cost information for review and update.
                </p>
              </div>

              <div className="space-y-6">
                {/* Work Order numbers */}
                <div className="space-y-2">
                  <Label htmlFor="wo-numbers" className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Work Order #
                  </Label>
                  <Textarea
                    id="wo-numbers"
                    value={workOrders}
                    onChange={(e) => setWorkOrders(e.target.value)}
                    placeholder="Enter work order numbers..."
                    className="min-h-[120px] resize-none rounded-xl border-border bg-secondary/30 p-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Missing cost only */}
                <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <Checkbox
                    id="missing-cost-only"
                    checked={missingCostOnly}
                    onCheckedChange={(v) => setMissingCostOnly(v === true)}
                    disabled={parsedWos.length === 0}
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="missing-cost-only" className="cursor-pointer text-sm font-semibold text-foreground">
                      Missing Cost Only
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      When enabled, only items with missing cost will be included.
                    </p>
                  </div>
                </div>

                {/* Location + Divisions */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Location */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-foreground">Location</Label>
                    <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={locationOpen}
                          className="h-11 w-full justify-between rounded-xl border-border bg-secondary/30 text-sm font-normal"
                        >
                          {location}
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search locations..." className="h-9 text-sm" />
                          <CommandList>
                            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                              No location found.
                            </CommandEmpty>
                            <CommandGroup>
                              {LOCATIONS.map((loc) => (
                                <CommandItem
                                  key={loc}
                                  value={loc}
                                  onSelect={() => {
                                    setLocation(loc);
                                    setLocationOpen(false);
                                  }}
                                  className="text-sm"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-3.5 w-3.5",
                                      location === loc ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {loc}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Divisions */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-foreground">Division(s)</Label>
                    <Popover open={divisionsOpen} onOpenChange={setDivisionsOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={divisionsOpen}
                          className="h-11 w-full justify-between rounded-xl border-border bg-secondary/30 text-sm font-normal"
                        >
                          <span className={cn(divisions.length === 0 && "text-muted-foreground")}>
                            {divisions.length === 0
                              ? "All Divisions"
                              : `${divisions.length} division${divisions.length > 1 ? "s" : ""} selected`}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search divisions..." className="h-9 text-sm" />
                          <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[11px]"
                              onClick={() => setDivisions([...DIVISIONS])}
                            >
                              Select All
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[11px]"
                              onClick={() => setDivisions([])}
                            >
                              Clear All
                            </Button>
                          </div>
                          <CommandList>
                            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                              No division found.
                            </CommandEmpty>
                            <CommandGroup>
                              {DIVISIONS.map((d) => (
                                <CommandItem
                                  key={d}
                                  value={d}
                                  onSelect={() => toggleDivision(d)}
                                  className="gap-2 text-sm"
                                >
                                  <Checkbox checked={divisions.includes(d)} className="pointer-events-none" />
                                  {d}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {divisions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {divisions.map((d) => (
                          <Badge
                            key={d}
                            variant="secondary"
                            className="gap-1 rounded-full px-2 py-0.5 text-[11px] font-normal"
                          >
                            {d}
                            <button
                              type="button"
                              aria-label={`Remove ${d}`}
                              onClick={() => toggleDivision(d)}
                              className="rounded-full text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-end gap-3 border-t border-border pt-6">
                <Button variant="outline" size="default" onClick={handleReset} disabled={exporting}>
                  <RotateCcw className="mr-1.5 h-4 w-4" />
                  Reset
                </Button>
                <Button size="default" onClick={handleExport} disabled={!canExport}>
                  {exporting ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-1.5 h-4 w-4" />
                  )}
                  Export Data
                </Button>
              </div>
            </section>

            {/* ------------------------------------------------ import section */}
            <section className="bg-muted/30 p-8 lg:col-span-5">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground">Import Updated Data</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload the spreadsheet containing updated missing cost information.
                </p>
              </div>

              <div className="relative">
                {uploadState === "empty" || uploadState === "failed" ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      acceptFile(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                      "flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card p-8 text-center transition-colors",
                      dragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    )}
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary/10">
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Drag &amp; drop your spreadsheet here</h3>
                    <p className="mt-1 text-xs text-muted-foreground">or browse from your computer</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                      }}
                    >
                      Browse Files
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-md bg-muted p-2">
                        <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{file?.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {file?.name.split(".").pop()?.toUpperCase()} · {formatSize(file?.size ?? 0)}
                        </p>
                      </div>
                      {uploadState !== "uploading" && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={clearFile}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    {uploadState === "uploading" && (
                      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Uploading and processing...
                      </p>
                    )}
                    {uploadState === "success" && (
                      <p className="mt-4 flex items-center gap-2 text-xs text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Upload successful — missing cost update process triggered.
                      </p>
                    )}
                  </div>
                )}

                {(uploadState === "empty" || uploadState === "failed") && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>XLSX</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>XLS</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>CSV</span>
                  </div>
                )}

                {uploadState === "failed" && (
                  <p className="mt-3 flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Upload failed. Please select an XLSX, XLS or CSV file.
                  </p>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                />
              </div>

              <div className="mt-10 flex items-center justify-end gap-3 border-t border-border pt-6">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={clearFile}
                  disabled={uploadState === "empty" || uploadState === "uploading"}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Remove
                </Button>
                <Button
                  size="default"
                  onClick={handleImport}
                  disabled={!file || uploadState === "uploading" || uploadState === "success"}
                >
                  {uploadState === "uploading" ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="mr-1.5 h-4 w-4" />
                  )}
                  Import
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
