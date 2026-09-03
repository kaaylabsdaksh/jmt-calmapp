import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ListChecks,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { STANDARDS, StandardRecord, calibrationStatus } from "@/lib/standards/data";

const parse = (d: string) => {
  if (!d) return null;
  const [m, day, y] = d.split("/").map(Number);
  if (!m || !day || !y) return null;
  return new Date(y, m - 1, day);
};

const daysUntil = (d: string, today: Date) => {
  const parsed = parse(d);
  if (!parsed) return null;
  return Math.ceil((parsed.getTime() - today.getTime()) / 86_400_000);
};

const BUCKETS = [
  { key: "overdue", label: "Overdue", color: "hsl(var(--destructive))" },
  { key: "0-30", label: "0-30 days", color: "#f97316" },
  { key: "31-60", label: "31-60 days", color: "#eab308" },
  { key: "61-90", label: "61-90 days", color: "#0ea5e9" },
  { key: "90+", label: "90+ days", color: "#22c55e" },
] as const;

const bucketFor = (days: number | null) => {
  if (days === null) return null;
  if (days < 0) return "overdue";
  if (days <= 30) return "0-30";
  if (days <= 60) return "31-60";
  if (days <= 90) return "61-90";
  return "90+";
};

const KpiCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof Clock;
  tone: "danger" | "warn" | "ok" | "neutral";
}) => (
  <div className="rounded-xl border bg-card p-3 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold leading-none text-foreground">{value}</p>
        <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>
      </div>
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg",
          tone === "danger" && "bg-red-50 text-red-600",
          tone === "warn" && "bg-amber-50 text-amber-600",
          tone === "ok" && "bg-emerald-50 text-emerald-600",
          tone === "neutral" && "bg-slate-100 text-slate-600",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
    </div>
  </div>
);

const StandardsDashboard = () => {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);

  const { active, overdue, dueSoon, current, chartData, upcoming, byLocation } = useMemo(() => {
    const active = STANDARDS.filter((s) => s.state === "Active");
    const counts: Record<string, number> = {};
    BUCKETS.forEach((b) => (counts[b.key] = 0));
    const locMap = new Map<string, { overdue: number; dueSoon: number; total: number }>();

    active.forEach((s) => {
      const b = bucketFor(daysUntil(s.nextCalibrationDue, today));
      if (b) counts[b] += 1;
      const status = calibrationStatus(s.nextCalibrationDue, today);
      const loc = s.calibrationLocation || "Unassigned";
      const entry = locMap.get(loc) ?? { overdue: 0, dueSoon: 0, total: 0 };
      entry.total += 1;
      if (status === "overdue") entry.overdue += 1;
      if (status === "due-soon") entry.dueSoon += 1;
      locMap.set(loc, entry);
    });

    const upcoming = active
      .map((s) => ({ s, days: daysUntil(s.nextCalibrationDue, today) }))
      .filter((r) => r.days !== null)
      .sort((a, b) => (a.days as number) - (b.days as number))
      .slice(0, 10);

    return {
      active,
      overdue: counts["overdue"],
      dueSoon: counts["0-30"] + counts["31-60"],
      current: counts["61-90"] + counts["90+"],
      chartData: BUCKETS.map((b) => ({ name: b.label, key: b.key, count: counts[b.key], color: b.color })),
      upcoming,
      byLocation: Array.from(locMap.entries())
        .map(([location, v]) => ({ location, ...v }))
        .sort((a, b) => b.overdue - a.overdue || b.total - a.total),
    };
  }, [today]);

  const goList = (filter: string) => navigate(`/standards?state=${filter}`);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-white px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold leading-tight text-foreground">Standards Dashboard</h1>
            <Breadcrumb className="mt-1">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
                    <Link to="/">Equipment</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
                    <Link to="/standards">Manage Standards</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-medium text-foreground">Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Link to="/standards">
              <ListChecks className="h-3.5 w-3.5" />
              Manage Standards
            </Link>
          </Button>
        </div>
      </header>

      <main className="space-y-4 p-4 lg:p-6">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Active Standards" value={active.length} hint="In service" icon={ListChecks} tone="neutral" />
          <KpiCard label="Overdue" value={overdue} hint="Past calibration due date" icon={AlertTriangle} tone="danger" />
          <KpiCard label="Due in 60 Days" value={dueSoon} hint="Schedule recalibration" icon={Clock} tone="warn" />
          <KpiCard label="Current" value={current} hint="More than 60 days out" icon={CheckCircle2} tone="ok" />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 shadow-sm xl:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <h2 className="text-xs font-semibold text-foreground">Calibration Due Summary</h2>
              <Badge variant="secondary" className="h-4 rounded-full px-1.5 text-[10px]">
                {active.length} active
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <RTooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="count" name="Standards" radius={[4, 4, 0, 0]} maxBarSize={56}>
                    {chartData.map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold text-foreground">Overdue by Location</h2>
            <div className="space-y-2">
              {byLocation.map((row) => (
                <div key={row.location} className="rounded-lg border px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{row.location}</span>
                    <span className="text-[11px] text-muted-foreground">{row.total} total</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px]">
                    <span className="font-semibold text-red-600">{row.overdue} overdue</span>
                    <span className="font-semibold text-amber-600">{row.dueSoon} due soon</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${row.total ? (row.overdue / row.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
              {byLocation.length === 0 && (
                <p className="text-[11px] text-muted-foreground">No active standards.</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <h2 className="text-xs font-semibold text-foreground">Next Calibrations Due</h2>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]" onClick={() => goList("overdue")}>
              View all overdue
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 text-[11px]">Standard #</TableHead>
                <TableHead className="h-8 text-[11px]">Manufacturer</TableHead>
                <TableHead className="h-8 text-[11px]">Model</TableHead>
                <TableHead className="h-8 text-[11px]">Serial</TableHead>
                <TableHead className="h-8 text-[11px]">Location</TableHead>
                <TableHead className="h-8 text-[11px]">Due Date</TableHead>
                <TableHead className="h-8 text-right text-[11px]">Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.map(({ s, days }: { s: StandardRecord; days: number | null }) => {
                const overdueRow = (days as number) < 0;
                const soon = !overdueRow && (days as number) <= 45;
                return (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer text-xs"
                    onClick={() => navigate(`/standards/${s.id}`)}
                  >
                    <TableCell className="py-1.5 font-medium text-foreground">{s.standardNo}</TableCell>
                    <TableCell className="py-1.5">{s.manufacturer}</TableCell>
                    <TableCell className="py-1.5">{s.model}</TableCell>
                    <TableCell className="py-1.5">{s.serial}</TableCell>
                    <TableCell className="py-1.5">{s.calibrationLocation}</TableCell>
                    <TableCell className="py-1.5">{s.nextCalibrationDue}</TableCell>
                    <TableCell className="py-1.5 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          overdueRow && "bg-red-50 text-red-600",
                          soon && "bg-amber-50 text-amber-700",
                          !overdueRow && !soon && "bg-emerald-50 text-emerald-700",
                        )}
                      >
                        {overdueRow ? `${Math.abs(days as number)} days late` : `${days} days`}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
};

export default StandardsDashboard;
