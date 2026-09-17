import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, Plus, Save, Search, Trash2, UserPlus, X } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ProductReviewItemWorkspace, { type ProductReviewItem } from "@/components/products/ProductReviewItemWorkspace";
import { WorkOrderItemComments } from "@/components/WorkOrderItemComments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PRODUCT_REVIEWS } from "@/lib/product-reviews";

const MATCHES = [
  { manufacturer: "FLUKE", model: "789", description: "PROCESSMETER" },
  { manufacturer: "FLUKE", model: "789", description: "MULTIFUNCTION PROCESS CALIBRATOR" },
  { manufacturer: "FLUKE", model: "789-12", description: "PROCESSMETER" },
];

type ReviewDraft = {
  quote: string;
  existingCustomer: string;
  account: string;
  customer: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  srDoc: string;
  osrDoc: string;
  contact: string;
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  fax: string;
  cell: string;
  email: string;
};

type ItemDraft = {
  manufacturer: string;
  model: string;
  manufacturerUnknown: boolean;
  modelUnknown: boolean;
  manufacturerNew: boolean;
  modelNew: boolean;
  description: string;
  calibratedBefore: string;
  calibrationReason: string;
  reportsAvailable: string;
};

const EMPTY_REVIEW: ReviewDraft = { quote: "", existingCustomer: "Yes", account: "", customer: "", address1: "", address2: "", address3: "", city: "", state: "", zip: "", status: "Open", srDoc: "", osrDoc: "", contact: "", firstName: "", lastName: "", title: "", phone: "", fax: "", cell: "", email: "" };
const EMPTY_ITEM: ItemDraft = { manufacturer: "", model: "", manufacturerUnknown: false, modelUnknown: false, manufacturerNew: false, modelNew: false, description: "", calibratedBefore: "", calibrationReason: "", reportsAvailable: "" };

type ContactDraft = { firstName: string; lastName: string; title: string; phone: string; fax: string; cell: string; email: string };
const EMPTY_CONTACT: ContactDraft = { firstName: "", lastName: "", title: "", phone: "", fax: "", cell: "", email: "" };
const DEFAULT_CONTACTS = ["AK Alpha", "Dana Scott", "Jordan Lee"];


export default function NewProductReview() {
  const navigate = useNavigate();
  const { prNumber: existingPrNumber } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const existingRows = PRODUCT_REVIEWS.filter((row) => row.pr === existingPrNumber);
  const existingRow = existingRows[0];
  const customerMatch = existingRow?.customer.match(/^(.*) \(([^)]+)\)$/);
  const initialReview: ReviewDraft = existingRow ? { ...EMPTY_REVIEW, account: customerMatch?.[2] || "", customer: customerMatch?.[1] || existingRow.customer, address1: "Saved customer address", city: "Customer city", state: "LA", zip: "70801", status: "Open", contact: existingRow.createdBy, firstName: existingRow.createdBy.split(" ")[0] || "", lastName: existingRow.createdBy.split(" ").slice(1).join(" "), phone: "(555) 010-2200", email: `${existingRow.createdBy.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@customer.com` } : EMPTY_REVIEW;
  const initialItems: ProductReviewItem[] = existingRows.map((row) => ({ id: `${row.pr}-${row.item}`, itemNumber: row.item, manufacturer: row.manufacturer, model: row.model, description: row.description, location: row.loc, division: row.division === "Lab" ? "Regular" : row.division || "Regular", createdDate: row.createdDate.split(" ")[0], dueDate: row.dueDate, completedDate: "", status: row.status, calibratedBefore: "Yes", calibrationReason: "", reportsAvailable: "Yes" }));
  const requestedItem = searchParams.get("item");
  const [review, setReview] = useState<ReviewDraft>(initialReview);
  const [prNumber, setPrNumber] = useState(existingPrNumber || "");
  const [audit, setAudit] = useState({ createdBy: existingRow?.createdBy || "", modifiedBy: existingRow?.createdBy || "" });

  const [items, setItems] = useState<ProductReviewItem[]>(initialItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(() => requestedItem ? initialItems.find((item) => item.itemNumber === requestedItem)?.id || null : null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [itemDraft, setItemDraft] = useState<ItemDraft>(EMPTY_ITEM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contactOpen, setContactOpen] = useState(false);
  const [contactDraft, setContactDraft] = useState<ContactDraft>(EMPTY_CONTACT);
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [contactOptions, setContactOptions] = useState<string[]>(DEFAULT_CONTACTS);


  const selectedItem = items.find((item) => item.id === selectedItemId);
  const matches = useMemo(() => MATCHES.filter((match) => (!itemDraft.manufacturer || match.manufacturer.includes(itemDraft.manufacturer.toUpperCase())) && (!itemDraft.model || match.model.includes(itemDraft.model.toUpperCase()))), [itemDraft.manufacturer, itemDraft.model]);
  const setReviewField = (key: keyof ReviewDraft, value: string) => setReview((previous) => ({ ...previous, [key]: value }));
  const setItemField = <K extends keyof ItemDraft>(key: K, value: ItemDraft[K]) => setItemDraft((previous) => ({ ...previous, [key]: value }));

  if (selectedItem) {
    return <div className="flex h-dvh flex-col bg-background"><ModernTopNav /><ProductReviewItemWorkspace prNumber={prNumber} item={selectedItem} onBack={() => setSelectedItemId(null)} onUpdate={(updated) => setItems((previous) => previous.map((item) => item.id === updated.id ? updated : item))} /></div>;
  }

  const addContact = () => {
    const nextErrors: Record<string, string> = {};
    if (!contactDraft.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!contactDraft.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!contactDraft.phone.trim()) nextErrors.phone = "Phone is required.";
    if (!contactDraft.email.trim()) nextErrors.email = "Email is required.";
    setContactErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const name = `${contactDraft.firstName.trim()} ${contactDraft.lastName.trim()}`;
    setContactOptions((previous) => previous.includes(name) ? previous : [...previous, name]);
    setReview((previous) => ({ ...previous, contact: name, ...contactDraft }));
    setErrors((previous) => ({ ...previous, contact: "" }));
    setContactOpen(false);
    toast({ title: "Contact added", description: `${name} is now the selected customer contact.` });
  };

  const saveReview = () => {

    const nextErrors: Record<string, string> = {};
    if (!review.account.trim()) nextErrors.account = "Account number is required.";
    if (!review.customer.trim()) nextErrors.customer = "Customer name is required.";
    if (!review.contact.trim()) nextErrors.contact = "Select a customer contact.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const number = prNumber || `PR${String(10579 + Math.floor(Math.random() * 300)).padStart(5, "0")}`;
    setPrNumber(number);
    setAudit({ createdBy: audit.createdBy || "Admin User", modifiedBy: "Admin User" });
    toast({ title: "Product review saved", description: `${number} is ready for PR items.` });
  };

  const validateWizard = () => {
    const nextErrors: Record<string, string> = {};
    if (wizardStep === 1) {
      if (!itemDraft.manufacturer.trim() && !itemDraft.manufacturerUnknown) nextErrors.manufacturer = "Manufacturer is required or select Unknown.";
      if (!itemDraft.model.trim() && !itemDraft.modelUnknown) nextErrors.model = "Model is required or select Unknown.";
    }
    if (wizardStep === 2 && !itemDraft.description.trim()) nextErrors.description = "Product description is required.";
    if (wizardStep === 3) {
      if (!itemDraft.calibratedBefore) nextErrors.calibratedBefore = "Select Yes or No.";
      if (itemDraft.calibratedBefore === "No" && !itemDraft.calibrationReason.trim()) nextErrors.calibrationReason = "Explain why calibration is needed.";
      if (!itemDraft.reportsAvailable) nextErrors.reportsAvailable = "Select Yes or No.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return false;
    setWizardStep((step) => Math.min(4, step + 1));
    return true;
  };

  const addItem = () => {
    const item: ProductReviewItem = {
      id: String(Date.now()), itemNumber: String(items.length + 1).padStart(3, "0"),
      manufacturer: itemDraft.manufacturerUnknown ? "UNKNOWN" : itemDraft.manufacturer.toUpperCase(),
      model: itemDraft.modelUnknown ? "UNKNOWN" : itemDraft.model.toUpperCase(), description: itemDraft.description.toUpperCase(),
      location: "Alexandria", division: "Regular", createdDate: new Date().toLocaleDateString("en-US"),
      dueDate: new Date(Date.now() + 86400000).toLocaleDateString("en-US"), completedDate: "", status: "Review Initiated",
      calibratedBefore: itemDraft.calibratedBefore, calibrationReason: itemDraft.calibrationReason, reportsAvailable: itemDraft.reportsAvailable,
    };
    setItems((previous) => [...previous, item]);
    setWizardOpen(false); setWizardStep(1); setItemDraft(EMPTY_ITEM); setErrors({}); setSelectedItemId(item.id);
  };

  const openWizard = () => { setWizardStep(1); setItemDraft(EMPTY_ITEM); setErrors({}); setWizardOpen(true); };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <ModernTopNav />
      <main className="flex-1 overflow-auto px-2 py-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-[1500px] space-y-3">
          <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b bg-background py-2">
            <div><h1 className="text-lg font-semibold">{prNumber || "Adding New Product Review"}</h1><p className="text-xs text-muted-foreground">{existingPrNumber ? "Saved Product Review" : "Product Review Details"} · {review.customer || "Customer not selected"}</p></div>
            <div className="flex items-center gap-2"><span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-medium"><span className="h-1.5 w-1.5 rounded-full bg-info" />{review.status}</span>{prNumber && <span className="text-[10px] text-muted-foreground">Created by Admin User · Today</span>}</div>
          </div>

          <div className="space-y-3">
              {errors.save && <ValidationMessage text={errors.save} />}
              <Card><CardContent className="p-0">
                <SectionTitle title="Customer and review" />
                <div className="grid gap-x-3 gap-y-2 p-2 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Quote #" value={review.quote} onChange={(value) => setReviewField("quote", value)} />
                  <SelectField label="Existing Customer" value={review.existingCustomer} options={["Yes", "No"]} onChange={(value) => setReviewField("existingCustomer", value)} />
                  <Field label="Account #" value={review.account} onChange={(value) => setReviewField("account", value)} error={errors.account} required suffix={<Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => { setReview((previous) => ({ ...previous, account: "00000.00", customer: "Test", address1: "123 Test Drive", city: "Toms River", state: "NJ", zip: "70353", contact: "AK Alpha", firstName: "AK", lastName: "Alpha", phone: "(123) 123-1231", cell: "(123) 123-1234" })); setErrors({}); }}><Search />Find</Button>} />
                  <Field label="Customer Name" value={review.customer} onChange={(value) => setReviewField("customer", value)} error={errors.customer} required />
                  <SelectField label="PR Status" value={review.status} options={["Open", "On Hold", "Completed", "Cancelled"]} onChange={(value) => setReviewField("status", value)} />
                  <Field label="SR Doc" value={review.srDoc} onChange={(value) => setReviewField("srDoc", value)} />
                  <Field label="OSR Doc" value={review.osrDoc} onChange={(value) => setReviewField("osrDoc", value)} />
                </div>
                <SectionTitle title="Audit information" />
                <div className="grid gap-x-3 gap-y-2 p-2 md:grid-cols-2 xl:grid-cols-4">
                  <AuditValue label="Created by" value={audit.createdBy} />
                  <AuditValue label="Modified by" value={audit.modifiedBy} />
                </div>
              </CardContent></Card>

              <Card><CardContent className="p-0"><SectionTitle title="Customer contact" action={<Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { setContactDraft(EMPTY_CONTACT); setContactErrors({}); setContactOpen(true); }}><UserPlus />Add Contact</Button>} />
                <div className="grid gap-x-3 gap-y-2 p-2 md:grid-cols-2 xl:grid-cols-4">
                  <SelectField label="Select Contact" value={review.contact} options={contactOptions} onChange={(value) => { setReviewField("contact", value); if (value === "AK Alpha") setReview((previous) => ({ ...previous, contact: value, firstName: "AK", lastName: "Alpha", phone: "(123) 123-1231", cell: "(123) 123-1234" })); }} error={errors.contact} required />

                  <Field label="First Name" value={review.firstName} onChange={(value) => setReviewField("firstName", value)} />
                  <Field label="Last Name" value={review.lastName} onChange={(value) => setReviewField("lastName", value)} />
                  <Field label="Title" value={review.title} onChange={(value) => setReviewField("title", value)} />
                  <Field label="Phone" value={review.phone} onChange={(value) => setReviewField("phone", value)} />
                  <Field label="Fax" value={review.fax} onChange={(value) => setReviewField("fax", value)} />
                  <Field label="Cell" value={review.cell} onChange={(value) => setReviewField("cell", value)} />
                  <Field label="Email" value={review.email} onChange={(value) => setReviewField("email", value)} />
                </div>
                <SectionTitle title="Shipping address" />
                <div className="grid gap-x-3 gap-y-2 p-2 md:grid-cols-3 xl:grid-cols-5">
                  <Field label="Address Line 1" value={review.address1} onChange={(value) => setReviewField("address1", value)} />
                  <Field label="Address Line 2" value={review.address2} onChange={(value) => setReviewField("address2", value)} />
                  <Field label="Address Line 3" value={review.address3} onChange={(value) => setReviewField("address3", value)} />
                  <Field label="Ship City" value={review.city} onChange={(value) => setReviewField("city", value)} />
                  <SelectField label="State" value={review.state} options={["AL", "LA", "NJ", "NY", "TX"]} onChange={(value) => setReviewField("state", value)} />
                  <Field label="ZIP" value={review.zip} onChange={(value) => setReviewField("zip", value)} />
                </div>
              </CardContent></Card>

              <Card><CardContent className="p-0">
                <SectionTitle title={`PR Items${items.length > 0 ? ` (${items.length})` : ""}`} action={<Button size="sm" className="h-7 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={() => { if (!prNumber) { setErrors({ save: "Save the review details before adding PR items." }); return; } openWizard(); }}><Plus />Add New Item</Button>} />
                <div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-muted/40">{["Item", "Manufacturer", "Model", "Description", "Location", "Division", "Created Date", "Due Date", "Completed Date", "PR Item Status"].map((heading) => <TableHead key={heading} className="h-8 whitespace-nowrap px-2 text-[11px]">{heading}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>{items.length === 0 ? <TableRow><TableCell colSpan={10} className="py-10 text-center text-xs text-muted-foreground">No PR items yet. Add the first item to this review.</TableCell></TableRow> : items.map((item) => <TableRow key={item.id} className="text-xs"><TableCell className="px-2 py-1.5"><Button variant="link" className="h-auto p-0 text-xs text-foreground underline" onClick={() => setSelectedItemId(item.id)}>{item.itemNumber}</Button></TableCell><TableCell>{item.manufacturer}</TableCell><TableCell>{item.model}</TableCell><TableCell className="max-w-64 truncate" title={item.description}>{item.description}</TableCell><TableCell>{item.location}</TableCell><TableCell>{item.division}</TableCell><TableCell>{item.createdDate}</TableCell><TableCell>{item.dueDate}</TableCell><TableCell>{item.completedDate || "—"}</TableCell><TableCell><span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px]"><span className="h-1.5 w-1.5 rounded-full bg-info" />{item.status}</span></TableCell></TableRow>)}</TableBody>
                </Table></div>
              </CardContent></Card>

              {prNumber && <WorkOrderItemComments workOrderItemId={prNumber} />}
          </div>

        </div>
      </main>

      <footer className="shrink-0 border-t bg-background px-2 py-2 sm:px-4 lg:px-6"><div className="flex flex-wrap items-center justify-between gap-2"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-products/product-reviews")}><ArrowLeft />Back to Product Reviews</Button><div className="flex items-center gap-2">{prNumber && <Button variant="outline" size="sm" className="h-8 text-xs text-destructive" onClick={() => navigate("/manage-products/product-reviews")}><Trash2 />Delete PR</Button>}<Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-products/product-reviews")}><X />Cancel</Button>{<Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={saveReview}><Save />{prNumber ? "Save Changes" : "Save & Continue"}</Button>}</div></div></footer>

      <Dialog open={wizardOpen} onOpenChange={(open) => { setWizardOpen(open); if (!open) setErrors({}); }}><DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <DialogHeader className="border-b px-5 py-4"><DialogTitle className="text-base">Add PR Item</DialogTitle><DialogDescription className="text-xs">Enter product information and review it before adding the item.</DialogDescription></DialogHeader>
        <div className="px-5 pt-4"><div className="grid grid-cols-4 gap-1">{["Product", "Description", "Calibration", "Review"].map((label, index) => <div key={label} className="space-y-1"><div className={cn("h-1 rounded-full", wizardStep >= index + 1 ? "bg-info" : "bg-muted")} /><div className={cn("text-[10px]", wizardStep === index + 1 ? "font-semibold text-foreground" : "text-muted-foreground")}>{index + 1}. {label}</div></div>)}</div></div>
        <div className="min-h-72 p-5">
          {wizardStep === 1 && <div className="space-y-4"><div className="rounded-md border border-info/30 bg-info/10 p-3 text-xs text-foreground">Search by manufacturer and model to check whether the product already exists.</div><div className="grid gap-4 md:grid-cols-2">
            <WizardSearchField label="Manufacturer" value={itemDraft.manufacturer} onChange={(value) => setItemField("manufacturer", value)} unknown={itemDraft.manufacturerUnknown} onUnknown={(checked) => setItemDraft((previous) => ({ ...previous, manufacturerUnknown: checked, manufacturer: checked ? "" : previous.manufacturer }))} newItem={itemDraft.manufacturerNew} onNewItem={(checked) => setItemField("manufacturerNew", checked)} error={errors.manufacturer} />
            <WizardSearchField label="Model" value={itemDraft.model} onChange={(value) => setItemField("model", value)} unknown={itemDraft.modelUnknown} onUnknown={(checked) => setItemDraft((previous) => ({ ...previous, modelUnknown: checked, model: checked ? "" : previous.model }))} newItem={itemDraft.modelNew} onNewItem={(checked) => setItemField("modelNew", checked)} error={errors.model} />
          </div>{matches.length > 0 && <div className="rounded-md border"><Table><TableHeader><TableRow className="bg-muted/40"><TableHead>Manufacturer</TableHead><TableHead>Model</TableHead><TableHead>Description</TableHead><TableHead className="w-20" /></TableRow></TableHeader><TableBody>{matches.map((match) => <TableRow key={`${match.model}-${match.description}`} className="text-xs"><TableCell>{match.manufacturer}</TableCell><TableCell>{match.model}</TableCell><TableCell>{match.description}</TableCell><TableCell><Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setItemDraft((previous) => ({ ...previous, manufacturer: match.manufacturer, model: match.model, description: match.description }))}>Use</Button></TableCell></TableRow>)}</TableBody></Table></div>}</div>}
          {wizardStep === 2 && <div className="mx-auto max-w-2xl space-y-4"><SummaryStrip draft={itemDraft} /><div className="space-y-1"><Label className="text-xs font-medium">Product Description <span className="text-destructive">*</span></Label><div className="flex gap-2"><Input value={itemDraft.description} onChange={(event) => setItemField("description", event.target.value)} className="h-9 text-xs" placeholder="Describe the product" /><Button variant="outline" size="icon" className="h-9 w-9" aria-label="Search descriptions"><Search /></Button></div>{errors.description && <ErrorText text={errors.description} />}</div></div>}
          {wizardStep === 3 && <div className="mx-auto max-w-2xl space-y-4"><SummaryStrip draft={itemDraft} /><SelectField label="Has the unit been calibrated before?" value={itemDraft.calibratedBefore} options={["Yes", "No"]} onChange={(value) => setItemField("calibratedBefore", value)} error={errors.calibratedBefore} required />{itemDraft.calibratedBefore === "No" && <div className="space-y-1"><Label className="text-xs">Why does the product need to be calibrated? <span className="text-destructive">*</span></Label><Textarea value={itemDraft.calibrationReason} onChange={(event) => setItemField("calibrationReason", event.target.value)} className="min-h-24 text-xs" />{errors.calibrationReason && <ErrorText text={errors.calibrationReason} />}</div>}<SelectField label="Can datasheet/test reports be provided if needed?" value={itemDraft.reportsAvailable} options={["Yes", "No"]} onChange={(value) => setItemField("reportsAvailable", value)} error={errors.reportsAvailable} required /></div>}
          {wizardStep === 4 && <div className="mx-auto max-w-2xl space-y-4"><div className="rounded-md border border-success/30 bg-success/10 p-3 text-center text-xs font-medium">Review your choices, then add this item to the Product Review.</div><Card><CardContent className="grid gap-4 p-4 sm:grid-cols-2"><ReviewValue label="Manufacturer" value={itemDraft.manufacturerUnknown ? "Unknown" : itemDraft.manufacturer} /><ReviewValue label="Model" value={itemDraft.modelUnknown ? "Unknown" : itemDraft.model} /><ReviewValue label="Description" value={itemDraft.description} /><ReviewValue label="Calibrated Before" value={itemDraft.calibratedBefore} /><ReviewValue label="Reports Available" value={itemDraft.reportsAvailable} /><ReviewValue label="Calibration Reason" value={itemDraft.calibrationReason || "Not required"} /></CardContent></Card></div>}
        </div>
        <div className="flex items-center justify-between border-t bg-muted/20 px-5 py-3"><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setWizardOpen(false)}><X />Cancel</Button><div className="flex gap-2">{wizardStep > 1 && <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setWizardStep((step) => step - 1); setErrors({}); }}><ArrowLeft />Previous</Button>}{wizardStep < 4 ? <Button size="sm" className="h-8 bg-info text-xs text-info-foreground hover:bg-info/90" onClick={validateWizard}>Next<ChevronRight /></Button> : <Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={addItem}><Check />Add Item</Button>}</div></div>
      </DialogContent></Dialog>

      <Dialog open={contactOpen} onOpenChange={(open) => { setContactOpen(open); if (!open) setContactErrors({}); }}><DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b px-4 py-3"><DialogTitle className="text-base">Add New Contact</DialogTitle><DialogDescription className="text-xs">Enter the contact details for this customer.</DialogDescription></DialogHeader>
        <div className="space-y-2 px-4 py-3">
          {([
            { key: "firstName", label: "First Name", required: true, placeholder: "" },
            { key: "lastName", label: "Last Name", required: true, placeholder: "" },
            { key: "title", label: "Title", required: false, placeholder: "" },
            { key: "phone", label: "Phone", required: true, placeholder: "(___) ___-____" },
            { key: "fax", label: "Fax", required: false, placeholder: "(___) ___-____" },
            { key: "cell", label: "Cell", required: false, placeholder: "(___) ___-____" },
            { key: "email", label: "Email", required: true, placeholder: "" },
          ] as { key: keyof ContactDraft; label: string; required: boolean; placeholder: string }[]).map((field) => (
            <div key={field.key} className="grid grid-cols-[110px_1fr] items-center gap-2">
              <Label className={cn("justify-self-end text-right text-xs", field.required ? "font-semibold text-foreground" : "text-muted-foreground")}>{field.label}:{field.required && <span className="text-destructive"> *</span>}</Label>
              <div className="space-y-0.5">
                <Input aria-label={field.label} value={contactDraft[field.key]} placeholder={field.placeholder} onChange={(event) => setContactDraft((previous) => ({ ...previous, [field.key]: event.target.value }))} className={cn("h-8 text-xs", contactErrors[field.key] && "border-destructive")} />
                {contactErrors[field.key] && <ErrorText text={contactErrors[field.key]} />}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 border-t bg-muted/20 px-4 py-3">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setContactOpen(false)}>Cancel</Button>
          <Button size="sm" className="h-8 bg-success text-xs text-success-foreground hover:bg-success/90" onClick={addContact}><Check />Add</Button>
        </div>
      </DialogContent></Dialog>

    </div>
  );
}

function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) { return <div className="flex min-h-8 items-center justify-between border-b bg-muted/30 px-3 py-1.5"><h2 className="text-xs font-semibold">{title}</h2>{action}</div>; }
function Field({ label, value, onChange, error, required, suffix }: { label: string; value: string; onChange: (value: string) => void; error?: string; required?: boolean; suffix?: React.ReactNode }) { return <div className="space-y-0.5"><Label className="text-[9px] uppercase leading-none text-muted-foreground">{label}{required && <span className="text-destructive"> *</span>}</Label><div className="flex gap-1"><Input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className={cn("h-7 px-2 text-[11px]", error && "border-destructive")} />{suffix}</div>{error && <ErrorText text={error} />}</div>; }
function SelectField({ label, value, options, onChange, error, required }: { label: string; value: string; options: string[]; onChange: (value: string) => void; error?: string; required?: boolean }) { return <div className="space-y-0.5"><Label className="text-[9px] uppercase leading-none text-muted-foreground">{label}{required && <span className="text-destructive"> *</span>}</Label><Select value={value || undefined} onValueChange={onChange}><SelectTrigger aria-label={label} className={cn("h-7 px-2 text-[11px]", error && "border-destructive")}><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>)}</SelectContent></Select>{error && <ErrorText text={error} />}</div>; }
function WizardSearchField({ label, value, onChange, unknown, onUnknown, newItem, onNewItem, error }: { label: string; value: string; onChange: (value: string) => void; unknown: boolean; onUnknown: (checked: boolean) => void; newItem: boolean; onNewItem: (checked: boolean) => void; error?: string }) { return <div className="space-y-2"><Label className="text-xs font-medium">{label} <span className="text-destructive">*</span></Label><div className="flex gap-2"><Input aria-label={label} value={value} disabled={unknown} onChange={(event) => onChange(event.target.value)} className={cn("h-9 text-xs", error && "border-destructive")} /><Button variant="outline" size="icon" className="h-9 w-9" aria-label={`Search ${label}`}><Search /></Button></div><div className="flex flex-wrap gap-4 text-xs"><label className="flex items-center gap-2"><Checkbox checked={newItem} onCheckedChange={(checked) => onNewItem(checked === true)} />Not in CalMapp</label><label className="flex items-center gap-2"><Checkbox checked={unknown} onCheckedChange={(checked) => onUnknown(checked === true)} />Unknown</label></div>{error && <ErrorText text={error} />}</div>; }
function SummaryStrip({ draft }: { draft: ItemDraft }) { return <div className="grid gap-2 rounded-md bg-muted/40 p-3 text-xs sm:grid-cols-3"><span>Manufacturer: <strong>{draft.manufacturerUnknown ? "Unknown" : draft.manufacturer || "—"}</strong></span><span>Model: <strong>{draft.modelUnknown ? "Unknown" : draft.model || "—"}</strong></span><span>Description: <strong>{draft.description || "—"}</strong></span></div>; }
function ReviewValue({ label, value }: { label: string; value: string }) { return <div><div className="text-[10px] uppercase text-muted-foreground">{label}</div><div className="text-xs font-medium">{value || "—"}</div></div>; }
function ErrorText({ text }: { text: string }) { return <p className="text-[10px] text-destructive">{text}</p>; }
function ValidationMessage({ text }: { text: string }) { return <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{text}</div>; }
