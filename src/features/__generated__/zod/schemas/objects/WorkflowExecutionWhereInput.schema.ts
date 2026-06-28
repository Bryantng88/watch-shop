import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumWorkflowExecutionStatusFilterObjectSchema as EnumWorkflowExecutionStatusFilterObjectSchema } from './EnumWorkflowExecutionStatusFilter.schema';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WorkflowTemplateScalarRelationFilterObjectSchema as WorkflowTemplateScalarRelationFilterObjectSchema } from './WorkflowTemplateScalarRelationFilter.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema';
import { WorkflowExecutionEventListRelationFilterObjectSchema as WorkflowExecutionEventListRelationFilterObjectSchema } from './WorkflowExecutionEventListRelationFilter.schema'

const workflowexecutionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowExecutionWhereInputObjectSchema), z.lazy(() => WorkflowExecutionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowExecutionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowExecutionWhereInputObjectSchema), z.lazy(() => WorkflowExecutionWhereInputObjectSchema).array()]).optional(),
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
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  workflow: z.union([z.lazy(() => WorkflowTemplateScalarRelationFilterObjectSchema), z.lazy(() => WorkflowTemplateWhereInputObjectSchema)]).optional(),
  events: z.lazy(() => WorkflowExecutionEventListRelationFilterObjectSchema).optional()
}).strict();
export const WorkflowExecutionWhereInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionWhereInput> = workflowexecutionwhereinputSchema as unknown as z.ZodType<Prisma.WorkflowExecutionWhereInput>;
export const WorkflowExecutionWhereInputObjectZodSchema = workflowexecutionwhereinputSchema;
