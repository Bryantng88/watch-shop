import { NextResponse } from "next/server";
import * as pricingService from "@/server/services/product-pricing.service";
import { requireAdminUser } from "@/server/auth/require-admin-user";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdminUser();

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Missing product id" }, { status: 400 });
        }

        const body = await req.json().catch(() => null);
        const field = body?.field;
        const value = body?.value;

        if (!field || !["minPrice", "salePrice", "purchasePrice"].includes(field)) {
            return NextResponse.json({ error: "Invalid pricing field" }, { status: 400 });
        }

        if (
            value !== null &&
            value !== undefined &&
            (typeof value !== "number" || !Number.isFinite(value) || value < 0)
        ) {
            return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
        }

        const result = await pricingService.updateProductPricing({
            productId: id,
            field,
            value: value ?? null,
        });

        return NextResponse.json({
            ok: true,
            item: result,
        });
    } catch (error: any) {
        const message = error?.message || "Update pricing failed";

        if (message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (message === "FORBIDDEN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (message === "PRODUCT_NOT_FOUND") {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}