import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const StrapCatalogOptionAvgAggregateInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionAvgAggregateInputType>;
export const StrapCatalogOptionAvgAggregateInputObjectZodSchema = makeSchema();
