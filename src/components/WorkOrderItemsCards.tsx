import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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
    case '[open items]': return 'bg-slate-100 text-slate-800';
    case '[awaiting cdr]': return 'bg-orange-100 text-orange-800';
    case '[assign/tech - repair - inlab]': return 'bg-blue-100 text-blue-800';
    case '[assigned to tech - repair dept]': return 'bg-blue-100 text-blue-800';
    case '[q/a hold - q/a disapproved]': return 'bg-red-100 text-red-800';
    case '[q/a insp - q/a hold - q/a fail]': return 'bg-red-100 text-red-800';
    case '[in lab - assigned to tech]': return 'bg-blue-100 text-blue-800';
    case '[in lab - q/a disapprove]': return 'bg-red-100 text-red-800';
    case '[estimate - a/r invoicing]': return 'bg-purple-100 text-purple-800';
    case '[to factory - awaiting parts]': return 'bg-orange-100 text-orange-800';
    case '[ar need by status]': return 'bg-yellow-100 text-yellow-800';
    case 'assigned to tech': return 'bg-blue-100 text-blue-800';
    case 'in transit': return 'bg-cyan-100 text-cyan-800';
    case 'lab management': return 'bg-indigo-100 text-indigo-800';
    case 'repair department': return 'bg-blue-100 text-blue-800';
    case 'rotation': return 'bg-teal-100 text-teal-800';
    case 'estimate': return 'bg-purple-100 text-purple-800';
    case 'awaiting parts': return 'bg-orange-100 text-orange-800';
    case 'awaiting pr approval': return 'bg-yellow-100 text-yellow-800';
    case 'in metrology': return 'bg-violet-100 text-violet-800';
    case 'to factory': return 'bg-amber-100 text-amber-800';
    case 'to factory - repair by replacement': return 'bg-amber-100 text-amber-800';
    case 'to factory - warranty': return 'bg-amber-100 text-amber-800';
    case 'lab hold': return 'bg-yellow-100 text-yellow-800';
    case 'q/a inspection': return 'bg-blue-100 text-blue-800';
    case 'q/a inspection - fail correction': return 'bg-red-100 text-red-800';
    case 'q/a hold': return 'bg-yellow-100 text-yellow-800';
    case 'q/a disapproved': return 'bg-red-100 text-red-800';
    case 'q/a fail log': return 'bg-red-100 text-red-800';
    case 'a/r invoicing': return 'bg-green-100 text-green-800';
    case 'a/r invoicing/hold': return 'bg-yellow-100 text-yellow-800';
    case 'admin processing': return 'bg-slate-100 text-slate-800';
    case 'back to customer': return 'bg-green-100 text-green-800';
    case 'calibrated on shelf': return 'bg-emerald-100 text-emerald-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    case 'item not found on site': return 'bg-red-100 text-red-800';
    case 'me review': return 'bg-indigo-100 text-indigo-800';
    case 'not used': return 'bg-gray-100 text-gray-800';
    case 'onsite': return 'bg-blue-100 text-blue-800';
    case 'ready for departure': return 'bg-green-100 text-green-800';
    case 'return to lab for processing': return 'bg-orange-100 text-orange-800';
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'surplus stock': return 'bg-teal-100 text-teal-800';
    case 'waiting on customer': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const WorkOrderItemsCards = ({ templateItems = [] }: WorkOrderItemsCardsProps) => {
  const navigate = useNavigate();

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
    ...mockData
  ];

  const handleViewDetails = (item: typeof allItems[0]) => {
    // Map item data to the format expected by EditOrder with comprehensive field mapping
    // Fill ALL fields based on reference screenshots
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
          <Checkbox />
          <span className="text-sm text-muted-foreground">Select All</span>
        </div>
        <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allItems.map((item, index) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <button
                    onClick={() => navigate("/edit-order")}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    {item.reportNumber ? `Report #${item.reportNumber}` : `Item #${item.reportNumber}`}
                  </button>
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
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto"
                  onClick={() => index === 0 ? null : handleViewDetails(item)}
                >
                  {index === 0 ? 'Clear' : 'View Details'}
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