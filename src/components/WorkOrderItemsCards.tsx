import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

interface WorkOrderItem {
  id: string;
  reportNumber: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  created: string;
  departure: string;
  itemStatus: string;
  itemType: string;
  deliverByDate: string;
  poNumber: string;
}

interface WorkOrderItemTemplate {
  id: string;
  itemNumber: string;
  calFreq: string;
  actionCode: string;
  priority: string;
  manufacturer: string;
  model: string;
  description: string;
  mfgSerial: string;
  custId: string;
  custSN: string;
  assetNumber: string;
  iso17025: string;
  estimate: string;
  newEquip: string;
  needByDate: string;
  ccCost: string;
}

interface WorkOrderItemsCardsProps {
  templateItems?: WorkOrderItemTemplate[];
  showMockData?: boolean;
}

const mockData: WorkOrderItem[] = [
  {
    id: "1",
    reportNumber: "3455",
    manufacturer: "3243",
    model: "Model-X200",
    serialNumber: "2343",
    created: "2024-01-10",
    departure: "2024-01-28",
    itemStatus: "normal",
    itemType: "rc",
    deliverByDate: "2024-12-15",
    poNumber: "PO-2024-001",
  },
  {
    id: "2",
    reportNumber: "OSC-002",
    manufacturer: "3M",
    model: "OSC-3000",
    serialNumber: "SN789012",
    created: "2024-01-15",
    departure: "2024-02-05",
    itemStatus: "expedite",
    itemType: "repair",
    deliverByDate: "2024-11-30",
    poNumber: "PO-2024-002",
  },
  {
    id: "3",
    reportNumber: "3457",
    manufacturer: "Siemens",
    model: "S7-1200",
    serialNumber: "SIE123456",
    created: "2024-01-20",
    departure: "2024-02-05",
    itemStatus: "Completed",
    itemType: "Control Panel",
    deliverByDate: "2024-02-28",
    poNumber: "PO-2024-002",
  },
  {
    id: "4",
    reportNumber: "3458",
    manufacturer: "ABB",
    model: "REF615",
    serialNumber: "ABB789123",
    created: "2024-01-25",
    departure: "2024-02-10",
    itemStatus: "Testing",
    itemType: "Protection Relay",
    deliverByDate: "2024-03-01",
    poNumber: "PO-2024-003",
  },
  {
    id: "5",
    reportNumber: "3459",
    manufacturer: "Schneider Electric",
    model: "SEPAM-80",
    serialNumber: "SCH456789",
    created: "2024-02-01",
    departure: "2024-02-15",
    itemStatus: "Pending",
    itemType: "Switchgear",
    deliverByDate: "2024-03-20",
    poNumber: "PO-2024-004",
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'in progress': return 'bg-blue-100 text-blue-800';
    case 'in lab': return 'bg-blue-100 text-blue-800';
    case 'testing': return 'bg-yellow-100 text-yellow-800';
    case 'pending': return 'bg-orange-100 text-orange-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'expedite': return 'bg-orange-100 text-orange-800';
    case 'normal': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const WorkOrderItemsCards = ({ templateItems = [], showMockData = true }: WorkOrderItemsCardsProps) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Combine template items and mock data
  const allItems = [
    ...templateItems.map(item => ({
      id: item.id,
      reportNumber: item.itemNumber,
      manufacturer: item.manufacturer,
      model: item.model,
      serialNumber: item.mfgSerial,
      created: "",
      departure: "",
      itemStatus: item.priority,
      itemType: item.actionCode,
      deliverByDate: item.needByDate,
      poNumber: "",
    })),
    ...(showMockData ? mockData : [])
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(allItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleClearAll = () => {
    setSelectedItems([]);
  };

  const isAllSelected = allItems.length > 0 && selectedItems.length === allItems.length;
  const isSomeSelected = selectedItems.length > 0 && selectedItems.length < allItems.length;

  const handleViewDetails = (item: typeof allItems[0]) => {
    const workOrderData = {
      id: "385737",
      srDoc: "SR Document",
      salesperson: "Not assigned",
      contact: "Brad Morrison",
      status: "in-progress",
      customer: "Entergy Inventory",
      equipmentType: "High frequency oscilloscope for signal analysis",
      location: "baton-rouge",
      division: "esl",
      assignedTo: "john-smith",
      urgencyLevel: "expedite",
      dueDate: "2024-11-30",
      arrivalDate: "2024-01-15",
      needBy: "2024-11-30",
      calFreq: "Annual",
      details: {
        manufacturer: item.manufacturer,
        modelNumber: item.model,
        serialNumber: item.serialNumber,
        itemType: "single",
        priority: "expedite",
        action: "C/C",
        job: "C/C",
        batch: "B2024-001",
        nextBy: "2024-11-30",
        createdDate: "2024-01-15",
        departureDate: "2024-02-05",
        originalLoc: "warehouse",
        destLoc: "main-office",
        serviceType: "express",
        technicalNotes: "High frequency oscilloscope calibration and testing required",
        comments: "Standard processing for calibration equipment",
        poNumber: "PO-2024-002",
        custId: "CUST-002",
        custSn: "C002",
        labCode: "LAB-3M",
        workDescription: `${item.manufacturer} ${item.model} - High frequency oscilloscope for signal analysis`,
        invoiceNumber: "INV-2024-002",
        proofOfDelivery: "pending",
        statusDate: "2024-01-15",
        lastModified: "2024-01-15",
        template: "Standard Calibration Procedure",
        items: "1",
      }
    };

    navigate("/edit-order", { state: { workOrderData } });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={isAllSelected}
            ref={(el) => {
              if (el) {
                (el as any).indeterminate = isSomeSelected;
              }
            }}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            Select All {selectedItems.length > 0 && `(${selectedItems.length} selected)`}
          </span>
        </div>
        <Button 
          variant="link" 
          className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allItems.map((item) => (
          <Card 
            key={item.id} 
            className={`hover:shadow-md transition-shadow ${selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  />
                  <span className="font-semibold text-foreground">
                    {item.reportNumber ? `Report #${item.reportNumber}` : `Item #${item.reportNumber}`}
                  </span>
                </div>
                {item.itemStatus && (
                  <Badge className={getStatusColor(item.itemStatus)}>
                    {item.itemStatus}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {item.manufacturer && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="font-medium">{item.manufacturer}</span>
                  </div>
                )}
                
                {item.model && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium">{item.model}</span>
                  </div>
                )}
                
                {item.serialNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serial #:</span>
                    <span className="font-medium">{item.serialNumber}</span>
                  </div>
                )}
                
                {item.itemType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{item.itemType}</span>
                  </div>
                )}
                
                {item.created && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{item.created}</span>
                  </div>
                )}
                
                {item.deliverByDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deliver By:</span>
                    <span className="font-medium">{item.deliverByDate}</span>
                  </div>
                )}
                
                {item.poNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PO #:</span>
                    <span className="font-medium">{item.poNumber}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => navigate("/form-variations")}
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto"
                  onClick={() => handleViewDetails(item)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {allItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No data to display
        </div>
      )}
    </div>
  );
};
