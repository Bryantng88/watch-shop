import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const StrapCatalogOptionSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionSumOrderByAggregateInput>;
export const StrapCatalogOptionSumOrderByAggregateInputObjectZodSchema = makeSchema();
