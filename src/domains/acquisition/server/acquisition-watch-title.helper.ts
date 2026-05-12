function cleanText(value?: string | null) {
    const text = String(value ?? "").trim();
    return text || null;
}

function normalizeMovementLabel(value?: string | null) {
    const text = cleanText(value)?.toUpperCase();
    switch (text) {
        case "AUTOMATIC":
            return "Automatic";
        case "HAND_WOUND":
            return "Hand-wound";
        case "QUARTZ":
            return "Quartz";
        case "SOLAR":
            return "Solar";
        case "KINETIC":
            return "Kinetic";
        case "MECHAQUARTZ":
            return "Mechaquartz";
        case "SPRING_DRIVE":
            return "Spring Drive";
        case "HYBRID":
            return "Hybrid";
        default:
            return cleanText(value);
    }
}

function normalizeDialColorLabel(value?: string | null) {
    const text = cleanText(value);
    if (!text) return null;
    return text;
}

export function buildDeterministicWatchTitle(input: {
    brand?: string | null;
    model?: string | null;
    movement?: string | null;
    dialColor?: string | null;
}) {
    const brand = cleanText(input.brand) ?? "Unknown brand";
    const model = cleanText(input.model) ?? "model unknown";
    const movement = normalizeMovementLabel(input.movement) ?? "movement unknown";
    const dialColor = normalizeDialColorLabel(input.dialColor);

    return [brand, model, movement, dialColor].filter(Boolean).join(" ");
}