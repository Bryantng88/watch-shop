import type { ExtractedSpec, GeneratedPayload, TonePreset } from "./product-ai.types";

function text(v: any) {
    if (v == null) return "";
    return String(v).trim();
}

function num(v: any) {
    if (v == null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function toAbsoluteUrl(input: string, origin: string) {
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

export function buildFacts(watchSpec: any) {
    const facts = {
        ref: text(watchSpec?.ref) || null,
        model: text(watchSpec?.model) || null,
        year: text(watchSpec?.year) || null,
        caseType: text(watchSpec?.caseType) || null,
        gender: text(watchSpec?.gender) || null,
        movement: text(watchSpec?.movement) || null,
        caliber: text(watchSpec?.caliber) || null,
        caseMaterial: text(watchSpec?.caseMaterial) || null,
        goldKarat: text(watchSpec?.goldKarat) || null,
        goldColor: text(watchSpec?.goldColor) || null,
        width: num(watchSpec?.width),
        length: num(watchSpec?.length),
        thickness: num(watchSpec?.thickness),
        strap: text(watchSpec?.strap) || null,
        glass: text(watchSpec?.glass) || null,
        dialColor: text(watchSpec?.dialColor) || null,
        dialCondition: text(watchSpec?.dialCondition) || null,
        boxIncluded:
            typeof watchSpec?.boxIncluded === "boolean" ? watchSpec.boxIncluded : null,
        bookletIncluded:
            typeof watchSpec?.bookletIncluded === "boolean"
                ? watchSpec.bookletIncluded
                : null,
        cardIncluded:
            typeof watchSpec?.cardIncluded === "boolean" ? watchSpec.cardIncluded : null,
    };

    const missingData: string[] = [];
    if (!facts.ref) missingData.push("reference");
    if (!facts.model) missingData.push("model");
    if (!facts.year) missingData.push("year");
    if (!facts.movement) missingData.push("movement");
    if (!facts.width) missingData.push("size");
    if (!facts.dialColor) missingData.push("dial color");

    return { facts, missingData };
}

export function buildRuleBasedContent(
    input: {
        title?: string;
        brandName?: string;
        watchSpec: any;
    }
): GeneratedPayload {
    const { facts, missingData } = buildFacts(input.watchSpec);
    const brand = text(input.brandName) || null;
    const title = text(input.title) || "";

    const movementText =
        facts.movement === "QUARTZ"
            ? "máy pin"
            : facts.movement === "AUTOMATIC"
                ? "máy automatic"
                : facts.movement === "MANUAL"
                    ? "máy lên dây"
                    : "bộ máy";

    const sizeText =
        facts.width == null
            ? null
            : facts.width <= 35
                ? `${facts.width}mm – size cổ điển, đeo gọn tay`
                : facts.width <= 37
                    ? `${facts.width}mm – size cân đối, lên tay thanh lịch`
                    : `${facts.width}mm – size hiện đại hơn, đeo đầm tay`;

    const specBullets = [
        sizeText ? `▪️Case size: ${sizeText}` : null,
        facts.caseMaterial ? `▪️Chất liệu vỏ: ${facts.caseMaterial}` : null,
        facts.movement ? `▪️Movement: ${movementText}${brand ? ` ${brand}` : ""}` : null,
        facts.dialColor
            ? `▪️Dial ${facts.dialColor}${facts.dialCondition ? ` condition ${facts.dialCondition}` : ""}`
            : null,
        facts.glass ? `▪️Kính: ${facts.glass}` : null,
    ].filter(Boolean) as string[];

    const intro =
        title || brand
            ? `${title || brand} mang tinh thần vintage rõ rệt, gọn gàng và dễ đeo.`
            : `Mẫu đồng hồ này mang tinh thần vintage rõ rệt, gọn gàng và dễ đeo.`;

    const movementLine = facts.movement
        ? `Bên trong là ${movementText}${brand ? ` ${brand}` : ""}, phù hợp cho nhu cầu đeo hàng ngày.`
        : `Bên trong là bộ máy vận hành ổn định, phù hợp cho nhu cầu đeo hàng ngày.`;

    const visualLine = facts.dialColor
        ? `Dial ${facts.dialColor} tạo điểm nhìn gọn và dễ mặc cùng nhiều phong cách.`
        : `Tổng thể mặt số và vỏ cho cảm giác cân đối, dễ chơi.`;

    const sizeLine = sizeText
        ? `Form ${sizeText}, phù hợp với cổ tay châu Á.`
        : `Form lên tay cân đối và thanh lịch.`;

    return {
        specBullets,
        promoteShort: `${intro} ${movementLine}`,
        promoteLong: [intro, visualLine, movementLine, sizeLine].join("\n\n"),
        facebookCaption: [intro, visualLine, movementLine, sizeLine, ...specBullets].join(
            "\n\n"
        ),
        instagramCaption: [intro, visualLine, sizeLine].join("\n\n"),
        titleOptions: [
            [brand, facts.model, facts.dialColor ? `mặt ${facts.dialColor}` : null]
                .filter(Boolean)
                .join(" "),
            title || null,
        ].filter(Boolean) as string[],
        hashtags: [
            brand ? `#${brand.replace(/\s+/g, "")}` : null,
            facts.model ? `#${facts.model.replace(/\s+/g, "")}` : null,
            "#vintagewatch",
            "#watchcollector",
        ].filter(Boolean) as string[],
        missingData,
        safetyNotes: [
            "Không dùng claim zin, NOS, nguyên bản, hiếm nếu chưa có xác nhận trong dữ liệu.",
            "Không khẳng định serviced nếu chưa có xác nhận kỹ thuật.",
        ],
    };
}

export function contentToneInstruction(tonePreset: TonePreset) {
    switch (tonePreset) {
        case "refined":
            return "Giọng văn tinh tế, chừng mực, sang nhưng không phô trương.";
        case "collector":
            return "Giọng văn đúng chất người chơi vintage, chú ý chi tiết, tránh quá bán hàng.";
        case "sales":
            return "Giọng văn thuyết phục, dễ bán, nhưng vẫn giữ sự tinh tế và không bịa dữ kiện.";
        case "listing":
            return "Viết gọn, rõ, giàu thông tin, phù hợp listing/đăng sản phẩm.";
        default:
            return "Giọng văn cân bằng giữa thông tin và cảm xúc, tự nhiên, dễ đọc.";
    }
}

export function specExtractSchema() {
    return {
        name: "watch_spec_extraction",
        strict: true,
        schema: {
            type: "object",
            additionalProperties: false,
            properties: {
                brandName: { type: ["string", "null"] },
                ref: { type: ["string", "null"] },
                model: { type: ["string", "null"] },
                year: { type: ["string", "null"] },
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
                caliber: { type: ["string", "null"] },
                caseMaterial: {
                    type: ["string", "null"],
                    enum: ["STAINLESS_STEEL", "GOLD", "PLATED", "TWO_TONE", null],
                },
                goldKarat: { type: ["string", "null"] },
                goldColor: {
                    type: ["string", "null"],
                    enum: ["YELLOW_GOLD", "ROSE_GOLD", "WHITE_GOLD", null],
                },
                width: { type: ["number", "null"] },
                length: { type: ["number", "null"] },
                thickness: { type: ["number", "null"] },
                strap: {
                    type: ["string", "null"],
                    enum: ["LEATHER", "BRACELET", "RUBBER", "FABRIC", null],
                },
                glass: {
                    type: ["string", "null"],
                    enum: ["MINERAL", "SAPPHIRE", "ACRYLIC", null],
                },
                dialColor: { type: ["string", "null"] },
                dialCondition: { type: ["string", "null"] },
                boxIncluded: { type: ["boolean", "null"] },
                bookletIncluded: { type: ["boolean", "null"] },
                cardIncluded: { type: ["boolean", "null"] },
                confidence: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        brandName: { type: "string", enum: ["high", "medium", "low"] },
                        ref: { type: "string", enum: ["high", "medium", "low"] },
                        model: { type: "string", enum: ["high", "medium", "low"] },
                        year: { type: "string", enum: ["high", "medium", "low"] },
                        caseType: { type: "string", enum: ["high", "medium", "low"] },
                        gender: { type: "string", enum: ["high", "medium", "low"] },
                        movement: { type: "string", enum: ["high", "medium", "low"] },
                        caliber: { type: "string", enum: ["high", "medium", "low"] },
                        caseMaterial: { type: "string", enum: ["high", "medium", "low"] },
                        goldKarat: { type: "string", enum: ["high", "medium", "low"] },
                        goldColor: { type: "string", enum: ["high", "medium", "low"] },
                        width: { type: "string", enum: ["high", "medium", "low"] },
                        length: { type: "string", enum: ["high", "medium", "low"] },
                        thickness: { type: "string", enum: ["high", "medium", "low"] },
                        strap: { type: "string", enum: ["high", "medium", "low"] },
                        glass: { type: "string", enum: ["high", "medium", "low"] },
                        dialColor: { type: "string", enum: ["high", "medium", "low"] },
                        dialCondition: { type: "string", enum: ["high", "medium", "low"] },
                        boxIncluded: { type: "string", enum: ["high", "medium", "low"] },
                        bookletIncluded: { type: "string", enum: ["high", "medium", "low"] },
                        cardIncluded: { type: "string", enum: ["high", "medium", "low"] },
                    },
                    required: [
                        "brandName",
                        "ref",
                        "model",
                        "year",
                        "caseType",
                        "gender",
                        "movement",
                        "caliber",
                        "caseMaterial",
                        "goldKarat",
                        "goldColor",
                        "width",
                        "length",
                        "thickness",
                        "strap",
                        "glass",
                        "dialColor",
                        "dialCondition",
                        "boxIncluded",
                        "bookletIncluded",
                        "cardIncluded",
                    ],
                },
                confidenceNotes: {
                    type: "array",
                    items: { type: "string" },
                },
            },
            required: [
                "brandName",
                "ref",
                "model",
                "year",
                "caseType",
                "gender",
                "movement",
                "caliber",
                "caseMaterial",
                "goldKarat",
                "goldColor",
                "width",
                "length",
                "thickness",
                "strap",
                "glass",
                "dialColor",
                "dialCondition",
                "boxIncluded",
                "bookletIncluded",
                "cardIncluded",
                "confidence",
                "confidenceNotes",
            ],
        },
    };
}

export function contentSchema() {
    return {
        name: "watch_content_generation",
        strict: true,
        schema: {
            type: "object",
            additionalProperties: false,
            properties: {
                specBullets: { type: "array", items: { type: "string" } },
                promoteShort: { type: "string" },
                promoteLong: { type: "string" },
                facebookCaption: { type: "string" },
                instagramCaption: { type: "string" },
                titleOptions: { type: "array", items: { type: "string" } },
                hashtags: { type: "array", items: { type: "string" } },
                missingData: { type: "array", items: { type: "string" } },
                safetyNotes: { type: "array", items: { type: "string" } },
            },
            required: [
                "specBullets",
                "promoteShort",
                "promoteLong",
                "facebookCaption",
                "instagramCaption",
                "titleOptions",
                "hashtags",
                "missingData",
                "safetyNotes",
            ],
        },
    };
}

export async function callResponsesJson<T>({
    apiKey,
    model,
    input,
    jsonSchema,
}: {
    apiKey: string;
    model: string;
    input: any;
    jsonSchema: any;
}): Promise<T> {
    const response = await fetch("https://api.openai.com/v1/responses", {
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
                    name: jsonSchema.name,
                    strict: true,
                    schema: jsonSchema.schema,
                },
            },
        }),
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(
            `OpenAI lỗi ${response.status}: ${JSON.stringify(json)}`
        );
    }

    const raw =
        json?.output?.flatMap((item: any) => item?.content || [])
            ?.find((c: any) => c?.type === "output_text")
            ?.text || "";

    if (!raw) {
        throw new Error("OpenAI không trả về output_text.");
    }

    return JSON.parse(raw) as T;
}