import { buildProductContentFacts, type ProductContentFacts } from "./product-content.facts";

function bullet(text: string) {
    return `▪️${text}`;
}

function dedupeLines(lines: Array<string | null | undefined>) {
    return Array.from(new Set(lines.filter(Boolean).map((x) => String(x).trim()).filter(Boolean)));
}

export type GeneratedProductContent = {
    specBullets: string[];
    promoteShort: string;
    promoteLong: string;
    facebookCaption: string;
    instagramCaption: string;
    titleOptions: string[];
    hashtags: string[];
    missingData: string[];
    safetyNotes: string[];
    promptNote: string;
    rawFacts: ProductContentFacts;
};

export function generateRuleBasedProductContent(product: any): GeneratedProductContent {
    const facts = buildProductContentFacts(product);
    const brand = facts.brand ?? "Chiếc đồng hồ này";
    const subject = [facts.brand, facts.lineName].filter(Boolean).join(" ") || facts.title || "chiếc đồng hồ này";

    const specBullets = dedupeLines([
        ...facts.specBulletsBase,
        facts.accessoryText ? `Phụ kiện: ${facts.accessoryText}` : null,
        facts.servicedText,
    ]).map(bullet);

    const opening = dedupeLines([
        facts.eraText ? `Một chiếc ${subject} rất đúng tinh thần ${facts.eraText}.` : `Một chiếc ${subject} rất đúng chất vintage.`,
        facts.shapeText || facts.caseMaterialText
            ? `${facts.shapeText ? `${facts.shapeText[0].toUpperCase()}${facts.shapeText.slice(1)}` : "Phom dáng"}${facts.caseMaterialText ? ` kết hợp ${facts.caseMaterialText}` : ""} tạo nên tổng thể cực kỳ hài hòa.`
            : null,
    ]).join(" ");

    const body = dedupeLines([
        facts.dialColorText ? `Dial ${facts.dialColorText.toLowerCase()} là điểm nhìn rất ăn tiền, giữ được tinh thần thanh lịch và có chiều sâu thị giác.` : null,
        facts.movementText ? `Bên trong là bộ máy ${facts.movementText.toLowerCase()}${facts.brand ? ` của ${facts.brand}` : ""}${facts.movementCharm ? `, ${facts.movementCharm}` : ""}.` : null,
        facts.sizeText ? `${facts.sizeText} ${facts.sizeNote ?? ""}`.trim() + "." : null,
        facts.glassText ? `Chi tiết ${facts.glassText.toLowerCase()} giúp tổng thể giữ được cảm giác đúng chất đồng hồ cổ.` : null,
    ]).join(" ");

    const closing = dedupeLines([
        facts.styleText ? `Một lựa chọn rất đẹp cho người thích ${facts.styleText}.` : null,
        "Phù hợp để vừa sưu tầm, vừa đeo hàng ngày với nhiều outfit khác nhau.",
    ]).join(" ");

    const promoteShort = [opening, body].filter(Boolean).join("\n\n");
    const promoteLong = [opening, body, closing].filter(Boolean).join("\n\n");

    const hashtags = dedupeLines([
        facts.brand ? `#${facts.brand.replace(/\s+/g, "")}` : null,
        facts.lineName ? `#${facts.lineName.replace(/\s+/g, "")}` : null,
        facts.eraText ? `#${facts.eraText.replace(/\s+/g, "")}` : null,
        "#donghovintage",
        "#vintic",
    ]);

    const titleOptions = dedupeLines([
        [facts.brand, facts.lineName, facts.sizeText].filter(Boolean).join(" · "),
        [facts.eraText, facts.brand, facts.lineName].filter(Boolean).join(" "),
        [facts.brand, facts.lineName || facts.title, facts.movementText].filter(Boolean).join(" · "),
    ]).slice(0, 3);

    const facebookCaption = [
        promoteLong,
        specBullets.join("\n"),
        hashtags.join(" "),
    ].filter(Boolean).join("\n\n");

    const instagramCaption = [
        promoteShort,
        specBullets.slice(0, 4).join("\n"),
        hashtags.join(" "),
    ].filter(Boolean).join("\n\n");

    return {
        specBullets,
        promoteShort,
        promoteLong,
        facebookCaption,
        instagramCaption,
        titleOptions,
        hashtags,
        missingData: facts.missingData,
        safetyNotes: facts.safetyNotes,
        promptNote: [
            "rule-based generator",
            facts.brand ? `brand=${facts.brand}` : null,
            facts.movementText ? `movement=${facts.movementText}` : null,
            facts.sizeText ? `size=${facts.sizeText}` : null,
        ].filter(Boolean).join(" | "),
        rawFacts: facts,
    };
}

export async function generateAiProductContent(product: any) {
    const fallback = generateRuleBasedProductContent(product);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return fallback;

    const schema = {
        name: "generated_product_content",
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
        strict: true,
    };

    const developerInstruction = [
        "Bạn là copywriter chuyên về đồng hồ vintage cao cấp.",
        "Viết tiếng Việt tự nhiên, tinh tế, có chất người chơi đồng hồ nhưng không lên gân.",
        "Không được bịa dữ kiện. Chỉ dùng facts được cung cấp.",
        "Không dùng các claim như zin, NOS, nguyên bản, hiếm, đã serviced nếu facts không xác nhận.",
        "specBullets phải là bullet ngắn, giàu thông tin, theo format quen thuộc để chuẩn bị đăng social.",
        "promoteLong phải bán được hàng nhưng vẫn có chiều sâu, không sáo rỗng.",
    ].join(" ");

    const input = {
        fallback,
        facts: fallback.rawFacts,
        brandVoice: {
            tone: "tinh tế, vintage, thuyết phục nhưng không phô trương",
            avoid: ["siêu phẩm", "cực phẩm", "đỉnh của chóp", "cam kết quá đà"],
        },
    };

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini",
                messages: [
                    { role: "developer", content: developerInstruction },
                    { role: "user", content: JSON.stringify(input) },
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: schema,
                },
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "OpenAI generate failed");
        }

        const json = await res.json();
        const content = json?.choices?.[0]?.message?.content;
        const parsed = typeof content === "string" ? JSON.parse(content) : null;
        if (!parsed) return fallback;

        return {
            ...fallback,
            ...parsed,
            promptNote: `ai-enhanced | model=${process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini"}`,
        } as GeneratedProductContent;
    } catch {
        return fallback;
    }
}
