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
import { X, Download, Settings, User, CreditCard, Users, Package, FileText, Calculator, AlertCircle, ExternalLink, Award, Shield, BarChart, Save, LayoutGrid, Table, ChevronDown, Plus, PlusCircle, QrCode, Copy, PackagePlus, Menu, Wand2, BookmarkCheck, CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkOrderItemsTable } from "@/components/WorkOrderItemsTable";
import { WorkOrderItemsCards } from "@/components/WorkOrderItemsCards";
import { WorkOrderItemsReceiving } from "@/components/WorkOrderItemsReceiving";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContactForm, ContactFormData } from "@/components/ContactForm";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { EstimateDetails } from "@/components/EstimateDetails";
import { RFIDDialog } from "@/components/RFIDDialog";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const EditBatchWorkOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { open: sidebarOpen } = useSidebar();

  // Check for navigation state on mount
  useEffect(() => {
    if (location.state && 'workOrderId' in location.state) {
      // Coming from work order click - pre-fill and show general tab
      const { accountNumber, customer, workOrderId } = location.state as { 
        accountNumber: string; 
        customer: string; 
        workOrderId: string;
      };
      
      setWorkOrderData(prev => ({
        ...prev,
        accountNumber: accountNumber,
        customer: customer,
        srDocument: "SR2244", // Mock data
        salesperson: "ZZEN - House - Entergy",
        contact: "Brad Morrison"
      }));
      setIsSaved(true);
      setHasContact(true);
      setActiveTab("general");
    } else {
      // Normal entry - reset fields
      setWorkOrderData(prev => ({
        ...prev,
        accountNumber: "",
        customer: "",
        srDocument: "",
        salesperson: "Not assigned",
        contact: "no-contact"
      }));
      setActiveTab("general");
    }
  }, [location.state]);
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('addNewWorkOrderActiveTab');
    return savedTab || "general";
  });
  
  const [isRFIDDialogOpen, setIsRFIDDialogOpen] = useState(false);
  const [isCopyConfirmDialogOpen, setIsCopyConfirmDialogOpen] = useState(false);
  
  // Copy from other WO states
  const [isCopyFromWOExpanded, setIsCopyFromWOExpanded] = useState(false);
  const [isSpecialActionExpanded, setIsSpecialActionExpanded] = useState(false);
  const [isCreateUnusedItemsExpanded, setIsCreateUnusedItemsExpanded] = useState(false);
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(false);
  const [quickAddData, setQuickAddData] = useState({
    type: "SINGLE",
    calFreq: "",
    priority: "Normal",
    location: "Baton Rouge",
    division: "Lab",
    actionCode: "",
    arrivalDate: "",
    arrivalType: "",
    arrivalLocation: "",
    shipType: "",
    customerName: "",
    driver: "",
    puDate: "",
    poNumber: "",
    needByDate: "",
    deliverByDate: "",
    soNumber: "",
    newEquip: false,
    iso17025: false,
    multiParts: false,
    estimate: false,
    usedSurplus: false
  });
  const [numUnusedItems, setNumUnusedItems] = useState("");
  const [copyWorkOrder, setCopyWorkOrder] = useState("");
  const [copyItemFrom, setCopyItemFrom] = useState("");
  const [copyItemTo, setCopyItemTo] = useState("");
  const [copyGroupable, setCopyGroupable] = useState("");
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
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
  
  // Customer Quote Selection
  const [selectedQuote, setSelectedQuote] = useState("48020");
  const [selectedQuoteItems, setSelectedQuoteItems] = useState<number[]>([]);
  
  // Customer PO Selection
  const [selectedCustPO, setSelectedCustPO] = useState("4510114092");
  const [custPOPageSize, setCustPOPageSize] = useState(5);
  const [custPOCurrentPage, setCustPOCurrentPage] = useState(1);
  
  // Mock data for Customer Purchase Orders
  const custPOData = [
    { id: "4510114092", date: "2024-01-15" },
    { id: "4510114093", date: "2024-01-16" },
    { id: "4510114094", date: "2024-01-17" },
    { id: "4510114095", date: "2024-01-18" },
    { id: "4510114096", date: "2024-01-19" },
    { id: "4510114097", date: "2024-01-20" },
    { id: "4510114098", date: "2024-01-21" },
    { id: "4510114099", date: "2024-01-22" },
  ];
  
  // Mock data for different customer quotes
  const quoteData = {
    "48020": {
      received: {
        calFreq: "12",
        location: "alexandria",
        division: "lab",
        poNumber: "W/OPO",
        arrivalDate: "2016-03-28",
        arrivalType: "onsite",
        priority: "rush",
        needByDate: "2016-04-05"
      },
      items: [
        {
          manufacturer: "AEMC",
          model: "275HVD",
          description: "HIGH VOLTAGE DETECTOR",
          qty: "1",
          prevWO: "-",
          woItem: "",
          serialNumber: "",
          custId: "",
          custSerial: "",
          priority: "normal",
          repair: false,
          iso17025: false
        },
        {
          manufacturer: "A.B. CHANCE",
          model: "C403-0979",
          description: "VOLTAGE DETECTOR",
          qty: "1",
          prevWO: "-",
          woItem: "802614-001",
          serialNumber: "",
          custId: "SX-17933",
          custSerial: "",
          priority: "normal",
          repair: false,
          iso17025: false,
          highlighted: true
        }
      ]
    },
    "48034": {
      received: {
        calFreq: "6",
        location: "houston",
        division: "field",
        poNumber: "PO-12345",
        arrivalDate: "2016-04-15",
        arrivalType: "pickup",
        priority: "expedite",
        needByDate: "2016-04-20"
      },
      items: [
        {
          manufacturer: "FLUKE",
          model: "87V",
          description: "DIGITAL MULTIMETER",
          qty: "2",
          prevWO: "801500",
          woItem: "801500-001",
          serialNumber: "12345678",
          custId: "FLUKE-001",
          custSerial: "SN001",
          priority: "expedite",
          repair: true,
          iso17025: true
        },
        {
          manufacturer: "KEYSIGHT",
          model: "34465A",
          description: "BENCHTOP MULTIMETER",
          qty: "1",
          prevWO: "-",
          woItem: "",
          serialNumber: "MY54321",
          custId: "KEY-002",
          custSerial: "SN002",
          priority: "rush",
          repair: false,
          iso17025: true
        },
        {
          manufacturer: "TEKTRONIX",
          model: "TBS1052B",
          description: "OSCILLOSCOPE",
          qty: "1",
          prevWO: "801600",
          woItem: "801600-003",
          serialNumber: "TEK789",
          custId: "TEK-003",
          custSerial: "SN003",
          priority: "normal",
          repair: true,
          iso17025: false,
          highlighted: true
        }
      ]
    }
  };
  

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
      contact: "no-contact"
    };
  });

  const [isSaved, setIsSaved] = useState(false);
  const [hasContact, setHasContact] = useState(false);

  // Save to localStorage whenever workOrderData changes
  useEffect(() => {
    localStorage.setItem('workOrderData', JSON.stringify(workOrderData));
  }, [workOrderData]);

  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'receiving'>(() => {
    const savedViewMode = localStorage.getItem('workOrderViewMode');
    return (savedViewMode as 'table' | 'cards' | 'receiving') || 'receiving';
  });

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workOrderViewMode', viewMode);
  }, [viewMode]);
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
    setIsSaved(true);
    
    // Check if contact is selected
    const contactSelected = workOrderData.contact && workOrderData.contact !== "no-contact";
    if (contactSelected) {
      setHasContact(true);
    }
    
    toast({
      variant: "success",
      title: "Work Order Saved",
      description: "Your work order has been successfully created.",
      duration: 1500,
    });
  };

  const handleCancel = () => {
    navigate("/");
  };

  // Function to check if a tab should be disabled
  const isTabDisabled = (tabValue: string) => {
    // Always disable these tabs
    if (["warranty", "estimate", "fail-log", "cert"].includes(tabValue)) {
      return true;
    }
    
    const isValidFormat = /^\d{4}\.\d{2}$/.test(workOrderData.accountNumber);
    
    // If no valid account, only general is enabled
    if (!isValidFormat) {
      return tabValue !== "general";
    }
    
    // If account is valid but not saved yet, only general is enabled
    if (!isSaved) {
      return tabValue !== "general";
    }
    
    // If saved but no contact selected yet, enable general, account-info, and contacts
    if (!hasContact) {
      return !["general", "account-info", "contacts"].includes(tabValue);
    }
    
    // If saved with contact, enable all tabs except the disabled ones
    return false;
  };

  // Function to check if form fields should be disabled (for contact field)
  const areFieldsDisabled = () => {
    const isValidFormat = /^\d{4}\.\d{2}$/.test(workOrderData.accountNumber);
    return !workOrderData.accountNumber || !isValidFormat;
  };

  // Function to check if other fields (non-contact) should be disabled
  const areOtherFieldsDisabled = () => {
    return !hasContact;
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
        contact: "no-contact"
      }));
      setIsSaved(false);
      setHasContact(false);
      setShowSuggestions(false);
      setAccountSuggestions([]);
    } else {
      // Clear contact when account changes (before selection is made)
      setWorkOrderData(prev => ({ 
        ...prev, 
        accountNumber: value,
        contact: "no-contact"
      }));
      setIsSaved(false);
      setHasContact(false);
      
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

  // Handler for Copy from Other WO
  const handleCopyFromOtherWO = () => {
    // Validate Work Order # is mandatory
    if (!copyWorkOrder) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a Work Order number",
        duration: 1500,
      });
      return;
    }

    // Validate that either Item # From OR Groupable is filled (at least one)
    const hasItemRange = copyItemFrom && copyItemFrom.trim() !== '';
    const hasGroupable = copyGroupable && copyGroupable !== '';
    
    if (!hasItemRange && !hasGroupable) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please either enter Item # From or select Groupable",
        duration: 1500,
      });
      return;
    }

    // Show confirmation dialog
    setIsCopyConfirmDialogOpen(true);
  };

  // Actually perform the copy after confirmation
  const confirmCopyFromOtherWO = () => {
    // Mock data for items from other work orders
    const mockOtherWOItems = [
      {
        id: `copy-${Date.now()}-1`,
        itemNumber: "TEMP-001",
        calFreq: "6",
        actionCode: "rc",
        priority: "normal",
        manufacturer: "fluke",
        model: "87V",
        description: "Digital Multimeter - Copied from WO",
        mfgSerial: "SN987654",
        custId: "CUST-004",
        custSN: "C004",
        assetNumber: "ASSET-004",
        iso17025: "yes",
        estimate: "$150.00",
        newEquip: "no",
        needByDate: "2024-12-20",
        ccCost: "$55.00",
        tf: "yes",
        capableLocations: "Lab A"
      },
      {
        id: `copy-${Date.now()}-2`,
        itemNumber: "TEMP-002",
        calFreq: "12",
        actionCode: "cc",
        priority: "expedite",
        manufacturer: "keysight",
        model: "34460A",
        description: "Digital Multimeter 6.5 Digit - Copied from WO",
        mfgSerial: "SN123789",
        custId: "CUST-005",
        custSN: "C005",
        assetNumber: "ASSET-005",
        iso17025: "yes",
        estimate: "$200.00",
        newEquip: "no",
        needByDate: "2024-12-25",
        ccCost: "$70.00",
        tf: "no",
        capableLocations: "Lab B, Lab C"
      }
    ];

    // Filter items based on criteria
    let itemsToAdd = [...mockOtherWOItems];

    // If item range is specified, filter by range
    const hasItemRange = copyItemFrom && copyItemTo;
    if (hasItemRange) {
      const fromNum = parseInt(copyItemFrom);
      const toNum = parseInt(copyItemTo);
      itemsToAdd = itemsToAdd.slice(fromNum - 1, toNum);
    }

    // Filter based on groupable selection (mock logic)
    if (copyGroupable) {
      itemsToAdd = copyGroupable === "yes" ? itemsToAdd : itemsToAdd.slice(0, 1);
    }

    // Add items to the receiving list
    setReceivingItems(prev => [...prev, ...itemsToAdd]);

    // Show success message
    toast({
      variant: "success",
      title: "Items Copied",
      description: `Successfully copied ${itemsToAdd.length} item(s) from Work Order ${copyWorkOrder}`,
      duration: 1500,
    });

    // Reset copy fields
    setCopyWorkOrder("");
    setCopyItemFrom("");
    setCopyItemTo("");
    setCopyGroupable("");
    setIsCopyConfirmDialogOpen(false);
  };

  return (
    <div className="bg-background min-h-screen">

      {/* Content Area */}
      <div className="py-4 sm:py-6 pb-20 sm:pb-24 px-3 sm:px-4 lg:px-6">
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Header Info Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Work Order #</Label>
                  <div className="text-base sm:text-lg font-bold text-foreground">{workOrderData.workOrderNumber}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="srDocument" className="text-sm font-medium text-foreground">SR Doc</Label>
                  <div className="relative">
                    <Input
                      id="srDocument"
                      placeholder="SR Document"
                      value={workOrderData.srDocument}
                      onChange={(e) => setWorkOrderData(prev => ({ ...prev, srDocument: e.target.value }))}
                      disabled={areOtherFieldsDisabled()}
                      className={`h-9 sm:h-10 ${workOrderData.srDocument ? 'text-primary underline cursor-pointer' : ''}`}
                      onClick={(e) => {
                        if (workOrderData.srDocument) {
                          e.preventDefault();
                          console.log('Opening SR Document:', workOrderData.srDocument);
                          // TODO: Navigate to SR document or open in modal
                        }
                      }}
                    />
                    {workOrderData.srDocument && (
                      <ExternalLink 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none"
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Salesperson</Label>
                  <div className="text-sm text-foreground p-2 bg-muted rounded border">{workOrderData.salesperson}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Contact</Label>
                  <div className="text-sm text-foreground p-2 bg-muted rounded border">{workOrderData.contact || "Not assigned"}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">&nbsp;</Label>
                  <div className="flex items-center h-9 sm:h-10">
                    <a 
                      href="#"
                      className="text-sm text-foreground underline hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Navigate to Misc Labor Parts and Pricing');
                        // TODO: Add navigation or modal for Misc Labor Parts and Pricing
                      }}
                    >
                      Misc Labor Parts and Pricing
                    </a>
                  </div>
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
                        value={workOrderData.contact || "no-contact"} 
                        onValueChange={(value) => setWorkOrderData(prev => ({ ...prev, contact: value === "no-contact" ? "" : value }))}
                        disabled={!isSaved}
                      >
                        <SelectTrigger className="h-9 sm:h-10">
                          <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60] max-h-60 overflow-y-auto">
                          <SelectItem value="no-contact" className="px-3 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white">(No contact selected)</SelectItem>
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
                      <Select value={workOrderData.workOrderStatus} onValueChange={(value) => setWorkOrderData(prev => ({ ...prev, workOrderStatus: value }))} disabled={true}>
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
                      <Select value={workOrderData.workOrderType} onValueChange={(value) => setWorkOrderData(prev => ({ ...prev, workOrderType: value }))} disabled={true}>
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

              {/* Customer PO Card - Only show after account is saved */}
              {isSaved && workOrderData.accountNumber && (
                <Card>
                  <Accordion type="single" collapsible defaultValue="cust-po">
                    <AccordionItem value="cust-po" className="border-0">
                      <AccordionTrigger className="px-4 sm:px-6 py-3 hover:no-underline">
                        <span className="text-sm font-semibold">Customer Purchase Orders</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          <div className="space-y-3">
                            {/* Dropdown */}
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium whitespace-nowrap">Cust PO #:</Label>
                              <Select value={selectedCustPO} onValueChange={setSelectedCustPO}>
                                <SelectTrigger className="h-9 w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border shadow-lg z-50">
                                  {custPOData.map((po) => (
                                    <SelectItem key={po.id} value={po.id}>{po.id}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Customer Purchase Orders Tabs */}
                            <div>
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {custPOData.map((po) => (
                                  <a
                                    key={po.id}
                                    href="#"
                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap px-3 py-1.5 text-sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Add hyperlink functionality here
                                      console.log('Clicked PO:', po.id);
                                    }}
                                  >
                                    {po.id}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              )}

              {/* RECEIVED Section - Only show after account is saved */}
              {isSaved && workOrderData.accountNumber && (
              <Card>
                <Accordion type="single" collapsible defaultValue="cust-quote">
                  <AccordionItem value="cust-quote" className="border-0">
                    <AccordionTrigger className="px-4 sm:px-6 py-3 hover:no-underline">
                      <span className="text-sm font-semibold">Customer Quote</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                        {/* Customer Quote Section with integrated tables */}
                        <div className="space-y-3">
                          {/* Dropdown */}
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium whitespace-nowrap">Cust Quote #:</Label>
                            <Select value={selectedQuote} onValueChange={setSelectedQuote}>
                              <SelectTrigger className="h-9 w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border shadow-lg z-50">
                                <SelectItem value="48020">48020</SelectItem>
                                <SelectItem value="48034">48034</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Tables Side by Side */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Customer Quotes Table */}
                            <div className="border rounded-lg overflow-hidden">
                              <table className="w-full text-xs">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="text-left p-2 font-medium text-foreground">Customer Quotes</th>
                                    <th className="text-left p-2 font-medium text-foreground">Type</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-card">
                                  <tr className="border-t">
                                    <td className="p-2">
                                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">48020</a>
                                    </td>
                                    <td className="p-2 text-foreground">Regular</td>
                                  </tr>
                                  <tr className="border-t">
                                    <td className="p-2">
                                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">48034</a>
                                    </td>
                                    <td className="p-2 text-foreground">ESL Onsite</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Other WO's & Quotes Table */}
                            <div className="border rounded-lg overflow-hidden">
                              <table className="w-full text-xs">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th colSpan={3} className="text-left p-2 font-medium text-foreground">Other WO's & Quotes</th>
                                  </tr>
                                  <tr className="border-t">
                                    <th className="text-left p-2 font-medium text-muted-foreground">Open</th>
                                    <th className="text-left p-2 font-medium text-muted-foreground">Closed</th>
                                    <th className="text-left p-2 font-medium text-muted-foreground">Quotes</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-card">
                                  <tr className="border-t">
                                    <td className="p-2">
                                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">802614</a>
                                    </td>
                                    <td className="p-2 text-foreground">-</td>
                                    <td className="p-2 text-foreground">-</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Remarks Section */}
                        <div className="border-2 border-destructive bg-destructive/5 rounded-lg p-3">
                          <p className="text-sm">
                            <span className="font-semibold text-destructive">Remarks:</span>{" "}
                            <span className="font-medium">ESL TIER 2 USE TAG NO# AS ID#!</span>
                          </p>
                        </div>

                        {/* RECEIVED Section */}
                        <div className="border rounded-lg">
                          <div className="bg-muted border-b px-3 py-1">
                            <h3 className="text-xs font-semibold text-center">RECEIVED</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-2">
                            {/* General Information */}
                            <div className="space-y-1.5">
                              <h4 className="text-xs font-medium text-muted-foreground border-b pb-0.5">General Information</h4>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <Label className="text-xs whitespace-nowrap min-w-[70px]">Cal Freq:</Label>
                                  <Input type="number" value={quoteData[selectedQuote].received.calFreq} className="h-7 text-xs" readOnly />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Label className="text-xs whitespace-nowrap min-w-[70px]">Location:</Label>
                                  <Select value={quoteData[selectedQuote].received.location}>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border shadow-lg z-50">
                                      <SelectItem value="alexandria">Alexandria</SelectItem>
                                      <SelectItem value="baton-rouge">Baton Rouge</SelectItem>
                                      <SelectItem value="houston">Houston</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Label className="text-xs whitespace-nowrap min-w-[70px]">Division:</Label>
                                  <Select value={quoteData[selectedQuote].received.division}>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border shadow-lg z-50">
                                      <SelectItem value="lab">Lab</SelectItem>
                                      <SelectItem value="field">Field</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Label className="text-xs whitespace-nowrap min-w-[70px]">PO #:</Label>
                                  <Input value={quoteData[selectedQuote].received.poNumber} className="h-7 text-xs" readOnly />
                                </div>
                              </div>
                            </div>

                            {/* Arrival Information */}
                            <div className="space-y-1.5">
                              <h4 className="text-xs font-medium text-muted-foreground border-b pb-0.5">Arrival Information</h4>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <Label className="text-xs whitespace-nowrap min-w-[55px]">Date:</Label>
                                  <Input type="date" value={quoteData[selectedQuote].received.arrivalDate} className="h-7 text-xs" readOnly />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Label className="text-xs whitespace-nowrap min-w-[55px]">Type:</Label>
                                  <Select value={quoteData[selectedQuote].received.arrivalType}>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border shadow-lg z-50">
                                      <SelectItem value="onsite">Onsite</SelectItem>
                                      <SelectItem value="pickup">Pickup</SelectItem>
                                      <SelectItem value="delivery">Delivery</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* Override Fields */}
                            <div className="space-y-1.5">
                              <h4 className="text-xs font-medium text-muted-foreground border-b pb-0.5">Override Fields</h4>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <Label className="text-xs whitespace-nowrap min-w-[60px]">Priority:</Label>
                                  <Select value={quoteData[selectedQuote].received.priority}>
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border shadow-lg z-50">
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="expedite">Expedite</SelectItem>
                                      <SelectItem value="rush">Rush</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Label className="text-xs whitespace-nowrap min-w-[60px]">Need By:</Label>
                                  <Input type="date" value={quoteData[selectedQuote].received.needByDate} className="h-7 text-xs" readOnly />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Include Special Instructions */}
                        <div className="flex items-start gap-2">
                          <Checkbox id="special-instructions" />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="special-instructions"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Include Special Instructions
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Return Address: 2020 Alberta Way, Baton Rouge, LA 70822
                            </p>
                          </div>
                        </div>

                        {/* Items Table */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <a 
                              href="#" 
                              className="text-sm text-foreground font-medium hover:text-primary hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                if (selectedQuoteItems.length === quoteData[selectedQuote].items.length) {
                                  setSelectedQuoteItems([]);
                                } else {
                                  setSelectedQuoteItems(quoteData[selectedQuote].items.map((_, idx) => idx));
                                }
                              }}
                            >
                              {selectedQuoteItems.length === quoteData[selectedQuote].items.length ? "Deselect All" : "Select All"}
                            </a>
                          </div>
                          
                          <div className="border rounded-lg overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="text-left p-2 font-medium">Rcv</th>
                                  <th className="text-left p-2 font-medium">Manufacturer</th>
                                  <th className="text-left p-2 font-medium">Model</th>
                                  <th className="text-left p-2 font-medium">Item Description</th>
                                  <th className="text-left p-2 font-medium">Qty</th>
                                  <th className="text-left p-2 font-medium">Prev WO #</th>
                                  <th className="text-left p-2 font-medium">WO Item</th>
                                  <th className="text-left p-2 font-medium">Serial Number</th>
                                  <th className="text-left p-2 font-medium">Cust ID</th>
                                  <th className="text-left p-2 font-medium">Cust Serial</th>
                                  <th className="text-left p-2 font-medium">Priority</th>
                                  <th className="text-left p-2 font-medium">Repair</th>
                                  <th className="text-left p-2 font-medium">17025</th>
                                </tr>
                              </thead>
                              <tbody className="bg-card">
                                {quoteData[selectedQuote].items.map((item, index) => {
                                  // Check if this item has been added to receivingItems
                                  const itemId = `quo-${selectedQuote}-${index}`;
                                  const isItemAdded = receivingItems.some(ri => ri.id === itemId);
                                  
                                  return (
                                    <tr 
                                      key={index} 
                                      className={`border-t ${item.highlighted ? 'bg-muted/30' : ''} ${isItemAdded ? 'opacity-50' : ''}`}
                                    >
                                      <td className="p-2">
                                        <Checkbox 
                                          checked={selectedQuoteItems.includes(index)}
                                          disabled={isItemAdded}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setSelectedQuoteItems([...selectedQuoteItems, index]);
                                            } else {
                                              setSelectedQuoteItems(selectedQuoteItems.filter(i => i !== index));
                                            }
                                          }}
                                        />
                                      </td>
                                      <td className="p-2 text-foreground">{item.manufacturer}</td>
                                      <td className="p-2 text-foreground">{item.model}</td>
                                      <td className="p-2 font-medium text-foreground">{item.description}</td>
                                    <td className="p-2">
                                      <Input type="number" defaultValue={item.qty} className="h-8 w-16" />
                                    </td>
                                    <td className="p-2">
                                      <Input defaultValue={item.prevWO} className="h-8 w-20" />
                                    </td>
                                    <td className="p-2">
                                      {item.woItem ? (
                                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{item.woItem}</a>
                                      ) : null}
                                    </td>
                                    <td className="p-2">
                                      <Input placeholder={item.serialNumber || "N/A"} defaultValue={item.serialNumber} className="h-8 w-24" />
                                    </td>
                                    <td className="p-2">
                                      <Input placeholder="" defaultValue={item.custId} className="h-8 w-24" />
                                    </td>
                                    <td className="p-2">
                                      <Input placeholder={item.custSerial || "N/A"} defaultValue={item.custSerial} className="h-8 w-24" />
                                    </td>
                                    <td className="p-2">
                                      <Select defaultValue={item.priority}>
                                        <SelectTrigger className="h-8 w-24">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border shadow-lg z-50">
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="expedite">Expedite</SelectItem>
                                          <SelectItem value="rush">Rush</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </td>
                                      <td className="p-2">
                                        <Checkbox defaultChecked={item.repair} disabled={isItemAdded} />
                                      </td>
                                      <td className="p-2">
                                        <Checkbox defaultChecked={item.iso17025} disabled={isItemAdded} />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination and Action Button */}
                          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <span>Page 1 of 1 ({quoteData[selectedQuote].items.length} items)</span>
                              <div className="flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                  <span>&lt;</span>
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-primary text-primary-foreground">
                                  1
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                  <span>&gt;</span>
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Label className="text-sm whitespace-nowrap">Page size:</Label>
                              <Select defaultValue="10">
                                <SelectTrigger className="h-8 w-16">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                  <SelectItem value="5">5</SelectItem>
                                  <SelectItem value="10">10</SelectItem>
                                  <SelectItem value="20">20</SelectItem>
                                  <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <Button 
                              className="bg-primary hover:bg-primary/90"
                              disabled={selectedQuoteItems.length === 0}
                              onClick={() => {
                                const selectedItems = selectedQuoteItems.map(index => {
                                  const item = quoteData[selectedQuote].items[index];
                                  return {
                                    id: `quo-${selectedQuote}-${index}`,
                                    itemNumber: item.woItem || `NEW-${Date.now()}-${index}`,
                                    calFreq: quoteData[selectedQuote].received.calFreq,
                                    actionCode: "rc",
                                    priority: item.priority,
                                    manufacturer: item.manufacturer,
                                    model: item.model,
                                    description: item.description,
                                    mfgSerial: item.serialNumber,
                                    custId: item.custId,
                                    custSN: item.custSerial,
                                    assetNumber: "",
                                    iso17025: item.iso17025 ? "yes" : "no",
                                    estimate: "",
                                    newEquip: "no",
                                    needByDate: quoteData[selectedQuote].received.needByDate,
                                    ccCost: "",
                                    tf: "no",
                                    capableLocations: ""
                                  };
                                });
                                
                                setReceivingItems([...receivingItems, ...selectedItems]);
                                setSelectedQuoteItems([]);
                                
                                toast({
                                  variant: "success",
                                  title: "Items Added",
                                  description: `${selectedItems.length} item(s) added to work order`,
                                  duration: 2000,
                                });
                              }}
                            >
                              Receive and Add WO Items {selectedQuoteItems.length > 0 && `(${selectedQuoteItems.length})`}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
              )}
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
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
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

                      {/* Additional Contact 3 */}
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
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2 bg-background text-sm">
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

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                localStorage.setItem('workOrderViewMode', viewMode);
                                toast({
                                  title: "View Preference Saved",
                                  description: `${viewMode === 'receiving' ? 'Receiving View' : viewMode === 'table' ? 'Table View' : 'Cards View'} will be your default view.`,
                                  duration: 1500,
                                });
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <BookmarkCheck className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Set as default view</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

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
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm">
                          <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Print QR Sheet</span>
                          <span className="sm:hidden">QR Sheet</span>
                        </Button>
                        <Button 
                          onClick={() => {
                            const newState = !isCreateUnusedItemsExpanded;
                            setIsCreateUnusedItemsExpanded(newState);
                            if (newState) {
                              setIsCopyFromWOExpanded(false);
                              setIsSpecialActionExpanded(false);
                              setTimeout(() => document.getElementById('create-unused-items-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                        >
                          <PackagePlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Create Unused Items</span>
                          <span className="sm:hidden">Unused Items</span>
                        </Button>
                        <Button 
                          onClick={() => {
                            const newState = !isCopyFromWOExpanded;
                            setIsCopyFromWOExpanded(newState);
                            if (newState) {
                              setIsSpecialActionExpanded(false);
                              setIsCreateUnusedItemsExpanded(false);
                              setTimeout(() => document.getElementById('copy-from-other-wo')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                        >
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Copy From Other Work Order</span>
                          <span className="sm:hidden">Copy WO</span>
                        </Button>
                        <Button 
                          onClick={() => {
                            const newState = !isSpecialActionExpanded;
                            setIsSpecialActionExpanded(newState);
                            if (newState) {
                              setIsCopyFromWOExpanded(false);
                              setIsCreateUnusedItemsExpanded(false);
                              setTimeout(() => document.getElementById('special-action-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                        >
                          <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Special Action</span>
                          <span className="sm:hidden">Action</span>
                        </Button>
                      </div>
                     ) : (
                       <div className="flex gap-2 sm:gap-3 flex-nowrap overflow-x-auto">
                         <Button
                           onClick={() => navigate("/form-variations")}
                           className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm flex-1 min-w-fit"
                         >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Add New Item</span>
                        </Button>
                        <Button 
                          onClick={() => setIsRFIDDialogOpen(true)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm flex-1 min-w-fit"
                        >
                          <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Add New Item w/RFID</span>
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm flex-1 min-w-fit">
                          <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Print QR Sheet</span>
                        </Button>
                        <Button
                          onClick={() => {
                            const newState = !isCreateUnusedItemsExpanded;
                            setIsCreateUnusedItemsExpanded(newState);
                            if (newState) {
                              setIsCopyFromWOExpanded(false);
                              setIsSpecialActionExpanded(false);
                              setTimeout(() => document.getElementById('create-unused-items-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm flex-1 min-w-fit"
                        >
                          <PackagePlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Create Unused Items</span>
                        </Button>
                        <Button 
                          onClick={() => {
                            const newState = !isCopyFromWOExpanded;
                            setIsCopyFromWOExpanded(newState);
                            if (newState) {
                              setIsSpecialActionExpanded(false);
                              setIsCreateUnusedItemsExpanded(false);
                              setTimeout(() => document.getElementById('copy-from-other-wo')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm flex-1 min-w-fit"
                        >
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Copy From Other Work Order</span>
                        </Button>
                        <Button 
                          onClick={() => {
                            const newState = !isSpecialActionExpanded;
                            setIsSpecialActionExpanded(newState);
                            if (newState) {
                              setIsCopyFromWOExpanded(false);
                              setIsCreateUnusedItemsExpanded(false);
                              setTimeout(() => document.getElementById('special-action-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 h-10 sm:h-12 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm flex-1 min-w-fit"
                        >
                          <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Special Action</span>
                        </Button>
                      </div>
                    )}


                    {/* Copy From Other WO Section */}
                    {isCopyFromWOExpanded && (
                      <div id="copy-from-other-wo" className="bg-muted/30 p-4 rounded-lg border-2 border-primary/20">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <Copy className="w-5 h-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">Copy From Other Work Order</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="copyWorkOrder" className="text-sm font-medium">
                              Work Order # <span className="text-destructive">*</span>
                            </Label>
                            <Input 
                              id="copyWorkOrder"
                              value={copyWorkOrder}
                              onChange={(e) => setCopyWorkOrder(e.target.value)}
                              placeholder="WO-123456"
                              disabled={areOtherFieldsDisabled()}
                              className="h-10"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Item # From <span className="text-destructive">*</span>
                            </Label>
                            <Input 
                              value={copyItemFrom}
                              onChange={(e) => {
                                setCopyItemFrom(e.target.value);
                                if (e.target.value && copyGroupable) {
                                  setCopyGroupable("");
                                }
                              }}
                              placeholder="1"
                              disabled={areOtherFieldsDisabled() || (copyGroupable !== "")}
                              className="h-10"
                              type="number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Item # To</Label>
                            <Input 
                              value={copyItemTo}
                              onChange={(e) => setCopyItemTo(e.target.value)}
                              placeholder="10"
                              disabled={areOtherFieldsDisabled() || (copyGroupable !== "")}
                              className="h-10"
                              type="number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="copyGroupable" className="text-sm font-medium">
                              Groupable <span className="text-destructive">*</span>
                            </Label>
                            <Select 
                              value={copyGroupable} 
                              onValueChange={(value) => {
                                setCopyGroupable(value);
                                if (value && copyItemFrom) {
                                  setCopyItemFrom("");
                                  setCopyItemTo("");
                                }
                              }}
                              disabled={areOtherFieldsDisabled() || (copyItemFrom !== "")}
                            >
                              <SelectTrigger id="copyGroupable" className="h-10">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button 
                            onClick={handleCopyFromOtherWO}
                            className="bg-primary hover:bg-primary/90 flex items-center gap-2 h-10"
                            disabled={areOtherFieldsDisabled()}
                          >
                            <Copy className="w-4 h-4" />
                            Copy Items
                          </Button>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Special Action Section */}
                    {isSpecialActionExpanded && (
                      <div id="special-action-section" className="bg-muted/30 p-4 rounded-lg overflow-x-auto">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">Special Action</h3>
                          </div>
                        
                          <div className="flex items-center gap-4 min-w-fit">
                            <Select
                              value={selectedSpecialAction}
                              onValueChange={(value) => {
                                setSelectedSpecialAction(value);
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

                        {/* Special Action Form Fields */}
                        {selectedSpecialAction && selectedSpecialAction !== "none" && (
                        <div className="bg-muted/30 border rounded-lg p-4 space-y-3 mt-4">
                          {/* Add Comments */}
                          {selectedSpecialAction === "add-comments" && (
                            <>
                              <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Label className="text-sm font-medium whitespace-nowrap">Comment Type</Label>
                                  <Select value={specialActionCommentType} onValueChange={setSpecialActionCommentType}>
                                    <SelectTrigger className="w-60 border-gray-400">
                                      <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border shadow-lg z-50 max-h-80 overflow-y-auto">
                                      <SelectItem value="sales">Sales</SelectItem>
                                      <SelectItem value="sales-order">Sales Order</SelectItem>
                                      <SelectItem value="shipping">Shipping</SelectItem>
                                      <SelectItem value="delivery">Delivery</SelectItem>
                                      <SelectItem value="receiving">Receiving</SelectItem>
                                      <SelectItem value="technical">Technical</SelectItem>
                                      <SelectItem value="purchasing">Purchasing</SelectItem>
                                      <SelectItem value="accounting">Accounting</SelectItem>
                                      <SelectItem value="qa">QA</SelectItem>
                                      <SelectItem value="rental">Rental</SelectItem>
                                      <SelectItem value="tf">T/F</SelectItem>
                                      <SelectItem value="transit">Transit</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                      <SelectItem value="onsite">Onsite</SelectItem>
                                      <SelectItem value="user-status-change">User Status Change</SelectItem>
                                      <SelectItem value="estimate">Estimate</SelectItem>
                                      <SelectItem value="hot-list">Hot List</SelectItem>
                                      <SelectItem value="batch-cert">Batch Cert</SelectItem>
                                      <SelectItem value="warranty">Warranty</SelectItem>
                                      <SelectItem value="lost-equip">Lost Equip</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label className="text-sm font-medium whitespace-nowrap">Enter a comment</Label>
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
                              </div>
                              <div className="space-y-2">
                                <textarea
                                  className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-400 rounded-md bg-background"
                                  placeholder="Enter comment..."
                                  value={specialActionComment}
                                  onChange={(e) => setSpecialActionComment(e.target.value)}
                                />
                                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Cancel Item(s)
                              </Button>
                            </div>
                          )}

                          {/* Change ESL Type */}
                          {selectedSpecialAction === "change-esl-type" && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
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
                                <div className="flex items-center gap-2">
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
                              </div>
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Change ESL Type
                              </Button>
                            </div>
                          )}

                          {/* Cust Reply Received */}
                          {selectedSpecialAction === "cust-reply-received" && (
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              Cust Reply Received
                            </Button>
                          )}

                          {/* Del Ticket Followup */}
                          {selectedSpecialAction === "del-ticket-followup" && (
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              Del Ticket Followup
                            </Button>
                          )}

                          {/* Ready to Bill */}
                          {selectedSpecialAction === "ready-to-bill" && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id="clearInvoiceData"
                                  checked={clearInvoiceData}
                                  onCheckedChange={(checked) => setClearInvoiceData(checked as boolean)}
                                />
                                <Label htmlFor="clearInvoiceData" className="text-sm font-medium cursor-pointer">
                                  Clear Invoice Data
                                </Label>
                              </div>
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Ready to Bill
                              </Button>
                            </div>
                          )}

                          {/* To A/R */}
                          {selectedSpecialAction === "to-ar" && (
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              To A/R
                            </Button>
                          )}

                          {/* Update Cal Freq's */}
                          {selectedSpecialAction === "update-cal-freq" && (
                            <div className="flex items-center gap-4">
                              <Label className="text-sm font-medium">Enter Cal Freq</Label>
                              <Input
                                className="w-60 border-gray-400"
                                value={calFreqValue}
                                onChange={(e) => setCalFreqValue(e.target.value)}
                                placeholder="Enter value"
                              />
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Update Cal Freq
                              </Button>
                            </div>
                          )}

                          {/* Update PO #'s */}
                          {selectedSpecialAction === "update-po" && (
                            <div className="flex items-center gap-4">
                              <Label className="text-sm font-medium">Enter PO Number</Label>
                              <Input
                                className="w-60 border-gray-400"
                                value={poNumberValue}
                                onChange={(e) => setPoNumberValue(e.target.value)}
                                placeholder="Enter PO number"
                              />
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Update PO #
                              </Button>
                            </div>
                          )}

                          {/* Update T/F Status */}
                          {selectedSpecialAction === "update-tf-status" && (
                            <div className="flex items-center gap-4">
                              <Label className="text-sm font-medium">T/F Status</Label>
                              <Select value={tfStatusValue} onValueChange={setTfStatusValue}>
                                <SelectTrigger className="w-60 border-gray-400">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                  <SelectItem value="status1">Status 1</SelectItem>
                                  <SelectItem value="status2">Status 2</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Update T/F Status
                              </Button>
                            </div>
                          )}

                          {/* Waiting on Customer */}
                          {selectedSpecialAction === "waiting-on-customer" && (
                            <div className="flex items-center gap-4">
                              <Label className="text-sm font-medium">Wait Status</Label>
                              <Select value={customerWaitStatus} onValueChange={setCustomerWaitStatus}>
                                <SelectTrigger className="w-60 border-gray-400">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg z-50">
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Waiting on Customer
                              </Button>
                            </div>
                          )}

                          {/* Wait Cust Followup */}
                          {selectedSpecialAction === "wait-cust-followup" && (
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              Wait Cust Followup
                            </Button>
                          )}

                          {/* Update Deliver By Date */}
                          {selectedSpecialAction === "update-deliver-by-date" && (
                            <div className="flex items-center gap-4">
                              <Label className="text-sm font-medium">Enter Deliver By Date</Label>
                              <Input
                                type="date"
                                className="w-60 border-gray-400"
                                value={deliverByDate}
                                onChange={(e) => setDeliverByDate(e.target.value)}
                              />
                              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                    )}

                    {/* Create Unused Items Section */}
                    {isCreateUnusedItemsExpanded && (
                      <div id="create-unused-items-section" className="bg-muted/30 p-4 rounded-lg border-2 border-primary/20">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            <PackagePlus className="w-5 h-5 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">Create Unused Items</h3>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Label htmlFor="numUnusedItems" className="text-sm font-medium whitespace-nowrap">
                              # of Items:
                            </Label>
                            <Input 
                              id="numUnusedItems"
                              type="number"
                              min="1"
                              value={numUnusedItems}
                              onChange={(e) => setNumUnusedItems(e.target.value)}
                              placeholder="0"
                              className="w-32 border-gray-400"
                            />
                            <Button 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => {
                                const num = parseInt(numUnusedItems);
                                if (num > 0) {
                                  const newItems = Array.from({ length: num }, (_, index) => ({
                                    id: `unused-${Date.now()}-${index}`,
                                    itemNumber: "",
                                    calFreq: "",
                                    actionCode: "",
                                    priority: "",
                                    manufacturer: "",
                                    model: "",
                                    description: "",
                                    mfgSerial: "",
                                    custId: "",
                                    custSN: "",
                                    assetNumber: "",
                                    iso17025: "",
                                    estimate: "",
                                    newEquip: "",
                                    needByDate: "",
                                    ccCost: "",
                                    tf: "",
                                    capableLocations: ""
                                  }));
                                  setReceivingItems([...receivingItems, ...newItems]);
                                  setNumUnusedItems("");
                                  setIsCreateUnusedItemsExpanded(false);
                                  toast({
                                    title: "Success",
                                    description: `${num} unused item${num > 1 ? 's' : ''} created successfully`,
                                    duration: 1500,
                                  });
                                  setTimeout(() => document.getElementById('items-table')?.scrollIntoView({ behavior: 'smooth' }), 100);
                                }
                              }}
                            >
                              Create
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Add Section - Only in Receiving View */}
                    {viewMode === 'receiving' && (
                    <div id="quick-add-section" className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">Quick Add New Items</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Fill in the required fields to update selected items
                      </p>

                      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1.5fr] gap-4">
                        {/* GENERAL INFORMATION Card */}
                        <Card>
                          <CardHeader className="p-3 pb-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase">General Information</h4>
                          </CardHeader>
                          <CardContent className="p-3 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label htmlFor="qa-type" className="text-xs font-medium">Type</Label>
                                <Select 
                                  value={quickAddData.type} 
                                  onValueChange={(value) => setQuickAddData({...quickAddData, type: value})}
                                  disabled={areOtherFieldsDisabled()}
                                >
                                  <SelectTrigger id="qa-type">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="SINGLE">SINGLE</SelectItem>
                                    <SelectItem value="BATCH">BATCH</SelectItem>
                                    <SelectItem value="GROUP">GROUP</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-calFreq" className="text-xs font-medium">
                                  Cal Freq <span className="text-destructive">*</span>
                                </Label>
                                <Input 
                                  id="qa-calFreq"
                                  value={quickAddData.calFreq}
                                  onChange={(e) => setQuickAddData({...quickAddData, calFreq: e.target.value})}
                                  placeholder="Enter value"
                                  disabled={areOtherFieldsDisabled()}
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-priority" className="text-xs font-medium">Priority</Label>
                                <Select 
                                  value={quickAddData.priority} 
                                  onValueChange={(value) => setQuickAddData({...quickAddData, priority: value})}
                                  disabled={areOtherFieldsDisabled()}
                                >
                                  <SelectTrigger id="qa-priority">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="Expedite">Expedite</SelectItem>
                                    <SelectItem value="Rush">Rush</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-location" className="text-xs font-medium">
                                  Location <span className="text-destructive">*</span>
                                </Label>
                                <Select 
                                  value={quickAddData.location} 
                                  onValueChange={(value) => setQuickAddData({...quickAddData, location: value})}
                                  disabled={areOtherFieldsDisabled()}
                                >
                                  <SelectTrigger id="qa-location">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="Baton Rouge">Baton Rouge</SelectItem>
                                    <SelectItem value="Houston">Houston</SelectItem>
                                    <SelectItem value="Dallas">Dallas</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-division" className="text-xs font-medium">
                                  Division <span className="text-destructive">*</span>
                                </Label>
                                <Select 
                                  value={quickAddData.division} 
                                  onValueChange={(value) => setQuickAddData({...quickAddData, division: value})}
                                  disabled={areOtherFieldsDisabled()}
                                >
                                  <SelectTrigger id="qa-division">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="Lab">Lab</SelectItem>
                                    <SelectItem value="Field">Field</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-actionCode" className="text-xs font-medium">
                                  Action Code <span className="text-destructive">*</span>
                                </Label>
                                <Select 
                                  value={quickAddData.actionCode} 
                                  onValueChange={(value) => setQuickAddData({...quickAddData, actionCode: value})}
                                  disabled={areOtherFieldsDisabled()}
                                >
                                  <SelectTrigger id="qa-actionCode">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="rc">RC - Regular Calibration</SelectItem>
                                    <SelectItem value="repair">Repair</SelectItem>
                                    <SelectItem value="cc">CC - Certificate Only</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* ARRIVAL INFORMATION Card */}
                        <Card>
                          <CardHeader className="p-3 pb-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Arrival Information</h4>
                          </CardHeader>
                          <CardContent className="p-3 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label htmlFor="qa-arrivalDate" className="text-xs font-medium">
                                  Date <span className="text-destructive">*</span>
                                </Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      disabled={areOtherFieldsDisabled()}
                                      className={cn(
                                        "w-full justify-start text-left font-normal h-10",
                                        !quickAddData.arrivalDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {quickAddData.arrivalDate ? format(new Date(quickAddData.arrivalDate), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={quickAddData.arrivalDate ? new Date(quickAddData.arrivalDate) : undefined}
                                      onSelect={(date) => setQuickAddData({...quickAddData, arrivalDate: date ? format(date, "yyyy-MM-dd") : ""})}
                                      disabled={areOtherFieldsDisabled()}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-arrivalType" className="text-xs font-medium">
                                  Type <span className="text-destructive">*</span>
                                </Label>
                                <Select 
                                  value={quickAddData.arrivalType} 
                                  onValueChange={(value) => setQuickAddData({...quickAddData, arrivalType: value})}
                                  disabled={areOtherFieldsDisabled()}
                                >
                                  <SelectTrigger id="qa-arrivalType">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border shadow-lg z-50">
                                    <SelectItem value="jm-driver-pickup">JM Driver Pickup</SelectItem>
                                    <SelectItem value="customer-dropoff">Customer Dropoff</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="onsite">Onsite</SelectItem>
                                    <SelectItem value="purchasing-dept">Purchasing Dept.</SelectItem>
                                    <SelectItem value="lab-standard">Lab Standard</SelectItem>
                                    <SelectItem value="surplus">Surplus</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Conditional fields based on arrival type */}
                              {quickAddData.arrivalType === "surplus" && (
                                <div className="space-y-1">
                                  <Label htmlFor="qa-arrivalLocation" className="text-xs font-medium">
                                    Location <span className="text-destructive">*</span>
                                  </Label>
                                  <Input 
                                    id="qa-arrivalLocation"
                                    value={quickAddData.arrivalLocation}
                                    onChange={(e) => setQuickAddData({...quickAddData, arrivalLocation: e.target.value})}
                                    placeholder="Enter location"
                                    disabled={areOtherFieldsDisabled()}
                                  />
                                </div>
                              )}

                              {quickAddData.arrivalType === "shipped" && (
                                <div className="space-y-1">
                                  <Label htmlFor="qa-shipType" className="text-xs font-medium">
                                    Ship Type <span className="text-destructive">*</span>
                                  </Label>
                                  <Select 
                                    value={quickAddData.shipType} 
                                    onValueChange={(value) => setQuickAddData({...quickAddData, shipType: value})}
                                    disabled={areOtherFieldsDisabled()}
                                  >
                                    <SelectTrigger id="qa-shipType">
                                      <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border shadow-lg z-50">
                                      <SelectItem value="dhl">DHL</SelectItem>
                                      <SelectItem value="fedex">FedEx</SelectItem>
                                      <SelectItem value="ups">UPS</SelectItem>
                                      <SelectItem value="usps">USPS</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {quickAddData.arrivalType === "customer-dropoff" && (
                                <div className="space-y-1">
                                  <Label htmlFor="qa-customerName" className="text-xs font-medium">
                                    Name <span className="text-destructive">*</span>
                                  </Label>
                                  <Input 
                                    id="qa-customerName"
                                    value={quickAddData.customerName}
                                    onChange={(e) => setQuickAddData({...quickAddData, customerName: e.target.value})}
                                    placeholder="Enter name"
                                    disabled={areOtherFieldsDisabled()}
                                  />
                                </div>
                              )}

                              {quickAddData.arrivalType === "jm-driver-pickup" && (
                                <>
                                  <div className="space-y-1">
                                    <Label htmlFor="qa-driver" className="text-xs font-medium">
                                      Driver <span className="text-destructive">*</span>
                                    </Label>
                                    <Select 
                                      value={quickAddData.driver} 
                                      onValueChange={(value) => setQuickAddData({...quickAddData, driver: value})}
                                      disabled={areOtherFieldsDisabled()}
                                    >
                                      <SelectTrigger id="qa-driver">
                                        <SelectValue placeholder="Select driver" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-background border shadow-lg z-50">
                                        <SelectItem value="driver1">Driver 1</SelectItem>
                                        <SelectItem value="driver2">Driver 2</SelectItem>
                                        <SelectItem value="driver3">Driver 3</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="qa-puDate" className="text-xs font-medium">
                                      PU Date <span className="text-destructive">*</span>
                                    </Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          disabled={areOtherFieldsDisabled()}
                                          className={cn(
                                            "w-full justify-start text-left font-normal h-10",
                                            !quickAddData.puDate && "text-muted-foreground"
                                          )}
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {quickAddData.puDate ? format(new Date(quickAddData.puDate), "PPP") : <span>Pick a date</span>}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={quickAddData.puDate ? new Date(quickAddData.puDate) : undefined}
                                          onSelect={(date) => setQuickAddData({...quickAddData, puDate: date ? format(date, "yyyy-MM-dd") : ""})}
                                          disabled={areOtherFieldsDisabled()}
                                          initialFocus
                                          className={cn("p-3 pointer-events-auto")}
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* OTHER INFORMATION Card */}
                        <Card>
                          <CardHeader className="p-3 pb-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Other Information</h4>
                          </CardHeader>
                          <CardContent className="p-3 pt-2 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label htmlFor="qa-poNumber" className="text-xs font-medium">
                                  PO Number <span className="text-destructive">*</span>
                                </Label>
                                <Input 
                                  id="qa-poNumber"
                                  value={quickAddData.poNumber}
                                  onChange={(e) => setQuickAddData({...quickAddData, poNumber: e.target.value})}
                                  placeholder="Enter value"
                                  disabled={areOtherFieldsDisabled()}
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-needByDate" className="text-xs font-medium">
                                  Need by date <span className="text-destructive">*</span>
                                </Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      disabled={areOtherFieldsDisabled()}
                                      className={cn(
                                        "w-full justify-start text-left font-normal h-10",
                                        !quickAddData.needByDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {quickAddData.needByDate ? format(new Date(quickAddData.needByDate), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={quickAddData.needByDate ? new Date(quickAddData.needByDate) : undefined}
                                      onSelect={(date) => setQuickAddData({...quickAddData, needByDate: date ? format(date, "yyyy-MM-dd") : ""})}
                                      disabled={areOtherFieldsDisabled()}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-deliverBy" className="text-xs font-medium">
                                  Deliver By Date
                                </Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      disabled={areOtherFieldsDisabled()}
                                      className={cn(
                                        "w-full justify-start text-left font-normal h-10",
                                        !quickAddData.deliverByDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {quickAddData.deliverByDate ? format(new Date(quickAddData.deliverByDate), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={quickAddData.deliverByDate ? new Date(quickAddData.deliverByDate) : undefined}
                                      onSelect={(date) => setQuickAddData({...quickAddData, deliverByDate: date ? format(date, "yyyy-MM-dd") : ""})}
                                      disabled={areOtherFieldsDisabled()}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="qa-soNumber" className="text-xs font-medium">SO Number</Label>
                                <Input 
                                  id="qa-soNumber"
                                  value={quickAddData.soNumber}
                                  onChange={(e) => setQuickAddData({...quickAddData, soNumber: e.target.value})}
                                  placeholder="Enter value"
                                  disabled={areOtherFieldsDisabled()}
                                />
                              </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="flex flex-wrap gap-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="qa-newEquip"
                                checked={quickAddData.newEquip}
                                onCheckedChange={(checked) => setQuickAddData({...quickAddData, newEquip: checked as boolean})}
                                disabled={areOtherFieldsDisabled()}
                              />
                              <Label htmlFor="qa-newEquip" className="text-xs font-normal cursor-pointer">New Equip</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="qa-iso17025"
                                checked={quickAddData.iso17025}
                                onCheckedChange={(checked) => setQuickAddData({...quickAddData, iso17025: checked as boolean})}
                                disabled={areOtherFieldsDisabled()}
                              />
                              <Label htmlFor="qa-iso17025" className="text-xs font-normal cursor-pointer">17025</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="qa-multiParts"
                                checked={quickAddData.multiParts}
                                onCheckedChange={(checked) => setQuickAddData({...quickAddData, multiParts: checked as boolean})}
                                disabled={areOtherFieldsDisabled()}
                              />
                              <Label htmlFor="qa-multiParts" className="text-xs font-normal cursor-pointer">Multi Parts</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="qa-estimate"
                                checked={quickAddData.estimate}
                                onCheckedChange={(checked) => setQuickAddData({...quickAddData, estimate: checked as boolean})}
                                disabled={areOtherFieldsDisabled()}
                              />
                              <Label htmlFor="qa-estimate" className="text-xs font-normal cursor-pointer">Estimate</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="qa-usedSurplus"
                                checked={quickAddData.usedSurplus}
                                onCheckedChange={(checked) => setQuickAddData({...quickAddData, usedSurplus: checked as boolean})}
                                disabled={areOtherFieldsDisabled()}
                              />
                              <Label htmlFor="qa-usedSurplus" className="text-xs font-normal cursor-pointer">Used/Surplus</Label>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline"
                              onClick={() => {
                                setQuickAddData({
                                  type: "SINGLE",
                                  calFreq: "",
                                  priority: "Normal",
                                  location: "Baton Rouge",
                                  division: "Lab",
                                  actionCode: "",
                                  arrivalDate: "",
                                  arrivalType: "",
                                  arrivalLocation: "",
                                  shipType: "",
                                  customerName: "",
                                  driver: "",
                                  puDate: "",
                                  poNumber: "",
                                  needByDate: "",
                                  deliverByDate: "",
                                  soNumber: "",
                                  newEquip: false,
                                  iso17025: false,
                                  multiParts: false,
                                  estimate: false,
                                  usedSurplus: false
                                });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => {
                                if (!quickAddData.calFreq || !quickAddData.actionCode || !quickAddData.location || !quickAddData.division || !quickAddData.arrivalDate || !quickAddData.arrivalType || !quickAddData.poNumber || !quickAddData.needByDate) {
                                  toast({
                                    variant: "destructive",
                                    title: "Missing Required Fields",
                                    description: "Please fill in all required fields marked with *",
                                    duration: 1500,
                                  });
                                  return;
                                }

                                if (selectedItemIds.length === 0) {
                                  toast({
                                    variant: "destructive",
                                    title: "No Items Selected",
                                    description: "Please select at least one item to apply changes",
                                    duration: 1500,
                                  });
                                  return;
                                }
                                
                                // Update selected items with quick add data
                                setReceivingItems(prevItems => 
                                  prevItems.map(item => {
                                    if (selectedItemIds.includes(item.id)) {
                                      return {
                                        ...item,
                                        calFreq: quickAddData.calFreq,
                                        actionCode: quickAddData.actionCode,
                                        priority: quickAddData.priority,
                                        needByDate: quickAddData.deliverByDate,
                                        iso17025: quickAddData.iso17025 ? "yes" : "no",
                                        estimate: quickAddData.estimate ? "$0.00" : "",
                                        newEquip: quickAddData.newEquip ? "yes" : "no"
                                      };
                                    }
                                    return item;
                                  })
                                );
                                
                                toast({
                                  variant: "success",
                                  title: "Quick Add Applied",
                                  description: `Data applied to ${selectedItemIds.length} selected item${selectedItemIds.length > 1 ? 's' : ''}`,
                                  duration: 1500,
                                });
                                
                                setQuickAddData({
                                  type: "SINGLE",
                                  calFreq: "",
                                  priority: "Normal",
                                  location: "Baton Rouge",
                                  division: "Lab",
                                  actionCode: "",
                                  arrivalDate: "",
                                  arrivalType: "",
                                  arrivalLocation: "",
                                  shipType: "",
                                  customerName: "",
                                  driver: "",
                                  puDate: "",
                                  poNumber: "",
                                  needByDate: "",
                                  deliverByDate: "",
                                  soNumber: "",
                                  newEquip: false,
                                  iso17025: false,
                                  multiParts: false,
                                  estimate: false,
                                  usedSurplus: false
                                });
                              }}
                              disabled={!quickAddData.calFreq || !quickAddData.actionCode || !quickAddData.location || !quickAddData.division || !quickAddData.arrivalDate || !quickAddData.arrivalType || !quickAddData.poNumber || !quickAddData.needByDate || selectedItemIds.length === 0}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              Apply/Save WO
                            </Button>
                          </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    )}

                    {/* Conditional View Rendering */}
                    {viewMode === 'receiving' ? (
                      <WorkOrderItemsReceiving 
                        items={receivingItems} 
                        setItems={setReceivingItems}
                        onSelectedItemsChange={setSelectedItemsCount}
                        onSelectedItemsIdsChange={setSelectedItemIds}
                      />
                    ) : viewMode === 'table' ? (
                      <WorkOrderItemsTable selectedPoNumber={selectedCustPO} showMockData={true} />
                    ) : (
                      <WorkOrderItemsCards templateItems={receivingItems} showMockData={true} />
                    )}
                  </div>
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
      <div 
        className={`fixed bottom-0 right-0 bg-card border-t px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-lg transition-all duration-300 ${
          sidebarOpen ? 'left-64' : 'left-16'
        }`}
      >
        <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
          {/* Created By and Modified By Information */}
          <div className="flex flex-col text-xs text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">Created By:</span> JeQuelle R Beechem 04/01/2016
            </div>
            <div>
              <span className="font-semibold text-foreground">Modified By:</span> Admin User 10/30/2025
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
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
              disabled={!/^\d{4}\.\d{2}$/.test(workOrderData.accountNumber)}
              className="bg-success text-success-foreground hover:bg-success/90 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed h-8 sm:h-9"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Save Work Order</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
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

      {/* Copy Work Order Confirmation Dialog */}
      <AlertDialog open={isCopyConfirmDialogOpen} onOpenChange={setIsCopyConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Copy Operation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to copy items from Work Order <span className="font-semibold">{copyWorkOrder}</span> to Account Number <span className="font-semibold">{workOrderData.accountNumber}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCopyFromOtherWO}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditBatchWorkOrder;