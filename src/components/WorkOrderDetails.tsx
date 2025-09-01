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
  Mail
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
      <div className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Edit Work Order</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Work Order #: <span className="font-medium">{workOrderData.id}</span> 
                  {" • "}
                  <span className="font-medium">{workOrderData.number}</span>
                  {" • "}
                  Salesperson: <span className="text-primary font-medium">{workOrderData.salesperson}</span>
                  {" • "}
                  Contact: <span className="text-primary font-medium">{workOrderData.customer.contact}</span>
                  <span className="ml-2 text-muted-foreground">({workOrderData.customer.phone})</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4 mr-2" />
                Menu
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
          <TabsList className="grid w-full grid-cols-8 h-auto p-1">
            <TabsTrigger value="general" className="flex items-center gap-2 py-2.5">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2 py-2.5">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account Info</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2 py-2.5">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2 py-2.5">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Items</span>
            </TabsTrigger>
            <TabsTrigger value="onsite" className="flex items-center gap-2 py-2.5">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Onsite Defaults</span>
            </TabsTrigger>
            <TabsTrigger value="estimate" className="flex items-center gap-2 py-2.5">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Estimate</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2 py-2.5">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">External Files</span>
            </TabsTrigger>
            <TabsTrigger value="warranty" className="flex items-center gap-2 py-2.5">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Warranty</span>
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
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact</Label>
                        <Input 
                          id="contact" 
                          value={workOrderData.customer.contact}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={workOrderData.customer.phone}
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
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Work Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Items content will be implemented here.</p>
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
        </Tabs>

        {/* Footer Actions */}
        <Card className="mt-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              {/* Created/Modified Info */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <span>Created By:</span>
                  <span className="font-medium">{workOrderData.createdBy}</span>
                  <span>{workOrderData.createdDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Modified By:</span>
                  <span className="font-medium">{workOrderData.modifiedBy}</span>
                  <span>{workOrderData.modifiedDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button>
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
