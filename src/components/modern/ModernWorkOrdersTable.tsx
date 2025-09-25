import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { List, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BatchWorkOrder {
  workOrderNumber: string;
  customer: string;
  division: string;
  assignedTo: string;
  createdDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  itemCount: number;
  items: WorkOrderItem[];
}

interface WorkOrder {
  id: string;
  status: "In Lab" | "Completed" | "Overdue" | "Pending" | "[Open Items]" | "[Awaiting CDR]" | "[Assign/Tech - Repair - InLab]" | "[Assigned To Tech - Repair Dept]" | "[Q/A Hold - Q/A Disapproved]" | "[Q/A Insp - Q/A Hold - Q/A Fail]" | "[In Lab - Assigned to Tech]" | "[In Lab - Q/A Disapprove]" | "[Estimate - A/R Invoicing]" | "[To Factory - Awaiting Parts]" | "[AR Need By Status]" | "Assigned to Tech" | "In Transit" | "Lab Management" | "Repair Department" | "Rotation" | "Estimate" | "Awaiting Parts" | "Awaiting PR Approval" | "In Metrology" | "To Factory" | "To Factory - Repair by Replacement" | "To Factory - Warranty" | "Lab Hold" | "Q/A Inspection" | "Q/A Inspection - Fail Correction" | "Q/A Hold" | "Q/A Disapproved" | "Q/A Fail Log" | "A/R Invoicing" | "A/R Invoicing/Hold" | "Admin Processing" | "Back to Customer" | "Calibrated on Shelf" | "Cancelled" | "Item Not Found on Site" | "ME Review" | "Not Used" | "Onsite" | "Ready for Departure" | "Return to Lab for Processing" | "Scheduled" | "Surplus Stock" | "Waiting on Customer" | "Calibration Required" | "Quality Review" | "Waiting Parts" | "Ready to Ship" | "Customer Hold" | "In Progress" | "Final Testing" | "Expedited" | "Needs Approval" | "Incoming" | "Parts Ordered" | "Quote Requested" | "Rework Required" | "Documentation Review" | "Shipping Prep";
  customer: string;
  dueDate: string;
  assignedTo: string;
  location: string;
  equipmentType: string;
  estimatedCost: string;
  actualCost: string;
  contactPerson: string;
  phone: string;
  email: string;
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  completionPercentage: number;
  division: string;
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
    job: string;
    action: string;
    workDescription: string;
    partsNeeded: string[];
    laborHours: string;
    invoiceNumber: string;
    paymentStatus: string;
    warrantyInfo: string;
    certificationRequired: string;
    healthSafetyNotes: string;
    customerAddress: string;
    serviceType: string;
    technicalNotes: string;
    qualityAssurance: string;
    template: string;
    originalLoc: string;
    destLoc: string;
    ts: string;
    hotlist: string;
    jmPoNumber: string;
  };
}

// Mock data for work order items (for item view)
interface WorkOrderItem {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  reportNumber: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  created: string;
  departure: string;
  itemStatus: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  customer: string;
  assignedTo: string;
  division: string;
  itemType: string;
}

const mockWorkOrderItems: WorkOrderItem[] = [
  {
    id: "1",
    workOrderId: "385737",
    workOrderNumber: "385737",
    reportNumber: "RPT-001",
    manufacturer: "ADEULIS",
    model: "PPS-1734",
    serialNumber: "SN123456",
    created: "10/15/2024",
    departure: "11/25/2024",
    itemStatus: "[Awaiting CDR]",
    priority: "High",
    customer: "ACME Industries",
    assignedTo: "John Smith",
    division: "Lab",
    itemType: "Pressure Sensor"
  },
  {
    id: "2",
    workOrderId: "390589",
    workOrderNumber: "390589",
    reportNumber: "RPT-002",
    manufacturer: "STARRETT",
    model: "844-441",
    serialNumber: "SN789012",
    created: "10/12/2024",
    departure: "11/21/2024",
    itemStatus: "Completed",
    priority: "Medium",
    customer: "Tech Solutions Ltd",
    assignedTo: "Sarah Johnson",
    division: "Rental",
    itemType: "Precision Micrometer"
  },
  {
    id: "3",
    workOrderId: "400217",
    workOrderNumber: "400217",
    reportNumber: "RPT-003",
    manufacturer: "CHARLS LTD",
    model: "1000PS",
    serialNumber: "SN345678",
    created: "10/08/2024",
    departure: "TBD",
    itemStatus: "Awaiting Parts",
    priority: "Critical",
    customer: "Manufacturing Corp",
    assignedTo: "Mike Davis",
    division: "ESL Onsite",
    itemType: "Hydraulic Press System"
  }
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: "385737",
    status: "[Awaiting CDR]",
    customer: "ACME Industries",
    dueDate: "Nov 24, 2024",
    assignedTo: "John Smith",
    location: "Lab Building A - Room 203",
    equipmentType: "Pressure Sensor",
    estimatedCost: "$1,250.00",
    actualCost: "$1,180.00",
    contactPerson: "Robert Chen",
    phone: "(555) 123-4567",
    email: "r.chen@acmeindustries.com",
    urgencyLevel: "High",
    completionPercentage: 75,
    division: "Lab",
    details: {
      modelNumber: "PPS-1734",
      labCode: "LAB-001",
      comments: "Calibration required for pressure sensor",
      manufacturer: "ADEULIS",
      serialNumber: "SN123456",
      batch: "B2024-001",
      items: "5",
      purchase: "PO-2024-001",
      lots: "AL",
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
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "11/25/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Full calibration and accuracy verification of pressure sensor",
      partsNeeded: ["Calibration Kit", "O-Rings", "Connector Cable"],
      laborHours: "12.5",
      invoiceNumber: "INV-2024-0125",
      paymentStatus: "Pending",
      warrantyInfo: "90-day calibration warranty",
      certificationRequired: "ISO 17025 Certificate",
      healthSafetyNotes: "Handle with care - pressurized equipment",
      customerAddress: "1234 Industrial Blvd, Manufacturing City, MC 12345",
      serviceType: "Calibration & Certification",
      technicalNotes: "Updated firmware to v2.4.1, replaced faulty pressure membrane",
      qualityAssurance: "Passed all QC checks - awaiting final certification",
      template: "External Datasheet (pdf)",
      originalLoc: "AL",
      destLoc: "AL",
      ts: "J",
      hotlist: "",
      jmPoNumber: "5980"
    }
  }
];

interface ModernWorkOrdersTableProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  searchFilters: {
    globalSearch?: string;
    status?: string;
    priority?: string;
    manufacturer?: string;
    division?: string;
  };
}

const ModernWorkOrdersTable = ({ viewMode, onViewModeChange, searchFilters }: ModernWorkOrdersTableProps) => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState<'item' | 'template' | 'batch'>('item');
  const [selectedBatch, setSelectedBatch] = useState<BatchWorkOrder | null>(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  
  // Create batch work orders by grouping items by work order number
  const mockBatchWorkOrders: BatchWorkOrder[] = Array.from(
    mockWorkOrderItems.reduce((acc, item) => {
      const existingBatch = acc.get(item.workOrderNumber);
      if (existingBatch) {
        existingBatch.items.push(item);
        existingBatch.itemCount = existingBatch.items.length;
      } else {
        acc.set(item.workOrderNumber, {
          workOrderNumber: item.workOrderNumber,
          customer: item.customer,
          division: item.division,
          assignedTo: item.assignedTo,
          createdDate: item.created,
          priority: item.priority,
          itemCount: 1,
          items: [item]
        });
      }
      return acc;
    }, new Map<string, BatchWorkOrder>()).values()
  );

  // Helper functions for badges
  const getStatusBadge = (status: string) => {
    const variant = getStatusBadgeVariant(status);
    return <Badge variant={variant}>{status}</Badge>;
  };

  const getStatusBadgeVariant = (status: string): "secondary" | "default" | "destructive" | "outline" => {
    switch (status) {
      case "Completed":
        return "default";
      case "Overdue":
        return "destructive";
      case "Pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getItemStatusBadge = (status: string) => {
    const variant = getItemStatusBadgeVariant(status);
    return <Badge variant={variant}>{status}</Badge>;
  };

  const getItemStatusBadgeVariant = (status: string): "secondary" | "default" | "destructive" | "outline" => {
    switch (status) {
      case "Completed":
        return "default";
      case "Overdue":
        return "destructive";
      case "Pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Filter work orders based on search filters
  const filteredWorkOrders = mockWorkOrders.filter(order => {
    const searchMatch = !searchFilters.globalSearch || 
      order.id.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(searchFilters.globalSearch.toLowerCase());
    
    return searchMatch;
  });

  // Filter work order items
  const filteredWorkOrderItems = mockWorkOrderItems.filter(item => {
    const searchMatch = !searchFilters.globalSearch || 
      item.workOrderNumber.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchFilters.globalSearch.toLowerCase());
    
    return searchMatch;
  });

  // Filter batch work orders
  const filteredBatchWorkOrders = mockBatchWorkOrders.filter(batch => {
    const searchMatch = !searchFilters.globalSearch || 
      batch.workOrderNumber.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      batch.customer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      batch.assignedTo.toLowerCase().includes(searchFilters.globalSearch.toLowerCase());
    
    return searchMatch;
  });
  
  const totalPages = currentView === 'template'
    ? Math.ceil(filteredWorkOrders.length / itemsPerPage)
    : currentView === 'batch'
    ? Math.ceil(filteredBatchWorkOrders.length / itemsPerPage)
    : Math.ceil(filteredWorkOrderItems.length / itemsPerPage);

  // Get paginated data
  const paginatedWorkOrders = currentView === 'template'
    ? filteredWorkOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];
    
  const paginatedWorkOrderItems = currentView === 'item'
    ? filteredWorkOrderItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const paginatedBatchWorkOrders = currentView === 'batch'
    ? filteredBatchWorkOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const openDetails = (order: WorkOrder) => {
    setSelectedWorkOrder(order);
  };

  const openDetailsFromItem = (item: WorkOrderItem) => {
    const workOrder = mockWorkOrders.find(wo => wo.id === item.workOrderNumber);
    if (workOrder) {
      setSelectedWorkOrder(workOrder);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Work Orders</h2>
            <p className="text-sm text-gray-600 mt-1">
              {currentView === 'template' ? (
                <>Showing {filteredWorkOrders.length} of {mockWorkOrders.length} work orders</>
              ) : currentView === 'batch' ? (
                <>Showing {filteredBatchWorkOrders.length} of {mockBatchWorkOrders.length} batches</>
              ) : (
                <>Showing {filteredWorkOrderItems.length} of {mockWorkOrderItems.length} items</>
              )}
            </p>
          </div>
          
          {/* View Toggle Buttons */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={currentView === 'item' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('item')}
                className={cn(
                  "h-8 px-3 rounded-md transition-all",
                  currentView === 'item'
                    ? "bg-white shadow-sm text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                )}
              >
                Item View
              </Button>
              <Button
                variant={currentView === 'template' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('template')}
                className={cn(
                  "h-8 px-3 rounded-md transition-all",
                  currentView === 'template'
                    ? "bg-white shadow-sm text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                )}
              >
                Template
              </Button>
              <Button
                variant={currentView === 'batch' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('batch')}
                className={cn(
                  "h-8 px-3 rounded-md transition-all",
                  currentView === 'batch'
                    ? "bg-white shadow-sm text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                )}
              >
                Batch View
              </Button>
            </div>

            {/* List/Grid Toggle */}
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
                <List className="h-4 w-4" />
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
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden">
        {viewMode === 'list' ? (
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow className="hover:bg-gray-50">
                {currentView === 'template' ? (
                  <>
                    <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  </>
                ) : currentView === 'batch' ? (
                  <>
                    <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Division</TableHead>
                    <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                    <TableHead className="font-semibold text-gray-900">Items Count</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Report #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Item Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentView === 'template' ? (
                paginatedWorkOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDetails(order)}>
                    <TableCell className="font-medium text-blue-600">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))
              ) : currentView === 'batch' ? (
                paginatedBatchWorkOrders.map((batch) => (
                  <TableRow key={batch.workOrderNumber} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedBatch(batch)}>
                    <TableCell className="font-medium text-blue-600">{batch.workOrderNumber}</TableCell>
                    <TableCell>{batch.customer}</TableCell>
                    <TableCell>{batch.division}</TableCell>
                    <TableCell>
                      <Badge variant={batch.priority === "Critical" ? "destructive" : "secondary"}>{batch.priority}</Badge>
                    </TableCell>
                    <TableCell>{batch.itemCount}</TableCell>
                  </TableRow>
                ))
              ) : (
                paginatedWorkOrderItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDetailsFromItem(item)}>
                    <TableCell className="font-medium text-blue-600">{item.workOrderNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{item.reportNumber}</TableCell>
                    <TableCell>{getItemStatusBadge(item.itemStatus)}</TableCell>
                    <TableCell>
                      <Badge variant={item.priority === "Critical" ? "destructive" : "secondary"}>{item.priority}</Badge>
                    </TableCell>
                    <TableCell>{item.customer}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentView === 'batch' ? (
              paginatedBatchWorkOrders.map((batch) => (
                <div key={batch.workOrderNumber} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => setSelectedBatch(batch)}>
                  <div className="p-4">
                    <h3 className="font-bold text-blue-600 text-lg">{batch.workOrderNumber}</h3>
                    <p className="text-sm text-gray-600">{batch.customer}</p>
                    <p className="text-xs text-gray-500">{batch.itemCount} items</p>
                  </div>
                </div>
              ))
            ) : currentView === 'item' ? (
              paginatedWorkOrderItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => openDetailsFromItem(item)}>
                  <div className="p-4">
                    <h3 className="font-bold text-blue-600 text-lg">{item.workOrderNumber}</h3>
                    <p className="text-sm text-gray-600">{item.customer}</p>
                    <p className="text-xs text-gray-500">{item.reportNumber}</p>
                  </div>
                </div>
              ))
            ) : (
              paginatedWorkOrders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => openDetails(order)}>
                  <div className="p-4">
                    <h3 className="font-bold text-blue-600 text-lg">{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Pagination */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, 
              currentView === 'template' ? filteredWorkOrders.length : 
              currentView === 'batch' ? filteredBatchWorkOrders.length : 
              filteredWorkOrderItems.length)} of {
              currentView === 'template' ? filteredWorkOrders.length : 
              currentView === 'batch' ? filteredBatchWorkOrders.length : 
              filteredWorkOrderItems.length} items
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Work Order Details Dialog */}
      <Dialog open={selectedWorkOrder !== null} onOpenChange={() => setSelectedWorkOrder(null)}>
        {selectedWorkOrder && (
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Work Order Details - {selectedWorkOrder.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Customer:</strong> {selectedWorkOrder.customer}</div>
                <div><strong>Status:</strong> {getStatusBadge(selectedWorkOrder.status)}</div>
                <div><strong>Due Date:</strong> {selectedWorkOrder.dueDate}</div>
                <div><strong>Assigned To:</strong> {selectedWorkOrder.assignedTo}</div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Batch Details Dialog */}
      <Dialog open={selectedBatch !== null} onOpenChange={() => setSelectedBatch(null)}>
        {selectedBatch && (
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Batch Details - Work Order {selectedBatch.workOrderNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div><strong>Customer:</strong> {selectedBatch.customer}</div>
                <div><strong>Division:</strong> {selectedBatch.division}</div>
                <div><strong>Priority:</strong> {selectedBatch.priority}</div>
                <div><strong>Assigned To:</strong> {selectedBatch.assignedTo}</div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report #</TableHead>
                    <TableHead>Item Status</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Item Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBatch.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.reportNumber}</TableCell>
                      <TableCell>{getItemStatusBadge(item.itemStatus)}</TableCell>
                      <TableCell>{item.manufacturer}</TableCell>
                      <TableCell className="font-mono text-sm">{item.model}</TableCell>
                      <TableCell className="font-mono text-sm">{item.serialNumber}</TableCell>
                      <TableCell>{item.itemType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ModernWorkOrdersTable;