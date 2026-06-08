import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  domain: SortOrderSchema.optional(),
  legacyKind: SortOrderSchema.optional(),
  defaultPriority: SortOrderSchema.optional(),
  completionMode: SortOrderSchema.optional(),
  completionRuleKey: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TaskTypeCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskTypeCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeCountOrderByAggregateInput>;
export const TaskTypeCountOrderByAggregateInputObjectZodSchema = makeSchema();
