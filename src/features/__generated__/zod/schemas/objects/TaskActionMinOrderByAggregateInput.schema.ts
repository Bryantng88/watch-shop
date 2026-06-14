import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskTypeId: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  completionMode: SortOrderSchema.optional(),
  completionRuleKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  serviceCatalogId: SortOrderSchema.optional(),
  technicalDetailCatalogId: SortOrderSchema.optional(),
  supplyCatalogId: SortOrderSchema.optional(),
  mechanicalPartCatalogId: SortOrderSchema.optional(),
  technicalActionMode: SortOrderSchema.optional(),
  defaultTitleTemplate: SortOrderSchema.optional(),
  defaultDescriptionTemplate: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TaskActionMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskActionMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionMinOrderByAggregateInput>;
export const TaskActionMinOrderByAggregateInputObjectZodSchema = makeSchema();
