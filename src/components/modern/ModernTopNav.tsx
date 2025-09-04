import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Download, Settings } from "lucide-react";

const ModernTopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-warning px-4 sm:px-6 py-3 border-b">
      <div className="flex items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex flex-col min-w-0">
            <span className="text-lg sm:text-xl font-bold text-black truncate">CalMApp</span>
            <span className="text-xs sm:text-sm text-black hidden sm:block">Work Order Management</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Button 
            variant="outline"
            size="sm"
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-black/30 text-black hover:bg-black/10 bg-transparent text-xs sm:text-sm px-2 sm:px-4"
            onClick={() => navigate("/add-new-work-order")}
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add New</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-black hover:bg-black/10 p-2">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-black hover:bg-black/10 p-2">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;