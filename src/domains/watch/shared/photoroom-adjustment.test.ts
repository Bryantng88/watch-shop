import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_PHOTOROOM_ADJUSTMENT,
  isReusableSharpCoverKey,
  isTransparentSharpCoverKey,
} from "./photoroom-adjustment";

test("horizontal mirroring is opt-in for existing covers", () => {
  assert.equal(DEFAULT_PHOTOROOM_ADJUSTMENT.flipHorizontal, false);
});

test("saved PhotoRoom and Sharp cover derivatives remain reusable after reload", () => {
  assert.equal(isReusableSharpCoverKey("media/objects/root/derivatives/cover-edit-a1.png"), true);
  assert.equal(isReusableSharpCoverKey("media/objects/root/derivatives/cover-sharp-b2.png"), true);
  assert.equal(isReusableSharpCoverKey("media/objects/root/derivatives/photoroom-result.png"), true);
  assert.equal(isReusableSharpCoverKey("media/objects/root/original/source.jpg"), false);
});

test("only cutout derivatives are treated as transparent Sharp sources", () => {
  assert.equal(isTransparentSharpCoverKey("media/objects/root/derivatives/cover-cutout-a1.png"), true);
  assert.equal(isTransparentSharpCoverKey("media/objects/root/derivatives/photoroom-cutout-b2.png"), true);
  assert.equal(isTransparentSharpCoverKey("media/objects/root/derivatives/cover-edit-c3.png"), false);
});
