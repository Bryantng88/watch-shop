export function buildProductTitleFromSpec(input: {
    brand?: string | null;
    model?: string | null;
    nickname?: string | null;
    movement?: string | null;
    dialColor?: string | null;
}) {
    const parts: string[] = [];

    if (input.brand) parts.push(input.brand);

    if (input.model) parts.push(input.model);

    if (input.nickname) {
        parts.push(`"${input.nickname}"`);
    }

    if (input.movement) {
        parts.push(formatMovement(input.movement));
    }

    if (input.dialColor) {
        parts.push(`${capitalize(input.dialColor)} Dial`);
    }

    return parts.join(" ").trim() || "Untitled Product";
}

function formatMovement(m?: string | null) {
    if (!m) return null;
    if (m === "AUTOMATIC") return "Automatic";
    if (m === "QUARTZ") return "Quartz";
    if (m === "MANUAL") return "Manual";
    return m;
}

function capitalize(str?: string | null) {
    if (!str) return null;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}