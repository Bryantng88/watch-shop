import { PERMISSIONS as P } from "@/constants/permissions";

export const PRODUCT_READ_PERMISSIONS = [P.PRODUCT_VIEW, P.ACCESSORY_VIEW] as const;
export const PRODUCT_ROUTES = ["/admin/products", "/admin/watches", "/admin/straps"];
export const REPORT_READ_PERMISSIONS = [P.DASHBOARD_VIEW, P.REPORT_FINANCE_VIEW, P.REPORT_SALES_VIEW] as const;
export const REPORT_ROUTES = ["/admin/reports"];
type User = { roles?: string[]; permissions: string[] };
export function productEntries(user: User) {
  const admin = user.roles?.includes("ADMIN");
  return [
    { href: "/admin/watches", label: "Đồng hồ", allowed: admin || user.permissions.includes(P.PRODUCT_VIEW) },
    { href: "/admin/straps", label: "Phụ kiện", allowed: admin || user.permissions.includes(P.ACCESSORY_VIEW) },
  ].filter(entry => entry.allowed).map(({ href, label }) => ({ href, label }));
}
export function reportEntries(user: User) {
  const admin = user.roles?.includes("ADMIN");
  return [
    { href: "/admin/reports/overview", label: "Tổng quan", allowed: admin || user.permissions.includes(P.DASHBOARD_VIEW) },
    { href: "/admin/reports/finance", label: "Tài chính", allowed: admin || [P.REPORT_FINANCE_VIEW, P.PRODUCT_COST_VIEW, P.PAYMENT_VIEW_ALL].every(p => user.permissions.includes(p)) },
    { href: "/admin/reports/sales", label: "Bán hàng & truy cập", allowed: admin || user.permissions.includes(P.REPORT_SALES_VIEW) },
  ].filter(entry => entry.allowed).map(({ href, label }) => ({ href, label }));
}
