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
  
  // Dialog states
  const [copyAsNewDialog, setCopyAsNewDialog] = useState(false);
  const [printWODialog, setPrintWODialog] = useState(false);
  const [printLabelDialog, setPrintLabelDialog] = useState(false);
  const [printStickerDialog, setPrintStickerDialog] = useState(false);
  const [printTagsDialog, setPrintTagsDialog] = useState(false);
  const [printQRDialog, setPrintQRDialog] = useState(false);
  const [moveToNewWODialog, setMoveToNewWODialog] = useState(false);
  const [newWOAcctNum, setNewWOAcctNum] = useState("");
  const [moveToExistingWODialog, setMoveToExistingWODialog] = useState(false);
  const [existingWONum, setExistingWONum] = useState("");
  
  // Form states for dialogs
  const [copyFormData, setCopyFormData] = useState({
    workOrderNumber: "",
    accountNumber: "",
    description: ""
  });
  
  const [printSettings, setPrintSettings] = useState({
    printer: "Default Printer",
    copies: "1",
    orientation: "Portrait"
  });

  const handleCopyAsNew = () => {
    setCopyAsNewDialog(true);
  };

  const handleCancelled = () => {
    console.log("Cancelled clicked");
  };

  const handlePrintWO = () => {
    setPrintWODialog(true);
  };

  const handleLabel = () => {
    setPrintLabelDialog(true);
  };

  const handleSticker = () => {
    setPrintStickerDialog(true);
  };

  const handlePrintTags = () => {
    setPrintTagsDialog(true);
  };

  const handlePrintQRSheet = () => {
    setPrintQRDialog(true);
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
    setMoveToExistingWODialog(true);
  };

  const confirmMoveToExistingWO = () => {
    console.log("Move To Existing Work Order confirmed with WO #:", existingWONum);
    setMoveToExistingWODialog(false);
    setExistingWONum("");
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

      {/* Move to Existing Work Order Dialog */}
      <Dialog open={moveToExistingWODialog} onOpenChange={setMoveToExistingWODialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Existing Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="work-order-number">Work Order Number</Label>
              <Input
                id="work-order-number"
                placeholder="Enter work order number"
                value={existingWONum}
                onChange={(e) => setExistingWONum(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveToExistingWODialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMoveToExistingWO} disabled={!existingWONum.trim()}>
              Move to Existing WO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy as New Dialog */}
      <Dialog open={copyAsNewDialog} onOpenChange={setCopyAsNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy as New Work Order Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-wo-number">New Work Order Number</Label>
              <Input
                id="new-wo-number"
                placeholder="Enter new work order number"
                value={copyFormData.workOrderNumber}
                onChange={(e) => setCopyFormData(prev => ({...prev, workOrderNumber: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="copy-account-number">Account Number</Label>
              <Input
                id="copy-account-number"
                placeholder="Enter account number"
                value={copyFormData.accountNumber}
                onChange={(e) => setCopyFormData(prev => ({...prev, accountNumber: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="copy-description">Description (Optional)</Label>
              <Input
                id="copy-description"
                placeholder="Enter description"
                value={copyFormData.description}
                onChange={(e) => setCopyFormData(prev => ({...prev, description: e.target.value}))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCopyAsNewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Copy as New confirmed:", copyFormData);
              setCopyAsNewDialog(false);
              setCopyFormData({workOrderNumber: "", accountNumber: "", description: ""});
            }}>
              Copy as New
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Work Order Dialog */}
      <Dialog open={printWODialog} onOpenChange={setPrintWODialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="printer-select">Printer</Label>
              <Select value={printSettings.printer} onValueChange={(value) => setPrintSettings(prev => ({...prev, printer: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default Printer">Default Printer</SelectItem>
                  <SelectItem value="HP LaserJet Pro">HP LaserJet Pro</SelectItem>
                  <SelectItem value="Canon PIXMA">Canon PIXMA</SelectItem>
                  <SelectItem value="Epson WorkForce">Epson WorkForce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="copies">Number of Copies</Label>
              <Select value={printSettings.copies} onValueChange={(value) => setPrintSettings(prev => ({...prev, copies: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orientation">Orientation</Label>
              <Select value={printSettings.orientation} onValueChange={(value) => setPrintSettings(prev => ({...prev, orientation: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Portrait">Portrait</SelectItem>
                  <SelectItem value="Landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrintWODialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Print Work Order confirmed:", printSettings);
              setPrintWODialog(false);
            }}>
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Label Dialog */}
      <Dialog open={printLabelDialog} onOpenChange={setPrintLabelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Label</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label-printer">Label Printer</Label>
              <Select defaultValue="Zebra ZD420">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zebra ZD420">Zebra ZD420</SelectItem>
                  <SelectItem value="Brother QL-820NWB">Brother QL-820NWB</SelectItem>
                  <SelectItem value="DYMO LabelWriter">DYMO LabelWriter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="label-size">Label Size</Label>
              <Select defaultValue="2x1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2x1">2" x 1"</SelectItem>
                  <SelectItem value="3x2">3" x 2"</SelectItem>
                  <SelectItem value="4x2">4" x 2"</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrintLabelDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Print Label confirmed");
              setPrintLabelDialog(false);
            }}>
              Print Label
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Sticker Dialog */}
      <Dialog open={printStickerDialog} onOpenChange={setPrintStickerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Sticker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sticker-type">Sticker Type</Label>
              <Select defaultValue="Asset Tag">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asset Tag">Asset Tag</SelectItem>
                  <SelectItem value="Calibration Sticker">Calibration Sticker</SelectItem>
                  <SelectItem value="QC Passed">QC Passed</SelectItem>
                  <SelectItem value="Warranty Void">Warranty Void</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sticker-quantity">Quantity</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,10,20,50].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrintStickerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Print Sticker confirmed");
              setPrintStickerDialog(false);
            }}>
              Print Sticker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Tags Dialog */}
      <Dialog open={printTagsDialog} onOpenChange={setPrintTagsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-quantity">Number of Tags</Label>
              <Select value={numTags} onValueChange={setNumTags}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,10,20,50,100].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-format">Tag Format</Label>
              <Select defaultValue="Standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Barcode">With Barcode</SelectItem>
                  <SelectItem value="QR Code">With QR Code</SelectItem>
                  <SelectItem value="Minimal">Minimal Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrintTagsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Print Tags confirmed:", numTags, "tags");
              setPrintTagsDialog(false);
            }}>
              Print Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print QR Code Sheet Dialog */}
      <Dialog open={printQRDialog} onOpenChange={setPrintQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print QR Code Sheet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="qr-sheet-size">Sheet Size</Label>
              <Select defaultValue="Letter">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Letter">Letter (8.5" x 11")</SelectItem>
                  <SelectItem value="A4">A4 (210mm x 297mm)</SelectItem>
                  <SelectItem value="Legal">Legal (8.5" x 14")</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-per-sheet">QR Codes per Sheet</Label>
              <Select defaultValue="12">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 (Large)</SelectItem>
                  <SelectItem value="12">12 (Medium)</SelectItem>
                  <SelectItem value="24">24 (Small)</SelectItem>
                  <SelectItem value="48">48 (Tiny)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-data">Include Data</Label>
              <Select defaultValue="Basic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic Info</SelectItem>
                  <SelectItem value="Extended">Extended Info</SelectItem>
                  <SelectItem value="URL Only">URL Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrintQRDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Print QR Code Sheet confirmed");
              setPrintQRDialog(false);
            }}>
              Print QR Sheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};