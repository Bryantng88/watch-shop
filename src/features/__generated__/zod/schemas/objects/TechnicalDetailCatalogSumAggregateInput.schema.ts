import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TechnicalDetailCatalogSumAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogSumAggregateInputType>;
export const TechnicalDetailCatalogSumAggregateInputObjectZodSchema = makeSchema();
