import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskItemActivityOrderByWithRelationInputObjectSchema as TaskItemActivityOrderByWithRelationInputObjectSchema } from './TaskItemActivityOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  activityId: SortOrderSchema.optional(),
  actorUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  body: SortOrderSchema.optional(),
  metadataJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  activity: z.lazy(() => TaskItemActivityOrderByWithRelationInputObjectSchema).optional(),
  actorUser: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const TaskItemActivityReplyOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyOrderByWithRelationInput>;
export const TaskItemActivityReplyOrderByWithRelationInputObjectZodSchema = makeSchema();
