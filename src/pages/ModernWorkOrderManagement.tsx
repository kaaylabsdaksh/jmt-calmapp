import { useState } from "react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ModernTopSearchFilters from "@/components/modern/ModernTopSearchFilters";
import ModernWorkOrdersTable from "@/components/modern/ModernWorkOrdersTable";

const ModernWorkOrderManagement = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="min-h-screen bg-gray-100">
      <ModernTopNav />
      
      <main className="max-w-7xl mx-auto p-6">
        <ModernTopSearchFilters />
        <ModernWorkOrdersTable viewMode={viewMode} onViewModeChange={setViewMode} />
      </main>
    </div>
  );
};

export default ModernWorkOrderManagement;