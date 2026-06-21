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


const BLOCKED_ORDER_PRODUCT_STATUSES = ["HOLD", "SOLD"] as const;
const BLOCKED_ORDER_WATCH_SALE_STAGES = ["HOLD", "SOLD"] as const;

const ORDERABLE_PRODUCT_WHERE = {
  status: { notIn: BLOCKED_ORDER_PRODUCT_STATUSES as any },
  OR: [
    { watch: null },
    {
      watch: {
        is: {
          saleStage: { notIn: BLOCKED_ORDER_WATCH_SALE_STAGES as any },
        },
      },
    },
  ],
};

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
          saleStage: true,
          stockStage: true,
          serviceStage: true,
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

  const productStatus = String(product.status ?? "").toUpperCase();
  const watchSaleStage = String(product.watch?.saleStage ?? "").toUpperCase();

  if (watchSaleStage === "SOLD" || productStatus === "SOLD") {
    return null;
  }
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
    watchSaleState: product.watch?.saleStage ?? null,
    watchStockState: product.watch?.stockStage ?? null,
    watchServiceState: product.watch?.serviceStage ?? null,
    source: "WATCH_QUICK_ORDER" as const,
  };
}
// order/server/catalog/order-catalog.service.ts
// thêm vào cuối file hiện tại

export async function searchOrderCustomers(query: string) {
  const q = String(query ?? "").trim();

  if (q.length < 3) return [];

  const rows = await prisma.customer.findMany({
    where: {
      OR: [
        { phone: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 8,
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      city: true,
      district: true,
      ward: true,
    },
  });

  return rows;
}

export async function searchOrderProducts(query: string) {
  const q = String(query ?? "").trim();

  if (q.length < 2) return [];

  const rows = await prisma.product.findMany({
    where: {
      AND: [
        ORDERABLE_PRODUCT_WHERE,
        {
          OR: [
            { sku: { contains: q, mode: "insensitive" } },
            { title: { contains: q, mode: "insensitive" } },
            {
              productVariant: {
                some: {
                  sku: { contains: q, mode: "insensitive" },
                },
              },
            },
          ],
        },
      ],
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 12,
    select: {
      id: true,
      title: true,
      sku: true,
      status: true,
      primaryImageUrl: true,
      storefrontImageKey: true,
      productImage: {
        where: { role: "INLINE" as any },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { fileKey: true },
        take: 1,
      },
      productVariant: {
        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          sku: true,
          availabilityStatus: true,
          salePrice: true,
          price: true,
          listPrice: true,
        },
      },
      watch: {
        select: {
          saleStage: true,
          stockStage: true,
          serviceStage: true,
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

  return rows.map((product) => {
    const variant =
      product.productVariant.find(
        (item) =>
          String(item.availabilityStatus ?? "").toUpperCase() === "ACTIVE",
      ) ??
      product.productVariant[0] ??
      null;

    const imageKey =
      product.productImage[0]?.fileKey ??
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
      watchSaleState: product.watch?.saleStage ?? null,
      watchStockState: product.watch?.stockStage ?? null,
      watchServiceState: product.watch?.serviceStage ?? null,
      source: "STANDARD" as const,
    };
  });
}