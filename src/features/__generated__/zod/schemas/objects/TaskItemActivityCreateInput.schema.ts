import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaskItemCreateNestedOneWithoutActivitiesInputObjectSchema as TaskItemCreateNestedOneWithoutActivitiesInputObjectSchema } from './TaskItemCreateNestedOneWithoutActivitiesInput.schema';
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
  taskItem: z.lazy(() => TaskItemCreateNestedOneWithoutActivitiesInputObjectSchema),
  actorUser: z.lazy(() => UserCreateNestedOneWithoutTaskItemActivitiesInputObjectSchema).optional(),
  replies: z.lazy(() => TaskItemActivityReplyCreateNestedManyWithoutActivityInputObjectSchema)
}).strict();
export const TaskItemActivityCreateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateInput>;
export const TaskItemActivityCreateInputObjectZodSchema = makeSchema();
