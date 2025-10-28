import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QF3DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QF3Dialog = ({ open, onOpenChange }: QF3DialogProps) => {
  const [qf3Data, setQf3Data] = useState({
    mfg: "JM WORKING STAND.",
    date: "09/11/2025",
    tech: "Admin User",
    code: "C",
    mdl: "1 METER ANGLE w/INDICATOR",
    sn: "TX2134400192",
    wo: "447961",
    id: "R3508",
    desc: "1 METER ANGLE w/INDICATOR",
    vendorId: "",
    vendorName: "",
    address: "",
    vendorEmail: "",
    vendorPhone: "",
    reasonForReturn: "",
    vendorToPerform: "",
    malfunctionDescription: "clean it"
  });

  const handleInputChange = (field: string, value: string) => {
    setQf3Data(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("QF3 Data submitted:", qf3Data);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">QF3 Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Minimal Header Info */}
          <div className="text-center">
            <p className="text-sm text-red-600">
              <span className="font-medium">Required:</span> Vendor to Perform • Describe Malfunctions or Special Instructions
            </p>
          </div>

          {/* Equipment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Equipment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">MFG</div>
                  <div className="text-sm font-medium text-gray-900">{qf3Data.mfg}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</div>  
                  <div className="text-sm font-medium text-gray-900">{qf3Data.date}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tech</div>
                  <div className="text-sm font-medium text-gray-900">{qf3Data.tech}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code</div>
                  <div className="text-sm font-medium text-gray-900">{qf3Data.code}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Model</div>
                  <div className="text-sm font-medium text-gray-900">{qf3Data.mdl}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">S/N</div>
                  <div className="text-sm font-medium text-gray-900">{qf3Data.sn}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">W/O #</div>
                  <div className="text-sm font-medium text-gray-900">{qf3Data.wo}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID #</div>
                  <div className="text-sm font-medium text-gray-900">{qf3Data.id}</div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</div>
                  <div className="text-sm font-medium text-gray-900">{qf3Data.desc}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vendor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Sub ID</Label>
                  <Input 
                    value={qf3Data.vendorId}
                    onChange={(e) => handleInputChange('vendorId', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Vendor Name <Button variant="link" className="p-0 h-auto text-xs text-blue-600">Find</Button></Label>
                  <Input 
                    value={qf3Data.vendorName}
                    onChange={(e) => handleInputChange('vendorName', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Address</Label>
                  <Input 
                    value={qf3Data.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Vendor Email</Label>
                  <Input 
                    value={qf3Data.vendorEmail}
                    onChange={(e) => handleInputChange('vendorEmail', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Vendor Phone</Label>
                  <Input 
                    value={qf3Data.vendorPhone}
                    onChange={(e) => handleInputChange('vendorPhone', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Reason for Factory Return */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Reason for Factory Return</Label>
              <Select 
                value={qf3Data.reasonForReturn} 
                onValueChange={(value) => handleInputChange('reasonForReturn', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Exceeds lab capabilities (JM cannot test or calibrate equipment)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exceeds_capabilities">Exceeds lab capabilities (JM cannot test or calibrate equipment)</SelectItem>
                  <SelectItem value="requires_special_equipment">Requires special equipment</SelectItem>
                  <SelectItem value="manufacturer_required">Manufacturer service required</SelectItem>
                  <SelectItem value="warranty_repair">Warranty repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vendor to Perform */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Vendor to Perform</Label>
              <Select 
                value={qf3Data.vendorToPerform} 
                onValueChange={(value) => handleInputChange('vendorToPerform', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="CCFA: Provide ISO17025 Accredited Calibration With 12 Month Certification Per Mfr's Specifications. Including As Found, As Left Data With Uncertainties." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iso_calibration">CCFA: Provide ISO17025 Accredited Calibration With 12 Month Certification Per Mfr's Specifications. Including As Found, As Left Data With Uncertainties.</SelectItem>
                  <SelectItem value="repair_service">Repair and calibration service</SelectItem>
                  <SelectItem value="calibration_only">Calibration service only</SelectItem>
                  <SelectItem value="repair_only">Repair service only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Describe Malfunctions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Describe Malfunctions or Special Instructions</Label>
              <Textarea
                value={qf3Data.malfunctionDescription}
                onChange={(e) => handleInputChange('malfunctionDescription', e.target.value)}
                placeholder="Describe malfunctions or special instructions..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button variant="outline" onClick={() => console.log("Cancel QF3")}>
              Cancel QF3
            </Button>
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};