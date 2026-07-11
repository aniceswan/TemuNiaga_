import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeCommodityTerm, normalizeQuantity } from "./index";

test("normalizeCommodityTerm maps local dialect terms", () => {
  assert.equal(normalizeCommodityTerm("sampeu"), "singkong");
  assert.equal(normalizeCommodityTerm("Pare"), "padi");
  assert.equal(normalizeCommodityTerm("gabah garing"), "gabah kering");
});

test("normalizeCommodityTerm passes through unknown terms unchanged", () => {
  assert.equal(normalizeCommodityTerm("kopi"), "kopi");
});

test("normalizeQuantity resolves literal dialect phrases", () => {
  assert.deepEqual(normalizeQuantity("sakintal"), { quantity: 100, unit: "kg" });
  assert.deepEqual(normalizeQuantity("dua kuintal"), { quantity: 200, unit: "kg" });
});

test("normalizeQuantity resolves numeric + unit phrases", () => {
  assert.deepEqual(normalizeQuantity("200 kg"), { quantity: 200, unit: "kg" });
  assert.deepEqual(normalizeQuantity("2 kuintal"), { quantity: 200, unit: "kg" });
  assert.deepEqual(normalizeQuantity("1.5 ton"), { quantity: 1500, unit: "kg" });
});

test("normalizeQuantity resolves number-word + unit phrases", () => {
  assert.deepEqual(normalizeQuantity("lima kilo"), { quantity: 5, unit: "kg" });
  assert.deepEqual(normalizeQuantity("tiga kuintal"), { quantity: 300, unit: "kg" });
});

test("normalizeQuantity returns null instead of guessing", () => {
  assert.equal(normalizeQuantity("banyak sekali"), null);
  assert.equal(normalizeQuantity(""), null);
});
