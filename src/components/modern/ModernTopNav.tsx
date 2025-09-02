import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

const ModernTopNav = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo Placeholder */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">CalMApp</span>
            <span className="text-sm text-gray-500">Work Order Management</span>
          </div>
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