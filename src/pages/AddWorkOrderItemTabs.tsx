import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, X, Package, Truck, Settings, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

const AddWorkOrderItemTabs = () => {
  const navigate = useNavigate();
  
  const [showManufacturerDialog, setShowManufacturerDialog] = useState(false);
  const [newManufacturerName, setNewManufacturerName] = useState("");
  const [manufacturerDropdownOpen, setManufacturerDropdownOpen] = useState(false);
  const [manufacturerSearchValue, setManufacturerSearchValue] = useState("");

  const [showAssigneeDialog, setShowAssigneeDialog] = useState(false);
  const [newAssigneeName, setNewAssigneeName] = useState("");
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [assigneeSearchValue, setAssigneeSearchValue] = useState("");

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
    // General Information
    type: "",
    reportNumber: "",
    itemStatus: "",
    assignedTo: "",
    priority: "Normal",
    location: "",
    division: "",
    
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
    poNumber: "",
    poLineNumber: "",
    needBy: "",
    deliverByDate: "",
    
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving work order item:", formData);
    navigate("/add-new-work-order");
  };

  const handleCancel = () => {
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

  const handleAddNewAssignee = () => {
    if (newAssigneeName.trim()) {
      handleInputChange("assignedTo", newAssigneeName.trim());
      setNewAssigneeName("");
      setShowAssigneeDialog(false);
    }
  };

  const handleCancelAssignee = () => {
    setNewAssigneeName("");
    setShowAssigneeDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background px-6 py-4 border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/80">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="flex items-center gap-2 hover-scale"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Add New Work Order Item</h1>
              <p className="text-sm text-muted-foreground">Complete all sections to create the item</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel} className="hover-scale">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 hover-scale">
              <Save className="h-4 w-4 mr-2" />
              Save Item
            </Button>
          </div>
        </div>
      </header>

      {/* Tabbed Form Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger 
              value="general" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Info className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="product" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Package className="h-4 w-4 mr-2" />
              Product
            </TabsTrigger>
            <TabsTrigger 
              value="logistics" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Truck className="h-4 w-4 mr-2" />
              Logistics
            </TabsTrigger>
            <TabsTrigger 
              value="options" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Options
            </TabsTrigger>
          </TabsList>

          {/* General Information Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">General Information</h2>
                    <p className="text-sm text-muted-foreground">Basic work order item details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemStatus" className="text-sm font-medium">Item Status</Label>
                    <Select value={formData.itemStatus} onValueChange={(value) => handleInputChange("itemStatus", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-lab">In Lab</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Baton Rouge"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="division" className="text-sm font-medium">Division</Label>
                    <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="field">Field</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo" className="text-sm font-medium">Assigned To</Label>
                  <div className="flex gap-2 max-w-2xl">
                    <div className="relative flex-1">
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

                    <Button 
                      type="button"
                      className="h-11 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => setShowAssigneeDialog(true)}
                    >
                      Add New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Information Tab */}
          <TabsContent value="product" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Product Information</h2>
                    <p className="text-sm text-muted-foreground">Technical specifications and details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
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
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arrivalType" className="text-sm font-medium">Arrival Type</Label>
                      <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="walk-in">Walk-in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driver" className="text-sm font-medium">Driver</Label>
                      <Input
                        id="driver"
                        value={formData.driver}
                        onChange={(e) => handleInputChange("driver", e.target.value)}
                        placeholder="Enter driver name"
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Order & Delivery</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                          placeholder="Line #"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="needBy" className="text-sm font-medium">Need By Date</Label>
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Options Tab */}
          <TabsContent value="options" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Equipment Status</h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: "warranty", label: "Warranty", desc: "Item is under warranty" },
                      { key: "estimate", label: "Estimate", desc: "Estimate required" },
                      { key: "newEquip", label: "New Equipment", desc: "Brand new equipment" },
                      { key: "usedSurplus", label: "Used/Surplus", desc: "Pre-owned equipment" },
                      { key: "iso17025", label: "ISO 17025", desc: "ISO certification required" },
                      { key: "hotList", label: "Hot List", desc: "High priority item" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <Checkbox
                          id={key}
                          checked={formData[key as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleInputChange(key, checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                            {label}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Processing Status</h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: "readyToBill", label: "Ready To Bill", desc: "Ready for billing process" },
                      { key: "inQa", label: "In QA", desc: "Quality assurance in progress" },
                      { key: "toShipping", label: "To Shipping", desc: "Ready for shipment" },
                      { key: "multiParts", label: "Multi Parts", desc: "Multiple components" },
                      { key: "lostEquipment", label: "Lost Equipment", desc: "Equipment missing" },
                      { key: "redTag", label: "Red Tag", desc: "Requires special attention" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <Checkbox
                          id={key}
                          checked={formData[key as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleInputChange(key, checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                            {label}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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

        {/* Add New Assignee Dialog */}
        <Dialog open={showAssigneeDialog} onOpenChange={setShowAssigneeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Assignee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newAssignee" className="text-sm font-medium">
                  Assignee Name
                </Label>
                <Input
                  id="newAssignee"
                  value={newAssigneeName}
                  onChange={(e) => setNewAssigneeName(e.target.value)}
                  placeholder="Enter assignee name"
                  className="h-11"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddNewAssignee();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancelAssignee}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddNewAssignee}
                disabled={!newAssigneeName.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddWorkOrderItemTabs;