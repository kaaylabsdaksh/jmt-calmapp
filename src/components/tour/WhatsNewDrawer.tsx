import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Sparkles, Wrench, Bug, FileText, PlayCircle, Video } from "lucide-react";
import { RELEASES } from "@/lib/tour/data";
import { useTour } from "@/context/TourContext";

const categoryMeta = {
  new: { label: "New", icon: Sparkles, className: "text-black bg-yellow-400" },
  improved: { label: "Improved", icon: Wrench, className: "text-emerald-600 bg-emerald-500/10" },
  fixed: { label: "Fixed", icon: Bug, className: "text-orange-600 bg-orange-500/10" },
} as const;

export const WhatsNewDrawer = () => {
  const { drawerOpen, closeDrawer, startTour } = useTour();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return RELEASES;
    const q = query.toLowerCase();
    return RELEASES.map((r) => ({
      ...r,
      notes: r.notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description?.toLowerCase().includes(q) ||
          r.version.includes(q) ||
          r.headline.toLowerCase().includes(q)
      ),
    })).filter((r) => r.notes.length > 0);
  }, [query]);

  return (
    <Sheet open={drawerOpen} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-3">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            What's New
          </SheetTitle>
          <SheetDescription>
            Release notes, new features and improvements across CalMApp.
          </SheetDescription>
        </SheetHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search releases… (invoice, customer, reports)"
            className="pl-8 h-9"
          />
        </div>

        <Accordion type="multiple" defaultValue={[RELEASES[0].version]} className="space-y-2">
          {filtered.map((r) => (
            <AccordionItem
              key={r.version}
              value={r.version}
              className="border rounded-lg px-3 data-[state=open]:bg-muted/30"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex flex-col items-start text-left gap-1 w-full pr-2">
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-semibold text-sm">Version {r.version}</span>
                    <Badge variant="secondary" className="text-[10px] h-5">
                      {r.releasedAt}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground font-normal">
                    {r.headline}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3 space-y-3">
                <ul className="space-y-2">
                  {r.notes.map((n, i) => {
                    const meta = categoryMeta[n.category];
                    const Icon = meta.icon;
                    return (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.className}`}
                        >
                          <Icon className="h-3 w-3" />
                          {meta.label}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-tight">{n.title}</p>
                          {n.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                              {n.description}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {r === RELEASES[0] && (
                    <Button
                      size="sm"
                      onClick={() => {
                        closeDrawer();
                        startTour();
                      }}
                    >
                      <PlayCircle className="h-3.5 w-3.5 mr-1" />
                      Take the tour
                    </Button>
                  )}
                  {r.docsUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={r.docsUrl} target="_blank" rel="noreferrer">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Docs
                      </a>
                    </Button>
                  )}
                  {r.videoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={r.videoUrl} target="_blank" rel="noreferrer">
                        <Video className="h-3.5 w-3.5 mr-1" />
                        Video
                      </a>
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No release notes match "{query}".
            </p>
          )}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};
