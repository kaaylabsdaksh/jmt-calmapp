import { useState } from "react";
import React from "react";
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
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Core Operations"]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <Sidebar
      className={`${open ? "w-64" : "w-14"} border-r-0 bg-warning backdrop-blur-sm animate-fade-in shadow-lg`}
      collapsible="icon"
    >
      {/* Header with Company Info */}
      <SidebarHeader className="border-b border-black/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 text-black shadow-lg">
            <Zap className="h-5 w-5" />
          </div>
          {open && (
            <div className="flex flex-col animate-fade-in">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-black tracking-tight">CalMApp</h1>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-black/70">Work Order Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        {/* Navigation Label */}
        {open && (
          <div className="mb-4">
            <h2 className="text-sm font-medium text-black/70 uppercase tracking-wider">Navigation</h2>
          </div>
        )}

        {Object.entries(quickActionCategories).map(([categoryName, actions], categoryIndex) => (
          <SidebarGroup key={categoryName} className="mb-6">
            <Collapsible 
              open={expandedGroups.includes(categoryName)} 
              onOpenChange={() => toggleGroup(categoryName)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel 
                  className={`
                    px-0 py-2 text-sm font-semibold text-black/80 
                    cursor-pointer hover:text-black transition-colors
                    flex items-center justify-between group
                    ${!open && "sr-only"}
                  `}
                >
                  <span>{categoryName}</span>
                  {open && (
                    <div className="group-hover:scale-110 transition-transform">
                      {expandedGroups.includes(categoryName) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent className="mt-2">
                  <SidebarMenu className="space-y-2">
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
                              w-full justify-start h-12 px-4 rounded-xl
                              text-black hover:text-black
                              hover:bg-black/10 hover:shadow-sm
                              transition-all duration-200 ease-in-out
                              ${index === 0 ? "bg-black/15 shadow-sm" : ""}
                              ${!open && "justify-center px-0 rounded-lg"}
                            `}
                            style={{
                              animationDelay: `${(categoryIndex * 100) + (index * 50)}ms`
                            }}
                          >
                            {React.createElement(action.icon, { className: "h-5 w-5 shrink-0 transition-transform duration-200" })}
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
          <div className="mt-auto px-0 py-4 animate-fade-in">
            <Separator className="mb-4 bg-black/10" />
            <div className="text-xs text-black/60">
              <p className="font-medium mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs">All systems operational</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}