import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema'

const nestedenumworkflowtemplatestatusfilterSchema = z.object({
  equals: WorkflowTemplateStatusSchema.optional(),
  in: WorkflowTemplateStatusSchema.array().optional(),
  notIn: WorkflowTemplateStatusSchema.array().optional(),
  not: z.union([WorkflowTemplateStatusSchema, z.lazy(() => NestedEnumWorkflowTemplateStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWorkflowTemplateStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkflowTemplateStatusFilter> = nestedenumworkflowtemplatestatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkflowTemplateStatusFilter>;
export const NestedEnumWorkflowTemplateStatusFilterObjectZodSchema = nestedenumworkflowtemplatestatusfilterSchema;
