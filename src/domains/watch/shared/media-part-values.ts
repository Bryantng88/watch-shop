/** Pure persisted-value comparisons shared by media UI and write commands. */
const text = (value: unknown) => String(value ?? "").trim();
const set = (value: unknown) =>
  [
    ...new Set(Array.isArray(value) ? value.map(text).filter(Boolean) : []),
  ].sort();

/** PostgreSQL numeric rounding without binary floating-point differences. */
export function mediaDecimal(value: unknown, scale: number): string | null {
  const input = text(value).replace(/[^\d.-]/g, "");
  if (!input) return null;
  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(input)) return `invalid:${input}`;
  const negative = input.startsWith("-");
  const [whole = "0", fraction = ""] = input.replace(/^-/, "").split(".");
  let units = BigInt(
    (whole || "0") + fraction.slice(0, scale).padEnd(scale, "0"),
  );
  if (Number(fraction[scale] || "0") >= 5) units += BigInt(1);
  const digits = units.toString().padStart(scale + 1, "0");
  const result = scale
    ? `${digits.slice(0, -scale)}.${digits.slice(-scale)}`.replace(/\.?0+$/, "")
    : digits;
  return `${negative && units !== BigInt(0) ? "-" : ""}${result || "0"}`;
}

type Profile = {
  basic: Record<string, unknown>;
  spec: Record<string, unknown>;
  sku: unknown;
};
export function mediaProfileValues({ basic, spec, sku }: Profile) {
  const basicKeys = [
    "title",
    "brandId",
    "vendorId",
    "categoryId",
    "style",
    "conditionGrade",
    "movementType",
    "movementCalibre",
    "serialNumber",
    "yearText",
  ];
  const specKeys = [
    "model",
    "referenceNumber",
    "nickname",
    "caseShape",
    "crystal",
    "dialColor",
    "dialFinish",
    "calibre",
    "secondaryCaseMaterial",
    "braceletType",
    "strapSetType",
    "strapComponentSource",
    "strapMaterialText",
    "waterResistance",
    "powerReserve",
    "buckleType",
    "materialNote",
  ];
  const material = text(spec.primaryCaseMaterial) || "STAINLESS_STEEL";
  return {
    sku: text(sku),
    basic: {
      ...Object.fromEntries(basicKeys.map((key) => [key, text(basic[key])])),
      gender: text(basic.gender) || "MEN",
      siteChannel: text(basic.siteChannel) || "AFFORDABLE",
      isCollectible: Boolean(basic.isCollectible),
      postTargetIds: set(basic.postTargetIds),
    },
    spec: {
      ...Object.fromEntries(specKeys.map((key) => [key, text(spec[key])])),
      materialProfile: text(spec.materialProfile) || "SINGLE_MATERIAL",
      primaryCaseMaterial: material,
      goldTreatment:
        material === "GOLD" ? "SOLID_GOLD" : text(spec.goldTreatment),
      goldKarat: text(spec.goldKarat) ? String(Number(spec.goldKarat)) : "",
      goldWeightGrams:
        material === "GOLD" ? mediaDecimal(spec.goldWeightGrams, 3) : null,
      goldColors: set(spec.goldColors),
      complicationNames: set(spec.complicationNames),
      caseSizeMM: mediaDecimal(spec.caseSizeMM, 2),
      lugToLugMM: mediaDecimal(spec.lugToLugMM, 2),
      thicknessMM: mediaDecimal(spec.thicknessMM, 2),
    },
  };
}

export function mediaContentValues(content: Record<string, unknown>) {
  return {
    titleOverride: text(content.titleOverride),
    // Storefront URL is maintained from the Watch title, not a new content edit.
    hookText: text(content.hookText).replace(
      /https:\/\/vinticwatches\.vn\/products\/[^\s]+/g,
      "https://vinticwatches.vn/products/{watch}",
    ),
    body: text(content.body),
    bulletSpecs: Array.isArray(content.bulletSpecs)
      ? content.bulletSpecs.map(text).filter(Boolean)
      : [],
    hashTags: text(content.hashTags),
  };
}

export function mediaObjectKey(
  value:
    | { key?: string | null; fileKey?: string | null; url?: string | null }
    | null
    | undefined,
) {
  return text(value?.key || value?.fileKey || value?.url);
}

export function mediaPricingValues(pricing: Record<string, unknown>) {
  return {
    ...Object.fromEntries(
      ["salePrice", "minPrice", "costPrice", "serviceCost", "landedCost"].map(
        (key) => [key, mediaDecimal(pricing[key], 2)],
      ),
    ),
    pricingNote: text(pricing.pricingNote),
  };
}
