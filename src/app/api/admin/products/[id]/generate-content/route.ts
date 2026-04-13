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

import {
    analyzeGeneratedPayload,
    hardenGeneratedPayload,
    buildRetryFeedback,
} from "./product-content.style-engine";

import { buildStyleRetryPrompt } from "./product-content.prompt";

type PromptMetaInput = {
    narrative?: string;
    audience?: string;
    structure?: string;
    tonePreset?: string;
    focusPoints?: string[];
    customBrief?: string;
    bannedPhrases?: string;
    referenceSample?: string;
    forceSections?: string[];
};

type InputImageEntry = {
    key?: string | null;
    url?: string | null;
};

function cleanupText(text: unknown) {
    return String(text ?? "")
        .replace(/\bphù hợp nhiều đối tượng\b/gi, "")
        .replace(/\bdễ phối mọi phong cách\b/gi, "")
        .replace(/\bhoàn hảo cho mọi dịp\b/gi, "")
        .replace(/\bchiếc đồng hồ này rất đẹp\b/gi, "")
        .replace(/\bthông tin này phù hợp người muốn\b/gi, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function cleanupArray(input: unknown) {
    if (!Array.isArray(input)) return [];
    return input
        .map((x) => String(x ?? "").replace(/^[•▪️\-\s]+/g, "").trim())
        .filter(Boolean);
}

function cleanupGeneratedPayload(
    input: Partial<GeneratedPayload> | null | undefined
): GeneratedPayload {
    return {
        specBullets: cleanupArray(input?.specBullets),
        promoteShort: cleanupText(input?.promoteShort),
        promoteLong: cleanupText(input?.promoteLong),
        facebookCaption: cleanupText(input?.facebookCaption),
        instagramCaption: cleanupText(input?.instagramCaption),
        titleOptions: cleanupArray(input?.titleOptions),
        hashtags: cleanupArray(input?.hashtags),
        missingData: cleanupArray(input?.missingData),
        safetyNotes: cleanupArray(input?.safetyNotes),
    };
}

function looksTooGeneric(payload: GeneratedPayload) {
    const combined = [
        payload.promoteShort,
        payload.promoteLong,
        payload.facebookCaption,
        payload.instagramCaption,
    ]
        .join(" \n ")
        .toLowerCase();

    const badSignals = [
        "phù hợp nhiều đối tượng",
        "dễ phối",
        "hoàn hảo cho mọi dịp",
        "chiếc đồng hồ này mang",
        "thông tin này phù hợp người muốn",
        "mang lại cảm giác",
        "được thiết kế để",
        "giữ trọn tinh thần",
    ];

    const hitCount = badSignals.filter((s) => combined.includes(s)).length;

    const paragraphCount = payload.promoteLong
        .split(/\n\s*\n/)
        .map((x) => x.trim())
        .filter(Boolean).length;

    return payload.promoteLong.length < 260 || paragraphCount < 3 || hitCount >= 2;
}

function mapNarrative(value?: string | null) {
    switch (String(value ?? "").toLowerCase()) {
        case "vintage":
        case "vintage feel":
            return "Nhấn vào tinh thần vintage, độ chín của thiết kế và cảm giác thời gian.";
        case "dress":
        case "dress elegance":
            return "Nhấn vào sự thanh lịch, tiết chế, dress-oriented và tỷ lệ đẹp.";
        case "daily":
        case "daily wearable":
            return "Nhấn vào khả năng đeo hằng ngày, sự tiện dụng và độ dễ sống cùng.";
        case "collector":
        case "collector piece":
            return "Nhấn vào góc nhìn người chơi, tỷ lệ, hoàn thiện và cái hay nằm ở chi tiết.";
        default:
            return "Giữ góc kể trung tính nhưng phải có nhận định riêng.";
    }
}

function mapAudience(value?: string | null) {
    switch (String(value ?? "").toLowerCase()) {
        case "beginner":
        case "người mới chơi":
            return "Viết sao cho người mới chơi vẫn hiểu, nhưng không sơ cấp.";
        case "collector":
        case "người chơi lâu năm":
            return "Viết cho người đã chơi đồng hồ, tránh giải thích nhập môn.";
        case "daily":
        case "khách mua đeo hằng ngày":
            return "Viết cho người ưu tiên một chiếc đồng hồ để đeo thật, quan tâm cảm giác sử dụng.";
        default:
            return "Viết cho người đọc có gu, không giả định họ là chuyên gia.";
    }
}

function mapStructure(value?: string | null) {
    switch (String(value ?? "").toLowerCase()) {
        case "short":
        case "short listing":
            return "Ngắn, gọn, 2–3 đoạn.";
        case "story":
        case "storytelling":
            return "3–5 đoạn, có nhịp kể rõ.";
        case "hybrid":
            return "Mở bằng tổng thể, sau đó vào design insight rồi wearability.";
        default:
            return "Cấu trúc rõ ràng, mạch lạc.";
    }
}

function toAbsoluteUrl(input: string, origin: string) {
    if (!input) return "";
    if (/^https?:\/\//i.test(input) || input.startsWith("data:")) return input;
    if (input.startsWith("/")) return `${origin}${input}`;
    return `${origin}/${input.replace(/^\/+/, "")}`;
}

async function fetchImageAsDataUrl(imageUrl: string, origin: string) {
    const absoluteUrl = toAbsoluteUrl(imageUrl, origin);

    const res = await fetch(absoluteUrl, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Không tải được ảnh: ${res.status} - ${absoluteUrl}`);
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return `data:${contentType};base64,${base64}`;
}

async function resolveContentImagesAsDataUrls(
    images: InputImageEntry[],
    origin: string
) {
    const normalized = (Array.isArray(images) ? images : [])
        .map((img) => ({
            key: String(img?.key ?? "").trim() || null,
            url: String(img?.url ?? "").trim() || null,
        }))
        .filter((img) => Boolean(img.url))
        .slice(0, 2);

    const settled = await Promise.allSettled(
        normalized.map((img) => fetchImageAsDataUrl(String(img.url), origin))
    );

    const dataUrls = settled
        .filter(
            (result): result is PromiseFulfilledResult<string> =>
                result.status === "fulfilled" && Boolean(result.value)
        )
        .map((result) => result.value);

    return dataUrls;
}

function buildMainPrompt(input: {
    title?: string | null;
    brandName?: string | null;
    categoryName?: string | null;
    preset: TonePreset;
    facts: any;
    missingData: string[];
    promptMeta?: PromptMetaInput | null;
}) {
    const meta = input.promptMeta ?? {};
    const focus = Array.isArray(meta.focusPoints) ? meta.focusPoints : [];
    const sections = Array.isArray(meta.forceSections) ? meta.forceSections : [];

    return [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là copywriter chuyên viết nội dung cho đồng hồ vintage / pre-owned cao cấp tại thị trường Việt Nam.",
                        "Viết như người bán đồng hồ thật sự có gu, không như brochure, không như AI tóm tắt spec.",
                        "Không bịa dữ kiện.",
                        "Không dùng claim 'zin', 'NOS', 'nguyên bản', 'hiếm', 'đã serviced' nếu facts không xác nhận.",
                        "Nếu có ảnh, hãy dùng ảnh để tăng độ hình ảnh của bài viết: sắc độ dial, cảm giác hoàn thiện, độ sáng/tối, độ tiết chế hay nổi bật của tổng thể.",
                        "Chỉ dùng những gì thực sự nhìn thấy được; không suy diễn vượt quá dữ liệu.",
                        "Không được viết generic hoặc sáo rỗng.",
                        "Không dùng các cụm như: 'phù hợp nhiều đối tượng', 'dễ phối mọi phong cách', 'hoàn hảo cho mọi dịp', 'chiếc đồng hồ này rất đẹp'.",
                        "Nếu user có mẫu văn phong tham chiếu, hãy học nhịp văn, cách mở ý, cách chuyển đoạn và độ tinh tế của mẫu; tuyệt đối không sao chép câu chữ.",
                        "PromoteLong phải là phần mạnh nhất: có opening hook, design insight, wearability và 1 punchline tinh tế.",
                        "Mỗi đoạn chỉ nên ôm 1 ý chính.",
                        "Mỗi câu không nên quá 25–30 từ.",
                        "Ưu tiên câu ngắn, nhịp rõ, dễ đọc.",
                        "Nếu một câu đúng nhưng không ai nói như vậy, hãy viết lại theo cách tự nhiên hơn.",
                        "Nếu thiếu dữ liệu, chỉ nhắc ngắn ở cuối, không để disclaimer nuốt toàn bộ bài viết.",
                        contentToneInstruction(input.preset),
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
MỤC TIÊU:
Viết nội dung tiếng Việt cho sản phẩm đồng hồ từ spec đã có, có tham chiếu thêm từ ảnh.

THÔNG TIN ĐẦU VÀO:
- Title: ${input.title || "Không có"}
- Brand: ${input.brandName || "Không có"}
- Category: ${input.categoryName || "Không có"}

FACTS:
${JSON.stringify(input.facts, null, 2)}

MISSING DATA:
${JSON.stringify(input.missingData, null, 2)}

PROMPT META:
- Narrative: ${mapNarrative(meta.narrative)}
- Audience: ${mapAudience(meta.audience)}
- Structure: ${mapStructure(meta.structure)}
- Tone preset: ${meta.tonePreset || input.preset}
- Focus points: ${focus.join(", ") || "balanced"}
- Force sections: ${sections.join(", ") || "none"}

BRIEF THÊM:
${meta.customBrief || "Không có"}

CÁC PHRASE CẦN TRÁNH:
${meta.bannedPhrases || "Không có"}

MẪU VĂN PHONG THAM CHIẾU:
${meta.referenceSample || "Không có"}

YÊU CẦU:
- promoteLong: đúng 3 hoặc 4 đoạn ngắn
- mỗi đoạn 2 đến 3 câu
- đoạn 1 có opening hook
- đoạn 2 có design insight
- đoạn 3 có wearability / practical ownership
- phải có ít nhất 1 câu mang tính nhận định rõ ràng, nhưng tinh tế
- không được biến thành bài liệt kê thông số
- không được viết theo kiểu dịch máy

Trả về JSON đúng schema.
                    `.trim(),
                },
            ],
        },
    ];
}

function buildRefinePrompt(input: {
    original: GeneratedPayload;
    promptMeta?: PromptMetaInput | null;
}) {
    const meta = input.promptMeta ?? {};

    return [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là editor chuyên polish nội dung đồng hồ vintage cao cấp.",
                        "Nhiệm vụ: làm văn phong mượt hơn, bớt AI vibe, tự nhiên hơn như người viết thật.",
                        "KHÔNG thêm dữ kiện mới.",
                        "KHÔNG đổi meaning.",
                        "Giữ structure và số đoạn gần như nguyên bản.",
                        "Ưu tiên cách diễn đạt tự nhiên, có gu, tinh tế.",
                        "Sửa câu nghe gượng, câu như dịch từ tiếng Anh, câu đúng nhưng không ai nói như vậy.",
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
Hãy rewrite lại output dưới đây theo hướng:
- mượt hơn
- tự nhiên hơn
- ít generic hơn
- ít cảm giác AI hơn
- giữ nguyên ý và facts

PROMPT META:
- Narrative: ${meta.narrative || ""}
- Audience: ${meta.audience || ""}
- Tone: ${meta.tonePreset || ""}

OUTPUT CŨ:
${JSON.stringify(input.original, null, 2)}

Trả về JSON đúng schema.
                    `.trim(),
                },
            ],
        },
    ];
}

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

        const preset = (promptMeta?.tonePreset || "balanced") as TonePreset;

        const fallbackDraft = buildRuleBasedContent({
            title,
            brandName,
            watchSpec,
        });

        const { facts, missingData } = buildFacts(watchSpec);

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                generated: cleanupGeneratedPayload(fallbackDraft),
                meta: {
                    mode: "rule",
                    model: null,
                    productId: id,
                    imageCount: 0,
                    message: "Thiếu OPENAI_API_KEY, dùng fallback rule-based.",
                },
            });
        }

        const origin = req.nextUrl.origin;
        const imageEntries: InputImageEntry[] = Array.isArray(images) ? images : [];

        console.log("[GENERATE_CONTENT][BODY]", {
            productId: id,
            imageCount: imageEntries.length,
            images: imageEntries,
        });

        const dataUrls = await resolveContentImagesAsDataUrls(imageEntries, origin);

        console.log("[GENERATE_CONTENT][IMAGES_RESOLVED]", {
            productId: id,
            requested: imageEntries.length,
            resolved: dataUrls.length,
        });

        const mainInput = buildMainPrompt({
            title,
            brandName,
            categoryName,
            preset,
            facts,
            missingData,
            promptMeta,
        });

        const userContent = mainInput[1].content as any[];

        for (const dataUrl of dataUrls) {
            userContent.push({
                type: "input_image",
                image_url: dataUrl,
            });
        }

        console.log("[GENERATE_CONTENT][OPENAI_IMAGE_INPUTS]", {
            productId: id,
            imageCount: dataUrls.length,
            samplePrefix: dataUrls[0]?.slice(0, 40) ?? null,
        });

        const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini";

        const firstPass = await callResponsesJson<GeneratedPayload>({
            apiKey: process.env.OPENAI_API_KEY,
            model,
            input: mainInput,
            jsonSchema: contentSchema(),
        });

        let cleaned = cleanupGeneratedPayload(firstPass);

        cleaned = hardenGeneratedPayload(cleaned);

        const styleCheck = analyzeGeneratedPayload(cleaned);

        console.log("[GENERATE_CONTENT][STYLE_CHECK]", {
            productId: id,
            score: styleCheck.score,
            bannedHits: styleCheck.bannedHits,
            genericHits: styleCheck.genericHits,
            awkwardHits: styleCheck.awkwardHits,
            shouldRetry: styleCheck.shouldRetry,
        });

        if (styleCheck.shouldRetry) {
            const retryFeedback = buildRetryFeedback(styleCheck);

            const retried = await callResponsesJson<GeneratedPayload>({
                apiKey: process.env.OPENAI_API_KEY,
                model,
                input: buildStyleRetryPrompt({
                    original: cleaned,
                    feedback: retryFeedback,
                    promptMeta,
                }),
                jsonSchema: contentSchema(),
            });

            cleaned = cleanupGeneratedPayload(retried);
            cleaned = hardenGeneratedPayload(cleaned);
        }
        if (looksTooGeneric(cleaned)) {
            const refined = await callResponsesJson<GeneratedPayload>({
                apiKey: process.env.OPENAI_API_KEY,
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
                model,
                productId: id,
                imageCount: dataUrls.length,
                message: null,
            },
        });
    } catch (e: any) {
        console.error("[PRODUCT_GENERATE_CONTENT][FAILED]", {
            error: e?.message || e,
            stack: e?.stack || null,
        });

        return NextResponse.json(
            { error: e?.message || "Generate content failed" },
            { status: 500 }
        );
    }
}