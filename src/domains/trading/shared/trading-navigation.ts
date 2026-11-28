import { PERMISSIONS as P } from "@/constants/permissions";

export const TRADING_READ_PERMISSIONS = [P.ACQUISITION_VIEW_ALL, P.WATCH_ACQUISITION_VIEW, P.ACCESSORY_ACQUISITION_VIEW, P.ORDER_VIEW] as const;
export const TRADING_ROUTES = ["/admin/trading", "/admin/acquisitions", "/admin/orders", "/admin/consignments"];
export type TradingEntry = { href: string; label: string };
export function tradingEntries(user: { roles?: string[]; permissions: string[] }): TradingEntry[] {
  const admin = user.roles?.includes("ADMIN");
  return [
    { href: "/admin/acquisitions", label: "Phiếu nhập", allowed: admin || TRADING_READ_PERMISSIONS.slice(0, 3).some(p => user.permissions.includes(p)) },
    { href: "/admin/orders", label: "Đơn hàng", allowed: admin || user.permissions.includes(P.ORDER_VIEW) },
    { href: "/admin/consignments", label: "Ký gửi", allowed: admin || user.permissions.includes(P.WATCH_ACQUISITION_VIEW) || user.permissions.includes(P.ACQUISITION_VIEW_ALL) },
  ].filter(entry => entry.allowed).map(({ href, label }) => ({ href, label }));
}
