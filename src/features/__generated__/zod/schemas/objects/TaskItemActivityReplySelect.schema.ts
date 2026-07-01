import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityArgsObjectSchema as TaskItemActivityArgsObjectSchema } from './TaskItemActivityArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  activityId: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  body: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  activity: z.union([z.boolean(), z.lazy(() => TaskItemActivityArgsObjectSchema)]).optional(),
  actorUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const TaskItemActivityReplySelectObjectSchema: z.ZodType<Prisma.TaskItemActivityReplySelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplySelect>;
export const TaskItemActivityReplySelectObjectZodSchema = makeSchema();
