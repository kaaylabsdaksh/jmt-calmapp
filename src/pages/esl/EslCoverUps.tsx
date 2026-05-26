import { useState } from "react";
import { EslLayout } from "./components/EslLayout";
import { getEslTypeBySlug } from "./eslTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const CHECKS = [
  "Visual inspection passed",
  "Dielectric test passed",
  "Surface contamination cleared",
  "Hardware integrity verified",
];

const EslCoverUps = () => {
  const type = getEslTypeBySlug("coverups")!;
  const [model, setModel] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  return (
    <EslLayout type={type}>
      <h2 className="text-sm font-semibold mb-4 text-foreground">CoverUp Inspection Checklist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="space-y-1.5">
          <Label className="text-xs">Model / Part #</Label>
          <Input value={model} onChange={(e) => setModel(e.target.value)} className="h-9" />
        </div>
      </div>
      <div className="space-y-2">
        {CHECKS.map((c) => (
          <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={!!checks[c]}
              onCheckedChange={(v) => setChecks((s) => ({ ...s, [c]: !!v }))}
            />
            {c}
          </label>
        ))}
      </div>
    </EslLayout>
  );
};

export default EslCoverUps;
