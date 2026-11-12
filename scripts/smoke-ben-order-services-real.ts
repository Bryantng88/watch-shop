import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/server/db/client";
import {
  sendAssistant,
  listAssistant,
  cancelAssistant,
} from "../src/domains/ai-assistant/server/service";
import { orderServicesPermissions } from "../src/domains/ai-assistant/server/order-services-plan";
let pending = "",
  userId = "";
async function main() {
  const database = new URL(process.env.DATABASE_URL || "");
  assert.equal(database.hostname, "127.0.0.1");
  assert.equal(database.pathname, "/personal_codex_test");
  assert.equal(process.env.BEN_REAL_ORDER_SERVICES_EVAL, "1");
  const suffix = randomUUID().slice(0, 8),
    customer = `NamEval${suffix}`;
  for (const code of orderServicesPermissions)
    await prisma.permission.upsert({
      where: { code },
      create: { code },
      update: {},
    });
  const role = await prisma.role.create({
    data: {
      name: `order-real-${suffix}`,
      permissions: {
        connect: orderServicesPermissions.map((code) => ({ code })),
      },
    },
  });
  const user = await prisma.user.create({
    data: {
      email: `order-real-${suffix}@example.invalid`,
      name: "Synthetic order semantic evaluation",
      roles: { connect: { id: role.id } },
    },
  });
  userId = user.id;
  const spa = `SpaEval${suffix}`,
    glass = `KinhEval${suffix}`;
  for (const [name, detail] of [
    [spa, "SPA"],
    [glass, "PARTS_CHANGE"],
  ] as const)
    await prisma.serviceCatalog.create({
      data: {
        name,
        code: name,
        detail,
        customerPrice: 100000,
        updatedAt: new Date(),
      },
    });
  const order = await prisma.order.create({
    data: {
      refNo: `EVAL-${suffix}`,
      customerName: customer,
      shipPhone: "",
      shipAddress: "",
      shipCity: "",
      hasShipment: false,
      status: "POSTED",
      subtotal: 200000,
      orderItem: {
        create: [1, 2].map((n) => ({
          kind: "SERVICE" as const,
          serviceScope: "CUSTOMER_OWNED" as const,
          title: "Thay pin",
          customerItemNote: `Tissot ${n}`,
          quantity: 1,
          listPrice: 0,
          unitPriceAgreed: 100000,
          subtotal: 100000,
        })),
      },
    },
  });
  const cases = JSON.parse(
    readFileSync("tests/fixtures/ben-order-service-intents.json", "utf8"),
  ) as { text: string; kind: "search" | "propose" | "none" | "clarify" }[];
  const before = [
    await prisma.orderItem.count(),
    await prisma.technicalIssue.count(),
    await prisma.payment.count(),
  ];
  for (const item of cases) {
    const values: Record<string, string> = {
      customer,
      reference: order.refNo!,
      spa,
      glass,
    };
    const text = item.text.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key]);
    let row = await sendAssistant(userId, { requestKey: randomUUID(), text });
    pending = row.id;
    for (
      let n = 0;
      n < 90 && ["QUEUED", "RUNNING"].includes(row.runStatus || "");
      n++
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      row = (await listAssistant(userId, row.id)).conversations[0];
    }
    assert.ok(
      ["DRAFT", "NEEDS_INFO"].includes(row.runStatus || ""),
      `Model turn failed: ${item.kind}`,
    );
    assert.equal(!!row.orderServicesDraft, item.kind === "propose", text);
    if (item.kind === "propose")
      assert.equal(row.orderServicesDraft!.rows.length, 4);
    const saved = await prisma.customerAssistantConversation.findUniqueOrThrow({
      where: { id: row.id },
    });
    const evidence = saved.evidence as {
      request: { tool: string; query?: string };
    }[];
    if (item.kind === "search") {
      const queries = evidence
        .filter((e) => e.request.tool === "serviceOrders.search")
        .map((e) => JSON.parse(e.request.query!));
      assert.ok(
        queries.some(
          (q) =>
            q.customerName === customer &&
            String(q.brand).toLowerCase() === "tissot" &&
            q.service &&
            q.watchCountHint === 2,
        ),
        "Model must preserve all provided clues",
      );
    }
    if (item.kind === "none" || item.kind === "clarify")
      assert.ok(
        !evidence.some((e) => e.request.tool === "serviceOrders.propose"),
      );
    assert.deepEqual(
      [
        await prisma.orderItem.count(),
        await prisma.technicalIssue.count(),
        await prisma.payment.count(),
      ],
      before,
      "No write without review approval",
    );
    assert.equal(row.orderDraft, undefined);
    assert.equal(row.customerRequest, undefined);
    pending = "";
    console.log(
      JSON.stringify({ text: item.text, kind: item.kind, status: "PASS" }),
    );
  }
  console.log(
    `PASS ${cases.length} real-model service-order intent cases; no business approval or writes.`,
  );
}
main()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Semantic evaluation failed",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    if (pending && userId)
      await cancelAssistant(userId, pending).catch(() => {});
    if (userId)
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });
    await prisma.$disconnect();
  });
