import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import MinimalWorkOrderSearch from "@/components/MinimalWorkOrderSearch";
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

const WorkOrderSearchV2 = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    globalSearch: '',
    status: '',
    assignee: '',
    priority: '',
    manufacturer: '',
    division: '',
    dateType: ''
  });

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header matching v1 style */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger className="p-2 rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300" />
              <div>
                <span className="text-sm text-muted-foreground block">
                  JM Test Systems
                </span>
                <Breadcrumb className="mt-1">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink 
                        asChild 
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Link to="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-xs text-foreground font-medium">
                        Work Order Search
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-sm"
                >
                  Pricing History
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-sm"
                >
                  User Guide
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <MinimalWorkOrderSearch onSearch={handleSearch} />
        <ModernWorkOrdersTable 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchFilters={searchFilters}
        />
      </main>
    </div>
  );
};

export default WorkOrderSearchV2;