import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  width: z.literal(true).optional(),
  height: z.literal(true).optional(),
  sizeBytes: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const ProductImageAvgAggregateInputObjectSchema: z.ZodType<Prisma.ProductImageAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageAvgAggregateInputType>;
export const ProductImageAvgAggregateInputObjectZodSchema = makeSchema();
