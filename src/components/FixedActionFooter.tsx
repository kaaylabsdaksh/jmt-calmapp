import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { X, Save, Copy, Printer, Tag, QrCode, ArrowLeft, FileText, Package } from 'lucide-react';

interface FixedActionFooterProps {
  onCancel: () => void;
  onSave: () => void;
  saveText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const FixedActionFooter = ({ 
  onCancel, 
  onSave, 
  saveText = "Save Item",
  cancelText = "Cancel",
  isLoading = false 
}: FixedActionFooterProps) => {
  const [numTags, setNumTags] = useState("1");
  const [acctNum, setAcctNum] = useState("");
  const [woNum, setWoNum] = useState("");
  const [moveToNewWODialog, setMoveToNewWODialog] = useState(false);
  const [newWOAcctNum, setNewWOAcctNum] = useState("");

  const handleCopyAsNew = () => {
    console.log("Copy as New clicked");
  };

  const handleCancelled = () => {
    console.log("Cancelled clicked");
  };

  const handlePrintWO = () => {
    console.log("Print WO clicked");
  };

  const handleLabel = () => {
    console.log("Label clicked");
  };

  const handleSticker = () => {
    console.log("Sticker clicked");
  };

  const handlePrintTags = () => {
    console.log("Print Tags clicked with", numTags, "tags");
  };

  const handlePrintQRSheet = () => {
    console.log("Print QR Sheet clicked");
  };

  const handleMoveToNewWO = () => {
    setMoveToNewWODialog(true);
  };

  const confirmMoveToNewWO = () => {
    console.log("Move To New Work Order confirmed with account number:", newWOAcctNum);
    setMoveToNewWODialog(false);
    setNewWOAcctNum("");
  };

  const handleMoveToExistingWO = () => {
    console.log("Move To Existing Work Order clicked with WO #:", woNum);
  };

  return (
    <TooltipProvider>
      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-[256px] right-0 bg-background border-t border-border shadow-lg z-[100]">
        <div className="px-4 py-3">
          {/* Minimal Multi-Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            
            {/* Left Actions */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleCopyAsNew}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy as New</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handlePrintWO}>
                    <Printer className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print Work Order</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleLabel}>
                    <Tag className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print Label</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleSticker}>
                    Sticker
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print Sticker</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Center Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Select value={numTags} onValueChange={setNumTags}>
                        <SelectTrigger className="w-12 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of Tags to Print</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={handlePrintTags}>
                      Tags
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Print Tags</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handlePrintQRSheet}>
                    <QrCode className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print QR Code Sheet</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input 
                    placeholder="Acct #" 
                    value={acctNum}
                    onChange={(e) => setAcctNum(e.target.value)}
                    className="w-16 h-7 text-xs"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account Number for New Work Order</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleMoveToNewWO}>
                    <FileText className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Move to New Work Order</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input 
                    placeholder="WO #" 
                    value={woNum}
                    onChange={(e) => setWoNum(e.target.value)}
                    className="w-16 h-7 text-xs"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Work Order Number</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleMoveToExistingWO}>
                    <Package className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Move to Existing Work Order</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm"
                    variant="outline" 
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3 mr-1" />
                    {cancelText}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cancel and Go Back</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm"
                    onClick={onSave}
                    disabled={isLoading}
                    className="bg-success text-success-foreground hover:bg-success/90"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {saveText}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Changes</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Move to New Work Order Dialog */}
      <Dialog open={moveToNewWODialog} onOpenChange={setMoveToNewWODialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to New Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="Enter account number"
                value={newWOAcctNum}
                onChange={(e) => setNewWOAcctNum(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveToNewWODialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMoveToNewWO} disabled={!newWOAcctNum.trim()}>
              Move to New WO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};