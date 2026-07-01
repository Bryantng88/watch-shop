import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityArgsObjectSchema as TaskItemActivityArgsObjectSchema } from './TaskItemActivityArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  activity: z.union([z.boolean(), z.lazy(() => TaskItemActivityArgsObjectSchema)]).optional(),
  actorUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const TaskItemActivityReplyIncludeObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyInclude>;
export const TaskItemActivityReplyIncludeObjectZodSchema = makeSchema();
