import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { Info, Check } from "lucide-react";
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

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-2">
    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
      {title}
    </h4>
    <div className="h-px flex-1 bg-border/60" />
  </div>
);

const Field = ({
  id,
  label,
  required,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`space-y-0.5 ${className}`}>
    <Label htmlFor={id} className="text-[10px] font-medium">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
    {error ? <p className="text-[10px] text-destructive mt-0.5">{error}</p> : null}
  </div>
);

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

  return (
    <Card className="overflow-hidden">
      {!configured && (
        <div className="flex items-start gap-2 border-b border-border/60 bg-muted/40 px-4 py-2">
          <Info className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            No onsite defaults have been configured yet. Set default values here to automatically
            populate new onsite work order items.
          </p>
        </div>
      )}

      <div className="px-4 py-3 space-y-4">
        {/* Default Settings */}
        <section>
          <SectionHeader title="Default Settings" />
          <div className="grid grid-cols-12 gap-x-3 gap-y-2.5">
            <Field id="od-location" label="Location" required error={errors.location} className="col-span-12 md:col-span-4">
              <Select value={value.location} onValueChange={(v) => set({ location: v })}>
                <SelectTrigger id="od-location" className="h-7 text-[11px]">
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {LOCATION_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field id="od-division" label="Division" required error={errors.division} className="col-span-6 md:col-span-2">
              <Select value={value.division} onValueChange={(v) => set({ division: v })}>
                <SelectTrigger id="od-division" className="h-7 text-[11px]">
                  <SelectValue placeholder="Select division..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {DIVISION_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field id="od-priority" label="Priority" required error={errors.priority} className="col-span-6 md:col-span-2">
              <Select value={value.priority} onValueChange={(v) => set({ priority: v })}>
                <SelectTrigger id="od-priority" className="h-7 text-[11px]">
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {PRIORITY_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field id="od-start" label="Start Date" className="col-span-6 md:col-span-2">
              <ModernDatePicker
                id="od-start"
                size="sm"
                value={value.startDate}
                onChange={(d) => set({ startDate: d ? format(d, "yyyy-MM-dd") : "" })}
              />
            </Field>

            <Field id="od-end" label="End / Need By Date" error={errors.endDate} className="col-span-6 md:col-span-2">
              <ModernDatePicker
                id="od-end"
                size="sm"
                value={value.endDate}
                onChange={(d) => set({ endDate: d ? format(d, "yyyy-MM-dd") : "" })}
              />
            </Field>
          </div>
        </section>

        {/* Additional Defaults */}
        <section>
          <SectionHeader title="Additional Defaults" />
          <div className="grid grid-cols-12 gap-x-3 gap-y-2.5">
            <Field id="od-po" label="PO Number" className="col-span-12 md:col-span-4">
              <Input
                id="od-po"
                className="h-7 text-[11px]"
                value={value.poNumber}
                maxLength={50}
                onChange={(e) => set({ poNumber: e.target.value })}
                placeholder="Enter PO number"
              />
            </Field>

            <Field id="od-calfreq" label="Calibration Frequency (months)" className="col-span-6 md:col-span-4">
              <Input
                id="od-calfreq"
                type="number"
                min={0}
                max={120}
                className="h-7 text-[11px]"
                value={value.calFreq}
                onChange={(e) => set({ calFreq: e.target.value })}
                placeholder="e.g. 12"
              />
            </Field>

            <Field id="od-action" label="Action Code" className="col-span-6 md:col-span-4">
              <Select value={value.actionCode} onValueChange={(v) => set({ actionCode: v })}>
                <SelectTrigger id="od-action" className="h-7 text-[11px]">
                  <SelectValue placeholder="Select action code..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {ACTION_CODE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field id="od-arrival" label="Arrival Type" className="col-span-6 md:col-span-6">
              <Select value={value.arrivalType} onValueChange={(v) => set({ arrivalType: v })}>
                <SelectTrigger id="od-arrival" className="h-7 text-[11px]">
                  <SelectValue placeholder="Select arrival type..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  {ARRIVAL_TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field id="od-project" label="OS Project Number" className="col-span-6 md:col-span-6">
              <Input
                id="od-project"
                className="h-7 text-[11px]"
                value={value.osProjectNumber}
                maxLength={50}
                onChange={(e) => set({ osProjectNumber: e.target.value })}
                placeholder="Enter project number"
              />
            </Field>
          </div>
        </section>
      </div>

      {/* Action bar */}
      <div className="border-t border-border bg-muted/30 px-4 py-2.5 flex items-center justify-end gap-3">
        {false && (
          <div className="flex flex-wrap justify-end gap-x-6 gap-y-1 mr-auto text-[11px] text-muted-foreground">
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
        <Button size="sm" onClick={handleSave} className="gap-1.5 h-8 text-xs bg-green-600 hover:bg-green-700 text-white">
          <Check className="w-3.5 h-3.5" />
          Set Onsite Defaults
        </Button>
      </div>
    </Card>
  );
};

export default OnsiteDefaultsTab;
