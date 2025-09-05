import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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

interface Props {
  items: WorkOrderItemTemplate[];
}

export const WorkOrderItemsCards = ({ items }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox />
          <span className="text-sm text-muted-foreground">Select All</span>
        </div>
        <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="font-semibold text-foreground">Item #{item.itemNumber || `${index + 1}`}</span>
                </div>
                {item.priority && (
                  <Badge variant="secondary">
                    {item.priority}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {item.manufacturer && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="font-medium">{item.manufacturer}</span>
                  </div>
                )}
                
                {item.model && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium">{item.model}</span>
                  </div>
                )}
                
                {item.mfgSerial && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mfg Serial:</span>
                    <span className="font-medium">{item.mfgSerial}</span>
                  </div>
                )}
                
                {item.actionCode && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span className="font-medium">{item.actionCode}</span>
                  </div>
                )}
                
                {item.calFreq && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cal Freq:</span>
                    <span className="font-medium">{item.calFreq}</span>
                  </div>
                )}
                
                {item.needByDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Need By:</span>
                    <span className="font-medium">{item.needByDate}</span>
                  </div>
                )}
                
                {item.warranty && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warranty:</span>
                    <span className="font-medium">{item.warranty}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t flex justify-end">
                <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No items added yet. Use the template view to add items.
        </div>
      )}
    </div>
  );
};