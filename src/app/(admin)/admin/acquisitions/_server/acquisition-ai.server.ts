import type {
    AcquisitionDraftResponse,
    AcquisitionExtractedSpec,
    AcquisitionGeneratedDraft,
} from "./acquisition-ai.types";

export function toAbsoluteUrl(input: string, origin: string) {
    if (!input) return "";
    if (/^https?:\/\//i.test(input) || input.startsWith("data:")) return input;
    if (input.startsWith("/")) return `${origin}${input}`;
    return `${origin}/${input.replace(/^\/+/, "")}`;
}

export async function fetchImageAsDataUrl(imageUrl: string, origin: string) {
    const absoluteUrl = toAbsoluteUrl(imageUrl, origin);
    const res = await fetch(absoluteUrl);

    if (!res.ok) {
        throw new Error(`Không tải được ảnh: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
}

export function buildFallbackSpec(titleHint?: string): AcquisitionExtractedSpec {
    const title = String(titleHint || "").toLowerCase();

    const brandName = title.includes("omega")
        ? "Omega"
        : title.includes("seiko")
            ? "Seiko"
            : null;

    const movement =
        title.includes("pin") || title.includes("quartz") ? "QUARTZ" : null;

    const caseMaterial =
        title.includes("vàng") || title.includes("gold") ? "GOLD" : null;

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
        goldKarat: null,
        goldColor,

        widthEstimateMm: null,
        lengthEstimateMm: null,
        thicknessEstimateMm: null,

        strapType: null,
        glass: null,
        dialColor: null,
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
            goldColor,
        },

        suggestedFacts: {},

        confidence: {
            brandName: brandName ? "medium" : "low",
            movement: movement ? "medium" : "low",
            caseMaterial: caseMaterial ? "low" : "low",
        },

        needsMoreImages: ["caseback", "macro dial text"],

        confidenceNotes: [
            "Cần thêm ảnh caseback hoặc macro text để đoán ref/năm chính xác hơn.",
        ],
    };
}

export function buildFallbackDraft(input: {
    extractedSpec: AcquisitionExtractedSpec;
    titleHint?: string;
}): AcquisitionGeneratedDraft {
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

    const dialText = s.dialColor ? `mặt ${s.dialColor}` : "";

    const title =
        [brand, model, movementText, dialText].filter(Boolean).join(" ").trim() ||
        input.titleHint ||
        "Vintage watch";

    return {
        generatedTitle: title,
        titleOptions: [title].filter(Boolean),

        specBullets: [
            s.widthEstimateMm ? `▪️Kích thước ước lượng: ${s.widthEstimateMm}mm` : null,
            s.movement ? `▪️Bộ máy: ${movementText}` : null,
            s.caseMaterial ? `▪️Chất liệu vỏ: ${s.caseMaterial}` : null,
            s.dialColor ? `▪️Dial ${s.dialColor}` : null,
        ].filter(Boolean) as string[],

        listingCopy: `${title}. Mẫu đồng hồ vintage lên tay gọn gàng, dễ đeo, phù hợp làm product draft ban đầu.`,

        socialBalanced: `${title} mang tinh thần vintage rõ rệt, gọn và dễ đeo. Phù hợp để tiếp tục review spec và hoàn thiện content.`,

        storytellingCopy: `${title} là một mẫu đồng hồ gợi cảm giác vintage rất rõ, thiên về sự gọn gàng và dễ đeo hằng ngày. Đây là draft AI ban đầu để tiếp tục review chi tiết sâu hơn.`,

        hashtags: [
            brand ? `#${brand.replace(/\s+/g, "")}` : null,
            "#vintagewatch",
        ].filter(Boolean) as string[],

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

export function specSchema() {
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
                    additionalProperties: true,
                },
                suggestedFacts: {
                    type: "object",
                    additionalProperties: true,
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

export function draftSchema() {
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

export async function callOpenAIJson<T>({
    apiKey,
    model,
    input,
    schema,
}: {
    apiKey: string;
    model: string;
    input: any;
    schema: ReturnType<typeof specSchema> | ReturnType<typeof draftSchema>;
}): Promise<T> {
    const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            input,
            text: {
                format: {
                    type: "json_schema",
                    name: schema.name,
                    strict: true,
                    schema: schema.schema,
                },
            },
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(`OpenAI lỗi ${res.status}: ${JSON.stringify(json)}`);
    }

    const raw =
        json?.output
            ?.flatMap((item: any) => item?.content || [])
            ?.find((c: any) => c?.type === "output_text")?.text || "";

    if (!raw) {
        throw new Error("OpenAI không trả về output_text.");
    }

    return JSON.parse(raw) as T;
}

export async function generateAcquisitionDraft(params: {
    origin: string;
    apiKey?: string;
    model?: string;
    imageUrls: string[];
    vendorName?: string | null;
    cost?: number | null;
    titleHint?: string | null;
}): Promise<AcquisitionDraftResponse> {
    const fallbackSpec = buildFallbackSpec(params.titleHint || "");
    const fallbackDraft = buildFallbackDraft({
        extractedSpec: fallbackSpec,
        titleHint: params.titleHint || "",
    });

    if (!params.apiKey) {
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

    const model = params.model || "gpt-5-mini";
    const dataUrls = await Promise.all(
        params.imageUrls.slice(0, 4).map((u) => fetchImageAsDataUrl(u, params.origin))
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
                        "Ref, year, caliber chỉ đưa ra candidate hoặc estimate nếu có căn cứ; không chắc thì để trống/null.",
                        "Luôn phân biệt confirmedFacts và suggestedFacts.",
                        "Luôn trả confidence cho các field khó như ref, year, caliber, material.",
                        "Nếu thiếu bằng chứng để chốt ref/năm thì ghi needsMoreImages như caseback, macro dial text, serial.",
                    ].join(" "),
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: `Nguồn hàng: ${params.vendorName || "Không có"}\nGiá nhập: ${params.cost ?? "Không có"
                        }\nTên gợi ý nội bộ: ${params.titleHint || "Không có"}`,
                },
                ...dataUrls.map((url) => ({
                    type: "input_image" as const,
                    image_url: url,
                })),
            ],
        },
    ];

    const extractedSpec = await callOpenAIJson<AcquisitionExtractedSpec>({
        apiKey: params.apiKey,
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
                        "Viết title và draft spec/copy ban đầu dùng cho product draft sau phiếu nhập.",
                        "Không bịa ref, năm, caliber nếu extractedSpec chưa chắc chắn.",
                        "Nếu thiếu dữ liệu thì title vẫn phải gọn, rõ, dễ đọc.",
                        "Tiếng Việt tự nhiên, ngắn gọn, đúng chất vintage, không khoa trương.",
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
                            vendorName: params.vendorName || null,
                            cost: params.cost ?? null,
                            titleHint: params.titleHint || null,
                            extractedSpec,
                        },
                        null,
                        2
                    ),
                },
            ],
        },
    ];

    const generatedDraft = await callOpenAIJson<AcquisitionGeneratedDraft>({
        apiKey: params.apiKey,
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