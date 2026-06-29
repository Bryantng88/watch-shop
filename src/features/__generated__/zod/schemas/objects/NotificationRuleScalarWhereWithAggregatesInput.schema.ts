import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const notificationrulescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => NotificationRuleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NotificationRuleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => NotificationRuleScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => NotificationRuleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => NotificationRuleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  channel: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  recipientGroupKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  titleTemplate: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  messageTemplate: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  priority: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const NotificationRuleScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.NotificationRuleScalarWhereWithAggregatesInput> = notificationrulescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.NotificationRuleScalarWhereWithAggregatesInput>;
export const NotificationRuleScalarWhereWithAggregatesInputObjectZodSchema = notificationrulescalarwherewithaggregatesinputSchema;
