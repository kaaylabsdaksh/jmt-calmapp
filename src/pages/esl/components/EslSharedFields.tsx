import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface EslSharedValues {
  reportNumber: string;
  reportHash: string;
  itemStatus: string;
  priority: string;
  location: string;
  division: string;
}

interface Props {
  values: EslSharedValues;
  onChange: (key: keyof EslSharedValues, value: string) => void;
}

export const defaultSharedValues: EslSharedValues = {
  reportNumber: "",
  reportHash: "",
  itemStatus: "open",
  priority: "normal",
  location: "",
  division: "",
};

export const EslSharedFields = ({ values, onChange }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Report Number<span className="text-destructive ml-0.5">*</span></Label>
        <Input
          value={values.reportNumber}
          onChange={(e) => onChange("reportNumber", e.target.value)}
          placeholder="e.g. 12345-5432-001"
          className="h-9"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Report #<span className="text-destructive ml-0.5">*</span></Label>
        <Input
          value={values.reportHash}
          onChange={(e) => onChange("reportHash", e.target.value)}
          placeholder="Report #"
          className="h-9"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Item Status<span className="text-destructive ml-0.5">*</span></Label>
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
    </div>
  );
};
