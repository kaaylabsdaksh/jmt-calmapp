import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { List, Grid3X3, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import WorkOrderBatchDetails from "@/components/WorkOrderBatchDetails";

interface WorkOrderBatch {
  id: string;
  woBatch: string;
  acctNumber: string;
  srNumber: string;
  customerName: string;
  totalLabOpen: number;
  totalArCount: number;
  totalCount: number;
  lastCommentDate: string;
  lastComment: string;
  minNeedByDate: string;
  minFollowUpDate: string;
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
      itemType: "ESL - Gloves",
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
      itemType: "ESL - Blankets",
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
    status: "Awaiting Parts",
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
      itemType: "ESL - Blankets",
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
    status: "Q/A Inspection",
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
      itemType: "ESL - Gloves",
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
    status: "Assigned to Tech",
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
      itemType: "ESL - Gloves",
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
      itemType: "ESL - Gloves",
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
  },
  // New entries added below
  {
    id: "412340",
    status: "In Metrology",
    customer: "Energy Solutions Corp",
    dueDate: "Dec 08, 2024",
    assignedTo: "Alex Thompson",
    location: "Lab Building E - Room 203",
    equipmentType: "Power Meter",
    estimatedCost: "$2,100.00",
    actualCost: "TBD",
    contactPerson: "Mark Stevens",
    phone: "(555) 789-0123",
    email: "m.stevens@energysolutions.com",
    urgencyLevel: "High",
    completionPercentage: 40,
    division: "Lab",
    details: {
      modelNumber: "PM-850",
      labCode: "LAB-007",
      comments: "High voltage power meter calibration",
      manufacturer: "FLUKE",
      serialNumber: "SN890123",
      batch: "B2024-007",
      items: "2",
      purchase: "PO-2024-007",
      lots: "FL",
      createdDate: "11/15/2024",
      statusDate: "11/28/2024",
      lastModified: "12/01/2024",
      nextBy: "12/09/2024",
      priority: "High",
      custId: "CUST-007",
      custSn: "ENERGY-SN-007",
      cartId: "CART-007",
      cartSn: "CSN-007",
      poNumber: "PO-2024-007",
      itemType: "ESL - Gloves",
      operationType: "Calibration",
      departureDate: "12/09/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Three-phase power meter calibration for energy monitoring systems",
      partsNeeded: ["Test Leads", "Current Clamps", "Calibration Software"],
      laborHours: "16.0",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Sent",
      warrantyInfo: "1-year calibration warranty",
      certificationRequired: "IEC 61010 Certificate",
      healthSafetyNotes: "High voltage testing - qualified personnel only",
      customerAddress: "4567 Energy Blvd, Power District, PD 34567",
      serviceType: "Electrical Calibration",
      technicalNotes: "Requires high voltage test setup - scheduled for next week",
      qualityAssurance: "Preliminary tests completed - main calibration in progress",
      template: "Power Meter Calibration Template.xlsx",
      originalLoc: "FL",
      destLoc: "FL",
      ts: "H",
      hotlist: "",
      jmPoNumber: "61234"
    }
  },
  {
    id: "415629",
    status: "Pending",
    customer: "Medical Devices Inc",
    dueDate: "Dec 12, 2024",
    assignedTo: "Dr. Rachel Martinez",
    location: "Biomedical Lab - Room 301",
    equipmentType: "Ultrasonic Cleaner",
    estimatedCost: "$750.00",
    actualCost: "TBD",
    contactPerson: "James Robinson",
    phone: "(555) 890-1234",
    email: "j.robinson@medicaldevices.com",
    urgencyLevel: "Medium",
    completionPercentage: 5,
    division: "ESL",
    details: {
      modelNumber: "UC-750",
      labCode: "LAB-008",
      comments: "Medical device cleaning validation required",
      manufacturer: "BRANSON",
      serialNumber: "SN012345",
      batch: "B2024-008",
      items: "1",
      purchase: "PO-2024-008",
      lots: "BR",
      createdDate: "11/25/2024",
      statusDate: "11/30/2024",
      lastModified: "12/02/2024",
      nextBy: "12/13/2024",
      priority: "Medium",
      custId: "CUST-008",
      custSn: "MED-SN-008",
      cartId: "CART-008",
      cartSn: "CSN-008",
      poNumber: "PO-2024-008",
      itemType: "ESL - Gloves",
      operationType: "Validation",
      departureDate: "12/13/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "TEST",
      action: "TEST",
      workDescription: "FDA validation and performance verification for medical instrument cleaning",
      partsNeeded: ["Test Specimens", "Cleaning Solution", "Validation Kit"],
      laborHours: "9.0",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Approved",
      warrantyInfo: "6-month validation certificate",
      certificationRequired: "FDA Medical Device Certificate",
      healthSafetyNotes: "Use appropriate PPE - chemical handling required",
      customerAddress: "8901 Medical Way, Healthcare Plaza, HP 45678",
      serviceType: "Medical Device Validation",
      technicalNotes: "Awaiting FDA protocol review before starting validation",
      qualityAssurance: "Protocol under review - validation scheduled",
      template: "Medical Device Validation Template.pdf",
      originalLoc: "BR",
      destLoc: "BR",
      ts: "M",
      hotlist: "",
      jmPoNumber: "72345"
    }
  },
  {
    id: "418974",
    status: "To Factory",
    customer: "Precision Manufacturing Ltd",
    dueDate: "Nov 28, 2024",
    assignedTo: "Kevin Park",
    location: "Lab Building F - Room 105",
    equipmentType: "CMM Machine",
    estimatedCost: "$4,500.00",
    actualCost: "TBD",
    contactPerson: "Nancy Williams",
    phone: "(555) 012-3456",
    email: "n.williams@precisionmfg.com",
    urgencyLevel: "Critical",
    completionPercentage: 25,
    division: "ESL Onsite",
    details: {
      modelNumber: "CMM-3000",
      labCode: "LAB-009",
      comments: "Major calibration overdue - customer priority",
      manufacturer: "ZEISS",
      serialNumber: "SN456789",
      batch: "B2024-009",
      items: "1",
      purchase: "PO-2024-009",
      lots: "ZE",
      createdDate: "10/15/2024",
      statusDate: "11/25/2024",
      lastModified: "11/30/2024",
      nextBy: "ASAP",
      priority: "Critical",
      custId: "CUST-009",
      custSn: "PREC-SN-009",
      cartId: "CART-009",
      cartSn: "CSN-009",
      poNumber: "PO-2024-009",
      itemType: "ITL - Gauges",
      operationType: "Major Calibration",
      departureDate: "TBD",
      submitted: "No",
      proofOfDelivery: "N/A",
      job: "C/C",
      action: "C/C",
      workDescription: "Complete dimensional calibration of coordinate measuring machine including probe qualification",
      partsNeeded: ["Reference Spheres", "Gauge Blocks", "Probe Tips", "Software License"],
      laborHours: "40.0",
      invoiceNumber: "TBD",
      paymentStatus: "On Hold",
      warrantyInfo: "2-year calibration warranty",
      certificationRequired: "ISO 10360 Certificate",
      healthSafetyNotes: "Heavy equipment - crane required for component access",
      customerAddress: "2345 Precision Ave, Manufacturing Hub, MH 56789",
      serviceType: "Complete System Calibration",
      technicalNotes: "Waiting for specialized calibration artifacts - delivery delayed",
      qualityAssurance: "Customer escalation - expedite processing",
      template: "CMM Calibration Full Template.xlsx",
      originalLoc: "ZE",
      destLoc: "ZE",
      ts: "C",
      hotlist: "Priority",
      jmPoNumber: "83456"
    }
  },
  {
    id: "421587",
    status: "Ready for Departure",
    customer: "Automotive Testing Labs",
    dueDate: "Nov 22, 2024",
    assignedTo: "Lisa Chen",
    location: "Lab Building G - Room 401",
    equipmentType: "Vibration Analyzer",
    estimatedCost: "$1,800.00",
    actualCost: "$1,750.00",
    contactPerson: "Carlos Mendez",
    phone: "(555) 234-5678",
    email: "c.mendez@autotesting.com",
    urgencyLevel: "Medium",
    completionPercentage: 100,
    division: "Rental",
    details: {
      modelNumber: "VA-2500",
      labCode: "LAB-010",
      comments: "Automotive vibration testing equipment calibrated",
      manufacturer: "BRUEL & KJAER",
      serialNumber: "SN678901",
      batch: "B2024-010",
      items: "4",
      purchase: "PO-2024-010",
      lots: "BK",
      createdDate: "11/01/2024",
      statusDate: "11/20/2024",
      lastModified: "11/22/2024",
      nextBy: "11/23/2024",
      priority: "Medium",
      custId: "CUST-010",
      custSn: "AUTO-SN-010",
      cartId: "CART-010",
      cartSn: "CSN-010",
      poNumber: "PO-2024-010",
      itemType: "ITL - Gauges",
      operationType: "Calibration",
      departureDate: "11/23/2024",
      submitted: "Yes",
      proofOfDelivery: "Complete",
      job: "C/C",
      action: "C/C",
      workDescription: "Multi-channel vibration analyzer calibration for automotive NVH testing",
      partsNeeded: ["Accelerometers", "Shaker Table", "Reference Standards"],
      laborHours: "18.0",
      invoiceNumber: "INV-2024-0167",
      paymentStatus: "Paid",
      warrantyInfo: "1-year calibration warranty",
      certificationRequired: "ISO 5347 Certificate",
      healthSafetyNotes: "Vibration exposure limits - use hearing protection",
      customerAddress: "6789 Automotive Dr, Testing Center, TC 67890",
      serviceType: "Multi-channel Calibration",
      technicalNotes: "All 4 channels calibrated to ±0.5% accuracy specification",
      qualityAssurance: "Full frequency sweep completed - all channels within spec",
      template: "Vibration Analyzer Multi-Channel Template.xlsx",
      originalLoc: "BK",
      destLoc: "BK",
      ts: "V",
      hotlist: "",
      jmPoNumber: "94567"
    }
  },
  {
    id: "424833",
    status: "In Lab",
    customer: "Chemical Analysis Corp",
    dueDate: "Dec 15, 2024",
    assignedTo: "Dr. Patricia Lee",
    location: "Chemistry Lab - Room 205",
    equipmentType: "pH Meter System",
    estimatedCost: "$680.00",
    actualCost: "TBD",
    contactPerson: "Richard Davis",
    phone: "(555) 345-6789",
    email: "r.davis@chemanalysis.com",
    urgencyLevel: "Low",
    completionPercentage: 30,
    division: "Lab",
    details: {
      modelNumber: "pH-850",
      labCode: "LAB-011",
      comments: "Multi-point pH calibration in progress",
      manufacturer: "HACH",
      serialNumber: "SN345678",
      batch: "B2024-011",
      items: "3",
      purchase: "PO-2024-011",
      lots: "HA",
      createdDate: "11/28/2024",
      statusDate: "12/03/2024",
      lastModified: "12/05/2024",
      nextBy: "12/16/2024",
      priority: "Low",
      custId: "CUST-011",
      custSn: "CHEM-SN-011",
      cartId: "CART-011",
      cartSn: "CSN-011",
      poNumber: "PO-2024-011",
      itemType: "ITL - Gauges",
      operationType: "Calibration",
      departureDate: "12/16/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Multi-point pH meter calibration using NIST traceable buffer solutions",
      partsNeeded: ["Buffer Solutions", "Electrode Cleaner", "Storage Solution"],
      laborHours: "7.5",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Approved",
      warrantyInfo: "6-month calibration warranty",
      certificationRequired: "NIST Traceable Certificate",
      healthSafetyNotes: "Chemical handling - use appropriate PPE and fume hood",
      customerAddress: "3456 Chemical Way, Research Park, RP 78901",
      serviceType: "Chemical Calibration",
      technicalNotes: "Electrode conditioning completed - buffer calibration underway",
      qualityAssurance: "3-point calibration completed - extended range testing next",
      template: "pH Meter Calibration Template.xlsx",
      originalLoc: "HA",
      destLoc: "HA",
      ts: "P",
      hotlist: "",
      jmPoNumber: "15678"
    }
  },
  {
    id: "427965",
    status: "Waiting on Customer",
    customer: "Environmental Testing Solutions",
    dueDate: "Dec 20, 2024",
    assignedTo: "Michael Johnson",
    location: "Environmental Lab - Room 102",
    equipmentType: "Gas Chromatograph",
    estimatedCost: "$3,800.00",
    actualCost: "TBD",
    contactPerson: "Susan Thompson",
    phone: "(555) 456-7890",
    email: "s.thompson@envtesting.com",
    urgencyLevel: "High",
    completionPercentage: 10,
    division: "ESL",
    details: {
      modelNumber: "GC-7890",
      labCode: "LAB-012",
      comments: "EPA method validation required",
      manufacturer: "AGILENT",
      serialNumber: "SN567890",
      batch: "B2024-012",
      items: "1",
      purchase: "PO-2024-012",
      lots: "AG",
      createdDate: "12/01/2024",
      statusDate: "12/05/2024",
      lastModified: "12/06/2024",
      nextBy: "12/21/2024",
      priority: "High",
      custId: "CUST-012",
      custSn: "ENV-SN-012",
      cartId: "CART-012",
      cartSn: "CSN-012",
      poNumber: "PO-2024-012",
      itemType: "ESL - Hotsticks",
      operationType: "EPA Validation",
      departureDate: "12/21/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "VALIDATE",
      action: "VALIDATE",
      workDescription: "EPA method validation and performance verification for environmental analysis",
      partsNeeded: ["Reference Standards", "Carrier Gas", "Detector Components", "Validation Kit"],
      laborHours: "32.0",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Sent",
      warrantyInfo: "1-year method validation certificate",
      certificationRequired: "EPA Method 8270 Certificate",
      healthSafetyNotes: "Volatile organic compounds - use proper ventilation and PPE",
      customerAddress: "7890 Environmental Blvd, Green Valley, GV 89012",
      serviceType: "EPA Method Validation",
      technicalNotes: "Waiting for EPA reference standards delivery - ETA next week",
      qualityAssurance: "Method protocol under review - validation to begin soon",
      template: "GC EPA Method Validation Template.pdf",
      originalLoc: "AG",
      destLoc: "AG",
      ts: "E",
      hotlist: "",
      jmPoNumber: "26789"
    }
  },
  {
    id: "420184",
    status: "[Open Items]",
    customer: "Industrial Automation Ltd",
    dueDate: "Dec 18, 2024",
    assignedTo: "Kevin Park",
    location: "Lab Building F - Room 104",
    equipmentType: "Temperature Controller",
    estimatedCost: "$1,875.00",
    actualCost: "TBD",
    contactPerson: "Amanda White",
    phone: "(555) 234-5679",
    email: "a.white@industrialautomation.com",
    urgencyLevel: "High",
    completionPercentage: 25,
    division: "Lab",
    details: {
      modelNumber: "TC-5000",
      labCode: "LAB-011",
      comments: "PID controller calibration and setup",
      manufacturer: "OMEGA",
      serialNumber: "SN456789",
      batch: "B2024-011",
      items: "3",
      purchase: "PO-2024-011",
      lots: "OM",
      createdDate: "11/28/2024",
      statusDate: "12/05/2024",
      lastModified: "12/08/2024",
      nextBy: "12/19/2024",
      priority: "High",
      custId: "CUST-011",
      custSn: "AUTO-SN-011",
      cartId: "CART-011",
      cartSn: "CSN-011",
      poNumber: "PO-2024-011",
      itemType: "ESL - Hotsticks",
      operationType: "Calibration",
      departureDate: "12/19/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Multi-zone temperature controller calibration for industrial process control",
      partsNeeded: ["Thermocouple Set", "Reference Standards", "Software License"],
      laborHours: "18.5",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Pending",
      warrantyInfo: "1-year calibration warranty",
      certificationRequired: "NIST Traceable Certificate",
      healthSafetyNotes: "High temperature testing - heat protection required",
      customerAddress: "2345 Automation Dr, Control City, CC 56789",
      serviceType: "Industrial Calibration",
      technicalNotes: "Open items: Missing reference documentation, awaiting customer specs",
      qualityAssurance: "Preliminary setup complete - awaiting customer approval",
      template: "Temperature Controller Calibration.xlsx",
      originalLoc: "OM",
      destLoc: "OM",
      ts: "T",
      hotlist: "",
      jmPoNumber: "78234"
    }
  },
  {
    id: "425671",
    status: "Overdue",
    customer: "Mining Equipment Corp",
    dueDate: "Nov 28, 2024",
    assignedTo: "Steve Johnson",
    location: "Heavy Equipment Bay - Zone 3",
    equipmentType: "Load Cell Array",
    estimatedCost: "$4,200.00",
    actualCost: "TBD",
    contactPerson: "Tony Rodriguez",
    phone: "(555) 345-6780",
    email: "t.rodriguez@miningequip.com",
    urgencyLevel: "Critical",
    completionPercentage: 45,
    division: "ESL Onsite",
    details: {
      modelNumber: "LC-50K",
      labCode: "LAB-012",
      comments: "High capacity load cell calibration - overdue due to equipment issues",
      manufacturer: "RICE LAKE",
      serialNumber: "SN567890",
      batch: "B2024-012",
      items: "4",
      purchase: "PO-2024-012",
      lots: "RL",
      createdDate: "10/25/2024",
      statusDate: "11/20/2024",
      lastModified: "12/08/2024",
      nextBy: "OVERDUE",
      priority: "Critical",
      custId: "CUST-012",
      custSn: "MINE-SN-012",
      cartId: "CART-012",
      cartSn: "CSN-012",
      poNumber: "PO-2024-012",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "OVERDUE",
      submitted: "Yes",
      proofOfDelivery: "N/A",
      job: "C/C",
      action: "C/C",
      workDescription: "50,000 lb capacity load cell array calibration for mining scale system",
      partsNeeded: ["Test Weights", "Hydraulic Jack", "Data Logger"],
      laborHours: "28.0",
      invoiceNumber: "TBD",
      paymentStatus: "On Hold",
      warrantyInfo: "2-year calibration warranty",
      certificationRequired: "NTEP Certificate of Conformance",
      healthSafetyNotes: "CRITICAL: Heavy lifting equipment required - crane operations",
      customerAddress: "7890 Mining Road, Industrial Complex, IC 67890",
      serviceType: "Heavy Duty Calibration",
      technicalNotes: "Delayed due to hydraulic system failure - replacement parts ordered",
      qualityAssurance: "50% complete - waiting on hydraulic repair completion",
      template: "Load Cell Calibration Heavy Duty.xlsx",
      originalLoc: "RL",
      destLoc: "RL",
      ts: "HD",
      hotlist: "Critical",
      jmPoNumber: "89345"
    }
  },
  {
    id: "430294",
    status: "Lab Hold",
    customer: "Precision Instruments LLC",
    dueDate: "Dec 22, 2024",
    assignedTo: "Lisa Chen",
    location: "Precision Lab - Room 205",
    equipmentType: "Coordinate Measuring Machine",
    estimatedCost: "$5,500.00",
    actualCost: "TBD",
    contactPerson: "George Martinez",
    phone: "(555) 456-7891",
    email: "g.martinez@precisioninstruments.com",
    urgencyLevel: "High",
    completionPercentage: 30,
    division: "Lab",
    details: {
      modelNumber: "CMM-1000",
      labCode: "LAB-013",
      comments: "On lab hold pending environmental chamber availability",
      manufacturer: "ZEISS",
      serialNumber: "SN678901",
      batch: "B2024-013",
      items: "1",
      purchase: "PO-2024-013",
      lots: "ZE",
      createdDate: "11/30/2024",
      statusDate: "12/08/2024",
      lastModified: "12/10/2024",
      nextBy: "12/23/2024",
      priority: "High",
      custId: "CUST-013",
      custSn: "PREC-SN-013",
      cartId: "CART-013",
      cartSn: "CSN-013",
      poNumber: "PO-2024-013",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/23/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "High precision coordinate measuring machine calibration and accuracy verification",
      partsNeeded: ["Reference Spheres", "Gauge Blocks", "Temperature Sensors"],
      laborHours: "32.0",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Approved",
      warrantyInfo: "1-year precision calibration warranty",
      certificationRequired: "ISO 10360 Certificate",
      healthSafetyNotes: "Temperature controlled environment required - 20°C ±1°C",
      customerAddress: "4567 Precision Blvd, Metrology Park, MP 78901",
      serviceType: "Precision Metrology Calibration",
      technicalNotes: "On hold - environmental chamber maintenance in progress",
      qualityAssurance: "Initial measurements taken - awaiting controlled environment",
      template: "CMM Calibration ISO 10360.xlsx",
      originalLoc: "ZE",
      destLoc: "ZE",
      ts: "P",
      hotlist: "",
      jmPoNumber: "90456"
    }
  },
  {
    id: "435847",
    status: "In Transit",
    customer: "Automotive Testing Solutions",
    dueDate: "Dec 15, 2024",
    assignedTo: "Carlos Mendez",
    location: "Shipping Bay - Dock 2",
    equipmentType: "Dynamometer System",
    estimatedCost: "$8,750.00",
    actualCost: "$8,650.00",
    contactPerson: "Patricia Kim",
    phone: "(555) 567-8902",
    email: "p.kim@autotesting.com",
    urgencyLevel: "Medium",
    completionPercentage: 100,
    division: "ESL Onsite",
    details: {
      modelNumber: "DYNO-5000",
      labCode: "LAB-014",
      comments: "Completed calibration - in transit to customer",
      manufacturer: "CLAYTON",
      serialNumber: "SN789012",
      batch: "B2024-014",
      items: "1",
      purchase: "PO-2024-014",
      lots: "CL",
      createdDate: "11/05/2024",
      statusDate: "12/10/2024",
      lastModified: "12/12/2024",
      nextBy: "12/16/2024",
      priority: "Medium",
      custId: "CUST-014",
      custSn: "AUTO-SN-014",
      cartId: "CART-014",
      cartSn: "CSN-014",
      poNumber: "PO-2024-014",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/12/2024",
      submitted: "Yes",
      proofOfDelivery: "In Transit",
      job: "C/C/D",
      action: "C/C/D",
      workDescription: "Chassis dynamometer calibration and performance verification for automotive testing",
      partsNeeded: ["Calibration Weights", "Speed Sensors", "Load Cell Kit"],
      laborHours: "45.0",
      invoiceNumber: "INV-2024-0287",
      paymentStatus: "Paid",
      warrantyInfo: "2-year calibration and service warranty",
      certificationRequired: "SAE J1349 Compliance Certificate",
      healthSafetyNotes: "Heavy equipment - crane and rigging required for transport",
      customerAddress: "1234 Automotive Pkwy, Testing Center, TC 12345",
      serviceType: "Automotive Equipment Calibration",
      technicalNotes: "Calibration completed successfully - all specs within tolerance",
      qualityAssurance: "Final QC passed - shipped with certificate package",
      template: "Dynamometer Calibration SAE.xlsx",
      originalLoc: "CL",
      destLoc: "CL",
      ts: "A",
      hotlist: "",
      jmPoNumber: "01567"
    }
  },
  {
    id: "441203",
    status: "Ready for Departure",
    customer: "Chemical Processing Inc",
    dueDate: "Dec 20, 2024",
    assignedTo: "Maria Rodriguez",
    location: "Chemical Lab - Room 302",
    equipmentType: "pH Meter Array",
    estimatedCost: "$2,350.00",
    actualCost: "$2,280.00",
    contactPerson: "Robert Lee",
    phone: "(555) 678-9013",
    email: "r.lee@chemprocessing.com",
    urgencyLevel: "Medium",
    completionPercentage: 100,
    division: "Lab",
    details: {
      modelNumber: "PH-900",
      labCode: "LAB-015",
      comments: "Multi-point pH calibration completed - ready for pickup",
      manufacturer: "HANNA",
      serialNumber: "SN890123",
      batch: "B2024-015",
      items: "6",
      purchase: "PO-2024-015",
      lots: "HA",
      createdDate: "11/18/2024",
      statusDate: "12/12/2024",
      lastModified: "12/15/2024",
      nextBy: "12/21/2024",
      priority: "Medium",
      custId: "CUST-015",
      custSn: "CHEM-SN-015",
      cartId: "CART-015",
      cartSn: "CSN-015",
      poNumber: "PO-2024-015",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/21/2024",
      submitted: "Yes",
      proofOfDelivery: "Ready",
      job: "C/C",
      action: "C/C",
      workDescription: "6-unit pH meter array calibration for chemical process monitoring",
      partsNeeded: ["Buffer Solutions", "Electrode Kit", "Storage Solution"],
      laborHours: "24.0",
      invoiceNumber: "INV-2024-0298",
      paymentStatus: "Paid",
      warrantyInfo: "1-year calibration warranty",
      certificationRequired: "NIST pH Standards Certificate",
      healthSafetyNotes: "Chemical handling protocols - proper disposal of buffer solutions",
      customerAddress: "5678 Chemical Ave, Process District, PD 23456",
      serviceType: "Chemical Analysis Calibration",
      technicalNotes: "All 6 units calibrated to ±0.01 pH accuracy - excellent results",
      qualityAssurance: "Complete calibration package ready - customer notified",
      template: "pH Meter Multi-Unit Calibration.xlsx",
      originalLoc: "HA",
      destLoc: "HA",
      ts: "C",
      hotlist: "",
      jmPoNumber: "12678"
    }
  },
  {
    id: "446759",
    status: "Cancelled",
    customer: "Defunct Manufacturing Co",
    dueDate: "Dec 10, 2024",
    assignedTo: "N/A",
    location: "N/A",
    equipmentType: "Vibration Analyzer",
    estimatedCost: "$1,200.00",
    actualCost: "$0.00",
    contactPerson: "N/A",
    phone: "N/A",
    email: "N/A",
    urgencyLevel: "Low",
    completionPercentage: 0,
    division: "Lab",
    details: {
      modelNumber: "VA-2000",
      labCode: "LAB-016",
      comments: "Work order cancelled - customer went out of business",
      manufacturer: "SKF",
      serialNumber: "SN901234",
      batch: "B2024-016",
      items: "2",
      purchase: "PO-2024-016",
      lots: "SK",
      createdDate: "11/22/2024",
      statusDate: "12/08/2024",
      lastModified: "12/08/2024",
      nextBy: "CANCELLED",
      priority: "Low",
      custId: "CUST-016",
      custSn: "DEF-SN-016",
      cartId: "CART-016",
      cartSn: "CSN-016",
      poNumber: "PO-2024-016",
      itemType: "SINGLE",
      operationType: "Cancelled",
      departureDate: "CANCELLED",
      submitted: "No",
      proofOfDelivery: "N/A",
      job: "CANCELLED",
      action: "CANCELLED",
      workDescription: "Vibration analysis equipment calibration - cancelled due to customer bankruptcy",
      partsNeeded: [],
      laborHours: "0.0",
      invoiceNumber: "CANCELLED",
      paymentStatus: "Cancelled",
      warrantyInfo: "N/A",
      certificationRequired: "N/A",
      healthSafetyNotes: "N/A",
      customerAddress: "N/A",
      serviceType: "Cancelled",
      technicalNotes: "Work order cancelled before start - customer bankruptcy filing",
      qualityAssurance: "N/A - work not performed",
      template: "N/A",
      originalLoc: "SK",
      destLoc: "SK",
      ts: "X",
      hotlist: "",
      jmPoNumber: "CANCELLED"
    }
  },
  {
    id: "452118",
    status: "Rotation",
    customer: "Defense Contractors United",
    dueDate: "Jan 05, 2025",
    assignedTo: "Colonel James Mitchell",
    location: "Secure Lab - Building Alpha",
    equipmentType: "Classified Test Equipment",
    estimatedCost: "$12,500.00",
    actualCost: "TBD",
    contactPerson: "Security Officer Thompson",
    phone: "(555) 789-0124",
    email: "s.thompson@defensecontractors.gov",
    urgencyLevel: "Critical",
    completionPercentage: 20,
    division: "ESL",
    details: {
      modelNumber: "CLASSIFIED",
      labCode: "LAB-017",
      comments: "Rotating equipment - classified project",
      manufacturer: "CLASSIFIED",
      serialNumber: "CLASSIFIED",
      batch: "B2024-017",
      items: "CLASSIFIED",
      purchase: "PO-2024-017",
      lots: "CL",
      createdDate: "12/01/2024",
      statusDate: "12/10/2024",
      lastModified: "12/15/2024",
      nextBy: "01/06/2025",
      priority: "Critical",
      custId: "CUST-017",
      custSn: "DEF-SN-017",
      cartId: "CART-017",
      cartSn: "CSN-017",
      poNumber: "PO-2024-017",
      itemType: "SINGLE",
      operationType: "Testing",
      departureDate: "01/06/2025",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "TEST",
      action: "TEST",
      workDescription: "[CLASSIFIED] - Defense equipment testing and validation",
      partsNeeded: ["[CLASSIFIED]"],
      laborHours: "CLASSIFIED",
      invoiceNumber: "TBD",
      paymentStatus: "Government Contract",
      warrantyInfo: "Per Government Contract",
      certificationRequired: "DoD Security Clearance Required",
      healthSafetyNotes: "CRITICAL: Security clearance required - authorized personnel only",
      customerAddress: "[CLASSIFIED]",
      serviceType: "Defense Equipment Testing",
      technicalNotes: "Rotation schedule established - security protocols in effect",
      qualityAssurance: "Security review in progress - clearance verification required",
      template: "Classified Testing Protocol.pdf",
      originalLoc: "CL",
      destLoc: "CL",
      ts: "SEC",
      hotlist: "Classified",
      jmPoNumber: "GOV-2024"
    }
  },
  {
    id: "457823",
    status: "Surplus Stock",
    customer: "Surplus Equipment Depot",
    dueDate: "Dec 31, 2024",
    assignedTo: "Inventory Team",
    location: "Warehouse - Section D",
    equipmentType: "Various Test Equipment",
    estimatedCost: "$0.00",
    actualCost: "$0.00",
    contactPerson: "Warehouse Manager",
    phone: "(555) 890-1235",
    email: "warehouse@surplusdepot.com",
    urgencyLevel: "Low",
    completionPercentage: 80,
    division: "Rental",
    details: {
      modelNumber: "VARIOUS",
      labCode: "LAB-018",
      comments: "Surplus equipment processing for disposal or sale",
      manufacturer: "VARIOUS",
      serialNumber: "MULTIPLE",
      batch: "B2024-018",
      items: "25",
      purchase: "SURPLUS",
      lots: "SU",
      createdDate: "10/01/2024",
      statusDate: "12/01/2024",
      lastModified: "12/15/2024",
      nextBy: "12/31/2024",
      priority: "Low",
      custId: "SURPLUS",
      custSn: "SUR-SN-018",
      cartId: "CART-018",
      cartSn: "CSN-018",
      poNumber: "SURPLUS",
      itemType: "SINGLE",
      operationType: "Inventory",
      departureDate: "12/31/2024",
      submitted: "N/A",
      proofOfDelivery: "N/A",
      job: "INVENTORY",
      action: "INVENTORY",
      workDescription: "Surplus equipment evaluation, cataloging, and preparation for disposal or resale",
      partsNeeded: ["Tags", "Inventory Sheets", "Storage Containers"],
      laborHours: "40.0",
      invoiceNumber: "N/A",
      paymentStatus: "Internal",
      warrantyInfo: "As-Is Condition",
      certificationRequired: "N/A",
      healthSafetyNotes: "Various equipment - assess each item individually",
      customerAddress: "Internal Warehouse Operations",
      serviceType: "Surplus Processing",
      technicalNotes: "80% of items cataloged - final evaluation in progress",
      qualityAssurance: "Items sorted by condition - disposal list prepared",
      template: "Surplus Equipment Inventory.xlsx",
      originalLoc: "SU",
      destLoc: "SU",
      ts: "I",
      hotlist: "",
      jmPoNumber: "SURPLUS"
    }
  },
  {
    id: "463547",
    status: "ME Review",
    customer: "Mechanical Engineering Corp",
    dueDate: "Jan 15, 2025",
    assignedTo: "Senior Engineer Roberts",
    location: "Engineering Review Room",
    equipmentType: "Stress Testing Machine",
    estimatedCost: "$6,200.00",
    actualCost: "TBD",
    contactPerson: "Chief Engineer Davis",
    phone: "(555) 901-2346",
    email: "c.davis@mechanicaleng.com",
    urgencyLevel: "High",
    completionPercentage: 10,
    division: "Lab",
    details: {
      modelNumber: "STM-3000",
      labCode: "LAB-019",
      comments: "Mechanical engineering review required before calibration",
      manufacturer: "INSTRON",
      serialNumber: "SN012345",
      batch: "B2024-019",
      items: "1",
      purchase: "PO-2024-019",
      lots: "IN",
      createdDate: "12/05/2024",
      statusDate: "12/15/2024",
      lastModified: "12/18/2024",
      nextBy: "01/16/2025",
      priority: "High",
      custId: "CUST-019",
      custSn: "MECH-SN-019",
      cartId: "CART-019",
      cartSn: "CSN-019",
      poNumber: "PO-2024-019",
      itemType: "SINGLE",
      operationType: "Review",
      departureDate: "01/16/2025",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "REVIEW",
      action: "REVIEW",
      workDescription: "Mechanical stress testing machine - engineering review of calibration procedures",
      partsNeeded: ["Engineering Drawings", "Specification Documents", "Test Plans"],
      laborHours: "TBD",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Pending",
      warrantyInfo: "TBD",
      certificationRequired: "ASTM Standards Compliance",
      healthSafetyNotes: "High force equipment - safety review required",
      customerAddress: "9012 Engineering Way, Technical Park, TP 34567",
      serviceType: "Engineering Review",
      technicalNotes: "ME review in progress - safety protocols under evaluation",
      qualityAssurance: "Engineering documentation review scheduled",
      template: "Stress Testing Machine Review.pdf",
      originalLoc: "IN",
      destLoc: "IN",
      ts: "ME",
      hotlist: "",
      jmPoNumber: "23789"
    }
  },
  {
    id: "469172",
    status: "Scheduled",
    customer: "Future Tech Solutions",
    dueDate: "Jan 20, 2025",
    assignedTo: "Planning Department",
    location: "TBD",
    equipmentType: "3D Coordinate Scanner",
    estimatedCost: "$4,800.00",
    actualCost: "TBD",
    contactPerson: "Project Manager Wilson",
    phone: "(555) 012-3457",
    email: "p.wilson@futuretech.com",
    urgencyLevel: "Medium",
    completionPercentage: 0,
    division: "Lab",
    details: {
      modelNumber: "3DS-5000",
      labCode: "LAB-020",
      comments: "Scheduled for January 2025 - awaiting equipment arrival",
      manufacturer: "FARO",
      serialNumber: "TBD",
      batch: "B2025-001",
      items: "1",
      purchase: "PO-2025-001",
      lots: "FA",
      createdDate: "12/10/2024",
      statusDate: "12/18/2024",
      lastModified: "12/20/2024",
      nextBy: "01/21/2025",
      priority: "Medium",
      custId: "CUST-020",
      custSn: "FUTURE-SN-020",
      cartId: "CART-020",
      cartSn: "CSN-020",
      poNumber: "PO-2025-001",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "01/21/2025",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "3D coordinate scanner calibration and accuracy verification for manufacturing inspection",
      partsNeeded: ["Calibration Spheres", "Reference Standards", "Software License"],
      laborHours: "25.0",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Approved",
      warrantyInfo: "1-year calibration warranty",
      certificationRequired: "ISO 10360 3D Scanner Certificate",
      healthSafetyNotes: "Laser safety protocols required - Class 2 laser system",
      customerAddress: "4567 Innovation Blvd, Future City, FC 45678",
      serviceType: "3D Metrology Calibration",
      technicalNotes: "Scheduled for January - equipment expected to arrive week of 1/15/25",
      qualityAssurance: "Pre-planning complete - calibration protocol reviewed",
      template: "3D Scanner Calibration ISO 10360.xlsx",
      originalLoc: "FA",
      destLoc: "FA",
      ts: "3D",
      hotlist: "",
      jmPoNumber: "34890"
    }
  },
  {
    id: "474896",
    status: "Waiting on Customer",
    customer: "Slow Response Industries",
    dueDate: "Dec 25, 2024",
    assignedTo: "Customer Service",
    location: "Customer Communication Desk",
    equipmentType: "Oscilloscope",
    estimatedCost: "$1,650.00",
    actualCost: "TBD",
    contactPerson: "Unresponsive Manager",
    phone: "(555) 123-4568",
    email: "slow@slowresponse.com",
    urgencyLevel: "Low",
    completionPercentage: 5,
    division: "ESL",
    details: {
      modelNumber: "OSC-4000",
      labCode: "LAB-021",
      comments: "Waiting on customer approval for repair quote - multiple follow-ups sent",
      manufacturer: "TEKTRONIX",
      serialNumber: "SN123456",
      batch: "B2024-021",
      items: "1",
      purchase: "PO-2024-021",
      lots: "TE",
      createdDate: "11/01/2024",
      statusDate: "11/15/2024",
      lastModified: "12/20/2024",
      nextBy: "12/26/2024",
      priority: "Low",
      custId: "CUST-021",
      custSn: "SLOW-SN-021",
      cartId: "CART-021",
      cartSn: "CSN-021",
      poNumber: "PO-2024-021",
      itemType: "SINGLE",
      operationType: "Repair",
      departureDate: "TBD",
      submitted: "Pending Customer",
      proofOfDelivery: "Pending",
      job: "REPAIR",
      action: "REPAIR",
      workDescription: "Digital oscilloscope repair - power supply replacement required",
      partsNeeded: ["Power Supply Module", "Cooling Fan", "Display Screen"],
      laborHours: "12.0",
      invoiceNumber: "TBD",
      paymentStatus: "Awaiting Customer Approval",
      warrantyInfo: "90-day repair warranty",
      certificationRequired: "Basic Calibration Certificate",
      healthSafetyNotes: "Standard electrical safety precautions",
      customerAddress: "7890 Delay Street, Slow City, SC 56789",
      serviceType: "Equipment Repair",
      technicalNotes: "Customer unresponsive to quote approval - 6 follow-up attempts made",
      qualityAssurance: "Repair quote prepared - awaiting customer decision",
      template: "Oscilloscope Repair Quote.pdf",
      originalLoc: "TE",
      destLoc: "TE",
      ts: "W",
      hotlist: "Customer Contact",
      jmPoNumber: "45601"
    }
  },
  {
    id: "412503",
    status: "Calibration Required",
    customer: "Solar Tech Solutions",
    dueDate: "Dec 15, 2024",
    assignedTo: "Rachel Kim",
    location: "Lab Building C - Room 105",
    equipmentType: "Solar Panel Tester",
    estimatedCost: "$850.00",
    actualCost: "$820.00",
    contactPerson: "David Park",
    phone: "(555) 789-0123",
    email: "d.park@solartech.com",
    urgencyLevel: "Medium",
    completionPercentage: 60,
    division: "ESL",
    details: {
      modelNumber: "SPT-2000",
      labCode: "LAB-026",
      comments: "Annual calibration of solar panel testing equipment",
      manufacturer: "SUNTECH",
      serialNumber: "SN789012",
      batch: "B2024-026",
      items: "2",
      purchase: "PO-2024-026",
      lots: "ST",
      createdDate: "11/15/2024",
      statusDate: "11/20/2024",
      lastModified: "11/23/2024",
      nextBy: "12/15/2024",
      priority: "Medium",
      custId: "CUST-026",
      custSn: "ST-SN-026",
      cartId: "CART-026",
      cartSn: "CSN-026",
      poNumber: "PO-2024-026",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/16/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Complete calibration of solar panel testing equipment including irradiance and temperature sensors",
      partsNeeded: ["Calibration Standards", "Reference Cells"],
      laborHours: "6",
      invoiceNumber: "INV-2024-026",
      paymentStatus: "Pending",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Handle with care - sensitive equipment",
      customerAddress: "789 Solar Drive, Energy City, EC 12345",
      serviceType: "Calibration",
      technicalNotes: "Check irradiance sensor calibration",
      qualityAssurance: "Equipment meets ISO 17025 standards",
      template: "Solar Equipment Cal.pdf",
      originalLoc: "ESL",
      destLoc: "ESL",
      ts: "W",
      hotlist: "Calibration Due",
      jmPoNumber: "47801"
    }
  },
  {
    id: "413867",
    status: "Quality Review",
    customer: "Automotive Testing Lab",
    dueDate: "Dec 18, 2024",
    assignedTo: "Kevin Zhang",
    location: "Lab Building D - Room 301",
    equipmentType: "Brake Force Tester",
    estimatedCost: "$1,800.00",
    actualCost: "$1,750.00",
    contactPerson: "Lisa Wang",
    phone: "(555) 890-1234",
    email: "l.wang@autotest.com",
    urgencyLevel: "High",
    completionPercentage: 85,
    division: "Lab",
    details: {
      modelNumber: "BFT-500",
      labCode: "LAB-027",
      comments: "Brake force tester repair and calibration",
      manufacturer: "AUTOTEST",
      serialNumber: "SN890123",
      batch: "B2024-027",
      items: "1",
      purchase: "PO-2024-027",
      lots: "AT",
      createdDate: "11/08/2024",
      statusDate: "11/24/2024",
      lastModified: "11/25/2024",
      nextBy: "12/18/2024",
      priority: "High",
      custId: "CUST-027",
      custSn: "AT-SN-027",
      cartId: "CART-027",
      cartSn: "CSN-027",
      poNumber: "PO-2024-027",
      itemType: "SINGLE",
      operationType: "Repair",
      departureDate: "12/19/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "R/R",
      action: "R/R",
      workDescription: "Repair hydraulic system and recalibrate force measurements",
      partsNeeded: ["Hydraulic Seals", "Pressure Transducer", "Calibration Weights"],
      laborHours: "12",
      invoiceNumber: "INV-2024-027",
      paymentStatus: "Pending",
      warrantyInfo: "6 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "High pressure system - safety protocols required",
      customerAddress: "456 Test Lane, Auto City, AC 67890",
      serviceType: "Repair & Calibration",
      technicalNotes: "Replace damaged hydraulic components",
      qualityAssurance: "Final testing in progress - awaiting QA approval",
      template: "Brake Tester Repair.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "W",
      hotlist: "QA Review",
      jmPoNumber: "48002"
    }
  },
  {
    id: "414925",
    status: "Waiting Parts",
    customer: "Marine Engineering Co",
    dueDate: "Jan 05, 2025",
    assignedTo: "Alex Thompson",
    location: "ESL Onsite - Marina Bay",
    equipmentType: "Marine Compass",
    estimatedCost: "$650.00",
    actualCost: "$0.00",
    contactPerson: "Captain Johnson",
    phone: "(555) 901-2345",
    email: "c.johnson@marineeng.com",
    urgencyLevel: "Medium",
    completionPercentage: 25,
    division: "ESL Onsite",
    details: {
      modelNumber: "MC-180",
      labCode: "LAB-028",
      comments: "Marine compass calibration and bearing adjustment",
      manufacturer: "MARINEX",
      serialNumber: "SN901234",
      batch: "B2024-028",
      items: "1",
      purchase: "PO-2024-028",
      lots: "MX",
      createdDate: "11/20/2024",
      statusDate: "11/22/2024",
      lastModified: "11/25/2024",
      nextBy: "01/05/2025",
      priority: "Medium",
      custId: "CUST-028",
      custSn: "MX-SN-028",
      cartId: "CART-028",
      cartSn: "CSN-028",
      poNumber: "PO-2024-028",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "01/08/2025",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Calibrate marine compass and adjust magnetic declination",
      partsNeeded: ["Compass Rose", "Bearing Assembly", "Calibration Tools"],
      laborHours: "4",
      invoiceNumber: "INV-2024-028",
      paymentStatus: "Pending",
      warrantyInfo: "24 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Marine environment - corrosion resistant materials required",
      customerAddress: "Marina Bay, Pier 12, Harbor City, HC 34567",
      serviceType: "Calibration",
      technicalNotes: "Waiting for specialized compass bearings",
      qualityAssurance: "Parts on order - expected delivery Dec 15",
      template: "Marine Compass Cal.pdf",
      originalLoc: "ESL",
      destLoc: "Marina",
      ts: "W",
      hotlist: "Parts Delay",
      jmPoNumber: "48203"
    }
  },
  {
    id: "415782",
    status: "Ready to Ship",
    customer: "Chemical Analysis Inc",
    dueDate: "Nov 28, 2024",
    assignedTo: "Dr. Sarah Lee",
    location: "Lab Building B - Room 150",
    equipmentType: "pH Meter",
    estimatedCost: "$450.00",
    actualCost: "$425.00",
    contactPerson: "Mark Stevens",
    phone: "(555) 012-3456",
    email: "m.stevens@chemanalysis.com",
    urgencyLevel: "Low",
    completionPercentage: 100,
    division: "Lab",
    details: {
      modelNumber: "PH-7000",
      labCode: "LAB-029",
      comments: "pH meter calibration completed successfully",
      manufacturer: "CHEMTECH",
      serialNumber: "SN012345",
      batch: "B2024-029",
      items: "2",
      purchase: "PO-2024-029",
      lots: "CT",
      createdDate: "11/10/2024",
      statusDate: "11/27/2024",
      lastModified: "11/27/2024",
      nextBy: "11/28/2024",
      priority: "Low",
      custId: "CUST-029",
      custSn: "CT-SN-029",
      cartId: "CART-029",
      cartSn: "CSN-029",
      poNumber: "PO-2024-029",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "11/28/2024",
      submitted: "Yes",
      proofOfDelivery: "Ready",
      job: "C/C",
      action: "C/C",
      workDescription: "Complete calibration of pH meters including buffer solution verification",
      partsNeeded: ["Buffer Solutions", "Electrode Cleaning Kit"],
      laborHours: "3",
      invoiceNumber: "INV-2024-029",
      paymentStatus: "Paid",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Chemical handling protocols followed",
      customerAddress: "123 Chemistry Blvd, Science Park, SP 45678",
      serviceType: "Calibration",
      technicalNotes: "All tests passed - ready for shipment",
      qualityAssurance: "Final QA completed - certificate issued",
      template: "pH Meter Calibration.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "C",
      hotlist: "Ready Ship",
      jmPoNumber: "48404"
    }
  },
  {
    id: "416340",
    status: "Customer Hold",
    customer: "Aerospace Components Ltd",
    dueDate: "Dec 20, 2024",
    assignedTo: "Jennifer Brown",
    location: "ESL Clean Room",
    equipmentType: "Vacuum Chamber",
    estimatedCost: "$2,200.00",
    actualCost: "$0.00",
    contactPerson: "Robert Taylor",
    phone: "(555) 123-4567",
    email: "r.taylor@aerocomp.com",
    urgencyLevel: "Critical",
    completionPercentage: 40,
    division: "ESL",
    details: {
      modelNumber: "VC-1000",
      labCode: "LAB-030",
      comments: "Vacuum chamber leak testing and seal replacement",
      manufacturer: "VACTECH",
      serialNumber: "SN123456",
      batch: "B2024-030",
      items: "1",
      purchase: "PO-2024-030",
      lots: "VT",
      createdDate: "11/05/2024",
      statusDate: "11/25/2024",
      lastModified: "11/26/2024",
      nextBy: "12/20/2024",
      priority: "Critical",
      custId: "CUST-030",
      custSn: "VT-SN-030",
      cartId: "CART-030",
      cartSn: "CSN-030",
      poNumber: "PO-2024-030",
      itemType: "SINGLE",
      operationType: "Repair",
      departureDate: "TBD",
      submitted: "Yes",
      proofOfDelivery: "Hold",
      job: "R/R",
      action: "R/R",
      workDescription: "Replace vacuum seals and perform leak testing for aerospace applications",
      partsNeeded: ["O-Ring Seals", "Vacuum Pump Oil", "Pressure Gauges"],
      laborHours: "16",
      invoiceNumber: "INV-2024-030",
      paymentStatus: "Hold",
      warrantyInfo: "18 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Clean room procedures required - aerospace grade components",
      customerAddress: "789 Aerospace Drive, Flight City, FC 56789",
      serviceType: "Repair",
      technicalNotes: "Customer requested design modification review",
      qualityAssurance: "Work suspended pending customer approval",
      template: "Vacuum Chamber Repair.pdf",
      originalLoc: "ESL",
      destLoc: "ESL",
      ts: "H",
      hotlist: "Customer Hold",
      jmPoNumber: "48605"
    }
  },
  {
    id: "417458",
    status: "In Progress",
    customer: "Power Generation Systems",
    dueDate: "Jan 10, 2025",
    assignedTo: "Michael Garcia",
    location: "ESL Onsite - Power Plant",
    equipmentType: "Generator Tester",
    estimatedCost: "$3,500.00",
    actualCost: "$0.00",
    contactPerson: "Susan Clark",
    phone: "(555) 234-5678",
    email: "s.clark@powersys.com",
    urgencyLevel: "High",
    completionPercentage: 50,
    division: "ESL Onsite",
    details: {
      modelNumber: "GT-5000",
      labCode: "LAB-031",
      comments: "Generator load testing equipment calibration",
      manufacturer: "POWERTEST",
      serialNumber: "SN234567",
      batch: "B2024-031",
      items: "3",
      purchase: "PO-2024-031",
      lots: "PT",
      createdDate: "11/18/2024",
      statusDate: "11/26/2024",
      lastModified: "11/27/2024",
      nextBy: "01/10/2025",
      priority: "High",
      custId: "CUST-031",
      custSn: "PT-SN-031",
      cartId: "CART-031",
      cartSn: "CSN-031",
      poNumber: "PO-2024-031",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "01/12/2025",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Calibration of generator load testing equipment including power analyzers",
      partsNeeded: ["Current Shunts", "Voltage Dividers", "Load Resistors"],
      laborHours: "24",
      invoiceNumber: "INV-2024-031",
      paymentStatus: "Pending",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "High voltage equipment - certified technicians only",
      customerAddress: "Power Plant Road, Energy Valley, EV 67890",
      serviceType: "Calibration",
      technicalNotes: "50% complete - power analyzer calibration in progress",
      qualityAssurance: "Preliminary testing completed successfully",
      template: "Generator Tester Cal.pdf",
      originalLoc: "ESL",
      destLoc: "PowerPlant",
      ts: "W",
      hotlist: "High Voltage",
      jmPoNumber: "48806"
    }
  },
  {
    id: "418693",
    status: "Final Testing",
    customer: "Optical Instruments Corp",
    dueDate: "Dec 05, 2024",
    assignedTo: "Dr. Emma Wilson",
    location: "Lab Building A - Optical Lab",
    equipmentType: "Laser Interferometer",
    estimatedCost: "$1,950.00",
    actualCost: "$1,920.00",
    contactPerson: "James Martinez",
    phone: "(555) 345-6789",
    email: "j.martinez@optical.com",
    urgencyLevel: "Medium",
    completionPercentage: 95,
    division: "Lab",
    details: {
      modelNumber: "LI-2500",
      labCode: "LAB-032",
      comments: "Laser interferometer precision calibration and alignment",
      manufacturer: "OPTICALTECH",
      serialNumber: "SN345678",
      batch: "B2024-032",
      items: "1",
      purchase: "PO-2024-032",
      lots: "OT",
      createdDate: "11/12/2024",
      statusDate: "11/28/2024",
      lastModified: "11/28/2024",
      nextBy: "12/05/2024",
      priority: "Medium",
      custId: "CUST-032",
      custSn: "OT-SN-032",
      cartId: "CART-032",
      cartSn: "CSN-032",
      poNumber: "PO-2024-032",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/06/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Precision alignment and calibration of laser interferometer for nanometer measurements",
      partsNeeded: ["Optical Mirrors", "Laser Alignment Tools", "Calibration Standards"],
      laborHours: "14",
      invoiceNumber: "INV-2024-032",
      paymentStatus: "Pending",
      warrantyInfo: "18 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Laser safety protocols - protective equipment required",
      customerAddress: "456 Optical Avenue, Precision City, PC 78901",
      serviceType: "Calibration",
      technicalNotes: "Final stability testing in progress",
      qualityAssurance: "95% complete - final performance verification",
      template: "Laser Interferometer Cal.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "W",
      hotlist: "Final Test",
      jmPoNumber: "49007"
    }
  },
  {
    id: "419837",
    status: "Expedited",
    customer: "Emergency Services Division",
    dueDate: "Nov 29, 2024",
    assignedTo: "Carlos Rodriguez",
    location: "ESL Mobile Unit",
    equipmentType: "Gas Detector",
    estimatedCost: "$750.00",
    actualCost: "$730.00",
    contactPerson: "Chief Williams",
    phone: "(555) 456-7890",
    email: "chief.williams@emergency.gov",
    urgencyLevel: "Critical",
    completionPercentage: 80,
    division: "ESL Onsite",
    details: {
      modelNumber: "GD-400",
      labCode: "LAB-033",
      comments: "Emergency gas detector calibration - expedited service",
      manufacturer: "GASTECH",
      serialNumber: "SN456789",
      batch: "B2024-033",
      items: "4",
      purchase: "PO-2024-033",
      lots: "GT",
      createdDate: "11/25/2024",
      statusDate: "11/28/2024",
      lastModified: "11/28/2024",
      nextBy: "11/29/2024",
      priority: "Critical",
      custId: "CUST-033",
      custSn: "GT-SN-033",
      cartId: "CART-033",
      cartSn: "CSN-033",
      poNumber: "PO-2024-033",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "11/29/2024",
      submitted: "Yes",
      proofOfDelivery: "Expedited",
      job: "C/C",
      action: "C/C",
      workDescription: "Emergency calibration of gas detection equipment for first responders",
      partsNeeded: ["Calibration Gas", "Sensor Filters", "Battery Pack"],
      laborHours: "8",
      invoiceNumber: "INV-2024-033",
      paymentStatus: "Priority",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Hazardous gas calibration - safety protocols critical",
      customerAddress: "Emergency Services HQ, Safety Boulevard, SB 89012",
      serviceType: "Emergency Calibration",
      technicalNotes: "80% complete - final sensor verification",
      qualityAssurance: "Expedited QA process - priority completion",
      template: "Gas Detector Emergency Cal.pdf",
      originalLoc: "ESL",
      destLoc: "Emergency",
      ts: "E",
      hotlist: "Emergency",
      jmPoNumber: "49208"
    }
  },
  {
    id: "420154",
    status: "Needs Approval",
    customer: "Textile Manufacturing Inc",
    dueDate: "Dec 22, 2024",
    assignedTo: "Lisa Chen",
    location: "Lab Building C - Textile Lab",
    equipmentType: "Tension Tester",
    estimatedCost: "$1,100.00",
    actualCost: "$0.00",
    contactPerson: "Angela Davis",
    phone: "(555) 567-8901",
    email: "a.davis@textilemanuf.com",
    urgencyLevel: "Medium",
    completionPercentage: 30,
    division: "Lab",
    details: {
      modelNumber: "TT-300",
      labCode: "LAB-034",
      comments: "Textile tension tester requires component replacement approval",
      manufacturer: "TEXTILETECH",
      serialNumber: "SN567890",
      batch: "B2024-034",
      items: "2",
      purchase: "PO-2024-034",
      lots: "TT",
      createdDate: "11/15/2024",
      statusDate: "11/26/2024",
      lastModified: "11/27/2024",
      nextBy: "12/22/2024",
      priority: "Medium",
      custId: "CUST-034",
      custSn: "TT-SN-034",
      cartId: "CART-034",
      cartSn: "CSN-034",
      poNumber: "PO-2024-034",
      itemType: "SINGLE",
      operationType: "Repair",
      departureDate: "TBD",
      submitted: "Yes",
      proofOfDelivery: "Hold",
      job: "R/R",
      action: "R/R",
      workDescription: "Replace worn tension measurement components and recalibrate",
      partsNeeded: ["Load Cells", "Tension Springs", "Digital Display Unit"],
      laborHours: "10",
      invoiceNumber: "INV-2024-034",
      paymentStatus: "Hold",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Mechanical tension equipment - proper safety guards required",
      customerAddress: "789 Textile Row, Fabric City, FC 90123",
      serviceType: "Repair & Calibration",
      technicalNotes: "Waiting customer approval for component replacement",
      qualityAssurance: "Repair estimate prepared - awaiting authorization",
      template: "Tension Tester Repair Quote.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "H",
      hotlist: "Approval Needed",
      jmPoNumber: "49409"
    }
  },
  {
    id: "421476",
    status: "Incoming",
    customer: "Research University Lab",
    dueDate: "Jan 15, 2025",
    assignedTo: "TBD",
    location: "Receiving Dock",
    equipmentType: "Microscope",
    estimatedCost: "$900.00",
    actualCost: "$0.00",
    contactPerson: "Prof. Thompson",
    phone: "(555) 678-9012",
    email: "prof.thompson@university.edu",
    urgencyLevel: "Low",
    completionPercentage: 0,
    division: "Lab",
    details: {
      modelNumber: "MS-1200",
      labCode: "LAB-035",
      comments: "Microscope calibration scheduled for next month",
      manufacturer: "MICROTECH",
      serialNumber: "SN678901",
      batch: "B2024-035",
      items: "1",
      purchase: "PO-2024-035",
      lots: "MT",
      createdDate: "11/28/2024",
      statusDate: "11/28/2024",
      lastModified: "11/28/2024",
      nextBy: "01/15/2025",
      priority: "Low",
      custId: "CUST-035",
      custSn: "MT-SN-035",
      cartId: "CART-035",
      cartSn: "CSN-035",
      poNumber: "PO-2024-035",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "01/18/2025",
      submitted: "No",
      proofOfDelivery: "Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "Optical microscope calibration including stage micrometer verification",
      partsNeeded: ["Stage Micrometer", "Objective Lenses", "Light Source"],
      laborHours: "6",
      invoiceNumber: "INV-2024-035",
      paymentStatus: "Pending",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Optical equipment - handle with care",
      customerAddress: "University Campus, Research Building 5, UC 01234",
      serviceType: "Calibration",
      technicalNotes: "Equipment scheduled for receipt next week",
      qualityAssurance: "Standard calibration procedures will apply",
      template: "Microscope Calibration.pdf",
      originalLoc: "REC",
      destLoc: "LAB",
      ts: "P",
      hotlist: "Scheduled",
      jmPoNumber: "49610"
    }
  },
  {
    id: "422839",
    status: "Parts Ordered",
    customer: "Industrial Automation Co",
    dueDate: "Dec 28, 2024",
    assignedTo: "Robert Kim",
    location: "ESL Workshop",
    equipmentType: "Servo Motor Tester",
    estimatedCost: "$1,650.00",
    actualCost: "$0.00",
    contactPerson: "Mark Anderson",
    phone: "(555) 789-0123",
    email: "m.anderson@automation.com",
    urgencyLevel: "High",
    completionPercentage: 20,
    division: "ESL",
    details: {
      modelNumber: "SMT-800",
      labCode: "LAB-036",
      comments: "Servo motor tester requires encoder replacement",
      manufacturer: "SERVOTECH",
      serialNumber: "SN789012",
      batch: "B2024-036",
      items: "1",
      purchase: "PO-2024-036",
      lots: "ST",
      createdDate: "11/20/2024",
      statusDate: "11/27/2024",
      lastModified: "11/28/2024",
      nextBy: "12/28/2024",
      priority: "High",
      custId: "CUST-036",
      custSn: "ST-SN-036",
      cartId: "CART-036",
      cartSn: "CSN-036",
      poNumber: "PO-2024-036",
      itemType: "SINGLE",
      operationType: "Repair",
      departureDate: "12/30/2024",
      submitted: "Yes",
      proofOfDelivery: "Pending",
      job: "R/R",
      action: "R/R",
      workDescription: "Replace defective encoder and calibrate servo motor testing parameters",
      partsNeeded: ["Rotary Encoder", "Control Board", "Connector Cables"],
      laborHours: "12",
      invoiceNumber: "INV-2024-036",
      paymentStatus: "Pending",
      warrantyInfo: "18 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "High-speed rotating equipment - safety shields required",
      customerAddress: "456 Automation Drive, Industry Park, IP 12345",
      serviceType: "Repair & Calibration",
      technicalNotes: "Encoder parts ordered - expected delivery Dec 10",
      qualityAssurance: "Waiting for parts arrival to proceed",
      template: "Servo Motor Tester Repair.pdf",
      originalLoc: "ESL",
      destLoc: "ESL",
      ts: "W",
      hotlist: "Parts ETA",
      jmPoNumber: "49811"
    }
  },
  {
    id: "423517",
    status: "Completed",
    customer: "Food Safety Laboratory",
    dueDate: "Nov 30, 2024",
    assignedTo: "Dr. Patricia Lee",
    location: "Lab Building B - Food Lab",
    equipmentType: "Thermometer Set",
    estimatedCost: "$320.00",
    actualCost: "$315.00",
    contactPerson: "John Miller",
    phone: "(555) 890-1234",
    email: "j.miller@foodsafety.com",
    urgencyLevel: "Low",
    completionPercentage: 100,
    division: "Lab",
    details: {
      modelNumber: "TS-150",
      labCode: "LAB-037",
      comments: "Food thermometer set calibration completed successfully",
      manufacturer: "FOODTECH",
      serialNumber: "SN890123",
      batch: "B2024-037",
      items: "5",
      purchase: "PO-2024-037",
      lots: "FT",
      createdDate: "11/18/2024",
      statusDate: "11/29/2024",
      lastModified: "11/29/2024",
      nextBy: "11/30/2024",
      priority: "Low",
      custId: "CUST-037",
      custSn: "FT-SN-037",
      cartId: "CART-037",
      cartSn: "CSN-037",
      poNumber: "PO-2024-037",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "11/30/2024",
      submitted: "Yes",
      proofOfDelivery: "Complete",
      job: "C/C",
      action: "C/C",
      workDescription: "Complete calibration of food safety thermometer set including ice point and boiling point verification",
      partsNeeded: ["Calibration Bath", "Reference Standards"],
      laborHours: "4",
      invoiceNumber: "INV-2024-037",
      paymentStatus: "Paid",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Food grade materials - sanitization protocols followed",
      customerAddress: "123 Food Safety Drive, Health City, HC 23456",
      serviceType: "Calibration",
      technicalNotes: "All thermometers passed calibration within specifications",
      qualityAssurance: "Certificate of calibration issued - ready for pickup",
      template: "Food Thermometer Cal.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "C",
      hotlist: "Complete",
      jmPoNumber: "50012"
    }
  },
  {
    id: "424682",
    status: "Quote Requested",
    customer: "Environmental Monitoring Inc",
    dueDate: "Dec 10, 2024",
    assignedTo: "Amanda Wilson",
    location: "Lab Building A - Environmental Lab",
    equipmentType: "Air Quality Monitor",
    estimatedCost: "$TBD",
    actualCost: "$0.00",
    contactPerson: "Steve Johnson",
    phone: "(555) 901-2345",
    email: "s.johnson@enviromonitor.com",
    urgencyLevel: "Medium",
    completionPercentage: 10,
    division: "ESL",
    details: {
      modelNumber: "AQM-600",
      labCode: "LAB-038",
      comments: "Air quality monitor needs sensor replacement - quote requested",
      manufacturer: "ENVIROTECH",
      serialNumber: "SN901234",
      batch: "B2024-038",
      items: "3",
      purchase: "PO-2024-038",
      lots: "ET",
      createdDate: "11/25/2024",
      statusDate: "11/28/2024",
      lastModified: "11/28/2024",
      nextBy: "12/10/2024",
      priority: "Medium",
      custId: "CUST-038",
      custSn: "ET-SN-038",
      cartId: "CART-038",
      cartSn: "CSN-038",
      poNumber: "PO-2024-038",
      itemType: "SINGLE",
      operationType: "Repair",
      departureDate: "TBD",
      submitted: "Yes",
      proofOfDelivery: "Quote",
      job: "R/R",
      action: "R/R",
      workDescription: "Replace air quality sensors and recalibrate monitoring system",
      partsNeeded: ["PM2.5 Sensor", "CO2 Sensor", "Humidity Sensor"],
      laborHours: "TBD",
      invoiceNumber: "INV-2024-038",
      paymentStatus: "Quote",
      warrantyInfo: "TBD",
      certificationRequired: "Yes",
      healthSafetyNotes: "Environmental monitoring equipment - clean room assembly required",
      customerAddress: "789 Environmental Way, Clean Air City, CA 34567",
      serviceType: "Repair & Calibration",
      technicalNotes: "Initial assessment complete - preparing repair quote",
      qualityAssurance: "Quote preparation in progress",
      template: "Air Quality Monitor Quote.pdf",
      originalLoc: "ESL",
      destLoc: "ESL",
      ts: "Q",
      hotlist: "Quote Prep",
      jmPoNumber: "50213"
    }
  },
  {
    id: "425948",
    status: "Rework Required",
    customer: "Precision Manufacturing Corp",
    dueDate: "Jan 08, 2025",
    assignedTo: "Daniel Martinez",
    location: "Lab Building D - Precision Lab",
    equipmentType: "Coordinate Measuring Machine",
    estimatedCost: "$2,800.00",
    actualCost: "$1,400.00",
    contactPerson: "Karen White",
    phone: "(555) 012-3456",
    email: "k.white@precisionmanuf.com",
    urgencyLevel: "High",
    completionPercentage: 70,
    division: "Lab",
    details: {
      modelNumber: "CMM-1500",
      labCode: "LAB-039",
      comments: "CMM calibration failed final inspection - rework required",
      manufacturer: "PRECISIONTECH",
      serialNumber: "SN012345",
      batch: "B2024-039",
      items: "1",
      purchase: "PO-2024-039",
      lots: "PT",
      createdDate: "11/10/2024",
      statusDate: "11/28/2024",
      lastModified: "11/28/2024",
      nextBy: "01/08/2025",
      priority: "High",
      custId: "CUST-039",
      custSn: "PT-SN-039",
      cartId: "CART-039",
      cartSn: "CSN-039",
      poNumber: "PO-2024-039",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "01/10/2025",
      submitted: "Yes",
      proofOfDelivery: "Rework",
      job: "C/C",
      action: "C/C",
      workDescription: "Recalibrate coordinate measuring machine - accuracy issues detected",
      partsNeeded: ["Calibration Spheres", "Precision Blocks", "Probe Tips"],
      laborHours: "20",
      invoiceNumber: "INV-2024-039",
      paymentStatus: "Pending",
      warrantyInfo: "18 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Precision equipment - temperature controlled environment required",
      customerAddress: "456 Precision Lane, Accuracy City, AC 45678",
      serviceType: "Calibration Rework",
      technicalNotes: "Probe accuracy out of specification - investigating root cause",
      qualityAssurance: "Failed final QA - rework plan developed",
      template: "CMM Calibration Rework.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "R",
      hotlist: "Rework",
      jmPoNumber: "50414"
    }
  },
  {
    id: "426305",
    status: "Documentation Review",
    customer: "Pharmaceutical Testing Lab",
    dueDate: "Dec 12, 2024",
    assignedTo: "Dr. Michelle Chang",
    location: "Lab Building B - Pharma Lab",
    equipmentType: "HPLC System",
    estimatedCost: "$1,750.00",
    actualCost: "$1,720.00",
    contactPerson: "Brian Thompson",
    phone: "(555) 123-4567",
    email: "b.thompson@pharmatest.com",
    urgencyLevel: "Medium",
    completionPercentage: 90,
    division: "Lab",
    details: {
      modelNumber: "HPLC-3000",
      labCode: "LAB-040",
      comments: "HPLC system calibration complete - documentation under review",
      manufacturer: "CHROMATECH",
      serialNumber: "SN123456",
      batch: "B2024-040",
      items: "2",
      purchase: "PO-2024-040",
      lots: "CT",
      createdDate: "11/08/2024",
      statusDate: "11/28/2024",
      lastModified: "11/29/2024",
      nextBy: "12/12/2024",
      priority: "Medium",
      custId: "CUST-040",
      custSn: "CT-SN-040",
      cartId: "CART-040",
      cartSn: "CSN-040",
      poNumber: "PO-2024-040",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/13/2024",
      submitted: "Yes",
      proofOfDelivery: "Documentation",
      job: "C/C",
      action: "C/C",
      workDescription: "Complete HPLC system calibration including detector and pump verification",
      partsNeeded: ["Mobile Phase", "Column Standards", "Detector Lamps"],
      laborHours: "16",
      invoiceNumber: "INV-2024-040",
      paymentStatus: "Pending",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Chemical handling - MSDS protocols followed",
      customerAddress: "123 Pharmaceutical Blvd, Drug City, DC 56789",
      serviceType: "Calibration",
      technicalNotes: "Calibration complete - finalizing documentation package",
      qualityAssurance: "QA documentation review in progress",
      template: "HPLC Calibration Report.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "D",
      hotlist: "Doc Review",
      jmPoNumber: "50615"
    }
  },
  {
    id: "427681",
    status: "Shipping Prep",
    customer: "Quality Control Services",
    dueDate: "Dec 02, 2024",
    assignedTo: "Sandra Lopez",
    location: "Shipping Department",
    equipmentType: "Balance Scale Set",
    estimatedCost: "$580.00",
    actualCost: "$565.00",
    contactPerson: "Michael Brown",
    phone: "(555) 234-5678",
    email: "m.brown@qcservices.com",
    urgencyLevel: "Low",
    completionPercentage: 98,
    division: "Lab",
    details: {
      modelNumber: "BS-250",
      labCode: "LAB-041",
      comments: "Balance scale calibration complete - preparing for shipment",
      manufacturer: "SCALETECH",
      serialNumber: "SN234567",
      batch: "B2024-041",
      items: "3",
      purchase: "PO-2024-041",
      lots: "ST",
      createdDate: "11/15/2024",
      statusDate: "12/01/2024",
      lastModified: "12/01/2024",
      nextBy: "12/02/2024",
      priority: "Low",
      custId: "CUST-041",
      custSn: "ST-SN-041",
      cartId: "CART-041",
      cartSn: "CSN-041",
      poNumber: "PO-2024-041",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/02/2024",
      submitted: "Yes",
      proofOfDelivery: "Shipping",
      job: "C/C",
      action: "C/C",
      workDescription: "Calibration of analytical balance scales including linearity and repeatability testing",
      partsNeeded: ["Calibration Weights", "Anti-Static Kit"],
      laborHours: "5",
      invoiceNumber: "INV-2024-041",
      paymentStatus: "Paid",
      warrantyInfo: "12 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Precision equipment - anti-vibration packaging required",
      customerAddress: "789 Quality Drive, Control City, CC 67890",
      serviceType: "Calibration",
      technicalNotes: "All scales calibrated within specifications - ready to ship",
      qualityAssurance: "Final packaging and shipping documentation prepared",
      template: "Balance Scale Calibration.pdf",
      originalLoc: "LAB",
      destLoc: "SHIP",
      ts: "S",
      hotlist: "Ship Ready",
      jmPoNumber: "50816"
    }
  },
  {
    id: "428945",
    status: "Incoming",
    customer: "Global Manufacturing Inc",
    dueDate: "Dec 15, 2024",
    assignedTo: "Patricia Kim",
    location: "Receiving Department",
    equipmentType: "Ultrasonic Flow Meter",
    estimatedCost: "$3,200.00",
    actualCost: "TBD",
    contactPerson: "Robert Chen",
    phone: "(555) 345-6789",
    email: "r.chen@globalmanuf.com",
    urgencyLevel: "Medium",
    completionPercentage: 5,
    division: "Rental",
    details: {
      modelNumber: "UFM-900",
      labCode: "LAB-042",
      comments: "New ultrasonic flow meter received for calibration",
      manufacturer: "FLOWTECH",
      serialNumber: "SN345678",
      batch: "B2024-042",
      items: "1",
      purchase: "PO-2024-042",
      lots: "FT",
      createdDate: "12/01/2024",
      statusDate: "12/01/2024",
      lastModified: "12/01/2024",
      nextBy: "12/15/2024",
      priority: "Medium",
      custId: "CUST-042",
      custSn: "FT-SN-042",
      cartId: "CART-042",
      cartSn: "CSN-042",
      poNumber: "PO-2024-042",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/16/2024",
      submitted: "Yes",
      proofOfDelivery: "Incoming",
      job: "C/C",
      action: "C/C",
      workDescription: "Ultrasonic flow meter calibration for petroleum pipeline monitoring",
      partsNeeded: ["Flow Standards", "Coupling Gel"],
      laborHours: "12",
      invoiceNumber: "TBD",
      paymentStatus: "Pending",
      warrantyInfo: "24 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Pipeline equipment - high pressure safety protocols required",
      customerAddress: "321 Pipeline Road, Flow City, FC 32109",
      serviceType: "Flow Calibration",
      technicalNotes: "Equipment received - initial inspection pending",
      qualityAssurance: "Incoming inspection scheduled",
      template: "Ultrasonic Flow Meter.pdf",
      originalLoc: "REC",
      destLoc: "LAB",
      ts: "I",
      hotlist: "",
      jmPoNumber: "50917"
    }
  },
  {
    id: "429823",
    status: "Parts Ordered",
    customer: "Automotive Testing Corp",
    dueDate: "Dec 20, 2024",
    assignedTo: "Kevin Zhang",
    location: "Lab Building C - Automotive Lab",
    equipmentType: "Engine Dynamometer",
    estimatedCost: "$4,500.00",
    actualCost: "TBD",
    contactPerson: "Lisa Anderson",
    phone: "(555) 456-7890",
    email: "l.anderson@autotest.com",
    urgencyLevel: "High",
    completionPercentage: 25,
    division: "ESL Onsite",
    details: {
      modelNumber: "EDYN-2000",
      labCode: "LAB-043",
      comments: "Engine dynamometer calibration - awaiting torque sensor replacement parts",
      manufacturer: "DYNOTECH",
      serialNumber: "SN456789",
      batch: "B2024-043",
      items: "1",
      purchase: "PO-2024-043",
      lots: "DT",
      createdDate: "11/20/2024",
      statusDate: "11/28/2024",
      lastModified: "12/01/2024",
      nextBy: "12/20/2024",
      priority: "High",
      custId: "CUST-043",
      custSn: "DT-SN-043",
      cartId: "CART-043",
      cartSn: "CSN-043",
      poNumber: "PO-2024-043",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/21/2024",
      submitted: "Yes",
      proofOfDelivery: "Parts Pending",
      job: "C/C",
      action: "C/C",
      workDescription: "High-performance engine dynamometer calibration for automotive testing",
      partsNeeded: ["Torque Sensor", "Load Cell", "RPM Sensor"],
      laborHours: "24",
      invoiceNumber: "TBD",
      paymentStatus: "Pending",
      warrantyInfo: "36 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "High-power rotating equipment - safety lockout procedures mandatory",
      customerAddress: "654 Automotive Way, Test Valley, TV 65432",
      serviceType: "Dynamometer Calibration",
      technicalNotes: "Original torque sensor failed calibration - replacement ordered",
      qualityAssurance: "Waiting for parts delivery to resume work",
      template: "Engine Dynamometer.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "P",
      hotlist: "Parts",
      jmPoNumber: "51018"
    }
  },
  {
    id: "430567",
    status: "Quote Requested",
    customer: "Chemical Analysis Lab",
    dueDate: "Dec 18, 2024",
    assignedTo: "Amanda Foster",
    location: "Lab Building A - Chemical Lab",
    equipmentType: "Gas Chromatograph",
    estimatedCost: "TBD",
    actualCost: "TBD",
    contactPerson: "Mark Wilson",
    phone: "(555) 567-8901",
    email: "m.wilson@chemlabs.com",
    urgencyLevel: "Medium",
    completionPercentage: 10,
    division: "Lab",
    details: {
      modelNumber: "GC-5000",
      labCode: "LAB-044",
      comments: "Gas chromatograph requires extensive repairs - customer quote requested",
      manufacturer: "CHROMALAB",
      serialNumber: "SN567890",
      batch: "B2024-044",
      items: "1",
      purchase: "PO-2024-044",
      lots: "CL",
      createdDate: "11/25/2024",
      statusDate: "11/30/2024",
      lastModified: "12/01/2024",
      nextBy: "12/18/2024",
      priority: "Medium",
      custId: "CUST-044",
      custSn: "CL-SN-044",
      cartId: "CART-044",
      cartSn: "CSN-044",
      poNumber: "PO-2024-044",
      itemType: "SINGLE",
      operationType: "Repair",
      departureDate: "TBD",
      submitted: "Yes",
      proofOfDelivery: "Quote Pending",
      job: "R/R",
      action: "R/R",
      workDescription: "Gas chromatograph repair - multiple components require replacement",
      partsNeeded: ["Column Heater", "Detector Assembly", "Injection Port"],
      laborHours: "TBD",
      invoiceNumber: "TBD",
      paymentStatus: "Quote Pending",
      warrantyInfo: "TBD",
      certificationRequired: "Yes",
      healthSafetyNotes: "Chemical analysis equipment - proper ventilation and PPE required",
      customerAddress: "987 Chemistry Lane, Lab City, LC 98765",
      serviceType: "Repair & Calibration",
      technicalNotes: "Extensive damage found during initial inspection - quote being prepared",
      qualityAssurance: "Quote approval required before proceeding",
      template: "Gas Chromatograph Repair.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "Q",
      hotlist: "Quote",
      jmPoNumber: "51119"
    }
  },
  {
    id: "431204",
    status: "Rework Required",
    customer: "Precision Instruments Ltd",
    dueDate: "Dec 22, 2024",
    assignedTo: "Carlos Rodriguez",
    location: "Lab Building E - Precision Lab",
    equipmentType: "Laser Interferometer",
    estimatedCost: "$2,100.00",
    actualCost: "$1,850.00",
    contactPerson: "Jennifer Davis",
    phone: "(555) 678-9012",
    email: "j.davis@precisioninst.com",
    urgencyLevel: "High",
    completionPercentage: 75,
    division: "Lab",
    details: {
      modelNumber: "LI-3000",
      labCode: "LAB-045",
      comments: "Laser interferometer failed final accuracy test - rework in progress",
      manufacturer: "LASERTECH",
      serialNumber: "SN678901",
      batch: "B2024-045",
      items: "1",
      purchase: "PO-2024-045",
      lots: "LT",
      createdDate: "11/12/2024",
      statusDate: "11/29/2024",
      lastModified: "12/02/2024",
      nextBy: "12/22/2024",
      priority: "High",
      custId: "CUST-045",
      custSn: "LT-SN-045",
      cartId: "CART-045",
      cartSn: "CSN-045",
      poNumber: "PO-2024-045",
      itemType: "SINGLE",
      operationType: "Calibration",
      departureDate: "12/23/2024",
      submitted: "Yes",
      proofOfDelivery: "Rework",
      job: "C/C",
      action: "C/C",
      workDescription: "High-precision laser interferometer calibration for dimensional measurements",
      partsNeeded: ["Reference Mirror", "Beam Splitter", "Detector Assembly"],
      laborHours: "18",
      invoiceNumber: "INV-2024-045",
      paymentStatus: "Pending",
      warrantyInfo: "24 months",
      certificationRequired: "Yes",
      healthSafetyNotes: "Class 2 laser - eye protection required at all times",
      customerAddress: "147 Precision Blvd, Measure City, MC 14725",
      serviceType: "Precision Calibration",
      technicalNotes: "Beam alignment issues detected - optical components being adjusted",
      qualityAssurance: "Rework plan approved - targeting completion by due date",
      template: "Laser Interferometer.pdf",
      originalLoc: "LAB",
      destLoc: "LAB",
      ts: "R",
      hotlist: "Rework",
      jmPoNumber: "51220"
    }
  }
];

const mockWorkOrderBatches: WorkOrderBatch[] = [
  {
    id: "1",
    woBatch: "383727",
    acctNumber: "13058.06",
    srNumber: "SR2455",
    customerName: "Deutsche Windtechnik Inc",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 1,
    lastCommentDate: "08/10/2023",
    lastComment: "Wait Cust Followup Date changed from 8/9/2023 to 8...",
    minNeedByDate: "09/24/2021",
    minFollowUpDate: "08/11/2023"
  },
  {
    id: "2",
    woBatch: "390118",
    acctNumber: "6962.01",
    srNumber: "SR1820",
    customerName: "Colonial Pipeline",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 10,
    lastCommentDate: "08/09/2023",
    lastComment: "PO Change Order 9524 sent to tammypatt@jmtest.com...",
    minNeedByDate: "12/20/2022",
    minFollowUpDate: "08/11/2023"
  },
  {
    id: "3",
    woBatch: "452463",
    acctNumber: "6962.01",
    srNumber: "SR1820",
    customerName: "Colonial Pipeline",
    totalLabOpen: 1,
    totalArCount: 0,
    totalCount: 2,
    lastCommentDate: "08/09/2023",
    lastComment: "PO Change Order 9525 sent to bhavard@colpipe.com...",
    minNeedByDate: "06/23/2023",
    minFollowUpDate: "08/11/2023"
  },
  {
    id: "4",
    woBatch: "393015",
    acctNumber: "7412.06",
    srNumber: "",
    customerName: "Burns & McDonnell",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 6,
    lastCommentDate: "08/11/2023",
    lastComment: "Wait Cust Followup Date changed from 8/10/2022 to...",
    minNeedByDate: "01/17/2022",
    minFollowUpDate: "08/14/2023"
  },
  {
    id: "5",
    woBatch: "441228",
    acctNumber: "2577.50",
    srNumber: "SR2425",
    customerName: "Energy Transfer",
    totalLabOpen: 1,
    totalArCount: 0,
    totalCount: 2,
    lastCommentDate: "08/10/2023",
    lastComment: "WAITING ON CUSTOMER: (Awaiting Quote Approval)",
    minNeedByDate: "03/20/2023",
    minFollowUpDate: "08/14/2023"
  },
  {
    id: "6",
    woBatch: "452817",
    acctNumber: "6441.05",
    srNumber: "SR1299",
    customerName: "Blue Cube Operations LLC",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 3,
    lastCommentDate: "08/31/2023",
    lastComment: "Wait Cust Followup Date changed from 08/11/2023 to...",
    minNeedByDate: "06/28/2023",
    minFollowUpDate: "09/05/2023"
  },
  {
    id: "7",
    woBatch: "411712",
    acctNumber: "2607.00",
    srNumber: "SR0248",
    customerName: "B&B Electrical/Utility",
    totalLabOpen: 0,
    totalArCount: 1,
    totalCount: 3,
    lastCommentDate: "04/30/2024",
    lastComment: "Work Order marked Ready to Bill.",
    minNeedByDate: "06/26/2022",
    minFollowUpDate: "09/22/2023"
  },
  {
    id: "8",
    woBatch: "432330",
    acctNumber: "6333.14",
    srNumber: "SR1825",
    customerName: "Dow Chemical",
    totalLabOpen: 0,
    totalArCount: 1,
    totalCount: 62,
    lastCommentDate: "03/14/2024",
    lastComment: "Work Order marked Ready to Bill",
    minNeedByDate: "06/09/2023",
    minFollowUpDate: "09/22/2023"
  },
  {
    id: "9",
    woBatch: "434914",
    acctNumber: "6437.23",
    srNumber: "SR0654",
    customerName: "Exxon/Mobil BPEP",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 1,
    lastCommentDate: "09/26/2023",
    lastComment: "Wait Cust Followup Date changed from 9/28/2023 to...",
    minNeedByDate: "01/30/2023",
    minFollowUpDate: "10/02/2023"
  },
  {
    id: "10",
    woBatch: "436290",
    acctNumber: "6121.60",
    srNumber: "",
    customerName: "Entergy The Woodlands Tx",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 1,
    lastCommentDate: "09/28/2023",
    lastComment: "WAITING ON CUSTOMER: (Awaiting Quote Approval)",
    minNeedByDate: "02/15/2023",
    minFollowUpDate: "10/02/2023"
  },
  {
    id: "11",
    woBatch: "445885",
    acctNumber: "15573.00",
    srNumber: "SR1250",
    customerName: "HP Technologies LLC",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 1,
    lastCommentDate: "09/29/2023",
    lastComment: "WAITING ON CUSTOMER: (OTHERtest) test",
    minNeedByDate: "04/26/2023",
    minFollowUpDate: "10/02/2023"
  },
  {
    id: "12",
    woBatch: "451091",
    acctNumber: "15000.180",
    srNumber: "SR2244",
    customerName: "Entergy L-CHOC-STR",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 1,
    lastCommentDate: "09/28/2023",
    lastComment: "Status changed from A/R INVOICING to WAITING ON CU...",
    minNeedByDate: "08/28/2023",
    minFollowUpDate: "10/02/2023"
  },
  {
    id: "13",
    woBatch: "450722",
    acctNumber: "15000.180",
    srNumber: "SR2344",
    customerName: "Entergy L-CHOC-STR",
    totalLabOpen: 0,
    totalArCount: 0,
    totalCount: 2,
    lastCommentDate: "11/03/2023",
    lastComment: "External File ConfluenceMigrationPlan.xlsx was DEL...",
    minNeedByDate: "06/28/2023",
    minFollowUpDate: "10/02/2023"
  },
  {
    id: "14",
    woBatch: "452661",
    acctNumber: "6315.60",
    srNumber: "SR1358",
    customerName: "Conoco Phillips",
    totalLabOpen: 2,
    totalArCount: 9,
    totalCount: 11,
    lastCommentDate: "02/27/2024",
    lastComment: "PO Change Order 9525 was approved by Taylor Swift.",
    minNeedByDate: "06/28/2023",
    minFollowUpDate: "10/02/2023"
  },
  {
    id: "15",
    woBatch: "439064",
    acctNumber: "6172.63",
    srNumber: "",
    customerName: "Dow Chem Sabine-Machine Shop",
    totalLabOpen: 0,
    totalArCount: 223,
    totalCount: 236,
    lastCommentDate: "11/19/2024",
    lastComment: "Delivery Ticket #: DT-406502 Delivery Ticket Date...",
    minNeedByDate: "03/12/2023",
    minFollowUpDate: "10/03/2023"
  }
];

// Mock data for work order items (for item view)
interface WorkOrderItem {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  itemNumber: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  created: string;
  departure: string;
  itemStatus: string; // Allow all status values from dropdown
  itemType: string;
  deliverByDate: string;
  poNumber: string;
  customer: string;
  priority: "High" | "Medium" | "Low" | "Critical";
  assignedTo: string;
  division: string;
  // Additional fields for expandable details
  lastComment?: string;
  lastCommentDate?: string;
  needByDate?: string;
  followUpDate?: string;
  labCode?: string;
  location?: string;
  operationType?: string;
  estimatedCost?: string;
  actualCost?: string;
}

const mockWorkOrderItems: WorkOrderItem[] = [
  // Multiple items for WO-385737
  {
    id: "item-385737-1",
    workOrderId: "385737",
    workOrderNumber: "385737",
    itemNumber: "Gloves",
    manufacturer: "ADEULIS",
    model: "PPS-1734",
    serialNumber: "SN123456",
    created: "10/15/2024",
    departure: "11/25/2024",
    itemStatus: "In Lab",
    itemType: "ESL - Gloves",
    deliverByDate: "Nov 24, 2024",
    poNumber: "PO-2024-001",
    customer: "ACME Industries",
    priority: "High",
    assignedTo: "John Smith",
    division: "Lab",
    lastComment: "Calibration procedure started. Initial testing shows pressure reading within acceptable range.",
    lastCommentDate: "11/20/2024",
    needByDate: "11/24/2024",
    followUpDate: "11/22/2024",
    labCode: "LAB-001",
    location: "Lab Building A - Room 205",
    operationType: "Calibration",
    estimatedCost: "$1,250.00",
    actualCost: "$1,180.00"
  },
  {
    id: "item-385737-2",
    workOrderId: "385737",
    workOrderNumber: "385737",
    itemNumber: "Blankets",
    manufacturer: "ADEULIS",
    model: "PPS-1735",
    serialNumber: "SN123457",
    created: "10/15/2024",
    departure: "11/26/2024",
    itemStatus: "Q/A Inspection",
    itemType: "ESL - Blankets",
    deliverByDate: "Nov 24, 2024",
    poNumber: "PO-2024-001",
    customer: "ACME Industries",
    priority: "High",
    assignedTo: "John Smith",
    division: "Lab",
    lastComment: "Quality assurance inspection in progress. All tests are passing so far.",
    lastCommentDate: "11/21/2024",
    needByDate: "11/24/2024",
    followUpDate: "11/23/2024",
    labCode: "LAB-002",
    location: "Lab Building A - Room 210",
    operationType: "Inspection",
    estimatedCost: "$850.00",
    actualCost: "$825.00"
  },
  {
    id: "item-385737-3",
    workOrderId: "385737",
    workOrderNumber: "385737",
    itemNumber: "Blankets",
    manufacturer: "ADEULIS",
    model: "PPS-1736",
    serialNumber: "SN123458",
    created: "10/15/2024",
    departure: "11/27/2024",
    itemStatus: "[Open Items]",
    itemType: "ESL - Blankets",
    deliverByDate: "Nov 24, 2024",
    poNumber: "PO-2024-001",
    customer: "ACME Industries",
    priority: "High",
    assignedTo: "John Smith",
    division: "Lab"
  },
  // Multiple items for WO-390589
  {
    id: "item-390589-1",
    workOrderId: "390589",
    workOrderNumber: "390589",
    itemNumber: "Gloves",
    manufacturer: "STARRETT",
    model: "844-441",
    serialNumber: "SN789012",
    created: "10/12/2024",
    departure: "11/21/2024",
    itemStatus: "Back to Customer",
    itemType: "ESL - Gloves",
    deliverByDate: "Nov 20, 2024",
    poNumber: "PO-2024-002",
    customer: "Tech Solutions Ltd",
    priority: "Medium",
    assignedTo: "Sarah Johnson",
    division: "Rental"
  },
  {
    id: "item-390589-2",
    workOrderId: "390589",
    workOrderNumber: "390589",
    itemNumber: "Gloves",
    manufacturer: "STARRETT",
    model: "844-442",
    serialNumber: "SN789013",
    created: "10/12/2024",
    departure: "11/21/2024",
    itemStatus: "Ready for Departure",
    itemType: "ESL - Gloves",
    deliverByDate: "Nov 20, 2024",
    poNumber: "PO-2024-002",
    customer: "Tech Solutions Ltd",
    priority: "Medium",
    assignedTo: "Sarah Johnson",
    division: "Rental"
  },
  // Multiple items for WO-400217
  {
    id: "item-400217-1",
    workOrderId: "400217",
    workOrderNumber: "400217",
    itemNumber: "Gloves",
    manufacturer: "CHARLS LTD",
    model: "1000PS-A",
    serialNumber: "SN345678",
    created: "10/08/2024",
    departure: "TBD",
    itemStatus: "Awaiting Parts",
    itemType: "ESL - Gloves",
    deliverByDate: "Nov 18, 2024",
    poNumber: "PO-2024-003",
    customer: "Manufacturing Corp",
    priority: "Critical",
    assignedTo: "Mike Davis",
    division: "ESL Onsite"
  },
  {
    id: "item-400217-2",
    workOrderId: "400217",
    workOrderNumber: "400217",
    itemNumber: "Gloves",
    manufacturer: "CHARLS LTD",
    model: "1000PS-B",
    serialNumber: "SN345679",
    created: "10/08/2024",
    departure: "TBD",
    itemStatus: "Q/A Fail Log",
    itemType: "ESL - Gloves",
    deliverByDate: "Nov 18, 2024",
    poNumber: "PO-2024-003",
    customer: "Manufacturing Corp",
    priority: "Critical",
    assignedTo: "Mike Davis",
    division: "ESL Onsite"
  },
  {
    id: "item-400217-3",
    workOrderId: "400217",
    workOrderNumber: "400217",
    itemNumber: "Gloves",
    manufacturer: "CHARLS LTD",
    model: "1000PS-C",
    serialNumber: "SN345680",
    created: "10/08/2024",
    departure: "TBD",
    itemStatus: "Assigned to Tech",
    itemType: "ESL - Gloves",
    deliverByDate: "Nov 18, 2024",
    poNumber: "PO-2024-003",
    customer: "Manufacturing Corp",
    priority: "Critical",
    assignedTo: "Mike Davis",
    division: "ESL Onsite"
  },
  // Single item for WO-403946
  {
    id: "item-403946-1",
    workOrderId: "403946",
    workOrderNumber: "403946",
    itemNumber: "009",
    manufacturer: "PRECISION TOOLS",
    model: "CAL-500",
    serialNumber: "SN901234",
    created: "11/01/2024",
    departure: "12/02/2024",
    itemStatus: "Q/A Inspection",
    itemType: "ITL - Gauges",
    deliverByDate: "Dec 01, 2024",
    poNumber: "PO-2024-004",
    customer: "Quality Systems Inc",
    priority: "Low",
    assignedTo: "Emily Wilson",
    division: "ESL"
  },
  // Multiple items for WO-405078
  {
    id: "item-405078-1",
    workOrderId: "405078",
    workOrderNumber: "405078",
    itemNumber: "010",
    manufacturer: "SNAP-ON",
    model: "TW-PRO-500-10",
    serialNumber: "SN567890",
    created: "11/10/2024",
    departure: "12/06/2024",
    itemStatus: "Calibrated on Shelf",
    itemType: "ITL - Gauges",
    deliverByDate: "Dec 05, 2024",
    poNumber: "PO-2024-005",
    customer: "Aerospace Dynamics",
    priority: "High",
    assignedTo: "Tom Rodriguez",
    division: "Lab"
  },
  {
    id: "item-405078-2",
    workOrderId: "405078",
    workOrderNumber: "405078",
    itemNumber: "011",
    manufacturer: "SNAP-ON",
    model: "TW-PRO-500-50",
    serialNumber: "SN567891",
    created: "11/10/2024",
    departure: "12/06/2024",
    itemStatus: "A/R Invoicing",
    itemType: "ITL - Gauges",
    deliverByDate: "Dec 05, 2024",
    poNumber: "PO-2024-005",
    customer: "Aerospace Dynamics",
    priority: "High",
    assignedTo: "Tom Rodriguez",
    division: "Lab"
  },
  {
    id: "item-405078-3",
    workOrderId: "405078",
    workOrderNumber: "405078",
    itemNumber: "Hotsticks",
    manufacturer: "SNAP-ON",
    model: "TW-PRO-500-100",
    serialNumber: "SN567892",
    created: "11/10/2024",
    departure: "12/06/2024",
    itemStatus: "In Metrology",
    itemType: "ESL - Hotsticks",
    deliverByDate: "Dec 05, 2024",
    poNumber: "PO-2024-005",
    customer: "Aerospace Dynamics",
    priority: "High",
    assignedTo: "Tom Rodriguez",
    division: "Lab"
  },
  // Multiple items for WO-408881
  {
    id: "item-408881-1",
    workOrderId: "408881",
    workOrderNumber: "408881",
    itemNumber: "Gloves",
    manufacturer: "METTLER TOLEDO",
    model: "XS205",
    serialNumber: "SN234567",
    created: "11/05/2024",
    departure: "11/15/2024",
    itemStatus: "Back to Customer",
    itemType: "ESL - Hotsticks",
    deliverByDate: "Nov 15, 2024",
    poNumber: "PO-2024-006",
    customer: "Pharmaceutical Labs Inc",
    priority: "High",
    assignedTo: "Dr. Amanda Foster",
    division: "Lab"
  },
  {
    id: "item-408881-2",
    workOrderId: "408881",
    workOrderNumber: "408881",
    itemNumber: "014",
    manufacturer: "METTLER TOLEDO",
    model: "XS105",
    serialNumber: "SN234568",
    created: "11/05/2024",
    departure: "11/15/2024",
    itemStatus: "Ready for Departure",
    itemType: "SINGLE",
    deliverByDate: "Nov 15, 2024",
    poNumber: "PO-2024-006",
    customer: "Pharmaceutical Labs Inc",
    priority: "High",
    assignedTo: "Dr. Amanda Foster",
    division: "Lab"
  },
  // Items for WO-410123
  {
    id: "item-410123-1",
    workOrderId: "410123",
    workOrderNumber: "410123",
    itemNumber: "015",
    manufacturer: "FLUKE",
    model: "8846A",
    serialNumber: "SN345678",
    created: "11/12/2024",
    departure: "12/15/2024",
    itemStatus: "Lab Management",
    itemType: "SINGLE",
    deliverByDate: "Dec 10, 2024",
    poNumber: "PO-2024-007",
    customer: "Electronics Corp",
    priority: "Medium",
    assignedTo: "James Wilson",
    division: "ESL"
  },
  {
    id: "item-410123-2",
    workOrderId: "410123",
    workOrderNumber: "410123",
    itemNumber: "016",
    manufacturer: "FLUKE",
    model: "8845A",
    serialNumber: "SN345679",
    created: "11/12/2024",
    departure: "12/15/2024",
    itemStatus: "Repair Department",
    itemType: "SINGLE",
    deliverByDate: "Dec 10, 2024",
    poNumber: "PO-2024-007",
    customer: "Electronics Corp",
    priority: "Medium",
    assignedTo: "James Wilson",
    division: "ESL"
  },
  {
    id: "item-410123-3",
    workOrderId: "410123",
    workOrderNumber: "410123",
    itemNumber: "017",
    manufacturer: "FLUKE",
    model: "8808A",
    serialNumber: "SN345680",
    created: "11/12/2024",
    departure: "12/15/2024",
    itemStatus: "[Awaiting CDR]",
    itemType: "SINGLE",
    deliverByDate: "Dec 10, 2024",
    poNumber: "PO-2024-007",
    customer: "Electronics Corp",
    priority: "Medium",
    assignedTo: "James Wilson",
    division: "ESL"
  },
  // Items for WO-412456
  {
    id: "item-412456-1",
    workOrderId: "412456",
    workOrderNumber: "412456",
    itemNumber: "018",
    manufacturer: "KEYSIGHT",
    model: "34465A",
    serialNumber: "SN456789",
    created: "11/18/2024",
    departure: "12/20/2024",
    itemStatus: "Lab Hold",
    itemType: "SINGLE",
    deliverByDate: "Dec 18, 2024",
    poNumber: "PO-2024-008",
    customer: "Test Equipment Inc",
    priority: "Low",
    assignedTo: "Lisa Chang",
    division: "Rental"
  },
  {
    id: "item-412456-2",
    workOrderId: "412456",
    workOrderNumber: "412456",
    itemNumber: "019",
    manufacturer: "KEYSIGHT",
    model: "34461A",
    serialNumber: "SN456790",
    created: "11/18/2024",
    departure: "12/20/2024",
    itemStatus: "Q/A Disapproved",
    itemType: "SINGLE",
    deliverByDate: "Dec 18, 2024",
    poNumber: "PO-2024-008",
    customer: "Test Equipment Inc",
    priority: "Low",
    assignedTo: "Lisa Chang",
    division: "Rental"
  },
  // Items for WO-414789
  {
    id: "item-414789-1",
    workOrderId: "414789",
    workOrderNumber: "414789",
    itemNumber: "020",
    manufacturer: "TEKTRONIX",
    model: "MSO58",
    serialNumber: "SN567890",
    created: "11/20/2024",
    departure: "01/15/2025",
    itemStatus: "[In Lab - Assigned to Tech]",
    itemType: "SINGLE",
    deliverByDate: "Jan 10, 2025",
    poNumber: "PO-2024-009",
    customer: "Research Labs",
    priority: "Critical",
    assignedTo: "Robert Kim",
    division: "Lab"
  },
  {
    id: "item-414789-2",
    workOrderId: "414789",
    workOrderNumber: "414789",
    itemNumber: "021",
    manufacturer: "TEKTRONIX",
    model: "MSO56",
    serialNumber: "SN567891",
    created: "11/20/2024",
    departure: "01/15/2025",
    itemStatus: "ME Review",
    itemType: "SINGLE",
    deliverByDate: "Jan 10, 2025",
    poNumber: "PO-2024-009",
    customer: "Research Labs",
    priority: "Critical",
    assignedTo: "Robert Kim",
    division: "Lab"
  },
  // Items for WO-416012
  {
    id: "item-416012-1",
    workOrderId: "416012",
    workOrderNumber: "416012",
    itemNumber: "022",
    manufacturer: "ROHDE & SCHWARZ",
    model: "FSW85",
    serialNumber: "SN678901",
    created: "11/22/2024",
    departure: "01/20/2025",
    itemStatus: "Scheduled",
    itemType: "SINGLE",
    deliverByDate: "Jan 18, 2025",
    poNumber: "PO-2024-010",
    customer: "Communications Inc",
    priority: "High",
    assignedTo: "Maria Garcia",
    division: "ESL Onsite"
  },
  {
    id: "item-416012-2",
    workOrderId: "416012",
    workOrderNumber: "416012",
    itemNumber: "023",
    manufacturer: "ROHDE & SCHWARZ",
    model: "FSW67",
    serialNumber: "SN678902",
    created: "11/22/2024",
    departure: "01/20/2025",
    itemStatus: "To Factory",
    itemType: "SINGLE",
    deliverByDate: "Jan 18, 2025",
    poNumber: "PO-2024-010",
    customer: "Communications Inc",
    priority: "High",
    assignedTo: "Maria Garcia",
    division: "ESL Onsite"
  },
  // Items for WO-418345
  {
    id: "item-418345-1",
    workOrderId: "418345",
    workOrderNumber: "418345",
    itemNumber: "024",
    manufacturer: "ANRITSU",
    model: "MS2038C",
    serialNumber: "SN789012",
    created: "11/25/2024",
    departure: "12/30/2024",
    itemStatus: "Calibrated on Shelf",
    itemType: "SINGLE",
    deliverByDate: "Dec 28, 2024",
    poNumber: "PO-2024-011",
    customer: "RF Solutions",
    priority: "Medium",
    assignedTo: "David Park",
    division: "ESL"
  },
  {
    id: "item-418345-2",
    workOrderId: "418345",
    workOrderNumber: "418345",
    itemNumber: "025",
    manufacturer: "ANRITSU",
    model: "MS2037C",
    serialNumber: "SN789013",
    created: "11/25/2024",
    departure: "12/30/2024",
    itemStatus: "Shipped",
    itemType: "SINGLE",
    deliverByDate: "Dec 28, 2024",
    poNumber: "PO-2024-011",
    customer: "RF Solutions",
    priority: "Medium",
    assignedTo: "David Park",
    division: "ESL"
  },
  // Items for WO-420678
  {
    id: "item-420678-1",
    workOrderId: "420678",
    workOrderNumber: "420678",
    itemNumber: "026",
    manufacturer: "HIOKI",
    model: "IM3570",
    serialNumber: "SN890123",
    created: "11/28/2024",
    departure: "01/05/2025",
    itemStatus: "Estimate",
    itemType: "SINGLE",
    deliverByDate: "Jan 03, 2025",
    poNumber: "PO-2024-012",
    customer: "Component Testing Lab",
    priority: "Low",
    assignedTo: "Jennifer Lee",
    division: "Lab"
  },
  {
    id: "item-420678-2",
    workOrderId: "420678",
    workOrderNumber: "420678",
    itemNumber: "027",
    manufacturer: "HIOKI",
    model: "IM3533",
    serialNumber: "SN890124",
    created: "11/28/2024",
    departure: "01/05/2025",
    itemStatus: "Awaiting PR Approval",
    itemType: "SINGLE",
    deliverByDate: "Jan 03, 2025",
    poNumber: "PO-2024-012",
    customer: "Component Testing Lab",
    priority: "Low",
    assignedTo: "Jennifer Lee",
    division: "Lab"
  },
  // Items for WO-422901
  {
    id: "item-422901-1",
    workOrderId: "422901",
    workOrderNumber: "422901",
    itemNumber: "028",
    manufacturer: "RIGOL",
    model: "DG4162",
    serialNumber: "SN901234",
    created: "12/01/2024",
    departure: "01/10/2025",
    itemStatus: "Rotation",
    itemType: "SINGLE",
    deliverByDate: "Jan 08, 2025",
    poNumber: "PO-2024-013",
    customer: "Signal Generation Corp",
    priority: "Medium",
    assignedTo: "Alex Thompson",
    division: "Rental"
  },
  {
    id: "item-422901-2",
    workOrderId: "422901",
    workOrderNumber: "422901",
    itemNumber: "029",
    manufacturer: "RIGOL",
    model: "DG4102",
    serialNumber: "SN901235",
    created: "12/01/2024",
    departure: "01/10/2025",
    itemStatus: "To Factory - Warranty",
    itemType: "SINGLE",
    deliverByDate: "Jan 08, 2025",
    poNumber: "PO-2024-013",
    customer: "Signal Generation Corp",
    priority: "Medium",
    assignedTo: "Alex Thompson",
    division: "Rental"
  },
  // Items for WO-425234
  {
    id: "item-425234-1",
    workOrderId: "425234",
    workOrderNumber: "425234",
    itemNumber: "030",
    manufacturer: "YOKOGAWA",
    model: "GS200",
    serialNumber: "SN012345",
    created: "12/03/2024",
    departure: "01/12/2025",
    itemStatus: "Admin Processing",
    itemType: "SINGLE",
    deliverByDate: "Jan 10, 2025",
    poNumber: "PO-2024-014",
    customer: "Power Systems Inc",
    priority: "High",
    assignedTo: "Michelle Brown",
    division: "ESL"
  },
  {
    id: "item-425234-2",
    workOrderId: "425234",
    workOrderNumber: "425234",
    itemNumber: "031",
    manufacturer: "YOKOGAWA",
    model: "GS610",
    serialNumber: "SN012346",
    created: "12/03/2024",
    departure: "01/12/2025",
    itemStatus: "Q/A Hold",
    itemType: "SINGLE",
    deliverByDate: "Jan 10, 2025",
    poNumber: "PO-2024-014",
    customer: "Power Systems Inc",
    priority: "High",
    assignedTo: "Michelle Brown",
    division: "ESL"
  },
  // Items for WO-427567
  {
    id: "item-427567-1",
    workOrderId: "427567",
    workOrderNumber: "427567",
    itemNumber: "032",
    manufacturer: "NATIONAL INSTRUMENTS",
    model: "PXIe-5171R",
    serialNumber: "SN123456",
    created: "12/05/2024",
    departure: "01/15/2025",
    itemStatus: "Surplus Stock",
    itemType: "SINGLE",
    deliverByDate: "Jan 12, 2025",
    poNumber: "PO-2024-015",
    customer: "Automated Test Systems",
    priority: "Critical",
    assignedTo: "Kevin White",
    division: "Lab"
  },
  {
    id: "item-427567-2",
    workOrderId: "427567",
    workOrderNumber: "427567",
    itemNumber: "033",
    manufacturer: "NATIONAL INSTRUMENTS",
    model: "PXIe-5663E",
    serialNumber: "SN123457",
    created: "12/05/2024",
    departure: "01/15/2025",
    itemStatus: "Shipped",
    itemType: "SINGLE",
    deliverByDate: "Jan 12, 2025",
    poNumber: "PO-2024-015",
    customer: "Automated Test Systems",
    priority: "Critical",
    assignedTo: "Kevin White",
    division: "Lab"
  },
  // Items for WO-429890
  {
    id: "item-429890-1",
    workOrderId: "429890",
    workOrderNumber: "429890",
    itemNumber: "034",
    manufacturer: "B&K PRECISION",
    model: "5491B",
    serialNumber: "SN234567",
    created: "12/08/2024",
    departure: "01/18/2025",
    itemStatus: "Waiting on Customer",
    itemType: "SINGLE",
    deliverByDate: "Jan 15, 2025",
    poNumber: "PO-2024-016",
    customer: "Precision Measurements",
    priority: "Low",
    assignedTo: "Patricia Davis",
    division: "Rental"
  },
  {
    id: "item-429890-2",
    workOrderId: "429890",
    workOrderNumber: "429890",
    itemNumber: "035",
    manufacturer: "B&K PRECISION",
    model: "5492B",
    serialNumber: "SN234568",
    created: "12/08/2024",
    departure: "01/18/2025",
    itemStatus: "Onsite",
    itemType: "SINGLE",
    deliverByDate: "Jan 15, 2025",
    poNumber: "PO-2024-016",
    customer: "Precision Measurements",
    priority: "Low",
    assignedTo: "Patricia Davis",
    division: "Rental"
  },
  // Items for WO-432123
  {
    id: "item-432123-1",
    workOrderId: "432123",
    workOrderNumber: "432123",
    itemNumber: "036",
    manufacturer: "AMETEK",
    model: "JOFRA RTC-157",
    serialNumber: "SN345678",
    created: "12/10/2024",
    departure: "01/20/2025",
    itemStatus: "Not Used",
    itemType: "SINGLE",
    deliverByDate: "Jan 18, 2025",
    poNumber: "PO-2024-017",
    customer: "Temperature Solutions",
    priority: "Medium",
    assignedTo: "Steven Martinez",
    division: "ESL Onsite"
  },
  {
    id: "item-432123-2",
    workOrderId: "432123",
    workOrderNumber: "432123",
    itemNumber: "037",
    manufacturer: "AMETEK",
    model: "JOFRA RTC-158",
    serialNumber: "SN345679",
    created: "12/10/2024",
    departure: "01/20/2025",
    itemStatus: "Item Not Found on Site",
    itemType: "SINGLE",
    deliverByDate: "Jan 18, 2025",
    poNumber: "PO-2024-017",
    customer: "Temperature Solutions",
    priority: "Medium",
    assignedTo: "Steven Martinez",
    division: "ESL Onsite"
  },
  // Items for WO-434456
  {
    id: "item-434456-1",
    workOrderId: "434456",
    workOrderNumber: "434456",
    itemNumber: "038",
    manufacturer: "MEGGER",
    model: "BITE3",
    serialNumber: "SN456789",
    created: "12/12/2024",
    departure: "01/25/2025",
    itemStatus: "Return to Lab for Processing",
    itemType: "SINGLE",
    deliverByDate: "Jan 22, 2025",
    poNumber: "PO-2024-018",
    customer: "Energy Storage Systems",
    priority: "High",
    assignedTo: "Nancy Wilson",
    division: "ESL"
  }
];

const getItemStatusBadge = (status: WorkOrderItem["itemStatus"]) => {
  const variants = {
    "In Lab": "bg-blue-100 text-blue-800 border-blue-200",
    "Back to Customer": "bg-green-100 text-green-800 border-green-200",
    "Ready for Departure": "bg-green-100 text-green-800 border-green-200",
    "Calibrated on Shelf": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Q/A Inspection": "bg-blue-100 text-blue-800 border-blue-200",
    "[Open Items]": "bg-slate-100 text-slate-800 border-slate-200",
    "Awaiting Parts": "bg-orange-100 text-orange-800 border-orange-200",
    "Q/A Fail Log": "bg-red-100 text-red-800 border-red-200",
    "Assigned to Tech": "bg-blue-100 text-blue-800 border-blue-200",
    "A/R Invoicing": "bg-green-100 text-green-800 border-green-200",
    "In Metrology": "bg-violet-100 text-violet-800 border-violet-200",
    "Lab Management": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Repair Department": "bg-blue-100 text-blue-800 border-blue-200",
    "[Awaiting CDR]": "bg-orange-100 text-orange-800 border-orange-200",
    "Lab Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Q/A Disapproved": "bg-red-100 text-red-800 border-red-200",
    "[In Lab - Assigned to Tech]": "bg-blue-100 text-blue-800 border-blue-200",
    "ME Review": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Scheduled": "bg-blue-100 text-blue-800 border-blue-200",
    "To Factory": "bg-amber-100 text-amber-800 border-amber-200",
    "Estimate": "bg-purple-100 text-purple-800 border-purple-200",
    "Awaiting PR Approval": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Rotation": "bg-teal-100 text-teal-800 border-teal-200",
    "To Factory - Warranty": "bg-amber-100 text-amber-800 border-amber-200",
    "Admin Processing": "bg-slate-100 text-slate-800 border-slate-200",
    "Q/A Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Surplus Stock": "bg-teal-100 text-teal-800 border-teal-200",
    "Waiting on Customer": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Onsite": "bg-blue-100 text-blue-800 border-blue-200",
    "Not Used": "bg-gray-100 text-gray-800 border-gray-200",
    "Item Not Found on Site": "bg-red-100 text-red-800 border-red-200",
    "Return to Lab for Processing": "bg-orange-100 text-orange-800 border-orange-200"
  };
  
  return (
    <Badge className={cn("text-xs font-medium border", variants[status] || "bg-gray-100 text-gray-800 border-gray-200")}>
      {status}
    </Badge>
  );
};

const getStatusBadge = (status: WorkOrder["status"]) => {
  const variants = {
    "In Lab": "bg-blue-100 text-blue-800 border-blue-200",
    "Completed": "bg-green-100 text-green-800 border-green-200",
    "Overdue": "bg-red-100 text-red-800 border-red-200",
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "[Open Items]": "bg-slate-100 text-slate-800 border-slate-200",
    "[Awaiting CDR]": "bg-orange-100 text-orange-800 border-orange-200",
    "[Assign/Tech - Repair - InLab]": "bg-blue-100 text-blue-800 border-blue-200",
    "[Assigned To Tech - Repair Dept]": "bg-blue-100 text-blue-800 border-blue-200",
    "[Q/A Hold - Q/A Disapproved]": "bg-red-100 text-red-800 border-red-200",
    "[Q/A Insp - Q/A Hold - Q/A Fail]": "bg-red-100 text-red-800 border-red-200",
    "[In Lab - Assigned to Tech]": "bg-blue-100 text-blue-800 border-blue-200",
    "[In Lab - Q/A Disapprove]": "bg-red-100 text-red-800 border-red-200",
    "[Estimate - A/R Invoicing]": "bg-purple-100 text-purple-800 border-purple-200",
    "[To Factory - Awaiting Parts]": "bg-orange-100 text-orange-800 border-orange-200",
    "[AR Need By Status]": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Assigned to Tech": "bg-blue-100 text-blue-800 border-blue-200",
    "In Transit": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "Lab Management": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Repair Department": "bg-blue-100 text-blue-800 border-blue-200",
    "Rotation": "bg-teal-100 text-teal-800 border-teal-200",
    "Estimate": "bg-purple-100 text-purple-800 border-purple-200",
    "Awaiting Parts": "bg-orange-100 text-orange-800 border-orange-200",
    "Awaiting PR Approval": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "In Metrology": "bg-violet-100 text-violet-800 border-violet-200",
    "To Factory": "bg-amber-100 text-amber-800 border-amber-200",
    "To Factory - Repair by Replacement": "bg-amber-100 text-amber-800 border-amber-200",
    "To Factory - Warranty": "bg-amber-100 text-amber-800 border-amber-200",
    "Lab Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Q/A Inspection": "bg-blue-100 text-blue-800 border-blue-200",
    "Q/A Inspection - Fail Correction": "bg-red-100 text-red-800 border-red-200",
    "Q/A Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Q/A Disapproved": "bg-red-100 text-red-800 border-red-200",
    "Q/A Fail Log": "bg-red-100 text-red-800 border-red-200",
    "A/R Invoicing": "bg-green-100 text-green-800 border-green-200",
    "A/R Invoicing/Hold": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Admin Processing": "bg-slate-100 text-slate-800 border-slate-200",
    "Back to Customer": "bg-green-100 text-green-800 border-green-200",
    "Calibrated on Shelf": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Cancelled": "bg-gray-100 text-gray-800 border-gray-200",
    "Item Not Found on Site": "bg-red-100 text-red-800 border-red-200",
    "ME Review": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Not Used": "bg-gray-100 text-gray-800 border-gray-200",
    "Onsite": "bg-blue-100 text-blue-800 border-blue-200",
    "Ready for Departure": "bg-green-100 text-green-800 border-green-200",
    "Return to Lab for Processing": "bg-orange-100 text-orange-800 border-orange-200",
    "Scheduled": "bg-blue-100 text-blue-800 border-blue-200",
    "Surplus Stock": "bg-teal-100 text-teal-800 border-teal-200",
    "Waiting on Customer": "bg-yellow-100 text-yellow-800 border-yellow-200"
  };
  
  return (
    <Badge className={cn("text-xs font-medium border", variants[status] || "bg-gray-100 text-gray-800 border-gray-200")}>
      {status}
    </Badge>
  );
};

interface ModernWorkOrdersTableProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  searchFilters: {
    globalSearch: string;
    searchTags: string[];
    status: string;
    assignee: string;
    priority: string[];
    manufacturer: string;
    division: string;
    woType: string;
    dateFrom?: Date;
    dateTo?: Date;
    dateType: string;
    actionCode: string;
    labCode: string;
    rotationManagement: string;
    invoiceStatus: string;
    departureType: string;
    salesperson: string;
    workOrderItemStatus: string;
    workOrderItemType: string;
    location: string;
  };
  hasSearched: boolean;
}

// ModernWorkOrdersTable Component - Clean version with only List/Grid toggle icons
const ModernWorkOrdersTable = ({ viewMode, onViewModeChange, searchFilters, hasSearched }: ModernWorkOrdersTableProps) => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<WorkOrderBatch | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'item' | 'batch'>('item');
  const navigate = useNavigate();
  
  // Filter work orders based on search filters from parent and status
  // Helper function to convert status names to filter values
  const getStatusFilterValue = (status: string) => {
    const statusMap: { [key: string]: string } = {
      "[Open Items]": "open-items",
      "[Awaiting CDR]": "awaiting-cdr", 
      "[Assign/Tech - Repair - InLab]": "assign-tech-repair-inlab",
      "[Assigned To Tech - Repair Dept]": "assigned-tech-repair-dept",
      "[Q/A Hold - Q/A Disapproved]": "qa-hold-disapproved",
      "[Q/A Insp - Q/A Hold - Q/A Fail]": "qa-insp-hold-fail",
      "[In Lab - Assigned to Tech]": "in-lab-assigned-tech",
      "[In Lab - Q/A Disapprove]": "in-lab-qa-disapprove",
      "[Estimate - A/R Invoicing]": "estimate-ar-invoicing",
      "[To Factory - Awaiting Parts]": "to-factory-awaiting-parts",
      "[AR Need By Status]": "ar-need-by-status",
      "In Lab": "in-lab",
      "Assigned to Tech": "assigned-to-tech",
      "In Transit": "in-transit",
      "Lab Management": "lab-management",
      "Repair Department": "repair-department",
      "Rotation": "rotation",
      "Estimate": "estimate",
      "Awaiting Parts": "awaiting-parts",
      "Awaiting PR Approval": "awaiting-pr-approval",
      "In Metrology": "in-metrology",
      "To Factory": "to-factory",
      "To Factory - Repair by Replacement": "to-factory-repair-replacement",
      "To Factory - Warranty": "to-factory-warranty",
      "Lab Hold": "lab-hold",
      "Q/A Inspection": "qa-inspection",
      "Q/A Inspection - Fail Correction": "qa-inspection-fail-correction",
      "Q/A Hold": "qa-hold",
      "Q/A Disapproved": "qa-disapproved",
      "Q/A Fail Log": "qa-fail-log",
      "A/R Invoicing": "ar-invoicing",
      "A/R Invoicing/Hold": "ar-invoicing-hold",
      "Admin Processing": "admin-processing",
      "Back to Customer": "back-to-customer",
      "Calibrated on Shelf": "calibrated-on-shelf",
      "Cancelled": "cancelled",
      "Item Not Found on Site": "item-not-found-on-site",
      "ME Review": "me-review",
      "Not Used": "not-used",
      "Onsite": "onsite",
      "Ready for Departure": "ready-for-departure",
      "Return to Lab for Processing": "return-to-lab-processing",
      "Scheduled": "scheduled",
      "Surplus Stock": "surplus-stock",
      "Waiting on Customer": "waiting-on-customer",
      "Completed": "completed",
      "Overdue": "overdue",
      "Pending": "pending"
    };
    
    return statusMap[status] || status.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const filteredWorkOrders = mockWorkOrders.filter(order => {
    // Status filter (using both activeStatusFilter and searchFilters.status)
    const statusFromParent = searchFilters.status;
    const orderStatusFilterValue = getStatusFilterValue(order.status);
    const statusMatch = (activeStatusFilter === 'all' && !statusFromParent) || 
      orderStatusFilterValue === activeStatusFilter ||
      (statusFromParent && orderStatusFilterValue === statusFromParent);
    
    // Global text search filter from parent
    const searchMatch = !searchFilters.globalSearch || 
      order.id.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.division.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.manufacturer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.modelNumber.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.serialNumber.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.labCode.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.poNumber.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.custId.toLowerCase().includes(searchFilters.globalSearch.toLowerCase());
    
    // Search tags filter - ALL tags must match (each tag can match ANY field)
    const searchTagsMatch = !searchFilters.searchTags || searchFilters.searchTags.length === 0 || 
      searchFilters.searchTags.every(tag => {
        // Extract the value from "Label: value" format
        const colonIndex = tag.indexOf(':');
        const searchValue = colonIndex !== -1 ? tag.substring(colonIndex + 1).trim() : tag;
        const searchLower = searchValue.toLowerCase();
        
        return order.id.toLowerCase().includes(searchLower) ||
          order.customer.toLowerCase().includes(searchLower) ||
          order.assignedTo.toLowerCase().includes(searchLower) ||
          order.division.toLowerCase().includes(searchLower) ||
          order.details.manufacturer.toLowerCase().includes(searchLower) ||
          order.details.modelNumber.toLowerCase().includes(searchLower) ||
          order.details.serialNumber.toLowerCase().includes(searchLower) ||
          order.details.labCode.toLowerCase().includes(searchLower) ||
          order.details.poNumber.toLowerCase().includes(searchLower) ||
          order.details.custId.toLowerCase().includes(searchLower) ||
          order.details.custSn.toLowerCase().includes(searchLower) ||
          order.details.cartSn.toLowerCase().includes(searchLower);
      });
    
    // Priority filter
    const priorityMatch = searchFilters.priority.length === 0 || 
      searchFilters.priority.some(p => order.details.priority.toLowerCase() === p.toLowerCase());
    
    // Manufacturer filter
    const manufacturerMatch = !searchFilters.manufacturer || 
      order.details.manufacturer.toLowerCase().includes(searchFilters.manufacturer.toLowerCase());
    
    // Division filter
    const divisionMatch = !searchFilters.division || 
      order.division.toLowerCase().includes(searchFilters.division.toLowerCase());
    
    return statusMatch && searchMatch && searchTagsMatch && priorityMatch && manufacturerMatch && divisionMatch;
  });

  // Filter work order items for item view
  const filteredWorkOrderItems = mockWorkOrderItems.filter(item => {
    // Status filter - convert item status to filter value for comparison
    const getItemStatusFilterValue = (status: string) => {
      const statusMap: { [key: string]: string } = {
        "[Open Items]": "open-items",
        "[Awaiting CDR]": "awaiting-cdr", 
        "[Assign/Tech - Repair - InLab]": "assign-tech-repair-inlab",
        "[Assigned To Tech - Repair Dept]": "assigned-tech-repair-dept",
        "[Q/A Hold - Q/A Disapproved]": "qa-hold-disapproved",
        "[Q/A Insp - Q/A Hold - Q/A Fail]": "qa-insp-hold-fail",
        "[In Lab - Assigned to Tech]": "in-lab-assigned-tech",
        "[In Lab - Q/A Disapprove]": "in-lab-qa-disapprove",
        "[Estimate - A/R Invoicing]": "estimate-ar-invoicing",
        "[To Factory - Awaiting Parts]": "to-factory-awaiting-parts",
        "[AR Need By Status]": "ar-need-by-status",
        "In Lab": "in-lab",
        "Assigned to Tech": "assigned-to-tech",
        "In Transit": "in-transit",
        "Lab Management": "lab-management",
        "Repair Department": "repair-department",
        "Rotation": "rotation",
        "Estimate": "estimate",
        "Awaiting Parts": "awaiting-parts",
        "Awaiting PR Approval": "awaiting-pr-approval",
        "In Metrology": "in-metrology",
        "To Factory": "to-factory",
        "To Factory - Repair by Replacement": "to-factory-repair-replacement",
        "To Factory - Warranty": "to-factory-warranty",
        "Lab Hold": "lab-hold",
        "Q/A Inspection": "qa-inspection",
        "Q/A Inspection - Fail Correction": "qa-inspection-fail-correction",
        "Q/A Hold": "qa-hold",
        "Q/A Disapproved": "qa-disapproved",
        "Q/A Fail Log": "qa-fail-log",
        "A/R Invoicing": "ar-invoicing",
        "A/R Invoicing/Hold": "ar-invoicing-hold",
        "Admin Processing": "admin-processing",
        "Back to Customer": "back-to-customer",
        "Calibrated on Shelf": "calibrated-on-shelf",
        "Cancelled": "cancelled",
        "Item Not Found on Site": "item-not-found-on-site",
        "ME Review": "me-review",
        "Not Used": "not-used",
        "Onsite": "onsite",
        "Ready for Departure": "ready-for-departure",
        "Return to Lab for Processing": "return-to-lab-processing",
        "Scheduled": "scheduled",
        "Surplus Stock": "surplus-stock",
        "Waiting on Customer": "waiting-on-customer"
      };
      return statusMap[status] || status.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    };

    // Status filter
    const itemStatusFilterValue = getItemStatusFilterValue(item.itemStatus);
    const statusMatch = !searchFilters.status || itemStatusFilterValue === searchFilters.status;
    
    // Global text search filter from parent
    const searchMatch = !searchFilters.globalSearch || 
      item.workOrderNumber.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.division.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.model.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      item.itemType.toLowerCase().includes(searchFilters.globalSearch.toLowerCase());
    
    // Search tags filter - ALL tags must match (each tag can match ANY field)
    const searchTagsMatch = !searchFilters.searchTags || searchFilters.searchTags.length === 0 || 
      searchFilters.searchTags.every(tag => {
        // Extract the value from "Label: value" format
        const colonIndex = tag.indexOf(':');
        const searchValue = colonIndex !== -1 ? tag.substring(colonIndex + 1).trim() : tag;
        const searchLower = searchValue.toLowerCase();
        
        return item.workOrderNumber.toLowerCase().includes(searchLower) ||
          item.customer.toLowerCase().includes(searchLower) ||
          item.assignedTo.toLowerCase().includes(searchLower) ||
          item.division.toLowerCase().includes(searchLower) ||
          item.manufacturer.toLowerCase().includes(searchLower) ||
          item.model.toLowerCase().includes(searchLower) ||
          item.serialNumber.toLowerCase().includes(searchLower) ||
          item.itemType.toLowerCase().includes(searchLower) ||
          item.poNumber?.toLowerCase().includes(searchLower);
      });
    
    // Priority filter
    const priorityMatch = searchFilters.priority.length === 0 || 
      searchFilters.priority.some(p => item.priority.toLowerCase() === p.toLowerCase());
    
    // Manufacturer filter
    const manufacturerMatch = !searchFilters.manufacturer || 
      item.manufacturer.toLowerCase().includes(searchFilters.manufacturer.toLowerCase());
    
    // Division filter
    const divisionMatch = !searchFilters.division || 
      item.division.toLowerCase().includes(searchFilters.division.toLowerCase());
    
    return statusMatch && searchMatch && searchTagsMatch && priorityMatch && manufacturerMatch && divisionMatch;
  });

  // Filter work order batches for batch view
  const filteredWorkOrderBatches = mockWorkOrderBatches.filter(batch => {
    // Global search across batch fields
    const searchTerm = searchFilters.globalSearch.toLowerCase();
    const searchMatch = !searchTerm || 
      batch.woBatch.toLowerCase().includes(searchTerm) ||
      batch.acctNumber.toLowerCase().includes(searchTerm) ||
      batch.srNumber.toLowerCase().includes(searchTerm) ||
      batch.customerName.toLowerCase().includes(searchTerm);
    
    // Search tags filter - ALL tags must match (each tag can match ANY field)
    const searchTagsMatch = !searchFilters.searchTags || searchFilters.searchTags.length === 0 || 
      searchFilters.searchTags.every(tag => {
        // Extract the value from "Label: value" format
        const colonIndex = tag.indexOf(':');
        const searchValue = colonIndex !== -1 ? tag.substring(colonIndex + 1).trim() : tag;
        const searchLower = searchValue.toLowerCase();
        
        return batch.woBatch.toLowerCase().includes(searchLower) ||
          batch.acctNumber.toLowerCase().includes(searchLower) ||
          batch.srNumber.toLowerCase().includes(searchLower) ||
          batch.customerName.toLowerCase().includes(searchLower);
      });
    
    return searchMatch && searchTagsMatch;
  });
  
  const totalPages = currentView === 'batch' 
    ? Math.ceil(filteredWorkOrderBatches.length / itemsPerPage)
    : Math.ceil(filteredWorkOrderItems.length / itemsPerPage);

  // Get paginated data
  const isShowingAll = itemsPerPage >= 999999;
  const paginatedWorkOrders = currentView === 'item' 
    ? []
    : [];
    
  const paginatedWorkOrderItems = currentView === 'item' 
    ? (isShowingAll ? filteredWorkOrderItems : filteredWorkOrderItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage))
    : [];

  const paginatedBatches = currentView === 'batch'
    ? (isShowingAll ? filteredWorkOrderBatches : filteredWorkOrderBatches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage))
    : [];

  const openDetails = (order: WorkOrder) => {
    console.log('Opening details for order:', order.id, 'currentView:', currentView);
    setSelectedWorkOrder(order);
  };

  const openDetailsFromItem = (item: any) => {
    // Find the corresponding work order for this item
    const workOrder = mockWorkOrders.find(wo => wo.id === item.workOrderNumber);
    if (workOrder) {
      console.log('Opening details from item:', item.id, 'workOrder:', workOrder.id);
      setSelectedWorkOrder(workOrder);
    }
  };

  const openBatchDetails = (batch: WorkOrderBatch) => {
    console.log('Opening batch details:', batch.id);
    setSelectedBatch(batch);
  };

  const handleEditWorkOrder = (workOrderId: string) => {
    // Find the work order data
    const workOrder = mockWorkOrders.find(wo => wo.id === workOrderId);
    if (workOrder) {
      // Navigate to edit order page with work order data
      navigate('/edit-order', { 
        state: { 
          workOrderData: workOrder
        } 
      });
    }
  };

  const handleItemTypeClick = (item: any, e: React.MouseEvent) => {
    // Stop propagation to prevent opening the details dialog
    e.stopPropagation();
    
    // Create workOrderData from item
    const workOrderData = {
      id: item.workOrderNumber,
      srDoc: "SR Document",
      salesperson: "Not assigned",
      contact: "Brad Morrison",
      status: item.itemStatus,
      customer: item.customer,
      equipmentType: item.itemType,
      location: "baton-rouge",
      division: item.division || "esl",
      assignedTo: item.assignedTo,
      urgencyLevel: item.priority || "normal",
      dueDate: item.deliverByDate,
      arrivalDate: item.created,
      needBy: item.deliverByDate,
      calFreq: "Annual",
      details: {
        manufacturer: item.manufacturer,
        modelNumber: item.model,
        serialNumber: item.serialNumber,
        itemType: item.itemType,
        priority: item.priority,
        action: "C/C",
        job: "C/C",
        batch: item.reportNumber,
        nextBy: item.deliverByDate,
        createdDate: item.created,
        departureDate: item.departure,
        originalLoc: "warehouse",
        destLoc: "main-office",
        serviceType: "standard",
        technicalNotes: `${item.itemType} - Standard processing`,
        comments: "Item ready for processing",
        poNumber: item.poNumber,
        custId: "CUST-001",
        custSn: "CSN-001",
        labCode: "LAB-001",
        workDescription: `${item.manufacturer} ${item.model} - ${item.itemType}`,
        invoiceNumber: "",
        proofOfDelivery: "pending",
        statusDate: item.created,
        lastModified: item.created,
        template: "Standard Procedure",
        items: "1",
      }
    };
    
    navigate('/edit-order', { state: { workOrderData } });
  };

  // Default Work Order Details Dialog Component  
  const DefaultWorkOrderDetailsDialog = ({ order }: { order: WorkOrder }) => (
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

        {/* Accordion for Work Order Details and Timeline */}
        <Accordion type="multiple" defaultValue={["details", "timeline"]} className="space-y-4">
          {/* Work Order Details Accordion */}
          <AccordionItem value="details" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <AccordionTrigger className="bg-gray-50 px-4 py-2 hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold text-gray-900">Work Order Details</h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Column 1 */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-sm font-medium">Lab Code:</span>
                      <div className="font-mono text-sm">{order.details.labCode}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm font-medium">Type:</span>
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

                {/* Status Row - Show in default view */}
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
            </AccordionContent>
          </AccordionItem>

          {/* Project Timeline Accordion */}
          <AccordionItem value="timeline" className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <AccordionTrigger className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 hover:from-blue-100 hover:to-indigo-100 transition-colors">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Project Timeline
              </h4>
            </AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
            Edit Order
          </Button>
          <Button variant="outline">
            Assign Tech
          </Button>
          <Button>
            Update Status
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        {/* Mobile Layout - Stacked */}
        <div className="block lg:hidden space-y-4">
          {/* Title */}
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Work Orders</h2>
          </div>
          
          {/* Toggle Buttons - Full Width on Mobile */}
          <div className="space-y-3">
            {/* Item/Batch Toggle */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full max-w-xs">
                <Button
                  variant={currentView === 'item' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('item')}
                  className={cn(
                    "h-9 flex-1 rounded-md transition-all text-xs sm:text-sm",
                    currentView === 'item' 
                      ? "bg-white shadow-sm text-gray-900" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  )}
                >
                  <span className="hidden sm:inline">Item View</span>
                  <span className="sm:hidden">Items</span>
                </Button>
                <Button
                  variant={currentView === 'batch' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('batch')}
                  className={cn(
                    "h-9 flex-1 rounded-md transition-all text-xs sm:text-sm",
                    currentView === 'batch' 
                      ? "bg-white shadow-sm text-gray-900" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  )}
                >
                  <span className="hidden sm:inline">Batch View</span>
                  <span className="sm:hidden">Batches</span>
                </Button>
              </div>
            </div>

            {/* List/Grid Toggle */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('list')}
                  className={cn(
                    "h-9 px-4 rounded-md transition-all",
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
                    "h-9 px-4 rounded-md transition-all",
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

        {/* Desktop/Tablet Layout - Horizontal */}
        <div className="hidden lg:flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Work Orders</h2>
          </div>
          
          {/* View Toggle Buttons */}
          <div className="flex items-center gap-3">
            {/* Item/Batch Toggle */}
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

      {/* Content - List or Grid View */}
      <div className="overflow-hidden">
        {viewMode === 'list' ? (
          // List View - Table
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow className="hover:bg-gray-50">
                {currentView === 'batch' ? (
                  // Batch View Headers
                  <>
                    <TableHead className="font-semibold text-gray-900">WO Batch</TableHead>
                    <TableHead className="font-semibold text-gray-900">Acct #</TableHead>
                    <TableHead className="font-semibold text-gray-900">SR #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Min Need By Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Total Count</TableHead>
                    <TableHead className="font-semibold text-gray-900">Total Lab Open</TableHead>
                    <TableHead className="font-semibold text-gray-900">Total AR Count</TableHead>
                  </>
                ) : (
                  // Item View Headers
                  <>
                    <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Item</TableHead>
                    <TableHead className="font-semibold text-gray-900">Item Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                    <TableHead className="font-semibold text-gray-900">Manufacturer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Model</TableHead>
                    <TableHead className="font-semibold text-gray-900">Serial Number</TableHead>
                    <TableHead className="font-semibold text-gray-900">Type</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Assigned To</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasSearched ? (
                <TableRow>
                  <TableCell colSpan={currentView === 'batch' ? 8 : 11} className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      Please enter search criteria in the Work Order Search above to view results
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {currentView === 'batch' ? (
                    // Batch View - Show Work Order Batches
                    paginatedBatches.map((batch) => (
                  <TableRow
                    key={batch.id}
                    className="hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    onClick={() => openBatchDetails(batch)}
                  >
                    <TableCell className="font-medium text-blue-600">{batch.woBatch}</TableCell>
                    <TableCell>{batch.acctNumber}</TableCell>
                    <TableCell className="text-blue-600">{batch.srNumber}</TableCell>
                    <TableCell className="font-medium">{batch.customerName}</TableCell>
                    <TableCell>{batch.minNeedByDate}</TableCell>
                    <TableCell className="text-center font-medium">{batch.totalCount}</TableCell>
                    <TableCell className="text-center">{batch.totalLabOpen}</TableCell>
                    <TableCell className="text-center">{batch.totalArCount}</TableCell>
                  </TableRow>
                ))
              ) : (
                // Item View - Show Work Order Items
                paginatedWorkOrderItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    onClick={() => openDetailsFromItem(item)}
                  >
                    <TableCell className="font-medium text-blue-600">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleItemTypeClick(item, e)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/work-order/${item.workOrderId}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                        >
                          {item.workOrderNumber}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-order`);
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                      >
                        {item.itemNumber}
                      </button>
                    </TableCell>
                    <TableCell>{getItemStatusBadge(item.itemStatus)}</TableCell>
                    <TableCell>
                      <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                        item.priority === "Critical" ? "bg-red-100 text-red-800" :
                        item.priority === "High" ? "bg-orange-100 text-orange-800" :
                        item.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      )}>{item.priority}</span>
                    </TableCell>
                    <TableCell className="font-medium">{item.manufacturer}</TableCell>
                    <TableCell className="font-mono text-sm">{item.model}</TableCell>
                    <TableCell className="font-mono text-sm">{item.serialNumber}</TableCell>
                    <TableCell className="text-sm">
                      <button
                        onClick={(e) => handleItemTypeClick(item, e)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                      >
                        {item.itemType}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{item.customer}</TableCell>
                    <TableCell>{item.assignedTo}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              )}
              </>
            )}
            </TableBody>
          </Table>
        ) : (
          // Grid View - Cards
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!hasSearched ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Please enter search criteria in the Work Order Search above to view results
                </p>
              </div>
            ) : (
              <>
                {currentView === 'batch' ? (
                  paginatedBatches.map((batch) => (
                <div 
                  key={batch.id} 
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => openBatchDetails(batch)}
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-600 text-lg">{batch.woBatch}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div><h3 className="font-bold text-gray-900 text-lg mb-1">{batch.customerName}</h3></div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Account #:</span>
                        <div className="font-medium text-xs">{batch.acctNumber}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">SR #:</span>
                        <div className="font-medium text-xs text-blue-600">{batch.srNumber}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Min Need By:</span>
                      <div className="font-medium text-xs">{batch.minNeedByDate}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm border-t border-gray-100 pt-3">
                      <div className="text-center">
                        <span className="text-gray-500 block text-xs">Total Count</span>
                        <div className="font-bold text-lg text-gray-900">{batch.totalCount}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-500 block text-xs">Total Lab Open</span>
                        <div className="font-medium text-lg text-orange-600">{batch.totalLabOpen}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-500 block text-xs">Total AR Count</span>
                        <div className="font-medium text-lg text-blue-600">{batch.totalArCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              paginatedWorkOrderItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => openDetailsFromItem(item)}>
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleItemTypeClick(item, e)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/work-order/${item.workOrderId}`);
                            }}
                            className="font-bold text-blue-600 text-lg hover:text-blue-800 hover:underline transition-colors"
                          >
                            {item.workOrderNumber}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {getItemStatusBadge(item.itemStatus)}
                          <span className={cn("px-2 py-1 rounded-md text-xs font-medium",
                            item.priority === "Critical" ? "bg-red-100 text-red-800" :
                            item.priority === "High" ? "bg-orange-100 text-orange-800" :
                            item.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800")}>{item.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base mb-1">{item.customer}</h3>
                      <p className="text-sm text-gray-600">
                        Item: <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-order`);
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                        >
                          {item.itemNumber}
                        </button>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Manufacturer:</span>
                        <div className="font-medium text-xs">{item.manufacturer}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Model:</span>
                        <div className="font-mono text-xs">{item.model}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Serial Number:</span>
                        <div className="font-mono text-xs">{item.serialNumber}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <button
                          onClick={(e) => handleItemTypeClick(item, e)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs transition-colors block"
                        >
                          {item.itemType}
                        </button>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Assigned To:</span>
                        <div className="font-medium text-xs">{item.assignedTo}</div>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
              </>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {hasSearched && (
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, currentView === 'batch' ? filteredWorkOrderBatches.length : filteredWorkOrderItems.length)} of {currentView === 'batch' ? filteredWorkOrderBatches.length : filteredWorkOrderItems.length} items
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                  <SelectItem value="999999">All items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            {(() => {
              const pageNumbers = [];
              const maxPagesToShow = 5;
              
              if (totalPages <= maxPagesToShow + 2) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      className="min-w-[40px]"
                    >
                      {i}
                    </Button>
                  );
                }
              } else {
                // Always show first page
                pageNumbers.push(
                  <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className="min-w-[40px]"
                  >
                    1
                  </Button>
                );
                
                // Show ellipsis or pages near current page
                if (currentPage > 3) {
                  pageNumbers.push(
                    <span key="ellipsis1" className="px-2 text-gray-500">...</span>
                  );
                }
                
                // Show pages around current page
                const startPage = Math.max(2, currentPage - 1);
                const endPage = Math.min(totalPages - 1, currentPage + 1);
                
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      className="min-w-[40px]"
                    >
                      {i}
                    </Button>
                  );
                }
                
                // Show ellipsis before last page
                if (currentPage < totalPages - 2) {
                  pageNumbers.push(
                    <span key="ellipsis2" className="px-2 text-gray-500">...</span>
                  );
                }
                
                // Always show last page
                pageNumbers.push(
                  <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="min-w-[40px]"
                  >
                    {totalPages}
                  </Button>
                );
              }
              
              return pageNumbers;
            })()}
            
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
        )}
      </div>

      {/* Work Order Details Dialog */}
      <Dialog open={selectedWorkOrder !== null} onOpenChange={() => setSelectedWorkOrder(null)}>
        {(() => {
          console.log('Dialog rendering - selectedWorkOrder:', selectedWorkOrder?.id, 'currentView:', currentView);
          if (selectedWorkOrder && currentView === 'batch') {
            return <DefaultWorkOrderDetailsDialog order={selectedWorkOrder} />;
          } else if (selectedWorkOrder && currentView === 'item') {
            return <DefaultWorkOrderDetailsDialog order={selectedWorkOrder} />;
          }
          return null;
        })()}
      </Dialog>

      {/* Batch Details Dialog */}
      <Dialog open={selectedBatch !== null} onOpenChange={() => setSelectedBatch(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="overflow-y-auto max-h-[85vh]">
            {selectedBatch && (
              <WorkOrderBatchDetails 
                batchId={selectedBatch.id}
                onBack={() => setSelectedBatch(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModernWorkOrdersTable;