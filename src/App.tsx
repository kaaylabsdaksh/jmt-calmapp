import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import WorkOrderSearchV2 from "./pages/WorkOrderSearchV2";
import ModernWorkOrderManagement from "./pages/ModernWorkOrderManagement";
import AddNewWorkOrder from "./pages/AddNewWorkOrder";
import FormVariationsDemo from "./pages/FormVariationsDemo";
import EditOrder from "./pages/EditOrder";
import ModernAddNewItem from "./pages/ModernAddNewItem";
import UnusedItemsManagement from "./pages/UnusedItemsManagement";
import WorkOrderBatchDetailsDemo from "./pages/WorkOrderBatchDetailsDemo";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { Layout } from "./components/Layout";

const App = () => {
  console.log("App component rendering");
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/" element={<ModernWorkOrderManagement />} />
          <Route path="/add-new-work-order" element={<AddNewWorkOrder />} />
          <Route path="/modern-add-new-item" element={<ModernAddNewItem />} />
          <Route path="/unused-items" element={<UnusedItemsManagement />} />
          <Route path="/form-variations" element={<FormVariationsDemo />} />
          <Route path="/edit-order" element={<EditOrder />} />
          <Route path="/work-orders-v2" element={<WorkOrderSearchV2 />} />
          <Route path="/work-order/:id" element={<WorkOrderDetail />} />
          <Route path="/batch-details" element={<WorkOrderBatchDetailsDemo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
