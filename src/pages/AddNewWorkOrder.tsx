import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, X, Download, Settings, User, CreditCard, Users, Package, FileText, Calculator, AlertCircle, ExternalLink, Award, Shield, BarChart, Save, LayoutGrid, Table } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkOrderItemsTable } from "@/components/WorkOrderItemsTable";
import { WorkOrderItemsCards } from "@/components/WorkOrderItemsCards";

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

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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
      <div className="bg-card border-b px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Work Orders</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground absolute left-1/2 transform -translate-x-1/2">
            <span className="hidden sm:inline">Add New Work Order</span>
            <span className="sm:hidden">New Work Order</span>
          </h1>
          <div></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 pb-24">
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Header Info Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">ACTIVE</span></div>
                      <div><span className="font-medium">Customer Name:</span> Entergy Inventory</div>
                      <div><span className="font-medium">Ship To:</span> 7223 Tom Drive, Bldg 527</div>
                      <div><span className="font-medium">City/State/Zip:</span> Baton Rouge, LA 70806</div>
                      <div><span className="font-medium">Main Contact:</span> USE TAG/PAPERWORK</div>
                      <div><span className="font-medium">Remarks:</span> ESL (Y) CONTRACT site id must match account</div>
                      <div><span className="font-medium">Comments:</span> -</div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Acct #:</span> 15000.00</div>
                      <div><span className="font-medium">SR Number:</span> SR2244</div>
                      <div><span className="font-medium">Phone Number:</span> (225) 382-4878</div>
                      <div><span className="font-medium">Salesperson Code:</span> ZZEN - House - Entergy</div>
                      <div><span className="font-medium">Terms:</span> Net 30</div>
                      <div><span className="font-medium">P.O. Number:</span> CONTRACT# 10629042</div>
                      <div><span className="font-medium">Biller Code:</span> 18</div>
                      <div><span className="font-medium">Industry Code:</span> DM02 - Power Co's - Utility Distribution</div>
                      <div><span className="font-medium">Contract Pricing:</span> Yes</div>
                    </div>
                  </div>

                  {/* Customer Contacts Table */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-black mb-4">Customer Contacts</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 font-medium">Name</th>
                            <th className="text-left p-3 font-medium">Email</th>
                            <th className="text-left p-3 font-medium">Phone</th>
                            <th className="text-left p-3 font-medium">Title</th>
                            <th className="text-left p-3 font-medium">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="p-3">Netasha Gray</td>
                            <td className="p-3">netasha.gray@entergy.com</td>
                            <td className="p-3">(225) 382-4878</td>
                            <td className="p-3">Senior Buyer</td>
                            <td className="p-3">Primary</td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-3">Barry White</td>
                            <td className="p-3">barry.white@entergy.com</td>
                            <td className="p-3">(225) 382-4879</td>
                            <td className="p-3">Procurement Manager</td>
                            <td className="p-3">Secondary</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-foreground">Account's Contact(s) for this Work Order:</h3>
                    
                    <div className="space-y-4">
                      {/* Required Contact */}
                      <div className="space-y-2">
                        <Select defaultValue="barry-white">
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select contact..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="barry-white">Barry White</SelectItem>
                            <SelectItem value="netasha-gray">Netasha Gray</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">(required)</p>
                      </div>

                      {/* Additional Contact 1 */}
                      <div>
                        <Select>
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select additional contact..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="barry-white">Barry White</SelectItem>
                            <SelectItem value="netasha-gray">Netasha Gray</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Additional Contact 2 */}
                      <div>
                        <Select>
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Select additional contact..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background border shadow-lg z-50">
                            <SelectItem value="barry-white">Barry White</SelectItem>
                            <SelectItem value="netasha-gray">Netasha Gray</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Add Contact Button */}
                      <div className="pt-4">
                        <Button variant="default" className="bg-warning text-black hover:bg-warning/90">
                          Add Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-warning text-black hover:bg-warning/90 font-medium">
                        Add New Item
                      </Button>
                      <Button className="bg-warning text-black hover:bg-warning/90 font-medium">
                        Add New Item w/PO
                      </Button>
                      <Button className="bg-warning text-black hover:bg-warning/90 font-medium">
                        Print QR Sheet
                      </Button>
                      <Button className="bg-warning text-black hover:bg-warning/90 font-medium">
                        Copy From Other WO
                      </Button>
                      <Button className="bg-warning text-black hover:bg-warning/90 font-medium">
                        Create Unused Items
                      </Button>
                    </div>

                    {/* Filter Controls */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium whitespace-nowrap min-w-fit">Work Order:</Label>
                          <Input className="w-24 border-gray-400" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium whitespace-nowrap min-w-fit">Item #:</Label>
                          <Input className="w-16 border-gray-400" />
                          <span className="text-sm text-muted-foreground">-</span>
                          <Input className="w-16 border-gray-400" />
                          <span className="text-sm text-muted-foreground">or</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium whitespace-nowrap min-w-fit">Groupable:</Label>
                          <Select>
                            <SelectTrigger className="w-28 border-gray-400">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium whitespace-nowrap min-w-fit"># of Items:</Label>
                          <span className="text-sm font-medium min-w-fit">0</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium whitespace-nowrap min-w-fit">Special Action:</Label>
                          <Select>
                            <SelectTrigger className="w-36 border-gray-400">
                              <SelectValue placeholder="Select action..." />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50">
                              <SelectItem value="action1">Action 1</SelectItem>
                              <SelectItem value="action2">Action 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant={viewMode === 'table' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('table')}
                          className="h-8 px-3"
                        >
                          <Table className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'cards' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('cards')}
                          className="h-8 px-3"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Conditional View Rendering */}
                    {viewMode === 'table' ? (
                      <WorkOrderItemsTable />
                    ) : (
                      <WorkOrderItemsCards />
                    )}
                  </div>
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