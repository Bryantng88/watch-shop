import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  activityId: z.string(),
  body: z.string(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUncheckedCreateWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUncheckedCreateWithoutActorUserInput>;
export const TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectZodSchema = makeSchema();
