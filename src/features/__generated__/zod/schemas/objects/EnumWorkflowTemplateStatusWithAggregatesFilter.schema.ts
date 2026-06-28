import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { NestedEnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema as NestedEnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema } from './NestedEnumWorkflowTemplateStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWorkflowTemplateStatusFilterObjectSchema as NestedEnumWorkflowTemplateStatusFilterObjectSchema } from './NestedEnumWorkflowTemplateStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WorkflowTemplateStatusSchema.optional(),
  in: WorkflowTemplateStatusSchema.array().optional(),
  notIn: WorkflowTemplateStatusSchema.array().optional(),
  not: z.union([WorkflowTemplateStatusSchema, z.lazy(() => NestedEnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkflowTemplateStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkflowTemplateStatusFilterObjectSchema).optional()
}).strict();
export const EnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWorkflowTemplateStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowTemplateStatusWithAggregatesFilter>;
export const EnumWorkflowTemplateStatusWithAggregatesFilterObjectZodSchema = makeSchema();
