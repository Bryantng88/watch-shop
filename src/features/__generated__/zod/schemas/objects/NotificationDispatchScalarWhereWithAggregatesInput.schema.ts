import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const notificationdispatchscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => NotificationDispatchScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NotificationDispatchScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NotificationDispatchScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotificationDispatchScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NotificationDispatchScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  businessEventLogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  ruleId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  eventKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  errorMessage: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  payloadJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NotificationDispatchScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.NotificationDispatchScalarWhereWithAggregatesInput> = notificationdispatchscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.NotificationDispatchScalarWhereWithAggregatesInput>;
export const NotificationDispatchScalarWhereWithAggregatesInputObjectZodSchema = notificationdispatchscalarwherewithaggregatesinputSchema;
