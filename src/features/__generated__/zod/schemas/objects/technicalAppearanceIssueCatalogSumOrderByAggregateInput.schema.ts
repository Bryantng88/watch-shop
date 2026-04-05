import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  deductionScore: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const technicalAppearanceIssueCatalogSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogSumOrderByAggregateInput>;
export const technicalAppearanceIssueCatalogSumOrderByAggregateInputObjectZodSchema = makeSchema();
