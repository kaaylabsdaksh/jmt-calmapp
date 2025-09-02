import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import MinimalWorkOrderSearch from "@/components/MinimalWorkOrderSearch";
import MinimalWorkOrderResults from "@/components/MinimalWorkOrderResults";

const WorkOrderSearchV2 = () => {
  const { state, open } = useSidebar();
  const isCollapsed = state === "collapsed" || !open;

  return (
    <div className="bg-background min-h-screen">
      {/* Header matching v1 style */}
      <header className="bg-card shadow-sm border-b">
        <div className={`max-w-7xl mx-auto transition-all duration-200 ${
          isCollapsed ? 'px-4 py-3' : 'px-4 sm:px-6 py-4'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-4">
                <h1 className={`font-bold text-foreground transition-all duration-200 ${
                  isCollapsed ? 'text-lg' : 'text-2xl'
                }`}>
                  Work Orders v2
                </h1>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Simplified
                </span>
              </div>
              <span className={`text-sm text-muted-foreground transition-all duration-200 ${
                isCollapsed ? 'hidden sm:block' : 'block'
              }`}>
                JM Test Systems
              </span>
            </div>
            <div className="flex items-center">
              <div className={`flex transition-all duration-200 ${
                isCollapsed ? 'gap-1 sm:gap-2' : 'gap-2'
              }`}>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`transition-all duration-200 ${
                    isCollapsed ? 'text-xs px-2 py-1 h-7 sm:text-sm sm:px-3 sm:py-2 sm:h-8' : 'text-sm'
                  }`}
                >
                  <span className={isCollapsed ? 'hidden sm:inline' : 'inline'}>
                    Pricing History
                  </span>
                  <span className={isCollapsed ? 'sm:hidden' : 'hidden'}>
                    Price
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`transition-all duration-200 ${
                    isCollapsed ? 'text-xs px-2 py-1 h-7 sm:text-sm sm:px-3 sm:py-2 sm:h-8' : 'text-sm'
                  }`}
                >
                  <span className={isCollapsed ? 'hidden sm:inline' : 'inline'}>
                    User Guide
                  </span>
                  <span className={isCollapsed ? 'sm:hidden' : 'hidden'}>
                    Guide
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <MinimalWorkOrderSearch />
        <MinimalWorkOrderResults />
      </main>
    </div>
  );
};

export default WorkOrderSearchV2;