import { Prisma } from "@prisma/client";

export type AcqViewKey = "all" | "draft" | "posted" | "canceled";

const firstValue = (v: unknown) => (Array.isArray(v) ? v[0] : v);

export function asString(v: unknown) {
  const raw = firstValue(v);
  if (raw == null || raw === "") return undefined;
  return String(raw);
}

export function asNumber(v: unknown, fallback: number) {
  const raw = firstValue(v);
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function normalizeSort(v: unknown) {
  const raw = String(firstValue(v) ?? "updatedDesc");
  if (
    raw === "updatedDesc" ||
    raw === "updatedAsc" ||
    raw === "createdDesc" ||
    raw === "createdAsc" ||
    raw === "acquiredDesc" ||
    raw === "acquiredAsc"
  ) {
    return raw;
  }
  return "updatedDesc";
}

export function normalizeView(v: unknown): AcqViewKey {
  const raw = String(firstValue(v) ?? "all").toLowerCase();
  if (raw === "draft" || raw === "posted" || raw === "canceled") return raw;
  return "all";
}

export function normalizeType(v: unknown) {
  const raw = String(firstValue(v) ?? "").toUpperCase();
  if (
    raw === "PURCHASE" ||
    raw === "CONSIGNMENT" ||
    raw === "TRADE_IN" ||
    raw === "BUY_BACK"
  ) {
    return raw;
  }
  return undefined;
}

export function normalizeStatus(v: unknown) {
  const raw = String(firstValue(v) ?? "").toUpperCase();
  if (raw === "DRAFT" || raw === "POSTED" || raw === "CANCELED") return raw;
  return undefined;
}

export function statusFromView(view: AcqViewKey) {
  switch (view) {
    case "draft":
      return "DRAFT";
    case "posted":
      return "POSTED";
    case "canceled":
      return "CANCELED";
    default:
      return undefined;
  }
}

export function computeActiveAcquisitionTotal(
  items: Array<{ quantity?: number | null; unitCost?: any; status?: string | null }>
) {
  return items
    .filter((row) => String(row.status ?? "").toUpperCase() !== "CANCELLED")
    .reduce(
      (sum, row) => sum + (Number(row.quantity ?? 0) || 0) * (Number(row.unitCost ?? 0) || 0),
      0
    );
}

export function toDecimal(value: unknown): Prisma.Decimal | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? new Prisma.Decimal(n) : null;
}

export function toInt(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

export function toStringOrNull(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s ? s : null;
}

export function toNonEmptyString(value: unknown, fallback: string) {
  const s = toStringOrNull(value);
  return s ?? fallback;
}

export function safeJsonParse<T = any>(value?: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function capitalizeWord(value: string | null | undefined) {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}