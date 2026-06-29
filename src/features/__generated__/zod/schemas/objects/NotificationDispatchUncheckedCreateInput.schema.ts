import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  businessEventLogId: z.string().optional().nullable(),
  ruleId: z.string().optional().nullable(),
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  status: z.string().optional(),
  errorMessage: z.string().optional().nullable(),
  payloadJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const NotificationDispatchUncheckedCreateInputObjectSchema: z.ZodType<Prisma.NotificationDispatchUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationDispatchUncheckedCreateInput>;
export const NotificationDispatchUncheckedCreateInputObjectZodSchema = makeSchema();
