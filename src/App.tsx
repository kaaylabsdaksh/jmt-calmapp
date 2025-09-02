import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import WorkOrderSearchV2 from "./pages/WorkOrderSearchV2";
import ModernWorkOrderManagement from "./pages/ModernWorkOrderManagement";
import NotFound from "./pages/NotFound";

const App = () => {
  console.log("App component rendering");
  
  return (
  <BrowserRouter>
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with Sidebar Toggle */}
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur px-4">
            <SidebarTrigger className="mr-2" />
          </header>
          
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/work-orders-v2" element={<WorkOrderSearchV2 />} />
              <Route path="/modern" element={<ModernWorkOrderManagement />} />
              <Route path="/work-order/:id" element={<WorkOrderDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  </BrowserRouter>
  );
};

export default App;
