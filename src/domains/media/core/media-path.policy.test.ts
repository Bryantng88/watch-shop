import assert from "node:assert/strict";
import test from "node:test";

import { MediaPathPolicy } from "./media-path.policy";

test("cover source is an inbox while generated work stays in canonical object derivatives", () => {
  const policy = new MediaPathPolicy();
  assert.equal(policy.sourceRoot({ segment: "MEN", purpose: "cover" }), "media/men/cover");

  const derivative = policy.derivative({
    mediaObjectId: "source-object-id",
    variant: "photoroom-plus-preview",
    extension: "png",
  });
  assert.equal(
    derivative,
    "media/objects/source-object-id/derivatives/photoroom-plus-preview.png",
  );
  assert.equal(policy.isCanonical(derivative), true);
  assert.equal(policy.isSource(derivative), false);
});

test("canonical originals and derivatives share the same media object workspace", () => {
  const policy = new MediaPathPolicy();
  const original = policy.canonicalOriginal({ mediaObjectId: "watch-media", filename: "source image.jpg" });
  const derivative = policy.derivative({ mediaObjectId: "watch-media", variant: "sharp-light", extension: ".png" });

  assert.match(original, /^media\/objects\/watch-media\/original\//);
  assert.match(derivative, /^media\/objects\/watch-media\/derivatives\//);
});
