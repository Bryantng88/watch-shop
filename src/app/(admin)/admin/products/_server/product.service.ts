import { prisma } from "@/server/db/client";
import {
  createWatchDraft,
  getAdminWatchList,
  getWatchServiceHistoryDetail,
} from "@/domains/watch/server";

function retired(operation: string): never {
  throw new Error(
    `${operation} belongs to the retired product workflow and must use the current watch operation contract.`,
  );
}

export async function searchProductService(query: string) {
  const q = String(query ?? "").trim();
  if (!q) return [];

  return prisma.product.findMany({
    where: {
      type: "WATCH",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      sku: true,
      primaryImageUrl: true,
      status: true,
    },
  });
}

export async function getProductServiceHistory(productId: string) {
  return getWatchServiceHistoryDetail(productId);
}

export async function bulkPostProducts(_productIds: string[]) {
  return retired("bulkPostProducts");
}

export async function autoBulkPostDraftProducts() {
  return retired("autoBulkPostDraftProducts");
}

export const adminProductService = {
  list(input: unknown) {
    return getAdminWatchList(input as Parameters<typeof getAdminWatchList>[0]);
  },
  async create(input: Record<string, unknown>) {
    if (input.type && input.type !== "WATCH") {
      return retired("adminProductService.create(non-watch)");
    }

    const created = await createWatchDraft({
      title: String(input.title ?? input.name ?? "Untitled watch"),
      brandId: typeof input.brandId === "string" ? input.brandId : null,
      vendorId: typeof input.vendorId === "string" ? input.vendorId : null,
      categoryId: typeof input.categoryId === "string" ? input.categoryId : null,
      sku: typeof input.sku === "string" ? input.sku : null,
    });

    return {
      ...created,
      productId: created.id,
      acquisitionId: null,
    };
  },
};
