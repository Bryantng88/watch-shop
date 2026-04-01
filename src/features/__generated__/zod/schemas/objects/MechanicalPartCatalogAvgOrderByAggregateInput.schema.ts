import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  defaultCost: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional()
}).strict();
export const MechanicalPartCatalogAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogAvgOrderByAggregateInput>;
export const MechanicalPartCatalogAvgOrderByAggregateInputObjectZodSchema = makeSchema();
