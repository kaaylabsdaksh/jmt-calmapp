import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const EstimateDetails = () => {
  const [estimateDate, setEstimateDate] = useState<Date>();
  const [estimateData, setEstimateData] = useState({
    estimateStatus: "In Progress",
    itemNumber: "001",
    lineItem: "",
    itemSentInFor: "",
    problem: "",
    recommendation: "",
    costInfoFreight: "prepay & add",
    tax: "",
    replacementCostInfo: "",
    estTurnaroundTime: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setEstimateData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Estimate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Row 1: Estimate Date, Status, Item # */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Estimate Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !estimateDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {estimateDate ? format(estimateDate, "MM/dd/yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={estimateDate}
                        onSelect={setEstimateDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Estimate Status</Label>
                  <Select 
                    value={estimateData.estimateStatus} 
                    onValueChange={(value) => handleInputChange('estimateStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Item #</Label>
                  <Input
                    value={estimateData.itemNumber}
                    onChange={(e) => handleInputChange('itemNumber', e.target.value)}
                    placeholder="Item number"
                  />
                </div>
              </div>

              {/* Row 2: Line Item, Item sent in for */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Line Item</Label>
                  <Input
                    value={estimateData.lineItem}
                    onChange={(e) => handleInputChange('lineItem', e.target.value)}
                    placeholder="Line item description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Item sent in for</Label>
                  <Select 
                    value={estimateData.itemSentInFor} 
                    onValueChange={(value) => handleInputChange('itemSentInFor', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calibration">Calibration</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Problem */}
              <div className="space-y-2">
                <Label>Problem</Label>
                <Textarea
                  value={estimateData.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  placeholder="Describe the problem..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Recommendation */}
              <div className="space-y-2">
                <Label>Recommendation</Label>
                <Textarea
                  value={estimateData.recommendation}
                  onChange={(e) => handleInputChange('recommendation', e.target.value)}
                  placeholder="Enter recommendation..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Cost Info and Tax */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost Info Freight</Label>
                  <Input
                    value={estimateData.costInfoFreight}
                    onChange={(e) => handleInputChange('costInfoFreight', e.target.value)}
                    placeholder="Freight information"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tax</Label>
                  <Input
                    value={estimateData.tax}
                    onChange={(e) => handleInputChange('tax', e.target.value)}
                    placeholder="Tax amount"
                  />
                </div>
              </div>

              {/* Replacement Cost Info */}  
              <div className="space-y-2">
                <Label>Replacement cost info</Label>
                <Textarea
                  value={estimateData.replacementCostInfo}
                  onChange={(e) => handleInputChange('replacementCostInfo', e.target.value)}
                  placeholder="Replacement cost details..."
                  className="min-h-[60px]"
                />
              </div>

              {/* Est turnaround time */}
              <div className="space-y-2">
                <Label>Est turnaround time</Label>
                <Input
                  value={estimateData.estTurnaroundTime}
                  onChange={(e) => handleInputChange('estTurnaroundTime', e.target.value)}
                  placeholder="Estimated turnaround time"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="default" size="sm">
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  Send to Est Tray
                </Button>
                <Button variant="outline" size="sm">
                  Email to AR
                </Button>
                <Button variant="outline" size="sm">
                  Send to Cost
                </Button>
                <Button variant="outline" size="sm">
                  Approve
                </Button>
                <Button variant="outline" size="sm">
                  Decline: Dispose
                </Button>
                <Button variant="outline" size="sm">
                  Decline: Send Back
                </Button>
                <Button variant="outline" size="sm">
                  Hold
                </Button>
                <Button variant="secondary" size="sm">
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estimate History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Estimate History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div>Est Date</div>
                  <div>Est Status</div>
                  <div>Report</div>
                  <div>Received</div>
                </div>
                <div className="text-center text-muted-foreground py-8 text-sm">
                  No data to display
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};