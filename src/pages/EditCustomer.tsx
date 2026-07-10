import { Fragment, useMemo, useState } from "react";
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
  ChevronLeft,
  Search,
  X,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";

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

/* --------------------------- Work Orders Section --------------------------- */

type WorkOrderRow = {
  wo: string;
  status: "In Process" | "Checked Out" | "Completed" | "Closed" | "On Hold";
  type: string;
  created: string;
  needBy: string;
  departure: string;
  shipped: string;
  poNumber: string;
  items: number;
};

const mockWorkOrders: WorkOrderRow[] = [
  { wo: "3219", status: "In Process", type: "Onsite Work Order", created: "01/14/2023", needBy: "02/14/2023", departure: "02/14/2023", shipped: "", poNumber: "TESTTESTTEST", items: 1 },
  { wo: "4668", status: "Checked Out", type: "Onsite Work Order", created: "04/29/2023", needBy: "06/29/2023", departure: "06/29/2023", shipped: "", poNumber: "ISLANDER-2", items: 1 },
  { wo: "4668", status: "Checked Out", type: "Onsite Work Order", created: "04/29/2023", needBy: "06/29/2023", departure: "06/29/2023", shipped: "", poNumber: "ISLANDER-2", items: 7 },
  { wo: "4707", status: "In Process", type: "Onsite Work Order", created: "05/03/2023", needBy: "07/03/2023", departure: "07/03/2023", shipped: "", poNumber: "ISLANDER-2", items: 2 },
  { wo: "4748", status: "In Process", type: "Onsite Work Order", created: "05/05/2023", needBy: "05/05/2023", departure: "05/05/2023", shipped: "", poNumber: "123", items: 1 },
  { wo: "4856", status: "In Process", type: "Onsite Work Order", created: "05/15/2023", needBy: "05/16/2023", departure: "05/16/2023", shipped: "", poNumber: "WOPO", items: 7 },
  { wo: "4931", status: "In Process", type: "Onsite Work Order", created: "05/22/2023", needBy: "05/22/2023", departure: "05/22/2023", shipped: "", poNumber: "WOPO", items: 6 },
  { wo: "4931", status: "In Process", type: "Onsite Work Order", created: "05/22/2023", needBy: "05/22/2023", departure: "05/22/2023", shipped: "", poNumber: "WOPO", items: 1 },
  { wo: "5022", status: "In Process", type: "Onsite Work Order", created: "05/30/2023", needBy: "06/05/2023", departure: "06/05/2023", shipped: "", poNumber: "W/PO", items: 7 },
  { wo: "5506", status: "In Process", type: "Onsite Work Order", created: "08/10/2023", needBy: "10/10/2023", departure: "10/10/2023", shipped: "", poNumber: "ISLANDER-2", items: 2 },
  { wo: "5510", status: "Completed", type: "Onsite Work Order", created: "09/12/2023", needBy: "10/12/2023", departure: "10/12/2023", shipped: "10/12/2023", poNumber: "CLOSED-1", items: 3 },
  { wo: "5520", status: "Closed", type: "Onsite Work Order", created: "09/15/2023", needBy: "09/20/2023", departure: "09/20/2023", shipped: "09/20/2023", poNumber: "CLOSED-2", items: 1 },
];


const isOpenStatus = (status: WorkOrderRow["status"]) =>
  status === "In Process" || status === "Checked Out" || status === "On Hold";

function WorkOrdersSection() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"open" | "closed" | "all">("open");

  const filtered = useMemo(() => {
    if (filter === "all") return mockWorkOrders;
    return mockWorkOrders.filter((r) =>
      filter === "open" ? isOpenStatus(r.status) : !isOpenStatus(r.status)
    );
  }, [filter]);

  const FilterButton = ({
    value,
    label,
  }: {
    value: "open" | "closed" | "all";
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full border ${
        filter === value
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-foreground border-border hover:bg-muted"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          filter === value ? "bg-white" : "bg-muted-foreground"
        }`}
      />
      {label}
    </button>
  );

  return (
    <Card>
      <CardHeader className="p-2.5 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-xs font-semibold">Work Orders</CardTitle>
          <CardDescription className="text-[10px]">Recent work orders for this customer.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <FilterButton value="open" label="Open Work Orders" />
          <FilterButton value="closed" label="Closed Work Orders" />
          <FilterButton value="all" label="All Work Orders" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-7 bg-muted/50">
                <TableHead className="text-[10px] uppercase py-1 px-1.5 w-10"></TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5">WO #</TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5">Status</TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5">Type</TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5">Created Date</TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5">Need By</TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5">Departure Date</TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5">Shipped</TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5">PONumber</TableHead>
                <TableHead className="text-[10px] uppercase py-1 px-1.5 text-right"># Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={`${r.wo}-${r.poNumber}-${r.items}`} className="text-[10px]">
                  <TableCell className="py-1 px-1.5">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-5 px-0 text-[10px] text-blue-600"
                      onClick={() =>
                        toast({ title: "Edit Work Order", description: `Opening work order ${r.wo}…` })
                      }
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium tabular-nums py-1 px-1.5">{r.wo}</TableCell>
                  <TableCell className="py-1 px-1.5 whitespace-nowrap">
                    <Badge variant="secondary" className="h-4 text-[9px]">{r.status}</Badge>
                  </TableCell>
                  <TableCell className="py-1 px-1.5 whitespace-nowrap">{r.type}</TableCell>
                  <TableCell className="tabular-nums py-1 px-1.5">{r.created}</TableCell>
                  <TableCell className="tabular-nums py-1 px-1.5">{r.needBy}</TableCell>
                  <TableCell className="tabular-nums py-1 px-1.5">{r.departure}</TableCell>
                  <TableCell className="tabular-nums py-1 px-1.5">{r.shipped || "—"}</TableCell>
                  <TableCell className="py-1 px-1.5">{r.poNumber}</TableCell>
                  <TableCell className="tabular-nums py-1 px-1.5 text-right">{r.items}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center gap-1 py-2 border-t border-border">

          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              type="button"
              className={`text-[11px] px-1.5 py-0.5 rounded ${
                n === 1 ? "text-blue-600 font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
          <span className="text-[11px] text-muted-foreground">…</span>
        </div>
      </CardContent>
    </Card>
  );
}




function PrintTagsPanel() {
  const [mode, setMode] = useState<"regular" | "rental">("regular");
  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-[12px] font-semibold flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" /> Print Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <RadioGroup value={mode} onValueChange={(v) => setMode(v as "regular" | "rental")} className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-[12px] font-medium text-foreground cursor-pointer group">
            <RadioGroupItem
              value="regular"
              id="pt-regular"
              className="h-4 w-4 border-slate-400 text-foreground data-[state=checked]:border-foreground data-[state=checked]:ring-1 data-[state=checked]:ring-foreground/20 transition-colors"
            /> Regular
          </label>
          <label className="flex items-center gap-2 text-[12px] font-medium text-foreground cursor-pointer group">
            <RadioGroupItem
              value="rental"
              id="pt-rental"
              className="h-4 w-4 border-slate-400 text-foreground data-[state=checked]:border-foreground data-[state=checked]:ring-1 data-[state=checked]:ring-foreground/20 transition-colors"
            /> Rental
          </label>
        </RadioGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-3xl">
          <Field label="Contact" required>
            <Select>
              <SelectTrigger className="h-7 text-[11px] px-2.5"><SelectValue placeholder="Select contact" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="jerome">Jerome Rodriguez</SelectItem>
                <SelectItem value="sarah">Sarah Chen</SelectItem>
                <SelectItem value="mike">Mike Thompson</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {mode === "regular" ? (
            <>
              <Field label="Action" required>
                <Select>
                  <SelectTrigger className="h-7 text-[11px] px-2.5"><SelectValue placeholder="Select action" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="retest">Retest</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspect">Inspect</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Arrival Type" required>
                <Select>
                  <SelectTrigger className="h-7 text-[11px] px-2.5"><SelectValue placeholder="Select arrival type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Pick Up</SelectItem>
                    <SelectItem value="dropoff">Drop Off</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Cal Freq">
                <Input className="h-7 text-[11px] px-2.5 py-1" placeholder="e.g. 6 months" />
              </Field>
              <Field label="Pick Up">
                <ModernDatePicker size="sm" value="2026-07-10" inputClassName="text-[11px] px-2.5" />

              </Field>
              <Field label="Need By">
                <ModernDatePicker size="sm" inputClassName="text-[11px] px-2.5" />
              </Field>
              <Field label="Priority" required>
                <Select>
                  <SelectTrigger className="h-7 text-[11px] px-2.5"><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="rush">Rush</SelectItem>
                    <SelectItem value="expedite">Expedite</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Comments" full>
                  <Textarea className="text-[11px] px-2.5 py-1.5 min-h-[60px]" placeholder="Optional notes for the tag print job…" />
                </Field>
              </div>
            </>
          ) : (
            <>
              <Field label="Phone" required>
                <Input className="h-7 text-[11px] px-2.5 py-1" />
              </Field>
              <Field label="Delivery Type" required>
                <Select>
                  <SelectTrigger className="h-7 text-[11px] px-2.5"><SelectValue placeholder="Select delivery type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Pick Up</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="JM Facility Location" required>
                <Select>
                  <SelectTrigger className="h-7 text-[11px] px-2.5"><SelectValue placeholder="Select facility" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baton-rouge">Baton Rouge, LA</SelectItem>
                    <SelectItem value="houston">Houston, TX</SelectItem>
                    <SelectItem value="lafayette">Lafayette, LA</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Location" required>
                <Input className="h-7 text-[11px] px-2.5 py-1" />
              </Field>
              <Field label="Date">
                <ModernDatePicker size="sm" value="2026-07-10" inputClassName="text-[11px] px-2.5" />
              </Field>
              <Field label="Quote #" required>
                <Input className="h-7 text-[11px] px-2.5 py-1" />
              </Field>
            </>
          )}

          <Field label="How Many" required>
            <Input type="number" min={1} defaultValue={1} className="h-7 text-[11px] px-2.5 py-1 w-24" />
          </Field>
        </div>

        <div className="flex justify-center pt-1">
          <Button size="sm" className="h-8 text-[11px] gap-1.5">
            <Tag className="h-3.5 w-3.5" /> Print Tags
          </Button>
        </div>
      </CardContent>
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
    <div className="flex flex-col min-h-screen bg-muted/20">
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

      <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4">
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
                  { v: "esl-inv", label: "ESL Surplus/Inventory", icon: Archive },
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
                <WorkOrdersSection />
              </TabsContent>


              {/* PURCHASE ORDERS */}
              <TabsContent value="po" className="mt-2">
                <PurchaseOrdersSection />
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
                <Card>
                  <CardHeader className="px-6 py-4 border-b border-border bg-muted/30 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" /> Contract Pricing
                    </CardTitle>
                    <span className="px-3 py-1 bg-primary/15 text-primary-foreground text-xs font-medium rounded-full border border-primary/20">
                      Active Contract
                    </span>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Top Panels Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Default Pricing Panel */}
                      <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-5 bg-primary rounded-full" />
                          <h3 className="text-sm font-medium text-foreground">Default Pricing</h3>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Rate Type</Label>
                          <RadioGroup defaultValue="pct" className="flex items-center gap-5">
                            <label htmlFor="def-hourly" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                              <RadioGroupItem value="hourly" id="def-hourly" className="h-4 w-4 border-muted-foreground/50 text-foreground data-[state=checked]:border-foreground data-[state=checked]:text-foreground" />
                              Hourly
                            </label>
                            <label htmlFor="def-pct" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                              <RadioGroupItem value="pct" id="def-pct" className="h-4 w-4 border-muted-foreground/50 text-foreground data-[state=checked]:border-foreground data-[state=checked]:text-foreground" />
                              Percentage
                            </label>
                          </RadioGroup>
                          <div className="relative">
                            <Input className="h-9 text-[12px] pl-3 pr-8" defaultValue="20.00" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground">%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Exp. Date</Label>
                            <ModernDatePicker size="md" value="2023-08-31" inputClassName="text-[12px] px-3" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Review Date</Label>
                            <ModernDatePicker size="md" value="2023-07-31" inputClassName="text-[12px] px-3" />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Labor Rate</Label>
                            <Input className="h-8 text-[12px] px-3 py-1" defaultValue="50.00" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">File</div>
                          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                            <span className="text-[12px] font-medium text-foreground truncate">Pricing_Sheet_v2.pdf</span>
                            <Button variant="link" size="sm" className="h-6 px-0 text-[11px] text-foreground hover:text-foreground/80">View/Open</Button>
                          </div>
                          <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition-colors cursor-pointer">
                            <div className="flex items-center gap-1.5 w-full">
                              <Input type="file" className="h-8 text-[11px] px-2 py-1 flex-1" />
                              <Button size="sm" variant="outline" className="h-8 text-[11px]">Upload</Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ESL Panel */}
                      <div className="space-y-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-5 bg-muted-foreground/40 rounded-full" />
                          <h3 className="text-sm font-medium text-foreground">ESL Configuration</h3>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">ESL Enabled</Label>
                          <RadioGroup defaultValue="yes" className="flex items-center gap-5">
                            <label htmlFor="esl-yes" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                              <RadioGroupItem value="yes" id="esl-yes" className="h-4 w-4 border-muted-foreground/50 text-foreground data-[state=checked]:border-foreground data-[state=checked]:text-foreground" />
                              Yes
                            </label>
                            <label htmlFor="esl-no" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                              <RadioGroupItem value="no" id="esl-no" className="h-4 w-4 border-muted-foreground/50 text-foreground data-[state=checked]:border-foreground data-[state=checked]:text-foreground" />
                              No
                            </label>
                          </RadioGroup>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Exp. Date</Label>
                            <ModernDatePicker size="md" inputClassName="text-[12px] px-3" />

                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Review Date</Label>
                            <ModernDatePicker size="md" inputClassName="text-[12px] px-3" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">File</div>
                          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                            <span className="text-[12px] font-medium text-foreground truncate">ESL_Contract_2023.pdf</span>
                            <Button variant="link" size="sm" className="h-6 px-0 text-[11px] text-foreground hover:text-foreground/80">View/Open</Button>
                          </div>
                          <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition-colors cursor-pointer min-h-[80px]">
                            <div className="flex items-center gap-1.5 w-full">
                              <Input type="file" className="h-8 text-[11px] px-2 py-1 flex-1" />
                              <Button size="sm" variant="outline" className="h-8 text-[11px]">Upload</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comments & Options */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Comment</Label>
                        <Textarea className="text-[12px] px-3 py-2 min-h-[80px] resize-none" placeholder="Add notes about this contract pricing agreement…" />
                      </div>
                      <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 text-[12px] font-medium cursor-pointer">
                          <Checkbox id="cp-national" /> National Contract
                        </label>
                        <label className="flex items-center gap-2 text-[12px] font-medium cursor-pointer">
                          <Checkbox id="cp-noauto" /> Do Not Auto Price
                        </label>
                      </div>
                    </div>

                    <div className="text-[12px] text-destructive text-center">
                      Reminder: You must use 'Set Contract Pricing' to save any of the data above. Save at bottom of page DOES NOT save this data.
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      <Button size="sm" variant="outline" className="h-9 text-[12px]">Cancel</Button>
                      <Button size="sm" variant="outline" className="h-9 text-[12px]">Add Comment Only</Button>
                      <Button size="sm" className="h-9 text-[12px] bg-foreground text-background hover:bg-foreground/90">Set Contract Pricing</Button>
                    </div>

                    {/* History Table */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Revision History</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="text-[11px] h-9">Entered</TableHead>
                              <TableHead className="text-[11px] h-9">User</TableHead>
                              <TableHead className="text-[11px] h-9 min-w-[320px]">Comment</TableHead>
                              <TableHead className="text-[11px] h-9 w-16"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="text-[11px] align-top whitespace-nowrap">08/03/2023 12:10 PM</TableCell>
                              <TableCell className="text-[11px] align-top whitespace-nowrap">Timothy J Oldendorf</TableCell>
                              <TableCell className="text-[11px] align-top">
                                <div>Contract Pricing set to Pct: 20.00</div>
                                <div>Exp Date set to 8/31/2023</div>
                                <div>Rev Date set to 7/31/2023</div>
                                <div>Labor Rate set to 50.00</div>
                                <div>HELLO</div>
                              </TableCell>
                              <TableCell className="text-[11px] align-top">
                                <Button variant="link" size="sm" className="h-5 px-0 text-[11px] text-destructive">Delete</Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </TabsContent>

              {/* ESL SURPLUS / INVENTORY */}
              <TabsContent value="esl-inv" className="mt-2">
                <EslSurplusInventorySection />
              </TabsContent>

              {/* FILES */}
              <TabsContent value="files" className="mt-2">
                <WoExtFilesSection />
              </TabsContent>

              {/* Retest Notices */}
              <TabsContent value="retest" className="mt-2">
                <Card>
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-[12px] font-semibold flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5" /> Retest Notices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl">
                      {[
                        { id: "no-retest", label: "No Retest Notice" },
                        { id: "email-to", label: "Email To" },
                        { id: "email-contact-wo", label: "Email Contact on WO", defaultChecked: true },
                        { id: "mail", label: "Mail" },
                      ].map((o) => (
                        <label key={o.id} htmlFor={o.id} className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 cursor-pointer hover:bg-muted/40">
                          <Checkbox id={o.id} defaultChecked={o.defaultChecked} />
                          <span className="text-[11px] font-medium">{o.label}</span>
                        </label>
                      ))}
                    </div>
                    <Field label="Comments" full>
                      <Textarea
                        className="text-[11px] px-2.5 py-1.5 min-h-[80px]"
                        placeholder="Notes for retest notification handling…"
                        defaultValue="ppe rotation management program / do not contact for gloves kng 1/5/24"
                      />
                    </Field>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Print Tags */}
              <TabsContent value="print-tags" className="mt-2">
                <PrintTagsPanel />
              </TabsContent>


              <TabsContent value="fees" className="mt-2">
                <FeeScheduleSection />
              </TabsContent>

              <TabsContent value="custom" className="mt-2">
                <CustomFieldsSection />
              </TabsContent>
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

      {/* Sticky footer actions */}
      <footer className="sticky bottom-0 z-30 bg-white border-t border-border px-3 sm:px-4 lg:px-6 py-3 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-end gap-3">
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
            className="h-9 px-4 text-xs bg-foreground text-background hover:bg-foreground/90"
            onClick={handleSave}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </footer>

    </div>
  );
}

// ============ Fee Schedule Section ============
type FeeRow = {
  groupable: string;
  type?: string;
  lab: string;
  onsite: string;
  mgmtNew: string;
  mgmtExisting: string;
  rotMgmt: boolean;
};

const INITIAL_FEE_ROWS: FeeRow[] = [
  { groupable: "Blankets", lab: "23.75", onsite: "10.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: true },
  { groupable: "CoverUps", lab: "22.50", onsite: "11.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Footwear", lab: "22.00", onsite: "12.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Gloves", lab: "17.25", onsite: "13.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: true },
  { groupable: "Grounds", type: "Single", lab: "27.25", onsite: "14.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Grounds", type: "Cluster", lab: "54.25", onsite: "15.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Hotsticks", type: "Telescopic", lab: "16.75", onsite: "16.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Hotsticks", type: "Shotgun", lab: "62.50", onsite: "17.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Hotsticks", type: "Straight", lab: "52.00", onsite: "18.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Hotsticks", type: "Static Discharge", lab: "62.50", onsite: "19.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Insulated Tools", lab: "10.25", onsite: "20.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Jumpers", lab: "27.25", onsite: "21.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Line Hoses", lab: "22.50", onsite: "22.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Matting", lab: "9.75", onsite: "23.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Roll Blankets", lab: "9.75", onsite: "24.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Sleeves", lab: "23.75", onsite: "25.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: true },
  { groupable: "Arc Flash", lab: "0.00", onsite: "26.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
  { groupable: "Bucket Truck", lab: "0.00", onsite: "27.00", mgmtNew: "0.00", mgmtExisting: "0.00", rotMgmt: false },
];

// Tier presets for ESL Lab column
const TIER_PRESETS: Record<string, Record<string, string>> = {
  "Tier 1": { Blankets: "20.00", CoverUps: "19.00", Footwear: "18.50", Gloves: "14.50", Grounds: "22.00", Hotsticks: "14.00", "Insulated Tools": "8.50", Jumpers: "23.00", "Line Hoses": "19.00", Matting: "8.25", "Roll Blankets": "8.25", Sleeves: "20.00", "Arc Flash": "0.00", "Bucket Truck": "0.00" },
  "Tier 2": { Blankets: "23.75", CoverUps: "22.50", Footwear: "22.00", Gloves: "17.25", Grounds: "27.25", Hotsticks: "16.75", "Insulated Tools": "10.25", Jumpers: "27.25", "Line Hoses": "22.50", Matting: "9.75", "Roll Blankets": "9.75", Sleeves: "23.75", "Arc Flash": "0.00", "Bucket Truck": "0.00" },
  "Tier 3": { Blankets: "27.50", CoverUps: "26.00", Footwear: "25.50", Gloves: "20.00", Grounds: "31.50", Hotsticks: "19.50", "Insulated Tools": "12.00", Jumpers: "31.50", "Line Hoses": "26.00", Matting: "11.25", "Roll Blankets": "11.25", Sleeves: "27.50", "Arc Flash": "0.00", "Bucket Truck": "0.00" },
  "Tier 4": { Blankets: "31.00", CoverUps: "29.50", Footwear: "29.00", Gloves: "22.75", Grounds: "35.75", Hotsticks: "22.00", "Insulated Tools": "13.75", Jumpers: "35.75", "Line Hoses": "29.50", Matting: "12.75", "Roll Blankets": "12.75", Sleeves: "31.00", "Arc Flash": "0.00", "Bucket Truck": "0.00" },
};

function FeeScheduleSection() {
  const { toast } = useToast();
  const [rows, setRows] = useState<FeeRow[]>(INITIAL_FEE_ROWS);
  const [currentEffective] = useState("07/07/2026");
  const [newEffective, setNewEffective] = useState("07/10/2026");
  const [pendingTier, setPendingTier] = useState<string | null>(null);

  const update = (i: number, patch: Partial<FeeRow>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const applyTier = (tier: string) => {
    const preset = TIER_PRESETS[tier];
    setRows((r) => r.map((row) => (preset[row.groupable] != null ? { ...row, lab: preset[row.groupable] } : row)));
    toast({ title: `${tier} applied`, description: "ESL Lab prices updated." });
    setPendingTier(null);
  };

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-[13px] font-semibold">Fee Schedule</CardTitle>
        <CardDescription className="text-[11px]">
          Set ESL Lab, ESL Onsite, and Management fees per groupable. Rotational Management toggles per item.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-[11px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="[&>th]:px-2 [&>th]:py-1.5 [&>th]:font-medium [&>th]:text-left">
                <th className="w-[16%]">Groupable</th>
                <th className="w-[18%]">Type</th>
                <th className="w-[13%] text-right">ESL Lab</th>
                <th className="w-[13%] text-right">ESL Onsite</th>
                <th className="w-[13%] text-right">Mgmt Fee New</th>
                <th className="w-[13%] text-right">Mgmt Fee Existing</th>
                <th className="w-[10%] text-center">Rot Mgmt</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const mgmtEnabled = row.rotMgmt;
                return (
                  <tr key={i} className="border-t border-border/60 even:bg-muted/20 [&>td]:px-2 [&>td]:py-1">
                    <td className="font-medium">{row.groupable}</td>
                    <td className="text-muted-foreground">{row.type ?? ""}</td>
                    <td>
                      <Input
                        value={row.lab}
                        onChange={(e) => update(i, { lab: e.target.value })}
                        className="h-7 text-[11px] text-right tabular-nums"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.onsite}
                        onChange={(e) => update(i, { onsite: e.target.value })}
                        className="h-7 text-[11px] text-right tabular-nums"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.mgmtNew}
                        onChange={(e) => update(i, { mgmtNew: e.target.value })}
                        disabled={!mgmtEnabled}
                        className="h-7 text-[11px] text-right tabular-nums disabled:opacity-50"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.mgmtExisting}
                        onChange={(e) => update(i, { mgmtExisting: e.target.value })}
                        disabled={!mgmtEnabled}
                        className="h-7 text-[11px] text-right tabular-nums disabled:opacity-50"
                      />
                    </td>
                    <td className="text-center">
                      <Checkbox
                        checked={row.rotMgmt}
                        onCheckedChange={(v) => update(i, { rotMgmt: !!v })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Effective dates */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold">Current Effective Date</Label>
            <Input value={currentEffective} disabled className="h-8 text-[11px]" />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold">New Effective Date</Label>
            <ModernDatePicker
              size="md"
              value={newEffective}
              onChange={(d) => {
                if (d) {
                  const mm = String(d.getMonth() + 1).padStart(2, "0");
                  const dd = String(d.getDate()).padStart(2, "0");
                  setNewEffective(`${mm}/${dd}/${d.getFullYear()}`);
                }
              }}
              inputClassName="text-[11px]"
            />
          </div>
        </div>

        {/* Tier + actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold">Set ESL Lab Tier</span>
            {["Tier 1", "Tier 2", "Tier 3", "Tier 4"].map((t) => (
              <Button
                key={t}
                variant="outline"
                size="sm"
                className="h-7 px-3 text-[11px]"
                onClick={() => setPendingTier(t)}
              >
                {t}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-[11px]">
              Copy fees to other accounts
            </Button>
            <Button
              size="sm"
              className="h-8 px-3 text-[11px] bg-foreground text-background hover:bg-foreground/90"
              onClick={() => toast({ title: "Fees saved", description: `Effective ${newEffective}` })}
            >
              Save Fees
            </Button>
          </div>
        </div>

        <AlertDialog open={!!pendingTier} onOpenChange={(o) => !o && setPendingTier(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apply {pendingTier}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will set all ESL Lab prices to {pendingTier}, are you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => pendingTier && applyTier(pendingTier)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

// ============ Custom Fields Section ============
function CustomFieldsSection() {
  const { toast } = useToast();
  const [fields, setFields] = useState({
    f1: { label: "", value: "" },
    f2: { label: "", value: "" },
    f3: { label: "", value: "" },
    f4: { label: "", value: "" },
    f5: { label: "", value: "" },
    f6: { label: "", value: "" },
  });

  const textRows = [
    { key: "f1" as const, name: "Field 1", hint: "alphanumeric, 100 characters" },
    { key: "f2" as const, name: "Field 2", hint: "alphanumeric, 100 characters" },
    { key: "f3" as const, name: "Field 3", hint: "alphanumeric, 100 characters" },
    { key: "f4" as const, name: "Field 4", hint: "alphanumeric, 100 characters" },
    { key: "f5" as const, name: "Field 5", hint: "alphanumeric, 100 characters" },
  ];

  const update = (key: keyof typeof fields, patch: Partial<{ label: string; value: string }>) =>
    setFields((f) => ({ ...f, [key]: { ...f[key], ...patch } }));

  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-[13px] font-semibold">Custom Fields</CardTitle>
        <CardDescription className="text-[11px]">
          Define labels and values for account-specific custom fields.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="grid grid-cols-[220px_1fr_1.5fr] gap-x-3 gap-y-2 items-center max-w-3xl">
          <div />
          <Label className="text-[11px] font-semibold text-muted-foreground">Label</Label>
          <Label className="text-[11px] font-semibold text-muted-foreground">Value</Label>

          {textRows.map((r) => (
            <Fragment key={r.key}>
              <div className="text-[11px]">
                <div className="font-medium">{r.name}</div>
                <div className="text-[10px] text-muted-foreground">{r.hint}</div>
              </div>
              <Input
                value={fields[r.key].label}
                onChange={(e) => update(r.key, { label: e.target.value.slice(0, 50) })}
                maxLength={50}
                placeholder="Label"
                className="h-8 text-[11px]"
              />
              <Input
                value={fields[r.key].value}
                onChange={(e) => update(r.key, { value: e.target.value.slice(0, 100) })}
                maxLength={100}
                placeholder="Value"
                className="h-8 text-[11px]"
              />
            </Fragment>
          ))}

          <div className="text-[11px]">
            <div className="font-medium">Field 6</div>
            <div className="text-[10px] text-muted-foreground">date/time</div>
          </div>
          <Input
            value={fields.f6.label}
            onChange={(e) => update("f6", { label: e.target.value.slice(0, 50) })}
            maxLength={50}
            placeholder="Label"
            className="h-8 text-[11px]"
          />
          <Input
            type="datetime-local"
            value={fields.f6.value}
            onChange={(e) => update("f6", { value: e.target.value })}
            className="h-8 text-[11px]"
          />
        </div>

        <div className="mt-4 flex justify-end border-t border-border pt-3">
          <Button
            size="sm"
            className="h-8 px-3 text-[11px] bg-foreground text-background hover:bg-foreground/90"
            onClick={() => toast({ title: "Custom fields saved" })}
          >
            Save Custom Fields
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ Purchase Orders Section ============
type PORow = {
  id: string;
  po: string;
  status: "Active" | "Inactive";
  user: string;
  date: string;
  file: string;
};

type LinkedWO = {
  id: string;
  customer: string;
  first: string;
  last: string;
  createdDate: string;
  createdBy: string;
  status: "Awaiting Approval" | "Approved" | "Created" | "Rejected";
  followup: string;
};

const PO_ROWS: PORow[] = [
  { id: "1", po: "123", status: "Inactive", user: "Bryan J Waites", date: "01/09/2025", file: "POD for Tic Magnolia.pdf" },
  { id: "2", po: "123", status: "Inactive", user: "Timothy J Oldendorf", date: "03/18/2024", file: "ACK Receipt of Company Property - John Hetherwick.pdf" },
  { id: "3", po: "1234", status: "Inactive", user: "Bryan J Waites", date: "01/09/2025", file: "POD for Tic Magnolia.pdf" },
  { id: "4", po: "1234", status: "Inactive", user: "Bryan J Waites", date: "06/18/2024", file: "S853827.pdf" },
  { id: "5", po: "123456", status: "Inactive", user: "Timothy J Oldendorf", date: "06/26/2024", file: "ExchangeOnline_Placemat_final.pdf" },
  { id: "6", po: "88210", status: "Active", user: "Dawn J Stewart", date: "07/01/2026", file: "PO-88210-signed.pdf" },
  { id: "7", po: "88145", status: "Active", user: "Kalyn M Green", date: "05/18/2026", file: "PO-88145.pdf" },
];

const LINKED_WOS: LinkedWO[] = [
  { id: "378", customer: "Newtron LLC", first: "Kevin", last: "Wood", createdDate: "03/04/2022", createdBy: "Dawn J Stewart", status: "Awaiting Approval", followup: "03/07/2022" },
  { id: "4364", customer: "Newtron LLC", first: "Nigel", last: "Thomas", createdDate: "10/28/2022", createdBy: "Kalyn M Green", status: "Approved", followup: "11/01/2022" },
  { id: "9530", customer: "Newtron LLC", first: "Alton", last: "Lindsey", createdDate: "11/10/2023", createdBy: "Bryan J Waites", status: "Approved", followup: "11/13/2023" },
  { id: "9538", customer: "Newtron LLC", first: "Jonathan", last: "Atkinson", createdDate: "04/26/2024", createdBy: "Bryan J Waites", status: "Approved", followup: "04/29/2024" },
  { id: "9542", customer: "Newtron LLC", first: "Evan", last: "Wheeler", createdDate: "12/12/2024", createdBy: "Kim-Viet Le", status: "Created", followup: "12/16/2024" },
];

const PO_STATUS_STYLES: Record<PORow["status"], string> = {
  Active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Inactive: "bg-muted text-muted-foreground",
};

const WO_STATUS_STYLES: Record<LinkedWO["status"], string> = {
  "Awaiting Approval": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Created: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Rejected: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

function PurchaseOrdersSection() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<"Active" | "Inactive" | "All">("Active");
  const [poNumber, setPoNumber] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Table filters
  const [fPo, setFPo] = useState("");
  const [fStatus, setFStatus] = useState<string>("all");
  const [fUser, setFUser] = useState("");
  const [fDate, setFDate] = useState("");
  const [fFile, setFFile] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredPOs = useMemo(
    () =>
      PO_ROWS.filter((r) => {
        if (statusFilter !== "All" && r.status !== statusFilter) return false;
        if (poNumber && !r.po.includes(poNumber)) return false;
        if (fPo && !r.po.toLowerCase().includes(fPo.toLowerCase())) return false;
        if (fStatus !== "all" && r.status !== fStatus) return false;
        if (fUser && !r.user.toLowerCase().includes(fUser.toLowerCase())) return false;
        if (fDate && !r.date.includes(fDate)) return false;
        if (fFile && !r.file.toLowerCase().includes(fFile.toLowerCase())) return false;
        return true;
      }),
    [statusFilter, poNumber, fPo, fStatus, fUser, fDate, fFile],
  );

  const totalPages = Math.max(1, Math.ceil(filteredPOs.length / pageSize));
  const pagedPOs = filteredPOs.slice((page - 1) * pageSize, page * pageSize);
  const [selectedPO, setSelectedPO] = useState<string | null>(null);

  const handleSave = () => {
    if (!poNumber.trim()) {
      toast({ title: "PO # required", description: "Enter a PO number before saving.", variant: "destructive" });
      return;
    }
    toast({ title: "Purchase order saved", description: `PO ${poNumber} added${uploadFile ? ` with ${uploadFile.name}` : ""}.` });
    setPoNumber("");
    setUploadFile(null);
  };

  const handleCancel = () => {
    setPoNumber("");
    setUploadFile(null);
    setStatusFilter("Active");
  };

  return (
    <div className="space-y-3">
      {/* Add / filter bar */}
      <Card>
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-[13px] font-semibold flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Purchase Orders
          </CardTitle>
          <CardDescription className="text-[11px]">
            Add, filter, and attach purchase orders for this customer.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-[160px_180px_1fr_auto] gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Status</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="h-8 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="All">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">PO #</Label>
              <Input
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value.slice(0, 50))}
                maxLength={50}
                placeholder="Enter PO number"
                className="h-8 text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Upload File</Label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center gap-2 h-8 px-2 rounded-md border border-dashed border-border bg-muted/30 text-[11px] text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
                  <Paperclip className="h-3 w-3 shrink-0" />
                  <span className="truncate">{uploadFile ? uploadFile.name : "Choose a file to attach"}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                {uploadFile && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setUploadFile(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-3 text-[11px]" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 text-[11px] bg-foreground text-background hover:bg-foreground/90"
                onClick={handleSave}
              >
                <Save className="h-3 w-3 mr-1" /> Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PO table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="[&>th]:px-2 [&>th]:py-1.5 [&>th]:font-medium [&>th]:text-left">
                  <th className="w-[16%]">PO #</th>
                  <th className="w-[12%]">Status</th>
                  <th className="w-[20%]">User</th>
                  <th className="w-[14%]">Date</th>
                  <th>PO File</th>
                </tr>
                <tr className="[&>th]:px-2 [&>th]:pb-1.5 border-b border-border">
                  <th>
                    <div className="relative">
                      <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input value={fPo} onChange={(e) => setFPo(e.target.value)} className="h-6 pl-5 text-[11px]" placeholder="Filter" />
                    </div>
                  </th>
                  <th>
                    <Select value={fStatus} onValueChange={setFStatus}>
                      <SelectTrigger className="h-6 text-[11px]"><SelectValue placeholder="All" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </th>
                  <th>
                    <Input value={fUser} onChange={(e) => setFUser(e.target.value)} className="h-6 text-[11px]" placeholder="Filter" />
                  </th>
                  <th>
                    <Input value={fDate} onChange={(e) => setFDate(e.target.value)} className="h-6 text-[11px]" placeholder="MM/DD/YYYY" />
                  </th>
                  <th>
                    <Input value={fFile} onChange={(e) => setFFile(e.target.value)} className="h-6 text-[11px]" placeholder="Filter" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedPOs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-[11px] text-muted-foreground">
                      No purchase orders match the current filters.
                    </td>
                  </tr>
                )}
                {pagedPOs.map((r) => {
                  const active = selectedPO === r.id;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedPO(r.id)}
                      className={`border-t border-border/60 cursor-pointer transition-colors [&>td]:px-2 [&>td]:py-1.5 ${
                        active ? "bg-primary/5" : "even:bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <td className="font-medium tabular-nums">{r.po}</td>
                      <td><StatusPill label={r.status} className={PO_STATUS_STYLES[r.status]} /></td>
                      <td>{r.user}</td>
                      <td className="tabular-nums">{r.date}</td>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="truncate max-w-[280px]">{r.file}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-border text-[11px]">
            <div className="text-muted-foreground">
              Page {page} of {totalPages} ({filteredPOs.length} items)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  className={`h-6 w-6 p-0 text-[11px] ${page === i + 1 ? "bg-foreground text-background hover:bg-foreground/90" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked work orders */}
      <Card>
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-[12px] font-semibold flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Linked Work Orders
            {selectedPO && (
              <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                for PO {PO_ROWS.find((p) => p.id === selectedPO)?.po}
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-[11px]">
            Work orders associated with the selected purchase order.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="[&>th]:px-2 [&>th]:py-1.5 [&>th]:font-medium [&>th]:text-left">
                  <th className="w-[8%]">ID</th>
                  <th className="w-[16%]">Customer</th>
                  <th className="w-[14%]">Contact First</th>
                  <th className="w-[14%]">Contact Last</th>
                  <th className="w-[12%]">Created Date</th>
                  <th className="w-[16%]">Created By</th>
                  <th className="w-[12%]">PO/CO Status</th>
                  <th className="w-[10%]">Followup</th>
                </tr>
              </thead>
              <tbody>
                {LINKED_WOS.map((w) => (
                  <tr key={w.id} className="border-t border-border/60 even:bg-muted/20 hover:bg-muted/40 [&>td]:px-2 [&>td]:py-1.5">
                    <td>
                      <Link to="/edit-order" className="text-primary hover:underline font-medium tabular-nums">
                        {w.id}
                      </Link>
                    </td>
                    <td>{w.customer}</td>
                    <td>{w.first}</td>
                    <td>{w.last}</td>
                    <td className="tabular-nums">{w.createdDate}</td>
                    <td>{w.createdBy}</td>
                    <td><StatusPill label={w.status} className={WO_STATUS_STYLES[w.status]} /></td>
                    <td className="tabular-nums">{w.followup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t border-border text-[11px] text-muted-foreground">
            <div>Page 1 of 1 ({LINKED_WOS.length} items)</div>
            <div>Page size: 5</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ ESL Surplus / Inventory Section ============
type EslComment = { id: string; text: string; author: string; when: string };

function EslSurplusInventorySection() {
  const { toast } = useToast();
  const [allowAny, setAllowAny] = useState(false);
  const [surplus, setSurplus] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [dateAuthorized, setDateAuthorized] = useState("");
  const [whoAuthorized, setWhoAuthorized] = useState("");
  const [authorizedFile, setAuthorizedFile] = useState<{ name: string } | null>({
    name: "Authorization_Letter_2025.pdf",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<EslComment[]>([
    { id: "c1", text: "Approved for ESL Lab surplus swap on tier 2 items.", author: "Dawn J Stewart", when: "Jul 02, 2026" },
  ]);

  const handleSave = () => {
    if ((surplus || inventory || allowAny) && !whoAuthorized.trim()) {
      toast({ title: "Missing authorizer", description: "Enter who authorized this change.", variant: "destructive" });
      return;
    }
    if (uploadFile) setAuthorizedFile({ name: uploadFile.name });
    toast({ title: "Authorization saved" });
    setUploadFile(null);
  };

  const handleCancel = () => {
    setAllowAny(false);
    setSurplus(false);
    setInventory(false);
    setDateAuthorized("");
    setWhoAuthorized("");
    setUploadFile(null);
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments((c) => [
      { id: `c${Date.now()}`, text: comment.trim(), author: "You", when: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) },
      ...c,
    ]);
    setComment("");
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-[13px] font-semibold flex items-center gap-1.5">
            <Archive className="h-3.5 w-3.5" /> ESL Surplus / Inventory Authorization
          </CardTitle>
          <CardDescription className="text-[11px]">
            Configure surplus and inventory access permissions and attach the authorization document.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-4">
          {/* Permission toggles */}
          <div className="rounded-md border border-border bg-muted/20 p-3 space-y-2">
            <label className="flex items-center gap-2 text-[11px] cursor-pointer">
              <Checkbox checked={allowAny} onCheckedChange={(v) => setAllowAny(!!v)} />
              <span className="font-medium">Allow any replacement</span>
              <span className="text-muted-foreground">— permit substitution with any equivalent item.</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 text-[11px] cursor-pointer">
                <Checkbox checked={surplus} onCheckedChange={(v) => setSurplus(!!v)} />
                <span className="font-medium">Surplus</span>
              </label>
              <label className="flex items-center gap-2 text-[11px] cursor-pointer">
                <Checkbox checked={inventory} onCheckedChange={(v) => setInventory(!!v)} />
                <span className="font-medium">Inventory</span>
              </label>
            </div>
          </div>

          {/* Authorization details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Date Authorized</Label>
              <ModernDatePicker
                size="md"
                value={dateAuthorized}
                onChange={(d) => setDateAuthorized(d ? d.toISOString().slice(0, 10) : "")}
                inputClassName="text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Who Authorized</Label>
              <Input
                value={whoAuthorized}
                onChange={(e) => setWhoAuthorized(e.target.value.slice(0, 100))}
                maxLength={100}
                placeholder="Name of authorizer"
                className="h-8 text-[11px]"
              />
            </div>
          </div>

          {/* Authorized file (already uploaded) */}
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold">Authorized File</Label>
            {authorizedFile ? (
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2">
                <div className="flex items-center gap-2 text-[11px] min-w-0">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium truncate">{authorizedFile.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-primary">
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAuthorizedFile(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-muted-foreground italic">No authorization file on record.</div>
            )}
          </div>

          {/* Upload file */}
          <div className="space-y-1">
            <Label className="text-[11px] font-semibold">Upload File</Label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 h-8 px-2 rounded-md border border-dashed border-border bg-muted/30 text-[11px] text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
                <Paperclip className="h-3 w-3 shrink-0" />
                <span className="truncate">{uploadFile ? uploadFile.name : "Choose a file to attach"}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {uploadFile && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setUploadFile(null)}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <Button variant="outline" size="sm" className="h-8 px-3 text-[11px]" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 px-3 text-[11px] bg-foreground text-background hover:bg-foreground/90"
              onClick={handleSave}
            >
              <Save className="h-3 w-3 mr-1" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-[12px] font-semibold flex items-center gap-1.5">
            <StickyNote className="h-3.5 w-3.5" /> Comments
          </CardTitle>
          <CardDescription className="text-[11px]">
            Notes and history related to this authorization.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              maxLength={500}
              placeholder="Add a comment…"
              className="h-8 text-[11px]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addComment();
                }
              }}
            />
            <Button
              size="sm"
              className="h-8 px-3 text-[11px] bg-foreground text-background hover:bg-foreground/90"
              onClick={addComment}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Comment
            </Button>
          </div>

          <div className="space-y-2">
            {comments.length === 0 && (
              <div className="text-[11px] text-muted-foreground italic">No comments yet.</div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="rounded-md border border-border bg-muted/20 p-2.5">
                <div className="text-[11px]">{c.text}</div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="font-medium">{c.author}</span>
                  <span>•</span>
                  <span>{c.when}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ WO External Files Section ============
type WoFile = {
  item: string;
  file: string;
  type: string;
  tags: string[];
  items: string;
  by: string;
  date: string;
};

const DOC_TYPES = [
  "METCAL",
  "Metrology.net",
  "External File (xlsx)",
  "External File (pdf)",
  "External Test Report",
  "External Datasheet (xlsx)",
  "Other",
];

const DOC_TAGS = [
  "Customer Approval",
  "Customer ID List",
  "Customer Notes",
  "Emails",
  "Equipment Submission Form",
  "Internal Notes",
  "Photos",
  "Shipping",
];

const WO_FILES: WoFile[] = [
  { item: "211673-020", file: "Project-Management-Sample-Data.xlsx", type: "External Datasheet (xlsx)", tags: [], items: "", by: "Admin User", date: "04/10/2026" },
  { item: "360073-003", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "02/01/2021" },
  { item: "360073-004", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "02/01/2021" },
  { item: "361723-003", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "02/23/2021" },
  { item: "361763-001", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "02/19/2021" },
  { item: "363720-001", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Mark S. Vetter", date: "03/09/2021" },
  { item: "381916-001", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "09/08/2021" },
  { item: "381916-002", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Mark S. Vetter", date: "09/08/2021" },
  { item: "381916-003", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Mark S. Vetter", date: "09/08/2021" },
  { item: "381916-004", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "09/08/2021" },
  { item: "381916-005", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "09/08/2021" },
  { item: "393606-003", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "01/13/2022" },
  { item: "393606-004", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "01/13/2022" },
  { item: "393606-008", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "01/13/2022" },
  { item: "393606-009", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "01/13/2022" },
  { item: "393606-010", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "01/13/2022" },
  { item: "401030-001", file: "Non-accredited Calibration.pdf", type: "METCAL", tags: [], items: "", by: "Mark S. Vetter", date: "03/21/2022" },
  { item: "401030-002", file: "Non-accredited Calibration.pdf", type: "METCAL", tags: [], items: "", by: "Mark S. Vetter", date: "03/21/2022" },
  { item: "415788-001", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "08/02/2022" },
  { item: "415788-002", file: "JM Data Sheet 2018.pdf", type: "METCAL", tags: [], items: "", by: "Larry D. Achee", date: "08/02/2022" },
];

function WoExtFilesSection() {
  const { toast } = useToast();
  const [docType, setDocType] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [staged, setStaged] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // filters
  const [fItem, setFItem] = useState("");
  const [fFile, setFFile] = useState("");
  const [fType, setFType] = useState("all");
  const [fTag, setFTag] = useState("");
  const [fItems, setFItems] = useState("");
  const [fBy, setFBy] = useState("");
  const [fDate, setFDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const toggleTag = (t: string) =>
    setSelectedTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) setStaged((s) => [...s, ...files]);
  };

  const removeStaged = (idx: number) => setStaged((s) => s.filter((_, i) => i !== idx));

  const handleUpload = () => {
    if (!staged.length) {
      toast({ title: "No files selected", variant: "destructive" });
      return;
    }
    if (!docType) {
      toast({ title: "Select a Doc Type", variant: "destructive" });
      return;
    }
    toast({ title: `${staged.length} file(s) uploaded`, description: `Type: ${docType}` });
    setStaged([]);
    setSelectedTags([]);
    setDocType("");
  };

  const rows = useMemo(
    () =>
      WO_FILES.filter((r) => {
        if (fItem && !r.item.toLowerCase().includes(fItem.toLowerCase())) return false;
        if (fFile && !r.file.toLowerCase().includes(fFile.toLowerCase())) return false;
        if (fType !== "all" && r.type !== fType) return false;
        if (fTag && !r.tags.some((t) => t.toLowerCase().includes(fTag.toLowerCase()))) return false;
        if (fItems && !r.items.toLowerCase().includes(fItems.toLowerCase())) return false;
        if (fBy && !r.by.toLowerCase().includes(fBy.toLowerCase())) return false;
        if (fDate && !r.date.includes(fDate)) return false;
        return true;
      }),
    [fItem, fFile, fType, fTag, fItems, fBy, fDate],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-3">
      {/* Upload panel */}
      <Card>
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-[13px] font-semibold flex items-center gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" /> Work Order External Files
          </CardTitle>
          <CardDescription className="text-[11px]">
            METCAL, Metrology.net, External File (xlsx) and External File (pdf) are used to create a Datasheet.
            External Test Report is used by Customer Portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-3">
            {/* Doc Type */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Doc Type</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="h-8 text-[11px]"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doc Tags */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Doc Tag(s)</Label>
              <div className="rounded-md border border-border bg-muted/20 p-2 max-h-[120px] overflow-y-auto grid grid-cols-2 gap-x-3 gap-y-1">
                {DOC_TAGS.map((t) => (
                  <label key={t} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                    <Checkbox
                      checked={selectedTags.includes(t)}
                      onCheckedChange={() => toggleTag(t)}
                    />
                    <span className="truncate">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dropzone */}
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Select file(s)</Label>
              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center h-[92px] rounded-md border-2 border-dashed cursor-pointer transition-colors ${
                  dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-primary/40"
                }`}
              >
                <Upload className="h-4 w-4 text-muted-foreground mb-1" />
                <div className="text-[11px] font-medium">Drag file(s) here</div>
                <div className="text-[10px] text-muted-foreground">or click to browse</div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && setStaged((s) => [...s, ...Array.from(e.target.files!)])}
                />
              </label>
            </div>
          </div>

          {/* Staged files */}
          {staged.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="text-[11px] font-semibold text-muted-foreground">Ready to upload ({staged.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {staged.map((f, i) => (
                  <div key={i} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 pl-2 pr-1 py-1 text-[11px]">
                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                    <span className="max-w-[220px] truncate">{f.name}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeStaged(i)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="h-8 px-3 text-[11px] bg-foreground text-background hover:bg-foreground/90"
                  onClick={handleUpload}
                >
                  <Upload className="h-3 w-3 mr-1" /> Upload
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="[&>th]:px-2 [&>th]:py-1.5 [&>th]:font-medium [&>th]:text-left">
                  <th className="w-[12%]">Item</th>
                  <th className="w-[22%]">External File</th>
                  <th className="w-[14%]">Type</th>
                  <th className="w-[14%]">Tag(s)</th>
                  <th className="w-[12%]">Item(s)</th>
                  <th className="w-[14%]">Uploaded By</th>
                  <th className="w-[12%]">Uploaded Date</th>
                </tr>
                <tr className="[&>th]:px-2 [&>th]:pb-1.5 border-b border-border">
                  <th><Input value={fItem} onChange={(e) => setFItem(e.target.value)} className="h-6 text-[11px]" placeholder="Filter" /></th>
                  <th><Input value={fFile} onChange={(e) => setFFile(e.target.value)} className="h-6 text-[11px]" placeholder="Filter" /></th>
                  <th>
                    <Select value={fType} onValueChange={setFType}>
                      <SelectTrigger className="h-6 text-[11px]"><SelectValue placeholder="All" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {DOC_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </th>
                  <th><Input value={fTag} onChange={(e) => setFTag(e.target.value)} className="h-6 text-[11px]" placeholder="Filter" /></th>
                  <th><Input value={fItems} onChange={(e) => setFItems(e.target.value)} className="h-6 text-[11px]" placeholder="Filter" /></th>
                  <th><Input value={fBy} onChange={(e) => setFBy(e.target.value)} className="h-6 text-[11px]" placeholder="Filter" /></th>
                  <th><Input value={fDate} onChange={(e) => setFDate(e.target.value)} className="h-6 text-[11px]" placeholder="MM/DD/YYYY" /></th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-[11px] text-muted-foreground">
                      No files match the current filters.
                    </td>
                  </tr>
                )}
                {paged.map((r, i) => (
                  <tr key={`${r.item}-${i}`} className="border-t border-border/60 even:bg-muted/20 hover:bg-muted/40 [&>td]:px-2 [&>td]:py-1.5">
                    <td className="tabular-nums font-medium">{r.item}</td>
                    <td>
                      <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-primary hover:underline">
                        <FileText className="h-3 w-3" />
                        <span className="truncate">{r.file}</span>
                      </a>
                    </td>
                    <td>{r.type}</td>
                    <td>
                      {r.tags.length ? (
                        <div className="flex flex-wrap gap-1">
                          {r.tags.map((t) => (
                            <span key={t} className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px]">{t}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-muted-foreground">{r.items || "—"}</td>
                    <td>{r.by}</td>
                    <td className="tabular-nums">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-border text-[11px]">
            <div className="text-muted-foreground">
              Page {page} of {totalPages} ({rows.length} items)
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-6 w-6" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    className={`h-6 w-6 p-0 text-[11px] ${page === i + 1 ? "bg-foreground text-background hover:bg-foreground/90" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button variant="outline" size="icon" className="h-6 w-6" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Page size:</span>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                  <SelectTrigger className="h-6 w-[60px] text-[11px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
