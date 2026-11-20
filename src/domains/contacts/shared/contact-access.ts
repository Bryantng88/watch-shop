import { PERMISSIONS as P } from "@/constants/permissions";
import type { ContactKind } from "./contact-directory";
export const VENDOR_READ_PERMISSIONS = [P.SERVICE_VIEW, P.ACQUISITION_VIEW_ALL, P.WATCH_ACQUISITION_VIEW, P.ACCESSORY_ACQUISITION_VIEW, P.PRODUCT_VIEW] as const;
type User = { roles?: string[]; permissions: string[] };
export function contactAccess(user: User, kind: ContactKind) {
  const admin = user.roles?.includes("ADMIN") ?? false;
  return {
    read: admin || (kind === "customers" ? user.permissions.includes(P.CUSTOMER_VIEW) : VENDOR_READ_PERMISSIONS.some(p => user.permissions.includes(p))),
    // No vendor-management permission exists yet. Do not turn acquisition/product
    // read access into permission to edit the canonical vendor directory.
    create: admin || (kind === "customers" && user.permissions.includes(P.CUSTOMER_CREATE)),
    update: admin || (kind === "customers" && user.permissions.includes(P.CUSTOMER_UPDATE)),
  };
}
