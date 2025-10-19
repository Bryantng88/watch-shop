import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  width: z.literal(true).optional(),
  height: z.literal(true).optional(),
  sizeBytes: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const ProductImageSumAggregateInputObjectSchema: z.ZodType<Prisma.ProductImageSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageSumAggregateInputType>;
export const ProductImageSumAggregateInputObjectZodSchema = makeSchema();
