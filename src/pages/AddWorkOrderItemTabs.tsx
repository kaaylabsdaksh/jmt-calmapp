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

const AddWorkOrderItemTabs = () => {
  const navigate = useNavigate();
  
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
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
            <TabsTrigger 
              value="general" 
              className="flex flex-col gap-2 p-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Info className="h-5 w-5" />
              <span className="text-sm font-medium">General</span>
            </TabsTrigger>
            <TabsTrigger 
              value="product" 
              className="flex flex-col gap-2 p-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Package className="h-5 w-5" />
              <span className="text-sm font-medium">Product</span>
            </TabsTrigger>
            <TabsTrigger 
              value="logistics" 
              className="flex flex-col gap-2 p-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Logistics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="options" 
              className="flex flex-col gap-2 p-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Options</span>
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
                      <SelectContent>
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
                  <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                    <SelectTrigger className="h-11 max-w-md">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin User</SelectItem>
                      <SelectItem value="tech1">Tech 1</SelectItem>
                      <SelectItem value="tech2">Tech 2</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <Input
                        id="manufacturer"
                        value={formData.manufacturer}
                        onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                        placeholder="Enter manufacturer"
                        className="h-11"
                      />
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
      </div>
    </div>
  );
};

export default AddWorkOrderItemTabs;