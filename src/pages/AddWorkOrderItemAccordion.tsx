import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Save, X, ChevronRight, Package, Info, Truck, Settings } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const AddWorkOrderItemAccordion = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: "",
    reportNumber: "",
    itemStatus: "",
    assignedTo: "",
    priority: "Normal",
    location: "",
    division: "",
    manufacturer: "",
    model: "",
    labCode: "",
    mfgSerial: "",
    costId: "",
    costSerial: "",
    rfid: "",
    quantity: "",
    description: "",
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

  const [completedSections, setCompletedSections] = useState<string[]>([]);

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

  const isGeneralComplete = !!(formData.type && formData.reportNumber);
  const isProductComplete = !!(formData.manufacturer && formData.model);
  const isLogisticsComplete = !!(formData.arrivalDate || formData.poNumber);

  const getCompletionIcon = (isComplete: boolean) => {
    return isComplete ? (
      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">✓</div>
    ) : (
      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground"></div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm px-6 py-4 border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
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
              <p className="text-sm text-muted-foreground">Expand sections below to complete the form</p>
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

      {/* Progress Summary */}
      <div className="bg-background/50 px-6 py-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Completion Status</span>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                {getCompletionIcon(isGeneralComplete)}
                <span className={isGeneralComplete ? "text-primary" : "text-muted-foreground"}>General</span>
              </div>
              <div className="flex items-center gap-2">
                {getCompletionIcon(isProductComplete)}
                <span className={isProductComplete ? "text-primary" : "text-muted-foreground"}>Product</span>
              </div>
              <div className="flex items-center gap-2">
                {getCompletionIcon(isLogisticsComplete)}
                <span className={isLogisticsComplete ? "text-primary" : "text-muted-foreground"}>Logistics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Form Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-sm">
          <CardContent className="p-0">
            <Accordion type="multiple" defaultValue={["general"]} className="w-full">
              
              {/* General Information Section */}
              <AccordionItem value="general" className="border-b border-border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">General Information</h3>
                      <p className="text-sm text-muted-foreground">Basic work order item details</p>
                    </div>
                    <div className="ml-auto mr-4">
                      {getCompletionIcon(isGeneralComplete)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium">Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single" disabled className="font-semibold text-primary bg-muted/50">
                              SINGLE
                            </SelectItem>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Product Information Section */}
              <AccordionItem value="product" className="border-b border-border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">Product Information</h3>
                      <p className="text-sm text-muted-foreground">Technical specifications and details</p>
                    </div>
                    <div className="ml-auto mr-4">
                      {getCompletionIcon(isProductComplete)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="labCode" className="text-sm font-medium">Lab Code</Label>
                        <Input
                          id="labCode"
                          value={formData.labCode}
                          onChange={(e) => handleInputChange("labCode", e.target.value)}
                          placeholder="Enter lab code"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Enter detailed item description"
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Logistics Information Section */}
              <AccordionItem value="logistics" className="border-b border-border">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">Logistics & Timing</h3>
                      <p className="text-sm text-muted-foreground">Arrival and delivery information</p>
                    </div>
                    <div className="ml-auto mr-4">
                      {getCompletionIcon(isLogisticsComplete)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground border-b border-border pb-2">Arrival Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground border-b border-border pb-2">Order Information</h4>
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
                            placeholder="Enter PO line #"
                            className="h-11"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground border-b border-border pb-2">Delivery Schedule</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Options & Settings Section */}
              <AccordionItem value="options" className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">Options & Settings</h3>
                      <p className="text-sm text-muted-foreground">Additional preferences and flags</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground border-b border-border pb-2">Equipment Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { key: "warranty", label: "Warranty" },
                          { key: "estimate", label: "Estimate" },
                          { key: "newEquip", label: "New Equipment" },
                          { key: "usedSurplus", label: "Used/Surplus" },
                          { key: "iso17025", label: "ISO 17025" },
                          { key: "hotList", label: "Hot List" },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <Checkbox
                          id={key}
                          checked={formData[key as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleInputChange(key, !!checked)}
                        />
                            <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground border-b border-border pb-2">Processing Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { key: "readyToBill", label: "Ready To Bill" },
                          { key: "inQa", label: "In QA" },
                          { key: "toShipping", label: "To Shipping" },
                          { key: "multiParts", label: "Multi Parts" },
                          { key: "lostEquipment", label: "Lost Equipment" },
                          { key: "redTag", label: "Red Tag" },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                          <Checkbox
                            id={key}
                            checked={formData[key as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => handleInputChange(key, !!checked)}
                          />
                            <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddWorkOrderItemAccordion;