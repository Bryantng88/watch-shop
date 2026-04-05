import { notFound } from "next/navigation";

import { requirePermission } from "@/server/auth/requirePermission";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { PERMISSIONS } from "@/constants/permissions";
import * as adminProductService from "@/app/(admin)/admin/products/_server/product.service";

import ProductEditClient from "./_client/ProductEditClient";

export const metadata = {
    title: "Chỉnh sửa sản phẩm",
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

export default async function ProductEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

    const user = await getCurrentUser();
    const canViewTradeFinancials = hasAdminRole(user);

    const { id } = await params;
    const data = await adminProductService.getEditDetail(id);

    if (!data) {
        notFound();
    }

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 lg:px-6">
            <ProductEditClient
                initialData={data}
                canViewTradeFinancials={canViewTradeFinancials}
            />
        </div>
    );
}