import { OrderFlowType, OrderSource, OrderStatus, OrderVerificationStatus, PaymentMethod, Prisma, PurchaseRequestItemDecision, PurchaseRequestOutcome, PurchaseRequestStatus, ReserveType } from "@prisma/client";
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
import { publishOrderMutation } from "../events";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { publishShipmentMutation } from "@/domains/shipment/server/events";
import { publishPaymentMutations } from "@/domains/payment/server";
import { emitAcquisitionBusinessEvent } from "@/domains/acquisition/server";

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
      previousProductStatus: product.status ?? null,
      previousWatchSaleStage: product.watch?.saleStage ?? null,
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
    purchaseRequestId: raw.purchaseRequestId ?? null,
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
    publicRequest: raw.publicRequest ?? null,
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
    tradeIn: raw.tradeIn
      ? {
        productId: norm(raw.tradeIn.productId),
        title: norm(raw.tradeIn.title) || "Đồng hồ trade-in",
        amount: Number(raw.tradeIn.amount ?? 0),
        notes: norm(raw.tradeIn.notes) || null,
        audienceSegment: raw.tradeIn.audienceSegment === "WOMEN" ? "WOMEN" : "MEN",
      }
      : null,
  };
}

async function assertTradeInWatchBelongsToCustomer(
  tx: Prisma.TransactionClient,
  input: { productId?: string | null; customerId: string; excludeAcquisitionId?: string | null },
) {
  const productId = norm(input.productId);
  if (!productId) return;

  const soldItem = await tx.orderItem.findFirst({
    where: {
      productId,
      order: {
        customerId: input.customerId,
        status: { notIn: [OrderStatus.DRAFT, OrderStatus.CANCELLED] },
      },
      product: { watch: { saleStage: "SOLD" } },
    },
    select: { id: true },
  });
  if (!soldItem) {
    throw new Error("Watch trade-in không phải đồng hồ SOLD từng bán cho khách hàng này.");
  }

  const openAcquisition = await tx.acquisitionItem.findFirst({
    where: {
      productId,
      acquisition: {
        id: input.excludeAcquisitionId ? { not: input.excludeAcquisitionId } : undefined,
        accquisitionStt: "DRAFT",
        type: { in: ["TRADE_IN", "BUY_BACK"] },
      },
    },
    select: { acquisition: { select: { refNo: true, id: true } } },
  });
  if (openAcquisition) {
    throw new Error(`Watch đã có phiếu thu lại đang mở (${openAcquisition.acquisition.refNo ?? openAcquisition.acquisition.id}).`);
  }
}

export async function createOrderWithItems(
  raw: any,
  runtime?: BusinessEventDispatchOptions,
) {
  const input = normalizeCreateInput(raw);
  assertValidReserveBusiness(input);
  if (input.tradeIn && input.tradeIn.amount <= 0) {
    throw new Error("Giá thu vào của trade-in phải lớn hơn 0.");
  }
  if (!input.customerName) throw new Error("Thiếu tên khách hàng");
  if (!input.items.length) throw new Error("Phải có ít nhất 1 dòng sản phẩm / dịch vụ");

  const result = await prisma.$transaction(async (tx) => {
    const purchaseRequest = input.purchaseRequestId
      ? await tx.purchaseRequest.findUnique({ where: { id: input.purchaseRequestId }, include: { items: true } })
      : null;
    if (input.purchaseRequestId && !purchaseRequest) {
      throw new Error("Không tìm thấy yêu cầu mua hàng.");
    }
    if (purchaseRequest?.orderId) {
      const replay = await tx.order.findUniqueOrThrow({ where: { id: purchaseRequest.orderId } });
      return toPlain({ ...replay, idempotentReplay: true, inventoryOutcomes: [], tradeInAcquisitionId: null });
    }
    if (purchaseRequest && purchaseRequest.status !== PurchaseRequestStatus.PROCESSING) {
      throw new Error("Yêu cầu mua hàng phải ở bước đang xử lý trước khi lập đơn.");
    }
    if (purchaseRequest) {
      const orderProductIds = new Set(
        input.items
          .filter((item) => item.kind === "PRODUCT" && item.productId)
          .map((item) => item.productId!),
      );
      const selectedRequestItems = purchaseRequest.items.filter(
        (item) =>
          orderProductIds.has(item.productId) &&
          item.decision !== PurchaseRequestItemDecision.DECLINED &&
          item.decision !== PurchaseRequestItemDecision.UNAVAILABLE,
      );
      if (!selectedRequestItems.length) {
        throw new Error("Cần giữ lại ít nhất một Watch từ yêu cầu để lập đơn hàng.");
      }
    }
    if (purchaseRequest) {
      input.publicRequest = {
        key: purchaseRequest.requestKey,
        hash: purchaseRequest.requestHash,
        channel: purchaseRequest.channel as "STOREFRONT" | "ZALO",
        externalRequestId: purchaseRequest.externalRequestId,
        fingerprintHash: purchaseRequest.fingerprintHash,
        rateLimitSince: new Date(0),
        rateLimitMax: Number.MAX_SAFE_INTEGER,
      };
    }
    if (input.publicRequest) {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`public-order:${input.publicRequest.key}`}, 0))`;
      const replay = await tx.order.findUnique({
        where: { publicRequestKey: input.publicRequest.key },
        select: { id: true, refNo: true, status: true, publicRequestHash: true },
      });
      if (replay) {
        if (replay.publicRequestHash !== input.publicRequest.hash) {
          throw new Error("PUBLIC_ORDER_IDEMPOTENCY_CONFLICT");
        }
        if (purchaseRequest) {
          await tx.purchaseRequest.update({
            where: { id: purchaseRequest.id },
            data: {
              orderId: replay.id,
              status: PurchaseRequestStatus.COMPLETED,
              outcome: PurchaseRequestOutcome.CONVERTED,
              completedAt: new Date(),
              convertedAt: new Date(),
              completionReason: "Đã liên kết với đơn hàng được tạo từ yêu cầu mua hàng.",
            },
          });
          await tx.purchaseRequestActivity.create({
            data: { purchaseRequestId: purchaseRequest.id, type: "STATUS_CHANGED", note: "Đã liên kết với đơn hàng được tạo từ yêu cầu mua hàng." },
          });
        }
        return toPlain({ ...replay, idempotentReplay: true, inventoryOutcomes: [], tradeInAcquisitionId: null });
      }

      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`public-rate:${input.publicRequest.fingerprintHash}`}, 0))`;
      const recentRequestCount = await tx.order.count({
        where: {
          publicFingerprintHash: input.publicRequest.fingerprintHash,
          createdAt: { gte: input.publicRequest.rateLimitSince },
        },
      });
      if (recentRequestCount >= input.publicRequest.rateLimitMax) {
        throw new Error("PUBLIC_ORDER_RATE_LIMITED");
      }
    }

    const customerId = await resolveCustomer(tx, input);
    const strictActiveOnly = input.quickFlowType === "QUICK_ORDER" ? false : true;

    const rawProductItems = input.items
      .filter((item) => item.kind === "PRODUCT" && item.productId)
      .map((item) => ({
        productId: item.productId!,
        quantity: input.quickFlowType === "QUICK_ORDER" ? 1 : Number(item.quantity ?? 1),
      }));

    for (const productId of Array.from(new Set(rawProductItems.map((item) => item.productId))).sort()) {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`order-product:${productId}`}, 0))`;
    }

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
      publicRequestKey: input.publicRequest?.key ?? null,
      publicRequestHash: input.publicRequest?.hash ?? null,
      publicRequestChannel: input.publicRequest?.channel ?? null,
      publicExternalId: input.publicRequest?.externalRequestId ?? null,
      publicFingerprintHash: input.publicRequest?.fingerprintHash ?? null,
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
    let tradeInAcquisitionId: string | null = null;
    if (input.tradeIn) {
      if (!customerId) {
        throw new Error("Trade-in cần khách hàng có số điện thoại để tạo hồ sơ thu mua.");
      }

      await assertTradeInWatchBelongsToCustomer(tx, {
        productId: input.tradeIn.productId,
        customerId,
      });

      const sourceOrderItem = rows.find((row: any) => row.kind === "PRODUCT") ?? rows[0];
      const acquisition = await tx.acquisition.create({
        data: {
          vendorId: null,
          customerId,
          type: "TRADE_IN",
          acquiredAt: input.orderDate ? new Date(input.orderDate) : new Date(),
          currency: "VND",
          accquisitionStt: "DRAFT",
          totalAmount: new Prisma.Decimal(input.tradeIn.amount),
          notes: input.tradeIn.notes,
          audienceSegment: input.tradeIn.audienceSegment,
        },
        select: { id: true },
      });
      tradeInAcquisitionId = acquisition.id;

      await tx.acquisitionItem.create({
        data: {
          acquisitionId: acquisition.id,
          productId: input.tradeIn.productId ?? null,
          sourceOrderItemId: sourceOrderItem?.id ?? null,
          productTitle: input.tradeIn.title,
          audienceSegment: input.tradeIn.audienceSegment,
          quantity: 1,
          unitCost: new Prisma.Decimal(input.tradeIn.amount),
          productType: "WATCH",
          capitalizeToProduct: true,
          notes: input.tradeIn.notes,
        },
      });
    }
    const inventoryOutcomes = resolvedProducts
      .filter((product) => product.productType === "WATCH")
      .map((product) => ({
        productId: product.productId,
        fromProductStatus: product.previousProductStatus,
        toProductStatus: "HOLD" as const,
        fromSaleStage: product.previousWatchSaleStage,
        toSaleStage: "HOLD" as const,
      }));
    // A persisted DRAFT must HOLD its watches immediately. The create-and-post
    // path is reconciled by postOneOrderTx below in the same transaction, so
    // avoid running the identical inventory-cycle reconciliation twice.
    if (!shouldPostAfterCreate) {
      await syncWatchInventoryFromOrders(
        tx,
        resolvedProducts.map((product) => product.productId),
      );
    }
    if (purchaseRequest) {
      const orderProductItems = new Map(
        input.items
          .filter((item) => item.kind === "PRODUCT" && item.productId)
          .map((item) => [item.productId!, item]),
      );
      await Promise.all(purchaseRequest.items.map((requestItem) => {
        const orderItem = orderProductItems.get(requestItem.productId);
        if (requestItem.decision === PurchaseRequestItemDecision.DECLINED || requestItem.decision === PurchaseRequestItemDecision.UNAVAILABLE) {
          return Promise.resolve();
        }
        return tx.purchaseRequestItem.update({
          where: { id: requestItem.id },
          data: orderItem
            ? {
                decision: PurchaseRequestItemDecision.SELECTED,
                agreedPrice: new Prisma.Decimal(Number(orderItem.unitPriceAgreed ?? orderItem.listPrice)),
              }
            : { decision: PurchaseRequestItemDecision.DECLINED },
        });
      }));
      await tx.purchaseRequest.update({
        where: { id: purchaseRequest.id },
        data: {
          orderId: order.id,
          status: PurchaseRequestStatus.COMPLETED,
          outcome: PurchaseRequestOutcome.CONVERTED,
          completedAt: new Date(),
          convertedAt: new Date(),
          completionReason: "Đã xác minh nhu cầu và lập đơn hàng từ luồng xử lý.",
        },
      });
      await tx.purchaseRequestActivity.create({
        data: { purchaseRequestId: purchaseRequest.id, type: "STATUS_CHANGED", note: `Đã tạo đơn nháp ${refNo} từ yêu cầu mua hàng.` },
      });
    }
    if (shouldPostAfterCreate) {
      const posted = await postOneOrderTx(tx, order.id);
      return toPlain({ ...posted, inventoryOutcomes, tradeInAcquisitionId });
    }

    return toPlain({
      id: order.id,
      status: OrderStatus.DRAFT,
      refNo,
      inventoryOutcomes,
      tradeInAcquisitionId,
    });
  }, {
    // Creating and immediately posting an order performs inventory, payment,
    // shipment and service writes. The default 5s interactive-transaction
    // timeout can expire on a cold connection before the final payment write.
    maxWait: 10_000,
    timeout: 20_000,
  });
  if ("idempotentReplay" in result && result.idempotentReplay) return result;
  await publishOrderMutation({
    eventKey: result.status === OrderStatus.POSTED ? "order.posted" : "order.created",
    orderId: result.id,
    refNo: result.refNo,
    fromStatus: null,
    toStatus: String(result.status),
    source: "ORDER_CREATE",
  }, runtime);
  if (result.tradeInAcquisitionId) {
    await emitAcquisitionBusinessEvent(prisma, {
      eventKey: "acquisition.created",
      acquisitionId: result.tradeInAcquisitionId,
      payload: { source: "ORDER_TRADE_IN", orderId: result.id },
      deferConsumers: runtime?.deferConsumers,
    });
  }
  if ("shipment" in result && result.shipment) {
    await publishShipmentMutation({
      eventKey: "shipment.created",
      shipmentId: result.shipment.id,
      orderId: result.id,
      orderRefNo: result.refNo,
      shipmentRefNo: result.shipment.refNo,
      fromStatus: null,
      toStatus: String(result.shipment.status),
      carrier: result.shipment.carrier,
      trackingCode: result.shipment.trackingCode,
      note: result.shipment.notes,
      source: "ORDER_CREATE_AND_POST",
    }, runtime);
  }
  if ("initialPayments" in result && Array.isArray(result.initialPayments)) {
    await publishPaymentMutations(
      result.initialPayments.map((payment) => ({
        paymentId: payment.id,
        eventKey: "payment.created",
      })),
    );
  }
  return result;
}

export async function updateOrderDraft(orderId: string, input: OrderDraftInput) {
  assertValidReserveBusiness(input);

  const reserveType = normalizeReserveType(input.reserve?.type);
  const normalizedInput: OrderDraftInput = {
    ...input,
    tradeIn: input.tradeIn
      ? {
        productId: norm(input.tradeIn.productId),
        title: norm(input.tradeIn.title) || "Đồng hồ trade-in",
        amount: Number(input.tradeIn.amount ?? 0),
        notes: norm(input.tradeIn.notes) || null,
        audienceSegment: input.tradeIn.audienceSegment === "WOMEN" ? "WOMEN" : "MEN",
      }
      : null,
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

  const result = await prisma.$transaction(async (tx) => {
    await assertCanEditOrderDraftRepo(tx as any, orderId);

    const existingTradeIn = await tx.acquisition.findFirst({
      where: {
        type: "TRADE_IN",
        acquisitionItem: { some: { orderItem: { orderId } } },
      },
      orderBy: { createdAt: "desc" },
      include: {
        acquisitionItem: {
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    });

    if (existingTradeIn?.accquisitionStt === "DRAFT" && !normalizedInput.tradeIn) {
      await tx.acquisition.delete({ where: { id: existingTradeIn.id } });
    } else if (existingTradeIn) {
      await tx.acquisitionItem.updateMany({
        where: { acquisitionId: existingTradeIn.id },
        data: { sourceOrderItemId: null },
      });
    }

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

    const updatedOrder = await replaceOrderDraftRepo(tx as any, orderId, normalizedInput);

    let tradeInMutation: { id: string; eventKey: "acquisition.created" | "acquisition.updated" } | null = null;
    if (normalizedInput.tradeIn) {
      if (normalizedInput.tradeIn.amount <= 0) {
        throw new Error("Giá thu vào của trade-in phải lớn hơn 0.");
      }

      const customerId = await resolveCustomer(tx, normalizedInput as unknown as CreateOrderInput);
      if (!customerId) {
        throw new Error("Trade-in cần khách hàng có số điện thoại để tạo hồ sơ thu mua.");
      }
      await assertTradeInWatchBelongsToCustomer(tx, {
        productId: normalizedInput.tradeIn.productId,
        customerId,
        excludeAcquisitionId: existingTradeIn?.id,
      });
      await tx.order.update({ where: { id: orderId }, data: { customerId } });

      const sourceOrderItem = await tx.orderItem.findFirst({
        where: { orderId, kind: "PRODUCT" },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      }) ?? await tx.orderItem.findFirst({
        where: { orderId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });

      if (existingTradeIn) {
        if (existingTradeIn.accquisitionStt !== "DRAFT") {
          throw new Error("Phiếu trade-in đã được duyệt nên không thể sửa từ Order.");
        }
        await tx.acquisition.update({
          where: { id: existingTradeIn.id },
          data: {
            customerId,
            totalAmount: new Prisma.Decimal(normalizedInput.tradeIn.amount),
            notes: normalizedInput.tradeIn.notes,
            audienceSegment: normalizedInput.tradeIn.audienceSegment,
          },
        });
        const item = existingTradeIn.acquisitionItem[0];
        if (item) {
          await tx.acquisitionItem.update({
            where: { id: item.id },
            data: {
              sourceOrderItemId: sourceOrderItem?.id ?? null,
              productId: normalizedInput.tradeIn.productId ?? null,
              productTitle: normalizedInput.tradeIn.title,
              unitCost: new Prisma.Decimal(normalizedInput.tradeIn.amount),
              notes: normalizedInput.tradeIn.notes,
              audienceSegment: normalizedInput.tradeIn.audienceSegment,
            },
          });
        }
        tradeInMutation = { id: existingTradeIn.id, eventKey: "acquisition.updated" };
      } else {
        const acquisition = await tx.acquisition.create({
          data: {
            vendorId: null,
            customerId,
            type: "TRADE_IN",
            acquiredAt: new Date(),
            currency: "VND",
            accquisitionStt: "DRAFT",
            totalAmount: new Prisma.Decimal(normalizedInput.tradeIn.amount),
            notes: normalizedInput.tradeIn.notes,
            audienceSegment: normalizedInput.tradeIn.audienceSegment,
            acquisitionItem: {
              create: {
                sourceOrderItemId: sourceOrderItem?.id ?? null,
                productId: normalizedInput.tradeIn.productId ?? null,
                productTitle: normalizedInput.tradeIn.title,
                audienceSegment: normalizedInput.tradeIn.audienceSegment,
                quantity: 1,
                unitCost: new Prisma.Decimal(normalizedInput.tradeIn.amount),
                productType: "WATCH",
                capitalizeToProduct: true,
                notes: normalizedInput.tradeIn.notes,
              },
            },
          },
          select: { id: true },
        });
        tradeInMutation = { id: acquisition.id, eventKey: "acquisition.created" };
      }
    }

    await syncWatchInventoryFromOrders(tx, [
      ...beforeItems.map((item) => item.productId),
      ...normalizedInput.items.map((item) => item.productId),
    ]);

    return { ...updatedOrder, tradeInMutation };
  });
  await publishOrderMutation({
    eventKey: "order.updated",
    orderId,
    toStatus: "DRAFT",
    source: "ORDER_DRAFT_UPDATE",
  });
  if (result.tradeInMutation) {
    await emitAcquisitionBusinessEvent(prisma, {
      eventKey: result.tradeInMutation.eventKey,
      acquisitionId: result.tradeInMutation.id,
      payload: { source: "ORDER_TRADE_IN_EDIT", orderId },
    });
  }
  return result;
}
