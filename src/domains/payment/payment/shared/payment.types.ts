import type { PaymentDirection, PaymentMethod, PaymentPurpose, PaymentStatus, PaymentType } from "@prisma/client";

export type PaymentOwnerType = "ORDER" | "ACQUISITION" | "SHIPMENT" | "SERVICE";

export type PaymentListItem = {
  id: string;
  refNo: string | null;
  ownerType: PaymentOwnerType;
  ownerId: string;
  type: PaymentType | string;
  direction: PaymentDirection | string;
  purpose: PaymentPurpose | string | null;
  method: PaymentMethod | string | null;
  status: PaymentStatus | string;
  amount: number;
  currency: string | null;
  paidAt?: string | Date | null;
  reference?: string | null;
  note?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
};

export type PaymentSummary = {
  totalDue: number;
  paidTotal: number;
  collectedTotal: number;
  unpaidTotal: number;
  remaining: number;
  depositRequired: number;
  depositPaid: number;
};

export type CreatePaymentInput = {
  ownerType: PaymentOwnerType;
  ownerId: string;
  amount?: number | null;
  method?: PaymentMethod | string | null;
  purpose?: PaymentPurpose | string | null;
  note?: string | null;
  markPaidNow?: boolean | null;
};

export type CompletePaymentInput = {
  paymentId: string;
  paidAt?: Date | string | null;
  reference?: string | null;
  note?: string | null;
};
