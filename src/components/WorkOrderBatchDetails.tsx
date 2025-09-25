import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, User, MapPin, DollarSign, MessageSquare, Clock, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

const WorkOrderBatchDetails: React.FC<WorkOrderBatchDetailsProps> = ({ 
  batchId, 
  onBack 
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItemExpanded = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
  };
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <h3 className="text-base font-medium mb-3">Items in Batch ({mockBatch.items.length})</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Division</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Item Created</TableHead>
                <TableHead className="font-semibold">Action</TableHead>
                <TableHead className="font-semibold">Item Status</TableHead>
                <TableHead className="font-semibold">Manufacturer</TableHead>
                <TableHead className="font-semibold">Model</TableHead>
                <TableHead className="font-semibold">Lab Code</TableHead>
                <TableHead className="font-semibold">Serial #</TableHead>
                <TableHead className="font-semibold">PO #</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBatch.items.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell className="font-medium text-blue-600">{item.item}</TableCell>
                    <TableCell>{item.division}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.itemCreated}</TableCell>
                    <TableCell className="font-medium">{item.action}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.itemStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                        item.itemStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.itemStatus}
                      </span>
                    </TableCell>
                    <TableCell>{item.manufacturer || '-'}</TableCell>
                    <TableCell>{item.model || '-'}</TableCell>
                    <TableCell className="font-medium">{item.labCode}</TableCell>
                    <TableCell>{item.serialNumber || '-'}</TableCell>
                    <TableCell className="font-medium">{item.poNumber}</TableCell>
                    <TableCell className="w-12">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItemExpanded(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedItems.has(item.id) && (
                    <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50">
                      <TableCell colSpan={12} className="p-0">
                        <div className="p-6 animate-fade-in">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Timeline & Dates Card */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-blue-600" />
                                  <h4 className="font-semibold text-gray-900 text-sm">Timeline & Dates</h4>
                                </div>
                              </div>
                              <div className="p-4 space-y-4">
                                {item.needByDate && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3 w-3 text-red-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Need By Date</span>
                                    </div>
                                    <div className="font-semibold text-red-600 text-sm pl-5">{item.needByDate}</div>
                                  </div>
                                )}
                                {item.followUpDate && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-3 w-3 text-orange-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Follow Up Date</span>
                                    </div>
                                    <div className="font-medium text-gray-900 text-sm pl-5">{item.followUpDate}</div>
                                  </div>
                                )}
                                {item.departureDate && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-3 w-3 text-green-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Departure Date</span>
                                    </div>
                                    <div className="font-medium text-gray-900 text-sm pl-5">{item.departureDate}</div>
                                  </div>
                                )}
                                <div className="flex flex-col space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Item Created</span>
                                  </div>
                                  <div className="font-medium text-gray-900 text-sm pl-5">{item.itemCreated}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Assignment & Details Card */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-purple-600" />
                                  <h4 className="font-semibold text-gray-900 text-sm">Assignment & Details</h4>
                                </div>
                              </div>
                              <div className="p-4 space-y-4">
                                {item.assignedTo && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                      <User className="h-3 w-3 text-blue-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Assigned To</span>
                                    </div>
                                    <div className="font-semibold text-blue-600 text-sm pl-5">{item.assignedTo}</div>
                                  </div>
                                )}
                                {item.operationType && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Settings className="h-3 w-3 text-purple-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Operation Type</span>
                                    </div>
                                    <div className="font-medium text-gray-900 text-sm pl-5">{item.operationType}</div>
                                  </div>
                                )}
                                <div className="flex flex-col space-y-1">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-green-500" />
                                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Location</span>
                                  </div>
                                  <div className="font-medium text-gray-900 text-sm pl-5">{item.location}</div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Settings className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Lab Code</span>
                                  </div>
                                  <div className="font-mono text-sm text-gray-900 pl-5 bg-gray-50 px-2 py-1 rounded">{item.labCode}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Cost & Comments Card */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <h4 className="font-semibold text-gray-900 text-sm">Cost & Comments</h4>
                                </div>
                              </div>
                              <div className="p-4 space-y-4">
                                {item.estimatedCost && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-3 w-3 text-green-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Estimated Cost</span>
                                    </div>
                                    <div className="font-semibold text-green-600 text-sm pl-5">{item.estimatedCost}</div>
                                  </div>
                                )}
                                {item.actualCost && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-3 w-3 text-blue-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Actual Cost</span>
                                    </div>
                                    <div className="font-semibold text-blue-600 text-sm pl-5">{item.actualCost}</div>
                                  </div>
                                )}
                                {item.lastCommentDate && (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center gap-2">
                                      <MessageSquare className="h-3 w-3 text-orange-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Last Comment Date</span>
                                    </div>
                                    <div className="font-medium text-gray-900 text-sm pl-5">{item.lastCommentDate}</div>
                                  </div>
                                )}
                                {item.lastComment && (
                                  <div className="flex flex-col space-y-2">
                                    <div className="flex items-center gap-2">
                                      <MessageSquare className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Last Comment</span>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 ml-5">
                                      <p className="text-xs text-gray-800 leading-relaxed">{item.lastComment}</p>
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