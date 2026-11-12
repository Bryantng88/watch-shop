import assert from "node:assert/strict";
import test from "node:test";
import { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import {
  searchServiceOrders,
  serviceOrderWhere,
  searchServiceCatalog,
  literalTerm,
} from "./service-order-search";
import { assistantLookupSchema } from "../live-contract";
import { orderServiceProposalSchema } from "../service-order-contract";
import { lookupAllowed } from "../capabilities";
const actor = {
  admin: false,
  permissions: new Set(["ORDER_VIEW", "SERVICE_VIEW", "CUSTOMER_VIEW"]),
};
test("multi-clue search includes intake notes, customer snapshots and service catalog without time/status restriction", () => {
  const where = serviceOrderWhere({
    customerName: "Nam",
    brand: "Tissot",
    service: "pin",
    watchCountHint: 2,
  });
  const encoded = JSON.stringify(where);
  for (const part of [
    "customerName",
    "customerItemNote",
    "brandSnapshot",
    "serviceCatalog",
    "battery",
  ])
    assert.ok(encoded.includes(part));
  for (const part of ["createdAt", "updatedAt", "status", "quantity"])
    assert.ok(!encoded.includes(part));
  assert.equal(literalTerm("Nam_%\\"), "Nam\\_\\%\\\\");
});
test("relaxation is explicit, retains customer, and bounded results never include private notes", async () => {
  const calls: unknown[] = [];
  const db = {
    order: {
      findMany: async (args: unknown) => {
        calls.push(args);
        return calls.length === 1
          ? []
          : [
              {
                id: "one",
                refNo: "OD-1",
                status: "COMPLETED",
                customerName: "Nam",
                orderItem: [{ id: "watch", title: "Thay pin", quantity: 2 }],
              },
            ];
      },
    },
  } as unknown as DB;
  const result = await searchServiceOrders(
    db,
    JSON.stringify({
      customerName: "Nam",
      brand: "Tissot",
      service: "thay pin",
      watchCountHint: 2,
    }),
    actor,
  );
  assert.equal(result.relaxed, true);
  assert.equal(result.requiresConfirmation, true);
  assert.equal(result.matches[0].watchCount, 2);
  assert.ok(JSON.stringify(calls[1]).includes('"Nam"'));
  assert.ok(!JSON.stringify(result).includes("customerItemNote"));
  assert.equal((calls[0] as { take: number }).take, 7);
});
test("customer-name search fails before database access without customer permission", async () => {
  const result = await searchServiceOrders({} as DB, '{"customerName":"Nam"}', {
    admin: false,
    permissions: new Set(),
  });
  assert.equal(result.accessDenied, true);
  assert.equal(lookupAllowed(actor, "serviceOrders.propose"), false);
  assert.equal(
    lookupAllowed(
      {
        ...actor,
        permissions: new Set([
          ...actor.permissions,
          "ORDER_UPDATE",
          "SERVICE_CREATE",
        ]),
      },
      "serviceOrders.propose",
    ),
    true,
  );
});
test("catalog never silently substitutes default price for missing/nonpositive customer price or exposes cost", async () => {
  let selected: unknown;
  const db = {
    serviceCatalog: {
      findMany: async (args: unknown) => {
        selected = args;
        return [
          {
            id: "spa",
            name: "Spa",
            code: "SPA",
            isActive: true,
            updatedAt: new Date(),
            customerPrice: new Prisma.Decimal(0),
            defaultPrice: new Prisma.Decimal(900000),
          },
        ];
      },
    },
  } as unknown as DB;
  const result = await searchServiceCatalog(db, "spa");
  assert.equal(result.matches[0].referencePrice, null);
  for (const key of ["vendorPrice", "internalCost", "note"])
    assert.ok(!JSON.stringify(selected).includes(key));
});
test("append schemas forbid injected fields, duplicate services, nonpositive prices and unbounded payloads", () => {
  const base = {
    sourceMessageId: "00000000-0000-4000-8000-000000000001",
    orderId: "order",
    expectedVersion: "a".repeat(64),
    additions: [
      {
        parentOrderItemId: "watch",
        serviceCatalogId: "spa",
        unitPriceAgreed: 100000,
      },
    ],
  };
  assert.ok(orderServiceProposalSchema.safeParse(base).success);
  for (const invalid of [
    { ...base, paid: true },
    { ...base, additions: [...base.additions, ...base.additions] },
    { ...base, additions: [{ ...base.additions[0], unitPriceAgreed: 0 }] },
    {
      ...base,
      additions: [{ ...base.additions[0], customerItemNote: "override" }],
    },
  ])
    assert.ok(!orderServiceProposalSchema.safeParse(invalid).success);
  assert.ok(
    !assistantLookupSchema.safeParse({
      tool: "serviceOrders.propose",
      query: "x".repeat(10001),
    }).success,
  );
});

import { prepareOrderServices } from "./order-services-plan";
import type { Evidence } from "../live-contract";
test("ambiguous, truncated and relaxed order matches cannot become an amendment even with a picked ID", async () => {
  const sourceMessageId = "00000000-0000-4000-8000-000000000001";
  const raw = JSON.stringify({
    sourceMessageId,
    orderId: "order",
    expectedVersion: "a".repeat(64),
    additions: [
      {
        parentOrderItemId: "watch",
        serviceCatalogId: "spa",
        unitPriceAgreed: 100000,
      },
    ],
  });
  for (const result of [
    { matches: [{ id: "order" }, { id: "other" }] },
    { matches: [{ id: "order" }], truncated: true },
    { matches: [{ id: "order" }], relaxed: true },
  ]) {
    await assert.rejects(
      prepareOrderServices({} as DB, raw, 1, sourceMessageId, [
        {
          request: {
            tool: "serviceOrders.search",
            query: '{"customerName":"Nam"}',
          },
          result,
        },
      ] as Evidence[]),
      /duy nhất/,
    );
  }
  await assert.rejects(
    prepareOrderServices({} as DB, raw, 1, sourceMessageId, [
      {
        request: {
          tool: "serviceOrders.search",
          query: '{"customerName":"Nam"}',
        },
        result: { matches: [{ id: "order" }, { id: "other" }] },
      },
      {
        request: {
          tool: "serviceOrders.search",
          query: '{"reference":"picked-id"}',
        },
        result: { matches: [{ id: "order" }] },
      },
    ]),
    /duy nhất/,
  );
  await assert.rejects(
    prepareOrderServices(
      {} as DB,
      raw,
      1,
      "00000000-0000-4000-8000-000000000002",
      [],
    ),
    /hiện tại/,
  );
});
