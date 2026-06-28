import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWorkflowExecutionStatusFilterObjectSchema as NestedEnumWorkflowExecutionStatusFilterObjectSchema } from './NestedEnumWorkflowExecutionStatusFilter.schema'

const nestedenumworkflowexecutionstatuswithaggregatesfilterSchema = z.object({
  equals: WorkflowExecutionStatusSchema.optional(),
  in: WorkflowExecutionStatusSchema.array().optional(),
  notIn: WorkflowExecutionStatusSchema.array().optional(),
  not: z.union([WorkflowExecutionStatusSchema, z.lazy(() => NestedEnumWorkflowExecutionStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkflowExecutionStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkflowExecutionStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumWorkflowExecutionStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkflowExecutionStatusWithAggregatesFilter> = nestedenumworkflowexecutionstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkflowExecutionStatusWithAggregatesFilter>;
export const NestedEnumWorkflowExecutionStatusWithAggregatesFilterObjectZodSchema = nestedenumworkflowexecutionstatuswithaggregatesfilterSchema;
