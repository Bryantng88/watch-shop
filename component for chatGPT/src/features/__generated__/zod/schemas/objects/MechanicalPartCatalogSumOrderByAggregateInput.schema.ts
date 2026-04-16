import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  defaultCost: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const MechanicalPartCatalogSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogSumOrderByAggregateInput>;
export const MechanicalPartCatalogSumOrderByAggregateInputObjectZodSchema = makeSchema();
