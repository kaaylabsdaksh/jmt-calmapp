import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ArrowLeft, Plus, Download, User, Calendar, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'In Progress': return 'default';
      case 'Completed': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return '⭕';
      case 'In Progress': return '🔄';
      case 'Completed': return '✅';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover-scale">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Batch Summary Card */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>WO Batch: {mockBatch.batchNumber}</span>
            <Badge variant="outline">{mockBatch.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Customer:</span>
              <span>{mockBatch.customer}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Account:</span>
              <span>{mockBatch.accountNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">SR#:</span>
              <span>{mockBatch.srNumber}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Items in Batch ({mockBatch.items.length} items)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(groupedItems).map(([status, items]) => (
            <Collapsible
              key={status}
              open={openSections[status]}
              onOpenChange={() => toggleSection(status)}
              className="animate-scale-in"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 w-full">
                    {openSections[status] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="text-lg">{getStatusIcon(status)}</span>
                    <span className="font-medium text-left">
                      {status} Items ({items.length})
                    </span>
                    <div className="ml-auto">
                      <Badge variant={getStatusBadgeVariant(status)}>
                        {items.length}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-4 animate-accordion-down">
                <div className="space-y-3 pl-8">
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">
                      No items in this status
                    </p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors story-link"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-sm">
                              {item.itemNumber}
                            </span>
                            <span className="text-sm">
                              {item.description}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Qty: {item.quantity}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>Assigned to: {item.assignedTo}</span>
                            <span>Need by: {item.needByDate}</span>
                            {item.notes && (
                              <span className="italic">Note: {item.notes}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrderBatchDetails;