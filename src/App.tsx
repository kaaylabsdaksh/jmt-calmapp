import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import WorkOrderSearchV2 from "./pages/WorkOrderSearchV2";
import ModernWorkOrderManagement from "./pages/ModernWorkOrderManagement";
import AddNewWorkOrder from "./pages/AddNewWorkOrder";
import FormVariationsDemo from "./pages/FormVariationsDemo";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";

const App = () => {
  console.log("App component rendering");
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ModernWorkOrderManagement />} />
          <Route path="/add-new-work-order" element={<AddNewWorkOrder />} />
          <Route path="/form-variations" element={<FormVariationsDemo />} />
          <Route path="/work-orders-v2" element={<WorkOrderSearchV2 />} />
          <Route path="/work-order/:id" element={<WorkOrderDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
