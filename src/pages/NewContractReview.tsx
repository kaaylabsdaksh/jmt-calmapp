import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, FileText, Plus, Save, Trash2, Upload, Users } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const DOCUMENT_TYPES = ["MSA", "NDA", "Service Agreement", "Pricing Agreement", "Contract Document", "Other"];
const YES_NO = ["Yes", "No"];
type Account = { id: string; account: string; customer: string; sr: string };
type DocumentRow = { id: string; name: string; type: string; description: string };

export default function NewContractReview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [howReceived, setHowReceived] = useState("");
  const [receivedDate, setReceivedDate] = useState<Date>();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contactFirst, setContactFirst] = useState("");
  const [contactLast, setContactLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [defaultLabOnsite, setDefaultLabOnsite] = useState(false);
  const [esl, setEsl] = useState(false);
  const [odessa, setOdessa] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState<Date>();
  const [termDate, setTermDate] = useState<Date>();
  const [purposes, setPurposes] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [importantNotes, setImportantNotes] = useState("");
  const [insurance, setInsurance] = useState("");
  const [safety, setSafety] = useState("");
  const [confidentiality, setConfidentiality] = useState("");
  const [recordRetention, setRecordRetention] = useState("");
  const [executive, setExecutive] = useState("");
  const [executiveDate, setExecutiveDate] = useState<Date>();
  const [customerDate, setCustomerDate] = useState<Date>();
  const [requiresCdr, setRequiresCdr] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const field = "h-8 text-xs";
  const label = "text-[11px] font-medium text-foreground";
  const invalid = !documentType || !submittedBy.trim() || !howReceived || !receivedDate;
  const addAccount = () => setAccounts((current) => current.length ? current : [{ id: "a1", account: "0121.157", customer: "Entergy Texas", sr: "SR1786" }]);
  const addFiles = (files: FileList | null) => {
    if (!files || !uploadType) {
      toast({ title: "Select a document type first", variant: "destructive" });
      return;
    }
    setDocuments((current) => [...current, ...Array.from(files).map((file, index) => ({ id: `${Date.now()}-${index}`, name: file.name, type: uploadType, description: uploadDescription }))]);
    setUploadDescription("");
  };
  const requestCreate = () => {
    setSubmitted(true);
    if (invalid) {
      toast({ title: "Complete required review details", description: "Document type, submitted by, received method and contract received date are required.", variant: "destructive" });
      return;
    }
    setConfirmationOpen(true);
  };
  const confirmCreate = () => {
    const reviewId = "315";
    setConfirmationOpen(false);
    toast({ title: "Contract review created", description: `Contract Review #${reviewId} is ready for editing.` });
    navigate(`/manage-customers/contract-reviews/${reviewId}`);
  };
  const sectionTitle = (Icon: typeof FileText, title: string) => <CardTitle className="flex items-center gap-2 text-sm"><Icon className="h-4 w-4 text-muted-foreground" />{title}</CardTitle>;

  return (
    <div className="min-h-screen bg-muted/30">
      <ModernTopNav />
      <main className="mx-auto max-w-[1450px] space-y-3 px-3 pb-24 pt-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 border-b pb-3">
          <div><h1 className="text-lg font-semibold text-foreground">Add New Contract Review</h1><p className="text-xs text-muted-foreground">Enter submission, customer, contract requirements and supporting documents.</p></div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />Created</span>
        </div>

        <Card>
          <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(FileText, "Review Submission")}</CardHeader>
          <CardContent className="grid gap-2 px-3 pb-3 sm:grid-cols-2 lg:grid-cols-4">
            <div><Label className={label}>Status</Label><Input value="Created" readOnly className={`${field} bg-muted`} /></div>
            <div><Label className={label}>Document Type <span className="text-destructive">*</span></Label><Select value={documentType} onValueChange={setDocumentType}><SelectTrigger className={field}><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{DOCUMENT_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>{submitted && !documentType && <p className="text-[10px] text-destructive">Required</p>}</div>
            <div><Label className={label}>Submitted By <span className="text-destructive">*</span></Label><Input value={submittedBy} onChange={(event) => setSubmittedBy(event.target.value)} className={field} />{submitted && !submittedBy.trim() && <p className="text-[10px] text-destructive">Required</p>}</div>
            <div><Label className={label}>How Received <span className="text-destructive">*</span></Label><Select value={howReceived} onValueChange={setHowReceived}><SelectTrigger className={field}><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent>{["Email", "Mail", "Fax", "Portal", "In Person"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className={label}>Contract Received <span className="text-destructive">*</span></Label><ModernDatePicker value={receivedDate} onChange={setReceivedDate} size="sm" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(Users, "Customer Accounts & Contact")}</CardHeader>
          <CardContent className="space-y-2 px-3 pb-3">
            <div className="overflow-hidden rounded-md border"><Table><TableHeader><TableRow className="bg-muted/60"><TableHead>Account</TableHead><TableHead>Customer</TableHead><TableHead>SR Document</TableHead><TableHead className="w-10" /></TableRow></TableHeader><TableBody>{accounts.length ? accounts.map((account) => <TableRow key={account.id}><TableCell className="py-1.5 text-xs font-medium">{account.account}</TableCell><TableCell className="py-1.5 text-xs">{account.customer}</TableCell><TableCell className="py-1.5 text-xs">{account.sr}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAccounts([])}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="h-14 text-center text-xs text-muted-foreground">No customer accounts selected</TableCell></TableRow>}</TableBody></Table></div>
            <div className="flex justify-end"><Button variant="outline" size="sm" className="h-7 text-xs" onClick={addAccount}><Plus className="mr-1 h-3.5 w-3.5" />Add / Remove Accounts</Button></div>
            <div className="grid gap-2 border-t pt-2 sm:grid-cols-2 lg:grid-cols-4"><div><Label className={label}>Contact First</Label><Input value={contactFirst} onChange={(e) => setContactFirst(e.target.value)} className={field} /></div><div><Label className={label}>Contact Last</Label><Input value={contactLast} onChange={(e) => setContactLast(e.target.value)} className={field} /></div><div><Label className={label}>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className={field} /></div><div><Label className={label}>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} className={field} /></div></div>
          </CardContent>
        </Card>

        <Card><CardHeader className="px-3 pb-1 pt-2"><CardTitle className="text-sm">Business Rules</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-5 px-3 pb-3"><label className="flex items-center gap-2 text-xs"><Checkbox checked={defaultLabOnsite} onCheckedChange={(v) => setDefaultLabOnsite(v === true)} />Default Lab / Onsite</label><label className="flex items-center gap-2 text-xs"><Checkbox checked={esl} onCheckedChange={(v) => setEsl(v === true)} />ESL</label><label className="flex items-center gap-2 text-xs"><Checkbox checked={odessa} onCheckedChange={(v) => setOdessa(v === true)} />Odessa</label></CardContent></Card>

        <Card>
          <CardHeader className="px-3 pb-1 pt-2"><CardTitle className="text-sm">Contract Terms & Requirements</CardTitle></CardHeader>
          <CardContent className="space-y-2 px-3 pb-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><div><Label className={label}>Effective Date</Label><ModernDatePicker value={effectiveDate} onChange={setEffectiveDate} size="sm" /></div><div><Label className={label}>Term Date</Label><ModernDatePicker value={termDate} onChange={setTermDate} size="sm" /></div><div><Label className={label}>Purpose(s)</Label><Input value={purposes} onChange={(e) => setPurposes(e.target.value)} className={field} /></div><div><Label className={label}>Contract Number</Label><Input value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} className={field} /></div></div>
            <div className="grid gap-2 lg:grid-cols-3"><div><Label className={label}>Important Notes</Label><Textarea value={importantNotes} onChange={(e) => setImportantNotes(e.target.value)} rows={3} className="text-xs" /></div><div><Label className={label}>Insurance Requirements</Label><Textarea value={insurance} onChange={(e) => setInsurance(e.target.value)} rows={3} className="text-xs" /></div><div><Label className={label}>Safety Requirements</Label><Textarea value={safety} onChange={(e) => setSafety(e.target.value)} rows={3} className="text-xs" /></div></div>
            <div className="grid gap-2 border-t pt-2 sm:grid-cols-2 lg:grid-cols-4"><div><Label className={label}>Confidentiality Agreement</Label><Select value={confidentiality} onValueChange={setConfidentiality}><SelectTrigger className={field}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{YES_NO.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div><Label className={label}>Record Retention</Label><Select value={recordRetention} onValueChange={setRecordRetention}><SelectTrigger className={field}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{YES_NO.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div><Label className={label}>JM Executive</Label><Input value={executive} onChange={(e) => setExecutive(e.target.value)} className={field} /></div><div><Label className={label}>Executive Copy Received</Label><ModernDatePicker value={executiveDate} onChange={setExecutiveDate} size="sm" /></div><div><Label className={label}>Customer Copy Received</Label><ModernDatePicker value={customerDate} onChange={setCustomerDate} size="sm" /></div><label className="flex items-end gap-2 pb-1.5 text-xs"><Checkbox checked={requiresCdr} onCheckedChange={(v) => setRequiresCdr(v === true)} />Requires Customer Document Review</label></div>
          </CardContent>
        </Card>

        <Card><CardHeader className="px-3 pb-1 pt-2">{sectionTitle(Upload, "Documents")}</CardHeader><CardContent className="space-y-2 px-3 pb-3"><div className="grid gap-2 lg:grid-cols-[220px_1fr_280px]"><Select value={uploadType} onValueChange={setUploadType}><SelectTrigger className={field}><SelectValue placeholder="Document type" /></SelectTrigger><SelectContent>{DOCUMENT_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Input value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} placeholder="Description" className={field} /><label className="flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-xs hover:bg-muted"><Upload className="h-3.5 w-3.5" />Select files<input type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} /></label></div><div className="overflow-hidden rounded-md border"><Table><TableHeader><TableRow className="bg-muted/60"><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="w-10" /></TableRow></TableHeader><TableBody>{documents.length ? documents.map((doc) => <TableRow key={doc.id}><TableCell className="py-1.5 text-xs font-medium">{doc.name}</TableCell><TableCell className="py-1.5 text-xs">{doc.type}</TableCell><TableCell className="py-1.5 text-xs">{doc.description || "—"}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDocuments((current) => current.filter((item) => item.id !== doc.id))}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="h-14 text-center text-xs text-muted-foreground">No documents added</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>
      </main>

      <footer className="sticky bottom-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur"><div className="mx-auto flex max-w-[1450px] justify-end gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-customers/contract-reviews")}>Cancel</Button><Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={requestCreate}><Save className="mr-1.5 h-3.5 w-3.5" />Create Contract Review</Button></div></footer>

      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}><AlertDialogContent className="max-w-md gap-0 p-0"><AlertDialogHeader className="border-b px-5 py-4"><AlertDialogTitle className="flex items-center gap-2 text-base"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success"><FileText className="h-4 w-4" /></span>Create this contract review?</AlertDialogTitle><AlertDialogDescription className="text-xs">Confirm the submission details before creating the review.</AlertDialogDescription></AlertDialogHeader><div className="grid grid-cols-2 gap-3 px-5 py-4 text-xs"><div><p className="text-muted-foreground">Document Type</p><p className="mt-0.5 font-medium text-foreground">{documentType}</p></div><div><p className="text-muted-foreground">Submitted By</p><p className="mt-0.5 font-medium text-foreground">{submittedBy}</p></div><div><p className="text-muted-foreground">How Received</p><p className="mt-0.5 font-medium text-foreground">{howReceived}</p></div><div><p className="text-muted-foreground">Accounts</p><p className="mt-0.5 font-medium text-foreground">{accounts.length || "None"}</p></div></div><AlertDialogFooter className="border-t bg-muted/30 px-5 py-3"><AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel><AlertDialogAction className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={confirmCreate}><Check className="mr-1.5 h-3.5 w-3.5" />Create Contract Review</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}