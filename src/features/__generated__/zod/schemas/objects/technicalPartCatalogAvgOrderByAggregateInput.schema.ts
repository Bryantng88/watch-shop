import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const technicalPartCatalogAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalPartCatalogAvgOrderByAggregateInput>;
export const technicalPartCatalogAvgOrderByAggregateInputObjectZodSchema = makeSchema();
