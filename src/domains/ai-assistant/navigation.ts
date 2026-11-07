import { getAdminPagePolicy, isAdminAccessAllowed } from "@/server/auth/admin-api-policy";
import type { AssistantAuthority } from "./capabilities";
import { z } from "zod";

export const navigationIntentSchema=z.object({type:z.literal("OPEN_SCREEN"),sourceMessageId:z.string().min(1).max(100)}).strict();
export type NavigationIntent= z.infer<typeof navigationIntentSchema>;

// Model outputs select keys, never URLs. Keep this list to existing read/view pages.
export const BEN_SCREENS = [
  { key: "ben", label: "Trò chuyện với Ben", href: "/admin/ben" },
  { key: "personal-work", label: "Công việc của tôi", href: "/admin/personal-work" },
  { key: "watches", label: "Danh sách đồng hồ", href: "/admin/watches" },
  { key: "orders", label: "Đơn hàng", href: "/admin/orders" },
  { key: "customers", label: "Khách hàng", href: "/admin/customers" },
  { key: "technical", label: "Bảng xử lý lỗi kỹ thuật", href: "/admin/services/issues-board" },
  { key: "operation", label: "Không gian vận hành", href: "/admin/coordination/operation" },
  { key: "sales", label: "Không gian bán hàng", href: "/admin/coordination/sales" },
  { key: "media", label: "Thư viện media", href: "/admin/media" },
  { key: "shipments", label: "Vận chuyển", href: "/admin/shipments" },
  { key: "dashboard", label: "Tổng quan", href: "/admin" },
  { key: "profile", label: "Hồ sơ của tôi", href: "/admin/users/profile" },
] as const;
export function navigationTarget(key: string, actor: AssistantAuthority) {
  const target = BEN_SCREENS.find(screen => screen.key === key);
  return target && (actor.admin || isAdminAccessAllowed(getAdminPagePolicy(target.href), actor.permissions)) ? target : null;
}
export function availableScreens(actor: AssistantAuthority) { return BEN_SCREENS.filter(screen => navigationTarget(screen.key, actor)); }
export function resolveNavigation(key:string,intent:NavigationIntent,latestMessageId:string|undefined,actor:AssistantAuthority){
 const denied=(code:string,reason:string)=>({allowed:false,code,reason});
 if(!latestMessageId||intent.sourceMessageId!==latestMessageId)return denied("STALE_INTENT","Yêu cầu mở màn hình không còn khớp tin nhắn hiện tại. Bạn nhắn lại yêu cầu nhé.");
 if(!BEN_SCREENS.some(s=>s.key===key))return denied("UNSUPPORTED_TARGET","Ben chưa hỗ trợ mở màn hình này. Bạn cho mình biết màn hình cần đến nhé.");
 const target=navigationTarget(key,actor);
 if(!target)return denied("PERMISSION_DENIED","Tài khoản hiện tại chưa có quyền mở màn hình này. Bạn có thể liên hệ Long để được hỗ trợ về quyền hạn.");
 return {allowed:true,code:"READY",navigationKey:target.key,label:target.label,requestKey:latestMessageId,reason:`Mình đã chuẩn bị mở ${target.label}. Nếu trang chưa chuyển, bạn bấm liên kết bên dưới nhé.`};
}
