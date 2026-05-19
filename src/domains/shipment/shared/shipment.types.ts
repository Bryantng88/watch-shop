import type { PaymentMethod, ShipmentStatus } from "@prisma/client";

export type ShipmentListInput = {
  page?: number;
  pageSize?: number;
  q?: string | null;
  status?: ShipmentStatus | "ALL" | string | null;
};

export type CreateShipmentFromOrderInput = {
  id: string;
  orderRefNo?: string | null;
  customerName?: string | null;
  shipPhone?: string | null;
  shipAddress?: string | null;
  shipCity?: string | null;
  shipDistrict?: string | null;
  shipWard?: string | null;
};

export type UpdateShipmentInput = {
  shipPhone?: string | null;
  shipAddress?: string | null;
  shipCity?: string | null;
  shipDistrict?: string | null;
  shipWard?: string | null;
  carrier?: string | null;
  trackingCode?: string | null;
  notes?: string | null;
};

export type CreateShipmentFeeInput = {
  shipmentId: string;
  amount: number;
  method?: PaymentMethod | string | null;
  carrier?: string | null;
  trackingCode?: string | null;
  reference?: string | null;
  note?: string | null;
  paidAt?: Date | string | null;
};

export type CompleteShipmentInput = {
  shipmentId: string;
  note?: string | null;
};

export type CreateManualShipmentInput = {
  orderId: string;
  shipPhone?: string | null;
  shipAddress?: string | null;
  shipCity?: string | null;
  shipDistrict?: string | null;
  shipWard?: string | null;
  carrier?: string | null;
  trackingCode?: string | null;
  notes?: string | null;
};
