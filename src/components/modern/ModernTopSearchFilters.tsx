import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Search, X, Filter, Plus, Check, Clock, Zap } from "lucide-react";
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

// Auto-detect search type based on input pattern
function autoDetectSearchType(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^\d{5,6}$/.test(trimmed)) return 'workOrderNumber';
  if (/^\d{5,6}-\d{1,3}$/.test(trimmed)) return 'workOrderItemNumber';
  if (/^\d{3,5}\.\d{1,2}$/.test(trimmed)) return 'accountNumber';
  if (/^PO[-\s]?\d+/i.test(trimmed)) return 'poNumber';
  if (/^SR\d+/i.test(trimmed)) return 'onsiteProjectNumber';
  if (/^SN\d+/i.test(trimmed)) return 'serialNumber';
  if (/^MFG[-\s]?\d+/i.test(trimmed)) return 'mfgSerial';
  if (/^ESL[-\s]?\d+/i.test(trimmed)) return 'eslID';
  if (/^RFID[-\s]/i.test(trimmed)) return 'rfid';
  if (/^RMA/i.test(trimmed)) return 'vendorRMANumber';
  if (/^QT[-\s]?\d+/i.test(trimmed)) return 'quoteNumber';
  if (/^CUST[-\s]?\d+/i.test(trimmed)) return 'custID';
  if (/^[a-zA-Z\s]{3,}$/.test(trimmed)) return 'customerName';
  return null;
}

interface RecentSearch {
  id: string;
  chips: SearchChip[];
  timestamp: number;
  label: string;
}

const RECENT_SEARCHES_KEY = 'wo-modern-recent-searches';
const MAX_RECENT_SEARCHES = 8;

function loadRecentSearches(): RecentSearch[] {
  try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]'); }
  catch { return []; }
}
function saveRecentSearches(searches: RecentSearch[]) {
  try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES))); }
  catch {}
}

const ModernTopSearchFilters = ({ onSearch }: ModernTopSearchFiltersProps) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [dateType, setDateType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);
  const [selectedSearchType, setSelectedSearchType] = useState('workOrderNumber');
  const [searchInput, setSearchInput] = useState('');
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(loadRecentSearches);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowRecentSearches(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // Live result count
  useEffect(() => {
    if (searchChips.length === 0) { setResultCount(null); return; }
    const timer = setTimeout(() => {
      let count = mockWorkOrders.length;
      searchChips.forEach(chip => {
        const q = chip.value.toLowerCase();
        count = mockWorkOrders.filter(wo =>
          wo.id.includes(q) || wo.customer.toLowerCase().includes(q) || wo.accountNumber.includes(q) || wo.manufacturer.toLowerCase().includes(q)
        ).length;
      });
      setResultCount(count);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchChips]);

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };


  const addSearchChip = (value?: string) => {
    const chipValue = value || searchInput.trim();
    if (!chipValue) return;

    const typeToUse = detectedType || selectedSearchType;
    const selectedOption = searchTypeOptions.find(opt => opt.value === typeToUse);
    if (!selectedOption) return;

    if (detectedType && detectedType !== selectedSearchType) {
      setSelectedSearchType(detectedType);
    }

    const newChip: SearchChip = {
      id: `${typeToUse}-${Date.now()}`,
      type: typeToUse,
      value: chipValue,
      label: selectedOption.label,
    };

    setSearchChips(prev => [...prev, newChip]);
    setSearchInput('');
    setShowSuggestions(false);
    
    const updatedChips = [...searchChips, newChip];
    const searchTags = updatedChips.map(chip => `${chip.label}: ${chip.value}`);
    onSearch({
      globalSearch: '',
      searchTags,
      status: searchValues.status, assignee: searchValues.assignee, priority: searchValues.priority,
      manufacturer: searchValues.manufacturer, division: searchValues.division, woType: searchValues.woType,
      dateFrom, dateTo, dateType,
      actionCode: searchValues.actionCode, labCode: searchValues.labCode,
      rotationManagement: searchValues.rotationManagement, invoiceStatus: searchValues.invoiceStatus,
      departureType: searchValues.departureType, salesperson: searchValues.salesperson,
      workOrderItemStatus: searchValues.workOrderItemStatus, workOrderItemType: searchValues.workOrderItemType,
      location: searchValues.location,
      newEquip: searchValues.newEquip, usedSurplus: searchValues.usedSurplus,
      warranty: searchValues.warranty, toFactory: searchValues.toFactory,
      proofOfDelivery: searchValues.proofOfDelivery, only17025: searchValues.only17025,
      onlyHotList: searchValues.onlyHotList, onlyLostEquip: searchValues.onlyLostEquip,
      nonJMAccts: searchValues.nonJMAccts, viewTemplate: searchValues.viewTemplate,
    });
  };

  const removeSearchChip = (chipId: string) => {
    const updatedChips = searchChips.filter(chip => chip.id !== chipId);
    setSearchChips(updatedChips);
    const searchTags = updatedChips.map(chip => `${chip.label}: ${chip.value}`);
    onSearch({
      globalSearch: '',
      searchTags,
      status: searchValues.status, assignee: searchValues.assignee, priority: searchValues.priority,
      manufacturer: searchValues.manufacturer, division: searchValues.division, woType: searchValues.woType,
      dateFrom, dateTo, dateType,
      actionCode: searchValues.actionCode, labCode: searchValues.labCode,
      rotationManagement: searchValues.rotationManagement, invoiceStatus: searchValues.invoiceStatus,
      departureType: searchValues.departureType, salesperson: searchValues.salesperson,
      workOrderItemStatus: searchValues.workOrderItemStatus, workOrderItemType: searchValues.workOrderItemType,
      location: searchValues.location,
      newEquip: searchValues.newEquip, usedSurplus: searchValues.usedSurplus,
      warranty: searchValues.warranty, toFactory: searchValues.toFactory,
      proofOfDelivery: searchValues.proofOfDelivery, only17025: searchValues.only17025,
      onlyHotList: searchValues.onlyHotList, onlyLostEquip: searchValues.onlyLostEquip,
      nonJMAccts: searchValues.nonJMAccts, viewTemplate: searchValues.viewTemplate,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addSearchChip(); }
    if (e.key === 'Escape') { setShowRecentSearches(false); }
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      addSearchChip();
    } else {
      // Save recent search
      if (searchChips.length > 0) {
        const entry: RecentSearch = {
          id: `recent-${Date.now()}`, chips: [...searchChips], timestamp: Date.now(),
          label: searchChips.map(c => `${c.label}: ${c.value}`).join(', '),
        };
        const updated = [entry, ...recentSearches.filter(r => r.label !== entry.label)].slice(0, MAX_RECENT_SEARCHES);
        setRecentSearches(updated);
        saveRecentSearches(updated);
      }
      const searchTags = searchChips.map(chip => `${chip.label}: ${chip.value}`);
      onSearch({
        globalSearch: '', searchTags,
        status: searchValues.status, assignee: searchValues.assignee, priority: searchValues.priority,
        manufacturer: searchValues.manufacturer, division: searchValues.division, woType: searchValues.woType,
        dateFrom, dateTo, dateType,
        actionCode: searchValues.actionCode, labCode: searchValues.labCode,
        rotationManagement: searchValues.rotationManagement, invoiceStatus: searchValues.invoiceStatus,
        departureType: searchValues.departureType, salesperson: searchValues.salesperson,
        workOrderItemStatus: searchValues.workOrderItemStatus, workOrderItemType: searchValues.workOrderItemType,
        location: searchValues.location,
        newEquip: searchValues.newEquip, usedSurplus: searchValues.usedSurplus,
        warranty: searchValues.warranty, toFactory: searchValues.toFactory,
        proofOfDelivery: searchValues.proofOfDelivery, only17025: searchValues.only17025,
        onlyHotList: searchValues.onlyHotList, onlyLostEquip: searchValues.onlyLostEquip,
        nonJMAccts: searchValues.nonJMAccts, viewTemplate: searchValues.viewTemplate,
      });
    }
  };

  const applyRecentSearch = (recent: RecentSearch) => {
    setSearchChips(recent.chips);
    setShowRecentSearches(false);
  };

  const removeRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => r.id !== id);
    setRecentSearches(updated);
    saveRecentSearches(updated);
  };

  const handleInputFocus = () => {
    if (!searchInput.trim() && recentSearches.length > 0) { setShowRecentSearches(true); }
  };

  const handleInputChange = (val: string) => {
    setSearchInput(val);
    if (!val.trim() && recentSearches.length > 0) setShowRecentSearches(true);
    else setShowRecentSearches(false);
  };

  const clearAllFilters = () => {
    setSearchChips([]);
    setSearchInput('');
    setResultCount(null);
    setSearchValues({
      woNumber: '', customer: '', status: '', manufacturer: '', priority: [], assignee: '',
      division: '', woType: '', actionCode: '', labCode: '', rotationManagement: '',
      invoiceStatus: '', departureType: '', salesperson: '', workOrderItemStatus: '',
      workOrderItemType: '', location: '', newEquip: false, usedSurplus: false,
      warranty: false, toFactory: false, proofOfDelivery: false, only17025: false,
      onlyHotList: false, onlyLostEquip: false, nonJMAccts: false, viewTemplate: false,
    });
    setDateFrom(undefined);
    setDateTo(undefined);
    setDateType('');
    onSearch({
      globalSearch: '', searchTags: [], status: '', assignee: '', priority: [],
      manufacturer: '', division: '', woType: '', dateFrom: undefined, dateTo: undefined, dateType: '',
      actionCode: '', labCode: '', rotationManagement: '', invoiceStatus: '',
      departureType: '', salesperson: '', workOrderItemStatus: '', workOrderItemType: '',
      location: '', newEquip: false, usedSurplus: false, warranty: false, toFactory: false,
      proofOfDelivery: false, only17025: false, onlyHotList: false, onlyLostEquip: false,
      nonJMAccts: false, viewTemplate: false,
    });
  };

  const hasActiveFilters = searchChips.length > 0 || Object.values(searchValues).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value && value !== 'all';
  }) || dateFrom || dateTo || dateType;

  const selectTriggerClass = "bg-white border border-gray-200 rounded-lg h-10 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const selectContentClass = "bg-white border border-gray-200 shadow-xl rounded-lg z-[9999]";

  return (
    <div className="bg-card rounded-xl shadow-sm border mb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Work Order Search</h2>
          {/* Live Result Count */}
          {resultCount !== null && (
            <Badge variant="secondary" className="px-2.5 py-1 text-xs font-medium animate-in fade-in-50 slide-in-from-left-2">
              <Zap className="h-3 w-3 mr-1 text-primary" />
              {resultCount} {resultCount === 1 ? 'result' : 'results'} found
            </Badge>
          )}
        </div>
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1.5 text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          <X className="h-4 w-4" />
          Clear All
        </button>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {/* Search Criteria Section */}
        <div ref={searchContainerRef}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Search Criteria</span>
            <span className="text-xs text-muted-foreground/60">Add search criteria by selecting a field and value</span>
          </div>

          {/* Active Search Chips */}
          {searchChips.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {searchChips.map((chip) => (
                <Badge
                  key={chip.id}
                  variant="default"
                  className="px-3 py-1 text-xs flex items-center gap-1.5"
                >
                  <span className="font-medium">{chip.label}:</span>
                  <span>{chip.value}</span>
                  <button
                    onClick={() => removeSearchChip(chip.id)}
                    className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                    aria-label="Remove filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="flex items-center bg-background border rounded-lg h-10 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <Select value={selectedSearchType} onValueChange={setSelectedSearchType}>
                  <SelectTrigger className="w-[140px] sm:w-[180px] border-0 border-r rounded-l-lg rounded-r-none h-full text-xs sm:text-sm bg-transparent hover:bg-muted focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {searchTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter value and press Enter or click Add..."
                    value={searchInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    className="pl-9 border-0 h-full text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Recent Searches Dropdown */}
              {showRecentSearches && recentSearches.length > 0 && !searchInput.trim() && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-popover border rounded-lg shadow-lg overflow-hidden animate-in fade-in-50 slide-in-from-top-2">
                  <div className="px-3 py-2 border-b bg-muted/30 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Recent Searches
                    </span>
                    <button 
                      onClick={() => { setRecentSearches([]); saveRecentSearches([]); }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((recent) => (
                    <button
                      key={recent.id}
                      onClick={() => applyRecentSearch(recent)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-0 group"
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground truncate">{recent.label}</div>
                        <div className="text-xs text-muted-foreground">{formatTimeAgo(recent.timestamp)}</div>
                      </div>
                      <button
                        onClick={(e) => removeRecentSearch(recent.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button 
              onClick={() => addSearchChip()}
              variant="outline"
              size="sm"
              className="h-10 px-4"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add
            </Button>
          </div>
        </div>

        {/* Date Row: Date Type + From + To */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={dateType} onValueChange={setDateType}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="Created" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="arrival">Arrival</SelectItem>
              <SelectItem value="need-by">Need By</SelectItem>
              <SelectItem value="status-date">Status Date</SelectItem>
              <SelectItem value="last-comment">Last Comment</SelectItem>
              <SelectItem value="departure-date">Departure Date</SelectItem>
              <SelectItem value="samsara-doc-submit">Samsara Doc Submit Date</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10 text-sm border-gray-200 rounded-lg",
                  !dateFrom && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg z-[70]" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="pointer-events-auto rounded-lg p-3" />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10 text-sm border-gray-200 rounded-lg",
                  !dateTo && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                {dateTo ? format(dateTo, "MMM dd, yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-gray-200 shadow-xl rounded-lg z-[70]" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="pointer-events-auto rounded-lg p-3" />
            </PopoverContent>
          </Popover>
        </div>

        {/* Row: WO Status, WO Type, Assignee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={searchValues.status || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All WO Status" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All WO Status</SelectItem>
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

          <Select value={searchValues.woType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, woType: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All WO Type" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All WO Type</SelectItem>
              <SelectItem value="regular">Regular Work Order</SelectItem>
              <SelectItem value="onsite">Onsite Work Order</SelectItem>
            </SelectContent>
          </Select>

          <Select value={searchValues.assignee || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, assignee: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Assignee" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Assignee</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
              <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
              <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row: Action Code, Lab Code, Rotation Management, Invoice Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select value={searchValues.actionCode || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, actionCode: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Action Code" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Action Code</SelectItem>
              <SelectItem value="c/c">C/C</SelectItem>
              <SelectItem value="r/c/c">R/C/C</SelectItem>
              <SelectItem value="repair">REPAIR</SelectItem>
              <SelectItem value="test">TEST</SelectItem>
            </SelectContent>
          </Select>

          <Select value={searchValues.labCode || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, labCode: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Lab Code" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Lab Code</SelectItem>
              <SelectItem value="lab-001">LAB-001</SelectItem>
              <SelectItem value="lab-002">LAB-002</SelectItem>
              <SelectItem value="lab-003">LAB-003</SelectItem>
              <SelectItem value="lab-004">LAB-004</SelectItem>
              <SelectItem value="lab-005">LAB-005</SelectItem>
            </SelectContent>
          </Select>

          <Select value={searchValues.rotationManagement || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, rotationManagement: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Rotation Management" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Rotation Management</SelectItem>
              <SelectItem value="rotation">Rotation</SelectItem>
              <SelectItem value="non-rotation">Non-Rotation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={searchValues.invoiceStatus || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, invoiceStatus: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Invoice Status" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Invoice Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="quote-approved">Quote Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row: Departure Type, Salesperson, Priority, Work Order Item Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select value={searchValues.departureType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, departureType: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Departure Type" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Departure Type</SelectItem>
              <SelectItem value="ship">Ship</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
              <SelectItem value="courier">Courier</SelectItem>
            </SelectContent>
          </Select>

          <Select value={searchValues.salesperson || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, salesperson: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Salesperson" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Salesperson</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
              <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(selectTriggerClass, "w-full justify-start text-left font-normal")}
              >
                {searchValues.priority.length > 0 
                  ? `Priority (${searchValues.priority.length})`
                  : "All Priority"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-white border border-gray-200 shadow-xl rounded-lg z-[60]" align="start">
              <div className="space-y-1">
                {['critical', 'high', 'medium', 'low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setSearchValues(prev => ({
                        ...prev,
                        priority: prev.priority.includes(priority)
                          ? prev.priority.filter(p => p !== priority)
                          : [...prev.priority, priority]
                      }));
                    }}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm capitalize transition-colors hover:bg-muted text-foreground"
                  >
                    <span className="flex h-4 w-4 items-center justify-center">
                      {searchValues.priority.includes(priority) && (
                        <Check className="h-4 w-4 stroke-[3]" />
                      )}
                    </span>
                    {priority}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Select value={searchValues.workOrderItemStatus || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, workOrderItemStatus: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Work Order Item Status" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Work Order Item Status</SelectItem>
              <SelectItem value="in-lab">In Lab</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row: Work Order Item Type, Division, Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={searchValues.workOrderItemType || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, workOrderItemType: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Work Order Item Type" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Work Order Item Type</SelectItem>
              <SelectItem value="esl-gloves">ESL - Gloves</SelectItem>
              <SelectItem value="esl-blankets">ESL - Blankets</SelectItem>
              <SelectItem value="calibration">Calibration</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
            </SelectContent>
          </Select>

          <Select value={searchValues.division || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, division: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Division" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Division</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
              <SelectItem value="rental">Rental</SelectItem>
              <SelectItem value="esl">ESL</SelectItem>
              <SelectItem value="esl-onsite">ESL Onsite</SelectItem>
            </SelectContent>
          </Select>

          <Select value={searchValues.location || 'all'} onValueChange={(value) => setSearchValues(prev => ({ ...prev, location: value === 'all' ? '' : value }))}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="All Location" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all">All Location</SelectItem>
              <SelectItem value="al">AL - Alabama</SelectItem>
              <SelectItem value="br">BR - Brazil</SelectItem>
              <SelectItem value="bi">BI - Biloxi</SelectItem>
              <SelectItem value="od">OD - Odessa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Filters - Checkboxes */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Filters</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-2.5">
            {[
              { id: 'newEquip', label: 'New Equip', key: 'newEquip' as const },
              { id: 'usedSurplus', label: 'Used Surplus', key: 'usedSurplus' as const },
              { id: 'warranty', label: 'Warranty', key: 'warranty' as const },
              { id: 'toFactory', label: 'To Factory', key: 'toFactory' as const },
              { id: 'proofOfDelivery', label: 'Proof of Delivery', key: 'proofOfDelivery' as const },
              { id: 'only17025', label: 'Only 17025', key: 'only17025' as const },
              { id: 'onlyHotList', label: 'Only Hot List', key: 'onlyHotList' as const },
              { id: 'onlyLostEquip', label: 'Only Lost Equip', key: 'onlyLostEquip' as const },
              { id: 'nonJMAccts', label: 'Non JM Accts', key: 'nonJMAccts' as const },
              { id: 'viewTemplate', label: 'View Template', key: 'viewTemplate' as const },
            ].map((filter) => (
              <div key={filter.id} className="flex items-center space-x-2">
                <Checkbox
                  id={filter.id}
                  checked={searchValues[filter.key]}
                  onCheckedChange={(checked) => 
                    setSearchValues(prev => ({ ...prev, [filter.key]: checked as boolean }))
                  }
                />
                <Label
                  htmlFor={filter.id}
                  className="text-sm font-normal leading-none cursor-pointer text-gray-700"
                >
                  {filter.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSearch}
            className="rounded-lg h-10 px-6 font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernTopSearchFilters;