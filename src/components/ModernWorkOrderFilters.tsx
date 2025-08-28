import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, RotateCcw, Plus, ChevronDown, ChevronUp, Filter, Settings, Package } from "lucide-react";

const ModernWorkOrderFilters = () => {
  const [basicFiltersOpen, setBasicFiltersOpen] = useState(true);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Work Order Search & Management
            </CardTitle>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2 hover:scale-105 transition-transform">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="filters" className="animate-fade-in">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Search Filters
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Quick Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="space-y-4">
          {/* Basic Information Section */}
          <Collapsible open={basicFiltersOpen} onOpenChange={setBasicFiltersOpen}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="text-lg font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Basic Information
                    </div>
                    {basicFiltersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Column 1 - Work Order Details */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="wo-number" className="text-sm font-medium text-foreground">Work Order #</Label>
                        <Input id="wo-number" placeholder="Enter WO number" className="transition-all focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="acct-num" className="text-sm font-medium">Account Number</Label>
                        <Input id="acct-num" placeholder="Account number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer</Label>
                        <Input id="manufacturer" placeholder="Manufacturer name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model-number" className="text-sm font-medium">Model Number</Label>
                        <Input id="model-number" placeholder="Model number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-desc" className="text-sm font-medium">Product Description</Label>
                        <Input id="product-desc" placeholder="Description" />
                      </div>
                    </div>

                    {/* Column 2 - Status & Customer */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="wo-status" className="text-sm font-medium">WO Status</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="in-lab">In Lab</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-name" className="text-sm font-medium">Customer Name</Label>
                        <Input id="customer-name" placeholder="Customer name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="action-code" className="text-sm font-medium">Action Code</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="calibrate">Calibrate</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                            <SelectItem value="test">Test</SelectItem>
                            <SelectItem value="certification">Certification</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="division" className="text-sm font-medium">Division</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="electronic">Electronic</SelectItem>
                            <SelectItem value="mechanical">Mechanical</SelectItem>
                            <SelectItem value="dimensional">Dimensional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="lab-a">Lab A</SelectItem>
                            <SelectItem value="lab-b">Lab B</SelectItem>
                            <SelectItem value="receiving">Receiving</SelectItem>
                            <SelectItem value="shipping">Shipping</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Column 3 - Technical Details */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="wo-type" className="text-sm font-medium">WO Type</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="calibration">Calibration</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                            <SelectItem value="certification">Certification</SelectItem>
                            <SelectItem value="rental">Rental</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="os-request" className="text-sm font-medium">OS Request #</Label>
                        <Input id="os-request" placeholder="OS request number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mfg-serial" className="text-sm font-medium">Manufacturing Serial</Label>
                        <Input id="mfg-serial" placeholder="Mfg serial number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="asset-id" className="text-sm font-medium">Asset ID</Label>
                        <Input id="asset-id" placeholder="Asset identifier" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="esl-id" className="text-sm font-medium">ESL ID</Label>
                        <Input id="esl-id" placeholder="ESL identifier" />
                      </div>
                    </div>

                    {/* Column 4 - Options & Status */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Equipment Options</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="new-equip" />
                            <Label htmlFor="new-equip" className="text-sm">New Equipment</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="used-surplus" />
                            <Label htmlFor="used-surplus" className="text-sm">Used Surplus</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="warranty" />
                            <Label htmlFor="warranty" className="text-sm">Warranty</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="to-factory" />
                            <Label htmlFor="to-factory" className="text-sm">To Factory</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="proof-delivery" />
                            <Label htmlFor="proof-delivery" className="text-sm">Proof of Delivery</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="item-type" className="text-sm font-medium">Item Type</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="instrument">Instrument</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="rental">Rental Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assigned-to" className="text-sm font-medium">Assigned To</Label>
                        <Input id="assigned-to" placeholder="Technician name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="item-status" className="text-sm font-medium">Item Status</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="in-lab">In Lab</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Advanced Filters Section */}
          <Collapsible open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="text-lg font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Advanced Options
                    </div>
                    {advancedFiltersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="rush">Rush</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tt-po" className="text-sm font-medium">T/T PO #</Label>
                        <Input id="tt-po" placeholder="TT PO number" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendor-rma" className="text-sm font-medium">Vendor RMA #</Label>
                        <Input id="vendor-rma" placeholder="RMA number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sales-person" className="text-sm font-medium">Sales Person</Label>
                        <Input id="sales-person" placeholder="Sales representative" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="quote-num" className="text-sm font-medium">Quote #</Label>
                        <Input id="quote-num" placeholder="Quote number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rfid" className="text-sm font-medium">RFID</Label>
                        <Input id="rfid" placeholder="RFID identifier" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoice-status" className="text-sm font-medium">Invoice Status</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="departure-type" className="text-sm font-medium">Departure Type</Label>
                        <Select>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            <SelectItem value="ship">Ship</SelectItem>
                            <SelectItem value="pickup">Pickup</SelectItem>
                            <SelectItem value="delivery">Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </TabsContent>

        <TabsContent value="actions">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  "Hot List", "Transit Log", "Update RFQs", "Rental Status Cards", "PO/Exchange Orders",
                  "Assign Techs", "Assign Departure Info", "Export Excel", "Missing Cost", "Print Labels",
                  "Generate Reports", "Bulk Update", "Archive Records", "Quality Check", "Calibration Reminders"
                ].map((action) => (
                  <Button key={action} variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    {action}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModernWorkOrderFilters;