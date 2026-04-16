import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutNotificationInputObjectSchema as UserCreateNestedOneWithoutNotificationInputObjectSchema } from './UserCreateNestedOneWithoutNotificationInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  priority: z.string().optional(),
  isRead: z.boolean().optional(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional().nullable(),
  User: z.lazy(() => UserCreateNestedOneWithoutNotificationInputObjectSchema)
}).strict();
export const NotificationCreateInputObjectSchema: z.ZodType<Prisma.NotificationCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationCreateInput>;
export const NotificationCreateInputObjectZodSchema = makeSchema();
