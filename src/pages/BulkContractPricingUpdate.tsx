import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, DollarSign, Minus, Paperclip, Plus, Search, Upload, Users, X } from "lucide-react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Account = { acct: string; name: string };

const ALL_ACCOUNTS: Account[] = [
  { acct: "00000.00", name: "Test" },
  { acct: "0185.12", name: "Entergy Mississippi LLC" },
  { acct: "2588.00", name: "John Deere" },
  { acct: "10323.00", name: "Sabal Trail Transmission LLC" },
  { acct: "1790.00", name: "Shintech" },
  { acct: "4051.00", name: "Pinnacle Polymers" },
  { acct: "0367.00", name: "Occidental Chem" },
  { acct: "3098.00", name: "Cheniere Sabine Pass" },
  { acct: "6941.00", name: "Wolseley Industrial" },
  { acct: "0364.03", name: "Marathon Petro Elect" },
  { acct: "2343.07", name: "LA Integrated PE JV LLC Whse" },
];

const label = "text-[10px] font-medium text-muted-foreground";
const field = "h-7 text-xs";

export default function BulkContractPricingUpdate() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filter, setFilter] = useState("");
  const [chosenFilter, setChosenFilter] = useState("");
  const [selectedAccts, setSelectedAccts] = useState<string[]>(["00000.00"]);
  const [availableHighlight, setAvailableHighlight] = useState<string[]>([]);
  const [chosenHighlight, setChosenHighlight] = useState<string[]>([]);


  // Default section
  const [defaultOn, setDefaultOn] = useState(false);
  const [rateMode, setRateMode] = useState<"hourly" | "pct">("hourly");
  const [hourly, setHourly] = useState("");
  const [pct, setPct] = useState("");
  const [defExp, setDefExp] = useState<Date | undefined>();
  const [defReview, setDefReview] = useState<Date | undefined>();
  const [laborRate, setLaborRate] = useState("");
  const [defFile, setDefFile] = useState<string>("");
  const [defKeepFile, setDefKeepFile] = useState(false);

  // ESL section
  const [eslOn, setEslOn] = useState(false);
  const [eslValue, setEslValue] = useState<"yes" | "no">("no");
  const [eslExp, setEslExp] = useState<Date | undefined>();
  const [eslReview, setEslReview] = useState<Date | undefined>();
  const [eslFile, setEslFile] = useState<string>("");
  const [eslKeepFile, setEslKeepFile] = useState(false);

  const [comment, setComment] = useState("");
  const [nationalContract, setNationalContract] = useState(false);
  const [doNotAutoPrice, setDoNotAutoPrice] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const available = useMemo(
    () =>
      ALL_ACCOUNTS.filter((a) => !selectedAccts.includes(a.acct)).filter((a) =>
        `${a.acct} ${a.name}`.toLowerCase().includes(filter.toLowerCase()),
      ),
    [filter, selectedAccts],
  );
  const chosen = useMemo(
    () => ALL_ACCOUNTS.filter((a) => selectedAccts.includes(a.acct)).filter((a) =>
      `${a.acct} ${a.name}`.toLowerCase().includes(chosenFilter.toLowerCase()),
    ),
    [selectedAccts, chosenFilter],
  );


  const toggle = (list: string[], setList: (v: string[]) => void, acct: string) =>
    setList(list.includes(acct) ? list.filter((a) => a !== acct) : [...list, acct]);

  const moveRight = () => {
    if (!availableHighlight.length) return;
    setSelectedAccts([...selectedAccts, ...availableHighlight]);
    setAvailableHighlight([]);
  };
  const moveLeft = () => {
    if (!chosenHighlight.length) return;
    setSelectedAccts(selectedAccts.filter((a) => !chosenHighlight.includes(a)));
    setChosenHighlight([]);
  };

  const addAccount = (acct: string) => {
    if (!selectedAccts.includes(acct)) {
      setSelectedAccts((prev) => [...prev, acct]);
    }
    setAvailableHighlight((prev) => prev.filter((a) => a !== acct));
  };

  const removeAccount = (acct: string) => {
    setSelectedAccts((prev) => prev.filter((a) => a !== acct));
    setChosenHighlight((prev) => prev.filter((a) => a !== acct));
  };

  const canSubmit = selectedAccts.length > 0 && (defaultOn || eslOn);

  const submit = () => {
    setConfirmOpen(false);
    toast({
      title: "Accounts updated",
      description: `${selectedAccts.length} account${selectedAccts.length === 1 ? "" : "s"} updated successfully.`,
    });
    navigate("/manage-customers");
  };

  const ListBox = ({
    items,
    highlight,
    onToggle,
    onAction,
    mode,
    empty,
  }: {
    items: Account[];
    highlight: string[];
    onToggle: (acct: string) => void;
    onAction?: (acct: string) => void;
    mode?: "available" | "chosen";
    empty: string;
  }) => (
    <div className="h-56 overflow-y-auto rounded-md border bg-background">
      {items.length === 0 ? (
        <div className="flex h-full items-center justify-center px-3 text-center text-[11px] text-foreground/80">{empty}</div>
      ) : (
        items.map((a) => {
          const active = highlight.includes(a.acct);
          const isAvailable = mode === "available";
          const isChosen = mode === "chosen";
          return (
            <div
              key={a.acct}
              role="button"
              tabIndex={0}
              onClick={() => onToggle(a.acct)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onToggle(a.acct);
              }}
              className={`group flex w-full items-center justify-between gap-2 border-b px-2.5 py-1.5 text-left text-xs last:border-0 transition-colors ${
                active ? "bg-primary/10 text-foreground" : "hover:bg-muted/60"
              }`}
            >
              <span className="truncate">
                <span className="font-medium text-slate-900">{a.acct}</span>
                <span className="text-muted-foreground"> — {a.name}</span>
              </span>
              {isAvailable && onAction && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Add ${a.acct}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(a.acct);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onAction(a.acct);
                    }
                  }}
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-green-700 hover:text-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>
              )}
              {isChosen && onAction && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${a.acct}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(a.acct);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onAction(a.acct);
                    }
                  }}
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-red-700 hover:text-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-1"
                >
                  <Minus className="h-3.5 w-3.5" />
                </span>
              )}
              {!mode && active && <Check className="h-3.5 w-3.5 shrink-0 text-foreground" />}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <ModernTopNav />
      <main className="mx-auto max-w-[1300px] space-y-3 px-3 pb-28 pt-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Bulk Contract Pricing Update</h1>
            <p className="text-xs text-muted-foreground">
              Apply contract pricing, expiration and review dates to multiple customer accounts at once.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {selectedAccts.length} selected
          </span>
        </div>

        {/* Step 1 */}
        <Card>
          <CardHeader className="px-3 pb-1 pt-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-slate-900">1</span>
              Choose which accounts to update
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid items-start gap-3 md:grid-cols-[1fr_auto_1fr]">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className={label}>Available Accounts</Label>
                  <span className="text-[10px] text-muted-foreground">{available.length}</span>
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter by account # or customer"
                    className={`${field} pl-7`}
                  />
                </div>
                <ListBox
                  items={available}
                  highlight={availableHighlight}
                  onToggle={(a) => toggle(availableHighlight, setAvailableHighlight, a)}
                  onAction={addAccount}
                  mode="available"
                  empty="No accounts match the filter"
                />
              </div>

              <div className="flex flex-row items-center justify-center gap-2 md:mt-9 md:flex-col">
                <Button variant="outline" size="sm" className="h-7 w-9 p-0" onClick={moveRight} disabled={!availableHighlight.length}>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-9 p-0" onClick={moveLeft} disabled={!chosenHighlight.length}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className={label}>Accounts to Update</Label>
                  {chosen.length > 0 && (
                    <button type="button" onClick={() => setSelectedAccts([])} className="text-[10px] text-muted-foreground underline-offset-2 hover:underline">
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex min-h-[28px] flex-wrap gap-1 rounded-md border border-dashed bg-muted/40 px-1.5 py-1">
                  {chosen.length === 0 ? (
                    <span className="px-1 py-0.5 text-[10px] text-foreground/80">No accounts selected</span>
                  ) : (
                    chosen.map((a) => (
                      <span key={a.acct} className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-slate-900 shadow-sm">
                        {a.acct}
                        <X className="h-3 w-3 cursor-pointer text-foreground/80" onClick={() => setSelectedAccts(selectedAccts.filter((x) => x !== a.acct))} />
                      </span>
                    ))
                  )}
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={chosenFilter}
                    onChange={(e) => setChosenFilter(e.target.value)}
                    placeholder="Search selected accounts"
                    className={`${field} pl-7`}
                  />
                </div>
                <ListBox
                  items={chosen}
                  highlight={chosenHighlight}
                  onToggle={(a) => toggle(chosenHighlight, setChosenHighlight, a)}
                  onAction={removeAccount}
                  mode="chosen"
                  empty="No selected accounts match the search"
                />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader className="px-3 pb-1 pt-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-slate-900">2</span>
              Select sections to update
            </CardTitle>
            <p className="pt-1 text-[10px] leading-relaxed text-muted-foreground">
              Leaving any field blank clears it on the customer record, including any associated file. Check “Leave existing file” to keep the current file.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 px-3 pb-3 lg:grid-cols-2">
            {/* Default */}
            <div className={`rounded-lg border p-3 transition-colors ${defaultOn ? "bg-background" : "bg-muted/40"}`}>
              <div className="flex items-center gap-2 pb-2">
                <Checkbox id="defaultOn" checked={defaultOn} onCheckedChange={(v) => setDefaultOn(!!v)} />
                <Label htmlFor="defaultOn" className="flex items-center gap-1.5 text-xs font-semibold">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />Default Pricing
                </Label>
              </div>
              <fieldset disabled={!defaultOn} className="space-y-2">
                <RadioGroup value={rateMode} onValueChange={(v) => setRateMode(v as "hourly" | "pct")} className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="hourly" id="hourly" className="h-3.5 w-3.5 border-green-600 text-green-600 focus-visible:ring-green-600" />
                      <Label htmlFor="hourly" className={label}>Hourly</Label>
                    </div>
                    <Input value={hourly} onChange={(e) => setHourly(e.target.value)} disabled={rateMode !== "hourly"} placeholder="0.00" className={field} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="pct" id="pct" className="h-3.5 w-3.5 border-green-600 text-green-600 focus-visible:ring-green-600" />
                      <Label htmlFor="pct" className={label}>Percentage</Label>
                    </div>
                    <Input value={pct} onChange={(e) => setPct(e.target.value)} disabled={rateMode !== "pct"} placeholder="0" className={field} />
                  </div>
                </RadioGroup>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="space-y-1"><Label className={label}>Exp. Date</Label><ModernDatePicker value={defExp} onChange={setDefExp} size="sm" /></div>
                  <div className="space-y-1"><Label className={label}>Review Date</Label><ModernDatePicker value={defReview} onChange={setDefReview} size="sm" /></div>
                  <div className="space-y-1"><Label className={label}>Labor Rate</Label><Input value={laborRate} onChange={(e) => setLaborRate(e.target.value)} placeholder="0.00" className={field} /></div>
                </div>
                <div className="space-y-1">
                  <Label className={label}>Contract File</Label>
                  <label className="flex h-7 cursor-pointer items-center gap-2 rounded-md border border-dashed px-2 text-[11px] text-foreground/80 hover:bg-muted/60">
                    <Upload className="h-3.5 w-3.5" />
                    <span className="truncate">{defFile || "Browse for a file"}</span>
                    <input type="file" className="hidden" onChange={(e) => setDefFile(e.target.files?.[0]?.name ?? "")} />
                  </label>
                  {defFile && (
                    <div className="flex items-center gap-1 text-[10px] text-foreground/80"><Paperclip className="h-3 w-3" />{defFile}
                      <button type="button" className="underline-offset-2 hover:underline" onClick={() => setDefFile("")}>remove</button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="defKeep" checked={defKeepFile} onCheckedChange={(v) => setDefKeepFile(!!v)} />
                  <Label htmlFor="defKeep" className="text-[11px]">Leave existing file</Label>
                </div>
              </fieldset>
            </div>

            {/* ESL */}
            <div className={`rounded-lg border p-3 transition-colors ${eslOn ? "bg-background" : "bg-muted/40"}`}>
              <div className="flex items-center gap-2 pb-2">
                <Checkbox id="eslOn" checked={eslOn} onCheckedChange={(v) => setEslOn(!!v)} />
                <Label htmlFor="eslOn" className="text-xs font-semibold">ESL Pricing</Label>
              </div>
              <fieldset disabled={!eslOn} className="space-y-2">
                <div className="space-y-1">
                  <Label className={label}>ESL Contract</Label>
                  <RadioGroup value={eslValue} onValueChange={(v) => setEslValue(v as "yes" | "no")} className="flex items-center gap-4 pt-0.5">
                    <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="eslYes" className="h-3.5 w-3.5 border-green-600 text-green-600 focus-visible:ring-green-600" /><Label htmlFor="eslYes" className="text-[11px]">Yes</Label></div>
                    <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="eslNo" className="h-3.5 w-3.5 border-green-600 text-green-600 focus-visible:ring-green-600" /><Label htmlFor="eslNo" className="text-[11px]">No</Label></div>
                  </RadioGroup>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1"><Label className={label}>Exp. Date</Label><ModernDatePicker value={eslExp} onChange={setEslExp} size="sm" /></div>
                  <div className="space-y-1"><Label className={label}>Review Date</Label><ModernDatePicker value={eslReview} onChange={setEslReview} size="sm" /></div>
                </div>
                <div className="space-y-1">
                  <Label className={label}>ESL File</Label>
                  <label className="flex h-7 cursor-pointer items-center gap-2 rounded-md border border-dashed px-2 text-[11px] text-foreground/80 hover:bg-muted/60">
                    <Upload className="h-3.5 w-3.5" />
                    <span className="truncate">{eslFile || "Browse for a file"}</span>
                    <input type="file" className="hidden" onChange={(e) => setEslFile(e.target.files?.[0]?.name ?? "")} />
                  </label>
                  {eslFile && (
                    <div className="flex items-center gap-1 text-[10px] text-foreground/80"><Paperclip className="h-3 w-3" />{eslFile}
                      <button type="button" className="underline-offset-2 hover:underline" onClick={() => setEslFile("")}>remove</button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="eslKeep" checked={eslKeepFile} onCheckedChange={(v) => setEslKeepFile(!!v)} />
                  <Label htmlFor="eslKeep" className="text-[11px]">Leave existing file</Label>
                </div>
              </fieldset>
            </div>
          </CardContent>
        </Card>

        {/* Comment + flags */}
        <Card>
          <CardHeader className="px-3 pb-1 pt-2"><CardTitle className="text-sm">Comment &amp; Options</CardTitle></CardHeader>
          <CardContent className="grid gap-3 px-3 pb-3 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-1">
              <Label className={label}>Comment</Label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="text-xs" placeholder="Notes added to each updated account…" />
            </div>
            <div className="space-y-2 self-end pb-1">
              <div className="flex items-center gap-2"><Checkbox id="natl" checked={nationalContract} onCheckedChange={(v) => setNationalContract(!!v)} /><Label htmlFor="natl" className="text-[11px]">National Contract</Label></div>
              <div className="flex items-center gap-2"><Checkbox id="noauto" checked={doNotAutoPrice} onCheckedChange={(v) => setDoNotAutoPrice(!!v)} /><Label htmlFor="noauto" className="text-[11px]">Do Not Auto Price</Label></div>
            </div>
          </CardContent>
        </Card>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur md:left-[var(--sidebar-width)]">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-2 px-3 py-2 sm:px-5">
          <span className="text-[11px] text-muted-foreground">
            {selectedAccts.length} account{selectedAccts.length === 1 ? "" : "s"} · {[defaultOn && "Default", eslOn && "ESL"].filter(Boolean).join(" + ") || "no section selected"}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-customers")}>Cancel</Button>
            <Button size="sm" className="h-8 bg-green-700 text-xs text-white hover:bg-green-800 disabled:opacity-100 disabled:bg-muted disabled:text-foreground/70" disabled={!canSubmit} onClick={() => setConfirmOpen(true)}>
              Update Accounts
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update {selectedAccts.length} account{selectedAccts.length === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>
              Blank fields in the selected sections will be cleared on each customer record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction className="h-8 bg-green-700 text-xs text-white hover:bg-green-800 disabled:opacity-100 disabled:bg-muted disabled:text-foreground/70" onClick={submit}>Update Accounts</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
