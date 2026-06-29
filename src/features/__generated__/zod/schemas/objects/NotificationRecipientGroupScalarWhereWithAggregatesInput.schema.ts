import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const notificationrecipientgroupscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => NotificationRecipientGroupScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NotificationRecipientGroupScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NotificationRecipientGroupScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotificationRecipientGroupScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NotificationRecipientGroupScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  roleNames: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  userIds: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  zaloGroupId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NotificationRecipientGroupScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupScalarWhereWithAggregatesInput> = notificationrecipientgroupscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.NotificationRecipientGroupScalarWhereWithAggregatesInput>;
export const NotificationRecipientGroupScalarWhereWithAggregatesInputObjectZodSchema = notificationrecipientgroupscalarwherewithaggregatesinputSchema;
