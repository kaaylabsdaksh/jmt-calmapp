import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Save, FileText, BarChart3, Plus, X, Truck, UserPlus, MessageSquare, MoreHorizontal, CalendarIcon, Trash2 } from "lucide-react";
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

// Mock account lookup — used to pre-populate the rest of the row
const accountLookup: Record<string, { sr: string; osr: string; customer: string; rep: string; cityState: string }> = {
  "2588.00":  { sr: "SR-1001", osr: "OSR-22", customer: "John Deere", rep: "Christian B. ONeal", cityState: "Baton Rouge, LA" },
  "10323.00": { sr: "SR-1042", osr: "OSR-31", customer: "Sabal Trail Transmission LLC", rep: "Jerome J. Davis", cityState: "Houston, TX" },
  "0185.12":  { sr: "SR-0987", osr: "OSR-14", customer: "Entergy Mississippi LLC", rep: "Vincent E. Lloyde", cityState: "Jackson, MS" },
  "1790.00":  { sr: "SR-1120", osr: "OSR-08", customer: "Shintech", rep: "Vincent E. Lloyde", cityState: "Plaquemine, LA" },
  "4051.00":  { sr: "SR-1135", osr: "OSR-19", customer: "Pinnacle Polymers", rep: "Lucas M Roberts", cityState: "Garyville, LA" },
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


const SectionCard = ({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="py-2.5 px-3 flex flex-row items-center justify-between space-y-0 border-b">
      <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </CardTitle>
      {action}
    </CardHeader>
    <CardContent className="p-0">{children}</CardContent>
  </Card>
);

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
    const lookup = accountLookup[trimmed] ?? {
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
                  const lookup = accountLookup[acctForm.acct.trim()];
                  const placeholder = (v?: string) => v ?? "—";
                  return (
                    <TableRow className="bg-muted/30 hover:bg-muted/30 align-top">
                      <TableCell className="py-2">
                        <Input
                          autoFocus
                          value={acctForm.acct}
                          onChange={(e) => setAcctForm(s => ({ ...s, acct: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter" && acctFormValid) handleAddAccount(); }}
                          placeholder="e.g. 2588.00"
                          className="h-7 text-xs"
                        />
                      </TableCell>
                      <TableCell className="py-2 text-xs text-muted-foreground">{placeholder(lookup?.sr)}</TableCell>
                      <TableCell className="py-2 text-xs text-muted-foreground">{placeholder(lookup?.osr)}</TableCell>
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
                      <TableCell className="py-2 text-xs text-muted-foreground">No</TableCell>
                      <TableCell className="py-2 text-xs text-muted-foreground">No</TableCell>
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
                      <TableCell className="py-2">{row.poRcvd}</TableCell>
                      <TableCell className="py-2">{row.confirmed}</TableCell>
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
          <SectionCard
            title="Linked Quotes"
            action={
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Link Quote
              </Button>
            }
          >
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
          <SectionCard
            title="Work Order Batches"
            action={
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Link Batch
              </Button>
            }
          >
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
                <Button size="sm" variant="outline" className="h-7 text-xs">
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
                <EmptyRow colSpan={4} />
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
                <DropdownMenuItem className="text-xs">
                  <Truck className="h-3.5 w-3.5 mr-2" /> Add Vehicle
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">
                  <UserPlus className="h-3.5 w-3.5 mr-2" /> Add Tech
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
