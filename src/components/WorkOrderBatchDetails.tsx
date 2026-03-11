import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, User, MapPin, DollarSign, MessageSquare, Clock, Settings, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WorkOrderItem {
  id: string;
  item: string;
  division: string;
  location: string;
  itemCreated: string;
  action: string;
  itemStatus: string;
  manufacturer: string;
  model: string;
  labCode: string;
  serialNumber: string;
  poNumber: string;
  description: string;
  deliverByDate: string;
  // Additional details for dropdown
  lastComment?: string;
  lastCommentDate?: string;
  needByDate?: string;
  followUpDate?: string;
  operationType?: string;
  estimatedCost?: string;
  actualCost?: string;
  assignedTo?: string;
  departureDate?: string;
}

interface WorkOrderBatch {
  id: string;
  batchNumber: string;
  customer: string;
  accountNumber: string;
  srNumber: string;
  status: string;
  createdDate: string;
  items: WorkOrderItem[];
}

// Mock data for the batch
const mockBatch: WorkOrderBatch = {
  id: "383727",
  batchNumber: "383727",
  customer: "Deutsche Windtechnik Inc",
  accountNumber: "DWT-12345",
  srNumber: "SR-2024-001",
  status: "Open",
  createdDate: "2024-01-15",
  items: [
    {
      id: "001",
      item: "Gloves",
      division: "ESL",
      location: "Baton Rouge",
      itemCreated: "09/24/2021",
      action: "TEST",
      itemStatus: "Waiting on Customer",
      manufacturer: "",
      model: "",
      labCode: "ES",
      serialNumber: "",
      poNumber: "2110023",
      description: "Class 00 Rubber Insulating Gloves",
      deliverByDate: "10/15/2021",
      lastComment: "Customer approval required for testing procedure.",
      lastCommentDate: "11/22/2024",
      needByDate: "12/01/2024",
      followUpDate: "11/25/2024",
      operationType: "Testing",
      estimatedCost: "$150.00",
      actualCost: "",
      assignedTo: "Mike Johnson",
      departureDate: "12/02/2024"
    },
    {
      id: "002",
      item: "Safety Helmet",
      division: "Lab",
      location: "Houston",
      itemCreated: "10/15/2021",
      action: "CALIBRATE",
      itemStatus: "In Progress",
      manufacturer: "SafetyFirst",
      model: "SF-100",
      labCode: "LAB",
      serialNumber: "SF123456",
      poNumber: "2110024",
      description: "Industrial Safety Helmet with Face Shield",
      deliverByDate: "11/15/2021",
      lastComment: "Calibration in progress. Expected completion by end of week.",
      lastCommentDate: "11/21/2024",
      needByDate: "11/30/2024",
      followUpDate: "11/28/2024",
      operationType: "Calibration",
      estimatedCost: "$300.00",
      actualCost: "$285.00",
      assignedTo: "Sarah Wilson",
      departureDate: "12/01/2024"
    },
    {
      id: "004",
      item: "Voltage Detector",
      division: "ESL",
      location: "Baton Rouge",
      itemCreated: "09/30/2021",
      action: "TEST",
      itemStatus: "Back to Customer",
      manufacturer: "Fluke",
      model: "FL-200",
      labCode: "ES",
      serialNumber: "FL567890",
      poNumber: "2110026",
      description: "Non-Contact Voltage Detector",
      deliverByDate: "10/20/2021",
      lastComment: "Item returned to customer.",
      lastCommentDate: "11/18/2024",
      needByDate: "10/25/2024",
      followUpDate: "11/20/2024",
      operationType: "Testing",
      estimatedCost: "$100.00",
      actualCost: "$95.00",
      assignedTo: "Mike Johnson",
      departureDate: "10/22/2024"
    },
    {
      id: "003",
      item: "Pressure Gauge",
      division: "ESL",
      location: "Dallas",
      itemCreated: "11/02/2021",
      action: "REPAIR",
      itemStatus: "Completed",
      manufacturer: "PressureTech",
      model: "PT-500",
      labCode: "ES",
      serialNumber: "PT789012",
      poNumber: "2110025",
      description: "High-Precision Digital Pressure Gauge 0-500 PSI",
      deliverByDate: "12/01/2021",
      lastComment: "Repair completed successfully. All tests passed.",
      lastCommentDate: "11/20/2024",
      needByDate: "11/25/2024",
      followUpDate: "11/23/2024",
      operationType: "Repair",
      estimatedCost: "$450.00",
      actualCost: "$420.00",
      assignedTo: "David Brown",
      departureDate: "11/26/2024"
    }
  ]
};

interface WorkOrderBatchDetailsProps {
  batchId?: string;
  onBack?: () => void;
  viewMode?: 'default' | 'csa';
}

const WorkOrderBatchDetails: React.FC<WorkOrderBatchDetailsProps> = ({ 
  batchId, 
  onBack,
  viewMode = 'default'
}) => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [labCodeFilter, setLabCodeFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Get unique values for filters
  const uniqueStatuses = Array.from(new Set(mockBatch.items.map(item => item.itemStatus)));
  const uniqueLabCodes = Array.from(new Set(mockBatch.items.map(item => item.labCode)));

  const filteredItems = useMemo(() => {
    let items = mockBatch.items;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.item.toLowerCase().includes(query) ||
        item.division.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.action.toLowerCase().includes(query) ||
        item.itemStatus.toLowerCase().includes(query) ||
        item.manufacturer.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query) ||
        item.labCode.toLowerCase().includes(query) ||
        item.serialNumber.toLowerCase().includes(query) ||
        item.poNumber.toLowerCase().includes(query) ||
        (item.assignedTo?.toLowerCase() || "").includes(query) ||
        (item.operationType?.toLowerCase() || "").includes(query) ||
        (item.lastComment?.toLowerCase() || "").includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      items = items.filter(item => item.itemStatus === statusFilter);
    }
    
    // Apply lab code filter
    if (labCodeFilter) {
      items = items.filter(item => item.labCode === labCodeFilter);
    }

    // Apply column filters
    const colFilterKeys: Record<string, (item: WorkOrderItem) => string> = {
      item: (i) => i.item,
      location: (i) => i.location,
      itemCreated: (i) => i.itemCreated,
      action: (i) => i.action,
      itemStatus: (i) => i.itemStatus,
      manufacturer: (i) => i.manufacturer,
      model: (i) => i.model,
      description: (i) => i.description || '',
      serialNumber: (i) => i.serialNumber,
      deliverByDate: (i) => i.deliverByDate || '',
      followUpDate: (i) => i.followUpDate || '',
      division: (i) => i.division,
      labCode: (i) => i.labCode,
      poNumber: (i) => i.poNumber,
    };
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value && colFilterKeys[key]) {
        const lower = value.toLowerCase();
        items = items.filter(item => colFilterKeys[key](item).toLowerCase().includes(lower));
      }
    });
    
    return items;
  }, [searchQuery, statusFilter, labCodeFilter, columnFilters]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setLabCodeFilter("");
  };

  const toggleItemExpanded = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
  };

  const handleItemClick = (item: WorkOrderItem, e: React.MouseEvent) => {
    // Stop propagation to prevent row expansion
    e.stopPropagation();
    
    // Create workOrderData from item
    const workOrderData = {
      id: mockBatch.batchNumber + "-" + item.id,
      srDoc: mockBatch.srNumber,
      salesperson: "Not assigned",
      contact: "Brad Morrison",
      status: item.itemStatus,
      customer: mockBatch.customer,
      equipmentType: item.item,
      location: item.location.toLowerCase().replace(/\s+/g, '-'),
      division: item.division.toLowerCase(),
      assignedTo: item.assignedTo || "not-assigned",
      urgencyLevel: "normal",
      dueDate: item.needByDate || "",
      arrivalDate: item.itemCreated,
      needBy: item.needByDate || "",
      calFreq: "Annual",
      details: {
        manufacturer: item.manufacturer || "",
        modelNumber: item.model || "",
        serialNumber: item.serialNumber || "",
        itemType: item.item,
        priority: "normal",
        action: item.action,
        job: item.action,
        batch: mockBatch.batchNumber,
        nextBy: item.needByDate || "",
        createdDate: item.itemCreated,
        departureDate: item.departureDate || "",
        originalLoc: item.location,
        destLoc: "main-office",
        serviceType: item.operationType || "standard",
        technicalNotes: item.lastComment || "",
        comments: item.lastComment || "Item ready for processing",
        poNumber: item.poNumber,
        custId: "CUST-001",
        custSn: "CSN-001",
        labCode: item.labCode,
        workDescription: `${item.item} - ${item.operationType || item.action}`,
        invoiceNumber: "",
        proofOfDelivery: "pending",
        statusDate: item.itemCreated,
        lastModified: item.lastCommentDate || item.itemCreated,
        template: "Standard Procedure",
        items: "1",
      }
    };
    
    navigate('/edit-order', { state: { workOrderData } });
  };
   return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-7 text-xs px-2">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to Batches
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs px-3">Export</Button>
      </div>

      {/* Filters - hidden in CSA view */}
      {viewMode !== 'csa' && (
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input 
              type="text"
              placeholder="Search across all items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-7 text-[11px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-7 text-[11px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status} className="text-[11px]">{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={labCodeFilter} onValueChange={setLabCodeFilter}>
            <SelectTrigger className="w-[140px] h-7 text-[11px]">
              <SelectValue placeholder="Filter by Lab Code" />
            </SelectTrigger>
            <SelectContent>
              {uniqueLabCodes.map(labCode => (
                <SelectItem key={labCode} value={labCode} className="text-[11px]">{labCode}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchQuery || statusFilter || labCodeFilter) && (
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="h-7 text-[11px] px-2">
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <div className="text-[10px] text-muted-foreground">
          Showing {filteredItems.length} of {mockBatch.items.length} items
          {(searchQuery || statusFilter || labCodeFilter) && (
            <span className="ml-1 text-primary">
              {searchQuery && `• "${searchQuery}"`}
              {statusFilter && ` • ${statusFilter}`}
              {labCodeFilter && ` • ${labCodeFilter}`}
            </span>
          )}
        </div>
      </div>
      )}

      {/* Items Table */}
      <div>
        <h3 className="text-xs font-semibold mb-1.5">Items in Batch ({filteredItems.length})</h3>
        <div className="border rounded-md overflow-hidden">
          <Table>
             <TableHeader>
              <TableRow className="bg-muted/50 h-7">
                {viewMode === 'csa' ? (
                  <>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Item</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Location</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Item Created</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Action</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Item Status</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Manufacturer</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Model</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Description</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Serial #</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Deliver By</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Follow Up</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Item</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Division</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Location</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Item Created</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Action</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Item Status</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Manufacturer</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Model</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Lab Code</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">Serial #</TableHead>
                    <TableHead className="font-semibold text-[10px] py-1 px-2">PO #</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </>
                )}
              </TableRow>
              {/* Column Filter Row */}
              <TableRow className="border-b border-gray-100">
                {(viewMode === 'csa' ? [
                  'item', 'location', 'itemCreated', 'action', 'itemStatus', 'manufacturer', 'model', 'description', 'serialNumber', 'deliverByDate', 'followUpDate'
                ] : [
                  'item', 'division', 'location', 'itemCreated', 'action', 'itemStatus', 'manufacturer', 'model', 'labCode', 'serialNumber', 'poNumber'
                ]).map((key) => (
                  <TableHead key={key} className="py-1 px-1.5">
                    <div className="relative">
                      <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/50" />
                      <Input
                        placeholder=""
                        value={columnFilters[key] || ''}
                        onChange={(e) => setColumnFilters(prev => ({ ...prev, [key]: e.target.value }))}
                        className="h-6 text-[10px] pl-5 pr-5 border-muted bg-muted/30 rounded placeholder:text-muted-foreground/40 focus:bg-background focus:border-primary/30 transition-colors"
                      />
                      {columnFilters[key] && (
                        <button
                          onClick={() => setColumnFilters(prev => ({ ...prev, [key]: '' }))}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted transition-colors"
                        >
                          <X className="h-2.5 w-2.5 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow className="hover:bg-muted/30 h-6">
                    <TableCell className="font-medium text-[11px] py-1 px-2">
                      <button
                        onClick={(e) => handleItemClick(item, e)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors text-[11px]"
                      >
                        {item.item}
                      </button>
                    </TableCell>
                    {viewMode === 'csa' ? (
                      <>
                        <TableCell className="text-[11px] py-1 px-2">{item.location}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.itemCreated}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2 font-medium">{item.action}</TableCell>
                        <TableCell className="py-1 px-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            item.itemStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                            item.itemStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.itemStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.manufacturer || '-'}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.model || '-'}</TableCell>
                        <TableCell className="text-[10px] py-1 px-2 max-w-[120px] truncate">{item.description || '-'}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.serialNumber || '-'}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.deliverByDate || '-'}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.followUpDate || '-'}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-[11px] py-1 px-2">{item.division}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.location}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.itemCreated}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2 font-medium">{item.action}</TableCell>
                        <TableCell className="py-1 px-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            item.itemStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                            item.itemStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.itemStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.manufacturer || '-'}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.model || '-'}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2 font-medium">{item.labCode}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2">{item.serialNumber || '-'}</TableCell>
                        <TableCell className="text-[11px] py-1 px-2 font-medium">{item.poNumber}</TableCell>
                      </>
                    )}
                    {viewMode !== 'csa' && (
                    <TableCell className="w-8 py-1 px-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItemExpanded(item.id)}
                        className="h-5 w-5 p-0"
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                    )}
                  </TableRow>
                  {viewMode !== 'csa' && expandedItems.has(item.id) && (
                    <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50">
                      <TableCell colSpan={12} className="p-0">
                        <div className="p-3 animate-fade-in">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                            {/* Timeline & Dates Card */}
                            <div className="bg-white rounded-md border border-gray-200 shadow-sm">
                              <div className="px-3 py-1.5 border-b border-gray-100">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3 w-3 text-blue-600" />
                                  <h4 className="font-semibold text-gray-900 text-[11px]">Timeline & Dates</h4>
                                </div>
                              </div>
                              <div className="px-3 py-2">
                                <div className="relative">
                                  <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-orange-200 via-green-200 to-red-200"></div>
                                  <div className="space-y-3">
                                    <div className="flex items-start gap-2.5">
                                      <div className="relative z-10 flex items-center justify-center w-6 h-6 bg-blue-100 border border-blue-300 rounded-full">
                                        <Calendar className="h-2.5 w-2.5 text-blue-600" />
                                      </div>
                                      <div className="flex-1 min-w-0 pt-0.5">
                                        <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Item Created</span>
                                        <p className="text-[11px] font-medium text-gray-900">{item.itemCreated}</p>
                                      </div>
                                    </div>
                                    {item.followUpDate && (
                                      <div className="flex items-start gap-2.5">
                                        <div className="relative z-10 flex items-center justify-center w-6 h-6 bg-orange-100 border border-orange-300 rounded-full">
                                          <Clock className="h-2.5 w-2.5 text-orange-600" />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Follow Up</span>
                                          <p className="text-[11px] font-medium text-gray-900">{item.followUpDate}</p>
                                        </div>
                                      </div>
                                    )}
                                    {item.departureDate && (
                                      <div className="flex items-start gap-2.5">
                                        <div className="relative z-10 flex items-center justify-center w-6 h-6 bg-green-100 border border-green-300 rounded-full">
                                          <Calendar className="h-2.5 w-2.5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Departure</span>
                                          <p className="text-[11px] font-medium text-gray-900">{item.departureDate}</p>
                                        </div>
                                      </div>
                                    )}
                                    {item.needByDate && (
                                      <div className="flex items-start gap-2.5">
                                        <div className="relative z-10 flex items-center justify-center w-6 h-6 bg-red-100 border border-red-300 rounded-full">
                                          <Clock className="h-2.5 w-2.5 text-red-600" />
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Need By</span>
                                          <p className="text-[11px] font-semibold text-red-600">{item.needByDate}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Assignment & Details Card */}
                            <div className="bg-white rounded-md border border-gray-200 shadow-sm">
                              <div className="px-3 py-1.5 border-b border-gray-100">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3 w-3 text-purple-600" />
                                  <h4 className="font-semibold text-gray-900 text-[11px]">Assignment & Details</h4>
                                </div>
                              </div>
                              <div className="px-3 py-2 space-y-2">
                                {item.assignedTo && (
                                  <div>
                                    <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Assigned To</span>
                                    <div className="font-semibold text-blue-600 text-[11px]">{item.assignedTo}</div>
                                  </div>
                                )}
                                {item.operationType && (
                                  <div>
                                    <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Operation Type</span>
                                    <div className="font-medium text-gray-900 text-[11px]">{item.operationType}</div>
                                  </div>
                                )}
                                <div>
                                  <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Location</span>
                                  <div className="font-medium text-gray-900 text-[11px]">{item.location}</div>
                                </div>
                                <div>
                                  <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Lab Code</span>
                                  <div className="font-mono text-[11px] text-gray-900 bg-gray-50 px-1.5 py-0.5 rounded inline-block">{item.labCode}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Cost & Comments Card */}
                            <div className="bg-white rounded-md border border-gray-200 shadow-sm">
                              <div className="px-3 py-1.5 border-b border-gray-100">
                                <div className="flex items-center gap-1.5">
                                  <DollarSign className="h-3 w-3 text-green-600" />
                                  <h4 className="font-semibold text-gray-900 text-[11px]">Cost & Comments</h4>
                                </div>
                              </div>
                              <div className="px-3 py-2 space-y-2">
                                {item.estimatedCost && (
                                  <div>
                                    <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Estimated Cost</span>
                                    <div className="font-semibold text-green-600 text-[11px]">{item.estimatedCost}</div>
                                  </div>
                                )}
                                {item.actualCost && (
                                  <div>
                                    <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Actual Cost</span>
                                    <div className="font-semibold text-blue-600 text-[11px]">{item.actualCost}</div>
                                  </div>
                                )}
                                {item.lastCommentDate && (
                                  <div>
                                    <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Last Comment Date</span>
                                    <div className="font-medium text-gray-900 text-[11px]">{item.lastCommentDate}</div>
                                  </div>
                                )}
                                {item.lastComment && (
                                  <div>
                                    <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Last Comment</span>
                                    <div className="bg-blue-50 border border-blue-100 rounded p-1.5 mt-0.5">
                                      <p className="text-[10px] text-gray-800 leading-relaxed">{item.lastComment}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderBatchDetails;