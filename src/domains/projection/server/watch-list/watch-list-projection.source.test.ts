import assert from "node:assert/strict";
import test from "node:test";
import { mediaWorkTypeKey } from "./watch-list-projection.source";

test("normalizes current and legacy photography work type keys", () => {
  for (const value of ["photography", "PHOTOGRAPHY", "photoshoot", "photo-shoot", "shooting"]) {
    assert.equal(mediaWorkTypeKey(value), "photography");
  }
});

test("preserves the other canonical media flow stage keys", () => {
  assert.equal(mediaWorkTypeKey("media-processing"), "media-processing");
  assert.equal(mediaWorkTypeKey("publish"), "publish");
});

test("does not infer a stage from an unrelated or partial value", () => {
  assert.equal(mediaWorkTypeKey("photoshoot-completed"), null);
  assert.equal(mediaWorkTypeKey(""), null);
  assert.equal(mediaWorkTypeKey(null), null);
});
