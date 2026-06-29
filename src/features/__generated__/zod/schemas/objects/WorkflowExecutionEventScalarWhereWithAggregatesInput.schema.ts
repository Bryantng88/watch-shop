import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

const workflowexecutioneventscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowExecutionEventScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkflowExecutionEventScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowExecutionEventScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowExecutionEventScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkflowExecutionEventScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  executionId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  businessEventLogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const WorkflowExecutionEventScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventScalarWhereWithAggregatesInput> = workflowexecutioneventscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WorkflowExecutionEventScalarWhereWithAggregatesInput>;
export const WorkflowExecutionEventScalarWhereWithAggregatesInputObjectZodSchema = workflowexecutioneventscalarwherewithaggregatesinputSchema;
