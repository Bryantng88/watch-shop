import {
  CaseMaterial,
  CaseType,
  Gender,
  Glass,
  GoldColor,
  MovementType,
  Strap,
} from "@prisma/client";
import { capitalizeWord, toStringOrNull } from "./helper";

export function toDraftItem(raw: any) {
  return {
    ...raw,
    productTitle: String(raw?.productTitle ?? raw?.title ?? "").trim() || "Untitled watch",
    quantity: Number(raw?.quantity ?? 1),
    unitCost: Number(raw?.unitCost ?? 0),
    productType: raw?.productType ?? "WATCH",
  };
}

export function movementLabel(value: unknown) {
  const v = String(value ?? "").trim().toUpperCase();
  if (!v) return null;
  if (v === "AUTOMATIC") return "Automatic";
  if (v === "QUARTZ") return "Quartz";
  if (v === "MANUAL" || v === "HAND_WOUND") return "Manual";
  return capitalizeWord(v.replace(/_/g, " "));
}

export function buildProductNickname(input: {
  aiExtracted: any;
  aiMeta: any;
  item: { productTitle?: string | null };
}) {
  const hint = toStringOrNull(input.aiMeta?.aiHint) ?? toStringOrNull(input.item.productTitle);
  if (!hint) return null;

  const match = hint.match(/["“](.+?)["”]/) || hint.match(/\(([^)]+)\)/);
  if (match?.[1]) return toStringOrNull(match[1]);

  const normalized = hint.toLowerCase();
  const soft = ["tank", "diver", "power reserve", "power-reserve", "chrono", "moonphase"];
  const found = soft.find((x) => normalized.includes(x));
  return found ? capitalizeWord(found.replace(/-/g, " ")) : null;
}

export function buildProductTitleFromAi(input: {
  aiExtracted: any;
  aiMeta: any;
  item: { productTitle?: string | null };
}) {
  const extracted = input.aiExtracted ?? {};
  const probable = extracted?.probableVisualFacts ?? {};

  const brand =
    toStringOrNull(extracted?.confirmedFacts?.brandName) ??
    toStringOrNull(extracted?.brandName) ??
    toStringOrNull(extracted?.suggestedFacts?.probableBrand) ??
    toStringOrNull(probable?.probableBrand);

  const model =
    toStringOrNull(extracted?.modelFamily) ??
    toStringOrNull(extracted?.bestRefCandidate);

  const nickname = buildProductNickname(input);
  const movement = movementLabel(extracted?.movement ?? probable?.movement);
  const dialColorRaw =
    toStringOrNull(extracted?.dialColor) ?? toStringOrNull(probable?.dialColor);
  const dialColor = dialColorRaw ? `${capitalizeWord(dialColorRaw)} Dial` : null;

  const title = [brand, model, nickname ? `"${nickname}"` : null, movement, dialColor]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: title || toStringOrNull(input.item.productTitle) || "Watch draft",
    nickname,
    resolvedBrandName: brand,
  };
}

export function resolveSpecStatusFromAi(aiExtracted: any): string {
  const confirmedBrand =
    toStringOrNull(aiExtracted?.confirmedFacts?.brandName) ??
    toStringOrNull(aiExtracted?.brandName);

  const probableBrand =
    toStringOrNull(aiExtracted?.suggestedFacts?.probableBrand) ??
    toStringOrNull(aiExtracted?.probableVisualFacts?.probableBrand);

  if (!aiExtracted) return "FAILED";
  if (!confirmedBrand && probableBrand) return "REVIEW";
  return "READY";
}

export function mapMovementType(value: unknown): MovementType | null {
  const v = String(value ?? "").trim().toUpperCase();
  if (!v) return null;
  if (v === "MANUAL") return MovementType.HAND_WOUND;
  if (v in MovementType) return MovementType[v as keyof typeof MovementType];
  return null;
}

export function mapCaseType(value: unknown): CaseType | null {
  const v = String(value ?? "").trim().toUpperCase();
  if (!v) return null;
  if (v === "RECTANGULAR") return CaseType.TANK;
  if (v in CaseType) return CaseType[v as keyof typeof CaseType];
  return CaseType.OTHER;
}

export function mapGender(value: unknown): Gender | null {
  const v = String(value ?? "").trim().toUpperCase();
  if (!v) return null;
  if (v in Gender) return Gender[v as keyof typeof Gender];
  return null;
}

export function mapCaseMaterial(value: unknown): CaseMaterial | null {
  const v = String(value ?? "").trim().toUpperCase();
  if (!v) return null;
  if (v === "PLATED") return CaseMaterial.OTHER;
  if (v in CaseMaterial) return CaseMaterial[v as keyof typeof CaseMaterial];
  return null;
}

export function mapGoldColor(value: unknown): GoldColor | null {
  const v = String(value ?? "").trim().toUpperCase();
  if (!v) return null;
  if (v === "YELLOW_GOLD") return GoldColor.YELLOW;
  if (v === "WHITE_GOLD") return GoldColor.WHITE;
  if (v === "ROSE_GOLD") return GoldColor.ROSE;
  if (v in GoldColor) return GoldColor[v as keyof typeof GoldColor];
  return null;
}

export function mapStrap(value: unknown): Strap | null {
  const v = String(value ?? "").trim().toUpperCase();
  if (!v) return null;
  if (v === "FABRIC") return (Strap as any).CANVAS ?? (Strap as any).CANVASS ?? null;
  if (v in Strap) return Strap[v as keyof typeof Strap];
  return null;
}

export function mapGlass(value: unknown): Glass | null {
  const v = String(value ?? "").trim().toUpperCase();
  if (!v) return null;
  if (v in Glass) return Glass[v as keyof typeof Glass];
  return null;
}