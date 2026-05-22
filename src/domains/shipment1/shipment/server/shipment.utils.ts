import { PaymentMethod, ShipmentStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { genRefNo } from "@/domains/shared/utils/AutoGenRef";

export type Tx = Prisma.TransactionClient;

export function norm(value: unknown) {
  return String(value ?? "").trim();
}

export function nullableText(value: unknown) {
  const text = norm(value);
  return text ? text : null;
}

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

export function normalizePaymentMethod(value: unknown, fallback: PaymentMethod = PaymentMethod.BANK_TRANSFER): PaymentMethod {
  const raw = norm(value).toUpperCase();
  if (raw === "CASH") return PaymentMethod.CASH;
  if (raw === "COD") return PaymentMethod.COD;
  if (raw === "MOMO") return PaymentMethod.MOMO;
  if (raw === "PAYPAL") return PaymentMethod.PAYPAL;
  if (raw === "CREDIT_CARD") return PaymentMethod.CREDIT_CARD;
  if (raw === "BANK_TRANSFER") return PaymentMethod.BANK_TRANSFER;
  return fallback;
}

export function normalizeShipmentStatus(value: unknown): ShipmentStatus | null {
  const raw = norm(value).toUpperCase();
  if (!raw || raw === "ALL") return null;
  if (raw === "DRAFT") return ShipmentStatus.DRAFT;
  if (raw === "READY") return ShipmentStatus.READY;
  if (raw === "SHIPPED") return ShipmentStatus.SHIPPED;
  if (raw === "DELIVERED") return ShipmentStatus.DELIVERED;
  if (raw === "RETURNING") return "RETURNING" as ShipmentStatus;
  if (raw === "CANCELLED") return ShipmentStatus.CANCELLED;
  if (raw === "RETURNED") return "RETURNED" as ShipmentStatus;
  return null;
}

export async function buildShipmentRef(tx: Tx) {
  return genRefNo(tx, {
    model: (tx as any).shipment,
    prefix: "SP",
    field: "refNo",
    padding: 6,
  });
}

export async function buildPaymentRef(tx: Tx) {
  return genRefNo(tx, {
    model: tx.payment,
    prefix: "PM",
    field: "refNo",
    padding: 6,
  });
}
