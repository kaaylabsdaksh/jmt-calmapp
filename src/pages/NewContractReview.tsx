import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckCircle2, ChevronDown, FileText, Mail, Plus, Save, Trash2, Upload, Users } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const DOCUMENT_TYPES = ["MSA", "NDA", "Service Agreement", "Pricing Agreement", "Contract Document", "Other"];
const YES_NO = ["Yes", "No"];
const CONTRACT_PURPOSES = ["ESL", "Lab", "Onsite", "Lab / Onsite", "Other"];
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
  const [purposes, setPurposes] = useState<string[]>([]);
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
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [invoicingInstructions, setInvoicingInstructions] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [sageNotes, setSageNotes] = useState("");
  const [srFormUpdated, setSrFormUpdated] = useState("");
  const [noSrUpdate, setNoSrUpdate] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [createAction, setCreateAction] = useState<"create" | "complete" | "contracts">("create");

  const field = "h-8 text-xs";
  const label = "text-[11px] font-medium text-foreground";
  const invalid = !documentType || !submittedBy.trim() || !howReceived || !receivedDate || !reviewCompleted;
  const addAccount = () => setAccounts((current) => current.length ? current : [{ id: "a1", account: "0121.157", customer: "Entergy Texas", sr: "SR1786" }]);
  const addFiles = (files: FileList | null) => {
    if (!files || !uploadType) {
      toast({ title: "Select a document type first", variant: "destructive" });
      return;
    }
    setDocuments((current) => [...current, ...Array.from(files).map((file, index) => ({ id: `${Date.now()}-${index}`, name: file.name, type: uploadType, description: uploadDescription }))]);
    setUploadDescription("");
  };
  const requestCreate = (action: "create" | "complete" | "contracts" = "create") => {
    setSubmitted(true);
    if (invalid) {
      toast({ title: "Complete required review details", description: "Document type, submitted by, received method, contract received date, and Review Completed are required.", variant: "destructive" });
      return;
    }
    setCreateAction(action);
    setConfirmationOpen(true);
  };
  const confirmCreate = () => {
    const reviewId = "315";
    setConfirmationOpen(false);
    const title = createAction === "complete" ? "Contract review completed" : createAction === "contracts" ? "Contract review added to contracts" : "Contract review created";
    toast({ title, description: `Contract Review #${reviewId} is ready for editing.` });
    navigate(`/manage-customers/contract-reviews/${reviewId}`);
  };
  const actionLabel = createAction === "complete" ? "Complete CR" : createAction === "contracts" ? "Add to Contracts" : "Create Contract Review";
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
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><div><Label className={label}>Effective Date</Label><ModernDatePicker value={effectiveDate} onChange={setEffectiveDate} size="sm" /></div><div><Label className={label}>Term Date</Label><ModernDatePicker value={termDate} onChange={setTermDate} size="sm" /></div><div><Label className={label}>Purpose(s)</Label><Popover><PopoverTrigger asChild><Button variant="outline" className={`${field} w-full justify-between px-3 font-normal`}><span className="truncate">{purposes.length ? purposes.join(", ") : "Select purposes"}</span><ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" /></Button></PopoverTrigger><PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1" align="start"><div className="flex items-center justify-between border-b px-2 py-1.5"><span className="text-[11px] font-medium">Purpose(s)</span><div className="flex gap-2"><button type="button" className="text-[10px] text-foreground underline" onClick={() => setPurposes(CONTRACT_PURPOSES)}>Select all</button><button type="button" className="text-[10px] text-muted-foreground underline" onClick={() => setPurposes([])}>Clear</button></div></div>{CONTRACT_PURPOSES.map((item) => <label key={item} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs hover:bg-muted"><Checkbox checked={purposes.includes(item)} onCheckedChange={(checked) => setPurposes((current) => checked === true ? [...current, item] : current.filter((value) => value !== item))} />{item}</label>)}</PopoverContent></Popover></div><div><Label className={label}>Contract Number</Label><Input value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} className={field} /></div></div>
            <div className="grid gap-2 lg:grid-cols-3"><div><Label className={label}>Important Notes</Label><Textarea value={importantNotes} onChange={(e) => setImportantNotes(e.target.value)} rows={3} className="text-xs" /></div><div><Label className={label}>Insurance Requirements</Label><Textarea value={insurance} onChange={(e) => setInsurance(e.target.value)} rows={3} className="text-xs" /></div><div><Label className={label}>Safety Requirements</Label><Textarea value={safety} onChange={(e) => setSafety(e.target.value)} rows={3} className="text-xs" /></div></div>
            <div className="grid gap-2 border-t pt-2 sm:grid-cols-2 lg:grid-cols-4"><div><Label className={label}>Confidentiality Agreement</Label><Select value={confidentiality} onValueChange={setConfidentiality}><SelectTrigger className={field}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{YES_NO.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div><Label className={label}>Record Retention</Label><Select value={recordRetention} onValueChange={setRecordRetention}><SelectTrigger className={field}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{YES_NO.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div><Label className={label}>JM Executive</Label><Input value={executive} onChange={(e) => setExecutive(e.target.value)} className={field} /></div><div><Label className={label}>Executive Copy Received</Label><ModernDatePicker value={executiveDate} onChange={setExecutiveDate} size="sm" /></div><div><Label className={label}>Customer Copy Received</Label><ModernDatePicker value={customerDate} onChange={setCustomerDate} size="sm" /></div><label className="flex items-end gap-2 pb-1.5 text-xs"><Checkbox checked={requiresCdr} onCheckedChange={(v) => setRequiresCdr(v === true)} />Requires Customer Document Review</label><div><label className="flex items-center gap-2 text-xs font-medium"><Checkbox checked={reviewCompleted} onCheckedChange={(v) => setReviewCompleted(v === true)} aria-required="true" />Review Completed <span className="text-destructive">*</span></label>{submitted && !reviewCompleted && <p className="mt-1 text-[10px] text-destructive">Required</p>}</div></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(CheckCircle2, "Completion & Invoicing")}</CardHeader>
          <CardContent className="space-y-2 px-3 pb-3">
            <p className="text-[10px] text-muted-foreground">Complete invoicing instructions and payment terms before sending to the AR Manager.</p>
            <div className="grid gap-2 md:grid-cols-2"><div><Label className={label}>Invoicing Instructions</Label><Textarea value={invoicingInstructions} onChange={(e) => setInvoicingInstructions(e.target.value)} rows={2} maxLength={1000} className="min-h-14 text-xs" /></div><div><Label className={label}>Payment Terms</Label><Textarea value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} rows={2} maxLength={500} className="min-h-14 text-xs" /></div></div>
            <div className="grid items-end gap-2 border-t pt-2 sm:grid-cols-2 lg:grid-cols-4"><div><Label className={label}>Added Notes to Sage</Label><Select value={sageNotes} onValueChange={setSageNotes}><SelectTrigger className={field}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{YES_NO.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div><Label className={label}>SR Form Updated / Created</Label><Select value={srFormUpdated} onValueChange={setSrFormUpdated} disabled={noSrUpdate}><SelectTrigger className={field}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{YES_NO.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><label className="flex h-8 items-center gap-2 text-xs"><Checkbox checked={noSrUpdate} onCheckedChange={(value) => { setNoSrUpdate(value === true); if (value === true) setSrFormUpdated(""); }} />No SR Update Needed</label><Button variant="outline" size="sm" className="h-8 text-xs" disabled={!invoicingInstructions.trim() || !paymentTerms.trim()} onClick={() => toast({ title: "Email prepared", description: "Invoicing details are ready to send to the AR Manager." })}><Mail className="mr-1.5 h-3.5 w-3.5" />Email AR Manager</Button></div>
          </CardContent>
        </Card>

        <Card><CardHeader className="px-3 pb-1 pt-2">{sectionTitle(Upload, "Documents")}</CardHeader><CardContent className="space-y-2 px-3 pb-3"><div className="grid gap-2 lg:grid-cols-[220px_1fr_280px]"><Select value={uploadType} onValueChange={setUploadType}><SelectTrigger className={field}><SelectValue placeholder="Document type" /></SelectTrigger><SelectContent>{DOCUMENT_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Input value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} placeholder="Description" className={field} /><label className="flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-xs hover:bg-muted"><Upload className="h-3.5 w-3.5" />Select files<input type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} /></label></div><div className="overflow-hidden rounded-md border"><Table><TableHeader><TableRow className="bg-muted/60"><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="w-10" /></TableRow></TableHeader><TableBody>{documents.length ? documents.map((doc) => <TableRow key={doc.id}><TableCell className="py-1.5 text-xs font-medium">{doc.name}</TableCell><TableCell className="py-1.5 text-xs">{doc.type}</TableCell><TableCell className="py-1.5 text-xs">{doc.description || "—"}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDocuments((current) => current.filter((item) => item.id !== doc.id))}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="h-14 text-center text-xs text-muted-foreground">No documents added</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>
      </main>

      <footer className="sticky bottom-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur"><div className="mx-auto flex max-w-[1450px] flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-customers/contract-reviews")}>Cancel CR</Button><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => requestCreate("complete")}><Check className="mr-1.5 h-3.5 w-3.5" />Complete CR</Button><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => requestCreate("contracts")}><Plus className="mr-1.5 h-3.5 w-3.5" />Add to Contracts</Button></div><Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={() => requestCreate("create")}><Save className="mr-1.5 h-3.5 w-3.5" />Create Contract Review</Button></div></footer>

      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}><AlertDialogContent className="max-w-md gap-0 p-0"><AlertDialogHeader className="border-b px-5 py-4"><AlertDialogTitle className="flex items-center gap-2 text-base"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success"><FileText className="h-4 w-4" /></span>{actionLabel}?</AlertDialogTitle><AlertDialogDescription className="text-xs">Confirm the submission details before continuing.</AlertDialogDescription></AlertDialogHeader><div className="grid grid-cols-2 gap-3 px-5 py-4 text-xs"><div><p className="text-muted-foreground">Document Type</p><p className="mt-0.5 font-medium text-foreground">{documentType}</p></div><div><p className="text-muted-foreground">Submitted By</p><p className="mt-0.5 font-medium text-foreground">{submittedBy}</p></div><div><p className="text-muted-foreground">How Received</p><p className="mt-0.5 font-medium text-foreground">{howReceived}</p></div><div><p className="text-muted-foreground">Accounts</p><p className="mt-0.5 font-medium text-foreground">{accounts.length || "None"}</p></div></div><AlertDialogFooter className="border-t bg-muted/30 px-5 py-3"><AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel><AlertDialogAction className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={confirmCreate}><Check className="mr-1.5 h-3.5 w-3.5" />{actionLabel}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}