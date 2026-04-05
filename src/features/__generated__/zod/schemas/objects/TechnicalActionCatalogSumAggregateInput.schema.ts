import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TechnicalActionCatalogSumAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalActionCatalogSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalActionCatalogSumAggregateInputType>;
export const TechnicalActionCatalogSumAggregateInputObjectZodSchema = makeSchema();
