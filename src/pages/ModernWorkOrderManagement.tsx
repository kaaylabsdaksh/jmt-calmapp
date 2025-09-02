import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ModernTopSearchFilters from "@/components/modern/ModernTopSearchFilters";
import ModernWorkOrdersTable from "@/components/modern/ModernWorkOrdersTable";
import { ModernSidebarFilters } from "@/components/modern/ModernSidebarFilters";

// Mock data for work order counts (in real app this would come from API)
const mockWorkOrders = [
  { status: "In Lab" },
  { status: "Completed" }, 
  { status: "Overdue" },
  { status: "Pending" },
  { status: "In Lab" },
  { status: "Completed" },
];

const ModernWorkOrderManagement = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  // Calculate work order counts for the sidebar
  const workOrderCounts = {
    all: mockWorkOrders.length,
    inLab: mockWorkOrders.filter(wo => wo.status === 'In Lab').length,
    completed: mockWorkOrders.filter(wo => wo.status === 'Completed').length,
    overdue: mockWorkOrders.filter(wo => wo.status === 'Overdue').length,
    pending: mockWorkOrders.filter(wo => wo.status === 'Pending').length,
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100 flex w-full">
        {/* Global Sidebar Trigger */}
        <header className="fixed top-0 left-0 z-50 h-12 flex items-center bg-white border-b border-gray-200">
          <SidebarTrigger className="ml-2" />
        </header>

        {/* Sidebar */}
        <ModernSidebarFilters 
          activeStatusFilter={activeStatusFilter}
          onStatusFilterChange={setActiveStatusFilter}
          workOrderCounts={workOrderCounts}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="pt-12"> {/* Add top padding to account for fixed header */}
            <ModernTopNav />
            
            <main className="max-w-7xl mx-auto p-6">
              <ModernTopSearchFilters />
              <ModernWorkOrdersTable 
                viewMode={viewMode} 
                onViewModeChange={setViewMode}
                activeStatusFilter={activeStatusFilter}
              />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ModernWorkOrderManagement;