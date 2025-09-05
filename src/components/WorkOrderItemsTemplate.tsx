import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface WorkOrderItemTemplate {
  id: string;
  itemNumber: string;
  calFreq: string;
  actionCode: string;
  priority: string;
  manufacturer: string;
  model: string;
  mfgSerial: string;
  custId: string;
  custSN: string;
  barcodeNum: string;
  warranty: string;
  iso17025: string;
  estimate: string;
  newEquip: string;
  needByDate: string;
}

const mockTemplateData: WorkOrderItemTemplate[] = [
  {
    id: "1",
    itemNumber: "",
    calFreq: "",
    actionCode: "",
    priority: "",
    manufacturer: "",
    model: "",
    mfgSerial: "",
    custId: "",
    custSN: "",
    barcodeNum: "",
    warranty: "",
    iso17025: "",
    estimate: "",
    newEquip: "",
    needByDate: "",
  },
];

export const WorkOrderItemsTemplate = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-2 bg-muted/20 border-b">
        <div className="flex items-center gap-2">
          <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
        <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto">
          Clear
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1400px]">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 w-12">
                <Checkbox />
              </th>
              <th className="text-left p-3 font-medium min-w-[80px]">Item#</th>
              <th className="text-left p-3 font-medium min-w-[100px]">Cal Freq</th>
              <th className="text-left p-3 font-medium min-w-[120px]">Action Code</th>
              <th className="text-left p-3 font-medium min-w-[80px]">Priority</th>
              <th className="text-left p-3 font-medium min-w-[120px]">Manufacturer</th>
              <th className="text-left p-3 font-medium min-w-[100px]">Model</th>
              <th className="text-left p-3 font-medium min-w-[120px]">Mfg Serial</th>
              <th className="text-left p-3 font-medium min-w-[80px]">CustID</th>
              <th className="text-left p-3 font-medium min-w-[100px]">CustSN</th>
              <th className="text-left p-3 font-medium min-w-[120px]">Barcode Num</th>
              <th className="text-left p-3 font-medium min-w-[80px]">Warranty</th>
              <th className="text-left p-3 font-medium min-w-[80px]">17025</th>
              <th className="text-left p-3 font-medium min-w-[100px]">Estimate</th>
              <th className="text-left p-3 font-medium min-w-[100px]">New Equip</th>
              <th className="text-left p-3 font-medium min-w-[120px]">Need By Date</th>
              <th className="text-left p-3 font-medium min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTemplateData.map((item, index) => (
              <tr key={item.id} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <Checkbox />
                </td>
                <td className="p-3">
                  <Input 
                    placeholder="Item #"
                    value={item.itemNumber}
                    className="w-full min-w-[70px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Select>
                    <SelectTrigger className="w-full min-w-[90px] h-8">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Select>
                    <SelectTrigger className="w-full min-w-[110px] h-8">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calibrate">Calibrate</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspect">Inspect</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Select>
                    <SelectTrigger className="w-full min-w-[70px] h-8">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Input 
                    placeholder="Manufacturer"
                    value={item.manufacturer}
                    className="w-full min-w-[110px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Input 
                    placeholder="Model"
                    value={item.model}
                    className="w-full min-w-[90px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Input 
                    placeholder="Mfg Serial"
                    value={item.mfgSerial}
                    className="w-full min-w-[110px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Input 
                    placeholder="CustID"
                    value={item.custId}
                    className="w-full min-w-[70px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Input 
                    placeholder="CustSN"
                    value={item.custSN}
                    className="w-full min-w-[90px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Input 
                    placeholder="Barcode"
                    value={item.barcodeNum}
                    className="w-full min-w-[110px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Select>
                    <SelectTrigger className="w-full min-w-[70px] h-8">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Select>
                    <SelectTrigger className="w-full min-w-[70px] h-8">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Input 
                    placeholder="Estimate"
                    value={item.estimate}
                    className="w-full min-w-[90px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Select>
                    <SelectTrigger className="w-full min-w-[90px] h-8">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Input 
                    type="date"
                    value={item.needByDate}
                    className="w-full min-w-[110px] h-8"
                  />
                </td>
                <td className="p-3">
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-8 text-center text-muted-foreground">
        No data to display
      </div>
    </div>
  );
};