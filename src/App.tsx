import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import WorkOrderSearchV2 from "./pages/WorkOrderSearchV2";
import ModernWorkOrderManagement from "./pages/ModernWorkOrderManagement";
import NotFound from "./pages/NotFound";

const App = () => {
  console.log("App component rendering");
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModernWorkOrderManagement />} />
        <Route path="/work-orders-v2" element={<WorkOrderSearchV2 />} />
        <Route path="/work-order/:id" element={<WorkOrderDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
