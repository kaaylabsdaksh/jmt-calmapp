import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";
import UnusedItemsTopNav from "@/components/UnusedItemsTopNav";
import UnusedItemsSearchFilters from "@/components/UnusedItemsSearchFilters";

interface UnusedItem {
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
  openPoCo: string;
}

interface SearchFilters {
  globalSearch: string;
  itemStatus: string;
  itemType: string;
  manufacturer: string;
  dateFrom?: Date;
  dateTo?: Date;
  dateType: string;
}

const mockUnusedItems: UnusedItem[] = [
  {
    id: "1",
    reportNumber: "0152.01-802961-001",
    manufacturer: "",
    model: "",
    serialNumber: "",
    created: "09/12/2025",
    departure: "",
    itemStatus: "Not Used",
    itemType: "SINGLE",
    deliverByDate: "",
    poNumber: "",
    openPoCo: "",
  },
  {
    id: "2",
    reportNumber: "0152.01-802961-002",
    manufacturer: "",
    model: "",
    serialNumber: "",
    created: "09/12/2025",
    departure: "",
    itemStatus: "Not Used",
    itemType: "SINGLE",
    deliverByDate: "",
    poNumber: "",
    openPoCo: "",
  },
  {
    id: "3",
    reportNumber: "0152.01-802961-003",
    manufacturer: "",
    model: "",
    serialNumber: "",
    created: "09/12/2025",
    departure: "",
    itemStatus: "Not Used",
    itemType: "SINGLE",
    deliverByDate: "",
    poNumber: "",
    openPoCo: "",
  },
];

const UnusedItemsManagement = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState("15");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    globalSearch: '',
    itemStatus: '',
    itemType: '',
    manufacturer: '',
    dateType: ''
  });

  const totalItems = mockUnusedItems.length;
  const totalPages = Math.ceil(totalItems / parseInt(pageSize));

  const handleSearch = (filters: SearchFilters) => {
    console.log('Parent received search filters:', filters);
    setSearchFilters(filters);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(mockUnusedItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Not Used":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="bg-background min-h-full">
      <UnusedItemsTopNav />
      <main className="w-full max-w-none px-4 sm:px-6 py-6">
        <div className="w-full space-y-6">
          <UnusedItemsSearchFilters onSearch={handleSearch} />
          
          <Card>
            <CardHeader>
              <CardTitle>Unused Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length === mockUnusedItems.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Report #</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Serial #</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Item Status</TableHead>
                        <TableHead>Item Type</TableHead>
                        <TableHead>Deliver By Date</TableHead>
                        <TableHead>PO #</TableHead>
                        <TableHead>Open PO/CO</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUnusedItems.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(checked) => 
                                handleSelectItem(item.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.reportNumber}
                          </TableCell>
                          <TableCell>{item.manufacturer}</TableCell>
                          <TableCell>{item.model}</TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>{item.created}</TableCell>
                          <TableCell>{item.departure}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(item.itemStatus)}>
                              {item.itemStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {item.itemType}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.deliverByDate}</TableCell>
                          <TableCell>{item.poNumber}</TableCell>
                          <TableCell>{item.openPoCo}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} ({totalItems} items)
                    </span>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-muted-foreground">Page size:</span>
                      <Select value={pageSize} onValueChange={setPageSize}>
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="15">15</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                      {currentPage}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UnusedItemsManagement;