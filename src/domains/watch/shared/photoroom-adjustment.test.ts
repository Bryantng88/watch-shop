import assert from "node:assert/strict";
import test from "node:test";

import {
  isReusableSharpCoverKey,
  isTransparentSharpCoverKey,
} from "./photoroom-adjustment";

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
