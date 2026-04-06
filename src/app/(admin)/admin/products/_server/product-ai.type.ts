export type AiTonePreset =
    | 'balanced'
    | 'elegant'
    | 'collector'
    | 'sales'
    | 'listing';

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

export type ProductAiMeta = {
    mode: 'openai' | 'rule';
    model: string | null;
    message: string | null;
};

export type ProductAiDraft = {
    id?: string;
    title?: string;
    description?: string | null;
    brandId?: string | null;
    brandName?: string | null;
    categoryId?: string | null;
    categoryName?: string | null;
    images?: Array<{ url?: string | null; fileKey?: string | null }>;
    image?: Array<{ url?: string | null; fileKey?: string | null }>;
    aiPromptHint?: string | null;
    aiToneSample?: string | null;
    aiTonePreset?: AiTonePreset | null;
    aiFocusPoints?: string[];
    watchSpec?: {
        ref?: string | null;
        model?: string | null;
        year?: string | number | null;
        caseType?: string | null;
        gender?: string | null;
        movement?: string | null;
        caliber?: string | null;
        caseMaterial?: string | null;
        goldKarat?: string | number | null;
        goldColor?: string | null;
        width?: string | number | null;
        length?: string | number | null;
        thickness?: string | number | null;
        strap?: string | null;
        glass?: string | null;
        dialColor?: string | null;
        dialCondition?: string | null;
        boxIncluded?: boolean;
        bookletIncluded?: boolean;
        cardIncluded?: boolean;
    };
};

export type SpecExtractedPayload = {
    brandName: string | null;
    ref: string | null;
    model: string | null;
    year: string | null;
    caseType: string | null;
    gender: string | null;
    movement: string | null;
    caliber: string | null;
    caseMaterial: string | null;
    goldKarat: number | null;
    goldColor: string | null;
    width: number | null;
    length: number | null;
    thickness: number | null;
    strap: string | null;
    glass: string | null;
    dialColor: string | null;
    dialCondition: string | null;
    boxIncluded: boolean | null;
    bookletIncluded: boolean | null;
    cardIncluded: boolean | null;
    confidenceNotes: string[];
    warnings: string[];
    rawVisualNotes: string;
};
