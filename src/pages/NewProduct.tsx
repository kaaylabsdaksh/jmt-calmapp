import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Plus, MessageSquare, ClipboardList } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

const GROUP_TYPES = ["Electrical", "Mechanical", "Temperature", "Pressure", "ESL"];
const PRODUCT_TYPES = ["Calibration", "Testing", "Repair", "Rental", "Sales"];
const MANUFACTURERS = ["Fluke", "Megger", "Ametek", "Hastings", "Salisbury", "AMTI"];
const LAB_CODES = ["BR", "HOU", "GON", "MOB", "ALX"];
const ACCRED_CAL = ["Yes", "No", "Limited"];
const TECH_CATEGORIES = ["Electrical", "Mechanical", "Temperature", "Pressure", "Dimensional"];
const RENTAL_CATEGORIES = ["Rental", "Sales", "Both", "Consumable"];
const COMMENT_TYPES = ["General", "Lab", "Pricing", "Customer"];

export default function NewProduct() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Record<string, boolean>>({});
  const [pricingMode, setPricingMode] = useState("labor-parts");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ type: string; text: string }[]>([]);
  const [commentType, setCommentType] = useState("General");

  const addComment = () => {
    if (!comment.trim()) return;
    setComments((prev) => [{ type: commentType, text: comment.trim() }, ...prev]);
    setComment("");
  };

  const selectedLocations = Object.values(locations).filter(Boolean).length;

  return (
    <div className="bg-background min-h-full flex flex-col">
      <ModernTopNav />
      <main className="flex-1 w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <div className="max-w-[1600px] mx-auto space-y-4">
          {/* Subheader */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold tracking-tight">Add New Product</div>
              <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                Pending
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground text-right">
              Created By: Admin User
              <span className="mx-2">|</span>
              Created Date: 01/01/1900 00:00 AM
              <span className="mx-2">|</span>
              Approved By: —
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
            {/* Left — identification + spec */}
            <div className="xl:col-span-2 space-y-4">
              <SectionCard icon={Boxes} title="Product Identification">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <SelectField label="Group Type" options={GROUP_TYPES} />
                  <SelectField label="Product Type" options={PRODUCT_TYPES} />
                  <SelectField label="Manufacturer" options={MANUFACTURERS} required />
                  <TextField label="Model Number" required />
                  <TextField label="Description" required className="sm:col-span-2" />
                  <SelectField label="Lab Code" options={LAB_CODES} required />
                  <TextField label="Alias" />
                  <TextField label="Img File Name" />
                </div>
                <div className="flex flex-wrap gap-2 pt-3">
                  <TogglePill label="To Factory" />
                  <TogglePill label="Product Recall May Apply" />
                  <TogglePill label="ASC Product" />
                </div>
              </SectionCard>

              <SectionCard icon={Gauge} title="Specification">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <TextField label="Accuracy" />
                  <TextField label="Range" />
                  <TextField label="Option" />
                  <SelectField label="Accredited Cal" options={ACCRED_CAL} />
                </div>
              </SectionCard>

              <SectionCard
                icon={DollarSign}
                title="Cost & Pricing"
                action={
                  <div className="inline-flex rounded-md border bg-muted/40 p-0.5">
                    {[
                      { v: "labor-parts", l: "Labor/Parts" },
                      { v: "labor-only", l: "Labor Only" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => setPricingMode(o.v)}
                        className={cn(
                          "px-2.5 py-1 text-[11px] rounded-[5px] transition-colors",
                          pricingMode === o.v
                            ? "bg-background shadow-sm font-medium text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <TextField label="JMT #" />
                  <TextField label="Cal Proc" />
                  <TextField label="Cal/Cert Cost" placeholder="0.00" prefix="$" />
                  <TextField label="Flat Rate Elig." />
                  <TextField label="Min. Eval Fee" placeholder="0.00" prefix="$" />
                  <TextField label="Factory Cal Price" placeholder="0.00" prefix="$" />
                  <TextField label="Cert Time" placeholder="hrs" />
                  <TextField label="Sage Part #" />
                  <TextField label="List Price" placeholder="0.00" prefix="$" />
                  <TextField label="Cost" placeholder="0.00" prefix="$" />
                </div>
                <div className="pt-3">
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs text-slate-900 underline">
                    Misc Labor Parts and Pricing
                  </Button>
                </div>
              </SectionCard>

              <SectionCard icon={Ruler} title="Physical Dimensions">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <TextField label="Weight" placeholder="lb" />
                  <TextField label="Height" placeholder="in" />
                  <TextField label="Width" placeholder="in" />
                  <TextField label="Depth" placeholder="in" />
                </div>
              </SectionCard>
            </div>

            {/* Right rail */}
            <div className="space-y-4 xl:sticky xl:top-4">
              <SectionCard
                icon={MapPin}
                title="Capable Location(s)"
                action={
                  <span className="text-[10px] text-muted-foreground">
                    {selectedLocations} selected
                  </span>
                }
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
                  <TogglePill label="Rental Only" />
                  <SelectField label="Primary Category" options={RENTAL_CATEGORIES} />
                  <SelectField label="2nd Category" options={RENTAL_CATEGORIES} />
                  <SelectField label="3rd Category" options={RENTAL_CATEGORIES} />
                </div>
              </SectionCard>
            </div>
          </div>


          {/* Comments */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="text-xs font-semibold">Comments</div>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-2">
                <Select value={commentType} onValueChange={setCommentType}>
                  <SelectTrigger className="h-8 w-full sm:w-40 text-xs">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment…"
                  className="min-h-[60px] text-xs flex-1"
                />
                <Button size="sm" className="h-8 text-xs" onClick={addComment} disabled={!comment.trim()}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add
                </Button>
              </div>

              {comments.length === 0 ? (
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5" />
                  No comments yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {comments.map((c, i) => (
                    <div key={i} className="rounded-md border p-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                        <span className="text-[10px] text-muted-foreground">Admin User · just now</span>
                      </div>
                      <p className="text-xs mt-1">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-30 w-full border-t bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.06)] px-2 sm:px-4 lg:px-6 py-2">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => navigate("/manage-products/product-review/new")}
          >
            <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
            New Product Review
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-products")}>
              <X className="h-3.5 w-3.5 mr-1.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                toast({ title: "Product saved", description: "The new product has been created." });
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
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-xs font-semibold text-foreground border-b pb-1", className)}>{children}</div>
  );
}

function FieldRow({
  label,
  placeholder,
  required,
  labelWidth = "w-36",
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  labelWidth?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className={cn("text-[11px] font-medium text-right shrink-0", labelWidth)}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input placeholder={placeholder} className="h-7 text-xs" />
    </div>
  );
}

function SelectRow({
  label,
  options,
  required,
  labelWidth = "w-36",
}: {
  label: string;
  options: string[];
  required?: boolean;
  labelWidth?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label className={cn("text-[11px] font-medium text-right shrink-0", labelWidth)}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Select>
        <SelectTrigger className="h-7 text-xs">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CheckboxRow({ label, labelWidth = "w-36" }: { label: string; labelWidth?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Label className={cn("text-[11px] font-medium text-right shrink-0", labelWidth)}>{label}</Label>
      <Checkbox className="h-4 w-4" />
    </div>
  );
}
