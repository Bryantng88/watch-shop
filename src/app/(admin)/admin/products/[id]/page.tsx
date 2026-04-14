import { notFound } from "next/navigation";

import { requirePermission } from "@/server/auth/requirePermission";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { PERMISSIONS } from "@/constants/permissions";
import * as adminProductService from "@/app/(admin)/admin/products/_server/core/product.service";

import ProductDetailClient from "./_client/ProductDetailClient";

export const metadata = {
    title: "Chi tiết sản phẩm",
};

function hasAdminRole(user: {
    roles?: string[] | null;
    permissions?: string[] | null;
} | null) {
    const roles = (user?.roles ?? []).map((x) => String(x).trim().toUpperCase());
    const permissions = (user?.permissions ?? []).map((x) => String(x).trim());

    return (
        roles.includes("ADMIN") ||
        permissions.includes("ADMIN") ||
        permissions.includes("PRODUCT_COST_VIEW") ||
        permissions.includes(PERMISSIONS.PRODUCT_UPDATE)
    );
}


function canViewTradeFinancials(user: {
    roles?: string[] | null;
    permissions?: string[] | null;
} | null) {
    const roles = (user?.roles ?? []).map((x) => String(x).trim().toUpperCase());
    const permissions = (user?.permissions ?? []).map((x) => String(x).trim());

    return (
        roles.includes("ADMIN") ||
        permissions.includes("ADMIN") ||
        permissions.includes("PRODUCT_COST_VIEW")
    );
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requirePermission(PERMISSIONS.PRODUCT_VIEW);

    const user = await getCurrentUser();
    const canViewTradeFinancialsValue = canViewTradeFinancials(user);

    const { id } = await params;
    const data = await adminProductService.detail(id);

    if (!data) {
        notFound();
    }

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 lg:px-6">
            <ProductDetailClient
                data={data}
                canViewTradeFinancials={canViewTradeFinancialsValue} />
        </div>
    );
}