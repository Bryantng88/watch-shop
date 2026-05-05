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

function strapSetLabel(
    type?: string | null,
    source?: string | null
) {
    const t = (type || "").toUpperCase();
    const s = (source || "").toUpperCase();

    if (t === "BRAND_ORIGINAL") {
        return "Dây khóa hãng.";
    }

    if (t === "COMPONENT") {
        if (s === "FROM_STOCK") {
            return "Dây khóa linh kiện, lấy dây thay từ kho.";
        }

        if (s === "KEEP_CURRENT") {
            return "Dây khóa linh kiện, giữ nguyên hiện trạng.";
        }

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

    return [brand, model || nickname || reference]
        .filter(Boolean)
        .join(" ") || title || "chiếc đồng hồ này";
}

function buildTitleDescriptor(values: WatchFormValues) {
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
    const baseTitle = clean(values.basic.title);

    const identity =
        [brand, model || nickname || reference].filter(Boolean).join(" ") ||
        baseTitle;

    const descriptor = buildTitleDescriptor(values);

    return [year, identity].filter(Boolean).join(" ").toUpperCase() +
        (descriptor ? ` – ${descriptor.toUpperCase()}` : "");
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

    const model = clean(spec.model);
    const movementText = movementLabel(basic.movementType);
    const calibre = clean(spec.calibre) || clean(basic.movementCalibre);
    const caseSize = clean(spec.caseSizeMM);
    const materialProfile = normalizeEnum(spec.materialProfile);
    const primaryMaterial = materialLabel(spec.primaryCaseMaterial);
    const secondaryMaterial = materialLabel(spec.secondaryCaseMaterial);
    const crystalText = crystalLabel(spec.crystal);
    const strapText = strapSetLabel(
        spec.strapSetType,
        spec.strapComponentSource
    );

    if (strapText) {
        bulletSpecs.push(strapText);
    }
    const styleText = styleLabel(basic.style);

    if (model) {
        bulletSpecs.push(`Model ${model}.`);
    }

    if (movementText || calibre) {
        bulletSpecs.push(
            `Bộ máy ${[movementText, calibre].filter(Boolean).join(", ")}.`
        );
    }

    if (caseSize) {
        bulletSpecs.push(`Kích thước ${caseSize}mm.`);
    }

    if (primaryMaterial) {
        const materialText =
            materialProfile === "BIMETAL" && secondaryMaterial
                ? `${primaryMaterial} / ${secondaryMaterial}`
                : primaryMaterial;

        bulletSpecs.push(`Chất liệu vỏ ${materialText}.`);
    }

    if (crystalText) {
        bulletSpecs.push(`Kính ${crystalText}.`);
    }

    if (strapText) {
        bulletSpecs.push(strapText);
    }

    if (styleText) {
        bulletSpecs.push(`Phong cách ${styleText}.`);
    }

    return bulletSpecs;
}

export function buildHashtags(values: WatchFormValues) {
    const tags = [
        hashtag(values.header.sku),
        hashtag(values.spec.specBrand),
        hashtag(values.spec.model),
        hashtag(values.spec.nickname),
        hashtag(values.basic.style),
        hashtag(values.basic.movementType),
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

    if (!clean(values.spec.crystal)) {
        pushMissing(warnings, "crystal", "Chưa có loại kính.");
    }

    if (!clean(values.spec.primaryCaseMaterial)) {
        pushMissing(warnings, "primaryCaseMaterial", "Chưa có chất liệu vỏ.");
    }

    if (!clean(values.spec.strapSetType)) {
        pushMissing(warnings, "strapSetType", "Chưa xác định dây khóa hãng hay linh kiện.");
    }

    if (!clean(values.basic.style)) {
        pushMissing(warnings, "style", "Chưa chọn phong cách watch.");
    }
    if (!clean(values.spec.strapSetType)) {
        pushMissing(
            warnings,
            "strapSetType",
            "Chưa chọn dây hãng hay linh kiện."
        );
    }

    if (
        values.spec.strapSetType === "COMPONENT_STRAP_COMPONENT_BUCKLE" &&
        !clean(values.spec.strapComponentSource)
    ) {
        pushMissing(
            warnings,
            "strapComponentSource",
            "Chưa chọn nguồn dây (giữ nguyên hay từ kho)."
        );
    }
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