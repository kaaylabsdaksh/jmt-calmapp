import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  
  Save,
  X,
  Mail,
  MoreHorizontal,
  Check,
  AlertTriangle,
  Ban,
  ThumbsUp,
  FileText,
  Clock,
  MapPin,
  GripVertical,
  Upload,

} from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const CAPABILITY_COLUMNS = [
  "Calibration",
  "Limited Calibration",
  "Adjustment (in lab)",
  "17025 (Full)",
  "17025 (Limited)",
  "\"No\" 17025",
  "Send to Alternate Lab",
  "To Factory (Cal Outsource)",
  "Adjustment (To Factory)",
  "Repair (Full)",
  "Repair (Limited)",
  "Repair (No)",
  "Unserviceable",
];

const CAPABLE_LOCATIONS = [
  "Alexandria",
  "Baton Rouge",
  "Houston",
  "Round Rock",
  "Lafayette",
  "Beaumont",
  "Mobile",
  "Gonzales",
  "OnSite",
];

const LEGEND = [
  { term: "Calibration", def: "Full verification of UUT." },
  { term: "Limited Calibration", def: "Limited parameter verification of UUT, including un-adjustable and TAR <2:1." },
  { term: "Adjustment (in lab)", def: "Our ability to adjust in lab." },
  { term: "17025 (Full)", def: "Can accredit to UUT full range." },
  { term: "17025 (Limited)", def: "Can accredit to limited range of UUT." },
  { term: "\"No\" 17025", def: "Can not accredit UUT, parameters not on scope, may require outsourcing." },
  { term: "Send to Alternate Lab", def: "This lab must send it to another JM Test lab for calibration." },
  { term: "To Factory (Cal Outsource)", def: "We are not able to calibrate in any lab." },
  { term: "Adjustment (To Factory)", def: "We can \"calibrate\" but not \"adjust\" in lab." },
  { term: "Repair (Full)", def: "Can completely repair unit." },
  { term: "Repair (Limited)", def: "Can partially repair unit; certain repairs require to-factory/OEM service." },
  { term: "Repair (No)", def: "Can not repair; must go to factory/OEM for repair." },
  { term: "Unserviceable", def: "No OEM or alternate vendor to service this; parts/technical info unavailable." },
];

export default function NewProductReview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [docType, setDocType] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docFile, setDocFile] = useState("");
  const [docs, setDocs] = useState<
    { id: string; type: string; name: string; description: string; uploadedBy: string; uploadedDate: string }[]
  >([
    {
      id: "d1",
      type: "Other",
      name: "Belt Tension Checker Instruction Sheet.pdf",
      description: "Instruction sheet",
      uploadedBy: "Kevin R. Young",
      uploadedDate: "06/30/2021",
    },
  ]);

  const [workPerformed, setWorkPerformed] = useState("");
  const [hoursInput, setHoursInput] = useState("");
  const [hoursEntries, setHoursEntries] = useState<
    { id: string; name: string; date: string; hours: number; workPerformed: string }[]
  >([]);


  const toggleMatrix = (location: string, cap: string) => {
    setMatrix((prev) => ({
      ...prev,
      [location]: { ...prev[location], [cap]: !prev[location]?.[cap] },
    }));
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <ModernTopNav />
      <main className="flex-1 w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Legacy-style subheader */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <div className="text-lg font-semibold tracking-tight">New Product Review</div>
              <div className="text-xs text-muted-foreground">
                <Link to="/manage-customers/8639" className="hover:text-primary hover:underline">
                  Account: 8639.03 - Trescal Inc
                </Link>
                <span className="mx-2">|</span>
                <Link to="/quotes/86355" className="hover:text-primary hover:underline">
                  Quote: 86355
                </Link>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">
              Item Created by: Felicia N Cooper, 03/20/2026 08:17 AM
              <span className="mx-2">|</span>
              Item Modified by: Thomas W. Blouin, 03/20/2026 03:36 PM
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-9">
              <TabsTrigger value="details" className="text-xs px-4">
                PR Item Details
              </TabsTrigger>
              <TabsTrigger value="capable" className="text-xs px-4">
                Capable Locations
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs px-4">
                Documents
              </TabsTrigger>
              <TabsTrigger value="hours" className="text-xs px-4">
                Hours
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-foreground border-b pb-1">Item Identification</div>
                      <FieldRow label="PR Item #" value="PR18917-001" readOnly />
                      <FieldRow label="Due Date" value="03/21/2026" />
                      <FieldRow label="PR Item Status" value="Lab Management" />
                      <FieldRow label="Division" value="Lab" />

                      <div className="text-xs font-semibold text-foreground border-b pb-1 pt-2">Product</div>
                      <FieldRow label="Manufacturer" value="AMTI" />
                      <FieldRow label="Model" value="MC3A-500" />
                      <FieldRow label="Description" value="LOAD CELL" />
                      <FieldRow label="Lab Code" />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-foreground border-b pb-1">Specification</div>
                      <FieldRow label="Accuracy" />
                      <FieldRow label="Range" />
                      <FieldRow label="Option" />
                      <FieldRow label="Category 4" />
                      <FieldRow label="Category 5" />
                      <FieldRow label="Category 6" />

                      <div className="text-xs font-semibold text-foreground border-b pb-1 pt-2">
                        Physical Dimensions
                        <span className="ml-2 rounded bg-yellow-400 px-1 text-[9px] text-black">NEW</span>
                      </div>
                      <FieldRow label="Weight" placeholder="lb" />
                      <FieldRow label="Height" placeholder="in" />
                      <FieldRow label="Width" placeholder="in" />
                      <FieldRow label="Depth" placeholder="in" />
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-foreground border-b pb-1">Accreditation & Cost</div>
                      <CheckboxRow label="Requested 17025" />
                      <FieldRow label="Accredited Cal" />
                      <FieldRow label="Cal/Cert Cost" value="0.00" />
                      <FieldRow label="Est. Cert. Time" placeholder="hrs">
                        <span className="ml-2 rounded bg-yellow-400 px-1 text-[9px] text-black">NEW</span>
                      </FieldRow>
                      <CheckboxRow label="Override Zero Price" />
                      <CheckboxRow label="Equipment at JM" />

                      <div className="text-xs font-semibold text-foreground border-b pb-1 pt-2">
                        Servicing Readiness
                        <span className="ml-2 rounded bg-yellow-400 px-1 text-[9px] text-black">NEW</span>
                      </div>
                      <CheckboxRow label="Procedure" />
                      <CheckboxRow label="Template" />
                      <CheckboxRow label="Automation Available" />
                    </div>
                  </div>
                </CardContent>
              </Card>


                {/* Log table */}
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="text-[11px] font-semibold">Dept/Area</TableHead>
                          <TableHead className="text-[11px] font-semibold">Date Sent</TableHead>
                          <TableHead className="text-[11px] font-semibold">Ack</TableHead>
                          <TableHead className="text-[11px] font-semibold">Ack Date</TableHead>
                          <TableHead className="text-[11px] font-semibold">Ack User</TableHead>
                          <TableHead className="text-[11px] font-semibold">Completed</TableHead>
                          <TableHead className="text-[11px] font-semibold">Completed Date</TableHead>
                          <TableHead className="text-[11px] font-semibold">Completed User</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-xs">Lab Management</TableCell>
                          <TableCell className="text-xs">03/20/2026 03:36 PM</TableCell>
                          <TableCell className="text-xs" />
                          <TableCell className="text-xs" />
                          <TableCell className="text-xs" />
                          <TableCell className="text-xs" />
                          <TableCell className="text-xs" />
                          <TableCell className="text-xs" />
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs">Lab Management</TableCell>
                          <TableCell className="text-xs">03/20/2026 08:17 AM</TableCell>
                          <TableCell className="text-xs" />
                          <TableCell className="text-xs">03/20/2026 03:36 PM</TableCell>
                          <TableCell className="text-xs">Thomas W. Blouin</TableCell>
                          <TableCell className="text-xs" />
                          <TableCell className="text-xs">03/20/2026 03:36 PM</TableCell>
                          <TableCell className="text-xs">Thomas W. Blouin</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="capable" className="mt-4 space-y-4">
              <div className="rounded border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
                Capable locations are tracked per PR item. Check the boxes that apply to this specific product review.
              </div>
              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="text-[11px] font-semibold whitespace-nowrap">Capable Location</TableHead>
                        {CAPABILITY_COLUMNS.map((cap) => (
                          <TableHead
                            key={cap}
                            className="text-[10px] font-semibold text-center vertical-text"
                            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", minWidth: "2.5rem" }}
                          >
                            {cap}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CAPABLE_LOCATIONS.map((loc) => (
                        <TableRow key={loc}>
                          <TableCell className="text-xs font-medium bg-muted/30">{loc}</TableCell>
                          {CAPABILITY_COLUMNS.map((cap) => (
                            <TableCell key={cap} className="text-center p-2">
                              <Checkbox
                                checked={!!matrix[loc]?.[cap]}
                                onCheckedChange={() => toggleMatrix(loc, cap)}
                                className="h-4 w-4"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-xs font-semibold text-foreground mb-2">Breakdown of Matrix (Definitions)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    {LEGEND.map((l) => (
                      <div key={l.term} className="flex gap-2">
                        <span className="font-semibold whitespace-nowrap">{l.term}:</span>
                        <span className="text-muted-foreground">{l.def}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">** Onsite capabilities are influenced by the supporting lab.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4 space-y-4">
              {/* Upload document card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
                      <FileText className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Add Document</h3>
                      <p className="text-[10px] text-muted-foreground">Upload supporting files for this product review.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium text-muted-foreground">Document Type</Label>
                      <Select value={docType} onValueChange={setDocType}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {["Other", "Instruction Sheet", "Manual", "Datasheet", "Quote", "Certificate", "Email"].map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium text-muted-foreground">Description</Label>
                      <Input
                        className="h-8 text-xs"
                        value={docDescription}
                        onChange={(e) => setDocDescription(e.target.value)}
                        placeholder="Brief description..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium text-muted-foreground">Select File</Label>
                      <label
                        htmlFor="pr-doc-file"
                        className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2 text-xs cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium shrink-0">
                          <Upload className="h-3 w-3" />
                          Browse
                        </span>
                        <span className={cn("truncate", !docFile && "text-muted-foreground")}>
                          {docFile || "No file selected"}
                        </span>
                        <input
                          id="pr-doc-file"
                          type="file"
                          className="sr-only"
                          onChange={(e) => setDocFile(e.target.files?.[0]?.name ?? "")}
                        />
                      </label>
                    </div>

                    <Button
                      size="sm"
                      className="h-8 text-xs bg-success text-success-foreground hover:bg-success/90 w-full"
                      disabled={!docType || !docFile}
                      onClick={() => {
                        setDocs((prev) => [
                          ...prev,
                          {
                            id: `${Date.now()}`,
                            type: docType,
                            name: docFile,
                            description: docDescription,
                            uploadedBy: "Jay R Jackson",
                            uploadedDate: new Date().toLocaleDateString("en-US"),
                          },
                        ]);
                        setDocType("");
                        setDocDescription("");
                        setDocFile("");
                      }}
                    >
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Attached documents card */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">Attached Documents</h3>
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                        {docs.length}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="h-8 text-[11px] px-3 font-semibold">Type</TableHead>
                          <TableHead className="h-8 text-[11px] px-3 font-semibold">Document</TableHead>
                          <TableHead className="h-8 text-[11px] px-3 font-semibold">Description</TableHead>
                          <TableHead className="h-8 text-[11px] px-3 font-semibold">Uploaded By</TableHead>
                          <TableHead className="h-8 text-[11px] px-3 font-semibold">Uploaded Date</TableHead>
                          <TableHead className="h-8 text-[11px] px-3 w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {docs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                              <p className="text-xs text-muted-foreground">No documents attached.</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Upload a document to attach it to this review.</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          docs.map((d) => (
                            <TableRow key={d.id} className="group">
                              <TableCell className="text-[11px] px-3 py-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-[10px] font-medium">
                                  {d.type}
                                </span>
                              </TableCell>
                              <TableCell className="text-[11px] px-3 py-2">
                                <button className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2">
                                  {d.name}
                                </button>
                              </TableCell>
                              <TableCell className="text-[11px] px-3 py-2 text-muted-foreground">{d.description}</TableCell>
                              <TableCell className="text-[11px] px-3 py-2">{d.uploadedBy}</TableCell>
                              <TableCell className="text-[11px] px-3 py-2 text-muted-foreground">{d.uploadedDate}</TableCell>
                              <TableCell className="text-[11px] px-3 py-2 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setDocs((prev) => prev.filter((x) => x.id !== d.id))}
                                >
                                  <X className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-muted-foreground bg-muted/30">
                    <span>Showing {docs.length} record{docs.length === 1 ? "" : "s"}</span>
                    <span>Page 1 of 1</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="hours" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: input form */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
                          <Clock className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">Add Hours</h3>
                          <p className="text-[10px] text-muted-foreground">Record work performed and time spent.</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-medium text-muted-foreground">Work Performed</Label>
                        <Textarea
                          value={workPerformed}
                          onChange={(e) => setWorkPerformed(e.target.value)}
                          className="min-h-[100px] text-xs resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-medium text-muted-foreground">Hours</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={hoursInput}
                          onChange={(e) => setHoursInput(e.target.value)}
                          className="h-7 text-xs w-32"
                        />
                      </div>

                      <Button
                        size="sm"
                        className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          const h = parseFloat(hoursInput);
                          if (!isNaN(h) && h > 0) {
                            setHoursEntries((prev) => [
                              ...prev,
                              {
                                id: Math.random().toString(36).slice(2),
                                name: "Admin User",
                                date: new Date().toLocaleString("en-US", {
                                  month: "2-digit",
                                  day: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }),
                                hours: h,
                                workPerformed,
                              },
                            ]);
                            setWorkPerformed("");
                            setHoursInput("");
                          }
                        }}
                      >
                        Add Hours
                      </Button>
                    </div>

                    {/* Right: entries table */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold">Hours Log</div>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="text-[10px] h-7">Name</TableHead>
                              <TableHead className="text-[10px] h-7">Date</TableHead>
                              <TableHead className="text-[10px] h-7 text-right">Hours</TableHead>
                              <TableHead className="text-[10px] h-7">Work Performed</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {hoursEntries.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center text-xs text-muted-foreground h-20">
                                  No data to display
                                </TableCell>
                              </TableRow>
                            ) : (
                              hoursEntries.map((entry) => (
                                <TableRow key={entry.id} className="h-7">
                                  <TableCell className="text-[11px] py-1">{entry.name}</TableCell>
                                  <TableCell className="text-[11px] py-1">{entry.date}</TableCell>
                                  <TableCell className="text-[11px] py-1 text-right">{entry.hours.toFixed(2)}</TableCell>
                                  <TableCell className="text-[11px] py-1 max-w-[180px] truncate" title={entry.workPerformed}>
                                    {entry.workPerformed}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-muted-foreground">Entries: {hoursEntries.length}</span>
                        <span className="font-semibold">
                          {hoursEntries.reduce((sum, e) => sum + e.hours, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Sticky footer actions */}
      <div className="sticky bottom-0 z-30 w-full border-t bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.06)] px-2 sm:px-4 lg:px-6 py-2">
        <div className="flex items-center justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" />
                More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[12rem]">
              <DropdownMenuItem className="text-xs">To Lab Management</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">To Metrology</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">To Lead Tech</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Cancel Review</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Cannot Service</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Approve Capability</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Approve PR Completion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-products")}>
              <X className="h-3.5 w-3.5 mr-1.5" />
              Cancel
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Email Cust
            </Button>
            <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({
  label,
  value,
  placeholder,
  readOnly,
  children,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className="w-36 text-[11px] font-medium text-right shrink-0">
        {label}
        {children}
      </Label>
      <Input
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn("h-7 text-xs", readOnly && "bg-muted/30")}
      />
    </div>
  );
}

function CheckboxRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Label className="w-36 text-[11px] font-medium text-right shrink-0">{label}</Label>
      <Checkbox className="h-4 w-4" />
    </div>
  );
}
