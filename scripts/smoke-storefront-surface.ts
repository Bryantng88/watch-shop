import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import type { DB } from "../src/server/db/client";
import { signPublicWatchImage } from "../src/domains/storefront/server/public-media.service";

const read = (path: string) => readFileSync(path, "utf8");

async function main() {
  let receivedWhere: unknown = null;
  let signedKey: string | null = null;
  const db = {
    productImage: {
      findFirst: async (args: { where: unknown }) => {
        receivedWhere = args.where;
        return { fileKey: "products/storefront/chosen/watch-1.webp" };
      },
    },
  } as unknown as DB;
  const storage = {
    sign: async (key: string) => {
      signedKey = key;
      return "https://storage.example/signed-watch-1";
    },
  };

  const signed = await signPublicWatchImage(
    { productId: "product-1", imageId: "image-1" },
    { db, storage },
  );
  assert.equal(signed, "https://storage.example/signed-watch-1");
  assert.equal(signedKey, "products/storefront/chosen/watch-1.webp");

  const whereJson = JSON.stringify(receivedWhere);
  for (const required of ["product-1", "image-1", "isForStorefront", "AVAILABLE", "HOLD", "SOLD", "READY"]) {
    assert.ok(whereJson.includes(required), `public image ownership query is missing ${required}`);
  }

  const publicSources = [
    "src/app/(public)/layout.tsx",
    "src/app/(public)/products/page.tsx",
    "src/app/(public)/products/[slug]/page.tsx",
    "src/app/api/public/catalog/watches/[productId]/images/[imageId]/route.ts",
    "src/domains/storefront/server/public-media.service.ts",
  ].map(read).join("\n");

  assert.ok(!publicSources.includes("@/app/(admin)"), "public surface imports an admin route boundary");
  assert.ok(!publicSources.includes("/api/media/sign"), "public surface leaks the admin media signer");
  assert.ok(!publicSources.includes("bootstrap"), "new public shell must not depend on Bootstrap");
  assert.ok(publicSources.includes("listPublicWatches"), "catalog page is not wired to the public query service");
  assert.ok(publicSources.includes("getPublicWatchBySlug"), "detail page is not wired to the public query service");

  const middleware = read("src/middleware.ts");
  assert.ok(middleware.includes('"/admin/:path*"'));
  assert.ok(middleware.includes('"/api/admin/:path*"'));
  assert.ok(!middleware.includes('"/api/public/:path*"'), "public APIs were accidentally put behind admin auth");

  console.log(JSON.stringify({
    ok: true,
    imageOwnershipAssertions: 6,
    publicBoundaryAssertions: 8,
    adminMatcherPreserved: true,
  }, null, 2));
}

main();

