import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";

// Mock data for demonstration
const workOrders = [
  {
    id: "500133",
    updateDate: "10/15/2021",
    location: "In Lab",
    lastUpdate: "08/16/2023",
    received: "08/02/2023",
    manufacturer: "ADEULIS",
    modelNumber: "PPS-1734",
    labOrder: "V",
    priority: "Normal",
    statusDate: "11/24/2022",
    custPo: "RAT-780",
    costId: "N/A",
    poNo: "CUSTTOP",
    itemType: "J M Test Systems Rental Equip",
    type: "SINGLE",
    departure: "SINGLE",
    status: "In Lab"
  },
  {
    id: "500132",
    updateDate: "10/15/2021",
    location: "In Lab",
    lastUpdate: "08/16/2023",
    received: "08/02/2023",
    manufacturer: "STARRETT",
    modelNumber: "844-441",
    labOrder: "V",
    priority: "Normal",
    statusDate: "11/24/2022",
    custPo: "NON-CLEAN",
    costId: "N/A",
    poNo: "SEPFAC6",
    itemType: "J M Test Systems Rental Equip",
    type: "SINGLE",
    departure: "SINGLE",
    status: "In Lab"
  },
  {
    id: "500131",
    updateDate: "10/15/2021",
    location: "In Lab",
    lastUpdate: "08/16/2023",
    received: "08/02/2023",
    manufacturer: "CHARLS LTD",
    modelNumber: "1000 PS/100 gr",
    labOrder: "V",
    priority: "Normal",
    statusDate: "N/A",
    custPo: "ROT610",
    costId: "N/A",
    poNo: "CUSTTOP",
    itemType: "J M Test Systems Rental Equip",
    type: "SINGLE",
    departure: "Homeless (15)",
    status: "In Lab"
  }
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "In Lab":
      return "secondary";
    case "Complete":
      return "default";
    case "Rush":
      return "destructive";
    case "Emergency":
      return "destructive";
    default:
      return "secondary";
  }
};

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "Rush":
      return "destructive";
    case "Emergency":
      return "destructive";
    default:
      return "outline";
  }
};

const WorkOrdersTable = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Work Order Results</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Showing 1-3 of 1985 records</span>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Work Order</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Update</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Action</TableHead>
                <TableHead className="font-semibold">Status Date</TableHead>
                <TableHead className="font-semibold">Status Date</TableHead>
                <TableHead className="font-semibold">Status By</TableHead>
                <TableHead className="font-semibold">Manufacturer</TableHead>
                <TableHead className="font-semibold">Model Number</TableHead>
                <TableHead className="font-semibold">Lab Order</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status Date</TableHead>
                <TableHead className="font-semibold">PO #</TableHead>
                <TableHead className="font-semibold">Cost ID</TableHead>
                <TableHead className="font-semibold">PO #</TableHead>
                <TableHead className="font-semibold">Unit Type</TableHead>
                <TableHead className="font-semibold">Item Type</TableHead>
                <TableHead className="font-semibold">Departure</TableHead>
                <TableHead className="font-semibold">Due</TableHead>
                <TableHead className="font-semibold">Special Instruct</TableHead>
                <TableHead className="font-semibold">Proof of Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((order, index) => (
                <TableRow key={order.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto font-medium text-primary">
                      {order.id}
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm">{order.updateDate}</TableCell>
                  <TableCell className="text-sm">{order.lastUpdate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                      {order.location}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">COC</TableCell>
                  <TableCell className="text-sm">{order.statusDate}</TableCell>
                  <TableCell className="text-sm">{order.received}</TableCell>
                  <TableCell className="text-sm">ADEULIS</TableCell>
                  <TableCell className="text-sm font-medium">{order.manufacturer}</TableCell>
                  <TableCell className="text-sm">{order.modelNumber}</TableCell>
                  <TableCell className="text-center">{order.labOrder}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(order.priority)} className="text-xs">
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">TN3-1348D-162</TableCell>
                  <TableCell className="text-sm">{order.custPo}</TableCell>
                  <TableCell className="text-sm">{order.costId}</TableCell>
                  <TableCell className="text-sm">{order.poNo}</TableCell>
                  <TableCell className="text-sm">CUSTTOP</TableCell>
                  <TableCell className="text-sm">{order.itemType}</TableCell>
                  <TableCell className="text-sm">{order.type}</TableCell>
                  <TableCell className="text-sm">{order.departure}</TableCell>
                  <TableCell className="text-sm">-</TableCell>
                  <TableCell className="text-sm">-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Page:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 7, 8, 9, 10].map((page) => (
                <Button 
                  key={page} 
                  variant={page === 1 ? "default" : "outline"} 
                  size="sm" 
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
              <span className="text-sm text-muted-foreground px-2">...</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            1985 records • 66 pages • 30 per page
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrdersTable;