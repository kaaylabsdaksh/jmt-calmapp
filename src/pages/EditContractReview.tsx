import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, FileText, Mail, MessageSquare, Plus, Save, Trash2, Upload, Users } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
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

const documentTypes = ["MSA", "NDA", "Service Agreement", "Pricing Agreement", "Contract Document", "Other"];
const commentTypes = ["Other", "Internal", "Customer", "Legal", "Finance"];

type Doc = { id: string; name: string; type: string; description: string };
type Activity = { id: string; by: string; date: string; type: string; comment: string };

const initialActivity: Activity[] = [
  { id: "1", by: "Theresa B Deshotel", date: "05/22/2019 03:11 PM", type: "Other", comment: "AR Manager email sent to brandymulkey@jmtest.com." },
  { id: "2", by: "Theresa B Deshotel", date: "05/22/2019 03:07 PM", type: "Other", comment: "REVIEW COMPLETED" },
  { id: "3", by: "Theresa B Deshotel", date: "05/22/2019 03:07 PM", type: "Other", comment: "PDF ADDED: Contract order" },
  { id: "4", by: "Theresa B Deshotel", date: "03/22/2019 11:37 AM", type: "Other", comment: "ACCOUNT(S) ADDED: 0121.160" },
  { id: "5", by: "Theresa B Deshotel", date: "02/21/2019 12:18 PM", type: "Other", comment: "Status changed from 'Created' to 'In Process'" },
];

export default function EditContractReview() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState("In Process");
  const [docType, setDocType] = useState("Other");
  const [otherDocType, setOtherDocType] = useState("Contract Document");
  const [submittedBy, setSubmittedBy] = useState("Theresa Deshotel");
  const [howReceived, setHowReceived] = useState("Email");
  const [received, setReceived] = useState<Date | undefined>(new Date("2019-02-18"));
  const [contactFirst, setContactFirst] = useState("Ellen");
  const [contactLast, setContactLast] = useState("Schopp");
  const [phone, setPhone] = useState("(409) 347-5001");
  const [email, setEmail] = useState("eschopp@entergy.com");
  const [defaultLabOnsite, setDefaultLabOnsite] = useState(false);
  const [esl, setEsl] = useState(true);
  const [eslExpiration, setEslExpiration] = useState<Date | undefined>(new Date("2020-12-31"));
  const [reviewDate, setReviewDate] = useState<Date | undefined>(new Date("2020-11-30"));
  const [odessa, setOdessa] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(new Date("2019-01-22"));
  const [termDate, setTermDate] = useState<Date | undefined>(new Date("2020-12-31"));
  const [purposes, setPurposes] = useState("ESL");
  const [contractNumber, setContractNumber] = useState("");
  const [importantNotes, setImportantNotes] = useState("This contract covers both lab testing and onsite services. Must report monthly work hours to Entergy Contractor Safety Webpage (Gordon Cotton Report. Call 985-542-3940) - Tier 2 pricing");
  const [insurance, setInsurance] = useState("standard");
  const [safety, setSafety] = useState("Must attend PowerSafe Training at alliance safety council");
  const [confidentiality, setConfidentiality] = useState("No");
  const [recordRetention, setRecordRetention] = useState("No");
  const [executive, setExecutive] = useState("Scott Morrison");
  const [executiveDate, setExecutiveDate] = useState<Date | undefined>(new Date("2019-03-14"));
  const [customerExecutedDate, setCustomerExecutedDate] = useState<Date | undefined>(new Date("2019-03-26"));
  const [requiresCdr, setRequiresCdr] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(true);
  const [invoicing, setInvoicing] = useState("n/a");
  const [paymentTerms, setPaymentTerms] = useState("Not defined");
  const [sageNotes, setSageNotes] = useState("No");
  const [srFormUpdated, setSrFormUpdated] = useState("No");
  const [noSrUpdate, setNoSrUpdate] = useState(false);
  const [documents, setDocuments] = useState<Doc[]>([{ id: "d1", name: "10572112 JM Systems Substation Ground Cleaning & Testing-ETL-Executed.pdf", type: "Other", description: "Contract order" }]);
  const [uploadType, setUploadType] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [activity, setActivity] = useState(initialActivity);
  const [commentType, setCommentType] = useState("Other");
  const [comment, setComment] = useState("");

  const field = "h-7 text-xs";
  const label = "text-[10px] font-medium text-muted-foreground";
  const accounts = useMemo(() => [
    { acct: "0121.157", customer: "Entergy Texas", sr: "SR1786" },
    { acct: "0121.160", customer: "Entergy Conroe Telecom", sr: "SR1071" },
    { acct: "0121.63", customer: "Entergy Conroe Tx", sr: "SR1786" },
  ], []);

  const addFiles = (files: FileList | null) => {
    if (!files || !uploadType) {
      toast({ title: "Select a document type first", variant: "destructive" });
      return;
    }
    setDocuments((current) => [...current, ...Array.from(files).map((file, index) => ({ id: `${Date.now()}-${index}`, name: file.name, type: uploadType, description: uploadDescription }))]);
    setUploadDescription("");
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setActivity((current) => [{ id: `${Date.now()}`, by: "Current User", date: new Date().toLocaleString("en-US"), type: commentType, comment: comment.trim() }, ...current]);
    setComment("");
  };

  const notify = (title: string, description?: string) => toast({ title, description });
  const sectionTitle = (Icon: typeof FileText, title: string) => <CardTitle className="flex items-center gap-2 text-sm"><Icon className="h-4 w-4 text-muted-foreground" />{title}</CardTitle>;

  return (
    <div className="min-h-screen bg-muted/30">
      <ModernTopNav />
      <main className="mx-auto max-w-[1450px] space-y-3 px-3 pb-24 pt-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-lg font-semibold text-foreground">Contract Review #{reviewId ?? "2"}</h1><p className="text-xs text-muted-foreground">Review contract requirements, linked accounts, documents and approval details.</p></div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-2.5 py-1 text-xs font-medium text-info"><span className="h-1.5 w-1.5 rounded-full bg-info" />{status}</span>
        </div>

        <div className="grid gap-3 xl:grid-cols-[430px_1fr]">
          <div className="space-y-3">
            <Card>
              <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(FileText, "Review Submission")}</CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 px-3 pb-3">
                <div className="space-y-1"><Label className={label}>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger className={field}><SelectValue /></SelectTrigger><SelectContent>{["Created", "In Process", "Completed", "Cancelled"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1"><Label className={label}>Document Type</Label><Select value={docType} onValueChange={setDocType}><SelectTrigger className={field}><SelectValue /></SelectTrigger><SelectContent>{documentTypes.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
                <div className="col-span-2 space-y-1"><Label className={label}>Other Document Type</Label><Input value={otherDocType} onChange={(e) => setOtherDocType(e.target.value)} className={field} /></div>
                <div className="space-y-1"><Label className={label}>Submitted By</Label><Input value={submittedBy} onChange={(e) => setSubmittedBy(e.target.value)} className={field} /></div>
                <div className="space-y-1"><Label className={label}>How Received</Label><Select value={howReceived} onValueChange={setHowReceived}><SelectTrigger className={field}><SelectValue /></SelectTrigger><SelectContent>{["Email", "Mail", "Fax", "Portal", "In Person"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1"><Label className={label}>Contract Received</Label><ModernDatePicker value={received} onChange={setReceived} size="sm" /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-3 pb-1 pt-2">{sectionTitle(Users, "Customer Accounts")}</CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                <div className="overflow-hidden rounded-md border"><Table><TableHeader><TableRow className="bg-muted/60"><TableHead>Acct</TableHead><TableHead>Customer</TableHead><TableHead>SR Document</TableHead></TableRow></TableHeader><TableBody>{accounts.map((a) => <TableRow key={a.acct}><TableCell className="py-1.5 text-xs font-medium">{a.acct}</TableCell><TableCell className="py-1.5 text-xs">{a.customer}</TableCell><TableCell className="py-1.5 text-xs font-medium text-foreground underline underline-offset-2">{a.sr}</TableCell></TableRow>)}</TableBody></Table></div>
                <div className="flex justify-end"><Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Account selector opened")}><Plus className="mr-1 h-3.5 w-3.5" />Add / Remove Accounts</Button></div>
                <div className="grid grid-cols-2 gap-2 border-t pt-2">
                  <div className="space-y-1"><Label className={label}>Contact First</Label><Input value={contactFirst} onChange={(e) => setContactFirst(e.target.value)} className={field} /></div><div className="space-y-1"><Label className={label}>Contact Last</Label><Input value={contactLast} onChange={(e) => setContactLast(e.target.value)} className={field} /></div>
                  <div className="space-y-1"><Label className={label}>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className={field} /></div><div className="space-y-1"><Label className={label}>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} className={field} /></div>
                </div>
              </CardContent>
            </Card>

            <Card><CardHeader className="px-3 pb-1 pt-2"><CardTitle className="text-sm">Business Rules</CardTitle></CardHeader><CardContent className="space-y-2 px-3 pb-3">
              <label className="flex items-center gap-2 text-xs"><Checkbox checked={defaultLabOnsite} onCheckedChange={(v) => setDefaultLabOnsite(v === true)} />Default Lab / Onsite</label>
              <div className="grid grid-cols-[auto_1fr] items-center gap-2 rounded-md border p-2"><label className="flex items-center gap-2 text-xs font-medium"><Checkbox checked={esl} onCheckedChange={(v) => setEsl(v === true)} />ESL</label><div className="grid grid-cols-2 gap-2"><div><Label className={label}>Expiration Date</Label><ModernDatePicker value={eslExpiration} onChange={setEslExpiration} size="sm" /></div><div><Label className={label}>Review Date</Label><ModernDatePicker value={reviewDate} onChange={setReviewDate} size="sm" /></div></div></div>
              <label className="flex items-center gap-2 text-xs"><Checkbox checked={odessa} onCheckedChange={(v) => setOdessa(v === true)} />Odessa</label>
            </CardContent></Card>
          </div>

          <div className="space-y-3">
            <Card>
              <CardHeader className="px-3 pb-1 pt-2"><CardTitle className="text-sm">Contract Terms & Requirements</CardTitle></CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4"><div><Label className={label}>Effective Date</Label><ModernDatePicker value={effectiveDate} onChange={setEffectiveDate} size="sm" /></div><div><Label className={label}>Term Date</Label><ModernDatePicker value={termDate} onChange={setTermDate} size="sm" /></div><div><Label className={label}>Purpose(s)</Label><Input value={purposes} onChange={(e) => setPurposes(e.target.value)} className={field} /></div><div><Label className={label}>Contract Number</Label><Input value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} className={field} /></div></div>
                <div className="grid gap-2 lg:grid-cols-3"><div><Label className={label}>Important Notes</Label><Textarea value={importantNotes} onChange={(e) => setImportantNotes(e.target.value)} rows={4} className="text-xs" /></div><div><Label className={label}>Insurance Requirements</Label><Textarea value={insurance} onChange={(e) => setInsurance(e.target.value)} rows={4} className="text-xs" /></div><div><Label className={label}>Safety Requirements</Label><Textarea value={safety} onChange={(e) => setSafety(e.target.value)} rows={4} className="text-xs" /></div></div>
                <div className="grid gap-2 border-t pt-2 sm:grid-cols-2 lg:grid-cols-4"><div><Label className={label}>Confidentiality Agreement</Label><Select value={confidentiality} onValueChange={setConfidentiality}><SelectTrigger className={field}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select></div><div><Label className={label}>Record Retention</Label><Select value={recordRetention} onValueChange={setRecordRetention}><SelectTrigger className={field}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select></div><div><Label className={label}>JM Executive</Label><Input value={executive} onChange={(e) => setExecutive(e.target.value)} className={field} /></div><div><Label className={label}>Executive Copy Received</Label><ModernDatePicker value={executiveDate} onChange={setExecutiveDate} size="sm" /></div><div><Label className={label}>Customer Copy Received</Label><ModernDatePicker value={customerExecutedDate} onChange={setCustomerExecutedDate} size="sm" /></div><label className="flex items-end gap-2 pb-1.5 text-xs"><Checkbox checked={requiresCdr} onCheckedChange={(v) => setRequiresCdr(v === true)} />Requires Customer Document Review</label></div>
              </CardContent>
            </Card>

            <Card><CardHeader className="px-3 pb-1 pt-2">{sectionTitle(CheckCircle2, "Completion & Invoicing")}</CardHeader><CardContent className="space-y-2 px-3 pb-3">
              <div className="flex flex-wrap items-center gap-3 rounded-md bg-muted/60 px-3 py-2"><label className="flex items-center gap-2 text-xs font-medium"><Checkbox checked={reviewCompleted} onCheckedChange={(v) => setReviewCompleted(v === true)} />Review Completed</label>{reviewCompleted && <><span className="text-[11px] text-muted-foreground">Completed on: <strong className="text-foreground">05/22/2019 03:07 PM</strong></span><span className="text-[11px] text-muted-foreground">Completed by: <strong className="text-foreground">Theresa B Deshotel</strong></span></>}</div>
              <div className="grid gap-2 md:grid-cols-2"><div><Label className={label}>Invoicing Instructions</Label><Textarea value={invoicing} onChange={(e) => setInvoicing(e.target.value)} rows={2} className="text-xs" /></div><div><Label className={label}>Payment Terms</Label><Textarea value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} rows={2} className="text-xs" /></div></div>
              <div className="grid gap-2 sm:grid-cols-3"><div><Label className={label}>Added Notes to Sage</Label><Select value={sageNotes} onValueChange={setSageNotes}><SelectTrigger className={field}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select></div><div><Label className={label}>SR Form Updated / Created</Label><Select value={srFormUpdated} onValueChange={setSrFormUpdated}><SelectTrigger className={field}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select></div><label className="flex items-end gap-2 pb-1.5 text-xs"><Checkbox checked={noSrUpdate} onCheckedChange={(v) => setNoSrUpdate(v === true)} />No SR Update Needed</label></div>
              <div className="flex items-center justify-between border-t pt-2"><Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => notify("Email sent", "Contract review details were sent to the AR Manager.")}><Mail className="mr-1.5 h-3.5 w-3.5" />Email AR Manager</Button><span className="text-[10px] text-muted-foreground">Email sent to brandymulkey@jmtest.com on 05/22/2019 03:11 PM</span></div>
            </CardContent></Card>
          </div>
        </div>

        <Card><CardHeader className="px-3 pb-1 pt-2">{sectionTitle(Upload, "Documents")}</CardHeader><CardContent className="space-y-2 px-3 pb-3"><div className="grid gap-2 lg:grid-cols-[220px_1fr_280px]"><Select value={uploadType} onValueChange={setUploadType}><SelectTrigger className={field}><SelectValue placeholder="Document type" /></SelectTrigger><SelectContent>{documentTypes.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><Input value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} placeholder="Description" className={field} /><label className="flex h-7 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-xs hover:bg-muted"><Upload className="h-3.5 w-3.5" />Select files<input type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} /></label></div><div className="overflow-hidden rounded-md border"><Table><TableHeader><TableRow className="bg-muted/60"><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="w-10" /></TableRow></TableHeader><TableBody>{documents.map((d) => <TableRow key={d.id}><TableCell className="py-1.5 text-xs font-medium">{d.name}</TableCell><TableCell className="py-1.5 text-xs">{d.type}</TableCell><TableCell className="py-1.5 text-xs">{d.description}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDocuments((current) => current.filter((item) => item.id !== d.id))}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>

        <Card><CardHeader className="px-3 pb-1 pt-2">{sectionTitle(MessageSquare, "Comments & Activity")}</CardHeader><CardContent className="space-y-2 px-3 pb-3"><div className="grid gap-2 sm:grid-cols-[160px_1fr_auto]"><Select value={commentType} onValueChange={setCommentType}><SelectTrigger className={field}><SelectValue /></SelectTrigger><SelectContent>{commentTypes.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" className={field} onKeyDown={(e) => e.key === "Enter" && addComment()} /><Button size="sm" className="h-7 text-xs" onClick={addComment}>Add</Button></div><div className="overflow-hidden rounded-md border"><Table><TableHeader><TableRow className="bg-muted/60"><TableHead>Created By</TableHead><TableHead>Date Entered</TableHead><TableHead>Type</TableHead><TableHead>Comment</TableHead></TableRow></TableHeader><TableBody>{activity.map((a) => <TableRow key={a.id}><TableCell className="py-1.5 text-xs">{a.by}</TableCell><TableCell className="py-1.5 text-xs tabular-nums">{a.date}</TableCell><TableCell className="py-1.5 text-xs">{a.type}</TableCell><TableCell className="py-1.5 text-xs">{a.comment}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>

        <div className="flex flex-wrap justify-between gap-2 text-[10px] text-muted-foreground"><span>Created by <strong className="text-foreground">Theresa B Deshotel</strong> · 02/21/2019 12:12 PM</span><span>Modified by <strong className="text-foreground">Theresa B Deshotel</strong> · 05/22/2019 03:07 PM</span></div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur"><div className="mx-auto flex max-w-[1450px] flex-wrap items-center justify-between gap-2"><div className="flex gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-customers/contract-reviews")}>Back</Button><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => notify("Contract review cancelled")}>Cancel CR</Button><Button variant="outline" size="sm" className="h-8 text-xs" disabled={reviewCompleted} onClick={() => setReviewCompleted(true)}>Complete CR</Button><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => notify("Added to contracts")}>Add To Contracts</Button></div><Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={() => notify("Contract review saved", `Contract Review #${reviewId ?? "2"} was updated.`)}><Save className="mr-1.5 h-3.5 w-3.5" />Save Changes</Button></div></footer>
    </div>
  );
}