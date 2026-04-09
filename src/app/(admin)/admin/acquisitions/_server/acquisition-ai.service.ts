import type {
    AcquisitionDraftResponse,
    AcquisitionExtractedSpec,
    GenerateAcquisitionDraftInput,
} from "./acquisition-ai.types";
import * as repo from "./acquisition-ai.repo";

function buildFallbackSpec(titleHint?: string, hintText?: string): AcquisitionExtractedSpec {
    const source = `${titleHint || ""} ${hintText || ""}`.toLowerCase();

    const brandName = source.includes("omega")
        ? "Omega"
        : source.includes("seiko")
            ? "Seiko"
            : source.includes("orient")
                ? "Orient"
                : source.includes("longines")
                    ? "Longines"
                    : null;

    const movement =
        source.includes("pin") || source.includes("quartz")
            ? "QUARTZ"
            : source.includes("automatic") || source.includes("tự động")
                ? "AUTOMATIC"
                : source.includes("lên dây") || source.includes("manual")
                    ? "MANUAL"
                    : null;

    const caseMaterial =
        source.includes("18k gold") || source.includes("18k") || source.includes("gold")
            ? "GOLD"
            : source.includes("steel") || source.includes("stainless") || source.includes("thép")
                ? "STAINLESS_STEEL"
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
        suggestedFacts: {
            probableBrand: brandName,
            probableMovement: movement,
            probableCaseMaterial: caseMaterial,
            probableGoldKarat: goldKarat,
            probableGoldColor: goldColor,
            //notes: [],
        },
        confidence: {
            brandName: brandName ? "medium" : "low",
            movement: movement ? "medium" : "low",
            caseMaterial: caseMaterial ? "medium" : "low",
            goldKarat: goldKarat ? "medium" : "low",
            goldColor: goldColor ? "medium" : "low",
        },
        needsMoreImages: ["caseback", "macro dial text"],
        confidenceNotes: ["Cần thêm ảnh caseback hoặc macro text để đoán ref/năm chính xác hơn."],
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
                confirmedFacts: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        brandName: { type: ["string", "null"] },
                        movement: { type: ["string", "null"] },
                        caseMaterial: { type: ["string", "null"] },
                        goldKarat: { type: ["string", "null"] },
                        goldColor: { type: ["string", "null"] },
                    },
                    required: ["brandName", "movement", "caseMaterial", "goldKarat", "goldColor"],
                },
                suggestedFacts: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        probableBrand: { type: ["string", "null"] },
                        probableMovement: { type: ["string", "null"] },
                        probableCaseMaterial: { type: ["string", "null"] },
                        probableGoldKarat: { type: ["string", "null"] },
                        probableGoldColor: { type: ["string", "null"] },
                        notes: { type: "array", items: { type: "string" } },
                    },
                    required: [
                        "probableBrand",
                        "probableMovement",
                        "probableCaseMaterial",
                        "probableGoldKarat",
                        "probableGoldColor",
                        "notes",
                    ],
                },
                confidence: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        brandName: { type: "string", enum: ["high", "medium", "low"] },
                        movement: { type: "string", enum: ["high", "medium", "low"] },
                        caseMaterial: { type: "string", enum: ["high", "medium", "low"] },
                        goldKarat: { type: "string", enum: ["high", "medium", "low"] },
                        goldColor: { type: "string", enum: ["high", "medium", "low"] },
                    },
                    required: ["brandName", "movement", "caseMaterial", "goldKarat", "goldColor"],
                },
                needsMoreImages: { type: "array", items: { type: "string" } },
                confidenceNotes: { type: "array", items: { type: "string" } },
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
                        styleNotes: { type: "array", items: { type: "string" } },
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
    const probable = { ...(((extracted as any)?.probableVisualFacts ?? {}) as Record<string, unknown>) };

    if (!probable["probableBrand"]) {
        probable["probableBrand"] =
            asNonEmptyString((extracted as any)?.suggestedFacts?.probableBrand) ??
            asNonEmptyString(extracted.brandName);
    }

    if (!probable["strapType"]) {
        if (source.includes("bracelet") || source.includes("dây thép") || source.includes("day thep")) {
            probable["strapType"] = "BRACELET";
        } else if (source.includes("leather") || source.includes("dây da") || source.includes("day da")) {
            probable["strapType"] = "LEATHER";
        } else if (source.includes("rubber") || source.includes("cao su")) {
            probable["strapType"] = "RUBBER";
        }
    }

    if (!probable["caseType"]) {
        if (source.includes("tank") || source.includes("rectangular") || source.includes("chữ nhật") || source.includes("chu nhat")) {
            probable["caseType"] = "RECTANGULAR";
        } else if (source.includes("round") || source.includes("tròn") || source.includes("tron")) {
            probable["caseType"] = "ROUND";
        } else if (source.includes("square") || source.includes("vuông") || source.includes("vuong")) {
            probable["caseType"] = "SQUARE";
        }
    }

    if (!probable["movement"]) {
        if (source.includes("quartz")) probable["movement"] = "QUARTZ";
        else if (source.includes("automatic")) probable["movement"] = "AUTOMATIC";
        else if (source.includes("manual") || source.includes("lên dây")) probable["movement"] = "MANUAL";
    }

    if (!probable["caseMaterial"]) {
        if (source.includes("steel") || source.includes("stainless") || source.includes("thép") || source.includes("thep")) {
            probable["caseMaterial"] = "STAINLESS_STEEL";
        } else if (source.includes("gold") || source.includes("mạ vàng") || source.includes("ma vang") || source.includes("vàng")) {
            probable["caseMaterial"] = "GOLD";
        } else if (source.includes("two tone") || source.includes("two-tone")) {
            probable["caseMaterial"] = "TWO_TONE";
        }
    }

    return {
        ...extracted,
        probableVisualFacts: {
            probableBrand: asNonEmptyString(probable["probableBrand"]),
            caseType: asNonEmptyString(probable["caseType"]),
            displayType: asNonEmptyString(probable["displayType"]),
            strapType: asNonEmptyString(probable["strapType"]),
            dialColor: asNonEmptyString(probable["dialColor"]),
            dialMarkers: asNonEmptyString(probable["dialMarkers"]),
            glass: asNonEmptyString(probable["glass"]),
            caseMaterial: asNonEmptyString(probable["caseMaterial"]),
            movement: asNonEmptyString(probable["movement"]),
            gender: asNonEmptyString(probable["gender"]),
            sizeClass: asNonEmptyString(probable["sizeClass"]),
            era: asNonEmptyString(probable["era"]),
            widthEstimateMm: asNumberOrNull(probable["widthEstimateMm"]),
            styleNotes: Array.isArray(probable["styleNotes"]) ? (probable["styleNotes"] as string[]) : [],
        },
    } as AcquisitionExtractedSpec;
}

export async function generateAcquisitionDraft(
    input: GenerateAcquisitionDraftInput
): Promise<AcquisitionDraftResponse> {
    const fallbackSpec = buildFallbackSpec(input.titleHint || "", input.hintText || "");
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini";

    if (!apiKey) {
        return {
            extractedSpec: fallbackSpec,
            generatedDraft: null,
            aiVisionRaw: null,
            meta: {
                mode: "rule",
                model: null,
                message: "Thiếu OPENAI_API_KEY, dùng fallback rule-based.",
            },
        };
    }

    const imageEntries =
        Array.isArray(input.imageEntries) && input.imageEntries.length > 0
            ? input.imageEntries
            : (input.imageUrls ?? []).map((url) => ({ url }));

    const settled = await Promise.allSettled(
        imageEntries.slice(0, 4).map((entry) => repo.fetchImageEntryAsDataUrl(entry, input.origin))
    );

    const dataUrls = settled
        .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled" && Boolean(result.value))
        .map((result) => result.value);

    if (!dataUrls.length) {
        return {
            extractedSpec: fallbackSpec,
            generatedDraft: null,
            aiVisionRaw: null,
            meta: {
                mode: "rule",
                model,
                message: "Không đọc được ảnh từ storage/url, dùng fallback.",
            },
        };
    }

    try {
        let extractedSpec = await repo.callOpenAIJson<AcquisitionExtractedSpec>({
            apiKey,
            model,
            input: [
                {
                    role: "developer",
                    content: [
                        {
                            type: "input_text",
                            text: [
                                "Bạn là chuyên gia nhận diện đồng hồ vintage/pre-owned từ ảnh cho nghiệp vụ nhập hàng nội bộ.",
                                "Mục tiêu ở bước này chỉ là gen spec draft, không viết content bán hàng.",
                                "Hãy ưu tiên trích xuất những gì nhìn được từ ảnh: brand probable, caseType, movement probable, caseMaterial probable, strapType, dialColor, dial markers, widthEstimateMm, style notes.",
                                "Nếu brand chưa đủ mạnh để confirm thì để brandName = null nhưng vẫn điền probableBrand khi có cơ sở.",
                                "Không bịa ref, caliber, year khi không có bằng chứng rõ ràng.",
                                "Nếu chỉ có một ảnh mặt trước, vẫn phải cố đưa ra partial visual facts hữu ích thay vì để toàn null.",
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
                                        onlySpecNoMarketingCopy: true,
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
            ],
            schema: specSchema(),
        });

        extractedSpec = normalizeExtractedSpec(extractedSpec, {
            titleHint: input.titleHint || "",
            hintText: input.hintText || "",
        });

        return {
            extractedSpec,
            generatedDraft: null,
            aiVisionRaw: null,
            meta: {
                mode: "openai",
                model,
                message: null,
            },
        };
    } catch (error) {
        console.error("[ACQ_AI][OPENAI_FAILED]", {
            error: error instanceof Error ? error.message : error,
        });

        return {
            extractedSpec: fallbackSpec,
            generatedDraft: null,
            aiVisionRaw: null,
            meta: {
                mode: "rule",
                model,
                message: "OpenAI/acquisition AI lỗi, dùng fallback từ title/hint.",
            },
        };
    }
}
