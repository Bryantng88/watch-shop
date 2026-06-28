import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema';
import { NestedEnumWorkflowActionTypeFilterObjectSchema as NestedEnumWorkflowActionTypeFilterObjectSchema } from './NestedEnumWorkflowActionTypeFilter.schema'

const makeSchema = () => z.object({
  equals: WorkflowActionTypeSchema.optional(),
  in: WorkflowActionTypeSchema.array().optional(),
  notIn: WorkflowActionTypeSchema.array().optional(),
  not: z.union([WorkflowActionTypeSchema, z.lazy(() => NestedEnumWorkflowActionTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumWorkflowActionTypeFilterObjectSchema: z.ZodType<Prisma.EnumWorkflowActionTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowActionTypeFilter>;
export const EnumWorkflowActionTypeFilterObjectZodSchema = makeSchema();
