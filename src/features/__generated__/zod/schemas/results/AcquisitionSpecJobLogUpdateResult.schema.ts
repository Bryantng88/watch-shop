import * as z from 'zod';
export const AcquisitionSpecJobLogUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  acquisitionSpecJobId: z.string(),
  acquisitionItemId: z.string(),
  acquisitionId: z.string().optional(),
  productId: z.string().optional(),
  stage: z.string(),
  level: z.string(),
  message: z.string(),
  payload: z.unknown().optional(),
  createdAt: z.date(),
  acquisitionSpecJob: z.unknown()
}));