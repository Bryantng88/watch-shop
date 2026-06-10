import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  taskId: z.string(),
  targetType: TaskExecutionTargetTypeSchema,
  targetId: z.string(),
  actionType: TaskExecutionActionTypeSchema.optional(),
  note: z.string().optional().nullable(),
  createdByUserId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const TaskExecutionUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TaskExecutionUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUncheckedCreateInput>;
export const TaskExecutionUncheckedCreateInputObjectZodSchema = makeSchema();
