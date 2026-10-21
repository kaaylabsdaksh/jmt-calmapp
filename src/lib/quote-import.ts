import { z } from "zod";
import { PRODUCTS, type Product } from "./products";
import { serialSchema } from "./quote-serials";

export const MAX_IMPORT_ROWS = 2000;
export const importRowSchema = z.object({
  manufacturer: z.string().trim().max(200),
  model: z.string().trim().max(200),
  description: z.string().trim().max(1000),
  serial: z.string().trim().max(100),
  custId: z.string().trim().max(100),
  custSerial: z.string().trim().max(100),
  qty: z.string().regex(/^\d+$/).refine((value) => Number(value) >= 1 && Number(value) <= 10000, "Qty must be 1–10,000"),
});
export type ImportRow = z.infer<typeof importRowSchema> & { id: string; excluded: boolean; productId: string };
export const blankImportRow = (): ImportRow => ({ id: crypto.randomUUID(), manufacturer: "", model: "", description: "", serial: "", custId: "", custSerial: "", qty: "1", excluded: false, productId: "" });
const normalize = (value: string) => value.trim().toUpperCase();
export const headerKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
export const columnAliases: Record<keyof z.infer<typeof importRowSchema>, string[]> = {
  manufacturer: ["manufacturer", "mfr", "make", "brand"], model: ["model", "modelnumber", "modelno"], description: ["description", "itemdescription", "productdescription", "equipment"],
  serial: ["serial", "serialnumber", "serialno", "mfrserial", "manufacturerserial"], custId: ["custid", "customerid", "assetid", "assettag"], custSerial: ["custserial", "customerserial"], qty: ["qty", "quantity"],
};
export function matchImportProduct(row: Pick<ImportRow, "manufacturer" | "model">): Product | undefined {
  const matches = PRODUCTS.filter((product) => normalize(product.model) === normalize(row.model) && (!row.manufacturer || normalize(product.manufacturer) === normalize(row.manufacturer)));
  return matches.length === 1 ? matches[0] : undefined;
}
export function mapImportTable(table: string[][], mapping: Partial<Record<keyof z.infer<typeof importRowSchema>, number>>, hasHeader: boolean): ImportRow[] {
  const data = hasHeader ? table.slice(1) : table;
  if (data.filter((row) => row.some((cell) => cell.trim())).length > MAX_IMPORT_ROWS) throw new Error(`Import supports up to ${MAX_IMPORT_ROWS} rows; split this file into smaller files.`);
  return data.filter((row) => row.some((cell) => cell.trim())).map((cells) => {
    const row = blankImportRow();
    for (const key of Object.keys(columnAliases) as (keyof typeof columnAliases)[]) {
      const column = mapping[key];
      if (column !== undefined) row[key] = cells[column]?.trim() || (key === "qty" ? "1" : "");
    }
    const product = matchImportProduct(row);
    row.productId = product?.id || "";
    if (!row.description && product) row.description = product.description;
    if (row.serial) row.qty = "1";
    return row;
  });
}
export function detectMapping(table: string[][]) {
  const mapping: Partial<Record<keyof typeof columnAliases, number>> = {};
  const first = table[0] || [];
  for (const key of Object.keys(columnAliases) as (keyof typeof columnAliases)[]) {
    const index = first.findIndex((cell) => columnAliases[key].includes(headerKey(cell)));
    if (index >= 0) mapping[key] = index;
  }
  return mapping;
}
export function tableFromOcr(text: string): string[][] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  // Screenshots commonly lose column spacing: anchor equipment on the exact catalog model.
  const rows: string[][] = [["Manufacturer", "Model", "Description", "Serial", "Cust ID", "Cust Serial", "Qty"]];
  for (const line of lines) {
    const product = [...PRODUCTS].sort((a, b) => b.model.length - a.model.length).find((candidate) => {
      const prefix = `${candidate.manufacturer} ${candidate.model}`;
      return normalize(line).startsWith(prefix + " ") || normalize(line) === prefix;
    });
    if (product) {
      let remainder = line.slice(`${product.manufacturer} ${product.model}`.length).trim();
      if (normalize(remainder).startsWith(normalize(product.description))) remainder = remainder.slice(product.description.length).trim();
      const values = remainder.split(/\s+/);
      rows.push([product.manufacturer, product.model, product.description, values[0] || "", values[1] || "", values[2] || "", "1"]);
    } else if (!/manufacturer|serial\s*(#|number)|customer\s*id/i.test(line)) {
      const values = line.split(/\t|\s{2,}|\s*\|\s*/);
      rows.push(values.length > 1 ? values : ["", "", line, "", "", "", "1"]);
    }
  }
  return rows;
}
export function reviewImportRows(rows: ImportRow[], existingSerials: string[]) {
  const serials = new Set(existingSerials.map(normalize).filter(Boolean));
  return rows.map((row) => {
    const validation = importRowSchema.safeParse(row);
    const product = PRODUCTS.find((candidate) => candidate.id === row.productId);
    let issue = !validation.success ? validation.error.issues[0]?.message : !product ? "Select a matching product" : undefined;
    if (!issue && row.serial && !serialSchema.safeParse(row.serial).success) issue = "Invalid serial";
    if (!issue && row.serial && serials.has(normalize(row.serial))) issue = "Duplicate serial";
    // Customer IDs are intentionally not uniqueness keys: different models may share them.
    if (!issue && !row.excluded && row.serial) serials.add(normalize(row.serial));
    return { row, product, issue };
  });
}