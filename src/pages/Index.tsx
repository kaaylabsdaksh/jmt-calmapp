import WorkOrderHeader from "@/components/WorkOrderHeader";
import WorkOrderFilters from "@/components/WorkOrderFilters";
import WorkOrdersTable from "@/components/WorkOrdersTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <WorkOrderHeader />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground bg-warning/10 border border-warning/20 rounded-md px-3 py-2 inline-block">
            <strong>TEST SYSTEM</strong> (do not use for live data)
          </p>
        </div>
        <WorkOrderFilters />
        <WorkOrdersTable />
      </main>
    </div>
  );
};

export default Index;
