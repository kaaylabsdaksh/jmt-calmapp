import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Search, X, Filter, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchChip {
  id: string;
  type: string;
  value: string;
  label: string;
}

const searchTypeOptions = [
  { value: 'workOrderNumber', label: 'Work Order Number' },
  { value: 'workOrderItemNumber', label: 'Work Order Item Number' },
  { value: 'accountNumber', label: 'Account Number' },
  { value: 'customerName', label: 'Customer Name' },
  { value: 'onsiteProjectNumber', label: 'Onsite Project Number' },
  { value: 'poNumber', label: 'PO Number' },
  { value: 'toFactoryPONumber', label: 'To Factory PO Number' },
  { value: 'serialNumber', label: 'Serial Number' },
  { value: 'custID', label: 'Cust ID' },
  { value: 'mfgSerial', label: 'MFG Serial' },
  { value: 'modelNumber', label: 'Model Number' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'productDescription', label: 'Product Description' },
  { value: 'eslID', label: 'ESL ID' },
  { value: 'rfid', label: 'RFID' },
  { value: 'quoteNumber', label: 'Quote Number' },
  { value: 'vendorRMANumber', label: 'Vendor RMA Number' },
];

interface SearchFilters {
  globalSearch: string;
  searchTags: string[];
  status: string;
  assignee: string;
  priority: string[];
  manufacturer: string;
  division: string;
  woType: string;
  dateFrom?: Date;
  dateTo?: Date;
  dateType: string;
  actionCode: string;
  labCode: string;
  rotationManagement: string;
  invoiceStatus: string;
  departureType: string;
  salesperson: string;
  workOrderItemStatus: string;
  workOrderItemType: string;
  location: string;
  newEquip: boolean;
  usedSurplus: boolean;
  warranty: boolean;
  toFactory: boolean;
  proofOfDelivery: boolean;
  only17025: boolean;
  onlyHotList: boolean;
  onlyLostEquip: boolean;
  nonJMAccts: boolean;
  viewTemplate: boolean;
}

interface ModernTopSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

// Mock work orders for suggestions (in a real app, this would come from props or API)
const mockWorkOrders = [
  {
    id: "385737",
    itemNumber: "385737-01",
    accountNumber: "ACC-2024-001",
    customer: "ACME Industries", 
    assignedTo: "John Smith",
    division: "Lab",
    manufacturer: "ADEULIS",
    modelNumber: "PPS-1734",
    labCode: "LAB-001",
    onsiteProjectNumber: "OSP-2024-001",
    poNumber: "PO-2024-001",
    toFactoryPO: "FPO-789012",
    serialNumber: "SN123456",
    custID: "CUST-001",
    mfgSerial: "MFG-12345",
    productDescription: "Precision Positioning System",
    eslID: "ESL-001",
    rfid: "RFID-TAG-001",
    quoteNumber: "QT-2024-001",
    vendorRMA: "RMA-VENDOR-001"
  },
  {
    id: "390589", 
    itemNumber: "390589-01",
    accountNumber: "ACC-2024-002",
    customer: "Tech Solutions Ltd",
    assignedTo: "Sarah Johnson", 
    division: "Rental",
    manufacturer: "STARRETT",
    modelNumber: "844-441",
    labCode: "LAB-002",
    onsiteProjectNumber: "OSP-2024-002",
    poNumber: "PO-2024-002",
    toFactoryPO: "FPO-890123",
    serialNumber: "SN789012",
    custID: "CUST-002",
    mfgSerial: "MFG-23456",
    productDescription: "Precision Micrometer",
    eslID: "ESL-002",
    rfid: "RFID-TAG-002",
    quoteNumber: "QT-2024-002",
    vendorRMA: "RMA-VENDOR-002"
  },
  {
    id: "400217",
    itemNumber: "400217-01",
    accountNumber: "ACC-2024-003",
    customer: "Manufacturing Corp",
    assignedTo: "Mike Davis",
    division: "ESL Onsite", 
    manufacturer: "CHARLS LTD",
    modelNumber: "1000PS",
    labCode: "LAB-003",
    onsiteProjectNumber: "OSP-2024-003",
    poNumber: "PO-2024-003",
    toFactoryPO: "FPO-901234",
    serialNumber: "SN345678",
    custID: "CUST-003",
    mfgSerial: "MFG-34567",
    productDescription: "Hydraulic Press System",
    eslID: "ESL-003",
    rfid: "RFID-TAG-003",
    quoteNumber: "QT-2024-003",
    vendorRMA: "RMA-VENDOR-003"
  },
  {
    id: "403946",
    itemNumber: "403946-01",
    accountNumber: "ACC-2024-004",
    customer: "Quality Systems Inc",
    assignedTo: "Emily Wilson",
    division: "ESL",
    manufacturer: "PRECISION TOOLS", 
    modelNumber: "CAL-500",
    labCode: "LAB-004",
    onsiteProjectNumber: "OSP-2024-004",
    poNumber: "PO-2024-004",
    toFactoryPO: "FPO-012345",
    serialNumber: "SN901234",
    custID: "CUST-004",
    mfgSerial: "MFG-45678",
    productDescription: "Digital Calibrator",
    eslID: "ESL-004",
    rfid: "RFID-TAG-004",
    quoteNumber: "QT-2024-004",
    vendorRMA: "RMA-VENDOR-004"
  },
  {
    id: "405078",
    itemNumber: "405078-01",
    accountNumber: "ACC-2024-005",
    customer: "Aerospace Dynamics",
    assignedTo: "Tom Rodriguez",
    division: "Lab",
    manufacturer: "SNAP-ON",
    modelNumber: "TW-PRO-500",
    labCode: "LAB-005",
    onsiteProjectNumber: "OSP-2024-005",
    poNumber: "PO-2024-005",
    toFactoryPO: "FPO-123456",
    serialNumber: "SN567890",
    custID: "CUST-005",
    mfgSerial: "MFG-56789",
    productDescription: "Torque Wrench Set",
    eslID: "ESL-005",
    rfid: "RFID-TAG-005",
    quoteNumber: "QT-2024-005",
    vendorRMA: "RMA-VENDOR-005"
  },
  {
    id: "408881",
    itemNumber: "408881-01",
    accountNumber: "ACC-2024-006",
    customer: "Pharmaceutical Labs Inc",
    assignedTo: "Dr. Amanda Foster",
    division: "Rental",
    manufacturer: "METTLER TOLEDO",
    modelNumber: "AB-220",
    labCode: "LAB-006",
    onsiteProjectNumber: "OSP-2024-006",
    poNumber: "PO-2024-006",
    toFactoryPO: "FPO-234567",
    serialNumber: "SN234567",
    custID: "CUST-006",
    mfgSerial: "MFG-67890",
    productDescription: "Analytical Balance",
    eslID: "ESL-006",
    rfid: "RFID-TAG-006",
    quoteNumber: "QT-2024-006",
    vendorRMA: "RMA-VENDOR-006"
  },
  {
    id: "412340",
    itemNumber: "412340-01",
    accountNumber: "ACC-2024-007",
    customer: "Energy Solutions Corp",
    assignedTo: "Alex Thompson",
    division: "Lab",
    manufacturer: "FLUKE",
    modelNumber: "PM-500",
    labCode: "LAB-007",
    onsiteProjectNumber: "OSP-2024-007",
    poNumber: "PO-2024-007",
    toFactoryPO: "FPO-345678",
    serialNumber: "SN890123",
    custID: "CUST-007",
    mfgSerial: "MFG-78901",
    productDescription: "Power Meter",
    eslID: "ESL-007",
    rfid: "RFID-TAG-007",
    quoteNumber: "QT-2024-007",
    vendorRMA: "RMA-VENDOR-007"
  },
  {
    id: "415229",
    itemNumber: "415229-01",
    accountNumber: "ACC-2024-008",
    customer: "Automotive Testing Lab",
    assignedTo: "James Patterson",
    division: "ESL Onsite",
    manufacturer: "BOSCH",
    modelNumber: "DS-300",
    labCode: "LAB-008",
    onsiteProjectNumber: "OSP-2024-008",
    poNumber: "PO-2024-008",
    toFactoryPO: "FPO-456789",
    serialNumber: "SN123789",
    custID: "CUST-008",
    mfgSerial: "MFG-89012",
    productDescription: "Diagnostic Scanner",
    eslID: "ESL-008",
    rfid: "RFID-TAG-008",
    quoteNumber: "QT-2024-008",
    vendorRMA: "RMA-VENDOR-008"
  },
  {
    id: "418500",
    itemNumber: "418500-01",
    accountNumber: "ACC-2024-009",
    customer: "Construction Materials Corp",
    assignedTo: "Maria Garcia",
    division: "Lab",
    manufacturer: "TEKTRONIX",
    modelNumber: "OSC-500",
    labCode: "LAB-009",
    onsiteProjectNumber: "OSP-2024-009",
    poNumber: "PO-2024-009",
    toFactoryPO: "FPO-567890",
    serialNumber: "SN456123",
    custID: "CUST-009",
    mfgSerial: "MFG-90123",
    productDescription: "Oscilloscope",
    eslID: "ESL-009",
    rfid: "RFID-TAG-009",
    quoteNumber: "QT-2024-009",
    vendorRMA: "RMA-VENDOR-009"
  },
  {
    id: "421755",
    itemNumber: "421755-01",
    accountNumber: "ACC-2024-010",
    customer: "Industrial Automation Inc",
    assignedTo: "Robert Lee",
    division: "ESL",
    manufacturer: "OMEGA",
    modelNumber: "TH-100",
    labCode: "LAB-010",
    onsiteProjectNumber: "OSP-2024-010",
    poNumber: "PO-2024-010",
    toFactoryPO: "FPO-678901",
    serialNumber: "SN789456",
    custID: "CUST-010",
    mfgSerial: "MFG-01234",
    productDescription: "Temperature Sensor",
    eslID: "ESL-010",
    rfid: "RFID-TAG-010",
    quoteNumber: "QT-2024-010",
    vendorRMA: "RMA-VENDOR-010"
  }
];

const ModernTopSearchFilters = ({ onSearch }: ModernTopSearchFiltersProps) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [dateType, setDateType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);
  const [selectedSearchType, setSelectedSearchType] = useState('workOrderNumber');
  const [searchInput, setSearchInput] = useState('');
  const [searchValues, setSearchValues] = useState({
    woNumber: '',
    customer: '',
    status: '',
    manufacturer: '',
    priority: [] as string[],
    assignee: '',
    division: '',
    woType: '',
    actionCode: '',
    labCode: '',
    rotationManagement: '',
    invoiceStatus: '',
    departureType: '',
    salesperson: '',
    workOrderItemStatus: '',
    workOrderItemType: '',
    location: '',
    newEquip: false,
    usedSurplus: false,
    warranty: false,
    toFactory: false,
    proofOfDelivery: false,
    only17025: false,
    onlyHotList: false,
    onlyLostEquip: false,
    nonJMAccts: false,
    viewTemplate: false
  });

  const addSearchChip = () => {
    if (!searchInput.trim()) return;

    const selectedOption = searchTypeOptions.find(opt => opt.value === selectedSearchType);
    if (!selectedOption) return;

    const newChip: SearchChip = {
      id: `${selectedSearchType}-${Date.now()}`,
      type: selectedSearchType,
      value: searchInput.trim(),
      label: selectedOption.label,
    };

    setSearchChips(prev => [...prev, newChip]);
    setSearchInput('');
    
    // Trigger search with new chips
    const updatedChips = [...searchChips, newChip];
    const searchTags = updatedChips.map(chip => `${chip.label}: ${chip.value}`);
    onSearch({
      globalSearch: '',
      searchTags: searchTags,
      status: searchValues.status,
      assignee: searchValues.assignee,
      priority: searchValues.priority,
      manufacturer: searchValues.manufacturer,
      division: searchValues.division,
      woType: searchValues.woType,
      dateFrom,
      dateTo,
      dateType,
      actionCode: searchValues.actionCode,
      labCode: searchValues.labCode,
      rotationManagement: searchValues.rotationManagement,
      invoiceStatus: searchValues.invoiceStatus,
      departureType: searchValues.departureType,
      salesperson: searchValues.salesperson,
      workOrderItemStatus: searchValues.workOrderItemStatus,
      workOrderItemType: searchValues.workOrderItemType,
      location: searchValues.location,
      newEquip: searchValues.newEquip,
      usedSurplus: searchValues.usedSurplus,
      warranty: searchValues.warranty,
      toFactory: searchValues.toFactory,
      proofOfDelivery: searchValues.proofOfDelivery,
      only17025: searchValues.only17025,
      onlyHotList: searchValues.onlyHotList,
      onlyLostEquip: searchValues.onlyLostEquip,
      nonJMAccts: searchValues.nonJMAccts,
      viewTemplate: searchValues.viewTemplate
    });
  };

  const removeSearchChip = (chipId: string) => {
    const updatedChips = searchChips.filter(chip => chip.id !== chipId);
    setSearchChips(updatedChips);
    
    // Trigger search with updated chips
    const searchTags = updatedChips.map(chip => `${chip.label}: ${chip.value}`);
    onSearch({
      globalSearch: '',
      searchTags: searchTags,
      status: searchValues.status,
      assignee: searchValues.assignee,
      priority: searchValues.priority,
      manufacturer: searchValues.manufacturer,
      division: searchValues.division,
      woType: searchValues.woType,
      dateFrom,
      dateTo,
      dateType,
      actionCode: searchValues.actionCode,
      labCode: searchValues.labCode,
      rotationManagement: searchValues.rotationManagement,
      invoiceStatus: searchValues.invoiceStatus,
      departureType: searchValues.departureType,
      salesperson: searchValues.salesperson,
      workOrderItemStatus: searchValues.workOrderItemStatus,
      workOrderItemType: searchValues.workOrderItemType,
      location: searchValues.location,
      newEquip: searchValues.newEquip,
      usedSurplus: searchValues.usedSurplus,
      warranty: searchValues.warranty,
      toFactory: searchValues.toFactory,
      proofOfDelivery: searchValues.proofOfDelivery,
      only17025: searchValues.only17025,
      onlyHotList: searchValues.onlyHotList,
      onlyLostEquip: searchValues.onlyLostEquip,
      nonJMAccts: searchValues.nonJMAccts,
      viewTemplate: searchValues.viewTemplate
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSearchChip();
    }
  };

  const handleSearch = () => {
    // Add chip if there's input
    if (searchInput.trim()) {
      addSearchChip();
    } else {
      // Even without new chip, send current filter values
      const searchTags = searchChips.map(chip => `${chip.label}: ${chip.value}`);
      onSearch({
        globalSearch: '',
        searchTags: searchTags,
        status: searchValues.status,
        assignee: searchValues.assignee,
        priority: searchValues.priority,
        manufacturer: searchValues.manufacturer,
        division: searchValues.division,
        woType: searchValues.woType,
        dateFrom,
        dateTo,
        dateType,
        actionCode: searchValues.actionCode,
        labCode: searchValues.labCode,
        rotationManagement: searchValues.rotationManagement,
        invoiceStatus: searchValues.invoiceStatus,
        departureType: searchValues.departureType,
        salesperson: searchValues.salesperson,
        workOrderItemStatus: searchValues.workOrderItemStatus,
        workOrderItemType: searchValues.workOrderItemType,
        location: searchValues.location,
        newEquip: searchValues.newEquip,
        usedSurplus: searchValues.usedSurplus,
        warranty: searchValues.warranty,
        toFactory: searchValues.toFactory,
        proofOfDelivery: searchValues.proofOfDelivery,
        only17025: searchValues.only17025,
        onlyHotList: searchValues.onlyHotList,
        onlyLostEquip: searchValues.onlyLostEquip,
        nonJMAccts: searchValues.nonJMAccts,
        viewTemplate: searchValues.viewTemplate
      });
    }
  };

  const clearAllFilters = () => {
    setSearchChips([]);
    setSearchInput('');
    setSearchValues({
      woNumber: '',
      customer: '',
      status: '',
      manufacturer: '',
      priority: [],
      assignee: '',
      division: '',
      woType: '',
      actionCode: '',
      labCode: '',
      rotationManagement: '',
      invoiceStatus: '',
      departureType: '',
      salesperson: '',
      workOrderItemStatus: '',
      workOrderItemType: '',
      location: '',
      newEquip: false,
      usedSurplus: false,
      warranty: false,
      toFactory: false,
      proofOfDelivery: false,
      only17025: false,
      onlyHotList: false,
      onlyLostEquip: false,
      nonJMAccts: false,
      viewTemplate: false
    });
    setDateFrom(undefined);
    setDateTo(undefined);
    setDateType('');
    
    // Trigger search with empty filters to show all results
    onSearch({
      globalSearch: '',
      searchTags: [],
      status: '',
      assignee: '',
      priority: [],
      manufacturer: '',
      division: '',
      woType: '',
      dateFrom: undefined,
      dateTo: undefined,
      dateType: '',
      actionCode: '',
      labCode: '',
      rotationManagement: '',
      invoiceStatus: '',
      departureType: '',
      salesperson: '',
      workOrderItemStatus: '',
      workOrderItemType: '',
      location: '',
      newEquip: false,
      usedSurplus: false,
      warranty: false,
      toFactory: false,
      proofOfDelivery: false,
      only17025: false,
      onlyHotList: false,
      onlyLostEquip: false,
      nonJMAccts: false,
      viewTemplate: false
    });
  };

  const hasActiveFilters = searchChips.length > 0 || Object.values(searchValues).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value && value !== 'all';
  }) || dateFrom || dateTo || dateType;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Work Order Search</h2>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "rounded-lg transition-all duration-300 transform hover:scale-105",
              showAdvanced ? "bg-blue-50 text-blue-600 hover:bg-black hover:text-white" : "text-gray-500 hover:bg-black hover:text-white"
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showAdvanced ? "Hide Filters" : "More Filters"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className={cn(
              "rounded-lg transition-all duration-300 transform hover:scale-105",
              hasActiveFilters 
                ? "text-red-600 hover:bg-black hover:text-white" 
                : "text-gray-400 hover:bg-black hover:text-white"
            )}
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Global Search */}
      <div className="p-2 sm:p-4 pb-2 sm:pb-3">
        {/* Active Search Chips */}
        {searchChips.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {searchChips.map((chip) => (
              <Badge
                key={chip.id}
                variant="default"
                className="px-3 py-1.5 text-sm flex items-center gap-2"
              >
                <span className="font-medium">{chip.label}:</span>
                <span>{chip.value}</span>
                <button
                  onClick={() => removeSearchChip(chip.id)}
                  className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                  aria-label="Remove filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        {/* Unified Search Bar with Integrated Dropdown */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1 flex items-center bg-white border border-gray-300 rounded-lg h-10 sm:h-11 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <Select value={selectedSearchType} onValueChange={setSelectedSearchType}>
              <SelectTrigger className="w-[180px] sm:w-[220px] border-0 border-r border-gray-300 rounded-l-lg rounded-r-none h-full text-xs sm:text-sm bg-transparent hover:bg-gray-50 focus:ring-0 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[9999]">
                {searchTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 sm:left-4 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
              <Input
                placeholder={`Enter ${searchTypeOptions.find(opt => opt.value === selectedSearchType)?.label}...`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 sm:pl-12 pr-3 border-0 h-full text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
            </div>
          </div>
          
          <Button 
            onClick={addSearchChip}
            variant="default"
            size="sm"
            className="h-10 sm:h-11 px-4 sm:px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
        
      </div>

      {/* All Filters in One Row */}
      <div className="px-2 sm:px-4 pb-3">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-3">
          {/* Status and Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <Select value={searchValues.status || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
              <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open-items">[Open Items]</SelectItem>
                <SelectItem value="awaiting-cdr">[Awaiting CDR]</SelectItem>
                <SelectItem value="assign-tech-repair-inlab">[Assign/Tech - Repair - InLab]</SelectItem>
                <SelectItem value="assigned-tech-repair-dept">[Assigned To Tech - Repair Dept]</SelectItem>
                <SelectItem value="qa-hold-disapproved">[Q/A Hold - Q/A Disapproved]</SelectItem>
                <SelectItem value="qa-insp-hold-fail">[Q/A Insp - Q/A Hold - Q/A Fail]</SelectItem>
                <SelectItem value="in-lab-assigned-tech">[In Lab - Assigned to Tech]</SelectItem>
                <SelectItem value="in-lab-qa-disapprove">[In Lab - Q/A Disapprove]</SelectItem>
                <SelectItem value="estimate-ar-invoicing">[Estimate - A/R Invoicing]</SelectItem>
                <SelectItem value="to-factory-awaiting-parts">[To Factory - Awaiting Parts]</SelectItem>
                <SelectItem value="ar-need-by-status">[AR Need By Status]</SelectItem>
                <SelectItem value="in-lab">In Lab</SelectItem>
                <SelectItem value="assigned-to-tech">Assigned to Tech</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="lab-management">Lab Management</SelectItem>
                <SelectItem value="repair-department">Repair Department</SelectItem>
                <SelectItem value="rotation">Rotation</SelectItem>
                <SelectItem value="estimate">Estimate</SelectItem>
                <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
                <SelectItem value="awaiting-pr-approval">Awaiting PR Approval</SelectItem>
                <SelectItem value="in-metrology">In Metrology</SelectItem>
                <SelectItem value="to-factory">To Factory</SelectItem>
                <SelectItem value="to-factory-repair-replacement">To Factory - Repair by Replacement</SelectItem>
                <SelectItem value="to-factory-warranty">To Factory - Warranty</SelectItem>
                <SelectItem value="lab-hold">Lab Hold</SelectItem>
                <SelectItem value="qa-inspection">Q/A Inspection</SelectItem>
                <SelectItem value="qa-inspection-fail-correction">Q/A Inspection - Fail Correction</SelectItem>
                <SelectItem value="qa-hold">Q/A Hold</SelectItem>
                <SelectItem value="qa-disapproved">Q/A Disapproved</SelectItem>
                <SelectItem value="qa-fail-log">Q/A Fail Log</SelectItem>
                <SelectItem value="ar-invoicing">A/R Invoicing</SelectItem>
                <SelectItem value="ar-invoicing-hold">A/R Invoicing/Hold</SelectItem>
                <SelectItem value="admin-processing">Admin Processing</SelectItem>
                <SelectItem value="back-to-customer">Back to Customer</SelectItem>
                <SelectItem value="calibrated-on-shelf">Calibrated on Shelf</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="item-not-found-on-site">Item Not Found on Site</SelectItem>
                <SelectItem value="me-review">ME Review</SelectItem>
                <SelectItem value="not-used">Not Used</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="ready-for-departure">Ready for Departure</SelectItem>
                <SelectItem value="return-to-lab-processing">Return to Lab for Processing</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="surplus-stock">Surplus Stock</SelectItem>
                <SelectItem value="waiting-on-customer">Waiting on Customer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={searchValues.assignee || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, assignee: value === 'all' ? '' : value }))}>
              <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Type */}
          <div>
            <Select value={dateType} onValueChange={setDateType}>
              <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="Select Date Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60]">
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="arrival">Arrival</SelectItem>
                <SelectItem value="need-by">Need By</SelectItem>
                <SelectItem value="status-date">Status Date</SelectItem>
                <SelectItem value="last-comment">Last Comment</SelectItem>
                <SelectItem value="departure-date">Departure Date</SelectItem>
                <SelectItem value="samsara-doc-submit">Samsara Doc Submit Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* From and To Date */}
          <div className="grid grid-cols-2 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!dateType}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border border-gray-300 rounded-lg h-11 text-sm hover:bg-gray-50 transition-all shadow-sm",
                    !dateFrom && "text-gray-500",
                    !dateType && "opacity-50 cursor-not-allowed bg-gray-50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">
                    {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg z-[70]" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="pointer-events-auto rounded-lg p-3"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!dateType}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border border-gray-300 rounded-lg h-11 text-sm hover:bg-gray-50 transition-all shadow-sm",
                    !dateTo && "text-gray-500",
                    !dateType && "opacity-50 cursor-not-allowed bg-gray-50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">
                    {dateTo ? format(dateTo, "MMM dd") : "To"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg z-[70]" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="pointer-events-auto rounded-lg p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Work Order Type and Priority */}
          <div className="grid grid-cols-2 gap-3">
            <Select value={searchValues.woType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, woType: value === 'all' ? '' : value }))}>
              <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                <SelectValue placeholder="All WO Types" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60]">
                <SelectItem value="all">All Workorder Types</SelectItem>
                <SelectItem value="regular">Regular Work Order</SelectItem>
                <SelectItem value="onsite">Onsite Work Order</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm justify-start text-left font-normal"
                >
                  {searchValues.priority.length > 0 
                    ? `Priority (${searchValues.priority.length})`
                    : "All Priority"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3 bg-white border border-gray-200 shadow-xl rounded-lg z-[60]" align="start">
                <div className="space-y-2">
                  {['critical', 'high', 'medium', 'low'].map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-mobile-${priority}`}
                        checked={searchValues.priority.includes(priority)}
                        onCheckedChange={(checked) => {
                          setSearchValues(prev => ({
                            ...prev,
                            priority: checked
                              ? [...prev.priority, priority]
                              : prev.priority.filter(p => p !== priority)
                          }));
                        }}
                      />
                      <Label
                        htmlFor={`priority-mobile-${priority}`}
                        className="text-sm font-normal capitalize cursor-pointer"
                      >
                        {priority}
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Desktop Layout - All in One Row */}
        <div className="hidden lg:flex gap-2 items-center overflow-x-auto">
          {/* Status */}
          <Select value={searchValues.status || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
            <SelectTrigger className="w-[160px] bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open-items">[Open Items]</SelectItem>
              <SelectItem value="awaiting-cdr">[Awaiting CDR]</SelectItem>
              <SelectItem value="assign-tech-repair-inlab">[Assign/Tech - Repair - InLab]</SelectItem>
              <SelectItem value="assigned-tech-repair-dept">[Assigned To Tech - Repair Dept]</SelectItem>
              <SelectItem value="qa-hold-disapproved">[Q/A Hold - Q/A Disapproved]</SelectItem>
              <SelectItem value="qa-insp-hold-fail">[Q/A Insp - Q/A Hold - Q/A Fail]</SelectItem>
              <SelectItem value="in-lab-assigned-tech">[In Lab - Assigned to Tech]</SelectItem>
              <SelectItem value="in-lab-qa-disapprove">[In Lab - Q/A Disapprove]</SelectItem>
              <SelectItem value="estimate-ar-invoicing">[Estimate - A/R Invoicing]</SelectItem>
              <SelectItem value="to-factory-awaiting-parts">[To Factory - Awaiting Parts]</SelectItem>
              <SelectItem value="ar-need-by-status">[AR Need By Status]</SelectItem>
              <SelectItem value="in-lab">In Lab</SelectItem>
              <SelectItem value="assigned-to-tech">Assigned to Tech</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="lab-management">Lab Management</SelectItem>
              <SelectItem value="repair-department">Repair Department</SelectItem>
              <SelectItem value="rotation">Rotation</SelectItem>
              <SelectItem value="estimate">Estimate</SelectItem>
              <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
              <SelectItem value="awaiting-pr-approval">Awaiting PR Approval</SelectItem>
              <SelectItem value="in-metrology">In Metrology</SelectItem>
              <SelectItem value="to-factory">To Factory</SelectItem>
              <SelectItem value="to-factory-repair-replacement">To Factory - Repair by Replacement</SelectItem>
              <SelectItem value="to-factory-warranty">To Factory - Warranty</SelectItem>
              <SelectItem value="lab-hold">Lab Hold</SelectItem>
              <SelectItem value="qa-inspection">Q/A Inspection</SelectItem>
              <SelectItem value="qa-inspection-fail-correction">Q/A Inspection - Fail Correction</SelectItem>
              <SelectItem value="qa-hold">Q/A Hold</SelectItem>
              <SelectItem value="qa-disapproved">Q/A Disapproved</SelectItem>
              <SelectItem value="qa-fail-log">Q/A Fail Log</SelectItem>
              <SelectItem value="ar-invoicing">A/R Invoicing</SelectItem>
              <SelectItem value="ar-invoicing-hold">A/R Invoicing/Hold</SelectItem>
              <SelectItem value="admin-processing">Admin Processing</SelectItem>
              <SelectItem value="back-to-customer">Back to Customer</SelectItem>
              <SelectItem value="calibrated-on-shelf">Calibrated on Shelf</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="item-not-found-on-site">Item Not Found on Site</SelectItem>
              <SelectItem value="me-review">ME Review</SelectItem>
              <SelectItem value="not-used">Not Used</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="ready-for-departure">Ready for Departure</SelectItem>
              <SelectItem value="return-to-lab-processing">Return to Lab for Processing</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="surplus-stock">Surplus Stock</SelectItem>
              <SelectItem value="waiting-on-customer">Waiting on Customer</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Assignee */}
          <Select value={searchValues.assignee || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, assignee: value === 'all' ? '' : value }))}>
            <SelectTrigger className="w-[160px] bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
              <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
              <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Type */}
          <Select value={dateType} onValueChange={setDateType}>
            <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="Select Date Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60]">
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="arrival">Arrival</SelectItem>
              <SelectItem value="need-by">Need By</SelectItem>
              <SelectItem value="status-date">Status Date</SelectItem>
              <SelectItem value="last-comment">Last Comment</SelectItem>
              <SelectItem value="departure-date">Departure Date</SelectItem>
              <SelectItem value="samsara-doc-submit">Samsara Doc Submit Date</SelectItem>
            </SelectContent>
          </Select>

          {/* From Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!dateType}
                className={cn(
                  "w-[140px] justify-start text-left font-normal bg-white border border-gray-300 rounded-lg h-11 text-sm hover:bg-gray-50 transition-all shadow-sm",
                  !dateFrom && "text-gray-500",
                  !dateType && "opacity-50 cursor-not-allowed bg-gray-50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">
                  {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg z-[70]" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className="pointer-events-auto rounded-lg p-3"
              />
            </PopoverContent>
          </Popover>

          {/* To Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!dateType}
                className={cn(
                  "w-[140px] justify-start text-left font-normal bg-white border border-gray-300 rounded-lg h-11 text-sm hover:bg-gray-50 transition-all shadow-sm",
                  !dateTo && "text-gray-500",
                  !dateType && "opacity-50 cursor-not-allowed bg-gray-50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">
                  {dateTo ? format(dateTo, "MMM dd, yyyy") : "To"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg z-[70]" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                className="pointer-events-auto rounded-lg p-3"
              />
            </PopoverContent>
          </Popover>

          {/* WO Type */}
          <Select value={searchValues.woType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, woType: value === 'all' ? '' : value }))}>
            <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
              <SelectValue placeholder="All WO Types" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-[60]">
              <SelectItem value="all">All Workorder Types</SelectItem>
              <SelectItem value="regular">Regular Work Order</SelectItem>
              <SelectItem value="onsite">Onsite Work Order</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[140px] bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm justify-start text-left font-normal"
              >
                {searchValues.priority.length > 0 
                  ? `Priority (${searchValues.priority.length})`
                  : "All Priority"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3 bg-white border border-gray-200 shadow-xl rounded-lg z-[60]" align="start">
              <div className="space-y-2">
                {['critical', 'high', 'medium', 'low'].map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-desktop-${priority}`}
                      checked={searchValues.priority.includes(priority)}
                      onCheckedChange={(checked) => {
                        setSearchValues(prev => ({
                          ...prev,
                          priority: checked
                            ? [...prev.priority, priority]
                            : prev.priority.filter(p => p !== priority)
                        }));
                      }}
                    />
                    <Label
                      htmlFor={`priority-desktop-${priority}`}
                      className="text-sm font-normal capitalize cursor-pointer"
                    >
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Advanced Filters Row */}
      {showAdvanced && (
        <div className="px-4 mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Division */}
              <Select value={searchValues.division || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, division: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Division" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All Divisions</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="rental">Rental</SelectItem>
                  <SelectItem value="esl">ESL</SelectItem>
                  <SelectItem value="esl-onsite">ESL Onsite</SelectItem>
                </SelectContent>
              </Select>

              {/* Action Code */}
              <Select value={searchValues.actionCode || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, actionCode: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Action Code" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All Action Codes</SelectItem>
                  <SelectItem value="c/c">C/C</SelectItem>
                  <SelectItem value="r/c/c">R/C/C</SelectItem>
                  <SelectItem value="repair">REPAIR</SelectItem>
                  <SelectItem value="test">TEST</SelectItem>
                </SelectContent>
              </Select>

              {/* Lab Code */}
              <Select value={searchValues.labCode || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, labCode: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Lab Code" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All Lab Codes</SelectItem>
                  <SelectItem value="lab-001">LAB-001</SelectItem>
                  <SelectItem value="lab-002">LAB-002</SelectItem>
                  <SelectItem value="lab-003">LAB-003</SelectItem>
                  <SelectItem value="lab-004">LAB-004</SelectItem>
                  <SelectItem value="lab-005">LAB-005</SelectItem>
                  <SelectItem value="lab-006">LAB-006</SelectItem>
                  <SelectItem value="lab-007">LAB-007</SelectItem>
                  <SelectItem value="lab-008">LAB-008</SelectItem>
                  <SelectItem value="lab-009">LAB-009</SelectItem>
                  <SelectItem value="lab-010">LAB-010</SelectItem>
                </SelectContent>
              </Select>

              {/* Rotation Management */}
              <Select value={searchValues.rotationManagement || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, rotationManagement: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Rotation Management" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="rotation">Rotation</SelectItem>
                  <SelectItem value="non-rotation">Non-Rotation</SelectItem>
                </SelectContent>
              </Select>

              {/* Invoice Status */}
              <Select value={searchValues.invoiceStatus || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, invoiceStatus: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Invoice Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All Invoice Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="quote-approved">Quote Approved</SelectItem>
                </SelectContent>
              </Select>

              {/* Departure Type */}
              <Select value={searchValues.departureType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, departureType: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Departure Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All Departure Types</SelectItem>
                  <SelectItem value="ship">Ship</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="courier">Courier</SelectItem>
                </SelectContent>
              </Select>

              {/* Salesperson */}
              <Select value={searchValues.salesperson || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, salesperson: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Salesperson" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All Salespeople</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>

              {/* Work Order Item Type */}
              <Select value={searchValues.workOrderItemType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, workOrderItemType: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="WO Item Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All Item Types</SelectItem>
                  <SelectItem value="esl-gloves">ESL - Gloves</SelectItem>
                  <SelectItem value="esl-blankets">ESL - Blankets</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                </SelectContent>
              </Select>

              {/* Location */}
              <Select value={searchValues.location || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, location: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-lg h-11 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="al">AL - Alabama</SelectItem>
                  <SelectItem value="br">BR - Brazil</SelectItem>
                  <SelectItem value="bi">BI - Biloxi</SelectItem>
                  <SelectItem value="od">OD - Odessa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkbox Filters Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Additional Filters</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* New Equip */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newEquip"
                    checked={searchValues.newEquip}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, newEquip: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="newEquip"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    New Equip
                  </Label>
                </div>

                {/* Used/Surplus */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usedSurplus"
                    checked={searchValues.usedSurplus}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, usedSurplus: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="usedSurplus"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Used/Surplus
                  </Label>
                </div>

                {/* Warranty */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="warranty"
                    checked={searchValues.warranty}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, warranty: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="warranty"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Warranty
                  </Label>
                </div>

                {/* To Factory */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="toFactory"
                    checked={searchValues.toFactory}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, toFactory: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="toFactory"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    To Factory
                  </Label>
                </div>

                {/* Proof of Delivery */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="proofOfDelivery"
                    checked={searchValues.proofOfDelivery}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, proofOfDelivery: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="proofOfDelivery"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Proof of Delivery
                  </Label>
                </div>

                {/* Only 17025 */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="only17025"
                    checked={searchValues.only17025}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, only17025: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="only17025"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Only 17025
                  </Label>
                </div>

                {/* Only Hot List */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onlyHotList"
                    checked={searchValues.onlyHotList}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, onlyHotList: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="onlyHotList"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Only Hot List
                  </Label>
                </div>

                {/* Only Lost Equip */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onlyLostEquip"
                    checked={searchValues.onlyLostEquip}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, onlyLostEquip: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="onlyLostEquip"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Only Lost Equip
                  </Label>
                </div>

                {/* Non JM Accts */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nonJMAccts"
                    checked={searchValues.nonJMAccts}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, nonJMAccts: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="nonJMAccts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Non JM Accts
                  </Label>
                </div>

                {/* View Template */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="viewTemplate"
                    checked={searchValues.viewTemplate}
                    onCheckedChange={(checked) => 
                      setSearchValues(prev => ({ ...prev, viewTemplate: checked as boolean }))
                    }
                  />
                  <Label
                    htmlFor="viewTemplate"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    View Template
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Search Button at Bottom */}
      <div className="px-4 pb-4 flex justify-end">
        <Button 
          onClick={handleSearch}
          className={cn(
            "rounded-lg h-11 px-6 font-medium shadow-sm hover:shadow-md transition-all",
            hasActiveFilters 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gray-300 hover:bg-gray-400 text-gray-600"
          )}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default ModernTopSearchFilters;