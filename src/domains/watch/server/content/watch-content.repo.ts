import { ContentStatus, Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { dbOrTx, withDbTransaction } from "@/server/db/client";
import type { SaveWatchContentInput } from "../shared";

export type WatchContentReviewAction =
  | "submit"
  | "approve"
  | "reject"
  | "publish"
  | "draft";

function hasMeaningfulContent(content: any) {
  return Boolean(
    String(content?.titleOverride ?? "").trim() ||
    String(content?.hookText ?? "").trim() ||
    String(content?.body ?? "").trim() ||
    String(content?.summary ?? "").trim() ||
    (Array.isArray(content?.bulletSpecs) &&
      content.bulletSpecs.some((x: any) => String(x ?? "").trim()))
  );
}

export async function getWatchContentRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
      watchContent: true,
    },
  });

  if (!watch) throw new Error("Không tìm thấy watch");

  return {
    product: watch.product,
    watchId: watch.id,
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
      select: { id: true, productId: true },
    });

    if (!watch) throw new Error("Không tìm thấy watch để lưu content");

    const content = await tx.watchContent.upsert({
      where: { watchId: watch.id },
      create: {
        watchId: watch.id,
        contentStatus: "DRAFT",
        titleOverride: input.titleOverride ?? null,
        summary: input.summary ?? null,
        hookText: input.hookText ?? null,
        body: input.body ?? null,
        bulletSpecs: input.bulletSpecs ?? [],
        hashtags: (input as any).hashtags ?? null,
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
        ...(input.summary !== undefined
          ? { summary: input.summary }
          : {}),
        ...(input.hookText !== undefined
          ? { hookText: input.hookText }
          : {}),
        ...(input.body !== undefined ? { body: input.body } : {}),
        ...(input.bulletSpecs !== undefined
          ? { bulletSpecs: input.bulletSpecs }
          : {}),
        ...((input as any).hashtags !== undefined
          ? { hashtags: (input as any).hashtags }
          : {}),
        ...(input.seoTitle !== undefined
          ? { seoTitle: input.seoTitle }
          : {}),
        ...(input.seoDescription !== undefined
          ? { seoDescription: input.seoDescription }
          : {}),
        ...(input.aiMetaJson !== undefined
          ? {
            aiMetaJson:
              (input.aiMetaJson as
                | Prisma.InputJsonValue
                | undefined) ?? Prisma.JsonNull,
          }
          : {}),
      },
    });

    await tx.product.update({
      where: { id: watch.productId },
      data: {
        ...(input.seoTitle !== undefined
          ? { seoTitle: input.seoTitle }
          : {}),
        ...(input.seoDescription !== undefined
          ? { seoDescription: input.seoDescription }
          : {}),
      },
    });

    return content;
  });
}

export async function getWatchContentReviewTargetRepo(
  db: DB,
  productId: string
) {
  const client = dbOrTx(db);

  return client.watch.findUnique({
    where: { productId },
    select: {
      id: true,
      productId: true,
      watchContent: true,
    },
  });
}

export async function updateWatchContentStatusRepo(
  db: DB,
  input: {
    productId: string;
    status: ContentStatus;
    userId?: string | null;
    reviewNote?: string | null;
  }
) {
  return withDbTransaction(db, async (tx) => {
    const watch = await tx.watch.findUnique({
      where: { productId: input.productId },
      select: {
        id: true,
        watchContent: true,
      },
    });

    if (!watch) throw new Error("Không tìm thấy watch");

    const now = new Date();

    const statusData:
      | Prisma.WatchContentCreateInput
      | Prisma.WatchContentUpdateInput =
      input.status === "SUBMITTED"
        ? {
          contentStatus: input.status,
          submittedAt: now,
          submittedById: input.userId ?? null,
        }
        : input.status === "APPROVED" ||
          input.status === "REJECTED"
          ? {
            contentStatus: input.status,
            reviewedAt: now,
            reviewedById: input.userId ?? null,
            reviewNote: input.reviewNote ?? null,
          }
          : input.status === "PUBLISHED"
            ? {
              contentStatus: input.status,
              publishedAt: now,
              publishedById: input.userId ?? null,
            }
            : {
              contentStatus: input.status,
            };

    return tx.watchContent.upsert({
      where: { watchId: watch.id },
      create: {
        watch: { connect: { id: watch.id } },
        contentStatus: input.status,
        ...statusData,
      },
      update: statusData,
    });
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
          productImage: {
            where: {
              role: "GALLERY" as any,
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      },
      watchSpecV2: true,
      watchPrice: true,
      watchContent: true,
    },
  });

  if (!watch) throw new Error("Không tìm thấy watch để sync content");

  const hasImages = watch.product.productImage.length > 0;

  const hasPricing = Boolean(
    watch.watchPrice?.salePrice ?? watch.watchPrice?.listPrice
  );

  const hasSpec = Boolean(
    watch.watchSpecV2?.model ||
    watch.watchSpecV2?.referenceNumber ||
    watch.watchSpecV2?.dialColor ||
    watch.watchSpecV2?.caseSizeMM ||
    watch.watchSpecV2?.primaryCaseMaterial ||
    watch.watchSpecV2?.crystal
  );

  return {
    productId,
    watchId: watch.id,
    title: watch.product.title,
    brand: watch.product.brand?.name ?? watch.watchSpecV2?.brand ?? null,
    contentStatus: watch.watchContent?.contentStatus ?? "DRAFT",
    specSummary: {
      model: watch.watchSpecV2?.model ?? null,
      referenceNumber: watch.watchSpecV2?.referenceNumber ?? null,
      dialColor: watch.watchSpecV2?.dialColor ?? null,
      caseShape: watch.watchSpecV2?.caseShape ?? null,
      caseSizeMM: watch.watchSpecV2?.caseSizeMM?.toString() ?? null,
      primaryCaseMaterial:
        watch.watchSpecV2?.primaryCaseMaterial ?? null,
      strapSetType: watch.watchSpecV2?.strapSetType ?? null,
      strapComponentSource:
        watch.watchSpecV2?.strapComponentSource ?? null,
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
      hasContent: hasMeaningfulContent(watch.watchContent),
    },
  };
}