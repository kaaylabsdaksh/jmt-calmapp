import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Search, RotateCcw, Plus, ChevronDown, ChevronUp, Filter, Package, Calendar as CalendarIcon, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

type DateRangeType = 
  | "created" 
  | "arrival" 
  | "status-date" 
  | "last-comment" 
  | "departure" 
  | "need-by";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface FormData {
  woNumber: string;
  accountNumber: string;
  manufacturer: string;
  modelNumber: string;
  productDescription: string;
  woStatus: string;
  customerName: string;
  actionCode: string;
  division: string;
  location: string;
  woType: string;
  osRequest: string;
  mfgSerial: string;
  assetId: string;
  eslId: string;
  equipmentOptions: string;
  itemType: string;
  assignedTo: string;
  itemStatus: string;
  priority: string;
  ttPo: string;
  vendorRma: string;
  salesPerson: string;
  quoteNumber: string;
  rfid: string;
  invoiceStatus: string;
  poNumber: string;
  custSerial: string;
  crrNumber: string;
  deliveryType: string;
}

const ModernWorkOrderFilters = () => {
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  
  // Collapsible section state
  const [sectionsOpen, setSectionsOpen] = useState({
    workOrder: true,
    product: false,
    customer: false,
    additional: false,
    item: false,
    staff: false
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    woNumber: '',
    accountNumber: '',
    manufacturer: '',
    modelNumber: '',
    productDescription: '',
    woStatus: '',
    customerName: '',
    actionCode: '',
    division: '',
    location: '',
    woType: '',
    osRequest: '',
    mfgSerial: '',
    assetId: '',
    eslId: '',
    equipmentOptions: '',
    itemType: '',
    assignedTo: '',
    itemStatus: '',
    priority: '',
    ttPo: '',
    vendorRma: '',
    salesPerson: '',
    quoteNumber: '',
    rfid: '',
    invoiceStatus: '',
    poNumber: '',
    custSerial: '',
    crrNumber: '',
    deliveryType: '',
  });
  
  // Date filter state
  const [selectedDateType, setSelectedDateType] = useState<DateRangeType>("created");
  const [dateRanges, setDateRanges] = useState<Record<DateRangeType, DateRange>>({
    "created": {},
    "arrival": {},
    "status-date": {},
    "last-comment": {},
    "departure": {},
    "need-by": {}
  });

  // Popover state for date pickers
  const [datePopoverStates, setDatePopoverStates] = useState<Record<string, { from: boolean; to: boolean }>>({});

  const getPopoverKey = (type: DateRangeType) => `date-${type}`;

  const setPopoverOpen = (type: DateRangeType, field: 'from' | 'to', open: boolean) => {
    const key = getPopoverKey(type);
    setDatePopoverStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: open
      }
    }));
  };

  const dateTypeLabels: Record<DateRangeType, string> = {
    "created": "Created From/To",
    "arrival": "Arrival From/To", 
    "status-date": "Status Date From/To",
    "last-comment": "Last Comment From/To",
    "departure": "Departure From/To",
    "need-by": "Need By From/To"
  };

  const dateTypeCategories = {
    "Creation & Arrival": ["created", "arrival"] as DateRangeType[],
    "Status & Comments": ["status-date", "last-comment"] as DateRangeType[],
    "Departure & Delivery": ["departure", "need-by"] as DateRangeType[]
  };

  const updateDateRange = (type: DateRangeType, field: 'from' | 'to', date: Date | undefined) => {
    setDateRanges(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: date
      }
    }));

    // Auto-switch to "to" date picker when "from" date is selected
    if (field === 'from' && date) {
      setPopoverOpen(type, 'from', false);
      // Small delay to allow the from popover to close before opening the to popover
      setTimeout(() => {
        setPopoverOpen(type, 'to', true);
      }, 100);
    } else if (field === 'to' && date) {
      setPopoverOpen(type, 'to', false);
    }
  };

  const clearAllDates = () => {
    setDateRanges({
      "created": {},
      "arrival": {},
      "status-date": {},
      "last-comment": {},
      "departure": {},
      "need-by": {}
    });
  };

  const clearAllFilters = () => {
    // Clear all date ranges
    clearAllDates();
    
    // Clear all form data
    setFormData({
      woNumber: '',
      accountNumber: '',
      manufacturer: '',
      modelNumber: '',
      productDescription: '',
      woStatus: '',
      customerName: '',
      actionCode: '',
      division: '',
      location: '',
      woType: '',
      osRequest: '',
      mfgSerial: '',
      assetId: '',
      eslId: '',
      equipmentOptions: '',
      itemType: '',
      assignedTo: '',
      itemStatus: '',
      priority: '',
      ttPo: '',
      vendorRma: '',
      salesPerson: '',
      quoteNumber: '',
      rfid: '',
      invoiceStatus: '',
      poNumber: '',
      custSerial: '',
      crrNumber: '',
      deliveryType: '',
    });
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasAnyDates = Object.values(dateRanges).some(range => range.from || range.to);
  const currentRange = dateRanges[selectedDateType];

  return (
    <div className="space-y-6">
      {/* Combined Search Filters and Management Card */}
      <Card className="overflow-hidden animate-fade-in">
        {/* Header with Title and Action Buttons */}
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline">Work Order Search & Management</span>
              <span className="sm:hidden">WO Search</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Button */}
              <Button 
                type="submit" 
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 font-medium hover:scale-105 transition-transform"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="secondary" className="flex items-center gap-2 text-sm">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add New</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Date Filter Section - Above Basic Information */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex items-center justify-center gap-2 text-xs sm:text-sm",
                      hasAnyDates && "bg-primary/10 border-primary/30"
                    )}
                  >
                    <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    Date Filters
                    {hasAnyDates && (
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[95vw] max-w-[600px] p-3 sm:p-4" align="start">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Date Filters</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {Object.entries(dateTypeCategories).map(([category, types]) => (
                        <div key={category} className="space-y-2 sm:space-y-3">
                          <h5 className="text-xs font-medium text-muted-foreground">{category}</h5>
                          <div className="grid grid-cols-1 gap-2 sm:gap-3">
                            {types.map((type) => {
                              const range = dateRanges[type];
                              return (
                                <div key={type} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                  <Label className="text-xs w-full sm:w-32 sm:shrink-0">{dateTypeLabels[type]}</Label>
                                  <div className="flex items-center gap-2">
                                    <Popover 
                                      open={datePopoverStates[getPopoverKey(type)]?.from || false}
                                      onOpenChange={(open) => setPopoverOpen(type, 'from', open)}
                                    >
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={cn(
                                            "w-24 sm:w-28 h-7 text-xs justify-start",
                                            !range.from && "text-muted-foreground"
                                          )}
                                        >
                                          {range.from ? format(range.from, "dd/MM/yyyy") : "From date"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={range.from}
                                          onSelect={(date) => updateDateRange(type, 'from', date)}
                                          initialFocus
                                          className="p-3 pointer-events-auto"
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <span className="text-xs text-muted-foreground">to</span>
                                    <Popover 
                                      open={datePopoverStates[getPopoverKey(type)]?.to || false}
                                      onOpenChange={(open) => setPopoverOpen(type, 'to', open)}
                                    >
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={cn(
                                            "w-24 sm:w-28 h-7 text-xs justify-start",
                                            !range.to && "text-muted-foreground"
                                          )}
                                        >
                                          {range.to ? format(range.to, "dd/MM/yyyy") : "To date"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={range.to}
                                          onSelect={(date) => updateDateRange(type, 'to', date)}
                                          initialFocus
                                          className="p-3 pointer-events-auto"
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {hasAnyDates && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllDates}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive text-xs sm:text-sm"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  Clear Dates
                </Button>
              )}
            </div>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm" onClick={clearAllFilters}>
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              Clear
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Work Order Information Section */}
            <Collapsible open={sectionsOpen.workOrder} onOpenChange={() => toggleSection('workOrder')}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer hover:bg-muted/30 rounded-md p-2 -m-2">
                  <h4 className="text-sm font-semibold text-primary">Work Order Information</h4>
                  {sectionsOpen.workOrder ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wo-number" className="text-sm font-medium text-foreground">Work Order #</Label>
                    <Input 
                      id="wo-number" 
                      placeholder="Enter WO number" 
                      className="transition-all focus:ring-2 focus:ring-primary/20 text-sm"
                      value={formData.woNumber}
                      onChange={(e) => updateFormData('woNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acct-num" className="text-sm font-medium">Account Number</Label>
                    <Input 
                      id="acct-num" 
                      placeholder="Account number"
                      className="text-sm"
                      value={formData.accountNumber}
                      onChange={(e) => updateFormData('accountNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wo-status" className="text-sm font-medium">WO Status</Label>
                    <Select value={formData.woStatus} onValueChange={(value) => updateFormData('woStatus', value)}>
                      <SelectTrigger className="bg-background text-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-lg z-50">
                        <SelectItem value="in-lab">In Lab</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wo-type" className="text-sm font-medium">WO Type</Label>
                    <Select value={formData.woType} onValueChange={(value) => updateFormData('woType', value)}>
                      <SelectTrigger className="bg-background text-sm">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-lg z-50">
                        <SelectItem value="calibration">Calibration</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
 
        {/* Advanced Options Section - Inside the same card */}
        <Collapsible open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
          <CollapsibleTrigger asChild>
            <div className="px-3 sm:px-6 py-3 cursor-pointer hover:bg-muted/50 transition-colors border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <h3 className="text-base sm:text-lg font-medium">Advanced Options</h3>
                </div>
                {advancedFiltersOpen ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 px-3 sm:px-6">
              <div className="space-y-6 sm:space-y-8">
                {/* Orders & Billing Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary">Orders & Billing</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                        <SelectTrigger className="bg-background text-sm">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="rush">Rush</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tt-po" className="text-sm font-medium">T/T PO #</Label>
                      <Input 
                        id="tt-po" 
                        placeholder="TT PO number"
                        className="text-sm"
                        value={formData.ttPo}
                        onChange={(e) => updateFormData('ttPo', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor-rma" className="text-sm font-medium">Vendor RMA #</Label>
                      <Input 
                        id="vendor-rma" 
                        placeholder="RMA number"
                        className="text-sm"
                        value={formData.vendorRma}
                        onChange={(e) => updateFormData('vendorRma', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-status" className="text-sm font-medium">Invoice Status</Label>
                      <Select value={formData.invoiceStatus} onValueChange={(value) => updateFormData('invoiceStatus', value)}>
                        <SelectTrigger className="bg-background text-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Delivery & Operations Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary">Delivery & Operations</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departure-type" className="text-sm font-medium">Departure Type</Label>
                      <Select value={formData.deliveryType} onValueChange={(value) => updateFormData('deliveryType', value)}>
                        <SelectTrigger className="bg-background text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="ship">Ship</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="po-number" className="text-sm font-medium">PO Number</Label>
                      <Input 
                        id="po-number" 
                        placeholder="Purchase order number"
                        className="text-sm"
                        value={formData.poNumber}
                        onChange={(e) => updateFormData('poNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cust-serial" className="text-sm font-medium">Customer Serial</Label>
                      <Input 
                        id="cust-serial" 
                        placeholder="Customer serial number"
                        className="text-sm"
                        value={formData.custSerial}
                        onChange={(e) => updateFormData('custSerial', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default ModernWorkOrderFilters;