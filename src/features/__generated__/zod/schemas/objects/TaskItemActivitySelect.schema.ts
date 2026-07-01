import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemArgsObjectSchema as TaskItemArgsObjectSchema } from './TaskItemArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskItemActivityReplyFindManySchema as TaskItemActivityReplyFindManySchema } from '../findManyTaskItemActivityReply.schema';
import { TaskItemActivityCountOutputTypeArgsObjectSchema as TaskItemActivityCountOutputTypeArgsObjectSchema } from './TaskItemActivityCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  taskItemId: z.boolean().optional(),
  sourceType: z.boolean().optional(),
  sourceId: z.boolean().optional(),
  title: z.boolean().optional(),
  body: z.boolean().optional(),
  status: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  occurredAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  taskItem: z.union([z.boolean(), z.lazy(() => TaskItemArgsObjectSchema)]).optional(),
  actorUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  replies: z.union([z.boolean(), z.lazy(() => TaskItemActivityReplyFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskItemActivityCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskItemActivitySelectObjectSchema: z.ZodType<Prisma.TaskItemActivitySelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivitySelect>;
export const TaskItemActivitySelectObjectZodSchema = makeSchema();
