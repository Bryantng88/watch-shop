import { NextRequest, NextResponse } from "next/server";
import {
    buildMainPrompt,
    buildRefinePrompt,
} from "./product-content.prompt"
import {
    resolveContentImagesAsDataUrls,
} from "./product-content.image"
import {
    cleanupGeneratedPayload,
    looksTooGeneric,
} from "./product-content.clean"
import type {
    GeneratedPayload,
} from "./product-content.types";

import {
    buildFacts,
    buildRuleBasedContent,
    callResponsesJson,
    contentSchema,
} from "@/app/(admin)/admin/products/_server/product-ai.server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));

        const {
            watchSpec,
            title,
            brandName,
            categoryName,
            promptMeta,
            images,
        } = body ?? {};

        const fallbackDraft = buildRuleBasedContent({
            title,
            brandName,
            watchSpec,
        });

        const { facts, missingData } = buildFacts(watchSpec);

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                generated: cleanupGeneratedPayload(fallbackDraft),
                meta: { mode: "rule" },
            });
        }

        const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini";

        const origin =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.APP_URL ||
            "http://localhost:3000";

        const dataUrls = await resolveContentImagesAsDataUrls(
            images ?? [],
            origin
        );

        const input = buildMainPrompt({
            title,
            brandName,
            categoryName,
            facts,
            missingData,
            promptMeta,
            hasImages: dataUrls.length > 0,
            imageDataUrls: dataUrls,
        });

        const firstPass = await callResponsesJson<GeneratedPayload>({
            apiKey: process.env.OPENAI_API_KEY!,
            model,
            input,
            jsonSchema: contentSchema(),
        });

        let cleaned = cleanupGeneratedPayload(firstPass);

        if (looksTooGeneric(cleaned)) {
            const refined = await callResponsesJson<GeneratedPayload>({
                apiKey: process.env.OPENAI_API_KEY!,
                model,
                input: buildRefinePrompt({
                    original: cleaned,
                    promptMeta,
                }),
                jsonSchema: contentSchema(),
            });

            cleaned = cleanupGeneratedPayload(refined);
        }

        return NextResponse.json({
            generated: cleaned,
            meta: {
                mode: "openai",
                productId: id,
                imageCount: dataUrls.length,
            },
        });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json(
            { error: e?.message || "Generate failed" },
            { status: 500 }
        );
    }
}