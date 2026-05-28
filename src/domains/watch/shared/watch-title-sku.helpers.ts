import type { WatchFormValues } from "../client/form/watch-form.types";

type BrandOption = {
  id: string;
  name: string;
  slug?: string | null;
};

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

function normalizeBrandText(value?: string | null) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function buildWatchTitleFromForm(
  values: WatchFormValues,
  brands: BrandOption[] = [],
) {
  const brandName =
    brands.find((item) => item.id === values.basic.brandId)?.name ||
    cleanText(values.spec.specBrand) ||
    "Unknown brand";

  const model = cleanText(values.spec.model) || "model unknown";
  const reference = cleanText(values.spec.referenceNumber);
  const movement =
    normalizeMovementLabel(values.basic.movementType) ||
    normalizeMovementLabel(values.spec.calibre) ||
    "movement unknown";
  const dialColor = cleanText(values.spec.dialColor);

  // Rule: Brand + Model + Reference + Movement + Dial
  return [brandName, model, reference, movement, dialColor]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildWatchSkuPrefix(brandName?: string | null) {
  const normalized = normalizeBrandText(brandName);
  if (!normalized) return "UNK";

  const words = normalized
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Z0-9]/g, ""))
    .filter(Boolean);

  if (!words.length) return "UNK";

  const known: Record<string, string> = {
    OMEGA: "OME",
    ROLEX: "RLX",
    LONGINES: "LNG",
    ORIS: "ORI",
    EXACTLY: "XCT",
    "RAYMOND WEIL": "RMW",
    SEIKO: "SEI",
    CITIZEN: "CTZ",
    CARTIER: "CAR",
    TISSOT: "TIS",
    BULOVA: "BLV",
  };

  const joined = words.join(" ");
  if (known[joined]) return known[joined];
  if (known[words[0]]) return known[words[0]];

  if (words.length >= 2) {
    return words
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .padEnd(3, "X");
  }

  const single = words[0];
  if (single.length <= 3) return single.padEnd(3, "X");

  const consonants = single.replace(/[AEIOUY]/g, "");
  if (consonants.length >= 3) return consonants.slice(0, 3);

  return single.slice(0, 3).padEnd(3, "X");
}

function formatSkuDate(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

export function shouldRegenerateWatchSku(currentSku?: string | null) {
  const sku = String(currentSku ?? "").trim();
  if (!sku) return true;
  if (/^[A-Z0-9]{3}-\d{8}-\d{3}$/i.test(sku)) return false;
  return true;
}

export function buildWatchSkuSuggestionFromForm(
  values: WatchFormValues,
  brands: BrandOption[] = [],
) {
  const brandName =
    brands.find((item) => item.id === values.basic.brandId)?.name ||
    cleanText(values.spec.specBrand) ||
    null;

  // Client-side suggestion only. Final uniqueness is enforced again in
  // submit-watch-form.application on the server.
  return `${buildWatchSkuPrefix(brandName)}-${formatSkuDate(new Date())}-001`;
}

export function buildWatchTitleSkuSuggestion(
  values: WatchFormValues,
  brands: BrandOption[] = [],
) {
  return {
    title: buildWatchTitleFromForm(values, brands),
    sku: buildWatchSkuSuggestionFromForm(values, brands),
  };
}
