import { useState } from "react";
import { EslLayout } from "./components/EslLayout";
import { getEslTypeBySlug } from "./eslTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EslGrounds = () => {
  const type = getEslTypeBySlug("grounds")!;
  const [length, setLength] = useState("");
  const [resistance, setResistance] = useState("");
  const [current, setCurrent] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <EslLayout type={type}>
      <h2 className="text-sm font-semibold mb-4 text-foreground">Grounds Resistance Test</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Cable Length (ft)</Label>
          <Input value={length} onChange={(e) => setLength(e.target.value)} className="h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Resistance (mΩ)</Label>
          <Input value={resistance} onChange={(e) => setResistance(e.target.value)} className="h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Test Current (A)</Label>
          <Input value={current} onChange={(e) => setCurrent(e.target.value)} className="h-9" />
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        <Label className="text-xs">Inspection Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
      </div>
    </EslLayout>
  );
};

export default EslGrounds;
