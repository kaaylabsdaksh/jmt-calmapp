import { useRef, useState } from "react";
import { FileText, Paperclip, Trash2, Upload, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DATASHEET_TEMPLATES = [
  "Standard Calibration Datasheet",
  "Pressure Gauge Datasheet",
  "Electrical Multi-Point Datasheet",
  "Temperature Datasheet",
  "Dimensional Datasheet",
];

const FILE_STATUSES = ["Active", "Inactive"];

type SupplementalFile = {
  id: string;
  description: string;
  status: string;
  fileName: string;
  addedOn: string;
};

const INITIAL_FILES: SupplementalFile[] = [];

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  action,
  children,
}: {
  icon: typeof Paperclip;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <div>
              <div className="text-xs font-semibold tracking-tight">{title}</div>
              {subtitle && (
                <div className="text-[10px] text-muted-foreground">{subtitle}</div>
              )}
            </div>
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function FilePickerField({
  label,
  value,
  onPick,
  onClear,
  required,
}: {
  label: string;
  value: string;
  onPick: (name: string) => void;
  onClear: () => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1">
      <FieldLabel label={label} required={required} />
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Input
            readOnly
            value={value}
            placeholder="No file selected"
            className={cn("h-8 text-xs pr-7 cursor-pointer", value && "text-foreground")}
            onClick={() => inputRef.current?.click()}
          />
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs shrink-0"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          Browse
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f.name);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export function ProductFilesTab() {
  const [datasheet, setDatasheet] = useState<string>("");
  const [procedure, setProcedure] = useState("");
  const [files, setFiles] = useState<SupplementalFile[]>(INITIAL_FILES);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [upload, setUpload] = useState("");

  const resetForm = () => {
    setStatus("Active");
    setDescription("");
    setUpload("");
    setEditingId(null);
  };

  const startEdit = (f: SupplementalFile) => {
    setEditingId(f.id);
    setStatus(f.status);
    setDescription(f.description);
    setUpload(f.fileName);
  };

  const handleAdd = () => {
    if (!description.trim() || !upload) {
      toast({
        title: "Missing information",
        description: "Add a description and choose a file before saving.",
        variant: "destructive",
      });
      return;
    }
    if (editingId) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === editingId
            ? { ...f, description: description.trim(), status, fileName: upload }
            : f,
        ),
      );
      toast({ title: "File updated", description: description.trim() });
    } else {
      setFiles((prev) => [
        {
          id: `sdf-${Date.now()}`,
          description: description.trim(),
          status,
          fileName: upload,
          addedOn: new Date().toLocaleDateString("en-US"),
        },
        ...prev,
      ]);
      toast({ title: "File added", description: description.trim() });
    }
    resetForm();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
      <div className="xl:col-span-2 space-y-4">
        <SectionCard
          icon={Paperclip}
          title="Supplemental Data Files"
          subtitle={`${files.length} file${files.length === 1 ? "" : "s"} attached`}
        >
          {(
            <div className="mb-3 rounded-md border bg-muted/30 p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <FieldLabel label="Status" />
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FILE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <FieldLabel label="Description" required />
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Manufacturer specification sheet"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="sm:col-span-3">
                  <FilePickerField
                    label="Upload File"
                    value={upload}
                    required
                    onPick={setUpload}
                    onClear={() => setUpload("")}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t pt-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAdd}
                >
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                  <th className="text-left font-medium px-3 py-2">Description</th>
                  <th className="text-left font-medium px-3 py-2 w-28">Status</th>
                  <th className="text-left font-medium px-3 py-2">File</th>
                  <th className="text-left font-medium px-3 py-2 w-28">Added</th>
                  <th className="px-3 py-2 w-16" />
                </tr>
              </thead>
              <tbody>
                {files.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center">
                      <Paperclip className="h-5 w-5 mx-auto mb-2 text-muted-foreground/50" />
                      <div className="text-[11px] text-muted-foreground">
                        No supplemental data files yet.
                      </div>
                    </td>
                  </tr>
                )}
                {files.map((f) => (
                  <tr key={f.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2">{f.description}</td>
                    <td className="px-3 py-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-medium rounded-full px-2 py-0 gap-1 hover:bg-transparent",
                          f.status === "Active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-600",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            f.status === "Active" ? "bg-emerald-500" : "bg-slate-400",
                          )}
                        />
                        {f.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1.5 text-slate-700">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        {f.fileName}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{f.addedOn}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[11px]"
                          onClick={() => startEdit(f)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toast({ title: "Downloading", description: f.fileName })}
                        >
                          <Download className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setFiles((prev) => prev.filter((x) => x.id !== f.id));
                            toast({ title: "File removed", description: f.description });
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default ProductFilesTab;
