import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Plus, Download } from "lucide-react";

const ModernTopNav = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo Placeholder */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WO</span>
          </div>
          <span className="text-xl font-bold text-gray-900">WorkFlow</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
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