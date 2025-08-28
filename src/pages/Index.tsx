import WorkOrderHeader from "@/components/WorkOrderHeader";
import ModernWorkOrderFilters from "@/components/ModernWorkOrderFilters";
import EnhancedWorkOrdersTable from "@/components/EnhancedWorkOrdersTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WorkOrderHeader />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3 inline-flex items-center gap-3 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
            <p className="text-sm font-medium text-warning-foreground">
              <strong>TEST SYSTEM</strong> - Do not use for live data
            </p>
          </div>
        </div>
        <ModernWorkOrderFilters />
        <EnhancedWorkOrdersTable />
      </main>
    </div>
  );
};

export default Index;
