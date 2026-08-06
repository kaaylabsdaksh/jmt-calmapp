import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Plus,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const LOCATIONS = ["Alexandria", "Baton Rouge", "Houston", "Round Rock", "Lafayette", "Beaumont"];
const DIVISIONS = ["ESL", "OnSite", "MFG", "ITL", "Rental", "Lab", "Surplus", "ESL Onsite", "ITL Onsite", "GMFG", "Field Service"];
const ROUTES = ["Quality", "Technical", "Safety", "Onsite", "Receiving", "Service", "Sales", "Rental", "Training", "Manufacturing", "Contracts", "Field Service", "Surplus", "To Factory", "AR", "Other"];
const PRIORITIES = ["Low", "Normal", "High", "Critical"];
const CDR_TYPES = ["Contract Review", "Pricing Agreement", "Safety Document", "Quality Spec", "Purchase Terms"];
const RECEIVED_METHODS = ["Email", "Fax", "Mail", "Customer Portal", "In Person"];
const DOC_TYPES = ["Contract", "Specification", "Purchase Order", "Certificate", "Correspondence", "Other"];

type Account = { id: string; acct: string; customer: string; shipTo: string; city: string; state: string; srDocument: string };
type DocumentRow = { id: string; name: string; type: string; description: string };

const seedAccounts: Account[] = [
  { id: "a1", acct: "3872.00", customer: "Ultra Electronics NSPI", shipTo: "707 Jeffrey Way", city: "Round Rock", state: "TX", srDocument: "SR-88213" },
  { id: "a2", acct: "10428.00", customer: "Lone Star Electric Co-op", shipTo: "Main Warehouse - Dock 4", city: "Houston", state: "TX", srDocument: "" },
];

export default function NewCdr() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [divisions, setDivisions] = useState<string[]>([]);
  const [divisionOpen, setDivisionOpen] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState("yes");
  const [accounts, setAccounts] = useState<Account[]>(seedAccounts);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(["a2"]);
  const [customerName, setCustomerName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [contactFirst, setContactFirst] = useState("");
  const [contactLast, setContactLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [priority, setPriority] = useState("");
  const [cdrType, setCdrType] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [dateReceived, setDateReceived] = useState<Date>();
  const [howReceived, setHowReceived] = useState("");
  const [routes, setRoutes] = useState<string[]>([]);
  const [otherRoute, setOtherRoute] = useState("");
  const [docType, setDocType] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const fieldLabel = "text-[11px] font-medium text-foreground";
  const fieldClass = "h-8 text-xs";
  const toggleDivision = (division: string) => setDivisions((current) => current.includes(division) ? current.filter((item) => item !== division) : [...current, division]);
  const toggleRoute = (route: string) => setRoutes((current) => current.includes(route) ? current.filter((item) => item !== route) : [...current, route]);
  const toggleAccount = (id: string) => setSelectedAccounts((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const stepOneInvalid = !location || divisions.length === 0 || (existingCustomer === "yes" ? selectedAccounts.length === 0 : !customerName.trim());
  const stepTwoInvalid = !priority || !cdrType || !dateReceived || !howReceived || routes.length === 0;

  const goNext = () => {
    setSubmitted(true);
    if (stepOneInvalid) {
      toast({ title: "Complete required customer details", description: "Location, division and customer information are required.", variant: "destructive" });
      return;
    }
    setSubmitted(false);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addFiles = (files: FileList | null) => {
    if (!files || !docType) {
      toast({ title: "Select a document type first", variant: "destructive" });
      return;
    }
    setDocuments((current) => [
      ...current,
      ...Array.from(files).map((file, index) => ({ id: `${Date.now()}-${index}`, name: file.name, type: docType, description: docDescription })),
    ]);
    setDocDescription("");
  };

  const saveCdr = () => {
    setSubmitted(true);
    if (stepTwoInvalid) {
      toast({ title: "Complete required CDR details", description: "Priority, type, received details and at least one route are required.", variant: "destructive" });
      return;
    }
    setConfirmationOpen(true);
  };

  const confirmCreateCdr = () => {
    setConfirmationOpen(false);
    const createdCdrId = "1030";
    toast({ title: "CDR created", description: `CDR #${createdCdrId} has been saved and opened for editing.` });
    navigate(`/manage-customers/cdr/${createdCdrId}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <ModernTopNav />
      <main className="mx-auto max-w-[1240px] px-3 pb-24 pt-4 sm:px-5">
        <div className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Add New CDR</h1>
            <p className="text-xs text-muted-foreground">Create a customer document review and route it to the appropriate teams.</p>
          </div>
          <ol className="flex min-w-[280px] items-center" aria-label="CDR creation progress">
            {[1, 2].map((item) => (
              <li key={item} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-2">
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold", step >= item ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground")}>
                    {step > item ? <Check className="h-3.5 w-3.5" /> : item}
                  </span>
                  <span className={cn("hidden text-xs font-medium sm:block", step === item ? "text-foreground" : "text-muted-foreground")}>{item === 1 ? "Customer" : "Review details"}</span>
                </div>
                {item === 1 && <span className={cn("mx-3 h-px flex-1", step === 2 ? "bg-foreground" : "bg-border")} />}
              </li>
            ))}
          </ol>
        </div>

        {step === 1 ? (
          <div className="space-y-3">
            <Card>
              <CardHeader className="px-4 pb-2 pt-3"><CardTitle className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />Location & Division</CardTitle></CardHeader>
              <CardContent className="grid gap-3 px-4 pb-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className={fieldLabel}>JM Location <span className="text-destructive">*</span></Label>
                  <Select value={location} onValueChange={setLocation}><SelectTrigger className={fieldClass}><SelectValue placeholder="Select location" /></SelectTrigger><SelectContent>{LOCATIONS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
                  {submitted && !location && <p className="text-[10px] text-destructive">Location is required.</p>}
                </div>
                <div className="space-y-1">
                  <Label className={fieldLabel}>Division(s) <span className="text-destructive">*</span></Label>
                  <Popover open={divisionOpen} onOpenChange={setDivisionOpen}>
                    <PopoverTrigger asChild><Button variant="outline" className={cn(fieldClass, "w-full justify-between px-3 font-normal")}>{divisions.length ? `${divisions.length} selected` : "Select divisions"}<ChevronRight className="h-3.5 w-3.5 rotate-90" /></Button></PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-2">
                      <div className="mb-2 flex items-center justify-between border-b pb-2"><Button variant="ghost" size="sm" className="h-6 text-[11px]" onClick={() => setDivisions(DIVISIONS)}>Select All</Button><Button variant="ghost" size="sm" className="h-6 text-[11px]" onClick={() => setDivisions([])}>Unselect All</Button></div>
                      <div className="grid grid-cols-2 gap-1">{DIVISIONS.map((division) => <label key={division} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted"><Checkbox checked={divisions.includes(division)} onCheckedChange={() => toggleDivision(division)} />{division}</label>)}</div>
                    </PopoverContent>
                  </Popover>
                  {submitted && divisions.length === 0 && <p className="text-[10px] text-destructive">Select at least one division.</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-4 pb-2 pt-3"><CardTitle className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-muted-foreground" />Customer Information</CardTitle></CardHeader>
              <CardContent className="space-y-3 px-4 pb-4">
                <div className="flex flex-wrap items-center gap-4 border-b pb-3">
                  <Label className={fieldLabel}>Existing Customer <span className="text-destructive">*</span></Label>
                  <RadioGroup value={existingCustomer} onValueChange={setExistingCustomer} className="flex gap-4">
                    <label className="flex cursor-pointer items-center gap-2 text-xs"><RadioGroupItem value="yes" />Yes</label>
                    <label className="flex cursor-pointer items-center gap-2 text-xs"><RadioGroupItem value="no" />No</label>
                  </RadioGroup>
                </div>
                {existingCustomer === "yes" ? (
                  <div className="space-y-2">
                    <div className="overflow-hidden rounded-md border">
                      <Table>
                        <TableHeader><TableRow className="bg-muted/60"><TableHead className="w-10" /><TableHead>Acct</TableHead><TableHead>Customer</TableHead><TableHead>Ship To</TableHead><TableHead>City</TableHead><TableHead>State</TableHead><TableHead>SR Document</TableHead></TableRow></TableHeader>
                        <TableBody>{accounts.map((row) => <TableRow key={row.id}><TableCell><Checkbox checked={selectedAccounts.includes(row.id)} onCheckedChange={() => toggleAccount(row.id)} aria-label={`Select account ${row.acct}`} /></TableCell><TableCell className="text-xs font-medium text-foreground">{row.acct}</TableCell><TableCell className="text-xs">{row.customer}</TableCell><TableCell className="text-xs">{row.shipTo}</TableCell><TableCell className="text-xs">{row.city}</TableCell><TableCell className="text-xs">{row.state}</TableCell><TableCell className="text-xs">{row.srDocument || "—"}</TableCell></TableRow>)}</TableBody>
                      </Table>
                    </div>
                    <div className="flex items-center justify-between"><p className="text-[10px] text-muted-foreground">Select one or more customer accounts for this review.</p><Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast({ title: "Account search opened", description: "Search and selection is ready for integration." })}><Plus className="mr-1.5 h-3.5 w-3.5" />Add / Remove Accounts</Button></div>
                    {submitted && selectedAccounts.length === 0 && <p className="text-[10px] text-destructive">Select at least one account.</p>}
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-12">
                    <div className="space-y-1 md:col-span-6"><Label className={fieldLabel}>Customer Name <span className="text-destructive">*</span></Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={fieldClass} /></div>
                    <div className="space-y-1 md:col-span-6"><Label className={fieldLabel}>Ship Address</Label><Input value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Address line 1" className={fieldClass} /></div>
                    <div className="space-y-1 md:col-span-6 md:col-start-7"><Input value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Address line 2" className={fieldClass} /></div>
                    <div className="space-y-1 md:col-span-5"><Label className={fieldLabel}>Ship City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass} /></div>
                    <div className="space-y-1 md:col-span-3"><Label className={fieldLabel}>State</Label><Input value={state} onChange={(e) => setState(e.target.value)} className={fieldClass} /></div>
                    <div className="space-y-1 md:col-span-4"><Label className={fieldLabel}>ZIP</Label><Input value={zip} onChange={(e) => setZip(e.target.value)} className={fieldClass} /></div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-4 pb-2 pt-3"><CardTitle className="flex items-center gap-2 text-sm"><UserRound className="h-4 w-4 text-muted-foreground" />Primary Contact</CardTitle></CardHeader>
              <CardContent className="grid gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1"><Label className={fieldLabel}>First Name</Label><Input value={contactFirst} onChange={(e) => setContactFirst(e.target.value)} className={fieldClass} /></div>
                <div className="space-y-1"><Label className={fieldLabel}>Last Name</Label><Input value={contactLast} onChange={(e) => setContactLast(e.target.value)} className={fieldClass} /></div>
                <div className="space-y-1"><Label className={fieldLabel}>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(___) ___-____" className={fieldClass} /></div>
                <div className="space-y-1"><Label className={fieldLabel}>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} /></div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-3">
            <Card>
              <CardHeader className="px-4 pb-2 pt-3"><CardTitle className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-muted-foreground" />CDR Details</CardTitle></CardHeader>
              <CardContent className="grid gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-1"><Label className={fieldLabel}>Priority <span className="text-destructive">*</span></Label><Select value={priority} onValueChange={setPriority}><SelectTrigger className={fieldClass}><SelectValue placeholder="Select priority" /></SelectTrigger><SelectContent>{PRIORITIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1"><Label className={fieldLabel}>CDR Type <span className="text-destructive">*</span></Label><Select value={cdrType} onValueChange={setCdrType}><SelectTrigger className={fieldClass}><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{CDR_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1"><Label className={fieldLabel}>Existing Work Order</Label><Input value={workOrder} onChange={(e) => setWorkOrder(e.target.value.replace(/\D/g, ""))} placeholder="Work order #" className={fieldClass} /></div>
                <div className="space-y-1"><Label className={fieldLabel}>Date Received <span className="text-destructive">*</span></Label><ModernDatePicker value={dateReceived} onChange={setDateReceived} size="md" /></div>
                <div className="space-y-1"><Label className={fieldLabel}>How Received <span className="text-destructive">*</span></Label><Select value={howReceived} onValueChange={setHowReceived}><SelectTrigger className={fieldClass}><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent>{RECEIVED_METHODS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-4 pb-2 pt-3"><CardTitle className="text-sm">Route To <span className="text-destructive">*</span></CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">{ROUTES.map((route) => <label key={route} className={cn("flex min-h-8 cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors", routes.includes(route) ? "border-foreground bg-muted text-foreground" : "bg-background hover:bg-muted/60")}><Checkbox checked={routes.includes(route)} onCheckedChange={() => toggleRoute(route)} />{route}</label>)}</div>
                {routes.includes("Other") && <Input value={otherRoute} onChange={(e) => setOtherRoute(e.target.value)} placeholder="Enter other routing destination" className="mt-2 h-8 max-w-md text-xs" />}
                {submitted && routes.length === 0 && <p className="mt-1 text-[10px] text-destructive">Select at least one routing destination.</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-4 pb-2 pt-3"><CardTitle className="flex items-center gap-2 text-sm"><Upload className="h-4 w-4 text-muted-foreground" />Documents</CardTitle></CardHeader>
              <CardContent className="space-y-3 px-4 pb-4">
                <div className="grid gap-3 lg:grid-cols-[220px_1fr_280px]">
                  <div className="space-y-1"><Label className={fieldLabel}>Type</Label><Select value={docType} onValueChange={setDocType}><SelectTrigger className={fieldClass}><SelectValue placeholder="Select document type" /></SelectTrigger><SelectContent>{DOC_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-1"><Label className={fieldLabel}>Description</Label><Textarea value={docDescription} onChange={(e) => setDocDescription(e.target.value)} className="min-h-8 resize-none py-1.5 text-xs" rows={1} /></div>
                  <label className={cn("flex h-[54px] cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-3 text-xs", docType ? "hover:bg-muted/60" : "cursor-not-allowed opacity-50")}><Upload className="h-4 w-4 text-muted-foreground" />Drop files or <span className="font-medium text-foreground">browse</span><input type="file" multiple disabled={!docType} className="hidden" onChange={(e) => addFiles(e.target.files)} /></label>
                </div>
                <div className="overflow-hidden rounded-md border">
                  <Table><TableHeader><TableRow className="bg-muted/60"><TableHead>Document</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="w-12" /></TableRow></TableHeader><TableBody>{documents.length ? documents.map((doc) => <TableRow key={doc.id}><TableCell className="text-xs font-medium">{doc.name}</TableCell><TableCell className="text-xs">{doc.type}</TableCell><TableCell className="text-xs">{doc.description || "—"}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDocuments((current) => current.filter((item) => item.id !== doc.id))} aria-label={`Remove ${doc.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="h-16 text-center text-xs text-muted-foreground">No documents added</TableCell></TableRow>}</TableBody></Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-customers/cdr")}>Cancel</Button>
          <div className="flex items-center gap-2">
            {step === 2 && <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setSubmitted(false); setStep(1); }}><ChevronLeft className="mr-1 h-3.5 w-3.5" />Back</Button>}
            {step === 1 ? <Button size="sm" className="h-8 bg-foreground text-xs text-background hover:bg-foreground/90" onClick={goNext}>Next<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button> : <Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={saveCdr}><Check className="mr-1.5 h-3.5 w-3.5" />Create CDR</Button>}
          </div>
        </div>
      </footer>

      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent className="max-w-md gap-0 p-0">
          <AlertDialogHeader className="border-b px-5 py-4">
            <AlertDialogTitle className="flex items-center gap-2 text-base">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success">
                <FileText className="h-4 w-4" />
              </span>
              Create this CDR?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Review the details below before creating the customer document review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4 text-xs">
            <div><p className="text-muted-foreground">Location</p><p className="mt-0.5 font-medium text-foreground">{location}</p></div>
            <div><p className="text-muted-foreground">Priority</p><p className="mt-0.5 font-medium text-foreground">{priority}</p></div>
            <div><p className="text-muted-foreground">CDR Type</p><p className="mt-0.5 font-medium text-foreground">{cdrType}</p></div>
            <div><p className="text-muted-foreground">Routing</p><p className="mt-0.5 font-medium text-foreground">{routes.join(", ")}</p></div>
          </div>
          <AlertDialogFooter className="border-t bg-muted/30 px-5 py-3">
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={confirmCreateCdr}>
              <Check className="mr-1.5 h-3.5 w-3.5" />Create CDR
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}