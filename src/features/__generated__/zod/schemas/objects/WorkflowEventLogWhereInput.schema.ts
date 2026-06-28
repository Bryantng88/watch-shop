import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const workfloweventlogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowEventLogWhereInputObjectSchema), z.lazy(() => WorkflowEventLogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowEventLogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowEventLogWhereInputObjectSchema), z.lazy(() => WorkflowEventLogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkflowEventLogWhereInputObjectSchema: z.ZodType<Prisma.WorkflowEventLogWhereInput> = workfloweventlogwhereinputSchema as unknown as z.ZodType<Prisma.WorkflowEventLogWhereInput>;
export const WorkflowEventLogWhereInputObjectZodSchema = workfloweventlogwhereinputSchema;
