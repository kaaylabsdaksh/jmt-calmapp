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

    // Validate email format if provided
    if (qf3Data.vendorEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(qf3Data.vendorEmail)) {
      newErrors.vendorEmail = "Invalid email format";
    }

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
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">QF3 Factory Return Form</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Complete all required fields to submit equipment for factory return service
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Equipment Information */}
          <div className="bg-primary/5 border-l-4 border-primary rounded p-3">
            <h3 className="text-xs font-semibold mb-3">Equipment Information</h3>
            
            <div className="space-y-3">
              {/* First Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">MFG</div>
                  <div className="text-sm font-bold text-foreground">{qf3Data.mfg}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">DATE</div>
                  <div className="text-sm font-bold text-foreground">{qf3Data.date}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">TECH</div>
                  <div className="text-sm font-bold text-foreground">{qf3Data.tech}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">CODE</div>
                  <div className="text-sm font-bold text-foreground">{qf3Data.code}</div>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">MDL</div>
                  <div className="text-sm font-bold text-foreground">{qf3Data.mdl}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">S/N</div>
                  <div className="text-sm font-bold text-foreground">{qf3Data.sn}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">W/O #</div>
                  <div className="text-sm font-bold text-foreground">{qf3Data.wo}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">ID #</div>
                  <div className="text-sm font-bold text-foreground">{qf3Data.id}</div>
                </div>
              </div>

              {/* Description Row */}
              <div className="pt-1">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">DESCRIPTION</div>
                <div className="text-sm font-bold text-foreground">{qf3Data.desc}</div>
              </div>
            </div>
          </div>

          {/* Vendor Information */}
          <div className="border rounded p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold">Vendor Information</h3>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold flex items-center gap-1">
                  Sub ID
                </Label>
                <Input 
                  value={qf3Data.vendorId}
                  onChange={(e) => handleInputChange('vendorId', e.target.value)}
                  placeholder="Enter Sub ID"
                  className="h-8 text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold flex items-center gap-2">
                  Vendor Name
                  <Button variant="link" className="p-0 h-auto text-[10px] text-primary ml-auto">Find</Button>
                </Label>
                <Input 
                  value={qf3Data.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  placeholder="Enter vendor name"
                  className="h-8 text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold flex items-center gap-1">
                  Address
                </Label>
                <Input 
                  value={qf3Data.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter address"
                  className="h-8 text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold flex items-center gap-1">
                  Vendor Email
                </Label>
                <Input 
                  type="email"
                  value={qf3Data.vendorEmail}
                  onChange={(e) => handleInputChange('vendorEmail', e.target.value)}
                  placeholder="vendor@example.com"
                  className="h-8 text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold flex items-center gap-1">
                  Vendor Phone
                </Label>
                <Input 
                  value={qf3Data.vendorPhone}
                  onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                  placeholder="(123) 456-7890"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Return Details */}
          <div className="border rounded p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold">Return Details</h3>
              <span className="text-[10px] font-medium text-destructive">* All fields required</span>
            </div>
            
            <div className="space-y-3">
              {/* Reason for Factory Return */}
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold flex items-center gap-1">
                  Reason for Factory Return <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={qf3Data.reasonForReturn} 
                  onValueChange={(value) => handleInputChange('reasonForReturn', value)}
                >
                  <SelectTrigger className={`h-8 text-sm ${errors.reasonForReturn ? "border-destructive focus-visible:ring-destructive" : ""}`}>
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
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.reasonForReturn}
                  </p>
                )}
              </div>

              {/* Vendor to Perform */}
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold flex items-center gap-1">
                  Vendor to Perform <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={qf3Data.vendorToPerform} 
                  onValueChange={(value) => handleInputChange('vendorToPerform', value)}
                >
                  <SelectTrigger className={`h-8 text-sm ${errors.vendorToPerform ? "border-destructive focus-visible:ring-destructive" : ""}`}>
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
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.vendorToPerform}
                  </p>
                )}
              </div>

              {/* Describe Malfunctions */}
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold flex items-center gap-1">
                  Describe Malfunctions or Special Instructions <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={qf3Data.malfunctionDescription}
                  onChange={(e) => handleInputChange('malfunctionDescription', e.target.value)}
                  placeholder="Provide detailed description of malfunctions or any special instructions for the vendor..."
                  className={`min-h-[80px] text-sm ${errors.malfunctionDescription ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.malfunctionDescription && (
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.malfunctionDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Management Section */}
          <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-900/10">
            <CardHeader className="pb-4 bg-orange-100/50 dark:bg-orange-900/20 border-b-2 border-orange-200">
              <CardTitle className="text-sm font-bold text-center text-orange-900 dark:text-orange-100 uppercase tracking-wide">
                Management Use Only - Customer Charges
              </CardTitle>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Management approval required for all pricing decisions
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      JM Parts Total
                    </Label>
                    <Input 
                      value={qf3Data.jmPartsTotal}
                      readOnly
                      className="bg-muted/50 font-mono text-base font-semibold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1">
                      Special Pricing <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={qf3Data.specialPricing} 
                      onValueChange={(value) => handleInputChange('specialPricing', value)}
                    >
                      <SelectTrigger className={errors.specialPricing ? "border-destructive focus-visible:ring-destructive" : ""}>
                        <SelectValue placeholder="Select pricing option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Pricing</SelectItem>
                        <SelectItem value="discount">Discounted Rate</SelectItem>
                        <SelectItem value="premium">Premium Service</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.specialPricing && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.specialPricing}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border">
                    <Checkbox 
                      id="allSectionsComplete"
                      checked={qf3Data.allSectionsComplete}
                      onCheckedChange={(checked) => handleInputChange('allSectionsComplete', checked as boolean)}
                    />
                    <Label htmlFor="allSectionsComplete" className="text-sm font-semibold cursor-pointer">
                      All Sections Complete
                    </Label>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      JM Labor Total
                    </Label>
                    <Input 
                      value={qf3Data.jmLaborTotal}
                      readOnly
                      className="bg-muted/50 font-mono text-base font-semibold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1">
                      Readings Attached <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={qf3Data.readingsAttached} 
                      onValueChange={(value) => handleInputChange('readingsAttached', value)}
                    >
                      <SelectTrigger className={errors.readingsAttached ? "border-destructive focus-visible:ring-destructive" : ""}>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes - Readings Attached</SelectItem>
                        <SelectItem value="no">No - No Readings</SelectItem>
                        <SelectItem value="not_applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.readingsAttached && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.readingsAttached}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border">
                    <Checkbox 
                      id="labTechMgrApproved"
                      checked={qf3Data.labTechMgrApproved}
                      onCheckedChange={(checked) => handleInputChange('labTechMgrApproved', checked as boolean)}
                    />
                    <Label htmlFor="labTechMgrApproved" className="text-sm font-semibold cursor-pointer">
                      Lab/Tech Manager Approved
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t-2">
            <div className="flex gap-2">
              <Button variant="outline" size="lg" onClick={handleClose}>
                Close
              </Button>
              <Button variant="destructive" size="lg" onClick={() => console.log("Cancel QF3")}>
                Cancel QF3
              </Button>
            </div>
            <Button size="lg" onClick={handleSubmit} className="min-w-32">
              Save QF3 Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};