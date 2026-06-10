import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskTypeCountOrderByAggregateInputObjectSchema as TaskTypeCountOrderByAggregateInputObjectSchema } from './TaskTypeCountOrderByAggregateInput.schema';
import { TaskTypeAvgOrderByAggregateInputObjectSchema as TaskTypeAvgOrderByAggregateInputObjectSchema } from './TaskTypeAvgOrderByAggregateInput.schema';
import { TaskTypeMaxOrderByAggregateInputObjectSchema as TaskTypeMaxOrderByAggregateInputObjectSchema } from './TaskTypeMaxOrderByAggregateInput.schema';
import { TaskTypeMinOrderByAggregateInputObjectSchema as TaskTypeMinOrderByAggregateInputObjectSchema } from './TaskTypeMinOrderByAggregateInput.schema';
import { TaskTypeSumOrderByAggregateInputObjectSchema as TaskTypeSumOrderByAggregateInputObjectSchema } from './TaskTypeSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  domain: SortOrderSchema.optional(),
  defaultPriority: SortOrderSchema.optional(),
  completionMode: SortOrderSchema.optional(),
  completionRuleKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TaskTypeCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TaskTypeAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskTypeMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskTypeMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TaskTypeSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskTypeOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskTypeOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeOrderByWithAggregationInput>;
export const TaskTypeOrderByWithAggregationInputObjectZodSchema = makeSchema();
