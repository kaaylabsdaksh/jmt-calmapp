import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ChevronRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestingItemLine = {
  id: string;
  groupable: string;
  type?: string;
  fee: string;
  qty: number;
  sectionsFeet?: string;
};

export interface AddTestingItemsResult {
  lines: TestingItemLine[];
}

const BASE_ROWS: Omit<TestingItemLine, "qty">[] = [
  { id: "blankets", groupable: "Blankets", fee: "11.75" },
  { id: "coverups", groupable: "CoverUps", fee: "12.25" },
  { id: "footwear", groupable: "Footwear", fee: "19.75" },
  { id: "gloves", groupable: "Gloves", fee: "9.75" },
  { id: "grounds-single", groupable: "Grounds", type: "Single", fee: "27.25" },
  { id: "grounds-cluster", groupable: "Grounds", type: "Cluster", fee: "54.25" },
  { id: "hotsticks-tele", groupable: "Hotsticks", type: "Telescopic", fee: "13.00", sectionsFeet: "" },
  { id: "hotsticks-shotgun", groupable: "Hotsticks", type: "Shotgun", fee: "41.75" },
  { id: "hotsticks-straight", groupable: "Hotsticks", type: "Straight", fee: "38.75" },
  { id: "hotsticks-static", groupable: "Hotsticks", type: "Static Discharge", fee: "41.75" },
  { id: "insulated-tools", groupable: "Insulated Tools", fee: "10.25" },
  { id: "jumpers", groupable: "Jumpers", fee: "27.25" },
  { id: "line-hoses", groupable: "Line Hoses", fee: "12.25" },
  { id: "matting", groupable: "Matting", fee: "9.75", sectionsFeet: "" },
  { id: "roll-blankets", groupable: "Roll Blankets", fee: "9.75", sectionsFeet: "" },
  { id: "sleeves", groupable: "Sleeves", fee: "10.75" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (result: AddTestingItemsResult) => void;
}

export default function AddTestingItemsDialog({ open, onOpenChange, onAdd }: Props) {
  const [rows, setRows] = useState<TestingItemLine[]>(
    BASE_ROWS.map((r) => ({ ...r, qty: 0 }))
  );

  const update = (id: string, patch: Partial<TestingItemLine>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const selected = useMemo(() => rows.filter((r) => r.qty > 0), [rows]);
  const total = useMemo(
    () => selected.reduce((s, r) => s + r.qty * parseFloat(r.fee || "0"), 0),
    [selected]
  );

  const reset = () => setRows(BASE_ROWS.map((r) => ({ ...r, qty: 0 })));

  const handleOk = () => {
    onAdd({ lines: selected });
    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : handleCancel())}>
      <DialogContent className="max-w-3xl p-0 gap-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="text-sm font-semibold">Add Testing Items</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full table-fixed text-[11px]">
              <thead className="bg-muted/60">
                <tr className="[&>th]:px-2 [&>th]:py-1.5 [&>th]:font-medium [&>th]:text-muted-foreground [&>th]:text-left">
                  <th className="w-[28%]">Groupable</th>
                  <th className="w-[22%]">Type</th>
                  <th className="w-[16%] !text-right">ESL Lab</th>
                  <th className="w-[16%] !text-center">Qty</th>
                  <th className="w-[18%] !text-center">Sections / Feet</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const active = r.qty > 0;
                  return (
                    <tr
                      key={r.id}
                      className={cn(
                        "border-t transition-colors",
                        active ? "bg-green-50/70" : "hover:bg-muted/30"
                      )}
                    >
                      <td className="px-2 py-1 font-medium text-foreground">{r.groupable}</td>
                      <td className="px-2 py-1 text-muted-foreground">{r.type ?? "—"}</td>
                      <td className="px-2 py-1">
                        <Input
                          value={r.fee}
                          onChange={(e) => update(r.id, { fee: e.target.value })}
                          className="h-6 text-[11px] px-1.5 text-right"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <div className="flex items-center justify-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => update(r.id, { qty: Math.max(0, r.qty - 1) })}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            value={r.qty}
                            onChange={(e) =>
                              update(r.id, { qty: Math.max(0, parseInt(e.target.value || "0", 10) || 0) })
                            }
                            className="h-6 w-10 text-[11px] px-1 text-center"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => update(r.id, { qty: r.qty + 1 })}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-2 py-1">
                        {r.sectionsFeet !== undefined ? (
                          <div className="flex items-center justify-center gap-1">
                            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                            <Input
                              value={r.sectionsFeet}
                              placeholder="0"
                              disabled={!active}
                              onChange={(e) => update(r.id, { sectionsFeet: e.target.value })}
                              className="h-6 w-14 text-[11px] px-1 text-center"
                            />
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground/50">—</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={reset}>
              <RefreshCw className="h-3 w-3 mr-1" /> Refresh Fees with latest from Customer
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">
                {selected.length} selected
              </Badge>
              <span className="text-[11px] font-medium">Total ${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-3 border-t shrink-0 sm:justify-end gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-[11px] bg-green-600 hover:bg-green-700 text-white"
            disabled={selected.length === 0}
            onClick={handleOk}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
