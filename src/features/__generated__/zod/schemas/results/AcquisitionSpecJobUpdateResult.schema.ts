import * as z from 'zod';
export const AcquisitionSpecJobUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  acquisitionItemId: z.string(),
  productId: z.string(),
  status: z.string(),
  attempts: z.number().int(),
  lastError: z.string().optional(),
  startedAt: z.date().optional(),
  finishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  AcquisitionItem: z.unknown(),
  Product: z.unknown()
}));