import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const notificationchanneldeliveryscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => NotificationChannelDeliveryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NotificationChannelDeliveryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NotificationChannelDeliveryScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotificationChannelDeliveryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NotificationChannelDeliveryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  dispatchId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  channel: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  recipientGroupKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  errorMessage: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  payloadJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  sentAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NotificationChannelDeliveryScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryScalarWhereWithAggregatesInput> = notificationchanneldeliveryscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.NotificationChannelDeliveryScalarWhereWithAggregatesInput>;
export const NotificationChannelDeliveryScalarWhereWithAggregatesInputObjectZodSchema = notificationchanneldeliveryscalarwherewithaggregatesinputSchema;
