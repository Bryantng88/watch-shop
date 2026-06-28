import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumWorkflowExecutionStatusFilterObjectSchema as EnumWorkflowExecutionStatusFilterObjectSchema } from './EnumWorkflowExecutionStatusFilter.schema';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const workflowexecutionscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowExecutionScalarWhereInputObjectSchema), z.lazy(() => WorkflowExecutionScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowExecutionScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowExecutionScalarWhereInputObjectSchema), z.lazy(() => WorkflowExecutionScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workflowId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actionTargetType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actionTargetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumWorkflowExecutionStatusFilterObjectSchema), WorkflowExecutionStatusSchema]).optional(),
  errorMessage: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  startedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  failedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkflowExecutionScalarWhereInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionScalarWhereInput> = workflowexecutionscalarwhereinputSchema as unknown as z.ZodType<Prisma.WorkflowExecutionScalarWhereInput>;
export const WorkflowExecutionScalarWhereInputObjectZodSchema = workflowexecutionscalarwhereinputSchema;
