import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const notificationdispatchwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => NotificationDispatchWhereInputObjectSchema), z.lazy(() => NotificationDispatchWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NotificationDispatchWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotificationDispatchWhereInputObjectSchema), z.lazy(() => NotificationDispatchWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  businessEventLogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  ruleId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  errorMessage: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  payloadJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NotificationDispatchWhereInputObjectSchema: z.ZodType<Prisma.NotificationDispatchWhereInput> = notificationdispatchwhereinputSchema as unknown as z.ZodType<Prisma.NotificationDispatchWhereInput>;
export const NotificationDispatchWhereInputObjectZodSchema = notificationdispatchwhereinputSchema;
