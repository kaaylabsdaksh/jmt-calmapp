import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RotateCcw, Plus } from "lucide-react";

const WorkOrderFilters = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Work Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="wo-number" className="text-sm font-medium">WO #</Label>
              <Input id="wo-number" placeholder="Enter work order number" />
            </div>
            <div>
              <Label htmlFor="acct-num" className="text-sm font-medium">Acct Num</Label>
              <Input id="acct-num" placeholder="Account number" />
            </div>
            <div>
              <Label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer</Label>
              <Input id="manufacturer" placeholder="Manufacturer name" />
            </div>
            <div>
              <Label htmlFor="model-number" className="text-sm font-medium">Model Number</Label>
              <Input id="model-number" placeholder="Model number" />
            </div>
            <div>
              <Label htmlFor="product-desc" className="text-sm font-medium">Product Description</Label>
              <Input id="product-desc" placeholder="Description" />
            </div>
          </div>

          {/* Center Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="wo-status" className="text-sm font-medium">WO Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-lab">In Lab</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customer-name" className="text-sm font-medium">Customer Name</Label>
              <Input id="customer-name" placeholder="Customer name" />
            </div>
            <div>
              <Label htmlFor="action-code" className="text-sm font-medium">Action Code</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calibrate">Calibrate</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="rush">Rush</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Center Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="wo-type" className="text-sm font-medium">WO Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="os-request" className="text-sm font-medium">OS Request #</Label>
              <Input id="os-request" placeholder="OS request number" />
            </div>
            <div>
              <Label htmlFor="mfg-serial" className="text-sm font-medium">Mfg Serial</Label>
              <Input id="mfg-serial" placeholder="Manufacturing serial" />
            </div>
            <div>
              <Label htmlFor="po-number" className="text-sm font-medium">P.O. #</Label>
              <Input id="po-number" placeholder="Purchase order" />
            </div>
            <div>
              <Label htmlFor="cust-serial" className="text-sm font-medium">Cust Serial</Label>
              <Input id="cust-serial" placeholder="Customer serial" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" id="new-equip" className="rounded" />
              <Label htmlFor="new-equip">New Equip</Label>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" id="used-surplus" className="rounded" />
              <Label htmlFor="used-surplus">Used Surplus</Label>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" id="warranty" className="rounded" />
              <Label htmlFor="warranty">Warranty</Label>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" id="to-factory" className="rounded" />
              <Label htmlFor="to-factory">To Factory</Label>
            </div>

            <div className="space-y-2 mt-4">
              <div>
                <Label htmlFor="item-type" className="text-sm font-medium">Item Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instrument">Instrument</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assigned-to" className="text-sm font-medium">Assigned To</Label>
                <Input id="assigned-to" placeholder="Technician" />
              </div>
              <div>
                <Label htmlFor="item-status" className="text-sm font-medium">Item Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="In Lab" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-lab">In Lab</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button className="flex items-center gap-2">
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
          <Button variant="outline">Menu</Button>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm">Hot List</Button>
          <Button variant="outline" size="sm">Transit Log</Button>
          <Button variant="outline" size="sm">Update RFQs</Button>
          <Button variant="outline" size="sm">Rental Status Cards</Button>
          <Button variant="outline" size="sm">PO/Exchange Orders</Button>
          <Button variant="outline" size="sm">Assign Techs</Button>
          <Button variant="outline" size="sm">Assign Departure Info</Button>
          <Button variant="outline" size="sm">Export Excel</Button>
          <Button variant="outline" size="sm">Missing Cost</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrderFilters;