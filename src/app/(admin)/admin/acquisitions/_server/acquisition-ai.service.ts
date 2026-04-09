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
        probableVisualFacts: {
            probableBrand: brandName,
            caseType: null,
            displayType: null,
            strapType: source.includes("dây da") ? "LEATHER" : null,
            dialColor: source.includes("champagne") ? "champagne" : null,
            dialMarkers: null,
            glass: null,
            caseMaterial,
            movement,
            gender: null,
            sizeClass: null,
            era: null,
            widthEstimateMm: null,
            styleNotes: [],
        },
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
                yearConfidence: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                },
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
                confirmedFacts: {
                    type: "object",
                    additionalProperties: {
                        type: ["string", "number", "boolean", "null"],
                    },
                },
                suggestedFacts: {
                    type: "object",
                    additionalProperties: {
                        type: ["string", "number", "boolean", "null"],
                    },
                },
                confidence: {
                    type: "object",
                    additionalProperties: {
                        type: "string",
                        enum: ["high", "medium", "low"],
                    },
                },
                needsMoreImages: {
                    type: "array",
                    items: { type: "string" },
                },
                confidenceNotes: {
                    type: "array",
                    items: { type: "string" },
                },
                probableVisualFacts: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        probableBrand: { type: ["string", "null"] },
                        caseType: { type: ["string", "null"] },
                        displayType: { type: ["string", "null"] },
                        strapType: { type: ["string", "null"] },
                        dialColor: { type: ["string", "null"] },
                        dialMarkers: { type: ["string", "null"] },
                        glass: { type: ["string", "null"] },
                        caseMaterial: { type: ["string", "null"] },
                        movement: { type: ["string", "null"] },
                        gender: { type: ["string", "null"] },
                        sizeClass: { type: ["string", "null"] },
                        era: { type: ["string", "null"] },
                        widthEstimateMm: { type: ["number", "null"] },
                        styleNotes: {
                            type: "array",
                            items: { type: "string" },
                        },
                    },
                    required: [
                        "probableBrand",
                        "caseType",
                        "displayType",
                        "strapType",
                        "dialColor",
                        "dialMarkers",
                        "glass",
                        "caseMaterial",
                        "movement",
                        "gender",
                        "sizeClass",
                        "era",
                        "widthEstimateMm",
                        "styleNotes",
                    ],
                },
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
                "probableVisualFacts",
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

    if (!dataUrls.length) {
        return {
            extractedSpec: fallbackSpec,
            generatedDraft: fallbackDraft,
            meta: {
                mode: "rule",
                model,
                message:
                    "Không đọc được ảnh từ storage/url ở bước acquisition, dùng fallback hiện có.",
            },
        };
    }

    const extractInput = [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là chuyên gia nhận diện đồng hồ vintage/pre-owned từ ảnh cho nghiệp vụ nhập hàng nội bộ.",
                        "Mục tiêu là chuẩn xác tối đa ở các dữ liệu nhận diện mạnh, nhưng vẫn cố gắng trích xuất được partial spec hữu ích từ chỉ 1 ảnh mặt trước khi có thể.",
                        "Tách rõ 3 lớp thông tin:",
                        "1) confirmedFacts: chỉ dùng khi có cơ sở khá chắc.",
                        "2) probableVisualFacts: cho phép suy luận mềm từ hình ảnh trực quan, nhất là khi chỉ có 1 ảnh mặt trước.",
                        "3) needsMoreImages: nêu rõ cần thêm ảnh gì để xác minh ref, year, caliber hoặc các dữ liệu khó.",
                        "Không bịa ref, year, caliber nếu không có cơ sở rõ ràng.",
                        "Nếu không chắc các dữ liệu nhận diện mạnh thì để null.",
                        "Tuy nhiên, không nên để toàn bộ null nếu ảnh vẫn cho thấy được một số yếu tố trực quan như màu mặt số, kiểu dây/bracelet, kiểu vỏ, chất liệu tone bề mặt, movement probable, kích thước tương đối.",
                        "Hint người dùng là nguồn thông tin mạnh, nhưng vẫn phải phân biệt confirmedFacts và probableVisualFacts/suggestedFacts.",
                        "Nếu hint nói 'niềng 18K gold' thì không được tự động suy ra toàn bộ case là vàng khối nếu ảnh không đủ bằng chứng.",
                        "Nếu cần thêm ảnh để chốt ref/năm/caliber, hãy nêu rõ trong needsMoreImages.",
                        "Ưu tiên với 1 ảnh mặt trước vẫn cố gắng điền probableVisualFacts cho:",
                        "- caseType",
                        "- strapType",
                        "- dialColor",
                        "- glass",
                        "- caseMaterial",
                        "- movement (nếu chỉ là suy đoán mềm thì để ở probableVisualFacts, confidence thấp)",
                        "- widthEstimateMm nếu có cơ sở tương đối.",
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
                            instructions: {
                                goal: "Tạo extractedSpec cho bước acquisition",
                                prioritizeSoftVisualFacts: true,
                                allowPartialSpecFromSingleFrontImage: true,
                                doNotInventStrongIdentityFields: true,
                            },
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

    let extractedSpec = await repo.callOpenAIJson<AcquisitionExtractedSpec>({
        apiKey,
        model,
        input: extractInput,
        schema: specSchema(),
    });

    extractedSpec = normalizeExtractedSpec(extractedSpec, {
        titleHint: input.titleHint || "",
        hintText: input.hintText || "",
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
                        "Nếu extractedSpec còn yếu, vẫn phải viết draft gọn gàng, có thể hiện đây là bản draft ban đầu để tiếp tục review.",
                        "Listing copy gọn, social balanced vừa cảm xúc vừa factual, storytelling có chiều sâu hơn một chút nhưng không lố.",
                        "Nếu titleHint có ích thì ưu tiên dùng để tránh title vô nghĩa như 'Untitled watch'.",
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

    let generatedDraft = await repo.callOpenAIJson<AcquisitionGeneratedDraft>({
        apiKey,
        model,
        input: draftInput,
        schema: draftSchema(),
    });

    generatedDraft = normalizeGeneratedDraft(generatedDraft, {
        titleHint: input.titleHint || "",
        hintText: input.hintText || "",
        extractedSpec,
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

function asNonEmptyString(value: unknown): string | null {
    if (value == null) return null;
    const s = String(value).trim();
    return s ? s : null;
}

function asNumberOrNull(value: unknown): number | null {
    if (value == null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function normalizeExtractedSpec(
    extracted: AcquisitionExtractedSpec,
    input: { titleHint: string; hintText: string }
): AcquisitionExtractedSpec {
    const source = `${input.titleHint} ${input.hintText}`.toLowerCase();
    const probable = (extracted as any)?.probableVisualFacts ?? {};

    if (!probable.strapType) {
        if (
            source.includes("bracelet") ||
            source.includes("dây thép") ||
            source.includes("day thep")
        ) {
            probable.strapType = "BRACELET";
        } else if (source.includes("leather") || source.includes("da")) {
            probable.strapType = "LEATHER";
        } else if (source.includes("rubber") || source.includes("cao su")) {
            probable.strapType = "RUBBER";
        }
    }

    if (!probable.caseType) {
        if (
            source.includes("tank") ||
            source.includes("rectangular") ||
            source.includes("chữ nhật") ||
            source.includes("chu nhat")
        ) {
            probable.caseType = "TANK";
        } else if (
            source.includes("round") ||
            source.includes("tròn") ||
            source.includes("tron")
        ) {
            probable.caseType = "ROUND";
        } else if (
            source.includes("square") ||
            source.includes("vuông") ||
            source.includes("vuong")
        ) {
            probable.caseType = "SQUARE";
        }
    }

    if (!probable.movement) {
        if (source.includes("quartz")) probable.movement = "QUARTZ";
        else if (source.includes("automatic")) probable.movement = "AUTOMATIC";
        else if (source.includes("manual")) probable.movement = "HAND_WOUND";
        else if (source.includes("solar")) probable.movement = "SOLAR";
    }

    if (!probable.caseMaterial) {
        if (
            source.includes("steel") ||
            source.includes("stainless") ||
            source.includes("thép") ||
            source.includes("thep")
        ) {
            probable.caseMaterial = "STAINLESS_STEEL";
        } else if (
            source.includes("gold") ||
            source.includes("mạ vàng") ||
            source.includes("ma vang") ||
            source.includes("vang")
        ) {
            probable.caseMaterial = "GOLD";
        } else if (source.includes("two tone") || source.includes("two-tone")) {
            probable.caseMaterial = "TWO_TONE";
        }
    }

    return {
        ...extracted,
        probableVisualFacts: {
            probableBrand:
                asNonEmptyString(probable.probableBrand) ||
                asNonEmptyString(extracted.brandName),
            caseType: asNonEmptyString(probable.caseType),
            displayType: asNonEmptyString(probable.displayType),
            strapType: asNonEmptyString(probable.strapType),
            dialColor:
                asNonEmptyString(probable.dialColor) ||
                asNonEmptyString(extracted.dialColor),
            dialMarkers: asNonEmptyString(probable.dialMarkers),
            glass: asNonEmptyString(probable.glass),
            caseMaterial: asNonEmptyString(probable.caseMaterial),
            movement: asNonEmptyString(probable.movement),
            gender: asNonEmptyString(probable.gender),
            sizeClass: asNonEmptyString(probable.sizeClass),
            era: asNonEmptyString(probable.era),
            widthEstimateMm:
                asNumberOrNull(probable.widthEstimateMm) ??
                asNumberOrNull(extracted.widthEstimateMm),
            styleNotes: Array.isArray(probable.styleNotes) ? probable.styleNotes : [],
        },
    } as AcquisitionExtractedSpec;
}
function normalizeGeneratedDraft(
    draft: AcquisitionGeneratedDraft,
    input: {
        titleHint: string;
        hintText: string;
        extractedSpec: AcquisitionExtractedSpec;
    }
): AcquisitionGeneratedDraft {
    const fallbackTitle =
        asNonEmptyString(draft?.generatedTitle) ||
        asNonEmptyString(input.titleHint) ||
        asNonEmptyString(input.hintText) ||
        asNonEmptyString(input.extractedSpec?.brandName) ||
        "Vintage watch draft";

    return {
        ...draft,
        generatedTitle: fallbackTitle,
        titleOptions:
            Array.isArray(draft?.titleOptions) && draft.titleOptions.length > 0
                ? draft.titleOptions
                : [fallbackTitle],
        specBullets: Array.isArray(draft?.specBullets) ? draft.specBullets : [],
        listingCopy:
            asNonEmptyString((draft as any)?.listingCopy) ||
            `${fallbackTitle}. Đây là draft ban đầu để tiếp tục review và hoàn thiện spec.`,
        socialBalanced:
            asNonEmptyString((draft as any)?.socialBalanced) ||
            `${fallbackTitle} là draft AI ban đầu để tiếp tục review sâu hơn.`,
        storytellingCopy:
            asNonEmptyString((draft as any)?.storytellingCopy) ||
            `${fallbackTitle} là bản draft AI ban đầu để tiếp tục kiểm tra thêm các chi tiết sâu hơn.`,
        hashtags: Array.isArray(draft?.hashtags) ? draft.hashtags : [],
        missingData: Array.isArray((draft as any)?.missingData) ? (draft as any).missingData : [],
        safetyNotes: Array.isArray((draft as any)?.safetyNotes) ? (draft as any).safetyNotes : [],
    };
}