import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.literal(true).optional(),
  postTargetId: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const ProductPostTargetMinAggregateInputObjectSchema: z.ZodType<Prisma.ProductPostTargetMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetMinAggregateInputType>;
export const ProductPostTargetMinAggregateInputObjectZodSchema = makeSchema();
