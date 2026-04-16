import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TechnicalActionCatalogAvgAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalActionCatalogAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalActionCatalogAvgAggregateInputType>;
export const TechnicalActionCatalogAvgAggregateInputObjectZodSchema = makeSchema();
