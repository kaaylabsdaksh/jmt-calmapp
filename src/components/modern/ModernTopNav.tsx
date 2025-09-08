import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Download, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ModernTopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-b border-border">
      <div className="flex items-center justify-between">
        {/* Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile: Show only icons, Desktop: Show text + icons */}
          <Button 
            variant="outline"
            size="sm"
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-border text-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 bg-transparent transform hover:scale-105 px-2 sm:px-4"
            onClick={() => navigate("/add-new-work-order")}
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add New</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;