import assert from "node:assert/strict";
import test from "node:test";

import { mediaRecipeHash, stableMediaRecipeJson } from "./watch-media-processing.service";

test("media recipe hash is deterministic regardless of object key order", () => {
  const left = { adjustment: { blur: 12, exposure: 4 }, processor: "gallery-sharp" };
  const right = { processor: "gallery-sharp", adjustment: { exposure: 4, blur: 12 } };

  assert.equal(stableMediaRecipeJson(left), stableMediaRecipeJson(right));
  assert.equal(mediaRecipeHash(left), mediaRecipeHash(right));
});

test("different media recipes do not share a derivative slot", () => {
  assert.notEqual(
    mediaRecipeHash({ processor: "cover-sharp", exposure: 1 }),
    mediaRecipeHash({ processor: "cover-sharp", exposure: 2 }),
  );
});
