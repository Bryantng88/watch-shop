import { NextRequest, NextResponse } from "next/server";
import {
    callResponsesJson,
    fetchImageAsDataUrl,
    specExtractSchema,
} from "@/app/(admin)/admin/products/_server/product-ai.server";
import type { ExtractedSpec } from "@/app/(admin)/admin/products/_server/product-ai.type";

export async function POST(req: NextRequest) {
    try {
        const { images } = await req.json();
        const rawUrl = images?.[0]?.url;

        if (!rawUrl) {
            return NextResponse.json({ error: "No image" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "Thiếu OPENAI_API_KEY" },
                { status: 500 }
            );
        }

        const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini";
        const imageDataUrl = await fetchImageAsDataUrl(rawUrl, req.nextUrl.origin);

        const input = [
            {
                role: "developer",
                content: [
                    {
                        type: "input_text",
                        text:
                            "Bạn là chuyên gia nhận diện đồng hồ vintage từ ảnh. " +
                            "Không bịa ref, caliber, year, material nếu không chắc. " +
                            "Nếu không đủ căn cứ, trả null. " +
                            "Luôn gán confidence cho từng field: high | medium | low.",
                    },
                ],
            },
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text:
                            "Phân tích ảnh đồng hồ này và xuất JSON theo schema. " +
                            "Ưu tiên nhận diện chính xác brand, model, movement, case material, dial color, size ước lượng.",
                    },
                    {
                        type: "input_image",
                        image_url: imageDataUrl,
                    },
                ],
            },
        ];

        const spec = await callResponsesJson<ExtractedSpec>({
            apiKey: process.env.OPENAI_API_KEY,
            model,
            input,
            jsonSchema: specExtractSchema(),
        });

        return NextResponse.json({ spec });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Spec extract failed" },
            { status: 500 }
        );
    }
}