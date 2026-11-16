import assert from "node:assert/strict";
import test from "node:test";

import { mergeWatchMediaPoolItems, watchMediaSelectionChanges } from "./watch-form-media.service";

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

test("Adding only to the pool is persisted even when Gallery is unchanged", () => {
  const changes = watchMediaSelectionChanges({
    beforePool: [],
    beforeGallery: [],
    requestedPool: [{ key: "media/source/MEN/edit/new-watch.jpg" }],
    requestedGallery: [],
  });

  assert.equal(changes.poolChanged, true);
  assert.equal(changes.galleryChanged, false);
  assert.deepEqual(changes.pool.map((item) => item.key), [
    "media/source/MEN/edit/new-watch.jpg",
  ]);
});


test("Pool read order does not invalidate completed images; gallery reorder does", () => {
  const a = {key: "media/objects/a/original/a.jpg"};
  const b = {key: "media/objects/b/original/b.jpg"};
  const unchanged = watchMediaSelectionChanges({beforePool:[a,b],beforeGallery:[a,b],requestedPool:[b,a],requestedGallery:[a,b]});
  assert.equal(unchanged.poolChanged, false);
  assert.equal(unchanged.galleryChanged, false);
  const reordered = watchMediaSelectionChanges({beforePool:[a,b],beforeGallery:[a,b],requestedPool:[b,a],requestedGallery:[b,a]});
  assert.equal(reordered.poolChanged, false);
  assert.equal(reordered.galleryChanged, true);
});
