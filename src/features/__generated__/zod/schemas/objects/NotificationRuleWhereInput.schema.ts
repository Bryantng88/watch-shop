import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const notificationrulewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => NotificationRuleWhereInputObjectSchema), z.lazy(() => NotificationRuleWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NotificationRuleWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotificationRuleWhereInputObjectSchema), z.lazy(() => NotificationRuleWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  channel: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  recipientGroupKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  conditionJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  titleTemplate: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  messageTemplate: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  priority: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NotificationRuleWhereInputObjectSchema: z.ZodType<Prisma.NotificationRuleWhereInput> = notificationrulewhereinputSchema as unknown as z.ZodType<Prisma.NotificationRuleWhereInput>;
export const NotificationRuleWhereInputObjectZodSchema = notificationrulewhereinputSchema;
