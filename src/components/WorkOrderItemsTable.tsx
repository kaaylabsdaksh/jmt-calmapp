import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

interface WorkOrderItem {
  id: string;
  itemNumber: string;
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
    itemNumber: "001",
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
    itemNumber: "002",
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
    itemNumber: "003",
    manufacturer: "Siemens",
    model: "S7-1200",
    serialNumber: "SIE123456",
    created: "2024-01-20",
    departure: "2024-02-05",
    itemStatus: "Completed",
    itemType: "ESL",
    deliverByDate: "2024-02-28",
    poNumber: "PO-2024-002",
  },
  {
    id: "4",
    itemNumber: "004",
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
    itemNumber: "005",
    manufacturer: "Schneider Electric",
    model: "SEPAM-80",
    serialNumber: "SCH456789",
    created: "2024-02-01",
    departure: "2024-02-15",
    itemStatus: "Pending",
    itemType: "ESL",
    deliverByDate: "2024-03-20",
    poNumber: "PO-2024-004",
  },
];

interface WorkOrderItemsTableProps {
  selectedPoNumber?: string;
  showMockData?: boolean;
  accountNumber?: string;
  workOrderNumber?: string;
  items?: Array<{
    id: string;
    itemNumber: string;
    manufacturer: string;
    model: string;
    mfgSerial: string;
    created?: string;
    departure?: string;
    itemStatus?: string;
    itemType?: string;
    deliverByDate?: string;
    poNumber?: string;
  }>;
}

export const WorkOrderItemsTable = ({ selectedPoNumber = "4510114092", showMockData = true, accountNumber = "1500.00", workOrderNumber = "5432", items = [] }: WorkOrderItemsTableProps) => {
  const navigate = useNavigate();
  
  // Use items prop if provided, otherwise fall back to mock data based on showMockData
  const displayData = items.length > 0 ? items : (showMockData ? mockData : []);
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 w-12">Actions</th>
            <th className="text-left p-3 w-12">
              <Checkbox />
            </th>
            <th className="text-left p-3 font-medium">Item</th>
            <th className="text-left p-3 font-medium">Manufacturer</th>
            <th className="text-left p-3 font-medium">Model</th>
            <th className="text-left p-3 font-medium">Serial #</th>
            <th className="text-left p-3 font-medium">Created</th>
            <th className="text-left p-3 font-medium">Departure</th>
            <th className="text-left p-3 font-medium">Item Status</th>
            <th className="text-left p-3 font-medium">Item Type</th>
            <th className="text-left p-3 font-medium">Deliver By Date</th>
            <th className="text-left p-3 font-medium">PO #</th>
            <th className="text-left p-3 font-medium">Open PO/CO</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((item) => (
            <tr key={item.id} className="border-t hover:bg-muted/50">
              <td className="p-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/form-variations")}
                  className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </td>
              <td className="p-3">
                <Checkbox />
              </td>
              <td className="p-3">{accountNumber}-{workOrderNumber}-{item.itemNumber}</td>
              <td className="p-3">{item.manufacturer}</td>
              <td className="p-3">{item.model}</td>
              <td className="p-3">{item.mfgSerial || item.serialNumber}</td>
              <td className="p-3">{item.created || ""}</td>
              <td className="p-3">{item.departure || ""}</td>
              <td className="p-3">{item.itemStatus || ""}</td>
              <td className="p-3">{item.itemType || ""}</td>
              <td className="p-3">{item.deliverByDate || ""}</td>
              <td className="p-3">{selectedPoNumber}</td>
              <td className="p-3">
                <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {displayData.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No data to display
        </div>
      )}
    </div>
  );
};