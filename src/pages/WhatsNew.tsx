import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  PlayCircle,
  ChevronRight,
  Search,
  FileText,
  Video,
  Home,
  BarChart3,
  RotateCcw,
  Megaphone,
} from "lucide-react";
import { RELEASES } from "@/lib/tour/data";
import { useTour } from "@/context/TourContext";
import {
  DEFAULT_ADMIN,
  DEFAULT_PREFS,
  getAdminSettings,
  getAnalytics,
  getPreferences,
  resetAllTourState,
  setAdminSettings,
  setPreferences,
  type AdminSettings,
  type TourPreferences,
} from "@/lib/tour/storage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const WhatsNew = () => {
  const { startTour, openDrawer } = useTour();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [prefs, setPrefsState] = useState<TourPreferences>(() => getPreferences());
  const [admin, setAdminState] = useState<AdminSettings>(() => getAdminSettings());
  const [analytics, setAnalyticsState] = useState(() => getAnalytics());

  const updatePrefs = (patch: Partial<TourPreferences>) => {
    const next = { ...prefs, ...patch };
    setPrefsState(next);
    setPreferences(next);
  };
  const updateAdmin = (patch: Partial<AdminSettings>) => {
    const next = { ...admin, ...patch };
    setAdminState(next);
    setAdminSettings(next);
  };

  const filteredReleases = useMemo(() => {
    if (!query.trim()) return RELEASES;
    const q = query.toLowerCase();
    return RELEASES.filter(
      (r) =>
        r.version.includes(q) ||
        r.headline.toLowerCase().includes(q) ||
        r.highlights.some((h) => h.toLowerCase().includes(q)) ||
        r.notes.some((n) => n.title.toLowerCase().includes(q))
    );
  }, [query]);

  const analyticsSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    const featureViews: Record<string, number> = {};
    analytics.forEach((a) => {
      counts[a.event] = (counts[a.event] ?? 0) + 1;
      if (a.event === "step_viewed" && a.meta?.id) {
        const id = String(a.meta.id);
        featureViews[id] = (featureViews[id] ?? 0) + 1;
      }
    });
    const featureEntries = Object.entries(featureViews).sort((a, b) => b[1] - a[1]);
    return {
      counts,
      mostViewed: featureEntries[0],
      leastViewed: featureEntries[featureEntries.length - 1],
      total: analytics.length,
    };
  }, [analytics]);

  return (
    <div className="bg-background min-h-full">
      {/* Header (matches ModernTopNav visual style) */}
      <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            What's New in CalMApp
          </h1>
          <Breadcrumb className="mt-1 hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground">
                  <Link to="/"><Home className="h-3 w-3 inline mr-1" />Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs font-medium">What's New</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Hero */}
          <Card className="overflow-hidden border-primary/20">
            <CardHeader className="bg-gradient-to-br from-primary/10 via-transparent to-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Version {RELEASES[0].version} — {RELEASES[0].releasedAt}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {RELEASES[0].headline}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => startTour()}>
                    <PlayCircle className="h-4 w-4 mr-1.5" />
                    Take Product Tour
                  </Button>
                  <Button size="sm" variant="outline" onClick={openDrawer}>
                    Open Release Drawer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {RELEASES[0].highlights.map((h) => (
                  <Badge key={h} variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1 text-primary" />
                    {h}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="releases">
            <TabsList>
              <TabsTrigger value="releases">Release history</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* -------- Release history -------- */}
            <TabsContent value="releases" className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search releases (invoice, customer, reports)…"
                  className="pl-8 h-9"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReleases.map((r, i) => (
                  <Card key={r.version} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">Version {r.version}</CardTitle>
                        {i === 0 && <Badge className="text-[10px]">Latest</Badge>}
                      </div>
                      <CardDescription className="text-xs">
                        Released {r.releasedAt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2">
                      <p className="text-sm text-foreground">{r.headline}</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {r.highlights.slice(0, 4).map((h) => (
                          <li key={h} className="flex items-start gap-1.5">
                            <Sparkles className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={openDrawer}>
                        <ChevronRight className="h-3.5 w-3.5 mr-1" />
                        Learn More
                      </Button>
                      {r.docsUrl && (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={r.docsUrl} target="_blank" rel="noreferrer">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            Docs
                          </a>
                        </Button>
                      )}
                      {r.videoUrl && (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={r.videoUrl} target="_blank" rel="noreferrer">
                            <Video className="h-3.5 w-3.5 mr-1" />
                            Video
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* -------- Preferences -------- */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tour preferences</CardTitle>
                  <CardDescription>
                    Control when tours appear and how release notifications behave.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "showNewFeatureTours", label: "Show new feature tours" },
                    { key: "autoPlayTours", label: "Automatically play tours" },
                    { key: "showReleaseNotifications", label: "Show release notifications" },
                    { key: "emailReleaseSummaries", label: "Email release summaries" },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                      <Label htmlFor={row.key} className="text-sm">{row.label}</Label>
                      <Switch
                        id={row.key}
                        checked={prefs[row.key as keyof TourPreferences]}
                        onCheckedChange={(v) => updatePrefs({ [row.key]: v } as Partial<TourPreferences>)}
                      />
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPrefsState(DEFAULT_PREFS);
                      setPreferences(DEFAULT_PREFS);
                    }}
                  >
                    Reset defaults
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resetAllTourState();
                      toast({ title: "Tour state cleared", description: "Reload to see the welcome modal again." });
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Reset all tour data
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* -------- Admin -------- */}
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" />
                    Administrator controls
                  </CardTitle>
                  <CardDescription>
                    Publish announcements, target tours by role and force compliance tours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <Label htmlFor="forceTour" className="text-sm">Force the current tour on next login</Label>
                      <p className="text-xs text-muted-foreground">Overrides "don't show again" for all users.</p>
                    </div>
                    <Switch
                      id="forceTour"
                      checked={admin.forceTour}
                      onCheckedChange={(v) => updateAdmin({ forceTour: v })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetRole" className="text-xs">Target audience</Label>
                      <Select
                        value={admin.targetRole}
                        onValueChange={(v) => updateAdmin({ targetRole: v as AdminSettings["targetRole"] })}
                      >
                        <SelectTrigger id="targetRole" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All users</SelectItem>
                          <SelectItem value="csa">CSA</SelectItem>
                          <SelectItem value="billing">Billing Specialists</SelectItem>
                          <SelectItem value="admin">Administrators</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="scheduledDate" className="text-xs">Scheduled release date</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        className="mt-1"
                        value={admin.scheduledDate ?? ""}
                        onChange={(e) => updateAdmin({ scheduledDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="announcement" className="text-xs">Announcement</Label>
                    <Textarea
                      id="announcement"
                      className="mt-1"
                      rows={3}
                      placeholder="Add a short announcement shown at the top of the welcome modal…"
                      value={admin.announcement ?? ""}
                      onChange={(e) => updateAdmin({ announcement: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAdminState(DEFAULT_ADMIN);
                      setAdminSettings(DEFAULT_ADMIN);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Announcement published",
                        description: `Targeting: ${admin.targetRole}${admin.forceTour ? " · forced" : ""}`,
                      })
                    }
                  >
                    Publish
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* -------- Analytics -------- */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Tour analytics
                  </CardTitle>
                  <CardDescription>
                    Tracked locally on this device — {analyticsSummary.total} events recorded.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      ["tour_started", "Tours started"],
                      ["tour_completed", "Tours completed"],
                      ["tour_skipped", "Tours skipped"],
                      ["replay_started", "Replays"],
                    ].map(([key, label]) => (
                      <div key={key} className="rounded-lg border p-3 bg-muted/30">
                        <div className="text-2xl font-semibold">
                          {analyticsSummary.counts[key] ?? 0}
                        </div>
                        <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {analyticsSummary.mostViewed && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Most viewed step:</span>{" "}
                      {analyticsSummary.mostViewed[0]} ({analyticsSummary.mostViewed[1]})
                    </div>
                  )}
                  {analyticsSummary.leastViewed &&
                    analyticsSummary.leastViewed[0] !== analyticsSummary.mostViewed?.[0] && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Least viewed step:</span>{" "}
                        {analyticsSummary.leastViewed[0]} ({analyticsSummary.leastViewed[1]})
                      </div>
                    )}
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAnalyticsState(getAnalytics())}
                  >
                    Refresh
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default WhatsNew;
