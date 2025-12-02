import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExternalFilesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const docTypes = [
  "Certificate",
  "Report",
  "Invoice",
  "Purchase Order",
  "Calibration Data",
  "Test Results",
];

const docTags = [
  "Customer Approval",
  "Customer ID List",
  "Customer Notes",
  "Emails",
  "Equipment Submission Form",
  "Equipment Tag",
  "Safety Data Sheet",
  "Work Instructions",
];

const items = ["001", "002", "003", "004", "005", "006"];

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  tags: string[];
  items: string[];
  uploadedBy: string;
  uploadedDate: string;
}

export function ExternalFilesDialog({ open, onOpenChange }: ExternalFilesDialogProps) {
  const [docType, setDocType] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const isEnabled = !!docType;

  const handleItemToggle = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSelectAllItems = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...items]);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !isEnabled) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      type: docType,
      tags: [...selectedTags],
      items: [...selectedItems],
      uploadedBy: "Current User",
      uploadedDate: new Date().toLocaleDateString(),
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEnabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleClose = () => {
    setDocType("");
    setSelectedItems([]);
    setSelectedTags([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">External Files</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Doc Type & Items */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1">
                  Doc Type <span className="text-destructive">*</span>
                </Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select doc type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {docTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={cn("space-y-1.5", !isEnabled && "opacity-50")}>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Item(s)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={handleSelectAllItems}
                    disabled={!isEnabled}
                  >
                    {selectedItems.length === items.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <ScrollArea className="h-28 border rounded-md bg-background p-2">
                  <div className="space-y-1">
                    {items.map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox
                          id={`item-${item}`}
                          checked={selectedItems.includes(item)}
                          onCheckedChange={() => handleItemToggle(item)}
                          disabled={!isEnabled}
                        />
                        <label
                          htmlFor={`item-${item}`}
                          className="text-xs cursor-pointer"
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <p className="text-[10px] text-muted-foreground">
                  For Batch level, DO NOT select any items.
                </p>
              </div>
            </div>

            {/* Doc Tags */}
            <div className={cn("space-y-1.5", !isEnabled && "opacity-50")}>
              <Label className="text-xs font-medium">Doc Tag(s)</Label>
              <ScrollArea className="h-40 border rounded-md bg-background p-2">
                <div className="space-y-1">
                  {docTags.map(tag => (
                    <div key={tag} className="flex items-center gap-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                        disabled={!isEnabled}
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className="text-xs cursor-pointer"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* File Upload */}
            <div className={cn("space-y-1.5", !isEnabled && "opacity-50")}>
              <Label className="text-xs font-medium">Upload Files</Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-md h-40 flex flex-col items-center justify-center gap-2 transition-colors",
                  isDragging && isEnabled ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                  !isEnabled && "cursor-not-allowed"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">
                  Drag file(s) here
                </p>
                <span className="text-xs text-muted-foreground">or</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={!isEnabled}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Select Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  disabled={!isEnabled}
                />
              </div>
            </div>
          </div>

          {/* Validation Message */}
          {!isEnabled && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>Please select a Doc Type to enable file upload</span>
            </div>
          )}

          {/* Files Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-medium w-16">Item</TableHead>
                  <TableHead className="text-xs font-medium">External File</TableHead>
                  <TableHead className="text-xs font-medium w-24">Type</TableHead>
                  <TableHead className="text-xs font-medium">Tag(s)</TableHead>
                  <TableHead className="text-xs font-medium w-20">Item(s)</TableHead>
                  <TableHead className="text-xs font-medium w-24">Uploaded By</TableHead>
                  <TableHead className="text-xs font-medium w-28">Uploaded Date</TableHead>
                  <TableHead className="text-xs font-medium w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadedFiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-xs text-muted-foreground py-8">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      No files uploaded
                    </TableCell>
                  </TableRow>
                ) : (
                  uploadedFiles.map((file, index) => (
                    <TableRow key={file.id}>
                      <TableCell className="text-xs">{index + 1}</TableCell>
                      <TableCell className="text-xs font-medium">{file.name}</TableCell>
                      <TableCell className="text-xs">{file.type}</TableCell>
                      <TableCell className="text-xs">
                        {file.tags.length > 0 ? file.tags.join(", ") : "-"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {file.items.length > 0 ? file.items.join(", ") : "Batch"}
                      </TableCell>
                      <TableCell className="text-xs">{file.uploadedBy}</TableCell>
                      <TableCell className="text-xs">{file.uploadedDate}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRemoveFile(file.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
