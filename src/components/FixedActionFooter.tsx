import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Save } from 'lucide-react';

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
  saveText = "Save Work Order",
  cancelText = "Cancel",
  isLoading = false 
}: FixedActionFooterProps) => {
  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-[256px] right-0 bg-background border-t border-border shadow-lg z-[100]">
        <div className="px-6 py-4">
          <div className="flex justify-end items-center gap-3">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium border-border hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              {cancelText}
            </Button>
            <Button 
              onClick={onSave}
              disabled={isLoading}
              className="bg-success text-success-foreground hover:bg-success/90 px-6 py-2 text-sm font-medium shadow-sm transition-colors"
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