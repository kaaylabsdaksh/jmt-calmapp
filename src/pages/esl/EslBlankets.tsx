import { useState } from "react";
import { EslLayout } from "./components/EslLayout";
import { getEslTypeBySlug } from "./eslTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EslBlankets = () => {
  const type = getEslTypeBySlug("blankets")!;
  const [fabricType, setFabricType] = useState("class-2");
  const [defects, setDefects] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  return (
    <EslLayout type={type}>
      <h2 className="text-sm font-semibold mb-4 text-foreground">Fabric & Defect Workflow</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Fabric Class</Label>
          <Select value={fabricType} onValueChange={setFabricType}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="class-0">Class 0</SelectItem>
              <SelectItem value="class-1">Class 1</SelectItem>
              <SelectItem value="class-2">Class 2</SelectItem>
              <SelectItem value="class-3">Class 3</SelectItem>
              <SelectItem value="class-4">Class 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Length (in)</Label>
          <Input value={length} onChange={(e) => setLength(e.target.value)} className="h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Width (in)</Label>
          <Input value={width} onChange={(e) => setWidth(e.target.value)} className="h-9" />
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        <Label className="text-xs">Defect Notes</Label>
        <Textarea
          value={defects}
          onChange={(e) => setDefects(e.target.value)}
          placeholder="Describe pinholes, tears, contamination..."
          rows={5}
        />
      </div>
    </EslLayout>
  );
};

export default EslBlankets;
