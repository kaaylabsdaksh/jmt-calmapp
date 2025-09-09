import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, X, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const AddWorkOrderItemWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    // Step 1: General Information
    type: "",
    reportNumber: "",
    itemStatus: "",
    assignedTo: "",
    priority: "Normal",
    location: "",
    division: "",
    
    // Step 2: Product Information
    manufacturer: "",
    model: "",
    labCode: "",
    mfgSerial: "",
    costId: "",
    costSerial: "",
    rfid: "",
    quantity: "",
    description: "",
    
    // Step 3: Logistics Information
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
    
    // Step 4: Options & Checkboxes
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    console.log("Saving work order item:", formData);
    navigate("/add-new-work-order");
  };

  const handleCancel = () => {
    navigate("/add-new-work-order");
  };

  const progressPercent = (currentStep / totalSteps) * 100;

  const stepTitles = [
    "General Information",
    "Product Details", 
    "Logistics & Timing",
    "Options & Preferences"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
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
              <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleCancel} className="hover-scale">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-background/50 px-6 py-4 border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}% Complete</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  index + 1 < currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index + 1 === currentStep 
                      ? 'bg-primary text-primary-foreground animate-pulse' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-xs text-muted-foreground mt-1 text-center max-w-20">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-sm animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {currentStep}
              </div>
              {stepTitles[currentStep - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1: General Information */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="batch">Batch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reportNumber">Report Number *</Label>
                    <Input
                      id="reportNumber"
                      value={formData.reportNumber}
                      onChange={(e) => handleInputChange("reportNumber", e.target.value)}
                      placeholder="0152.01-802930-001"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemStatus">Item Status</Label>
                    <Select value={formData.itemStatus} onValueChange={(value) => handleInputChange("itemStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-lab">In Lab</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Baton Rouge"
                    />
                  </div>
                  <div>
                    <Label htmlFor="division">Division</Label>
                    <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="field">Field</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
                      <SelectTrigger>
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
              </div>
            )}

            {/* Step 2: Product Information */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                      placeholder="Enter manufacturer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      placeholder="Enter model"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="labCode">Lab Code</Label>
                    <Input
                      id="labCode"
                      value={formData.labCode}
                      onChange={(e) => handleInputChange("labCode", e.target.value)}
                      placeholder="Enter lab code"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rfid">RFID</Label>
                    <Input
                      id="rfid"
                      value={formData.rfid}
                      onChange={(e) => handleInputChange("rfid", e.target.value)}
                      placeholder="Enter RFID"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mfgSerial">Manufacturing Serial</Label>
                    <Input
                      id="mfgSerial"
                      value={formData.mfgSerial}
                      onChange={(e) => handleInputChange("mfgSerial", e.target.value)}
                      placeholder="Enter serial number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="costId">Cost ID</Label>
                    <Input
                      id="costId"
                      value={formData.costId}
                      onChange={(e) => handleInputChange("costId", e.target.value)}
                      placeholder="Enter cost ID"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter detailed item description"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Logistics Information */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Arrival Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="arrivalDate">Arrival Date</Label>
                      <Input
                        id="arrivalDate"
                        type="date"
                        value={formData.arrivalDate}
                        onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="arrivalType">Arrival Type</Label>
                      <Select value={formData.arrivalType} onValueChange={(value) => handleInputChange("arrivalType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="walk-in">Walk-in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="driver">Driver</Label>
                      <Input
                        id="driver"
                        value={formData.driver}
                        onChange={(e) => handleInputChange("driver", e.target.value)}
                        placeholder="Enter driver name"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Order Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="poNumber">PO Number</Label>
                      <Input
                        id="poNumber"
                        value={formData.poNumber}
                        onChange={(e) => handleInputChange("poNumber", e.target.value)}
                        placeholder="CUST/PO #"
                      />
                    </div>
                    <div>
                      <Label htmlFor="poLineNumber">PO Line #</Label>
                      <Input
                        id="poLineNumber"
                        value={formData.poLineNumber}
                        onChange={(e) => handleInputChange("poLineNumber", e.target.value)}
                        placeholder="Enter PO line #"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Delivery Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="needBy">Need By Date</Label>
                      <Input
                        id="needBy"
                        type="date"
                        value={formData.needBy}
                        onChange={(e) => handleInputChange("needBy", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliverByDate">Deliver By Date</Label>
                      <Input
                        id="deliverByDate"
                        type="date"
                        value={formData.deliverByDate}
                        onChange={(e) => handleInputChange("deliverByDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Options & Checkboxes */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="font-medium text-foreground mb-4">Equipment Status & Options</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: "warranty", label: "Warranty" },
                      { key: "estimate", label: "Estimate" },
                      { key: "newEquip", label: "New Equipment" },
                      { key: "usedSurplus", label: "Used/Surplus" },
                      { key: "iso17025", label: "ISO 17025" },
                      { key: "hotList", label: "Hot List" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={key}
                          checked={formData[key as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleInputChange(key, checked)}
                        />
                        <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-4">Processing Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: "readyToBill", label: "Ready To Bill" },
                      { key: "inQa", label: "In QA" },
                      { key: "toShipping", label: "To Shipping" },
                      { key: "multiParts", label: "Multi Parts" },
                      { key: "lostEquipment", label: "Lost Equipment" },
                      { key: "redTag", label: "Red Tag" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={key}
                          checked={formData[key as keyof typeof formData] as boolean}
                          onCheckedChange={(checked) => handleInputChange(key, checked)}
                        />
                        <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="hover-scale"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {currentStep === totalSteps ? (
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 hover-scale">
                    <Save className="h-4 w-4 mr-2" />
                    Save Item
                  </Button>
                ) : (
                  <Button onClick={nextStep} className="hover-scale">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddWorkOrderItemWizard;