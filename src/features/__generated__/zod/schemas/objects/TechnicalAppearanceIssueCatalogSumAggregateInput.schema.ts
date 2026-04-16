import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  deductionScore: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const TechnicalAppearanceIssueCatalogSumAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAppearanceIssueCatalogSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAppearanceIssueCatalogSumAggregateInputType>;
export const TechnicalAppearanceIssueCatalogSumAggregateInputObjectZodSchema = makeSchema();
