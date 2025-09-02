import { SidebarTrigger } from "@/components/ui/sidebar";
import MinimalWorkOrderSearch from "@/components/MinimalWorkOrderSearch";
import MinimalWorkOrderResults from "@/components/MinimalWorkOrderResults";

const WorkOrderSearchV2 = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Simple Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                Work Orders v2
              </h1>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                Simplified Interface
              </span>
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