/** Same ordering for intake drafts and the full storefront watch editor. Unknown facts stay absent. */
export function normalizeWatchTitleTerminology(value?: string | null) {
  return String(value ?? "")
    .replace(/lên dây tay/giu, "Manual Winding")
    .replace(/hand[- ]wound/giu, "Manual Winding")
    .replace(/manual winding/giu, "Manual Winding")
    .replace(/automatic/giu, "Automatic")
    .replace(/\s+/g, " ").trim();
}
export function movementTitleLabel(value?: string | null) {
  const text = String(value ?? "").trim();
  const labels: Record<string, string> = { AUTOMATIC: "Automatic", HAND_WOUND: "Manual Winding", QUARTZ: "Quartz", SOLAR: "Solar", KINETIC: "Kinetic", MECHAQUARTZ: "Mechaquartz", SPRING_DRIVE: "Spring Drive", HYBRID: "Hybrid" };
  return labels[text.toUpperCase()] || text;
}
export function formatWatchTitle(input: {
  yearText?: string | null; brandName?: string | null; model?: string | null;
  referenceNumber?: string | null; nickname?: string | null; movementType?: string | null;
}) {
  return normalizeWatchTitleTerminology([input.yearText, input.brandName, input.model, input.referenceNumber, input.nickname, movementTitleLabel(input.movementType)]
    .map(part => String(part ?? "").trim()).filter(Boolean).join(" "));
}
