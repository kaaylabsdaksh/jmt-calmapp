import WorkOrderHeader from "@/components/WorkOrderHeader";
import ModernWorkOrderFilters from "@/components/ModernWorkOrderFilters";
import EnhancedWorkOrdersTable from "@/components/EnhancedWorkOrdersTable";

const Index = () => {
  return (
    <div className="bg-background">
      <WorkOrderHeader />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <ModernWorkOrderFilters />
        <EnhancedWorkOrdersTable />
      </main>
    </div>
  );
};

export default Index;
