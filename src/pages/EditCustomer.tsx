import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Save,
  FilePlus2,
  MoreHorizontal,
  Copy,
  Archive,
  Download,
  Printer,
  Activity,
  Trash2,
  Building2,
  MapPin,
  User,
  Briefcase,
  DollarSign,
  Settings2,
  StickyNote,
  Users,
  FileText,
  Bell,
  Tag,
  Receipt,
  Package,
  FolderOpen,
  Paperclip,
  Upload,
  Eye,
  Pencil,
  Star,
  Plus,
  CalendarClock,
  History,
  Mail,
  Phone,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";

/* ------------------------------- Helpers ------------------------------- */

const StatusChip = ({ status }: { status: "Active" | "Pending" | "Inactive" }) => {
  const map: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Inactive: "bg-slate-50 text-slate-700 border-slate-100",
  };
  const dotMap: Record<string, string> = {
    Active: "bg-emerald-500",
    Pending: "bg-amber-500",
    Inactive: "bg-slate-400",
  };
  return (
    <Badge
      variant="outline"
      className={`h-6 px-2 text-[11px] font-medium hover:bg-transparent ${map[status]}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dotMap[status]}`} />
      {status}
    </Badge>
  );
};

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description?: string;
}) => (
  <CardHeader className="p-2 pb-1.5">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
          <Icon className="h-3 w-3" />
        </div>
        <div>
          <CardTitle className="text-[11px] font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-[9px] mt-0.5">{description}</CardDescription>
          )}
        </div>
      </div>
    </div>
  </CardHeader>
);

const FieldRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-x-2 gap-y-1.5">{children}</div>
);

const Field = ({
  label,
  required,
  children,
  full,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={`space-y-0.5 ${full ? "md:col-span-2 lg:col-span-3 xl:col-span-2" : ""}`}>
    <Label className="text-[9px] font-medium text-foreground">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
    {children}
  </div>
);

const ToggleRow = ({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <div className="flex items-start justify-between gap-3 py-1 border-b border-border last:border-0">
      <div className="min-w-0">
        <div className="text-[10px] font-medium text-foreground">{label}</div>
        {description && (
          <div className="text-[9px] text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} className="scale-90" />
    </div>
  );
};

const MetaItem = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) => (
  <div className="flex items-start justify-between gap-3 py-1.5">
    <div className="text-[11px] text-muted-foreground">{label}</div>
    <div className={`text-xs text-foreground text-right ${mono ? "tabular-nums" : ""}`}>{value}</div>
  </div>
);

/* --------------------------- Mock customer --------------------------- */

interface CustomerData {
  accountNumber: string;
  name: string;
  status: "Active" | "Pending" | "Inactive";
  primaryContact: string;
  phone: string;
  email: string;
  salesperson: string;
  industry: string;
  contractPricing: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

const mockLookup: Record<string, Partial<CustomerData>> = {
  "0185.12": { name: "Entergy Mississippi LLC", salesperson: "Vincent E. Lloyde", phone: "(601) 555-0142", email: "ops@entergy-ms.com", primaryContact: "Rebecca Hall" },
  "2588.00": { name: "John Deere", salesperson: "Christian B. ONeal", phone: "(309) 555-0100", email: "cal@deere.com", primaryContact: "James Wu" },
  "10323.00": { name: "Sabal Trail Transmission LLC", salesperson: "Jerome J. Davis", phone: "(561) 555-0187", email: "ops@sabaltrail.com", primaryContact: "Priya Menon" },
};

/* --------------------------- Contacts Section --------------------------- */

type ContactRow = {
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  fax: string;
  cell: string;
  email: string;
  website: string;
  comments: string;
  active: boolean;
  dne: boolean;
  nrn: boolean;
};

const mockContacts: ContactRow[] = [
  { firstName: "Blair", lastName: "Brewer", title: "", phone: "234-234-2344", fax: "", cell: "", email: "blairb007@gmail.com", website: "", comments: "Testing", active: false, dne: true, nrn: true },
  { firstName: "Loretta", lastName: "Rinaldi", title: "Sales Manager", phone: "111-111-1111", fax: "", cell: "", email: "lorettakrinaldi@jmtest.com", website: "http://www.jmtest.com", comments: "", active: true, dne: false, nrn: false },
  { firstName: "Alicia", lastName: "Brewer", title: "", phone: "", fax: "", cell: "", email: "", website: "", comments: "N/A", active: false, dne: false, nrn: false },
  { firstName: "Sonny", lastName: "Test", title: "", phone: "999-999-9999", fax: "", cell: "", email: "", website: "", comments: "", active: false, dne: false, nrn: false },
  { firstName: "Janette", lastName: "Test", title: "", phone: "(225) 925-2029", fax: "", cell: "", email: "janettecoon@jmtest.com", website: "", comments: "", active: false, dne: false, nrn: false },
  { firstName: "Rhonda", lastName: "Gilbert", title: "Ops Lead", phone: "225-123-4567", fax: "", cell: "225-999-1122", email: "rhondagilbert@jmtest.com", website: "", comments: "", active: false, dne: false, nrn: false },
  { firstName: "Tim", lastName: "Oldendorf", title: "Buyer", phone: "123-456-789", fax: "", cell: "", email: "timoldendorf@jmtest.com", website: "", comments: "", active: true, dne: false, nrn: false },
  { firstName: "Tabatha", lastName: "Gates", title: "Coordinator", phone: "225-325-6999", fax: "", cell: "", email: "tabathagates@jmtest.com", website: "", comments: "", active: true, dne: false, nrn: false },
  { firstName: "Viet", lastName: "Le", title: "Engineer", phone: "444-444-4444", fax: "", cell: "", email: "", website: "", comments: "", active: true, dne: false, nrn: false },
  { firstName: "Lukas", lastName: "Frick", title: "", phone: "777-777-7777", fax: "", cell: "", email: "", website: "", comments: "", active: true, dne: false, nrn: false },
];

const YNBadge = ({ value, tone = "emerald" }: { value: boolean; tone?: "emerald" | "amber" | "slate" }) => {
  const toneMap = {
    emerald: value ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100",
    amber: value ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-500 border-slate-100",
    slate: value ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-slate-50 text-slate-500 border-slate-100",
  } as const;
  return (
    <Badge variant="outline" className={`h-4 px-1 text-[9px] hover:bg-transparent ${toneMap[tone]}`}>
      {value ? "Y" : "N"}
    </Badge>
  );
};

const emptyContact: ContactRow = {
  firstName: "", lastName: "", title: "", phone: "", fax: "", cell: "",
  email: "", website: "", comments: "", active: true, dne: false, nrn: false,
};

function ContactsSection({ onCreateQuote }: { onCreateQuote: () => void }) {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<ContactRow[]>(mockContacts);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<ContactRow>(emptyContact);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = contacts.map((c, i) => ({ c, i }));
    if (!q) return list;
    return list.filter(({ c }) =>
      [c.firstName, c.lastName, c.title, c.email, c.phone, c.cell].some((v) => v.toLowerCase().includes(q))
    );
  }, [query, contacts]);

  const openEdit = (index: number) => {
    setEditIndex(index);
    setDraft({ ...contacts[index] });
  };
  const openAdd = () => {
    setEditIndex(-1);
    setDraft({ ...emptyContact });
  };
  const closeDialog = () => setEditIndex(null);
  const saveDraft = () => {
    if (editIndex === null) return;
    setContacts((prev) => {
      if (editIndex === -1) return [...prev, draft];
      const next = [...prev];
      next[editIndex] = draft;
      return next;
    });
    setEditIndex(null);
  };
  const confirmDelete = (index: number) => setDeleteIndex(index);
  const closeDeleteDialog = () => setDeleteIndex(null);
  const executeDelete = () => {
    if (deleteIndex === null) return;
    setContacts((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
  };
  const setField = <K extends keyof ContactRow>(key: K, value: ContactRow[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));




  return (
    <Card>
      <CardHeader className="p-2.5 pb-2 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search contacts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-7 w-48 text-[11px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setView("cards")}
              aria-label="Card view"
              className={`h-7 w-7 flex items-center justify-center ${view === "cards" ? "bg-blue-600 text-white" : "bg-white text-foreground hover:bg-muted"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              className={`h-7 w-7 flex items-center justify-center border-l border-border ${view === "list" ? "bg-blue-600 text-white" : "bg-white text-foreground hover:bg-muted"}`}
            >
              <ListIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button size="sm" className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white" onClick={openAdd}>
            <Plus className="h-3 w-3 mr-1" />Add Contact
          </Button>
        </div>
      </CardHeader>

      <CardContent className={view === "cards" ? "p-2.5 pt-0" : "p-0"}>
        {view === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filtered.map(({ c, i }) => (
              <Card key={i} className="border">
                <CardContent className="p-2 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold truncate">
                        {c.firstName} {c.lastName}
                      </div>
                      {c.title && <div className="text-[10px] text-muted-foreground truncate">{c.title}</div>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <YNBadge value={c.active} tone="emerald" />
                      <Badge variant="outline" className="h-4 px-1 text-[9px] hover:bg-transparent bg-slate-50 text-slate-600 border-slate-100">
                        DNE:{c.dne ? "Y" : "N"}
                      </Badge>
                      <Badge variant="outline" className="h-4 px-1 text-[9px] hover:bg-transparent bg-slate-50 text-slate-600 border-slate-100">
                        NRN:{c.nrn ? "Y" : "N"}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-0.5 text-[10px] text-muted-foreground">
                    {c.phone && <div className="flex items-center gap-1 truncate"><Phone className="h-2.5 w-2.5 shrink-0" />{c.phone}</div>}
                    {c.cell && <div className="flex items-center gap-1 truncate"><Phone className="h-2.5 w-2.5 shrink-0" />Cell: {c.cell}</div>}
                    {c.fax && <div className="flex items-center gap-1 truncate">Fax: {c.fax}</div>}
                    {c.email && <div className="flex items-center gap-1 truncate"><Mail className="h-2.5 w-2.5 shrink-0" />{c.email}</div>}
                    {c.website && <div className="truncate">🌐 {c.website}</div>}
                    {c.comments && <div className="italic truncate">“{c.comments}”</div>}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-5 px-0 text-[10px] text-blue-600"
                      onClick={onCreateQuote}
                    >
                      Create Quote
                    </Button>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openEdit(i)}><Pencil className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => confirmDelete(i)}><Trash2 className="h-3 w-3" /></Button>

                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="h-7">
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">First Name</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">Last Name</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">Title</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">Phone #</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">Fax #</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">Cell #</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">Email Address</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">Website</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2">Comments</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2 text-center">Active</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2 text-center">DNE</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2 text-center">NRN</TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2"></TableHead>
                  <TableHead className="text-[10px] uppercase py-1.5 px-2 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(({ c, i }) => (
                  <TableRow key={i} className="text-[11px]">
                    <TableCell className="py-1.5 px-2 font-medium">{c.firstName}</TableCell>
                    <TableCell className="py-1.5 px-2 font-medium">{c.lastName}</TableCell>
                    <TableCell className="py-1.5 px-2 text-muted-foreground">{c.title || "—"}</TableCell>
                    <TableCell className="py-1.5 px-2 tabular-nums">{c.phone || "—"}</TableCell>
                    <TableCell className="py-1.5 px-2 tabular-nums">{c.fax || "—"}</TableCell>
                    <TableCell className="py-1.5 px-2 tabular-nums">{c.cell || "—"}</TableCell>
                    <TableCell className="py-1.5 px-2">
                      {c.email ? <a className="text-blue-600 hover:underline" href={`mailto:${c.email}`}>{c.email}</a> : "—"}
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      {c.website ? <a className="text-blue-600 hover:underline" href={c.website} target="_blank" rel="noreferrer">{c.website}</a> : "—"}
                    </TableCell>
                    <TableCell className="py-1.5 px-2 text-muted-foreground max-w-[160px] truncate">{c.comments || "—"}</TableCell>
                    <TableCell className="py-1.5 px-2 text-center"><YNBadge value={c.active} /></TableCell>
                    <TableCell className="py-1.5 px-2 text-center"><YNBadge value={c.dne} tone="amber" /></TableCell>
                    <TableCell className="py-1.5 px-2 text-center"><YNBadge value={c.nrn} tone="slate" /></TableCell>
                    <TableCell className="py-1.5 px-2">
                      <Button variant="link" size="sm" className="h-5 px-0 text-[10px] text-blue-600" onClick={onCreateQuote}>
                        Create Quote
                      </Button>
                    </TableCell>
                    <TableCell className="py-1.5 px-2 text-right">
                      <div className="inline-flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openEdit(i)}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => confirmDelete(i)}><Trash2 className="h-3 w-3" /></Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={editIndex !== null} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm">{editIndex === -1 ? "Add Contact" : "Edit Contact"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px]">First Name</Label>
              <Input className="h-8 text-[12px]" value={draft.firstName} onChange={(e) => setField("firstName", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Last Name</Label>
              <Input className="h-8 text-[12px]" value={draft.lastName} onChange={(e) => setField("lastName", e.target.value)} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-[11px]">Title</Label>
              <Input className="h-8 text-[12px]" value={draft.title} onChange={(e) => setField("title", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Phone #</Label>
              <Input className="h-8 text-[12px]" value={draft.phone} onChange={(e) => setField("phone", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Cell #</Label>
              <Input className="h-8 text-[12px]" value={draft.cell} onChange={(e) => setField("cell", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Fax #</Label>
              <Input className="h-8 text-[12px]" value={draft.fax} onChange={(e) => setField("fax", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Email</Label>
              <Input className="h-8 text-[12px]" value={draft.email} onChange={(e) => setField("email", e.target.value)} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-[11px]">Website</Label>
              <Input className="h-8 text-[12px]" value={draft.website} onChange={(e) => setField("website", e.target.value)} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-[11px]">Comments</Label>
              <Textarea className="text-[12px] min-h-[60px]" value={draft.comments} onChange={(e) => setField("comments", e.target.value)} />
            </div>
            <div className="flex items-center gap-4 col-span-2">
              <label className="flex items-center gap-2 text-[11px]">
                <Switch checked={draft.active} onCheckedChange={(v) => setField("active", v)} /> Active
              </label>
              <label className="flex items-center gap-2 text-[11px]">
                <Switch checked={draft.dne} onCheckedChange={(v) => setField("dne", v)} /> DNE
              </label>
              <label className="flex items-center gap-2 text-[11px]">
                <Switch checked={draft.nrn} onCheckedChange={(v) => setField("nrn", v)} /> NRN
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={closeDialog}>Cancel</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={saveDraft}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteIndex !== null} onOpenChange={(o) => !o && closeDeleteDialog()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Delete contact?</DialogTitle>
          </DialogHeader>
          <p className="text-[12px] text-muted-foreground">
            Are you sure you want to remove <span className="font-medium text-foreground">{contacts[deleteIndex ?? 0]?.firstName} {contacts[deleteIndex ?? 0]?.lastName}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={closeDeleteDialog}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={executeDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>

  );
}



export default function EditCustomer() {
  const { accountNumber } = useParams<{ accountNumber: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const acct = accountNumber || "00000.00";

  const customer: CustomerData = useMemo(() => {
    const found = mockLookup[acct] || {};
    return {
      accountNumber: acct,
      name: found.name ?? "Test Industries",
      status: (found as any).status ?? "Active",
      primaryContact: found.primaryContact ?? "Jamie Rivers",
      phone: found.phone ?? "(555) 010-2233",
      email: found.email ?? "jamie@test-industries.com",
      salesperson: found.salesperson ?? "Vincent E. Lloyde",
      industry: "Utilities",
      contractPricing: "Enabled",
      createdBy: "System Admin",
      createdDate: "Jan 12, 2023",
      modifiedBy: "Jerome J. Davis",
      modifiedDate: "Jul 02, 2026",
    };
  }, [acct]);

  const handleSave = () =>
    toast({ title: "Changes saved", description: `Customer ${customer.accountNumber} updated.` });

  const [generalLeftOpen] = useState(["customer-info", "retest", "primary-contact", "notes"]);
  const [generalRightOpen] = useState(["business", "pricing", "operational"]);


  return (
    <div className="min-h-screen bg-muted/20">
      <ModernTopNav />

      {/* Sticky page action bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-border">
        <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
              Customer Details
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              View and manage customer information, contacts, pricing, work orders, and settings.
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-semibold leading-tight">{customer.name}</span>
                  <StatusChip status={customer.status} />
                </div>
                <div className="text-[11px] text-muted-foreground">Account # {customer.accountNumber}</div>
              </div>
            </div>

            <div className="hidden sm:block h-10 w-px bg-border" />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3.5 text-xs"
                onClick={() => toast({ title: "Create Quote", description: "Opening quote form…" })}
              >
                <FilePlus2 className="h-3.5 w-3.5 mr-1.5" />
                Create Quote
              </Button>
              <Button
                size="sm"
                className="h-9 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSave}
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Changes
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem>
                    <Copy className="h-3.5 w-3.5 mr-2" />Duplicate Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-3.5 w-3.5 mr-2" />Export Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Printer className="h-3.5 w-3.5 mr-2" />Print Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Activity className="h-3.5 w-3.5 mr-2" />View Activity
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Archive className="h-3.5 w-3.5 mr-2" />Archive Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-2" />Delete Customer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <main className="px-3 sm:px-4 lg:px-6 py-4">
        <div className="max-w-[1600px] mx-auto space-y-4">
          {/* Summary card */}
          <Card>
            <CardContent className="p-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-2 gap-y-1">
                <div className="min-w-0">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide">Customer</div>
                  <div className="text-[10px] font-semibold truncate leading-tight">{customer.name}</div>
                  <div className="text-[9px] text-muted-foreground tabular-nums leading-tight">#{customer.accountNumber}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide">Status</div>
                  <div className="mt-0.5"><StatusChip status={customer.status} /></div>
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide">Primary Contact</div>
                  <div className="text-[10px] font-medium truncate leading-tight">{customer.primaryContact}</div>
                  <div className="text-[9px] text-muted-foreground truncate leading-tight">{customer.phone}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide">Salesperson</div>
                  <div className="text-[10px] font-medium truncate leading-tight">{customer.salesperson}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide">Industry</div>
                  <div className="text-[10px] font-medium truncate leading-tight">{customer.industry}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide">Contract Pricing</div>
                  <div className="mt-0.5">
                    <Badge variant="outline" className="h-3.5 px-1 text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-transparent">
                      {customer.contractPricing}
                    </Badge>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide">Created By</div>
                  <div className="text-[10px] font-medium truncate leading-tight">{customer.createdBy}</div>
                  <div className="text-[9px] text-muted-foreground tabular-nums leading-tight">{customer.createdDate}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wide">Modified By</div>
                  <div className="text-[10px] font-medium truncate leading-tight">{customer.modifiedBy}</div>
                  <div className="text-[9px] text-muted-foreground tabular-nums leading-tight">{customer.modifiedDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Full-width tabs + right sidebar */}
          <Tabs defaultValue="general" className="w-full">
            <div className="sticky top-[73px] z-20 bg-muted/20 -mx-1 px-1 py-1">
              <TabsList className="h-9 bg-white border border-border p-1 flex w-full">
                {[
                  { v: "general", label: "General", icon: Building2 },
                  { v: "contacts", label: "Contacts", icon: Users },
                  { v: "work-orders", label: "Work Orders", icon: FileText },
                  { v: "retest", label: "Retest Notices", icon: Bell },
                  { v: "print-tags", label: "Print Tags", icon: Tag },
                  { v: "contract", label: "Contract Pricing", icon: DollarSign },
                  { v: "fees", label: "Fee Schedule", icon: Receipt },
                  { v: "custom", label: "Custom Fields", icon: Settings2 },
                  { v: "po", label: "Purchase Orders", icon: Package },
                  { v: "quotes", label: "Quotes", icon: FilePlus2 },
                  { v: "files", label: "WO External Files", icon: FolderOpen },
                ].map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="h-7 px-1 text-[11px] flex-1 min-w-0 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <t.icon className="h-3 w-3 mr-1 shrink-0" />
                    <span className="truncate">{t.label}</span>

                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4 mt-4">
              <div className="min-w-0">





              {/* GENERAL */}
              <TabsContent value="general" className="space-y-2 mt-2">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <Accordion
                    type="multiple"
                    value={generalLeftOpen}
                    onValueChange={() => {}}
                    className="space-y-1.5"
                  >
                    {/* Customer Information */}
                    <AccordionItem value="customer-info" className="border rounded-md bg-card">
                      <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <Building2 className="h-3 w-3" />
                          </div>
                          <div className="text-left">
                            <div className="text-[11px] font-semibold">Customer Information</div>
                            <div className="text-[9px] text-muted-foreground">Primary account and shipping address.</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-0">
                        <FieldRow>
                          <Field label="Customer Status" required>
                            <Select defaultValue="active">
                              <SelectTrigger className="h-7 text-[11px] md:text-[11px] px-2.5 py-1"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem className="text-[11px]" value="active">Active</SelectItem>
                                <SelectItem className="text-[11px]" value="pending">Pending</SelectItem>
                                <SelectItem className="text-[11px]" value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field label="Account Number" required>
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1 tabular-nums" defaultValue={customer.accountNumber} readOnly />
                          </Field>
                          <Field label="Customer Name" required>
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue={customer.name} />
                          </Field>
                          <Field label="Ship To">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue={customer.name} />
                          </Field>
                          <Field label="Address">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="123 Industrial Way" />
                          </Field>
                          <Field label="City">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="Baton Rouge" />
                          </Field>
                          <Field label="State">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="LA" />
                          </Field>
                          <Field label="Zip Code">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="70801" />
                          </Field>
                        </FieldRow>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Retest Address */}
                    <AccordionItem value="retest" className="border rounded-md bg-card">
                      <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <MapPin className="h-3 w-3" />
                          </div>
                          <div className="text-left">
                            <div className="text-[11px] font-semibold">Retest Address</div>
                            <div className="text-[9px] text-muted-foreground">Where recall / retest notices are mailed.</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-0">
                        <FieldRow>
                          <Field label="Retest Mail To">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue={customer.name} />
                          </Field>
                          <Field label="Address">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="Same as shipping" />
                          </Field>
                          <Field label="City">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="Baton Rouge" />
                          </Field>
                          <Field label="State">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="LA" />
                          </Field>
                          <Field label="Zip Code">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="70801" />
                          </Field>
                        </FieldRow>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Primary Contact */}
                    <AccordionItem value="primary-contact" className="border rounded-md bg-card">
                      <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <User className="h-3 w-3" />
                          </div>
                          <div className="text-left">
                            <div className="text-[11px] font-semibold">Primary Contact</div>
                            <div className="text-[9px] text-muted-foreground">Main person for account communications.</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-0">
                        <FieldRow>
                          <Field label="Main Contact" required>
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue={customer.primaryContact} />
                          </Field>
                          <Field label="Phone Number">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue={customer.phone} />
                          </Field>
                          <Field label="Email">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue={customer.email} />
                          </Field>
                          <Field label="Biller Code">
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue="BC-102" />
                          </Field>
                        </FieldRow>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Notes */}
                    <AccordionItem value="notes" className="border rounded-md bg-card">
                      <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <StickyNote className="h-3 w-3" />
                          </div>
                          <div className="text-left">
                            <div className="text-[11px] font-semibold">Notes</div>
                            <div className="text-[9px] text-muted-foreground">Customer-facing remarks and internal comments.</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-0">
                        <div className="grid grid-cols-1 gap-2">
                          <Field label="Remarks" full>
                            <Textarea
                              className="text-[11px] md:text-[11px] px-2.5 py-1.5 min-h-[60px]"
                              placeholder="Visible on quotes and work orders…"
                              defaultValue="Prefers Wednesday deliveries. Requires PO on all shipments."
                            />
                          </Field>
                          <Field label="Internal Comments" full>
                            <Textarea
                              className="text-[11px] md:text-[11px] px-2.5 py-1.5 min-h-[60px]"
                              placeholder="Internal only — not shared with the customer."
                              defaultValue="Key account. Route escalations to Jerome directly."
                            />
                          </Field>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Accordion
                    type="multiple"
                    value={generalRightOpen}
                    onValueChange={() => {}}
                    className="space-y-1.5"
                  >
                    {/* Business Information */}
                    <AccordionItem value="business" className="border rounded-md bg-card">
                      <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <Briefcase className="h-3 w-3" />
                          </div>
                          <div className="text-left">
                            <div className="text-[11px] font-semibold">Business Information</div>
                            <div className="text-[9px] text-muted-foreground">Industry, documentation and payment terms.</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-0">
                        <FieldRow>
                          <Field label="Salesperson" required>
                            <Input className="h-7 text-[11px] md:text-[11px] px-2.5 py-1" defaultValue={customer.salesperson} />
                          </Field>
                          <Field label="Industry Code">
                            <Select defaultValue="utilities">
                              <SelectTrigger className="h-7 text-[11px] md:text-[11px] px-2.5 py-1"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem className="text-[10px]" value="utilities">Utilities</SelectItem>
                                <SelectItem className="text-[10px]" value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem className="text-[10px]" value="oilgas">Oil &amp; Gas</SelectItem>
                                <SelectItem className="text-[10px]" value="construction">Construction</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field label="OSR Number">
                            <Input className="h-6 text-[10px] md:text-[10px] px-2 py-0" defaultValue="OSR-2456" />
                          </Field>
                          <Field label="OSR Document">
                            <Input className="h-6 text-[10px] md:text-[10px] px-2 py-0" defaultValue="osr-2024.pdf" />
                          </Field>
                          <Field label="SR Document">
                            <Input className="h-6 text-[10px] md:text-[10px] px-2 py-0" defaultValue="sr-2024.pdf" />
                          </Field>
                          <Field label="Payment Terms">
                            <Select defaultValue="net30">
                              <SelectTrigger className="h-6 text-[10px] md:text-[10px] px-2 py-0"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem className="text-[10px]" value="net15">Net 15</SelectItem>
                                <SelectItem className="text-[10px]" value="net30">Net 30</SelectItem>
                                <SelectItem className="text-[10px]" value="net60">Net 60</SelectItem>
                                <SelectItem className="text-[10px]" value="cod">COD</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        </FieldRow>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Pricing & Inventory */}
                    <AccordionItem value="pricing" className="border rounded-md bg-card">
                      <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <DollarSign className="h-3 w-3" />
                          </div>
                          <div className="text-left">
                            <div className="text-[11px] font-semibold">Pricing & Inventory</div>
                            <div className="text-[9px] text-muted-foreground">Contract pricing and surplus access.</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-0">
                        <div className="grid grid-cols-1 gap-y-1">
                          <ToggleRow label="Contract Pricing" description="Apply negotiated contract rates to this customer." defaultChecked />
                          <ToggleRow label="ESL Surplus Inventory" description="Allow use of ESL surplus stock for fulfilment." defaultChecked />
                          <ToggleRow label="Global Surplus Access" description="Access surplus inventory across all warehouses." />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Operational Settings */}
                    <AccordionItem value="operational" className="border rounded-md bg-card">
                      <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <Settings2 className="h-3 w-3" />
                          </div>
                          <div className="text-left">
                            <div className="text-[11px] font-semibold">Operational Settings</div>
                            <div className="text-[9px] text-muted-foreground">Workflow and recall behaviour.</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-0">
                        <div className="grid grid-cols-1 gap-y-1">
                          <ToggleRow label="No Expedite Fees" description="Waive expedite fees for this account." />
                          <ToggleRow label="Enabled Calibration Frequency" description="Track calibration intervals automatically." defaultChecked />
                          <ToggleRow label="End of Month Recall" description="Include in end-of-month recall notifications." />
                          <ToggleRow label="Add to Service Date List" description="Include on scheduled service reminder lists." defaultChecked />
                          <ToggleRow label="Add to No Recall List" description="Exclude customer from recall notice runs." />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>

              {/* CONTACTS */}
              <TabsContent value="contacts" className="mt-2">
                <ContactsSection onCreateQuote={() => toast({ title: "Create Quote", description: "Opening quote form…" })} />
              </TabsContent>

              {/* WORK ORDERS */}
              <TabsContent value="work-orders" className="mt-2">
                <Card>
                  <CardHeader className="p-2.5 pb-2">
                    <CardTitle className="text-xs font-semibold">Work Orders</CardTitle>
                    <CardDescription className="text-[10px]">Recent work orders for this customer.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="h-7">
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Work Order</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Status</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Asset</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Technician</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Due Date</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Invoice</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { wo: "5432", status: "In Progress", asset: "Blanket Kit A-102", tech: "M. Alvarez", due: "Jul 15, 2026", inv: "Pending" },
                          { wo: "5401", status: "Completed", asset: "Gloves Class 2", tech: "R. Patel", due: "Jun 28, 2026", inv: "Invoiced" },
                          { wo: "5389", status: "On Hold", asset: "Grounds Set G-11", tech: "K. Nguyen", due: "Jun 22, 2026", inv: "—" },
                        ].map((r) => (
                          <TableRow key={r.wo} className="text-[11px]">
                            <TableCell className="font-medium tabular-nums py-1.5 px-2">{r.wo}</TableCell>
                            <TableCell className="py-1.5 px-2"><Badge variant="secondary" className="h-4 text-[10px]">{r.status}</Badge></TableCell>
                            <TableCell className="py-1.5 px-2">{r.asset}</TableCell>
                            <TableCell className="py-1.5 px-2">{r.tech}</TableCell>
                            <TableCell className="tabular-nums py-1.5 px-2">{r.due}</TableCell>
                            <TableCell className="py-1.5 px-2">{r.inv}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PURCHASE ORDERS */}
              <TabsContent value="po" className="mt-2">
                <Card>
                  <CardHeader className="p-2.5 pb-2">
                    <CardTitle className="text-xs font-semibold">Purchase Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="h-7">
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">PO Number</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Status</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Created</TableHead>
                          <TableHead className="text-[10px] uppercase text-right py-1.5 px-2">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { po: "PO-88210", status: "Open", created: "Jun 30, 2026", amount: "$12,480.00" },
                          { po: "PO-88145", status: "Closed", created: "May 18, 2026", amount: "$4,220.00" },
                        ].map((r) => (
                          <TableRow key={r.po} className="text-[11px]">
                            <TableCell className="font-medium py-1.5 px-2">{r.po}</TableCell>
                            <TableCell className="py-1.5 px-2"><Badge variant="secondary" className="h-4 text-[10px]">{r.status}</Badge></TableCell>
                            <TableCell className="py-1.5 px-2">{r.created}</TableCell>
                            <TableCell className="text-right tabular-nums py-1.5 px-2">{r.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* QUOTES */}
              <TabsContent value="quotes" className="mt-2">
                <Card>
                  <CardHeader className="p-2.5 pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xs font-semibold">Quotes</CardTitle>
                      <CardDescription className="text-[10px]">Recent quotes for this customer.</CardDescription>
                    </div>
                    <Button size="sm" className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-3 w-3 mr-1" />Create Quote
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="h-7">
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Quote #</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Status</TableHead>
                          <TableHead className="text-[10px] uppercase py-1.5 px-2">Date</TableHead>
                          <TableHead className="text-[10px] uppercase text-right py-1.5 px-2">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { q: "Q-4478", status: "Sent", date: "Jul 01, 2026", amount: "$2,180.00" },
                          { q: "Q-4451", status: "Accepted", date: "Jun 20, 2026", amount: "$6,940.00" },
                        ].map((r) => (
                          <TableRow key={r.q} className="text-[11px]">
                            <TableCell className="font-medium py-1.5 px-2">{r.q}</TableCell>
                            <TableCell className="py-1.5 px-2"><Badge variant="secondary" className="h-4 text-[10px]">{r.status}</Badge></TableCell>
                            <TableCell className="py-1.5 px-2">{r.date}</TableCell>
                            <TableCell className="text-right tabular-nums py-1.5 px-2">{r.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CONTRACT PRICING */}
              <TabsContent value="contract" className="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { title: "Pricing Rules", desc: "12 active rules across 4 categories.", icon: DollarSign },
                    { title: "Discounts", desc: "3 volume discounts configured.", icon: Tag },
                    { title: "Contract Documents", desc: "MSA-2024.pdf · Signed Jan 12, 2024", icon: FileText },
                  ].map((c, i) => (
                    <Card key={i}>
                      <CardContent className="p-2.5">
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <c.icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold">{c.title}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{c.desc}</div>
                            <Button variant="link" size="sm" className="h-5 px-0 text-[10px] mt-0.5">
                              Manage <ChevronRight className="h-3 w-3 ml-0.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* FILES */}
              <TabsContent value="files" className="mt-2">
                <Card>
                  <CardHeader className="p-2.5 pb-2">
                    <CardTitle className="text-xs font-semibold">Work Order External Files</CardTitle>
                    <CardDescription className="text-[10px]">Attachments uploaded by customers or staff.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-2.5 pt-0 space-y-2">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center bg-muted/20">
                      <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                      <div className="text-[11px] font-medium">Drag & drop files here</div>
                      <div className="text-[10px] text-muted-foreground">or click to browse (PDF, DOCX, XLSX, PNG, JPG)</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { name: "MSA-2024.pdf", by: "Jerome D.", date: "Jan 12, 2024" },
                        { name: "Cert-Report-5432.pdf", by: "M. Alvarez", date: "Jun 28, 2026" },
                      ].map((f, i) => (
                        <div key={i} className="flex items-center justify-between border border-border rounded-md p-2 bg-background">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-6 h-6 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                              <Paperclip className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-medium truncate">{f.name}</div>
                              <div className="text-[10px] text-muted-foreground">{f.by} · {f.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Eye className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fallback simple tabs */}
              {["retest", "print-tags", "fees", "custom"].map((v) => (
                <TabsContent key={v} value={v} className="mt-2">
                  <Card>
                    <CardContent className="p-6 text-center text-[11px] text-muted-foreground">
                      This section preserves legacy functionality. Content will render here.
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>

            {/* Right sidebar */}
            <aside className="space-y-3">





              <Card>
                <CardHeader className="p-2.5 pb-1.5 flex flex-row items-center justify-between">
                  <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <History className="h-3 w-3" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2.5 pt-0 space-y-2">
                  {[
                    { icon: FilePlus2, text: "Quote Q-4478 created", when: "2h ago" },
                    { icon: FileText, text: "WO 5432 updated", when: "Yesterday" },
                    { icon: DollarSign, text: "Contract pricing refreshed", when: "3d ago" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <div className="w-5 h-5 rounded bg-muted flex items-center justify-center shrink-0">
                        <a.icon className="h-2.5 w-2.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px]">{a.text}</div>
                        <div className="text-[10px] text-muted-foreground">{a.when}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-2.5 pb-1.5">
                  <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" /> Recent Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2.5 pt-0 space-y-1.5">
                  {[
                    { q: "Q-4478", amount: "$2,180.00", date: "Jul 01" },
                    { q: "Q-4451", amount: "$6,940.00", date: "Jun 20" },
                  ].map((r) => (
                    <div key={r.q} className="flex items-center justify-between text-[11px]">
                      <div className="font-medium">{r.q}</div>
                      <div className="text-muted-foreground tabular-nums">{r.amount}</div>
                      <div className="text-[10px] text-muted-foreground">{r.date}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-2.5 pb-1.5">
                  <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Recent Work Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2.5 pt-0 space-y-1.5">
                  {[
                    { wo: "5432", status: "In Progress" },
                    { wo: "5401", status: "Completed" },
                    { wo: "5389", status: "On Hold" },
                  ].map((r) => (
                    <div key={r.wo} className="flex items-center justify-between text-[11px]">
                      <div className="font-medium tabular-nums">#{r.wo}</div>
                      <Badge variant="secondary" className="h-4 text-[10px]">{r.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
