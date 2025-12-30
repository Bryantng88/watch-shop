import { PERMISSIONS } from "@/constants/permissions";

export const ROLE_PERMISSIONS: Record<string, string[]> = {
    ADMIN: Object.values(PERMISSIONS),

    STAFF: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.PRODUCT_VIEW,
        PERMISSIONS.ORDER_VIEW,
        PERMISSIONS.INVOICE_VIEW,
    ],
};
