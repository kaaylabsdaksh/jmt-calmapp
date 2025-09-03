import { Button } from "@/components/ui/button";
import MinimalWorkOrderSearch from "@/components/MinimalWorkOrderSearch";
import MinimalWorkOrderResults from "@/components/MinimalWorkOrderResults";

const WorkOrderSearchV2 = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Header matching v1 style */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-sm text-muted-foreground block">
                JM Test Systems
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-sm"
                >
                  Pricing History
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-sm"
                >
                  User Guide
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