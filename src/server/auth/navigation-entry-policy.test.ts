import assert from "node:assert/strict";
import test from "node:test";
import { PERMISSIONS as P } from "../../constants/permissions";
import { productEntries, reportEntries, systemEntries } from "../../domains/shared/ui/navigation/section-navigation";
import { tradingEntries } from "../../domains/trading/shared/trading-navigation";
import { directoryEntries } from "../../domains/contacts/shared/directory-navigation";
import { getAdminApiPolicy, getAdminPagePolicy, isAdminAccessAllowed } from "./admin-api-policy";
const allowed = (path: string, permissions: string[]) => isAdminAccessAllowed(getAdminPagePolicy(path), new Set(permissions));

test("section entries and all selected destinations are reachable for non-admin permission combinations", () => {
  const scopes = [P.PRODUCT_VIEW, P.ACCESSORY_VIEW, P.ORDER_VIEW, P.WATCH_ACQUISITION_VIEW, P.ACCESSORY_ACQUISITION_VIEW, P.DASHBOARD_VIEW, P.REPORT_SALES_VIEW, P.REPORT_FINANCE_VIEW, P.PRODUCT_COST_VIEW, P.PAYMENT_VIEW_ALL, P.SYSTEM_JOB_VIEW, P.ACTIVITY_READ, P.CUSTOMER_VIEW, P.USER_VIEW];
  const sections = [["/admin/products", productEntries], ["/admin/trading", tradingEntries], ["/admin/reports", reportEntries], ["/admin/system", systemEntries], ["/admin/directory", directoryEntries]] as const;
  for (let mask = 0; mask < 2 ** scopes.length; mask++) {
    const permissions = scopes.filter((_, i) => mask & (1 << i));
    for (const [path, entries] of sections) {
      const targets = entries({ roles: [], permissions });
      if (!targets.length) continue;
      assert.ok(allowed(path, permissions), `${path} entry blocked for ${permissions}`);
      for (const target of targets) assert.ok(allowed(target.href, permissions), `${target.href} blocked`);
    }
  }
});

test("entry policies never grant unrelated users access or weaken child resource gates", () => {
  for (const path of ["/admin/products", "/admin/trading", "/admin/reports", "/admin/system", "/admin/directory"]) {
    assert.equal(allowed(path, []), false);
    assert.equal(allowed(path, [P.TASK_VIEW]), false);
    assert.equal(allowed(`${path}/unknown`, [P.TASK_VIEW]), false);
  }
  assert.equal(allowed("/admin/reports/finance", [P.REPORT_FINANCE_VIEW]), false);
  assert.equal(allowed("/admin/reports/finance", [P.REPORT_SALES_VIEW]), false);
  assert.equal(allowed("/admin/orders", [P.WATCH_ACQUISITION_VIEW]), false);
  assert.equal(allowed("/admin/system/channels", [P.ACTIVITY_READ]), false);
  assert.equal(allowed("/admin/users", [P.CUSTOMER_VIEW]), false);
});

test("Ben media and quick naming agree with their inner permission gates", () => {
  assert.equal(allowed("/admin/ben/media", [P.TASK_VIEW]), true);
  assert.equal(allowed("/admin/ben/media", [P.MEDIA_VIEW]), false);
  for (const method of ["GET", "POST"]) {
    const policy = getAdminApiPolicy("/api/admin/acquisitions/quick-names", method);
    assert.equal(isAdminAccessAllowed(policy, new Set([P.WATCH_ACQUISITION_CREATE])), true);
    assert.equal(isAdminAccessAllowed(policy, new Set([P.WATCH_ACQUISITION_VIEW])), false);
    assert.equal(isAdminAccessAllowed(policy, new Set([P.ACCESSORY_ACQUISITION_CREATE])), false);
  }
});
