import * as z from 'zod';
export const AcquisitionSpecJobLogFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});