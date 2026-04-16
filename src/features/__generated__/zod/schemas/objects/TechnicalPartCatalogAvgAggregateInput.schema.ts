import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TechnicalPartCatalogAvgAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalPartCatalogAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalPartCatalogAvgAggregateInputType>;
export const TechnicalPartCatalogAvgAggregateInputObjectZodSchema = makeSchema();
