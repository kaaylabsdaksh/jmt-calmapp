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

  const labelCls = "block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1";

  return (
    <div className="space-y-3">
      {/* Main Form Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="px-4 py-2 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Estimate Information
          </CardTitle>
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

        <CardContent className="p-4 space-y-4">
          {/* Row 1: Primary Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className={labelCls}>Estimate Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between text-left font-normal h-8 text-sm px-3",
                      !estimateDate && "text-muted-foreground"
                    )}
                  >
                    <span>{estimateDate ? format(estimateDate, "MM/dd/yyyy") : "Select date"}</span>
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
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

            <div>
              <Label className={labelCls}>Estimate Status</Label>
              <Select
                value={estimateData.estimateStatus}
                onValueChange={(value) => handleInputChange('estimateStatus', value)}
              >
                <SelectTrigger className="h-8 text-sm">
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

            <div>
              <Label className={labelCls}>Item #</Label>
              <Input
                value={estimateData.itemNumber}
                onChange={(e) => handleInputChange('itemNumber', e.target.value)}
                placeholder="Item number"
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Row 2: Item Specifics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className={labelCls}>Line Item</Label>
              <Input
                value={estimateData.lineItem}
                onChange={(e) => handleInputChange('lineItem', e.target.value)}
                placeholder="Line item description"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className={labelCls}>Item sent in for</Label>
              <Select
                value={estimateData.itemSentInFor}
                onValueChange={(value) => handleInputChange('itemSentInFor', value)}
              >
                <SelectTrigger className="h-8 text-sm">
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

          {/* Row 3: Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className={labelCls}>Problem</Label>
              <Textarea
                value={estimateData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="Describe the problem..."
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
            <div>
              <Label className={labelCls}>Recommendation</Label>
              <Textarea
                value={estimateData.recommendation}
                onChange={(e) => handleInputChange('recommendation', e.target.value)}
                placeholder="Enter recommendation..."
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
          </div>

          {/* Row 4: Financial & Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label className={labelCls}>Freight Cost</Label>
              <Input
                value={estimateData.costInfoFreight}
                onChange={(e) => handleInputChange('costInfoFreight', e.target.value)}
                placeholder="Freight"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className={labelCls}>Tax</Label>
              <Input
                value={estimateData.tax}
                onChange={(e) => handleInputChange('tax', e.target.value)}
                placeholder="Tax amount"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className={labelCls}>Turnaround Time</Label>
              <Input
                value={estimateData.estTurnaroundTime}
                onChange={(e) => handleInputChange('estTurnaroundTime', e.target.value)}
                placeholder="Est. time"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className={labelCls}>Replacement Info</Label>
              <Input
                value={estimateData.replacementCostInfo}
                onChange={(e) => handleInputChange('replacementCostInfo', e.target.value)}
                placeholder="Cost details"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimate History Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="px-4 py-2 border-b bg-muted/30">
          <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Estimate History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 border-b">Est Date</th>
                <th className="px-4 py-2 border-b">Est Status</th>
                <th className="px-4 py-2 border-b">Report</th>
                <th className="px-4 py-2 border-b">Received</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No history records available
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
