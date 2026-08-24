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

test("post media has an isolated canonical workspace under media/posts", () => {
  const policy = new MediaPathPolicy();
  const original = policy.postOriginal({
    postId: "post-001",
    mediaObjectId: "asset-001",
    filename: "campaign image.jpg",
  });
  const derivative = policy.postDerivative({
    postId: "post-001",
    mediaObjectId: "asset-001",
    variant: "instagram-square",
    extension: ".webp",
  });

  assert.equal(
    original,
    "media/posts/post-001/objects/asset-001/original/campaign-image.jpg",
  );
  assert.equal(
    derivative,
    "media/posts/post-001/objects/asset-001/derivatives/instagram-square.webp",
  );
  assert.equal(policy.isCanonical(original), true);
  assert.equal(policy.isCanonical(derivative), true);
});
