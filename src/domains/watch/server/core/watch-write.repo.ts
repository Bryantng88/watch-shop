import { Prisma } from "@prisma/client";
import { dbOrTx, withDbTransaction, DB } from "@/server/db/client";
import type {
  CreateWatchDraftInput,
  SaveWatchContentInput,
  UpdateWatchCoreInput,
  UpdateWatchPricingInput,
} from "../shared"

function toDecimal(value?: number | string | null) {
  if (value == null || value === "") return null;
  return new Prisma.Decimal(value);
}

export async function createWatchDraftRepo(db: DB, input: CreateWatchDraftInput) {

  return withDbTransaction(db, async (tx) => {
    const product = await tx.product.create({
      data: {
        type: "WATCH",
        title: input.title,
        brandId: input.brandId ?? null,
        vendorId: input.vendorId ?? null,
        categoryId: input.categoryId ?? null,
        sku: input.sku ?? null,
        status: input.status ?? "DRAFT",
      },
    });

    const watch = await tx.watch.create({
      data: {
        productId: product.id,
        gender: input.gender ?? "MEN",
        siteChannel: input.siteChannel ?? "AFFORDABLE",
      },
      include: {
        product: true,
      },
    });

    await tx.watchPrice.upsert({
      where: { watchId: watch.id },
      create: { watchId: watch.id },
      update: {},
    });

    await tx.watchContent.upsert({
      where: { watchId: watch.id },
      create: {
        watchId: watch.id,
        bulletSpecs: [],
      },
      update: {},
    });

    return watch;
  });
}

export async function updateWatchCoreRepo(
  db: DB,
  productId: string,
  input: UpdateWatchCoreInput
) {

  return withDbTransaction(db, async (tx) => {
    const existing = await tx.watch.findUnique({
      where: { productId },
      include: {
        product: true,
      },
    });

    if (!existing) {
      throw new Error("Không tìm thấy watch");
    }

    await tx.product.update({
      where: { id: productId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.sku !== undefined ? { sku: input.sku } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.brandId !== undefined ? { brandId: input.brandId } : {}),
        ...(input.vendorId !== undefined ? { vendorId: input.vendorId } : {}),
        ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
        ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle } : {}),
        ...(input.seoDescription !== undefined
          ? { seoDescription: input.seoDescription }
          : {}),
        ...(input.primaryImageUrl !== undefined
          ? { primaryImageUrl: input.primaryImageUrl }
          : {}),
        ...(input.storefrontImageKey !== undefined
          ? { storefrontImageKey: input.storefrontImageKey }
          : {}),
      },
    });

    const watch = await tx.watch.update({
      where: { productId },
      data: {
        ...(input.gender !== undefined ? { gender: input.gender } : {}),
        ...(input.siteChannel !== undefined
          ? { siteChannel: input.siteChannel }
          : {}),
        ...(input.stockState !== undefined ? { stockState: input.stockState } : {}),
        ...(input.saleState !== undefined ? { saleState: input.saleState } : {}),
        ...(input.serviceState !== undefined
          ? { serviceState: input.serviceState }
          : {}),
        ...(input.conditionGrade !== undefined
          ? { conditionGrade: input.conditionGrade }
          : {}),
        ...(input.movementType !== undefined
          ? { movementType: input.movementType }
          : {}),
        ...(input.movementCalibre !== undefined
          ? { movementCalibre: input.movementCalibre }
          : {}),
        ...(input.serialNumber !== undefined
          ? { serialNumber: input.serialNumber }
          : {}),
        ...(input.yearText !== undefined ? { yearText: input.yearText } : {}),
        ...(input.hasBox !== undefined ? { hasBox: input.hasBox } : {}),
        ...(input.hasPapers !== undefined ? { hasPapers: input.hasPapers } : {}),
        ...(input.attachedStrapId !== undefined
          ? { attachedStrapId: input.attachedStrapId }
          : {}),
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
      },
      include: {
        product: true,
        watchSpecV2: true,
        watchPrice: true,
        watchContent: true,
      },
    });

    return watch;
  });
}

export async function removeWatchRepo(db: DB, productId: string) {
  const client = dbOrTx(db);

  return client.product.delete({
    where: { id: productId },
  });
}