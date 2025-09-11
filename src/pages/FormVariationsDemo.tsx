import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Save, X, Package, Truck, Settings, Info, Layers, List, ChevronRight, Menu, CalendarIcon, Check, ChevronsUpDown, Eye, Trash2, FileText, Camera } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { FixedActionFooter } from "@/components/FixedActionFooter";
import { EstimateDetails } from "@/components/EstimateDetails";
import { cn } from "@/lib/utils";

const FormVariationsDemo = () => {
  const navigate = useNavigate();
  
  // Interface switcher state
  const [interfaceType, setInterfaceType] = useState<'tabs' | 'accordion'>('tabs');
  
  // Main section state
  const [activeSection, setActiveSection] = useState<'work-order-items' | 'estimate' | 'qf3'>('work-order-items');
  
  // Common state for both interfaces
  const [showManufacturerDialog, setShowManufacturerDialog] = useState(false);
  const [newManufacturerName, setNewManufacturerName] = useState("");
  const [manufacturerDropdownOpen, setManufacturerDropdownOpen] = useState(false);
  const [manufacturerSearchValue, setManufacturerSearchValue] = useState("");
  
  // Model dialog state
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [newModelData, setNewModelData] = useState({
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

  const filteredAssignees = assignees.filter(assignee =>
    assignee.label.toLowerCase().includes(assigneeSearchValue.toLowerCase())
  );

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
    workOrderNumber: "WO-QOAV2I",
    srDoc: "SR Document",
    salesperson: "Not assigned",
    contact: "",
    
    // General Information
    type: "",
    reportNumber: "",
    itemStatus: "",
    assignedTo: "",
    priority: "Normal",
    location: "",
    division: "",
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
    invNumber: "",
    dtNumber: "",
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
  });

  const currentTabs = [
    { value: 'general', label: 'General', icon: Info },
    { value: 'product', label: 'Product', icon: Package },
    { value: 'logistics', label: 'Logistics', icon: Truck },
    { value: 'product-images', label: 'Images', icon: Package },
    { value: 'other', label: 'Other', icon: Settings }
  ];

  const otherTabs = [
    { value: 'factory-config', label: 'Factory', icon: Settings },
    { value: 'transit', label: 'Transit', icon: Truck },
    { value: 'accessories', label: 'Accessories', icon: Layers },
    { value: 'parts', label: 'Parts', icon: Settings },
    { value: 'comments', label: 'Comments', icon: List },
    { value: 'options', label: 'Additional', icon: Settings }
  ];
  
  const [activeTab, setActiveTab] = useState('general');
  const [activeOtherTab, setActiveOtherTab] = useState('factory-config');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving work order item:", formData);
    // Navigate back to main work order page
    navigate("/add-new-work-order");
  };

  const handleCancel = () => {
    // Navigate back to main work order page
    navigate("/add-new-work-order");
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

  // Model dialog handlers
  const handleAddNewModel = () => {
    if (newModelData.model.trim()) {
      handleInputChange("model", newModelData.model.trim());
      setNewModelData({
        manufacturer: "",
        model: "",
        range: "",
        option: "",
        accuracy: "",
        description: "",
        labCode: ""
      });
      setShowModelDialog(false);
    }
  };

  const handleCancelModel = () => {
    setNewModelData({
      manufacturer: "",
      model: "",
      range: "",
      option: "",
      accuracy: "",
      description: "",
      labCode: ""
    });
    setShowModelDialog(false);
  };

  const handleModelDataChange = (field: string, value: string) => {
    setNewModelData(prev => ({
      ...prev,
      [field]: value
    }));
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
  const renderGeneralSection = () => (
    <div className="space-y-6">
      {/* Created and Modified Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Created:</span> 09/09/2025 by Admin User
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Modified:</span> 09/09/2025 by Admin User
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
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
          <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
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
          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
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
          <Label htmlFor="division" className="text-sm font-medium">Division</Label>
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
          <Label htmlFor="calFreq" className="text-sm font-medium">Cal Freq</Label>
          <Input
            id="calFreq"
            value={formData.calFreq}
            onChange={(e) => handleInputChange("calFreq", e.target.value)}
            placeholder="Enter calibration frequency"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actionCode" className="text-sm font-medium">Action Code</Label>
          <Select value={formData.actionCode} onValueChange={(value) => handleInputChange("actionCode", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select action code" />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50">
              <SelectItem value="build-new">BUILD NEW</SelectItem>
              <SelectItem value="cc">C/C</SelectItem>
              <SelectItem value="rc">R/C</SelectItem>
              <SelectItem value="rcc">R/C/C</SelectItem>
              <SelectItem value="repair">REPAIR</SelectItem>
              <SelectItem value="test">TEST</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</Label>
          <div className="relative">
            <Input
              id="assignedTo"
              value={assigneeSearchValue || formData.assignedTo}
              onChange={(e) => {
                setAssigneeSearchValue(e.target.value);
                handleInputChange("assignedTo", e.target.value);
              }}
              placeholder="Type to search assignees..."
              className="h-11 pr-10"
            />
            
            <Popover open={assigneeDropdownOpen} onOpenChange={setAssigneeDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
                  aria-label="Show all assignees"
                >
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Command>
                  <CommandList>
                    <CommandGroup heading="All Assignees">
                      {assignees.map((assignee) => (
                        <CommandItem
                          key={assignee.value}
                          value={assignee.value}
                          onSelect={() => {
                            handleInputChange("assignedTo", assignee.value);
                            setAssigneeSearchValue("");
                            setAssigneeDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.assignedTo === assignee.value ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {assignee.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Auto-suggestion dropdown */}
            {assigneeSearchValue && filteredAssignees.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredAssignees.map((assignee) => (
                  <button
                    key={assignee.value}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                    onClick={() => {
                      handleInputChange("assignedTo", assignee.value);
                      setAssigneeSearchValue("");
                    }}
                  >
                    {assignee.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
              <Label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer *</Label>
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
              <Label htmlFor="model" className="text-sm font-medium">Model *</Label>
              <div className="flex gap-2">
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Enter model"
                  className="h-11"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowModelDialog(true)}
                  className="px-3"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="labCode" className="text-sm font-medium">Lab Code</Label>
              <Input
                id="labCode"
                value={formData.labCode}
                onChange={(e) => handleInputChange("labCode", e.target.value)}
                placeholder="Lab code"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mfgSerial" className="text-sm font-medium">MFG Serial</Label>
              <Input
                id="mfgSerial"
                value={formData.mfgSerial}
                onChange={(e) => handleInputChange("mfgSerial", e.target.value)}
                placeholder="Manufacturing serial"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costId" className="text-sm font-medium">Cost ID</Label>
              <Input
                id="costId"
                value={formData.costId}
                onChange={(e) => handleInputChange("costId", e.target.value)}
                placeholder="Cost identifier"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costSerial" className="text-sm font-medium">Cost Serial</Label>
              <Input
                id="costSerial"
                value={formData.costSerial}
                onChange={(e) => handleInputChange("costSerial", e.target.value)}
                placeholder="Cost serial"
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
              <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="1"
                className="h-11"
              />
            </div>

            <div className="space-y-2 md:col-span-2 xl:col-span-1">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Product description"
                className="min-h-[44px] resize-none"
                rows={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLogisticsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <Label htmlFor="arrivalDate" className="text-sm font-medium">Arrival Date</Label>
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
              <Label htmlFor="arrivalType" className="text-sm font-medium">Arrival Type</Label>
              <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select arrival type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="mail">Mail</SelectItem>
                  <SelectItem value="courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalLocation" className="text-sm font-medium">Arrival Location</Label>
              <Select value={formData.arrivalLocation} onValueChange={(value) => handleInputChange("arrivalLocation", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select arrival location" />
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
              <Label htmlFor="driver" className="text-sm font-medium">Driver</Label>
              <Select value={formData.driver} onValueChange={(value) => handleInputChange("driver", value)}>
                <SelectTrigger className="h-11">
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

      {/* Shipping Information */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Shipping Information</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="puDate" className="text-sm font-medium">Pickup Date</Label>
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

            <div className="space-y-2">
              <Label htmlFor="shipType" className="text-sm font-medium">Ship Type</Label>
              <Select value={formData.shipType} onValueChange={(value) => handleInputChange("shipType", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select ship type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                  <SelectItem value="ground">Ground</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="needBy" className="text-sm font-medium">Need By Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11",
                      !formData.needBy && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.needBy ? formData.needBy : "dd/mm/yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.needBy ? new Date(formData.needBy) : undefined}
                    onSelect={(date) => handleInputChange("needBy", date ? date.toISOString().split('T')[0] : "")}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
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
                onChange={(e) => handleInputChange("invNumber", e.target.value)}
                placeholder="Enter invoice number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dtNumber" className="text-sm font-medium">DT #</Label>
              <Input
                id="dtNumber"
                value={formData.dtNumber}
                onChange={(e) => handleInputChange("dtNumber", e.target.value)}
                placeholder="Enter DT number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryStatus" className="text-sm font-medium">Delivery Status</Label>
              <Select value={formData.deliveryStatus} onValueChange={(value) => handleInputChange("deliveryStatus", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select delivery status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
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
            <Button variant="outline" size="sm">Generate QF3</Button>
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
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 items-end">
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

        <div className="border rounded-lg">
          <div className="bg-muted grid grid-cols-6 gap-4 p-2 text-xs font-medium">
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
                <div key={accessory.id} className="grid grid-cols-6 gap-4 p-3 text-sm">
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

        <div className="border rounded-lg">
          <div className="bg-muted grid grid-cols-7 gap-4 p-2 text-xs font-medium">
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
                  <div key={part.id} className="grid grid-cols-7 gap-4 p-3 text-sm">
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

        <div className="border rounded-lg">
          <div className="bg-muted grid grid-cols-4 gap-4 p-2 text-xs font-medium">
            <div>Type</div>
            <div>User</div>
            <div>Date</div>
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

  // Render work order header
  const renderWorkOrderHeader = () => (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
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
          <Input
            value={formData.srDoc}
            onChange={(e) => handleInputChange("srDoc", e.target.value)}
            placeholder="SR Document"
            className="mt-1"
          />
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

  // Render tabbed interface
  const renderTabbedInterface = () => (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex h-8 sm:h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-full overflow-x-auto min-w-full">
            {currentTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {renderGeneralSection()}
          </TabsContent>

          <TabsContent value="product" className="space-y-6">
            {renderProductSection()}
          </TabsContent>

          <TabsContent value="logistics" className="space-y-6">
            {renderLogisticsSection()}
          </TabsContent>

          <TabsContent value="product-images" className="space-y-6">
            {renderProductImagesSection()}
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <Tabs value={activeOtherTab} onValueChange={setActiveOtherTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                {otherTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="factory-config" className="space-y-6 mt-6">
                {renderFactoryConfigSection()}
              </TabsContent>

              <TabsContent value="transit" className="space-y-6 mt-6">
                {renderTransitSection()}
              </TabsContent>

              <TabsContent value="accessories" className="space-y-6 mt-6">
                {renderAccessoriesSection()}
              </TabsContent>

              <TabsContent value="parts" className="space-y-6 mt-6">
                {renderPartsSection()}
              </TabsContent>

              <TabsContent value="comments" className="space-y-6 mt-6">
                {renderCommentsSection()}
              </TabsContent>

              <TabsContent value="options" className="space-y-6 mt-6">
                {renderOptionsSection()}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
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

  return (
    <div className="min-h-screen bg-background px-3 sm:px-4 lg:px-6">
      {/* Header */}
      <header className="bg-background px-3 sm:px-4 lg:px-6 py-4 border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/80">
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
                      className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      asChild 
                      className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Link to="/add-new-work-order">Work Orders</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs sm:text-sm text-foreground font-medium">
                      Add New Item
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          
          {/* Interface Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            {/* Layout Switcher */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={interfaceType === 'tabs' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setInterfaceType('tabs')}
                className="flex items-center gap-1 h-7 text-xs px-2 sm:px-3 sm:h-8"
              >
                <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Tabs</span>
              </Button>
              <Button
                variant={interfaceType === 'accordion' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setInterfaceType('accordion')}
                className="flex items-center gap-1 h-7 text-xs px-2 sm:px-3 sm:h-8"
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Accord</span>
              </Button>
            </div>
            
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="p-4 sm:p-6">{/* Removed bottom padding - footer component handles spacing */}
        {/* Work Order Header */}
        {renderWorkOrderHeader()}
        
        {/* Main Section Toggles */}
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
        </div>
        
        {/* Content based on active section */}
        {activeSection === 'work-order-items' && (
          <>
            {/* Tabs/Accordion Interface */}
            {interfaceType === 'tabs' ? renderTabbedInterface() : renderAccordionInterface()}
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

        {/* Add New Model Dialog */}
        <Dialog open={showModelDialog} onOpenChange={setShowModelDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Model</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dialogManufacturer" className="text-sm font-medium">Manufacturer</Label>
                  <Select 
                    value={newModelData.manufacturer} 
                    onValueChange={(value) => handleModelDataChange("manufacturer", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3m">3M</SelectItem>
                      <SelectItem value="fluke">Fluke</SelectItem>
                      <SelectItem value="keysight">Keysight</SelectItem>
                      <SelectItem value="rohde-schwarz">Rohde & Schwarz</SelectItem>
                      <SelectItem value="tektronix">Tektronix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dialogModel" className="text-sm font-medium">Model</Label>
                  <Input
                    id="dialogModel"
                    value={newModelData.model}
                    onChange={(e) => handleModelDataChange("model", e.target.value)}
                    placeholder="Enter model"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dialogRange" className="text-sm font-medium">Range</Label>
                  <Select 
                    value={newModelData.range} 
                    onValueChange={(value) => handleModelDataChange("range", value)}
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
                      <SelectItem value="-10/122°C">-10/122°C</SelectItem>
                      <SelectItem value="-12.5/10,000 PSI">-12.5/10,000 PSI</SelectItem>
                      <SelectItem value="-12.5/37,500 PSI">-12.5/37,500 PSI</SelectItem>
                      <SelectItem value="-12.5/6,000 PSI">-12.5/6,000 PSI</SelectItem>
                      <SelectItem value="-12/100 PSI">-12/100 PSI</SelectItem>
                      <SelectItem value="-12/30 PSI">-12/30 PSI</SelectItem>
                      <SelectItem value="-14.5/100 PSI">-14.5/100 PSI</SelectItem>
                      <SelectItem value="-14.5/15 PSI">-14.5/15 PSI</SelectItem>
                      <SelectItem value="-14.5/200 PSI">-14.5/200 PSI</SelectItem>
                      <SelectItem value="-14.7/300 PSI">-14.7/300 PSI</SelectItem>
                      <SelectItem value="-14.7/300 PSIG">-14.7/300 PSIG</SelectItem>
                      <SelectItem value="-14.7/500 PSIG">-14.7/500 PSIG</SelectItem>
                      <SelectItem value="-14.7/85 PSIG">-14.7/85 PSIG</SelectItem>
                      <SelectItem value="-14/3000 PSI">-14/3000 PSI</SelectItem>
                      <SelectItem value="-14/375 PSI">-14/375 PSI</SelectItem>
                      <SelectItem value="-15 PSIG">-15 PSIG</SelectItem>
                      <SelectItem value="-15/+30 PSIG">-15/+30 PSIG</SelectItem>
                      <SelectItem value="-15/100 PSIG">-15/100 PSIG</SelectItem>
                      <SelectItem value="-15/15 PSI">-15/15 PSI</SelectItem>
                      <SelectItem value="-15/200 PSIG">-15/200 PSIG</SelectItem>
                      <SelectItem value="-15/2500 PSIG">-15/2500 PSIG</SelectItem>
                      <SelectItem value="-15/30 PSI">-15/30 PSI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dialogOption" className="text-sm font-medium">Option</Label>
                  <Select 
                    value={newModelData.option} 
                    onValueChange={(value) => handleModelDataChange("option", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="002">002</SelectItem>
                      <SelectItem value="03">03</SelectItem>
                      <SelectItem value="056">056</SelectItem>
                      <SelectItem value="1&quot;">1&quot;</SelectItem>
                      <SelectItem value="1/2&quot;">1/2&quot;</SelectItem>
                      <SelectItem value="1/4&quot;">1/4&quot;</SelectItem>
                      <SelectItem value="1/4&quot; NPT Male Back Fitting">1/4&quot; NPT Male Back Fitting</SelectItem>
                      <SelectItem value="1/4&quot; NPT Male Bottom Mount">1/4&quot; NPT Male Bottom Mount</SelectItem>
                      <SelectItem value="12&quot;">12&quot;</SelectItem>
                      <SelectItem value="17 liter cylinder">17 liter cylinder</SelectItem>
                      <SelectItem value="20&quot;">20&quot;</SelectItem>
                      <SelectItem value="3 phase">3 phase</SelectItem>
                      <SelectItem value="3/4&quot;">3/4&quot;</SelectItem>
                      <SelectItem value="3/8&quot;">3/8&quot;</SelectItem>
                      <SelectItem value="5/16&quot;">5/16&quot;</SelectItem>
                      <SelectItem value="666">666</SelectItem>
                      <SelectItem value="676">676</SelectItem>
                      <SelectItem value="absolute pressure">absolute pressure</SelectItem>
                      <SelectItem value="ASTM 6">ASTM 6</SelectItem>
                      <SelectItem value="atmosphere pressure">atmosphere pressure</SelectItem>
                      <SelectItem value="B89 Grade 0">B89 Grade 0</SelectItem>
                      <SelectItem value="B89 Grade 00">B89 Grade 00</SelectItem>
                      <SelectItem value="B89 Grade AS1">B89 Grade AS1</SelectItem>
                      <SelectItem value="B89 Grade AS2">B89 Grade AS2</SelectItem>
                      <SelectItem value="Cameron Valve Procedure">Cameron Valve Procedure</SelectItem>
                      <SelectItem value="Class 0">Class 0</SelectItem>
                      <SelectItem value="Class 00">Class 00</SelectItem>
                      <SelectItem value="Class 1">Class 1</SelectItem>
                      <SelectItem value="Class 2">Class 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dialogAccuracy" className="text-sm font-medium">Accuracy</Label>
                  <Select 
                    value={newModelData.accuracy} 
                    onValueChange={(value) => handleModelDataChange("accuracy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select accuracy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="± (0.05% of Reading ±0.01 mA)">± (0.05% of Reading ±0.01 mA)</SelectItem>
                      <SelectItem value="±.0015&quot;">±.0015&quot;</SelectItem>
                      <SelectItem value="±.002&quot;">±.002&quot;</SelectItem>
                      <SelectItem value="±.003&quot;">±.003&quot;</SelectItem>
                      <SelectItem value="±0.00005">±0.00005</SelectItem>
                      <SelectItem value="±0.006° C at 0.01° C">±0.006° C at 0.01° C</SelectItem>
                      <SelectItem value="±0.015° C at 0.01° C">±0.015° C at 0.01° C</SelectItem>
                      <SelectItem value="±0.017 mil">±0.017 mil</SelectItem>
                      <SelectItem value="±0.02%">±0.02%</SelectItem>
                      <SelectItem value="±0.04 mm">±0.04 mm</SelectItem>
                      <SelectItem value="±0.05%">±0.05%</SelectItem>
                      <SelectItem value="±0.05% full scale">±0.05% full scale</SelectItem>
                      <SelectItem value="±0.07 mm">±0.07 mm</SelectItem>
                      <SelectItem value="±0.08 mm">±0.08 mm</SelectItem>
                      <SelectItem value="±0.1%">±0.1%</SelectItem>
                      <SelectItem value="±0.1% full scale">±0.1% full scale</SelectItem>
                      <SelectItem value="±0.25% of reading">±0.25% of reading</SelectItem>
                      <SelectItem value="±0.25°C">±0.25°C</SelectItem>
                      <SelectItem value="±0.5%">±0.5%</SelectItem>
                      <SelectItem value="±0.5% of reading">±0.5% of reading</SelectItem>
                      <SelectItem value="±0.5% of reading from 10% to full scale">±0.5% of reading from 10% to full scale</SelectItem>
                      <SelectItem value="±1% full scale">±1% full scale</SelectItem>
                      <SelectItem value="±1% of reading">±1% of reading</SelectItem>
                      <SelectItem value="±200μ">±200μ</SelectItem>
                      <SelectItem value="±3% CW/±6% CCW">±3% CW/±6% CCW</SelectItem>
                      <SelectItem value="±4/2/4°F">±4/2/4°F</SelectItem>
                      <SelectItem value="0.025%">0.025%</SelectItem>
                      <SelectItem value="0.025% full scale">0.025% full scale</SelectItem>
                      <SelectItem value="0.05% full scale">0.05% full scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dialogDescription" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="dialogDescription"
                  value={newModelData.description}
                  onChange={(e) => handleModelDataChange("description", e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dialogLabCode" className="text-sm font-medium">Lab Code</Label>
                <Select 
                  value={newModelData.labCode} 
                  onValueChange={(value) => handleModelDataChange("labCode", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lab code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B - Mech Pressure">B - Mech Pressure</SelectItem>
                    <SelectItem value="C - Dimensional">C - Dimensional</SelectItem>
                    <SelectItem value="D - Hydraulic Dweights">D - Hydraulic Dweights</SelectItem>
                    <SelectItem value="E - Pneumatic Dweights">E - Pneumatic Dweights</SelectItem>
                    <SelectItem value="ES - Electrical Safety">ES - Electrical Safety</SelectItem>
                    <SelectItem value="F - Digital Pressure">F - Digital Pressure</SelectItem>
                    <SelectItem value="G - Electronics">G - Electronics</SelectItem>
                    <SelectItem value="H - Analytical/Other">H - Analytical/Other</SelectItem>
                    <SelectItem value="I - Gravit/Moist Analyz">I - Gravit/Moist Analyz</SelectItem>
                    <SelectItem value="J - Torque/Force">J - Torque/Force</SelectItem>
                    <SelectItem value="K - W&T/Chart Recorders">K - W&T/Chart Recorders</SelectItem>
                    <SelectItem value="L - Gas Detection">L - Gas Detection</SelectItem>
                    <SelectItem value="LMO - Lab Management Off.">LMO - Lab Management Off.</SelectItem>
                    <SelectItem value="M - Multimeters/Meters">M - Multimeters/Meters</SelectItem>
                    <SelectItem value="ML - Main Lab">ML - Main Lab</SelectItem>
                    <SelectItem value="N - Electrical Test Gear">N - Electrical Test Gear</SelectItem>
                    <SelectItem value="P - Temperature">P - Temperature</SelectItem>
                    <SelectItem value="Q - Low Frequency A/C">Q - Low Frequency A/C</SelectItem>
                    <SelectItem value="R - Oxygen Svce Gages">R - Oxygen Svce Gages</SelectItem>
                    <SelectItem value="S - Microwave/Power">S - Microwave/Power</SelectItem>
                    <SelectItem value="T - Aircraft Support">T - Aircraft Support</SelectItem>
                    <SelectItem value="U - Optics">U - Optics</SelectItem>
                    <SelectItem value="V - Communications">V - Communications</SelectItem>
                    <SelectItem value="Z - Fiber Optics">Z - Fiber Optics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelModel}>
                Cancel
              </Button>
              <Button
                onClick={handleAddNewModel}
                disabled={!newModelData.model.trim()}
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
        
        {/* Fixed Action Footer */}
        <FixedActionFooter 
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default FormVariationsDemo;