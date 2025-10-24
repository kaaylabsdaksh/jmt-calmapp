import { useState } from "react";
import React from "react";
import { useLocation, Link } from "react-router-dom";
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
  Barcode
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

const workOrderQuickActions = [
  { title: "Hot List", icon: Flame },
  { title: "Transit Log", icon: TruckIcon },
  { title: "Update RFID's", icon: Wifi },
  { title: "Rental Batch Certs", icon: FileCheck },
  { title: "PO/Change Orders", icon: FileText },
  { title: "Assign Techs", icon: Users },
  { title: "Assign Departure Info", icon: MapPin },
  { title: "Export Excel", icon: FileSpreadsheet },
  { title: "Missing Cost", icon: DollarSign },
  { title: "Create Barcode", icon: Barcode },
];

const quickActionCategories = {
  "Core Operations": [
    { title: "Work Orders", icon: ClipboardList, hasSubItems: true },
    { title: "Standards", icon: CheckCircle },
    { title: "Invoicing", icon: CreditCard },
    { title: "Quotes", icon: FileText },
    { title: "Reports", icon: BarChart3 },
  ],
  "User Management": [
    { title: "Manage Users", icon: Users },
    { title: "Manage Cust Portal Users", icon: Users },
  ],
  "Product & Customer": [
    { title: "Manage Manufacturers", icon: Settings },
    { title: "Manage Products", icon: Tags },
    { title: "Manage Customers", icon: Users },
    { title: "Search Multiple ID's", icon: FileText },
  ],
  "Inventory & Templates": [
    { title: "Manage Batch Inventories", icon: Archive },
    { title: "Manage MPG Accuracies", icon: CheckCircle },
    { title: "Manage Procedures", icon: Clipboard },
    { title: "Manage Templates", icon: FileSpreadsheet },
  ],
  "Project Management": [
    { title: "Onsite Projects", icon: MapPin },
    { title: "Outsource Vendors", icon: Truck },
    { title: "Onsite Work Orders", icon: ClipboardList },
  ]
};

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Core Operations"]);
  const [expandedWorkOrders, setExpandedWorkOrders] = useState(false);

  const handleLogout = () => {
    // Navigate to login page
    window.location.href = "/login";
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  // Check if current item is active (for Work Orders screen)
  const isActiveItem = (itemTitle: string) => {
    if (itemTitle === "Work Orders") {
      return location.pathname === "/" || location.pathname.includes("work-order") || location.pathname === "/add-new-work-order";
    }
    return false;
  };

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
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {Object.entries(quickActionCategories).map(([categoryName, actions], categoryIndex) => (
          <SidebarGroup key={categoryName} className="mb-4">
            {open ? (
              <Collapsible 
                open={expandedGroups.includes(categoryName)} 
                onOpenChange={() => toggleGroup(categoryName)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel 
                    className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider cursor-pointer hover:text-sidebar-foreground transition-colors flex items-center justify-between group"
                  >
                    <span>{categoryName}</span>
                    <div className="group-hover:scale-110 transition-transform">
                      {expandedGroups.includes(categoryName) ? (
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
                              open={expandedWorkOrders} 
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
                                      className={`
                                        flex items-center w-full h-10 px-3 rounded-md
                                        ${isActiveItem(action.title) 
                                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-semibold" 
                                          : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                                        }
                                        hover:bg-sidebar-accent hover:shadow-sm
                                        transition-all duration-200 ease-in-out
                                        group-hover:translate-x-1
                                      `}
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
                                      {expandedWorkOrders ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                </div>
                                
                                <CollapsibleContent>
                                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-sidebar-border pl-3">
                                    {workOrderQuickActions.map((subAction) => (
                                      <Button
                                        key={subAction.title}
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start h-9 px-2 text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all"
                                      >
                                        {React.createElement(subAction.icon, { className: "h-3.5 w-3.5 shrink-0 mr-2" })}
                                        <span className="text-xs">{subAction.title}</span>
                                      </Button>
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`
                                  w-full justify-start h-10 px-3 
                                  ${isActiveItem(action.title) 
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-semibold" 
                                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                                  }
                                  hover:bg-sidebar-accent hover:shadow-sm
                                  transition-all duration-200 ease-in-out
                                  group-hover:translate-x-1
                                `}
                                style={{
                                  animationDelay: `${(categoryIndex * 100) + (index * 50)}ms`
                                }}
                              >
                                {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 text-sidebar-foreground group-hover:scale-110 transition-transform duration-200" })}
                                <span className="ml-3 font-medium text-sm animate-fade-in">
                                  {action.title}
                                </span>
                              </Button>
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
                        {action.title === "Work Orders" ? (
                          <Link
                            to="/"
                            className={`
                              flex items-center justify-center w-full h-10 px-0 rounded-md
                              ${isActiveItem(action.title) 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-semibold" 
                                : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                              }
                              hover:bg-sidebar-accent hover:shadow-sm
                              transition-all duration-200 ease-in-out
                            `}
                            style={{
                              animationDelay: `${(categoryIndex * 100) + (index * 50)}ms`
                            }}
                          >
                            {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 text-sidebar-foreground group-hover:scale-110 transition-transform duration-200" })}
                          </Link>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`
                              w-full justify-center h-10 px-0
                              ${isActiveItem(action.title) 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-semibold" 
                                : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                              }
                              hover:bg-sidebar-accent hover:shadow-sm
                              transition-all duration-200 ease-in-out
                            `}
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
        
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {open ? (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span className="text-sm font-medium">Logout</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}