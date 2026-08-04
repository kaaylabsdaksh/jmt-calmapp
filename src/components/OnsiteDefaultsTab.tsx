import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Info, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface OnsiteDefaultsValues {
  location: string;
  division: string;
  priority: string;
  startDate: string;
  endDate: string;
  poNumber: string;
  calFreq: string;
  actionCode: string;
  arrivalType: string;
  osProjectNumber: string;
}

export const emptyOnsiteDefaults: OnsiteDefaultsValues = {
  location: "",
  division: "OnSite",
  priority: "",
  startDate: "",
  endDate: "",
  poNumber: "",
  calFreq: "",
  actionCode: "",
  arrivalType: "onsite",
  osProjectNumber: "",
};

/** Lookup values — replace with backend-driven options when APIs are available. */
const LOCATION_OPTIONS = ["Baton Rouge", "Houston", "Dallas", "New Orleans"];
const DIVISION_OPTIONS = ["OnSite", "Lab", "Field", "Engineering"];
const PRIORITY_OPTIONS = ["Normal", "Rush", "Expedite", "Emergency"];
const ACTION_CODE_OPTIONS = [
  { value: "rc", label: "RC - Regular Calibration" },
  { value: "repair", label: "Repair" },
  { value: "cc", label: "CC - Certificate Only" },
];
const ARRIVAL_TYPE_OPTIONS = [
  { value: "onsite", label: "OnSite" },
  { value: "shipped", label: "Shipped" },
  { value: "customer-dropoff", label: "Customer Drop-off" },
  { value: "jm-driver-pickup", label: "JM Driver Pickup" },
];

interface OnsiteDefaultsTabProps {
  value: OnsiteDefaultsValues;
  onChange: (value: OnsiteDefaultsValues) => void;
  onSave: (value: OnsiteDefaultsValues) => void;
  configured?: boolean;
  metadata?: { createdBy?: string; modifiedBy?: string; lastUpdated?: string };
}

export const OnsiteDefaultsTab = ({
  value,
  onChange,
  onSave,
  configured = false,
  metadata,
}: OnsiteDefaultsTabProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (patch: Partial<OnsiteDefaultsValues>) => onChange({ ...value, ...patch });

  const validate = () => {
    const next: Record<string, string> = {};
    if (!value.location) next.location = "Location is required";
    if (!value.division) next.division = "Division is required";
    if (!value.priority) next.priority = "Priority is required";
    if (value.startDate && value.endDate && new Date(value.startDate) > new Date(value.endDate)) {
      next.endDate = "End date must be on or after the start date";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(value);
    toast({ variant: "success", title: "Onsite defaults updated successfully.", duration: 2000 });
  };

  const err = (key: string) =>
    errors[key] ? <p className="text-[10px] text-destructive mt-0.5">{errors[key]}</p> : null;

  return (
    <div className="space-y-3">
      {!configured && (
        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2">
          <Info className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            No onsite defaults have been configured yet. Set default values here to automatically
            populate new onsite work order items.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Default Settings */}
        <Card>
          <CardHeader className="px-3 py-2 pb-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Default Settings
            </h4>
          </CardHeader>
          <CardContent className="px-3 py-2 pt-0 space-y-2">
            <div className="space-y-0.5">
              <Label htmlFor="od-location" className="text-[11px] font-medium">
                Location <span className="text-destructive">*</span>
              </Label>
              <Select value={value.location} onValueChange={(v) => set({ location: v })}>
                <SelectTrigger id="od-location" className="h-8 text-xs">
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {LOCATION_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("location")}
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="od-division" className="text-[11px] font-medium">
                Division <span className="text-destructive">*</span>
              </Label>
              <Select value={value.division} onValueChange={(v) => set({ division: v })}>
                <SelectTrigger id="od-division" className="h-8 text-xs">
                  <SelectValue placeholder="Select division..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {DIVISION_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("division")}
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="od-priority" className="text-[11px] font-medium">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select value={value.priority} onValueChange={(v) => set({ priority: v })}>
                <SelectTrigger id="od-priority" className="h-8 text-xs">
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {PRIORITY_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("priority")}
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="od-start" className="text-[11px] font-medium">Start Date</Label>
              <ModernDatePicker
                id="od-start"
                size="md"
                value={value.startDate}
                onChange={(d) => set({ startDate: d ? format(d, "yyyy-MM-dd") : "" })}
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="od-end" className="text-[11px] font-medium">End / Need By Date</Label>
              <ModernDatePicker
                id="od-end"
                size="md"
                value={value.endDate}
                onChange={(d) => set({ endDate: d ? format(d, "yyyy-MM-dd") : "" })}
              />
              {err("endDate")}
            </div>
          </CardContent>
        </Card>

        {/* Additional Defaults */}
        <Card>
          <CardHeader className="px-3 py-2 pb-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Additional Defaults
            </h4>
          </CardHeader>
          <CardContent className="px-3 py-2 pt-0 space-y-2">
            <div className="space-y-0.5">
              <Label htmlFor="od-po" className="text-[11px] font-medium">PO Number</Label>
              <Input
                id="od-po"
                className="h-8 text-xs"
                value={value.poNumber}
                maxLength={50}
                onChange={(e) => set({ poNumber: e.target.value })}
                placeholder="Enter PO number"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="od-calfreq" className="text-[11px] font-medium">
                Calibration Frequency (months)
              </Label>
              <Input
                id="od-calfreq"
                type="number"
                min={0}
                max={120}
                className="h-8 text-xs"
                value={value.calFreq}
                onChange={(e) => set({ calFreq: e.target.value })}
                placeholder="e.g. 12"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="od-action" className="text-[11px] font-medium">Action Code</Label>
              <Select value={value.actionCode} onValueChange={(v) => set({ actionCode: v })}>
                <SelectTrigger id="od-action" className="h-8 text-xs">
                  <SelectValue placeholder="Select action code..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {ACTION_CODE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="od-arrival" className="text-[11px] font-medium">Arrival Type</Label>
              <Select value={value.arrivalType} onValueChange={(v) => set({ arrivalType: v })}>
                <SelectTrigger id="od-arrival" className="h-8 text-xs">
                  <SelectValue placeholder="Select arrival type..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {ARRIVAL_TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="od-project" className="text-[11px] font-medium">OS Project Number</Label>
              <Input
                id="od-project"
                className="h-8 text-xs"
                value={value.osProjectNumber}
                maxLength={50}
                onChange={(e) => set({ osProjectNumber: e.target.value })}
                placeholder="Enter project number"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-2 pt-1">
        <Button onClick={handleSave} className="gap-2">
          <Settings className="w-4 h-4" />
          Set Onsite Defaults
        </Button>

        {false && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[11px] text-muted-foreground">
            <span>
              Created By <span className="text-foreground">{metadata?.createdBy || "—"}</span>
            </span>
            <span>
              Modified By <span className="text-foreground">{metadata?.modifiedBy || "—"}</span>
            </span>
            <span>
              Last Updated <span className="text-foreground">{metadata?.lastUpdated || "—"}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnsiteDefaultsTab;
