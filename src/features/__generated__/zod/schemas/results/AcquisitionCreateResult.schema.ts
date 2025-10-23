import * as z from 'zod';
export const AcquisitionCreateResultSchema = z.object({
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
  customer: z.unknown().optional(),
  vendor: z.unknown().optional(),
  AcquisitionItem: z.array(z.unknown()),
  Invoice: z.array(z.unknown())
});