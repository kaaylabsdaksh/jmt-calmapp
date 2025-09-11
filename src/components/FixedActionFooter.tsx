import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  cancelText = "Back",
  isLoading = false 
}: FixedActionFooterProps) => {
  const [numTags, setNumTags] = useState("1");
  const [acctNum, setAcctNum] = useState("");
  const [woNum, setWoNum] = useState("");

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
    console.log("Move To New Work Order clicked with acct num:", acctNum);
  };

  const handleMoveToExistingWO = () => {
    console.log("Move To Existing Work Order clicked with WO #:", woNum);
  };

  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-[256px] right-0 bg-background border-t border-border shadow-lg z-[100]">
        <div className="px-4 py-3">
          {/* Minimal Multi-Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            
            {/* Left Actions */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyAsNew}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelled}>
                Cancelled
              </Button>
              <Button size="sm" variant="outline" onClick={handlePrintWO}>
                <Printer className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleLabel}>
                <Tag className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleSticker}>
                Sticker
              </Button>
            </div>

            {/* Center Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
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
                <Button size="sm" variant="outline" onClick={handlePrintTags}>
                  Tags
                </Button>
              </div>
              <Button size="sm" variant="outline" onClick={handlePrintQRSheet}>
                <QrCode className="h-3 w-3" />
              </Button>
              <Input 
                placeholder="Acct #" 
                value={acctNum}
                onChange={(e) => setAcctNum(e.target.value)}
                className="w-16 h-7 text-xs"
              />
              <Button size="sm" variant="outline" onClick={handleMoveToNewWO}>
                <FileText className="h-3 w-3" />
              </Button>
              <Input 
                placeholder="WO #" 
                value={woNum}
                onChange={(e) => setWoNum(e.target.value)}
                className="w-16 h-7 text-xs"
              />
              <Button size="sm" variant="outline" onClick={handleMoveToExistingWO}>
                <Package className="h-3 w-3" />
              </Button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                variant="outline" 
                onClick={onCancel}
                disabled={isLoading}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                {cancelText}
              </Button>
              <Button 
                size="sm"
                onClick={onSave}
                disabled={isLoading}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <Save className="h-3 w-3 mr-1" />
                {saveText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};