import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  priority: z.string().optional(),
  isRead: z.boolean().optional(),
  userId: z.string(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional().nullable()
}).strict();
export const NotificationUncheckedCreateInputObjectSchema: z.ZodType<Prisma.NotificationUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationUncheckedCreateInput>;
export const NotificationUncheckedCreateInputObjectZodSchema = makeSchema();
