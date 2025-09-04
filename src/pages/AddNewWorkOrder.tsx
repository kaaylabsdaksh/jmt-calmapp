import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, X, Download, Settings, User, CreditCard, Users, Package, FileText, Calculator, AlertCircle, ExternalLink, Award, Shield, BarChart, Save } from "lucide-react";

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
            <span className="text-xl font-bold text-black">CalMApp</span>
            <span className="text-sm text-black">Work Order Management</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-black hover:bg-black/10">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-black hover:bg-black/10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-card border-b px-6 py-4">
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
      </div>

      {/* Content Area */}
      <div className="px-6 py-6 pb-24">
        <div className="w-full space-y-6">
          {/* Header Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label className="text-sm font-medium text-black">Work Order #</Label>
                  <div className="text-lg font-bold text-black mt-1">{workOrderData.workOrderNumber}</div>
                </div>
                <div>
                  <Label htmlFor="srDocument" className="text-sm font-medium text-black">SR Doc</Label>
                  <Input
                    id="srDocument"
                    placeholder="SR Document"
                    value={workOrderData.srDocument}
                    onChange={(e) => setWorkOrderData(prev => ({ ...prev, srDocument: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-black">Salesperson</Label>
                  <div className="text-sm text-black mt-1">{workOrderData.salesperson}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-black">Contact</Label>
                  <div className="text-sm text-black mt-1">{workOrderData.contact}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="h-auto p-0 bg-transparent gap-3 flex flex-wrap justify-start">
              <TabsTrigger 
                value="general" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <User className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger 
                value="account-info" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                Account Info
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <Users className="w-4 h-4" />
                Work Order Contacts
              </TabsTrigger>
              <TabsTrigger 
                value="items" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <Package className="w-4 h-4" />
                Work Order Items
              </TabsTrigger>
              <TabsTrigger 
                value="quote" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Quote Details
              </TabsTrigger>
              <TabsTrigger 
                value="estimate" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <Calculator className="w-4 h-4" />
                Estimate
              </TabsTrigger>
              <TabsTrigger 
                value="fail-log" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <AlertCircle className="w-4 h-4" />
                Fail Log
              </TabsTrigger>
              <TabsTrigger 
                value="external" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                External Files
              </TabsTrigger>
              <TabsTrigger 
                value="cert" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <Award className="w-4 h-4" />
                Cert Files
              </TabsTrigger>
              <TabsTrigger 
                value="warranty" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <Shield className="w-4 h-4" />
                Warranty
              </TabsTrigger>
              <TabsTrigger 
                value="qfd" 
                className="flex items-center gap-2 px-4 py-3 bg-card border rounded-lg text-sm font-medium transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
              >
                <BarChart className="w-4 h-4" />
                QFD Data
              </TabsTrigger>
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
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Status :</span>
                      <span className="text-sm text-green-600 font-medium">ACTIVE</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Customer Name :</span>
                      <span className="text-sm text-black">Entergy Inventory</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Acct # :</span>
                      <span className="text-sm text-black">15000.00</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">SR Number :</span>
                      <span className="text-sm text-black">SR2244</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Phone Number :</span>
                      <span className="text-sm text-black">(225) 382-4878</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Ship To :</span>
                      <span className="text-sm text-black">7223 Tom Drive, Bldg 527</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">City/State/Zip :</span>
                      <span className="text-sm text-black">Baton Rouge, LA 70806</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Main Contact :</span>
                      <span className="text-sm text-black">USE TAG/PAPERWORK</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Salesperson Code :</span>
                      <span className="text-sm text-black">ZZEN - House - Entergy</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Terms :</span>
                      <span className="text-sm text-black">Net 30</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">P.O. Number :</span>
                      <span className="text-sm text-black">CONTRACT# 10629042</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">Contract Pricing :</span>
                      <span className="text-sm text-black">Yes</span>
                    </div>
                  </div>
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

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t px-6 py-4 shadow-lg">
        <div className="w-full flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-success text-success-foreground hover:bg-success/90">
            <Save className="h-4 w-4 mr-2" />
            Save Work Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNewWorkOrder;