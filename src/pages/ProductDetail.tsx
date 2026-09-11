import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  MessageSquare,
  ClipboardList,
  Boxes,
  Gauge,
  DollarSign,
  Ruler,
  MapPin,
  FlaskConical,
  Tags,
  Paperclip,
  Trash2,
  Check,

  type LucideIcon,
} from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";
import ProductFilesTab from "@/components/products/ProductFilesTab";
import ProductAccessoriesTab from "@/components/products/ProductAccessoriesTab";
import ActivityLog, { type ActivityEntry } from "@/components/shared/ActivityLog";




const CAPABLE_LOCATIONS = [
  "Baton Rouge",
  "Alexandria",
  "Odessa",
  "Clute",
  "Mattoon",
  "Groves",
  "San Angelo",
  "Berthold",
  "Mount Braddock",
  "Port Arthur",
  "Mathiston",
  "Billings",
  "Mobile",
  "Edmonton",
  "Wichita",
  "Onsite",
  "Leechburg",
];

const SCOPE_ENABLED_LOCATIONS = ["Baton Rouge", "Clute", "Odessa", "Groves", "Port Arthur"];

const STATUSES = ["ACTIVE", "INACTIVE", "PENDING", "OBSOLETE"];
const GROUP_TYPES = ["Electrical", "Mechanical", "Temperature", "Pressure", "ESL"];
const PRODUCT_TYPES = ["Calibration", "Testing", "Repair", "Rental", "Sales"];
const MANUFACTURERS = ["FLUKE", "3D INSTRUMENTS", "MEGGER", "AMETEK", "HASTINGS", "SALISBURY", "AMTI"];
const LAB_CODES = ["M - Electrical", "Q - Scope", "B - Mech Pressure", "T - Temperature", "D - Dimensional"];
const ACCRED_CAL = ["Yes", "No", "Limited"];
const TECH_CATEGORIES = ["Gauge", "Pressure", "Electrical", "Mechanical", "Temperature", "Low >1 PSI to 300 PSI"];
const RENTAL_CATEGORIES = ["Rental", "Sales", "Both", "Consumable"];
const COMMENT_TYPES = ["General", "Other", "Lab", "Pricing", "Customer"];
const OPTIONS = ["None", "Standard", "Extended"];
const RANGES = ["0-100 PSI", "0-300 PSI", "0-600 PSI", "Custom"];
const ACCURACIES = ["0.25%", "0.5%", "1.0%", "Custom"];

type Accred17025 = "No" | "Full" | "Partial";

function buildScope(
  all: string[],
  capable: Record<string, boolean>,
  level: Accred17025,
): Record<string, Accred17025> {
  const next: Record<string, Accred17025> = {};
  all.forEach((loc) => (next[loc] = capable[loc] ? level : "No"));
  return next;
}

const ProductDetail = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === id);

  const [locations, setLocations] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    (product?.locations || "")
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((l) => (init[l] = true));
    return init;
  });
  const [comments, setComments] = useState<ActivityEntry[]>([
    {
      id: "act-1",
      type: "Other",
      text: "Bulk Updates to CertTime as per Project Apex",
      user: "Admin User",
      ts: "01/26/2026 12:00 AM",
    },
  ]);
  const [accred17025, setAccred17025] = useState<Record<string, Accred17025>>({});




  if (!product) {
    return (
      <div className="bg-background min-h-full">
        <ModernTopNav />
        <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
          <div className="text-center py-20">
            <p className="text-sm text-muted-foreground">Product not found</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/manage-products")}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back to Manage Products
            </Button>
          </div>
        </main>
      </div>
    );
  }




  const selectedLocations = Object.values(locations).filter(Boolean).length;
  const scopeEntries = SCOPE_ENABLED_LOCATIONS.filter((l) => locations[l]);
  const fullCount = scopeEntries.filter((l) => accred17025[l] === "Full").length;
  const partialCount = scopeEntries.filter((l) => accred17025[l] === "Partial").length;


  return (
    <div className="bg-background min-h-full flex flex-col">
      <ModernTopNav />
      <main className="flex-1 w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <div className="max-w-[1600px] mx-auto space-y-4">
          {/* Subheader */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold tracking-tight">Edit Product</div>
              <Badge
                variant="outline"
                className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                {product.status}
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                {product.manufacturer} {product.model} · ID {product.id}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground text-right">
              Created By: Admin User
              <span className="mx-2">|</span>
              Created Date: 01/26/2026 00:00 AM
              <span className="mx-2">|</span>
              Approved By: —
              <span className="mx-2">|</span>
              Approved Date: —
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="h-8">
              <TabsTrigger value="general" className="text-xs h-7">General</TabsTrigger>
              <TabsTrigger value="files" className="text-xs h-7">Files</TabsTrigger>
              <TabsTrigger value="accessories" className="text-xs h-7">Accessories</TabsTrigger>
              <TabsTrigger value="ref" className="text-xs h-7">{product.id}</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
                <div className="xl:col-span-2 space-y-4">
                  <SectionCard icon={Boxes} title="Product Identification">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <SelectField label="Status" options={STATUSES} value={product.status} />
                      <SelectField label="Group Type" options={GROUP_TYPES} value={product.groupType} />
                      <SelectField label="Product Type" options={PRODUCT_TYPES} value={product.productType} />
                      <SelectField label="Manufacturer" options={MANUFACTURERS} value={product.manufacturer} required />
                      <TextField label="Model Number" defaultValue={product.model} required />
                      <TextField label="Description" defaultValue={product.description} required />
                      <SelectField label="Lab Code" options={LAB_CODES} required />
                      <TextField label="Alias" defaultValue={product.alias} />
                      <TextField label="Img File Name" />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3">
                      <TogglePill label="To Factory" defaultOn={product.tf === "Yes"} />
                      <TogglePill label="Product Recall May Apply" />
                      <TogglePill label="ASC Product" />
                    </div>
                  </SectionCard>

                  <SectionCard icon={Gauge} title="Specification">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <SelectField label="Accuracy" options={ACCURACIES} value={product.accuracy} />
                      <SelectField label="Range" options={RANGES} value={product.range} />
                      <SelectField label="Option" options={OPTIONS} value={product.option} />
                      <SelectField label="Accredited Cal" options={ACCRED_CAL} value={product.accredCal} />
                    </div>
                  </SectionCard>

                  <SectionCard icon={DollarSign} title="Cost & Pricing">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <TextField label="JMT #" />
                      <TextField label="Cal Proc" />
                      <TextField label="Cal/Cert Cost" defaultValue={product.calCost} prefix="$" />
                      <TextField label="Flat Rate Elig." defaultValue="0.00" />
                      <TextField label="Min. Eval Fee" defaultValue="0.00" prefix="$" />
                      <TextField label="Factory Cal Price" defaultValue="0.00" prefix="$" />
                      <TextField label="Cert Time" defaultValue="0.33" placeholder="hrs" />
                      <TextField label="Sage Part #" />
                      <TextField label="List Price" defaultValue="0.00" prefix="$" />
                      <TextField label="Cost" defaultValue="0.00" prefix="$" />
                    </div>
                    <div className="pt-3">
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs text-slate-900 underline">
                        Misc Labor Parts and Pricing
                      </Button>
                    </div>
                  </SectionCard>

                  <SectionCard icon={Ruler} title="Physical Dimensions">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <TextField label="Weight" defaultValue="0.00" placeholder="lb" />
                      <TextField label="Height" defaultValue="0.000" placeholder="in" />
                      <TextField label="Width" defaultValue="0.000" placeholder="in" />
                      <TextField label="Depth" defaultValue="0.000" placeholder="in" />
                    </div>
                  </SectionCard>
                </div>

                {/* Right rail */}
                <div className="space-y-4 xl:sticky xl:top-4">
                  <SectionCard
                    icon={MapPin}
                    title="Capable Location(s)"
                    action={<span className="text-[10px] text-muted-foreground">{selectedLocations} selected</span>}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {CAPABLE_LOCATIONS.map((loc) => {
                        const on = !!locations[loc];
                        return (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setLocations((p) => ({ ...p, [loc]: !p[loc] }))}
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                              on
                                ? "bg-slate-900 text-slate-50 border-slate-900"
                                : "bg-background text-muted-foreground hover:bg-muted",
                            )}
                          >
                            {loc}
                          </button>
                        );
                      })}
                    </div>
                  </SectionCard>

                  <SectionCard icon={FlaskConical} title="Technical / Labs Categories">
                    <div className="space-y-3">
                      <SelectField label="Primary Category" options={TECH_CATEGORIES} />
                      <SelectField label="2nd Category" options={TECH_CATEGORIES} />
                      <SelectField label="3rd Category" options={TECH_CATEGORIES} />
                    </div>
                  </SectionCard>

                  <SectionCard icon={Tags} title="Rental / Sales Categories">
                    <div className="space-y-3">
                      <TogglePill label="Rental Only" defaultOn={product.rental === "Yes"} />
                      <SelectField label="Primary Category" options={RENTAL_CATEGORIES} />
                      <SelectField label="2nd Category" options={RENTAL_CATEGORIES} />
                      <SelectField label="3rd Category" options={RENTAL_CATEGORIES} />
                    </div>
                  </SectionCard>
                </div>
              </div>

              {/* Activity Log */}
              <ActivityLog
                entries={comments}
                types={COMMENT_TYPES}
                onAdd={(entry) => setComments((prev) => [entry, ...prev])}
              />

            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <ProductFilesTab />
            </TabsContent>


            <TabsContent value="accessories" className="mt-4">
              <ProductAccessoriesTab />
            </TabsContent>


            <TabsContent value="ref" className="mt-4">
              <SectionCard
                icon={ClipboardList}
                title={`ISO ${product.id} Accreditation Scope`}
                action={
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground mr-1">
                      {fullCount} Full · {partialCount} Partial
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      onClick={() => setAccred17025(buildScope(SCOPE_ENABLED_LOCATIONS, locations, "Full"))}
                    >
                      Set capable to Full
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      onClick={() => setAccred17025(buildScope(SCOPE_ENABLED_LOCATIONS, locations, "No"))}
                    >
                      Clear
                    </Button>
                  </div>
                }
              >
                <p className="text-[11px] text-muted-foreground mb-3">
                  Set the accreditation level for each location. Locations not marked capable on the General
                  tab are locked to <span className="font-medium text-foreground">No</span>.
                </p>
                <div className="rounded-md border overflow-hidden">
                  <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,72px)] items-center bg-muted/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>Location</span>
                    <span className="text-center">No</span>
                    <span className="text-center">Full</span>
                    <span className="text-center">Partial</span>
                  </div>
                  <div className="divide-y">
                    {[...CAPABLE_LOCATIONS].sort((a, b) => {
                      const aEnabled = SCOPE_ENABLED_LOCATIONS.includes(a);
                      const bEnabled = SCOPE_ENABLED_LOCATIONS.includes(b);
                      if (aEnabled === bEnabled) return a.localeCompare(b);
                      return aEnabled ? -1 : 1;
                    }).map((loc) => {
                      const capable = !!locations[loc];
                      const scopeEnabled = SCOPE_ENABLED_LOCATIONS.includes(loc);
                      const value = capable ? accred17025[loc] || "No" : "No";
                      const interactive = capable && scopeEnabled;
                      return (
                        <div
                          key={loc}
                          className={cn(
                            "grid grid-cols-[minmax(0,1fr)_repeat(3,72px)] items-center px-3 py-1.5 text-[11px]",
                            interactive ? "hover:bg-muted/40" : "bg-muted/20",
                          )}
                        >
                          <span
                            className={cn(
                              "truncate",
                              interactive ? "font-medium text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {loc}
                          </span>
                          {(["No", "Full", "Partial"] as Accred17025[]).map((lvl) => (
                            <div key={lvl} className="flex justify-center">
                              <button
                                type="button"
                                disabled={!interactive}
                                aria-label={`${loc} ${lvl}`}
                                aria-pressed={value === lvl}
                                onClick={() => setAccred17025((p) => ({ ...p, [loc]: lvl }))}
                                className={cn(
                                  "h-4 w-4 rounded-[4px] border transition-colors",
                                  value === lvl
                                    ? interactive
                                      ? "bg-slate-900 border-slate-900"
                                      : "bg-muted-foreground/30 border-muted-foreground/30"
                                    : "bg-background border-input hover:border-slate-400",
                                  !interactive && "cursor-not-allowed",
                                )}
                              >
                                {value === lvl && (
                                  <Check
                                    className={cn(
                                      "h-3 w-3 mx-auto",
                                      interactive ? "text-slate-50" : "text-white/80",
                                    )}
                                  />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>
            </TabsContent>

          </Tabs>
        </div>
      </main>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-30 w-full border-t bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.06)] px-2 sm:px-4 lg:px-6 py-2">
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-products")}>
              <X className="h-3.5 w-3.5 mr-1.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                toast({ title: "Product saved", description: "Changes have been saved." });
                navigate("/manage-products");
              }}
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function SectionCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: LucideIcon;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <div className="text-xs font-semibold tracking-tight">{title}</div>
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}

function TextField({
  label,
  placeholder,
  required,
  prefix,
  className,
  defaultValue,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  prefix?: string;
  className?: string;
  defaultValue?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <FieldLabel label={label} required={required} />
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={cn("h-8 text-xs", prefix && "pl-5")}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  options,
  required,
  className,
  value,
}: {
  label: string;
  options: string[];
  required?: boolean;
  className?: string;
  value?: string;
}) {
  const opts = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <div className={cn("space-y-1", className)}>
      <FieldLabel label={label} required={required} />
      <Select defaultValue={value || undefined}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {opts.map((o) => (
            <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TogglePill({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors",
        on ? "bg-slate-900 text-slate-50 border-slate-900" : "bg-background text-muted-foreground hover:bg-muted",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", on ? "bg-emerald-400" : "bg-muted-foreground/40")} />
      {label}
    </button>
  );
}

export default ProductDetail;
