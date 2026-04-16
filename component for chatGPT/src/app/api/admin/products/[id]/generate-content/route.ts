import { NextRequest, NextResponse } from "next/server";
import {
    buildFacts,
    callResponsesJson,
} from "@/app/(admin)/admin/products/_server/ai/product-ai.server";
import {
    extractKnowledgeKeys,
    getKnowledgeEnrichment,
} from "./watch-knowledge";

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
    knowledgeHints?: string;
};

type InputImageEntry = {
    key?: string | null;
    url?: string | null;
};

type PromoteBulletKind =
    | "opening"
    | "detail"
    | "detail_2"
    | "wearability"
    | "closing"
    | "missing_data";

type PromoteBullet = {
    kind: PromoteBulletKind;
    text: string;
};

type GeneratedEditorialPayload = {
    bullets: PromoteBullet[];
    missingData: string[];
    safetyNotes: string[];
};

type FinalPayload = {
    promoteLong: string;
    missingData: string[];
    safetyNotes: string[];
};

type StyleCheck = {
    score: number;
    shouldRetry: boolean;
    problems: string[];
};

const CANONICAL_REFERENCE_SAMPLE = `
▪️Có những chiếc dress giữ sự tĩnh tuyệt đối, nhưng cũng có những chiếc thêm vào một chút chuyển động để tạo cảm xúc – open heart luôn là kiểu như vậy

▪️Phần lộ cơ ở góc dial không quá lớn, vừa đủ để nhìn thấy nhịp chuyển động của bộ máy mà không làm mất đi sự gọn gàng tổng thể

▪️Dial đen kết hợp cọc số La Mã tạo nên độ tương phản tốt, vừa cổ điển vừa có chiều sâu thị giác

▪️Khi đeo thực tế, điểm open heart sẽ là thứ thu hút ánh nhìn đầu tiên – không phô trương nhưng rất “có chuyện để nhìn”

▪️Dây thép giúp chiếc đồng hồ trở nên linh hoạt hơn, không quá formal như dây da nhưng vẫn giữ được chất dress. Điểm đặc biệt ở chiếc Open heart mid-size này là bộ dây thép được làm mềm đi hẳn, mang đậm tinh thần dress watch hơn là sport. Size 35mm cho bản này thực sự đã mang open heart đến gần hơn cho người đeo để có thể đeo được hàng ngày.
`.trim();

const SYSTEM_PROMPT = `
Bạn là người viết nội dung cho đồng hồ vintage/pre-owned tại Việt Nam.

Bạn phải viết theo phong cách editorial tinh tế, bám sát tinh thần của mẫu tham chiếu:
- có nhịp
- có độ mềm
- không viết như brochure
- không viết như AI
- không quá đời
- không quá văn chương

Mục tiêu duy nhất:
- viết promoteLong thật có gu, đúng kiểu người bán đồng hồ nhìn kỹ chiếc đồng hồ rồi ghi lại cảm nhận.

FORMAT BẮT BUỘC:
- Output dưới dạng danh sách bullet objects
- Mỗi bullet là 1 ý rõ ràng
- Toàn bài có 5 đến 7 bullets
- Mỗi bullet 1 đến 2 câu
- Không viết một block văn dài

SIGNATURE MOVES ĐƯỢC PHÉP DÙNG:
- “Có những chiếc..., nhưng cũng có những chiếc...”
- “không quá..., nhưng...”
- “vừa đủ để..., mà không...”
- “giữ được..., nhưng vẫn...”
- “điểm đặc biệt là...”
- “khi đeo thực tế...”

BẮT BUỘC PHẢI CÓ:
- 1 bullet mở bằng nhận định tổng thể
- 1 đến 2 bullet zoom vào dial / case / layout
- 1 bullet nói về cảm giác đeo hoặc tính linh hoạt khi đeo
- 1 bullet chốt lại tính cách của chiếc đồng hồ
- nếu thiếu dữ liệu, thêm đúng 1 bullet ngắn ở cuối

KHÔNG ĐƯỢC:
- bịa dữ kiện
- dùng claim như zin, NOS, nguyên bản, hiếm, serviced nếu không có xác nhận
- kết bài kiểu bán hàng lộ
- viết generic như “lựa chọn đáng cân nhắc”, “phù hợp với nhiều đối tượng”, “hoàn hảo cho...”

Nếu có ảnh:
- ưu tiên mô tả những gì thực sự nhìn thấy như dial, ánh sáng, texture, tương phản, form vỏ, dây, vibe tổng thể
- không suy diễn quá xa

Output:
- JSON đúng schema
- bullet texts phải đọc tự nhiên, mềm, có nhịp, có gu
`.trim();

function editorialSchema() {
    return {
        name: "product_promote_editorial_generation",
        schema: {
            type: "object",
            additionalProperties: false,
            properties: {
                bullets: {
                    type: "array",
                    minItems: 5,
                    maxItems: 7,
                    items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                            kind: {
                                type: "string",
                                enum: [
                                    "opening",
                                    "detail",
                                    "detail_2",
                                    "wearability",
                                    "closing",
                                    "missing_data",
                                ],
                            },
                            text: { type: "string" },
                        },
                        required: ["kind", "text"],
                    },
                },
                missingData: {
                    type: "array",
                    items: { type: "string" },
                },
                safetyNotes: {
                    type: "array",
                    items: { type: "string" },
                },
            },
            required: ["bullets", "missingData", "safetyNotes"],
        },
    };
}

function cleanupText(text: unknown) {
    return String(text ?? "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function cleanupArray(input: unknown) {
    if (!Array.isArray(input)) return [];
    return input.map((x) => String(x ?? "").trim()).filter(Boolean);
}

function normalizeBullets(input: unknown): PromoteBullet[] {
    if (!Array.isArray(input)) return [];
    return input
        .map((item) => {
            const kind = String((item as any)?.kind ?? "").trim() as PromoteBulletKind;
            const text = cleanupText((item as any)?.text ?? "");
            if (!kind || !text) return null;
            return { kind, text };
        })
        .filter(Boolean) as PromoteBullet[];
}

function cleanupGeneratedPayload(
    input: Partial<GeneratedEditorialPayload> | null | undefined
): GeneratedEditorialPayload {
    return {
        bullets: normalizeBullets(input?.bullets),
        missingData: cleanupArray(input?.missingData),
        safetyNotes: cleanupArray(input?.safetyNotes),
    };
}

function hardenText(text: string) {
    return String(text || "")
        .replace(/\bẤn tượng đầu tiên là[:,]?\s*/gi, "")
        .replace(/\blựa chọn đáng cân nhắc\b/gi, "kiểu đồng hồ có lý do để nhìn lâu hơn")
        .replace(/\bphù hợp với nhiều đối tượng\b/gi, "dễ đeo trong nhiều bối cảnh")
        .replace(/\bhoàn hảo cho\b/gi, "hợp với")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function hardenPayload(payload: GeneratedEditorialPayload): GeneratedEditorialPayload {
    return {
        bullets: (payload.bullets ?? []).map((b) => ({
            kind: b.kind,
            text: hardenText(b.text),
        })),
        missingData: cleanupArray(payload.missingData),
        safetyNotes: cleanupArray(payload.safetyNotes),
    };
}

function bulletOrderScore(kinds: PromoteBulletKind[]) {
    let score = 0;
    if (kinds[0] === "opening") score += 20;
    if (kinds.includes("detail")) score += 15;
    if (kinds.includes("wearability")) score += 15;
    if (kinds.includes("closing")) score += 20;
    return score;
}

function analyzeEditorialPayload(payload: GeneratedEditorialPayload): StyleCheck {
    const bullets = payload.bullets ?? [];
    const texts = bullets.map((b) => b.text);
    const joined = texts.join("\n");

    let score = 100;
    const problems: string[] = [];

    if (bullets.length < 5 || bullets.length > 7) {
        score -= 20;
        problems.push("wrong_bullet_count");
    }

    const kinds = bullets.map((b) => b.kind);
    const orderScore = bulletOrderScore(kinds);
    if (orderScore < 50) {
        score -= 20;
        problems.push("weak_structure");
    }

    if (!/có những chiếc|không quá|vừa đủ|giữ được|khi đeo thực tế|điểm đặc biệt/i.test(joined)) {
        score -= 12;
        problems.push("missing_editorial_rhythm");
    }

    if (!/thú vị|chiều sâu|tinh tế|có gu|có chuyện để nhìn|không phô trương|vừa đủ/i.test(joined)) {
        score -= 12;
        problems.push("missing_style_texture");
    }

    const sentenceCount = joined
        .split(/[.!?]/)
        .map((x) => x.trim())
        .filter(Boolean).length;

    if (sentenceCount < 6 || sentenceCount > 12) {
        score -= 10;
        problems.push("wrong_sentence_density");
    }

    const longSentences = joined
        .split(/[.!?]/)
        .map((x) => x.trim())
        .filter(Boolean)
        .filter((s) => s.length > 150);

    if (longSentences.length > 0) {
        score -= 10;
        problems.push("long_sentences");
    }

    if (/lựa chọn đáng cân nhắc|phù hợp với nhiều đối tượng|hoàn hảo cho/i.test(joined)) {
        score -= 20;
        problems.push("generic_ending");
    }

    if (joined.length < 420) {
        score -= 8;
        problems.push("too_thin");
    }

    return {
        score: Math.max(0, score),
        shouldRetry: score < 90,
        problems,
    };
}

function buildRetryFeedback(problems: string[]) {
    const map: Record<string, string> = {
        wrong_bullet_count: "Cần giữ đúng 5 đến 7 bullet editorial.",
        weak_structure: "Cấu trúc bullet chưa rõ opening/detail/wearability/closing.",
        missing_editorial_rhythm: "Thiếu nhịp editorial kiểu 'không quá..., nhưng...', 'vừa đủ để..., mà không...'.",
        missing_style_texture: "Thiếu cảm giác tinh tế, chiều sâu và chất viết có gu.",
        wrong_sentence_density: "Mật độ câu chưa hợp, cần giữ bullet ngắn gọn hơn.",
        long_sentences: "Có câu quá dài, cần tách ngắn lại.",
        generic_ending: "Đừng kết generic hoặc bán hàng lộ.",
        too_thin: "Nội dung còn hơi mỏng, cần đầy hơn nhưng vẫn tiết chế.",
    };

    return problems.map((p) => map[p]).filter(Boolean).join(" ");
}

function mapNarrative(value?: string | null) {
    switch (String(value ?? "").toLowerCase()) {
        case "vintage":
        case "vintage feel":
            return "Nhấn vào tinh thần vintage và độ chín của thiết kế.";
        case "dress":
        case "dress elegance":
            return "Nhấn vào sự thanh lịch, tiết chế và chất dress.";
        case "daily":
        case "daily wearable":
            return "Nhấn vào sự linh hoạt và khả năng đeo hằng ngày.";
        case "collector":
        case "collector piece":
            return "Nhấn vào chi tiết, bố cục và góc nhìn người chơi.";
        default:
            return "Giữ góc kể cân bằng nhưng phải có nhận định.";
    }
}

function mapAudience(value?: string | null) {
    switch (String(value ?? "").toLowerCase()) {
        case "beginner":
        case "người mới chơi":
            return "Dễ hiểu nhưng không sơ cấp.";
        case "collector":
        case "người chơi lâu năm":
            return "Viết cho người đã chơi đồng hồ.";
        case "daily":
        case "khách mua đeo hằng ngày":
            return "Ưu tiên cảm giác đeo và độ dễ sống cùng.";
        default:
            return "Viết cho người đọc có gu.";
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
    const res = await fetch(absoluteUrl, { method: "GET", cache: "no-store" });

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

    return settled
        .filter(
            (result): result is PromiseFulfilledResult<string> =>
                result.status === "fulfilled" && Boolean(result.value)
        )
        .map((result) => result.value);
}

function buildUserPrompt(input: {
    title?: string | null;
    brandName?: string | null;
    facts: any;
    missingData: string[];
    promptMeta?: PromptMetaInput | null;
    enrichment?: {
        summaries: string[];
        safeClaims: string[];
        cautions: string[];
    };
}) {
    const meta = input.promptMeta ?? {};
    const effectiveReference = String(meta.referenceSample || "").trim() || CANONICAL_REFERENCE_SAMPLE;
    const enrichment = input.enrichment ?? {
        summaries: [],
        safeClaims: [],
        cautions: [],
    };

    return `
MỤC TIÊU:
Viết promoteLong theo đúng phong cách editorial bullet-style, bám sát mẫu tham chiếu.

THÔNG TIN:
- Title: ${input.title || "Không có"}
- Brand: ${input.brandName || "Không có"}

FACTS:
${JSON.stringify(input.facts, null, 2)}

MISSING DATA:
${JSON.stringify(input.missingData, null, 2)}

ĐỊNH HƯỚNG:
- Narrative: ${mapNarrative(meta.narrative)}
- Audience: ${mapAudience(meta.audience)}
- Tone: ${meta.tonePreset || "refined"}
- Focus: ${(meta.focusPoints || []).join(", ") || "balanced"}

BRIEF:
${meta.customBrief || "Không có"}

KNOWLEDGE HINTS:
${meta.knowledgeHints || "Không có"}

KNOWLEDGE ENRICHMENT:
${enrichment.summaries.length ? enrichment.summaries.map((x) => `- ${x}`).join("\n") : "- Không có"}

SAFE CLAIMS CÓ THỂ NHẤN:
${enrichment.safeClaims.length ? enrichment.safeClaims.map((x) => `- ${x}`).join("\n") : "- Không có"}

CAUTION:
${enrichment.cautions.length ? enrichment.cautions.map((x) => `- ${x}`).join("\n") : "- Không có"}

PHRASE CẦN TRÁNH:
${meta.bannedPhrases || "Không có"}

MẪU VĂN PHONG THAM CHIẾU:
${effectiveReference}

YÊU CẦU CỤ THỂ:
- Viết thành 5 đến 7 bullet-style paragraphs
- Mỗi bullet 1 đến 2 câu
- Bullet 1: mở bằng một nhận định tổng thể
- Bullet 2 hoặc 3: zoom vào chi tiết dial/case/layout
- Bullet tiếp theo: nói về cảm giác đeo, độ linh hoạt hoặc tính cách khi đeo
- Bullet cuối: chốt lại chiếc đồng hồ này thuộc kiểu nào, có insight, không bán hàng lộ
- Nếu thiếu dữ liệu: thêm 1 bullet ngắn ở cuối

PHONG CÁCH CÂU:
- Ưu tiên các cấu trúc như:
  - “Có những chiếc..., nhưng cũng có những chiếc...”
  - “không quá..., nhưng...”
  - “vừa đủ để..., mà không...”
  - “giữ được..., nhưng vẫn...”
- Văn phải mềm, có nhịp, có cảm xúc
- Không viết như mô tả thông số
- Không kết luận generic
- Học nhịp, độ mềm và cách zoom chi tiết từ mẫu tham chiếu; không sao chép nguyên câu

Trả về JSON đúng schema.
    `.trim();
}

function buildMainPrompt(input: {
    title?: string | null;
    brandName?: string | null;
    facts: any;
    missingData: string[];
    promptMeta?: PromptMetaInput | null;
    imageDataUrls?: string[];
    enrichment?: {
        summaries: string[];
        safeClaims: string[];
        cautions: string[];
    };
}) {
    const blocks: any[] = [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: SYSTEM_PROMPT,
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: buildUserPrompt({
                        title: input.title,
                        brandName: input.brandName,
                        facts: input.facts,
                        missingData: input.missingData,
                        promptMeta: input.promptMeta,
                        enrichment: input.enrichment,
                    }),
                },
            ],
        },
    ];

    if (input.imageDataUrls?.length) {
        blocks[1].content.push({
            type: "input_text",
            text: "Ảnh dưới đây là sản phẩm thực tế. Hãy dùng ảnh để tăng độ chân thực của bài viết, nhất là dial, ánh sáng, texture, tỷ lệ và tính cách tổng thể.",
        });

        input.imageDataUrls.forEach((url) => {
            blocks[1].content.push({
                type: "input_image",
                image_url: url,
            });
        });
    }

    return blocks;
}

function buildRetryPrompt(input: {
    original: GeneratedEditorialPayload;
    feedback: string;
    promptMeta?: PromptMetaInput | null;
}) {
    const meta = input.promptMeta ?? {};
    const effectiveReference = String(meta.referenceSample || "").trim() || CANONICAL_REFERENCE_SAMPLE;

    return [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: `
Bạn đang sửa lại promoteLong theo phong cách editorial bullet-style.

Yêu cầu:
- giữ đúng chất viết mềm, có nhịp
- tăng độ tinh tế
- tăng cảm giác người viết có gu
- không generic
- không bán hàng lộ

Không thêm dữ kiện.
Không đổi meaning.
                    `.trim(),
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: `
FEEDBACK:
${input.feedback}

MẪU VĂN PHONG THAM CHIẾU:
${effectiveReference}

OUTPUT CŨ:
${JSON.stringify(input.original, null, 2)}

Trả về JSON đúng schema.
                    `.trim(),
                },
            ],
        },
    ];
}

function renderPromoteLong(payload: GeneratedEditorialPayload): FinalPayload {
    const bullets = [...(payload.bullets ?? [])];
    const missingBullet = bullets.find((b) => b.kind === "missing_data");
    const nonMissingBullets = bullets.filter((b) => b.kind !== "missing_data");

    const lines = nonMissingBullets.map((b) => `▪️${b.text}`);
    if (missingBullet?.text) lines.push(`▪️${missingBullet.text}`);

    return {
        promoteLong: lines.join("\n\n"),
        missingData: cleanupArray(payload.missingData),
        safetyNotes: cleanupArray(payload.safetyNotes),
    };
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
            promptMeta,
            images,
        } = body ?? {};

        const { facts, missingData } = buildFacts(watchSpec);
        const imageEntries: InputImageEntry[] = Array.isArray(images) ? images : [];

        const knowledgeKeys = extractKnowledgeKeys({
            brandName,
            title,
            customBrief: promptMeta?.customBrief,
            referenceSample: promptMeta?.referenceSample,
            watchSpec,
        });

        const enrichment = getKnowledgeEnrichment(knowledgeKeys);

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                generated: {
                    promoteLong: "",
                    missingData: missingData ?? [],
                    safetyNotes: ["Thiếu OPENAI_API_KEY."],
                },
                meta: {
                    mode: "rule",
                    model: null,
                    productId: id,
                    imageCount: 0,
                    knowledgeKeys,
                    message: "Thiếu OPENAI_API_KEY.",
                },
            });
        }

        const origin = req.nextUrl.origin;
        const dataUrls = await resolveContentImagesAsDataUrls(imageEntries, origin);
        const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini";

        console.log("[GENERATE_CONTENT][ENRICHMENT]", {
            productId: id,
            knowledgeKeys,
            enrichment,
        });

        const firstPass = await callResponsesJson<GeneratedEditorialPayload>({
            apiKey: process.env.OPENAI_API_KEY,
            model,
            input: buildMainPrompt({
                title,
                brandName,
                facts,
                missingData,
                promptMeta,
                imageDataUrls: dataUrls,
                enrichment,
            }),
            jsonSchema: editorialSchema(),
        });

        let cleaned = cleanupGeneratedPayload(firstPass);
        cleaned = hardenPayload(cleaned);

        const styleCheck = analyzeEditorialPayload(cleaned);

        if (styleCheck.shouldRetry) {
            const retried = await callResponsesJson<GeneratedEditorialPayload>({
                apiKey: process.env.OPENAI_API_KEY,
                model,
                input: buildRetryPrompt({
                    original: cleaned,
                    feedback: buildRetryFeedback(styleCheck.problems),
                    promptMeta,
                }),
                jsonSchema: editorialSchema(),
            });

            cleaned = cleanupGeneratedPayload(retried);
            cleaned = hardenPayload(cleaned);
        }

        const finalPayload = renderPromoteLong(cleaned);

        return NextResponse.json({
            generated: finalPayload,
            meta: {
                mode: "openai",
                model,
                productId: id,
                imageCount: dataUrls.length,
                knowledgeKeys,
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