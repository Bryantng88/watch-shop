import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  foundedYear: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const BrandAvgAggregateInputObjectSchema: z.ZodType<Prisma.BrandAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BrandAvgAggregateInputType>;
export const BrandAvgAggregateInputObjectZodSchema = makeSchema();
