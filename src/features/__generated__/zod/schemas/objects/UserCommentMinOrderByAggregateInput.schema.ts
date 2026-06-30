import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  body: SortOrderSchema.optional(),
  visibility: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const UserCommentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserCommentMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCommentMinOrderByAggregateInput>;
export const UserCommentMinOrderByAggregateInputObjectZodSchema = makeSchema();
