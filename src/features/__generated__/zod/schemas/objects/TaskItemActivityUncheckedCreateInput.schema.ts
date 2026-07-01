import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaskItemActivityReplyUncheckedCreateNestedManyWithoutActivityInputObjectSchema as TaskItemActivityReplyUncheckedCreateNestedManyWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateNestedManyWithoutActivityInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  taskItemId: z.string(),
  sourceType: ActivitySourceTypeSchema,
  sourceId: z.string().optional().nullable(),
  title: z.string(),
  body: z.string().optional().nullable(),
  status: ActivityStatusSchema.optional(),
  actorUserId: z.string().optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  occurredAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  replies: z.lazy(() => TaskItemActivityReplyUncheckedCreateNestedManyWithoutActivityInputObjectSchema)
}).strict();
export const TaskItemActivityUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUncheckedCreateInput>;
export const TaskItemActivityUncheckedCreateInputObjectZodSchema = makeSchema();
