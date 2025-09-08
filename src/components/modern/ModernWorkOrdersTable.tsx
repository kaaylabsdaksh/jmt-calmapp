import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { List, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkOrder {
  id: string;
  status: "In Lab" | "Completed" | "Overdue" | "Pending" | "[Open Items]" | "[Awaiting CDR]" | "[Assign/Tech - Repair - InLab]" | "[Assigned To Tech - Repair Dept]" | "[Q/A Hold - Q/A Disapproved]" | "[Q/A Insp - Q/A Hold - Q/A Fail]" | "[In Lab - Assigned to Tech]" | "[In Lab - Q/A Disapprove]" | "[Estimate - A/R Invoicing]" | "[To Factory - Awaiting Parts]" | "[AR Need By Status]" | "Assigned to Tech" | "In Transit" | "Lab Management" | "Repair Department" | "Rotation" | "Estimate" | "Awaiting Parts" | "Awaiting PR Approval" | "In Metrology" | "To Factory" | "To Factory - Repair by Replacement" | "To Factory - Warranty" | "Lab Hold" | "Q/A Inspection" | "Q/A Inspection - Fail Correction" | "Q/A Hold" | "Q/A Disapproved" | "Q/A Fail Log" | "A/R Invoicing" | "A/R Invoicing/Hold" | "Admin Processing" | "Back to Customer" | "Calibrated on Shelf" | "Cancelled" | "Item Not Found on Site" | "ME Review" | "Not Used" | "Onsite" | "Ready for Departure" | "Return to Lab for Processing" | "Scheduled" | "Surplus Stock" | "Waiting on Customer";
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
      itemType: "SINGLE (5)",
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
      itemType: "SINGLE (12)",
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
      itemType: "ESL - Meters (25)",
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
      itemType: "SINGLE (18)",
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
      itemType: "SINGLE (7)",
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
      itemType: "SINGLE (20)",
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
  }
];

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
    status: string;
    assignee: string;
    priority: string;
    manufacturer: string;
    division: string;
    dateFrom?: Date;
    dateTo?: Date;
    dateType: string;
  };
}

// ModernWorkOrdersTable Component - Clean version with only List/Grid toggle icons
const ModernWorkOrdersTable = ({ viewMode, onViewModeChange, searchFilters }: ModernWorkOrdersTableProps) => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [templateView, setTemplateView] = useState<boolean>(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  
  // Filter work orders based on search filters from parent and status
  const filteredWorkOrders = mockWorkOrders.filter(order => {
    // Debug logging
    console.log('Filtering with searchFilters:', searchFilters);
    
    // Status filter (using both activeStatusFilter and searchFilters.status)
    const statusFromParent = searchFilters.status.toLowerCase().replace(' ', '-');
    const statusMatch = (activeStatusFilter === 'all' && !statusFromParent) || 
      order.status.toLowerCase().replace(' ', '-') === activeStatusFilter ||
      (statusFromParent && order.status.toLowerCase().replace(' ', '-') === statusFromParent);
    
    // Global text search filter from parent
    const searchMatch = !searchFilters.globalSearch || 
      order.id.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.division.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.manufacturer.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.modelNumber.toLowerCase().includes(searchFilters.globalSearch.toLowerCase()) ||
      order.details.labCode.toLowerCase().includes(searchFilters.globalSearch.toLowerCase());
    
    // Priority filter
    const priorityMatch = !searchFilters.priority || 
      order.details.priority.toLowerCase() === searchFilters.priority.toLowerCase();
    
    // Manufacturer filter
    const manufacturerMatch = !searchFilters.manufacturer || 
      order.details.manufacturer.toLowerCase().includes(searchFilters.manufacturer.toLowerCase());
    
    // Division filter
    const divisionMatch = !searchFilters.division || 
      order.division.toLowerCase().includes(searchFilters.division.toLowerCase());
    
    return statusMatch && searchMatch && priorityMatch && manufacturerMatch && divisionMatch;
  });
  
  const totalPages = Math.ceil(filteredWorkOrders.length / itemsPerPage);

  const openDetails = (order: WorkOrder) => {
    setSelectedWorkOrder(order);
  };

  const handleEditWorkOrder = (workOrderId: string) => {
    navigate(`/work-order/${workOrderId}`);
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

  // Template Work Order Details Dialog Component
  const TemplateWorkOrderDetailsDialog = ({ order }: { order: WorkOrder }) => (
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
                  <span className="text-gray-500 text-sm font-medium">Original LOC:</span>
                  <div className="font-mono text-sm">{order.details.originalLoc}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Dest LOC:</span>
                  <div className="font-mono text-sm">{order.details.destLoc}</div>
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
                <div>
                  <span className="text-gray-500 text-sm font-medium">JM PO#:</span>
                  <div className="font-mono text-sm">{order.details.jmPoNumber}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">TS:</span>
                  <div className="font-mono text-sm">{order.details.ts}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">Hotlist:</span>
                  <div className="font-mono text-sm">{order.details.hotlist || "N/A"}</div>
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
                {templateView ? (
                  // Template View Headers
                  <>
                    <TableHead className="font-semibold text-gray-900">Work Order #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Item</TableHead>
                    <TableHead className="font-semibold text-gray-900">Division</TableHead>
                    <TableHead className="font-semibold text-gray-900">Created Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Item Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Due Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Manufacturer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Model</TableHead>
                    <TableHead className="font-semibold text-gray-900">Template</TableHead>
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
                      <TableCell className="text-sm">{order.details.createdDate}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.dueDate}</TableCell>
                      <TableCell className="font-medium">{order.details.manufacturer}</TableCell>
                      <TableCell className="font-medium">{order.customer}</TableCell>
                      <TableCell className="font-mono text-sm">{order.details.modelNumber}</TableCell>
                      <TableCell className="text-blue-600 underline cursor-pointer hover:text-blue-800">{order.details.template}</TableCell>
                       <TableCell></TableCell>
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
                       <TableCell></TableCell>
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
        {selectedWorkOrder && templateView && <TemplateWorkOrderDetailsDialog order={selectedWorkOrder} />}
        {selectedWorkOrder && !templateView && <DefaultWorkOrderDetailsDialog order={selectedWorkOrder} />}
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
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernWorkOrdersTable;