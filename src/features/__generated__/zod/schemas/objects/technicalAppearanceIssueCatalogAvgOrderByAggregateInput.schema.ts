import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  deductionScore: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const technicalAppearanceIssueCatalogAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogAvgOrderByAggregateInput>;
export const technicalAppearanceIssueCatalogAvgOrderByAggregateInputObjectZodSchema = makeSchema();
