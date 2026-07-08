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
import { Separator } from "@/components/ui/separator";
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
  <CardHeader className="p-4 pb-3">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 w-8 h-8 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-[11px] mt-0.5">{description}</CardDescription>
          )}
        </div>
      </div>
    </div>
  </CardHeader>
);

const FieldRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">{children}</div>
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
  <div className={`space-y-1.5 ${full ? "md:col-span-2" : ""}`}>
    <Label className="text-xs font-medium text-foreground">
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
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border last:border-0">
      <div className="min-w-0">
        <div className="text-xs font-medium text-foreground">{label}</div>
        {description && (
          <div className="text-[11px] text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
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

/* ------------------------------ Page ------------------------------ */

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
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Customer</div>
                  <div className="text-sm font-semibold mt-0.5 truncate">{customer.name}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">#{customer.accountNumber}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Status</div>
                  <div className="mt-1"><StatusChip status={customer.status} /></div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Primary Contact</div>
                  <div className="text-xs font-medium mt-1 truncate">{customer.primaryContact}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{customer.phone}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Salesperson</div>
                  <div className="text-xs font-medium mt-1 truncate">{customer.salesperson}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Industry</div>
                  <div className="text-xs font-medium mt-1">{customer.industry}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Contract Pricing</div>
                  <div className="text-xs font-medium mt-1">
                    <Badge variant="outline" className="h-5 px-2 text-[11px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-transparent">
                      {customer.contractPricing}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Created By</div>
                  <div className="text-xs font-medium mt-1 truncate">{customer.createdBy}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">{customer.createdDate}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Modified By</div>
                  <div className="text-xs font-medium mt-1 truncate">{customer.modifiedBy}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">{customer.modifiedDate}</div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Main: full-width tabs, sidebar cards below */}
          <div className="space-y-4">
            <Tabs defaultValue="general" className="w-full">

              <div className="sticky top-[73px] z-20 bg-muted/20 -mx-1 px-1 py-1 space-y-1">
                <div className="overflow-x-auto">
                  <TabsList className="h-12 bg-white border border-border p-1 inline-flex">
                    {[
                      { v: "general", label: "General", icon: Building2 },
                      { v: "contacts", label: "Contacts", icon: Users },
                      { v: "work-orders", label: "Work Orders", icon: FileText },
                      { v: "retest", label: "Retest Notices", icon: Bell },
                    ].map((t) => (
                      <TabsTrigger
                        key={t.v}
                        value={t.v}
                        className="h-10 px-4 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <t.icon className="h-4 w-4 mr-2" />
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <div className="overflow-x-auto">
                  <TabsList className="h-12 bg-white border border-border p-1 inline-flex">
                    {[
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
                        className="h-10 px-4 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <t.icon className="h-4 w-4 mr-2" />
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>


              {/* GENERAL */}
              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Customer Information */}
                  <Card>
                    <SectionHeader
                      icon={Building2}
                      title="Customer Information"
                      description="Primary account and shipping address."
                    />
                    <CardContent className="p-4 pt-0 space-y-3">
                      <FieldRow>
                        <Field label="Customer Status" required>
                          <Select defaultValue="active">
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="Account Number" required>
                          <Input className="h-8 text-xs tabular-nums" defaultValue={customer.accountNumber} readOnly />
                        </Field>
                        <Field label="Customer Name" required full>
                          <Input className="h-8 text-xs" defaultValue={customer.name} />
                        </Field>
                        <Field label="Ship To" full>
                          <Input className="h-8 text-xs" defaultValue={customer.name} />
                        </Field>
                        <Field label="Address" full>
                          <Input className="h-8 text-xs" defaultValue="123 Industrial Way" />
                        </Field>
                        <Field label="City">
                          <Input className="h-8 text-xs" defaultValue="Baton Rouge" />
                        </Field>
                        <Field label="State">
                          <Input className="h-8 text-xs" defaultValue="LA" />
                        </Field>
                        <Field label="Zip Code">
                          <Input className="h-8 text-xs" defaultValue="70801" />
                        </Field>
                      </FieldRow>
                    </CardContent>
                  </Card>

                  {/* Retest Address */}
                  <Card>
                    <SectionHeader
                      icon={MapPin}
                      title="Retest Address"
                      description="Where recall / retest notices are mailed."
                    />
                    <CardContent className="p-4 pt-0 space-y-3">
                      <FieldRow>
                        <Field label="Retest Mail To" full>
                          <Input className="h-8 text-xs" defaultValue={customer.name} />
                        </Field>
                        <Field label="Address" full>
                          <Input className="h-8 text-xs" defaultValue="Same as shipping" />
                        </Field>
                        <Field label="City">
                          <Input className="h-8 text-xs" defaultValue="Baton Rouge" />
                        </Field>
                        <Field label="State">
                          <Input className="h-8 text-xs" defaultValue="LA" />
                        </Field>
                        <Field label="Zip Code">
                          <Input className="h-8 text-xs" defaultValue="70801" />
                        </Field>
                      </FieldRow>
                    </CardContent>
                  </Card>

                  {/* Primary Contact */}
                  <Card>
                    <SectionHeader
                      icon={User}
                      title="Primary Contact"
                      description="Main person for account communications."
                    />
                    <CardContent className="p-4 pt-0 space-y-3">
                      <FieldRow>
                        <Field label="Main Contact" required>
                          <Input className="h-8 text-xs" defaultValue={customer.primaryContact} />
                        </Field>
                        <Field label="Phone Number">
                          <Input className="h-8 text-xs" defaultValue={customer.phone} />
                        </Field>
                        <Field label="Email" full>
                          <Input className="h-8 text-xs" defaultValue={customer.email} />
                        </Field>
                        <Field label="Biller Code">
                          <Input className="h-8 text-xs" defaultValue="BC-102" />
                        </Field>

                      </FieldRow>
                    </CardContent>
                  </Card>

                  {/* Business Information */}
                  <Card>
                    <SectionHeader
                      icon={Briefcase}
                      title="Business Information"
                      description="Industry, documentation and payment terms."
                    />
                    <CardContent className="p-4 pt-0 space-y-3">
                      <FieldRow>
                        <Field label="Salesperson" required>
                          <Input className="h-8 text-xs" defaultValue={customer.salesperson} />
                        </Field>
                        <Field label="Industry Code">
                          <Select defaultValue="utilities">
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utilities">Utilities</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="oilgas">Oil &amp; Gas</SelectItem>
                              <SelectItem value="construction">Construction</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>

                        <Field label="OSR Number">
                          <Input className="h-8 text-xs" defaultValue="OSR-2456" />
                        </Field>
                        <Field label="OSR Document">
                          <Input className="h-8 text-xs" defaultValue="osr-2024.pdf" />
                        </Field>
                        <Field label="SR Document">
                          <Input className="h-8 text-xs" defaultValue="sr-2024.pdf" />
                        </Field>
                        <Field label="Payment Terms" full>
                          <Select defaultValue="net30">
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="net15">Net 15</SelectItem>
                              <SelectItem value="net30">Net 30</SelectItem>
                              <SelectItem value="net60">Net 60</SelectItem>
                              <SelectItem value="cod">COD</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      </FieldRow>
                    </CardContent>
                  </Card>

                  {/* Pricing & Inventory */}
                  <Card>
                    <SectionHeader
                      icon={DollarSign}
                      title="Pricing & Inventory"
                      description="Contract pricing and surplus access."
                    />
                    <CardContent className="p-4 pt-0">
                      <ToggleRow
                        label="Contract Pricing"
                        description="Apply negotiated contract rates to this customer."
                        defaultChecked
                      />
                      <ToggleRow
                        label="ESL Surplus Inventory"
                        description="Allow use of ESL surplus stock for fulfilment."
                        defaultChecked
                      />
                      <ToggleRow
                        label="Global Surplus Access"
                        description="Access surplus inventory across all warehouses."
                      />
                    </CardContent>
                  </Card>

                  {/* Operational Settings */}
                  <Card>
                    <SectionHeader
                      icon={Settings2}
                      title="Operational Settings"
                      description="Workflow and recall behaviour."
                    />
                    <CardContent className="p-4 pt-0">
                      <ToggleRow label="No Expedite Fees" description="Waive expedite fees for this account." />
                      <ToggleRow
                        label="Enabled Calibration Frequency"
                        description="Track calibration intervals automatically."
                        defaultChecked
                      />
                      <ToggleRow
                        label="End of Month Recall"
                        description="Include in end-of-month recall notifications."
                      />
                      <ToggleRow
                        label="Add to Service Date List"
                        description="Include on scheduled service reminder lists."
                        defaultChecked
                      />
                      <ToggleRow
                        label="Add to No Recall List"
                        description="Exclude customer from recall notice runs."
                      />
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <Card className="lg:col-span-2">
                    <SectionHeader
                      icon={StickyNote}
                      title="Notes"
                      description="Customer-facing remarks and internal comments."
                    />
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Remarks" full>
                          <Textarea
                            className="text-xs min-h-[110px]"
                            placeholder="Visible on quotes and work orders…"
                            defaultValue="Prefers Wednesday deliveries. Requires PO on all shipments."
                          />
                        </Field>
                        <Field label="Internal Comments" full>
                          <Textarea
                            className="text-xs min-h-[110px]"
                            placeholder="Internal only — not shared with the customer."
                            defaultValue="Key account. Route escalations to Jerome directly."
                          />
                        </Field>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* CONTACTS */}
              <TabsContent value="contacts" className="mt-4">
                <Card>
                  <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">Contacts</CardTitle>
                      <CardDescription className="text-[11px]">People associated with this customer.</CardDescription>
                    </div>
                    <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />Add Contact
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { name: customer.primaryContact, role: "Primary Contact", email: customer.email, phone: customer.phone, primary: true },
                        { name: "Alicia Turner", role: "Accounts Payable", email: "ap@test-industries.com", phone: "(555) 010-4477" },
                        { name: "Marcus Lin", role: "Operations Lead", email: "m.lin@test-industries.com", phone: "(555) 010-8899" },
                      ].map((c, i) => (
                        <Card key={i} className="border">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-xs font-semibold flex items-center gap-1.5">
                                  {c.name}
                                  {c.primary && (
                                    <Badge variant="outline" className="h-4 px-1.5 text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-transparent">
                                      <Star className="h-2.5 w-2.5 mr-0.5" />Primary
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-[11px] text-muted-foreground">{c.role}</div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                                  <DropdownMenuItem><Star className="h-3.5 w-3.5 mr-2" />Set Primary</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5 mr-2" />Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <Separator />
                            <div className="space-y-1 text-[11px] text-muted-foreground">
                              <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{c.email}</div>
                              <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{c.phone}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* WORK ORDERS */}
              <TabsContent value="work-orders" className="mt-4">
                <Card>
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="text-sm font-semibold">Work Orders</CardTitle>
                    <CardDescription className="text-[11px]">Recent work orders for this customer.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[11px] uppercase">Work Order</TableHead>
                          <TableHead className="text-[11px] uppercase">Status</TableHead>
                          <TableHead className="text-[11px] uppercase">Asset</TableHead>
                          <TableHead className="text-[11px] uppercase">Technician</TableHead>
                          <TableHead className="text-[11px] uppercase">Due Date</TableHead>
                          <TableHead className="text-[11px] uppercase">Invoice</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { wo: "5432", status: "In Progress", asset: "Blanket Kit A-102", tech: "M. Alvarez", due: "Jul 15, 2026", inv: "Pending" },
                          { wo: "5401", status: "Completed", asset: "Gloves Class 2", tech: "R. Patel", due: "Jun 28, 2026", inv: "Invoiced" },
                          { wo: "5389", status: "On Hold", asset: "Grounds Set G-11", tech: "K. Nguyen", due: "Jun 22, 2026", inv: "—" },
                        ].map((r) => (
                          <TableRow key={r.wo} className="text-xs">
                            <TableCell className="font-medium tabular-nums">{r.wo}</TableCell>
                            <TableCell><Badge variant="secondary" className="h-5 text-[11px]">{r.status}</Badge></TableCell>
                            <TableCell>{r.asset}</TableCell>
                            <TableCell>{r.tech}</TableCell>
                            <TableCell className="tabular-nums">{r.due}</TableCell>
                            <TableCell>{r.inv}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PURCHASE ORDERS */}
              <TabsContent value="po" className="mt-4">
                <Card>
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="text-sm font-semibold">Purchase Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[11px] uppercase">PO Number</TableHead>
                          <TableHead className="text-[11px] uppercase">Status</TableHead>
                          <TableHead className="text-[11px] uppercase">Created</TableHead>
                          <TableHead className="text-[11px] uppercase text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { po: "PO-88210", status: "Open", created: "Jun 30, 2026", amount: "$12,480.00" },
                          { po: "PO-88145", status: "Closed", created: "May 18, 2026", amount: "$4,220.00" },
                        ].map((r) => (
                          <TableRow key={r.po} className="text-xs">
                            <TableCell className="font-medium">{r.po}</TableCell>
                            <TableCell><Badge variant="secondary" className="h-5 text-[11px]">{r.status}</Badge></TableCell>
                            <TableCell>{r.created}</TableCell>
                            <TableCell className="text-right tabular-nums">{r.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* QUOTES */}
              <TabsContent value="quotes" className="mt-4">
                <Card>
                  <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">Quotes</CardTitle>
                      <CardDescription className="text-[11px]">Recent quotes for this customer.</CardDescription>
                    </div>
                    <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />Create Quote
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[11px] uppercase">Quote #</TableHead>
                          <TableHead className="text-[11px] uppercase">Status</TableHead>
                          <TableHead className="text-[11px] uppercase">Date</TableHead>
                          <TableHead className="text-[11px] uppercase text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { q: "Q-4478", status: "Sent", date: "Jul 01, 2026", amount: "$2,180.00" },
                          { q: "Q-4451", status: "Accepted", date: "Jun 20, 2026", amount: "$6,940.00" },
                        ].map((r) => (
                          <TableRow key={r.q} className="text-xs">
                            <TableCell className="font-medium">{r.q}</TableCell>
                            <TableCell><Badge variant="secondary" className="h-5 text-[11px]">{r.status}</Badge></TableCell>
                            <TableCell>{r.date}</TableCell>
                            <TableCell className="text-right tabular-nums">{r.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CONTRACT PRICING */}
              <TabsContent value="contract" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Pricing Rules", desc: "12 active rules across 4 categories.", icon: DollarSign },
                    { title: "Discounts", desc: "3 volume discounts configured.", icon: Tag },
                    { title: "Contract Documents", desc: "MSA-2024.pdf · Signed Jan 12, 2024", icon: FileText },
                  ].map((c, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <c.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">{c.title}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">{c.desc}</div>
                            <Button variant="link" size="sm" className="h-6 px-0 text-xs mt-1">
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
              <TabsContent value="files" className="mt-4">
                <Card>
                  <CardHeader className="p-4 pb-3">
                    <CardTitle className="text-sm font-semibold">Work Order External Files</CardTitle>
                    <CardDescription className="text-[11px]">Attachments uploaded by customers or staff.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1.5" />
                      <div className="text-xs font-medium">Drag & drop files here</div>
                      <div className="text-[11px] text-muted-foreground">or click to browse (PDF, DOCX, XLSX, PNG, JPG)</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { name: "MSA-2024.pdf", by: "Jerome D.", date: "Jan 12, 2024" },
                        { name: "Cert-Report-5432.pdf", by: "M. Alvarez", date: "Jun 28, 2026" },
                      ].map((f, i) => (
                        <div key={i} className="flex items-center justify-between border border-border rounded-md p-2.5 bg-background">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                              <Paperclip className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium truncate">{f.name}</div>
                              <div className="text-[11px] text-muted-foreground">{f.by} · {f.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fallback simple tabs */}
              {["retest", "print-tags", "fees", "custom"].map((v) => (
                <TabsContent key={v} value={v} className="mt-4">
                  <Card>
                    <CardContent className="p-8 text-center text-xs text-muted-foreground">
                      This section preserves legacy functionality. Content will render here.
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Sidebar cards below tabs */}
            <aside className="grid grid-cols-1 md:grid-cols-3 gap-4">


              <Card>
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {[
                    { icon: FilePlus2, text: "Quote Q-4478 created", when: "2h ago" },
                    { icon: FileText, text: "WO 5432 updated", when: "Yesterday" },
                    { icon: DollarSign, text: "Contract pricing refreshed", when: "3d ago" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center shrink-0">
                        <a.icon className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs">{a.text}</div>
                        <div className="text-[11px] text-muted-foreground">{a.when}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" /> Recent Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {[
                    { q: "Q-4478", amount: "$2,180.00", date: "Jul 01" },
                    { q: "Q-4451", amount: "$6,940.00", date: "Jun 20" },
                  ].map((r) => (
                    <div key={r.q} className="flex items-center justify-between text-xs">
                      <div className="font-medium">{r.q}</div>
                      <div className="text-muted-foreground tabular-nums">{r.amount}</div>
                      <div className="text-[11px] text-muted-foreground">{r.date}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> Recent Work Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {[
                    { wo: "5432", status: "In Progress" },
                    { wo: "5401", status: "Completed" },
                    { wo: "5389", status: "On Hold" },
                  ].map((r) => (
                    <div key={r.wo} className="flex items-center justify-between text-xs">
                      <div className="font-medium tabular-nums">#{r.wo}</div>
                      <Badge variant="secondary" className="h-5 text-[11px]">{r.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
