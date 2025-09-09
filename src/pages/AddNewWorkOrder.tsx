import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, X, Download, Settings, User, CreditCard, Users, Package, FileText, Calculator, AlertCircle, ExternalLink, Award, Shield, BarChart, Save, LayoutGrid, Table, ChevronDown, Plus, PlusCircle, QrCode, Copy, PackagePlus, Menu } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkOrderItemsTable } from "@/components/WorkOrderItemsTable";
import { WorkOrderItemsCards } from "@/components/WorkOrderItemsCards";
import { WorkOrderItemsReceiving } from "@/components/WorkOrderItemsReceiving";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContactForm, ContactFormData } from "@/components/ContactForm";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AddNewWorkOrder = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("items");
  const [workOrderData, setWorkOrderData] = useState({
    workOrderNumber: "WO-QOAV2I",
    srDocument: "",
    workOrderStatus: "Created",
    workOrderType: "Regular work order",
    accountNumber: "",
    customer: "",
    salesperson: "Not assigned",
    contact: ""
  });

  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'receiving'>('cards');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [accountSuggestions, setAccountSuggestions] = useState<Array<{accountNumber: string, customerName: string, srDocument: string, salesperson: string, contact: string}>>([]);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(-1);
  const [showContactForm, setShowContactForm] = useState(false);
  const [receivingItems, setReceivingItems] = useState<Array<{
    id: string;
    itemNumber: string;
    calFreq: string;
    actionCode: string;
    priority: string;
    manufacturer: string;
    model: string;
    mfgSerial: string;
    custId: string;
    custSN: string;
    barcodeNum: string;
    warranty: string;
    iso17025: string;
    estimate: string;
    newEquip: string;
    needByDate: string;
  }>>([
    {
      id: "rec-001",
      itemNumber: "DMM-001",
      calFreq: "annual",
      actionCode: "rc",
      priority: "normal",
      manufacturer: "3d-instruments",
      model: "DM-5000",
      mfgSerial: "SN123456",
      custId: "CUST-001",
      custSN: "C001",
      barcodeNum: "BC001234567",
      warranty: "yes",
      iso17025: "yes",
      estimate: "$125.00",
      newEquip: "no",
      needByDate: "2024-12-15"
    },
    {
      id: "rec-002", 
      itemNumber: "OSC-002",
      calFreq: "quarterly",
      actionCode: "repair",
      priority: "expedite",
      manufacturer: "3m",
      model: "OSC-3000",
      mfgSerial: "SN789012",
      custId: "CUST-002",
      custSN: "C002",
      barcodeNum: "BC002345678",
      warranty: "no",
      iso17025: "yes",
      estimate: "$350.00",
      newEquip: "no",
      needByDate: "2024-11-30"
    },
    {
      id: "rec-003",
      itemNumber: "PSU-003",
      calFreq: "monthly",
      actionCode: "cc",
      priority: "rush",
      manufacturer: "4b-components",
      model: "PWR-500",
      mfgSerial: "SN345678",
      custId: "CUST-003",
      custSN: "C003",
      barcodeNum: "BC003456789",
      warranty: "yes",
      iso17025: "no",
      estimate: "$85.00",
      newEquip: "yes",
      needByDate: "2024-12-01"
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock account data
  const mockAccounts = [
    {
      accountNumber: "15000",
      customerName: "Entergy Inventory",
      srDocument: "SR2244",
      salesperson: "ZZEN - House - Entergy", 
      contact: "Brad Morrison"
    },
    {
      accountNumber: "15001",
      customerName: "Gulf Power Company",
      srDocument: "SR3345",
      salesperson: "John Smith - Gulf Power Rep",
      contact: "Mike Johnson"
    },
    {
      accountNumber: "15002", 
      customerName: "Florida Power & Light",
      srDocument: "SR4456",
      salesperson: "Sarah Wilson - FPL Account Manager",
      contact: "Lisa Anderson"
    },
    {
      accountNumber: "15003",
      customerName: "Duke Energy Corporation",
      srDocument: "SR5567",
      salesperson: "Robert Davis - Duke Energy Sales",
      contact: "Jennifer Martinez"
    },
    {
      accountNumber: "15004",
      customerName: "Southern Company Services",
      srDocument: "SR6678",
      salesperson: "Amanda Brown - Southern Rep",
      contact: "David Thompson"
    }
  ];

  const tabs = [
    { value: "items", label: "Work Order Items", icon: Package, shortLabel: "Items" },
    { value: "estimate", label: "Estimate", icon: Calculator, shortLabel: "Est" },
    { value: "qfd", label: "QF3 Data", icon: BarChart, shortLabel: "QF3" }
  ];

  const currentTab = tabs.find(tab => tab.value === activeTab);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving work order:", workOrderData);
  };

  const handleCancel = () => {
    navigate("/");
  };

  // Function to check if a tab should be disabled
  const isTabDisabled = (tabValue: string) => {
    // No tabs are disabled in this simplified version
    return false;
  };

  // Function to check if form fields should be disabled
  const areFieldsDisabled = () => {
    return !workOrderData.accountNumber || workOrderData.accountNumber.length !== 5;
  };

  // Handle account number input change
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5); // Only allow 5 digits
    
    if (value.length === 0) {
      // Reset to default values when account number is cleared
      setWorkOrderData(prev => ({ 
        ...prev, 
        accountNumber: value,
        customer: "",
        srDocument: "",
        salesperson: "Not assigned",
        contact: ""
      }));
      setShowSuggestions(false);
      setAccountSuggestions([]);
    } else {
      // Clear contact when account changes (before selection is made)
      setWorkOrderData(prev => ({ 
        ...prev, 
        accountNumber: value,
        contact: ""
      }));
      
      const filtered = mockAccounts.filter(account => 
        account.accountNumber.startsWith(value) ||
        account.customerName.toLowerCase().includes(value.toLowerCase())
      );
      setAccountSuggestions(filtered);
      setShowSuggestions(true);
      setHighlightedSuggestion(-1);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (account: typeof mockAccounts[0]) => {
    setWorkOrderData(prev => ({
      ...prev,
      accountNumber: account.accountNumber,
      customer: account.customerName,
      srDocument: account.srDocument,
      salesperson: account.salesperson,
      contact: account.contact
    }));
    setShowSuggestions(false);
    setAccountSuggestions([]);
  };

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || accountSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedSuggestion(prev => 
          prev < accountSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedSuggestion(prev => 
          prev > 0 ? prev - 1 : accountSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedSuggestion >= 0) {
          handleSuggestionSelect(accountSuggestions[highlightedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedSuggestion(-1);
        break;
    }
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContactSave = (contactData: ContactFormData) => {
    console.log("Contact saved:", contactData);
    // Update the work order data with the new contact
    const fullName = `${contactData.firstName} ${contactData.lastName}`.trim();
    setWorkOrderData(prev => ({
      ...prev,
      contact: fullName || contactData.emailAddress || "Contact Added"
    }));
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation Bar */}
      <div className="bg-card border-b px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="p-2 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-105" />
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-white hover:bg-blue-500 hover:shadow-md transition-all duration-300 transform hover:scale-105 shrink-0 rounded-lg px-3 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Work Orders</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground text-center flex-1 mx-4">Add New Work Order</h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 sm:px-6 py-6 pb-24">
        <div className="w-full space-y-6">
          {/* Header Info Section */}
          <div className="bg-card border rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Work Order #</Label>
                <div className="text-lg font-semibold text-foreground mt-1">{workOrderData.workOrderNumber}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">SR Doc</Label>
                <Input
                  placeholder="SR Document"
                  value={workOrderData.srDocument}
                  onChange={(e) => setWorkOrderData(prev => ({ ...prev, srDocument: e.target.value }))}
                  className="mt-1 bg-background"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Salesperson</Label>
                <div className="text-sm text-foreground mt-1 py-2">{workOrderData.salesperson}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
                <div className="text-sm text-foreground mt-1 py-2">{workOrderData.contact || "Not assigned"}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => !isTabDisabled(value) && setActiveTab(value)} className="space-y-6">
            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between bg-card border shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      {currentTab && (
                        <currentTab.icon className="w-4 h-4" />
                      )}
                      <span>{currentTab?.label}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-popover border shadow-lg z-50" align="start">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const disabled = isTabDisabled(tab.value);
                    return (
                      <DropdownMenuItem 
                        key={tab.value}
                        onSelect={() => !disabled && setActiveTab(tab.value)}
                        disabled={disabled}
                        className={`flex items-center gap-2 cursor-pointer hover:bg-muted ${
                          disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <TabsList className="h-auto p-0 bg-transparent gap-2 sm:gap-3 flex flex-wrap justify-start">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const disabled = isTabDisabled(tab.value);
                  return (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value}
                      disabled={disabled}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-card border rounded-lg text-xs sm:text-sm font-medium transition-all shadow-sm ${
                        disabled 
                          ? 'opacity-50 cursor-not-allowed hover:bg-card data-[state=active]:bg-card data-[state=active]:text-foreground'
                          : 'hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                      }`}
                    >
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.shortLabel}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            )}

            <TabsContent value="items">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Work Order Items</h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2 bg-background">
                          {viewMode === 'receiving' ? 'Receiving View' : 'Default View'}
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-background border shadow-lg z-50" align="end">
                        <DropdownMenuItem 
                          onClick={() => setViewMode('cards')}
                          className={`cursor-pointer ${viewMode === 'cards' || viewMode === 'table' ? 'bg-muted' : ''}`}
                        >
                          Default View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setViewMode('receiving')}
                          className={`cursor-pointer ${viewMode === 'receiving' ? 'bg-muted' : ''}`}
                        >
                          Receiving View
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-6">
                     {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      <Button 
                        onClick={() => navigate("/form-variations")}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold flex items-center justify-center gap-2 h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        Add New Item
                      </Button>
                      <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2 h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                        <PlusCircle className="w-4 h-4" />
                        Add New Item w/PO
                      </Button>
                      <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold flex items-center justify-center gap-2 h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                        <QrCode className="w-4 h-4" />
                        Print QR Sheet
                      </Button>
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold flex items-center justify-center gap-2 h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                        <Copy className="w-4 h-4" />
                        Copy From Other WO
                      </Button>
                      <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold flex items-center justify-center gap-2 h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                        <PackagePlus className="w-4 h-4" />
                        Create Unused Items
                      </Button>
                    </div>

                    {/* Filter Controls */}
                    <div className="bg-muted/30 p-4 rounded-lg overflow-x-auto">
                      <div className="flex items-center gap-4 min-w-fit">
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
                            <SelectTrigger className="w-48 border-gray-400">
                              <SelectValue placeholder="Select action..." />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50 max-h-60 overflow-y-auto">
                              <SelectItem value="add-comments">Add Comments</SelectItem>
                              <SelectItem value="cancel-items">Cancel Item(s)</SelectItem>
                              <SelectItem value="change-esl-type">Change ESL Type</SelectItem>
                              <SelectItem value="cust-reply-received">Cust Reply Received</SelectItem>
                              <SelectItem value="del-ticket-followup">Del Ticket Followup</SelectItem>
                              <SelectItem value="ready-to-bill">Ready to Bill</SelectItem>
                              <SelectItem value="to-ar">To A/R</SelectItem>
                              <SelectItem value="update-cal-freqs">Update Cal Freqs</SelectItem>
                              <SelectItem value="update-po-numbers">Update PO #'s</SelectItem>
                              <SelectItem value="update-tf-status">Update T/F Status</SelectItem>
                              <SelectItem value="waiting-on-customer">Waiting on Customer</SelectItem>
                              <SelectItem value="wait-cust-followup">Wait Cust Followup</SelectItem>
                              <SelectItem value="update-deliver-by-date">Update Deliver By Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Conditional View Rendering */}
                    {viewMode === 'receiving' ? (
                      <WorkOrderItemsReceiving items={receivingItems} setItems={setReceivingItems} />
                    ) : viewMode === 'table' ? (
                      <WorkOrderItemsTable />
                    ) : (
                      <WorkOrderItemsCards templateItems={receivingItems} />
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
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="w-full flex items-center justify-end gap-2 sm:gap-3">
          <Button 
            variant="ghost" 
            onClick={handleCancel} 
            disabled={workOrderData.accountNumber.length !== 5}
            className="text-muted-foreground hover:text-foreground text-sm px-3 py-2 disabled:opacity-50"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={workOrderData.accountNumber.length !== 5}
            className="bg-success text-success-foreground hover:bg-success/90 text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Save Work Order</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>

      {/* Contact Form Dialog */}
      <ContactForm 
        open={showContactForm}
        onOpenChange={setShowContactForm}
        onSave={handleContactSave}
      />
    </div>
  );
};

export default AddNewWorkOrder;