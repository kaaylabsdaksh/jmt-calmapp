import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const WorkOrderHeader = () => {
  return (
    <header className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">JM Test Systems</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Pricing History
              </Button>
              <Button variant="outline" size="sm">
                User Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkOrderHeader;