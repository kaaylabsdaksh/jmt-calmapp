import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { X, Download, Settings, User, CreditCard, Users, Package, FileText, Calculator, AlertCircle, ExternalLink, Award, Shield, BarChart, Save, LayoutGrid, Table, ChevronDown, Plus, PlusCircle, QrCode, Copy, PackagePlus, Menu } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkOrderItemsTable } from "@/components/WorkOrderItemsTable";
import { WorkOrderItemsCards } from "@/components/WorkOrderItemsCards";
import { WorkOrderItemsReceiving } from "@/components/WorkOrderItemsReceiving";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContactForm, ContactFormData } from "@/components/ContactForm";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EstimateDetails } from "@/components/EstimateDetails";
import { RFIDDialog } from "@/components/RFIDDialog";
import { toast } from "@/hooks/use-toast";

const AddNewWorkOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Always ensure account field starts empty - this is the main entry point
  useEffect(() => {
    // Always reset account-related fields when component mounts
    setWorkOrderData(prev => ({
      ...prev,
      accountNumber: "",
      customer: "",
      srDocument: "",
      salesperson: "Not assigned",
      contact: ""
    }));
    // Reset to general tab when account is cleared
    setActiveTab("general");
  }, []);
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('addNewWorkOrderActiveTab');
    return savedTab || "general";
  });
  
  const [isRFIDDialogOpen, setIsRFIDDialogOpen] = useState(false);
  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [selectedSpecialAction, setSelectedSpecialAction] = useState<string>("");
  const [specialActionComment, setSpecialActionComment] = useState("");
  const [specialActionCommentType, setSpecialActionCommentType] = useState("");
  const [calFreqValue, setCalFreqValue] = useState("");
  const [poNumberValue, setPoNumberValue] = useState("");
  const [tfStatusValue, setTfStatusValue] = useState("");
  const [currentEslType, setCurrentEslType] = useState("");
  const [changeToEslType, setChangeToEslType] = useState("");
  const [clearInvoiceData, setClearInvoiceData] = useState(false);
  const [customerWaitStatus, setCustomerWaitStatus] = useState("");
  const [deliverByDate, setDeliverByDate] = useState("");

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('addNewWorkOrderActiveTab', activeTab);
  }, [activeTab]);
  const [workOrderData, setWorkOrderData] = useState(() => {
    const savedData = localStorage.getItem('workOrderData');
    return savedData ? JSON.parse(savedData) : {
      workOrderNumber: "WO-QOAV2I",
      srDocument: "",
      workOrderStatus: "Created",
      workOrderType: "Regular work order",
      accountNumber: "",
      customer: "",
      salesperson: "Not assigned",
      contact: ""
    };
  });

  // Save to localStorage whenever workOrderData changes
  useEffect(() => {
    localStorage.setItem('workOrderData', JSON.stringify(workOrderData));
  }, [workOrderData]);

  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'receiving'>('receiving');
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
    description: string;
    mfgSerial: string;
    custId: string;
    custSN: string;
    assetNumber: string;
    iso17025: string;
    estimate: string;
    newEquip: string;
    needByDate: string;
    ccCost: string;
    tf: string;
    capableLocations: string;
  }>>([
    {
      id: "rec-001",
      itemNumber: "DMM-001",
      calFreq: "12",
      actionCode: "rc",
      priority: "normal",
      manufacturer: "3d-instruments",
      model: "DM-5000",
      description: "Digital Multimeter with advanced measurement capabilities",
      mfgSerial: "SN123456",
      custId: "CUST-001",
      custSN: "C001",
      assetNumber: "ASSET-001",
      iso17025: "yes",
      estimate: "$125.00",
      newEquip: "no",
      needByDate: "2024-12-15",
      ccCost: "$50.00",
      tf: "yes",
      capableLocations: "Lab A, Lab B"
    },
    {
      id: "rec-002", 
      itemNumber: "OSC-002",
      calFreq: "3",
      actionCode: "repair",
      priority: "expedite",
      manufacturer: "3m",
      model: "OSC-3000",
      description: "High frequency oscilloscope for signal analysis",
      mfgSerial: "SN789012",
      custId: "CUST-002",
      custSN: "C002",
      assetNumber: "ASSET-002",
      iso17025: "yes",
      estimate: "$350.00",
      newEquip: "no",
      needByDate: "2024-11-30",
      ccCost: "$75.00",
      tf: "no",
      capableLocations: "Lab C"
    },
    {
      id: "rec-003",
      itemNumber: "PSU-003",
      calFreq: "1",
      actionCode: "cc",
      priority: "rush",
      manufacturer: "4b-components",
      model: "PWR-500",
      description: "Precision power supply unit with variable output",
      mfgSerial: "SN345678",
      custId: "CUST-003",
      custSN: "C003",
      assetNumber: "ASSET-003",
      iso17025: "no",
      estimate: "$225.00",
      newEquip: "yes",
      needByDate: "2024-12-10",
      ccCost: "$60.00",
      tf: "yes",
      capableLocations: "Lab A, Lab D"
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock account data
  const mockAccounts = [
    {
      accountNumber: "1500.00",
      customerName: "Entergy Inventory",
      srDocument: "SR2244",
      salesperson: "ZZEN - House - Entergy", 
      contact: "Brad Morrison"
    },
    {
      accountNumber: "1500.01",
      customerName: "Gulf Power Company",
      srDocument: "SR3345",
      salesperson: "John Smith - Gulf Power Rep",
      contact: "Mike Johnson"
    },
    {
      accountNumber: "0152.01", 
      customerName: "Florida Power & Light",
      srDocument: "SR4456",
      salesperson: "Sarah Wilson - FPL Account Manager",
      contact: "Lisa Anderson"
    },
    {
      accountNumber: "1500.03",
      customerName: "Duke Energy Corporation",
      srDocument: "SR5567",
      salesperson: "Robert Davis - Duke Energy Sales",
      contact: "Jennifer Martinez"
    },
    {
      accountNumber: "1500.04",
      customerName: "Southern Company Services",
      srDocument: "SR6678",
      salesperson: "Amanda Brown - Southern Rep",
      contact: "David Thompson"
    }
  ];

  const tabs = [
    { value: "general", label: "General", icon: User, shortLabel: "Gen" },
    { value: "account-info", label: "Account Info", icon: CreditCard, shortLabel: "Account" },
    { value: "contacts", label: "Work Order Contacts", icon: Users, shortLabel: "Contacts" },
    { value: "items", label: "Work Order Items", icon: Package, shortLabel: "Items" },
    { value: "quote", label: "Quote Details", icon: FileText, shortLabel: "Quote" },
    { value: "estimate", label: "Estimate", icon: Calculator, shortLabel: "Est" },
    { value: "fail-log", label: "Fail Log", icon: AlertCircle, shortLabel: "Fail" },
    { value: "external", label: "External Files", icon: ExternalLink, shortLabel: "Ext" },
    { value: "cert", label: "Cert Files", icon: Award, shortLabel: "Cert" },
    { value: "warranty", label: "Warranty", icon: Shield, shortLabel: "War" },
    { value: "qfd", label: "QFD Data", icon: BarChart, shortLabel: "QFD" }
  ];

  const currentTab = tabs.find(tab => tab.value === activeTab);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving work order:", workOrderData);
    toast({
      variant: "success",
      title: "Work Order Saved",
      description: "Your work order has been successfully created.",
    });
  };

  const handleCancel = () => {
    navigate("/");
  };

  // Function to check if a tab should be disabled
  const isTabDisabled = (tabValue: string) => {
    // Always disable warranty tab
    if (tabValue === "warranty") {
      return true;
    }
    // Only general tab is enabled if account number is not in format XXXX.XX or contact is not selected
    const isValidFormat = /^\d{4}\.\d{2}$/.test(workOrderData.accountNumber);
    const hasContact = workOrderData.contact && workOrderData.contact !== "";
    return tabValue !== "general" && (!isValidFormat || !hasContact);
  };

  // Function to check if form fields should be disabled (for contact field)
  const areFieldsDisabled = () => {
    const isValidFormat = /^\d{4}\.\d{2}$/.test(workOrderData.accountNumber);
    return !workOrderData.accountNumber || !isValidFormat;
  };

  // Function to check if other fields (non-contact) should be disabled
  const areOtherFieldsDisabled = () => {
    const isValidFormat = /^\d{4}\.\d{2}$/.test(workOrderData.accountNumber);
    const hasContact = workOrderData.contact && workOrderData.contact !== "";
    return !isValidFormat || !hasContact;
  };

  // Handle account number input change
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as XXXX.XX
    if (value.length > 4) {
      value = value.slice(0, 4) + '.' + value.slice(4, 6);
    }
    
    if (value.length === 0 || value === '.') {
      // Reset to default values when account number is cleared
      setWorkOrderData(prev => ({ 
        ...prev, 
        accountNumber: '',
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
      
      // Filter suggestions - match against the formatted number
      const searchValue = value.replace('.', '');
      const filtered = mockAccounts.filter(account => {
        const accountDigits = account.accountNumber.replace('.', '');
        return accountDigits.startsWith(searchValue) ||
               account.customerName.toLowerCase().includes(value.toLowerCase());
      });
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
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground">Add New Work Order</h1>
              <Breadcrumb className="mt-1">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      asChild 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs text-foreground font-medium">
                      Add New Work Order
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
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
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-20 sm:pb-24">
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Header Info Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Work Order #</Label>
                  <div className="text-base sm:text-lg font-bold text-foreground">{workOrderData.workOrderNumber}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="srDocument" className="text-sm font-medium text-foreground">SR Doc</Label>
                  <Input
                    id="srDocument"
                    placeholder="SR Document"
                    value={workOrderData.srDocument}
                    onChange={(e) => setWorkOrderData(prev => ({ ...prev, srDocument: e.target.value }))}
                    disabled={areOtherFieldsDisabled()}
                    className="h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Salesperson</Label>
                  <div className="text-sm text-foreground p-2 bg-muted rounded border">{workOrderData.salesperson}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Contact</Label>
                  <div className="text-sm text-foreground p-2 bg-muted rounded border">{workOrderData.contact || "Not assigned"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

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

            <TabsContent value="general" className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Account Number */}
                    <div className="space-y-2 relative" ref={inputRef}>
                      <Label htmlFor="accountNumber" className="text-sm font-medium">
                        Account # <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="accountNumber"
                          placeholder="0152.01"
                          value={workOrderData.accountNumber}
                          onChange={handleAccountNumberChange}
                          onKeyDown={handleKeyDown}
                          maxLength={7}
                          className={`h-9 sm:h-10 ${!workOrderData.accountNumber ? "border-destructive" : ""}`}
                        />
                        {!workOrderData.accountNumber && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-destructive rounded-full"></div>
                        )}
                        
                        {/* Suggestions Dropdown */}
                        {showSuggestions && accountSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {accountSuggestions.map((account, index) => (
                              <div
                                key={account.accountNumber}
                                className={`px-3 py-2 cursor-pointer transition-colors border-b last:border-b-0 ${
                                  index === highlightedSuggestion 
                                    ? 'bg-accent text-accent-foreground' 
                                    : 'hover:bg-muted'
                                }`}
                                onClick={() => handleSuggestionSelect(account)}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium text-sm">{account.accountNumber}</div>
                                    <div className="text-xs text-muted-foreground">{account.customerName}</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {account.srDocument}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-sm font-medium">
                        Contact <span className="text-destructive">*</span>
                      </Label>
                      <Select 
                        value={workOrderData.contact} 
                        onValueChange={(value) => setWorkOrderData(prev => ({ ...prev, contact: value }))}
                        disabled={areFieldsDisabled()}
                      >
                        <SelectTrigger className="h-9 sm:h-10">
                          <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60] max-h-60 overflow-y-auto">
                          {workOrderData.accountNumber && workOrderData.customer && (
                            <SelectItem 
                              value={mockAccounts.find(acc => acc.accountNumber === workOrderData.accountNumber)?.contact || "Not specified"}
                              className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
                            >
                              {mockAccounts.find(acc => acc.accountNumber === workOrderData.accountNumber)?.contact || "Not specified"}
                            </SelectItem>
                          )}
                          <SelectItem value="Brad Morrison" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Brad Morrison</SelectItem>
                          <SelectItem value="Sherry Davis" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Sherry Davis</SelectItem>
                          <SelectItem value="Morgan Mathias" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Morgan Mathias</SelectItem>
                          <SelectItem value="Jimmy Salinas" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Jimmy Salinas</SelectItem>
                          <SelectItem value="Naomi Gomez" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Naomi Gomez</SelectItem>
                          <SelectItem value="Morgan Wedelich" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Morgan Wedelich</SelectItem>
                          <SelectItem value="Amanda Phillips" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Amanda Phillips</SelectItem>
                          <SelectItem value="Jim Daigle" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Jim Daigle</SelectItem>
                          <SelectItem value="Zack Broome" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Zack Broome</SelectItem>
                          <SelectItem value="Debbie McAbee" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Debbie McAbee</SelectItem>
                          <SelectItem value="Chris Melancon" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Chris Melancon</SelectItem>
                          <SelectItem value="Lindsey Thurmon" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Lindsey Thurmon</SelectItem>
                          <SelectItem value="Rusty Rogers" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Rusty Rogers</SelectItem>
                          <SelectItem value="Zane Moore" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Zane Moore</SelectItem>
                          <SelectItem value="Jessica Creamer" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Jessica Creamer</SelectItem>
                          <SelectItem value="Hayley Smith" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">Hayley Smith</SelectItem>
                        </SelectContent>
                      </Select>
                      {!workOrderData.contact && (
                        <div className="absolute right-3 top-9 w-2 h-2 bg-destructive rounded-full"></div>
                      )}
                    </div>

                    {/* Work Order Number */}
                    <div className="space-y-2">
                      <Label htmlFor="workOrderNumber" className="text-sm font-medium">
                        Work Order # <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="workOrderNumber"
                        value={workOrderData.workOrderNumber}
                        onChange={(e) => setWorkOrderData(prev => ({ ...prev, workOrderNumber: e.target.value }))}
                        disabled={areOtherFieldsDisabled()}
                        className="h-9 sm:h-10"
                      />
                    </div>

                    {/* Work Order Status */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Work Order Status</Label>
                      <Select value={workOrderData.workOrderStatus} onValueChange={(value) => setWorkOrderData(prev => ({ ...prev, workOrderStatus: value }))} disabled={areOtherFieldsDisabled()}>
                        <SelectTrigger className="h-9 sm:h-10">
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
                      <Select value={workOrderData.workOrderType} onValueChange={(value) => setWorkOrderData(prev => ({ ...prev, workOrderType: value }))} disabled={areOtherFieldsDisabled()}>
                        <SelectTrigger className="h-9 sm:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular work order">Regular work order</SelectItem>
                          <SelectItem value="Onsite work order">Onsite work order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Customer */}
                    <div className="space-y-2">
                      <Label htmlFor="customer" className="text-sm font-medium">Customer</Label>
                      <Input
                        id="customer"
                        placeholder="Customer name"
                        value={workOrderData.customer}
                        onChange={(e) => setWorkOrderData(prev => ({ ...prev, customer: e.target.value }))}
                        disabled={areOtherFieldsDisabled()}
                        className="h-9 sm:h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholder content for other tabs */}
            <TabsContent value="account-info">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                  <div className="mt-6 sm:mt-8">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Customer Contacts</h3>
                    <div className="space-y-3 sm:space-y-0">
                      {/* Mobile Card View */}
                      <div className="sm:hidden space-y-3">
                        <div className="border rounded-lg p-3 bg-card">
                          <div className="font-medium text-sm mb-2">Netasha Gray</div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>netasha.gray@entergy.com</div>
                            <div>(225) 382-4878</div>
                            <div>Senior Buyer • Primary</div>
                          </div>
                        </div>
                        <div className="border rounded-lg p-3 bg-card">
                          <div className="font-medium text-sm mb-2">Barry White</div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>barry.white@entergy.com</div>
                            <div>(225) 382-4879</div>
                            <div>Procurement Manager • Secondary</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop Table View */}
                      <div className="hidden sm:block border rounded-lg overflow-hidden">
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-foreground">Account's Contact(s) for this Work Order:</h3>
                      <Button 
                        variant="default" 
                        className="bg-warning text-black hover:bg-warning/90"
                        onClick={() => setShowContactForm(true)}
                      >
                        Add Contact
                      </Button>
                    </div>
                    
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items">
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">Work Order Items</h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2 bg-background text-sm w-full sm:w-auto">
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
                            <Package className="w-4 h-4 mr-2" />
                            Receiving View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {(viewMode === 'table' || viewMode === 'cards') && (
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                          <Button
                            variant={viewMode === 'table' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className="flex items-center gap-1.5 h-8 px-3"
                          >
                            <Table className="w-4 h-4" />
                            <span className="hidden sm:inline">Table</span>
                          </Button>
                          <Button
                            variant={viewMode === 'cards' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('cards')}
                            className="flex items-center gap-1.5 h-8 px-3"
                          >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="hidden sm:inline">Grid</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-4 sm:space-y-6">
                     {/* Action Buttons */}
                    {viewMode === 'receiving' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <Button 
                          onClick={() => setIsQuickAddDialogOpen(true)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Quick Add New Items</span>
                          <span className="sm:hidden">Quick Add</span>
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm">
                          <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Print QR Sheet</span>
                          <span className="sm:hidden">QR Sheet</span>
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm">
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Copy From Other WO</span>
                          <span className="sm:hidden">Copy WO</span>
                        </Button>
                        <Button 
                          onClick={() => navigate('/unused-items')}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                        >
                          <PackagePlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Create Unused Items</span>
                          <span className="sm:hidden">Unused Items</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Column 1: Quick Add and Print QR stacked */}
                        <div className="space-y-2">
                          <Button 
                            onClick={() => navigate("/form-variations")}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Quick Add New Items
                          </Button>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm">
                            <QrCode className="w-4 h-4" />
                            Print QR Sheet
                          </Button>
                        </div>

                        {/* Column 2: Copy From Other WO with fields */}
                        <div className="bg-muted/30 border rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <Copy className="w-4 h-4" />
                            <span className="font-semibold text-sm">Copy From Other WO</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium whitespace-nowrap min-w-fit">Work Order:</Label>
                              <Input className="flex-1 border-gray-400" placeholder="WO#" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium whitespace-nowrap min-w-fit">Item #:</Label>
                              <Input className="w-20 border-gray-400" placeholder="From" />
                              <span className="text-sm text-muted-foreground">-</span>
                              <Input className="w-20 border-gray-400" placeholder="To" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium whitespace-nowrap min-w-fit">Groupable:</Label>
                              <Select>
                                <SelectTrigger className="flex-1 border-gray-400">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Create Unused Items with number input */}
                        <div className="bg-muted/30 border rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <PackagePlus className="w-4 h-4" />
                            <span className="font-semibold text-sm">Create Unused Items</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium whitespace-nowrap">Number of Items:</Label>
                              <Input 
                                type="number" 
                                className="w-24 border-gray-400" 
                                placeholder="0"
                                min="0"
                              />
                            </div>
                            <Button 
                              onClick={() => navigate('/unused-items')}
                              className="w-full bg-success hover:bg-success/90 text-white h-9"
                            >
                              Create Items
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Filter Controls - Below the three columns */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium whitespace-nowrap min-w-fit"># of Items:</Label>
                          <span className="text-sm font-medium min-w-fit">{selectedItemsCount}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-medium whitespace-nowrap min-w-fit">Special Action:</Label>
                          <Select
                            value={selectedSpecialAction}
                            onValueChange={(value) => {
                              setSelectedSpecialAction(value);
                              // Reset form fields when action changes
                              setSpecialActionComment("");
                              setSpecialActionCommentType("");
                              setCalFreqValue("");
                              setPoNumberValue("");
                              setTfStatusValue("");
                              setCurrentEslType("");
                              setChangeToEslType("");
                              setClearInvoiceData(false);
                              setCustomerWaitStatus("");
                              setDeliverByDate("");
                            }}
                          >
                            <SelectTrigger className="w-48 border-gray-400">
                              <SelectValue placeholder="Select action..." />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg z-50 max-h-60 overflow-y-auto">
                              <SelectItem value="none" className="text-muted-foreground italic">None</SelectItem>
                              <SelectItem value="add-comments">Add Comments</SelectItem>
                              <SelectItem value="cancel-items">Cancel Item(s)</SelectItem>
                              <SelectItem value="change-esl-type">Change ESL Type</SelectItem>
                              <SelectItem value="cust-reply-received">Cust Reply Received</SelectItem>
                              <SelectItem value="del-ticket-followup">Del Ticket Followup</SelectItem>
                              <SelectItem value="ready-to-bill">Ready to Bill</SelectItem>
                              <SelectItem value="to-ar">To A/R</SelectItem>
                              <SelectItem value="update-cal-freq">Update Cal Freq's</SelectItem>
                              <SelectItem value="update-po">Update PO #'s</SelectItem>
                              <SelectItem value="update-tf-status">Update T/F Status</SelectItem>
                              <SelectItem value="waiting-on-customer">Waiting on Customer</SelectItem>
                              <SelectItem value="wait-cust-followup">Wait Cust Followup</SelectItem>
                              <SelectItem value="update-deliver-by-date">Update Deliver By Date</SelectItem>
                              <SelectItem value="print-wos">Print WOs</SelectItem>
                              <SelectItem value="print-labels">Print Labels</SelectItem>
                              <SelectItem value="print-barcodes">Print Barcodes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Special Action Form Fields */}
                      {selectedSpecialAction && selectedSpecialAction !== "none" && (
                        <div className="bg-muted/30 border rounded-lg p-4 space-y-3 mt-4">
                          {/* Add Comments */}
                          {selectedSpecialAction === "add-comments" && (
                            <>
                              <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium whitespace-nowrap">Comment Type</Label>
                                <Select value={specialActionCommentType} onValueChange={setSpecialActionCommentType}>
                                  <SelectTrigger className="w-60 border-gray-400">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="general">General Comment</SelectItem>
                                    <SelectItem value="technical">Technical Note</SelectItem>
                                    <SelectItem value="customer">Customer Note</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label className="text-sm font-medium">Enter a comment</Label>
                                  <Select>
                                    <SelectTrigger className="w-48 border-gray-400 h-8">
                                      <SelectValue placeholder="Pre-select Comment Text" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border shadow-lg z-50">
                                      <SelectItem value="template1">Template 1</SelectItem>
                                      <SelectItem value="template2">Template 2</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <textarea
                                  className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                  placeholder="Enter comment..."
                                  value={specialActionComment}
                                  onChange={(e) => setSpecialActionComment(e.target.value)}
                                />
                                <Button size="sm" className="bg-success hover:bg-success/90">
                                  Set Comments
                                </Button>
                              </div>
                            </>
                          )}

                          {/* Cancel Item(s) */}
                          {selectedSpecialAction === "cancel-items" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium">Enter a comment</Label>
                                <Select>
                                  <SelectTrigger className="w-48 border-gray-400 h-8">
                                    <SelectValue placeholder="Pre-select Comment Text" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="template1">Template 1</SelectItem>
                                    <SelectItem value="template2">Template 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <textarea
                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                placeholder="Enter comment..."
                                value={specialActionComment}
                                onChange={(e) => setSpecialActionComment(e.target.value)}
                              />
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Cancel Item(s)
                              </Button>
                            </div>
                          )}

                          {/* Change ESL Type */}
                          {selectedSpecialAction === "change-esl-type" && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium whitespace-nowrap">Current Item:</Label>
                                <Select value={currentEslType} onValueChange={setCurrentEslType}>
                                  <SelectTrigger className="w-60 border-gray-400">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="type1">Type 1</SelectItem>
                                    <SelectItem value="type2">Type 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium whitespace-nowrap">Change to:</Label>
                                <Select value={changeToEslType} onValueChange={setChangeToEslType}>
                                  <SelectTrigger className="w-60 border-gray-400">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="type1">Type 1</SelectItem>
                                    <SelectItem value="type2">Type 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Change ESL Type
                              </Button>
                            </div>
                          )}

                          {/* Cust Reply Received */}
                          {selectedSpecialAction === "cust-reply-received" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium">Enter a comment</Label>
                                <Select>
                                  <SelectTrigger className="w-48 border-gray-400 h-8">
                                    <SelectValue placeholder="Pre-select Comment Text" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="template1">Template 1</SelectItem>
                                    <SelectItem value="template2">Template 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <textarea
                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                placeholder="Enter comment..."
                                value={specialActionComment}
                                onChange={(e) => setSpecialActionComment(e.target.value)}
                              />
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Set Customer Replied Received
                              </Button>
                            </div>
                          )}

                          {/* Del Ticket Followup */}
                          {selectedSpecialAction === "del-ticket-followup" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium">Enter a comment</Label>
                                <Select>
                                  <SelectTrigger className="w-48 border-gray-400 h-8">
                                    <SelectValue placeholder="Pre-select Comment Text" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="template1">Template 1</SelectItem>
                                    <SelectItem value="template2">Template 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <textarea
                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                placeholder="Enter comment..."
                                value={specialActionComment}
                                onChange={(e) => setSpecialActionComment(e.target.value)}
                              />
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Set Del Ticket Followup
                              </Button>
                            </div>
                          )}

                          {/* Ready to Bill */}
                          {selectedSpecialAction === "ready-to-bill" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Enter a comment</Label>
                              <textarea
                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                placeholder="Enter comment..."
                                value={specialActionComment}
                                onChange={(e) => setSpecialActionComment(e.target.value)}
                              />
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Set Ready To Bill
                              </Button>
                            </div>
                          )}

                          {/* To A/R */}
                          {selectedSpecialAction === "to-ar" && (
                            <>
                              <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium whitespace-nowrap">Comment Type</Label>
                                <Select value={specialActionCommentType} onValueChange={setSpecialActionCommentType}>
                                  <SelectTrigger className="w-60 border-gray-400">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="general">General Comment</SelectItem>
                                    <SelectItem value="technical">Technical Note</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id="clearInvoice"
                                  checked={clearInvoiceData}
                                  onCheckedChange={(checked) => setClearInvoiceData(checked as boolean)}
                                />
                                <Label htmlFor="clearInvoice" className="text-sm font-medium cursor-pointer">
                                  Clear Invoice Data
                                </Label>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label className="text-sm font-medium">Enter a comment</Label>
                                  <Select>
                                    <SelectTrigger className="w-48 border-gray-400 h-8">
                                      <SelectValue placeholder="Pre-select Comment Text" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border shadow-lg z-50">
                                      <SelectItem value="template1">Template 1</SelectItem>
                                      <SelectItem value="template2">Template 2</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <textarea
                                  className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                  placeholder="Enter comment..."
                                  value={specialActionComment}
                                  onChange={(e) => setSpecialActionComment(e.target.value)}
                                />
                                <Button size="sm" className="bg-success hover:bg-success/90">
                                  To A/R
                                </Button>
                              </div>
                            </>
                          )}

                          {/* Update Cal Freq's */}
                          {selectedSpecialAction === "update-cal-freq" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium whitespace-nowrap">Cal Freq:</Label>
                                <Input
                                  className="w-40 border-gray-400"
                                  placeholder="Enter frequency"
                                  value={calFreqValue}
                                  onChange={(e) => setCalFreqValue(e.target.value)}
                                />
                              </div>
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Update Cal Freq's
                              </Button>
                            </div>
                          )}

                          {/* Update PO #'s */}
                          {selectedSpecialAction === "update-po" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Enter a PO Number</Label>
                              <Input
                                className="w-60 border-gray-400"
                                placeholder="PO Number"
                                value={poNumberValue}
                                onChange={(e) => setPoNumberValue(e.target.value)}
                              />
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Update PO #'s
                              </Button>
                            </div>
                          )}

                          {/* Update T/F Status */}
                          {selectedSpecialAction === "update-tf-status" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium">Enter a comment</Label>
                                <Select>
                                  <SelectTrigger className="w-48 border-gray-400 h-8">
                                    <SelectValue placeholder="Pre-select Comment Text" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="template1">Template 1</SelectItem>
                                    <SelectItem value="template2">Template 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <textarea
                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                placeholder="Enter comment..."
                                value={specialActionComment}
                                onChange={(e) => setSpecialActionComment(e.target.value)}
                              />
                              <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium whitespace-nowrap">Enter T/F Status</Label>
                                <Select value={tfStatusValue} onValueChange={setTfStatusValue}>
                                  <SelectTrigger className="w-60 border-gray-400">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="pass">Pass</SelectItem>
                                    <SelectItem value="fail">Fail</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Update T/F Status
                              </Button>
                            </div>
                          )}

                          {/* Wait Cust Followup */}
                          {selectedSpecialAction === "wait-cust-followup" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium">Enter a comment</Label>
                                <Select>
                                  <SelectTrigger className="w-48 border-gray-400 h-8">
                                    <SelectValue placeholder="Pre-select Comment Text" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="template1">Template 1</SelectItem>
                                    <SelectItem value="template2">Template 2</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <textarea
                                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                placeholder="Enter comment..."
                                value={specialActionComment}
                                onChange={(e) => setSpecialActionComment(e.target.value)}
                              />
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Wait Cust Followup
                              </Button>
                            </div>
                          )}

                          {/* Waiting on Customer */}
                          {selectedSpecialAction === "waiting-on-customer" && (
                            <>
                              <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium whitespace-nowrap">Customer Wait Status</Label>
                                <Select value={customerWaitStatus} onValueChange={setCustomerWaitStatus}>
                                  <SelectTrigger className="w-60 border-gray-400">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="pending-response">Pending Response</SelectItem>
                                    <SelectItem value="awaiting-approval">Awaiting Approval</SelectItem>
                                    <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label className="text-sm font-medium">Enter a comment</Label>
                                  <Select>
                                    <SelectTrigger className="w-48 border-gray-400 h-8">
                                      <SelectValue placeholder="Pre-select Comment Text" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border shadow-lg z-50">
                                      <SelectItem value="template1">Template 1</SelectItem>
                                      <SelectItem value="template2">Template 2</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <textarea
                                  className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                  placeholder="Enter comment..."
                                  value={specialActionComment}
                                  onChange={(e) => setSpecialActionComment(e.target.value)}
                                />
                                <Button size="sm" className="bg-success hover:bg-success/90">
                                  Set Waiting on Customer
                                </Button>
                              </div>
                            </>
                          )}

                          {/* Update Deliver By Date */}
                          {selectedSpecialAction === "update-deliver-by-date" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Enter Deliver By Date</Label>
                              <Input
                                type="date"
                                className="w-60 border-gray-400"
                                value={deliverByDate}
                                onChange={(e) => setDeliverByDate(e.target.value)}
                              />
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                Update Deliver By Date
                              </Button>
                            </div>
                          )}

                          {/* Print WOs */}
                          {selectedSpecialAction === "print-wos" && (
                            <Button size="sm" className="bg-muted text-foreground hover:bg-muted/90 border">
                              Print WOs
                            </Button>
                          )}

                          {/* Print Labels */}
                          {selectedSpecialAction === "print-labels" && (
                            <Button size="sm" className="bg-muted text-foreground hover:bg-muted/90 border">
                              Print Label
                            </Button>
                          )}

                          {/* Print Barcodes */}
                          {selectedSpecialAction === "print-barcodes" && (
                            <Button size="sm" className="bg-muted text-foreground hover:bg-muted/90 border">
                              Print Barcodes
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                    {/* Conditional View Rendering */}
                    {viewMode === 'receiving' ? (
                      <WorkOrderItemsReceiving 
                        items={receivingItems} 
                        setItems={setReceivingItems}
                        isQuickAddDialogOpen={isQuickAddDialogOpen}
                        setIsQuickAddDialogOpen={setIsQuickAddDialogOpen}
                        onSelectedItemsChange={setSelectedItemsCount}
                      />
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
              <EstimateDetails />
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
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-lg">
        <div className="w-full flex items-center justify-end gap-2 sm:gap-3">
          <Button 
            variant="ghost" 
            onClick={handleCancel} 
            className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 disabled:opacity-50 h-8 sm:h-9"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!/^\d{4}\.\d{2}$/.test(workOrderData.accountNumber) || !workOrderData.contact}
            className="bg-success text-success-foreground hover:bg-success/90 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed h-8 sm:h-9"
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

      {/* RFID Dialog */}
      <RFIDDialog 
        open={isRFIDDialogOpen}
        onOpenChange={setIsRFIDDialogOpen}
      />
    </div>
  );
};

export default AddNewWorkOrder;