import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  isQuickAddDialogOpen?: boolean;
  setIsQuickAddDialogOpen?: (open: boolean) => void;
  onSelectedItemsChange?: (count: number) => void;
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

export const WorkOrderItemsReceiving = ({ items, setItems, isQuickAddDialogOpen = false, setIsQuickAddDialogOpen, onSelectedItemsChange }: WorkOrderItemsReceivingProps) => {
  const [newItems, setNewItems] = useState<WorkOrderReceivingItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
  const [quickAddData, setQuickAddData] = useState({
    type: "SINGLE",
    calFreq: "",
    priority: "Normal",
    location: "Baton Rouge",
    division: "Lab",
    actionCode: "",
    arrivalDate: "",
    arrivalType: "",
    poNumber: "",
    recdBy: "",
    deliverByDate: "",
    soNumber: "",
    newEquip: false,
    iso17025: false,
    multiParts: false,
    estimate: false,
    usedSurplus: false,
  });
  const [manufacturerPopoverOpen, setManufacturerPopoverOpen] = useState<{[key: string]: boolean}>({});
  const [editManufacturerPopoverOpen, setEditManufacturerPopoverOpen] = useState<{[key: string]: boolean}>({});
  const [modelPopoverOpen, setModelPopoverOpen] = useState<{[key: string]: boolean}>({});
  const [editModelPopoverOpen, setEditModelPopoverOpen] = useState<{[key: string]: boolean}>({});
  const [highlightNewItems, setHighlightNewItems] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Handle individual item selection
  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      const newSelected = [...selectedItems, itemId];
      setSelectedItems(newSelected);
      onSelectedItemsChange?.(newSelected.length);
    } else {
      const newSelected = selectedItems.filter(id => id !== itemId);
      setSelectedItems(newSelected);
      onSelectedItemsChange?.(newSelected.length);
    }
  };

  // Handle select all functionality
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allItemIds = [...items.map(item => item.id), ...newItems.map(item => item.id)];
      setSelectedItems(allItemIds);
      onSelectedItemsChange?.(allItemIds.length);
    } else {
      setSelectedItems([]);
      onSelectedItemsChange?.(0);
    }
  };

  // Check if all items are selected
  const totalItems = items.length + newItems.length;
  const isAllSelected = totalItems > 0 && selectedItems.length === totalItems;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < totalItems;

  const handleAddNewItem = () => {
    setNewItems([...newItems, createEmptyItem()]);
  };

  const handleSaveNewItem = (newItemId: string) => {
    const itemToSave = newItems.find(item => item.id === newItemId);
    if (!itemToSave) return;
    
    // Validate mandatory fields
    if (!itemToSave.manufacturer || !itemToSave.model || !itemToSave.custId || !itemToSave.custSN || !itemToSave.mfgSerial) {
      alert('Please fill in all mandatory fields: Manufacturer, Model, Cust ID, Cust SN, and Mfg Serial Number');
      return;
    }
    
    setItems([...items, itemToSave]);
    setNewItems(newItems.filter(item => item.id !== newItemId));
  };

  const handleCancelNewItem = (newItemId: string) => {
    setNewItems(newItems.filter(item => item.id !== newItemId));
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

  const updateNewItem = (itemId: string, field: keyof WorkOrderReceivingItem, value: string) => {
    setNewItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const clearAllItems = () => {
    setItems([]);
    setSelectedItems([]);
    setIsClearAllDialogOpen(false);
  };

  const handleQuickAddApply = () => {
    if (selectedItems.length === 0) {
      return;
    }

    // Validate mandatory fields
    const missingFields = [];
    if (!quickAddData.calFreq) missingFields.push("Cal Freq");
    if (!quickAddData.location) missingFields.push("Location");
    if (!quickAddData.division) missingFields.push("Division");
    if (!quickAddData.actionCode) missingFields.push("Action Code");
    if (!quickAddData.arrivalDate) missingFields.push("Date");
    if (!quickAddData.arrivalType) missingFields.push("Type");
    if (!quickAddData.poNumber) missingFields.push("PO Number");
    if (!quickAddData.deliverByDate) missingFields.push("Deliver By Date");

    if (missingFields.length > 0) {
      alert(`Please fill in the following mandatory fields: ${missingFields.join(", ")}`);
      return;
    }

    // Apply the quick add data to all selected new items
    const updatedNewItems = newItems.map(item => {
      if (selectedItems.includes(item.id)) {
        return {
          ...item,
          calFreq: quickAddData.calFreq || item.calFreq,
          priority: quickAddData.priority || item.priority,
          actionCode: quickAddData.actionCode || item.actionCode,
          iso17025: quickAddData.iso17025 ? "yes" : item.iso17025,
          estimate: quickAddData.estimate ? "yes" : item.estimate,
          newEquip: quickAddData.newEquip ? "yes" : item.newEquip,
          needByDate: quickAddData.deliverByDate || item.needByDate,
        };
      }
      return item;
    });

    // Apply the quick add data to all selected existing items
    const updatedItems = items.map(item => {
      if (selectedItems.includes(item.id)) {
        return {
          ...item,
          calFreq: quickAddData.calFreq || item.calFreq,
          priority: quickAddData.priority || item.priority,
          actionCode: quickAddData.actionCode || item.actionCode,
          iso17025: quickAddData.iso17025 ? "yes" : item.iso17025,
          estimate: quickAddData.estimate ? "yes" : item.estimate,
          newEquip: quickAddData.newEquip ? "yes" : item.newEquip,
          needByDate: quickAddData.deliverByDate || item.needByDate,
        };
      }
      return item;
    });

    setNewItems(updatedNewItems);
    setItems(updatedItems);
    
    if (setIsQuickAddDialogOpen) {
      setIsQuickAddDialogOpen(false);
    }
    
    // Reset form
    setQuickAddData({
      type: "SINGLE",
      calFreq: "",
      priority: "Normal",
      location: "Baton Rouge",
      division: "Lab",
      actionCode: "",
      arrivalDate: "",
      arrivalType: "",
      poNumber: "",
      recdBy: "",
      deliverByDate: "",
      soNumber: "",
      newEquip: false,
      iso17025: false,
      multiParts: false,
      estimate: false,
      usedSurplus: false,
    });
  };

  const startEditing = (id: string) => {
    setEditingItemId(id);
  };

  const stopEditing = () => {
    setEditingItemId(null);
  };

  const handlePreviewChanges = () => {
    if (newItems.length === 0) return;
    
    setHighlightNewItems(true);
    
    // Scroll to first new item
    const firstNewItemElement = document.querySelector('[data-new-item="true"]');
    if (firstNewItemElement) {
      firstNewItemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightNewItems(false);
    }, 3000);
  };

  // Pagination calculations
  const totalSavedItems = items.length;
  const totalPages = Math.ceil(totalSavedItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalSavedItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-3 bg-muted/20 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={handleAddNewItem}
          >
            <Plus className="w-4 h-4" />
            Receive Item
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
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
                  <th className="text-right p-2 text-xs font-medium text-muted-foreground w-12"></th>
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
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-24">Manufacturer<span className="text-red-500 ml-1">*</span></th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">Model<span className="text-red-500 ml-1">*</span></th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-32">Description</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-12">TF</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-32">Capable Locations</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-20">Mfg Serial<span className="text-red-500 ml-1">*</span></th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">CustID<span className="text-red-500 ml-1">*</span></th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">CustSN<span className="text-red-500 ml-1">*</span></th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-20">Asset Number</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-12">17025</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">Estimate</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">New Equip</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-24">Need By Date</th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground w-16">C/C Cost</th>
                </tr>
              </thead>
              <tbody>
                {/* Add new item rows */}
                {newItems.map((newItem) => (
                  <tr 
                    key={newItem.id} 
                    data-new-item="true"
                    className="border-b bg-blue-50"
                  >
                     <td className="p-4 sticky left-0 bg-blue-50 z-10">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveNewItem(newItem.id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleCancelNewItem(newItem.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                     </td>
                     <td className="p-4 sticky left-20 bg-blue-50 z-10">
                       <Checkbox 
                         checked={selectedItems.includes(newItem.id)}
                         onCheckedChange={(checked) => handleItemSelect(newItem.id, checked as boolean)}
                       />
                     </td>
                     <td className="p-4 min-w-[150px]">
                       <Input 
                         placeholder="Item #"
                         value={newItem.itemNumber}
                         onChange={(e) => updateNewItem(newItem.id, 'itemNumber', e.target.value)}
                         className={cn(
                           "h-12 text-base font-medium border-2 focus:border-primary transition-all duration-300",
                           highlightNewItems && newItem.itemNumber && "ring-2 ring-primary bg-primary/5"
                         )}
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                        />
                     </td>
                     <td className="p-4 min-w-[140px]">
                       <Input 
                         type="number"
                         placeholder="Cal Freq"
                         value={newItem.calFreq}
                         onChange={(e) => updateNewItem(newItem.id, 'calFreq', e.target.value)}
                         className={cn(
                           "h-12 text-base font-medium border-2 focus:border-primary transition-all duration-300",
                           highlightNewItems && newItem.calFreq && "ring-2 ring-primary bg-primary/5"
                         )}
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[160px]">
                       <Select value={newItem.actionCode} onValueChange={(value) => updateNewItem(newItem.id, 'actionCode', value)}>
                         <SelectTrigger 
                           className={cn(
                             "h-12 text-base border-2 focus:border-primary transition-all duration-300",
                             highlightNewItems && newItem.actionCode && "ring-2 ring-primary bg-primary/5"
                           )}
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
                       <Select value={newItem.priority} onValueChange={(value) => updateNewItem(newItem.id, 'priority', value)}>
                         <SelectTrigger 
                           className={cn(
                             "h-12 text-base border-2 focus:border-primary transition-all duration-300",
                             highlightNewItems && newItem.priority && "ring-2 ring-primary bg-primary/5"
                           )}
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
                       <Popover 
                         open={manufacturerPopoverOpen[newItem.id] || false} 
                         onOpenChange={(open) => setManufacturerPopoverOpen(prev => ({...prev, [newItem.id]: open}))}
                       >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={manufacturerPopoverOpen[newItem.id] || false}
                              className={cn(
                                "h-12 w-full justify-between text-base border-2 focus:border-primary transition-all duration-300",
                                highlightNewItems && newItem.manufacturer && "ring-2 ring-primary bg-primary/5"
                              )}
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
                                       updateNewItem(newItem.id, 'manufacturer', mfr.value);
                                       setManufacturerPopoverOpen(prev => ({...prev, [newItem.id]: false}));
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
                       <Popover 
                         open={modelPopoverOpen[newItem.id] || false} 
                         onOpenChange={(open) => setModelPopoverOpen(prev => ({...prev, [newItem.id]: open}))}
                       >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={modelPopoverOpen[newItem.id] || false}
                              className={cn(
                                "h-12 w-full justify-between text-base border-2 focus:border-primary transition-all duration-300",
                                highlightNewItems && newItem.model && "ring-2 ring-primary bg-primary/5"
                              )}
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
                                       updateNewItem(newItem.id, 'model', mdl.value);
                                       setModelPopoverOpen(prev => ({...prev, [newItem.id]: false}));
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
                           onChange={(e) => updateNewItem(newItem.id, 'description', e.target.value)}
                           className={cn(
                             "h-12 min-h-12 text-base resize-none border-2 focus:border-primary transition-all duration-300",
                             highlightNewItems && newItem.description && "ring-2 ring-primary bg-primary/5"
                           )}
                           onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         />
                       </td>
                      <td className="p-4 min-w-[120px]">
                        <Select value={newItem.tf} onValueChange={(value) => updateNewItem(newItem.id, 'tf', value)}>
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
                          onChange={(e) => updateNewItem(newItem.id, 'capableLocations', e.target.value)}
                          className="h-12 text-base font-medium border-2 focus:border-primary"
                          onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                          autoComplete="off"
                        />
                      </td>
                       <td className="p-4 min-w-[150px]">
                         <Input 
                           placeholder="Mfg Serial"
                           value={newItem.mfgSerial}
                           onChange={(e) => updateNewItem(newItem.id, 'mfgSerial', e.target.value)}
                           className={cn(
                             "h-12 text-base font-medium border-2 focus:border-primary transition-all duration-300",
                             highlightNewItems && newItem.mfgSerial && "ring-2 ring-primary bg-primary/5"
                           )}
                           onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                           autoComplete="off"
                         />
                       </td>
                     <td className="p-4 min-w-[120px]">
                       <Input 
                         placeholder="CustID"
                         value={newItem.custId}
                         onChange={(e) => updateNewItem(newItem.id, 'custId', e.target.value)}
                         className={cn(
                           "h-12 text-base font-medium border-2 focus:border-primary transition-all duration-300",
                           highlightNewItems && newItem.custId && "ring-2 ring-primary bg-primary/5"
                         )}
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[120px]">
                       <Input 
                         placeholder="CustSN"
                         value={newItem.custSN}
                         onChange={(e) => updateNewItem(newItem.id, 'custSN', e.target.value)}
                         className={cn(
                           "h-12 text-base font-medium border-2 focus:border-primary transition-all duration-300",
                           highlightNewItems && newItem.custSN && "ring-2 ring-primary bg-primary/5"
                         )}
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[150px]">
                       <Input 
                         placeholder="Asset Number"
                         value={newItem.assetNumber}
                         onChange={(e) => updateNewItem(newItem.id, 'assetNumber', e.target.value)}
                         className="h-12 text-base font-medium border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[120px]">
                       <Select value={newItem.iso17025} onValueChange={(value) => updateNewItem(newItem.id, 'iso17025', value)}>
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
                         onChange={(e) => updateNewItem(newItem.id, 'estimate', e.target.value)}
                         className="h-12 text-base font-medium border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                         autoComplete="off"
                       />
                     </td>
                     <td className="p-4 min-w-[130px]">
                       <Select value={newItem.newEquip} onValueChange={(value) => updateNewItem(newItem.id, 'newEquip', value)}>
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
                         onChange={(e) => updateNewItem(newItem.id, 'needByDate', e.target.value)}
                         className="h-12 text-base border-2 focus:border-primary"
                         onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })}
                       />
                     </td>
                     <td className="p-4 min-w-[130px]">
                        <Input 
                          placeholder="C/C Cost"
                          value={newItem.ccCost}
                          onChange={(e) => updateNewItem(newItem.id, 'ccCost', e.target.value)}
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
                           onClick={() => handleSaveNewItem(newItem.id)}
                         >
                           ✓
                         </Button>
                         <Button 
                           size="sm" 
                           variant="ghost" 
                           className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                           onClick={() => handleCancelNewItem(newItem.id)}
                         >
                           ✕
                         </Button>
                       </div>
                     </td>
                  </tr>
                ))}
                {paginatedItems.map((item, index) => (
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
                        <Input 
                          type="number"
                          value={item.calFreq}
                          onChange={(e) => updateItem(item.id, 'calFreq', e.target.value)}
                          className="h-6 text-xs border-2 focus:border-primary"
                          autoComplete="off"
                        />
                      ) : (
                        <div className="truncate" title={item.calFreq}>
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
                  <th className="text-right p-2 text-xs font-medium text-muted-foreground w-12"></th>
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
                {/* Add new item rows for tablet */}
                {newItems.map((newItem) => (
                  <tr 
                    key={newItem.id} 
                    data-new-item="true"
                    className="border-b bg-blue-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleSaveNewItem(newItem.id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleCancelNewItem(newItem.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                     </td>
                     <td className="p-3">
                       <Checkbox 
                         checked={selectedItems.includes(newItem.id)}
                         onCheckedChange={(checked) => handleItemSelect(newItem.id, checked as boolean)}
                       />
                     </td>
                     <td className="p-3 text-xs">
                      <Input 
                        placeholder="Item #"
                        value={newItem.itemNumber}
                        onChange={(e) => updateNewItem(newItem.id, 'itemNumber', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </td>
                    <td className="p-3 text-xs">
                      <Select value={newItem.actionCode} onValueChange={(value) => updateNewItem(newItem.id, 'actionCode', value)}>
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
                      <Select value={newItem.priority} onValueChange={(value) => updateNewItem(newItem.id, 'priority', value)}>
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
                      <Select value={newItem.manufacturer} onValueChange={(value) => updateNewItem(newItem.id, 'manufacturer', value)}>
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
                        onChange={(e) => updateNewItem(newItem.id, 'model', e.target.value)}
                        className="h-10 text-sm"
                      />
                    </td>
                    <td className="p-3 text-xs">
                      <Textarea 
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => updateNewItem(newItem.id, 'description', e.target.value)}
                        className="h-10 min-h-10 text-sm resize-none"
                      />
                    </td>
                    <td className="p-3 text-xs">
                      <Input 
                        type="date"
                        value={newItem.needByDate}
                        onChange={(e) => updateNewItem(newItem.id, 'needByDate', e.target.value)}
                        className="h-10 text-sm"
                      />
                     </td>
                 </tr>
                 ))}
                 {paginatedItems.map((item) => (
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
            {paginatedItems.map((item, index) => (
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

      {/* Quick Add Dialog */}
      <Dialog open={isQuickAddDialogOpen} onOpenChange={setIsQuickAddDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-bold">Quick Add New Items</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Fill in the details to update selected items</p>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* General Information */}
              <div className="bg-card border rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  General Information
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                    <Select value={quickAddData.type} onValueChange={(value) => setQuickAddData({...quickAddData, type: value})}>
                      <SelectTrigger id="type" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE">SINGLE</SelectItem>
                        <SelectItem value="BATCH">BATCH</SelectItem>
                        <SelectItem value="MULTIPLE">MULTIPLE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calFreq" className="text-sm font-medium">
                      Cal Freq<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="calFreq"
                      value={quickAddData.calFreq}
                      onChange={(e) => setQuickAddData({...quickAddData, calFreq: e.target.value})}
                      className="h-10"
                      placeholder="Enter calibration frequency"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                    <Select value={quickAddData.priority} onValueChange={(value) => setQuickAddData({...quickAddData, priority: value})}>
                      <SelectTrigger id="priority" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select value={quickAddData.location} onValueChange={(value) => setQuickAddData({...quickAddData, location: value})}>
                      <SelectTrigger id="location" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baton Rouge">Baton Rouge</SelectItem>
                        <SelectItem value="Houston">Houston</SelectItem>
                        <SelectItem value="Lafayette">Lafayette</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="division" className="text-sm font-medium">
                      Division<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select value={quickAddData.division} onValueChange={(value) => setQuickAddData({...quickAddData, division: value})}>
                      <SelectTrigger id="division" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lab">Lab</SelectItem>
                        <SelectItem value="Field">Field</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="actionCode" className="text-sm font-medium">
                      Action Code<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select value={quickAddData.actionCode} onValueChange={(value) => setQuickAddData({...quickAddData, actionCode: value})}>
                      <SelectTrigger id="actionCode" className="h-10">
                        <SelectValue placeholder="Select action code..." />
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
                </div>
              </div>

              {/* Arrival Information */}
              <div className="bg-card border rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  Arrival Information
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="arrivalDate" className="text-sm font-medium">
                      Date<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="arrivalDate"
                      type="date"
                      value={quickAddData.arrivalDate}
                      onChange={(e) => setQuickAddData({...quickAddData, arrivalDate: e.target.value})}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalType" className="text-sm font-medium">
                      Type<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select value={quickAddData.arrivalType} onValueChange={(value) => setQuickAddData({...quickAddData, arrivalType: value})}>
                      <SelectTrigger id="arrivalType" className="h-10">
                        <SelectValue placeholder="Select arrival type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Walk-in">Walk-in</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Picked-up">Picked-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Other Information */}
              <div className="bg-card border rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  Other Information
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="poNumber" className="text-sm font-medium">
                      PO Number<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="poNumber"
                      value={quickAddData.poNumber}
                      onChange={(e) => setQuickAddData({...quickAddData, poNumber: e.target.value})}
                      className="h-10"
                      placeholder="Enter PO number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recdBy" className="text-sm font-medium">Recd By</Label>
                    <Input 
                      id="recdBy"
                      value={quickAddData.recdBy}
                      onChange={(e) => setQuickAddData({...quickAddData, recdBy: e.target.value})}
                      className="h-10"
                      placeholder="Received by"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliverByDate" className="text-sm font-medium">
                      Deliver By Date<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="deliverByDate"
                      type="date"
                      value={quickAddData.deliverByDate}
                      onChange={(e) => setQuickAddData({...quickAddData, deliverByDate: e.target.value})}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soNumber" className="text-sm font-medium">SO Number</Label>
                    <Input 
                      id="soNumber"
                      value={quickAddData.soNumber}
                      onChange={(e) => setQuickAddData({...quickAddData, soNumber: e.target.value})}
                      className="h-10"
                      placeholder="Enter SO number"
                    />
                  </div>

                  <div className="pt-2 space-y-3 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="newEquip"
                        checked={quickAddData.newEquip}
                        onCheckedChange={(checked) => setQuickAddData({...quickAddData, newEquip: checked as boolean})}
                      />
                      <Label htmlFor="newEquip" className="text-sm font-normal cursor-pointer">New Equip</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="iso17025"
                        checked={quickAddData.iso17025}
                        onCheckedChange={(checked) => setQuickAddData({...quickAddData, iso17025: checked as boolean})}
                      />
                      <Label htmlFor="iso17025" className="text-sm font-normal cursor-pointer">17025</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="multiParts"
                        checked={quickAddData.multiParts}
                        onCheckedChange={(checked) => setQuickAddData({...quickAddData, multiParts: checked as boolean})}
                      />
                      <Label htmlFor="multiParts" className="text-sm font-normal cursor-pointer">Multi Parts</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="estimate"
                        checked={quickAddData.estimate}
                        onCheckedChange={(checked) => setQuickAddData({...quickAddData, estimate: checked as boolean})}
                      />
                      <Label htmlFor="estimate" className="text-sm font-normal cursor-pointer">Estimate</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="usedSurplus"
                        checked={quickAddData.usedSurplus}
                        onCheckedChange={(checked) => setQuickAddData({...quickAddData, usedSurplus: checked as boolean})}
                      />
                      <Label htmlFor="usedSurplus" className="text-sm font-normal cursor-pointer">Used/Surplus</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 flex-row gap-2">
            <Button variant="outline" onClick={() => setIsQuickAddDialogOpen && setIsQuickAddDialogOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button onClick={handleQuickAddApply} disabled={selectedItems.length === 0} className="flex-1 sm:flex-none">
              Apply/Save WO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination and Action Buttons */}
      {items.length > 0 && (
        <div className="bg-card border-t p-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Left side: Pagination controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-9 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                  >
                    {page}
                  </Button>
                ))}
                
                {totalPages > 4 && currentPage < totalPages - 1 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
                
                {totalPages > 4 && currentPage < totalPages && (
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className={currentPage === totalPages ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                  >
                    {totalPages}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Right side: Action buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="default"
                onClick={handlePreviewChanges}
                disabled={newItems.length === 0}
              >
                Preview Changes
              </Button>
              <Button 
                variant="outline" 
                size="default"
              >
                Cancel Changes
              </Button>
              <Button 
                variant="default" 
                size="default"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};