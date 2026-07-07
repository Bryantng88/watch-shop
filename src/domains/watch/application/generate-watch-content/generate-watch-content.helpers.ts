import { WATCH_POST_FOOTER } from "@/domains/shared/content/WatchPost";
import type { WatchFormValues } from "@/domains/watch/client/form/watch-form.types";

export type WatchContentGenerationWarning = {
    field: string;
    message: string;
};

function clean(value?: string | number | null) {
    return String(value ?? "").trim();
}

function normalizeEnum(value?: string | null) {
    return clean(value).toUpperCase();
}

function titleCase(value?: string | null) {
    return clean(value)
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function hashtag(value?: string | null) {
    const raw = clean(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "");

    return raw ? `#${raw}` : "";
}

function pushMissing(
    warnings: WatchContentGenerationWarning[],
    field: string,
    message: string
) {
    warnings.push({ field, message });
}

export function buildCaseSizeText(input: {
    caseShape?: string | null;
    caseSizeMM?: string | number | null;
    lugToLugMM?: string | number | null;
}) {
    const shape = normalizeEnum(input.caseShape);
    const caseSize = clean(input.caseSizeMM);
    const lugToLug = clean(input.lugToLugMM);

    if (!caseSize) return "";

    if (shape === "ROUND") {
        return `${caseSize}mm`;
    }

    if (lugToLug) {
        return `${caseSize}x${lugToLug}mm`;
    }

    return "";
}

export function getPriceHookLabel(value?: string | null) {
    const raw = clean(value).replace(/[^\d]/g, "");
    const price = Number(raw);

    if (!Number.isFinite(price) || price <= 0) return "";
    if (price < 5_000_000) return "X triệu nhỏ xíu";
    if (price >= 5_000_000 && price <= 8_000_000) return "X triệu trung bình";

    return "1X triệu";
}

export function getSiteChannelHookPhrase(value?: string | null) {
    const siteChannel = normalizeEnum(value);

    if (siteChannel === "AFFORDABLE") return "rất dễ tiếp cận";
    if (siteChannel === "COLLECTIBLE") return "có giá trị sưu tầm cao";

    return "";
}

function movementLabel(value?: string | null) {
    const map: Record<string, string> = {
        AUTOMATIC: "automatic",
        HAND_WOUND: "lên dây tay",
        QUARTZ: "quartz",
        SOLAR: "solar",
        KINETIC: "kinetic",
        MECHAQUARTZ: "mecha-quartz",
        SPRING_DRIVE: "Spring Drive",
        HYBRID: "hybrid",
    };

    return map[normalizeEnum(value)] || "";
}

function materialLabel(value?: string | null) {
    const map: Record<string, string> = {
        STAINLESS_STEEL: "thép không gỉ",
        TITANIUM: "titanium",
        CERAMIC: "ceramic",
        CARBON: "carbon",
        GOLD: "vàng",
        PLATINUM: "platinum",
        SILVER: "bạc",
        BRASS: "đồng",
        OTHER: "chất liệu khác",
    };

    return map[normalizeEnum(value)] || "";
}

function crystalLabel(value?: string | null) {
    const map: Record<string, string> = {
        SAPPHIRE: "sapphire",
        ACRYLIC: "mica/acrylic",
        MINERAL: "mineral",
        HARDLEX: "Hardlex",
        AR_COATED: "sapphire phủ AR",
    };

    return map[normalizeEnum(value)] || "";
}

function styleLabel(value?: string | null) {
    const map: Record<string, string> = {
        MILITARY: "military",
        DRESS: "dress",
        SPORT: "sport",
        TOOL: "tool watch",
        CASUAL: "casual",
        CLASSIC: "classic",
        MINIMALIST: "minimalist",
        LUXURY: "luxury",
        RETRO: "retro",
        FUTURISTIC: "futuristic",
    };

    return map[normalizeEnum(value)] || "";
}

export function strapSetLabel(type?: string | null, source?: string | null) {
    const t = normalizeEnum(type);
    const s = normalizeEnum(source);

    if (t === "BRAND_ORIGINAL") return "Dây khóa hãng.";

    if (t === "COMPONENT") {
        if (s === "FROM_STOCK") return "Dây khóa linh kiện, lấy dây thay từ kho.";
        if (s === "KEEP_CURRENT") return "Dây khóa linh kiện, giữ nguyên hiện trạng.";
        return "Dây khóa linh kiện.";
    }

    return "";
}

function getWatchAdjective(values: WatchFormValues) {
    const style = normalizeEnum(values.basic.style);

    if (style === "DRESS") return "thanh lịch";
    if (style === "CLASSIC") return "cổ điển";
    if (style === "MINIMALIST") return "tối giản";
    if (style === "SPORT") return "năng động";
    if (style === "LUXURY") return "sang trọng";
    if (style === "RETRO") return "retro";

    return "dễ đeo";
}

function buildHeroName(values: WatchFormValues) {
    const brand = clean(values.spec.specBrand);
    const model = clean(values.spec.model);
    const nickname = clean(values.spec.nickname);
    const reference = clean(values.spec.referenceNumber);
    const title = clean(values.basic.title);

    return (
        [brand, model || nickname || reference].filter(Boolean).join(" ") ||
        title ||
        "chiếc đồng hồ này"
    );
}

export function buildTitleDescriptor(values: WatchFormValues) {
    const style = normalizeEnum(values.basic.style);
    const movement = normalizeEnum(values.basic.movementType);
    const dial = clean(values.spec.dialColor);

    const hasComplication =
        clean(values.spec.model).toLowerCase().includes("date") ||
        clean(values.spec.nickname).toLowerCase().includes("date") ||
        clean(values.basic.title).toLowerCase().includes("date");

    if (hasComplication) return "Complex But Perfectly Balanced";
    if (style === "DRESS") return "Elegant Dress Watch With Vintage Soul";
    if (style === "CLASSIC") return "Classic, Clean And Timeless";
    if (style === "MINIMALIST") return "Minimal, Refined And Easy To Wear";
    if (style === "SPORT") return "Sporty, Sharp And Ready For Daily Wear";
    if (style === "MILITARY") return "Utilitarian Spirit With Vintage Charm";
    if (movement === "AUTOMATIC") return "Clean Daily With Automatic Heart";
    if (dial) return `${titleCase(dial)} Dial With Vintage Character`;

    return "Vintage Character For Daily Wear";
}

export function buildPostTitle(values: WatchFormValues) {
    const year = clean(values.basic.yearText);
    const brand = clean(values.spec.specBrand);
    const model = clean(values.spec.model);
    const nickname = clean(values.spec.nickname);
    const reference = clean(values.spec.referenceNumber);
    const movement = movementLabel(values.basic.movementType);
    const baseTitle = clean(values.basic.title);

    return [year, brand, model, reference, nickname, movement]
        .filter(Boolean)
        .join(" ") || baseTitle;
}

    /*
    const identity =
        [brand, model || nickname || reference].filter(Boolean).join(" ") ||
        baseTitle;

    const descriptor = buildTitleDescriptor(values);

    return (
        [year, identity].filter(Boolean).join(" ").toUpperCase() +
        (descriptor ? ` – ${descriptor.toUpperCase()}` : "")
    );
}

*/

export function buildHookText(values: WatchFormValues) {
    const priceLabel = getPriceHookLabel(values.pricing.salePrice);
    const channelPhrase = getSiteChannelHookPhrase(values.basic.siteChannel);
    const heroName = buildHeroName(values);
    const adjective = getWatchAdjective(values);

    const pricePart = priceLabel ? `Tiệm có giá chỉ ${priceLabel}` : "Tiệm có";
    const channelPart = channelPhrase ? ` ${channelPhrase}` : "";

    return `${pricePart}${channelPart} cho chiếc ${heroName} ${adjective} này. Anh em vui lòng inbox để lấy giá tốt nhất.`;
}

export function buildWatchBulletSpecs(values: WatchFormValues) {
    const spec = values.spec;
    const basic = values.basic;
    const bulletSpecs: string[] = [];

    const model = clean(spec.model);
    const reference = clean(spec.referenceNumber);

    const movementText = movementLabel(basic.movementType);
    const calibre = clean(spec.calibre) || clean(basic.movementCalibre);

    const materialProfile = normalizeEnum(spec.materialProfile);
    const primaryMaterial = materialLabel(spec.primaryCaseMaterial);
    const secondaryMaterial = materialLabel(spec.secondaryCaseMaterial);
    const crystalText = crystalLabel(spec.crystal);

    const styleText = styleLabel(basic.style);

    if (model || reference) {
        const identity = [model, reference ? `Ref. ${reference}` : ""]
            .filter(Boolean)
            .join(" – ");

        bulletSpecs.push(`Model ${identity}.`);
    }

    if (movementText || calibre) {
        bulletSpecs.push(
            `Bộ máy ${[movementText, calibre].filter(Boolean).join(", ")}.`
        );
    }

    const caseSizeText = buildCaseSizeText({
        caseShape: spec.caseShape,
        caseSizeMM: spec.caseSizeMM,
        lugToLugMM: spec.lugToLugMM,
    });

    if (caseSizeText) {
        bulletSpecs.push(`Kích thước ${caseSizeText}.`);
    }

    if (primaryMaterial) {
        const materialText =
            materialProfile === "BIMETAL" && secondaryMaterial
                ? `${primaryMaterial} / ${secondaryMaterial}`
                : primaryMaterial;

        bulletSpecs.push(`Chất liệu vỏ ${materialText}.`);
    }

    if (crystalText) bulletSpecs.push(`Kính ${crystalText}.`);
    if (styleText) bulletSpecs.push(`Phong cách ${styleText}.`);

    return Array.from(new Set(bulletSpecs));
}

export function buildHashTags(values: WatchFormValues) {
    const tags = [
        hashtag(values.header.sku),
        "#vintagewatch",
        hashtag(values.basic.style),
        hashtag(values.spec.specBrand || values.basic.title.split(" ")[0]),
    ].filter(Boolean);

    return Array.from(new Set(tags)).join(" ");
}

function buildBodyText(body?: string | null) {
    return clean(body)
        .split(/\n{2,}|\n/g)
        .map((x) => clean(x))
        .filter(Boolean)
        .map((x) => `• ${x}`)
        .join("\n");
}

export function buildPostText(input: {
    title: string;
    body?: string | null;
    bulletSpecs?: string[];
    hookText?: string | null;
    hashTags?: string | null;
}) {
    const titleText = clean(input.title);
    const bodyText = buildBodyText(input.body);

    const specText = input.bulletSpecs?.length
        ? input.bulletSpecs.filter(Boolean).map((x) => `• ${x}`).join("\n")
        : "";

    return [
        titleText,
        bodyText,
        specText ? `Thông số nổi bật:\n${specText}` : "",
        clean(input.hookText),
        clean(input.hashTags),
        WATCH_POST_FOOTER,
    ]
        .filter(Boolean)
        .join("\n\n");
}

export function buildWatchContentWarnings(values: WatchFormValues) {
    const warnings: WatchContentGenerationWarning[] = [];

    if (!clean(values.spec.specBrand) && !clean(values.basic.title)) {
        pushMissing(warnings, "brand", "Chưa có brand/title để tạo title.");
    }

    if (!clean(values.spec.model)) {
        pushMissing(warnings, "model", "Chưa có model, bullet model sẽ được bỏ qua.");
    }

    if (!clean(values.basic.movementType)) {
        pushMissing(warnings, "movementType", "Chưa có movement type.");
    }

    if (!clean(values.spec.caseSizeMM)) {
        pushMissing(warnings, "caseSizeMM", "Chưa có case size.");
    }

    if (
        normalizeEnum(values.spec.caseShape) !== "ROUND" &&
        clean(values.spec.caseSizeMM) &&
        !clean(values.spec.lugToLugMM)
    ) {
        pushMissing(
            warnings,
            "lugToLugMM",
            "Case không phải ROUND cần thêm lug-to-lug để tạo kích thước dạng WxH."
        );
    }

    if (!clean(values.spec.crystal)) {
        pushMissing(warnings, "crystal", "Chưa có loại kính.");
    }

    if (!clean(values.spec.primaryCaseMaterial)) {
        pushMissing(warnings, "primaryCaseMaterial", "Chưa có chất liệu vỏ.");
    }

    if (false && !clean(values.spec.strapSetType)) {
        pushMissing(warnings, "strapSetType", "Chưa chọn dây hãng hay linh kiện.");
    }

    if (
        false &&
        normalizeEnum(values.spec.strapSetType) === "COMPONENT" &&
        !clean(values.spec.strapComponentSource)
    ) {
        pushMissing(
            warnings,
            "strapComponentSource",
            "Chưa chọn nguồn dây (giữ nguyên hay từ kho)."
        );
    }

    if (!clean(values.basic.style)) {
        pushMissing(warnings, "style", "Chưa chọn phong cách watch.");
    }

    return warnings;
}
