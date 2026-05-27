import { OrderFlowType, OrderSource, OrderStatus, OrderVerificationStatus, PaymentMethod, Prisma, ReserveType } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";
import { assertCanEditOrderDraftRepo } from "../detail";
import type { CreateOrderInput, OrderDraftInput, OrderItemInput, ResolvedProductOrderItem } from "../shared";
import { assertPositiveQuantity, calcUnitPriceAgreed, norm, toNumberPrice, toPlain } from "../shared";
import {
  createCustomerRepo,
  createOrderItemsRepo,
  createOrderRepo,
  findCustomerByIdRepo,
  findCustomerByPhoneRepo,
  getActiveOrderLocksForProductsRepo,
  getOrderProductIdsRepo,
  getProductsForOrderResolutionRepo,
  replaceOrderDraftRepo,
  updateCustomerAddressRepo,
  updateOrderSubtotalRepo,
} from "./order-write.repo";
import { syncWatchInventoryFromOrders } from "../order-watch-sync.service";
import { postOneOrderTx } from "../post/order-post.service";
import { normalizeReserveType } from "../../shared/order-reserve-type";

async function resolveCustomer(tx: Prisma.TransactionClient, input: CreateOrderInput) {
  const shipPhone = norm(input.shipPhone);
  const address = {
    city: norm(input.shipCity),
    district: norm(input.shipDistrict),
    ward: norm(input.shipWard),
    address: norm(input.shipAddress),
  };

  if (input.customerId) {
    const existing = await findCustomerByIdRepo(tx as any, input.customerId);
    if (!existing) return null;
    await updateCustomerAddressRepo(tx as any, existing.id, address);
    return existing.id;
  }

  if (!shipPhone) return null;
  const existing = await findCustomerByPhoneRepo(tx as any, shipPhone);
  if (existing) {
    await updateCustomerAddressRepo(tx as any, existing.id, address);
    return existing.id;
  }

  const created = await createCustomerRepo(tx as any, {
    name: input.customerName,
    phone: shipPhone,
    ...address,
  });
  return created.id;
}

async function resolveProductItems(
  tx: Prisma.TransactionClient,
  items: Array<{ productId: string; quantity: number }>,
  opts?: { strictActiveOnly?: boolean; currentOrderId?: string | null },
): Promise<ResolvedProductOrderItem[]> {
  if (!items.length) return [];

  const strictActiveOnly = opts?.strictActiveOnly !== false;
  const qtyByProductId = new Map<string, number>();

  for (const item of items) {
    const productId = String(item.productId ?? "").trim();
    if (!productId) throw new Error("Thiếu productId");
    const qty = assertPositiveQuantity(productId, item.quantity);
    qtyByProductId.set(productId, (qtyByProductId.get(productId) ?? 0) + qty);
  }

  const productIds = Array.from(qtyByProductId.keys());
  const products = await getProductsForOrderResolutionRepo(tx as any, productIds);
  const productById = new Map(products.map((product) => [product.id, product]));
  const missing = productIds.filter((id) => !productById.has(id));
  if (missing.length) throw new Error(`Không tìm thấy sản phẩm: ${missing.join(", ")}`);

  await assertProductsCanBeOrdered(tx, {
    products,
    productIds,
    currentOrderId: opts?.currentOrderId ?? null,
  });

  return productIds.map((productId) => {
    const product = productById.get(productId)!;
    const variants = Array.isArray(product.productVariant) ? product.productVariant : [];

    const variant = strictActiveOnly
      ? variants.find((v) => String(v.availabilityStatus ?? "").toUpperCase() === "ACTIVE")
      : variants.find((v) =>
        ["ACTIVE", "HIDDEN", "RESERVED"].includes(String(v.availabilityStatus ?? "").toUpperCase()),
      ) ?? variants[0] ?? null;

    const qty = qtyByProductId.get(productId)!;

    if (variant?.stockQty != null && Number(variant.stockQty) > 0 && Number(variant.stockQty) < qty) {
      throw new Error(`Không đủ tồn kho cho productId=${productId}. Cần ${qty}, còn ${variant.stockQty}`);
    }

    const watchPrice = product.watch?.watchPrice;
    const listPrice = toNumberPrice(
      watchPrice?.salePrice ??
      watchPrice?.listPrice ??
      variant?.salePrice ??
      variant?.price ??
      variant?.listPrice ??
      0,
    );

    return {
      kind: "PRODUCT" as const,
      productId: product.id,
      variantId: variant?.id ?? null,
      title: product.title ?? "",
      quantity: qty,
      listPrice,
      primaryImageUrl: product.primaryImageUrl ?? product.storefrontImageKey ?? null,
      productType: product.type ?? null,
    };
  });
}

function normalizeReserve(rawReserve: any) {
  const type = normalizeReserveType(rawReserve?.type);
  const amount = Number(rawReserve?.amount ?? 0);

  if (type === ReserveType.NONE) {
    return {
      type,
      amount: 0,
      expiresAt: null,
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      type === ReserveType.COD
        ? "Đơn COD phải có tiền cọc."
        : "Đơn deposit phải có tiền cọc.",
    );
  }

  return {
    type,
    amount,
    expiresAt: rawReserve?.expiresAt ?? null,
  };
}

function normalizePaymentMethodForReserve(rawPaymentMethod: any, reserveType: ReserveType) {
  if (reserveType === ReserveType.COD) return PaymentMethod.COD;

  return rawPaymentMethod && rawPaymentMethod !== PaymentMethod.COD
    ? rawPaymentMethod
    : PaymentMethod.BANK_TRANSFER;
}

function assertValidReserveBusiness(input: {
  reserve?: { type?: ReserveType | string | null; amount?: number | null } | null;
  hasShipment?: boolean | null;
}) {
  const reserveType = normalizeReserveType(input.reserve?.type);
  const amount = Number(input.reserve?.amount ?? 0);

  if (reserveType === ReserveType.NONE) return;

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      reserveType === ReserveType.COD
        ? "Đơn COD phải có tiền cọc."
        : "Đơn deposit phải có tiền cọc.",
    );
  }

  if (reserveType === ReserveType.COD && !input.hasShipment) {
    throw new Error("Đơn COD bắt buộc phải có giao hàng.");
  }
}

function assertPositiveOrderSubtotal(subtotal: number) {
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    throw new Error("Không thể tạo đơn hàng có giá trị bằng 0. Vui lòng nhập giá chốt cho sản phẩm / dịch vụ.");
  }
}
function productLabel(product: any) {
  return product?.title ? `${product.title} (${product.id})` : String(product?.id ?? "");
}

async function assertProductsCanBeOrdered(
  tx: Prisma.TransactionClient,
  input: {
    products: any[];
    productIds: string[];
    currentOrderId?: string | null;
  },
) {
  const productIds = Array.from(
    new Set(input.productIds.map((id) => String(id ?? "").trim()).filter(Boolean)),
  );

  if (!productIds.length) return;

  const currentOrderProductIds = input.currentOrderId
    ? new Set(await getOrderProductIdsRepo(tx as any, input.currentOrderId))
    : new Set<string>();

  const activeLocks = await getActiveOrderLocksForProductsRepo(tx as any, {
    productIds,
    excludeOrderId: input.currentOrderId ?? null,
  });

  const activeLockByProductId = new Map(
    activeLocks
      .filter((lock) => lock.productId)
      .map((lock) => [lock.productId!, lock]),
  );

  for (const product of input.products) {
    if (!productIds.includes(product.id)) continue;

    const productStatus = String(product.status ?? "").toUpperCase();
    const saleStage = String(product.watch?.saleStage ?? "").toUpperCase();
    const isAlreadyInCurrentOrder = currentOrderProductIds.has(product.id);
    const activeLock = activeLockByProductId.get(product.id);

    if (activeLock) {
      const ref = activeLock.order?.refNo ?? activeLock.orderId;
      throw new Error(`Watch ${productLabel(product)} đã nằm trong đơn ${ref}, không thể tạo thêm đơn khác.`);
    }

    if (saleStage === "SOLD" || productStatus === "SOLD") {
      throw new Error(`Watch ${productLabel(product)} đã SOLD, không thể tạo đơn.`);
    }

    if ((saleStage === "HOLD" || productStatus === "HOLD") && !isAlreadyInCurrentOrder) {
      throw new Error(`Watch ${productLabel(product)} đang HOLD, không thể tạo đơn mới.`);
    }
  }
}

function normalizeCreateInput(raw: any): CreateOrderInput {
  const reserve = normalizeReserve(raw.reserve);
  const paymentMethod = normalizePaymentMethodForReserve(raw.paymentMethod, reserve.type);

  return {
    customerId: raw.customerId ?? null,
    customerName: norm(raw.customerName),
    shipPhone: raw.shipPhone ?? "",
    hasShipment: reserve.type === ReserveType.COD ? true : Boolean(raw.hasShipment),
    shipAddress: raw.shipAddress ?? "",
    shipCity: raw.shipCity ?? "",
    shipDistrict: raw.shipDistrict ?? null,
    shipWard: raw.shipWard ?? null,
    paymentMethod,
    notes: raw.notes ?? null,
    orderDate: raw.createdAt ?? raw.orderDate ?? new Date(),
    status: raw.status ?? OrderStatus.DRAFT,
    source: raw.source ?? OrderSource.ADMIN,
    verificationStatus: raw.verificationStatus ?? OrderVerificationStatus.VERIFIED,
    quickFromProductId: raw.quickFromProductId ?? null,
    quickFlowType: raw.quickFlowType ?? OrderFlowType.STANDARD,
    reserve,
    items: (raw.items ?? []).map((item: any) => ({
      id: item.id,
      kind: item.kind ?? "PRODUCT",
      productId: item.productId ?? null,
      variantId: item.variantId ?? null,
      title: item.title ?? "",
      quantity: item.source === "WATCH_QUICK_ORDER" || raw.quickFlowType === "QUICK_ORDER" ? 1 : Number(item.quantity ?? 1),
      listPrice: Number(item.listPrice ?? 0),
      unitPriceAgreed: item.unitPriceAgreed == null ? null : Number(item.unitPriceAgreed),
      img: item.img ?? null,
      serviceCatalogId: item.serviceCatalogId ?? null,
      serviceScope: item.serviceScope ?? null,
      linkedOrderItemId: item.linkedOrderItemId ?? null,
      customerItemNote: item.customerItemNote ?? null,
      taxRate: item.taxRate == null ? null : Number(item.taxRate),
      createdFromFlow: item.createdFromFlow ?? raw.quickFlowType ?? "STANDARD",
    })),
  };
}

export async function createOrderWithItems(raw: any) {
  const input = normalizeCreateInput(raw);
  assertValidReserveBusiness(input);
  if (!input.customerName) throw new Error("Thiếu tên khách hàng");
  if (!input.items.length) throw new Error("Phải có ít nhất 1 dòng sản phẩm / dịch vụ");

  return prisma.$transaction(async (tx) => {
    const customerId = await resolveCustomer(tx, input);
    const strictActiveOnly = input.quickFlowType === "QUICK_ORDER" ? false : true;

    const rawProductItems = input.items
      .filter((item) => item.kind === "PRODUCT" && item.productId)
      .map((item) => ({
        productId: item.productId!,
        quantity: input.quickFlowType === "QUICK_ORDER" ? 1 : Number(item.quantity ?? 1),
      }));

    const resolvedProducts = await resolveProductItems(tx, rawProductItems, { strictActiveOnly });

    const requestedStatus = input.status ?? OrderStatus.DRAFT;
    const shouldPostAfterCreate = requestedStatus === OrderStatus.POSTED;
    const refNo = await genRefNo(tx, {
      model: tx.order,
      prefix: "OD",
      field: "refNo",
      padding: 6,
    });

    const order = await createOrderRepo(tx as any, {
      refNo,
      customerId,
      customerName: input.customerName,
      shipPhone: input.shipPhone ?? "",
      shipAddress: input.shipAddress ?? "",
      shipCity: input.shipCity ?? "",
      shipWard: input.shipWard ?? null,
      shipDistrict: input.shipDistrict ?? null,
      paymentMethod: input.paymentMethod,
      hasShipment: input.hasShipment,
      notes: input.notes ?? null,
      createdAt: input.orderDate ? new Date(input.orderDate) : new Date(),
      updatedAt: new Date(),
      status: OrderStatus.DRAFT,
      source: input.source ?? OrderSource.ADMIN,
      verificationStatus: input.verificationStatus ?? OrderVerificationStatus.VERIFIED,
      subtotal: new Prisma.Decimal(0),
      reserveType: input.reserve?.type ?? ReserveType.NONE,
      depositRequired: new Prisma.Decimal(Number(input.reserve?.amount ?? 0)),
      reserveUntil: input.reserve?.expiresAt ? new Date(input.reserve.expiresAt) : null,
      quickFromProductId: input.quickFromProductId ?? null,
      quickFlowType: (input.quickFlowType ?? "STANDARD") as any,
    });

    const productItems: OrderItemInput[] = resolvedProducts.map((product) => {
      const matched = input.items.find((item) => item.kind === "PRODUCT" && item.productId === product.productId);
      const listPrice = Number(matched?.listPrice ?? 0) > 0 ? Number(matched?.listPrice) : product.listPrice;
      return {
        kind: "PRODUCT",
        productId: product.productId,
        variantId: product.variantId,
        title: product.title,
        img: product.primaryImageUrl ?? null,
        quantity: product.quantity,
        listPrice,
        unitPriceAgreed: calcUnitPriceAgreed({ listPrice, unitPriceAgreed: matched?.unitPriceAgreed }),
        createdFromFlow: matched?.createdFromFlow ?? input.quickFlowType ?? "STANDARD",
      };
    });

    const serviceItems = input.items.filter((item) => item.kind === "SERVICE");
    const discountItems = input.items.filter((item) => item.kind === "DISCOUNT");
    const rows = await createOrderItemsRepo(tx as any, order.id, [...productItems, ...serviceItems, ...discountItems]);
    const subtotal = rows.reduce((sum, row: any) => sum + Number(row.subtotal ?? 0), 0);
    assertPositiveOrderSubtotal(subtotal);

    await updateOrderSubtotalRepo(tx as any, order.id, subtotal);
    // Business mới: chỉ cần order được tạo, kể cả DRAFT, watch phải HOLD ngay.
    await syncWatchInventoryFromOrders(
      tx,
      resolvedProducts.map((product) => product.productId),
    );
    if (shouldPostAfterCreate) {
      const posted = await postOneOrderTx(tx, order.id);
      return toPlain(posted);
    }

    return toPlain({ id: order.id, status: OrderStatus.DRAFT, refNo });
  });
}

export async function updateOrderDraft(orderId: string, input: OrderDraftInput) {
  assertValidReserveBusiness(input);

  const reserveType = normalizeReserveType(input.reserve?.type);
  const normalizedInput: OrderDraftInput = {
    ...input,
    hasShipment: reserveType === ReserveType.COD ? true : input.hasShipment,
    paymentMethod:
      reserveType === ReserveType.COD
        ? PaymentMethod.COD
        : input.paymentMethod === PaymentMethod.COD
          ? PaymentMethod.BANK_TRANSFER
          : input.paymentMethod,
    reserve: {
      type: reserveType,
      amount: reserveType === ReserveType.NONE ? 0 : Number(input.reserve?.amount ?? 0),
      expiresAt: reserveType === ReserveType.NONE ? null : input.reserve?.expiresAt ?? null,
    },
  };

  return prisma.$transaction(async (tx) => {
    await assertCanEditOrderDraftRepo(tx as any, orderId);

    const beforeItems = await tx.orderItem.findMany({
      where: { orderId },
      select: { productId: true },
    });

    const productItems = normalizedInput.items
      .filter((item) => item.kind === "PRODUCT" && item.productId)
      .map((item) => ({
        productId: item.productId!,
        quantity: Number(item.quantity ?? 1),
      }));

    await resolveProductItems(tx, productItems, {
      strictActiveOnly: false,
      currentOrderId: orderId,
    });

    const result = await replaceOrderDraftRepo(tx as any, orderId, normalizedInput);

    await syncWatchInventoryFromOrders(tx, [
      ...beforeItems.map((item) => item.productId),
      ...normalizedInput.items.map((item) => item.productId),
    ]);

    return result;
  });
}
