import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpCircle, PlayCircle, Sparkles, Settings2 } from "lucide-react";
import { useTour } from "@/context/TourContext";
import { NewBadge } from "./NewBadge";
import { clearBadge } from "@/lib/tour/storage";
import { FEATURE_KEYS } from "@/lib/tour/data";

export const HelpMenu = () => {
  const { startTour, openDrawer } = useTour();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          data-tour="help-menu"
          data-badge-key={FEATURE_KEYS.helpMenu}
          onClick={() => clearBadge(FEATURE_KEYS.helpMenu)}
          className="relative p-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 transform hover:scale-105"
          title="Help & What's New"
          aria-label="Help and What's New"
        >
          <HelpCircle className="h-4 w-4" />
          <NewBadge
            featureKey={FEATURE_KEYS.helpMenu}
            className="absolute -top-1 -right-1 text-[8px] px-1 py-0"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Help & Discovery
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => startTour()} className="text-xs cursor-pointer">
          <PlayCircle className="h-3.5 w-3.5 mr-2" />
          Take Product Tour
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openDrawer} className="text-xs cursor-pointer">
          <Sparkles className="h-3.5 w-3.5 mr-2" />
          What's New
          <NewBadge featureKey={FEATURE_KEYS.whatsNew} className="ml-auto" />
        </DropdownMenuItem>


        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="text-xs cursor-pointer">
          <Link to="/whats-new">
            <Settings2 className="h-3.5 w-3.5 mr-2" />
            Release history & Preferences
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
