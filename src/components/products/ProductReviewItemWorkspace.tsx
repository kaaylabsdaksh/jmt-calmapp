import { useState } from "react";
import { AlertTriangle, ArrowLeft, FileText, Mail, MoreHorizontal, Plus, Save, Trash2, Upload } from "lucide-react";
import { WorkOrderItemComments } from "@/components/WorkOrderItemComments";
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

const LOCATIONS = ["Alexandria", "Baton Rouge", "Houston", "Round Rock", "Lafayette", "Beaumont", "Mobile", "Gonzales", "OnSite"];
const DUPLICATES = [{ manufacturer: "FLUKE", model: "789-12" }, { manufacturer: "AMTI", model: "MC3A-500" }];
const DOCUMENT_TYPES = ["Calibration Procedure", "Datasheet", "Manufacturer Specification", "Product Manual", "Other"];

type DocumentRow = { id: string; name: string; type: string; description: string };
type HoursRow = { id: string; date: string; technician: string; workType: string; hours: number; notes: string };

export default function ProductReviewItemWorkspace({ prNumber, item, onBack, onUpdate }: Props) {
  const { toast } = useToast();
  const [draft, setDraft] = useState(item);
  const [capableLocations, setCapableLocations] = useState<Record<string, boolean>>({});
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
  const [documentDescription, setDocumentDescription] = useState("");
  const [hours, setHours] = useState<HoursRow[]>([]);
  const [hoursDraft, setHoursDraft] = useState({ date: new Date().toLocaleDateString("en-CA"), technician: "Admin User", workType: "Product Review", hours: "", notes: "" });
  const duplicate = DUPLICATES.some((candidate) => candidate.manufacturer === draft.manufacturer.toUpperCase() && candidate.model === draft.model.toUpperCase());
  const setField = (key: keyof ProductReviewItem, value: string) => setDraft((previous) => ({ ...previous, [key]: value }));
  const save = () => {
    onUpdate(draft);
    toast({ title: "PR item saved", description: `${prNumber}-${draft.itemNumber} has been updated.` });
  };
  const addDocuments = (files: FileList | null) => {
    if (!files?.length) return;
    setDocuments((previous) => [...previous, ...Array.from(files).map((file, index) => ({ id: `${Date.now()}-${index}`, name: file.name, type: documentType, description: documentDescription }))]);
    setDocumentDescription("");
  };
  const addHours = () => {
    const value = Number(hoursDraft.hours);
    if (!hoursDraft.date || !hoursDraft.technician.trim() || !Number.isFinite(value) || value <= 0) {
      toast({ title: "Hours not added", description: "Enter a date, technician, and hours greater than zero.", variant: "destructive" });
      return;
    }
    setHours((previous) => [...previous, { id: String(Date.now()), date: hoursDraft.date, technician: hoursDraft.technician.trim(), workType: hoursDraft.workType, hours: value, notes: hoursDraft.notes.trim() }]);
    setHoursDraft((previous) => ({ ...previous, hours: "", notes: "" }));
  };
  const totalHours = hours.reduce((total, row) => total + row.hours, 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="flex-1 overflow-auto px-2 py-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-[1500px] space-y-3">
          <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b bg-background py-2">
            <div>
              <h1 className="text-lg font-semibold">Product Review Item Details</h1>
              <p className="text-xs text-muted-foreground">{prNumber}-{draft.itemNumber} · {draft.manufacturer} {draft.model}</p>
            </div>
            <div className="text-right text-[10px] text-muted-foreground">Item Created by: Admin User, {draft.createdDate}<br />Item Modified by: Admin User, Today</div>
          </div>

          <Tabs defaultValue="details" className="space-y-3">
            <TabsList className="h-9 max-w-full justify-start overflow-x-auto">
              <TabsTrigger value="details" className="h-7 px-4 text-xs">PR Item Details</TabsTrigger>
              <TabsTrigger value="locations" className="h-7 px-4 text-xs">Capable Locations</TabsTrigger>
              <TabsTrigger value="documents" className="h-7 px-4 text-xs">Documents</TabsTrigger>
              <TabsTrigger value="hours" className="h-7 px-4 text-xs">Hours</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0 space-y-3">
              {duplicate && <div className="flex items-start gap-2 border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Warning:</strong> This manufacturer and model already exists on another open Product Review.</span></div>}

              <Card><CardContent className="p-4">
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-3">
              <section className="space-y-3">
                <SectionHeading>Item Identification</SectionHeading>
                <Field label="PR Item #" value={`${prNumber}-${draft.itemNumber}`} disabled />
                <Field label="Due Date" value={draft.dueDate} onChange={(value) => setField("dueDate", value)} />
                <SelectField label="PR Item Status" value={draft.status} options={["Review Initiated", "Initiator", "Lab Management", "Metrology", "Lead Tech", "Completed", "Cancelled"]} onChange={(value) => setField("status", value)} />
                <SelectField label="Location" value={draft.location} options={["Alexandria", "Baton Rouge", "Houston", "Onsite"]} onChange={(value) => setField("location", value)} />
                <SelectField label="Division" value={draft.division} options={["Regular", "OnSite", "ESL"]} onChange={(value) => setField("division", value)} />
                <SelectField label="Work to be Performed" value="Calibration" options={["Calibration", "Repair", "Calibration & Repair", "Inspection"]} onChange={() => undefined} />
                <Field label="Action Code" value="Review" />
                <SectionHeading>Product</SectionHeading>
                <Field label="Manufacturer" value={draft.manufacturer} onChange={(value) => setField("manufacturer", value)} />
                <Field label="Model" value={draft.model} onChange={(value) => setField("model", value)} />
                <Field label="Description" value={draft.description} onChange={(value) => setField("description", value)} />
                <SelectField label="Lab Code" value="M" options={["B", "G", "M", "N", "P", "Q", "T"]} onChange={() => undefined} />
              </section>

              <section className="space-y-3">
                <SectionHeading>Specification</SectionHeading>
                <Field label="Accuracy" value="" />
                <Field label="Range" value="" />
                <Field label="Option" value="" />
                <Field label="Category 4" value="" />
                <Field label="Category 5" value="" />
                <Field label="Category 6" value="" />
                <SectionHeading isNew>Physical Dimensions</SectionHeading>
                <Field label="Weight" value="" suffix="lb" />
                <Field label="Height" value="" suffix="in" />
                <Field label="Width" value="" suffix="in" />
                <Field label="Depth" value="" suffix="in" />
              </section>

              <section className="space-y-3">
                <SectionHeading>Accreditation & Cost</SectionHeading>
                <CheckField label="Requested 17025" />
                <CheckField label="To Factory" />
                <CheckField label="R&D" />
                <Field label="Accredited Calibration" value="" />
                <Field label="Cal/Cert Cost" value="0.00" />
                <Field label="Estimated Certification Time" value="" suffix="hrs" isNew />
                <CheckField label="Override Zero Price" />
                <CheckField label="Equipment at JM" />
                <SectionHeading isNew>Servicing Readiness</SectionHeading>
                <CheckField label="Procedure Available" />
                <CheckField label="Template Available" />
                <CheckField label="Automation Available" />
              </section>
            </div>
              </CardContent></Card>

              <Card><CardContent className="p-0">
            <div className="border-b bg-muted/30 px-3 py-2 text-xs font-semibold">Calibration and Report Information</div>
            <div className="grid gap-x-8 gap-y-3 p-3 md:grid-cols-2">
              <SelectField label="Has Unit been calibrated before?" value={draft.calibratedBefore} options={["Yes", "No"]} onChange={(value) => setField("calibratedBefore", value)} />
              <SelectField label="Can datasheet/test reports be provided?" value={draft.reportsAvailable} options={["Yes", "No"]} onChange={(value) => setField("reportsAvailable", value)} />
              {draft.calibratedBefore === "No" && <div className="md:col-span-2"><Field label="Why does the product need to be calibrated?" value={draft.calibrationReason} onChange={(value) => setField("calibrationReason", value)} /></div>}
            </div>
              </CardContent></Card>

              <Card><CardContent className="overflow-x-auto p-0">
            <Table><TableHeader><TableRow className="bg-muted/40"><TableHead>Dept/Area</TableHead><TableHead>Date Sent</TableHead><TableHead>Ack</TableHead><TableHead>Ack Date</TableHead><TableHead>Ack User</TableHead><TableHead>Completed</TableHead><TableHead>Completed Date</TableHead><TableHead>Completed User</TableHead></TableRow></TableHeader>
              <TableBody><TableRow className="text-xs"><TableCell>{draft.status}</TableCell><TableCell>{draft.createdDate}</TableCell><TableCell>Yes</TableCell><TableCell>{draft.createdDate}</TableCell><TableCell>Admin User</TableCell><TableCell>{draft.completedDate ? "Yes" : "—"}</TableCell><TableCell>{draft.completedDate || "—"}</TableCell><TableCell>{draft.completedDate ? "Admin User" : "—"}</TableCell></TableRow></TableBody>
            </Table>
              </CardContent></Card>

              <WorkOrderItemComments workOrderItemId={`${prNumber}-${draft.itemNumber}`} />
            </TabsContent>

            <TabsContent value="locations" className="mt-0">
              <Card><CardContent className="p-0">
                <div className="border-b bg-muted/30 px-3 py-2"><h2 className="text-xs font-semibold">Capable Locations</h2><p className="mt-0.5 text-[10px] text-muted-foreground">Select every location equipped to service this product.</p></div>
                <div className="grid gap-px bg-border sm:grid-cols-2 md:grid-cols-3">
                  {LOCATIONS.map((location) => <label key={location} className="flex min-h-12 cursor-pointer items-center gap-3 bg-background px-4 py-2 text-xs"><Checkbox checked={Boolean(capableLocations[location])} onCheckedChange={(checked) => setCapableLocations((previous) => ({ ...previous, [location]: checked === true }))} /><span className="font-medium">{location}</span></label>)}
                </div>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-0 space-y-3">
              <Card><CardContent className="p-0">
                <div className="border-b bg-muted/30 px-3 py-2"><h2 className="flex items-center gap-2 text-xs font-semibold"><FileText className="h-3.5 w-3.5" />Documents</h2></div>
                <div className="grid gap-2 border-b p-3 md:grid-cols-[220px_1fr_260px]">
                  <Select value={documentType} onValueChange={setDocumentType}><SelectTrigger aria-label="Document Type" className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{DOCUMENT_TYPES.map((type) => <SelectItem key={type} value={type} className="text-xs">{type}</SelectItem>)}</SelectContent></Select>
                  <Input aria-label="Document Description" className="h-8 text-xs" value={documentDescription} onChange={(event) => setDocumentDescription(event.target.value)} placeholder="Description" />
                  <label className="flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed text-xs hover:bg-muted"><Upload className="h-3.5 w-3.5" />Select files<input type="file" multiple className="hidden" onChange={(event) => { addDocuments(event.target.files); event.target.value = ""; }} /></label>
                </div>
                <div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-muted/40"><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="w-12" /></TableRow></TableHeader><TableBody>{documents.length ? documents.map((document) => <TableRow key={document.id} className="text-xs"><TableCell className="font-medium">{document.name}</TableCell><TableCell>{document.type}</TableCell><TableCell>{document.description || "—"}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Remove ${document.name}`} onClick={() => setDocuments((previous) => previous.filter((row) => row.id !== document.id))}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="h-20 text-center text-xs text-muted-foreground">No documents have been added.</TableCell></TableRow>}</TableBody></Table></div>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="hours" className="mt-0 space-y-3">
              <Card><CardContent className="p-0">
                <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2"><div><h2 className="text-xs font-semibold">Hours</h2><p className="mt-0.5 text-[10px] text-muted-foreground">Track time spent completing this Product Review item.</p></div><div className="text-right"><div className="text-[10px] text-muted-foreground">Total Hours</div><div className="text-sm font-semibold">{totalHours.toFixed(2)}</div></div></div>
                <div className="grid gap-2 border-b p-3 sm:grid-cols-2 lg:grid-cols-[140px_1fr_180px_110px_2fr_auto]">
                  <Input aria-label="Work Date" type="date" className="h-8 text-xs" value={hoursDraft.date} onChange={(event) => setHoursDraft((previous) => ({ ...previous, date: event.target.value }))} />
                  <Input aria-label="Technician" className="h-8 text-xs" value={hoursDraft.technician} onChange={(event) => setHoursDraft((previous) => ({ ...previous, technician: event.target.value }))} placeholder="Technician" />
                  <Select value={hoursDraft.workType} onValueChange={(value) => setHoursDraft((previous) => ({ ...previous, workType: value }))}><SelectTrigger aria-label="Work Type" className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{["Product Review", "Research", "Procedure", "Template", "Other"].map((type) => <SelectItem key={type} value={type} className="text-xs">{type}</SelectItem>)}</SelectContent></Select>
                  <Input aria-label="Hours" type="number" min="0.25" step="0.25" className="h-8 text-xs" value={hoursDraft.hours} onChange={(event) => setHoursDraft((previous) => ({ ...previous, hours: event.target.value }))} placeholder="Hours" />
                  <Textarea aria-label="Hours Notes" className="min-h-8 resize-none py-1.5 text-xs" value={hoursDraft.notes} onChange={(event) => setHoursDraft((previous) => ({ ...previous, notes: event.target.value }))} placeholder="Notes" />
                  <Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={addHours}><Plus />Add Hours</Button>
                </div>
                <div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-muted/40"><TableHead>Date</TableHead><TableHead>Technician</TableHead><TableHead>Work Type</TableHead><TableHead>Hours</TableHead><TableHead>Notes</TableHead><TableHead className="w-12" /></TableRow></TableHeader><TableBody>{hours.length ? hours.map((row) => <TableRow key={row.id} className="text-xs"><TableCell>{row.date}</TableCell><TableCell>{row.technician}</TableCell><TableCell>{row.workType}</TableCell><TableCell>{row.hours.toFixed(2)}</TableCell><TableCell>{row.notes || "—"}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Remove hours for ${row.date}`} onClick={() => setHours((previous) => previous.filter((entry) => entry.id !== row.id))}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={6} className="h-20 text-center text-xs text-muted-foreground">No hours have been recorded.</TableCell></TableRow>}</TableBody></Table></div>
              </CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="shrink-0 border-t bg-background px-2 py-2 sm:px-4 lg:px-6"><div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={onBack}><ArrowLeft />Back to PR Items</Button><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="h-8 text-xs"><MoreHorizontal />More Actions</Button></DropdownMenuTrigger><DropdownMenuContent align="start">{["To Lab Management", "To Metrology", "To Lead Tech", "To Initiator", "Cancel Review", "Cannot Service", "Approve Capability", "Approve PR Completion"].map((action) => <DropdownMenuItem key={action}>{action}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu></div>
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8 text-xs"><Mail />Email Customer</Button><Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={save}><Save />Save</Button></div>
      </div></footer>
    </div>
  );
}

function NewTag() { return <span className="inline-flex rounded bg-primary px-1 py-0.5 text-[9px] font-bold leading-none text-primary-foreground">NEW</span>; }
function SectionHeading({ children, isNew = false }: { children: React.ReactNode; isNew?: boolean }) { return <h2 className="flex items-center gap-2 border-b pb-1 text-xs font-semibold">{children}{isNew && <NewTag />}</h2>; }
function Field({ label, value, onChange, disabled, suffix, isNew = false }: { label: string; value: string; onChange?: (value: string) => void; disabled?: boolean; suffix?: string; isNew?: boolean }) { return <div className="grid grid-cols-[minmax(8rem,42%)_1fr] items-center gap-2"><Label className="flex items-center justify-end gap-1 text-right text-[11px] text-muted-foreground">{label}{isNew && <NewTag />}</Label><div className="flex items-center gap-2"><Input aria-label={label} className="h-7 text-xs" value={value} disabled={disabled} onChange={(event) => onChange?.(event.target.value)} />{suffix && <span className="text-[10px] text-muted-foreground">{suffix}</span>}</div></div>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <div className="grid grid-cols-[minmax(8rem,42%)_1fr] items-center gap-2"><Label className="text-right text-[11px] text-muted-foreground">{label}</Label><Select value={value || undefined} onValueChange={onChange}><SelectTrigger aria-label={label} className="h-7 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>)}</SelectContent></Select></div>; }
function CheckField({ label }: { label: string }) { return <label className="grid grid-cols-[minmax(8rem,42%)_1fr] items-center gap-2 text-[11px]"><span className="text-right text-muted-foreground">{label}</span><Checkbox /></label>; }
