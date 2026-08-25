import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Plus, Download, Settings, FileSpreadsheet, FileText } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpMenu } from "@/components/tour/HelpMenu";

type Crumb = { label: string; to?: string };
const routeMeta: Record<string, { title: string; crumbs: Crumb[] }> = {
  "/": { title: "Work Order Management", crumbs: [{ label: "Home", to: "/" }, { label: "Work Orders" }] },
  "/onsite-projects": { title: "Onsite Projects", crumbs: [{ label: "Home", to: "/" }, { label: "Onsite Projects" }] },
  "/onsite-projects/new": { title: "Onsite Project # XXX", crumbs: [{ label: "Onsite Projects", to: "/onsite-projects" }, { label: "New Project" }] },
  "/manage-customers": { title: "Manage Customers", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Customers" }] },
  "/quotes": { title: "Quotes", crumbs: [{ label: "Home", to: "/" }, { label: "Quotes" }] },
  "/quotes/new": { title: "Add New Quote", crumbs: [{ label: "Home", to: "/" }, { label: "Quotes", to: "/quotes" }, { label: "Add New Quote" }] },
  "/manage-products": { title: "Manage Products", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Products" }] },
  "/manage-products/new": { title: "Add New Product", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Products", to: "/manage-products" }, { label: "Add New Product" }] },
  "/manage-products/product-reviews": { title: "Product Reviews", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Products", to: "/manage-products" }, { label: "Product Reviews" }] },
  "/manage-products/product-review/new": { title: "Product Review Details", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Products", to: "/manage-products" }, { label: "Add New Product Review" }] },
  "/manage-products/:id": { title: "Product Details", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Products", to: "/manage-products" }, { label: "Product Details" }] },
  "/manage-customers/retest-notices": { title: "Retest Notice Management", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Retest Notices" }] },
  "/manage-customers/cdr": { title: "Customer Document Reviews", crumbs: [{ label: "Home", to: "/" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Manage CDR" }] },
  "/manage-customers/cdr/new": { title: "Add New CDR", crumbs: [{ label: "Home", to: "/" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Manage CDR", to: "/manage-customers/cdr" }, { label: "Add New CDR" }] },
  "/manage-customers/cdr/:cdrId": { title: "Edit CDR", crumbs: [{ label: "Home", to: "/" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Manage CDR", to: "/manage-customers/cdr" }, { label: "Edit CDR" }] },
  "/manage-customers/contract-reviews": { title: "Contract Reviews", crumbs: [{ label: "Home", to: "/" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Contract Reviews" }] },
  "/manage-customers/bulk-contract-pricing": { title: "Bulk Contract Pricing Update", crumbs: [{ label: "Home", to: "/" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Bulk Contract Pricing Update" }] },
  "/manage-customers/contract-reviews/new": { title: "Add New Contract Review", crumbs: [{ label: "Home", to: "/" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Contract Reviews", to: "/manage-customers/contract-reviews" }, { label: "Add New Contract Review" }] },
  "/manage-customers/contract-reviews/:reviewId": { title: "Edit Contract Review", crumbs: [{ label: "Home", to: "/" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Contract Reviews", to: "/manage-customers/contract-reviews" }, { label: "Edit Contract Review" }] },
  "/manage-customers/sr-documents": { title: "SR Documents", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "SR Documents" }] },
  "/manage-customers/sr-documents/new": { title: "New SR Document", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "SR Documents", to: "/manage-customers/sr-documents" }, { label: "New SR Document" }] },
  "/manage-customers/sr-documents/:sr": { title: "SR Document Details", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "SR Documents", to: "/manage-customers/sr-documents" }, { label: "SR Document Details" }] },
  "/manage-customers/retest-followup": { title: "Retest Follow-up", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Retest Follow-up" }] },
  "/manage-customers/:accountNumber": { title: "Customer Details", crumbs: [{ label: "Home", to: "/" }, { label: "Product & Customer" }, { label: "Manage Customers", to: "/manage-customers" }, { label: "Customer Details" }] },
};

const eslOnsiteMeta = { title: "Add New Work Order Item", crumbs: [{ label: "Home", to: "/" }, { label: "Add New Work Order", to: "/add-new-work-order" }, { label: "Add New Item" }] };
[
  "bucket-trucks",
  "coverups",
  "grounds",
  "hotsticks",
  "jumpers",
  "line-hoses",
].forEach((slug) => {
  routeMeta[`/esl/onsite/${slug}`] = eslOnsiteMeta;
});

const ModernTopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const exactMeta = routeMeta[location.pathname];
  const cdrDetailMatch = !exactMeta && /^\/manage-customers\/cdr\/[^/]+$/.test(location.pathname);
  const contractReviewDetailMatch = !exactMeta && /^\/manage-customers\/contract-reviews\/[^/]+$/.test(location.pathname);
  const srDetailMatch = !exactMeta && /^\/manage-customers\/sr-documents\/[^/]+$/.test(location.pathname);
  const customerDetailMatch = !exactMeta && !cdrDetailMatch && !contractReviewDetailMatch && !srDetailMatch && /^\/manage-customers\/[^/]+$/.test(location.pathname);
  const productDetailMatch = !exactMeta && /^\/manage-products\/[^/]+$/.test(location.pathname);
  const meta = productDetailMatch
    ? routeMeta["/manage-products/:id"]
    : contractReviewDetailMatch
    ? routeMeta["/manage-customers/contract-reviews/:reviewId"]
    : cdrDetailMatch
    ? routeMeta["/manage-customers/cdr/:cdrId"]
    : srDetailMatch
    ? routeMeta["/manage-customers/sr-documents/:sr"]
    : customerDetailMatch
    ? routeMeta["/manage-customers/:accountNumber"]
    : exactMeta ?? routeMeta["/"];

  return (
    <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Sidebar Toggle and Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">{meta.title}</h1>
            {location.pathname === "/onsite-projects" || meta.crumbs.length === 0 ? null : (
              <Breadcrumb className="mt-1 hidden sm:block">
                <BreadcrumbList>
                  {meta.crumbs.map((c, i) => {
                    const isLast = i === meta.crumbs.length - 1;
                    return (
                      <span key={`${c.label}-${i}`} className="contents">
                        <BreadcrumbItem>
                          {isLast || !c.to ? (
                            <BreadcrumbPage className="text-xs text-foreground font-medium">
                              {c.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              asChild
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Link to={c.to}>{c.label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </span>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          {location.pathname !== "/onsite-projects/new" && location.pathname !== "/onsite-projects/vehicle-standards" && !customerDetailMatch && (location.pathname !== "/quotes" && location.pathname !== "/quotes/new") && (
            <Button 
              variant="outline"
              className="rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary bg-transparent transform hover:scale-105 text-xs sm:text-sm font-medium px-3 sm:px-4"
              onClick={() => {
                if (location.pathname === "/onsite-projects") navigate("/onsite-projects/new");
                else navigate("/add-new-work-order", { state: { from: 'home' } });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add New</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
          {location.pathname !== "/manage-products" && (location.pathname !== "/quotes" && location.pathname !== "/quotes/new") && (
            <>
              {location.pathname === "/onsite-projects" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 transform hover:scale-105"
                      title="Export"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="text-xs">
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-2" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">
                      <FileText className="h-3.5 w-3.5 mr-2" />
                      Export with Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : location.pathname !== "/onsite-projects/vehicle-standards" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 transform hover:scale-105"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              ) : null}
              {location.pathname !== "/onsite-projects" && location.pathname !== "/onsite-projects/vehicle-standards" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 transform hover:scale-105"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              <HelpMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;