import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EslSharedFields,
  EslSharedValues,
  defaultSharedValues,
} from "./EslSharedFields";
import { EslActionFooter } from "./EslActionFooter";
import { ESL_TYPES, EslTypeConfig, getEslTypeByDropdownValue } from "../eslTypes";

interface Props {
  type: EslTypeConfig;
  children: ReactNode;
  onSave?: (shared: EslSharedValues) => void;
}

export const EslLayout = ({ type, children, onSave }: Props) => {
  const navigate = useNavigate();
  const [shared, setShared] = useState<EslSharedValues>(defaultSharedValues);

  const handleSharedChange = (key: keyof EslSharedValues, value: string) =>
    setShared((s) => ({ ...s, [key]: value }));

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b shadow-sm">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(-1)}
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold truncate">{type.label}</h1>
                <Badge variant="secondary" className="text-[10px] uppercase">ESL</Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{type.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={type.dropdownValue}
              onValueChange={(v) => {
                const target = getEslTypeByDropdownValue(v);
                if (target) navigate(target.route);
              }}
            >
              <SelectTrigger className="h-9 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                {ESL_TYPES.map((t) => (
                  <SelectItem key={t.slug} value={t.dropdownValue}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Shared metadata strip */}
        <div className="px-6 py-3 bg-background border-t">
          <EslSharedFields values={shared} onChange={handleSharedChange} />
        </div>
      </header>

      {/* Type-specific content */}
      <main className="flex-1 px-6 py-5">
        <div className="bg-card border rounded-lg p-5 shadow-sm">{children}</div>
      </main>

      <EslActionFooter
        onCancel={() => navigate(-1)}
        onSave={() => onSave?.(shared)}
        saveLabel="Save"
      />
    </div>
  );
};
