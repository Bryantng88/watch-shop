import { prisma } from "@/server/db/client";
import type {
  BuyBackFromWatchInput,
  ConsignWatchInput,
  QuickOrderWatchInput,
} from "../shared";
import { getWatchBridgeRow } from "./watch-bridge.repo";
import { markWatchConsignedTo } from "../state";

// Giữ tạm bridge sang service cũ để không gãy hệ thống
import * as orderService from "@/domains/order/server";
import * as acquisitionService from "@/domains/acquisition/server";

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

  const productStatus = normalizeStatus(watch.product.status);
  const saleState = normalizeStatus(watch.saleStage);

  if (productStatus !== "SOLD" && saleState !== "SOLD") {
    throw new Error("Chỉ watch SOLD mới được buy back");
  }

  // Quan trọng: chỉ tạo Acquisition BUY_BACK dạng DRAFT.
  // Không đổi trạng thái watch ở đây, vì user có thể tạo draft rồi bỏ đó.
  // Watch chỉ được trả về kho khi phiếu BUY_BACK được POST.
  return acquisitionService.createBuyBackFromProduct({
    productId: input.productId,
    unitCost: Number(input.unitCost ?? 0),
    notes: input.notes ?? null,
    customerId: input.customerId ?? null,
    needService: Boolean(input.needService),
  });
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
