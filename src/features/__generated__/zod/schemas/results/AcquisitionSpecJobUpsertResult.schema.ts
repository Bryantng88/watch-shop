import * as z from 'zod';
export const AcquisitionSpecJobUpsertResultSchema = z.object({
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
  runAfter: z.date().optional(),
  priority: z.number().int(),
  acquisitionItem: z.unknown(),
  product: z.unknown(),
  logs: z.array(z.unknown())
});