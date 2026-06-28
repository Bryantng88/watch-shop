import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { NestedEnumWorkflowTemplateStatusFilterObjectSchema as NestedEnumWorkflowTemplateStatusFilterObjectSchema } from './NestedEnumWorkflowTemplateStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WorkflowTemplateStatusSchema.optional(),
  in: WorkflowTemplateStatusSchema.array().optional(),
  notIn: WorkflowTemplateStatusSchema.array().optional(),
  not: z.union([WorkflowTemplateStatusSchema, z.lazy(() => NestedEnumWorkflowTemplateStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumWorkflowTemplateStatusFilterObjectSchema: z.ZodType<Prisma.EnumWorkflowTemplateStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowTemplateStatusFilter>;
export const EnumWorkflowTemplateStatusFilterObjectZodSchema = makeSchema();
