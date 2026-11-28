import { createHash, randomUUID } from "node:crypto";
import {
  Prisma,
  ProductStatus,
  WatchSaleStage,
  WatchStockStage,
} from "@prisma/client";
import { prisma } from "@/server/db/client";
import { PERMISSIONS as P } from "@/constants/permissions";
import {
  ensureCurrentInventoryCycles,
  openInventoryCycleFromAcquisitionItem,
} from "@/domains/watch/server/inventory-lifecycle";
import { emitAcquisitionBusinessEvent } from "@/domains/acquisition/server/acquisition-business-event";
import { emitWatchCreatedEvent } from "@/domains/watch/server/events";
import { buildWatchCostLedgerProjectionRow } from "@/domains/projection/server/watch-cost-ledger.projection";
import { rebuildWatchListProjectionRows } from "@/domains/projection/server/watch-list/watch-list-projection.builder";
import { getPaymentSummaryTx } from "@/domains/payment/server/payment.core";
import {
  commandSchema,
  consignmentAmounts,
  createConsignmentSchema,
  metadataSchema,
  readConsignment,
  type ConsignmentMetadata,
} from "../shared/contract";
import {
  ConsignmentError,
  canReadConsignmentMoney,
  consignmentReadPermissions,
  requireConsignment,
  requireConsignmentMoney,
  type ConsignmentActor,
} from "./access";

type Tx = Prisma.TransactionClient;
const liveStatuses = ["DRAFT", "ACTIVE", "SOLD"];
const acquisitionInclude = {
  vendor: { select: { id: true, name: true } },
  acquisitionItem: {
    take: 1,
    include: {
      product: {
        select: {
          id: true,
          title: true,
          sku: true,
          primaryImageUrl: true,
          status: true,
          watch: { select: { id: true, saleStage: true, stockStage: true } },
        },
      },
    },
  },
} satisfies Prisma.AcquisitionInclude;
async function lockProduct(tx: Tx, id: string) {
  await tx.$queryRaw`SELECT "id" FROM "Product" WHERE "id"=${id} FOR UPDATE`;
}
async function ensureNoLive(tx: Tx, productId: string) {
  const existing = await tx.acquisition.findFirst({
    where: {
      type: "CONSIGNMENT",
      AND: [
        { consignment: { path: ["productId"], equals: productId } },
        {
          OR: liveStatuses.map((status) => ({
            consignment: { path: ["status"], equals: status },
          })),
        },
      ],
    },
    select: { id: true },
  });
  if (existing)
    throw new ConsignmentError(
      "Đồng hồ đã có một hồ sơ ký gửi đang xử lý.",
      409,
    );
}
async function refreshProjection(productId: string) {
  try {
    await Promise.all([
      rebuildWatchListProjectionRows(prisma, { productIds: [productId] }),
      buildWatchCostLedgerProjectionRow(prisma, productId),
    ]);
    return false;
  } catch {
    return true;
  }
}
export async function createConsignment(
  input: unknown,
  actor: ConsignmentActor,
) {
  requireConsignment(actor, [
    P.WATCH_ACQUISITION_CREATE,
    P.ACQUISITION_CREATE_ALL,
  ]);
  requireConsignmentMoney(actor);
  const value = createConsignmentSchema.parse(input);
  const checksum = createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
  const result = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`consignment:create:${value.requestId}`},0))`;
    const replay = await tx.acquisition.findFirst({
      where: {
        consignment: { path: ["receipt", "id"], equals: value.requestId },
      },
      select: { id: true, consignment: true },
    });
    if (replay) {
      const metadata = readConsignment(replay.consignment);
      if (
        metadata?.receipt?.actorId !== actor.id ||
        metadata.receipt.checksum !== checksum
      )
        throw new ConsignmentError(
          "Hồ sơ đã được tạo ở lần thử trước. Về danh sách để đối chiếu, không tạo lại.",
          409,
        );
      return { id: replay.id, productId: metadata.productId };
    }
    const vendor = await tx.vendor.findFirst({
      where: { id: value.vendorId, isActive: true },
      select: { id: true },
    });
    if (!vendor)
      throw new ConsignmentError(
        "Chọn người gửi / đối tác đang hoạt động trong Danh bạ.",
      );
    let productId = value.productId || "";
    if (value.direction === "OUT") {
      await lockProduct(tx, productId);
      await ensureNoLive(tx, productId);
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { watch: true },
      });
      if (!product?.watch || product.type !== "WATCH")
        throw new ConsignmentError("Không tìm thấy đồng hồ.");
      if (
        !["AVAILABLE", "IN_SERVICE"].includes(product.status) ||
        product.watch.stockStage !== "IN_STOCK" ||
        ["SOLD", "HOLD", "CONSIGNED_TO"].includes(product.watch.saleStage)
      )
        throw new ConsignmentError(
          "Chỉ lập gửi đối tác với đồng hồ còn trong kho, chưa bán/giữ/ký gửi.",
        );
    } else {
      const product = await tx.product.create({
        data: {
          title: value.title!,
          type: "WATCH",
          vendorId: vendor.id,
          status: "AVAILABLE",
          isStockManaged: false,
          priceVisibility: "HIDE",
          watch: { create: { stockStage: "OUT_OF_STOCK", saleStage: "DRAFT" } },
        },
        include: { watch: true },
      });
      productId = product.id;
    }
    const document: ConsignmentMetadata = {
      receipt: { id: value.requestId, actorId: actor.id, checksum },
      version: 1,
      direction: value.direction,
      status: "DRAFT",
      terms: value.terms,
      productId,
      soldAmount: null,
      orderId: null,
      saleReference: null,
      previous: null,
      history: [
        {
          action: "CREATE",
          at: new Date().toISOString(),
          actorId: actor.id,
          note: value.note,
        },
      ],
    };
    const product = await tx.product.findUniqueOrThrow({
      where: { id: productId },
      select: { title: true },
    });
    const acquisition = await tx.acquisition.create({
      data: {
        type: "CONSIGNMENT",
        vendorId: vendor.id,
        refNo: `KG-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`,
        acquiredAt: new Date(),
        currency: "VND",
        totalAmount: 0,
        notes: value.note,
        consignment: document as Prisma.InputJsonValue,
        acquisitionItem: {
          create: {
            productId,
            productType: "WATCH",
            productTitle: product.title,
            quantity: 1,
            unitCost: 0,
            currency: "VND",
            status: "DRAFT",
            kind: "PRODUCT",
            capitalizeToProduct: false,
          },
        },
      },
      select: { id: true },
    });
    if (value.direction === "IN")
      await tx.watch.update({
        where: { productId },
        data: { acquisitionId: acquisition.id },
      });
    await emitAcquisitionBusinessEvent(tx, {
      eventKey: "acquisition.created",
      acquisitionId: acquisition.id,
      actorUserId: actor.id,
      payload: { consignmentAction: "CREATE", productId },
    });
    return { id: acquisition.id, productId };
  });
  return {
    ...result,
    projectionPending: await refreshProjection(result.productId),
  };
}
export async function commandConsignment(
  input: unknown,
  actor: ConsignmentActor,
) {
  const value = commandSchema.parse(input);
  requireConsignment(
    actor,
    value.action === "CANCEL"
      ? [P.WATCH_ACQUISITION_DELETE, P.ACQUISITION_DELETE_ALL]
      : value.action === "TERMS"
        ? [P.WATCH_ACQUISITION_UPDATE, P.ACQUISITION_UPDATE_ALL]
        : [P.WATCH_ACQUISITION_APPROVE, P.ACQUISITION_APPROVE_ALL],
  );
  requireConsignmentMoney(actor);
  const seed = await prisma.acquisition.findUnique({
    where: { id: value.id },
    select: { consignment: true },
  });
  const initial = readConsignment(seed?.consignment);
  if (!initial)
    throw new ConsignmentError(
      "Hồ sơ ký gửi không hợp lệ hoặc là hồ sơ cũ chưa được đối chiếu.",
      404,
    );
  const result = await prisma.$transaction(
    async (tx) => {
      await lockProduct(tx, initial.productId);
      await tx.$queryRaw`SELECT "id" FROM "Acquisition" WHERE "id"=${value.id} FOR UPDATE`;
      const row = await tx.acquisition.findUniqueOrThrow({
        where: { id: value.id },
        include: acquisitionInclude,
      });
      const document = metadataSchema.parse(row.consignment);
      if (row.updatedAt.toISOString() !== value.expectedVersion)
        throw new ConsignmentError(
          "Hồ sơ vừa được thay đổi. Tải lại trước khi thao tác.",
          409,
        );
      const watch = await tx.watch.findUniqueOrThrow({
        where: { productId: document.productId },
        include: { product: true },
      });
      const data: Prisma.AcquisitionUpdateInput = {};
      switch (value.action) {
        case "TERMS":
          if (!["DRAFT", "ACTIVE"].includes(document.status) || !value.terms)
            throw new ConsignmentError(
              "Chỉ sửa thỏa thuận trước khi chốt bán.",
            );
          document.terms = value.terms;
          break;
        case "ACTIVATE": {
          if (document.status !== "DRAFT")
            throw new ConsignmentError("Chỉ xác nhận hồ sơ nháp.", 409);
          if (document.direction === "OUT") {
            if (
              !["AVAILABLE", "IN_SERVICE"].includes(watch.product.status) ||
              watch.stockStage !== "IN_STOCK" ||
              ["SOLD", "HOLD", "CONSIGNED_TO"].includes(watch.saleStage)
            )
              throw new ConsignmentError(
                "Đồng hồ không còn đủ điều kiện gửi đối tác.",
                409,
              );
            if (["PENDING", "IN_SERVICE"].includes(watch.serviceStage))
              throw new ConsignmentError(
                "Hoàn tất kỹ thuật trước khi gửi đối tác.",
              );
            document.previous = {
              productStatus: watch.product.status,
              saleStage: watch.saleStage,
              stockStage: watch.stockStage,
            };
            await ensureCurrentInventoryCycles(tx, [document.productId]);
            await tx.product.update({
              where: { id: document.productId },
              data: { status: "CONSIGNED_TO" },
            });
            await tx.watch.update({
              where: { id: watch.id },
              data: { saleStage: "CONSIGNED_TO", stockStage: "OUT_OF_STOCK" },
            });
          } else {
            if (
              watch.stockStage !== "OUT_OF_STOCK" ||
              watch.product.status !== "AVAILABLE"
            )
              throw new ConsignmentError(
                "Trạng thái đồng hồ nhận ký gửi đã thay đổi.",
                409,
              );
            const item = row.acquisitionItem[0];
            if (!item)
              throw new ConsignmentError("Thiếu dòng đồng hồ trong hồ sơ.");
            await openInventoryCycleFromAcquisitionItem(tx, {
              productId: document.productId,
              acquisitionItemId: item.id,
            });
            await tx.product.update({
              where: { id: document.productId },
              data: { status: "CONSIGNED_FROM", isStockManaged: true },
            });
            await tx.watch.update({
              where: { id: watch.id },
              data: { stockStage: "IN_STOCK" },
            });
            await emitWatchCreatedEvent(tx, {
              watch,
              acquisitionId: row.id,
              acquisitionItemId: item.id,
              actorUserId: actor.id,
            });
          }
          document.status = "ACTIVE";
          data.accquisitionStt = "POSTED";
          data.sentAt = new Date();
          await tx.acquisitionItem.updateMany({
            where: { acquisitionId: row.id },
            data: { status: "SENT" },
          });
          break;
        }
        case "RETURN":
          if (document.status !== "ACTIVE")
            throw new ConsignmentError(
              "Chỉ trả / nhận lại hồ sơ đang ký gửi, chưa chốt bán.",
              409,
            );
          if (
            watch.saleStage === "SOLD" ||
            watch.product.status === "SOLD" ||
            watch.stockStage === "RESERVED" ||
            watch.product.status === "HOLD"
          )
            throw new ConsignmentError(
              "Đồng hồ đã bán hoặc đang giữ cho đơn hàng. Xử lý đơn trước khi trả lại.",
              409,
            );
          if (document.direction === "OUT") {
            if (watch.saleStage !== "CONSIGNED_TO" || !document.previous)
              throw new ConsignmentError(
                "Trạng thái gửi đối tác không khớp.",
                409,
              );
            await tx.product.update({
              where: { id: document.productId },
              data: {
                status: document.previous.productStatus as ProductStatus,
              },
            });
            await tx.watch.update({
              where: { id: watch.id },
              data: {
                saleStage: document.previous.saleStage as WatchSaleStage,
                stockStage: document.previous.stockStage as WatchStockStage,
              },
            });
          } else {
            await tx.watch.update({
              where: { id: watch.id },
              data: { stockStage: "OUT_OF_STOCK", saleStage: "DRAFT" },
            });
            await tx.product.update({
              where: { id: document.productId },
              data: {
                publishedAt: null,
                status: "AVAILABLE",
                isStockManaged: false,
              },
            });
            if (watch.currentInventoryCycleId)
              await tx.watchInventoryCycle.update({
                where: { id: watch.currentInventoryCycleId },
                data: {
                  closedAt: new Date(),
                  closeReason: "CONSIGNMENT_RETURNED",
                },
              });
          }
          document.status = "RETURNED";
          data.returnedAt = new Date();
          break;
        case "SALE": {
          if (document.status !== "ACTIVE")
            throw new ConsignmentError("Chỉ chốt bán hồ sơ đang ký gửi.", 409);
          let amount = value.saleAmount;
          if (document.direction === "IN") {
            if (!value.orderId || watch.product.status !== "SOLD")
              throw new ConsignmentError(
                "Bán đồng hồ qua Đơn hàng trước, sau đó chọn đơn đã bán để chốt ký gửi.",
              );
            const item = await tx.orderItem.findFirst({
              where: {
                orderId: value.orderId,
                productId: document.productId,
                order: {
                  status: {
                    in: [
                      "POSTED",
                      "PAID",
                      "PROCESSING",
                      "SHIPPED",
                      "COMPLETED",
                    ],
                  },
                },
              },
              select: { subtotal: true, quantity: true, orderId: true },
            });
            if (!item || item.quantity !== 1)
              throw new ConsignmentError(
                "Đơn hàng không chứa đồng hồ này hoặc chưa đủ điều kiện.",
              );
            amount = Number(item.subtotal);
            document.orderId = item.orderId;
          } else {
            if (
              !value.saleReference?.trim() ||
              watch.saleStage !== "CONSIGNED_TO"
            )
              throw new ConsignmentError(
                "Nhập xác nhận bán từ đối tác; đồng hồ phải đang gửi đối tác.",
              );
            await tx.product.update({
              where: { id: document.productId },
              data: { status: "SOLD" },
            });
            await tx.watch.update({
              where: { id: watch.id },
              data: { saleStage: "SOLD", stockStage: "OUT_OF_STOCK" },
            });
            document.saleReference = value.saleReference;
          }
          if (!amount) throw new ConsignmentError("Thiếu giá bán.");
          let split;
          try {
            split = consignmentAmounts(amount, document.terms);
          } catch (failure) {
            throw new ConsignmentError(
              failure instanceof Error
                ? failure.message
                : "Giá bán không hợp lệ.",
            );
          }
          document.soldAmount = amount;
          document.status = "SOLD";
          data.totalAmount = split.net;
          break;
        }
        case "SETTLE": {
          if (document.status !== "SOLD")
            throw new ConsignmentError("Chỉ quyết toán sau khi chốt bán.");
          const summary = await getPaymentSummaryTx(tx, "ACQUISITION", row.id);
          if (
            summary.remaining > 0 ||
            summary.unpaidTotal > 0 ||
            summary.paidTotal !== summary.totalDue
          )
            throw new ConsignmentError(
              "Còn khoản thu/chi chưa hoàn tất. Mở Thanh toán để xử lý trước.",
            );
          document.status = "SETTLED";
          break;
        }
        case "CANCEL":
          if (document.status !== "DRAFT")
            throw new ConsignmentError(
              "Chỉ hủy hồ sơ nháp. Hồ sơ đã nhận/gửi cần dùng thao tác trả lại.",
            );
          document.status = "CANCELLED";
          data.accquisitionStt = "CANCELED";
          break;
      }
      document.history.push({
        action: value.action,
        at: new Date().toISOString(),
        actorId: actor.id,
        note: value.note,
      });
      await tx.acquisition.update({
        where: { id: row.id },
        data: {
          ...data,
          consignment: document as Prisma.InputJsonValue,
          updatedAt: new Date(
            Math.max(Date.now(), row.updatedAt.getTime() + 1),
          ),
        },
      });
      await emitAcquisitionBusinessEvent(tx, {
        eventKey: "acquisition.updated",
        acquisitionId: row.id,
        actorUserId: actor.id,
        payload: {
          consignmentAction: value.action,
          productId: document.productId,
        },
      });
      return { id: row.id, productId: document.productId };
    },
    { timeout: 30000 },
  );
  return {
    ...result,
    projectionPending: await refreshProjection(result.productId),
  };
}
export async function listConsignments(
  actor: ConsignmentActor,
  query: {
    direction?: string;
    status?: string;
    q?: string;
    page?: number;
    id?: string;
  } = {},
) {
  requireConsignment(actor, consignmentReadPermissions);
  const page = Math.max(1, query.page || 1),
    money = canReadConsignmentMoney(actor);
  const filters: Prisma.AcquisitionWhereInput[] = [
    { type: "CONSIGNMENT" },
    { consignment: { not: Prisma.DbNull } },
  ];
  if (query.id) filters.push({ id: query.id });
  if (query.direction && ["IN", "OUT"].includes(query.direction))
    filters.push({
      consignment: { path: ["direction"], equals: query.direction },
    });
  if (query.status)
    filters.push({ consignment: { path: ["status"], equals: query.status } });
  if (query.q?.trim())
    filters.push({
      OR: [
        { refNo: { contains: query.q.trim(), mode: "insensitive" } },
        { vendor: { name: { contains: query.q.trim(), mode: "insensitive" } } },
        {
          acquisitionItem: {
            some: {
              productTitle: { contains: query.q.trim(), mode: "insensitive" },
            },
          },
        },
      ],
    });
  const [rows, total] = await Promise.all([
    prisma.acquisition.findMany({
      where: { AND: filters },
      include: acquisitionInclude,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * 30,
      take: 30,
    }),
    prisma.acquisition.count({ where: { AND: filters } }),
  ]);
  const paid =
    money && rows.length
      ? await prisma.payment.groupBy({
          by: ["acquisition_id", "direction"],
          where: {
            acquisition_id: { in: rows.map((row) => row.id) },
            type: "ACQUISITION",
            status: "PAID",
          },
          _sum: { amount: true },
        })
      : [];
  const paidByOwner = new Map(
    paid.map((row) => [
      `${row.acquisition_id}:${row.direction}`,
      Number(row._sum.amount || 0),
    ]),
  );
  const items = rows.map((row) => {
    const document = readConsignment(row.consignment);
    if (!document) return null;
    const split = document.soldAmount
      ? consignmentAmounts(document.soldAmount, document.terms)
      : null;
    const remaining =
      money && split
        ? Math.max(
            0,
            split.net -
              (paidByOwner.get(
                `${row.id}:${document.direction === "IN" ? "OUT" : "IN"}`,
              ) || 0),
          )
        : null;
    const product = row.acquisitionItem[0]?.product;
    return {
      id: row.id,
      refNo: row.refNo,
      version: row.updatedAt.toISOString(),
      direction: document.direction,
      status: document.status,
      productId: document.productId,
      watchId: product?.watch?.id,
      title:
        product?.title || row.acquisitionItem[0]?.productTitle || "Đồng hồ",
      sku: product?.sku,
      imageUrl: product?.primaryImageUrl,
      vendorName: row.vendor?.name || "Chưa có đối tác",
      note: row.notes,
      terms: money ? document.terms : null,
      soldAmount: money ? document.soldAmount : null,
      fee: money ? split?.fee : null,
      net: money ? split?.net : null,
      remaining,
      history: document.history.map((entry) => ({
        action: entry.action,
        at: entry.at,
      })),
      orderId: document.orderId,
    };
  });
  return {
    items: items.filter((item) => item !== null),
    total,
    page,
    pageSize: 30,
    canReadMoney: money,
  };
}
