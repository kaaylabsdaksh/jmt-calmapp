import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { reviewSerials, splitSerials } from "../src/lib/quote-serials";

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
  test("single serial and empty input retain single-entry behavior", () => {
    assert.deepEqual(reviewSerials(" SN-01 ").valid, ["SN-01"]);
    assert.deepEqual(reviewSerials(" \n ").valid, []);
  });
  test("oversized pastes are rejected rather than partially added", () => {
    assert.ok(reviewSerials("A".repeat(200001)).error);
  });
});