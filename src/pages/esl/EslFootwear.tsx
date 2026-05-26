import { useState } from "react";
import { EslLayout } from "./components/EslLayout";
import { getEslTypeBySlug } from "./eslTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

const EslFootwear = () => {
  const type = getEslTypeBySlug("footwear")!;
  const [size, setSize] = useState("");
  const [solethickness, setSole] = useState("");
  const [heel, setHeel] = useState("");

  return (
    <EslLayout type={type}>
      <h2 className="text-sm font-semibold mb-4 text-foreground">Footwear Measurements & Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Size</Label>
          <Input value={size} onChange={(e) => setSize(e.target.value)} className="h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Sole Thickness (mm)</Label>
          <Input value={solethickness} onChange={(e) => setSole(e.target.value)} className="h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Heel Wear (mm)</Label>
          <Input value={heel} onChange={(e) => setHeel(e.target.value)} className="h-9" />
        </div>
      </div>

      <div className="mt-5">
        <Label className="text-xs mb-2 block">Images</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-[11px]">View {i}</span>
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3">Upload Images</Button>
      </div>
    </EslLayout>
  );
};

export default EslFootwear;
