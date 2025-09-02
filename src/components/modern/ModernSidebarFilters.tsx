import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface ModernSidebarFiltersProps {
  activeStatusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  workOrderCounts: {
    all: number;
    inLab: number;
    completed: number;
    overdue: number;
    pending: number;
  };
}

export function ModernSidebarFilters({ activeStatusFilter, onStatusFilterChange, workOrderCounts }: ModernSidebarFiltersProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const statusFilters = [
    { 
      key: 'all', 
      label: 'All', 
      count: workOrderCounts.all,
      colorClass: 'border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    { 
      key: 'in-lab', 
      label: 'In Lab', 
      count: workOrderCounts.inLab,
      colorClass: 'border-blue-300 text-blue-700 hover:bg-blue-50'
    },
    { 
      key: 'completed', 
      label: 'Completed', 
      count: workOrderCounts.completed,
      colorClass: 'border-green-300 text-green-700 hover:bg-green-50'
    },
    { 
      key: 'overdue', 
      label: 'Overdue', 
      count: workOrderCounts.overdue,
      colorClass: 'border-red-300 text-red-700 hover:bg-red-50'
    },
    { 
      key: 'pending', 
      label: 'Pending', 
      count: workOrderCounts.pending,
      colorClass: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
    }
  ];

  const getActiveColorClass = (key: string) => {
    switch (key) {
      case 'all': return 'bg-gray-900 hover:bg-gray-800 text-white';
      case 'in-lab': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'completed': return 'bg-green-600 hover:bg-green-700 text-white';
      case 'overdue': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'pending': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default: return 'bg-gray-900 hover:bg-gray-800 text-white';
    }
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Status Filters"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <div className="space-y-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={activeStatusFilter === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStatusFilterChange(filter.key)}
                  className={cn(
                    "w-full justify-start h-10 transition-all",
                    collapsed ? "px-2" : "px-3",
                    activeStatusFilter === filter.key 
                      ? getActiveColorClass(filter.key)
                      : filter.colorClass
                  )}
                >
                  <div className={cn(
                    "flex items-center",
                    collapsed ? "justify-center" : "justify-between w-full"
                  )}>
                    <span className={collapsed ? "sr-only" : ""}>
                      {filter.label}
                    </span>
                    {!collapsed && (
                      <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {filter.count}
                      </span>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}