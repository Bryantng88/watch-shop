import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  defaultCost: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const SupplyCatalogAvgAggregateInputObjectSchema: z.ZodType<Prisma.SupplyCatalogAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogAvgAggregateInputType>;
export const SupplyCatalogAvgAggregateInputObjectZodSchema = makeSchema();
