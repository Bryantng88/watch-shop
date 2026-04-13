import { MovementType } from "@prisma/client";

type ProductLike = any;

export type ProductContentFacts = {
    brand: string | null;
    title: string | null;
    model: string | null;
    ref: string | null;
    year: string | null;
    lineName: string | null;
    type: string | null;
    categoryName: string | null;
    caseType: string | null;
    caseMaterialText: string | null;
    goldText: string | null;
    caseSizeMm: number | null;
    sizeText: string | null;
    sizeNote: string | null;
    movementType: string | null;
    movementText: string | null;
    movementCharm: string | null;
    caliber: string | null;
    dialColorText: string | null;
    dialConditionText: string | null;
    strapText: string | null;
    glassText: string | null;
    accessoryText: string | null;
    servicedText: string | null;
    eraText: string | null;
    shapeText: string | null;
    styleText: string | null;
    socialHighlights: string[];
    specBulletsBase: string[];
    missingData: string[];
    safetyNotes: string[];
};

function toText(value: unknown) {
    if (value == null) return null;
    const text = String(value).trim();
    return text || null;
}

function toNum(value: unknown) {
    if (value == null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function enumLabel(value: string | null | undefined, map: Record<string, string>) {
    if (!value) return null;
    return map[String(value).toUpperCase()] ?? String(value);
}

function normalizeSize(product: ProductLike) {
    const raw = toText(product?.watchSpec?.caseSize);
    if (raw) {
        const n = Number(String(raw).replace(/[^\d.]/g, ""));
        return Number.isFinite(n) ? n : null;
    }

    const width = toNum(product?.watchSpec?.width);
    const length = toNum(product?.watchSpec?.length);
    return width ?? length ?? null;
}

function inferSizeNote(size: number | null) {
    if (size == null) return null;
    if (size <= 34) return "size cổ điển, đeo gọn tay";
    if (size <= 37) return "size cân đối, lên tay thanh lịch";
    return "size hiện đại hơn, đeo đầm tay";
}

function inferEraText(year: string | null) {
    if (!year) return null;
    const m = year.match(/(19|20)\d{2}/);
    if (!m) return year;
    const y = Number(m[0]);
    if (!Number.isFinite(y)) return year;
    if (y >= 1980 && y <= 1989) return "1980s";
    if (y >= 1970 && y <= 1979) return "1970s";
    if (y >= 1990 && y <= 1999) return "1990s";
    return String(y);
}

const CASE_TYPE_MAP: Record<string, string> = {
    ROUND: "dáng tròn cổ điển",
    TANK: "phom tank thanh lịch",
    RECTANGLE: "dáng chữ nhật thanh mảnh",
    SQUARE: "dáng vuông cá tính",
    CUSHION: "form cushion rất có chất riêng",
    TONNEAU: "dáng tonneau mềm mại",
    OVAL: "dáng oval mềm và lạ mắt",
};

const MATERIAL_MAP: Record<string, string> = {
    STAINLESS_STEEL: "thép không gỉ",
    GOLD: "vàng",
    GOLD_CAP: "bọc vàng",
    GOLD_PLATED: "mạ vàng",
    TWO_TONE: "2 tông màu",
    TITANIUM: "titanium",
    SILVER: "bạc",
};

const MOVEMENT_MAP: Record<string, string> = {
    AUTOMATIC: "Automatic",
    QUARTZ: "Máy pin",
    MANUAL_WIND: "Lên dây tay",
    HAND_WIND: "Lên dây tay",
    KINETIC: "Kinetic",
    ECO_DRIVE: "Eco-Drive",
};

const MOVEMENT_CHARM_MAP: Record<string, string> = {
    AUTOMATIC: "kim giây trôi mượt đặc trưng",
    QUARTZ: "độ ổn định cao, tiện đeo hàng ngày",
    MANUAL_WIND: "trải nghiệm lên dây rất thú vị",
    HAND_WIND: "trải nghiệm lên dây rất thú vị",
    KINETIC: "cảm giác sử dụng rất tiện và khác biệt",
    ECO_DRIVE: "gọn gàng, ổn định và thực dụng",
};

const STRAP_MAP: Record<string, string> = {
    LEATHER: "dây da",
    BRACELET: "dây kim loại",
    METAL: "dây kim loại",
    RUBBER: "dây cao su",
    NYLON: "dây nylon",
    FABRIC: "dây vải",
};

const GLASS_MAP: Record<string, string> = {
    MINERAL: "kính khoáng",
    ACRYLIC: "kính mica",
    HESALITE: "kính hesalite",
    SAPPHIRE: "kính sapphire",
};

export function buildProductContentFacts(product: ProductLike): ProductContentFacts {
    const brand = toText(product?.brand?.name);
    const model = toText(product?.watchSpec?.model);
    const title = toText(product?.title);
    const ref = toText(product?.watchSpec?.ref);
    const year = toText(product?.watchSpec?.year);
    const eraText = inferEraText(year);
    const size = normalizeSize(product);
    const movementKey = toText(product?.watchSpec?.movement)?.toUpperCase() ?? null;
    const movementText = enumLabel(movementKey, MOVEMENT_MAP);
    const movementCharm = enumLabel(movementKey, MOVEMENT_CHARM_MAP);
    const caseType = toText(product?.watchSpec?.caseType)?.toUpperCase() ?? null;
    const caseMaterialKey = toText(product?.watchSpec?.caseMaterial)?.toUpperCase() ?? null;
    const strapKey = toText(product?.watchSpec?.strap)?.toUpperCase() ?? null;
    const glassKey = toText(product?.watchSpec?.glass)?.toUpperCase() ?? null;
    const goldColor = toText(product?.watchSpec?.goldColor);
    const goldKarat = toText(product?.watchSpec?.goldKarat);
    const caseMaterialText = enumLabel(caseMaterialKey, MATERIAL_MAP);
    const lineName = model || title?.replace(brand ?? "", "").trim() || null;

    const accessoryBits: string[] = [];
    if (product?.watchSpec?.boxIncluded) accessoryBits.push("box");
    if (product?.watchSpec?.bookletIncluded) accessoryBits.push("booklet");
    if (product?.watchSpec?.cardIncluded) accessoryBits.push("card");

    const accessoryText = accessoryBits.length ? accessoryBits.join(" + ") : null;
    const servicedText = product?.watchSpec?.isServiced ? "đã có lịch sử service / kiểm tra kỹ thuật" : null;

    const missingData: string[] = [];
    if (!brand) missingData.push("brand");
    if (!movementText) missingData.push("movement");
    if (!size) missingData.push("case size");
    if (!model && !title) missingData.push("model / line");
    if (!toText(product?.watchSpec?.dialColor)) missingData.push("dial color");

    const safetyNotes: string[] = [];
    if (!product?.watchSpec?.isServiced) {
        safetyNotes.push("Không tự khẳng định đồng hồ đã được lau dầu / serviced nếu chưa xác nhận kỹ thuật.");
    }
    safetyNotes.push("Không dùng các claim như zin, NOS, nguyên bản, hiếm nếu chưa có cờ xác nhận trong dữ liệu.");

    const styleText = size != null && size <= 35 ? "dress watch cổ điển" : "dress watch vintage";
    const shapeText = enumLabel(caseType, CASE_TYPE_MAP);
    const goldText = caseMaterialKey === "GOLD"
        ? [goldKarat ? `${goldKarat}K` : null, goldColor ? `màu ${goldColor.toLowerCase()}` : null].filter(Boolean).join(" ") || "vàng"
        : null;

    const socialHighlights = [
        eraText ? `${eraText} ${brand ?? ""}`.trim() : brand,
        movementCharm,
        shapeText,
        size != null ? `${size}mm` : null,
        toText(product?.watchSpec?.dialColor) ? `dial ${String(product.watchSpec.dialColor).toLowerCase()}` : null,
    ].filter(Boolean) as string[];

    const specBulletsBase = [
        size != null ? `Case size: ${size} mm${inferSizeNote(size) ? ` – ${inferSizeNote(size)}` : ""}` : null,
        movementText ? `Máy (Movement): ${movementText}${brand ? ` chính hãng ${brand}` : ""}${movementCharm ? ` – ${movementCharm}` : ""}` : null,
        toText(product?.watchSpec?.dialColor)
            ? `Dial ${String(product.watchSpec.dialColor).toLowerCase()}${toText(product?.status) === "AVAILABLE" ? " condition rất đẹp" : ""}`
            : null,
        lineName ? `${lineName} ${shapeText ? `với ${shapeText}` : ""}`.trim() : shapeText,
        caseMaterialText ? `Chất liệu vỏ: ${goldText ? `${caseMaterialText} ${goldText}` : caseMaterialText}` : null,
        glassKey ? `Kính: ${enumLabel(glassKey, GLASS_MAP)}` : null,
        strapKey ? `Dây đi kèm: ${enumLabel(strapKey, STRAP_MAP)}` : null,
    ].filter(Boolean) as string[];

    return {
        brand,
        title,
        model,
        ref,
        year,
        lineName,
        type: toText(product?.type),
        categoryName: toText(product?.ProductCategory?.name),
        caseType,
        caseMaterialText,
        goldText,
        caseSizeMm: size,
        sizeText: size != null ? `${size}mm` : null,
        sizeNote: inferSizeNote(size),
        movementType: movementKey,
        movementText,
        movementCharm,
        caliber: toText(product?.watchSpec?.caliber),
        dialColorText: toText(product?.watchSpec?.dialColor),
        dialConditionText: toText(product?.watchSpec?.dialCondition) ?? null,
        strapText: enumLabel(strapKey, STRAP_MAP),
        glassText: enumLabel(glassKey, GLASS_MAP),
        accessoryText,
        servicedText,
        eraText,
        shapeText,
        styleText,
        socialHighlights,
        specBulletsBase,
        missingData,
        safetyNotes,
    };
}
