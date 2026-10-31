import assert from "node:assert/strict";
import { test } from "node:test";
import { PERMISSIONS as P } from "@/constants/permissions";
import { ROLE_PERMISSIONS } from "./rolePermissions";
import { expandPermissions } from "./permission-implications";
import { getAdminApiPolicy, getAdminPagePolicy, isAdminAccessAllowed } from "./admin-api-policy";
import { getAdminLandingPath } from "./admin-landing";
import { isMediaProductionTransitionAllowed } from "./media-production-policy";

const permissions = expandPermissions(ROLE_PERMISSIONS.MEDIA);

test("MEDIA can enter production and view products without broad business permissions", () => {
  for (const path of ["/admin", "/admin/coordination/media", "/admin/media-posts/post-1", "/admin/watches", "/admin/watches/watch-1", "/admin/watches/watch-1/media"]) {
    assert.ok(isAdminAccessAllowed(getAdminPagePolicy(path), permissions), path);
  }
  for (const path of ["/admin/dashboard", "/admin/orders", "/admin/payments", "/admin/customers", "/admin/services", "/admin/users", "/admin/media", "/admin/coordination/operation", "/admin/coordination/technical", "/admin/watches/new", "/admin/watches/watch-1/edit", "/admin/reports/finance", "/admin/settings/storefront-hero"]) {
    assert.equal(isAdminAccessAllowed(getAdminPagePolicy(path), permissions), false, path);
  }
  for (const code of [P.PRODUCT_UPDATE, P.PRODUCT_COST_VIEW, P.PRODUCT_PRICE_EDIT, P.TASK_VIEW, P.TASK_MANAGE, P.MEDIA_VIEW]) assert.equal(permissions.has(code), false, code);
  assert.equal(isAdminAccessAllowed(getAdminPagePolicy("/admin/watches/watch-1/media"), new Set([P.PRODUCT_VIEW])), false);
  assert.equal(getAdminLandingPath({ roles: ["MEDIA"], permissions: [...permissions] }), "/admin/coordination/media");
});

test("MEDIA APIs allow production work and reject business writes and maintenance", () => {
  for (const [path, method] of [
    ["/api/admin/media-posts/post-1/images/sharp", "POST"],
    ["/api/admin/watches/watch-1/gallery/sharp", "POST"],
    ["/api/admin/watches/watch-1/storefront-image", "POST"],
    ["/api/media/browse", "GET"],
    ["/api/media/batches/latest", "GET"],
    ["/api/admin/coordination/operation/boards/media-operation", "GET"],
    ["/api/admin/coordination/operation/flows/media-production-flow", "GET"],
    ["/api/admin/watches/list", "GET"],
  ]) assert.ok(isAdminAccessAllowed(getAdminApiPolicy(path, method), permissions), path);
  for (const [path, method] of [
    ["/api/admin/watches/watch-1", "PUT"],
    ["/api/admin/watches/watch-1/content-review", "POST"],
    ["/api/admin/watches/watch-1/storefront-publish", "POST"],
    ["/api/admin/coordination/operation/boards/technical-issue", "GET"],
    ["/api/admin/coordination/operation/flows/payment-collection-flow", "GET"],
    ["/api/admin/media/reconciliation/import", "POST"],
    ["/api/media/assets/repair-inline-root", "POST"],
    ["/api/admin/users", "POST"],
    ["/api/admin/orders", "POST"],
  ]) assert.equal(isAdminAccessAllowed(getAdminApiPolicy(path, method), permissions), false, path);
});

test("MEDIA transitions are restricted by both target type and resolved workflow", () => {
  for (const type of ["WATCH", "MEDIA_POST"]) for (const workflow of ["watch-photography", "watch-media-processing", "watch-publish"]) assert.ok(isMediaProductionTransitionAllowed([...permissions], type, workflow));
  for (const type of ["ORDER", "PAYMENT", "TECHNICAL_ISSUE", "SERVICE_REQUEST", "SHIPMENT"]) assert.equal(isMediaProductionTransitionAllowed([...permissions], type, "watch-media-processing"), false);
  for (const workflow of ["sales-pricing", "watch-operation-technical", "watch-image-review", "unknown", null]) assert.equal(isMediaProductionTransitionAllowed([...permissions], "WATCH", workflow), false);
  assert.equal(isMediaProductionTransitionAllowed([P.MEDIA_PRODUCTION_VIEW], "WATCH", "watch-media-processing"), false);
});

test("existing product editors retain media production access through one-way implications", () => {
  const editor = expandPermissions([P.PRODUCT_UPDATE]);
  assert.ok(editor.has(P.MEDIA_PRODUCTION_UPDATE));
  assert.ok(editor.has(P.MEDIA_PRODUCTION_VIEW));
  assert.equal(permissions.has(P.PRODUCT_UPDATE), false);
});

test("media query grant cannot be reused for another context, board or flow", async () => {
  const { canReadMediaCoordinationQuery } = await import("./media-production-policy");
  const user = { roles: ["MEDIA"], permissions: [...permissions] };
  assert.ok(canReadMediaCoordinationQuery(user, "board", "media-operation", "MEDIA"));
  assert.ok(canReadMediaCoordinationQuery(user, "flow", "media-production-flow", "MEDIA"));
  for (const context of [null, "OPERATION", "PAYMENT", "TECHNICAL", "SALES", "GENERAL"]) {
    assert.equal(canReadMediaCoordinationQuery(user, "board", "media-operation", context), false);
  }
  assert.equal(canReadMediaCoordinationQuery(user, "board", "technical-issue", "MEDIA"), false);
  assert.equal(canReadMediaCoordinationQuery(user, "flow", "payment-collection-flow", "MEDIA"), false);
});

test("media payloads remove nested financial values without changing product descriptions or dates", async () => {
  const { redactWatchFinancials } = await import("./media-production-policy");
  const createdAt = new Date();
  const source = { title: "Test watch", createdAt, price: { salePrice: "100", costPrice: "50", minPrice: "80" }, history: [{ unitCost: "42" }] };
  const result = redactWatchFinancials(source);
  assert.equal(result.title, source.title);
  assert.equal(result.createdAt, createdAt);
  assert.equal(result.price.salePrice, "100");
  assert.equal(result.price.costPrice, null);
  assert.equal(result.price.minPrice, null);
  assert.equal(result.history[0].unitCost, null);
  assert.equal(source.price.costPrice, "50");
});
