import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StandardTopNav from "@/components/shared/StandardTopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  RotateCcw,
  RefreshCw,
  Download,
  Settings2,
  Truck,
  FileText,
  Eye,
  Trash2,
  Plus,
  Receipt,
  UserCog,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";


type SelectedRecord = {
  id: string;
  woNumber: string;
  accountNumber: string;
  customer: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  invoiceNumber: string;
  deliveryType: string;
};

type ReportRow = {
  id: string;
  invoiceDate: string;
  reportName: string;
  generatedBy: string;
  status: "Generated" | "Processing" | "Failed";
};

const MOCK_REPORTS: ReportRow[] = [
  {
    id: "r1",
    invoiceDate: "2026-07-10",
    reportName: "DT_20260710_001.pdf",
    generatedBy: "sarah.miller",
    status: "Generated",
  },
  {
    id: "r2",
    invoiceDate: "2026-07-09",
    reportName: "DT_20260709_014.pdf",
    generatedBy: "john.parker",
    status: "Generated",
  },
  {
    id: "r3",
    invoiceDate: "2026-07-08",
    reportName: "DT_20260708_007.pdf",
    generatedBy: "lisa.chen",
    status: "Processing",
  },
  {
    id: "r4",
    invoiceDate: "2026-07-05",
    reportName: "DT_20260705_003.pdf",
    generatedBy: "mike.davis",
    status: "Failed",
  },
];

const reportStatusStyles: Record<ReportRow["status"], string> = {
  Generated: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  Failed: "bg-red-100 text-red-800 border-red-200",
};

const defaultFilters = {
  woNumber: "",
  accountNumber: "",
  location: "all",
  manufacturer: "",
  createdFrom: "",
  woStatus: "all",
  customerName: "",
  division: "all",
  modelNumber: "",
  createdTo: "",
  itemStatus: "all",
  customerGroup: "all",
  invoiceNumber: "",
  poNumber: "",
  allUsers: false,
};

export default function DeliveryTickets() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(defaultFilters);
  const [type, setType] = useState("standard");
  const [collectionAccount, setCollectionAccount] = useState("");
  const [additionalShipTo, setAdditionalShipTo] = useState("");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<SelectedRecord[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const updateFilter = <K extends keyof typeof filters>(k: K, v: (typeof filters)[K]) =>
    setFilters((p) => ({ ...p, [k]: v }));

  const clearFilters = () => setFilters(defaultFilters);

  const addToFile = () => {
    if (!collectionAccount.trim()) {
      toast.error("Collection Account is required");
      return;
    }
    const nextId = `wo-${records.length + 1}`;
    setRecords((prev) => [
      ...prev,
      {
        id: nextId,
        woNumber: `WO-${1000 + prev.length + 1}`,
        accountNumber: collectionAccount,
        customer: filters.customerName || "New Customer",
        manufacturer: filters.manufacturer || "—",
        model: filters.modelNumber || "—",
        serialNumber: `SN-${Math.floor(Math.random() * 90000 + 10000)}`,
        invoiceNumber: filters.invoiceNumber || "—",
        deliveryType: type,
      },
    ]);
    toast.success("Record added to processing file");
  };

  const removeRecord = (id: string) =>
    setRecords((prev) => prev.filter((r) => r.id !== id));

  const processTickets = () => {
    if (records.length === 0) {
      toast.error("No Records Selected");
      return;
    }
    setConfirmOpen(false);
    // Simulate processing
    setTimeout(() => {
      toast.success("Delivery Tickets Generated Successfully");
      setRecords([]);
    }, 400);
  };

  const filteredReports = useMemo(() => {
    const q = reportSearch.trim().toLowerCase();
    let list = MOCK_REPORTS.filter(
      (r) =>
        !q ||
        r.reportName.toLowerCase().includes(q) ||
        r.generatedBy.toLowerCase().includes(q)
    );
    list = [...list].sort((a, b) =>
      sortDir === "asc"
        ? a.invoiceDate.localeCompare(b.invoiceDate)
        : b.invoiceDate.localeCompare(a.invoiceDate)
    );
    return list;
  }, [reportSearch, sortDir]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-40">
        <StandardTopNav
          title="Delivery Tickets"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Invoicing", href: "/invoicing" },
            { label: "Delivery Tickets" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3 p-3 md:p-4 flex-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Delivery Tickets
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl">
              Search eligible work orders, prepare delivery ticket details,
              process delivery tickets, and review generated delivery ticket
              reports.
            </p>
          </div>
        </div>

        {/* Search & Filter Card */}
        <Card>
          <CardHeader className="pb-1.5 pt-2 px-3">
            <CardTitle className="text-xs">Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-2 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-2 gap-y-1.5">
              <FilterField label="WO Number">
                <Input
                  className="h-7 text-xs"
                  value={filters.woNumber}
                  onChange={(e) => updateFilter("woNumber", e.target.value)}
                />
              </FilterField>
              <FilterField label="Account Number">
                <Input
                  className="h-7 text-xs"
                  value={filters.accountNumber}
                  onChange={(e) =>
                    updateFilter("accountNumber", e.target.value)
                  }
                />
              </FilterField>
              <FilterField label="Location">
                <Select
                  value={filters.location}
                  onValueChange={(v) => updateFilter("location", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
                    <SelectItem value="houston">Houston</SelectItem>
                    <SelectItem value="norco">Norco</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Manufacturer">
                <Input
                  className="h-7 text-xs"
                  value={filters.manufacturer}
                  onChange={(e) => updateFilter("manufacturer", e.target.value)}
                />
              </FilterField>
              <FilterField label="Created From">
                <ModernDatePicker
                  size="sm"
                  value={filters.createdFrom}
                  onChange={(d) =>
                    updateFilter(
                      "createdFrom",
                      d ? d.toISOString().slice(0, 10) : ""
                    )
                  }
                />
              </FilterField>


              <FilterField label="WO Status">
                <Select
                  value={filters.woStatus}
                  onValueChange={(v) => updateFilter("woStatus", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Customer Name">
                <Input
                  className="h-7 text-xs"
                  value={filters.customerName}
                  onChange={(e) => updateFilter("customerName", e.target.value)}
                />
              </FilterField>
              <FilterField label="Division">
                <Select
                  value={filters.division}
                  onValueChange={(v) => updateFilter("division", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="field">Field</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Model Number">
                <Input
                  className="h-7 text-xs"
                  value={filters.modelNumber}
                  onChange={(e) => updateFilter("modelNumber", e.target.value)}
                />
              </FilterField>
              <FilterField label="Created To">
                <ModernDatePicker
                  size="sm"
                  value={filters.createdTo}
                  onChange={(d) =>
                    updateFilter(
                      "createdTo",
                      d ? d.toISOString().slice(0, 10) : ""
                    )
                  }
                />
              </FilterField>


              <FilterField label="Item Status">
                <Select
                  value={filters.itemStatus}
                  onValueChange={(v) => updateFilter("itemStatus", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Customer Group">
                <Select
                  value={filters.customerGroup}
                  onValueChange={(v) => updateFilter("customerGroup", v)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="chemical">Chemical</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Invoice Number">
                <Input
                  className="h-7 text-xs"
                  value={filters.invoiceNumber}
                  onChange={(e) =>
                    updateFilter("invoiceNumber", e.target.value)
                  }
                />
              </FilterField>
              <FilterField label="PO Number">
                <Input
                  className="h-7 text-xs"
                  value={filters.poNumber}
                  onChange={(e) => updateFilter("poNumber", e.target.value)}
                />
              </FilterField>
              <div className="flex items-end pb-1">
                <label className="inline-flex items-center gap-1.5 text-xs text-foreground">
                  <Checkbox
                    checked={filters.allUsers}
                    onCheckedChange={(v) =>
                      updateFilter("allUsers", Boolean(v))
                    }
                  />
                  All Users
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" className="text-xs h-7">
                <Search className="h-3 w-3 mr-1" />
                Search
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={clearFilters}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Delivery Ticket Details Card */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm">Delivery Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FilterField label="Type">
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="rush">Rush</SelectItem>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
              <FilterField label="Collection Account" required>
                <Input
                  className="h-9"
                  value={collectionAccount}
                  onChange={(e) => setCollectionAccount(e.target.value)}
                  placeholder="Enter collection account"
                />
              </FilterField>
              <FilterField label="Additional Ship To Info">
                <Textarea
                  rows={2}
                  value={additionalShipTo}
                  onChange={(e) => setAdditionalShipTo(e.target.value)}
                  placeholder="Extra address details, contact, dock info..."
                />
              </FilterField>
              <FilterField label="Notes / Comments">
                <Textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes for this delivery ticket batch"
                />
              </FilterField>
            </div>
            <div className="flex justify-end">
              <Button size="sm" className="text-xs h-8" onClick={addToFile}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add to File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Delivery Ticket Reports */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm">
              Recent Delivery Ticket Reports
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              View or download previously generated delivery ticket PDFs.
            </p>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  className="pl-7 h-8 w-52 text-xs"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8"
                onClick={() =>
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                }
              >
                Sort by Invoice Date ({sortDir === "asc" ? "Asc" : "Desc"})
              </Button>
            </div>
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-muted/60 sticky top-0 z-10">
                  <tr className="border-b border-border">
                    <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">
                      Invoice Date
                    </th>
                    <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">
                      Report Name
                    </th>
                    <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">
                      Generated By
                    </th>
                    <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-2 py-1.5 text-right font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-xs text-muted-foreground"
                      >
                        No delivery ticket reports found.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-border hover:bg-muted/30"
                      >
                        <td className="px-2 py-1.5">{r.invoiceDate}</td>
                        <td className="px-2 py-1.5 font-medium text-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            {r.reportName}
                          </span>
                        </td>
                        <td className="px-2 py-1.5">{r.generatedBy}</td>
                        <td className="px-2 py-1.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-medium text-[10px] h-5 px-1.5",
                              reportStatusStyles[r.status]
                            )}
                          >
                            {r.status}
                          </Badge>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              title="Download"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="sticky bottom-0 z-40 bg-background px-3 py-2 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            size="sm"
            className="text-xs h-8"
            disabled={records.length === 0}
            onClick={() => setConfirmOpen(true)}
          >
            <Truck className="h-3.5 w-3.5 mr-1.5" />
            Process Delivery Tickets
          </Button>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={() => navigate("/invoicing")}
            >
              <Receipt className="h-3.5 w-3.5 mr-1.5" />
              Invoicing
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={() => navigate("/invoicing")}
            >
              <UserCog className="h-3.5 w-3.5 mr-1.5" />
              Billing Specialist
            </Button>
          </div>
        </div>
      </footer>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Delivery Tickets?</DialogTitle>
            <DialogDescription>
              You are about to generate delivery tickets for{" "}
              {records.length} selected record
              {records.length === 1 ? "" : "s"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processTickets}>
              <Truck className="h-4 w-4 mr-1.5" />
              Process Delivery Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <Label className="text-[11px] text-muted-foreground">

        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
