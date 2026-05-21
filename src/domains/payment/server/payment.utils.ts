import { Prisma } from "@prisma/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";

export type Tx = Prisma.TransactionClient;

export function toNumber(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function money(value: number) {
  return new Prisma.Decimal(Math.max(0, Math.round(value)));
}

export function toPlain<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, item) => {
      if (item instanceof Date) return item.toISOString();
      if (typeof item === "object" && item?._isDecimal) return Number(item);
      return item;
    }),
  );
}

export async function buildPaymentRef(tx: Tx) {
  return genRefNo(tx, {
    model: tx.payment,
    prefix: "PM",
    field: "refNo",
    padding: 6,
  });
}

export function assertPaymentStatusCollectedExists() {
  // PaymentStatus.COLLECTED is added by the migration in this patch.
  return "COLLECTED" as any;
}
