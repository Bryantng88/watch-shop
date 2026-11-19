import { PERMISSIONS as P } from "@/constants/permissions";
import { contactAccess, VENDOR_READ_PERMISSIONS } from "./contact-access";

export const USER_DIRECTORY_READ_PERMISSIONS = [P.USER_VIEW, P.USER_MANAGE] as const;
export const DIRECTORY_READ_PERMISSIONS = [...USER_DIRECTORY_READ_PERMISSIONS, P.CUSTOMER_VIEW, ...VENDOR_READ_PERMISSIONS] as const;
export const DIRECTORY_ROUTES = ["/admin/directory", "/admin/users", "/admin/customers", "/admin/vendors"];
export type DirectoryEntry = { href: string; label: string };
export function directoryEntries(user: { roles?: string[]; permissions: string[] }): DirectoryEntry[] {
  return [
    { href: "/admin/users", label: "Người dùng", allowed: user.roles?.includes("ADMIN") || USER_DIRECTORY_READ_PERMISSIONS.some(p => user.permissions.includes(p)) },
    { href: "/admin/customers", label: "Khách hàng", allowed: contactAccess(user, "customers").read },
    { href: "/admin/vendors", label: "Nhà cung cấp / Vendor", allowed: contactAccess(user, "vendors").read },
  ].filter(entry => entry.allowed).map(({ href, label }) => ({ href, label }));
}
