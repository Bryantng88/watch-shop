import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutActivityRepliesInputObjectSchema as UserCreateNestedOneWithoutActivityRepliesInputObjectSchema } from './UserCreateNestedOneWithoutActivityRepliesInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  body: z.string(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  actorUser: z.lazy(() => UserCreateNestedOneWithoutActivityRepliesInputObjectSchema).optional()
}).strict();
export const TaskItemActivityReplyCreateWithoutActivityInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateWithoutActivityInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateWithoutActivityInput>;
export const TaskItemActivityReplyCreateWithoutActivityInputObjectZodSchema = makeSchema();
