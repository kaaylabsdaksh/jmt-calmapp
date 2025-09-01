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
  Clock,
  Zap,
  Search
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
  "Work Management": [
    { title: "Hot List", icon: FileText },
    { title: "Transit Log", icon: Truck },
    { title: "Update RFQs", icon: RefreshCw },
    { title: "Assign Techs", icon: Users },
    { title: "Assign Departure Info", icon: MapPin },
    { title: "Quality Check", icon: CheckCircle },
    { title: "Calibration Reminders", icon: Clock },
  ],
  "Orders & Finance": [
    { title: "Rental Status Cards", icon: CreditCard },
    { title: "PO/Exchange Orders", icon: FileText },
    { title: "Missing Cost", icon: DollarSign },
  ],
  "Data & Reports": [
    { title: "Export Excel", icon: FileSpreadsheet },
    { title: "Generate Reports", icon: BarChart3 },
    { title: "Print Labels", icon: Tags },
  ],
  "System Actions": [
    { title: "Bulk Update", icon: Edit },
    { title: "Archive Records", icon: Archive },
  ]
};

export function AppSidebar() {
  const { open } = useSidebar();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Work Management"]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

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
        {/* Main Navigation */}
        <SidebarGroup className="mb-4">
          <SidebarGroupLabel 
            className={`
              px-3 py-2 text-xs font-semibold text-primary uppercase tracking-wider
              flex items-center justify-between group border-l-2 border-primary
              ${!open && "sr-only"}
            `}
          >
            <div className="flex items-center">
              <Search className="h-3 w-3 mr-2" />
              <span>Work Order Search & Management</span>
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Quick Actions Section */}
        {Object.entries(quickActionCategories).map(([categoryName, actions], categoryIndex) => (
          <SidebarGroup key={categoryName} className="mb-4">
            <Collapsible 
              open={expandedGroups.includes(categoryName)} 
              onOpenChange={() => toggleGroup(categoryName)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel 
                  className={`
                    px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider
                    cursor-pointer hover:text-foreground transition-colors
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
                              text-sidebar-foreground hover:text-foreground
                              hover:bg-sidebar-accent hover:shadow-sm
                              transition-all duration-200 ease-in-out
                              group-hover:translate-x-1
                              ${!open && "justify-center px-0"}
                            `}
                            style={{
                              animationDelay: `${(categoryIndex * 100) + (index * 50)}ms`
                            }}
                          >
                            <action.icon className="h-4 w-4 shrink-0 text-primary group-hover:scale-110 transition-transform duration-200" />
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