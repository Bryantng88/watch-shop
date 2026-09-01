import assert from "node:assert/strict";
import test from "node:test";

import sharp from "sharp";

import {
  processGalleryImageWithSharp,
  type GallerySharpPreset,
} from "./process-watch-gallery-with-sharp.application";

const defaults: GallerySharpPreset = {
  brightness: 0,
  saturation: 100,
  contrast: 0,
  metalEnhance: 0,
  sharpen: 0,
  zoom: 100,
  rotation: 0,
  cropAspect: "original",
  cropOffsetX: 0,
  cropOffsetY: 0,
};

test("Sharp Gallery supports square crop and zoom", async () => {
  const source = await sharp({
    create: { width: 800, height: 400, channels: 3, background: "#aabbcc" },
  }).jpeg().toBuffer();
  const output = await processGalleryImageWithSharp(source, {
    ...defaults,
    cropAspect: "square",
    zoom: 200,
    cropOffsetX: 100,
  });
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, 200);
  assert.equal(metadata.height, 200);
});

test("Sharp Gallery rotation changes the output orientation", async () => {
  const source = await sharp({
    create: { width: 800, height: 400, channels: 3, background: "#aabbcc" },
  }).jpeg().toBuffer();
  const output = await processGalleryImageWithSharp(source, { ...defaults, rotation: 90 });
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, 400);
  assert.equal(metadata.height, 800);
});
