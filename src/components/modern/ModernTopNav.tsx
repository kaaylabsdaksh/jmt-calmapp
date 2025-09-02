import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

const ModernTopNav = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo Placeholder */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WO</span>
          </div>
          <span className="text-xl font-bold text-gray-900">WorkOrder</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;