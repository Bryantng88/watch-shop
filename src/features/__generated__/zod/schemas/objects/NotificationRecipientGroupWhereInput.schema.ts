import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const notificationrecipientgroupwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => NotificationRecipientGroupWhereInputObjectSchema), z.lazy(() => NotificationRecipientGroupWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NotificationRecipientGroupWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotificationRecipientGroupWhereInputObjectSchema), z.lazy(() => NotificationRecipientGroupWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  roleNames: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  userIds: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  zaloGroupId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NotificationRecipientGroupWhereInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupWhereInput> = notificationrecipientgroupwhereinputSchema as unknown as z.ZodType<Prisma.NotificationRecipientGroupWhereInput>;
export const NotificationRecipientGroupWhereInputObjectZodSchema = notificationrecipientgroupwhereinputSchema;
