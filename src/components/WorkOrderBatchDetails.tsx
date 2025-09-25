import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface WorkOrderItem {
  id: string;
  itemNumber: string;
  description: string;
  quantity: number;
  status: 'Open' | 'In Progress' | 'Completed';
  assignedTo: string;
  needByDate: string;
  notes?: string;
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
      itemNumber: "ITM-001",
      description: "Pressure Gauge Calibration",
      quantity: 2,
      status: "Open",
      assignedTo: "John Smith",
      needByDate: "2024-02-15",
      notes: "High priority calibration"
    },
    {
      id: "002", 
      itemNumber: "ITM-002",
      description: "Flow Meter Testing",
      quantity: 1,
      status: "Open",
      assignedTo: "Sarah Johnson",
      needByDate: "2024-02-20"
    },
    {
      id: "003",
      itemNumber: "ITM-003",
      description: "Temperature Sensor Verification",
      quantity: 3,
      status: "In Progress",
      assignedTo: "Mike Davis",
      needByDate: "2024-02-10",
      notes: "Requires special handling"
    },
    {
      id: "004",
      itemNumber: "ITM-004",
      description: "Vibration Analysis Equipment",
      quantity: 1,
      status: "In Progress",
      assignedTo: "Emily Wilson",
      needByDate: "2024-02-25"
    },
    {
      id: "005",
      itemNumber: "ITM-005",
      description: "Power Supply Unit Test",
      quantity: 2,
      status: "Completed",
      assignedTo: "Tom Rodriguez",
      needByDate: "2024-01-30"
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
  // Group items by status
  const groupedItems = mockBatch.items.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = [];
    }
    acc[item.status].push(item);
    return acc;
  }, {} as Record<string, WorkOrderItem[]>);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Open': true,
    'In Progress': true,
    'Completed': false
  });

  const toggleSection = (status: string) => {
    setOpenSections(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
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
          <Button variant="outline" size="sm">Add Item</Button>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      {/* Batch Info */}
      <div className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">WO Batch: {mockBatch.batchNumber}</h2>
          <span className="text-sm text-muted-foreground">{mockBatch.status}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>Customer: {mockBatch.customer}</div>
          <div>Account: {mockBatch.accountNumber}</div>
          <div>SR#: {mockBatch.srNumber}</div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="text-base font-medium mb-3">Items in Batch ({mockBatch.items.length})</h3>
        <div className="space-y-2">
          {Object.entries(groupedItems).map(([status, items]) => (
            <Collapsible
              key={status}
              open={openSections[status]}
              onOpenChange={() => toggleSection(status)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between py-2 px-3 rounded border cursor-pointer">
                  <div className="flex items-center space-x-2">
                    {openSections[status] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{status} Items</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-2">
                <div className="pl-6 space-y-2">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No items</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded text-sm">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{item.itemNumber}</span>
                            <span>{item.description}</span>
                            <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.assignedTo} • {item.needByDate}
                            {item.notes && <span className="ml-2 italic">{item.notes}</span>}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">Edit</Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">View</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderBatchDetails;