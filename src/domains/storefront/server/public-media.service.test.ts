import assert from "node:assert/strict";
import test from "node:test";
import type { DB } from "@/server/db/client";
import { signPublicWatchImage } from "./public-media.service";

test("public Watch signing rejects private work keys even in a stale product row", async () => {
  let signed = 0;
  const storage = { sign: async () => { signed++; return "signed-fixture"; } };
  for (const fileKey of ["media/work/objects/fixture/original/image.webp", "media/objects/../work/objects/fixture/original/image.webp"]) {
    const db = { productImage: { findFirst: async () => ({ fileKey }) } } as unknown as DB;
    assert.equal(await signPublicWatchImage({ productId: "watch", imageId: "image" }, { db, storage }), null);
  }
  assert.equal(signed, 0);
  const db = { productImage: { findFirst: async () => ({ fileKey: "media/objects/watch/original/image.webp" }) } } as unknown as DB;
  assert.equal(await signPublicWatchImage({ productId: "watch", imageId: "image" }, { db, storage }), "signed-fixture");
  assert.equal(signed, 1);
});
