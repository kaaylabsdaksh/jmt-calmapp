import { useState } from "react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ModernSidebar from "@/components/modern/ModernSidebar";
import ModernWorkOrdersTable from "@/components/modern/ModernWorkOrdersTable";

const ModernWorkOrderManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <ModernTopNav />
      
      <div className="flex">
        <ModernSidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-0" : ""
        }`}>
          <div className="p-6">
            <ModernWorkOrdersTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernWorkOrderManagement;