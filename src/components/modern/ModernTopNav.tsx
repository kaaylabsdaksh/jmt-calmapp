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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-black">CalMApp</span>
            <span className="text-sm text-black">Work Order Management</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-black/20 text-black hover:bg-black/10"
            onClick={() => navigate("/add-new-work-order")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <Button variant="ghost" size="sm" className="text-black hover:bg-black/10">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-black hover:bg-black/10">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;