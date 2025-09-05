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

const menuItems = [
  { title: "Work Orders", icon: ClipboardList },
  { title: "Standards", icon: CheckCircle },
  { title: "Invoicing", icon: CreditCard },
  { title: "Quotes", icon: FileText },
  { title: "Reports", icon: BarChart3 },
  { title: "Manage Users", icon: Users },
  { title: "Manage Cust Portal Users", icon: Users },
  { title: "Manage Manufacturers", icon: Settings },
  { title: "Manage Products", icon: Tags },
  { title: "Manage Customers", icon: Users },
  { title: "Search Multiple ID's", icon: FileText },
  { title: "Manage Batch Inventories", icon: Archive },
  { title: "Manage MPG Accuracies", icon: CheckCircle },
  { title: "Manage Procedures", icon: Clipboard },
  { title: "Manage Templates", icon: FileSpreadsheet },
  { title: "Onsite Projects", icon: MapPin },
  { title: "Outsource Vendors", icon: Truck },
  { title: "Onsite Work Orders", icon: ClipboardList },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar
      className={`${open ? "w-64" : "w-14"} border-r-0 bg-gradient-to-b from-sidebar to-sidebar/95 backdrop-blur-sm animate-fade-in`}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
            <Zap className="h-5 w-5" />
          </div>
          {open && (
            <div className="flex flex-col animate-fade-in">
              <h1 className="text-lg font-bold text-foreground tracking-tight">CalMApp</h1>
              <p className="text-xs text-muted-foreground">Work Order Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={!open ? item.title : undefined}
                    className="group"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`
                        w-full justify-start h-10 px-3 
                        text-sidebar-foreground hover:text-foreground
                        hover:bg-sidebar-accent hover:shadow-sm
                        transition-all duration-200 ease-in-out
                        group-hover:translate-x-1
                        ${!open && "justify-center px-0"}
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      {React.createElement(item.icon, { className: "h-4 w-4 shrink-0 text-primary group-hover:scale-110 transition-transform duration-200" })}
                      {open && (
                        <span className="ml-3 font-medium text-sm animate-fade-in">
                          {item.title}
                        </span>
                      )}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Footer section when expanded */}
        {open && (
          <div className="mt-auto px-3 py-4 animate-fade-in">
            <Separator className="mb-3 bg-sidebar-border/30" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">System Status</p>
              <p className="text-xs mt-1 text-green-500">● All systems operational</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}