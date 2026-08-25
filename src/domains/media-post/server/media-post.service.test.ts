import assert from "node:assert/strict";
import test from "node:test";

import { mediaPostAutoTitle } from "./media-post.service";

test("Media Post title uses Bangkok creation date and daily sequence", () => {
  assert.equal(
    mediaPostAutoTitle(1, new Date("2026-08-24T17:00:00.000Z")),
    "post_01 ngày 25/08/2026",
  );
  assert.equal(
    mediaPostAutoTitle(12, new Date("2026-08-25T16:59:59.000Z")),
    "post_12 ngày 25/08/2026",
  );
});
