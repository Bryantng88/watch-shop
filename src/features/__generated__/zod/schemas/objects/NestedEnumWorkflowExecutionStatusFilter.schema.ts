import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema'

const nestedenumworkflowexecutionstatusfilterSchema = z.object({
  equals: WorkflowExecutionStatusSchema.optional(),
  in: WorkflowExecutionStatusSchema.array().optional(),
  notIn: WorkflowExecutionStatusSchema.array().optional(),
  not: z.union([WorkflowExecutionStatusSchema, z.lazy(() => NestedEnumWorkflowExecutionStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWorkflowExecutionStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkflowExecutionStatusFilter> = nestedenumworkflowexecutionstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkflowExecutionStatusFilter>;
export const NestedEnumWorkflowExecutionStatusFilterObjectZodSchema = nestedenumworkflowexecutionstatusfilterSchema;
