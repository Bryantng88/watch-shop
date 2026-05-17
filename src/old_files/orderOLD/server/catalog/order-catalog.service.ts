import { prisma } from "@/server/db/client";
import { toNumberPrice } from "../shared";

function buildMediaUrl(fileKey?: string | null) {
  const key = String(fileKey ?? "").trim();

  if (!key) return null;

  if (
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.startsWith("/")
  ) {
    return key;
  }

  return `/api/media/sign?key=${encodeURIComponent(key)}`;
}

export async function getServiceCatalogOptions(opts?: { isActive?: boolean }) {
  const rows = await prisma.serviceCatalog.findMany({
    where:
      typeof opts?.isActive === "boolean"
        ? { isActive: opts.isActive }
        : { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      code: true,
      name: true,
      defaultPrice: true,
      isActive: true,
    },
  });

  return rows.map((item) => ({
    id: item.id,
    code: item.code ?? null,
    name: item.name,
    defaultPrice:
      item.defaultPrice == null ? null : toNumberPrice(item.defaultPrice),
    isActive: item.isActive,
  }));
}

export async function getQuickOrderProductForOrderForm(productId: string) {
  const id = String(productId ?? "").trim();

  if (!id) return null;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      sku: true,
      status: true,
      primaryImageUrl: true,
      storefrontImageKey: true,
      productImage: {
        where: {
          role: "INLINE" as any,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          fileKey: true,
          role: true,
          sortOrder: true,
        },
        take: 1,
      },
      productVariant: {
        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          sku: true,
          name: true,
          availabilityStatus: true,
          salePrice: true,
          price: true,
          listPrice: true,
        },
      },
      watch: {
        select: {
          id: true,
          saleState: true,
          stockState: true,
          serviceState: true,
          watchPrice: {
            select: {
              salePrice: true,
              listPrice: true,
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  const variant =
    product.productVariant.find(
      (item) =>
        String(item.availabilityStatus ?? "").toUpperCase() === "ACTIVE",
    ) ??
    product.productVariant.find((item) =>
      ["ACTIVE", "HIDDEN", "RESERVED"].includes(
        String(item.availabilityStatus ?? "").toUpperCase(),
      ),
    ) ??
    product.productVariant[0] ??
    null;

  const inlineImage = product.productImage[0] ?? null;
  const imageKey =
    inlineImage?.fileKey ??
    product.storefrontImageKey ??
    product.primaryImageUrl ??
    null;

  const watchSalePrice = product.watch?.watchPrice?.salePrice ?? null;
  const watchListPrice = product.watch?.watchPrice?.listPrice ?? null;

  const price = toNumberPrice(
    watchSalePrice ??
    watchListPrice ??
    variant?.salePrice ??
    variant?.price ??
    variant?.listPrice ??
    0,
  );

  const listPrice = toNumberPrice(
    watchListPrice ??
    watchSalePrice ??
    variant?.listPrice ??
    variant?.price ??
    variant?.salePrice ??
    price,
  );

  return {
    id: product.id,
    title: product.title ?? "Sản phẩm",
    sku: product.sku ?? variant?.sku ?? null,
    price,
    listPrice,
    primaryImageUrl: buildMediaUrl(imageKey),
    imageKey,
    variantId: variant?.id ?? null,
    availabilityStatus: variant?.availabilityStatus ?? null,
    productStatus: product.status ?? null,
    watchSaleState: product.watch?.saleState ?? null,
    watchStockState: product.watch?.stockState ?? null,
    watchServiceState: product.watch?.serviceState ?? null,
    source: "WATCH_QUICK_ORDER" as const,
  };
}
