import assert from "node:assert/strict";
import { test } from "node:test";
import { mediaDecimal } from "./media-part-values";

test("decimal comparison matches database scale without binary rounding", () => {
  for (const [input, scale, expected] of [
    ["039.00", 2, "39"],
    ["39.005", 2, "39.01"],
    ["-39.005", 2, "-39.01"],
    ["0.005", 2, "0.01"],
    ["0.0049", 2, "0"],
    ["-0.000", 3, "0"],
    ["18.1235", 3, "18.124"],
    ["100", 0, "100"],
    ["100.00", 2, "100"],
    [".5", 2, "0.5"],
  ] as const)
    assert.equal(mediaDecimal(input, scale), expected);
  assert.equal(mediaDecimal("", 2), null);
  assert.equal(mediaDecimal(null, 2), null);
});
