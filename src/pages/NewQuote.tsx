import React, { useMemo, useState, Children, isValidElement, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  X,
  ArrowLeft,
  Plus,
  Search,
  Copy,
  FileText,
  Mail,
  Package,
  MessageSquare,
  Trash2,
  ClipboardList,
  Users,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const QUOTE_TYPES = ["All", "Lab", "OnSite", "ESL", "Rental", "Sales"];
const LOCATIONS = ["All", "BR", "CL", "GR", "MT", "HOU"];
const SOURCES = ["Phone", "Email", "Web", "Salesperson", "Walk-in"];
const PRIORITIES = ["All", "Emergency", "Expedite", "Rush", "Normal"];
const YES_NO = ["Yes", "No"];
const STATES = ["LA", "TX", "MS", "AL", "MT", "OK"];
const SALESPEOPLE = ["Brandi M. Cali", "Trysten Q Howze", "Kevin R. Young", "Jessica M Thompson"];
const CONTACTS = ["Dana Whitfield", "Marcus Reed", "Alicia Moreno", "Ben Ottinger"];
const SHIP_TO = ["Main Plant — 1200 Industrial Dr", "Warehouse B — 44 Levee Rd", "Corporate — 900 Poydras St"];
const COMMENT_TYPES = ["Other", "Internal", "Customer", "Pricing", "Follow Up"];
const ITEM_STATUSES = ["Quoted", "Pending", "Approved", "Cancelled"];

type QuoteItem = {
  id: string;
  manufacturer: string;
  model: string;
  description: string;
  qty: string;
  serial: string;
  custId: string;
  custSerial: string;
  priority: string;
  wo: string;
  status: string;
  baseAmt: string;
  calCert: string;
  calc17025: string;
  otherServices: string;
  otherParts: string;
  rep: string;
  is17025: boolean;
  cp: boolean;
  services: boolean;
  parts: boolean;
  rev: boolean;
};

const emptyItem = (): QuoteItem => ({
  id: crypto.randomUUID(),
  manufacturer: "",
  model: "",
  description: "",
  qty: "1",
  serial: "",
  custId: "",
  custSerial: "",
  priority: "Normal",
  wo: "",
  status: "Quoted",
  baseAmt: "0.00",
  calCert: "0.00",
  calc17025: "0.00",
  otherServices: "0.00",
  otherParts: "0.00",
  rep: "",
  is17025: false,
  cp: false,
  services: false,
  parts: false,
  rev: false,
});

const CHARGE_FIELDS = [
  { key: "mobilization", label: "Mobilization/Demobilization" },
  { key: "perDiem", label: "Per Diem" },
  { key: "techTravel", label: "Technician Travel Charge" },
  { key: "trailer", label: "Trailer Charge" },
  { key: "generator", label: "Generator (Power) Charge" },
  { key: "water", label: "Water Supply Fee" },
] as const;

type ChargeKey = (typeof CHARGE_FIELDS)[number]["key"];

const SEED_COMMENTS = [
  { type: "Other", by: "Andrea D. Jeansonne", at: "05/24/2023 04:08 PM", text: "Contract Pricing Override Reason: JM Price increase" },
  { type: "Other", by: "Andrea D. Jeansonne", at: "05/24/2023 01:45 PM", text: "Contract Pricing Override Reason: JM price increase" },
  { type: "Other", by: "Lindsay S David", at: "05/22/2023 11:23 AM", text: "OSR Acknowledgement for OSR001145.doc CHECKED" },
  { type: "Other", by: "Lindsay S David", at: "05/17/2023 12:39 PM", text: "OSR Acknowledgement for OSR000124.doc CHECKED" },
  { type: "Other", by: "Lindsay S David", at: "05/10/2023 08:32 AM", text: "OSR Acknowledgement for OSR000940.doc CHECKED" },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const num = (v: string) => {
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const labelCls = "text-[11px] font-normal text-muted-foreground";
const inputCls = "h-6 text-[11px] md:text-[11px] px-1.5 py-0 bg-white text-black placeholder:text-[10px] placeholder:text-black placeholder:opacity-100";
const textareaCls = "text-[11px] md:text-[11px] px-1.5 py-1.5 bg-white text-black placeholder:text-[10px] placeholder:text-black placeholder:opacity-100";



const Field = ({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const labelText = `${label}${required ? " *" : ""}`;
  const childArray = Children.toArray(children);
  const child = childArray.length === 1 ? childArray[0] : null;
  if (isValidElement(child)) {
    const element = child as React.ReactElement<any>;
    const typeName =
      typeof element.type === "string"
        ? element.type
        : (element.type as any).displayName || (element.type as any).name;
    if (typeName === "ModernDatePicker") {
      return cloneElement(element, {
        className: cn(element.props.className, className),
        inputClassName: cn(
          element.props.inputClassName,
          "placeholder:font-normal placeholder:text-black placeholder:opacity-100"
        ),
        placeholder: labelText,
      });
    }
    const isInputLike =
      typeof element.type === "string"
        ? ["input", "textarea", "select"].includes(element.type)
        : ["Input", "Textarea", "SelectField"].includes(typeName);
    if (isInputLike) {
      return cloneElement(element, {
        className: cn(
          element.props.className,
          className,
          "placeholder:font-normal placeholder:text-black placeholder:opacity-100"
        ),
        placeholder: labelText,
      });
    }
  }
  return (
    <div className={cn("space-y-1", className)}>
      <Label className={labelCls}>
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
};

const SectionCard = ({
  icon: Icon,
  title,
  action,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn("rounded-xl border shadow-sm", className)}>
    <CardContent className="p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-600" />
          <h2 className="text-[13px] font-semibold tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      <Separator />
      {children}
    </CardContent>
  </Card>
);

const AccSection = ({
  value,
  icon: Icon,
  title,
  badge,
  action,
  children,
}: {
  value: string;
  icon: React.ElementType;
  title: string;
  badge?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <AccordionItem value={value} className="rounded-xl border shadow-sm bg-white px-3">
    <AccordionTrigger className="py-2 hover:no-underline">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-600" />
        <span className="text-[13px] font-semibold tracking-tight">{title}</span>
        {typeof badge === "number" && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{badge}</Badge>
        )}
      </div>
    </AccordionTrigger>
    <AccordionContent className="pb-3 pt-0">
      {action && <div className="flex justify-end pb-2">{action}</div>}
      <Separator className="mb-3" />
      <div className="space-y-3">{children}</div>
    </AccordionContent>
  </AccordionItem>
);

const Group = ({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("rounded-lg border bg-white p-2.5 space-y-2", className)}>
    <div className="flex items-center justify-between gap-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      {action}
    </div>
    {children}
  </div>
);

const SelectField = ({
  value,
  onChange,
  options,
  placeholder = "Select",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={cn(inputCls, "md:text-[11px]")}>
      <SelectValue
        placeholder={
          <span className="text-[10px] font-normal text-black">
            {placeholder}
          </span>
        }
      />
    </SelectTrigger>
    <SelectContent className="bg-popover z-50">
      {options.map((o) => (
        <SelectItem key={o} value={o} className="text-xs">
          {o}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const ITEM_COLUMNS = [
  "Cancel", "Rev", "Services", "Parts", "Qty", "Manufacturer", "Model", "Description",
  "Serial #", "Cust ID", "Cust Serial", "Priority", "WO #", "Status", "Base Amt",
  "Cal Cert", "Calc 17025", "Other Services", "Other Parts", "Rep.", "17025", "C.P.?",
];

const NewQuote = () => {
  const navigate = useNavigate();

  // Quote info
  const [quoteType, setQuoteType] = useState("");
  const [location, setLocation] = useState("");
  const [projectNo, setProjectNo] = useState("");
  const [existingCustomer, setExistingCustomer] = useState("Yes");
  const [source, setSource] = useState("");
  const [sourceInfo, setSourceInfo] = useState("");
  const [newOnsite, setNewOnsite] = useState("No");
  const [acctNo, setAcctNo] = useState("");
  const [srDoc, setSrDoc] = useState("");
  const [osrDoc, setOsrDoc] = useState("");
  const [opportunity, setOpportunity] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [pocoReq, setPocoReq] = useState(false);

  // Pricing / scheduling
  const [override, setOverride] = useState(false);
  const [hourly, setHourly] = useState("0.00");
  const [percent, setPercent] = useState("0.000");
  const [expDate, setExpDate] = useState<Date | undefined>();
  const [custPo, setCustPo] = useState("");
  const [priority, setPriority] = useState("");
  const [needBy, setNeedBy] = useState<Date | undefined>();
  const [followUp, setFollowUp] = useState<Date | undefined>();
  const [terms, setTerms] = useState("");
  const [productReview, setProductReview] = useState("");

  // Contact
  const [selectContact, setSelectContact] = useState("");
  const [contactFirst, setContactFirst] = useState("");
  const [contactLast, setContactLast] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [cell, setCell] = useState("");
  const [email, setEmail] = useState("");
  const [salesperson, setSalesperson] = useState("");

  // Address
  const [shipTo, setShipTo] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");

  // Copy from
  const [copyQuoteNo, setCopyQuoteNo] = useState("");
  const [includeServices, setIncludeServices] = useState(false);
  const [copyWo, setCopyWo] = useState("");
  const [copyItem, setCopyItem] = useState("");

  // Items
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<QuoteItem>(emptyItem());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Project
  const [proposedProject, setProposedProject] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Charges
  const [charges, setCharges] = useState<Record<ChargeKey, string>>({
    mobilization: "0.00",
    perDiem: "0.00",
    techTravel: "0.00",
    trailer: "0.00",
    generator: "0.00",
    water: "0.00",
  });
  const [historicalBilling] = useState("0.00");

  // Comments
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [commentType, setCommentType] = useState("Other");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(SEED_COMMENTS);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const certSubtotal = useMemo(
    () => items.reduce((s, i) => s + num(i.calCert) + num(i.calc17025), 0),
    [items],
  );
  const otherServicesTotal = useMemo(
    () =>
      items.reduce((s, i) => s + num(i.otherServices), 0) +
      CHARGE_FIELDS.reduce((s, c) => s + num(charges[c.key]), 0),
    [items, charges],
  );
  const partsTotal = useMemo(() => items.reduce((s, i) => s + num(i.otherParts), 0), [items]);
  const baseTotal = useMemo(() => items.reduce((s, i) => s + num(i.baseAmt), 0), [items]);
  const total = certSubtotal + otherServicesTotal + partsTotal + baseTotal;

  const itemQuantity = items.reduce((s, i) => s + num(i.qty), 0);

  const pagedComments = comments.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(comments.length / pageSize));

  const openAdd = () => {
    setDraft(emptyItem());
    setEditingId(null);
    setDrawerOpen(true);
  };

  const openEdit = (item: QuoteItem) => {
    setDraft({ ...item });
    setEditingId(item.id);
    setDrawerOpen(true);
  };

  const saveItem = () => {
    if (!draft.manufacturer && !draft.model && !draft.description) {
      toast({ title: "Add product details", description: "Manufacturer, model or description is required." });
      return;
    }
    setItems((prev) =>
      editingId ? prev.map((i) => (i.id === editingId ? draft : i)) : [...prev, draft],
    );
    setDrawerOpen(false);
    toast({ title: editingId ? "Item updated" : "Item added" });
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        type: commentType,
        by: "Current User",
        at: new Date().toLocaleString("en-US", {
          month: "2-digit", day: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }),
        text: commentText.trim(),
      },
      ...prev,
    ]);
    setCommentText("");
    setPage(1);
  };

  const secondaryActions = [
    "Print Quote",
    "Email Quote",
    "Print Comparison",
    "Email Comparison",
    "Generate RMA",
    "Email Follow Up",
    "Email Logistics",
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-3 lg:px-4 py-2 pb-24 space-y-3 flex-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Add New Quote</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground">Quote Status</span>
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-[10px] px-2 py-0 rounded-full">
                Creating
              </Badge>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-3 items-start">
          <div className="min-w-0">
          <Accordion
            type="multiple"
            defaultValue={["quote-info", "copy", "customer", "items", "project", "comments"]}
            className="space-y-3"
          >
        {/* Quote setup */}
        <AccSection value="quote-info" icon={ClipboardList} title="Quote Information">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 auto-rows-min">
              {/* Category: Quote Setup */}
              <Group title="Quote Setup" className="md:col-span-2">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Quote Type" required>
                    <SelectField value={quoteType} onChange={setQuoteType} options={QUOTE_TYPES} placeholder="Select type" />
                  </Field>
                  <Field label="Location" required>
                    <SelectField value={location} onChange={setLocation} options={LOCATIONS} placeholder="Select location" />
                  </Field>
                </div>
                {!quoteType && (
                  <p className="text-[10px] text-red-600 -mt-1">Quote type is required to save.</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Project #">
                    <Input value={projectNo} onChange={(e) => setProjectNo(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Priority" required>
                    <SelectField value={priority} onChange={setPriority} options={PRIORITIES} placeholder="Select priority" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 h-6 px-2.5 rounded-lg border bg-background">
                    <Checkbox id="poco" checked={pocoReq} onCheckedChange={(v) => setPocoReq(!!v)} />
                    <Label htmlFor="poco" className="text-[11px] font-medium">PO/CO Req?</Label>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-background px-2.5 h-6">
                    <span className="text-[11px] font-medium text-muted-foreground">Item Quantity</span>
                    <span className="text-[11px] font-semibold">{itemQuantity}</span>
                  </div>
                </div>
              </Group>

              {/* Category: Customer & Origin */}
              <Group title="Customer & Origin" className="md:col-span-2">
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Existing Customer">
                    <SelectField value={existingCustomer} onChange={setExistingCustomer} options={YES_NO} placeholder="Yes" />
                  </Field>
                  <Field label="New Onsite Customer">
                    <SelectField value={newOnsite} onChange={setNewOnsite} options={YES_NO} placeholder="No" />
                  </Field>
                  <Field label="Source">
                    <SelectField value={source} onChange={setSource} options={SOURCES} placeholder="Select source" />
                  </Field>
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    value={acctNo}
                    onChange={(e) => setAcctNo(e.target.value)}
                    className={cn(inputCls, "placeholder:font-normal placeholder:text-black placeholder:opacity-100")}
                    placeholder="Account #"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[11px] px-2 shrink-0"
                    onClick={() => {
                      setCustomerName("Chevron Oronite");
                      toast({ title: "Account found", description: "Customer details populated." });
                    }}
                  >
                    <Search className="h-3 w-3 mr-1" /> Find Account
                  </Button>
                </div>
                <Field label="Customer Name">
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Source Info">
                  <Textarea
                    value={sourceInfo}
                    onChange={(e) => setSourceInfo(e.target.value)}
                    className={cn(textareaCls, "min-h-[52px]")}
                  />
                </Field>

              </Group>

              {/* Category: References & Documents */}
              <Group title="References & Documents" className="md:col-span-3">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="SR Doc">
                    <Input value={srDoc} onChange={(e) => setSrDoc(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="OSR Doc">
                    <Input value={osrDoc} onChange={(e) => setOsrDoc(e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={opportunity}
                      onChange={(e) => setOpportunity(e.target.value)}
                      className={cn(inputCls, "placeholder:font-normal placeholder:text-black placeholder:opacity-100")}
                      placeholder="Opportunity"
                    />
                    <Button variant="outline" size="sm" className="h-6 text-[11px] px-2 shrink-0">
                      Find
                    </Button>
                  </div>
                  <Field label="Customer PO #">
                    <Input value={custPo} onChange={(e) => setCustPo(e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Field label="Associated Product Review">
                  <Input value={productReview} onChange={(e) => setProductReview(e.target.value)} className={inputCls} />
                </Field>
              </Group>

              {/* Category: Contract Pricing */}
              <Group
                title="Contract Pricing"
                className="md:col-span-1"
                action={
                  <button type="button" className="text-[10px] underline text-slate-900 hover:text-slate-700">
                    View
                  </button>
                }
              >
                <div className="flex items-center gap-2">
                  <Checkbox id="override" checked={override} onCheckedChange={(v) => setOverride(!!v)} />
                  <Label htmlFor="override" className="text-[11px] font-medium">Override</Label>
                </div>
                <div className="space-y-1.5">
                  <Field label="Hourly">
                    <Input value={hourly} onChange={(e) => setHourly(e.target.value)} disabled={!override} className={cn(inputCls, "text-right")} />
                  </Field>
                  <Field label="Percent">
                    <Input value={percent} onChange={(e) => setPercent(e.target.value)} disabled={!override} className={cn(inputCls, "text-right")} />
                  </Field>
                  <Field label="Exp. Date">
                    <ModernDatePicker value={expDate} onChange={setExpDate} size="xs" inputClassName={inputCls} placeholder="MM/DD/YYYY" />
                  </Field>
                </div>
              </Group>

              {/* Category: Scheduling */}
              <Group title="Scheduling" className="md:col-span-2">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Need By Date">
                    <ModernDatePicker value={needBy} onChange={setNeedBy} size="xs" inputClassName={inputCls} placeholder="MM/DD/YYYY" />
                  </Field>
                  <Field label="Follow Up Date">
                    <ModernDatePicker value={followUp} onChange={setFollowUp} size="xs" inputClassName={inputCls} placeholder="MM/DD/YYYY" />
                  </Field>
                </div>
              </Group>

              {/* Category: Terms */}
              <Group title="Terms & Conditions" className="md:col-span-2">
                <Field label="Terms and Conditions">
                  <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} className={cn(textareaCls, "min-h-[68px]")} />
                </Field>
              </Group>
            </div>
        </AccSection>




        {/* Customer & Contact */}
        <AccSection value="customer" icon={Users} title="Customer & Contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <SelectField
                    value={selectContact}
                    onChange={setSelectContact}
                    options={CONTACTS}
                    placeholder="Select Contact"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-6 text-[11px] px-2 shrink-0">
                  <Plus className="h-3 w-3 mr-1" /> Add Contact
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Contact First Name">
                  <Input value={contactFirst} onChange={(e) => setContactFirst(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Contact Last Name">
                  <Input value={contactLast} onChange={(e) => setContactLast(e.target.value)} className={inputCls} />
                </Field>
              </div>
              <Field label="Title">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
              </Field>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Phone">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(___) ___-____" className={inputCls} />
                </Field>
                <Field label="Fax">
                  <Input value={fax} onChange={(e) => setFax(e.target.value)} placeholder="(___) ___-____" className={inputCls} />
                </Field>
                <Field label="Cell">
                  <Input value={cell} onChange={(e) => setCell(e.target.value)} placeholder="(___) ___-____" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Email">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputCls} />
                </Field>
                <Field label="Salesperson">
                  <SelectField value={salesperson} onChange={setSalesperson} options={SALESPEOPLE} placeholder="Select salesperson" />
                </Field>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Address</p>
              <Field label="Ship To Addresses">
                <SelectField value={shipTo} onChange={(v) => { setShipTo(v); setAddr1(v.split("—")[1]?.trim() ?? ""); }} options={SHIP_TO} placeholder="Select ship to address" />
              </Field>
              {shipTo && (
                <div className="rounded-lg border bg-muted/30 p-2 text-[11px] text-muted-foreground">
                  Selected: <span className="text-foreground font-medium">{shipTo}</span>
                </div>
              )}
              <Field label="Ship Address">
                <Input value={addr1} onChange={(e) => setAddr1(e.target.value)} className={cn(inputCls, "mb-1.5")} />
              </Field>
              <Input value={addr2} onChange={(e) => setAddr2(e.target.value)} className={inputCls} placeholder="Address line 2" />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Ship City">
                  <Input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
                </Field>
                <Field label="State">
                  <SelectField value={stateVal} onChange={setStateVal} options={STATES} placeholder="State" />
                </Field>
                <Field label="Zip">
                  <Input value={zip} onChange={(e) => setZip(e.target.value)} className={inputCls} />
                </Field>
              </div>
            </div>
          </div>
        </AccSection>

        {/* Quote Items */}
        <AccSection
          value="items"
          icon={Package}
          title="Quote Items"
          badge={items.length}
          action={
            <Button size="sm" className="h-7 text-[11px] px-2 bg-green-600 hover:bg-green-700 text-white" onClick={openAdd}>
              <Plus className="h-3 w-3 mr-1" /> Add Quote Item
            </Button>
          }
        >
          <p className="text-[10px] text-muted-foreground">
            * denotes the product is pending a project review and charges will be updated
          </p>
          <div className="rounded-lg border overflow-auto max-h-[420px]">
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                <tr>
                  {ITEM_COLUMNS.map((c) => (
                    <th key={c} className="px-2 py-1.5 text-left font-semibold whitespace-nowrap text-muted-foreground">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={ITEM_COLUMNS.length} className="py-10 text-center">
                      <Package className="h-6 w-6 mx-auto text-muted-foreground mb-1.5" />
                      <p className="text-xs font-medium">No items added yet</p>
                      <p className="text-[11px] text-muted-foreground">Add a quote item to start building this quote.</p>
                    </td>
                  </tr>
                ) : (
                  items.map((i) => (
                    <tr key={i.id} className="border-t hover:bg-muted/40 cursor-pointer" onClick={() => openEdit(i)}>
                      <td className="px-2 py-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => { e.stopPropagation(); setPendingDelete(i.id); }}
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </td>
                      <td className="px-2 py-1">{i.rev ? "Yes" : ""}</td>
                      <td className="px-2 py-1">{i.services ? "Yes" : ""}</td>
                      <td className="px-2 py-1">{i.parts ? "Yes" : ""}</td>
                      <td className="px-2 py-1">{i.qty}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{i.manufacturer}</td>
                      <td className="px-2 py-1 whitespace-nowrap">{i.model}</td>
                      <td className="px-2 py-1 max-w-[220px] truncate">{i.description}</td>
                      <td className="px-2 py-1">{i.serial}</td>
                      <td className="px-2 py-1">{i.custId}</td>
                      <td className="px-2 py-1">{i.custSerial}</td>
                      <td className="px-2 py-1">{i.priority}</td>
                      <td className="px-2 py-1">{i.wo}</td>
                      <td className="px-2 py-1">{i.status}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.baseAmt))}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.calCert))}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.calc17025))}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.otherServices))}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.otherParts))}</td>
                      <td className="px-2 py-1">{i.rep}</td>
                      <td className="px-2 py-1">{i.is17025 ? "Yes" : ""}</td>
                      <td className="px-2 py-1">{i.cp ? "Yes" : ""}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AccSection>

        {/* Project details */}
          <AccSection value="project" icon={FileText} title="Project Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Proposed Project">
                <Textarea value={proposedProject} onChange={(e) => setProposedProject(e.target.value)} className={cn(textareaCls, "min-h-[150px]")} />
              </Field>
              <Field label="Special Instructions">
                <Textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} className={cn(textareaCls, "min-h-[150px]")} />
              </Field>
            </div>
          </AccSection>


        {/* Comments */}
        <AccSection value="comments" icon={MessageSquare} title="Comments" badge={comments.length}>
              <div className="flex flex-col md:flex-row gap-2 items-start">
                  <div className="w-full md:w-40">
                    <SelectField value={commentType} onChange={setCommentType} options={COMMENT_TYPES} placeholder="Type" />
                  </div>
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className={cn(textareaCls, "min-h-[60px] flex-1")}
                  />
                  <Button size="sm" className="h-8 text-[11px] px-3" onClick={addComment}>
                    Add
                  </Button>
                </div>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-[11px] table-fixed">
                    <thead className="bg-muted/60">
                      <tr>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground w-24">Type</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground w-44">Created By</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground w-40">Date/Time</th>
                        <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedComments.map((c, idx) => (
                        <tr key={`${c.at}-${idx}`} className="border-t">
                          <td className="px-2 py-1.5">{c.type}</td>
                          <td className="px-2 py-1.5">{c.by}</td>
                          <td className="px-2 py-1.5 whitespace-nowrap">{c.at}</td>
                          <td className="px-2 py-1.5 break-words">{c.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Page {page} of {totalPages} ({comments.length} items)
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-2" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                      Previous
                    </Button>
                    <Button size="sm" className="h-7 text-[11px] px-2.5 !bg-yellow-400 hover:!bg-yellow-500 text-black">
                      {page}
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-2" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
        </AccSection>
          </Accordion>
          </div>

          {/* Sticky summary rail */}
          <aside className="xl:sticky xl:top-2 self-start">
            <SectionCard icon={DollarSign} title="Quote Summary">
              <div className="space-y-1.5">
                {CHARGE_FIELDS.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">{c.label}</span>
                  <Input
                    value={charges[c.key]}
                    onChange={(e) => setCharges((p) => ({ ...p, [c.key]: e.target.value }))}
                    className={cn(inputCls, "w-24 text-right")}
                  />
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Certification/Testing Subtotal</span>
                  <span className="font-medium">{money(certSubtotal + baseTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Other Services/Fees</span>
                  <span className="font-medium">{money(otherServicesTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Parts</span>
                  <span className="font-medium">{money(partsTotal)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-2 mt-1">
                  <span className="text-xs font-semibold">Total</span>
                  <span className="text-sm font-bold">{money(total)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-muted-foreground">Historical Billing Amount</span>
                  <span className="font-medium">{money(num(historicalBilling))}</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={Copy} title="Copy from Existing" className="mt-3">
              <div className="space-y-2.5">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold">Copy from Quote</p>
                  <Field label="Quote #">
                    <Input value={copyQuoteNo} onChange={(e) => setCopyQuoteNo(e.target.value)} className={inputCls} />
                  </Field>
                  <div className="flex items-center gap-2">
                    <Checkbox id="incl" checked={includeServices} onCheckedChange={(v) => setIncludeServices(!!v)} />
                    <Label htmlFor="incl" className="text-[11px] font-medium">Include Services</Label>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-[11px] w-full" onClick={() => toast({ title: "Copied from quote" })}>
                    Copy from Quote
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold">Copy from Work Order</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="W.O. #">
                      <Input value={copyWo} onChange={(e) => setCopyWo(e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Item #">
                      <Input value={copyItem} onChange={(e) => setCopyItem(e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-[11px] w-full" onClick={() => toast({ title: "Copied from work order" })}>
                    Copy from W.O.
                  </Button>
                </div>
              </div>
            </SectionCard>
          </aside>
        </div>

      </main>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 z-30 border-t bg-background/95 backdrop-blur px-2 sm:px-3 lg:px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-[11px] px-2">
                <MoreHorizontal className="h-3 w-3 mr-1" /> More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-popover z-50 w-52">
              {secondaryActions.map((a) => (
                <DropdownMenuItem key={a} disabled className="text-xs">
                  {a.startsWith("Email") ? <Mail className="h-3.5 w-3.5 mr-2" /> : <FileText className="h-3.5 w-3.5 mr-2" />}
                  {a}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-[11px] px-2" onClick={() => navigate("/quotes")}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-[11px] px-3 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => toast({ title: "Quote saved" })}
            >
              <Save className="h-3 w-3 mr-1" /> Save Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Item drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-sm">{editingId ? "Edit Quote Item" : "Add Quote Item"}</SheetTitle>
            <SheetDescription className="text-[11px]">
              Item details, pricing and classification.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Product</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Manufacturer">
                  <Input value={draft.manufacturer} onChange={(e) => setDraft({ ...draft, manufacturer: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Model">
                  <Input value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <Field label="Description">
                <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={cn(textareaCls, "min-h-[60px]")} />
              </Field>
              <Field label="Qty">
                <Input value={draft.qty} onChange={(e) => setDraft({ ...draft, qty: e.target.value })} className={cn(inputCls, "w-24")} />
              </Field>
            </div>

            <Separator />
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Identification</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Serial #">
                  <Input value={draft.serial} onChange={(e) => setDraft({ ...draft, serial: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Customer ID">
                  <Input value={draft.custId} onChange={(e) => setDraft({ ...draft, custId: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Customer Serial">
                  <Input value={draft.custSerial} onChange={(e) => setDraft({ ...draft, custSerial: e.target.value })} className={inputCls} />
                </Field>
                <Field label="WO #">
                  <Input value={draft.wo} onChange={(e) => setDraft({ ...draft, wo: e.target.value })} className={inputCls} />
                </Field>
              </div>
            </div>

            <Separator />
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pricing</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Base Amount">
                  <Input value={draft.baseAmt} onChange={(e) => setDraft({ ...draft, baseAmt: e.target.value })} className={cn(inputCls, "text-right")} />
                </Field>
                <Field label="Cal Cert">
                  <Input value={draft.calCert} onChange={(e) => setDraft({ ...draft, calCert: e.target.value })} className={cn(inputCls, "text-right")} />
                </Field>
                <Field label="Calc 17025">
                  <Input value={draft.calc17025} onChange={(e) => setDraft({ ...draft, calc17025: e.target.value })} className={cn(inputCls, "text-right")} />
                </Field>
                <Field label="Other Services">
                  <Input value={draft.otherServices} onChange={(e) => setDraft({ ...draft, otherServices: e.target.value })} className={cn(inputCls, "text-right")} />
                </Field>
                <Field label="Other Parts">
                  <Input value={draft.otherParts} onChange={(e) => setDraft({ ...draft, otherParts: e.target.value })} className={cn(inputCls, "text-right")} />
                </Field>
                <Field label="Rep.">
                  <Input value={draft.rep} onChange={(e) => setDraft({ ...draft, rep: e.target.value })} className={inputCls} />
                </Field>
              </div>
            </div>

            <Separator />
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Classification</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Priority">
                  <SelectField value={draft.priority} onChange={(v) => setDraft({ ...draft, priority: v })} options={PRIORITIES} placeholder="Priority" />
                </Field>
                <Field label="Status">
                  <SelectField value={draft.status} onChange={(v) => setDraft({ ...draft, status: v })} options={ITEM_STATUSES} placeholder="Status" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  ["Services", "services"],
                  ["Parts", "parts"],
                  ["Rev", "rev"],
                  ["17025", "is17025"],
                  ["C.P.?", "cp"],
                ].map(([label, key]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={`chk-${key}`}
                      checked={draft[key as keyof QuoteItem] as boolean}
                      onCheckedChange={(v) => setDraft({ ...draft, [key]: !!v })}
                    />
                    <Label htmlFor={`chk-${key}`} className="text-[11px] font-medium">{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 pb-4">
              <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="h-8 text-[11px] bg-green-600 hover:bg-green-700 text-white" onClick={saveItem}>
                {editingId ? "Save Item" : "Add Item"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this quote item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from the quote and recalculate the totals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setItems((prev) => prev.filter((i) => i.id !== pendingDelete));
                setPendingDelete(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewQuote;
