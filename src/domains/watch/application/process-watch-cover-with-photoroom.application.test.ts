import assert from "node:assert/strict";
import test from "node:test";

import sharp from "sharp";

import { DEFAULT_PHOTOROOM_ADJUSTMENT } from "@/domains/watch/shared/photoroom-adjustment";
import { composeAdjustedStorefrontCover } from "./process-watch-cover-with-photoroom.application";

test("Sharp zoom 100 fits an opaque subject into the storefront cover", async () => {
  const source = await sharp({
    create: {
      width: 2048,
      height: 3840,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{
      input: {
        create: {
          width: 200,
          height: 400,
          channels: 4,
          background: { r: 10, g: 10, b: 10, alpha: 1 },
        },
      },
      left: 924,
      top: 1720,
    }])
    .png()
    .toBuffer();

  const result = await composeAdjustedStorefrontCover(
    source,
    DEFAULT_PHOTOROOM_ADJUSTMENT,
    0,
    false,
    false,
    100,
  );
  const fittedSubject = await sharp(result)
    .trim({ background: { r: 255, g: 255, b: 255, alpha: 1 }, threshold: 12 })
    .toBuffer({ resolveWithObject: true });

  assert.ok(fittedSubject.info.width >= 1_800, `expected fitted width, got ${fittedSubject.info.width}`);
  assert.equal(fittedSubject.info.height, 3_840);
});

test("Sharp neutral re-edit preserves the previously rendered canvas", async () => {
  const source = await sharp({
    create: {
      width: 2048,
      height: 3840,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{
      input: {
        create: {
          width: 640,
          height: 1280,
          channels: 4,
          background: { r: 25, g: 25, b: 25, alpha: 1 },
        },
      },
      left: 900,
      top: 1100,
    }])
    .png()
    .toBuffer();

  const result = await composeAdjustedStorefrontCover(
    source,
    DEFAULT_PHOTOROOM_ADJUSTMENT,
    0,
    false,
    true,
    100,
  );
  const [sourcePixels, resultPixels] = await Promise.all([
    sharp(source).raw().toBuffer(),
    sharp(result).raw().toBuffer(),
  ]);

  assert.deepEqual(resultPixels, sourcePixels);
});
