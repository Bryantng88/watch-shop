import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  fileKey: z.boolean().optional(),
  role: z.boolean().optional(),
  alt: z.boolean().optional(),
  width: z.boolean().optional(),
  height: z.boolean().optional(),
  mime: z.boolean().optional(),
  sizeBytes: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  dominantHex: z.boolean().optional(),
  contentHash: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const ProductImageSelectObjectSchema: z.ZodType<Prisma.ProductImageSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageSelect>;
export const ProductImageSelectObjectZodSchema = makeSchema();
