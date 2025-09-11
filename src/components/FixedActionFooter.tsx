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
      <div className="h-28" />
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-[256px] right-0 bg-background border-t border-border shadow-lg z-[100]">
        <div className="px-6 py-4 space-y-4">
          {/* First Row - Main Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              variant="secondary" 
              onClick={handleCopyAsNew}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy as New
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handlePrintWO}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print WO
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleLabel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium"
            >
              <Tag className="h-4 w-4 mr-2" />
              Label
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleSticker}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Sticker
            </Button>

            {/* Right aligned buttons */}
            <div className="ml-auto flex items-center gap-3">
              <Button 
                onClick={onSave}
                disabled={isLoading}
                className="bg-success text-success-foreground hover:bg-success/90 px-6 py-2 text-sm font-medium shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveText}
              </Button>
            </div>
          </div>

          {/* Second Row - Print and Move Actions */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Print Tags with dropdown */}
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                onClick={handlePrintTags}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium"
              >
                <Tag className="h-4 w-4 mr-2" />
                Print Tags
              </Button>
              <Select value={numTags} onValueChange={setNumTags}>
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,10,20,50].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">of tags:</span>
            </div>

            <Button 
              variant="secondary" 
              onClick={handlePrintQRSheet}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Print QR Sheet
            </Button>

            {/* Move to New Work Order */}
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                onClick={handleMoveToNewWO}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium"
              >
                <Package className="h-4 w-4 mr-2" />
                Move To New Work Order
              </Button>
              <span className="text-sm text-muted-foreground">using Acct Num:</span>
              <Input 
                value={acctNum}
                onChange={(e) => setAcctNum(e.target.value)}
                className="w-32 h-9"
                placeholder="Account #"
              />
            </div>

            {/* Move to Existing Work Order */}
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                onClick={handleMoveToExistingWO}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium"
              >
                <Package className="h-4 w-4 mr-2" />
                Move To Existing Work Order
              </Button>
              <span className="text-sm text-muted-foreground">to W.O. #:</span>
              <Input 
                value={woNum}
                onChange={(e) => setWoNum(e.target.value)}
                className="w-32 h-9"
                placeholder="WO #"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};