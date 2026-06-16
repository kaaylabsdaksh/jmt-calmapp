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

  const labelCls = "block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5";

  return (
    <div className="space-y-3">
      {/* Main Form Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="px-3 py-1 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider leading-none">
            Estimate Information
          </CardTitle>
          <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-md">
            <Button
              variant={userRole === 'technician' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onUserRoleChange?.('technician')}
              className="h-5 text-[9px] px-1.5"
            >
              Technician
            </Button>
            <Button
              variant={userRole === 'admin' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onUserRoleChange?.('admin')}
              className="h-5 text-[9px] px-1.5"
            >
              Admin
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-3 space-y-2">
          {/* Row 1: Primary Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label className={labelCls}>Estimate Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between text-left font-normal h-7 text-xs px-2.5",
                      !estimateDate && "text-muted-foreground"
                    )}
                  >
                    <span>{estimateDate ? format(estimateDate, "MM/dd/yyyy") : "Select date"}</span>
                    <CalendarIcon className="h-3 w-3 text-muted-foreground" />
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
              <Input
                value={estimateData.estimateStatus}
                readOnly
                className="h-7 text-xs bg-muted/50 cursor-default"
              />
            </div>

            <div>
              <Label className={labelCls}>Item #</Label>
              <Input
                value={estimateData.itemNumber}
                readOnly
                className="h-7 text-xs bg-muted/50 cursor-default"
              />
            </div>
          </div>

          {/* Row 2: Item Specifics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label className={labelCls}>Line Item</Label>
              <Input
                value={estimateData.lineItem}
                onChange={(e) => handleInputChange('lineItem', e.target.value)}
                placeholder="Line item description"
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className={labelCls}>Item sent in for</Label>
              <Select
                value={estimateData.itemSentInFor}
                onValueChange={(value) => handleInputChange('itemSentInFor', value)}
              >
                <SelectTrigger className="h-7 text-xs">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Label className={labelCls}>Problem</Label>
              <Textarea
                value={estimateData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                placeholder="Describe the problem..."
                className="min-h-[56px] text-xs resize-none"
              />
            </div>
            <div>
              <Label className={labelCls}>Recommendation</Label>
              <Textarea
                value={estimateData.recommendation}
                onChange={(e) => handleInputChange('recommendation', e.target.value)}
                placeholder="Enter recommendation..."
                className="min-h-[56px] text-xs resize-none"
              />
            </div>
          </div>

          {/* Row 4: Financial & Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div>
              <Label className={labelCls}>Freight Cost</Label>
              <Input
                value={estimateData.costInfoFreight}
                onChange={(e) => handleInputChange('costInfoFreight', e.target.value)}
                placeholder="Freight"
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className={labelCls}>Tax</Label>
              <Input
                value={estimateData.tax}
                onChange={(e) => handleInputChange('tax', e.target.value)}
                placeholder="Tax amount"
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className={labelCls}>Turnaround Time</Label>
              <Input
                value={estimateData.estTurnaroundTime}
                onChange={(e) => handleInputChange('estTurnaroundTime', e.target.value)}
                placeholder="Est. time"
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className={labelCls}>Replacement Info</Label>
              <Input
                value={estimateData.replacementCostInfo}
                onChange={(e) => handleInputChange('replacementCostInfo', e.target.value)}
                placeholder="Cost details"
                className="h-7 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimate History Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="px-3 py-1 border-b bg-muted/30">
          <CardTitle className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">
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
