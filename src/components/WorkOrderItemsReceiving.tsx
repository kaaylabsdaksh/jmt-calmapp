import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Trash2, Edit, Check, X, ChevronsUpDown, Search } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
  tf: string;
  capableLocations: string;
}

interface WorkOrderItemsReceivingProps {
  items: WorkOrderReceivingItem[];
  setItems: React.Dispatch<React.SetStateAction<WorkOrderReceivingItem[]>>;
}

const manufacturers = [
  { value: "1m-working-stand", label: "1M WORKING STAND." },
  { value: "3d-instruments", label: "3D-INSTRUMENTS" },
  { value: "3e", label: "3E" },
  { value: "3m", label: "3M" },
  { value: "3z-telecom", label: "3Z TELECOM" },
  { value: "4b-components", label: "4B-COMPONENTS" },
  { value: "5ft-wking", label: "5FT WKING STANDARD" },
];

const models = [
  { value: "dm-5000", label: "DM-5000" },
  { value: "osc-3000", label: "OSC-3000" },
  { value: "pwr-500", label: "PWR-500" },
  { value: "sig-gen-2000", label: "SIG-GEN-2000" },
  { value: "ps-750", label: "PS-750" },
  { value: "freq-counter-1000", label: "FREQ-COUNTER-1000" },
  { value: "multi-cal-400", label: "MULTI-CAL-400" },
];

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
  tf: "",
  capableLocations: "",
});

// Helper function to truncate description to 2-3 words
const truncateDescription = (description: string): string => {
  if (!description) return "—";
  const words = description.split(" ");
  return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : description;
};

export const WorkOrderItemsReceiving = ({ items, setItems }: WorkOrderItemsReceivingProps) => {
  const [newItem, setNewItem] = useState<WorkOrderReceivingItem>(createEmptyItem());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [manufacturerPopoverOpen, setManufacturerPopoverOpen] = useState(false);
  const [editManufacturerPopoverOpen, setEditManufacturerPopoverOpen] = useState<{[key: string]: boolean}>({});
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false);
  const [editModelPopoverOpen, setEditModelPopoverOpen] = useState<{[key: string]: boolean}>({});

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

  const handleAddNewItem = () => {
    setIsAddingNew(true);
    setNewItem(createEmptyItem());
  };

  const handleSaveNewItem = () => {
    setItems([...items, newItem]);
    setNewItem(createEmptyItem());
    setIsAddingNew(false);
  };

  const handleCancelNewItem = () => {
    setNewItem(createEmptyItem());
    setIsAddingNew(false);
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
    setSelectedItems([]);
    setIsClearAllDialogOpen(false);
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
          <Button 
            variant="link" 
            className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto flex items-center gap-1"
            onClick={handleAddNewItem}
            disabled={isAddingNew}
          >
            <Plus className="w-4 h-4" />
            Receive Item
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="link" 
                className="text-red-600 hover:text-red-700 text-sm p-0 h-auto"
                disabled={items.length === 0}
              >
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Items</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear all received items? This action cannot be undone and will remove all {items.length} item{items.length !== 1 ? 's' : ''} from the list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsClearAllDialogOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllItems} className="bg-red-600 hover:bg-red-700 text-white">
                  Clear All Items
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No items received yet. Click "Receive Item" to add your first received work order item.
        </div>
      ) : (
        <div className="p-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block border rounded-lg overflow-x-auto scroll-smooth">
            <table className="w-full min-w-[2400px]">
              <thead className="bg-muted/20 border-b">
                <tr>
                  <th className="text-right p-2 text-xs font-medium text-muted-foreground w-20">Actions</th>
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
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-12">TF</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-32">Capable Locations</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-20">Mfg Serial</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">CustID</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">CustSN</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-20">Asset Number</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-12">17025</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">Estimate</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">New Equip</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-24">Need By Date</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">C/C Cost</th>
                </tr>
              </thead>
              <tbody>
                {/* Add new item row */}
                {isAddingNew && (
                  <tr className="border-b bg-blue-50">
                     <td className="p-4 sticky left-0 bg-blue-50 z-10">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={handleSaveNewItem}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={handleCancelNewItem}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                     <td className="p-4 sticky left-20 bg-blue-50 z-10">
                      {/* Empty checkbox cell */}
                    </td>
                     <td className="p-4 min-w-[150px]">
                       <Input 
                         placeholder="Item #"
                         value={newItem.itemNumber}
                         onChange={(e) => updateNewItem('itemNumber', e.target.value)}
                         className="h-12 text-base font-medium border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                        />
                     </td>
                     <td className="p-4 min-w-[140px]">
                       <Select value={newItem.calFreq} onValueChange={(value) => updateNewItem('calFreq', value)}>
                         <SelectTrigger 
                           className="h-12 text-base border-2 focus:border-primary"
                           onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         >
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                     <td className="p-4 min-w-[160px]">
                       <Select value={newItem.actionCode} onValueChange={(value) => updateNewItem('actionCode', value)}>
                         <SelectTrigger 
                           className="h-12 text-base border-2 focus:border-primary"
                           onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         >
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
                     <td className="p-4 min-w-[140px]">
                       <Select value={newItem.priority} onValueChange={(value) => updateNewItem('priority', value)}>
                         <SelectTrigger 
                           className="h-12 text-base border-2 focus:border-primary"
                           onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         >
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
                     <td className="p-4 min-w-[180px]">
                       <Popover open={manufacturerPopoverOpen} onOpenChange={setManufacturerPopoverOpen}>
                         <PopoverTrigger asChild>
                           <Button
                             variant="outline"
                             role="combobox"
                             aria-expanded={manufacturerPopoverOpen}
                             className="h-12 w-full justify-between text-base border-2 focus:border-primary"
                             onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                           >
                             {newItem.manufacturer
                               ? manufacturers.find((mfr) => mfr.value === newItem.manufacturer)?.label
                               : "Select..."}
                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-[200px] p-0 bg-background" align="start">
                           <Command>
                             <CommandInput placeholder="Search manufacturer..." className="h-9" />
                             <CommandList>
                               <CommandEmpty>No manufacturer found.</CommandEmpty>
                               <CommandGroup>
                                 {manufacturers.map((mfr) => (
                                   <CommandItem
                                     key={mfr.value}
                                     value={mfr.label}
                                     onSelect={() => {
                                       updateNewItem('manufacturer', mfr.value);
                                       setManufacturerPopoverOpen(false);
                                     }}
                                   >
                                     {mfr.label}
                                   </CommandItem>
                                 ))}
                               </CommandGroup>
                             </CommandList>
                           </Command>
                         </PopoverContent>
                       </Popover>
                    </td>
                     <td className="p-4 min-w-[140px]">
                       <Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
                         <PopoverTrigger asChild>
                           <Button
                             variant="outline"
                             role="combobox"
                             aria-expanded={modelPopoverOpen}
                             className="h-12 w-full justify-between text-base border-2 focus:border-primary"
                             onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                           >
                             {newItem.model
                               ? models.find((mdl) => mdl.value === newItem.model)?.label
                               : "Select..."}
                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-[200px] p-0 bg-background" align="start">
                           <Command>
                             <CommandInput placeholder="Search model..." className="h-9" />
                             <CommandList>
                               <CommandEmpty>No model found.</CommandEmpty>
                               <CommandGroup>
                                 {models.map((mdl) => (
                                   <CommandItem
                                     key={mdl.value}
                                     value={mdl.label}
                                     onSelect={() => {
                                       updateNewItem('model', mdl.value);
                                       setModelPopoverOpen(false);
                                     }}
                                   >
                                     {mdl.label}
                                   </CommandItem>
                                 ))}
                               </CommandGroup>
                             </CommandList>
                           </Command>
                         </PopoverContent>
                       </Popover>
                     </td>
                     <td className="p-4 min-w-[200px]">
                        <Textarea 
                          placeholder="Description"
                          value={newItem.description}
                          onChange={(e) => updateNewItem('description', e.target.value)}
                          className="h-12 min-h-12 text-base resize-none border-2 focus:border-primary"
                          onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                        />
                      </td>
                      <td className="p-4 min-w-[120px]">
                        <Select value={newItem.tf} onValueChange={(value) => updateNewItem('tf', value)}>
                          <SelectTrigger 
                            className="h-12 text-base border-2 focus:border-primary"
                            onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                          >
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 min-w-[200px]">
                        <Input 
                          placeholder="Capable Locations"
                          value={newItem.capableLocations}
                          onChange={(e) => updateNewItem('capableLocations', e.target.value)}
                          className="h-12 text-base font-medium border-2 focus:border-primary"
                          onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                          autoComplete="off"
                        />
                      </td>
                      <td className="p-4 min-w-[150px]">
                        <Input 
                          placeholder="Mfg Serial"
                          value={newItem.mfgSerial}
                          onChange={(e) => updateNewItem('mfgSerial', e.target.value)}
                          className="h-12 text-base font-medium border-2 focus:border-primary"
                          onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                          autoComplete="off"
                        />
                      </td>
                     <td className="p-4 min-w-[120px]">
                       <Input 
                         placeholder="CustID"
                         value={newItem.custId}
                         onChange={(e) => updateNewItem('custId', e.target.value)}
                         className="h-12 text-base font-medium border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[120px]">
                       <Input 
                         placeholder="CustSN"
                         value={newItem.custSN}
                         onChange={(e) => updateNewItem('custSN', e.target.value)}
                         className="h-12 text-base font-medium border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[150px]">
                       <Input 
                         placeholder="Asset Number"
                         value={newItem.assetNumber}
                         onChange={(e) => updateNewItem('assetNumber', e.target.value)}
                         className="h-12 text-base font-medium border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[120px]">
                       <Select value={newItem.iso17025} onValueChange={(value) => updateNewItem('iso17025', value)}>
                         <SelectTrigger 
                           className="h-12 text-base border-2 focus:border-primary"
                           onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         >
                           <SelectValue placeholder="Select..." />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </td>
                     <td className="p-4 min-w-[130px]">
                       <Input 
                         placeholder="Estimate"
                         value={newItem.estimate}
                         onChange={(e) => updateNewItem('estimate', e.target.value)}
                         className="h-12 text-base font-medium border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[130px]">
                       <Select value={newItem.newEquip} onValueChange={(value) => updateNewItem('newEquip', value)}>
                         <SelectTrigger 
                           className="h-12 text-base border-2 focus:border-primary"
                           onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         >
                           <SelectValue placeholder="Select..." />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="yes">Yes</SelectItem>
                           <SelectItem value="no">No</SelectItem>
                         </SelectContent>
                       </Select>
                     </td>
                     <td className="p-4 min-w-[150px]">
                       <Input 
                         type="date"
                         value={newItem.needByDate}
                         onChange={(e) => updateNewItem('needByDate', e.target.value)}
                         className="h-12 text-base border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                       />
                     </td>
                     <td className="p-4 min-w-[130px]">
                        <Input 
                          placeholder="C/C Cost"
                          value={newItem.ccCost}
                          onChange={(e) => updateNewItem('ccCost', e.target.value)}
                          className="h-12 text-base font-medium border-2 focus:border-primary"
                          onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                          autoComplete="off"
                        />
                     </td>
                     <td className="p-3">
                       <div className="flex items-center justify-end gap-2">
                         <Button 
                           size="sm" 
                           variant="ghost" 
                           className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                           onClick={handleSaveNewItem}
                         >
                           ✓
                         </Button>
                         <Button 
                           size="sm" 
                           variant="ghost" 
                           className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                           onClick={handleCancelNewItem}
                         >
                           ✕
                         </Button>
                       </div>
                     </td>
                  </tr>
                )}
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-muted/10">
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
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this received item.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeItem(item.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
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
                        <Popover 
                          open={editManufacturerPopoverOpen[item.id] || false} 
                          onOpenChange={(open) => setEditManufacturerPopoverOpen(prev => ({...prev, [item.id]: open}))}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={editManufacturerPopoverOpen[item.id] || false}
                              className="h-6 w-full justify-between text-xs"
                            >
                              {item.manufacturer
                                ? manufacturers.find((mfr) => mfr.value === item.manufacturer)?.label
                                : "Select..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0 bg-background" align="start">
                            <Command>
                              <CommandInput placeholder="Search manufacturer..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No manufacturer found.</CommandEmpty>
                                <CommandGroup>
                                  {manufacturers.map((mfr) => (
                                    <CommandItem
                                      key={mfr.value}
                                      value={mfr.label}
                                      onSelect={() => {
                                        updateItem(item.id, 'manufacturer', mfr.value);
                                        setEditManufacturerPopoverOpen(prev => ({...prev, [item.id]: false}));
                                      }}
                                    >
                                      {mfr.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div className="truncate uppercase" title={item.manufacturer}>
                          {item.manufacturer || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Popover 
                          open={editModelPopoverOpen[item.id] || false} 
                          onOpenChange={(open) => setEditModelPopoverOpen(prev => ({...prev, [item.id]: open}))}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={editModelPopoverOpen[item.id] || false}
                              className="h-6 w-full justify-between text-xs"
                            >
                              {item.model
                                ? models.find((mdl) => mdl.value === item.model)?.label
                                : "Select..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0 bg-background" align="start">
                            <Command>
                              <CommandInput placeholder="Search model..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>No model found.</CommandEmpty>
                                <CommandGroup>
                                  {models.map((mdl) => (
                                    <CommandItem
                                      key={mdl.value}
                                      value={mdl.label}
                                      onSelect={() => {
                                        updateItem(item.id, 'model', mdl.value);
                                        setEditModelPopoverOpen(prev => ({...prev, [item.id]: false}));
                                      }}
                                    >
                                      {mdl.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                        <Tabs value={item.tf} onValueChange={(value) => updateItem(item.id, 'tf', value)}>
                          <TabsList className="grid w-full grid-cols-2 h-6">
                            <TabsTrigger value="yes" className="text-xs">Yes</TabsTrigger>
                            <TabsTrigger value="no" className="text-xs">No</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      ) : (
                        <div className="truncate capitalize" title={item.tf}>
                          {item.tf || "—"}
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-xs">
                      {editingItemId === item.id ? (
                        <Input 
                          placeholder="Capable Locations"
                          value={item.capableLocations}
                          onChange={(e) => updateItem(item.id, 'capableLocations', e.target.value)}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <div className="truncate" title={item.capableLocations}>
                          {item.capableLocations || "—"}
                        </div>
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
                  <th className="text-right p-2 text-xs font-medium text-muted-foreground">Actions</th>
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
                </tr>
              </thead>
              <tbody>
                {/* Add new item row for tablet */}
                {isAddingNew && (
                  <tr className="border-b bg-blue-50">
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={handleSaveNewItem}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={handleCancelNewItem}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      {/* Empty checkbox cell */}
                    </td>
                    <td className="p-3 text-xs">
                      <Input 
                        placeholder="Item #"
                        value={newItem.itemNumber}
                        onChange={(e) => updateNewItem('itemNumber', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </td>
                    <td className="p-3 text-xs">
                      <Select value={newItem.actionCode} onValueChange={(value) => updateNewItem('actionCode', value)}>
                        <SelectTrigger className="h-10 text-sm">
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
                    <td className="p-3 text-xs">
                      <Select value={newItem.priority} onValueChange={(value) => updateNewItem('priority', value)}>
                        <SelectTrigger className="h-10 text-sm">
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
                    <td className="p-3 text-xs">
                      <Select value={newItem.manufacturer} onValueChange={(value) => updateNewItem('manufacturer', value)}>
                        <SelectTrigger className="h-10 text-sm">
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
                    <td className="p-3 text-xs">
                      <Input 
                        placeholder="Model"
                        value={newItem.model}
                        onChange={(e) => updateNewItem('model', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </td>
                    <td className="p-3 text-xs">
                      <Textarea 
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => updateNewItem('description', e.target.value)}
                        className="h-10 min-h-10 text-sm resize-none"
                      />
                    </td>
                    <td className="p-3 text-xs">
                      <Input 
                        type="date"
                        value={newItem.needByDate}
                        onChange={(e) => updateNewItem('needByDate', e.target.value)}
                        className="h-10 text-sm"
                      />
                     </td>
                   </tr>
                 )}
                 {items.map((item) => (
                   <tr key={item.id} className="border-b hover:bg-muted/10">
                     <td className="p-2">
                       <div className="flex items-center justify-end gap-1">
                         <Button 
                           size="sm" 
                           variant="ghost" 
                           className="h-6 w-6 p-0"
                           onClick={() => startEditing && startEditing(item.id)}
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