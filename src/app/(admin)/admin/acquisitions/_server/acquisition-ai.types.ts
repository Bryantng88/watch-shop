export type ConfidenceLevel = "high" | "medium" | "low";

export type AcquisitionExtractedSpec = {
    brandName: string | null;
    modelFamily: string | null;

    refCandidates: Array<{
        value: string;
        confidence: ConfidenceLevel;
        reason: string;
    }>;
    bestRefCandidate: string | null;

    yearEstimate: string | null;
    yearRange: { from: number | null; to: number | null };
    yearConfidence: ConfidenceLevel;

    caseType: "ROUND" | "SQUARE" | "RECTANGULAR" | "TONNEAU" | "CUSHION" | null;
    gender: "MEN" | "WOMEN" | "UNISEX" | null;
    movement: "QUARTZ" | "AUTOMATIC" | "MANUAL" | null;

    caliberCandidates: Array<{
        value: string;
        confidence: ConfidenceLevel;
        reason: string;
    }>;
    bestCaliberCandidate: string | null;

    caseMaterial: "STAINLESS_STEEL" | "GOLD" | "PLATED" | "TWO_TONE" | null;
    goldKarat: string | null;
    goldColor: "YELLOW_GOLD" | "ROSE_GOLD" | "WHITE_GOLD" | null;

    widthEstimateMm: number | null;
    lengthEstimateMm: number | null;
    thicknessEstimateMm: number | null;

    strapType: "LEATHER" | "BRACELET" | "RUBBER" | "FABRIC" | null;
    glass: "MINERAL" | "SAPPHIRE" | "ACRYLIC" | null;
    dialColor: string | null;
    dialCondition: string | null;

    likelyAccessories: {
        boxIncluded: boolean | null;
        bookletIncluded: boolean | null;
        cardIncluded: boolean | null;
    };

    confirmedFacts: Record<string, string | number | boolean | null>;
    suggestedFacts: Record<string, string | number | boolean | null>;
    confidence: Record<string, ConfidenceLevel>;
    needsMoreImages: string[];
    confidenceNotes: string[];
};

export type AcquisitionGeneratedDraft = {
    generatedTitle: string;
    titleOptions: string[];
    specBullets: string[];
    listingCopy: string;
    socialBalanced: string;
    storytellingCopy: string;
    hashtags: string[];
    missingData: string[];
    safetyNotes: string[];
};

export type AcquisitionDraftResponse = {
    extractedSpec: AcquisitionExtractedSpec;
    generatedDraft: AcquisitionGeneratedDraft;
    meta: {
        mode: "openai" | "rule";
        model: string | null;
        message: string | null;
    };
};

export type GenerateAcquisitionDraftInput = {
    origin: string;
    imageUrls: string[];
    vendorName?: string | null;
    cost?: number | null;
    titleHint?: string | null;
    hintText?: string | null;
};