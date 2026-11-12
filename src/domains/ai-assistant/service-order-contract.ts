import { z } from "zod";
const term = z.string().trim().min(2).max(100);
export const serviceOrderSearchSchema = z
  .object({
    customerName: term.optional(),
    brand: term.optional(),
    service: term.optional(),
    reference: term.optional(),
    watchCountHint: z.number().int().min(1).max(30).optional(),
  })
  .strict()
  .refine(
    (p) => !!(p.customerName || p.brand || p.service || p.reference),
    "Cần ít nhất một thông tin tra cứu.",
  );
export type ServiceOrderSearch = z.infer<typeof serviceOrderSearchSchema>;
export const orderServiceProposalSchema = z
  .object({
    sourceMessageId: z.string().uuid(),
    orderId: z.string().min(1).max(100),
    expectedVersion: z.string().regex(/^[a-f0-9]{64}$/),
    additions: z
      .array(
        z
          .object({
            parentOrderItemId: z.string().min(1).max(100),
            serviceCatalogId: z.string().min(1).max(100),
            unitPriceAgreed: z.number().int().positive().max(9999999999),
          })
          .strict(),
      )
      .min(1)
      .max(12),
  })
  .strict()
  .refine(
    (p) =>
      new Set(
        p.additions.map((a) => `${a.parentOrderItemId}:${a.serviceCatalogId}`),
      ).size === p.additions.length,
    "Dịch vụ bị trùng trên cùng chiếc đồng hồ.",
  );
export type OrderServiceProposal = z.infer<typeof orderServiceProposalSchema>;
export type OrderServicesDraft = {
  revision: number;
  sourceMessageId: string;
  plan: OrderServiceProposal;
  orderReference: string;
  customerName: string | null;
  beforeSubtotal: string;
  afterSubtotal: string;
  increase: string;
  requiredPermissions: string[];
  requiredTaskIds: string[];
  rows: {
    parentOrderItemId: string;
    watchLabel: string;
    serviceCatalogId: string;
    serviceName: string;
    catalogVersion: string;
    price: number;
  }[];
};
export type UpdatedServiceOrder = {
  revision: number;
  id: string;
  reference: string;
  addedCount: number;
};
