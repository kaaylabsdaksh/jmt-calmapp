import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PartyPopper, Sparkles } from "lucide-react";
import { useTour } from "@/context/TourContext";
import { CURRENT_RELEASE } from "@/lib/tour/data";

export const WelcomeModal = () => {
  const { welcomeOpen, closeWelcome, startTour, openDrawer } = useTour();
  const [dontShow, setDontShow] = useState(false);

  return (
    <Dialog
      open={welcomeOpen}
      onOpenChange={(o) => !o && closeWelcome({ dontShowAgain: dontShow })}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <PartyPopper className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-lg">
              Welcome to CalMApp {CURRENT_RELEASE.version}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-sm">
            We've added new features to help you work faster and more efficiently.
            Choose how you'd like to explore them.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            What's new in {CURRENT_RELEASE.version}
          </div>
          <ul className="space-y-1 text-sm">
            {CURRENT_RELEASE.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id="dontShow"
            checked={dontShow}
            onCheckedChange={(v) => setDontShow(!!v)}
          />
          <label
            htmlFor="dontShow"
            className="text-xs text-muted-foreground cursor-pointer select-none"
          >
            Don't show again for this release
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => closeWelcome({ dontShowAgain: dontShow })}
            className="sm:mr-auto"
          >
            Maybe Later
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              closeWelcome({ dontShowAgain: dontShow });
              openDrawer();
            }}
          >
            What's New
          </Button>
          <Button size="sm" onClick={() => startTour()}>
            Start Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
