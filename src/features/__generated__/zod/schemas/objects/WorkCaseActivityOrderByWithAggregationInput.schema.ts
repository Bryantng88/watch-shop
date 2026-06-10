import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkCaseActivityCountOrderByAggregateInputObjectSchema as WorkCaseActivityCountOrderByAggregateInputObjectSchema } from './WorkCaseActivityCountOrderByAggregateInput.schema';
import { WorkCaseActivityMaxOrderByAggregateInputObjectSchema as WorkCaseActivityMaxOrderByAggregateInputObjectSchema } from './WorkCaseActivityMaxOrderByAggregateInput.schema';
import { WorkCaseActivityMinOrderByAggregateInputObjectSchema as WorkCaseActivityMinOrderByAggregateInputObjectSchema } from './WorkCaseActivityMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  workCaseId: SortOrderSchema.optional(),
  actorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  action: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WorkCaseActivityCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkCaseActivityMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkCaseActivityMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkCaseActivityOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityOrderByWithAggregationInput>;
export const WorkCaseActivityOrderByWithAggregationInputObjectZodSchema = makeSchema();
