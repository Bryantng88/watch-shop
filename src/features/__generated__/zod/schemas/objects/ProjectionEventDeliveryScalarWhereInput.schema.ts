import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

const projectioneventdeliveryscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProjectionEventDeliveryScalarWhereInputObjectSchema), z.lazy(() => ProjectionEventDeliveryScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProjectionEventDeliveryScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProjectionEventDeliveryScalarWhereInputObjectSchema), z.lazy(() => ProjectionEventDeliveryScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  idempotencyKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  businessEventLogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  effect: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  revokeEventKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  targetAliasIds: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  eventInstanceId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  payloadJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  attempts: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  nextAttemptAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  lockedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  lastError: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProjectionEventDeliveryScalarWhereInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryScalarWhereInput> = projectioneventdeliveryscalarwhereinputSchema as unknown as z.ZodType<Prisma.ProjectionEventDeliveryScalarWhereInput>;
export const ProjectionEventDeliveryScalarWhereInputObjectZodSchema = projectioneventdeliveryscalarwhereinputSchema;
