import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, RotateCcw, Filter, X } from "lucide-react";

// Mock work order batch data for suggestions - matching the actual data
const mockWorkOrderBatches = [
  {
    id: "1",
    woBatch: "383727",
    acctNumber: "13058.06",
    srNumber: "SR2455",
    customerName: "Deutsche Windtechnik Inc",
    minNeedByDate: "09/24/2021",
  },
  {
    id: "2", 
    woBatch: "390118",
    acctNumber: "6962.01",
    srNumber: "SR1820",
    customerName: "Colonial Pipeline",
    minNeedByDate: "12/20/2022",
  },
  {
    id: "3",
    woBatch: "452463",
    acctNumber: "6962.01",
    srNumber: "SR1820",
    customerName: "Colonial Pipeline",
    minNeedByDate: "06/23/2023",
  },
  {
    id: "4",
    woBatch: "393015",
    acctNumber: "7412.06",
    srNumber: "",
    customerName: "Burns & McDonnell",
    minNeedByDate: "01/17/2022",
  },
  {
    id: "5",
    woBatch: "441228",
    acctNumber: "2577.50",
    srNumber: "SR2425",
    customerName: "Energy Transfer",
    minNeedByDate: "03/20/2023",
  },
  {
    id: "6",
    woBatch: "438752",
    acctNumber: "13058.20",
    srNumber: "SR2458",
    customerName: "Nuclear Research Institute",
    minNeedByDate: "12/10/2021",
  }
];

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
  priority: string;
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

interface MinimalWorkOrderSearchProps {
  onSearch?: (filters: SearchFilters) => void;
}

const MinimalWorkOrderSearch = ({ onSearch }: MinimalWorkOrderSearchProps) => {
  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);
  const [selectedSearchType, setSelectedSearchType] = useState('workOrderNumber');
  const [searchInput, setSearchInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    searchInputRef.current?.focus();
  };

  const removeSearchChip = (chipId: string) => {
    setSearchChips(prev => prev.filter(chip => chip.id !== chipId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSearchChip();
    }
  };

  const clearAllFilters = () => {
    setSearchChips([]);
    setSearchInput('');
  };

  const handleSearch = () => {
    if (onSearch) {
      const searchTags = searchChips.map(chip => `${chip.label}: ${chip.value}`);
      onSearch({
        globalSearch: searchChips.map(chip => chip.value).join(' '),
        searchTags: searchTags,
        status: '',
        assignee: '',
        priority: '',
        manufacturer: '',
        division: '',
        woType: '',
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
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Work Order Search
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Chips Display */}
        {searchChips.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg border">
            {searchChips.map((chip) => (
              <Badge
                key={chip.id}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-2"
              >
                <span className="font-medium">{chip.label}:</span>
                <span>{chip.value}</span>
                <button
                  onClick={() => removeSearchChip(chip.id)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Main Search Bar with Dropdown */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Search Criteria</Label>
          <div className="flex gap-2">
            <Select value={selectedSearchType} onValueChange={setSelectedSearchType}>
              <SelectTrigger className="w-[240px] h-11 bg-popover">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {searchTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1 flex gap-2">
              <Input
                ref={searchInputRef}
                placeholder={`Enter ${searchTypeOptions.find(opt => opt.value === selectedSearchType)?.label}...`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
              <Button 
                onClick={addSearchChip}
                variant="secondary"
                className="h-11 px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={clearAllFilters} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Clear All
          </Button>
          
          <Button variant="secondary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Work Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalWorkOrderSearch;