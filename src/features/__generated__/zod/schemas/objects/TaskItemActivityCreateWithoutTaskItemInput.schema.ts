import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutTaskItemActivitiesInputObjectSchema as UserCreateNestedOneWithoutTaskItemActivitiesInputObjectSchema } from './UserCreateNestedOneWithoutTaskItemActivitiesInput.schema';
import { TaskItemActivityReplyCreateNestedManyWithoutActivityInputObjectSchema as TaskItemActivityReplyCreateNestedManyWithoutActivityInputObjectSchema } from './TaskItemActivityReplyCreateNestedManyWithoutActivityInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  sourceType: ActivitySourceTypeSchema,
  sourceId: z.string().optional().nullable(),
  title: z.string(),
  body: z.string().optional().nullable(),
  status: ActivityStatusSchema.optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  occurredAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  actorUser: z.lazy(() => UserCreateNestedOneWithoutTaskItemActivitiesInputObjectSchema).optional(),
  replies: z.lazy(() => TaskItemActivityReplyCreateNestedManyWithoutActivityInputObjectSchema).optional()
}).strict();
export const TaskItemActivityCreateWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateWithoutTaskItemInput>;
export const TaskItemActivityCreateWithoutTaskItemInputObjectZodSchema = makeSchema();
