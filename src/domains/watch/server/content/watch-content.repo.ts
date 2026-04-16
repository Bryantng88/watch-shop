import { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { dbOrTx, withDbTransaction } from "@/server/db/client";
import type { SaveWatchContentInput } from "../shared";

export async function getWatchContentRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
      watchContent: true,
    },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch");
  }

  return {
    product: watch.product,
    content: watch.watchContent,
  };
}

export async function saveWatchContentRepo(
  db: DB,
  productId: string,
  input: SaveWatchContentInput
) {
  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId },
      select: {
        id: true,
        productId: true,
      },
    });

    if (!watch) {
      throw new Error("Không tìm thấy watch để lưu content");
    }

    const content = await tx.watchContent.upsert({
      where: { watchId: watch.id },
      create: {
        watchId: watch.id,
        titleOverride: input.titleOverride ?? null,
        summary: input.summary ?? null,
        hookText: input.hookText ?? null,
        body: input.body ?? null,
        bulletSpecs: input.bulletSpecs ?? [],
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        aiMetaJson:
          (input.aiMetaJson as Prisma.InputJsonValue | undefined) ??
          Prisma.JsonNull,
      },
      update: {
        ...(input.titleOverride !== undefined
          ? { titleOverride: input.titleOverride }
          : {}),
        ...(input.summary !== undefined ? { summary: input.summary } : {}),
        ...(input.hookText !== undefined ? { hookText: input.hookText } : {}),
        ...(input.body !== undefined ? { body: input.body } : {}),
        ...(input.bulletSpecs !== undefined
          ? { bulletSpecs: input.bulletSpecs }
          : {}),
        ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle } : {}),
        ...(input.seoDescription !== undefined
          ? { seoDescription: input.seoDescription }
          : {}),
        ...(input.aiMetaJson !== undefined
          ? {
            aiMetaJson:
              (input.aiMetaJson as Prisma.InputJsonValue | undefined) ??
              Prisma.JsonNull,
          }
          : {}),
      },
    });

    await tx.product.update({
      where: { id: watch.productId },
      data: {
        ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle } : {}),
        ...(input.seoDescription !== undefined
          ? { seoDescription: input.seoDescription }
          : {}),
      },
    });

    return content;
  });
}

export async function syncWatchContentSnapshotRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    include: {
      product: {
        include: {
          brand: true,
        },
      },
      watchSpecV2: true,
      watchPrice: true,
      watchContent: true,
      watchMedia: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch để sync content");
  }

  const hasImages = watch.watchMedia.length > 0;
  const hasPricing = Boolean(
    watch.watchPrice?.salePrice ?? watch.watchPrice?.listPrice
  );
  const hasSpec = Boolean(
    watch.watchSpecV2?.model ||
    watch.watchSpecV2?.referenceNumber ||
    watch.watchSpecV2?.dialColor
  );

  return {
    productId,
    watchId: watch.id,
    title: watch.product.title,
    brand: watch.product.brand?.name ?? watch.watchSpecV2?.brand ?? null,
    specSummary: {
      model: watch.watchSpecV2?.model ?? null,
      referenceNumber: watch.watchSpecV2?.referenceNumber ?? null,
      dialColor: watch.watchSpecV2?.dialColor ?? null,
      caseShape: watch.watchSpecV2?.caseShape ?? null,
      primaryCaseMaterial: watch.watchSpecV2?.primaryCaseMaterial ?? null,
    },
    pricingSummary: {
      salePrice: watch.watchPrice?.salePrice?.toString() ?? null,
      listPrice: watch.watchPrice?.listPrice?.toString() ?? null,
      costPrice: watch.watchPrice?.costPrice?.toString() ?? null,
    },
    readiness: {
      hasImages,
      hasPricing,
      hasSpec,
      hasContent: Boolean(
        watch.watchContent?.body ||
        watch.watchContent?.summary ||
        watch.watchContent?.bulletSpecs?.length
      ),
    },
  };
}