import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Save, X, Package, Truck, Settings, Info, Layers, List, ChevronRight, Menu, CalendarIcon, Check, ChevronsUpDown, Eye, Trash2, FileText, Camera, User, Shield } from "lucide-react";
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
import { QF3Dialog } from "@/components/QF3Dialog";
import { cn } from "@/lib/utils";

const EditOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workOrderData, isEditMode } = location.state || {};
  
  // Main section state
  const [activeSection, setActiveSection] = useState<'work-order-items' | 'estimate' | 'qf3' | 'external-files' | 'cert-files'>('work-order-items');
  
  // User role state for testing different footers
  const [userRole, setUserRole] = useState<'admin' | 'technician'>('technician');
  
  // QF3 Dialog state
  const [qf3DialogOpen, setQf3DialogOpen] = useState(false);
  
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
    // Work Order Header - Pre-fill from workOrderData if available
    workOrderNumber: workOrderData?.id || "WO-QOAV2I",
    srDoc: workOrderData?.srDoc || "SR Document",
    salesperson: workOrderData?.salesperson || "Not assigned",
    contact: workOrderData?.contact || "",
    
    // General Information
    type: workOrderData?.type || "",
    reportNumber: workOrderData?.reportNumber || "",
    itemStatus: workOrderData?.status || "",
    assignedTo: workOrderData?.assignedTo || "",
    priority: workOrderData?.priority || "Normal",
    location: workOrderData?.location || "",
    division: "",
    calFreq: "",
    actionCode: "",
    
    // Product Information
    manufacturer: workOrderData?.manufacturer || "",
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
    deliverByDate: workOrderData?.dueDate || "",
    
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
  });

  const currentTabs = [
    { value: 'general', label: 'General', icon: Info },
    { value: 'product', label: 'Product', icon: Package },
    { value: 'logistics', label: 'Logistics', icon: Truck },
    { value: 'product-images', label: 'Images', icon: Package },
    { value: 'lab', label: 'Lab', icon: Settings },
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
    // Navigate back to main work order management page
    navigate("/");
  };

  const handleCancel = () => {
    // Navigate back to main work order management page
    navigate("/");
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
        return !!(formData.arrivalDate && formData.arrivalType);
      case 'lab':
        return !!(formData.conditionIn && formData.certificationDate);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b shadow-sm">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="p-2 rounded-lg hover:bg-muted" />
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                {isEditMode ? 'Edit Work Order' : 'Add New Work Order Item'}
              </h1>
            </div>
            
            {/* Work Order Info */}
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <span>WO #: <span className="font-medium text-foreground">{formData.workOrderNumber}</span></span>
              <span>Salesperson: <span className="text-primary font-medium">{formData.salesperson}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 pb-32">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Work Order Management</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? 'Edit Order' : 'Add New Item'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeSection === 'work-order-items' ? 'default' : 'outline'}
            onClick={() => setActiveSection('work-order-items')}
            className="whitespace-nowrap"
          >
            <Package className="h-4 w-4 mr-2" />
            Work Order Items
          </Button>
          <Button
            variant={activeSection === 'estimate' ? 'default' : 'outline'}
            onClick={() => setActiveSection('estimate')}
            className="whitespace-nowrap"
          >
            <FileText className="h-4 w-4 mr-2" />
            Estimate
          </Button>
          <Button
            variant={activeSection === 'qf3' ? 'default' : 'outline'}
            onClick={() => setActiveSection('qf3')}
            className="whitespace-nowrap"
          >
            <Settings className="h-4 w-4 mr-2" />
            QF3
          </Button>
          <Button
            variant={activeSection === 'external-files' ? 'default' : 'outline'}
            onClick={() => setActiveSection('external-files')}
            className="whitespace-nowrap"
          >
            <FileText className="h-4 w-4 mr-2" />
            External Files
          </Button>
          <Button
            variant={activeSection === 'cert-files' ? 'default' : 'outline'}
            onClick={() => setActiveSection('cert-files')}
            className="whitespace-nowrap"
          >
            <Shield className="h-4 w-4 mr-2" />
            Cert Files
          </Button>
        </div>

        {/* Content based on active section */}
        {activeSection === 'work-order-items' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Order Item Details</CardTitle>
                <CardDescription>
                  Add or edit work order item information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Complete work order items form content from FormVariationsDemo goes here...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'estimate' && <EstimateDetails />}
        
        {activeSection === 'qf3' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                QF3 Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">QF3 data content will be added here</p>
            </CardContent>
          </Card>
        )}

        {activeSection === 'external-files' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                External Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">External files content will be added here</p>
            </CardContent>
          </Card>
        )}

        {activeSection === 'cert-files' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Certification Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Certification files content will be added here</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Action Footer */}
      <FixedActionFooter
        onSave={handleSave}
        onCancel={handleCancel}
        currentSection={activeSection}
        userRole={userRole}
      />

      {/* Dialogs */}
      <Dialog open={showManufacturerDialog} onOpenChange={setShowManufacturerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Manufacturer</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Manufacturer Name"
            value={newManufacturerName}
            onChange={e => setNewManufacturerName(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelManufacturer}>Cancel</Button>
            <Button onClick={handleAddNewManufacturer}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showModelDialog} onOpenChange={setShowModelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Manufacturer"
            value={newModelData.manufacturer}
            onChange={e => handleModelDataChange("manufacturer", e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Model"
            value={newModelData.model}
            onChange={e => handleModelDataChange("model", e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Range"
            value={newModelData.range}
            onChange={e => handleModelDataChange("range", e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Option"
            value={newModelData.option}
            onChange={e => handleModelDataChange("option", e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Accuracy"
            value={newModelData.accuracy}
            onChange={e => handleModelDataChange("accuracy", e.target.value)}
            className="mb-2"
          />
          <Textarea
            placeholder="Description"
            value={newModelData.description}
            onChange={e => handleModelDataChange("description", e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Lab Code"
            value={newModelData.labCode}
            onChange={e => handleModelDataChange("labCode", e.target.value)}
            className="mb-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelModel}>Cancel</Button>
            <Button onClick={handleAddNewModel}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatusChangeDialog} onOpenChange={setShowStatusChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter comment for status change"
            value={statusChangeComment}
            onChange={e => setStatusChangeComment(e.target.value)}
            className="mb-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelStatusChange}>Cancel</Button>
            <Button onClick={handleConfirmStatusChange} disabled={!statusChangeComment.trim()}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteCertDialog} onOpenChange={setShowDeleteCertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Certificate File</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the certificate file?</p>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDeleteCertificate}>Cancel</Button>
            <Button onClick={handleConfirmDeleteCertificate}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditOrder;
