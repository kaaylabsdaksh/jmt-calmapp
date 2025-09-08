import { useState } from "react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ModernTopSearchFilters from "@/components/modern/ModernTopSearchFilters";
import ModernWorkOrdersTable from "@/components/modern/ModernWorkOrdersTable";

interface SearchFilters {
  globalSearch: string;
  status: string;
  assignee: string;
  priority: string;
  manufacturer: string;
  division: string;
  dateFrom?: Date;
  dateTo?: Date;
  dateType: string;
}

const ModernWorkOrderManagement = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const handleSearch = (filters: SearchFilters) => {
    console.log('Parent received search filters:', filters);
    setSearchFilters(filters);
  };

  // Initialize with empty filters to show all work orders
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    globalSearch: '',
    status: '',
    assignee: '',
    priority: '',
    manufacturer: '',
    division: '',
    dateType: ''
  });

  return (
    <div className="bg-background min-h-screen">
      <ModernTopNav />
      <main className="w-full max-w-none px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <div className="w-full space-y-4 sm:space-y-6">
          <ModernTopSearchFilters onSearch={handleSearch} />
          <ModernWorkOrdersTable 
            viewMode={viewMode} 
            onViewModeChange={setViewMode}
            searchFilters={searchFilters}
          />
        </div>
      </main>
    </div>
  );
};

export default ModernWorkOrderManagement;