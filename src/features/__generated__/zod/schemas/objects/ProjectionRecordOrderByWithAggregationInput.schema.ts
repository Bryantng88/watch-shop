import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProjectionRecordCountOrderByAggregateInputObjectSchema as ProjectionRecordCountOrderByAggregateInputObjectSchema } from './ProjectionRecordCountOrderByAggregateInput.schema';
import { ProjectionRecordAvgOrderByAggregateInputObjectSchema as ProjectionRecordAvgOrderByAggregateInputObjectSchema } from './ProjectionRecordAvgOrderByAggregateInput.schema';
import { ProjectionRecordMaxOrderByAggregateInputObjectSchema as ProjectionRecordMaxOrderByAggregateInputObjectSchema } from './ProjectionRecordMaxOrderByAggregateInput.schema';
import { ProjectionRecordMinOrderByAggregateInputObjectSchema as ProjectionRecordMinOrderByAggregateInputObjectSchema } from './ProjectionRecordMinOrderByAggregateInput.schema';
import { ProjectionRecordSumOrderByAggregateInputObjectSchema as ProjectionRecordSumOrderByAggregateInputObjectSchema } from './ProjectionRecordSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  projectionKey: SortOrderSchema.optional(),
  projectionVersion: SortOrderSchema.optional(),
  rowKey: SortOrderSchema.optional(),
  workspaceId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  spaceId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  entityType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  entityId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  searchText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dataJson: SortOrderSchema.optional(),
  sourceUpdatedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  projectedAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ProjectionRecordCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ProjectionRecordAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProjectionRecordMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProjectionRecordMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ProjectionRecordSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ProjectionRecordOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ProjectionRecordOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordOrderByWithAggregationInput>;
export const ProjectionRecordOrderByWithAggregationInputObjectZodSchema = makeSchema();
