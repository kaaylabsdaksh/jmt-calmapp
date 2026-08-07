import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { ESL_TYPES, getEslTypeByDropdownValue } from "../eslTypes";

const fieldCls = "h-7 text-[11px]";
const labelCls = "text-[11px] font-medium text-muted-foreground";

const Section = ({
  title,
  right,
  children,
  className = "",
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`rounded-lg border bg-card shadow-sm ${className}`}>
    <header className="flex items-center justify-between gap-2 border-b px-3 py-1.5">
      <h2 className="text-[11px] font-semibold uppercase tracking-wide">{title}</h2>
      {right}
    </header>
    <div className="p-3">{children}</div>
  </section>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className={labelCls}>{label}</Label>
    {children}
  </div>
);

const ReadOnly = ({ value }: { value: string }) => (
  <div className="h-7 rounded-md border bg-muted/50 px-2 flex items-center text-[11px] text-foreground">
    {value}
  </div>
);

const SelectField = ({
  value,
  onChange,
  options,
  placeholder = "Select",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={fieldCls}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="z-50">
      {options.map((o) => (
        <SelectItem key={o} value={o} className="text-[11px]">
          {o}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface CostRow {
  key: string;
  label: string;
  qty: number;
  cost: string;
  readOnly?: boolean;
}

interface CommentRow {
  id: number;
  type: string;
  user: string;
  date: string;
  comment: string;
}

interface AccessoryRow {
  id: number;
  type: string;
  accessory: string;
  material: string;
  color: string;
  qty: string;
}

const EslOnsiteBlankets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status] = useState("In Lab");
  const [testFreq, setTestFreq] = useState("12");
  const [priority, setPriority] = useState("Rush");
  const [location, setLocation] = useState("Alexandria");
  const [division, setDivision] = useState("OnSite");
  const [actionCode, setActionCode] = useState("TEST");

  const [costs, setCosts] = useState<CostRow[]>([
    { key: "testing", label: "Testing", qty: 2, cost: "23.50", readOnly: true },
    { key: "expedite", label: "Expedite", qty: 0, cost: "0.00", readOnly: true },
    { key: "emergency", label: "Emergency", qty: 0, cost: "0.00", readOnly: true },
    { key: "replacement", label: "Replacement", qty: 0, cost: "0.00" },
    { key: "new-sales", label: "New Sales", qty: 0, cost: "0.00" },
  ]);

  const totals = useMemo(() => {
    const qty = costs.reduce((s, c) => s + (Number(c.qty) || 0), 0);
    const cost = costs.reduce((s, c) => s + (parseFloat(c.cost) || 0), 0);
    return { qty, cost: cost.toFixed(2) };
  }, [costs]);

  const [arrivalDate, setArrivalDate] = useState("08/01/2026");
  const [arrivalType, setArrivalType] = useState("Lab Standard");
  const [departureDate, setDepartureDate] = useState("");
  const [departureType, setDepartureType] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");

  const [po, setPo] = useState("WOPO");
  const [partsPo, setPartsPo] = useState("");
  const [soNumber, setSoNumber] = useState("");
  const [needBy, setNeedBy] = useState("08/30/2026");
  const [deliverBy, setDeliverBy] = useState("08/07/2026");
  const [dateTested, setDateTested] = useState("");
  const [transitQty, setTransitQty] = useState("");
  const [leadTech, setLeadTech] = useState("");
  const [flags, setFlags] = useState<Record<string, boolean>>({
    isNew: false,
    hotList: false,
    toShipping: false,
    readyToBill: false,
    toCustomerPickup: false,
    toLogistics: false,
    lostEquipment: false,
  });
  const toggleFlag = (k: string) => setFlags((f) => ({ ...f, [k]: !f[k] }));

  const [misc, setMisc] = useState("");

  const [accIncludeGroup, setAccIncludeGroup] = useState(false);
  const [accessories, setAccessories] = useState<AccessoryRow[]>([]);
  const [accDraft, setAccDraft] = useState({
    type: "Containers",
    accessory: "",
    material: "",
    color: "",
    qty: "",
  });

  const addAccessory = () => {
    if (!accDraft.accessory) {
      toast({ title: "Select an accessory first", variant: "destructive" });
      return;
    }
    setAccessories((a) => [...a, { id: Date.now(), ...accDraft }]);
    setAccDraft({ type: accDraft.type, accessory: "", material: "", color: "", qty: "" });
  };

  const [cmtIncludeGroup, setCmtIncludeGroup] = useState(false);
  const [commentType, setCommentType] = useState("");
  const [commentPreset, setCommentPreset] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentRow[]>([
    {
      id: 1,
      type: "Other",
      user: "Admin User",
      date: "08/04/2026 03:39 AM",
      comment: "Deliver By Date changed to 08/07/2026",
    },
  ]);

  const addComment = () => {
    const text = commentText.trim() || commentPreset;
    if (!commentType || !text) {
      toast({ title: "Comment type and text are required", variant: "destructive" });
      return;
    }
    setComments((c) => [
      {
        id: Date.now(),
        type: commentType,
        user: "Admin User",
        date: new Date().toLocaleString("en-US"),
        comment: text,
      },
      ...c,
    ]);
    setCommentText("");
    setCommentPreset("");
  };

  const [newGroup, setNewGroup] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <header className="sticky top-0 z-30 border-b bg-card">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold truncate">
                Report # 00000.00-803810-Blankets
              </h1>
              <Badge variant="secondary" className="text-[10px] uppercase">
                ESL OnSite
              </Badge>
              <Badge className="bg-yellow-400 text-black hover:bg-yellow-400 text-[10px]">
                {priority}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Onsite blanket inspection workflow
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-[11px]">
              Prev
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]" disabled>
              Next
            </Button>
            <Select
              value="esl-onsite-blankets"
              onValueChange={(v) => {
                const t = getEslTypeByDropdownValue(v);
                if (t) navigate(t.route);
              }}
            >
              <SelectTrigger className="h-7 w-[210px] text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                {ESL_TYPES.map((t) => (
                  <SelectItem key={t.slug} value={t.dropdownValue} className="text-[11px]">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-3">
        <Tabs defaultValue="general" className="space-y-3">
          <TabsList className="h-8">
            <TabsTrigger value="general" className="text-[11px] h-6">
              General
            </TabsTrigger>
            <TabsTrigger value="details" className="text-[11px] h-6">
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-3 mt-0">
            <div className="grid gap-3 lg:grid-cols-3">
              {/* Column 1 */}
              <div className="space-y-3">
                <Section title="General Information">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Report #">
                      <ReadOnly value="00000.00-803810-Blankets" />
                    </Field>
                    <Field label="Item Status">
                      <div className="flex gap-1.5">
                        <ReadOnly value={status} />
                        <Button variant="outline" size="sm" className="h-7 text-[11px] px-2">
                          Change
                        </Button>
                      </div>
                    </Field>
                    <Field label="Created">
                      <ReadOnly value="08/04/2026 · Admin User" />
                    </Field>
                    <Field label="Modified">
                      <ReadOnly value="08/04/2026 · Admin User" />
                    </Field>
                    <Field label="Test Freq">
                      <Input
                        className={fieldCls}
                        value={testFreq}
                        onChange={(e) => setTestFreq(e.target.value)}
                      />
                    </Field>
                    <Field label="Priority">
                      <SelectField
                        value={priority}
                        onChange={setPriority}
                        options={["Normal", "Rush", "Expedite", "Emergency"]}
                      />
                    </Field>
                    <Field label="Location">
                      <SelectField
                        value={location}
                        onChange={setLocation}
                        options={["Alexandria", "Houston", "Denver", "Charlotte"]}
                      />
                    </Field>
                    <Field label="Division">
                      <SelectField
                        value={division}
                        onChange={setDivision}
                        options={["OnSite", "Lab", "ESL", "ITL"]}
                      />
                    </Field>
                    <Field label="Action Code">
                      <SelectField
                        value={actionCode}
                        onChange={setActionCode}
                        options={["TEST", "REPAIR", "REPLACE", "SCRAP"]}
                      />
                    </Field>
                  </div>
                </Section>

                <Section title="Cost Information">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-7 text-[11px]">Item</TableHead>
                        <TableHead className="h-7 text-[11px] w-20">Qty</TableHead>
                        <TableHead className="h-7 text-[11px] w-28 text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costs.map((row, i) => (
                        <TableRow key={row.key} className="hover:bg-transparent">
                          <TableCell className="py-1 text-[11px]">{row.label}</TableCell>
                          <TableCell className="py-1 text-[11px]">
                            {row.readOnly ? (
                              row.qty
                            ) : (
                              <Input
                                className={`${fieldCls} w-16`}
                                value={String(row.qty)}
                                onChange={(e) =>
                                  setCosts((c) =>
                                    c.map((r, idx) =>
                                      idx === i
                                        ? { ...r, qty: Number(e.target.value) || 0 }
                                        : r
                                    )
                                  )
                                }
                              />
                            )}
                          </TableCell>
                          <TableCell className="py-1 text-right">
                            {row.readOnly ? (
                              <span className="text-[11px] text-muted-foreground">
                                {row.cost}
                              </span>
                            ) : (
                              <Input
                                className={`${fieldCls} w-24 ml-auto text-right`}
                                value={row.cost}
                                onChange={(e) =>
                                  setCosts((c) =>
                                    c.map((r, idx) =>
                                      idx === i ? { ...r, cost: e.target.value } : r
                                    )
                                  )
                                }
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="hover:bg-transparent border-t-2">
                        <TableCell className="py-1 text-[11px] font-semibold">Total</TableCell>
                        <TableCell className="py-1 text-[11px] font-semibold">
                          {totals.qty}
                        </TableCell>
                        <TableCell className="py-1 text-[11px] font-semibold text-right">
                          {totals.cost}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Section>
              </div>

              {/* Column 2 */}
              <div className="space-y-3">
                <Section title="Arrival Information">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Date">
                      <Input
                        className={fieldCls}
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        placeholder="MM/DD/YYYY"
                      />
                    </Field>
                    <Field label="Type">
                      <SelectField
                        value={arrivalType}
                        onChange={setArrivalType}
                        options={["Lab Standard", "Customer Drop Off", "Freight", "OnSite"]}
                      />
                    </Field>
                  </div>
                </Section>

                <Section title="Departure Information">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Date">
                      <Input
                        className={fieldCls}
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        placeholder="MM/DD/YYYY"
                      />
                    </Field>
                    <Field label="Type">
                      <SelectField
                        value={departureType}
                        onChange={setDepartureType}
                        options={["Customer Pickup", "Freight", "Delivery", "OnSite"]}
                      />
                    </Field>
                  </div>
                </Section>

                <Section title="Delivery Status">
                  <Textarea
                    className="min-h-[64px] text-[11px]"
                    value={deliveryStatus}
                    onChange={(e) => setDeliveryStatus(e.target.value)}
                    placeholder="Delivery notes"
                  />
                </Section>

                <Section title="Other Information">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="PO Number">
                      <Input className={fieldCls} value={po} onChange={(e) => setPo(e.target.value)} />
                    </Field>
                    <Field label="JM Parts PO #">
                      <Input
                        className={fieldCls}
                        value={partsPo}
                        onChange={(e) => setPartsPo(e.target.value)}
                      />
                    </Field>
                    <Field label="SO Number">
                      <Input
                        className={fieldCls}
                        value={soNumber}
                        onChange={(e) => setSoNumber(e.target.value)}
                      />
                    </Field>
                    <Field label="Need By">
                      <Input
                        className={fieldCls}
                        value={needBy}
                        onChange={(e) => setNeedBy(e.target.value)}
                        placeholder="MM/DD/YYYY"
                      />
                    </Field>
                    <Field label="Deliver By Date">
                      <Input
                        className={fieldCls}
                        value={deliverBy}
                        onChange={(e) => setDeliverBy(e.target.value)}
                        placeholder="MM/DD/YYYY"
                      />
                    </Field>
                    <Field label="Date Tested">
                      <Input
                        className={fieldCls}
                        value={dateTested}
                        onChange={(e) => setDateTested(e.target.value)}
                        placeholder="MM/DD/YYYY"
                      />
                    </Field>
                    <Field label="Transit Qty">
                      <Input
                        className={fieldCls}
                        value={transitQty}
                        onChange={(e) => setTransitQty(e.target.value)}
                      />
                    </Field>
                    <Field label="Lead Technician">
                      <SelectField
                        value={leadTech}
                        onChange={setLeadTech}
                        options={["J. Rivera", "M. Chen", "A. Patel", "K. Novak"]}
                      />
                    </Field>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t pt-2.5">
                    {[
                      ["isNew", "New"],
                      ["hotList", "Hot List"],
                      ["toShipping", "To Shipping"],
                      ["readyToBill", "Ready to Bill"],
                      ["toCustomerPickup", "To Customer Pickup"],
                      ["toLogistics", "To Logistics"],
                      ["lostEquipment", "Lost Equipment"],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 text-[11px] cursor-pointer"
                      >
                        <Checkbox
                          checked={flags[key]}
                          onCheckedChange={() => toggleFlag(key)}
                          className="h-3.5 w-3.5"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </Section>
              </div>

              {/* Column 3 */}
              <div className="space-y-3">
                <Section title="Misc. Information">
                  <Textarea
                    className="min-h-[160px] text-[11px]"
                    value={misc}
                    onChange={(e) => setMisc(e.target.value)}
                    placeholder="Miscellaneous notes"
                  />
                </Section>
              </div>
            </div>

            {/* Accessories */}
            <Section
              title="Accessories"
              right={
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={accIncludeGroup}
                    onCheckedChange={() => setAccIncludeGroup((v) => !v)}
                    className="h-3.5 w-3.5"
                  />
                  Include in Create New Group
                </label>
              }
            >
              <div className="grid gap-2.5 md:grid-cols-5 items-end">
                <Field label="Type">
                  <SelectField
                    value={accDraft.type}
                    onChange={(v) => setAccDraft((d) => ({ ...d, type: v }))}
                    options={["Containers", "Bags", "Straps", "Hardware"]}
                  />
                </Field>
                <Field label="Accessory">
                  <SelectField
                    value={accDraft.accessory}
                    onChange={(v) => setAccDraft((d) => ({ ...d, accessory: v }))}
                    options={["Canvas Bag", "Storage Tube", "Blanket Roll", "Pin Set"]}
                  />
                </Field>
                <Field label="Material">
                  <SelectField
                    value={accDraft.material}
                    onChange={(v) => setAccDraft((d) => ({ ...d, material: v }))}
                    options={["Rubber", "Canvas", "Plastic", "Steel"]}
                  />
                </Field>
                <Field label="Color">
                  <SelectField
                    value={accDraft.color}
                    onChange={(v) => setAccDraft((d) => ({ ...d, color: v }))}
                    options={["Black", "Orange", "Yellow", "Blue"]}
                  />
                </Field>
                <div className="flex items-end gap-2">
                  <Field label="Qty">
                    <Input
                      className={`${fieldCls} w-20`}
                      value={accDraft.qty}
                      onChange={(e) => setAccDraft((d) => ({ ...d, qty: e.target.value }))}
                    />
                  </Field>
                  <Button size="sm" className="h-7 text-[11px]" onClick={addAccessory}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {accessories.length > 0 && (
                <Table className="mt-3">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-7 text-[11px]">Type</TableHead>
                      <TableHead className="h-7 text-[11px]">Accessory</TableHead>
                      <TableHead className="h-7 text-[11px]">Material</TableHead>
                      <TableHead className="h-7 text-[11px]">Color</TableHead>
                      <TableHead className="h-7 text-[11px]">Qty</TableHead>
                      <TableHead className="h-7 w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessories.map((a) => (
                      <TableRow key={a.id} className="hover:bg-transparent">
                        <TableCell className="py-1 text-[11px]">{a.type}</TableCell>
                        <TableCell className="py-1 text-[11px]">{a.accessory}</TableCell>
                        <TableCell className="py-1 text-[11px]">{a.material}</TableCell>
                        <TableCell className="py-1 text-[11px]">{a.color}</TableCell>
                        <TableCell className="py-1 text-[11px]">{a.qty}</TableCell>
                        <TableCell className="py-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              setAccessories((rows) => rows.filter((r) => r.id !== a.id))
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Section>

            {/* Comments */}
            <Section
              title="Comments"
              right={
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={cmtIncludeGroup}
                    onCheckedChange={() => setCmtIncludeGroup((v) => !v)}
                    className="h-3.5 w-3.5"
                  />
                  Include in Create New Group
                </label>
              }
            >
              <div className="grid gap-2.5 md:grid-cols-[180px_1fr_auto] items-end">
                <Field label="Type">
                  <SelectField
                    value={commentType}
                    onChange={setCommentType}
                    options={["Other", "Testing", "Customer", "Shipping", "Internal"]}
                  />
                </Field>
                <div className="space-y-1.5">
                  <SelectField
                    value={commentPreset}
                    onChange={(v) => {
                      setCommentPreset(v);
                      setCommentText(v);
                    }}
                    options={[
                      "Item received onsite",
                      "Retest scheduled",
                      "Awaiting customer approval",
                    ]}
                    placeholder="Select a standard comment"
                  />
                  <Textarea
                    className="min-h-[52px] text-[11px]"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment"
                  />
                </div>
                <Button size="sm" className="h-7 text-[11px]" onClick={addComment}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>

              <Table className="mt-3">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-7 text-[11px] w-32">Type</TableHead>
                    <TableHead className="h-7 text-[11px] w-32">User</TableHead>
                    <TableHead className="h-7 text-[11px] w-44">Date Entered</TableHead>
                    <TableHead className="h-7 text-[11px]">Comment</TableHead>
                    <TableHead className="h-7 w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((c) => (
                    <TableRow key={c.id} className="hover:bg-transparent">
                      <TableCell className="py-1 text-[11px]">{c.type}</TableCell>
                      <TableCell className="py-1 text-[11px]">{c.user}</TableCell>
                      <TableCell className="py-1 text-[11px] text-muted-foreground">
                        {c.date}
                      </TableCell>
                      <TableCell className="py-1 text-[11px]">{c.comment}</TableCell>
                      <TableCell className="py-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            setComments((rows) => rows.filter((r) => r.id !== c.id))
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {comments.length} item{comments.length === 1 ? "" : "s"}
              </p>
            </Section>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <Section title="Blanket Details">
              <p className="text-[11px] text-muted-foreground">
                Onsite blanket test details (class, size, defects, results) are captured here.
              </p>
            </Section>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-20 border-t bg-card px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[11px]">
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[11px]">
            Complete
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={newGroup} onValueChange={setNewGroup}>
            <SelectTrigger className="h-7 w-[160px] text-[11px]">
              <SelectValue placeholder="Group type" />
            </SelectTrigger>
            <SelectContent className="z-50">
              {["Blankets", "CoverUps", "Grounds", "Hotsticks"].map((g) => (
                <SelectItem key={g} value={g} className="text-[11px]">
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-7 text-[11px]">
            Create New Group
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[11px]">
            Cancel WO
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[11px]">
            Print WO
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[11px]">
            Sold Report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[11px]"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-[11px] bg-green-600 text-white hover:bg-green-700"
            onClick={() => toast({ title: "Saved", description: "Item changes saved." })}
          >
            Save
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default EslOnsiteBlankets;
