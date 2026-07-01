import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  activityId: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  body: SortOrderSchema.optional(),
  metadataJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TaskItemActivityReplyCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCountOrderByAggregateInput>;
export const TaskItemActivityReplyCountOrderByAggregateInputObjectZodSchema = makeSchema();
