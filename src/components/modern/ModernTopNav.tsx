import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Download, Settings } from "lucide-react";

const ModernTopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-warning px-6 py-3 border-b">
      <div className="flex items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-black">CalMApp</span>
            <span className="text-sm text-black">Work Order Management</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            className="group rounded-xl shadow-sm border-black/30 text-black bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-black/5 hover:border-black/50 hover:-translate-y-0.5"
            onClick={() => navigate("/add-new-work-order")}
          >
            <Plus className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
            Add New
          </Button>
          <Button variant="ghost" size="sm" className="text-black transition-all duration-300 hover:scale-110 hover:bg-black/10 hover:shadow-md hover:-translate-y-0.5 hover:rotate-3">
            <Download className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </Button>
          <Button variant="ghost" size="sm" className="text-black transition-all duration-300 hover:scale-110 hover:bg-black/10 hover:shadow-md hover:-translate-y-0.5 hover:rotate-12">
            <Settings className="h-4 w-4 transition-transform duration-300 hover:rotate-90" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;