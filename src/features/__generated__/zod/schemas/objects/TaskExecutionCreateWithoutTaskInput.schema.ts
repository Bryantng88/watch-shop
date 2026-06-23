import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutTaskExecutionInputObjectSchema as UserCreateNestedOneWithoutTaskExecutionInputObjectSchema } from './UserCreateNestedOneWithoutTaskExecutionInput.schema';
import { TaskItemCreateNestedOneWithoutExecutionsInputObjectSchema as TaskItemCreateNestedOneWithoutExecutionsInputObjectSchema } from './TaskItemCreateNestedOneWithoutExecutionsInput.schema';
import { ServiceRequestCreateNestedOneWithoutTaskExecutionInputObjectSchema as ServiceRequestCreateNestedOneWithoutTaskExecutionInputObjectSchema } from './ServiceRequestCreateNestedOneWithoutTaskExecutionInput.schema';
import { TechnicalIssueCreateNestedOneWithoutTaskExecutionInputObjectSchema as TechnicalIssueCreateNestedOneWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueCreateNestedOneWithoutTaskExecutionInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: TaskExecutionTargetTypeSchema,
  targetId: z.string(),
  actionType: TaskExecutionActionTypeSchema.optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  checklistItemId: z.string().optional().nullable(),
  createdByUser: z.lazy(() => UserCreateNestedOneWithoutTaskExecutionInputObjectSchema).optional(),
  taskItem: z.lazy(() => TaskItemCreateNestedOneWithoutExecutionsInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedOneWithoutTaskExecutionInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedOneWithoutTaskExecutionInputObjectSchema).optional()
}).strict();
export const TaskExecutionCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateWithoutTaskInput>;
export const TaskExecutionCreateWithoutTaskInputObjectZodSchema = makeSchema();
