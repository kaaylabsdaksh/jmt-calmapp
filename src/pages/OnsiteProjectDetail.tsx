import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileText, BarChart3, Plus, X, Truck, UserPlus, MessageSquare, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import ModernTopNav from "@/components/modern/ModernTopNav";

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

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-6 pb-24">
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
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Account
              </Button>
            }
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Acct #","SR #","OSR #","JM Location","Division","Customer","Rep","City, State","Start Date","End Date","PO Rcv'd","Confirmed"].map(h => (
                    <TableHead key={h} className="text-[11px] uppercase tracking-wide">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <EmptyRow colSpan={12} />
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

      {/* Sticky footer actions — standardized layout */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background shadow-lg">
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
