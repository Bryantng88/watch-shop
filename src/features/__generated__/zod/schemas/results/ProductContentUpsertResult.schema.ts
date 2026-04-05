import * as z from 'zod';
export const ProductContentUpsertResultSchema = z.object({
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
  Product: z.unknown()
});