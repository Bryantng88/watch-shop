import { prisma, type DB } from "@/server/db/client";
import {
  ProductStatus,
  ServiceRequestStatus,
  ServiceScope,
  ServiceType,
} from "@prisma/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";
import * as repo from "../server/repository/service-request.repo";
import { canMoveProductToService } from "../server/shared/service-request.rules";

export type CreateTechnicalChecksFromProductsInput = {
  productIds: string[];
  scope: ServiceScope;
  notes?: string | null;
};

async function markProductInServiceIfNeeded(tx: DB, productId?: string | null) {
  if (!productId) return;

  const product = await tx.product.findUnique({
    where: { id: productId },
    select: { id: true, status: true },
  });

  if (!product) return;

  if (canMoveProductToService(product.status as ProductStatus)) {
    await tx.product.update({
      where: { id: product.id },
      data: { status: ProductStatus.IN_SERVICE },
    });
  }
}

export async function createTechnicalChecksFromProductsApplication(
  input: CreateTechnicalChecksFromProductsInput,
) {
  const ids = Array.from(
    new Set((input.productIds ?? []).map((x) => String(x).trim()).filter(Boolean)),
  );

  if (!ids.length) throw new Error("Missing productIds");

  return prisma.$transaction(
    async (tx) => {
      const created: any[] = [];
      const technician = await repo.findDefaultTechnician(tx);

      for (const productId of ids) {
        const product = await repo.findProductForService(tx, productId);
        if (!product) continue;

        const variant = product.productVariant?.[0] ?? null;

        const primaryImageUrlSnapshot =
          product.primaryImageUrl ??
          product.productImage?.[0]?.fileKey ??
          null;

        const refNo = await genRefNo(tx as any, {
          model: (tx as any).serviceRequest,
          prefix: "SR",
          field: "refNo",
          padding: 6,
        });

        const request = await repo.createTechnicalCheckRequest(tx, {
          refNo,
          productId,
          variantId: variant?.id ?? null,

          skuSnapshot: variant?.sku ?? null,
          primaryImageUrlSnapshot,

          notes: input.notes ?? "Tạo service request từ trang sản phẩm",
          billable: false,
          type: ServiceType.PAID,
          scope: input.scope,
          status: ServiceRequestStatus.DRAFT,

          brandSnapshot: product.brand?.name ?? null,
          modelSnapshot: product.watchSpec?.model ?? product.title ?? null,
          refSnapshot: product.watchSpec?.ref ?? null,

          technicianId: technician?.id ?? null,
          technicianNameSnap: technician?.name?.trim() || technician?.email || null,
        });

        await markProductInServiceIfNeeded(tx, productId);
        created.push(request);
      }

      return created;
    },
    { maxWait: 10000, timeout: 30000 },
  );
}

export async function createTechnicalCheckFromAcquisitionApplication(
  tx: DB,
  input: {
    productId: string;
    variantId?: string | null;
    skuSnapshot?: string | null;
    primaryImageUrlSnapshot?: string | null;
    notes?: string | null;
  },
) {
  const technician = await repo.findDefaultTechnician(tx);

  const refNo = await genRefNo(tx as any, {
    model: (tx as any).serviceRequest,
    prefix: "SR",
    field: "refNo",
    padding: 6,
  });

  const request = await repo.createTechnicalCheckRequest(tx, {
    refNo,
    productId: input.productId,
    variantId: input.variantId ?? null,
    skuSnapshot: input.skuSnapshot ?? null,
    primaryImageUrlSnapshot: input.primaryImageUrlSnapshot ?? null,
    notes: input.notes ?? null,
    technicianId: technician?.id ?? null,
    technicianNameSnap: technician?.name?.trim() || technician?.email || null,
  });

  await repo.markProductInService(tx, input.productId);

  return request;
}