import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2, Edit } from "lucide-react";
import { useState } from "react";

interface WorkOrderReceivingItem {
  id: string;
  itemNumber: string;
  calFreq: string;
  actionCode: string;
  priority: string;
  manufacturer: string;
  model: string;
  description: string;
  mfgSerial: string;
  custId: string;
  custSN: string;
  assetNumber: string;
  iso17025: string;
  estimate: string;
  newEquip: string;
  needByDate: string;
  ccCost: string;
}

interface WorkOrderItemsReceivingProps {
  items: WorkOrderReceivingItem[];
  setItems: React.Dispatch<React.SetStateAction<WorkOrderReceivingItem[]>>;
}

const createEmptyItem = (): WorkOrderReceivingItem => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  itemNumber: "",
  calFreq: "",
  actionCode: "",
  priority: "",
  manufacturer: "",
  model: "",
  description: "",
  mfgSerial: "",
  custId: "",
  custSN: "",
  assetNumber: "",
  iso17025: "",
  estimate: "",
  newEquip: "",
  needByDate: "",
  ccCost: "",
});

// Helper function to truncate description to 2-3 words
const truncateDescription = (description: string): string => {
  if (!description) return "—";
  const words = description.split(" ");
  return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : description;
};

export const WorkOrderItemsReceiving = ({ items, setItems }: WorkOrderItemsReceivingProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<WorkOrderReceivingItem>(createEmptyItem());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Handle individual item selection
  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Handle select all functionality
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Check if all items are selected
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < items.length;

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
    setDeleteItemId(null);
  };

  const updateItem = (id: string, field: keyof WorkOrderReceivingItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateNewItem = (field: keyof WorkOrderReceivingItem, value: string) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const clearAllItems = () => {
    setItems([]);
  };

  const startEditing = (id: string) => {
    setEditingItemId(id);
  };

  const stopEditing = () => {
    setEditingItemId(null);
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
                Receive Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Receive New Work Order Item</DialogTitle>
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
                <div className="space-y-2 col-span-3">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => updateNewItem('description', e.target.value)}
                    className="min-h-[60px]"
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
                  <label className="text-sm font-medium">Asset Number</label>
                  <Input 
                    placeholder="Asset Number"
                    value={newItem.assetNumber}
                    onChange={(e) => updateNewItem('assetNumber', e.target.value)}
                  />
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">C/C Cost</label>
                  <Input 
                    placeholder="C/C Cost"
                    value={newItem.ccCost}
                    onChange={(e) => updateNewItem('ccCost', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleDialogCancel}>Cancel</Button>
                <Button onClick={handleDialogSubmit}>Receive Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="link" 
            className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto"
            onClick={clearAllItems}
          >
            Clear All
          </Button>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No items received yet. Click "Receive Item" to add your first received work order item.
        </div>
      ) : (
        <div className="p-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-muted/20 border-b">
                <tr>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-8">
                    <Checkbox 
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-20">ItemNum</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">Cal Freq</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">Action Code</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">Priority</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-24">Manufacturer</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">Model</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-32">Description</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-20">Mfg Serial</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">CustID</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">CustSN</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-20">Asset Number</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-12">17025</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">Estimate</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">New Equip</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-24">Need By Date</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">C/C Cost</th>
                  <th className="text-right p-2 text-xs font-medium text-muted-foreground w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-muted/10">
                    <td className="p-2">
                      <Checkbox 
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Item #"
                          value={item.itemNumber}
                          onChange={(e) => updateItem(item.id, 'itemNumber', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.itemNumber}>
                          {item.itemNumber || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Select value={item.calFreq} onValueChange={(value) => updateItem(item.id, 'calFreq', value)}>
                          <SelectTrigger className="h-6 text-xs">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="truncate capitalize" title={item.calFreq}>
                          {item.calFreq || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Select value={item.actionCode} onValueChange={(value) => updateItem(item.id, 'actionCode', value)}>
                          <SelectTrigger className="h-6 text-xs">
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
                      ) : (
                        <div className="truncate uppercase" title={item.actionCode}>
                          {item.actionCode || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Select value={item.priority} onValueChange={(value) => updateItem(item.id, 'priority', value)}>
                          <SelectTrigger className="h-6 text-xs">
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
                      ) : (
                        <div className="truncate capitalize" title={item.priority}>
                          {item.priority || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Select value={item.manufacturer} onValueChange={(value) => updateItem(item.id, 'manufacturer', value)}>
                          <SelectTrigger className="h-6 text-xs">
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
                      ) : (
                        <div className="truncate uppercase" title={item.manufacturer}>
                          {item.manufacturer || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Model"
                          value={item.model}
                          onChange={(e) => updateItem(item.id, 'model', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.model}>
                          {item.model || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Textarea 
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="h-6 min-h-6 text-xs resize-none"
                        />
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-help">
                                {truncateDescription(item.description)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p>{item.description || "No description available"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Mfg Serial"
                          value={item.mfgSerial}
                          onChange={(e) => updateItem(item.id, 'mfgSerial', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.mfgSerial}>
                          {item.mfgSerial || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="CustID"
                          value={item.custId}
                          onChange={(e) => updateItem(item.id, 'custId', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.custId}>
                          {item.custId || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="CustSN"
                          value={item.custSN}
                          onChange={(e) => updateItem(item.id, 'custSN', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.custSN}>
                          {item.custSN || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Asset Number"
                          value={item.assetNumber}
                          onChange={(e) => updateItem(item.id, 'assetNumber', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.assetNumber}>
                          {item.assetNumber || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Tabs value={item.iso17025} onValueChange={(value) => updateItem(item.id, 'iso17025', value)}>
                          <TabsList className="grid w-full grid-cols-2 h-6">
                            <TabsTrigger value="yes" className="text-xs">Yes</TabsTrigger>
                            <TabsTrigger value="no" className="text-xs">No</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      ) : (
                        <div className="truncate capitalize" title={item.iso17025}>
                          {item.iso17025 || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Estimate"
                          value={item.estimate}
                          onChange={(e) => updateItem(item.id, 'estimate', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.estimate}>
                          {item.estimate || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Tabs value={item.newEquip} onValueChange={(value) => updateItem(item.id, 'newEquip', value)}>
                          <TabsList className="grid w-full grid-cols-2 h-6">
                            <TabsTrigger value="yes" className="text-xs">Yes</TabsTrigger>
                            <TabsTrigger value="no" className="text-xs">No</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      ) : (
                        <div className="truncate capitalize" title={item.newEquip}>
                          {item.newEquip || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          type="date"
                          value={item.needByDate}
                          onChange={(e) => updateItem(item.id, 'needByDate', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.needByDate}>
                          {item.needByDate || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="C/C Cost"
                          value={item.ccCost}
                          onChange={(e) => updateItem(item.id, 'ccCost', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.ccCost}>
                          {item.ccCost || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-end gap-1">
                        {editingItemId === item.id ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={stopEditing}
                            >
                              ✓
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={() => startEditing(item.id)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={() => setDeleteItemId(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this item? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteItemId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeItem(item.id)}>Remove</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet Simplified Table View */}
          <div className="hidden md:block lg:hidden border rounded-lg overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-muted/20 border-b">
                <tr>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-8">
                    <Checkbox 
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Item #</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Action</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Manufacturer</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Model</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground">Need By</th>
                  <th className="text-right p-2 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/10">
                    <td className="p-2">
                      <Checkbox 
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-2 text-xs font-medium">{item.itemNumber || "—"}</td>
                    <td className="p-2 text-xs uppercase">{item.actionCode || "—"}</td>
                    <td className="p-2 text-xs capitalize">{item.priority || "—"}</td>
                    <td className="p-2 text-xs">{item.manufacturer || "—"}</td>
                    <td className="p-2 text-xs">{item.model || "—"}</td>
                    <td className="p-2 text-xs">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              {truncateDescription(item.description)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p>{item.description || "No description available"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="p-2 text-xs">{item.needByDate || "—"}</td>
                    <td className="p-2">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => startEditing(item.id)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this item? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeItem(item.id)}>Remove</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                    />
                    <div className="font-medium text-sm">#{item.itemNumber || "—"}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => startEditing(item.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this item? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeItem(item.id)}>Remove</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Action Code</div>
                    <div className="font-medium uppercase">{item.actionCode || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Priority</div>
                    <div className="font-medium capitalize">{item.priority || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Manufacturer</div>
                    <div className="font-medium">{item.manufacturer || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Model</div>
                    <div className="font-medium">{item.model || "—"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground text-xs">Description</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="font-medium cursor-help">
                            {truncateDescription(item.description)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>{item.description || "No description available"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Cal Freq</div>
                    <div className="font-medium capitalize">{item.calFreq || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Need By Date</div>
                    <div className="font-medium">{item.needByDate || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">17025</div>
                    <div className="font-medium capitalize">{item.iso17025 || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">C/C Cost</div>
                    <div className="font-medium">{item.ccCost || "—"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};