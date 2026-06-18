import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  taskId: z.string(),
  targetType: TaskExecutionTargetTypeSchema,
  targetId: z.string(),
  actionType: TaskExecutionActionTypeSchema.optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  checklistItemId: z.string().optional().nullable()
}).strict();
export const TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionUncheckedCreateWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUncheckedCreateWithoutCreatedByUserInput>;
export const TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectZodSchema = makeSchema();
