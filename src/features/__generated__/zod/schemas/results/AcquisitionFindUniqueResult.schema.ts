import * as z from 'zod';
export const AcquisitionFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  vendorId: z.string().optional(),
  customerId: z.string().optional(),
  type: z.unknown(),
  acquiredAt: z.date(),
  cost: z.number().optional(),
  currency: z.string().optional(),
  payoutStatus: z.string().optional(),
  accquisitionStt: z.unknown(),
  refNo: z.string().optional(),
  notes: z.string().optional(),
  condition: z.string().optional(),
  warrantyUntil: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sentAt: z.date().optional(),
  returnedAt: z.date().optional(),
  customer: z.unknown().optional(),
  vendor: z.unknown().optional(),
  acquisitionItem: z.array(z.unknown()),
  invoice: z.array(z.unknown())
}));