import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const technicalActionCatalogSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalActionCatalogSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalActionCatalogSumOrderByAggregateInput>;
export const technicalActionCatalogSumOrderByAggregateInputObjectZodSchema = makeSchema();
