import type { DB } from "@/server/db/client";

const BRAND_ALIASES: Record<string, string> = {
    jlc: "Jaeger-LeCoultre",
    ap: "Audemars Piguet",
    pp: "Patek Philippe",
    vc: "Vacheron Constantin",
    gs: "Grand Seiko",
};

function normalize(value: unknown) {
    return String(value ?? "").trim().toLowerCase();
}

function collectCandidates(input: {
    titleHint?: string | null;
    aiHint?: string | null;
    extractedSpec?: any;
}) {
    const ex = input.extractedSpec ?? {};

    return [
        ex?.confirmedFacts?.brandName,
        ex?.brandName,
        ex?.suggestedFacts?.probableBrand,
        ex?.probableVisualFacts?.probableBrand,
        input.titleHint,
        input.aiHint,
    ].filter(Boolean);
}

export async function resolveBrandFromAcquisitionAi(
    tx: DB,
    input: {
        titleHint?: string | null;
        aiHint?: string | null;
        extractedSpec?: any;
    }
) {
    const candidates = collectCandidates(input);

    for (const raw of candidates) {
        const key = normalize(raw);
        const canonical = BRAND_ALIASES[key] ?? raw;

        const brand = await tx.brand.findFirst({
            where: {
                name: {
                    equals: canonical,
                    mode: "insensitive",
                } as any,
            },
        });

        if (brand) return brand;
    }

    return null;
}