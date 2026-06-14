import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskActionCountOrderByAggregateInputObjectSchema as TaskActionCountOrderByAggregateInputObjectSchema } from './TaskActionCountOrderByAggregateInput.schema';
import { TaskActionAvgOrderByAggregateInputObjectSchema as TaskActionAvgOrderByAggregateInputObjectSchema } from './TaskActionAvgOrderByAggregateInput.schema';
import { TaskActionMaxOrderByAggregateInputObjectSchema as TaskActionMaxOrderByAggregateInputObjectSchema } from './TaskActionMaxOrderByAggregateInput.schema';
import { TaskActionMinOrderByAggregateInputObjectSchema as TaskActionMinOrderByAggregateInputObjectSchema } from './TaskActionMinOrderByAggregateInput.schema';
import { TaskActionSumOrderByAggregateInputObjectSchema as TaskActionSumOrderByAggregateInputObjectSchema } from './TaskActionSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskTypeId: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completionMode: SortOrderSchema.optional(),
  completionRuleKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  targetType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicalDetailCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  supplyCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mechanicalPartCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicalActionMode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultTitleTemplate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultDescriptionTemplate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TaskActionCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TaskActionAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskActionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskActionMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TaskActionSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskActionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskActionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionOrderByWithAggregationInput>;
export const TaskActionOrderByWithAggregationInputObjectZodSchema = makeSchema();
