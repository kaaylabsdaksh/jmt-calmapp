import { useState } from "react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ModernTopSearchFilters from "@/components/modern/ModernTopSearchFilters";
import ModernWorkOrdersTable from "@/components/modern/ModernWorkOrdersTable";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  TruckIcon, 
  Wifi, 
  FileCheck, 
  FileText, 
  Users, 
  MapPin, 
  FileSpreadsheet, 
  DollarSign, 
  Barcode 
} from "lucide-react";

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

  const quickActions = [
    { label: "Hot List", icon: Flame, variant: "default" as const },
    { label: "Transit Log", icon: TruckIcon, variant: "secondary" as const },
    { label: "Update RFID's", icon: Wifi, variant: "secondary" as const },
    { label: "Rental Batch Certs", icon: FileCheck, variant: "secondary" as const },
    { label: "PO/Change Orders", icon: FileText, variant: "secondary" as const },
    { label: "Assign Techs", icon: Users, variant: "secondary" as const },
    { label: "Assign Departure Info", icon: MapPin, variant: "secondary" as const },
    { label: "Export Excel", icon: FileSpreadsheet, variant: "secondary" as const },
    { label: "Missing Cost", icon: DollarSign, variant: "secondary" as const },
    { label: "Create Barcode", icon: Barcode, variant: "secondary" as const },
  ];

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-4 sm:space-y-6">
          <ModernTopSearchFilters onSearch={handleSearch} />
          
          {/* Quick Action Buttons */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant}
                  size="sm"
                  className="gap-2"
                  onClick={() => console.log(`${action.label} clicked`)}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

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