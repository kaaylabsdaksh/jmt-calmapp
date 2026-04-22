import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Save, FileText, BarChart3, Plus, X, Truck, UserPlus, MessageSquare, MoreHorizontal, CalendarIcon, Trash2, Pencil, Check, Building2, FileSpreadsheet, ClipboardList, Users, Wrench, Hash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import ModernTopNav from "@/components/modern/ModernTopNav";

// Mock account lookup — pre-populates Customer, SR #, OSR #, Rep, and City/State
type AccountInfo = { sr: string; osr: string; customer: string; rep: string; cityState: string };
const accountLookup: Record<string, AccountInfo> = {
  "2588.00":  { sr: "SR-1001", osr: "OSR-22", customer: "John Deere", rep: "Christian B. ONeal", cityState: "Baton Rouge, LA" },
  "10323.00": { sr: "SR-1042", osr: "OSR-31", customer: "Sabal Trail Transmission LLC", rep: "Jerome J. Davis", cityState: "Houston, TX" },
  "0185.12":  { sr: "SR-0987", osr: "OSR-14", customer: "Entergy Mississippi LLC", rep: "Vincent E. Lloyde", cityState: "Jackson, MS" },
  "1790.00":  { sr: "SR-1120", osr: "OSR-08", customer: "Shintech", rep: "Vincent E. Lloyde", cityState: "Plaquemine, LA" },
  "4051.00":  { sr: "SR-1135", osr: "OSR-19", customer: "Pinnacle Polymers", rep: "Lucas M Roberts", cityState: "Garyville, LA" },
  "0367.00":  { sr: "SR-1208", osr: "OSR-27", customer: "Occidental Chem", rep: "Christian B. ONeal", cityState: "Geismar, LA" },
  "6941.00":  { sr: "SR-1311", osr: "OSR-12", customer: "Wolseley Industrial", rep: "Christian B. ONeal", cityState: "Baton Rouge, LA" },
  "3098.00":  { sr: "SR-1402", osr: "OSR-44", customer: "Cheniere Sabine Pass", rep: "Christian B. ONeal", cityState: "Sabine Pass, TX" },
};

// Deterministic synthetic data for account numbers not in the lookup
const REPS = ["Christian B. ONeal", "Jerome J. Davis", "Vincent E. Lloyde", "Lucas M Roberts"];
const CITIES = ["Baton Rouge, LA", "Houston, TX", "Dallas, TX", "Jackson, MS", "New Orleans, LA"];
const CUSTOMER_PREFIXES = ["Acme", "Northstar", "Pioneer", "Summit", "Apex", "Vertex", "Liberty", "Cascade"];
const CUSTOMER_SUFFIXES = ["Industries", "Energy", "Chemical", "Manufacturing", "Services", "Holdings"];
const hashStr = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const getAccountInfo = (raw: string): AccountInfo | null => {
  const key = raw.trim();
  if (!key) return null;
  if (accountLookup[key]) return accountLookup[key];
  const h = hashStr(key);
  const digits = key.replace(/\D/g, "").padStart(4, "0").slice(-4);
  return {
    sr: `SR-${1000 + (h % 9000)}`,
    osr: `OSR-${10 + (h % 90)}`,
    customer: `${CUSTOMER_PREFIXES[h % CUSTOMER_PREFIXES.length]} ${CUSTOMER_SUFFIXES[(h >> 3) % CUSTOMER_SUFFIXES.length]} ${digits}`,
    rep: REPS[h % REPS.length],
    cityState: CITIES[(h >> 5) % CITIES.length],
  };
};

interface AccountRow {
  id: string;
  acct: string;
  sr: string;
  osr: string;
  jmLocation: string;
  division: string;
  customer: string;
  rep: string;
  cityState: string;
  startDate?: Date;
  endDate?: Date;
  poRcvd: string;
  confirmed: string;
}


type SectionAccent = "blue" | "violet" | "emerald" | "amber" | "rose" | "slate";

const accentStyles: Record<SectionAccent, { bar: string; iconBg: string; iconText: string; headerBg: string }> = {
  blue:    { bar: "bg-blue-500",    iconBg: "bg-blue-100 dark:bg-blue-950",       iconText: "text-blue-600 dark:text-blue-400",       headerBg: "bg-blue-50/50 dark:bg-blue-950/20" },
  violet:  { bar: "bg-violet-500",  iconBg: "bg-violet-100 dark:bg-violet-950",   iconText: "text-violet-600 dark:text-violet-400",   headerBg: "bg-violet-50/50 dark:bg-violet-950/20" },
  emerald: { bar: "bg-emerald-500", iconBg: "bg-emerald-100 dark:bg-emerald-950", iconText: "text-emerald-600 dark:text-emerald-400", headerBg: "bg-emerald-50/50 dark:bg-emerald-950/20" },
  amber:   { bar: "bg-amber-500",   iconBg: "bg-amber-100 dark:bg-amber-950",     iconText: "text-amber-600 dark:text-amber-400",     headerBg: "bg-amber-50/50 dark:bg-amber-950/20" },
  rose:    { bar: "bg-rose-500",    iconBg: "bg-rose-100 dark:bg-rose-950",       iconText: "text-rose-600 dark:text-rose-400",       headerBg: "bg-rose-50/50 dark:bg-rose-950/20" },
  slate:   { bar: "bg-slate-500",   iconBg: "bg-slate-100 dark:bg-slate-800",     iconText: "text-slate-600 dark:text-slate-300",     headerBg: "bg-slate-50/50 dark:bg-slate-900/40" },
};

const SectionCard = ({
  title,
  subtitle,
  icon: Icon,
  accent = "slate",
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: SectionAccent;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const styles = accentStyles[accent];
  return (
    <Card className="overflow-hidden relative">
      {/* Accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", styles.bar)} aria-hidden />
      <CardHeader className={cn("py-2.5 pl-4 pr-3 flex flex-row items-center justify-between space-y-0 border-b", styles.headerBg)}>
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className={cn("h-7 w-7 rounded-md flex items-center justify-center shrink-0", styles.iconBg)}>
              <Icon className={cn("h-3.5 w-3.5", styles.iconText)} />
            </div>
          )}
          <div className="min-w-0">
            <CardTitle className="text-xs font-semibold text-foreground leading-tight">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

const EmptyRow = ({ colSpan, label = "No data to display" }: { colSpan: number; label?: string }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center text-xs text-muted-foreground py-8">
      {label}
    </TableCell>
  </TableRow>
);

const OnsiteProjectDetail = () => {
  const navigate = useNavigate();

  const [projectNumber, setProjectNumber] = useState("");
  const [status, setStatus] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [comment, setComment] = useState("");
  const [vehicleSelect, setVehicleSelect] = useState("");
  const [techSelect, setTechSelect] = useState("");

  type TechRow = { id: string; value: string; name: string; role: string; comment: string };
  const TECH_OPTIONS: Record<string, string> = {
    john: "John Doe",
    jane: "Jane Smith",
    mike: "Mike Wilson",
  };
  const [technicians, setTechnicians] = useState<TechRow[]>([]);
  const handleAddTech = () => {
    if (!techSelect) return;
    if (technicians.some(t => t.value === techSelect)) return;
    setTechnicians(prev => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        value: techSelect,
        name: TECH_OPTIONS[techSelect] ?? techSelect,
        role: "",
        comment: "",
      },
    ]);
    setTechSelect("");
  };
  const handleRemoveTech = (id: string) =>
    setTechnicians(prev => prev.filter(t => t.id !== id));
  const [editingTechId, setEditingTechId] = useState<string | null>(null);

  // Accounts state
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [acctDialogOpen, setAcctDialogOpen] = useState(false);
  const [acctForm, setAcctForm] = useState<{
    acct: string; jmLocation: string; division: string;
    startDate?: Date; endDate?: Date;
    poRcvd: string; confirmed: string;
  }>({ acct: "", jmLocation: "", division: "", poRcvd: "No", confirmed: "No" });

  const resetAcctForm = () =>
    setAcctForm({ acct: "", jmLocation: "", division: "", startDate: undefined, endDate: undefined, poRcvd: "No", confirmed: "No" });

  const handleAddAccount = () => {
    const trimmed = acctForm.acct.trim();
    if (!trimmed || !acctForm.jmLocation || !acctForm.division || !acctForm.startDate || !acctForm.endDate) return;
    const lookup = getAccountInfo(trimmed) ?? {
      sr: "—", osr: "—", customer: "—", rep: "—", cityState: "—",
    };
    setAccounts(prev => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        acct: trimmed,
        jmLocation: acctForm.jmLocation,
        division: acctForm.division,
        startDate: acctForm.startDate,
        endDate: acctForm.endDate,
        poRcvd: acctForm.poRcvd,
        confirmed: acctForm.confirmed,
        ...lookup,
      },
    ]);
    resetAcctForm();
    setAcctDialogOpen(false);
  };

  const removeAccount = (id: string) =>
    setAccounts(prev => prev.filter(a => a.id !== id));

  const acctFormValid =
    !!acctForm.acct.trim() && !!acctForm.jmLocation && !!acctForm.division &&
    !!acctForm.startDate && !!acctForm.endDate;

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
        <div className="w-full space-y-4">
          {/* Header strip: Project # + Status */}
          <Card>
            <CardContent className="p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Project #
                  </Label>
                  <Input
                    value={projectNumber}
                    onChange={(e) => setProjectNumber(e.target.value)}
                    placeholder="Auto-generated"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="checked-out">Checked Out</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accounts grid */}
          <SectionCard
            title="Accounts"
            action={
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => {
                  if (acctDialogOpen) { setAcctDialogOpen(false); resetAcctForm(); }
                  else { resetAcctForm(); setAcctDialogOpen(true); }
                }}
              >
                {acctDialogOpen ? <X className="h-3.5 w-3.5 mr-1" /> : <Plus className="h-3.5 w-3.5 mr-1" />}
                {acctDialogOpen ? "Close" : "Add Account"}
              </Button>
            }
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Acct #","SR #","OSR #","JM Location","Division","Customer","Rep","City, State","Start Date","End Date","PO Rcv'd","Confirmed",""].map((h, i) => (
                    <TableHead key={`${h}-${i}`} className="text-[11px] uppercase tracking-wide">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Inline add-account editor row */}
                {acctDialogOpen && (() => {
                  const lookup = getAccountInfo(acctForm.acct);
                  const placeholder = (v?: string) => v ?? "—";
                  return (
                    <TableRow className="bg-muted/30 hover:bg-muted/30 align-top">
                      <TableCell colSpan={3} className="py-2 min-w-[220px]">
                        <Input
                          autoFocus
                          value={acctForm.acct}
                          onChange={(e) => setAcctForm(s => ({ ...s, acct: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter" && acctFormValid) handleAddAccount(); }}
                          placeholder="2588.00"
                          className="h-8 text-sm px-2"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <Select
                          value={acctForm.jmLocation}
                          onValueChange={(v) => setAcctForm(s => ({ ...s, jmLocation: v }))}
                        >
                          <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baton Rouge">Baton Rouge</SelectItem>
                            <SelectItem value="Houston">Houston</SelectItem>
                            <SelectItem value="Dallas">Dallas</SelectItem>
                            <SelectItem value="Jackson">Jackson</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2">
                        <Select
                          value={acctForm.division}
                          onValueChange={(v) => setAcctForm(s => ({ ...s, division: v }))}
                        >
                          <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Calibration">Calibration</SelectItem>
                            <SelectItem value="Repair">Repair</SelectItem>
                            <SelectItem value="Field Service">Field Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2 text-xs text-muted-foreground">{placeholder(lookup?.customer)}</TableCell>
                      <TableCell className="py-2 text-xs text-muted-foreground">{placeholder(lookup?.rep)}</TableCell>
                      <TableCell className="py-2 text-xs text-muted-foreground">{placeholder(lookup?.cityState)}</TableCell>
                      <TableCell className="py-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-7 w-full justify-start text-xs font-normal px-2",
                                !acctForm.startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="h-3 w-3 mr-1.5" />
                              {acctForm.startDate ? format(acctForm.startDate, "MM/dd/yy") : "Pick"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={acctForm.startDate}
                              onSelect={(d) => setAcctForm(s => ({ ...s, startDate: d ?? undefined }))}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="py-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-7 w-full justify-start text-xs font-normal px-2",
                                !acctForm.endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="h-3 w-3 mr-1.5" />
                              {acctForm.endDate ? format(acctForm.endDate, "MM/dd/yy") : "Pick"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={acctForm.endDate}
                              onSelect={(d) => setAcctForm(s => ({ ...s, endDate: d ?? undefined }))}
                              disabled={(date) => acctForm.startDate ? date < acctForm.startDate : false}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="py-2">
                        <Select
                          value={acctForm.poRcvd}
                          onValueChange={(v) => setAcctForm(s => ({ ...s, poRcvd: v }))}
                        >
                          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2">
                        <Select
                          value={acctForm.confirmed}
                          onValueChange={(v) => setAcctForm(s => ({ ...s, confirmed: v }))}
                        >
                          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => { setAcctDialogOpen(false); resetAcctForm(); }}
                            aria-label="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-6 px-2 text-[11px] bg-green-600 hover:bg-green-700 text-white"
                            disabled={!acctFormValid}
                            onClick={handleAddAccount}
                          >
                            Add
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })()}

                {accounts.length === 0 && !acctDialogOpen ? (
                  <EmptyRow colSpan={13} />
                ) : (
                  accounts.map(row => (
                    <TableRow key={row.id} className="text-xs">
                      <TableCell className="py-2 font-medium">{row.acct}</TableCell>
                      <TableCell className="py-2">{row.sr}</TableCell>
                      <TableCell className="py-2">{row.osr}</TableCell>
                      <TableCell className="py-2">{row.jmLocation}</TableCell>
                      <TableCell className="py-2">{row.division}</TableCell>
                      <TableCell className="py-2">{row.customer}</TableCell>
                      <TableCell className="py-2">{row.rep}</TableCell>
                      <TableCell className="py-2">{row.cityState}</TableCell>
                      <TableCell className="py-2">{row.startDate ? format(row.startDate, "MM/dd/yyyy") : "—"}</TableCell>
                      <TableCell className="py-2">{row.endDate ? format(row.endDate, "MM/dd/yyyy") : "—"}</TableCell>
                      <TableCell className="py-2">
                        <Select
                          value={row.poRcvd}
                          onValueChange={(v) =>
                            setAccounts(prev => prev.map(a => a.id === row.id ? { ...a, poRcvd: v } : a))
                          }
                        >
                          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2">
                        <Select
                          value={row.confirmed}
                          onValueChange={(v) =>
                            setAccounts(prev => prev.map(a => a.id === row.id ? { ...a, confirmed: v } : a))
                          }
                        >
                          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeAccount(row.id)}
                          aria-label="Remove account"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex justify-end gap-2 px-3 py-2 border-t bg-muted/30">
              <Button size="sm" variant="outline" className="h-7 text-xs" disabled>Preview changes</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" disabled>Save changes</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" disabled>Cancel changes</Button>
            </div>
          </SectionCard>

          {/* Quotes */}
          <SectionCard title="Linked Quotes">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Quote #","Acct #","JM Location","Customer","Quote Status","Lab/ESL","Total"].map(h => (
                    <TableHead key={h} className="text-[11px] uppercase tracking-wide">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <EmptyRow colSpan={7} />
              </TableBody>
            </Table>
          </SectionCard>

          {/* WO Batches */}
          <SectionCard title="Work Order Batches">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["WO Batch","Acct #","JM Location","Division","Customer","Linked Quote","Total Lab Open","Total AR Count","Total Count"].map(h => (
                    <TableHead key={h} className="text-[11px] uppercase tracking-wide">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <EmptyRow colSpan={9} />
              </TableBody>
            </Table>
          </SectionCard>

          {/* Vehicles + Comment */}
          <Card>
            <CardHeader className="py-2.5 px-3 border-b">
              <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Vehicle & Comment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Vehicle Type
                  </Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="trailer">Trailer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                  Comment
                </Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Add project notes…"
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Technicians */}
          <SectionCard
            title="Technicians"
            action={
              <div className="flex items-center gap-2">
                <Select value={techSelect} onValueChange={setTechSelect}>
                  <SelectTrigger className="h-7 w-48 text-xs">
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="mike">Mike Wilson</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="h-7 text-xs" disabled={!techSelect} onClick={handleAddTech}>
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Add Tech
                </Button>
              </div>
            }
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[11px] uppercase tracking-wide">Technician</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Role</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Technician Comments</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technicians.length === 0 ? (
                  <EmptyRow colSpan={4} />
                ) : (
                  technicians.map((t) => {
                    const isEditing = editingTechId === t.id;
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="py-2 text-xs font-medium">{t.name}</TableCell>
                        <TableCell className="py-2">
                          {isEditing ? (
                            <Select
                              value={t.role}
                              onValueChange={(v) => setTechnicians(prev => prev.map(r => r.id === t.id ? { ...r, role: v } : r))}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Lead Technician">Lead Technician</SelectItem>
                                <SelectItem value="Training">Training</SelectItem>
                                <SelectItem value="Key Group">Key Group</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-xs">{t.role || <span className="text-muted-foreground">—</span>}</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2">
                          {isEditing ? (
                            <Input
                              value={t.comment}
                              onChange={(e) => setTechnicians(prev => prev.map(r => r.id === t.id ? { ...r, comment: e.target.value } : r))}
                              placeholder="Comments"
                              className="h-7 text-xs"
                            />
                          ) : (
                            <span className="text-xs">{t.comment || <span className="text-muted-foreground">—</span>}</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-0.5 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setEditingTechId(isEditing ? null : t.id)}
                              aria-label={isEditing ? "Save" : "Edit"}
                            >
                              {isEditing ? (
                                <Check className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveTech(t.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </SectionCard>

          {/* Comments meta */}
          <Card>
            <CardHeader className="py-2.5 px-3 border-b flex flex-row items-center gap-2 space-y-0">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Created By: </span>
                  <span>—</span>
                </div>
                <div className="sm:text-right">
                  <span className="font-medium text-foreground">Modified By: </span>
                  <span>—</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer actions — sticky inside content column so sidebar isn't overlapped */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background shadow-lg">
        <div className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-2">
          {/* Left: More actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 px-3 text-xs">
                  <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" />
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem className="text-xs">
                  <FileText className="h-3.5 w-3.5 mr-2" /> Report
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">
                  <BarChart3 className="h-3.5 w-3.5 mr-2" /> Value Report
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-destructive focus:text-destructive">
                  <X className="h-3.5 w-3.5 mr-2" /> Cancel Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: Cancel + Save (standard) */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/onsite-projects")}
              className="h-8 px-3 text-xs"
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 px-4 text-xs bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnsiteProjectDetail;
