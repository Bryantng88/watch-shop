import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

const workflowexecutioneventscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema), z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema), z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  executionId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  businessEventLogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const WorkflowExecutionEventScalarWhereInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventScalarWhereInput> = workflowexecutioneventscalarwhereinputSchema as unknown as z.ZodType<Prisma.WorkflowExecutionEventScalarWhereInput>;
export const WorkflowExecutionEventScalarWhereInputObjectZodSchema = workflowexecutioneventscalarwhereinputSchema;
