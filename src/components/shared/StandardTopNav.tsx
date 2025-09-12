import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Plus, Download, Settings, ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface StandardTopNavProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  showAddButton?: boolean;
  addButtonText?: string;
  addButtonAction?: () => void;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonAction?: () => void;
}

const StandardTopNav = ({ 
  title, 
  breadcrumbs, 
  showAddButton = false,
  addButtonText = "Add New",
  addButtonAction,
  showBackButton = false,
  backButtonText = "Back",
  backButtonAction
}: StandardTopNavProps) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (addButtonAction) {
      addButtonAction();
    } else {
      navigate("/add-new-work-order", { state: { from: 'other' } });
    }
  };

  const handleBackClick = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="bg-white px-6 py-3 border-b border-border">
      <div className="flex items-center justify-between">
        {/* Sidebar Toggle and Title */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">{title}</h1>
            <Breadcrumb className="mt-1">
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink 
                          asChild 
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Link to={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-xs text-foreground font-medium">
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {showBackButton && (
            <Button 
              variant="outline"
              className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-border text-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-transparent transform hover:scale-105 text-sm font-medium"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backButtonText}
            </Button>
          )}
          {showAddButton && (
            <Button 
              variant="outline"
              className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-border text-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-transparent transform hover:scale-105 text-sm font-medium"
              onClick={handleAddClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              {addButtonText}
            </Button>
          )}
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

export default StandardTopNav;