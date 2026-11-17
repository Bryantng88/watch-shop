import type { OperationsDashboardAttentionItem, OperationsDashboardQueue } from "../shared";

export function selectAttentionItems(items: OperationsDashboardAttentionItem[], limit = 6) {
  const rank = { risk: 0, attention: 1, neutral: 2 };
  const unique = new Map<string, OperationsDashboardAttentionItem>();
  for (const item of items) {
    const old = unique.get(item.id);
    if (!old || rank[item.severity ?? "attention"] < rank[old.severity ?? "attention"]) unique.set(item.id, item);
  }
  return [...unique.values()].sort((a, b) => rank[a.severity ?? "attention"] - rank[b.severity ?? "attention"] || (b.ageDays ?? 0) - (a.ageDays ?? 0) || a.id.localeCompare(b.id)).slice(0, limit);
}

/** Fixed operational-domain order, not a cross-domain severity score or summed KPI. */
export function quickAttention(queues: OperationsDashboardQueue[]) {
  const order: OperationsDashboardQueue["key"][] = ["media", "technical", "purchase-requests", "orders", "payments", "personal-work"];
  const rank = { risk: 0, attention: 1, neutral: 2 };
  return order.flatMap(key => {
    const queue = queues.find(item => item.key === key);
    if (!queue) return [];
    const insight = queue.insights.filter(item => item.count > 0 && item.severity !== "neutral").sort((a, b) => rank[a.severity] - rank[b.severity])[0];
    return insight ? [{ queue, insight }] : [];
  }).slice(0, 3);
}
