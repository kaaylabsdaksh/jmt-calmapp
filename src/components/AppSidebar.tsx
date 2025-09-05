import { useState } from "react";
import React from "react";
import { useLocation } from "react-router-dom";
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
  Clipboard
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

const quickActionCategories = {
  "Core Operations": [
    { title: "Work Orders", icon: ClipboardList },
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
      return location.pathname === "/" || location.pathname.includes("work-order");
    }
    return false;
  };

  return (
    <Sidebar
      className={`${open ? "w-64" : "w-14"} border-r-0 bg-sidebar backdrop-blur-sm animate-fade-in shadow-lg`}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
            <Zap className="h-5 w-5" />
          </div>
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
            <Collapsible 
              open={expandedGroups.includes(categoryName)} 
              onOpenChange={() => toggleGroup(categoryName)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel 
                  className={`
                    px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider
                    cursor-pointer hover:text-sidebar-foreground transition-colors
                    flex items-center justify-between group
                    ${!open && "sr-only"}
                  `}
                >
                  <span>{categoryName}</span>
                  {open && (
                    <div className="group-hover:scale-110 transition-transform">
                      {expandedGroups.includes(categoryName) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </div>
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent className="mt-2">
                  <SidebarMenu className="space-y-1">
                    {actions.map((action, index) => (
                      <SidebarMenuItem key={action.title}>
                        <SidebarMenuButton 
                          asChild
                          tooltip={!open ? action.title : undefined}
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
                              ${!open && "justify-center px-0"}
                            `}
                            style={{
                              animationDelay: `${(categoryIndex * 100) + (index * 50)}ms`
                            }}
                          >
                            {React.createElement(action.icon, { className: "h-4 w-4 shrink-0 text-sidebar-foreground group-hover:scale-110 transition-transform duration-200" })}
                            {open && (
                              <span className="ml-3 font-medium text-sm animate-fade-in">
                                {action.title}
                              </span>
                            )}
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
        
        {/* Footer section when expanded */}
        {open && (
          <div className="mt-auto px-3 py-4 animate-fade-in">
            <Separator className="mb-3 bg-sidebar-border" />
            <div className="text-xs text-sidebar-foreground/70">
              <p className="font-medium">System Status</p>
              <p className="text-xs mt-1 text-green-600">● All systems operational</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}