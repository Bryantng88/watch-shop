import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaskCreateNestedOneWithoutExecutionsInputObjectSchema as TaskCreateNestedOneWithoutExecutionsInputObjectSchema } from './TaskCreateNestedOneWithoutExecutionsInput.schema';
import { UserCreateNestedOneWithoutTaskExecutionInputObjectSchema as UserCreateNestedOneWithoutTaskExecutionInputObjectSchema } from './UserCreateNestedOneWithoutTaskExecutionInput.schema';
import { TaskItemCreateNestedOneWithoutExecutionsInputObjectSchema as TaskItemCreateNestedOneWithoutExecutionsInputObjectSchema } from './TaskItemCreateNestedOneWithoutExecutionsInput.schema';
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
  task: z.lazy(() => TaskCreateNestedOneWithoutExecutionsInputObjectSchema),
  createdByUser: z.lazy(() => UserCreateNestedOneWithoutTaskExecutionInputObjectSchema).optional(),
  taskItem: z.lazy(() => TaskItemCreateNestedOneWithoutExecutionsInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedOneWithoutTaskExecutionInputObjectSchema).optional()
}).strict();
export const TaskExecutionCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateWithoutServiceRequestInput>;
export const TaskExecutionCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
