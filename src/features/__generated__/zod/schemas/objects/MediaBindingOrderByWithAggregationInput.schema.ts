import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MediaBindingCountOrderByAggregateInputObjectSchema as MediaBindingCountOrderByAggregateInputObjectSchema } from './MediaBindingCountOrderByAggregateInput.schema';
import { MediaBindingAvgOrderByAggregateInputObjectSchema as MediaBindingAvgOrderByAggregateInputObjectSchema } from './MediaBindingAvgOrderByAggregateInput.schema';
import { MediaBindingMaxOrderByAggregateInputObjectSchema as MediaBindingMaxOrderByAggregateInputObjectSchema } from './MediaBindingMaxOrderByAggregateInput.schema';
import { MediaBindingMinOrderByAggregateInputObjectSchema as MediaBindingMinOrderByAggregateInputObjectSchema } from './MediaBindingMinOrderByAggregateInput.schema';
import { MediaBindingSumOrderByAggregateInputObjectSchema as MediaBindingSumOrderByAggregateInputObjectSchema } from './MediaBindingSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  mediaObjectId: SortOrderSchema.optional(),
  ownerType: SortOrderSchema.optional(),
  ownerId: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  audienceSegment: SortOrderSchema.optional(),
  lifecycle: SortOrderSchema.optional(),
  pipelineKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => MediaBindingCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => MediaBindingAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MediaBindingMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MediaBindingMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => MediaBindingSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MediaBindingOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MediaBindingOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingOrderByWithAggregationInput>;
export const MediaBindingOrderByWithAggregationInputObjectZodSchema = makeSchema();
