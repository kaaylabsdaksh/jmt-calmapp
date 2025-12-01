import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

interface QF3DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QF3Dialog = ({ open, onOpenChange }: QF3DialogProps) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [qf3Data, setQf3Data] = useState({
    mfg: "3M",
    date: "12/01/2025",
    tech: "Admin User",
    code: "G",
    mdl: "1420",
    sn: "2345",
    wo: "211873",
    id: "N/A",
    desc: "MARKER LOCATOR",
    vendorId: "",
    vendorName: "",
    address: "",
    vendorEmail: "",
    vendorPhone: "",
    reasonForReturn: "",
    vendorToPerform: "",
    malfunctionDescription: "",
    jmPartsTotal: "0.00",
    jmLaborTotal: "0.00",
    specialPricing: "",
    readingsAttached: "",
    allSectionsComplete: false,
    labTechMgrApproved: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setQf3Data(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate vendor information
    if (!qf3Data.vendorId.trim()) newErrors.vendorId = "Sub ID is required";
    if (!qf3Data.vendorName.trim()) newErrors.vendorName = "Vendor Name is required";
    if (!qf3Data.address.trim()) newErrors.address = "Address is required";
    if (!qf3Data.vendorEmail.trim()) {
      newErrors.vendorEmail = "Vendor Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(qf3Data.vendorEmail)) {
      newErrors.vendorEmail = "Invalid email format";
    }
    if (!qf3Data.vendorPhone.trim()) newErrors.vendorPhone = "Vendor Phone is required";

    // Validate required dropdowns
    if (!qf3Data.reasonForReturn) newErrors.reasonForReturn = "Reason for Factory Return is required";
    if (!qf3Data.vendorToPerform) newErrors.vendorToPerform = "Vendor to Perform is required";

    // Validate description
    if (!qf3Data.malfunctionDescription.trim()) {
      newErrors.malfunctionDescription = "Malfunctions or Special Instructions are required";
    }

    // Validate management section
    if (!qf3Data.specialPricing) newErrors.specialPricing = "Special Pricing is required";
    if (!qf3Data.readingsAttached) newErrors.readingsAttached = "Readings Attached is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    console.log("QF3 Data submitted:", qf3Data);
    toast({
      title: "Success",
      description: "QF3 Data saved successfully",
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">QF3 Created</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Technician must complete equipment information, vendor information, reason for factory return.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Equipment Information */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
                <div>
                  <span className="font-semibold">MFG:</span> {qf3Data.mfg}
                </div>
                <div>
                  <span className="font-semibold">DATE:</span> {qf3Data.date}
                </div>
                <div>
                  <span className="font-semibold">TECH:</span> {qf3Data.tech}
                </div>
                <div>
                  <span className="font-semibold">CODE:</span> {qf3Data.code}
                </div>
                <div>
                  <span className="font-semibold">MDL:</span> {qf3Data.mdl}
                </div>
                <div>
                  <span className="font-semibold">S/N:</span> {qf3Data.sn}
                </div>
                <div>
                  <span className="font-semibold">W/O #:</span> {qf3Data.wo}
                </div>
                <div>
                  <span className="font-semibold">ID #:</span> {qf3Data.id}
                </div>
                <div className="col-span-2 md:col-span-4">
                  <span className="font-semibold">DESC:</span> {qf3Data.desc}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Sub ID <span className="text-red-500">*</span>
                </Label>
                <Input 
                  value={qf3Data.vendorId}
                  onChange={(e) => handleInputChange('vendorId', e.target.value)}
                  className={errors.vendorId ? "border-red-500" : ""}
                />
                {errors.vendorId && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorId}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Vendor Name <span className="text-red-500">*</span>
                  <Button variant="link" className="p-0 h-auto text-xs text-blue-600 ml-2">Find</Button>
                </Label>
                <Input 
                  value={qf3Data.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className={errors.vendorName ? "border-red-500" : ""}
                />
                {errors.vendorName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  value={qf3Data.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Vendor Email <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="email"
                  value={qf3Data.vendorEmail}
                  onChange={(e) => handleInputChange('vendorEmail', e.target.value)}
                  className={errors.vendorEmail ? "border-red-500" : ""}
                />
                {errors.vendorEmail && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorEmail}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Vendor Phone <span className="text-red-500">*</span>
                </Label>
                <Input 
                  value={qf3Data.vendorPhone}
                  onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                  className={errors.vendorPhone ? "border-red-500" : ""}
                />
                {errors.vendorPhone && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Reason for Factory Return */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Reason for Factory Return <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={qf3Data.reasonForReturn} 
                onValueChange={(value) => handleInputChange('reasonForReturn', value)}
              >
                <SelectTrigger className={errors.reasonForReturn ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exceeds_capabilities">Exceeds lab capabilities (JM cannot test or calibrate equipment)</SelectItem>
                  <SelectItem value="requires_special_equipment">Requires special equipment</SelectItem>
                  <SelectItem value="manufacturer_required">Manufacturer service required</SelectItem>
                  <SelectItem value="warranty_repair">Warranty repair</SelectItem>
                </SelectContent>
              </Select>
              {errors.reasonForReturn && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.reasonForReturn}
                </p>
              )}
            </div>

            {/* Vendor to Perform */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Vendor to Perform <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={qf3Data.vendorToPerform} 
                onValueChange={(value) => handleInputChange('vendorToPerform', value)}
              >
                <SelectTrigger className={errors.vendorToPerform ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iso_calibration">CCFA: Provide ISO17025 Accredited Calibration With 12 Month Certification Per Mfr's Specifications. Including As Found, As Left Data With Uncertainties.</SelectItem>
                  <SelectItem value="repair_service">Repair and calibration service</SelectItem>
                  <SelectItem value="calibration_only">Calibration service only</SelectItem>
                  <SelectItem value="repair_only">Repair service only</SelectItem>
                </SelectContent>
              </Select>
              {errors.vendorToPerform && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.vendorToPerform}
                </p>
              )}
            </div>

            {/* Describe Malfunctions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Describe Malfunctions or Special Instructions <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={qf3Data.malfunctionDescription}
                onChange={(e) => handleInputChange('malfunctionDescription', e.target.value)}
                placeholder="Describe malfunctions or special instructions..."
                className={`min-h-[100px] ${errors.malfunctionDescription ? "border-red-500" : ""}`}
              />
              {errors.malfunctionDescription && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.malfunctionDescription}
                </p>
              )}
            </div>
          </div>

          {/* Management Section */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-center">
                *** MANAGEMENT USE ONLY - CHARGES TO CUSTOMER ***
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Label className="text-sm w-32">JM Parts Total:</Label>
                    <Input 
                      value={qf3Data.jmPartsTotal}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Special Pricing: <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={qf3Data.specialPricing} 
                      onValueChange={(value) => handleInputChange('specialPricing', value)}
                    >
                      <SelectTrigger className={errors.specialPricing ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select pricing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.specialPricing && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.specialPricing}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allSectionsComplete"
                      checked={qf3Data.allSectionsComplete}
                      onCheckedChange={(checked) => handleInputChange('allSectionsComplete', checked as boolean)}
                    />
                    <Label htmlFor="allSectionsComplete" className="text-sm font-medium cursor-pointer">
                      All Sections Complete:
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Label className="text-sm w-32">JM Labor Total:</Label>
                    <Input 
                      value={qf3Data.jmLaborTotal}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Readings Attached: <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={qf3Data.readingsAttached} 
                      onValueChange={(value) => handleInputChange('readingsAttached', value)}
                    >
                      <SelectTrigger className={errors.readingsAttached ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="not_applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.readingsAttached && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.readingsAttached}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="labTechMgrApproved"
                      checked={qf3Data.labTechMgrApproved}
                      onCheckedChange={(checked) => handleInputChange('labTechMgrApproved', checked as boolean)}
                    />
                    <Label htmlFor="labTechMgrApproved" className="text-sm font-medium cursor-pointer">
                      Lab/Tech Mgr Approved:
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-start gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button variant="outline" onClick={() => console.log("Cancel QF3")}>
              Cancel QF3
            </Button>
            <Button onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};