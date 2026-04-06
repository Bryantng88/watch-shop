import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, PencilLine } from "lucide-react";

import EditProductForm from "../../_client/EditProductForm";
import { detail } from "../../_server/product.service";
import * as prodRepo from "../../_server/product.repo";
import { getOptions } from "../../_components/options";

import { prisma } from "@/server/db/client";
import { listBrands } from "@/features/catalog/server/brands.repo";
import { listVendor } from "@/features/vendors/server/vendor.repo";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { PERMISSIONS } from "@/constants/permissions";

export const metadata = { title: "Sửa sản phẩm · Admin" };

function serialize(obj: any) {
    return JSON.parse(JSON.stringify(obj, (_key, value) => {
        if (value instanceof Date) return value.toISOString();
        if (typeof value === "object" && value?._isDecimal) return Number(value);
        return value;
    }));
}

function hasAdminRole(user: any) {
    const roles = (user?.roles ?? []).map((x: any) => String(x).trim().toUpperCase());
    const permissions = (user?.permissions ?? []).map((x: any) => String(x).trim());
    return roles.includes("ADMIN") || permissions.includes("ADMIN") || permissions.includes(PERMISSIONS.PRODUCT_COST_VIEW) || permissions.includes(PERMISSIONS.PRODUCT_PRICE_EDIT);
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();

    const [data, brands, vendors, opts, categoryOptions, strapInventoryOptions] = await Promise.all([
        detail(id),
        listBrands(),
        listVendor(),
        getOptions(),
        prodRepo.listActiveProductCategories(prisma),
        prodRepo.listAvailableStrapInventory(prisma),
    ]);

    if (!data) notFound();
    const product = data.product;

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 lg:px-6">
            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <Link href="/admin/products" className="hover:text-slate-700">Sản phẩm</Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href={`/admin/products/${product.id}`} className="truncate hover:text-slate-700">{product.title}</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="truncate">Chỉnh sửa</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Chỉnh sửa sản phẩm</h1>
                                <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                                    <PencilLine className="h-4 w-4" /> {product.title}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                <span>ID: <span className="font-mono text-slate-700">{product.id}</span></span>
                                <span>Brand: <span className="font-medium text-slate-700">{product.brand?.name || "-"}</span></span>
                                <span>Category: <span className="font-medium text-slate-700">{product.ProductCategory?.name || "-"}</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/products/${product.id}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Xem chi tiết</Link>
                        <Link href="/admin/products" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">← Quay lại</Link>
                    </div>
                </div>

                <EditProductForm
                    initial={serialize(product)}
                    brands={serialize(brands)}
                    vendors={serialize(vendors)}
                    productStatusOptions={serialize(opts.productStatus)}
                    availabilityStatusOptions={serialize(opts.availabilityStatus)}
                    typeOptions={serialize(opts.type)}
                    caseOptions={serialize(opts.case)}
                    movementOptions={serialize(opts.movement)}
                    caseMaterialOptions={serialize(opts.caseMaterial)}
                    genderOptions={serialize(opts.gender)}
                    strapOptions={serialize(opts.strap)}
                    glassOptions={serialize(opts.glass)}
                    goldColorOptions={serialize(opts.goldColor)}
                    complicationOptions={serialize(opts.complication)}
                    categoryOptions={serialize(categoryOptions)}
                    strapInventoryOptions={serialize(strapInventoryOptions)}
                    canViewPricing={hasAdminRole(user)}
                />
            </div>
        </div>
    );
}
