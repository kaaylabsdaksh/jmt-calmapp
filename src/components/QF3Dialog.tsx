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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">QF3 Factory Return Form</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Complete all required fields to submit equipment for factory return service
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Equipment Information */}
          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
            <h3 className="text-sm font-semibold mb-3 text-primary">Equipment Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">MFG:</span>
                <span className="font-medium">{qf3Data.mfg}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Date:</span>
                <span className="font-medium">{qf3Data.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Tech:</span>
                <span className="font-medium">{qf3Data.tech}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Code:</span>
                <span className="font-medium">{qf3Data.code}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">MDL:</span>
                <span className="font-medium">{qf3Data.mdl}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">S/N:</span>
                <span className="font-medium">{qf3Data.sn}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">W/O #:</span>
                <span className="font-medium">{qf3Data.wo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">ID #:</span>
                <span className="font-medium">{qf3Data.id}</span>
              </div>
              <div className="col-span-2 md:col-span-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-16">Desc:</span>
                <span className="font-medium">{qf3Data.desc}</span>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="border-l-4 border-primary p-4 rounded bg-background">
            <h3 className="text-sm font-semibold mb-4 text-primary">
              Vendor Information <span className="text-xs font-normal text-destructive ml-2">* All fields required</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Sub ID <span className="text-destructive">*</span>
                </Label>
                <Input 
                  value={qf3Data.vendorId}
                  onChange={(e) => handleInputChange('vendorId', e.target.value)}
                  placeholder="Enter Sub ID"
                  className={errors.vendorId ? "border-destructive" : ""}
                />
                {errors.vendorId && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorId}
                  </p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center justify-between">
                  <span>Vendor Name <span className="text-destructive">*</span></span>
                  <Button variant="link" className="p-0 h-auto text-xs">Find</Button>
                </Label>
                <Input 
                  value={qf3Data.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  placeholder="Enter vendor name"
                  className={errors.vendorName ? "border-destructive" : ""}
                />
                {errors.vendorName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorName}
                  </p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Input 
                  value={qf3Data.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter address"
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Vendor Email <span className="text-destructive">*</span>
                </Label>
                <Input 
                  type="email"
                  value={qf3Data.vendorEmail}
                  onChange={(e) => handleInputChange('vendorEmail', e.target.value)}
                  placeholder="vendor@example.com"
                  className={errors.vendorEmail ? "border-destructive" : ""}
                />
                {errors.vendorEmail && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorEmail}
                  </p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Vendor Phone <span className="text-destructive">*</span>
                </Label>
                <Input 
                  value={qf3Data.vendorPhone}
                  onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                  placeholder="(123) 456-7890"
                  className={errors.vendorPhone ? "border-destructive" : ""}
                />
                {errors.vendorPhone && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Return Details */}
          <div className="border-l-4 border-primary p-4 rounded bg-background">
            <h3 className="text-sm font-semibold mb-4 text-primary">
              Return Details <span className="text-xs font-normal text-destructive ml-2">* All fields required</span>
            </h3>
            <div className="space-y-4">
              {/* Reason for Factory Return */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Reason for Factory Return <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={qf3Data.reasonForReturn} 
                  onValueChange={(value) => handleInputChange('reasonForReturn', value)}
                >
                  <SelectTrigger className={errors.reasonForReturn ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select reason for return" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exceeds_capabilities">Exceeds lab capabilities (JM cannot test or calibrate equipment)</SelectItem>
                    <SelectItem value="requires_special_equipment">Requires special equipment</SelectItem>
                    <SelectItem value="manufacturer_required">Manufacturer service required</SelectItem>
                    <SelectItem value="warranty_repair">Warranty repair</SelectItem>
                  </SelectContent>
                </Select>
                {errors.reasonForReturn && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.reasonForReturn}
                  </p>
                )}
              </div>

              {/* Vendor to Perform */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Vendor to Perform <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={qf3Data.vendorToPerform} 
                  onValueChange={(value) => handleInputChange('vendorToPerform', value)}
                >
                  <SelectTrigger className={errors.vendorToPerform ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iso_calibration">CCFA: Provide ISO17025 Accredited Calibration With 12 Month Certification Per Mfr's Specifications. Including As Found, As Left Data With Uncertainties.</SelectItem>
                    <SelectItem value="repair_service">Repair and calibration service</SelectItem>
                    <SelectItem value="calibration_only">Calibration service only</SelectItem>
                    <SelectItem value="repair_only">Repair service only</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vendorToPerform && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorToPerform}
                  </p>
                )}
              </div>

              {/* Describe Malfunctions */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Describe Malfunctions or Special Instructions <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={qf3Data.malfunctionDescription}
                  onChange={(e) => handleInputChange('malfunctionDescription', e.target.value)}
                  placeholder="Provide detailed description of malfunctions or any special instructions for the vendor..."
                  className={`min-h-[100px] ${errors.malfunctionDescription ? "border-destructive" : ""}`}
                />
                {errors.malfunctionDescription && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.malfunctionDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Management Section */}
          <div className="bg-accent/10 border-l-4 border-accent p-4 rounded">
            <h3 className="text-sm font-semibold mb-4 text-accent-foreground">
              Management Use Only - Customer Charges
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    JM Parts Total
                  </Label>
                  <Input 
                    value={qf3Data.jmPartsTotal}
                    readOnly
                    className="bg-muted/50"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Special Pricing <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={qf3Data.specialPricing} 
                    onValueChange={(value) => handleInputChange('specialPricing', value)}
                  >
                    <SelectTrigger className={errors.specialPricing ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select pricing option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.specialPricing && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.specialPricing}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="allSectionsComplete"
                    checked={qf3Data.allSectionsComplete}
                    onCheckedChange={(checked) => handleInputChange('allSectionsComplete', checked as boolean)}
                  />
                  <Label htmlFor="allSectionsComplete" className="text-xs font-medium cursor-pointer">
                    All Sections Complete
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    JM Labor Total
                  </Label>
                  <Input 
                    value={qf3Data.jmLaborTotal}
                    readOnly
                    className="bg-muted/50"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Readings Attached <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={qf3Data.readingsAttached} 
                    onValueChange={(value) => handleInputChange('readingsAttached', value)}
                  >
                    <SelectTrigger className={errors.readingsAttached ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="not_applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.readingsAttached && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.readingsAttached}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="labTechMgrApproved"
                    checked={qf3Data.labTechMgrApproved}
                    onCheckedChange={(checked) => handleInputChange('labTechMgrApproved', checked as boolean)}
                  />
                  <Label htmlFor="labTechMgrApproved" className="text-xs font-medium cursor-pointer">
                    Lab/Tech Manager Approved
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button variant="outline" onClick={() => console.log("Cancel QF3")}>
                Cancel QF3
              </Button>
            </div>
            <Button onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};