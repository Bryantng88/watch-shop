import { NextResponse } from "next/server";
import { z } from "zod";
import { adminProductService } from "@/features/products/server/product.service";

const StrapMaterialSchema = z.enum([
    "LEATHER",
    "BRACELET",
    "RUBBER",
    "NATO",
    "CANVASS",
    "SPECIAL",
]);

const StrapRowSchema = z.object({
    title: z.string().min(1),
    material: StrapMaterialSchema,
    price: z.coerce.number().min(0),
    quantity: z.coerce.number().int().min(1),
});

const BodySchema = z.object({
    vendorId: z.string().optional(),
    vendorName: z.string().optional(),
    vendorPhone: z.string().optional(),
    vendorEmail: z.string().optional(),
    currency: z.string().default("VND"),
    acquiredAt: z.string().optional(),
    notes: z.string().optional(),
    rows: z.array(StrapRowSchema).min(1),
});

export async function POST(req: Request) {
    try {
        const raw = await req.json();
        const body = BodySchema.parse(raw);

        if (!body.vendorId && !body.vendorName?.trim()) {
            return NextResponse.json(
                { ok: false, error: "Vui lòng chọn vendor hoặc nhập vendor nhanh." },
                { status: 400 }
            );
        }

        const created: Array<{
            title: string;
            productId: string;
            acquisitionId: string;
        }> = [];

        for (const row of body.rows) {
            const result = await adminProductService.create({
                title: row.title,
                type: "WATCH_STRAP",
                price: row.price,
                purchasePrice: row.price,
                stockQty: row.quantity,
                strap: row.material,
                material: row.material,

                vendorId: body.vendorId,
                vendorName: body.vendorName,
                vendorPhone: body.vendorPhone,
                vendorEmail: body.vendorEmail,

                currency: body.currency,
                acquiredAt: body.acquiredAt,
                notes: body.notes,
            });

            created.push({
                title: row.title,
                productId: result.productId,
                acquisitionId: result.acquisitionId,
            });
        }

        return NextResponse.json({
            ok: true,
            message: `Đã tạo ${created.length} dòng dây`,
            items: created,
        });
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err?.message || "Tạo dây thất bại" },
            { status: 400 }
        );
    }
}