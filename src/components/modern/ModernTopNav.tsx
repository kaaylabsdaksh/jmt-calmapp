import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Download, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ModernTopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-warning px-6 py-3 border-b">
      <div className="flex items-center justify-between">
        {/* Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-black/30 text-black hover:bg-black hover:text-white hover:border-black bg-transparent transform hover:scale-105"
            onClick={() => navigate("/add-new-work-order")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <Button variant="ghost" size="sm" className="text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;