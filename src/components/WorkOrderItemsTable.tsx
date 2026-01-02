import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Edit, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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

type SortKey = 'itemNumber' | 'manufacturer' | 'model' | 'serialNumber' | 'created' | 'departure' | 'itemStatus' | 'itemType' | 'deliverByDate';
type SortDirection = 'asc' | 'desc' | null;

export const WorkOrderItemsTable = ({ selectedPoNumber = "4510114092", showMockData = true, accountNumber = "1500.00", workOrderNumber = "5432", items = [] }: WorkOrderItemsTableProps) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Use items prop if provided, otherwise fall back to mock data based on showMockData
  const displayData = items.length > 0 ? items : (showMockData ? mockData : []);
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(displayData.map(item => item.id));
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

  const isAllSelected = displayData.length > 0 && selectedItems.length === displayData.length;
  const isSomeSelected = selectedItems.length > 0 && selectedItems.length < displayData.length;

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return displayData;
    
    return [...displayData].sort((a, b) => {
      let aVal = '';
      let bVal = '';
      
      switch (sortKey) {
        case 'serialNumber':
          aVal = (a as any).mfgSerial || (a as any).serialNumber || '';
          bVal = (b as any).mfgSerial || (b as any).serialNumber || '';
          break;
        default:
          aVal = (a as any)[sortKey] || '';
          bVal = (b as any)[sortKey] || '';
      }
      
      if (sortDirection === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [displayData, sortKey, sortDirection]);

  const SortableHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th 
      className="text-left p-3 font-medium cursor-pointer hover:bg-muted/80 select-none"
      onClick={() => handleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === sortKeyName ? (
          sortDirection === 'asc' ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-40" />
        )}
      </div>
    </th>
  );
  
  return (
    <div className="border rounded-lg overflow-hidden">
      {selectedItems.length > 0 && (
        <div className="bg-muted/50 px-3 py-2 border-b flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} item(s) selected
          </span>
          <Button 
            variant="link" 
            size="sm" 
            className="text-blue-600 p-0 h-auto"
            onClick={() => setSelectedItems([])}
          >
            Clear selection
          </Button>
        </div>
      )}
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 w-12">Actions</th>
            <th className="text-left p-3 w-12">
              <Checkbox 
                checked={isAllSelected}
                ref={(el) => {
                  if (el) {
                    (el as any).indeterminate = isSomeSelected;
                  }
                }}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <SortableHeader label="Item" sortKeyName="itemNumber" />
            <SortableHeader label="Manufacturer" sortKeyName="manufacturer" />
            <SortableHeader label="Model" sortKeyName="model" />
            <SortableHeader label="Serial #" sortKeyName="serialNumber" />
            <SortableHeader label="Created" sortKeyName="created" />
            <SortableHeader label="Departure" sortKeyName="departure" />
            <SortableHeader label="Item Status" sortKeyName="itemStatus" />
            <SortableHeader label="Item Type" sortKeyName="itemType" />
            <SortableHeader label="Deliver By Date" sortKeyName="deliverByDate" />
            <th className="text-left p-3 font-medium">PO #</th>
            <th className="text-left p-3 font-medium">Open PO/CO</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr 
              key={item.id} 
              className={`border-t hover:bg-muted/50 ${selectedItems.includes(item.id) ? 'bg-primary/10' : ''}`}
            >
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
                <Checkbox 
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                />
              </td>
              <td className="p-3">{accountNumber}-{workOrderNumber}-{item.itemNumber}</td>
              <td className="p-3">{item.manufacturer}</td>
              <td className="p-3">{item.model}</td>
              <td className="p-3">{(item as any).mfgSerial || (item as any).serialNumber}</td>
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
      
      {sortedData.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No data to display
        </div>
      )}
    </div>
  );
};
