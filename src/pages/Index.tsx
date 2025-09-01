import { useState } from "react";
import WorkOrderHeader from "@/components/WorkOrderHeader";
import ModernWorkOrderFilters from "@/components/ModernWorkOrderFilters";
import EnhancedWorkOrdersTable from "@/components/EnhancedWorkOrdersTable";
import WorkOrderDetails from "@/components/WorkOrderDetails";

const Index = () => {
  const [currentView, setCurrentView] = useState<"list" | "details">("list");
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string>("");

  const handleViewDetails = (workOrderId: string) => {
    setSelectedWorkOrderId(workOrderId);
    setCurrentView("details");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedWorkOrderId("");
  };

  if (currentView === "details") {
    return (
      <WorkOrderDetails 
        workOrderId={selectedWorkOrderId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <WorkOrderHeader />
      <main className="w-full max-w-none px-4 sm:px-6 py-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          <ModernWorkOrderFilters />
          <EnhancedWorkOrdersTable onViewDetails={handleViewDetails} />
        </div>
      </main>
    </div>
  );
};

export default Index;
