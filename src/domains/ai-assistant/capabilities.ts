import { canRequestProduction } from "./production-release";
import { codeEnabled } from "./code-contract";
import { canReadRepository } from "./repository-access";
import { expandPermissions } from "@/server/auth/permission-implications";
import type { AssistantPlan } from "./live-contract";

export type AssistantAuthority = { id?:string; admin: boolean; permissions: ReadonlySet<string> };
export const LOOKUP_PERMISSIONS: Readonly<Record<string, readonly string[]>> = {
  "repository.info": [], "repository.history": [], "repository.tree": [], "repository.file": [], "repository.pullRequests": [],
  "navigation.open": [],
  "media.inspect": ["PRODUCT_VIEW", "PRODUCT_UPDATE"],
  "media.draft": ["PRODUCT_VIEW", "PRODUCT_UPDATE"],
  "personalWork.today": ["TASK_VIEW"],
  "orders.list": ["ORDER_VIEW"],
  "technicalIssues.list": ["SERVICE_VIEW"],
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
  if(tool.startsWith("repository.")&&!canReadRepository(actor))return false;
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
    canDeployProduction: canRequestProduction(actor),
    canReviewProductionMain: process.env.BEN_CUSTOMER_ENVIRONMENT === "production" && canRequestProduction(actor),
    canRunCode:codeEnabled(actor),
    canMergeCode:codeEnabled(actor)&&process.env.BEN_CODE_MERGE_ENABLED==="1",
    canDeployCode:codeEnabled(actor)&&(process.env.BEN_CODE_RELEASE_TOKEN?.length||0)>=32&&process.env.BEN_CODE_RELEASE_ENABLED==="1"&&/^[a-f0-9]{64}$/.test(process.env.BEN_CODE_RELEASE_HANDLER_SHA256||""),
    canReadCode:canReadRepository(actor),
    allowedLookups: Object.keys(LOOKUP_PERMISSIONS).filter(tool => lookupAllowed(actor, tool)),
    supportedActions:["CREATE_TASK","CREATE_TECHNICAL","CREATE_DRAFT_ORDER"],
    canCreateOrders:["ORDER_CREATE","PRODUCT_VIEW"].every(p=>hasAssistantPermission(actor,p)),
    canCreateTasks: ["PRODUCT_VIEW", "TASK_VIEW", "TASK_MANAGE"].every(p => hasAssistantPermission(actor, p)),
    canCreateTechnical: ["PRODUCT_VIEW", "TASK_VIEW", "SERVICE_CREATE"].every(p => hasAssistantPermission(actor, p)),
    taskScope: hasAssistantPermission(actor, "TASK_VIEW_ALL") ? "all non-personal tasks" : "only tasks visible in the existing task workflow",
    approvalRequired: true,
  };
}
