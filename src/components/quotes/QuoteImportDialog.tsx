import { useEffect, useRef, useState } from "react";
import { FileSpreadsheet, Upload, Trash2, Loader2, Plus, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCTS } from "@/lib/products";
import { columnAliases, detectMapping, mapImportTable, matchImportProduct, reviewImportRows, blankImportRow, type ImportRow } from "@/lib/quote-import";
import { readQuoteImport } from "@/lib/quote-import-file";
import type { SearchAddItemResult } from "./SearchAddItemDialog";

const labels = { manufacturer: "Manufacturer", model: "Model", description: "Description", serial: "Serial #", custId: "Cust ID", custSerial: "Cust Serial", qty: "Qty" };
type Column = keyof typeof columnAliases;
type Props = { open: boolean; onOpenChange: (open: boolean) => void; onAdd: (result: SearchAddItemResult) => void; existingSerials: string[] };

export function QuoteImportDialog({ open, onOpenChange, onAdd, existingSerials }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const controller = useRef<AbortController>();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [sheets, setSheets] = useState<{ name: string; table: string[][] }[]>([]);
  const [sheet, setSheet] = useState(0);
  const [mapping, setMapping] = useState<Partial<Record<Column, number>>>({});
  const [hasHeader, setHasHeader] = useState(true);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [screenshot, setScreenshot] = useState(false);
  const [fileName, setFileName] = useState("");
  const [step, setStep] = useState<"upload" | "mapping" | "review">("upload");
  const close = () => { controller.current?.abort(); onOpenChange(false); };
  useEffect(() => {
    if (open) {
      setStep("upload"); setRows([]); setSheets([]); setError(""); setBusy(false); setFileName("");
    } else controller.current?.abort();
    return () => controller.current?.abort();
  }, [open]);

  const loadFile = async (file: File) => {
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    setBusy(true); setError(""); setProgress("Reading file…"); setFileName(file.name);
    try {
      const result = await readQuoteImport(file, setProgress, active.signal);
      if (active.signal.aborted) return;
      if (!result.sheets.some((entry) => entry.table.length > 0)) throw new Error("No item rows found in this file.");
      setSheets(result.sheets); setSheet(0); setScreenshot(result.screenshot);
      const detected = detectMapping(result.sheets[0].table);
      setMapping(detected); setHasHeader(Object.keys(detected).length > 0); setStep("mapping");
    } catch (failure) {
      if (!active.signal.aborted) setError(failure instanceof Error ? failure.message : "Unable to read this file.");
    } finally { if (!active.signal.aborted) setBusy(false); }
  };
  const table = sheets[sheet]?.table || [];
  const width = Math.max(0, ...table.slice(0, 20).map((row) => row.length));
  const reviewed = reviewImportRows(rows, existingSerials);
  const ready = reviewed.filter((entry) => !entry.row.excluded && !entry.issue && entry.product);
  const flagged = reviewed.filter((entry) => !entry.row.excluded && entry.issue);
  const patchRow = (id: string, key: Column, value: string) => setRows((current) => current.map((row) => {
    if (row.id !== id) return row;
    const next = { ...row, [key]: value };
    if (key === "manufacturer" || key === "model") next.productId = matchImportProduct(next)?.id || "";
    if (key === "serial" && value.trim()) next.qty = "1";
    return next;
  }));
  const confirm = () => {
    const lines = ready.flatMap((entry) => entry.product ? [{ product: entry.product, detail: { qty: entry.row.serial ? "1" : entry.row.qty, mfrSerial: entry.row.serial.trim(), custId: entry.row.custId.trim(), custSerial: entry.row.custSerial.trim(), add17025: false, repair: false } }] : []);
    if (!lines.length) return;
    onAdd({ products: lines.map((line) => line.product), groupAsOneLineItem: false, details: {}, lines, skipped: { duplicates: flagged.filter((entry) => entry.issue === "Duplicate serial").length, invalid: flagged.filter((entry) => entry.issue !== "Duplicate serial").length, removed: rows.filter((row) => row.excluded).length } });
    close();
  };
  return (
    <Dialog open={open} onOpenChange={(value) => value ? onOpenChange(true) : close()}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b shrink-0 bg-muted/30">
          <DialogTitle className="flex items-center gap-2 text-sm"><FileSpreadsheet className="h-4 w-4" />Import Quote Items</DialogTitle>
          <DialogDescription className="text-xs">{fileName || "Excel / CSV / Screenshot"}</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto flex-1 p-4 space-y-3">
          <input ref={fileInput} type="file" className="hidden" accept=".xlsx,.csv,.png,.jpg,.jpeg,.webp" aria-label="Import equipment file" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadFile(file); event.target.value = ""; }} />
          {error && <div role="alert" className="border border-destructive/30 bg-destructive/5 text-destructive rounded-md p-3 text-xs">{error}</div>}
          {busy ? <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm"><Loader2 className="h-5 w-5 animate-spin" />{progress}</div> : step === "upload" ? (
            <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) void loadFile(file); }} className="border-2 border-dashed border-border rounded-md py-16 text-center space-y-3">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="font-medium">Excel or screenshot of equipment</div>
              <div className="text-xs text-muted-foreground">.xlsx, .csv, .png, .jpg, .webp · Up to 10 MB</div>
              <Button variant="outline" onClick={() => fileInput.current?.click()}><Upload className="h-4 w-4 mr-2" />Choose file</Button>
            </div>
          ) : step === "mapping" ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">Column mapping</h3>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs"><Checkbox checked={hasHeader} onCheckedChange={(value) => setHasHeader(value === true)} className="data-[state=checked]:bg-foreground data-[state=checked]:text-background" />First row contains headers</label>
                  <Select value={String(sheet)} onValueChange={(value) => { const index = Number(value); setSheet(index); const detected = detectMapping(sheets[index].table); setMapping(detected); setHasHeader(Object.keys(detected).length > 0); }}>
                    <SelectTrigger aria-label="Sheet" className="w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{sheets.map((entry, index) => <SelectItem key={index} value={String(index)}>{entry.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              {screenshot && <div className="bg-muted p-2 text-xs">Screenshot text may contain recognition errors. Check model, serial and customer ID before confirming.</div>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(labels) as Column[]).map((key) => <div key={key} className="space-y-1"><label className="text-xs font-medium">{labels[key]}</label><Select value={mapping[key] === undefined ? "none" : String(mapping[key])} onValueChange={(value) => setMapping((current) => ({ ...current, [key]: value === "none" ? undefined : Number(value) }))}><SelectTrigger aria-label={`Map ${labels[key]}`} className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Not provided</SelectItem>{Array.from({ length: width }, (_, index) => <SelectItem key={index} value={String(index)}>Column {index + 1}{hasHeader ? `: ${table[0]?.[index] || "Unnamed"}` : ""}</SelectItem>)}</SelectContent></Select></div>)}
              </div>
              <div className="overflow-auto border rounded-md max-h-64"><table className="w-full text-xs"><tbody>{table.slice(0, 8).map((row, index) => <tr key={index} className="border-b">{row.map((cell, column) => <td key={column} className="p-2 whitespace-nowrap">{cell}</td>)}</tr>)}</tbody></table></div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 role="status" className="text-sm font-semibold">{rows.length} detected · {ready.length} ready · {flagged.length} flagged · {rows.filter((row) => row.excluded).length} removed</h3>
                <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setRows((current) => [...current, blankImportRow()])}><Plus className="h-3.5 w-3.5 mr-1" />Row</Button>{flagged.length > 0 && <Button variant="outline" size="sm" onClick={() => { const ids = new Set(flagged.map((entry) => entry.row.id)); setRows((current) => current.map((row) => ids.has(row.id) ? { ...row, excluded: true } : row)); }}>Remove flagged ({flagged.length})</Button>}</div>
              </div>
              <div className="text-xs text-muted-foreground">Customer IDs may repeat across different models. Serialized items have Qty 1.</div>
              <div className="border rounded-md overflow-auto max-h-[55vh]"><table className="w-full min-w-[1400px] text-xs"><thead className="sticky top-0 bg-muted z-10"><tr>{["Product match", ...Object.values(labels), "Review", ""].map((label, index) => <th key={index} className="text-left p-2 whitespace-nowrap">{label}</th>)}</tr></thead><tbody>{reviewed.filter((entry) => !entry.row.excluded).map(({ row, issue }) => <tr key={row.id} className="border-t">
                <td className="p-1 min-w-48"><Select value={row.productId || "none"} onValueChange={(value) => { const product = PRODUCTS.find((entry) => entry.id === value); setRows((current) => current.map((entry) => entry.id === row.id ? { ...entry, productId: product?.id || "", ...(product ? { manufacturer: product.manufacturer, model: product.model, description: product.description } : {}) } : entry)); }}><SelectTrigger aria-label={`Product match ${row.id}`} className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Select product</SelectItem>{PRODUCTS.map((product) => <SelectItem key={product.id} value={product.id}>{product.manufacturer} · {product.model}</SelectItem>)}</SelectContent></Select></td>
                {(Object.keys(labels) as Column[]).map((key) => <td key={key} className="p-1"><Input aria-label={`${labels[key]} ${row.id}`} value={row[key]} maxLength={key === "description" ? 1000 : 200} disabled={key === "qty" && !!row.serial} onChange={(event) => patchRow(row.id, key, event.target.value)} className={`h-8 text-xs bg-background focus-visible:ring-foreground/30 ${key === "qty" ? "w-14" : "min-w-28"}`} /></td>)}
                <td className={`p-2 min-w-36 ${issue ? "text-destructive" : "text-muted-foreground"}`}>{issue || "Ready"}</td><td className="p-1"><Button variant="ghost" size="icon" aria-label={`Remove imported row ${row.id}`} onClick={() => setRows((current) => current.map((entry) => entry.id === row.id ? { ...entry, excluded: true } : entry))}><Trash2 className="h-3.5 w-3.5" /></Button></td>
              </tr>)}</tbody></table></div>
            </>
          )}
        </div>
        <div className="border-t bg-muted/20 px-4 py-3 flex justify-between gap-2 shrink-0">
          <div>{step !== "upload" && !busy && <Button variant="ghost" size="sm" onClick={() => step === "review" ? setStep("mapping") : fileInput.current?.click()}>{step === "review" ? "Back to columns" : "Choose another file"}</Button>}</div>
          <div className="flex gap-2"><Button variant="outline" size="sm" onClick={close}><X className="h-3.5 w-3.5 mr-1" />Cancel</Button>{!busy && step === "mapping" && <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90" onClick={() => { try { const mapped = mapImportTable(table, mapping, hasHeader); if (!mapped.length) throw new Error("No item rows detected."); setRows(mapped); setError(""); setStep("review"); } catch (failure) { setError(failure instanceof Error ? failure.message : "Unable to map columns."); } }}>Review items</Button>}{!busy && step === "review" && <Button size="sm" disabled={!ready.length} onClick={confirm} className="bg-success text-success-foreground hover:bg-success/90"><Check className="h-3.5 w-3.5 mr-1" />Add {ready.length} items</Button>}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}