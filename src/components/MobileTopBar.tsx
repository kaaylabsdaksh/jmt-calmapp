import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Sticky top bar shown only on small screens (<md).
 * Exposes the sidebar trigger (hamburger) so mobile users can open the nav drawer.
 */
const MobileTopBar = () => {
  return (
    <header className="md:hidden sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">CalMApp</span>
        <span className="text-[10px] text-muted-foreground">Work Order Management</span>
      </div>
    </header>
  );
};

export default MobileTopBar;
