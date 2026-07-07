import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Search, RotateCcw } from "lucide-react";

interface BillingSpecialistFilters {
  invoicingType: string;
  workOrderType: string;
  location: string;
  division: string;
  invoiceStatus: string;
  customerGroup: string;
}

const defaultFilters: BillingSpecialistFilters = {
  invoicingType: "regular",
  workOrderType: "all",
  location: "all",
  division: "all",
  invoiceStatus: "all",
  customerGroup: "all",
};

const COLUMN_KEYS = [
  "woBatch",
  "acctNum",
  "srNum",
  "customerName",
  "rtbCount",
  "totalCount",
  "lastCommentDate",
  "lastComment",
  "minNeedByDate",
  "minRtbDate",
  "toShipping",
  "salesOrder",
] as const;

const COLUMN_LABELS: Record<(typeof COLUMN_KEYS)[number], string> = {
  woBatch: "WO Batch",
  acctNum: "Acct #",
  srNum: "SR#",
  customerName: "Customer Name",
  rtbCount: "RTB Count",
  totalCount: "Total Count",
  lastCommentDate: "Last Comment Date",
  lastComment: "Last Comment",
  minNeedByDate: "Min Need By Date",
  minRtbDate: "Min RTB Date",
  toShipping: "To Shipping",
  salesOrder: "Sales Order",
};

export function BillingSpecialistView() {
  const [filters, setFilters] = useState<BillingSpecialistFilters>(defaultFilters);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const clearFilters = () => {
    setFilters(defaultFilters);
    setColumnFilters({});
  };

  const updateFilter = (key: keyof BillingSpecialistFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateColumnFilter = (key: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-3 flex-1">
      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Invoicing Type</Label>
              <Select
                value={filters.invoicingType}
                onValueChange={(v) => updateFilter("invoicingType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Work Order Type</Label>
              <Select
                value={filters.workOrderType}
                onValueChange={(v) => updateFilter("workOrderType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Location</Label>
              <Select
                value={filters.location}
                onValueChange={(v) => updateFilter("location", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
                  <SelectItem value="houston">Houston</SelectItem>
                  <SelectItem value="norco">Norco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <div className="flex gap-2">
                <Button className="flex-1 h-10">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={clearFilters}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Division</Label>
              <Select
                value={filters.division}
                onValueChange={(v) => updateFilter("division", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="field">Field</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Invoice Status</Label>
              <Select
                value={filters.invoiceStatus}
                onValueChange={(v) => updateFilter("invoiceStatus", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delivery-ticket">Delivery Ticket</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Customer Group</Label>
              <Select
                value={filters.customerGroup}
                onValueChange={(v) => updateFilter("customerGroup", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-muted/60">
              <tr className="border-b border-border">
                <th className="w-8 px-2 py-1.5 text-left border-r border-border">
                  <input type="checkbox" className="rounded" />
                </th>
                {COLUMN_KEYS.map((key) => (
                  <th
                    key={key}
                    className="px-2 py-1.5 text-left font-medium text-muted-foreground border-r border-border last:border-r-0 min-w-[100px]"
                  >
                    <div className="space-y-1">
                      <div>{COLUMN_LABELS[key]}</div>
                      <Input
                        value={columnFilters[key] || ""}
                        onChange={(e) => updateColumnFilter(key, e.target.value)}
                        className="h-6 text-[10px] px-1.5"
                        placeholder=""
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={COLUMN_KEYS.length + 1}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No data to display
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sticky Footer */}
      <footer className="mt-auto sticky bottom-0 z-40 bg-background px-6 py-3 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Receipt className="h-3.5 w-3.5 mr-1.5" />
            Process Invoice(s)
          </Button>
        </div>
      </footer>
    </div>
  );
}
