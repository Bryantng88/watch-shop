import { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";

export type UpdateWatchPricingInput = {
  salePrice?: number | string | null;
  minPrice?: number | string | null;
  costPrice?: number | string | null;
  serviceCost?: number | string | null;
  landedCost?: number | string | null;
  pricingNote?: string | null;
};

function toDecimal(value?: number | string | null) {
  if (value == null || value === "") return null;

  const normalized = String(value).replace(/[^\d.-]/g, "");
  if (!normalized) return null;

  return new Prisma.Decimal(normalized);
}

export async function getWatchPricingRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    select: {
      id: true,
      productId: true,
      watchPrice: true,
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch");
  }

  return {
    watchId: watch.id,
    product: watch.product,
    price: watch.watchPrice,
  };
}

export async function updateWatchPricingRepo(
  db: DB,
  productId: string,
  input: UpdateWatchPricingInput
) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    select: { id: true },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch để cập nhật giá");
  }

  return client.watchPrice.upsert({
    where: { watchId: watch.id },
    create: {
      watchId: watch.id,
      salePrice: toDecimal(input.salePrice),
      minPrice: toDecimal(input.minPrice),
      costPrice: toDecimal(input.costPrice),
      serviceCost: toDecimal(input.serviceCost),
      landedCost: toDecimal(input.landedCost),
      pricingNote: input.pricingNote ?? null,
    },
    update: {
      salePrice: toDecimal(input.salePrice),
      minPrice: toDecimal(input.minPrice),
      costPrice: toDecimal(input.costPrice),
      serviceCost: toDecimal(input.serviceCost),
      landedCost: toDecimal(input.landedCost),
      pricingNote: input.pricingNote ?? null,
    },
  });
}