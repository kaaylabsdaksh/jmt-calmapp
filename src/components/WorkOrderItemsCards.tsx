import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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

const mockData: WorkOrderItem[] = [
  {
    id: "1",
    reportNumber: "3455",
    manufacturer: "3243",
    model: "",
    serialNumber: "2343",
    created: "",
    departure: "",
    itemStatus: "",
    itemType: "",
    deliverByDate: "",
    poNumber: "",
  },
  {
    id: "2",
    reportNumber: "3456",
    manufacturer: "General Electric",
    model: "GE-4500",
    serialNumber: "GE445789",
    created: "2024-01-15",
    departure: "2024-02-01",
    itemStatus: "In Progress",
    itemType: "Transformer",
    deliverByDate: "2024-03-15",
    poNumber: "PO-2024-001",
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
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'testing':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const WorkOrderItemsCards = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox />
          <span className="text-sm text-muted-foreground">Select All</span>
        </div>
        <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockData.map((item, index) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="font-semibold text-foreground">Report #{item.reportNumber}</span>
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

              <div className="mt-4 pt-3 border-t flex justify-end">
                <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto">
                  {index === 0 ? 'Clear' : 'View Details'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockData.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No data to display
        </div>
      )}
    </div>
  );
};