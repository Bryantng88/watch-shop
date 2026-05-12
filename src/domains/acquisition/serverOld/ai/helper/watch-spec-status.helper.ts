export type ComputedWatchSpecStatus = "PENDING" | "PARTIAL" | "READY";

export function computeWatchSpecStatus(input: {
    brand?: string | null;
    model?: string | null;
    referenceNumber?: string | null;
    movementType?: string | null;
    calibre?: string | null;
    dialColor?: string | null;
    caseSizeMM?: unknown;
}): ComputedWatchSpecStatus {
    const score = [
        input.brand,
        input.model || input.referenceNumber,
        input.movementType || input.calibre,
        input.dialColor,
        input.caseSizeMM,
    ].filter(Boolean).length;

    if (score >= 4) return "READY";
    if (score >= 1) return "PARTIAL";
    return "PENDING";
}