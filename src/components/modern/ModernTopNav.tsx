import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Download, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ModernTopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-warning px-6 py-4 border-b shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Side - Sidebar Toggle and Title */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-black hover:bg-black/10 transition-all duration-300 transform hover:scale-105 p-2 rounded-lg" />
          <div>
            <h1 className="text-2xl font-bold text-black">Work Orders</h1>
            <p className="text-sm text-black/70 mt-1">Manage and view all work order items</p>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-black/30 text-black hover:bg-black hover:text-white hover:border-black bg-transparent transform hover:scale-105 px-6"
            onClick={() => navigate("/add-new-work-order")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <Button variant="ghost" size="sm" className="text-black hover:bg-black/10 hover:text-black transition-all duration-300 transform hover:scale-105 p-2 rounded-lg">
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-black hover:bg-black/10 hover:text-black transition-all duration-300 transform hover:scale-105 p-2 rounded-lg">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;