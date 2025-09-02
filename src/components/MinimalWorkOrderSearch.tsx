import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, RotateCcw, Filter } from "lucide-react";

interface SearchForm {
  workOrderNumber: string;
  customerName: string;
  status: string;
  priority: string;
  manufacturer: string;
}

const MinimalWorkOrderSearch = () => {
  const [searchForm, setSearchForm] = useState<SearchForm>({
    workOrderNumber: '',
    customerName: '',
    status: '',
    priority: '',
    manufacturer: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateSearchForm = (field: keyof SearchForm, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchForm({
      workOrderNumber: '',
      customerName: '',
      status: '',
      priority: '',
      manufacturer: ''
    });
  };

  const handleSearch = () => {
    console.log("Searching with:", searchForm);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Work Order Search
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Essential Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wo-number" className="text-sm font-medium">
              Work Order Number
            </Label>
            <Input
              id="wo-number"
              placeholder="Enter WO #"
              value={searchForm.workOrderNumber}
              onChange={(e) => updateSearchForm('workOrderNumber', e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer" className="text-sm font-medium">
              Customer Name
            </Label>
            <Input
              id="customer"
              placeholder="Enter customer name"
              value={searchForm.customerName}
              onChange={(e) => updateSearchForm('customerName', e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={searchForm.status} onValueChange={(value) => updateSearchForm('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in-lab">In Lab</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        {showAdvanced && (
          <div className="border-t pt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select value={searchForm.priority} onValueChange={(value) => updateSearchForm('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-lg z-50">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="rush">Rush</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="text-sm font-medium">
                  Manufacturer
                </Label>
                <Input
                  id="manufacturer"
                  placeholder="Enter manufacturer"
                  value={searchForm.manufacturer}
                  onChange={(e) => updateSearchForm('manufacturer', e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={clearAllFilters} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Clear All
          </Button>
          
          <Button variant="secondary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Work Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalWorkOrderSearch;