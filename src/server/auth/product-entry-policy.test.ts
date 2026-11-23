import assert from "node:assert/strict";
import test from "node:test";
import { PERMISSIONS as P } from "../../constants/permissions";
import { PRODUCT_READ_PERMISSIONS, productEntries } from "../../domains/shared/ui/navigation/section-navigation";
import { getAdminPagePolicy, isAdminAccessAllowed } from "./admin-api-policy";

test("product menu entry admits each existing product read permission", () => {
  for (const permission of PRODUCT_READ_PERMISSIONS) {
    const permissions = [permission];
    assert.ok(productEntries({ permissions }).length);
    assert.equal(isAdminAccessAllowed(getAdminPagePolicy("/admin/products"), new Set(permissions)), true);
  }
});

test("product entry rejects unrelated users and preserves destination guards", () => {
  for (const permissions of [[], [P.TASK_VIEW], [P.SERVICE_VIEW]]) {
    assert.equal(isAdminAccessAllowed(getAdminPagePolicy("/admin/products"), new Set(permissions)), false);
  }
  assert.equal(isAdminAccessAllowed(getAdminPagePolicy("/admin/watches"), new Set([P.ACCESSORY_VIEW])), false);
  assert.equal(isAdminAccessAllowed(getAdminPagePolicy("/admin/straps"), new Set([P.PRODUCT_VIEW])), false);
  assert.equal(isAdminAccessAllowed(getAdminPagePolicy("/admin/products/unknown"), new Set(PRODUCT_READ_PERMISSIONS)), false);
});
