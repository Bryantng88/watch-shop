export type QuickWatchSpec = {
    sourceText?: string;
    normalizedText: string;
    brand?: string | null;
    brandLabel?: string | null;
    movement?: string | null;
    movementLabel?: string | null;
    caseShape?: string | null;
    caseShapeLabel?: string | null;
    dialColor?: string | null;
    dialColorLabel?: string | null;
    strapType?: string | null;
    strapTypeLabel?: string | null;
    boxIncluded?: boolean | null;
    bookletIncluded?: boolean | null;
    cardIncluded?: boolean | null;
    fullSetStatus?: string | null;
    fullSetStatusLabel?: string | null;
    caseMaterial?: string | null;
    caseMaterialLabel?: string | null;
    styleCategory?: string | null;
    styleCategoryLabel?: string | null;
    hourMarkerStyle?: string | null;
    hourMarkerStyleLabel?: string | null;
};
type Rule = {
    code: string;
    label: string;
    aliases: string[];
};

const BRAND_RULES: Rule[] = [
    { code: "GRAND_SEIKO", label: "Grand Seiko", aliases: ["grand seiko"] },
    { code: "KING_SEIKO", label: "King Seiko", aliases: ["king seiko"] },
    { code: "SEIKO", label: "Seiko", aliases: ["seiko"] },
    { code: "TISSOT", label: "Tissot", aliases: ["tissot"] },
    { code: "CITIZEN", label: "Citizen", aliases: ["citizen"] },
    { code: "OMEGA", label: "Omega", aliases: ["omega"] },
    { code: "LONGINES", label: "Longines", aliases: ["longines"] },
    { code: "ORIENT", label: "Orient", aliases: ["orient"] },
    { code: "CARTIER", label: "Cartier", aliases: ["cartier"] },
    { code: "RADO", label: "Rado", aliases: ["rado"] },
    { code: "MIDO", label: "Mido", aliases: ["mido"] },
    { code: "HAMILTON", label: "Hamilton", aliases: ["hamilton"] },
    { code: "BULOVA", label: "Bulova", aliases: ["bulova"] },
    { code: "WALTHAM", label: "Waltham", aliases: ["waltham"] },
    { code: "ROTARY", label: "Rotary", aliases: ["rotary"] },
    { code: "DUNHILL", label: "Dunhill", aliases: ["dunhill"] },
    { code: "RAYMOND_WEIL", label: "Raymond Weil", aliases: ["raymond weil", "raymond"] },
    { code: "WYLER", label: "Wyler", aliases: ["wyler"] },
];

const MOVEMENT_RULES: Rule[] = [
    { code: "ECO_DRIVE", label: "Eco-Drive", aliases: ["eco drive", "ecodrive"] },
    { code: "AUTOMATIC", label: "Tự động", aliases: ["tu dong", "automatic", "auto"] },
    { code: "QUARTZ", label: "Pin", aliases: ["quartz", "pin"] },
    { code: "MANUAL", label: "Cót tay", aliases: ["cot tay", "co tay", "len day", "handwind", "manual"] },
    { code: "SOLAR", label: "Solar", aliases: ["solar", "nang luong anh sang"] },
    { code: "KINETIC", label: "Kinetic", aliases: ["kinetic"] },
];

const SHAPE_RULES: Rule[] = [
    { code: "TANK", label: "Tank", aliases: ["tank", "chu nhat", "rect", "rectangular"] },
    { code: "TONNEAU", label: "Tonneau", aliases: ["tonneau", "thung"] },
    { code: "SQUARE", label: "Vuông", aliases: ["vuong", "square"] },
    { code: "ROUND", label: "Tròn", aliases: ["tron", "round"] },
];

const DIAL_COLOR_RULES: Rule[] = [
    { code: "BLACK", label: "Mặt đen", aliases: ["mat den", "dial den", "den"] },
    { code: "WHITE", label: "Mặt trắng", aliases: ["mat trang", "dial trang", "trang"] },
    { code: "SILVER", label: "Mặt bạc", aliases: ["mat bac", "silver", "bac"] },
    { code: "CHAMPAGNE", label: "Champagne", aliases: ["champagne", "vang nhat"] },
    { code: "SALMON", label: "Salmon", aliases: ["salmon"] },
    { code: "BLUE", label: "Mặt xanh", aliases: ["mat xanh", "xanh duong", "blue", "xanh"] },
    { code: "GREEN", label: "Mặt xanh lá", aliases: ["mat xanh la", "xanh la", "green"] },
    { code: "BROWN", label: "Mặt nâu", aliases: ["mat nau", "nau", "brown"] },
    { code: "GOLD", label: "Mặt vàng", aliases: ["mat vang", "gold", "vang"] },
];

const STRAP_RULES: Rule[] = [
    { code: "NONE", label: "Không dây", aliases: ["khong day", "mat day", "head only", "tran"] },
    { code: "STEEL", label: "Dây thép", aliases: ["day thep", "bracelet"] },
    { code: "LEATHER", label: "Dây da", aliases: ["day da", "leather"] },
    { code: "RUBBER", label: "Dây cao su", aliases: ["day cao su", "cao su", "rubber"] },
    { code: "NATO", label: "Dây NATO", aliases: ["day nato", "nato"] },
    { code: "CANVAS", label: "Dây canvas", aliases: ["day canvas", "canvas"] },
];

const CASE_MATERIAL_RULES: Rule[] = [
    { code: "TWO_TONE", label: "Two-tone", aliases: ["two tone", "2 tone", "demi", "thep vang", "vo thep vang"] },
    { code: "TITANIUM", label: "Titanium", aliases: ["titanium", "titani", "vo titanium", "case titanium"] },
    { code: "GOLD", label: "Vàng", aliases: ["vang 18k", "vang 14k", "solid gold", "vo vang", "case gold"] },
    { code: "SILVER", label: "Bạc", aliases: ["silver case", "vo bac", "case silver", "bac khoi"] },
    { code: "STAINLESS_STEEL", label: "Thép", aliases: ["stainless steel", "vo thep", "case steel", "vo inox"] },
];

const STYLE_CATEGORY_RULES: Rule[] = [
    {
        code: "TOOL",
        label: "Tool",
        aliases: ["tool", "diver", "lan", "field", "pilot", "chronograph", "chrono", "tachymeter", "gmt", "bezel", "military"],
    },
    {
        code: "DRESS",
        label: "Dress",
        aliases: ["dress", "tank", "roman", "formal", "elegant", "mong"],
    },
];

const HOUR_MARKER_RULES: Rule[] = [
    {
        code: "ROMAN",
        label: "Cọc số La Mã",
        aliases: [
            "la ma",
            "so la ma",
            "roman",
            "roman numeral",
            "coc la ma",
        ],
    },
    {
        code: "NO_MARKERS",
        label: "Không cọc",
        aliases: [
            "khong coc",
            "mat tron",
            "dial tron",
            "mat khong coc",
            "no markers",
            "markerless",
        ],
    },
    {
        code: "BATON",
        label: "Cọc thẳng",
        aliases: [
            "coc thang",
            "coc vach",
            "index",
            "baton",
            "stick marker",
            "stick dial",
        ],
    },
];
function parseHourMarkerStyle(text: string) {
    const matched = matchRule(text, HOUR_MARKER_RULES);
    return matched
        ? {
            hourMarkerStyle: matched.code,
            hourMarkerStyleLabel: matched.label,
        }
        : {
            hourMarkerStyle: null,
            hourMarkerStyleLabel: null,
        };
}
function normalizeText(value: string) {
    return ` ${value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()} `;
}

function hasAnyAlias(text: string, aliases: string[]) {
    const normalized = normalizeText(text);
    return aliases.some((alias) => normalized.includes(normalizeText(alias)));
}

function matchRule(text: string, rules: Rule[]) {
    const normalized = normalizeText(text);
    for (const rule of rules) {
        for (const alias of rule.aliases) {
            if (normalized.includes(normalizeText(alias))) {
                return rule;
            }
        }
    }
    return null;
}

function parseFullSetSignals(text: string) {
    const hasFullSet = hasAnyAlias(text, [
        "fullset",
        "full set",
        "du hop so the",
        "du box paper card",
        "du hop so",
        "fullbox papers card",
    ]);

    const headOnly = hasAnyAlias(text, [
        "head only",
        "tran",
        "dong ho tran",
        "mat day",
        "khong day",
    ]);

    const boxIncluded =
        hasFullSet
            ? true
            : hasAnyAlias(text, ["co hop", "kem hop", "fullbox", "full box", "box"])
                ? true
                : hasAnyAlias(text, ["khong hop", "mat hop", "no box"])
                    ? false
                    : null;

    const bookletIncluded =
        hasFullSet
            ? true
            : hasAnyAlias(text, ["co so", "so sach", "booklet", "papers", "paper", "manual"])
                ? true
                : hasAnyAlias(text, ["khong so", "mat so", "no papers", "no paper", "missing papers"])
                    ? false
                    : null;

    const cardIncluded =
        hasFullSet
            ? true
            : hasAnyAlias(text, ["co the", "the bao hanh", "warranty card", "card"])
                ? true
                : hasAnyAlias(text, ["khong the", "mat the", "no card", "missing card"])
                    ? false
                    : null;

    let fullSetStatus: string | null = null;
    let fullSetStatusLabel: string | null = null;

    if (headOnly) {
        fullSetStatus = "HEAD_ONLY";
        fullSetStatusLabel = "Trần đầu";
    } else if (boxIncluded === true && bookletIncluded === true && cardIncluded === true) {
        fullSetStatus = "FULLSET";
        fullSetStatusLabel = "Fullset";
    } else if (boxIncluded === true || bookletIncluded === true || cardIncluded === true) {
        fullSetStatus = "PARTIAL";
        fullSetStatusLabel = "Kèm phụ kiện";
    }

    return {
        boxIncluded,
        bookletIncluded,
        cardIncluded,
        fullSetStatus,
        fullSetStatusLabel,
    };
}

function parseCaseMaterial(text: string) {
    const matched = matchRule(text, CASE_MATERIAL_RULES);
    return matched
        ? {
            caseMaterial: matched.code,
            caseMaterialLabel: matched.label,
        }
        : {
            caseMaterial: null,
            caseMaterialLabel: null,
        };
}

function parseStyleCategory(text: string) {
    const matched = matchRule(text, STYLE_CATEGORY_RULES);
    return matched
        ? {
            styleCategory: matched.code,
            styleCategoryLabel: matched.label,
        }
        : {
            styleCategory: null,
            styleCategoryLabel: null,
        };
}

export function parseQuickWatchSpec(input?: string | null): QuickWatchSpec | null {
    const sourceText = String(input ?? "").trim();
    if (!sourceText) return null;

    const brand = matchRule(sourceText, BRAND_RULES);
    const movement = matchRule(sourceText, MOVEMENT_RULES);
    const caseShape = matchRule(sourceText, SHAPE_RULES);
    const dialColor = matchRule(sourceText, DIAL_COLOR_RULES);
    const strapType = matchRule(sourceText, STRAP_RULES);
    const fullSet = parseFullSetSignals(sourceText);
    const caseMaterial = parseCaseMaterial(sourceText);
    const styleCategory = parseStyleCategory(sourceText);
    const hourMarkerStyle = parseHourMarkerStyle(sourceText);
    const spec: QuickWatchSpec = {
        sourceText,
        normalizedText: normalizeText(sourceText).trim(),
        brand: brand?.code ?? null,
        brandLabel: brand?.label ?? null,
        movement: movement?.code ?? null,
        movementLabel: movement?.label ?? null,
        caseShape: caseShape?.code ?? null,
        caseShapeLabel: caseShape?.label ?? null,
        dialColor: dialColor?.code ?? null,
        dialColorLabel: dialColor?.label ?? null,
        strapType: strapType?.code ?? null,
        strapTypeLabel: strapType?.label ?? null,
        boxIncluded: fullSet.boxIncluded,
        bookletIncluded: fullSet.bookletIncluded,
        cardIncluded: fullSet.cardIncluded,
        fullSetStatus: fullSet.fullSetStatus,
        fullSetStatusLabel: fullSet.fullSetStatusLabel,
        caseMaterial: caseMaterial.caseMaterial,
        caseMaterialLabel: caseMaterial.caseMaterialLabel,
        styleCategory: styleCategory.styleCategory,
        styleCategoryLabel: styleCategory.styleCategoryLabel,
        hourMarkerStyle: hourMarkerStyle.hourMarkerStyle,
        hourMarkerStyleLabel: hourMarkerStyle.hourMarkerStyleLabel,
    };

    if (!hasQuickWatchSignals(spec)) return null;
    return spec;
}

export function hasQuickWatchSignals(spec?: QuickWatchSpec | null) {
    if (!spec) return false;
    return Boolean(
        spec.brand ||
        spec.movement ||
        spec.caseShape ||
        spec.dialColor ||
        spec.strapType ||
        spec.fullSetStatus ||
        spec.boxIncluded != null ||
        spec.bookletIncluded != null ||
        spec.cardIncluded != null ||
        spec.caseMaterial ||
        spec.styleCategory ||
        spec.hourMarkerStyle
    );
}

export function getQuickWatchSpecChips(spec?: QuickWatchSpec | null) {
    if (!spec) return [] as string[];

    const accessoryChip =
        spec.fullSetStatus === "FULLSET"
            ? "Fullset"
            : spec.fullSetStatus === "HEAD_ONLY"
                ? "Trần đầu"
                : spec.fullSetStatus === "PARTIAL"
                    ? [
                        spec.boxIncluded ? "Hộp" : null,
                        spec.bookletIncluded ? "Sổ" : null,
                        spec.cardIncluded ? "Thẻ" : null,
                    ].filter(Boolean).join(" • ")
                    : null;

    return [
        spec.brandLabel,
        spec.movementLabel,
        spec.caseShapeLabel,
        spec.dialColorLabel,
        spec.strapTypeLabel,
        spec.caseMaterialLabel,
        spec.hourMarkerStyleLabel,
        spec.styleCategoryLabel,
        accessoryChip,
    ].filter(Boolean) as string[];
}
export function applyQuickWatchSpecToFlags<T extends { hasStrap?: boolean; isServiced?: boolean; hasClasp?: boolean; needsService?: boolean }>(
    spec: QuickWatchSpec | null | undefined,
    current?: T | null
) {
    const hasStrap =
        spec?.strapType === "NONE"
            ? false
            : spec?.strapType
                ? true
                : current?.hasStrap ?? true;

    return {
        hasStrap,
        isServiced: current?.isServiced ?? false,
        hasClasp: current?.hasClasp ?? false,
        needsService: current?.needsService ?? true,
    };
}
export function mapQuickSpecToWatchSpecInput(spec?: QuickWatchSpec | null) {
    if (!spec) return {};

    const movementMap: Record<string, string> = {
        AUTOMATIC: "AUTOMATIC",
        QUARTZ: "QUARTZ",
        MANUAL: "MANUAL",
        SOLAR: "SOLAR",
        KINETIC: "KINETIC",
        ECO_DRIVE: "SOLAR",
    };

    const caseTypeMap: Record<string, string> = {
        ROUND: "ROUND",
        SQUARE: "SQUARE",
        TANK: "TANK",
        TONNEAU: "TONNEAU",
    };

    const strapMap: Record<string, string> = {
        STEEL: "BRACELET",
        LEATHER: "LEATHER",
        RUBBER: "RUBBER",
        NATO: "NATO",
        CANVAS: "CANVASS",
        NONE: undefined as any,
    };

    const allowedCaseMaterials = new Set([
        "STAINLESS_STEEL",
        "GOLD",
        "TWO_TONE",
        "TITANIUM",
        "SILVER",
        "OTHER",
    ]);

    return {
        movement: spec.movement ? (movementMap[spec.movement] ?? undefined) : undefined,
        caseType: spec.caseShape ? (caseTypeMap[spec.caseShape] ?? undefined) : undefined,
        dialColor: spec.dialColorLabel ?? undefined,
        strap: spec.strapType ? (strapMap[spec.strapType] ?? undefined) : undefined,
        boxIncluded: spec.boxIncluded ?? undefined,
        bookletIncluded: spec.bookletIncluded ?? undefined,
        cardIncluded: spec.cardIncluded ?? undefined,
        caseMaterial: spec.caseMaterial && allowedCaseMaterials.has(spec.caseMaterial) ? spec.caseMaterial : undefined,
    };
}
