import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (contactData: ContactFormData) => void;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  fax: string;
  cell: string;
  emailAddress: string;
  website: string;
}

export const ContactForm = ({ open, onOpenChange, onSave }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    title: "",
    phone: "",
    fax: "",
    cell: "",
    emailAddress: "",
    website: ""
  });

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.(formData);
    onOpenChange(false);
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      title: "",
      phone: "",
      fax: "",
      cell: "",
      emailAddress: "",
      website: ""
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Contact Name (First and Last) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                Contact Name:
              </Label>
              <Input
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                &nbsp;
              </Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title:
            </Label>
            <Input
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          {/* Phone, Fax, Cell in a row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone:
              </Label>
              <Input
                id="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax" className="text-sm font-medium">
                Fax:
              </Label>
              <Input
                id="fax"
                placeholder="Fax"
                value={formData.fax}
                onChange={(e) => handleInputChange("fax", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cell" className="text-sm font-medium">
                Cell:
              </Label>
              <Input
                id="cell"
                placeholder="Cell"
                value={formData.cell}
                onChange={(e) => handleInputChange("cell", e.target.value)}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="emailAddress" className="text-sm font-medium">
              Email Address:
            </Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange("emailAddress", e.target.value)}
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">
              Website:
            </Label>
            <Input
              id="website"
              placeholder="Website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-3 pt-4">
            <Button 
              onClick={handleSave}
              className="bg-warning text-black hover:bg-warning/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Save
            </Button>
            <Button 
              onClick={handleClear}
              variant="outline"
              className="bg-warning text-black hover:bg-warning/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Clear
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="bg-warning text-black hover:bg-warning/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};