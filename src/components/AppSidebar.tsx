import { useState } from "react";
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
  Clock
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const quickActions = [
  { title: "Hot List", icon: FileText },
  { title: "Transit Log", icon: Truck },
  { title: "Update RFQs", icon: RefreshCw },
  { title: "Rental Status Cards", icon: CreditCard },
  { title: "PO/Exchange Orders", icon: FileText },
  { title: "Assign Techs", icon: Users },
  { title: "Assign Departure Info", icon: MapPin },
  { title: "Export Excel", icon: FileSpreadsheet },
  { title: "Missing Cost", icon: DollarSign },
  { title: "Print Labels", icon: Tags },
  { title: "Generate Reports", icon: BarChart3 },
  { title: "Bulk Update", icon: Edit },
  { title: "Archive Records", icon: Archive },
  { title: "Quality Check", icon: CheckCircle },
  { title: "Calibration Reminders", icon: Clock },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar
      className={open ? "w-64" : "w-14"}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {open && "Quick Actions"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={!open ? action.title : undefined}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-accent transition-colors"
                    >
                      <action.icon className="h-4 w-4 shrink-0" />
                      {open && <span className="ml-2">{action.title}</span>}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}