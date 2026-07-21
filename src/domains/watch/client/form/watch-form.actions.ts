"use server";

import { after } from "next/server";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";

import type { WatchFormValues } from "./watch-form.types";
import { submitWatchFormApplication } from "../../application";

function getAuthUserId(auth: any) {
    return auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
}

function authHasPermission(auth: any, permission: string) {
    const permissions =
        auth?.permissions ??
        auth?.user?.permissions ??
        auth?.role?.permissions ??
        [];

    return Array.isArray(permissions) && permissions.includes(permission);
}

function authHasRole(auth: any, role: string) {
    const roles = auth?.roles ?? auth?.user?.roles ?? [];
    const target = role.toUpperCase();

    return Array.isArray(roles) && roles.some((item) => {
        if (typeof item === "string") return item.toUpperCase() === target;
        const value = item?.name ?? item?.code ?? item?.key ?? item?.slug ?? "";
        return String(value).toUpperCase() === target;
    });
}

export async function submitWatchForm(values: WatchFormValues) {
    const auth = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

    return submitWatchFormApplication(values, {
        userId: getAuthUserId(auth),
        canReviewContent: authHasPermission(
            auth,
            PERMISSIONS.PRODUCT_APPROVE
        ),
        canEditPrice: authHasRole(auth, "ADMIN"),
        deferConsumers: (work) => after(work),
    });
}
