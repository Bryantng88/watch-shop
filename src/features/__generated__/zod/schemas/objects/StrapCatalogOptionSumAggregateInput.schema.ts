import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const StrapCatalogOptionSumAggregateInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionSumAggregateInputType>;
export const StrapCatalogOptionSumAggregateInputObjectZodSchema = makeSchema();
