import { useState } from "react";
import { Plus, X, Upload, Users, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const SR_TYPES = [
  "Customer Service",
  "Sales",
  "Rental",
  "Receiving",
  "To Factory",
  "Lab",
  "QA",
  "Metrology",
  "Pricing/Quoting",
  "A/R",
  "Delivery",
  "Shipping",
];

type Acct = { acct: string; customer: string };

interface NewSrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (sr: string) => void;
}

export default function NewSrDialog({ open, onOpenChange, onCreated }: NewSrDialogProps) {
  const { toast } = useToast();
  const [type, setType] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [instructions, setInstructions] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [description, setDescription] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [accts, setAccts] = useState<Acct[]>([]);
  const [acct, setAcct] = useState("");
  const [customer, setCustomer] = useState("");

  const reset = () => {
    setType("");
    setRequestedBy("");
    setSubmittedBy("");
    setInstructions("");
    setReviewDate("");
    setDescription("");
    setPdfName("");
    setAccts([]);
    setAcct("");
    setCustomer("");
  };

  const addAcct = () => {
    if (!acct.trim()) return;
    if (accts.some((a) => a.acct === acct.trim())) {
      toast({ title: "Duplicate account", description: `${acct} is already linked.` });
      return;
    }
    setAccts((p) => [...p, { acct: acct.trim(), customer: customer.trim() || "—" }]);
    setAcct("");
    setCustomer("");
  };

  const handleCreate = () => {
    if (!type || !instructions.trim()) {
      toast({
        title: "Missing required fields",
        description: "Type and Instructions are required.",
        variant: "destructive",
      });
      return;
    }
    const sr = `SR${Math.floor(1000 + Math.random() * 8999)}`;
    toast({ title: "SR document created", description: `${sr} has been created.` });
    reset();
    onOpenChange(false);
    onCreated?.(sr);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Add New SR Document</DialogTitle>
          <DialogDescription className="text-xs">
            Enter the first instruction, linked accounts and PDF for this special
            requirements document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instruction */}
          <div className="rounded-md border p-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Instruction
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">
                  Type(s) <span className="text-destructive">*</span>
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {SR_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">
                  Requested By
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">
                  Submitted By
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">
                Instructions <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={4}
                className="text-xs resize-none"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Type the special requirement..."
              />
            </div>
            <div className="space-y-1 max-w-[200px]">
              <Label className="text-[11px] font-medium text-muted-foreground">
                Review Date
              </Label>
              <Input
                className="h-8 text-xs"
                placeholder="MM/DD/YYYY"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
              />
            </div>
          </div>

          {/* Accounts */}
          <div className="rounded-md border p-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />Accounts
              <Badge variant="secondary" className="h-4 text-[10px]">
                {accts.length}
              </Badge>
            </p>
            <div className="flex items-end gap-2">
              <div className="space-y-1 w-40">
                <Label className="text-[11px] font-medium text-muted-foreground">Acct #</Label>
                <Input
                  className="h-8 text-xs"
                  value={acct}
                  onChange={(e) => setAcct(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAcct()}
                  placeholder="0540.00"
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-[11px] font-medium text-muted-foreground">Customer</Label>
                <Input
                  className="h-8 text-xs"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAcct()}
                  placeholder="Customer name"
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={addAcct}>
                <Plus className="h-3.5 w-3.5 mr-1" />Add
              </Button>
            </div>
            {accts.length > 0 && (
              <div className="rounded-md border divide-y">
                {accts.map((a) => (
                  <div
                    key={a.acct}
                    className="group flex items-center gap-2 px-2 py-1.5 text-xs"
                  >
                    <span className="font-medium w-24 shrink-0">{a.acct}</span>
                    <span className="text-muted-foreground truncate flex-1">{a.customer}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-destructive"
                      onClick={() => setAccts((p) => p.filter((x) => x.acct !== a.acct))}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PDF */}
          <div className="rounded-md border p-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />PDF
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">
                  Description
                </Label>
                <Input
                  className="h-8 text-xs"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground">PDF</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="h-8 text-xs"
                    readOnly
                    value={pdfName}
                    placeholder="No file selected"
                  />
                  <label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setPdfName(e.target.files?.[0]?.name ?? "")}
                    />
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <span>
                        <Upload className="h-3.5 w-3.5 mr-1" />Select PDF
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
            onClick={handleCreate}
          >
            Create SR Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
