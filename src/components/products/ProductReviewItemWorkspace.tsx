import { useState } from "react";
import { AlertTriangle, ArrowLeft, Clock, FileText, Mail, MoreHorizontal, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export type ProductReviewItem = {
  id: string;
  itemNumber: string;
  manufacturer: string;
  model: string;
  description: string;
  location: string;
  division: string;
  createdDate: string;
  dueDate: string;
  completedDate: string;
  status: string;
  calibratedBefore: string;
  calibrationReason: string;
  reportsAvailable: string;
};

type Props = {
  prNumber: string;
  item: ProductReviewItem;
  onBack: () => void;
  onUpdate: (item: ProductReviewItem) => void;
};

const LOCATIONS = ["Baton Rouge", "Alexandria", "Odessa", "Clute", "Mattoon", "Groves", "San Angelo", "Berthold", "Mount Braddock", "Port Arthur", "Mathiston", "Billings", "Mobile", "Edmonton", "Wichita", "Onsite", "Leechburg"];
const CAPABILITIES = ["Calibration", "Limited Calibration", "Adjustment (in lab)", "17025 (Full)", "17025 (Limited)", '"No" 17025', "Send to Alternate Lab", "To Factory (Cal Outsourced)", "Adjustment (To Factory)", "Repair (Full)", "Repair (Limited)", "Repair (No)", "Unserviceable"];
const DUPLICATES = [{ manufacturer: "FLUKE", model: "789-12" }, { manufacturer: "AMTI", model: "MC3A-500" }];

export default function ProductReviewItemWorkspace({ prNumber, item, onBack, onUpdate }: Props) {
  const { toast } = useToast();
  const [draft, setDraft] = useState(item);
  const [activeTab, setActiveTab] = useState("details");
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [documents, setDocuments] = useState<{ id: string; type: string; name: string; description: string }[]>([]);
  const [docType, setDocType] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docFile, setDocFile] = useState("");
  const [work, setWork] = useState("");
  const [hours, setHours] = useState("");
  const [hourEntries, setHourEntries] = useState<{ id: string; work: string; hours: number; date: string }[]>([]);
  const duplicate = DUPLICATES.some((candidate) => candidate.manufacturer === draft.manufacturer.toUpperCase() && candidate.model === draft.model.toUpperCase());
  const setField = (key: keyof ProductReviewItem, value: string) => setDraft((previous) => ({ ...previous, [key]: value }));
  const save = () => {
    onUpdate(draft);
    toast({ title: "PR item saved", description: `${prNumber}-${draft.itemNumber} has been updated.` });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="flex-1 overflow-auto px-2 py-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-[1500px] space-y-3">
          <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b bg-background py-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{prNumber}-{draft.itemNumber}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-info" />{draft.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{draft.manufacturer} {draft.model} · {draft.description}</p>
            </div>
            <div className="text-right text-[10px] text-muted-foreground">Created by Admin User · {draft.createdDate}<br />Modified by Admin User · Today</div>
          </div>

          {duplicate && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span><strong>Possible duplicate.</strong> The same manufacturer and model exists on another open PR. Confirm this is valid before finalizing.</span>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-9">
              <TabsTrigger value="details" className="px-4 text-xs">PR Item Details</TabsTrigger>
              <TabsTrigger value="capable" className="px-4 text-xs">Capable Locations</TabsTrigger>
              <TabsTrigger value="documents" className="px-4 text-xs">Documents</TabsTrigger>
              <TabsTrigger value="hours" className="px-4 text-xs">Hours</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-3 space-y-3">
              <Card><CardContent className="p-0">
                <SectionTitle title="Item identification" />
                <div className="grid gap-x-6 gap-y-2 p-3 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="PR Item #" value={`${prNumber}-${draft.itemNumber}`} disabled />
                  <Field label="Due Date" value={draft.dueDate} onChange={(value) => setField("dueDate", value)} />
                  <SelectField label="PR Item Status" value={draft.status} options={["Review Initiated", "Initiator", "Lab Management", "Metrology", "Lead Tech", "Completed", "Cancelled"]} onChange={(value) => setField("status", value)} />
                  <SelectField label="Location" value={draft.location} options={["Alexandria", "Baton Rouge", "Clute", "Houston", "Onsite"]} onChange={(value) => setField("location", value)} />
                  <SelectField label="Division" value={draft.division} options={["Regular", "OnSite", "ESL"]} onChange={(value) => setField("division", value)} />
                  <SelectField label="Work to be Performed" value="Calibration" options={["Calibration", "Repair", "Calibration & Repair", "Inspection"]} onChange={() => undefined} />
                  <Field label="Action Code" value="Review" />
                </div>
                <SectionTitle title="Product and specification" />
                <div className="grid gap-x-6 gap-y-2 p-3 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Manufacturer" value={draft.manufacturer} onChange={(value) => setField("manufacturer", value)} required />
                  <Field label="Model" value={draft.model} onChange={(value) => setField("model", value)} required />
                  <Field label="Description" value={draft.description} onChange={(value) => setField("description", value)} required />
                  <SelectField label="Lab Code" value="M" options={["B", "G", "M", "N", "P", "Q", "T"]} onChange={() => undefined} />
                  <Field label="Accuracy" value="" />
                  <Field label="Range" value="" />
                  <Field label="Option" value="" />
                  <Field label="Cal/Cert Cost" value="0.00" />
                </div>
                <SectionTitle title="Accreditation and service" />
                <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-4">
                  {["Requested 17025", "To Factory", "R&D", "Override Zero Price", "Equipment at JM", "Procedure Available", "Template Available", "Automation Available"].map((label) => <CheckField key={label} label={label} />)}
                </div>
                <div className="border-t bg-muted/20 p-3 text-xs">
                  <div className="grid gap-2 md:grid-cols-2"><span>Has unit been calibrated before? <strong>{draft.calibratedBefore}</strong></span><span>Can datasheet/test reports be provided? <strong>{draft.reportsAvailable}</strong></span></div>
                  {draft.calibrationReason && <p className="mt-2 text-muted-foreground">Calibration reason: {draft.calibrationReason}</p>}
                </div>
              </CardContent></Card>

              <Card><CardContent className="p-0 overflow-x-auto">
                <SectionTitle title="Status history" />
                <Table><TableHeader><TableRow className="bg-muted/40"><TableHead>Dept/Area</TableHead><TableHead>Date Sent</TableHead><TableHead>Acknowledged</TableHead><TableHead>Acknowledged By</TableHead><TableHead>Completed</TableHead></TableRow></TableHeader>
                  <TableBody><TableRow className="text-xs"><TableCell>Review Initiated</TableCell><TableCell>{draft.createdDate}</TableCell><TableCell>Today</TableCell><TableCell>Admin User</TableCell><TableCell>—</TableCell></TableRow></TableBody>
                </Table>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="capable" className="mt-3 space-y-3">
              <Card className="max-w-full overflow-hidden"><CardContent className="p-0 overflow-x-auto">
                <Table className="w-auto min-w-full"><TableHeader><TableRow className="bg-muted/40"><TableHead className="sticky left-0 z-10 min-w-48 bg-muted">Capability</TableHead>{LOCATIONS.map((location) => <TableHead key={location} className="min-w-24 text-center text-[10px]">{location}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{CAPABILITIES.map((capability) => <TableRow key={capability}><TableCell className="sticky left-0 z-10 bg-background py-1.5 text-[11px] font-medium">{capability}</TableCell>{LOCATIONS.map((location) => <TableCell key={location} className="p-1.5 text-center"><Checkbox aria-label={`${capability} at ${location}`} checked={Boolean(matrix[capability]?.[location])} onCheckedChange={() => setMatrix((previous) => ({ ...previous, [capability]: { ...previous[capability], [location]: !previous[capability]?.[location] } }))} /></TableCell>)}</TableRow>)}</TableBody>
                </Table>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-3 space-y-3">
              <Card><CardContent className="p-3"><SectionTitle title="Add document" />
                <div className="grid items-end gap-2 pt-3 md:grid-cols-4"><SelectField label="Document Type" value={docType} options={["Instruction Sheet", "Manual", "Datasheet", "Quote", "Certificate", "Other"]} onChange={setDocType} /><Field label="Description" value={docDescription} onChange={setDocDescription} /><div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground">File</Label><label className="flex h-8 cursor-pointer items-center gap-2 rounded-md border px-2 text-xs"><Upload className="h-3.5 w-3.5" /><span className="truncate">{docFile || "Choose file"}</span><input type="file" className="sr-only" onChange={(event) => setDocFile(event.target.files?.[0]?.name || "")} /></label></div>
                  <Button className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" disabled={!docType || !docFile} onClick={() => { setDocuments((previous) => [...previous, { id: String(Date.now()), type: docType, name: docFile, description: docDescription }]); setDocType(""); setDocFile(""); setDocDescription(""); }}><Upload className="h-3.5 w-3.5" />Upload</Button></div>
              </CardContent></Card>
              <Card><CardContent className="p-0"><SectionTitle title={`Attached documents (${documents.length})`} />{documents.length === 0 ? <EmptyState icon={FileText} text="No documents attached." /> : <Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Document</TableHead><TableHead>Description</TableHead><TableHead className="w-12" /></TableRow></TableHeader><TableBody>{documents.map((document) => <TableRow key={document.id} className="text-xs"><TableCell>{document.type}</TableCell><TableCell className="font-medium">{document.name}</TableCell><TableCell>{document.description || "—"}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDocuments((previous) => previous.filter((entry) => entry.id !== document.id))}><X /></Button></TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
            </TabsContent>

            <TabsContent value="hours" className="mt-3"><div className="grid gap-3 lg:grid-cols-3">
              <Card><CardContent className="space-y-3 p-3"><SectionTitle title="Log time" /><div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground">Work Performed</Label><Textarea value={work} onChange={(event) => setWork(event.target.value)} className="min-h-24 text-xs" /></div><Field label="Hours" value={hours} onChange={setHours} /><Button className="h-8 w-full bg-success text-xs text-success-foreground hover:bg-success/90" disabled={!work.trim() || Number(hours) <= 0} onClick={() => { setHourEntries((previous) => [...previous, { id: String(Date.now()), work, hours: Number(hours), date: new Date().toLocaleString("en-US") }]); setWork(""); setHours(""); }}><Clock />Add Hours</Button></CardContent></Card>
              <Card className="lg:col-span-2"><CardContent className="p-0"><SectionTitle title={`Hours history · ${hourEntries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(2)} hrs`} />{hourEntries.length === 0 ? <EmptyState icon={Clock} text="No hours recorded yet." /> : <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Work Performed</TableHead><TableHead className="text-right">Hours</TableHead></TableRow></TableHeader><TableBody>{hourEntries.map((entry) => <TableRow key={entry.id} className="text-xs"><TableCell>{entry.date}</TableCell><TableCell>{entry.work}</TableCell><TableCell className="text-right">{entry.hours.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
            </div></TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="shrink-0 border-t bg-background px-2 py-2 sm:px-4 lg:px-6"><div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={onBack}><ArrowLeft />Back to PR Items</Button><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="h-8 text-xs"><MoreHorizontal />More Actions</Button></DropdownMenuTrigger><DropdownMenuContent align="start">{["To Lab Management", "To Metrology", "To Lead Tech", "To Initiator", "Cancel Review", "Cannot Service", "Approve"].map((action) => <DropdownMenuItem key={action}>{action}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu></div>
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8 text-xs"><Mail />Email Customer</Button><Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={save}><Save />Save Changes</Button></div>
      </div></footer>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) { return <div className="border-b bg-muted/30 px-3 py-2 text-xs font-semibold">{title}</div>; }
function Field({ label, value, onChange, disabled, required }: { label: string; value: string; onChange?: (value: string) => void; disabled?: boolean; required?: boolean }) { return <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground">{label}{required && <span className="text-destructive"> *</span>}</Label><Input aria-label={label} className="h-8 text-xs" value={value} disabled={disabled} onChange={(event) => onChange?.(event.target.value)} /></div>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <div className="space-y-1"><Label className="text-[10px] uppercase text-muted-foreground">{label}</Label><Select value={value || undefined} onValueChange={onChange}><SelectTrigger aria-label={label} className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>)}</SelectContent></Select></div>; }
function CheckField({ label }: { label: string }) { return <label className="flex items-center gap-2 text-xs"><Checkbox />{label}</label>; }
function EmptyState({ icon: Icon, text }: { icon: typeof FileText; text: string }) { return <div className="flex flex-col items-center justify-center py-10 text-xs text-muted-foreground"><Icon className="mb-2 h-6 w-6 opacity-40" />{text}</div>; }
