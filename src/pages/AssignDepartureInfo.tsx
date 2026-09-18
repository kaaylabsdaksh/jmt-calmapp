import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Info, Menu, Search, Truck } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

type DepartureType = "JM Driver Dropoff" | "Customer Pickup" | "Customer Surplus" | "Shipped";

interface DepartureRecord {
  id: string;
  workOrder: string;
  reportNumber: string;
  division: string;
  location: string;
  manufacturer: string;
  modelNumber: string;
  arrivalDate: string;
  certCompleteDate: string;
  accountNumber: string;
  customerName: string;
  departureDate?: string;
  departureType?: DepartureType;
  shipType?: string;
  trackingNumber?: string;
}

const INITIAL_RECORDS: DepartureRecord[] = [
  {
    id: "1",
    workOrder: "586989",
    reportNumber: "8928.15-586989-001",
    division: "Regular",
    location: "BR",
    manufacturer: "3D INSTRUMENTS",
    modelNumber: "-30\"Hg-0",
    arrivalDate: "09/01/2026",
    certCompleteDate: "",
    accountNumber: "8928.15",
    customerName: "Northrop Grumman",
  },
  {
    id: "2",
    workOrder: "586989",
    reportNumber: "8928.15-586989-002",
    division: "Regular",
    location: "BR",
    manufacturer: "FLUKE",
    modelNumber: "789",
    arrivalDate: "09/01/2026",
    certCompleteDate: "09/17/2026",
    accountNumber: "8928.15",
    customerName: "Northrop Grumman",
  },
  {
    id: "3",
    workOrder: "803589",
    reportNumber: "0101.00-803589-002",
    division: "Regular",
    location: "BR",
    manufacturer: "FLUKE",
    modelNumber: "789",
    arrivalDate: "09/04/2026",
    certCompleteDate: "09/16/2026",
    accountNumber: "0101.00",
    customerName: "JM Test Systems",
  },
];

const toDisplayDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).format(value);

const AssignDepartureInfo = () => {
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState("586989");
  const [searchedWorkOrder, setSearchedWorkOrder] = useState("");
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [departureType, setDepartureType] = useState<DepartureType | "">("");
  const [shipType, setShipType] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const results = useMemo(
    () => records.filter((record) => record.workOrder === searchedWorkOrder),
    [records, searchedWorkOrder]
  );
  const allSelected = results.length > 0 && results.every((record) => selectedIds.includes(record.id));

  const searchWorkOrder = () => {
    const value = workOrder.trim();
    if (!value) {
      toast({ title: "Enter a work order number.", variant: "destructive" });
      return;
    }
    setSearchedWorkOrder(value);
    setSelectedIds([]);
  };

  const toggleRow = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    );
  };

  const assignDeparture = () => {
    if (selectedIds.length === 0) {
      toast({ title: "Select at least one work order item.", variant: "destructive" });
      return;
    }
    if (!departureDate || !departureType) {
      toast({ title: "Departure date and type are required.", variant: "destructive" });
      return;
    }
    if (departureType === "Shipped" && (!shipType || !trackingNumber.trim())) {
      toast({ title: "Shipping method and tracking number are required.", variant: "destructive" });
      return;
    }

    const formattedDate = toDisplayDate(departureDate);
    setRecords((current) =>
      current.map((record) =>
        selectedIds.includes(record.id)
          ? {
              ...record,
              departureDate: formattedDate,
              departureType,
              shipType: departureType === "Shipped" ? shipType : undefined,
              trackingNumber: departureType === "Shipped" ? trackingNumber.trim() : undefined,
            }
          : record
      )
    );
    toast({
      title: "Departure information assigned",
      description: `${selectedIds.length} item${selectedIds.length === 1 ? "" : "s"} updated.`,
    });
  };

  return (
    <div className="flex min-h-full flex-col bg-muted/20">
      <ModernTopNav />

      <main className="flex-1 space-y-3 px-3 py-4 sm:px-5 lg:px-6">
        <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-foreground" />
              <h2 className="text-sm font-semibold">Departure Assignment</h2>
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[minmax(280px,0.8fr)_minmax(500px,1.4fr)]">
            <div className="space-y-1.5">
              <Label htmlFor="departure-work-order" className="text-xs font-medium">
                Work Order #
              </Label>
              <div className="flex gap-2">
                <Input
                  id="departure-work-order"
                  value={workOrder}
                  onChange={(event) => setWorkOrder(event.target.value.replace(/\D/g, ""))}
                  onKeyDown={(event) => event.key === "Enter" && searchWorkOrder()}
                  placeholder="Enter WO #"
                  className="h-8"
                />
                <Button type="button" size="sm" className="h-8 bg-info text-info-foreground hover:bg-info/90" onClick={searchWorkOrder}>
                  <Search className="mr-1.5 h-3.5 w-3.5" />
                  Search
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-1.5">
                <Label htmlFor="departure-date" className="text-xs font-medium">
                  Date <span className="text-destructive">*</span>
                </Label>
                <ModernDatePicker id="departure-date" value={departureDate} onChange={setDepartureDate} size="md" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Type <span className="text-destructive">*</span></Label>
                <Select
                  value={departureType}
                  onValueChange={(value: DepartureType) => {
                    setDepartureType(value);
                    if (value !== "Shipped") {
                      setShipType("");
                      setTrackingNumber("");
                    }
                  }}
                >
                  <SelectTrigger className="h-8"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JM Driver Dropoff">JM Driver Dropoff</SelectItem>
                    <SelectItem value="Customer Pickup">Customer Pickup</SelectItem>
                    <SelectItem value="Customer Surplus">Customer Surplus</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {departureType === "Shipped" && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Shipping Method <span className="text-destructive">*</span></Label>
                    <Select value={shipType} onValueChange={setShipType}>
                      <SelectTrigger className="h-8"><SelectValue placeholder="Select method" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="FedEx">FedEx</SelectItem>
                        <SelectItem value="UPS">UPS</SelectItem>
                        <SelectItem value="USPS">USPS</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tracking-number" className="text-xs font-medium">Tracking Number <span className="text-destructive">*</span></Label>
                    <Input id="tracking-number" value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} placeholder="Enter tracking #" className="h-8" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2 border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Assign applies the selected departure information to every checked item.
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-4 py-2.5">
            <div>
              <h2 className="text-sm font-semibold">Work Order Items</h2>
              <p className="text-xs text-muted-foreground">
                {searchedWorkOrder ? `Results for WO #${searchedWorkOrder}` : "Search for a work order to view its items."}
              </p>
            </div>
            {results.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setSelectedIds(results.map((record) => record.id))}>Select all</Button>
                <span className="text-muted-foreground">·</span>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setSelectedIds([])}>Clear all</Button>
              </div>
            )}
          </div>

          {searchedWorkOrder && results.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <Search className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-medium">No work order items found</p>
              <p className="mt-1 text-xs text-muted-foreground">Check the work order number and search again.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-14 text-center text-sm text-muted-foreground">Enter a work order number to begin.</div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-muted/40">
                    <TableHead className="h-8 w-10 px-3">
                      <Checkbox
                        aria-label="Select all work order items"
                        checked={allSelected}
                        onCheckedChange={(checked) => setSelectedIds(checked ? results.map((record) => record.id) : [])}
                      />
                    </TableHead>
                    <TableHead className="h-8 px-2 text-xs">Report Number</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Division</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Location</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Manufacturer</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Model Number</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Arrival Date</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Cert/Comp Date</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Acct #</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Customer Name</TableHead>
                    <TableHead className="h-8 px-2 text-xs">Departure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((record) => (
                    <TableRow key={record.id} data-state={selectedIds.includes(record.id) ? "selected" : undefined}>
                      <TableCell className="w-10 px-3 py-2">
                        <Checkbox aria-label={`Select ${record.reportNumber}`} checked={selectedIds.includes(record.id)} onCheckedChange={() => toggleRow(record.id)} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-2 text-xs font-medium text-info">{record.reportNumber}</TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-2 text-xs">{record.division}</TableCell>
                      <TableCell className="px-2 py-2 text-xs">{record.location}</TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-2 text-xs">{record.manufacturer}</TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-2 text-xs">{record.modelNumber}</TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-2 text-xs tabular-nums">{record.arrivalDate}</TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-2 text-xs tabular-nums">{record.certCompleteDate || "—"}</TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-2 text-xs">{record.accountNumber}</TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-2 text-xs">{record.customerName}</TableCell>
                      <TableCell className="min-w-40 px-2 py-2 text-xs">
                        {record.departureType ? (
                          <div className="flex items-start gap-1.5">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                            <span>
                              <span className="font-medium">{record.departureType}</span>
                              <span className="block text-muted-foreground">
                                {record.departureDate}{record.trackingNumber ? ` · ${record.trackingNumber}` : ""}
                              </span>
                            </span>
                          </div>
                        ) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
                <span>{selectedIds.length} selected</span>
                <span>{results.length} {results.length === 1 ? "record" : "records"}</span>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="sticky bottom-0 z-30 flex h-12 items-center justify-between gap-3 border-t bg-background px-3 shadow-sm sm:px-6">
        <Button variant="outline" size="sm" className="h-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 bg-success text-success-foreground hover:bg-success/90" onClick={assignDeparture}>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Assign
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default AssignDepartureInfo;