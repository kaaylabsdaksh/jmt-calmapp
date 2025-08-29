import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Download, Printer, Eye, Edit, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Enhanced mock data with all fields from original
const workOrders = [
  {
    id: "500133",
    date: "10/15/2021",
    updateDate: "08/16/2023",
    location: "In Lab",
    action: "COC",
    statusDate: "11/24/2022",
    receivedDate: "08/02/2023",
    statusBy: "ADEULIS",
    manufacturer: "ADEULIS",
    modelNumber: "PPS-1734",
    labOrder: "V",
    priority: "Normal",
    statusDate2: "TN3-1348D-162",
    custPo: "RAT-780",
    costId: "N/A",
    poNumber: "CUSTTOP",
    unitType: "CUSTTOP",
    itemType: "J M Test Systems Rental Equip",
    departure: "SINGLE",
    due: "-",
    specialInstructions: "-",
    proofOfDelivery: "-",
    status: "In Lab"
  },
  {
    id: "500132",
    date: "10/15/2021",
    updateDate: "08/16/2023", 
    location: "In Lab",
    action: "COC",
    statusDate: "11/24/2022",
    receivedDate: "08/02/2023",
    statusBy: "STARRETT",
    manufacturer: "STARRETT",
    modelNumber: "844-441",
    labOrder: "V",
    priority: "Normal",
    statusDate2: "TN4-1348D-162",
    custPo: "NON-CLEAN",
    costId: "N/A",
    poNumber: "SEPFAC6",
    unitType: "SEPFAC6", 
    itemType: "J M Test Systems Rental Equip",
    departure: "SINGLE",
    due: "-",
    specialInstructions: "-",
    proofOfDelivery: "-",
    status: "In Lab"
  },
  {
    id: "500131",
    date: "10/15/2021",
    updateDate: "08/16/2023",
    location: "In Lab", 
    action: "COC",
    statusDate: "N/A",
    receivedDate: "08/02/2023",
    statusBy: "CHARLS LTD",
    manufacturer: "CHARLS LTD",
    modelNumber: "1000 PS/100 gr",
    labOrder: "V",
    priority: "Normal",
    statusDate2: "600+",
    custPo: "ROT610",
    costId: "N/A", 
    poNumber: "CUSTTOP",
    unitType: "CUSTTOP",
    itemType: "J M Test Systems Rental Equip",
    departure: "Homeless (15)",
    due: "-",
    specialInstructions: "-",
    proofOfDelivery: "-",
    status: "In Lab"
  }
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "In Lab": return "secondary";
    case "Complete": return "default";
    case "Rush": return "destructive";
    case "Emergency": return "destructive";
    case "Shipped": return "outline";
    default: return "secondary";
  }
};

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "Rush": return "destructive";
    case "Emergency": return "destructive";
    case "Normal": return "outline";
    default: return "outline";
  }
};

const EnhancedWorkOrdersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const totalRecords = 1985;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(selectedRows.length === workOrders.length ? [] : workOrders.map(order => order.id));
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Work Order Results</CardTitle>
          
          {/* Table Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Show:</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>per page</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Selection Info */}
        {selectedRows.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Bulk Update</Button>
                <Button variant="outline" size="sm">Export Selected</Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedRows([])}>Clear Selection</Button>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto max-w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === workOrders.length}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="font-semibold min-w-24">WO #</TableHead>
                <TableHead className="font-semibold min-w-24">Date</TableHead>
                <TableHead className="font-semibold min-w-24">Update</TableHead>
                <TableHead className="font-semibold min-w-24">Location</TableHead>
                <TableHead className="font-semibold min-w-20">Action</TableHead>
                <TableHead className="font-semibold min-w-28">Status Date</TableHead>
                <TableHead className="font-semibold min-w-28">Received</TableHead>
                <TableHead className="font-semibold min-w-24">Status By</TableHead>
                <TableHead className="font-semibold min-w-32">Manufacturer</TableHead>
                <TableHead className="font-semibold min-w-32">Model Number</TableHead>
                <TableHead className="font-semibold w-16">Lab</TableHead>
                <TableHead className="font-semibold min-w-20">Priority</TableHead>
                <TableHead className="font-semibold min-w-32">Serial/ID</TableHead>
                <TableHead className="font-semibold min-w-24">Cust PO</TableHead>
                <TableHead className="font-semibold min-w-20">Cost ID</TableHead>
                <TableHead className="font-semibold min-w-24">PO #</TableHead>
                <TableHead className="font-semibold min-w-24">Unit Type</TableHead>
                <TableHead className="font-semibold min-w-48">Item Type</TableHead>
                <TableHead className="font-semibold min-w-32">Departure</TableHead>
                <TableHead className="font-semibold min-w-20">Due</TableHead>
                <TableHead className="font-semibold min-w-32">Special Instructions</TableHead>
                <TableHead className="font-semibold min-w-32">Proof of Delivery</TableHead>
                <TableHead className="font-semibold w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((order, index) => (
                <TableRow 
                  key={order.id} 
                  className={`
                    ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                    ${selectedRows.includes(order.id) ? "bg-primary/10" : ""}
                    hover:bg-muted/30 transition-colors
                  `}
                >
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(order.id)}
                      onChange={() => handleSelectRow(order.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto font-medium text-primary hover:underline">
                      {order.id}
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm">{order.date}</TableCell>
                  <TableCell className="text-sm">{order.updateDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                      {order.location}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{order.action}</TableCell>
                  <TableCell className="text-sm">{order.statusDate}</TableCell>
                  <TableCell className="text-sm">{order.receivedDate}</TableCell>
                  <TableCell className="text-sm">{order.statusBy}</TableCell>
                  <TableCell className="text-sm font-medium">{order.manufacturer}</TableCell>
                  <TableCell className="text-sm">{order.modelNumber}</TableCell>
                  <TableCell className="text-center font-mono">{order.labOrder}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(order.priority)} className="text-xs">
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{order.statusDate2}</TableCell>
                  <TableCell className="text-sm">{order.custPo}</TableCell>
                  <TableCell className="text-sm">{order.costId}</TableCell>
                  <TableCell className="text-sm">{order.poNumber}</TableCell>
                  <TableCell className="text-sm">{order.unitType}</TableCell>
                  <TableCell className="text-sm">{order.itemType}</TableCell>
                  <TableCell className="text-sm">{order.departure}</TableCell>
                  <TableCell className="text-sm">{order.due}</TableCell>
                  <TableCell className="text-sm">{order.specialInstructions}</TableCell>
                  <TableCell className="text-sm">{order.proofOfDelivery}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border shadow-lg z-50">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Printer className="h-4 w-4" />
                          Print Label
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Open in New Tab
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Enhanced Pagination */}
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-4 border-t bg-muted/20 gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} records
            </span>
            <span>•</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {/* First few pages */}
              {[1, 2, 3].map(page => (
                page <= totalPages && (
                  <Button 
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-8"
                  >
                    {page}
                  </Button>
                )
              ))}
              
              {/* Current page area */}
              {currentPage > 5 && <span className="px-2 text-muted-foreground">...</span>}
              {currentPage > 3 && currentPage <= totalPages - 3 && (
                <Button 
                  variant="default"
                  size="sm"
                  className="w-10 h-8"
                >
                  {currentPage}
                </Button>
              )}
              {currentPage < totalPages - 4 && <span className="px-2 text-muted-foreground">...</span>}
              
              {/* Last few pages */}
              {[totalPages - 2, totalPages - 1, totalPages].map(page => (
                page > 3 && page > 0 && (
                  <Button 
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-8"
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Jump to page */}
          <div className="flex items-center gap-2 text-sm">
            <span>Go to page:</span>
            <Input 
              type="number" 
              min={1} 
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1));
                setCurrentPage(page);
              }}
              className="w-16 h-8"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedWorkOrdersTable;