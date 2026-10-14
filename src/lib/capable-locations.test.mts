import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { matchesCapableLocation, selectedCapabilities } from "./capable-locations";

describe("capable location grid rules", () => {
  test("no checked options yields zero selected locations", () => {
    assert.deepEqual(selectedCapabilities({ Alexandria: { Calibration: false } }), []);
  });
  test("counts locations once even with multiple checked services", () => {
    assert.equal(selectedCapabilities({ Alexandria: { Calibration: true, Adjustment: true }, Clute: { "Op Check": true }, Houston: { "17025 (Limited)": true } }).length, 3);
  });
  test("lists only checked services and the limited 17025 note", () => {
    assert.deepEqual(selectedCapabilities({ Alexandria: { Calibration: false, "17025 (Limited)": true, "Op Check": true } }, { Alexandria: "Voltage only" }), [{ location: "Alexandria", services: ["17025 (Limited)", "Op Check"], note: "Voltage only" }]);
  });
  test("Alexandria search matches any checked option, including No 17025", () => {
    assert.equal(matchesCapableLocation({ Alexandria: { '"No" 17025': true } }, "alexandria"), true);
    assert.equal(matchesCapableLocation({ Alexandria: { Calibration: false } }, "Alexandria"), false);
  });
});