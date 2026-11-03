import type { IntakePlan, LookupEvidence } from "../intake-schema";

function matches(evidence: LookupEvidence) {
  return Array.isArray(evidence.result.matches) ? evidence.result.matches as { id: string }[] : [];
}

export function validateIntakeEvidence(plan: IntakePlan, evidence: LookupEvidence[]) {
  const issues: string[] = [];
  for (const lead of plan.leads) {
    for (const [tool, id, label] of [["customers.search", lead.customerId, "khách hàng"], ["watches.search", lead.productId, "đồng hồ"]] as const) {
      const searches = evidence.filter(entry => entry.request.tool === tool && matches(entry).some(match => match.id === id));
      if (!id || !searches.some(entry => matches(entry).length === 1 && entry.result.truncated === false)) issues.push(`${lead.key}: chưa xác định duy nhất ${label}.`);
      if (searches.some(entry => matches(entry).length > 1 || entry.result.truncated === true)) issues.push(`${lead.key}: có nhiều ${label} phù hợp; cần người dùng xác nhận bằng yêu cầu mới.`);
    }
    const detail = evidence.find(entry => entry.request.tool === "watches.detail" && entry.request.productId === lead.productId && entry.result.id === lead.productId);
    if (!detail) issues.push(`${lead.key}: chưa kiểm tra tình trạng đồng hồ.`);
    if (!evidence.some(entry => entry.request.tool === "work.open" && entry.request.productId === lead.productId && entry.request.customerId === lead.customerId)) issues.push(`${lead.key}: chưa kiểm tra việc đang mở.`);
    if (lead.followups.some(item => ["VERIFY_ACCESSORY", "SOURCE_ACCESSORY"].includes(item.kind)) && !evidence.some(entry => entry.request.tool === "accessories.search")) issues.push(`${lead.key}: chưa tra cứu phụ kiện (không có dữ liệu không đồng nghĩa hết hàng).`);
  }
  return [...new Set(issues)];
}
