import { tableFromOcr } from "./quote-import";

export async function readQuoteImport(file: File, onProgress: (message: string) => void, signal: AbortSignal): Promise<{ sheets: { name: string; table: string[][] }[]; screenshot: boolean }> {
  if (file.size === 0 || file.size > 10 * 1024 * 1024) throw new Error("Choose a non-empty file up to 10 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase();
  const checkCancelled = () => { if (signal.aborted) throw new DOMException("Cancelled", "AbortError"); };
  checkCancelled();
  if (extension === "xlsx") {
    const { default: readXlsxFile } = await import("read-excel-file/browser");
    const sheets = await readXlsxFile(file, { parseNumber: (value) => value });
    const result = sheets.map((sheet) => ({ name: sheet.sheet, table: sheet.data.map((row) => row.map((cell) => cell === null ? "" : String(cell))) }));
    checkCancelled();
    return { sheets: result, screenshot: false };
  }
  if (extension === "csv") {
    const { default: Papa } = await import("papaparse");
    const parsed = Papa.parse<string[]>(await file.text(), { skipEmptyLines: "greedy" });
    if (parsed.errors.some((error) => error.type === "Quotes")) throw new Error("This CSV has invalid quoting. Export it again from Excel.");
    checkCancelled();
    return { sheets: [{ name: file.name, table: parsed.data }], screenshot: false };
  }
  if (["png", "jpg", "jpeg", "webp"].includes(extension || "") && ["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    const { createWorker } = await import("tesseract.js");
    onProgress("Preparing screenshot text recognition…");
    const worker = await createWorker("eng", 1, { logger: (event) => { if (!signal.aborted) onProgress(`${event.status} ${Math.round(event.progress * 100)}%`); } });
    const cancel = () => { void worker.terminate(); };
    signal.addEventListener("abort", cancel, { once: true });
    try {
      checkCancelled();
      const result = await worker.recognize(file);
      checkCancelled();
      if (!result.data.text.trim()) throw new Error("No text detected. Choose a clearer screenshot.");
      return { sheets: [{ name: file.name, table: tableFromOcr(result.data.text) }], screenshot: true };
    } finally {
      signal.removeEventListener("abort", cancel);
      await worker.terminate();
    }
  }
  throw new Error("Choose an Excel .xlsx, CSV, PNG, JPG or WebP file. Save older .xls files as .xlsx first.");
}