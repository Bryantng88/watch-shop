import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkCaseCountOrderByAggregateInputObjectSchema as WorkCaseCountOrderByAggregateInputObjectSchema } from './WorkCaseCountOrderByAggregateInput.schema';
import { WorkCaseMaxOrderByAggregateInputObjectSchema as WorkCaseMaxOrderByAggregateInputObjectSchema } from './WorkCaseMaxOrderByAggregateInput.schema';
import { WorkCaseMinOrderByAggregateInputObjectSchema as WorkCaseMinOrderByAggregateInputObjectSchema } from './WorkCaseMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  refNo: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scope: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  categoryId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  raisedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignedToUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  triagedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  resolvedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  cancelledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WorkCaseCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkCaseMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkCaseMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkCaseOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkCaseOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseOrderByWithAggregationInput>;
export const WorkCaseOrderByWithAggregationInputObjectZodSchema = makeSchema();
