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

const mockWorkOrders: WorkOrder[] = [
  {
    id: "385737",
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
      qualityAssurance: "Passed all QC checks - awaiting final certification",
      template: "External Datasheet (pdf)",
      originalLoc: "AL",
      destLoc: "AL",
      ts: "J",
      hotlist: "",
      jmPoNumber: "5980"
    }
  },
  {
    id: "390589",
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
    division: "Rental",
    details: {
      modelNumber: "844-441",
      labCode: "LAB-002",
      comments: "Micrometer repair completed successfully",
      manufacturer: "STARRETT",
      serialNumber: "SN789012",
      batch: "B2024-002",
      items: "3",
      purchase: "PO-2024-002",
      lots: "BR",
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
      itemType: "SINGLE (24)",
      operationType: "Repair",
      departureDate: "11/21/2024",
      submitted: "Yes",
      proofOfDelivery: "Complete",
      job: "R/C/C",
      action: "R/C/C",
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
      qualityAssurance: "All measurements within ±0.0001\" tolerance",
      template: "TIC 300HV HV Detector.xlsx",
      originalLoc: "BI",
      destLoc: "BI", 
      ts: "N",
      hotlist: "",
      jmPoNumber: "34169"
    }
  },
  {
    id: "400217",
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
    division: "ESL Onsite",
    details: {
      modelNumber: "1000PS",
      labCode: "LAB-003",
      comments: "Awaiting replacement parts",
      manufacturer: "CHARLS LTD",
      serialNumber: "SN345678",
      batch: "B2024-003",
      items: "1",
      purchase: "PO-2024-003",
      lots: "CL",
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
      itemType: "ESL - Hotsticks (15)",
      operationType: "Service",
      departureDate: "TBD",
      submitted: "No",
      proofOfDelivery: "N/A",
      job: "REPAIR",
      action: "REPAIR",
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
      qualityAssurance: "Pending parts arrival and installation",
      template: "Kaelus iPA 0707A PIM Analyzer.xlsx",
      originalLoc: "BR",
      destLoc: "BR",
      ts: "",
      hotlist: "Hotsticks",
      jmPoNumber: ""
    }
  },
  {
    id: "403946",
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
    division: "ESL",
    details: {
      modelNumber: "CAL-500",
      labCode: "LAB-004",
      comments: "Initial inspection scheduled",
      manufacturer: "PRECISION TOOLS",
      serialNumber: "SN901234",
      batch: "B2024-004",
      items: "2",
      purchase: "PO-2024-004",
      lots: "BI",
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
      itemType: "SINGLE (16)",
      operationType: "Inspection",
      departureDate: "12/02/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "TEST",
      action: "TEST",
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
      qualityAssurance: "Scheduled for full calibration next week",
      template: "Chart Recorders 150°F - XX PSI ALL Auto Fill Specs .xlsx",
      originalLoc: "BI",
      destLoc: "BI",
      ts: "ES",
      hotlist: "",
      jmPoNumber: "50353"
    }
  },
  {
    id: "405078",
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
    division: "Lab",
    details: {
      modelNumber: "TW-PRO-500",
      labCode: "LAB-005",
      comments: "Precision torque calibration for aerospace applications",
      manufacturer: "SNAP-ON",
      serialNumber: "SN567890",
      batch: "B2024-005",
      items: "8",
      purchase: "PO-2024-005",
      lots: "OD",
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
      itemType: "ESL - Gloves (0)",
      operationType: "Precision Calibration",
      departureDate: "12/06/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
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
      qualityAssurance: "5 of 8 units completed - within ±2% tolerance requirement",
      template: "TW DTW ETW All Flex Autofill.xlsx",
      originalLoc: "OD",
      destLoc: "OD",
      ts: "K",
      hotlist: "",
      jmPoNumber: "43949"
    }
  },
  {
    id: "408881",
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
    division: "Rental",
    details: {
      modelNumber: "AB-220",
      labCode: "LAB-006",
      comments: "FDA compliant calibration completed",
      manufacturer: "METTLER TOLEDO",
      serialNumber: "SN234567",
      batch: "B2024-006",
      items: "1",
      purchase: "PO-2024-006",
      lots: "AL",
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
      itemType: "ITL - Gauges (10)",
      operationType: "FDA Calibration",
      departureDate: "11/16/2024",
      submitted: "Yes",
      proofOfDelivery: "Complete",
      job: "C/C",
      action: "C/C",
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
      qualityAssurance: "Passed all FDA validation protocols - full documentation provided",
      template: "External Datasheet (.xlsx)",
      originalLoc: "AL",
      destLoc: "AL",
      ts: "ES",
      hotlist: "",
      jmPoNumber: "50354"
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
  const [templateView, setTemplateView] = useState<boolean>(false);
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
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-xl">
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
        {/* Header Info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Work Order:</span>
              <div className="font-bold text-blue-900">{order.id}</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Customer:</span>
              <div className="font-semibold text-blue-900">{order.customer}</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Division:</span>
              <div className="font-semibold text-blue-900">{order.division}</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">LOC:</span>
              <div className="font-semibold text-blue-900">{order.details.lots}</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Action:</span>
              <div className="font-semibold text-blue-900">{order.details.action}</div>
            </div>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Work Order Details</h4>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Column 1 */}
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm font-medium">Items:</span>
                  <div className="font-semibold text-sm">{order.details.items}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Lab Code:</span>
                  <div className="font-mono text-sm">{order.details.labCode}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Item Type:</span>
                  <div className="text-sm">{order.details.itemType}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Operation Type:</span>
                  <div className="text-sm">{order.details.operationType}</div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm font-medium">Manufacturer:</span>
                  <div className="font-semibold text-sm">{order.details.manufacturer}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Model Number:</span>
                  <div className="font-mono text-sm">{order.details.modelNumber}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Serial No.:</span>
                  <div className="font-mono text-sm">{order.details.serialNumber}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Assigned To:</span>
                  <div className="font-semibold text-sm">{order.assignedTo}</div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm font-medium">Cust ID:</span>
                  <div className="font-mono text-sm">{order.details.custId}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Cust S/N:</span>
                  <div className="font-mono text-sm">{order.details.custSn}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">PO #:</span>
                  <div className="font-mono text-sm">{order.details.poNumber}</div>
                </div>
              </div>
            </div>

            {/* Status Row */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-500 text-sm font-medium">Delivery Submitted:</span>
                  <div className={cn("mt-1 inline-block px-2 py-1 rounded text-xs font-medium",
                    order.details.submitted === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>{order.details.submitted}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Departure Type:</span>
                  <div className="mt-1 inline-block px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                    Customer Pickup
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Proof of Delivery:</span>
                  <div className={cn("mt-1 inline-block px-2 py-1 rounded text-xs font-medium",
                    order.details.proofOfDelivery === "Complete" ? "bg-green-100 text-green-800" :
                    order.details.proofOfDelivery === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  )}>{order.details.proofOfDelivery}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Project Timeline
            </h4>
          </div>
          
          <div className="p-6">
            <div className="relative">
              <div className="flex justify-between items-center">
                {/* Timeline Items */}
                {[
                  {
                    title: "Created",
                    date: order.details.createdDate,
                    description: "Initial Setup",
                    color: "bg-green-500",
                    bgColor: "bg-green-50",
                    textColor: "text-green-700"
                  },
                  {
                    title: "Status Updated", 
                    date: order.details.statusDate,
                    description: order.status,
                    color: "bg-blue-500",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-700"
                  },
                  {
                    title: "Last Modified",
                    date: order.details.lastModified,
                    description: "Recent Updates",
                    color: "bg-yellow-500",
                    bgColor: "bg-yellow-50", 
                    textColor: "text-yellow-700"
                  },
                  {
                    title: "Need By Date",
                    date: order.details.nextBy,
                    description: "Target Date",
                    color: order.details.nextBy === "TBD" ? "bg-red-500" : "bg-purple-500",
                    bgColor: order.details.nextBy === "TBD" ? "bg-red-50" : "bg-purple-50",
                    textColor: order.details.nextBy === "TBD" ? "text-red-700" : "text-purple-700"
                  },
                  {
                    title: "Departure",
                    date: "-",
                    description: "Completion",
                    color: "bg-gray-400",
                    bgColor: "bg-gray-50",
                    textColor: "text-gray-600"
                  }
                ].map((item, index, array) => (
                  <div key={index} className="flex flex-col items-center relative flex-1">
                    {/* Connecting Line - only show between items */}
                    {index < array.length - 1 && (
                      <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-300 z-0" 
                           style={{ transform: 'translateX(50%)' }}></div>
                    )}
                    
                    {/* Timeline Dot */}
                    <div className="relative z-10 mb-4">
                      <div className={cn("w-4 h-4 rounded-full border-3 border-white shadow-lg", item.color)}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center max-w-[120px]">
                      <div className="text-sm font-semibold text-gray-900 mb-2">{item.title}</div>
                      <div className={cn("text-xs px-3 py-1.5 rounded-full mb-2 font-medium", item.bgColor, item.textColor)}>
                        {item.date}
                      </div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Comments:</h4>
          <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
            {order.details.comments}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => handleEditWorkOrder(order.id)}>
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
          <div className="flex items-center gap-3">
            {/* Template/Default Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={!templateView ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTemplateView(false)}
                className={cn(
                  "h-8 px-3 rounded-md transition-all",
                  !templateView 
                    ? "bg-white shadow-sm text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                )}
              >
                Default
              </Button>
              <Button
                variant={templateView ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTemplateView(true)}
                className={cn(
                  "h-8 px-3 rounded-md transition-all",
                  templateView 
                    ? "bg-white shadow-sm text-gray-900" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                )}
              >
                Template
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
                {templateView ? (
                  // Template View Headers
                  <>
                    <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Item</TableHead>
                    <TableHead className="font-semibold text-gray-900">Division</TableHead>
                    <TableHead className="font-semibold text-gray-900">Original LOC</TableHead>
                    <TableHead className="font-semibold text-gray-900">Created Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Item Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Dest LOC</TableHead>
                    <TableHead className="font-semibold text-gray-900">Due Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Manufacturer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Model Number</TableHead>
                    <TableHead className="font-semibold text-gray-900">Lab Code</TableHead>
                    <TableHead className="font-semibold text-gray-900">JM PO#</TableHead>
                    <TableHead className="font-semibold text-gray-900">Template</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-900">TS</TableHead>
                    <TableHead className="font-semibold text-gray-900">Hotlist</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </>
                ) : (
                  // Default View Headers
                  <>
                    <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Items</TableHead>
                    <TableHead className="font-semibold text-gray-900">Division</TableHead>
                    <TableHead className="font-semibold text-gray-900">Created Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Due Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Assigned To</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => openDetails(order)}
                >
                  {templateView ? (
                    // Template View Cells
                    <>
                      <TableCell className="font-medium text-blue-600">{order.id}</TableCell>
                      <TableCell className="font-mono text-sm">{order.details.items}</TableCell>
                      <TableCell className="font-medium">{order.division}</TableCell>
                      <TableCell className="font-medium">{order.details.originalLoc}</TableCell>
                      <TableCell className="text-sm">{order.details.createdDate}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="font-medium">{order.details.destLoc}</TableCell>
                      <TableCell>{order.dueDate}</TableCell>
                      <TableCell className="font-medium">{order.details.manufacturer}</TableCell>
                      <TableCell className="font-mono text-sm">{order.details.modelNumber}</TableCell>
                      <TableCell className="font-mono text-sm">{order.details.labCode}</TableCell>
                      <TableCell className="font-mono text-sm">{order.details.jmPoNumber}</TableCell>
                      <TableCell className="text-blue-600 underline cursor-pointer hover:text-blue-800">{order.details.template}</TableCell>
                      <TableCell className="font-medium">{order.customer}</TableCell>
                      <TableCell className="font-mono text-sm">{order.details.ts}</TableCell>
                      <TableCell className="font-mono text-sm">{order.details.hotlist}</TableCell>
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
                    </>
                  ) : (
                    // Default View Cells
                    <>
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
                      <TableCell className="font-mono text-sm">{order.details.items}</TableCell>
                      <TableCell className="font-medium">{order.division}</TableCell>
                      <TableCell className="text-sm">{order.details.createdDate}</TableCell>
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
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          // Grid View - Cards
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                          order.details.priority === "Critical" ? "bg-red-100 text-red-800" :
                          order.details.priority === "High" ? "bg-orange-100 text-orange-800" :
                          order.details.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        )}>{order.details.priority}</span>
                      </div>
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
                  {templateView ? (
                    // Template View Content
                    <>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{order.details.manufacturer}</h3>
                      </div>

                      <div className="text-sm">
                        <div>
                          <span className="text-gray-500">Item:</span>
                          <div className="font-mono text-xs">{order.details.items}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <div className="font-medium text-xs">{order.details.createdDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <div className="font-medium text-xs">{order.dueDate}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Division:</span>
                          <div className="font-medium text-xs">{order.division}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Customer:</span>
                          <div className="font-medium text-xs">{order.customer}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Model:</span>
                          <div className="font-mono text-xs">{order.details.modelNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Template:</span>
                          <div className="text-blue-600 underline cursor-pointer hover:text-blue-800 text-xs">{order.details.template}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    // Default View Content
                    <>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base mb-1">{order.customer}</h3>
                        <p className="text-sm text-gray-600">Assigned to: {order.assignedTo}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Items:</span>
                          <div className="font-mono text-xs">{order.details.items}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Division:</span>
                          <div className="font-medium text-xs">{order.division}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <div className="font-medium text-xs">{order.details.createdDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <div className="font-medium text-xs">{order.dueDate}</div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <div>
                          <span className="text-gray-500">Model:</span>
                          <div className="font-mono text-xs">{order.details.modelNumber}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
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