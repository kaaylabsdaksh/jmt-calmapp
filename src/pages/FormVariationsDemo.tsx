import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Save, X, Package, Truck, Settings, Info, Layers, List, ChevronRight, ChevronLeft, Menu, CalendarIcon, Check, ChevronsUpDown, Eye, Trash2, FileText, Camera, User, Shield, Wrench, MessageSquare, AlertCircle, DollarSign, Paperclip, Upload, Printer, Mail, CheckCircle, XCircle, Clock, ExternalLink, ArrowUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { FixedActionFooter } from "@/components/FixedActionFooter";
import { EstimateDetails } from "@/components/EstimateDetails";
import { QF3Dialog } from "@/components/QF3Dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const FormVariationsDemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Layout variant state
  const [layoutVariant, setLayoutVariant] = useState<'default' | 'minimal'>('default');
  
  // Main section state
  const [activeSection, setActiveSection] = useState<'work-order-items' | 'estimate' | 'qf3' | 'external-files' | 'cert-files'>('work-order-items');
  
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
  
  const sections = [
    { id: 'general', label: 'General', icon: Info },
    { id: 'product', label: 'Product', icon: Package },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'product-images', label: 'Images', icon: Camera },
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
    dateTested: "",
    leadTechnician: "",
    miscInformation: "",
  });

  // Dynamic tabs based on type selection
  const isESLType = formData.type && (formData.type.startsWith('esl-') || formData.type.startsWith('itl-'));
  
  const firstRowTabs = isESLType 
    ? [
        { value: 'general', label: 'General', icon: Info },
        { value: 'details', label: 'Details', icon: FileText },
        { value: 'testing', label: 'Testing', icon: Settings },
        { value: 'work-status', label: 'Work Status', icon: Clock }
      ]
    : [
        { value: 'general', label: 'General', icon: Info },
        { value: 'product', label: 'Product', icon: Package },
        { value: 'logistics', label: 'Logistics', icon: Truck },
        { value: 'options', label: 'Additional Information', icon: FileText },
        { value: 'product-images', label: 'Images', icon: Package },
        { value: 'lab', label: 'Lab', icon: Settings }
      ];

  const secondRowTabs = isESLType 
    ? [] // No second row for ESL types
    : [
        { value: 'factory-config', label: 'Factory', icon: Settings },
        { value: 'transit', label: 'Transit', icon: Truck },
        { value: 'accessories', label: 'Accessories', icon: Layers },
        { value: 'parts', label: 'Parts', icon: Settings }
      ];
  
  const [activeTab, setActiveTab] = useState('general');
  
  // Tab status tracking (completed, error, or null for untouched)
  const [tabStatus, setTabStatus] = useState<Record<string, 'completed' | 'error' | null>>({
    'general': null,
    'product': null,
    'logistics': null,
    'product-images': null,
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
    
    setTabStatus(newStatus);
  }, [formData]);

  // Reset active tab to 'general' when type changes between ESL and SINGLE
  useEffect(() => {
    if (formData.type) {
      setActiveTab('general');
    }
  }, [formData.type]);

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
    if (formData.accessoryType && formData.accessory && formData.accessoryQty) {
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
    }
  };

  const handleRemoveAccessory = (id: string) => {
    setAccessoriesList(prev => prev.filter(item => item.id !== id));
  };

  // Parts handlers
  const handleAddPart = () => {
    if (formData.partsCategory && formData.partsNumber && formData.partsDescription && formData.partsQty) {
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
    }
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
  const renderGeneralSection = () => {
    // ESL-specific layout with sub-tabs
    if (isESLType) {
      return (
        <div className="space-y-6">
          {/* Created and Modified Dates */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Created:</span> 11/20/2025 by Admin User
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Modified:</span> 11/20/2025 by Admin User
            </div>

            {/* Item Navigation */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handlePreviousItem}
                disabled={currentItemIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium text-foreground px-2 min-w-[60px] text-center">
                Item {currentItemIndex + 1} / {totalItems}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleNextItem}
                disabled={currentItemIndex === totalItems - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sub-tabs for ESL General Section */}
          <Tabs defaultValue="general-info" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="general-info">General Information</TabsTrigger>
              <TabsTrigger value="arrival-info">Arrival Information</TabsTrigger>
              <TabsTrigger value="misc-info">Misc. Information</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            {/* General Information Tab */}
            <TabsContent value="general-info">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Report #</Label>
                      <Input 
                        value={formData.reportNumber} 
                        readOnly 
                        className="h-9 bg-muted/50 cursor-not-allowed text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="itemStatus" className="text-sm font-medium">Item Status</Label>
                      <div className="flex items-center gap-2">
                        <Select value={formData.itemStatus} onValueChange={handleStatusChangeAttempt}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        <SelectContent className="bg-popover border z-50 max-h-48 overflow-y-auto">
                          <SelectItem value="in-lab">In Lab</SelectItem>
                          <SelectItem value="lab-management">Lab Management</SelectItem>
                          <SelectItem value="assigned-to-tech">Assigned to Tech</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="shrink-0 h-9 bg-yellow-500 hover:bg-yellow-600 text-white">
                        change
                      </Button>
                    </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</Label>
                      <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                        <SelectTrigger className="h-9">
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
                      <Label htmlFor="testFreq" className="text-sm font-medium">Test Freq</Label>
                      <Input
                        id="testFreq"
                        value={formData.calFreq}
                        onChange={(e) => handleInputChange("calFreq", e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="h-9">
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
                      <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                        <SelectTrigger className="h-9">
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
                      <Label htmlFor="division" className="text-sm font-medium">Division</Label>
                      <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)}>
                        <SelectTrigger className="h-9">
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
                      <Label htmlFor="actionCode" className="text-sm font-medium">Action Code</Label>
                      <Select value={formData.actionCode} onValueChange={(value) => handleInputChange("actionCode", value)}>
                        <SelectTrigger className="h-9">
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

                  {/* Cost Information */}
                  <div className="pt-3 border-t border-border">
                    <h4 className="text-sm font-semibold mb-2">Cost Information</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Testing:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">0</span>
                          <span className="text-muted-foreground text-xs">0.00</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expedite:</span>
                        <span className="text-muted-foreground text-xs">0.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Emergency:</span>
                        <span className="text-muted-foreground text-xs">0.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Replacement:</span>
                        <Input 
                          type="number"
                          defaultValue="0"
                          className="h-7 w-20 text-right text-sm"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">New Sales:</span>
                        <Input 
                          type="number"
                          defaultValue="0"
                          className="h-7 w-20 text-right text-sm"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-center justify-between font-semibold pt-2 border-t border-border col-span-2 md:col-span-1">
                        <span>Total:</span>
                        <div className="flex items-center gap-1">
                          <span>0</span>
                          <span className="text-xs">0.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Arrival Information Tab */}
            <TabsContent value="arrival-info">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="arrivalDate" className="text-sm font-medium">Date</Label>
                      <Input
                        id="arrivalDate"
                        type="date"
                        value={formData.arrivalDate}
                        onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arrivalType" className="text-sm font-medium">Type</Label>
                      <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                        <SelectTrigger className="h-11">
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

                  {/* Departure Information */}
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold mb-3">Departure Information</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Type</Label>
                        <Select value={formData.departureType} onValueChange={(value) => handleInputChange("departureType", value)}>
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border z-50">
                            <SelectItem value="pickup">Pickup</SelectItem>
                            <SelectItem value="delivery">Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Inv #</Label>
                          <Input value={formData.invNumber} onChange={(e) => handleInputChange("invNumber", e.target.value)} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">DT #</Label>
                          <Input value={formData.dtNumber} onChange={(e) => handleInputChange("dtNumber", e.target.value)} className="h-11" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Status */}
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold mb-3">Delivery Status</h4>
                    <Textarea
                      value={formData.deliveryStatus}
                      onChange={(e) => handleInputChange("deliveryStatus", e.target.value)}
                      placeholder="Enter delivery status..."
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Other Information */}
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold mb-3">Other Information</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">PO Number</Label>
                          <Input value={formData.poNumber} onChange={(e) => handleInputChange("poNumber", e.target.value)} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">JM Parts PO #</Label>
                          <Input value={formData.jmPartsPoNumber} onChange={(e) => handleInputChange("jmPartsPoNumber", e.target.value)} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">SO Number</Label>
                          <Input value={formData.soNumber} onChange={(e) => handleInputChange("soNumber", e.target.value)} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Need By</Label>
                          <Input
                            type="date"
                            value={formData.needBy}
                            onChange={(e) => handleInputChange("needBy", e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Deliver By Date</Label>
                          <Input
                            type="date"
                            value={formData.deliverByDate}
                            onChange={(e) => handleInputChange("deliverByDate", e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Date Tested</Label>
                          <Input
                            type="date"
                            value={formData.dateTested}
                            onChange={(e) => handleInputChange("dateTested", e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Transit Qty</Label>
                          <Input value={formData.transitQty} onChange={(e) => handleInputChange("transitQty", e.target.value)} className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Lead Technician</Label>
                          <Select value={formData.leadTechnician} onValueChange={(value) => handleInputChange("leadTechnician", value)}>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border z-50">
                              <SelectItem value="tech1">Technician 1</SelectItem>
                              <SelectItem value="tech2">Technician 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="newEquip" checked={formData.newEquip as boolean} onCheckedChange={(checked) => handleInputChange("newEquip", checked)} />
                          <Label htmlFor="newEquip" className="text-sm cursor-pointer">New</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="hotList" checked={formData.hotList as boolean} onCheckedChange={(checked) => handleInputChange("hotList", checked)} />
                          <Label htmlFor="hotList" className="text-sm cursor-pointer">Hot List</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="toShipping" checked={formData.toShipping as boolean} onCheckedChange={(checked) => handleInputChange("toShipping", checked)} />
                          <Label htmlFor="toShipping" className="text-sm cursor-pointer">To Shipping</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="readyToBill" checked={formData.readyToBill as boolean} onCheckedChange={(checked) => handleInputChange("readyToBill", checked)} />
                          <Label htmlFor="readyToBill" className="text-sm cursor-pointer">Ready to Bill</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="lostEquipment" checked={formData.lostEquipment as boolean} onCheckedChange={(checked) => handleInputChange("lostEquipment", checked)} />
                          <Label htmlFor="lostEquipment" className="text-sm cursor-pointer">Lost Equipment</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Misc. Information Tab */}
            <TabsContent value="misc-info">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <Textarea
                    value={formData.miscInformation}
                    onChange={(e) => handleInputChange("miscInformation", e.target.value)}
                    placeholder="Enter miscellaneous information..."
                    className="min-h-[300px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accessories Tab */}
            <TabsContent value="accessories">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type</Label>
                      <Select>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Containers" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="containers">Containers</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Accessory</Label>
                      <Select>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Bag" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="bag">Bag</SelectItem>
                          <SelectItem value="case">Case</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Material</Label>
                      <Select>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Plastic" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border z-50">
                          <SelectItem value="plastic">Plastic</SelectItem>
                          <SelectItem value="metal">Metal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Qty</Label>
                      <div className="flex items-center gap-2">
                        <Input placeholder="2" className="h-11" />
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white h-11">Add</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox id="includeInCreateNewGroup" />
                    <Label htmlFor="includeInCreateNewGroup" className="text-sm cursor-pointer">Include in Create New Group</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type</Label>
                      <Select>
                        <SelectTrigger className="h-11">
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
                      className="min-h-[80px]"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox id="includeInCreateNewGroupComments" />
                        <Label htmlFor="includeInCreateNewGroupComments" className="text-sm cursor-pointer">Include in Create New Group</Label>
                      </div>
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Add</Button>
                    </div>
                  </div>

                  {/* Comments Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 grid grid-cols-4 p-2 text-sm font-medium">
                      <div>Type</div>
                      <div>User</div>
                      <div>Date Entered</div>
                      <div>Comment</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-4 p-2 text-sm">
                        <div>Other</div>
                        <div>Admin User</div>
                        <div>11/20/2025 05:35 AM</div>
                        <div>Status set to ASSIGNED TO TECH</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>Page 1 of 1 (1 items)</span>
                      <Button variant="outline" size="sm" disabled>&lt;</Button>
                      <span className="px-2 py-1 bg-muted rounded">[1]</span>
                      <Button variant="outline" size="sm" disabled>&gt;</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Page size:</span>
                      <Select defaultValue="10">
                        <SelectTrigger className="h-8 w-16">
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
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    // Original SINGLE type layout
    return (
    <div className="space-y-6">
      {/* Created and Modified Dates */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Created:</span> 09/09/2025 by Admin User
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Modified:</span> 09/09/2025 by Admin User
        </div>

        {/* Item Navigation */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePreviousItem}
            disabled={currentItemIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium text-foreground px-2 min-w-[60px] text-center">
            Item {currentItemIndex + 1} / {totalItems}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextItem}
            disabled={currentItemIndex === totalItems - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
        <div className="space-y-2">
          <Label htmlFor="itemStatus" className="text-sm font-medium">Item Status</Label>
          <Select value={formData.itemStatus} onValueChange={handleStatusChangeAttempt}>
            <SelectTrigger className="h-11">
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

        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm font-medium">
            Priority {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
            <SelectTrigger className="h-11">
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

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
            <SelectTrigger className="h-11">
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

        <div className="space-y-2">
          <Label htmlFor="division" className="text-sm font-medium">
            Division {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)}>
            <SelectTrigger className="h-11">
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

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Cal Freq Interval {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <RadioGroup
            value={formData.calFreqInterval}
            onValueChange={(value) => handleInputChange("calFreqInterval", value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="font-normal cursor-pointer">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="font-normal cursor-pointer">Weekly</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calFreq" className="text-sm font-medium">
            Cal Freq {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="calFreq"
            value={formData.calFreq}
            onChange={(e) => handleInputChange("calFreq", e.target.value)}
            placeholder="Enter calibration frequency"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actionCode" className="text-sm font-medium">
            Action Code {formData.type === "single" && <span className="text-destructive">*</span>}
          </Label>
          <Select value={formData.actionCode} onValueChange={(value) => handleInputChange("actionCode", value)}>
            <SelectTrigger className="h-11">
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

        <div className="space-y-2">
          <Label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</Label>
          <Popover open={assigneeDropdownOpen} onOpenChange={setAssigneeDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={assigneeDropdownOpen}
                className="w-full h-11 justify-between"
              >
                {formData.assignedTo || "Select assignee"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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

  const renderProductSection = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md w-full">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Product Information</h3>
              <p className="text-sm text-muted-foreground">Detailed product specifications and identifiers</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="text-sm font-medium">
                Manufacturer {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <div className="flex gap-2">
                <Popover open={manufacturerDropdownOpen} onOpenChange={setManufacturerDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={manufacturerDropdownOpen}
                      className="h-11 justify-between flex-1"
                    >
                      {formData.manufacturer
                        ? manufacturers.find((manufacturer) => manufacturer.value === formData.manufacturer)?.label
                        : "Select manufacturer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search manufacturer..." 
                        value={manufacturerSearchValue}
                        onValueChange={setManufacturerSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="p-2 text-center">
                            <p className="text-sm text-muted-foreground mb-2">No manufacturer found.</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
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
                              onSelect={(currentValue) => {
                                handleInputChange("manufacturer", currentValue === formData.manufacturer ? "" : currentValue);
                                setManufacturerDropdownOpen(false);
                                setManufacturerSearchValue("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
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
                  className="px-3"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium">
                Model {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <div className="flex gap-2">
                <Popover open={modelDropdownOpen} onOpenChange={setModelDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={modelDropdownOpen}
                      className="h-11 justify-between flex-1"
                    >
                      {formData.model
                        ? models.find((model) => model.value === formData.model)?.label
                        : "Select model..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search model..." 
                        value={modelSearchValue}
                        onValueChange={setModelSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="p-2 text-center">
                            <p className="text-sm text-muted-foreground">No model found.</p>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredModels.map((model) => (
                            <CommandItem
                              key={model.value}
                              value={model.value}
                              onSelect={(currentValue) => {
                                handleInputChange("model", currentValue === formData.model ? "" : currentValue);
                                setModelDropdownOpen(false);
                                setModelSearchValue("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
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
                  className="px-3 whitespace-nowrap"
                >
                  Add PR
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="labCode" className="text-sm font-medium">
                Lab Code {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Select value={formData.labCode} disabled>
                <SelectTrigger className="h-11 bg-muted cursor-not-allowed">
                  <SelectValue placeholder="Select lab code" />
                </SelectTrigger>
                <SelectContent className="bg-popover border z-50 max-h-60 overflow-y-auto">
                  {labCodes.map((labCode) => (
                    <SelectItem key={labCode.value} value={labCode.value}>
                      {labCode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mfgSerial" className="text-sm font-medium">
                MFG Serial {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="mfgSerial"
                value={formData.mfgSerial}
                onChange={(e) => handleInputChange("mfgSerial", e.target.value)}
                placeholder="Manufacturing serial"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costId" className="text-sm font-medium">
                Cust ID {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="costId"
                value={formData.costId}
                onChange={(e) => handleInputChange("costId", e.target.value)}
                placeholder="Customer identifier"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costSerial" className="text-sm font-medium">
                Cust Serial {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="costSerial"
                value={formData.costSerial}
                onChange={(e) => handleInputChange("costSerial", e.target.value)}
                placeholder="Customer serial"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfid" className="text-sm font-medium">RFID</Label>
              <Input
                id="rfid"
                value={formData.rfid}
                onChange={(e) => handleInputChange("rfid", e.target.value)}
                placeholder="RFID tag"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity {formData.type === "single" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="1"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Input
                id="description"
                value={formData.description}
                disabled
                placeholder="Product description"
                className="h-11 bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capableLoc" className="text-sm font-medium">Capable Loc.</Label>
              <Input
                id="capableLoc"
                value=""
                disabled
                placeholder="Capable location"
                className="h-11 bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accuracy" className="text-sm font-medium">Accuracy</Label>
              <Input
                id="accuracy"
                value=""
                disabled
                placeholder="Accuracy"
                className="h-11 bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ranges" className="text-sm font-medium">Range(s)</Label>
              <Input
                id="ranges"
                value=""
                disabled
                placeholder="Range(s)"
                className="h-11 bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="options" className="text-sm font-medium">Option(s)</Label>
              <Input
                id="options"
                value=""
                disabled
                placeholder="Option(s)"
                className="h-11 bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLogisticsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Arrival Information */}
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

            {/* Conditional fields based on arrival type */}
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

        {/* Departure Information */}
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
    </div>
  );

  const renderOptionsSection = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md w-full">
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="needBy" className="text-sm font-medium">Need By</Label>
                <Input
                  id="needBy"
                  type="date"
                  value={formData.needBy}
                  onChange={(e) => handleInputChange("needBy", e.target.value)}
                  className="h-11"
                  placeholder="Enter need by date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverByDate" className="text-sm font-medium">Deliver By Date</Label>
                <Input
                  id="deliverByDate"
                  type="date"
                  value={formData.deliverByDate}
                  onChange={(e) => handleInputChange("deliverByDate", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Purchase Order Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poNumber" className="text-sm font-medium">PO Number</Label>
                <Input
                  id="poNumber"
                  value={formData.poNumber}
                  onChange={(e) => handleInputChange("poNumber", e.target.value)}
                  placeholder="CUST/PO #"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poLineNumber" className="text-sm font-medium">PO Line #</Label>
                <Input
                  id="poLineNumber"
                  value={formData.poLineNumber}
                  onChange={(e) => handleInputChange("poLineNumber", e.target.value)}
                  placeholder="PO Line #"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soNumber" className="text-sm font-medium">SO Number</Label>
                <Input
                  id="soNumber"
                  value={formData.soNumber}
                  onChange={(e) => handleInputChange("soNumber", e.target.value)}
                  placeholder="SO Number"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jmPartsPoNumber" className="text-sm font-medium">JM Parts PO #</Label>
                <Input
                  id="jmPartsPoNumber"
                  value={formData.jmPartsPoNumber}
                  onChange={(e) => handleInputChange("jmPartsPoNumber", e.target.value)}
                  placeholder="JM Parts PO #"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Status Options</h3>
            
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
                <div key={option.key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <Label 
                      htmlFor={option.key} 
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <Switch
                    id={option.key}
                    checked={formData[option.key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(option.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ESL-specific sections
  const renderDetailsSection = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md w-full">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalDate" className="text-sm font-medium">Date</Label>
              <Input
                id="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalType" className="text-sm font-medium">Type</Label>
              <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jm-driver-pickup">JM Driver Pickup</SelectItem>
                  <SelectItem value="customer-dropoff">Customer Drop Off</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="onsite">OnSite</SelectItem>
                  <SelectItem value="purchasing-dept">Purchasing Dept</SelectItem>
                  <SelectItem value="lab-standard">Lab Standard</SelectItem>
                  <SelectItem value="surplus">Surplus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invNumber" className="text-sm font-medium">Inv #</Label>
              <Input
                id="invNumber"
                value={formData.invNumber}
                onChange={(e) => handleInputChange("invNumber", e.target.value)}
                placeholder="Inv #"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dtNumber" className="text-sm font-medium">DT #</Label>
              <Input
                id="dtNumber"
                value={formData.dtNumber}
                onChange={(e) => handleInputChange("dtNumber", e.target.value)}
                placeholder="DT #"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryStatus" className="text-sm font-medium">Delivery Status</Label>
            <Textarea
              id="deliveryStatus"
              value={formData.deliveryStatus}
              onChange={(e) => handleInputChange("deliveryStatus", e.target.value)}
              placeholder="Enter delivery status..."
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Other Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poNumber" className="text-sm font-medium">PO Number</Label>
                <Input
                  id="poNumber"
                  value={formData.poNumber}
                  onChange={(e) => handleInputChange("poNumber", e.target.value)}
                  placeholder="W/OPO"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jmPartsPoNumber" className="text-sm font-medium">JM Parts PO #</Label>
                <Input
                  id="jmPartsPoNumber"
                  value={formData.jmPartsPoNumber}
                  onChange={(e) => handleInputChange("jmPartsPoNumber", e.target.value)}
                  placeholder="JM Parts PO #"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soNumber" className="text-sm font-medium">SO Number</Label>
                <Input
                  id="soNumber"
                  value={formData.soNumber}
                  onChange={(e) => handleInputChange("soNumber", e.target.value)}
                  placeholder="SO Number"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="needBy" className="text-sm font-medium">Need By</Label>
                <Input
                  id="needBy"
                  type="date"
                  value={formData.needBy}
                  onChange={(e) => handleInputChange("needBy", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverByDate" className="text-sm font-medium">Deliver By Date</Label>
                <Input
                  id="deliverByDate"
                  type="date"
                  value={formData.deliverByDate}
                  onChange={(e) => handleInputChange("deliverByDate", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testDate" className="text-sm font-medium">Date Tested</Label>
                <Input
                  id="testDate"
                  type="date"
                  value={formData.testDate}
                  onChange={(e) => handleInputChange("testDate", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transitQty" className="text-sm font-medium">Transit Qty</Label>
                <Input
                  id="transitQty"
                  value={formData.transitQty}
                  onChange={(e) => handleInputChange("transitQty", e.target.value)}
                  placeholder="Transit Qty"
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new"
                  checked={formData.newEquip}
                  onCheckedChange={(checked) => handleInputChange("newEquip", checked)}
                />
                <Label htmlFor="new" className="text-sm font-medium cursor-pointer">New</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hotList"
                  checked={formData.hotList}
                  onCheckedChange={(checked) => handleInputChange("hotList", checked)}
                />
                <Label htmlFor="hotList" className="text-sm font-medium cursor-pointer">Hot List</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTestingSection = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md w-full">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Testing</h3>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Cost Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Testing</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Qty</Label>
                  <Input
                    value="0"
                    readOnly
                    className="h-11 w-20"
                  />
                  <Label className="text-sm text-muted-foreground">Cost</Label>
                  <Input
                    value="0.00"
                    readOnly
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Expedite</Label>
                <Input
                  value="0.00"
                  readOnly
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Emergency</Label>
                <Input
                  value="0.00"
                  readOnly
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Replacement</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Qty</Label>
                  <Input
                    value="0"
                    readOnly
                    className="h-11 w-20"
                  />
                  <Label className="text-sm text-muted-foreground">Cost</Label>
                  <Input
                    value="0.00"
                    readOnly
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">New Sales</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Qty</Label>
                  <Input
                    value="0"
                    readOnly
                    className="h-11 w-20"
                  />
                  <Label className="text-sm text-muted-foreground">Cost</Label>
                  <Input
                    value="0.00"
                    readOnly
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Total</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Qty</Label>
                  <Input
                    value="0"
                    readOnly
                    className="h-11 w-20"
                  />
                  <Label className="text-sm text-muted-foreground font-semibold">Cost</Label>
                  <Input
                    value="0.00"
                    readOnly
                    className="h-11 font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkStatusSection = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-md w-full">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Work Status</h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Work status information will be displayed here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render factory configuration section
  const renderFactoryConfigSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-primary" />
          Factory Configuration
        </CardTitle>
        <CardDescription>Set up factory processing parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="toFactory"
            checked={formData.toFactory}
            onCheckedChange={(checked) => handleInputChange("toFactory", checked)}
          />
          <Label htmlFor="toFactory">Send to Factory (T/F)</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tfPoNumber">Factory PO Number</Label>
            <Input
              id="tfPoNumber"
              value={formData.tfPoNumber}
              onChange={(e) => handleInputChange("tfPoNumber", e.target.value)}
              placeholder="PO number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendorRmaNumber">Vendor RMA Number</Label>
            <Input
              id="vendorRmaNumber"
              value={formData.vendorRmaNumber}
              onChange={(e) => handleInputChange("vendorRmaNumber", e.target.value)}
              placeholder="RMA number"
            />
          </div>

          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={() => setQf3DialogOpen(true)}>
              Generate QF3
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t space-y-6">
          {/* Certificate Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex flex-col gap-1">
                <Label htmlFor="noTfCert" className="text-sm font-medium cursor-pointer">
                  Certificate Required
                </Label>
                <p className="text-xs text-muted-foreground">
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Certificate File</Label>
                  {/* Always show upload area */}
                  <div className="relative rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 bg-background transition-colors">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Upload certificate file
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, or image files supported
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="px-6">
                        Browse
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Show uploaded certificate file if exists */}
                {formData.certFile && (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {formData.certFile}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF Document • 2.4 MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleViewCertificate}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleDeleteCertificate}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render lab section
  const renderLabSection = () => {
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
      <div className="space-y-8 animate-fade-in">
        {/* Action Code Display */}
        {formData.actionCode && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Action Code:</span>
            <Badge variant="outline" className="text-xs font-medium">
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
                  <div className="text-lg font-semibold">${formData.calCertCost.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Repair Cost</div>
                  <div className="text-lg font-semibold">${formData.repairCost.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Cost</div>
                  <div className="text-xl font-bold text-primary">${formData.totalCost.toFixed(2)}</div>
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
                <div className="text-sm font-medium mb-1">CAL/CERT: ${formData.calCertCost.toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">REPAIR: ${formData.repairCost.toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">ALL: ${formData.totalCost.toFixed(2)}</div>
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
                <div className="text-sm font-medium mb-1">CAL/CERT: ${formData.calCertCost.toFixed(2)}</div>
                <div className="text-sm font-medium mb-1">REPAIR: ${formData.repairCost.toFixed(2)}</div>
                <div className="text-sm font-medium mb-1">ALL: ${formData.totalCost.toFixed(2)}</div>
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
                <div className="text-sm font-medium mb-1">CAL/CERT: ${formData.calCertCost.toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">REPAIR: ${formData.repairCost.toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">ALL: ${formData.totalCost.toFixed(2)}</div>
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
                <div className="text-sm font-medium mb-1">CAL/CERT: ${formData.calCertCost.toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">REPAIR: ${formData.repairCost.toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">ALL: ${formData.totalCost.toFixed(2)}</div>
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
                <div className="text-sm font-medium mb-1">CAL/CERT: ${formData.calCertCost.toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">REPAIR: ${formData.repairCost.toFixed(2)}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium mb-1">ALL: ${formData.totalCost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Default message when no action code selected or unsupported action code */}
        {(!formData.actionCode || !["build-new", "rc", "cc", "test", "repair", "rcc"].includes(formData.actionCode)) && (
          <div className="text-center p-8 text-muted-foreground">
            <p>Select an action code to view lab-specific details</p>
          </div>
        )}
      </div>
    );
  };

  // Render product images section
  const renderProductImagesSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Package className="h-5 w-5 text-primary" />
          Product Images
        </CardTitle>
        <CardDescription>Manage product media assets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="images">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="dateEntered">Date Entered</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            <Button variant="default" size="sm" className="gap-2">
              <Camera className="h-4 w-4" />
              Capture
            </Button>
          </div>
          
          <TabsContent value="images" className="mt-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No images uploaded</p>
            </div>
          </TabsContent>
          
          <TabsContent value="dateEntered" className="mt-4">
            <div className="border rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No history available</p>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="mt-4">
            <div className="border rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No actions recorded</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
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
  const renderPartsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-primary" />
          Parts
        </CardTitle>
        <CardDescription>Manage replacement parts and components</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="space-y-1">
            <Label htmlFor="partsCategory" className="text-xs">Category</Label>
            <Select value={formData.partsCategory} onValueChange={(value) => handleInputChange("partsCategory", value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
                <SelectItem value="software">Software</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="partsNumber" className="text-xs">Part Number</Label>
            <Input
              id="partsNumber"
              value={formData.partsNumber}
              onChange={(e) => handleInputChange("partsNumber", e.target.value)}
              placeholder="Part number"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="partsDescription" className="text-xs">Description</Label>
            <Input
              id="partsDescription"
              value={formData.partsDescription}
              onChange={(e) => handleInputChange("partsDescription", e.target.value)}
              placeholder="Description"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="partsCost" className="text-xs">Cost</Label>
            <Input
              id="partsCost"
              type="number"
              value={formData.partsCost}
              onChange={(e) => handleInputChange("partsCost", e.target.value)}
              placeholder="0.00"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="partsQty" className="text-xs">Qty</Label>
            <Input
              id="partsQty"
              type="number"
              value={formData.partsQty}
              onChange={(e) => handleInputChange("partsQty", e.target.value)}
              placeholder="1"
              className="h-9"
            />
          </div>

          <div>
            <Button size="sm" className="h-9 w-full" onClick={handleAddPart}>Add Part</Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <div className="bg-muted grid grid-cols-7 gap-4 p-2 text-xs font-medium min-w-[700px]">
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
                  <div key={part.id} className="grid grid-cols-7 gap-4 p-3 text-sm min-w-[700px]">
                    <div className="capitalize">{part.category}</div>
                    <div>{part.partNumber}</div>
                    <div>{part.description}</div>
                    <div>${part.cost}</div>
                    <div>{part.qty}</div>
                    <div>${total}</div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePart(part.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No parts added
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render transit section
  const renderTransitSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-primary" />
          Set In Transit
        </CardTitle>
        <CardDescription>Configure transit logistics and delivery details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="originLocation" className="text-sm font-medium">Origin Location</Label>
            <Select value={formData.originLocation} onValueChange={(value) => handleInputChange("originLocation", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select origin location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                <SelectItem value="facility-1">Facility 1</SelectItem>
                <SelectItem value="facility-2">Facility 2</SelectItem>
                <SelectItem value="depot-main">Main Depot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationLocation" className="text-sm font-medium">Destination Location</Label>
            <Select value={formData.destinationLocation} onValueChange={(value) => handleInputChange("destinationLocation", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select destination location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer-site-1">Customer Site 1</SelectItem>
                <SelectItem value="customer-site-2">Customer Site 2</SelectItem>
                <SelectItem value="branch-office">Branch Office</SelectItem>
                <SelectItem value="service-center">Service Center</SelectItem>
                <SelectItem value="field-location">Field Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="huQty" className="text-sm font-medium">HU Qty</Label>
            <Input
              id="huQty"
              value={formData.huQty}
              onChange={(e) => handleInputChange("huQty", e.target.value)}
              placeholder="Enter quantity"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="huType" className="text-sm font-medium">HU Type</Label>
            <Select value={formData.huType} onValueChange={(value) => handleInputChange("huType", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select HU type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="box">Box</SelectItem>
                <SelectItem value="pallet">Pallet</SelectItem>
                <SelectItem value="container">Container</SelectItem>
                <SelectItem value="crate">Crate</SelectItem>
                <SelectItem value="case">Case</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliverTo" className="text-sm font-medium">Deliver To</Label>
            <Select value={formData.deliverTo} onValueChange={(value) => handleInputChange("deliverTo", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select delivery recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="technician">Field Technician</SelectItem>
                <SelectItem value="supervisor">Site Supervisor</SelectItem>
                <SelectItem value="manager">Facility Manager</SelectItem>
                <SelectItem value="coordinator">Logistics Coordinator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryType" className="text-sm font-medium">Delivery Type</Label>
            <Select value={formData.deliveryType} onValueChange={(value) => handleInputChange("deliveryType", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select delivery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shuttle">Shuttle</SelectItem>
                <SelectItem value="courier">Courier</SelectItem>
                <SelectItem value="freight">Freight</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transitNotes" className="text-sm font-medium">Notes</Label>
          <Textarea
            id="transitNotes"
            value={formData.transitNotes}
            onChange={(e) => handleInputChange("transitNotes", e.target.value)}
            placeholder="Enter transit notes and special instructions..."
            className="min-h-[120px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );

  // Render comments section
  const renderCommentsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <List className="h-5 w-5 text-primary" />
          Comments
        </CardTitle>
        <CardDescription>Factory communication and documentation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <Label htmlFor="commentType" className="text-xs">Type</Label>
            <Select value={formData.commentType} onValueChange={(value) => handleInputChange("commentType", value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2 space-y-1">
            <Label htmlFor="comment" className="text-xs">Comment</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              placeholder="Enter comment..."
              className="h-9 resize-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox
                id="includeInCopyAsNew"
                checked={formData.includeInCopyAsNew}
                onCheckedChange={(checked) => handleInputChange("includeInCopyAsNew", checked)}
              />
              <Label htmlFor="includeInCopyAsNew" className="text-xs">Copy Forward</Label>
            </div>
            <Button size="sm" className="w-full h-9">Add</Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2 text-xs font-medium">
            <div>Type</div>
            <div>User</div>
            <div className="hidden sm:block">Date</div>
            <div>Comment</div>
          </div>
          <div className="p-6 text-center text-muted-foreground text-sm">
            No comments added
          </div>
        </div>
      </CardContent>
    </Card>
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
      
      <EstimateDetails />
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
          <Input
            value={formData.salesperson}
            onChange={(e) => handleInputChange("salesperson", e.target.value)}
            placeholder="Not assigned"
            className="mt-1"
          />
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
    <Card className={cn("border-0 shadow-md overflow-visible", isESLType && "mb-24")}>
      {/* Type and Report Number fields - always visible */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="max-h-48 overflow-y-auto">
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
      {formData.type ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Sticky Tab Navigation - outside CardContent padding */}
        <div className="sticky top-0 z-20 bg-background pt-4 px-6 pb-2 border-b shadow-sm">
          <div className="space-y-2">
            <TabsList className={cn(
              "grid h-10 sm:h-11 items-center rounded-md bg-muted p-1 text-muted-foreground w-full gap-1",
              isESLType ? "grid-cols-4" : "grid-cols-6"
            )}>
              {firstRowTabs.map((tab) => {
                const Icon = tab.icon;
                const status = tabStatus[tab.value];
                return (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm relative"
                  >
                    <Icon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
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
            
            {!isESLType && secondRowTabs.length > 0 && (
              <TabsList className="grid grid-cols-4 h-10 sm:h-11 items-center rounded-md bg-muted p-1 text-muted-foreground w-full gap-1">
                {secondRowTabs.map((tab) => {
                  const Icon = tab.icon;
                  const status = tabStatus[tab.value];
                  return (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm relative"
                    >
                      <Icon className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{tab.label}</span>
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
        </div>

        {/* Tab Content - scrollable area */}
        <CardContent className={cn("p-6", isESLType && "pb-24")}>
          <TabsContent value="general" className="mt-0 space-y-6 animate-fade-in">
            {renderGeneralSection()}
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
              <TabsContent value="product" className="mt-0 space-y-6 animate-fade-in">
                {renderProductSection()}
              </TabsContent>

              <TabsContent value="logistics" className="mt-0 space-y-6 animate-fade-in">
                {renderLogisticsSection()}
              </TabsContent>

              <TabsContent value="options" className="mt-0 space-y-6 animate-fade-in">
                {renderOptionsSection()}
              </TabsContent>

              <TabsContent value="product-images" className="mt-0 space-y-6 animate-fade-in">
                {renderProductImagesSection()}
              </TabsContent>

              <TabsContent value="lab" className="mt-0 space-y-6 animate-fade-in">
                {renderLabSection()}
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
            </>
          )}
        </CardContent>
      </Tabs>
      ) : (
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
      )}
    </Card>
  );

  // Render accordion interface
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
              {renderGeneralSection()}
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
            <AccordionContent className="pb-4">
              {renderProductSection()}
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
              {renderLogisticsSection()}
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
              {renderOptionsSection()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
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
          <div className="p-6 space-y-8">
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
            <div className="p-6 space-y-8">
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
      <header className="bg-background py-4 border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/80 px-3 sm:px-4 lg:px-6">
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
          
          {/* Variant Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={layoutVariant === 'default' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayoutVariant('default')}
                className="text-xs"
              >
                Default
              </Button>
              <Button
                variant={layoutVariant === 'minimal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayoutVariant('minimal')}
                className="text-xs"
              >
                Minimal
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="px-3 sm:px-4 lg:px-6">{/* Removed bottom padding - footer component handles spacing */}
        {/* Work Order Header */}
        {layoutVariant === 'default' ? renderWorkOrderHeader() : renderMinimalWorkOrderHeader()}
        
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
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2">
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
        )}
        
        {/* Content based on active section */}
        {activeSection === 'work-order-items' && (
          <>
            {/* Interface based on variant */}
            {layoutVariant === 'default' ? renderTabbedInterface() : renderMinimalScrollInterface()}
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
            <CardContent className="p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-foreground mb-2">QF3 Data Section</h3>
                <p className="text-muted-foreground">QF3 data content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeSection === 'external-files' && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">External Files</h3>
                  <p className="text-sm text-muted-foreground">Manage external documents and files</p>
                </div>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                Content will be added here
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeSection === 'cert-files' && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Certification Files</h3>
                  <p className="text-sm text-muted-foreground">Manage certification documents</p>
                </div>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                Content will be added here
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

      {/* Fixed Action Footer - Custom for ESL types */}
      {isESLType && activeSection === 'work-order-items' ? (
        <div className="fixed bottom-0 left-[256px] right-0 bg-background border-t border-border shadow-lg z-10 py-3 px-6">
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
        <FixedActionFooter 
          onCancel={handleCancel}
          onSave={handleSave}
          currentSection={activeSection}
          userRole={userRole}
          onUserRoleChange={setUserRole}
        />
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
      <Toaster />
    </div>
  );
};

export default FormVariationsDemo;