import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWorkflowTemplateStatusFilterObjectSchema as NestedEnumWorkflowTemplateStatusFilterObjectSchema } from './NestedEnumWorkflowTemplateStatusFilter.schema'

const nestedenumworkflowtemplatestatuswithaggregatesfilterSchema = z.object({
  equals: WorkflowTemplateStatusSchema.optional(),
  in: WorkflowTemplateStatusSchema.array().optional(),
  notIn: WorkflowTemplateStatusSchema.array().optional(),
  not: z.union([WorkflowTemplateStatusSchema, z.lazy(() => NestedEnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkflowTemplateStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkflowTemplateStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkflowTemplateStatusWithAggregatesFilter> = nestedenumworkflowtemplatestatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkflowTemplateStatusWithAggregatesFilter>;
export const NestedEnumWorkflowTemplateStatusWithAggregatesFilterObjectZodSchema = nestedenumworkflowtemplatestatuswithaggregatesfilterSchema;
