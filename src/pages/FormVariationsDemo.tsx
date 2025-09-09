import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Save, X, Package, Truck, Settings, Info, Layers, List, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [assigneeSearchValue, setAssigneeSearchValue] = useState("");

  // Status change dialog state
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState("");
  const [statusChangeComment, setStatusChangeComment] = useState("");

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
  });

  const currentTabs = [
    { value: 'general', label: 'General', icon: Info },
    { value: 'product', label: 'Product', icon: Package },
    { value: 'logistics', label: 'Logistics', icon: Truck },
    { value: 'options', label: 'Options', icon: Settings }
  ];
  
  const [activeTab, setActiveTab] = useState('general');

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

  // Function to check if accordion section is complete
  const isSectionComplete = (section: string) => {
    switch (section) {
      case 'general':
        return !!(formData.type && formData.reportNumber);
      case 'product':
        return !!(formData.manufacturer && formData.model);
      case 'logistics':
        return !!(formData.arrivalDate || formData.puDate);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Product Information</h2>
          <p className="text-sm text-muted-foreground">Technical specifications and details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="manufacturer"
                  value={manufacturerSearchValue || formData.manufacturer}
                  onChange={(e) => {
                    setManufacturerSearchValue(e.target.value);
                    handleInputChange("manufacturer", e.target.value);
                  }}
                  placeholder="Type to search manufacturers..."
                  className="h-11 pr-10"
                />
                
                <Popover open={manufacturerDropdownOpen} onOpenChange={setManufacturerDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent"
                      aria-label="Show all manufacturers"
                    >
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <Command>
                      <CommandList>
                        <CommandGroup heading="All Manufacturers">
                          {manufacturers.map((manufacturer) => (
                            <CommandItem
                              key={manufacturer.value}
                              value={manufacturer.value}
                              onSelect={() => {
                                handleInputChange("manufacturer", manufacturer.value);
                                setManufacturerSearchValue("");
                                setManufacturerDropdownOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.manufacturer === manufacturer.value ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {manufacturer.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Auto-suggestion dropdown */}
                {manufacturerSearchValue && filteredManufacturers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredManufacturers.map((manufacturer) => (
                      <button
                        key={manufacturer.value}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                        onClick={() => {
                          handleInputChange("manufacturer", manufacturer.value);
                          setManufacturerSearchValue("");
                        }}
                      >
                        {manufacturer.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                type="button"
                className="h-11 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setShowManufacturerDialog(true)}
              >
                Add New
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-sm font-medium">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              placeholder="Enter model"
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="0"
                className="h-11"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mfgSerial" className="text-sm font-medium">Manufacturing Serial</Label>
            <Input
              id="mfgSerial"
              value={formData.mfgSerial}
              onChange={(e) => handleInputChange("mfgSerial", e.target.value)}
              placeholder="Enter serial number"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="costId" className="text-sm font-medium">Cost ID</Label>
            <Input
              id="costId"
              value={formData.costId}
              onChange={(e) => handleInputChange("costId", e.target.value)}
              placeholder="Enter cost ID"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rfid" className="text-sm font-medium">RFID</Label>
            <Input
              id="rfid"
              value={formData.rfid}
              onChange={(e) => handleInputChange("rfid", e.target.value)}
              placeholder="Enter RFID"
              className="h-11"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter detailed item description"
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );

  const renderLogisticsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Input
                id="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                className="h-9 sm:h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalType" className="text-sm font-medium">Arrival Type</Label>
              <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select arrival type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jm-driver-pickup">JM Driver Pickup</SelectItem>
                  <SelectItem value="customer-dropoff">Customer Dropoff</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="purchasing-dept">Purchasing Dept.</SelectItem>
                  <SelectItem value="lab-standard">Lab Standard</SelectItem>
                  <SelectItem value="surplus">Surplus</SelectItem>
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
                  <SelectItem value="BX">BX</SelectItem>
                  <SelectItem value="AX">AX</SelectItem>
                  <SelectItem value="CX">CX</SelectItem>
                  <SelectItem value="MX">MX</SelectItem>
                  <SelectItem value="OX">OX</SelectItem>
                  <SelectItem value="PAX">PAX</SelectItem>
                  <SelectItem value="BTX">BTX</SelectItem>
                  <SelectItem value="CAX">CAX</SelectItem>
                  <SelectItem value="SAX">SAX</SelectItem>
                  <SelectItem value="MBX">MBX</SelectItem>
                  <SelectItem value="MOX">MOX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver" className="text-sm font-medium">Driver</Label>
              <Select value={formData.driver} onValueChange={(value) => handleInputChange("driver", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  <SelectItem value="aaron-l-briles">Aaron L Briles</SelectItem>
                  <SelectItem value="adam-d-eller">Adam D. Eller</SelectItem>
                  <SelectItem value="admin-user">Admin User</SelectItem>
                  <SelectItem value="alanna-d-thompson">Alanna D Thompson</SelectItem>
                  <SelectItem value="alton-t-szlber">Alton T Szlber</SelectItem>
                  <SelectItem value="alzane-reyes">Alzane Reyes</SelectItem>
                  <SelectItem value="amanda-r-phillips">Amanda R. Phillips</SelectItem>
                  <SelectItem value="andrew-d-gina">Andrew D Gina</SelectItem>
                  <SelectItem value="angel-anthony-g-moreno">Angel-anthony G Moreno</SelectItem>
                  <SelectItem value="austin-a-behnken">Austin A Behnken</SelectItem>
                  <SelectItem value="barry-j-chaisson">Barry J Chaisson</SelectItem>
                  <SelectItem value="blaine-r-glover">Blaine R Glover</SelectItem>
                  <SelectItem value="blair-brewer">Blair Brewer</SelectItem>
                  <SelectItem value="brad-l-moulder">Brad L. Moulder</SelectItem>
                  <SelectItem value="brad-p-morrison">Brad P. Morrison</SelectItem>
                  <SelectItem value="brad-r-harris">Brad R Harris</SelectItem>
                  <SelectItem value="brandon-a-underwood">Brandon A Underwood</SelectItem>
                  <SelectItem value="brandon-g-lowery">Brandon G Lowery</SelectItem>
                  <SelectItem value="brandon-m-milum">Brandon M Milum</SelectItem>
                  <SelectItem value="brandy-l-mulkey">Brandy L Mulkey</SelectItem>
                  <SelectItem value="brent-m-durham">Brent M Durham</SelectItem>
                  <SelectItem value="brent-m-simoneaux">Brent M Simoneaux</SelectItem>
                  <SelectItem value="bronson-w-sydow">Bronson W Sydow</SelectItem>
                  <SelectItem value="bryan-j-morrison">Bryan J Morrison</SelectItem>
                  <SelectItem value="bryson-t-brown">Bryson T Brown</SelectItem>
                  <SelectItem value="cade-c-keen">Cade C Keen</SelectItem>
                  <SelectItem value="cassie-c-pilet">Cassie C. Pilet</SelectItem>
                  <SelectItem value="chad-p-kitchens">Chad P Kitchens</SelectItem>
                  <SelectItem value="charles-d-price">Charles D Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Input
                id="puDate"
                type="date"
                value={formData.puDate}
                onChange={(e) => handleInputChange("puDate", e.target.value)}
                className="h-9 sm:h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipType" className="text-sm font-medium">Ship Type</Label>
              <Select value={formData.shipType} onValueChange={(value) => handleInputChange("shipType", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select ship type" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  <SelectItem value="airborne-do-not-use">AIRBORNE - DO NOT USE</SelectItem>
                  <SelectItem value="averitt-do-not-use">AVERITT - DO NOT USE</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="fedex-2nd-day">FEDEX 2ND DAY</SelectItem>
                  <SelectItem value="fedex-grd">FEDEX GRD</SelectItem>
                  <SelectItem value="fedex-p1-do-not-use">FEDEX P1 - DO NOT USE</SelectItem>
                  <SelectItem value="fedex-do-not-use">FEDEX - DO NOT USE</SelectItem>
                  <SelectItem value="motor-freight">MOTOR FREIGHT</SelectItem>
                  <SelectItem value="hot-shot">HOT SHOT</SelectItem>
                  <SelectItem value="ups-blue">UPS BLUE</SelectItem>
                  <SelectItem value="ups-org-do-not-use">UPS ORG - DO NOT USE</SelectItem>
                  <SelectItem value="ups-red">UPS RED</SelectItem>
                  <SelectItem value="ups-ground">UPS GROUND</SelectItem>
                  <SelectItem value="us-post-office">US POST OFFICE</SelectItem>
                  <SelectItem value="fedex-3day-do-not-use">FEDEX 3DAY - DO NOT USE</SelectItem>
                  <SelectItem value="drop-ship">DROP SHIP</SelectItem>
                  <SelectItem value="fedex-1st-on">FEDEX 1ST ON</SelectItem>
                  <SelectItem value="fedex-2nd-am">FEDEX 2ND AM</SelectItem>
                  <SelectItem value="fedex-3rd-col">FEDEX 3RD COL</SelectItem>
                  <SelectItem value="fedex-air-frt">FEDEX AIR FRT</SelectItem>
                  <SelectItem value="fedex-col-ovrnt">FEDEX COL OVRNT</SelectItem>
                  <SelectItem value="fedex-col-p1">FEDEX COL P1</SelectItem>
                  <SelectItem value="fedex-collect">FEDEX COLLECT</SelectItem>
                  <SelectItem value="fedex-exp-svr">FEDEX EXP SVR</SelectItem>
                  <SelectItem value="fedex-intl">FEDEX INTL</SelectItem>
                  <SelectItem value="fedex-intl-exwk">FEDEX INTL EXWK</SelectItem>
                  <SelectItem value="fedex-mtrft">FEDEX MTRFT</SelectItem>
                  <SelectItem value="fedex-priority">FEDEX PRIORITY</SelectItem>
                  <SelectItem value="fedex-sat-p1">FEDEX SAT P1</SelectItem>
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
              <Input
                id="needBy"
                type="date"
                value={formData.needBy}
                onChange={(e) => handleInputChange("needBy", e.target.value)}
                className="h-9 sm:h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Departure Information</h3>
              <p className="text-sm text-muted-foreground">Delivery and departure details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2 md:col-span-2">
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
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { key: 'warranty', label: 'Warranty', desc: 'Item is under warranty', icon: '🛡️' },
          { key: 'estimate', label: 'Estimate', desc: 'Estimate required', icon: '💰' },
          { key: 'newEquip', label: 'New Equipment', desc: 'Brand new equipment', icon: '✨' },
          { key: 'usedSurplus', label: 'Used Surplus', desc: 'Previously used equipment', icon: '♻️' },
          { key: 'iso17025', label: 'ISO 17025', desc: 'ISO 17025 compliance required', icon: '📋' },
          { key: 'hotList', label: 'Hot List', desc: 'High priority item', icon: '🔥' },
          { key: 'readyToBill', label: 'Ready to Bill', desc: 'Ready for billing', icon: '💵' },
          { key: 'inQa', label: 'In QA', desc: 'Currently in quality assurance', icon: '🔍' },
          { key: 'toShipping', label: 'To Shipping', desc: 'Ready for shipping', icon: '📦' },
          { key: 'multiParts', label: 'Multi Parts', desc: 'Multiple part item', icon: '🔧' },
          { key: 'lostEquipment', label: 'Lost Equipment', desc: 'Equipment is lost', icon: '❗' },
          { key: 'redTag', label: 'Red Tag', desc: 'Red tag status', icon: '🏷️' },
        ].map(({ key, label, desc, icon }) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-lg">{icon}</span>
              <div>
                <div className="font-medium text-sm">{label}</div>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
            <Switch
              checked={formData[key as keyof typeof formData] as boolean}
              onCheckedChange={(checked) => handleInputChange(key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
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
      
      <div className="text-center py-8 text-muted-foreground">
        <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Estimate information will be displayed here.</p>
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <TabsList className="inline-flex h-8 sm:h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto overflow-x-auto">
            {currentTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
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

          <TabsContent value="options" className="space-y-6">
            {renderOptionsSection()}
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
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="bg-background px-4 sm:px-6 py-4 border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between max-w-6xl mx-auto gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="flex items-center gap-2 hover-scale p-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground">Add New Work Order Item</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Complete all sections to create the item</p>
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
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel} className="hover-scale h-8 px-3 text-xs sm:text-sm">
                <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 hover-scale h-8 px-3 text-xs sm:text-sm">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Save Item</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
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
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-foreground mb-2">Estimate Section</h3>
                <p className="text-muted-foreground">Estimate content will be displayed here.</p>
              </div>
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
      </div>
    </div>
  );
};

export default FormVariationsDemo;