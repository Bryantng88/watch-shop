import { canReadRepository } from "../repository-access";
import type {ScreenHint} from "./current-screen";
import type { CustomerRequest } from "../customer-request";
import type { Conversation, Message } from "../simulation";
import { hasAssistantPermission, type AssistantAuthority } from "../capabilities";
export type ApprovedRequest = { revision: number; request: CustomerRequest };
export type AssistantState = Conversation & { pendingImage?:string; repositorySnapshot?:string; turnRepositoryAccess?:boolean; screenHint?:ScreenHint|null; turnKeys?: string[]; turnTimes?: string[]; pinnedProductId?: string | null; approvedRequests?: ApprovedRequest[]; permissionDenied?: boolean; permissionRequestScope?: { permissions: string[]; taskIds: string[] }; permissionTaskIds?: Record<string,string>; turnReadScope?: { permissions: string[]; taskIds: string[] } };
const LEGACY_PERMISSIONS = ["PRODUCT_VIEW", "CUSTOMER_VIEW", "TASK_VIEW", "TASK_MANAGE", "SERVICE_VIEW", "ACCESSORY_VIEW"];
export function readableMessages(s: AssistantState, actor: AssistantAuthority): Message[] {
  return s.messages.map(m => {
    if(m.role==="assistant"&&m.repositoryAccess&&!canReadRepository(actor))return {id:m.id,role:m.role,text:"Nội dung phân tích mã nguồn không còn nằm trong quyền truy cập hiện tại của bạn.",requiredPermissions:[]};
    const required = m.requiredPermissions ?? (m.role === "assistant" ? LEGACY_PERMISSIONS : []);
    if (m.role === "assistant" && ((!m.requiredPermissions && !actor.admin) || !required.every(p => hasAssistantPermission(actor, p)))) {
      return { id: m.id, role: m.role, text: "Nội dung nghiệp vụ này không còn nằm trong quyền truy cập hiện tại của bạn.", requiredPermissions: [] };
    }
    return { ...m, requiredPermissions: required, products: undefined, ...(!hasAssistantPermission(actor, "PRODUCT_VIEW") ? { imageProductIds: undefined } : {}) };
  });
}
export function workerHistory(s: AssistantState, actor: AssistantAuthority) {
  const messages = readableMessages(s, actor);
  // Original history remains in the DB. This bounded digest is untrusted user text,
  // never evidence, authority, or approval; business state is supplied separately.
  const olderUserNotes = messages.slice(0, -12).filter(m => m.role === "user").map(m => m.text).join("\n").slice(-6000);
  return { olderUserNotes, messages: messages.slice(-12).map(m => ({ id: m.id, role: m.role, text: m.text.slice(-4000) })) };
}
export function archiveApproved(s: AssistantState, revision: number | null): AssistantState {
  const next = structuredClone(s);
  if (s.customerRequest && revision !== null) {
    next.approvedRequests=(next.approvedRequests||[]).filter(r=>r.revision!==revision);
    next.approvedRequests = [...(next.approvedRequests || []), { revision, request: structuredClone(s.customerRequest) }];
  }
  return next;
}
