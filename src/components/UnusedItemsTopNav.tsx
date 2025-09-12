import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Download, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const UnusedItemsTopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white px-6 py-3 border-b border-border">
      <div className="flex items-center justify-between">
        {/* Sidebar Toggle and Title */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">Unused Items Management</h1>
            <Breadcrumb className="mt-1">
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
                    <Link to="/add-new-work-order">Add New Work Order</Link>
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
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="outline"
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-border text-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-transparent transform hover:scale-105 text-sm font-medium"
            onClick={() => navigate("/add-new-work-order")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Add Work Order
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

export default UnusedItemsTopNav;