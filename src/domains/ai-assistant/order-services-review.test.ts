import React from "react";
import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import OrderServicesDraftReview from "./OrderServicesDraftReview";
import type { OrderServicesDraft } from "./service-order-contract";
const draft: OrderServicesDraft = {
  revision: 1,
  sourceMessageId: "00000000-0000-4000-8000-000000000001",
  plan: {
    sourceMessageId: "00000000-0000-4000-8000-000000000001",
    orderId: "one",
    expectedVersion: "a".repeat(64),
    additions: [
      {
        parentOrderItemId: "watch",
        serviceCatalogId: "spa",
        unitPriceAgreed: 100000,
      },
    ],
  },
  orderReference: "OD-1",
  customerName: "Nam",
  beforeSubtotal: "200000",
  afterSubtotal: "300000",
  increase: "100000",
  requiredPermissions: [],
  requiredTaskIds: [],
  rows: [
    {
      parentOrderItemId: "watch",
      watchLabel: "Dòng 1: Tissot",
      serviceCatalogId: "spa",
      serviceName: "Spa <script>bad</script>",
      catalogVersion: "version",
      price: 100000,
    },
  ],
};
test("service amendment review identifies the order/watch/charge with one explicit action and no business form", () => {
  let actions = 0;
  const html = renderToStaticMarkup(
    React.createElement(OrderServicesDraftReview, {
      draft,
      busy: false,
      onApprove: () => {
        actions++;
      },
    }),
  );
  assert.equal(actions, 0, "Rendering and history must not apply an amendment");
  assert.equal((html.match(/<button/g) || []).length, 1);
  assert.ok(!/<(?:input|select|textarea)\b/.test(html));
  assert.ok(html.includes("OD-1"));
  assert.ok(html.includes("Tissot"));
  assert.ok(html.includes("300.000"));
  assert.ok(html.includes("Chưa ghi nhận thu tiền"));
  assert.ok(!html.includes("<script>"));
  const blocked = renderToStaticMarkup(
    React.createElement(OrderServicesDraftReview, {
      draft,
      busy: true,
      onApprove: () => {},
    }),
  );
  assert.ok(blocked.includes('disabled=""'));
});
