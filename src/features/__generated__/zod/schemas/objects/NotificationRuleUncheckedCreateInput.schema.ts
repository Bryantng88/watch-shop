import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  eventKey: z.string(),
  enabled: z.boolean().optional(),
  channel: z.string(),
  recipientGroupKey: z.string(),
  conditionJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  titleTemplate: z.string().optional().nullable(),
  messageTemplate: z.string(),
  priority: z.string().optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const NotificationRuleUncheckedCreateInputObjectSchema: z.ZodType<Prisma.NotificationRuleUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRuleUncheckedCreateInput>;
export const NotificationRuleUncheckedCreateInputObjectZodSchema = makeSchema();
