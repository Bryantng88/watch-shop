import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const technicalPartCatalogSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalPartCatalogSumOrderByAggregateInput>;
export const technicalPartCatalogSumOrderByAggregateInputObjectZodSchema = makeSchema();
