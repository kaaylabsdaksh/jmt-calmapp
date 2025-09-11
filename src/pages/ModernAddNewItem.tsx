import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Info, 
  Package, 
  Truck, 
  FileText, 
  Paperclip,
  CalendarIcon,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Building2
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ModernAddNewItem = () => {
  const navigate = useNavigate();
  
  // Progress tracker state
  const [currentStatus, setCurrentStatus] = useState("arrival");
  
  // Advanced options state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Form state with localStorage persistence
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('modernAddNewItemData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        createdDate: new Date(parsed.createdDate),
        modifiedDate: new Date(parsed.modifiedDate),
        arrivalDate: new Date(parsed.arrivalDate),
        departureDate: parsed.departureDate ? new Date(parsed.departureDate) : null
      };
    }
    return {
      // General Information
      reportNumber: "0152.01-802930-001",
      createdDate: new Date(),
      modifiedDate: new Date(),
      status: "in-lab",
      priority: "normal",
      assignedTo: "",
      division: "",
      location: "",
      
      // Product Information
      manufacturer: "",
      model: "",
      serialNumber: "",
      accuracy: "",
      description: "",
      category: "",
      rfid: "",
      assetId: "",
      
      // Arrival & Departure
      arrivalDate: new Date(),
      departureDate: null as Date | null,
      driver: "",
      arrivalLocation: "",
      shipType: "",
      deliveryStatus: "",
      
      // Other Information
      poNumber: "",
      soNumber: "",
      warranty: false,
      estimate: false,
      hotlist: false,
      readyToBill: false,
      toShipping: false,
    };
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('modernAddNewItemData', JSON.stringify(formData));
  }, [formData]);

  // Date picker states
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = () => {
    console.log("Saving as draft:", formData);
    // Add save draft logic here
  };

  const handleSubmit = () => {
    console.log("Submitting:", formData);
    
    // Convert form data to work order item format
    const workOrderItem = {
      id: `item-${Date.now()}`,
      itemNumber: formData.reportNumber || "NEW-001",
      calFreq: "annual",
      actionCode: "rc",
      priority: formData.priority,
      manufacturer: formData.manufacturer || "Unknown",
      model: formData.model || "Unknown",
      mfgSerial: formData.serialNumber || "Unknown",
      custId: formData.assetId || "Unknown",
      custSN: formData.serialNumber || "Unknown",
      barcodeNum: formData.rfid || "Unknown",
      warranty: formData.warranty ? "yes" : "no",
      iso17025: "yes",
      estimate: "$125.00",
      newEquip: "no",
      needByDate: formData.departureDate ? formData.departureDate.toISOString().split('T')[0] : "2024-12-31"
    };

    // Save to work order items
    const existingItems = JSON.parse(localStorage.getItem('workOrderItems') || '[]');
    const updatedItems = [...existingItems, workOrderItem];
    localStorage.setItem('workOrderItems', JSON.stringify(updatedItems));

    // Clear the form data after submission
    localStorage.removeItem('modernAddNewItemData');
    
    // Navigate back to work order page
    navigate('/add-new-work-order');
  };

  const progressSteps = [
    { id: "arrival", label: "Arrival", icon: Truck, status: "completed" },
    { id: "in-lab", label: "In Lab", icon: Package, status: currentStatus === "in-lab" ? "current" : "pending" },
    { id: "qa", label: "QA", icon: CheckCircle, status: "pending" },
    { id: "ready", label: "Ready", icon: Clock, status: "pending" },
    { id: "completed", label: "Completed", icon: CheckCircle, status: "pending" }
  ];

  const statusOptions = [
    { value: "in-lab", label: "In Lab", color: "bg-blue-500" },
    { value: "qa-inspection", label: "Q/A Inspection", color: "bg-yellow-500" },
    { value: "completed", label: "Completed", color: "bg-green-500" },
    { value: "on-hold", label: "On Hold", color: "bg-red-500" }
  ];

  const priorityOptions = [
    { value: "normal", label: "Normal", color: "bg-gray-500" },
    { value: "rush", label: "Rush", color: "bg-orange-500" },
    { value: "emergency", label: "Emergency", color: "bg-red-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="p-2 rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300" />
            <div>
              <h1 className="text-xl font-semibold">Add New Item</h1>
              <Breadcrumb className="mt-1">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      asChild 
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      asChild 
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Link to="/add-new-work-order">Work Orders</Link>
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
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Progress Tracker */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Progress Timeline</h3>
            <div className="flex items-center justify-between relative">
              {progressSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === progressSteps.length - 1;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors",
                          step.status === "completed" && "bg-green-500 border-green-500 text-white",
                          step.status === "current" && "bg-primary border-primary text-white",
                          step.status === "pending" && "bg-muted border-muted-foreground text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="mt-2 text-sm font-medium">{step.label}</span>
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-4",
                          step.status === "completed" ? "bg-green-500" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Created and Modified Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Created</Label>
                  <p className="text-sm font-medium">{format(formData.createdDate, "MMM dd, yyyy")}</p>
                  <p className="text-xs text-muted-foreground">Admin User</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Modified</Label>
                  <p className="text-sm font-medium">{format(formData.modifiedDate, "MMM dd, yyyy")}</p>
                  <p className="text-xs text-muted-foreground">Admin User</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Report Number</Label>
                  <Input 
                    value={formData.reportNumber} 
                    readOnly 
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="space-y-2">
                    {statusOptions.map(option => (
                      <div
                        key={option.value}
                        onClick={() => handleInputChange("status", option.value)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border",
                          formData.status === option.value 
                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                            : "bg-background hover:bg-muted/50 border-border"
                        )}
                      >
                        <div className={cn(
                          "w-3 h-3 rounded-full", 
                          formData.status === option.value ? "bg-primary-foreground" : option.color
                        )} />
                        <span className="font-medium">{option.label}</span>
                        {formData.status === option.value && (
                          <CheckCircle className="h-4 w-4 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <Badge variant="secondary" className={cn("text-white", option.color)}>
                            {option.label}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aaron-briles">Aaron L Briles</SelectItem>
                        <SelectItem value="adam-eller">Adam D. Eller</SelectItem>
                        <SelectItem value="alex-shepard">Alexander J Shepard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Division</Label>
                    <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="esl">ESL</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="onsite">OnSite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
                      <SelectItem value="alexandria">Alexandria</SelectItem>
                      <SelectItem value="odessa">Odessa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Manufacturer</Label>
                <Select value={formData.manufacturer} onValueChange={(value) => handleInputChange("manufacturer", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search manufacturer..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fluke">FLUKE CORPORATION</SelectItem>
                    <SelectItem value="keysight">KEYSIGHT TECHNOLOGIES</SelectItem>
                    <SelectItem value="tektronix">TEKTRONIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input 
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="Enter model number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Serial Number</Label>
                  <Input 
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                    placeholder="Enter serial number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multimeter">Multimeter</SelectItem>
                      <SelectItem value="oscilloscope">Oscilloscope</SelectItem>
                      <SelectItem value="power-supply">Power Supply</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Accuracy</Label>
                  <Input 
                    value={formData.accuracy}
                    onChange={(e) => handleInputChange("accuracy", e.target.value)}
                    placeholder="e.g., ±0.1%"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter product description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>RFID Tag</Label>
                  <Input 
                    value={formData.rfid}
                    onChange={(e) => handleInputChange("rfid", e.target.value)}
                    placeholder="Scan or enter RFID"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Asset ID</Label>
                  <Input 
                    value={formData.assetId}
                    onChange={(e) => handleInputChange("assetId", e.target.value)}
                    placeholder="Enter asset ID"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Arrival & Departure Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Truck className="h-5 w-5 text-amber-600" />
              </div>
              Arrival & Departure Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Arrival Date</Label>
                <Popover open={showArrivalPicker} onOpenChange={setShowArrivalPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.arrivalDate ? format(formData.arrivalDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.arrivalDate}
                      onSelect={(date) => {
                        handleInputChange("arrivalDate", date || new Date());
                        setShowArrivalPicker(false);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Popover open={showDeparturePicker} onOpenChange={setShowDeparturePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.departureDate ? format(formData.departureDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.departureDate || undefined}
                      onSelect={(date) => {
                        handleInputChange("departureDate", date || null);
                        setShowDeparturePicker(false);
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Driver</Label>
                <Input 
                  value={formData.driver}
                  onChange={(e) => handleInputChange("driver", e.target.value)}
                  placeholder="Enter driver name"
                />
              </div>

              <div className="space-y-2">
                <Label>Ship Type</Label>
                <Select value={formData.shipType} onValueChange={(value) => handleInputChange("shipType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ship type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground</SelectItem>
                    <SelectItem value="air">Air</SelectItem>
                    <SelectItem value="expedited">Expedited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Information & Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              Other Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>PO Number</Label>
                <Input 
                  value={formData.poNumber}
                  onChange={(e) => handleInputChange("poNumber", e.target.value)}
                  placeholder="Enter PO number"
                />
              </div>

              <div className="space-y-2">
                <Label>SO Number</Label>
                <Input 
                  value={formData.soNumber}
                  onChange={(e) => handleInputChange("soNumber", e.target.value)}
                  placeholder="Enter SO number"
                />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4">Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "warranty", label: "Warranty" },
                  { key: "estimate", label: "Estimate Required" },
                  { key: "hotlist", label: "Hot List" },
                  { key: "readyToBill", label: "Ready to Bill" },
                  { key: "toShipping", label: "To Shipping" }
                ].map(option => (
                  <div key={option.key} className="flex items-center space-x-2">
                    <Switch
                      id={option.key}
                      checked={formData[option.key as keyof typeof formData] as boolean}
                      onCheckedChange={(checked) => handleInputChange(option.key, checked)}
                    />
                    <Label htmlFor={option.key}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Collapsible open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", showAdvancedOptions && "rotate-180")} />
              Advanced Options
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-slate-500/10 rounded-lg">
                    <Paperclip className="h-5 w-5 text-slate-600" />
                  </div>
                  Attachments & Accessories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to select
                  </p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea 
                    placeholder="Add any additional notes or special instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="container mx-auto px-4 h-16 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Submit Item
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernAddNewItem;
