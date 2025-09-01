import WorkOrderHeader from "@/components/WorkOrderHeader";
import ModernWorkOrderFilters from "@/components/ModernWorkOrderFilters";
import EnhancedWorkOrdersTable from "@/components/EnhancedWorkOrdersTable";

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <WorkOrderHeader />
      <main className="w-full max-w-none px-3 sm:px-4 lg:px-6 py-4 sm:py-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <ModernWorkOrderFilters />
          <EnhancedWorkOrdersTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
