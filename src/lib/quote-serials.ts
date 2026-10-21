import { z } from "zod";

export const MAX_SERIAL_PASTE_LENGTH = 200000;
export const serialPasteSchema = z.string().max(MAX_SERIAL_PASTE_LENGTH, "Paste must be 200,000 characters or fewer.");
export const serialSchema = z.string().trim().min(1).max(100, "Serial exceeds 100 characters").regex(/^[\p{L}\p{N}._/#:+()\-]+$/u, "Invalid characters");
export type SerialEntry = { index: number; serial: string; issue?: string; removed: boolean };

export function splitSerials(value: string): string[] {
  return value.split(/[\s,;]+/u).map((serial) => serial.trim()).filter(Boolean);
}

export function reviewSerials(value: string, existing: readonly string[] = [], removed: readonly number[] = []) {
  const input = serialPasteSchema.safeParse(value);
  if (!input.success) return { entries: [] as SerialEntry[], valid: [] as string[], duplicates: 0, invalid: 0, error: input.error.issues[0]?.message };
  const seen = new Set(existing.map((serial) => serial.trim().toUpperCase()).filter(Boolean));
  const inPaste = new Set<string>();
  const entries: SerialEntry[] = splitSerials(value).map((serial, index) => {
    const parsed = serialSchema.safeParse(serial);
    const key = serial.toUpperCase();
    const issue = !parsed.success ? parsed.error.issues[0]?.message : seen.has(key) ? "Already on quote or staged" : inPaste.has(key) ? "Duplicate in paste" : undefined;
    const isRemoved = removed.includes(index);
    // A removed first occurrence must not prevent a retained occurrence from being added.
    if (!isRemoved && parsed.success) inPaste.add(key);
    return { index, serial, issue, removed: isRemoved };
  });
  return {
    entries,
    valid: entries.filter((entry) => !entry.issue && !entry.removed).map((entry) => entry.serial),
    duplicates: entries.filter((entry) => entry.issue?.startsWith("Duplicate") || entry.issue?.startsWith("Already")).length,
    invalid: entries.filter((entry) => entry.issue && !entry.issue.startsWith("Duplicate") && !entry.issue.startsWith("Already")).length,
    error: undefined as string | undefined,
  };
}