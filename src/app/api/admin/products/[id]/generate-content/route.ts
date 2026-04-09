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

function mapNarrative(value?: string | null) {
    switch (String(value ?? "").toLowerCase()) {
        case "vintage":
        case "vintage feel":
            return "Nhấn vào tinh thần vintage, độ chín của thiết kế, cảm giác thời gian và vẻ đẹp không phô trương.";
        case "dress":
        case "dress elegance":
            return "Nhấn vào sự thanh lịch, dress-oriented, gọn gàng, tiết chế và tinh tế.";
        case "daily":
        case "daily wearable":
            return "Nhấn vào khả năng đeo hằng ngày, cảm giác tiện dụng, dễ sống cùng và thực tế.";
        case "collector":
        case "collector piece":
            return "Nhấn vào góc nhìn người chơi, cái hay nằm ở chi tiết, tỷ lệ và tổng thể.";
        default:
            return "Giữ góc kể trung tính nhưng phải có nhận định riêng, không generic.";
    }
}

function mapAudience(value?: string | null) {
    switch (String(value ?? "").toLowerCase()) {
        case "beginner":
        case "người mới chơi":
            return "Viết sao cho người mới chơi vẫn hiểu, nhưng không sơ cấp quá mức.";
        case "collector":
        case "người chơi lâu năm":
            return "Viết cho người đã chơi đồng hồ, tránh giải thích kiểu nhập môn.";
        case "daily":
        case "khách mua đeo hằng ngày":
            return "Viết cho người ưu tiên một chiếc đồng hồ để đeo thật, quan tâm cảm giác sử dụng và độ dễ sống.";
        default:
            return "Viết cho người đọc có gu, không giả định họ là chuyên gia nhưng cũng không quá phổ thông.";
    }
}

function mapStructure(value?: string | null) {
    switch (String(value ?? "").toLowerCase()) {
        case "short":
        case "short listing":
            return "Ngắn, 2–3 đoạn, chắc và gọn.";
        case "story":
        case "storytelling":
            return "3–5 đoạn có nhịp kể rõ, có mở, thân và chốt.";
        case "hybrid":
            return "Mở bằng cảm nhận tổng thể, sau đó đi vào design insight rồi khả năng đeo và sử dụng.";
        default:
            return "Cấu trúc rõ ràng, mạch lạc, không lan man.";
    }
}

function compact(values: Array<string | null | undefined | false>) {
    return values.map((x) => String(x ?? "").trim()).filter(Boolean);
}

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
        .map((x) => cleanupText(x))
        .filter(Boolean);
}

function cleanupGeneratedPayload(input: Partial<GeneratedPayload> | null | undefined): GeneratedPayload {
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
        "dễ phối đồ công sở hoặc smart-casual",
    ];

    const hitCount = badSignals.filter((s) => combined.includes(s)).length;

    const paragraphCount = payload.promoteLong
        .split(/\n\s*\n/)
        .map((x) => x.trim())
        .filter(Boolean).length;

    return (
        payload.promoteLong.length < 260 ||
        paragraphCount < 3 ||
        hitCount >= 2
    );
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
                        "Viết như người bán đồng hồ thật sự có gu, không như brochure, không như AI đang tóm tắt spec.",
                        "Không bịa dữ kiện.",
                        "Không dùng claim 'zin', 'NOS', 'nguyên bản', 'hiếm', 'đã serviced' nếu facts không xác nhận.",
                        "Không được viết generic hoặc sáo rỗng.",
                        "Không dùng các cụm như: 'phù hợp nhiều đối tượng', 'dễ phối mọi phong cách', 'hoàn hảo cho mọi dịp', 'chiếc đồng hồ này rất đẹp'.",
                        "Nếu user có mẫu văn phong tham chiếu, hãy học nhịp văn, cách mở ý, cách chuyển đoạn và độ tinh tế của mẫu; tuyệt đối không sao chép câu chữ.",
                        "PromoteLong phải là phần mạnh nhất: có opening hook, có design insight, có nhận định riêng.",
                        "Mỗi đoạn chỉ nên ôm 1 ý chính.",
                        "Mỗi câu không nên quá 25–30 từ.",
                        "Tránh câu chứa quá nhiều ý (ví dụ: kích thước + cảm giác + nhận định trong cùng 1 câu).",
                        "Ưu tiên câu ngắn, nhịp rõ, dễ đọc.",
                        "Phải có ít nhất 1 câu mang tính nhận định rõ ràng (punchline), không chỉ mô tả.",
                        "Punchline nên là câu có quan điểm, có thể đứng độc lập và tạo ấn tượng.", "Mỗi đoạn chỉ nên ôm 1 ý chính.",
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
Viết nội dung tiếng Việt cho sản phẩm đồng hồ từ spec đã có.

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

YÊU CẦU RIÊNG CHO TỪNG FIELD:

1) promoteShort:
- 1 đến 2 câu
- gọn, sang, có điểm nhấn
- không như bullet

2) promoteLong:
- đúng 3 hoặc 4 đoạn ngắn
- mỗi đoạn 3 đến 4 câu
- mỗi câu không quá 25–30 từ
- đoạn 1 phải có opening hook
- đoạn 2 phải có design insight
- đoạn 3 phải có wearability / practical ownership
- phải có ít nhất 1 câu mang tính nhận định rõ ràng (punchline)
- không được gộp nhiều ý vào 1 câu dài
- không được biến thành bài liệt kê thông số
- nếu còn thiếu dữ liệu thì chỉ 1 câu chốt ngắn ở cuối đoạn cuối

3) specBullets:
- factual, gọn, không hoa mỹ
- không lặp nguyên câu trong promoteLong

4) facebookCaption:
- tự nhiên, dễ đọc, có cảm giác người bán thật viết
- không quá dài
- không nhồi hết spec vào một đoạn

5) instagramCaption:
- giàu mood hơn facebook một chút
- vẫn factual, không làm quá

6) titleOptions:
- tự nhiên, không kiểu máy-generated

7) hashtags:
- ít nhưng đúng, không spam

RÀNG BUỘC:
- Tuyệt đối không viết generic.
- Không dùng lại các cụm user đã cấm.
- Nếu chất liệu vỏ là OTHER thì không suy diễn vật liệu.
- Nếu là quartz, có thể viết theo hướng thực dụng / dễ sống, không mặc định là điểm yếu.

Trả về JSON đúng schema.
                    `.trim(),
                },
            ],
        },
    ];
}
function buildWordingRefinePrompt(input: {
    original: GeneratedPayload;
    promptMeta?: any;
}) {
    const meta = input.promptMeta ?? {};

    return [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là editor chuyên refine wording cho nội dung đồng hồ vintage cao cấp.",
                        "Nhiệm vụ: chỉnh lại từ ngữ để tự nhiên, tinh tế, có gu hơn.",
                        "KHÔNG thay đổi ý nghĩa.",
                        "KHÔNG thêm dữ kiện mới.",
                        "KHÔNG thay đổi structure đoạn.",
                        "Chỉ thay thế từ/cụm từ chưa tự nhiên hoặc hơi thô.",
                        "Tránh văn nói, tránh từ mang tính dịch máy.",
                        "Ưu tiên từ ngữ mang cảm giác viết, tinh giản, có kiểm soát.",

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
Hãy chỉnh lại wording của nội dung dưới đây:

YÊU CẦU:
- Giữ nguyên ý
- Giữ số đoạn
- Không làm dài hơn nhiều
- Chỉ thay từ/cụm từ chưa tự nhiên
- Tránh các cụm quá trừu tượng hoặc mang tính triết lý nếu không có hình ảnh cụ thể.
- Ưu tiên cách diễn đạt tự nhiên như người bán thật, không dùng cấu trúc dịch từ tiếng Anh.
- Nếu một câu nghe “đúng nhưng không ai nói như vậy”, hãy viết lại theo cách tự nhiên hơn.

CÁC LỖI CẦN SỬA:
- Từ mang tính nói miệng (ví dụ: "cư xử", "ăn tay")
- Cụm mơ hồ (ví dụ: "có tỉ lệ cổ điển")
- Từ nghe như dịch (ví dụ: "gom sáng")
- Câu nghe thô hoặc thiếu tinh tế

PROMPT META:
- Tone: ${meta.tonePreset || ""}
- Narrative: ${meta.narrative || ""}

NỘI DUNG:
${JSON.stringify(input.original, null, 2)}

Trả về JSON đúng schema.
                    `.trim(),
                },
            ],
        },
    ];
}
function buildPolishPrompt(input: {
    original: GeneratedPayload;
    title?: string | null;
    brandName?: string | null;
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
                        "Bạn đang làm bước polish lại nội dung đồng hồ vintage.",
                        "Mục tiêu là làm văn phong sắc hơn, có gu hơn, ít generic hơn.",
                        "Giữ nguyên dữ kiện. Không bịa thêm.",
                        "Tăng chất lượng mở bài, design insight và nhịp văn.",
                        "Không dùng các cụm cấm hoặc các câu mơ hồ, đại trà.",
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
Nội dung trước đó đang còn generic hoặc quá an toàn.

Thông tin:
- Title: ${input.title || "Không có"}
- Brand: ${input.brandName || "Không có"}
- Narrative: ${meta.narrative || "balanced"}
- Audience: ${meta.audience || "general"}
- Structure: ${meta.structure || "hybrid"}
- Tone preset: ${meta.tonePreset || "balanced"}

Brief thêm:
${meta.customBrief || "Không có"}

Phrase cần tránh:
${meta.bannedPhrases || "Không có"}

Reference sample:
${meta.referenceSample || "Không có"}

Hãy viết lại output dưới đây để:
- bớt generic
- có opening hook mạnh hơn
- có design insight rõ hơn
- chia đoạn đẹp hơn
- disclaimer ngắn hơn

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
        } = body ?? {};

        const preset = ((promptMeta?.tonePreset || "balanced") as TonePreset);
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
                    message: "Thiếu OPENAI_API_KEY, dùng fallback rule-based.",
                },
            });
        }

        const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini";

        const firstPass = await callResponsesJson<GeneratedPayload>({
            apiKey: process.env.OPENAI_API_KEY,
            model,
            input: buildMainPrompt({
                title,
                brandName,
                categoryName,
                preset,
                facts,
                missingData,
                promptMeta,
            }),
            jsonSchema: contentSchema(),
        });

        let cleaned = cleanupGeneratedPayload(firstPass);

        if (looksTooGeneric(cleaned)) {
            const polished = await callResponsesJson<GeneratedPayload>({
                apiKey: process.env.OPENAI_API_KEY,
                model,
                input: buildPolishPrompt({
                    original: cleaned,
                    title,
                    brandName,
                    promptMeta,
                }),
                jsonSchema: contentSchema(),
            });

            cleaned = cleanupGeneratedPayload(polished);
        }
        // ===== FLOW ENHANCER PASS =====
        const flowEnhanced = await callResponsesJson<GeneratedPayload>({
            apiKey: process.env.OPENAI_API_KEY!,
            model,
            input: buildFlowEnhancerPrompt({
                original: cleaned,
                title,
                brandName,
                promptMeta,
            }),
            jsonSchema: contentSchema(),
        });
        // ===== WORDING REFINEMENT PASS =====
        const refined = await callResponsesJson<GeneratedPayload>({
            apiKey: process.env.OPENAI_API_KEY!,
            model,
            input: buildWordingRefinePrompt({
                original: cleaned,
                promptMeta,
            }),
            jsonSchema: contentSchema(),
        });
        // ===== HUMANIZATION PASS =====
        const humanized = await callResponsesJson<GeneratedPayload>({
            apiKey: process.env.OPENAI_API_KEY!,
            model,
            input: buildHumanizePrompt({
                original: cleaned,
                promptMeta,
            }),
            jsonSchema: contentSchema(),
        });

        cleaned = cleanupGeneratedPayload(humanized);
        cleaned = cleanupGeneratedPayload(refined);
        cleaned = cleanupGeneratedPayload(flowEnhanced);
        return NextResponse.json({
            generated: cleaned,
            meta: {
                mode: "openai",
                model,
                productId: id,
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


function buildFlowEnhancerPrompt(input: {
    original: GeneratedPayload;
    title?: string | null;
    brandName?: string | null;
    promptMeta?: any;
}) {
    const meta = input.promptMeta ?? {};

    return [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là editor chuyên refine nội dung đồng hồ vintage cao cấp.",
                        "Nhiệm vụ: chỉnh lại văn phong để mượt hơn, có flow, tự nhiên như người viết thật.",
                        "KHÔNG được thêm dữ kiện mới.",
                        "KHÔNG được làm thay đổi meaning của nội dung.",
                        "Chỉ cải thiện cách viết, nhịp câu, liên kết giữa các câu.",
                        "Giảm cảm giác mỗi câu là một ý rời.",
                        "Làm cho đoạn văn đọc liền mạch, có nhịp.",
                        "Punchline nếu có thì làm tinh tế hơn, không gồng.",
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
Hãy rewrite lại nội dung dưới đây để:

- Các câu liên kết tự nhiên hơn
- Tránh cảm giác liệt kê
- Giữ mỗi đoạn có 1 flow rõ
- Giữ số đoạn tương tự
- Không làm dài hơn quá nhiều
- Không thêm spec mới

PROMPT META:
- Narrative: ${meta.narrative || ""}
- Audience: ${meta.audience || ""}
- Tone: ${meta.tonePreset || ""}

NỘI DUNG GỐC:
${JSON.stringify(input.original, null, 2)}

Trả về JSON đúng schema.
                    `.trim(),
                },
            ],
        },
    ];
}

function buildHumanizePrompt(input: {
    original: GeneratedPayload;
    promptMeta?: any;
}) {
    const meta = input.promptMeta ?? {};

    return [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là người bán đồng hồ vintage lâu năm, có gu và viết nội dung cho chính sản phẩm mình đang bán.",
                        "Nhiệm vụ: rewrite nội dung để giống cách người thật nói và viết.",
                        "KHÔNG được thêm dữ kiện mới.",
                        "KHÔNG thay đổi meaning.",
                        "Giữ structure và số đoạn gần như nguyên bản.",
                        "Loại bỏ cảm giác 'AI viết đúng nhưng không tự nhiên'.",
                        "Ưu tiên cách diễn đạt đời, tinh tế, không quá văn chương.",
                        "Tránh câu nghe như dịch từ tiếng Anh.",
                        "Nếu một câu đúng nhưng không ai nói như vậy, hãy viết lại theo cách tự nhiên hơn.",
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
Hãy rewrite nội dung dưới đây theo hướng:

- Giống người bán đồng hồ thật đang viết
- Tự nhiên, có gu, không gồng
- Giữ ý, giữ facts
- Không thêm spec
- Không làm dài hơn nhiều

PROMPT META:
- Narrative: ${meta.narrative || ""}
- Tone: ${meta.tonePreset || ""}

NỘI DUNG:
${JSON.stringify(input.original, null, 2)}

Trả về JSON đúng schema.
                    `.trim(),
                },
            ],
        },
    ];
}