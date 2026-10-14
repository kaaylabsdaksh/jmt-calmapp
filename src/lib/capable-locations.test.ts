import { describe, expect, test } from "bun:test";
import { matchesCapableLocation, selectedCapabilities } from "./capable-locations";

describe("capable location grid rules", () => {
  test("no checked options yields zero selected locations", () => {
    expect(selectedCapabilities({ Alexandria: { Calibration: false } })).toEqual([]);
  });
  test("counts locations once even with multiple checked services", () => {
    expect(selectedCapabilities({ Alexandria: { Calibration: true, Adjustment: true }, Clute: { "Op Check": true }, Houston: { "17025 (Limited)": true } }).length).toBe(3);
  });
  test("lists only checked services and the limited 17025 note", () => {
    expect(selectedCapabilities({ Alexandria: { Calibration: false, "17025 (Limited)": true, "Op Check": true } }, { Alexandria: "Voltage only" })).toEqual([{ location: "Alexandria", services: ["17025 (Limited)", "Op Check"], note: "Voltage only" }]);
  });
  test("Alexandria search matches any checked option, including No 17025", () => {
    expect(matchesCapableLocation({ Alexandria: { '"No" 17025': true } }, "alexandria")).toBe(true);
    expect(matchesCapableLocation({ Alexandria: { Calibration: false } }, "Alexandria")).toBe(false);
  });
});