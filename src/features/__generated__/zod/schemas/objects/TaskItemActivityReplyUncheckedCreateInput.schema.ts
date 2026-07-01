import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  activityId: z.string(),
  actorUserId: z.string().optional().nullable(),
  body: z.string(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const TaskItemActivityReplyUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUncheckedCreateInput>;
export const TaskItemActivityReplyUncheckedCreateInputObjectZodSchema = makeSchema();
