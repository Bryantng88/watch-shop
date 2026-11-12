import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/server/db/client";
import {
  sendAssistant,
  assistantWorker,
  listAssistant,
  approveAssistantOrderServices,
  cancelAssistant,
} from "../src/domains/ai-assistant/server/service";
import { orderServicesPermissions } from "../src/domains/ai-assistant/server/order-services-plan";
import { searchServiceOrders } from "../src/domains/ai-assistant/server/service-order-search";
import {
  getPaymentExposureTx,
  getPaymentSummaryTx,
} from "../src/domains/payment/server/payment.core";

async function main() {
  const database = new URL(process.env.DATABASE_URL || "");
  assert.equal(database.hostname, "127.0.0.1");
  assert.equal(database.pathname, "/personal_codex_test");
  assert.equal(
    await prisma.customerAssistantConversation.count({
      where: { status: { in: ["QUEUED", "RUNNING"] } },
    }),
    0,
  );
  const suffix = randomUUID();
  for (const code of orderServicesPermissions)
    await prisma.permission.upsert({
      where: { code },
      create: { code },
      update: {},
    });
  const role = await prisma.role.create({
    data: {
      name: `order-services-${suffix}`,
      permissions: {
        connect: orderServicesPermissions.map((code) => ({ code })),
      },
    },
  });
  const users = await Promise.all(
    ["owner", "other"].map((name) =>
      prisma.user.create({
        data: {
          email: `order-${name}-${suffix}@example.invalid`,
          name: `Synthetic ${name}`,
          roles: { connect: { id: role.id } },
        },
      }),
    ),
  );
  const [owner, other] = users;
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw Error("No external requests allowed in service-order fixture");
  };
  let sequence = 0;
  const catalogs = await Promise.all(
    ["pin", "spa", "kính"].map((name, index) =>
      prisma.serviceCatalog.create({
        data: {
          code: `service-${suffix}-${index}`,
          name: `Synthetic ${name} ${suffix}`,
          detail:
            index === 0
              ? "BATTERY_CHANGE"
              : index === 1
                ? "SPA"
                : "PARTS_CHANGE",
          customerPrice: 100000,
          internalCost: 77777,
          note: "PRIVATE-CATALOG-NOTE",
          updatedAt: new Date(),
        },
      }),
    ),
  );
  const makeOrder = async (
    status: "DRAFT" | "POSTED" | "PROCESSING" = "POSTED",
  ) => {
    const refNo = `FIX-${suffix}-${++sequence}`;
    return prisma.order.create({
      data: {
        refNo,
        customerName: `Nam ${suffix}`,
        shipPhone: "PRIVATE-PHONE",
        shipAddress: "PRIVATE-ADDRESS",
        shipCity: "",
        hasShipment: false,
        status,
        subtotal: 200000,
        orderItem: {
          create: [1, 2].map((n) => ({
            title: "Thay pin",
            kind: "SERVICE" as const,
            serviceScope: "CUSTOMER_OWNED" as const,
            serviceCatalogId: catalogs[0].id,
            customerItemNote: `Tissot watch ${n}; PRIVATE-WATCH-NOTE`,
            quantity: 1,
            listPrice: 0,
            unitPriceAgreed: 100000,
            subtotal: 100000,
          })),
        },
      },
      include: { orderItem: { orderBy: { id: "asc" } } },
    });
  };
  const prepare = async (
    order: Awaited<ReturnType<typeof makeOrder>>,
    opts: {
      duplicate?: boolean;
      noSearch?: boolean;
      staleSource?: boolean;
      one?: boolean;
    } = {},
  ) => {
    const requestKey = randomUUID(),
      chat = await sendAssistant(owner.id, {
        requestKey,
        text: `Synthetic request: add spa and glass to both watches of ${order.refNo}, 100000 VND each; review only.`,
      });
    const { run } = (await assistantWorker("claim", {})) as {
      run: { id: string; leaseToken: string };
    };
    assert.equal(run.id, chat.id);
    const lookup = async (tool: string, query: string) =>
      (
        (await assistantWorker("lookup", {
          ...run,
          lookup: { tool, query },
        })) as { evidence: { result: Record<string, unknown> } }
      ).evidence.result;
    if (!opts.noSearch)
      await lookup(
        "serviceOrders.search",
        JSON.stringify({ reference: order.refNo }),
      );
    const detail = await lookup("serviceOrders.detail", order.id);
    for (const c of catalogs.slice(1)) await lookup("services.catalog", c.id);
    const additions = (
      opts.one ? order.orderItem.slice(0, 1) : order.orderItem
    ).flatMap((item) =>
      catalogs
        .slice(1)
        .map((c) => ({
          parentOrderItemId: item.id,
          serviceCatalogId: c.id,
          unitPriceAgreed: 100000,
        })),
    );
    if (opts.duplicate) additions[0].serviceCatalogId = catalogs[0].id;
    const proposal = {
      sourceMessageId: opts.staleSource ? randomUUID() : requestKey,
      orderId: order.id,
      expectedVersion: detail.version,
      additions,
    };
    try {
      await lookup("serviceOrders.propose", JSON.stringify(proposal));
    } catch (e) {
      await cancelAssistant(owner.id, run.id);
      throw e;
    }
    const baseline = await prisma.orderItem.count({
      where: { orderId: order.id },
    });
    await assert.rejects(
      assistantWorker("finish", {
        ...run,
        reply: "invalid mixed review",
        personalWorkPlan: {},
      }),
    );
    await assistantWorker("finish", {
      ...run,
      reply: "Synthetic order-service review; no writes.",
    });
    assert.equal(
      await prisma.orderItem.count({ where: { orderId: order.id } }),
      baseline,
      "Proposal and finish must be read-only",
    );
    const review = (await listAssistant(owner.id, chat.id)).conversations[0];
    assert.ok(review.orderServicesDraft);
    return review;
  };
  const approve = async (review: Awaited<ReturnType<typeof prepare>>) =>
    approveAssistantOrderServices(owner.id, review.id, review.revision!, () => {
      /* recorded event outbox is enough for fixture */
    });
  try {
    const order = await makeOrder();
    const found = await searchServiceOrders(
      prisma,
      JSON.stringify({
        customerName: `Nam ${suffix}`,
        brand: "Tissot",
        service: "thay pin",
        watchCountHint: 2,
      }),
      { admin: false, permissions: new Set(orderServicesPermissions) },
    );
    assert.equal(found.matches.length, 1);
    assert.equal(found.relaxed, false);
    assert.equal(found.matches[0].id, order.id);
    assert.equal(found.matches[0].watchCount, 2);
    const searchJson = JSON.stringify(found);
    for (const privatePart of [
      "PRIVATE-PHONE",
      "PRIVATE-ADDRESS",
      "PRIVATE-WATCH-NOTE",
      "77777",
    ])
      assert.ok(!searchJson.includes(privatePart));
    const review = await prepare(order);
    const existing = await prisma.orderItem.findMany({
      where: { orderId: order.id },
      orderBy: { id: "asc" },
    });
    const payments = await prisma.payment.findMany({
      where: { order_id: order.id },
    });
    await assert.rejects(
      approveAssistantOrderServices(
        other.id,
        review.id,
        review.revision!,
        () => {},
      ),
    );
    await Promise.all([approve(review), approve(review)]);
    await approve(review);
    const updated = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    assert.equal(updated.subtotal.toString(), "600000");
    const lines = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });
    assert.equal(lines.length, 6);
    assert.deepEqual(
      lines
        .filter((i) => existing.some((old) => old.id === i.id))
        .sort((a, b) => a.id.localeCompare(b.id)),
      existing,
    );
    const added = lines.filter((i) => !existing.some((old) => old.id === i.id));
    assert.ok(
      added.every(
        (i) =>
          i.linkedOrderItemId &&
          i.customerItemNote ===
            existing.find((old) => old.id === i.linkedOrderItemId)!
              .customerItemNote,
      ),
    );
    assert.equal(
      await prisma.serviceRequest.count({
        where: { orderItemId: { in: added.map((i) => i.id) } },
      }),
      4,
    );
    assert.equal(
      await prisma.technicalIssue.count({
        where: {
          serviceRequest: { orderItemId: { in: added.map((i) => i.id) } },
        },
      }),
      4,
    );
    assert.deepEqual(
      await prisma.payment.findMany({ where: { order_id: order.id } }),
      payments,
      "No implicit collection/payment rewrites",
    );
    const summary = await getPaymentSummaryTx(prisma, "ORDER", order.id);
    assert.equal(summary.remaining, 600000);
    const receipt = (await listAssistant(owner.id, review.id)).conversations[0];
    assert.equal(receipt.updatedServiceOrders?.length, 1);
    assert.equal(receipt.orderServicesDraft, undefined);
    // A pending receipt for the old amount remains untouched; remaining/available
    // are recomputed from the canonical order subtotal, never a false paid status.
    const pending = await makeOrder();
    await prisma.payment.create({
      data: {
        order_id: pending.id,
        method: "BANK_TRANSFER",
        amount: 200000,
        currency: "VND",
        status: "UNPAID",
        direction: "IN",
        type: "ORDER",
        purpose: "ORDER_FULL",
      },
    });
    await approve(await prepare(pending, { one: true }));
    const pendingSummary = await getPaymentSummaryTx(
      prisma,
      "ORDER",
      pending.id,
    );
    assert.equal(pendingSummary.remaining, 400000);
    assert.equal(
      (await getPaymentExposureTx(prisma, "ORDER", pending.id))
        .availableToCreate,
      200000,
    );
    for (const status of ["DRAFT", "PROCESSING"] as const) {
      const target = await makeOrder(status);
      await approve(await prepare(target, { one: true }));
      assert.equal(
        await prisma.serviceRequest.count({
          where: { orderItem: { orderId: target.id } },
        }),
        status === "DRAFT" ? 0 : 2,
      );
    }
    for (const options of [
      { noSearch: true },
      { staleSource: true },
      { duplicate: true },
    ]) {
      const target = await makeOrder();
      await assert.rejects(prepare(target, options));
      assert.equal(
        await prisma.orderItem.count({ where: { orderId: target.id } }),
        2,
      );
    }
    const stale = await makeOrder(),
      staleReview = await prepare(stale);
    await prisma.orderItem.update({
      where: { id: stale.orderItem[0].id },
      data: { customerItemNote: "Different watch" },
    });
    await assert.rejects(approve(staleReview));
    assert.equal(
      await prisma.orderItem.count({ where: { orderId: stale.id } }),
      2,
    );
    const changedCatalog = await makeOrder(),
      catalogReview = await prepare(changedCatalog);
    await prisma.serviceCatalog.update({
      where: { id: catalogs[1].id },
      data: { customerPrice: 200000 },
    });
    await assert.rejects(approve(catalogReview));
    assert.equal(
      await prisma.orderItem.count({ where: { orderId: changedCatalog.id } }),
      2,
    );
    // A different conversation cannot race a second copy onto the same watches.
    const race = await makeOrder(),
      r1 = await prepare(race),
      r2 = await prepare(race);
    const raceResults = await Promise.allSettled([approve(r1), approve(r2)]);
    assert.equal(raceResults.filter((r) => r.status === "fulfilled").length, 1);
    assert.equal(
      await prisma.orderItem.count({ where: { orderId: race.id } }),
      6,
    );
    const newer = await makeOrder(),
      oldReview = await prepare(newer);
    await sendAssistant(owner.id, {
      id: oldReview.id,
      requestKey: randomUUID(),
      text: "Cancel this amendment",
    });
    await assert.rejects(approve(oldReview));
    await cancelAssistant(owner.id, oldReview.id);
    for (const kind of [
      "terminal",
      "paid",
      "shipment",
      "mixed",
      "quantity",
      "invoice",
    ]) {
      const target = await makeOrder();
      if (kind === "terminal")
        await prisma.order.update({
          where: { id: target.id },
          data: { status: "COMPLETED" },
        });
      if (kind === "paid")
        await prisma.payment.create({
          data: {
            order_id: target.id,
            method: "CASH",
            amount: 1,
            currency: "VND",
            status: "PAID",
          },
        });
      if (kind === "shipment")
        await prisma.order.update({
          where: { id: target.id },
          data: { hasShipment: true },
        });
      if (kind === "mixed")
        await prisma.orderItem.update({
          where: { id: target.orderItem[0].id },
          data: { kind: "PRODUCT" },
        });
      if (kind === "quantity")
        await prisma.orderItem.update({
          where: { id: target.orderItem[0].id },
          data: { quantity: 2 },
        });
      if (kind === "invoice")
        await prisma.invoice.create({
          data: {
            orderId: target.id,
            type: "SALE",
            currency: "VND",
            subTotal: 200000,
            grandTotal: 200000,
            updatedAt: new Date(),
          },
        });
      await assert.rejects(prepare(target));
      assert.equal(
        await prisma.orderItem.count({ where: { orderId: target.id } }),
        2,
      );
    }
    // Failure after inserting lines must roll back lines, subtotal, events and receipt.
    const rollback = await makeOrder(),
      rollbackReview = await prepare(rollback);
    await prisma.$executeRawUnsafe(
      `CREATE FUNCTION ben_order_fixture_reject() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic intake failure'; END $$`,
    );
    await prisma.$executeRawUnsafe(
      `CREATE TRIGGER ben_order_fixture_reject BEFORE INSERT ON "TechnicalIssue" FOR EACH ROW EXECUTE FUNCTION ben_order_fixture_reject()`,
    );
    try {
      await assert.rejects(approve(rollbackReview));
      assert.equal(
        await prisma.orderItem.count({ where: { orderId: rollback.id } }),
        2,
      );
      assert.equal(
        (
          await prisma.order.findUniqueOrThrow({ where: { id: rollback.id } })
        ).subtotal.toString(),
        "200000",
      );
      assert.equal(
        (await listAssistant(owner.id, rollbackReview.id)).conversations[0]
          .updatedServiceOrders?.length || 0,
        0,
      );
    } finally {
      await prisma.$executeRawUnsafe(
        `DROP TRIGGER ben_order_fixture_reject ON "TechnicalIssue"`,
      );
      await prisma.$executeRawUnsafe(
        `DROP FUNCTION ben_order_fixture_reject()`,
      );
    }
    const revoked = await makeOrder(),
      revokedReview = await prepare(revoked);
    await prisma.role.update({
      where: { id: role.id },
      data: { permissions: { set: [] } },
    });
    await assert.rejects(approve(revokedReview));
    const redacted = (await listAssistant(owner.id, revokedReview.id))
      .conversations[0];
    assert.equal(redacted.orderServicesDraft, undefined);
    assert.equal(
      await prisma.orderItem.count({ where: { orderId: revoked.id } }),
      2,
    );
    assert.deepEqual(
      (await listAssistant(owner.id, review.id)).conversations[0]
        .updatedServiceOrders,
      [],
    );
    console.log(
      "PASS service-order DB integration: multi-clue intake search, explicit review, append-only canonical intake, totals/payment remaining, replay/concurrent clicks, cross-owner, stale order/catalog/revision, blocked states, revocation and transactional rollback. No real model or external calls.",
    );
  } finally {
    globalThis.fetch = oldFetch;
    await prisma.user.updateMany({
      where: { id: { in: users.map((u) => u.id) } },
      data: { isActive: false },
    });
  }
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
