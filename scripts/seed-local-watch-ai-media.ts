import sharp from "sharp";

import { ImageRole, ProductType } from "@prisma/client";

import { mediaStorage } from "../src/domains/media/storage";
import { prisma } from "../src/server/db/client";

const SKU = "LOCAL-AI-SPEC-OMEGA-001";
const PREFIX = "local-test/watch-ai-spec/omega-deville";

const fixtures = [
  { name: "dial-front.png", role: ImageRole.INLINE, sortOrder: 0, angle: "FRONT" },
  { name: "case-side.png", role: ImageRole.GALLERY, sortOrder: 0, angle: "SIDE" },
  { name: "case-back.png", role: ImageRole.GALLERY, sortOrder: 1, angle: "BACK" },
] as const;

function renderWatchFixture(label: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
    <rect width="1200" height="1200" fill="#e8e1d4"/>
    <rect x="505" y="20" width="190" height="340" rx="70" fill="#5b321f"/>
    <rect x="505" y="840" width="190" height="340" rx="70" fill="#5b321f"/>
    <circle cx="600" cy="600" r="300" fill="#d9c181" stroke="#c7c8c3" stroke-width="42"/>
    <circle cx="600" cy="600" r="258" fill="#e6cf91" stroke="#9f8a56" stroke-width="4"/>
    <g stroke="#342819" stroke-width="9">
      <line x1="600" y1="370" x2="600" y2="410"/><line x1="600" y1="790" x2="600" y2="830"/>
      <line x1="370" y1="600" x2="410" y2="600"/><line x1="790" y1="600" x2="830" y2="600"/>
    </g>
    <text x="600" y="505" text-anchor="middle" fill="#342819" font-family="Georgia,serif" font-size="44">Ω</text>
    <text x="600" y="548" text-anchor="middle" fill="#342819" font-family="Arial,sans-serif" font-size="28" letter-spacing="5">OMEGA</text>
    <text x="600" y="710" text-anchor="middle" fill="#342819" font-family="Georgia,serif" font-size="28">De Ville</text>
    <line x1="600" y1="600" x2="600" y2="455" stroke="#211a12" stroke-width="15" stroke-linecap="round"/>
    <line x1="600" y1="600" x2="475" y2="650" stroke="#211a12" stroke-width="12" stroke-linecap="round"/>
    <circle cx="600" cy="600" r="17" fill="#211a12"/>
    <rect x="48" y="48" width="210" height="66" rx="18" fill="#0f172a" opacity=".82"/>
    <text x="153" y="91" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="25">${label}</text>
  </svg>`;
}

async function main() {
  const product = await prisma.product.upsert({
    where: { sku: SKU },
    update: { title: "Omega De Ville AI spec test", specStatus: "PENDING" },
    create: {
      sku: SKU,
      slug: "local-ai-spec-omega-deville-001",
      title: "Omega De Ville AI spec test",
      type: ProductType.WATCH,
      specStatus: "PENDING",
    },
  });

  const watch = await prisma.watch.upsert({
    where: { productId: product.id },
    update: { specStatus: "PENDING" },
    create: { productId: product.id, specStatus: "PENDING" },
  });

  const seeded = [];
  for (const fixture of fixtures) {
    const key = `${PREFIX}/${fixture.name}`;
    const bytes = await sharp(Buffer.from(renderWatchFixture(fixture.angle), "utf8"))
      .png()
      .toBuffer();
    await mediaStorage.write({ key, bytes, contentType: "image/png" });

    const existing = await prisma.productImage.findFirst({
      where: { productId: product.id, fileKey: key },
      select: { id: true },
    });
    const data = {
      role: fixture.role,
      sortOrder: fixture.sortOrder,
      alt: `Local AI watch spec fixture ${fixture.angle.toLowerCase()}`,
      mime: "image/png",
      width: 1200,
      height: 1200,
      sizeBytes: bytes.byteLength,
      isPrimary: fixture.role === ImageRole.INLINE,
    };
    const image = existing
      ? await prisma.productImage.update({ where: { id: existing.id }, data })
      : await prisma.productImage.create({
          data: { productId: product.id, fileKey: key, ...data },
        });

    await prisma.mediaAsset.upsert({
      where: { key },
      update: {
        productId: product.id,
        role: fixture.role,
        sortOrder: fixture.sortOrder,
        sizeBytes: bytes.byteLength,
        isMissing: false,
        lastSeenAt: new Date(),
      },
      create: {
        key,
        parentPrefix: PREFIX,
        fileName: fixture.name,
        ext: "png",
        profile: "watch",
        productId: product.id,
        role: fixture.role,
        sortOrder: fixture.sortOrder,
        sizeBytes: bytes.byteLength,
        lastSeenAt: new Date(),
      },
    });
    seeded.push({ id: image.id, key, role: fixture.role });
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { primaryImageUrl: seeded[0]?.key ?? null },
  });

  console.log(JSON.stringify({ ok: true, productId: product.id, watchId: watch.id, sku: SKU, images: seeded }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
