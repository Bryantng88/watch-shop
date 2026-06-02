import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TechnicalDetailCatalogAvgAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogAvgAggregateInputType>;
export const TechnicalDetailCatalogAvgAggregateInputObjectZodSchema = makeSchema();
