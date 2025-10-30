import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CopyFromOtherWODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemsAdded: (items: any[]) => void;
}

export const CopyFromOtherWODialog = ({ open, onOpenChange, onItemsAdded }: CopyFromOtherWODialogProps) => {
  const [copyWorkOrder, setCopyWorkOrder] = useState("");
  const [copyItemFrom, setCopyItemFrom] = useState("");
  const [copyItemTo, setCopyItemTo] = useState("");
  const [copyGroupable, setCopyGroupable] = useState("");

  const handleCopyFromOtherWO = () => {
    if (!copyWorkOrder) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a Work Order number",
      });
      return;
    }

    // Validate that either item range or groupable is provided
    const hasItemRange = copyItemFrom && copyItemTo;
    const hasGroupable = copyGroupable;

    if (!hasItemRange && !hasGroupable) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter Item # range or select Groupable option",
      });
      return;
    }

    // Mock data for items from other work orders
    const mockOtherWOItems = [
      {
        id: `copy-${Date.now()}-1`,
        itemNumber: "TEMP-001",
        calFreq: "6",
        actionCode: "rc",
        priority: "normal",
        manufacturer: "fluke",
        model: "87V",
        description: "Digital Multimeter - Copied from WO",
        mfgSerial: "SN987654",
        custId: "CUST-004",
        custSN: "C004",
        assetNumber: "ASSET-004",
        iso17025: "yes",
        estimate: "$150.00",
        newEquip: "no",
        needByDate: "2024-12-20",
        ccCost: "$55.00",
        tf: "yes",
        capableLocations: "Lab A"
      },
      {
        id: `copy-${Date.now()}-2`,
        itemNumber: "TEMP-002",
        calFreq: "12",
        actionCode: "cc",
        priority: "expedite",
        manufacturer: "keysight",
        model: "34460A",
        description: "Digital Multimeter 6.5 Digit - Copied from WO",
        mfgSerial: "SN123789",
        custId: "CUST-005",
        custSN: "C005",
        assetNumber: "ASSET-005",
        iso17025: "yes",
        estimate: "$200.00",
        newEquip: "no",
        needByDate: "2024-12-25",
        ccCost: "$70.00",
        tf: "no",
        capableLocations: "Lab B, Lab C"
      }
    ];

    // Filter items based on criteria
    let itemsToAdd = [...mockOtherWOItems];

    // If item range is specified, filter by range
    if (hasItemRange) {
      const fromNum = parseInt(copyItemFrom);
      const toNum = parseInt(copyItemTo);
      itemsToAdd = itemsToAdd.slice(fromNum - 1, toNum);
    }

    // If groupable is specified, filter accordingly (mock logic)
    if (hasGroupable) {
      // In a real scenario, this would filter based on groupable status
      itemsToAdd = hasGroupable === "yes" ? itemsToAdd : itemsToAdd.slice(0, 1);
    }

    // Call the callback to add items
    onItemsAdded(itemsToAdd);

    // Show success message
    toast({
      variant: "success",
      title: "Items Copied",
      description: `Successfully copied ${itemsToAdd.length} item(s) from Work Order ${copyWorkOrder}`,
    });

    // Reset copy fields and close dialog
    setCopyWorkOrder("");
    setCopyItemFrom("");
    setCopyItemTo("");
    setCopyGroupable("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5 text-primary" />
            Copy From Other Work Order
          </DialogTitle>
          <DialogDescription>
            Enter the work order number and item range or groupable option to copy items.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="copyWorkOrder" className="text-sm font-medium">
              Work Order # <span className="text-destructive">*</span>
            </Label>
            <Input 
              id="copyWorkOrder"
              value={copyWorkOrder}
              onChange={(e) => setCopyWorkOrder(e.target.value)}
              placeholder="WO-123456"
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Item # Range</Label>
            <div className="flex items-center gap-2">
              <Input 
                value={copyItemFrom}
                onChange={(e) => setCopyItemFrom(e.target.value)}
                placeholder="From"
                className="h-10"
                type="number"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <Input 
                value={copyItemTo}
                onChange={(e) => setCopyItemTo(e.target.value)}
                placeholder="To"
                className="h-10"
                type="number"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-border flex-1" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="copyGroupable" className="text-sm font-medium">Groupable</Label>
            <Select value={copyGroupable} onValueChange={setCopyGroupable}>
              <SelectTrigger id="copyGroupable" className="h-10">
                <SelectValue placeholder="Select groupable option..." />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCopyFromOtherWO}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Items
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
