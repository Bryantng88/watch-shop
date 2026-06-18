import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskChecklistItemArgsObjectSchema as TaskChecklistItemArgsObjectSchema } from './TaskChecklistItemArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  taskId: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  actionType: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  note: z.boolean().optional(),
  createdByUserId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  task: z.union([z.boolean(), z.lazy(() => TaskArgsObjectSchema)]).optional(),
  createdByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  checklistItem: z.union([z.boolean(), z.lazy(() => TaskChecklistItemArgsObjectSchema)]).optional(),
  checklistItemId: z.boolean().optional()
}).strict();
export const TaskExecutionSelectObjectSchema: z.ZodType<Prisma.TaskExecutionSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionSelect>;
export const TaskExecutionSelectObjectZodSchema = makeSchema();
