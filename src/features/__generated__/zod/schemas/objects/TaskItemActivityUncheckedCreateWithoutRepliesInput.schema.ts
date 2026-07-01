import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

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
  updatedAt: z.coerce.date().optional()
}).strict();
export const TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUncheckedCreateWithoutRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUncheckedCreateWithoutRepliesInput>;
export const TaskItemActivityUncheckedCreateWithoutRepliesInputObjectZodSchema = makeSchema();
