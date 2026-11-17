import assert from "node:assert/strict";
import test from "node:test";
import { selectAttentionItems, quickAttention } from "./attention-selection";
import type { OperationsDashboardAttentionItem, OperationsDashboardQueue } from "../shared";
function item(id: string, ageDays: number, severity: "risk" | "attention"): OperationsDashboardAttentionItem {
  return { id, ageDays, severity, domain: "MEDIA", title: id, reference: null, reason: "Lâu chưa cập nhật", ageLabel: `${ageDays} ngày`, ownerLabel: "Chưa xác định", actionLabel: "Mở", href: "/admin/coordination/operation", tone: "violet" };
}
test("interventions deduplicate sources, prioritize risk, then age, and stay bounded", () => {
  const data = [item("shared", 10, "attention"), item("shared", 10, "risk"), item("old-attention", 100, "attention"), ...Array.from({ length: 8 }, (_, i) => item(`risk-${i}`, 20 + i, "risk"))];
  const selected = selectAttentionItems(data);
  assert.equal(selected.length, 6);
  assert.equal(new Set(selected.map(x => x.id)).size, 6);
  assert.equal(selected[0].id, "risk-7");
  assert.equal(selectAttentionItems(data, 20).find(x => x.id === "shared")?.severity, "risk");
  assert.deepEqual(selectAttentionItems([]), []);
});
test("quick reminders preserve domain context and never add unrelated counts", () => {
  const keys: OperationsDashboardQueue["key"][] = ["orders", "payments", "media", "technical", "purchase-requests"];
  const queues = keys.map(key => ({ key, label: key, description: "", href: "/admin", activeCount: 10, actionLabel: "Mở", stages: [], insights: [{ key: "attention", label: "Cần xem", count: 2, href: `/admin/${key}`, severity: "attention" as const }] }));
  assert.deepEqual(quickAttention(queues).map(x => x.queue.key), ["media", "technical", "purchase-requests"]);
  assert.equal(quickAttention(queues)[0].insight.count, 2);
  assert.deepEqual(quickAttention([]), []);
});
