import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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

  const toggleMatrix = (location: string, cap: string) => {
    setMatrix((prev) => ({
      ...prev,
      [location]: { ...prev[location], [cap]: !prev[location]?.[cap] },
    }));
  };

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Legacy-style subheader */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <div className="text-lg font-semibold tracking-tight">New Product Review</div>
              <div className="text-xs text-muted-foreground">
                Account: 8639.03 - Trescal Inc &nbsp;|&nbsp; Quote: 86355
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                Item Created by: Felicia N Cooper, 03/20/2026 08:17 AM
                <span className="mx-2">|</span>
                Item Modified by: Thomas W. Blouin, 03/20/2026 03:36 PM
              </div>
            </div>
            <Badge className="text-[10px] bg-yellow-400 text-black hover:bg-yellow-400">New</Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-9">
              <TabsTrigger value="details" className="text-xs px-4">
                PR Item Details
              </TabsTrigger>
              <TabsTrigger value="capable" className="text-xs px-4">
                Capable Locations
                <span className="ml-1.5 rounded bg-destructive px-1 text-[9px] text-white">NEW</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs px-4">
                Documents
              </TabsTrigger>
              <TabsTrigger value="hours" className="text-xs px-4">
                Hours
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              {/* Removed callout */}
              <div className="rounded border border-dashed border-destructive/50 bg-destructive/5 p-3 text-xs text-destructive/90">
                Removed from this view: <b>Location</b>, <b>Work to be Performed</b>, <b>Action Code</b>,{" "}
                <b>R&D</b>, the Capable Location checkbox grid, and the product-use box. Capable locations now live on their own tab.
              </div>

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

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">Documents tab — attach or view related files.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hours" className="mt-4">
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">Hours tab — track labor and time estimates.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Sticky footer actions */}
      <div className="sticky bottom-0 z-30 w-full border-t bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.06)] px-2 sm:px-4 lg:px-6 py-2">
        <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-products")}>
              <X className="h-3.5 w-3.5 mr-1.5" />
              Cancel
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Email Cust
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" />
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[12rem]">
                <DropdownMenuItem className="text-xs">To Lab Management</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">To Metrology</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">To Lead Tech</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Cancel Review</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Cannot Service</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Approve Capability</DropdownMenuItem>
                <DropdownMenuItem className="text-xs">Approve PR Completion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
