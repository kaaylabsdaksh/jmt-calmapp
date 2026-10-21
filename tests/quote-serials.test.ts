import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { buildSerialBatch, reviewSerials, splitSerials } from "../src/lib/quote-serials";

describe("quote multi-serial rules", () => {
  test("accepts newline comma semicolon tab and space separators, ignoring blanks", () => {
    assert.deepEqual(splitSerials(" A1\r\n\nB2,C3;D4\tE5 F6  "), ["A1", "B2", "C3", "D4", "E5", "F6"]);
  });
  test("flags duplicates within paste and existing quote, case insensitively", () => {
    const result = reviewSerials("ABC abc XYZ", ["xyz"]);
    assert.deepEqual(result.valid, ["ABC"]);
    assert.equal(result.duplicates, 2);
    assert.equal(result.entries[1].issue, "Duplicate in paste");
    assert.equal(result.entries[2].issue, "Already on quote or staged");
  });
  test("flags invalid serials and excludes them from accepted serials", () => {
    const result = reviewSerials(`SN-01 <script> ${"A".repeat(101)}`);
    assert.deepEqual(result.valid, ["SN-01"]);
    assert.equal(result.invalid, 2);
  });
  test("removed entries are not added and the next duplicate can be retained", () => {
    const result = reviewSerials("ABC ABC DEF", [], [0, 2]);
    assert.deepEqual(result.valid, ["ABC"]);
    assert.equal(result.entries.filter((entry) => entry.removed).length, 2);
  });
  test("supports 75 serials in a single paste", () => {
    const serials = Array.from({ length: 75 }, (_, index) => `SN-${index + 1}`);
    assert.deepEqual(reviewSerials(serials.join("\n")).valid, serials);
  });
  test("each of 75 serials creates one Qty 1 line preserving equipment and selected attributes", () => {
    const product = { manufacturer: "Fluke", model: "87V", description: "Multimeter" };
    const batch = buildSerialBatch([{ product, detail: { qty: "9", mfrSerial: Array.from({ length: 75 }, (_, index) => `SN-${index}`).join("\n"), add17025: true, repair: true, custId: "CUSTOMER-1" } }], []);
    assert.equal(batch.lines.length, 75);
    assert.ok(batch.lines.every((line) => line.product === product && line.detail.qty === "1" && line.detail.add17025 && line.detail.repair && line.detail.custId === "CUSTOMER-1"));
    assert.equal(batch.lines[74].detail.mfrSerial, "SN-74");
  });
  test("batch skips repeated serials across equipment rows and returns summary counts", () => {
    const batch = buildSerialBatch([{ product: "A", detail: { qty: "1", mfrSerial: "SN1 SN2 SN2 <bad>" } }, { product: "B", detail: { qty: "1", mfrSerial: "SN1 SN3" } }], ["SN3"]);
    assert.equal(batch.lines.length, 2);
    assert.equal(batch.duplicates, 3);
    assert.equal(batch.invalid, 1);
  });
  test("single serial and empty input retain single-entry behavior", () => {
    assert.deepEqual(reviewSerials(" SN-01 ").valid, ["SN-01"]);
    assert.deepEqual(reviewSerials(" \n ").valid, []);
  });
  test("oversized pastes are rejected rather than partially added", () => {
    assert.ok(reviewSerials("A".repeat(200001)).error);
  });
});