import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ESL_TYPES, EslTypeConfig, getEslTypeByDropdownValue } from "../eslTypes";

export interface EslGeneralValues {
  type: string;
  reportNumber: string;
  reportHash: string;
  itemStatus: string;
  priority: string;
  location: string;
  division: string;
  assignedTo: string;
}

export const defaultGeneralValues = (typeDropdown: string): EslGeneralValues => ({
  type: typeDropdown,
  reportNumber: "",
  reportHash: "",
  itemStatus: "open",
  priority: "normal",
  location: "",
  division: "",
  assignedTo: "",
});

interface Props {
  currentType: EslTypeConfig;
  values: EslGeneralValues;
  onChange: (key: keyof EslGeneralValues, value: string) => void;
}

const Req = () => <span className="text-destructive ml-0.5">*</span>;

export const EslGeneralSection = ({ currentType, values, onChange }: Props) => {
  const navigate = useNavigate();

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">General</CardTitle>
          <span className="text-xs text-muted-foreground">Shared across all ESL types</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Type<Req /></Label>
            <Select
              value={values.type}
              onValueChange={(v) => {
                onChange("type", v);
                const target = getEslTypeByDropdownValue(v);
                if (target && target.slug !== currentType.slug) navigate(target.route);
              }}
            >
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent className="z-50">
                {ESL_TYPES.map((t) => (
                  <SelectItem key={t.slug} value={t.dropdownValue}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Report Number<Req /></Label>
            <Input
              value={values.reportNumber}
              onChange={(e) => onChange("reportNumber", e.target.value)}
              placeholder="e.g. 12345-5432-001"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Report #<Req /></Label>
            <Input
              value={values.reportHash}
              onChange={(e) => onChange("reportHash", e.target.value)}
              placeholder="Report #"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Item Status<Req /></Label>
            <Select value={values.itemStatus} onValueChange={(v) => onChange("itemStatus", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="back-to-customer">Back to Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Priority</Label>
            <Select value={values.priority} onValueChange={(v) => onChange("priority", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="rush">Rush</SelectItem>
                <SelectItem value="expedite">Expedite</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Location</Label>
            <Input
              value={values.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="Location"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Division</Label>
            <Input
              value={values.division}
              onChange={(e) => onChange("division", e.target.value)}
              placeholder="Division"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Assigned To</Label>
            <Input
              value={values.assignedTo}
              onChange={(e) => onChange("assignedTo", e.target.value)}
              placeholder="Assignee"
              className="h-9"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
