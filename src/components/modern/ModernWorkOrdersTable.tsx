import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
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
  location: string;
  equipmentType: string;
  estimatedCost: string;
  actualCost: string;
  contactPerson: string;
  phone: string;
  email: string;
  urgencyLevel: "Low" | "Medium" | "High" | "Critical";
  completionPercentage: number;
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
  };
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    status: "In Lab",
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
      proofOfDelivery: "Pending",
      workDescription: "Full calibration and accuracy verification of pressure sensor including temperature compensation and linearity testing",
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
      qualityAssurance: "Passed all QC checks - awaiting final certification"
    }
  },
  {
    id: "WO-002",
    status: "Completed",
    customer: "Tech Solutions Ltd",
    dueDate: "Nov 20, 2024",
    assignedTo: "Sarah Johnson",
    location: "Lab Building B - Room 105",
    equipmentType: "Precision Micrometer",
    estimatedCost: "$850.00",
    actualCost: "$825.00",
    contactPerson: "Lisa Martinez",
    phone: "(555) 987-6543",
    email: "l.martinez@techsolutions.com",
    urgencyLevel: "Medium",
    completionPercentage: 100,
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
      proofOfDelivery: "Complete",
      workDescription: "Complete rebuild of micrometer mechanism including spindle replacement and accuracy verification",
      partsNeeded: ["Spindle Assembly", "Graduation Ring", "Locking Mechanism"],
      laborHours: "8.0",
      invoiceNumber: "INV-2024-0089",
      paymentStatus: "Paid",
      warrantyInfo: "1-year repair warranty",
      certificationRequired: "NIST Traceable Certificate",
      healthSafetyNotes: "Standard safety precautions",
      customerAddress: "5678 Technology Ave, Tech Park, TP 54321",
      serviceType: "Repair & Calibration",
      technicalNotes: "Replaced worn spindle threads, adjusted contact pressure",
      qualityAssurance: "All measurements within ±0.0001\" tolerance"
    }
  },
  {
    id: "WO-003",
    status: "Overdue",
    customer: "Manufacturing Corp",
    dueDate: "Nov 18, 2024",
    assignedTo: "Mike Davis",
    location: "Lab Building C - Room 301",
    equipmentType: "Hydraulic Press System",
    estimatedCost: "$3,200.00",
    actualCost: "TBD",
    contactPerson: "David Wilson",
    phone: "(555) 456-7890",
    email: "d.wilson@manufacturingcorp.com",
    urgencyLevel: "Critical",
    completionPercentage: 35,
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
      proofOfDelivery: "N/A",
      workDescription: "Major overhaul of hydraulic press system including pump replacement and safety system upgrade",
      partsNeeded: ["Hydraulic Pump", "Pressure Relief Valve", "Safety Interlock System", "Hydraulic Seals Kit"],
      laborHours: "35.0",
      invoiceNumber: "TBD",
      paymentStatus: "On Hold",
      warrantyInfo: "2-year parts & labor warranty",
      certificationRequired: "ASME Pressure Vessel Certification",
      healthSafetyNotes: "CRITICAL: High pressure system - follow lockout/tagout procedures",
      customerAddress: "9012 Manufacturing Dr, Industrial Zone, IZ 67890",
      serviceType: "Major Repair & Recertification",
      technicalNotes: "Waiting for custom pump assembly from manufacturer - ETA 2 weeks",
      qualityAssurance: "Pending parts arrival and installation"
    }
  },
  {
    id: "WO-004",
    status: "Pending",
    customer: "Quality Systems Inc",
    dueDate: "Dec 01, 2024",
    assignedTo: "Emily Wilson",
    location: "Lab Building A - Room 150",
    equipmentType: "Digital Calibrator",
    estimatedCost: "$650.00",
    actualCost: "TBD",
    contactPerson: "Jennifer Taylor",
    phone: "(555) 234-5678",
    email: "j.taylor@qualitysystems.com",
    urgencyLevel: "Low",
    completionPercentage: 15,
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
      proofOfDelivery: "Pending",
      workDescription: "Annual calibration verification and software update for digital multifunction calibrator",
      partsNeeded: ["Test Leads", "Software License"],
      laborHours: "6.0",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Approved",
      warrantyInfo: "1-year calibration certificate",
      certificationRequired: "ISO 17025 Multi-point Calibration",
      healthSafetyNotes: "Standard electrical safety precautions",
      customerAddress: "3456 Quality Blvd, Precision City, PC 98765",
      serviceType: "Annual Calibration",
      technicalNotes: "Initial diagnostics show all functions within spec",
      qualityAssurance: "Scheduled for full calibration next week"
    }
  },
  {
    id: "WO-005",
    status: "In Lab",
    customer: "Aerospace Dynamics",
    dueDate: "Dec 05, 2024",
    assignedTo: "Tom Rodriguez",
    location: "Lab Building D - Room 402",
    equipmentType: "Torque Wrench Set",
    estimatedCost: "$1,450.00",
    actualCost: "TBD",
    contactPerson: "Michael Chang",
    phone: "(555) 345-6789",
    email: "m.chang@aerospacedynamics.com",
    urgencyLevel: "High",
    completionPercentage: 60,
    details: {
      modelNumber: "TW-PRO-500",
      labCode: "LAB-005",
      comments: "Precision torque calibration for aerospace applications",
      manufacturer: "SNAP-ON",
      serialNumber: "SN567890",
      batch: "B2024-005",
      items: "8",
      purchase: "PO-2024-005",
      lots: "LOT-E345",
      createdDate: "11/10/2024",
      statusDate: "11/23/2024",
      lastModified: "11/25/2024",
      nextBy: "12/06/2024",
      priority: "High",
      custId: "CUST-005",
      custSn: "AERO-SN-005",
      cartId: "CART-005",
      cartSn: "CSN-005",
      poNumber: "PO-2024-005",
      itemType: "Torque Tools",
      operationType: "Precision Calibration",
      departureDate: "12/06/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      workDescription: "High-precision calibration of torque wrenches for critical aerospace fastener applications",
      partsNeeded: ["Calibration Weights", "Adapter Kit", "Certification Labels"],
      laborHours: "14.0",
      invoiceNumber: "INV-2024-0156",
      paymentStatus: "Pending",
      warrantyInfo: "6-month precision calibration warranty",
      certificationRequired: "AS9100 Compliant Certificate",
      healthSafetyNotes: "Handle calibration weights with care - heavy lifting required",
      customerAddress: "7890 Aerospace Way, Flight Center, FC 13579",
      serviceType: "Precision Calibration & Certification",
      technicalNotes: "All 8 wrenches require full range calibration per AS9100 standards",
      qualityAssurance: "5 of 8 units completed - within ±2% tolerance requirement"
    }
  },
  {
    id: "WO-006",
    status: "Completed",
    customer: "Pharmaceutical Labs Inc",
    dueDate: "Nov 15, 2024",
    assignedTo: "Dr. Amanda Foster",
    location: "Clean Room Lab - Room 501",
    equipmentType: "Analytical Balance",
    estimatedCost: "$950.00",
    actualCost: "$920.00",
    contactPerson: "Sarah Kim",
    phone: "(555) 678-9012",
    email: "s.kim@pharmabs.com",
    urgencyLevel: "Medium",
    completionPercentage: 100,
    details: {
      modelNumber: "AB-220",
      labCode: "LAB-006",
      comments: "FDA compliant calibration completed",
      manufacturer: "METTLER TOLEDO",
      serialNumber: "SN234567",
      batch: "B2024-006",
      items: "1",
      purchase: "PO-2024-006",
      lots: "LOT-F678",
      createdDate: "10/28/2024",
      statusDate: "11/13/2024",
      lastModified: "11/15/2024",
      nextBy: "11/16/2024",
      priority: "Medium",
      custId: "CUST-006",
      custSn: "PHARM-SN-006",
      cartId: "CART-006",
      cartSn: "CSN-006",
      poNumber: "PO-2024-006",
      itemType: "Analytical Balance",
      operationType: "FDA Calibration",
      departureDate: "11/16/2024",
      submitted: "Yes",
      proofOfDelivery: "Complete",
      workDescription: "FDA 21 CFR Part 11 compliant calibration and software validation for pharmaceutical weighing applications",
      partsNeeded: ["Certified Weight Set", "Anti-static Kit", "Software Update"],
      laborHours: "10.5",
      invoiceNumber: "INV-2024-0134",
      paymentStatus: "Paid",
      warrantyInfo: "1-year FDA compliance warranty",
      certificationRequired: "FDA 21 CFR Part 11 Certificate",
      healthSafetyNotes: "Clean room protocols required - sterile handling procedures",
      customerAddress: "2468 Pharma Drive, Medical District, MD 24681",
      serviceType: "FDA Compliant Calibration",
      technicalNotes: "Updated software to v3.2.1 for enhanced data integrity",
      qualityAssurance: "Passed all FDA validation protocols - full documentation provided"
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
  const navigate = useNavigate();
  const itemsPerPage = 10;
  
  // Filter work orders based on selected status
  const filteredWorkOrders = activeStatusFilter === 'all' 
    ? mockWorkOrders 
    : mockWorkOrders.filter(order => order.status.toLowerCase().replace(' ', '-') === activeStatusFilter);
  
  const totalPages = Math.ceil(filteredWorkOrders.length / itemsPerPage);

  const openDetails = (order: WorkOrder) => {
    setSelectedWorkOrder(order);
  };

  const handleEditWorkOrder = (workOrderId: string) => {
    navigate(`/work-order/${workOrderId}`);
  };

  // Work Order Details Dialog Component
  const WorkOrderDetailsDialog = ({ order }: { order: WorkOrder }) => (
    <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-lg sm:text-xl">
          <span className="font-bold text-blue-600">{order.id}</span>
          <div className="flex items-center gap-2">
            {getStatusBadge(order.status)}
            <span className={cn("px-3 py-1 rounded-md text-sm font-medium",
              order.details.priority === "Critical" ? "bg-red-100 text-red-800" :
              order.details.priority === "High" ? "bg-orange-100 text-orange-800" :
              order.details.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            )}>{order.details.priority} Priority</span>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Customer & Basic Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => handleEditWorkOrder(order.id)} className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Order
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <User className="h-4 w-4 mr-2" />
            Assign Tech
          </Button>
          <Button className="w-full sm:w-auto">
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
              "h-8 px-2 sm:px-3 rounded-md transition-all text-xs sm:text-sm",
              viewMode === 'list' 
                ? "bg-white shadow-sm text-gray-900" 
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            )}
          >
            <List className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">List</span>
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "h-8 px-2 sm:px-3 rounded-md transition-all text-xs sm:text-sm",
              viewMode === 'grid' 
                ? "bg-white shadow-sm text-gray-900" 
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            )}
          >
            <Grid3X3 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Grid</span>
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
          <>
            {/* Desktop List View - Table */}
            <div className="hidden md:block">
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
                              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleEditWorkOrder(order.id)}>
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
            </div>

            {/* Mobile/Tablet List View - Cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredWorkOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openDetails(order)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-600 text-lg">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50 rounded-lg">
                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleEditWorkOrder(order.id)}>
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
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.customer}</h3>
                      <p className="text-gray-600">Assigned to: {order.assignedTo}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Due: <span className="font-medium text-gray-900">{order.dueDate}</span></span>
                      <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                        order.details.priority === "Critical" ? "bg-red-100 text-red-800" :
                        order.details.priority === "High" ? "bg-orange-100 text-orange-800" :
                        order.details.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      )}>{order.details.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Grid View - Cards
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                        <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleEditWorkOrder(order.id)}>
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
                      <div className="font-mono text-xs truncate">{order.details.modelNumber}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Manufacturer:</span>
                      <div className="font-medium text-xs truncate">{order.details.manufacturer}</div>
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
      <div className="p-4 sm:p-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, mockWorkOrders.length)} of {mockWorkOrders.length} results
          </div>
          
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg"
            >
              <ChevronLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Previous</span>
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
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 sm:ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernWorkOrdersTable;