import { useState } from "react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ModernTopSearchFilters from "@/components/modern/ModernTopSearchFilters";
import ModernWorkOrdersTable from "@/components/modern/ModernWorkOrdersTable";

interface SearchFilters {
  globalSearch: string;
  searchTags: string[];
  status: string;
  assignee: string;
  priority: string;
  manufacturer: string;
  division: string;
  woType: string;
  dateFrom?: Date;
  dateTo?: Date;
  dateType: string;
  actionCode: string;
  labCode: string;
  rotationManagement: string;
  invoiceStatus: string;
  departureType: string;
  salesperson: string;
  workOrderItemStatus: string;
  workOrderItemType: string;
  location: string;
  newEquip: boolean;
  usedSurplus: boolean;
  warranty: boolean;
  toFactory: boolean;
  proofOfDelivery: boolean;
  only17025: boolean;
  onlyHotList: boolean;
  onlyLostEquip: boolean;
  nonJMAccts: boolean;
  viewTemplate: boolean;
}

const ModernWorkOrderManagement = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = (filters: SearchFilters) => {
    console.log('Parent received search filters:', filters);
    setSearchFilters(filters);
    
    // Check if all filters are empty - if so, show empty state
    const hasAnyFilter = !!(
      filters.globalSearch || 
      filters.searchTags.length > 0 || 
      filters.status || 
      filters.assignee ||
      filters.dateType ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.woType ||
      filters.priority ||
      filters.division ||
      filters.actionCode ||
      filters.labCode ||
      filters.newEquip ||
      filters.usedSurplus ||
      filters.warranty ||
      filters.toFactory
    );
    
    setHasSearched(hasAnyFilter);
  };

  // Initialize with empty filters to show all work orders
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    globalSearch: '',
    searchTags: [],
    status: '',
    assignee: '',
    priority: '',
    manufacturer: '',
    division: '',
    woType: '',
    dateType: '',
    actionCode: '',
    labCode: '',
    rotationManagement: '',
    invoiceStatus: '',
    departureType: '',
    salesperson: '',
    workOrderItemStatus: '',
    workOrderItemType: '',
    location: '',
    newEquip: false,
    usedSurplus: false,
    warranty: false,
    toFactory: false,
    proofOfDelivery: false,
    only17025: false,
    onlyHotList: false,
    onlyLostEquip: false,
    nonJMAccts: false,
    viewTemplate: false
  });

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-4 sm:space-y-6">
          <ModernTopSearchFilters onSearch={handleSearch} />
          <ModernWorkOrdersTable 
            viewMode={viewMode} 
            onViewModeChange={setViewMode}
            searchFilters={searchFilters}
            hasSearched={hasSearched}
          />
        </div>
      </main>
    </div>
  );
};

export default ModernWorkOrderManagement;