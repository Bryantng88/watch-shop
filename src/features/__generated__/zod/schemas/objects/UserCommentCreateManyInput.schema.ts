import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: z.string(),
  targetId: z.string(),
  actorUserId: z.string().optional().nullable(),
  body: z.string(),
  visibility: z.string().optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const UserCommentCreateManyInputObjectSchema: z.ZodType<Prisma.UserCommentCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.UserCommentCreateManyInput>;
export const UserCommentCreateManyInputObjectZodSchema = makeSchema();
