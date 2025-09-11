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
        <div className="px-6 py-4">
          {/* Minimal Footer - Only Cancel and Save */}
          <div className="flex justify-end items-center gap-3">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium"
            >
              <X className="h-4 w-4 mr-2" />
              {cancelText}
            </Button>
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
      </div>
    </>
  );
};