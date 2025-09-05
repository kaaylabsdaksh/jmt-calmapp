import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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

const createEmptyItem = (): WorkOrderItemTemplate => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
});

export const WorkOrderItemsTemplate = () => {
  const [items, setItems] = useState<WorkOrderItemTemplate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<WorkOrderItemTemplate>(createEmptyItem());

  const handleDialogSubmit = () => {
    setItems([...items, newItem]);
    setNewItem(createEmptyItem());
    setIsDialogOpen(false);
  };

  const handleDialogCancel = () => {
    setNewItem(createEmptyItem());
    setIsDialogOpen(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof WorkOrderItemTemplate, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateNewItem = (field: keyof WorkOrderItemTemplate, value: string) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const clearAllItems = () => {
    setItems([]);
  };
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-2 bg-muted/20 border-b">
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="link" 
                className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Work Order Item</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Item #</label>
                  <Input 
                    placeholder="Item #"
                    value={newItem.itemNumber}
                    onChange={(e) => updateNewItem('itemNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cal Freq</label>
                  <Select value={newItem.calFreq} onValueChange={(value) => updateNewItem('calFreq', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Action Code</label>
                  <Select value={newItem.actionCode} onValueChange={(value) => updateNewItem('actionCode', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repair">REPAIR</SelectItem>
                      <SelectItem value="rc">R/C</SelectItem>
                      <SelectItem value="rcc">R/C/C</SelectItem>
                      <SelectItem value="cc">C/C</SelectItem>
                      <SelectItem value="test">TEST</SelectItem>
                      <SelectItem value="build-new">BUILD NEW</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newItem.priority} onValueChange={(value) => updateNewItem('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rush">Rush</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="expedite">Expedite</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Manufacturer</label>
                  <Select value={newItem.manufacturer} onValueChange={(value) => updateNewItem('manufacturer', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m-working-stand">1M WORKING STAND.</SelectItem>
                      <SelectItem value="3d-instruments">3D INSTRUMENTS</SelectItem>
                      <SelectItem value="3e">3E</SelectItem>
                      <SelectItem value="3m">3M</SelectItem>
                      <SelectItem value="3z-telecom">3Z TELECOM</SelectItem>
                      <SelectItem value="4b-components">4B COMPONENTS LIMITED</SelectItem>
                      <SelectItem value="5ft-wking">5FT WKING STANDARD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Input 
                    placeholder="Model"
                    value={newItem.model}
                    onChange={(e) => updateNewItem('model', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mfg Serial</label>
                  <Input 
                    placeholder="Mfg Serial"
                    value={newItem.mfgSerial}
                    onChange={(e) => updateNewItem('mfgSerial', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CustID</label>
                  <Input 
                    placeholder="CustID"
                    value={newItem.custId}
                    onChange={(e) => updateNewItem('custId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CustSN</label>
                  <Input 
                    placeholder="CustSN"
                    value={newItem.custSN}
                    onChange={(e) => updateNewItem('custSN', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Barcode Num</label>
                  <Input 
                    placeholder="Barcode"
                    value={newItem.barcodeNum}
                    onChange={(e) => updateNewItem('barcodeNum', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Warranty</label>
                  <Tabs value={newItem.warranty} onValueChange={(value) => updateNewItem('warranty', value)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="yes">Yes</TabsTrigger>
                      <TabsTrigger value="no">No</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">17025</label>
                  <Tabs value={newItem.iso17025} onValueChange={(value) => updateNewItem('iso17025', value)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="yes">Yes</TabsTrigger>
                      <TabsTrigger value="no">No</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimate</label>
                  <Input 
                    placeholder="Estimate"
                    value={newItem.estimate}
                    onChange={(e) => updateNewItem('estimate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Equip</label>
                  <Tabs value={newItem.newEquip} onValueChange={(value) => updateNewItem('newEquip', value)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="yes">Yes</TabsTrigger>
                      <TabsTrigger value="no">No</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Need By Date</label>
                  <Input 
                    type="date"
                    value={newItem.needByDate}
                    onChange={(e) => updateNewItem('needByDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleDialogCancel}>Cancel</Button>
                <Button onClick={handleDialogSubmit}>Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Button 
          variant="link" 
          className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto"
          onClick={clearAllItems}
        >
          Clear
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2 w-8">
                <Checkbox />
              </th>
              <th className="text-left p-2 font-medium w-16">Item#</th>
              <th className="text-left p-2 font-medium w-20">Cal Freq</th>
              <th className="text-left p-2 font-medium w-24">Action Code</th>
              <th className="text-left p-2 font-medium w-16">Priority</th>
              <th className="text-left p-2 font-medium w-24">Manufacturer</th>
              <th className="text-left p-2 font-medium w-20">Model</th>
              <th className="text-left p-2 font-medium w-24">Mfg Serial</th>
              <th className="text-left p-2 font-medium w-16">CustID</th>
              <th className="text-left p-2 font-medium w-20">CustSN</th>
              <th className="text-left p-2 font-medium w-24">Barcode Num</th>
              <th className="text-left p-2 font-medium w-16">Warranty</th>
              <th className="text-left p-2 font-medium w-16">17025</th>
              <th className="text-left p-2 font-medium w-20">Estimate</th>
              <th className="text-left p-2 font-medium w-20">New Equip</th>
              <th className="text-left p-2 font-medium w-24">Need By Date</th>
              <th className="text-left p-2 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
               <tr key={item.id} className="border-t hover:bg-muted/50">
                <td className="p-2">
                  <Checkbox />
                </td>
                <td className="p-2">
                  <Input 
                    placeholder="Item #"
                    value={item.itemNumber}
                    onChange={(e) => updateItem(item.id, 'itemNumber', e.target.value)}
                    className="w-full h-7 text-xs"
                  />
                </td>
                <td className="p-2">
                  <Select value={item.calFreq} onValueChange={(value) => updateItem(item.id, 'calFreq', value)}>
                    <SelectTrigger className="w-full h-7 text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Select value={item.actionCode} onValueChange={(value) => updateItem(item.id, 'actionCode', value)}>
                    <SelectTrigger className="w-full h-7 text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repair">REPAIR</SelectItem>
                      <SelectItem value="rc">R/C</SelectItem>
                      <SelectItem value="rcc">R/C/C</SelectItem>
                      <SelectItem value="cc">C/C</SelectItem>
                      <SelectItem value="test">TEST</SelectItem>
                      <SelectItem value="build-new">BUILD NEW</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Select value={item.priority} onValueChange={(value) => updateItem(item.id, 'priority', value)}>
                    <SelectTrigger className="w-full h-7 text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rush">Rush</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="expedite">Expedite</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Select value={item.manufacturer} onValueChange={(value) => updateItem(item.id, 'manufacturer', value)}>
                    <SelectTrigger className="w-full h-7 text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m-working-stand">1M WORKING STAND.</SelectItem>
                      <SelectItem value="3d-instruments">3D INSTRUMENTS</SelectItem>
                      <SelectItem value="3e">3E</SelectItem>
                      <SelectItem value="3m">3M</SelectItem>
                      <SelectItem value="3z-telecom">3Z TELECOM</SelectItem>
                      <SelectItem value="4b-components">4B COMPONENTS LIMITED</SelectItem>
                      <SelectItem value="5ft-wking">5FT WKING STANDARD</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input 
                    placeholder="Model"
                    value={item.model}
                    onChange={(e) => updateItem(item.id, 'model', e.target.value)}
                    className="w-full h-7 text-xs"
                  />
                </td>
                <td className="p-2">
                  <Input 
                    placeholder="Mfg Serial"
                    value={item.mfgSerial}
                    onChange={(e) => updateItem(item.id, 'mfgSerial', e.target.value)}
                    className="w-full h-7 text-xs"
                  />
                </td>
                <td className="p-2">
                  <Input 
                    placeholder="CustID"
                    value={item.custId}
                    onChange={(e) => updateItem(item.id, 'custId', e.target.value)}
                    className="w-full h-7 text-xs"
                  />
                </td>
                <td className="p-2">
                  <Input 
                    placeholder="CustSN"
                    value={item.custSN}
                    onChange={(e) => updateItem(item.id, 'custSN', e.target.value)}
                    className="w-full h-7 text-xs"
                  />
                </td>
                <td className="p-2">
                  <Input 
                    placeholder="Barcode"
                    value={item.barcodeNum}
                    onChange={(e) => updateItem(item.id, 'barcodeNum', e.target.value)}
                    className="w-full h-7 text-xs"
                  />
                </td>
                <td className="p-2">
                  <Select value={item.warranty} onValueChange={(value) => updateItem(item.id, 'warranty', value)}>
                    <SelectTrigger className="w-full h-7 text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Select value={item.iso17025} onValueChange={(value) => updateItem(item.id, 'iso17025', value)}>
                    <SelectTrigger className="w-full h-7 text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input 
                    placeholder="Estimate"
                    value={item.estimate}
                    onChange={(e) => updateItem(item.id, 'estimate', e.target.value)}
                    className="w-full h-7 text-xs"
                  />
                </td>
                <td className="p-2">
                  <Select value={item.newEquip} onValueChange={(value) => updateItem(item.id, 'newEquip', value)}>
                    <SelectTrigger className="w-full h-7 text-xs">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input 
                    type="date"
                    value={item.needByDate}
                    onChange={(e) => updateItem(item.id, 'needByDate', e.target.value)}
                    className="w-full h-7 text-xs"
                  />
                </td>
                <td className="p-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {items.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No data to display
        </div>
      ) : null}
    </div>
  );
};