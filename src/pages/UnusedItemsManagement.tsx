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
                {/* Header Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedItems.length === mockUnusedItems.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedItems.length > 0 
                        ? `${selectedItems.length} items selected`
                        : `${mockUnusedItems.length} items total`
                      }
                    </span>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockUnusedItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`transition-all duration-200 hover:shadow-md ${
                        selectedItems.includes(item.id) 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/20'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(checked) => 
                                handleSelectItem(item.id, checked as boolean)
                              }
                            />
                            <div>
                              <CardTitle className="text-base font-semibold text-foreground">
                                {item.reportNumber}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Report Number
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Status and Type Badges */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={getStatusBadgeVariant(item.itemStatus)}>
                            {item.itemStatus}
                          </Badge>
                          <Badge variant="outline">
                            {item.itemType}
                          </Badge>
                        </div>

                        {/* Item Details */}
                        <div className="space-y-3">
                          {item.manufacturer && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Manufacturer:</span>
                              <span className="text-sm text-foreground">{item.manufacturer}</span>
                            </div>
                          )}
                          
                          {item.model && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Model:</span>
                              <span className="text-sm text-foreground">{item.model}</span>
                            </div>
                          )}
                          
                          {item.serialNumber && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Serial #:</span>
                              <span className="text-sm text-foreground">{item.serialNumber}</span>
                            </div>
                          )}
                          
                          {item.created && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Created:</span>
                              <span className="text-sm text-foreground">{item.created}</span>
                            </div>
                          )}
                          
                          {item.departure && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Departure:</span>
                              <span className="text-sm text-foreground">{item.departure}</span>
                            </div>
                          )}
                          
                          {item.deliverByDate && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Deliver By:</span>
                              <span className="text-sm text-foreground">{item.deliverByDate}</span>
                            </div>
                          )}
                          
                          {item.poNumber && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-muted-foreground">PO #:</span>
                              <span className="text-sm text-foreground">{item.poNumber}</span>
                            </div>
                          )}
                          
                          {item.openPoCo && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-muted-foreground">Open PO/CO:</span>
                              <span className="text-sm text-foreground">{item.openPoCo}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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