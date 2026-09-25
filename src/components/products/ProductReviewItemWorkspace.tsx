import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Clock3, ExternalLink, FileText, Mail, MoreHorizontal, Save, Upload } from "lucide-react";
import { WorkOrderItemComments } from "@/components/WorkOrderItemComments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox, matrixCheckboxClass } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const CAPABLE_LOCATIONS = [
  "Baton Rouge", "Alexandria", "Odessa", "Clute", "Mattoon", "Groves", "San Angelo", "Berthold", "Mount Braddock",
  "Port Arthur", "Mathiston", "Billings", "Mobile", "Edmonton", "Wichita", "Onsite", "Leechburg",
];
const CAPABILITY_COLUMNS = [
  "Calibration", "Limited Calibration", "Adjustment (in lab)", "17025 (Full)", "17025 (Limited)", '"No" 17025',
  "Standards Only", "To Factory (Cal Outsource)", "Adjustment (To Factory)", "Repair (Full)", "Repair (Limited)",
  "Repair (No)", "Unserviceable",
];
const CAPABILITY_LEGEND = [
  { term: "Calibration", def: "Full verification of UUT." },
  { term: "Limited Calibration", def: "Limited parameter verification of UUT, including un-adjustable and TAR <2:1." },
  { term: "Adjustment (in lab)", def: "Our ability to adjust in lab." },
  { term: "17025 (Full)", def: "Can accredit to UUT full range." },
  { term: "17025 (Limited)", def: "Can accredit to limited range of UUT." },
  { term: '"No" 17025', def: "Can not accredit UUT, parameters not on scope, may require outsourcing." },
  { term: "Standards Only", def: "Used for standards work only; customer units are not calibrated at this location." },
  { term: "To Factory (Cal Outsource)", def: "We are not able to calibrate in any lab." },
  { term: "Adjustment (To Factory)", def: 'We can "calibrate" but not "adjust" in lab.' },
  { term: "Repair (Full)", def: "Can completely repair unit." },
  { term: "Repair (Limited)", def: "Can partially repair unit; certain repairs require to-factory/OEM service." },
  { term: "Repair (No)", def: "Can not repair; must go to factory/OEM for repair." },
  { term: "Unserviceable", def: "No OEM or alternate vendor to service this; parts/technical info unavailable." },
];
const DUPLICATES = [{ manufacturer: "FLUKE", model: "789-12" }, { manufacturer: "AMTI", model: "MC3A-500" }];
const DOCUMENT_TYPES = ["Calibration Procedure", "Datasheet", "Manufacturer Specification", "Product Manual", "Other"];

type DocumentRow = { id: string; name: string; type: string; description: string; uploadedBy: string; uploadedDate: string };
type HoursRow = { id: string; workPerformed: string; hours: number; recordedBy: string; recordedDate: string };
type RoutingRow = { id: string; dept: string; dateSent: string; ack: boolean; ackDate: string; ackUser: string; completed: boolean; completedDate: string; completedUser: string; comment: string };

const ROUTING_ACTIONS = ["To Lab Management", "To Metrology", "To Lead Tech", "To T/F Clerk", "To Initiator"];
const DECISION_ACTIONS = ["Cancel Review", "Maybe", "Cannot Service", "Approve"];
const ACTION_STATUS: Record<string, string> = {
  "To Lab Management": "Lab Management",
  "To Metrology": "Metrology",
  "To Lead Tech": "Lead Tech",
  "To T/F Clerk": "T/F Clerk",
  "To Initiator": "Initiator",
  "Cancel Review": "Cancelled",
  Maybe: "Maybe",
  "Cannot Service": "Cannot Service",
  Approve: "Approved",
};
const stamp = () => new Date().toLocaleString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function ProductReviewItemWorkspace({ prNumber, item, onBack, onUpdate }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(item);
  const [capabilityMatrix, setCapabilityMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [limitedNotes, setLimitedNotes] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<DocumentRow[]>([{ id: "existing-1", name: "Belt Tension Checker Instruction Sheet.pdf", type: "Other", description: "Instruction sheet", uploadedBy: "Kevin R. Young", uploadedDate: "06/30/2021" }]);
  const [documentType, setDocumentType] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [hours, setHours] = useState<HoursRow[]>([]);
  const [hoursDraft, setHoursDraft] = useState({ workPerformed: "", hours: "" });
  const [routing, setRouting] = useState<RoutingRow[]>([]);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [routingComment, setRoutingComment] = useState("");
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [dueDateDraft, setDueDateDraft] = useState("");
  const [dueDateComment, setDueDateComment] = useState("");
  const confirmDueDate = () => {
    if (!dueDateDraft.trim()) {
      toast({ title: "Due date required", description: "Enter a new due date.", variant: "destructive" });
      return;
    }
    setDraft((previous) => ({ ...previous, dueDate: dueDateDraft.trim() }));
    setDueDateOpen(false);
    toast({ title: "Due date updated", description: `New due date ${dueDateDraft.trim()}.` });
  };
  const currentDept = routing[0]?.dept ?? "";
  const confirmRouting = () => {
    if (!pendingAction) return;
    const dept = ACTION_STATUS[pendingAction] ?? pendingAction;
    const now = stamp();
    setRouting((previous) => [
      { id: String(Date.now()), dept, dateSent: now, ack: false, ackDate: "", ackUser: "", completed: false, completedDate: "", completedUser: "", comment: routingComment.trim() },
      ...previous.map((row, index) => (index === 0 && !row.completed ? { ...row, completed: true, completedDate: now, completedUser: "Admin User" } : row)),
    ]);
    setDraft((previous) => ({ ...previous, status: dept }));
    setPendingAction(null);
    setRoutingComment("");
    toast({ title: "Item routed", description: `Sent to ${dept}.` });
  };
  const toggleAck = (id: string) => setRouting((previous) => previous.map((row) => (row.id === id
    ? (row.ack ? { ...row, ack: false, ackDate: "", ackUser: "" } : { ...row, ack: true, ackDate: stamp(), ackUser: "Admin User" })
    : row)));
  const toggleCompleted = (id: string) => setRouting((previous) => previous.map((row) => (row.id === id
    ? (row.completed ? { ...row, completed: false, completedDate: "", completedUser: "" } : { ...row, completed: true, completedDate: stamp(), completedUser: "Admin User" })
    : row)));
  const duplicate = DUPLICATES.some((candidate) => candidate.manufacturer === draft.manufacturer.toUpperCase() && candidate.model === draft.model.toUpperCase());
  const setField = (key: keyof ProductReviewItem, value: string) => setDraft((previous) => ({ ...previous, [key]: value }));
  const save = () => {
    onUpdate(draft);
    toast({ title: "PR item saved", description: `${prNumber}-${draft.itemNumber} has been updated.` });
  };
  const addDocuments = () => {
    if (!documentType || selectedFiles.length === 0) {
      toast({ title: "Document not uploaded", description: "Select a document type and file.", variant: "destructive" });
      return;
    }
    setDocuments((previous) => [...previous, ...selectedFiles.map((file, index) => ({ id: `${Date.now()}-${index}`, name: file.name, type: documentType, description: documentDescription, uploadedBy: "Admin User", uploadedDate: new Date().toLocaleDateString("en-US") }))]);
    setDocumentType("");
    setDocumentDescription("");
    setSelectedFiles([]);
  };
  const addHours = () => {
    const value = Number(hoursDraft.hours);
    if (!hoursDraft.workPerformed.trim() || !Number.isFinite(value) || value <= 0) {
      toast({ title: "Hours not added", description: "Describe the work performed and enter hours greater than zero.", variant: "destructive" });
      return;
    }
    setHours((previous) => [...previous, { id: String(Date.now()), workPerformed: hoursDraft.workPerformed.trim(), hours: value, recordedBy: "Admin User", recordedDate: new Date().toLocaleDateString("en-US") }]);
    setHoursDraft({ workPerformed: "", hours: "" });
  };
  const totalHours = hours.reduce((total, row) => total + row.hours, 0);
  const CAPABILITY_GROUPS: string[][] = [
    ["17025 (Full)", "17025 (Limited)", '"No" 17025'],
    ["Repair (Full)", "Repair (Limited)", "Repair (No)"],
  ];
  const toggleCapability = (location: string, capability: string) => setCapabilityMatrix((previous) => {
    const group = CAPABILITY_GROUPS.find((candidates) => candidates.includes(capability));
    const nextLocation = { ...previous[location] };
    if (group) {
      group.forEach((candidate) => { delete nextLocation[candidate]; });
      if (!previous[location]?.[capability]) nextLocation[capability] = true;
    } else {
      nextLocation[capability] = !previous[location]?.[capability];
    }
    return { ...previous, [location]: nextLocation };
  });
  const isLocationFullyCapable = (current: Record<string, boolean> | undefined) => CAPABILITY_COLUMNS.every((capability) => {
    const group = CAPABILITY_GROUPS.find((candidates) => candidates.includes(capability));
    if (group) return Boolean(current?.[group[0]]);
    return Boolean(current?.[capability]);
  });
  const toggleAllCapabilities = (location: string) => setCapabilityMatrix((previous) => {
    if (isLocationFullyCapable(previous[location])) {
      setLimitedNotes((notes) => { const next = { ...notes }; delete next[location]; return next; });
      return { ...previous, [location]: {} };
    }
    const nextLocation: Record<string, boolean> = {};
    CAPABILITY_GROUPS.forEach((group) => { nextLocation[group[0]] = true; });
    CAPABILITY_COLUMNS.forEach((capability) => {
      if (!CAPABILITY_GROUPS.some((group) => group.includes(capability))) nextLocation[capability] = true;
    });
    return { ...previous, [location]: nextLocation };
  });
  const notesLocations = CAPABLE_LOCATIONS.filter((location) => capabilityMatrix[location]?.["17025 (Limited)"]);
  const limitedNotesRow = notesLocations.length > 0;

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
                <div className="grid grid-cols-[minmax(8rem,42%)_1fr] items-center gap-2">
                  <Label className="text-right text-[11px] text-muted-foreground">Due Date</Label>
                  <div className="flex items-center gap-2">
                    <Input aria-label="Due Date" className="h-7 text-xs" value={draft.dueDate} readOnly />
                    <Button variant="link" size="sm" className="h-7 px-0 text-xs text-foreground underline-offset-4 hover:underline" onClick={() => { setDueDateDraft(draft.dueDate); setDueDateComment(""); setDueDateOpen(true); }}>Update Date</Button>
                  </div>
                </div>
                <SelectField label="PR Item Status" value={draft.status} options={["Review Initiated", "Initiator", "Lab Management", "Metrology", "Lead Tech", "Approved", "Completed", "Cancelled"]} onChange={(value) => setField("status", value)} />
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
                {draft.status === "Approved" && (
                  <div className="flex justify-end pt-1">
                    <Button variant="link" className="h-auto p-0 text-xs font-semibold uppercase tracking-wide text-info underline" onClick={() => navigate(`/manage-products/${encodeURIComponent(draft.model || draft.itemNumber)}`)}>
                      <ExternalLink className="mr-1 h-3.5 w-3.5" />View Product
                    </Button>
                  </div>
                )}
              </section>
            </div>
              </CardContent></Card>


              <Card><CardContent className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/20 px-3 py-2">
                  <h2 className="text-xs font-semibold">Routing History</h2>
                  <span className="inline-flex items-center gap-2 rounded-full bg-background px-2.5 py-1 text-[11px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    Current Status: {currentDept || draft.status || "—"}
                  </span>
                </div>
                <div className="overflow-x-auto">
            <Table><TableHeader><TableRow className="bg-muted/40"><TableHead>Dept/Area</TableHead><TableHead>Date Sent</TableHead><TableHead className="w-16 text-center">Ack</TableHead><TableHead>Ack Date</TableHead><TableHead>Ack User</TableHead><TableHead className="w-20 text-center">Completed</TableHead><TableHead>Completed Date</TableHead><TableHead>Completed User</TableHead></TableRow></TableHeader>
              <TableBody>{routing.length ? routing.map((row) => <TableRow key={row.id} className="text-xs">
                <TableCell className="font-medium">{row.dept}</TableCell>
                <TableCell>{row.dateSent}</TableCell>
                <TableCell className="text-center"><Checkbox aria-label={`Ack ${row.dept}`} checked={row.ack} onCheckedChange={() => toggleAck(row.id)} className="mx-auto h-3.5 w-3.5" /></TableCell>
                <TableCell>{row.ackDate || "—"}</TableCell>
                <TableCell>{row.ackUser || "—"}</TableCell>
                <TableCell className="text-center"><Checkbox aria-label={`Completed ${row.dept}`} checked={row.completed} onCheckedChange={() => toggleCompleted(row.id)} className="mx-auto h-3.5 w-3.5" /></TableCell>
                <TableCell>{row.completedDate || "—"}</TableCell>
                <TableCell>{row.completedUser || "—"}</TableCell>
              </TableRow>) : <TableRow><TableCell colSpan={8} className="h-16 text-center text-xs text-muted-foreground">No routing history yet. Use the buttons above to send this item to a department.</TableCell></TableRow>}</TableBody>
            </Table>
                </div>
              </CardContent></Card>

              <WorkOrderItemComments workOrderItemId={`${prNumber}-${draft.itemNumber}`} />
            </TabsContent>

            <TabsContent value="locations" className="mt-0">
              <div className="space-y-3">
                <Card className="w-fit max-w-full"><CardContent className="overflow-x-auto p-0">
                  <Table className="w-auto table-fixed">
                    <colgroup><col className="w-48" />{CAPABLE_LOCATIONS.map((location) => <col key={location} className="w-16" />)}</colgroup>
                    <TableHeader><TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="h-7 w-48 whitespace-nowrap px-2 text-[10px] font-bold text-foreground">Capability</TableHead>
                      {CAPABLE_LOCATIONS.map((location) => <TableHead key={location} className="h-10 w-16 px-0.5 text-center align-middle text-[9px] font-bold leading-tight text-foreground"><span className="inline-block max-w-14 break-words">{location}</span></TableHead>)}
                    </TableRow></TableHeader>
                    <TableBody><TableRow className="h-6 border-b border-border bg-muted/40"><TableCell className="w-48 whitespace-nowrap py-0.5 pl-2 pr-2 text-[11px] font-semibold bg-muted/30">All</TableCell>
                      {CAPABLE_LOCATIONS.map((location) => {
                        const checkedCount = locationCheckedCount(location);
                        const allChecked = checkedCount === CAPABILITY_COLUMNS.length;
                        return (
                          <TableCell key={location} className="px-0.5 py-0.5 text-center align-top">
                            <Checkbox aria-label={`${location} All`} checked={allChecked ? true : checkedCount > 0 ? "indeterminate" : false} onCheckedChange={() => toggleAllCapabilities(location)} className={`${matrixCheckboxClass} mx-auto`} />
                          </TableCell>
                        );
                      })}
                    </TableRow>{CAPABILITY_COLUMNS.map((capability) => {
                      const isLimited = capability === "17025 (Limited)";
                      const group = CAPABILITY_GROUPS.find((g) => g.includes(capability));
                      const isFirst = group?.[0] === capability;
                      const isLast = group?.[group.length - 1] === capability;
                      return (
                        <TableRow key={capability} className={`h-6 ${isFirst ? "border-t border-border" : ""} ${isLast && group ? "border-b border-border" : ""}`}>
                          <TableCell className={`w-48 whitespace-nowrap py-0.5 pr-2 text-[11px] font-medium bg-muted/30 ${group ? "pl-4" : "pl-2"}`}>
                            {capability}
                          </TableCell>
                          {CAPABLE_LOCATIONS.map((location) => {
                            const checked = Boolean(capabilityMatrix[location]?.[capability]);
                            return (
                              <TableCell key={location} className="px-0.5 py-0.5 text-center align-top">
                                <Checkbox aria-label={`${location} ${capability}`} checked={checked} onCheckedChange={() => {
                                  if (isLimited && checked) {
                                    setLimitedNotes((previous) => { const next = { ...previous }; delete next[location]; return next; });
                                  }
                                  toggleCapability(location, capability);
                                }} className={`${matrixCheckboxClass} mx-auto`} />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}</TableBody>
                  </Table>
                </CardContent></Card>
                {notesLocations.length > 0 && (
                  <Card><CardContent className="space-y-2 p-4">
                    <div className="text-xs font-semibold text-foreground">17025 (Limited) Notes</div>
                    <p className="text-[10px] text-muted-foreground">Notes for locations with 17025 (Limited) selected in the matrix above.</p>
                    {notesLocations.map((location) => (
                      <div key={location} className="flex items-center gap-2">
                        <span className="w-28 shrink-0 text-xs font-medium">{location}</span>
                        <Input aria-label={`${location} 17025 Limited note`} className="h-8 text-xs" placeholder="Add a note..." value={limitedNotes[location] ?? ""} onChange={(event) => setLimitedNotes((previous) => ({ ...previous, [location]: event.target.value }))} />
                      </div>
                    ))}
                  </CardContent></Card>
                )}
                <Card><CardContent className="p-4">
                  <div className="mb-2 text-xs font-semibold text-foreground">Breakdown of Matrix (Definitions)</div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-xs sm:grid-cols-2">{CAPABILITY_LEGEND.map((entry) => <div key={entry.term} className="flex gap-2"><span className="whitespace-nowrap font-semibold">{entry.term}:</span><span className="text-muted-foreground">{entry.def}</span></div>)}</div>
                  <p className="mt-2 text-[10px] text-muted-foreground">** Onsite capabilities are influenced by the supporting lab.</p>
                </CardContent></Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0 space-y-3">
              <Card><CardContent className="p-4">
                <div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground"><FileText className="h-5 w-5" /></span><div><h2 className="text-sm font-semibold">Add Document</h2><p className="text-xs text-muted-foreground">Upload supporting files for this product review.</p></div></div>
                <div className="grid items-end gap-3 lg:grid-cols-4">
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Document Type</Label><Select value={documentType || undefined} onValueChange={setDocumentType}><SelectTrigger aria-label="Document Type" className="h-9 text-xs"><SelectValue placeholder="Select type..." /></SelectTrigger><SelectContent>{DOCUMENT_TYPES.map((type) => <SelectItem key={type} value={type} className="text-xs">{type}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Description</Label><Input aria-label="Document Description" className="h-9 text-xs" value={documentDescription} onChange={(event) => setDocumentDescription(event.target.value)} placeholder="Brief description..." /></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Select File</Label><label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-xs hover:bg-muted"><Upload className="h-3.5 w-3.5" /><span className="font-medium">Browse</span><span className="min-w-0 truncate text-muted-foreground">{selectedFiles.length ? selectedFiles.map((file) => file.name).join(", ") : "No file selected"}</span><input type="file" multiple className="hidden" onChange={(event) => { setSelectedFiles(Array.from(event.target.files || [])); event.target.value = ""; }} /></label></div>
                  <Button className="h-9 bg-success text-xs text-success-foreground hover:bg-success/90" disabled={!documentType || selectedFiles.length === 0} onClick={addDocuments}>Upload Document</Button>
                </div>
              </CardContent></Card>
              <Card><CardContent className="p-0"><div className="border-b px-4 py-3"><h2 className="flex items-center gap-2 text-sm font-semibold">Attached Documents <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{documents.length}</span></h2></div><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-muted/40"><TableHead>Type</TableHead><TableHead>Document</TableHead><TableHead>Description</TableHead><TableHead>Uploaded By</TableHead><TableHead>Uploaded Date</TableHead></TableRow></TableHeader><TableBody>{documents.length ? documents.map((document) => <TableRow key={document.id} className="text-xs"><TableCell><span className="rounded bg-muted px-2 py-1 font-medium">{document.type}</span></TableCell><TableCell className="font-medium">{document.name}</TableCell><TableCell>{document.description || "—"}</TableCell><TableCell>{document.uploadedBy}</TableCell><TableCell>{document.uploadedDate}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="h-20 text-center text-xs text-muted-foreground">No documents have been added.</TableCell></TableRow>}</TableBody></Table></div><div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground"><span>Showing {documents.length} {documents.length === 1 ? "record" : "records"}</span><span>Page 1 of 1</span></div></CardContent></Card>
            </TabsContent>

            <TabsContent value="hours" className="mt-0 space-y-3">
              <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(280px,1fr)_2fr]">
                <Card><CardContent className="flex h-full flex-col p-4"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground"><Clock3 className="h-5 w-5" /></span><div><h2 className="text-sm font-semibold">Log Time</h2><p className="text-xs text-muted-foreground">Record work performed and time spent.</p></div></div><div className="space-y-4"><div className="space-y-1"><Label className="text-xs text-muted-foreground">Work Performed</Label><Textarea aria-label="Work Performed" className="min-h-28 resize-none text-xs" value={hoursDraft.workPerformed} onChange={(event) => setHoursDraft((previous) => ({ ...previous, workPerformed: event.target.value }))} placeholder="Describe the work completed..." /></div><div className="space-y-1"><Label className="text-xs text-muted-foreground">Hours</Label><Input aria-label="Hours" type="number" min="0.25" step="0.25" className="h-9 text-xs" value={hoursDraft.hours} onChange={(event) => setHoursDraft((previous) => ({ ...previous, hours: event.target.value }))} placeholder="0.00" /></div><Button className="h-9 w-full bg-success text-xs text-success-foreground hover:bg-success/90" onClick={addHours}>Add Hours</Button></div></CardContent></Card>
                <Card><CardContent className="flex h-full min-h-80 flex-col p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground"><Clock3 className="h-5 w-5" /></span><div><h2 className="text-sm font-semibold">Hours History</h2><p className="text-xs text-muted-foreground">All recorded time entries.</p></div></div><div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">Total <strong className="ml-2 text-sm text-foreground">{totalHours.toFixed(2)} hrs</strong></div></div><div className="mt-5 flex min-h-48 flex-1 flex-col overflow-hidden rounded-md border">{hours.length ? <Table><TableHeader><TableRow className="bg-muted/40"><TableHead>Work Performed</TableHead><TableHead>Recorded By</TableHead><TableHead>Recorded Date</TableHead><TableHead className="text-right">Hours</TableHead></TableRow></TableHeader><TableBody>{hours.map((row) => <TableRow key={row.id} className="text-xs"><TableCell className="font-medium">{row.workPerformed}</TableCell><TableCell>{row.recordedBy}</TableCell><TableCell>{row.recordedDate}</TableCell><TableCell className="text-right">{row.hours.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table> : <div className="flex flex-1 flex-col items-center justify-center text-center"><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground"><Clock3 className="h-6 w-6" /></span><p className="text-sm font-medium">No hours recorded yet</p><p className="mt-1 text-xs text-muted-foreground">Use the form to log your first entry.</p></div>}</div><div className="flex items-center justify-between px-1 pt-3 text-xs text-muted-foreground"><span>{hours.length} {hours.length === 1 ? "entry" : "entries"} recorded</span><span>Page 1 of 1</span></div></CardContent></Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="shrink-0 border-t bg-background px-2 py-2 sm:px-4 lg:px-6"><div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={onBack}><ArrowLeft />Back to PR Items</Button><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="h-8 text-xs"><MoreHorizontal />More Actions</Button></DropdownMenuTrigger><DropdownMenuContent align="start">{[...ROUTING_ACTIONS, ...DECISION_ACTIONS].map((action) => <DropdownMenuItem key={action} className="text-xs" onSelect={() => { setPendingAction(action); setRoutingComment(""); }}><span className={currentDept === ACTION_STATUS[action] ? "font-semibold text-destructive" : ""}>{action}</span>{currentDept === ACTION_STATUS[action] && <span className="ml-auto text-[10px] text-destructive">Current</span>}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu></div>
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8 text-xs"><Mail />Email Customer</Button><Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={save}><Save />Save</Button></div>
      </div></footer>

      <Dialog open={Boolean(pendingAction)} onOpenChange={(open) => { if (!open) { setPendingAction(null); setRoutingComment(""); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-sm">Add Comments</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-[130px_1fr] items-center gap-2">
              <Label className="text-right text-xs text-muted-foreground">Going to Status:</Label>
              <Input readOnly value={pendingAction ? ACTION_STATUS[pendingAction] ?? pendingAction : ""} className="h-8 bg-muted/40 text-xs" />
            </div>
            <div className="grid grid-cols-[130px_1fr] items-start gap-2">
              <Label className="pt-2 text-right text-xs text-muted-foreground">Comment:</Label>
              <Textarea aria-label="Comment" className="min-h-28 resize-none text-xs" value={routingComment} onChange={(event) => setRoutingComment(event.target.value)} />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" size="sm" className="h-8 min-w-24 text-xs" onClick={() => { setPendingAction(null); setRoutingComment(""); }}>Cancel</Button>
            <Button size="sm" className="h-8 min-w-24 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={confirmRouting}>Ok</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dueDateOpen} onOpenChange={setDueDateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-sm">Update Due Date</DialogTitle></DialogHeader>
          <p className="text-xs font-semibold">By clicking 'Ok', you acknowledge that the customer has been notified of this date change.</p>
          <div className="space-y-3">
            <div className="grid grid-cols-[130px_1fr] items-center gap-2">
              <Label className="text-right text-xs text-muted-foreground">New Due Date:</Label>
              <Input aria-label="New Due Date" placeholder="mm/dd/yyyy" className="h-8 text-xs" value={dueDateDraft} onChange={(event) => setDueDateDraft(event.target.value)} />
            </div>
            <div className="grid grid-cols-[130px_1fr] items-start gap-2">
              <Label className="pt-2 text-right text-xs text-muted-foreground">Comment:</Label>
              <Textarea aria-label="Due Date Comment" className="min-h-28 resize-none text-xs" value={dueDateComment} onChange={(event) => setDueDateComment(event.target.value)} />
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" size="sm" className="h-8 min-w-24 text-xs" onClick={() => setDueDateOpen(false)}>Cancel</Button>
            <Button size="sm" className="h-8 min-w-24 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={confirmDueDate}>Ok</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewTag() { return <span className="inline-flex rounded bg-primary px-1 py-0.5 text-[9px] font-bold leading-none text-primary-foreground">NEW</span>; }
function SectionHeading({ children, isNew = false }: { children: React.ReactNode; isNew?: boolean }) { return <h2 className="flex items-center gap-2 border-b pb-1 text-xs font-semibold">{children}{isNew && <NewTag />}</h2>; }
function Field({ label, value, onChange, disabled, suffix, isNew = false }: { label: string; value: string; onChange?: (value: string) => void; disabled?: boolean; suffix?: string; isNew?: boolean }) { return <div className="grid grid-cols-[minmax(8rem,42%)_1fr] items-center gap-2"><Label className="flex items-center justify-end gap-1 text-right text-[11px] text-muted-foreground">{label}{isNew && <NewTag />}</Label><div className="flex items-center gap-2"><Input aria-label={label} className="h-7 text-xs" value={value} disabled={disabled} onChange={(event) => onChange?.(event.target.value)} />{suffix && <span className="text-[10px] text-muted-foreground">{suffix}</span>}</div></div>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <div className="grid grid-cols-[minmax(8rem,42%)_1fr] items-center gap-2"><Label className="text-right text-[11px] text-muted-foreground">{label}</Label><Select value={value || undefined} onValueChange={onChange}><SelectTrigger aria-label={label} className="h-7 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>)}</SelectContent></Select></div>; }
function CheckField({ label }: { label: string }) { return <label className="grid grid-cols-[minmax(8rem,42%)_1fr] items-center gap-2 text-[11px]"><span className="text-right text-muted-foreground">{label}</span><Checkbox /></label>; }
