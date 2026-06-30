import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserCommentCountOrderByAggregateInputObjectSchema as UserCommentCountOrderByAggregateInputObjectSchema } from './UserCommentCountOrderByAggregateInput.schema';
import { UserCommentMaxOrderByAggregateInputObjectSchema as UserCommentMaxOrderByAggregateInputObjectSchema } from './UserCommentMaxOrderByAggregateInput.schema';
import { UserCommentMinOrderByAggregateInputObjectSchema as UserCommentMinOrderByAggregateInputObjectSchema } from './UserCommentMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  body: SortOrderSchema.optional(),
  visibility: SortOrderSchema.optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => UserCommentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => UserCommentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => UserCommentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const UserCommentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.UserCommentOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCommentOrderByWithAggregationInput>;
export const UserCommentOrderByWithAggregationInputObjectZodSchema = makeSchema();
