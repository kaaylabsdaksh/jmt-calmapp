import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, X, Download, Settings } from "lucide-react";

const AddNewWorkOrder = () => {
  const navigate = useNavigate();
  const [workOrderData, setWorkOrderData] = useState({
    workOrderNumber: "WO-QOAV2I",
    srDocument: "",
    workOrderStatus: "Created",
    workOrderType: "Regular Work Order",
    accountNumber: "",
    customer: "",
    salesperson: "Not assigned",
    contact: "Not specified"
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving work order:", workOrderData);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Yellow Header */}
      <header className="bg-warning px-6 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-warning-foreground">CalMApp</span>
            <span className="text-sm text-warning-foreground/80">Work Order Management</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-warning-foreground hover:bg-warning-foreground/10">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-warning-foreground hover:bg-warning-foreground/10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Work Orders
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Add New Work Order</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} className="bg-success text-success-foreground hover:bg-success/90">
              Save Work Order
            </Button>
            <Button variant="ghost" onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Work Order #</Label>
                  <div className="text-lg font-bold text-foreground mt-1">{workOrderData.workOrderNumber}</div>
                </div>
                <div>
                  <Label htmlFor="srDocument" className="text-sm font-medium text-muted-foreground">SR Doc</Label>
                  <Input
                    id="srDocument"
                    placeholder="SR Document"
                    value={workOrderData.srDocument}
                    onChange={(e) => setWorkOrderData(prev => ({ ...prev, srDocument: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Salesperson</Label>
                  <div className="text-sm text-muted-foreground mt-1">{workOrderData.salesperson}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
                  <div className="text-sm text-muted-foreground mt-1">{workOrderData.contact}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-1">
              <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
              <TabsTrigger value="account-info" className="text-xs">Account Info</TabsTrigger>
              <TabsTrigger value="contacts" className="text-xs">Work Order Contacts</TabsTrigger>
              <TabsTrigger value="items" className="text-xs">Work Order Items</TabsTrigger>
              <TabsTrigger value="quote" className="text-xs">Quote Details</TabsTrigger>
              <TabsTrigger value="estimate" className="text-xs">Estimate</TabsTrigger>
              <TabsTrigger value="fail-log" className="text-xs">Fail Log</TabsTrigger>
              <TabsTrigger value="external" className="text-xs">External Files</TabsTrigger>
              <TabsTrigger value="cert" className="text-xs">Cert Files</TabsTrigger>
              <TabsTrigger value="warranty" className="text-xs">Warranty</TabsTrigger>
              <TabsTrigger value="qfd" className="text-xs">QFD Data</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Work Order Number */}
                    <div className="space-y-2">
                      <Label htmlFor="workOrderNumber" className="text-sm font-medium">
                        Work Order # <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="workOrderNumber"
                        value={workOrderData.workOrderNumber}
                        onChange={(e) => setWorkOrderData(prev => ({ ...prev, workOrderNumber: e.target.value }))}
                      />
                    </div>

                    {/* Work Order Status */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Work Order Status</Label>
                      <Select value={workOrderData.workOrderStatus} onValueChange={(value) => setWorkOrderData(prev => ({ ...prev, workOrderStatus: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Created">Created</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Work Order Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Work Order Type</Label>
                      <Select value={workOrderData.workOrderType} onValueChange={(value) => setWorkOrderData(prev => ({ ...prev, workOrderType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular Work Order">Regular Work Order</SelectItem>
                          <SelectItem value="Emergency Work Order">Emergency Work Order</SelectItem>
                          <SelectItem value="Maintenance Work Order">Maintenance Work Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Account Number */}
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-sm font-medium">
                        Account # <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={workOrderData.accountNumber}
                          onChange={(e) => setWorkOrderData(prev => ({ ...prev, accountNumber: e.target.value }))}
                          className={!workOrderData.accountNumber ? "border-destructive" : ""}
                        />
                        {!workOrderData.accountNumber && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-destructive rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="space-y-2">
                      <Label htmlFor="customer" className="text-sm font-medium">Customer</Label>
                      <Input
                        id="customer"
                        placeholder="Customer name"
                        value={workOrderData.customer}
                        onChange={(e) => setWorkOrderData(prev => ({ ...prev, customer: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholder content for other tabs */}
            <TabsContent value="account-info">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Account Info content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Work Order Contacts content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Work Order Items content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quote">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Quote Details content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estimate">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Estimate content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fail-log">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Fail Log content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="external">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">External Files content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cert">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Cert Files content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warranty">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Warranty content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qfd">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">QFD Data content coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AddNewWorkOrder;