import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TechnicalDetailCatalogSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogSumOrderByAggregateInput>;
export const TechnicalDetailCatalogSumOrderByAggregateInputObjectZodSchema = makeSchema();
