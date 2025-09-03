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
  console.log("WorkOrderDetails component rendering with ID:", workOrderId);
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
        <div className="px-4 sm:px-6 py-3">
          {/* Back Button Row */}
          <div className="mb-3">
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
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-xl font-bold text-foreground mb-1">Edit Work Order</h1>
              
              {/* Work Order Info - Split into multiple lines for better tablet display */}
              <div className="space-y-0.5 text-sm text-muted-foreground">
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
            
            <div className="flex flex-col items-end gap-2 shrink-0">
              {/* Status and Type Badges */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {workOrderData.status}
                </Badge>
                <Badge variant="outline">
                  {workOrderData.type}
                </Badge>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 pb-32">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                    Showing <span className="font-medium text-foreground">24</span> of <span className="font-medium text-foreground">24</span> items
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
                  {[
                    { id: '002', manufacturer: 'VAETRIX', model: 'ETG-5K-1-05-BT', serial: '1557252190', type: 'SINGLE', deliverDate: '04/03/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '004', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/29/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '005', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/15/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '006', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/12/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '007', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/18/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '008', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/22/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '009', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/25/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '010', manufacturer: 'HASTINGS', model: '5006', serial: 'N/A', type: 'SINGLE', deliverDate: '04/28/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '011', manufacturer: 'FLUKE', model: '8845A', serial: 'FL8845A001', type: 'SINGLE', deliverDate: '05/02/2025', status: 'In Calibration', statusColor: 'blue' },
                    { id: '012', manufacturer: 'KEYSIGHT', model: '34465A', serial: 'MY54001234', type: 'SINGLE', deliverDate: '05/05/2025', status: 'Pending Parts', statusColor: 'yellow' },
                    { id: '013', manufacturer: 'TEKTRONIX', model: 'MSO64', serial: 'B010203', type: 'SINGLE', deliverDate: '05/08/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '014', manufacturer: 'ROHDE & SCHWARZ', model: 'FSW26', serial: '100001', type: 'SINGLE', deliverDate: '05/10/2025', status: 'Under Repair', statusColor: 'red' },
                    { id: '015', manufacturer: 'ANRITSU', model: 'MS2038C', serial: '6201234567', type: 'SINGLE', deliverDate: '05/12/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '016', manufacturer: 'AGILENT', model: 'E4438C', serial: 'US44012345', type: 'SINGLE', deliverDate: '05/15/2025', status: 'In Testing', statusColor: 'blue' },
                    { id: '017', manufacturer: 'NATIONAL INSTRUMENTS', model: 'PXIe-5164', serial: '1A2B3C4D', type: 'MODULE', deliverDate: '05/18/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '018', manufacturer: 'KEITHLEY', model: '2450', serial: '4151234', type: 'SINGLE', deliverDate: '05/20/2025', status: 'Calibration Complete', statusColor: 'green' },
                    { id: '019', manufacturer: 'RIGOL', model: 'DG4162', serial: 'DG41620001', type: 'SINGLE', deliverDate: '05/22/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '020', manufacturer: 'LECROY', model: 'WaveRunner 8254M', serial: 'LCRY001234', type: 'SINGLE', deliverDate: '05/25/2025', status: 'Awaiting Customer', statusColor: 'yellow' },
                    { id: '021', manufacturer: 'BIRD', model: '4421-50', serial: 'B4421001', type: 'SINGLE', deliverDate: '05/28/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '022', manufacturer: 'OPHIR', model: 'Nova II', serial: 'NOVA2001', type: 'SINGLE', deliverDate: '05/30/2025', status: 'In Calibration', statusColor: 'blue' },
                    { id: '023', manufacturer: 'TRANSCAT', model: 'TC-7040', serial: 'TC7040001', type: 'SINGLE', deliverDate: '06/02/2025', status: 'Ready for Departure', statusColor: 'green' },
                    { id: '024', manufacturer: 'IKALOGIC', model: 'ScanaStudio', serial: 'IK001234', type: 'SINGLE', deliverDate: '06/05/2025', status: 'Quality Check', statusColor: 'blue' },
                    { id: '025', manufacturer: 'HIOKI', model: '3561', serial: 'H3561001', type: 'SINGLE', deliverDate: '06/08/2025', status: 'Ready for Departure', statusColor: 'green' },
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
                          <Badge 
                            variant="secondary" 
                            className={
                              item.statusColor === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                              item.statusColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              item.statusColor === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            }
                          >
                            {item.status}
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

                {/* End of list indicator */}
                <div className="flex justify-center py-6">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="h-px bg-border flex-1 max-w-12"></div>
                    <span>End of list</span>
                    <div className="h-px bg-border flex-1 max-w-12"></div>
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

        {/* Footer Actions - Now Sticky */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t shadow-lg transition-all duration-300">
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Created/Modified Info - Hidden on mobile, full on desktop */}
              <div className="text-sm text-muted-foreground hidden sm:block space-y-1 flex-1">
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

              {/* Action Buttons - Full width on mobile */}
              <div className="flex items-center gap-3 w-full sm:shrink-0 sm:mx-0 sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-initial h-12 sm:h-9">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" className="flex-1 sm:flex-initial h-12 sm:h-9">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderDetails;
