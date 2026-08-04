import { PERMISSIONS } from "@/constants/permissions";
import { expandPermissions } from "./permission-implications";

export type AdminAccessPolicy = {
    anyOf: readonly string[];
    allOf?: readonly string[];
};

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function anyOf(...codes: string[]): AdminAccessPolicy {
    return { anyOf: codes };
}

function publicToAuthenticatedUser(): AdminAccessPolicy {
    return { anyOf: [] };
}

export function isAdminAccessAllowed(
    policy: AdminAccessPolicy | null,
    permissions: ReadonlySet<string>,
) {
    if (!policy) return false;
    const effectivePermissions = expandPermissions(permissions);
    const anyAllowed = policy.anyOf.length === 0 || policy.anyOf.some((code) => effectivePermissions.has(code));
    const allAllowed = (policy.allOf ?? []).every((code) => effectivePermissions.has(code));
    return anyAllowed && allAllowed;
}

export function getAdminApiPolicy(pathname: string, method: string): AdminAccessPolicy | null {
    const normalizedMethod = method.toUpperCase();
    const read = READ_METHODS.has(normalizedMethod);

    if (/^\/api\/media(\/|$)/.test(pathname)) {
        return anyOf(read ? PERMISSIONS.MEDIA_VIEW : PERMISSIONS.PRODUCT_UPDATE);
    }

    if (/^\/api\/admin\/(profile|notifications)(\/|$)/.test(pathname)) {
        return publicToAuthenticatedUser();
    }

    if (/^\/api\/admin\/users\/technicians(\/|$)/.test(pathname)) {
        return anyOf(PERMISSIONS.SERVICE_VIEW, PERMISSIONS.TASK_VIEW, PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE);
    }
    if (pathname === "/api/admin/users" && normalizedMethod === "POST") {
        return anyOf(PERMISSIONS.USER_CREATE, PERMISSIONS.USER_MANAGE);
    }
    if (/^\/api\/admin\/users\/[^/]+$/.test(pathname) && normalizedMethod === "PATCH") {
        return anyOf(PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_MANAGE);
    }
    if (/^\/api\/admin\/(roles|permissions)(\/|$)/.test(pathname)) {
        return anyOf(PERMISSIONS.USER_MANAGE);
    }

    if (/^\/api\/admin\/watches(\/|$)/.test(pathname)) {
        if (read) return anyOf(PERMISSIONS.PRODUCT_VIEW);
        if (/\/(content-review|image-review|content-draft|image-draft)$/.test(pathname)) return anyOf(PERMISSIONS.PRODUCT_APPROVE);
        if (/\/quick-order$/.test(pathname)) return anyOf(PERMISSIONS.ORDER_CREATE);
        return anyOf(PERMISSIONS.PRODUCT_UPDATE);
    }

    if (/^\/api\/admin\/acquisitions(\/|$)/.test(pathname)) {
        if (/\/trade-in-orders$/.test(pathname)) return anyOf(PERMISSIONS.PRODUCT_CREATE);
        if (/\/payment$/.test(pathname)) {
            return anyOf(read ? PERMISSIONS.PAYMENT_VIEW : PERMISSIONS.PAYMENT_CREATE, PERMISSIONS.PAYMENT_UPDATE);
        }
        if (read) return anyOf(PERMISSIONS.ACQUISITION_VIEW, PERMISSIONS.STRAP_ACQUISITION_VIEW);
        if (pathname === "/api/admin/acquisitions" || /\/(inline-submit|create-with-ai|ai-draft|line-ai-draft)$/.test(pathname)) {
            return anyOf(PERMISSIONS.ACQUISITION_CREATE, PERMISSIONS.STRAP_ACQUISITION_CREATE);
        }
        if (/\/(post|bulk-post)$/.test(pathname)) return anyOf(PERMISSIONS.ACQUISITION_APPROVE);
        if (/\/cancel$/.test(pathname)) return anyOf(PERMISSIONS.ACQUISITION_DELETE);
        return anyOf(PERMISSIONS.ACQUISITION_UPDATE, PERMISSIONS.STRAP_ACQUISITION_UPDATE);
    }

    if (/^\/api\/admin\/orders(\/|$)/.test(pathname)) {
        if (/\/quick-form$/.test(pathname)) return anyOf(PERMISSIONS.ORDER_CREATE);
        if (/\/shipments\/active$/.test(pathname)) return anyOf(PERMISSIONS.SHIPMENT_VIEW);
        if (/\/mark-shipment-delivered$/.test(pathname)) return anyOf(PERMISSIONS.SHIPMENT_UPDATE);
        if (/\/payments?$/.test(pathname)) {
            return anyOf(read ? PERMISSIONS.PAYMENT_VIEW : PERMISSIONS.PAYMENT_CREATE, PERMISSIONS.PAYMENT_UPDATE);
        }
        if (read) return anyOf(PERMISSIONS.ORDER_VIEW);
        if (pathname === "/api/admin/orders") return anyOf(PERMISSIONS.ORDER_CREATE);
        if (/\/(post|bulk-post|finalize-by-paid)$/.test(pathname)) return anyOf(PERMISSIONS.ORDER_APPROVE);
        if (/\/cancel$/.test(pathname)) return anyOf(PERMISSIONS.ORDER_DELETE);
        return anyOf(PERMISSIONS.ORDER_UPDATE);
    }

    if (/^\/api\/admin\/payments(\/|$)/.test(pathname)) {
        return anyOf(read ? PERMISSIONS.PAYMENT_VIEW : PERMISSIONS.PAYMENT_UPDATE);
    }

    if (/^\/api\/admin\/shipments(\/|$)/.test(pathname)) {
        if (read) return anyOf(PERMISSIONS.SHIPMENT_VIEW);
        if (pathname === "/api/admin/shipments" && normalizedMethod === "POST") return anyOf(PERMISSIONS.SHIPMENT_CREATE);
        return anyOf(PERMISSIONS.SHIPMENT_UPDATE);
    }

    if (/^\/api\/admin\/(service-requests|service-operation)(\/|$)/.test(pathname)) {
        if (/\/watch-active$/.test(pathname)) {
            if (read) return anyOf(PERMISSIONS.SERVICE_VIEW);
            if (normalizedMethod === "POST") return anyOf(PERMISSIONS.SERVICE_CREATE);
            return anyOf(PERMISSIONS.SERVICE_UPDATE);
        }
        if (read) return anyOf(PERMISSIONS.SERVICE_VIEW);
        if (pathname === "/api/admin/service-requests" || /\/from-product$/.test(pathname)) {
            return anyOf(PERMISSIONS.SERVICE_CREATE);
        }
        return anyOf(PERMISSIONS.SERVICE_UPDATE);
    }
    if (/^\/api\/admin\/(technical-issues|maintenance-records)(\/|$)/.test(pathname)) {
        if (read) return anyOf(PERMISSIONS.SERVICE_VIEW);
        if (pathname === "/api/admin/technical-issues") return anyOf(PERMISSIONS.SERVICE_CREATE);
        if (normalizedMethod === "DELETE") return anyOf(PERMISSIONS.SERVICE_DELETE);
        return anyOf(PERMISSIONS.SERVICE_UPDATE);
    }
    if (/^\/api\/admin\/(service-catalog|technical-catalogs|catalogs\/technical)(\/|$)/.test(pathname)) {
        return anyOf(read ? PERMISSIONS.SERVICE_VIEW : PERMISSIONS.SERVICE_UPDATE);
    }

    if (/^\/api\/admin\/media(\/|$)/.test(pathname)) {
        return anyOf(read ? PERMISSIONS.MEDIA_VIEW : PERMISSIONS.PRODUCT_UPDATE);
    }

    if (/^\/api\/admin\/task-items\/manual-transition$/.test(pathname)) {
        return anyOf(
            PERMISSIONS.TASK_MANAGE,
            PERMISSIONS.PAYMENT_UPDATE,
            PERMISSIONS.SHIPMENT_UPDATE,
            PERMISSIONS.ORDER_UPDATE,
            PERMISSIONS.SERVICE_UPDATE,
            PERMISSIONS.PRODUCT_UPDATE,
        );
    }
    if (/^\/api\/admin\/coordination(\/|$)/.test(pathname)) {
        if (/\/activity$/.test(pathname)) return anyOf(PERMISSIONS.TASK_VIEW, PERMISSIONS.ACTIVITY_READ);
        return anyOf(PERMISSIONS.TASK_VIEW);
    }
    if (/^\/api\/admin\/business-entity-preview\/activity(\/|$)/.test(pathname)) {
        return anyOf(PERMISSIONS.ACTIVITY_READ);
    }
    if (/^\/api\/admin\/business-entity-preview(\/|$)/.test(pathname)) {
        return anyOf(read ? PERMISSIONS.TASK_VIEW : PERMISSIONS.ACTIVITY_EDIT);
    }

    if (/^\/api\/admin\/system\/jobs(\/|$)/.test(pathname)) {
        return anyOf(PERMISSIONS.SYSTEM_JOB_VIEW);
    }
    if (/^\/api\/admin\/system\/(workflows|blueprints)(\/|$)/.test(pathname)) {
        if (/\/validate$/.test(pathname)) return anyOf(PERMISSIONS.TASK_VIEW);
        return anyOf(read ? PERMISSIONS.TASK_VIEW : PERMISSIONS.WORK_CASE_MANAGE);
    }
    if (/^\/api\/admin\/system\/projections(\/|$)/.test(pathname)) {
        return anyOf(PERMISSIONS.SYSTEM_JOB_VIEW);
    }
    if (/^\/api\/admin\/customers(\/|$)/.test(pathname)) {
        return anyOf(PERMISSIONS.CUSTOMER_VIEW, PERMISSIONS.ORDER_VIEW);
    }
    if (/^\/api\/admin\/vendors(\/|$)/.test(pathname)) {
        return anyOf(PERMISSIONS.SERVICE_VIEW, PERMISSIONS.ACQUISITION_VIEW, PERMISSIONS.PRODUCT_VIEW);
    }
    if (/^\/api\/admin\/post-targets(\/|$)/.test(pathname)) {
        return anyOf(PERMISSIONS.PRODUCT_VIEW);
    }

    return null;
}

export function getAdminPagePolicy(pathname: string): AdminAccessPolicy | null {
    if (pathname === "/admin" || pathname.startsWith("/admin/dashboard")) return anyOf(PERMISSIONS.DASHBOARD_VIEW);
    if (/^\/admin\/(profile|users\/profile)(\/|$)/.test(pathname)) return publicToAuthenticatedUser();
    if (/^\/admin\/acquisitions\/(accessories|straps|clasps)\/new$/.test(pathname)) return anyOf(PERMISSIONS.STRAP_ACQUISITION_CREATE);
    if (/^\/admin\/acquisitions\/(watches\/)?new$/.test(pathname)) return anyOf(PERMISSIONS.ACQUISITION_CREATE);
    if (/^\/admin\/acquisitions(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.ACQUISITION_VIEW, PERMISSIONS.STRAP_ACQUISITION_VIEW);
    if (pathname === "/admin/watches/new") return anyOf(PERMISSIONS.PRODUCT_CREATE);
    if (/^\/admin\/watches\/[^/]+\/edit$/.test(pathname)) return anyOf(PERMISSIONS.PRODUCT_UPDATE);
    if (/^\/admin\/watches(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.PRODUCT_VIEW);
    if (pathname === "/admin/orders/new") return anyOf(PERMISSIONS.ORDER_CREATE);
    if (/^\/admin\/orders\/[^/]+\/edit$/.test(pathname)) return anyOf(PERMISSIONS.ORDER_UPDATE);
    if (/^\/admin\/orders(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.ORDER_VIEW);
    if (/^\/admin\/payments(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.PAYMENT_VIEW);
    if (/^\/admin\/shipments(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.SHIPMENT_VIEW);
    if (/^\/admin\/(services|catalogs\/technical)(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.SERVICE_VIEW);
    if (/^\/admin\/media(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.MEDIA_VIEW);
    if (/^\/admin\/straps(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.ACCESSORY_VIEW);
    if (/^\/admin\/(tasks|task-items|work-cases|workflows|coordination)(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.TASK_VIEW);
    if (/^\/admin\/activity(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.ACTIVITY_READ);
    if (/^\/admin\/system\/(jobs|job-logs|channels)(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.SYSTEM_JOB_VIEW);
    if (/^\/admin\/system\/(workflows|blueprints)(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.TASK_VIEW, PERMISSIONS.WORK_CASE_MANAGE);
    if (pathname === "/admin/users/new") return anyOf(PERMISSIONS.USER_CREATE, PERMISSIONS.USER_MANAGE);
    if (pathname === "/admin/users/roles") return anyOf(PERMISSIONS.USER_MANAGE);
    if (/^\/admin\/users(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.USER_VIEW, PERMISSIONS.USER_MANAGE);
    if (/^\/admin\/settings(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.TASK_VIEW);
    if (/^\/admin\/customers(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.CUSTOMER_VIEW);
    if (/^\/admin\/reports(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.REPORT_VIEW);
    if (/^\/admin\/ui-tests?(\/|$)/.test(pathname)) return anyOf(PERMISSIONS.USER_MANAGE);

    return null;
}
