import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const notificationchanneldeliverywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => NotificationChannelDeliveryWhereInputObjectSchema), z.lazy(() => NotificationChannelDeliveryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NotificationChannelDeliveryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotificationChannelDeliveryWhereInputObjectSchema), z.lazy(() => NotificationChannelDeliveryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  dispatchId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  channel: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  recipientGroupKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  errorMessage: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  payloadJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  sentAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NotificationChannelDeliveryWhereInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryWhereInput> = notificationchanneldeliverywhereinputSchema as unknown as z.ZodType<Prisma.NotificationChannelDeliveryWhereInput>;
export const NotificationChannelDeliveryWhereInputObjectZodSchema = notificationchanneldeliverywhereinputSchema;
