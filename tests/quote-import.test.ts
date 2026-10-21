import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { detectMapping, mapImportTable, reviewImportRows, tableFromOcr } from "../src/lib/quote-import";

describe("quote equipment import", () => {
  test("same customer ID is allowed for different models", () => {
    const table = [["Manufacturer", "Model", "Serial #", "Cust ID"], ["FLUKE", "10", "S1", "C100"], ["FLUKE", "11", "S2", "C100"]];
    const rows = mapImportTable(table, detectMapping(table), true);
    const reviewed = reviewImportRows(rows, []);
    assert.equal(reviewed.length, 2);
    assert.ok(reviewed.every((entry) => !entry.issue));
    assert.deepEqual(rows.map((row) => row.custId), ["C100", "C100"]);
  });
  test("spreadsheet mapping preserves leading zeros and serialized Qty 1", () => {
    const table = [["Manufacturer", "Model", "Serial", "Quantity"], ["FLUKE", "10", "00012", "9"]];
    assert.equal(mapImportTable(table, detectMapping(table), true)[0].serial, "00012");
    assert.equal(mapImportTable(table, detectMapping(table), true)[0].qty, "1");
  });
  test("duplicate serials remain flagged regardless of model or customer ID", () => {
    const table = [["Manufacturer", "Model", "Serial", "Cust ID"], ["FLUKE", "10", "S1", "C100"], ["FLUKE", "11", "S1", "C100"]];
    const reviewed = reviewImportRows(mapImportTable(table, detectMapping(table), true), []);
    assert.equal(reviewed[1].issue, "Duplicate serial");
  });
  test("screenshot OCR detects catalog models and extracts serial and customer ID", () => {
    const table = tableFromOcr("Manufacturer Model Description Serial Cust ID\nFLUKE 10 MULTIMETER SN001 C100\nFLUKE 11 MULTIMETER SN002 C100");
    const rows = mapImportTable(table, detectMapping(table), true);
    assert.equal(rows.length, 2);
    assert.equal(rows[1].model, "11");
    assert.equal(rows[1].serial, "SN002");
    assert.equal(rows[1].custId, "C100");
  });
  test("unmatched equipment is not silently added with invented pricing", () => {
    const rows = mapImportTable([["Manufacturer", "Model"], ["UNKNOWN", "XYZ"]], { manufacturer: 0, model: 1 }, true);
    assert.equal(reviewImportRows(rows, [])[0].issue, "Select a matching product");
  });
});