import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaskItemActivityCreateNestedOneWithoutRepliesInputObjectSchema as TaskItemActivityCreateNestedOneWithoutRepliesInputObjectSchema } from './TaskItemActivityCreateNestedOneWithoutRepliesInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  body: z.string(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activity: z.lazy(() => TaskItemActivityCreateNestedOneWithoutRepliesInputObjectSchema)
}).strict();
export const TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateWithoutActorUserInput>;
export const TaskItemActivityReplyCreateWithoutActorUserInputObjectZodSchema = makeSchema();
