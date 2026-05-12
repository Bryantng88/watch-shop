import { buildDeterministicWatchTitle } from "./watch-title.helper";

function s(value: unknown) {
    const text = String(value ?? "").trim();
    return text || null;
}

function n(value: unknown) {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function mapMovement(value: unknown) {
    const text = s(value)?.toLowerCase();
    if (!text) return null;

    if (text.includes("quartz")) return "QUARTZ";
    if (text.includes("automatic") || text.includes("auto")) return "AUTOMATIC";
    if (text.includes("manual") || text.includes("hand wound") || text.includes("hand-wound")) {
        return "HAND_WOUND";
    }

    return null;
}

function mapGlass(value: unknown) {
    const text = s(value)?.toLowerCase();
    if (!text) return null;

    if (text.includes("sapphire")) return "SAPPHIRE";
    if (text.includes("mineral")) return "MINERAL";
    if (text.includes("plexi") || text.includes("acrylic")) return "ACRYLIC";

    return null;
}

export function mapWatchSpecFromAi(extractedSpec: any) {
    const visual = extractedSpec?.probableVisualFacts ?? {};

    return {
        ref: s(extractedSpec?.bestRefCandidate),
        model: s(extractedSpec?.modelFamily),
        caliber: s(extractedSpec?.bestCaliberCandidate),
        year: s(extractedSpec?.yearEstimate),

        movement: mapMovement(extractedSpec?.movement) ?? mapMovement(visual?.movement),
        caseType: s(extractedSpec?.caseType) ?? s(visual?.caseType),
        caseMaterial: s(extractedSpec?.caseMaterial) ?? s(visual?.caseMaterial),
        dialColor: s(extractedSpec?.dialColor) ?? s(visual?.dialColor),
        glass: mapGlass(extractedSpec?.glass) ?? mapGlass(visual?.glass),
        width: n(extractedSpec?.widthEstimateMm) ?? n(visual?.widthEstimateMm),
    };
}

export function buildProductTitleFromWatchAi(input: {
    brand?: string | null;
    extractedSpec?: any;
    fallback?: string | null;
}) {
    const extracted = input.extractedSpec ?? {};
    const visual = extracted?.probableVisualFacts ?? {};

    const movement =
        mapMovement(extracted?.movement) ??
        mapMovement(visual?.movement) ??
        null;

    const dialColor =
        s(extracted?.dialColor) ??
        s(visual?.dialColor) ??
        null;

    return buildDeterministicWatchTitle({
        brand: s(input.brand),
        model: s(extracted?.modelFamily),
        movement,
        dialColor,
    });
}