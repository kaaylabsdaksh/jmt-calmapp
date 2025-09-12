import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RFIDDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RFIDDialog = ({ open, onOpenChange }: RFIDDialogProps) => {
  const [rfidValue, setRfidValue] = useState("");

  const handleOK = () => {
    if (rfidValue.trim()) {
      console.log("RFID scanned:", rfidValue);
      // TODO: Automatically create work order item with RFID
      setRfidValue("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setRfidValue("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item with RFID</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rfid" className="text-sm font-medium">
              RFID:
            </Label>
            <Input
              id="rfid"
              value={rfidValue}
              onChange={(e) => setRfidValue(e.target.value)}
              placeholder="Scan or enter RFID"
              className="w-full"
              autoFocus
            />
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-gray-700">
              <strong>NOTE:</strong> Scanning RFID will automatically create work order item.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleOK}
            disabled={!rfidValue.trim()}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};