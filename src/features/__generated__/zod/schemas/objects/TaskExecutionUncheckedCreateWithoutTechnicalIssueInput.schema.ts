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
  createdByUserId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  checklistItemId: z.string().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  taskItemId: z.string().optional().nullable()
}).strict();
export const TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskExecutionUncheckedCreateWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUncheckedCreateWithoutTechnicalIssueInput>;
export const TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
