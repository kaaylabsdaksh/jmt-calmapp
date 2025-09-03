import { useState } from "react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ModernTopSearchFilters from "@/components/modern/ModernTopSearchFilters";
import ModernWorkOrdersTable from "@/components/modern/ModernWorkOrdersTable";

const ModernWorkOrderManagement = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="bg-background min-h-screen">
      <ModernTopNav />
      <main className="w-full max-w-none px-4 sm:px-6 py-6">
        <div className="w-full space-y-6">
          <ModernTopSearchFilters />
          <ModernWorkOrdersTable viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </main>
    </div>
  );
};

export default ModernWorkOrderManagement;