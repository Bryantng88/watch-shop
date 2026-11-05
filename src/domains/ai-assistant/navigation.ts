import { getAdminPagePolicy, isAdminAccessAllowed } from "@/server/auth/admin-api-policy";
import type { AssistantAuthority } from "./capabilities";

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
export function isNavigationRequest(text: string) {
  const normalized = text.normalize("NFC").replace(/\s+/g, " ").trim();
  return /(?:mở|vào|chuyển|đi tới|đi đến|(?:tới|đến) (?:trang|màn hình)|(?:đưa|dẫn) (?:mình|tôi|em|anh|tớ|ta|bạn) (?:đến|tới|sang|vào)|điều hướng|open|navigate|go to)/iu.test(normalized);
}
