import { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";
import type { UpdateWatchPricingInput } from "../shared";

function toDecimal(value?: number | string | null) {
  if (value == null || value === "") return null;
  return new Prisma.Decimal(value);
}

export async function getWatchPricingRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    include: {
      watchPrice: true,
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
        },
      },
    },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch");
  }

  return {
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
      costPrice: toDecimal(input.costPrice),
      serviceCost: toDecimal(input.serviceCost),
      landedCost: toDecimal(input.landedCost),
      listPrice: toDecimal(input.listPrice),
      salePrice: toDecimal(input.salePrice),
      minPrice: toDecimal(input.minPrice),
      pricingNote: input.pricingNote ?? null,
    },
    update: {
      ...(input.costPrice !== undefined
        ? { costPrice: toDecimal(input.costPrice) }
        : {}),
      ...(input.serviceCost !== undefined
        ? { serviceCost: toDecimal(input.serviceCost) }
        : {}),
      ...(input.landedCost !== undefined
        ? { landedCost: toDecimal(input.landedCost) }
        : {}),
      ...(input.listPrice !== undefined
        ? { listPrice: toDecimal(input.listPrice) }
        : {}),
      ...(input.salePrice !== undefined
        ? { salePrice: toDecimal(input.salePrice) }
        : {}),
      ...(input.minPrice !== undefined
        ? { minPrice: toDecimal(input.minPrice) }
        : {}),
      ...(input.pricingNote !== undefined
        ? { pricingNote: input.pricingNote }
        : {}),
    },
  });
}

export async function bulkSetWatchSalePriceRepo(
  db: DB,
  input: {
    productIds: string[];
    salePrice: number | string;
  }
) {
  const client = dbOrTx(db);

  const watches = await client.watch.findMany({
    where: {
      productId: {
        in: input.productIds,
      },
    },
    select: {
      id: true,
      productId: true,
    },
  });

  const salePrice = toDecimal(input.salePrice);

  if (!salePrice) {
    throw new Error("salePrice không hợp lệ");
  }

  const results = [];
  for (const watch of watches) {
    const row = await client.watchPrice.upsert({
      where: { watchId: watch.id },
      create: {
        watchId: watch.id,
        salePrice,
      },
      update: {
        salePrice,
      },
    });

    results.push(row);
  }

  return results;
}