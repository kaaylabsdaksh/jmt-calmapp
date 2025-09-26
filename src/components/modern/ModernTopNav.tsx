import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Plus, Download, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ModernTopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Sidebar Toggle and Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">Work Order Management</h1>
            <Breadcrumb className="mt-1 hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    asChild 
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs text-foreground font-medium">
                    Work Orders
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <Button 
            variant="outline"
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-border text-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-transparent transform hover:scale-105 text-xs sm:text-sm font-medium px-3 sm:px-4"
            onClick={() => navigate("/add-new-work-order", { state: { from: 'home' } })}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add New</span>
            <span className="sm:hidden">Add</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-105"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-105"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;