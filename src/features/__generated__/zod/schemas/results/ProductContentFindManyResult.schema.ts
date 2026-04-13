import * as z from 'zod';
export const ProductContentFindManyResultSchema = z.object({
  data: z.array(z.object({
  productId: z.string(),
  titleSnapshot: z.string().optional(),
  brandSnapshot: z.string().optional(),
  refSnapshot: z.string().optional(),
  sizeSnapshot: z.string().optional(),
  movementSnapshot: z.string().optional(),
  glassSnapshot: z.string().optional(),
  strapClaspSnapshot: z.string().optional(),
  modelSnapshot: z.string().optional(),
  yearSnapshot: z.string().optional(),
  generatedContent: z.string().optional(),
  promptNote: z.string().optional(),
  generatedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  specBullets: z.array(z.string()),
  hashtags: z.array(z.string()),
  Product: z.unknown()
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