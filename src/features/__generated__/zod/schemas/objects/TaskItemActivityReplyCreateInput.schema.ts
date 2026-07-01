import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaskItemActivityCreateNestedOneWithoutRepliesInputObjectSchema as TaskItemActivityCreateNestedOneWithoutRepliesInputObjectSchema } from './TaskItemActivityCreateNestedOneWithoutRepliesInput.schema';
import { UserCreateNestedOneWithoutActivityRepliesInputObjectSchema as UserCreateNestedOneWithoutActivityRepliesInputObjectSchema } from './UserCreateNestedOneWithoutActivityRepliesInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  body: z.string(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  activity: z.lazy(() => TaskItemActivityCreateNestedOneWithoutRepliesInputObjectSchema),
  actorUser: z.lazy(() => UserCreateNestedOneWithoutActivityRepliesInputObjectSchema).optional()
}).strict();
export const TaskItemActivityReplyCreateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateInput>;
export const TaskItemActivityReplyCreateInputObjectZodSchema = makeSchema();
