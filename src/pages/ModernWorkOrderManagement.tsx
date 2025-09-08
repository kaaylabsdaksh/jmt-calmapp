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
  console.log("ModernWorkOrderManagement component is rendering");
  
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
    <div className="bg-red-100 min-h-screen p-4">
      <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', margin: '10px' }}>
        DEBUG: Page is rendering - if you see this, the components are working
      </div>
      <ModernTopNav />
      <main className="w-full max-w-none px-4 sm:px-6 py-6">
        <div className="w-full space-y-6">
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