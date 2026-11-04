import { expandPermissions } from "@/server/auth/permission-implications";
import type { AssistantPlan } from "./live-contract";

export type AssistantAuthority = { admin: boolean; permissions: ReadonlySet<string> };
export const LOOKUP_PERMISSIONS: Readonly<Record<string, readonly string[]>> = {
  "customers.search": ["CUSTOMER_VIEW"],
  "watches.search": ["PRODUCT_VIEW"],
  "watches.detail": ["PRODUCT_VIEW"],
  "watches.images": ["PRODUCT_VIEW"],
  "accessories.search": ["ACCESSORY_VIEW"],
  "work.open": ["PRODUCT_VIEW", "TASK_VIEW"],
  "people.search": ["TASK_VIEW"],
  "technical.catalog": ["SERVICE_VIEW"],
};
export function hasAssistantPermission(actor: AssistantAuthority, permission: string) {
  return actor.admin || expandPermissions(actor.permissions).has(permission);
}
export function lookupAllowed(actor: AssistantAuthority, tool: string) {
  const required = LOOKUP_PERMISSIONS[tool];
  return !!required && required.every(code => hasAssistantPermission(actor, code)) &&
    (tool !== "people.search" || hasAssistantPermission(actor,"TASK_MANAGE") || hasAssistantPermission(actor,"SERVICE_CREATE"));
}
export function planDeniedReason(actor: AssistantAuthority, plan: AssistantPlan): string | null {
  const required = new Set(["PRODUCT_VIEW", "TASK_VIEW"]);
  if (plan.customerId) required.add("CUSTOMER_VIEW");
  if (plan.conditions.some(c => c.kind === "TASK")) required.add("TASK_MANAGE");
  if (plan.conditions.some(c => c.kind === "TECHNICAL")) { required.add("SERVICE_VIEW"); required.add("SERVICE_CREATE"); }
  return [...required].every(code => hasAssistantPermission(actor, code)) ? null
    : "Tài khoản hiện tại chưa có quyền thực hiện các hành động trong đề xuất này. Bạn có thể tiếp tục trao đổi hoặc nhờ người có quyền xử lý.";
}
export function assistantCapabilities(actor: AssistantAuthority) {
  return {
    allowedLookups: Object.keys(LOOKUP_PERMISSIONS).filter(tool => lookupAllowed(actor, tool)),
    canCreateTasks: ["PRODUCT_VIEW", "TASK_VIEW", "TASK_MANAGE"].every(p => hasAssistantPermission(actor, p)),
    canCreateTechnical: ["PRODUCT_VIEW", "TASK_VIEW", "SERVICE_CREATE"].every(p => hasAssistantPermission(actor, p)),
    taskScope: hasAssistantPermission(actor, "TASK_VIEW_ALL") ? "all non-personal tasks" : "only tasks visible in the existing task workflow",
    approvalRequired: true,
  };
}
