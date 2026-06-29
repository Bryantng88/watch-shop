import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  key: z.string(),
  name: z.string(),
  enabled: z.boolean().optional(),
  roleNames: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  userIds: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  zaloGroupId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const NotificationRecipientGroupCreateInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupCreateInput>;
export const NotificationRecipientGroupCreateInputObjectZodSchema = makeSchema();
