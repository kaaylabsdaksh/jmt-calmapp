import { Button } from "@/components/ui/button";

interface Props {
  onCancel?: () => void;
  onSave?: () => void;
  saveLabel?: string;
}

export const EslActionFooter = ({ onCancel, onSave, saveLabel = "Save" }: Props) => (
  <div className="sticky bottom-0 left-0 right-0 bg-background border-t px-6 py-3 flex items-center justify-end gap-2 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
    <Button variant="outline" onClick={onCancel}>Cancel</Button>
    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onSave}>
      {saveLabel}
    </Button>
  </div>
);
