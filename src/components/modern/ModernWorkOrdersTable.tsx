import { useState } from "react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, MoreHorizontal, Edit, User, RefreshCw, ChevronLeft, List, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkOrder {
  id: string;
  status: "In Lab" | "Completed" | "Overdue" | "Pending";
  customer: string;
  dueDate: string;
  assignedTo: string;
  details: {
    modelNumber: string;
    labCode: string;
    comments: string;
    manufacturer: string;
    serialNumber: string;
    batch: string;
    items: string;
    purchase: string;
    lots: string;
    createdDate: string;
    statusDate: string;
    lastModified: string;
    nextBy: string;
    priority: string;
    custId: string;
    custSn: string;
    cartId: string;
    cartSn: string;
    poNumber: string;
    itemType: string;
    operationType: string;
    departureDate: string;
    submitted: string;
    proofOfDelivery: string;
  };
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    status: "In Lab",
    customer: "ACME Industries",
    dueDate: "Nov 24, 2024",
    assignedTo: "John Smith",
    details: {
      modelNumber: "PPS-1734",
      labCode: "LAB-001",
      comments: "Calibration required for pressure sensor",
      manufacturer: "ADEULIS",
      serialNumber: "SN123456",
      batch: "B2024-001",
      items: "5",
      purchase: "PO-2024-001",
      lots: "LOT-A123",
      createdDate: "10/15/2024",
      statusDate: "11/20/2024",
      lastModified: "11/22/2024",
      nextBy: "11/25/2024",
      priority: "High",
      custId: "CUST-001",
      custSn: "ACME-SN-001",
      cartId: "CART-001",
      cartSn: "CSN-001",
      poNumber: "PO-2024-001",
      itemType: "Sensor",
      operationType: "Calibration",
      departureDate: "11/25/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending"
    }
  },
  {
    id: "WO-002",
    status: "Completed",
    customer: "Tech Solutions Ltd",
    dueDate: "Nov 20, 2024",
    assignedTo: "Sarah Johnson",
    details: {
      modelNumber: "844-441",
      labCode: "LAB-002",
      comments: "Micrometer repair completed successfully",
      manufacturer: "STARRETT",
      serialNumber: "SN789012",
      batch: "B2024-002",
      items: "3",
      purchase: "PO-2024-002",
      lots: "LOT-B456",
      createdDate: "10/12/2024",
      statusDate: "11/18/2024",
      lastModified: "11/20/2024",
      nextBy: "11/21/2024",
      priority: "Medium",
      custId: "CUST-002",
      custSn: "TECH-SN-002",
      cartId: "CART-002",
      cartSn: "CSN-002",
      poNumber: "PO-2024-002",
      itemType: "Micrometer",
      operationType: "Repair",
      departureDate: "11/21/2024",
      submitted: "Yes",
      proofOfDelivery: "Complete"
    }
  },
  {
    id: "WO-003",
    status: "Overdue",
    customer: "Manufacturing Corp",
    dueDate: "Nov 18, 2024",
    assignedTo: "Mike Davis",
    details: {
      modelNumber: "1000PS",
      labCode: "LAB-003",
      comments: "Awaiting replacement parts",
      manufacturer: "CHARLS LTD",
      serialNumber: "SN345678",
      batch: "B2024-003",
      items: "1",
      purchase: "PO-2024-003",
      lots: "LOT-C789",
      createdDate: "10/08/2024",
      statusDate: "11/15/2024",
      lastModified: "11/18/2024",
      nextBy: "TBD",
      priority: "Critical",
      custId: "CUST-003",
      custSn: "MFG-SN-003",
      cartId: "CART-003",
      cartSn: "CSN-003",
      poNumber: "PO-2024-003",
      itemType: "Pressure System",
      operationType: "Service",
      departureDate: "TBD",
      submitted: "No",
      proofOfDelivery: "N/A"
    }
  },
  {
    id: "WO-004",
    status: "Pending",
    customer: "Quality Systems Inc",
    dueDate: "Dec 01, 2024",
    assignedTo: "Emily Wilson",
    details: {
      modelNumber: "CAL-500",
      labCode: "LAB-004",
      comments: "Initial inspection scheduled",
      manufacturer: "PRECISION TOOLS",
      serialNumber: "SN901234",
      batch: "B2024-004",
      items: "2",
      purchase: "PO-2024-004",
      lots: "LOT-D012",
      createdDate: "11/01/2024",
      statusDate: "11/22/2024",
      lastModified: "11/22/2024",
      nextBy: "12/02/2024",
      priority: "Low",
      custId: "CUST-004",
      custSn: "QS-SN-004",
      cartId: "CART-004",
      cartSn: "CSN-004",
      poNumber: "PO-2024-004",
      itemType: "Calibrator",
      operationType: "Inspection",
      departureDate: "12/02/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending"
    }
  }
];

const getStatusBadge = (status: WorkOrder["status"]) => {
  const variants = {
    "In Lab": "bg-blue-100 text-blue-800 border-blue-200",
    "Completed": "bg-green-100 text-green-800 border-green-200",
    "Overdue": "bg-red-100 text-red-800 border-red-200",
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200"
  };
  
  return (
    <Badge className={cn("text-xs font-medium border", variants[status])}>
      {status}
    </Badge>
  );
};

interface ModernWorkOrdersTableProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

const ModernWorkOrdersTable = ({ viewMode, onViewModeChange }: ModernWorkOrdersTableProps) => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const itemsPerPage = 10;
  
  // Filter work orders based on selected status
  const filteredWorkOrders = activeStatusFilter === 'all' 
    ? mockWorkOrders 
    : mockWorkOrders.filter(order => order.status.toLowerCase().replace(' ', '-') === activeStatusFilter);
  
  const totalPages = Math.ceil(filteredWorkOrders.length / itemsPerPage);

  const openDetails = (order: WorkOrder) => {
    setSelectedWorkOrder(order);
  };

  // Work Order Details Dialog Component
  const WorkOrderDetailsDialog = ({ order }: { order: WorkOrder }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-xl">
          <span className="font-bold text-blue-600">{order.id}</span>
          {getStatusBadge(order.status)}
          <span className={cn("px-3 py-1 rounded-md text-sm font-medium",
            order.details.priority === "Critical" ? "bg-red-100 text-red-800" :
            order.details.priority === "High" ? "bg-orange-100 text-orange-800" :
            order.details.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          )}>{order.details.priority} Priority</span>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Customer & Basic Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Customer:</span>
              <div className="font-semibold text-gray-900">{order.customer}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Assigned To:</span>
              <div className="font-semibold text-gray-900">{order.assignedTo}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Due Date:</span>
              <div className="font-semibold text-gray-900">{order.dueDate}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Items:</span>
              <div className="font-semibold text-gray-900">{order.details.items}</div>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">Status Information</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Submitted:</span>
              <div className={cn("mt-1 inline-block px-2 py-1 rounded-md text-xs font-medium",
                order.details.submitted === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}>{order.details.submitted}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Delivery Status:</span>
              <div className={cn("mt-1 inline-block px-2 py-1 rounded-md text-xs font-medium",
                order.details.proofOfDelivery === "Complete" ? "bg-green-100 text-green-800" :
                order.details.proofOfDelivery === "Pending" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              )}>{order.details.proofOfDelivery}</div>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Lab Code:</span>
              <div className="font-mono text-gray-900">{order.details.labCode}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Order Details */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">Customer & Order Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Customer ID:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.custId}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Customer S/N:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.custSn}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">PO Number:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.poNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Batch:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.batch}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Purchase:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.purchase}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">LOC/Lots:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.lots}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">Cart Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Cart ID:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.cartId}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Cart S/N:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.cartSn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment & Timeline */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">Equipment Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Manufacturer:</span>
                  <span className="ml-2 font-semibold text-gray-900">{order.details.manufacturer}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Model:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.modelNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Serial #:</span>
                  <span className="ml-2 font-mono text-gray-900">{order.details.serialNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Item Type:</span>
                  <span className="ml-2 text-gray-900">{order.details.itemType}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Operation:</span>
                  <span className="ml-2 text-gray-900">{order.details.operationType}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">Project Timeline</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Created:</span>
                  <span className="ml-2 text-gray-900">{order.details.createdDate}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Status Date:</span>
                  <span className="ml-2 text-gray-900">{order.details.statusDate}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Last Modified:</span>
                  <span className="ml-2 text-gray-900">{order.details.lastModified}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Next By:</span>
                  <span className={cn("ml-2 font-semibold",
                    order.details.nextBy === "TBD" ? "text-red-600" : "text-gray-900"
                  )}>{order.details.nextBy}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Departure:</span>
                  <span className={cn("ml-2 font-semibold",
                    order.details.departureDate === "TBD" ? "text-red-600" : "text-gray-900"
                  )}>{order.details.departureDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-2">Comments & Notes</h4>
          <div className="text-sm text-gray-700 bg-white p-4 rounded-md border border-gray-200 leading-relaxed">
            {order.details.comments}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
          <Button variant="outline">
            <User className="h-4 w-4 mr-2" />
            Assign Tech
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Update Status
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Work Orders</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredWorkOrders.length} of {mockWorkOrders.length} work orders
            </p>
          </div>
          
          {/* View Toggle Buttons */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={cn(
                "h-8 px-3 rounded-md transition-all",
                viewMode === 'list' 
                  ? "bg-white shadow-sm text-gray-900" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "h-8 px-3 rounded-md transition-all",
                viewMode === 'grid' 
                  ? "bg-white shadow-sm text-gray-900" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>

        {/* Quick Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 mr-2">Quick Filters:</span>
          <Button
            variant={activeStatusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatusFilter('all')}
            className={cn(
              "h-8 px-3 rounded-full transition-all",
              activeStatusFilter === 'all' 
                ? "bg-gray-900 hover:bg-gray-800 text-white" 
                : "border-gray-300 hover:bg-gray-50"
            )}
          >
            All ({mockWorkOrders.length})
          </Button>
          <Button
            variant={activeStatusFilter === 'in-lab' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatusFilter('in-lab')}
            className={cn(
              "h-8 px-3 rounded-full transition-all",
              activeStatusFilter === 'in-lab' 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "border-blue-300 text-blue-700 hover:bg-blue-50"
            )}
          >
            In Lab ({mockWorkOrders.filter(o => o.status === 'In Lab').length})
          </Button>
          <Button
            variant={activeStatusFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatusFilter('completed')}
            className={cn(
              "h-8 px-3 rounded-full transition-all",
              activeStatusFilter === 'completed' 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "border-green-300 text-green-700 hover:bg-green-50"
            )}
          >
            Completed ({mockWorkOrders.filter(o => o.status === 'Completed').length})
          </Button>
          <Button
            variant={activeStatusFilter === 'overdue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatusFilter('overdue')}
            className={cn(
              "h-8 px-3 rounded-full transition-all",
              activeStatusFilter === 'overdue' 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "border-red-300 text-red-700 hover:bg-red-50"
            )}
          >
            Overdue ({mockWorkOrders.filter(o => o.status === 'Overdue').length})
          </Button>
          <Button
            variant={activeStatusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveStatusFilter('pending')}
            className={cn(
              "h-8 px-3 rounded-full transition-all",
              activeStatusFilter === 'pending' 
                ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            )}
          >
            Pending ({mockWorkOrders.filter(o => o.status === 'Pending').length})
          </Button>
        </div>
      </div>

      {/* Content - List or Grid View */}
      <div className="overflow-hidden">
        {viewMode === 'list' ? (
          // List View - Table
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow className="hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                <TableHead className="font-semibold text-gray-900">Due Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Assigned To</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => openDetails(order)}
                >
                  <TableCell className="font-medium text-blue-600">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                      order.details.priority === "Critical" ? "bg-red-100 text-red-800" :
                      order.details.priority === "High" ? "bg-orange-100 text-orange-800" :
                      order.details.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    )}>{order.details.priority}</span>
                  </TableCell>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell>{order.dueDate}</TableCell>
                  <TableCell>{order.assignedTo}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 data-[state=open]:bg-blue-100 data-[state=open]:text-blue-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50 rounded-lg">
                         <DropdownMenuItem className="flex items-center gap-2">
                           <Edit className="h-4 w-4" />
                           Edit
                         </DropdownMenuItem>
                         <DropdownMenuItem className="flex items-center gap-2">
                           <User className="h-4 w-4" />
                           Assign Tech
                         </DropdownMenuItem>
                         <DropdownMenuItem className="flex items-center gap-2">
                           <RefreshCw className="h-4 w-4" />
                           Update Status
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          // Grid View - Cards
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWorkOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => openDetails(order)}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-600 text-lg">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50 rounded-lg">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Assign Tech
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">{order.customer}</h3>
                    <p className="text-sm text-gray-600">Assigned to: {order.assignedTo}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <span className="ml-2 font-medium text-gray-900">{order.dueDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <div className="font-mono text-xs">{order.details.modelNumber}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Manufacturer:</span>
                      <div className="font-medium text-xs">{order.details.manufacturer}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">Priority:</span>
                      <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                        order.details.priority === "Critical" ? "bg-red-100 text-red-800" :
                        order.details.priority === "High" ? "bg-orange-100 text-orange-800" :
                        order.details.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      )}>{order.details.priority}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Work Order Details Dialog */}
      <Dialog open={selectedWorkOrder !== null} onOpenChange={() => setSelectedWorkOrder(null)}>
        {selectedWorkOrder && <WorkOrderDetailsDialog order={selectedWorkOrder} />}
      </Dialog>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, mockWorkOrders.length)} of {mockWorkOrders.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg",
                    currentPage === page && "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernWorkOrdersTable;