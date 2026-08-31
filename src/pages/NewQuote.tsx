import React, { useMemo, useState, useEffect, Children, isValidElement, cloneElement } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Pencil,
  ClipboardList,
  Users,
  DollarSign,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,

} from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import SearchAddItemDialog, { type SearchAddItemResult } from "@/components/quotes/SearchAddItemDialog";
import AddTestingItemsDialog, { type AddTestingItemsResult } from "@/components/quotes/AddTestingItemsDialog";

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
import { useToast } from "@/hooks/use-toast";
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
const SHIP_METHODS = ["Pickup", "Delivery", "FedEx", "UPS", "LTL Freight", "Will Call"];
const SERVICE_TYPES = ["Calibration", "Repair", "Certification", "Inspection", "Consulting"];

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
  baseAmtOriginal?: string;
  calCertOriginal?: string;
  calc17025Original?: string;
  otherServicesOriginal?: string;
  otherPartsOriginal?: string;
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
  baseAmtOriginal: undefined,
  calCertOriginal: undefined,
  calc17025Original: undefined,
  otherServicesOriginal: undefined,
  otherPartsOriginal: undefined,
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
const textareaCls = "text-[11px] md:text-[11px] px-1.5 py-1 bg-white text-black placeholder:text-[10px] placeholder:text-black placeholder:opacity-100";
const errorCls = "border-red-500 ring-1 ring-red-500 focus-visible:ring-red-500";

/** Compact textarea that starts as a single line and grows as the user types. */
const AutoTextarea = ({
  className,
  value,
  maxHeight = 220,
  ...props
}: React.ComponentProps<typeof Textarea> & { maxHeight?: number }) => {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight]);
  return (
    <Textarea
      ref={ref}
      rows={1}
      value={value}
      className={cn(textareaCls, "min-h-0 h-7 resize-none overflow-hidden leading-tight", className)}
      {...props}
    />
  );
};



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
  <AccordionItem
    value={value}
    className="rounded-xl border border-slate-200 shadow-sm bg-white px-3 data-[state=open]:shadow-md"
  >
    <AccordionTrigger className="py-2 hover:no-underline data-[state=open]:border-b-2 data-[state=open]:border-slate-200">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-600" />
        <span className="text-[13px] font-semibold tracking-tight">{title}</span>
        {typeof badge === "number" && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{badge}</Badge>
        )}
      </div>
    </AccordionTrigger>
    <AccordionContent className="pb-3 pt-3">
      {action && <div className="flex justify-end pb-2">{action}</div>}
      <div className="space-y-3">{children}</div>
    </AccordionContent>
  </AccordionItem>
);

const Group = ({
  title,
  action,
  children,
  className,
  variant = "slate",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: "slate" | "white";
}) => (
  <div className={cn(
    "rounded-lg border-2 border-slate-400 p-2.5 space-y-2",
    variant === "white" ? "bg-white" : "bg-slate-50/60",
    className
  )}>
    <div className="flex items-center justify-between gap-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
      {action}
    </div>
    {children}
  </div>
);

const SectionHeader = ({
  number,
  title,
}: {
  number: string;
  title: string;
}) => (
  <div className="flex items-center gap-3">
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-900 ring-1 ring-slate-200">
      {number}
    </span>
    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">{title}</h3>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

const SelectField = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[] | { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}) => {
  const normalized = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );
  const selected = normalized.find((o) => o.value === value);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn(inputCls, "md:text-[11px]", className)}>
        <SelectValue
          placeholder={
            <span className="text-[10px] font-normal text-black">
              {placeholder}
            </span>
          }
        >
          {selected ? (
            <span className="text-[11px]">{selected.label}</span>
          ) : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover z-50">
        {normalized.map((o) => (
          <SelectItem key={o.value} value={o.value} className="text-xs">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ITEM_COLUMNS = [
  "", "Cancel", "Rcv", "Srvs", "Parts", "Qty", "Manufacturer", "Model", "Description",
  "Serial #", "Cust ID", "Cust Serial", "Priority", "WO #", "Status", "Base Amt",
  "Cal Cert", "Calc 17025", "Other Services", "Other Parts", "Rep.", "17025", "C.P.?",
  "", "", "",
];


const NewQuote = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Quote info
  const [quoteType, setQuoteType] = useState("Lab"); // demo prefill
  const [location, setLocation] = useState("BR"); // demo prefill
  const [projectNo, setProjectNo] = useState("");
  const [existingCustomer, setExistingCustomer] = useState("Yes");
  const [source, setSource] = useState("");
  const [sourceInfo, setSourceInfo] = useState("");
  const [newOnsite, setNewOnsite] = useState("No");
  const [acctNo, setAcctNo] = useState("10245"); // demo prefill
  const [srDoc, setSrDoc] = useState("");
  const [osrDoc, setOsrDoc] = useState("");
  const [opportunity, setOpportunity] = useState("");
  const [customerName, setCustomerName] = useState("Gulf Coast Industrial Services"); // demo prefill
  const [pocoReq, setPocoReq] = useState(false);

  // Pricing / scheduling
  const [override, setOverride] = useState(false);
  const [hourly, setHourly] = useState("0.00");
  const [percent, setPercent] = useState("0.000");
  const [expDate, setExpDate] = useState<Date | undefined>();
  const [custPo, setCustPo] = useState("");
  const [priority, setPriority] = useState("Normal"); // demo prefill
  const [needBy, setNeedBy] = useState<Date | undefined>();
  const [followUp, setFollowUp] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  }); // demo prefill
  const [terms, setTerms] = useState("");
  const [productReview, setProductReview] = useState("");

  // Contact
  const [selectContact, setSelectContact] = useState("Dana Whitfield"); // demo prefill
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
  const [copySource, setCopySource] = useState<"quote" | "wo" | null>(null);

  // Items
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<QuoteItem>(emptyItem());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [uncancelConfirmOpen, setUncancelConfirmOpen] = useState(false);

  const [copyQty, setCopyQty] = useState<Record<string, string>>({});
  type SubLine = { id: string; name: string; qty: string; baseCost: string; cost: string };
  const [itemServices, setItemServices] = useState<Record<string, SubLine[]>>({});
  const [itemParts, setItemParts] = useState<Record<string, SubLine[]>>({});
  const addSubLine = (
    setter: React.Dispatch<React.SetStateAction<Record<string, SubLine[]>>>,
    itemId: string,
  ) =>
    setter((p) => ({
      ...p,
      [itemId]: [...(p[itemId] ?? []), { id: crypto.randomUUID(), name: "", qty: "1", baseCost: "0.00", cost: "0.00" }],
    }));
  const updateSubLine = (
    setter: React.Dispatch<React.SetStateAction<Record<string, SubLine[]>>>,
    itemId: string,
    lineId: string,
    patch: Partial<SubLine>,
  ) =>
    setter((p) => ({
      ...p,
      [itemId]: (p[itemId] ?? []).map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
    }));
  const removeSubLine = (
    setter: React.Dispatch<React.SetStateAction<Record<string, SubLine[]>>>,
    itemId: string,
    lineId: string,
  ) => setter((p) => ({ ...p, [itemId]: (p[itemId] ?? []).filter((l) => l.id !== lineId) }));
  const toggleExpanded = (id: string) =>
    setExpandedItems((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const duplicateItem = (item: QuoteItem) => {
    const n = Math.max(1, parseInt(copyQty[item.id] || "1", 10) || 1);
    setItems((prev) => [
      ...prev,
      ...Array.from({ length: n }, () => ({ ...item, id: crypto.randomUUID() })),
    ]);
  };

  const [searchAddOpen, setSearchAddOpen] = useState(false);


  // Project
  const [proposedProject, setProposedProject] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [shipMethod, setShipMethod] = useState("");
  const [serviceType, setServiceType] = useState("");

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

  const missingFields = useMemo(() => {
    const filled = (v: string) => !!v && v !== "All";
    const missing: string[] = [];
    if (!filled(quoteType)) missing.push("Quote Type");
    if (!filled(location)) missing.push("Location");
    if (acctNo.trim() === "") missing.push("Account #");
    if (!filled(priority)) missing.push("Priority");
    if (!followUp) missing.push("Follow Up Date");
    if (selectContact.trim() === "") missing.push("Select Contact");
    return missing;
  }, [quoteType, location, acctNo, priority, followUp, selectContact]);

  const allMandatoryFilled = missingFields.length === 0;
  const [showErrors, setShowErrors] = useState(false);
  const invalid = (name: string) => showErrors && missingFields.includes(name);

  // Quote # + Status are generated once all mandatory details are filled
  const [quoteNo, setQuoteNo] = useState<string>("");
  useEffect(() => {
    if (allMandatoryFilled && !quoteNo) {
      setQuoteNo(String(48000 + Math.floor(Math.random() * 999)));
    }
  }, [allMandatoryFilled, quoteNo]);
  const quoteStatus = allMandatoryFilled ? "Quoted" : "Creating";


  const warnMissing = () => {
    setShowErrors(true);
    toast({
      title: "Missing required fields",
      description: `${missingFields.join(", ")} ${missingFields.length === 1 ? "is" : "are"} required.`,
      variant: "destructive",
    });
  };

  const [testingItemsOpen, setTestingItemsOpen] = useState(false);

  type TestingRow = {
    id: string;
    cancel: boolean;
    rcv: boolean;
    qty: string;
    groupable: string;
    type: string;
    sectionLength: string;
    priority: string;
    woNo: string;
    status: string;
    feeAmt: string;
    rep: string;
  };
  const [testingItems, setTestingItems] = useState<TestingRow[]>([]);

  const updateTestingRow = (id: string, patch: Partial<TestingRow>) =>
    setTestingItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeTestingRow = (id: string) =>
    setTestingItems((prev) => prev.filter((r) => r.id !== id));
  const testingRowTotal = (r: TestingRow) =>
    ((parseInt(r.qty || "0", 10) || 0) * (parseFloat(r.feeAmt || "0") || 0)).toFixed(2);

  const handleAddItemClick = () => {
    if (!allMandatoryFilled) {
      warnMissing();
      return;
    }
    setTestingItemsOpen(true);
  };

  const handleAddTestingItems = ({ lines }: AddTestingItemsResult) => {
    setTestingItems((prev) => [
      ...prev,
      ...lines.map((l, idx) => ({
        id: `${Date.now()}-${idx}`,
        cancel: false,
        rcv: false,
        qty: String(l.qty),
        groupable: l.groupable,
        type: l.type ?? "",
        sectionLength: l.sectionsFeet ?? "",
        priority: priority || "Normal",
        woNo: "",
        status: "",
        feeAmt: l.fee,
        rep: "",
      })),
    ]);
    toast({
      title: "Testing items added",
      description: `${lines.length} testing line item(s) added.`,
    });
  };



  const handleSearchAddClick = () => {
    if (!allMandatoryFilled) {
      warnMissing();
      return;
    }
    setSearchAddOpen(true);
  };

  const handleSearchAdd = ({ products, groupAsOneLineItem }: SearchAddItemResult) => {
    if (groupAsOneLineItem) {
      const total = products.reduce((s, p) => s + parseFloat(p.calCost || "0"), 0);
      setItems((prev) => [
        ...prev,
        {
          ...emptyItem(),
          manufacturer: products[0].manufacturer,
          model: products.map((p) => p.model).join(", "),
          description: products.map((p) => p.description).join(" / "),
          qty: String(products.length),
          baseAmt: total.toFixed(2),
          calCert: total.toFixed(2),
          is17025: products.some((p) => p.accredCal === "Yes"),
        },
      ]);
    } else {
      setItems((prev) => [
        ...prev,
        ...products.map((p) => ({
          ...emptyItem(),
          manufacturer: p.manufacturer,
          model: p.model,
          description: p.description,
          baseAmt: p.calCost,
          calCert: p.calCost,
          is17025: p.accredCal === "Yes",
        })),
      ]);
    }
    toast({
      title: "Items added",
      description: `${groupAsOneLineItem ? 1 : products.length} line item(s) added to the quote.`,
    });
  };


  const handleSave = () => {
    if (!allMandatoryFilled) {
      warnMissing();
      return;
    }
    setShowErrors(false);
    toast({ title: "Quote saved", description: "Your quote has been saved." });
  };


  const openEdit = (item: QuoteItem) => {
    setDraft({ ...item });
    setEditingId(item.id);
    setDrawerOpen(true);
  };

  const saveItem = () => {
    if (!draft.manufacturer && !draft.model && !draft.description) {
      toast({ title: "Add product details", description: "Manufacturer, model or description is required.", variant: "destructive" });
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


        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-3 items-start">
          <div className="min-w-0">
          <Accordion
            type="multiple"
            defaultValue={["quote-info", "customer", "items", "project", "comments"]}
            className="space-y-3"
          >
        {/* Quote setup */}
        <AccSection value="quote-info" icon={ClipboardList} title="Quote Information">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Primary configuration column */}
            <div className="xl:col-span-8 space-y-5">
              {/* 01 Quote Setup */}
              <div className="space-y-3">
                <SectionHeader number="01" title="Quote Setup" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Field label="Quote Type" required>
                    <SelectField value={quoteType} onChange={setQuoteType} options={QUOTE_TYPES} placeholder="Select type" className={cn(invalid("Quote Type") && errorCls)} />
                  </Field>
                  <Field label="Location" required>
                    <SelectField value={location} onChange={setLocation} options={LOCATIONS} placeholder="Select location" className={cn(invalid("Location") && errorCls)} />
                  </Field>
                  <Field label="Project #">
                    <Input value={projectNo} onChange={(e) => setProjectNo(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Priority" required>
                    <SelectField value={priority} onChange={setPriority} options={PRIORITIES} placeholder="Select priority" className={cn(invalid("Priority") && errorCls)} />
                  </Field>
                </div>
                {!quoteType && (
                  <p className="text-[10px] text-red-600 -mt-1">Quote type is required to save.</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex items-center gap-2 h-6 px-2.5 rounded-lg border bg-background">
                    <Checkbox id="poco" checked={pocoReq} onCheckedChange={(v) => setPocoReq(!!v)} />
                    <Label htmlFor="poco" className="text-[11px] font-medium">PO/CO Req?</Label>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-background px-2.5 h-6">
                    <span className="text-[11px] font-medium text-muted-foreground">Item Quantity</span>
                    <span className="text-[11px] font-semibold">{itemQuantity}</span>
                  </div>
                </div>
              </div>

              {/* 02 Customer, Origin & References */}
              <div className="space-y-3">
                <SectionHeader number="02" title="Customer, Origin & References" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <Field label="Existing Customer">
                    <RadioGroup
                      value={existingCustomer}
                      onValueChange={setExistingCustomer}
                      className="flex items-center gap-3 h-6 px-2 rounded-lg border bg-white"
                    >
                      <div className="flex items-center gap-1.5">
                        <RadioGroupItem value="Yes" id="existing-yes" className="h-3 w-3 border-slate-400 text-slate-900" />
                        <Label htmlFor="existing-yes" className="text-[11px] font-normal cursor-pointer">Yes - Existing</Label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RadioGroupItem value="No" id="existing-no" className="h-3 w-3 border-slate-400 text-slate-900" />
                        <Label htmlFor="existing-no" className="text-[11px] font-normal cursor-pointer">No - New</Label>
                      </div>
                    </RadioGroup>
                  </Field>
                  <Field label="New Onsite">
                    <RadioGroup
                      value={newOnsite}
                      onValueChange={setNewOnsite}
                      className="flex items-center gap-3 h-6 px-2 rounded-lg border bg-white"
                    >
                      <div className="flex items-center gap-1.5">
                        <RadioGroupItem value="Yes" id="onsite-yes" className="h-3 w-3 border-slate-400 text-slate-900" />
                        <Label htmlFor="onsite-yes" className="text-[11px] font-normal cursor-pointer">Yes - New</Label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RadioGroupItem value="No" id="onsite-no" className="h-3 w-3 border-slate-400 text-slate-900" />
                        <Label htmlFor="onsite-no" className="text-[11px] font-normal cursor-pointer">No - Existing</Label>
                      </div>
                    </RadioGroup>
                  </Field>
                  <Field label="Source">
                    <SelectField value={source} onChange={setSource} options={SOURCES} placeholder="Select source" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Field label="Account #" required className="flex-1">
                      <Input
                        value={acctNo}
                        onChange={(e) => setAcctNo(e.target.value)}
                        className={cn(inputCls, "placeholder:font-normal placeholder:text-black placeholder:opacity-100", invalid("Account #") && errorCls)}
                        placeholder="Account #"
                      />
                    </Field>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-[11px] px-2 shrink-0"
                      onClick={() => {
                        setCustomerName("Chevron Oronite");
                        toast({ title: "Account found", description: "Customer details populated." });
                      }}
                    >
                      <Search className="h-3 w-3 mr-1" /> Find
                    </Button>
                  </div>
                  <Field label="Customer Name">
                    <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Field label="Source Info">
                  <AutoTextarea
                    value={sourceInfo}
                    onChange={(e) => setSourceInfo(e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Field label="SR Doc">
                    <Input value={srDoc} onChange={(e) => setSrDoc(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="OSR Doc">
                    <Input value={osrDoc} onChange={(e) => setOsrDoc(e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              </div>
            </div>

            {/* Secondary details column */}
            <div className="xl:col-span-4 space-y-5">
              {/* 03 Contract Pricing & Scheduling */}
              <div className="space-y-3">
                <SectionHeader number="03" title="Contract Pricing & Scheduling" />
                <div className="flex items-center gap-2">
                  <Checkbox id="override" checked={override} onCheckedChange={(v) => setOverride(!!v)} />
                  <Label htmlFor="override" className="text-[11px] font-medium">Override</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Hourly">
                    <Input value={hourly} onChange={(e) => setHourly(e.target.value)} disabled={!override} className={cn(inputCls, "text-right")} />
                  </Field>
                  <Field label="Percent">
                    <Input value={percent} onChange={(e) => setPercent(e.target.value)} disabled={!override} className={cn(inputCls, "text-right")} />
                  </Field>
                </div>
                <Field label="Exp. Date">
                  <ModernDatePicker value={expDate} onChange={setExpDate} size="xs" inputClassName={inputCls} placeholder="MM/DD/YYYY" />
                </Field>
                <div className="h-px bg-slate-200" />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Need By Date">
                    <ModernDatePicker value={needBy} onChange={setNeedBy} size="xs" inputClassName={inputCls} placeholder="MM/DD/YYYY" />
                  </Field>
                  <Field label="Follow Up Date" required>
                    <ModernDatePicker value={followUp} onChange={setFollowUp} size="xs" inputClassName={cn(inputCls, invalid("Follow Up Date") && errorCls)} placeholder="MM/DD/YYYY" />
                  </Field>
                </div>
              </div>

              {/* 04 Terms & Conditions */}
              <div className="space-y-3">
                <SectionHeader number="04" title="Terms & Conditions" />
                <Field label="Terms and Conditions">
                  <AutoTextarea value={terms} onChange={(e) => setTerms(e.target.value)} />
                </Field>
              </div>
            </div>
          </div>
        </AccSection>




        {/* Customer & Contact */}
        <AccSection value="customer" icon={Users} title="Customer & Contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <Field label="Select Contact" required>
                    <SelectField
                      value={selectContact}
                      onChange={setSelectContact}
                      options={CONTACTS}
                      placeholder="Select Contact"
                      className={cn(invalid("Select Contact") && errorCls)}
                    />
                  </Field>
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
        >
          {allMandatoryFilled ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 px-2 py-1.5">
              <div className="flex flex-wrap items-center gap-1">
                {[
                  {
                    label: "Cancel Items",
                    fn: () => {
                      if (selectedItemIds.length === 0) {
                        toast({ title: "No items selected", description: "Select one or more items using the Cancel column checkbox first.", variant: "destructive" });
                        return;
                      }
                      setCancelConfirmOpen(true);
                    },
                  },
                  {
                    label: "Uncancel Items",
                    fn: () => {
                      if (selectedItemIds.length === 0) {
                        toast({ title: "No items selected", description: "Select one or more cancelled items first.", variant: "destructive" });
                        return;
                      }
                      setUncancelConfirmOpen(true);
                    },
                  },

                  {
                    label: "Receive Items",
                    fn: () => {
                      const targetIds = selectedItemIds.length === 0 ? items.map((i) => i.id) : selectedItemIds;
                      setItems((p) => p.map((i) => {
                        if (!targetIds.includes(i.id) || i.rev) return i;
                        return {
                          ...i,
                          rev: true,
                          baseAmtOriginal: i.baseAmt,
                          calCertOriginal: i.calCert,
                          calc17025Original: i.calc17025,
                          otherServicesOriginal: i.otherServices,
                          otherPartsOriginal: i.otherParts,
                          baseAmt: "0.00",
                          calCert: "0.00",
                          calc17025: "0.00",
                          otherServices: "0.00",
                          otherParts: "0.00",
                        };
                      }));
                    },
                  },
                  {
                    label: "Unreceive Items",
                    fn: () => {
                      const targetIds = selectedItemIds.length === 0 ? items.map((i) => i.id) : selectedItemIds;
                      setItems((p) => p.map((i) => {
                        if (!targetIds.includes(i.id) || !i.rev) return i;
                        return {
                          ...i,
                          rev: false,
                          baseAmt: i.baseAmtOriginal ?? i.baseAmt,
                          calCert: i.calCertOriginal ?? i.calCert,
                          calc17025: i.calc17025Original ?? i.calc17025,
                          otherServices: i.otherServicesOriginal ?? i.otherServices,
                          otherParts: i.otherPartsOriginal ?? i.otherParts,
                        };
                      }));
                    },
                  },

                  { label: "Search/Add Item", fn: handleSearchAddClick },
                  { label: "Add Testing Items", fn: handleAddItemClick },
                ].map((a) => (
                  <Button
                    key={a.label}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px] text-foreground hover:bg-muted"
                    onClick={a.fn}
                  >
                    {a.label}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {[
                  { label: "Repair", set: () => setItems((p) => p.map((i) => ({ ...i, rep: "Yes" }))), clear: () => setItems((p) => p.map((i) => ({ ...i, rep: "" }))) },
                  { label: "17025", set: () => setItems((p) => p.map((i) => ({ ...i, is17025: true }))), clear: () => setItems((p) => p.map((i) => ({ ...i, is17025: false }))) },
                ].map((g) => (
                  <div key={g.label} className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-muted-foreground">{g.label}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[11px]" onClick={g.set}>Set</Button>
                    <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[11px]" onClick={g.clear}>Clear</Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground rounded-lg border border-dashed px-2 py-1.5">
              Fill the mandatory quote details to unlock item actions.
            </p>
          )}
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
                  [...items].sort((a, b) => (a.status === "Cancelled" ? 1 : 0) - (b.status === "Cancelled" ? 1 : 0)).map((i) => {
                    const isCancelled = i.status === "Cancelled";
                    return (
                    <React.Fragment key={i.id}>
                    <tr className={cn(
                      "border-t transition-colors",
                      isCancelled
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200/60"
                        : i.rev
                          ? "bg-sky-100 text-sky-900 hover:bg-sky-200/70"
                          : "hover:bg-muted/40"
                    )}>
                      <td className="px-1 py-1">
                        <button
                          type="button"
                          disabled={isCancelled}
                          className="h-5 w-5 grid place-items-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => toggleExpanded(i.id)}
                          aria-label="Toggle details"
                        >
                          {expandedItems.includes(i.id) && !isCancelled
                            ? <ChevronDown className="h-3.5 w-3.5" />
                            : <ChevronRight className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                      <td className="px-2 py-1 text-center">
                        <Checkbox
                          checked={selectedItemIds.includes(i.id)}
                          onCheckedChange={(v) => setSelectedItemIds((p) => (v ? [...p, i.id] : p.filter((id) => id !== i.id)))}
                          aria-label="Select item"
                          className="h-4 w-4 rounded-md border-slate-400 transition-all data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <Checkbox
                          checked={i.rev}
                          disabled={isCancelled}
                          onCheckedChange={(v) => {
                            const receiving = !!v;
                            setItems((p) => p.map((it) => {
                              if (it.id !== i.id) return it;
                              if (receiving) {
                                return {
                                  ...it,
                                  rev: true,
                                  baseAmtOriginal: it.baseAmt,
                                  calCertOriginal: it.calCert,
                                  calc17025Original: it.calc17025,
                                  otherServicesOriginal: it.otherServices,
                                  otherPartsOriginal: it.otherParts,
                                  baseAmt: "0.00",
                                  calCert: "0.00",
                                  calc17025: "0.00",
                                  otherServices: "0.00",
                                  otherParts: "0.00",
                                };
                              }
                              return {
                                ...it,
                                rev: false,
                                baseAmt: it.baseAmtOriginal ?? it.baseAmt,
                                calCert: it.calCertOriginal ?? it.calCert,
                                calc17025: it.calc17025Original ?? it.calc17025,
                                otherServices: it.otherServicesOriginal ?? it.otherServices,
                                otherParts: it.otherPartsOriginal ?? it.otherParts,
                              };
                            }));
                          }}
                          className="h-4 w-4 rounded-md border-slate-400 transition-all data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white disabled:opacity-40"
                        />
                      </td>

                      <td className="px-2 py-1 text-center">{(itemServices[i.id] ?? []).length}</td>
                      <td className="px-2 py-1 text-center">{(itemParts[i.id] ?? []).length}</td>

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
                      <td className="px-2 py-1 text-right text-muted-foreground">{money(num(i.baseAmt))}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.calCert))}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.calc17025))}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.otherServices))}</td>
                      <td className="px-2 py-1 text-right">{money(num(i.otherParts))}</td>
                      <td className="px-2 py-1">{i.rep}</td>
                      <td className="px-2 py-1">{i.is17025 ? "Yes" : ""}</td>
                      <td className="px-2 py-1">{i.cp ? "Yes" : ""}</td>
                      <td className="px-2 py-1">
                        {!isCancelled && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                              onClick={() => openEdit(i)}
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded p-1 text-slate-600 hover:bg-red-50 hover:text-red-600"
                              onClick={() => setPendingDelete(i.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        {!isCancelled && (
                          <div className="flex items-center gap-1">
                            <button type="button" className="text-[11px] text-blue-600 hover:underline" onClick={() => duplicateItem(i)}>Copy</button>
                            <Input
                              value={copyQty[i.id] ?? "1"}
                              onChange={(e) => setCopyQty((p) => ({ ...p, [i.id]: e.target.value.replace(/\D/g, "") }))}
                              className="h-6 w-10 px-1 text-[11px] text-center"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                    {!isCancelled && expandedItems.includes(i.id) && (
                      <tr className="border-t bg-muted/20">
                        <td colSpan={ITEM_COLUMNS.length} className="px-3 py-2">
                          <div className="max-w-[860px] space-y-2">
                            {([
                              { label: "Service", rows: itemServices[i.id] ?? [], setter: setItemServices },
                              { label: "Part", rows: itemParts[i.id] ?? [], setter: setItemParts },
                            ] as const).map((sec) => (
                              <div key={sec.label} className="rounded-md border border-border bg-background overflow-hidden">
                                <table className="w-full text-[11px]">
                                  <thead className="bg-muted/50">
                                    <tr className="border-b">
                                      <th className="w-12 px-2 py-1 text-left">
                                        <button
                                          type="button"
                                          className="text-[11px] text-blue-600 hover:underline"
                                          onClick={() => addSubLine(sec.setter, i.id)}
                                        >
                                          New
                                        </button>
                                      </th>
                                      <th className="px-2 py-1 text-left font-semibold italic text-muted-foreground">{sec.label}</th>
                                      <th className="w-16 px-2 py-1 text-left font-semibold italic text-muted-foreground">Qty</th>
                                      <th className="w-28 px-2 py-1 text-right font-semibold italic text-muted-foreground">Base Cost</th>
                                      <th className="w-24 px-2 py-1 text-right font-semibold italic text-muted-foreground">Cost</th>
                                      <th className="w-10 px-2 py-1" />
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sec.rows.length === 0 ? (
                                      <tr>
                                        <td colSpan={6} className="py-6 text-center text-[11px] text-muted-foreground">
                                          No data to display
                                        </td>
                                      </tr>
                                    ) : (
                                      sec.rows.map((r) => (
                                        <tr key={r.id} className="border-t">
                                          <td className="px-2 py-1" />
                                          <td className="px-2 py-1">
                                            <Input
                                              value={r.name}
                                              placeholder={sec.label}
                                              onChange={(e) => updateSubLine(sec.setter, i.id, r.id, { name: e.target.value })}
                                              className="h-6 text-[11px]"
                                            />
                                          </td>
                                          <td className="px-2 py-1">
                                            <Input
                                              value={r.qty}
                                              onChange={(e) => updateSubLine(sec.setter, i.id, r.id, { qty: e.target.value.replace(/\D/g, "") })}
                                              className="h-6 text-[11px] text-center px-1"
                                            />
                                          </td>
                                          <td className="px-2 py-1">
                                            <Input
                                              value={r.baseCost}
                                              onChange={(e) => updateSubLine(sec.setter, i.id, r.id, { baseCost: e.target.value })}
                                              className="h-6 text-[11px] text-right px-1"
                                            />
                                          </td>
                                          <td className="px-2 py-1">
                                            <Input
                                              value={r.cost}
                                              onChange={(e) => updateSubLine(sec.setter, i.id, r.id, { cost: e.target.value })}
                                              className="h-6 text-[11px] text-right px-1"
                                            />
                                          </td>
                                          <td className="px-2 py-1 text-right">
                                            <button
                                              type="button"
                                              className="inline-flex items-center justify-center rounded p-1 text-slate-600 hover:bg-red-50 hover:text-red-600"
                                              onClick={() => removeSubLine(sec.setter, i.id, r.id)}
                                              title="Delete"
                                            >
                                              <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}

                    </React.Fragment>
                  );
                })

                )}
              </tbody>
            </table>
          </div>

          {/* Testing Items */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-semibold text-foreground">Testing Items</h4>
              <Badge variant="secondary" className="text-[10px]">{testingItems.length}</Badge>
            </div>
            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead className="bg-muted/60">
                  <tr className="[&>th]:px-2 [&>th]:py-1.5 [&>th]:font-medium [&>th]:text-muted-foreground [&>th]:whitespace-nowrap">
                    <th className="text-center w-14">Cancel</th>
                    <th className="text-center w-12">Rcv</th>
                    <th className="text-center w-14">Qty</th>
                    <th className="text-left">Groupable</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Section/Length</th>
                    <th className="text-left">Priority</th>
                    <th className="text-left">WO #</th>
                    <th className="text-left">Status</th>
                    <th className="text-right w-20">Fee Amt</th>
                    <th className="text-right w-20">Total</th>
                    <th className="text-left w-14">Rep.</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {testingItems.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-2 py-6 text-center text-muted-foreground">
                        No data to display
                      </td>
                    </tr>
                  ) : (
                    testingItems.map((r) => (
                      <tr key={r.id} className={cn("border-t", r.cancel && "opacity-50 line-through")}>
                        <td className="px-2 py-1 text-center">
                          <Checkbox
                            checked={r.cancel}
                            onCheckedChange={(v) => updateTestingRow(r.id, { cancel: !!v })}
                            className="h-3.5 w-3.5 rounded data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <Checkbox
                            checked={r.rcv}
                            onCheckedChange={(v) => updateTestingRow(r.id, { rcv: !!v })}
                            className="h-3.5 w-3.5 rounded data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            value={r.qty}
                            onChange={(e) => updateTestingRow(r.id, { qty: e.target.value })}
                            className="h-6 w-12 px-1 text-[11px] text-center"
                          />
                        </td>
                        <td className="px-2 py-1 font-medium">{r.groupable}</td>
                        <td className="px-2 py-1 text-muted-foreground">{r.type || "—"}</td>
                        <td className="px-2 py-1">
                          <Input
                            value={r.sectionLength}
                            onChange={(e) => updateTestingRow(r.id, { sectionLength: e.target.value })}
                            className="h-6 px-1 text-[11px]"
                          />
                        </td>
                        <td className="px-2 py-1">{r.priority}</td>
                        <td className="px-2 py-1">
                          <Input
                            value={r.woNo}
                            onChange={(e) => updateTestingRow(r.id, { woNo: e.target.value })}
                            className="h-6 px-1 text-[11px]"
                          />
                        </td>
                        <td className="px-2 py-1 text-muted-foreground">{r.status || "—"}</td>
                        <td className="px-2 py-1">
                          <Input
                            value={r.feeAmt}
                            onChange={(e) => updateTestingRow(r.id, { feeAmt: e.target.value })}
                            className="h-6 px-1 text-[11px] text-right"
                          />
                        </td>
                        <td className="px-2 py-1 text-right font-medium">{testingRowTotal(r)}</td>
                        <td className="px-2 py-1 text-muted-foreground">{r.rep || "—"}</td>
                        <td className="px-2 py-1">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded p-1 text-slate-600 hover:bg-muted"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded p-1 text-slate-600 hover:bg-red-50 hover:text-red-600"
                              onClick={() => removeTestingRow(r.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </AccSection>

        {/* Project details */}
          <AccSection value="project" icon={FileText} title="Project Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Proposed Project">
                <AutoTextarea value={proposedProject} onChange={(e) => setProposedProject(e.target.value)}  />
              </Field>
              <Field label="Special Instructions">
                <AutoTextarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)}  />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Field label="Ship Method">
                <SelectField value={shipMethod} onChange={setShipMethod} options={SHIP_METHODS} placeholder="Select ship method" />
              </Field>
              <Field label="Service Type">
                <SelectField value={serviceType} onChange={setServiceType} options={SERVICE_TYPES} placeholder="Select service type" />
              </Field>
            </div>
          </AccSection>


        {/* Comments */}
        <AccSection value="comments" icon={MessageSquare} title="Comments" badge={comments.length}>
              <div className="flex flex-col md:flex-row gap-2 items-start">
                  <div className="w-full md:w-40">
                    <SelectField value={commentType} onChange={setCommentType} options={COMMENT_TYPES} placeholder="Type" />
                  </div>
                  <AutoTextarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className={"flex-1"}
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
          <aside className="xl:sticky xl:top-2 self-start space-y-2">
            {allMandatoryFilled && (
              <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 px-2.5 py-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] text-muted-foreground">Quote #</span>
                  <span className="text-xs font-semibold tabular-nums">{quoteNo}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    {quoteStatus}
                  </span>
                </div>
              </div>
            )}
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
              <div className="space-y-2">
                {/* Segmented source toggle */}
                <div className="flex p-1 bg-muted rounded-md">
                  <button
                    type="button"
                    onClick={() => setCopySource(copySource === "quote" ? null : "quote")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium rounded transition-all",
                      copySource === "quote"
                        ? "bg-white text-black shadow-sm border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => setCopySource(copySource === "wo" ? null : "wo")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium rounded transition-all",
                      copySource === "wo"
                        ? "bg-white text-black shadow-sm border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    Work Order
                  </button>
                </div>

                {copySource === "quote" && (
                  <div className="space-y-2">
                    <div className="relative flex items-center">
                      <Input
                        value={copyQuoteNo}
                        onChange={(e) => setCopyQuoteNo(e.target.value)}
                        placeholder="Quote #"
                        className={cn(inputCls, "pr-16 w-full")}
                      />
                      <Button
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-5 text-[10px] px-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => toast({ title: "Copied from quote" })}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="incl" checked={includeServices} onCheckedChange={(v) => setIncludeServices(!!v)} />
                      <Label htmlFor="incl" className="text-[11px] font-normal">Include Services</Label>
                    </div>
                  </div>
                )}

                {copySource === "wo" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="W.O. #">
                        <Input value={copyWo} onChange={(e) => setCopyWo(e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Item #">
                        <Input value={copyItem} onChange={(e) => setCopyItem(e.target.value)} className={inputCls} />
                      </Field>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] w-full"
                      onClick={() => toast({ title: "Copied from work order" })}
                    >
                      Copy from W.O.
                    </Button>
                  </div>
                )}

                {!copySource && (
                  <p className="text-[10px] text-muted-foreground px-1">
                    Select a source to populate items and pricing from an existing record.
                  </p>
                )}
              </div>
            </SectionCard>
          </aside>
        </div>

      </main>

      <SearchAddItemDialog
        open={searchAddOpen}
        onOpenChange={setSearchAddOpen}
        onAdd={handleSearchAdd}
      />

      <AddTestingItemsDialog
        open={testingItemsOpen}
        onOpenChange={setTestingItemsOpen}
        onAdd={handleAddTestingItems}
      />



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
              onClick={handleSave}
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
                <AutoTextarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}  />
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

      <AlertDialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cancel {selectedItemIds.length} selected item{selectedItemIds.length === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cancelled items stay on the quote as read-only rows moved to the bottom of the list, and are excluded from editing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep items</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setItems((prev) => prev.map((i) => (selectedItemIds.includes(i.id) ? { ...i, status: "Cancelled" } : i)));
                setExpandedItems((prev) => prev.filter((id) => !selectedItemIds.includes(id)));
                setSelectedItemIds([]);
                setCancelConfirmOpen(false);
              }}
            >
              Cancel items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={uncancelConfirmOpen} onOpenChange={setUncancelConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Uncancel {selectedItemIds.length} selected item{selectedItemIds.length === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Uncancelled items will become editable again and return to their normal position in the quote list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep cancelled</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setItems((prev) => prev.map((i) => (selectedItemIds.includes(i.id) && i.status === "Cancelled" ? { ...i, status: "" } : i)));
                setSelectedItemIds([]);
                setUncancelConfirmOpen(false);
              }}
            >
              Uncancel items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

  );
};

export default NewQuote;
