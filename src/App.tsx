import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import PointerEventsGuard from "./components/PointerEventsGuard";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import WorkOrderSearchV2 from "./pages/WorkOrderSearchV2";
import ModernWorkOrderManagement from "./pages/ModernWorkOrderManagement";
import AddNewWorkOrder from "./pages/AddNewWorkOrder";
import EditBatchWorkOrder from "./pages/EditBatchWorkOrder";
import FormVariationsDemo from "./pages/FormVariationsDemo";
import ESLItemDemo from "./pages/ESLItemDemo";
import EslBlankets from "./pages/esl/EslBlankets";
import EslCoverUps from "./pages/esl/EslCoverUps";
import EslFootwear from "./pages/esl/EslFootwear";
import EslGloves from "./pages/esl/EslGloves";
import EslGrounds from "./pages/esl/EslGrounds";
import EslOnsiteBlankets from "./pages/esl/onsite/EslOnsiteBlankets";
import EslOnsiteBucketTrucks from "./pages/esl/onsite/EslOnsiteBucketTrucks";
import EslOnsiteCoverUps from "./pages/esl/onsite/EslOnsiteCoverUps";
import EslOnsiteGrounds from "./pages/esl/onsite/EslOnsiteGrounds";
import EslOnsiteHotsticks from "./pages/esl/onsite/EslOnsiteHotsticks";
import EslOnsiteJumpers from "./pages/esl/onsite/EslOnsiteJumpers";
import EslOnsiteLineHoses from "./pages/esl/onsite/EslOnsiteLineHoses";
import EditOrder from "./pages/EditOrder";

import UnusedItemsManagement from "./pages/UnusedItemsManagement";
import WorkOrderBatchDetailsDemo from "./pages/WorkOrderBatchDetailsDemo";
import ItemDetail from "./pages/ItemDetail";
import LogisticsView from "./pages/LogisticsView";
import CustomerPickupView from "./pages/CustomerPickupView";
import ShippingView from "./pages/ShippingView";
import AccountAdminView from "./pages/AccountAdminView";
import OnsiteProjects from "./pages/OnsiteProjects";
import OnsiteScheduling from "./pages/OnsiteScheduling";
import OnsiteSchedulingV2 from "./pages/OnsiteSchedulingV2";
import OnsiteProjectDetail from "./pages/OnsiteProjectDetail";
import VehicleStandards from "./pages/VehicleStandards";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Invoicing from "./pages/Invoicing";
import InvoicingUnified from "./pages/InvoicingUnified";
import DeliveryTickets from "./pages/DeliveryTickets";
import TransitLog from "./pages/TransitLog";
import ManageCustomers from "./pages/ManageCustomers";
import ManageProducts from "./pages/ManageProducts";
import ProductDetail from "./pages/ProductDetail";
import NewProductReview from "./pages/NewProductReview";
import NewProduct from "./pages/NewProduct";
import Quotes from "./pages/Quotes";
import NewQuote from "./pages/NewQuote";
import ProductReviews from "./pages/ProductReviews";
import EditCustomer from "./pages/EditCustomer";
import RetestNotices from "./pages/RetestNotices";
import RetestFollowUp from "./pages/RetestFollowUp";
import CustomerDocumentReviews from "./pages/CustomerDocumentReviews";
import EditCdr from "./pages/EditCdr";
import NewCdr from "./pages/NewCdr";
import SrDocuments from "./pages/SrDocuments";
import SrDocumentDetail from "./pages/SrDocumentDetail";
import NewSrDocument from "./pages/NewSrDocument";
import ContractReviews from "./pages/ContractReviews";
import BulkContractPricingUpdate from "./pages/BulkContractPricingUpdate";
import EditContractReview from "./pages/EditContractReview";
import NewContractReview from "./pages/NewContractReview";
import WhatsNew from "./pages/WhatsNew";
import { Layout } from "./components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TourProvider } from "@/context/TourContext";
import { WelcomeModal } from "@/components/tour/WelcomeModal";
import { GuidedTour } from "@/components/tour/GuidedTour";
import { WhatsNewDrawer } from "@/components/tour/WhatsNewDrawer";
import GlobalOpenDecisionsFab, {
  OpenDecisionsProvider,
} from "@/components/onsite-scheduling/GlobalOpenDecisions";

const App = () => {
  console.log("App component rendering");
  
  return (
    <BrowserRouter>
      <TourProvider>
        <OpenDecisionsProvider>
        <GlobalOpenDecisionsFab />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/" element={<ModernWorkOrderManagement />} />
            <Route path="/add-new-work-order" element={<AddNewWorkOrder />} />
            <Route path="/edit-batch-work-order" element={<EditBatchWorkOrder />} />
            <Route path="/unused-items" element={<UnusedItemsManagement />} />
            <Route path="/form-variations" element={<FormVariationsDemo />} />
            <Route path="/esl-items" element={<ESLItemDemo />} />
            <Route path="/esl/blankets" element={<EslBlankets />} />
            <Route path="/esl/coverups" element={<EslCoverUps />} />
            <Route path="/esl/footwear" element={<EslFootwear />} />
            <Route path="/esl/gloves" element={<EslGloves />} />
            <Route path="/esl/grounds" element={<EslGrounds />} />
            <Route path="/esl/onsite/blankets" element={<EslOnsiteBlankets />} />
            <Route path="/esl/onsite/bucket-trucks" element={<EslOnsiteBucketTrucks />} />
            <Route path="/esl/onsite/coverups" element={<EslOnsiteCoverUps />} />
            <Route path="/esl/onsite/grounds" element={<EslOnsiteGrounds />} />
            <Route path="/esl/onsite/hotsticks" element={<EslOnsiteHotsticks />} />
            <Route path="/esl/onsite/jumpers" element={<EslOnsiteJumpers />} />
            <Route path="/esl/onsite/line-hoses" element={<EslOnsiteLineHoses />} />
            <Route path="/edit-order" element={<EditOrder />} />

            <Route path="/work-orders-v2" element={<WorkOrderSearchV2 />} />
            <Route path="/work-order/:id" element={<WorkOrderDetail />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/logistics-view" element={<LogisticsView />} />
            <Route path="/customer-pickup" element={<CustomerPickupView />} />
            <Route path="/shipping-view" element={<ShippingView />} />
            <Route path="/account-admin" element={<AccountAdminView />} />

            <Route path="/batch-details" element={<WorkOrderBatchDetailsDemo />} />
            <Route path="/onsite-projects" element={<OnsiteProjects />} />
            <Route path="/onsite-scheduling" element={<OnsiteScheduling />} />
            {/* the demo prototype's own route name, kept as an alias */}
            <Route path="/onsite-scheduling-prototype" element={<OnsiteScheduling />} />
            <Route path="/onsite-scheduling-v2" element={<OnsiteSchedulingV2 />} />

            <Route path="/onsite-projects/new" element={<OnsiteProjectDetail />} />
            <Route path="/onsite-projects/vehicle-standards" element={<VehicleStandards />} />
            <Route path="/invoicing" element={<Invoicing />} />
            <Route path="/invoicing-unified" element={<InvoicingUnified />} />
            <Route path="/delivery-tickets" element={<DeliveryTickets />} />
            <Route path="/transit-log" element={<TransitLog />} />
            <Route path="/manage-customers" element={<ManageCustomers />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/new" element={<NewQuote />} />
            <Route path="/manage-products" element={<ManageProducts />} />
            <Route path="/manage-products/new" element={<NewProduct />} />
            <Route path="/manage-products/product-reviews" element={<ProductReviews />} />
            <Route path="/manage-products/product-review/new" element={<NewProductReview />} />
            <Route path="/manage-products/:id" element={<ProductDetail />} />
            <Route path="/manage-customers/new" element={<EditCustomer />} />
            <Route path="/manage-customers/retest-notices" element={<RetestNotices />} />
            <Route path="/manage-customers/retest-followup" element={<RetestFollowUp />} />
            <Route path="/manage-customers/cdr" element={<CustomerDocumentReviews />} />
            <Route path="/manage-customers/cdr/new" element={<NewCdr />} />
            <Route path="/manage-customers/cdr/:cdrId" element={<EditCdr />} />
            <Route path="/manage-customers/sr-documents" element={<SrDocuments />} />
            <Route path="/manage-customers/sr-documents/new" element={<NewSrDocument />} />
            <Route path="/manage-customers/sr-documents/:sr" element={<SrDocumentDetail />} />


            <Route path="/manage-customers/bulk-contract-pricing" element={<BulkContractPricingUpdate />} />


            <Route path="/manage-customers/contract-reviews" element={<ContractReviews />} />
            <Route path="/manage-customers/contract-reviews/new" element={<NewContractReview />} />
            <Route path="/manage-customers/contract-reviews/:reviewId" element={<EditContractReview />} />
            <Route path="/manage-customers/:accountNumber" element={<EditCustomer />} />



            <Route path="/whats-new" element={<WhatsNew />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </OpenDecisionsProvider>
        <PointerEventsGuard />
        <WelcomeModal />
        <WhatsNewDrawer />
        <GuidedTour />
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </TourProvider>
    </BrowserRouter>
  );
};

export default App;
