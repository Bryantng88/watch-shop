import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  productId: z.boolean().optional(),
  titleSnapshot: z.boolean().optional(),
  brandSnapshot: z.boolean().optional(),
  refSnapshot: z.boolean().optional(),
  sizeSnapshot: z.boolean().optional(),
  movementSnapshot: z.boolean().optional(),
  glassSnapshot: z.boolean().optional(),
  strapClaspSnapshot: z.boolean().optional(),
  modelSnapshot: z.boolean().optional(),
  yearSnapshot: z.boolean().optional(),
  generatedContent: z.boolean().optional(),
  promptNote: z.boolean().optional(),
  generatedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  specBullets: z.boolean().optional(),
  hashtags: z.boolean().optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const ProductContentSelectObjectSchema: z.ZodType<Prisma.ProductContentSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentSelect>;
export const ProductContentSelectObjectZodSchema = makeSchema();
