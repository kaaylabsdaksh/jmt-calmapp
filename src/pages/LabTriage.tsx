import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Hourglass, Archive, UserRoundSearch, ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Bucket = "overdue" | "today" | "due-soon" | "on-track";

interface TriageRow {
  slaDays: number;
  bucket: Bucket;
  wo: string;
  woSub: string;
  item: string;
  itemSub?: string;
  status: string;
  customer: string;
  customerSub: string;
  discipline: string;
  location: string;
  division: string;
  priority: "Normal" | "Rush" | "Expedite" | "Emergency";
  assigned: string;
}

const KPIS = [
  {
    label: "In the lab now",
    value: "112",
    sub: "85 overdue · 14 due soon",
    icon: null,
    tone: "border-border bg-card",
    valueTone: "text-foreground",
  },
  {
    label: "Stale > 1yr",
    value: "5,390",
    sub: "no status change in 12 mo",
    icon: Archive,
    tone: "border-amber-300 bg-amber-50",
    valueTone: "text-amber-700",
  },
  {
    label: "Backlog",
    value: "674",
    sub: "worked, SLA > 90d past",
    icon: Hourglass,
    tone: "border-rose-200 bg-rose-50",
    valueTone: "text-rose-700",
  },
  {
    label: "Unassigned",
    value: "6,025",
    sub: "no tech assigned (of 6,488)",
    icon: UserRoundSearch,
    tone: "border-border bg-card",
    valueTone: "text-foreground",
  },
];

const DISCIPLINES = [
  { code: "B - Mech Pressure", overdue: 30, today: 0, onTrack: 4, n: 34 },
  { code: "Unassigned lab", overdue: 22, today: 0, onTrack: 3, n: 25 },
  { code: "G - Electronics", overdue: 5, today: 0, onTrack: 13, n: 18 },
  { code: "P - Temperature", overdue: 7, today: 0, onTrack: 2, n: 9 },
  { code: "H - Analytical/Other", overdue: 5, today: 0, onTrack: 1, n: 6 },
  { code: "C - Dimensional", overdue: 5, today: 0, onTrack: 0, n: 5 },
  { code: "M - Multimeters/Meters", overdue: 4, today: 0, onTrack: 0, n: 4 },
  { code: "N - Electrical Test Gear", overdue: 2, today: 0, onTrack: 2, n: 4 },
  { code: "F - Digital Pressure", overdue: 2, today: 0, onTrack: 0, n: 2 },
];

const ROWS: TriageRow[] = [
  { slaDays: 90, bucket: "overdue", wo: "#803628-Blankets", woSub: "1 of 2", item: "—", status: "In Lab", customer: "Newtron LLC", customerSub: "Baton Rouge, LA", discipline: "—", location: "Baton Rouge", division: "ESL", priority: "Normal", assigned: "Unassigned" },
  { slaDays: 90, bucket: "overdue", wo: "#803630-Blankets", woSub: "1 of 2", item: "—", status: "In Lab", customer: "Entergy Inventory", customerSub: "Baton Rouge, LA", discipline: "—", location: "Alexandria", division: "ESL", priority: "Normal", assigned: "Unassigned" },
  { slaDays: 89, bucket: "overdue", wo: "#405078-Matting", woSub: "4 of 4", item: "—", status: "In Lab", customer: "J M Test Systems ODX Lab STD", customerSub: "Odessa, TX", discipline: "—", location: "Alexandria", division: "ESL", priority: "Normal", assigned: "Unassigned" },
  { slaDays: 89, bucket: "overdue", wo: "#803502-012", woSub: "11 of 28", item: "783 POSITECTOR 6000 F PROBE", itemSub: "SN MFGET", status: "In Lab", customer: "Total Petrochem SMD", customerSub: "Carville, LA", discipline: "C — Dimensional", location: "Alexandria", division: "Lab", priority: "Normal", assigned: "Unassigned" },
  { slaDays: 88, bucket: "overdue", wo: "#803643-CoverUps", woSub: "", item: "—", status: "In Lab", customer: "Entergy Inventory", customerSub: "Baton Rouge, LA", discipline: "—", location: "Alexandria", division: "ESL", priority: "Normal", assigned: "Unassigned" },
  { slaDays: 87, bucket: "overdue", wo: "#803648-004", woSub: "4 of 6", item: "RH520A", itemSub: "SN N/A", status: "In Lab", customer: "Exxon/Mobil Chem Polyolefins", customerSub: "Baton Rouge, LA", discipline: "P — Temperature", location: "Baton Rouge", division: "OnSite", priority: "Rush", assigned: "Unassigned" },
  { slaDays: 87, bucket: "overdue", wo: "#803502-011", woSub: "10 of 28", item: "355-AI2000-04103003", itemSub: "SN N/A", status: "In Lab", customer: "Total Petrochem SMD", customerSub: "Carville, LA", discipline: "F — Digital Pressure", location: "Baton Rouge", division: "Lab", priority: "Normal", assigned: "Unassigned" },
  { slaDays: 87, bucket: "overdue", wo: "#803648-003", woSub: "3 of 6", item: "ASTM 54F", itemSub: "SN N/A", status: "In Lab", customer: "Exxon/Mobil Chem Polyolefins", customerSub: "Baton Rouge, LA", discipline: "P — Temperature", location: "Baton Rouge", division: "OnSite", priority: "Rush", assigned: "Unassigned" },
  { slaDays: 12, bucket: "due-soon", wo: "#803711-002", woSub: "2 of 5", item: "FLUKE 87V", itemSub: "SN 4471223", status: "In Lab", customer: "Dow Chemical", customerSub: "Plaquemine, LA", discipline: "M — Multimeters/Meters", location: "Baton Rouge", division: "Lab", priority: "Normal", assigned: "Unassigned" },
  { slaDays: 5, bucket: "on-track", wo: "#803755-001", woSub: "1 of 3", item: "AMPROBE ACD-14", itemSub: "SN 88120", status: "In Lab", customer: "Shell Geismar", customerSub: "Geismar, LA", discipline: "N — Electrical Test Gear", location: "Alexandria", division: "Lab", priority: "Expedite", assigned: "R. Alvarez" },
];

const TABS: { key: "all" | Bucket; label: string; count: number }[] = [
  { key: "all", label: "All live", count: 112 },
  { key: "overdue", label: "Overdue", count: 85 },
  { key: "today", label: "Today", count: 0 },
  { key: "due-soon", label: "Due soon", count: 14 },
  { key: "on-track", label: "On track", count: 13 },
];

const FILTERS = [
  { label: "Most overdue", options: ["Most overdue", "Newest", "Oldest"] },
  { label: "All labs", options: ["All labs", "Baton Rouge", "Alexandria"] },
  { label: "All statuses", options: ["All statuses", "In Lab", "On Hold"] },
  { label: "All customers", options: ["All customers", "Entergy Inventory", "Dow Chemical"] },
  { label: "All techs", options: ["All techs", "Unassigned", "R. Alvarez"] },
  { label: "All locations", options: ["All locations", "Baton Rouge", "Alexandria"] },
  { label: "All divisions", options: ["All divisions", "Lab", "ESL", "OnSite"] },
  { label: "All Priority", options: ["All Priority", "Normal", "Rush", "Expedite", "Emergency"] },
];

const priorityTone: Record<TriageRow["priority"], string> = {
  Normal: "text-muted-foreground",
  Rush: "text-amber-600",
  Expedite: "text-orange-600",
  Emergency: "text-rose-600",
};

const LabTriage = () => {
  const [tab, setTab] = useState<"all" | Bucket>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter((r) => (tab === "all" ? true : r.bucket === tab)).filter((r) =>
      !q
        ? true
        : [r.wo, r.item, r.customer, r.discipline].some((v) => v.toLowerCase().includes(q))
    );
  }, [tab, query]);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-foreground transition-all hover:bg-muted" />
          <div>
            <h1 className="text-lg font-semibold leading-tight text-foreground">Lab Triage</h1>
            <Breadcrumb className="mt-1">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-xs text-muted-foreground">
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-medium text-foreground">Triage</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>

      {/* KPI row */}
      <section className="border-b border-border bg-card px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {KPIS.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className={cn("min-w-[190px] rounded-lg border px-4 py-3", k.tone)}>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                    {k.label}
                  </div>
                  <div className={cn("mt-1 text-3xl font-bold leading-none", k.valueTone)}>{k.value}</div>
                  <div className="mt-1.5 text-[11px] text-muted-foreground">{k.sub}</div>
                </div>
              );
            })}
          </div>
          <div className="text-right text-[11px] leading-relaxed text-muted-foreground">
            6,488 active-lab WOs · anchored 2026-09-01
            <br />
            CALMAPP (live)
          </div>
        </div>
      </section>

      {/* Discipline strip */}
      <section className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex flex-1 gap-3 overflow-x-auto pb-2">
            {DISCIPLINES.map((d) => (
              <button
                key={d.code}
                type="button"
                className="min-w-[195px] shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:border-foreground/30"
              >
                <div className="text-xs font-semibold text-foreground">{d.code}</div>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1 text-sm font-semibold">
                    <span className="text-rose-600">{d.overdue}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-amber-600">{d.today}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-emerald-600">{d.onTrack}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">n={d.n}</span>
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  Overdue / Today / On-track
                </div>
              </button>
            ))}
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search WO#, customer, item..."
              className="h-9 pl-9 text-sm"
            />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sort</span>
          {FILTERS.map((f) => (
            <Select key={f.label} defaultValue={f.options[0]}>
              <SelectTrigger className="h-9 w-auto min-w-[130px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                {f.options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border bg-card px-6">
        <div className="flex items-center gap-6">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 border-b-2 py-3 text-sm transition-colors",
                  active
                    ? "border-primary font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full px-2 py-0 text-[11px] font-medium",
                    active ? "bg-primary/30 text-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {t.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </section>

      {/* Table */}
      <section className="px-6 py-4">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="w-[110px] px-4 py-3 text-left font-medium">SLA</th>
                  <th className="px-4 py-3 text-left font-medium">WO #</th>
                  <th className="px-4 py-3 text-left font-medium">Item</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Lab Discipline</th>
                  <th className="px-4 py-3 text-left font-medium">Location</th>
                  <th className="px-4 py-3 text-left font-medium">Division</th>
                  <th className="px-4 py-3 text-left font-medium">Priority</th>
                  <th className="px-4 py-3 text-left font-medium">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.wo}-${i}`} className="border-b border-border/70 last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-5 w-1 rounded-sm",
                            r.bucket === "overdue"
                              ? "bg-rose-500"
                              : r.bucket === "due-soon"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          )}
                        />
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-medium",
                            r.bucket === "overdue"
                              ? "bg-rose-100 text-rose-700"
                              : r.bucket === "due-soon"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          {r.bucket === "overdue" ? `${r.slaDays}d late` : `${r.slaDays}d left`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/" className="font-medium text-blue-600 hover:underline">
                        {r.wo}
                      </Link>
                      {r.woSub && <div className="text-[11px] text-muted-foreground">{r.woSub}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{r.item}</div>
                      {r.itemSub && <div className="text-[11px] text-muted-foreground">{r.itemSub}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">{r.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{r.customer}</div>
                      <div className="text-[11px] text-muted-foreground">{r.customerSub}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.discipline}</td>
                    <td className="px-4 py-3 text-foreground">{r.location}</td>
                    <td className="px-4 py-3 text-foreground">{r.division}</td>
                    <td className={cn("px-4 py-3", priorityTone[r.priority])}>{r.priority}</td>
                    <td className="px-4 py-3">
                      <Select defaultValue={r.assigned}>
                        <SelectTrigger className="h-8 w-[150px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-popover">
                          <SelectItem value="Unassigned">Unassigned</SelectItem>
                          <SelectItem value="R. Alvarez">R. Alvarez</SelectItem>
                          <SelectItem value="T. Nguyen">T. Nguyen</SelectItem>
                          <SelectItem value="K. Patel">K. Patel</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      No work orders match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabTriage;
