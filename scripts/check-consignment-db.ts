import { syncWatchInventoryFromOrders } from "../src/domains/order/server/order-watch-sync.service";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/server/db/client";
import {
  createConsignment,
  commandConsignment,
  listConsignments,
} from "../src/domains/consignment/server/service";
import { readConsignment } from "../src/domains/consignment/shared/contract";
import {
  completePayment,
  createPayment,
  getPaymentOwnerSeedTx,
} from "../src/domains/payment/server/payment.core";
import { buildWatchCostLedgerProjectionRow } from "../src/domains/projection/server/watch-cost-ledger.projection";
import { transitionWatchState } from "../src/domains/watch/server/state/watch-state.service";

async function main() {
  const url = new URL(process.env.DATABASE_URL || "");
  assert.ok(
    ["localhost", "127.0.0.1", "postgres"].includes(url.hostname) &&
      url.pathname === "/watch_shop_consignment_test",
    "Only the isolated consignment test database is allowed",
  );
  const actor = await prisma.user.create({
    data: {
      email: `consignment-${randomUUID()}@example.invalid`,
      name: "Consignment fixture",
    },
  });
  const auth = {
    id: actor.id,
    name: actor.name,
    roles: ["ADMIN"],
    permissions: [],
  };
  const vendor = await prisma.vendor.create({
    data: { name: `Consignment vendor ${randomUUID()}` },
  });
  const command = async (
    id: string,
    action: string,
    extra: Record<string, unknown> = {},
  ) => {
    const row = await prisma.acquisition.findUniqueOrThrow({ where: { id } });
    return commandConsignment(
      { id, expectedVersion: row.updatedAt.toISOString(), action, ...extra },
      auth,
    );
  };
  const input = {
    requestId: randomUUID(),
    direction: "IN",
    title: "Consigned watch fixture",
    vendorId: vendor.id,
    terms: { mode: "PERCENT", value: 10 },
    note: "Synthetic only",
  };
  const incoming = await createConsignment(input, auth);
  const replay = await createConsignment(input, auth);
  assert.equal(replay.id, incoming.id);
  assert.equal(
    await prisma.product.count({ where: { id: incoming.productId } }),
    1,
  );
  await assert.rejects(
    createConsignment({ ...input, title: "Changed receipt" }, auth),
    /đã được tạo/,
  );
  await assert.rejects(
    transitionWatchState(incoming.productId, "MARK_READY"),
    /chưa được nhận/,
  );
  const draft = await prisma.acquisition.findUniqueOrThrow({
    where: { id: incoming.id },
  });
  await command(incoming.id, "ACTIVATE");
  await assert.rejects(
    commandConsignment(
      {
        id: incoming.id,
        expectedVersion: draft.updatedAt.toISOString(),
        action: "RETURN",
      },
      auth,
    ),
    /vừa được thay đổi/,
  );
  assert.equal(
    (
      await prisma.product.findUniqueOrThrow({
        where: { id: incoming.productId },
      })
    ).status,
    "CONSIGNED_FROM",
  );
  await prisma.watch.update({
    where: { productId: incoming.productId },
    data: {
      serviceStage: "NOT_REQUIRED",
      watchPrice: { create: { salePrice: 10000000 } },
    },
  });
  await transitionWatchState(incoming.productId, "MARK_READY");
  assert.equal(
    (
      await prisma.product.findUniqueOrThrow({
        where: { id: incoming.productId },
      })
    ).status,
    "CONSIGNED_FROM",
  );
  const incomingCost = await buildWatchCostLedgerProjectionRow(
    prisma,
    incoming.productId,
  );
  assert.equal(incomingCost.acquisitionAmount, 9000000);
  await assert.rejects(
    command(incoming.id, "SALE", { saleAmount: 10000000 }),
    /qua Đơn hàng/,
  );
  await assert.rejects(
    transitionWatchState(incoming.productId, "MARK_SOLD"),
    /qua Đơn hàng/,
  );
  const currentWatch = await prisma.watch.findUniqueOrThrow({
    where: { productId: incoming.productId },
  });
  const order = await prisma.order.create({
    data: {
      subtotal: 10000000,
      status: "POSTED",
      shipPhone: "0000000000",
      shipAddress: "Synthetic fixture",
      shipCity: "Synthetic",
      hasShipment: false,
      orderItem: {
        create: {
          productId: incoming.productId,
          inventoryCycleId: currentWatch.currentInventoryCycleId,
          productType: "WATCH",
          title: "Fixture sale",
          listPrice: 10000000,
          unitPriceAgreed: 10000000,
          subtotal: 10000000,
          quantity: 1,
          kind: "PRODUCT",
        },
      },
    },
  });
  await prisma.$transaction((tx) =>
    syncWatchInventoryFromOrders(tx, [incoming.productId]),
  );
  assert.equal(
    (
      await prisma.product.findUniqueOrThrow({
        where: { id: incoming.productId },
      })
    ).status,
    "HOLD",
  );
  await assert.rejects(
    command(incoming.id, "SALE", { orderId: order.id }),
    /qua Đơn hàng/,
  );
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "COMPLETED" },
  });
  await prisma.$transaction((tx) =>
    syncWatchInventoryFromOrders(tx, [incoming.productId]),
  );
  assert.equal(
    (
      await prisma.product.findUniqueOrThrow({
        where: { id: incoming.productId },
      })
    ).status,
    "SOLD",
  );
  await command(incoming.id, "SALE", { orderId: order.id });
  const paySeed = await getPaymentOwnerSeedTx(
    prisma,
    "ACQUISITION",
    incoming.id,
  );
  assert.equal(paySeed.direction, "OUT");
  assert.equal(paySeed.totalDue, 9000000);
  await assert.rejects(command(incoming.id, "SETTLE"), /Còn khoản thu\/chi/);
  const payout = await createPayment({
    ownerType: "ACQUISITION",
    ownerId: incoming.id,
    amount: 9000000,
    method: "BANK_TRANSFER",
    actorUserId: actor.id,
  });
  await completePayment({ paymentId: payout.id, actorUserId: actor.id });
  await command(incoming.id, "SETTLE");
  await assert.rejects(
    createPayment({
      ownerType: "ACQUISITION",
      ownerId: incoming.id,
      amount: 1,
      method: "CASH",
    }),
    /trước khi khóa quyết toán/,
  );
  const product = await prisma.product.create({
    data: {
      type: "WATCH",
      title: "Owned fixture",
      status: "AVAILABLE",
      watch: {
        create: {
          saleStage: "READY",
          stockStage: "IN_STOCK",
          serviceStage: "NOT_REQUIRED",
        },
      },
    },
  });
  await prisma.acquisition.create({
    data: {
      vendorId: vendor.id,
      type: "PURCHASE",
      acquiredAt: new Date(),
      totalAmount: 3000000,
      accquisitionStt: "POSTED",
      acquisitionItem: {
        create: {
          productId: product.id,
          productTitle: "Owned fixture",
          quantity: 1,
          unitCost: 3000000,
          kind: "PRODUCT",
        },
      },
    },
  });
  const races = await Promise.allSettled(
    [1, 2].map(() =>
      createConsignment(
        {
          requestId: randomUUID(),
          direction: "OUT",
          productId: product.id,
          vendorId: vendor.id,
          terms: { mode: "FIXED", value: 1000000 },
        },
        auth,
      ),
    ),
  );
  assert.equal(races.filter((r) => r.status === "fulfilled").length, 1);
  const sent = races.find((r) => r.status === "fulfilled");
  assert.ok(sent && sent.status === "fulfilled");
  await command(sent.value.id, "ACTIVATE");
  assert.equal(
    (await buildWatchCostLedgerProjectionRow(prisma, product.id))
      .acquisitionAmount,
    3000000,
  );
  assert.equal(
    (await prisma.watch.findUniqueOrThrow({ where: { productId: product.id } }))
      .stockStage,
    "OUT_OF_STOCK",
  );
  await command(sent.value.id, "RETURN");
  assert.equal(
    (await prisma.watch.findUniqueOrThrow({ where: { productId: product.id } }))
      .stockStage,
    "IN_STOCK",
  );
  const outbound = await createConsignment(
    {
      requestId: randomUUID(),
      direction: "OUT",
      productId: product.id,
      vendorId: vendor.id,
      terms: { mode: "NET", value: 8000000 },
    },
    auth,
  );
  await command(outbound.id, "ACTIVATE");
  await assert.rejects(
    command(outbound.id, "SALE", {
      saleAmount: 7000000,
      saleReference: "Partner report",
    }),
    /không đủ/,
  );
  assert.equal(
    (await prisma.product.findUniqueOrThrow({ where: { id: product.id } }))
      .status,
    "CONSIGNED_TO",
  );
  await command(outbound.id, "SALE", {
    saleAmount: 10000000,
    saleReference: "Partner report",
  });
  const receipt = await getPaymentOwnerSeedTx(
    prisma,
    "ACQUISITION",
    outbound.id,
  );
  assert.equal(receipt.direction, "IN");
  assert.equal(receipt.totalDue, 8000000);
  const outgoingCost = await buildWatchCostLedgerProjectionRow(
    prisma,
    product.id,
  );
  assert.equal(outgoingCost.acquisitionAmount, 3000000);
  assert.equal(outgoingCost.otherAmount, 2000000);
  const cashIn = await createPayment({
    ownerType: "ACQUISITION",
    ownerId: outbound.id,
    amount: 8000000,
    method: "BANK_TRANSFER",
    actorUserId: actor.id,
  });
  await completePayment({ paymentId: cashIn.id, actorUserId: actor.id });
  await command(outbound.id, "SETTLE");
  assert.equal(
    readConsignment(
      (
        await prisma.acquisition.findUniqueOrThrow({
          where: { id: outbound.id },
        })
      ).consignment,
    )?.status,
    "SETTLED",
  );
  const readonly = {
    id: actor.id,
    roles: [],
    permissions: ["WATCH_ACQUISITION_VIEW"],
  };
  const masked = await listConsignments(readonly);
  assert.equal(masked.canReadMoney, false);
  assert.ok(
    masked.items.every(
      (item) =>
        item.terms === null &&
        item.soldAmount === null &&
        item.net === null &&
        item.remaining === null,
    ),
  );
  await assert.rejects(
    createConsignment({ ...input, requestId: randomUUID() }, readonly),
    /không có quyền/,
  );
  console.log(
    "PASS isolated consignment DB: retry receipts, row locks/unique active watch, state/version guards, inbound order linkage, negotiated owner costs, return/restore, IN/OUT payments, settlement lock and financial masking",
  );
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
