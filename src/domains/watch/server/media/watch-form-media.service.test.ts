import assert from "node:assert/strict";
import test from "node:test";

import { mergeWatchMediaPoolItems } from "./watch-form-media.service";

test("Gallery selection remains visible in the durable chosen pool", () => {
  const chosen = [
    { key: "media/objects/a/original/a.jpg" },
    { key: "media/objects/b/original/b.jpg" },
  ];
  const gallery = [
    { key: "media/objects/b/original/b.jpg" },
    { key: "media/objects/c/original/c.jpg" },
  ];

  assert.deepEqual(
    mergeWatchMediaPoolItems(chosen, gallery).map((item) => item.key),
    [
      "media/objects/a/original/a.jpg",
      "media/objects/b/original/b.jpg",
      "media/objects/c/original/c.jpg",
    ],
  );
});
