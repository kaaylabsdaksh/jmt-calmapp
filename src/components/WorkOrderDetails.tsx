import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Menu, 
  Download, 
  Edit, 
  User, 
  Package, 
  FileText, 
  Settings,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  Database
} from "lucide-react";

interface WorkOrderDetailsProps {
  workOrderId: string;
  onBack?: () => void;
}

const WorkOrderDetails = ({ workOrderId, onBack }: WorkOrderDetailsProps) => {
  const [activeTab, setActiveTab] = useState("general");
  
  // Sample data - in real app this would come from API
  const workOrderData = {
    id: "385737",
    number: "0152.01",
    status: "In Process",
    type: "Regular Work Order",
    customer: {
      name: "J M Test Systems Rental Equip",
      address: "7323 Tom Drive - Baton Rouge, LA 70806",
      contact: "Chris Melançon",
      phone: "(225)925-2029"
    },
    salesperson: "House - Rental",
    createdBy: "Lindsey R. Thurmon",
    createdDate: "10/15/2021",
    modifiedBy: "Admin User", 
    modifiedDate: "08/28/2025"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Back Button Row */}
          <div className="mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          
          {/* Main Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">Edit Work Order</h1>
              
              {/* Work Order Info - Split into multiple lines for better tablet display */}
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  <span>Work Order #: <span className="font-medium text-foreground">{workOrderData.id}</span></span>
                  <span className="hidden md:inline text-muted-foreground">•</span>
                  <span>Act #: <span className="font-medium text-foreground">{workOrderData.number}</span></span>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  <span>Salesperson: <span className="text-primary font-medium">{workOrderData.salesperson}</span></span>
                  <span className="hidden md:inline text-muted-foreground">•</span>
                  <span>Contact: <span className="text-primary font-medium">{workOrderData.customer.contact}</span></span>
                  <span className="text-muted-foreground">({workOrderData.customer.phone})</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </div>
          </div>

          {/* Status and Type Badges */}
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              {workOrderData.status}
            </Badge>
            <Badge variant="outline">
              {workOrderData.type}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 h-auto p-1 gap-1">
            <TabsTrigger value="general" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">General</span>
              <span className="lg:hidden">Gen</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">Account Info</span>
              <span className="lg:hidden">Account</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">WO Contacts</span>
              <span className="lg:hidden">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">WO Items</span>
              <span className="lg:hidden">Items</span>
            </TabsTrigger>
            <TabsTrigger value="onsite" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">Onsite Defaults</span>
              <span className="lg:hidden">Onsite</span>
            </TabsTrigger>
            <TabsTrigger value="estimate" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm lg:col-start-6">
              <span className="hidden lg:inline">Estimate</span>
              <span className="lg:hidden">Est</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">External Files</span>
              <span className="lg:hidden">Ext Files</span>
            </TabsTrigger>
            <TabsTrigger value="cert-files" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">Cert Files</span>
              <span className="lg:hidden">Cert</span>
            </TabsTrigger>
            <TabsTrigger value="warranty" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">Warranty</span>
              <span className="lg:hidden">Warranty</span>
            </TabsTrigger>
            <TabsTrigger value="qf3-data" className="flex items-center justify-center px-2 py-2.5 text-xs lg:text-sm">
              <span className="hidden lg:inline">QF3 Data</span>
              <span className="lg:hidden">QF3</span>
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" />
                  Work Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workOrderNumber">Work Order #</Label>
                    <Input 
                      id="workOrderNumber" 
                      value={workOrderData.id}
                      className="bg-muted" 
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workOrderStatus">Work Order Status</Label>
                    <Select defaultValue="in-process">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-process">In Process</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workOrderType">Work Order Type</Label>
                    <Select defaultValue="regular">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular Work Order</SelectItem>
                        <SelectItem value="rush">Rush Order</SelectItem>
                        <SelectItem value="warranty">Warranty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="actNumber">Act #</Label>
                    <div className="relative">
                      <Input 
                        id="actNumber" 
                        value={workOrderData.number}
                        readOnly
                      />
                      <div className="absolute right-2 top-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Customer Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer</Label>
                      <Textarea 
                        id="customer" 
                        value={`${workOrderData.customer.name}\n${workOrderData.customer.address}`}
                        rows={3}
                        className="resize-none"
                        readOnly
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact</Label>
                        <Input 
                          id="contact" 
                          value={workOrderData.customer.contact}
                          readOnly
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={workOrderData.customer.phone}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content placeholders */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Account information content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Work Order Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Contacts content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Work Order Items
                  </CardTitle>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Add New Item
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Add New Item w/RFID
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Print QR Sheet
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Secondary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" size="sm" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Copy From Other WO
                  </Button>
                  <Button variant="secondary" size="sm" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Create Unused Items
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="workOrderFilter">Work Order #:</Label>
                    <Input 
                      id="workOrderFilter" 
                      placeholder="Enter work order #"
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemNumberFilter">Item #:</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="itemNumberFilter" 
                        placeholder="From"
                        className="bg-background"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input 
                        placeholder="To"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groupableFilter">Groupable:</Label>
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select groupable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="groupable">Groupable</SelectItem>
                        <SelectItem value="non-groupable">Non-Groupable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialAction">Special Action:</Label>
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="calibrate">Calibrate</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    # of Items: <span className="font-medium text-foreground">48</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="viewType" className="text-sm">View:</Label>
                    <Select defaultValue="default">
                      <SelectTrigger className="w-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default View</SelectItem>
                        <SelectItem value="compact">Compact View</SelectItem>
                        <SelectItem value="detailed">Detailed View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Items Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    { id: '002', manufacturer: 'VAETRIX', model: 'ETG-5K-1-05-BT', serial: '1557252190', type: 'SINGLE', deliverDate: '04/03/2025' },
                    { id: '004', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/29/2025' },
                    { id: '005', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/15/2025' },
                    { id: '006', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/12/2025' },
                    { id: '007', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/18/2025' },
                    { id: '008', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/22/2025' },
                    { id: '009', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/25/2025' },
                    { id: '010', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/28/2025' },
                  ].map((item, index) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="rounded mt-1" />
                            <div className="space-y-1">
                              <Button variant="link" className="h-auto p-0 text-primary text-left justify-start">
                                Edit
                              </Button>
                              <p className="text-sm font-medium text-foreground">0152.01-385737-{item.id}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                            Ready for Departure
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">Manufacturer</Label>
                              <p className="text-sm font-medium">{item.manufacturer}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Model</Label>
                              <p className="text-sm font-medium">{item.model}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Serial #</Label>
                              <p className="text-sm font-medium">{item.serial}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">Item Type</Label>
                              <p className="text-sm font-medium">{item.type}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Created</Label>
                              <p className="text-sm font-medium">10/15/2021</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Deliver By Date</Label>
                              <p className="text-sm font-medium">{item.deliverDate}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Departure: -</span>
                            <span>PO #: CUST/PO#</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page 1 of 4 (48 items)
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button variant="default" size="sm">1</Button>
                      <Button variant="outline" size="sm">2</Button>
                      <Button variant="outline" size="sm">3</Button>
                      <Button variant="outline" size="sm">4</Button>
                    </div>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pageSize" className="text-sm">Page size:</Label>
                    <Select defaultValue="15">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onsite" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Onsite Defaults
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Onsite defaults content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estimate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Estimate content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  External Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">External files content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cert-files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Cert Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Certificate files content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warranty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Warranty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Warranty content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qf3-data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  QF3 Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">QF3 data content will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <Card className="mt-6">
          <CardContent className="py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Created/Modified Info */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <span>Created By:</span>
                    <span className="font-medium text-foreground">{workOrderData.createdBy}</span>
                  </div>
                  <span className="text-muted-foreground">{workOrderData.createdDate}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <span>Modified By:</span>
                    <span className="font-medium text-foreground">{workOrderData.modifiedBy}</span>
                  </div>
                  <span className="text-muted-foreground">{workOrderData.modifiedDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkOrderDetails;
