import * as z from 'zod';
export const ProductImageFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  productId: z.string(),
  fileKey: z.string(),
  role: z.unknown(),
  alt: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  mime: z.string().optional(),
  sizeBytes: z.number().int().optional(),
  sortOrder: z.number().int(),
  dominantHex: z.string().optional(),
  contentHash: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  product: z.unknown()
}));