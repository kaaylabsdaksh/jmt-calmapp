import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User, Shield } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EstimateDetailsProps {
  userRole?: 'admin' | 'technician';
  onUserRoleChange?: (role: 'admin' | 'technician') => void;
}

export const EstimateDetails = ({ userRole = 'technician', onUserRoleChange }: EstimateDetailsProps) => {
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
    <div className="space-y-4">
      {/* Main Form */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <CardTitle className="text-sm font-semibold">Estimate Information</CardTitle>
          <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-md">
            <Button
              variant={userRole === 'technician' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onUserRoleChange?.('technician')}
              className="flex items-center gap-1 h-6 text-[10px] px-2"
            >
              <User className="h-2.5 w-2.5" />
              <span>Technician</span>
            </Button>
            <Button
              variant={userRole === 'admin' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onUserRoleChange?.('admin')}
              className="flex items-center gap-1 h-6 text-[10px] px-2"
            >
              <Shield className="h-2.5 w-2.5" />
              <span>Admin</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4 pt-0">
          {/* All fields in one row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Estimate Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-8 text-xs",
                      !estimateDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1.5 h-3 w-3" />
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

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Estimate Status</Label>
              <Select 
                value={estimateData.estimateStatus} 
                onValueChange={(value) => handleInputChange('estimateStatus', value)}
              >
                <SelectTrigger className="h-8 text-xs">
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

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Item #</Label>
              <Input
                value={estimateData.itemNumber}
                onChange={(e) => handleInputChange('itemNumber', e.target.value)}
                placeholder="Item number"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Line Item</Label>
              <Input
                value={estimateData.lineItem}
                onChange={(e) => handleInputChange('lineItem', e.target.value)}
                placeholder="Line item description"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Item sent in for</Label>
              <Select 
                value={estimateData.itemSentInFor} 
                onValueChange={(value) => handleInputChange('itemSentInFor', value)}
              >
                <SelectTrigger className="h-8 text-xs">
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

          {/* Problem and Recommendation side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Problem</Label>
              <Textarea
                value={estimateData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="Describe the problem..."
                className="min-h-[60px] text-xs resize-none"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Recommendation</Label>
              <Textarea
                value={estimateData.recommendation}
                onChange={(e) => handleInputChange('recommendation', e.target.value)}
                placeholder="Enter recommendation..."
                className="min-h-[60px] text-xs resize-none"
              />
            </div>
          </div>

          {/* Cost Info and Tax */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Cost Info Freight</Label>
              <Input
                value={estimateData.costInfoFreight}
                onChange={(e) => handleInputChange('costInfoFreight', e.target.value)}
                placeholder="Freight information"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Tax</Label>
              <Input
                value={estimateData.tax}
                onChange={(e) => handleInputChange('tax', e.target.value)}
                placeholder="Tax amount"
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Replacement Cost Info & Est turnaround time - side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Replacement cost info</Label>
              <Textarea
                value={estimateData.replacementCostInfo}
                onChange={(e) => handleInputChange('replacementCostInfo', e.target.value)}
                placeholder="Replacement cost details..."
                className="min-h-[50px] text-xs resize-none"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Est turnaround time</Label>
              <Input
                value={estimateData.estTurnaroundTime}
                onChange={(e) => handleInputChange('estTurnaroundTime', e.target.value)}
                placeholder="Estimated turnaround time"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimate History */}
      <Card className="border-border/50">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-semibold">Estimate History</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-[10px] font-medium text-muted-foreground border-b pb-2">
              <div>Est Date</div>
              <div>Est Status</div>
              <div>Report</div>
              <div>Received</div>
            </div>
            <div className="text-center text-muted-foreground py-4 text-xs">
              No data to display
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};