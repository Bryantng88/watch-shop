import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { prisma } from "@/server/db/client";
import { mediaStorage } from "@/domains/media/storage";
import { getActiveStorefrontHero } from "./storefront-hero.service";
import { GET } from "@/app/api/public/storefront/catalog-hero/route";
const restores: Array<() => void> = [];
function patch<T extends object>(object: T, key: keyof T, value: unknown) {
  const original = object[key];
  Reflect.set(object, key, value);
  restores.push(() => {
    Reflect.set(object, key, original);
  });
}
afterEach(() => {
  for (const restore of restores.reverse()) restore();
  restores.length = 0;
});
test("catalog hero is a same-origin URL and never serializes private storage keys", async () => {
  patch(
    prisma.storefrontHeroImage,
    "findFirst",
    async ({
      where,
      select,
    }: {
      where: { isActive: boolean };
      select: Record<string, boolean>;
    }) => {
      assert.equal(where.isActive, true);
      assert.equal(select.storageKey, undefined);
      assert.equal(select.derivativeKey, undefined);
      return {
        id: "hero",
        altText: "Seiko",
        width: 1600,
        height: 900,
        focalX: 40,
        focalY: 60,
        overlayOpacity: 55,
      };
    },
  );
  const result = await getActiveStorefrontHero();
  assert.equal(result?.url, "/api/public/storefront/catalog-hero");
  assert.doesNotMatch(JSON.stringify(result), /storageKey|derivativeKey/);
});
test("public catalog hero serves only the selected hero and forces an image MIME type", async () => {
  let key = "storefront/hero/derivatives/active.webp";
  patch(
    prisma.storefrontHeroImage,
    "findFirst",
    async ({ where }: { where: { isActive: boolean } }) => {
      assert.equal(where.isActive, true);
      return { derivativeKey: key, storageKey: "storefront/hero/source.jpg" };
    },
  );
  let reads = 0;
  patch(mediaStorage, "read", async (requested: string) => {
    reads++;
    assert.equal(requested, key);
    return { bytes: new Uint8Array([1]), contentType: "text/html" };
  });
  const result = await GET();
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("content-type"), "image/webp");
  assert.equal(result.headers.get("cache-control"), "no-store");
  key = "private/source.webp";
  assert.equal((await GET()).status, 404);
  key = "storefront/hero/../private.webp";
  assert.equal((await GET()).status, 404);
  assert.equal(reads, 1);
});
test("no active catalog hero returns 404 without reading storage", async () => {
  patch(prisma.storefrontHeroImage, "findFirst", async () => null);
  patch(mediaStorage, "read", async () => {
    throw new Error("must not read storage");
  });
  assert.equal(await getActiveStorefrontHero(), null);
  assert.equal((await GET()).status, 404);
});
