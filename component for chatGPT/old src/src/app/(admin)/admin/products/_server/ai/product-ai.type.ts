export type ConfidenceLevel = "high" | "medium" | "low";

export type ExtractedSpec = {
    brandName: string | null;
    ref: string | null;
    model: string | null;
    year: string | null;
    caseType: "ROUND" | "SQUARE" | "RECTANGULAR" | "TONNEAU" | "CUSHION" | null;
    gender: "MEN" | "WOMEN" | "UNISEX" | null;
    movement: "QUARTZ" | "AUTOMATIC" | "MANUAL" | null;
    caliber: string | null;
    caseMaterial: "STAINLESS_STEEL" | "GOLD" | "PLATED" | "TWO_TONE" | null;
    goldKarat: string | null;
    goldColor: "YELLOW_GOLD" | "ROSE_GOLD" | "WHITE_GOLD" | null;
    width: number | null;
    length: number | null;
    thickness: number | null;
    strap: "LEATHER" | "BRACELET" | "RUBBER" | "FABRIC" | null;
    glass: "MINERAL" | "SAPPHIRE" | "ACRYLIC" | null;
    dialColor: string | null;
    dialCondition: string | null;
    boxIncluded: boolean | null;
    bookletIncluded: boolean | null;
    cardIncluded: boolean | null;
    confidence: {
        brandName: ConfidenceLevel;
        ref: ConfidenceLevel;
        model: ConfidenceLevel;
        year: ConfidenceLevel;
        caseType: ConfidenceLevel;
        gender: ConfidenceLevel;
        movement: ConfidenceLevel;
        caliber: ConfidenceLevel;
        caseMaterial: ConfidenceLevel;
        goldKarat: ConfidenceLevel;
        goldColor: ConfidenceLevel;
        width: ConfidenceLevel;
        length: ConfidenceLevel;
        thickness: ConfidenceLevel;
        strap: ConfidenceLevel;
        glass: ConfidenceLevel;
        dialColor: ConfidenceLevel;
        dialCondition: ConfidenceLevel;
        boxIncluded: ConfidenceLevel;
        bookletIncluded: ConfidenceLevel;
        cardIncluded: ConfidenceLevel;
    };
    confidenceNotes: string[];
};

export type GeneratedPayload = {
    specBullets: string[];
    promoteShort: string;
    promoteLong: string;
    facebookCaption: string;
    instagramCaption: string;
    titleOptions: string[];
    hashtags: string[];
    missingData: string[];
    safetyNotes: string[];
};

export type TonePreset =
    | "balanced"
    | "refined"
    | "collector"
    | "sales"
    | "listing";