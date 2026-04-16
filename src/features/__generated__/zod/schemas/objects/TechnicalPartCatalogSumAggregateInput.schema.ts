import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TechnicalPartCatalogSumAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalPartCatalogSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalPartCatalogSumAggregateInputType>;
export const TechnicalPartCatalogSumAggregateInputObjectZodSchema = makeSchema();
