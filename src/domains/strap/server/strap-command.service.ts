import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import { emitStrapBusinessEvent } from "./events";

export async function requestStrapProcessing(input: {
  variantId: string;
  actorUserId: string;
  note?: string | null;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
}) {
  return runBusinessEventTransaction(async (tx, delivery) => {
    const variant = await tx.productVariant.findUnique({
      where: { id: input.variantId },
      select: {
        id: true,
        productId: true,
        Product: { select: { type: true, title: true } },
        StrapVariantSpec: { select: { id: true } },
      },
    });
    if (!variant || variant.Product.type !== "WATCH_STRAP" || !variant.StrapVariantSpec) {
      throw new Error("Không tìm thấy dây.");
    }

    const event = await emitStrapBusinessEvent(tx, {
      eventKey: "strap.intake.requested",
      variantId: variant.id,
      productId: variant.productId,
      actorUserId: input.actorUserId,
      payload: { title: variant.Product.title, note: input.note ?? null },
    });
    delivery.track(event);
    return { variantId: variant.id, projectionDeliveryKey: event.projectionDeliveryKey };
  }, { deferConsumers: input.deferConsumers });
}

export async function adjustStrapStock(input: {
  variantId: string;
  quantityDelta: number;
  actorUserId?: string | null;
  note?: string | null;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
}) {
  const delta = Math.trunc(Number(input.quantityDelta));
  if (!Number.isFinite(delta) || delta === 0) throw new Error("Số lượng điều chỉnh không hợp lệ.");
  return runBusinessEventTransaction(async (tx, delivery) => {
    const variant = await tx.productVariant.findUnique({
      where: { id: input.variantId },
      select: { id: true, productId: true, stockQty: true, Product: { select: { type: true } }, StrapVariantSpec: true },
    });
    if (!variant || variant.Product.type !== "WATCH_STRAP" || !variant.StrapVariantSpec) throw new Error("Không tìm thấy biến thể dây.");
    if (variant.StrapVariantSpec.inventoryPolicy !== "STOCKED") throw new Error("Chỉ dây STOCKED mới điều chỉnh tồn kho.");
    const balance = variant.stockQty + delta;
    if (balance < 0) throw new Error("Tồn kho không đủ.");
    await tx.productVariant.update({ where: { id: variant.id }, data: { stockQty: balance, updatedAt: new Date() } });
    await tx.strapInventoryMovement.create({ data: {
      strapVariantId: variant.id,
      movementType: "ADJUST",
      quantity: delta,
      balanceAfter: balance,
      actorUserId: input.actorUserId ?? null,
      note: input.note ?? null,
    } });
    delivery.track(await emitStrapBusinessEvent(tx, {
      eventKey: "strap.stock.adjusted",
      variantId: variant.id,
      productId: variant.productId,
      actorUserId: input.actorUserId,
      payload: { quantity: delta, balanceAfter: balance, note: input.note ?? null },
    }));
    return { variantId: variant.id, stockQty: balance };
  }, { deferConsumers: input.deferConsumers });
}

export async function installStrapOnWatch(input: {
  variantId: string;
  watchId: string;
  ownershipMode: "SHOP_INVENTORY" | "WATCH_ATTACHED" | "CUSTOMER_OWNED";
  actorUserId?: string | null;
  sourceOrderId?: string | null;
  serviceRequestId?: string | null;
  installedFullLinks?: number | null;
  installedHalfLinks?: number | null;
  spareFullLinks?: number | null;
  spareHalfLinks?: number | null;
  endLinkCount?: number | null;
  wristSizeMM?: number | null;
  note?: string | null;
  deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
}) {
  return runBusinessEventTransaction(async (tx, delivery) => {
    const [variant, watch] = await Promise.all([
      tx.productVariant.findUnique({ where: { id: input.variantId }, select: { id: true, productId: true, stockQty: true, Product: { select: { type: true } }, StrapVariantSpec: true } }),
      tx.watch.findUnique({ where: { id: input.watchId }, select: { id: true, productId: true, watchSpecV2: { select: { lugWidthMM: true } } } }),
    ]);
    if (!variant || variant.Product.type !== "WATCH_STRAP" || !variant.StrapVariantSpec) throw new Error("Không tìm thấy dây.");
    if (!watch) throw new Error("Không tìm thấy Watch.");
    const watchLug = watch.watchSpecV2?.lugWidthMM == null ? null : Number(watch.watchSpecV2.lugWidthMM);
    if (watchLug != null && watchLug !== variant.StrapVariantSpec.lugWidthMM) throw new Error(`Dây ${variant.StrapVariantSpec.lugWidthMM} mm không khớp lug Watch ${watchLug} mm.`);

    const previous = await tx.watchStrapInstallation.findFirst({ where: { watchId: watch.id, removedAt: null } });
    if (previous) {
      await tx.watchStrapInstallation.update({ where: { id: previous.id }, data: { removedAt: new Date(), removedByUserId: input.actorUserId ?? null } });
    }
    const isStocked = variant.StrapVariantSpec.inventoryPolicy === "STOCKED";
    if (isStocked && variant.stockQty <= 0) throw new Error("Dây đã hết tồn kho.");
    const balance = isStocked ? variant.stockQty - 1 : variant.stockQty;
    if (isStocked) await tx.productVariant.update({ where: { id: variant.id }, data: { stockQty: balance, updatedAt: new Date() } });
    const installation = await tx.watchStrapInstallation.create({ data: {
      watchId: watch.id,
      strapVariantId: variant.id,
      ownershipMode: input.ownershipMode,
      installedFullLinks: input.installedFullLinks,
      installedHalfLinks: input.installedHalfLinks,
      spareFullLinks: input.spareFullLinks,
      spareHalfLinks: input.spareHalfLinks,
      endLinkCount: input.endLinkCount,
      wristSizeMM: input.wristSizeMM,
      installedByUserId: input.actorUserId ?? null,
      sourceOrderId: input.sourceOrderId ?? null,
      serviceRequestId: input.serviceRequestId ?? null,
      note: input.note ?? null,
    } });
    if (isStocked) await tx.strapInventoryMovement.create({ data: {
      strapVariantId: variant.id,
      movementType: "INSTALL",
      quantity: -1,
      balanceAfter: balance,
      watchId: watch.id,
      orderId: input.sourceOrderId ?? null,
      serviceRequestId: input.serviceRequestId ?? null,
      actorUserId: input.actorUserId ?? null,
      note: input.note ?? null,
    } });
    delivery.track(await emitStrapBusinessEvent(tx, {
      eventKey: "strap.installed",
      variantId: variant.id,
      productId: variant.productId,
      actorUserId: input.actorUserId,
      payload: { watchId: watch.id, watchProductId: watch.productId, installationId: installation.id, orderId: input.sourceOrderId ?? null },
    }));
    return installation;
  }, { deferConsumers: input.deferConsumers });
}
