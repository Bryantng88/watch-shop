import { prisma } from "@/server/db/client";
import type {
  BuyBackFromWatchInput,
  ConsignWatchInput,
  QuickOrderWatchInput,
} from "../shared";
import { getWatchBridgeRow } from "./watch-bridge.repo";
import { markWatchConsignedTo, markWatchReady, markWatchServicePending } from "../state";

// Giữ tạm bridge sang service cũ để không gãy hệ thống
import * as orderService from "@/domains/order/server";
import * as acquisitionService from "@/domains/acquisition/server";
import * as serviceRequestService from "@/app/(admin)/admin/services/_server/service_request.service";

function normalizeStatus(value: unknown) {
  return String(value ?? "")
    .trim()
    .toUpperCase();
}

export async function quickOrderWatch(input: QuickOrderWatchInput) {
  return prisma.$transaction(async (tx) => {
    const watch = await getWatchBridgeRow(tx as any, input.productId);

    if (!watch) {
      throw new Error("Không tìm thấy watch");
    }

    const productStatus = normalizeStatus(watch.product.status);
    const saleState = normalizeStatus(watch.saleStage);

    if (productStatus === "SOLD" || saleState === "SOLD") {
      throw new Error("Watch đã SOLD, không thể tạo quick order");
    }

    if (productStatus === "CONSIGNED_TO" || saleState === "CONSIGNED_TO") {
      throw new Error("Watch đang consign đi, không thể tạo quick order");
    }

    const order = await orderService.createQuickOrderFromProduct({
      productId: input.productId,
      customerName: input.customerName,
      customerId: input.customerId ?? null,
      listPrice: input.listPrice ?? null,
      unitPriceAgreed: input.unitPriceAgreed ?? null,
      notes: input.notes ?? null,
    });

    return order;
  });
}

export async function buyBackFromWatch(input: BuyBackFromWatchInput) {
  const watch = await getWatchBridgeRow(prisma as any, input.productId);

  if (!watch) {
    throw new Error("Không tìm thấy watch");
  }

  const result = await acquisitionService.createBuyBackFromProduct({
    productId: input.productId,
    unitCost: Number(input.unitCost ?? 0),
    notes: input.notes ?? null,
    customerId: input.customerId ?? null,
    needService: Boolean(input.needService),
  });

  if (input.needService) {
    await markWatchServicePending(input.productId);
  } else {
    await markWatchReady(input.productId);
  }

  if (input.needService) {
    await serviceRequestService.ensurePriorityTechnicalCheckForBuyBack({
      productId: input.productId,
      reason: "Buy back cần kiểm tra lại",
      source: "BUY_BACK",
    });
  }

  return result;
}

export async function consignWatch(input: ConsignWatchInput) {
  const watch = await getWatchBridgeRow(prisma as any, input.productId);

  if (!watch) {
    throw new Error("Không tìm thấy watch");
  }

  const productStatus = normalizeStatus(watch.product.status);
  const saleState = normalizeStatus(watch.saleStage);

  if (productStatus === "SOLD" || saleState === "SOLD") {
    throw new Error("Watch đã SOLD, không thể consign");
  }

  const result = await acquisitionService.createConsignToFromProduct({
    productId: input.productId,
    vendorId: input.vendorId,
    notes: input.notes ?? null,
  });

  await markWatchConsignedTo(input.productId);

  return result;
}