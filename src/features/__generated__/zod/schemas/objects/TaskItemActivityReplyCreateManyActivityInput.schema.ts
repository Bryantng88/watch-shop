import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  actorUserId: z.string().optional().nullable(),
  body: z.string(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const TaskItemActivityReplyCreateManyActivityInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateManyActivityInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateManyActivityInput>;
export const TaskItemActivityReplyCreateManyActivityInputObjectZodSchema = makeSchema();
