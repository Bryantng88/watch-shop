import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  maxQtyPerOrder: z.literal(true).optional()
}).strict();
export const ProductAvgAggregateInputObjectSchema: z.ZodType<Prisma.ProductAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductAvgAggregateInputType>;
export const ProductAvgAggregateInputObjectZodSchema = makeSchema();
