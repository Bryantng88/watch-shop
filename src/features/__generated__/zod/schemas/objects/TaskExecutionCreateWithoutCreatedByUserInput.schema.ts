import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaskCreateNestedOneWithoutExecutionsInputObjectSchema as TaskCreateNestedOneWithoutExecutionsInputObjectSchema } from './TaskCreateNestedOneWithoutExecutionsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: TaskExecutionTargetTypeSchema,
  targetId: z.string(),
  actionType: TaskExecutionActionTypeSchema.optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  task: z.lazy(() => TaskCreateNestedOneWithoutExecutionsInputObjectSchema)
}).strict();
export const TaskExecutionCreateWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateWithoutCreatedByUserInput>;
export const TaskExecutionCreateWithoutCreatedByUserInputObjectZodSchema = makeSchema();
