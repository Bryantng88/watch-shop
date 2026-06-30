import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string().optional().nullable(),
  actorUserId: z.string().optional().nullable(),
  message: z.string(),
  visibility: z.string().optional(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const BusinessFeedbackCreateManyInputObjectSchema: z.ZodType<Prisma.BusinessFeedbackCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessFeedbackCreateManyInput>;
export const BusinessFeedbackCreateManyInputObjectZodSchema = makeSchema();
