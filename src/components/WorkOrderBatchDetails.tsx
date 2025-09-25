import React from 'react';
import { ArrowLeft } from 'lucide-react';
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
      poNumber: "2110023"
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
      poNumber: "2110024"
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
      poNumber: "2110025"
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBatch.items.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderBatchDetails;