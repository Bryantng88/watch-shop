import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { UserCreateNestedOneWithoutTaskExecutionInputObjectSchema as UserCreateNestedOneWithoutTaskExecutionInputObjectSchema } from './UserCreateNestedOneWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: TaskExecutionTargetTypeSchema,
  targetId: z.string(),
  actionType: TaskExecutionActionTypeSchema.optional(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  createdByUser: z.lazy(() => UserCreateNestedOneWithoutTaskExecutionInputObjectSchema).optional()
}).strict();
export const TaskExecutionCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateWithoutTaskInput>;
export const TaskExecutionCreateWithoutTaskInputObjectZodSchema = makeSchema();
