import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  foundedYear: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const BrandSumAggregateInputObjectSchema: z.ZodType<Prisma.BrandSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BrandSumAggregateInputType>;
export const BrandSumAggregateInputObjectZodSchema = makeSchema();
