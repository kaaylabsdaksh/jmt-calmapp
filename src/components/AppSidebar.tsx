import { useState, useMemo } from "react";
import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Settings,
  FileText,
  Truck,
  RefreshCw,
  CreditCard,
  Users,
  MapPin,
  FileSpreadsheet,
  DollarSign,
  Tags,
  BarChart3,
  Edit,
  Archive,
  CheckCircle,
  Clock,
  Zap,
  ClipboardList,
  Clipboard,
  LogOut,
  Flame,
  TruckIcon,
  Wifi,
  FileCheck,
  Barcode,
  Eye,
  Package,
  UserCheck,
  Sparkles,
  HelpCircle,
  CalendarDays,
  Search,
  X,
} from "lucide-react";
import { useTour } from "@/context/TourContext";
import { NewBadge } from "@/components/tour/NewBadge";
import { FEATURE_KEYS } from "@/lib/tour/data";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

export const workOrderQuickActions = [
  { title: "Hot List", icon: Flame },
  { title: "Transit Log", icon: TruckIcon, url: "/transit-log" },
  { title: "Update RFID's", icon: Wifi, url: "/update-rfid" },
  { title: "Rental Batch Certs", icon: FileCheck },
  { title: "PO/Change Orders", icon: FileText },
  { title: "Assign Techs", icon: Users },
  { title: "Assign Departure Info", icon: MapPin },
  { title: "Export Excel", icon: FileSpreadsheet },
  { title: "Missing Cost", icon: DollarSign },
  { title: "Create Barcode", icon: Barcode },
];

export const viewsSubItems = [
  { title: "Logistics View", icon: TruckIcon, url: "/logistics-view" },
  { title: "Customer Pickup View", icon: UserCheck, url: "/customer-pickup" },
  { title: "Shipping View", icon: Package, url: "/shipping-view" },
  { title: "Account Admin", icon: ClipboardList, url: "/account-admin" },
  { title: "Lab Triage", icon: ClipboardList, url: "/lab-triage" },
];

export const quickActionCategories: Record<string, { title: string; icon: React.ElementType; hasSubItems?: boolean; url?: string }[]> = {
  "Core Operations": [
    { title: "Work Orders", icon: ClipboardList, hasSubItems: true },
    { title: "Views", icon: Eye, hasSubItems: true },
    { title: "Standards", icon: CheckCircle, url: "/standards" },
    { title: "Invoicing", icon: CreditCard, url: "/invoicing" },
    { title: "Delivery Tickets", icon: Truck, url: "/delivery-tickets" },
    { title: "Quotes", icon: FileText, url: "/quotes" },
    { title: "Reports", icon: BarChart3 },
  ],
  "User Management": [
    { title: "Manage Users", icon: Users },
    { title: "Manage Cust Portal Users", icon: Users },
  ],
  "Product & Customer": [
    { title: "Manage Manufacturers", icon: Settings },
    { title: "Manage Products", icon: Tags, url: "/manage-products" },
    { title: "Manage Customers", icon: Users, url: "/manage-customers" },
    { title: "Search Multiple ID's", icon: FileText },
  ],
  "Inventory & Templates": [
    { title: "Manage Batch Inventories", icon: Archive },
    { title: "Manage MPG Accuracies", icon: CheckCircle },
    { title: "Manage Procedures", icon: Clipboard },
    { title: "Manage Templates", icon: FileSpreadsheet },
  ],
  "Project Management": [
    { title: "Onsite Projects", icon: MapPin, url: "/onsite-projects" },
    { title: "Onsite Scheduling", icon: CalendarDays, url: "/onsite-scheduling" },
    { title: "Onsite Scheduling V2", icon: CalendarDays, url: "/onsite-scheduling-v2" },
    { title: "Outsource Vendors", icon: Truck },
    { title: "Onsite Work Orders", icon: ClipboardList },
  ]
};

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { startTour, openDrawer } = useTour();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Core Operations"]);
  const [expandedWorkOrders, setExpandedWorkOrders] = useState(false);
  const [expandedViews, setExpandedViews] = useState(
    location.pathname === "/logistics-view" || location.pathname === "/customer-pickup"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const matches = (text: string) => text.toLowerCase().includes(query);

  const filteredCategories = useMemo(() => {
    if (!isSearching) return quickActionCategories;

    const result: typeof quickActionCategories = {};

    Object.entries(quickActionCategories).forEach(([categoryName, actions]) => {
      const filtered = actions.filter(action => {
        if (action.title === "Work Orders" && action.hasSubItems) {
          return matches(action.title) || workOrderQuickActions.some(sub => matches(sub.title));
        }
        if (action.title === "Views" && action.hasSubItems) {
          return matches(action.title) || viewsSubItems.some(sub => matches(sub.title));
        }
        return matches(action.title);
      });

      if (filtered.length > 0) {
        result[categoryName] = filtered;
      }
    });

    return result;
  }, [isSearching, query]);

  const visibleWorkOrderActions = useMemo(() => {
    if (!isSearching || matches("Work Orders")) return workOrderQuickActions;
    return workOrderQuickActions.filter(sub => matches(sub.title));
  }, [isSearching, query]);

  const visibleViewsItems = useMemo(() => {
    if (!isSearching || matches("Views")) return viewsSubItems;
    return viewsSubItems.filter(sub => matches(sub.title));
  }, [isSearching, query]);

  const groupIsExpanded = (name: string) => isSearching || expandedGroups.includes(name);

  return (
    <Sidebar
      className={`${open ? "w-64" : "w-16"} border-r-0 bg-sidebar backdrop-blur-sm animate-fade-in shadow-lg`}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          {open && (
            <div className="flex flex-col animate-fade-in">
              <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">CalMApp</h1>
              <p className="text-xs text-sidebar-foreground/70">Work Order Management</p>
            </div>
          )}
        </div>

        {open && (
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sidebar-foreground/60" />
            <Input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-7 text-sm bg-sidebar-foreground/10 border-0 rounded-md text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus-visible:ring-1 focus-visible:ring-sidebar-ring"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sidebar-foreground/60 hover:text-sidebar-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-sidebar-foreground/20 px-1 text-[10px] font-medium text-sidebar-foreground/60">
                Ctrl K
              </kbd>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {Object.entries(filteredCategories).map(([categoryName, actions], categoryIndex) => (
          <SidebarGroup key={categoryName} className="mb-4">
            {open ? (
              <Collapsible
                open={groupIsExpanded(categoryName)}
                onOpenChange={() => toggleGroup(categoryName)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel
                    className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider cursor-pointer hover:text-sidebar-foreground transition-colors flex items-center justify-between group"
                  >
                    <span>{categoryName}</span>
                    <div className="group-hover:scale-110 transition-transform">
                      {groupIsExpanded(categoryName) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </div>
                  </SidebarGroupLabel>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarGroupContent className="mt-2">
                    <SidebarMenu className="space-y-1">
                      {actions.map((action, index) => (
                        <SidebarMenuItem key={action.title}>
                          {action.title === "Work Orders" && action.hasSubItems ? (
                            <Collapsible
                              open={isSearching || expandedWorkOrders}
                              onOpenChange={setExpandedWorkOrders}
                            >
                              <div>
                                <div className="flex items-center gap-1">
                                  <SidebarMenuButton
                                    asChild
                                    tooltip={action.title}
                                    className="group flex-1"
                                  >
                                    <Link
                                      to="/"
                                      className="flex items-center w-full h-10 px-3 rounded-lg text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200 ease-in-out group-hover:translate-x-1"
                                    >
                                      {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 text-sidebar-foreground group-hover:scale-110 transition-transform duration-200" })}
                                      <span className="ml-3 font-medium text-sm animate-fade-in">
                                        {action.title}
                                      </span>
                                    </Link>
                                  </SidebarMenuButton>
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-sidebar-accent"
                                    >
                                      {isSearching || expandedWorkOrders ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                </div>

                                <CollapsibleContent>
                                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-sidebar-border pl-3">
                                    {visibleWorkOrderActions.map((subAction) => (
                                      <Button
                                        key={subAction.title}
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start h-9 px-2 text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all"
                                        onClick={() => {
                                          const url = (subAction as { url?: string }).url;
                                          if (url) navigate(url);
                                        }}
                                      >
                                        {React.createElement(subAction.icon, { className: "h-3.5 w-3.5 shrink-0 mr-2" })}
                                        <span className="text-xs">{subAction.title}</span>
                                      </Button>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          ) : action.title === "Views" && action.hasSubItems ? (
                            <Collapsible
                              open={isSearching || expandedViews}
                              onOpenChange={setExpandedViews}
                            >
                              <div>
                                <div className="flex items-center gap-1">
                                  <SidebarMenuButton
                                    tooltip={action.title}
                                    className="group flex-1"
                                  >
                                    <div
                                      className="flex items-center w-full h-10 px-3 rounded-lg text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200 ease-in-out group-hover:translate-x-1 cursor-pointer"
                                      onClick={() => setExpandedViews(!expandedViews)}
                                    >
                                      {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 text-sidebar-foreground group-hover:scale-110 transition-transform duration-200" })}
                                      <span className="ml-3 font-medium text-sm animate-fade-in">
                                        {action.title}
                                      </span>
                                    </div>
                                  </SidebarMenuButton>
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-sidebar-accent"
                                    >
                                      {isSearching || expandedViews ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                </div>

                                <CollapsibleContent>
                                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-sidebar-border pl-3">
                                    {visibleViewsItems.map((subAction) => (
                                      <Link key={subAction.title} to={subAction.url}>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`w-full justify-start h-9 px-2 rounded-md hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all ${
                                            location.pathname === subAction.url
                                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                              : "text-sidebar-foreground/80"
                                          }`}
                                        >
                                          {React.createElement(subAction.icon, { className: "h-3.5 w-3.5 shrink-0 mr-2" })}
                                          <span className="text-xs">{subAction.title}</span>
                                        </Button>
                                      </Link>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          ) : (
                            <SidebarMenuButton
                              asChild
                              tooltip={action.title}
                              className="group"
                            >
                              {(action as any).url ? (
                                <Link
                                  to={(action as any).url}
                                  data-tour={
                                    action.title === "Invoicing"
                                      ? "invoicing-nav"
                                      : action.title === "Manage Customers"
                                      ? "customers-nav"
                                      : undefined
                                  }
                                  className={`flex items-center w-full h-10 px-3 rounded-lg hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200 ease-in-out group-hover:translate-x-1 ${
                                    location.pathname === (action as any).url
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                      : "text-sidebar-foreground"
                                  }`}
                                  style={{ animationDelay: `${(categoryIndex * 100) + (index * 50)}ms` }}
                                >
                                  {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 text-sidebar-foreground group-hover:scale-110 transition-transform duration-200" })}
                                  <span className="ml-3 font-medium text-sm animate-fade-in flex items-center gap-1.5">
                                    {action.title}
                                    {action.title === "Invoicing" && (
                                      <NewBadge featureKey={FEATURE_KEYS.invoicingUnified} />
                                    )}
                                    {action.title === "Manage Customers" && (
                                      <NewBadge featureKey={FEATURE_KEYS.manageCustomers} />
                                    )}
                                  </span>
                                </Link>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start h-10 px-3 rounded-lg text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200 ease-in-out group-hover:translate-x-1"
                                  style={{
                                    animationDelay: `${(categoryIndex * 100) + (index * 50)}ms`
                                  }}
                                >
                                  {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 text-sidebar-foreground group-hover:scale-110 transition-transform duration-200" })}
                                  <span className="ml-3 font-medium text-sm animate-fade-in">
                                    {action.title}
                                  </span>
                                </Button>
                              )}
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              // Mini sidebar - show only icons
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {actions.map((action, index) => (
                    <SidebarMenuItem key={action.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={action.title}
                        className="group"
                      >
                        {action.title === "Work Orders" || (action as any).url ? (
                          <Link
                            to={action.title === "Work Orders" ? "/" : (action as any).url}
                            className={`flex items-center justify-center w-full h-10 px-0 rounded-lg hover:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:shadow-sm transition-all duration-200 ease-in-out ${
                              location.pathname === ((action as any).url ?? "/")
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground"
                            }`}
                            style={{
                              animationDelay: `${(categoryIndex * 100) + (index * 50)}ms`
                            }}
                          >
                            {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 group-hover:scale-110 transition-transform duration-200" })}
                          </Link>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-center h-10 px-0 rounded-lg text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:shadow-sm transition-all duration-200 ease-in-out"
                            style={{
                              animationDelay: `${(categoryIndex * 100) + (index * 50)}ms`
                            }}
                          >
                            {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 text-sidebar-foreground group-hover:scale-110 transition-transform duration-200" })}
                          </Button>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}

        {isSearching && Object.keys(filteredCategories).length === 0 && (
          <div className="px-3 py-6 text-center">
            <p className="text-xs text-sidebar-foreground/60">No menu items match "{searchQuery}"</p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2 space-y-1">
        {open ? (
          <>
            <Button
              variant="ghost"
              onClick={openDrawer}
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 mr-3" />
              <span className="text-sm font-medium flex items-center gap-1.5">
                What's New
                <NewBadge featureKey={FEATURE_KEYS.whatsNew} />
              </span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <span className="h-4 w-4 mr-3 text-xs font-bold flex items-center justify-center">JM</span>
              <span className="text-sm font-medium">Old App</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={openDrawer}
              className="w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200 relative"
              title="What's New"
            >
              <Sparkles className="h-4 w-4" />
              <NewBadge
                featureKey={FEATURE_KEYS.whatsNew}
                className="absolute -top-0.5 -right-0.5 text-[8px] px-1 py-0"
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <span className="text-[10px] font-bold">JM</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
