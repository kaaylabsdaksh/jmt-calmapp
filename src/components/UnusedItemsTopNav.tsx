import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Download, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const UnusedItemsTopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Sidebar Toggle and Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">Unused Items Management</h1>
            <Breadcrumb className="mt-1 hidden lg:block">
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
                  <BreadcrumbLink 
                    asChild 
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Link 
                      to="/add-new-work-order" 
                      state={{ from: 'unused-items' }}
                    >
                      Add New Work Order
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs text-foreground font-medium">
                    Unused Items
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
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary bg-transparent transform hover:scale-105 text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
            onClick={() => navigate("/add-new-work-order", { state: { from: 'unused-items' } })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Add Work Order</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 transform hover:scale-105"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 transform hover:scale-105"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UnusedItemsTopNav;