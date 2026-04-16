import { notFound } from "next/navigation";

import WatchFormClient from "@/domains/watch/client/WatchFormClient";
import { getWatchEditDetail } from "@/domains/watch/server";

import { prisma } from "@/server/db/client";
import { listBrands } from "@/features/catalog/server/brands.repo";
import { listVendor } from "@/features/vendors/server/vendor.repo";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { getOptions } from "@/app/(admin)/admin/products/_components/options";
import * as prodRepo from "@/app/(admin)/admin/products/_server/core/product.repo";

export const metadata = { title: "Sửa watch · Admin" };

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

function canEditWatchPricing(user: {
    roles?: string[] | null;
    permissions?: string[] | null;
} | null) {
    const roles = (user?.roles ?? []).map((x) => String(x).trim().toUpperCase());
    const permissions = (user?.permissions ?? []).map((x) => String(x).trim());

    return (
        roles.includes("ADMIN") ||
        permissions.includes("ADMIN") ||
        permissions.includes(PERMISSIONS.PRODUCT_COST_VIEW) ||
        permissions.includes(PERMISSIONS.PRODUCT_UPDATE)
    );
}

export default async function EditWatchPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

    const user = await getCurrentUser();
    const canEditPricing = canEditWatchPricing(user);
    const { id } = await params;

    const [detail, brands, vendors, opts, categoryOptions, strapInventoryOptions] =
        await Promise.all([
            getWatchEditDetail(id),
            listBrands(),
            listVendor(),
            getOptions(),
            prodRepo.listActiveProductCategories(prisma),
            prodRepo.listAvailableStrapInventory(prisma),
        ]);

    if (!detail) notFound();

    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
            <WatchFormClient
                detail={serialize(detail)}
                brands={serialize(brands)}
                vendors={serialize(vendors)}
                options={serialize(opts)}
                categoryOptions={serialize(categoryOptions)}
                strapInventoryOptions={serialize(strapInventoryOptions)}
                canEditPricing={canEditPricing}
            />
        </div>
    );
}