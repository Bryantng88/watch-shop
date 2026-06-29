import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WorkflowExecutionEventListRelationFilterObjectSchema as WorkflowExecutionEventListRelationFilterObjectSchema } from './WorkflowExecutionEventListRelationFilter.schema'

const businesseventlogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BusinessEventLogWhereInputObjectSchema), z.lazy(() => BusinessEventLogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BusinessEventLogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BusinessEventLogWhereInputObjectSchema), z.lazy(() => BusinessEventLogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  workflowEvents: z.lazy(() => WorkflowExecutionEventListRelationFilterObjectSchema).optional()
}).strict();
export const BusinessEventLogWhereInputObjectSchema: z.ZodType<Prisma.BusinessEventLogWhereInput> = businesseventlogwhereinputSchema as unknown as z.ZodType<Prisma.BusinessEventLogWhereInput>;
export const BusinessEventLogWhereInputObjectZodSchema = businesseventlogwhereinputSchema;
