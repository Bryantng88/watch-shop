import type {
    AcquisitionDraftResponse,
    AcquisitionExtractedSpec,
    AcquisitionGeneratedDraft,
    GenerateAcquisitionDraftInput,
} from "./acquisition-ai.types";
import * as repo from "./acquisition-ai.repo";

function buildFallbackSpec(titleHint?: string, hintText?: string): AcquisitionExtractedSpec {
    const source = `${titleHint || ""} ${hintText || ""}`.toLowerCase();

    const brandName = source.includes("omega")
        ? "Omega"
        : source.includes("seiko")
            ? "Seiko"
            : source.includes("longines")
                ? "Longines"
                : null;

    const movement =
        source.includes("pin") || source.includes("quartz")
            ? "QUARTZ"
            : source.includes("automatic") || source.includes("tự động")
                ? "AUTOMATIC"
                : source.includes("lên dây")
                    ? "MANUAL"
                    : null;

    const caseMaterial =
        source.includes("18k gold") || source.includes("18k") || source.includes("gold")
            ? "GOLD"
            : null;

    const goldKarat = source.includes("18k") ? "18K" : null;
    const goldColor = caseMaterial === "GOLD" ? "YELLOW_GOLD" : null;

    return {
        brandName,
        modelFamily: null,
        refCandidates: [],
        bestRefCandidate: null,
        yearEstimate: null,
        yearRange: { from: null, to: null },
        yearConfidence: "low",
        caseType: null,
        gender: null,
        movement,
        caliberCandidates: [],
        bestCaliberCandidate: null,
        caseMaterial,
        goldKarat,
        goldColor,
        widthEstimateMm: null,
        lengthEstimateMm: null,
        thicknessEstimateMm: null,
        strapType: source.includes("dây da") ? "LEATHER" : null,
        glass: null,
        dialColor: source.includes("champagne") ? "champagne" : null,
        dialCondition: null,
        likelyAccessories: {
            boxIncluded: null,
            bookletIncluded: null,
            cardIncluded: null,
        },
        confirmedFacts: {
            brandName,
            movement,
            caseMaterial,
            goldKarat,
            goldColor,
        },
        suggestedFacts: {},
        confidence: {
            brandName: brandName ? "medium" : "low",
            movement: movement ? "medium" : "low",
            caseMaterial: caseMaterial ? "medium" : "low",
            goldKarat: goldKarat ? "medium" : "low",
            goldColor: goldColor ? "medium" : "low",
        },
        needsMoreImages: ["caseback", "macro dial text"],
        confidenceNotes: [
            "Cần thêm ảnh caseback hoặc macro text để đoán ref/năm chính xác hơn.",
        ],
    };
}

function buildFallbackDraft(input: {
    extractedSpec: AcquisitionExtractedSpec;
    titleHint?: string | null;
}) {
    const s = input.extractedSpec;
    const brand = s.brandName || "";
    const model = s.modelFamily || "";
    const movementText =
        s.movement === "QUARTZ"
            ? "pin"
            : s.movement === "AUTOMATIC"
                ? "automatic"
                : s.movement === "MANUAL"
                    ? "lên dây"
                    : "";

    const materialText =
        s.goldKarat && s.caseMaterial === "GOLD"
            ? `${s.goldKarat} gold`
            : s.caseMaterial === "GOLD"
                ? "gold"
                : "";

    const title =
        [brand, model, movementText, materialText].filter(Boolean).join(" ").trim() ||
        input.titleHint ||
        "Vintage watch";

    return {
        generatedTitle: title,
        titleOptions: [title].filter(Boolean),
        specBullets: [
            s.widthEstimateMm ? `▪️Kích thước ước lượng: ${s.widthEstimateMm}mm` : null,
            s.movement ? `▪️Bộ máy: ${movementText}` : null,
            s.caseMaterial
                ? `▪️Chất liệu vỏ: ${s.goldKarat ? `${s.goldKarat} ` : ""}${s.caseMaterial}`
                : null,
            s.dialColor ? `▪️Dial ${s.dialColor}` : null,
        ].filter(Boolean) as string[],
        listingCopy: `${title}. Đây là draft ban đầu để tiếp tục review và hoàn thiện spec.`,
        socialBalanced: `${title} mang tinh thần vintage rõ rệt, gọn và dễ đeo. Đây là AI draft ban đầu để tiếp tục review sâu hơn.`,
        storytellingCopy: `${title} là một mẫu đồng hồ gợi cảm giác vintage khá rõ. Đây là draft AI ban đầu để tiếp tục kiểm tra ref, năm và các chi tiết sâu hơn.`,
        hashtags: [brand ? `#${brand.replace(/\s+/g, "")}` : null, "#vintagewatch"].filter(Boolean) as string[],
        missingData: [
            !s.bestRefCandidate ? "reference" : null,
            !s.yearEstimate ? "year" : null,
            !s.bestCaliberCandidate ? "caliber" : null,
        ].filter(Boolean) as string[],
        safetyNotes: [
            "Draft AI ban đầu, cần review lại trước khi post.",
            "Không dùng claim zin/NOS/serviced nếu chưa có xác nhận.",
        ],
    };
}

function specSchema() {
    return {
        name: "acquisition_spec_extraction",
        schema: {
            type: "object",
            additionalProperties: false,
            properties: {
                brandName: { type: ["string", "null"] },
                modelFamily: { type: ["string", "null"] },
                refCandidates: {
                    type: "array",
                    items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                            value: { type: "string" },
                            confidence: { type: "string", enum: ["high", "medium", "low"] },
                            reason: { type: "string" },
                        },
                        required: ["value", "confidence", "reason"],
                    },
                },
                bestRefCandidate: { type: ["string", "null"] },
                yearEstimate: { type: ["string", "null"] },
                yearRange: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        from: { type: ["number", "null"] },
                        to: { type: ["number", "null"] },
                    },
                    required: ["from", "to"],
                },
                yearConfidence: { type: "string", enum: ["high", "medium", "low"] },
                caseType: {
                    type: ["string", "null"],
                    enum: ["ROUND", "SQUARE", "RECTANGULAR", "TONNEAU", "CUSHION", null],
                },
                gender: {
                    type: ["string", "null"],
                    enum: ["MEN", "WOMEN", "UNISEX", null],
                },
                movement: {
                    type: ["string", "null"],
                    enum: ["QUARTZ", "AUTOMATIC", "MANUAL", null],
                },
                caliberCandidates: {
                    type: "array",
                    items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                            value: { type: "string" },
                            confidence: { type: "string", enum: ["high", "medium", "low"] },
                            reason: { type: "string" },
                        },
                        required: ["value", "confidence", "reason"],
                    },
                },
                bestCaliberCandidate: { type: ["string", "null"] },
                caseMaterial: {
                    type: ["string", "null"],
                    enum: ["STAINLESS_STEEL", "GOLD", "PLATED", "TWO_TONE", null],
                },
                goldKarat: { type: ["string", "null"] },
                goldColor: {
                    type: ["string", "null"],
                    enum: ["YELLOW_GOLD", "ROSE_GOLD", "WHITE_GOLD", null],
                },
                widthEstimateMm: { type: ["number", "null"] },
                lengthEstimateMm: { type: ["number", "null"] },
                thicknessEstimateMm: { type: ["number", "null"] },
                strapType: {
                    type: ["string", "null"],
                    enum: ["LEATHER", "BRACELET", "RUBBER", "FABRIC", null],
                },
                glass: {
                    type: ["string", "null"],
                    enum: ["MINERAL", "SAPPHIRE", "ACRYLIC", null],
                },
                dialColor: { type: ["string", "null"] },
                dialCondition: { type: ["string", "null"] },
                likelyAccessories: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        boxIncluded: { type: ["boolean", "null"] },
                        bookletIncluded: { type: ["boolean", "null"] },
                        cardIncluded: { type: ["boolean", "null"] },
                    },
                    required: ["boxIncluded", "bookletIncluded", "cardIncluded"],
                },
                confirmedFacts: { type: "object", additionalProperties: true },
                suggestedFacts: { type: "object", additionalProperties: true },
                confidence: {
                    type: "object",
                    additionalProperties: {
                        type: "string",
                        enum: ["high", "medium", "low"],
                    },
                },
                needsMoreImages: { type: "array", items: { type: "string" } },
                confidenceNotes: { type: "array", items: { type: "string" } },
            },
            required: [
                "brandName",
                "modelFamily",
                "refCandidates",
                "bestRefCandidate",
                "yearEstimate",
                "yearRange",
                "yearConfidence",
                "caseType",
                "gender",
                "movement",
                "caliberCandidates",
                "bestCaliberCandidate",
                "caseMaterial",
                "goldKarat",
                "goldColor",
                "widthEstimateMm",
                "lengthEstimateMm",
                "thicknessEstimateMm",
                "strapType",
                "glass",
                "dialColor",
                "dialCondition",
                "likelyAccessories",
                "confirmedFacts",
                "suggestedFacts",
                "confidence",
                "needsMoreImages",
                "confidenceNotes",
            ],
        },
    };
}

function draftSchema() {
    return {
        name: "acquisition_draft_generation",
        schema: {
            type: "object",
            additionalProperties: false,
            properties: {
                generatedTitle: { type: "string" },
                titleOptions: { type: "array", items: { type: "string" } },
                specBullets: { type: "array", items: { type: "string" } },
                listingCopy: { type: "string" },
                socialBalanced: { type: "string" },
                storytellingCopy: { type: "string" },
                hashtags: { type: "array", items: { type: "string" } },
                missingData: { type: "array", items: { type: "string" } },
                safetyNotes: { type: "array", items: { type: "string" } },
            },
            required: [
                "generatedTitle",
                "titleOptions",
                "specBullets",
                "listingCopy",
                "socialBalanced",
                "storytellingCopy",
                "hashtags",
                "missingData",
                "safetyNotes",
            ],
        },
    };
}

export async function generateAcquisitionDraft(
    input: GenerateAcquisitionDraftInput
): Promise<AcquisitionDraftResponse> {
    const fallbackSpec = buildFallbackSpec(input.titleHint || "", input.hintText || "");
    const fallbackDraft = buildFallbackDraft({
        extractedSpec: fallbackSpec,
        titleHint: input.titleHint,
    });

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini";

    if (!apiKey) {
        return {
            extractedSpec: fallbackSpec,
            generatedDraft: fallbackDraft,
            meta: {
                mode: "rule",
                model: null,
                message: "Thiếu OPENAI_API_KEY, dùng fallback rule-based.",
            },
        };
    }

    const dataUrls = await Promise.all(
        input.imageUrls.slice(0, 4).map((u) => repo.fetchImageAsDataUrl(u, input.origin))
    );

    const extractInput = [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là chuyên gia nhận diện đồng hồ vintage từ ảnh cho nghiệp vụ nhập hàng.",
                        "Mục tiêu là chuẩn xác tối đa, không phán bừa.",
                        "Ref, year, caliber chỉ đưa candidate/estimate khi có căn cứ; không chắc thì để null hoặc confidence thấp.",
                        "Hint người dùng là nguồn thông tin mạnh, nhưng vẫn phải phân biệt confirmedFacts và suggestedFacts.",
                        "Nếu user hint nói 'niềng 18K gold' thì đừng vội suy ra toàn bộ case là vàng khối nếu ảnh không đủ bằng chứng.",
                        "Nếu cần thêm ảnh để chốt ref/năm, hãy nêu rõ trong needsMoreImages.",
                    ].join(" "),
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: JSON.stringify(
                        {
                            vendorName: input.vendorName || null,
                            cost: input.cost ?? null,
                            titleHint: input.titleHint || null,
                            hintText: input.hintText || null,
                        },
                        null,
                        2
                    ),
                },
                ...dataUrls.map((url) => ({
                    type: "input_image" as const,
                    image_url: url,
                })),
            ],
        },
    ];

    const extractedSpec = await repo.callOpenAIJson<AcquisitionExtractedSpec>({
        apiKey,
        model,
        input: extractInput,
        schema: specSchema(),
    });

    const draftInput = [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là copywriter nội bộ cho cửa hàng đồng hồ vintage.",
                        "Viết title và product draft ban đầu cho bước acquisition.",
                        "Title phải ngắn, tự nhiên, dễ hiểu, nhất quán.",
                        "Không bịa ref, năm, caliber nếu extractedSpec chưa chắc chắn.",
                        "Listing copy gọn, social balanced vừa cảm xúc vừa factual, storytelling có chiều sâu hơn một chút nhưng không lố.",
                    ].join(" "),
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: JSON.stringify(
                        {
                            vendorName: input.vendorName || null,
                            cost: input.cost ?? null,
                            titleHint: input.titleHint || null,
                            hintText: input.hintText || null,
                            extractedSpec,
                        },
                        null,
                        2
                    ),
                },
            ],
        },
    ];

    const generatedDraft = await repo.callOpenAIJson<AcquisitionGeneratedDraft>({
        apiKey,
        model,
        input: draftInput,
        schema: draftSchema(),
    });

    return {
        extractedSpec,
        generatedDraft,
        meta: {
            mode: "openai",
            model,
            message: null,
        },
    };
}