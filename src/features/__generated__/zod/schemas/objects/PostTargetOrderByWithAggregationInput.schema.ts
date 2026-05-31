import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PostTargetCountOrderByAggregateInputObjectSchema as PostTargetCountOrderByAggregateInputObjectSchema } from './PostTargetCountOrderByAggregateInput.schema';
import { PostTargetMaxOrderByAggregateInputObjectSchema as PostTargetMaxOrderByAggregateInputObjectSchema } from './PostTargetMaxOrderByAggregateInput.schema';
import { PostTargetMinOrderByAggregateInputObjectSchema as PostTargetMinOrderByAggregateInputObjectSchema } from './PostTargetMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  platform: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => PostTargetCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => PostTargetMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => PostTargetMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const PostTargetOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PostTargetOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetOrderByWithAggregationInput>;
export const PostTargetOrderByWithAggregationInputObjectZodSchema = makeSchema();
