import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import {
    updateProductPricingField,
    type ProductPricingField,
} from "@/app/(admin)/admin/products/_server/pricing/product-pricing.service";
import { notifyUsersByRole } from "@/app/(admin)/admin/notifications/notification.service";

function normalizeMoney(input: unknown) {
    if (input === null || input === undefined || input === "") return null;
    const n = Number(input);
    return Number.isFinite(n) ? n : null;
}

function fieldLabel(field: ProductPricingField) {
    switch (field) {
        case "salePrice":
            return "giá bán";
        case "minPrice":
            return "giá sale";
        case "purchasePrice":
            return "giá mua";
        default:
            return field;
    }
}

function moneyText(value: number | null) {
    if (value == null || Number.isNaN(value)) return "chưa có";
    return new Intl.NumberFormat("vi-VN").format(value);
}

export async function PATCH(
    req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params;
        const cookieStore = await cookies();
        const authUserId = cookieStore.get("auth_token")?.value;

        if (!authUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const authUser = await prisma.user.findUnique({
            where: { id: authUserId },
            select: {
                id: true,
                name: true,
                roles: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!authUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const roleNames = authUser.roles.map((r) => String(r.name).toUpperCase());
        const canEdit =
            roleNames.includes("ADMIN") || roleNames.includes("SALE_MANAGER");

        if (!canEdit) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const field = String(body?.field ?? "") as ProductPricingField;

        if (!field || !["minPrice", "salePrice", "purchasePrice"].includes(field)) {
            return NextResponse.json({ message: "Field không hợp lệ" }, { status: 400 });
        }

        const oldSnapshot = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                //minPrice: true,
                salePrice: true,
                purchasePrice: true,
            },
        });

        if (!oldSnapshot) {
            return NextResponse.json({ message: "Không tìm thấy sản phẩm" }, { status: 404 });
        }

        const nextValue = normalizeMoney(body?.value);

        const updated = await updateProductPricingField({
            productId: id,
            field,
            value: nextValue,
        });

        const beforeValue =
            field === "salePrice"
                ? oldSnapshot.salePrice
                : field === "minPrice"
                    ? oldSnapshot.minPrice
                    : oldSnapshot.purchasePrice;

        const changed = Number(beforeValue ?? -1) !== Number(nextValue ?? -1);

        if (changed) {
            await notifyUsersByRole({
                role: ["SALE", "ADMIN"],
                type: "PRODUCT_PRICE_UPDATED",
                priority: "HIGH",
                title: "Giá sản phẩm đã thay đổi",
                message: `${oldSnapshot.title} vừa được cập nhật ${fieldLabel(field)}: ${moneyText(
                    beforeValue != null ? Number(beforeValue) : null
                )} → ${moneyText(nextValue)}`,
                metadata: {
                    productId: oldSnapshot.id,
                    field,
                    oldValue: beforeValue,
                    newValue: nextValue,
                    route: `/admin/products/${oldSnapshot.id}/edit`,
                },
            });
        }

        return NextResponse.json({
            ok: true,
            item: updated,
        });
    } catch (err: any) {
        return NextResponse.json(
            { message: err?.message || "Cập nhật giá thất bại" },
            { status: 500 }
        );
    }
}