import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Save, X, Package, Truck, Settings, Info, Layers, List, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Menu, CalendarIcon, Check, ChevronsUpDown, Eye, Trash2, FileText, Camera, User, Shield, Wrench, Activity, MessageSquare, AlertCircle, DollarSign, Paperclip, Upload, Printer, Mail, CheckCircle, XCircle, Clock, ExternalLink, ArrowUp, Pencil, ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { FixedActionFooter } from "@/components/FixedActionFooter";
import { EstimateDetails } from "@/components/EstimateDetails";
import { QF3Dialog } from "@/components/QF3Dialog";
import { WorkOrderItemComments } from "@/components/WorkOrderItemComments";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const FormVariationsDemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Layout variant state
  const [layoutVariant, setLayoutVariant] = useState<'default' | 'minimal' | 'accordion' | 'bento'>('accordion');
  
  // Accordion density state: 'compact' = ultra-compact, 'normal' = standard spacing
  const [accordionDensity, setAccordionDensity] = useState<'compact' | 'normal'>('compact');
  
  // Accordion expand/collapse state
  const eslAccordionValues = ['general', 'details', 'testing', 'work-status'];
  const singleAccordionValues = ['general', 'product', 'logistics', 'lab-cost', 'factory', 'transit', 'parts', 'images', 'additional', 'activity-log'];
  const [openAccordions, setOpenAccordions] = useState<string[]>(['general']);
  
  // Main section state
  const [activeSection, setActiveSection] = useState<'work-order-items' | 'estimate' | 'qf3' | 'external-files' | 'cert-files'>('work-order-items');
  
  // ESL Tab state - track which tab is active for footer visibility
  const [activeEslTab, setActiveEslTab] = useState<string>('general');
  
  // Scroll to top button state
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Item navigation state
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const totalItems = 5; // Mock total items - in real app this would come from data
  
  // Scroll section tracking for minimal variant
  const [activeScrollSection, setActiveScrollSection] = useState('general');
  
  // Refs for each section
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  
  // Dynamic footer height state
  const [footerHeight, setFooterHeight] = useState(80); // Default fallback
  
  const sections = [
    { id: 'general', label: 'General', icon: Info },
    { id: 'product', label: 'Product', icon: Package },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'product-images', label: 'Images', icon: Camera },
    { id: 'cost', label: 'Cost', icon: DollarSign },
    { id: 'lab', label: 'Lab', icon: Settings },
    { id: 'factory-config', label: 'Factory', icon: Settings },
    { id: 'transit', label: 'Transit', icon: Truck },
    { id: 'accessories', label: 'Accessories', icon: Layers },
    { id: 'parts', label: 'Parts', icon: Wrench },
    { id: 'options', label: 'Options', icon: List },
  ];

  // Scroll spy effect
  useEffect(() => {
    if (layoutVariant !== 'minimal') return;

    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const scrollPosition = viewport.scrollTop + 150; // Increased offset for better detection

      // Show scroll-to-top button when scrolled down more than 300px
      setShowScrollTop(viewport.scrollTop > 300);

      // Find the section that's currently in view
      let currentSection = sections[0].id;
      
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const elementTop = element.offsetTop;
          
          if (scrollPosition >= elementTop) {
            currentSection = section.id;
          }
        }
      }
      
      setActiveScrollSection(currentSection);
    };

    // Initial call to set the active section
    handleScroll();

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [layoutVariant, sections]);

  // Scroll detection for default/tabbed layout
  useEffect(() => {
    if (layoutVariant === 'minimal') return;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [layoutVariant]);

  // Scroll to top function
  const scrollToTop = () => {
    if (layoutVariant === 'minimal') {
      scrollViewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Item navigation functions
  const handlePreviousItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      // In real app, this would load the previous item's data
      console.log('Navigate to previous item:', currentItemIndex - 1);
    }
  };

  const handleNextItem = () => {
    if (currentItemIndex < totalItems - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      // In real app, this would load the next item's data
      console.log('Navigate to next item:', currentItemIndex + 1);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    const viewport = scrollViewportRef.current;
    
    if (element && viewport) {
      const elementTop = element.offsetTop;
      viewport.scrollTo({ top: elementTop - 20, behavior: 'smooth' });
    }
  };
  
  // User role state for testing different footers
  const [userRole, setUserRole] = useState<'admin' | 'technician'>('technician');
  
  // QF3 Dialog state
  const [qf3DialogOpen, setQf3DialogOpen] = useState(false);
  
  // QF3 Section state
  const [qf3Data, setQf3Data] = useState({
    // Equipment Info (read-only)
    itemStatus: "To Factory",
    tfStatus: "Assigned to Clerk",
    manufacturer: "FLYGT",
    model: "READY 8",
    labCode: "ES-Electrical Safety",
    mfgSerial: "112",
    custId: "1212",
    description: "SUBMERSIBLE PUMP",
    // Return Details
    reasonForReturn: "",
    vendorToPerform: "",
    malfunctionInstructions: "",
    technician1: "",
    repairComments: "",
    // Vendor Info
    vendorId: "5336",
    vendorSub: "",
    vendorName: "Troxler Electronic Labs",
    vendorEmail: "Luis Burruel sales@trulok.com",
    vendorPhone: "310-640-6123",
    vendorAddress: "3008 Cornwallis Road\nResearch Triangle Pk, NC 27709",
    vendorLastModified: "Blair Brewer\n08/19/2024 10:11 AM",
    // Vendor Details
    flatRateRepair: "N",
    eval: "N",
    evalFee: "0.00",
    originalApprDate: "",
    criticality: "",
    iso9001Registered: "N",
    qf133Issued: "N",
    oem: "Y",
    qf131OnFile: "N",
    qualBasedOn: "OEM",
    z540Accred: "N",
    vendorStatus: "Active",
    approvalExpires: "11/01/2024",
    // Additional Info
    rma: "N",
    vendorForm: "N",
    portal: "N",
    // Cost Section
    jmCostEstEval: "",
    custCostEstEval: "",
    jmCostOther: "",
    custCostOther: "",
    jmCostFreight: "",
    custCostFreight: "",
    // File Upload
    qf3DocType: "",
    qf3DocTags: [] as string[],
  });

  const handleQf3InputChange = (field: string, value: string | string[]) => {
    setQf3Data(prev => ({ ...prev, [field]: value }));
  };

  const handleQf3DocTagToggle = (tag: string) => {
    setQf3Data(prev => ({
      ...prev,
      qf3DocTags: prev.qf3DocTags.includes(tag)
        ? prev.qf3DocTags.filter(t => t !== tag)
        : [...prev.qf3DocTags, tag]
    }));
  };

  const qf3DocTags = [
    "Customer Approval",
    "Customer ID List", 
    "Customer Notes",
    "Emails",
    "Equipment Submission Form"
  ];

  // Calculate QF3 totals
  const qf3JmTotal = (parseFloat(qf3Data.jmCostEstEval || "0") + parseFloat(qf3Data.jmCostOther || "0") + parseFloat(qf3Data.jmCostFreight || "0")).toFixed(2);
  const qf3CustTotal = (parseFloat(qf3Data.custCostEstEval || "0") + parseFloat(qf3Data.custCostOther || "0") + parseFloat(qf3Data.custCostFreight || "0")).toFixed(2);
  
  // Common state for both interfaces
  const [showManufacturerDialog, setShowManufacturerDialog] = useState(false);
  const [newManufacturerName, setNewManufacturerName] = useState("");
  const [manufacturerDropdownOpen, setManufacturerDropdownOpen] = useState(false);
  const [manufacturerSearchValue, setManufacturerSearchValue] = useState("");
  
  // Model dropdown state
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [modelSearchValue, setModelSearchValue] = useState("");
  
  // PR dialog state
  const [showPRDialog, setShowPRDialog] = useState(false);
  const [newPRData, setNewPRData] = useState({
    manufacturer: "",
    model: "",
    range: "",
    option: "",
    accuracy: "",
    description: "",
    labCode: ""
  });

  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [assigneeSearchValue, setAssigneeSearchValue] = useState("");

  // Status change dialog state
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState("");
  const [statusChangeComment, setStatusChangeComment] = useState("");

  // Certificate file dialog state
  const [showDeleteCertDialog, setShowDeleteCertDialog] = useState(false);
  
  // External files state
  const [externalFilesDocType, setExternalFilesDocType] = useState<string>("");
  const [externalFilesSelectedItems, setExternalFilesSelectedItems] = useState<string[]>([]);
  const [externalFilesSelectedTags, setExternalFilesSelectedTags] = useState<string[]>([]);
  const [externalFilesDragging, setExternalFilesDragging] = useState(false);
  const [externalFilesUploaded, setExternalFilesUploaded] = useState<{
    id: string;
    name: string;
    type: string;
    tags: string[];
    items: string[];
    uploadedBy: string;
    uploadedDate: string;
  }[]>([]);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileData, setEditingFileData] = useState<{
    type: string;
    tags: string[];
    items: string[];
  } | null>(null);
  const [deletingFile, setDeletingFile] = useState<{ id: string; name: string } | null>(null);

  const manufacturers = [
    { value: "1m-working-stand", label: "1M WORKING STAND." },
    { value: "3d-instruments", label: "3D INSTRUMENTS" },
    { value: "3e", label: "3E" },
    { value: "3m", label: "3M" },
    { value: "3z-telecom", label: "3Z TELECOM" },
    { value: "4b-components-limited", label: "4B COMPONENTS LIMITED" },
    { value: "abbott", label: "ABBOTT" },
    { value: "abb", label: "ABB" },
    { value: "agilent", label: "AGILENT TECHNOLOGIES" },
    { value: "ametek", label: "AMETEK" },
    { value: "anritsu", label: "ANRITSU" },
    { value: "ansys", label: "ANSYS" },
    { value: "arcom", label: "ARCOM" },
    { value: "astro-med", label: "ASTRO-MED" },
    { value: "beckman-coulter", label: "BECKMAN COULTER" },
    { value: "bio-rad", label: "BIO-RAD" },
    { value: "bk-precision", label: "BK PRECISION" },
    { value: "broadcom", label: "BROADCOM" },
    { value: "california-instruments", label: "CALIFORNIA INSTRUMENTS" },
    { value: "chroma", label: "CHROMA" },
    { value: "danaher", label: "DANAHER" },
    { value: "emerson", label: "EMERSON" },
    { value: "fluke", label: "FLUKE CORPORATION" },
    { value: "ge", label: "GENERAL ELECTRIC" },
    { value: "honeywell", label: "HONEYWELL" },
    { value: "hp", label: "HEWLETT PACKARD" },
    { value: "ixia", label: "IXIA" },
    { value: "keithley", label: "KEITHLEY INSTRUMENTS" },
    { value: "keysight", label: "KEYSIGHT TECHNOLOGIES" },
    { value: "megger", label: "MEGGER" },
    { value: "national-instruments", label: "NATIONAL INSTRUMENTS" },
    { value: "omicron", label: "OMICRON ELECTRONICS" },
    { value: "rohde-schwarz", label: "ROHDE & SCHWARZ" },
    { value: "siemens", label: "SIEMENS" },
    { value: "tektronix", label: "TEKTRONIX" },
    { value: "thermo-fisher", label: "THERMO FISHER SCIENTIFIC" },
    { value: "yokogawa", label: "YOKOGAWA" },
  ];

  const models = [
    { value: "1000", label: "1000" },
    { value: "2000", label: "2000" },
    { value: "2700", label: "2700" },
    { value: "5520a", label: "5520A" },
    { value: "5560a", label: "5560A" },
    { value: "5730a", label: "5730A" },
    { value: "8846a", label: "8846A" },
    { value: "dmm7510", label: "DMM7510" },
    { value: "dpi-620", label: "DPI-620" },
    { value: "fluke-1594a", label: "FLUKE 1594A" },
    { value: "fluke-8845a", label: "FLUKE 8845A" },
    { value: "fluke-8846a", label: "FLUKE 8846A" },
    { value: "mfm-4000", label: "MFM-4000" },
    { value: "ms2090a", label: "MS2090A" },
    { value: "n4010a", label: "N4010A" },
    { value: "ppc4", label: "PPC4" },
    { value: "rpm4", label: "RPM4" },
    { value: "sdn-414", label: "SDN-414" },
  ];

  const assignees = [
    { value: "aaron-l-briles", label: "Aaron L Briles" },
    { value: "aaron-w-sibley", label: "Aaron W Sibley" },
    { value: "adam-d-eller", label: "Adam D. Eller" },
    { value: "alexander-j-shepard", label: "Alexander J Shepard" },
    { value: "alexander-l-harris", label: "Alexander L Harris" },
    { value: "alvin-j-milan", label: "Alvin J Milan" },
    { value: "alvin-j-johnson", label: "Alvin J. Johnson" },
    { value: "alzane-reyes", label: "Alzane Reyes" },
    { value: "amber-l-escontrias", label: "Amber L Escontrias" },
    { value: "andrea-d-jeansonne", label: "Andrea D. Jeansonne" },
    { value: "andy-m-futier", label: "Andy M Futier" },
    { value: "angel-anthony-g-moreno", label: "Angel-anthony G Moreno" },
    { value: "angie-l-paige", label: "Angie L. Paige" },
    { value: "ashleigh-l-jenkins", label: "Ashleigh L. Jenkins" },
    { value: "austin-a-behnken", label: "Austin A Behnken" },
    { value: "austin-h-bergman", label: "Austin H Bergman" },
    { value: "barry-h-weaver", label: "Barry H Weaver" },
    { value: "blain-g-scott-jr", label: "Blain G Scott Jr." },
    { value: "blair-brewer", label: "Blair Brewer" },
    { value: "blake-j-major", label: "Blake J Major" },
    { value: "brad-l-moulder", label: "Brad L. Moulder" },
    { value: "brandon-a-underwood", label: "Brandon A Underwood" },
    { value: "brandon-b-deramus", label: "Brandon B. DeRamus" },
    { value: "brandon-g-lowery", label: "Brandon G Lowery" },
    { value: "brandon-m-milum", label: "Brandon M Milum" },
    { value: "brandy-c-shorty", label: "Brandy C Shorty" },
    { value: "brandy-m-reynolds", label: "Brandy M Reynolds" },
    { value: "brian-e-broome", label: "Brian E. Broome" },
    { value: "bronson-w-sydow", label: "Bronson W Sydow" },
  ];

  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.label.toLowerCase().includes(manufacturerSearchValue.toLowerCase())
  );

  const filteredModels = models.filter(model =>
    model.label.toLowerCase().includes(modelSearchValue.toLowerCase())
  );

  const filteredAssignees = assignees.filter(assignee =>
    assignee.label.toLowerCase().includes(assigneeSearchValue.toLowerCase())
  );

  // Lab code options
  const labCodes = [
    { value: "a-mechanical-wm-gages", label: "A - Mechanical W&M Gages" },
    { value: "b-mech-pressure", label: "B - Mech Pressure" },
    { value: "c-dimensional", label: "C - Dimensional" },
    { value: "d-hydraulic-dweights", label: "D - Hydraulic Dweights" },
    { value: "e-pneumatic-dweights", label: "E - Pneumatic Dweights" },
    { value: "es-electrical-safety", label: "ES - Electrical Safety" },
    { value: "f-digital-pressure", label: "F - Digital Pressure" },
    { value: "g-electronics", label: "G - Electronics" },
    { value: "h-analytical-other", label: "H - Analytical/Other" },
    { value: "i-gravit-moist-analyz", label: "I - Gravit/Moist Analyz" },
    { value: "j-torque-force", label: "J - Torque/Force" },
    { value: "k-wt-chart-recorders", label: "K - W&T/Chart Recorders" },
    { value: "l-gas-detection", label: "L - Gas Detection" },
    { value: "lmo-lab-management-off", label: "LMO - Lab Management Off." },
    { value: "m-multimeters-meters", label: "M - Multimeters/Meters" },
    { value: "ml-main-lab", label: "ML - Main Lab" },
    { value: "n-electrical-test-gear", label: "N - Electrical Test Gear" },
    { value: "p-temperature", label: "P - Temperature" },
    { value: "q-low-frequency-ac", label: "Q - Low Frequency A/C" },
    { value: "r-oxygen-svce-gages", label: "R - Oxygen Svce Gages" },
    { value: "s-microwave-power", label: "S - Microwave/Power" },
    { value: "t-aircraft-support", label: "T - Aircraft Support" },
    { value: "u-optics", label: "U - Optics" },
    { value: "v-communications", label: "V - Communications" },
    { value: "z-fiber-optics", label: "Z - Fiber Optics" },
  ];

  // Function to determine lab code based on manufacturer and model
  const getLabCodeForManufacturerModel = (manufacturer: string, model: string): string => {
    // Mapping logic based on manufacturer and model
    const manufacturerLower = manufacturer.toLowerCase();
    const modelLower = model.toLowerCase();
    
    // Fluke products - mostly digital pressure and multimeters
    if (manufacturerLower.includes('fluke')) {
      if (modelLower.includes('1594') || modelLower.includes('temp')) {
        return 'p-temperature';
      }
      if (modelLower.includes('8845') || modelLower.includes('8846') || modelLower.includes('multimeter')) {
        return 'm-multimeters-meters';
      }
      return 'f-digital-pressure';
    }
    
    // Keysight - electronics and communications
    if (manufacturerLower.includes('keysight') || manufacturerLower.includes('agilent')) {
      if (modelLower.includes('n4010') || modelLower.includes('network')) {
        return 'v-communications';
      }
      return 'g-electronics';
    }
    
    // Tektronix - typically electronics
    if (manufacturerLower.includes('tektronix')) {
      return 'g-electronics';
    }
    
    // Default mappings by model type
    if (modelLower.includes('pressure') || modelLower.includes('dpi')) {
      return 'f-digital-pressure';
    }
    if (modelLower.includes('temp') || modelLower.includes('temperature')) {
      return 'p-temperature';
    }
    if (modelLower.includes('dmm') || modelLower.includes('multimeter')) {
      return 'm-multimeters-meters';
    }
    
    // Default to main lab if no specific match
    return 'ml-main-lab';
  };

  // State for accessories list
  const [accessoriesList, setAccessoriesList] = useState<Array<{
    id: string;
    type: string;
    accessory: string;
    material: string;
    color: string;
    qty: string;
  }>>([]);

  // State for parts list
  const [partsList, setPartsList] = useState<Array<{
    id: string;
    category: string;
    partNumber: string;
    description: string;
    cost: string;
    qty: string;
  }>>([]);

  const [formData, setFormData] = useState({
    // Work Order Header
    workOrderNumber: "5432",
    srDoc: "SR2244",
    salesperson: "Not assigned",
    contact: "",
    
    // General Information
    type: "",
    reportNumber: "",
    itemStatus: "in-lab",
    rotationSubStatus: "",
    tfStatus: "",
    tfClerk: "",
    tfFollowup: "",
    assignedTo: "",
    priority: "normal",
    location: "baton-rouge",
    division: "lab",
    calFreqInterval: "monthly",
    calFreq: "",
    actionCode: "",
    
    // Product Information
    manufacturer: "",
    model: "",
    labCode: "",
    mfgSerial: "",
    costId: "",
    costSerial: "",
    rfid: "",
    quantity: "",
    description: "",
    
    // Logistics Information
    arrivalDate: "",
    arrivalType: "",
    arrivalLocation: "",
    driver: "",
    puDate: "",
    shipType: "",
    name: "",
    poLineNumber: "",
    needBy: "",
    deliverByDate: "",
    
    // Departure Information
    invNumber: "INV-2025-001234",
    dtNumber: "DT-802930-001",
    deliveryStatus: "",
    
    // Options
    warranty: false,
    estimate: false,
    newEquip: false,
    usedSurplus: false,
    iso17025: false,
    hotList: false,
    readyToBill: false,
    inQa: false,
    toShipping: false,
    multiParts: false,
    lostEquipment: false,
    redTag: false,
    
    // Factory Information  
    toFactory: false,
    tfPoNumber: "",
    noTfCert: false,
    certFile: "",
    vendorRmaNumber: "",
    uploadCert: "",
    
    // Product Accessories
    accessoryType: "",
    accessoryColor: "",
    accessory: "",
    accessoryMaterial: "",
    accessoryQty: "",
    
    // Parts
    partsCategory: "",
    partsNumber: "",
    partsDescription: "",
    partsCost: "",
    partsQty: "",
    
    // Comments
    commentType: "",
    comment: "",
    includeInCopyAsNew: false,
    
    // Purchase Order Information  
    poNumber: "",
    poLine: "",
    soNumber: "",
    jmPartsPoNumber: "",
    
    // Additional Options checkboxes
    returned: false,
    coOverride: false,
    dateValidOverride: false,
    coStdCheckOverride: false,
    
    // Transit Information
    originLocation: "",
    destinationLocation: "",
    huQty: "",
    huType: "",
    deliverTo: "",
    deliveryType: "",
    transitNotes: "",
    transitQty: "",
    
    // Lab Information (for BUILD NEW action code)
    conditionIn: "",
    conditionOut: "",
    technician1: "",
    technician2: "",
    technician3: "",
    addComment: "",
    repairComments: "",
    certificationDate: "",
    recalibrationDate: "",
    labTempUnit: "#",
    labTempValue: "",
    labRhUnit: "#",
    labRhValue: "",
    standardsUsed: "",
    calProcedureUsed: "",
    procedureFiles: "",
    calCertCost: 0,
    repairCost: 0,
    totalCost: 0,
    completionDate: "",
    testDate: "",
    retestDate: "",
    procedureUsed: "",
    // ESL-specific fields
    departureType: "",
    departureDate: "",
    collAcct: "",
    trackingNumber: "",
    pickupName: "",
    dateTested: "",
    leadTechnician: "",
    miscInformation: "",
    // Details tab - ESL specific
    itemClass: "",
    size: "",
    color: "",
    slot: false,
    eyelets: false,
    zip: false,
    eslId: "",
    custIdDetail: "",
    tagNumber: "",
    
    // Cost Information
    ccCost: "0.00",
    cost17025: "0.00",
    expediteCost: "0.00",
    emergencyCost: "0.00",
    evalFeeCost: "0.00",
    repairCostTotal: "0.00",
    eslTestCost: "0.00",
    partsCostTotal: "24.00",
    tfCost: "0.00",
    // Labor Hours (9 fields: 3 techs × 3 cost categories)
    tech1CcHours: "0.00",
    tech1RepairHours: "0.00",
    tech1EslTestHours: "0.00",
    tech2CcHours: "0.00",
    tech2RepairHours: "0.00",
    tech2EslTestHours: "0.00",
    tech3CcHours: "0.00",
    tech3RepairHours: "0.00",
    tech3EslTestHours: "0.00",
    calCertTotal: "0.00",
    repairTotal: "24.00",
    allTotal: "24.00",
    showCostDetails: true,
  });

  // Activity Log state
  const [activityLogType, setActivityLogType] = useState("");
  const [activityLogComment, setActivityLogComment] = useState("");
  const [includeInCopyAsNew, setIncludeInCopyAsNew] = useState(false);
  const [filterActivityType, setFilterActivityType] = useState("all");
  const [filterActivityUser, setFilterActivityUser] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [showActivityLog, setShowActivityLog] = useState(true);
  const [activityHistory, setActivityHistory] = useState([
    {
      type: "Estimate",
      user: "Admin User",
      date: "10/22/2025 07:19 AM",
      details: "Estimate status set to 'Sent to Customer'. Emailed to JonathanAtkinson@thenewtronggroup.com."
    },
    {
      type: "Estimate",
      user: "Admin User",
      date: "10/22/2025 07:19 AM",
      details: "Estimate status set to 'Sent to AR'. Email was sent to TammyPatt@jmtest.com"
    },
    {
      type: "Estimate",
      user: "Admin User",
      date: "10/22/2025 07:19 AM",
      details: "Estimate status set to 'Awaiting Estimate'. Email was sent to tomcovers@jmtest.com;tracymincin@jmtest.com"
    },
    {
      type: "Other",
      user: "Admin User",
      date: "10/22/2025 07:18 AM",
      details: "C/C Cost updated."
    },
    {
      type: "Other",
      user: "Admin User",
      date: "10/22/2025 07:18 AM",
      details: "CHANGES: * Manufacturer/Model changed from '/' to '3D INSTRUMENTS/-30\"Hg-0-60 PSI' * Mfg Serial changed from '' to '312' * Cust ID changed from '' to '123' * Cust Serial changed from '' to '1234'"
    },
    {
      type: "Other",
      user: "Admin User",
      date: "10/22/2025 07:18 AM",
      details: "Need By Date changed to 10/23/2025"
    }
  ]);

  // Dynamic tabs based on type selection
  const isESLType = formData.type && (formData.type.startsWith('esl-') || formData.type.startsWith('itl-'));
  
  // Measure footer height dynamically
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    
    const updateHeight = () => {
      const height = footer.getBoundingClientRect().height;
      if (height > 0) {
        setFooterHeight(height + 24); // Add extra padding buffer
      }
    };
    
    // Initial measurement
    updateHeight();
    
    // Use ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(footer);
    
    return () => resizeObserver.disconnect();
  }, [activeSection, isESLType]);

  const firstRowTabs = isESLType 
    ? [
        { value: 'general', label: 'General', icon: Info },
        { value: 'details', label: 'Details', icon: FileText },
        { value: 'testing', label: 'Testing', icon: Settings },
        { value: 'work-status', label: 'Work Status', icon: Clock }
      ]
    : [
        { value: 'general', label: 'General', icon: Info },
        { value: 'cost', label: 'Cost', icon: DollarSign },
        { value: 'factory-config', label: 'Factory', icon: Settings },
        { value: 'transit', label: 'Transit', icon: Truck },
        { value: 'parts', label: 'Parts', icon: Settings },
        { value: 'options', label: 'Additional', icon: Settings },
        { value: 'activity-log', label: 'Comments', icon: MessageSquare }
      ];

  const secondRowTabs: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [];
  
  const [activeTab, setActiveTab] = useState('general');

  // Keyboard navigation for tabs
  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    const tabs = firstRowTabs.map(t => t.value);
    const currentIndex = tabs.indexOf(activeTab);
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(tabs[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(tabs[tabs.length - 1]);
    }
  };
  
  // Tab status tracking (completed, error, or null for untouched)
  const [tabStatus, setTabStatus] = useState<Record<string, 'completed' | 'error' | null>>({
    'general': null,
    'product': null,
    'logistics': null,
    'product-images': null,
    'cost': null,
    'lab': null,
    'factory-config': null,
    'transit': null,
    'accessories': null,
    'parts': null,
    'options': null
  });

  // Validate sections and update tab status
  useEffect(() => {
    const newStatus: Record<string, 'completed' | 'error' | null> = { ...tabStatus };
    
    // General tab validation
    if (formData.reportNumber || formData.type || formData.itemStatus) {
      newStatus['general'] = formData.reportNumber && formData.itemStatus ? 'completed' : 'error';
    }
    
    // Product tab validation
    if (formData.manufacturer || formData.model || formData.description) {
      newStatus['product'] = formData.manufacturer && formData.model ? 'completed' : 'error';
    }
    
    // Logistics tab validation
    if (formData.needBy || formData.arrivalDate) {
      newStatus['logistics'] = formData.needBy ? 'completed' : 'error';
    }
    
    // Lab tab validation
    if (formData.technician1 || formData.testDate) {
      newStatus['lab'] = formData.technician1 && formData.testDate ? 'completed' : 'error';
    }
    
    // Transit tab validation
    if (formData.originLocation || formData.destinationLocation) {
      newStatus['transit'] = formData.originLocation && formData.destinationLocation ? 'completed' : 'error';
    }
    
    // Additional/Options tab validation
    if (formData.needBy || formData.poNumber) {
      newStatus['options'] = formData.needBy && formData.poNumber ? 'completed' : 'error';
    }
    
    setTabStatus(newStatus);
  }, [formData]);

  // Reset active tab to 'general' when type changes between ESL and SINGLE
  useEffect(() => {
    if (formData.type) {
      setActiveTab('general');
    }
  }, [formData.type]);

  // Auto-scroll to next tab when reaching bottom of current tab content
  const isScrollingRef = useRef(false);
  const activeTabRef = useRef(activeTab);
  
  // Keep ref in sync with state
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // State for tab navigation indicators
  const [nextTabIndicator, setNextTabIndicator] = useState<string | null>(null);
  const [prevTabIndicator, setPrevTabIndicator] = useState<string | null>(null);

  useEffect(() => {
    // Disable auto-scroll for non-work-order-items sections and accordion mode
    if (layoutVariant === 'minimal' || layoutVariant === 'accordion' || !formData.type || activeSection !== 'work-order-items') return;

    // Define explicit tab order for non-ESL types
    const tabOrder = isESLType 
      ? ['general', 'details', 'testing', 'work-status']
      : ['general', 'cost', 'factory-config', 'transit', 'parts', 'options', 'activity-log'];

    const tabLabels: Record<string, string> = isESLType
      ? { 'general': 'General', 'details': 'Details', 'testing': 'Testing', 'work-status': 'Work Status' }
      : { 'general': 'General', 'cost': 'Cost', 'factory-config': 'Factory', 'transit': 'Transit', 'parts': 'Parts', 'options': 'Additional', 'activity-log': 'Comments' };

    const handleAutoTabScroll = () => {
      if (isScrollingRef.current) return;

      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollThreshold = 100;
      const indicatorThreshold = 300;
      const topThreshold = 280; // Threshold for detecting top of tab content

      const currentTab = activeTabRef.current;
      const currentTabIndex = tabOrder.indexOf(currentTab);
      const nextTab = tabOrder[currentTabIndex + 1];
      const prevTab = tabOrder[currentTabIndex - 1];

      // Indicators disabled - keeping auto-tab switching only
      setNextTabIndicator(null);
      setPrevTabIndicator(null);

      // Auto-switch to next tab when at bottom
      if (documentHeight - scrollPosition < scrollThreshold) {
        if (nextTab && currentTabIndex !== -1) {
          isScrollingRef.current = true;
          setNextTabIndicator(null);
          
          const contentArea = document.querySelector('[data-tab-content]');
          if (contentArea) {
            contentArea.classList.add('opacity-0', 'transition-opacity', 'duration-200');
          }
          
          setTimeout(() => {
            setActiveTab(nextTab);
            window.scrollTo({ top: 250, behavior: 'smooth' });
            
            setTimeout(() => {
              if (contentArea) {
                contentArea.classList.remove('opacity-0');
              }
              isScrollingRef.current = false;
            }, 300);
          }, 200);
        }
      }

      // Auto-switch to previous tab when at top (scrollY near 0)
      if (window.scrollY < 50 && prevTab && currentTabIndex > 0) {
        isScrollingRef.current = true;
        setPrevTabIndicator(null);
        
        const contentArea = document.querySelector('[data-tab-content]');
        if (contentArea) {
          contentArea.classList.add('opacity-0', 'transition-opacity', 'duration-200');
        }
        
        setTimeout(() => {
          setActiveTab(prevTab);
          // Scroll to bottom of previous tab
          setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight - 150, behavior: 'smooth' });
            setTimeout(() => {
              if (contentArea) {
                contentArea.classList.remove('opacity-0');
              }
              isScrollingRef.current = false;
            }, 300);
          }, 100);
        }, 200);
      }
    };

    window.addEventListener('scroll', handleAutoTabScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleAutoTabScroll);
  }, [layoutVariant, formData.type, isESLType, activeSection]);

  // Auto-populate lab code when manufacturer and model are selected
  useEffect(() => {
    if (formData.manufacturer && formData.model && !formData.labCode) {
      const labCode = getLabCodeForManufacturerModel(formData.manufacturer, formData.model);
      setFormData(prev => ({
        ...prev,
        labCode
      }));
    }
  }, [formData.manufacturer, formData.model]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const updates: any = { [field]: value };
      
      // Auto-populate report number when type is selected
      if (field === 'type' && value && typeof value === 'string') {
        const accountNumber = "0152.01";
        const workOrderNumber = formData.workOrderNumber || "802930";
        const itemNumber = "001";
        
        if (value === 'single') {
          // SINGLE type: accountNumber-workOrderNumber-itemNumber
          updates.reportNumber = `${accountNumber}-${workOrderNumber}-${itemNumber}`;
        } else if (value.startsWith('esl-')) {
          // ESL type: accountNumber-workOrderNumber-(ESL type)
          const eslType = value.replace('esl-', '');
          updates.reportNumber = `${accountNumber}-${workOrderNumber}-${eslType}`;
          // Set default values for ESL types
          updates.priority = 'normal';
          updates.location = 'baton-rouge';
          updates.division = 'esl';
          updates.actionCode = 'test';
        } else if (value.startsWith('itl-')) {
          // ITL type: accountNumber-workOrderNumber-(ITL type)
          const itlType = value.replace('itl-', '');
          updates.reportNumber = `${accountNumber}-${workOrderNumber}-${itlType}`;
        }
      }
      
      return {
        ...prev,
        ...updates
      };
    });
  };

  const handleSave = () => {
    console.log("Saving work order item:", formData);
    // Navigate back to main work order page
    navigate("/add-new-work-order", { state: { from: 'work-order-items' } });
  };

  const handleCancel = () => {
    // Navigate back to main work order page
    navigate("/add-new-work-order", { state: { from: 'work-order-items' } });
  };

  const handleAddNewManufacturer = () => {
    if (newManufacturerName.trim()) {
      handleInputChange("manufacturer", newManufacturerName.trim());
      setNewManufacturerName("");
      setShowManufacturerDialog(false);
    }
  };

  const handleCancelManufacturer = () => {
    setNewManufacturerName("");
    setShowManufacturerDialog(false);
  };

  // PR dialog handlers
  const handleAddNewPR = () => {
    // Validate mandatory fields
    if (!newPRData.model.trim() || !newPRData.description.trim() || !newPRData.labCode) {
      toast({
        title: "Validation Error",
        description: "Please fill in all mandatory fields: Model, Description, and Lab Code.",
        variant: "destructive",
      });
      return;
    }
    
    // In real app, this would save the PR to database
    console.log('Adding new PR:', newPRData);
    toast({
      title: "PR Added",
      description: `Successfully added PR for ${newPRData.manufacturer}`,
    });
    setNewPRData({
      manufacturer: "",
      model: "",
      range: "",
      option: "",
      accuracy: "",
      description: "",
      labCode: ""
    });
    setShowPRDialog(false);
  };

  const handleCancelPR = () => {
    setNewPRData({
      manufacturer: "",
      model: "",
      range: "",
      option: "",
      accuracy: "",
      description: "",
      labCode: ""
    });
    setShowPRDialog(false);
  };

  const handlePRDataChange = (field: string, value: string) => {
    setNewPRData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenPRDialog = () => {
    if (!formData.manufacturer) {
      toast({
        title: "Manufacturer Required",
        description: "Please select a manufacturer before adding a PR.",
        variant: "destructive",
      });
      return;
    }
    setNewPRData({
      manufacturer: formData.manufacturer,
      model: "",
      range: "",
      option: "",
      accuracy: "",
      description: "",
      labCode: ""
    });
    setShowPRDialog(true);
  };

  // Status change handlers
  const handleStatusChangeAttempt = (newStatus: string) => {
    if (newStatus !== formData.itemStatus) {
      setPendingStatusChange(newStatus);
      setShowStatusChangeDialog(true);
    }
  };

  const handleConfirmStatusChange = () => {
    if (statusChangeComment.trim()) {
      handleInputChange("itemStatus", pendingStatusChange);
      setShowStatusChangeDialog(false);
      setPendingStatusChange("");
      setStatusChangeComment("");
      console.log("Status changed to:", pendingStatusChange, "Comment:", statusChangeComment);
    }
  };

  const handleCancelStatusChange = () => {
    setShowStatusChangeDialog(false);
    setPendingStatusChange("");
    setStatusChangeComment("");
  };

  // Accessories handlers
  const handleAddAccessory = () => {
    if (!formData.accessoryType || !formData.accessory || !formData.accessoryQty) {
      toast({
        title: "Missing required fields",
        description: "Please fill in Type, Accessory, and Quantity",
        variant: "destructive",
      });
      return;
    }
    
    const newAccessory = {
      id: Date.now().toString(),
      type: formData.accessoryType,
      accessory: formData.accessory,
      material: formData.accessoryMaterial,
      color: formData.accessoryColor,
      qty: formData.accessoryQty,
    };
    
    setAccessoriesList(prev => [...prev, newAccessory]);
    
    // Clear form fields after adding
    handleInputChange("accessoryType", "");
    handleInputChange("accessory", "");
    handleInputChange("accessoryMaterial", "");
    handleInputChange("accessoryColor", "");
    handleInputChange("accessoryQty", "");
  };

  const handleRemoveAccessory = (id: string) => {
    setAccessoriesList(prev => prev.filter(item => item.id !== id));
  };

  // Parts handlers
  const handleAddPart = () => {
    if (!formData.partsCategory || !formData.partsNumber || !formData.partsQty) {
      toast({
        title: "Missing required fields",
        description: "Please fill in Category, Part Number, and Quantity",
        variant: "destructive",
      });
      return;
    }

    const newPart = {
      id: Date.now().toString(),
      category: formData.partsCategory,
      partNumber: formData.partsNumber,
      description: formData.partsDescription,
      cost: formData.partsCost || "0.00",
      qty: formData.partsQty,
    };
    
    setPartsList(prev => [...prev, newPart]);
    
    // Clear form fields after adding
    handleInputChange("partsCategory", "");
    handleInputChange("partsNumber", "");
    handleInputChange("partsDescription", "");
    handleInputChange("partsCost", "");
    handleInputChange("partsQty", "");
  };

  const handleRemovePart = (id: string) => {
    setPartsList(prev => prev.filter(item => item.id !== id));
  };

  // Certificate file handlers
  const handleViewCertificate = () => {
    console.log("Viewing certificate file:", formData.certFile);
    // In a real app, this would open the file
  };

  const handleDeleteCertificate = () => {
    setShowDeleteCertDialog(true);
  };

  const handleConfirmDeleteCertificate = () => {
    handleInputChange("certFile", "");
    setShowDeleteCertDialog(false);
  };

  const handleCancelDeleteCertificate = () => {
    setShowDeleteCertDialog(false);
  };

  // Set dummy file when certificate is required
  useEffect(() => {
    if (!formData.noTfCert && !formData.certFile) {
      handleInputChange("certFile", "certificate_sample_document.pdf");
    } else if (formData.noTfCert && formData.certFile) {
      handleInputChange("certFile", "");
    }
  }, [formData.noTfCert]);

  // Function to check if accordion section is complete
  const isSectionComplete = (section: string) => {
    switch (section) {
      case 'general':
        return !!(formData.type && formData.reportNumber);
      case 'product':
        return !!(formData.manufacturer && formData.model);
      case 'logistics':
        return !!(formData.arrivalDate || formData.puDate);
      case 'factory':
        return !!(formData.tfPoNumber || formData.vendorRmaNumber);
      case 'options':
        return Object.values(formData).some(value => typeof value === 'boolean' && value);
      default:
        return false;
    }
  };

  // Common form sections content
  const renderGeneralSection = (isAccordion = false) => {
    // ESL-specific layout with sub-tabs
    if (isESLType) {
      return (
        <div className="space-y-3">
          {/* Sub-accordions for ESL General Section */}
          <Accordion type="multiple" defaultValue={["general-info"]} className="space-y-0">
            <AccordionItem value="general-info" className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                General Information
              </AccordionTrigger>
              <AccordionContent className="pb-3">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-3 space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Report # <span className="text-destructive">*</span></Label>
                      <Input 
                        value={formData.reportNumber} 
                        readOnly 
                        className="h-7 bg-muted/50 cursor-not-allowed text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="itemStatus" className="text-xs font-medium">Item Status <span className="text-destructive">*</span></Label>
                      <Select value={formData.itemStatus} onValueChange={handleStatusChangeAttempt}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
                          <SelectItem value="in-lab">In Lab</SelectItem>
                          <SelectItem value="lab-management">Lab Management</SelectItem>
                          <SelectItem value="assigned-to-tech">Assigned to Tech</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                          <SelectItem value="in-metrology">In Metrology</SelectItem>
                          <SelectItem value="repair-department">Repair Department</SelectItem>
                          <SelectItem value="rotation">Rotation</SelectItem>
                          <SelectItem value="estimate">Estimate</SelectItem>
                          <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
                          <SelectItem value="awaiting-pr-approval">Awaiting PR Approval</SelectItem>
                          <SelectItem value="to-factory">To Factory</SelectItem>
                          <SelectItem value="to-factory-warranty">To Factory - Warranty</SelectItem>
                          <SelectItem value="to-factory-repair-replacement">To Factory - Repair by Replacement</SelectItem>
                          <SelectItem value="lab-hold">Lab Hold</SelectItem>
                          <SelectItem value="qa-inspection">Q/A Inspection</SelectItem>
                          <SelectItem value="qa-inspection-fail-correction">Q/A Inspection - Fail Correction</SelectItem>
                          <SelectItem value="qa-fail-log">Q/A Fail Log</SelectItem>
                          <SelectItem value="qa-hold">Q/A Hold</SelectItem>
                          <SelectItem value="qa-disapproved">Q/A Disapproved</SelectItem>
                          <SelectItem value="onsite">Onsite</SelectItem>
                          <SelectItem value="admin-processing">Admin Processing</SelectItem>
                          <SelectItem value="ar-invoicing-hold">A/R Invoicing/Hold</SelectItem>
                          <SelectItem value="me-review">ME Review</SelectItem>
                          <SelectItem value="ar-invoicing">A/R Invoicing</SelectItem>
                          <SelectItem value="waiting-on-customer">Waiting on Customer</SelectItem>
                          <SelectItem value="ready-for-departure">Ready for Departure</SelectItem>
                          <SelectItem value="back-to-customer">Back to Customer</SelectItem>
                          <SelectItem value="surplus-stock">Surplus Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="assignedTo" className="text-xs font-medium">Assigned To</Label>
                      <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="tech1">Technician 1</SelectItem>
                          <SelectItem value="tech2">Technician 2</SelectItem>
                          <SelectItem value="tech3">Technician 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="testFreq" className="text-xs font-medium">Test Freq <span className="text-destructive">*</span></Label>
                      <Input
                        id="testFreq"
                        value={formData.calFreq}
                        onChange={(e) => handleInputChange("calFreq", e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

                    <div className="space-y-1">
                      <Label htmlFor="priority" className="text-xs font-medium">Priority <span className="text-destructive">*</span></Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="rush">Rush</SelectItem>
                          <SelectItem value="expedite">Expedite</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="location" className="text-xs font-medium">Location <span className="text-destructive">*</span></Label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
                          <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
                          <SelectItem value="alexandria">Alexandria</SelectItem>
                          <SelectItem value="odessa">Odessa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="division" className="text-xs font-medium">Division <span className="text-destructive">*</span></Label>
                      <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="esl">ESL</SelectItem>
                          <SelectItem value="onsite">OnSite</SelectItem>
                          <SelectItem value="lab">Lab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="actionCode" className="text-xs font-medium">Action Code <span className="text-destructive">*</span></Label>
                      <Select value={formData.actionCode} onValueChange={(value) => handleInputChange("actionCode", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="test">TEST</SelectItem>
                          <SelectItem value="repair">REPAIR</SelectItem>
                          <SelectItem value="build-new">BUILD NEW</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="arrival-info" className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                Arrival Information
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="arrivalDate" className="text-xs font-medium">Date</Label>
                      <Input
                        id="arrivalDate"
                        type="date"
                        value={formData.arrivalDate}
                        onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="arrivalType" className="text-xs font-medium">Type</Label>
                      <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="jm-driver-pickup">JM Driver Pickup</SelectItem>
                          <SelectItem value="customer-dropoff">Customer Drop Off</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="departure-info" className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                Departure Information
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Date</Label>
                      <Input 
                        type="date" 
                        value={formData.departureDate || ""} 
                        onChange={(e) => handleInputChange("departureDate", e.target.value)} 
                        className="h-8 text-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Type</Label>
                      <Select value={formData.departureType} onValueChange={(value) => handleInputChange("departureType", value)}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="customer-pickup">Customer Pickup</SelectItem>
                          <SelectItem value="customer-surplus">Customer Surplus</SelectItem>
                          <SelectItem value="jm-driver-dropoff">JM Driver Dropoff</SelectItem>
                          <SelectItem value="scrapped-at-jm">Scrapped at JM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Inv #</Label>
                      <Input 
                        value={formData.invNumber || ""} 
                        readOnly 
                        className="h-8 text-sm bg-muted/50" 
                      />
                    </div>
                  </div>

                  {formData.departureType === "shipped" && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Ship Type</Label>
                        <Select value={formData.shipType} onValueChange={(value) => handleInputChange("shipType", value)}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select ship type" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border z-50">
                            <SelectItem value="fedex">FedEx</SelectItem>
                            <SelectItem value="ups">UPS</SelectItem>
                            <SelectItem value="usps">USPS</SelectItem>
                            <SelectItem value="freight">Freight</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Coll Acct</Label>
                        <Input 
                          value={formData.collAcct || ""} 
                          onChange={(e) => handleInputChange("collAcct", e.target.value)} 
                          className="h-8 text-sm" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Tracking #</Label>
                        <Input 
                          value={formData.trackingNumber || ""} 
                          onChange={(e) => handleInputChange("trackingNumber", e.target.value)} 
                          className="h-8 text-sm" 
                        />
                      </div>
                    </div>
                  )}

                  {formData.departureType === "customer-pickup" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Name</Label>
                      <Input 
                        value={formData.pickupName || ""} 
                        onChange={(e) => handleInputChange("pickupName", e.target.value)} 
                        placeholder="Enter name"
                        className="h-8 text-sm" 
                      />
                    </div>
                  )}

                  {formData.departureType === "jm-driver-dropoff" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Driver</Label>
                      <Select value={formData.driver} onValueChange={(value) => handleInputChange("driver", value)}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="aaron-briles">Aaron L Briles</SelectItem>
                          <SelectItem value="john-smith">John Smith</SelectItem>
                          <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery-status" className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                Delivery Status
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="p-3">
                  <Textarea
                    value={formData.deliveryStatus}
                    onChange={(e) => handleInputChange("deliveryStatus", e.target.value)}
                    placeholder="Enter delivery status..."
                    className="min-h-[120px] text-sm resize-none"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="other-info" className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                Other Information
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="p-3 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">PO Number <span className="text-destructive">*</span></Label>
                      <Input value={formData.poNumber} onChange={(e) => handleInputChange("poNumber", e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">JM Parts PO #</Label>
                      <Input value={formData.jmPartsPoNumber} onChange={(e) => handleInputChange("jmPartsPoNumber", e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">SO Number</Label>
                      <Input value={formData.soNumber} onChange={(e) => handleInputChange("soNumber", e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Need By <span className="text-destructive">*</span></Label>
                      <Input
                        type="date"
                        value={formData.needBy}
                        onChange={(e) => handleInputChange("needBy", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Deliver By Date</Label>
                      <Input
                        type="date"
                        value={formData.deliverByDate}
                        onChange={(e) => handleInputChange("deliverByDate", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Date Tested</Label>
                      <Input
                        type="date"
                        value={formData.dateTested}
                        onChange={(e) => handleInputChange("dateTested", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Transit Qty</Label>
                      <Input value={formData.transitQty} onChange={(e) => handleInputChange("transitQty", e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Lead Technician</Label>
                      <Select value={formData.leadTechnician} onValueChange={(value) => handleInputChange("leadTechnician", value)}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="tech1">Technician 1</SelectItem>
                          <SelectItem value="tech2">Technician 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="newEquip" checked={formData.newEquip as boolean} onCheckedChange={(checked) => handleInputChange("newEquip", checked)} className="h-4 w-4" />
                      <Label htmlFor="newEquip" className="text-sm cursor-pointer">New</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="hotList" checked={formData.hotList as boolean} onCheckedChange={(checked) => handleInputChange("hotList", checked)} className="h-4 w-4" />
                      <Label htmlFor="hotList" className="text-sm cursor-pointer">Hot List</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="toShipping" checked={formData.toShipping as boolean} onCheckedChange={(checked) => handleInputChange("toShipping", checked)} className="h-4 w-4" />
                      <Label htmlFor="toShipping" className="text-sm cursor-pointer">To Shipping</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="readyToBill" checked={formData.readyToBill as boolean} onCheckedChange={(checked) => handleInputChange("readyToBill", checked)} className="h-4 w-4" />
                      <Label htmlFor="readyToBill" className="text-sm cursor-pointer">Ready to Bill</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="lostEquipment" checked={formData.lostEquipment as boolean} onCheckedChange={(checked) => handleInputChange("lostEquipment", checked)} className="h-4 w-4" />
                      <Label htmlFor="lostEquipment" className="text-sm cursor-pointer">Lost Equipment</Label>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="misc-info" className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                Misc. Information
              </AccordionTrigger>
              <AccordionContent className="pb-3">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <Textarea
                    value={formData.miscInformation}
                    onChange={(e) => handleInputChange("miscInformation", e.target.value)}
                    placeholder="Enter miscellaneous information..."
                    className="min-h-[150px] text-xs"
                  />
                </CardContent>
              </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cost-info" className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                Cost Information
              </AccordionTrigger>
              <AccordionContent className="pb-3">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-3">
                  {renderTestingSection()}
                </CardContent>
              </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="accessories" className="border-b border-border">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                Accessories
              </AccordionTrigger>
              <AccordionContent className="pb-3">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-3 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Type <span className="text-destructive">*</span></Label>
                      <Select value={formData.accessoryType} onValueChange={(value) => handleInputChange("accessoryType", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="containers">Containers</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Accessory <span className="text-destructive">*</span></Label>
                      <Select value={formData.accessory} onValueChange={(value) => handleInputChange("accessory", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Select accessory" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="bag">Bag</SelectItem>
                          <SelectItem value="case">Case</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Material</Label>
                      <Select value={formData.accessoryMaterial} onValueChange={(value) => handleInputChange("accessoryMaterial", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="plastic">Plastic</SelectItem>
                          <SelectItem value="metal">Metal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Color</Label>
                      <Select value={formData.accessoryColor} onValueChange={(value) => handleInputChange("accessoryColor", value)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="bubble-wrap">Bubble wrap</SelectItem>
                          <SelectItem value="canvas">Canvas</SelectItem>
                          <SelectItem value="cardboard">Cardboard</SelectItem>
                          <SelectItem value="foam">Foam</SelectItem>
                          <SelectItem value="glass">Glass</SelectItem>
                          <SelectItem value="leather">Leather</SelectItem>
                          <SelectItem value="leather-fake">Leather, Fake</SelectItem>
                          <SelectItem value="metal">Metal</SelectItem>
                          <SelectItem value="nylon">Nylon</SelectItem>
                          <SelectItem value="paper">Paper</SelectItem>
                          <SelectItem value="plastic">Plastic</SelectItem>
                          <SelectItem value="pvc">PVC</SelectItem>
                          <SelectItem value="rubber">Rubber</SelectItem>
                          <SelectItem value="vinyl">Vinyl</SelectItem>
                          <SelectItem value="wood">Wood</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Qty <span className="text-destructive">*</span></Label>
                      <Input 
                        placeholder="1" 
                        className="h-7 text-xs" 
                        value={formData.accessoryQty}
                        onChange={(e) => handleInputChange("accessoryQty", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium invisible">Action</Label>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 text-xs px-3 w-full"
                        onClick={handleAddAccessory}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Checkbox id="includeInCreateNewGroup" className="h-3 w-3" />
                    <Label htmlFor="includeInCreateNewGroup" className="text-xs cursor-pointer">Include in Create New Group</Label>
                  </div>

                  {/* Accessories Table */}
                  {accessoriesList.length > 0 && (
                    <div className="border rounded-lg overflow-hidden mt-3">
                      <div className="bg-muted/50 grid grid-cols-6 p-2 text-xs font-medium">
                        <div>Type</div>
                        <div>Accessory</div>
                        <div>Material</div>
                        <div>Color</div>
                        <div>Qty</div>
                        <div>Actions</div>
                      </div>
                      <div className="divide-y">
                        {accessoriesList.map((item) => (
                          <div key={item.id} className="grid grid-cols-6 p-2 text-xs items-center">
                            <div className="capitalize">{item.type}</div>
                            <div className="capitalize">{item.accessory}</div>
                            <div className="capitalize">{item.material || '-'}</div>
                            <div className="capitalize">{item.color || '-'}</div>
                            <div>{item.qty}</div>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveAccessory(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comments" className="border-b border-border last:border-b-0">
              <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">
                Comments
              </AccordionTrigger>
              <AccordionContent className="pb-3">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-3 space-y-2">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Type</Label>
                      <Select>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Textarea
                      placeholder="Enter comment..."
                      className="min-h-[50px] text-xs"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Checkbox id="includeInCreateNewGroupComments" className="h-3 w-3" />
                        <Label htmlFor="includeInCreateNewGroupComments" className="text-xs cursor-pointer">Include in Create New Group</Label>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 text-xs px-3">Add</Button>
                    </div>
                  </div>

                  {/* Comments Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 grid grid-cols-4 p-1.5 text-xs font-medium">
                      <div>Type</div>
                      <div>User</div>
                      <div>Date Entered</div>
                      <div>Comment</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-4 p-1.5 text-xs">
                        <div>Other</div>
                        <div>Admin User</div>
                        <div>11/20/2025 05:35 AM</div>
                        <div>Status set to ASSIGNED TO TECH</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span>Page 1 of 1 (1 items)</span>
                      <Button variant="outline" size="sm" disabled className="h-6 text-xs">&lt;</Button>
                      <span className="px-1.5 py-0.5 bg-muted rounded text-xs">[1]</span>
                      <Button variant="outline" size="sm" disabled className="h-6 text-xs">&gt;</Button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Page size:</span>
                      <Select defaultValue="10">
                        <SelectTrigger className="h-6 w-14 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );
    }

    // Original SINGLE type layout
    return (
    <div className={isAccordion ? "space-y-3" : "space-y-6"}>
      {/* Created and Modified Dates */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-2 border-b border-border ${isAccordion ? "text-xs" : ""}`}>
        <div className={`${isAccordion ? "text-xs" : "text-sm"} text-muted-foreground`}>
          <span className="font-medium">Created:</span> 09/09/2025 by Admin User
        </div>
        
        <div className={`${isAccordion ? "text-xs" : "text-sm"} text-muted-foreground`}>
          <span className="font-medium">Modified:</span> 09/09/2025 by Admin User
        </div>
      </div>

      <div className={`grid ${isAccordion ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"} auto-rows-min`}>
        <div className={isAccordion ? "space-y-1" : "space-y-2"}>
          <Label htmlFor="itemStatus" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>Item Status</Label>
          <Select value={formData.itemStatus} onValueChange={handleStatusChangeAttempt}>
            <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
              <SelectItem value="in-lab">In Lab</SelectItem>
              <SelectItem value="lab-management">Lab Management</SelectItem>
              <SelectItem value="assigned-to-tech">Assigned to Tech</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="in-metrology">In Metrology</SelectItem>
              <SelectItem value="repair-department">Repair Department</SelectItem>
              <SelectItem value="rotation">Rotation</SelectItem>
              <SelectItem value="estimate">Estimate</SelectItem>
              <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
              <SelectItem value="awaiting-pr-approval">Awaiting PR Approval</SelectItem>
              <SelectItem value="to-factory">To Factory</SelectItem>
              <SelectItem value="to-factory-warranty">To Factory - Warranty</SelectItem>
              <SelectItem value="to-factory-repair-replacement">To Factory - Repair by Replacement</SelectItem>
              <SelectItem value="lab-hold">Lab Hold</SelectItem>
              <SelectItem value="qa-inspection">Q/A Inspection</SelectItem>
              <SelectItem value="qa-inspection-fail-correction">Q/A Inspection - Fail Correction</SelectItem>
              <SelectItem value="qa-fail-log">Q/A Fail Log</SelectItem>
              <SelectItem value="qa-hold">Q/A Hold</SelectItem>
              <SelectItem value="qa-disapproved">Q/A Disapproved</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="admin-processing">Admin Processing</SelectItem>
              <SelectItem value="ar-invoicing-hold">A/R Invoicing/Hold</SelectItem>
              <SelectItem value="me-review">ME Review</SelectItem>
              <SelectItem value="ar-invoicing">A/R Invoicing</SelectItem>
              <SelectItem value="waiting-on-customer">Waiting on Customer</SelectItem>
              <SelectItem value="ready-for-departure">Ready for Departure</SelectItem>
              <SelectItem value="back-to-customer">Back to Customer</SelectItem>
              <SelectItem value="surplus-stock">Surplus Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Rotation Sub Status field when status is "Rotation" */}
        {formData.itemStatus === "rotation" && (
          <div className={isAccordion ? "space-y-1" : "space-y-2"}>
            <Label htmlFor="rotationSubStatus" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>Rotation Sub Status</Label>
            <Select value={formData.rotationSubStatus} onValueChange={(value) => handleInputChange("rotationSubStatus", value)}>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}>
                <SelectValue placeholder="Select rotation sub status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
                <SelectItem value="awaiting-rotation">Awaiting Rotation</SelectItem>
                <SelectItem value="rotation-in-progress">Rotation In Progress</SelectItem>
                <SelectItem value="rotation-complete">Rotation Complete</SelectItem>
                <SelectItem value="rotation-on-hold">Rotation On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Conditional T/F fields when status is "To Factory" */}
        {formData.itemStatus === "to-factory" && (
          <>
            <div className={isAccordion ? "space-y-1" : "space-y-2"}>
              <Label htmlFor="tfStatus" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>T/F Status</Label>
              <Select value={formData.tfStatus} onValueChange={(value) => handleInputChange("tfStatus", value)}>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}>
                <SelectValue placeholder="Select T/F status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
                  <SelectItem value="await-cust-approval-est-fee">Await Cust Approval Est. Fee</SelectItem>
                  <SelectItem value="awaiting-customer-approval">Awaiting Customer Approval</SelectItem>
                  <SelectItem value="awaiting-factory">Awaiting Factory</SelectItem>
                  <SelectItem value="sent-to-factory">Sent to Factory</SelectItem>
                  <SelectItem value="back-from-factory">Back from Factory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={isAccordion ? "space-y-1" : "space-y-2"}>
              <Label htmlFor="tfClerk" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>T/F Clerk</Label>
              <Select value={formData.tfClerk} onValueChange={(value) => handleInputChange("tfClerk", value)}>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}>
                <SelectValue placeholder="Select clerk" />
                </SelectTrigger>
                <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
                  <SelectItem value="admin-user">Admin User</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={isAccordion ? "space-y-1" : "space-y-2"}>
              <Label htmlFor="tfFollowup" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>T/F Follow-up</Label>
              <Input
                id="tfFollowup"
                value={formData.tfFollowup}
                onChange={(e) => handleInputChange("tfFollowup", e.target.value)}
                placeholder="Enter follow-up notes"
                className={isAccordion ? "h-7 text-xs" : "h-11"}
              />
            </div>
          </>
        )}

        <div className={isAccordion ? "space-y-1" : "space-y-2"}>
          <Label htmlFor="priority" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>
            Priority {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
            <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50">
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="rush">Rush</SelectItem>
              <SelectItem value="expedite">Expedite</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={isAccordion ? "space-y-1" : "space-y-2"}>
          <Label htmlFor="location" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>
            Location {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
            <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
              <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
              <SelectItem value="alexandria">Alexandria</SelectItem>
              <SelectItem value="odessa">Odessa</SelectItem>
              <SelectItem value="clute">Clute</SelectItem>
              <SelectItem value="mattoon">Mattoon</SelectItem>
              <SelectItem value="groves">Groves</SelectItem>
              <SelectItem value="candia">Candia</SelectItem>
              <SelectItem value="san-angelo">San Angelo</SelectItem>
              <SelectItem value="berthold">Berthold</SelectItem>
              <SelectItem value="mount-braddock">Mount Braddock</SelectItem>
              <SelectItem value="port-arthur">Port Arthur</SelectItem>
              <SelectItem value="mathiston">Mathiston</SelectItem>
              <SelectItem value="billings">Billings</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="leechburg">Leechburg</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={isAccordion ? "space-y-1" : "space-y-2"}>
          <Label htmlFor="division" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>
            Division {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)}>
            <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}>
              <SelectValue placeholder="Select division" />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50">
              <SelectItem value="esl">ESL</SelectItem>
              <SelectItem value="onsite">OnSite</SelectItem>
              <SelectItem value="mfg">MFG</SelectItem>
              <SelectItem value="rental">Rental</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
              <SelectItem value="surplus">Surplus</SelectItem>
              <SelectItem value="esl-onsite">ESL OnSite</SelectItem>
              <SelectItem value="itl-onsite">ITL OnSite</SelectItem>
              <SelectItem value="gmfg">GMFG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={isAccordion ? "space-y-1" : "space-y-2"}>
          <Label className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>
            Cal Freq Interval {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <RadioGroup
            value={formData.calFreqInterval}
            onValueChange={(value) => handleInputChange("calFreqInterval", value)}
            className={`flex gap-3 ${isAccordion ? "pt-1" : ""}`}
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="monthly" id="monthly" className={isAccordion ? "h-3 w-3" : ""} />
              <Label htmlFor="monthly" className={`font-normal cursor-pointer ${isAccordion ? "text-xs" : ""}`}>Monthly</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="weekly" id="weekly" className={isAccordion ? "h-3 w-3" : ""} />
              <Label htmlFor="weekly" className={`font-normal cursor-pointer ${isAccordion ? "text-xs" : ""}`}>Weekly</Label>
            </div>
          </RadioGroup>
        </div>

        <div className={isAccordion ? "space-y-1" : "space-y-2"}>
          <Label htmlFor="calFreq" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>
            Cal Freq {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="calFreq"
            value={formData.calFreq}
            onChange={(e) => handleInputChange("calFreq", e.target.value)}
            placeholder="Enter calibration frequency"
            className={isAccordion ? "h-7 text-xs" : "h-11"}
          />
        </div>

        <div className={isAccordion ? "space-y-1" : "space-y-2"}>
          <Label htmlFor="actionCode" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>
            Action Code {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData.actionCode} onValueChange={(value) => handleInputChange("actionCode", value)}>
            <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}>
              <SelectValue placeholder="Select action code" />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50">
              <SelectItem value="build-new">BUILD NEW</SelectItem>
              <SelectItem value="cc">C/C</SelectItem>
              <SelectItem value="rc">R/C</SelectItem>
              <SelectItem value="test">TEST</SelectItem>
              <SelectItem value="verify">VERIFY</SelectItem>
              <SelectItem value="insure">INSURE</SelectItem>
              <SelectItem value="cc-d">C/C-D</SelectItem>
              <SelectItem value="cc-r">C/C-R</SelectItem>
              <SelectItem value="misc">MISC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={isAccordion ? "space-y-1" : "space-y-2"}>
          <Label htmlFor="assignedTo" className={`${isAccordion ? "text-xs" : "text-sm"} font-medium`}>Assigned To</Label>
          <Popover open={assigneeDropdownOpen} onOpenChange={setAssigneeDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={assigneeDropdownOpen}
                className={`w-full justify-between ${isAccordion ? "h-7 text-xs" : "h-11"}`}
              >
                {formData.assignedTo || "Select assignee"}
                <ChevronsUpDown className={`ml-2 shrink-0 opacity-50 ${isAccordion ? "h-3 w-3" : "h-4 w-4"}`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search assignee..." 
                  value={assigneeSearchValue}
                  onValueChange={setAssigneeSearchValue}
                />
                <CommandList>
                  <CommandEmpty>No assignee found.</CommandEmpty>
                  <CommandGroup>
                    {['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown', 'Diana Prince']
                      .filter(name => name.toLowerCase().includes(assigneeSearchValue.toLowerCase()))
                      .map((assignee) => (
                        <CommandItem
                          key={assignee}
                          value={assignee}
                          onSelect={(currentValue) => {
                            handleInputChange("assignedTo", currentValue === formData.assignedTo ? "" : currentValue);
                            setAssigneeDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.assignedTo === assignee ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {assignee}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
    );
  };

  const renderProductSection = (isAccordion = false) => (
    <div className={isAccordion ? "space-y-2" : "space-y-6"}>
      <div className={isAccordion ? "" : "Card border-0 shadow-md w-full"}>
        <div className={isAccordion ? "space-y-1" : "p-4 sm:p-6 space-y-4"}>
          <div className={`grid ${isAccordion ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"}`}>
            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="manufacturer" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>
                Manufacturer {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <div className="flex gap-1">
                <Popover open={manufacturerDropdownOpen} onOpenChange={setManufacturerDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={manufacturerDropdownOpen}
                      className={isAccordion ? "h-7 text-xs justify-between flex-1" : "h-11 justify-between flex-1"}
                    >
                      {formData.manufacturer
                        ? manufacturers.find((manufacturer) => manufacturer.value === formData.manufacturer)?.label
                        : "Select..."}
                      <ChevronsUpDown className={isAccordion ? "ml-1 h-3 w-3 shrink-0 opacity-50" : "ml-2 h-4 w-4 shrink-0 opacity-50"} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search manufacturer..." 
                        value={manufacturerSearchValue}
                        onValueChange={setManufacturerSearchValue}
                        className={isAccordion ? "h-7 text-xs" : ""}
                      />
                      <CommandList className={isAccordion ? "max-h-40" : ""}>
                        <CommandEmpty>
                          <div className="p-2 text-center">
                            <p className={isAccordion ? "text-xs text-muted-foreground mb-1" : "text-sm text-muted-foreground mb-2"}>No manufacturer found.</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={isAccordion ? "h-6 text-xs" : ""}
                              onClick={() => {
                                setNewManufacturerName(manufacturerSearchValue);
                                setShowManufacturerDialog(true);
                                setManufacturerDropdownOpen(false);
                              }}
                            >
                              Add "{manufacturerSearchValue}"
                            </Button>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredManufacturers.map((manufacturer) => (
                            <CommandItem
                              key={manufacturer.value}
                              value={manufacturer.value}
                              className={isAccordion ? "text-xs py-1" : ""}
                              onSelect={(currentValue) => {
                                handleInputChange("manufacturer", currentValue === formData.manufacturer ? "" : currentValue);
                                setManufacturerDropdownOpen(false);
                                setManufacturerSearchValue("");
                              }}
                            >
                              <Check
                                className={cn(
                                  isAccordion ? "mr-1 h-3 w-3" : "mr-2 h-4 w-4",
                                  formData.manufacturer === manufacturer.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {manufacturer.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowManufacturerDialog(true)}
                  className={isAccordion ? "h-7 px-2 text-xs" : "px-3"}
                >
                  +
                </Button>
              </div>
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="model" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>
                Model {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <div className="flex gap-1">
                <Popover open={modelDropdownOpen} onOpenChange={setModelDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={modelDropdownOpen}
                      className={isAccordion ? "h-7 text-xs justify-between flex-1" : "h-11 justify-between flex-1"}
                    >
                      {formData.model
                        ? models.find((model) => model.value === formData.model)?.label
                        : "Select..."}
                      <ChevronsUpDown className={isAccordion ? "ml-1 h-3 w-3 shrink-0 opacity-50" : "ml-2 h-4 w-4 shrink-0 opacity-50"} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search model..." 
                        value={modelSearchValue}
                        onValueChange={setModelSearchValue}
                        className={isAccordion ? "h-7 text-xs" : ""}
                      />
                      <CommandList className={isAccordion ? "max-h-40" : ""}>
                        <CommandEmpty>
                          <div className="p-2 text-center">
                            <p className={isAccordion ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"}>No model found.</p>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredModels.map((model) => (
                            <CommandItem
                              key={model.value}
                              value={model.value}
                              className={isAccordion ? "text-xs py-1" : ""}
                              onSelect={(currentValue) => {
                                handleInputChange("model", currentValue === formData.model ? "" : currentValue);
                                setModelDropdownOpen(false);
                                setModelSearchValue("");
                              }}
                            >
                              <Check
                                className={cn(
                                  isAccordion ? "mr-1 h-3 w-3" : "mr-2 h-4 w-4",
                                  formData.model === model.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {model.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenPRDialog}
                  className={isAccordion ? "h-7 px-2 text-xs whitespace-nowrap" : "px-3 whitespace-nowrap"}
                >
                  Add PR
                </Button>
              </div>
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="labCode" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>
                Lab Code {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Select value={formData.labCode} disabled>
                <SelectTrigger className={isAccordion ? "h-7 text-xs bg-muted cursor-not-allowed" : "h-11 bg-muted cursor-not-allowed"}>
                  <SelectValue placeholder="Select lab code" />
                </SelectTrigger>
                <SelectContent className="bg-popover border z-50 max-h-60 overflow-y-auto">
                  {labCodes.map((labCode) => (
                    <SelectItem key={labCode.value} value={labCode.value} className={isAccordion ? "text-xs" : ""}>
                      {labCode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="mfgSerial" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>
                MFG Serial {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="mfgSerial"
                value={formData.mfgSerial}
                onChange={(e) => handleInputChange("mfgSerial", e.target.value)}
                placeholder="Manufacturing serial"
                className={isAccordion ? "h-7 text-xs" : "h-11"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="costId" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>
                Cust ID {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="costId"
                value={formData.costId}
                onChange={(e) => handleInputChange("costId", e.target.value)}
                placeholder="Customer identifier"
                className={isAccordion ? "h-7 text-xs" : "h-11"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="costSerial" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>
                Cust Serial {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="costSerial"
                value={formData.costSerial}
                onChange={(e) => handleInputChange("costSerial", e.target.value)}
                placeholder="Customer serial"
                className={isAccordion ? "h-7 text-xs" : "h-11"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="rfid" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>RFID</Label>
              <Input
                id="rfid"
                value={formData.rfid}
                onChange={(e) => handleInputChange("rfid", e.target.value)}
                placeholder="RFID tag"
                className={isAccordion ? "h-7 text-xs" : "h-11"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="quantity" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>
                Quantity {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="1"
                className={isAccordion ? "h-7 text-xs" : "h-11"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="description" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>Description</Label>
              <Input
                id="description"
                value={formData.description}
                disabled
                placeholder="Product description"
                className={isAccordion ? "h-7 text-xs bg-muted" : "h-11 bg-muted"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="capableLoc" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>Capable Loc.</Label>
              <Input
                id="capableLoc"
                value=""
                disabled
                placeholder="Capable location"
                className={isAccordion ? "h-7 text-xs bg-muted" : "h-11 bg-muted"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="accuracy" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>Accuracy</Label>
              <Input
                id="accuracy"
                value=""
                disabled
                placeholder="Accuracy"
                className={isAccordion ? "h-7 text-xs bg-muted" : "h-11 bg-muted"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="ranges" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>Range(s)</Label>
              <Input
                id="ranges"
                value=""
                disabled
                placeholder="Range(s)"
                className={isAccordion ? "h-7 text-xs bg-muted" : "h-11 bg-muted"}
              />
            </div>

            <div className={isAccordion ? "space-y-0.5" : "space-y-2"}>
              <Label htmlFor="options" className={isAccordion ? "text-xs font-medium" : "text-sm font-medium"}>Option(s)</Label>
              <Input
                id="options"
                value=""
                disabled
                placeholder="Option(s)"
                className={isAccordion ? "h-7 text-xs bg-muted" : "h-11 bg-muted"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogisticsSection = (isAccordion = false) => (
    <div className={`grid grid-cols-1 lg:grid-cols-2 ${isAccordion ? "gap-4" : "gap-6"}`}>
      {/* Arrival Information */}
      {isAccordion ? (
        <div className="space-y-2">
          <div className="pb-2 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">Arrival Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="space-y-1">
              <Label htmlFor="arrivalDate" className="text-xs font-medium">
                Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-8 text-sm",
                      !formData.arrivalDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {formData.arrivalDate ? formData.arrivalDate : "dd/mm/yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.arrivalDate ? new Date(formData.arrivalDate) : undefined}
                    onSelect={(date) => handleInputChange("arrivalDate", date ? date.toISOString().split('T')[0] : "")}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label htmlFor="arrivalType" className="text-xs font-medium">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border z-50">
                  <SelectItem value="surplus">Surplus</SelectItem>
                  <SelectItem value="lab-standard">Lab Standard</SelectItem>
                  <SelectItem value="purchasing-dept">Purchasing Dept.</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="customer-dropoff">Customer Dropoff</SelectItem>
                  <SelectItem value="jm-driver-pickup">JM Driver Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.arrivalType === 'surplus' && (
              <div className="space-y-1">
                <Label htmlFor="arrivalLocation" className="text-xs font-medium">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.arrivalLocation} onValueChange={(value) => handleInputChange("arrivalLocation", value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="main-office">Main Office</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="loading-dock">Loading Dock</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.arrivalType === 'shipped' && (
              <div className="space-y-1">
                <Label htmlFor="shipType" className="text-xs font-medium">
                  Ship Type <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.shipType} onValueChange={(value) => handleInputChange("shipType", value)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select ship type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="dhl">DHL</SelectItem>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="usps">USPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.arrivalType === 'customer-dropoff' && (
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-medium">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter name"
                  className="h-8 text-sm"
                />
              </div>
            )}

            {formData.arrivalType === 'jm-driver-pickup' && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="driver" className="text-xs font-medium">
                    Driver <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.driver} onValueChange={(value) => handleInputChange("driver", value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee.value} value={assignee.value}>
                          {assignee.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="puDate" className="text-xs font-medium">
                    PU Date <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-8 text-sm",
                          !formData.puDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {formData.puDate ? formData.puDate : "dd/mm/yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.puDate ? new Date(formData.puDate) : undefined}
                        onSelect={(date) => handleInputChange("puDate", date ? date.toISOString().split('T')[0] : "")}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Arrival Information</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="arrivalDate" className="text-sm font-medium">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11",
                        !formData.arrivalDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.arrivalDate ? formData.arrivalDate : "dd/mm/yyyy"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.arrivalDate ? new Date(formData.arrivalDate) : undefined}
                      onSelect={(date) => handleInputChange("arrivalDate", date ? date.toISOString().split('T')[0] : "")}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalType" className="text-sm font-medium">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="surplus">Surplus</SelectItem>
                    <SelectItem value="lab-standard">Lab Standard</SelectItem>
                    <SelectItem value="purchasing-dept">Purchasing Dept.</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="customer-dropoff">Customer Dropoff</SelectItem>
                    <SelectItem value="jm-driver-pickup">JM Driver Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.arrivalType === 'surplus' && (
                <div className="space-y-2">
                  <Label htmlFor="arrivalLocation" className="text-sm font-medium">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.arrivalLocation} onValueChange={(value) => handleInputChange("arrivalLocation", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      <SelectItem value="main-office">Main Office</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="loading-dock">Loading Dock</SelectItem>
                      <SelectItem value="reception">Reception</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.arrivalType === 'shipped' && (
                <div className="space-y-2">
                  <Label htmlFor="shipType" className="text-sm font-medium">
                    Ship Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.shipType} onValueChange={(value) => handleInputChange("shipType", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select ship type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="usps">USPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.arrivalType === 'customer-dropoff' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter name"
                    className="h-11"
                  />
                </div>
              )}

              {formData.arrivalType === 'jm-driver-pickup' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="driver" className="text-sm font-medium">
                      Driver <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.driver} onValueChange={(value) => handleInputChange("driver", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        {assignees.map((assignee) => (
                          <SelectItem key={assignee.value} value={assignee.value}>
                            {assignee.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="puDate" className="text-sm font-medium">
                      PU Date <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-11",
                            !formData.puDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.puDate ? formData.puDate : "dd/mm/yyyy"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.puDate ? new Date(formData.puDate) : undefined}
                          onSelect={(date) => handleInputChange("puDate", date ? date.toISOString().split('T')[0] : "")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Departure Information */}
      {isAccordion ? (
        <div className="space-y-2">
          <div className="pb-2 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">Departure Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="space-y-1">
              <Label htmlFor="invNumber" className="text-xs font-medium">Inv #</Label>
              <Input
                id="invNumber"
                value={formData.invNumber}
                readOnly
                placeholder="Invoice number"
                className="h-8 text-sm bg-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="dtNumber" className="text-xs font-medium">DT #</Label>
              <Input
                id="dtNumber"
                value={formData.dtNumber}
                readOnly
                placeholder="DT number"
                className="h-8 text-sm bg-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <Label htmlFor="deliveryStatus" className="text-xs font-medium">Delivery Status</Label>
              <Textarea
                id="deliveryStatus"
                value={formData.deliveryStatus}
                onChange={(e) => handleInputChange("deliveryStatus", e.target.value)}
                placeholder="Enter delivery status comments"
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Departure Information</h3>
                <p className="text-sm text-muted-foreground">Delivery and departure details</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invNumber" className="text-sm font-medium">Inv #</Label>
                <Input
                  id="invNumber"
                  value={formData.invNumber}
                  readOnly
                  placeholder="Invoice number"
                  className="h-11 bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dtNumber" className="text-sm font-medium">DT #</Label>
                <Input
                  id="dtNumber"
                  value={formData.dtNumber}
                  readOnly
                  placeholder="DT number"
                  className="h-11 bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryStatus" className="text-sm font-medium">Delivery Status</Label>
                <Textarea
                  id="deliveryStatus"
                  value={formData.deliveryStatus}
                  onChange={(e) => handleInputChange("deliveryStatus", e.target.value)}
                  placeholder="Enter delivery status comments"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderOptionsSection = (isAccordion = false) => (
    <div className={isAccordion ? "space-y-3" : "space-y-6"}>
      {isAccordion ? (
        <>
          {/* Additional Information Section - Minimal */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Additional Information</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="needBy" className="text-xs">Need By <span className="text-destructive">*</span></Label>
                <Input id="needBy" type="date" value={formData.needBy} onChange={(e) => handleInputChange("needBy", e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="deliverByDate" className="text-xs">Deliver By Date</Label>
                <Input id="deliverByDate" type="date" value={formData.deliverByDate} onChange={(e) => handleInputChange("deliverByDate", e.target.value)} className="h-8 text-sm" />
              </div>
            </div>
          </div>

          {/* Purchase Order Information Section - Minimal */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Purchase Order Information</div>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label htmlFor="poNumber" className="text-xs">PO Number <span className="text-destructive">*</span></Label>
                <Input id="poNumber" value={formData.poNumber} onChange={(e) => handleInputChange("poNumber", e.target.value)} placeholder="CUST/PO #" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="poLineNumber" className="text-xs">PO Line #</Label>
                <Input id="poLineNumber" value={formData.poLineNumber} onChange={(e) => handleInputChange("poLineNumber", e.target.value)} placeholder="PO Line #" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="soNumber" className="text-xs">SO Number</Label>
                <Input id="soNumber" value={formData.soNumber} onChange={(e) => handleInputChange("soNumber", e.target.value)} placeholder="SO Number" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="jmPartsPoNumber" className="text-xs">JM Parts PO #</Label>
                <Input id="jmPartsPoNumber" value={formData.jmPartsPoNumber} onChange={(e) => handleInputChange("jmPartsPoNumber", e.target.value)} placeholder="JM Parts PO #" className="h-8 text-sm" />
              </div>
            </div>
          </div>

          {/* Status Options Section - Minimal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              { key: 'warranty', label: 'Warranty' },
              { key: 'estimate', label: 'Estimate' },
              { key: 'newEquip', label: 'New Equipment' },
              { key: 'usedSurplus', label: 'Used Surplus' },
              { key: 'iso17025', label: 'ISO 17025' },
              { key: 'hotList', label: 'Hot List' },
              { key: 'readyToBill', label: 'Ready to Bill' },
              { key: 'inQa', label: 'In QA' },
              { key: 'toShipping', label: 'To Shipping' },
              { key: 'multiParts', label: 'Multi Parts' },
              { key: 'lostEquipment', label: 'Lost Equipment' },
              { key: 'redTag', label: 'Red Tag' },
              { key: 'returned', label: 'Returned' },
              { key: 'coOverride', label: 'C/O Override' },
              { key: 'dateValidOverride', label: 'Date Valid. Override' },
              { key: 'coStdCheckOverride', label: 'C/O Std Check Override' },
            ].map(option => (
              <div key={option.key} className="flex items-center gap-2 px-2 py-1 border rounded bg-background">
                <Checkbox id={option.key} checked={formData[option.key as keyof typeof formData] as boolean} onCheckedChange={(checked) => handleInputChange(option.key, checked)} className="h-3.5 w-3.5" />
                <Label htmlFor={option.key} className="text-xs cursor-pointer truncate">{option.label}</Label>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Additional Information Section */}
            <Card className="border-0">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="needBy" className="text-sm font-medium">Need By <span className="text-destructive">*</span></Label>
                    <Input id="needBy" type="date" value={formData.needBy} onChange={(e) => handleInputChange("needBy", e.target.value)} className="h-11" placeholder="Enter need by date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliverByDate" className="text-sm font-medium">Deliver By Date</Label>
                    <Input id="deliverByDate" type="date" value={formData.deliverByDate} onChange={(e) => handleInputChange("deliverByDate", e.target.value)} className="h-11" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Order Information Section */}
            <Card className="border-0">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Purchase Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="poNumber" className="text-sm font-medium">PO Number <span className="text-destructive">*</span></Label>
                    <Input id="poNumber" value={formData.poNumber} onChange={(e) => handleInputChange("poNumber", e.target.value)} placeholder="CUST/PO #" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poLineNumber" className="text-sm font-medium">PO Line #</Label>
                    <Input id="poLineNumber" value={formData.poLineNumber} onChange={(e) => handleInputChange("poLineNumber", e.target.value)} placeholder="PO Line #" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soNumber" className="text-sm font-medium">SO Number</Label>
                    <Input id="soNumber" value={formData.soNumber} onChange={(e) => handleInputChange("soNumber", e.target.value)} placeholder="SO Number" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jmPartsPoNumber" className="text-sm font-medium">JM Parts PO #</Label>
                    <Input id="jmPartsPoNumber" value={formData.jmPartsPoNumber} onChange={(e) => handleInputChange("jmPartsPoNumber", e.target.value)} placeholder="JM Parts PO #" className="h-11" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Options Section */}
          <Card className="border-0 shadow-md w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'warranty', label: 'Warranty', icon: '🛡️' },
                  { key: 'estimate', label: 'Estimate', icon: '💰' },
                  { key: 'newEquip', label: 'New Equipment', icon: '✨' },
                  { key: 'usedSurplus', label: 'Used Surplus', icon: '♻️' },
                  { key: 'iso17025', label: 'ISO 17025', icon: '📋' },
                  { key: 'hotList', label: 'Hot List', icon: '🔥' },
                  { key: 'readyToBill', label: 'Ready to Bill', icon: '💳' },
                  { key: 'inQa', label: 'In QA', icon: '🔍' },
                  { key: 'toShipping', label: 'To Shipping', icon: '📦' },
                  { key: 'multiParts', label: 'Multi Parts', icon: '🔧' },
                  { key: 'lostEquipment', label: 'Lost Equipment', icon: '❓' },
                  { key: 'redTag', label: 'Red Tag', icon: '🏷️' },
                  { key: 'returned', label: 'Returned', icon: '↩️' },
                  { key: 'coOverride', label: 'C/O Override', icon: '⚡' },
                  { key: 'dateValidOverride', label: 'Date Valid. Override', icon: '📅' },
                  { key: 'coStdCheckOverride', label: 'C/O Std Check Override', icon: '✅' },
                ].map(option => (
                  <div key={option.key} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox id={option.key} checked={formData[option.key as keyof typeof formData] as boolean} onCheckedChange={(checked) => handleInputChange(option.key, checked)} />
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      <Label htmlFor={option.key} className="text-sm font-medium cursor-pointer">{option.label}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  // ESL-specific sections
  const renderDetailsSection = () => (
    <div className="space-y-6">
      {/* Main Content Grid - Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Information */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Product Information</div>
            
            <div className="space-y-1">
              <Label htmlFor="detailsManufacturer" className="text-xs">Manufacturer</Label>
              <Select value={formData.manufacturer} onValueChange={(value) => handleInputChange("manufacturer", value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3M</SelectItem>
                  <SelectItem value="salisbury">Salisbury</SelectItem>
                  <SelectItem value="chance">Chance</SelectItem>
                  <SelectItem value="cementex">Cementex</SelectItem>
                  <SelectItem value="novax">Novax</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="detailsClass" className="text-xs">Class</Label>
              <Select value={formData.itemClass} onValueChange={(value) => handleInputChange("itemClass", value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-0">Class 0</SelectItem>
                  <SelectItem value="class-1">Class 1</SelectItem>
                  <SelectItem value="class-2">Class 2</SelectItem>
                  <SelectItem value="class-3">Class 3</SelectItem>
                  <SelectItem value="class-4">Class 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="detailsSize" className="text-xs">Size</Label>
              <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="xxl">XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="detailsColor" className="text-xs">Color</Label>
              <Select value={formData.color} onValueChange={(value) => handleInputChange("color", value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Options Checkboxes */}
            <div className="pt-3 border-t space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="detailsNew" checked={formData.newEquip} onCheckedChange={(checked) => handleInputChange("newEquip", checked)} className="h-4 w-4" />
                <Label htmlFor="detailsNew" className="text-xs cursor-pointer">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="detailsSlot" checked={formData.slot} onCheckedChange={(checked) => handleInputChange("slot", checked)} className="h-4 w-4" />
                <Label htmlFor="detailsSlot" className="text-xs cursor-pointer">Slot</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="detailsEyelets" checked={formData.eyelets} onCheckedChange={(checked) => handleInputChange("eyelets", checked)} className="h-4 w-4" />
                <Label htmlFor="detailsEyelets" className="text-xs cursor-pointer">Eyelets</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="detailsZip" checked={formData.zip} onCheckedChange={(checked) => handleInputChange("zip", checked)} className="h-4 w-4" />
                <Label htmlFor="detailsZip" className="text-xs cursor-pointer">Zip</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Prefill & IDs */}
        <div className="space-y-4">
          {/* Prefill Section */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Prefill</div>
            
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="prefillEslId" className="text-xs">Prefill w/ESL ID:</Label>
                <Input id="prefillEslId" placeholder="Enter ESL ID" className="h-8 text-xs" />
              </div>
              <Button variant="default" size="sm" className="h-8 text-xs px-4">Prefill</Button>
            </div>
            
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="prefillCustId" className="text-xs">Prefill w/Cust ID:</Label>
                <Input id="prefillCustId" placeholder="Enter Cust ID" className="h-8 text-xs" />
              </div>
              <Button variant="default" size="sm" className="h-8 text-xs px-4">Prefill</Button>
            </div>
          </div>

          {/* ID Information */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">ID Information</div>
            
            <div className="space-y-1">
              <Label htmlFor="eslId" className="text-xs">ESL ID:</Label>
              <Input id="eslId" value={formData.eslId} onChange={(e) => handleInputChange("eslId", e.target.value)} placeholder="ESL ID" className="h-8 text-xs" />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="custIdDetail" className="text-xs">Cust ID:</Label>
              <Input id="custIdDetail" value={formData.custIdDetail} onChange={(e) => handleInputChange("custIdDetail", e.target.value)} placeholder="Cust ID" className="h-8 text-xs" />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="tagNumber" className="text-xs">Tag #:</Label>
              <Input id="tagNumber" value={formData.tagNumber} onChange={(e) => handleInputChange("tagNumber", e.target.value)} placeholder="Tag #" className="h-8 text-xs" />
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground px-1">
            <span><span className="font-medium">Created:</span> 09/09/2025 by Admin</span>
            <span><span className="font-medium">Modified:</span> 09/09/2025 by Admin</span>
          </div>
        </div>

        {/* Right Column - Accessories */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Accessories</div>
            
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="h-8 text-xs flex-1">
                      <SelectValue placeholder="Select accessory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protector">Protector</SelectItem>
                      <SelectItem value="bag">Bag</SelectItem>
                      <SelectItem value="case">Case</SelectItem>
                      <SelectItem value="strap">Strap</SelectItem>
                      <SelectItem value="clip">Clip</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Qty" className="h-8 text-xs w-16 text-center" min="0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Items Data Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 border-b">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items</span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-8 text-center">
                  <Checkbox className="h-3.5 w-3.5" />
                </TableHead>
                <TableHead className="text-xs font-medium">Sort</TableHead>
                <TableHead className="text-xs font-medium">Manufacturer</TableHead>
                <TableHead className="text-xs font-medium">Class</TableHead>
                <TableHead className="text-xs font-medium">Size</TableHead>
                <TableHead className="text-xs font-medium">Color</TableHead>
                <TableHead className="text-xs font-medium">Slot</TableHead>
                <TableHead className="text-xs font-medium">Eyelets</TableHead>
                <TableHead className="text-xs font-medium">Zip</TableHead>
                <TableHead className="text-xs font-medium">New</TableHead>
                <TableHead className="text-xs font-medium">ESL ID</TableHead>
                <TableHead className="text-xs font-medium">Cust ID</TableHead>
                <TableHead className="text-xs font-medium">Tag</TableHead>
                <TableHead className="text-xs font-medium">System Tag</TableHead>
                <TableHead className="text-xs font-medium">Stage</TableHead>
                <TableHead className="text-xs font-medium">Clean</TableHead>
                <TableHead className="text-xs font-medium">Test</TableHead>
                <TableHead className="text-xs font-medium">VI</TableHead>
                <TableHead className="text-xs font-medium">Stamp</TableHead>
                <TableHead className="text-xs font-medium">Stamp Insp</TableHead>
                <TableHead className="text-xs font-medium">Box Order</TableHead>
                <TableHead className="text-xs font-medium">Acc</TableHead>
                <TableHead className="text-xs font-medium">Bin</TableHead>
                <TableHead className="text-xs font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Filter Row */}
              <TableRow className="bg-background">
                <TableCell></TableCell>
                <TableCell><Input className="h-6 text-xs w-12" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-20" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-12" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-12" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-12" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-10" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-10" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-10" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-10" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-16" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-16" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-12" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-16" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-12" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-12" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-10" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-10" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-12" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-16" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-16" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-10" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-10" /></TableCell>
                <TableCell><Input className="h-6 text-xs w-14" /></TableCell>
              </TableRow>
              {/* Empty State */}
              <TableRow>
                <TableCell colSpan={24} className="text-center py-8 text-sm text-muted-foreground">
                  No data to display
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-14" />

      {/* Fixed Footer for Details Tab - respects sidebar */}
      <div className="fixed bottom-0 left-[var(--sidebar-width,16rem)] right-0 z-40 bg-background border-t shadow-sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Left side - Action buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                WO
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                Label
              </Button>
              <Input 
                type="number" 
                defaultValue="1" 
                min="1" 
                className="h-7 w-12 text-xs text-center" 
                placeholder="Qty"
              />
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                Batch Sheet
              </Button>
              <Select defaultValue="default">
                <SelectTrigger className="h-7 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                Assign by Class
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                Assign by Size
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                <Package className="h-3.5 w-3.5 mr-1.5" />
                Add from Inventory
              </Button>
            </div>

            {/* Right side - Save and Cancel */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestingSection = () => {
    const costItems = [
      { label: 'Testing', qty: '0', cost: '0.00', hasQty: true },
      { label: 'Expedite', qty: null, cost: '0.00', hasQty: false },
      { label: 'Emergency', qty: null, cost: '0.00', hasQty: false },
      { label: 'Replacement', qty: '0', cost: '0.00', hasQty: true },
      { label: 'New Sales', qty: '0', cost: '0.00', hasQty: true },
    ];

    return (
      <div className="space-y-3 max-w-sm">
        {/* Header row */}
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
          <div className="w-24"></div>
          <div className="w-14 text-center">Qty</div>
          <div className="w-20 text-center">Cost</div>
        </div>

        {/* Cost items */}
        <div className="space-y-2">
          {costItems.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="w-24">
                <Label className="text-sm font-medium">{item.label}:</Label>
              </div>
              <div className="w-14 flex justify-center">
                {item.hasQty ? (
                  <Input 
                    value={item.qty} 
                    readOnly 
                    className="h-7 text-xs text-center w-14 bg-muted/30" 
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
              <div className="w-20">
                <Input 
                  value={item.cost} 
                  readOnly 
                  className="h-7 text-xs text-right w-20 bg-muted/30" 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total row */}
        <div className="flex items-center gap-4 border-t pt-2 mt-2">
          <div className="w-24">
            <Label className="text-sm font-semibold">Total:</Label>
          </div>
          <div className="w-14 text-center">
            <span className="text-xs font-semibold">0</span>
          </div>
          <div className="w-20 text-right pr-2">
            <span className="text-xs font-semibold">0.00</span>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkStatusSection = () => (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Work status information will be displayed here.
      </p>
    </div>
  );

  // Render factory configuration section
  const renderFactoryConfigSection = (isAccordion = false) => (
    <div className={isAccordion ? "space-y-2" : "space-y-4"}>
        <div className={`flex items-center ${isAccordion ? 'space-x-1.5 mb-2' : 'space-x-2 mb-4'}`}>
          <Checkbox
            id="toFactory"
            checked={formData.toFactory}
            onCheckedChange={(checked) => handleInputChange("toFactory", checked)}
            className={isAccordion ? "h-3.5 w-3.5" : ""}
          />
          <Label htmlFor="toFactory" className={isAccordion ? "text-xs" : ""}>Send to Factory (T/F)</Label>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${isAccordion ? 'gap-2' : 'gap-4'}`}>
          <div className={isAccordion ? "space-y-1" : "space-y-2"}>
            <Label htmlFor="tfPoNumber" className={isAccordion ? "text-xs" : ""}>Factory PO Number</Label>
            <Input
              id="tfPoNumber"
              value={formData.tfPoNumber}
              onChange={(e) => handleInputChange("tfPoNumber", e.target.value)}
              placeholder="PO number"
              className={isAccordion ? "h-7 text-sm" : ""}
            />
          </div>

          <div className={isAccordion ? "space-y-1" : "space-y-2"}>
            <Label htmlFor="vendorRmaNumber" className={isAccordion ? "text-xs" : ""}>Vendor RMA Number</Label>
            <Input
              id="vendorRmaNumber"
              value={formData.vendorRmaNumber}
              onChange={(e) => handleInputChange("vendorRmaNumber", e.target.value)}
              placeholder="RMA number"
              className={isAccordion ? "h-7 text-sm" : ""}
            />
          </div>

          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={() => setQf3DialogOpen(true)} className={isAccordion ? "h-7 text-xs" : ""}>
              Generate QF3
            </Button>
          </div>
        </div>

        <div className={`${isAccordion ? 'pt-3' : 'pt-6'} border-t ${isAccordion ? 'space-y-3' : 'space-y-6'}`}>
          {/* Certificate Configuration */}
          <div className={isAccordion ? "space-y-2" : "space-y-4"}>
            <div className={`flex items-center justify-between ${isAccordion ? 'p-2' : 'p-4'} rounded-lg border bg-card`}>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="noTfCert" className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium cursor-pointer`}>
                  Certificate Required
                </Label>
                <p className={`${isAccordion ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                  Toggle to require certificate upload for this work order
                </p>
              </div>
              <Switch
                id="noTfCert"
                checked={!formData.noTfCert}
                onCheckedChange={(checked) => handleInputChange("noTfCert", !checked)}
              />
            </div>

            {/* Certificate File Upload - Only show when certificate is required */}
            {!formData.noTfCert && (
              <div className={isAccordion ? "space-y-2" : "space-y-4"}>
                <div className={isAccordion ? "space-y-1" : "space-y-2"}>
                  <Label className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium text-foreground`}>Certificate File</Label>
                  {/* Always show upload area */}
                  <div className="relative rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 bg-background transition-colors">
                    <div className={`flex items-center justify-between ${isAccordion ? 'p-2' : 'p-4'}`}>
                      <div className={`flex items-center ${isAccordion ? 'gap-2' : 'gap-3'}`}>
                        <div className={`${isAccordion ? 'w-7 h-7' : 'w-10 h-10'} rounded-lg bg-muted flex items-center justify-center`}>
                          <Package className={`${isAccordion ? 'w-3.5 h-3.5' : 'w-5 h-5'} text-muted-foreground`} />
                        </div>
                        <div>
                          <p className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>
                            Upload certificate file
                          </p>
                          <p className={`${isAccordion ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                            PDF, DOC, or image files supported
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className={isAccordion ? "h-6 text-xs px-3" : "px-6"}>
                        Browse
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Show uploaded certificate file if exists */}
                {formData.certFile && (
                  <div className={`rounded-lg border bg-card ${isAccordion ? 'p-2' : 'p-4'}`}>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center ${isAccordion ? 'gap-2' : 'gap-3'}`}>
                        <div className={`${isAccordion ? 'w-7 h-7' : 'w-10 h-10'} rounded-lg bg-primary/10 flex items-center justify-center`}>
                          <FileText className={`${isAccordion ? 'w-3.5 h-3.5' : 'w-5 h-5'} text-primary`} />
                        </div>
                        <div>
                          <p className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>
                            {formData.certFile}
                          </p>
                          <p className={`${isAccordion ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                            PDF Document • 2.4 MB
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center ${isAccordion ? 'gap-1' : 'gap-2'}`}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleViewCertificate}
                          className={isAccordion ? "h-6 w-6 p-0" : "h-8 w-8 p-0"}
                        >
                          <Eye className={isAccordion ? "w-3 h-3" : "w-4 h-4"} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleDeleteCertificate}
                          className={`${isAccordion ? 'h-6 w-6' : 'h-8 w-8'} p-0 text-destructive hover:text-destructive hover:bg-destructive/10`}
                        >
                          <Trash2 className={isAccordion ? "w-3 h-3" : "w-4 h-4"} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
    </div>
  );

  // Render lab section
  const renderLabSection = (isAccordion = false) => {
    const getActionCodeLabel = () => {
      const actionCodeMap = {
        "build-new": "BUILD NEW",
        "cc": "C/C", 
        "rc": "R/C",
        "rcc": "R/C/C",
        "repair": "REPAIR",
        "test": "TEST"
      };
      return actionCodeMap[formData.actionCode] || formData.actionCode;
    };

    return (
      <div className={isAccordion ? "space-y-3 animate-fade-in" : "space-y-8 animate-fade-in"}>
        {/* Action Code Display */}
        {formData.actionCode && (
          <div className="flex items-center gap-1">
            <span className={isAccordion ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"}>Action Code:</span>
            <Badge variant="outline" className={isAccordion ? "text-[10px] font-medium h-5" : "text-xs font-medium"}>
              {getActionCodeLabel()}
            </Badge>
          </div>
        )}
        
        {/* BUILD NEW Specific Fields */}
        {formData.actionCode === "build-new" && (
          <div className="space-y-6">
            {/* Condition and Technician Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conditionIn" className="text-sm font-medium text-foreground/90">Condition In</Label>
                <Select value={formData.conditionIn} onValueChange={(value) => handleInputChange("conditionIn", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionOut" className="text-sm font-medium text-foreground/90">Condition Out</Label>
                <Select value={formData.conditionOut} onValueChange={(value) => handleInputChange("conditionOut", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="repaired">Repaired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technician Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technician1" className="text-sm font-medium text-foreground/90">Technician 1</Label>
                <Select value={formData.technician1} onValueChange={(value) => handleInputChange("technician1", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician2" className="text-sm font-medium text-foreground/90">Technician 2</Label>
                <Select value={formData.technician2} onValueChange={(value) => handleInputChange("technician2", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician3" className="text-sm font-medium text-foreground/90">Technician 3</Label>
                <Select value={formData.technician3} onValueChange={(value) => handleInputChange("technician3", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Comment and Repair */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="addComment" className="text-sm font-medium text-foreground/90">Add Comment</Label>
                <Select value={formData.addComment} onValueChange={(value) => handleInputChange("addComment", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select comment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairComments" className="text-sm font-medium text-foreground/90">Repair</Label>
                <textarea
                  id="repairComments"
                  value={formData.repairComments}
                  onChange={(e) => {
                    handleInputChange("repairComments", e.target.value);
                    // Auto-resize the textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="Enter repair comments..."
                  className="w-full min-h-16 px-3 py-2 border border-border/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:border-border overflow-hidden"
                  style={{ minHeight: '64px' }}
                />
              </div>
            </div>

            {/* Dates Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="certificationDate" className="text-sm font-medium text-foreground/90">Certification Date</Label>
                  <Input
                    id="certificationDate"
                    type="date"
                    value={formData.certificationDate}
                    onChange={(e) => handleInputChange("certificationDate", e.target.value)}
                    className="h-11 border-border/50 hover:border-border transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recalibrationDate" className="text-sm font-medium text-foreground/90">Recalibration Date</Label>
                  <Input
                    id="recalibrationDate"
                    type="date"
                    value={formData.recalibrationDate}
                    onChange={(e) => handleInputChange("recalibrationDate", e.target.value)}
                    className="h-11 border-border/50 hover:border-border transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Lab Environment Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/90">Lab Temperature</Label>
                  <div className="flex gap-2">
                    <Select value={formData.labTempUnit} onValueChange={(value) => handleInputChange("labTempUnit", value)}>
                      <SelectTrigger className="h-11 w-20 border-border/50 hover:border-border transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        <SelectItem value="#">#</SelectItem>
                        <SelectItem value="°F">°F</SelectItem>
                        <SelectItem value="°C">°C</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.labTempValue}
                      onChange={(e) => handleInputChange("labTempValue", e.target.value)}
                      placeholder="Value"
                      className="h-11 flex-1 border-border/50 hover:border-border transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/90">Lab Humidity</Label>
                  <div className="flex gap-2">
                    <Select value={formData.labRhUnit} onValueChange={(value) => handleInputChange("labRhUnit", value)}>
                      <SelectTrigger className="h-11 w-20 border-border/50 hover:border-border transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        <SelectItem value="#">#</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="RH">RH</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.labRhValue}
                      onChange={(e) => handleInputChange("labRhValue", e.target.value)}
                      placeholder="Value"
                      className="h-11 flex-1 border-border/50 hover:border-border transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Standards and Procedures Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/90">Lab Temperature</Label>
                  <div className="flex gap-2">
                    <Select value={formData.labTempUnit} onValueChange={(value) => handleInputChange("labTempUnit", value)}>
                      <SelectTrigger className="h-11 w-16 border-border/50 hover:border-border transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        <SelectItem value="#">#</SelectItem>
                        <SelectItem value="°F">°F</SelectItem>
                        <SelectItem value="°C">°C</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.labTempValue}
                      onChange={(e) => handleInputChange("labTempValue", e.target.value)}
                      placeholder="Value"
                      className="h-11 flex-1 border-border/50 hover:border-border transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/90">Lab Humidity</Label>
                  <div className="flex gap-2">
                    <Select value={formData.labRhUnit} onValueChange={(value) => handleInputChange("labRhUnit", value)}>
                      <SelectTrigger className="h-11 w-16 border-border/50 hover:border-border transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        <SelectItem value="#">#</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="RH">RH</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.labRhValue}
                      onChange={(e) => handleInputChange("labRhValue", e.target.value)}
                      placeholder="Value"
                      className="h-11 flex-1 border-border/50 hover:border-border transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="standardsUsed" className="text-sm font-medium text-foreground/90">Standards Used</Label>
                  <Input
                    id="standardsUsed"
                    value={formData.standardsUsed}
                    onChange={(e) => handleInputChange("standardsUsed", e.target.value)}
                    placeholder="Enter standards used..."
                    className="h-11 border-border/50 hover:border-border transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procedureFiles" className="text-sm font-medium text-foreground/90">Procedure Files</Label>
                  <Input
                    id="procedureFiles"
                    value={formData.procedureFiles}
                    onChange={(e) => handleInputChange("procedureFiles", e.target.value)}
                    placeholder="Enter procedure files"
                    className="h-11 border-border/50 hover:border-border transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Data Files Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground/90">Supplemental Data Files</Label>
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">No data files available</p>
                </div>
              </div>
            </div>

            {/* Actions and Cost Summary */}
            <div className="space-y-6">
              <div className="h-px bg-border/50" />
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2 hover-scale">
                  <User className="h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="gap-2 hover-scale">
                  <Shield className="h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="gap-2 hover-scale">
                  <FileText className="h-4 w-4" />
                  QF3
                </Button>
                <Button variant="outline" size="sm" className="gap-2 hover-scale">
                  <Settings className="h-4 w-4" />
                  Review
                </Button>
              </div>

              {/* Cost Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/20 rounded-lg">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Cal/Cert Cost</div>
                  <div className="text-lg font-semibold">${Number(formData.calCertCost).toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Repair Cost</div>
                  <div className="text-lg font-semibold">${Number(formData.repairCost).toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Cost</div>
                  <div className="text-xl font-bold text-primary">${Number(formData.totalCost).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* R/C Specific Fields */}
        {formData.actionCode === "rc" && (
          <div className="space-y-6">
            {/* Condition Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conditionIn" className="text-sm font-medium text-foreground/90">Condition In:</Label>
                <Select value={formData.conditionIn} onValueChange={(value) => handleInputChange("conditionIn", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionOut" className="text-sm font-medium text-foreground/90">Condition Out:</Label>
                <Select value={formData.conditionOut} onValueChange={(value) => handleInputChange("conditionOut", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="repaired">Repaired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technician Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technician1" className="text-sm font-medium text-foreground/90">Technician 1:</Label>
                <Select value={formData.technician1} onValueChange={(value) => handleInputChange("technician1", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician2" className="text-sm font-medium text-foreground/90">Technician 2:</Label>
                <Select value={formData.technician2} onValueChange={(value) => handleInputChange("technician2", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician3" className="text-sm font-medium text-foreground/90">Technician 3:</Label>
                <Select value={formData.technician3} onValueChange={(value) => handleInputChange("technician3", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Comment and Repair Comments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="addComment" className="text-sm font-medium text-foreground/90">Add Comment:</Label>
                <Select value={formData.addComment} onValueChange={(value) => handleInputChange("addComment", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select comment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairComments" className="text-sm font-medium text-foreground/90">Repair Comments:</Label>
                <div className="relative">
                  <textarea
                    id="repairComments"
                    value={formData.repairComments}
                    onChange={(e) => handleInputChange("repairComments", e.target.value)}
                    placeholder="Enter repair comments..."
                    className="w-full h-24 px-3 py-2 border border-border/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:border-border"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-2 right-2 text-xs h-6 px-2"
                    onClick={() => {/* Handle expand comments */}}
                  >
                    Expand Comments
                  </Button>
                </div>
              </div>
            </div>

            {/* Completion Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="completionDate" className="text-sm font-medium text-foreground/90">Completion Date:</Label>
                <Input
                  id="completionDate"
                  type="date"
                  value={formData.completionDate || "2025-09-22"}
                  onChange={(e) => handleInputChange("completionDate", e.target.value)}
                  className="h-11 border-border/50 hover:border-border transition-colors"
                />
              </div>
            </div>

            {/* Supp Data Files Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground/90">Supp Data Files</Label>
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">No data to display</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="bg-yellow-200 hover:bg-yellow-300 text-black border-yellow-400">
                Cost Data
              </Button>
              <Button variant="outline" className="bg-yellow-200 hover:bg-yellow-300 text-black border-yellow-400">
                Create Repair
              </Button>
              <Button variant="outline" className="bg-gray-200 hover:bg-gray-300 text-black border-gray-400">
                Recreate Repair
              </Button>
            </div>

            {/* Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/20 rounded-lg">
              <div className="text-left">
                <div className="text-sm font-medium mb-1">CAL/CERT: ${Number(formData.calCertCost).toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">REPAIR: ${Number(formData.repairCost).toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">ALL: ${Number(formData.totalCost).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* C/C Specific Fields */}
        {formData.actionCode === "cc" && (
          <div className="space-y-6">
            {/* Condition Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conditionIn" className="text-sm font-medium text-foreground/90">Condition In:</Label>
                <Select value={formData.conditionIn} onValueChange={(value) => handleInputChange("conditionIn", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="as-found">As Found</SelectItem>
                    <SelectItem value="working">Working</SelectItem>
                    <SelectItem value="defective">Defective</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionOut" className="text-sm font-medium text-foreground/90">Condition Out:</Label>
                <Select value={formData.conditionOut} onValueChange={(value) => handleInputChange("conditionOut", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="as-left">As Left</SelectItem>
                    <SelectItem value="calibrated">Calibrated</SelectItem>
                    <SelectItem value="repaired">Repaired</SelectItem>
                    <SelectItem value="adjusted">Adjusted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technician Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="technician1" className="text-sm font-medium text-foreground/90">Technician 1:</Label>
                <Select value={formData.technician1} onValueChange={(value) => handleInputChange("technician1", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aaron-l-briles">Aaron L Briles</SelectItem>
                    <SelectItem value="aaron-w-sibley">Aaron W Sibley</SelectItem>
                    <SelectItem value="adam-d-eller">Adam D. Eller</SelectItem>
                    <SelectItem value="alexander-j-shepard">Alexander J Shepard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician2" className="text-sm font-medium text-foreground/90">Technician 2:</Label>
                <Select value={formData.technician2} onValueChange={(value) => handleInputChange("technician2", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aaron-l-briles">Aaron L Briles</SelectItem>
                    <SelectItem value="aaron-w-sibley">Aaron W Sibley</SelectItem>
                    <SelectItem value="adam-d-eller">Adam D. Eller</SelectItem>
                    <SelectItem value="alexander-j-shepard">Alexander J Shepard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician3" className="text-sm font-medium text-foreground/90">Technician 3:</Label>
                <Select value={formData.technician3} onValueChange={(value) => handleInputChange("technician3", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aaron-l-briles">Aaron L Briles</SelectItem>
                    <SelectItem value="aaron-w-sibley">Aaron W Sibley</SelectItem>
                    <SelectItem value="adam-d-eller">Adam D. Eller</SelectItem>
                    <SelectItem value="alexander-j-shepard">Alexander J Shepard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Comment and Repair Comments */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="addComment" className="text-sm font-medium text-foreground/90">Add Comment:</Label>
                <Select value={formData.addComment} onValueChange={(value) => handleInputChange("addComment", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select comment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calibration-complete">Calibration Complete</SelectItem>
                    <SelectItem value="repair-needed">Repair Needed</SelectItem>
                    <SelectItem value="test-passed">Test Passed</SelectItem>
                    <SelectItem value="within-tolerance">Within Tolerance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairComments" className="text-sm font-medium text-foreground/90">Repair Comments:</Label>
                <div className="relative">
                  <Textarea
                    id="repairComments"
                    value={formData.repairComments}
                    onChange={(e) => handleInputChange("repairComments", e.target.value)}
                    placeholder="Enter repair comments..."
                    className="min-h-[120px] resize-none pr-32"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="absolute bottom-2 right-2 bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                  >
                    Expand Comments
                  </Button>
                </div>
              </div>
            </div>

            {/* Certification and Recalibration Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="certificationDate" className="text-sm font-medium text-foreground/90">Certification Date:</Label>
                <Input
                  id="certificationDate"
                  type="date"
                  value={formData.certificationDate || "2025-09-22"}
                  onChange={(e) => handleInputChange("certificationDate", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recalibrationDate" className="text-sm font-medium text-foreground/90">Recalibration Date:</Label>
                <Input
                  id="recalibrationDate"
                  type="date"
                  value={formData.recalibrationDate}
                  onChange={(e) => handleInputChange("recalibrationDate", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Lab Temp and RH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="labTemp" className="text-sm font-medium text-foreground/90">Lab Temp:</Label>
                <div className="flex gap-2">
                  <Select value={formData.labTempUnit} onValueChange={(value) => handleInputChange("labTempUnit", value)}>
                    <SelectTrigger className="w-16 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#">#</SelectItem>
                      <SelectItem value="°F">°F</SelectItem>
                      <SelectItem value="°C">°C</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData.labTempValue}
                    onChange={(e) => handleInputChange("labTempValue", e.target.value)}
                    placeholder="Enter temperature"
                    className="h-11 flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="labRh" className="text-sm font-medium text-foreground/90">Lab RH:</Label>
                <div className="flex gap-2">
                  <Select value={formData.labRhUnit} onValueChange={(value) => handleInputChange("labRhUnit", value)}>
                    <SelectTrigger className="w-16 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#">#</SelectItem>
                      <SelectItem value="%">%</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData.labRhValue}
                    onChange={(e) => handleInputChange("labRhValue", e.target.value)}
                    placeholder="Enter RH value"
                    className="h-11 flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Standards Used */}
            <div className="space-y-2">
              <Label htmlFor="standardsUsed" className="text-sm font-medium text-foreground/90">Standards Used:</Label>
              <Textarea
                id="standardsUsed"
                value={formData.standardsUsed}
                onChange={(e) => handleInputChange("standardsUsed", e.target.value)}
                placeholder="Enter standards used..."
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Cal Procedure and Files */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="calProcedureUsed" className="text-sm font-medium text-foreground/90">Cal Procedure Used:</Label>
                <Input
                  id="calProcedureUsed"
                  value={formData.calProcedureUsed}
                  onChange={(e) => handleInputChange("calProcedureUsed", e.target.value)}
                  placeholder="Enter procedure"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureFiles" className="text-sm font-medium text-foreground/90">Procedure File(s):</Label>
                <Input
                  id="procedureFiles"
                  value={formData.procedureFiles}
                  onChange={(e) => handleInputChange("procedureFiles", e.target.value)}
                  placeholder="Enter file references"
                  className="h-11"
                />
              </div>
            </div>

            {/* Supp Data Files Section */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium text-sm mb-4">Supp Data Files</h4>
              <div className="text-center py-4 text-muted-foreground text-sm mb-4">
                No data to display
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                  Post Data
                </Button>
                <Button variant="outline" size="sm" className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                  Create Cost
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200">
                  Recreate Cal Cert
                </Button>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center text-sm">
                <div className="text-sm font-medium mb-1">CAL/CERT: ${Number(formData.calCertCost).toFixed(2)}</div>
                <div className="text-sm font-medium mb-1">REPAIR: ${Number(formData.repairCost).toFixed(2)}</div>
                <div className="text-sm font-medium mb-1">ALL: ${Number(formData.totalCost).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* TEST Specific Fields */}
        {formData.actionCode === "test" && (
          <div className="space-y-6">
            {/* Condition Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conditionIn" className="text-sm font-medium text-foreground/90">Condition In:</Label>
                <Select value={formData.conditionIn} onValueChange={(value) => handleInputChange("conditionIn", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionOut" className="text-sm font-medium text-foreground/90">Condition Out:</Label>
                <Select value={formData.conditionOut} onValueChange={(value) => handleInputChange("conditionOut", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="repaired">Repaired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technician Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technician1" className="text-sm font-medium text-foreground/90">Technician 1:</Label>
                <Select value={formData.technician1} onValueChange={(value) => handleInputChange("technician1", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician2" className="text-sm font-medium text-foreground/90">Technician 2:</Label>
                <Select value={formData.technician2} onValueChange={(value) => handleInputChange("technician2", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician3" className="text-sm font-medium text-foreground/90">Technician 3:</Label>
                <Select value={formData.technician3} onValueChange={(value) => handleInputChange("technician3", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Comment and Repair Comments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="addComment" className="text-sm font-medium text-foreground/90">Add Comment:</Label>
                <Select value={formData.addComment} onValueChange={(value) => handleInputChange("addComment", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select comment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairComments" className="text-sm font-medium text-foreground/90">Repair Comments:</Label>
                <div className="relative">
                  <textarea
                    id="repairComments"
                    value={formData.repairComments}
                    onChange={(e) => handleInputChange("repairComments", e.target.value)}
                    placeholder="Enter repair comments..."
                    className="w-full h-24 px-3 py-2 border border-border/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:border-border"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-2 right-2 text-xs h-6 px-2 bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                  >
                    Expand Comments
                  </Button>
                </div>
              </div>
            </div>

            {/* Test Date and Retest Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="testDate" className="text-sm font-medium text-foreground/90">Test Date:</Label>
                <Input
                  id="testDate"
                  type="date"
                  value={formData.testDate || "2025-09-22"}
                  onChange={(e) => handleInputChange("testDate", e.target.value)}
                  className="h-11 border-border/50 hover:border-border transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retestDate" className="text-sm font-medium text-foreground/90">Retest Date:</Label>
                <Input
                  id="retestDate"
                  type="date"
                  value={formData.retestDate}
                  onChange={(e) => handleInputChange("retestDate", e.target.value)}
                  className="h-11 border-border/50 hover:border-border transition-colors"
                />
              </div>
            </div>

            {/* Lab Environment Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/90">Lab Temp:</Label>
                  <div className="flex gap-2">
                    <Select value={formData.labTempUnit} onValueChange={(value) => handleInputChange("labTempUnit", value)}>
                      <SelectTrigger className="h-11 w-20 border-border/50 hover:border-border transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        <SelectItem value="#">#</SelectItem>
                        <SelectItem value="°F">°F</SelectItem>
                        <SelectItem value="°C">°C</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.labTempValue}
                      onChange={(e) => handleInputChange("labTempValue", e.target.value)}
                      placeholder="Value"
                      className="h-11 flex-1 border-border/50 hover:border-border transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/90">Lab RH:</Label>
                  <div className="flex gap-2">
                    <Select value={formData.labRhUnit} onValueChange={(value) => handleInputChange("labRhUnit", value)}>
                      <SelectTrigger className="h-11 w-20 border-border/50 hover:border-border transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        <SelectItem value="#">#</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="RH">RH</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.labRhValue}
                      onChange={(e) => handleInputChange("labRhValue", e.target.value)}
                      placeholder="Value"
                      className="h-11 flex-1 border-border/50 hover:border-border transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Standards and Procedures Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="standardsUsed" className="text-sm font-medium text-foreground/90">Standards Used:</Label>
                  <textarea
                    id="standardsUsed"
                    value={formData.standardsUsed}
                    onChange={(e) => handleInputChange("standardsUsed", e.target.value)}
                    placeholder="Enter standards used..."
                    className="w-full h-20 px-3 py-2 border border-border/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procedureUsed" className="text-sm font-medium text-foreground/90">Procedure Used:</Label>
                  <Input
                    id="procedureUsed"
                    value={formData.procedureUsed}
                    onChange={(e) => handleInputChange("procedureUsed", e.target.value)}
                    placeholder="Enter procedure"
                    className="h-11 border-border/50 hover:border-border transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureFiles" className="text-sm font-medium text-foreground/90">Procedure File(s):</Label>
                <Input
                  id="procedureFiles"
                  value={formData.procedureFiles}
                  onChange={(e) => handleInputChange("procedureFiles", e.target.value)}
                  placeholder="Enter procedure files"
                  className="h-11 border-border/50 hover:border-border transition-colors"
                />
              </div>
            </div>

            {/* Supp Data Files Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground/90">Supp Data Files</Label>
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">No data to display</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="bg-yellow-200 hover:bg-yellow-300 text-black border-yellow-400">
                Cost Data
              </Button>
              <Button variant="outline" className="bg-yellow-200 hover:bg-yellow-300 text-black border-yellow-400">
                Create Test
              </Button>
              <Button variant="outline" className="bg-gray-200 hover:bg-gray-300 text-black border-gray-400">
                Recreate Test
              </Button>
            </div>

            {/* Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/20 rounded-lg">
              <div className="text-left">
                <div className="text-sm font-medium mb-1">CAL/CERT: ${Number(formData.calCertCost).toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">REPAIR: ${Number(formData.repairCost).toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">ALL: ${Number(formData.totalCost).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* REPAIR Specific Fields */}
        {formData.actionCode === "repair" && (
          <div className="space-y-6">
            {/* Condition Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conditionIn" className="text-sm font-medium text-foreground/90">Condition In:</Label>
                <Select value={formData.conditionIn} onValueChange={(value) => handleInputChange("conditionIn", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionOut" className="text-sm font-medium text-foreground/90">Condition Out:</Label>
                <Select value={formData.conditionOut} onValueChange={(value) => handleInputChange("conditionOut", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="repaired">Repaired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technician Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technician1" className="text-sm font-medium text-foreground/90">Technician 1:</Label>
                <Select value={formData.technician1} onValueChange={(value) => handleInputChange("technician1", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician2" className="text-sm font-medium text-foreground/90">Technician 2:</Label>
                <Select value={formData.technician2} onValueChange={(value) => handleInputChange("technician2", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician3" className="text-sm font-medium text-foreground/90">Technician 3:</Label>
                <Select value={formData.technician3} onValueChange={(value) => handleInputChange("technician3", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Comment and Repair Comments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="addComment" className="text-sm font-medium text-foreground/90">Add Comment:</Label>
                <Select value={formData.addComment} onValueChange={(value) => handleInputChange("addComment", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select comment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairComments" className="text-sm font-medium text-foreground/90">Repair Comments:</Label>
                <div className="relative">
                  <textarea
                    id="repairComments"
                    value={formData.repairComments}
                    onChange={(e) => handleInputChange("repairComments", e.target.value)}
                    placeholder="Enter repair comments..."
                    className="w-full h-24 px-3 py-2 border border-border/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:border-border"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-2 right-2 text-xs h-6 px-2 bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                  >
                    Expand Comments
                  </Button>
                </div>
              </div>
            </div>

            {/* Completion Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="completionDate" className="text-sm font-medium text-foreground/90">Completion Date:</Label>
                <Input
                  id="completionDate"
                  type="date"
                  value={formData.completionDate || "2025-09-22"}
                  onChange={(e) => handleInputChange("completionDate", e.target.value)}
                  className="h-11 border-border/50 hover:border-border transition-colors"
                />
              </div>
            </div>

            {/* Supp Data Files Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground/90">Supp Data Files</Label>
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">No data to display</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="bg-yellow-200 hover:bg-yellow-300 text-black border-yellow-400">
                Cost Data
              </Button>
              <Button variant="outline" className="bg-yellow-200 hover:bg-yellow-300 text-black border-yellow-400">
                Create Repair
              </Button>
              <Button variant="outline" className="bg-gray-200 hover:bg-gray-300 text-black border-gray-400">
                Recreate Repair
              </Button>
            </div>

            {/* Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/20 rounded-lg">
              <div className="text-left">
                <div className="text-sm font-medium mb-1">CAL/CERT: ${Number(formData.calCertCost).toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">REPAIR: ${Number(formData.repairCost).toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">ALL: ${Number(formData.totalCost).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* R/C/C Specific Fields */}
        {formData.actionCode === "rcc" && (
          <div className="space-y-6">
            {/* Condition and Technician Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="conditionIn" className="text-sm font-medium text-foreground/90">Condition In:</Label>
                <Select value={formData.conditionIn} onValueChange={(value) => handleInputChange("conditionIn", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionOut" className="text-sm font-medium text-foreground/90">Condition Out:</Label>
                <Select value={formData.conditionOut} onValueChange={(value) => handleInputChange("conditionOut", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="repaired">Repaired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technician Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technician1" className="text-sm font-medium text-foreground/90">Technician 1:</Label>
                <Select value={formData.technician1} onValueChange={(value) => handleInputChange("technician1", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician2" className="text-sm font-medium text-foreground/90">Technician 2:</Label>
                <Select value={formData.technician2} onValueChange={(value) => handleInputChange("technician2", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technician3" className="text-sm font-medium text-foreground/90">Technician 3:</Label>
                <Select value={formData.technician3} onValueChange={(value) => handleInputChange("technician3", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Comment and Repair */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="addComment" className="text-sm font-medium text-foreground/90">Add Comment:</Label>
                <Select value={formData.addComment} onValueChange={(value) => handleInputChange("addComment", value)}>
                  <SelectTrigger className="h-11 border-border/50 hover:border-border transition-colors">
                    <SelectValue placeholder="Select comment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairComments" className="text-sm font-medium text-foreground/90">Repair Comments:</Label>
                <div className="relative">
                  <textarea
                    id="repairComments"
                    value={formData.repairComments}
                    onChange={(e) => handleInputChange("repairComments", e.target.value)}
                    placeholder="Enter repair comments..."
                    className="w-full h-24 px-3 py-2 border border-border/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:border-border"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-2 right-2 text-xs h-6 px-2 bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                  >
                    Expand Comments
                  </Button>
                </div>
              </div>
            </div>

            {/* Dates Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="certificationDate" className="text-sm font-medium text-foreground/90">Certification Date:</Label>
                  <Input
                    id="certificationDate"
                    type="date"
                    value={formData.certificationDate || "2025-09-22"}
                    onChange={(e) => handleInputChange("certificationDate", e.target.value)}
                    className="h-11 border-border/50 hover:border-border transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recalibrationDate" className="text-sm font-medium text-foreground/90">Recalibration Date:</Label>
                  <Input
                    id="recalibrationDate"
                    type="date"
                    value={formData.recalibrationDate}
                    onChange={(e) => handleInputChange("recalibrationDate", e.target.value)}
                    className="h-11 border-border/50 hover:border-border transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Lab Environment Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/90">Lab Temp:</Label>
                  <div className="flex gap-2">
                    <Select value={formData.labTempUnit} onValueChange={(value) => handleInputChange("labTempUnit", value)}>
                      <SelectTrigger className="h-11 w-20 border-border/50 hover:border-border transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        <SelectItem value="#">#</SelectItem>
                        <SelectItem value="°F">°F</SelectItem>
                        <SelectItem value="°C">°C</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.labTempValue}
                      onChange={(e) => handleInputChange("labTempValue", e.target.value)}
                      placeholder="Value"
                      className="h-11 flex-1 border-border/50 hover:border-border transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/90">Lab RH:</Label>
                  <div className="flex gap-2">
                    <Select value={formData.labRhUnit} onValueChange={(value) => handleInputChange("labRhUnit", value)}>
                      <SelectTrigger className="h-11 w-20 border-border/50 hover:border-border transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border z-50">
                        <SelectItem value="#">#</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="RH">RH</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.labRhValue}
                      onChange={(e) => handleInputChange("labRhValue", e.target.value)}
                      placeholder="Value"
                      className="h-11 flex-1 border-border/50 hover:border-border transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Standards and Procedures Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="standardsUsed" className="text-sm font-medium text-foreground/90">Standards Used:</Label>
                  <textarea
                    id="standardsUsed"
                    value={formData.standardsUsed}
                    onChange={(e) => handleInputChange("standardsUsed", e.target.value)}
                    placeholder="Enter standards used..."
                    className="w-full h-20 px-3 py-2 border border-border/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all hover:border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calProcedureUsed" className="text-sm font-medium text-foreground/90">Cal Procedure Used:</Label>
                  <Input
                    id="calProcedureUsed"
                    value={formData.calProcedureUsed}
                    onChange={(e) => handleInputChange("calProcedureUsed", e.target.value)}
                    placeholder="Enter procedure"
                    className="h-11 border-border/50 hover:border-border transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureFiles" className="text-sm font-medium text-foreground/90">Procedure File(s):</Label>
                <Input
                  id="procedureFiles"
                  value={formData.procedureFiles}
                  onChange={(e) => handleInputChange("procedureFiles", e.target.value)}
                  placeholder="Enter procedure files"
                  className="h-11 border-border/50 hover:border-border transition-colors"
                />
              </div>
            </div>

            {/* Data Files Section */}
            <div className="space-y-4">
              <div className="h-px bg-border/50" />
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground/90">Supp Data Files</Label>
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">No data to display</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="bg-yellow-200 hover:bg-yellow-300 text-black border-yellow-400">
                Cost Data
              </Button>
              <Button variant="outline" className="bg-yellow-200 hover:bg-yellow-300 text-black border-yellow-400">
                Create Cert
              </Button>
              <Button variant="outline" className="bg-gray-200 hover:bg-gray-300 text-black border-gray-400">
                Recreate Cert
              </Button>
            </div>

            {/* Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/20 rounded-lg">
              <div className="text-left">
                <div className="text-sm font-medium mb-1">CAL/CERT: ${Number(formData.calCertCost).toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">REPAIR: ${Number(formData.repairCost).toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">ALL: ${Number(formData.totalCost).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Default fields when no action code selected or unsupported action code - always show fields in accordion/bento view */}
        {(!formData.actionCode || !["build-new", "rc", "cc", "test", "repair", "rcc"].includes(formData.actionCode)) && (
          isAccordion ? (
            <div className="space-y-3">
              {/* Condition Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="conditionIn" className="text-xs font-medium">Condition In</Label>
                  <Select value={formData.conditionIn} onValueChange={(value) => handleInputChange("conditionIn", value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="conditionOut" className="text-xs font-medium">Condition Out</Label>
                  <Select value={formData.conditionOut} onValueChange={(value) => handleInputChange("conditionOut", value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="repaired">Repaired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Technician Fields */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="technician1" className="text-xs font-medium">Technician 1</Label>
                  <Select value={formData.technician1} onValueChange={(value) => handleInputChange("technician1", value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="technician2" className="text-xs font-medium">Technician 2</Label>
                  <Select value={formData.technician2} onValueChange={(value) => handleInputChange("technician2", value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="technician3" className="text-xs font-medium">Technician 3</Label>
                  <Select value={formData.technician3} onValueChange={(value) => handleInputChange("technician3", value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add Comment and Repair */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="addComment" className="text-xs font-medium">Add Comment</Label>
                  <Select value={formData.addComment} onValueChange={(value) => handleInputChange("addComment", value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select comment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border z-50">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="repairComments" className="text-xs font-medium">Repair</Label>
                  <Input
                    id="repairComments"
                    value={formData.repairComments}
                    onChange={(e) => handleInputChange("repairComments", e.target.value)}
                    placeholder="Enter repair comments..."
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <p>Select an action code to view lab-specific details</p>
            </div>
          )
        )}
      </div>
    );
  };

  // Render product images section
  const renderProductImagesSection = (noCard = false, isAccordion = false) => {
    const content = (
      <Tabs defaultValue="images">
        <div className="flex items-center justify-between">
          <TabsList className={isAccordion ? "h-8" : ""}>
            <TabsTrigger value="images" className={isAccordion ? "text-xs px-2 py-1" : ""}>Images</TabsTrigger>
            <TabsTrigger value="dateEntered" className={isAccordion ? "text-xs px-2 py-1" : ""}>Date Entered</TabsTrigger>
            <TabsTrigger value="actions" className={isAccordion ? "text-xs px-2 py-1" : ""}>Actions</TabsTrigger>
          </TabsList>
          <Button variant="default" size="sm" className={isAccordion ? "gap-1 h-7 text-xs" : "gap-2"}>
            <Camera className={isAccordion ? "h-3 w-3" : "h-4 w-4"} />
            Capture
          </Button>
        </div>
        
        <TabsContent value="images" className={isAccordion ? "mt-2" : "mt-4"}>
          <div className={`border-2 border-dashed rounded-lg ${isAccordion ? 'p-4' : 'p-6'} text-center`}>
            <p className={`text-muted-foreground ${isAccordion ? 'text-xs' : ''}`}>No images uploaded</p>
          </div>
        </TabsContent>
        
        <TabsContent value="dateEntered" className={isAccordion ? "mt-2" : "mt-4"}>
          <div className={`border rounded-lg ${isAccordion ? 'p-4' : 'p-6'} text-center`}>
            <p className={`text-muted-foreground ${isAccordion ? 'text-xs' : ''}`}>No history available</p>
          </div>
        </TabsContent>
        
        <TabsContent value="actions" className={isAccordion ? "mt-2" : "mt-4"}>
          <div className={`border rounded-lg ${isAccordion ? 'p-4' : 'p-6'} text-center`}>
            <p className={`text-muted-foreground ${isAccordion ? 'text-xs' : ''}`}>No actions recorded</p>
          </div>
        </TabsContent>
      </Tabs>
    );

    if (noCard) return content;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            Product Images
          </CardTitle>
          <CardDescription>Manage product media assets</CardDescription>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  };

  // Render cost section
  const renderCostSection = (isAccordion = false) => (
    <div className={isAccordion ? "space-y-3" : "space-y-6"}>
      {/* Summary Header - Cost Totals */}
      <div className={`grid grid-cols-1 md:grid-cols-3 ${isAccordion ? 'gap-2' : 'gap-4'}`}>
        <div className={`bg-background border-l-4 border-blue-600 ${isAccordion ? 'p-2' : 'p-4'} rounded-r`}>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Cal/Cert Cost</div>
          <div className={`${isAccordion ? 'text-base' : 'text-xl'} font-semibold text-blue-600 mt-1`}>${formData.calCertTotal}</div>
        </div>
        
        <div className={`bg-background border-l-4 border-amber-500 ${isAccordion ? 'p-2' : 'p-4'} rounded-r`}>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Repair Cost</div>
          <div className={`${isAccordion ? 'text-base' : 'text-xl'} font-semibold text-amber-500 mt-1`}>${formData.repairTotal}</div>
        </div>
        
        <div className={`bg-background border-l-4 border-emerald-600 ${isAccordion ? 'p-2' : 'p-4'} rounded-r`}>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Cost</div>
          <div className={`${isAccordion ? 'text-base' : 'text-xl'} font-semibold text-emerald-600 mt-1`}>${formData.allTotal}</div>
        </div>
      </div>

      {/* Toggle Link */}
      <div className="flex justify-end">
        <button onClick={() => handleInputChange("showCostDetails", !formData.showCostDetails)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          {formData.showCostDetails ? (<><ChevronUp className="h-3 w-3" />Hide Details</>) : (<><ChevronDown className="h-3 w-3" />Show Details</>)}
        </button>
      </div>

      {/* Collapsible Cost Details */}
      {formData.showCostDetails && (
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${isAccordion ? 'gap-3' : 'gap-6'}`}>
          {/* Cost Breakdown */}
          <div className={isAccordion ? "space-y-2" : "space-y-4"}>
            <div className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>Cost Breakdown</div>
            
            {/* Calibration & Certification */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Calibration & Certification</div>
              <div className="space-y-1 pl-2 border-l-2 border-blue-600/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs">C/C Cost</span>
                  <Input type="number" step="0.01" value={formData.ccCost} onChange={(e) => handleInputChange("ccCost", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">17025</span>
                  <Input type="number" step="0.01" value={formData.cost17025} onChange={(e) => handleInputChange("cost17025", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
              </div>
            </div>

            {/* Service Charges */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Service Charges</div>
              <div className="space-y-1 pl-2 border-l-2 border-amber-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Expedite</span>
                  <Input type="number" step="0.01" value={formData.expediteCost} onChange={(e) => handleInputChange("expediteCost", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Emergency</span>
                  <Input type="number" step="0.01" value={formData.emergencyCost} onChange={(e) => handleInputChange("emergencyCost", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Eval Fee</span>
                  <Input type="number" step="0.01" value={formData.evalFeeCost} onChange={(e) => handleInputChange("evalFeeCost", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
              </div>
            </div>

            {/* Repair & Parts */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Repair & Parts</div>
              <div className="space-y-1 pl-2 border-l-2 border-emerald-600/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Repair Cost</span>
                  <Input type="number" step="0.01" value={formData.repairCostTotal} onChange={(e) => handleInputChange("repairCostTotal", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">ESL Test Cost</span>
                  <Input type="number" step="0.01" value={formData.eslTestCost} onChange={(e) => handleInputChange("eslTestCost", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Parts Cost</span>
                  <Input type="number" step="0.01" value={formData.partsCostTotal} onChange={(e) => handleInputChange("partsCostTotal", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">T/F Cost</span>
                  <Input type="number" step="0.01" value={formData.tfCost} onChange={(e) => handleInputChange("tfCost", e.target.value)} className={isAccordion ? "h-7 w-24 text-xs" : "h-8 w-28"} />
                </div>
              </div>
            </div>
          </div>

          {/* Labor Hours */}
          <div className={isAccordion ? "space-y-2" : "space-y-4"}>
            <div className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>Labor Hours</div>
            
            {/* Header Row with Tech columns - aligned with "Calibration & Certification" header */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 gap-2">
                <div></div>
                <div className="text-xs text-muted-foreground text-center">Tech 1</div>
                <div className="text-xs text-muted-foreground text-center">Tech 2</div>
                <div className="text-xs text-muted-foreground text-center">Tech 3</div>
              </div>
              {/* C/C Cost row - aligns with C/C Cost in Calibration & Certification */}
              <div className="grid grid-cols-4 gap-2 items-center">
                <span className="text-xs">C/C Cost</span>
                <Input type="number" step="0.01" value={formData.tech1CcHours} onChange={(e) => handleInputChange("tech1CcHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
                <Input type="number" step="0.01" value={formData.tech2CcHours} onChange={(e) => handleInputChange("tech2CcHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
                <Input type="number" step="0.01" value={formData.tech3CcHours} onChange={(e) => handleInputChange("tech3CcHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
              </div>
            </div>
            
            {/* Spacer to align with Service Charges section */}
            <div className="space-y-1">
              <div className="text-xs text-transparent uppercase tracking-wider">Spacer</div>
              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-2 items-center h-8"></div>
                <div className="grid grid-cols-4 gap-2 items-center h-8"></div>
                <div className="grid grid-cols-4 gap-2 items-center h-8"></div>
              </div>
            </div>

            {/* Repair & ESL rows - aligns with Repair & Parts section */}
            <div className="space-y-1">
              <div className="text-xs text-transparent uppercase tracking-wider">Spacer</div>
              <div className="space-y-1">
                {/* Repair Cost row - aligns with Repair Cost */}
                <div className="grid grid-cols-4 gap-2 items-center">
                  <span className="text-xs">Repair Cost</span>
                  <Input type="number" step="0.01" value={formData.tech1RepairHours} onChange={(e) => handleInputChange("tech1RepairHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
                  <Input type="number" step="0.01" value={formData.tech2RepairHours} onChange={(e) => handleInputChange("tech2RepairHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
                  <Input type="number" step="0.01" value={formData.tech3RepairHours} onChange={(e) => handleInputChange("tech3RepairHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
                </div>
                {/* ESL Test Cost row - aligns with ESL Test Cost */}
                <div className="grid grid-cols-4 gap-2 items-center">
                  <span className="text-xs">ESL Test Cost</span>
                  <Input type="number" step="0.01" value={formData.tech1EslTestHours} onChange={(e) => handleInputChange("tech1EslTestHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
                  <Input type="number" step="0.01" value={formData.tech2EslTestHours} onChange={(e) => handleInputChange("tech2EslTestHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
                  <Input type="number" step="0.01" value={formData.tech3EslTestHours} onChange={(e) => handleInputChange("tech3EslTestHours", e.target.value)} className={isAccordion ? "h-7 text-xs text-center" : "h-8 text-center"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render accessories section
  const renderAccessoriesSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Layers className="h-5 w-5 text-primary" />
          Accessories
        </CardTitle>
        <CardDescription>Manage product accessories and components</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
          <div className="space-y-1">
            <Label htmlFor="accessoryType" className="text-xs">Type</Label>
            <Select value={formData.accessoryType} onValueChange={(value) => handleInputChange("accessoryType", value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="containers">Containers</SelectItem>
                <SelectItem value="cables">Cables</SelectItem>
                <SelectItem value="adapters">Adapters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="accessory" className="text-xs">Item</Label>
            <Select value={formData.accessory} onValueChange={(value) => handleInputChange("accessory", value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="case">Case</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="cable">Cable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="accessoryMaterial" className="text-xs">Material</Label>
            <Input
              id="accessoryMaterial"
              value={formData.accessoryMaterial}
              onChange={(e) => handleInputChange("accessoryMaterial", e.target.value)}
              placeholder="Material"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="accessoryColor" className="text-xs">Color</Label>
            <Select value={formData.accessoryColor} onValueChange={(value) => handleInputChange("accessoryColor", value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="accessoryQty" className="text-xs">Qty</Label>
            <Input
              id="accessoryQty"
              type="number"
              value={formData.accessoryQty}
              onChange={(e) => handleInputChange("accessoryQty", e.target.value)}
              placeholder="1"
              className="h-9"
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <Button size="sm" className="h-9 w-full" onClick={handleAddAccessory}>Add</Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <div className="bg-muted grid grid-cols-6 gap-4 p-2 text-xs font-medium min-w-[600px]">
            <div>Type</div>
            <div>Accessory</div>
            <div>Material</div>
            <div>Color</div>
            <div>Qty</div>
            <div>Actions</div>
          </div>
          {accessoriesList.length > 0 ? (
            <div className="divide-y">
              {accessoriesList.map((accessory) => (
                <div key={accessory.id} className="grid grid-cols-6 gap-4 p-3 text-sm min-w-[600px]">
                  <div className="capitalize">{accessory.type}</div>
                  <div className="capitalize">{accessory.accessory}</div>
                  <div>{accessory.material || '-'}</div>
                  <div className="capitalize">{accessory.color || '-'}</div>
                  <div>{accessory.qty}</div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAccessory(accessory.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No accessories added
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render parts section
  const renderPartsSection = (noCard = false, isAccordion = false) => {
    const content = (
      <div className={noCard ? (isAccordion ? "space-y-2" : "space-y-4") : ""}>
        {!noCard && (
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Parts</h3>
              <p className="text-sm text-muted-foreground">Manage replacement parts and components</p>
            </div>
          </div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-6 ${isAccordion ? 'gap-2' : 'gap-3'} items-end`}>
          <div className="space-y-1">
            <Label htmlFor="partsCategory" className="text-xs">Category <span className="text-destructive">*</span></Label>
            <Select value={formData.partsCategory} onValueChange={(value) => handleInputChange("partsCategory", value)} required>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-9"}><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent className="bg-popover border z-50">
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
                <SelectItem value="software">Software</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="partsNumber" className="text-xs">Part Number <span className="text-destructive">*</span></Label>
            <Input id="partsNumber" value={formData.partsNumber} onChange={(e) => handleInputChange("partsNumber", e.target.value)} placeholder="Part number" className={isAccordion ? "h-7 text-xs" : "h-9"} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="partsDescription" className="text-xs">Description</Label>
            <Input id="partsDescription" value={formData.partsDescription} onChange={(e) => handleInputChange("partsDescription", e.target.value)} placeholder="Description" className={isAccordion ? "h-7 text-xs" : "h-9"} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="partsCost" className="text-xs">Cost</Label>
            <Input id="partsCost" type="number" value={formData.partsCost} onChange={(e) => handleInputChange("partsCost", e.target.value)} placeholder="0.00" className={isAccordion ? "h-7 text-xs" : "h-9"} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="partsQty" className="text-xs">Qty <span className="text-destructive">*</span></Label>
            <Input id="partsQty" type="number" value={formData.partsQty} onChange={(e) => handleInputChange("partsQty", e.target.value)} placeholder="1" className={isAccordion ? "h-7 text-xs" : "h-9"} required />
          </div>

          <div>
            <Button size="sm" className={isAccordion ? "h-7 w-full text-xs" : "h-9 w-full"} onClick={handleAddPart}>Add Part</Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <div className={`bg-muted grid grid-cols-7 gap-4 ${isAccordion ? 'p-1.5' : 'p-2'} text-xs font-medium min-w-[700px]`}>
            <div>Category</div>
            <div>Part Number</div>
            <div>Description</div>
            <div>Cost</div>
            <div>Qty</div>
            <div>Total</div>
            <div>Actions</div>
          </div>
          {partsList.length > 0 ? (
            <div className="divide-y">
              {partsList.map((part) => {
                const cost = parseFloat(part.cost) || 0;
                const qty = parseInt(part.qty) || 0;
                const total = (cost * qty).toFixed(2);
                return (
                  <div key={part.id} className={`grid grid-cols-7 gap-4 ${isAccordion ? 'p-2 text-xs' : 'p-3 text-sm'} min-w-[700px]`}>
                    <div className="capitalize">{part.category}</div>
                    <div>{part.partNumber}</div>
                    <div>{part.description}</div>
                    <div>${part.cost}</div>
                    <div>{part.qty}</div>
                    <div>${total}</div>
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemovePart(part.id)} className={isAccordion ? "h-6 w-6 p-0 text-destructive hover:text-destructive" : "h-8 w-8 p-0 text-destructive hover:text-destructive"}>
                        <Trash2 className={isAccordion ? "h-3 w-3" : "h-4 w-4"} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`${isAccordion ? 'p-4' : 'p-6'} text-center text-muted-foreground text-sm`}>No parts added</div>
          )}
        </div>
      </div>
    );

    if (noCard) return content;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-primary" />
            Parts
          </CardTitle>
          <CardDescription>Manage replacement parts and components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {content}
        </CardContent>
      </Card>
    );
  };

  // Render transit section
  const renderTransitSection = (noCard = false, isAccordion = false) => {
    const handleSetInTransit = () => {
      if (!formData.originLocation || !formData.destinationLocation || !formData.huQty || !formData.huType || !formData.deliverTo || !formData.deliveryType) {
        toast({ title: "Missing Required Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
      toast({ title: "Transit Set Successfully", description: "Transit configuration has been saved." });
    };

    const content = (
      <div className={isAccordion ? "space-y-2" : "space-y-6"}>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isAccordion ? 'gap-2' : 'gap-4'}`}>
          <div className="space-y-1">
            <Label htmlFor="originLocation" className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>Origin Location <span className="text-destructive">*</span></Label>
            <Select value={formData.originLocation} onValueChange={(value) => handleInputChange("originLocation", value)} required>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}><SelectValue placeholder="Select origin location" /></SelectTrigger>
              <SelectContent className="bg-popover border z-50">
                <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                <SelectItem value="facility-1">Facility 1</SelectItem>
                <SelectItem value="facility-2">Facility 2</SelectItem>
                <SelectItem value="depot-main">Main Depot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="destinationLocation" className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>Destination Location <span className="text-destructive">*</span></Label>
            <Select value={formData.destinationLocation} onValueChange={(value) => handleInputChange("destinationLocation", value)} required>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}><SelectValue placeholder="Select destination location" /></SelectTrigger>
              <SelectContent className="bg-popover border z-50">
                <SelectItem value="customer-site-1">Customer Site 1</SelectItem>
                <SelectItem value="customer-site-2">Customer Site 2</SelectItem>
                <SelectItem value="branch-office">Branch Office</SelectItem>
                <SelectItem value="service-center">Service Center</SelectItem>
                <SelectItem value="field-location">Field Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="huQty" className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>HU Qty <span className="text-destructive">*</span></Label>
            <Input id="huQty" value={formData.huQty} onChange={(e) => handleInputChange("huQty", e.target.value)} placeholder="Enter quantity" className={isAccordion ? "h-7 text-xs" : "h-11"} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="huType" className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>HU Type <span className="text-destructive">*</span></Label>
            <Select value={formData.huType} onValueChange={(value) => handleInputChange("huType", value)} required>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}><SelectValue placeholder="Select HU type" /></SelectTrigger>
              <SelectContent className="bg-popover border z-50">
                <SelectItem value="box">Box</SelectItem>
                <SelectItem value="pallet">Pallet</SelectItem>
                <SelectItem value="container">Container</SelectItem>
                <SelectItem value="crate">Crate</SelectItem>
                <SelectItem value="case">Case</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="deliverTo" className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>Deliver To <span className="text-destructive">*</span></Label>
            <Select value={formData.deliverTo} onValueChange={(value) => handleInputChange("deliverTo", value)} required>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}><SelectValue placeholder="Select delivery recipient" /></SelectTrigger>
              <SelectContent className="bg-popover border z-50">
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="technician">Field Technician</SelectItem>
                <SelectItem value="supervisor">Site Supervisor</SelectItem>
                <SelectItem value="manager">Facility Manager</SelectItem>
                <SelectItem value="coordinator">Logistics Coordinator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="deliveryType" className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>Delivery Type <span className="text-destructive">*</span></Label>
            <Select value={formData.deliveryType} onValueChange={(value) => handleInputChange("deliveryType", value)} required>
              <SelectTrigger className={isAccordion ? "h-7 text-xs" : "h-11"}><SelectValue placeholder="Select delivery type" /></SelectTrigger>
              <SelectContent className="bg-popover border z-50">
                <SelectItem value="shuttle">Shuttle</SelectItem>
                <SelectItem value="courier">Courier</SelectItem>
                <SelectItem value="freight">Freight</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="transitNotes" className={`${isAccordion ? 'text-xs' : 'text-sm'} font-medium`}>Notes</Label>
          <Textarea id="transitNotes" value={formData.transitNotes} onChange={(e) => handleInputChange("transitNotes", e.target.value)} placeholder="Enter transit notes and special instructions..." className={isAccordion ? "min-h-[60px] resize-none text-sm" : "min-h-[120px] resize-none"} />
        </div>

        <Button onClick={handleSetInTransit} size="sm" className={isAccordion ? "w-auto h-7 text-xs" : "w-auto"}>Set In Transit</Button>
      </div>
    );

    if (noCard) return content;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Truck className="h-5 w-5 text-primary" />Set In Transit</CardTitle>
          <CardDescription>Configure transit logistics and delivery details</CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  };

  // Render comments section
  const renderCommentsSection = () => (
    <WorkOrderItemComments workOrderItemId={formData.workOrderNumber} />
  );

  // Render Work Order Items section
  const renderWorkOrderItemsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Work Order Items</h2>
          <p className="text-sm text-muted-foreground">Manage items in this work order</p>
        </div>
      </div>
      
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No items added yet. Click "Add New Item" to get started.</p>
      </div>
    </div>
  );

  // Render Estimate section
  const renderEstimateSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Estimate</h2>
          <p className="text-sm text-muted-foreground">Cost estimation and pricing details</p>
        </div>
      </div>
      
      <EstimateDetails userRole={userRole} onUserRoleChange={setUserRole} />
    </div>
  );

  // Handle add activity log
  const handleAddActivityLog = () => {
    if (!activityLogType || !activityLogComment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a type and enter a comment.",
        variant: "destructive"
      });
      return;
    }

    const newActivity = {
      type: activityLogType,
      user: "Admin User", // In real app, this would be current user
      date: new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      details: activityLogComment
    };

    setActivityHistory([newActivity, ...activityHistory]);
    setActivityLogComment("");
    setActivityLogType("");
    setIncludeInCopyAsNew(false);
    
    toast({
      title: "Activity Added",
      description: "Activity log entry has been added successfully."
    });
  };

  // Get unique values for filters and filtered activity history
  const uniqueActivityTypes = Array.from(new Set(activityHistory.map(a => a.type)));
  const uniqueActivityUsers = Array.from(new Set(activityHistory.map(a => a.user)));

  const filteredActivityHistory = activityHistory.filter(activity => {
    const typeMatch = filterActivityType === "all" || activity.type === filterActivityType;
    const userMatch = filterActivityUser === "all" || activity.user === filterActivityUser;
    
    // Date range filter
    let dateMatch = true;
    if (dateRange.from || dateRange.to) {
      // Parse the activity date string (format: "MM/DD/YYYY, HH:MM AM/PM")
      const activityDateStr = activity.date.split(',')[0]; // Get just the date part
      const [month, day, year] = activityDateStr.split('/').map(Number);
      const activityDate = new Date(year, month - 1, day);
      activityDate.setHours(0, 0, 0, 0); // Reset time for comparison
      
      if (dateRange.from && dateRange.to) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = activityDate >= fromDate && activityDate <= toDate;
      } else if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        dateMatch = activityDate >= fromDate;
      } else if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = activityDate <= toDate;
      }
    }
    
    return typeMatch && userMatch && dateMatch;
  });

  // Render Activity Log section
  const renderActivityLog = (isAccordion = false) => (
    <div className={isAccordion ? "" : "mb-24"}>
      {isAccordion ? (
        <div className="space-y-3">
          {/* Add New Activity - Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            <div className="lg:col-span-2">
              <Label className="text-[10px] font-medium text-muted-foreground mb-1 block">TYPE</Label>
              <Select value={activityLogType} onValueChange={setActivityLogType}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estimate">Estimate</SelectItem>
                  <SelectItem value="Status Update">Status Update</SelectItem>
                  <SelectItem value="Lab Work">Lab Work</SelectItem>
                  <SelectItem value="Customer Contact">Customer Contact</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-10">
              <Label className="text-[10px] font-medium text-muted-foreground mb-1 block">COMMENT</Label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Enter your comment..."
                  value={activityLogComment}
                  onChange={(e) => setActivityLogComment(e.target.value)}
                  className="min-h-[28px] h-7 resize-none flex-1 text-xs py-1"
                />
                <Button 
                  onClick={handleAddActivityLog}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground h-7 px-3 text-xs whitespace-nowrap"
                  size="sm"
                >
                  <span className="mr-1">+</span> Add
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Checkbox
                  id="activityCopyAsNewAccordion"
                  checked={includeInCopyAsNew}
                  onCheckedChange={(checked) => setIncludeInCopyAsNew(checked as boolean)}
                  className="h-3 w-3"
                />
                <Label htmlFor="activityCopyAsNewAccordion" className="text-[10px] text-muted-foreground cursor-pointer">
                  Include in Copy as New
                </Label>
              </div>
            </div>
          </div>

          {/* Activity History - Compact */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs">Activity History</h4>
              <Badge variant="secondary" className="text-[10px] h-5">
                {activityHistory.length}
              </Badge>
            </div>

            <div className="border rounded overflow-hidden">
              <div className="bg-muted/50 grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-medium text-muted-foreground border-b">
                <div className="col-span-2">TYPE</div>
                <div className="col-span-2">USER</div>
                <div className="col-span-2">DATE</div>
                <div className="col-span-6">DETAILS</div>
              </div>

              {/* Quick Search Filters Row - Compact */}
              {activityHistory.length > 0 && (
                <div className="bg-background border-b border-border">
                  <div className="grid grid-cols-12 gap-2 px-3 py-1.5">
                    <div className="col-span-2">
                      <Select value={filterActivityType} onValueChange={setFilterActivityType}>
                        <SelectTrigger className="h-6 bg-background text-[10px] border-border">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="all">All Types</SelectItem>
                          {uniqueActivityTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Select value={filterActivityUser} onValueChange={setFilterActivityUser}>
                        <SelectTrigger className="h-6 bg-background text-[10px] border-border">
                          <SelectValue placeholder="All Users" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="all">All Users</SelectItem>
                          {uniqueActivityUsers.map(user => (
                            <SelectItem key={user} value={user}>{user}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-6 w-full justify-start text-left font-normal text-[10px] border-border px-2",
                              !dateRange.from && !dateRange.to && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-1 h-2.5 w-2.5" />
                            {dateRange.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "MM/dd/yy")} - {format(dateRange.to, "MM/dd/yy")}
                                </>
                              ) : (
                                format(dateRange.from, "MM/dd/yy")
                              )
                            ) : (
                              <span>All Dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                          <Calendar
                            mode="range"
                            selected={{ from: dateRange.from, to: dateRange.to }}
                            onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                            numberOfMonths={2}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="col-span-6 flex items-center">
                      {(filterActivityType !== "all" || filterActivityUser !== "all" || dateRange.from || dateRange.to) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setFilterActivityType("all");
                            setFilterActivityUser("all");
                            setDateRange({ from: undefined, to: undefined });
                          }}
                          className="h-6 text-[10px] px-2"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="divide-y divide-border">
                {filteredActivityHistory.length > 0 ? (
                  filteredActivityHistory.map((activity, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 px-3 py-1.5 text-xs hover:bg-muted/30 transition-colors border-b border-border last:border-b-0">
                      <div className="col-span-2">
                        <Badge 
                          variant={activity.type === "Estimate" ? "default" : "secondary"}
                          className="text-[10px] h-5"
                        >
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-xs">{activity.user}</div>
                      <div className="col-span-2 text-[10px] text-muted-foreground">{activity.date}</div>
                      <div className="col-span-6 text-xs">{activity.details}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                    {activityHistory.length === 0 ? 'No activity recorded yet' : 'No matching activities found'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="border shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Add New Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground mb-2 block">TYPE</Label>
                  <Select value={activityLogType} onValueChange={setActivityLogType}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Estimate">Estimate</SelectItem>
                      <SelectItem value="Status Update">Status Update</SelectItem>
                      <SelectItem value="Lab Work">Lab Work</SelectItem>
                      <SelectItem value="Customer Contact">Customer Contact</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-10">
                  <Label className="text-xs font-medium text-muted-foreground mb-2 block">COMMENT</Label>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Enter your comment..."
                      value={activityLogComment}
                      onChange={(e) => setActivityLogComment(e.target.value)}
                      className="min-h-[36px] h-9 resize-none flex-1"
                    />
                    <Button 
                      onClick={handleAddActivityLog}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground h-9 px-4 whitespace-nowrap"
                    >
                      <span className="mr-1">+</span> Add
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox
                      id="activityCopyAsNew"
                      checked={includeInCopyAsNew}
                      onCheckedChange={(checked) => setIncludeInCopyAsNew(checked as boolean)}
                    />
                    <Label htmlFor="activityCopyAsNew" className="text-xs text-muted-foreground cursor-pointer">
                      Include in Copy as New
                    </Label>
                  </div>
                </div>
              </div>

              {/* Activity History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Activity History</h4>
                  <Badge variant="secondary" className="text-xs">
                    {activityHistory.length}
                  </Badge>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 grid grid-cols-12 gap-4 px-4 py-2.5 text-xs font-medium text-muted-foreground border-b">
                    <div className="col-span-2">TYPE</div>
                    <div className="col-span-2">USER</div>
                    <div className="col-span-2">DATE</div>
                    <div className="col-span-6">DETAILS</div>
                  </div>

                  {/* Quick Search Filters Row */}
                  {activityHistory.length > 0 && (
                    <div className="bg-background border-b border-border">
                      <div className="grid grid-cols-12 gap-4 px-4 py-3">
                        <div className="col-span-2">
                          <Select value={filterActivityType} onValueChange={setFilterActivityType}>
                            <SelectTrigger className="h-8 bg-background text-xs border-border">
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-50">
                              <SelectItem value="all">All Types</SelectItem>
                              {uniqueActivityTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Select value={filterActivityUser} onValueChange={setFilterActivityUser}>
                            <SelectTrigger className="h-8 bg-background text-xs border-border">
                              <SelectValue placeholder="All Users" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-50">
                              <SelectItem value="all">All Users</SelectItem>
                              {uniqueActivityUsers.map(user => (
                                <SelectItem key={user} value={user}>{user}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-8 w-full justify-start text-left font-normal text-xs border-border",
                                  !dateRange.from && !dateRange.to && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                {dateRange.from ? (
                                  dateRange.to ? (
                                    <>
                                      {format(dateRange.from, "MM/dd/yy")} - {format(dateRange.to, "MM/dd/yy")}
                                    </>
                                  ) : (
                                    format(dateRange.from, "MM/dd/yy")
                                  )
                                ) : (
                                  <span>All Dates</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                              <Calendar
                                mode="range"
                                selected={{ from: dateRange.from, to: dateRange.to }}
                                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                                numberOfMonths={2}
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="col-span-6 flex items-center">
                          {(filterActivityType !== "all" || filterActivityUser !== "all" || dateRange.from || dateRange.to) && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setFilterActivityType("all");
                                setFilterActivityUser("all");
                                setDateRange({ from: undefined, to: undefined });
                              }}
                              className="h-8 text-xs px-3"
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="divide-y divide-border">
                    {filteredActivityHistory.length > 0 ? (
                      filteredActivityHistory.map((activity, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 text-sm hover:bg-muted/30 transition-colors border-b border-border last:border-b-0">
                          <div className="col-span-2">
                            <Badge 
                              variant={activity.type === "Estimate" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {activity.type}
                            </Badge>
                          </div>
                          <div className="col-span-2 text-sm">{activity.user}</div>
                          <div className="col-span-2 text-xs text-muted-foreground">{activity.date}</div>
                          <div className="col-span-6 text-sm">{activity.details}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        {activityHistory.length === 0 ? 'No activity recorded yet' : 'No matching activities found'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
        </Card>
      )}
    </div>
  );

  // Render QF3 Data section
  const renderQF3DataSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">QF3 Data</h2>
          <p className="text-sm text-muted-foreground">Quality and test data information</p>
        </div>
      </div>
      
      <div className="text-center py-8 text-muted-foreground">
        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>QF3 data will be displayed here.</p>
      </div>
    </div>
  );

  // Render work order header (default style)
  const renderWorkOrderHeader = () => (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 mt-4 sm:mt-6">
      <div className="flex flex-col gap-4">
        
        {/* Header Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Work Order #</Label>
            <Input
              value={formData.workOrderNumber}
              onChange={(e) => handleInputChange("workOrderNumber", e.target.value)}
              className="mt-1 font-semibold text-lg"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">SR Doc</Label>
            <div className="text-sm p-2 bg-muted rounded border mt-1 h-9 flex items-center">
              {formData.srDoc ? (
                <a 
                  href="#"
                  className="text-black hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Opening SR Document:', formData.srDoc);
                    // TODO: Navigate to SR document or open in modal
                  }}
                >
                  {formData.srDoc}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Salesperson</Label>
            <div className="text-sm p-2 bg-muted rounded border mt-1 h-9 flex items-center">
              {formData.salesperson || <span className="text-muted-foreground">Not assigned</span>}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
            <Input
              value={formData.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              placeholder="Contact information"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render minimal work order header
  const renderMinimalWorkOrderHeader = () => (
    <div className="pt-4 sm:pt-6 mb-4 sm:mb-6 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Work Order #</span>
          <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-medium">{formData.workOrderNumber}</span>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">SR Doc</span>
          <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            {formData.srDoc ? (
              <a 
                href="#" 
                className="text-sm text-black hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Opening SR Document:', formData.srDoc);
                  // TODO: Navigate to SR document or open in modal
                }}
              >
                {formData.srDoc}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Salesperson</span>
          <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm">{formData.salesperson}</span>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Contact</span>
          <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm">Contact information</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render tabbed interface
  const renderTabbedInterface = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className={cn(isESLType && "mb-24")}>
      {/* Sticky section containing Type/Report Number and Tabs */}
      <div className="sticky top-[57px] z-30 bg-background shadow-sm">
        {/* Type and Report Number fields */}
        <div className="bg-card px-6 py-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto z-50">
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="esl-blankets">ESL - Blankets</SelectItem>
                  <SelectItem value="esl-coverups">ESL - CoverUps</SelectItem>
                  <SelectItem value="esl-footwear">ESL - Footwear</SelectItem>
                  <SelectItem value="esl-gloves">ESL - Gloves</SelectItem>
                  <SelectItem value="esl-grounds">ESL - Grounds</SelectItem>
                  <SelectItem value="esl-hotsticks">ESL - Hotsticks</SelectItem>
                  <SelectItem value="esl-insulated-tools">ESL - Insulated Tools</SelectItem>
                  <SelectItem value="esl-jumpers">ESL - Jumpers</SelectItem>
                  <SelectItem value="esl-line-hoses">ESL - Line Hoses</SelectItem>
                  <SelectItem value="esl-matting">ESL - Matting</SelectItem>
                  <SelectItem value="esl-roll-blankets">ESL - Roll Blankets</SelectItem>
                  <SelectItem value="esl-sleeves">ESL - Sleeves</SelectItem>
                  <SelectItem value="itl-gauges">ITL - Gauges</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportNumber" className="text-sm font-medium">Report Number *</Label>
              <Input
                id="reportNumber"
                value={formData.reportNumber}
                onChange={(e) => handleInputChange("reportNumber", e.target.value)}
                placeholder="0152.01-802930-001"
                className="h-11"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Tabs - only visible when type is selected */}
        {formData.type && (
          <div className="bg-card px-6 py-3 border-b">
            <TabsList 
              className={cn(
                "grid h-10 sm:h-11 items-center rounded-md bg-muted p-1 text-muted-foreground w-full gap-1",
                isESLType ? "grid-cols-4" : "grid-cols-7"
              )}
              onKeyDown={handleTabKeyDown}
            >
              {firstRowTabs.map((tab) => {
                const Icon = tab.icon;
                const status = tabStatus[tab.value];
                
                return (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm relative"
                  >
                    <Icon className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline text-xs">{tab.label}</span>
                    {status === 'completed' && (
                      <CheckCircle className="h-3 w-3 ml-1 text-green-600 dark:text-green-500" />
                    )}
                    {status === 'error' && (
                      <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {/* Second Row - Activity Log */}
            {secondRowTabs.length > 0 && (
              <TabsList className="inline-flex h-9 items-center rounded-md bg-muted p-1 text-muted-foreground mt-2">
                {secondRowTabs.map((tab) => {
                  const Icon = tab.icon;
                  const status = tabStatus[tab.value];
                  
                  return (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm relative"
                    >
                      <Icon className="h-4 w-4 sm:mr-1.5" />
                      <span className="hidden sm:inline text-xs">{tab.label}</span>
                      {status === 'completed' && (
                        <CheckCircle className="h-3 w-3 ml-1 text-green-600 dark:text-green-500" />
                      )}
                      {status === 'error' && (
                        <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            )}
          </div>
        )}
      </div>

      {/* Tab Content */}
      {formData.type ? (
        <Card className="border-0 shadow-md rounded-t-none">
          <CardContent 
            data-tab-content 
            className={cn("p-6 transition-opacity duration-200", isESLType && "pb-24")}
          >
            <TabsContent value="general" className="mt-0 space-y-6 animate-fade-in">
              {renderGeneralSection()}
              {!isESLType && (
                <>
                  {renderProductSection()}
                  {renderLogisticsSection()}
                </>
              )}
            </TabsContent>

            {isESLType ? (
              <>
                {/* ESL-specific tabs */}
                <TabsContent value="details" className="mt-0 space-y-6 animate-fade-in">
                  {renderDetailsSection()}
                </TabsContent>

                <TabsContent value="testing" className="mt-0 space-y-6 animate-fade-in">
                  {renderTestingSection()}
                </TabsContent>

                <TabsContent value="work-status" className="mt-0 space-y-6 animate-fade-in">
                  {renderWorkStatusSection()}
                </TabsContent>
              </>
            ) : (
              <>
                {/* SINGLE type tabs */}

                <TabsContent value="cost" className="mt-0 space-y-6 animate-fade-in">
                  {renderLabSection()}
                  {renderCostSection()}
                </TabsContent>

                <TabsContent value="factory-config" className="mt-0 space-y-6 animate-fade-in">
                  {renderFactoryConfigSection()}
                </TabsContent>

                <TabsContent value="transit" className="mt-0 space-y-6 animate-fade-in">
                  {renderTransitSection()}
                </TabsContent>

                <TabsContent value="accessories" className="mt-0 space-y-6 animate-fade-in">
                  {renderAccessoriesSection()}
                </TabsContent>

                <TabsContent value="parts" className="mt-0 space-y-6 animate-fade-in">
                  {renderPartsSection()}
                </TabsContent>

                <TabsContent value="options" className="mt-0 space-y-6 animate-fade-in">
                  {renderOptionsSection()}
                  {renderProductImagesSection()}
                </TabsContent>

                <TabsContent value="activity-log" className="mt-0 space-y-6 animate-fade-in">
                  {renderActivityLog()}
                </TabsContent>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-md rounded-t-none">
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Select a Type to Continue</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Please select an item type from the dropdown above to view and fill out the detailed form sections.
              </p>
            </div>
          </div>
        </Card>
      )}
    </Tabs>
  );

  // Render accordion-based tabs interface (new version with tabs as accordions)
  const renderAccordionTabsInterface = () => (
    <div className="space-y-4" style={{ paddingBottom: `${footerHeight}px` }}>
      {/* Sticky section containing Type/Report Number */}
      <div className="sticky top-[57px] z-30 bg-background shadow-sm">
        {/* Type and Report Number fields */}
        <div className="bg-card px-4 py-2 border-b rounded-t-lg">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
              <div className="space-y-1">
                <Label htmlFor="type" className="text-xs font-medium">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto z-50">
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="esl-blankets">ESL - Blankets</SelectItem>
                    <SelectItem value="esl-coverups">ESL - CoverUps</SelectItem>
                    <SelectItem value="esl-footwear">ESL - Footwear</SelectItem>
                    <SelectItem value="esl-gloves">ESL - Gloves</SelectItem>
                    <SelectItem value="esl-grounds">ESL - Grounds</SelectItem>
                    <SelectItem value="esl-hotsticks">ESL - Hotsticks</SelectItem>
                    <SelectItem value="esl-insulated-tools">ESL - Insulated Tools</SelectItem>
                    <SelectItem value="esl-jumpers">ESL - Jumpers</SelectItem>
                    <SelectItem value="esl-line-hoses">ESL - Line Hoses</SelectItem>
                    <SelectItem value="esl-matting">ESL - Matting</SelectItem>
                    <SelectItem value="esl-roll-blankets">ESL - Roll Blankets</SelectItem>
                    <SelectItem value="esl-sleeves">ESL - Sleeves</SelectItem>
                    <SelectItem value="itl-gauges">ITL - Gauges</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reportNumber" className="text-xs font-medium">Report Number *</Label>
                <Input
                  id="reportNumber"
                  value={formData.reportNumber}
                  onChange={(e) => handleInputChange("reportNumber", e.target.value)}
                  placeholder="0152.01-802930-001"
                  className="h-8 text-xs"
                  readOnly
                />
              </div>
            </div>
            
            <div className="flex flex-col text-[10px] text-muted-foreground pb-1">
              <span><span className="font-medium">Created:</span> 09/09/2025 by Admin</span>
              <span><span className="font-medium">Modified:</span> 09/09/2025 by Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Content - only visible when type is selected */}
      {formData.type ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            {isESLType ? (
              // ESL Type Tabs
              <Tabs value={activeEslTab} onValueChange={setActiveEslTab} className="w-full">
                <TabsList className="w-full mb-4 h-10">
                  <TabsTrigger value="general" className="flex-1 gap-2">
                    <Info className="h-4 w-4" />
                    General
                    {tabStatus['general'] === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {tabStatus['general'] === 'error' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex-1 gap-2">
                    <FileText className="h-4 w-4" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="work-status" className="flex-1 gap-2">
                    <Clock className="h-4 w-4" />
                    Work Status
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-0">
                  {renderGeneralSection(accordionDensity === 'compact')}
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  {renderDetailsSection()}
                </TabsContent>

                <TabsContent value="work-status" className="mt-0">
                  {renderWorkStatusSection()}
                </TabsContent>
              </Tabs>
            ) : (
              // SINGLE Type Accordion (expanded sections)
              <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="space-y-0 accordion-fields">
                <AccordionItem value="general" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Info className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">General</h3>
                      {tabStatus['general'] === 'completed' && (
                        <CheckCircle className="h-4 w-4 ml-auto mr-2 text-green-600" />
                      )}
                      {tabStatus['general'] === 'error' && (
                        <AlertCircle className="h-4 w-4 ml-auto mr-2 text-destructive" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {renderGeneralSection(accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="product" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Product</h3>
                      {tabStatus['product'] === 'completed' && (
                        <CheckCircle className="h-4 w-4 ml-auto mr-2 text-green-600" />
                      )}
                      {tabStatus['product'] === 'error' && (
                        <AlertCircle className="h-4 w-4 ml-auto mr-2 text-destructive" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    {renderProductSection(accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="logistics" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Logistics</h3>
                      {tabStatus['logistics'] === 'completed' && (
                        <CheckCircle className="h-4 w-4 ml-auto mr-2 text-green-600" />
                      )}
                      {tabStatus['logistics'] === 'error' && (
                        <AlertCircle className="h-4 w-4 ml-auto mr-2 text-destructive" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {renderLogisticsSection(accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="lab-cost" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Lab + Cost</h3>
                      {tabStatus['cost'] === 'completed' && (
                        <CheckCircle className="h-4 w-4 ml-auto mr-2 text-green-600" />
                      )}
                      {tabStatus['cost'] === 'error' && (
                        <AlertCircle className="h-4 w-4 ml-auto mr-2 text-destructive" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 space-y-2">
                    {renderLabSection(accordionDensity === 'compact')}
                    {renderCostSection(accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="factory" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Factory</h3>
                      {tabStatus['factory-config'] === 'completed' && (
                        <CheckCircle className="h-4 w-4 ml-auto mr-2 text-green-600" />
                      )}
                      {tabStatus['factory-config'] === 'error' && (
                        <AlertCircle className="h-4 w-4 ml-auto mr-2 text-destructive" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {renderFactoryConfigSection(accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="transit" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Transit</h3>
                      {tabStatus['transit'] === 'completed' && (
                        <CheckCircle className="h-4 w-4 ml-auto mr-2 text-green-600" />
                      )}
                      {tabStatus['transit'] === 'error' && (
                        <AlertCircle className="h-4 w-4 ml-auto mr-2 text-destructive" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {renderTransitSection(true, accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parts" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Parts</h3>
                      {tabStatus['parts'] === 'completed' && (
                        <CheckCircle className="h-4 w-4 ml-auto mr-2 text-green-600" />
                      )}
                      {tabStatus['parts'] === 'error' && (
                        <AlertCircle className="h-4 w-4 ml-auto mr-2 text-destructive" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {renderPartsSection(true, accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="images" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Images</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {renderProductImagesSection(true, accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="additional" className="border-b">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <List className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Additional</h3>
                      {tabStatus['options'] === 'completed' && (
                        <CheckCircle className="h-4 w-4 ml-auto mr-2 text-green-600" />
                      )}
                      {tabStatus['options'] === 'error' && (
                        <AlertCircle className="h-4 w-4 ml-auto mr-2 text-destructive" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {renderOptionsSection(accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="activity-log" className="border-b-0">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-foreground" />
                      <h3 className="font-semibold">Comments</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {renderActivityLog(accordionDensity === 'compact')}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-md">
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Select a Type to Continue</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Please select an item type from the dropdown above to view and fill out the detailed form sections.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderAccordionInterface = () => (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <Accordion type="multiple" defaultValue={["general"]} className="space-y-4">
          <AccordionItem value="general" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold">General Information</h3>
                  <p className="text-sm text-muted-foreground">Basic work order item details</p>
                </div>
                {isSectionComplete('general') && (
                  <Badge variant="default" className="ml-auto mr-4">Complete</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {renderGeneralSection(accordionDensity === 'compact')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="product" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold">Product Information</h3>
                  <p className="text-sm text-muted-foreground">Technical specifications and details</p>
                </div>
                {isSectionComplete('product') && (
                  <Badge variant="default" className="ml-auto mr-4">Complete</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              {renderProductSection(accordionDensity === 'compact')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="logistics" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold">Logistics Information</h3>
                  <p className="text-sm text-muted-foreground">Shipping and arrival details</p>
                </div>
                {isSectionComplete('logistics') && (
                  <Badge variant="default" className="ml-auto mr-4">Complete</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {renderLogisticsSection(accordionDensity === 'compact')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="options" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold">Additional Options</h3>
                  <p className="text-sm text-muted-foreground">Configure additional settings and options</p>
                </div>
                {isSectionComplete('options') && (
                  <Badge variant="default" className="ml-auto mr-4">Complete</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {renderOptionsSection(accordionDensity === 'compact')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );

  // Render bento grid interface
  const renderBentoGridInterface = () => (
    <div className="h-[calc(100vh-280px)] overflow-y-auto pr-2" style={{ paddingBottom: `${footerHeight}px` }}>
      {/* Type and Report Number fields */}
      <div className="bg-card px-4 py-3 border rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bento-type" className="text-sm font-medium">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="max-h-48 overflow-y-auto z-50 bg-popover">
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="esl-blankets">ESL - Blankets</SelectItem>
                <SelectItem value="esl-coverups">ESL - CoverUps</SelectItem>
                <SelectItem value="esl-footwear">ESL - Footwear</SelectItem>
                <SelectItem value="esl-gloves">ESL - Gloves</SelectItem>
                <SelectItem value="esl-grounds">ESL - Grounds</SelectItem>
                <SelectItem value="esl-hotsticks">ESL - Hotsticks</SelectItem>
                <SelectItem value="esl-insulated-tools">ESL - Insulated Tools</SelectItem>
                <SelectItem value="esl-jumpers">ESL - Jumpers</SelectItem>
                <SelectItem value="esl-line-hoses">ESL - Line Hoses</SelectItem>
                <SelectItem value="esl-matting">ESL - Matting</SelectItem>
                <SelectItem value="esl-roll-blankets">ESL - Roll Blankets</SelectItem>
                <SelectItem value="esl-sleeves">ESL - Sleeves</SelectItem>
                <SelectItem value="itl-gauges">ITL - Gauges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bento-reportNumber" className="text-sm font-medium">Report Number *</Label>
            <Input
              id="bento-reportNumber"
              value={formData.reportNumber}
              readOnly
              disabled
              placeholder={formData.type ? "Auto-generated" : "Select a type first"}
              className="h-10 bg-muted cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 pb-8">
      {/* Top 4 cards in 2x2 layout */}
      
      {/* Row 1 - General and Product */}
      {/* General - spanning 6 columns */}
      <div className="col-span-12 lg:col-span-6 flex">
        <Card className="h-full w-full border shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm">General</CardTitle>
              {tabStatus['general'] === 'completed' && (
                <CheckCircle className="h-3.5 w-3.5 ml-auto text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3 flex-1">
            {renderGeneralSection(true)}
          </CardContent>
        </Card>
      </div>

      {/* Product - spanning 6 columns */}
      <div className="col-span-12 lg:col-span-6 flex">
        <Card className="h-full w-full border shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-sm">Product</CardTitle>
              {tabStatus['product'] === 'completed' && (
                <CheckCircle className="h-3.5 w-3.5 ml-auto text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3 flex-1">
            {renderProductSection(true)}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 - Arrival Information and Additional Information */}
      {/* Arrival Information - spanning 6 columns */}
      <div className="col-span-12 lg:col-span-6 flex">
        <Card className="h-full w-full border shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-500/10 rounded">
                <Truck className="h-4 w-4 text-orange-600" />
              </div>
              <CardTitle className="text-sm">Arrival Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3 flex-1">
            {renderLogisticsSection(true)}
          </CardContent>
        </Card>
      </div>

      {/* Additional Information - spanning 6 columns */}
      <div className="col-span-12 lg:col-span-6 flex">
        <Card className="h-full w-full border shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 rounded">
                <List className="h-4 w-4 text-amber-600" />
              </div>
              <CardTitle className="text-sm">Additional Information</CardTitle>
              {tabStatus['options'] === 'completed' && (
                <CheckCircle className="h-3.5 w-3.5 ml-auto text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3 flex-1">
            {renderOptionsSection(true)}
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Cost, Lab, Factory, Transit */}
      
      {/* Cost - spanning 3 columns */}
      <div className="col-span-12 lg:col-span-6">
        <Card className="h-full border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <CardTitle className="text-sm">Cost</CardTitle>
              {tabStatus['cost'] === 'completed' && (
                <CheckCircle className="h-3.5 w-3.5 ml-auto text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            {renderCostSection(true)}
          </CardContent>
        </Card>
      </div>

      {/* Lab - spanning 3 columns */}
      <div className="col-span-12 lg:col-span-6">
        <Card className="h-full border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded">
                <Settings className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-sm">Lab</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            {renderLabSection(true)}
          </CardContent>
        </Card>
      </div>

      {/* Factory - spanning 3 columns */}
      <div className="col-span-12 lg:col-span-6">
        <Card className="h-full border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-500/10 rounded">
                <Settings className="h-4 w-4 text-slate-600" />
              </div>
              <CardTitle className="text-sm">Factory</CardTitle>
              {tabStatus['factory'] === 'completed' && (
                <CheckCircle className="h-3.5 w-3.5 ml-auto text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            {renderFactoryConfigSection(true)}
          </CardContent>
        </Card>
      </div>

      {/* Transit - spanning 3 columns */}
      <div className="col-span-12 lg:col-span-6">
        <Card className="h-full border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/10 rounded">
                <Truck className="h-4 w-4 text-cyan-600" />
              </div>
              <CardTitle className="text-sm">Transit</CardTitle>
              {tabStatus['transit'] === 'completed' && (
                <CheckCircle className="h-3.5 w-3.5 ml-auto text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            {renderTransitSection(true, true)}
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Parts and Images */}
      
      {/* Parts - spanning 6 columns */}
      <div className="col-span-12 md:col-span-6">
        <Card className="h-full border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-500/10 rounded">
                <Wrench className="h-4 w-4 text-red-600" />
              </div>
              <CardTitle className="text-sm">Parts</CardTitle>
              {tabStatus['parts'] === 'completed' && (
                <CheckCircle className="h-3.5 w-3.5 ml-auto text-green-600" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            {renderPartsSection(true, true)}
          </CardContent>
        </Card>
      </div>

      {/* Images - spanning 6 columns */}
      <div className="col-span-12 md:col-span-6">
        <Card className="h-full border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-pink-500/10 rounded">
                <Camera className="h-4 w-4 text-pink-600" />
              </div>
              <CardTitle className="text-sm">Images</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-3 pb-3">
            {renderProductImagesSection(true, true)}
          </CardContent>
        </Card>
      </div>

      </div>

      {/* Comments - Full width at bottom */}
      <Card className="border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="py-2 px-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 rounded">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
            </div>
            <CardTitle className="text-sm">Comments</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-3">
          {renderActivityLog(true)}
        </CardContent>
      </Card>
    </div>
  );

  // Render minimal single-scroll interface
  const renderMinimalScrollInterface = () => (
    <Card className="border-0 shadow-md">
      <CardContent className="p-0">
        {/* Sticky Section Navigation */}
        <div className="sticky top-0 z-20 bg-card border-b border-border">
          <div className="flex items-center gap-0 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors relative ${
                    activeScrollSection === section.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                  {activeScrollSection === section.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-[calc(100vh-320px)] overflow-auto" ref={scrollViewportRef}>
          <div className="p-6 space-y-8" style={{ paddingBottom: `${footerHeight}px` }}>
            {/* General Section */}
            <div 
              ref={(el) => (sectionRefs.current['general'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">General Information</h3>
              </div>
              {renderGeneralSection()}
            </div>

            {/* Product Section */}
            <div 
              ref={(el) => (sectionRefs.current['product'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Product Information</h3>
              </div>
              {renderProductSection()}
            </div>

            {/* Logistics Section */}
            <div 
              ref={(el) => (sectionRefs.current['logistics'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Logistics Information</h3>
              </div>
              {renderLogisticsSection()}
            </div>

            {/* Product Images Section */}
            <div 
              ref={(el) => (sectionRefs.current['product-images'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Camera className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Product Images</h3>
              </div>
              {renderProductImagesSection()}
            </div>

            {/* Lab Section */}
            <div 
              ref={(el) => (sectionRefs.current['lab'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Lab Information</h3>
              </div>
              {renderLabSection()}
            </div>

            {/* Factory Config Section */}
            <div 
              ref={(el) => (sectionRefs.current['factory-config'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Factory Configuration</h3>
              </div>
              {renderFactoryConfigSection()}
            </div>

            {/* Transit Section */}
            <div 
              ref={(el) => (sectionRefs.current['transit'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Transit Information</h3>
              </div>
              {renderTransitSection()}
            </div>

            {/* Accessories Section */}
            <div 
              ref={(el) => (sectionRefs.current['accessories'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Layers className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Product Accessories</h3>
              </div>
              {renderAccessoriesSection()}
            </div>

            {/* Parts Section */}
            <div 
              ref={(el) => (sectionRefs.current['parts'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Wrench className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Parts</h3>
              </div>
              {renderPartsSection()}
            </div>

            {/* Comments Section */}
            <div 
              ref={(el) => (sectionRefs.current['comments'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Comments</h3>
              </div>
              {renderCommentsSection()}
            </div>

            {/* Additional Options Section */}
            <div 
              ref={(el) => (sectionRefs.current['options'] = el)}
              className="space-y-4 scroll-mt-32"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <List className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Additional Options</h3>
              </div>
              {renderOptionsSection()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render minimal interface with tabs on left and content on right
  const renderMinimal2Interface = () => (
    <Card className="border-0 shadow-md">
      <CardContent className="p-0">
        <div className="flex h-[calc(100vh-320px)]">
          {/* Left Sidebar Navigation */}
          <div className="w-48 border-r border-border bg-muted/30 flex-shrink-0">
            <div className="p-2 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeScrollSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-auto h-[calc(100vh-320px)]" ref={scrollViewportRef}>
            <div className="p-6 space-y-8" style={{ paddingBottom: `${footerHeight}px` }}>
              {/* General Section */}
              <div 
                ref={(el) => (sectionRefs.current['general'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">General Information</h3>
                </div>
                {renderGeneralSection()}
              </div>

              {/* Product Section */}
              <div 
                ref={(el) => (sectionRefs.current['product'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Product Information</h3>
                </div>
                {renderProductSection()}
              </div>

              {/* Logistics Section */}
              <div 
                ref={(el) => (sectionRefs.current['logistics'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Logistics Information</h3>
                </div>
                {renderLogisticsSection()}
              </div>

              {/* Product Images Section */}
              <div 
                ref={(el) => (sectionRefs.current['product-images'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Camera className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Product Images</h3>
                </div>
                {renderProductImagesSection()}
              </div>

              {/* Cost Section */}
              <div 
                ref={(el) => (sectionRefs.current['cost'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Cost Information</h3>
                </div>
                {renderCostSection()}
              </div>

              {/* Lab Section */}
              <div 
                ref={(el) => (sectionRefs.current['lab'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Lab Information</h3>
                </div>
                {renderLabSection()}
              </div>

              {/* Factory Config Section */}
              <div 
                ref={(el) => (sectionRefs.current['factory-config'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Factory Configuration</h3>
                </div>
                {renderFactoryConfigSection()}
              </div>

              {/* Transit Section */}
              <div 
                ref={(el) => (sectionRefs.current['transit'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Transit Information</h3>
                </div>
                {renderTransitSection()}
              </div>

              {/* Accessories Section */}
              <div 
                ref={(el) => (sectionRefs.current['accessories'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Layers className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Product Accessories</h3>
                </div>
                {renderAccessoriesSection()}
              </div>

              {/* Parts Section */}
              <div 
                ref={(el) => (sectionRefs.current['parts'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Wrench className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Parts</h3>
                </div>
                {renderPartsSection()}
              </div>

              {/* Comments Section */}
              <div 
                ref={(el) => (sectionRefs.current['comments'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Comments</h3>
                </div>
                {renderCommentsSection()}
              </div>

              {/* Additional Options Section */}
              <div 
                ref={(el) => (sectionRefs.current['options'] = el)}
                className="space-y-4 scroll-mt-32"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <List className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Additional Options</h3>
                </div>
                {renderOptionsSection()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render Version 3 with bento grid layout
  const renderVersion3Interface = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
      {/* General Section */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger id="v3-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-report-number">Report Number *</Label>
              <Input id="v3-report-number" value={formData.reportNumber} onChange={(e) => handleInputChange("reportNumber", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-status">Item Status</Label>
              <Select value={formData.itemStatus} onValueChange={(value) => handleInputChange("itemStatus", value)}>
                <SelectTrigger id="v3-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-priority">Priority</Label>
              <Select value={formData.priority || "Normal"} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger id="v3-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger id="v3-location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                  <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-division">Division</Label>
              <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)}>
                <SelectTrigger id="v3-division">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                  <SelectItem value="biomedical">Biomedical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-cal-freq">Cal Freq</Label>
              <Input id="v3-cal-freq" value={formData.calFreq} onChange={(e) => handleInputChange("calFreq", e.target.value)} placeholder="Enter calibration frequency" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-action-code">Action Code</Label>
              <Select value={formData.actionCode} onValueChange={(value) => handleInputChange("actionCode", value)}>
                <SelectTrigger id="v3-action-code">
                  <SelectValue placeholder="Select action code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calibrate">Calibrate</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspect">Inspect</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-assigned-to">Assigned To</Label>
              <Input id="v3-assigned-to" value={formData.assignedTo} onChange={(e) => handleInputChange("assignedTo", e.target.value)} placeholder="Type to search assignees..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Information */}
      <Card className="lg:row-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Information
          </CardTitle>
          <CardDescription>Detailed product specifications and identifiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="v3-manufacturer">Manufacturer *</Label>
            <div className="flex gap-2">
              <Select value={formData.manufacturer} onValueChange={(value) => handleInputChange("manufacturer", value)}>
                <SelectTrigger id="v3-manufacturer" className="flex-1">
                  <SelectValue placeholder="Select manufacturer..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fluke">Fluke</SelectItem>
                  <SelectItem value="keysight">Keysight</SelectItem>
                  <SelectItem value="tektronix">Tektronix</SelectItem>
                  <SelectItem value="rohde-schwarz">Rohde & Schwarz</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="shrink-0">
                <span className="text-lg">+</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-model">Model *</Label>
              <div className="flex gap-2">
                <Input id="v3-model" value={formData.model} onChange={(e) => handleInputChange("model", e.target.value)} placeholder="Enter model" className="flex-1" />
                <Button variant="outline" size="icon" className="shrink-0">
                  <span className="text-lg">+</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-lab-code">Lab Code</Label>
              <div className="flex gap-2">
                <Input id="v3-lab-code" value={formData.labCode} onChange={(e) => handleInputChange("labCode", e.target.value)} placeholder="Lab code" className="flex-1" />
                <Button variant="outline" size="icon" className="shrink-0">
                  <span className="text-lg">+</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-serial">MFG Serial</Label>
              <Input id="v3-serial" value={formData.mfgSerial} onChange={(e) => handleInputChange("mfgSerial", e.target.value)} placeholder="Manufacturing serial" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-cost-id">Cust ID</Label>
              <Input id="v3-cost-id" value={formData.costId} onChange={(e) => handleInputChange("costId", e.target.value)} placeholder="Customer identifier" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-cost-serial">Cust Serial</Label>
              <Input id="v3-cost-serial" value={formData.costSerial} onChange={(e) => handleInputChange("costSerial", e.target.value)} placeholder="Customer serial" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-rfid">RFID</Label>
              <Input id="v3-rfid" value={formData.rfid} onChange={(e) => handleInputChange("rfid", e.target.value)} placeholder="RFID tag" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-quantity">Quantity</Label>
              <Input id="v3-quantity" type="number" value={formData.quantity} onChange={(e) => handleInputChange("quantity", e.target.value)} defaultValue="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-description">Description</Label>
              <Input id="v3-description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Product description" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arrival Information */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Arrival
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-arrival-date">Arrival Date</Label>
              <Input id="v3-arrival-date" type="date" value={formData.arrivalDate} onChange={(e) => handleInputChange("arrivalDate", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-arrival-type">Arrival Type</Label>
              <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                <SelectTrigger id="v3-arrival-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="mail">Mail</SelectItem>
                  <SelectItem value="courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-arrival-location">Arrival Location</Label>
              <Select value={formData.arrivalLocation} onValueChange={(value) => handleInputChange("arrivalLocation", value)}>
                <SelectTrigger id="v3-arrival-location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main-office">Main Office</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="loading-dock">Loading Dock</SelectItem>
                  <SelectItem value="reception">Reception</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-driver">Driver</Label>
              <Select value={formData.driver} onValueChange={(value) => handleInputChange("driver", value)}>
                <SelectTrigger id="v3-driver">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                  <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departure Information */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Departure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-inv-number">Invoice #</Label>
              <Input 
                id="v3-inv-number" 
                value={formData.invNumber} 
                readOnly 
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-dt-number">DT #</Label>
              <Input 
                id="v3-dt-number" 
                value={formData.dtNumber} 
                readOnly 
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-delivery-status">Delivery Status</Label>
              <Textarea
                id="v3-delivery-status"
                value={formData.deliveryStatus}
                onChange={(e) => handleInputChange("deliveryStatus", e.target.value)}
                placeholder="Enter delivery status comments"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Product Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Drop images here or click to upload</p>
            <Button variant="outline" size="sm">
              Choose Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">No images uploaded</p>
          </div>
        </CardContent>
      </Card>

      {/* Lab Information */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Lab
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="v3-condition-in">Condition In</Label>
            <Input id="v3-condition-in" value={formData.conditionIn} onChange={(e) => handleInputChange("conditionIn", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v3-condition-out">Condition Out</Label>
            <Input id="v3-condition-out" value={formData.conditionOut} onChange={(e) => handleInputChange("conditionOut", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v3-technician">Technician</Label>
            <Input id="v3-technician" value={formData.technician1} onChange={(e) => handleInputChange("technician1", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Factory Config */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Factory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="v3-to-factory" 
              checked={formData.toFactory}
              onCheckedChange={(checked) => handleInputChange("toFactory", checked as boolean)}
            />
            <Label htmlFor="v3-to-factory">To Factory</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="v3-tf-po">TF PO Number</Label>
            <Input id="v3-tf-po" value={formData.tfPoNumber} onChange={(e) => handleInputChange("tfPoNumber", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v3-vendor-rma">Vendor RMA</Label>
            <Input id="v3-vendor-rma" value={formData.vendorRmaNumber} onChange={(e) => handleInputChange("vendorRmaNumber", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Transit Information */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Transit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-origin">Origin Location</Label>
              <Input id="v3-origin" value={formData.originLocation} onChange={(e) => handleInputChange("originLocation", e.target.value)} placeholder="Origin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-destination">Destination Location</Label>
              <Input id="v3-destination" value={formData.destinationLocation} onChange={(e) => handleInputChange("destinationLocation", e.target.value)} placeholder="Destination" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v3-hu-qty">HU Qty</Label>
              <Input id="v3-hu-qty" value={formData.huQty} onChange={(e) => handleInputChange("huQty", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-hu-type">HU Type</Label>
              <Input id="v3-hu-type" value={formData.huType} onChange={(e) => handleInputChange("huType", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v3-deliver-to">Deliver To</Label>
              <Input id="v3-deliver-to" value={formData.deliverTo} onChange={(e) => handleInputChange("deliverTo", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="v3-transit-notes">Transit Notes</Label>
            <Textarea id="v3-transit-notes" value={formData.transitNotes} onChange={(e) => handleInputChange("transitNotes", e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Purchase Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="v3-po-number">PO Number</Label>
            <Input id="v3-po-number" value={formData.poNumber} onChange={(e) => handleInputChange("poNumber", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v3-po-line">PO Line</Label>
            <Input id="v3-po-line" value={formData.poLine} onChange={(e) => handleInputChange("poLine", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v3-deliver-by">Deliver By Date</Label>
            <Input id="v3-deliver-by" type="date" value={formData.deliverByDate} onChange={(e) => handleInputChange("deliverByDate", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Accessories */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Accessories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="v3-accessory">Accessory</Label>
            <Input 
              id="v3-accessory" 
              value={formData.accessory} 
              onChange={(e) => handleInputChange("accessory", e.target.value)} 
              placeholder="Add accessory"
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {accessoriesList.length} accessory items
          </div>
        </CardContent>
      </Card>

      {/* Parts */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Parts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="v3-part-number">Part Number</Label>
            <Input 
              id="v3-part-number" 
              value={formData.partsNumber} 
              onChange={(e) => handleInputChange("partsNumber", e.target.value)} 
              placeholder="Enter part number"
            />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {partsList.length} parts listed
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            value={formData.comment} 
            onChange={(e) => handleInputChange("comment", e.target.value)} 
            placeholder="Add comments..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Options */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="v3-warranty" 
                checked={formData.warranty}
                onCheckedChange={(checked) => handleInputChange("warranty", checked as boolean)}
              />
              <Label htmlFor="v3-warranty" className="text-sm">Warranty</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="v3-estimate" 
                checked={formData.estimate}
                onCheckedChange={(checked) => handleInputChange("estimate", checked as boolean)}
              />
              <Label htmlFor="v3-estimate" className="text-sm">Estimate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="v3-iso17025" 
                checked={formData.iso17025}
                onCheckedChange={(checked) => handleInputChange("iso17025", checked as boolean)}
              />
              <Label htmlFor="v3-iso17025" className="text-sm">ISO 17025</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="v3-hot-list" 
                checked={formData.hotList}
                onCheckedChange={(checked) => handleInputChange("hotList", checked as boolean)}
              />
              <Label htmlFor="v3-hot-list" className="text-sm">Hot List</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background py-4 border-b border-border px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="p-2 rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300" />
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground">Add New Work Order Item</h1>
              <Breadcrumb className="mt-1">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      asChild 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      asChild 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Link to="/add-new-work-order">Add New Work Order</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs text-foreground font-medium">
                      Add New Item
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">View:</span>
            <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border">
              <button
                onClick={() => setLayoutVariant('default')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  layoutVariant === 'default'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Layers className="h-4 w-4" />
                Tabs
              </button>
              <button
                onClick={() => setLayoutVariant('accordion')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  layoutVariant === 'accordion'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ChevronDown className="h-4 w-4" />
                Accordion
              </button>
              <button
                onClick={() => setLayoutVariant('bento')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  layoutVariant === 'bento'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Menu className="h-4 w-4" />
                Bento
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="px-3 sm:px-4 lg:px-6">{/* Removed bottom padding - footer component handles spacing */}
        {/* Work Order Header */}
        {(layoutVariant === 'default' || layoutVariant === 'accordion' || layoutVariant === 'bento') ? renderWorkOrderHeader() : renderMinimalWorkOrderHeader()}
        
        {/* Main Section Toggles */}
        {layoutVariant === 'minimal' ? (
          <div className="flex items-center gap-2 mb-4 sm:mb-6 overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
            <button
              onClick={() => setActiveSection('work-order-items')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeSection === 'work-order-items'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Package className="h-4 w-4" />
              Work Order Items
            </button>
            <button
              onClick={() => setActiveSection('estimate')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeSection === 'estimate'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Info className="h-4 w-4" />
              Estimate
            </button>
            <button
              onClick={() => setActiveSection('qf3')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeSection === 'qf3'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Settings className="h-4 w-4" />
              QF3
            </button>
            <button
              onClick={() => setActiveSection('external-files')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeSection === 'external-files'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <FileText className="h-4 w-4" />
              External Files
            </button>
            <button
              onClick={() => setActiveSection('cert-files')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeSection === 'cert-files'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Shield className="h-4 w-4" />
              Cert Files
            </button>
          </div>
        ) : (
          <div className="sticky top-0 z-40 bg-background py-3 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto">
              <Button
                variant="ghost"
                onClick={() => setActiveSection('work-order-items')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                  activeSection === 'work-order-items'
                    ? 'bg-primary text-primary-foreground shadow-sm border-primary'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border hover:border-border/80'
                }`}
              >
                <Package className="h-4 w-4" />
                Work Order Items
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveSection('estimate')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                  activeSection === 'estimate'
                    ? 'bg-primary text-primary-foreground shadow-sm border-primary'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border hover:border-border/80'
                }`}
              >
                <Info className="h-4 w-4" />
                Estimate
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveSection('qf3')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                  activeSection === 'qf3'
                    ? 'bg-primary text-primary-foreground shadow-sm border-primary'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border hover:border-border/80'
                }`}
              >
                <Settings className="h-4 w-4" />
                QF3
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveSection('external-files')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                  activeSection === 'external-files'
                    ? 'bg-primary text-primary-foreground shadow-sm border-primary'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border hover:border-border/80'
                }`}
              >
                <FileText className="h-4 w-4" />
                External Files
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveSection('cert-files')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                  activeSection === 'cert-files'
                    ? 'bg-primary text-primary-foreground shadow-sm border-primary'
                    : 'bg-background text-muted-foreground hover:text-foreground border-border hover:border-border/80'
                }`}
              >
                <Shield className="h-4 w-4" />
                Cert Files
              </Button>
            </div>
          </div>
        )}
        
        {/* Content based on active section */}
        {activeSection === 'work-order-items' && (
          <>
            {/* Interface based on variant */}
            {layoutVariant === 'default' && renderTabbedInterface()}
            {layoutVariant === 'minimal' && renderMinimalScrollInterface()}
            {layoutVariant === 'accordion' && renderAccordionTabsInterface()}
            {layoutVariant === 'bento' && renderBentoGridInterface()}
          </>
        )}
        
        {activeSection === 'estimate' && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              {renderEstimateSection()}
            </CardContent>
          </Card>
        )}
        
        {activeSection === 'qf3' && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 space-y-6">

              {/* Main Content - Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Equipment Information */}
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Item Status:</span>
                      <span className="text-sm font-medium">{qf3Data.itemStatus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">T/F Status:</span>
                      <span className="text-sm font-medium">{qf3Data.tfStatus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Manufacturer:</span>
                      <span className="text-sm font-medium">{qf3Data.manufacturer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Model:</span>
                      <span className="text-sm font-medium">{qf3Data.model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Lab Code:</span>
                      <span className="text-sm font-medium">{qf3Data.labCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Mfg Serial:</span>
                      <span className="text-sm font-medium">{qf3Data.mfgSerial}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Cust ID:</span>
                      <span className="text-sm font-medium">{qf3Data.custId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Description:</span>
                      <span className="text-sm font-medium">{qf3Data.description}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Return Details */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium">Reason for Factory Return:</Label>
                    <Select value={qf3Data.reasonForReturn} onValueChange={(v) => handleQf3InputChange("reasonForReturn", v)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Select reason..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parts-not-available">Parts and/or service info not available</SelectItem>
                        <SelectItem value="exceeds-capabilities">Exceeds lab capabilities</SelectItem>
                        <SelectItem value="manufacturer-required">Manufacturer service required</SelectItem>
                        <SelectItem value="warranty-repair">Warranty repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium">Vendor is to perform the following:</Label>
                    <Select value={qf3Data.vendorToPerform} onValueChange={(v) => handleQf3InputChange("vendorToPerform", v)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Select action..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ccfa-iso17025-06">CCFA: Provide ISO17025 Accredited Calibration With 06 Month Certification Per Mfr's Specifications. Including As Found, As Left Data With Uncertainties.</SelectItem>
                        <SelectItem value="ccfa-iso17025-12">CCFA: Provide ISO17025 Accredited Calibration With 12 Month Certification</SelectItem>
                        <SelectItem value="repair-calibration">Repair and calibration service</SelectItem>
                        <SelectItem value="calibration-only">Calibration service only</SelectItem>
                        <SelectItem value="repair-only">Repair service only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium">Malfunction or special instruction(s):</Label>
                    <Textarea 
                      value={qf3Data.malfunctionInstructions}
                      onChange={(e) => handleQf3InputChange("malfunctionInstructions", e.target.value)}
                      className="min-h-[40px] text-xs py-1.5"
                      placeholder="Enter instructions..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium">Technician 1:</Label>
                      <Select value={qf3Data.technician1} onValueChange={(v) => handleQf3InputChange("technician1", v)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john-smith">John Smith</SelectItem>
                          <SelectItem value="jane-doe">Jane Doe</SelectItem>
                          <SelectItem value="bob-wilson">Bob Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium">Repair Comments:</Label>
                      <Input 
                        value={qf3Data.repairComments}
                        onChange={(e) => handleQf3InputChange("repairComments", e.target.value)}
                        className="h-7 text-xs"
                        placeholder="Comments..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Information Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vendor Information</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left px-3 py-2 text-xs font-medium">
                          Vendor <a href="#" className="text-foreground underline ml-1">find</a>
                        </th>
                        <th className="text-left px-3 py-2 text-xs font-medium">Sub</th>
                        <th className="text-left px-3 py-2 text-xs font-medium">Name</th>
                        <th className="text-left px-3 py-2 text-xs font-medium">Email</th>
                        <th className="text-left px-3 py-2 text-xs font-medium">Phone</th>
                        <th className="text-left px-3 py-2 text-xs font-medium">Address</th>
                        <th className="text-left px-3 py-2 text-xs font-medium">Last Modified</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-3 py-2">
                          <span className="text-foreground underline font-medium">{qf3Data.vendorId}</span>
                        </td>
                        <td className="px-3 py-2">
                          <Select value={qf3Data.vendorSub} onValueChange={(v) => handleQf3InputChange("vendorSub", v)}>
                            <SelectTrigger className="h-7 text-xs w-20">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sub1">Sub 1</SelectItem>
                              <SelectItem value="sub2">Sub 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2 text-xs">{qf3Data.vendorName}</td>
                        <td className="px-3 py-2 text-xs">{qf3Data.vendorEmail}</td>
                        <td className="px-3 py-2 text-xs">{qf3Data.vendorPhone}</td>
                        <td className="px-3 py-2 text-xs whitespace-pre-line">{qf3Data.vendorAddress}</td>
                        <td className="px-3 py-2 text-xs whitespace-pre-line">{qf3Data.vendorLastModified}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vendor Details Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Flat Rate<br/>Repair</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Eval</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Eval Fee</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Original<br/>Appr Date</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Criticality</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">ISO 9001<br/>Registered</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">QF133<br/>Issued</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">OEM</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">QF131<br/>on File</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Qual<br/>Based On</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Z540.1<br/>Accred</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Status</th>
                        <th className="text-left px-2 py-2 text-[10px] font-medium">Approval<br/>Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.flatRateRepair}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.eval}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.evalFee}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.originalApprDate || "-"}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.criticality || "-"}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.iso9001Registered}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.qf133Issued}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.oem}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.qf131OnFile}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.qualBasedOn}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.z540Accred}</td>
                        <td className="px-2 py-2 text-xs text-center text-green-600 font-medium">{qf3Data.vendorStatus}</td>
                        <td className="px-2 py-2 text-xs text-center">{qf3Data.approvalExpires}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RMA / Vendor Form / Portal Row */}
              <div className="grid grid-cols-3 gap-4 border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">RMA:</span>
                  <span className="text-sm font-medium">{qf3Data.rma}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Vendor Form:</span>
                  <span className="text-sm font-medium">{qf3Data.vendorForm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Portal:</span>
                  <span className="text-sm font-medium">{qf3Data.portal}</span>
                </div>
              </div>

              {/* Cost Section and File Upload - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 border-b">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">T/F Cost</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left px-4 py-2 text-xs font-medium"></th>
                        <th className="text-center px-4 py-2 text-xs font-medium">JM Cost</th>
                        <th className="text-center px-4 py-2 text-xs font-medium">Cust Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-xs font-medium">Est/Eval/Min Fee</td>
                        <td className="px-4 py-1">
                          <Input 
                            type="number" 
                            value={qf3Data.jmCostEstEval}
                            onChange={(e) => handleQf3InputChange("jmCostEstEval", e.target.value)}
                            className="h-7 text-xs text-center"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-1">
                          <Input 
                            type="number"
                            value={qf3Data.custCostEstEval}
                            onChange={(e) => handleQf3InputChange("custCostEstEval", e.target.value)}
                            className="h-7 text-xs text-center"
                            step="0.01"
                          />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-xs font-medium">Other</td>
                        <td className="px-4 py-1">
                          <Input 
                            type="number"
                            value={qf3Data.jmCostOther}
                            onChange={(e) => handleQf3InputChange("jmCostOther", e.target.value)}
                            className="h-7 text-xs text-center"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-1">
                          <Input 
                            type="number"
                            value={qf3Data.custCostOther}
                            onChange={(e) => handleQf3InputChange("custCostOther", e.target.value)}
                            className="h-7 text-xs text-center"
                            step="0.01"
                          />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-xs font-medium">Freight</td>
                        <td className="px-4 py-1">
                          <Input 
                            type="number"
                            value={qf3Data.jmCostFreight}
                            onChange={(e) => handleQf3InputChange("jmCostFreight", e.target.value)}
                            className="h-7 text-xs text-center"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-1">
                          <Input 
                            type="number"
                            value={qf3Data.custCostFreight}
                            onChange={(e) => handleQf3InputChange("custCostFreight", e.target.value)}
                            className="h-7 text-xs text-center"
                            step="0.01"
                          />
                        </td>
                      </tr>
                      <tr className="bg-muted/30 font-semibold">
                        <td className="px-4 py-2 text-xs">Total TF Cost</td>
                        <td className="px-4 py-2 text-xs text-center">${qf3JmTotal}</td>
                        <td className="px-4 py-2 text-xs text-center">${qf3CustTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Doc Type:</Label>
                      <Select value={qf3Data.qf3DocType} onValueChange={(v) => handleQf3InputChange("qf3DocType", v)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metcal">METCAL</SelectItem>
                          <SelectItem value="metrology">Metrology.net</SelectItem>
                          <SelectItem value="external-xlsx">External File (xlsx)</SelectItem>
                          <SelectItem value="external-pdf">External File (pdf)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">
                        METCAL, Metrology.net, External File (xlsx) and External File (pdf) are used to create a Datasheet.
                        External Test Report is used by Customer Portal.
                        Other entries are not used by any process.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Doc Tag(s):</Label>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {qf3DocTags.map(tag => (
                          <div key={tag} className="flex items-center gap-2">
                            <Checkbox
                              id={`qf3-tag-${tag}`}
                              checked={qf3Data.qf3DocTags.includes(tag)}
                              onCheckedChange={() => handleQf3DocTagToggle(tag)}
                            />
                            <Label htmlFor={`qf3-tag-${tag}`} className="text-xs cursor-pointer">{tag}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* File Upload Area */}
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      Select file(s)...
                    </Button>
                    <div className="flex-1 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center py-4 text-xs text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                      Drag file(s) here
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button variant="outline" size="sm">Save</Button>
                <Button variant="outline" size="sm">Back</Button>
                <Button variant="outline" size="sm">T/F View</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeSection === 'external-files' && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">External Files</h3>
                  <p className="text-sm text-muted-foreground">Manage external documents and files</p>
                </div>
              </div>

              {/* Validation Message */}
              {!externalFilesDocType && (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-lg mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <span>Select a document type to enable file upload options</span>
                </div>
              )}

              {/* Main Upload Form */}
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Doc Type & Items */}
                <div className="col-span-12 md:col-span-3 space-y-4">
                  {/* Doc Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      Doc Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={externalFilesDocType} onValueChange={setExternalFilesDocType}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {["Certificate", "Report", "Invoice", "Purchase Order", "Calibration Data", "Test Results"].map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Items Selection */}
                  <div className={cn("space-y-3 transition-opacity", !externalFilesDocType && "opacity-40 pointer-events-none")}>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Item(s)</Label>
                      <button
                        type="button"
                        className="text-xs font-medium text-foreground hover:text-foreground/70 transition-colors disabled:opacity-50"
                        onClick={() => {
                          const items = ["001", "002", "003", "004", "005"];
                          if (externalFilesSelectedItems.length === items.length) {
                            setExternalFilesSelectedItems([]);
                          } else {
                            setExternalFilesSelectedItems([...items]);
                          }
                        }}
                        disabled={!externalFilesDocType}
                      >
                        {externalFilesSelectedItems.length === 5 ? "Clear All" : "Select All"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["001", "002", "003", "004", "005"].map(item => {
                        const isSelected = externalFilesSelectedItems.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setExternalFilesSelectedItems(prev =>
                                prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
                              );
                            }}
                            disabled={!externalFilesDocType}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                              isSelected 
                                ? "border-primary bg-primary/20 text-foreground" 
                                : "bg-background border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
                            )}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For Batch level, do not select any items.
                    </p>
                  </div>
                </div>

                {/* Middle Column - Doc Tags */}
                <div className={cn("col-span-12 md:col-span-4 transition-opacity", !externalFilesDocType && "opacity-40 pointer-events-none")}>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Doc Tag(s)</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Customer Approval", "Customer ID List", "Customer Notes", "Emails", "Equipment Submission Form", "Equipment Tag", "Safety Data Sheet"].map(tag => {
                        const isSelected = externalFilesSelectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setExternalFilesSelectedTags(prev =>
                                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                              );
                            }}
                            disabled={!externalFilesDocType}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                              isSelected 
                                ? "border-primary bg-primary/20 text-foreground" 
                                : "bg-background border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
                            )}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column - Upload Area */}
                <div className={cn("col-span-12 md:col-span-5 transition-opacity", !externalFilesDocType && "opacity-40 pointer-events-none")}>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Upload Files</Label>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 transition-all min-h-[200px]",
                        externalFilesDragging && externalFilesDocType ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/50",
                        !externalFilesDocType && "cursor-not-allowed"
                      )}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (externalFilesDocType) setExternalFilesDragging(true);
                      }}
                      onDragLeave={() => setExternalFilesDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setExternalFilesDragging(false);
                        if (!e.dataTransfer.files || !externalFilesDocType) return;
                        const newFiles = Array.from(e.dataTransfer.files).map((file, idx) => ({
                          id: `${Date.now()}-${idx}`,
                          name: file.name,
                          type: externalFilesDocType,
                          tags: [...externalFilesSelectedTags],
                          items: [...externalFilesSelectedItems],
                          uploadedBy: "Current User",
                          uploadedDate: new Date().toLocaleDateString(),
                        }));
                        setExternalFilesUploaded(prev => [...prev, ...newFiles]);
                        // Reset for next upload
                        setExternalFilesDocType("");
                        setExternalFilesSelectedItems([]);
                        setExternalFilesSelectedTags([]);
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Drag file(s) here
                        </p>
                        <span className="text-xs text-muted-foreground">or</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!externalFilesDocType}
                        onClick={() => document.getElementById("ef-file-upload")?.click()}
                      >
                        Select Files
                      </Button>
                      <input
                        id="ef-file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (!e.target.files || !externalFilesDocType) return;
                          const newFiles = Array.from(e.target.files).map((file, idx) => ({
                            id: `${Date.now()}-${idx}`,
                            name: file.name,
                            type: externalFilesDocType,
                            tags: [...externalFilesSelectedTags],
                            items: [...externalFilesSelectedItems],
                            uploadedBy: "Current User",
                            uploadedDate: new Date().toLocaleDateString(),
                          }));
                          setExternalFilesUploaded(prev => [...prev, ...newFiles]);
                          // Reset for next upload
                          setExternalFilesDocType("");
                          setExternalFilesSelectedItems([]);
                          setExternalFilesSelectedTags([]);
                          e.target.value = "";
                        }}
                        disabled={!externalFilesDocType}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Files Table */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">Uploaded Files</h4>
                  {externalFilesUploaded.length > 0 && (
                    <span className="text-xs text-muted-foreground">{externalFilesUploaded.length} file(s)</span>
                  )}
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-medium w-12">#</TableHead>
                        <TableHead className="text-xs font-medium">External File</TableHead>
                        <TableHead className="text-xs font-medium w-28">Type</TableHead>
                        <TableHead className="text-xs font-medium">Tag(s)</TableHead>
                        <TableHead className="text-xs font-medium w-24">Item(s)</TableHead>
                        <TableHead className="text-xs font-medium w-28">Uploaded By</TableHead>
                        <TableHead className="text-xs font-medium w-28">Uploaded Date</TableHead>
                        <TableHead className="text-xs font-medium w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {externalFilesUploaded.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <FileText className="h-6 w-6 text-muted-foreground/50" />
                              </div>
                              <p className="text-sm text-muted-foreground">No files uploaded</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        externalFilesUploaded.map((file, index) => (
                          <TableRow key={file.id} className="hover:bg-muted/50 transition-colors duration-200">
                            <TableCell className="text-sm font-medium">{index + 1}</TableCell>
                            <TableCell className="text-sm font-medium text-foreground">{file.name}</TableCell>
                            <TableCell className="text-sm">{file.type}</TableCell>
                            <TableCell className="text-sm">
                              {file.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {file.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="inline-flex px-2 py-0.5 rounded-full bg-muted text-foreground text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {file.tags.length > 2 && (
                                    <span className="text-xs text-muted-foreground">+{file.tags.length - 2}</span>
                                  )}
                                </div>
                              ) : "-"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {file.items.length > 0 ? file.items.join(", ") : <span className="text-muted-foreground">Batch</span>}
                            </TableCell>
                            <TableCell className="text-sm">{file.uploadedBy}</TableCell>
                            <TableCell className="text-sm">{file.uploadedDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                  onClick={() => {
                                    setEditingFileId(file.id);
                                    setEditingFileData({
                                      type: file.type,
                                      tags: [...file.tags],
                                      items: [...file.items]
                                    });
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => setDeletingFile({ id: file.id, name: file.name })}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Edit File Dialog */}
              <Dialog open={!!editingFileId} onOpenChange={(open) => {
                if (!open) {
                  setEditingFileId(null);
                  setEditingFileData(null);
                }
              }}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit File Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Document Type</Label>
                      <Select 
                        value={editingFileData?.type || ''} 
                        onValueChange={(value) => setEditingFileData(prev => prev ? {...prev, type: value} : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Certificate">Certificate</SelectItem>
                          <SelectItem value="Quote">Quote</SelectItem>
                          <SelectItem value="Invoice">Invoice</SelectItem>
                          <SelectItem value="Report">Report</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Customer Approval", "Customer ID List", "Customer Notes", "Emails", "Equipment Submission Form", "Equipment Tag", "Safety Data Sheet"].map(tag => {
                          const isSelected = editingFileData?.tags.includes(tag) || false;
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setEditingFileData(prev => {
                                  if (!prev) return null;
                                  return {
                                    ...prev,
                                    tags: prev.tags.includes(tag) 
                                      ? prev.tags.filter(t => t !== tag) 
                                      : [...prev.tags, tag]
                                  };
                                });
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                                isSelected 
                                  ? "border-primary bg-primary/20 text-foreground" 
                                  : "bg-background border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
                              )}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Items</Label>
                      <div className="flex flex-wrap gap-2">
                        {["001", "002", "003", "004", "005"].map(item => {
                          const isSelected = editingFileData?.items.includes(item) || false;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setEditingFileData(prev => {
                                  if (!prev) return null;
                                  return {
                                    ...prev,
                                    items: prev.items.includes(item) 
                                      ? prev.items.filter(i => i !== item) 
                                      : [...prev.items, item]
                                  };
                                });
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                                isSelected 
                                  ? "border-primary bg-primary/20 text-foreground" 
                                  : "bg-background border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
                              )}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setEditingFileId(null);
                      setEditingFileData(null);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      if (editingFileId && editingFileData) {
                        setExternalFilesUploaded(prev => prev.map(f => 
                          f.id === editingFileId 
                            ? { ...f, type: editingFileData.type, tags: editingFileData.tags, items: editingFileData.items }
                            : f
                        ));
                        setEditingFileId(null);
                        setEditingFileData(null);
                        toast({ title: "File updated", description: "File details have been saved." });
                      }
                    }}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <AlertDialog open={!!deletingFile} onOpenChange={(open) => !open && setDeletingFile(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete File</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{deletingFile?.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        if (deletingFile) {
                          setExternalFilesUploaded(prev => prev.filter(f => f.id !== deletingFile.id));
                          toast({ title: "File deleted", description: `${deletingFile.name} has been removed.` });
                          setDeletingFile(null);
                        }
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
        
        {activeSection === 'cert-files' && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center pb-4">
                <h3 className="text-lg font-semibold underline">Cert Files</h3>
              </div>

              {/* Cert Files Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-primary-foreground border-r border-primary-foreground/20">Cert File</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-primary-foreground border-r border-primary-foreground/20">File Type</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-primary-foreground border-r border-primary-foreground/20">Created By</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-primary-foreground">Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-2.5 text-xs">CAL_CERT_2024_001.pdf</td>
                        <td className="px-4 py-2.5 text-xs">Calibration Certificate</td>
                        <td className="px-4 py-2.5 text-xs">John Smith</td>
                        <td className="px-4 py-2.5 text-xs">12/15/2024</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-2.5 text-xs">TRACE_RPT_2024_045.pdf</td>
                        <td className="px-4 py-2.5 text-xs">Traceability Report</td>
                        <td className="px-4 py-2.5 text-xs">Jane Doe</td>
                        <td className="px-4 py-2.5 text-xs">12/10/2024</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-2.5 text-xs">ISO_CERT_JM_2024.pdf</td>
                        <td className="px-4 py-2.5 text-xs">ISO Certificate</td>
                        <td className="px-4 py-2.5 text-xs">Admin User</td>
                        <td className="px-4 py-2.5 text-xs">11/28/2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Add New Manufacturer Dialog */}
        <Dialog open={showManufacturerDialog} onOpenChange={setShowManufacturerDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Manufacturer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newManufacturer" className="text-sm font-medium">
                  Manufacturer Name
                </Label>
                <Input
                  id="newManufacturer"
                  value={newManufacturerName}
                  onChange={(e) => setNewManufacturerName(e.target.value)}
                  placeholder="Enter manufacturer name"
                  className="h-11"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddNewManufacturer();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelManufacturer}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddNewManufacturer}
                disabled={!newManufacturerName.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add New PR Dialog */}
        <Dialog open={showPRDialog} onOpenChange={setShowPRDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New PR</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prDialogManufacturer" className="text-sm font-medium">Manufacturer</Label>
                  <Input
                    id="prDialogManufacturer"
                    value={newPRData.manufacturer}
                    disabled
                    className="h-11 bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prDialogModel" className="text-sm font-medium">
                    Model <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prDialogModel"
                    value={newPRData.model}
                    onChange={(e) => handlePRDataChange("model", e.target.value)}
                    placeholder="Enter model"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prDialogRange" className="text-sm font-medium">Range</Label>
                  <Select 
                    value={newPRData.range} 
                    onValueChange={(value) => handlePRDataChange("range", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WC/PSI">WC/PSI</SelectItem>
                      <SelectItem value="+-1°F">+-1°F</SelectItem>
                      <SelectItem value="+/- 25&quot; H2O">+/- 25&quot; H2O</SelectItem>
                      <SelectItem value="+/-0.125&quot; H2O">+/-0.125&quot; H2O</SelectItem>
                      <SelectItem value="+/-5&quot; H2O">+/-5&quot; H2O</SelectItem>
                      <SelectItem value="-1 BAR">-1 BAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prDialogOption" className="text-sm font-medium">Option</Label>
                  <Select 
                    value={newPRData.option} 
                    onValueChange={(value) => handlePRDataChange("option", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="676">676</SelectItem>
                      <SelectItem value="absolute pressure">absolute pressure</SelectItem>
                      <SelectItem value="ASTM 6">ASTM 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prDialogAccuracy" className="text-sm font-medium">Accuracy</Label>
                  <Select 
                    value={newPRData.accuracy} 
                    onValueChange={(value) => handlePRDataChange("accuracy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select accuracy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="±.0015&quot;">±.0015&quot;</SelectItem>
                      <SelectItem value="±0.05%">±0.05%</SelectItem>
                      <SelectItem value="±0.1%">±0.1%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prDialogDescription" className="text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="prDialogDescription"
                  value={newPRData.description}
                  onChange={(e) => handlePRDataChange("description", e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prDialogLabCode" className="text-sm font-medium">
                  Lab Code <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={newPRData.labCode} 
                  onValueChange={(value) => handlePRDataChange("labCode", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lab code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A - Mechanical W&M Gages">A - Mechanical W&M Gages</SelectItem>
                    <SelectItem value="F - Digital Pressure">F - Digital Pressure</SelectItem>
                    <SelectItem value="P - Temperature">P - Temperature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelPR}>
                Cancel
              </Button>
              <Button
                onClick={handleAddNewPR}
                disabled={!newPRData.model.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Ok
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Change Confirmation Dialog */}
        <Dialog open={showStatusChangeDialog} onOpenChange={setShowStatusChangeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newStatus" className="text-sm font-medium">
                  New Status
                </Label>
                <Select value={pendingStatusChange} onValueChange={setPendingStatusChange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
                    <SelectItem value="in-lab">In Lab</SelectItem>
                    <SelectItem value="lab-management">Lab Management</SelectItem>
                    <SelectItem value="assigned-to-tech">Assigned to Tech</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="in-metrology">In Metrology</SelectItem>
                    <SelectItem value="repair-department">Repair Department</SelectItem>
                    <SelectItem value="rotation">Rotation</SelectItem>
                    <SelectItem value="estimate">Estimate</SelectItem>
                    <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
                    <SelectItem value="awaiting-pr-approval">Awaiting PR Approval</SelectItem>
                    <SelectItem value="to-factory">To Factory</SelectItem>
                    <SelectItem value="to-factory-warranty">To Factory - Warranty</SelectItem>
                    <SelectItem value="to-factory-repair-replacement">To Factory - Repair by Replacement</SelectItem>
                    <SelectItem value="lab-hold">Lab Hold</SelectItem>
                    <SelectItem value="qa-inspection">Q/A Inspection</SelectItem>
                    <SelectItem value="qa-inspection-fail-correction">Q/A Inspection - Fail Correction</SelectItem>
                    <SelectItem value="qa-fail-log">Q/A Fail Log</SelectItem>
                    <SelectItem value="qa-hold">Q/A Hold</SelectItem>
                    <SelectItem value="qa-disapproved">Q/A Disapproved</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="admin-processing">Admin Processing</SelectItem>
                    <SelectItem value="ar-invoicing-hold">A/R Invoicing/Hold</SelectItem>
                    <SelectItem value="me-review">ME Review</SelectItem>
                    <SelectItem value="ar-invoicing">A/R Invoicing</SelectItem>
                    <SelectItem value="waiting-on-customer">Waiting on Customer</SelectItem>
                    <SelectItem value="ready-for-departure">Ready for Departure</SelectItem>
                    <SelectItem value="back-to-customer">Back to Customer</SelectItem>
                    <SelectItem value="surplus-stock">Surplus Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusComment" className="text-sm font-medium">
                  Comment (Required)
                </Label>
                <Textarea
                  id="statusComment"
                  value={statusChangeComment}
                  onChange={(e) => setStatusChangeComment(e.target.value)}
                  placeholder="Please provide a reason for this status change..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelStatusChange}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmStatusChange}
                disabled={!statusChangeComment.trim() || !pendingStatusChange}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Confirm Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Certificate Confirmation Dialog */}
        <Dialog open={showDeleteCertDialog} onOpenChange={setShowDeleteCertDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Certificate File</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this certificate file? This action cannot be undone.
              </p>
              <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formData.certFile}</span>
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelDeleteCertificate}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmDeleteCertificate}
              >
                Delete File
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
      </div>

      {/* Fixed Action Footer - Custom for ESL types, hidden on Details tab */}
      {isESLType && activeSection === 'work-order-items' && activeEslTab !== 'details' ? (
        <div ref={footerRef} className="fixed bottom-0 left-[256px] right-0 bg-background border-t border-border shadow-lg z-10 py-3 px-6">
          <div className="flex items-center justify-between gap-4 max-w-[1400px] mx-auto">
            {/* Left side buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary font-medium h-9 px-4"
              >
                Rotation
              </Button>
              <Button 
                variant="outline" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary font-medium h-9 px-4"
              >
                Schedule
              </Button>
              <Button 
                variant="outline" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary font-medium h-9 px-4"
              >
                Waiting on Customer
              </Button>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary font-medium h-9 px-4"
              >
                Cancel WO
              </Button>
              <Button 
                variant="outline" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary font-medium h-9 px-4"
              >
                Print WO
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary font-medium h-9 px-4"
              >
                Back
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary font-medium h-9 px-4"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Hide footer completely when on ESL Details tab
        !(isESLType && activeEslTab === 'details') && (
          <FixedActionFooter 
            onCancel={handleCancel}
            onSave={handleSave}
            currentSection={activeSection}
            userRole={userRole}
            onUserRoleChange={setUserRole}
            footerRef={footerRef}
          />
        )
      )}

      {/* QF3 Dialog */}
      <QF3Dialog 
        open={qf3DialogOpen} 
        onOpenChange={setQf3DialogOpen} 
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-24 right-6 z-30 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* Previous Tab Indicator */}
      {prevTabIndicator && (
        <div className="fixed top-36 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg">
            <ChevronUp className="h-4 w-4 animate-bounce" />
            <span className="text-sm font-medium">Previous: {prevTabIndicator}</span>
          </div>
        </div>
      )}

      {/* Next Tab Indicator */}
      {nextTabIndicator && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg">
            <span className="text-sm font-medium">Next: {nextTabIndicator}</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default FormVariationsDemo;