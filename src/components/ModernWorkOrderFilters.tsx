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
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Work Order Search & Management
            </CardTitle>
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <Button 
                type="submit" 
                className="flex items-center gap-2 px-6 py-2 font-medium hover:scale-105 transition-transform"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Date Filter Section - Above Basic Information */}
        <div className="px-6 py-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex items-center gap-2",
                      hasAnyDates && "bg-primary/10 border-primary/30"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Date Filters
                    {hasAnyDates && (
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[90vw] max-w-[600px] p-4" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Date Filters</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(dateTypeCategories).map(([category, types]) => (
                        <div key={category} className="space-y-3">
                          <h5 className="text-xs font-medium text-muted-foreground">{category}</h5>
                          <div className="grid grid-cols-1 gap-3">
                            {types.map((type) => {
                              const range = dateRanges[type];
                              return (
                                <div key={type} className="flex items-center gap-3">
                                  <Label className="text-xs w-32 shrink-0">{dateTypeLabels[type]}</Label>
                                  <div className="flex items-center gap-2">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={cn(
                                            "w-28 h-7 text-xs justify-start",
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
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className={cn(
                                            "w-28 h-7 text-xs justify-start",
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
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                  Clear Dates
                </Button>
              )}
            </div>
            
            <Button variant="outline" className="flex items-center gap-2" onClick={clearAllFilters}>
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        
        <CardContent className="pt-0">
                  <div className="space-y-8">
                    {/* Work Order Information Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Work Order Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="wo-number" className="text-sm font-medium text-foreground">Work Order #</Label>
                          <Input 
                            id="wo-number" 
                            placeholder="Enter WO number" 
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            value={formData.woNumber}
                            onChange={(e) => updateFormData('woNumber', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="acct-num" className="text-sm font-medium">Account Number</Label>
                          <Input 
                            id="acct-num" 
                            placeholder="Account number"
                            value={formData.accountNumber}
                            onChange={(e) => updateFormData('accountNumber', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="wo-status" className="text-sm font-medium">WO Status</Label>
                          <Select value={formData.woStatus} onValueChange={(value) => updateFormData('woStatus', value)}>
                            <SelectTrigger className="bg-background">
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
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border shadow-lg z-50">
                              <SelectItem value="calibration">Calibration</SelectItem>
                              <SelectItem value="repair">Repair</SelectItem>
                              <SelectItem value="certification">Certification</SelectItem>
                              <SelectItem value="rental">Rental</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Product Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer</Label>
                          <Input 
                            id="manufacturer" 
                            placeholder="Manufacturer name"
                            value={formData.manufacturer}
                            onChange={(e) => updateFormData('manufacturer', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model-number" className="text-sm font-medium">Model Number</Label>
                          <Input 
                            id="model-number" 
                            placeholder="Model number"
                            value={formData.modelNumber}
                            onChange={(e) => updateFormData('modelNumber', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-desc" className="text-sm font-medium">Product Description</Label>
                          <Input 
                            id="product-desc" 
                            placeholder="Description"
                            value={formData.productDescription}
                            onChange={(e) => updateFormData('productDescription', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mfg-serial" className="text-sm font-medium">Manufacturing Serial</Label>
                          <Input 
                            id="mfg-serial" 
                            placeholder="Mfg serial number"
                            value={formData.mfgSerial}
                            onChange={(e) => updateFormData('mfgSerial', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Customer & Sales Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Customer & Sales</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-name" className="text-sm font-medium">Customer Name</Label>
                          <Input 
                            id="customer-name" 
                            placeholder="Customer name"
                            value={formData.customerName}
                            onChange={(e) => updateFormData('customerName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sales-person" className="text-sm font-medium">Sales Person</Label>
                          <Input 
                            id="sales-person" 
                            placeholder="Sales representative"
                            value={formData.salesPerson}
                            onChange={(e) => updateFormData('salesPerson', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quote-num" className="text-sm font-medium">Quote #</Label>
                          <Input 
                            id="quote-num" 
                            placeholder="Quote number"
                            value={formData.quoteNumber}
                            onChange={(e) => updateFormData('quoteNumber', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Technical & Equipment Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Technical & Equipment</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="action-code" className="text-sm font-medium">Action Code</Label>
                          <Select value={formData.actionCode} onValueChange={(value) => updateFormData('actionCode', value)}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border shadow-lg z-50">
                              <SelectItem value="calibrate">Calibrate</SelectItem>
                              <SelectItem value="repair">Repair</SelectItem>
                              <SelectItem value="test">Test</SelectItem>
                              <SelectItem value="certification">Certification</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="equipment-options" className="text-sm font-medium">Equipment Options</Label>
                          <Select value={formData.equipmentOptions} onValueChange={(value) => updateFormData('equipmentOptions', value)}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border shadow-lg z-50">
                              <SelectItem value="new-equipment">New Equipment</SelectItem>
                              <SelectItem value="used-surplus">Used Surplus</SelectItem>
                              <SelectItem value="warranty">Warranty</SelectItem>
                              <SelectItem value="to-factory">To Factory</SelectItem>
                              <SelectItem value="proof-delivery">Proof of Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-type" className="text-sm font-medium">Item Type</Label>
                          <Select value={formData.itemType} onValueChange={(value) => updateFormData('itemType', value)}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border shadow-lg z-50">
                              <SelectItem value="instrument">Instrument</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="rental">Rental Equipment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-status" className="text-sm font-medium">Item Status</Label>
                          <Select value={formData.itemStatus} onValueChange={(value) => updateFormData('itemStatus', value)}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border shadow-lg z-50">
                              <SelectItem value="in-lab">In Lab</SelectItem>
                              <SelectItem value="complete">Complete</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="on-hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Location & Assignment Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Location & Assignment</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="division" className="text-sm font-medium">Division</Label>
                          <Select value={formData.division} onValueChange={(value) => updateFormData('division', value)}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border shadow-lg z-50">
                              <SelectItem value="electronic">Electronic</SelectItem>
                              <SelectItem value="mechanical">Mechanical</SelectItem>
                              <SelectItem value="dimensional">Dimensional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                          <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border shadow-lg z-50">
                              <SelectItem value="lab-a">Lab A</SelectItem>
                              <SelectItem value="lab-b">Lab B</SelectItem>
                              <SelectItem value="receiving">Receiving</SelectItem>
                              <SelectItem value="shipping">Shipping</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assigned-to" className="text-sm font-medium">Assigned To</Label>
                          <Input 
                            id="assigned-to" 
                            placeholder="Technician name"
                            value={formData.assignedTo}
                            onChange={(e) => updateFormData('assignedTo', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Identification & Tracking Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Identification & Tracking</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="asset-id" className="text-sm font-medium">Asset ID</Label>
                          <Input 
                            id="asset-id" 
                            placeholder="Asset identifier"
                            value={formData.assetId}
                            onChange={(e) => updateFormData('assetId', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="esl-id" className="text-sm font-medium">ESL ID</Label>
                          <Input 
                            id="esl-id" 
                            placeholder="ESL identifier"
                            value={formData.eslId}
                            onChange={(e) => updateFormData('eslId', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rfid" className="text-sm font-medium">RFID</Label>
                          <Input 
                            id="rfid" 
                            placeholder="RFID identifier"
                            value={formData.rfid}
                            onChange={(e) => updateFormData('rfid', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="os-request" className="text-sm font-medium">OS Request #</Label>
                          <Input 
                            id="os-request" 
                            placeholder="OS request number"
                            value={formData.osRequest}
                            onChange={(e) => updateFormData('osRequest', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
        
        {/* Advanced Options Section - Inside the same card */}
        <Collapsible open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
          <CollapsibleTrigger asChild>
            <div className="px-6 py-3 cursor-pointer hover:bg-muted/50 transition-colors border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Advanced Options</h3>
                </div>
                {advancedFiltersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-8">
                {/* Orders & Billing Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary">Orders & Billing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                        <SelectTrigger className="bg-background">
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
                        value={formData.ttPo}
                        onChange={(e) => updateFormData('ttPo', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor-rma" className="text-sm font-medium">Vendor RMA #</Label>
                      <Input 
                        id="vendor-rma" 
                        placeholder="RMA number"
                        value={formData.vendorRma}
                        onChange={(e) => updateFormData('vendorRma', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-status" className="text-sm font-medium">Invoice Status</Label>
                      <Select value={formData.invoiceStatus} onValueChange={(value) => updateFormData('invoiceStatus', value)}>
                        <SelectTrigger className="bg-background">
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
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary">Delivery & Operations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departure-type" className="text-sm font-medium">Departure Type</Label>
                      <Select value={formData.deliveryType} onValueChange={(value) => updateFormData('deliveryType', value)}>
                        <SelectTrigger className="bg-background">
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
                        value={formData.poNumber}
                        onChange={(e) => updateFormData('poNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cust-serial" className="text-sm font-medium">Customer Serial</Label>
                      <Input 
                        id="cust-serial" 
                        placeholder="Customer serial number"
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