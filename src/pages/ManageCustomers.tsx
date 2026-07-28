import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  RotateCcw,
  Plus,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Settings2,
  MoreHorizontal,
  FileText,
  DollarSign,
  Bell,
  FolderOpen,
  Archive,
  Eye,
  Pencil,
  X,
  Users,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useToast } from "@/components/ui/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";

interface CustomerRow {
  id: string;
  accountNumber: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  status: "Active" | "Pending" | "Inactive";
  salesperson: string;
  openItems: number;
  contractPricing: boolean;
  nationalContract: boolean;
  autoPricing: boolean;
  rotManagement: boolean;
  contactFirstName: string;
  contactLastName: string;
}

const mockCustomers: CustomerRow[] = [
  { id: "1", accountNumber: "0185.12", name: "Entergy Mississippi LLC", address: "308 E Pearl St", city: "Jackson", state: "MS", phone: "(601) 555-0142", email: "ops@entergy-ms.com", status: "Active", salesperson: "Vincent E. Lloyde", openItems: 95, contractPricing: true, nationalContract: true, autoPricing: true, rotManagement: false, contactFirstName: "Rebecca", contactLastName: "Hall" },
  { id: "2", accountNumber: "2588.00", name: "John Deere", address: "1 John Deere Pl", city: "Moline", state: "IL", phone: "(309) 555-0100", email: "cal@deere.com", status: "Active", salesperson: "Christian B. ONeal", openItems: 7, contractPricing: true, nationalContract: false, autoPricing: false, rotManagement: true, contactFirstName: "James", contactLastName: "Wu" },
  { id: "3", accountNumber: "10323.00", name: "Sabal Trail Transmission LLC", address: "700 Universe Blvd", city: "Juno Beach", state: "FL", phone: "(561) 555-0187", email: "ops@sabaltrail.com", status: "Active", salesperson: "Jerome J. Davis", openItems: 186, contractPricing: true, nationalContract: true, autoPricing: true, rotManagement: true, contactFirstName: "Priya", contactLastName: "Menon" },
  { id: "4", accountNumber: "1790.00", name: "Shintech", address: "5618 LA-3115", city: "Plaquemine", state: "LA", phone: "(225) 555-0166", email: "purchasing@shintech.com", status: "Pending", salesperson: "Vincent E. Lloyde", openItems: 12, contractPricing: false, nationalContract: false, autoPricing: false, rotManagement: false, contactFirstName: "Tom", contactLastName: "Nguyen" },
  { id: "5", accountNumber: "4051.00", name: "Pinnacle Polymers", address: "36790 LA-30", city: "Garyville", state: "LA", phone: "(985) 555-0119", email: "ops@pinnaclepoly.com", status: "Active", salesperson: "Lucas M Roberts", openItems: 3, contractPricing: true, nationalContract: false, autoPricing: true, rotManagement: false, contactFirstName: "Elena", contactLastName: "Sosa" },
  { id: "6", accountNumber: "0367.00", name: "Occidental Chem", address: "5 Greenway Plz", city: "Houston", state: "TX", phone: "(713) 555-0155", email: "cal@oxy.com", status: "Active", salesperson: "Christian B. ONeal", openItems: 41, contractPricing: true, nationalContract: true, autoPricing: false, rotManagement: true, contactFirstName: "David", contactLastName: "Park" },
  { id: "7", accountNumber: "3098.00", name: "Cheniere Sabine Pass", address: "9243 Gulf Beach Hwy", city: "Cameron", state: "LA", phone: "(337) 555-0122", email: "ops@cheniere.com", status: "Active", salesperson: "Christian B. ONeal", openItems: 22, contractPricing: true, nationalContract: false, autoPricing: false, rotManagement: false, contactFirstName: "Marcus", contactLastName: "Reed" },
  { id: "8", accountNumber: "6941.00", name: "Wolseley Industrial", address: "12500 Jefferson Hwy", city: "Baton Rouge", state: "LA", phone: "(225) 555-0179", email: "sales@wolseley.com", status: "Inactive", salesperson: "Christian B. ONeal", openItems: 0, contractPricing: false, nationalContract: false, autoPricing: false, rotManagement: false, contactFirstName: "Sarah", contactLastName: "Kane" },
  { id: "9", accountNumber: "0364.03", name: "Marathon Petro Elect", address: "539 S Main St", city: "Findlay", state: "OH", phone: "(419) 555-0163", email: "cal@marathonpetroleum.com", status: "Active", salesperson: "Jerome J. Davis", openItems: 58, contractPricing: true, nationalContract: true, autoPricing: true, rotManagement: true, contactFirstName: "Nathan", contactLastName: "Frost" },
  { id: "10", accountNumber: "2343.07", name: "LA Integrated PE JV LLC Whse", address: "1231 River Rd", city: "Baton Rouge", state: "LA", phone: "(225) 555-0134", email: "warehouse@laipe.com", status: "Pending", salesperson: "Vincent E. Lloyde", openItems: 4, contractPricing: false, nationalContract: false, autoPricing: false, rotManagement: false, contactFirstName: "Anna", contactLastName: "Bell" },
];

type SortKey = keyof CustomerRow | null;

const StatusChip = ({ status }: { status: CustomerRow["status"] }) => {
  const map: Record<CustomerRow["status"], string> = {
    Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Inactive: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  return (
    <Badge variant="outline" className={`${map[status]} h-5 px-2.5 text-[10px] font-semibold rounded-full hover:bg-transparent`}>
      {status}
    </Badge>
  );
};

const YesNoChip = ({
  value,
  yesTone = "green",
}: {
  value: boolean;
  yesTone?: "green" | "blue";
}) => {
  if (!value) {
    return (
      <Badge variant="secondary" className="h-5 px-2 text-[10px] font-medium">
        No
      </Badge>
    );
  }
  const tone =
    yesTone === "blue"
      ? "bg-blue-500 text-white hover:bg-blue-500"
      : "bg-emerald-500 text-white hover:bg-emerald-500";
  return <Badge className={`${tone} h-5 px-2 text-[10px] font-medium`}>Yes</Badge>;
};

const ManageCustomers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Basic filters
  const [statusFilter, setStatusFilter] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hasOpenItems, setHasOpenItems] = useState(false);
  const [search, setSearch] = useState("");

  // Advanced filters
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [stateVal, setStateVal] = useState("");
  const [salesperson, setSalesperson] = useState("");
  const [contractPricing, setContractPricing] = useState("");
  const [nationalContract, setNationalContract] = useState("");
  const [autoPricing, setAutoPricing] = useState("");
  const [rotManagement, setRotManagement] = useState("");
  const [openItemsMin, setOpenItemsMin] = useState("");
  const [openItemsMax, setOpenItemsMax] = useState("");
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>();
  const [createdTo, setCreatedTo] = useState<Date | undefined>();
  const [updatedFrom, setUpdatedFrom] = useState<Date | undefined>();
  const [updatedTo, setUpdatedTo] = useState<Date | undefined>();
  const [dateType, setDateType] = useState("created");

  // Table state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [drawerCustomer, setDrawerCustomer] = useState<CustomerRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockCustomers.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (firstName && !c.contactFirstName.toLowerCase().includes(firstName.toLowerCase())) return false;
      if (lastName && !c.contactLastName.toLowerCase().includes(lastName.toLowerCase())) return false;
      if (phone && !c.phone.includes(phone)) return false;
      if (email && !c.email.toLowerCase().includes(email.toLowerCase())) return false;
      if (hasOpenItems && c.openItems <= 0) return false;
      if (stateVal && c.state !== stateVal) return false;
      if (salesperson && c.salesperson !== salesperson) return false;
      if (contractPricing === "yes" && !c.contractPricing) return false;
      if (contractPricing === "no" && c.contractPricing) return false;
      if (nationalContract === "yes" && !c.nationalContract) return false;
      if (nationalContract === "no" && c.nationalContract) return false;
      if (autoPricing === "yes" && !c.autoPricing) return false;
      if (autoPricing === "no" && c.autoPricing) return false;
      if (rotManagement === "yes" && !c.rotManagement) return false;
      if (rotManagement === "no" && c.rotManagement) return false;
      if (openItemsMin && c.openItems < Number(openItemsMin)) return false;
      if (openItemsMax && c.openItems > Number(openItemsMax)) return false;
      if (q) {
        const hay = [c.name, c.accountNumber, c.phone, `${c.contactFirstName} ${c.contactLastName}`, c.email, c.address, c.city]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, statusFilter, firstName, lastName, phone, email, hasOpenItems, stateVal, salesperson, contractPricing, nationalContract, autoPricing, rotManagement, openItemsMin, openItemsMax]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey] as unknown;
      const bv = b[sortKey] as unknown;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const kpis = useMemo(() => {
    const total = mockCustomers.length;
    const active = mockCustomers.filter((c) => c.status === "Active").length;
    const withOpen = mockCustomers.filter((c) => c.openItems > 0).length;
    const national = mockCustomers.filter((c) => c.nationalContract).length;
    const pending = mockCustomers.filter((c) => c.status === "Pending").length;
    return { total, active, withOpen, national, pending };
  }, []);

  const toggleSort = (k: keyof CustomerRow) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(pageRows.map((r) => r.id)) : new Set());
  };
  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleClearFilters = () => {
    setStatusFilter(""); setFirstName(""); setLastName(""); setPhone(""); setEmail("");
    setHasOpenItems(false); setSearch("");
    setStateVal(""); setSalesperson(""); setContractPricing(""); setNationalContract("");
    setAutoPricing(""); setRotManagement(""); setOpenItemsMin(""); setOpenItemsMax("");
    setCreatedFrom(undefined); setCreatedTo(undefined);
    setUpdatedFrom(undefined); setUpdatedTo(undefined);
  };

  const SortIcon = ({ k }: { k: keyof CustomerRow }) => {
    if (sortKey !== k) return <ChevronDown className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const dateFromMap: Record<string, Date | undefined> = { created: createdFrom, updated: updatedFrom };
  const dateToMap: Record<string, Date | undefined> = { created: createdTo, updated: updatedTo };
  const setDateFrom = (d?: Date) => (dateType === "created" ? setCreatedFrom(d) : setUpdatedFrom(d));
  const setDateTo = (d?: Date) => (dateType === "created" ? setCreatedTo(d) : setUpdatedTo(d));

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-4">
          {/* KPI Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {[
              { label: "Total Customers", value: kpis.total, icon: Users, tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20", bar: "from-blue-500 to-indigo-500" },
              { label: "Active", value: kpis.active, icon: CheckCircle2, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20", bar: "from-emerald-500 to-green-500" },
              { label: "With Open Items", value: kpis.withOpen, icon: ClipboardList, tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20", bar: "from-violet-500 to-purple-500" },
              { label: "National Contracts", value: kpis.national, icon: FileText, tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20", bar: "from-sky-500 to-cyan-500" },
              { label: "Pending Reviews", value: kpis.pending, icon: AlertCircle, tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20", bar: "from-amber-500 to-orange-500" },
            ].map((k) => (
              <Card key={k.label} className="relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${k.bar}`} />
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium truncate">{k.label}</div>
                    <div className="text-2xl font-bold text-foreground mt-0.5 leading-none">{k.value}</div>
                  </div>
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ring-1 ${k.tone} shrink-0`}>
                    <k.icon className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
              <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20 flex items-center justify-center">
                <Search className="h-3 w-3" />
              </div>
              <div className="text-[11px] font-semibold text-foreground uppercase tracking-wide">
                Search &amp; Filters
              </div>
            </div>
            <CardContent className="p-3 space-y-2">

              {/* Universal search */}
              <div className="flex items-stretch gap-0 rounded-md border border-input bg-background overflow-hidden h-8">
                <div className="flex items-center px-2 text-muted-foreground">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer, account #, phone, contact, email, address, city…"
                  className="h-8 text-xs border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {search && (
                  <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none" onClick={() => setSearch("")}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {/* Basic filter grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Contact first name" className="h-8 text-xs" />
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Contact last name" className="h-8 text-xs" />
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contact phone #" className="h-8 text-xs" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Contact email" className="h-8 text-xs" />
                <div className="flex items-center gap-2 h-8 px-2 rounded-md border border-input">
                  <Switch id="open-items" checked={hasOpenItems} onCheckedChange={setHasOpenItems} />
                  <Label htmlFor="open-items" className="text-xs cursor-pointer">Has open items</Label>
                </div>
              </div>

              {/* Advanced Filters */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleContent className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    <Select value={stateVal} onValueChange={(v) => setStateVal(v === "all" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="State" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="LA">LA</SelectItem>
                        <SelectItem value="TX">TX</SelectItem>
                        <SelectItem value="MS">MS</SelectItem>
                        <SelectItem value="FL">FL</SelectItem>
                        <SelectItem value="IL">IL</SelectItem>
                        <SelectItem value="OH">OH</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={salesperson} onValueChange={(v) => setSalesperson(v === "all" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Salesperson" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Salespersons</SelectItem>
                        <SelectItem value="Christian B. ONeal">Christian B. ONeal</SelectItem>
                        <SelectItem value="Jerome J. Davis">Jerome J. Davis</SelectItem>
                        <SelectItem value="Vincent E. Lloyde">Vincent E. Lloyde</SelectItem>
                        <SelectItem value="Lucas M Roberts">Lucas M Roberts</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={contractPricing} onValueChange={(v) => setContractPricing(v === "all" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Contract Pricing" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="yes">Enabled</SelectItem>
                        <SelectItem value="no">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={nationalContract} onValueChange={(v) => setNationalContract(v === "all" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="National Contract" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={autoPricing} onValueChange={(v) => setAutoPricing(v === "all" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Auto Pricing" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={rotManagement} onValueChange={(v) => setRotManagement(v === "all" ? "" : v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ROT Management" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    <div className="flex items-stretch gap-0 rounded-md border border-input bg-background overflow-hidden h-8">
                      <div className="flex items-center px-2 text-[11px] text-muted-foreground border-r border-input shrink-0">Open Items</div>
                      <Input
                        type="number"
                        value={openItemsMin}
                        onChange={(e) => setOpenItemsMin(e.target.value)}
                        placeholder="Min"
                        className="h-8 text-xs border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <div className="flex items-center px-1 text-muted-foreground text-xs">–</div>
                      <Input
                        type="number"
                        value={openItemsMax}
                        onChange={(e) => setOpenItemsMax(e.target.value)}
                        placeholder="Max"
                        className="h-8 text-xs border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <DateRangePicker
                      dateFrom={dateFromMap[dateType]}
                      dateTo={dateToMap[dateType]}
                      onDateFromChange={setDateFrom}
                      onDateToChange={setDateTo}
                      dateType={dateType}
                      onDateTypeChange={setDateType}
                      dateTypeOptions={[
                        { value: "created", label: "Created" },
                        { value: "updated", label: "Last Updated" },
                      ]}
                    />
                  </div>
                </CollapsibleContent>

                {/* Action row - kept at end of filter */}
                <div className="flex justify-between items-center gap-2 pt-1.5">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      {advancedOpen ? <ChevronUp className="h-3.5 w-3.5 mr-1.5" /> : <ChevronDown className="h-3.5 w-3.5 mr-1.5" />}
                      Advanced Filters
                    </Button>
                  </CollapsibleTrigger>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="rounded-lg h-8 px-4 text-xs font-medium border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Clear
                    </Button>
                    <Button
                      onClick={() => toast({ title: "Search applied" })}
                      className="rounded-lg h-8 px-5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                      <Search className="h-3.5 w-3.5 mr-1.5" />
                      Search
                    </Button>
                  </div>
                </div>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Quick Action Toolbar */}
          <Card>
            <CardContent className="p-2 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate("/manage-customers/new")}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />Add New Customer
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => toast({ title: "Refreshed", description: "Customer data reloaded." })}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />Export
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Settings2 className="h-3.5 w-3.5 mr-1.5" />Columns
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => navigate("/manage-customers/retest-notices")}
              >
                <Bell className="h-3.5 w-3.5 mr-1.5" />Retest Notices
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => navigate("/manage-customers/retest-followup")}
              >
                <Bell className="h-3.5 w-3.5 mr-1.5" />Retest Notice Followups
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <FileText className="h-3.5 w-3.5 mr-1.5" />Manage CDR
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <FileText className="h-3.5 w-3.5 mr-1.5" />Contract Reviews
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <FolderOpen className="h-3.5 w-3.5 mr-1.5" />SR Documents
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={selected.size === 0}
              >
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />Bulk Contract Pricing Update
              </Button>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
                <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                  Customers
                </div>
                <Badge variant="secondary" className="h-6 text-[11px] font-medium">
                  {sorted.length} {sorted.length === 1 ? "result" : "results"}
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-8 px-2">
                        <Checkbox
                          checked={pageRows.length > 0 && pageRows.every((r) => selected.has(r.id))}
                          onCheckedChange={(v) => toggleAll(!!v)}
                        />
                      </TableHead>
                      {[
                        { k: "accountNumber", label: "Account #" },
                        { k: "name", label: "Customer Name" },
                        { k: "address", label: "Address" },
                        { k: "city", label: "City" },
                        { k: "state", label: "State" },
                        { k: "phone", label: "Phone" },
                        { k: "status", label: "Status" },
                        { k: "salesperson", label: "Salesperson" },
                        { k: "openItems", label: "Open Items" },
                        { k: "contractPricing", label: "Contract" },
                        { k: "nationalContract", label: "National" },
                        { k: "autoPricing", label: "Auto Pricing" },
                        { k: "rotManagement", label: "ROT Mgmt" },
                      ].map((c) => (
                        <TableHead
                          key={c.k}
                          className="text-[11px] uppercase tracking-wide cursor-pointer select-none"
                          onClick={() => toggleSort(c.k as keyof CustomerRow)}
                        >
                          <span className="inline-flex items-center gap-1">
                            {c.label}
                            <SortIcon k={c.k as keyof CustomerRow} />
                          </span>
                        </TableHead>
                      ))}
                      <TableHead className="text-[11px] uppercase tracking-wide text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={15} className="text-center text-xs text-muted-foreground py-16">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-8 w-8 text-muted-foreground/40" />
                            <div className="font-medium">No customers found.</div>
                            <Button variant="outline" size="sm" className="h-8 text-xs mt-1" onClick={handleClearFilters}>
                              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Reset Filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageRows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="text-xs cursor-pointer"
                          data-state={selected.has(row.id) ? "selected" : undefined}
                          onClick={() => setDrawerCustomer(row)}
                        >
                          <TableCell className="py-2 px-2" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selected.has(row.id)}
                              onCheckedChange={(v) => toggleOne(row.id, !!v)}
                            />
                          </TableCell>
                          <TableCell className="py-2 font-medium" onClick={(e) => e.stopPropagation()}>
                            <Link
                              to={`/manage-customers/${encodeURIComponent(row.accountNumber)}`}
                              className="text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              {row.accountNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="py-2">{row.name}</TableCell>
                          <TableCell className="py-2 text-muted-foreground">{row.address}</TableCell>
                          <TableCell className="py-2">{row.city}</TableCell>
                          <TableCell className="py-2">{row.state}</TableCell>
                          <TableCell className="py-2">{row.phone}</TableCell>
                          <TableCell className="py-2"><StatusChip status={row.status} /></TableCell>
                          <TableCell className="py-2">{row.salesperson}</TableCell>
                          <TableCell className="py-2">
                            <Badge variant="secondary" className="h-5 px-2 text-[11px] font-medium tabular-nums">
                              {row.openItems}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2"><YesNoChip value={row.contractPricing} /></TableCell>
                          <TableCell className="py-2"><YesNoChip value={row.nationalContract} yesTone="blue" /></TableCell>
                          <TableCell className="py-2"><YesNoChip value={row.autoPricing} /></TableCell>
                          <TableCell className="py-2"><YesNoChip value={row.rotManagement} /></TableCell>
                          <TableCell className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setDrawerCustomer(row)}>
                                  <Eye className="h-3.5 w-3.5 mr-2" />View Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pencil className="h-3.5 w-3.5 mr-2" />Edit Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="h-3.5 w-3.5 mr-2" />View Contracts
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <DollarSign className="h-3.5 w-3.5 mr-2" />Manage Pricing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FolderOpen className="h-3.5 w-3.5 mr-2" />Open Documents
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bell className="h-3.5 w-3.5 mr-2" />Review Notices
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-3.5 w-3.5 mr-2" />Export Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  <Archive className="h-3.5 w-3.5 mr-2" />Archive Customer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="sticky bottom-0 bg-background border-t border-border px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-muted-foreground">
                  Showing {pageRows.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">Rows</span>
                    <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                      <SelectTrigger className="h-7 w-16 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[10, 25, 50, 100].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                    <span className="text-[11px] text-muted-foreground px-1">Page {page} / {totalPages}</span>
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sticky bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 animate-fade-in">
          <Badge className="h-6 bg-blue-600 text-white text-[11px]">{selected.size} selected</Badge>
          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-7 text-xs"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs"><Users className="h-3.5 w-3.5 mr-1.5" />Assign Salesperson</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs"><DollarSign className="h-3.5 w-3.5 mr-1.5" />Bulk Pricing</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs"><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Activate</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs"><AlertCircle className="h-3.5 w-3.5 mr-1.5" />Deactivate</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs"><Bell className="h-3.5 w-3.5 mr-1.5" />Send Notices</Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelected(new Set())}>
            <X className="h-3.5 w-3.5 mr-1.5" />Clear
          </Button>
        </div>
      )}

      {/* Customer Detail Drawer */}
      <Sheet open={!!drawerCustomer} onOpenChange={(o) => !o && setDrawerCustomer(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {drawerCustomer && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-base">{drawerCustomer.name}</SheetTitle>
                  <StatusChip status={drawerCustomer.status} />
                </div>
                <SheetDescription className="text-xs">
                  Account #{drawerCustomer.accountNumber} · {drawerCustomer.city}, {drawerCustomer.state}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-5">
                <section>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Customer Information</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div className="text-muted-foreground">Address</div><div>{drawerCustomer.address}</div>
                    <div className="text-muted-foreground">City / State</div><div>{drawerCustomer.city}, {drawerCustomer.state}</div>
                    <div className="text-muted-foreground">Phone</div><div>{drawerCustomer.phone}</div>
                    <div className="text-muted-foreground">Email</div><div className="truncate">{drawerCustomer.email}</div>
                    <div className="text-muted-foreground">Salesperson</div><div>{drawerCustomer.salesperson}</div>
                  </div>
                </section>

                <section>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Contacts</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div className="text-muted-foreground">Primary</div>
                    <div>{drawerCustomer.contactFirstName} {drawerCustomer.contactLastName}</div>
                    <div className="text-muted-foreground">Secondary</div>
                    <div className="text-muted-foreground/70">—</div>
                  </div>
                </section>

                <section>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Pricing</div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-xs"><span className="text-muted-foreground">Contract</span><YesNoChip value={drawerCustomer.contractPricing} /></div>
                    <div className="flex items-center gap-1.5 text-xs"><span className="text-muted-foreground">National</span><YesNoChip value={drawerCustomer.nationalContract} yesTone="blue" /></div>
                    <div className="flex items-center gap-1.5 text-xs"><span className="text-muted-foreground">Auto</span><YesNoChip value={drawerCustomer.autoPricing} /></div>
                    <div className="flex items-center gap-1.5 text-xs"><span className="text-muted-foreground">ROT</span><YesNoChip value={drawerCustomer.rotManagement} /></div>
                  </div>
                </section>

                <section>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Documents</div>
                  <div className="space-y-1.5">
                    {["SR Documents", "Contracts", "Pricing Files"].map((d) => (
                      <div key={d} className="flex items-center justify-between border border-border rounded-md px-2.5 py-1.5 text-xs">
                        <span className="flex items-center gap-2"><FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />{d}</span>
                        <Button variant="ghost" size="sm" className="h-6 text-[11px]">Open</Button>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Activity Timeline</div>
                  <div className="space-y-2 text-xs">
                    {[
                      { t: "Contract renewed", d: "2 days ago" },
                      { t: "Order #58211 shipped", d: "5 days ago" },
                      { t: "Pricing sheet updated", d: "3 weeks ago" },
                    ].map((a) => (
                      <div key={a.t} className="flex items-start gap-2">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                        <div className="flex-1">
                          <div>{a.t}</div>
                          <div className="text-[11px] text-muted-foreground">{a.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Notes</div>
                  <div className="text-xs text-muted-foreground border border-dashed border-border rounded-md p-2.5">
                    No notes yet.
                  </div>
                </section>

                <div className="flex justify-end gap-2 pt-2 pb-6">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setDrawerCustomer(null)}>Close</Button>
                  <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit Customer
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ManageCustomers;
