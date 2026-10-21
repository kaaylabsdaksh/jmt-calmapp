import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyFactoryCriteria, factoryBatches, filterFactoryBatches, matchingFactoryItems } from "../src/lib/to-factory";

test("To Factory location search only returns batches at the selected location", () => {
  const rows = filterFactoryBatches(factoryBatches, { ...emptyFactoryCriteria, location: "Alexandria, LA" });
  assert.equal(rows.length, 4);
  assert.ok(rows.every((row) => row.location === "Alexandria, LA"));
});

test("manufacturer, clerk and T/F status must match the same item", () => {
  const criteria = { ...emptyFactoryCriteria, manufacturer: "FLYGT", clerk: "Admin User", status: "Assigned to Clerk" };
  const rows = filterFactoryBatches(factoryBatches, criteria);
  assert.equal(rows[0]?.batch, "3154");
  assert.deepEqual(matchingFactoryItems(rows[0], criteria).map((item) => item.item), ["001"]);
  assert.equal(filterFactoryBatches([factoryBatches[0]], { ...criteria, manufacturer: "FLUKE" }).length, 0);
});

test("Lab Stds filters to standard items and column filters search customer names", () => {
  const criteria = { ...emptyFactoryCriteria, labStandards: true };
  const rows = filterFactoryBatches(factoryBatches, criteria, { customer: "newtron" });
  assert.deepEqual(rows.map((row) => row.batch), ["3154"]);
  assert.equal(matchingFactoryItems(rows[0], criteria)[0]?.labStandard, true);
});