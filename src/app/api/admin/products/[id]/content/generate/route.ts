import { NextRequest, NextResponse } from "next/server";
import {
    buildFacts,
    buildRuleBasedContent,
    callResponsesJson,
    contentSchema,
    contentToneInstruction,
} from "@/app/(admin)/admin/products/_server/product-ai.server";
import type {
    GeneratedPayload,
    TonePreset,
} from "@/app/(admin)/admin/products/_server/product-ai.type";

export async function POST(req: NextRequest) {
    try {
        const {
            watchSpec,
            title,
            brandName,
            promptHint,
            toneSample,
            tonePreset,
            focusPoints,
        } = await req.json();

        const preset = (tonePreset || "balanced") as TonePreset;
        const focus = Array.isArray(focusPoints) ? focusPoints : [];
        const ruleDraft = buildRuleBasedContent({
            title,
            brandName,
            watchSpec,
        });
        const { facts, missingData } = buildFacts(watchSpec);

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                generated: ruleDraft,
                meta: {
                    mode: "rule",
                    model: null,
                    message: "Thiếu OPENAI_API_KEY, dùng fallback rule-based.",
                },
            });
        }

        const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini";

        const input = [
            {
                role: "developer",
                content: [
                    {
                        type: "input_text",
                        text: [
                            "Bạn là copywriter chuyên viết nội dung cho đồng hồ vintage cao cấp tại thị trường Việt Nam.",
                            "Không bịa dữ kiện.",
                            "Không dùng claim 'zin', 'NOS', 'nguyên bản', 'hiếm', 'đã serviced' nếu facts không xác nhận.",
                            contentToneInstruction(preset),
                            "Ưu tiên tiếng Việt tự nhiên, đúng chất người bán đồng hồ thật.",
                            "Giữ cấu trúc đọc mượt, tránh sáo rỗng.",
                        ].join(" "),
                    },
                ],
            },
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: `
TONE PRESET:
${preset}

FOCUS POINTS:
${focus.join(", ") || "balanced"}

GỢI Ý THÊM:
${promptHint || "Không có"}

MẪU VĂN PHONG THAM CHIẾU:
${toneSample || "Không có"}

FACTS:
${JSON.stringify(facts, null, 2)}

MISSING DATA:
${JSON.stringify(missingData, null, 2)}

RULE-BASED DRAFT:
${JSON.stringify(ruleDraft, null, 2)}

Hãy viết lại tốt hơn rule-based draft, nhưng tuyệt đối không bịa dữ kiện.
            `.trim(),
                    },
                ],
            },
        ];

        const generated = await callResponsesJson<GeneratedPayload>({
            apiKey: process.env.OPENAI_API_KEY,
            model,
            input,
            jsonSchema: contentSchema(),
        });

        return NextResponse.json({
            generated,
            meta: {
                mode: "openai",
                model,
                message: null,
            },
        });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Generate content failed" },
            { status: 500 }
        );
    }
}