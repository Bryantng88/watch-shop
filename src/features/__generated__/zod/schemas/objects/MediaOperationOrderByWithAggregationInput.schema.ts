import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MediaOperationCountOrderByAggregateInputObjectSchema as MediaOperationCountOrderByAggregateInputObjectSchema } from './MediaOperationCountOrderByAggregateInput.schema';
import { MediaOperationAvgOrderByAggregateInputObjectSchema as MediaOperationAvgOrderByAggregateInputObjectSchema } from './MediaOperationAvgOrderByAggregateInput.schema';
import { MediaOperationMaxOrderByAggregateInputObjectSchema as MediaOperationMaxOrderByAggregateInputObjectSchema } from './MediaOperationMaxOrderByAggregateInput.schema';
import { MediaOperationMinOrderByAggregateInputObjectSchema as MediaOperationMinOrderByAggregateInputObjectSchema } from './MediaOperationMinOrderByAggregateInput.schema';
import { MediaOperationSumOrderByAggregateInputObjectSchema as MediaOperationSumOrderByAggregateInputObjectSchema } from './MediaOperationSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  idempotencyKey: SortOrderSchema.optional(),
  mediaObjectId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sourceKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  destinationKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  attempts: SortOrderSchema.optional(),
  lastError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  requestedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => MediaOperationCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => MediaOperationAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MediaOperationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MediaOperationMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => MediaOperationSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MediaOperationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MediaOperationOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationOrderByWithAggregationInput>;
export const MediaOperationOrderByWithAggregationInputObjectZodSchema = makeSchema();
