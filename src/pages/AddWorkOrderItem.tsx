import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const AddWorkOrderItem = () => {
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
    capableLoc: "",
    accuracy: "",
    ranges: "",
    options: "",
    
    // Arrival Information
    arrivalDate: "",
    arrivalType: "",
    arrivalLocation: "",
    driver: "",
    puDate: "",
    shipType: "",
    
    // Other Information
    poNumber: "",
    poLineNumber: "",
    soNumber: "",
    jmPartsPoNumber: "",
    needBy: "",
    deliverByDate: "",
    
    // Checkboxes
    warranty: false,
    estimate: false,
    newEquip: false,
    usedSurplus: false,
    iso17025: false,
    coOverride: false,
    hotList: false,
    dateValid: false,
    override: false,
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
    // Handle save logic here
    console.log("Saving work order item:", formData);
    navigate("/add-new-work-order");
  };

  const handleCancel = () => {
    navigate("/add-new-work-order");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Add New Work Order Item</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Item
            </Button>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
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
                  <Label htmlFor="reportNumber">Report #</Label>
                  <Input
                    id="reportNumber"
                    value={formData.reportNumber}
                    onChange={(e) => handleInputChange("reportNumber", e.target.value)}
                    placeholder="0152.01-802930-001"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mfgSerial">Mfg Serial</Label>
                  <Input
                    id="mfgSerial"
                    value={formData.mfgSerial}
                    onChange={(e) => handleInputChange("mfgSerial", e.target.value)}
                    placeholder="Enter serial number"
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

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Arrival Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Arrival Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrivalDate">Date</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalType">Type</Label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="driver">Driver</Label>
                  <Input
                    id="driver"
                    value={formData.driver}
                    onChange={(e) => handleInputChange("driver", e.target.value)}
                    placeholder="Enter driver name"
                  />
                </div>
                <div>
                  <Label htmlFor="shipType">Ship Type</Label>
                  <Select value={formData.shipType} onValueChange={(value) => handleInputChange("shipType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ship type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground">Ground</SelectItem>
                      <SelectItem value="air">Air</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Information & Checkboxes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="needBy">Need By</Label>
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

              {/* Checkboxes Grid */}
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium text-foreground mb-3 block">Options</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "warranty", label: "Warranty" },
                    { key: "estimate", label: "Estimate" },
                    { key: "newEquip", label: "New Equip" },
                    { key: "usedSurplus", label: "Used/Surplus" },
                    { key: "iso17025", label: "17025" },
                    { key: "hotList", label: "Hot List" },
                    { key: "readyToBill", label: "Ready To Bill" },
                    { key: "inQa", label: "In QA" },
                    { key: "toShipping", label: "To Shipping" },
                    { key: "multiParts", label: "Multi Parts" },
                    { key: "lostEquipment", label: "Lost Equipment" },
                    { key: "redTag", label: "Red Tag" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData[key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleInputChange(key, checked)}
                      />
                      <Label htmlFor={key} className="text-sm font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AddWorkOrderItem;
