import { useState } from "react";
import { EslLayout } from "./components/EslLayout";
import { getEslTypeBySlug } from "./eslTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const EslGloves = () => {
  const type = getEslTypeBySlug("gloves")!;
  const [cls, setCls] = useState("class-2");
  const [size, setSize] = useState("10");
  const [voltage, setVoltage] = useState("");
  const [result, setResult] = useState("pass");

  return (
    <EslLayout type={type}>
      <h2 className="text-sm font-semibold mb-4 text-foreground">Glove Inspection Workflow</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Class</Label>
          <Select value={cls} onValueChange={setCls}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent className="z-50">
              {["class-00", "class-0", "class-1", "class-2", "class-3", "class-4"].map((c) => (
                <SelectItem key={c} value={c}>{c.replace("-", " ").toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Size</Label>
          <Input value={size} onChange={(e) => setSize(e.target.value)} className="h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Test Voltage (kV)</Label>
          <Input value={voltage} onChange={(e) => setVoltage(e.target.value)} className="h-9" />
        </div>
      </div>

      <div className="mt-5">
        <Label className="text-xs mb-2 block">Test Result</Label>
        <RadioGroup value={result} onValueChange={setResult} className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <RadioGroupItem value="pass" /> Pass
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <RadioGroupItem value="fail" /> Fail
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <RadioGroupItem value="retest" /> Retest
          </label>
        </RadioGroup>
      </div>
    </EslLayout>
  );
};

export default EslGloves;
