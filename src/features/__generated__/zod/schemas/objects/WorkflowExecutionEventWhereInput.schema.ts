import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WorkflowExecutionScalarRelationFilterObjectSchema as WorkflowExecutionScalarRelationFilterObjectSchema } from './WorkflowExecutionScalarRelationFilter.schema';
import { WorkflowExecutionWhereInputObjectSchema as WorkflowExecutionWhereInputObjectSchema } from './WorkflowExecutionWhereInput.schema'

const workflowexecutioneventwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowExecutionEventWhereInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowExecutionEventWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowExecutionEventWhereInputObjectSchema), z.lazy(() => WorkflowExecutionEventWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  executionId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventLogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  execution: z.union([z.lazy(() => WorkflowExecutionScalarRelationFilterObjectSchema), z.lazy(() => WorkflowExecutionWhereInputObjectSchema)]).optional()
}).strict();
export const WorkflowExecutionEventWhereInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventWhereInput> = workflowexecutioneventwhereinputSchema as unknown as z.ZodType<Prisma.WorkflowExecutionEventWhereInput>;
export const WorkflowExecutionEventWhereInputObjectZodSchema = workflowexecutioneventwhereinputSchema;
