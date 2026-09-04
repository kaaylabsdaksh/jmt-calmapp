import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Filter, MoreHorizontal, Plus, RotateCcw, Search } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { cn } from "@/lib/utils";

const microLabel =
  "text-[10px] font-medium uppercase tracking-wide text-muted-foreground";

const Section = ({
  title,
  description,
  usage,
  children,
}: {
  title: string;
  description: string;
  usage: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border bg-card shadow-sm">
    <div className="border-b bg-muted/40 px-4 py-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
        {description}
      </p>
    </div>
    <div className="px-4 py-4">{children}</div>
    <div className="border-t bg-muted/20 px-4 py-2">
      <code className="text-[10px] text-muted-foreground">{usage}</code>
    </div>
  </section>
);

/* ---------------- Dialog pattern ---------------- */

const DialogPattern = () => {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("Acme Utilities");
  const [site, setSite] = useState("North Yard");
  const [start, setStart] = useState("09/08/2026");
  const [end, setEnd] = useState("09/12/2026");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 text-xs">
            Open example dialog
          </Button>
        </DialogTrigger>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="space-y-1 border-b bg-muted/40 px-4 py-3">
            <DialogTitle className="text-sm font-semibold">
              Quick add example
            </DialogTitle>
            <p className="text-[11px] leading-snug text-muted-foreground">
              Header band with an inline hint, compact two-column body, footer
              action bar.
            </p>
          </DialogHeader>

          <div className="space-y-3 px-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className={microLabel}>
                  Customer <span className="text-destructive">*</span>
                </Label>
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger className="h-7 rounded-md bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Acme Utilities", "Northline Power", "Riverbend Co-op"].map(
                      (c) => (
                        <SelectItem key={c} value={c} className="text-xs">
                          {c}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className={microLabel}>Site</Label>
                <Select value={site} onValueChange={setSite}>
                  <SelectTrigger className="h-7 rounded-md bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["North Yard", "South Depot", "Substation 4"].map((l) => (
                      <SelectItem key={l} value={l} className="text-xs">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className={microLabel}>Window start</Label>
                <ModernDatePicker
                  size="sm"
                  value={start}
                  onChange={(d) =>
                    setStart(d ? d.toLocaleDateString("en-US") : "")
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className={microLabel}>Window end</Label>
                <ModernDatePicker
                  size="sm"
                  value={end}
                  onChange={(d) => setEnd(d ? d.toLocaleDateString("en-US") : "")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className={microLabel}>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional"
                className="min-h-14 resize-none rounded-md text-xs"
              />
            </div>
          </div>

          <DialogFooter className="border-t bg-muted/30 px-4 py-2.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 bg-green-600 text-white hover:bg-green-700 text-xs"
              onClick={() => setOpen(false)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ul className="space-y-1 text-[11px] text-muted-foreground">
        <li>Content: `gap-0 p-0 overflow-hidden sm:max-w-md`</li>
        <li>Header: `border-b bg-muted/40 px-4 py-3`, title `text-sm font-semibold`</li>
        <li>Body: `space-y-3 px-4 py-3`, two-column `grid-cols-2 gap-3`</li>
        <li>Footer: `border-t bg-muted/30 px-4 py-2.5`</li>
      </ul>
    </div>
  );
};

/* ---------------- Footer action bar pattern ---------------- */

const FooterPattern = () => (
  <div className="space-y-4">
    <div>
      <p className="mb-2 text-[11px] font-medium text-foreground">
        Standard page footer — Cancel + Save, secondary actions left
      </p>
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-background px-4 py-6 text-center text-[11px] text-muted-foreground">
          Form content
        </div>
        <div className="flex items-center justify-between border-t bg-background px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
            <MoreHorizontal className="h-3.5 w-3.5" />
            More
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 bg-green-600 text-white hover:bg-green-700 text-xs"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <p className="mb-2 text-[11px] font-medium text-foreground">
        Dialog footer bar — muted band, right-aligned
      </p>
      <div className="flex justify-end gap-2 rounded-lg border-t bg-muted/30 px-4 py-2.5">
        <Button variant="outline" size="sm" className="h-8 text-xs">
          Cancel
        </Button>
        <Button size="sm" className="h-8 text-xs">
          Add to queue
        </Button>
      </div>
    </div>
  </div>
);

/* ---------------- Filter pattern ---------------- */

const FilterPattern = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [division, setDivision] = useState("all");
  const [due, setDue] = useState("");
  const [hideCompleted, setHideCompleted] = useState(true);

  const activeCls = (isActive: boolean) =>
    cn(
      "h-7 rounded-md bg-background text-xs",
      isActive &&
        "border-slate-400 bg-slate-100 font-semibold text-slate-900"
    );

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card p-2">
        {/* Row 1 — search first, then grouped selects, primary action last */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[180px] flex-1">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, customers, PO…"
              className={cn(
                "h-7 rounded-md pl-7 text-xs",
                search && "border-slate-400 bg-slate-100 font-semibold text-slate-900"
              )}
            />
          </div>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className={cn("w-[140px]", activeCls(location !== "all"))}>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All locations</SelectItem>
              <SelectItem value="north" className="text-xs">North Yard</SelectItem>
              <SelectItem value="south" className="text-xs">South Depot</SelectItem>
            </SelectContent>
          </Select>

          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger className={cn("w-[140px]", activeCls(division !== "all"))}>
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All divisions</SelectItem>
              <SelectItem value="esl" className="text-xs">ESL</SelectItem>
              <SelectItem value="lab" className="text-xs">Lab</SelectItem>
            </SelectContent>
          </Select>

          <ModernDatePicker
            size="sm"
            value={due}
            onChange={(d) => setDue(d ? d.toLocaleDateString("en-US") : "")}
            className="w-[130px]"
            inputClassName={cn(
              due && "border-slate-400 bg-slate-100 font-semibold text-slate-900"
            )}
          />

          <Button size="sm" className="ml-auto h-7 gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        {/* Row 2 — count, saved filters, reset */}
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t pt-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={hideCompleted}
              onCheckedChange={setHideCompleted}
              className="scale-90"
            />
            <span className="text-[11px] text-muted-foreground">Hide completed</span>
          </div>
          <Badge
            variant="secondary"
            className="h-5 rounded-full px-2 text-[10px] font-medium"
          >
            42 results
          </Badge>

          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
              <Bookmark className="h-3.5 w-3.5" />
              Saved
              <span className="ml-0.5 rounded-full bg-muted px-1.5 text-[10px]">3</span>
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <ul className="space-y-1 text-[11px] text-muted-foreground">
        <li>Search sits first; grouped selects follow; primary “+ New” anchors the top row.</li>
        <li>Saved filters, “+” and Reset live in the secondary count row.</li>
        <li>Active filter styling: slate border, `bg-slate-100`, slate semibold text.</li>
        <li>All controls are `h-7` / `text-xs`; dates use `ModernDatePicker size="sm"`.</li>
      </ul>
    </div>
  );
};

/* ---------------- Text patterns ---------------- */

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-4 border-b py-2 last:border-b-0">
    <code className="w-56 shrink-0 pt-0.5 text-[10px] text-muted-foreground">{label}</code>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

const TypographyPattern = () => (
  <div>
    <Row label="text-lg font-semibold">
      <h1 className="text-lg font-semibold leading-tight text-foreground">Page title</h1>
    </Row>
    <Row label="text-sm font-semibold">
      <h2 className="text-sm font-semibold text-foreground">Section heading</h2>
    </Row>
    <Row label="text-xs font-medium">
      <h3 className="text-xs font-medium text-foreground">Sub-heading / card title</h3>
    </Row>
    <Row label="text-xs text-foreground">
      <p className="text-xs text-foreground">
        Body copy. Default reading size across dense screens.
      </p>
    </Row>
    <Row label="text-[11px] text-muted-foreground">
      <p className="text-[11px] leading-snug text-muted-foreground">
        Caption / helper copy sits one step below body and always muted.
      </p>
    </Row>
    <Row label={microLabel}>
      <span className={microLabel}>Micro label</span>
    </Row>
    <Row label="tabular-nums">
      <span className="text-xs tabular-nums text-foreground">1,248.50 · 09/12/2026</span>
    </Row>
  </div>
);

const FormTextPattern = () => (
  <div className="grid gap-4 sm:grid-cols-2">
    <div className="space-y-1">
      <Label className={microLabel}>
        Work order # <span className="text-destructive">*</span>
      </Label>
      <Input defaultValue="5432" className="h-7 text-xs" />
      <p className="text-[11px] leading-snug text-muted-foreground">
        Four digits, numeric only.
      </p>
    </div>
    <div className="space-y-1">
      <Label className={microLabel}>
        Account <span className="text-destructive">*</span>
      </Label>
      <Input
        defaultValue="ACME-"
        className="h-7 border-destructive text-xs focus-visible:ring-destructive"
      />
      <p className="text-[11px] leading-snug text-destructive">
        Enter a valid account number.
      </p>
    </div>
    <div className="space-y-1 sm:col-span-2">
      <Label className={microLabel}>Notes</Label>
      <Textarea
        placeholder="Optional — visible to the technician only"
        className="min-h-[56px] text-xs"
      />
      <p className="text-[11px] text-muted-foreground">Mandatory marker (*) always follows the label text.</p>
    </div>
  </div>
);

const EmptyStatePattern = () => (
  <div className="grid gap-3 sm:grid-cols-2">
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center">
      <Search className="mb-2 h-5 w-5 text-muted-foreground" />
      <p className="text-xs font-medium text-foreground">No results found</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        Try widening the date range or clearing a filter.
      </p>
      <Button variant="outline" size="sm" className="mt-3 h-7 text-xs">
        Clear filters
      </Button>
    </div>
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center">
      <Plus className="mb-2 h-5 w-5 text-muted-foreground" />
      <p className="text-xs font-medium text-foreground">Nothing here yet</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        Add your first record to get started.
      </p>
      <Button size="sm" className="mt-3 h-7 text-xs">
        Add new
      </Button>
    </div>
  </div>
);

const TruncationPattern = () => (
  <TooltipProvider delayDuration={200}>
    <div className="max-w-xs space-y-2">
      <div className={microLabel}>Equipment description</div>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="truncate text-xs text-foreground">
            Fluke 8846A 6.5 Digit Precision Multimeter with extended calibration
            accessories kit
          </p>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-[11px]">
          Fluke 8846A 6.5 Digit Precision Multimeter with extended calibration
          accessories kit
        </TooltipContent>
      </Tooltip>
      <p className="text-[11px] text-muted-foreground">
        Any truncated value carries a tooltip with the full text.
      </p>
    </div>
  </TooltipProvider>
);

const statusPills = [
  { label: "Active", dot: "bg-emerald-500", cls: "bg-emerald-50 text-emerald-700" },
  { label: "On Hold", dot: "bg-amber-500", cls: "bg-amber-50 text-amber-700" },
  { label: "Completed", dot: "bg-slate-400", cls: "bg-slate-100 text-slate-600" },
  { label: "Cancelled", dot: "bg-red-500", cls: "bg-red-50 text-red-700" },
];

const StatusTextPattern = () => (
  <div className="space-y-3">
    <div className="flex flex-wrap gap-2">
      {statusPills.map((s) => (
        <span
          key={s.label}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
            s.cls,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
          {s.label}
        </span>
      ))}
    </div>
    <div className="flex flex-wrap items-center gap-2 text-[11px]">
      <span className="rounded bg-red-50 px-1.5 py-0.5 font-medium text-red-700">Emergency</span>
      <span className="rounded bg-orange-50 px-1.5 py-0.5 font-medium text-orange-700">Expedite</span>
      <span className="rounded bg-yellow-50 px-1.5 py-0.5 font-medium text-yellow-700">Rush</span>
      <span className="text-muted-foreground">Normal — no badge</span>
    </div>
    <p className="text-[11px] text-muted-foreground">
      Soft pill background, colored text, small dot. No hover background.
    </p>
  </div>
);

const LinkTextPattern = () => (
  <div className="space-y-3">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
            <Link to="/design-system">Design System</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-xs font-medium text-foreground">Text patterns</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div className="flex flex-wrap items-center gap-4">
      <a className="text-xs font-medium text-foreground underline-offset-4 hover:underline" href="#">
        Inline link
      </a>
      <Link
        to="/design-system"
        className="text-xs font-medium text-slate-700 underline-offset-4 hover:underline"
      >
        Table cell link (e.g. work order #)
      </Link>
      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
        Button-as-link
      </Button>
    </div>
    <p className="text-[11px] text-muted-foreground">
      Links stay neutral (slate/foreground) — never brand yellow.
    </p>
  </div>
);

const DesignSystemGallery = () => (

  <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-20 border-b border-border bg-white px-4 py-3 lg:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-foreground hover:bg-muted" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold leading-tight text-foreground">
            Component Gallery
          </h1>
          <Breadcrumb className="mt-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs font-medium text-foreground">
                  Design System
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Badge variant="outline" className="gap-1 text-[10px]">
          <Filter className="h-3 w-3" />
          Reference only
        </Badge>
      </div>
    </header>

    <main className="mx-auto max-w-5xl space-y-4 p-4 lg:p-6">
      <Section
        title="Dialog"
        description="Header band with inline hint, compact two-column body, footer action bar."
        usage="@/components/ui/dialog · DialogContent sm:max-w-md gap-0 p-0 overflow-hidden"
      >
        <DialogPattern />
      </Section>

      <Section
        title="Footer action bar"
        description="Right-aligned Cancel (outline) then Save (green). Secondary actions on the left."
        usage="sticky bottom-0 border-t bg-background px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]"
      >
        <FooterPattern />
      </Section>

      <Section
        title="Filter row"
        description="Compact search-first filter bar with saved filters and reset in the secondary row."
        usage="h-7 controls · text-xs · ModernDatePicker size='sm' · active = slate-100 fill"
      >
        <FilterPattern />
      </Section>
    </main>
  </div>
);

export default DesignSystemGallery;
