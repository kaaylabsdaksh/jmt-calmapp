import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";

import WorkOrderDetail from "./pages/WorkOrderDetail";
import WorkOrderSearchV2 from "./pages/WorkOrderSearchV2";
import ModernWorkOrderManagement from "./pages/ModernWorkOrderManagement";
import NotFound from "./pages/NotFound";

const App = () => {
  console.log("App component rendering");
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with sidebar */}
        <Route path="/" element={<ModernWorkOrderManagement />} />
        <Route path="/work-orders-v2" element={
          <SidebarLayout>
            <WorkOrderSearchV2 />
          </SidebarLayout>
        } />
        <Route path="/work-order/:id" element={
          <SidebarLayout>
            <WorkOrderDetail />
          </SidebarLayout>
        } />
        <Route path="*" element={
          <SidebarLayout>
            <NotFound />
          </SidebarLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
