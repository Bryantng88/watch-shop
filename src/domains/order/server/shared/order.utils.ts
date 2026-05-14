export function toNumberPrice(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const anyValue = value as any;
  if (typeof anyValue?.toNumber === "function") return anyValue.toNumber();
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function norm(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function toPlain<T>(value: T): T {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map((item) => toPlain(item)) as T;
  if (value instanceof Date) return value.toISOString() as T;
  if (typeof value === "object") {
    if ((value as any)?.constructor?.name === "Decimal") return Number(value) as T;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = toPlain(v);
    }
    return out as T;
  }
  return value;
}

export function assertPositiveQuantity(productId: string, quantity: unknown) {
  const q = Number(quantity ?? 1);
  if (!Number.isFinite(q) || q <= 0) {
    throw new Error(`Số lượng không hợp lệ cho productId=${productId}`);
  }
  return Math.floor(q);
}

export function calcUnitPriceAgreed(input: {
  listPrice: number;
  unitPriceAgreed?: number | null;
}) {
  const manual = Number(input.unitPriceAgreed ?? 0);
  if (Number.isFinite(manual) && manual > 0) return manual;
  return Number(input.listPrice ?? 0);
}
