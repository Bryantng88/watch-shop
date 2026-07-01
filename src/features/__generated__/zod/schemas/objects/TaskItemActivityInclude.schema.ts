import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemArgsObjectSchema as TaskItemArgsObjectSchema } from './TaskItemArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskItemActivityReplyFindManySchema as TaskItemActivityReplyFindManySchema } from '../findManyTaskItemActivityReply.schema';
import { TaskItemActivityCountOutputTypeArgsObjectSchema as TaskItemActivityCountOutputTypeArgsObjectSchema } from './TaskItemActivityCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  taskItem: z.union([z.boolean(), z.lazy(() => TaskItemArgsObjectSchema)]).optional(),
  actorUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  replies: z.union([z.boolean(), z.lazy(() => TaskItemActivityReplyFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskItemActivityCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskItemActivityIncludeObjectSchema: z.ZodType<Prisma.TaskItemActivityInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityInclude>;
export const TaskItemActivityIncludeObjectZodSchema = makeSchema();
