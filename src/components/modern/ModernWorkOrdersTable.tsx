import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, MoreHorizontal, Edit, User, RefreshCw, ChevronLeft } from "lucide-react";
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

const ModernWorkOrdersTable = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockWorkOrders.length / itemsPerPage);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Work Orders</h2>
        <p className="text-sm text-gray-600 mt-1">
          Showing {mockWorkOrders.length} work orders
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 sticky top-0">
            <TableRow className="hover:bg-gray-50">
              <TableHead className="w-12"></TableHead>
              <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Customer</TableHead>
              <TableHead className="font-semibold text-gray-900">Due Date</TableHead>
              <TableHead className="font-semibold text-gray-900">Assigned To</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWorkOrders.map((order) => (
              <>
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => toggleRow(order.id)}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                    >
                      {expandedRows.has(order.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
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
                
                 {expandedRows.has(order.id) && (
                   <TableRow className="bg-gray-50 border-b border-gray-100">
                     <TableCell colSpan={7} className="p-6">
                       <div className="space-y-6">
                         {/* Priority and Key Info */}
                         <div className="flex items-center gap-6 pb-4 border-b border-gray-200">
                           <div className="flex items-center gap-2">
                             <span className="text-gray-600 font-medium">Priority:</span>
                             <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                               order.details.priority === "Critical" ? "bg-red-100 text-red-800" :
                               order.details.priority === "High" ? "bg-orange-100 text-orange-800" :
                               order.details.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                               "bg-gray-100 text-gray-800"
                             )}>{order.details.priority}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <span className="text-gray-600 font-medium">Items:</span>
                             <span className="font-medium">{order.details.items}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <span className="text-gray-600 font-medium">Submitted:</span>
                             <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                               order.details.submitted === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                             )}>{order.details.submitted}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <span className="text-gray-600 font-medium">Proof of Delivery:</span>
                             <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                               order.details.proofOfDelivery === "Complete" ? "bg-green-100 text-green-800" :
                               order.details.proofOfDelivery === "Pending" ? "bg-yellow-100 text-yellow-800" :
                               "bg-gray-100 text-gray-800"
                             )}>{order.details.proofOfDelivery}</span>
                           </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           {/* Customer Information */}
                           <div>
                             <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                             <div className="space-y-2 text-sm">
                               <div>
                                 <span className="text-gray-600">Cust ID:</span>
                                 <span className="ml-2 font-mono">{order.details.custId}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Cust S/N:</span>
                                 <span className="ml-2 font-mono">{order.details.custSn}</span>
                               </div>
                             </div>
                           </div>

                           {/* Order Details */}
                           <div>
                             <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                             <div className="space-y-2 text-sm">
                               <div>
                                 <span className="text-gray-600">Batch:</span>
                                 <span className="ml-2 font-mono">{order.details.batch}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Purchase:</span>
                                 <span className="ml-2 font-mono">{order.details.purchase}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">LOC/Lots:</span>
                                 <span className="ml-2 font-mono">{order.details.lots}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">PO Number:</span>
                                 <span className="ml-2 font-mono">{order.details.poNumber}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Cart ID:</span>
                                 <span className="ml-2 font-mono">{order.details.cartId}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Cart S/N:</span>
                                 <span className="ml-2 font-mono">{order.details.cartSn}</span>
                               </div>
                             </div>
                           </div>

                           {/* Equipment Information */}
                           <div>
                             <h4 className="font-medium text-gray-900 mb-3">Equipment Information</h4>
                             <div className="space-y-2 text-sm">
                               <div>
                                 <span className="text-gray-600">Manufacturer:</span>
                                 <span className="ml-2 font-medium">{order.details.manufacturer}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Model #:</span>
                                 <span className="ml-2 font-mono">{order.details.modelNumber}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Serial #:</span>
                                 <span className="ml-2 font-mono">{order.details.serialNumber}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Lab Code:</span>
                                 <span className="ml-2 font-mono">{order.details.labCode}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Item Type:</span>
                                 <span className="ml-2">{order.details.itemType}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Operation:</span>
                                 <span className="ml-2">{order.details.operationType}</span>
                               </div>
                             </div>
                           </div>

                           {/* Timeline Information */}
                           <div>
                             <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                             <div className="space-y-2 text-sm">
                               <div>
                                 <span className="text-gray-600">Created:</span>
                                 <span className="ml-2">{order.details.createdDate}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Status Date:</span>
                                 <span className="ml-2">{order.details.statusDate}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Last Modified:</span>
                                 <span className="ml-2">{order.details.lastModified}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Next By:</span>
                                 <span className={cn("ml-2 font-medium",
                                   order.details.nextBy === "TBD" ? "text-orange-600" : "text-gray-900"
                                 )}>{order.details.nextBy}</span>
                               </div>
                               <div>
                                 <span className="text-gray-600">Departure:</span>
                                 <span className={cn("ml-2 font-medium",
                                   order.details.departureDate === "TBD" ? "text-orange-600" : "text-gray-900"
                                 )}>{order.details.departureDate}</span>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Comments Section */}
                         <div className="border-t border-gray-200 pt-4">
                           <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
                           <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">{order.details.comments}</p>
                         </div>
                       </div>
                     </TableCell>
                   </TableRow>
                 )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

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