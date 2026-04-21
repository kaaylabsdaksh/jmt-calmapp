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

type Crumb = { label: string; to?: string };
const routeMeta: Record<string, { title: string; crumbs: Crumb[] }> = {
  "/": { title: "Work Order Management", crumbs: [{ label: "Home", to: "/" }, { label: "Work Orders" }] },
  "/onsite-projects": { title: "Onsite Projects", crumbs: [{ label: "Home", to: "/" }, { label: "Onsite Projects" }] },
  "/onsite-projects/new": { title: "Onsite Project # XXX", crumbs: [{ label: "Onsite Projects", to: "/onsite-projects" }, { label: "New Project" }] },
};

const ModernTopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const meta = routeMeta[location.pathname] ?? routeMeta["/"];

  return (
    <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Sidebar Toggle and Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">{meta.title}</h1>
            {location.pathname === "/onsite-projects" ? null : (
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
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 transform hover:scale-105"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          {location.pathname !== "/onsite-projects" && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all duration-300 transform hover:scale-105"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ModernTopNav;