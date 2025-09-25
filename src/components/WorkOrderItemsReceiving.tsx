import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Grid3X3, List } from "lucide-react";
import { useState } from "react";

interface WorkOrderReceivingItem {
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

export const WorkOrderItemsReceiving = ({ items, setItems }: WorkOrderItemsReceivingProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<WorkOrderReceivingItem>(createEmptyItem());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

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
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
                <Button onClick={handleDialogSubmit}>Receive Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
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
          <div className="flex items-center gap-2 mb-4">
            <Checkbox />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
          
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4 bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="font-medium text-sm">Received Item #{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {editingItemId === item.id ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={stopEditing}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Save
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => startEditing(item.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <AlertDialog open={deleteItemId === item.id} onOpenChange={(open) => !open && setDeleteItemId(null)}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeleteItemId(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Received Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this received item? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => removeItem(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Item #</label>
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Item #"
                          value={item.itemNumber}
                          onChange={(e) => updateItem(item.id, 'itemNumber', e.target.value)}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium">
                          {item.itemNumber || "—"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Cal Freq</label>
                      {editingItemId === item.id ? (
                        <Select value={item.calFreq} onValueChange={(value) => updateItem(item.id, 'calFreq', value)}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm font-medium capitalize">
                          {item.calFreq || "—"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Action Code</label>
                      {editingItemId === item.id ? (
                        <Select value={item.actionCode} onValueChange={(value) => updateItem(item.id, 'actionCode', value)}>
                          <SelectTrigger className="h-8 text-sm">
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
                        <div className="text-sm font-medium uppercase">
                          {item.actionCode || "—"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Priority</label>
                      {editingItemId === item.id ? (
                        <Select value={item.priority} onValueChange={(value) => updateItem(item.id, 'priority', value)}>
                          <SelectTrigger className="h-8 text-sm">
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
                        <div className="text-sm font-medium capitalize">
                          {item.priority || "—"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
                      {editingItemId === item.id ? (
                        <Select value={item.manufacturer} onValueChange={(value) => updateItem(item.id, 'manufacturer', value)}>
                          <SelectTrigger className="h-8 text-sm">
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
                        <div className="text-sm font-medium">
                          {item.manufacturer || "—"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Model</label>
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Model"
                          value={item.model}
                          onChange={(e) => updateItem(item.id, 'model', e.target.value)}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium">
                          {item.model || "—"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Mfg Serial</label>
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Mfg Serial"
                          value={item.mfgSerial}
                          onChange={(e) => updateItem(item.id, 'mfgSerial', e.target.value)}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium">
                          {item.mfgSerial || "—"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20 border-b">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                        <Checkbox />
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Item #</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Cal Freq</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Action Code</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Priority</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Manufacturer</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Model</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Mfg Serial</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">CustID</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">CustSN</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Barcode</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Warranty</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">17025</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Estimate</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">New Equip</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Need By Date</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-muted/10">
                        <td className="p-3">
                          <Checkbox />
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Input 
                              placeholder="Item #"
                              value={item.itemNumber}
                              onChange={(e) => updateItem(item.id, 'itemNumber', e.target.value)}
                              className="h-8 text-sm min-w-[100px]"
                            />
                          ) : (
                            item.itemNumber || "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Select value={item.calFreq} onValueChange={(value) => updateItem(item.id, 'calFreq', value)}>
                              <SelectTrigger className="h-8 text-sm min-w-[100px]">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="annual">Annual</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="capitalize">{item.calFreq || "—"}</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Select value={item.actionCode} onValueChange={(value) => updateItem(item.id, 'actionCode', value)}>
                              <SelectTrigger className="h-8 text-sm min-w-[100px]">
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
                            <span className="uppercase">{item.actionCode || "—"}</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Select value={item.priority} onValueChange={(value) => updateItem(item.id, 'priority', value)}>
                              <SelectTrigger className="h-8 text-sm min-w-[100px]">
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
                            <span className="capitalize">{item.priority || "—"}</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Select value={item.manufacturer} onValueChange={(value) => updateItem(item.id, 'manufacturer', value)}>
                              <SelectTrigger className="h-8 text-sm min-w-[120px]">
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
                            item.manufacturer || "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Input 
                              placeholder="Model"
                              value={item.model}
                              onChange={(e) => updateItem(item.id, 'model', e.target.value)}
                              className="h-8 text-sm min-w-[100px]"
                            />
                          ) : (
                            item.model || "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Input 
                              placeholder="Mfg Serial"
                              value={item.mfgSerial}
                              onChange={(e) => updateItem(item.id, 'mfgSerial', e.target.value)}
                              className="h-8 text-sm min-w-[100px]"
                            />
                          ) : (
                            item.mfgSerial || "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Input 
                              placeholder="CustID"
                              value={item.custId}
                              onChange={(e) => updateItem(item.id, 'custId', e.target.value)}
                              className="h-8 text-sm min-w-[100px]"
                            />
                          ) : (
                            item.custId || "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Input 
                              placeholder="CustSN"
                              value={item.custSN}
                              onChange={(e) => updateItem(item.id, 'custSN', e.target.value)}
                              className="h-8 text-sm min-w-[100px]"
                            />
                          ) : (
                            item.custSN || "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Input 
                              placeholder="Barcode"
                              value={item.barcodeNum}
                              onChange={(e) => updateItem(item.id, 'barcodeNum', e.target.value)}
                              className="h-8 text-sm min-w-[100px]"
                            />
                          ) : (
                            item.barcodeNum || "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Tabs value={item.warranty} onValueChange={(value) => updateItem(item.id, 'warranty', value)}>
                              <TabsList className="grid w-full grid-cols-2 h-8">
                                <TabsTrigger value="yes" className="text-xs">Yes</TabsTrigger>
                                <TabsTrigger value="no" className="text-xs">No</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          ) : (
                            <span className="capitalize">{item.warranty || "—"}</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Tabs value={item.iso17025} onValueChange={(value) => updateItem(item.id, 'iso17025', value)}>
                              <TabsList className="grid w-full grid-cols-2 h-8">
                                <TabsTrigger value="yes" className="text-xs">Yes</TabsTrigger>
                                <TabsTrigger value="no" className="text-xs">No</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          ) : (
                            <span className="capitalize">{item.iso17025 || "—"}</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Input 
                              placeholder="Estimate"
                              value={item.estimate}
                              onChange={(e) => updateItem(item.id, 'estimate', e.target.value)}
                              className="h-8 text-sm min-w-[100px]"
                            />
                          ) : (
                            item.estimate || "—"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Tabs value={item.newEquip} onValueChange={(value) => updateItem(item.id, 'newEquip', value)}>
                              <TabsList className="grid w-full grid-cols-2 h-8">
                                <TabsTrigger value="yes" className="text-xs">Yes</TabsTrigger>
                                <TabsTrigger value="no" className="text-xs">No</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          ) : (
                            <span className="capitalize">{item.newEquip || "—"}</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingItemId === item.id ? (
                            <Input 
                              type="date"
                              value={item.needByDate}
                              onChange={(e) => updateItem(item.id, 'needByDate', e.target.value)}
                              className="h-8 text-sm min-w-[120px]"
                            />
                          ) : (
                            item.needByDate || "—"
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 justify-end">
                            {editingItemId === item.id ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={stopEditing}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                Save
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => startEditing(item.id)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            <AlertDialog open={deleteItemId === item.id} onOpenChange={(open) => !open && setDeleteItemId(null)}>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setDeleteItemId(item.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Received Item</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this received item? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => removeItem(item.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};