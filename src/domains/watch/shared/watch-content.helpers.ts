import type { WatchFormValues } from "@/domains/watch/client/form/watch-form.types";

type GenWarning = {
    field: string;
    message: string;
};

export type WatchContentGenerationResult = {
    titleOverride: string;
    hookText: string;
    bulletSpecs: string[];
    hashtags: string;
    postText: string;
    warnings: GenWarning[];
};

function clean(value?: string | null) {
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

function pushMissing(warnings: GenWarning[], field: string, message: string) {
    warnings.push({ field, message });
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

function caseShapeLabel(value?: string | null) {
    const map: Record<string, string> = {
        ROUND: "tròn",
        TANK: "tank",
        SQUARE: "vuông",
        RECTANGLE: "chữ nhật",
        TONNEAU: "tonneau",
        CUSHION: "cushion",
        OVAL: "oval",
        OCTAGON: "bát giác",
        SPECIAL: "đặc biệt",
        OTHER: "khác",
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

function getWatchAdjective(values: WatchFormValues) {
    const spec = values.spec;

    const braceletType = normalizeEnum(spec.braceletType);
    const materialProfile = normalizeEnum(spec.materialProfile);
    const strapText = clean(spec.strapMaterialText).toLowerCase();

    const isDemi =
        materialProfile === "BIMETAL" ||
        strapText.includes("demi") ||
        strapText.includes("two tone") ||
        strapText.includes("two-tone");

    if (isDemi) return "tinh tế";
    if (braceletType === "BRACELET") return "năng động";
    if (
        braceletType === "LEATHER" ||
        strapText.includes("leather") ||
        strapText.includes("da")
    ) {
        return "thanh lịch";
    }

    return "dễ đeo";
}

function buildHeroName(values: WatchFormValues) {
    const brand = clean(values.spec.specBrand);
    const model = clean(values.spec.model);
    const title = clean(values.basic.title);

    return [brand, model].filter(Boolean).join(" ") || title || "chiếc đồng hồ này";
}

export function buildPostTitle(values: WatchFormValues) {
    const year = clean(values.basic.yearText);
    const brand = clean(values.spec.specBrand);
    const model = clean(values.spec.model);
    const dial = clean(values.spec.dialColor);

    const parts = [
        year,
        brand,
        model,
        dial ? `With ${titleCase(dial)} Dial` : "",
    ].filter(Boolean);

    return parts.join(" ") || clean(values.basic.title) || "Vintage Watch";
}

export function buildHookText(values: WatchFormValues) {
    const priceLabel = getPriceHookLabel(values.pricing.salePrice);
    const channelPhrase = getSiteChannelHookPhrase(values.basic.siteChannel);
    const heroName = buildHeroName(values);
    const adjective = getWatchAdjective(values);

    const pricePart = priceLabel ? `Tiệm có giá chỉ ${priceLabel}` : "Tiệm có";
    const channelPart = channelPhrase ? ` ${channelPhrase}` : "";

    return `${pricePart}${channelPart} cho chiếc ${heroName} ${adjective} này. Anh em vui lòng inbox để lấy giá tốt nhất.`;
}

export function buildBulletSpecs(values: WatchFormValues) {
    const spec = values.spec;
    const basic = values.basic;

    const bulletSpecs: string[] = [];

    const movementText = movementLabel(basic.movementType);
    const calibre = clean(spec.calibre) || clean(basic.movementCalibre);
    const shapeText = caseShapeLabel(spec.caseShape);
    const materialText = materialLabel(spec.primaryCaseMaterial);
    const crystalText = crystalLabel(spec.crystal);

    if (movementText) {
        bulletSpecs.push(
            `Bộ máy ${movementText}${calibre ? `, calibre ${calibre}` : ""}.`
        );
    }

    if (clean(spec.caseSizeMM) || shapeText) {
        bulletSpecs.push(
            `Vỏ ${shapeText || "đồng hồ"}${clean(spec.caseSizeMM) ? `, kích thước ${spec.caseSizeMM}mm` : ""
            }.`
        );
    }

    if (materialText) bulletSpecs.push(`Chất liệu vỏ ${materialText}.`);
    if (crystalText) bulletSpecs.push(`Kính ${crystalText}.`);

    if (clean(spec.dialColor) || clean(spec.dialFinish)) {
        bulletSpecs.push(
            `Mặt số ${[spec.dialColor, spec.dialFinish].filter(Boolean).join(", ")}.`
        );
    }

    if (clean(spec.waterResistance)) {
        bulletSpecs.push(`Kháng nước ${spec.waterResistance}.`);
    }

    if (clean(spec.powerReserve)) {
        bulletSpecs.push(`Thời lượng cót khoảng ${spec.powerReserve}.`);
    }

    return bulletSpecs;
}

export function buildHashtags(values: WatchFormValues) {
    const tags = [
        hashtag(values.header.sku),
        hashtag(values.spec.specBrand),
        hashtag(values.spec.model),
        hashtag(values.spec.dialColor),
        hashtag(values.basic.movementType),
        hashtag(values.spec.caseShape),
        hashtag(values.spec.primaryCaseMaterial),
        "#vintagewatch",
        "#donghovintage",
        "#watchcollector",
    ].filter(Boolean);

    return Array.from(new Set(tags)).join(" ");
}

export function buildPostText(input: {
    title: string;
    body?: string | null;
    bulletSpecs?: string[];
    hookText?: string | null;
    hashtags?: string | null;
}) {
    const specText = input.bulletSpecs?.length
        ? input.bulletSpecs.map((x) => `• ${x}`).join("\n")
        : "";

    return [
        clean(input.title),
        clean(input.body),
        specText ? `Thông số nổi bật:\n${specText}` : "",
        clean(input.hookText),
        clean(input.hashtags),
    ]
        .filter(Boolean)
        .join("\n\n");
}

function buildWarnings(values: WatchFormValues) {
    const warnings: GenWarning[] = [];

    if (!clean(values.spec.specBrand) && !clean(values.basic.title)) {
        pushMissing(warnings, "brand", "Chưa có brand/title để tạo hook tự nhiên.");
    }

    if (!clean(values.spec.model)) pushMissing(warnings, "model", "Chưa có model.");
    if (!clean(values.basic.movementType)) pushMissing(warnings, "movementType", "Chưa có movement type.");
    if (!clean(values.spec.caseSizeMM)) pushMissing(warnings, "caseSizeMM", "Chưa có case size.");
    if (!clean(values.spec.dialColor)) pushMissing(warnings, "dialColor", "Chưa có màu mặt số.");
    if (!clean(values.spec.crystal)) pushMissing(warnings, "crystal", "Chưa có loại kính.");
    if (!clean(values.spec.primaryCaseMaterial)) pushMissing(warnings, "primaryCaseMaterial", "Chưa có chất liệu vỏ.");
    if (!getPriceHookLabel(values.pricing.salePrice)) pushMissing(warnings, "salePrice", "Chưa có giá bán để tạo câu hook đúng rule.");
    if (!getSiteChannelHookPhrase(values.basic.siteChannel)) pushMissing(warnings, "siteChannel", "Chưa xác định site channel AFFORDABLE/COLLECTIBLE.");

    return warnings;
}

export function generateWatchContent(
    values: WatchFormValues
): WatchContentGenerationResult {
    const titleOverride = buildPostTitle(values);
    const hookText = buildHookText(values);
    const bulletSpecs = buildBulletSpecs(values);
    const hashtags = buildHashtags(values);

    return {
        titleOverride,
        hookText,
        bulletSpecs,
        hashtags,
        postText: buildPostText({
            title: titleOverride,
            body: values.content.body,
            bulletSpecs,
            hookText,
            hashtags,
        }),
        warnings: buildWarnings(values),
    };
}