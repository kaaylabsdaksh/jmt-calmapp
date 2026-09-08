import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  quickActionCategories,
  workOrderQuickActions,
  viewsSubItems,
} from "@/components/AppSidebar";

type PaletteEntry = {
  title: string;
  group: string;
  url?: string;
  icon: React.ElementType;
};

const RECENT_KEY = "calmapp-command-recents";

function buildEntries(): PaletteEntry[] {
  const entries: PaletteEntry[] = [];

  Object.entries(quickActionCategories).forEach(([group, actions]) => {
    actions.forEach((action) => {
      if (action.hasSubItems) return;
      entries.push({ title: action.title, group, url: action.url, icon: action.icon });
    });
  });

  workOrderQuickActions.forEach((item) =>
    entries.push({ title: item.title, group: "Work Orders", url: item.url, icon: item.icon })
  );
  viewsSubItems.forEach((item) =>
    entries.push({ title: item.title, group: "Views", url: item.url, icon: item.icon })
  );

  return entries.filter((e) => Boolean(e.url));
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [recents, setRecents] = useState<string[]>([]);
  const navigate = useNavigate();

  const entries = useMemo(buildEntries, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecents(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (entry: PaletteEntry) => {
    setOpen(false);
    const next = [entry.title, ...recents.filter((t) => t !== entry.title)].slice(0, 5);
    setRecents(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    if (entry.url) navigate(entry.url);
  };

  const recentEntries = recents
    .map((title) => entries.find((e) => e.title === title))
    .filter(Boolean) as PaletteEntry[];

  const grouped = entries.reduce<Record<string, PaletteEntry[]>>((acc, entry) => {
    (acc[entry.group] ||= []).push(entry);
    return acc;
  }, {});

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a page..." />
      <CommandList>
        <CommandEmpty>No pages found.</CommandEmpty>

        {recentEntries.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recentEntries.map((entry) => (
                <CommandItem
                  key={`recent-${entry.title}`}
                  value={`recent ${entry.title}`}
                  onSelect={() => go(entry)}
                >
                  <entry.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{entry.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {Object.entries(grouped).map(([group, items]) => (
          <CommandGroup key={group} heading={group}>
            {items.map((entry) => (
              <CommandItem
                key={`${group}-${entry.title}`}
                value={`${entry.title} ${group}`}
                onSelect={() => go(entry)}
              >
                <entry.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{entry.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
