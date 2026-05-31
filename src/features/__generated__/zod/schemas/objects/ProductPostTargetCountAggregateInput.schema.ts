import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.literal(true).optional(),
  postTargetId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ProductPostTargetCountAggregateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCountAggregateInputType>;
export const ProductPostTargetCountAggregateInputObjectZodSchema = makeSchema();
