import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema';
import { NestedEnumWorkflowExecutionStatusFilterObjectSchema as NestedEnumWorkflowExecutionStatusFilterObjectSchema } from './NestedEnumWorkflowExecutionStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WorkflowExecutionStatusSchema.optional(),
  in: WorkflowExecutionStatusSchema.array().optional(),
  notIn: WorkflowExecutionStatusSchema.array().optional(),
  not: z.union([WorkflowExecutionStatusSchema, z.lazy(() => NestedEnumWorkflowExecutionStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumWorkflowExecutionStatusFilterObjectSchema: z.ZodType<Prisma.EnumWorkflowExecutionStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowExecutionStatusFilter>;
export const EnumWorkflowExecutionStatusFilterObjectZodSchema = makeSchema();
